const express = require('express');
const { createReview } = require('../controllers/reviews');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.post('/', protect, createReview);

module.exports = router;