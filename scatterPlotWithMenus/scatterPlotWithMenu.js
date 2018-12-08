import { 
  select, 
  csv, 
} from 'd3';
import { dropDownMenu } from './dropdown';
import { scatterPlot } from './scatterPlotComponent';

const svg = select('svg');

let data;
let xColumn;
let yColumn;

const onXColumnClicked = column => {
  xColumn = column;
  render();
}

const onYColumnClicked = column => {
  yColumn = column;
  render();
}

const width = +svg.attr('width');
const height = +svg.attr('height');

csv('https://gist.githubusercontent.com/omarish/5687264/raw/7e5c814ce6ef33e25d5259c1fe79463c190800d9/mpg.csv').then(incomingData => {
  console.log(incomingData);
  data = incomingData;
  data.forEach(d => {
    d.mpg = +d.mpg;
    d.cylinders = +d.cylinders;
    d.displacement = +d.displacement;
    d.horsepower = +d.horsepower;
    d.weight = +d.weight;
    d.acceleration = +d.acceleration;
  });
  xColumn = data.columns[4];  // capturing the initial value of xColumn
  yColumn = data.columns[0];
  render();
})

function render() {

  dropDownMenu(select('#x-menu'), {
    options: data.columns,
    onOptionClick: onXColumnClicked,
    selectedOption: xColumn,
  });

  dropDownMenu(select('#y-menu'), {
    options: data.columns,
    onOptionClick: onYColumnClicked,
    selectedOption: yColumn,
  });

  svg.call(scatterPlot, {
    xValue: d => d[xColumn],
    xAxisLabel: xColumn,    
    yValue: d => d[yColumn],
    yAxisLabel: yColumn,
    margin: { top: 25, bottom: 60, right: 30, left: 100 },
    circleRadius: 10,
    width,
    height,
    data,
  })
  
}
