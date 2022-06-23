const db = require('../../data/db-config')
const { randomizeArray } = require('../../../shared/utils')

/**
 * @returns {String}
 */
async function getRandomQuizId() {
  const [{ question_id }] = await db.raw(`
    SELECT question_id FROM questions ORDER BY RANDOM() LIMIT 1
  `)
  return question_id
}

/**
 * @param {{ role_id: Number }} user
 * @returns {Object}
 */
async function getRandomQuiz({ role_id }) {
  const question_id = await getRandomQuizId()
  const quiz = await getQuiz({ question_id, role_id })
  return quiz
}
// =============== 👉 [Code-Along 15.2] - step 1
/**
 * @param {{ question_id: Number, role_id: Number }} user
 * @returns {Object}
 *
 * Example `getQuiz({ question_id: 1, role_id: 2 })` (non-admin role)
 *
 * {
 *    question_id: 1,
 *    question_text: "What's in Bilbo's pocket?",
 *    options: [
 *      { option_id: 1, option_text: 'The One Ring.' },
 *      { option_id: 2, option_text: 'Hand.' },
 *      { option_id: 3, option_text: 'Nothing.' },
 *    ]
 * }
 *
 * Example `getQuiz({ question_id: 1, role_id: 1 })` (admin role)
 *
 * {
 *    question_id: 1,
 *    question_title: "Bilbo's Ring"
 *    question_text: "What's in Bilbo's pocket?",
 *    options: [
 *      { option_id: 1, option_text: 'The One Ring.', is_correct: true },
 *      { option_id: 2, option_text: 'Hand.', is_correct: false },
 *      { option_id: 3, option_text: 'Nothing.', is_correct: false },
 *    ]
 * }
 */
async function getQuiz({ question_id, role_id }) {
  // const rows = await db.raw(`
  //   SELECT
  //     q.question_id, q.question_text, q.question_title,
  //     o.option_id, o.option_text, o.is_correct
  //   FROM questions q
  //   JOIN options o
  //     ON q.question_id = o.question_id
  //   WHERE q.question_id = ?
  // `, [question_id])

  const rows = await db('questions as q') // =============== 👉 [Code-Along 15.2] - step 3
    .join('options as o', 'q.question_id', ' o.question_id')
    .select(
      'q.question_id',
      'q.question_text',
      'q.question_title',
      'o.option_id',
      'o.option_text',
      'o.is_correct',
    )
    .where('q.question_id', question_id)

  let result = { options: [] }

  for (let row of rows) {
    if (!result.question_id) {
      result.question_id = row.question_id
      result.question_text = row.question_text

      if (role_id === 1) { // admin user
        result.question_title = row.question_title
      }
    }
    const option = {
      option_id: row.option_id,
      option_text: row.option_text,
    }
    if (role_id === 1) { // admin user
      option.is_correct = !!row.is_correct
    }
    result.options.push(option)
  }

  result.options = randomizeArray(result.options)
  return result
}

// =============== 👉 [Code-Along 13.1] - step 2
/**
 * @param {{ user_id: Number, role_id: Number }} user
 * @returns {Object}
 */
async function nextQuiz({ user_id, role_id }) {
  if (user_id) {
    // TODO: build intelligent quiz choosing based on the history of answers of the user
  }
  const randomQuiz = await getRandomQuiz({ role_id })
  return randomQuiz
}

/**
 * @param {{ question_id: number, option_id: number, user_id: number }} answer
 * @returns {Object}
 */
async function answerQuiz({ question_id, option_id, user_id }) {
  const option = await db('options').where('option_id', option_id).first()
  if (user_id && user_id != 1) {
    await db('answers').insert({ user_id, question_id, correctly_answered: option.is_correct })
  }
  return {
    remark: option.remark,
    is_correct: !!option.is_correct,
    verdict: `You are ${option.is_correct ? "CORRECT" : "incorrect"}`,
  }
}

module.exports = {
  getRandomQuizId,
  getQuiz,
  getRandomQuiz,
  nextQuiz,
  answerQuiz,
}
