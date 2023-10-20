const itemRepository = require('../repositories/itemRepository')
const itemMenuRepository = require('../repositories/itemMenuRepository')
const itemInventarioRepository = require('../repositories/itemInventarioRepository')
const { HttpError, HttpCode } = require('../error-handling/http_error')

const itemService = {
    createItemsForOrder: async (data, order, transaction) => {
        const itemsData = data.items
        const items = await Promise.all(
            itemsData.map(async (itemData) => {
                const itemMenu = await itemMenuRepository.getItemMenuById(
                    itemData.itemMenuId
                )
                if (!itemMenu) {
                    throw new HttpError(
                        HttpCode.NOT_FOUND,
                        `ItemMenu with ID ${itemData.itemMenuId} not found`
                    )
                }

                const itemInventarios =
                    await itemMenuRepository.findItemInventarios(itemMenu)
                if (
                    itemInventarios.length === 1 &&
                    itemInventarios[0].porUnidad === true
                ) {
                    //validamos que haya stock suficiente
                    const stock = await itemInventarioRepository.getStock(
                        itemInventarios[0]
                    )
                    if (stock < itemData.cantidad) {
                        throw new HttpError(
                            HttpCode.BAD_REQUEST,
                            `No hay stock suficiente para el item ${itemMenu.nombre}`
                        )
                    }
                    await itemInventarioRepository.descontarStock(
                        itemInventarios[0],
                        itemData.cantidad,
                        transaction
                    )
                }

                return await itemRepository.createItem(
                    {
                        ordenId: order.id,
                        itemMenuId: itemData.itemMenuId,
                        cantidad: itemData.cantidad,
                        precio: itemMenu.precio,
                    },
                    transaction
                )
            })
        )

        return items
    },

    deleteItem : async (id, transaction) => {
        return await itemRepository.deleteItem(id, transaction)
    }
    
}

module.exports = itemService
