import SkyWindow from 'sky-window';
import heightSummation from './heightCalculator';
import animeInstance from './animeInstance';

export default (target) => {
	const innerTarget = target.querySelector('.inner');
	const collapsed = window.getComputedStyle(target).minHeight || 0;
	let autoHeight = heightSummation(target, innerTarget);

	let anim = animeInstance(target, collapsed, autoHeight);

	SkyWindow.resize.subscribe(() => {
		autoHeight = heightSummation(target, innerTarget);
		anim = animeInstance(target, collapsed, autoHeight);
	});

	const open = () => {
		if (anim.reversed) {
			anim.play();
			anim.reverse();
		}
	};

	const close = () => {
		if (!anim.reversed) {
			anim.play();
			anim.reverse();
		}
	};

	const toggle = () => {
		anim.progress > 0
			? close()
			: open();
	};

	return {
		open,
		close,
		toggle,
	};
};
