import React, { useState } from "react";
import type { ProblemListProps } from "../API/ProblemsApi/Api.Type";
import { Link } from "react-router";

const difficultyBadgeStyles: Record<string, string> = {
  EASY: "bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-500/20",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-300 ring-amber-500/20",
  HARD: "bg-rose-50 text-rose-700 border-rose-300 ring-rose-500/20",
};

export const ProblemList: React.FC<ProblemListProps> = ({ problems }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!problems || problems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <h3 className="text-base font-semibold text-slate-800">
          No problems available
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Check back later for updated challenges.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {problems.map((problem) => {
        const isExpanded = expandedId === problem._id;
        const difficultyClass =
          difficultyBadgeStyles[problem.difficulty.toUpperCase()] ||
          "bg-slate-100 text-slate-700 border-slate-300 ring-slate-400/20";

        return (
          <div
            key={problem._id}
            className={`rounded-xl border transition-all duration-200 bg-white ${
              isExpanded
                ? "border-indigo-300 shadow-md shadow-indigo-100/50 ring-1 ring-indigo-200"
                : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow"
            }`}
          >
            {/* Compact Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6 sm:py-4">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ring-1 ${difficultyClass}`}
                >
                  {problem.difficulty.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {problem.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleExpand(problem._id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isExpanded
                        ? "rotate-180 text-indigo-600"
                        : "text-slate-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <Link
                  to={`solve/${problem._id}`}
                  className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200 cursor-pointer"
                >
                  Solve
                </Link>
              </div>
            </div>

            {/* Expandable Body */}
            {isExpanded && (
              <div className="border-t border-slate-100 bg-slate-50/70 p-5 sm:px-6 sm:py-5 rounded-b-xl space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Description
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {problem.description}
                  </p>
                </div>

                {problem.requirements && problem.requirements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Key Requirements
                    </h4>
                    <ul className="space-y-1.5">
                      {problem.requirements.map((req, idx) => (
                        <li
                          key={idx}
                          className="flex items-start text-sm text-slate-700"
                        >
                          <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 mr-2.5 rounded-full bg-indigo-500" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span>
                    Created:{" "}
                    {new Date(problem.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <Link
                    to={`solve/${problem._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-300/40 cursor-pointer"
                  >
                    Proceed to Solution
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
