const express = require('express');
const router = express.Router();
const {
  createBooking,
  updateBookingStatus,
  getBookingsByEmail,
} = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validation');

// Create booking
router.post('/', validateBooking, createBooking);

// Get bookings by email
router.get('/', getBookingsByEmail);

// Update booking status
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
