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
}
{
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

	const parametersElement = document.getElementById('parameters');
	for (let key in items) {
		let label = document.createElement('LABEL');
		let span = document.createElement('SPAN');
		span.innerText = key;
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

	const rewriteButton = document.querySelector('#controls .read-parameters');
	rewriteButton.onclick = () => {
		rewriteParameters();
		const params = window.spwashi.parameters;
		const paramsString = JSON.stringify(params);
		window.localStorage.setItem(window.spwashi.parameterKey, paramsString)
		alert(paramsString);
	}
}
