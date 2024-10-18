const models = require('../models/models');
const ApiError = require('../error/ApiError');
const sharp = require('sharp');
const { where } = require('sequelize');
const { default: axios } = require('axios');

exports.getAll = async function(request,response,next){
    try {
        const commands = await models.command.findAll();
        return response.json(commands);
    } catch (error) {
        return next(error);
    }
}
exports.get = async function(request,response,next){
    try {
        const { id } = request.params;
        const command = await models.command.findByPk(id);
        if (!command) {
            return next(ApiError.notFound('Документ не найден'));
        }
        const commandWithBase64Image = {
            ...command.toJSON(),
            image: command.image ? Buffer.from(command.image).toString('base64') : null
        };
        return response.json(commandWithBase64Image);
    } catch (error) {
        return next(ApiError.internal('Ошибка при получении документа'));
    }
}
exports.getItemCommands = async function(request,response,next){
    try {
        const { id } = request.params;
        const commands = await models.command.findAll({where:{itemId:id}});
        if (!commands) {
            return next(ApiError.notFound('Документ не найден'));
        }
        const commandsWithBase64Images = commands.map(command => ({
            ...command.toJSON(),
            image: command.image ? Buffer.from(command.image).toString('base64') : null
        }));

        return response.json(commandsWithBase64Images);
    } catch (error) {
        return next(ApiError.internal('Ошибка при получении документа'));
    }
}
exports.create = async function(req,res,next){
    const command = req.body;
    const image = req.file ? req.file.buffer : null;
    try {
      if (!await models.item.findByPk(command.itemId)) {
        return res.status(404).json({ error: 'Item not found' });
      }
      if(image!=null){
        const compressedImageBuffer = await sharp(image)
            .resize(480, 300)
            .jpeg({ quality: 70 }) // quality is between 0 and 100
            .toBuffer();
        command.image = compressedImageBuffer;
      }
      const newCommand = await models.command.create(command);
      const commandWithBase64Images = {
        ...newCommand.toJSON(),
        image: newCommand.image ? Buffer.from(newCommand.image).toString('base64') : null
      }
      res.status(201).json(commandWithBase64Images);
    } catch (error) {
        return next(ApiError.internal('Ошибка при получении документа'));
    }
}
exports.edit = async function(req,res,next){
    const {id} = req.params
    const command  = req.body;
    const image = req.file ? req.file.buffer : null;
    
    const commandToUpdate = await models.command.findByPk(id);
    if (!commandToUpdate) 
        res.status(404).end()
    if (image!=null)
        await commandToUpdate.update({
            commandName:command.commandName,
            commandToSend:command.commandToSend,
            shouldReturn:command.shouldReturn,
            image
        })
    else
        await commandToUpdate.update({
            commandName:command.commandName,
            commandToSend:command.commandToSend,
            shouldReturn:command.shouldReturn,
        })
    await commandToUpdate.reload()
    const commandWithBase64Images = {
        id:commandToUpdate.id,
        commandName:commandToUpdate.commandName,
        commandToSend:commandToUpdate.commandToSend,
        shouldReturn:commandToUpdate.shouldReturn,
        image: image ? Buffer.from(image).toString('base64') : null
    }
    res.status(200).json(commandWithBase64Images);
}
exports.delete = async function(req,res,next){
    const {id} = req.params
    const command = await models.command.findByPk(id);

    if(command)
        await command.destroy()
    else 
        res.status(404).end()

    res.status(204).end()
}
exports.execute = async function(req,res,next){
    const {id} = req.params
    const command = await models.command.findByPk(id);
    const item = await models.item.findByPk(command.itemId)
    const resultIp = `http://${item.ipaddr}/${command.commandToSend}`
    try{
        await axios.post(resultIp)
        .then(function(result){
            if(result.status == 200){
                res.status(200).end()
            }
            else{
                res.status(500).end()
            }
        })
        .catch(function(error){
            res.status(404).end()
        })
    } catch (error) {
        return next(ApiError.internal('Ошибка при получении документа'));
    }
}