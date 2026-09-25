import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  LuSparkles,
  LuLightbulb,
  LuArrowLeft,
  LuShieldAlert,
  LuCalendar,
  LuTarget,
  LuFileText,
} from "react-icons/lu";
import { BiCheckCircle, BiLoader } from "react-icons/bi";
import { getEvalutaion } from "../API/SubmissionApi/Api.Call";
import { FiAlertTriangle } from "react-icons/fi";

export interface FeedbackDetail {
  criterion: string;
  score: number;
  confidence: number;
  evidence: string;
  concern: string;
  suggestion: string;
}

export interface EvaluationRecord {
  _id: string;
  evaluationId: string;
  createdAt: string;
  updatedAt: string;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  feedbackDetails: FeedbackDetail[];
  __v?: number;
}

export interface EvaluationApiResponse {
  evaluation?: EvaluationRecord[] | EvaluationRecord | null;
  data?: EvaluationRecord[] | EvaluationRecord | null;
}

export function EvaluationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["evaluation", id],
    queryFn: () => getEvalutaion(id as string),
    enabled: Boolean(id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Extract record whether API returns { evaluation: [...] }, { evaluation: {...} }, or array direct
  const rawEval =
    (data as EvaluationApiResponse)?.evaluation ??
    (data as EvaluationApiResponse)?.data ??
    data;

  const evaluation: EvaluationRecord | null = Array.isArray(rawEval)
    ? (rawEval[0] ?? null)
    : (rawEval ?? null);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-100/70">
        <div className="flex flex-col items-center gap-3">
          <BiLoader className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-600">
            Analyzing submission architecture...
          </p>
        </div>
      </div>
    );
  }

  console.log(data);

  // API Error or Failed/Null Evaluation State
  if (error || !evaluation) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-100/70 p-4">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-xs">
          <LuShieldAlert className="mx-auto h-10 w-10 text-rose-500" />
          <h2 className="mt-3 text-lg font-bold text-slate-900">
            Evaluation Not Available
          </h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            {error instanceof Error
              ? error.message
              : "This submission either failed evaluation processing or has not completed yet."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <LuArrowLeft className="h-3.5 w-3.5" />
              <span>Go Back</span>
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex cursor-pointer items-center rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Derive aggregate score out of 10
  const totalScore = evaluation.feedbackDetails?.reduce(
    (acc, curr) => acc + curr.score,
    0,
  );
  const averageScore = evaluation.feedbackDetails?.length
    ? (totalScore / evaluation.feedbackDetails.length).toFixed(1)
    : "N/A";

  const formattedDate = evaluation.createdAt
    ? new Date(evaluation.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-100/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Bar / Action */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <LuArrowLeft className="h-4 w-4" />
            <span>Back to Submissions</span>
          </button>
          <span className="font-mono text-[11px] text-slate-400">
            ID: {evaluation.evaluationId.slice(-8)}
          </span>
        </div>

        {/* Top Summary Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                <LuSparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>AI Architectural Evaluation</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Design Assessment Report
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <LuCalendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Completed on {formattedDate}</span>
              </div>
            </div>

            {/* Score Ring / Pill */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="text-right">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Aggregate Score
                </div>
                <div className="text-xs text-slate-500">Across 7 Criteria</div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 font-mono text-xl font-extrabold text-white shadow-md shadow-indigo-100">
                {averageScore}
              </div>
            </div>
          </div>

          {/* Overall Summary Paragraph */}
          <div className="pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Executive Summary
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {evaluation.overallFeedback}
            </p>
          </div>
        </div>

        {/* Strengths & Improvements Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-2xl border border-emerald-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <BiCheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Architectural Strengths</span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {evaluation.strengths.map((str, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="rounded-2xl border border-amber-200/80 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
              <LuLightbulb className="h-4 w-4 text-amber-600" />
              <span>Recommended Improvements</span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {evaluation.improvements.map((imp, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Granular Feedback Breakdown */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold tracking-tight text-slate-900">
              Detailed Criterion Breakdown
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {evaluation.feedbackDetails.length} Evaluation Points
            </span>
          </div>

          <div className="space-y-3">
            {evaluation.feedbackDetails.map((item, index) => {
              const hasConcern =
                item.concern && item.concern.toLowerCase() !== "none";
              const hasSuggestion =
                item.suggestion && item.suggestion.toLowerCase() !== "none";

              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3"
                >
                  {/* Criterion Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <LuTarget className="h-4 w-4 text-indigo-600" />
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.criterion}
                      </h3>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 font-medium">
                        {(item.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-mono text-xs font-bold">
                      <span className="text-indigo-600">{item.score}</span>
                      <span className="text-slate-400">/10</span>
                    </div>
                  </div>

                  {/* Evidence Row */}
                  <div className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-700 mr-1.5 flex items-center gap-1">
                      <LuFileText className="h-3 w-3 inline text-slate-400" />
                      Evidence:
                    </span>
                    {item.evidence}
                  </div>

                  {/* Concern / Suggestion Pills if present */}
                  {(hasConcern || hasSuggestion) && (
                    <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2 text-xs">
                      {hasConcern && (
                        <div className="flex items-start gap-2 rounded-lg border border-amber-200/60 bg-amber-50/40 p-2.5 text-amber-900">
                          <FiAlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                          <div className="leading-snug">
                            <span className="font-semibold">Concern: </span>
                            {item.concern}
                          </div>
                        </div>
                      )}

                      {hasSuggestion && (
                        <div className="flex items-start gap-2 rounded-lg border border-indigo-200/60 bg-indigo-50/40 p-2.5 text-indigo-950">
                          <LuLightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-600" />
                          <div className="leading-snug">
                            <span className="font-semibold">Suggestion: </span>
                            {item.suggestion}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvaluationPage;
