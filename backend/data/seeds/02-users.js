exports.seed = async function (knex) {
  await knex('roles').insert([
    { role_name: 'admin' },
    { role_name: 'user' },
  ])
  await knex('users').insert([
    {
      username: 'admin',
      password: '$2a$08$4l1HDVyObbVciA/HZJV2FOcIlmzWu7QDS9qY3fBro8m7BqbOwZ.de',
      role_id: 1,
    },
    {
      username: 'foo',
      password: '$2a$08$6uJCTkDmKrYDHIWZBTWtN.TwJ1nAHwgq0/YxK7UroGv0ddd0vbcka',
      role_id: 2,
    },
  ])
}
