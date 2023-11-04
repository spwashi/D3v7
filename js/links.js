const linksManager = {
	init:
		function makeStarterLinks(nodes) {
			const links = [];
			for (let node of nodes) {
				links.push({source: 0, target: node.name});	
			}

			return links;
		},
	update: 
		function updateLinks() {
			const u = d3.select('.links')
				.selectAll('line')
				.data(links)
				.join('line')
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
