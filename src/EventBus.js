import Vue from 'vue';

const EventBus = new Vue({
	data() {
		return {
			states: {},
		};
	},
	created() {
		this.$on('toggle', ({ id, isOpen }) => {
			this.states[id] === undefined
				? console.warn(`[SkyReveal] The following id is not registred: ${id}`)
				: this.states[id] = isOpen;
		});
	},
	methods: {
		register({ id, isOpen}) {
			this.$set(this.states, id, isOpen);
		},
		unregister(id) {
			this.$delete(this.states , id);
		},
		getState(key) {
			return this.states[key];
		},
	},
});

export default EventBus;
