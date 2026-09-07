import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine,VECTOR} from '../src/engine';
import {Renderer} from '../src/renderer';
import {itemSupply} from '../src/adventure-guide';
import {ACTIVE_MAPS} from '../src/maps';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {createBattle} from '../src/battle';
import {worldSpawn} from '../src/unified-world';
import type {Direction,MapId} from '../src/types';
function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function game(map:MapId='tour_oreburgh_center'){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.map=map;g.save.player={...(worldSpawn(map)??{x:17,y:6}),facing:'up'};g.save.inventory={pokeBalls:0,potions:0};g.panel='bag';return g}
function choices(g:Engine){for(let i=0;i<40;i++){const d=g.dialogue!;if(d.page===d.pages.length-1&&d.shown>=d.pages[d.page].length)return;g.confirm()}assert.fail('no choices')}
function follow(g:Engine){const r=g.tourNavigation!;for(let i=1;i<r.tiles.length;i++){const a=r.tiles[i-1],b=r.tiles[i],dir=(Object.keys(VECTOR) as Direction[]).find(d=>a.x+VECTOR[d].x===b.x&&a.y+VECTOR[d].y===b.y)!;g.press('Arrow'+dir[0].toUpperCase()+dir.slice(1));g.release('Arrow'+dir[0].toUpperCase()+dir.slice(1));for(let j=0;j<12;j++)g.update(.04);}}
test('supply locations distinguish balls from potions throughout the active world and respect the departure gate',()=>{
  const g=game();for(const id of Object.keys(ACTIVE_MAPS) as MapId[]){g.save.map=id;assert.equal(itemSupply(g.save,'pokeBalls')?.event,'routeGuide');assert(['nurse','routeGuide','trailGuide'].includes(itemSupply(g.save,'potions')!.event!));}
  g.save=newSave();assert.equal(itemSupply(g.save,'pokeBalls'),null);assert.equal(itemSupply(g.save,'potions'),null);
});
test('empty tools explain existing supply limits and default back without changing the save',()=>dom(()=>{
  for(const i of [0,1]){const g=game(),before=structuredClone(g.save);g.selectFieldItem(i);choices(g);assert.equal(g.dialogue!.selected,1);assert(g.dialogue!.pages.join(' ').includes(i===0?'5개':'2개'));g.confirm();assert.equal(g.panel,'bag');assert.deepEqual(g.save,before);assert.equal(g.tourNavigation,null);}
}));
test('choosing supply guidance exits the bag and reaches a real counter before any medicine is granted',()=>dom(()=>{
  const g=game(),before=structuredClone(g.save);g.selectFieldItem(1);choices(g);g.navigate('up');g.confirm();assert.equal(g.panel,'field');assert(g.fieldMap);assert(!g.followingObjective);assert.equal(g.tourEvent,'nurse');assert.deepEqual(g.save,before);follow(g);assert.equal(g.tourNavigation?.status,'arrived');g.save.player.facing=g.tourNavigation!.interaction!.facing;g.confirm();assert.equal(g.save.inventory.potions,2);assert.equal(g.save.inventory.pokeBalls,0);assert.equal(g.save.money,before.money);
}));
test('X and touch back preserve the previous route while touch guidance selects the correct ball provider',()=>dom(()=>{
  const ctx=new Proxy({}, {get:()=>()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>ctx} as HTMLCanvasElement;
  for(const touch of [false,true]){const g=game();g.setTourDestination('tour_jubilife');g.selectFieldItem(0);choices(g);if(touch){const r=new Renderer(g,canvas,canvas);r.lower();r.click(128,164)}else g.cancel();assert.equal(g.panel,'bag');assert.equal(g.tourDestination,'tour_jubilife');}
  const g=game();g.selectFieldItem(0);choices(g);const r=new Renderer(g,canvas,canvas);r.lower();r.click(128,136);assert.equal(g.tourDestination,'route_s01');assert.equal(g.tourEvent,'routeGuide');assert.equal(g.save.inventory.pokeBalls,0);
}));
test('manual destination changes and adventure tracking replace supply guidance without changing progress',()=>dom(()=>{
  const g=game();g.selectFieldItem(0);choices(g);g.navigate('up');g.confirm();const before=structuredClone(g.save);g.guideObjective();assert.equal(g.tourEvent,null);assert.equal(g.tourNavigation?.destination,'oreburgh_gym');g.setTourDestination('tour_jubilife');assert.equal(g.tourEvent,null);assert.equal(g.tourNavigation?.interaction,undefined);assert.deepEqual(g.save,before);
}));
test('restore clears the supply target event and invalidates an old pending choice',()=>dom(()=>{
  const g=game();g.selectFieldItem(1);choices(g);const action=g.dialogue!.choices![0].action,saved=parseSave(JSON.stringify(g.save))!;g.restore(saved);action();assert.equal(g.tourEvent,null);assert.equal(g.panel,'field');assert(!g.fieldMap);assert.equal(g.save.inventory.potions,0);
}));
test('stocked items retain their normal use and supply prompts cannot interrupt battles or other panels',()=>dom(()=>{
  const g=game();g.save.inventory={pokeBalls:1,potions:1};g.selectFieldItem(0);assert.equal(g.dialogue!.choices,undefined);while(g.dialogue)g.confirm();g.selectFieldItem(1);assert.equal(g.panel,'fieldHeal');g.showSupplyHint('potions');assert.equal(g.dialogue,null);g.panel='bag';g.battle=createBattle({...g.save,map:'route_s01'},'wild','roark',()=>0);g.showSupplyHint('potions');assert.equal(g.dialogue,null);
}));
