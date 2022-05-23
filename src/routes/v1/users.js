const express = require('express')
const mysql = require('mysql2/promise')
const { mysqConfig, jwtSecret } = require('../../config')
const bcrypt = require('bcrypt')
const validation = require('../../middleware/validation')
const jsonwebtoken = require('jsonwebtoken')
const {
  registerUserSchema,
  loginUserSchema,
  changePasswordUserSchema
} = require('../../middleware/schemas/userSchema')
const isLoggedIn = require('../../middleware/auth')
const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqConfig)
    const [data] = await connection.execute(`
    SELECT * FROM users
    `)

    await connection.end()
    return res.send(data)
  } catch (err) {
    console.log(err)
    return res.status(500).send('Server issue.')
  }
})

// Register user
router.post('/register', validation(registerUserSchema), async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10)
    const connection = await mysql.createConnection(mysqConfig)
    const [data] = await connection.execute(`
        INSERT INTO users (name, email, password)
        VALUES (${mysql.escape(req.body.name)}, ${mysql.escape(
      req.body.email
    )}, '${hash}')
        `)

    if (!data.insertId || data.affectedRows !== 1) {
      await connection.end()
      return res.status(400).send({ err: 'Server issue.' })
    }

    await connection.end()
    return res.send({
      msg: 'Successfully created account !'
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send('Server issue.')
  }
})

// Login user
router.post('/login', validation(loginUserSchema), async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqConfig)
    const [data] = await connection.execute(`
      SELECT * FROM users
      WHERE email = ${mysql.escape(req.body.email)}
      LIMIT 1
      `)

    if (data.length === 0) {
      await connection.end()
      return res.status(400).send({ msg: 'User not found.' })
    }

    if (!bcrypt.compareSync(req.body.password, data[0].password)) {
      await connection.end()
      return res.status(400).send({ msg: 'Incorrect password.' })
    }

    const token = jsonwebtoken.sign({ accountid: data[0].id }, jwtSecret)
    await connection.end()
    return res
      .status(200)
      .send({ msg: 'User successfully logged in.', token, data })
  } catch (err) {
    console.log(err)
    return res.status(500).send('Server issue.')
  }
})

// Change password
router.post(
  '/change-password',
  isLoggedIn,
  validation(changePasswordUserSchema),
  async (req, res) => {
    try {
      const connection = await mysql.createConnection(mysqConfig)
      const [data] = await connection.execute(`
        SELECT * from users
        WHERE email = ${mysql.escape(req.body.email)}
        LIMIT 1
        `)

      const checkHash = bcrypt.compareSync(req.body.oldPass, data[0].password)

      if (!checkHash) {
        await connection.end()
        return res.status(400).send({ err: 'Incorrect old password.' })
      }

      const newHashPass = bcrypt.hashSync(req.body.newPass, 10)

      connection.execute(`
        UPDATE users
        SET password = ${mysql.escape(newHashPass)}
        WHERE email = ${mysql.escape(req.body.email)}
        `)

      await connection.end()
      return res.status(200).send({ msg: 'Successfully changed password.' })
    } catch (err) {
      return res.status(500).send({ err: 'Server issue.' })
    }
  }
)

module.exports = router
