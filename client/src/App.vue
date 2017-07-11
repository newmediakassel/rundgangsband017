<template>
    <div>
        <Sequencer
            v-bind:childName="childName"
            v-bind:offset="offset"
            v-bind:slots="sequencerSlots" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Sequencer from './Sequencer.vue'

export default {
    data: () => ({
        isConnected: false,
        sequencerSlots: 16
    }),

    components: {
        Sequencer
    },

    computed: {
        ...mapGetters({
            childName: 'currentInstrumentComponent',
            offset: 'currentInstrumentOffset',
            connected: 'isConnected'
        }),
    },

    sockets: {
        connect() {
            // Fired when the socket connects.
            this.$socket.emit('requestInstrument');
        }

        /*loopjump(duration) {
            sequencerHighlight.setDuration(duration)
            //console.log('got new loopjump with duration', duration)
        }*/
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


<style lang="scss">
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


    // ----

    .sequencer li .slot span {
        display: block;
    }

    .instrument-0.sequencer,
    .instrument-5.sequencer,
    .instrument-10.sequencer {
        li {
            .slot {
                span {
                    background: rgba(255,0,255,1);
                }

                &:before span { // TODO
                    content: '👏';
                }

                &:hover span {
                    background: rgba(255,0,255,.6);
                }
            }

            &.active .slot span {
                background: rgba(255,0,255,1);
            }
        }
    }

    .sequencer li .slot span {
        opacity: 0.3
    }

    .sequencer li.active .slot span {
        opacity: 1;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        background-color: #000;
    }
</style>
