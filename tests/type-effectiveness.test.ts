import test from 'node:test';
import assert from 'node:assert/strict';
import { battleTurn,moveEffectiveness,playerDamage } from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import { battleHint } from '../src/battle-hints';
import { Engine } from '../src/engine';
import { grantPokemon,SPECIES } from '../src/pokemon';
import { Renderer } from '../src/renderer';
import { newSave,parseSave } from '../src/save';

function ready(species:number){const save=newSave();grantPokemon(save,species);save.flags.departureCleared=true;save.map='route_s01';return save;}
function opponent(species:number){const data=SPECIES[species];return {species,level:5,hp:data.hp,maxHp:data.hp,experience:0,nature:'성실',met:'전투 검사'};}

test('selected attack applies the current roster type matchup and matches its hint',()=>{
  const electric=ready(25),waterBattle=createBattle(electric)!;waterBattle.enemy=opponent(7);waterBattle.menu='moves';
  assert.equal(moveEffectiveness('전기쇼크',waterBattle.enemy),2);assert.equal(playerDamage(electric.party[0],waterBattle),14);
  assert.equal(battleHint(electric,waterBattle)[0],'상대에게 14 피해 · 효과가 굉장했다!');
  const turn=battleTurn(electric,waterBattle,'move0');assert(turn.pages.includes('효과가 굉장했다!'));assert.equal(waterBattle.enemy.hp,6);

  const resisted=ready(25),electricBattle=createBattle(resisted)!;electricBattle.enemy=opponent(25);electricBattle.menu='moves';
  assert.equal(moveEffectiveness('전기쇼크',electricBattle.enemy),.5);assert.equal(playerDamage(resisted.party[0],electricBattle),3);
  assert.equal(battleHint(resisted,electricBattle)[0],'상대에게 3 피해 · 효과가 별로인 듯하다...');
  assert(battleTurn(resisted,electricBattle,'move0').pages.includes('효과가 별로인 듯하다...'));
  assert(parseSave(JSON.stringify(resisted)));
});

test('wild capture dialogue and playback label use the actual opponent species',()=>{
  const save=ready(1),battle=createBattle(save)!;
  save.inventory.pokeBalls=1;
  battle.enemy=opponent(7);battle.enemy.hp=Math.floor(battle.enemy.maxHp/2);
  const game=new Engine();game.save=save;game.battle=battle;
  const words:string[]=[],context=new Proxy({}, {get:(_,key)=>key==='fillText'?(text:string)=>words.push(text):()=>{}}) as CanvasRenderingContext2D;
  const canvas={getContext:()=>context} as HTMLCanvasElement;
  new Renderer(game,canvas,canvas).battleLower(context);
  assert(words.includes('야생 꼬부기'));
  const turn=battleTurn(save,battle,'ball');
  assert.equal(turn.outcome,'caught');
  assert.deepEqual(turn.pages,['몬스터볼을 던졌다!','좋아! 꼬부기를 잡았다!\n꼬부기가 파티에 등록되었다.']);
  assert.equal(save.party.at(-1)?.species,7);
});
