import type {Engine} from './engine';

export const GOLDENROD_IAN_BRIEFED='nexusGoldenrodIanBriefed';
export const GOLDENROD_TEST_SENT='nexusGoldenrodTestSent';
export const GOLDENROD_RECEIVER_CONFIRMED='nexusGoldenrodReceiverConfirmed';
export const GOLDENROD_INQUIRY_READY='nexusGoldenrodInquiryReady';
const sessions=new WeakMap<Engine,object>();

/** CH04 opening only. Public radio and station activities remain available. */
export function handleGoldenrodNexus(g:Engine,event:string,ordinary:()=>void):boolean{
  const save=g.save,map=save.map;
  if(map==='tour_goldenrod_home3'&&event==='tourExhibit2'){
    g.say('피카츄의 청취 자리',save.flags[GOLDENROD_RECEIVER_CONFIRMED]?[
      '피카츄가 정돈된 방석에서 쉬고 있다. 옆 물그릇에는 새 물이 담겨 있다.',
      '주민: 안내가 들어온 걸 보고 물을 갈고 함께 쉬었어요. 이 생활은 계속 지키고 싶어요.',
    ]:['피카츄가 방석에 앉아 수신기 쪽으로 귀를 기울인다. 옆에는 물그릇을 놓는 자리가 있다.','주민과 함께 사는 동료다. 포획하거나 데려가는 대상은 아니다.']);return true;
  }
  if(!save.flags.nexusCinnabarIanContactConfirmed)return false;
  const station=map==='tour_goldenrod_station'&&event==='tourHost';
  const tower=map==='tour_goldenrod_hall'&&event==='tourExhibit0';
  const receiver=map==='tour_goldenrod_home3'&&event==='tourExhibit0';
  if(!station&&!tower&&!receiver)return false;
  if(!station&&!save.flags[GOLDENROD_IAN_BRIEFED])return false;
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const current=()=>g.save===save&&save.player===player&&save.map===map&&save.player.x===x&&save.player.y===y&&!g.battle&&sessions.get(g)===token&&Boolean(save.flags.nexusCinnabarIanContactConfirmed);
  const guide=(target:string,id:string)=>()=>{if(current())g.setTourDestination(target,id);};
  const publicActivity=()=>{if(current()){sessions.delete(g);ordinary();}};
  const record=(flag:string,pages:string[],next:()=>void)=>{
    if(!current())return;
    g.say('이안과 현장 확인',pages,()=>{if(!current())return;if(!save.flags[flag]){save.flags[flag]=true;g.persist();}next();});
  };
  if(station){
    const received=Boolean(save.flags[GOLDENROD_RECEIVER_CONFIRMED]);
    const briefed=Boolean(save.flags[GOLDENROD_IAN_BRIEFED]);
    const report=()=>{
      if(!current()||!save.flags[GOLDENROD_RECEIVER_CONFIRMED])return;
      g.say('금빛역에서 이안에게',[
        '이안: 납품 원본의 금빛 수신 장비와 지금 주민이 쓰는 장비를 대조했어. 안내 신호가 생활에 도움이 된다는 말은 현장에서 확인했지.',
        '유진: 이런 안내가 더 일찍 있었다면 피해를 줄일 수도 있었겠네. 도움이 되는 부분까지 없애면 안 되겠어.',
        '이안: 맞아. 하지만 금빛의 한 수신기가 잘 작동했다고 복원 사업 전체가 안전하다는 뜻은 아니야. 공방과 숲, 인주에서 실제 쓰임을 더 듣고, 호수의 경보와 물 공급도 따로 확인해야 해.',
      ],undefined,[
        {label:save.flags[GOLDENROD_INQUIRY_READY]?'현장 대조 결과 다시 보기':'도움과 미확인 부분을 나눠 전달',action:()=>record(GOLDENROD_INQUIRY_READY,['금빛 공개 시험의 송출과 주택 수신을 확인했다. 납품 원본은 보존하고 다른 현장의 안전 여부는 미확인으로 남겼다.','금빛의 생활 안내를 유지한 채 다음 현장의 주민 이야기를 듣기로 했다.'],()=>g.say('다음 현장을 준비하며',['기존 금빛 공방과 숲길에서 동료와 일하는 생활을 더 살펴보자. 호수 사건은 아직 해결하지 않았다.'],undefined,[{label:'여행 준비 작업방',action:guide('tour_goldenrod_home2','tourHost')},{label:'역에 머문다',action:()=>{}}]))},
        {label:'아직 전달하지 않는다',action:()=>{}},
      ]);
    };
    g.say('금빛역 안내원',[briefed?'이안과 연결한 납품 연락이 남아 있습니다. 금빛의 현장 확인을 이어가세요.':'홍련에서 연락한 이안이 납품 원본 대조를 위해 통화를 기다리고 있습니다.','노랑행 열차와 남쪽 현관은 평소대로 이용할 수 있습니다.'],undefined,[
      {label:received?'현장 결과를 이안에게':briefed?'생활 장비 현장으로':'이안의 납품 연락 받기',action:()=>{
        if(!current())return;
        if(received){report();return;}
        if(briefed){guide(save.flags[GOLDENROD_TEST_SENT]?'tour_goldenrod_home3':'tour_goldenrod_hall','tourExhibit0')();return;}
        record(GOLDENROD_IAN_BRIEFED,['이안: 홍련 반입 원본과 같은 계통의 납품 기록이 금빛 생활 안내 수신기에도 있어. 원본을 보존한 채 실제 쓰임부터 보자.','라디오 타워 공개 조정석에서 시험 안내를 보내고, 라디오를 듣는 집에서 수신을 확인해 줘. 일반 방송이나 생활 전원은 끄지 않아도 돼.'],guide('tour_goldenrod_hall','tourExhibit0'));
      }},
      {label:'기존 역·도시 안내',action:publicActivity},
      {label:'지금은 이동한다',action:()=>{}},
    ]);return true;
  }
  if(tower){
    g.say('공개 안내 시험 조정석',['방송 직원이 일반 방송과 분리된 생활 안내 시험 채널을 내준다. 수신 확인용 신호만 보내면 된다.'],undefined,[
      {label:save.flags[GOLDENROD_TEST_SENT]?'수신 주택으로':'공개 시험 신호 보내기',action:()=>{
        if(!current()||!save.flags[GOLDENROD_IAN_BRIEFED])return;
        if(save.flags[GOLDENROD_TEST_SENT]){guide('tour_goldenrod_home3','tourExhibit0')();return;}
        record(GOLDENROD_TEST_SENT,['시험 채널의 송출 스위치를 눌렀다. 조정석의 송출 표시가 켜졌다.','직원: 이제 청취 주택에서 수신 스위치를 맞춰 주세요. 우리가 보냈다는 표시만으로 주민에게 닿았다고 판단할 수는 없어요.'],guide('tour_goldenrod_home3','tourExhibit0'));
      }},
      {label:'기존 방송 체험',action:publicActivity},
      {label:'조정석에서 물러난다',action:()=>{}},
    ]);return true;
  }
  g.say('주택 생활 안내 수신기',[save.flags[GOLDENROD_RECEIVER_CONFIRMED]?'확인한 수신 표시가 남아 있다. 주민과 동료가 생활 안내를 함께 이용한다.':'주민: 손이 바쁠 때도 이 수신기 표시를 보고 동료의 쉬는 시간을 챙겨요. 시험 채널을 맞춰 볼까요?'],undefined,[
    {label:save.flags[GOLDENROD_RECEIVER_CONFIRMED]?'이안에게 현장 결과 전달':'시험 채널로 수신 확인',action:()=>{
      if(!current()||!save.flags[GOLDENROD_IAN_BRIEFED])return;
      if(save.flags[GOLDENROD_RECEIVER_CONFIRMED]){guide('tour_goldenrod_station','tourHost')();return;}
      if(!save.flags[GOLDENROD_TEST_SENT]){g.say('수신 대기',['시험 신호가 아직 오지 않았다. 먼저 라디오 타워에서 공개 시험을 보내자.'],undefined,[{label:'조정석으로',action:guide('tour_goldenrod_hall','tourExhibit0')},{label:'나중에 확인',action:()=>{}}]);return;}
      record(GOLDENROD_RECEIVER_CONFIRMED,['수신 다이얼을 시험 채널에 맞추자 표시가 들어왔다. 주민은 손에 든 일을 내려놓고 포켓몬의 그릇과 쉬는 자리를 챙겼다.','주민: 전에는 일하다 시간을 놓쳤는데 이 안내 덕분에 함께 쉬게 됐어요. 계속 쓸 수 있게 해 주세요.','이안에게 송출 기록과 주민이 실제로 이용한 결과를 따로 전하자.'],guide('tour_goldenrod_station','tourHost'));
    }},
    {label:'평소 라디오 살펴보기',action:publicActivity},
    {label:'집 안에 머문다',action:()=>{}},
  ]);return true;
}
