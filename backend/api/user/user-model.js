const db = require('../../data/db-config')

async function insert(user) {
  const [user_id] = await db('users').insert({ ...user, role_id: 2 })
  return db('users').where({ user_id }).first()
}

function getByUsername(username) {
  return db('users').where({ username }).first()
}

module.exports = {
  insert,
  getByUsername,
}
