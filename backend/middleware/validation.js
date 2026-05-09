const Joi = require('joi');

// Booking validation schema
const bookingValidationSchema = Joi.object({
  expertId: Joi.string().required(),
  timeSlotId: Joi.string().required(),
  clientName: Joi.string().trim().min(2).max(100).required(),
  clientEmail: Joi.string().email().required(),
  clientPhone: Joi.string().pattern(/^\d{10,}$/).required(),
  bookingDate: Joi.date().iso().required(),
  startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  notes: Joi.string().trim().max(500).allow(''),
});

// Expert filter validation
const expertFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(''),
  category: Joi.string().allow(''),
});

const validateBooking = (req, res, next) => {
  const { error, value } = bookingValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.details.map(d => d.message),
    });
  }
  req.validatedData = value;
  next();
};

const validateExpertFilter = (req, res, next) => {
  const { error, value } = expertFilterSchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.details.map(d => d.message),
    });
  }
  req.validatedFilters = value;
  next();
};

module.exports = {
  validateBooking,
  validateExpertFilter,
};
