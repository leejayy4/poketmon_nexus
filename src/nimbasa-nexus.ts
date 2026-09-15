import type { Engine } from './engine';

export const NIMBASA_NEXUS={route:'nexusRouteFourCompared',arrival:'nexusNimbasaArrivalCompared',lights:'nexusNimbasaLightsCompared',preserved:'nexusNimbasaVoicesPreserved'} as const;
const sessions=new WeakMap<Engine,object>();
const prerequisite=(g:Engine)=>Boolean(g.save.flags.nexusCasteliaComparisonPreserved);

function scene(g:Engine){
  const save=g.save,player=save.player,map=save.map,x=player.x,y=player.y,token={};sessions.set(g,token);
  const active=()=>g.save===save&&g.save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token&&prerequisite(g);
  const guide=(target:string,event?:string)=>()=>{if(active())g.setTourDestination(target,event);};
  const commit=(flag:string,pages:string[],target:string,event?:string)=>{
    if(!active())return;
    g.say('구름–뇌문 현장 기록',pages,()=>{if(!active())return;if(!save.flags[flag]){save.flags[flag]=true;g.persist();}guide(target,event)();});
  };
  return {save,active,guide,commit};
}

/** Route 4 remains freely traversable; this adds an evidence stop without recreating BW2 badge/Crustle locks. */
export function handleRouteFourNexus(g:Engine,event:string):boolean{
  if(g.save.map!=='tour_unova_route_04'||event!=='tourRouteFourWorkSample'||!prerequisite(g))return false;
  const {save,active,guide,commit}=scene(g),f=NIMBASA_NEXUS;
  if(save.flags[f.route]){
    g.say('분기 공사 표본',['굳힌 노반과 남겨 둔 사암이 나란히 있다. 구름의 넓은 화물길과 달리 이곳은 이동과 보존을 함께 고려한 흔적이다.','북쪽 본선은 조인애버뉴를 거쳐 뇌문시티로 이어진다. 동쪽 리조트데저트는 선택 왕복로다.'],undefined,[{label:'조인애버뉴·뇌문으로',action:guide('tour_join_avenue')},{label:'리조트데저트 선택 분기',action:guide('tour_unova_route_01')},{label:'계속 살핀다',action:()=>{}}]);return true;
  }
  g.say('분기 공사 표본',['도로 전체를 넓히지 않고 통행 노반과 사암 흔적을 나누어 남겼다. 구름 전시의 “편리해진 선”만으로는 설명되지 않는 현장이다.','노반을 쓰는 여행자와 보존된 흔적을 보는 사람의 경험을 구분해 적을까?'],undefined,[
    {label:'통행과 보존 흔적을 함께 기록',action:()=>commit(f.route,['남북 본선의 단단한 노반과 동쪽 분기의 사암 흔적을 따로 기록했다.','뇌문에 도착한 여행자에게 이 길이 실제로 어떤 도움이 됐는지 물어보자.'],'tour_nimbasa','tourResident0')},
    {label:'공사가 끝났다고만 기록',action:()=>{if(active())g.say('남아 있는 차이',['동쪽 사암과 선택 분기는 그대로 남아 있다. 보이는 현장을 지우지 않고 함께 기록하자.']);}},
    {label:'나중에 기록한다',action:()=>{}},
  ]);return true;
}

export function handleNimbasaNexus(g:Engine,event:string):boolean{
  if(g.save.map!=='tour_nimbasa'||!prerequisite(g))return false;
  const f=NIMBASA_NEXUS,{save,guide,commit}=scene(g);
  if(event==='tourResident0'&&save.flags[f.route]&&!save.flags[f.arrival]){
    commit(f.arrival,['조인애버뉴 여행자: 4번도로의 단단한 본선 덕분에 모래를 피해 왔어요. 동쪽 사암 쪽은 돌아보지 않아도 도시로 올 수 있었고요.','통행의 이익은 확인했다. 이제 도시 불빛이 사람과 포켓몬에게 똑같이 편리한지 조명 점검원에게 물어보자.'],'tour_nimbasa','tourResident4');return true;
  }
  if(event==='tourResident4'&&save.flags[f.arrival]&&!save.flags[f.lights]){
    g.say('조명 점검원',['큰길 표시는 여행자가 길을 찾는 데 필요해. 하지만 포켓몬 눈높이의 등까지 밝게 켜면 쉬기 어려워져.','서쪽 본선 표지는 유지하고 동쪽 휴게원과 야간 정원의 낮은 등을 덮개로 낮출 수 있어. 어느 회로부터 점검할까?'],undefined,[
      {label:'길 표시는 유지하고 휴식등 낮추기',action:()=>commit(f.lights,['큰길 방향등은 남겨 여행자의 귀환선을 보존했다. 휴게원과 야간 정원의 낮은 등에는 덮개를 씌워 눈부심을 줄였다.','도움이 되는 불빛과 쉬는 데 필요한 어둠을 같은 기준으로 묶지 않았다. 놀이공원 안내소에서 두 증언을 함께 남기자.'],'tour_nimbasa_hall','tourExhibit0')},
      {label:'모든 등을 같은 밝기로 맞추기',action:()=>{if(active())g.say('조명 점검원',['그러면 포켓몬 휴식 구역의 구분이 사라져. 큰길 방향등과 낮은 휴식등의 역할을 나누어 보자.']);}},
      {label:'나중에 점검한다',action:()=>{}},
    ]);return true;
  }
  return false;
}

