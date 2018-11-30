import * as d3 from 'd3';

d3.csv('https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/data/boxplot.csv').then(drawBoxPlot);

function drawBoxPlot (incomingData) {
  console.log(incomingData);
  let xScale = d3.scaleLinear().domain([1, 8]).range([20, 480]);
  let yScale = d3.scaleLinear().domain([0, 100]).range([480, 20]);

  let xAxis = d3.axisBottom().scale(xScale).tickSize(-480).tickValues([1, 2, 3, 4, 5, 6, 7, 8]);
  let yAxis = d3.axisRight().scale(yScale).tickSize(480);

  d3.select('#svgBox').append('g').attr('transform', 'translate(0, 480)').attr('id', 'xAxisG').call(xAxis);
  d3.select('#svgBox').append('g').attr('transform', 'translate(0, 0)').attr('id', 'yAxisG').call(yAxis);

  // d3.select('#svgBox').selectAll('circle').data(incomingData).enter().append('circle')
  //   .attr('r', 10)
  //   .attr('cx', d => xScale(+d.day))
  //   .attr('cy', d => yScale(d.median))
  //   .style('fill', 'lightgray')

  d3.select('#svgBox').selectAll('g.box')
    .data(incomingData).enter().append('g')
    .attr("class", 'box')
    .attr('transform', d => `translate(${xScale(+d.day)}, ${yScale(d.median)})`)
    .each(function (d, i) {
      d3.select(this)
        .append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', yScale(d.max) - yScale(d.median))
        .attr('y2', yScale(d.min) - yScale(d.median))
        .style('stroke', 'black')
        .style('stroke-width', "4px")

      d3.select(this)
        .append('line')
        .attr('class', 'max')
        .attr('x1', -10)
        .attr('x2', 10)
        .attr('y1', yScale(d.max) - yScale(d.median))
        .attr('y2', yScale(d.max) - yScale(d.median))
        .style('stroke', 'black')
        .style('stroke-width', "4px")

      d3.select(this)
        .append('line')
        .attr('x1', -10)
        .attr('x2', 10)
        .attr('y1', yScale(d.min) - yScale(d.median))
        .attr('y2', yScale(d.min) - yScale(d.median))
        .style('stroke', 'black')
        .style('stroke-width', "4px");

      d3.select(this)
        .append('rect')
        .attr('class', 'range')
        .attr('width', 20)
        .attr('x', -10)
        .attr('y', yScale(d.q3) - yScale(d.median))
        .attr('height', yScale(d.q1) - yScale(d.q3))
        .style('fill', 'white')
        .style('stroke', 'black')
        .style('stroke-width', '2px')

      d3.select(this)
        .append('line')
        .attr('x1', -10)
        .attr('x2', 10)
        .attr('y1', 0)
        .attr('y2', 0)
        .style('stroke', 'gray')
        .style('stroke-width', '4px')

    })
}