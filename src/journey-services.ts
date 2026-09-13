import { RUNTIME_RULES } from './data/rules';
import { BASIC_SHOP_ITEMS } from './data/items';
import type { Engine } from './engine';
import { handleCasteliaHome } from './castelia-homes';
import { handleCasteliaGallery } from './castelia-gallery';
import type { Choice,Pokemon,SaveData } from './types';
import { SPECIES,RUNTIME_SPECIES,availableMoves,pokemonMoves } from './pokemon';
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
import { handleSinnohCelesticLife } from './sinnoh-celestic-life';
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
import { handleVioletLife } from './violet-life';
import { handleEcruteakLife } from './ecruteak-life';
import { handleJohtoParkLife } from './johto-park-life';
import { handleJohtoOlivineLife } from './johto-olivine-life';
import { handleOlivineLife } from './olivine-life';
import { handleJohtoSeaLife } from './johto-sea-life';
import { handleCianwoodLife } from './cianwood-life';
import { handleJohtoRoute42Life } from './johto-route-42-life';
import { handleMahoganyLife } from './mahogany-life';
import { handleJohtoRoute43Life } from './johto-route-43-life';
import { handleRageLakeLife } from './rage-lake-life';
import { handleJohtoIcePathLife } from './johto-ice-path-life';
import { handleBlackthornLife } from './blackthorn-life';
import { handleJohtoBlackthornSouthLife } from './johto-blackthorn-south-life';
import { handleLavenderLife } from './lavender-life';
import { handleDragonspiralLife } from './dragonspiral-life';
import { handleIcirrusMoorLife } from './icirrus-moor-life';
import { handleIcirrusHomeLife } from './icirrus-home-life';
import { handleIcirrusMartLife } from './icirrus-mart-life';
import { handleUnovaRouteNineLife } from './unova-route-nine-life';

const OPELUCID_ROUTE_SPECIES=new Set([183,588,616]);
const OPELUCID_ROUTE_MET='하나 11번도로';
const OPELUCID_ROUTE_TRAINER_WIN='trainerWon:unova-route-11-practice';
const ICIRRUS_ROUTE_SPECIES=new Set([588,616]);
const ICIRRUS_ROUTE_MET='하나 8번도로';
const ICIRRUS_ROUTE_TRAINER_WIN='trainerWon:unova-route-8-practice';
function opelucidRouteMovePages(save:SaveData):string[]{
  const owned=[...save.party,...save.box??[]];
  return [...OPELUCID_ROUTE_SPECIES].flatMap(id=>{
    const species=SPECIES[id],supported=(RUNTIME_SPECIES[id]?.learnset??[]).filter(entry=>entry.level<=25).map(entry=>entry.move),local=owned.filter(mon=>mon.species===id&&mon.met===OPELUCID_ROUTE_MET);
    const pages=[`${species.name} · Lv.23~25 선택 조우\n지원 레벨 기술: ${supported.join(' · ')||'없음'}`];
    if(!local.length)return [...pages,`${species.name} 현지 동료 없음\n포획하지 않아도 안전 본선과 역사관 활동을 이용할 수 있다.`];
    for(const mon of local){const current=pokemonMoves(mon),options=availableMoves(mon,save).filter(move=>!current.includes(move));pages.push(`${species.name} Lv.${mon.level} · ${save.party.includes(mon)?'현재 파티':'센터 PC'}\n현재 기술: ${current.join(' · ')}`,`${species.name} · 확인 가능한 다른 지원 기술\n${options.length?options.join(' · '):'현재 새 후보 없음'}`);}
    return pages;
  });
}
import { handleSaffronLife } from './saffron-life';
import { handleCeladonLife } from './celadon-life';
import { handleCeladonResearchStory } from './celadon-research-story';
import { handleFuchsiaLife } from './fuchsia-life';
import { trackFieldPartners } from './field-partner-party';

