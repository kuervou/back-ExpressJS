const Joi = require('joi');


const clienteSchema = Joi.object({
    nombre: Joi.string().min(4).required(),
    apellido: Joi.string().min(4).required(),
    telefono: Joi.string().pattern(/^\d{8,9}$/).message('El teléfono debe tener 8 o 9 dígitos.'),
    
    
    
    });

const updateClienteSchema = Joi.object({
    nombre: Joi.string().min(4).optional(),
    apellido: Joi.string().min(4).optional(),
    telefono: Joi.string().pattern(/^\d{8,9}$/).message('El teléfono debe tener 8 o 9 dígitos.').optional(),
    cuenta: Joi.number().optional(),
});
    



module.exports = {
    clienteSchema,
    updateClienteSchema,
};
