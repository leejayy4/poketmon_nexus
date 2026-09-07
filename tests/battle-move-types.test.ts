import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { Renderer } from '../src/renderer';
import {moveType } from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import { grantPokemon } from '../src/pokemon';

function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function renderer(){const g=new Engine();grantPokemon(g.save,25);g.save.flags.departureCleared=true;g.battle=createBattle(g.save)!;g.battle.menu='moves';const words:string[]=[],fills:string[]=[],target:{fillStyle:string}={fillStyle:''};const context=new Proxy(target, {get:(state,key)=>key==='fillText'?(s:string)=>words.push(s):key==='fillRect'?()=>fills.push(state.fillStyle):()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>context} as HTMLCanvasElement;return {g,words,fills,r:new Renderer(g,canvas,canvas)};}

test('battle move menu shows the current move type in the unchanged touch buttons',()=>dom(()=>{
  const {g,words,fills,r}=renderer();r.lower();assert.equal(moveType('전기쇼크'),'전기');assert.equal(moveType('울음소리'),'노말');assert(words.includes('전기쇼크'));assert(words.includes('울음소리'));assert(words.includes('전기'));assert(words.includes('노말'));assert(fills.includes('#bba149'));assert(fills.includes('#9b9983'));assert.equal(r.hits.filter(hit=>hit.y===54).length,2);r.click(65,74);assert.equal(g.battle!.selected,0);assert.equal(g.battle!.menu,'actions');assert(g.dialogue);
}));
