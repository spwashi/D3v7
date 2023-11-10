{
	const forceSimulation = window.spwashi.simulation;
	if (!forceSimulation) {
		const error = 'no force simulation initialized';
		alert(error)
		throw new Error(error);
	}

	const tickButton = document.querySelector('#controls .tick');
	tickButton.onclick = () => {
		window.spwashi.tick();
	};

	const startButton = document.querySelector('#controls .start');
	startButton.onclick = () => {
		forceSimulation.restart();
	};

	const stopButton = document.querySelector('#controls .stop');
	stopButton.onclick = () => {
		forceSimulation.stop();
	};
	
	const reinitButton = document.querySelector('#controls .reinit');
	reinitButton.onclick = () => {
		window.spwashi.reinit();
	};

	const clearFixedButton = document.querySelector('#controls .clear-fixed-positions');
	clearFixedButton.onclick = () => {
		window.spwashi.nodes.forEach(node => {
			node.fx = undefined;
			node.fy = undefined;
		});
	}

}
{
	const parameterNames = {
		'links-strength': 'Default Link Strength',
		'nodes-count': 'Number Of Nodes',
		'nodes-radius-muliplier': 'Radius Multiplier',
		'forces-charge': 'Charge Force',
		'forces-center': 'Centering Strength',
		'forces-centerPos-x': 'center (x)',
		'forces-centerPos-y': 'center (y)',
	};
	let items = {};
	function traverse(item, prefix = 'window-spwashi-parameters') {
		if (typeof item === "number") return item;
		if (typeof item !== "object") throw new Error("only numbers or objects are currently configured");
		for (let key in item) {
			const value = item[key];
			const valuekey = prefix + '-' + key;
			const realValue = traverse(value, valuekey);
			items[valuekey] = realValue;
		}
		return undefined;
	}

	traverse(window.spwashi.parameters);
	Object.keys(items).forEach(key => items[key] === undefined && delete items[key]);

	const parametersElement = document.querySelector('#parameters .input-container');
	for (let key in items) {
		let label = document.createElement('LABEL');
		let span = document.createElement('SPAN');
		const parameterKey = key.replace('window-spwashi-parameters-', '');
		span.innerText = parameterNames[parameterKey] || parameterKey.split('-').join(' ');
		let input = document.createElement('INPUT');
		input.id = key;
		input.value = items[key];
		input.type = 'number';
		label.appendChild(span);
		label.appendChild(input)
		parametersElement.appendChild(label);
		
	}

	function rewriteParameters() {
		const children = parametersElement.querySelectorAll('input');
		const elements = Object.fromEntries([...children].map(el => [el.id, el.value]));
		const obj = {};
		for (let key in elements) {
			eval(key.replaceAll('-', '.')+ ' = ' + elements[key]);
		}
		console.log(window.spwashi.parameters, 'update');
	}

	const doParameterRefresh = () => {
		rewriteParameters();
		const params = window.spwashi.parameters;
		const paramsString = JSON.stringify(params);
		window.localStorage.setItem(window.spwashi.parameterKey, paramsString);
		window.spwashi.reinit();
	}
	const parameterButton = document.querySelector('#parameters button.go');
	parameterButton.onclick = doParameterRefresh;

	window.spwashi.refreshNodeInputs = 
		(nodes) => {
			document.querySelector('#nodes-selector-fn').value = (window.spwashi.getItem('parameters.nodes-input-map-fn-string') || 'data => data.nodes');
			const nodesInput = document.querySelector('#nodes-input');
			nodesInput.value = JSON.stringify(window.spwashi.getItem('parameters.nodes-input') || {nodes:[{r:30}]}, null, 2);
			nodesInput.rows  = 5;
		};
	window.spwashi.refreshNodeInputs();
	window.spwashi.readNodeInputs = () => {
		const input = document.querySelector('#nodes-input')?.value;
		if (!input) {
			window.spwashi.setItem('parameters.nodes-input', null);
			return reject();
		}
		const mapFnInput = document.querySelector('#nodes-selector-fn');
		const mapFnString = mapFnInput?.value || 'd=>d.nodes';
		console.log({input, mapFnString});
		const mapFn = eval(mapFnString);
		const parsed = JSON.parse(input);
		const nodes = mapFn(parsed);
		console.log(nodes);
		return nodes;
	}
	
	window.spwashi.nodes.push(...window.spwashi.readNodeInputs());
	window.spwashi.reinit();
	const _readNodeInputs = (append = true) => {
		const nodes = window.spwashi.readNodeInputs();
		if (!append) {
			window.spwashi.nodes.length = 0;
			window.spwashi.reinit();
		}
		window.spwashi.nodes.push(...nodes);
		window.spwashi.reinit();
	}

	document.querySelector('#controls button.read-nodes').onclick = () => _readNodeInputs(true);
	document.querySelector('#node-input-container button.add').onclick = () => _readNodeInputs(true);
	document.querySelector('#node-input-container button.replace').onclick = () => _readNodeInputs(false);

	document.querySelector('#controls button.save-nodes').onclick = 
		() => {
			const nodes = window.spwashi.nodes;
			nodes.map(window.spwashi.nodesManager.saveNode)
			window.spwashi.setItem('parameters.nodes-input', {nodes});
			window.spwashi.setItem('parameters.nodes-input-map-fn-string', 'data => data.nodes');
			window.spwashi.refreshNodeInputs();
		}
	document.querySelector('#controls button.clear-saved-nodes').onclick =
		() => {
			const nodes = window.spwashi.nodes;
			nodes.map(node => {
				const id = node.id;
				for(let prop in node) {
					delete node[prop];
				}
				node.id = id;
				window.spwashi.nodesManager.saveNode(node);
			});
			nodes.length = 0;
			window.spwashi.reinit();
		}
}
{
	const element = document.querySelector('#query-parameters .value');
	const text = [...new URLSearchParams(window.location.search)].map(entry => entry.join('=')).join('\n');
	element.innerHTML = text;
	element.rows = text.split('\n').length + 1;
	const button = document.querySelector('#query-parameters button.go');
	button.onclick = (e) => {
		const searchParams = new URLSearchParams(element.value.split('\n').map(line => line.split('=')))
		window.spwashi.readParameters(searchParams);
		if(e.shiftKey) {
			window.location = '?' + searchParams;
		}
	}
}
