// socketHandler.js

module.exports = function (io) {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado')
    })
}
