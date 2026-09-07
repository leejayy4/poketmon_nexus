import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
for(const [name,map,x,y,facing] of [
 ['south','tour_eterna_forest',10,15,'down'],
 ['south-canopy','tour_eterna_forest',9,15,'down'],
 ['north','tour_eterna_forest',10,3,'up'],
 ['ilex','tour_ilex',17,9,'right'],
 ['viridian','tour_viridian_forest',10,15,'down'],
] as const){
 const save=newSave();save.map=map;save.player={x,y,facing};
 const checked=parseSave(JSON.stringify(save));
 if(!checked||checked.player.x!==x||checked.player.y!==y)throw Error(`Invalid fixture: ${name}`);
 writeFileSync(`tests/forest-border-${name}-save.json`,JSON.stringify(checked,null,2)+'\n');
}
