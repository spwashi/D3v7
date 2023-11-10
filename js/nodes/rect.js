function makeRect(g) {
	return g
		.append('rect')
		.attr('width', d => 2 * d.r)
		.attr('height', d => 2 * d.r)
}
