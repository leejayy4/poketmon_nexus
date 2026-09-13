import type { Engine } from './engine';

type CircuitState={protection:boolean;control:boolean};
const previews=new WeakMap<Engine,{save:Engine['save'];state:CircuitState}>();
export function cinnabarCircuitPreview(g:Engine):CircuitState{
  if(!g.dialogue||g.battle||g.save.map!=='tour_cinnabar_hall')previews.delete(g);
  const preview=previews.get(g);
  return preview?.save===g.save&&g.save.map==='tour_cinnabar_hall'?preview.state:{protection:true,control:true};
}

/** A public training model, independent of the adopted rescue story state. */
export function handleCinnabarCircuitModel(g:Engine,event:string):boolean{
  if(g.save.map!=='tour_cinnabar_hall'||event!=='tourExhibit1')return false;
  const save=g.save,current=()=>g.save===save&&save.map==='tour_cinnabar_hall'&&!g.battle;
  let protection=true,control=true;
  const close=()=>{if(current())previews.delete(g);};
  const show=()=>{
    if(!current())return;
    previews.set(g,{save,state:{protection,control}});
    g.say('지열 관측 장치 · 회로 모형',[
      '냉각 팬과 제어 신호등이 별도 회로로 연결된 연습 모형이다.\n냉각 팬을 살려 둔 채 제어 신호만 끊어 보자.',
      `보호 회로: ${protection?'켜짐 · 냉각 팬 회전':'꺼짐 · 냉각 팬 정지'}\n제어 회로: ${control?'켜짐 · 신호등 점등':'꺼짐 · 신호등 소등'}`,
      !protection?'팬까지 멈췄다. 보호 회로를 다시 켜야 한다.':control?'팬과 신호등이 함께 작동 중이다. 제어 회로를 살펴보자.':'팬은 계속 돌고 신호등만 꺼졌다. 결과를 확인해 보자.',
    ],undefined,[
      {label:protection?'보호 회로 끄기':'보호 회로 켜기',action:()=>{if(current()){protection=!protection;show();}}},
      {label:control?'제어 회로 끄기':'제어 회로 켜기',action:()=>{if(current()){control=!control;show();}}},
      {label:'결과 확인',action:()=>{
        if(!current())return;
        if(!protection||control){g.say('회로 모형',['냉각 팬이 돌고 제어 신호등은 꺼져 있어야 한다.\n두 회로를 다시 조작해 보자.'],show);return;}
        if(save.flags.cinnabarCircuitModelPracticed!==true){save.flags.cinnabarCircuitModelPracticed=true;g.persist();}
        g.say('회로 모형',['냉각을 유지하며 제어 신호만 분리했다.\n모든 전원을 끄는 것과 두 회로를 구분하는 것은 다르다.','연습 모형의 조작을 익혔다. 실제 설비에서는\n연결된 장치와 대피 경로를 먼저 확인해야 한다.'],undefined,[
          {label:'처음부터 다시 조작',action:()=>{if(current()){protection=true;control=true;show();}}},
          {label:'모형에서 물러나기',action:close},
        ]);
      }},
      {label:'조작 그만두기',action:close},
    ]);
  };
  show();return true;
}
