import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'

import Sequencer from './modules/Sequencer'

import defaultState from './defaultState'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
	state: defaultState,
	actions,
	getters,
	mutations,
	modules: {
		Sequencer,
	},
	strict: debug,
	//plugins: debug ? [createLogger()] : []
})
