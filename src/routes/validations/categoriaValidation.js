const Joi = require('joi');


const categoriaSchema = Joi.object({
    nombre: Joi.string().min(4).required(),
    });




module.exports = {
    categoriaSchema,

};
