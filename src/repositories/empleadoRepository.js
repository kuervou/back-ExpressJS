const { Empleado } = require('../models')

const empleadoRepository = {
    create: async (nick, nombre, apellido, password, telefono, rol) => {
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
    findAll: async () => {
        return await Empleado.findAll({
            attributes: { exclude: ['password'] },
        })
    },

    update: async (
        id,
        nick,
        nombre,
        apellido,
        password,
        telefono,
        rol,
        activo
    ) => {
        return await Empleado.update(
            { nick, nombre, apellido, password, telefono, rol, activo },
            { where: { id: id } }
        )
    },

    getEmpleadoById: async (id) => {
        return await Empleado.findByPk(id, {
            attributes: { exclude: ['password'] },
        })
    },

    findByNick: async (nick) => {
        return await Empleado.findOne({ where: { nick } })
    },

    deleteEmpleado: async (id) => {
        return await Empleado.destroy({
            where: { id: id },
        })
    },
}

module.exports = empleadoRepository
