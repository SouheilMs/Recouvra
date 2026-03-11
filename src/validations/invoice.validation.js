const Joi = require('joi');

const createInvoiceSchema = Joi.object({
  client: Joi.string().hex().length(24).required(),
  amount: Joi.number().positive().required(),
  dueDate: Joi.date().required(),
  status: Joi.string().valid('paid', 'unpaid', 'in_collection').default('unpaid'),
});

const updateInvoiceSchema = Joi.object({
  client: Joi.string().hex().length(24),
  amount: Joi.number().positive(),
  dueDate: Joi.date(),
  status: Joi.string().valid('paid', 'unpaid', 'in_collection'),
}).min(1);

module.exports = { createInvoiceSchema, updateInvoiceSchema };
