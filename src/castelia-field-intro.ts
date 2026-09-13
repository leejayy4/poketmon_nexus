import type { Engine } from './engine';
import { TOUR_OUTDOORS } from './explore-world';
import type { Furnishing } from './explore-interiors';
import type { GameMap,SaveData } from './types';

export function casteliaRestMatCell(map:GameMap){
  if(map.id!=='tour_castelia')return;
  return TOUR_OUTDOORS.tour_castelia.objects.find(o=>o.name==='골목의 화분 정원')?.cells.find(p=>
    map.walkable[p.y]?.[p.x]==='#'&&!map.npcs.some(n=>n.x===p.x&&n.y===p.y)&&!map.warps.some(w=>w.x===p.x&&w.y===p.y));
}

/** A settled local bird, not a captured party member or a simulated arrival. */
export function casteliaRestingPokemonLayers(map:GameMap,save:SaveData,draw:(species:number,x:number,y:number,size:number)=>void){
  const cell=casteliaRestMatCell(map);
  if(!cell||!save.flags.casteliaFieldRestMat)return [];
  return [{depth:cell.y+.95,draw:()=>draw(519,cell.x*16+1,cell.y*16+1,14)}];
}

export function paintCasteliaFieldSites(c:CanvasRenderingContext2D,map:GameMap,save:SaveData){
  if(map.id!=='tour_castelia')return;
  // Existing dry cargo approach, with no collision or event changes.
  for(let x=44;x<=54;x++)for(const y of [48,49]){
    if(map.walkable[y]?.[x]!=='.')continue;
    c.fillStyle='#8e846b';c.fillRect(x*16,y*16+4,16,1);c.fillRect(x*16,y*16+11,16,1);
  }
  if(!save.flags.casteliaFieldRestMat)return;
  const cell=casteliaRestMatCell(map);
  if(!cell)return;
  const x=cell.x*16,y=cell.y*16;
  c.fillStyle='#5c8076';c.fillRect(x+1,y+5,14,10);
  c.fillStyle='#d6c99c';c.fillRect(x+2,y+6,12,2);c.fillRect(x+2,y+12,12,2);
}

export function paintCasteliaProjectExhibit(c:CanvasRenderingContext2D,mapId:string,o:Furnishing):boolean{
  if(mapId!=='tour_castelia_hall'||o.event!=='tourCasteliaProjectExhibit')return false;
  const x=o.x*16,y=o.y*16,w=o.w*16,h=o.h*16;
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  const r=(a:number,b:number,ww:number,hh:number,color:string)=>{c.fillStyle=color;c.fillRect(x+a,y+b,ww,hh);};
  r(0,2,w,h-2,'#4a6569');r(2,0,w-4,h-5,'#d4ceb0');
  r(5,5,w-10,3,'#8aab9d');r(7,9,3,h-14,'#a69774');r(7,h-9,w-14,3,'#a69774');
  for(let a=15;a<w-7;a+=10){r(a,12,6,8,'#688d98');r(a+1,10,4,2,'#b6c9b8');}
  c.restore();return true;
}

