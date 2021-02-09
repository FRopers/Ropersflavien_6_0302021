const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const limiter = require('../middleware/express-rate-limit-config');

router.post('/signup', userCtrl.signup);
router.post('/login', limiter.LoginLimiter, userCtrl.login);

module.exports = router;