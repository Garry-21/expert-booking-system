const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');

// Create booking with double booking prevention (atomic operation)
exports.createBooking = async (req, res) => {
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

    // Atomically mark the time slot as booked (prevents double booking via race condition)
    // findOneAndUpdate with isBooked: false ensures only one request can book the slot
    const timeSlot = await TimeSlot.findOneAndUpdate(
      { _id: timeSlotId, isBooked: false },
      { $set: { isBooked: true } },
      { new: true }
    );

    if (!timeSlot) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is no longer available. It has been booked by another user.',
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

    await booking.save();

    // Link booking to time slot
    timeSlot.bookedBy = booking._id;
    await timeSlot.save();

    // Emit real-time slot update via Socket.io
    if (req.io) {
      req.io.to(`expert-${expertId}`).emit('slot-booked', {
        slotId: timeSlotId,
        expertId,
        date: bookingDate,
        startTime,
        endTime,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
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

    // If cancelled, free up the time slot and emit event
    if (status === 'cancelled') {
      await TimeSlot.findByIdAndUpdate(booking.timeSlotId, {
        isBooked: false,
        bookedBy: null,
      });

      if (req.io) {
        req.io.to(`expert-${booking.expertId}`).emit('slot-freed', {
          slotId: booking.timeSlotId,
          expertId: booking.expertId.toString(),
          date: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime,
        });
      }
    }

    // Emit booking status update
    if (req.io) {
      req.io.emit('booking-status-updated', {
        bookingId: id,
        status,
        expertId: booking.expertId.toString(),
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
      .populate('expertId', 'name category image')
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
