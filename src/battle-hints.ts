import type { SaveData } from './types';
import { SPECIES,pokemonMoves,MOVE_RULES,isDamagingMove,BOX_CAPACITY } from './pokemon';
import { effectivenessText,moveEffectiveness,enemyDamage,playerDamage,switchEntryDamage,type Battle } from './battle';

// Read-only previews use the same damage rules as the resolved turn.
export function battleHint(save:SaveData,b:Battle):[string,string]{
  const active=save.party[b.active],damage=enemyDamage(b,b.enemyAttackDrop,active);
  const remaining=(hp:number,max:number,reply=damage)=>hp<=reply?'반격 후 기절 (HP 0)':`반격 후 HP ${hp-reply}/${max}`;
  if(b.menu==='between')return [`다음 상대: ${SPECIES[b.enemy.species].name} Lv.${b.enemy.level}`,'교대하면 추가 반격 없이 출전합니다'];
  if(b.menu==='heal'){
    const target=save.party[b.selected];
    if(!target)return ['회복할 포켓몬을 선택하세요',''];
    if(target.hp<=0)return ['쓰러진 포켓몬은 회복 불가','센터에서 회복해 주세요'];
    if(save.inventory.potions<=0)return ['상처약이 없습니다',save.badges.length?'상점에서 도구를 구입하세요':'회복 지점에서 보충받으세요'];
    if(target.hp===target.maxHp)return ['HP가 가득 찼습니다','상처약을 소비하지 않습니다'];
    const healed=Math.min(target.maxHp,target.hp+20);
    return [`${SPECIES[target.species].name} HP ${target.hp} → ${healed}`,b.selected===b.active?remaining(healed,target.maxHp):`${SPECIES[active.species].name}: ${remaining(active.hp,active.maxHp)}`];
  }
  if(b.menu==='party'){
    const next=save.party[b.selected];
    if(!next)return ['내보낼 포켓몬을 선택하세요',''];
    if(next.hp<=0)return ['쓰러진 포켓몬은 교대 불가','센터에서 회복해 주세요'];
    const entry=switchEntryDamage(b,next);
    if(b.betweenOpponents&&b.selected!==b.active)return [`${SPECIES[next.species].name}를 내보낸다`,entry?`반격 없음 · 바위 피해 ${entry}`:'다음 상대와 반격 없이 대면합니다'];
    if(b.forcedSwitch)return [`${SPECIES[next.species].name}를 내보낸다`,entry?`반격 없음 · 바위 피해 ${entry}`:'추가 반격 없이 출전합니다'];
    if(b.selected===b.active)return ['이미 싸우고 있는 포켓몬','다른 포켓몬을 선택하세요'];
    const hit=entry+enemyDamage({...b,active:b.selected,playerDefense:{...b.playerDefense,[b.selected]:0},playerDefenseDrop:{...b.playerDefenseDrop,[b.selected]:0},playerAttackDrop:{...b.playerAttackDrop,[b.selected]:0}},b.enemyAttackDrop,next);
    return [`${SPECIES[next.species].name}로 교대 · 한 턴 사용`,next.hp<=hit?'반격 후 기절 (HP 0)':`반격 후 HP ${next.hp-hit}/${next.maxHp}`];
  }
  if(b.menu==='moves'){
    const move=pokemonMoves(active)[b.selected],rule=MOVE_RULES[move]?.rule;
    if(!move)return ['기억하고 있는 기술을 선택하세요',''];
    if(isDamagingMove(move)){
      const hit=playerDamage(active,b,move);
      const effect=effectivenessText(moveEffectiveness(move,b.enemy));
      const reply=enemyDamage({...b,enemy:{...b.enemy,hp:Math.max(0,b.enemy.hp-hit)}},b.enemyAttackDrop,active);
      if(rule==='struggle'){
        const recoil=Math.min(active.hp,Math.max(1,Math.floor(active.maxHp/4))),hp=active.hp-recoil;
        return [`상대에게 ${Math.min(b.enemy.hp,hit)} 피해 · 반동 ${recoil}`,hp===0?'반동으로 기절 · 상대 반격 없음':b.enemy.hp<=hit?`반동 후 HP ${hp}/${active.maxHp} · 반격 없음`:remaining(hp,active.maxHp,reply)];
      }
      if(rule==='drain'){
        const dealt=Math.min(b.enemy.hp,hit),heal=dealt>0?Math.min(active.maxHp-active.hp,Math.max(1,Math.floor(dealt/2))):0,hp=active.hp+heal;
        return [`상대에게 ${dealt} 피해${effect?` · ${effect}`:''}`,`HP +${heal} · ${b.enemy.hp<=hit?`반격 없음 (${hp}/${active.maxHp})`:remaining(hp,active.maxHp,reply)}`];
      }
      return [`상대에게 ${Math.min(b.enemy.hp,hit)} 피해${effect?` · ${effect}`:''}`,b.enemy.hp<=hit?'쓰러뜨리면 반격 없음':remaining(active.hp,active.maxHp,reply)];
    }
    if(rule==='protect')return ['이번 상대 기술을 막는 방어','연속 사용하면 성공률이 낮아집니다'];
    if(rule==='defenseUp'){
      const defense=b.playerDefense?.[b.active]??0,next=Math.min(3,defense+1);
      const hit=enemyDamage({...b,playerDefense:{...b.playerDefense,[b.active]:next}},b.enemyAttackDrop,active);
      return [defense>=3?'방어 상승은 이미 최대':`자신 방어 ${defense} → ${next}/3`,active.hp<=hit?'반격 후 기절 (HP 0)':`반격 후 HP ${active.hp-hit}/${active.maxHp}`];
    }
    if(rule==='hazard')return ['다음에 나오는 상대에게 바위 피해','현재 상대에게 즉시 피해는 없음'];
    if(rule==='escape')return [b.kind==='wild'?'전투에서 순간이동으로 벗어납니다':'트레이너전에서는 효과 없음',''];
    if(rule==='nothing')return ['아무 효과가 없는 기술',remaining(active.hp,active.maxHp)];
    const defense=rule==='defenseDrop';
    const drop=defense?b.enemyDefenseDrop:b.enemyAttackDrop,stat=defense?'방어':'공격';
    if(drop>=3)return [`상대 ${stat} 하락은 이미 최대`,`효과 없이 반격: HP -${Math.min(active.hp,damage)}`];
    return [`상대 ${stat} 하락 ${drop} → ${drop+1}/3`,defense?`다음 공격 피해 ${Math.min(b.enemy.hp,playerDamage(active,{...b,enemyDefenseDrop:drop+1}))}`:`이번 반격 피해 ${Math.min(active.hp,enemyDamage(b,drop+1,active))}`];
  }
  if(b.menu==='bag'){
    if(b.selected===0){
      if(b.kind!=='wild')return ['트레이너의 포켓몬은 포획 불가','몬스터볼을 소비하지 않습니다'];
      if(save.party.length>=6&&(save.box?.length??0)>=BOX_CAPACITY)return ['파티와 PC 박스가 가득 찼습니다','몬스터볼을 소비하지 않습니다'];
      if(save.inventory.pokeBalls<=0)return ['몬스터볼이 없습니다',save.badges.length?'상점에서 도구를 구입하세요':'길 안내원에게 보충받으세요'];
      const certain=b.enemy.hp<=b.enemy.maxHp/2;
      return [`포획 성공률 ${certain?100:55}% · 볼 1개`,save.party.length>=6?'성공하면 PC 박스로 보냅니다':certain?'성공하면 반격 없이 포획':`실패하면 반격: HP -${Math.min(active.hp,damage)}`];
    }
    if(save.inventory.potions<=0)return ['상처약이 없습니다',save.badges.length?'상점에서 도구를 구입하세요':'회복 지점에서 보충받으세요'];
    return ['포켓몬을 골라 HP 최대 20 회복','사용하면 출전 포켓몬이 반격을 받음'];
  }
  return [`${SPECIES[active.species].name}는 무엇을 할까?`,''];
}
