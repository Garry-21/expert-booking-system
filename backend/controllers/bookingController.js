const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const mongoose = require('mongoose');

// Create booking with double booking prevention
exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      expertId,
      timeSlotId,
      clientName,
      clientEmail,
      clientPhone,
      bookingDate,
      startTime,
      endTime,
      notes,
    } = req.validatedData;

    // Check if time slot exists and is available
    const timeSlot = await TimeSlot.findById(timeSlotId).session(session);

    if (!timeSlot) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Time slot not found',
      });
    }

    // Prevent double booking - check if slot is already booked
    if (timeSlot.isBooked) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: 'This time slot is no longer available. It has been booked by another user.',
      });
    }

    // Check for existing bookings on the same date/time
    const existingBooking = await Booking.findOne({
      expertId,
      bookingDate: new Date(bookingDate),
      startTime,
      status: { $in: ['pending', 'confirmed'] },
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked',
      });
    }

    // Create booking
    const booking = new Booking({
      expertId,
      timeSlotId,
      clientName,
      clientEmail,
      clientPhone,
      bookingDate: new Date(bookingDate),
      startTime,
      endTime,
      notes,
    });

    await booking.save({ session });

    // Mark time slot as booked
    timeSlot.isBooked = true;
    timeSlot.bookedBy = booking._id;
    await timeSlot.save({ session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // If cancelled, free up the time slot
    if (status === 'cancelled') {
      await TimeSlot.findByIdAndUpdate(booking.timeSlotId, {
        isBooked: false,
        bookedBy: null,
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message,
    });
  }
};

// Get bookings by email
exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const bookings = await Booking.find({ clientEmail: email.toLowerCase() })
      .populate('expertId', 'name category')
      .sort({ bookingDate: -1 })
      .lean();

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message,
    });
  }
};

module.exports = exports;
