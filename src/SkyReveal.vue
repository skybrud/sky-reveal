<script>
import SkyRevealStore from './SkyRevealStore';
import Revealer from './factories/revealer';

export default {
	name: 'SkyReveal',
	props: {
		revealId: [String, Number],
		open: Boolean,
		duration: {
			type: Number,
			default: 500,
		},
	},
	data() {
		return {
			revealer: null,
			activeToggle: false,
			isOpen: false,
			revealed: false,
			animating: false,
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
			SkyRevealStore.$on('toggle', this.toggledByTrigger);
		} else if (this.open !== undefined) {
			this.isOpen = this.open;
		} else {
			console.error('SkyReveal must have either "open" or "revealId" attribute!');
		}
	},
	mounted() {
		this.revealer = Revealer(
			this.$refs.main,
			this.$refs.inner,
			this.duration,
		);

		// If open from start
		if (this.isOpen) {
			this.openRevealer();
		}
	},
	updated() {
		this.isOpen
			? this.openRevealer()
			: this.closeRevealer();
	},
	methods: {
		openRevealer() {
			// Use this.revealed as a safeguard to prevent false triggers
			// when revealer is already open
			if (!this.revealed) {
				this.revealed = true;
				this.animating = true;

				this.$emit('open');
				this.revealer.open()
					.then(() => {
						this.animating = false;
						this.$emit('open-done');
					});
			}
		},
		closeRevealer() {
			// Use this.revealed as a safeguard to prevent false triggers
			// when revealer is already closed
			if (this.revealed) {
				this.revealed = false;
				this.animating = true;

				this.$emit('close');
				this.revealer.close()
					.then(() => {
						this.animating = false;
						this.$emit('close-done');
					});
			}
		},
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
