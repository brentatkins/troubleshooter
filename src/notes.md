### Notes:


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

Questionnaire.start();

- returns: 
{
    answered: [],
    questions: ['a...', 'b...', 'c...', 'd...'],
    problems: ['1...', '2...', '3...']
}

Questionnaire.answer({
    answered: [],
    question: {
        q: 'a....',
        answer: 'yes'
    }
})

- returns: 
{
    answered: [{q: 'a....', answer: 'yes'}],
    questions: ['b...', 'c...', 'd...'],
    problems: ['1...', '3...']
}
