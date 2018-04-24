<script>
import Revealer from './factories/revealer';

export default {
	name: 'SkyReveal',
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
		revealStates() {
			return this.$store.getters['SkyReveal/revealStates'];
		},
		ariaExpanded() {
			/**
			 * Needs to stringify ariaExpanded bool to avoid ariaExpanded
			 * being removed by VueJs
			 **/
			if (this.revealId && this.revealStates) {
				return `${this.revealStates(this.revealId)}`;
			} else if (!this.revealId) {
				return `${this.open}`;
			}

			return null;
		},
		showContent() {
			if (this.revealId && this.revealStates) {
				return this.revealStates(this.revealId);
			} else if (!this.revealId) {
				return this.open;
			}

			return null;
		},
	},
	mounted() {
		this.revealer = Revealer(this.$refs.main, this.$refs.inner);

		// If open from start
		if (this.showContent) {
			this.revealer.open();
		}

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
			this.showContent
				? this.revealer.open()
				: this.revealer.close();
		}
	},
};
</script>

<template src="./SkyReveal.html"></template>
<style src="./SkyReveal.scss"></style>
