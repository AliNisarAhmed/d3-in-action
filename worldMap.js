import { select, json, geoPath, geoNaturalEarth1 } from 'd3';
import { feature } from 'topojson';

const svg = select('svg');

const width = svg.attr('width');
const height = svg.attr('height');

const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);

svg.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({ type: 'Sphere' }));

json('https://unpkg.com/world-atlas@1/world/110m.json')
  .then(data => {
    let countries = feature(data, data.objects.countries)

    const paths = svg.selectAll('path')
      .data(countries.features);
    
    paths.enter().append('path')
        .attr('class', 'country')
      .attr('d', pathGenerator)

  });