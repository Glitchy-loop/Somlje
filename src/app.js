const express = require('express')
const cors = require('cors')
const { serverPort } = require('./config')
const userRoutes = require('./routes/v1/users')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('ok')
})

app.use('/v1/users', userRoutes)

app.all('*', (req, res) => {
  return res.status(400).send('Page not found...')
})

app.listen(serverPort, () =>
  console.log(`Server is running on port ${serverPort}`)
)
