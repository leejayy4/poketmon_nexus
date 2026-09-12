import type { Engine } from './engine';
import { JOHTO_ROUTE_32,JOHTO_ROUTE_33,UNION_CAVE_1F } from './johto-south-route';
import { encounterGuidance } from './encounter-guidance';

/** Connect Azalea's optional preparation notes to the south Johto walking route. */
export function handleJohtoSouthLife(g:Engine,event:string):boolean{
  const save=g.save,prepared=save.flags.azaleaApricornPrepared===true,workshop=save.flags.azaleaWorkshopObserved===true,rested=save.flags.azaleaCompanionRested===true;
  if(save.map===JOHTO_ROUTE_33){
    if(event==='tourRoute33Traveler'){
      g.say('33번도로 여행자',[prepared?'고동 공방에서 규토리를 나누고 왔군요. 젖은 천은 우비 쉼터에서 다시 말릴 수 있어요.':'고동에서 출발했다면 북쪽 표석과 공방 마당에서 길과 짐을 먼저 살펴볼 수 있어요.',rested?'동료와 쉬고 나왔어도 발에 진흙이 끼지 않는지 봐 주세요.':'비에 젖은 동료는 고동 센터에서 상태를 확인한 뒤 출발해도 좋아요.',...encounterGuidance(save.map).pages,'서쪽 끝은 연결동굴 1층, 동쪽 끝은 고동마을입니다.']);return true;
    }
    if(event==='tourRoute33Pokemon'){
      g.say('빗물 도랑의 파치리스',['파치파치!\n물방울이 튀자 꼬리를 들어 올리고 마른 돌 위로 옮겨 선다.',prepared?'가방의 규토리 향을 맡고 고동마을 쪽으로 귀를 기울인다.':'우비 쉼터 처마와 고동마을 방향을 번갈아 바라본다.','도로에서 생활하는 개체이며 현재 33번도로 야생 조우나 포획 대상으로 등록된 포켓몬이 아니다.']);return true;
    }
    if(event==='tourRoute33Drain'){g.say('33번도로 빗물 돌도랑',['숲에서 흘러온 물이 낮은 돌홈을 따라 동굴 반대쪽으로 빠진다.','동료의 발이 젖었다면 서쪽 우비 쉼터에서 닦고, 실제 치료는 동쪽 고동 센터에서 받자.','현재 물결은 장소 표현이며 비 날씨 전투 효과가 아니다.']);return true;}
    if(event==='tourRoute33RainShelter'){g.say('동굴 앞 우비 쉼터',[rested?'공방에서 동료와 쉰 기록이 있다. 여기서는 발의 진흙과 젖은 털만 살펴보자.':'낮은 처마 아래에서 동료의 발과 젖은 털을 살펴볼 수 있다.','휴게소는 HP를 회복하지 않는다. 치료가 필요하면 동쪽 고동마을로 돌아가자.']);return true;}
  }
  if(save.map===UNION_CAVE_1F){
    if(event==='tourUnionCaveHiker'){
      g.say('연결동굴 산행객',[workshop?'고동 공방에서 선별 순서를 관찰했군요. 이 동굴도 암반 색과 물길을 나누어 보면 방향을 읽기 쉬워요.':'동쪽은 33번도로와 고동마을입니다. 고동 공방의 작업대에서는 여행 전 손질 순서를 볼 수 있어요.',rested?'동료와 쉬고 왔다면 이제 발밑의 젖은 암반을 조심하세요.':'동료가 지쳤다면 동쪽 고동 센터로 돌아가 실제 회복을 받으세요.',...encounterGuidance(save.map).pages,'북쪽 통로는 32번도로로 나갑니다. 아래층 표식은 현재 열린 본선이 아니에요.']);return true;
    }
    if(event==='tourUnionCavePokemon'){
      g.say('산행객의 알통몬',['알통!\n산행객이 가리키는 암반 색을 보고 안전한 통로 가장자리에 선다.',workshop?'규토리 작업 기록이 든 가방을 보고 짐이 젖지 않게 안쪽 길을 가리킨다.':'동쪽 밝은 입구와 북쪽 오르막을 번갈아 확인한다.','산행객과 함께 일하는 동료이며 연결동굴의 야생 조우나 포획 대상이 아니다.']);return true;
    }
    if(event==='tourUnionCaveWater'){g.say('연결동굴 지하수 홈',['암반 아래 맑은 물이 고였지만 현재 본선은 물을 건너지 않는다.','알통몬이 미끄러운 가장자리를 피해 북쪽 마른 길을 바라본다. 수상 이동이나 낚시는 아직 사용할 수 없다.']);return true;}
    if(event==='tourUnionCaveLayers'){g.say('겹쳐진 암반 곡선',[workshop?'공방에서 규토리를 색별로 나누어 본 것처럼 밝은 암반과 젖은 암반을 구분해 살폈다.':'밝은 암반은 동쪽 입구, 길게 굽은 젖은 층은 북쪽 출구 방향으로 이어진다.','동쪽은 33번도로, 북쪽은 32번도로다.']);return true;}
  }
  if(save.map===JOHTO_ROUTE_32){
    if(event==='tourRoute32Traveler'){
      g.say('32번도로 여행자',[rested?'고동 공방에서 동료와 쉬고 긴 길에 올랐군요. 물가 쉼터에서도 상태를 자주 확인하세요.':'이 길은 길어서 도라지나 고동의 센터에서 동료를 회복하고 출발하는 편이 좋아요.',workshop?'규토리 선별 기록처럼 절벽길·물가길·동굴길을 나누어 수첩에 표시하면 돌아갈 방향을 찾기 쉬워요.':'북쪽은 도라지시티, 남쪽은 연결동굴 1층을 지나 33번도로와 고동마을입니다.',...encounterGuidance(save.map).pages]);return true;
    }
    if(event==='tourRoute32Pokemon'){
      g.say('물가 여행자의 고라파덕',['고라... 파덕?\n난간 안쪽에서 잔물결을 보다가 여행자의 발소리에 고개를 든다.',rested?'동료가 쉬었다는 기록을 맡은 듯 가방 쪽을 보고 천천히 고개를 끄덕인다.':'동굴 전 쉼터 쪽을 바라보다 다시 물결을 살핀다.','여행자와 함께 걷는 동료이며 현재 32번도로 야생 조우나 포획 대상으로 등록된 포켓몬이 아니다.']);return true;
    }
    if(event==='tourRoute32Rest'){g.say('동굴 전 휴게소 표지',[rested?'고동 공방에서 동료와 쉰 기록이 보인다. 여기서는 긴 길을 지난 현재 상태를 다시 살펴보자.':'연결동굴에 들어가기 전 동료와 짐을 살펴보는 쉼터다.','치료 기능은 없다. 남쪽은 연결동굴·33번도로·고동, 북쪽은 도라지시티다.']);return true;}
    if(event==='tourRoute32Pier'){g.say('물가 관찰 부두',['난간 안쪽에서 고라파덕과 함께 물결과 둑 아래 흔적을 살폈다.','현재 부두는 관찰 장소이며 낚시·수상이동·야생 조우를 시작하지 않는다.']);return true;}
  }
  return false;
}
