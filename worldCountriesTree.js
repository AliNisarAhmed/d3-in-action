// Data Source https://gist.github.com/curran/1dd7ab046a4ed32380b21e81a38447aa

import { 
  select, 
  json, 
  tree, 
  hierarchy,
  linkHorizontal, 
  zoom,
  event
} from 'd3';

const svg = select('svg');


const width = document.body.clientWidth;
const height = document.body.clientHeight;
const margin = { top: 0, right: 50, left: 75, bottom: 0 }
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const treeLayout = tree().size([innerHeight, innerWidth]);

const zoomG = svg
	  .attr('width', width)
    .attr('height', height)
  .append('g')

// zoomG is the main 'g' om which we pan and zoom. g is the group to which the chart is attached

const g = zoomG.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);    
  
svg.call(zoom().on('zoom', () => {
  zoomG.attr('transform', event.transform)
}))

json('https://gist.githubusercontent.com/curran/1dd7ab046a4ed32380b21e81a38447aa/raw/e04346c8fa26fb1d0f3a866f6ff30ddee74f9ae6/countryHierarchy.json')
  .then(data => {
    console.log(data);
    // Creating a root node necessary for passing to tree()
    const root = hierarchy(data);
    const links = treeLayout(root).links();
    const linkPathGenerator = linkHorizontal()
      .x(d => d.y)  // x returns y, y returns x for horizontal links
      .y(d => d.x);

    g.selectAll('path').data(links)
      .enter().append('path')
        .attr('d', linkPathGenerator)

    g.selectAll('text').data(root.descendants())
      .enter().append('text')
        .attr('x', d => d.y)
        .attr('y', d => d.x)
        .attr('dy', "0.32em")
        .attr('text-anchor', d => d.children ? 'middle' : 'start')  // if no d.children (meaning node is a "leaf" node) t
        .attr('font-size', d => 3.25 - d.depth + "em")
        .text(d => d.data.data.id)
  })