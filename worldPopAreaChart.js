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
  max,
  format,
} from 'd3';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

csv('https://vizhub.com/curran/datasets/world-population-by-year-2015.csv').then(data => {
  console.log(data);
  data.forEach(d => {
    d.population = +d.population;
    d.year = new Date(d.year);
  })
  render(data);
})

function render(data) {
  
  const xValue = d => d.year;
  const xAxisLabel = "Year";
  
  const yValue = d => d.population;
  const yAxisLabel = 'World Population';
  
  const margin = { top: 45, bottom: 60, right: 30, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const title = `${yAxisLabel} vs ${xAxisLabel}`
  
  // The MAIN GROUP
  const g = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)
  
  // SCALES

  const xScale = scaleTime()
  .domain(extent(data, xValue))
  .range([0, innerWidth]);
  
  const yScale = scaleLinear()
  .domain([0, max(data, yValue)])
  .range([innerHeight, 0]).nice();
  

  // THE CURVE
    
  const areaGen = area() 
    .x(d => xScale(xValue(d)))
    .y0(innerHeight)
    .y1(d => yScale(yValue(d)))
    .curve(curveBasis);

  g.append('path')
      .attr('class', 'line-path')
      .attr('d', areaGen(data))

  
	// X-Axis Tick format specifies the function to be used in tickFormat, here we are replacing Giga with Billion
  
  const yAxis = axisLeft(yScale)
  .tickFormat(format(".1s"))
  .tickSize(-innerWidth)
  .tickPadding(12);
  
  const xAxis = axisBottom(xScale)
  .ticks(6)
  .tickSize(-innerHeight)
  .tickPadding(12);
  
  
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
  

  // Label for x Axis
  xAxisG.append('text')
  				.attr('class', 'xAxisLabel')
  				.attr('x', innerWidth / 2)
  				.attr('y', 50)
  				.attr('fill', 'black')
  				.text(xAxisLabel)
  

  // label for y axis
  yAxisG.append('text')
        .attr('class', 'yAxisLabel')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
  			.attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
    		.text(yAxisLabel)
}
