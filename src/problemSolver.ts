const getSetupData = () => ({
  rootCauses: ["internet connection down", "power down at farm", "network partitioned", "sensor out of range", "overloaded deployment", "cloud platform down"],
  questionsAndLikelihood: {
      ['sensor not pinging']:                     ["?", "?", "?", "y", "n", "?"],
      ['base station not pinging']:               ["y", "y", "?", "?", "n", "?"],
      ['avg data quality at farm is low']:        ["?", "?", "?", "?", "?", "?"],
      ['avg data quality for sensor is low']:     ["?", "?", "?", "y", "y", "?"],
      ['fap has very high load']:                 ["?", "?", "?", "?", "y", "?"],
      ['avg latency between fap and bs is high']: ["?", "?", "?", "?", "y", "?"],
      ['sensor has very lowe signal strength']:   ["?", "?", "?", "y", "?", "?"],
      ['fap is not pinging to bs']:               ["?", "?", "y", "?", "?", "?"],
      ['all base stations not pinging']:          ["n", "n", "n", "n", "n", "y"],
      ['all farms have low data quality']:        ["n", "n", "n", "n", "n", "y"]
  }
});

const ProblemSolverActual: ProblemSolver = {
  start() {
    const data = getSetupData();
    const questions = Object.keys(data.questionsAndLikelihood);
    const likelihood = 1 / data.rootCauses.length
    const initialRootCauses = data.rootCauses.map(x => ({description: x, likelihood}))
    return {
      rootCauses: initialRootCauses,
      alreadyAnswered: [],
      questions: questions
    };
  },

  answer(input) {
    return {
      rootCauses: [],
      alreadyAnswered: [],
      questions: []
    };
  }
};

export default ProblemSolverActual;
