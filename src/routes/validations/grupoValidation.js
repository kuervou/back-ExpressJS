const Joi = require('joi')

const grupoSchema = Joi.object({
    nombre: Joi.string().min(4).required(),
})

module.exports = {
    grupoSchema,
}
