exports.seed = async function (knex) {
  await knex('question_search').truncate()
  await knex('answers').truncate()
  await knex('options').truncate()
  await knex('questions').truncate()
  await knex('users').truncate()
  await knex('roles').truncate()
}
