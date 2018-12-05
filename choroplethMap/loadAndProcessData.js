import { feature } from 'topojson';
import { tsv, json } from 'd3';

export const loadAndProcessData = () => 

  Promise
    .all([
      tsv('https://unpkg.com/world-atlas@1/world/50m.tsv'),
      json('https://unpkg.com/world-atlas@1/world/50m.json')
    ])
    .then(([tsvData, topoJSONData]) => {  
      const rowById = tsvData.reduce((acc, d) => {  // we add row by Id, so that we can look up country data by providing an id
        acc[d.iso_n3] = d;  // which fetches us country data
        return acc;
      });
      
      // console.log('tsvData', tsvData);
      // console.log('topoJSONData', topoJSONData);
      
      let countries = feature(topoJSONData, topoJSONData.objects.countries);
      
      console.log('countries: ', countries);
      
      countries.features.forEach(d => {
        Object.assign(d.properties, rowById[d.id]);
      });
      
      return countries;
    });
