import type { Engine } from './engine';
import type { Choice,SaveData } from './types';
import { TOUR_INTERIORS,TOUR_OUTDOORS } from './explore-world';
import { SPECIES } from './pokemon';
import { startPalletSparring } from './pallet-sparring';

const CITY='tour_vermilion';
const COASTS=['tour_pass_vermilion_cinnabar','tour_pass_vermilion_cerulean'];
const NORTH_ROUTE='tour_kanto_route_6';
const blueVisited=(visited:Set<string>)=>visited.has('tour_kanto_route_6')||visited.has('tour_kanto_underground_ns')||visited.has('tour_kanto_route_5')||visited.has('tour_pass_vermilion_cerulean');
const metNorth=(met:string)=>met==='관동 5번도로'||met==='갈색–블루 해안길';

function showPortPractice(g:Engine,save:SaveData){
  const members=[...save.party];
  const valid=()=>g.save===save&&save.map==='tour_vermilion_hall_3f'&&!g.battle&&members.length===save.party.length&&members.every((p,i)=>save.party[i]===p);
  const choose=(attacker?:number)=>{
    if(!valid())return;
    const candidates=members.map((p,i)=>({p,i})).filter(({i})=>i!==attacker);
    if(members.length<2){g.say('동행 모의전',['함께 연습할 동료가 두 마리 이상 필요하다.','5번도로에서 새 동료를 만나거나\n센터 PC에서 파티를 정리해 보자.']);return;}
    const choices:Choice[]=candidates.map(({p,i})=>({label:`${SPECIES[p.species].name} Lv.${p.level}`,action:()=>{
      if(!valid())return;
      if(attacker===undefined)choose(i);else startPalletSparring(g,attacker,i,valid,()=>choose(attacker));
    }}));
    choices.push({label:attacker===undefined?'연습 끝내기':'첫 동료 다시 고르기',action:()=>{if(attacker!==undefined)choose();}});
    g.say('동행 모의전',[attacker===undefined?'기술을 시험할 첫 동료를 고르자.':`${SPECIES[members[attacker].species].name}와\n함께 연습할 상대 동료를 고르자.`],undefined,choices);
  };
  choose();
}

