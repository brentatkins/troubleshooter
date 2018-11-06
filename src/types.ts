type Question = string;
type Answer = "Yes" | "No" | "Maybe";
type RootCause = {
  description: string;
  likelihood: number;
};

type AnswerToQuestion = {
  question: Question;
  answer: Answer;
};

type ProblemSolverResult = {
  alreadyAnswered: AnswerToQuestion[];
  questions: Question[];
  rootCauses: RootCause[];
};

type ProblemSolverInput = {
  alreadyAnswered: AnswerToQuestion[];
  thisAnswer: AnswerToQuestion;
};

type ProblemSolver = {
  start(): ProblemSolverResult;
  answer(input: ProblemSolverInput): ProblemSolverResult;
};
