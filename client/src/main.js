import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

Vue.use(VueSocketIO, 'http://192.168.1.20:3000')

import App from './App.vue'

new Vue({
    el: '#app',
    render: h => h(App)
})
