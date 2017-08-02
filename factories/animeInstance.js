import anime from 'animejs';

export default function (target, collapsed, autoHeight) {
	const duration = 500;

	return anime({
		targets: target,
		height: [collapsed, autoHeight],
		begin: (self) => {
			target.style.height = self.reversed ? autoHeight : collapsed;
		},
		complete: (self) => {
			target.style.height = self.reversed ? collapsed : 'auto';
		},
		autoplay: false,
		duration,
		easing: 'easeInOutCubic',
	});
}
