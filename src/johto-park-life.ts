import type { Engine } from './engine';
import { encounterGuidance } from './encounter-guidance';
import { JOHTO_NATIONAL_PARK,JOHTO_ROUTE_35,JOHTO_ROUTE_36,JOHTO_ROUTE_37 } from './johto-park-routes';

const MAPS:Set<string>=new Set([JOHTO_ROUTE_35,JOHTO_NATIONAL_PARK,JOHTO_ROUTE_36,JOHTO_ROUTE_37]);

/** Explain the middle-Johto habitats without turning free walking into a contest or story lock. */
export function handleJohtoParkLife(g:Engine,event:string):boolean{
  if(!MAPS.has(g.save.map))return false;
  const pages=encounterGuidance(g.save.map).pages;
  if(event==='journeyWalker'){
    if(g.save.map===JOHTO_ROUTE_35)g.say('35번도로 공원 여행자',[...pages,'가운데 흙길은 금빛시티와 자연공원을 잇는 안전 본선이다. 긴풀은 운동장·울타리 안쪽 샛길에서만 밟는다.','자연공원 너머 36번도로에서 도라지와 인주 방향이 갈라진다.']);
    else if(g.save.map===JOHTO_NATIONAL_PARK)g.say('자연공원 관리인',[...pages,'바깥 순환 산책로와 남북 큰길은 긴풀을 피해 걸을 수 있다. 중앙 화단은 자유 관찰 구역이다.','현재는 자유 산책 시간이며 곤충채집 대회·순위·시간 제한·보상은 시작되지 않는다.']);
    else if(g.save.map===JOHTO_ROUTE_36)g.say('36번도로 갈림길 안내원',[...pages,'서쪽은 도라지, 남쪽은 자연공원·35번도로·금빛, 동쪽은 37번도로·인주다.','마른나무 남쪽 우회길은 열려 있다. 꼬지모 사건·물뿌리개·배지 잠금은 적용하지 않았다.']);
    else g.say('37번도로 여행자',[...pages,'가운데 단풍길은 36번도로와 인주 남문을 잇는 안전 본선이다. 긴풀은 규토리나무 주변 샛길에만 있다.','길가 규토리나무는 생활 관찰 대상이며 조사만으로 열매나 도구를 얻지 않는다.']);
    return true;
  }
  if(event==='tourRoute35GoldenrodStone'||event==='tourRoute35ParkRest'||event==='tourRoute35PracticeYard'){
    g.say(event==='tourRoute35GoldenrodStone'?'금빛 북문 거리표':event==='tourRoute35ParkRest'?'공원 전 휴게 울타리':'도시 외곽 운동장',[...pages,'금빛시티 ↔ 35번도로 ↔ 자연공원 순서로 왕복한다.','조우는 선택 샛길에만 있으며 휴게 울타리와 운동장은 회복·보상을 주지 않는다.']);return true;
  }
  if(event==='tourRoute35Pokemon'){g.say('운동장의 파치리스',['파치파치! 길을 막지 않는 안쪽 공터에서 주민과 몸을 풀다가 긴풀 가장자리를 살핀다.','주민과 함께 나온 생활 포켓몬이며 35번도로 조우·포획 대상에는 포함되지 않는다.',...pages]);return true;}
  if(event==='tourNationalParkFountain'||event==='tourNationalParkBugGarden'||event==='tourNationalParkBoard'){
    g.say(event==='tourNationalParkFountain'?'자연공원 중앙 분수':event==='tourNationalParkBugGarden'?'곤충 관찰 화단':'공원 행사 게시판',[...pages,event==='tourNationalParkBoard'?'현재는 자유 산책만 제공한다. 곤충채집 대회의 규칙·시간·순위·보상은 아직 적용하지 않았다.':'산책로에서 흔적을 보고 선택 화단 긴풀에 들어갈 수 있다. 관찰만으로 도감 등록이나 포획은 일어나지 않는다.','남쪽은 35번도로·금빛시티, 북쪽은 36번도로 갈림길이다.']);return true;
  }
  if(event==='tourNationalParkPokemon'){g.say('관리인의 찌르꼬',['찌르르! 관리인이 화단 가장자리를 살피자 산책로 안쪽으로 한 걸음 비켜 선다.','공원 관리인과 함께 일하는 동료이며 현재 자연공원의 야생 조우·포획 대상과 구분한다.',...pages]);return true;}
  if(event==='tourRoute36Junction'||event==='tourRoute36TreeMark'){
    g.say(event==='tourRoute36Junction'?'36번도로 세 갈래 표석':'마른나무 우회 표식',[...pages,'서쪽 도라지 · 남쪽 자연공원/35번도로/금빛 · 동쪽 37번도로/인주','긴풀 샛길을 지나지 않아도 세 방향을 모두 왕복할 수 있다. 꼬지모 사건·도구·통행 잠금은 없다.']);return true;
  }
  if(event==='tourRoute37EcruteakStone'||event==='tourRoute37ApricornGrove'){
    g.say(event==='tourRoute37EcruteakStone'?'인주 남쪽 단풍 표석':'규토리나무 돌봄터',[...pages,'북쪽은 인주시티, 남쪽은 36번도로에서 도라지와 자연공원·금빛 방향으로 갈라진다.','규토리 관찰과 야생 조우는 보상·필수 포획·방울탑 진행 조건이 아니다.']);return true;
  }
  if(event==='tourRoute37Pokemon'){g.say('단풍길의 삐삐',['삐삐! 떨어진 단풍잎을 밟지 않으려는 듯 규토리나무 돌봄터 둘레를 천천히 돈다.','인주 주민과 함께 나온 생활 포켓몬이며 37번도로 야생 조우·포획 대상과 구분한다.',...pages]);return true;}
  return false;
}
