const Expert = require('../models/Expert');
const TimeSlot = require('../models/TimeSlot');

// Get all experts with pagination and filters
exports.getExperts = async (req, res) => {
  try {
    const { page, limit, search, category } = req.validatedFilters;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const experts = await Expert.find(query)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Expert.countDocuments(query);

    res.json({
      success: true,
      data: experts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experts',
      error: error.message,
    });
  }
};

// Get expert details with available slots
exports.getExpertDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const expert = await Expert.findById(id).lean();
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
      });
    }

    // Get available time slots for next 30 days
    const today = new Date();
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const slots = await TimeSlot.find({
      expertId: id,
      date: { $gte: today, $lte: thirtyDaysLater },
      isBooked: false,
    })
      .sort({ date: 1, startTime: 1 })
      .lean();

    // Group slots by date
    const slotsByDate = {};
    slots.forEach(slot => {
      const dateKey = slot.date.toISOString().split('T')[0];
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push({
        id: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    });

    res.json({
      success: true,
      data: {
        ...expert,
        availableSlots: slotsByDate,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expert details',
      error: error.message,
    });
  }
};

module.exports = exports;
