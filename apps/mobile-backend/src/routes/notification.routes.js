const express = require('express');
const router = express.Router();
const {
    registerToken,
    unregisterToken,
    getMyTokens
} = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth');

// All routes are protected
router.use(protect);

router.post('/register-token', registerToken);
router.delete('/unregister-token', unregisterToken);
router.get('/tokens', getMyTokens);

module.exports = router;
