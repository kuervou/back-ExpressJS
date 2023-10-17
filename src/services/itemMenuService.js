// src/services/itemMenuService.js
const itemMenuRepository = require('../repositories/itemMenuRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')
const grupoRepository = require('../repositories/grupoRepository')
// Función auxiliar para chequear unicidad del nombre
const checkNombreUnique = async (nombre, excludeId = null) => {
    const existingItemMenu = await itemMenuRepository.findByNombre(nombre)
    if (existingItemMenu && (!excludeId || existingItemMenu.id !== excludeId)) {
        throw new HttpError(
            HttpCode.CONFLICT,
            'Ya existe un ItemMenu con ese nombre'
        )
    }
}
const itemInventarioRepository = require('../repositories/itemInventarioRepository')

//funcion auxiliar para chequear la existencia del grupo
const checkGrupoExists = async (grupoId) => {
    const existingGrupo = await grupoRepository.getGrupoById(grupoId)
    if (!existingGrupo) {
        throw new HttpError(HttpCode.NOT_FOUND, 'Grupo no encontrado')
    }
}
const itemMenuService = {
    crearItemMenu: async (data) => {
        await checkNombreUnique(data.nombre)
        await checkGrupoExists(data.grupoId)
        //crear el nuevo itemMenu
        const newItemMenu = await itemMenuRepository.create(data)
        //obtener el id del nuevo itemMenu
        const newItemMenuId = newItemMenu.id

        if (data.itemsInventario) {
            for (let itemInventarioData of data.itemsInventario) {
                // Asociar ItemMenu con ItemInventario aquí
                const itemInventario =
                    await itemInventarioRepository.getItemInventarioById(
                        itemInventarioData.id
                    )
                if (itemInventario) {
                    await itemMenuRepository.addItemInventario(
                        newItemMenuId,
                        itemInventarioData.id
                    )
                } else {
                    throw new HttpError(
                        HttpCode.NOT_FOUND,
                        `ItemInventario con id ${itemInventarioData.id} no encontrado`
                    )
                }

                // Actualizar el campo porUnidad del ItemInventario

                await itemInventarioRepository.updatePorUnidad(
                    itemInventarioData.id,
                    data.porUnidad
                )
            }
        }

        return newItemMenu
    },
    getItemsMenu: async (options = {}) => {
        return await itemMenuRepository.findAll(options)
    },
    getItemsMenuActivos: async (options = {}) => {
        return await itemMenuRepository.findAllActivos(options)
    },
    getItemMenuById: async (id) => {
        return await itemMenuRepository.getItemMenuById(id)
    },
    updateItemMenu: async (id, data) => {
        if (data.Nombre) {
            await checkNombreUnique(data.nombre, id)
        }
        if (data.grupoId) {
            await checkGrupoExists(data.grupoId)
        }
        return await itemMenuRepository.update(id, data)
    },
    deleteItemMenu: async (id) => {
        return await itemMenuRepository.deleteItemMenu(id)
    },
    //removeItemsInventario función que dado un itemMenu y un array de itemInventarioId desvincula los itemInventarioId con itemMenu en la tabla intermedia
    removeItemsInventario: async (id, data) => {
        const ItemMenu = await itemMenuRepository.getItemMenuById(id)
        if (!ItemMenu) {
            return null
        }
        if (data.itemsInventario) {
            for (let itemInventarioData of data.itemsInventario) {
                // Desasociar ItemMenu con ItemInventario aquí
                const itemInventario =
                    await itemInventarioRepository.getItemInventarioById(
                        itemInventarioData.id
                    )
                if (itemInventario) {
                    await itemMenuRepository.removeItemInventario(
                        id,
                        itemInventarioData.id
                    )
                } else {
                    throw new HttpError(
                        HttpCode.NOT_FOUND,
                        `ItemInventario con id ${itemInventarioData.id} no encontrado`
                    )
                }
                // Actualizar el campo porUnidad del ItemInventario
                await itemInventarioRepository.updatePorUnidad(
                    itemInventarioData.id,
                    data.porUnidad
                )
            }
        } else {
            //si no se envia el array de itemsInventario se advierte al usuario
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                `Debe enviar un array de itemsInventario`
            )
        }
        return await itemMenuRepository.getItemMenuById(id)
    },
    //addItemsInventario función que dado un itemMenu y un array de itemInventarioId vincula los itemInventarioId con itemMenu en la tabla intermedia
    addItemsInventario: async (id, data) => {
        const ItemMenu = await itemMenuRepository.getItemMenuById(id)
        if (!ItemMenu) {
            return null
        }
        if (data.itemsInventario) {
            for (let itemInventarioData of data.itemsInventario) {
                // Asociar ItemMenu con ItemInventario aquí
                const itemInventario =
                    await itemInventarioRepository.getItemInventarioById(
                        itemInventarioData.id
                    )
                if (itemInventario) {
                    await itemMenuRepository.addItemInventario(
                        id,
                        itemInventarioData.id
                    )
                } else {
                    throw new HttpError(
                        HttpCode.NOT_FOUND,
                        `ItemInventario con id ${itemInventarioData.id} no encontrado`
                    )
                }
                // Actualizar el campo porUnidad del ItemInventario
                await itemInventarioRepository.updatePorUnidad(
                    itemInventarioData.id,
                    data.porUnidad
                )
            }
        } else {
            //si no se envia el array de itemsInventario se advierte al usuario
            throw new HttpError(
                HttpCode.BAD_REQUEST,
                `Debe enviar un array de itemsInventario`
            )
        }
        return await itemMenuRepository.getItemMenuById(id)
    },
}

module.exports = itemMenuService
