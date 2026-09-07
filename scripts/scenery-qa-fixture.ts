import { writeFileSync } from 'node:fs';
import { newSave } from '../src/save';
const save=newSave();Object.assign(save,{worldRevision:11,map:'tour_pastoria',player:{x:18,y:14,facing:'right'},flags:{exploration:true},steps:345,seconds:678,
  tourVisited:['tour_pastoria','tour_pastoria_hall']});
writeFileSync(new URL('../tests/scenery-legacy-save.json',import.meta.url),JSON.stringify(save,null,2));
