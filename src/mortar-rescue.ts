import type {Engine} from './engine';
import type {Point,GameMap,SaveData,Direction} from './types';
import {SPECIES} from './pokemon';
import {JOHTO_MT_MORTAR_1F,JOHTO_ROUTE_42} from './johto-route-42';
export const MORTAR_RESCUE_NPC='mortarRescueWalker';
export const MORTAR_RESCUE_EVENT='mortarRescueWalker';
export const MORTAR_RESCUE_READY='nexusMortarRescueReady';
export const MORTAR_RESCUE_PROGRESS='nexusMortarRescueProgress';
export const MORTAR_RESCUE_DONE='nexusMortarRescueReturned';
const PARTNER='nexusMortarRescuePartnerSpecies';
export const MORTAR_RESCUE_PATH:Point[]=[{x:44,y:20}];
for(const end of [{x:44,y:16},{x:16,y:16},{x:16,y:18},{x:14,y:18},{x:14,y:38},{x:27,y:38}]){
  let p=MORTAR_RESCUE_PATH[MORTAR_RESCUE_PATH.length-1];
  while(p.x!==end.x||p.y!==end.y){p={x:p.x+Math.sign(end.x-p.x),y:p.y+Math.sign(end.y-p.y)};MORTAR_RESCUE_PATH.push(p);}
}
const cursor=(flags:SaveData['flags'])=>{const n=flags[MORTAR_RESCUE_PROGRESS];return typeof n==='number'&&Number.isInteger(n)&&n>=0&&n<MORTAR_RESCUE_PATH.length?n:0;};
const progress=(g:Engine)=>cursor(g.save.flags);
export function mortarRescueDirections(flags:SaveData['flags']):string{
  const i=cursor(flags),here=MORTAR_RESCUE_PATH[i],next=MORTAR_RESCUE_PATH[i+1];
  if(!next)return '남쪽 합류점에 도착했어. 앞의 산행객에게 돌아왔다고 알려 주자.';
  const direction=(a:Point,b:Point)=>b.x<a.x?'서쪽':b.x>a.x?'동쪽':b.y<a.y?'북쪽':'남쪽';
  if(i===0)return '내 북쪽 첫 칸으로 옆에서 들어와 줘. 그다음 북쪽 표식을 따라가자.';
  const waiting=MORTAR_RESCUE_PATH[i-1];
  return `내 ${direction(waiting,here)} 바로 한 칸 앞에 다시 서서, 거기서 ${direction(here,next)}으로 한 칸 걸어 줘. 동료와 그 자리부터 이어갈게.`;
}
export function applyMortarRescue(map:GameMap,flags:SaveData['flags']):GameMap{
  if(map.id!==JOHTO_MT_MORTAR_1F)return map;
  const i=flags[MORTAR_RESCUE_READY]?cursor(flags):0,p=MORTAR_RESCUE_PATH[Math.max(0,i-1)],toward=MORTAR_RESCUE_PATH[i];
  const facing:Direction=toward.x<p.x?'left':toward.x>p.x?'right':toward.y<p.y?'up':'down';
  return {...map,npcs:map.npcs.map(n=>n.id===MORTAR_RESCUE_NPC?{...n,x:p.x,y:p.y,facing}:n)};
}
/** Called only after a real, completed one-tile move; no timers, clicks, or warps advance escorting. */
export function stepMortarRescue(g:Engine,from:Point):boolean{
  const save=g.save;if(save.map!==JOHTO_MT_MORTAR_1F||g.battle||!save.flags.nexusMortarBypassShared||!save.flags[MORTAR_RESCUE_READY]||save.flags[MORTAR_RESCUE_DONE])return false;
  const i=progress(g),target=MORTAR_RESCUE_PATH[i+1],p=save.player;
  if(!target||Math.abs(from.x-p.x)+Math.abs(from.y-p.y)!==1||p.x!==target.x||p.y!==target.y)return false;
  const prior=MORTAR_RESCUE_PATH[i];
  // The first step can start beside the waiting walker; later steps must follow the saved route exactly.
  if(i>0&&(from.x!==prior.x||from.y!==prior.y))return false;
  if(!save.party.some(mon=>mon.species===save.flags[PARTNER]&&mon.hp>0))return false;
  if(g.map.walkable[target.y]?.[target.x]!=='.')return false;
  save.flags[MORTAR_RESCUE_PROGRESS]=i+1;return true;
}
const sessions=new WeakMap<Engine,object>();
export function handleMortarRescue(g:Engine,event:string,ordinary:()=>void):boolean{
  const save=g.save;if(save.map!==JOHTO_MT_MORTAR_1F||(event!==MORTAR_RESCUE_EVENT&&event!=='journeyWalker'))return false;
  if(event==='journeyWalker'&&!save.flags[MORTAR_RESCUE_READY])return false;
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===JOHTO_MT_MORTAR_1F&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token;
  const normal=()=>{if(active()){sessions.delete(g);ordinary();}};
  const center=()=>{if(active())g.setTourDestination('tour_ecruteak_center','tourHost');};
  if(!save.flags.nexusMortarBypassShared){g.say('동쪽의 산행객',['열기가 올라오는 쪽을 피해 이 안전한 자리에 쉬고 있어. 북쪽과 서쪽으로 돌아가는 길을 먼저 산행객과 확인해 주겠니?'],undefined,[{label:'남쪽 산행객에게',action:()=>{if(active())g.setTourDestination(JOHTO_MT_MORTAR_1F,'journeyWalker');}}]);return true;}
  if(save.flags[MORTAR_RESCUE_DONE]){g.say('돌아온 산행객',['북쪽 횡단로와 서쪽 마른 길을 걸어 남쪽 합류점까지 돌아왔어. 동료가 짐과 걸음을 살펴 줘서 도움이 됐어.','동쪽 열기는 아직 남아 있어. 다른 사람에게도 기존 우회길을 알려 줄게.'],undefined,[{label:'42번도로 귀환',action:()=>{if(active())g.setTourDestination(JOHTO_ROUTE_42,'tourRoute42MortarBoard');}},{label:'평소 산행 이야기',action:normal}]);return true;}
  if(event==='journeyWalker'){
    if(progress(g)!==MORTAR_RESCUE_PATH.length-1){g.say('남쪽 합류점',['함께 돌아올 산행객이 아직 우회길에 있어. 지금 쉬는 위치로 돌아가 남은 길을 같이 걷자.'],undefined,[{label:'산행객의 현재 위치',action:()=>{if(active())g.setTourDestination(JOHTO_MT_MORTAR_1F,MORTAR_RESCUE_EVENT);}},{label:'평소 이야기',action:normal}]);return true;}
    g.say('남쪽 안전 합류',['우회해 온 산행객이 바로 옆에서 짐을 내려놓고 숨을 고른다. 동굴 입구까지 이어지는 길이 보인다.'],undefined,[{label:'합류한 산행객과 귀환 확인',action:()=>{if(!active()||progress(g)!==MORTAR_RESCUE_PATH.length-1)return;save.flags[MORTAR_RESCUE_DONE]=true;g.persist();g.say('함께 돌아온 길',['산행객이 남쪽 합류점에서 쉬기 시작했다. 열기의 원인은 남아 있지만 위험한 구간을 돌파하지 않고 돌아왔다.']);}},{label:'잠시 쉬게 한다',action:()=>{}}]);return true;
  }
  const choose=(page=0)=>{if(!active())return;g.say('돌아갈 동료 준비',['북쪽으로 올라가 횡단로를 서쪽으로 건너고, 물길 옆 마른 길로 남쪽까지 돌아가자. 한 번에 뛰어가면 뒤따라가기 어려워.'],undefined,[
    ...save.party.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name}와 동행`,action:()=>{const valid=()=>active()&&save.party.includes(mon)&&mon.hp>0;if(!valid()){if(active())g.say('건강한 동료와 함께',['쓰러진 동료는 먼저 쉬게 하자.'],undefined,[{label:'센터로',action:center},{label:'다른 동료',action:()=>choose(page)}]);return;}
      const strong=SPECIES[mon.species].types.some(t=>['격투','바위','땅'].includes(t));g.say('동료의 역할',[strong?'동료가 짐 받침을 지키고 산행객은 작은 짐으로 나누어 걸을 수 있다.':'동료가 앞쪽 발 디딜 곳을 살피고 산행객은 작은 짐으로 나누어 걸을 수 있다.'],undefined,[{label:strong?'작은 짐과 받침을 살피며 동행':'발 디딜 곳을 살피며 동행',action:()=>{if(!valid())return;save.flags[PARTNER]=mon.species;save.flags[MORTAR_RESCUE_PROGRESS]=progress(g);save.flags[MORTAR_RESCUE_READY]=true;g.persist();g.say('한 걸음씩 우회하기',[progress(g)===0?'내 바로 북쪽에서 길을 이끌어 줘. 표시된 북쪽·서쪽 길을 따라 한 걸음씩 뒤따라갈게.':'기다리던 자리에서 이어가자. 바닥의 다음 발자국 표시를 따라 한 걸음씩 이끌어 줘.','길을 벗어나거나 동료가 지치면 그 자리에서 기다릴게. 다시 이 자리에서 이어가면 돼.']);}},{label:'열기 쪽으로 빨리 돌파',action:()=>{if(valid())g.say('우회하자',['동료에게 위험한 길을 돌파하게 할 필요는 없어. 살펴 둔 우회길을 쓰자.']);}}]);}})),
    ...(save.party.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>choose(page?0:1)}]:[]),{label:'나중에 동행',action:()=>{}},
  ]);};
  if(save.flags[MORTAR_RESCUE_READY]){g.say('기다리는 산행객',[mortarRescueDirections(save.flags)],undefined,[{label:'동료 역할 다시 준비',action:()=>choose()},{label:'남쪽 합류점 안내',action:()=>{if(active())g.setTourDestination(JOHTO_MT_MORTAR_1F,'journeyWalker');}},{label:'기다려 달라고 한다',action:()=>{}}]);return true;}
  choose();return true;
}
