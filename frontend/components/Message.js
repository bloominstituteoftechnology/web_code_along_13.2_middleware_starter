import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'

const opacity = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

const getColor = code => {
  switch (code) {
    case 'blue': return '#3a3a7b'
    case 'green': return '#70b02f'
    case 'red': return '#dc004b'
    default: return '#3a3a7b' // blue
  }
}

const StyledMessage = styled.div`
  background-color: ${pr => getColor(pr.code)};
  animation: ${opacity} 1s forwards;
`

function useHeading(headingStr) { // =============== 👉 [Code-Along 9.2] - step 1
  const lowCase = headingStr
  const upperCase = headingStr.toUpperCase()

  const maxIndex = headingStr.length - 1 // =============== 👉 [Code-Along 9.2] - step 2
  const [index, setIndex] = useState(-1)

  const changeHeadingArr = () => { // =============== 👉 [Code-Along 9.2] - step 3
    const nextIndex = index === maxIndex ? 0 : index + 1
    setIndex(nextIndex)
  }

  const headingArr = lowCase.split('').map((char, idx) => {
    return index === idx ? upperCase[idx] : lowCase[idx]
  })

  return [headingArr, changeHeadingArr]
}

export function Message({ infoMessage }) {
  const { main, code, time } = infoMessage
  const [heading, clickHandler] = useHeading('bloomquiz')
  return (
    <StyledMessage key={time} code={code} id="message" onClick={clickHandler}>
      <h1>
        {
          heading.map((char, idx) => {
            const opacity = char === 'BLOOMQUIZ'[idx] ? 1 : 0.4 // =============== 👉 [Code-Along 9.2] - step 4
            return <span style={{ opacity }} key={idx}>{char}</span>
          })
        }
      </h1>
      <span>{main}</span>
    </StyledMessage>
  )
}

export default connect(st => ({ infoMessage: st.infoMessage }))(Message)
