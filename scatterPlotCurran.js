import { 
  axisBottom, 
  axisLeft, 
  select, 
  csv, 
  scaleLinear, 
  extent,
	format,
} from 'd3';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

csv('https://gist.githubusercontent.com/omarish/5687264/raw/7e5c814ce6ef33e25d5259c1fe79463c190800d9/mpg.csv').then(data => {
  console.log(data);
  data.forEach(d => {
    d.mpg = +d.mpg;
    d.cylinders = +d.cylinders;
    d.displacement = +d.displacement;
    d.horsepower = +d.horsepower;
    d.weight = +d.weight;
    d.acceleration = +d.acceleration;
  })
  render(data);
})

function render(data) {
  
  const xValue = d => d.horsepower;
  const xAxisLabel = "Horsepower";
  
  const yValue = d => d.weight;
  const yAxisLabel = 'Weight';
  
  const margin = { top: 45, bottom: 60, right: 30, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const circleRadius = 10;
  const title = `${yAxisLabel} vs ${xAxisLabel}`
  
  const xScale = scaleLinear()
  	.domain(extent(data, xValue))
  	.range([0, innerWidth]).nice();
  
  const yScale = scaleLinear()
  	.domain(extent(data, yValue))
  	.range([0, innerHeight]).nice();
  
  
	// X-Axis Tick format specifies the function to be used in tickFormat, here we are replacing Giga with Billion

  const yAxis = axisLeft(yScale)
  	.tickSize(-innerWidth)
  	.tickPadding(12);
  
  const xAxis = axisBottom(xScale)
  	.tickSize(-innerHeight)
  	.tickPadding(12);
  
  const g = svg.append('g')
  	.attr('transform', `translate(${margin.left}, ${margin.top})`)
  
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
  
  
  g.selectAll('circle').data(data)
  	.enter().append('circle')
  		.attr('cy', d => yScale(yValue(d)))
  		.attr('cx', d => xScale(xValue(d)))
  		.attr('r', circleRadius);
  
  g.append('text')
  		.attr('y', -10)
  		.attr('x', innerWidth / 14)
  		.attr('class', 'title')
  		.text(title)  
}
