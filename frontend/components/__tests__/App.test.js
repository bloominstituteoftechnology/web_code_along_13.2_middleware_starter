import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import App, { resetStore } from '../App'
import db from '../../../backend/data/db-config'

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
