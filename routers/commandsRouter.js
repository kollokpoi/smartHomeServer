const express = require("express");
const controller = require('../controllers/commandsController')
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/',controller.getAll)
router.get('/command/:id',controller.get)
router.get('/commandVerbs/:id',controller.get)
router.get('/itemCommands/:id',controller.getItemCommands)
router.post('/create', upload.single('image'),controller.create)
router.post('/execute/:id',controller.execute)
router.post('/edit/:id', upload.single('image'),controller.edit)
router.delete('/delete/:id',controller.delete)

module.exports = router;
