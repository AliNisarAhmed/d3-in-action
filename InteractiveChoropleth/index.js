import { select, event, scaleOrdinal, schemeSpectral } from 'd3';
import { loadAndProcessData } from './loadAndProcessData';
import { colorLegend } from './colorLegend';
import { choroplethMap } from './choroplethMap';

const svg = select('svg');

const width = svg.attr('width');
const height = svg.attr('height');

const choroplethMapG = svg.append('g');
const colorLegendG = svg.append('g')
  .attr('transform', `translate(30, 300)`);

const colorScale = scaleOrdinal();

const colorValue = d => d.properties.economy;

// State

let selectedColorValue;
let features;

// Click handler on the legend
const onClick = d => {
  selectedColorValue = d;
  render();
}

loadAndProcessData().then(countries => {
  features = countries.features;  // we first wait for data to arrive, then it is assigned to features, and only then is render called
  render();
});

// render function that renders/rerenders the choropleth

function render () {
 
  colorScale
    .domain(features.map(colorValue))
    .domain(colorScale.domain().sort().reverse())
    .range(schemeSpectral[colorScale.domain().length]);
  
  colorLegendG.call(colorLegend, {
    colorScale,
    circleRadius: 10,
    spacing: 30,
    textOffset: 15,
    backgroundRectWidth: 250,
    onClick,
    selectedColorValue,  // passing it to colorLegend so that we can filter/fade out non selected ones
  });

  choroplethMapG.call(choroplethMap, {
    features,
    colorScale,
    colorValue,
    selectedColorValue,
  })

}

