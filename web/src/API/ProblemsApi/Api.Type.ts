export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Problem {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  difficulty: Difficulty;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProblemListProps {
  problems: Problem[];
  onSelectProblem?: (problemId: string) => void;
}
