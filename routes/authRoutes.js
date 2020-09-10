const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/signup', authController.signUpGet);
router.post('/signup', authController.signUpPost);
router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);

module.exports = router;
