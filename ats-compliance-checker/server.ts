import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper function to call Gemini with robust retry and model fallback logic
async function generateContentWithRetryAndFallback(options: {
  contents: any[];
  config: any;
}) {
  const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-pro-preview"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[Gemini API] Attempting generateContent with model="${model}"...`);
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      console.log(`[Gemini API] Successfully completed with model="${model}"`);
      return response;
    } catch (err: any) {
      lastError = err;
      const status = err.status || (err.error && err.error.code);
      const isRateLimit = status === 429 || (err.message && (err.message.includes("429") || err.message.includes("quota") || err.message.includes("RESOURCE_EXHAUSTED") || err.message.includes("Rate limit")));
      const isUnavailable = status === 503 || (err.message && (err.message.includes("503") || err.message.includes("high demand") || err.message.includes("UNAVAILABLE")));

      console.error(`[Gemini API] Error using model="${model}": status=${status}, isRateLimit=${isRateLimit}, isUnavailable=${isUnavailable}, message="${err.message || err}"`);

      // If it is a rate limit or service unavailable, we log it and try the next model
      // since separate models have independent rate limit and daily quota pools.
      console.log(`[Gemini API] Model "${model}" failed (rate-limited or unavailable). Trying next fallback model...`);
    }
  }

  throw lastError || new Error("All Gemini API models are currently busy or unavailable. Please try again in a few moments.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set limits for base64 file uploads (PDF, images, etc.)
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // API Route for healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Route for Resume Analysis
  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const { resumeText, resumeFile, domain } = req.body;

      if (!resumeText && (!resumeFile || !resumeFile.data)) {
        return res.status(400).json({ error: "No resume text or file provided." });
      }

      // Check if API Key is available
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured in the environment. Please add it in Settings > Secrets.",
        });
      }

      const contents: any[] = [];

      // Add file attachment if provided
      if (resumeFile && resumeFile.data && resumeFile.mimeType) {
        contents.push({
          inlineData: {
            mimeType: resumeFile.mimeType,
            data: resumeFile.data, // base64 string
          },
        });
      }

      // Prepare system instruction
      const systemInstruction = `You are an elite Applicant Tracking System (ATS) parsing scanner and expert executive resume writer.
Your job is to thoroughly analyze resumes for ATS compliance, format compatibility, domain-specific keywords, actionable verbs, and overall visual scanability.
Analyze the resume based on the chosen target domain: "${domain || "General"}".
Provide deep, highly actionable, structured feedback.

CRITICAL REVIEW GUIDELINES:
1. KEYWORD OPTIMIZATION: Check for domain-specific skills and terms. Warn against raw "keyword stuffing" (lists of skills without context). Ensure keywords are woven naturally into context-rich accomplishment bullets. Identify critical gaps and present technical skills.
2. SENTENCE STRUCTURE & IMPACT: Audit bullet points for passive responsibility-based phrases (e.g., "Responsible for writing code", "Assisted in management"). Insist on achievement-oriented statements using the Google X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]". Check for active verbs at the start of each bullet point.
3. JARGON & BUZZWORD CONTROL: Identify and flag fluff buzzwords (e.g., "team player", "dynamic leader", "results-driven", "go-getter", "hard worker", "synergy", "think outside the box"). Advise replacing them with solid, evidence-backed metrics or precise technical terms.
4. FORMATTING BEST PRACTICES: Check for layout obstacles. Highlight risks like complex multi-column tables, text boxes (which ATS often skips), non-standard section titles, visual graphics (such as rating sliders/charts for skills), and non-standard contact headers.

You must return the analysis strictly in JSON format. Ensure all suggestions are real and specific to the input resume content rather than generic templates. Provide concrete examples of how to rewrite phrases.`;

      // Prepare prompt
      const promptText = `Please analyze the attached resume.
Target Domain / Industry Alignment: ${domain || "General"}
${resumeText ? `\n--- Resume Copy-Pasted Text ---\n${resumeText}\n--- End Copy-Pasted Text ---\n` : ""}

Evaluate the resume on Keyword Optimization, Sentence Structure (Google X-Y-Z metrics), Jargon/Buzzword check, and Formatting Obstacles.
Then, return a JSON object with this exact structure:
{
  "score": 0 to 100 number representing the ATS compatibility,
  "isATSCompliant": boolean (true if score >= 80, otherwise false),
  "summary": "High level brief overview of the CV's ATS health (2-3 sentences). Highlight major strengths and critical weaknesses.",
  "categories": {
    "keywords": { "score": 0-100, "feedback": "Evaluation of industry technical terms presence, keyword density, and whether skills are contextually integrated or just list stuffed." },
    "formatting": { "score": 0-100, "feedback": "Layout, section headers, font feedback. Specifically note if there are potential obstacles like columns, text boxes, or non-standard visual elements." },
    "experience": { "score": 0-100, "feedback": "Action verbs, quantitative impact, and sentence structure feedback. Advise on converting passive phrases to Google X-Y-Z metrics." },
    "skills": { "score": 0-100, "feedback": "Skill categorization, alignment rate with the domain, and fluff/jargon vs core hard skill ratio." },
    "structure": { "score": 0-100, "feedback": "Readability, contact details, standard format feedback. Check if details are easily parser-crawlable." }
  },
  "improvements": [
    {
      "section": "Name of section (e.g. Work Experience, Skills, Summary, Formatting, Keywords)",
      "issue": "Brief description of the problem (e.g., 'Passive responsibility phrase', 'Weak buzzword detected', 'No metrics', 'Double column table risk')",
      "suggestion": "Concrete description of the fix (e.g. 'Use Google X-Y-Z formula', 'Replace fluff with precise hard skill context', 'Reformat to clean single column text')",
      "exampleBefore": "Original phrase/style from resume, or general example if not present",
      "exampleAfter": "Perfect, ATS-optimized rewrite/fix using exact metrics or strong active terms"
    }
  ],
  "missingKeywords": ["List of critical industry keywords missing in this CV"],
  "presentKeywords": ["List of good industry keywords found in this CV"],
  "industryAlignment": {
    "matchRate": 0 to 100 percentage,
    "analysis": "Explanation of how well this CV is structured for a standard role in this domain"
  },
  "formattingChecks": [
    { "check": "Simple/Scan-friendly Layout", "passed": boolean, "details": "Explanation of column structure, tables, textboxes and parser obstacles" },
    { "check": "Standard Contact Details", "passed": boolean, "details": "Explanation of phone, email, LinkedIn, location presence" },
    { "check": "Standard Section Headings", "passed": boolean, "details": "Explanation of headers like 'Education', 'Work Experience' vs non-standard ones" },
    { "check": "Standard Fonts & Sizes", "passed": boolean, "details": "Check for simple, clean typography" },
    { "check": "No Visual Graphics/Charts", "passed": boolean, "details": "Verify there are no bar charts for skills, icons, or complex SVGs that disrupt parsers" }
  ]
}`;

      contents.push({ text: promptText });

      // Call Gemini using the retry and fallback helper
      const response = await generateContentWithRetryAndFallback({
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              isATSCompliant: { type: Type.BOOLEAN },
              summary: { type: Type.STRING },
              categories: {
                type: Type.OBJECT,
                properties: {
                  keywords: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.INTEGER },
                      feedback: { type: Type.STRING },
                    },
                    required: ["score", "feedback"],
                  },
                  formatting: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.INTEGER },
                      feedback: { type: Type.STRING },
                    },
                    required: ["score", "feedback"],
                  },
                  experience: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.INTEGER },
                      feedback: { type: Type.STRING },
                    },
                    required: ["score", "feedback"],
                  },
                  skills: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.INTEGER },
                      feedback: { type: Type.STRING },
                    },
                    required: ["score", "feedback"],
                  },
                  structure: {
                    type: Type.OBJECT,
                    properties: {
                      score: { type: Type.INTEGER },
                      feedback: { type: Type.STRING },
                    },
                    required: ["score", "feedback"],
                  },
                },
                required: ["keywords", "formatting", "experience", "skills", "structure"],
              },
              improvements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    section: { type: Type.STRING },
                    issue: { type: Type.STRING },
                    suggestion: { type: Type.STRING },
                    exampleBefore: { type: Type.STRING },
                    exampleAfter: { type: Type.STRING },
                  },
                  required: ["section", "issue", "suggestion", "exampleBefore", "exampleAfter"],
                },
              },
              missingKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              presentKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              industryAlignment: {
                type: Type.OBJECT,
                properties: {
                  matchRate: { type: Type.INTEGER },
                  analysis: { type: Type.STRING },
                },
                required: ["matchRate", "analysis"],
              },
              formattingChecks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    check: { type: Type.STRING },
                    passed: { type: Type.BOOLEAN },
                    details: { type: Type.STRING },
                  },
                  required: ["check", "passed", "details"],
                },
              },
            },
            required: [
              "score",
              "isATSCompliant",
              "summary",
              "categories",
              "improvements",
              "missingKeywords",
              "presentKeywords",
              "industryAlignment",
              "formattingChecks",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text received from Gemini.");
      }

      // Parse the JSON output
      const resultData = JSON.parse(responseText.trim());
      res.json(resultData);
    } catch (error: any) {
      console.error("Resume analysis error:", error);
      res.status(500).json({
        error: "Failed to analyze resume. Please try again.",
        details: error.message || error,
      });
    }
  });

  // API Route for Auto-Drafting Optimized Resume
  app.post("/api/optimize-resume", async (req, res) => {
    try {
      const { resumeData, improvements, missingKeywords, domain } = req.body;

      if (!resumeData) {
        return res.status(400).json({ error: "No resume data provided." });
      }

      // Check if API Key is available
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured in the environment. Please add it in Settings > Secrets.",
        });
      }

      const systemInstruction = `You are an elite, professional career consultant and expert Resume Rewriter specializing in ATS (Applicant Tracking System) optimization.
Your job is to rewrite the input resume data into a highly polished, professional, ATS-compliant version.

CRITICAL REWRITING STANDARDS:
1. IMPLEMENT SUGGESTED IMPROVEMENTS: Review the provided ATS analysis improvements and apply them perfectly to the respective sections. Replace weak phrasing with the optimized suggestions.
2. WEAVE IN MISSING KEYWORDS: Naturally integrate the missing keywords list into the professional experience bullets, projects, or skills section. Do NOT just dump them in a list; contextualize them using active phrasing.
3. GOOGLE X-Y-Z ACHIEVEMENT FORMULA: Rewrite passive responsibility bullets (e.g. "Responsible for...") into accomplishment statements using the Google formula: "Accomplished [X] as measured by [Y], by doing [Z]". Always include quantifiable metrics and results where possible.
4. JARGON & BUZZWORD REMOVAL: Remove useless fluff like "results-driven, dynamic team player, hard worker". Replace with hard metrics, action verbs, and core technologies.
5. KEEP CORE INFORMATION intact: Maintain real companies, universities, names, locations, and dates. Do not invent fictitious credentials. Keep the IDs of the experience, education, and projects identical to the input.
6. Return the updated content strictly according to the requested JSON Schema. No markdown wrapping.`;

      const promptText = `Please rewrite and optimize this resume based on the following context.

Target Domain: ${domain || "General"}

Original Resume Data:
${JSON.stringify(resumeData, null, 2)}

ATS Compliance Analysis/Improvements to Apply:
${JSON.stringify(improvements || [], null, 2)}

Missing Industry Keywords to Integrate:
${JSON.stringify(missingKeywords || [], null, 2)}`;

      // Call Gemini using the retry and fallback helper
      const response = await generateContentWithRetryAndFallback({
        contents: [{ text: promptText }],
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              contact: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  portfolio: { type: Type.STRING },
                },
                required: ["name", "email", "phone", "location", "linkedin", "portfolio"],
              },
              summary: { type: Type.STRING },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    bullets: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["id", "company", "role", "location", "startDate", "endDate", "bullets"],
                },
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    fieldOfStudy: { type: Type.STRING },
                    location: { type: Type.STRING },
                    graduationDate: { type: Type.STRING },
                    details: { type: Type.STRING },
                  },
                  required: ["id", "institution", "degree", "fieldOfStudy", "location", "graduationDate", "details"],
                },
              },
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    technologies: { type: Type.STRING },
                    link: { type: Type.STRING },
                    bullets: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["id", "name", "technologies", "link", "bullets"],
                },
              },
              certifications: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["contact", "summary", "experience", "education", "skills", "projects", "certifications"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text received from Gemini.");
      }

      const resultData = JSON.parse(responseText.trim());
      res.json(resultData);
    } catch (error: any) {
      console.error("Resume optimization error:", error);
      res.status(500).json({
        error: "Failed to optimize resume. Please try again.",
        details: error.message || error,
      });
    }
  });

  // Serve static files or Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || "development"})`);
  });
}

startServer();
