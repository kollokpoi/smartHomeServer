const models = require('../models/models');
const ApiError = require('../error/ApiError')
const path = require('path');
const fs = require('fs');
const ping = require('ping');

exports.getAll = async function(request,response,next){
    try {
        const items = await models.item.findAll();
        const itemsWithBase64Images = items.map(item => ({
            ...item.toJSON(),
            image: item.image ? Buffer.from(item.image).toString('base64') : null
        }));
        return response.json(itemsWithBase64Images);
    } catch (error) {
        return next(error);
    }
}
exports.get = async function(request,response,next){
    try {
        const { id } = request.params;
        const item = await models.item.findByPk(id);
        if (!item) {
            return next(ApiError.notFound('Документ не найден'));
        }
        const itemWithBase64Image = {
            ...item.toJSON(),
            image: item.image ? Buffer.from(item.image).toString('base64') : null
        };

        return response.json(itemWithBase64Image)
    } catch (error) {
        return next(ApiError.internal('Ошибка при получении документа'));
    }
}
exports.create = async function(request,response,next){
    const item  = request.body;
    const image = request.file ? request.file.buffer : null;
    if(image!=null)
        item.image = image;
    try {
      const newItem = await models.item.create(item);
      const itemWithBase64Images = {
        ...newItem.toJSON(),
        image: image ? Buffer.from(image).toString('base64') : null
      }
      response.status(201).json(itemWithBase64Images);
      createInterface(newItem.id.toString())
    } catch (error) {
        return next(ApiError.internal('Ошибка при получении документа'));
    }
}
exports.edit = async function(request,response,next){
    const { id } = request.params;
    const item  = request.body;
    const image = request.file ? request.file.buffer : null;
    try {
        const itemToUpdate = await models.item.findByPk(id)
        if(image!=null)
            await itemToUpdate.update({
                name:item.name,
                ipaddr:item.ipaddr,
                image
            })
        else
            await itemToUpdate.update({
                name:item.name,
                ipaddr:item.ipaddr
            })
            
        await itemToUpdate.reload()
        const itemWithBase64Images = {
            ...itemToUpdate.toJSON(),
            image: image ? Buffer.from(image).toString('base64') : null
        }
        response.status(201).json(itemWithBase64Images);
    } catch(error){
        return next(ApiError.internal('Ошибка изменения'));
    }
}
exports.interfaces = async function(request,response,next){
    const id  = request.params.id;
    const filePath = path.join(__dirname, '../public', 'interfaces', id, 'index.html');
    response.sendFile(filePath);
}
exports.delete = async function(request,response,next){
    const {id} = request.params
    try {
        const item = await models.item.findByPk(id)
        await item.destroy()
        response.status(204).end()
        deleteInterface(id)
    } catch(error){
        return next(ApiError.internal('Ошибка удаления'));
    }
}
exports.ping = async function(request,response,next){
    const {id} = request.params
    try {
        const item = await models.item.findByPk(id)
        const result = await isHostAlive(item.ipaddr)
        response.status(200).json(result)
    } catch(error){
        return next(ApiError.internal('Ошибка удаления'));
    }
}

function createInterface(id){
    const rootPath = path.join(__dirname, '../public', 'interfaces')
    const templatePath = path.join(rootPath,'default.html')
    const filePath = path.join(rootPath,id)

    fs.mkdir(filePath, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error creating directory');
            return;
        }

        fs.copyFile(templatePath, path.join(filePath,'index.html'), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}

function deleteInterface(id){
    const dirPath = path.join(__dirname, '../public', 'interfaces',id.toString())
    fs.rmdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
        }
    })
}
async function isHostAlive(host) {
    try {
      const res = await ping.promise.probe(host);
      return res.alive;
    } catch (error) {
      console.error(`Error pinging host ${host}: ${error.message}`);
      return false;
    }
}