const router = require('express').Router()
const Quiz = require('./quizzes-model')

// =============== 👉 [Code-Along 13.1] - step 1.4

router.get('/next', async (req, res, next) => { // =============== 👉 [Code-Along 13.1] - step 3
  try {
    const user_id = req?.token?.sub
    const role_id = req?.token?.role_id
    const nextQuiz = await Quiz.nextQuiz({ user_id, role_id })
    res.json(nextQuiz)
  } catch (err) {
    next(err)
  }
})

router.post('/answer', async (req, res, next) => { // =============== 👉 [Code-Along 13.1] - step 4
  try {
    const { question_id, option_id } = req.body
    const user_id = req?.token?.sub
    const resp = await Quiz.answerQuiz({ question_id, option_id, user_id })
    res.json(resp)
  } catch (err) {
    next(err)
  }
})

module.exports = router
