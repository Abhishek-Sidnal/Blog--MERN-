const { Router } = require('express');
const { createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost } = require('../controllers/postControllers');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../middleware/multer.middleware');
const reviewRoutes = require('./reviewRoutes');

const router = Router();

router.post('/', authMiddleware, upload.single("thumbnail"), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.get('/categories/:category', getCatPosts);
router.get('/users/:id', getUserPosts);
router.patch('/:id', authMiddleware, upload.single("thumbnail"), editPost);
router.delete('/:id', authMiddleware, deletePost);

// Nested review routes
router.use('/:id/reviews', reviewRoutes);

module.exports = router;
