import * as d3 from 'd3';


d3.json('https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/data/tweets.json')
  .then(drawPieChart)

function drawPieChart(incomingData) {
  console.log(incomingData)
  let nestedTweets = d3.nest().key(d => d.user)
    .entries(incomingData.tweets)

    
    nestedTweets.forEach(d => {
      d.numTweets = d.values.length;
      d.numFavorites = d3.sum(d.values, p => p.favorites.length)
      d.numRetweets = d3.sum(d.values, p => p.retweets.length);
    });
    
  console.log(nestedTweets);
  var pieChart = d3.pie();

  pieChart.value(d => d.numTweets).sort(null)

  var tweetsPie = pieChart(nestedTweets);

  pieChart.value(d => d.numRetweets)
  var retweetsPie = pieChart(nestedTweets);

  nestedTweets.forEach((d, i) => {
    d.tweetsSlice = tweetsPie[i];
    d.retweetsSlice = retweetsPie[i];
  })

  let newArc = d3.arc(tweetsPie);

  newArc.innerRadius(20).outerRadius(100);

  let fillScale = d3.scaleOrdinal().range(['#fcd88a', '#cf7c1c', '#93c464', '#75744f'])

  let svg = d3.select('#svgPie');

  svg.append('g')
    .attr('transform', 'translate(250, 250)')
    .selectAll('path')
    .data(yourPie)
    .enter()
    .append('path')
    .attr('d', newArc(d.retweetsSlice))
    .style('fill', (d, i) => fillScale(i))
    .style('stroke', 'black')
  //   .style('stroke-width', '2px')

    pieChart.value(d => d.numFavorites)
    d3.selectAll('path').data(pieChart(nestedTweets)).transition().duration(1000).attr('d', newArc)

    // pieChart.value(d => d.numRetweets)
    // d3.selectAll('path').data(pieChart(nestedTweets)).transition().duration(1000).attr('d', newArc)
}