exports.seed = async function (knex) {
  await knex('questions').insert([
    {
      question_title: 'Bilbo\'s Pocket',
      question_text: 'What\'s in Bilbo\'s pocket?',
    },
    {
      question_title: 'Reassignment of Vars Declared with "const"',
      question_text: `What is wrong with the following code?\n
\`\`\`js
  const pioneer = "Ada Lovelace";
  pioneer = "foo";
\`\`\``
    },
    {
      question_title: 'Closures',
      question_text: 'What is a _closure_?',
    },
    {
      question_title: 'Median of A Sorted, Even-Length Array of Numbers',
      question_text: 'The **median** of a sorted, even-length array of numbers is the ＿ of the two middle elements.',
    },
    {
      question_title: 'Models in Machine Learning',
      question_text: 'What is a _model_ in machine learning?',
    },
    {
      question_title: 'The Remember-Formulate-Predict Framework',
      question_text: 'How do _humans_ think?',
    },
  ])
  await knex('options').insert([
    {
      option_text: 'The One Ring.',
      is_correct: true,
      question_id: 1,
    },
    {
      option_text: 'Hand.',
      is_correct: false,
      question_id: 1,
    },
    {
      option_text: 'Nothing.',
      is_correct: false,
      question_id: 1,
    },
    {
      option_text: 'Variables declared with `const` may not be re-assigned.',
      is_correct: true,
      question_id: 2,
    },
    {
      option_text: 'Variables declared with `const` may not be re-declared.',
      is_correct: false,
      question_id: 2,
    },
    {
      option_text: 'A function object plus bindings.',
      is_correct: true,
      question_id: 3,
    },
    {
      option_text: 'A function binding plus `this`.',
      is_correct: false,
      question_id: 3,
    },
    {
      option_text: "average",
      is_correct: true,
      question_id: 4,
    },
    {
      option_text: "median",
      is_correct: false,
      question_id: 4,
    },
    {
      option_text: "mean",
      is_correct: false,
      question_id: 4,
    },
    {
      option_text: "A representation of reality using a set of rules that mimic the existing data as closely as possible.",
      is_correct: true,
      question_id: 5,
    },
    {
      option_text: "The data that represents the predictions that can be made about our rules.",
      is_correct: false,
      question_id: 5,
    },
    {
      option_text: "Remember, formulate, predict.",
      is_correct: true,
      question_id: 6,
    },
    {
      option_text: "Formulate, predict, remember.",
      is_correct: false,
      question_id: 6,
    },
    {
      option_text: "Predict, formulate, remember.",
      is_correct: false,
      question_id: 6,
    },
  ])
}
