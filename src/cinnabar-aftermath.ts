import type { Engine } from './engine';
import { CINNABAR_SHORE_HANDOFF,CINNABAR_SHORE_EVENT,cinnabarAllHandedOver } from './cinnabar-evacuation-state';
import { CINNABAR_CONTROL_SEPARATED } from './cinnabar-rescue-work';

export const CINNABAR_IAN_CONTACT='nexusCinnabarIanContactConfirmed';
export const CINNABAR_CONTACT_MAP='tour_cinnabar_hall' as const;
export const CINNABAR_CONTACT_EVENT='tourHost';
export const CINNABAR_NEXT_STATION='tour_goldenrod_station' as const;
const sessions=new WeakMap<Engine,object>();

/** The existing researcher provides a contact point while retaining the public activity. */
export function handleCinnabarAftermath(g:Engine,event:string,publicResearch:()=>void):boolean{
  const save=g.save;
  if(save.map!==CINNABAR_CONTACT_MAP||event!==CINNABAR_CONTACT_EVENT||!save.flags[CINNABAR_SHORE_HANDOFF]){sessions.delete(g);return false;}
  const token={},player=save.player;sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===CINNABAR_CONTACT_MAP&&!g.battle&&sessions.get(g)===token&&Boolean(save.flags[CINNABAR_SHORE_HANDOFF]&&save.flags.nexusSilphRecordsSecured&&save.flags[CINNABAR_CONTROL_SEPARATED])&&cinnabarAllHandedOver(save.flags);
  const close=()=>{if(sessions.get(g)===token)sessions.delete(g);};
  const travel=()=>{
    if(!active())return;
    g.say('성도 금빛으로 가는 길',[
      '이안이 알려 준 성도 복원 사업의 연결을 살피러 금빛으로 간다. 노랑의 기존 열차를 타면 금빛역에 도착한다.',
      '수로와 도로를 돌아가는 길: 홍련 → 20번수로·쌍둥이섬 → 19번수로 → 연분홍.',
      '연분홍 → 18번·17번·16번도로 → 무지개 → 7번도로 → 노랑.',
      '노랑 → 금빛역은 무료 왕복 열차다. 금빛역 남쪽 현관으로 나가면 금빛시티다. 이번 연락을 듣기 전에도 열차는 이용할 수 있다.',
    ],undefined,[
      {label:'금빛역을 목적지로',action:()=>{if(active())g.setTourDestination(CINNABAR_NEXT_STATION);}},
      {label:'먼저 20번수로로',action:()=>{if(active())g.setTourDestination('tour_kanto_route_20');}},
      {label:'해안의 동료들에게',action:()=>{if(active())g.setTourDestination('tour_cinnabar',CINNABAR_SHORE_EVENT);}},
      {label:'연구소에 머문다',action:close},
    ]);
  };
  const contact=()=>{
    if(!active())return;
    if(save.flags[CINNABAR_IAN_CONTACT]){
      g.say('이안과 남긴 연락 기록',['이안은 홍련 반입 원본의 장비 계통이 성도의 복원 사업과 이어진다고 확인했다.','보호 기능과 별도의 제어 기능을 구분한 기록을 다음 조사에도 가져가기로 했다. 성도 현장의 상황은 직접 확인해야 한다.'],undefined,[{label:'금빛으로 가는 길',action:travel},{label:'기록을 덮는다',action:close}]);return;
    }
    g.say('연구소에서 이안에게',[
      '연구원이 보존한 반입 원본을 펼치고 이안에게 연락을 연결했다.',
      '이안: 홍련에 들어간 장비의 납품 기록을 확인했어. 같은 계통의 장비가 성도 복원 사업에도 이어져 있어.',
      '이안: 보호 장치와 제어선이 함께 있었다는 점을 잊지 말자. 도움이 된 기능과 포켓몬을 억누른 기능을 따로 봐야 해.',
      '이안: 금빛을 다음 거점으로 삼자. 복원 사업이 현지에서 어떻게 쓰이는지 직접 확인해야겠어.',
    ],undefined,[
      {label:'원본과 현장 결과를 함께 전달한다',action:()=>{
        if(!active()||save.flags[CINNABAR_IAN_CONTACT])return;
        g.say('이안과의 연락',['실프 원본을 보존했고, 홍련의 보호 전원을 남긴 채 제어 신호를 분리했다고 전했다. 두 포켓몬은 해안에서 인계했다.','이안은 세 결과를 구분해 받아 적었다. 성도의 복원 사업과 비교할 다음 조사 약속을 남겼다.'],()=>{
          if(!active()||save.flags[CINNABAR_IAN_CONTACT])return;save.flags[CINNABAR_IAN_CONTACT]=true;g.persist();travel();
        });
      }},
      {label:'자료를 더 살펴보고 연락한다',action:close},
    ]);
  };
  if(!active())return false;
  g.say('돌봄·기록 담당 연구원',[
    '피카츄와 알통몬은 유진 곁의 안전한 해안에서 쉬고 있어요. 연구진은 두 친구의 호흡과 먹이, 휴식 시간을 살피는 일부터 맡았어요.',
    '반입 원본은 훼손하지 않고 보존해요. 보호 전원을 남긴 일, 제어 신호를 분리한 일, 개체를 인계한 일을 따로 적고 있어요.',
    '화산암 관찰과 동료 기술 준비, 공개 회로 모형도 계속 이용할 수 있어요.',
  ],undefined,[
    {label:save.flags[CINNABAR_IAN_CONTACT]?'이안 연락 기록 다시 보기':'이안에게 원본을 대조해 연락한다',action:contact},
    {label:'기존 화산암 연구',action:()=>{if(!active())return;close();publicResearch();}},
    {label:'해안 돌봄 자리로',action:()=>{if(active())g.setTourDestination('tour_cinnabar',CINNABAR_SHORE_EVENT);}},
    {label:'지금은 쉬어 간다',action:close},
  ]);return true;
}
