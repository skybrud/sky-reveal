export default function (element, innerElement) {
	const firstChild = innerElement.querySelector(':first-child');
	const lastChild = innerElement.querySelector(':last-child');
	const innerStyles = window.getComputedStyle(innerElement);
	const targetStyles = window.getComputedStyle(element);

	let firstChildStyles = null;
	let lastChildStyles = null;

	if (firstChild) {
		firstChildStyles = window.getComputedStyle(firstChild);
	}

	if (lastChild) {
		lastChildStyles = window.getComputedStyle(lastChild);
	}

	let returnValue = 0;

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

	return returnValue;
}