// Prices are the NEXUS items.json project values, not another generation's prices.
export const SHOP_ITEMS=BASIC_SHOP_ITEMS;
export const BOX_CAPACITY=RUNTIME_RULES.boxCapacity;
type CollectionSave=SaveData&{box?:Pokemon[];pokedex?:{seen:number[];caught:number[]}};
export function purchase(s:SaveData,index:number,quantity:number):string{
  const item=SHOP_ITEMS[index];
  if(!item||!Number.isInteger(quantity)||quantity<1||quantity>RUNTIME_RULES.purchaseQuantityLimit)return '구매할 수량을 다시 선택해 주세요.';
  if(s.inventory[item.key]+quantity>RUNTIME_RULES.inventoryCapacity)return '가방에 더 담을 수 없어요.\n수량을 줄여 주세요.';
  const cost=item.price*quantity;if(s.money<cost)return `돈이 부족해요.\n필요 금액 ${cost}원 · 소지금 ${s.money}원`;
  s.money-=cost;s.inventory[item.key]+=quantity;
  return `${item.name} ${quantity}개를 샀다!\n남은 돈 ${s.money}원`;
}
export function depositPokemon(s:CollectionSave,index:number):string{
  const p=s.party[index];if(!Number.isInteger(index)||!p)return '맡길 포켓몬을 선택해 주세요.';
  if((s.box?.length??0)>=BOX_CAPACITY)return '박스가 가득 찼어요. (60마리)';
  if(s.party.length<=1||!s.party.some((mon,i)=>i!==index&&mon.hp>0))return '모험할 수 있는 건강한 포켓몬을\n한 마리 이상 데리고 있어야 해요.';
  const track=trackFieldPartners(s);
  (s.box??=[]).push(s.party.splice(index,1)[0]);track();
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
  if(handleUnovaRouteNineLife(g,id))return true;
  if(handleIcirrusMartLife(g,id))return true;
  if(handleIcirrusHomeLife(g,id))return true;
  if(handleIcirrusMoorLife(g,id))return true;
  if(handleDragonspiralLife(g,id))return true;
  if(handleAzaleaLife(g,id))return true;
  if(handleIlexLife(g,id))return true;
  if(handleVioletLife(g,id))return true;
  if(handleEcruteakLife(g,id))return true;
  if(handleJohtoParkLife(g,id))return true;
  if(handleJohtoOlivineLife(g,id))return true;
  if(handleOlivineLife(g,id))return true;
  if(handleJohtoSeaLife(g,id))return true;
  if(handleCianwoodLife(g,id))return true;
  if(handleJohtoRoute42Life(g,id))return true;
  if(handleMahoganyLife(g,id))return true;
  if(handleJohtoRoute43Life(g,id))return true;
  if(handleRageLakeLife(g,id))return true;
  if(handleJohtoIcePathLife(g,id))return true;
  if(handleBlackthornLife(g,id))return true;
  if(handleJohtoBlackthornSouthLife(g,id))return true;
  if(handleJohtoSouthLife(g,id))return true;
  if(handleLavenderLife(g,id))return true;
  if(handleCeladonResearchStory(g,id))return true;
  if(handleSaffronLife(g,id))return true;
  if(handleCeladonLife(g,id))return true;
  if(handleFuchsiaLife(g,id))return true;
  if(handleCasteliaHome(g,id))return true;
  if(handleCinnabarLife(g,id))return true;
  if(handleVermilionLife(g,id))return true;
  if(handleCasteliaGallery(g,id))return true;
  if(handleEternaLife(g,id))return true;
  if(handleSinnohCelesticLife(g,id))return true;
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
  if(g.save.map==='tour_unova_route_12'&&id==='tourRouteTwelveWalker'){g.say('12번도로 들판 여행자',['동쪽은 보배마을 성벽, 서쪽은 빌리지브리지예요.','넓은 초원길의 두 쉼터는 본선으로 다시 합류합니다. 야생 조우나 트레이너전은 아직 연결되지 않았어요.']);return true;}
  if(g.save.map==='tour_unova_route_11'&&id==='tourRouteElevenKeeper'){g.say('11번도로 길지기',['동쪽은 빌리지브리지, 서쪽은 쌍용시티예요.','전망길과 바위 단차 길은 본선으로 다시 합류하고 가운데 넓은 길은 조우 없는 안전 본선입니다.',...encounterGuidance(g.save.map).pages,'물길 전망 순환로에는 거절하거나 패배 뒤 다시 도전할 수 있는 생태 트레이너가 있어요.','흔들리는 풀·수상·낚시·특별 조우는 아직 연결되지 않았어요.']);return true;}
  if(g.save.map==='tour_unova_route_08'&&id==='tourGuide'){
    const save=g.save,local=save.party.filter(mon=>mon.met===ICIRRUS_ROUTE_MET&&ICIRRUS_ROUTE_SPECIES.has(mon.species));
    const tired=save.party.some(mon=>mon.hp<mon.maxHp),balls=save.inventory.pokeBalls;
    const guide=(map:string,event?:string)=>()=>{if(g.save===save&&save.map==='tour_unova_route_08'&&!g.battle)g.setTourDestination(map,event);};
    const choices=[
      {label:'설화센터 회복·PC',action:guide('tour_icirrus_center')},
      {label:'몬스터볼 보충',action:guide('tour_icirrus_mart','martClerk')},
      {label:'북쪽 서식지로',action:guide('tour_unova_route_08','tourRouteEightMarsh')},
      {label:'습지 트레이너에게',action:guide('tour_unova_route_08','tourRouteEightTrainer')},
      {label:'습지 동료 관찰',action:guide('tour_icirrus_moor','icirrusMoorKeeper')},
      {label:'튜브라인브리지로',action:guide('tour_tubeline_bridge')},
      {label:'계속 걷는다',action:()=>{}},
    ];
    if(!tired&&balls>0){const preferred=local.length?3:2;choices.unshift(...choices.splice(preferred,1));}
    g.say('8번도로 우산 여행자',[
      '서쪽은 설화시티 센터, 동쪽은 튜브라인브리지·9번도로·쌍용시티입니다.',
      tired?'지친 동료가 있군요. 마른 본선을 따라 설화센터에서 회복하고 다시 와도 됩니다.':balls===0?'몬스터볼이 없군요. 설화 상점에서 준비한 뒤 풀밭으로 돌아오세요.':local.length?'이 길에서 만난 동료와 북쪽 공터의 선택 배틀을 해 볼 수 있어요.':'북쪽·남쪽 선택 풀밭에서 동료를 만날 수 있어요. 가운데 본선은 조우가 없습니다.',
      ...encounterGuidance(save.map).pages,
      '북쪽 풀밭 아래 마른 샛길로 본선에 돌아올 수 있어요. 풀을 밟지 않고 트레이너에게 가는 길도 열려 있습니다.',
      save.flags[ICIRRUS_ROUTE_TRAINER_WIN]?'트레이너에게 이긴 기록이 있습니다. 다음은 습지 동행 관찰이나 동쪽 다리 여행을 이어가세요.':'트레이너전은 선택입니다. 포획 여부와 승패로 통행이 막히지 않습니다.',
    ],undefined,choices);return true;
  }
  if(g.save.map==='tour_opelucid_hall'&&id==='tourOpelucidCityLog'){
    const save=g.save,healthy=save.party.filter(mon=>mon.hp>0).sort((a,b)=>Number(b.met===OPELUCID_ROUTE_MET&&OPELUCID_ROUTE_SPECIES.has(b.species))-Number(a.met===OPELUCID_ROUTE_MET&&OPELUCID_ROUTE_SPECIES.has(a.species))),record=(species:number)=>{if(g.save!==save||save.map!=='tour_opelucid_hall')return;save.flags.opelucidCityLogged=true;save.flags.opelucidArrivalSpecies=species;g.persist();g.say('쌍용 도시 생활 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 11번도로 도착문·오래된 석조 거리·새 거리의 보행 여백을 확인했다.`:'혼자 11번도로 도착문·오래된 석조 거리·새 거리의 보행 여백을 확인했다.','현재 파티의 동행 기록이며 실제 만난 장소는 각 포켓몬의 출처 기록을 따른다.','보상·체육관·배지·통행 조건은 바뀌지 않는다.']);};
    g.say('도시 생활 기록대',[save.flags.opelucidCityLogged?'앞서 남긴 쌍용 도시 생활 기록이 있다. 동료나 혼자 다시 살필 수 있다.':'11번도로 도착문과 두 생활 거리의 현재 쓰임을 확인해 보자.','11번도로 출신의 건강한 파티 동료는 목록 앞에 표시한다. 없어도 다른 동료나 혼자 기록할 수 있다.'],undefined,[...healthy.map(mon=>({label:`${SPECIES[mon.species].name}${mon.met===OPELUCID_ROUTE_MET&&OPELUCID_ROUTE_SPECIES.has(mon.species)?' · 11번도로':''}`,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 기록한다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_opelucid_hall_2f'&&id==='tourOpelucidMoveStudy'){
    const save=g.save,local=[...save.party,...save.box??[]].filter(mon=>mon.met===OPELUCID_ROUTE_MET&&OPELUCID_ROUTE_SPECIES.has(mon.species));
    g.say('11번도로 동료 기술 자료',[`11번도로 현지 동료 ${local.length}마리\n파티 ${local.filter(mon=>save.party.includes(mon)).length} · PC ${local.filter(mon=>!save.party.includes(mon)).length}`,...opelucidRouteMovePages(save),'이 자료는 현재 지원 기술을 비교할 뿐 기술을 지급·교체하거나 필드 효과를 일으키지 않는다.'],undefined,[{label:'자료를 덮는다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_opelucid_hall_3f'&&id==='tourOpelucidCompanionObserve'){
    const save=g.save,healthy=save.party.filter(mon=>mon.hp>0).sort((a,b)=>Number(b.met===OPELUCID_ROUTE_MET&&OPELUCID_ROUTE_SPECIES.has(b.species))-Number(a.met===OPELUCID_ROUTE_MET&&OPELUCID_ROUTE_SPECIES.has(a.species))),record=(species:number)=>{if(g.save!==save||save.map!=='tour_opelucid_hall_3f')return;save.flags.opelucidCompanionObserved=true;save.flags.opelucidObservedSpecies=species;g.persist();g.say('동행 문양 관찰 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 광장 기둥의 선·비늘·발자국 모양을 비교했다.`:'혼자 광장 기둥의 선·비늘·발자국 모양을 비교했다.','문양 관찰은 전설 포켓몬 조우나 사건 해결이 아니며 HP·능력치도 변하지 않는다.']);};
    g.say('동행 관찰석',[save.flags.opelucidCompanionObserved?'앞서 남긴 문양 관찰 기록이 있다.':'건강한 동료와 광장의 용 문양을 천천히 비교해 보자.','11번도로 출신 동료는 목록 앞에 표시하며 필수 포획 조건은 아니다.'],undefined,[...healthy.map(mon=>({label:`${SPECIES[mon.species].name}${mon.met===OPELUCID_ROUTE_MET&&OPELUCID_ROUTE_SPECIES.has(mon.species)?' · 11번도로':''}`,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 관찰한다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_opelucid_center'&&id==='tourOpelucidCenterGuide'){
    const save=g.save,healthy=save.party.filter(mon=>mon.hp===mon.maxHp).length,hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length,species=Number(save.flags.opelucidObservedSpecies??save.flags.opelucidArrivalSpecies??0),partyLocal=save.party.filter(mon=>mon.met===OPELUCID_ROUTE_MET&&OPELUCID_ROUTE_SPECIES.has(mon.species)),boxLocal=(save.box??[]).filter(mon=>mon.met===OPELUCID_ROUTE_MET&&OPELUCID_ROUTE_SPECIES.has(mon.species)),localNames=[...new Set([...partyLocal,...boxLocal].map(mon=>SPECIES[mon.species]?.name).filter(Boolean))];
    const current=()=>g.save===save&&save.map==='tour_opelucid_center'&&!g.battle;
    g.say('쌍용 여행 준비 지도',[save.party.length?`현재 파티 ${save.party.length}마리 · 건강 ${healthy} · 부상 ${hurt} · 기절 ${fainted}`:'현재 함께 걷는 동료가 없다. PC에서 맡긴 동료를 확인할 수 있다.',`11번도로 출신 동료 · 파티 ${partyLocal.length}마리 · PC ${boxLocal.length}마리${localNames.length?'\n'+localNames.join(' · '):'\n아직 현지 출신 동료 없음'}`,...opelucidRouteMovePages(save),save.flags[OPELUCID_ROUTE_TRAINER_WIN]?'11번도로 생태 트레이너와 겨룬 기록이 있다. 상금은 이미 받았으며 현지 동료를 편성해 다시 길을 나설 수 있다.':'11번도로 물길 전망 순환로에서 현지 세 종을 사용하는 선택 트레이너와 겨룰 수 있다.',save.flags.opelucidCityLogged?'역사관 1층에 11번도로 도착문과 두 거리의 생활 기록이 남아 있다.':'역사관 1층에서 11번도로 도착문과 두 거리의 현재 생활을 기록할 수 있다.',save.flags.opelucidCompanionObserved?(species&&SPECIES[species]?`3층에는 ${SPECIES[species].name}와 남긴 문양 관찰 기록이 있다.`:'3층에 혼자 남긴 문양 관찰 기록이 있다.'):'3층 동행 관찰석은 선택이며 전설 사건이나 통행 조건이 아니다.','역사관 2층에서 세 종의 현재 기술과 확인 가능한 지원 기술을 다시 비교할 수 있다.','동쪽은 공식 11번도로·빌리지브리지 방향이다. 기존 궐수·기하 축약 통로는 별도 귀환길로 표시한다.'],undefined,[
      {label:'센터 PC를 연다',action:()=>{if(current())pcMenu(g);}},
      {label:save.flags[OPELUCID_ROUTE_TRAINER_WIN]?'11번도로 재방문':'11번도로 트레이너',action:()=>{if(current())g.setTourDestination('tour_unova_route_11','tourRouteElevenTrainer');}},
      {label:'역사관 기술 자료',action:()=>{if(current())g.setTourDestination('tour_opelucid_hall_2f','tourOpelucidMoveStudy');}},
      {label:'지도를 덮는다',action:()=>{}},
    ]);return true;
  }
  if(g.save.map==='tour_opelucid'&&id==='tourResident0'){const species=Number(g.save.flags.opelucidArrivalSpecies??0);g.say('11번도로 도착 여행자',[g.save.flags.opelucidCityLogged?(species&&SPECIES[species]?`${SPECIES[species].name}와 도착문부터 두 거리를 살펴 기록했군요.`:'도착문부터 두 거리를 살펴 기록했군요.'):'역사관 1층에서 11번도로 도착문과 두 거리의 생활을 기록할 수 있어요.',g.save.flags[OPELUCID_ROUTE_TRAINER_WIN]?'물길 전망 공터의 생태 트레이너와 겨룬 기록도 남았군요. 센터에서 동료를 회복·편성하고 같은 길로 다시 떠날 수 있어요.':'물길 전망 공터의 선택 트레이너는 거절해도 길을 막지 않아요.','기록이나 승리 없이도 11번도로를 자유롭게 왕복할 수 있습니다.']);return true;}
  if(g.save.map==='tour_opelucid'&&id==='tourResident3'){const species=Number(g.save.flags.opelucidObservedSpecies??0);g.say('역사관 기록원',[g.save.flags.opelucidCompanionObserved?(species&&SPECIES[species]?`${SPECIES[species].name}와 문양을 비교한 기록을 분류해 둘게요.`:'혼자 문양을 비교한 기록을 분류해 둘게요.'):'역사관 3층에서 건강한 동료와 광장 문양을 관찰할 수 있어요.',g.save.flags[OPELUCID_ROUTE_TRAINER_WIN]?'11번도로 전투 뒤에는 2층에서 현지 동료의 현재 기술과 지원 기술을 비교해 보세요.':'2층 자료와 11번도로 선택 전투를 오가며 동료의 기술 역할을 확인할 수 있어요.','그 기록은 전설 포켓몬이나 본편 사건의 증거로 취급하지 않습니다.']);return true;}
  if(g.save.map==='tour_opelucid'&&id==='tourPokemon'){const species=Number(g.save.flags.opelucidObservedSpecies??0);g.say('석조 광장의 콩둘기',[g.save.flags.opelucidCompanionObserved?(species&&SPECIES[species]?`${SPECIES[species].name}와 남긴 문양 기록 옆에서 콩둘기가 비늘 모양 선을 따라 고개를 움직인다.`:'혼자 남긴 문양 기록 옆에서 콩둘기가 비늘 모양 선을 따라 고개를 움직인다.'):'구구구. 용 문양 기둥의 그늘에서 돌바닥 무늬를 살피고 있다.','주민과 함께 지내는 생활 개체이며 쌍용시티 야생 조우나 포획 대상은 아니다.']);return true;}
  if(g.save.map==='tour_icirrus_hall'&&id==='tourIcirrusArrivalLog'){
    const corner=()=>{if(g.save===save&&save.map==='tour_icirrus_hall'&&!g.battle)g.setTourDestination('tour_icirrus_hall','tourIcirrusCompanionCorner');};
    const save=g.save,healthy=save.party.filter(mon=>mon.hp>0),record=(species:number)=>{if(g.save!==save||save.map!=='tour_icirrus_hall')return;save.flags.icirrusArrivalLogged=true;save.flags.icirrusArrivalSpecies=species;g.persist();g.say('8번도로 도착 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 설화 동문·마른 본선·빗물 순환로의 이동 순서를 기록했다.`:'혼자 설화 동문·마른 본선·빗물 순환로의 이동 순서를 기록했다.','2층에서 물길의 생활 쓰임을 비교할 수 있다.'],undefined,[{label:'동료와 교류 코너로',action:corner},{label:'2층 물 비교로',action:()=>{if(g.save===save&&save.map==='tour_icirrus_hall'&&!g.battle)g.setTourDestination('tour_icirrus_hall_2f','tourIcirrusWaterStudy');}},{label:'기록을 덮는다',action:()=>{}}]);};
    g.say('8번도로 도착 기록대',[save.flags.icirrusArrivalLogged?'앞서 남긴 8번도로 도착 기록이 있다. 동료나 혼자 다시 기록할 수 있다.':'동쪽 문에서 8번도로를 지나온 순서와 도시의 마른 길을 확인해 보자.','건강한 동료를 선택하거나 혼자 기록할 수 있으며 특정 포획 출처는 요구하지 않는다.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'동료 교류 코너부터 보기',action:corner},{label:'혼자 기록한다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_icirrus_hall_2f'&&id==='tourIcirrusWaterStudy'){
    const save=g.save;
    const guide=(map:Parameters<Engine['setTourDestination']>[0],target:string)=>()=>{if(g.save===save&&save.map==='tour_icirrus_hall_2f'&&!g.battle)g.setTourDestination(map,target);};
    if(!save.flags.icirrusArrivalLogged){g.say('습지 생활 비교표',['1층 도착 기록대에서 8번도로의 마른 본선과 빗물 순환로를 먼저 구분할 수 있다.','기록하지 않아도 자료실과 도시 이동은 자유롭다.'],undefined,[{label:'1층 도착 기록대로',action:guide('tour_icirrus_hall','tourIcirrusArrivalLog')},{label:'도시 연못으로',action:guide('tour_icirrus','tourOutdoor0')},{label:'자료를 덮는다',action:()=>{}}]);return true;}
    const first=!save.flags.icirrusWaterCompared;save.flags.icirrusWaterCompared=true;if(first)g.persist();g.say('습지 생활 비교',[first?'8번도로의 웅덩이, 도시 빗물 연못, 생활 뜰의 씻는 물을 서로 다른 쓰임으로 나누어 기록했다.':'앞서 나눈 길·연못·생활용 물 기록을 다시 읽었다.',save.flags.icirrusMoorObservationCompleted?'습지의 갈대 수위와 물새 흔적 기록을 도시 자료와 나란히 펼쳤다.':'현장 관찰은 동쪽 8번도로 북쪽 분기의 설화의 습지에서 이어갈 수 있다.','3층 전망에서 여행을 돌아보거나 실제 연못 수위판으로 돌아가 비교한 내용을 살펴보자.'],undefined,[{label:'연못 수위판으로',action:guide('tour_icirrus','tourOutdoor0')},{label:'3층 전망 휴게실',action:guide('tour_icirrus_hall_3f','tourIcirrusCompanionRest')},{label:'습지 현장 관찰',action:guide('tour_icirrus_moor','icirrusMoorKeeper')},{label:'자료를 덮는다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_icirrus_hall_3f'&&id==='tourIcirrusCompanionRest'){
    const save=g.save,healthy=save.party.filter(mon=>mon.hp>0),record=(species:number)=>{if(g.save!==save||save.map!=='tour_icirrus_hall_3f')return;save.flags.icirrusCompanionRested=true;save.flags.icirrusRestSpecies=species;g.persist();g.say('북쪽 전망 휴게 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 습지와 북쪽 용나선 방향을 바라보며 걸어온 길을 정리했다.`:'혼자 습지와 북쪽 용나선 방향을 바라보며 걸어온 길을 정리했다.','북문 접근로와 동쪽 8번도로는 서로 다른 길이다.'],undefined,[{label:'북문 접근로로',action:()=>{if(g.save===save&&save.map==='tour_icirrus_hall_3f'&&!g.battle)g.setTourDestination('tour_dragonspiral_approach');}},{label:'설화센터로 귀환',action:()=>{if(g.save===save&&save.map==='tour_icirrus_hall_3f'&&!g.battle)g.setTourDestination('tour_icirrus_center');}},{label:'기록을 덮는다',action:()=>{}}]);};
    const tower=save.flags.dragonspiralWindRecorded?'용나선탑 3층에서 세 방향 바람을 기록하고 돌아왔다.':save.flags.dragonspiralBaseObserved?'용나선탑 1층 기단 관찰을 시작한 기록이 있다.':save.flags.dragonspiralApproachMoatObserved?'번호 없는 북문 접근로의 해자 가장자리를 살핀 기록이 있다.':'북문 접근로와 탑 관찰 기록은 아직 비어 있다.';
    g.say('용나선 방향 전망석',[save.flags.icirrusCompanionRested?'앞서 남긴 북쪽 전망 휴게 기록이 있다.':'건강한 동료와 마른 전망석에서 8번도로와 북쪽 방향을 돌아보자.',save.flags.icirrusWaterCompared?'2층에서 빗물 생활 비교를 마쳤다.':'2층 비교 전에도 쉴 수 있으며 활동 순서는 통행 조건이 아니다.',tower],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 쉰다',action:()=>record(0)},{label:'나중에 쉰다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_icirrus_center'&&id==='tourIcirrusCenterGuide'){
    const save=g.save,healthy=save.party.filter(mon=>mon.hp===mon.maxHp).length,hurt=save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=save.party.filter(mon=>mon.hp<=0).length,species=Number(save.flags.icirrusRestSpecies??save.flags.icirrusArrivalSpecies??0),current=()=>g.save===save&&save.map==='tour_icirrus_center'&&!g.battle,partyLocal=save.party.filter(mon=>mon.met===ICIRRUS_ROUTE_MET&&ICIRRUS_ROUTE_SPECIES.has(mon.species)),boxLocal=(save.box??[]).filter(mon=>mon.met===ICIRRUS_ROUTE_MET&&ICIRRUS_ROUTE_SPECIES.has(mon.species)),localNames=[...new Set([...partyLocal,...boxLocal].map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].join(' · ')||'아직 없음';
    const towerSpecies=SPECIES[Number(save.flags.dragonspiralPartnerSpecies??save.flags.dragonspiralApproachPartnerSpecies??0)]?.name,towerState=save.flags.dragonspiralWindRecorded?(towerSpecies?`용나선탑 공개 1~3층 관찰 완료 · ${towerSpecies}`:'용나선탑 공개 1~3층 관찰 완료'):save.flags.dragonspiralMasonryObserved?'용나선탑 2층 석재 관찰까지 기록':save.flags.dragonspiralBaseObserved?'용나선탑 1층 기단 관찰까지 기록':save.flags.dragonspiralApproachMoatObserved?(towerSpecies?`북문 접근로 해자 관찰 완료 · ${towerSpecies}`:'북문 접근로 해자 관찰 완료'):'북문 접근로·용나선탑 관찰 기록 없음';
    g.say('설화 여행 준비 지도',[save.party.length?`현재 파티 ${save.party.length}마리 · 건강 ${healthy} · 부상 ${hurt} · 기절 ${fainted}`:'현재 함께 걷는 동료가 없다. 센터 PC에서 동료를 확인할 수 있다.',`8번도로 출신 동료 · 파티 ${partyLocal.length}마리 · PC ${boxLocal.length}마리\n${localNames}`,save.flags[ICIRRUS_ROUTE_TRAINER_WIN]?'8번도로 습지 트레이너와 겨룬 기록이 있다. 상금은 이미 받았다.':'8번도로 북쪽 마른 공터에서 선택 배틀을 할 수 있다.',save.flags.icirrusMoorObservationCompleted?'설화의 습지에서 갈대 수위와 물새 흔적을 모두 살핀 기록이 있다.':'설화의 습지에서는 건강한 동료와 두 순환로를 관찰할 수 있다.',save.flags.icirrusArrivalLogged?'생활관 1층에 8번도로 도착 기록이 남아 있다.':'생활관 1층에서 8번도로 도착 순서를 동료나 혼자 기록할 수 있다.',save.flags.icirrusWaterCompared?'2층에서 빗물 길과 생활용 물을 비교했다.':'2층에는 마른 본선·빗물 순환로·도시 연못의 쓰임을 나눈 자료가 있다.',save.flags.icirrusCompanionRested?(species&&SPECIES[species]?`3층에는 ${SPECIES[species].name}와 남긴 북쪽 전망 휴게 기록이 있다.`:'3층에 혼자 남긴 북쪽 전망 휴게 기록이 있다.'):'3층 전망 휴게는 선택이며 실제 회복이나 용나선탑 사건 조건이 아니다.',towerState,'동쪽 문은 하나 8번도로→튜브라인브리지→9번도로→쌍용시티로 이어진다. 북쪽 문은 도로 번호 없는 접근로를 지나 용나선탑 기슭으로 이어진다.'],undefined,[{label:'센터 PC를 연다',action:()=>{if(current())pcMenu(g);}},{label:save.flags[ICIRRUS_ROUTE_TRAINER_WIN]?'8번도로 재방문':'8번도로 트레이너',action:()=>{if(current())g.setTourDestination('tour_unova_route_08','tourRouteEightTrainer');}},{label:'설화의 습지 관찰',action:()=>{if(current())g.setTourDestination('tour_icirrus_moor','icirrusMoorKeeper');}},{label:save.flags.dragonspiralWindRecorded?'용나선탑 기록 다시 보기':'용나선탑 관찰',action:()=>{if(current())g.setTourDestination('tour_dragonspiral','tourGuide');}},{label:'생활관 도착 기록',action:()=>{if(current())g.setTourDestination('tour_icirrus_hall','tourIcirrusArrivalLog');}},{label:'지도를 덮는다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_icirrus'&&id==='tourResident0'){const species=Number(g.save.flags.icirrusArrivalSpecies??0),local=[...g.save.party,...g.save.box??[]].filter(mon=>mon.met===ICIRRUS_ROUTE_MET&&ICIRRUS_ROUTE_SPECIES.has(mon.species));g.say('8번도로 도착 여행자',[g.save.flags.icirrusArrivalLogged?(species&&SPECIES[species]?`${SPECIES[species].name}와 8번도로 도착 순서를 기록했군요.`:'8번도로 도착 순서를 기록했군요.'):'생활관 1층에서 동문과 8번도로의 이동 순서를 기록할 수 있어요.',local.length?`8번도로에서 만난 동료가 파티와 PC에 ${local.length}마리 있군요. 센터 지도에서 편성 위치를 확인할 수 있어요.`:'북쪽·남쪽 선택 풀밭에는 딱정곤과 쪼마리가 살고 있어요. 잡지 않아도 마른 본선은 안전합니다.',g.save.flags[ICIRRUS_ROUTE_TRAINER_WIN]?'습지 트레이너와 겨룬 뒤에도 동쪽 문으로 같은 길을 왕복할 수 있습니다.':'선택 배틀이나 기록 없이도 동쪽 문으로 자유롭게 돌아갈 수 있습니다.']);return true;}
  if(g.save.map==='tour_icirrus'&&id==='tourResident1'){g.say('습지 생활 뜰 돌봄이',[g.save.flags.icirrusWaterCompared?'길의 빗물과 연못물, 발을 씻는 물의 쓰임을 잘 나누었군요.':'생활관 2층에서 길·연못·생활 뜰의 물 쓰임을 비교할 수 있어요.','관찰은 계절이나 결빙 이동 효과를 바꾸지 않습니다.']);return true;}
  if(g.save.map==='tour_icirrus'&&id==='tourResident2'){const species=Number(g.save.flags.icirrusRestSpecies??0),towerSpecies=SPECIES[Number(g.save.flags.dragonspiralPartnerSpecies??0)]?.name;g.say('생활관 기록원',[g.save.flags.icirrusCompanionRested?(species&&SPECIES[species]?`${SPECIES[species].name}와 북쪽 전망에서 쉬었다는 기록을 보관할게요.`:'북쪽 전망 휴게 기록을 보관할게요.'):'생활관 3층에서 동료와 걸어온 길을 돌아볼 수 있어요.',g.save.flags.dragonspiralWindRecorded?(towerSpecies?`${towerSpecies}와 탑 3층까지 살핀 기록은 북쪽 전망 수첩에 함께 분류해 둘게요.`:'탑 3층까지 살핀 기록은 북쪽 전망 수첩에 함께 분류해 둘게요.'):'용나선탑 관찰은 북문 접근로에서 시작할 수 있지만 생활관 기록의 완료 조건은 아닙니다.','전망 기록은 용나선탑 사건이나 북쪽 통행의 증거가 아닙니다.']);return true;}
  if(g.save.map==='tour_icirrus'&&id==='tourResident3'){g.say('북쪽 둔덕 산책자',[g.save.flags.icirrusCompanionRested?'전망에서 길을 잘 돌아보았구나. 북문 접근로와 동쪽 8번도로 모두 돌아올 수 있단다.':'생활관 3층 전망석에서도 이 둔덕과 북쪽 방향을 볼 수 있단다.',g.save.flags.dragonspiralWindRecorded?'용나선탑의 기단·석재·바람을 살피고 같은 북문 길로 잘 돌아왔구나.':g.save.flags.dragonspiralApproachMoatObserved?'북문 접근로 해자까지 살폈구나. 중앙 마른 길은 용나선탑 기슭으로 이어진단다.':'북문은 번호 없는 용나선탑 접근로이며 관찰하지 않아도 탑 기슭까지 갈 수 있단다.',g.save.flags.icirrusMoorObservationCompleted?'8번도로 북쪽 분기의 설화의 습지에서 갈대와 물새 흔적을 모두 살폈구나.':'설화의 습지는 동쪽 8번도로의 북쪽 분기로 들어간다. 북문은 용나선탑 접근로다.','북문 접근로와 설화의 습지는 서로 다른 길이며 어느 기록도 통행 조건이 아니다.']);return true;}
  if(g.save.map==='tour_icirrus'&&id==='tourPokemon'){g.say('생활 뜰의 콩둘기',[g.save.flags.icirrusWaterCompared?'구구구. 물그릇과 빗물 고인 길을 구분하듯 마른 가장자리를 따라 걷는다.':'구구구. 빗물이 튀지 않는 마른 길 가장자리에서 깃을 고른다.','주민과 함께 지내는 생활 개체이며 설화시티 야생 조우나 포획 대상은 아니다.']);return true;}
  if(g.save.map==='tour_village_bridge_hall'&&id==='tourVillageBridgeWalkLog'){
    const save=g.save,healthy=save.party.filter(mon=>mon.hp>0),record=(species:number)=>{if(g.save!==save||save.map!=='tour_village_bridge_hall')return;save.flags.villageBridgeWalkLogged=true;save.flags.villageBridgeWalkSpecies=species;g.persist();g.say('다리 통행 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 12번도로 도착점·중앙 보행선·11번도로 방향을 확인했다.`:'혼자 12번도로 도착점·중앙 보행선·11번도로 방향을 확인했다.','통행 기록은 공연 보상이나 11번도로 조건이 아니다.']);};g.say('다리 통행 기록대',[save.flags.villageBridgeWalkLogged?'앞서 남긴 통행 기록이 있다. 동료나 혼자 다시 확인할 수 있다.':'긴 다리의 보행선과 양쪽 방향을 살펴보자.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 확인한다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_village_bridge_hall_3f'&&id==='tourVillageBridgeRestLog'){
    const save=g.save,healthy=save.party.filter(mon=>mon.hp>0),record=(species:number)=>{if(g.save!==save||save.map!=='tour_village_bridge_hall_3f')return;save.flags.villageBridgeRested=true;save.flags.villageBridgeRestSpecies=species;g.persist();g.say('동행 휴게 기록',[species&&SPECIES[species]?`${SPECIES[species].name}와 물그릇·그늘·통행 여백을 살폈다.`:'혼자 휴게뜰의 물그릇·그늘·통행 여백을 살폈다.','HP 회복이나 능력 변화는 없다.']);};g.say('동행 휴게 기록대',[save.flags.villageBridgeRested?'앞서 남긴 휴게뜰 기록이 있다.':'다리를 건넌 동료가 안전하게 쉴 자리를 살펴보자.'],undefined,[...healthy.map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(save.party.includes(mon)&&mon.hp>0)record(mon.species);}})),{label:'혼자 살핀다',action:()=>record(0)},{label:'나중에 확인한다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_village_bridge'&&id==='tourResident1'){const species=Number(g.save.flags.villageBridgeWalkSpecies??0);g.say('다리 보행 관리인',[g.save.flags.villageBridgeWalkLogged?(species&&SPECIES[species]?`${SPECIES[species].name}와 보행선을 확인했군. 통행 여백도 잘 남아 있어.`:'다리 보행선을 확인했군. 고마워.'):'생활관 1층에서 동료와 다리 보행선을 확인할 수 있어.','기록 없이도 12번도로로 돌아갈 수 있고 11번도로가 열리는 조건은 아니야.']);return true;}
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
  // Celestic's dedicated console keeps its map/painter/navigation event ID.
  const centerPc=id==='tourExhibit1'||(g.save.map==='tour_celestic_center'&&id==='tourPC');
  if(isWorldCenter(g.save.map)&&centerPc){pcMenu(g);return true;}
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
