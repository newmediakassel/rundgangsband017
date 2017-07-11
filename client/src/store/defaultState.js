import instruments from '../../../instruments.json'

export default {
    // socket connection
    isConnected: false,

    currentInstrument: 1,
    instruments: instruments,
    tempo: {
        bpm: 0,
        timestamp: -1
    }
}
