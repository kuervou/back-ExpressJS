const Joi = require('joi')

const clienteSchema = Joi.object({
    nombre: Joi.string().min(4).required(),
    apellido: Joi.string().min(4).required(),
    telefono: Joi.string()
        .pattern(/^\d{8,9}$/)
        .message('El teléfono debe tener 8 o 9 dígitos.'),
})
const querySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    nombre: Joi.string().max(255).optional(),
    apellido: Joi.string().max(255).optional(),
})
const updateClienteSchema = Joi.object({
    nombre: Joi.string().min(4).optional(),
    apellido: Joi.string().min(4).optional(),
    telefono: Joi.string()
        .pattern(/^\d{8,9}$/)
        .message('El teléfono debe tener 8 o 9 dígitos.')
        .optional(),
    cuenta: Joi.number().optional(),
})

module.exports = {
    clienteSchema,
    updateClienteSchema,
    querySchema,
}
