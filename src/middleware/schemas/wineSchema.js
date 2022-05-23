const Joi = require('joi')

require('dotenv').config()

const addWineSchema = Joi.object({
  title: Joi.string()
    .trim()
    .required(),
  region: Joi.string()
    .required()
    .trim(),
  year: Joi.number().required()
})

const getWinesSchema = Joi.object({
  from: Joi.number().required(),
  to: Joi.number().required()
})

module.exports = { addWineSchema, getWinesSchema }
