window.spwashi = window.spwashi || {};


window.spwashi.readParameters = 
	(searchParameters) => {
		[...searchParameters.entries()].forEach(([key,value]) => (document.querySelector('input[name='+key+']')||{}).value=value)
		window.spwashi.version = searchParameters.get('version');
		if (searchParameters.has('reset')) {
			window.localStorage.clear();
		}
		window.spwashi.doFetchNodes = searchParameters.get('dofetch') === '1'
		window.spwashi.superpower = {};
		window.spwashi.superpower.name = searchParameters.get('superpower');
		window.spwashi.superpower.weight = parseInt(searchParameters.get('weight') || 1);
		window.spwashi.parameterKey = `simulation.parameters#${window.spwashi.version}`;
	}
window.spwashi.setItem =
	(key, item, category = null) => {
		window.localStorage.setItem(window.spwashi.parameterKey + '@' + key, JSON.stringify(item || null));
	}
window.spwashi.getItem =
	(key, category = null) => {
		const out = window.localStorage.getItem(window.spwashi.parameterKey + '@' + key)
		if (out) return JSON.parse(out || '{}')
		return undefined;
	}

window.spwashi.readParameters(new URLSearchParams(window.location.search));
const getNodeKey = node => window.spwashi.parameterKey + '@node.id[' + node.id + ']';
const pw = window.innerWidth * .75;
const ph = window.innerHeight * .75;


window.spwashi.parameters = {};
window.spwashi.parameters.width = Math.min(pw, 1000);
window.spwashi.parameters.height = Math.min(ph, 1000);
window.spwashi.parameters.startPos = {};
window.spwashi.parameters.startPos.x = window.spwashi.parameters.width / 2;
window.spwashi.parameters.startPos.y = window.spwashi.parameters.height / 2;
window.spwashi.parameters.links = {};
window.spwashi.parameters.links.strength = .1;
window.spwashi.parameters.nodes = {};
window.spwashi.parameters.nodes.count = 13;
window.spwashi.parameters.nodes.radiusMultiplier = 3;
window.spwashi.parameters.forces = {};
window.spwashi.parameters.forces.charge = -100;
window.spwashi.parameters.forces.center = 1;
window.spwashi.parameters.forces.centerPos = {};
window.spwashi.parameters.forces.centerPos.x = window.spwashi.parameters.startPos.x;
window.spwashi.parameters.forces.centerPos.y = window.spwashi.parameters.startPos.y;



let fromLocalStorage = window.localStorage.getItem(window.spwashi.parameterKey);
if (fromLocalStorage) {
	fromLocalStorage = JSON.parse(fromLocalStorage);
	window.spwashi.parameters = fromLocalStorage;
}


let width 		= window.spwashi.parameters.width;
let height 		= window.spwashi.parameters.height;
let X_START_POS 	= window.spwashi.parameters.startPos.x;
let Y_START_POS 	= window.spwashi.parameters.startPos.y;
let NODE_COUNT 		= window.spwashi.parameters.nodes.count;
let NODE_RADIUS_MULT  	= window.spwashi.parameters.nodes.radiusMultiplier;
let CHARGE_STRENGTH 	= window.spwashi.parameters.forces.charge;
let CENTER_STRENGTH 	= window.spwashi.parameters.forces.center;
let CENTER_POS 		= [
	window.spwashi.parameters.forces.centerPos.x,
	window.spwashi.parameters.forces.centerPos.y,
];
let LINK_STRENGTH 	= window.spwashi.parameters.links.strength;
