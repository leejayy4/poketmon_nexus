import type { Engine } from './engine';
import type { SaveData } from './types';

type Stage=0|1|2;
type CartRun={save:SaveData;map:'oreburgh_gym';stage:0|1;right:boolean;started:number};
const runs=new WeakMap<Engine,CartRun>();
const DURATION=1.2;
const stageOf=(save:SaveData):Stage=>save.flags.gymCartStage===1?1:save.flags.gymCartStage===2?2:0;
const rightOf=(save:SaveData)=>save.flags.gymCartRight===true;
const pattern=(stage:Stage)=>stage===0?'줄무늬':'점무늬';
function activeRun(g:Engine):CartRun|undefined{
  const run=runs.get(g);
  if(run&&(g.save!==run.save||g.save.map!==run.map||g.battle||stageOf(g.save)!==run.stage||rightOf(g.save)!==run.right)){
    runs.delete(g);return undefined;
  }
  return run;
}
export function gymCartMoving(g:Engine):boolean{return !!activeRun(g);}
export function gymCartView(g:Engine):{stage:Stage;right:boolean;progress:number|null;targetRight:boolean}{
  const run=activeRun(g),stage=stageOf(g.save);
  return {stage,right:rightOf(g.save),progress:run?Math.max(0,Math.min(1,(g.clock-run.started)/DURATION)):null,targetRight:run?.right??rightOf(g.save)};
}
export function updateGymCart(g:Engine):void{
  const run=activeRun(g);if(!run||g.clock-run.started<DURATION)return;
  runs.delete(g);
  if(run.right!==(run.stage===1)){
    g.say('탄차 체험',['받침과 광물의 무늬가 달라요.\n탄차가 출발점으로 돌아왔어요.','관찰대에서 무늬를 확인하고\n레버를 바꿔 다시 보내 보세요.']);return;
  }
  g.save.flags.gymCartStage=run.stage+1;
  g.persist();
  g.say('탄차 체험',run.stage===0?[
    '줄무늬 광물이 왼쪽 받침에 도착!\n분류 1/2 · 다음 표본을 실었어요.',
    '오른쪽 바위의 관찰대에서\n다음 광물의 무늬를 확인해 보세요.'
  ]:[
    '점무늬 광물이 오른쪽 받침에 도착!\n분류 2/2 · 완료등이 켜졌어요.',
    '무늬를 관찰하고 길을 골랐군요!\n준비가 되면 강석에게 가 보세요.'
  ]);
}
export function handleGymCart(g:Engine,id:string):boolean{
  if(g.save.map!=='oreburgh_gym'||!['gymCartObserve','gymCartLever','gymCartLaunch'].includes(id))return false;
  if(g.battle||gymCartMoving(g))return true;
  const save=g.save,stage=stageOf(save);
  if(stage===2){g.say('탄차 체험',['분류 2/2 · 두 광물 모두 도착했어요.\n완료등이 환하게 켜져 있어요.']);return true;}
  if(id==='gymCartObserve'){
    g.say('광물 관찰대',[
      `현재 표본에는 ${pattern(stage)}가 보여요.\n왼쪽 받침은 줄무늬, 오른쪽은 점무늬.`,
      '왼쪽 바위의 레버로 선로를 바꾸고\n옆의 출발 버튼을 눌러 보세요.',
      '원하면 체험을 건너뛰어도 괜찮아요.\n가운데 길로 강석에게 갈 수 있어요.'
    ]);return true;
  }
  if(id==='gymCartLever'){
    save.flags.gymCartRight=!rightOf(save);g.persist();
    g.say('탄차 분기 레버',[
      `선로를 ${rightOf(save)?'오른쪽 · 점무늬':'왼쪽 · 줄무늬'} 받침으로 바꿨어요.`,
      '레버 옆 출발 버튼으로 탄차를 보내요.\n한 번 더 조사하면 방향이 바뀌어요.'
    ]);return true;
  }
  const right=rightOf(save);
  let consumed=false;
  g.say('탄차 출발 버튼',[
    `현재 선로: ${right?'오른쪽 · 점무늬':'왼쪽 · 줄무늬'} 받침\n탄차를 출발시킬까요?`
  ],undefined,[
    {label:'탄차를 보낸다',action:()=>{
      if(consumed||g.save!==save||save.map!=='oreburgh_gym'||g.battle||gymCartMoving(g)||stageOf(save)!==stage||rightOf(save)!==right)return;
      consumed=true;g.dialogue=null;g.clearInput();
      runs.set(g,{save,map:'oreburgh_gym',stage,right,started:g.clock});
    }},
    {label:'아직 보내지 않는다',action:()=>{consumed=true;}}
  ]);
  g.dialogue!.selected=1;
  return true;
}
