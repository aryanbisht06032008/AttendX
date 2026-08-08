const Joi = require("joi");

const attendanceSchema = Joi.object({
  qrToken: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});

module.exports = attendanceSchema;