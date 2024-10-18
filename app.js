require('dotenv').config();
const tcpserver = require('./classes/tcpServer')
const express = require("express")
const itemsRouter = require('./routers/itemsRouter')
const verbRouter = require('./routers/verbRouter')
const commandsRouter = require('./routers/commandsRouter')
const imageGeneratorRouter = require('./routers/imageGeneratorRouter')
const voiceCommandsRouter = require('./routers/voiceCommandsRouter')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/items',itemsRouter)
app.use('/commands',commandsRouter)
app.use('/verb',verbRouter)
app.use('/image',imageGeneratorRouter)
app.use('/voices',voiceCommandsRouter)
app.use("/static", express.static("public/static"));

app.listen(port,()=>console.log(`Запущен на порту ${port}`))