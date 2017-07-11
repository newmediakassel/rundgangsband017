import * as types from './mutation-types'

export const setTempo = ({ commit }, tempo) => {
    const { bpm, timestamp } = tempo

    commit(types.SET_TEMPO, { bpm, timestamp })
}

export const selectInstrument = ({ commit }, instrument) => {
    commit(types.SELECT_INSTRUMENT, instrument)
}

export const setInstrumentName = ({ commit }, instrument) => {
    commit(types.INSTRUMENT_NAME, instrument)
}


// ! --- Sockets ---

export const socket_setCurrentInstrument = ({ commit }, instrument) => {
    const { name, index } = instrument

    selectInstrument({ commit }, { index })
    setInstrumentName({ commit }, { name })
}

export const socket_loopjump = ({ commit }, tempo) => {
    setTempo({ commit }, tempo)
}
