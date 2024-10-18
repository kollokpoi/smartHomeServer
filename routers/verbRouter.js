const express = require("express");
const router = express.Router();
const controller = require('../controllers/verbController')
const models = require('../models/models');
const ApiError = require('../error/ApiError')

router.post('/create',controller.create)
router.get('/commandVerbs/:id',controller.commandVerbs)

module.exports = router;