import React from "react";
import { Link } from "react-router";
import { LuArrowRight, LuSparkles } from "react-icons/lu";
import { BiCode } from "react-icons/bi";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-3 py-1 text-xs font-semibold text-indigo-700">
            <LuSparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Automated AI Architecture Evaluations</span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Master Low-Level Design with Real Code & Feedback
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Stop drawing abstract boxes on whiteboards. Implement real design
            patterns, class hierarchies, and schemas in Java, C++, or
            TypeScript—then get instant design reviews.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/problems"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 sm:w-auto cursor-pointer"
            >
              <BiCode className="h-4 w-4" />
              <span>Explore Problems</span>
              <LuArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/signup"
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 sm:w-auto cursor-pointer"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
