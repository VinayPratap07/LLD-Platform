import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  LuPlay,
  LuPause,
  LuRotateCcw,
  LuSend,
  LuListChecks,
  LuFileText,
  LuClock,
  LuLoader,
} from "react-icons/lu";
import { BiCheckCircle } from "react-icons/bi";
import { FiAlertCircle } from "react-icons/fi";

import type { Problem } from "../API/ProblemsApi/Api.Type";
import { getOneProblem } from "../API/ProblemsApi/API.Calls";
import { submitUserSolution } from "../API/SubmissionApi/Api.Call";
import { FaPenSquare } from "react-icons/fa";

export interface SingleProblemResponse {
  message: string;
  data: Problem;
}

interface ProblemSolverPageProps {
  initialProblem?: Problem;
  onSubmitSolution?: (payload: {
    problemId: string;
    content: string;
    timeSpentSeconds: number;
    contentType: "TEXT";
  }) => void | Promise<void>;
}

const TEXT_STARTER_TEMPLATE = `## 1. Core Entities & Attributes
- 

## 2. Class Diagram & Relationships
- 

## 3. Design Patterns Applied & Rationale
- 

## 4. API / Method Signatures
- 

## 5. Edge Cases & Concurrency Handling
- 
`;

const DIFFICULTY_STYLES: Record<string, string> = {
  EASY: "bg-emerald-50 text-emerald-700 border-emerald-300 ring-emerald-500/10",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-300 ring-amber-500/10",
  HARD: "bg-rose-50 text-rose-700 border-rose-300 ring-rose-500/10",
};

