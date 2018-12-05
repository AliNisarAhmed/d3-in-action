import { select, scaleOrdinal, scaleSqrt } from 'd3';
import { colorLegend } from './colorLegend';
import { sizeLegend } from './sizeLegend';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const colorScale = scaleOrdinal()
	.domain(['apple', 'lemon', 'lime', 'orange'])
	.range(['#c11d1d', '#eae600', 'limegreen', 'orange'])

svg.append('g')
  .attr('transform', `translate(120, ${100})`)
  .call(colorLegend, {
    colorScale,
    spacing: 100,
    circleRadius: 30,
    textOffset: 40,
  });

const sizeScale = scaleSqrt()
  .domain([0, 10])
  .range([0, 50])

svg.append('g')
.attr('transform', `translate(320, ${50})`)
.call(sizeLegend, {
  sizeScale,
  spacing: 100,
  textOffset: 80,
  numTicks: 5,
  circleFill: "rgba(0, 0, 0, 0.5)",
});