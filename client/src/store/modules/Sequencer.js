import Vue from 'vue'

import * as types from '../mutation-types'
import { emit } from '../socket'

// a sequencer holds a list of slots.
// each one can be true or false.
//
// { slots:[{ value: false }] }
const state = {
    slots: [],
    values: []
}


// ! --- getters ---

const getters = {
    sequencerLength: state => state.slots.length,
    sequencerSlots: state => state.slots.slice(), // always return a copy of the array
    sequencerValues: state => state.values.slice()
}


// ! --- actions ---

const actions = {
    socket_updateVerticalSequence({ commit, state }, values) {
        console.log('got vertical sequence from store', values)
        const sqrt = Math.sqrt(getters.sequencerLength(state))

        values.forEach((value, i) => {
            const x = i % sqrt
            const y = Math.floor(i / sqrt)

            const newIndex = x * sqrt + y

            if (state.values[newIndex].value !== value) {
                commit(types.SEQUENCE_UPDATE, {
                    index: newIndex,
                    value
                })
            }

            /*if (state.values[i].value !== value) {
                commit(types.SET_SEQUENCE_VALUE, {
                    index: i,
                    value
                })
            }*/
        })

        commit(types.SET_SEQUENCE_VALUES, values)
    },

    socket_updateLinearSequence({ commit, state }, values) {

        values.forEach((value, index) => {
            if (state.slots[index].value === value) {
                return
            }

            console.log('types.SEQUENCE_UPDATE', index)
            commit(types.SEQUENCE_UPDATE, {
                index,
                value
            })
        })

        commit(types.TRANSFORM_SEQUENCE_VALUES)
    },

    setSequencerSize({commit}, size, values = []) {
        console.log('setting sequencer size', size)
        commit(types.SEQUENCE_SET_SIZE, { size, values })
    },

    toggleSequencerSlot({commit, state}, index) {
        commit(types.SEQUENCE_UPDATE, {
            index,
            value: !state.slots[index].value
        })
        commit(types.TRANSFORM_SEQUENCE_VALUES)
    },

    setVerticalSlot({ commit, state }, index) {
        const sqrt = Math.sqrt(getters.sequencerLength(state))
        const verticalIndex = index % sqrt

        for (let i = 0; i < sqrt; i++) {
            const slotIndex = i * sqrt + verticalIndex

            commit(types.SEQUENCE_UPDATE, {
                index: slotIndex,
                value: index === slotIndex ? !state.slots[index].value : false
            })
        }

        commit(types.TRANSFORM_SEQUENCE_VALUES, (el, i, s) => {
            const x = i % sqrt
            const y = Math.floor(i / sqrt)

            console.log(el, el.value, s)

            const newIndex = x * sqrt + y

            return {
                index: newIndex,
                value: el.value
            }

        })
    }
}


// ! --- helpers ---

const buildSequence = function (size, values = []) {
	console.log('buildSequence', size)
	let sec = []

	if (values.length < size) {
		while (values.length < size) {
			values.push(false)
		}
	}

	values.forEach(value => {
		sec.push({ value })
	});

	return sec
}

const buildValues = function (size, values = []) {
	console.log('buildValues', size)

	if (values.length < size) {
		while (values.length < size) {
			values.push(false)
		}
	}

	return values.slice()
}


// ! --- mutations ---

const mutations = {
    [types.SEQUENCE_SET_SIZE] (state, { size, values = [] }) {
        state.slots = buildSequence(size, values)
        state.values = buildValues(size, values)
    },

    [types.SEQUENCE_UPDATE] (state, { index, value }) {
        state.slots[index].value = value
        //state.values[index].value = value
    },

    [types.SET_SEQUENCE_VALUE] (state, { index, value }) {
        state.values[index] = value
    },

    [types.SET_SEQUENCE_VALUES] (state, values) {
        state.values = values.slice()
    },

    [types.TRANSFORM_SEQUENCE_VALUES] (state, _transformer) {
        const transformer = _transformer || ((el, index, state) => {
            return {
                index,
                value: el.value
            }
        })

        state.slots.forEach((el, slotIndex) => {
            const { index, value } = transformer(el, slotIndex, state)
            state.values.splice(index, 1, value)
        })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
