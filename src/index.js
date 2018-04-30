import SkyReveal from './SkyReveal.vue';
import SkyRevealTrigger from './SkyRevealTrigger.vue';
import SkyRevealStore from './SkyRevealStore';

const defaults = {
	registerComponents: true,
};

export {
	SkyReveal,
	SkyRevealTrigger,
	SkyRevealStore
};

export default {
	install(Vue, options) {
		const { registerComponents } = Object.assign({}, defaults, options);

		if (registerComponents) {
			// Main component
			Vue.component(SkyReveal.name, SkyReveal);

			// Sub component(s)
			Vue.component(SkyRevealTrigger.name, SkyRevealTrigger);
		}
	},
};