/** Port life and travel preparation without adding rewards or story locks. */
export function handleVermilionLife(g:Engine,event:string):boolean{
  const map=g.save.map;
  const interior=map.startsWith('tour_vermilion_home')||map.startsWith('tour_vermilion_hall');
  if(map!==CITY&&!interior&&!COASTS.includes(map))return false;
  const save=g.save,current=()=>g.save===save&&!g.battle;
  const guide=(map:Parameters<Engine['setTourDestination']>[0],target?:string)=>()=>{
    if(current())g.setTourDestination(map,target);
  };
  if(map==='tour_pass_vermilion_cinnabar'&&event==='vermilionCoastWorker'){
    g.say('해안 운반원',['홍련의 화산암 표본을 갈색 항구 작업실로 옮기는 길이야.','번호가 붙은 도로가 아니라 두 항구를 잇는 작업 해안길이야.\n바다를 건너는 조사선과는 이용 방법이 달라.','서쪽 끝은 갈색시티, 동쪽 끝은 홍련섬이야.']);return true;
  }
  if(map==='tour_pass_vermilion_cerulean'&&event==='vermilionBlueNaturalist'){
    g.say('해안 조사원',['풀밭에서 만나는 포켓몬과 물가를 지나는 포켓몬의 흔적을 나누어 기록하고 있어.','이곳은 갈색–블루 해안길이야.\n정식 여행길은 갈색에서 6번도로·지하통로·5번도로 순서로 이어져.','풀밭에 들어가기 전 동료 상태와 몬스터볼을 확인해.']);return true;
  }
  if(map===CITY&&event==='vermilionGuide'){
    g.say('갈색시티 항구 안내원',[
      '서쪽 출구 → 홍련–갈색 해안길\n북쪽 출구 → 6번도로·지하통로·5번도로·블루시티',
      '동쪽 출구 → 운하시티 일반 연결\n조사선 승선은 기존 선원에게 따로 확인하세요.',
      '여객 터미널은 항로 안내·하역 관찰·동행 휴게의 3개 층입니다.',
    ],undefined,[
      {label:'홍련 방향',action:guide('tour_pass_vermilion_cinnabar','journeySign')},
      {label:'블루 방향',action:guide(NORTH_ROUTE)},
      {label:'터미널',action:guide('tour_vermilion_hall','tourExhibit0')},
      {label:'안내 마치기',action:()=>{}},
    ]);return true;
  }
  const object=TOUR_OUTDOORS[CITY].objects.find(o=>o.event===event);
  if(object&&['갈색 작업 부두','남쪽 정박 수면','항구 동쪽 방파제','항구 산책 정원'].includes(object.name)){
    g.say(object.name,[...object.pages,
      object.name==='갈색 작업 부두'?'괴력이나 알통몬 같은 동료가 짐을 옮기고,\n고라파덕은 물가에 떨어진 물건을 살핀다.':
      object.name==='항구 동쪽 방파제'?'바닷바람이 강한 날에는 방파제 안쪽 길로\n동료와 천천히 돌아가자.':'작업 구역을 벗어나면 동료와 쉬며\n다음 이동에 쓸 도구를 확인할 수 있다.'
    ],undefined,[
      {label:'터미널 안내',action:guide('tour_vermilion_hall','tourExhibit1')},
      {label:'센터·PC 안내',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'계속 둘러보기',action:()=>{}},
    ]);return true;
  }
  if(event==='tourResident0'){
    const injured=save.party.filter(p=>p.hp<p.maxHp).length;
    g.say('부두 일꾼',['동쪽 하역 데크와 남쪽 정박 길을\n한 바퀴 돌면 항구 구조가 보여.',injured?`지친 동료 ${injured}마리는 센터에서 쉬게 해.\n짐보다 동료 상태가 먼저야.`:'동료들은 모두 건강하네.\n상점에서 도구를 확인하고 출발해.',`몬스터볼 ${save.inventory.pokeBalls}개 · 상처약 ${save.inventory.potions}개`],undefined,[
      {label:'작업 부두 안내',action:guide(CITY,TOUR_OUTDOORS[CITY].objects.find(o=>o.name==='갈색 작업 부두')?.event)},
      {label:'상점 안내',action:guide('tour_vermilion_mart','martClerk')},
      {label:'이야기 마치기',action:()=>{}},
    ]);return true;
  }
  if(event==='tourResident1'){
    g.say('항구 여행객',['서쪽 해안길은 홍련섬으로,\n북쪽 6번도로는 지하통로와 5번도로를 지나 블루시티로 이어져.','동쪽 끝의 일반 연결로는 운하시티로 가지만,\n조사선 승선은 항구의 기존 선원에게 따로 물어봐.'],undefined,[
      {label:'홍련 해안길 안내',action:guide('tour_pass_vermilion_cinnabar')},
      {label:'블루 방향 안내',action:guide(NORTH_ROUTE)},
      {label:'터미널 항로 안내',action:guide('tour_vermilion_hall','tourExhibit0')},
      {label:'마치기',action:()=>{}},
    ]);return true;
  }
  if(event==='tourPokemon'){
    g.say('부두의 고라파덕',['고라... 파덕?\n데크 아래 물결을 가만히 바라본다.','부두 일꾼이 지나가자 길 가장자리로 물러나\n짐을 나르는 동료가 지나갈 자리를 내준다.']);return true;
  }
  if(map.startsWith('tour_vermilion_hall')&&event==='tourHost'){
    const injured=save.party.filter(p=>p.hp<p.maxHp).length;
    g.say(g.map.npcs[0]?.name??'터미널 안내원',[
      '1층 항로 안내 · 2층 하역 관찰 · 3층 동행 휴게 공간입니다.',
      injured?`지친 동료 ${injured}마리는 센터에서 회복시킨 뒤 이동하세요.`:'동료 상태는 좋아 보입니다. 경유지와 도구를 확인하세요.',
      '기존 조사선 승선은 별도의 선원 안내와 이야기 진행을 따릅니다.',
    ]);return true;
  }
  const roomObject=TOUR_INTERIORS[map]?.objects.find(object=>object.event===event);
  if(map==='tour_vermilion_hall'&&roomObject?.name==='항로 안내도'){
    const line=String.fromCharCode(10);
    g.say('갈색시티 항로 안내도',[
      '서쪽 → 홍련–갈색 해안길'+line+'번호가 없는 항구 작업용 창작 직결로다.',
      '북쪽 → 6번도로 → 남북 지하통로 → 5번도로 → 블루시티'+line+'각 구간을 따라 걸어서 왕복할 수 있다.',
      '동쪽 → 운하시티 일반 연결'+line+'조건 없이 걸어서 왕복하는 지방 간 연결이다.',
      '자료 전달 뒤 이용하는 조사선은 이 안내도 노선과 다르며'+line+'항구 외부의 기존 조사선 선원에게 확인한다.',
    ],undefined,[
      {label:'홍련 방향',action:guide('tour_pass_vermilion_cinnabar','journeySign')},
      {label:'블루 방향',action:guide(NORTH_ROUTE)},
      {label:'운하시티 연결',action:guide('tour_canalave')},
      {label:'안내도 닫기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_hall'&&roomObject?.name==='출항 확인판'){
    const fainted=save.party.filter(p=>p.hp===0).length;
    const injured=save.party.filter(p=>p.hp>0&&p.hp<p.maxHp).length;
    const partyStatus=!save.party.length?'함께 출발할 동료가 없다. 센터 PC에서 파티를 확인하자.':
      fainted?'기절한 동료 '+fainted+'마리 · 센터 회복이 먼저다.':
      injured?'지친 동료 '+injured+'마리 · 긴 이동 전에 쉬게 하자.':'동료 전원이 건강하다.';
    const supplyStatus='몬스터볼 '+save.inventory.pokeBalls+'개 · 상처약 '+save.inventory.potions+'개';
    const supplyAdvice=!save.inventory.pokeBalls||!save.inventory.potions?'부족한 도구는 프렌들리숍에서 준비할 수 있다.':'해안길을 살필 기본 도구가 준비되어 있다.';
    g.say('출항 준비 확인',[partyStatus,supplyStatus,supplyAdvice,'바람과 하역 상황은 안정적이다. 이동할 방향을 다시 확인하자.'],undefined,[
      {label:'센터·PC',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'프렌들리숍',action:guide('tour_vermilion_mart','martClerk')},
      {label:'홍련 방향',action:guide('tour_pass_vermilion_cinnabar','journeySign')},
      {label:'블루 방향',action:guide(NORTH_ROUTE)},
    ]);return true;
  }
  if(map==='tour_vermilion_hall'&&roomObject?.name==='터미널 층별 안내'){
    const interiorTarget=(room:string,name:string)=>TOUR_INTERIORS[room]?.objects.find(o=>o.name===name)?.event;
    g.say('갈색시티 터미널 층별 안내',[
      '1층 · 항로 안내와 출발 준비 확인',
      '2층 · 부두의 포켓몬 하역 관찰과 이동 기록',
      '3층 · 여행 동료 휴식, 해안길 기록과 기술 연습',
      '오른쪽 계단을 따라 올라가며 각 층의 안내 표식을 살펴보자.',
    ],undefined,[
      {label:'2층 하역 관찰',action:guide('tour_vermilion_hall_2f',interiorTarget('tour_vermilion_hall_2f','하역 관찰 창'))},
      {label:'3층 여행 준비',action:guide('tour_vermilion_hall_3f',interiorTarget('tour_vermilion_hall_3f','여행 준비 수첩'))},
      {label:'터미널 밖',action:guide(CITY)},
      {label:'안내 닫기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_hall_2f'&&roomObject?.name==='하역 관찰 창'){
    const partners=save.party.slice(0,3);
    const observations=partners.length?partners.map(p=>{
      const species=SPECIES[p.species],types=species.types;
      const role=types.includes('격투')?'무거운 짐 가까이에서는 힘을 쓰기 전 작업자의 신호를 기다린다.':
        types.includes('물')?'정박 수면 가장자리에서 밧줄과 떠내려오는 물건을 살핀다.':
        types.includes('전기')?'젖은 데크를 피해 마른 안전선 안쪽에서 신호 장비를 살핀다.':
        types.includes('비행')?'높은 난간에서 부두의 빈 이동로와 들어오는 짐을 먼저 살핀다.':
        '짐이 지나는 길을 비우고 작업자 곁에서 차례를 기다린다.';
      return `${species.name} · ${types.join('/')}\n${role}${p.hp<p.maxHp?' 지금은 먼저 쉬게 하는 편이 좋다.':''}`;
    }):['함께 온 동료가 없어 작업 포켓몬의 이동선만 기록했다.','동료와 다시 오면 타입과 현재 상태에 맞춰\n안전한 작업 위치를 살펴볼 수 있다.'];
    g.say('하역 관찰 기록',[
      '항구에서는 포켓몬의 힘만큼\n작업 신호와 휴식 순서를 중요하게 여긴다.',
      ...observations,
    ],undefined,[
      {label:'작업 부두 안내',action:guide(CITY,TOUR_OUTDOORS[CITY].objects.find(o=>o.name==='갈색 작업 부두')?.event)},
      {label:'센터 안내',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'관찰 마치기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_hall_2f'&&roomObject?.name==='화물 기록 선반'){
    const visited=new Set(save.tourVisited??[]);
    const records=[
      ['홍련–갈색 해안길','tour_pass_vermilion_cinnabar'],
      ['6번도로·지하통로·5번도로','tour_kanto_route_5'],
      ['운하시티 일반 연결','tour_canalave'],
    ] as const;
    const coastPartners=[...save.party,...(save.box??[])].filter(p=>metNorth(p.met));
    g.say('갈색항 화물 기록',[
      '도착지·화물 무게와 함께'+String.fromCharCode(10)+'사람과 포켓몬이 지나온 구간을 적어 둔다.',
      ...records.map(([name,id])=>name+' · '+(visited.has(id)?'방문 기록 있음':'아직 방문 기록 없음')),
      coastPartners.length?'5번도로 또는 옛 호환길에서 만난 동료 '+coastPartners.length+'마리'+String.fromCharCode(10)+'파티와 PC 기록을 함께 확인했다.':'블루 방향 풀밭에서 만난 동료 기록은 아직 없다.',
    ],undefined,[
      {label:'홍련 해안길 안내',action:guide('tour_pass_vermilion_cinnabar')},
      {label:'블루 방향 안내',action:guide(NORTH_ROUTE)},
      {label:'기록 닫기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_hall_2f'&&roomObject?.name==='작업 동선 도면'){
    const outdoorTarget=(name:string)=>TOUR_OUTDOORS[CITY].objects.find(o=>o.name===name)?.event;
    const line=String.fromCharCode(10);
    g.say('갈색항 작업 동선',[
      '터미널 북동쪽 길 → 작업 부두'+line+'남쪽 데크 → 정박 수면 순서로 안전선이 이어진다.',
      '북쪽 방파제 안쪽 길은 바람을 피하면서'+line+'6번도로 남쪽 출구로 돌아가는 통로다.',
      '화물 이동선과 여행자 산책길이 만나는 곳에서는'+line+'포켓몬과 함께 가장자리에서 기다리자.',
    ],undefined,[
      {label:'작업 부두',action:guide(CITY,outdoorTarget('갈색 작업 부두'))},
      {label:'남쪽 정박 구역',action:guide(CITY,outdoorTarget('남쪽 정박 수면'))},
      {label:'북쪽 방파제',action:guide(CITY,outdoorTarget('항구 동쪽 방파제'))},
      {label:'도면 닫기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_hall_3f'&&roomObject?.name==='동행 휴게 화단'){
    const partners=save.party.slice(0,3);
    const restPages=partners.length?partners.map(p=>{
      const name=SPECIES[p.species].name;
      return name+' · HP '+p.hp+'/'+p.maxHp+' · '+(p.hp===0?'충분한 회복이 필요하다.':p.hp<p.maxHp?'잠시 쉬고 센터에 들르자.':'바닷바람을 맞으며 편안히 쉬고 있다.');
    }):['함께 쉬는 동료가 없다.','센터 PC에서 여행할 동료를 정한 뒤 다시 와 보자.'];
    const notebook=TOUR_INTERIORS[map]?.objects.find(o=>o.name==='여행 준비 수첩')?.event;
    g.say('동행 휴게 화단',['염분 섞인 바람에도 잘 자라는 식물과 포켓몬용 물그릇이 놓여 있다.',...restPages],undefined,[
      {label:'여행 준비 수첩',action:guide(map,notebook)},
      {label:'센터·PC',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'계속 쉬기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_hall_3f'&&roomObject?.name==='항구 전망석'){
    const visited=new Set(save.tourVisited??[]),line=String.fromCharCode(10);
    g.say('갈색항 전망',[
      '서쪽 아래로 홍련–갈색 해안길이 보인다.'+line+(visited.has('tour_pass_vermilion_cinnabar')?'직접 지나온 길의 굽은 해안선이 눈에 익다.':'아직 방문 기록이 없는 작업 해안길이다.'),
      '북쪽 방파제 너머는 6번도로·지하통로·5번도로다.'+line+(blueVisited(visited)?'블루 방향 본선을 지나온 기록이 있다.':'아직 방문 기록이 없는 블루 방향 본선이다.'),
      '동쪽 작업 부두의 일반 연결과 기존 조사선 선원은 서로 다른 이동 안내를 맡는다.',
    ],undefined,[
      {label:'홍련 방향',action:guide('tour_pass_vermilion_cinnabar','journeySign')},
      {label:'블루 방향',action:guide(NORTH_ROUTE)},
      {label:'작업 부두',action:guide(CITY,TOUR_OUTDOORS[CITY].objects.find(o=>o.name==='갈색 작업 부두')?.event)},
      {label:'전망 마치기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_hall_3f'&&roomObject?.name==='여행 준비 수첩'){
    const coastPartners=save.party.filter(p=>metNorth(p.met));
    const pages=coastPartners.length?[
      `5번도로 또는 옛 호환길에서 만난 동료 ${coastPartners.length}마리가\n현재 파티와 함께하고 있다.`,
      ...coastPartners.slice(0,3).map(p=>`${SPECIES[p.species].name} Lv.${p.level} · HP ${p.hp}/${p.maxHp}\n${p.hp<p.maxHp?'센터에서 쉬게 한 뒤 다음 길로 나가자.':'함께 다음 경유지를 살펴볼 준비가 됐다.'}`),
    ]:['5번도로의 선택 풀밭에서는\n여러 포켓몬을 만날 수 있다고 적혀 있다.','동료로 맞이하려면 몬스터볼을 챙기고\n풀밭을 천천히 살펴보자.'];
    g.say('여행 준비 수첩',pages,undefined,[
      {label:'동료 기술 연습',action:()=>{if(current())showPortPractice(g,save);}},
      {label:'블루 방향 안내',action:guide(NORTH_ROUTE)},
      {label:'센터 안내',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'수첩 덮기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home1'&&roomObject?.name==='작업 장비대'){
    const partner=save.party[0],species=partner?SPECIES[partner.species]:null;
    const role=!partner||!species?'함께 장비를 살펴볼 동료가 없다. 센터 PC에서 파티를 확인하자.':
      species.types.includes('격투')?species.name+'에게 맞는 작업 장갑과 짐 고정 끈을 살핀다.':
      species.types.includes('물')?species.name+'이 물가에서 쓸 미끄럼 방지 발판과 마른 수건을 살핀다.':
      species.types.includes('전기')?species.name+'이 젖은 장비와 떨어져 있도록 절연 표시를 확인한다.':
      species.name+'이 작업선 밖에서 기다릴 수 있도록 방석과 안전띠를 살핀다.';
    const condition=partner?(partner.hp<partner.maxHp?'동료가 지쳐 있어 장비보다 휴식과 회복을 먼저 준비한다.':'동료 상태가 좋아 작업 전 안전 신호를 함께 익힐 수 있다.'):'장비는 그대로 두고 주민의 설명만 읽었다.';
    g.say('항만 작업 장비 점검',['젖은 밧줄과 장갑을 말리고 매듭과 닳은 부분을 확인한다.',role,condition],undefined,[
      {label:'작업 부두 안내',action:guide(CITY,TOUR_OUTDOORS[CITY].objects.find(o=>o.name==='갈색 작업 부두')?.event)},
      {label:'센터·PC',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'점검 마치기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home2'&&roomObject?.name==='여행 가방 작업대'){
    const injured=save.party.filter(p=>p.hp<p.maxHp).length;
    g.say('해안길 여행 가방 점검',[
      '몬스터볼과 상처약을 서로 다른 주머니에 넣어 바로 꺼낼 수 있게 한다.',
      '몬스터볼 '+save.inventory.pokeBalls+'개 · 상처약 '+save.inventory.potions+'개',
      !save.party.length?'센터 PC에서 함께 여행할 동료를 먼저 정하자.':injured?'지친 동료 '+injured+'마리를 회복시킨 뒤 해안길로 나가자.':'동료들이 모두 건강해 두 해안길을 살필 준비가 됐다.',
    ],undefined,[
      {label:'프렌들리숍',action:guide('tour_vermilion_mart','martClerk')},
      {label:'홍련 방향',action:guide('tour_pass_vermilion_cinnabar','journeySign')},
      {label:'블루 방향',action:guide(NORTH_ROUTE)},
      {label:'점검 마치기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home1'&&roomObject?.name==='항만 생활 책장'){
    const fainted=save.party.filter(p=>p.hp===0).length;
    const injured=save.party.filter(p=>p.hp>0&&p.hp<p.maxHp).length;
    const condition=!save.party.length?'함께 일하거나 쉴 동료가 없다. 센터 PC에서 파티를 먼저 정하자.':
      fainted?'기절한 동료 '+fainted+'마리는 작업에서 빼고 센터에서 충분히 회복시킨다.':
      injured?'지친 동료 '+injured+'마리는 공동주택 쉼터나 센터에서 쉬게 한다.':'현재 동료들은 모두 건강하다. 작업 신호와 안전선을 먼저 익히자.';
    const suitable=save.party.filter(p=>SPECIES[p.species].types.some(type=>['격투','물','전기','비행'].includes(type))).slice(0,3);
    const roles=suitable.length?suitable.map(p=>SPECIES[p.species].name+' · '+SPECIES[p.species].types.join('/')+' 타입 · 힘보다 작업자의 신호와 휴식 순서를 먼저 지킨다.'):['항구 작업에 가까이 갈 동료가 없다면 여행자는 안전선 밖에서 관찰한다.'];
    g.say('항만 생활과 동료 휴식',[condition,...roles,'동쪽 작업 부두와 남쪽 정박 수면에서는 화물 이동선을 비워 둔다.'],undefined,[
      {label:'작업 부두',action:guide(CITY,TOUR_OUTDOORS[CITY].objects.find(o=>o.name==='갈색 작업 부두')?.event)},
      {label:'3층 휴게석',action:guide('tour_vermilion_home1_3f',TOUR_INTERIORS.tour_vermilion_home1_3f?.objects.find(o=>o.name==='포켓몬 휴게석')?.event)},
      {label:'센터·PC',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'책 덮기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home2'&&roomObject?.name==='해안 지도 책장'){
    const visited=new Set(save.tourVisited??[]),line=String.fromCharCode(10);
    g.say('갈색시티 해안 이동 기록',[
      '북쪽 블루 방향'+line+'갈색 → 6번도로 → 지하통로 → 5번도로 → 블루'+line+'공식 경유 본선이 각 구간으로 나뉘어 있다.',
      '서쪽 홍련 방향'+line+'홍련–갈색 해안길은 번호가 없는 항구 작업용 창작 직결로다.',
      '동쪽 운하시티 방향'+line+'조건 없이 왕복하는 일반 연결이다. 자료 전달 뒤 이용하는 조사선은 별도 선원 안내를 따른다.',
      '방문 기록 · 홍련 '+(visited.has('tour_pass_vermilion_cinnabar')?'있음':'없음')+' / 블루 본선 '+(blueVisited(visited)?'있음':'없음')+' / 운하 '+(visited.has('tour_canalave')?'있음':'없음'),
    ],undefined,[
      {label:'홍련 방향',action:guide('tour_pass_vermilion_cinnabar','journeySign')},
      {label:'블루 방향',action:guide(NORTH_ROUTE)},
      {label:'운하시티 연결',action:guide('tour_canalave')},
      {label:'지도 덮기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home1_2f'&&roomObject?.name==='가족 식탁'){
    const members=save.party.slice(0,3);
    const seats=members.length?members.map(p=>SPECIES[p.species].name+' · HP '+p.hp+'/'+p.maxHp+' · '+(p.hp<p.maxHp?'조용한 휴식 자리':'식탁 곁 동료 자리')):['함께 식탁에 앉을 동료가 없다.'];
    g.say('항구 가족 식탁',['교대가 끝난 가족과 포켓몬이 함께 쉬도록 자리를 나누어 두었다.',...seats],undefined,[
      {label:'센터·PC',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'3층 쉼터',action:guide('tour_vermilion_home1_3f')},
      {label:'식사 자리 떠나기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home1_2f'&&roomObject?.name==='교대 근무표'){
    const tired=save.party.filter(p=>p.hp<p.maxHp).length;
    g.say('항만 교대 근무표',['작업조 · 동쪽 작업 부두와 하역 수면','휴식조 · 공동주택 3층 쉼터와 항구 산책 정원',tired?'지친 동료 '+tired+'마리는 휴식조에 표시해 둔다.':'현재 파티는 모두 건강해 이동 전 안전 신호만 확인하면 된다.'],undefined,[
      {label:'작업 부두',action:guide(CITY,TOUR_OUTDOORS[CITY].objects.find(o=>o.name==='갈색 작업 부두')?.event)},
      {label:'항구 산책 정원',action:guide(CITY,TOUR_OUTDOORS[CITY].objects.find(o=>o.name==='항구 산책 정원')?.event)},
      {label:'근무표 닫기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home2_2f'&&roomObject?.name==='항로 기록장'){
    const visited=new Set(save.tourVisited??[]);
    g.say('항해 가족 항로 기록',['홍련–갈색 해안길 · '+(visited.has('tour_pass_vermilion_cinnabar')?'방문 기록 있음':'미방문'),'6번도로·지하통로·5번도로 · '+(blueVisited(visited)?'방문 기록 있음':'미방문'),'운하시티 일반 연결 · '+(visited.has('tour_canalave')?'방문 기록 있음':'미방문')],undefined,[
      {label:'홍련 방향',action:guide('tour_pass_vermilion_cinnabar','journeySign')},
      {label:'블루 방향',action:guide(NORTH_ROUTE)},
      {label:'기록장 닫기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home2_2f'&&roomObject?.name==='가족 사진 선반'){
    const companions=[...save.party,...(save.box??[])].slice(0,3);
    const photos=companions.length?companions.map(p=>SPECIES[p.species].name+' · '+p.met+'에서 만난 동료'):['아직 함께 기록할 동료 사진이 없다.'];
    g.say('항해 가족 사진 선반',['여러 항구에서 사람과 포켓몬이 함께 찍은 사진 사이에 여행 기록을 꽂아 둔다.',...photos],undefined,[
      {label:'항로 기록장',action:guide(map,TOUR_INTERIORS[map]?.objects.find(o=>o.name==='항로 기록장')?.event)},
      {label:'센터·PC',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'사진 보기 마치기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home1_3f'&&roomObject?.name==='공동 화단'){
    const partners=save.party.filter(p=>SPECIES[p.species].types.some(type=>['풀','물','비행'].includes(type))).slice(0,3);
    const pages=partners.length?partners.map(p=>SPECIES[p.species].name+' · '+SPECIES[p.species].types.join('/')+' 타입'+(p.hp<p.maxHp?' · 화단 곁에서 쉬는 중':' · 바람과 잎의 움직임을 살핀다')):['현재 파티에는 화단 환경을 가까이 살필 동료가 없다.'];
    g.say('항만 주택 공동 화단',['염분 섞인 바람에 강한 잎과 낮은 화분을 골라 통행로를 비워 두었다.',...pages],undefined,[
      {label:'항구 산책 정원',action:guide(CITY,TOUR_OUTDOORS[CITY].objects.find(o=>o.name==='항구 산책 정원')?.event)},
      {label:'센터·PC',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'화단 떠나기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home1_3f'&&roomObject?.name==='포켓몬 휴게석'){
    const members=save.party.slice(0,3);
    const rests=members.length?members.map(p=>SPECIES[p.species].name+' · HP '+p.hp+'/'+p.maxHp+' · '+(p.hp===0?'센터 회복 필요':p.hp<p.maxHp?'넓은 휴식 방석':'몸집에 맞는 방석')):['비어 있는 여러 크기의 방석이 정리되어 있다.'];
    g.say('포켓몬 휴게석',['작은 동료부터 몸집이 큰 동료까지 쉴 수 있도록 방석 사이 간격을 넓혔다.',...rests],undefined,[
      {label:'센터·PC',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'2층 가족 식탁',action:guide('tour_vermilion_home1_2f',TOUR_INTERIORS.tour_vermilion_home1_2f?.objects.find(o=>o.name==='가족 식탁')?.event)},
      {label:'계속 쉬기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home2_3f'&&roomObject?.name==='수초 화분'){
    const owned=[...save.party,...(save.box??[])];
    const water=owned.filter(p=>SPECIES[p.species].types.includes('물')).slice(0,3);
    const coast=owned.filter(p=>metNorth(p.met)).length;
    const pages=water.length?water.map(p=>SPECIES[p.species].name+' · '+p.met+'에서 만난 물 타입 동료'):['파티와 PC에 기록된 물 타입 동료는 아직 없다.'];
    g.say('항해 가족 수초 화분',['작은 물그릇의 수초가 항구 바람에 흔들린다.','5번도로·옛 호환길 출신 동료 기록 · '+coast+'마리',...pages],undefined,[
      {label:'센터·PC',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'블루 방향',action:guide(NORTH_ROUTE)},
      {label:'화분 떠나기',action:()=>{}},
    ]);return true;
  }
  if(map==='tour_vermilion_home2_3f'&&roomObject?.name==='전망 휴게석'){
    const visited=new Set(save.tourVisited??[]);
    g.say('항해 가족 전망 휴게석',['서쪽 홍련 해안길 · '+(visited.has('tour_pass_vermilion_cinnabar')?'지나온 해안선':'아직 낯선 해안선'),'북쪽 6번도로·지하통로·5번도로 · '+(blueVisited(visited)?'지나온 블루 방향 본선':'아직 살피지 않은 블루 방향 본선'),'동쪽으로 터미널과 작업 부두가 이어진다. 일반 연결과 조사선은 별도 안내다.'],undefined,[
      {label:'홍련 방향',action:guide('tour_pass_vermilion_cinnabar','journeySign')},
      {label:'블루 방향',action:guide(NORTH_ROUTE)},
      {label:'터미널',action:guide('tour_vermilion_hall','tourExhibit0')},
      {label:'전망 마치기',action:()=>{}},
    ]);return true;
  }
  if(map.startsWith('tour_vermilion_home')&&['tourHost','tourDetail4_7'].includes(event)){
    const balls=save.inventory.pokeBalls,potions=save.inventory.potions;
    g.say(g.map.npcs[0]?.name??'항구 주민',[
      '갈색시티에서는 일과 여행이 포켓몬의 휴식 시간에 맞춰 움직여요.',
      `현재 준비: 몬스터볼 ${balls}개 · 상처약 ${potions}개`,
      potions?'해안길에 나가기 전 동료 상태도 확인해요.':'상처약이 없다면 프렌들리숍을 먼저 들르는 게 좋아요.',
    ],undefined,[
      {label:'센터 안내',action:guide('tour_vermilion_center','tourExhibit1')},
      {label:'상점 안내',action:guide('tour_vermilion_mart','martClerk')},
      {label:'집 둘러보기',action:()=>{}},
    ]);return true;
  }
  return false;
}
