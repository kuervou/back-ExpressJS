const Joi = require('joi')

const statsSchema = Joi.object({
    dia: Joi.date().iso().optional(),
    mes: Joi.number().optional(),
    anio: Joi.number().optional(),
})

module.exports = {
    statsSchema,
}
