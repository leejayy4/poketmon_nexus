import type { Engine } from './engine';
import type { Furnishing,TourInterior } from './explore-interiors';
import type { GameMap,Point } from './types';

const MART='tour_jubilife_mart',HOMES=['tour_jubilife_home1','tour_jubilife_home1_2f','tour_jubilife_home1_3f'] as const;
const item=(kind:Furnishing['kind'],name:string,event:string,x:number,y:number,w:number,h:number,pages:string[]):Furnishing=>({kind,name,event,x,y,w,h,pages});

function floor(id:string,name:string,width:number,height:number,objects:Furnishing[],npcs:GameMap['npcs'],warps:GameMap['warps']):GameMap{
  const center=Math.floor(width/2),rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x>=2&&x<=width-3&&y>=3&&y<=height-3||x===center&&y>=height-2?'.':'#'));
  const props:GameMap['props']=[];
  for(const o of objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){rows[y][x]='#';props.push({x,y,dialogue:o.event});}
  for(const w of warps)rows[w.y][w.x]='.';
  return {id:id as GameMap['id'],name,width,height,background:id,walkable:rows.map(row=>row.join('')),warps,npcs,props};
}

export function installJubilifeDailyInteriors(a:{maps:Record<string,GameMap>;rooms:Record<string,TourInterior>;spawns:Record<string,Point>;floorInfo:Record<string,{floor:number;total:number;title:string}>}){
  const {maps,rooms,spawns,floorInfo}=a,oldMart=maps[MART],oldHome=maps[HOMES[0]];
  if(oldMart){
    const objects=[
      item('shelf','몬스터볼 진열대','jubilifeMartBallShelf',3,10,5,2,['포획 여행용 몬스터볼을 진열했다.']),
      item('shelf','상처약 진열대','jubilifeMartPotionShelf',16,10,5,2,['여행 중 다친 동료를 위한 상처약을 진열했다.']),
      item('shelf','에어메일·힐볼 진열대','jubilifeMartSpecialShelf',3,15,7,2,['축복 전용 판매대의 견본이 놓여 있다.']),
      item('chart','사방 도로 보급표','jubilifeMartRouteSupplies',15,15,6,2,['네 도로의 거리와 보급 거점을 적었다.']),
    ];
    const warps=[{x:12,y:19,to:'tour_jubilife' as const,spawn:oldMart.warps[0]?.spawn??{x:7,y:25},entry:'down' as const,facing:'down' as const}];
    const npcs=[{id:'tourHost',name:'축복 프렌들리숍 점원',sprite:'school_kid_m',x:12,y:7,facing:'down' as const,dialogue:'martClerk'}];
    maps[MART]=floor(MART,'축복시티 · 프렌들리숍',24,20,objects,npcs,warps);
    rooms[MART]={style:'shop',title:'프렌들리숍',host:{x:12,y:7},reception:{x:8,y:8,w:8,h:1},objects,greeting:['남쪽·동쪽 여행을 준비하는 축복시티 상점이다.']};
    // The shared clerk interaction occupies the full counter.
    for(let x=8;x<16;x++){const row=maps[MART].walkable[8].split('');row[x]='#';maps[MART].walkable[8]=row.join('');maps[MART].props.push({x,y:8,dialogue:'martClerk'});}
    spawns[MART]={x:12,y:16};
    const cityDoor=maps.tour_jubilife?.warps.find(w=>w.to===MART);if(cityDoor)cityDoor.spawn={x:12,y:16};
  }
  if(!oldHome)return;
  const titles=['주민 공동주택 1층 · 현관 생활실','주민 공동주택 2층 · 가족 거실','주민 공동주택 3층 · 옥상 화분실'];
  const objects:Furnishing[][]=[
    [item('bench','동료용 현관 방석','jubilifeCondoPartnerCushion',4,6,5,2,['거리에서 돌아온 포켓몬의 발을 쉬게 하는 방석이다.']),item('shelf','생활 안내 책장','jubilifeCondoGuideShelf',15,6,5,2,['포켓치·기술·상점 이야기를 모은 책장이다.']),item('workbench','외출 준비대','jubilifeCondoQuickTable',7,12,6,2,['빠른 동료의 목걸이와 빗이 놓여 있다.'])],
    [item('bench','가족 식탁','jubilifeCondoFamilyTable',4,6,6,2,['사람과 포켓몬의 식기를 나누어 놓았다.']),item('shelf','기술 공부 책장','jubilifeCondoMoveShelf',15,6,5,2,['타입과 기술 선택을 공부한 책이 꽂혀 있다.']),item('chart','도시 생활 메모','jubilifeCondoCityMemo',6,12,7,2,['센터·상점·학교의 이용 시간을 적었다.'])],
    [item('plants','공동 화분밭','jubilifeCondoPlanters',4,6,7,3,['이웃들이 포켓몬과 함께 돌보는 화분이다.']),item('bench','도시 전망 쉼터','jubilifeCondoViewBench',15,6,5,2,['축복의 높은 건물과 네 방향 길이 보인다.']),item('tank','동료 물그릇','jubilifeCondoWaterBowl',8,13,4,2,['옥상에서 쉬는 포켓몬을 위한 깨끗한 물이다.'])],
  ];
  const npcs:GameMap['npcs'][]=[
    [{id:'jubilifeCondoGirl',name:'꼬링크와 사는 소녀',sprite:'school_kid_f',x:13,y:9,facing:'left',dialogue:'jubilifeCondoGirl'}],
    [{id:'jubilifeCondoParent',name:'공동주택 주민',sprite:'pokemon_breeder_f',x:12,y:9,facing:'right',dialogue:'jubilifeCondoParent'}],
    [{id:'jubilifeCondoGardener',name:'옥상 화분지기',sprite:'old_man',x:13,y:10,facing:'left',dialogue:'jubilifeCondoGardener'}],
  ];
  const warps:GameMap['warps'][]=[
    [{x:12,y:17,to:'tour_jubilife',spawn:oldHome.warps.find(w=>w.to==='tour_jubilife')?.spawn??{x:26,y:29},entry:'down',facing:'down'},{x:20,y:8,to:HOMES[1],spawn:{x:20,y:11},entry:'up',facing:'up'}],
    [{x:20,y:12,to:HOMES[0],spawn:{x:20,y:9},entry:'down',facing:'down'},{x:20,y:8,to:HOMES[2],spawn:{x:20,y:11},entry:'up',facing:'up'}],
    [{x:20,y:12,to:HOMES[1],spawn:{x:20,y:9},entry:'down',facing:'down'}],
  ];
  for(let i=0;i<3;i++){
    const id=HOMES[i];maps[id]=floor(id,`축복시티 · ${titles[i]}`,24,18,objects[i],npcs[i],warps[i]);
    rooms[id]={style:i===2?'garden':'dojo',title:titles[i],host:{x:npcs[i][0].x,y:npcs[i][0].y},objects:objects[i],greeting:['축복시티 주민과 포켓몬이 함께 생활하는 공동주택이다.']};
    spawns[id]=i?{x:20,y:10}:{x:12,y:15};floorInfo[id]={floor:i+1,total:3,title:titles[i]};
  }
  const cityDoor=maps.tour_jubilife?.warps.find(w=>w.to===HOMES[0]);if(cityDoor)cityDoor.spawn={x:12,y:15};
}

