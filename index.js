import Vue from 'vue';
import store from 'store';

import skyRevealStore from './store';
import skyReveal from './sky-reveal';
import skyRevealTrigger from './sky-reveal-trigger';

store.registerModule('skyReveal', skyRevealStore);

// Main component
Vue.component('sky-reveal', skyReveal);

// Sub component(s)
Vue.component('sky-reveal-trigger', skyRevealTrigger);

export default skyReveal;
