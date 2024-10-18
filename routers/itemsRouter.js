const express = require("express");
const controller = require('../controllers/itemsController')
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/',controller.getAll)
router.get('/item/:id',controller.get)
router.post('/create', upload.single('image'), controller.create)
router.post('/edit/:id', upload.single('image'), controller.edit)
router.post('/ping/:id', controller.ping)
router.delete('/delete/:id',controller.delete)
router.get('/interfaces/:id',controller.interfaces)

module.exports = router;