export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationInfo {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  graduationDate: string;
  details: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  technologies: string;
  link: string;
  bullets: string[];
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: WorkExperience[];
  education: EducationInfo[];
  skills: string[];
  projects: ProjectInfo[];
  certifications: string[];
}

export interface ATSFeedbackCategory {
  score: number;
  feedback: string;
}

export interface ATSImprovement {
  section: string;
  issue: string;
  suggestion: string;
  exampleBefore: string;
  exampleAfter: string;
}

export interface ATSFormattingCheck {
  check: string;
  passed: boolean;
  details: string;
}

export interface ATSAnalysisResult {
  score: number;
  isATSCompliant: boolean;
  summary: string;
  categories: {
    keywords: ATSFeedbackCategory;
    formatting: ATSFeedbackCategory;
    experience: ATSFeedbackCategory;
    skills: ATSFeedbackCategory;
    structure: ATSFeedbackCategory;
  };
  improvements: ATSImprovement[];
  missingKeywords: string[];
  presentKeywords: string[];
  industryAlignment: {
    matchRate: number;
    analysis: string;
  };
  formattingChecks: ATSFormattingCheck[];
}

export type DomainType = "btech" | "mba" | "ca" | "professor";

export interface DomainConfig {
  id: DomainType;
  name: string;
  title: string;
  badge: string;
  color: string;
  keywords: string[];
}

export const DOMAINS: Record<DomainType, DomainConfig> = {
  btech: {
    id: "btech",
    name: "B.Tech (Software & IT)",
    title: "Software Engineer",
    badge: "Tech & Systems",
    color: "emerald",
    keywords: [
      "React", "Node.js", "TypeScript", "System Design", "Scalability", "AWS", 
      "CI/CD", "Docker", "Kubernetes", "Database Optimization", "Git", "REST APIs"
    ],
  },
  mba: {
    id: "mba",
    name: "MBA (Business & Exec)",
    title: "Business Development Manager",
    badge: "Strategy & Operations",
    color: "blue",
    keywords: [
      "Revenue Growth", "Cross-Functional Leadership", "Strategic Planning", 
      "ROI Optimization", "Agile Management", "Market Expansion", "Budgeting", "KPIs"
    ],
  },
  ca: {
    id: "ca",
    name: "CA (Finance & Audit)",
    title: "Senior Chartered Accountant",
    badge: "Finance & Advisory",
    color: "amber",
    keywords: [
      "Financial Auditing", "Tax Compliance", "Cost Optimization", "IFRS", 
      "Risk Mitigation", "GAAP", "Balance Sheet Analysis", "Internal Controls", "Advisory"
    ],
  },
  professor: {
    id: "professor",
    name: "Professor (Academia)",
    title: "Assistant Professor",
    badge: "Research & Teaching",
    color: "violet",
    keywords: [
      "Curriculum Design", "Peer-Reviewed Publications", "Student Mentorship", 
      "Grant Acquisition", "Pedagogical Theory", "Academic Lectures", "Syllabus Creation"
    ],
  },
};

