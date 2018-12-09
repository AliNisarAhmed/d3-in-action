import { select, geoPath, geoNaturalEarth1, zoom, event, geoCentroid } from 'd3';
import { loadAndProcessData } from './loadAndProcessData';

const svg = select('svg');

const width = svg.attr('width');
const height = svg.attr('height');

const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);

const g = svg.append('g');


g.append('path')
  .attr('class', 'sphere')
  .attr('d', pathGenerator({ type: 'Sphere' }));

svg.call(zoom().on('zoom', () => {
  g.attr('transform', event.transform)
}));


loadAndProcessData().then(countries => {
  const paths = g.selectAll('path')
    .data(countries.features);
    
  paths.enter().append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator)
      .attr('fill', 'green')
    .append('title')
      .text(d => `${d.id}: `);

  const circles = g.selectAll('circle')
      .data(countries.features);
      
  circles.enter().append('circle')
    .attr('class', 'country-circle')
    .attr('cx', d => projection(geoCentroid(d))[0])
    .attr('cy', d => projection(geoCentroid(d))[1])
    .attr('r', 10)
});

