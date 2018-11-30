import * as d3 from 'd3';
import legend from 'd3-svg-legend';


d3.csv("https://raw.githubusercontent.com/emeeks/d3_in_action_2/master/data/movies.csv")
  .then(areaGraph)

function areaGraph (incomingData) {
  console.log(incomingData);

  const svg = d3.select('#svgArea');

  const fillScale = d3.scaleOrdinal()
    .domain(incomingData.columns)
    .range(["#fcd88a", "#cf7c1c", "#93c464", "#75734F", "#5eafc6", "#41a368"])

  const xScale = d3.scaleLinear().domain([1,8]).range([ 20, 480 ])
  const yScale = d3.scaleLinear().domain([0, 55]).range([480, 20])

  const xAxis = d3.axisBottom().scale(xScale)
  const yAxis = d3.axisLeft().scale(yScale)

  svg.append('g').attr('transform', `translate(${20}, ${480})`).call(xAxis);

  svg.append('g').attr('transform', `translate(${20}, ${0})`).call(yAxis);

  Object.keys(incomingData[0]).forEach(key => {
    if (key !== 'day') {
      const movieArea = d3.area()
        .x(d => xScale(d.day))
        .y0(d => yScale(simpleStacking(d, key) - d[key]))
        .y1(d => yScale(simpleStacking(d, key)))
        .curve(d3.curveBasis);
    
      svg.append('path')
        .attr('id', key + "Area")
        .attr('d', movieArea(incomingData))
        .attr('fill', fillScale(key))
        .attr('stroke', "black")
        .attr('stroke-width', 1)
    }
  })

  function simpleStacking (lineData, lineKey) {
    let newHeight = 0;
    Object.keys(lineData).every(key => {
      if (key !== 'day') {
        newHeight += parseInt(lineData[key]);
        if (key === lineKey) {
          return false;
        }
      }
      return true;
    })
    return newHeight;
  }

  const legendA = legend.legendColor().scale(fillScale)

  svg.append('g')
    .attr('transform', 'translate(500, 0)')
    .call(legendA);
}