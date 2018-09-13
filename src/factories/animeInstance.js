import anime from 'animejs';

export default function (target, collapsed, autoHeight, duration, storeRef) {
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
