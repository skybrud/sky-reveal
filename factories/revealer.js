import anime from 'animejs';

export default (target) => {
	const duration = 500;
	let isOpen = false;
	const collapsed = window.getComputedStyle(target).minHeight || 0;
	let autoHeight = target.getBoundingClientRect().height;

	target.style.height = collapsed;

	const anim = anime({
		targets: target,
		height: [collapsed, autoHeight],
		begin: (self) => {
			autoHeight = target.getBoundingClientRect().height;
			target.style.height = self.reversed ? autoHeight : collapsed;
		},
		complete: (self) => {
			target.style.height = self.reversed ? collapsed : 'auto';
		},
		autoplay: false,
		duration,
		easing: 'easeInOutCubic',
	});

	const open = (toggled = false) => {
		anim.pause();

		if (anim.reversed) {
			anim.reverse();
		}

		anim.play();

		if (toggled) {
			isOpen = true;
		}
	};

	const close = (toggled = false) => {
		anim.pause();

		if (!anim.reversed) {
			anim.reverse();
		}

		anim.play();

		if (toggled) {
			isOpen = false;
		}
	};

	const toggle = () => {
		if (isOpen) {
			close(true);
		} else {
			open(true);
		}

		isOpen = !isOpen;
	};

	return {
		open,
		close,
		toggle,
	};
};