/** Saved lighting choice appears only on blocked garden fixtures; collision stays unchanged. */
export function paintNimbasaNexusLights(c:CanvasRenderingContext2D,mapId:string,save:{flags:Record<string,boolean|number>}){
  if(mapId!=='tour_nimbasa'||!save.flags[NIMBASA_NEXUS.lights])return;
  const lamp=(x:number,y:number,dim:boolean)=>{
    c.fillStyle='#4b5658';c.fillRect(x*16+7,y*16+6,2,10);
    c.fillStyle=dim?'#7f846e':'#d8b963';c.fillRect(x*16+4,y*16+3,8,5);
    c.fillStyle=dim?'#adb19a':'#ffe7a0';c.fillRect(x*16+6,y*16+4,4,2);
    if(dim){c.fillStyle='#596664';c.fillRect(x*16+3,y*16+2,10,2);}
  };
  lamp(55,31,true);lamp(60,40,true);lamp(65,44,true);lamp(38,48,false);
}

export function handleNimbasaNexusExhibit(g:Engine,event:string):boolean{
  if(g.save.map!=='tour_nimbasa_hall'||event!=='tourExhibit0'||!prerequisite(g))return false;
  const f=NIMBASA_NEXUS,{save,active,guide,commit}=scene(g);
  if(!save.flags[f.route]){
    g.say('뇌문 놀이 지도',['구름에서 북쪽 4번도로와 조인애버뉴를 지나오는 길이 표시돼 있다.','아직 4번도로의 노반과 사암 흔적을 직접 대조하지 않았다.'],undefined,[{label:'4번도로 공사 표본으로',action:guide('tour_unova_route_04','tourRouteFourWorkSample')},{label:'지도를 더 본다',action:()=>{}}]);return true;
  }
  if(!save.flags[f.arrival]||!save.flags[f.lights]){
    g.say('뇌문 놀이 지도',['4번도로 현장 기록 옆에 뇌문 시민의 칸이 비어 있다. 도착 여행자와 조명 점검원의 말을 각각 들어 보자.'],undefined,[{label:'다음 현장 증언으로',action:guide('tour_nimbasa',save.flags[f.arrival]?'tourResident4':'tourResident0')},{label:'지도를 더 본다',action:()=>{}}]);return true;
  }
  if(save.flags[f.preserved]){
    g.say('구름–뇌문 대조 지도',['구름의 화물길, 4번도로의 통행 노반과 사암 흔적, 뇌문의 길찾기 조명과 낮춘 휴식등이 출처별로 남아 있다.','서쪽5번도로와 물풍경도개교에서는 화물을 받는 쪽의 경험을 직접 확인할 수 있다.'],undefined,[{label:'5번도로·물풍경 방향',action:guide('tour_pass_nimbasa_driftveil')},{label:'뇌문에서 더 쉬기',action:()=>{}}]);return true;
  }
  g.say('뇌문 놀이 지도',['여행자는 본선의 도움을 말했고 점검원은 밝기를 나누어야 한다고 말했다. 둘은 서로를 지우지 않는다.','구름에서 시작한 기록 옆에 4번도로와 뇌문 증언을 출처별로 남길까?'],undefined,[
    {label:'서로 다른 경험을 함께 보존',action:()=>commit(f.preserved,['통행·보존·길찾기·휴식의 기록을 한 결론으로 합치지 않고 각각 남겼다.','다음은 서쪽5번도로와 물풍경도개교를 지나 물풍경시티. 화물이 도착한 뒤의 생활을 살펴보자.'],'tour_pass_nimbasa_driftveil')},
    {label:'편리해졌다는 말만 남기기',action:()=>{if(active())g.say('빠지는 목소리',['휴식등을 낮춘 이유와 남겨 둔 사암 흔적이 사라진다. 들은 말을 그대로 나누어 보존하자.']);}},
    {label:'나중에 정리한다',action:()=>{}},
  ]);return true;
}
