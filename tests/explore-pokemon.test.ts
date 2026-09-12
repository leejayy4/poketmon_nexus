import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { Engine,VECTOR } from '../src/engine';
import { canStand } from '../src/maps';
import { TOUR_POKEMON,TOUR_MAPS,TOUR_SPAWNS,type TourId } from '../src/explore-world';
import { FIELD_POKEMON,fieldPokemonFrame,pokemonFacing } from '../src/explore-pokemon';
import { parseSave } from '../src/save';
import { TOWN_REVISION } from '../src/town';
import type { Direction } from '../src/types';

test('35 town Pokemon cover eight DS field species with four reachable conversation sides',()=>{
  assert.equal(Object.keys(TOUR_POKEMON).length,35);assert.equal(new Set(Object.values(TOUR_POKEMON).map(n=>n.species)).size,8);
  for(const [id,n]of Object.entries(TOUR_POKEMON)){
    const map=TOUR_MAPS[id as TourId];assert(!canStand(map,n.x,n.y));
    for(const v of Object.values(VECTOR))assert(canStand(map,n.x+v.x,n.y+v.y),id+' approach');
    assert(!map.warps.some(w=>w.x===n.x&&w.y===n.y));
    for(const page of n.pages)for(const line of page.split('\n'))assert(line.length<=24,line);
  }
});

test('all town Pokemon react from four directions repeatedly without changing ownership or progress',()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{for(const [id,n]of Object.entries(TOUR_POKEMON))for(const facing of Object.keys(VECTOR) as Direction[]){
    const g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo(id);
    const v=VECTOR[facing];g.save.player={x:n.x-v.x,y:n.y-v.y,facing};const before=structuredClone(g.save);
    for(let repeat=0;repeat<2;repeat++){
      assert.equal(g.interactionHint,'Z 말걸기 · '+n.name);g.confirm();assert.equal(g.dialogue?.speaker,n.name);
      if(id==='tour_eterna'){assert(g.dialogue?.pages.some(p=>p.includes('꽃밭 가장자리')));assert(g.dialogue?.pages.some(p=>p.includes('산책길')));}
      else assert.deepEqual(g.dialogue?.pages,n.pages);
      for(let i=0;g.dialogue&&i<12;i++){g.dialogue.shown=1000;g.confirm();}assert.equal(g.dialogue,null);assert.equal(g.battle,null);assert.deepEqual(g.save,before);
    }
  }}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
});

test('revision 13 saves recover Pokemon overlaps and preserve visits, elapsed time and valid adjacent positions',()=>{
  for(const [id,n]of Object.entries(TOUR_POKEMON)){
    const g=new Engine();g.exploring=true;g.save=g.freshSave();g.exploreTo(id);const s=g.save;
    s.worldRevision=13;s.player={x:n.x,y:n.y,facing:'up'};s.steps=345;s.seconds=789;
    const loaded=parseSave(JSON.stringify(s))!;assert(loaded,id);assert.equal(loaded.worldRevision,TOWN_REVISION);
    assert.deepEqual(loaded.player,{...TOUR_SPAWNS[id as TourId],facing:'down'});assert.deepEqual(loaded.tourVisited,s.tourVisited);assert.equal(loaded.steps,345);assert.equal(loaded.seconds,789);
    s.player.y++;assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player);
    s.player.y--;s.worldRevision=TOWN_REVISION;assert.deepEqual(parseSave(JSON.stringify(s))?.player,s.player);
  }
});

test('direction and idle frames stay inside downloaded DS sheets, including the four-frame Starly',async()=>{
  for(const species of FIELD_POKEMON){
    const asset=await sharp(fileURLToPath(new URL('../public/assets/field-'+species+'.png',import.meta.url))).metadata();
    assert.equal(asset.width,32);assert.equal(asset.height,species==='starly'?128:512);
    for(const facing of Object.keys(VECTOR) as Direction[]){
      const opposite=pokemonFacing(facing);assert.deepEqual(VECTOR[opposite],{x:-VECTOR[facing].x||0,y:-VECTOR[facing].y||0});
      for(const t of [0,.3,.8,1.2,3.9])for(const reacting of [false,true]){const frame=fieldPokemonFrame(species,facing,t,reacting);assert(frame>=0&&(frame+1)*32<=asset.height!);}
    }
  }
});
