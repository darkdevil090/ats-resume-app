import React, { useState } from "react";
import { Smartphone, Mail, Phone, MapPin, Link2, Calendar, Award, BookOpen, Cpu, ChevronRight, Zap } from "lucide-react";
import { ResumeData } from "../types";

interface MobileSimulatorFrameProps {
  data: ResumeData;
  domainName: string;
}

type PlatformType = "ios" | "android";

export const MobileSimulatorFrame: React.FC<MobileSimulatorFrameProps> = ({ data, domainName }) => {
  const [platform, setPlatform] = useState<PlatformType>("ios");
  const { contact, summary, experience, education, skills, projects, certifications } = data;

  return (
    <div className="flex flex-col items-center space-y-6">
      
      {/* Platform Switcher Buttons */}
      <div className="inline-flex p-1 bg-neutral-100 rounded-xl border border-neutral-200/80 shadow-sm no-print">
        <button
          onClick={() => setPlatform("ios")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            platform === "ios"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          iOS iPhone Frame
        </button>
        <button
          onClick={() => setPlatform("android")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            platform === "android"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Android Material Frame
        </button>
      </div>

      {/* Smartphone Device Wrapper */}
      <div
        className={`relative w-[320px] h-[640px] bg-neutral-950 shadow-2xl transition-all duration-300 overflow-hidden ${
          platform === "ios"
            ? "rounded-[48px] border-[10px] border-neutral-900 ring-4 ring-neutral-800"
            : "rounded-[32px] border-[8px] border-neutral-900 ring-2 ring-neutral-800"
        }`}
      >
        {/* iOS Notch / Dynamic Island */}
        {platform === "ios" && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            <div className="w-12 h-1.5 rounded-full bg-neutral-900/60" />
            <div className="w-2 h-2 rounded-full bg-blue-900/20" />
          </div>
        )}

        {/* Android Pinhole Camera */}
        {platform === "android" && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50 border border-neutral-800" />
        )}

        {/* Smartphone Screen Container */}
        <div className="w-full h-full bg-neutral-50 flex flex-col pt-8 pb-4 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200">
          
          {/* Status Bar */}
          <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 px-3 py-1 font-mono mb-2">
            <span>10:56 AM</span>
            <div className="flex items-center gap-1">
              <span>5G</span>
              <div className="w-4 h-2 border border-neutral-400 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-neutral-800 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Core Profile Card */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/60 shadow-sm space-y-3">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-neutral-900 text-white rounded-full mx-auto flex items-center justify-center font-bold text-lg font-mono">
                {contact.name ? contact.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "CV"}
              </div>
              <h2 className="text-sm font-bold text-neutral-900">{contact.name || "Full Name"}</h2>
              <span className="inline-block text-[10px] bg-neutral-100 border border-neutral-200/50 text-neutral-600 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider font-mono">
                {domainName}
              </span>
            </div>

            {/* Quick Contact Rows */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-neutral-600 font-mono pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
                <Mail size={10} className="text-neutral-400 flex-shrink-0" />
                <span className="truncate">{contact.email || "No Email"}</span>
              </div>
              <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
                <Phone size={10} className="text-neutral-400 flex-shrink-0" />
                <span className="truncate">{contact.phone || "No Phone"}</span>
              </div>
              <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis col-span-2">
                <MapPin size={10} className="text-neutral-400 flex-shrink-0" />
                <span className="truncate">{contact.location || "No Location"}</span>
              </div>
            </div>
          </div>

          {/* Summary / Bio block */}
          {summary && (
            <div className="mt-3 bg-white p-3.5 rounded-2xl border border-neutral-200/60 shadow-sm space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase font-mono font-bold tracking-wider">Professional bio</span>
              <p className="text-[11px] text-neutral-600 leading-relaxed text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Technical Skills List */}
          {skills && skills.length > 0 && (
            <div className="mt-3 bg-white p-3.5 rounded-2xl border border-neutral-200/60 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5">
                <Cpu size={12} className="text-neutral-500" />
                <span className="text-[10px] text-neutral-800 uppercase font-mono font-extrabold">Skills Tags</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-medium px-1.5 py-0.5 bg-neutral-100/60 border border-neutral-200/40 text-neutral-700 rounded-md font-mono"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Positions (Simulated iOS/Android Rows) */}
          {experience && experience.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-1.5 px-2">
                <Smartphone size={12} className="text-neutral-500" />
                <span className="text-[10px] text-neutral-800 uppercase font-mono font-extrabold">Experience</span>
              </div>

              <div className="space-y-2">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className={`bg-white p-3.5 border shadow-2xs space-y-1.5 ${
                      platform === "ios"
                        ? "rounded-2xl border-neutral-200/60"
                        : "rounded-lg border-neutral-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="leading-tight">
                        <span className="block text-[11px] font-bold text-neutral-900">{exp.company}</span>
                        <span className="block text-[10px] text-neutral-500">{exp.role}</span>
                      </div>
                      <span className="text-[8px] text-neutral-400 font-mono whitespace-nowrap bg-neutral-100 px-1 py-0.5 rounded">
                        {exp.startDate.split("-")[0]} - {exp.endDate === "Present" ? "Pres" : exp.endDate.split("-")[0]}
                      </span>
                    </div>
                    {exp.bullets && exp.bullets[0] && (
                      <p className="text-[10px] text-neutral-600 line-clamp-2 leading-relaxed pl-1.5 border-l-2 border-neutral-200">
                        {exp.bullets[0]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education list */}
          {education && education.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-1.5 px-2">
                <BookOpen size={12} className="text-neutral-500" />
                <span className="text-[10px] text-neutral-800 uppercase font-mono font-extrabold">Education</span>
              </div>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className={`bg-white p-3 border shadow-2xs ${
                      platform === "ios"
                        ? "rounded-2xl border-neutral-200/60"
                        : "rounded-lg border-neutral-200"
                    }`}
                  >
                    <span className="block text-[11px] font-bold text-neutral-900">{edu.institution}</span>
                    <span className="block text-[10px] text-neutral-500">{edu.degree} — {edu.graduationDate.split("-")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Row */}
          {certifications && certifications.length > 0 && (
            <div className="mt-3 bg-white p-3.5 rounded-2xl border border-neutral-200/60 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5">
                <Award size={12} className="text-neutral-500" />
                <span className="text-[10px] text-neutral-800 uppercase font-mono font-extrabold">Accreditation</span>
              </div>
              <div className="space-y-1">
                {certifications.slice(0, 2).map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[10px] text-neutral-600">
                    <ChevronRight size={10} className="text-neutral-400" />
                    <span className="truncate">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer App Indicator */}
          <div className="text-center pt-6 pb-2 text-[8px] font-mono text-neutral-400 uppercase tracking-wider">
            Powered by ATS Checker Suite
          </div>

        </div>

        {/* iOS Home Indicator Bar */}
        {platform === "ios" && (
          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-black rounded-full z-50" />
        )}
      </div>
    </div>
  );
};
