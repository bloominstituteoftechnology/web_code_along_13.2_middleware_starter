const router = require('express').Router()
const Stats = require('./stats-model')

router.get('/general', async (req, res, next) => {
  try {
    const stats = await Stats.generalStats(req.token.sub)
    setTimeout(() => {
      res.json(stats)
    }, 1000)
  } catch (err) {
    next(err)
  }
})

module.exports = router
