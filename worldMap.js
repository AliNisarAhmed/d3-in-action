import { select, json, tsv, geoPath, geoNaturalEarth1, zoom, event } from 'd3';
import { feature } from 'topojson';

const svg = select('svg');

const width = svg.attr('width');
const height = svg.attr('height');

const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);


Promise.all([
  tsv('https://unpkg.com/world-atlas@1/world/50m.tsv'),
  json('https://unpkg.com/world-atlas@1/world/50m.json')
]).then(([tsvData, topoJSONData]) => {
  
  const countryName = tsvData.reduce((acc, d) => {
    acc[d.iso_n3] = d.name;
    return acc;
  });
  
  // g for svg zoom below
  
  const g = svg.append('g');
  
  svg.call(zoom().on('zoom', () => {
    g.attr('transform', event.transform)
  }));
  
  g.append('path')
      .attr('class', 'sphere')
      .attr('d', pathGenerator({ type: 'Sphere' }));
  // const countryName = {};
  // tsvData.forEach(d => {
  //   countryName[d.iso_n3] = d.name;
  // })
  console.log('tsvData', tsvData);
  console.log('topoJSONData', topoJSONData);
  
  let countries = feature(topoJSONData, topoJSONData.objects.countries)
  
  console.log(countries);
  
  const paths = g.selectAll('path')
    .data(countries.features);
  
  paths.enter().append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator)
    .append('title')
      .text(d => countryName[d.id]);
})
