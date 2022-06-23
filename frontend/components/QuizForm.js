import React from 'react'
import { connect } from 'react-redux'
import {
  addOption,
  removeOption,
  inputChange,
  questionOptionSetCorrect,
  createQuestion,
  editQuestion,
} from '../state/action-creators'

import styled, { keyframes } from 'styled-components' // =============== 👉 [Code-Along 9.1] - step 5.1

const scale = keyframes`
  100% { transform: scaleY(1); }
`

const StyledInputGroup = styled.div`
  transform: scaleY(0);
  transform-origin: top center;
  animation: ${scale} 0.15s forwards;
`

export class QuizForm extends React.Component {
  constructor(props) { // =============== 👉 [Code-Along 9.1] - step 1
    super(props)
    const optionBars = {}
    const { options } = props.quizForm
    Object.keys(options).forEach(key => { optionBars[key] = false })
    this.state = { optionBars }
  }
  toggleBar = optionKey => () => { // =============== 👉 [Code-Along 9.1] step 2.1
    const { optionBars } = this.state
    this.setState({
      ...this.state,
      optionBars: {
        ...optionBars,
        [optionKey]: !optionBars[optionKey],
      },
    })
  }
  onRedirect = path => evt => {
    if (evt) evt.preventDefault()
    this.props.navigate(path)
  }
  onAddOption = evt => {
    evt.preventDefault()
    this.props.addOption()
  }
  onRemoveOption = optionKey => evt => {
    evt.preventDefault()
    this.props.removeOption(optionKey)
  }
  onTextChange = ({ target: { name, value } }) => {
    this.props.inputChange({ name, value })
  }
  onQuestionSetCorrect = optionKey => () => {
    this.props.questionOptionSetCorrect(optionKey)
  }
  onSubmit = evt => { // =============== 👉 [Code-Along 11.2] - step 1
    evt.preventDefault()
    const { quizForm, editQuestion, createQuestion } = this.props
    const payload = { ...quizForm, options: Object.values(quizForm.options) }
    const callback = quizForm.question_id ? editQuestion : createQuestion
    callback(payload, this.onRedirect('/'))
  }
  render() {
    const { quizForm } = this.props
    const plusButton = <>&#10060;</>
    const downArrow = <>&#9660;&nbsp;&nbsp;</>
    const rightArrow = <>&#9658;&nbsp;&nbsp;</>

    return (
      <form id="quizForm" onSubmit={this.onSubmit}>
        <h2>{quizForm.question_id ? "Edit" : "Create New"} Question</h2>
        <input
          type="text"
          maxLength={50}
          placeholder="Question title"
          name="question_title"
          value={quizForm.question_title}
          onChange={this.onTextChange}
        />
        <textarea
          maxLength={400}
          placeholder="Question text"
          name="question_text"
          value={quizForm.question_text}
          onChange={this.onTextChange}
        />
        <div className="options-heading">
          <h2>Options</h2><button className="option-operation" onClick={this.onAddOption}>➕</button>
        </div>
        {
          Object.keys(quizForm.options).map((optionKey, idx) => {
            const optionHeading = <>Option {idx + 1} &nbsp;&nbsp;</>
            const removeBtnDisabled = Object.keys(quizForm.options).length < 3
            const option = quizForm.options[optionKey]

            const optionIsExpanded = this.state.optionBars[optionKey] // =============== 👉 [Code-Along 9.1] - step 3.1
            const optionSlice = option.option_text.slice(0, 40)

            return (
              <div className={`option${option.is_correct ? " truthy" : ""}`} key={optionKey}>
                <div className="option-bar" tabIndex="0" onClick={this.toggleBar(optionKey)}> {/* =============== 👉 [Code-Along 9.1] step 2.2 */}
                  <span> {/* =============== 👉 [Code-Along 9.1] - step 3.2 */}
                    {optionIsExpanded ? downArrow : rightArrow}
                    {optionHeading}
                    {!optionIsExpanded && optionSlice}
                  </span>
                  <button
                    className="option-operation"
                    disabled={removeBtnDisabled}
                    onClick={this.onRemoveOption(optionKey)}>{plusButton}</button>
                </div>
                {
                  optionIsExpanded && // =============== 👉 [Code-Along 9.1] - step 4
                  <StyledInputGroup className="option-inputs"> {/* =============== 👉 [Code-Along 9.1] - step 5.2 */}
                    <textarea
                      maxLength={400}
                      placeholder="Option text"
                      name={`option_text-${optionKey}`}
                      value={option.option_text}
                      onChange={this.onTextChange}
                    />
                    <textarea
                      type="text"
                      maxLength={400}
                      placeholder="Option remark"
                      name={`remark-${optionKey}`}
                      value={option.remark ?? ''}
                      onChange={this.onTextChange}
                    />
                    <label>
                      <input
                        type="radio"
                        name="is_correct"
                        checked={option.is_correct}
                        onChange={this.onQuestionSetCorrect(optionKey)}
                      />&nbsp;&nbsp;Correct option
                    </label>
                  </StyledInputGroup>
                }
              </div>
            )
          })
        }
        <br /><div className="button-group">
          <button className="jumbo-button">Submit</button>
          <button onClick={this.onRedirect('/admin')}>Cancel</button>
        </div>
      </form >
    )
  }
}

export default connect(st => ({
  quizForm: st.quizForm,
}), {
  addOption,
  removeOption,
  inputChange,
  questionOptionSetCorrect,
  createQuestion,
  editQuestion,
})(QuizForm)
