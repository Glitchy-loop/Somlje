const express = require('express')
const router = express.Router()
const mysql = require('mysql2/promise')
const { mysqConfig } = require('../../config')
const isLoggedIn = require('../../middleware/auth')
const addWineSchema = require('../../middleware/schemas/wineSchema')
const validation = require('../../middleware/validation')

// Get all wines
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqConfig)
    const [data] = await connection.execute(`
        SELECT * FROM wines
        `)

    await connection.end()
    return res.status(200).send(data)
  } catch (err) {
    return res.status(500).send({ err: 'Server issue.' })
  }
})

// Post wine
router.post('/add', isLoggedIn, validation(addWineSchema), async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqConfig)
    const [data] = await connection.execute(`
        INSERT INTO wines (title, region, year)
        VALUES ( ${mysql.escape(req.body.title)}, ${mysql.escape(
      req.body.region
    )}, ${mysql.escape(req.body.year)} )
        `)

    if (!data.insertId || data.affectedRows !== 1) {
      await connection.end()
      return res
        .status(500)
        .send({ err: 'Server issue. Please try again later.' })
    }

    await connection.end()
    return res.status(200).send({ msg: 'Successfully added wine.' })
  } catch (err) {
    return res.status(500).send({ err: 'Server issue.' })
  }
})

module.exports = router
