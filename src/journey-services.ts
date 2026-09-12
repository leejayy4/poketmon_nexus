import type { Engine } from './engine';
import { handleCasteliaHome } from './castelia-homes';
import { handleCasteliaGallery } from './castelia-gallery';
import type { Choice,Pokemon,SaveData } from './types';
import { SPECIES } from './pokemon';
import { encounterGuidance, passageSignPages, passageWalkerPages } from './encounter-guidance';
import { isWorldCenter } from './unified-world';
import { MART_ROOMS,PASSAGES } from './journey-world';
import { speciesHabitats } from './runtime-encounters';
import { showPcSwap } from './pc-swap-menu';
import { withParticle } from './korean-text';
import { handleViridianNotebook } from './viridian-notebook';
import { handleViridianTravel } from './viridian-travel';
import { handlePalletPractice } from './pallet-practice';
import { handleGoldenrodRadio } from './goldenrod-radio';
import { handleGoldenrodHome } from './goldenrod-homes';
import { handleCinnabarResearch } from './cinnabar-research';
import { handleCinnabarLife } from './cinnabar-life';
import { handleVermilionLife } from './vermilion-life';
import { handleEternaHistory } from './eterna-history';
import { handleEternaLife } from './eterna-life';
import { handleHearthomePerformance } from './hearthome-performance';
import { handleVeilstoneTraining } from './veilstone-training';
import { handleVeilstoneLife } from './veilstone-life';
import { handlePastoriaObservation } from './pastoria-observation';
import { handlePastoriaLife } from './pastoria-life';
import { handleSunyshoreObservation } from './sunyshore-observation';
import { handleSunyshoreLife } from './sunyshore-life';
import { handleSinnohNorthObservation } from './sinnoh-north-observation';
import { handleSinnohNorthLife } from './sinnoh-north-life';
import { handleCanalaveWork } from './canalave-work';
import { handleCanalaveLife } from './canalave-life';
import { handleAzaleaLife } from './azalea-life';
import { handleJohtoSouthLife } from './johto-south-life';
import { handleIlexLife } from './ilex-life';
import { handleLavenderLife } from './lavender-life';

