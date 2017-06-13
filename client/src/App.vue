<template>
  <div id="app">
    <p v-if="isConnected">We're connected to the server!</p>

    <p>Message from server: "{{socketMessage}}"</p>

    <input type="number" v-model="slot1" v-on:blur="pingServer()" placeholder="track">
    <input type="number" v-model="slot2" v-on:blur="pingServer()" placeholder="slot">
    
    <button @click="pingServer()">Ping Server</button>
  </div>
</template>

<script>
export default {
    data: () => ({
        isConnected: false,
        socketMessage: '',
        slot1: 0,
        slot2: 0
    }),

    sockets: {
        connect() {
            // Fired when the socket connects.
            this.isConnected = true;
        },

        disconnect() {
            this.isConnected = false;
        },

        // Fired when the server sends something on the "messageChannel" channel.
        news(data) {
            this.socketMessage = data
        }
    },

    methods: {
        pingServer() {
            // Send the "pingServer" event to the server.
            console.log(this.slot1, this.slot2)
            this.$socket.emit('pingServer', [this.slot1, this.slot2])
        }
    }
}
</script>


<style>
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
    }

    h1, h2 {
      font-weight: normal;
    }
</style>
