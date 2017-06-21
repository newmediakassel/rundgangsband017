
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

io.on('connection', (socket) => {
    socket.emit('news', { hello: 'world' })

    socket.on('pingServer', (data)  => {
        console.log('got data from the interface', data)
        ableton.set('clip/play', parseInt(data[0]) || 0, parseInt(data[1]) || 0)
        //counter++
        //socket.emit('news', 'bar' + counter)
    })

    socket.on('update_sequence', (sequence) => {
        let arrays = []
        const size = 4;

        while (sequence.length > 0) {
            arrays.push(sequence.splice(0, size));
        }

        console.log(arrays)

        arrays.forEach((arr, index) => {
            const foo = SequencerMatrix.get(arr, index)

            console.log('index', index, foo)

            ableton.set('clip/play', foo[0], foo[1])
        })
    })
})

app.listen(3000)
