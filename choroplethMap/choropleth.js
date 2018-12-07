import { select, geoPath, geoNaturalEarth1, zoom, event, scaleOrdinal, schemeSpectral } from 'd3';
import { loadAndProcessData } from './loadAndProcessData';
import { colorLegend } from './colorLegend';

const svg = select('svg');

const width = svg.attr('width');
const height = svg.attr('height');

const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);

const g = svg.append('g');

const colorLegendG = svg.append('g')
  .attr('transform', `translate(30, 300)`);

g.append('path')
  .attr('class', 'sphere')
  .attr('d', pathGenerator({ type: 'Sphere' }));

svg.call(zoom().on('zoom', () => {
  g.attr('transform', event.transform)
}));

const colorScale = scaleOrdinal();

const colorValue = d => d.properties.economy;
  
loadAndProcessData().then(countries => {
  const paths = g.selectAll('path')
    .data(countries.features);

    colorScale
      .domain(countries.features.map(colorValue))
      .domain(colorScale.domain().sort().reverse())
      .range(schemeSpectral[colorScale.domain().length]);
    
    colorLegendG.call(colorLegend, {
      colorScale,
      circleRadius: 10,
      spacing: 30,
      textOffset: 15,
      backgroundRectWidth: 250,
    });
    
  paths.enter().append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator)
      .attr('fill', d => colorScale(colorValue(d)))
    .append('title')
      .text(d => `${d.properties.name}: ${colorValue(d)}`);
});
