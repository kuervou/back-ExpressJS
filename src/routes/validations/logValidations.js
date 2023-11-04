const Joi = require('joi')

const abrirBotellaSchema = Joi.object({
    itemInventarioId: Joi.number().min(1).required(),
    empleadoId: Joi.number().min(1).required(),
})
const cerrarBotellaSchema = Joi.object({
    itemInventarioId: Joi.number().min(1).required(),
    empleadoId: Joi.number().min(1).required(),
})

module.exports = {
    abrirBotellaSchema,
    cerrarBotellaSchema,
}
