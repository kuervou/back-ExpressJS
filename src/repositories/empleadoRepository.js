const { Empleado } = require('../models')


const empleadoRepository = {
    create: async ( nick, nombre, apellido, password, telefono, rol) => {
        const nuevoEmpleado = await Empleado.create({
            nick, 
            nombre, 
            apellido, 
            password, 
            telefono, 
            rol,

            
        })
        return nuevoEmpleado
    },
    findByNick: async (nick) => {
        return await Empleado.findOne({ where: { nick } })
    },
}

module.exports = empleadoRepository
