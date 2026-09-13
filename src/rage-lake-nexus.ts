import type {Engine} from './engine';
const sessions=new WeakMap<Engine,object>();
export const RAGE_EVENTS={resident:'tourHost',intake:'rageLakeWaterStone',reeds:'rageLakeReedDesk',alarm:'rageLakeLookout',returnBoard:'tourRoute43LakeBoard'} as const;
export const RAGE_STAGES=['nexusRageResidentsHeard','nexusRageIntakeCompared','nexusRageReedMarked','nexusRageAlarmTested','nexusRageAlternativesNeeded'] as const;
export function handleRageLakeNexus(g:Engine,event:string,ordinary:()=>void):boolean{
  const save=g.save,map=save.map;
  if(!save.flags.nexusGoldenrodInquiryReady)return false;
  const home=map==='tour_rage_lake_home1'&&event===RAGE_EVENTS.resident;
  const index=map==='tour_rage_lake'?([RAGE_EVENTS.intake,RAGE_EVENTS.reeds,RAGE_EVENTS.alarm] as string[]).indexOf(event):-1;
  if(!home&&index<0)return false;
  const token={},player=save.player,x=player.x,y=player.y;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token&&Boolean(save.flags.nexusGoldenrodInquiryReady);
  const guide=(target:typeof map,id:string)=>()=>{if(active())g.setTourDestination(target,id);};
  const next=()=>{
    if(!active()||save.flags.nexusRageAlternativesNeeded)return;
    const events=[RAGE_EVENTS.intake,RAGE_EVENTS.reeds,RAGE_EVENTS.alarm];
    const pending=events.findIndex((_,i)=>!save.flags[RAGE_STAGES[i+1]]);
    guide(pending<0?'tour_rage_lake_home1':'tour_rage_lake',pending<0?'tourHost':events[pending])();
  };
  const write=(flag:string,pages:string[])=>{if(!active())return;g.say('호수의 생활',pages,()=>{if(!active())return;if(!save.flags[flag]){save.flags[flag]=true;g.persist();}next();});};
  const normal=()=>{if(active()){sessions.delete(g);ordinary();}};
  if(home){
    if(save.flags.nexusRageAlternativesNeeded){
      g.say('호숫가 주민',['비교 받이와 둑 표식, 시험 반사판은 그대로 두었어요. 물을 받으며 다음 준비를 기다리고 있어요.','이안: 대체 수로와 별도 경보가 필요하다는 건 확인했어. 사용할 수 있게 마련하기 전에는 지금 설비를 멈추지 말자.'],undefined,[
        {label:'취수 비교함 다시 보기',action:guide('tour_rage_lake',RAGE_EVENTS.intake)},
        {label:'평소 주민 이야기',action:normal},
        {label:'43번도로로 돌아가기',action:guide('tour_johto_route_43',RAGE_EVENTS.returnBoard)},
      ]);return true;
    }
    const ready=RAGE_STAGES.slice(0,4).every(f=>save.flags[f]);
    g.say('호숫가 주민',[
      '이 자리에서 갈대를 손질해요. 취수한 물로 갈대를 씻고 동료의 그릇도 채우죠. 설비가 들어온 뒤 물을 받는 시간이 일정해졌어요.',
      '경보 덕분에 비가 올 때도 둑의 짐을 먼저 옮길 수 있었어요. 이상한 점이 있어도 이것까지 갑자기 없애면 곤란해요.',
    ],undefined,[
      {label:ready?'이안과 대안 준비를 의논':'생활 설비 현장 살피기',action:()=>{
        if(!active())return;
        if(ready){g.say('이안과 호숫가 주민',['이안: 취수 표시와 실제 흐름이 달랐고, 갈대 옆 젖은 자국은 생활길까지 닿았어. 시험 경보도 물가에서는 잘 보이지 않았지.','주민: 물과 경보는 필요해요. 대신 쓸 길과 장치를 먼저 마련해 주세요.'],undefined,[
          {label:'대체 수로와 별도 경보를 먼저 준비',action:()=>write(RAGE_STAGES[4],['취수 기능은 유지하고 마른 둑을 따라 대체 수로를 준비하기로 했다. 경보도 기존 송신 설비와 별개로 전달할 방법이 필요하다.','이안: 준비가 갖춰지기 전에는 송신 장치를 멈추지 말자. 아직 수로를 만들거나 호수를 회복한 것은 아니야.'])},
          {label:'설비부터 모두 끈다',action:()=>{if(active())g.say('주민의 부탁',['물 공급과 경보가 함께 끊겨요. 먼저 대신 쓸 방법을 마련해 주세요.']);}},
          {label:'다시 현장 살피기',action:guide('tour_rage_lake','rageLakeWaterStone')},
        ]);return;}
        if(save.flags[RAGE_STAGES[0]])next();else write(RAGE_STAGES[0],['갈대 손질 자리에서 물과 경보가 주민에게 필요한 이유를 들었다. 먼저 수위 표석 옆 취수 비교함으로 가자.']);
      }},
      {label:'평소 주민 이야기',action:normal},
      {label:'43번도로로 돌아가기',action:guide('tour_johto_route_43','tourRoute43LakeBoard')},
    ]);return true;
  }
  if(!save.flags[RAGE_STAGES[index]]){g.say('현장 비교',['주민이 쓰는 순서와 앞 현장 결과를 먼저 확인하자.'],undefined,[{label:'앞 현장으로',action:()=>{if(!active())return;if(!save.flags[RAGE_STAGES[0]])guide('tour_rage_lake_home1','tourHost')();else next();}},{label:'기존 관찰',action:normal}]);return true;}
  const scenes=[
    {title:'수위 표석 옆 취수 비교함',text:'공급 눈금은 일정하지만 받이의 젖은 선은 들쭉날쭉하다. 물 공급을 유지하면서 무엇을 비교할까?',yes:'생활 밸브를 두고 비교 받이 눈금 맞추기',no:'생활 밸브를 잠가 확인하기',result:'생활 밸브를 유지하고 비교 받이를 맞췄다. 고정 눈금과 실제 흐름이 다르다. 갈대 쪽 젖은 자국도 살펴보자.',wrong:'주민이 물을 받을 수 없게 된다. 비교 받이만 사용하자.'},
    {title:'갈대 옆 우회 표식',text:'젖은 발자국은 낮은 갈대 쪽에 몰려 있다. 대체 수로를 살필 출발점은 어디에 표시할까?',yes:'살아 있는 갈대 밖 마른 둑에 표시',no:'갈대를 밟고 가장 짧은 곳에 표시',result:'기존 기록대의 마른 둑 쪽에 표식을 고정했다. 살아 있는 갈대와 생활 보행로를 남긴 대안 조사 위치다. 아직 물길을 튼 것은 아니다.',wrong:'발자국과 갈대를 덮어 버린다. 마른 둑 쪽에서 다시 고르자.'},
    {title:'전망대 경보 시험함',text:'전망대에서는 등이 보이지만 낮은 물가에서는 갈대에 가린다. 정상 경보를 유지하며 시험할 방법을 고르자.',yes:'시험 반사판을 낮은 물가 쪽으로 돌리기',no:'정상 경보를 끄고 시험하기',result:'시험 반사판을 물가 쪽으로 돌려 표시가 닿는 방향을 남겼다. 현재 경보 하나로는 모든 생활 위치를 덮지 못한다. 주민과 이안에게 돌아가자.',wrong:'실제 비상 안내가 끊긴다. 정상 경보는 두고 시험 반사판만 돌리자.'},
  ][index];
  if(save.flags[RAGE_STAGES[index+1]]){g.say(scenes.title,[scenes.result],undefined,[{label:'다음 확인 장소',action:next},{label:'기존 관찰',action:normal}]);return true;}
  g.say(scenes.title,[scenes.text],undefined,[
    {label:scenes.yes,action:()=>{if(active()&&save.flags[RAGE_STAGES[index]])write(RAGE_STAGES[index+1],[scenes.result]);}},
    {label:scenes.no,action:()=>{if(active())g.say('생활을 유지하며 살피자',[scenes.wrong]);}},
    {label:'기존 관찰',action:normal},
  ]);return true;
}
