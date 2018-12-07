export const colorLegend = (selection, props) => {
  const { 
    colorScale, 
    circleRadius, 
    spacing, 
    textOffset, 
    backgroundRectWidth, 
    onClick, 
    selectedColorValue 
  } = props;

  const backgroundRect = selection.selectAll('rect')
    .data([null])

  const n = colorScale.domain().length;
    
  backgroundRect.enter()
    .append('rect')
    .merge(backgroundRect)
      .attr('x', -circleRadius * 2)
      .attr('y', -circleRadius * 2)
      .attr('rx', circleRadius * 2)
      .attr('width', backgroundRectWidth)
      .attr('height', spacing * n + circleRadius * 2)
      .attr('fill', 'white')
      .attr('opacity', 0.5);


  const groups = selection.selectAll('g')
      .data(colorScale.domain());
  
  const groupsEnter = groups.enter().append('g').attr('class', 'tick');

  groupsEnter
  .merge(groups)
    .attr('transform', (d, i) => 
      `translate(0, ${i * spacing})`
    )
    .attr('opacity', d => (!selectedColorValue || d === selectedColorValue) ? 1 : 0.2)  // if there is no selectedColorValue (like at the start), then every color should be highlighted, this logc ensures it)
    .on('click', d => onClick(
      d === selectedColorValue ? null : d   // if the user clicks on the "selected" color again, this logic will "de seelct" all colors
    ))

  groups.exit().remove()

  groupsEnter.append('circle')
    .merge(groups.select('circle'))
      .attr('r', circleRadius)
      .attr("fill", colorScale)
  
  groupsEnter.append('text')
    .merge(groups.select('text'))
      .text(d => d)
      .attr('x', textOffset)
      .attr('dy', '0.32em')
}