<template>
    <ul id="repeat-object" class="sequencer">
        <li v-for="(item, index) in sequence" v-bind:class="{ active: item.value }" @click="toogleSequence(index)">
            <span></span>
        </li>
    </ul>
</template>

<script>
export default {
    data: () => ({
        isConnected: false,
        socketMessage: '',
        //sequence: [0,0,0,0],
        sequence: [
            { value: false },
            { value: false },
            { value: false },
            { value: false },

            { value: false },
            { value: false },
            { value: false },
            { value: false }
        ]
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
        },

        toogleSequence(index) {
            // swap value
            this.sequence[index].value = !this.sequence[index].value

            const values = this.sequence.map((el) => el.value)
            console.log('sending sequence', values)

            this.$socket.emit('update_sequence', values);
        },

        isActive(index) {
            if (this.sequence[index]) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}
</script>


<style>
    html,
    body {
        height: 100%;
        background: pink;
        padding: 0;
        margin: 0;
    }

    .sequencer {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;

    }

    .sequencer li {
        display: inline-block;
        width: 25%;
        height: 25%;
        padding: 0 5px 5px;
        box-sizing: border-box;
    }

    .sequencer li span {
        display: block;
        width: 100%;
        height: 100%;
        background: red;
    }

    .sequencer li.active span {
        background: #000;
    }
</style>
