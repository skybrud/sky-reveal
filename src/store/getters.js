const getters = {
	revealStates(state) {
		return key => state[key] || false;
	},
};

export default getters;
