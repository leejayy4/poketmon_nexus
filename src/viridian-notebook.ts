import type { Engine } from './engine';
import type { SaveData } from './types';
import { encounterPool } from './runtime-encounters';
import { SPECIES } from './pokemon';

export function forestObservationPages(save:SaveData):string[]{
  const caught=new Set([...(save.pokedex?.caught??[]),...save.party.map(p=>p.species),...(save.box??[]).map(p=>p.species)]);
  const seen=new Set([...(save.pokedex?.seen??[]),...caught]);
  return encounterPool('tour_viridian_forest')!.slots.map(slot=>{
    const name=SPECIES[slot.speciesId].name;
    const record=caught.has(slot.speciesId)?'포획 기록 있음':seen.has(slot.speciesId)?'발견 기록 있음':'아직 발견 기록 없음';
    return `${name} · ${record}\n상록숲의 풀밭에서 만날 수 있다.`;
  });
}

export function handleViridianNotebook(g:Engine,id:string):boolean{
  if(g.save.map!=='tour_viridian_hall'||id!=='tourExhibit2')return false;
  const save=g.save,current=()=>g.save===save&&save.map==='tour_viridian_hall'&&!g.battle;
  const menu=()=>{
    if(!current())return;
    g.say('숲 관찰 수첩',['숲에서 만난 친구들의 기록을\n내 도감과 비교해 보자.'],undefined,[
      {label:'숲 기록 비교',action:()=>{if(current())g.say('숲 관찰 기록',forestObservationPages(save),menu);}},
      {label:'여행 파티 살피기',action:()=>{if(!current())return;g.panel='party';g.partyIndex=0;}},
      {label:'수첩 덮기',action:()=>{}},
    ]);
  };
  menu();return true;
}

