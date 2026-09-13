import type {Engine} from './engine';
import type {Pokemon} from './types';
import {createTrainerBattle} from './battle';
import {maxHpAtLevel} from './growth';
import {pokemonMoves} from './pokemon';
import {trainerWinFlag} from './road-trainers';
import {showTrainerPreparation} from './trainer-preparation';

export const MAHOGANY_TRANSMITTER_MAP='tour_mahogany_hall' as const;
export const MAHOGANY_TRANSMITTER_EVENTS={guard:'mahoganyTransmissionKeeper',life:'mahoganyLifeSupply',signal:'mahoganyTransmissionConsole'} as const;
export const MAHOGANY_TRANSMITTER_GUARD='mahogany-transmission-keeper';
export const MAHOGANY_LIFE_PRESERVED='nexusMahoganyLifePreserved';
export const MAHOGANY_TRANSMISSION_STOPPED='nexusMahoganyTransmissionStopped';
const sessions=new WeakMap<Engine,object>();

export function handleMahoganyTransmitter(g:Engine,event:string):boolean{
  const save=g.save;
  if(save.map!==MAHOGANY_TRANSMITTER_MAP||!(Object.values(MAHOGANY_TRANSMITTER_EVENTS) as string[]).includes(event))return false;
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===MAHOGANY_TRANSMITTER_MAP&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token;
  const ready=()=>active()&&Boolean(save.flags.nexusRageReliefReady);
  const won=()=>Boolean(save.flags[trainerWinFlag(MAHOGANY_TRANSMITTER_GUARD)]);
  const guide=(map:Parameters<Engine['setTourDestination']>[0],target:string)=>()=>{if(active())g.setTourDestination(map,target);};
  const center=guide('tour_mahogany_center','tourHost');
  if(!save.flags.nexusRageReliefReady){g.say('황토 설비 작업구역',['이곳에서는 호숫가 생활 공급과 복원 송신 계통을 관리한다. 담당자가 두 장치 사이를 살피고 있다.','담당자: 산길에 나가기 전에 북쪽 기후표를 보고 가렴. 물을 쓰는 주민들의 기록은 서쪽 수첩대에 있어. 안내소 남쪽 문으로 마을에 돌아갈 수 있다.'],undefined,[{label:'세 도로 기후표',action:guide(MAHOGANY_TRANSMITTER_MAP,'mahoganyHallRouteChart')},{label:'호수 주민에게',action:guide('tour_rage_lake_home1','tourHost')},{label:'둘러보기를 마친다',action:()=>{}}]);return true;}
  if(save.flags[MAHOGANY_TRANSMISSION_STOPPED]){g.say('분리 정지한 송신 장치',['송신기의 단로기는 열린 위치에 고정되어 있고 송신 표시등은 꺼져 있다. 옆 생활 공급반은 계속 켜져 있다.','이안: 신호는 멈췄어. 호수 포켓몬의 상태는 직접 돌아가 살펴야 해.'],undefined,[{label:'43번도로를 지나 호수로',action:guide('tour_rage_lake','rageLakeWaterStone')},{label:'센터에서 회복',action:center},{label:'살펴보기를 마친다',action:()=>{}}]);return true;}
  if(event===MAHOGANY_TRANSMITTER_EVENTS.guard){
    if(won()){g.say('송신 현장 담당자',['네 동료들의 힘은 알겠다. 장치를 살펴도 좋다. 주민이 쓰는 생활 공급까지 끊지는 마라.'],undefined,[{label:'생활 공급반으로',action:guide(MAHOGANY_TRANSMITTER_MAP,MAHOGANY_TRANSMITTER_EVENTS.life)},{label:'센터에서 회복',action:center}]);return true;}
    const current=()=>ready()&&!won();
    const start=()=>{
      if(!current())return;
      if(!save.party.some(p=>p.hp>0)){g.say('먼저 동료를 돌보자',['남쪽 출입문으로 나가 센터에서 회복한 뒤 돌아오자.'],undefined,[{label:'황토 센터로',action:center}]);return;}
      const team:Pokemon[]=[[66,24],[74,25]].map(([species,level])=>{const maxHp=maxHpAtLevel(species,level);const mon:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'황토 송신 현장 담당자의 동료'};mon.moves=pokemonMoves(mon);return mon;});
      g.battle=createTrainerBattle(save,{id:MAHOGANY_TRANSMITTER_GUARD,name:'송신 현장 담당자',reward:0,team});
      if(g.battle){sessions.delete(g);g.persist();g.say('송신 현장 담당자',['호수의 안정은 이 장치가 지켜 왔다. 멈춰도 된다는 네 판단, 동료들과 보여 봐라!']);}
    };
    g.say('송신 현장 담당자',['담당자: 물과 경보까지 잃게 할 수는 없다. 대안을 준비했다고 해도 송신을 멈추라는 지시는 받지 못했어.','이안: 주민에게 필요한 기능은 따로 마련했어요. 호수를 해치는 신호까지 유지할 이유는 없습니다.','알통몬 Lv.24 · 꼬마돌 Lv.25'],undefined,[{label:'동료를 준비하고 맞선다',action:()=>showTrainerPreparation(g,current,start)},{label:'센터에서 회복',action:center},{label:'지금은 물러난다',action:()=>{}}]);return true;
  }
  if(!won()){g.say('담당자가 지키는 제어기',['담당자가 작업을 멈춰 세웠다. 먼저 현장 담당자와 대립을 해결하자.'],undefined,[{label:'담당자에게',action:guide(MAHOGANY_TRANSMITTER_MAP,MAHOGANY_TRANSMITTER_EVENTS.guard)},{label:'센터에서 회복',action:center}]);return true;}
  if(event===MAHOGANY_TRANSMITTER_EVENTS.life){
    if(save.flags[MAHOGANY_LIFE_PRESERVED]){g.say('유지한 생활 공급',['생활 공급 손잡이는 켜짐 위치에 고정되어 있다. 청록색 배선은 송신 단로기를 거치지 않는다.'],undefined,[{label:'분리 송신 제어기로',action:guide(MAHOGANY_TRANSMITTER_MAP,MAHOGANY_TRANSMITTER_EVENTS.signal)}]);return true;}
    g.say('생활 공급반',['청록색 선은 생활 공급으로, 황토색 선은 별도 송신기로 이어진다. 어느 손잡이를 유지할까?'],undefined,[
      {label:'생활 공급을 켜짐 위치에 고정',action:()=>{if(!ready()||!won())return;g.say('생활 공급 유지',['생활 손잡이를 켜짐 위치에 고정했다. 이제 옆 송신 단로기만 분리할 수 있다.'],()=>{if(!ready()||!won())return;if(!save.flags[MAHOGANY_LIFE_PRESERVED]){save.flags[MAHOGANY_LIFE_PRESERVED]=true;g.persist();}guide(MAHOGANY_TRANSMITTER_MAP,MAHOGANY_TRANSMITTER_EVENTS.signal)();});}},
      {label:'공통 공급을 모두 끈다',action:()=>{if(active())g.say('이안',['생활 기능은 유지해야 해. 송신기와 다른 선을 따라가는 공급 손잡이를 남겨 두자.']);}},
    ]);return true;
  }
  if(!save.flags[MAHOGANY_LIFE_PRESERVED]){g.say('분리 정지 전',['생활 공급 손잡이를 유지한 뒤 송신기 단로기를 다루자.'],undefined,[{label:'생활 공급반으로',action:guide(MAHOGANY_TRANSMITTER_MAP,MAHOGANY_TRANSMITTER_EVENTS.life)}]);return true;}
  g.say('송신 제어기',['생활선 옆으로 별도 송신선이 이어진다. 송신 단로기만 열면 옆 공급반은 계속 작동한다.'],undefined,[
    {label:'송신 단로기만 열어 고정',action:()=>{if(!ready()||!won()||!save.flags[MAHOGANY_LIFE_PRESERVED])return;g.say('송신 분리 정지',['송신 단로기를 열고 열린 위치에 고정했다. 송신 표시등이 꺼지고 생활 공급반의 등은 남았다.','이안: 호수로 돌아가자. 신호가 멈췄다고 포켓몬까지 곧바로 안정되는 건 아니야.'],()=>{if(!ready()||!won()||!save.flags[MAHOGANY_LIFE_PRESERVED])return;if(!save.flags[MAHOGANY_TRANSMISSION_STOPPED]){save.flags[MAHOGANY_TRANSMISSION_STOPPED]=true;g.persist();}guide('tour_rage_lake','rageLakeWaterStone')();});}},
    {label:'생활선도 함께 뽑는다',action:()=>{if(active())g.say('유지할 기능',['생활선은 남겨 두자. 분리된 송신 단로기만 조작하면 된다.']);}},
    {label:'나중에 조작한다',action:()=>{}},
  ]);return true;
}
