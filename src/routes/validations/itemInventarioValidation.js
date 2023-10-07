const Joi = require('joi')


const itemInventarioSchema = Joi.object({
    nombre: Joi.string().min(4).required(),
    descripcion: Joi.string().min(4).optional(),
    costo: Joi.number().required(),
    stock: Joi.number().optional(),
    cantxCasillero: Joi.number().optional(),
    porUnidad: Joi.bool().optional(),
    categoriaId: Joi.number().required(),
})

const updateItemInventarioSchema = Joi.object({
    nombre: Joi.string().min(4).optional(),
    descripcion: Joi.string().min(4).optional(),
    costo: Joi.number().optional(),
    stock: Joi.number().optional(),
    cantxCasillero: Joi.number().optional(),
    porUnidad: Joi.bool().optional(),
    categoriaId: Joi.number().optional(),
})



module.exports = {
    itemInventarioSchema,
    updateItemInventarioSchema,
  
}
