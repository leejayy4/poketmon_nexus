import type { Engine } from './engine';
import type { Choice } from './types';
import { pokemonMoves, SPECIES } from './pokemon';
import { leadPokemon } from './team';

/** Choose an actual first battler without changing the roster on preview/cancel. */
export function showTrainerPreparation(g:Engine,current:()=>boolean,start:()=>void,page=0){
  if(!current())return;
  const save=g.save;
  const ready=()=>g.save===save&&current();
  const pages=Math.max(1,Math.ceil(save.party.length/3));
  page=Math.max(0,Math.min(page,pages-1));
  const choices:Choice[]=save.party.slice(page*3,page*3+3).map(mon=>({
    label:`${SPECIES[mon.species].name} Lv.${mon.level} · HP ${mon.hp}/${mon.maxHp}`,
    action:()=>{
      if(!ready()||!save.party.includes(mon))return;
      g.say('첫 출전 동료',[
        `${SPECIES[mon.species].name} Lv.${mon.level}\nHP ${mon.hp}/${mon.maxHp}`,
        `기억하는 기술\n${pokemonMoves(mon).join(' / ')}`,
        mon.hp>0?'이 동료를 먼저 내보낼까?':'쓰러진 동료는 출전할 수 없어. 센터에서 회복하자.',
      ],undefined,[
        ...(mon.hp>0?[{label:'이 동료로 배틀 시작',action:()=>{
          if(!ready()||mon.hp<=0)return;
          const index=save.party.indexOf(mon);if(index<0)return;
          leadPokemon(save,index);
          start();
        }}]:[]),
        {label:'다른 동료 보기',action:()=>{if(ready())showTrainerPreparation(g,current,start,page);}},
        {label:'도전을 미룬다',action:()=>{}},
      ]);
    },
  }));
  if(page+1<pages)choices.push({label:'다음 동료',action:()=>showTrainerPreparation(g,current,start,page+1)});
  if(page>0)choices.push({label:'앞쪽 동료',action:()=>showTrainerPreparation(g,current,start,page-1)});
  choices.push({label:'도전을 미룬다',action:()=>{}});
  g.say('배틀 준비',[`먼저 나갈 동료를 고르자. ${page+1}/${pages}\n선택을 확정하기 전에는 파티 순서가 바뀌지 않는다.`],undefined,choices);
}
