const jsonwebtoken = require('jsonwebtoken')
const { jwtSecret } = require('../config')

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    req.user = jsonwebtoken.verify(token, jwtSecret)
    return next()
  } catch (err) {
    console.log(err)
    return res.status(400).send({ err: 'User is not logged in.' })
  }
}

module.exports = isLoggedIn