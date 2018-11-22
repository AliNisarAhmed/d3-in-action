import * as d3 from 'd3';
// import * as data from './data/cities.csv';

d3.csv("https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/data/cities.csv").then(data => {
  drawGraph(data);
});

function drawGraph(incomingData) {
  let modData = incomingData.map(d => ({
    name: d.label,
    population: Number(d.population) / 1000000
  }));

  console.log(modData);

  const svg = d3.select('#svg');

  let yExtent  = d3.extent(modData, d => d.population);
  // let max = d3.max(modData, d => d.population);

  console.log(yExtent);

  let yScale = d3.scaleLinear().domain([0, 1, 5, 15]).range([20, 100, 200, 480]);

  console.log(yScale(500000))

  svg.selectAll('rect')
    .data(modData)
    .enter()
    .append('rect')
    .attr('x', (d, i) => 10 + i * 30)
    .attr('y', d => 500 - yScale(d.population))
    .attr('height', d => yScale(d.population))
    .attr('width', 25)
    .style('fill', 'blue')
    .style('stroke', 'black')
    .style('stroke-width', "2px")
}


