import * as d3 from 'd3';

let scatterData = [
  {friends: 5, salary: 22000},
  {friends: 8, salary: 54000},
  {friends: 12, salary: 94000},
  {friends: 2, salary: 7000},
  {friends: 20, salary: 90000},
  {friends: 15, salary: 134000},
  {friends: 3, salary: 3000},
  {friends: 5, salary: 20000},
]


let xExtent = d3.extent(scatterData, d => d.salary);
let yExtent = d3.extent(scatterData, d => d.friends);

let xScale = d3.scaleLinear().domain(xExtent).range([20, 480]);
let yScale = d3.scaleLinear().domain(yExtent).range([480, 20]);

let yAxis = d3.axisLeft().scale(yScale).tickSize(-480).ticks(7)
d3.select('#svg4').append('g').attr('id', 'yAxisG').call(yAxis);

let xAxis = d3.axisBottom().scale(xScale).tickSize(-480).ticks(7);
d3.select('#svg4').append('g').attr('id', 'xAxisG').call(xAxis);

d3.selectAll('#xAxisG').attr('transform', "translate(0, 480)");
d3.selectAll('#yAxisG').attr('transform', "translate(20, 0)");

d3.select('#svg4').selectAll('circle')
  .data(scatterData)
  .enter()
  .append('circle')
  .attr('r', 5)
  .attr('cx', (d) => xScale(d.salary))
  .attr('cy', d => yScale(d.friends))