<template>
    <li v-bind:class="{ active: item.value }"
        @click="this.onClick">
        <div ref="slot" v-bind:class="{ slot: true, beat: beat }" v-bind:style="{ 'transition-duration': this.duration + 'ms' }"><slot /></div>
    </li>
</template>

<script>
import move from 'move-js'

export default {
    props: {
        index: Number,
        item: Object,
        size: Number,
        duration: Number,
        loopjump: Number
    },

    data() {
        return {
            beat: false
        }
    },

    watch: {
        loopjump: function () {
            const now = Date.now()
            const diff = now - this.loopjump // calculates the latency to adjust the animation delay

            // TODO clean up timeouts
            setTimeout(() => {
                this.beat = true

                setTimeout(() => {
                    this.beat = false
                }, this.duration)
            //}, (this.duration * 4 * (this.index % 4)) - diff)
            }, this.duration * this.index - diff)

        }
    },

    methods: {
        onClick() {
            this.$store.dispatch('toggleSequencerSlot', this.index)
            this.$socket.emit(
                'updateSequence',
                this.$store.getters.currentInstrumentName,
                this.$store.getters.sequencerValues,
                this.$store.getters.currentInstrumentOffset)
        }
    }
}
</script>

<style lang="scss" scoped>
    .slot,
    .slot span {
        height: 100%;
        display: block;
    }

    .slot {
        box-sizing: border-box;
        border: 5px solid #222;
        color: #fff;
    }

    .slot span {
        cursor: pointer;
        color: #fff;
        font-size: 600%;
        font-family: sans-serif;
        padding: 1rem;
        box-sizing: border-box;
    }

    // Beat animation
    .slot {
        transition-property: border-color;

        &.beat {
            border-color: #fff;
            transition: none;

        }

    }
</style>
