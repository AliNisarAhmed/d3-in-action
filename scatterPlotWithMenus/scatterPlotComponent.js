import { 
  axisBottom, 
  axisLeft, 
  scaleLinear, 
  extent,
} from 'd3';

export const scatterPlot = (selection, props) => {
  const {
    xValue,
    yValue,
    xAxisLabel,
    yAxisLabel,
    margin,
    circleRadius,
    width,
    height,
    data,
  } = props;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  // const title = `${yAxisLabel} vs ${xAxisLabel}`
  
  const xScale = scaleLinear()
  	.domain(extent(data, xValue))
  	.range([0, innerWidth]).nice();
  
  const yScale = scaleLinear()
  	.domain(extent(data, yValue))
  	.range([innerHeight, 0]).nice();
  
  
	// X-Axis Tick format specifies the function to be used in tickFormat, here we are replacing Giga with Billion

  const yAxis = axisLeft(yScale)
  	.tickSize(-innerWidth)
  	.tickPadding(12);
  
  const xAxis = axisBottom(xScale)
  	.tickSize(-innerHeight)
  	.tickPadding(12);
  
  const g = selection.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class', 'container');
  gEnter.merge(g)
  	.attr('transform', `translate(${margin.left}, ${margin.top})`)
  

  // APPLYING GUP to the Y-AXIS 
  const yAxisG = g.select('.y-axis');  //update selection
  const yAxisGEnter = gEnter  // enter seelction, separate variable as needed for label nesting
    .append('g')
      .attr('class', 'y-axis');
  yAxisG
    .merge(yAxisGEnter)   // merging with Enter
      .call(yAxis)
      .selectAll('.domain').remove();
      
    const yAxisLabelText = yAxisGEnter
      .append('text')
        .attr('class', 'yAxisLabel')
        .attr('y', -60)
        .attr('fill', 'black')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
      .merge(yAxisG.select('.yAxisLabel'))   // we always select from the "update" selection  
        .attr('x', -innerHeight / 2)
        .text(yAxisLabel)
        
  // APPLYING GUP TO THE X-AXIS
  const xAxisG = g.select('.x-axis');  //update selection
  const xAxisGEnter = gEnter  // enter seelction, separate variable as needed for label nesting
    .append('g')
      .attr('class', 'x-axis');
  xAxisG
    .merge(xAxisGEnter)   // merging with Enter
    	.attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('.domain').remove();
      
          
const xAxisLabelText = xAxisGEnter
  .append('text')
    .attr('class', 'xAxisLabel')
    .attr('y', 45)
    .attr('fill', 'black')
  .merge(xAxisG.select('.xAxisLabel'))   // we always select from the "update" selection  
    .attr('x', innerWidth / 2)
    .text(xAxisLabel)

  
  const circles = g.merge(gEnter).selectAll('circle').data(data);   // --g.merge(gEnter)--this is so that we get circles for first as well as subsequent data updates
  circles
    .enter().append('circle')
      .attr('cx', innerWidth / 2)
      .attr('cy', innerHeight / 2)  // so that the circles emanate from the center of the page
      .attr('r', 0)
    .merge(circles)
      .transition().duration(600)
      .delay((d, i) => i * 2)
  		.attr('cy', d => yScale(yValue(d)))
  		.attr('cx', d => xScale(xValue(d)))
  		.attr('r', circleRadius);
}