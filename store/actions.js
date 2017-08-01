const actions = {
	toggle(context, id) {
		context.commit('TOGGLE', id);
	},
};

export default actions;
