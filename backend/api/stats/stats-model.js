const db = require('../../data/db-config')

async function generalStats(user_id) {
  const [{ corrects }] = await db('answers')
    .where({ user_id, correctly_answered: true })
    .count('answer_id as corrects')
  const [{ incorrects }] = await db('answers')
    .where({ user_id, correctly_answered: false })
    .count('answer_id as incorrects')
  return {
    corrects,
    incorrects,
  }
}

module.exports = {
  generalStats,
}
