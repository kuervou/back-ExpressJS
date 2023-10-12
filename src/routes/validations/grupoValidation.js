const Joi = require('joi')

const grupoSchema = Joi.object({
    nombre: Joi.string().min(4).required(),
})
const querySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    nombre: Joi.string().max(255).optional(),
})
module.exports = {
    grupoSchema,
    querySchema,
}
