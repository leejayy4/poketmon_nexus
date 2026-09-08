import type { Engine } from './engine';
import type { Choice } from './types';
import { availableMoves,pokemonMoves,teachMove,SPECIES,MOVE_CAPACITY } from './pokemon';
import { moveDescription } from './move-description';
import { withParticle } from './korean-text';

const schoolSessions=new WeakMap<Engine,object>();
export function showMoveSchool(g:Engine,page=0,preferredMove?:string){
  const s=g.save,index=g.partyIndex,p=s.party[index];if(!p||g.battle)return;
  const session={};schoolSessions.set(g,session);
  const current=()=>schoolSessions.get(g)===session&&g.save===s&&s.party[index]===p&&!g.battle;
  const moves=availableMoves(p,s),pages=Math.max(1,Math.ceil(moves.length/3));
  const selected=pokemonMoves(p),preferredIndex=preferredMove===undefined?-1:moves.indexOf(preferredMove);
  const canAdd=selected.length<MOVE_CAPACITY;
  const unchanged=()=>{const current=pokemonMoves(p);return current.length===selected.length&&current.every((m,i)=>m===selected[i]);};
  const shouldFocusPreferred=preferredMove!==undefined&&preferredIndex>=0&&!selected.includes(preferredMove);
  if(shouldFocusPreferred){page=Math.floor(preferredIndex/3);}
  page=Math.max(0,Math.min(page,pages-1));
  const choices:Choice[]=moves.slice(page*3,page*3+3).map(move=>({label:(selected.includes(move)?'● ':'')+move,action:()=>{
    if(!current())return;
    if(!selected.includes(move)&&canAdd){
      let confirmed=false;
      g.say(move,[moveDescription(move),`빈 기술 칸 ${selected.length+1}/${MOVE_CAPACITY}에\n${withParticle(move,'을/를')} 배울까요?`],undefined,[
        {label:'빈 자리에 배운다',action:()=>{
          if(confirmed||!current())return;
          confirmed=true;
          const learned=unchanged()&&teachMove(s,index,move,selected.length);
          if(learned){g.persist();g.audio.play('receive');}
          g.say(SPECIES[p.species].name,[learned?`${withParticle(move,'을/를')} 배웠다!\n기억하는 기술 ${pokemonMoves(p).length}/${MOVE_CAPACITY}`:'지금은 이 기술을 배울 수 없다.'],()=>showMoveSchool(g,page));
        }},{label:'기술 목록으로',action:()=>showMoveSchool(g,page)}
      ]);return;
    }
    g.say(move,[moveDescription(move),selected.includes(move)?'이미 기억하고 있는 기술이다.':'어느 기술과 비교할까요?'],undefined,selected.includes(move)?[{label:'기술 목록으로',action:()=>showMoveSchool(g,page)}]:[
      ...selected.map((old,slot)=>({label:withParticle(old,'과/와')+' 비교',action:()=>{
        if(!current())return;
        let confirmed=false;
        g.say('기술 비교',[
          `현재: ${old}\n${moveDescription(old)}`,
          `새 기술: ${move}\n${moveDescription(move)}`,
          `${old} 대신\n${withParticle(move,'을/를')} 배울까요?`,
        ],undefined,[{label:'바꿔서 배운다',action:()=>{
          if(confirmed||!current())return;
          confirmed=true;
          const learned=unchanged()&&teachMove(s,index,move,slot);
          if(learned){g.persist();g.audio.play('receive');}
          g.say(SPECIES[p.species].name,[learned?`${old} 대신\n${withParticle(move,'을/를')} 배웠다!`:'지금은 이 기술을 배울 수 없다.'],()=>showMoveSchool(g,page));
        }},{label:'기술 목록으로',action:()=>showMoveSchool(g,page)}]);
      }})),{label:'돌아가기',action:()=>showMoveSchool(g,page)}
    ]);
  }}));
  if(page<pages-1)choices.push({label:'다음 페이지',action:()=>showMoveSchool(g,page+1)});
  if(page>0)choices.push({label:'이전 페이지',action:()=>showMoveSchool(g,page-1)});
  choices.push({label:'정보 화면으로',action:()=>{if(current())schoolSessions.delete(g);}});
  g.say('기술 배우기',[`${SPECIES[p.species].name} · ${page+1}/${pages}쪽\n레벨 기술과 사용 가능한 기술머신`],undefined,choices);
  if(shouldFocusPreferred)g.dialogue!.selected=preferredIndex%3;
}
