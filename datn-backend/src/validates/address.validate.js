import joi from 'joi';

export const addressValidate = joi.object({
  _id: joi.string(),
  name: joi.string().required().messages({
    'string.base': 'name must be a string',
    'string.empty': 'name is not allowed to be empty',
    'any.required': 'name is required',
  }),
  where: joi.string().required().messages({
    'string.base': 'where must be a string',
    'string.empty': 'where is not allowed to be empty',
    'any.required': 'where is required',
  }),
  address: joi.string().required().messages({
    'string.base': 'address must be a string',
    'string.empty': 'address is not allowed to be empty',
    'any.required': 'address is required',
  }),
  default: joi.boolean().required().messages({
    'boolean.base': 'default must be a boolean',
    'any.required': 'default is required',
  }),
  userId: joi.string().required().messages({
    'string.base': 'userId must be a string',
    'string.empty': 'userId is not allowed to be empty',
    'any.required': 'userId is required',
  }),
  geoLocation: joi.object({
    lat: joi.number().optional(),
    lng: joi.number().optional(),
  }),
  yearold: joi.number().required().messages({
    'number.base': 'yearold must be a number',
    'any.required': 'yearold is required',
  }),
  sex: joi.string().valid('male', 'female', 'other').required().messages({
    'string.base': 'sex must be a string',
    'any.only': 'sex must be one of "male", "female", or "other"',
    'any.required': 'sex is required',
  }),
  workplace: joi.string().required().messages({
    'string.base': 'workplace must be a string',
    'string.empty': 'workplace is not allowed to be empty',
    'any.required': 'workplace is required',
  }),
});
