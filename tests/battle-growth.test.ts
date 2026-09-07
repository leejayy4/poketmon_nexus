import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {battleTurn} from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import {gainExperience,maxHpAtLevel,type GrowthStep} from '../src/growth';

function ready(){const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.party[0].experience=40;return s}
function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function finish(g:Engine){for(let i=0;i<100&&g.dialogue;i++)g.confirm();assert(!g.dialogue)}

test('experience and level pages show growth in order instead of revealing the final level early',()=>{
  const s=ready(),b=createBattle(s)!;b.enemy.hp=1;const turn=battleTurn(s,b,'move0'),frames=turn.frames!;
  assert.equal(frames[2].player.level,5);assert.equal(frames[2].player.experience,40);
  const growth=frames.filter(f=>f.growth);
  assert.deepEqual(growth.map(f=>[f.growth!.kind,f.player.level,f.player.experience,f.player.maxHp]),[['experience',5,70,20],['level',6,20,23]]);
  assert.deepEqual(s.party[0],growth[1].player);assert.equal(frames.at(-1)!.growth,undefined);
  s.party[0].hp=1;assert.equal(growth[1].growth!.after.hp,23);assert.equal(growth[1].player.hp,23);
});

test('shared experience follows individual participants and reserve growth never replaces the active battler',()=>{
  const s=ready();for(let i=1;i<4;i++)s.party.push({species:399,level:3,hp:i===2?0:14,maxHp:18,experience:20,nature:'성실',met:'새잎 서쪽길'});
  const before=structuredClone(s.party),b=createBattle(s)!;b.active=1;b.participants=[0,1,1,2];b.enemy.hp=1;
  const turn=battleTurn(s,b,'move0'),growth=turn.frames!.filter(f=>f.growth);
  assert.deepEqual(growth.map(f=>[f.growth!.index,f.growth!.kind,f.growth!.amount]),[[0,'experience',15],[0,'level',15],[1,'experience',15],[1,'level',15]]);
  assert(growth.every(f=>f.active===1&&f.player.species===399));assert.equal(growth[1].player.level,3);assert.equal(growth[3].player.level,4);
  assert.equal(growth[1].growth!.after.species,7);assert.deepEqual(s.party.slice(2),before.slice(2));assert.equal(b.active,1);
});

test('multiple levels and the cap have distinct detached steps and preserve the existing growth result',()=>{
  const p=ready().party[0],steps:GrowthStep[]=[];const pages=gainExperience(p,140,(_page,step)=>steps.push(step));
  assert.equal(pages.length,5);assert(steps.some(s=>s.kind==='move'));assert.deepEqual(steps.filter(s=>s.kind!=='move').map(s=>s.after.level),[5,6,7,8]);assert.equal(p.experience,0);
  assert.deepEqual(steps.filter(s=>s.kind==='level').map(s=>s.after.maxHp-s.before.maxHp),[3,3,3]);
  p.level=24;p.maxHp=maxHpAtLevel(7,24);p.hp=p.maxHp;p.experience=230;steps.length=0;
  gainExperience(p,30,(_page,step)=>steps.push(step));assert.equal(steps.at(-1)!.after.level,25);assert.equal(steps.at(-1)!.after.experience,0);
  assert.deepEqual(gainExperience(p,80,()=>assert.fail('capped Pokemon should not gain again')),[]);
});

test('growth card identifies a reserve recipient while the upper battlefield retains the active Pokemon',()=>dom(()=>{
  const g=new Engine();g.save=ready();g.save.party.push({species:399,level:3,hp:14,maxHp:18,experience:20,nature:'성실',met:'새잎 서쪽길'});g.battle=createBattle(g.save)!;g.battle.active=1;g.battle.participants=[0,1];g.battle.enemy.hp=1;g.actBattle('move0');
  const words:string[]=[],ctx=new Proxy({}, {get:(_,k)=>k==='fillText'?(s:string)=>words.push(s):()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>ctx} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);
  g.dialogue!.page=g.battleFrames!.findIndex(f=>f.growth?.kind==='level');r.lower();
  assert(words.includes('레벨 업!'));assert(words.includes('꼬부기'));assert(words.includes('파티 1'));assert(words.includes('Lv.5 → Lv.6'));assert(words.includes('최대 HP +3'));assert(!words.includes('싸운다'));
  words.length=0;r.battleTop(ctx);assert(words.includes('비버니'));assert(!words.includes('꼬부기'));
  const before=structuredClone(g.save);r.click(128,166);finish(g);assert.deepEqual(g.save,before);assert.equal(g.battleFrame,null);
}));

test('gym growth completes before the next opponent and before a final badge reward',()=>dom(()=>{
  for(const last of [false,true]){const g=new Engine();g.save=ready();g.battle=createBattle(g.save,'gym')!;if(last){g.battle.enemyIndex=2;g.battle.enemy=g.battle.opponents[2]}g.battle.enemy.hp=1;g.actBattle('move0');
    const frames=g.battleFrames!,lastGrowth=frames.findLastIndex(f=>!!f.growth);assert(lastGrowth>=0);assert.equal(frames[lastGrowth+1].growth,undefined);
    if(last){assert(g.gymReward!.page>lastGrowth);g.dialogue!.page=g.gymReward!.page;assert(g.showingGymReward)}else{assert.equal(frames[lastGrowth].enemyIndex,0);assert.equal(frames[lastGrowth+1].enemyIndex,1)}
  }
}));

test('reload during growth retains final XP exactly once and clears presentation; no growth on escape or capture',()=>dom(()=>{
  const g=new Engine();g.save=ready();g.battle=createBattle(g.save)!;g.battle.enemy.hp=1;g.actBattle('move0');g.dialogue!.page=g.battleFrames!.findIndex(f=>!!f.growth);
  const saved=parseSave(JSON.stringify(g.save))!;assert(saved);assert.equal(saved.party[0].level,6);assert.equal(saved.party[0].experience,20);
  g.restore(saved);assert.equal(g.battleFrame,null);finish(g);assert.deepEqual(g.save.party,saved.party);
  for(const action of ['run','ball'] as const){const s=ready();s.inventory.pokeBalls=1;const b=createBattle(s)!;b.enemy.hp=1;const turn=battleTurn(s,b,action);assert(!turn.frames?.some(f=>f.growth));assert.equal(s.party[0].experience,40)}
}));
