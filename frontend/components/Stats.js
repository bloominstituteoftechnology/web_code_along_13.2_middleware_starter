import React, { useEffect } from 'react' // =============== 👉 [Code-Along 10.2] - step 4.1
import { connect } from 'react-redux'
import * as actions from '../state/action-creators'

export function Stats(props) {
  const {
    auth, // =============== 👉 [Code-Along 11.1] - step 3.3
    setMessage,
    navigate,
    stats, // =============== 👉 [Code-Along 10.2] - step 5.1
    getGeneralStats,
  } = props

  // =============== 👉 [Code-Along 10.2] - step 5.2

  useEffect(() => { // =============== 👉 [Code-Along 11.1] - step 4
    if (auth.is_user === false) {
      navigate('/auth')
      setMessage({ main: 'Not allowed there', code: 'red' })
    }
  }, [auth])

  useEffect(() => {
    // =============== 👉 [Code-Along 10.2] - step 5.3
    getGeneralStats()
  }, [])

  if (!stats) return null

  return (
    <div id="stats">
      <h1>{stats.corrects}</h1>correct answers
      <h1>{stats.incorrects}</h1>incorrect answers
    </div>
  )
}

export default connect(st => ({
  // mapping state to props
  stats: st.stats, // =============== 👉 [Code-Along 10.2] - step 4.2
  auth: st.auth, // =============== 👉 [Code-Along 11.1] - step 3.2
}), {
  // action creators
  getGeneralStats: actions.getGeneralStats,
  setMessage: actions.setMessage,
})(Stats)
