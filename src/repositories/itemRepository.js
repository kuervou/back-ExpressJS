const { Item, Orden } = require('../models')

const itemRepository = {
    createItem: async (data, transaction) => {
        return await Item.create(data, { transaction })
    },

    findAll: async (options) => {
        return await Item.findAll({
            where: {
                ordenId: options.ordenId,
            },
        })
    },

    deleteItems: async (items, transaction) => {
        return await Item.destroy({
            where: {
                id: items,
            },
            transaction,
        })
    },

    updateOrderTotal: async (ordenId) => {
        const order = await Orden.findByPk(ordenId, {
            include: [{ model: Item, as: 'items' }],
        })
        const newTotal = order.items.reduce(
            (sum, item) => sum + item.precio * item.cantidad,
            0
        )
        await order.update({ total: newTotal })
    },

    findItems: async (items) => {
        return await Item.findAll({
            where: {
                id: items,
            },
        })
    },
}

module.exports = itemRepository
