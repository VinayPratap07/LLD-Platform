export type EvaluationStatus = "Evaluating" | "Completed" | "Failed";
export type ProblemDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface Evaluation {
  _id: string;
  submissionId: string;
  evaluationType: "AI" | "MANUAL" | string;
  status: EvaluationStatus;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface PopulatedProblem {
  _id: string;
  title: string;
  difficulty: ProblemDifficulty;
}

export interface Submission {
  _id: string;
  id?: string;
  userId: string;
  problemId: PopulatedProblem; // Populated object from API
  contentType: "CODE" | string;
  language: string;
  submittedContent: string;
  evaluation: Evaluation;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface SubmissionListProps {
  submissions: Submission[];
  onViewEvaluation?: (submissionId: string, evaluationId?: string) => void;
}
