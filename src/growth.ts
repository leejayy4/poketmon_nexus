import type { Pokemon } from './types';
import { SPECIES } from './pokemon';

export const LEVEL_CAP=25;
export const OWNABLE_SPECIES=[1,4,7,25,399];
export function minimumLevel(species:number){return species===399?3:5}
export function maxHpAtLevel(species:number,level:number){return SPECIES[species].hp+(level-minimumLevel(species))*3}
export function nextLevelXp(level:number){return level*10}
export interface GrowthStep { kind:'experience'|'level'; amount:number; before:Pokemon; after:Pokemon }
export function gainExperience(p:Pokemon,amount:number,onStep?:(page:string,step:GrowthStep)=>void):string[]{
  if(p.level>=LEVEL_CAP)return [];
  const pages:string[]=[];
  const show=(page:string,kind:GrowthStep['kind'],before:Pokemon)=>{pages.push(page);onStep?.(page,{kind,amount,before,after:{...p}})};
  const before={...p};
  p.experience+=amount;
  show(`${SPECIES[p.species].name}는 경험치를\n${amount} 얻었다!`,'experience',before);
  while(p.level<LEVEL_CAP&&p.experience>=nextLevelXp(p.level)){
    const before={...p};
    p.experience-=nextLevelXp(p.level);p.level++;
    const previous=p.maxHp;p.maxHp=maxHpAtLevel(p.species,p.level);p.hp+=p.maxHp-previous;
    if(p.level===LEVEL_CAP)p.experience=0;
    show(`${SPECIES[p.species].name}의 레벨이\n${p.level}(으)로 올랐다!`,'level',before);
  }
  if(p.level===LEVEL_CAP)p.experience=0;
  return pages;
}
