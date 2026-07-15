const Joi = require("joi");

const attendanceSchema = Joi.object({
  qrToken: Joi.string().required(),
});

module.exports = attendanceSchema;