import anime from 'animejs';

function heightSummation (element, innerElement) {
	const isBrowser = typeof window !== 'undefined';

	const firstChild = innerElement.querySelector(':first-child');
	const lastChild = innerElement.querySelector(':last-child');
	const innerStyles = isBrowser && window.getComputedStyle(innerElement);
	const targetStyles = isBrowser && window.getComputedStyle(element);

	let firstChildStyles = null;
	let lastChildStyles = null;

	if (firstChild) {
		firstChildStyles = isBrowser && window.getComputedStyle(firstChild);
	}

	if (lastChild) {
		lastChildStyles = isBrowser && window.getComputedStyle(lastChild);
	}

	let returnValue = 0;

	if (isBrowser) {
		returnValue += Number(targetStyles.paddingTop.replace('px', ''));
		returnValue += Number(targetStyles.paddingBottom.replace('px', ''));

		returnValue += Number(innerStyles.marginTop.replace('px', ''));
		returnValue += Number(innerStyles.marginBottom.replace('px', ''));
		returnValue += Number(innerStyles.height.replace('px', ''));

		if (firstChild) {
			returnValue += Number(firstChildStyles.marginTop.replace('px', ''));
		}
		if (lastChild) {
			returnValue += Number(lastChildStyles.marginBottom.replace('px', ''));
		}
	}

	return returnValue;
}

function animeInstance (target, collapsed, autoHeight, duration, storeRef) {
	let onComplete = () => {};

	const anim = anime({
		targets: target,
		height: [collapsed, autoHeight],
		direction: 'reverse',
		complete: (self) => {
			if (!self.reversed) {
				target.removeAttribute('style');
			}

			storeRef.$emit('heightChanged');
			onComplete();

			self.began = false;
			self.completed = false;
		},
		autoplay: false,
		duration,
		easing: 'easeInOutCubic',
	});

	return {
		play() {
			return new Promise((resolve) => {
				onComplete = resolve;
				anim.play();
				anim.reverse();
			});
		},
		get reversed() {
			return anim.reversed;
		},
		get animations() {
			return anim.animations;
		},
		get progress() {
			return anim.progress;
		},
	};
}

var Revealer = (target, innerTarget, duration, storeRef) => {
	const isBrowser = typeof window !== 'undefined';
	const collapsed = (isBrowser && window.getComputedStyle(target).minHeight) || 0;
	let anim = animeInstance(target, collapsed, heightSummation(target, innerTarget), duration, storeRef);

	const reInstantiate = () => {
		anim = animeInstance(target, collapsed, heightSummation(target, innerTarget), duration, storeRef);
	};

	const open = () => new Promise((resolve) => {
		if (anim.reversed) {
			if (anim.animations[0].tweens[0].value[1] !== heightSummation(target, innerTarget)) {
				reInstantiate();
			}
			anim.play()
				.then(resolve);
		} else {
			resolve();
		}
	});

	const close = () => new Promise((resolve) => {
		if (!anim.reversed) {
			anim.play()
				.then(resolve);
		} else {
			resolve();
		}
	});

	const toggle = () => {
		anim.progress > 0
			? close()
			: open();
	};

	return {
		open,
		close,
		toggle,
	};
};

