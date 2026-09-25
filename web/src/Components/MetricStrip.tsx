import React from "react";
import { BiCheckCircle } from "react-icons/bi";
import { LuClock, LuZap, LuUsers } from "react-icons/lu";

const STATS = [
  { label: "Targeted LLD Problems", value: "50+", icon: BiCheckCircle },
  { label: "Supported Languages", value: "Java, C++, TS", icon: LuZap },
  { label: "Average Evaluation Time", value: "< 90s", icon: LuClock },
  { label: "Active Engineers", value: "10,000+", icon: LuUsers },
];

export const MetricStrip: React.FC = () => {
  return (
    <section className="border-b border-slate-200/80 bg-slate-50/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-xl border border-slate-200/70 bg-white p-4 text-center shadow-xs"
            >
              <Icon className="h-5 w-5 text-indigo-600 mb-2" />
              <div className="font-mono text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {value}
              </div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
