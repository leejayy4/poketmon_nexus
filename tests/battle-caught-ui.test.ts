import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {newSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {createBattle} from './runtime-battle-fixture';

test('wild caught badge and text follow the battle snapshot without changing controls or save',()=>{
 const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
 try{for(const kind of ['wild','gym'] as const)for(const caught of [false,true]){
  const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.battle=createBattle(g.save,kind)!;g.battle.caughtBeforeBattle=caught;
  const words:string[]=[],balls:number[][]=[];const c=new Proxy({},{get:(_,key)=>key==='fillText'?(s:string)=>words.push(s):()=>{}}) as CanvasRenderingContext2D;
  const canvas={getContext:()=>c} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);r.ball=(_c,x,y,size)=>{balls.push([x,y,size??5]);};const save=structuredClone(g.save);
  r.battleTop(c);assert.equal(balls.some(([x,y,size])=>x===87&&y===28&&size===3),kind==='wild'&&caught);
  r.lower();assert.equal(words.some(w=>w.includes('포획 기록 있음')),kind==='wild'&&caught);assert.equal(words.some(w=>w.includes('미포획')),kind==='wild'&&!caught);
  assert.equal(r.hits.filter(h=>h.y===54).length,2);assert.deepEqual(g.save,save);
 }}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}
});
