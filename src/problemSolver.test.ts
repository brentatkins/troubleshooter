import ProblemSolverActual from "./problemSolver";
import * as R from "ramda";

describe("Problem solver", () => {
  describe("when starting", () => {
    it("all possible problems are equaly likely", () => {
      const result = ProblemSolverActual.start();
      const allLikelikehoods = result.rootCauses.map(x => x.likelihood);
      expect(R.uniq(allLikelikehoods)).toHaveLength(1);
    });

    it("should return a set of questions", () => {
      const result = ProblemSolverActual.start();
      expect(result.questions).toHaveLength(10);
    });

    it("should not have anything already answered", () => {
      const result = ProblemSolverActual.start();
      expect(result.previouslyAnswered).toHaveLength(0);
    });
  });

  describe("when answering a question", () => {
    it("should add the question to the list of already answered questions", () => {
      const startResult = ProblemSolverActual.start();
      const question = startResult.questions[0];
      const answer: Answer = "Yes";
      const actual = ProblemSolverActual.answer({
        previouslyAnswered: [],
        question,
        answer
      });

      expect(actual.previouslyAnswered).toHaveLength(1);
      expect(actual.previouslyAnswered[0]).toEqual({ question, answer });
    });

    it("should not include the question in the list of remaining questions", () => {
      const startResult = ProblemSolverActual.start();
      const question = startResult.questions[0];
      const answer: Answer = "Yes";
      const actual = ProblemSolverActual.answer({
        previouslyAnswered: [],
        question,
        answer
      });

      expect(actual.questions).toHaveLength(9);
      expect(actual.questions).not.toContain(question);
    });

    it("should not include questions answered in previous rounds", () => {
      const startResult = ProblemSolverActual.start();
      const answer: Answer = "Yes";
      const result1 = ProblemSolverActual.answer({
        previouslyAnswered: [],
        question: startResult.questions[0],
        answer
      });
      const result2 = ProblemSolverActual.answer({
        previouslyAnswered: result1.previouslyAnswered,
        question: result1.questions[0],
        answer
      });

      expect(result2.questions).not.toContain(startResult.questions[0]);
      expect(result2.questions).not.toContain(result1.questions[0]);
      expect(result2.questions).toHaveLength(8);
    });

    it("should return all root causes with a liklehood", () => {
      const startResult = ProblemSolverActual.start();
      const answer: Answer = "Yes";
      const result = ProblemSolverActual.answer({
        previouslyAnswered: [],
        question: startResult.questions[0],
        answer
      });

      expect(result.rootCauses).toHaveLength(6);
      result.rootCauses.forEach(x => {
        expect(x.likelihood).toBeGreaterThanOrEqual(0);
        expect(x.likelihood).toBeLessThanOrEqual(1);
      });
    });
  });
});
