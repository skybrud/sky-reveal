import skyWindow from 'sky-window';
import heightSummation from './heightCalculator';
import animeInstance from './animeInstance';

export default (target) => {
	let isOpen = false;
	const innerTarget = target.querySelector('.inner');
	const collapsed = window.getComputedStyle(target).minHeight || 0;
	let autoHeight = heightSummation(target, innerTarget);

	target.style.height = collapsed;

	let anim = animeInstance(target, collapsed, autoHeight);

	skyWindow.resize.subscribe(() => {
		autoHeight = heightSummation(target, innerTarget);
		anim = animeInstance(target, collapsed, autoHeight);
	});

	const open = (toggled = false) => {
		anim.pause();

		if (anim.reversed) {
			anim.direction = 'normal';
		}

		// Have to restart in order to reactivate begin & complete hook
		anim.restart();

		if (toggled) {
			isOpen = true;
		}
	};

	const close = (toggled = false) => {
		anim.pause();

		if (!anim.reversed) {
			anim.direction = 'reverse';
		}

		// Have to restart in order to reactivate begin & complete hook
		anim.restart();

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
