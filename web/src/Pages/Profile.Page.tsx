import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  LuMail,
  LuUser,
  LuLogOut,
  LuShieldCheck,
  LuCalendar,
  LuExternalLink,
  LuLogIn,
  LuLock,
} from "react-icons/lu";
import { BiCode, BiLoader } from "react-icons/bi";
import { FiAlertCircle } from "react-icons/fi";
import { getProfile, logoutUser } from "../API/UserAPI/API.Call";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  avatarUrl?: string;
  role?: string;
}

export interface ProfileApiResponse {
  user: User;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    isLoading,
    isError,
    error,
    data: queryResult,
    refetch,
  } = useQuery({
    queryKey: ["UserProfile"],
    queryFn: getProfile,
    retry: (failureCount, err: any) => {
      // Don't retry on 401 unauthorized
      if (err?.response?.status === 401 || err?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Extract from { user: { ... } } or nested { data: { user: { ... } } }
  const user: User | undefined =
    queryResult?.user ??
    queryResult?.data?.user ??
    queryResult?.data ??
    queryResult;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const isLogout = await logoutUser();
      if (isLogout) {
        navigate("/");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Loading View
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-100/70">
        <div className="flex flex-col items-center gap-3">
          <BiLoader className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-600">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // Check if error is 401 / Unauthorized
  const errorObj = error as any;
  const isUnauthorized =
    errorObj?.response?.status === 401 ||
    errorObj?.status === 401 ||
    errorObj?.response?.data?.message?.toLowerCase().includes("unauthorized") ||
    errorObj?.message?.toLowerCase().includes("unauthorized");

  // 401 Unauthorized State
  if (isUnauthorized) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-100/70 p-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <LuLock className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900">
            Sign In Required
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            You need to be logged in to view your profile, track progress, and
            manage submissions.
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

  // Generic Error View (Server/Network errors)
  if (isError || !user) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-100/70 p-4">
        <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-xs">
          <FiAlertCircle className="mx-auto h-10 w-10 text-rose-500" />
          <h2 className="mt-3 text-lg font-bold text-slate-900">
            Failed to Load Profile
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            {error instanceof Error
              ? error.message
              : "User information could not be retrieved."}
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

  // Compute initials (e.g. "Vinay Pratap" -> "VP")
  const initials = user.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-100/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Account Profile
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage your personal credentials and platform details.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8">
          {/* Top Banner: Avatar + Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-slate-100 pb-6">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-xl font-bold tracking-wider text-white shadow-md shadow-indigo-100 ring-4 ring-white">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
              <span className="absolute -bottom-1 -right-1 block h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  {user.fullName}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  <LuShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">{user.email}</p>
              <p className="text-[11px] font-mono text-slate-400">
                ID: {user._id.slice(-8)}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2">
            {/* Full Name */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <LuUser className="h-3.5 w-3.5 text-indigo-600" />
                <span>Full Name</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">
                {user.fullName}
              </p>
            </div>

            {/* Email Address */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <LuMail className="h-3.5 w-3.5 text-indigo-600" />
                <span>Email Address</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-slate-900 truncate">
                {user.email}
              </p>
            </div>

            {/* Member Since */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <LuCalendar className="h-3.5 w-3.5 text-indigo-600" />
                <span>Member Since</span>
              </div>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">
                {formattedDate}
              </p>
            </div>

            {/* Submissions Activity Link */}
            <div
              onClick={() => navigate("/history")}
              className="group flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/30"
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-600">
                <span className="flex items-center gap-2">
                  <BiCode className="h-3.5 w-3.5 text-indigo-600" />
                  Activity
                </span>
                <LuExternalLink className="h-3.5 w-3.5" />
              </div>
              <p className="mt-1.5 text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                View Past Submissions
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="border-t border-slate-100 pt-6 flex justify-end">
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100 hover:border-rose-300 active:scale-95 disabled:opacity-50 shadow-xs"
            >
              {isLoggingOut ? (
                <>
                  <BiLoader className="h-4 w-4 animate-spin text-rose-600" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LuLogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
