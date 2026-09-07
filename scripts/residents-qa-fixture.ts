import { writeFileSync } from 'node:fs';
import { newSave } from '../src/save';
const save=newSave();
Object.assign(save,{worldRevision:9,map:'tour_jubilife',player:{x:10,y:13,facing:'right'},flags:{exploration:true},steps:123,seconds:456,
  tourVisited:['tour_jubilife','tour_oreburgh','tour_oreburgh_center']});
writeFileSync(new URL('../tests/residents-legacy-save.json',import.meta.url),JSON.stringify(save,null,2));