export const ProblemSolverPage: React.FC<ProblemSolverPageProps> = ({
  initialProblem,
  onSubmitSolution,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Document/Text State
  const [content, setContent] = useState<string>(TEXT_STARTER_TEMPLATE);

  // Stopwatch State
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch problem data safely with enabled flag
  const {
    isLoading,
    isError,
    error,
    data: queryData,
    refetch,
  } = useQuery({
    queryKey: ["problems", id],
    queryFn: () => getOneProblem(id as string),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const mutation = useMutation({
    mutationFn: submitUserSolution,
    onSuccess: () => {
      navigate("/submissions");
    },
  });

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return hrs > 0
      ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
      : `${pad(mins)}:${pad(secs)}`;
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSeconds(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      setContent(
        (prev) => prev.substring(0, start) + "    " + prev.substring(end),
      );
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const handleSubmit = async () => {
    if (!id || !content.trim()) return;

    if (onSubmitSolution) {
      await onSubmitSolution({
        problemId: id,
        content,
        timeSpentSeconds: seconds,
        contentType: "TEXT",
      });
      return;
    }

    mutation.mutate({
      content,
      problemId: id,
      contentType: "TEXT",
    });
  };

  // Content Statistics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  // Fallback checks
  if (!id) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <FiAlertCircle className="mx-auto h-10 w-10 text-slate-400" />
          <h2 className="mt-3 text-lg font-bold text-slate-900">
            No Problem Selected
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Please choose a valid problem from the catalog.
          </p>
          <button
            type="button"
            onClick={() => navigate("/problems")}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700"
          >
            Browse Problems
          </button>
        </div>
      </div>
    );
  }

  // Loading View
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <LuLoader className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-600">
            Loading problem scenario...
          </p>
        </div>
      </div>
    );
  }

  const problem: Problem | undefined =
    queryData?.data ?? queryData ?? initialProblem;

  // Error View
  if (isError || !problem) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] w-full items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md rounded-xl border border-rose-200 bg-white p-6 text-center shadow-sm">
          <FiAlertCircle className="mx-auto h-10 w-10 text-rose-500" />
          <h2 className="mt-3 text-lg font-bold text-slate-900">
            Failed to Load Problem
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {error instanceof Error
              ? error.message
              : "The requested problem could not be found."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700"
          >
            Retry Request
          </button>
        </div>
      </div>
    );
  }

  const difficultyClass =
    DIFFICULTY_STYLES[problem.difficulty?.toUpperCase()] ||
    "bg-slate-100 text-slate-700 border-slate-300 ring-slate-400/10";

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full flex-col overflow-hidden bg-slate-100/70">
      {/* Top Action Toolbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
        {/* Stopwatch */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-sm">
            <LuClock
              className={`h-4 w-4 ${
                isTimerRunning
                  ? "animate-pulse text-indigo-600"
                  : "text-slate-400"
              }`}
            />
            <span className="font-mono text-sm font-semibold tabular-nums text-slate-800">
              {formatTime(seconds)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsTimerRunning((prev) => !prev)}
              title={isTimerRunning ? "Pause timer" : "Resume timer"}
              className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              {isTimerRunning ? (
                <LuPause className="h-4 w-4" />
              ) : (
                <LuPlay className="h-4 w-4 text-emerald-600" />
              )}
            </button>
            <button
              type="button"
              onClick={handleResetTimer}
              title="Reset timer"
              className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              <LuRotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            Markdown Supported
          </span>

          <button
            type="button"
            disabled={mutation.isPending}
            onClick={handleSubmit}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <LuLoader className="h-3.5 w-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <LuSend className="h-3.5 w-3.5" />
                <span>Submit Solution</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Mutation Error Notification */}
      {mutation.isError && (
        <div className="flex items-center justify-between border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs font-medium text-rose-700 sm:px-6">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Failed to submit your solution. Please check your network and try again."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => mutation.reset()}
            className="font-bold underline hover:text-rose-900 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Text Document / Architecture Design Editor */}
        <div className="flex flex-1 flex-col border-r border-slate-200 bg-white">
          <div className="flex h-9 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <FaPenSquare className="h-3.5 w-3.5 text-indigo-600" />
              Low-Level Design Specification
            </span>
            <div className="flex items-center gap-3 text-[11px] font-normal text-slate-400">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
            </div>
          </div>

          <div className="relative flex flex-1 overflow-hidden">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={true}
              className="flex-1 resize-none border-0 bg-transparent p-6 font-sans text-sm leading-relaxed text-slate-800 outline-none selection:bg-indigo-100 selection:text-indigo-900 focus:ring-0 placeholder:text-slate-400"
              placeholder="Structure your low-level design document here (entities, class structures, design patterns, method contracts)..."
            />
          </div>
        </div>

        {/* Right Side: Specification Sidebar */}
        <aside className="w-full shrink-0 space-y-6 overflow-y-auto bg-slate-50/50 p-6 sm:w-80 md:w-96 lg:w-[420px]">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ring-1 ${difficultyClass}`}
              >
                {problem.difficulty?.toUpperCase()}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                ID: {problem._id.slice(-6)}
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {problem.title}
            </h1>
          </div>

          {/* Description */}
          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <LuFileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>Problem Statement</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              {problem.description}
            </p>
          </div>

          {/* Requirements */}
          {Array.isArray(problem.requirements) &&
            problem.requirements.length > 0 && (
              <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <LuListChecks className="h-3.5 w-3.5 text-indigo-600" />
                  <span>System Requirements</span>
                </div>
                <ul className="space-y-2.5">
                  {problem.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-xs sm:text-sm leading-snug text-slate-700"
                    >
                      <BiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Design Guidance Note */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-1.5">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
              Evaluation Criteria
            </h3>
            <p className="text-xs leading-relaxed text-indigo-800/80">
              Focus on clear separation of concerns, SOLID principles, suitable
              design patterns, and handling edge cases like concurrency and
              capacity limits.
            </p>
          </div>

          {/* Metadata */}
          <div className="flex justify-between rounded-lg border border-slate-200/80 bg-white/60 p-3 text-[11px] text-slate-400">
            <span>
              Published:{" "}
              {problem.createdAt
                ? new Date(problem.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
            <span>Version: v{problem.__v ?? 0}.0</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProblemSolverPage;
