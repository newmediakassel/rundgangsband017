<template>
    <div>
        <ul id="repeat-object" class="sequencer">
            <li v-for="(item, index) in sequence" v-bind:class="{ active: item.value }" @click="toogleSequence(index)">
                <span></span>
            </li>
        </ul>

        <div class="overlay">
            <select v-model="offset">
                <option value="0" default>Kick</option>
                <option value="5">Snare</option>
            </select>
        </div>
    </div>
</template>

<script>
const buildSequence = function (size, values = []) {
    let sec = []

    if (values.length < size) {
        console.log('foo')
        while (values.length < size) {
            values.push(false)
        }
    }

    console.log(values)

    values.forEach(value => {
        sec.push({ value })
    });

    console.log(sec)

    return sec
}

const SLOTS = 16

export default {
    data: () => ({
        isConnected: false,
        socketMessage: '',
        //sequence: [0,0,0,0],
        offset: 0,
        sequence: buildSequence(SLOTS)/*[
            { value: false },
            { value: false },
            { value: false },
            { value: false },

            { value: false },
            { value: false },
            { value: false },
            { value: false }
        ]*/
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
        },

        updateSequence(sequence) {
            this.sequence = buildSequence(SLOTS, sequence)
            console.log(this.getValues(), sequence)
        }
    },

    methods: {
        pingServer() {
            // Send the "pingServer" event to the server.
            console.log(this.slot1, this.slot2)
            this.$socket.emit('pingServer', [this.slot1, this.slot2])
        },

        getValues() {
            return this.sequence.map((el) => el.value)
        },

        toogleSequence(index) {
            // swap value
            this.sequence[index].value = !this.sequence[index].value

            const values = this.getValues()
            console.log('sending sequence', values)

            this.$socket.emit('updateSequence', values, this.offset);
        },

        isActive(index) {
            if (this.sequence[index]) {
                return true;
            }
            else {
                return false;
            }
        }
    },

    watch: {
        offset: function (val) {
            console.log('sending val', val)
            this.$socket.emit('instrumentOffset', val);
        }
    }
}
</script>


<style>
    html,
    body {
        height: 100%;
        background: black;
        padding: 0;
        margin: 0;
    }

    body > div {
        height: 100%;
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
        background: rgba(255,0,0,.3);
        cursor: pointer;
    }

    .sequencer li span:hover {
        background: rgba(255,0,0,.6);
    }

    .sequencer li.active span {
        background: red;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        background-color: #000;
    }
</style>
