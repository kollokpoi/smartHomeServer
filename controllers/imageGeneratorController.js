const Text2ImageAPI  = require('../classes/imageGenerator')


exports.getBase64Image = async function(req,res,next){
    const {prompt,style} = req.body
    const base64 = await Text2ImageAPI.getImageBase64(prompt,style)
        
    return res.send(base64)
}

exports.getStyles = async function(req,res,next){
    const styles= await Text2ImageAPI.getStyles()
    return res.send(styles);
}