const EXHIBIT='casteliaFieldExhibit',CARGO='casteliaFieldCargo',HOME='casteliaFieldAlley';
/** Free field introduction only. These observations never promote CH05/CH06. */
export function handleCasteliaFieldIntro(g:Engine,event:string):boolean{
  const save=g.save,map=save.map,player=save.player,x=player.x,y=player.y;
  const current=()=>g.save===save&&save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle;
  const objects=TOUR_OUTDOORS.tour_castelia.objects;
  const cargo=objects.find(o=>o.name==='동쪽 화물 부두'),alley=objects.find(o=>o.name==='골목의 화분 정원');
  const guide=(target:string,id?:string)=>()=>{if(current())g.setTourDestination(target,id);};
  const record=(flag:string,pages:string[],next:string,id?:string)=>{
    if(!current())return;
    const first=!save.flags[flag];if(first){save.flags[flag]=true;g.persist();}
    g.say('구름 현장 수첩',[...pages,first?'본 장소와 들은 말을 구분해 수첩에 남겼다.':'앞서 남긴 현장 기록을 다시 살폈다.'],undefined,[{label:'다음 장소로',action:guide(next,id)},{label:'계속 둘러본다',action:()=>{}}]);
  };
  if(map==='tour_castelia_hall'&&event==='tourCasteliaProjectExhibit'){
    const nextEvent=!save.flags[CARGO]?cargo?.event:!save.flags.casteliaFieldWorker?'tourResident0':!save.flags.casteliaFieldRestMat?alley?.event:!save.flags[HOME]?'tourResident1':cargo?.event;

    g.say('항만 사업 전시',['전시에는 큰길과 부두를 잇는 운송 동선이 그려져 있다.','편리해진 길을 보여 주는 발표다. 골목에서 사는 사람에게도 같은 경험인지 현장에서 살펴보자.',save.flags[CARGO]&&save.flags.casteliaFieldWorker&&save.flags[HOME]?'넓은 화물 동선과 좁은 생활 골목을 모두 보았다. 다른 도시에서도 어느 구간이 편리해졌는지 직접 확인해 보자.':'동쪽 화물 부두와 주택 옆 화분 골목이 비교할 장소다.'],undefined,[{label:save.flags[EXHIBIT]?'현장 답사 이어가기':'전시 동선 따라 현장으로',action:()=>{if(current()&&nextEvent)record(EXHIBIT,[save.flags[EXHIBIT]?'앞서 살핀 현장과 들은 증언을 보존하고 답사를 이어간다.':'발표의 운송 동선을 수첩에 옮겼다.'],'tour_castelia',nextEvent);}},{label:'4번도로·뇌문 방향으로',action:guide('tour_unova_route_04')},{label:'전시를 더 본다',action:()=>{}}]);return true;
  }
  if(map!=='tour_castelia'||!save.flags[EXHIBIT])return false;
  if(event===cargo?.event){
    g.say('화물 부두의 수레 자국',['창고 앞 넓은 길에는 수레 자국이 나란히 이어진다.','전시의 선과 실제 수레 길을 비교한 뒤 해안 직장인에게 물어보자.'],undefined,[{label:'수레 길과 전시 동선을 맞춘다',action:()=>{if(current())record(CARGO,['두 줄의 수레 자국이 큰길로 이어지는 위치를 기록했다.'],'tour_castelia','tourResident0');}},{label:'지금은 지나간다',action:()=>{}}]);return true;
  }
  if(event==='tourResident0'&&save.flags[CARGO]&&!save.flags.casteliaFieldWorker){
    record('casteliaFieldWorker',['“부두에서 큰길까지 돌아 나가기 편해졌어요. 화물을 옮기는 우리에게 그 넓이는 꼭 필요하죠.”','해안 직장인의 경험을 현장에서 본 수레 길과 함께 남겼다.'],'tour_castelia',alley?.event);return true;
  }
  if(event===alley?.event&&save.flags[CARGO]){
    if(!save.flags.casteliaFieldWorker){
      g.say('화분 골목',['수레 자국만으로 일하는 사람의 경험을 알 수는 없다. 해안 직장인에게 먼저 물어보자.'],undefined,[{label:'해안 직장인에게',action:guide('tour_castelia','tourResident0')},{label:'그대로 둘러본다',action:()=>{}}]);return true;
    }
    g.say('주택 옆 화분 골목',['집으로 이어지는 좁은 통로와 화분 사이의 빈 받침이 보인다.',save.flags.casteliaFieldRestMat?(casteliaRestMatCell(g.map)?'펼친 매트 위에서 콩둘기 한 마리가 날개를 접고 쉬고 있다. 집으로 가는 길은 비어 있다.':'빈 받침에 펼친 휴식 매트가 남아 있다. 길은 그대로 열려 있다.'):'화분 받침 안의 접힌 매트를 펴면 길을 차지하지 않는 휴식 자리가 된다.'],undefined,[{label:save.flags.casteliaFieldRestMat?'휴식 자리 다시 살피기':'빈 받침에 휴식 매트 펼치기',action:()=>{if(current())record('casteliaFieldRestMat',['화분 받침 안에 매트를 펼쳤다. 집으로 오가는 통로는 비워 두었다.'],'tour_castelia','tourResident1');}},{label:'나중에 살핀다',action:()=>{}}]);return true;
  }
  if(event==='tourResident1'&&save.flags.casteliaFieldRestMat&&!save.flags[HOME]){
    record(HOME,['“그 골목은 우리 작업실로 가는 길이에요. 부두는 편해졌지만 동료와 쉬어 갈 자리는 작지요. 화분 옆 자리는 통로를 비울 수 있어 좋네요.”','부두의 이익과 거처의 불편을 함께 남겼다. 뇌문 철도와 물풍경 운송 현장에서도 다른 경험을 들어 보자.'],'tour_castelia_hall','tourCasteliaProjectExhibit');return true;
  }
  return false;
}

