const Joi = require('joi')

const itemMenuSchema = Joi.object({
    nombre: Joi.string().min(4).required(),
    descripcion: Joi.string().min(4).optional(),
    precio: Joi.number().required(),
    imagen: Joi.string().base64().required(),  // Valida que sea base64
    grupoId: Joi.number().required(),
})

const updateItemMenuSchema = Joi.object({
    nombre: Joi.string().min(4).optional(),
    descripcion: Joi.string().min(4).optional(),
    precio: Joi.number().optional(),
    imagen: Joi.string().base64().optional(),  // Valida que sea base64
    grupoId: Joi.number().optional(),
})

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    nombre: Joi.string().max(255).optional(),
    grupoId: Joi.number().integer().positive().optional(),
})

module.exports = {
    itemMenuSchema,
    updateItemMenuSchema,
    querySchema,
}
