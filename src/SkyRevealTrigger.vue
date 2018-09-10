<script>
// import SkyRevealStore from './SkyRevealStore';

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
		SkyRevealStore.register({ id: this.revealId, isOpen: this.isOpen });
	},
	beforeDestroy() {
		SkyRevealStore.unregister(this.revealId);
	},
	methods: {
		toggle() {
			this.isOpen = !this.isOpen;

			SkyRevealStore.$emit('toggle', { id: this.revealId, isOpen: this.isOpen });
		},
	},
};
</script>

<template src="./SkyRevealTrigger.html" />
