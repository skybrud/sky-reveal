<script>
import skyRevealDirective from './sky-reveal.directive';

export default {
	name: 'sky-reveal',
	directives: {
		'sky-reveal': skyRevealDirective,
	},
	props: {
		button: Object,
		externalId: [String, Number],
		openReveal: {
			type: Boolean,
			default: undefined,
		},
	},
	data() {
		return {
			/* if openReveal is not set it will be defaulted to false */
			open: this.openReveal !== undefined ? this.openReveal : false,
			ariaId: this.externalId || Math.random().toString(35).substr(2, 5),
		};
	},
	computed: {
		ariaExpanded() {
			/**
			 * Needs to stringify ariaExpanded bool to avoid ariaExpanded
			 * being removed by VueJs
			 **/
			return `${this.open}`;
		},
		buttonLabel() {
			return this.open ? this.button.hide : this.button.show;
		},
		openState() {
			/**
			 * Must use computed value for dynamic property watch
			 * If openReveal is not set, use skyReveals button as statetoggler
			 **/
			return this.openReveal !== undefined ? this.openReveal : this.open;
		},
	},
	methods: {
		toggle() {
			this.open = !this.open;
		},
	},
};
</script>

<style src="./sky-reveal.scss"></style>
<template src="./sky-reveal.html"></template>
