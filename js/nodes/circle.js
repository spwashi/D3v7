function makeCircle(g) {
	return g
		.append('circle')
		.attr('fill', getNodeColor)
		.attr('r', d => (d.r || 1))
		.attr('cx', d => d.x || 0)
		.attr('cy', d => d.y || 0)
		.call(
			d3
				.drag()
				.on('start', (e, node) => {
					node.x = e.x;
					node.y = e.y;
				})
				.on('drag', (e, node) => {
					node.fx = e.x;
					node.fy = e.y;
				})
				.on('end', (e, node) => {
					window.spwashi.tick();
					saveNodePosition(node);
				})
		)
		.call(d3.zoom().on('zoom', (e, d) => {
			console.log('scroll', d.name , d.id);
			// d.r = Math.min(d.r * e.transform.k, 50); 
		}))
		.on('click', (e, d) => {
			if (event.defaultPrevented) return;
			let weight = window.spwashi.superpower.weight;
			if(e.shiftKey) {
				weight *= -1;
			}
			switch (window.spwashi.superpower.name) {
				case 'grow': {
					d.r += weight;
					break;
				}
				case 'shrink': {
					d.r -= weight;
					break;
				}
				case 'changecolor': {
					if (isNaN(d.colorindex)) d.colorindex = 1;
					d.colorindex += weight;
					break;
				}
				case 'z': {
					d.z = d.z || 0;
					d.z += weight;
					sortNodes(ACTIVE_NODES);
					break;
				}
			}
			saveNodePosition(d);
		});
}

