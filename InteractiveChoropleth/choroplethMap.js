import {
  geoNaturalEarth1,
  geoPath,
  zoom,
  event,
} from 'd3';

const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);

export const choroplethMap = (selection, props) => {
  
  const {
    features,
    colorScale,
    colorValue,
    selectedColorValue,
  } = props;

  const gUpdate = selection.selectAll('g').data([null]);
  const gEnter = gUpdate.enter().append('g')  //.merge(g);   // GUP special case for single element
  const g = gUpdate.merge(gEnter)

  // Blue Earth Background - using update selection to alter the opacity
  gEnter
    .append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({ type: 'Sphere' }))
    .merge(gUpdate.select('.sphere'))
      .attr('opacity', selectedColorValue ? 0.1 : 1)

  // Zooming
  selection.call(zoom().on('zoom', () => {
    g.attr('transform', event.transform)
  }));
  
  const countryPaths = g.selectAll('.country').data(features);
  const countryPathsEnter = countryPaths
    .enter().append('path', d => d.id)  
      .attr('class', 'country')
      .attr('d', pathGenerator)   // this and next one can now be used in Enter selection coz we now define a unique key in data()
      .attr('fill', d => colorScale(colorValue(d)));
  countryPaths
    .merge(countryPathsEnter)
    .attr('opacity', d => 
      (!selectedColorValue || selectedColorValue === colorValue(d))
      ? 1
      : 0.2
    )
    .classed('highlighted', d => 
      selectedColorValue && selectedColorValue === colorValue(d)  // highlighed class toggle to stroke style the selected Contries
    );

  countryPathsEnter
    .append('title')
      .text(d => `${d.properties.name}: ${colorValue(d)}`);
}
