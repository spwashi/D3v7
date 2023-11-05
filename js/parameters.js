let width 		= window.innerWidth * .75;
let height 		= window.innerHeight * .75;
let X_START_POS 	= -500;
let Y_START_POS 	= -1800;
let NODE_COUNT 		= 130;
let NODE_RADIUS_MULT  	= 3;
let CHARGE_STRENGTH 	= -1;
let CENTER_STRENGTH 	= 1;
let CENTER_POS 		= [width/2, height/2];

window.spwashi = window.spwashi || {};
window.spwashi.parameters = 
	{
		width,
		height,
		startPos: {
			x: X_START_POS,
			y: Y_START_POS,
		},
		nodes: {
			count:
				NODE_COUNT,
			radiusMultiplier:
				NODE_RADIUS_MULT,
		},
		forces: {
			charge: CHARGE_STRENGTH,
			centerPos: {
				x: width/2,
				y: width/2,
			}
		},
	};

let fromLocalStorage = window.localStorage.getItem('simulation.parameters#1');
if (fromLocalStorage) {
	fromLocalStorage = JSON.parse(fromLocalStorage);
	window.spwashi.parameters = fromLocalStorage;
}
