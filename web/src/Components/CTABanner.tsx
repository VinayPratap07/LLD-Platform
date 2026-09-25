import { Link } from "react-router";
import { LuArrowRight } from "react-icons/lu";

export const CallToAction = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-8 sm:p-12 text-center shadow-xs">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Ready to Clear Your LLD Technical Interviews?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            Practice real code implementations, receive immediate design
            critique, and track your growth over time.
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 cursor-pointer"
            >
              <span>Get Started Now</span>
              <LuArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
