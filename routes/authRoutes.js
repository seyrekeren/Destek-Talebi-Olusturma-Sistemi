const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/authController');

router.post('/register', registerUser); //çalıştı
router.post('/login', loginUser)       //çalıştı

module.exports = router;