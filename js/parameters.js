window.spwashi = window.spwashi || {};
window.spwashi.parameters = window.spwashi.parameters || {};
window.spwashi.readParameters = 
	(searchParameters) => {
		[...searchParameters.entries()].forEach(([key,value]) => (document.querySelector('input[name='+key+']')||{}).value=value)
		window.spwashi.version = searchParameters.get('version');
		window.spwashi.parameterKey = `simulation.parameters#${window.spwashi.version}`;

		let fromLocalStorage = window.localStorage.getItem(window.spwashi.parameterKey);
		if (fromLocalStorage) {
			fromLocalStorage = JSON.parse(fromLocalStorage);
			window.spwashi.parameters = fromLocalStorage;
		}
		if (searchParameters.has('wordsonly')) {
			document.body.classList.add('wordsonly')
		}
		if (searchParameters.has('reset')) {
			window.localStorage.clear();
		}
		if (searchParameters.has('ncount')) {
			window.spwashi.parameters.nodes = window.spwashi.parameters.nodes || {};
			window.spwashi.parameters.nodes.count = +searchParameters.get('ncount');
		}
		window.spwashi.parameters.links = window.spwashi.parameters.links || {};
		if (searchParameters.has('linkstrength')) {
			window.spwashi.parameters.links.strength = +searchParameters.get('linkstrength');
		}
		window.spwashi.parameters.forces = window.spwashi.parameters.forces || {};
		if (searchParameters.has('charge')) {
			window.spwashi.parameters.forces.charge = +searchParameters.get('charge');
		}
		if (searchParameters.has('linkprev')) {
			window.spwashi.parameters.links.linkPrev = +searchParameters.get('linkprev');
		} else {
			window.spwashi.parameters.links.linkPrev = 0;	
		}
		if (searchParameters.has('width')) {
			window.spwashi.parameters.width = +searchParameters.get('width');
		}
		if (searchParameters.has('height')) {
			window.spwashi.parameters.height = +searchParameters.get('height');
		}
		if (searchParameters.has('center')) {
			let [x, y] = (searchParameters.get('center').split(',').map(n => +n));
			window.spwashi.parameters.forces.centerPos = {x, y};
		}
		if (searchParameters.has('mode')) {
			switch (searchParameters.get('mode')) {
				case 'spw':
					document.body.classList.add('spw-mode');
					break;
				case 'direct':
					document.body.classList.add('direct-mode');
					break;
				case 'node':
					document.body.classList.add('node-mode');
					break;
			}
		}

		window.spwashi.values = window.spwashi.values || {};
		if (searchParameters.has('fx')) {
			window.spwashi.values.fx = searchParameters.get('fx').split(',').map(n => +n);
		}
		window.spwashi.values.fy = [];
		if (searchParameters.has('fy')) {
			window.spwashi.values.fy = searchParameters.get('fy').split(',').map(n => +n);
		}
		window.spwashi.values.r = [];
		if (searchParameters.has('r')) {
			window.spwashi.values.r = searchParameters.get('r').split(',').map(n => +n);
		}
		window.spwashi.values.text = window.spwashi.values.text || {}
		window.spwashi.values.text.fontSize = window.spwashi.values.text.fontSize || [];
		if (searchParameters.has('fontSize')) {
			window.spwashi.values.text.fontSize = searchParameters.get('fontSize').split(',').map(n => +n);
		}

		window.spwashi.doFetchNodes = searchParameters.get('dofetch') === '1'
		window.spwashi.superpower = window.spwashi.superpower || {};
		window.spwashi.superpower.name = searchParameters.get('superpower');
		window.spwashi.superpower.weight = parseInt(searchParameters.get('weight') || 1);
	
		initializeParameterContainers();
		initializeQueryParametersQuickChange();
		initializeNodeMapAndFilter();
		initializeSpwParseField();
	}

const getItemKey = key => window.spwashi.parameterKey + '@' + key;
window.spwashi.setItem = (key, item, category = null) => { 
	window.localStorage.setItem(getItemKey(key), JSON.stringify(item || null)); 
}
window.spwashi.getItem = (key, category = null) => {
	const out = window.localStorage.getItem(getItemKey(key))
	if (out) return JSON.parse(out || '{}')
	return undefined;
}
const getNodeKey = node => window.spwashi.parameterKey + '@node.id[' + node.id + ']';
const pw = window.innerWidth * .9;
const ph = window.innerHeight * .9;

window.spwashi.parameters.width = window.spwashi.parameters.width || pw;
window.spwashi.parameters.height = window.spwashi.parameters.height || ph;
window.spwashi.parameters.startPos = window.spwashi.parameters.startPos || {};
window.spwashi.parameters.startPos.x = window.spwashi.parameters.startPos.x || window.spwashi.parameters.width / 2;
window.spwashi.parameters.startPos.y = window.spwashi.parameters.startPos.y || window.spwashi.parameters.height / 2;
window.spwashi.parameters.links = window.spwashi.parameters.links || {};
window.spwashi.parameters.links.strength = window.spwashi.parameters.links.strength || .1;
window.spwashi.parameters.nodes = window.spwashi.parameters.nodes || {};
window.spwashi.parameters.nodes.count = window.spwashi.parameters.nodes.count || 13;
window.spwashi.parameters.nodes.radiusMultiplier = window.spwashi.parameters.nodes.radiusMultiplier || 30;
window.spwashi.parameters.forces = window.spwashi.parameters.forces || {};
window.spwashi.parameters.forces.charge = window.spwashi.parameters.forces.charge || -100;
window.spwashi.parameters.forces.center = window.spwashi.parameters.forces.center || 1;
window.spwashi.parameters.forces.centerPos = window.spwashi.parameters.forces.centerPos || {};
window.spwashi.parameters.forces.centerPos.x = window.spwashi.parameters.forces.centerPos.x || window.spwashi.parameters.startPos.x;
window.spwashi.parameters.forces.centerPos.y = window.spwashi.parameters.forces.centerPos.y || window.spwashi.parameters.startPos.y;