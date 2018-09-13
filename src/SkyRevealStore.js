export default function SkyRevealStore(Vue) {
	const instance = new Vue({
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
			this.$on('heightChanged', () => {
				this.$emit('updated');
			});
		},
		methods: {
			register({ id, isOpen }) {
				this.$set(this.states, id, isOpen);
			},
			unregister(id) {
				this.$delete(this.states, id);
			},
			getState(key) {
				return this.states[key];
			},
		},
	});

	Object.defineProperty(Vue.prototype, '$SkyReveal', {
		get() {
			return instance
		}
	})
}
