require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('../models/Expert');
const TimeSlot = require('../models/TimeSlot');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await Expert.deleteMany({});
    await TimeSlot.deleteMany({});

    // Sample experts
    const experts = [
      {
        name: 'John Smith',
        category: 'Web Development',
        experience: 8,
        rating: 4.8,
        hourlyRate: 100,
        bio: 'Expert in React, Node.js, and full-stack development',
        image: 'https://via.placeholder.com/150?text=John',
      },
      {
        name: 'Sarah Johnson',
        category: 'Mobile Development',
        experience: 6,
        rating: 4.7,
        hourlyRate: 90,
        bio: 'Specializing in React Native and iOS development',
        image: 'https://via.placeholder.com/150?text=Sarah',
      },
      {
        name: 'Mike Chen',
        category: 'Data Science',
        experience: 10,
        rating: 4.9,
        hourlyRate: 120,
        bio: 'Machine learning and AI specialist',
        image: 'https://via.placeholder.com/150?text=Mike',
      },
      {
        name: 'Emma Williams',
        category: 'Cloud Architecture',
        experience: 7,
        rating: 4.6,
        hourlyRate: 110,
        bio: 'AWS and cloud infrastructure expert',
        image: 'https://via.placeholder.com/150?text=Emma',
      },
      {
        name: 'Alex Rodriguez',
        category: 'DevOps',
        experience: 9,
        rating: 4.8,
        hourlyRate: 115,
        bio: 'Docker, Kubernetes, and CI/CD pipelines',
        image: 'https://via.placeholder.com/150?text=Alex',
      },
    ];

    const createdExperts = await Expert.insertMany(experts);
    console.log('✅ Experts seeded successfully');

    // Create time slots for each expert
    const today = new Date();
    const slots = [];

    for (let expert of createdExperts) {
      // Create slots for next 7 days
      for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
        const slotDate = new Date(today);
        slotDate.setDate(slotDate.getDate() + dayOffset);

        // Create 4 slots per day
        const timeSlots = [
          { startTime: '09:00', endTime: '10:00' },
          { startTime: '11:00', endTime: '12:00' },
          { startTime: '14:00', endTime: '15:00' },
          { startTime: '16:00', endTime: '17:00' },
        ];

        for (let slot of timeSlots) {
          slots.push({
            expertId: expert._id,
            date: slotDate,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isBooked: false,
          });
        }
      }
    }

    await TimeSlot.insertMany(slots);
    console.log(`✅ ${slots.length} time slots created`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
