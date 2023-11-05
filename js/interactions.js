function initDragBehavior() {
	const drag = d3.drag()
				.on('start', dragStarted)
				.on('drag', dragging)
				.on('end', dragEnded)
	;

	function dragStarted(e, node) {
		node.x = e.x;
		node.y = e.y;
	}
	function dragging(e, node){
		node.fx = e.x;
		node.fy = e.y;
	}
	function dragEnded(e, node){
		window.spwashi.tick();
		// node.fx = undefined;
		// node.fy = undefined;
	}

	return drag;
}
function initZoomBehavior() {
	return d3
		.zoom()
		.on('zoom', function (e, d) {
			d.r *= e.transform.k;
		});
}
