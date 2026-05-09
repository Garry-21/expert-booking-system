const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // HH:MM format
    required: true,
  },
  endTime: {
    type: String, // HH:MM format
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for quick lookup
timeSlotSchema.index({ expertId: 1, date: 1, startTime: 1 });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
