import SkyReveal from './SkyReveal.vue';
import SkyRevealTrigger from './SkyRevealTrigger.vue';
import SkyRevealStore from './SkyRevealStore';

const defaults = {
	registerComponents: true,
};

export {
	SkyReveal,
	SkyRevealTrigger,
	SkyRevealStore,
};

export default function install(Vue, options) {
	const { registerComponents } = Object.assign({}, defaults, options);

	Vue.use(SkyRevealStore);

	if (registerComponents) {
		// Main component
		Vue.component(SkyReveal.name, SkyReveal);

		// Sub component(s)
		Vue.component(SkyRevealTrigger.name, SkyRevealTrigger);
	}
};