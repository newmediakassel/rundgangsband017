export const SOCKET_CONNECT = (state,  status) => {
    console.log('mutating state on socket connection')
    state.isConnected = true
}


export const SOCKET_DISCONNECT = (state,  status) => {
    console.log('mutating state on socket disconnection')
    state.isConnected = false
}

export const SELECT_INSTRUMENT = (state, instrument) => {
    const { index } = instrument

    if (index < 0 || index >= state.instruments.length) {
        console.warn('Not committing SELECT_INSTRUMENT. Given index', index, 'for instrument »' + name + '« is out of range. (current size:', state.instruments.length + ')')
        return
    }

    state.currentInstrument = index
}

export const INSTRUMENT_NAME = (state, instrument) => {
    const { name } = instrument

    state.instruments[state.currentInstrument].name = name
}

export const SET_TEMPO = (state, tempo) => {
    const { bpm, timestamp } = tempo

    state.tempo = { bpm, timestamp }
}
