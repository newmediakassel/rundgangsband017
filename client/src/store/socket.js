import Vue from 'vue'

export const emit = () => (new Vue()).$socket.emit(...arguments)
