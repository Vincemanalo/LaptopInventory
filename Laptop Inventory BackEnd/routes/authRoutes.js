const router = require('express').Router();
const { validateLogin } = require('../utils/validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', validateLogin, authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
