const { Router } = require('express')

const { registerUser, loginUser, getUser, getAuthors, editUser, changeAvatar } = require('../controllers/UserController')
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../middleware/multer.middleware');

const router = Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.get('/', getAuthors)
router.post('/change-avatar', authMiddleware, upload.single('avatar'), changeAvatar);

router.patch('/edit-user', authMiddleware, editUser)

module.exports = router;