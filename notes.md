# Troubleshooting tool

## Notes:

- user answers questions
- responses are yes, no, maybe
- can jump to a conclusion
- can go back to previous question
- related questions should be clustered together

## Initial Qustions

- Are multiple root causes possible?
- Can any root causes be 100% confirmed based on an answer to a question?
- Questions seem to be too technical for end users, are these questions to be automated?
- How big is the question set? How big is the set of root causes?
- Is the questions or root cause set likely to change at some point? How often?
- How does the matrix work?
- Example of a related question

## Design

### System architecture

- WAY too early to determine this. Need to know more about:
  - who are the end users?
  - what are the requirements around usability?
  - how will this be used? via computer? browser? in app? all of these?

**Component options:**

1. Hold internal state

   - user is presented with a question at each step
   - request a new question from component
   - returns new question and list of possible causes
   - holds state internally
   - [+] simple API for consumer
   - [-] need to manage state for each user answering questions

2. or, return state with response?
   - with each response from troubleshooting tool, return then full set of data, this will need to be passed in when answering remainging questions
   - questions are returned in order of priority (to achieve related question clusetering)
   - response also included set of questions answered previously
   - [+] stateless
   - [-] more complicted for consumer of API
   - [+] no need to solve problems of storing data for a user and synchronising users current response to previous responses
   - [+] this is a fairly small dataset, so the amount of information over the wire is tiny
   - [+] consumer in full control of how to display, questions and problems

**Data storage (based on implementation below)**

- easiest option, store a singe document with the matrix as defined in the data struture below.

```
{
    rootCauses: ["A", "B", "C"],
    questionsAndRootCauseLikelihood: {
        'Q1': [1, 2, 3]
    }
}
```

depending on how and the frequency of changes to the data, this may be a pain work with. E.g. if a root cause is removed.

- alternative is to store data in a relational db with tables for
  - RootCauses
  - Questions
  - RootCauseQuestion

Currently a small dataset, so I'd vote for the easiest option.

**Preferred stack**

- Js UI making AJAX calls to an API
- API could be REST based (no need for GraphQL, the schema would be tiny)
- REST API with two endpoints:
  1. get set of questions
  2. answer a question

## Implementation of root cause determination

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
    rootCauses: ['1...', '2...', '3...']
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
    rootCauses: ['1...', '3...']
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

```
{
    rootCauses: ["internet connection down", "power down at farm", "network partitioned", "sensor out of range", "overloaded deployment", "cloud platform down"],
    questionsAndLikelihood: {
        'sensor not pinging':
            ["?", "?", "?", "y", "n", "?"],
        'base station not pinging':
            ["y", "y", "?", "?", "n", "?"],
        'avg data quality at farm is low':
            ["?", "?", "?", "?", "?", "?"],
        'avg data quality for sensor is low':
            ["?", "?", "?", "y", "y", "?"],
        'fap has very high load':
            ['?', '?', '?', '?', 'y', '?']
        'avg latency between fap and bs is high':
            ["?", "?", "?", "?", "y", "?"],
        'sensor has very lowe signal strength':
            ["?", "?", "?", "y", "?", "?"],
        'fap is not pinging to bs':
            ["?", "?", "y", "?", "?", "?"],
        'all base stations not pinging':
            ["n", "n", "n", "n", "n", "y"],
        'all farms have low data quality':
            ["n", "n", "n", "n", "n", "y"]
    }
}
```

### Related question clustering

We could cluster related questions using the current cause with the highest likelihood, and finding unanswered questions that have the biggest increase in likelihood.

### **Another option?**

Create a graph, where the questions and root causes are nodes. Edges are only created between questions and root causes that are likely. Could use weighted edges to distiguish between likely and most likely causes.

## Extras

### Percentage likelihood

That would work well with the above implmentation. The points then becomes a function of the percentage answer from the user, and the root cause likelihood for the answer

### Automate responses

The questions appear to be ones that should be automated, rather than a user answering.
Answers could be calculated by looking at log streams for last X minutes.

### Multiple users troubleshooting the same issue

With a stateless API, this is not a problem

### Train an AI agent

??? Use some decision tree and some form of classification.
