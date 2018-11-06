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
      expect(result.alreadyAnswered).toHaveLength(0);
    });
  });

  describe('when answering a question', () => {
    it('should add the question to the list of already answered questions', () => {
      const startResult = ProblemSolverActual.start();
      const question = startResult.questions[0];
      
      const actual = ProblemSolverActual.answer({alreadyAnswered: [], thisAnswer: {question, answer: 'Yes'}});
      
      expect(actual.alreadyAnswered).toHaveLength(1);
      expect(actual.alreadyAnswered[0]).toEqual(question);
    })
  });
});
