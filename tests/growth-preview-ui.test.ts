import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {newSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
test('summary renders the growth goal and keeps the move-school touch target',()=>{
 const g=new Engine();g.save=newSave();grantPokemon(g.save,4);g.panel='summary';g.announce=()=>{};
 const words:Array<{text:string,x:number,y:number}>=[];
 const c=new Proxy({}, {get:(_,key)=>key==='fillText'?(text:string,x:number,y:number)=>words.push({text,x,y}):()=>{}}) as CanvasRenderingContext2D;
 const canvas={getContext:()=>c} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas),before=structuredClone(g.save);
 r.lower();assert(words.some(w=>w.text==='다음 기술 Lv.7 · 불꽃세례'&&w.y===96));assert(words.some(w=>w.text==='다음 레벨까지 50 EXP'));assert(words.some(w=>w.text==='할퀴기'));assert(words.some(w=>w.text==='울음소리'));
 r.click(210,150);assert.equal(g.dialogue!.speaker,'기술 배우기');assert.deepEqual(g.save,before);
});
