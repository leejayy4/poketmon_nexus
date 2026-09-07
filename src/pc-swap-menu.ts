import type { Engine } from './engine';
import type { Choice,Pokemon } from './types';
import { SPECIES,pokemonMoves } from './pokemon';
import { isWorldCenter } from './unified-world';
import { swapStoredPokemon } from './pc-swap';

export function showPcSwap(g:Engine,back:()=>void){
  const save=g.save,map=save.map;
  const valid=()=>g.save===save&&save.map===map&&isWorldCenter(map)&&!g.battle;
  if(!valid())return;
  const detail=(label:string,p:Pokemon)=>`${label}: ${SPECIES[p.species].name} Lv.${p.level}\nHP ${p.hp}/${p.maxHp}\n${pokemonMoves(p).join(' / ')}`;
  const boxPage=(page=0)=>{
    if(!valid())return;
    const list=save.box??[],pages=Math.max(1,Math.ceil(list.length/3));page=Math.max(0,Math.min(page,pages-1));
    const choices:Choice[]=list.slice(page*3,page*3+3).map((p,i)=>({label:`${SPECIES[p.species].name} Lv.${p.level}`,action:()=>partyPage(page*3+i,p,0,page)}));
    if(page+1<pages)choices.push({label:'다음 페이지',action:()=>boxPage(page+1)});
    if(page>0)choices.push({label:'이전 페이지',action:()=>boxPage(page-1)});
    choices.push({label:'PC 메뉴로',action:()=>{if(valid())back();}});
    g.say('포켓몬 교체',[`박스 · ${page+1}/${pages}쪽\n${list.length?'함께 데려갈 포켓몬을 골라 주세요.':'아직 보관 중인 포켓몬이 없어요.'}`],undefined,choices);
  };
  const partyPage=(boxIndex:number,boxed:Pokemon,page:number,returnPage:number)=>{
    if(!valid()||save.box?.[boxIndex]!==boxed)return;
    const pages=Math.max(1,Math.ceil(save.party.length/3));page=Math.max(0,Math.min(page,pages-1));
    const choices:Choice[]=save.party.slice(page*3,page*3+3).map((p,i)=>({label:`${SPECIES[p.species].name} Lv.${p.level}`,action:()=>{
      const partyIndex=page*3+i;
      if(!valid()||save.box?.[boxIndex]!==boxed||save.party[partyIndex]!==p)return;
      let used=false;
      g.say('교체 확인',[detail('파티',p),detail('박스',boxed),'두 포켓몬의 자리를 바꿀까요?\nHP와 기술은 그대로 유지됩니다.'],undefined,[
        {label:'교체한다',action:()=>{
          if(used||!valid()||save.box?.[boxIndex]!==boxed||save.party[partyIndex]!==p)return;
          used=true;const result=swapStoredPokemon(save,partyIndex,boxIndex);
          if(result.ok)g.persist();
          g.say('포켓몬 PC',[result.message],()=>{if(valid())boxPage(returnPage);});
        }},
        {label:'다시 고른다',action:()=>{if(!used){used=true;partyPage(boxIndex,boxed,page,returnPage);}}},
      ]);
      g.dialogue!.selected=1;
    }}));
    if(page+1<pages)choices.push({label:'다음 페이지',action:()=>partyPage(boxIndex,boxed,page+1,returnPage)});
    if(page>0)choices.push({label:'이전 페이지',action:()=>partyPage(boxIndex,boxed,page-1,returnPage)});
    choices.push({label:'박스로 돌아가기',action:()=>boxPage(returnPage)});
    g.say('파티 선택',[`데려올 동료: ${SPECIES[boxed.species].name}\n대신 맡길 포켓몬 · ${page+1}/${pages}쪽`],undefined,choices);
  };
  boxPage();
}
