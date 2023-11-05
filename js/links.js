const linksManager = {
	init:
		function makeStarterLinks(nodes) {
			const links = [];
			let prev;
			for (let node of nodes) {
				links.push({
					source: prev?.name || 0,
					target: node.name,
					strength: 1
				});	
				prev = node;
			}

			return links;
		},
	update: 
		function updateLinks() {
			const u = d3.select('.links')
				.selectAll('line')
				.data(links)
				.join('line')
				.attr('stroke-width', d => (d.strength || 1) * 10)
				.attr('x1', function(d) {
					return d.source.x
				})
				.attr('y1', function(d) {
					return d.source.y
				})
				.attr('x2', function(d) {
					return d.target.x
				})
				.attr('y2', function(d) {
					return d.target.y
				});
		}
}
