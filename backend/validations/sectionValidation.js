const Joi = require("joi");

const sectionSchema = Joi.object({
  programId: Joi.string().required(),

  name: Joi.string()
    .trim()
    .uppercase()
    .required(),

  batchYear: Joi.number()
    .integer()
    .min(2020)
    .max(2100)
    .required(),

  maxStrength: Joi.number()
    .integer()
    .min(1)
    .max(500)
    .required(),
});

module.exports = sectionSchema;