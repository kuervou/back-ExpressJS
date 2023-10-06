const { Categoria } = require('../models')

const categoriaRepository = {
    create: async (nombre) => {
        const nuevaCategoria = await Categoria.create({
            nombre,
        })
        return nuevaCategoria
    },
    findAll: async () => {
        return await Categoria.findAll()
    },

    update: async (id, nombre) => {
        return await Categoria.update({ nombre }, { where: { id: id } })
    },

    getCategoriaById: async (id) => {
        return await Categoria.findByPk(id)
    },

    deleteCategoria: async (id) => {
        return await Categoria.destroy({
            where: { id: id },
        })
    },
}

module.exports = categoriaRepository
