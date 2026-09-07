// Run with: node_modules/.bin/tsx.cmd scripts/start-polish-fixtures.ts
// Import only into an isolated ?qa= session through the existing save panel.
import { mkdirSync, writeFileSync } from 'node:fs';
import { newSave, parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import type { MapId } from '../src/types';

const directory = new URL('../tests/fixtures/start-polish/', import.meta.url);
mkdirSync(directory, {recursive:true});
const cases:[string,MapId,number[]][] = [
  ['mother-none','home',[]], ['mother-starter','home',[7]],
  ['mother-pikachu','home',[25]], ['mother-both','home',[7,25]],
  ['lab','lab',[]], ['neighbor','neighbor',[]], ['cottage','cottage',[]],
];
for (const [name,map,party] of cases) {
  const save = newSave(); save.map=map;
  save.player={x:6,y:map==='lab'?11:7,facing:'up'};
  for (const species of party) if(!grantPokemon(save,species)) throw new Error(name);
  const raw=JSON.stringify(save,null,2)+'\n';
  if (!parseSave(raw)) throw new Error('Invalid fixture: '+name);
  writeFileSync(new URL(name+'.json',directory),raw);
}
