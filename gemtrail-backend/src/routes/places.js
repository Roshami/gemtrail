const router = require('express').Router();
const c = require('../controllers/places');
const { asyncHandler } = require('../utils');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', asyncHandler(c.list));
router.get('/top-rated', asyncHandler(c.topRated));
router.get('/:id', asyncHandler(c.getOne));
router.post('/', authenticate, requireAdmin, asyncHandler(c.create));
router.patch('/:id', authenticate, requireAdmin, asyncHandler(c.update));
router.delete('/:id', authenticate, requireAdmin, asyncHandler(c.remove));

module.exports = router;
