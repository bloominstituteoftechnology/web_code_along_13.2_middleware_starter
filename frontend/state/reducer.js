import { combineReducers } from 'redux'
import * as types from './action-types'
import { initialQuestionForm } from '../../shared/utils'

const initialSearch = { searchText: '' } // =============== 👉 [Code-Along 10.1] - step 1.1
function quizSearchForm(state = initialSearch, action) {
  switch (action.type) {
    case types.RESET:
      return initialSearch
    case types.INPUT_CHANGE: {
      const { name, value } = action.payload
      if (Object.keys(state).includes(name)) {
        return { ...state, [name]: value }
      }
      return state
    }
    default:
      return state
  }
}

const initialAuth = { is_user: null, is_admin: null }
function auth(state = initialAuth, action) {
  switch (action.type) {
    case types.RESET:
      return initialAuth
    case types.SET_AUTH_STATUS:
      return action.payload
    default:
      return state
  }
}

const initialAuthForm = {
  username: '', password: ''
}
function authForm(state = initialAuthForm, action) {
  switch (action.type) {
    case types.RESET:
    case types.AUTH_FORM_RESET:
      return initialAuthForm
    case types.INPUT_CHANGE: {
      const { name, value } = action.payload
      if (Object.keys(state).includes(name)) {
        return { ...state, [name]: value }
      }
      return state
    }
    default:
      return state
  }
}

const initialMessage = { main: 'Welcome to BloomQuiz', code: 'blue', time: null }
function infoMessage(state = initialMessage, action) {
  switch (action.type) {
    case types.RESET:
      return initialMessage
    case types.SET_INFO_MESSAGE:
      return action.payload
    default:
      return state
  }
}

function quizForm(state = initialQuestionForm(), action) {
  switch (action.type) {
    case types.QUESTION_FORM_RESET:
      return action.payload
    case types.QUESTION_FORM_SET_EXISTING:
      return action.payload
    case types.INPUT_CHANGE: {
      const { name, value } = action.payload
      if (Object.keys(state).includes(name)) {
        return { ...state, [name]: value }
      }
      const [optionName, optionKey] = name.split('-')
      const options = state.options
      if (optionKey && Object.keys(options).includes(optionKey)) {
        const option = state.options[optionKey]
        return {
          ...state,
          options: {
            ...options,
            [optionKey]: { ...option, [optionName]: value },
          }
        }
      }
      return state
    }
    case types.QUESTION_FORM_SET_CORRECT_OPTION: {
      const options = { ...state.options }
      for (let key in options) {
        options[key].is_correct = key === action.payload
      }
      return { ...state, options }
    }
    case types.QUESTION_FORM_OPTION_ADDITION: {
      const { options } = state
      const optionKey = action.payload
      if (Object.keys(options).length >= 10) return state
      return {
        ...state,
        options: {
          ...options,
          [optionKey]: { option_text: '', is_correct: false, remark: '' }
        }
      }
    }
    case types.QUESTION_FORM_OPTION_REMOVAL: {
      const options = { ...state.options }
      if (Object.keys(options).length <= 2) return state
      const isNonDistractor = options[action.payload].is_correct
      delete options[action.payload]
      if (isNonDistractor) {
        Object.values(options)[0].is_correct = true
      }
      return { ...state, options }
    }
    default:
      return state
  }
}

const initialQuiz = {}
function quiz(state = initialQuiz, action) {
  switch (action.type) {
    case types.RESET:
      return initialQuiz
    case types.SET_QUIZ:
      return { option_id: null, question: action.payload }
    case types.QUIZ_SET_SELECTED_OPTION:
      return { ...state, option_id: action.payload }
    default:
      return state
  }
}

const initialQuizList = []
function quizList(state = initialQuizList, action) {
  switch (action.type) {
    case types.RESET:
      return initialQuizList
    case types.SET_ALL_QUIZZES:
      return action.payload
    default:
      return state
  }
}

function spinnerOn(state = false, action) {
  switch (action.type) {
    case types.SPINNER_OFF:
      return false
    case types.SPINNER_ON:
      return true
    default:
      return state
  }
}

const initialStats = null // =============== 👉 [Code-Along 10.2] - step 1.1
function stats(state = initialStats, action) {
  switch (action.type) {
    case types.RESET:
      return initialStats
    case types.SET_GENERAL_STATS:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
  authForm,
  quizForm,
  quiz,
  infoMessage,
  auth,
  quizList,
  spinnerOn,
  stats, // =============== 👉 [Code-Along 10.2] - step 1.2
  quizSearchForm, // =============== 👉 [Code-Along 10.1] - step 1.2
})
