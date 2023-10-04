const Joi = require('joi');
const ROLES = require('./roles'); 

const empleadoSchema = Joi.object({
    nick: Joi.string().min(4).required(),
    nombre: Joi.string().min(4).required(),
    apellido: Joi.string().min(4).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) //modificar por una mas compleja
        .required(),
    telefono: Joi.string().pattern(/^\d{8,9}$/).message('El teléfono debe tener 8 o 9 dígitos.'),
    rol: Joi.string().valid(...ROLES).required(),
    
    });

const updateEmpleadoSchema = Joi.object({
    nick: Joi.string().min(4).optional(),
    nombre: Joi.string().min(4).optional(),
    apellido: Joi.string().min(4).optional(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .optional(),
    telefono: Joi.string().pattern(/^\d{8,9}$/).message('El teléfono debe tener 8 o 9 dígitos.').optional(),
    rol: Joi.string().valid(...ROLES).optional(),
    activo: Joi.bool().optional(),
});
    

const loginSchema = Joi.object({
    nick: Joi.string().min(4).required(),
    password: Joi.string().min(3).required() //largo min de la contraseña definido en la regex de arriba
});

module.exports = {
    empleadoSchema,
    updateEmpleadoSchema,
    loginSchema
};
