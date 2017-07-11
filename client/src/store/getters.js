export const currentInstrument = (state, getters) => {
    return state.instruments[state.currentInstrument] || {}
}

export const currentInstrumentComponent = (state, getters) => {
    return getters.currentInstrument.component
}
/*
 * returns the offset of the currently selected instrument
 *
 * @see store.getters.currentInstrument
 */
export const currentInstrumentOffset = (state, getters) => {
    return getters.currentInstrument.offset
}

export const currentInstrumentIsSequencer = (state, getters) => {
    return getters.currentInstrument.isSequence
}

export const currentInstrumentName = (state, getters) => {
    return getters.currentInstrument.name
}

export const isConnected = (state) => {
    return state.isConnected
}

export const currentBpm = (state, getters) => {
    return state.tempo.bpm
}

export const loopjumpTimestamp = (state) => {
    return state.tempo.timestamp
}
