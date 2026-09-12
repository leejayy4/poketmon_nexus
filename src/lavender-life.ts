import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { KANTO_ROUTE_NINE,KANTO_ROCK_TUNNEL_1F,KANTO_ROCK_TUNNEL_B1F,KANTO_ROUTE_TEN_SOUTH } from './kanto-lavender-approach';
import { trainerWinFlag } from './road-trainers';

const LAVENDER_MAPS=new Set(['tour_lavender','tour_lavender_center','tour_lavender_hall','tour_lavender_hall_2f','tour_lavender_hall_3f','tour_lavender_mart','tour_lavender_home1','tour_lavender_home2']);

/** Optional town-life reactions. They never reward, heal, or gate travel. */
export function handleLavenderLife(g:Engine,event:string):boolean{
  if(!LAVENDER_MAPS.has(g.save.map))return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle;
  const visited=new Set(save.tourVisited??[]);
  const crossedTunnel=[KANTO_ROCK_TUNNEL_1F,KANTO_ROCK_TUNNEL_B1F,KANTO_ROUTE_TEN_SOUTH].every(id=>visited.has(id));
  const healthy=save.party.filter(mon=>mon.hp>0),hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp),fainted=save.party.filter(mon=>mon.hp<=0);
  const partyLine=save.party.length?`동료 ${save.party.length}마리 · 건강 ${healthy.length} · 부상 ${hurt.length} · 기절 ${fainted.length}`:'현재 함께 걷는 동료가 없다. 센터 PC에서 맡긴 동료를 확인할 수 있다.';
  const localOrigins=new Set(['관동 9번도로','관동 10번도로 북부','관동 10번도로 남부','돌산터널 B1F']);
  const localParty=save.party.filter(mon=>localOrigins.has(mon.met)),localBox=(save.box??[]).filter(mon=>localOrigins.has(mon.met));
  const local=[...localParty,...localBox],localNames=[...new Set(local.map(mon=>SPECIES[mon.species].name))];
  const localLine=local.length?`동부 산길에서 만난 보유 동료 ${local.length}마리 · 파티 ${localParty.length} · PC ${localBox.length}\n${localNames.slice(0,5).join('·')}`:'9번도로·10번도로·돌산터널에서 잡은 동료는 아직 없다.';
  const wins=[
    [trainerWinFlag('kanto-route-9-practice'),'9번도로'],
    [trainerWinFlag('kanto-rock-tunnel-practice'),'돌산터널 B1F'],
    [trainerWinFlag('kanto-route-10-south-practice'),'10번도로 남부'],
  ] as const;
  const wonNames=wins.filter(([flag])=>Boolean(save.flags[flag])).map(([,name])=>name);
  const challengeLine=wonNames.length?`선택 배틀 승리 ${wonNames.length}/3 · ${wonNames.join('·')}`:'선택 배틀 승리 기록은 아직 없다.';
  const surveyLine=save.flags.researchDelivered
    ?save.flags.ferryPass?'신오의 관측 자료를 전달하고 조사선으로 갈색항에 온 뒤 이어진 관동 여행이다. 보라의 기록은 그 자료의 원인을 해결했다는 뜻이 아니다.':'신오의 관측 자료 전달은 끝났다. 조사선 이용과 보라타운 자유 여행은 서로 다른 기록이다.'
    :'보라타운 방문은 자유 여행이며 신오의 관측 자료 전달이나 조사선 이용을 대신 완료하지 않는다.';
  const guide=(map:Parameters<Engine['setTourDestination']>[0],title:string,text:string)=>()=>{if(!current())return;g.setTourDestination(map);g.say(title,[text,'아래 지도에 목적지를 표시했다. 실제 표지와 길을 따라 걸어가자.']);};

  if(event==='tourLavenderFlowerTable'){
    if(!healthy.length){g.say('함께 돌보는 꽃 작업대',[partyLine,'함께 꽃을 돌볼 건강한 동료가 없다. 실제 회복은 포켓몬센터 간호사에게 부탁하자.','꽃 관리는 보상이나 진행 조건이 아니다.']);return true;}
    g.say('함께 돌보는 꽃 작업대',[partyLine,'시든 잎만 정리하고 흙을 고르게 덮을 동료를 고르자. HP나 상태는 변하지 않는다.'],undefined,[
      ...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(!current('tour_lavender')||!save.party.includes(mon)||mon.hp<=0)return;const first=!save.flags.lavenderFlowerCare;save.flags.lavenderFlowerCare=true;save.flags.lavenderFlowerCareSpecies=mon.species;g.persist();g.say('추모 꽃정원 돌봄',[`${SPECIES[mon.species].name}와 시든 잎을 골라내고 흙 가장자리를 천천히 다듬었다.`,first?'함께 돌본 시간을 짧게 기록했다.':'앞서 돌본 기록 옆에 오늘 함께한 동료를 다시 적었다.','아이템·회복·보상·통행 변화는 없다.']);}})),
      {label:'다음에 돌본다',action:()=>{}}
    ]);return true;
  }
  if(event==='tourLavenderGardenTracks'){
    const cared=Number(save.flags.lavenderFlowerCareSpecies||0),name=SPECIES[cared]?.name;
    g.say('정원 가장자리 발자국',[save.flags.lavenderFlowerCare&&name?`${name}와 꽃을 돌본 자리 가까이에 크기가 다른 발자국이 나란히 남아 있다.`:'작은 발자국과 큰 발자국이 조각상 둘레를 같은 방향으로 돌고 있다.','주민과 포켓몬이 서두르지 않고 함께 걸은 생활 흔적이다. 야생 조우 표시는 아니다.']);return true;
  }
  if(event==='tourLavenderWaterBowl'){
    g.say('동료용 물그릇',[partyLine,hurt.length||fainted.length?'지친 동료는 물만으로 회복되지 않는다. 북서쪽 포켓몬센터 간호사에게 부탁하자.':'깨끗한 물과 몸집별 그릇이 준비되어 있다. 주민과 동료가 함께 관리한다.','이곳에서는 HP·상태가 변하지 않는다.']);return true;
  }
  if(event==='tourLavenderArrivalStone'||event==='lavenderCenterRouteChart'){
    const center=event==='lavenderCenterRouteChart';
    g.say(center?'보라타운 여행 안내도':'10번도로 도착 표석',[crossedTunnel?'9번도로와 10번도로 북부, 돌산터널1F/B1F, 10번도로 남부를 지나 보라타운까지 온 기록이 이어져 있다.':'북쪽 본선은 10번도로 남부 → 돌산터널1F/B1F → 10번도로 북부 → 9번도로 → 블루시티 순서다.',...(center?[localLine,challengeLine,partyLine,surveyLine]:[]),'서쪽은 노랑시티 방향, 남쪽은 연분홍시티 방향의 기존 연결길이다.'],undefined,[
      ...(center?[
        {label:'현재 파티 확인',action:()=>{if(!current('tour_lavender_center'))return;g.panel='party';g.partyIndex=0;}},
        {label:'센터 PC 안내',action:()=>{if(!current('tour_lavender_center'))return;g.setTourDestination('tour_lavender_center','pc');g.say('보라 편성 안내',['센터 안 PC에서 파티와 박스의 동료를 맡기거나 데려올 수 있다.',localLine,'지도 표시는 자동 편성이나 회복을 하지 않는다.']);}},
      ]:[]),
      {label:'10번도로 남부',action:guide(KANTO_ROUTE_TEN_SOUTH,'보라 북쪽 안내','북쪽 출구에서 10번도로 남부 전망 언덕으로 올라간다.')},
      {label:'돌산터널 B1F',action:guide(KANTO_ROCK_TUNNEL_B1F,'돌산터널 안내','10번도로 남부에서 1F 북부로 들어가 밝은 표식을 따라 B1F 선택 순환로에 닿는다.')},
      {label:'9번도로',action:guide(KANTO_ROUTE_NINE,'9번도로 안내','돌산터널과 10번도로 북부를 지나 9번도로로 돌아간다.')},
      {label:'안내를 마친다',action:()=>{}}
    ]);return true;
  }
  if(save.map==='tour_lavender'&&event==='tourGuide'){
    g.say('보라타운 안내원',[partyLine,crossedTunnel?'돌산터널을 지나왔다면 먼저 센터에서 동료 상태를 살피고, 추모 꽃정원과 탑에서는 조용히 걸어 주세요.':'북쪽은 10번도로 남부와 돌산터널, 서쪽과 남쪽은 기존 도시 연결길이다.',surveyLine,'꽃정원 돌봄과 추모탑 기록은 선택 생활이며 사건 해결이나 보상이 아니다.'],undefined,[
      {label:'센터에서 쉬기',action:guide('tour_lavender_center','보라 회복 안내','북서쪽 포켓몬센터에서 동료를 실제로 회복하고 PC를 이용할 수 있다.')},
      {label:'추모탑 둘러보기',action:guide('tour_lavender_hall','추모탑 안내','동쪽 추모탑에서 공동 기억·돌봄 기록·마을 전망을 층별로 볼 수 있다.')},
      {label:'꽃 작업대 찾기',action:guide('tour_lavender','추모 꽃정원 안내','서쪽 꽃정원 가장자리의 공동 작업대에서 건강한 동료와 꽃을 돌볼 수 있다.')},
      {label:'10번도로로 돌아가기',action:guide(KANTO_ROUTE_TEN_SOUTH,'보라 북쪽 안내','북쪽 출구로 나가 10번도로 남부와 돌산터널 방향으로 올라간다.')},
      {label:'갈색항 귀환 길',action:guide(KANTO_ROUTE_NINE,'갈색항 방향 안내','9번도로 서쪽 블루시티에서 5번도로 → 남북 지하통로 → 6번도로 순서로 내려가면 갈색시티다. 조사선은 항구의 별도 선원에게 확인한다.')},
      {label:'안내를 마친다',action:()=>{}}
    ]);return true;
  }
  if(save.map==='tour_lavender'&&event==='tourPokemon'){
    const cared=Number(save.flags.lavenderFlowerCareSpecies||0),companion=SPECIES[cared]?.name;
    g.say('추모 정원의 삐삐',['삐삐…\n꽃밭 가장자리에서 발소리를 낮추고 천천히 한 바퀴 돈다.',companion?`${companion}와 꽃을 돌본 자리 앞에서 잠시 멈춰 고개를 끄덕인다.`:'공동 작업대와 동료용 물그릇 사이를 살피고 주민 곁으로 돌아간다.','마을에서 함께 사는 포켓몬이며 새 야생 조우나 포획 대상이 아니다.']);return true;
  }
  if(event==='lavenderTowerCareRecords'||event==='lavenderTowerCompanionSeat'){
    g.say('포켓몬 돌봄 기록',[partyLine,localLine,hurt.length||fainted.length?'기록에는 지친 동료를 조용한 자리에서 쉬게 한 뒤 센터에서 치료받은 순서가 적혀 있다.':'먹이·휴식·함께 걸은 장소를 종마다 다르게 기록한 책이 놓여 있다.',save.flags.lavenderFlowerCare?'밖의 꽃정원에서 동료와 함께 돌본 시간도 이런 일상 기록과 닮았다.':'밖의 꽃정원에서는 건강한 동료와 비보상 돌봄 활동을 할 수 있다.']);return true;
  }
  if(event==='lavenderTowerVisitorBook'){
    g.say('방문 기록 수첩',[crossedTunnel?'지나온 9번도로·10번도로·돌산터널과 지금 함께한 동료를 기록할 수 있다.':'오늘 함께한 동료와 보라타운에서 본 풍경을 자유롭게 적는 수첩이다.',localLine,challengeLine,surveyLine,'기록은 보상·사건 완료·통행 조건이 아니다.'],undefined,[
      {label:save.flags.lavenderReflectionLogged?'기록 다시 읽기':'짧게 기록하기',action:()=>{if(!current('tour_lavender_hall_3f'))return;const first=!save.flags.lavenderReflectionLogged;save.flags.lavenderReflectionLogged=true;if(first)g.persist();g.say('보라타운 방문 기록',[crossedTunnel?'돌산터널의 광물 표식과 보라타운 전망 언덕을 차례로 적었다.':'보라타운 꽃정원에서 본 풍경을 짧게 적었다.',local.length?`동부 산길에서 만난 ${localNames.slice(0,5).join('·')}의 이름도 함께 남겼다.`:'함께 걷는 동료와 아직 만나지 못한 산길 포켓몬을 구분해 적었다.',challengeLine,first?'조용한 방문 기록을 남겼다.':'앞서 남긴 기록을 다시 읽었다.','보상이나 진행 변화는 없다.']);}},
      {label:'기록하지 않는다',action:()=>{}}
    ]);return true;
  }
  if(event==='lavenderCenterTunnelBench'){g.say('터널 여행 동료 휴게석',[partyLine,crossedTunnel?'돌산터널에서 묻은 흙을 닦을 마른 수건이 놓여 있다.':'산길과 터널을 오가는 동료가 밝은 실내에 적응하며 쉬는 자리다.','이 좌석은 회복하지 않는다. 치료는 간호사에게 부탁하자.']);return true;}
  if(event==='lavenderMartTunnelShelf'||event==='lavenderMartPackingBench'||event==='lavenderMartFlowerShelf'){
    g.say('보라 여행 보급 안내',[partyLine,'북쪽은 10번도로 남부와 돌산터널, 서쪽과 남쪽은 기존 도시 연결길이다.','현재 실제 판매 품목은 점원의 몬스터볼과 상처약이다.']);return true;
  }
  if(event==='lavenderHomeGardenTools'||event==='lavenderHomeWalkAlbum'){
    g.say('꽃정원과 동행 기록',[save.flags.lavenderFlowerCare?'밖의 꽃정원에서 동료와 함께 시든 잎을 정리한 기록이 사진책 옆에 놓여 있다.':'사람과 포켓몬이 꽃정원과 10번도로 전망 언덕을 함께 걷는 사진이 모여 있다.','생활 기록은 아이템이나 사건 조건이 아니다.']);return true;
  }
  if(event==='lavenderHomeWaterChart'||event==='lavenderHomeMemoryShelf'||event==='lavenderHomeFamilyRest'){
    g.say('가족과 동료 돌봄',[partyLine,save.flags.lavenderReflectionLogged?'추모탑에서 남긴 조용한 방문 기록처럼, 이 집도 함께한 시간과 남은 동료의 일상을 함께 적는다.':'물그릇을 닦는 시간과 동료가 쉬는 자리를 매일 살피는 생활표다.','회복이 필요하면 센터를 이용하고, 이곳의 휴식은 HP를 바꾸지 않는다.']);return true;
  }
  if(save.map==='tour_lavender'&&event==='tourResident0'){g.say('정원을 돌보는 주민',[save.flags.lavenderFlowerCare?'동료와 시든 잎을 정리했군요. 꽃보다 함께 천천히 돌본 시간이 더 오래 남아요.':'꽃 작업대에서는 건강한 동료와 시든 잎을 정리할 수 있어요.',partyLine]);return true;}
  if(save.map==='tour_lavender'&&event==='tourResident1'){g.say('탑 방문객',[save.flags.lavenderReflectionLogged?'위층 수첩에 조용한 기록을 남겼구나. 보상을 위한 기록이 아니라 더 좋단다.':'추모탑은 공동 기억, 돌봄 기록, 조용한 전망을 층마다 나누어 두었단다.',crossedTunnel?'터널에서 온 길과 마을 꽃정원이 위층에서 함께 보일 게다.':'말없이 동료와 머물러도 괜찮은 곳이란다.']);return true;}
  return false;
}
