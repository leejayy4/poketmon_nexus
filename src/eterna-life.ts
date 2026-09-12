import type { Engine } from './engine';
import { gardeniaPreparationPages } from './gardenia-preparation';
import { adventureObjective } from './adventure-guide';
import { GYMS } from './gyms';

import { ETERNA_CLOCK,ETERNA_CLOCK_PAGES } from './eterna-clock-art';
import { handleEternaGardenCare } from './eterna-garden-care';

export function handleEternaLife(g:Engine,event:string):boolean{
  if(g.save.map!=='tour_eterna')return false;
  if(handleEternaGardenCare(g,event))return true;
  const s=g.save,current=()=>g.save===s&&s.map==='tour_eterna'&&!g.battle;
  if(event===ETERNA_CLOCK.event){
    const pages=[...ETERNA_CLOCK_PAGES];
    if(s.flags.researchDelivered)pages[2]='이 기록은 장막 자료와 함께 전달됐다.\n이미 끝낸 전달을 다시 할 필요는 없다.';
    g.say('시계 관측 기록판',pages);return true;
  }
  if(event==='tourResident0'){
    g.say('정원 주민',[s.flags.eternaGardenWaterChecked?'묘목밭의 물길을 열어 주었구나.\n함께 걸은 동료도 수고했어.':s.flags.eternaSurveyCompared?'답사를 마쳤구나. 이끼와 뿌리를\n남겨 둔 길을 눈여겨보았겠지.':'삐삐가 꽃을 밟지 않도록\n산책길 가장자리를 함께 돌보지.',
      '동쪽 수로에서 남쪽 정원까지 걸어 보렴.\n돌담 끝에는 옛 시계 기록도 걸어 두었어.']);return true;
  }
  if(event==='tourPokemon'){
    g.say('정원의 삐삐',['삐삐!\n꽃밭 가장자리에서 가볍게 발을 구른다.',
      s.party.some(p=>p.hp<=0)?'지친 동료 쪽으로 고개를 기울였다.\n센터에서 쉬었다 돌아오자.':'다가오는 동료를 보고 귀를 움직인다.\n꽃밭을 피해 산책길 쪽으로 몸을 돌린다.']);return true;
  }
  if(event!=='sinnohGuide')return false;
  const guide=(map:Parameters<Engine['setTourDestination']>[0],text:string)=>()=>{
    if(!current())return;g.setTourDestination(map);g.say('영원 여행 안내',[text,'아래 지도에 목적지를 표시했어요.\n표지와 길을 따라 걸어가세요.']);
  };
  const objective=adventureObjective(s);
  const nextGym=GYMS.find(gym=>gym.id===objective?.id);
  g.say('도시 안내원',['영원숲 북쪽길을 지나 오셨군요.\n영원에서는 쉬며 동료를 돌봐 주세요.',
    s.badges.includes('BADGE-GS02')?(nextGym?`${nextGym.name}에게 도전할 차례예요.\n아래 안내에서 목적지를 확인하세요.`:`다음 여행: ${objective?.title??'주변 둘러보기'}\n아래 안내에서 목적지를 확인하세요.`):'역사관 동쪽에 숲 경계 산책길이 있어요.\n체육관에 가기 전 보급도 잊지 마세요.'],undefined,[
    {label:'센터에서 쉬기',action:guide('tour_eterna_center','도시 서쪽 포켓몬센터에서\n동료를 회복하고 PC를 이용할 수 있어요.')},
    {label:'상점에서 준비',action:guide('tour_eterna_mart','남쪽 주택가 상점에서\n몬스터볼과 상처약을 준비하세요.')},
    {label:s.badges.includes('BADGE-GS02')?'유채 정원 다시 보기':'유채 도전 준비',action:()=>{if(current())g.say('체육관 준비',gardeniaPreparationPages(s),()=>{if(current())g.setTourDestination('eterna_gym');});}},
    {label:'역사관 답사',action:guide('tour_eterna_hall','역사관의 옛 지도에서 동료를 골라\n석상과 동쪽 돌담을 답사할 수 있어요.')},
    {label:objective&&s.badges.includes('BADGE-GS02')?'다음 여행 목적지':'천관산 방향 확인',action:guide(objective&&s.badges.includes('BADGE-GS02')?objective.map:'tour_eterna_coronet_approach',objective&&s.badges.includes('BADGE-GS02')?`다음 여행: ${objective.title}\n목적지까지 이어지는 길을 표시할게요.`:'북쪽 출구는 천관산 영원 입구길이에요.\n현재 축약 여행에서는 산 하부로 이어져요.')},
    {label:'안내 마치기',action:()=>{}}
  ]);return true;
}
