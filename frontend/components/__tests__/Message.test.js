import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

// see how we are importing the non-connected (to Redux) version of the component
import { Message } from '../Message'

// to test this component in isolation, without an API, run
// `npm run jest:test -- Message.test.js`

const renderApp = ui => {
  window.localStorage.clear()
  window.history.pushState({}, 'Test page', '/')
  return render(ui)
}
beforeEach(() => { // =============== 👉 [Code-Along 9.2] - step 5
  const infoMessage = { main: 'Welcome', time: new Date().valueOf() }
  renderApp(<Message infoMessage={infoMessage} />)
})

it('renders the main message', () => {
  screen.getByText('Welcome')
})
it('renders `bloomquiz` after mounting', () => {
  const spans = document.querySelectorAll('h1 span')
  const stateInitial = 'bloomquiz'
  spans.forEach((span, idx) => {
    expect(span.textContent).toBe(stateInitial[idx])
  })
})
it('renders `Bloomquiz` after first click', () => {
  fireEvent.click(screen.getByText('Welcome'))
  const spans = document.querySelectorAll('h1 span')
  const stateFirstClick = 'Bloomquiz'
  spans.forEach((span, idx) => {
    expect(span.textContent).toBe(stateFirstClick[idx])
  })
})
it('renders `bLoomquiz` after second click', () => {
  fireEvent.click(screen.getByText('Welcome'))
  fireEvent.click(screen.getByText('Welcome'))
  const spans = document.querySelectorAll('h1 span')
  const stateSecondClick = 'bLoomquiz'
  spans.forEach((span, idx) => {
    expect(span.textContent).toBe(stateSecondClick[idx])
  })
  // screen.debug() // to see the simulated DOM
})
