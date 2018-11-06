## Notes:

- user answers questions
- responses are yes, no, maybe
- can jump to a conclusion
- can go back to previous question
- related questions should be clustered together


Component options:
1. Hold internal state
user is presented with a question at each step,
request a new question from component,
returns new question and list of possible problems
holds state internally

2. or, return state with response?
prefer a stateless approach. return a full set of questions,
ordered by priority
accepts a set of responses
returns a all questions (distiguishing between answered and not answered)
and set of possible problems

over API, stateless is much better.
no need to solve problems of storing data for a user
and synchronising users current response to previous responses
also, this is a fairly small dataset, so the amount of information over the wire is tiny
UI is in full control of how to display, questions and problems

Possible process:
1. start questionnaire, no input
    a. returns set of questions, and possible problems (all are equally likely at this stage)
2. send answer to a question
    a. returns set of questions (including previosly answered)
    b. questions are in priority order
    c. also updated set of possible problems (based on responses to questions)
3. new question answered. send new answer (with all previously answered questions)
    a. same as above


API:

`Questionnaire.start();`

- returns: 
```
{
    answered: [],
    questions: ['a...', 'b...', 'c...', 'd...'],
    problems: ['1...', '2...', '3...']
}
```

`Questionnaire.answer();`

- input

```
{
    answered: [],
    question: {
        q: 'a....',
        answer: 'yes'
    }
})
```
- returns:

```
{
    answered: [{q: 'a....', answer: 'yes'}],
    questions: ['b...', 'c...', 'd...'],
    problems: ['1...', '3...']
}
```

### Working out most likely causes

For each answer to a question, assign a score to a root cause, depending on the answer. Score assigned as follows:
- Most likely: 2 points
- Likely: 1 point
- Not likely: 0 points

Determining liekly hood depends on answer and matrix.

When answer is "YES":
 - 2 where root cause "y",
 - 1 where root cause "?",
 - 0 where root case "n"

When answer is "MAYBE":
 - 1 for all root causes

When answer is "NO":
 - 0 where root cause is "y"
 - 1 where root cause is "?"
 - 2 where root cause is "n"

_Note: the points are inverted when the answer is "No". The matrix shows y/n for cases where answer to question is yes_

example:
1. all base stations not pinging
  - Yes
      - internet connection down [not likely - 0]
      - power down at farm [not likely - 0]
      - network partitioned [not likely - 0]
      - Sensor out of range [not likely - 0]
      - overloaded deployment [not likely - 0]
      - cloud platform down [most likely - 2]
  - No
      - internet connection down [most likely - 2]
      - power down at farm [most likely - 2]
      - network partitioned [most likely - 2]
      - Sensor out of range [most likely - 2]
      - overloaded deployment [most likely - 2]
      - cloud platform down [not likely - 0]
  - Maybe (all equaly likely)
      - internet connection down
      - power down at farm
      - network partitioned
      - Sensor out of range
      - overloaded deployment
      - cloud platform down


In memory structure to support this:

{
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
}


## Another option ?
Create a graph, where the questions and root causes are nodes. Edges are only created between questions and root causes that are likely. Could use weighted edges to distiguish between likely and most likely causes.