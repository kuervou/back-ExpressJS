const { Log } = require('../models')

const logRepository = {
    createLog: async (data, transaction) => {
        return await Log.create(data, { transaction })
    },

    findOpenLogByItemInventarioId: async (itemInventarioId) => {
        return await Log.findOne({
            where: {
                itemInventarioId,
                fechaHoraCerrada: null,
            },
        })
    },

    closeLog: async (logId, fechaHoraCerrada, transaction) => {
        return await Log.update(
            { fechaHoraCerrada },
            {
                where: {
                    id: logId,
                },
                transaction,
            }
        )
    },
}

module.exports = logRepository
