import * as types from './action-types'
import axiosWithAuth from '../axios'
import { getId, initialQuestionForm } from '../../shared/utils'
import axios from 'axios'

// ======= SYNCHRONOUS ACTION CREATORS =======

// SPINNER
export function spinnerOn() {
  return { type: types.SPINNER_ON }
}
export function spinnerOff() {
  return { type: types.SPINNER_OFF }
}
// INPUTS AND TEXTAREAS
export function inputChange({ name, value }) {
  const payload = { name, value }
  return { type: types.INPUT_CHANGE, payload }
}
// AUTH FORM
export function authFormReset() {
  return { type: types.AUTH_FORM_RESET }
}
// QUESTION FORM
export function questionFormReset() {
  const payload = initialQuestionForm()
  return { type: types.QUESTION_FORM_RESET, payload }
}
export function questionOptionSetCorrect(optionKey) {
  const payload = optionKey
  return { type: types.QUESTION_FORM_SET_CORRECT_OPTION, payload }
}
export function addOption() {
  const payload = getId()
  return { type: types.QUESTION_FORM_OPTION_ADDITION, payload }
}
export function removeOption(optionKey) {
  const payload = optionKey
  return { type: types.QUESTION_FORM_OPTION_REMOVAL, payload }
}
export function questionFormSetExisting(question) {
  const keys = question.options.map(getId)
  const options = {}
  keys.forEach((key, idx) => {
    options[key] = question.options[idx]
  })
  const payload = { ...question, options }
  return { type: types.QUESTION_FORM_SET_EXISTING, payload }
}
// QUIZ SCREEN
export function setQuiz(quiz) {
  const payload = quiz
  return { type: types.SET_QUIZ, payload }
}
export function selectOption(option_id) {
  const payload = option_id
  return { type: types.QUIZ_SET_SELECTED_OPTION, payload }
}
// AUTH
export function setAuthStatus({ is_user, is_admin }) {
  const payload = { is_user, is_admin }
  return { type: types.SET_AUTH_STATUS, payload }
}
// QUIZ LIST
export function setAllQuestions(questions) {
  const payload = questions
  return { type: types.SET_ALL_QUIZZES, payload }
}
// GENERAL
export function reset() {
  return { type: types.RESET }
}
// MESSAGE
export function setMessage({ main, code }) {
  window.scrollTo(0, 0)
  const payload = { main, time: new Date().valueOf(), code }
  return { type: types.SET_INFO_MESSAGE, payload }
}
// STATS
export function setGeneralStats(stats) { // =============== 👉 [Code-Along 10.2] - step 3.1
  const payload = stats
  return { type: types.SET_GENERAL_STATS, payload }
}

// ======= ASYNCHRONOUS ACTION CREATORS =======

export function getGeneralStats() { // =============== 👉 [Code-Along 10.2] - step 3.2
  return function (dispatch) {
    dispatch(spinnerOn())
    axiosWithAuth().get('http://localhost:9000/api/stats/general')
      .then(res => {
        dispatch(setGeneralStats(res.data))
      })
      .catch((err) => {
        dispatch(reset())
        setError(err, dispatch)
      })
      .finally(() => {
        dispatch(spinnerOff())
      })
  }
}
export function register({ username, password }) {
  return function (dispatch) {
    dispatch(spinnerOn())
    axios.post('http://localhost:9000/api/auth/register', { username, password })
      .then(res => {
        dispatch(spinnerOff())
        dispatch(setMessage({ main: res.data.message }))
        dispatch(login({ username, password }))
      })
      .catch(err => {
        dispatch(spinnerOff())
        setError(err, dispatch)
      })
  }
}
export function login({ username, password }) {
  return function (dispatch) {
    dispatch(spinnerOn())
    axios.post('http://localhost:9000/api/auth/login', { username, password })
      .then(res => {
        localStorage.setItem('tk_bloomqz', res.data.token)
        dispatch(spinnerOff())
        dispatch(authFormReset())
        dispatch(setMessage({ main: res.data.message }))
        dispatch(getAuthStatus())
      })
      .catch(err => {
        dispatch(spinnerOff())
        setError(err, dispatch)
      })
  }
}
export function nextQuiz() {
  return function (dispatch) {
    dispatch(spinnerOn())
    axiosWithAuth().get('http://localhost:9000/api/quizzes/next')
      .then(res => {
        dispatch(spinnerOff())
        dispatch(setQuiz(res.data))
      })
      .catch(err => {
        dispatch(spinnerOff())
        setError(err, dispatch)
      })
  }
}
export function answerQuiz({ question_id, option_id, getNext }) {
  return function (dispatch) {
    dispatch(spinnerOn())
    axiosWithAuth().post(
      'http://localhost:9000/api/quizzes/answer',
      { question_id, option_id }
    )
      .then(res => {
        dispatch(spinnerOff())
        dispatch(setMessage({
          main: `${res.data.verdict}`,
          code: res.data.is_correct ? 'green' : 'red',
        }))
        getNext && dispatch(nextQuiz())
      })
      .catch(err => {
        dispatch(spinnerOff())
        setError(err, dispatch)
      })
  }
}
export function createQuestion(question, redirect) { // =============== 👉 [Code-Along 11.2] - step 2
  return function (dispatch) {
    dispatch(spinnerOn())
    axiosWithAuth().post('http://localhost:9000/api/questions', question)
      .then(res => {
        dispatch(spinnerOff())
        dispatch(setMessage({ main: `${res.data.question_title} is a brilliant question` }))
        dispatch(questionFormReset())
        dispatch(setQuiz(res.data))
        redirect()
      })
      .catch(err => {
        dispatch(spinnerOff())
        setError(err, dispatch)
      })
  }
}
export function editQuestion(question, redirect) { // =============== 👉 [Code-Along 11.2] - step 3
  return function (dispatch) {
    dispatch(spinnerOn())
    axiosWithAuth().put('http://localhost:9000/api/questions/' + question.question_id, question)
      .then(res => {
        dispatch(spinnerOff())
        dispatch(setMessage({ main: `Brilliant update` }))
        dispatch(questionFormReset())
        dispatch(setQuiz(res.data))
        redirect()
      })
      .catch(err => {
        dispatch(spinnerOff())
        setError(err, dispatch)
      })
  }
}
export function getAuthStatus() {
  return function (dispatch) {
    axiosWithAuth().get('http://localhost:9000/api/auth/check')
      .then(res => {
        dispatch(setAuthStatus(res.data))
      })
      .catch(() => {
        dispatch(reset())
      })
  }
}
export function getQuizzes() {
  return function (dispatch) {
    dispatch(spinnerOn())
    axiosWithAuth().get('http://localhost:9000/api/questions')
      .then(res => {
        dispatch(setAllQuestions(res.data))
      })
      .catch(err => {
        dispatch(reset())
        setError(err, dispatch)
      })
      .finally(() => {
        dispatch(spinnerOff())
      })
  }
}
export function getQuestionBy({ searchText }) {
  return function (dispatch) {
    dispatch(spinnerOn())
    axiosWithAuth().get(`http://localhost:9000/api/questions/text?text=${searchText}`)
      .then(res => {
        dispatch(setAllQuestions(res.data))
      })
      .catch(err => {
        dispatch(reset())
        setError(err, dispatch)
      })
      .finally(() => {
        dispatch(spinnerOff())
      })
  }
}
function setError(err, dispatch) {
  const errToDisplay = err.response ? err.response.data.message : err.message
  dispatch(setMessage({ main: errToDisplay, code: 'red' }))
}
