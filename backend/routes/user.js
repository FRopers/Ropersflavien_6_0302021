const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const limiter = require('../component/express-rate-limit-config');
const passwordValidator = require('../middleware/password-validator')

router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', limiter.LoginLimiter, userCtrl.login);

module.exports = router;