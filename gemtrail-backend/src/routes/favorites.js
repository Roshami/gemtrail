const router = require('express').Router();
const c = require('../controllers/favorites');
const { asyncHandler } = require('../utils');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', asyncHandler(c.list));
router.post('/:placeId', asyncHandler(c.add));
router.delete('/:placeId', asyncHandler(c.remove));

module.exports = router;
