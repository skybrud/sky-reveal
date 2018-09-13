<script>
export default {
	name: 'SkyRevealTrigger',
	props: {
		revealId: {
			type: [String, Number],
			required: true,
		},
	},
	data() {
		return {
			isOpen: false,
		};
	},
	created() {
		this.$SkyReveal.register({ id: this.revealId, isOpen: this.isOpen });
	},
	beforeDestroy() {
		this.$SkyReveal.unregister(this.revealId);
	},
	methods: {
		toggle() {
			this.isOpen = !this.isOpen;

			this.$SkyReveal.$emit('toggle', { id: this.revealId, isOpen: this.isOpen });
		},
	},
};
</script>

<template src="./SkyRevealTrigger.html" />
