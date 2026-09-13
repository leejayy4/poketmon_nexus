import type {Engine} from './engine';
import {SPECIES} from './pokemon';
import {JOHTO_ROUTE_33} from './johto-south-route';

const sessions=new WeakMap<Engine,object>();
/** A new physical batch, independent of the old observation flags and inventory. */
export function handleAzaleaWorkshop(g:Engine,event:string):boolean{
  const save=g.save,map=save.map,yard=map==='tour_azalea'&&event==='tourAzaleaApricornYard';
  const desk=map==='tour_azalea_hall'&&event==='azaleaHallSortingDesk';
  const shelf=map==='tour_azalea_hall'&&event==='azaleaHallDryingShelf';
  const rest=map==='tour_azalea_hall'&&event==='azaleaHallPokemonRest';
  if(!yard&&!desk&&!shelf&&!rest)return false;
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token;
  const guide=(target:typeof map,id?:string)=>()=>{if(active())g.setTourDestination(target,id);};
  const done=(flag:string,text:string)=>{if(!active())return;if(!save.flags[flag]){save.flags[flag]=true;g.persist();}g.say('공방 작업',[text]);};
  const choose=(work:(mon:typeof save.party[number],valid:()=>boolean)=>void,page=0)=>{
    if(!active())return;
    g.say('함께 작업할 동료',['주민이 마련한 규토리를 손질할 거야. 함께 일할 동료와 무리 없는 방법을 골라 보렴.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name} ${mon.hp}/${mon.maxHp}`,action:()=>{
        const valid=()=>active()&&save.party.includes(mon)&&mon.hp>0;
        if(!active()||!save.party.includes(mon))return;
        if(mon.hp<=0){g.say('먼저 회복하자',['쓰러진 동료는 센터에서 회복해야 한다.'],undefined,[{label:'고동센터로',action:guide('tour_azalea_center','tourHost')},{label:'취소',action:()=>{}}]);return;}
        work(mon,valid);
      }})),
      ...(save.party.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>choose(work,page?0:1)}]:[]),
      {label:'나중에 하기',action:()=>{}},
    ]);
  };
  if(yard){
    g.say('규토리 마당',[save.flags.azaleaWorkBatch?'이번 작업에 쓸 열매 바구니가 준비되어 있다.':'주민이 마련한 열매 바구니를 동료와 공방에 들일 준비를 하자.',save.flags.nexusGoldenrodInquiryReady?'주민: 이안에게 전한 것처럼 생활은 유지해야지. 좋은 열매를 남기고 손상된 것만 따로 살펴보자.':'주민: 서두르지 말고 동료와 일을 나누어 보렴.'],undefined,[
      {label:save.flags.azaleaWorkBatch?'선별 작업대로':'동료와 바구니 준비',action:()=>{if(!active())return;if(save.flags.azaleaWorkBatch){guide('tour_azalea_hall','azaleaHallSortingDesk')();return;}choose((mon,valid)=>{
        const strong=SPECIES[mon.species].types.some(t=>['격투','바위','땅'].includes(t));
        g.say('바구니 옮길 준비',[strong?'동료가 낮은 받침을 지키고 사람이 열매를 나눠 담을 수 있다.':'동료가 길 쪽에서 열매가 굴러가지 않게 지켜 주고 사람이 작은 바구니를 나를 수 있다.'],undefined,[
          {label:strong?'받침을 지키며 나누어 담기':'작은 바구니로 나누어 나르기',action:()=>{if(valid())done('azaleaWorkBatch','작업용 바구니를 나눠 마련했다. 공방 선별 작업대에서 손상 열매를 분리하자.');}},
          {label:'한꺼번에 높이 쌓기',action:()=>{if(valid())g.say('불안정한 바구니',['열매가 굴러내린다. 높이 쌓지 말고 동료의 역할에 맞춰 나누자.']);}},
          {label:'취소',action:()=>{}},
        ]);
      });}},
      {label:'마당에 머문다',action:()=>{}},
    ]);return true;
  }
  if(!save.flags.azaleaWorkBatch){g.say('공방 작업',['작업대에 올릴 바구니가 아직 없구나. 마당에서 이번에 손질할 열매부터 챙겨 오렴.'],undefined,[{label:'규토리 마당으로',action:guide('tour_azalea','tourAzaleaApricornYard')},{label:'나중에 하기',action:()=>{}}]);return true;}
  if(desk){
    if(save.flags.azaleaWorkSorted){g.say('선별 작업대',['손상 열매는 얕은 분리 접시에, 온전한 열매는 건조용 칸에 남아 있다.'],undefined,[{label:'건조 선반으로',action:guide('tour_azalea_hall','azaleaHallDryingShelf')},{label:'닫기',action:()=>{}}]);return true;}
    choose((mon,valid)=>g.say('갈라진 열매 선별',[`${SPECIES[mon.species].name}와 열매 표면을 살핀다. 색이 같은 열매 중에도 갈라진 것이 있다.`],undefined,[
      {label:'갈라진 열매를 따로 놓기',action:()=>{if(valid())done('azaleaWorkSorted','갈라진 열매를 분리 접시에 옮겼다. 온전한 열매만 건조 선반으로 가져가자.');}},
      {label:'색이 같으면 함께 놓기',action:()=>{if(valid())g.say('다시 선별하자',['갈라진 열매가 온전한 열매와 섞여 있다. 색보다 손상 여부를 먼저 확인하자.']);}},
      {label:'중단',action:()=>{}},
    ]));return true;
  }
  if(!save.flags.azaleaWorkSorted){g.say('선별이 먼저',['손상 열매를 분리한 뒤 건조 작업을 이어가자.'],undefined,[{label:'작업대로',action:guide('tour_azalea_hall','azaleaHallSortingDesk')},{label:'닫기',action:()=>{}}]);return true;}
  if(rest){
    const departure=()=>{
      if(!active())return;
      g.say('공방에서 다시 길로',[
        '손상된 열매는 따로 두고, 선반에는 바람이 통하도록 간격을 남겼다. 방석과 물그릇도 준비되어 있다.',
        '주민: 나머지는 우리가 돌볼게. 숲으로 갈 거니? 아니면 33번도로를 지나 연결동굴 쪽으로 갈 거니?',
      ],undefined,[
        {label:'너도밤나무숲으로',action:guide('tour_ilex')},
        {label:'33번도로로',action:guide(JOHTO_ROUTE_33)},
        {label:'센터에서 여행 준비',action:guide('tour_azalea_center','tourHost')},
        {label:'공방에 머문다',action:()=>{}},
      ]);
    };
    if(save.flags.azaleaWorkRested){departure();return true;}
    if(!save.flags.azaleaWorkDrying){g.say('작업 휴게석',['건조 간격을 확보한 뒤 작업을 멈추고 쉬자. 치료가 필요하면 센터를 이용하자.']);return true;}
    g.say('작업을 마칠 때',['선반에는 바람이 통하고 있다. 동료가 계속 일할 필요가 있을까?'],undefined,[
      {label:'작업을 멈추고 휴식자리 마련',action:()=>{if(!active())return;save.flags.azaleaWorkRested=true;g.persist();departure();}},
      {label:'마를 때까지 계속 작업',action:()=>{if(active())g.say('쉬는 것도 작업',['더 만지지 않아도 바람이 지난다. 동료에게 휴식 시간을 주자.']);}},
      {label:'닫기',action:()=>{}},
    ]);return true;
  }
  if(save.flags.azaleaWorkDrying){g.say('건조 선반',['열매 사이로 바람이 통한다. 작업 결과는 그대로 남아 있다.'],undefined,[{label:'동료 휴식 판단',action:guide('tour_azalea_hall','azaleaHallPokemonRest')},{label:'닫기',action:()=>{}}]);return true;}
  choose((mon,valid)=>{
    const wing=SPECIES[mon.species].types.includes('비행');
    g.say('건조 간격 고르기',[wing?'날갯바람이 너무 가까우면 열매가 굴러간다. 떨어진 자리에서 약하게 보내자.':'동료와 받침 간격을 맞춰 자연 바람이 지나갈 틈을 남기자.',save.flags.azaleaWorkCrowded?'앞서 모아 놓은 열매가 서로 닿아 있다. 다시 벌릴 수 있다.':'씻은 열매를 어떻게 놓을까?'],undefined,[
      {label:wing?'열매를 띄우고 멀리서 바람 보내기':'간격 받침을 끼워 열매 벌리기',action:()=>{if(!valid())return;save.flags.azaleaWorkCrowded=false;save.flags.azaleaWorkVentilated=wing;done('azaleaWorkDrying','열매를 서로 닿지 않게 벌렸다. 이제 동료 휴게석에서 작업을 마치자.');}},
      {label:wing?'가까이서 세게 날갯짓':'한곳에 빽빽하게 모으기',action:()=>{if(!valid())return;save.flags.azaleaWorkCrowded=true;g.persist();g.say('간격을 다시 맞추자',['열매가 한쪽에 몰려 바람이 통하지 않는다. 서로 닿지 않게 다시 벌려 놓자.']);}},
      {label:'동료 상태를 보고 중단',action:()=>{if(valid())g.setTourDestination('tour_azalea_center','tourHost');}},
    ]);
  });return true;
}
