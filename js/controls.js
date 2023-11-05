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
