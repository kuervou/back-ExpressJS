const itemInventarioRepository = require('../repositories/itemInventarioRepository')

const itemInventarioService = {
    crearItemInventario: async (nombre, descripcion, stock, costo, cantxCasillero,porUnidad,categoriaId) => {
        return await itemInventarioRepository.create(nombre, descripcion, stock, costo, cantxCasillero,porUnidad,categoriaId)
    },
    getItemsInventario: async function () {
        return await itemInventarioRepository.findAll()
    },

    getItemInventarioById: async (id) => {
        return await itemInventarioRepository.getItemInventarioById(id)
    },

    updateItemInventario: async (id, nombre, descripcion, stock, costo, cantxCasillero,porUnidad,categoriaId) => {
        return await itemInventarioRepository.update(id, nombre, descripcion, stock, costo, cantxCasillero,porUnidad,categoriaId)
    },
    deleteItemInventario: async (id) => {
        return await itemInventarioRepository.deleteItemInventario(id)
    },
}

module.exports = itemInventarioService
