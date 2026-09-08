import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {grantPokemon,pokemonMoves} from '../src/pokemon';
import {createBattle} from './runtime-battle-fixture';

function fixture(){
  const g=new Engine();grantPokemon(g.save,4);const p=g.save.party[0];p.level=17;p.moves=['할퀴기','울음소리','불꽃세례','용의분노'];
  const words:{text:string;x:number;y:number}[]=[];
  const context=new Proxy({}, {get:(_,key)=>key==='fillText'?(text:string,x:number,y:number)=>words.push({text,x,y}):()=>{}}) as CanvasRenderingContext2D;
  const canvas={getContext:()=>context} as HTMLCanvasElement;
  return {g,p,words,context,r:new Renderer(g,canvas,canvas)};
}
const intersects=(a:{x:number;y:number;w:number;h:number},b:{x:number;y:number;w:number;h:number})=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;

test('all four battle move targets stay visible above hints and cancel, and fourth touch selects slot 4',()=>{
  const {g,p,r,words}=fixture();g.battle=createBattle(g.save)!;g.battle.menu='moves';r.lower();
  assert.equal(pokemonMoves(p).length,4);assert(pokemonMoves(p).every(move=>words.some(w=>w.text===move)));
  const targets=r.hits.filter(h=>h.w===116);assert.equal(targets.length,4);
  const cancel=r.hits.at(-1)!;const hints={x:8,y:128,w:240,h:33};
  for(const hit of targets){assert(!intersects(hit,hints));assert(!intersects(hit,cancel));assert(hit.y+hit.h<=192);}
  for(let i=0;i<targets.length;i++)for(let j=i+1;j<targets.length;j++)assert(!intersects(targets[i],targets[j]));
  let selected=-1;g.selectBattle=()=>{selected=g.battle!.selected;};const fourth=targets[3];r.click(fourth.x+50,fourth.y+16);assert.equal(selected,3);
});

test('four remembered moves fit above growth and party actions in summary',()=>{
  const {g,p,r,words}=fixture();g.panel='summary';r.lower();
  const labels=pokemonMoves(p).map(move=>words.find(w=>w.text===move)!);assert(labels.every(Boolean));
  assert(labels.every(label=>label.x>=8&&label.x<248&&label.y>=32&&label.y+9<96));
  assert.equal(new Set(labels.map(label=>label.y)).size,2);assert.equal(new Set(labels.map(label=>label.x)).size,2);
});

test('battle party preview puts four remembered moves on two readable lines above the preview box',()=>{
  const {g,p,r,words,context}=fixture();g.battle=createBattle(g.save)!;g.battle.menu='party';r.battleSelectionTop(context);
  const moves=pokemonMoves(p);for(let i=0;i<2;i++){const line=words.find(w=>w.text===moves.slice(i*2,i*2+2).join(' · '));assert(line);assert(line.y+8<139);}
});
