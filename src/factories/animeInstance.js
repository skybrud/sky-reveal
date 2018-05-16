import anime from 'animejs';
import SkyRevealStore from '../SkyRevealStore.js';

export default function (target, collapsed, autoHeight, duration) {
	return anime({
		targets: target,
		height: [collapsed, autoHeight],
		direction: 'reverse',
		complete: (self) => {
			if (!self.reversed) {
				target.removeAttribute('style');
			}

			SkyRevealStore.$emit('heightChanged');

			self.began = false;
			self.completed = false;
		},
		autoplay: false,
		duration,
		easing: 'easeInOutCubic',
	});
}
