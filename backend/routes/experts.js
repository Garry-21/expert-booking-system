const express = require('express');
const router = express.Router();
const { getExperts, getExpertDetail } = require('../controllers/expertController');
const { validateExpertFilter } = require('../middleware/validation');

// Get all experts with pagination and filters
router.get('/', validateExpertFilter, getExperts);

// Get expert detail with available slots
router.get('/:id', getExpertDetail);

module.exports = router;
