
import IndexHandler from './handlers/index'

//import { Foundation } from '../instruments'
import { Ableton } from './backend'

const ableton = new Ableton()

import { SequencerMatrix } from './matrixes/sequencer'

/*const onCrossfadeChange = (msg) => {
    console.log(msg.args)
}*/

//const crossfaderSubscription = ableton.subscribeTo('track/select', onCrossfadeChange)
//ableton.set('play/scene', 4)
const group = 1
// group,
//ableton.set('clip/play', 1, 5)
//ableton.set('master/crossfader', Math.random())


const indexHandler = IndexHandler({
    templatePath: __dirname + '/templates'
})

const app = require('http').createServer(indexHandler)
const io = require('socket.io')(app)
const fs = require('fs')

let counter = 0
//let instrumentIndexOffset = 0

const store = {
    values: {},
    get: function (key) {
        return this.values[key] ? this.values[key] : []
    },
    set: function (key, value) {
        console.log('updating store', key, value)
        this.values[key] = value
    }
}

const loopJump = function () {
    //const ACTIVE_LOOPS = 8
    let counter = 1
    let lastLoopJump_timestamp = null

    console.log('subscribing to loopjump')
    ableton.subscribeTo('/live/clip/loopjump', (val) => {
        if (val.args[0] == 1 && val.args[1] == 1) {
            console.log('alternative loopjump', lastLoopJump_timestamp)
            const now = Date.now()

            // exit on first run
            if (!lastLoopJump_timestamp) {
                lastLoopJump_timestamp = now
                return
            }

            const duration = now - lastLoopJump_timestamp
            const sequencers = [0, 5];

            sequencers.forEach((room) => {
                io.sockets.in(room).emit('loopjump', duration)
            })

            lastLoopJump_timestamp = now
        }

        /*
        counter++

        if (counter % ACTIVE_LOOPS == 0) {
            console.log('got loopjump')
        }*/
    })
}()

io.on('connection', (socket) => {
    const skey = (offset) => `sequence-${offset}`

    socket.emit('news', { hello: 'world' })
    /*const sequence = store.get(skey());
    if (sequence) {
        console.log('emitting sequence', store.get(skey()))
        socket.emit('updateSequence', store.get(skey()))
    }*/

    socket.on('create', (room) => {
        const rooms = Object.keys(socket.rooms)
        console.log(rooms)

        rooms.forEach((room) => {
            if (room != socket.id) {
                console.log('leaving room', room)
                socket.leave(room)
            }
        })

        console.log('joining room', room)
        socket.join(room)
        io.sockets.in(room).emit('updateSequence', store.get(skey(room)))
    })

    socket.on('pingServer', (data)  => {
        console.log('got data from the interface', data)
        ableton.set('clip/play', parseInt(data[0]) || 0, parseInt(data[1]) || 0)
        //counter++
        //socket.emit('news', 'bar' + counter)
    })

    /*socket.on('instrumentOffset', (offset) => {
        console.log('got offset', offset)
        console.log('sending sequence', store.get(skey(offset)))
        socket.emit('updateSequence', store.get(skey(offset)))
    })*/

    /*socket.on('instrumentOffset', (offset) => {
        console.log('got offset', offset)
        instrumentIndexOffset = parseInt(offset)

        socket.emit('updateSequence', store.get(skey()))
    })*/

    socket.on('updateSequence', (sequence, offset) => {
        let arrays = []
        const size = 4;
        const mySequence = sequence.slice()

        offset = parseInt(offset)

        store.set(skey(offset), mySequence)
        //console.log(store.values)

        io.sockets.in(offset).emit('updateSequence', mySequence)
        //socket.broadcast.to('instrument-' + offset).emit('updateSequence', mySequence)

        while (sequence.length > 0) {
            arrays.push(sequence.splice(0, size));
        }

        //console.log(arrays)

        arrays.forEach((arr, index) => {
            const foo = SequencerMatrix.get(arr, index + offset)

            console.log('index', index, foo)

            ableton.set('clip/play', foo[0], foo[1])
        })
    })
})

app.listen(3000)
