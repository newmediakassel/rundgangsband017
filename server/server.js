import store from 'redis-js'

import IndexHandler from './handlers/index'

//import { Foundation } from '../instruments'
import { Ableton } from './backend'

const ableton = new Ableton()

import instruments from '../instruments.json'

import { LinearSequenceMatrix } from './matrixes/sequencer'


const matrixes = {
    LinearSequenceMatrix,
}
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

//let instrumentIndexOffset = 0

const instrumentStore = {
    values: {},
    get: function (key) {
        if (!this.values[key]) {
            console.warn('key not found', key, this.values)
        }

        return this.values[key] ? this.values[key] : []
    },
    set: function (key, value) {
        this.values[key] = value
    }
}

const tempo = function () {
    console.log('subscribing to tempo')
    const tempoSubscription = ableton.subscribeTo('tempo', (tempo) => {
        store.set('tempo', parseFloat(tempo, 10))
    })
}()

//let counter = 0
const loopJump = function () {
    //const ACTIVE_LOOPS = 8
    //let counter = 1
    let lastLoopJump_timestamp = null

    console.log('subscribing to loopjump')
    ableton.subscribeTo('clip/loopjump', (val) => {
        const now = Date.now()
        const t = Math.floor(now / 1000)

        const tempo = parseFloat(store.get('tempo'), 10)

        if (t == lastLoopJump_timestamp) {
            return
        }

        io.sockets.emit('loopjump', {
            bpm: tempo,
            timestamp: now
        })

        lastLoopJump_timestamp = t
    })
}()

const setSocketInstrument = (socket, instrument, index) => {
    const rooms = Object.keys(socket.rooms)

    rooms.forEach((room) => {
        if (room != socket.id) {
            console.log('leaving instrument', room)
            socket.leave(room)
        }
    })

    socket.join(instrument)
    socket.instrument = {
        name: instrument,
        index
    }

    socket.emit('setCurrentInstrument', { index, name: instrument })
    socket.emit(getUpdateName(socket), instrumentStore.get(instrument))
}

const getUpdateName = (socket) => {
    const component = instruments[socket.instrument.index].component

    return `update${component}`
}

io.on('connection', (socket) => {
    let instrumentName = ''

    const setInstrumentName = (room) => {
        instrumentName = `instrument-${room}`

        return instrumentName
    }

    socket.on('requestInstrument', () => {
        // TODO do some magic here to properly select the instrument
        console.log(instruments)
        //const instruments = instruments.length
        const instrumentIndex = Math.floor(Math.random() * instruments.length)

        setSocketInstrument(socket, setInstrumentName(instrumentIndex), instrumentIndex)
    })

    socket.on('pingServer', (data)  => {
        console.log('got data from the interface', data)
        //ableton.set('clip/play', parseInt(data[0]) || 0, parseInt(data[1]) || 0)
    })

    socket.on('updateSequence', (instrument, sequence, offset) => {
        let arrays = []
        const size = 4

        instrumentStore.set(instrument, [...sequence]) // <-- IMPORTANT TO COPY. REFERENCE WILL BE DELETED OTHERWISE
        console.log('socket.instrument', socket.instrument)

        //TODO check socket.in(instrument).broadcast()
        const component = instruments[socket.instrument.index].component
        io.sockets.in(instrument).emit(getUpdateName(socket), instrumentStore.get(instrument))

        while (sequence.length > 0) {
            arrays.push(sequence.splice(0, size))
        }

        arrays.forEach((arr, index) => {
            const matrix = instruments[socket.instrument.index].matrix
            console.log('matrix', matrix)
            const foo = matrixes[matrix].get(arr, index + offset)

            console.log('index', index, foo)

            ableton.set('clip/play', foo[0], foo[1])
        })
    })
})

app.listen(3000)
