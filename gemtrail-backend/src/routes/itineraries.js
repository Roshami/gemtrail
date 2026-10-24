const router = require('express').Router();
const c = require('../controllers/itineraries');
const { asyncHandler } = require('../utils');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', asyncHandler(c.list));
router.post('/', asyncHandler(c.create));
router.get('/:id', asyncHandler(c.getOne));
router.patch('/:id', asyncHandler(c.update));
router.delete('/:id', asyncHandler(c.remove));

router.post('/:id/places', asyncHandler(c.addPlace));
router.patch('/:id/places/:stopId', asyncHandler(c.updatePlace));
router.put('/:id/places/:stopId', asyncHandler(c.updatePlace));
router.delete('/:id/places/:stopId', asyncHandler(c.removePlace));

module.exports = router;