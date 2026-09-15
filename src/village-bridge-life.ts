import type { Engine } from './engine';

const PARTS={
  tourVillageBridgeFlute:{bit:1,name:'풀피리',keeper:'동쪽 난간 풀피리 주민',line:'물길을 따라 길게 숨을 내쉬며 바람의 간격을 맞춘다.'},
  tourVillageBridgeGuitar:{bit:2,name:'기타',keeper:'서쪽 둔치 기타 주민',line:'돌 아치에 울림이 겹치지 않도록 짧게 현을 고른다.'},
  tourVillageBridgeBeatbox:{bit:4,name:'비트박스',keeper:'다리 끝 박자 주민',line:'보행자의 발걸음 사이 빈 박자에 낮은 리듬을 넣는다.'},
  tourResident2:{bit:8,name:'엔카',keeper:'주민 공연 연습자',line:'긴 다리와 돌아오는 여행자를 생각하며 목소리의 높낮이를 맞춘다.'},
} as const;

export function handleVillageBridgeLife(g:Engine,event:string){
  if(g.save.map!=='tour_village_bridge'||!(event in PARTS))return false;
  const part=PARTS[event as keyof typeof PARTS],before=Number(g.save.flags.villageBridgeEnsembleParts??0),after=before|part.bit;
  if(after!==before){g.save.flags.villageBridgeEnsembleParts=after;g.persist();}
  const names=Object.values(PARTS).filter(item=>(after&item.bit)!==0).map(item=>item.name),count=names.length;
  const rhythm=count===4?'네 사람이 서로의 쉼표를 들으며 완성된 합주 순서를 맞춘다.':count>=2?`${count}개 파트가 겹치지 않도록 서로의 시작과 멈춤을 맞춘다.`:'한 파트의 박자를 기억했다. 다른 주민의 생활 소리도 찾아볼 수 있다.';
  const journey=g.save.flags.villageBridgeRouteElevenReturnReviewed?'11번도로 동료와 성장해 다리로 돌아온 여행 기록이 박자 사이에 놓여 있다.':g.save.flags.lacunosaRouteTwelveReturnReviewed?'12번도로 동료와 보배마을로 돌아온 기록을 떠올리며 서쪽 여행을 준비한다.':'동쪽 12번도로와 서쪽 11번도로의 발걸음이 다리에서 만난다.';
  g.say(part.keeper,[after===before?`${part.name} 파트의 순서를 다시 들었다.`:`${part.name} 파트의 순서를 수첩에 남겼다.`,part.line,`현재 합주 구성 ${count}/4 · ${names.join(' · ')}`,rhythm,journey,'실제 음원 재생·음향 해금·보상·통행 조건은 바뀌지 않는다.']);return true;
}
