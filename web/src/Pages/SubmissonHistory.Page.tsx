import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { BiLoader } from "react-icons/bi";
import { LuLock, LuLogIn } from "react-icons/lu";
import { getAllSubmissons } from "../API/SubmissionApi/Api.Call";
import SubmissionList from "../Components/SubmissionList";
import type { Submission } from "../API/SubmissionApi/API.type";
import { FiAlertCircle } from "react-icons/fi";

interface SubmissionHistoryApiResponse {
  submissions?: Submission[];
  data?:
    | {
        submissions?: Submission[];
      }
    | Submission[];
}

function SubmissonHistory() {
  const navigate = useNavigate();

  const { isLoading, isError, error, data, refetch } =
    useQuery<SubmissionHistoryApiResponse>({
      queryKey: ["Submissions"],
      queryFn: getAllSubmissons,
      retry: (failureCount, err: any) => {
        // Do not retry if the user is unauthenticated
        if (err?.response?.status === 401 || err?.status === 401) {
          return false;
        }
        return failureCount < 2;
      },
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  // Check for 401 Unauthorized status or error message
  const errorObj = error as any;
  const isUnauthorized =
    errorObj?.response?.status === 401 ||
    errorObj?.status === 401 ||
    errorObj?.response?.data?.message?.toLowerCase().includes("unauthorized") ||
    errorObj?.message?.toLowerCase().includes("unauthorized");

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-100/70">
        <div className="flex flex-col items-center gap-3">
          <BiLoader className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-600">
            Fetching submission history...
          </p>
        </div>
      </div>
    );
  }

  // 401 Unauthorized State
  if (isUnauthorized) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-100/70 p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <LuLock className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
            Sign In Required
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            You must be logged in to view your past solution submissions and
            architecture evaluations.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95"
            >
              <LuLogIn className="h-4 w-4" />
              <span>Go to Login</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Create an account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generic Error State
  if (isError) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-100/70 p-4">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-xs">
          <FiAlertCircle className="mx-auto h-10 w-10 text-rose-500" />
          <h2 className="mt-3 text-lg font-bold text-slate-900">
            Failed to Load Submissions
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            {error instanceof Error
              ? error.message
              : "Unable to retrieve your submission history at this time."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Extract submissions safely regardless of backend envelope variations
  const submissionsList: Submission[] =
    data?.submissions ??
    (data as any)?.data?.submissions ??
    (Array.isArray(data?.data) ? data.data : []) ??
    (Array.isArray(data) ? data : []);

  // SubmissionList passes (submissionId, evaluationId)
  const handleViewEvaluation = (
    submissionId: string,
    evaluationId?: string,
  ) => {
    const targetId = evaluationId || submissionId;
    navigate(`/evaluation/${targetId}`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 py-10 px-4">
      <div className="mx-auto max-w-4xl mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Submission History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track the evaluation status and feedback for your system design
          solutions.
        </p>
      </div>

      <SubmissionList
        submissions={submissionsList}
        onViewEvaluation={handleViewEvaluation}
      />
    </div>
  );
}

export default SubmissonHistory;
