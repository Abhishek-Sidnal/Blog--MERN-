const { Router } = require('express');
const { createReview, destroyReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router({ mergeParams: true });

// Route to create a review
router.post('/', authMiddleware, createReview);

// Route to delete a review
router.delete('/:reviewId', authMiddleware, destroyReview);

module.exports = router;
