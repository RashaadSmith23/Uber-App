const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const { estimateFare, requestRide, acceptRide, completeRide } = require('../controllers/rideController');
router.post('/estimate', estimateFare);
router.post('/request', authMiddleware, requestRide);
router.post('/:tripId/accept', authMiddleware, acceptRide);
router.post('/:tripId/complete', authMiddleware, completeRide);
module.exports = router;