import ProblemSolverActual from "./problemSolver";
import * as R from "ramda";

describe("Problem solver", () => {
  describe("when starting", () => {
    it("all possible problems are equaly likely", () => {
      const result = ProblemSolverActual.start();
      const allLikelikehoods = result.possibleProblems.map(x => x.likelihood);
      expect(R.uniq(allLikelikehoods)).toHaveLength(1);
    });
  });
});
