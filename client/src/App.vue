<template>
    <div>
        <ul id="repeat-object" v-bind:class="classObject">
            <li v-for="(item, index) in sequence" v-bind:class="{ active: item.value }" @click="toogleSequence(index)">
                <!--<span>{{ index + 1 }}</span>-->
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
        while (values.length < size) {
            values.push(false)
        }
    }

    values.forEach(value => {
        sec.push({ value })
    });

    return sec
}

const SLOTS = 16

const sequencerHighlight = {
    duration: -1,
    interval: null,
    slot: 0,
    setDuration: (duration) => {
        this.duration = duration
        this.slot = 0
        this.list = document.getElementById("repeat-object")

        if (this.interval) {
            clearInterval(this.interval)
        }

        this.interval = setInterval(() => {
            console.log('..', this.slot)
            const len = this.list.children.length

            for (let i = 0; i < len; i++) {
                const child = this.list.children[i]

                if (i == this.slot) {
                    child.classList.add('test')
                }
                else {
                    child.classList.remove('test')
                }
            }
            //this.list.children[this.slot].classList.add('test')
            this.slot++
        }, duration / SLOTS)
    }
}

export default {
    data: () => ({
        isConnected: false,
        socketMessage: '',
        offset: 0,
        sequence: buildSequence(SLOTS)
    }),

    sockets: {
        connect() {
            // Fired when the socket connects.
            this.isConnected = true;
            this.$socket.emit('create', this.offset);
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
        },

        loopjump(duration) {
            sequencerHighlight.setDuration(duration)
            //console.log('got new loopjump with duration', duration)
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

            this.$socket.emit('updateSequence', values, this.offset)
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
            this.$socket.emit('create', val);
        }
    },
     computed: {
         classObject: function () {
             var classes = { 'sequencer': true }
             classes['instrument-' + this.offset] = true

             return classes
         }
     }
}
</script>


<style>
    @keyframes beat {
	       to { border-color: #fff; }
    }
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
        cursor: pointer;
        color: #fff;
        font-size: 600%;
        font-family: sans-serif;
        padding: 1rem;
        box-sizing: border-box;
        border: 5px solid #888;
    }

    .sequencer li.test span {
        border-color: #fff;
    }

    .instrument-0.sequencer li span {
        background: rgba(255,0,255,1);
        opacity: 0.3
    }

    .instrument-5.sequencer li span {
        background: rgba(255,0,0,1);
        opacity: 0.3
    }

    .instrument-0.sequencer li span:before { content: '🥁'; }
    .instrument-5.sequencer li span:before { content: '👏'; }

    .instrument-0.sequencer li span:hover {
        background: rgba(255,0,255,.6);
    }

    .instrument-5.sequencer li span:hover {
        background: rgba(255,0,0,.6);
    }

    .instrument-0.sequencer li.active span {
        background: rgba(255,0,255,1);
        opacity: 1;
    }

    .instrument-5.sequencer li.active span {
        background: red;
        opacity: 1;

    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        background-color: #000;
    }
</style>
