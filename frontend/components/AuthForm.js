import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import * as actions from '../state/action-creators'

export function AuthForm(props) {
  const [isNewUser, setIsNewUser] = useState(false)
  const {
    login,
    register,
    authForm,
    inputChange,
    navigate,
    auth,
  } = props

  useEffect(() => {
    if (auth.is_admin) navigate('/admin')
    else if (auth.is_user) navigate('/')
  }, [auth.is_user])

  const onChange = evt => {
    const { name, value } = evt.target
    inputChange({ name, value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    const callback = isNewUser ? register : login
    callback({
      username: authForm.username,
      password: authForm.password,
    })
  }

  const isDisabled = () => {
    return (
      authForm.username.trim().length < 3 ||
      authForm.password.trim().length < 4
    )
  }

  const toggleMode = evt => {
    evt.preventDefault()
    setIsNewUser(!isNewUser)
  }

  return (
    <form id="authForm" onSubmit={onSubmit}>
      <input
        type="text"
        maxLength={200}
        value={authForm.username}
        onChange={onChange}
        placeholder="Enter username"
        name="username"
      />
      <input
        type="password"
        maxLength={100}
        value={authForm.password}
        onChange={onChange}
        placeholder="Enter password"
        name="password"
      />
      <div className="button-group">
        <button className="jumbo-button" disabled={isDisabled()} id="submitCredentials">
          {isNewUser ? "Register New User" : "Login"}
        </button>
      </div>
      <div>
        <a onClick={toggleMode}>
          {isNewUser
            ? "Already have an account? Login instead"
            : "New to the site? Register instead"}
        </a>
      </div>
    </form>
  )
}

export default connect(st => ({
  authForm: st.authForm,
  auth: st.auth,
}), {
  login: actions.login,
  register: actions.register,
  inputChange: actions.inputChange,
})(AuthForm)
