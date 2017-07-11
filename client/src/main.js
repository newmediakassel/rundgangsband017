import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import Vuex from 'vuex'

import store from './store'

Vue.use(VueSocketIO, 'http://0.0.0.0:3000', store)
//Vue.use(Vuex)

import App from './App.vue'


new Vue({
    el: '#app',
    store,
    render: h => h(App)
})
