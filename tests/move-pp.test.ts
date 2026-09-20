import test from 'node:test';
import assert from 'node:assert/strict';
import { newSave,parseSave } from '../src/save';
import { encodeSave } from '../src/save-library';
import { grantPokemon,pokemonMoves,teachMove,validPokemonMoves,MOVE_RULES } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
import { createBattle,createTrainerBattle,battleTurn,type BattleAction } from '../src/battle';
import { battleHint } from '../src/battle-hints';
import { STRUGGLE,anyUsablePp,currentPp,maxPp,ppOf,restorePp,spendPp,unlimitedPp,usablePp,validPokemonPp } from '../src/move-pp';
import { moveTechniqueStyle,type MoveStyle } from '../src/move-art';
import { GameAudio } from '../src/audio';
import { RUNTIME_MOVE_DATA } from '../src/data/runtime';

function charmander(){
  const s=newSave();grantPokemon(s,4);
  const p=s.party[0];p.level=16;p.hp=p.maxHp=maxHpAtLevel(4,16);
  s.flags.departureCleared=true;s.map='route_s01';s.player={x:29,y:12,facing:'left'};
  return s;
}

test('every exported move carries a positive PP and Struggle stays unlimited', () => {
  for(const [name,data] of Object.entries(RUNTIME_MOVE_DATA)){
    assert.equal(typeof data.pp,'number',name);
    assert(Number.isInteger(data.pp)&&data.pp>0,`${name} pp=${data.pp}`);
  }
  assert(unlimitedPp(STRUGGLE));
  assert.equal(maxPp(STRUGGLE),0,'the unlimited fallback carries no counter');
  assert.equal(maxPp('몸통박치기'),RUNTIME_MOVE_DATA['몸통박치기'].pp);
});

test('a move with no data has no PP and never reports as usable through a real party', () => {
  assert.equal(maxPp('존재하지않는기술'),0);
  const s=charmander();const p=s.party[0];p.moves=['할퀴기'];
  assert(usablePp(p,pokemonMoves(p),0));
  assert(!usablePp(p,pokemonMoves(p),1),'an empty slot is not usable');
});

test('spending PP counts down per use, stops at zero and leaves other slots alone', () => {
  const s=charmander();const p=s.party[0];p.moves=['할퀴기','울음소리'];
  const moves=pokemonMoves(p),max=maxPp('할퀴기');
  assert.deepEqual(currentPp(p,moves),[max,maxPp('울음소리')]);
  spendPp(p,moves,0);
  assert.equal(ppOf(p,moves,0),max-1);
  assert.equal(ppOf(p,moves,1),maxPp('울음소리'),'the untouched slot keeps its PP');
  for(let i=0;i<max;i++)spendPp(p,moves,0);
  assert.equal(ppOf(p,moves,0),0,'PP never goes below zero');
  assert(!usablePp(p,moves,0));
  assert(anyUsablePp(p,moves),'the second move can still act');
});

test('Struggle never spends PP', () => {
  const s=charmander();const p=s.party[0];p.moves=[STRUGGLE];
  const moves=pokemonMoves(p);
  for(let i=0;i<5;i++)spendPp(p,moves,0);
  assert.equal(ppOf(p,moves,0),0);
  assert(usablePp(p,moves,0),'the fallback is always selectable');
  assert(anyUsablePp(p,moves));
});

test('restoring PP refills every slot to its own maximum', () => {
  const s=charmander();const p=s.party[0];p.moves=['할퀴기','울음소리'];
  const moves=pokemonMoves(p);
  spendPp(p,moves,0);spendPp(p,moves,1);
  restorePp(p,moves);
  assert.deepEqual(currentPp(p,moves),[maxPp('할퀴기'),maxPp('울음소리')]);
});

test('a battle move spends PP once per use', () => {
  const s=charmander();const p=s.party[0];p.moves=['할퀴기','울음소리'];
  const before=maxPp('할퀴기');
  const b=createBattle(s,'wild','roark',()=>0);
  assert(b,'a wild encounter is available on the west road');
  battleTurn(s,b,'move0' as BattleAction,()=>0.5);
  assert.equal(ppOf(p,pokemonMoves(p),0),before-1);
});

