const { Router } = require('express');

const { 
    registerUser, 
    loginUser, 
    getUser, 
    getAuthors, 
    editUser, 
    changeAvatar, 
    forgotPassword, 
    resetPassword, 
    verifyEmail // Import the verifyEmail function
} = require('../controllers/UserController');

const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../middleware/multer.middleware');

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail); 
router.get('/:id', getUser);
router.get('/', getAuthors);
router.post('/change-avatar', authMiddleware, upload.single('avatar'), changeAvatar);
router.patch('/edit-user', authMiddleware, editUser);

module.exports = router;
