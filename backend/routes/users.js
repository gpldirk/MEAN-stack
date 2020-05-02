const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config/database')
const User = require('../models/user')

// register user route
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, newUser) => {
    if (err) {
      res.json({success: false, msg: 'Failed to register new user'})
    } else {
      res.json({success: true, msg: 'New user registered'})
    }
  })

})

// authenciate user route
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  User.findUserByUsername(username, (err, user) => {
    if (err) {
      throw err
    } else if (!user) {
      return res.json({success: false, msg: 'user not found'})
    }

    // compare real hashed password and actual sent password
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        throw err
      }

      if (isMatch) {
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week
        })

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
          }
        })
      } else {
        return res.json({success: false, msg: 'wrong password'})
      }
    })
  })
})

// user profile route
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user})
})

module.exports = router