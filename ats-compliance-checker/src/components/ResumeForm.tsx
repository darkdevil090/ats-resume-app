import React from "react";
import { Plus, Trash, Sparkles } from "lucide-react";
import { ResumeData, WorkExperience, EducationInfo, ProjectInfo } from "../types";

interface ResumeFormProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  // Helper to deep update state
  const updateContact = (field: keyof typeof data.contact, value: string) => {
    onChange({
      ...data,
      contact: {
        ...data.contact,
        [field]: value,
      },
    });
  };

  const updateSummary = (value: string) => {
    onChange({
      ...data,
      summary: value,
    });
  };

  // --- EXPERIENCE HANDLERS ---
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp_${Date.now()}`,
      company: "New Company",
      role: "Job Title",
      location: "City, Country",
      startDate: "2024-01",
      endDate: "Present",
      bullets: ["Accomplished [X] as measured by [Y], by doing [Z]."],
    };
    onChange({
      ...data,
      experience: [...data.experience, newExp],
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    });
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addExperienceBullet = (expId: string) => {
    const exp = data.experience.find((e) => e.id === expId);
    if (!exp) return;
    const updatedBullets = [...exp.bullets, "Accomplished [X] as measured by [Y], by doing [Z]."];
    updateExperience(expId, "bullets", updatedBullets);
  };

  const updateExperienceBullet = (expId: string, index: number, value: string) => {
    const exp = data.experience.find((e) => e.id === expId);
    if (!exp) return;
    const updatedBullets = [...exp.bullets];
    updatedBullets[index] = value;
    updateExperience(expId, "bullets", updatedBullets);
  };

  const removeExperienceBullet = (expId: string, index: number) => {
    const exp = data.experience.find((e) => e.id === expId);
    if (!exp) return;
    const updatedBullets = exp.bullets.filter((_, idx) => idx !== index);
    updateExperience(expId, "bullets", updatedBullets);
  };

  // --- EDUCATION HANDLERS ---
  const addEducation = () => {
    const newEdu: EducationInfo = {
      id: `edu_${Date.now()}`,
      institution: "University Name",
      degree: "Degree Name",
      fieldOfStudy: "Field of Study",
      location: "City, Country",
      graduationDate: "2024-05",
      details: "GPA: X.Y/Y.Z or Major coursework",
    };
    onChange({
      ...data,
      education: [...data.education, newEdu],
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    });
  };

  const updateEducation = (id: string, field: keyof EducationInfo, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  // --- PROJECTS HANDLERS ---
  const addProject = () => {
    const newProj: ProjectInfo = {
      id: `proj_${Date.now()}`,
      name: "Project Name",
      technologies: "React, Node.js, etc.",
      link: "github.com/username/project",
      bullets: ["Designed and implemented [X] resulting in [Y] performance boost."],
    };
    onChange({
      ...data,
      projects: [...data.projects, newProj],
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  const updateProject = (id: string, field: keyof ProjectInfo, value: any) => {
    onChange({
      ...data,
      projects: data.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const addProjectBullet = (projId: string) => {
    const proj = data.projects.find((p) => p.id === projId);
    if (!proj) return;
    const updatedBullets = [...proj.bullets, "Developed [X] resulting in [Y] increase in [Z]."];
    updateProject(projId, "bullets", updatedBullets);
  };

  const updateProjectBullet = (projId: string, index: number, value: string) => {
    const proj = data.projects.find((p) => p.id === projId);
    if (!proj) return;
    const updatedBullets = [...proj.bullets];
    updatedBullets[index] = value;
    updateProject(projId, "bullets", updatedBullets);
  };

  const removeProjectBullet = (projId: string, index: number) => {
    const proj = data.projects.find((p) => p.id === projId);
    if (!proj) return;
    const updatedBullets = proj.bullets.filter((_, idx) => idx !== index);
    updateProject(projId, "bullets", updatedBullets);
  };

  // --- SKILLS & CERTS HANDLERS ---
  const handleSkillsChange = (val: string) => {
    const split = val.split(",").map((s) => s.trim()).filter(Boolean);
    onChange({
      ...data,
      skills: split,
    });
  };

  const handleCertsChange = (val: string) => {
    const split = val.split("\n").map((s) => s.trim()).filter(Boolean);
    onChange({
      ...data,
      certifications: split,
    });
  };

  return (
    <div className="space-y-8 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80">
      
      {/* SECTION: Personal & Contact */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
          <span className="p-1.5 bg-neutral-900 text-white rounded-lg text-xs font-mono">01</span>
          <h3 className="font-bold text-neutral-800 tracking-tight text-base uppercase">Personal & Contact Info</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors"
              value={data.contact.name}
              onChange={(e) => updateContact("name", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors"
              value={data.contact.email}
              onChange={(e) => updateContact("email", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Phone Number</label>
            <input
              type="text"
              className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors"
              value={data.contact.phone}
              onChange={(e) => updateContact("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Location (City, Country)</label>
            <input
              type="text"
              className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors"
              value={data.contact.location}
              onChange={(e) => updateContact("location", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">LinkedIn Profile Link</label>
            <input
              type="text"
              className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors"
              value={data.contact.linkedin}
              onChange={(e) => updateContact("linkedin", e.target.value)}
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Portfolio or Website</label>
            <input
              type="text"
              className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors"
              value={data.contact.portfolio}
              onChange={(e) => updateContact("portfolio", e.target.value)}
              placeholder="username.dev"
            />
          </div>
        </div>
      </div>

      {/* SECTION: Professional Summary */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
          <span className="p-1.5 bg-neutral-900 text-white rounded-lg text-xs font-mono">02</span>
          <h3 className="font-bold text-neutral-800 tracking-tight text-base uppercase">Professional Summary</h3>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">
            Short, impactful elevator pitch outlining your key strengths (ATS loves action verbs).
          </label>
          <textarea
            className="w-full h-24 text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors resize-none"
            value={data.summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Write a clear, core summary..."
          />
        </div>
      </div>

      {/* SECTION: Experience */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-neutral-900 text-white rounded-lg text-xs font-mono">03</span>
            <h3 className="font-bold text-neutral-800 tracking-tight text-base uppercase">Professional Experience</h3>
          </div>
          <button
            onClick={addExperience}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> Add Work
          </button>
        </div>

        {data.experience.length === 0 ? (
          <p className="text-sm text-neutral-500 italic">No work experience added. Click 'Add Work' above.</p>
        ) : (
          <div className="space-y-6">
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className="relative bg-white p-4 rounded-xl border border-neutral-200/70 space-y-4 shadow-sm">
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-neutral-50"
                  title="Delete Position"
                >
                  <Trash size={16} />
                </button>
                <div className="text-xs font-bold text-neutral-400 uppercase font-mono">
                  Position #{idx + 1}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800 focus:outline-none focus:border-neutral-900"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Job Title / Role</label>
                    <input
                      type="text"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800 focus:outline-none focus:border-neutral-900"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800 focus:outline-none focus:border-neutral-900"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Start Date</label>
                      <input
                        type="text"
                        className="w-full text-xs bg-white border border-neutral-200 rounded-lg px-2 py-1.5 text-neutral-800 focus:outline-none focus:border-neutral-900"
                        value={exp.startDate}
                        placeholder="YYYY-MM"
                        onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">End Date</label>
                      <input
                        type="text"
                        className="w-full text-xs bg-white border border-neutral-200 rounded-lg px-2 py-1.5 text-neutral-800 focus:outline-none focus:border-neutral-900"
                        value={exp.endDate}
                        placeholder="YYYY-MM or Present"
                        onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Bullets Sub-section */}
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-600">Bullet Points (Results-oriented accomplishments)</span>
                    <button
                      onClick={() => addExperienceBullet(exp.id)}
                      className="text-[10px] font-bold text-neutral-600 hover:text-black flex items-center gap-0.5"
                    >
                      <Plus size={10} /> Add Bullet
                    </button>
                  </div>
                  <div className="space-y-2">
                    {exp.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex gap-2 items-center">
                        <span className="text-neutral-300 select-none text-xs font-mono">•</span>
                        <input
                          type="text"
                          className="flex-1 text-xs bg-neutral-50/50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                          value={bullet}
                          onChange={(e) => updateExperienceBullet(exp.id, bIdx, e.target.value)}
                        />
                        <button
                          onClick={() => removeExperienceBullet(exp.id, bIdx)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION: Education */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-neutral-900 text-white rounded-lg text-xs font-mono">04</span>
            <h3 className="font-bold text-neutral-800 tracking-tight text-base uppercase">Education</h3>
          </div>
          <button
            onClick={addEducation}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> Add Education
          </button>
        </div>

        {data.education.length === 0 ? (
          <p className="text-sm text-neutral-500 italic">No education details added. Click 'Add Education' above.</p>
        ) : (
          <div className="space-y-4">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="relative bg-white p-4 rounded-xl border border-neutral-200/70 space-y-4 shadow-sm">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-neutral-50"
                  title="Delete Education"
                >
                  <Trash size={16} />
                </button>
                <div className="text-xs font-bold text-neutral-400 uppercase font-mono">
                  Education #{idx + 1}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Institution / School</label>
                    <input
                      type="text"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Degree (e.g. B.Tech, MBA)</label>
                    <input
                      type="text"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Field of Study</label>
                    <input
                      type="text"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800"
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Location</label>
                      <input
                        type="text"
                        className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800"
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Graduation Date</label>
                      <input
                        type="text"
                        className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800"
                        value={edu.graduationDate}
                        placeholder="YYYY-MM"
                        onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Honors / GPA / Additional Info</label>
                  <input
                    type="text"
                    className="w-full text-xs bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800"
                    value={edu.details}
                    onChange={(e) => updateEducation(edu.id, "details", e.target.value)}
                    placeholder="e.g. GPA: 3.8/4.0. Completed academic minor in economics."
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION: Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-neutral-900 text-white rounded-lg text-xs font-mono">05</span>
            <h3 className="font-bold text-neutral-800 tracking-tight text-base uppercase">Key Projects</h3>
          </div>
          <button
            onClick={addProject}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={14} /> Add Project
          </button>
        </div>

        {data.projects.length === 0 ? (
          <p className="text-sm text-neutral-500 italic">No project details added. Click 'Add Project' above.</p>
        ) : (
          <div className="space-y-4">
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="relative bg-white p-4 rounded-xl border border-neutral-200/70 space-y-4 shadow-sm">
                <button
                  onClick={() => removeProject(proj.id)}
                  className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-neutral-50"
                  title="Delete Project"
                >
                  <Trash size={16} />
                </button>
                <div className="text-xs font-bold text-neutral-400 uppercase font-mono">
                  Project #{idx + 1}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Project Name</label>
                    <input
                      type="text"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Technologies Used (comma separated)</label>
                    <input
                      type="text"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800"
                      value={proj.technologies}
                      placeholder="React, AWS Lambda, Redis"
                      onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-600 mb-1">Project Link / Repo</label>
                    <input
                      type="text"
                      className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800"
                      value={proj.link}
                      placeholder="github.com/username/repo"
                      onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                    />
                  </div>
                </div>

                {/* Project Bullet points */}
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-600">Project Highlights</span>
                    <button
                      onClick={() => addProjectBullet(proj.id)}
                      className="text-[10px] font-bold text-neutral-600 hover:text-black flex items-center gap-0.5"
                    >
                      <Plus size={10} /> Add Bullet
                    </button>
                  </div>
                  <div className="space-y-2">
                    {proj.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex gap-2 items-center">
                        <span className="text-neutral-300 select-none text-xs font-mono">•</span>
                        <input
                          type="text"
                          className="flex-1 text-xs bg-neutral-50/50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                          value={bullet}
                          onChange={(e) => updateProjectBullet(proj.id, bIdx, e.target.value)}
                        />
                        <button
                          onClick={() => removeProjectBullet(proj.id, bIdx)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION: Skills */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
          <span className="p-1.5 bg-neutral-900 text-white rounded-lg text-xs font-mono">06</span>
          <h3 className="font-bold text-neutral-800 tracking-tight text-base uppercase">Skills & Expertises</h3>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">
            Technical Skills (Separate by commas)
          </label>
          <input
            type="text"
            className="w-full text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors"
            value={data.skills.join(", ")}
            onChange={(e) => handleSkillsChange(e.target.value)}
            placeholder="React, TypeScript, SQL, Agile, Marketing, Auditing"
          />
          <span className="text-[10px] text-neutral-400 mt-1 block">
            Separate skill tags with commas so we can analyze each keyword independently.
          </span>
        </div>
      </div>

      {/* SECTION: Certifications */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
          <span className="p-1.5 bg-neutral-900 text-white rounded-lg text-xs font-mono">07</span>
          <h3 className="font-bold text-neutral-800 tracking-tight text-base uppercase">Certifications & Achievements</h3>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-600 mb-1">
            Certifications (One entry per line)
          </label>
          <textarea
            className="w-full h-24 text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-neutral-900 transition-colors resize-none"
            value={data.certifications.join("\n")}
            onChange={(e) => handleCertsChange(e.target.value)}
            placeholder="AWS Certified Practitioner&#10;ICAI Registered Audit Merit"
          />
        </div>
      </div>

    </div>
  );
};
