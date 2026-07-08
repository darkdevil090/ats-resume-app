import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  BookOpen,
  Plus,
  RefreshCw,
  FolderOpen,
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import { ResumeData, DOMAINS, DEFAULT_TEMPLATES, DomainType, ATSAnalysisResult, ATSImprovement } from "./types";
import { ResumePreview } from "./components/ResumePreview";
import { ResumeForm } from "./components/ResumeForm";
import { ATSScoreDashboard } from "./components/ATSScoreDashboard";
import { MobileSimulatorFrame } from "./components/MobileSimulatorFrame";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { exportResumeToDocx } from "./lib/docxExport";

export default function App() {
  // Domain selection
  const [selectedDomain, setSelectedDomain] = useState<DomainType>("btech");
  
  // Active Resume Builder Data (defaults to selected domain template)
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_TEMPLATES.btech);

  // Interface view: "builder" (Interactive Builder) or "upload" (External File Upload)
  const [activeTab, setActiveTab] = useState<"builder" | "upload">("builder");

  // Output view: "preview" (Paper Preview), "mobile" (Cross-Platform Mobile), "analysis" (AI Scorecard)
  const [outputTab, setOutputTab] = useState<"preview" | "mobile" | "analysis">("preview");

  // File scanning states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileBase64, setUploadedFileBase64] = useState<{
    data: string;
    mimeType: string;
    name: string;
  } | null>(null);
  const [manualText, setManualText] = useState<string>("");

  // API scanning feedback
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationSuccess, setOptimizationSuccess] = useState<string | null>(null);

  const resumeRef = useRef<HTMLDivElement>(null);

  // Apply a single improvement's suggested rewrite in-place
  const applySingleSuggestion = (imp: ATSImprovement) => {
    const before = imp.exampleBefore?.trim();
    const after = imp.exampleAfter?.trim();

    if (!before || !after) {
      alert("No valid rewrite template found for this suggestion.");
      return;
    }

    let foundAndReplaced = false;

    setResumeData(prev => {
      const updated = JSON.parse(JSON.stringify(prev)); // Deep clone to avoid mutations

      // 1. Try Summary
      if (updated.summary.includes(before)) {
        updated.summary = updated.summary.replace(before, after);
        foundAndReplaced = true;
      } else {
        const summaryIdx = updated.summary.toLowerCase().indexOf(before.toLowerCase());
        if (summaryIdx !== -1) {
          updated.summary = updated.summary.slice(0, summaryIdx) + after + updated.summary.slice(summaryIdx + before.length);
          foundAndReplaced = true;
        }
      }

      // 2. Try Experience bullets
      updated.experience = updated.experience.map((exp: any) => {
        const newBullets = exp.bullets.map((b: string) => {
          if (b.includes(before)) {
            foundAndReplaced = true;
            return b.replace(before, after);
          }
          const idx = b.toLowerCase().indexOf(before.toLowerCase());
          if (idx !== -1) {
            foundAndReplaced = true;
            return b.slice(0, idx) + after + b.slice(idx + before.length);
          }
          return b;
        });
        return { ...exp, bullets: newBullets };
      });

      // 3. Try Project bullets
      updated.projects = updated.projects.map((proj: any) => {
        const newBullets = proj.bullets.map((b: string) => {
          if (b.includes(before)) {
            foundAndReplaced = true;
            return b.replace(before, after);
          }
          const idx = b.toLowerCase().indexOf(before.toLowerCase());
          if (idx !== -1) {
            foundAndReplaced = true;
            return b.slice(0, idx) + after + b.slice(idx + before.length);
          }
          return b;
        });
        return { ...proj, bullets: newBullets };
      });

      // 4. Try Education details
      updated.education = updated.education.map((edu: any) => {
        if (edu.details.includes(before)) {
          foundAndReplaced = true;
          return { ...edu, details: edu.details.replace(before, after) };
        }
        const idx = edu.details.toLowerCase().indexOf(before.toLowerCase());
        if (idx !== -1) {
          foundAndReplaced = true;
          return { ...edu, details: edu.details.slice(0, idx) + after + edu.details.slice(idx + before.length) };
        }
        return edu;
      });

      // 5. Try Skills list
      const skillIdx = updated.skills.findIndex((s: string) => s.toLowerCase() === before.toLowerCase());
      if (skillIdx !== -1) {
        updated.skills[skillIdx] = after;
        foundAndReplaced = true;
      }

      // Fallback matching logic for section names if original substring is not found
      if (!foundAndReplaced) {
        const lowerSection = imp.section.toLowerCase();
        if (lowerSection.includes("summary")) {
          updated.summary = after;
          foundAndReplaced = true;
        } else if (lowerSection.includes("skills")) {
          const newSkills = after.split(/[,;]+/).map((s: string) => s.trim()).filter(Boolean);
          updated.skills = Array.from(new Set([...updated.skills, ...newSkills]));
          foundAndReplaced = true;
        } else if (lowerSection.includes("experience") && updated.experience.length > 0) {
          updated.experience[0].bullets = [...updated.experience[0].bullets, after];
          foundAndReplaced = true;
        } else if (lowerSection.includes("project") && updated.projects.length > 0) {
          updated.projects[0].bullets = [...updated.projects[0].bullets, after];
          foundAndReplaced = true;
        } else if (lowerSection.includes("certif")) {
          updated.certifications = Array.from(new Set([...updated.certifications, after]));
          foundAndReplaced = true;
        }
      }

      return updated;
    });

    if (foundAndReplaced) {
      setOptimizationSuccess(`Applied fix for: "${imp.issue}"!`);
      // Auto-clear success state
      setTimeout(() => setOptimizationSuccess(null), 4000);
    } else {
      // Direct insertion fallback if we couldn't replace
      setResumeData(prev => {
        const updated = JSON.parse(JSON.stringify(prev));
        const lowerSection = imp.section.toLowerCase();
        if (lowerSection.includes("skills")) {
          updated.skills.push(after);
        } else if (updated.experience.length > 0) {
          updated.experience[0].bullets.push(after);
        } else {
          updated.summary = after;
        }
        return updated;
      });
      setOptimizationSuccess(`Added suggestion as a new bullet point under ${imp.section}!`);
      setTimeout(() => setOptimizationSuccess(null), 4000);
    }
  };

  // call /api/optimize-resume to generate a fully re-drafted resume using AI
  const handleApplyAllSuggestions = async () => {
    if (!analysisResult) return;
    setIsOptimizing(true);
    setApiError(null);
    setOptimizationSuccess(null);

    try {
      const payload = {
        resumeData,
        improvements: analysisResult.improvements,
        missingKeywords: analysisResult.missingKeywords,
        domain: DOMAINS[selectedDomain].name,
      };

      const response = await fetch("/api/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to draft optimized resume");
      }

      // Load fully optimized draft
      setResumeData(data);
      setOptimizationSuccess("🎉 Success! Gemini has drafted a fully ATS-optimized version with all suggestions applied!");
      
      // Auto switch back to Paper Preview tab so user can marvel at the redesigned layout!
      setOutputTab("preview");

      // Auto-clear success banner
      setTimeout(() => setOptimizationSuccess(null), 8000);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Failed to auto-apply optimizations. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Keep template state sync'd when switching domains unless edited
  const handleDomainChange = (domain: DomainType) => {
    setSelectedDomain(domain);
    setResumeData(DEFAULT_TEMPLATES[domain]);
    // Reset analysis result when switching domains
    setAnalysisResult(null);
  };

  // Process file upload on the client
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setApiError(null);
    const reader = new FileReader();

    if (file.type === "text/plain") {
      reader.onload = (event) => {
        setManualText(event.target?.result as string);
        setUploadedFileBase64(null);
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      reader.onload = () => {
        const base64Data = (reader.result as string).split(",")[1];
        setUploadedFileBase64({
          data: base64Data,
          mimeType: file.type,
          name: file.name
        });
        setManualText("");
      };
      reader.readAsDataURL(file);
    } else {
      setApiError("Unsupported file format. Please upload PDF, TXT, or images.");
    }
  };

  // Drag and drop uploader
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const inputEl = document.getElementById("file-upload-input") as HTMLInputElement;
      if (inputEl) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputEl.files = dataTransfer.files;
        // Trigger manually
        const event = { target: { files: dataTransfer.files } } as any;
        handleFileUpload(event);
      }
    }
  };

  // Convert rich resume builder data to raw string for scanner input
  const serializeResumeToText = (data: ResumeData): string => {
    let text = `Name: ${data.contact.name}\nEmail: ${data.contact.email}\nPhone: ${data.contact.phone}\nLocation: ${data.contact.location}\nLinkedIn: ${data.contact.linkedin}\nPortfolio: ${data.contact.portfolio}\n\n`;
    text += `Professional Summary:\n${data.summary}\n\n`;
    text += `Work Experience:\n`;
    data.experience.forEach((exp) => {
      text += `- Company: ${exp.company}, Role: ${exp.role}, Location: ${exp.location}, Dates: ${exp.startDate} to ${exp.endDate}\n`;
      exp.bullets.forEach((b) => {
        text += `  * ${b}\n`;
      });
    });
    text += `\nEducation:\n`;
    data.education.forEach((edu) => {
      text += `- Institution: ${edu.institution}, Degree: ${edu.degree}, Field: ${edu.fieldOfStudy}, Location: ${edu.location}, Date: ${edu.graduationDate}\n  Details: ${edu.details}\n`;
    });
    text += `\nSkills:\n${data.skills.join(", ")}\n\n`;
    text += `Projects:\n`;
    data.projects.forEach((proj) => {
      text += `- Name: ${proj.name}, Technologies: ${proj.technologies}, Link: ${proj.link}\n`;
      proj.bullets.forEach((b) => {
        text += `  * ${b}\n`;
      });
    });
    text += `\nCertifications:\n${data.certifications.join("\n")}\n`;
    return text;
  };

  // Perform AI ATS Scan
  const handleATSScan = async () => {
    setIsLoading(true);
    setApiError(null);
    setOutputTab("analysis"); // Shift user focus immediately to AI review

    try {
      let payload: any = {
        domain: DOMAINS[selectedDomain].name,
      };

      if (activeTab === "builder") {
        // Scan the active in-app resume builder data
        payload.resumeText = serializeResumeToText(resumeData);
      } else {
        // Scan uploaded external file
        if (uploadedFileBase64) {
          payload.resumeFile = uploadedFileBase64;
        } else if (manualText) {
          payload.resumeText = manualText;
        } else {
          throw new Error("Please upload a file or copy-paste text first.");
        }
      }

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to parse analysis");
      }

      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "An unexpected error occurred. Please try again.");
      setOutputTab("preview"); // Revert back to preview if scan failed
    } finally {
      setIsLoading(false);
    }
  };

  // PDF Export Mechanism
  const handlePDFExport = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);

    try {
      const element = resumeRef.current;
      
      // Perform rendering onto temporary canvas with higher resolution scale
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      // Create A4 PDF layout (A4 size is 595.28 x 841.89 pt)
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / pdfWidth;
      const imgHeight = canvasHeight / ratio;

      // Handle split multi-page height overflows gracefully
      if (imgHeight > pdfHeight) {
        let leftHeight = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
        leftHeight -= pdfHeight;

        while (leftHeight > 0) {
          position = leftHeight - imgHeight; // shift viewport
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
          leftHeight -= pdfHeight;
        }
      } else {
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight);
      }

      const fileName = `${resumeData.contact.name.trim().replace(/\s+/g, "_")}_ATS_Resume.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to export PDF programmatically. Please use standard print (Cmd+P / Ctrl+P) on browser instead.");
    } finally {
      setIsExporting(false);
    }
  };

  // Word DOCX Export Mechanism
  const handleDOCXExport = () => {
    try {
      const fileName = `${resumeData.contact.name.trim().replace(/\s+/g, "_")}_ATS_Resume.docx`;
      exportResumeToDocx(resumeData, fileName);
    } catch (err) {
      console.error("DOCX generation failed:", err);
      alert("Failed to export Word document. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col justify-between selection:bg-neutral-950 selection:text-white">
      
      {/* GLOBAL HEADER HEADER */}
      <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-40 px-4 sm:px-6 py-4 shadow-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-900 text-white rounded-xl flex items-center justify-center font-bold text-base tracking-wider shadow-sm border border-neutral-800">
              ATS
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-neutral-900 tracking-tight flex items-center gap-1.5">
                ATS COMPLIANCE SUITE <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200 font-mono font-bold">V1.5</span>
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                AI-Powered Cross-Platform Scan, Score Card & Resume Builder
              </p>
            </div>
          </div>

          {/* Quick Stats Summary */}
          {analysisResult && (
            <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-200/60 shadow-2xs">
              <span className="text-xs text-neutral-500 font-semibold font-mono uppercase tracking-wider">LATEST SCAN SCORE:</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-base font-extrabold font-mono ${
                  analysisResult.score >= 80 ? "text-emerald-600" : analysisResult.score >= 60 ? "text-amber-500" : "text-rose-600"
                }`}>
                  {analysisResult.score}/100
                </span>
                {analysisResult.isATSCompliant ? (
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Passed</span>
                ) : (
                  <span className="text-[9px] bg-amber-500/10 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">Fix Required</span>
                )}
              </div>
            </div>
          )}

        </div>
      </header>

      {/* OPTIMIZATION SUCCESS BANNER */}
      {optimizationSuccess && (
        <div className="bg-emerald-600 text-white px-6 py-3.5 text-center text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 animate-bounce no-print">
          <Sparkles size={16} />
          <span>{optimizationSuccess}</span>
          <button 
            onClick={() => setOptimizationSuccess(null)}
            className="ml-3 bg-white/20 hover:bg-white/30 text-white rounded px-2.5 py-0.5 text-[10px] font-mono cursor-pointer transition-colors"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* CORE WORKSPACE GRID */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        
        {/* LEFT COLUMN: BUILDER & SCANNER CONTROLS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 no-print">
          
          {/* STEP A: Industry / Domain Selector */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 font-mono uppercase">Step 01</span>
              <h2 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono">
                Select Target Career Domain
              </h2>
            </div>
            
            <p className="text-xs text-neutral-500 leading-relaxed">
              Our analyzer validates formatting, keyword frequencies, and quantitative metrics optimized for standard recruiters in your domain.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {Object.values(DOMAINS).map((dom) => (
                <button
                  key={dom.id}
                  onClick={() => handleDomainChange(dom.id as DomainType)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    selectedDomain === dom.id
                      ? "bg-neutral-900 border-neutral-900 text-white shadow-md shadow-neutral-900/10"
                      : "bg-neutral-50/60 hover:bg-neutral-50 border-neutral-200/60 text-neutral-800"
                  }`}
                >
                  <span className="text-xs font-bold">{dom.name}</span>
                  <span className={`text-[9px] mt-0.5 font-medium font-mono ${
                    selectedDomain === dom.id ? "text-neutral-300" : "text-neutral-500"
                  }`}>
                    {dom.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP B: Interactive Mode Switcher (Form Builder vs File Upload) */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-400 font-mono">Step 02</span>
                <h2 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono">
                  Input Resume Content
                </h2>
              </div>
              
              {/* Selector Tabs */}
              <div className="flex p-0.5 bg-neutral-100 rounded-lg border border-neutral-200">
                <button
                  onClick={() => setActiveTab("builder")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    activeTab === "builder" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    activeTab === "upload" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {activeTab === "builder" ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2.5 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100 text-xs text-neutral-600 leading-relaxed">
                  <Sparkles size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-800">Domain-specific Template Loaded:</strong> Fill in your professional milestones inside our ATS-optimized structural form below. Your live draft renders on the right pane in real-time.
                  </div>
                </div>

                <ResumeForm data={resumeData} onChange={setResumeData} />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Drag and Drop Box */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-neutral-200 hover:border-neutral-900 transition-colors bg-neutral-50/50 rounded-2xl p-6 text-center space-y-2.5 group cursor-pointer relative"
                >
                  <input
                    type="file"
                    id="file-upload-input"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.txt,image/*"
                    onChange={handleFileUpload}
                  />
                  
                  <div className="w-10 h-10 bg-white border border-neutral-200 rounded-xl flex items-center justify-center mx-auto shadow-xs group-hover:scale-105 transition-transform">
                    <Upload size={18} className="text-neutral-600" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-neutral-800">
                      Upload Resume file
                    </span>
                    <span className="block text-[10px] text-neutral-400 font-medium font-mono mt-0.5">
                      Accepts PDF, TXT, or JPEG/PNG Images
                    </span>
                  </div>
                </div>

                {selectedFile && (
                  <div className="bg-neutral-900 text-white p-3 rounded-xl flex items-center justify-between border border-neutral-800 shadow-sm text-xs">
                    <div className="flex items-center gap-2 overflow-hidden truncate">
                      <FileText size={16} className="text-neutral-400 flex-shrink-0" />
                      <span className="font-bold truncate">{selectedFile.name}</span>
                    </div>
                    <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-600">
                    Or Copy & Paste Plain Text CV directly:
                  </label>
                  <textarea
                    className="w-full h-32 text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors resize-none font-mono"
                    value={manualText}
                    onChange={(e) => {
                      setManualText(e.target.value);
                      setSelectedFile(null);
                      setUploadedFileBase64(null);
                    }}
                    placeholder="PASTE YOUR RAW RESUME TEXT HERE..."
                  />
                </div>
              </div>
            )}

            {/* SCANNING TRIGGER BUTTON */}
            <div className="pt-2 border-t border-neutral-100">
              <button
                onClick={handleATSScan}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-300 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-mono transition-colors shadow-md"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    AI Analyzing Resume Compliance...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Scan & Critic with AI
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PREVIEW & CRITIC FEEDBACK (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Output Selector Header Panel */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-3 shadow-sm flex items-center justify-between no-print">
            {/* View selectors */}
            <div className="flex gap-1.5 p-0.5 bg-neutral-100 rounded-xl border border-neutral-200/60 text-xs">
              <button
                onClick={() => setOutputTab("preview")}
                className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  outputTab === "preview"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                <FileText size={14} /> Paper Preview
              </button>
              <button
                onClick={() => setOutputTab("mobile")}
                className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  outputTab === "mobile"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                <Smartphone size={14} /> Mobile App Skin
              </button>
              <button
                onClick={() => setOutputTab("analysis")}
                className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all relative ${
                  outputTab === "analysis"
                    ? "bg-white text-neutral-900 shadow-xs"
                    : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                <Sparkles size={14} className="text-amber-500" /> AI Scorecard
                {analysisResult && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
            </div>

            {/* Actions: Save / PDF & DOCX download */}
            {outputTab === "preview" && (
              <div className="flex gap-2">
                <button
                  onClick={handleDOCXExport}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 px-3.5 py-1.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                  title="Export a clean Microsoft Word (.docx) file perfect for ATS parsers"
                >
                  <FileText size={13} />
                  Export Word (DOCX)
                </button>
                <button
                  onClick={handlePDFExport}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 bg-white border border-neutral-200 hover:bg-neutral-50 px-3.5 py-1.5 rounded-xl transition-colors shadow-2xs cursor-pointer"
                  title="Export a visual PDF layout of this resume"
                >
                  {isExporting ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Download size={13} />
                  )}
                  Export PDF
                </button>
              </div>
            )}
          </div>

          {/* API ERROR CONTAINER */}
          {apiError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-2.5 text-xs">
              <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Analysis Failed</strong>
                {apiError}
              </div>
            </div>
          )}

          {/* RENDER ACTIVE TAB VIEW */}
          <div className="min-h-[500px]">
            {outputTab === "preview" && (
              <div className="space-y-4">
                <div className="bg-white/40 border border-neutral-200/60 p-4 rounded-2xl flex items-center gap-3 text-xs text-neutral-500 leading-relaxed no-print">
                  <Info size={16} className="text-neutral-400 flex-shrink-0" />
                  <p>
                    Below is the live rendering of your ATS resume. This is the exact layout parsed by the AI. Use <strong>Export PDF</strong> to download it as a professional single-column document.
                  </p>
                </div>
                
                {/* Embedded paper rendering wrapper */}
                <div className="overflow-x-auto p-1 bg-neutral-200/35 rounded-2xl border border-neutral-200/70 shadow-inner">
                  <ResumePreview ref={resumeRef} data={resumeData} />
                </div>
              </div>
            )}

            {outputTab === "mobile" && (
              <div className="space-y-4">
                <div className="bg-white/40 border border-neutral-200/60 p-4 rounded-2xl flex items-center gap-3 text-xs text-neutral-500 leading-relaxed text-center justify-center">
                  <Smartphone size={16} className="text-neutral-400 flex-shrink-0" />
                  <p>
                    See how your resume formats as a digital career card inside a simulated <strong>iOS (Apple)</strong> vs <strong>Android (Material)</strong> ecosystem.
                  </p>
                </div>

                <MobileSimulatorFrame data={resumeData} domainName={DOMAINS[selectedDomain].name} />
              </div>
            )}

            {outputTab === "analysis" && (
              <div className="space-y-4">
                {!analysisResult && !isLoading && (
                  <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center space-y-4">
                    <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center mx-auto">
                      <Sparkles size={20} className="text-amber-500 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-neutral-800">No Active ATS Analysis</h4>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                        Please click the <strong>Scan & Critic with AI</strong> button in the left panel to scan your current draft and compute your scorecard.
                      </p>
                    </div>
                    <button
                      onClick={handleATSScan}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 px-4 py-2 rounded-xl transition-all font-mono uppercase"
                    >
                      Scan Now <ArrowRight size={12} />
                    </button>
                  </div>
                )}

                {(analysisResult || isLoading) && (
                  <ATSScoreDashboard
                    result={analysisResult!}
                    isLoading={isLoading}
                    onApplySingleSuggestion={applySingleSuggestion}
                    onApplyAllSuggestions={handleApplyAllSuggestions}
                    isApplyingOptimization={isOptimizing}
                  />
                )}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-neutral-200/80 py-6 px-4 text-center text-xs text-neutral-400 font-mono tracking-wide mt-12 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>© 2026 ATS COMPLIANCE SUITE — BUILT FOR EXECUTIVE PARSING RECOGNITION</span>
          <div className="flex gap-4">
            <span className="hover:text-neutral-600 cursor-pointer">PRIVACY RULES</span>
            <span>•</span>
            <span className="hover:text-neutral-600 cursor-pointer">ATS ALIGNMENT STANDARDS</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
