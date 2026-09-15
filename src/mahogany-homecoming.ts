import type {Engine} from './engine';
import type {SaveData} from './types';
import type {Furnishing} from './explore-interiors';
import {SPECIES} from './pokemon';

const MAP='tour_mahogany_home1';
const PREPARED='nexusMahoganyHomeTablePrepared', RESTED='nexusMahoganyHomeRested';
const sessions=new WeakMap<Engine,object>();

/** A local household scene, independent of chapter completion and water safety. */
export function handleMahoganyHomecoming(g:Engine,event:string):boolean{
  const save=g.save;
  if(save.map!==MAP||!save.flags.nexusMahoganyPowerHandoff||!['tourHost','mahoganyHomeHerbTable','mahoganyHomeCompanionSeat'].includes(event))return false;
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===MAP&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token;
  const guide=(id:string)=>()=>{if(active())g.setTourDestination(MAP,id);};
  const depart=(map:'tour_mahogany_center'|'tour_johto_route_42'|'tour_johto_route_43'|'tour_johto_route_44',event?:string)=>()=>{if(active())g.setTourDestination(map,event);};
  const departureChoices=()=>[
    {label:'서쪽 42번도로·인주',action:depart('tour_johto_route_42','tourRoute42WaterRail')},
    {label:'북쪽 43번도로·호수',action:depart('tour_johto_route_43')},
    {label:'동쪽 44번도로·얼음샛길',action:depart('tour_johto_route_44')},
    {label:'황토 포켓몬센터',action:depart('tour_mahogany_center','tourHost')},
    {label:'집에 더 머문다',action:()=>{}},
  ];
  if(event==='tourHost'){
    g.say('산기슭 집의 주민',[
      '안내소에서 출구 불빛을 따라 주민이 무사히 나왔다는 소식을 들었단다. 집에서도 하던 일을 조금씩 이어 가야지.',
      save.flags.nexusMortarDownstreamChecked?'42번도로에서 살핀 작은 배수홈도 낙엽이 다시 흘러들지 않게 정리했구나. 그곳의 변화부터 지켜보자.':'산에서 내려오는 물길은 아직 따로 살펴야 해. 불빛이 돌아왔다고 물까지 달라지는 건 아니니까.',
      save.flags[RESTED]?'함께 펼친 방석은 그대로 두었어. 다음 길에 나서기 전에 동료와 쉬어 가렴.':'산나물 손질대의 빈 바구니를 정돈하고 동료가 쉴 자리를 함께 마련해 주겠니?',
    ],undefined,save.flags[RESTED]?departureChoices():[{label:save.flags[PREPARED]?'동료 쉴 자리로':'손질대로',action:guide(save.flags[PREPARED]?'mahoganyHomeCompanionSeat':'mahoganyHomeHerbTable')},{label:'이야기를 마친다',action:()=>{}}]);return true;
  }
  if(event==='mahoganyHomeHerbTable'&&save.flags[PREPARED]){g.say('정돈된 손질대',['흙과 마른 잎을 담은 바구니는 한쪽에, 빈 바구니는 낮은 받침에 놓여 있다.'],undefined,[{label:'동료 쉴 자리로',action:guide('mahoganyHomeCompanionSeat')},{label:'닫기',action:()=>{}}]);return true;}
  if(event==='mahoganyHomeCompanionSeat'&&!save.flags[PREPARED]){g.say('접힌 방석',['주민: 손질대의 빈 바구니부터 정리하자. 그 뒤 이 방석을 펼치면 돼.'],undefined,[{label:'손질대로',action:guide('mahoganyHomeHerbTable')},{label:'닫기',action:()=>{}}]);return true;}
  const choose=(page=0)=>{
    if(!active())return;
    g.say('함께할 동료',[event==='mahoganyHomeHerbTable'?'동료는 굴러가는 빈 바구니를 지켜 주고, 사람은 흙과 마른 잎을 따로 모으자.':'주민이 마련한 방석을 펼치고 동료와 잠깐 쉬어 가자.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name} ${mon.hp}/${mon.maxHp}`,action:()=>{
        if(!active()||!save.party.includes(mon))return;
        if(mon.hp<=0){g.say('먼저 동료를 돌보자',['쓰러진 동료는 황토 포켓몬센터에서 회복한 뒤 함께하자.'],undefined,[{label:'황토 센터로 길안내',action:()=>{if(active())g.setTourDestination('tour_mahogany_center','tourHost');}},{label:'다른 동료 고르기',action:()=>choose(page)},{label:'나중에 돌아온다',action:()=>{}}]);return;}
        if(event==='mahoganyHomeHerbTable'){
          save.flags[PREPARED]=true;g.persist();g.say('낮은 바구니 자리',[`${SPECIES[mon.species].name}이 빈 바구니 옆을 지켜 주는 동안 흙과 마른 잎을 분리했다. 빈 바구니를 낮은 받침에 내려놓았다.`, '주민: 고마워. 남쪽 온돌 자리에서 이제 쉬렴.'],undefined,[{label:'온돌 자리로',action:guide('mahoganyHomeCompanionSeat')},{label:'닫기',action:()=>{}}]);
        }else{
          const first=!save.flags[RESTED];save.flags[RESTED]=true;g.persist();
          g.say('산기슭의 잠깐 휴식',[first?'접힌 방석을 나란히 펼쳤다. 주민이 손질 도구를 내려놓고 이야기를 건넨다.':'앞서 펼친 방석 곁에서 주민이 다시 반갑게 맞아 준다.',`${SPECIES[mon.species].name}와 산바람 소리를 들으며 잠깐 쉬었다.`, '주민: 서쪽은 42번도로와 인주, 북쪽은 43번도로와 호수, 동쪽은 44번도로와 얼음샛길이야. 다친 동료는 떠나기 전에 센터에서 돌봐 주렴.'],undefined,departureChoices());
        }
      }})),
      ...(save.party.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>choose(page?0:1)}]:[]),{label:'나중에 하기',action:()=>{}},
    ]);
  };choose();return true;
}

/** Draw only persistent household objects; no absent party Pokemon is projected. */
export function paintMahoganyHomecoming(c:CanvasRenderingContext2D,mapId:string,o:Furnishing,f:SaveData['flags']):void{
  if(mapId!==MAP||!f[PREPARED])return;
  c.save();const x=o.x*16,y=o.y*16;
  if(o.event==='mahoganyHomeHerbTable'){
    c.fillStyle='#ae8b60';c.fillRect(x+8,y+6,22,13);c.fillRect(x+44,y+6,22,13);
    c.fillStyle='#645444';c.fillRect(x+11,y+8,16,7);c.fillStyle='#667747';c.fillRect(x+13,y+9,4,4);c.fillRect(x+20,y+10,5,3);
    c.fillStyle='#dbc599';c.fillRect(x+47,y+8,16,7);
  }else if(o.event==='mahoganyHomeCompanionSeat'&&f[RESTED]){
    for(const dx of [10,43,76]){c.fillStyle='#526a72';c.fillRect(x+dx,y+2,25,11);c.fillStyle='#afc1ae';c.fillRect(x+dx+2,y+3,21,8);}
  }
  c.restore();
}
