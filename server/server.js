
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

io.on('connection', (socket) => {
    const skey = (offset) => `sequence-${offset}`

    socket.emit('news', { hello: 'world' })
    const sequence = store.get('sequence');
    if (sequence) {
        console.log('emitting sequence', store.get(skey()))
        socket.emit('updateSequence', store.get(skey()))
    }

    socket.on('pingServer', (data)  => {
        console.log('got data from the interface', data)
        ableton.set('clip/play', parseInt(data[0]) || 0, parseInt(data[1]) || 0)
        //counter++
        //socket.emit('news', 'bar' + counter)
    })

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
        //socket.broadcast.emit('updateSequence', mySequence)

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
