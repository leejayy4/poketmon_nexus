import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { JOHTO_ROUTE_32,JOHTO_ROUTE_33,UNION_CAVE_1F } from './johto-south-route';

const AZALEA_MAPS=new Set(['tour_azalea','tour_azalea_center','tour_azalea_hall','tour_azalea_mart','tour_azalea_home1','tour_azalea_home2']);

/** Optional village-life observations. They never grant items, heal, or gate travel. */
export function handleAzaleaLife(g:Engine,event:string):boolean{
  if(!AZALEA_MAPS.has(g.save.map))return false;
  const save=g.save,current=(map=save.map)=>g.save===save&&save.map===map&&!g.battle;
  const guide=(map:Parameters<Engine['setTourDestination']>[0],title:string,text:string)=>()=>{
    if(!current())return;g.setTourDestination(map);g.say(title,[text,'아래 지도에 목적지를 표시했다. 실제 표지와 길을 따라 걸어가자.']);
  };
  if(event==='tourAzaleaApricornYard'){
    g.say('공방 앞 규토리 마당',[save.flags.azaleaApricornPrepared?'색과 단단함별로 나눈 규토리가 마른 천 위에 놓여 있다. 앞서 남긴 분류 표시도 보인다.':'마을 사람들이 주운 규토리를 색과 단단함에 따라 나눌 준비를 한다.','이 활동은 공방 생활 관찰이며 볼 제작이나 아이템 지급은 없다.'],undefined,[
      {label:save.flags.azaleaApricornPrepared?'분류 표시 다시 보기':'규토리 나누어 보기',action:()=>{if(!current('tour_azalea'))return;const first=!save.flags.azaleaApricornPrepared;save.flags.azaleaApricornPrepared=true;if(first)g.persist();g.say('규토리 분류',[first?'상처 난 열매와 단단한 열매를 나누고 색별 칸에 놓았다.':'앞서 나눈 규토리와 건조 순서를 다시 확인했다.','공방 안 선별 작업대에서 손질 과정을 이어서 살펴볼 수 있다.']);}},
      {label:'공방 작업대 찾기',action:guide('tour_azalea_hall','고동 공방 안내','마을 공방 안쪽의 규토리 선별 작업대로 가자.')},
      {label:'33번도로 확인',action:guide(JOHTO_ROUTE_33,'고동 출발 안내','북쪽 출구로 나가 33번도로를 지나면 연결동굴 1층에 닿는다.')},
      {label:'그대로 둔다',action:()=>{}}
    ]);return true;
  }
  if(event==='azaleaHallSortingDesk'){
    g.say('규토리 선별 작업대',[save.flags.azaleaApricornPrepared?'마당에서 나눈 규토리가 색과 단단함별 칸에 들어 있다.':'빈 칸마다 색과 단단함 표시가 붙어 있다. 마당에서 규토리를 먼저 나누어 볼 수 있다.',save.flags.azaleaWorkshopObserved?'앞서 기록한 솔질과 건조 순서가 작업 수첩에 남아 있다.':'표면을 닦고 갈라진 열매를 골라낸 뒤 건조 선반으로 옮기는 과정이다.'],undefined,[
      {label:save.flags.azaleaWorkshopObserved?'작업 기록 다시 보기':'선별 과정 기록',action:()=>{if(!current('tour_azalea_hall'))return;const first=!save.flags.azaleaWorkshopObserved;save.flags.azaleaWorkshopObserved=true;if(first)g.persist();g.say('공방 작업 기록',[first?'솔질·선별·건조 순서를 수첩에 적었다.':'앞서 적은 선별 순서를 다시 읽었다.','관찰 기록은 선택이며 완성품, 보상, 통행 조건이 생기지 않는다.']);}},
      {label:'건조 선반 보기',action:()=>{if(current('tour_azalea_hall'))g.say('공방 건조 안내',['작업대 동쪽 선반에 씻은 규토리가 놓여 있다.','그 옆 낮은 휴게석에서는 건강한 동료와 잠시 쉴 수 있다.']);}},
      {label:'마당으로 돌아가기',action:guide('tour_azalea','고동 공방 안내','공방 밖 동쪽 규토리 마당으로 돌아가 분류 과정을 살펴보자.')},
      {label:'관찰을 마친다',action:()=>{}}
    ]);return true;
  }
  if(event==='azaleaHallDryingShelf'){
    g.say('공방 건조 선반',[save.flags.azaleaWorkshopObserved?'선별 기록과 같은 순서로 규토리를 띄워 놓아 바람이 고르게 지난다.':'씻은 규토리를 서로 닿지 않게 벌려 놓았다. 선별 작업대에서 앞 과정을 볼 수 있다.','현재는 제작 기능이나 완성품 지급 없이 공방 생활만 관찰한다.']);return true;
  }
  if(event==='azaleaHallPokemonRest'){
    const healthy=save.party.filter(mon=>mon.hp>0);
    if(!healthy.length){g.say('동료 작업 휴게석',['함께 쉴 수 있는 건강한 동료가 없다.','실제 회복은 포켓몬센터 간호사에게 부탁하자.']);return true;}
    g.say('동료 작업 휴게석',['물그릇과 부드러운 솔이 놓인 낮은 자리다. 함께 쉴 동료를 고르자.','이 휴식은 생활 기록이며 HP나 상태를 회복하지 않는다.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(!current('tour_azalea_hall')||!save.party.includes(mon)||mon.hp<=0)return;const first=!save.flags.azaleaCompanionRested;save.flags.azaleaCompanionRested=true;if(first)g.persist();g.say('공방 동료 휴식',[`${SPECIES[mon.species].name}와 규토리 향이 나는 공방에서 잠시 쉬었다.`,first?'동료 휴식 기록을 남겼다. HP와 상태는 변하지 않는다.':'앞서 남긴 휴식 기록을 다시 확인했다.','치료가 필요하면 마을 포켓몬센터를 이용하자.']);}})),{label:'쉬지 않는다',action:()=>{}}]);return true;
  }
  if(event==='tourAzaleaWell'){
    const first=!save.flags.azaleaWellObserved;save.flags.azaleaWellObserved=true;if(first)g.persist();
    g.say('야돈우물 주변 관찰석',['돌담 안 샘터의 물결과 진흙에 남은 둥근 발자국을 멀리서 살폈다.',first?'우물 주변 생태 관찰을 수첩에 남겼다.':'앞서 남긴 물높이와 발자국 기록을 다시 확인했다.','현재 관찰은 야돈 구조 사건 완료를 뜻하지 않으며 보상이나 진행 변화가 없다.']);return true;
  }
  if(event==='tourAzaleaRoute33Stone'){
    g.say('33번도로 출발 표석',['북쪽 출구 → 33번도로 → 연결동굴 1층 → 32번도로 → 도라지시티','연결동굴 본선은 지하 선택층을 거치지 않는다. 회복과 도구가 필요하면 마을에서 준비하자.'],undefined,[
      {label:'33번도로 표시',action:guide(JOHTO_ROUTE_33,'33번도로 안내','고동마을 북쪽 출구에서 짧은 빗길인 33번도로로 나간다.')},
      {label:'연결동굴 표시',action:guide(UNION_CAVE_1F,'연결동굴 안내','33번도로 서쪽 끝에서 연결동굴 1층 통과층으로 들어간다.')},
      {label:'32번도로 표시',action:guide(JOHTO_ROUTE_32,'32번도로 안내','연결동굴 북쪽 출구 뒤 32번도로를 따라 도라지시티로 간다.')},
      {label:'안내를 마친다',action:()=>{}}
    ]);return true;
  }
  if(save.map==='tour_azalea'&&event==='tourGuide'){
    const healthy=save.party.filter(mon=>mon.hp>0).length,hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length;
    g.say('고동마을 안내원',[save.party.length?`함께 걷는 동료 ${save.party.length}마리 · 건강 ${healthy} · 부상 ${hurt} · 기절 ${fainted}`:'현재 함께 걷는 동료가 없다. 센터 PC에서 맡긴 동료를 확인할 수 있다.','동쪽 규토리 마당과 공방에서는 마을의 손질 일을 살펴볼 수 있다. 남쪽 샘터는 돌담 밖에서 관찰하자.','다음 본선은 북쪽 33번도로 → 연결동굴 1층 → 32번도로 → 도라지시티다.'],undefined,[
      {label:'센터에서 쉬기',action:guide('tour_azalea_center','고동 회복 안내','서쪽 포켓몬센터에서 동료를 회복하고 PC를 이용할 수 있다.')},
      {label:'상점에서 준비',action:guide('tour_azalea_mart','고동 보급 안내','마을 상점 점원에게 몬스터볼과 상처약을 살 수 있다.')},
      {label:'규토리 공방',action:guide('tour_azalea_hall','고동 공방 안내','규토리 마당에서 분류한 뒤 공방 작업대에서 선별 과정을 볼 수 있다.')},
      {label:'33번도로로 출발',action:guide(JOHTO_ROUTE_33,'고동 출발 안내','북쪽 출구에서 33번도로로 나가 연결동굴 방향으로 걷자.')},
      {label:'안내를 마친다',action:()=>{}}
    ]);return true;
  }
  if(save.map==='tour_azalea'&&event==='tourPokemon'){
    g.say('공방 마당의 찌르꼬',['찌르르!\n떨어진 잎을 살피다가 규토리 천에서는 한 걸음 물러난다.',save.flags.azaleaApricornPrepared?'사람들이 나누어 둔 규토리를 건드리지 않고 공방 처마 쪽으로 깡충 이동한다.':'빈 분류 천 가장자리에서 공방 장인의 움직임을 바라본다.','마을에서 함께 사는 포켓몬이며 현재 고동 야생 조우나 포획 대상으로 등록된 개체가 아니다.']);return true;
  }
  if(event==='azaleaCenterRouteChart'){
    const origins=new Set(['너도밤나무숲','성도 33번도로','연결동굴 1층','성도 32번도로']);
    const local=[...save.party,...save.box??[]].filter(mon=>origins.has(mon.met));
    const localNames=local.length?[...new Set(local.map(mon=>SPECIES[mon.species].name))].join('·'):'없음';
    const cared=Number(save.flags.azaleaIlexCaredSpecies??0);
    g.say('고동 여행 준비 지도',['서쪽은 너도밤나무숲과 34번도로·금빛시티 방향이다.','북쪽 본선은 33번도로 → 연결동굴 1층 → 32번도로 → 도라지시티 순서다.',`숲·도로·동굴에서 만난 보유 동료: ${local.length}마리\n${localNames}`,cared&&SPECIES[cared]?`센터 휴게석에서 ${SPECIES[cared].name}의 숲길 먼지를 돌본 기록이 있다.`:'너도밤나무숲에서 만난 동료는 센터 휴게석에서 돌볼 수 있다.','동료가 다쳤다면 간호사에게 실제 회복을 부탁하고, 도구는 마을 상점에서 준비하자.'],undefined,[
      {label:'현재 파티 확인',action:()=>{if(!current('tour_azalea_center'))return;g.panel='party';g.partyIndex=0;}},
      {label:'센터 PC 안내',action:()=>{if(!current('tour_azalea_center'))return;g.setTourDestination('tour_azalea_center','pc');g.say('고동 편성 안내',['센터 안 PC에서 파티와 박스의 동료를 맡기거나 데려올 수 있다.','길안내 표시는 자동 편성이나 회복을 하지 않는다.']);}},
      {label:'공방 휴게석 안내',action:guide('tour_azalea_hall','고동 동료 휴식 안내','공방 낮은 휴게석에서 건강한 동료와 생활 기록을 남길 수 있다. HP는 회복되지 않는다.')},
      {label:'너도밤나무숲 포획·실전',action:guide('tour_ilex','너도밤나무숲 안내','마을 서쪽 출구는 너도밤나무숲 동쪽 길에 닿는다. 남쪽 순환길의 긴풀과 비조우 공터에서 포획·선택 배틀을 이어갈 수 있다.')},
      {label:'33번도로 도전',action:guide(JOHTO_ROUTE_33,'고동 다음 도전 안내','33번도로의 선택 풀밭과 새잡이 도전을 살핀 뒤 연결동굴로 진행할 수 있다.')},
      {label:'지도를 덮는다',action:()=>{}}
    ]);return true;
  }
  if(event==='azaleaCenterForestBench'){
    const forestParty=save.party.filter(mon=>mon.met==='너도밤나무숲'&&mon.hp>0);
    const forestBox=(save.box??[]).filter(mon=>mon.met==='너도밤나무숲');
    const cared=Number(save.flags.azaleaIlexCaredSpecies??0);
    if(!forestParty.length){
      g.say('숲 여행 동료 휴게석',[
        forestBox.length?`너도밤나무숲에서 만난 동료 ${forestBox.length}마리는 현재 PC에 있다.`:'현재 파티와 PC에 너도밤나무숲에서 만난 동료가 없다.',
        forestBox.length?'센터 PC에서 동료를 데려오면 마른 수건과 부드러운 솔로 돌볼 수 있다.':'숲 포획은 선택이며 다른 동료와도 여행을 계속할 수 있다.',
        cared&&SPECIES[cared]?`앞서 ${SPECIES[cared].name}의 잎가루와 흙을 털어 준 기록이 남아 있다.`:'이 좌석의 돌봄은 HP를 회복하지 않는다. 실제 치료는 간호사에게 부탁하자.',
      ]);return true;
    }
    g.say('숲 여행 동료 휴게석',[
      '너도밤나무숲에서 함께 온 건강한 동료의 잎가루와 흙을 털어 줄 수 있다.',
      '이 돌봄은 생활 기록이며 HP·상태·능력치를 바꾸지 않는다.',
    ],undefined,[...forestParty.map(mon=>({label:SPECIES[mon.species].name,action:()=>{
      if(!current('tour_azalea_center')||!save.party.includes(mon)||mon.met!=='너도밤나무숲'||mon.hp<=0)return;
      const first=save.flags.azaleaIlexCompanionCared!==true,changed=Number(save.flags.azaleaIlexCaredSpecies??0)!==mon.species;
      save.flags.azaleaIlexCompanionCared=true;save.flags.azaleaIlexCaredSpecies=mon.species;if(first||changed)g.persist();
      const behavior=({10:'몸의 마디 사이에 붙은 마른 잎을 부드럽게 털어 주었다.',11:'단단한 껍질에 묻은 흙을 마른 천으로 닦아 주었다.',13:'작은 가시를 피해 몸 아래의 잎가루를 살살 털어 주었다.',14:'단단한 껍질의 홈에 낀 흙을 부드러운 솔로 정리했다.',41:'날개막을 문지르지 않도록 발과 등에 묻은 먼지만 털어 주었다.'} as Record<number,string>)[mon.species]??'숲길에서 묻은 잎가루와 흙을 마른 천으로 닦아 주었다.';
      g.say('너도밤나무숲 동료 돌봄',[`${SPECIES[mon.species].name}: ${behavior}`,first?'고동센터 휴게 기록을 남겼다.':'앞서 남긴 휴게 기록을 현재 동료로 갱신했다.','HP와 상태는 변하지 않는다. 실제 회복이 필요하면 간호사에게 부탁하자.']);
    }})),{label:'돌봄을 마친다',action:()=>{}}]);return true;
  }
  if(event==='azaleaCenterApricornPlant'){g.say('규토리 묘목 화분',['어린 잎의 색과 흙의 습도를 살폈다.','열매 채집이나 아이템 획득은 없으며 공방 밖 마당에서 분류 생활을 체험할 수 있다.']);return true;}
  if(event==='azaleaMartCaveChart'||event==='azaleaMartTrailShelf'||event==='azaleaMartPackingBench'){
    g.say('고동 여행 보급 안내',['33번도로의 젖은 길 뒤에는 연결동굴 1층과 긴 32번도로가 이어진다.','현재 판매 품목은 점원의 몬스터볼과 상처약이다. 동료 상태는 센터에서 확인하자.']);return true;
  }
  if(event==='azaleaHomeWellChart'||event==='azaleaHomeEcologyShelf'){
    g.say('우물과 숲 생태 기록',[save.flags.azaleaWellObserved?'샘터에서 본 물높이와 둥근 발자국 기록이 책의 관찰법과 이어진다.':'샘터의 포켓몬을 놀라게 하지 않도록 돌담 밖에서 물결과 발자국을 보는 방법이 적혀 있다.','관찰은 선택이며 야돈 구조 사건이나 포획을 대신하지 않는다.']);return true;
  }
  if(event==='azaleaHomeApricornTools'||event==='azaleaHomeWorkshopLog'){
    g.say('고동 공방 생활 기록',[save.flags.azaleaWorkshopObserved?'직접 살핀 솔질·선별·건조 순서가 주민의 기록과 맞는다.':'마당에서 나눈 규토리를 솔질하고 선별한 뒤 건조하는 순서가 적혀 있다.','공방 관찰은 선택이며 볼 제작이나 지급 기능은 아직 없다.']);return true;
  }
  if(event==='azaleaHomePokemonBed'||event==='azaleaHomeFamilyRest'){
    const cared=Number(save.flags.azaleaIlexCaredSpecies??0);
    g.say('마을 동료 쉼터',[save.flags.azaleaCompanionRested?'공방에서 동료와 쉬었던 기록을 떠올리며 낮은 방석을 살폈다.':'사람 곁에서 포켓몬도 편히 누울 수 있도록 낮은 방석과 물그릇을 두었다.',cared&&SPECIES[cared]?`센터에서 ${SPECIES[cared].name}의 숲길 먼지를 털어 준 기록처럼, 마을에서는 여행 뒤 동료의 몸을 먼저 살핀다.`:'너도밤나무숲을 지나온 동료는 센터 휴게석에서 잎가루와 흙을 털어 줄 수 있다.','실제 회복이 필요하면 포켓몬센터를 이용하자.']);return true;
  }
  if(save.map==='tour_azalea'&&event==='tourResident0'){g.say('공방 장인',[save.flags.azaleaWorkshopObserved?'선별 순서를 잘 보았구나. 완성품보다 동료가 쉬는 때도 함께 기록한단다.':'동쪽 마당에서 규토리를 나누고 공방 작업대에서 손질 순서를 볼 수 있단다.','마을 북쪽은 33번도로와 연결동굴로 이어진다.']);return true;}
  if(save.map==='tour_azalea'&&event==='tourResident1'){g.say('우물가 주민',[save.flags.azaleaWellObserved?'샘터의 발자국을 멀리서 살폈군요. 물가의 포켓몬을 놀라게 하지 않는 게 좋아요.':'남쪽 샘터에서는 돌담 밖에서 물결과 발자국을 살펴봐요.','북쪽 출구로 가면 33번도로, 연결동굴 1층, 32번도로 순서로 도라지에 닿아요.']);return true;}
  return false;
}
