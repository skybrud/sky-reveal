import Vue from 'vue';
import Store from 'store';

import SkyReveal from './SkyReveal';
import SkyRevealTrigger from './SkyRevealTrigger';
import SkyRevealStore from './store';

Store.addModule('SkyReveal', SkyRevealStore);

// Main component
Vue.component('SkyReveal', SkyReveal);

// Sub component(s)
Vue.component('SkyRevealTrigger', SkyRevealTrigger);

export default SkyReveal;
