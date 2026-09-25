import React from "react";
import { BiCheckCircle, BiLoader, BiXCircle } from "react-icons/bi";
import { LuClock, LuExternalLink, LuFileCode } from "react-icons/lu";
import { BsCode } from "react-icons/bs";
import type {
  EvaluationStatus,
  ProblemDifficulty,
  SubmissionListProps,
} from "../API/SubmissionApi/API.type";

const STATUS_CONFIG: Record<
  EvaluationStatus,
  {
    badgeClass: string;
    icon: React.ElementType;
    label: string;
  }
> = {
  Completed: {
    badgeClass:
      "bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-500/20",
    icon: BiCheckCircle,
    label: "Evaluation Complete",
  },
  Evaluating: {
    badgeClass: "bg-amber-50 text-amber-800 border-amber-300 ring-amber-500/20",
    icon: BiLoader,
    label: "Evaluating Solution...",
  },
  Failed: {
    badgeClass: "bg-rose-50 text-rose-800 border-rose-300 ring-rose-500/20",
    icon: BiXCircle,
    label: "Evaluation Failed",
  },
};

const DIFFICULTY_STYLES: Record<ProblemDifficulty, string> = {
  EASY: "bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-500/10",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-300 ring-amber-500/10",
  HARD: "bg-rose-50 text-rose-700 border-rose-300 ring-rose-500/10",
};

export const SubmissionList: React.FC<SubmissionListProps> = ({
  submissions,
  onViewEvaluation,
}) => {
  const handleNavigate = (evaluationId: string) => {
    if (onViewEvaluation) {
      onViewEvaluation(evaluationId);
    } else {
      window.location.assign(`/evaluations/${evaluationId}`);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return isoString;
    }
  };

  if (!submissions || submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <LuFileCode className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-800">
          No submissions found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Submit your design solution to receive automated AI evaluation and
          feedback.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-3">
      {submissions.map((submission) => {
        const rawStatus = (submission.evaluation?.status ||
          "Evaluating") as EvaluationStatus;
        const statusConfig =
          STATUS_CONFIG[rawStatus] || STATUS_CONFIG.Evaluating;
        const StatusIcon = statusConfig.icon;
        const isEvaluating = rawStatus === "Evaluating";
        const isCompleted = rawStatus === "Completed";

        const difficulty = (submission.problemId?.difficulty?.toUpperCase() ||
          "EASY") as ProblemDifficulty;
        const difficultyBadgeClass =
          DIFFICULTY_STYLES[difficulty] ||
          "bg-slate-100 text-slate-700 border-slate-300 ring-slate-400/10";

        return (
          <div
            key={submission._id}
            className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4"
          >
            {/* Left Column: Problem details & submission metadata */}
            <div className="space-y-2">
              {/* Problem Title & Difficulty */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ring-1 ${difficultyBadgeClass}`}
                >
                  {difficulty}
                </span>
                <h3 className="text-sm font-bold tracking-tight text-slate-900">
                  {submission.problemId?.title || "Untitled Problem"}
                </h3>
              </div>

              {/* Sub-row: Language, Status badge, Timestamp */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-slate-700">
                  <BsCode className="h-3.5 w-3.5 text-indigo-600" />
                  {submission.language}
                </span>

                <span className="text-slate-300">•</span>

                {/* Evaluation Status Pill */}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ring-1 ${statusConfig.badgeClass}`}
                >
                  <StatusIcon
                    className={`h-3.5 w-3.5 shrink-0 ${
                      isEvaluating ? "animate-spin text-amber-600" : ""
                    } ${isCompleted ? "text-emerald-600" : ""}`}
                  />
                  <span>{statusConfig.label}</span>
                </span>

                <span className="text-slate-300">•</span>

                <span className="inline-flex items-center gap-1 text-[11px]">
                  <LuClock className="h-3 w-3 text-slate-400" />
                  {formatDate(submission.createdAt)}
                </span>
              </div>
            </div>

            {/* Right Column: CTA */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleNavigate(submission.evaluation._id)}
                disabled={isEvaluating}
                title={
                  isEvaluating
                    ? "Evaluation is still in progress"
                    : "View detailed evaluation report"
                }
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold tracking-tight transition-all active:scale-95 ${
                  isEvaluating
                    ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 shadow-none"
                    : "cursor-pointer border border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
                }`}
              >
                <span>
                  {rawStatus === "Failed"
                    ? "View Error Log"
                    : "View Evaluation Report"}
                </span>
                <LuExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionList;
