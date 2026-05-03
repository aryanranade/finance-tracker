const express = require('express');
const { getInsights, categorize, getHealthScore } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.post('/insights', getInsights);
router.get('/categorize', categorize);
router.get('/health-score', getHealthScore);

module.exports = router;
