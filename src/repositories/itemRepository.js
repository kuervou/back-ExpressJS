const { Item } = require('../models')

const itemRepository = {
    createItem: async (data, transaction) => {
        return await Item.create(data, { transaction })
    },
}

module.exports = itemRepository
