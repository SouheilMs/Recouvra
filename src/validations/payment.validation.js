const Joi = require('joi');

const createPaymentSchema = Joi.object({
  invoice: Joi.string().hex().length(24).required(),
  amount: Joi.number().positive().required(),
  paymentDate: Joi.date().default(() => new Date()),
});

module.exports = { createPaymentSchema };
