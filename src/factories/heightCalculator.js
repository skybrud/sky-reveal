export default function (element, innerElement) {
	const isBrowser = typeof window !== 'undefined';

	const firstChild = innerElement.querySelector(':first-child');
	const lastChild = innerElement.querySelector(':last-child');
	const innerStyles = isBrowser && window.getComputedStyle(innerElement);
	const targetStyles = isBrowser && window.getComputedStyle(element);

	let firstChildStyles = null;
	let lastChildStyles = null;

	if (firstChild) {
		firstChildStyles = isBrowser && window.getComputedStyle(firstChild);
	}

	if (lastChild) {
		lastChildStyles = isBrowser && window.getComputedStyle(lastChild);
	}

	let returnValue = 0;

	if (isBrowser) {
		returnValue += Number(targetStyles.paddingTop.replace('px', ''));
		returnValue += Number(targetStyles.paddingBottom.replace('px', ''));

		returnValue += Number(innerStyles.marginTop.replace('px', ''));
		returnValue += Number(innerStyles.marginBottom.replace('px', ''));
		returnValue += Number(innerStyles.height.replace('px', ''));

		if (firstChild) {
			returnValue += Number(firstChildStyles.marginTop.replace('px', ''));
		}
		if (lastChild) {
			returnValue += Number(lastChildStyles.marginBottom.replace('px', ''));
		}
	}

	return returnValue;
}
