function resolveSimulationInput(timeout = 100) {
	let resolve = () => {}, reject = () => {};

	const data = 
		[
			{
				fx: 100,
				fy: 100,
			}
		];
	
	setTimeout(() => {
		const input = document.querySelector('#nodes-input')?.value;
		if (!input) {
			window.spwashi.setItem('parameters.nodes-input', null);
			return reject();
		}
		const mapFnInput = document.querySelector('#nodes-selector-fn');
		const mapFnString = mapFnInput?.value || 'd=>d.nodes';
		const mapFn = eval(mapFnString);
		const parsed = JSON.parse(input);
		window.spwashi.setItem('parameters.nodes-input', parsed);
		window.spwashi.setItem('parameters.nodes-input-map-fn-string', mapFnString);
		resolve(mapFn(parsed));
	}, timeout);

	return new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	})
}
