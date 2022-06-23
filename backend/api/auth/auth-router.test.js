import db from '../../data/db-config'
import server from './../../server'
import request from 'supertest'

jest.setTimeout(750)

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async () => {
  await db.destroy()
})
beforeEach(async () => {
  await db.seed.run()
})

test('environmnet', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})
describe('[POST] /api/auth/login', () => { // =============== 👉 [Code-Along 15.2] - step 5
  test('responds with message and token on successful login', async () => {
    const res = await request(server).post('/api/auth/login')
      .send({ username: 'admin', password: 'admin' })
    expect(res.body.message).toMatch(/welcome, admin/i)
    expect(res.body).toHaveProperty('token')
  })
  test('responds with status 401 and error message on bad credentials', async () => {
    const res = await request(server).post('/api/auth/login')
      .send({ username: 'admin', password: 'BAD_PASSWORD' })
    expect(res.body.message).toMatch(/invalid credentials/i)
    expect(res.status).toBe(401)
  })
})
