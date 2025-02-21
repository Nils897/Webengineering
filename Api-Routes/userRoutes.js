const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.post("../Controllers/", userController.registerUser);

module.exports = router;