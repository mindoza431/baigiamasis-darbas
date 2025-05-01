const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

router.post('/register', authController.register);

router.post('/login', authController.login);

module.exports = router; 