test('PP is kept when the companion faints before acting', () => {
  // A much faster opponent acts first and the lead is one hit from fainting, so
  // the selected move never reaches the field and must not be charged.
  const s=newSave();grantPokemon(s,4);const p=s.party[0];p.moves=['할퀴기','울음소리'];
  const full=maxPp('할퀴기');
  const b=createTrainerBattle(s,{id:'pp-timing',name:'속공 상대',reward:0,
    team:[{species:41,level:25,hp:60,maxHp:60,experience:0,nature:'성실',met:'검사'}]});
  assert(b);
  p.hp=1;
  battleTurn(s,b,'move0' as BattleAction,()=>0.5);
  assert.equal(p.hp,0,'the lead fainted before acting');
  assert.equal(ppOf(p,pokemonMoves(p),0),full,'an unused move keeps its PP');
});

test('an empty move is refused while another move can still act, without spending a turn', () => {
  const s=charmander();const p=s.party[0];p.moves=['할퀴기','울음소리'];
  const moves=pokemonMoves(p);
  p.pp=[0,maxPp('울음소리')];
  const b=createBattle(s,'wild','roark',()=>0);
  assert(b);
  const enemyHp=b.enemy.hp;
  const result=battleTurn(s,b,'move0' as BattleAction,()=>0.5);
  assert.equal(result.retry,true,'the turn is offered again');
  assert.match(result.pages.join('\n'),/PP/);
  assert.equal(b.enemy.hp,enemyHp,'no damage was dealt');
  assert.equal(ppOf(p,moves,1),maxPp('울음소리'),'the usable move was not charged');
});

test('a fully empty moveset falls back to Struggle instead of soft-locking', () => {
  const s=charmander();const p=s.party[0];p.moves=['할퀴기','울음소리'];
  p.pp=[0,0];
  const moves=pokemonMoves(p);
  assert(!anyUsablePp(p,moves));
  const b=createBattle(s,'wild','roark',()=>0);
  assert(b);
  const result=battleTurn(s,b,'move0' as BattleAction,()=>0.5);
  assert.notEqual(result.retry,true,'the turn resolves');
  const text=result.pages.join('\n');
  assert.match(text,/쓸 수 있는 기술이 없다/);
  assert.match(text,new RegExp(STRUGGLE));
  assert(p.hp<p.maxHp,'Struggle recoil still applies');
});

test('the hint panel explains an empty move and the Struggle fallback', () => {
  const s=charmander();const p=s.party[0];p.moves=['할퀴기','울음소리'];
  const b=createBattle(s,'wild','roark',()=>0);
  assert(b);
  b.menu='moves';b.selected=0;
  p.pp=[0,maxPp('울음소리')];
  assert.match(battleHint(s,b).join('\n'),/PP가 남아 있지 않습니다/);
  p.pp=[0,0];
  assert.match(battleHint(s,b).join('\n'),/발버둥/);
});

test('learning a replacement move gives that slot full PP', () => {
  const s=charmander();const p=s.party[0];p.moves=['할퀴기','울음소리'];
  const moves=pokemonMoves(p);
  p.pp=[1,1];
  assert(teachMove(s,0,'불꽃세례',2));
  const after=pokemonMoves(p);
  assert.equal(ppOf(p,after,2),maxPp('불꽃세례'));
  assert.equal(ppOf(p,after,0),1,'existing slots keep their remaining PP');
  assert.equal(moves.length,2);
});

test('an appended level-up move starts at full PP without a stored entry', () => {
  const s=charmander();const p=s.party[0];p.moves=['할퀴기'];p.pp=[3];
  p.moves=[...p.moves,'용의분노'];
  const moves=pokemonMoves(p);
  assert.equal(ppOf(p,moves,0),3);
  assert.equal(ppOf(p,moves,1),maxPp('용의분노'),'a missing entry reads as full');
});

