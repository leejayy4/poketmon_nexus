import { writeFileSync } from 'node:fs';
import { newSave,parseSave } from '../src/save';
import type { MapId } from '../src/types';

// Import only through the save panel on a unique ?qa= URL.
for(const [name,map,x,y]of [
  ['center','tour_jubilife',8,9],
  ['junction','tour_jubilife',14,11],
  ['veilstone','tour_veilstone',14,11],
] as const){
  const save=newSave();save.map=map as MapId;save.player={x,y,facing:'up'};
  const checked=parseSave(JSON.stringify(save));
  if(!checked)throw new Error(`Invalid city art fixture: ${name}`);
  writeFileSync(`tests/city-street-${name}-save.json`,JSON.stringify(checked,null,2)+'\n');
}
