import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import DATA from '../src/runtime-pokemon-data.json';
import {wildPokemon,encounterPool,hasWildEncounters,ENCOUNTER_TIME_POLICY} from '../src/runtime-encounters';
import {SPECIES,grantPokemon,pokemonMoves,availableMoves,teachMove,validPokemonMoves,MOVE_RULES,RUNTIME_SPECIES} from '../src/pokemon';
import {newSave,parseSave} from '../src/save';
import {gainExperience,maxHpAtLevel,type GrowthStep} from '../src/growth';
import {createBattle,createTrainerBattle,battleTurn,moveEffectiveness,techniqueDamage,playerDamage,enemyDamage} from '../src/battle';
import type {Pokemon} from '../src/types';
const ready=(id=7)=>{const s=newSave();grantPokemon(s,id);s.flags.departureCleared=true;s.map='route_s01';s.player={x:29,y:12,facing:'left'};s.inventory.pokeBalls=10;return s;};
const mon=(id:number,level=10):Pokemon=>({species:id,level,hp:maxHpAtLevel(id,level),maxHp:maxHpAtLevel(id,level),experience:0,nature:'성실',met:'검사'});

test('runtime encounter pools exactly preserve selected design slot weights, levels and daytime policy',()=>{
  const design=JSON.parse(readFileSync('docs/design-data/encounters.json','utf8'));
  const maps=['route_s01','tour_jubilife','tour_pass_jubilife_oreburgh','tour_eterna_forest','tour_coronet'];
  assert.equal(ENCOUNTER_TIME_POLICY,'day-only');
  for(const map of maps){const pool=encounterPool(map)!,source=design.find((p:any)=>p.id===pool.id);
    assert.deepEqual(pool.slots,source.slots.map(({speciesId,weight}:any)=>({speciesId,weight})));assert.deepEqual(pool.levels,source.levels);
    let before=0;
    for(const slot of pool.slots){for(const levelRoll of [0,.999999]){let n=0;const p=wildPokemon(map,()=>n++===0?(before+slot.weight/2)/100:levelRoll)!;
      assert.equal(p.species,slot.speciesId);assert.equal(p.level,pool.levels[levelRoll===0?0:1]);assert(validPokemonMoves(p,[]));
    }before+=slot.weight;}
    assert.equal(before,100);
  }
  assert(!hasWildEncounters('tour_pass_veilstone_sunyshore'));assert.equal(wildPokemon('bedroom'),null);assert.equal(createBattle({...ready(),map:'bedroom'}),null);
});

test('every registered species has actual front and back PNG assets',()=>{
  for(const id of Object.keys(SPECIES))for(const side of ['','back-']){const path=`public/assets/pokemon-${side}${id}.png`;assert(existsSync(path),path);assert.equal(readFileSync(path).subarray(1,4).toString(),'PNG');}
});

test('all reachable wild slots can be captured, persisted and registered in the Pokedex',()=>{
  for(const pool of DATA.pools)for(const slot of pool.slots){const s=ready(),b=createBattle(s,'wild','roark',()=>0)!;
    b.enemy=mon(slot.speciesId,pool.levels[0]);b.enemy.hp=1;
    assert.equal(battleTurn(s,b,'ball').outcome,'caught');assert(s.pokedex!.caught.includes(slot.speciesId));
    assert(parseSave(JSON.stringify(s)),`${slot.speciesId}`);
  }
});

test('full party sends captures to box and rejects only when both capacities are exhausted',()=>{
  const s=ready();while(s.party.length<6)s.party.push(mon(399,3));
  const b=createBattle(s,'wild','roark',()=>0)!;b.enemy.hp=1;
  const turn=battleTurn(s,b,'ball');assert.equal(turn.caughtInBox,true);assert.equal(s.party.length,6);assert.equal(s.box!.length,1);assert(parseSave(JSON.stringify(s)));
  while(s.box!.length<60)s.box!.push(mon(399,3));const next=createBattle(s,'wild','roark',()=>0)!,before=structuredClone(s);
  assert(battleTurn(s,next,'ball').retry);assert.deepEqual(s,before);
});

