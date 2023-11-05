window.spwashi = window.spwashi || {};
window.spwashi.parameterKey = 'simulation.parameters#3';
const pw = window.innerWidth * .75;
const ph = window.innerHeight * .75;
window.spwashi.parameters = 
	{
		width: pw,
		height: ph,
		startPos: {
			x: pw / 2,
			y: ph / 2,
		},
		links: {
			strength: .1
		},
		nodes: {
			count: 13,
			radiusMultiplier: 3,
		},
		forces: {
			charge: -100,
			center: 1,
			centerPos: {
				x: window.innerWidth * .75 / 2,
				y: window.innerHeight * .75 / 2,
			}
		},
	};

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
