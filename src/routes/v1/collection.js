const express = require('express')
const router = express.Router()
const mysql = require('mysql2/promise')
const { mysqConfig } = require('../../config')
const isLoggedIn = require('../../middleware/auth')
const addToCollectionSchema = require('../../middleware/schemas/collectionSchema')
const validation = require('../../middleware/validation')

// Get all collections
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqConfig)
    const [data] = await connection.execute(`
          SELECT * FROM collections
          `)

    await connection.end()
    return res.status(200).send(data)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: 'Server issue.' })
  }
})

// Get collection by user id
router.get('/my-wines/:id', isLoggedIn, async (req, res) => {
  try {
    const connection = await mysql.createConnection(mysqConfig)
    const [data] = await connection.execute(`
            SELECT * FROM collections
            WHERE user_id = ${mysql.escape(req.params.id)}
            `)

    await connection.end()
    return res.status(200).send(data)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err: 'Server issue.' })
  }
})

// Post new item to the collection
router.post(
  '/my-wines/:id',
  isLoggedIn,
  validation(addToCollectionSchema),
  async (req, res) => {
    try {
      const connection = await mysql.createConnection(mysqConfig)
      const [data] = await connection.execute(`
        INSERT INTO collections (wine_id, user_id, quantity)
        VALUES (${mysql.escape(Number(req.params.id))}, ${mysql.escape(
        req.body.user_id
      )}, ${mysql.escape(req.body.quantity)} )
        `)

      if (!data.insertId || data.affectedRows !== 1) {
        await connection.end()
        return res.status(500).send({ err: 'Server issue. Try again later.' })
      }

      await connection.end()
      return res
        .status(200)
        .send({ msg: 'Wine successfully added to your collection.' })
    } catch (err) {
      console.log(err)
      return res.status(500).send({ err: 'Server issue.' })
    }
  }
)

module.exports = router
