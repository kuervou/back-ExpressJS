const categoriaRepository = require('../repositories/categoriaRepository')

const categoriaService = {
    crearCategoria: async (nombre) => {
        return await categoriaRepository.create(nombre)
    },
    getCategorias: async function () {
        return await categoriaRepository.findAll()
    },

    getCategoriaById: async (id) => {
        return await categoriaRepository.getCategoriaById(id)
    },

    updateCategoria: async (id, nombre) => {
        return await categoriaRepository.update(id, nombre)
    },
    deleteCategoria: async (id) => {
        return await categoriaRepository.deleteCategoria(id)
    },
}

module.exports = categoriaService
