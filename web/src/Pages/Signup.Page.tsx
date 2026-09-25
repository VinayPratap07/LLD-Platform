import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { BiLoader } from "react-icons/bi";
import {
  LuLayers,
  LuUser,
  LuMail,
  LuLock,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuCheck,
} from "react-icons/lu";
import { registerUser } from "../API/UserAPI/API.Call";
import { FiAlertCircle } from "react-icons/fi";

export function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setFormData({ fullName: "", email: "", password: "" });
      navigate("/login");
    },
  });

  const hasMinLength = formData.password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!hasMinLength || !hasNumberOrSymbol) {
      setValidationError("Please satisfy all password security requirements.");
      return;
    }

    mutation.mutate({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });
  };

  const activeError =
    validationError ||
    (mutation.isError
      ? mutation.error instanceof Error
        ? mutation.error.message
        : "Failed to create account. Please try again."
      : null);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-100/70 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header / Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <LuLayers className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Join LLD Platform to practice and master low-level design problems.
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
          {activeError && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              <FiAlertCircle className="h-4 w-4 shrink-0" />
              <span>{activeError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Full Name
              </label>
              <div className="relative mt-1.5 rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <LuUser className="h-4 w-4" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ada Lovelace"
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Email Address
              </label>
              <div className="relative mt-1.5 rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <LuMail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="developer@lld.com"
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Create Password
              </label>
              <div className="relative mt-1.5 rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <LuLock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <LuEyeOff className="h-4 w-4" />
                  ) : (
                    <LuEye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Requirements Checklist */}
              <div className="mt-2.5 flex items-center gap-4 text-[11px]">
                <span
                  className={`flex items-center gap-1 font-medium ${
                    hasMinLength ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  <LuCheck
                    className={`h-3.5 w-3.5 ${
                      hasMinLength ? "text-emerald-500" : "text-slate-300"
                    }`}
                  />
                  At least 8 characters
                </span>
                <span
                  className={`flex items-center gap-1 font-medium ${
                    hasNumberOrSymbol ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  <LuCheck
                    className={`h-3.5 w-3.5 ${
                      hasNumberOrSymbol ? "text-emerald-500" : "text-slate-300"
                    }`}
                  />
                  1 number or symbol
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <BiLoader className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <LuArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Redirect to Login */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Log in instead
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