export function handleJubilifeDailyInteriors(g:Engine,id:string):boolean{
  if(g.save.map===MART){
    if(id==='jubilifeMartBallShelf'){g.say('몬스터볼 진열대',['일반 몬스터볼은 중앙 계산대에서 구입할 수 있다.','새 동료를 만날 수 있는 남쪽 202번도로와 동쪽 203번도로를 나가기 전에 수량을 확인하자.']);return true;}
    if(id==='jubilifeMartPotionShelf'){g.say('상처약 진열대',['일반 상처약은 중앙 계산대에서 구입할 수 있다.',g.save.party.some(mon=>mon.hp<mon.maxHp)?'현재 다친 동료가 있다. 센터에서 회복하거나 필요한 만큼 준비하자.':'현재 파티는 모두 건강하다.']);return true;}
    if(id==='jubilifeMartSpecialShelf'){g.say('에어메일·힐볼 진열대',['편지를 넣는 에어메일과 포켓몬을 편안하게 하는 힐볼의 견본이다.','견본 진열대라 물건을 가져가거나 구입할 수는 없다.']);return true;}
    if(id==='jubilifeMartRouteSupplies'){g.say('사방 도로 보급표',['남쪽 202번도로 · 동쪽 203번도로','북쪽 204번도로 · 서쪽 218번도로','동쪽 무쇠시티로 가기 전 센터에서 회복하고 몬스터볼·상처약을 확인하자.']);return true;}
    return false;
  }
  if(!HOMES.includes(g.save.map as typeof HOMES[number]))return false;
  const hurt=g.save.party.filter(mon=>mon.hp>0&&mon.hp<mon.maxHp).length,fainted=g.save.party.filter(mon=>mon.hp<=0).length;
  if(id==='jubilifeCondoGirl'){g.say('꼬링크와 사는 소녀',['꼬링크처럼 빠르게 움직이는 동료도 기술마다 행동 순서가 달라질 수 있어요.','외출 준비대의 목걸이와 빗은 우리 꼬링크가 쓰는 물건이라 가져갈 수 없어요.',`현재 파티 · 부상 ${hurt} · 기절 ${fainted}`]);return true;}
  if(id==='jubilifeCondoParent'){g.say('공동주택 주민',['포켓치주식회사에서 여행 장치를 만들고, 학교에서는 기술과 상태를 배워요.','프렌들리숍에는 일반 판매대와 에어메일·힐볼 견본 진열대가 있어요.']);return true;}
  if(id==='jubilifeCondoGardener'){g.say('옥상 화분지기',['높은 건물 사이에서도 사람과 포켓몬이 함께 화분을 돌봐요.','북204·동203·남202·서218에서 온 바람이 조금씩 다르게 느껴집니다.']);return true;}
  if(id==='jubilifeCondoPartnerCushion'){g.say('동료용 현관 방석',[g.save.party.length?`파티 ${g.save.party.length}마리가 번갈아 발을 쉬게 할 수 있는 낮은 방석이다.`:'함께 사는 포켓몬을 위한 낮은 방석이다.','HP는 회복되지 않는다. 치료가 필요하면 포켓몬센터를 이용하자.']);return true;}
  if(id==='jubilifeCondoGuideShelf'){g.say('생활 안내 책장',['트레이너스쿨·포켓치주식회사·방송국·프렌들리숍의 안내가 한 권씩 꽂혀 있다.']);return true;}
  if(id==='jubilifeCondoQuickTable'){g.say('외출 준비대',['꼬링크의 털을 빗는 솔과 빠르게 움직여도 풀리지 않는 목걸이가 놓여 있다.','도구를 아이템으로 가져가지는 않는다.']);return true;}
  if(id==='jubilifeCondoFamilyTable'){g.say('가족 식탁',['사람과 포켓몬이 같은 시간에 식사하되 그릇과 먹이는 구분해 놓았다.']);return true;}
  if(id==='jubilifeCondoMoveShelf'){g.say('기술 공부 책장',['포켓몬과 기술의 타입, 상대가 바뀔 때 기술을 다시 고르는 법을 정리했다.','실전 연습은 트레이너스쿨 학생들과 할 수 있다.']);return true;}
  if(id==='jubilifeCondoCityMemo'){g.say('도시 생활 메모',['센터에서 회복·PC 편성, 상점에서 보급, 학교에서 수업, 방송국과 회사에서 견학.','모든 시설에서 같은 문과 계단으로 거리까지 돌아올 수 있다.']);return true;}
  if(id==='jubilifeCondoPlanters'){g.say('공동 화분밭',['이웃과 포켓몬이 물주기 순서를 나누어 관리한다.','화분 사이의 길은 옥상 쉼터로 이어진다.']);return true;}
  if(id==='jubilifeCondoViewBench'){g.say('도시 전망 쉼터',['북쪽 포켓치주식회사와 동쪽 방송국, 남쪽 202번도로 입구가 보인다.']);return true;}
  if(id==='jubilifeCondoWaterBowl'){g.say('동료 물그릇',['깨끗한 물을 채워 두었지만 치료용 회복 장치는 아니다.']);return true;}
  return false;
}
