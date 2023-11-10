window.spwashi.linksManager = {
	init:
		function makeStarterLinks(linkContainer, nodes) {
			const LINK_STRENGTH = window.spwashi.parameters.links.strength;

			const links = linkContainer;
			let prev;

			for (let node of nodes) {
				const {head, body, tail} = node;
				let items = [head, body, tail].flat().map(i => i?.identity).filter(Boolean);
				items.forEach(item => {
					const source = (typeof item === "string" ? item : item.identity);
					const sourceNode = window.spwashi.getNode(source);
					if (!sourceNode) {
						return;
					}
					const target = node.id;
					links.push({source, target, strength: LINK_STRENGTH})
				})
			}

			for (let node of nodes) {
				prev?.id && links.push({
					source: prev?.id,
					target: node.id,
					strength: LINK_STRENGTH * .3
				});	
				prev = node;
			}

			return links;
		},
	update: 
		function updateLinks(links) {
			const u = d3.select('.links')
				.selectAll('line')
				.data(links)
				.join('line')
				.attr('stroke-width', d => (d.strength || 1) * 1)
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
