import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {createBattle,battleTurn} from '../src/battle';
import {battleEffect} from '../src/battle-effect';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';

function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function game(){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.inventory.potions=2;g.battle=createBattle(g.save);return g}
function next(g:Engine){const d=g.dialogue!;if(d.shown<d.pages[d.page].length)g.confirm();g.confirm()}
function finish(g:Engine){for(let i=0;i<80&&g.dialogue;i++)g.confirm();assert.equal(g.dialogue,null)}

test('attack damage and counterattack carry separate visual targets on the matching pages',()=>{
  const g=game(),turn=battleTurn(g.save,g.battle!,'move0');
  assert(!turn.frames![0].effect);assert.deepEqual(turn.frames![1].effect,{target:'enemy',kind:'damage',amount:6});assert.deepEqual(turn.frames!.at(-1)!.effect,{target:'player',kind:'damage',amount:4});
  const saved=structuredClone(g.save),frames=structuredClone(turn.frames);for(const elapsed of [0,.15,.59,.6,1])battleEffect(turn.frames![1],elapsed);assert.deepEqual(g.save,saved);assert.deepEqual(turn.frames,frames);
});

test('healing uses the actual recovered HP and never puts a reserve heal effect on the active Pokemon',()=>{
  for(const reserve of [false,true]){const g=game();g.save.party[0].hp=17;if(reserve)g.save.party.push({...g.save.party[0],hp:19});const turn=battleTurn(g.save,g.battle!,{potion:reserve?1:0});assert.deepEqual(turn.frames![0].effect,reserve?undefined:{target:'player',kind:'heal',amount:3});assert.equal(turn.frames!.at(-1)!.effect?.kind,'damage');assert.equal(g.save.inventory.potions,1);}
});

test('page effects expire independently of text speed and revealing text does not replay an effect',()=>dom(()=>{
  for(const speed of [36,80]){const g=game();g.textSpeed=speed;g.actBattle('move0');next(g);assert.equal(g.battleEffect?.target,'enemy');for(let i=0;i<4;i++)g.update(.05);const elapsed=g.dialogueElapsed;g.confirm();assert.equal(g.dialogueElapsed,elapsed);for(let i=0;i<10;i++)g.update(.05);assert.equal(g.battleEffect,null);next(g);assert.equal(g.battleEffect,null);next(g);assert.equal(g.battleEffect?.target,'player');assert.equal(g.dialogueElapsed,0);}
}));

test('fast forwarding, replacement dialogue and reload drop effects without repeating damage or items',()=>dom(()=>{
  for(const end of ['finish','say','reload']){const g=game();g.actBattle('move0');next(g);const saved=parseSave(JSON.stringify(g.save))!;assert(saved);assert(!('dialogueElapsed'in saved));if(end==='finish')finish(g);else if(end==='say')g.say('안내',['안녕']);else g.restore(saved);assert.equal(g.battleEffect,null);assert.deepEqual(g.save.party,saved.party);assert.equal(g.save.inventory.potions,saved.inventory.potions);}
}));

test('knockout, next opponent and appended reward pages do not replay the final hit',()=>dom(()=>{
  const g=game();g.battle=createBattle(g.save,'gym');g.battle!.enemy.hp=1;g.actBattle('move0');next(g);assert.equal(g.battleEffect?.target,'enemy');next(g);assert.equal(g.battleEffect,null);finish(g);assert.equal(g.battle?.enemyIndex,1);assert.equal(g.battleEffect,null);
  g.battle!.enemyIndex=2;g.battle!.enemy=g.battle!.opponents[2];g.battle!.enemy.hp=1;g.actBattle('move0');while(g.dialogue!.page<g.gymReward!.page)next(g);assert(g.showingGymReward);assert.equal(g.battleEffect,null);
}));

test('renderer draws a short damage label and displaced sprite, then restores the original pose',()=>dom(()=>{
  const g=game();g.actBattle('move0');next(g);g.update(.05);const words:string[]=[],drawn:unknown[][]=[];
  const ctx=new Proxy({}, {get:(_,key)=>key==='fillText'?(text:string)=>words.push(text):key==='drawImage'?(...args:unknown[])=>drawn.push(args):()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>ctx} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);
  const enemy={id:399} as unknown as HTMLImageElement;r.images['pokemon-399']=enemy;r.battleTop(ctx);assert(words.includes('−6'));assert.notEqual(drawn.find(a=>a[0]===enemy)![1],155);
  for(let i=0;i<14;i++)g.update(.05);words.length=0;drawn.length=0;r.battleTop(ctx);assert(!words.includes('−6'));assert.equal(drawn.find(a=>a[0]===enemy)![1],155);
}));

test('rejected actions and non-finite or expired clocks produce no effect',()=>dom(()=>{
  const g=game();g.actBattle('potion');assert.equal(g.battleEffect,null);assert.equal(g.battleFrames,null);finish(g);g.actBattle('move0');next(g);for(const elapsed of [-1,NaN,Infinity,.6,100])assert.equal(battleEffect(g.battleFrame,elapsed),null);assert.equal(battleEffect(null,0),null);
}));
