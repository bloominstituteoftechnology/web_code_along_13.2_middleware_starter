import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import QuizForm from './QuizForm'
import QuizList from './QuizList'
import { setMessage } from '../state/action-creators'

export function Admin(props) {
  const { auth, navigate, setMessage } = props

  useEffect(() => {
    if (auth.is_admin === false) {
      navigate('/auth')
      setMessage({ main: 'Not allowed there', code: 'red' })
    }
  }, [auth])

  return (
    <Routes>
      <Route path="quiz/edit" element={<QuizForm navigate={navigate} />} />
      <Route path="/" element={<QuizList navigate={navigate} />} />
    </Routes>
  )
}

export default connect(st => ({ auth: st.auth }), { setMessage })(Admin)
