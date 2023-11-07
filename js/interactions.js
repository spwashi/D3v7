function initZoomBehavior() {
	return d3
		.zoom()
		.on('zoom', function (e, d) {
			d.r *= e.transform.k;
		});
}
