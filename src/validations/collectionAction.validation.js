const Joi = require('joi');

const createActionSchema = Joi.object({
  client: Joi.string().hex().length(24).required(),
  invoice: Joi.string().hex().length(24).optional(),
  actionType: Joi.string().valid('call', 'email', 'visit', 'reminder').required(),
  comment: Joi.string().max(500).optional().allow(''),
  actionDate: Joi.date().default(() => new Date()),
});

const updateActionSchema = Joi.object({
  client: Joi.string().hex().length(24),
  invoice: Joi.string().hex().length(24).optional(),
  actionType: Joi.string().valid('call', 'email', 'visit', 'reminder'),
  comment: Joi.string().max(500).optional().allow(''),
  actionDate: Joi.date(),
}).min(1);

module.exports = { createActionSchema, updateActionSchema };