test('legacy optional fields migrate and evolved starters remain valid in a box without permitting duplicate gifts',()=>{
  for(const [from,to] of [[1,2],[4,5],[7,8]]){const s=ready(from),p=s.party[0];p.level=15;p.hp=p.maxHp=maxHpAtLevel(from,15);p.experience=149;const steps:GrowthStep[]=[];
    gainExperience(p,1,(_page,step)=>steps.push(step));assert.equal(p.species,to);assert.equal(p.level,16);assert.equal(p.maxHp,maxHpAtLevel(to,16));assert(steps.some(s=>s.kind==='evolution'));
    s.box=[s.party.shift()!];s.party=[mon(399,3)];assert(parseSave(JSON.stringify(s)));assert.equal(grantPokemon(s,from),false);
    s.box.push({...p});assert.equal(parseSave(JSON.stringify(s)),null);
  }
  const old=ready();delete old.box;delete old.pokedex;delete old.party[0].moves;const loaded=parseSave(JSON.stringify(old))!;assert.deepEqual(loaded.box,[]);assert(loaded.pokedex!.caught.includes(7));
});

test('level-up unlocks a learnable move while retaining selection until the player replaces a slot',()=>{
  const s=ready(4),p=s.party[0];p.level=6;p.hp=p.maxHp=maxHpAtLevel(4,6);p.experience=59;
  gainExperience(p,1);assert.deepEqual(pokemonMoves(p),['할퀴기','울음소리']);assert(availableMoves(p).includes('불꽃세례'));
  assert(teachMove(s,0,'불꽃세례',0));assert.equal(pokemonMoves(p)[0],'불꽃세례');assert(!teachMove(s,0,'섀도볼',1));assert(parseSave(JSON.stringify(s)));
  p.moves=['섀도볼','울음소리'];assert.equal(parseSave(JSON.stringify(s)),null);
});

test('all four reward TMs require both the reward key and a compatible Platinum species',()=>{
  for(const move of ['스텔스록','풀묶기','섀도볼','드레인펀치']){
    const id=Number(Object.keys(RUNTIME_SPECIES).find(k=>RUNTIME_SPECIES[Number(k)].tm.includes(move))!);assert(id,move);
    const s=ready();s.party=[mon(id,Math.max(16,10))];const p=s.party[0];
    assert(!availableMoves(p,s).includes(move));assert(!teachMove(s,0,move,1));
    s.keyItems=['TM-'+MOVE_RULES[move].slug];assert(availableMoves(p,s).includes(move));assert(teachMove(s,0,move,1));assert(validPokemonMoves(p,s.keyItems));
    const incompatible=Number(Object.keys(RUNTIME_SPECIES).find(k=>!RUNTIME_SPECIES[Number(k)].tm.includes(move))!);s.party=[mon(incompatible,16)];assert(!teachMove(s,0,move,1));
  }
});

test('both sides use identical move damage rules, dual typing, resistance and immunity',()=>{
  const a=mon(7,13),b=mon(74,10);a.moves=['물대포','꼬리흔들기'];
  assert.equal(moveEffectiveness('물대포',b),4);assert.equal(moveEffectiveness('전기쇼크',b),0);assert.equal(moveEffectiveness('몸통박치기',mon(92)),0);
  const s=ready();s.party=[a];const fight=createTrainerBattle(s,{id:'mirror',name:'검사',reward:0,team:[b]})!;
  assert.equal(playerDamage(a,fight),techniqueDamage(a,b,'물대포'));
  const mirror={...fight,enemy:a,opponents:[a]};assert.equal(enemyDamage(mirror,0,b),techniqueDamage(a,b,'물대포'));
  const pikachu=mon(25);assert.equal(techniqueDamage(pikachu,b,'전기쇼크'),0);assert(techniqueDamage(mon(1,5),b,'몸통박치기')>=1);
});

