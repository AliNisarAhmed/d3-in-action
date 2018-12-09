// Useful resources
// https://github.com/Fil/visionscarto-world-atlas


import { feature } from 'topojson';
import { csv, json } from 'd3';

export const loadAndProcessData = () => 

  Promise
    .all([
      csv('https://vizhub.com/curran/datasets/un-population-estimates-2017-medium-variant.csv'),
      json('https://unpkg.com/visionscarto-world-atlas/world/50m.json')
    ])
    .then(([csvData, topoJSONData]) => {
      console.log(csvData);  
      const rowById = csvData.reduce((acc, d) => {  // we add row by Id, so that we can look up country data by providing an id
        acc[d['Country code']] = d;  // which fetches us country data
        return acc;
      });
      
      // console.log('tsvData', tsvData);
      // console.log('topoJSONData', topoJSONData);
      
      let countries = feature(topoJSONData, topoJSONData.objects.countries);
      
      console.log('countries: ', countries);
      
      countries.features.forEach(d => {
        Object.assign(d.properties, rowById[+d.id]);
      });
      
      return countries;
    });
