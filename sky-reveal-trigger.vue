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
			return this.$store.getters['skyReveal/revealStates'](this.revealId);
		},
	},
	methods: {
		toggle() {
			this.$store.dispatch('skyReveal/toggle', this.revealId);
		},
	},
	created() {
		const payload = {};
		payload[this.revealId] = false;
		this.$store.commit('skyReveal/REGISTER', payload);
	},
	destroy() {
		this.$store.commit('skyReveal/UNREGISTER', this.revealId);
	},
};
</script>

<template src="./sky-reveal-trigger.html"></template>
