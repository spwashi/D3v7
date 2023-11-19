function makeText(text) {
	text
		.attr('x', d => d.x)
		.attr('font-size', d => d.text.fontSize || d.r)
		.call(d3.drag()
			.on('start', (e, d) => {
				d.text.fx = d.text.fx || 0;
				d.text.fy = d.text.fy || 0;
			})
			.on('drag', (e, d) => {
				d.text.fx += e.dx;
				d.text.fy += e.dy;
			})
			.on('end', (e, d) => {

			}))

	text.selectAll('tspan')
		.data(d => getNodeText(d).split('\n').map((line, i) => ({node:d, i: i, text: line}))) 
		.join(
			enter => enter
					.append('tspan')
					.attr('text-anchor', 'start') 
					.attr('dy', d => d.node.r) .attr('dx', 0) ,
			update => 
				update
					.selectAll('tspan')
					.text(d => d.text)
			,
			d =>d.selectAll('tspan').remove()
		)
		;
	return text;
}

function updateNodeTextSvg(text) {
return text
	.attr('x', d => (d.x || 0) + (d.text.fx || 0))
	.attr('y', d => (d.y || 0) + (d.text.fy || 0) - (getNodeText(d).split('\n').length * d.r)/2)
	.attr('font-size', d => d.text.fontSize || d.r)
	.selectAll('tspan')
	.data(d => getNodeText(d).split('\n').map((line, i) => ({node:d, i: i, text: line}))) 
	.text(d => (d.text))
	.attr('x', d => (d.node.x || 0) + (d.node.text.fx || 0))
	;

}
