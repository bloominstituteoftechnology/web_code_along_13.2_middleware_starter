import React from 'react'
import { connect } from 'react-redux'

export function Opacity(props) {
  return (
    <div className="container" style={{ opacity: props.on ? 0.1 : 1 }}>
      {props.children}
    </div>
  )
}

export default connect(st => ({
  on: st.spinnerOn
}))(Opacity)
