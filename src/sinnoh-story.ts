import { TOUR_SPAWNS } from './explore-world';
import type { Engine } from './engine';
import { GYMS } from './gyms';
export function sinnohEvent(g:Engine,id:string):boolean {
  if(id==='sinnohGymGuide'){
    const gym=GYMS[['eterna_gym','hearthome_gym','veilstone_gym'].indexOf(g.save.map)+1];
    g.say('체육관 안내원',['이곳은 '+gym.name+'의 체육관이에요.\n앞선 배지를 얻었다면 도전하세요.','레벨 '+gym.level+'과 상처약을 준비하세요.\n센터에서 회복하고 상점에 들러요.']);return true;
  }
  if(id==='trailGuide'){
    g.healParty();if(!g.save.badges.length)g.save.inventory.potions=Math.max(2,g.save.inventory.potions);g.persist();
    const directions=g.save.map==='tour_eterna_forest'
      ?['흙길을 따르면 풀밭을 피할 수 있어요.\n북쪽은 영원시티, 남쪽은 축복시티예요.']
      :g.save.map==='tour_coronet'
      ?['북쪽은 영원시티, 남쪽은 연고시티예요.\n동쪽 갈림길은 신오 호수로 이어져요.','바위 왼쪽 풀밭에서 훈련할 수 있어요.\n풀밭을 피하려면 흙길을 따라가세요.']
      :['가운데 길은 안전하고 풀밭은 훈련 장소예요.\n서쪽으로 돌아갈 수도 있어요.'];
    g.say('길 안내원',[g.save.badges.length?'포켓몬들이 모두 건강해졌어요.\n도구는 마을 상점에서 구입하세요.':'포켓몬을 회복하고 상처약을\n2개까지 채웠어요.',...directions]);return true;
  }
  if(id==='sinnohGuide'){
    const has=(badge:string)=>g.save.badges.includes(badge);
    const pages=g.save.map==='tour_eterna'
      ?has('BADGE-GS02')?['유채에게 승리했군요. 천관산 길을 지나\n연고의 멜리사에게 도전해 보세요.','얼마 전 시계가 3초 늦어졌어요.\n다른 도시에서도 같은 일이 있었대요.']:['천관산 연결길을 지나면 연고예요.\n먼저 유채의 체육관에 도전해 보세요.','얼마 전 시계가 3초 늦어졌어요.\n다른 도시에서도 같은 일이 있었대요.']
      :g.save.map==='tour_hearthome'
      ?has('BADGE-GS03')?['멜리사에게 승리했군요. 길 안내판을 따라\n장막의 자두 체육관으로 가 보세요.','역의 시계 기록도 3초가 어긋났대요.\n장막 연구원이 기록을 모으고 있어요.']:['이곳은 멜리사의 체육관이 있는 연고예요.\n길 안내판을 따라 장막으로 갈 수 있어요.','역의 시계 기록도 3초가 어긋났대요.\n장막 연구원이 기록을 모으고 있어요.']
      :g.save.flags.researchDelivered?['GYM 간판이 있는 곳이 자두의 체육관이에요.\n관측 자료는 무사히 전달됐대요.','다른 지방도 자유롭게 둘러보며\n새로운 소식을 찾아보세요.']:['GYM 간판이 있는 곳이 자두의 체육관이에요.\n승리하면 마을의 관측 연구원을 만나세요.'];
    g.say('도시 안내원',pages);return true;
  }
  if(id==='observation'){
    if(!GYMS.every(gym=>g.save.badges.includes(gym.badge))){g.say('관측 연구원',['신오의 네 체육관을 돌아온 뒤\n관측 자료 전달을 부탁하고 싶어요.']);return true}
    if(g.save.flags.researchDelivered){
      g.say('관측 연구원',['자료를 무사히 전달해 주셨군요.\n축복과 운하에서 조사가 시작되었어요.','선원을 만나 바다 건너의 다른 지방도\n자유롭게 둘러보고 오세요.']);
      return true;
    }
    g.save.flags.observationCollected=true;g.persist();g.say('관측 연구원',['도시의 시계와 열차 기록이\n같은 순간 3초씩 어긋났어요.','관측 자료를 맡길게요. 축복시티\n연구 통로 안내원에게 전해 주세요.']);return true;
  }
  if(id==='researchGate'){
    if(!g.save.flags.observationCollected){g.say('연구 통로 안내원',['무쇠·영원·연고·장막의 네 배지와\n장막 관측 연구원의 자료가 필요해요.']);return true}
    if(!g.save.flags.researchDelivered){g.say('연구 통로 안내원',['장막의 관측 자료를 받았어요.\n은솔박사의 공동조사 소개도 도착했어요.','연구 연결길로 운하시티에 가세요.\n선원이 무료 왕복 승선을 도와줄 거예요.'],()=>{g.save.flags.researchDelivered=true;g.persist()});return true}
    g.say('연구 통로 안내원',['연구 연결길은 운하시티로 이어져요.\n배를 타도 이곳으로 돌아올 수 있어요.']);return true;
  }
  if(id==='ferry'){
    if(!g.save.flags.researchDelivered){g.say('조사선 선원',['축복의 연구 통로 안내를 마치고 와 주세요.']);return true}
    const outbound=g.save.map==='tour_canalave';
    g.say('조사선 선원',[outbound?'관동 갈색항으로 출발합니다.\n조사 승선은 왕복 무료예요.':'신오 운하항으로 돌아갈 수 있어요.\n갈색시티와 주변 마을도 둘러보세요.'],undefined,[{label:outbound?'갈색항으로 간다':'운하항으로 돌아간다',action:()=>{
      g.save.flags.ferryPass=true;g.save.map=outbound?'tour_vermilion':'tour_canalave';g.save.player={...TOUR_SPAWNS[g.save.map as keyof typeof TOUR_SPAWNS],facing:'down'};g.keys.clear();g.labelTime=3;g.persist();
      g.say('조사선 선원',[outbound?'갈색항에 도착했습니다!\n돌아갈 때도 제게 말해 주세요.':'운하항에 도착했습니다!\n연구 연결길로 축복에 갈 수 있어요.']);
    }},{label:'아직 머무른다',action:()=>{}}]);return true;
  }
  return false;
}
