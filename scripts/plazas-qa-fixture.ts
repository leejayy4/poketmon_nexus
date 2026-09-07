import { writeFileSync } from 'node:fs';
import { newSave } from '../src/save';
const save=newSave();Object.assign(save,{worldRevision:10,map:'tour_oreburgh',player:{x:18,y:14,facing:'right'},flags:{exploration:true},steps:234,seconds:567,
  tourVisited:['tour_oreburgh','tour_oreburgh_center']});
writeFileSync(new URL('../tests/plazas-legacy-save.json',import.meta.url),JSON.stringify(save,null,2));
