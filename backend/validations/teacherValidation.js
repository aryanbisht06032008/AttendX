const Joi = require("joi");

const teacherSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  departmentId: Joi.string()
    .required(),

  employeeId: Joi.string()
    .trim()
    .uppercase()
    .required(),

  designation: Joi.string()
    .required(),

  highestQualification: Joi.string()
    .required(),

  joiningDate: Joi.date()
    .required(),

  primaryPhone: Joi.string()
    .required(),

  alternatePhone: Joi.string()
    .allow("")
    .optional(),
});

module.exports = teacherSchema;