export const DEFAULT_TEMPLATES: Record<DomainType, ResumeData> = {
  btech: {
    contact: {
      name: "Siddharth Sharma",
      email: "siddharth.dev@gmail.com",
      phone: "+91 98765 43210",
      location: "Bengaluru, India",
      linkedin: "linkedin.com/in/siddharth-sharma",
      portfolio: "siddharth.dev",
    },
    summary: "Detail-oriented Software Engineer with over 4 years of experience building and deploying scalable web applications. Expert in TypeScript, React, and Node.js. Proven track record of optimizing page load times and reducing server-side latency under high concurrent load.",
    experience: [
      {
        id: "exp1",
        company: "TechNexus Solutions",
        role: "Senior Software Engineer",
        location: "Bengaluru, India",
        startDate: "2023-01",
        endDate: "Present",
        bullets: [
          "Architected responsive micro-frontends with React and TypeScript, accelerating dashboard load performance by 42%.",
          "Engineered Node.js backend services serving 150k+ daily active users with 99.9% uptime using AWS Auto Scaling.",
          "Implemented robust CI/CD deployment pipelines, cutting manual build cycles and release times by 35%."
        ]
      },
      {
        id: "exp2",
        company: "CloudVibe Systems",
        role: "Software Developer",
        location: "Pune, India",
        startDate: "2021-06",
        endDate: "2022-12",
        bullets: [
          "Developed core features for e-commerce platforms, boosting checkout completion rates by 18%.",
          "Optimized slow PostgreSQL database queries, reducing average API response payload latency from 320ms to 95ms."
        ]
      }
    ],
    education: [
      {
        id: "edu1",
        institution: "Indian Institute of Technology (IIT)",
        degree: "Bachelor of Technology (B.Tech)",
        fieldOfStudy: "Computer Science & Engineering",
        location: "Kanpur, India",
        graduationDate: "2021-05",
        details: "GPA: 9.1/10.0. Core areas: Algorithms, System Architecture, Database Systems."
      }
    ],
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "REST APIs", "CI/CD", "System Design"],
    projects: [
      {
        id: "proj1",
        name: "EcoScale Serverless Proxy",
        technologies: "Node.js, AWS Lambda, Redis",
        link: "github.com/siddharth/ecoscale",
        bullets: [
          "Created a lightweight API caching proxy that decreased external billing costs by $1,200 per month.",
          "Utilized Redis cache invalidation layers to process 5,000+ operations/second without database performance degradation."
        ]
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect – Associate",
      "Certified Kubernetes Administrator (CKA)"
    ]
  },
  mba: {
    contact: {
      name: "Priyanka Verma",
      email: "priyanka.verma@business.com",
      phone: "+91 98989 12345",
      location: "Mumbai, India",
      linkedin: "linkedin.com/in/priyanka-verma-mba",
      portfolio: "priyanka-portfolio.co",
    },
    summary: "Dynamic MBA Graduate and Strategy Manager with a focus on business expansion, market penetration, and financial modeling. Skilled in driving cross-functional project execution, boosting marketing ROI, and deploying agile operational structures.",
    experience: [
      {
        id: "exp1",
        company: "Apex Strategy Group",
        role: "Senior Business Consultant",
        location: "Mumbai, India",
        startDate: "2024-04",
        endDate: "Present",
        bullets: [
          "Spearheaded business development projects representing a $4.5M pipeline, capturing 12 new enterprise clients in 6 months.",
          "Conducted detailed competitor analysis and strategic pricing reviews, improving product line profit margins by 6.2%.",
          "Led agile cross-functional groups across product development and sales to coordinate product releases."
        ]
      },
      {
        id: "exp2",
        company: "Vanguard Retail Co.",
        role: "Assistant Brand Manager",
        location: "Mumbai, India",
        startDate: "2022-06",
        endDate: "2024-03",
        bullets: [
          "Designed multi-channel digital brand campaigns that grew brand search volume index by 24%.",
          "Coordinated customer acquisition initiatives that decreased CAC by 14% and increased active membership counts."
        ]
      }
    ],
    education: [
      {
        id: "edu1",
        institution: "Indian Institute of Management (IIM)",
        degree: "Master of Business Administration (MBA)",
        fieldOfStudy: "Marketing & Strategy",
        location: "Ahmedabad, India",
        graduationDate: "2022-05",
        details: "Top 10% of graduating batch. President of Executive Consulting Club."
      }
    ],
    skills: ["Market Strategy", "Financial Modeling", "Strategic Planning", "Project Management", "ROI Optimization", "Agile Management", "KPI Design"],
    projects: [
      {
        id: "proj1",
        name: "E-Commerce Market Penetration",
        technologies: "Tableau, Excel, Market Intelligence Data",
        link: "apex-strategy/ecommerce-penetration",
        bullets: [
          "Developed a commercial forecasting spreadsheet model that accurately predicted product demand with 94% accuracy.",
          "Constructed customized performance dashboards for the executive team to monitor monthly campaign results."
        ]
      }
    ],
    certifications: [
      "Project Management Professional (PMP)",
      "Professional Scrum Master I (PSM I)"
    ]
  },
  ca: {
    contact: {
      name: "Rohan Mehta",
      email: "rohan.mehta.ca@gmail.com",
      phone: "+91 91234 56789",
      location: "New Delhi, India",
      linkedin: "linkedin.com/in/rohan-mehta-ca",
      portfolio: "",
    },
    summary: "Rigorous Chartered Accountant (ACA) with 5+ years of post-qualification expertise in statutory auditing, corporate tax advisory, and cost compliance. Deep comprehension of IFRS and Indian Accounting Standards (Ind AS). Experienced in tax planning and financial risk assessments.",
    experience: [
      {
        id: "exp1",
        company: "KPMG India",
        role: "Assistant Manager - Assurance & Audit",
        location: "New Delhi, India",
        startDate: "2023-05",
        endDate: "Present",
        bullets: [
          "Executed corporate statutory audits for 6 multinational manufacturing corporations with combined asset portfolios exceeding $50M.",
          "Identified internal control gaps in client purchasing processes, resulting in $140K in annual cost savings upon remediation.",
          "Advised clients on Ind AS transition compliance, ensuring error-free filings and zero penalty assessments."
        ]
      },
      {
        id: "exp2",
        company: "Singhal & Associates CA",
        role: "Tax Consultant",
        location: "New Delhi, India",
        startDate: "2021-02",
        endDate: "2023-04",
        bullets: [
          "Formulated complex income tax assessments and direct tax appeals, resolving over 25 litigation cases successfully.",
          "Managed corporate tax returns for high net-worth individuals and corporate firms, reducing average filing audit times."
        ]
      }
    ],
    education: [
      {
        id: "edu1",
        institution: "The Institute of Chartered Accountants of India (ICAI)",
        degree: "Chartered Accountant (CA)",
        fieldOfStudy: "Auditing, Taxation & Corporate Laws",
        location: "Delhi, India",
        graduationDate: "2021-01",
        details: "Cleared CA Final in first attempt. Awarded Merit Certificate for performance in Financial Reporting."
      },
      {
        id: "edu2",
        institution: "Delhi University - Shri Ram College of Commerce (SRCC)",
        degree: "Bachelor of Commerce (B.Com - Hons)",
        fieldOfStudy: "Accounting and Finance",
        location: "Delhi, India",
        graduationDate: "2018-05",
        details: "Graduated with First Class Distinction."
      }
    ],
    skills: ["Financial Auditing", "Statutory Compliance", "Direct Taxation", "IFRS", "Ind AS", "Corporate Laws", "Internal Controls", "SAP FICO", "Tax Planning"],
    projects: [
      {
        id: "proj1",
        name: "Corporate Audit Automation",
        technologies: "Alteryx, SAP, Excel VBA",
        link: "",
        bullets: [
          "Developed automated macros that cut financial reporting compilation periods from 4 days to 3 hours.",
          "Created tax audit templates that eliminated historical duplicate vendor entries."
        ]
      }
    ],
    certifications: [
      "ICAI Registered Valuer Practitioner",
      "Diploma in International Financial Reporting Standards (IFRS)"
    ]
  },
  professor: {
    contact: {
      name: "Dr. Ananya Roy",
      email: "ananya.roy@university.edu",
      phone: "+91 93321 09876",
      location: "Kolkata, India",
      linkedin: "linkedin.com/in/dr-ananya-roy",
      portfolio: "researchgate.net/profile/ananya-roy",
    },
    summary: "Respected Educator and Assistant Professor of English and Pedagogical Research with 6+ years of postgraduate instructing experience. Successful coordinator of curriculum development and peer-reviewed educational structures. Passionate about modern literature research and interactive teaching.",
    experience: [
      {
        id: "exp1",
        company: "St. Xavier's College",
        role: "Assistant Professor - English Department",
        location: "Kolkata, India",
        startDate: "2022-07",
        endDate: "Present",
        bullets: [
          "Instructed advanced undergraduate and postgraduate classes on Postcolonial Literature and Critical Theory for 120+ students.",
          "Authored 4 peer-reviewed research papers published in indexed international journals with active citation profiles.",
          "Secured a research grant worth $18K from the University Grants Commission (UGC) for comparative literary research."
        ]
      },
      {
        id: "exp2",
        company: "Presidency University",
        role: "Lecturer & Academic Coordinator",
        location: "Kolkata, India",
        startDate: "2020-01",
        endDate: "2022-06",
        bullets: [
          "Coordinated curriculum overhauls for the English honors department, improving alignment with modern pedagogical guidelines.",
          "Mentored 35 student theses, resulting in over 10 direct acceptances into international doctoral courses."
        ]
      }
    ],
    education: [
      {
        id: "edu1",
        institution: "Jadavpur University",
        degree: "Doctor of Philosophy (Ph.D.)",
        fieldOfStudy: "Comparative English Literature",
        location: "Kolkata, India",
        graduationDate: "2019-11",
        details: "Dissertation: 'Narrating Identity in Post-Colonial Sub-Continents'. Received Outstanding Academic Achievement Medal."
      }
    ],
    skills: ["Curriculum Design", "Syllabus Creation", "Peer-Reviewed Publishing", "Academic Research", "Student Mentoring", "Grant Writing", "Public Speaking"],
    projects: [
      {
        id: "proj1",
        name: "Digital Humanities Archiving Project",
        technologies: "Omeka, Metadata Standards, Python NLP",
        link: "dr-ananya-roy/dh-archive",
        bullets: [
          "Digitized and tagged 200+ historical manuscripts from West Bengal, opening them for global digital academic retrieval.",
          "Utilized Python NLP tools to execute sentiment indexing across post-colonial novels to support ongoing curricula."
        ]
      }
    ],
    certifications: [
      "UGC-NET with Junior Research Fellowship (JRF)",
      "Harvard Online Course Certificate: Advanced Pedagogical Design"
    ]
  },
};
