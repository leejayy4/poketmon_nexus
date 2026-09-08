import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine, VECTOR } from '../src/engine';
import { newSave, parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
import { getMap, canStand } from '../src/maps';
import { trainerWinFlag } from '../src/road-trainers';
import { awardGym, canChallenge } from '../src/gyms';
import { GYM_ROCKS } from '../src/badge-maps';
import { TOWN_REVISION } from '../src/town';

const trainees=[
  {event:'gymTypeTrainer',id:'oreburgh-gym-types',reward:200,team:[74]},
  {event:'gymSwitchTrainer',id:'oreburgh-gym-switch',reward:320,team:[95,396]},
];
function dom(run:()=>void){const old=globalThis.document;globalThis.document={getElementById:()=>null} as unknown as Document;try{run();}finally{globalThis.document=old;}}
function game(){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.map='oreburgh_gym';g.save.player={x:8,y:13,facing:'up'};g.persist=()=>true;g.random=()=>0;return g;}
function choose(g:Engine,label:string){const c=g.dialogue?.choices?.find(c=>c.label===label);assert(c,label);g.dialogue=null;c.action();}
function finish(g:Engine){for(let i=0;i<500&&g.dialogue;i++){if(g.dialogue.choices){choose(g,g.dialogue.choices.at(-1)!.label);continue;}g.dialogue.shown=999;if(g.battlePresentation&&!g.battlePresentation.canAdvance)g.update(.05);else g.confirm();}assert.equal(g.dialogue,null);}
function start(g:Engine,event:string){g.event(event);choose(g,'배틀한다');finish(g);assert.equal(g.battle?.kind,'trainer');}

test('gym practice is off the direct leader route and every remaining floor and interaction stays reachable',()=>{
  const map=getMap('oreburgh_gym'),q=[[8,13]],seen=new Set<string>();
  for(let i=0;i<q.length;i++){const[x,y]=q[i],key=`${x},${y}`;if(seen.has(key)||!canStand(map,x,y))continue;seen.add(key);for(const v of Object.values(VECTOR))q.push([x+v.x,y+v.y]);}
  for(let y=5;y<=15;y++)assert(canStand(map,8,y),`direct route ${y}`);
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(canStand(map,x,y))assert(seen.has(`${x},${y}`),`floor ${x},${y}`);
  for(const npc of map.npcs)assert(Object.values(VECTOR).some(v=>seen.has(`${npc.x+v.x},${npc.y+v.y}`)),npc.id);
  for(const [x,y,w,h] of GYM_ROCKS)for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++)assert(!canStand(map,a,b));
  for(const warp of map.warps)assert(canStand(getMap(warp.to),warp.spawn.x,warp.spawn.y));
  assert(canChallenge(game().save,'roark'));
});

test('revision 23 saves on new NPC tiles migrate safely without losing party or progress',()=>{
  const map=getMap('oreburgh_gym');
  for(const trainee of trainees){const g=game(),npc=map.npcs.find(n=>n.id===trainee.event)!;g.save.worldRevision=23;g.save.player={x:npc.x,y:npc.y,facing:'left'};g.save.money=725;g.save.flags.cityOreburghReadyRewarded=true;const before=structuredClone(g.save),restored=parseSave(JSON.stringify(g.save));assert(restored);assert.equal(restored.worldRevision,TOWN_REVISION);assert.deepEqual(restored.player,{x:8,y:13,facing:'down'});assert.deepEqual(restored.party,before.party);assert.deepEqual(restored.flags,before.flags);assert.equal(restored.money,725);assert.equal(restored.map,'oreburgh_gym');}
  const g=game();g.save.worldRevision=23;g.save.player={x:8,y:5,facing:'up'};assert.deepEqual(parseSave(JSON.stringify(g.save))?.player,g.save.player);
});

test('gym trainers offer optional advice without cave directions, and stale or repeated choices cannot replace battle',()=>dom(()=>{
  for(const trainee of trainees){const g=game(),before=structuredClone(g.save);g.event(trainee.event);choose(g,'다음에 한다');assert.deepEqual(g.save,before);assert.equal(g.battle,null);g.event(trainee.event);choose(g,'도움말을 듣는다');assert.doesNotMatch(g.dialogue!.pages.join(''),/남쪽 자갈밭|밝은 통로/);assert.match(g.dialogue!.pages.join(''),trainee.team.length===1?/네 기술/:/교대/);finish(g);g.event(trainee.event);const stale=g.dialogue!.choices![0].action;g.save=structuredClone(g.save);stale();assert.equal(g.battle,null);g.event(trainee.event);const again=g.dialogue!.choices![0].action;choose(g,'배틀한다');const battle=g.battle;again();assert.equal(g.battle,battle);assert.deepEqual(g.battle!.opponents.map(p=>p.species),trainee.team);}
}));

test('both gym practices can be stopped and lost without victory flags or money, then retried',()=>dom(()=>{
  for(const trainee of trainees){const g=game();start(g,trainee.event);g.requestBattleExit();choose(g,'계속 싸운다');assert(g.battle);g.requestBattleExit();choose(g,'도전을 중단한다');finish(g);assert.equal(g.battle,null);assert.equal(g.save.money,0);assert(!g.save.flags[trainerWinFlag(trainee.id)]);start(g,trainee.event);g.save.party[0].hp=1;g.actBattle('move1');finish(g);assert.equal(g.battle,null);assert.equal(g.save.money,0);assert(!g.save.flags[trainerWinFlag(trainee.id)]);assert(g.save.party[0].hp>0);g.save.map='oreburgh_gym';g.save.player={x:8,y:13,facing:'up'};start(g,trainee.event);assert.equal(g.battle!.enemyIndex,0);}
}));

test('gym practice victory pays once across reload and acknowledges the first badge',()=>dom(()=>{
  for(const trainee of trainees){const g=game(),p=g.save.party[0];p.level=15;p.hp=p.maxHp=maxHpAtLevel(p.species,15);p.moves=['몸통박치기','꼬리흔들기','거품','물대포'];start(g,trainee.event);for(let i=0;i<30&&g.battle;i++){g.actBattle('move3');finish(g);}assert.equal(g.battle,null);assert.equal(g.save.money,trainee.reward);assert.equal(g.save.flags[trainerWinFlag(trainee.id)],true);const saved=parseSave(JSON.stringify(g.save));assert(saved);g.restore(saved);g.event(trainee.event);assert.equal(g.dialogue!.choices,undefined);assert.equal(g.save.money,trainee.reward);finish(g);assert(awardGym(g.save,'roark'));const before=structuredClone(g.save);g.event(trainee.event);assert.match(g.dialogue!.pages[0],/콜배지/);assert.deepEqual(g.save,before);}
}));
