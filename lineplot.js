// https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/data/tweetdata.csv

import * as d3 from 'd3';

d3.csv("https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/data/tweetdata.csv")
  .then(lineplot);

function lineplot (incomingData) {
  console.log(incomingData);

  const svg = d3.select('#svgLine');

  const BLUE = "#5eaec5", GREEN = "#92c463", ORANGE = "#fe9a22";

  const xScale = d3.scaleLinear().domain([1, 10.5]).range([20, 480]);
  const yScale = d3.scaleLinear().domain([0, 35]).range([480, 20]);

  const xAxis = d3.axisBottom(xScale).tickSize(480).tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const yAxis = d3.axisRight(yScale).ticks(10).tickSize(480);

  svg.append('g').attr('id', 'xAxisG').call(xAxis);
  svg.append('g').attr('id', 'yAxisG').call(yAxis);

  svg.selectAll('circle.tweets').data(incomingData)
    .enter().append('circle')
    .attr('class', 'tweets')
    .attr('r', 5)
    .attr('cx', d => xScale(d.day))
    .attr('cy', d => yScale(d.tweets))
    .style('fill', BLUE);

  svg.selectAll('circle.retweets').data(incomingData)
    .enter().append('circle')
    .attr('class', 'retweets')
    .attr('r', 5)
    .attr('cx', d => xScale(d.day))
    .attr('cy', d => yScale(d.retweets))
    .style('fill', GREEN);

  svg.selectAll('circle.favorites').data(incomingData)
    .enter().append('circle')
    .attr('class', 'favorites')
    .attr('r', 5)
    .attr('cx', d => xScale(d.day))
    .attr('cy', d => yScale(d.favorites))
    .style('fill', ORANGE);

  const tweetLine = d3.line()
    .x(d => xScale(d.day))
    .y(d => yScale(d.tweets))
    .curve(d3.curveBasis)
  
  const retweetLine = d3.line()
    .x(d => xScale(d.day))
    .y(d => yScale(d.retweets))
    .curve(d3.curveStep)

  const favoritesLine = d3.line()
    .x(d => xScale(d.day))
    .y(d => yScale(d.favorites))


  svg.append('path')
    .attr("d", tweetLine(incomingData))
    .attr('fill', 'none')
    .attr('stroke', BLUE)
    .attr('stroke-width', '2px');


  svg.append('path')
    .attr('d', retweetLine(incomingData))
    .attr('fill', 'none')
    .attr('stroke', GREEN)
    .attr('stroke-width', '2px')


  svg.append('path')
    .attr('d', favoritesLine(incomingData))
    .attr('fill', 'none')
    .attr('stroke', ORANGE)
    .attr('stroke-width', '2px')
  
}