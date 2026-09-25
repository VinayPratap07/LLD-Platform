import { useQuery } from "@tanstack/react-query";
import { ProblemList } from "../Components/ProblemList";
import { getProblems } from "../API/ProblemsApi/API.Calls";

// Replace with router hook if using Next.js/React Router (e.g. useNavigate() or useRouter())
export default function ProblemsPage() {
  const {
    isLoading,
    error,
    data: problemRes,
  } = useQuery({
    queryKey: ["problems"],
    queryFn: getProblems,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const handleSelectProblem = (id: string) => {
    // Navigate via your client-side router
    window.location.assign(`/solution/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <main className="min-vh-screen bg-slate-100/60 py-10 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System Design Problems
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Select a scenario to view requirements and review the solution
          architecture.
        </p>
      </div>
      <ProblemList
        problems={problemRes.data}
        onSelectProblem={handleSelectProblem}
      />
    </main>
  );
}
