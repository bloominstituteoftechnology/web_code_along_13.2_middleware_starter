const db = require('../../data/db-config')

async function get(question_ids) {
  const questions = await db('questions') // =============== 👉 [Code-Along 14.1] - step 2
    .select('question_title', 'question_text', 'question_id')
    .orderBy('updated_at', 'desc')
    .whereIn('question_id', question_ids)
  const options = await db('options')
    .select('option_id', 'option_text', 'is_correct', 'remark', 'question_id')
    .whereIn('question_id', question_ids)
  questions.forEach(q => { // =============== 👉 [Code-Along 14.1] - step 4
    q.options = []
    options.forEach(o => {
      if (o.question_id === q.question_id) {
        q.options.push({
          option_id: o.option_id,
          option_text: o.option_text,
          is_correct: !!o.is_correct,
          remark: o.remark,
        })
      }
    })
  })
  return questions
}

async function getAll() {
  const rows = await db('questions as q') // =============== 👉 [Code-Along 14.2] - step 2
    .join('options as o', 'q.question_id', 'o.question_id')
    .orderBy('q.updated_at', 'desc')
    .select(
      'q.question_id', 'q.question_title', 'q.question_text',
      'o.option_id', 'o.option_text', 'o.remark', 'o.is_correct'
    )
  const reduced = rows.reduce((acc, row) => { // =============== 👉 [Code-Along 14.2] - step 4
    const q = {
      question_title: row.question_title,
      question_text: row.question_text,
      question_id: row.question_id,
    }
    const o = {
      option_id: row.option_id,
      option_text: row.option_text,
      is_correct: !!row.is_correct,
      remark: row.remark,
    }
    if (acc.has(q.question_id)) {
      const question = acc.get(q.question_id)
      question.options.push(o)
    } else {
      acc.set(q.question_id, { ...q, options: [o] })
    }
    return acc
  }, new Map)
  return Array.from(reduced.values())
}

async function create(question) {
  let created_question_id
  await db.transaction(async trx => {
    let { options, ...rest } = question
    const [question_id] = await trx('questions').insert(rest)
    options = options.map(option => ({ ...option, question_id }))
    await trx('options').insert(options)
    created_question_id = question_id
  })
  const [created_question] = await get([created_question_id])
  return created_question
}

async function editById(question_id, { options, ...rest }) {
  await db.transaction(async trx => {
    await trx('options').where('question_id', question_id).delete()
    const promises = options.map(option => {
      return trx('options').where('option_id', option.option_id).insert({ ...option, question_id })
    })
    await Promise.all(promises)
    const { question_title, question_text } = rest
    await trx('questions').where('question_id', question_id)
      .update({ question_title, question_text })
  })
  const [editedQuestion] = await get([question_id])
  return editedQuestion
}

async function getByText({ text }) {
  const questions = await db.raw(`
    SELECT question_id FROM question_search WHERE question_search MATCH ?;
  `, [text])
  const result = await get(questions.map(q => q.question_id))
  return result
}

module.exports = {
  getAll,
  create,
  editById,
  getByText,
  get,
}
