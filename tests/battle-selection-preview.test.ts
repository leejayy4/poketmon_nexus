import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {createBattle} from '../src/battle';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function game(){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.inventory.potions=2;for(let i=1;i<6;i++)g.save.party.push({species:399,level:3,hp:i===1?2:i===2?0:18,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});g.battle=createBattle(g.save);g.battle!.menu='party';return g}
function renderer(g:Engine){const words:string[]=[],ctx=new Proxy({}, {get:(_,key)=>key==='fillText'?(s:string)=>words.push(s):()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>ctx} as HTMLCanvasElement;return {words,r:new Renderer(g,canvas,canvas)}}
function finish(g:Engine){for(let i=0;i<90&&g.dialogue;i++)g.confirm();assert(!g.dialogue)}
test('six party slots show the selected Pokemon and HP without changing the party or active battler',()=>{
  const g=game(),{r,words}=renderer(g),before=structuredClone(g.save);for(let i=0;i<6;i++){g.battle!.selected=i;words.length=0;r.world();assert(words.includes(`${i+1}/6`));assert(words.includes(i===0?'꼬부기':'비버니'));assert(words.includes(`HP ${g.save.party[i].hp} / ${g.save.party[i].maxHp}`));assert(words.includes(i===0?'물':'노말'));assert(words.some(w=>w.includes('몸통박치기')));}assert.equal(g.battle!.active,0);assert.deepEqual(g.save,before);
});
test('preview exposes lethal normal-switch risk and distinguishes free and forced replacements',()=>dom(()=>{
  for(const mode of ['normal','free','forced']){const g=game();g.battle!.selected=1;if(mode==='free')g.battle!.betweenOpponents=true;if(mode==='forced'){g.save.party[0].hp=0;g.battle!.forcedSwitch=true;}const {r,words}=renderer(g);r.world();assert(words.some(w=>w.includes(mode==='normal'?'반격 후 기절':'반격 없이')));r.lower();r.click(190,49);assert.equal(g.battle!.active,1);assert.equal(g.battle!.forcedSwitch,mode==='normal');assert.equal(g.save.party[1].hp,mode==='normal'?0:2);assert.equal(g.save.inventory.potions,2);}
}));
test('reserve medicine preview and touch use agree while only the active Pokemon takes the counter',()=>dom(()=>{
  const g=game();g.battle!.menu='heal';g.battle!.selected=1;const {r,words}=renderer(g);r.world();assert(words.includes('상처약을 사용할 포켓몬'));assert(words.includes('비버니 HP 2 → 18'));assert(words.includes('꼬부기: 반격 후 HP 16/20'));r.lower();r.click(190,49);assert.equal(g.save.party[1].hp,18);assert.equal(g.save.party[0].hp,16);assert.equal(g.save.inventory.potions,1);words.length=0;r.world();assert(!words.includes('상처약을 사용할 포켓몬'));finish(g);assert.equal(g.battle!.menu,'actions');
}));
test('fainted and full-health healing previews explain rejection without consuming a turn',()=>dom(()=>{
  for(const index of [0,2]){const g=game();g.battle!.menu='heal';g.battle!.selected=index;const before=structuredClone(g.save),{r,words}=renderer(g);r.world();assert(words.some(w=>w.includes(index===0?'HP가 가득':'쓰러진 포켓몬은 회복 불가')));g.selectBattle();assert.deepEqual(g.save,before);finish(g);assert.equal(g.battle!.menu,'heal');assert.equal(g.battle!.selected,index);}
}));
test('cancel and reload close previews without changing selected Pokemon order, HP or items',()=>dom(()=>{
  const g=game();g.battle!.selected=5;const before=structuredClone(g.save),{r,words}=renderer(g);r.world();g.cancel();words.length=0;r.world();assert(!words.includes('교대할 포켓몬'));assert.equal(g.battle!.menu,'actions');assert.deepEqual(g.save,before);g.battle!.menu='heal';g.restore(parseSave(JSON.stringify(g.save))!);assert.equal(g.battle,null);assert.deepEqual(g.save.party,before.party);assert.deepEqual(g.save.inventory,before.inventory);
}));
