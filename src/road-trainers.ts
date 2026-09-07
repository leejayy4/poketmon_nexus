import type { Engine } from './engine';
import type { Pokemon } from './types';
import { createTrainerBattle } from './battle';
import { pokemonMoves,SPECIES } from './pokemon';
import { maxHpAtLevel } from './growth';
import { getMap } from './maps';
import { journeyConnection } from './journey-world';

const trainers=[
  {map:'route_s01',event:'roadworker',id:'west-road-practice',name:'도로 정비원',reward:160,team:[[396,4]]},
  {map:'tour_pass_jubilife_oreburgh',event:'journeyWalker',id:'oreburgh-cave-practice',name:'산행객',reward:300,team:[[74,7],[41,7]]}
];
export const trainerWinFlag=(id:string)=>'trainerWon:'+id;

const directionName=(direction:string|undefined)=>({up:'북쪽',right:'동쪽',down:'남쪽',left:'서쪽'} as Record<string,string>)[direction??'']??'해당';
function roadGuidance(){
  const route=getMap('route_s01',{departureCleared:true});
  const west=journeyConnection(route,'tour_jubilife');
  const city=getMap('tour_jubilife',{departureCleared:true});
  const south=journeyConnection(city,'tour_oreburgh');
  return [
    `${directionName(west?.entry)} 출구로 가면 축복시티야.`,
    `축복시티의 ${directionName(south?.entry)} 출구에서 암반굴을 지나면\n무쇠시티와 첫 체육관으로 이어진단다.`
  ];
}
export function handleRoadTrainer(g:Engine,event:string):boolean{
  const trainer=trainers.find(t=>t.map===g.save.map&&t.event===event);if(!trainer)return false;
  if(g.save.flags[trainerWinFlag(trainer.id)]){g.say(trainer.name,trainer.map==='route_s01'?[`좋은 연습이었어! ${roadGuidance()[0]}`,`${roadGuidance()[1]}\n센터와 상점에서 준비하고 가.`]:['좋은 연습이었어! 동료마다 잘하는\n기술을 살려 다음 도전도 힘내 봐.','바위와 동굴의 포켓몬은 약점도 달라.\n두 기술 중 무엇을 쓸지 살펴봐.']);return true;}
  if(!g.save.flags.departureCleared||!g.save.party.some(p=>p.hp>0)){g.say(trainer.name,['건강한 파트너와 출발 준비를 마치면\n짧은 연습 배틀을 해 보자.']);return true;}
  const save=g.save;
  g.say(trainer.name,['길에서 만난 트레이너끼리\n짧게 연습 배틀을 해 볼까?',...(trainer.map==='route_s01'?roadGuidance():[]),trainer.team.map(([id,level])=>`${SPECIES[id].name} Lv.${level}`).join(' / ')+`\n이기면 ${trainer.reward}원을 줄게.`],undefined,[
    {label:'배틀한다',action:()=>{
      if(g.save!==save||save.map!==trainer.map||save.flags[trainerWinFlag(trainer.id)])return;
      const team:Pokemon[]=trainer.team.map(([species,level])=>{const maxHp=maxHpAtLevel(species,level),p:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'연습 배틀'};p.moves=pokemonMoves(p);return p;});
      g.battle=createTrainerBattle(save,{...trainer,team});if(g.battle){g.persist();g.say(trainer.name,[`좋아! ${SPECIES[team[0].species].name},\n같이 연습해 보자!`]);}
    }},
    {label:'도움말을 듣는다',action:()=>g.say(trainer.name,trainer.map==='route_s01'?[...roadGuidance(),'풀밭에서 새 동료를 만나고\n센터에서 회복한 뒤 도전해 봐.','기술을 바꾸려면 X → 포켓몬 →\n정보 화면의 기술 배우기를 선택해.']:[ '남쪽 자갈밭에서 동료를 만나 봐.\n밝은 통로는 조우를 피하는 길이야.', '센터에서 회복한 뒤 도전해 봐.','기술을 바꾸려면 X → 포켓몬 →\n정보 화면의 기술 배우기를 선택해.'])},
    {label:'다음에 한다',action:()=>{}}
  ]);return true;
}
