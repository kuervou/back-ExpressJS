// socketHandler.js

module.exports = function (io) {
    io.on('connection', () => {
        // eslint-disable-next-line no-console
        console.log('Un usuario se ha conectado')
    })
}
