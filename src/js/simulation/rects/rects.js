function update(g, rects) {
  g.select('.rects')
   .selectAll('g.rect')
   .data(rects, d => d.title)
   .join(e => {
           const g = e.append('g')
                      .classed('rect', true);

           const rect = g.append('rect')
                         .attr('width', d => Math.abs(d.width))
                         .attr('height', d => d.height || 5)
                         .attr('x', d => d.x)
                         .attr('y', d => d.y)
                         .attr('fill', d => d.fill || 'teal')
                         .attr('stroke', 'yellow')
                         .attr('stroke-width', 1)
                         .attr('pointer-events', 'all')
                         .on('click', () => {

                         })
           g.append('text')
            .attr('text-anchor', 'start')
            .attr('x', d => 30)
            .attr('y', d => d.y + 15)
            .text(d => d.title)

         },
         u => {
           u
             .selectAll('rect')
             .attr('fill', d => d.fill || 'teal')
             .attr('width', d => Math.abs(d.width || 0))
             .attr('height', d => Math.abs(d.height || 0))
             .attr('y', d => d.y)
             .attr('x', d => d.x);
           u.selectAll('text')
            .text(d => d.title)
         })

}

export const RECT_MANAGER = {
  initRects:   rects => rects,
  updateRects: update
};