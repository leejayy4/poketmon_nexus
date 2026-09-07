import { writeFileSync } from 'node:fs';
import { newSave } from '../src/save';
const save=newSave();Object.assign(save,{worldRevision:11,map:'tour_canalave',player:{x:5,y:10,facing:'left'},flags:{exploration:true},steps:345,seconds:678,
  tourVisited:['tour_canalave','tour_canalave_hall']});
writeFileSync(new URL('../tests/waterfront-legacy-save.json',import.meta.url),JSON.stringify(save,null,2));
