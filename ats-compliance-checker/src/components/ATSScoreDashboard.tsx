import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, ShieldCheck, HelpCircle, FileText, Briefcase, Award, Sparkles, AlertCircle } from "lucide-react";
import { ATSAnalysisResult, ATSImprovement } from "../types";

interface ATSScoreDashboardProps {
  result: ATSAnalysisResult;
  isLoading: boolean;
  onApplySingleSuggestion?: (improvement: ATSImprovement) => void;
  onApplyAllSuggestions?: () => void;
  isApplyingOptimization?: boolean;
}

export const ATSScoreDashboard: React.FC<ATSScoreDashboardProps> = ({
  result,
  isLoading,
  onApplySingleSuggestion,
  onApplyAllSuggestions,
  isApplyingOptimization = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 text-center space-y-6 animate-pulse">
        <div className="h-12 w-12 bg-neutral-200 rounded-full mx-auto" />
        <div className="space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-1/3 mx-auto" />
          <div className="h-3 bg-neutral-200 rounded w-1/2 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-24 bg-neutral-100 rounded-xl" />
          <div className="h-24 bg-neutral-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const { score, isATSCompliant, summary, categories, improvements, missingKeywords, presentKeywords, industryAlignment, formattingChecks } = result;

  // Determine score color
  const getScoreColor = (num: number) => {
    if (num >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (num >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getScoreBarBg = (num: number) => {
    if (num >= 80) return "bg-emerald-500";
    if (num >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="space-y-8">
      
      {/* SCORE HEADER HERO CARD */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-neutral-800 shadow-xl">
        {/* Ambient subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* Radial Score Gauge */}
          <div className="relative flex-shrink-0 w-32 h-32 flex items-center justify-center">
            {/* SVG circle track */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="54"
                className="stroke-neutral-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="54"
                stroke={score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#f43f5e"}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - score / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="text-center space-y-0.5">
              <span className="text-4xl font-extrabold tracking-tight font-mono">{score}</span>
              <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">ATS Score</span>
            </div>
          </div>

          {/* Feedback Core */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-neutral-800 border border-neutral-700 font-semibold tracking-wider text-neutral-300">
                STATUS REVIEW
              </span>
              {isATSCompliant ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                  <CheckCircle2 size={14} /> ATS COMPLIANT
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">
                  <AlertTriangle size={14} /> OPTIMIZATION REQUIRED
                </div>
              )}
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed sm:text-base">
              {summary}
            </p>
          </div>
        </div>
      </div>

      {/* ONE-CLICK AI DRAFTER / OPTIMIZER BANNER */}
      {onApplyAllSuggestions && (
        <div className="bg-emerald-950/45 text-emerald-100 rounded-2xl p-5 border border-emerald-800/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none w-1/3 flex items-center justify-end">
            <Sparkles size={140} className="text-emerald-400 rotate-12" />
          </div>
          <div className="space-y-1.5 max-w-xl text-center md:text-left">
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold tracking-widest font-mono uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
              AI One-Click Auto-Draft Optimizer
            </span>
            <h3 className="text-sm font-extrabold text-white tracking-tight uppercase font-mono">
              Draft Fully ATS-Optimized Resume
            </h3>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Let Gemini analyze your current content, automatically apply all suggested rewrites below, weave in the <strong className="text-emerald-300">{missingKeywords.length} missing industry keywords</strong> naturally, and align your resume fully to professional ATS structure rules.
            </p>
          </div>
          <div className="w-full md:w-auto flex-shrink-0">
            <button
              onClick={onApplyAllSuggestions}
              disabled={isApplyingOptimization}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-400 text-emerald-950 hover:bg-emerald-300 disabled:bg-emerald-800/50 disabled:text-emerald-300 font-extrabold py-3 px-5 rounded-xl text-xs uppercase tracking-wider font-mono transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              {isApplyingOptimization ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                  Generating draft...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Auto-Apply All & Redraft
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* DETAILED SCORE BREAKDOWNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category breakdown progress bars */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-5 shadow-sm">
          <h4 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono flex items-center gap-2">
            <Briefcase size={16} className="text-neutral-500" /> CATEGORY METRICS
          </h4>
          <div className="space-y-4">
            {Object.entries(categories).map(([key, item]) => {
              const typedItem = item as { score: number; feedback: string };
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-neutral-700 uppercase">
                    <span>{key}</span>
                    <span className="font-mono">{typedItem.score}%</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getScoreBarBg(typedItem.score)} transition-all duration-1000`}
                      style={{ width: `${typedItem.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 italic">
                    {typedItem.feedback}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Industry Alignment & Statistics */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck size={16} className="text-neutral-500" /> INDUSTRY FIT ANALYSIS
            </h4>
            
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/60 flex items-center gap-4">
              <div className="text-center bg-white border border-neutral-200 p-2.5 rounded-lg w-20 flex-shrink-0 shadow-sm">
                <span className="block text-2xl font-extrabold font-mono text-neutral-800">{industryAlignment.matchRate}%</span>
                <span className="block text-[8px] font-bold text-neutral-400 uppercase">Fit Rate</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {industryAlignment.analysis}
              </p>
            </div>
          </div>

          {/* Quick instructions panel */}
          <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-xl space-y-1.5 mt-4">
            <span className="text-[11px] font-extrabold tracking-wider text-emerald-800 uppercase font-mono flex items-center gap-1">
              <Sparkles size={12} /> Optimization Secret
            </span>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Ensure you integrate at least 80% of the <strong>Missing Keywords</strong> inside your professional bullet points. Avoid merely lists; context counts!
            </p>
          </div>
        </div>
      </div>

      {/* KEYWORDS COMPARISON ENGINE */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-6 shadow-sm">
        <h4 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono flex items-center gap-2">
          <HelpCircle size={16} className="text-neutral-500" /> KEYWORD MATCH OPTIMIZER
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Present Keywords */}
          <div className="space-y-3 p-4 rounded-xl bg-emerald-50/20 border border-emerald-100">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider font-mono block">
              IDENTIFIED MATCHES ({presentKeywords.length})
            </span>
            {presentKeywords.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">No strong matching domain keywords found. Fix below.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {presentKeywords.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2 py-0.5 bg-emerald-100/70 border border-emerald-200 text-emerald-800 rounded-md font-mono"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Missing Keywords */}
          <div className="space-y-3 p-4 rounded-xl bg-rose-50/20 border border-rose-100">
            <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider font-mono block">
              CRITICAL GAPS / MISSING ({missingKeywords.length})
            </span>
            {missingKeywords.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">Great! No critical keyword vacancies detected.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {missingKeywords.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2 py-0.5 bg-rose-100/70 border border-rose-200 text-rose-800 rounded-md font-mono"
                  >
                    + {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FORMATTING COMPLIANCE CHECKLIST */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 space-y-5 shadow-sm">
        <h4 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono flex items-center gap-2">
          <FileText size={16} className="text-neutral-500" /> FORMATTING & ATS PARSING CHECKS
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formattingChecks.map((item, idx) => (
            <div
              key={idx}
              className={`flex gap-3 items-start p-3.5 rounded-xl border ${
                item.passed
                  ? "bg-neutral-50/60 border-neutral-200/60"
                  : "bg-amber-50/30 border-amber-200/50"
              }`}
            >
              {item.passed ? (
                <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-neutral-800 block">
                  {item.check}
                </span>
                <span className="text-[11px] text-neutral-500 leading-relaxed block">
                  {item.details}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: SUGGESTED REWRITES / AREAS TO IMPROVE */}
      <div className="space-y-4">
        <h4 className="text-sm font-extrabold text-neutral-800 uppercase tracking-wider font-mono flex items-center gap-2 px-1">
          <Award size={16} className="text-neutral-500" /> CONCRETE OPTIMIZATION ADVISORIES
        </h4>

        {improvements.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center text-emerald-800">
            Excellent! Your resume has zero noticeable structural flaws. Ready to submit!
          </div>
        ) : (
          <div className="space-y-4">
            {improvements.map((imp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200/80 p-5 space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-neutral-900 text-white rounded px-2 py-0.5">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-neutral-400 uppercase font-mono tracking-wider">
                      {imp.section}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">
                      {imp.issue}
                    </span>
                    {onApplySingleSuggestion && (
                      <button
                        onClick={() => onApplySingleSuggestion(imp)}
                        className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                        title="Directly apply this rewrite suggestion to your Resume Editor"
                      >
                        <Sparkles size={11} className="text-emerald-600" /> Apply Fix
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    <strong>Suggestion:</strong> {imp.suggestion}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5 text-xs">
                    <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-1">
                      <span className="text-[10px] text-neutral-400 uppercase font-mono font-bold block">
                        Original / Common Pattern
                      </span>
                      <p className="text-neutral-500 line-through italic">
                        "{imp.exampleBefore || "Responsible for database setups."}"
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/30 border border-emerald-200/60 space-y-1">
                      <span className="text-[10px] text-emerald-500 uppercase font-mono font-bold block">
                        ATS-Optimized Rewrite
                      </span>
                      <p className="text-emerald-800 font-medium">
                        "{imp.exampleAfter}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
