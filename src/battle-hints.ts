import type { SaveData } from './types';
import { SPECIES } from './pokemon';
import { enemyDamage,playerDamage,type Battle } from './battle';

// Read-only previews use the same damage rules as the resolved turn.
export function battleHint(save:SaveData,b:Battle):[string,string]{
  const active=save.party[b.active],damage=enemyDamage(b);
  const remaining=(hp:number,max:number)=>hp<=damage?'반격 후 기절 (HP 0)':`반격 후 HP ${hp-damage}/${max}`;
  if(b.menu==='between')return [`다음 상대: ${SPECIES[b.enemy.species].name} Lv.${b.enemy.level}`,'교대하면 추가 반격 없이 출전합니다'];
  if(b.menu==='heal'){
    const target=save.party[b.selected];
    if(!target)return ['회복할 포켓몬을 선택하세요',''];
    if(target.hp<=0)return ['쓰러진 포켓몬은 회복 불가','센터에서 회복해 주세요'];
    if(save.inventory.potions<=0)return ['상처약이 없습니다','회복 지점에서 보충받으세요'];
    if(target.hp===target.maxHp)return ['HP가 가득 찼습니다','상처약을 소비하지 않습니다'];
    const healed=Math.min(target.maxHp,target.hp+20);
    return [`${SPECIES[target.species].name} HP ${target.hp} → ${healed}`,b.selected===b.active?remaining(healed,target.maxHp):`${SPECIES[active.species].name}: ${remaining(active.hp,active.maxHp)}`];
  }
  if(b.menu==='party'){
    const next=save.party[b.selected];
    if(!next)return ['내보낼 포켓몬을 선택하세요',''];
    if(next.hp<=0)return ['쓰러진 포켓몬은 교대 불가','센터에서 회복해 주세요'];
    if(b.betweenOpponents&&b.selected!==b.active)return [`${SPECIES[next.species].name}를 내보낸다`,'다음 상대와 반격 없이 대면합니다'];
    if(b.forcedSwitch)return [`${SPECIES[next.species].name}를 내보낸다`,'추가 반격 없이 출전합니다'];
    if(b.selected===b.active)return ['이미 싸우고 있는 포켓몬','다른 포켓몬을 선택하세요'];
    return [`${SPECIES[next.species].name}로 교대 · 한 턴 사용`,remaining(next.hp,next.maxHp)];
  }
  if(b.menu==='moves'){
    if(b.selected===0){
      const hit=playerDamage(active,b);
      return [`상대에게 ${Math.min(b.enemy.hp,hit)} 피해`,b.enemy.hp<=hit?'쓰러뜨리면 반격 없음':remaining(active.hp,active.maxHp)];
    }
    const defense=SPECIES[active.species].moves[1]==='꼬리흔들기';
    const drop=defense?b.enemyDefenseDrop:b.enemyAttackDrop,stat=defense?'방어':'공격';
    if(drop>=3)return [`상대 ${stat} 하락은 이미 최대`,`효과 없이 반격: HP -${Math.min(active.hp,damage)}`];
    return [`상대 ${stat} 하락 ${drop} → ${drop+1}/3`,defense?`다음 공격 피해 ${Math.min(b.enemy.hp,playerDamage(active,b)+1)}`:`이번 반격 피해 ${Math.min(active.hp,enemyDamage(b,drop+1))}`];
  }
  if(b.menu==='bag'){
    if(b.selected===0){
      if(b.kind==='gym')return ['트레이너의 포켓몬은 포획 불가','몬스터볼을 소비하지 않습니다'];
      if(save.party.length>=6)return ['파티가 가득 찼습니다','몬스터볼을 소비하지 않습니다'];
      if(save.inventory.pokeBalls<=0)return ['몬스터볼이 없습니다','길 안내원에게 보충받으세요'];
      const certain=b.enemy.hp<=b.enemy.maxHp/2;
      return [`포획 성공률 ${certain?100:55}% · 볼 1개`,certain?'성공하면 반격 없이 포획':`실패하면 반격: HP -${Math.min(active.hp,damage)}`];
    }
    if(save.inventory.potions<=0)return ['상처약이 없습니다','회복 지점에서 보충받으세요'];
    return ['포켓몬을 골라 HP 최대 20 회복','사용하면 출전 포켓몬이 반격을 받음'];
  }
  return [`${SPECIES[active.species].name}는 무엇을 할까?`,''];
}
