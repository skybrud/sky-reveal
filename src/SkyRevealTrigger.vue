<script>
import store from './store/';

export default {
	name: 'SkyRevealTrigger',
	props: {
		revealId: {
			type: [String, Number],
			required: true,
			validator(value) {
				return Boolean(value);
			},
		},
	},
	data() {
		return {};
	},
	computed: {
		isOpen() {
			const getterFn = this.$store.getters['SkyReveal/revealStates'];
			return getterFn && getterFn(this.revealId);
		},
	},
	methods: {
		toggle() {
			this.$store.dispatch('SkyReveal/toggle', this.revealId);
		},
	},
	created() {
		const payload = {};
		payload[this.revealId] = false;
		this.$store.commit('SkyReveal/REGISTER', payload);
	},
	beforeDestroy() {
		this.$store.commit('SkyReveal/UNREGISTER', this.revealId);
	},
};
</script>

<template src="./SkyRevealTrigger.html" />
