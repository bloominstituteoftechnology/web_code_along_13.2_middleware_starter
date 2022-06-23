import React, { useEffect } from 'react' // =============== 👉 [Code-Along 10.1] - step 3.1
import { connect } from 'react-redux'
import * as actions from '../state/action-creators'

export function QuizList(props) {
  const {
    questionFormSetExisting,
    questionFormReset,
    getQuestionBy,
    getQuizzes,
    quizList,
    navigate,
    setQuiz,
    quiz,
    searchText, // =============== 👉 [Code-Along 10.1] - step 2.2
    inputChange,
  } = props
  // =============== 👉 [Code-Along 10.1] - step 3.2
  const onNew = () => {
    questionFormReset()
    navigate('/admin/quiz/edit')
  }
  const onAct = question => evt => {
    setQuiz(question)
    if (evt.target.classList.contains('edit')) {
      questionFormSetExisting(question)
      navigate('/admin/quiz/edit')
    } else {
      navigate('/')
    }
  }
  const onSearchTextChange = evt => { // =============== 👉 [Code-Along 10.1] - step 4
    const { name, value } = evt.target
    inputChange({ name, value })
  }
  const onSearchClear = evt => {
    evt.preventDefault()
    inputChange({ name: 'searchText', value: '' })
    getQuizzes()
  }
  const onSearch = evt => {
    evt.preventDefault()
    getQuestionBy({ searchText })
  }
  const isSearchDisabled = () => {
    return !searchText.trim().length
  }
  useEffect(() => { // =============== 👉 [Code-Along 10.1] - step 5
    searchText.trim().length
      ? getQuestionBy({ searchText })
      : getQuizzes()
  }, [])

  return (
    <div id="quizList">
      <div className="button-group">
        <button className="jumbo-button" onClick={onNew}>New Quiz</button>
      </div><br />
      <div className="search-bar">
        <form id="searchForm" onSubmit={onSearch}>
          <input
            placeholder="Type keywords"
            name="searchText"
            onChange={onSearchTextChange}
            value={searchText}
          />
          <button disabled={isSearchDisabled()}>Search</button>
          <button onClick={onSearchClear}>Clear</button>
        </form>
      </div><br />
      {
        quizList.map(q => {
          const quizIsLoaded = quiz.question && q.question_id === quiz.question.question_id
          return (
            <div
              onClick={onAct(q)}
              key={q.question_id}
              className={`question answer${quizIsLoaded ? ' selected' : ''}`}
            >
              {q.question_title}
              <div className="mini-group">
                <button className="edit">🔧</button>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default connect(st => ({
  quizList: st.quizList,
  setQuiz: st.setQuiz,
  quiz: st.quiz,
  searchText: st.quizSearchForm.searchText, // =============== 👉 [Code-Along 10.1] - step 2.1
}), {
  questionFormSetExisting: actions.questionFormSetExisting,
  questionFormReset: actions.questionFormReset,
  getQuestionBy: actions.getQuestionBy,
  getQuizzes: actions.getQuizzes,
  setQuiz: actions.setQuiz,
  inputChange: actions.inputChange,
})(QuizList)
