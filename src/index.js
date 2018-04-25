import SkyReveal from './SkyReveal.vue';
import SkyRevealTrigger from './SkyRevealTrigger.vue';
import SkyRevealStore from './store/';

const defaults = {
	registerComponents: true,
	store: null,
};

export default {
	install(Vue, options) {
		const { registerComponents, store } = Object.assign({}, defaults, options);
		console.log('install', options, registerComponents, store);
		if (registerComponents) {
			// Main component
			Vue.component(SkyReveal.name, SkyReveal);

			if (store) {
				store.registerModule(SkyReveal.name, SkyRevealStore);

				// Sub component(s)
				Vue.component(SkyRevealTrigger.name, SkyRevealTrigger);
			} else if (process.env.NODE_ENV !== 'production') {
				console.warn('[SkyRevealTrigger] Not installed. Provide a vuex store, ie.: Vue.use(SkyReveal, { store: myStore })');
			}
		}
	},
	SkyReveal,
	SkyRevealTrigger,
};