const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // If no external MongoDB, use in-memory server
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('✅ MongoDB Connected (external)');
      return;
    } catch (err) {
      console.log('⚠️  External MongoDB unavailable, starting in-memory server...');
    }

    // Fallback to in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();

    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected (in-memory)');
    console.log('   ⚠️  Data will be lost on server restart');

    // Auto-seed in-memory DB
    await seedDatabase();
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Seed function for in-memory DB
const seedDatabase = async () => {
  const Expert = require('../models/Expert');
  const TimeSlot = require('../models/TimeSlot');

  const existingExperts = await Expert.countDocuments();
  if (existingExperts > 0) return;

  console.log('🌱 Seeding database...');

  const experts = [
    {
      name: 'John Smith',
      category: 'Web Development',
      experience: 8,
      rating: 4.8,
      hourlyRate: 100,
      bio: 'Expert in React, Node.js, and full-stack development with 8+ years of building scalable web applications.',
    },
    {
      name: 'Sarah Johnson',
      category: 'Mobile Development',
      experience: 6,
      rating: 4.7,
      hourlyRate: 90,
      bio: 'Specializing in React Native and iOS development. Built apps with 1M+ downloads.',
    },
    {
      name: 'Mike Chen',
      category: 'Data Science',
      experience: 10,
      rating: 4.9,
      hourlyRate: 120,
      bio: 'Machine learning and AI specialist. Former Google AI researcher with expertise in NLP and computer vision.',
    },
    {
      name: 'Emma Williams',
      category: 'Cloud Architecture',
      experience: 7,
      rating: 4.6,
      hourlyRate: 110,
      bio: 'AWS certified solutions architect. Designed infrastructure for Fortune 500 companies.',
    },
    {
      name: 'Alex Rodriguez',
      category: 'DevOps',
      experience: 9,
      rating: 4.8,
      hourlyRate: 115,
      bio: 'Docker, Kubernetes, and CI/CD pipelines expert. Reduced deployment times by 80% at scale.',
    },
    {
      name: 'Priya Patel',
      category: 'UI/UX Design',
      experience: 5,
      rating: 4.7,
      hourlyRate: 85,
      bio: 'Design thinking practitioner with expertise in Figma, prototyping, and user research.',
    },
    {
      name: 'David Kim',
      category: 'Project Management',
      experience: 12,
      rating: 4.5,
      hourlyRate: 95,
      bio: 'PMP certified with Agile/Scrum mastery. Led teams of 50+ across global projects.',
    },
    {
      name: 'Lisa Thompson',
      category: 'Web Development',
      experience: 6,
      rating: 4.6,
      hourlyRate: 90,
      bio: 'Full-stack developer specializing in Vue.js, Python, and PostgreSQL.',
    },
  ];

  const createdExperts = await Expert.insertMany(experts);

  const today = new Date();
  const slots = [];

  for (let expert of createdExperts) {
    for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
      const slotDate = new Date(today);
      slotDate.setDate(slotDate.getDate() + dayOffset);
      slotDate.setHours(0, 0, 0, 0);

      const timeSlots = [
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '10:00', endTime: '11:00' },
        { startTime: '11:00', endTime: '12:00' },
        { startTime: '14:00', endTime: '15:00' },
        { startTime: '15:00', endTime: '16:00' },
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
  console.log(`✅ Seeded ${createdExperts.length} experts and ${slots.length} time slots`);
};

module.exports = connectDB;