test('Protect actually blocks one attack, repeat attempts can fail, and declarations carry technique frames',()=>{
  const s=ready(),p=s.party[0];p.moves=['몸통박치기','방어'];const b=createBattle(s,'wild','roark',()=>0)!;
  const hp=p.hp,t=battleTurn(s,b,'move1',()=>.99);assert.equal(p.hp,hp);assert.equal(b.enemyAttackDrop,0);assert.deepEqual(t.frames![0].technique,{move:'방어',target:'player'});
  battleTurn(s,b,'move1',()=>.99);assert(p.hp<hp);
});

test('gym hazards damage replacements and trainer victory pays exactly once without allowing capture',()=>{
  const s=ready();s.party.push(mon(399,3));const gym=createBattle(s,'gym')!;
  battleTurn(s,gym,'move1');assert(gym.playerRocks);const before=s.party[1].hp;gym.betweenOpponents=true;
  const entry=battleTurn(s,gym,{switch:1});assert.equal(s.party[1].hp,before-Math.max(1,Math.floor(s.party[1].maxHp/8)));assert(entry.pages.some(p=>p.includes('뾰족한')));
  const other=ready(),foe=mon(399,3);foe.hp=1;const fight=createTrainerBattle(other,{id:'road',name:'여행자',reward:120,team:[foe]})!;
  const balls=other.inventory.pokeBalls;assert(battleTurn(other,fight,'ball').retry);assert.equal(other.inventory.pokeBalls,balls);
  const won=battleTurn(other,fight,'move0');assert.equal(won.outcome,'won');assert.equal(won.reward,120);assert.equal(other.money,120);battleTurn(other,fight,'move0');assert.equal(other.money,120);
});

test('draining, weight-based and fixed-damage rules have meaningful distinct effects',()=>{
  assert(techniqueDamage(mon(1),mon(95),'풀묶기')>techniqueDamage(mon(1),mon(74),'풀묶기'));
  assert.equal(techniqueDamage(mon(4),mon(399),'용의분노'),40);
  const s=ready();s.party=[mon(406,8)];s.party[0].hp=10;const b=createBattle(s,'wild','roark',()=>0)!;
  const t=battleTurn(s,b,'move0');assert(t.frames!.some(f=>f.effect?.kind==='heal'&&f.effect.target==='player'));
});

test('save rejects corrupted box, dex and move payloads while keeping story flags strict',()=>{
  for(const mutate of [(s:any)=>s.box=Array(61).fill(mon(399,3)),(s:any)=>s.pokedex={seen:[7,7],caught:[7]},(s:any)=>s.pokedex={seen:[7],caught:[399]},(s:any)=>s.box=[{...mon(399,3),hp:-1}],(s:any)=>s.party[0].moves=[],(s:any)=>s.flags.starterReceived=false]){
    const s=ready();mutate(s);assert.equal(parseSave(JSON.stringify(s)),null);
  }
});

test('first evolution preserves selected moves and increases rather than resets attack strength',()=>{
  for(const from of [1,4,7]){const s=ready(from),p=s.party[0];p.level=15;p.hp=p.maxHp=maxHpAtLevel(from,15);p.experience=149;
    const moves=pokemonMoves(p),damage=techniqueDamage(p,mon(399),'몸통박치기');gainExperience(p,1);
    assert.deepEqual(pokemonMoves(p),moves);assert(techniqueDamage(p,mon(399),'몸통박치기')>damage);
  }
});

test('battle and growth snapshots detach selected move arrays and do not revive fainted participants',()=>{
  const s=ready(),b=createBattle(s,'wild','roark',()=>0)!,t=battleTurn(s,b,'move0');const move=t.frames![0].player.moves![0];s.party[0].moves![0]='방어';assert.equal(t.frames![0].player.moves![0],move);
  const p=mon(4,6);p.moves=['할퀴기','울음소리'];p.hp=0;p.experience=59;const steps:GrowthStep[]=[];gainExperience(p,1,(_text,step)=>steps.push(step));p.moves[0]='불꽃세례';assert.equal(steps[0].after.moves![0],'할퀴기');assert.equal(p.hp,0);assert(steps.some(s=>s.move==='불꽃세례'));
});
