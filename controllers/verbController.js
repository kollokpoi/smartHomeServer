const models = require('../models/models');
const { where } = require('sequelize');
const ApiError = require('../error/ApiError')

exports.getAll = async function(request,response,next){
    try {
        const verbs = await models.verb.findAll();
        return response.json(verbs);
    } catch (error) {
        return next(error);
    }
}

exports.get = async function(request,response,next){
    try {
        const { id } = request.params;
        const item = await models.verb.findByPk(id)
        if (!item) {
            return next(ApiError.notFound('Документ не найден'));
        }
        return response.json(item);
    } catch (error) {
        return next(ApiError.internal('Ошибка при получении документа'));
    }
}
exports.create = async function(request,response,next){
    const verb = request.body;
    try {
      const newVerb = await models.verb.create(verb);
      response.status(201).json(newVerb.id);
    } catch (error) {
        return next(ApiError.internal('Ошибка при получении документа'));
    }
}
exports.commandVerbs = async function(request,response,next){
    const {id} = request.params
    try {
      const verbs = await models.verb.findAll({where:{commandId:id}});
      response.status(201).json(verbs);
    } catch (error) {
        return next(ApiError.internal('Ошибка при получении документа'));
    }
}
exports.delete = async function(request,response,next){
    
}