import type { Engine } from './engine';
import type { Choice,SaveData } from './types';

export const CASTELIA_COMPARISON={opened:'nexusCasteliaComparisonOpened',worker:'nexusCasteliaWorkerCompared',resident:'nexusCasteliaResidentCompared',preserved:'nexusCasteliaComparisonPreserved'} as const;
export const casteliaComparisonReady=(s:SaveData)=>Boolean(s.flags.nexusEcruteakOriginalsPublic&&s.flags.casteliaFieldCargo&&s.flags.casteliaFieldWorker&&s.flags.casteliaFieldRestMat&&s.flags.casteliaFieldAlley);
const ready=casteliaComparisonReady;
const sessions=new WeakMap<Engine,object>();
function context(g:Engine){
  const save=g.save,player=save.player,map=save.map,x=player.x,y=player.y,token={};sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===map&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token&&ready(save);
  const guide=(target:string,event?:string)=>()=>{if(active())g.setTourDestination(target,event);};
  const record=(flag:string,pages:string[],target:string,event?:string)=>{
    if(!active())return;
    g.say('원본과 현장 대조',pages,()=>{if(!active())return;if(!save.flags[flag]){save.flags[flag]=true;g.persist();}guide(target,event)();});
  };
  return {save,active,guide,record};
}

/** Public originals remain in Ecruteak. This records a local comparison, never possession or chapter completion. */
export function casteliaOriginalComparisonChoices(g:Engine):Choice[]{
  if(g.save.map!=='tour_castelia_hall'||!ready(g.save))return [];
  const {save,active,guide,record}=context(g),f=CASTELIA_COMPARISON;
  return [{label:save.flags[f.preserved]?'함께 남긴 대조 기록 보기':'인주 공개 기록과 전시 대조',action:()=>{
    if(!active())return;
    if(save.flags[f.preserved]){
      g.say('두 현장의 기록',['인주 원본은 전승시설 공개대에 보존되어 있다. 구름 수첩에는 비교한 항목과 현지 증언을 따로 남겼다.','화물을 옮기는 사람에게 넓은 길은 도움이 된다. 생활 골목에서 동료가 쉴 자리도 함께 살펴야 한다. 어느 한쪽의 말을 지우지 않았다.'],undefined,[{label:'4번도로를 거쳐 뇌문으로',action:guide('tour_unova_route_04')},{label:'전시를 더 본다',action:()=>{}}]);return;
    }
    if(!save.flags[f.opened]){
      g.say('전시의 선과 생활의 자리',['인주에서 펼쳐 본 원본에는 물을 받는 시각과 동료가 쉬는 자리가 남아 있었다. 원본은 지금도 그 공개대에 있다.','구름 발표의 넓은 운송선만으로 생활까지 설명할 수 있을까? 수첩의 대조 항목을 골라 실제 사람에게 다시 물어보자.'],undefined,[
        {label:'운송의 이익과 쉬는 자리를 함께 대조',action:()=>record(f.opened,['발표의 운송선 옆에 ‘누가 편리해졌는가’와 ‘동료는 어디서 쉬는가’를 나란히 적었다.','먼저 해안 직장인에게 넓어진 길의 실제 이익을 다시 물어보자.'],'tour_castelia','tourResident0')},
        {label:'넓은 길이면 모두 편리하다고 결론',action:()=>{if(active())g.say('아직 남은 질문',['인주에서도 평균만으로는 생활을 설명할 수 없었다. 사람마다 쓰는 길과 시간이 다르다. 두 현장의 말을 함께 들어 보자.']);}},
        {label:'나중에 대조한다',action:()=>{}},
      ]);return;
    }
    if(!save.flags[f.worker]||!save.flags[f.resident]){
      g.say('이어갈 현장 대조',['앞서 남긴 기록은 그대로다. 아직 대조하지 않은 사람에게 이어서 물어보자.'],undefined,[{label:'현장 증언으로',action:guide('tour_castelia',save.flags[f.worker]?'tourResident1':'tourResident0')},{label:'전시를 더 본다',action:()=>{}}]);return;
    }
    g.say('전시 옆 대조 수첩',['직장인은 화물 운반의 이익을, 주민은 동료의 휴식 자리와 생활 통로를 말했다. 서로 다른 경험이다.','인주 원본을 고쳐 쓰지 않고 구름에서 들은 두 증언을 각각 남길 수 있다.'],undefined,[
      {label:'두 증언을 출처별로 나란히 남기기',action:()=>record(f.preserved,['직장인의 말과 주민의 말을 구분해 적었다. 인주 공개 원본의 보관 장소도 함께 남겼다.','다음은 북쪽 4번도로를 지나 뇌문시티. 철도를 이용하는 사람의 경험은 그곳에서 직접 들어 보자.'],'tour_unova_route_04')},
      {label:'나중에 정리한다',action:()=>{}},
    ]);
  }}];
}

export function handleCasteliaOriginalWitness(g:Engine,event:string):boolean{
  if(g.save.map!=='tour_castelia'||!ready(g.save)||!g.save.flags[CASTELIA_COMPARISON.opened])return false;
  const f=CASTELIA_COMPARISON,s=g.save;
  if(event==='tourResident0'&&!s.flags[f.worker]){
    const {record}=context(g);record(f.worker,['직장인: 큰길로 나가는 수레가 서로 비켜 갈 수 있어요. 그 점은 실제로 좋아졌죠. 하지만 집 앞 사정까지 제가 대신 말할 수는 없어요.','운송 동선의 이익은 확인된 증언으로 남겼다. 골목을 쓰는 주민의 경험도 따로 들어 보자.'],'tour_castelia','tourResident1');return true;
  }
  if(event==='tourResident1'&&s.flags[f.worker]&&!s.flags[f.resident]){
    const {record}=context(g);record(f.resident,['주민: 화물을 나르기 쉬워졌다는 말도 맞아요. 그래도 우리 동료가 쉬는 자리는 별도로 있어야 해요. 화분 받침의 매트처럼 통로를 비우면서요.','주민의 말을 직장인의 말과 바꾸어 적지 않았다. 갤러리에서 두 증언을 전시 동선 옆에 놓고 비교하자.'],'tour_castelia_hall','tourCasteliaProjectExhibit');return true;
  }
  return false;
}
