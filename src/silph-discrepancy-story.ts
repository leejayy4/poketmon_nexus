import { SILPH_RECORDS_SECURED } from './silph-records-story';
import type { Engine } from './engine';

export const SILPH_DISCREPANCY_FLAG='nexusSilphDiscrepancyConfirmed';
export const SILPH_DISCREPANCY_MAP='tour_saffron_hall_2f' as const;
export const SILPH_DISCREPANCY_EVENT='saffronSilphSafetyDesk';
const sessions=new WeakMap<Engine,object>();

/** Adopted Nexus scene: public copies establish a discrepancy, never a rescue result. */
export function handleSilphDiscrepancyStory(g:Engine,event:string,publicDesk:()=>void):boolean{
  if(g.save.map!==SILPH_DISCREPANCY_MAP||event!==SILPH_DISCREPANCY_EVENT)return false;
  const save=g.save;
  const session={};sessions.set(g,session);
  const eligible=()=>Boolean(save.flags.researchDelivered&&save.flags.ferryPass);
  if(!eligible())return false;
  let open=true,readSafety=false,readDelivery=false;
  const active=()=>open&&sessions.get(g)===session&&g.save===save&&save.map===SILPH_DISCREPANCY_MAP&&!g.battle&&eligible();
  const close=()=>{open=false;readSafety=false;readDelivery=false;};
  const completed=()=>{
    if(!active())return;
    g.say('실프 자료 대조',[
      '공개 사용표는 보호 장치를 대피 구역에 사용한다고 설명하지만, 같은 장비의 납품 사본에는 비공개 제어 구역 반입으로 적혀 있다.',
      save.flags[SILPH_RECORDS_SECURED]?'기록실 원본에서도 홍련 반입과 별도 제어선 납품을 확인했다. 공개 사용표의 보호 기능과 제어 기능은 서로 다르다.':'불일치는 공개 사본으로 확인했다. 실제 용도와 반입 경위는 아직 밝혀지지 않았다.',
      save.flags[SILPH_RECORDS_SECURED]?'원본은 보존했다. 홍련 현장의 실제 사용 방식과 포켓몬의 안전은 현장에서 확인해야 한다.':'북동쪽 벽문으로 기록실에 들어가 반입 원본을 대조하자. 서가 양 끝을 돌면 북쪽 보관 구역에 닿는다.',
    ],undefined,[
      {label:save.flags[SILPH_RECORDS_SECURED]?'보존한 원본 다시 보기':'기록실 원본 대조대로',action:()=>{if(!active())return;close();g.setTourDestination('tour_saffron_records','tourSilphRecordsOriginalDesk');g.say('실프 기록실 안내',['이 층 북동쪽 벽문으로 들어간다. 기록실 남쪽 문으로 언제든 돌아올 수 있다.']);}},
      {label:'공개 시험대 살펴보기',action:()=>{if(!active())return;close();publicDesk();}},
      {label:'자료를 덮는다',action:close},
    ]);
  };
  const compare=()=>{
    if(!active())return;
    if(save.flags[SILPH_DISCREPANCY_FLAG]){completed();return;}
    if(!readSafety||!readDelivery){g.say('두 자료의 같은 장비',['사용표와 납품 사본을 모두 읽은 뒤 같은 장비의 용도와 반입 구역을 비교하자.'],menu);return;}
    g.say('어느 부분이 맞지 않을까?',['두 문서의 장비 이름은 같다. 사용 목적과 반입 구역을 짚어 보자.'],undefined,[
      {label:'대피용 장치가 제어 구역으로 반입됐다',action:()=>{
        if(!active()||!readSafety||!readDelivery||save.flags[SILPH_DISCREPANCY_FLAG])return;
        save.flags[SILPH_DISCREPANCY_FLAG]=true;g.persist();completed();
      }},
      {label:'장비 이름이 서로 다르다',action:()=>{if(!active())return;g.say('같은 장비 표기',['이름은 같다. 사용표의 사용 장소와 납품 사본의 반입 구역을 다시 읽어 보자.'],menu);}},
      {label:'다시 읽는다',action:menu},
      {label:'대조를 그만둔다',action:close},
    ]);
  };
  const menu=()=>{
    if(!active())return;
    if(save.flags[SILPH_DISCREPANCY_FLAG]){completed();return;}
    g.say('실프 공개 자료 대조',[
      '신오에서 전달한 조사 자료를 떠올리며 시험대 옆의 공개 사용표와 납품 기록 사본을 펼쳤다.',
      `공개 안전 사용표: ${readSafety?'확인함':'아직 읽지 않음'} · 납품 사본: ${readDelivery?'확인함':'아직 읽지 않음'}`,
    ],undefined,[
      {label:'공개 안전 사용표 읽기',action:()=>{if(!active())return;g.say('공개 안전 사용표',['장비: 포켓몬 보호 장치.','사용 목적: 대피 중인 포켓몬의 보호. 사용 장소: 대피 구역.'],()=>{if(!active())return;readSafety=true;menu();});}},
      {label:'납품 기록 사본 읽기',action:()=>{if(!active())return;g.say('납품 기록 사본',['장비: 포켓몬 보호 장치.','반입 구역: 비공개 제어 구역. 공개 사용표의 대피 구역과 다른 곳이다.'],()=>{if(!active())return;readDelivery=true;menu();});}},
      {label:'두 자료 대조하기',action:compare},
      {label:'대조를 그만둔다',action:close},
    ]);
  };
  if(save.flags[SILPH_DISCREPANCY_FLAG])completed();
  else g.say('실프 공개 시험대',['생활 장치 시험대 옆에 공개 안전 사용표와 납품 기록 사본이 놓여 있다.'],undefined,[
    {label:'공개 시험대 살펴보기',action:()=>{if(!active())return;close();publicDesk();}},
    {label:'두 자료를 직접 대조한다',action:menu},
    {label:'그대로 둔다',action:close},
  ]);
  return true;
}
