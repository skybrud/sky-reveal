<script>
import Revealer from './factories/revealer';

export default {
	props: {
		revealId: {
			type: [String, Number],
			default: null,
		},
		open: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			revealer: null,
			activeToggle: false,
		};
	},
	computed: {
		ariaExpanded() {
			/**
			 * Needs to stringify ariaExpanded bool to avoid ariaExpanded
			 * being removed by VueJs
			 **/
			let state = this.open;

			if (this.revealId) {
				const states = this.$store.getters['skyReveal/revealStates'];
				state = states[this.revealId];
			}

			return `${state}`;
		},
		isOpen() {
			let state = this.open;

			if (this.revealId) {
				const states = this.$store.getters['skyReveal/revealStates'];
				state = states[this.revealId];
			}

			return state;
		},
	},
	mounted() {
		this.revealer = Revealer(this.$el);

		/*
			nextTick is for avoiding runnning this.toggle() in update hook
			the first time around.
		*/
		this.$nextTick(() => {
			this.activeToggle = true;
		});
	},
	updated() {
		if (this.activeToggle) {
			this.isOpen ? this.revealer.open() : this.revealer.close();
		}
	},
};
</script>

<template src="./sky-reveal.html"></template>
<style src="./sky-reveal.scss"></style>
