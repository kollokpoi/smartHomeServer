const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs')
const URL = process.env.KANDINSKY_URL;
const API_KEY = process.env.KANDINSKY_API_KEY;
const SECRET_KEY = process.env.KANDINSKY_SECRET_KEY;
const AUTH_HEADERS = {
    'X-Key': `Key ${API_KEY}`,
    'X-Secret': `Secret ${SECRET_KEY}`
};

const getModels = async function() {
    const response = await axios.get(`${URL}key/api/v1/models`, { headers: AUTH_HEADERS });
    const data = response.data;
    const a = data[0]['id']
    return data[0]['id'];
}
const getStyles = async function() {
    const response = await axios.get(`https://cdn.fusionbrain.ai/static/styles/api`);
    return response.data;
}
const generate =  async function(prompt, model,style, images = 1, width = 1024, height = 1024) {
    const params = {
        type: "GENERATE",
        numImages: images,
        width,
        height,
        censored: false,
        style: style,
        generateParams: {
            query: prompt
        }
    };

    const formData = new FormData();
    const modelIdData = { value: model, options: { contentType: null } };
    const paramsData = { value: JSON.stringify(params), options: { contentType: 'application/json' } };
    formData.append('model_id', modelIdData.value, modelIdData.options);
    formData.append('params', paramsData.value, paramsData.options);

    const response = await axios.post(`${URL}key/api/v1/text2image/run`, formData, {
      headers: {
          ...formData.getHeaders(),
          ...AUTH_HEADERS
          
      },
      'Content-Type': 'multipart/form-data'
  });
    const data = response.data;
    return data.uuid;
}
const checkGeneration = async function(requestId, attempts = 10, delay = 10) {
    while (attempts > 0) {
      try {
        const response = await axios.get(`${URL}key/api/v1/text2image/status/${requestId}`, { headers: AUTH_HEADERS });
        const data = response.data;
        if (data.status === 'DONE') {
          return data.images;
        }
      } catch (error) {
        console.error(error);
      }
      attempts--;
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
    }
}
const getImageBase64 = async function(prompt,style='ANIME'){
    const uuid = await generate(prompt,await getModels(),style)
    const images = await checkGeneration(uuid);
    const base64String = images[0];
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    return base64Data;
}

module.exports ={
    getImageBase64,
    getStyles,
    getModels
};
