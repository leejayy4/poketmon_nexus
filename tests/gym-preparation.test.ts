import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { Renderer } from '../src/renderer';
import { GYMS,canChallenge,gymPreparation } from '../src/gyms';
import { newSave,parseSave } from '../src/save';
import { grantPokemon,SPECIES } from '../src/pokemon';

function ready(){const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.inventory.potions=2;return s}
function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function choices(g:Engine){for(let i=0;g.dialogue&&i<30;i++){const d=g.dialogue;if(d.page===d.pages.length-1&&d.shown>=d.pages[d.page].length)return;g.confirm()}assert.fail('missing challenge choices')}

test('preparation counts injured and available Pokemon without using fainted levels or changing a save',()=>{
  const s=ready();s.party[0].hp=1;s.party.push({...s.party[0],species:399,level:20,hp:0});const before=structuredClone(s),p=gymPreparation(s,'roark');
  assert.equal(p.available,1);assert.equal(p.total,2);assert.equal(p.injured,2);assert.equal(p.highestLevel,5);assert.equal(p.potions,2);assert.match(p.advice,/센터/);assert.equal(p.blocked,null);assert.deepEqual(s,before);
});

test('each gym explains the earliest missing badge, while levels and potion counts do not become gates',()=>{
  for(let i=0;i<GYMS.length;i++){
    const s=ready();s.inventory.potions=0;
    for(let j=0;j<i;j++){assert(!canChallenge(s,GYMS[i].id));assert.match(gymPreparation(s,GYMS[i].id).blocked!,new RegExp(GYMS[j].label));s.badges.push(GYMS[j].badge)}
    assert(canChallenge(s,GYMS[i].id));const p=gymPreparation(s,GYMS[i].id);assert.equal(p.recommendedLevel,GYMS[i].level);assert.match(p.advice,/지금 도전/);
  }
  const s=ready();s.party[0].level=8;s.inventory.potions=0;assert.match(gymPreparation(s,'roark').advice,/상처약/);s.inventory.potions=2;assert.match(gymPreparation(s,'roark').advice,/교대/);
});

test('free potion refill is only advised before the first badge',()=>{
  const s=ready();s.party[0].level=9;s.inventory.potions=0;
  assert.match(gymPreparation(s,'roark').advice,/센터에서 상처약/);
  s.badges.push(GYMS[0].badge);s.keyItems.push(GYMS[0].tm);s.party[0].level=10;
  assert.match(gymPreparation(s,'gardenia').advice,/마을 상점/);
  assert.doesNotMatch(gymPreparation(s,'gardenia').advice,/센터에서 상처약/);
});

test('blocked challenges tell the actual unmet requirement and never offer a battle',()=>dom(()=>{
  const g=new Engine();g.save=newSave();g.challengeGym('roark');assert.match(g.dialogue!.pages[0],/첫 파트너/);
  grantPokemon(g.save,7);g.save.party[0].hp=0;g.challengeGym('roark');assert.match(g.dialogue!.pages[0],/포켓몬센터/);
  g.save.party[0].hp=g.save.party[0].maxHp;g.challengeGym('roark');assert.match(g.dialogue!.pages[0],/도윤/);
  g.save.flags.departureCleared=true;g.challengeGym('gardenia');assert.match(g.dialogue!.pages[0],/콜배지/);
  assert.equal(g.dialogue!.choices,undefined);assert.equal(g.battle,null);assert.equal(g.gymPreview,null);
}));

test('cancel and touch preparation return preserve progression and dismiss the preview',()=>dom(()=>{
  const g=new Engine();g.save=ready();const before=structuredClone(g.save);g.challengeGym('roark');assert.equal(g.gymPreview,'roark');g.cancel();assert.equal(g.dialogue,null);assert.equal(g.gymPreview,null);
  g.challengeGym('roark');choices(g);const context=new Proxy({}, {get:()=>()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>context} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);r.lower();r.click(128,165);assert.equal(g.gymPreview,null);assert.equal(g.dialogue,null);assert.equal(g.battle,null);assert.deepEqual(g.save,before);
}));

test('preview draws the actual teams for every gym and confirms a low-level challenge with no upfront cost',()=>dom(()=>{
  for(let i=0;i<GYMS.length;i++){
    const g=new Engine();g.save=ready();g.save.badges=GYMS.slice(0,i).map(g=>g.badge);const before=structuredClone(g.save),words:string[]=[];
    const context=new Proxy({}, {get:(_,key)=>key==='fillText'?(s:string)=>words.push(s):()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>context} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);
    g.challengeGym(GYMS[i].id);choices(g);r.lower();for(const [species,level]of GYMS[i].team){assert(words.includes(SPECIES[species].name));assert(words.includes(`Lv.${level}`))}assert(words.includes('회복 필요 0마리 · 상처약 2개'));
    r.click(128,136);assert.equal(g.battle!.gymId,GYMS[i].id);assert.equal(g.battle!.enemy.species,GYMS[i].team[0][0]);assert.equal(g.gymPreview,null);assert(g.save.pokedex!.seen.includes(GYMS[i].team[0][0]));assert.deepEqual({...g.save,pokedex:before.pokedex},before);
  }
}));

test('restoring or replacing the dialogue clears the preview without granting rewards',()=>dom(()=>{
  const g=new Engine();g.save=ready();g.challengeGym('roark');g.say('안내',['다른 대화']);assert.equal(g.gymPreview,null);g.challengeGym('roark');const saved=parseSave(JSON.stringify(g.save))!;assert(saved);assert(!('gymPreview'in saved));g.restore(saved);assert.equal(g.gymPreview,null);assert.equal(g.dialogue,null);assert.equal(g.battle,null);assert.deepEqual(g.save.badges,[]);
  g.save.badges.push(GYMS[0].badge);g.challengeGym('roark');assert.equal(g.gymPreview,null);assert.equal(g.dialogue!.choices,undefined);
}));
