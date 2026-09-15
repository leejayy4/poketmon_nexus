import { RUNTIME_RULES } from './data/rules';
import type { Pokemon } from './types';
import { SPECIES,availableMoves,pokemonMoves,pokemonSnapshot,MOVE_CAPACITY } from './pokemon';
import { RUNTIME_DATA as DATA, RUNTIME_DATABASE } from './data/runtime';
import { withParticle } from './korean-text';

export const LEVEL_CAP=RUNTIME_RULES.levelCap;
export const OWNABLE_SPECIES:number[]=DATA.ownable;
export function minimumLevel(species:number){return [2,5,8].includes(species)?16:[1,4,7,25].includes(species)?5:species===399?3:1}
export function maxHpAtLevel(species:number,level:number){return SPECIES[species].hp+(level-minimumLevel(species))*3}
export function nextLevelXp(level:number){return level*10}
export interface GrowthStep { kind:'experience'|'level'|'evolution'|'move'; amount:number; before:Pokemon; after:Pokemon; move?:string }
function learnNewGrowthMoves(p:Pokemon,previousMoves:string[],show:(page:string,kind:GrowthStep['kind'],before:Pokemon,move?:string)=>void){
  for(const move of availableMoves(p).filter(m=>!previousMoves.includes(m))){
      const beforeMove=pokemonSnapshot(p),moves=pokemonMoves(p);
      if(!moves.includes(move)&&moves.length<MOVE_CAPACITY){
        p.moves=[...moves,move];
        show(`${withParticle(SPECIES[p.species].name,'은/는')} ${withParticle(move,'을/를')}\n새로 배웠다!`,'move',beforeMove,move);
      }else if(!moves.includes(move)){
        show(`${withParticle(SPECIES[p.species].name,'은/는')} ${withParticle(move,'을/를')}\n배울 수 있다! 정보에서 기술을 바꿔 보자.`,'move',beforeMove,move);
      }
    }
}
export function gainExperience(p:Pokemon,amount:number,onStep?:(page:string,step:GrowthStep)=>void):string[]{
  if(p.level>=LEVEL_CAP||!Number.isInteger(amount)||amount<=0)return [];
  const pages:string[]=[];
  const show=(page:string,kind:GrowthStep['kind'],before:Pokemon,move?:string)=>{pages.push(page);onStep?.(page,{kind,amount,before:pokemonSnapshot(before),after:pokemonSnapshot(p),...(move?{move}:{})})};
  const before=pokemonSnapshot(p);
  p.moves??=pokemonMoves(p);
  p.experience+=amount;
  show(`${withParticle(SPECIES[p.species].name,'은/는')} 경험치를\n${amount} 얻었다!`,'experience',before);
  while(p.level<LEVEL_CAP&&p.experience>=nextLevelXp(p.level)){
    const before=pokemonSnapshot(p);
    const previousMoves=availableMoves(p);
    p.experience-=nextLevelXp(p.level);p.level++;
    const previous=p.maxHp;p.maxHp=maxHpAtLevel(p.species,p.level);if(p.hp>0)p.hp+=p.maxHp-previous;
    if(p.level===LEVEL_CAP)p.experience=0;
    show(`${SPECIES[p.species].name}의 레벨이\n올랐다! Lv.${p.level}`,'level',before);
    const evolution=RUNTIME_DATABASE.evolutionFrom(p.species,p.level);
    if(evolution){
      const previous=pokemonSnapshot(p),oldHp=p.maxHp;p.species=evolution.to;p.maxHp=maxHpAtLevel(p.species,p.level);
      if(p.hp>0)p.hp=Math.min(p.maxHp,p.hp+p.maxHp-oldHp);
      show(`${withParticle(SPECIES[previous.species].name,'은/는')}\n${withParticle(SPECIES[p.species].name,'으로/로')} 진화했다!`,'evolution',previous);
    }
    learnNewGrowthMoves(p,previousMoves,show);
  }
  if(p.level===LEVEL_CAP)p.experience=0;
  return pages;
}

/** Project cap compatibility: one eligible stage after a won battle, never on save load. */
export function evolveAtLevelCap(p:Pokemon,onStep?:(page:string,step:GrowthStep)=>void):void{
  if(p.level!==LEVEL_CAP||p.hp<=0)return;
  const evolution=RUNTIME_DATABASE.evolutionFrom(p.species,p.level);
  if(!evolution||!OWNABLE_SPECIES.includes(evolution.to))return;
  const before=pokemonSnapshot(p),oldHp=p.maxHp,previousMoves=availableMoves(p);
  p.moves??=pokemonMoves(p);
  p.species=evolution.to;p.maxHp=maxHpAtLevel(p.species,p.level);
  p.hp=Math.max(1,Math.min(p.maxHp,p.hp+p.maxHp-oldHp));
  const page=`${withParticle(SPECIES[before.species].name,'은/는')}\n${withParticle(SPECIES[p.species].name,'으로/로')} 진화했다!`;
  onStep?.(page,{kind:'evolution',amount:0,before,after:pokemonSnapshot(p)});
  learnNewGrowthMoves(p,previousMoves,(page,kind,before,move)=>onStep?.(page,{kind,amount:0,before:pokemonSnapshot(before),after:pokemonSnapshot(p),...(move?{move}:{})}));
}
