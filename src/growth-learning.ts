import type { Engine } from './engine';
import type { Battle, BattleFrame } from './battle';
import type { Pokemon } from './types';
import { availableMoves, pokemonMoves, SPECIES } from './pokemon';
import { showMoveSchool } from './move-school';

// Transient progress belongs to one battle, never to a save or party index.
const pending = new WeakMap<Battle, Map<Pokemon, Set<string>>>();
export function collectGrowthLearning(g:Engine,b:Battle,frames:BattleFrame[]=[]){
  for(const frame of frames){
    const step=frame.growth,p=step&&g.save.party[step.index];
    if(step?.kind!=='move'||!step.move||!p)continue;
    let entries=pending.get(b);if(!entries)pending.set(b,entries=new Map());
    let moves=entries.get(p);if(!moves)entries.set(p,moves=new Set());moves.add(step.move);
  }
}
function candidates(g:Engine,b:Battle){
  return [...(pending.get(b)??[])].filter(([p,moves])=>g.save.party.includes(p)&&[...moves].some(m=>availableMoves(p,g.save).includes(m)&&!pokemonMoves(p).includes(m)));
}
export function hasGrowthLearning(g:Engine,b:Battle){return candidates(g,b).length>0;}
export function openGrowthLearning(g:Engine,b:Battle){
  const save=g.save,entries=candidates(g,b);pending.delete(b);
  if(!entries.length||g.battle)return;
  const valid=()=>g.save===save&&!g.battle;
  const page=(offset=0)=>{
    if(!valid())return;
    let consumed=false;
    g.say('성장한 동료',['기술을 배울 동료를 골라 주세요.'],undefined,[
      ...entries.slice(offset,offset+3).map(([p,moves])=>({label:SPECIES[p.species].name+' · 기술 배우기',action:()=>{
        if(!valid())return;const index=save.party.indexOf(p);if(index<0)return;
        const newlyAvailable=[...moves].find(m=>availableMoves(p,save).includes(m)&&!pokemonMoves(p).includes(m));
        g.partyIndex=index;g.summaryActionIndex=0;g.panel='summary';showMoveSchool(g,0,newlyAvailable);
      }})),
      ...(offset+3<entries.length?[{label:'다음 동료',action:()=>page(offset+3)}]:[]),
      ...(offset>0?[{label:'이전 동료',action:()=>page(offset-3)}]:[]),
      {label:'계속 모험하기',action:()=>{}},
    ]);
    for(const choice of g.dialogue!.choices!){const action=choice.action;choice.action=()=>{if(consumed||!valid())return;consumed=true;action();};}
    g.dialogue!.selected=g.dialogue!.choices!.length-1;
  };
  page();
}
