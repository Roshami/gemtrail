const router = require('express').Router();
const c = require('../controllers/reviews');
const { asyncHandler } = require('../utils');
const { authenticate } = require('../middleware/auth');

router.get('/place/:placeId', asyncHandler(c.listForPlace));
router.post('/place/:placeId', authenticate, asyncHandler(c.upsertForPlace));
router.delete('/:id', authenticate, asyncHandler(c.remove));

module.exports = router;
