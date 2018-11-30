import { 
  axisBottom, 
  axisLeft, 
  select, 
  csv, 
  scaleLinear, 
  extent,
  scaleTime,
  area,
  curveBasis,
} from 'd3';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

csv('https://vizhub.com/curran/datasets/temperature-in-san-francisco.csv').then(data => {
  console.log(data);
  data.forEach(d => {
    d.temperature = +d.temperature;
    d.timestamp = new Date(d.timestamp);
  })
  render(data);
})

function render(data) {
  
  const xValue = d => d.timestamp;
  const xAxisLabel = "Time";
  
  const yValue = d => d.temperature;
  const yAxisLabel = 'Temperature';
  
  const margin = { top: 45, bottom: 60, right: 30, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const circleRadius = 5;
  const title = `${yAxisLabel} vs ${xAxisLabel} (San Francisco)`

  
  // SCALES

  const xScale = scaleTime()
  .domain(extent(data, xValue))
  .range([0, innerWidth]);
  
  const yScale = scaleLinear()
  .domain(extent(data, yValue))
  .range([innerHeight, 0]).nice();
  
  
	// X-Axis Tick format specifies the function to be used in tickFormat, here we are replacing Giga with Billion
  
  const yAxis = axisLeft(yScale)
  .tickSize(-innerWidth)
  .tickPadding(12);
  
  const xAxis = axisBottom(xScale)
  .ticks(6)
  .tickSize(-innerHeight)
  .tickPadding(12);
  
  // The MAIN GROUP
  const g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
  
  // ** TITLE **

  g.append('text')
  		.attr('y', -10)
  		.attr('x', innerWidth / 14)
  		.attr('class', 'title')
      .text(title)
        
  // removing the .domain as well as the ticks
  
  const yAxisG = g.append('g').call(yAxis)
  
  yAxisG
  .selectAll('.domain').remove();
  
  
	const xAxisG = g.append('g').call(xAxis)
  	.attr('transform', `translate(0, ${innerHeight})`)
  
  xAxisG.select('.domain').remove()
  
  xAxisG.append('text')
  				.attr('class', 'xAxisLabel')
  				.attr('x', innerWidth / 2)
  				.attr('y', 50)
  				.attr('fill', 'black')
  				.text(xAxisLabel)
  
  yAxisG.append('text')
        .attr('class', 'yAxisLabel')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
  			.attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
    		.text(yAxisLabel)
  
  const areaGen = area() 
    .x(d => xScale(xValue(d)))
    .y0(innerHeight)
    .y1(d => yScale(yValue(d)))
    .curve(curveBasis);

  g.append('path')
      .attr('class', 'line-path')
      .attr('d', areaGen(data))
}
