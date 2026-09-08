import { TOUR_SPAWNS } from '../src/explore-world';
import { SINNOH_STARTS } from '../src/sinnoh-maps';
import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine, VECTOR } from '../src/engine';
import { MAPS, canEnter } from '../src/maps';
import { TEXT } from '../src/dialogues';
import { grantPokemon } from '../src/pokemon';
import { newSave, parseSave } from '../src/save';
import type { Direction, MapId } from '../src/types';

function withDocument(run: () => void) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'document', { configurable:true, value:{getElementById:()=>null} });
  try { run(); } finally {
    if (previous) Object.defineProperty(globalThis, 'document', previous);
    else Reflect.deleteProperty(globalThis, 'document');
  }
}

test('mother recognizes every valid partner combination before and after reload without changing progress', () => withDocument(() => {
  for (const species of [[], [1], [4], [7], [25], [1,25], [4,25], [7,25]]) {
    const save = newSave();
    save.map = 'home'; save.player = {x:4,y:5,facing:'up'};
    for (const id of species) assert(grantPokemon(save,id));
    for (const state of [save, parseSave(JSON.stringify(save))!]) {
      const game = new Engine(); game.save = state;
      const before = JSON.stringify(game.save);
      for (let visit = 0; visit < 2; visit++) {
        game.interact();
        assert.equal(game.dialogue?.speaker, '엄마');
        const text = game.dialogue!.pages.join('');
        assert.equal(text.includes('기다리고'), species.length === 0);
        assert.equal(text.includes('피카츄'), species.includes(25));
        assert.equal(text.includes('둘이나'), species.length === 2);
        if (species.length) assert(text.includes('아껴'));
        while (game.dialogue) game.confirm();
        assert.equal(JSON.stringify(game.save), before);
      }
    }
  }
}));

test('every prop can be reached from the map entrance and investigated using normal movement', () => withDocument(() => {
  const starts:Record<string,[number,number]> = {...Object.fromEntries(Object.entries(TOUR_SPAWNS).map(([id,p])=>[id,[p.x,p.y] as [number,number]])),...SINNOH_STARTS,bedroom:[6,6],home:[6,7],town:[8,25],lab:[6,11],neighbor:[6,7],cottage:[6,7],route_s01:[29,12],jubilife:[21,12],oreburgh:[12,20],jubilife_center:[8,11],oreburgh_center:[8,11],oreburgh_gym:[8,13]};
  for (const map of Object.values(MAPS)) {
    if(map.id.startsWith('tour_'))continue; // Tour interactions have their own mode and tests.
    const start = starts[map.id];
    const paths = new Map<string,Direction[]>([[start.join(','),[]]]);
    const queue = [start];
    for (let i=0;i<queue.length;i++) {
      const [x,y] = queue[i];
      for (const [dir,v] of Object.entries(VECTOR) as [Direction,{x:number;y:number}][]) {
        const a=x+v.x,b=y+v.y,key=`${a},${b}`;
        if (paths.has(key) || !canEnter(map,a,b,dir) || map.warps.some(w=>w.x===a&&w.y===b)) continue;
        paths.set(key,[...paths.get(`${x},${y}`)!,dir]); queue.push([a,b]);
      }
    }
    for (const prop of map.props) {
      const approach = (Object.entries(VECTOR) as [Direction,{x:number;y:number}][]).find(([,v])=>paths.has(`${prop.x-v.x},${prop.y-v.y}`));
      assert(approach, `${map.id}: unreachable ${prop.dialogue} at ${prop.x},${prop.y}`);
      assert(!map.npcs.some(n=>n.x===prop.x&&n.y===prop.y), `${prop.dialogue}: NPC shadows interaction`);
      const [direction,v] = approach;
      const game = new Engine(); game.save = {...newSave(),map:map.id,player:{x:start[0],y:start[1],facing:'down'}};
      for (const step of paths.get(`${prop.x-v.x},${prop.y-v.y}`)!) {
        game.press(({up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'})[step]);
        game.release(({up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'})[step]);
        for(let i=0;i<5;i++) game.update(.04);
      }
      assert.deepEqual({x:game.save.player.x,y:game.save.player.y},{x:prop.x-v.x,y:prop.y-v.y});
      game.save.player.facing=direction;
      game.press('z');
      assert(game.dialogue, `${map.id}: ${prop.dialogue} did not open`);
      if (prop.dialogue==='pokeballs') assert.equal(game.dialogue.speaker,'은솔박사');
      else if(prop.dialogue==='routeSign'){assert.equal(game.dialogue.pages[0],TEXT.routeSign.pages[0]);assert.match(game.dialogue.pages.join(''),/흙길은 포켓몬을 만나지 않는 길/);assert.match(game.dialogue.pages.join(''),/Lv\.3~6/);}
      else if(prop.dialogue.startsWith('gymCart')){
        const speakers:Record<string,string>={gymCartObserve:'광물 관찰대',gymCartLever:'탄차 분기 레버',gymCartLaunch:'탄차 출발 버튼'};
        assert.equal(game.dialogue.speaker,speakers[prop.dialogue]);
        assert.match(game.dialogue.pages.join(''),/받침/);
      }
      else assert.deepEqual(game.dialogue.pages,TEXT[prop.dialogue].pages);
    }
  }
}));
