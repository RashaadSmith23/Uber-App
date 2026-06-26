const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const { toggleOnline } = require('../controllers/driverController');
router.put('/status', authMiddleware, toggleOnline);
module.exports = router;