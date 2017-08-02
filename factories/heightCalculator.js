export default function (element, innerElement) {
	const lastChild = innerElement.querySelector(':last-child');
	const firstChild = innerElement.querySelector(':first-child');
	const innerStyles = window.getComputedStyle(innerElement);
	const targetStyles = window.getComputedStyle(element);
	const firstChildStyles = window.getComputedStyle(firstChild);
	const lastChildStyles = window.getComputedStyle(lastChild);

	let returnValue = 0;

	returnValue += Number(targetStyles.paddingTop.replace('px', ''));
	returnValue += Number(targetStyles.paddingBottom.replace('px', ''));

	returnValue += Number(innerStyles.marginTop.replace('px', ''));
	returnValue += Number(innerStyles.marginBottom.replace('px', ''));
	returnValue += Number(innerStyles.height.replace('px', ''));

	returnValue += Number(firstChildStyles.marginTop.replace('px', ''));
	returnValue += Number(lastChildStyles.marginBottom.replace('px', ''));

	return returnValue;
}
