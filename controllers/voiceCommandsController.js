const Model = require('../models/models')
const ApiError = require('../error/ApiError');
const item = require('../models/item');

exports.receiveCommand = async(req,res,next)=>{
    try {
        const {queryText} = req.body;
        if (!queryText) return next(ApiError.internal('Не все поля'));

        const verb = await Model.verb.findOne({where:{verb:queryText}}); 
        if (!verb) return next(ApiError.internal('Не все поля'));

        const command = await Model.command.findByPk(verb.commandId);
        if (!command) return next(ApiError.internal('Не все поля'));

        const item = await Model.item.findByPk(command.itemId)
        if(!item) return next(ApiError.internal('Не все поля'));

        console.log({
            verb,
            item,
            command
        })
    } catch (error) {
        console.log(error)
        return next(ApiError.internal('Ошибка при получении документа'));
    }

}