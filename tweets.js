import * as d3 from 'd3';

d3.json("https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/data/tweets.json").then(data => {
  draw([...data.tweets]);
  impact([...data.tweets]);
})

function draw(incomingData) {
  console.log(incomingData);
  let nestedTweets = d3.nest().key(d => d.user).entries(incomingData);

  console.log(nestedTweets);

  nestedTweets.forEach(d => {
    d.numTweets = d.values.length
  });

  let maxTweets = d3.max(nestedTweets, d => d.numTweets);
  let yScale = d3.scaleLinear().domain([0, maxTweets]).range([0, 500]);

  d3.select('#svg')
    .selectAll('rect')
    .data(nestedTweets)
    .enter()
    .append('rect')
    .attr('width', 50)
    .attr('height', d => yScale(d.numTweets))
    .attr('x', (d, i) => i * 60)
    .attr('y', d => 500 - yScale(d.numTweets))
    .style('fill', "#A23422")
    .style('stroke', '#fd3453')
    .style('stroke-width', "2px")
}


function impact(incomingData) {
  console.log(incomingData);
  incomingData.forEach(d => {
    d.impact = d.favorites.length + d.retweets.length;
    d.tweetTime = new Date(d.timestamp);
  });

  let maxImpact = d3.max(incomingData, d => d.impact);
  let startEnd = d3.extent(incomingData, d => d.tweetTime);
  let timeRamp = d3.scaleTime().domain(startEnd).range([20, 480])
  let yScale = d3.scaleLinear().domain([0, maxImpact]).range([0, 460]);
  let radiusScale = d3.scaleLinear().domain([0, maxImpact]).range([5, 20]);
  let colorScale = d3.scaleLinear().domain([0, maxImpact]).range(["blue", "red"]);

  d3.select("#svg2")
    .selectAll('circle')
    .data(incomingData, JSON.stringify)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d.impact))
    .attr('cx', d => timeRamp(d.tweetTime))
    .attr('cy', d => 480 - yScale(d.impact))
    .style('fill', d => colorScale(d.impact))
    .style('stroke', 'black')
    .style('stroke-width', '1px')

  let tweetG = d3.select("#svg2")
    .selectAll('g')
    .data(incomingData)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${timeRamp(d.tweetTime)}, ${480 - yScale(d.impact)})`)

  tweetG.append('circle')
    .attr('r', d => radiusScale(d.impact))
    .style('fill', '#75739f')
    .style('stroke', 'black')
    .style('stroke-width', '1px')

  // tweetG.append('text')
  //   .text(d => d.user + "-" + d.tweetTime.getHours())

  // d3.selectAll('g').data([1, 2, 3 ,4]).exit().remove()
  // d3.selectAll('g').select('text').text(d => d);

  let filteredData = incomingData.filter(d => d.impact > 0)
  d3.selectAll('circle')
    .data(filteredData, d => JSON.stringify(d))
    .exit()
    .remove();
}