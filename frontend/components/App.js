import React from 'react'
// router
import { BrowserRouter } from 'react-router-dom'
import Routing from './Routing'
// redux
import { Provider as StoreProvider } from 'react-redux'
import { legacy_createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../state/reducer'

let store
export const resetStore = () => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  store = legacy_createStore(reducer, composeEnhancers(applyMiddleware(thunk)))
}
resetStore()

export default function App() {
  return (
    <StoreProvider store={store}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </StoreProvider>
  )
}
