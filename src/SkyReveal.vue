<script>
import Revealer from './factories/revealer';
import EventBus from './EventBus';

export default {
	name: 'SkyReveal',
	props: {
		revealId: [String, Number],
		open: Boolean,
	},
	data() {
		return {
			revealer: null,
			activeToggle: false,
			isOpen: false,
		};
	},
	computed: {
		ariaExpanded() {
			/**
			 * Needs to stringify ariaExpanded bool to avoid ariaExpanded
			 * being removed by VueJs
			 **/
			return `${this.isOpen}`;
		},
	},
	watch: {
		open(val) {
			this.isOpen = val;
		},
	},
	created() {
		if (this.revealId !== undefined) {
			EventBus.$on('toggle', this.toggledByTrigger);
		} else if (this.open !== undefined) {
			this.isOpen = this.open;
		} else {
			console.error('SkyReveal must have either "open" or "revealId" attribute!');
		}
	},
	mounted() {
		this.revealer = Revealer(this.$refs.main, this.$refs.inner);

		// If open from start
		if (this.isOpen) {
			this.revealer.open();
		}
	},
	updated() {
		this.isOpen
			? this.revealer.open()
			: this.revealer.close();
	},
	methods: {
		toggledByTrigger(data) {
			if (this.revealId === data.id) {
				this.isOpen = data.isOpen;
			}
		},
	},
};
</script>

<template src="./SkyReveal.html"></template>
<style src="./SkyReveal.scss"></style>
