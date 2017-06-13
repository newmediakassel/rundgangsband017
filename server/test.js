const IndexHandler = require('./handlers/index')

const indexHandler = IndexHandler({
    templatePath: __dirname + '/templates'
})

const app = require('http').createServer(indexHandler)
const io = require('socket.io')(app)
const fs = require('fs')

let counter = 0

io.on('connection', (socket) => {
    socket.emit('news', { hello: 'world' })

    socket.on('pingServer', (data)  => {
        console.log(data)
        counter++
        socket.emit('news', 'bar' + counter)
    })
})

app.listen(3000)
