const Joi = require('joi')

const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required()
})

const loginUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required()
})

const changePasswordUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  oldPass: Joi.string().required(),
  newPass: Joi.string().required()
})

module.exports = {
  registerUserSchema,
  loginUserSchema,
  changePasswordUserSchema
}
