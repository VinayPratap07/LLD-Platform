import React from "react";
import { Link } from "react-router";
import { LuLayers, LuGithub, LuTwitter, LuLinkedin } from "react-icons/lu";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
          {/* Brand Info (Spans 2 columns on desktop) */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                <LuLayers className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900">
                LLD Platform
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-slate-600">
              A hands-on platform designed to bridge the gap between abstract
              object-oriented principles and production-grade low-level design
              implementations.
            </p>
            <div className="flex items-center gap-3 pt-1 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <LuGithub className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="Twitter"
              >
                <LuTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-1.5 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <LuLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link
                  to="/problems"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  All Problems
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Submission History
                </Link>
              </li>
              <li>
                <Link
                  to="/patterns"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Design Patterns
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Pro Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Resources
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="#solid"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  SOLID Cheat Sheet
                </a>
              </li>
              <li>
                <a
                  href="#concurrency"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Concurrency Guide
                </a>
              </li>
              <li>
                <a
                  href="#uml"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  UML Diagrams 101
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Engineering Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Links: Legal & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="#about"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} LLD Platform. All rights reserved.
          </p>
          <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500 sm:mt-0">
            <span>
              Status:{" "}
              <strong className="font-semibold text-emerald-600">
                All Systems Operational
              </strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
