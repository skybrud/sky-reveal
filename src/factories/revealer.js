import heightSummation from './heightCalculator';
import animeInstance from './animeInstance';

export default (target, innerTarget, duration) => {
	const isBrowser = typeof window !== 'undefined';
	const collapsed = (isBrowser && window.getComputedStyle(target).minHeight) || 0;
	let anim = animeInstance(target, collapsed, heightSummation(target, innerTarget), duration);

	const reInstantiate = () => {
		anim = animeInstance(target, collapsed, heightSummation(target, innerTarget), duration);
	};

	const open = () => new Promise((resolve) => {
		if (anim.reversed) {
			if (anim.animations[0].tweens[0].value[1] !== heightSummation(target, innerTarget)) {
				reInstantiate();
			}
			anim.play()
				.then(resolve);
		} else {
			resolve();
		}
	});

	const close = () => new Promise((resolve) => {
		if (!anim.reversed) {
			anim.play()
				.then(resolve);
		} else {
			resolve();
		}
	});

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
