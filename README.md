# Expert Booking System

A real-time expert session booking system built with React, Node.js, Express, MongoDB, and Socket.io.

## Features

✅ Expert Listing with Search & Filter
✅ Real-time Slot Updates
✅ Double Booking Prevention
✅ Booking Management
✅ Real-time Notifications with Socket.io
✅ Proper Error Handling & Validation

## Tech Stack

**Frontend:**
- React
- Axios (HTTP client)
- Socket.io-client (Real-time updates)
- CSS for styling

**Backend:**
- Node.js
- Express
- MongoDB
- Socket.io
- Mongoose (ODM)

## Project Structure

```
.
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your MongoDB URI and other settings
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /api/experts` - Get all experts with pagination and filters
- `GET /api/experts/:id` - Get expert details
- `POST /api/bookings` - Create a new booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `GET /api/bookings?email=` - Get bookings by email

## Real-Time Features

Uses Socket.io for real-time updates:
- Slot availability updates
- Booking confirmations
- Live notifications

## Deployment

Frontend: Vercel/Netlify
Backend: Render/Railway/Heroku

## Deadline

May 10, 2026 - 2:00 PM
