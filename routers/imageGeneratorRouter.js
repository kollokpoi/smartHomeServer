const express = require("express");
const controller = require('../controllers/imageGeneratorController')
const router = express.Router();

router.get('/styles',controller.getStyles)
router.post('/generate',controller.getBase64Image)

module.exports = router;