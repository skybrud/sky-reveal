<script>
export default {
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
			return this.$store.getters['SkyReveal/revealStates'](this.revealId);
		},
	},
	methods: {
		toggle() {
			this.$store.dispatch('SkyReveal/toggle', this.revealId);
		},
	},
	mounted() {
		const payload = {};
		payload[this.revealId] = false;
		this.$store.commit('SkyReveal/REGISTER', payload);
	},
	beforeDestroy() {
		this.$store.commit('SkyReveal/UNREGISTER', this.revealId);
	},
};
</script>

<template src="./SkyRevealTrigger.html"></template>
