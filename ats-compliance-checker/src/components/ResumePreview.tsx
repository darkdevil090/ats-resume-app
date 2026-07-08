import React, { forwardRef } from "react";
import { ResumeData } from "../types";

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data }, ref) => {
    const { contact, summary, experience, education, skills, projects, certifications } = data;

    return (
      <div className="bg-white p-6 sm:p-10 shadow-md border border-neutral-200/60 max-w-[800px] mx-auto overflow-hidden text-neutral-800 antialiased" style={{ minHeight: "297mm" }}>
        {/* Print-optimised wrapper */}
        <div ref={ref} className="bg-white text-black text-left text-[13px] leading-[1.5] space-y-6 font-sans">
          
          {/* Header Contact Section */}
          <div className="text-center space-y-2 border-b-2 border-neutral-900 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 uppercase">
              {contact.name || "YOUR NAME"}
            </h1>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-neutral-600 font-mono">
              {contact.email && (
                <span>{contact.email}</span>
              )}
              {contact.phone && (
                <span>• {contact.phone}</span>
              )}
              {contact.location && (
                <span>• {contact.location}</span>
              )}
              {contact.linkedin && (
                <span>• {contact.linkedin}</span>
              )}
              {contact.portfolio && (
                <span>• {contact.portfolio}</span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                Professional Summary
              </h2>
              <p className="text-neutral-700 leading-relaxed text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-neutral-900">{exp.company}</strong>
                        <span className="text-neutral-500 text-xs"> — {exp.location}</span>
                      </div>
                      <span className="text-xs text-neutral-500 font-mono">
                        {exp.startDate} – {exp.endDate || "Present"}
                      </span>
                    </div>
                    <div className="italic text-neutral-700 font-medium text-xs">
                      {exp.role}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside pl-4 text-neutral-700 space-y-1 text-[12.5px]">
                        {exp.bullets.map((bullet, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-neutral-900">{edu.institution}</strong>
                        <span className="text-neutral-500 text-xs"> — {edu.location}</span>
                      </div>
                      <span className="text-xs text-neutral-500 font-mono">
                        {edu.graduationDate}
                      </span>
                    </div>
                    <div className="text-neutral-700 font-medium text-xs">
                      {edu.degree} in {edu.fieldOfStudy}
                    </div>
                    {edu.details && (
                      <p className="text-neutral-600 text-xs italic mt-0.5">
                        {edu.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                Key Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-neutral-900">{proj.name}</strong>
                        {proj.technologies && (
                          <span className="text-neutral-500 text-xs italic">
                            {" "}
                            ({proj.technologies})
                          </span>
                        )}
                      </div>
                      {proj.link && (
                        <span className="text-xs text-neutral-500 font-mono">
                          {proj.link}
                        </span>
                      )}
                    </div>
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc list-outside pl-4 text-neutral-700 space-y-1 text-[12.5px]">
                        {proj.bullets.map((bullet, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                Skills & Technologies
              </h2>
              <div className="text-neutral-700 leading-relaxed text-sm">
                <strong className="text-neutral-900 font-semibold">Technical Expertise:</strong>{" "}
                {skills.join(", ")}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                Certifications & Achievements
              </h2>
              <ul className="list-disc list-outside pl-4 text-neutral-700 space-y-0.5 text-[12.5px]">
                {certifications.map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";
