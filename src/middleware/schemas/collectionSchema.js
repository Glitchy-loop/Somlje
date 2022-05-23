const Joi = require('joi')

require('dotenv').config()

const addToCollectionSchema = Joi.object({
  user_id: Joi.number().required(),
  quantity: Joi.number().required()
})

module.exports = addToCollectionSchema
