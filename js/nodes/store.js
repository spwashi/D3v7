const saveNodePosition = node => {
	window.spwashi.setItem('nodes', window.spwashi.nodes);
	console.log('saved', node);
}
const readNodePosition = node => {
	const nodes =  window.spwashi.getItem('nodes', window.spwashi.nodes) || [];
	const readNode  = nodes.find(n => n.id === node.id);
	if (readNode) return readNode;
	return {};
}
window.spwashi.clearCachedNodes = () => {
	window.spwashi.setItem('nodes', []);
}