var script = {
	name: 'SkyReveal',
	props: {
		revealId: [String, Number],
		open: Boolean,
		duration: {
			type: Number,
			default: 500,
		},
	},
	data() {
		return {
			revealer: null,
			activeToggle: false,
			isOpen: false,
			revealed: false,
			animating: false,
		};
	},
	computed: {
		ariaExpanded() {
			/**
			 * Needs to stringify ariaExpanded bool to avoid ariaExpanded
			 * being removed by VueJs
			 **/
			return `${this.isOpen}`;
		},
	},
	watch: {
		open(val) {
			this.isOpen = val;
		},
	},
	created() {
		if (this.revealId !== undefined) {
			this.$SkyReveal.$on('toggle', this.toggledByTrigger);
		} else if (this.open !== undefined) {
			this.isOpen = this.open;
		} else {
			console.error('SkyReveal must have either "open" or "revealId" attribute!');
		}
	},
	mounted() {
		this.revealer = Revealer(
			this.$refs.main,
			this.$refs.inner,
			this.duration,
			this.$SkyReveal,
		);

		// If open from start
		if (this.isOpen) {
			this.openRevealer();
		} else {
			this.$refs.main.style.height = '0px';
		}
	},
	updated() {
		this.isOpen
			? this.openRevealer()
			: this.closeRevealer();
	},
	methods: {
		openRevealer() {
			// Use this.revealed as a safeguard to prevent false triggers
			// when revealer is already open
			if (!this.revealed) {
				this.revealed = true;
				this.animating = true;

				this.$emit('open');
				this.revealer.open()
					.then(() => {
						this.animating = false;
						this.$emit('open-done');
					});
			}
		},
		closeRevealer() {
			// Use this.revealed as a safeguard to prevent false triggers
			// when revealer is already closed
			if (this.revealed) {
				this.revealed = false;
				this.animating = true;

				this.$emit('close');
				this.revealer.close()
					.then(() => {
						this.animating = false;
						this.$emit('close-done');
					});
			}
		},
		toggledByTrigger(data) {
			if (this.revealId === data.id) {
				this.isOpen = data.isOpen;
			}
		},
	},
};

/* script */
            const __vue_script__ = script;
/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"main",class:['sky-reveal', {
		closed: !_vm.isOpen,
		animating: _vm.animating,
	}],attrs:{"aria-expanded":_vm.ariaExpanded}},[_c('div',{ref:"inner",staticClass:"inner"},[_c('transition',{attrs:{"name":"sky-reveal-anim","duration":500}},[(_vm.isOpen)?_c('div',[_vm._t("default")],2):_vm._e()])],1)])};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "SkyReveal.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var SkyReveal = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

var script$1 = {
	name: 'SkyRevealTrigger',
	props: {
		revealId: {
			type: [String, Number],
			required: true,
		},
	},
	data() {
		return {
			isOpen: false,
		};
	},
	created() {
		this.$SkyReveal.register({ id: this.revealId, isOpen: this.isOpen });
	},
	beforeDestroy() {
		this.$SkyReveal.unregister(this.revealId);
	},
	methods: {
		toggle() {
			this.isOpen = !this.isOpen;

			this.$SkyReveal.$emit('toggle', { id: this.revealId, isOpen: this.isOpen });
		},
	},
};

/* script */
            const __vue_script__$1 = script$1;
            
/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('button',{class:['sky-reveal-trigger', {open: _vm.isOpen}],on:{"click":_vm.toggle}},[_vm._t("svg"),_vm._v(" "),_vm._t("svg-prepend"),_vm._v(" "),(!_vm.isOpen)?_vm._t("open"):_vm._t("closed"),_vm._v(" "),_vm._t("svg-append")],2)};
var __vue_staticRenderFns__$1 = [];

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* component normalizer */
  function __vue_normalize__$1(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    const component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "SkyRevealTrigger.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component
  }
  /* style inject */
  
  /* style inject SSR */
  

  
  var SkyRevealTrigger = __vue_normalize__$1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

function SkyRevealStore(Vue) {
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

	Vue.util.defineReactive(Vue.prototype, '$SkyOverlay', instance);
}

const defaults = {
	registerComponents: true,
};

function install(Vue, options) {
	const { registerComponents } = Object.assign({}, defaults, options);

	if (registerComponents) {
		Vue.use(SkyRevealStore);

		// Main component
		Vue.component(SkyReveal.name, SkyReveal);

		// Sub component(s)
		Vue.component(SkyRevealTrigger.name, SkyRevealTrigger);
	}
}

export default install;
export { SkyReveal, SkyRevealTrigger, SkyRevealStore };
