import type { Engine } from './engine';
import type { Choice, Pokemon } from './types';
import { SPECIES, MOVE_RULES, pokemonMoves, isDamagingMove } from './pokemon';
import { techniqueDamage, moveEffectiveness } from './battle';
import { moveDescription } from './move-description';
import { showMoveSchool } from './move-school';
import { startPalletSparring } from './pallet-sparring';

export function practicePages(attacker:Pokemon,target:Pokemon,move:string):string[]{
  const damage=techniqueDamage(attacker,target,move),effect=moveEffectiveness(move,target);
  const fixed=['fixedDamage','levelDamage'].includes(MOVE_RULES[move]?.rule);
  const result=!isDamagingMove(move)?'직접 피해를 주는 기술이 아니다.'
    :effect===0?'상대에게 효과가 없다.'
    :fixed?'정해진 피해를 주는 기술이다.'
    :`타입 상성 ×${effect} · 예상 피해 ${damage}`;
  return [
    `${SPECIES[attacker.species].name} → ${SPECIES[target.species].name}\n${move}의 모의 실험`,
    moveDescription(move),
    `${result}\n${isDamagingMove(move)?`HP ${target.maxHp} 중 ${Math.min(damage,target.maxHp)} 감소 예상`:'효과 설명을 보고 전술을 골라 보자.'}`,
    '공격·방어가 변하기 전의 비교다.\n동료의 HP와 도구는 소모되지 않는다.',
  ];
}

const sessions=new WeakMap<Engine,object>();
export function handlePalletPractice(g:Engine,id:string):boolean{
  if(g.save.map!=='tour_pallet_hall'||id!=='tourExhibit0')return false;
  const save=g.save,session={};sessions.set(g,session);
  const current=()=>g.save===save&&save.map==='tour_pallet_hall'&&!g.battle&&sessions.get(g)===session;
  const members=[...save.party];
  const intact=()=>current()&&members.length===save.party.length&&members.every((p,i)=>save.party[i]===p);
  const chooseMember=(attacker?:number,page=0)=>{
    if(!intact())return;
    const candidates=members.map((p,i)=>({p,i})).filter(({i})=>i!==attacker);
    const pages=Math.max(1,Math.ceil(candidates.length/3));page=Math.max(0,Math.min(page,pages-1));
    const choices:Choice[]=candidates.slice(page*3,page*3+3).map(({p,i})=>({
      label:`${SPECIES[p.species].name} Lv.${p.level}`,
      action:()=>{if(!intact())return;if(attacker===undefined)chooseMember(i);else chooseMove(attacker,i);},
    }));
    if(page+1<pages)choices.push({label:'다음 페이지',action:()=>chooseMember(attacker,page+1)});
    if(page>0)choices.push({label:'이전 페이지',action:()=>chooseMember(attacker,page-1)});
    choices.push({label:attacker===undefined?'실험 끝내기':'사용할 동료 다시 고르기',action:()=>{if(attacker!==undefined)chooseMember();}});
    g.say('기술 관찰 장치',[`${attacker===undefined?'기술을 사용할 동료':'비교할 상대 동료'} · ${page+1}/${pages}쪽\n${members.length<2?'두 동료 이상과 함께 와 보자.':'포켓몬을 선택해 모의 실험을 해 보자.'}`],undefined,members.length<2?[{label:'돌아가기',action:()=>{}}]:choices);
  };
  const chooseMove=(attacker:number,target:number)=>{
    if(!intact())return;
    const p=members[attacker],opponent=members[target];
    g.say('기술 선택',[`${SPECIES[p.species].name} → ${SPECIES[opponent.species].name}\n어느 기술을 비교할까?`],undefined,[
      ...pokemonMoves(p).map(move=>({label:move,action:()=>{
        if(!intact())return;
        g.say('모의 실험 결과',practicePages(p,opponent,move),undefined,[
          {label:'다른 기술 비교',action:()=>chooseMove(attacker,target)},
          {label:'기술 편성하기',action:()=>{if(!intact())return;sessions.delete(g);g.partyIndex=attacker;g.panel='summary';showMoveSchool(g);}},
          {label:'동료 다시 고르기',action:()=>chooseMember()},
          {label:'실험 끝내기',action:()=>{}},
        ]);
      }})),
      {label:'연속 모의전',action:()=>{if(intact())startPalletSparring(g,attacker,target,intact,()=>chooseMove(attacker,target));}},
      {label:'상대 다시 고르기',action:()=>chooseMember(attacker)},
    ]);
  };
  chooseMember();return true;
}
