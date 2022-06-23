const router = require('express').Router()
const Question = require('./questions-model')

router.get('/', async (req, res, next) => {
  try {
    const questions = await Question.getAll()
    res.json(questions)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => { // todo: use Yup and middleware to validate!
  try {
    const { question_title, question_text } = req.body
    const validatedQuestion = { options: [] }

    // VALIDATING question_title
    if (
      question_title !== undefined &&
      typeof question_title === 'string' &&
      question_title.trim().length > 2
    ) {
      validatedQuestion.question_title = question_title.trim()
    } else {
      return res.status(422).json({
        message: 'question_title of at least 3 chars is required',
      })
    }
    // VALIDATING question_text
    if (
      question_text !== undefined &&
      typeof question_text === 'string' &&
      question_text.trim().length > 2
    ) {
      validatedQuestion.question_text = question_text.trim()
    } else {
      return res.status(422).json({
        message: 'question_text of at least 3 char is required',
      })
    }

    const { options } = req.body
    for (let option of options) {
      const { option_text, is_correct, remark } = option
      const validatedOption = {}

      // VALIDATING option_text
      if (
        option_text !== undefined &&
        typeof option_text === 'string' &&
        option_text.trim().length > 0
      ) {
        validatedOption.option_text = option_text.trim()
      } else {
        return res.status(422).json({
          message: 'option_text of at least 1 char is required',
        })
      }
      // VALIDATING option_text
      if (
        is_correct !== undefined &&
        typeof is_correct === 'boolean'
      ) {
        validatedOption.is_correct = is_correct
      } else {
        return res.status(422).json({
          message: 'is_correct (true or false) for each option is required',
        })
      }
      // VALIDATING option_text
      if (
        remark !== undefined &&
        typeof remark === 'string' &&
        remark.trim().length > 0
      ) {
        validatedOption.remark = remark.trim()
      }
      validatedQuestion.options.push(validatedOption)
    }

    const validatedOptions = validatedQuestion.options

    // VALIDATING that at least 2 options are provided
    if (validatedOptions.length < 2) {
      return res.status(422).json({
        message: 'provide one correct option and at least one distractor',
      })
    }

    // VALIDATING exactly one option is a non-distractor
    const nonDistractorCount = validatedOptions.filter(o => o.is_correct).length
    if (nonDistractorCount !== 1) {
      return res.status(422).json({
        message: 'provide one correct option and at least one distractor',
      })
    }

    // VALIDATING no two options have the same option_text
    const optionTextsArr = validatedOptions.map(o => o.option_text.trim())
    const optionTextsSet = new Set(optionTextsArr)
    if (optionTextsSet.size !== optionTextsArr.length) {
      return res.status(422).json({
        message: 'option texts must be different',
      })
    }

    const question = await Question.create(validatedQuestion)
    res.status(201).json(question)
  } catch (err) {
    next(err)
  }
})

router.put('/:question_id', async (req, res, next) => { // todo: use Yup and middleware to validate!
  try {
    const { question_title, question_text } = req.body
    const validatedQuestion = { options: [] }

    // VALIDATING question_title
    if (
      question_title !== undefined &&
      typeof question_title === 'string' &&
      question_title.trim().length > 2
    ) {
      validatedQuestion.question_title = question_title.trim()
    } else {
      return res.status(422).json({
        message: 'question_title of at least 3 chars is required',
      })
    }
    // VALIDATING question_text
    if (
      question_text !== undefined &&
      typeof question_text === 'string' &&
      question_text.trim().length > 2
    ) {
      validatedQuestion.question_text = question_text.trim()
    } else {
      return res.status(422).json({
        message: 'question_text of at least 3 char is required',
      })
    }

    const { options } = req.body
    for (let option of options) {
      const { option_text, is_correct, remark } = option
      const validatedOption = {}
      validatedOption.option_id = option.option_id

      // VALIDATING option_text
      if (
        option_text !== undefined &&
        typeof option_text === 'string' &&
        option_text.trim().length > 0
      ) {
        validatedOption.option_text = option_text.trim()
      } else {
        return res.status(422).json({
          message: 'option_text of at least 1 char is required',
        })
      }
      // VALIDATING option_text
      if (
        is_correct !== undefined &&
        typeof is_correct === 'boolean'
      ) {
        validatedOption.is_correct = is_correct
      } else {
        console.log(req.body)
        return res.status(422).json({
          message: 'is_correct (true or false) for each option is required',
        })
      }
      // VALIDATING option_text
      if (
        remark !== undefined &&
        typeof remark === 'string' &&
        remark.trim().length > 0
      ) {
        validatedOption.remark = remark.trim()
      }
      validatedQuestion.options.push(validatedOption)
    }

    const validatedOptions = validatedQuestion.options

    // VALIDATING that at least 2 options are provided
    if (validatedOptions.length < 2) {
      return res.status(422).json({
        message: 'provide one correct option and at least one distractor',
      })
    }

    // VALIDATING exactly one option is a non-distractor
    const nonDistractorCount = validatedOptions.filter(o => o.is_correct).length
    if (nonDistractorCount !== 1) {
      return res.status(422).json({
        message: 'provide one correct option and at least one distractor',
      })
    }

    // VALIDATING no two options have the same option_text
    const optionTextsArr = validatedOptions.map(o => o.option_text.trim())
    const optionTextsSet = new Set(optionTextsArr)
    if (optionTextsSet.size !== optionTextsArr.length) {
      return res.status(422).json({
        message: 'option texts must be different',
      })
    }

    const question = await Question.editById(req.params.question_id, validatedQuestion)
    res.status(200).json(question)
  } catch (err) {
    next(err)
  }
})

router.get('/text', async (req, res, next) => {
  try {
    const { text } = req.query
    const quizzes = await Question.getByText({ text })
    res.json(quizzes)
  } catch (err) {
    next(err)
  }
})

module.exports = router
