import Vue from 'vue';
import anime from 'animejs';

const SkyRevealStore = new Vue({
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

function animeInstance (target, collapsed, autoHeight, duration) {
	let onComplete = () => {};

	const anim = anime({
		targets: target,
		height: [collapsed, autoHeight],
		direction: 'reverse',
		complete: (self) => {
			if (!self.reversed) {
				target.removeAttribute('style');
			}

			SkyRevealStore.$emit('heightChanged');
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

var Revealer = (target, innerTarget, duration) => {
	const isBrowser = typeof window !== 'undefined';
	const collapsed = (isBrowser && window.getComputedStyle(target).minHeight) || 0;
	let anim = animeInstance(target, collapsed, heightSummation(target, innerTarget), duration);

	const reInstantiate = () => {
		anim = animeInstance(target, collapsed, heightSummation(target, innerTarget), duration);
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
			SkyRevealStore.$on('toggle', this.toggledByTrigger);
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
		);

		// If open from start
		if (this.isOpen) {
			this.openRevealer();
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
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-18677aaf_0", { source: "\n.sky-reveal{position:relative;overflow:hidden\n}\n.sky-reveal-trigger{display:inline-flex;align-items:center;padding:0;background:0 0;border:0;font-size:inherit;outline:0\n}", map: undefined, media: undefined });

  };
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

    {
      let hook;
      if (style) {
        hook = function(context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook !== undefined) {
        if (component.functional) {
          // register for functional component in vue file
          const originalRender = component.render;
          component.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context)
          };
        } else {
          // inject component registration as beforeCreate hook
          const existing = component.beforeCreate;
          component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }
    }

    return component
  }
  /* style inject */
  function __vue_create_injector__() {
    const head = document.head || document.getElementsByTagName('head')[0];
    const styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
    const isOldIE =
      typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

    return function addStyle(id, css) {
      if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return // SSR styles are present.

      const group = isOldIE ? css.media || 'default' : id;
      const style = styles[group] || (styles[group] = { ids: [], parts: [], element: undefined });

      if (!style.ids.includes(id)) {
        let code = css.source;
        let index = style.ids.length;

        style.ids.push(id);

        if (css.map) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
          // http://stackoverflow.com/a/26603875
          code +=
            '\n/*# sourceMappingURL=data:application/json;base64,' +
            btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
            ' */';
        }

        if (isOldIE) {
          style.element = style.element || document.querySelector('style[data-group=' + group + ']');
        }

        if (!style.element) {
          const el = style.element = document.createElement('style');
          el.type = 'text/css';

          if (css.media) el.setAttribute('media', css.media);
          if (isOldIE) {
            el.setAttribute('data-group', group);
            el.setAttribute('data-next-index', '0');
          }

          head.appendChild(el);
        }

        if (isOldIE) {
          index = parseInt(style.element.getAttribute('data-next-index'));
          style.element.setAttribute('data-next-index', index + 1);
        }

        if (style.element.styleSheet) {
          style.parts.push(code);
          style.element.styleSheet.cssText = style.parts
            .filter(Boolean)
            .join('\n');
        } else {
          const textNode = document.createTextNode(code);
          const nodes = style.element.childNodes;
          if (nodes[index]) style.element.removeChild(nodes[index]);
          if (nodes.length) style.element.insertBefore(textNode, nodes[index]);
          else style.element.appendChild(textNode);
        }
      }
    }
  }
  /* style inject SSR */
  

  
  var SkyReveal = __vue_normalize__(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    __vue_create_injector__,
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
		SkyRevealStore.register({ id: this.revealId, isOpen: this.isOpen });
	},
	beforeDestroy() {
		SkyRevealStore.unregister(this.revealId);
	},
	methods: {
		toggle() {
			this.isOpen = !this.isOpen;

			SkyRevealStore.$emit('toggle', { id: this.revealId, isOpen: this.isOpen });
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

const defaults = {
	registerComponents: true,
};

function install(Vue$$1, options) {
	const { registerComponents } = Object.assign({}, defaults, options);

	if (registerComponents) {
		// Main component
		Vue$$1.component(SkyReveal.name, SkyReveal);

		// Sub component(s)
		Vue$$1.component(SkyRevealTrigger.name, SkyRevealTrigger);
	}
}

export default install;
export { SkyReveal, SkyRevealTrigger, SkyRevealStore };
