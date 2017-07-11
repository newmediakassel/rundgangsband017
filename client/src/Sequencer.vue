<template>
	<ul v-bind:class="classObject">
		<li v-bind:is="childName"
			v-for="(item, index) in sequence"
			v-bind:key="index"
			v-bind:item="item"
			v-bind:index="index"
			v-bind:size="slots"
			v-bind:duration="slotDuration"
			v-bind:loopjump="loopjump">
			<!--<span>{{ index + 1 }}</span>-->
			<span></span>
		</li>
	</ul>
</template>

<script>
import { mapGetters } from 'vuex'
import LinearSequence from './LinearSequence.vue'
import VerticalSequence from './VerticalSequence.vue'

export default {
	props: {
		offset: Number,
		slots: Number,
		childName: String,
	},

	components: {
		LinearSequence,
		VerticalSequence
	},

	data() {
		return {
		}
	},

	created() {
		this.$store.dispatch('setSequencerSize', this.slots)
	},

	/*sockets: {
		loopjump(duration) {
			sequencerHighlight.setDuration(this.slots, duration, this.$refs.repeatObject)
			//console.log('got new loopjump with duration', duration)
		}
	},*/

	methods: {
		log() {
			console.log(...arguments)
		}
	},

	computed: {
		classObject: function () {
			const classes = { 'sequencer': true }

			classes['instrument-' + this.offset] = true

			return classes
		},

		slotDuration: function () {
			//((60/60)/4)*1000
			const bps = 60 / this.$store.getters.currentBpm

			const duration = bps / Math.sqrt(this.slots) * 1000

			return duration
		},

		...mapGetters({
			sequence: 'sequencerSlots',
			loopjump: 'loopjumpTimestamp'
		}),
	}
}
</script>

<style lang="scss" scoped>
.sequencer {
	margin: 0;
	padding: 0;
	height: 100%;
	width: 100%;

	li {
		display: inline-block;
		width: 25%;
		height: 25%;
		padding: 0 5px 5px;
		box-sizing: border-box;
	}
}
</style>
