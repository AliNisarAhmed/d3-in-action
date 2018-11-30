import * as d3 from 'd3';

let fillScale = d3.scaleOrdinal().range(['#fcd88a','#cf7c1c', '#93c464']);

let normal = d3.randomNormal()
let normal2 = d3.randomLogNormal();
let normal3 = d3.randomUniform();

let sampleData1 = d3.range(100).map(d => normal());
let sampleData2 = d3.range(100).map(d => normal());
let sampleData3 = d3.range(100).map(d => normal());

var histoChart = d3.histogram();

histoChart
  .domain([-3, 3])
  .thresholds([-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3])
  .value(d => d)

let yScale = d3.scaleLinear().domain([-3, 3]).range([400, 0]);
let yAxis = d3.axisRight().scale(yScale).tickSize(300);

let svg = d3.select('#svgHisto');

svg.append('g').call(yAxis)

var area = d3.area()
  .x0(d => -d.length)
  .x1(d => d.length)
  .y(d => yScale(d.x0))
  .curve(d3.curveCatmullRom)

svg.selectAll('g.violin')
  .data([sampleData1, sampleData2, sampleData3])
  .enter()
  .append('g')
  .attr('class', 'violin')
  .attr('transform', (d, i) => `translate(${50 + i * 100}, 0)`)
  .append('path')
  .attr('d', d => area(histoChart(d)))
  .style('stroke', 'black')
  .style('fill', (d, i) => fillScale(i))