import Vue from 'vue';

const mutations = {
	REGISTER: (state, payload) => {
		Object.keys(payload).forEach((key) => {
			if (key in state) {
				console.warn(`Replaced reveal with id '${key}' because similar reveal id already exists`);
			}
			Vue.set(state, key, payload[key]);
		});
	},
	UNREGISTER(state, id) {
		if (id in state) {
			Vue.delete(state, id);
		} else {
			console.warn(`tried to unregister reveal with id '${id}' while it is not registered`);
		}
	},
	TOGGLE(state, id) {
		if (id in state) {
			state[id] = !state[id];
		} else {
			console.warn(`Cannot toggle reveal with id '${id}' because it does not exist`);
		}
	},
};

export default mutations;
