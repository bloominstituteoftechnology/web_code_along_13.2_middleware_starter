import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App, { resetStore } from '../App'
import db from '../../../backend/data/db-config'

// To test the whole app, API included, execute `npm run test`
// This will crash the `dev` script, which can be easily restarted by typing `rs`
// or by making any change in the code

jest.setTimeout(750)
const waitForOptions = { timeout: 150 }
const queryOptions = { exact: false }

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

const renderApp = ui => {
  resetStore()
  window.localStorage.clear()
  window.history.pushState({}, 'Test page', '/')
  return render(ui)
}
beforeEach(() => {
  renderApp(<App />)
})

it('renders without errors', async () => {
  await screen.findAllByText('Select', queryOptions, waitForOptions)
})
describe('logout', () => { // =============== 👉 [Code-Along 11.1] - step 5
  beforeEach(async () => {
    fireEvent.click(screen.getByText('Sign in to save your progress'))
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'foo' } })
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: '1234' } })
    fireEvent.click(screen.getByText('Login'))
    await screen.findAllByText('Select', queryOptions, waitForOptions)
  })
  it('log in redirects to quizzes screen', async () => {
    expect(screen.queryByText('Sign in to save your progress')).not.toBeInTheDocument()
  })
  it('log out redirects back to login screen', async () => {
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Logout'))
    screen.getByText('Login')
  })
})
