function makeImage(g) {
	const rect = g.append('rect')
	.attr('width', d => {
		return d.image.r || d.r
	})
	.attr('height', d => d.image.r || d.r)
	.attr('x', d => d.x - d.r / 2)

	const image =  g
		.append('image')
		.attr('href', getImageHref)
		.attr('width', d => d.image.r || d.r)
		.attr('preserveAspectRatio', d => 'xMidYMin slice')
		.attr('height', d => d.image.r || d.r)
		.attr('x', d => d.x - d.r / 2)
		.attr('y', d => d.y - d.r / 2)
		.attr('stroke', getNodeStrokeColor)
		.attr('stroke-width', 2)
		.call(d3.drag()
			.on('start', (e, d) => {
				d.image.fx = d.image.fx || d.x;
				d.image.fy = d.image.fy || d.y;
			})
			.on('drag', (e, d) => {
				d.image.offsetX += e.dx;
				d.image.offsetY += e.dy;
			})
			.on('end', (e, d) => {
				saveNodePosition(d)
			})
		)

		.on('click', (e, d) => {
			if (event.defaultPrevented) return;
			let weight = window.spwashi.superpower.weight;
			if(e.shiftKey) {
				weight *= -1;
			}

			switch (window.spwashi.superpower.name) {
				case 'grow': {
					d.image.r = d.image.r || d.r;
					d.image.r += weight;
					break;
				}
				case 'shrink': {
					d.image.r = d.image.r || d.r;
					d.image.r -= weight;
					break;
				}
				case 'changecolor': {
					if (isNaN(d.colorindex)) d.colorindex = 1;
					d.colorindex += weight;
					break;
				}
			}
			saveNodePosition(d);
		});
	return g;
}
