import React from 'react'
import styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'

const rotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
`

const opacity = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`

const StyledSpinner = styled.div`
  animation: ${opacity} 0.5s infinite linear;

  h3 {
    transform-origin: center center;
    animation: ${rotation} 1s infinite linear;
  }
`

export function Spinner({ on }) {
  if (!on) return null
  return (
    <StyledSpinner id="spinner">
      <h3>&nbsp;.</h3>&nbsp;&nbsp;&nbsp;Please wait...
    </StyledSpinner>
  )
}

export default connect(st => ({
  on: st.spinnerOn
}))(Spinner)
