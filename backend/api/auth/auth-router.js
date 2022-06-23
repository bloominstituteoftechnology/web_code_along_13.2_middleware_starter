const bcrypt = require('bcryptjs')
const router = require('express').Router()
const User = require('../user/user-model')
const mid = require('./auth-middleware')

let env = process.env.NODE_ENV || 'development' // remember environment variables??
const delay = env === 'development' ? 500 : 0

router.post('/register',
  mid.uniqueUsername,
  async (req, res) => {
    try {
      const { username, password } = req.credentials
      await User.insert({
        username,
        password: bcrypt.hashSync(password, 8),
      })
      setTimeout(() => {
        res.status(201).json({ message: `Welcome, ${username}` })
      }, delay)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

router.post('/login',
  mid.usernameExists,
  async (req, res) => {
    try {
      const { password } = req.credentials
      const { user } = req
      if (bcrypt.compareSync(password, user.password)) {
        setTimeout(() => {
          res.json({
            message: `Welcome, ${user.username}`,
            token: mid.generateToken(user),
          })
        }, delay)
      } else {
        res.status(401).json({ message: 'invalid credentials' })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

router.get('/check', mid.isRegisteredUser)

module.exports = router
