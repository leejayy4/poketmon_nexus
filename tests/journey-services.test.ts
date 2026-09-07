import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { purchase,SHOP_ITEMS,depositPokemon,withdrawPokemon,handleJourneyEvent } from '../src/journey-services';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { Engine } from '../src/engine';
import { MART_ROOMS,PASSAGES } from '../src/journey-world';
import type { SaveData,Pokemon } from '../src/types';
type Collection=SaveData&{box?:Pokemon[]};
function ready():Collection {const s=newSave();grantPokemon(s,7);grantPokemon(s,25);s.flags.departureCleared=true;s.money=2000;return s;}
test('shop prices match the authored item database and transactions are atomic',()=>{
  const db=JSON.parse(fs.readFileSync('docs/design-data/items.json','utf8'));
  for(const [i,item] of SHOP_ITEMS.entries()){
    assert.equal(item.price,db.find((row:any)=>row.id===item.source).buy);
    const s=ready();const before=s.inventory[item.key];purchase(s,i,5);assert.equal(s.money,1000);assert.equal(s.inventory[item.key],before+5);
    for(const qty of [0,-1,1.5,100,NaN]){const old=JSON.stringify(s);purchase(s,i,qty);assert.equal(JSON.stringify(s),old);}
    s.money=0;const old=JSON.stringify(s);purchase(s,i,1);assert.equal(JSON.stringify(s),old);
    s.money=999999;s.inventory[item.key]=999;const capped=JSON.stringify(s);purchase(s,i,1);assert.equal(JSON.stringify(s),capped);
  }
});
test('PC storage preserves individual values and old starter ownership across save round trips',()=>{
  const s=ready(),partner=structuredClone(s.party[0]);depositPokemon(s,0);
  assert.equal(s.party.length,1);assert.deepEqual(s.box?.[0],partner);assert.ok(parseSave(JSON.stringify(s)));
  const snapshot=JSON.stringify(s);depositPokemon(s,0);assert.equal(JSON.stringify(s),snapshot,'last healthy partner cannot be deposited');
  withdrawPokemon(s,0);assert.equal(s.party.length,2);assert.deepEqual(s.party[1],partner);assert.equal(s.box?.length,0);
});
test('PC rejects invalid indices, full storage and full parties without losing a Pokemon',()=>{
  const s=ready();s.box=Array.from({length:60},()=>structuredClone(s.party[0]));
  let previous=JSON.stringify(s);depositPokemon(s,0);assert.equal(JSON.stringify(s),previous);
  s.party=Array.from({length:6},()=>structuredClone(s.party[0]));previous=JSON.stringify(s);withdrawPokemon(s,0);assert.equal(JSON.stringify(s),previous);
  for(const index of [-1,100,NaN,.5]){depositPokemon(s,index);withdrawPokemon(s,index);assert.equal(JSON.stringify(s),previous);}
});
test('shop and PC events require their real facility and pickups cannot be farmed',()=>{
  const g=new Engine();g.save=ready();g.persist=()=>true;g.announce=()=>{};
  assert.equal(handleJourneyEvent(g,'martClerk'),false);
  g.save.map=[...MART_ROOMS][0] as SaveData['map'];assert.equal(handleJourneyEvent(g,'martClerk'),true);assert.ok(g.dialogue?.choices?.some(c=>c.label.includes('몬스터볼')));
  g.save.map='tour_jubilife_center';handleJourneyEvent(g,'tourExhibit1');assert.ok(g.dialogue?.choices?.some(c=>c.label==='포켓몬 맡기기'));
  g.save.map=Object.keys(PASSAGES)[0] as SaveData['map'];const count=g.save.inventory.potions;
  handleJourneyEvent(g,'journeyItem');handleJourneyEvent(g,'journeyItem');assert.equal(g.save.inventory.potions,count+1);
});
