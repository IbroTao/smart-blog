const {Router} = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controllers');
const { updateBio, getMe, getUserByID } = require('../controllers/user.controllers');
const { authorizeUser } = require('../middlewares/auth.middlewares');

const router = Router();

router.get('/me', authorizeUser, getMe);
router.get('/:userid', getUserByID);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/update/bio', authorizeUser, updateBio);


module.exports = router;