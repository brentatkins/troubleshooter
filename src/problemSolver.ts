import * as R from "ramda";

const getSetupData = () => ({
  rootCauses: [
    "internet connection down",
    "power down at farm",
    "network partitioned",
    "sensor out of range",
    "overloaded deployment",
    "cloud platform down"
  ],
  questionsAndLikelihood: {
    ["sensor not pinging"]: ["?", "?", "?", "y", "n", "?"],
    ["base station not pinging"]: ["y", "y", "?", "?", "n", "?"],
    ["avg data quality at farm is low"]: ["?", "?", "?", "?", "?", "?"],
    ["avg data quality for sensor is low"]: ["?", "?", "?", "y", "y", "?"],
    ["fap has very high load"]: ["?", "?", "?", "?", "y", "?"],
    ["avg latency between fap and bs is high"]: ["?", "?", "?", "?", "y", "?"],
    ["sensor has very lowe signal strength"]: ["?", "?", "?", "y", "?", "?"],
    ["fap is not pinging to bs"]: ["?", "?", "y", "?", "?", "?"],
    ["all base stations not pinging"]: ["n", "n", "n", "n", "n", "y"],
    ["all farms have low data quality"]: ["n", "n", "n", "n", "n", "y"]
  }
});

const getScore = (answer: Answer, questionCauseLikelihood: string) => {
  if (questionCauseLikelihood === "y") {
    return answer === "Yes" ? 2 : answer === "No" ? 0 : 1;
  } else if (questionCauseLikelihood === "n") {
    return answer === "No" ? 2 : answer === "Yes" ? 0 : 1;
  } else {
    return 1;
  }
};

const ProblemSolverActual: ProblemSolver = {
  start() {
    const data = getSetupData();
    const questions = Object.keys(data.questionsAndLikelihood);
    const likelihood = 1 / data.rootCauses.length;
    const initialRootCauses = data.rootCauses.map(x => ({
      description: x,
      likelihood
    }));
    return {
      rootCauses: initialRootCauses,
      previouslyAnswered: [],
      questions: questions
    };
  },

  answer(input) {
    const data = getSetupData();
    const allQuestions = Object.keys(data.questionsAndLikelihood);
    const previouslyAnswered = [
      ...input.previouslyAnswered,
      { question: input.question, answer: input.answer }
    ];
    const remainingQuestions = allQuestions.filter(
      x => !previouslyAnswered.map(y => y.question).includes(x)
    );

    // build score matrix
    const scores = allQuestions.reduce((acc, q) => {
      const answeredQ = previouslyAnswered.find(a => a.question === q);
      return {
        ...acc,
        [q]: data.questionsAndLikelihood[q].map(
          (c: string) => (answeredQ ? getScore(answeredQ.answer, c) : 0)
        )
      };
    }, {});

    // get total score
    const totalScore = R.compose(
      R.sum,
      R.flatten
    )(Object.values(scores));

    const rootCauses = data.rootCauses.map((x, i) => ({
      description: x,
      likelihood:
        Object.values(scores)
          .map(scoreArray => scoreArray[i])
          .reduce((acc, inc) => acc + inc, 0) / totalScore
    }));

    return {
      rootCauses: rootCauses,
      previouslyAnswered: previouslyAnswered,
      questions: remainingQuestions
    };
  }
};

export default ProblemSolverActual;
