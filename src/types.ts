type Question = string;
type Answer = "Yes" | "No" | "Maybe";
type RootCause = {
  description: string;
  likelihood: number;
};

type AnsweredQuestion = {
  question: Question;
  answer: Answer;
};

type ProblemSolverResult = {
  previouslyAnswered: AnsweredQuestion[];
  questions: Question[];
  rootCauses: RootCause[];
};

type ProblemSolverInput = {
  previouslyAnswered: AnsweredQuestion[];
  question: Question;
  answer: Answer;
};

type ProblemSolver = {
  start(): ProblemSolverResult;
  answer(input: ProblemSolverInput): ProblemSolverResult;
};
