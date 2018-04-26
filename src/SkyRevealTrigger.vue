<script>
import EventBus from './EventBus';

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
		EventBus.register({ id: this.revealId, isOpen: this.isOpen });
	},
	beforeDestroy() {
		EventBus.unregister(this.revealId);
	},
	methods: {
		toggle() {
			this.isOpen = !this.isOpen;

			EventBus.$emit('toggle', { id: this.revealId, isOpen: this.isOpen });
		},
	},
};
</script>

<template src="./SkyRevealTrigger.html" />
