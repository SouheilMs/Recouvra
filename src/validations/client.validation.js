const Joi = require('joi');

const createClientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(20).optional(),
  address: Joi.string().max(255).optional(),
  status: Joi.string().valid('active', 'in_collection').default('active'),
});

const updateClientSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().max(20).optional().allow(''),
  address: Joi.string().max(255).optional().allow(''),
  status: Joi.string().valid('active', 'in_collection'),
}).min(1);

module.exports = { createClientSchema, updateClientSchema };
