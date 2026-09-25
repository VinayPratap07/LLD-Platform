import React from "react";
import { BiPlayCircle } from "react-icons/bi";
import { LuFileCode2, LuCheckCheck } from "react-icons/lu";

const STEPS = [
  {
    step: "01",
    title: "Select an LLD Scenario",
    description:
      "Pick classic interview architectures: Parking Lot, Rate Limiter, Splitwise, or Cache System.",
    icon: LuFileCode2,
  },
  {
    step: "02",
    title: "Write Clean OO Code",
    description:
      "Implement design patterns, apply SOLID principles, and manage spot/ticket allocations.",
    icon: BiPlayCircle,
  },
  {
    step: "03",
    title: "Get Automated Evaluation",
    description:
      "Receive detailed architectural assessments: extensibility, concurrency, and SOLID compliance.",
    icon: LuCheckCheck,
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="border-b border-slate-200/80 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Workflow
          </h2>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            From Requirements to Architect-Grade Code
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map(({ step, title, description, icon: Icon }) => (
            <div
              key={step}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {step}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
