const router = require('express').Router();
const c = require('../controllers/auth');
const { asyncHandler } = require('../utils');
const { authenticate } = require('../middleware/auth');

router.post('/register', asyncHandler(c.register));
router.post('/login', asyncHandler(c.login));
router.get('/me', authenticate, asyncHandler(c.me));
router.post('/change-password', authenticate, asyncHandler(c.changePassword));

module.exports = router;
