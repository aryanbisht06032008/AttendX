const Joi = require("joi");

const semesterSchema = Joi.object({
  programId: Joi.string().required(),

  semesterNumber: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .required(),
});

module.exports = semesterSchema;