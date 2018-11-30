import * as d3 from 'd3';

d3.json('https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/data/tweets.json')
  .then(drawHistogram)

function drawHistogram (incomingData) {
  console.log('incomingData :', incomingData);
  let xScale = d3.scaleLinear().domain([0, 5]).range([0, 500])
  let yScale = d3.scaleLinear().domain([0, 10]).range([400, 0])
  let xAxis = d3.axisBottom().scale(xScale).ticks(4)

  let histoChart = d3.histogram();

  histoChart
    .domain([0, 5])
    .thresholds([0, 1, 2, 3, 4, 5])
    .value(d => d.favorites.length)

  let histoData = histoChart(incomingData.tweets)

  console.log(histoData);

  d3.select('#svgHisto')
    .selectAll('rect').data(histoData).enter()
    .append('rect')
    .attr('x', d => xScale(d.x0))
    .attr('y', d => yScale(d.length))
    .attr('width', d => xScale(d.x1 - d.x0) - 2)
    .attr('height', d => 400 - yScale(d.length))
    .style('fill', '#FCD88B')
    .on('click', retweets)

  d3.select('svg').append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0, 400)').call(xAxis);
  d3.select('g.axis').selectAll('text').attr('dx', 50)

  function retweets () {
    histoChart.value(d => d.retweets.length)
    histoData = histoChart(incomingData.tweets)
    d3.selectAll('rect').data(histoData)
      .transition().duration(500).attr('x', d => xScale(d.x0))
      .attr('y', d => yScale(d.length))
      .attr('height', d => 400 - yScale(d.length))
  }
}