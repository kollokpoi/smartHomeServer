const express = require('express')
const controller = require('../controllers/voiceCommandsController')
const router = express.Router();

router.post('/',controller.receiveCommand)

module.exports = router