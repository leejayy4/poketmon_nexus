import type {Engine} from './engine';
import type {GameMap,SaveData,Point,Direction} from './types';
import {MAHOGANY_LIFE_PRESERVED,MAHOGANY_TRANSMISSION_STOPPED} from './mahogany-transmitter';
export const MAHOGANY_POWER_MAP='tour_mahogany_hall' as const;
export const MAHOGANY_POWER_NPC='mahoganyPowerResident';
export const MAHOGANY_POWER_SWITCH='mahoganyReserveSwitch';
export const MAHOGANY_POWER_FLAGS={heard:'nexusMahoganyPowerNeedHeard',allocation:'nexusMahoganyPowerAllocation',arrived:'nexusMahoganyPowerArrived',done:'nexusMahoganyPowerHandoff'} as const;
export const MAHOGANY_POWER_PATH:Point[]=[{x:12,y:15},{x:12,y:16},{x:12,y:17},{x:12,y:18},{x:12,y:19},{x:12,y:20},{x:13,y:20},{x:14,y:20},{x:15,y:20},{x:16,y:20},{x:16,y:21}];
const allowed=(f:SaveData['flags'])=>Boolean(f.nexusEcruteakEugeneReflected&&f[MAHOGANY_LIFE_PRESERVED]&&f[MAHOGANY_TRANSMISSION_STOPPED]);
type Motion={save:SaveData;player:SaveData['player'];index:number;elapsed:number};
const motions=new WeakMap<Engine,Motion>(),sessions=new WeakMap<Engine,object>();
const baseReservations=new WeakMap<GameMap,Point[]>();
export function mahoganyPowerPosition(g:Engine):(Point&{facing:Direction;walkStep:number;walkProgress:number})|undefined{
  const m=motions.get(g);if(!m||m.save!==g.save||m.player!==g.save.player||g.save.map!==MAHOGANY_POWER_MAP)return;
  const a=MAHOGANY_POWER_PATH[m.index],b=MAHOGANY_POWER_PATH[m.index+1]??a,t=Math.min(1,m.elapsed/.35);
  return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,facing:b.x>a.x?'right':b.x<a.x?'left':b.y<a.y?'up':'down',walkStep:m.index,walkProgress:t};
}
export function applyMahoganyPower(map:GameMap,f:SaveData['flags'],position?:Point):GameMap{
  if(map.id!==MAHOGANY_POWER_MAP)return map;
  const p=position??MAHOGANY_POWER_PATH[f[MAHOGANY_POWER_FLAGS.arrived]?MAHOGANY_POWER_PATH.length-1:0];
  const original=baseReservations.get(map)??map.reserved??[];
  const reserved=[...original];
  if(position){
    const segment=MAHOGANY_POWER_PATH.findIndex((a,i)=>{const b=MAHOGANY_POWER_PATH[i+1];return b&&position.x>=Math.min(a.x,b.x)&&position.x<=Math.max(a.x,b.x)&&position.y>=Math.min(a.y,b.y)&&position.y<=Math.max(a.y,b.y)&&!(position.x===b.x&&position.y===b.y);});
    if(segment>=0)for(const cell of [MAHOGANY_POWER_PATH[segment],MAHOGANY_POWER_PATH[segment+1]])if(!reserved.some(q=>q.x===cell.x&&q.y===cell.y))reserved.push({...cell});
  }
  const projected:GameMap={...map,reserved,npcs:map.npcs.map(n=>n.id===MAHOGANY_POWER_NPC?{...n,x:Math.round(p.x),y:Math.round(p.y)}:n)};
  baseReservations.set(projected,original);return projected;
}
/** No intermediate location is saved. Leaving the room or replacing the save cancels the walk. */
export function updateMahoganyPower(g:Engine,dt:number):void{
  const m=motions.get(g);if(!m)return;
  const s=g.save;
  if(m.save!==s||m.player!==s.player||s.map!==MAHOGANY_POWER_MAP||g.battle||!allowed(s.flags)||s.flags[MAHOGANY_POWER_FLAGS.allocation]!==2){motions.delete(g);return;}
  if(!Number.isFinite(dt)||dt<=0||g.move||g.dialogue||g.transition>0||g.transitionWarp||g.panel!=='field')return;
  const target=MAHOGANY_POWER_PATH[m.index+1];if(!target){motions.delete(g);return;}
  if(s.player.x===target.x&&s.player.y===target.y)return;
  const map=g.map,reserved=baseReservations.get(map)??map.reserved??[];
  if(map.walkable[target.y]?.[target.x]!=='.'||map.npcs.some(n=>n.id!==MAHOGANY_POWER_NPC&&n.x===target.x&&n.y===target.y)||reserved.some(p=>p.x===target.x&&p.y===target.y))return;
  m.elapsed+=Math.max(0,Math.min(dt,.1));
  if(m.elapsed<.35)return;m.elapsed=0;m.index++;
  if(m.index===MAHOGANY_POWER_PATH.length-1){motions.delete(g);s.flags[MAHOGANY_POWER_FLAGS.arrived]=true;g.persist();g.setTourDestination(MAHOGANY_POWER_MAP,MAHOGANY_POWER_NPC);}
}
export function handleMahoganyPower(g:Engine,event:string):boolean{
  const save=g.save;if(save.map!==MAHOGANY_POWER_MAP||![MAHOGANY_POWER_NPC,MAHOGANY_POWER_SWITCH].includes(event))return false;
  const player=save.player,x=player.x,y=player.y,token={};sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===MAHOGANY_POWER_MAP&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token;
  const guide=(id:string)=>{if(active())g.setTourDestination(MAHOGANY_POWER_MAP,id);};
  const onward=()=>{if(!active())return;g.say('황토에서 이어지는 길',['서쪽 42번도로로 나가면 절구산 갈림길을 만나요. 산행객들이 열기를 피해 돌아갈 길을 살피고 있어요.'],undefined,[{label:'42번도로 절구산 갈림길',action:()=>{if(active())g.setTourDestination('tour_johto_route_42','tourRoute42MortarBoard');}},{label:'황토 센터에서 동료 회복',action:()=>{if(active())g.setTourDestination('tour_mahogany_center','tourHost');}},{label:'여기서 더 둘러본다',action:()=>{}}]);};
  if(!allowed(save.flags)){g.say('안내소의 예비 조명',['전시를 비추는 등과 남쪽 문으로 이어지는 유도등을 살피는 자리다. 일반 출입과 기존 생활 공급은 계속 이용할 수 있다.']);return true;}
  if(save.flags[MAHOGANY_POWER_FLAGS.done]){g.say('남쪽 안내 자리',['주민: 밝은 전시만으로는 문으로 가는 길이 보이지 않았어요. 유도등을 따라 이 자리까지 걸어왔죠.','생활 공급반은 그대로 켜져 있고 송신기는 정지한 상태다. 이곳의 안내가 다른 전력 현장까지 해결한 것은 아니다.'],undefined,[{label:'다음 여행과 회복 안내',action:onward},{label:'이야기를 마친다',action:()=>{}}]);return true;}
  if(event===MAHOGANY_POWER_SWITCH){
    if(!save.flags[MAHOGANY_POWER_FLAGS.heard]){g.say('예비 전원 분배반',['먼저 대기 자리의 주민에게 어느 쪽이 불편한지 들어 보자.'],undefined,[{label:'대기 주민에게',action:()=>guide(MAHOGANY_POWER_NPC)}]);return true;}
    if(motions.has(g)||save.flags[MAHOGANY_POWER_FLAGS.arrived]){g.say('유지 중인 출입 유도등',['주민이 이용하는 동안 유도등의 공급을 유지하자.'],undefined,[{label:'주민에게',action:()=>guide(MAHOGANY_POWER_NPC)}]);return true;}
    const set=(n:1|2)=>{if(!active()||!allowed(save.flags))return;save.flags[MAHOGANY_POWER_FLAGS.allocation]=n;g.persist();g.say('배분한 예비 전원',[n===1?'전시등이 밝아졌지만 남쪽 대기 자리와 문으로 가는 유도등은 어둡다. 주민의 이동 불편은 남아 있다.':'남쪽 대기 자리에서 문 안쪽까지 유도등이 이어져 켜졌다. 전시등은 낮은 밝기로 남았다. 주민에게 걸어가 보자.']);};
    g.say('예비 전원 분배반',['예비 전원은 한 부하만 충분히 켤 수 있다. 전시등과 남쪽 출입 유도등 중 어디로 보낼까?','생활 공급반과 꺼 둔 송신기는 이 선택과 별도다.'],undefined,[{label:'전시등에 배분',action:()=>set(1)},{label:'남쪽 출입 유도등에 배분',action:()=>set(2)},{label:'아직 고르지 않는다',action:()=>{}}]);return true;
  }
  if(save.flags[MAHOGANY_POWER_FLAGS.arrived]){g.say('문 안쪽에 도착한 주민',['유도등이 모서리까지 이어져 있어 여기까지 걸어올 수 있었어요. 문은 바로 남쪽이군요.'],undefined,[{label:'안전 도착을 인계',action:()=>{if(!active()||!save.flags[MAHOGANY_POWER_FLAGS.arrived])return;save.flags[MAHOGANY_POWER_FLAGS.done]=true;g.persist();g.say('출입 안내 인계',['주민이 남쪽 안전 자리에서 다음 방문객에게 길을 알려 주기 시작했다.'],onward);}}]);return true;}
  if(motions.has(g)){g.say('유도등을 따라 걷는 주민',['빛이 이어지는 길을 천천히 따라갈게요. 앞길을 잠시 비워 주세요.']);return true;}
  if(!save.flags[MAHOGANY_POWER_FLAGS.heard]){g.say('대기 자리의 주민',['전시는 잘 보이는데 문으로 돌아가는 모서리는 어두워요. 생활 공급을 끊지 않고 이쪽 길도 비출 수 있을까요?'],undefined,[{label:'대기 자리와 출입 방향을 듣는다',action:()=>{if(!active())return;save.flags[MAHOGANY_POWER_FLAGS.heard]=true;g.persist();guide(MAHOGANY_POWER_SWITCH);}}]);return true;}
  if(save.flags[MAHOGANY_POWER_FLAGS.allocation]!==2){g.say('대기 자리의 주민',['전시등이 아니라 문으로 가는 길에 빛이 필요해요. 예비 전원의 배분을 다시 살펴 주세요.'],undefined,[{label:'분배반으로',action:()=>guide(MAHOGANY_POWER_SWITCH)}]);return true;}
  g.say('이어진 출입 유도등',['모서리까지 길이 보이네요. 남쪽 문 안쪽 자리까지 걸어가 볼게요.'],undefined,[{label:'유도등을 따라 이동 부탁',action:()=>{if(!active()||!allowed(save.flags)||save.flags[MAHOGANY_POWER_FLAGS.allocation]!==2||motions.has(g))return;motions.set(g,{save,player,index:0,elapsed:0});}},{label:'잠시 기다려 달라고 한다',action:()=>{}}]);return true;
}
