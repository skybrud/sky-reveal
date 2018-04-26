import SkyReveal from './SkyReveal.vue';
import SkyRevealTrigger from './SkyRevealTrigger.vue';

const defaults = {
	registerComponents: true,
};

export {
	SkyReveal,
	SkyRevealTrigger,
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