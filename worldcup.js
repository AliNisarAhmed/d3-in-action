// https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/data/worldcup.csv

// https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/images/${d.team}.png

import * as d3 from 'd3';

d3.csv(" https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/data/worldcup.csv").then(data => {
  draw([...data]);
})

function draw (incomingData) {
  console.log(incomingData);

  const svg = d3.select("#svg3")

  svg.append('g')
    .attr("id", "teamsG")
    .attr('transform', `translate(50, 300)`)
    .selectAll('g')
    .data(incomingData)
    .enter()
    .append('g')
    .attr('class', 'overallG')
    .attr('transform', (d, i) => `translate(${i * 50}, 0)`)

  let teamG = d3.selectAll('g.overallG');

  teamG
    .append('circle')
    .attr('r', 0)
    .transition()
    .delay((d, i) => i * 100)
    .duration(500)
    .attr('r', 40)
    .transition()
    .duration(500)
    .attr('r', 20)

  teamG
    .append('text')
    .attr("y", 30)
    .text(d => d.team)

  const dataKeys = Object.keys(incomingData[0]).filter(d => d !== "team" && d !== "region");

  d3.select("#controls").selectAll("button.teams").data(dataKeys).enter().append("button").on("click", buttonClick).html(d => d);

  function buttonClick (datapoint) {
    let maxValue = d3.max(incomingData, d => parseFloat(d[datapoint]));

    let colorScale = d3.scaleOrdinal()
      .domain([0, maxValue])
      .range(d3.schemeBlues)

    let radiusScale = d3.scaleLinear()
      .domain([ 0, maxValue ]).range([2, 20])
    d3.selectAll("g.overallG").select('circle').transition().duration(1000)
      .attr('r', d => radiusScale(d[datapoint]))
      .style('fill', p => colorScale(p[datapoint]));
  }

  teamG.on('mouseover', highlightRegion);

  function highlightRegion (d) {
    
    d3.select(this).select("text").classed('active', true).attr('y', 10);
    d3.selectAll('g.overallG').select('circle')
      .attr('class', p => p.region === d.region ? 'active': 'inactive');
    this.parentElement.appendChild(this);
  }

  teamG.on('mouseout', unhighlight);

  function unhighlight (d) {
    d3.selectAll('g.overallG').select('circle').attr('class', '');
    d3.selectAll('g.overallG').select('text').classed('active', false).attr('y', 30);
  }

  teamG.select('text').style('pointer-events', 'none');

  teamG.insert('image', 'text')
    .attr('xlink:href', d => `https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/images/${d.team}.png`)
    .attr('width', '45px').attr('height', '20px')
    .attr('x', -22).attr('y', -10);

  let html = `
  <table>
  <tr>
  <th>Statistics</th>
  </tr>
  <tr><td>Team Name</td><td class="data"></td></tr>
  <tr><td>Region</td><td class="data"></td></tr>
  <tr><td>Wins</td><td class="data"></td></tr>
  <tr><td>Losses</td><td class="data"></td></tr>
  <tr><td>Draws</td><td class="data"></td></tr>
  <tr><td>Points</td><td class="data"></td></tr>
  <tr><td>Goals For</td><td class="data"></td></tr>
  <tr><td>Goals Against</td><td class="data"></td></tr>
  <tr><td>Clean Sheets</td><td class="data"></td></tr>
  <tr><td>Yellow Cards</td><td class="data"></td></tr>
  <tr><td>Red Cards</td><td class="data"></td></tr>
  </table>
  `;

  d3.select('body').append('div').attr('id', 'infobox').html(html);
  teamG.on('click', function teamClick(d) {
    console.log(d);
    d3.selectAll('td.data').data(d3.values(d)).html(d => d);
  })

}