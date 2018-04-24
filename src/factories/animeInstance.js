import anime from 'animejs';
import SkyScroll from 'sky-scroll';

export default function (target, collapsed, autoHeight) {
	const duration = 500;

	return anime({
		targets: target,
		height: [collapsed, autoHeight],
		direction: 'reverse',
		complete: (self) => {
			if (!self.reversed) {
				target.removeAttribute('style');
			}

			SkyScroll.recalculate();

			self.began = false;
			self.completed = false;
		},
		autoplay: false,
		duration,
		easing: 'easeInOutCubic',
	});
}
