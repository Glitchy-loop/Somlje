const Joi = require('joi')

require('dotenv').config()

const addWineSchema = Joi.object({
  title: Joi.string().required(),
  region: Joi.string().required(),
  year: Joi.number().required()
})

module.exports = addWineSchema
