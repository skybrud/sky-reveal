'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var anime = _interopDefault(require('animejs'));

function heightSummation (element, innerElement) {
	var isBrowser = typeof window !== 'undefined';

	var firstChild = innerElement.querySelector(':first-child');
	var lastChild = innerElement.querySelector(':last-child');
	var innerStyles = isBrowser && window.getComputedStyle(innerElement);
	var targetStyles = isBrowser && window.getComputedStyle(element);

	var firstChildStyles = null;
	var lastChildStyles = null;

	if (firstChild) {
		firstChildStyles = isBrowser && window.getComputedStyle(firstChild);
	}

	if (lastChild) {
		lastChildStyles = isBrowser && window.getComputedStyle(lastChild);
	}

	var returnValue = 0;

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
	var onComplete = function () {};

	var anim = anime({
		targets: target,
		height: [collapsed, autoHeight],
		direction: 'reverse',
		complete: function (self) {
			if (!self.reversed) {
				target.removeAttribute('style');
			}

			storeRef.$emit('heightChanged');
			onComplete();

			self.began = false;
			self.completed = false;
		},
		autoplay: false,
		duration: duration,
		easing: 'easeInOutCubic',
	});

	return {
		play: function play() {
			return new Promise(function (resolve) {
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

function Revealer (target, innerTarget, duration, storeRef) {
	var isBrowser = typeof window !== 'undefined';
	var collapsed = (isBrowser && window.getComputedStyle(target).minHeight) || 0;
	var anim = animeInstance(target, collapsed, heightSummation(target, innerTarget), duration, storeRef);

	var reInstantiate = function () {
		anim = animeInstance(target, collapsed, heightSummation(target, innerTarget), duration, storeRef);
	};

	var open = function () { return new Promise(function (resolve) {
		if (anim.reversed) {
			if (anim.animations[0].tweens[0].value[1] !== heightSummation(target, innerTarget)) {
				reInstantiate();
			}
			anim.play()
				.then(resolve);
		} else {
			resolve();
		}
	}); };

	var close = function () { return new Promise(function (resolve) {
		if (!anim.reversed) {
			anim.play()
				.then(resolve);
		} else {
			resolve();
		}
	}); };

	var toggle = function () {
		anim.progress > 0
			? close()
			: open();
	};

	return {
		open: open,
		close: close,
		toggle: toggle,
	};
}

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
	data: function data() {
		return {
			revealer: null,
			activeToggle: false,
			isOpen: false,
			revealed: false,
			animating: false,
		};
	},
	computed: {
		ariaExpanded: function ariaExpanded() {
			/**
			 * Needs to stringify ariaExpanded bool to avoid ariaExpanded
			 * being removed by VueJs
			 **/
			return ("" + (this.isOpen));
		},
	},
	watch: {
		open: function open(val) {
			this.isOpen = val;
		},
	},
	created: function created() {
		if (this.revealId !== undefined) {
			this.$SkyReveal.$on('toggle', this.toggledByTrigger);
		} else if (this.open !== undefined) {
			this.isOpen = this.open;
		} else {
			console.error('SkyReveal must have either "open" or "revealId" attribute!');
		}
	},
	mounted: function mounted() {
		this.revealer = Revealer(
			this.$refs.main,
			this.$refs.inner,
			this.duration,
			this.$SkyReveal
		);

		// If open from start
		if (this.isOpen) {
			this.openRevealer();
		}
	},
	updated: function updated() {
		this.isOpen
			? this.openRevealer()
			: this.closeRevealer();
	},
	methods: {
		openRevealer: function openRevealer() {
			var this$1 = this;

			// Use this.revealed as a safeguard to prevent false triggers
			// when revealer is already open
			if (!this.revealed) {
				this.revealed = true;
				this.animating = true;

				this.$emit('open');
				this.revealer.open()
					.then(function () {
						this$1.animating = false;
						this$1.$emit('open-done');
					});
			}
		},
		closeRevealer: function closeRevealer() {
			var this$1 = this;

			// Use this.revealed as a safeguard to prevent false triggers
			// when revealer is already closed
			if (this.revealed) {
				this.revealed = false;
				this.animating = true;

				this.$emit('close');
				this.revealer.close()
					.then(function () {
						this$1.animating = false;
						this$1.$emit('close-done');
					});
			}
		},
		toggledByTrigger: function toggledByTrigger(data) {
			if (this.revealId === data.id) {
				this.isOpen = data.isOpen;
			}
		},
	},
};

/* script */
            var __vue_script__ = script;
/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"main",class:['sky-reveal', {
		closed: !_vm.isOpen,
		animating: _vm.animating,
	}],staticStyle:{"height":"0px"},attrs:{"aria-expanded":_vm.ariaExpanded}},[_vm._ssrNode("<div class=\"inner\">","</div>",[_c('transition',{attrs:{"name":"sky-reveal-anim","duration":500}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isOpen),expression:"isOpen"}]},[_vm._t("default")],2)])],1)])};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = "data-v-4cdb19c0";
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* component normalizer */
  function __vue_normalize__(
    template, style, script$$1,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    var component = (typeof script$$1 === 'function' ? script$$1.options : script$$1) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "SkyReveal.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) { component.functional = true; }
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
	data: function data() {
		return {
			isOpen: false,
		};
	},
	created: function created() {
		this.$SkyReveal.register({ id: this.revealId, isOpen: this.isOpen });
	},
	beforeDestroy: function beforeDestroy() {
		this.$SkyReveal.unregister(this.revealId);
	},
	methods: {
		toggle: function toggle() {
			this.isOpen = !this.isOpen;

			this.$SkyReveal.$emit('toggle', { id: this.revealId, isOpen: this.isOpen });
		},
	},
};

