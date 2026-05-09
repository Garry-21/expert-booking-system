const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile Development', 'Data Science', 'Cloud Architecture', 'DevOps', 'UI/UX Design', 'Project Management'],
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 4.5,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  availability: {
    startTime: {
      type: String,
      default: '09:00',
    },
    endTime: {
      type: String,
      default: '18:00',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Expert', expertSchema);
