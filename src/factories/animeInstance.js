import anime from 'animejs';
import SkyRevealStore from '../SkyRevealStore';

export default function (target, collapsed, autoHeight, duration) {
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