// Prices are the NEXUS items.json project values, not another generation's prices.
export const SHOP_ITEMS=[{key:'pokeBalls' as const,name:'몬스터볼',price:200,source:'IT-poke-ball'},{key:'potions' as const,name:'상처약',price:200,source:'IT-potion'}];
export const BOX_CAPACITY=60;
type CollectionSave=SaveData&{box?:Pokemon[];pokedex?:{seen:number[];caught:number[]}};
export function purchase(s:SaveData,index:number,quantity:number):string{
  const item=SHOP_ITEMS[index];
  if(!item||!Number.isInteger(quantity)||quantity<1||quantity>99)return '구매할 수량을 다시 선택해 주세요.';
  if(s.inventory[item.key]+quantity>999)return '가방에 더 담을 수 없어요.\n수량을 줄여 주세요.';
  const cost=item.price*quantity;if(s.money<cost)return `돈이 부족해요.\n필요 금액 ${cost}원 · 소지금 ${s.money}원`;
  s.money-=cost;s.inventory[item.key]+=quantity;
  return `${item.name} ${quantity}개를 샀다!\n남은 돈 ${s.money}원`;
}
export function depositPokemon(s:CollectionSave,index:number):string{
  const p=s.party[index];if(!Number.isInteger(index)||!p)return '맡길 포켓몬을 선택해 주세요.';
  if((s.box?.length??0)>=BOX_CAPACITY)return '박스가 가득 찼어요. (60마리)';
  if(s.party.length<=1||!s.party.some((mon,i)=>i!==index&&mon.hp>0))return '모험할 수 있는 건강한 포켓몬을\n한 마리 이상 데리고 있어야 해요.';
  (s.box??=[]).push(s.party.splice(index,1)[0]);
  return `${withParticle(SPECIES[p.species].name,'을/를')} 박스에 맡겼다.\n센터 PC에서 다시 데려올 수 있다.`;
}
export function withdrawPokemon(s:CollectionSave,index:number):string{
  const p=s.box?.[index];if(!Number.isInteger(index)||!p)return '데려올 포켓몬을 선택해 주세요.';
  if(s.party.length>=6)return '파티가 가득 찼어요.\n먼저 한 마리를 맡겨 주세요.';
  s.party.push(s.box!.splice(index,1)[0]);return `${withParticle(SPECIES[p.species].name,'이/가')} 파티로 돌아왔다!`;
}
function pcMenu(g:Engine){
  const s=g.save as CollectionSave;
  g.say('포켓몬 보관 시스템',[`파티 ${s.party.length}/6 · 박스 ${s.box?.length??0}/${BOX_CAPACITY}\n무엇을 할까요?`],undefined,[
    {label:'포켓몬 맡기기',action:()=>collectionMenu(g,false,0)},
    {label:'포켓몬 데려오기',action:()=>collectionMenu(g,true,0)},
    {label:'파티·박스 교체',action:()=>showPcSwap(g,()=>pcMenu(g))},
    {label:'포켓몬도감',action:()=>showPokedex(g,0,()=>pcMenu(g))},
    {label:'PC 끄기',action:()=>{}}
  ]);
}
function collectionMenu(g:Engine,withdraw:boolean,page:number){
  const s=g.save as CollectionSave,list=withdraw?s.box??[]:s.party,pages=Math.max(1,Math.ceil(list.length/3));page=Math.max(0,Math.min(page,pages-1));
  const choices:Choice[]=list.slice(page*3,page*3+3).map((mon,i)=>({label:`${SPECIES[mon.species].name} Lv.${mon.level}`,action:()=>{
    if(g.save!==s||!isWorldCenter(s.map))return;
    const index=page*3+i;if((withdraw?s.box:s.party)?.[index]!==mon)return;
    g.say(SPECIES[mon.species].name,[`Lv.${mon.level} · HP ${mon.hp}/${mon.maxHp}\n${withdraw?'파티로 데려올까요?':'박스에 맡길까요?'}`],undefined,[
      {label:withdraw?'데려온다':'맡긴다',action:()=>{if(g.save!==s||!isWorldCenter(s.map)||(withdraw?s.box:s.party)?.[index]!==mon)return;const message=withdraw?withdrawPokemon(s,index):depositPokemon(s,index);g.persist();g.say('포켓몬 PC',[message],()=>collectionMenu(g,withdraw,page));}},
      {label:'돌아가기',action:()=>collectionMenu(g,withdraw,page)}
    ]);
  }}));
  if(page<pages-1)choices.push({label:'다음 페이지',action:()=>collectionMenu(g,withdraw,page+1)});
  if(page>0)choices.push({label:'이전 페이지',action:()=>collectionMenu(g,withdraw,page-1)});
  choices.push({label:'PC 메뉴로',action:()=>pcMenu(g)});
  g.say(withdraw?'박스':'파티',[`${withdraw?'데려올':'맡길'} 포켓몬 · ${page+1}/${pages}쪽\n${list.length?'포켓몬을 선택해 주세요.':'아직 보관 중인 포켓몬이 없어요.'}`],undefined,choices);
}
export function showPokedex(g:Engine,page=0,back:()=>void=()=>{}){
  const s=g.save as CollectionSave,owned=[...s.party,...s.box??[]].map(p=>p.species),caught=new Set([...(s.pokedex?.caught??[]),...owned]);
  const seen=[...new Set([...(s.pokedex?.seen??[]),...caught])].filter(id=>SPECIES[id]).sort((a,b)=>a-b),pages=Math.max(1,Math.ceil(seen.length/3));page=Math.max(0,Math.min(page,pages-1));
  const choices:Choice[]=seen.slice(page*3,page*3+3).map(id=>({label:`${caught.has(id)?'●':'○'} ${SPECIES[id].name}`,action:()=>{
    if(g.save!==s||g.battle)return;
    const p=SPECIES[id],habitats=speciesHabitats(id);
    g.say('포켓몬도감',[`No.${String(id).padStart(3,'0')} ${p.name}\n${p.types.join(' / ')} · ${caught.has(id)?'잡은 포켓몬':'발견한 포켓몬'}`,p.description,
      ...(habitats.length?habitats.map(h=>`야생 서식지\n${h.name}\nLv.${h.minLevel}~${h.maxLevel} · ${h.rarity}`):['야생 서식지 정보가 없다.']),
    ],()=>{if(g.save===s&&!g.battle)showPokedex(g,page,back);});
  }}));
  if(page<pages-1)choices.push({label:'다음 페이지',action:()=>showPokedex(g,page+1,back)});
  if(page>0)choices.push({label:'이전 페이지',action:()=>showPokedex(g,page-1,back)});
  choices.push({label:'돌아가기',action:back});
  g.say('포켓몬도감',[`발견 ${seen.length}종 · 포획 ${caught.size}종\n${page+1}/${pages}쪽 · ● 포획 / ○ 발견`],undefined,choices);
}
function shopMenu(g:Engine){
  if(!MART_ROOMS.has(g.save.map))return;
  g.say('점원',[`어서 오세요! 소지금 ${g.save.money}원\n필요한 도구를 골라 주세요.`],undefined,[...SHOP_ITEMS.map((item,i)=>({label:`${item.name} ${item.price}원`,action:()=>shopQuantity(g,i)})),{label:'그만 산다',action:()=>{}}]);
}
function shopQuantity(g:Engine,index:number){
  const s=g.save,item=SHOP_ITEMS[index];
  g.say(item.name,[`소지금 ${s.money}원 · 보유 ${s.inventory[item.key]}개\n몇 개 살까요?`],undefined,[...[1,5,10].map(quantity=>({label:`${quantity}개 · ${quantity*item.price}원`,action:()=>{
    if(g.save!==s||!MART_ROOMS.has(s.map))return;
    g.say('구매 확인',[`${item.name} ${quantity}개 · ${quantity*item.price}원\n구매할까요?`],undefined,[{label:'산다',action:()=>{if(g.save!==s||!MART_ROOMS.has(s.map))return;const text=purchase(s,index,quantity);g.persist();g.say('점원',[text],()=>shopMenu(g));}},{label:'돌아가기',action:()=>shopQuantity(g,index)}]);
  }})),{label:'상품 목록으로',action:()=>shopMenu(g)}]);
}
export function handleJourneyEvent(g:Engine,id:string):boolean{
  if(handleAzaleaLife(g,id))return true;
  if(handleIlexLife(g,id))return true;
  if(handleJohtoSouthLife(g,id))return true;
  if(handleLavenderLife(g,id))return true;
  if(handleCasteliaHome(g,id))return true;
  if(handleCinnabarLife(g,id))return true;
  if(handleVermilionLife(g,id))return true;
  if(handleCasteliaGallery(g,id))return true;
  if(handleEternaLife(g,id))return true;
  if(handleHearthomePerformance(g,id))return true;
  if(handleVeilstoneTraining(g,id))return true;
  if(handleVeilstoneLife(g,id))return true;
  if(handlePastoriaObservation(g,id))return true;
  if(handlePastoriaLife(g,id))return true;
  if(handleSunyshoreObservation(g,id))return true;
  if(handleSunyshoreLife(g,id))return true;
  if(handleSinnohNorthObservation(g,id))return true;
  if(handleSinnohNorthLife(g,id))return true;
  if(handleCanalaveWork(g,id))return true;
  if(handleCanalaveLife(g,id))return true;
  if(handleEternaHistory(g,id))return true;
  if(handleGoldenrodRadio(g,id))return true;
  if(handleGoldenrodHome(g,id))return true;
  if(handleCinnabarResearch(g,id))return true;
  if(handlePalletPractice(g,id))return true;
  if(handleViridianNotebook(g,id))return true;
  if(handleViridianTravel(g,id))return true;
  if(id==='unovaRouteFourSign'&&g.save.map==='tour_unova_route_04'){
    g.say('4번도로 이정표',['↑ 조인애버뉴 · 뇌문시티\n↓ 구름시티','동쪽 분기 → 리조트데저트 입구\n사막은 본선에서 벗어난 선택 탐험입니다.']);return true;
  }
  if(id==='unovaRouteFourGuide'&&g.save.map==='tour_unova_route_04'){
    g.say('4번도로 작업원',['남북 큰길은 구름시티와 조인애버뉴를 이어요.','사암 공사장 동쪽 길은 리조트데저트로 빠집니다.\n사막을 지나지 않아도 뇌문시티에 갈 수 있어요.']);return true;
  }
  if(id==='joinAvenueSign'&&g.save.map==='tour_join_avenue'){
    g.say('조인애버뉴 안내판',['↑ 뇌문시티\n↓ 4번도로 · 구름시티','양옆 가게 자리는 교류 상점가입니다.\n현재는 거리를 걸어서 통과할 수 있습니다.']);return true;
  }
  if(id==='joinAvenueGuide'&&g.save.map==='tour_join_avenue'){
    g.say('조인애버뉴 안내원',['4번도로에서 온 여행자가\n뇌문시티로 들어가기 전 쉬어 가는 거리예요.','상점 운영과 특별 보상은 아직 없어요.\n중앙 통로는 언제든 왕복할 수 있습니다.']);return true;
  }
  if(id==='tourRouteSixResearcher'&&g.save.map==='tour_pass_driftveil_mistralton'){
    g.say('계절 연구원',['이 강가에서는 계절에 따라 달라지는\n풀과 포켓몬의 흔적을 기록해요.','지금은 목재 다리를 따라 북쪽으로 가면\n전기돌동굴 입구에 닿을 수 있습니다.','야생 조사는 아직 시작하지 않았으니\n이 길에서 포켓몬이 나온다고 안내하지 않아요.']);return true;
  }
  if(id==='tourChargestoneGuide'&&g.save.map==='tour_chargestone_1f'){
    g.say('전기돌동굴 조사원',['푸른 결정은 큰 자석 바위 쪽으로\n끌려가는 성질이 있다고 해요.','입구의 작은 결정으로 방향을 익힌 뒤\nB1F 본선 결정을 북쪽으로 밀어 보세요.','남쪽은 6번도로, 북부 출구는 궐수시티예요.\n두 입구 모두 같은 1층이지만 B1F를 거칩니다.']);return true;
  }
  if(id==='tourChargestoneLearningCrystal'&&g.save.map==='tour_chargestone_1f'){
    if(g.save.flags.chargestonePushLearned){g.say('입구 학습 결정',['작은 결정이 원래 자리에서 자석 바위 쪽으로 흔들린다.','북쪽 자석 바위를 확인하고 미는 동작은 이미 익혔다. B1F의 좁은 통로에서 같은 원리를 쓰자.']);return true;}
    const save=g.save;g.say('입구 학습 결정',['작은 결정은 북쪽의 큰 자석 바위 쪽으로만 움직일 것 같다.','밀기 전에 취소해도 위치와 진행은 바뀌지 않는다.'],undefined,[{label:'북쪽으로 밀어 본다',action:()=>{if(g.save!==save||save.map!=='tour_chargestone_1f')return;save.flags.chargestonePushLearned=true;g.persist();g.say('입구 학습 결정',['결정이 북쪽 자석 바위 쪽으로 짧게 미끄러졌다가 안전 홈에 멈췄다.','결정 밀기 방향을 익혔다. B1F 본선 결정도 자석 바위 쪽으로 밀 수 있다.']);}},{label:'그대로 둔다',action:()=>{}}]);return true;
  }
  if(id==='tourChargestoneMainCrystal'&&g.save.map==='tour_chargestone_b1f'){
    if(g.save.flags.chargestoneMainCrystalMoved){g.say('본선 이동 결정',['결정은 북쪽 자석 바위 옆 안전 홈에 놓여 있다.','열린 한 칸 통로로 남쪽과 북쪽 계단을 오갈 수 있다.']);return true;}
    if(!g.save.flags.chargestonePushLearned){g.say('본선 이동 결정',['결정이 좁은 통로를 막고 있다. 어느 쪽으로 밀어야 할지 확신하기 어렵다.','남쪽 계단으로 돌아가 1층 입구의 학습 결정과 자석 바위를 살펴보자.']);return true;}
    const save=g.save;g.say('본선 이동 결정',['입구에서 배운 대로 북쪽 자석 바위 방향으로 밀면 통로가 열릴 것 같다.','취소하면 결정과 통로 상태는 그대로 유지된다.'],undefined,[{label:'북쪽으로 민다',action:()=>{if(g.save!==save||save.map!=='tour_chargestone_b1f')return;save.flags.chargestoneMainCrystalMoved=true;g.persist();g.say('본선 이동 결정',['결정이 북쪽 자석 바위 쪽으로 미끄러져 안전 홈에 멈췄다!','좁은 통로가 열렸다. 북쪽 계단과 궐수시티 방향으로 진행할 수 있다.']);}},{label:'그대로 둔다',action:()=>{}}]);return true;
  }
  if(id==='tourChargestoneHiker'&&g.save.map==='tour_chargestone_b1f'){
    g.say('결정길 산행객',['이 층의 두 계단은 1층의 서로 떨어진 구역으로 이어져요.',g.save.flags.chargestoneMainCrystalMoved?'본선 결정을 옮겨 통로가 열렸군요. 북쪽 계단으로 계속 갈 수 있어요.':g.save.flags.chargestonePushLearned?'입구에서 밀기를 배웠다면 좁은 통로의 결정을 북쪽으로 밀어 보세요.':'남쪽 1층 입구에서 학습 결정의 방향부터 살펴보세요.','남쪽 계단은 6번도로 쪽, 북쪽 계단은 궐수시티 쪽입니다.']);return true;
  }
  if(id==='tourRouteSixLabHost'&&g.save.map==='tour_route_six_lab'){
    g.say('계절 연구원',['이곳은 6번도로의 강물과 식물 흔적을 계절별로 비교하는 연구소예요.','지금 보이는 자료는 이미 모아 둔 고정 전시입니다.\n특정 포켓몬이나 계절 모습 수집을 요구하지 않아요.','남쪽은 물풍경시티, 북쪽은 전기돌동굴을 지나 궐수시티로 이어집니다.']);return true;
  }
  if(g.save.map==='tour_route_six_lab'&&id==='tourRouteSixLabPlants'){g.say('계절 식물 비교대',['같은 강가에서 기록한 네 계절의 잎과 씨앗 표본이다.','실제 계절 변화가 아니라 연구원이 모아 둔 고정 전시다.']);return true;}
  if(g.save.map==='tour_route_six_lab'&&id==='tourRouteSixLabRiver'){g.say('강물 높이 기록판',['목재 다리 기둥에서 읽은 강물 높이가 날짜별로 표시돼 있다.','현재 본선은 수상이동 없이 두 다리로 건널 수 있다.']);return true;}
  if(g.save.map==='tour_route_six_lab'&&id==='tourRouteSixLabJournal'){
    const save=g.save,record=(species:number)=>{if(g.save!==save||g.save.map!=='tour_route_six_lab')return;const first=!save.flags.unovaRouteSixObservation;save.flags.unovaRouteSixObservation=true;save.flags.unovaRouteSixObservationSpecies=species;g.persist();const line=species?`${SPECIES[species].name}와 함께 본 풀·강물·결정 조각의 특징을 기록했다.`:'혼자 살핀 풀·강물·결정 조각의 특징을 기록했다.';g.say('동행 관찰 기록대',[line,first?'이 기록은 궐수 공항 터미널의 도착 안내에서 다시 확인할 수 있다.':'새로 고른 관찰 방식으로 앞선 기록을 갱신했다.','관찰은 선택이며 포획·보상·통행 조건으로 쓰이지 않는다.']);};
    const healthy=save.party.filter(p=>p.hp>0);
    g.say('동행 관찰 기록대',[save.flags.unovaRouteSixObservation?'앞서 남긴 기록이 있다. 함께 볼 동료나 혼자 관찰을 다시 선택할 수 있다.':'풀·강물·결정 조각을 누구와 관찰할지 선택하자.','지친 동료는 센터에서 회복한 뒤 선택할 수 있다.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 기록한다',action:()=>record(0)},{label:'돌아가기',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_route_six_lab'&&id==='tourRouteSixLabMap'){g.say('6번도로 입체 지도',['물풍경시티 → 6번도로 → 전기돌동굴 1F 남부','전기돌동굴 B1F → 1F 북부 → 궐수시티','모든 구간은 현재 열린 육로 본선으로 표시돼 있다.']);return true;}
  if(g.save.map==='tour_mistralton_hall'&&id==='tourMistraltonArrivalBoard'){
    const observed=Boolean(g.save.flags.unovaRouteSixObservation),first=!g.save.flags.mistraltonArrivalLogged;g.save.flags.mistraltonArrivalLogged=true;if(first)g.persist();
    const species=Number(g.save.flags.unovaRouteSixObservationSpecies??0),observation=observed?(species&&SPECIES[species]?`${SPECIES[species].name}와 남긴 계절 연구소 관찰 기록도 도착 수첩에 이어져 있다.`:'혼자 남긴 계절 연구소 관찰 기록도 도착 수첩에 이어져 있다.'):'계절 연구소 관찰 기록은 비어 있다. 기록하지 않아도 이동과 도시 이용에는 영향이 없다.';
    g.say('궐수 도착 안내도',['물풍경시티 → 6번도로 → 전기돌동굴 1F 남부 → B1F → 1F 북부 → 궐수시티',observation,first?'궐수 도착 기록을 수첩에 남겼다. 보상이나 새 통행 조건은 생기지 않는다.':'이미 남긴 궐수 도착 기록과 육로 순서를 다시 확인했다.','센터는 북서쪽, 활주로 보행로는 동쪽이다. 현재 이용 가능한 항공편은 없다.']);return true;
  }
  if(g.save.map==='tour_mistralton_hall'&&id==='tourMistraltonLentimasFlight'){
    const save=g.save;g.say('산로행 조종사',['이 비행기는 도로가 아니라 궐수 공항과 산로마을을 잇는 본편 항공 구간입니다.','산로마을에서는 같은 조종사에게 부탁해 궐수로 돌아올 수 있습니다.'],undefined,[{label:'산로마을로 간다',action:()=>{if(g.save!==save||save.map!=='tour_mistralton_hall')return;save.map='tour_lentimas';save.player={x:14,y:11,facing:'down'};save.flags.lentimasFlightArrived=true;g.persist();g.say('산로마을 도착',['화산재 바람이 부는 산로마을에 도착했다.','산길 안내소와 마을을 살핀 뒤 동쪽 리버스마운틴 방향을 확인하자.']);}},{label:'아직 가지 않는다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_lentimas'&&id==='tourLentimasReturnFlight'){
    const save=g.save;g.say('궐수행 조종사',['궐수 공항으로 돌아가는 같은 왕복 항공편입니다.','출발하면 공항 터미널 1층에 도착합니다.'],undefined,[{label:'궐수시티로 돌아간다',action:()=>{if(g.save!==save||save.map!=='tour_lentimas')return;save.map='tour_mistralton_hall';save.player={x:14,y:18,facing:'down'};g.persist();g.say('궐수 공항 도착',['산로마을에서 궐수 공항으로 돌아왔다.']);}},{label:'마을에 머문다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_lentimas_hall'&&id==='tourLentimasPreparation'){
    const save=g.save,healthy=save.party.filter(mon=>mon.hp>0),record=(species:number)=>{if(g.save!==save||save.map!=='tour_lentimas_hall')return;save.flags.lentimasMountainPrepared=true;save.flags.lentimasPreparedSpecies=species;g.persist();g.say('리버스마운틴 준비표',[species&&SPECIES[species]?`${SPECIES[species].name}와 함께 물·마른 천·귀환 방향을 확인했다.`:'혼자 물·마른 천·귀환 방향을 확인했다.','준비 기록은 보상이나 통행 조건이 아니다. B 동쪽 출구로 물결마을에 도착하거나 같은 길로 돌아올 수 있다.']);};
    g.say('리버스마운틴 준비표',[save.flags.lentimasMountainPrepared?'앞서 남긴 준비 기록이 있다. 동료나 혼자 점검을 다시 선택할 수 있다.':'재바람과 뜨거운 지면에 대비해 동료 상태와 귀환 방향을 확인하자.','지친 동료는 센터에서 회복한 뒤 선택할 수 있다.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 점검한다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_reversal_mountain_exterior'&&id==='tourReversalRanger'){
    const species=Number(g.save.flags.lentimasPreparedSpecies??0),prepared=g.save.flags.lentimasMountainPrepared===true;
    g.say('재바람 산길지기',[prepared?(species&&SPECIES[species]?`${SPECIES[species].name}와 준비표를 확인했군요. 재가 눈과 발에 끼지 않는지 자주 살펴 주세요.`:'혼자 준비표를 확인했군요. 물과 마른 천을 꺼내기 쉬운 곳에 두세요.'):'산로마을 안내소 준비표에서 동료 상태와 귀환 방향을 먼저 확인할 수 있어요.','동쪽 입구에서 통과구역 A와 B를 지나 물결마을까지 왕복할 수 있습니다.','고온 지대의 휴게 홈과 각 구역의 산로 귀환 표지를 확인하세요.']);return true;
  }
  if(g.save.map==='tour_reversal_mountain_a'&&id==='tourReversalCaveGuide'){
    const species=Number(g.save.flags.lentimasPreparedSpecies??0),prepared=g.save.flags.lentimasMountainPrepared===true;
    g.say('화산 동굴 조사원',[prepared?(species&&SPECIES[species]?`${SPECIES[species].name}와 준비하고 왔군요. 증기 관측선에서는 얼굴을 바람 반대쪽으로 두세요.`:'준비표를 확인했군요. 혼자 걸을 때는 외부 귀환 표지를 더 자주 확인하세요.'):'산로마을 안내소 준비표는 선택이지만 물과 마른 천, 동료 상태를 확인하는 데 도움이 됩니다.','식은 용암 수로는 물길이 아니며 증기 틈 가까이 다가가지 마세요.','북동쪽은 통과구역 B로 이어지고, B의 동쪽 출구는 물결마을 서쪽 절벽에 닿습니다.']);return true;
  }
  if(g.save.map==='tour_reversal_mountain_b'&&id==='tourReversalDeepGuide'){
    const species=Number(g.save.flags.lentimasPreparedSpecies??0),prepared=g.save.flags.lentimasMountainPrepared===true;
    g.say('고온 지대 산길지기',[prepared?(species&&SPECIES[species]?`${SPECIES[species].name}와 준비한 물과 천을 여기서 다시 확인하세요.`:'혼자 준비했더라도 서늘한 바람 홈에서 자주 쉬어 가세요.'):'준비 기록이 없어도 A로 돌아갈 수 있습니다. 지면 색과 귀환 표지를 먼저 확인하세요.','붉게 변색된 지면은 우회선 바깥에서 관찰하고 광물벽을 캐지 마세요.','동쪽 출구로 나가면 물결마을입니다. 서쪽으로 되돌아가면 A와 산로마을까지 돌아갈 수 있어요.']);return true;
  }
  if(g.save.map==='tour_undella_hall'&&id==='tourUndellaArrivalLog'){
    const first=!g.save.flags.undellaArrivalLogged,species=Number(g.save.flags.lentimasPreparedSpecies??0),prepared=g.save.flags.lentimasMountainPrepared===true;
    g.save.flags.undellaArrivalLogged=true;if(first)g.persist();
    const preparation=prepared?(species&&SPECIES[species]?`산로마을에서 ${SPECIES[species].name}와 준비표를 확인했다.`:'산로마을에서 혼자 준비표를 확인했다.'):'산로마을 준비 기록 없이 도착했지만 통행에는 문제가 없었다.';
    g.say('리버스마운틴 도착 기록대',['산로마을 → 리버스마운틴 외부 → 통과구역 A → 통과구역 B → 물결마을',preparation,first?'물결마을 도착을 수첩에 남겼다. 보상이나 새 통행 조건은 생기지 않는다.':'앞서 남긴 물결마을 도착 기록과 귀환 순서를 다시 확인했다.','서쪽은 같은 구간을 거슬러 산로마을로, 동쪽은 13번도로를 지나 보배마을로 이어진다.']);return true;
  }
  if(g.save.map==='tour_undella_hall_3f'&&id==='tourUndellaCompanionCare'){
    const companion=g.save.party.find(mon=>mon.hp>0);if(!companion){g.say('동행 손질 기록',['현재 함께 손질하고 쉴 건강한 동료가 없다.','센터 PC에서 동료를 확인하거나 간호사에게 회복한 뒤 다시 와도 된다.']);return true;}
    const first=!g.save.flags.undellaCompanionCared,changed=Number(g.save.flags.undellaCaredSpecies??0)!==companion.species;g.save.flags.undellaCompanionCared=true;g.save.flags.undellaCaredSpecies=companion.species;if(first||changed)g.persist();
    g.say('동행 손질 기록',[`${SPECIES[companion.species].name}의 발과 털에 남은 화산재와 해변 모래를 털고 깨끗한 물을 마시게 했다.`,first?'동행 손질 기록을 남겼다. HP 회복이나 능력 변화는 없다.':'앞서 남긴 동행 손질 기록을 다시 확인했다.','실제 회복이 필요하면 포켓몬센터를 이용하자.']);return true;
  }
  if(g.save.map==='tour_undella'&&id==='tourResident0'){g.say('동굴 도착 여행자',[g.save.flags.undellaArrivalLogged?'안내소에 산로마을부터 걸어온 순서를 남겼군요. 이제 센터와 귀환길을 쉽게 확인할 수 있겠어요.':'리버스마운틴을 지나왔다면 안내소 1층 기록대에서 산로마을부터의 순서를 남길 수 있어요.','기록은 선택이며 동굴 귀환이나 다른 통행 조건을 바꾸지 않아요.']);return true;}
  if(g.save.map==='tour_undella'&&id==='tourResident2'){
    const species=Number(g.save.flags.undellaCaredSpecies??0),cared=g.save.flags.undellaCompanionCared===true;
    g.say('해풍 정원지기',[cared&&species&&SPECIES[species]?`${SPECIES[species].name}의 재와 모래를 안내소에서 털어 주었군요. 정원의 그늘과 물그릇도 자유롭게 이용하세요.`:'안내소 3층에는 동굴의 재와 해변 모래를 털 수 있는 손질대가 있어요.','손질 기록은 동료의 HP나 능력치를 바꾸지 않아요. 실제 회복은 센터에서 받아 주세요.']);return true;
  }
  if(g.save.map==='tour_unova_route_13'&&id==='routeThirteenRanger'){g.say('13번도로 해안지기',['남쪽은 물결마을, 북쪽은 절벽 샘과 고지 초원을 지나 보배마을 방향입니다.','절벽 곁 샛길은 본선으로 다시 합류합니다. 숨은동굴 내부와 야생 조우는 아직 연결되지 않았어요.']);return true;}
  if(g.save.map==='tour_unova_route_13'&&id==='routeThirteenHiker'){g.say('고지 산행객',['바닷바람에 젖은 길이 위쪽으로 갈수록 마른 초원길로 바뀌어요.','북쪽은 보배마을 남쪽 성벽 문, 남쪽은 물결마을입니다. 어느 쪽으로도 같은 길을 왕복할 수 있어요.']);return true;}
  if(g.save.map==='tour_lacunosa_hall'&&id==='tourLacunosaWallLog'){
    const save=g.save,healthy=save.party.filter(mon=>mon.hp>0),record=(species:number)=>{if(g.save!==save||save.map!=='tour_lacunosa_hall')return;save.flags.lacunosaWallLogged=true;save.flags.lacunosaWallSpecies=species;g.persist();g.say('성벽 점검 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 남쪽 문·돌담·13번도로 귀환 표지를 확인했다.`:'혼자 남쪽 문·돌담·13번도로 귀환 표지를 확인했다.','확인된 생활 기록만 남겼다. 전해 오는 이야기를 본편 사건으로 확정하지 않는다.','기록은 보상이나 12번도로 통행 조건이 아니다.']);};
    g.say('성벽 점검 기록대',[save.flags.lacunosaWallLogged?'앞서 남긴 성벽 점검 기록이 있다. 동료나 혼자 다시 확인할 수 있다.':'남쪽 문과 오래된 돌담, 13번도로 귀환 표지를 살펴보자.','건강한 동료를 선택하거나 혼자 기록할 수 있다.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 기록한다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_lacunosa_hall_3f'&&id==='tourLacunosaCourtyardCare'){
    const save=g.save,healthy=save.party.filter(mon=>mon.hp>0),record=(species:number)=>{if(g.save!==save||save.map!=='tour_lacunosa_hall_3f')return;save.flags.lacunosaCourtyardCared=true;save.flags.lacunosaCourtyardSpecies=species;g.persist();g.say('공동 돌봄 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 안뜰 물그릇·그늘·통로를 살폈다.`:'혼자 안뜰 물그릇·그늘·통로를 살폈다.','HP 회복이나 능력 변화는 없다. 실제 회복은 센터에서 받을 수 있다.']);};
    g.say('공동 돌봄 기록대',[save.flags.lacunosaCourtyardCared?'앞서 남긴 공동 돌봄 기록이 있다.':'사람과 포켓몬이 함께 쓰는 안뜰을 살펴보자.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 살핀다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_lacunosa'&&id==='tourResident0'){g.say('13번도로 도착 주민',[g.save.flags.lacunosaWallLogged?'기록관에 남쪽 성벽 점검을 남겼군요. 13번도로 귀환 표지도 함께 확인했겠어요.':'기록관 1층에서 남쪽 문과 13번도로 귀환 표지를 동료와 살필 수 있어요.','점검 기록 없이도 13번도로를 왕복할 수 있습니다.']);return true;}
  if(g.save.map==='tour_lacunosa'&&id==='tourResident1'){const species=Number(g.save.flags.lacunosaCourtyardSpecies??0);g.say('공동 안뜰 돌봄이',[g.save.flags.lacunosaCourtyardCared?(species&&SPECIES[species]?`${SPECIES[species].name}와 안뜰을 살폈군요. 고마워요.`:'안뜰 물그릇과 통로를 살폈군요. 고마워요.'):'기록관 3층에서 건강한 동료와 안뜰 돌봄 순서를 확인할 수 있어요.','이 활동은 선택이며 실제 회복은 센터에서 받아 주세요.']);return true;}
  if(g.save.map==='tour_unova_route_12'&&id==='tourRouteTwelveWalker'){g.say('12번도로 들판 여행자',['동쪽은 보배마을 성벽, 서쪽은 빌리지브리지 방향이에요.','넓은 초원길의 두 쉼터는 본선으로 다시 합류합니다. 야생 조우나 트레이너전은 아직 연결되지 않았어요.']);return true;}
  if(g.save.map==='tour_mistralton_center'&&id==='tourMistraltonCenterGuide'){
    const healthy=g.save.party.filter(p=>p.hp===p.maxHp).length,hurt=g.save.party.filter(p=>p.hp>0&&p.hp<p.maxHp).length,fainted=g.save.party.filter(p=>p.hp<=0).length;
    g.say('궐수 여행 준비 안내',[g.save.party.length?`현재 동료 ${g.save.party.length}마리 · 건강 ${healthy} · 부상 ${hurt} · 기절 ${fainted}`:'현재 함께 걷는 동료가 없다. PC에서 맡긴 동료를 확인할 수 있다.',g.save.flags.mistraltonArrivalLogged?'공항 터미널에 궐수 도착 기록이 남아 있다.':'공항 터미널 1층 도착 안내도에서 지나온 육로를 확인할 수 있다.','남쪽은 전기돌동굴을 거쳐 6번도로와 물풍경시티로 돌아간다. 다른 출구는 실제 연결된 육로 표지를 따른다.']);return true;
  }
  if(g.save.map==='tour_mistralton_hall_2f'&&id==='tourMistraltonWeatherLog'){
    const first=!g.save.flags.mistraltonOperationsReviewed;g.save.flags.mistraltonOperationsReviewed=true;if(first)g.persist();
    g.say('바람 관측판',[g.save.flags.unovaRouteSixObservation?'6번도로에서 남긴 강가 바람 기록과 활주로 풍향표를 나란히 비교했다.':'활주로 풍향 기록은 보이지만 6번도로 계절 연구소의 관찰 기록은 비어 있다.',first?'화물·기상 운영 검토를 수첩에 남겼다. 운항이나 통행 조건은 바뀌지 않는다.':'앞서 검토한 풍향과 안전 구역 표시가 그대로 남아 있다.','현재 항공편은 운영하지 않는다. 동쪽 활주로는 울타리 밖 보행로에서 관찰한다.']);return true;
  }
  if(g.save.map==='tour_mistralton_hall_2f'&&id==='tourMistraltonCargoLog'){
    g.say('화물 적재표',[g.save.flags.mistraltonArrivalLogged?'궐수 도착 기록 옆에 전기돌동굴 광물 표본과 농로 작물의 분류표가 이어져 있다.':'도착 수첩은 비어 있지만 화물 분류표는 자유롭게 볼 수 있다.','광물 표본·농산물·생활 물품을 서로 다른 색으로 나누었다.','표에 적힌 목적지는 작업 기록이며 이용 가능한 여객 항공편 목록이 아니다.']);return true;
  }
  if(g.save.map==='tour_mistralton_hall_3f'&&id==='tourMistraltonCompanionRest'){
    const companion=g.save.party.find(p=>p.hp>0);if(!companion){g.say('비행 포켓몬 휴게 기록',['현재 함께 쉬어 갈 건강한 동료가 없다.','센터 PC에서 동료를 확인하거나 간호사에게 회복한 뒤 다시 와도 된다.']);return true;}
    const first=!g.save.flags.mistraltonCompanionRested;g.save.flags.mistraltonCompanionRested=true;if(first)g.persist();
    g.say('비행 포켓몬 휴게 기록',[`${SPECIES[companion.species].name}와 창가에서 활주로 바람을 살피며 잠시 쉬었다.`,first?'동료 휴식 기록을 남겼다. HP 회복이나 능력 변화는 없다.':'앞서 남긴 동료 휴식 기록을 다시 읽었다.','실제 회복이 필요하면 포켓몬센터를 이용하자.']);return true;
  }
  if(g.save.map==='tour_mistralton_hall_3f'&&id==='tourMistraltonRoadJournal'){
    g.say('다음 육로 수첩',['남쪽 → 전기돌동굴 1F 북부 → B1F → 1F 남부 → 6번도로 → 물풍경시티',g.save.flags.mistraltonOperationsReviewed?'2층에서 화물·기상 운영 기록을 검토했다.':'2층의 바람 관측판과 화물 적재표는 아직 살펴보지 않았다.',g.save.flags.mistraltonCompanionRested?'건강한 동료와 전망실에서 쉰 기록이 있다.':'동료 휴식 기록은 비어 있다.','다른 도시 방향은 외부의 실제 출구 표지를 따른다. 항공편은 현재 이용할 수 없다.']);return true;
  }
  if(g.save.map==='tour_mistralton'&&id==='tourResident0'){g.say('동굴 도착 여행자',[g.save.flags.mistraltonArrivalLogged?'터미널에 도착 기록을 남겼군요. 이제 센터에서 동료 상태를 살펴보세요.':'전기돌동굴을 지나왔다면 터미널 1층 안내도에서 육로 순서를 확인할 수 있어요.','남쪽 출구는 동굴 북부 입구, 센터는 북서쪽입니다.']);return true;}
  if(g.save.map==='tour_mistralton'&&id==='tourResident1'){g.say('활주로 유도원',[g.save.flags.mistraltonOperationsReviewed?'2층에서 풍향과 안전 구역을 확인했군. 보행선 밖으로 나가지 말아 줘.':'터미널 2층에서 풍향과 작업 구역을 견학할 수 있어.','현재 항공편은 없고 활주로 안쪽은 작업 구역이야.']);return true;}
  if(g.save.map==='tour_mistralton'&&id==='tourResident2'){g.say('화물 기록원',[g.save.flags.unovaRouteSixObservation?'6번도로 관찰 기록과 동굴 표본 분류를 연결해 두었어요.':'계절 연구소 기록이 없어도 화물 견학과 도시 이동에는 영향이 없어요.',g.save.flags.mistraltonArrivalLogged?'도착 기록은 터미널 수첩에 보존돼 있습니다.':'터미널 1층에서 도착 육로를 확인할 수 있습니다.']);return true;}
  if(g.save.map==='tour_mistralton'&&id==='tourResident3'){g.say('바람쉼터 관리인',[g.save.flags.mistraltonCompanionRested?'전망실에서 동료와 쉬었군요. 필요하면 센터에서 실제 회복도 해 주세요.':'터미널 3층은 사람과 포켓몬이 함께 바람을 보며 쉬는 곳이에요.','휴식 기록은 선택이며 통행 조건이 아닙니다.']);return true;}
  if(id==='jubilifeGrassSign'&&g.save.map==='tour_jubilife'){g.say('축복시티 외곽 풀밭',encounterGuidance(g.save.map).pages);return true;}
  if(id==='martClerk'&&MART_ROOMS.has(g.save.map)){shopMenu(g);return true;}
  if(isWorldCenter(g.save.map)&&id==='tourExhibit1'){pcMenu(g);return true;}
  const passage=PASSAGES[g.save.map];if(!passage)return false;
  if(g.save.map==='tour_unova_route_01'&&id==='journeySign'){
    g.say('4번도로 이정표',['4번도로 · 리조트데저트 입구\n← 4번도로 본선  → 리조트데저트','남쪽 사암 전망길은 큰길로 돌아옵니다.\n이 구간에는 야생 조우가 없습니다.']);return true;
  }
  if(g.save.map==='tour_unova_route_01'&&id==='journeyWalker'){
    g.say('사막 분기 안내원',['← 4번도로 본선  → 리조트데저트','남쪽 전망길은 두 곳에서 큰길과 만나요.\n사암을 살펴본 뒤 본선으로 되돌아올 수 있어요.']);return true;
  }
  if(id==='journeySign'){g.say('이정표',passageSignPages(g.save.map,passage.a.name,passage.b.name));return true;}
  if(id==='journeyWalker'){
    g.say(g.save.map==='tour_eterna_coronet_approach'?'산기슭 여행자':g.save.map==='tour_sinnoh_route_208'?'208번도로 등산객':'여행자',passageWalkerPages(g.save.map,passage.a.name,passage.b.name,Boolean(g.save.flags['pickup:'+g.save.map])));return true;
  }
  if(id==='journeyItem'){
    const key='pickup:'+g.save.map;
    if(g.save.flags[key])g.say('작은 공터',['여기서 상처약을 찾았었다.\n여행자가 지나간 발자국이 남아 있다.']);
    else if(g.save.inventory.potions>=999)g.say('상처약',['가방이 가득 찼다.\n빈자리가 생기면 다시 오자.']);
    else {g.save.flags[key]=true;g.save.inventory.potions++;g.persist();g.audio.play('receive');g.say('',['상처약 1개를 주웠다!\n가방의 도구 주머니에 넣었다.']);}
    return true;
  }
  return false;
}
