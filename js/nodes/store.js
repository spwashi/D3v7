const saveNodePosition = node => {
	window.localStorage.setItem(getNodeKey(node), JSON.stringify(node));
	console.log('saved', node);
}
const readNodePosition = node => {
	const fromLocalStorage = window.localStorage.getItem(getNodeKey(node));

	if (fromLocalStorage) return JSON.parse(fromLocalStorage);

	return {}
}
