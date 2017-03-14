import { TweenLite, Cubic } from 'gsap';

function openAnim(el) {
	const minHeight = window.getComputedStyle(el).minHeight;

	TweenLite.set(el, {
		height: 'auto',
		immediateRender: true,
	});

	TweenLite.from(el, 0.5, {
		height: minHeight,
		ease: Cubic.easeInOut,
		onComplete() {
			TweenLite.set(el, {
				clearProps: 'height',
			});
		},
	});
}

function closeAnim(el) {
	const minHeight = window.getComputedStyle(el).minHeight;

	TweenLite.to(el, 0.5, {
		height: minHeight,
		ease: Cubic.easeOut,
	});
}

export default {
	name: 'sky-reveal',
	inserted(el) {
		/** Sets the initial height of the element */
		const minHeight = window.getComputedStyle(el).minHeight;
		const startHeight = el.classList.value.indexOf('closed') !== -1 ? minHeight : 'auto';

		TweenLite.set(el, {
			height: startHeight,
			immediateRender: true,
		});
	},
	update(el, binding) {
		/** Avoid unnessesary update run */
		if (binding.value !== binding.oldValue) {
			if (binding.value) {
				openAnim(el);
			} else {
				closeAnim(el);
			}
		}
	},
};