/* script */
            var __vue_script__$1 = script$1;
            
/* template */
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('button',{class:['sky-reveal-trigger', {open: _vm.isOpen}],on:{"click":_vm.toggle}},[_vm._t("svg"),_vm._ssrNode(" "),_vm._t("svg-prepend"),_vm._ssrNode(" "),(!_vm.isOpen)?_vm._t("open"):_vm._t("closed"),_vm._ssrNode(" "),_vm._t("svg-append")],2)};
var __vue_staticRenderFns__$1 = [];

  /* style */
  var __vue_inject_styles__$1 = undefined;
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = "data-v-1314b02f";
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* component normalizer */
  function __vue_normalize__$1(
    template, style, script,
    scope, functional, moduleIdentifier,
    createInjector, createInjectorSSR
  ) {
    var component = (typeof script === 'function' ? script.options : script) || {};

    // For security concerns, we use only base name in production mode.
    component.__file = "SkyRevealTrigger.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;

      if (functional) { component.functional = true; }
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
	var instance = new Vue({
		data: function data() {
			return {
				states: {},
			};
		},
		created: function created() {
			var this$1 = this;

			this.$on('toggle', function (ref) {
				var id = ref.id;
				var isOpen = ref.isOpen;

				this$1.states[id] === undefined
					? console.warn(("[SkyReveal] The following id is not registred: " + id))
					: this$1.states[id] = isOpen;
			});
			this.$on('heightChanged', function () {
				this$1.$emit('updated');
			});
		},
		methods: {
			register: function register(ref) {
				var id = ref.id;
				var isOpen = ref.isOpen;

				this.$set(this.states, id, isOpen);
			},
			unregister: function unregister(id) {
				this.$delete(this.states, id);
			},
			getState: function getState(key) {
				return this.states[key];
			},
		},
	});

	Vue.util.defineReactive(Vue.prototype, '$SkyReveal', instance);
}

var defaults = {
	registerComponents: true,
};

function install(Vue, options) {
	var ref = Object.assign({}, defaults, options);
	var registerComponents = ref.registerComponents;

	Vue.use(SkyRevealStore);

	if (registerComponents) {
		// Main component
		Vue.component(SkyReveal.name, SkyReveal);

		// Sub component(s)
		Vue.component(SkyRevealTrigger.name, SkyRevealTrigger);
	}
}

exports.SkyReveal = SkyReveal;
exports.SkyRevealTrigger = SkyRevealTrigger;
exports.SkyRevealStore = SkyRevealStore;
exports.default = install;