test('saved PP survives a save round trip and rejects impossible counters', () => {
  const s=charmander();const p=s.party[0];p.moves=['할퀴기','울음소리'];
  p.pp=[2,maxPp('울음소리')];
  const reloaded=parseSave(JSON.stringify(JSON.parse(encodeSave(s)).save));
  assert(reloaded,'the save parses');
  assert.deepEqual(reloaded.party[0].pp,[2,maxPp('울음소리')]);

  assert(validPokemonPp(p,pokemonMoves(p)));
  assert(!validPokemonPp({...p,pp:[-1,0]},pokemonMoves(p)),'negative');
  assert(!validPokemonPp({...p,pp:[1.5,0]},pokemonMoves(p)),'fractional');
  assert(!validPokemonPp({...p,pp:[1,1,1,1,1]},pokemonMoves(p)),'longer than the move capacity');
  assert(validPokemonPp({...p,pp:undefined},pokemonMoves(p)),'a save written before PP existed stays valid');
  assert(!validPokemonMoves({...p,pp:[999,999]},[]),'above every move in the roster');
});

test('a counter above its move maximum is read down instead of invalidating the save', () => {
  // Replacing a move can leave a larger counter in that slot. The read clamps it,
  // so no extra uses are granted and the whole file is still accepted.
  const s=charmander();const p=s.party[0];
  p.moves=['용의분노','할퀴기'];p.pp=[maxPp('할퀴기'),maxPp('할퀴기')];
  const moves=pokemonMoves(p);
  assert(maxPp('할퀴기')>maxPp('용의분노'),'the stale counter really is larger');
  assert(validPokemonPp(p,moves));
  assert.equal(ppOf(p,moves,0),maxPp('용의분노'),'clamped to the move that is there now');

  // A shorter move list leaves trailing counters unread.
  const shrunk={...p,moves:['할퀴기'],pp:[1,maxPp('울음소리'),1,1]};
  assert(validPokemonPp(shrunk,pokemonMoves(shrunk)));
  assert.deepEqual(currentPp(shrunk,pokemonMoves(shrunk)),[1],'only the current moves are read');
});

test('a save written before PP existed loads with full PP', () => {
  const s=charmander();const p=s.party[0];p.moves=['할퀴기','울음소리'];
  const raw=JSON.parse(encodeSave(s));
  delete raw.save.party[0].pp;
  const reloaded=parseSave(JSON.stringify(raw.save));
  assert(reloaded);
  const loaded=reloaded.party[0];
  assert.deepEqual(currentPp(loaded,pokemonMoves(loaded)),[maxPp('할퀴기'),maxPp('울음소리')]);
});

// A missing `ice` entry crashed Ice Shard inside playMove while every audio test
// passed, so drive the real sound path once for every exported move.
test('playMove resolves a sound for every exported move and style', t => {
  class Param {
    setValueAtTime(){}linearRampToValueAtTime(){}exponentialRampToValueAtTime(){}
  }
  class Osc {
    type='sine';frequency=new Param();onended:(()=>void)|null=null;
    connect<T>(node:T){return node;}disconnect(){}start(){}stop(){}
  }
  class Gain {gain=new Param();connect<T>(node:T){return node;}disconnect(){}}
  class Context {
    state='running';currentTime=10;destination={};resume(){return Promise.resolve();}
    createOscillator(){return new Osc();}createGain(){return new Gain();}
  }
  const keys=['AudioContext','setInterval','clearInterval','document'] as const;
  const originals=new Map(keys.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
  Object.defineProperties(globalThis,{
    AudioContext:{configurable:true,writable:true,value:Context},
    setInterval:{configurable:true,writable:true,value:()=>1},
    clearInterval:{configurable:true,writable:true,value:()=>{}},
    document:{configurable:true,writable:true,value:{hidden:false}},
  });
  const audio=new GameAudio();
  t.after(()=>{audio.dispose();for(const [key,descriptor] of originals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else Reflect.deleteProperty(globalThis,key);}});
  assert.equal(audio.toggle(),true,'sound is on, so playMove reaches the sound table');

  const styles=new Set<MoveStyle>();
  for(const move of Object.keys(RUNTIME_MOVE_DATA)){
    assert(MOVE_RULES[move],move);
    styles.add(moveTechniqueStyle(move));
    audio.playMove(move); // throws if the style has no sound entry
  }
  assert(styles.size>1,'the roster covers several styles');
  assert(styles.has('ice'),'the ice style is reachable from the exported roster');
});
