type Question = string;
type Answer = "Yes" | "No" | "Maybe";
type PossibleProblem = {
  description: string;
  likelihood: "Most likely" | "Likely" | "Not Possible";
};
type AnswerToQuestion = {
  question: Question;
  answer: Answer;
};

type ProblemSolverResult = {
  alreadyAnswered: AnswerToQuestion[];
  questions: Question[];
  possibleProblems: PossibleProblem[];
};

type ProblemSolverInput = {
  alreadyAnswered: AnswerToQuestion[];
  thisAnswer: AnswerToQuestion;
};

type ProblemSolver = {
  start(): ProblemSolverResult;
  answer(input: ProblemSolverInput): ProblemSolverResult;
};
