const express = require('express')
const cors = require('cors')
const { serverPort } = require('./config')
const userRoutes = require('./routes/v1/users')
const wineRoutes = require('./routes/v1/wines')
const collectionRoutes = require('./routes/v1/collection')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('OK')
})

app.use('/v1/users', userRoutes)
app.use('/v1/wine', wineRoutes)
app.use('/v1/collections', collectionRoutes)

app.all('*', (req, res) => {
  return res.status(404).send('Page not found...')
})

app.listen(serverPort, () =>
  console.log(`Server is running on port ${serverPort}`)
)
