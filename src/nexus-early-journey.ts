import type { Engine } from './engine';
import type { SaveData } from './types';
import type { Battle, TurnResult } from './battle';
import { SPECIES } from './pokemon';
import { sayField } from './field-scene';
import { NEXUS_FIRST_RIVAL } from './nexus-first-rival';
import { NEXUS_EARLY as F, earlyPartners, hasSandgemSupply, isEarlyPartner, nexusEarlyReady } from './nexus-early-state';

function partnerAdvice(g:Engine){
  const save=g.save,partner=earlyPartners(save)[0];
  if(!partner){catchingLesson(g,'유진');return;}
  const inParty=save.party.includes(partner);
  sayField(g,'유진',[
    `${partner.met}에서 만난\n${SPECIES[partner.species].name}도 이제 여행 동료구나!`,
    inParty?'메뉴의 포켓몬에서 동료를 고르고\n「선두로」를 누르면 먼저 출전해.':'그 친구는 지금 PC 박스에 있어.\n오른쪽 PC에서 파티로 데려올 수 있어.',
    '배틀 중 「포켓몬」에서 교대할 수 있어.\n상대를 쓰러뜨리면 그 상대와 싸운\n건강한 동료들이 경험치를 나눠 받아.',
    '레벨이 오르면 HP가 늘고 기술도 배워.\n기술이 네 개라면 배틀 뒤에\n배울 기술을 골라 봐.',
    '포획 자체에는 경험치가 붙지 않아.\n잡은 직후에는 HP나 기술 횟수가\n줄어 있을 수 있으니 회복도 부탁하자.',
  ],undefined,[
    {label:inParty?'파티를 살펴본다':'PC 위치를 확인한다',action:()=>{
      save.flags[F.reviewed]=true;g.persist();
      if(inParty){g.panel='party';g.partyIndex=save.party.indexOf(partner);}
      else g.setTourDestination('tour_sandgem_center','tourExhibit1');
    }},
    {label:'이야기를 마친다',action:()=>{save.flags[F.reviewed]=true;g.persist();}},
    {label:'나중에 다시 듣는다',action:()=>{}},
  ]);
}

function catchingLesson(g:Engine,speaker:string){
  const save=g.save;
  sayField(g,speaker,[
    '잔모래 북쪽 202번도로에 나가면\n오른쪽 첫 풀밭에서\n야생 포켓몬을 만날 수 있어.',
    '배틀의 「가방」에서 몬스터볼을 골라 봐.\nHP를 줄이면 잡기 쉬워져.\n쓰러뜨리면 그 포켓몬은 잡을 수 없어.',
    '동료가 너무 강하면 공격하기 전에\n몬스터볼을 던져도 돼.\n위험하면 「도망」을 골라도 괜찮아.',
    '다른 트레이너의 포켓몬은\n잡을 수 없어.',
    '잡은 포켓몬은 파티로 들어오고,\n이미 여섯 마리라면 PC 박스로 가.\n둘 다 찼다면 먼저 자리를 비워 줘.',
    save.badges.length?'HP와 기술 횟수는\n센터에서 회복할 수 있어.':'첫 배지 전에는 잔모래 센터에서\n몬스터볼 5개·상처약 2개까지 보충해 줘.\n부족해지면 남쪽으로 돌아오자.',
  ],()=>{
    save.flags[F.lesson]=true;g.persist();
    sayField(g,speaker,['직접 풀밭을 둘러봐도 되고,\n흙길을 따라 축복시티로 먼저 가도 돼.'],undefined,[
      {label:'202번도로로 향한다',action:()=>g.setTourDestination('tour_sinnoh_route_202')},
      {label:'여기서 더 준비한다',action:()=>{}},
    ]);
  });
}

function reunionChoices(g:Engine){
  const owned=earlyPartners(g.save).length>0;
  sayField(g,'유진',[
    g.save.flags[F.partnerBattled]?'새로 만난 동료와 배틀도 해 봤구나.\n다음에는 어떤 기술을 배우게 될까?':
      owned?'함께 걷는 친구가 늘었네.\n이번 길에서 만난 동료 이야기도 들려줘.':
      '난 여기서 비버니를 돌보고 있어.\n너도 출발 전에 동료를 살펴봐.',
  ],undefined,[
    {label:owned?'새 동료와 파티 이야기':'야생 포켓몬 잡는 법',action:()=>owned?partnerAdvice(g):catchingLesson(g,'유진')},
    {label:'회복과 보급 안내',action:()=>sayField(g,'유진',[
      '위쪽 카운터에서 간호사에게 말해 봐.\nHP와 모든 기술 횟수를 회복해 줘.\n쓰러지면 돌아올 센터도 여기로 바뀌어.',
      hasSandgemSupply(g.save)?'첫 배지 전에는 몬스터볼 5개와\n상처약 2개까지 무료로 보충해 줘.':'회복은 언제든 부탁할 수 있어.\n도구는 출발 전에 상점에서 준비하자.',
    ])},
    {label:'다음 길과 돌아오는 길',action:()=>sayField(g,'유진',[
      '마을 북쪽은 202번도로,\n그 길의 북쪽 끝이 축복시티야.',
      '집에 가려면 마을 서쪽 201번도로로 가.\n호숫길은 도중에 북쪽으로 갈라져.\n돌아오는 길에도 이 센터에서 만나자.',
    ],undefined,[
      {label:'축복시티 방향 표시',action:()=>g.setTourDestination('tour_jubilife')},
      {label:'새잎마을 방향 표시',action:()=>g.setTourDestination('town')},
      {label:'계속 쉬어 간다',action:()=>{}},
    ])},
    {label:'이야기를 마친다',action:()=>{}},
  ]);
}

export function handleNexusEarlyJourney(g:Engine,event:string):boolean {
  if(!nexusEarlyReady(g.save)||g.battle||g.dialogue||g.move||g.transition||g.panel!=='field')return false;
  if(g.save.map==='tour_sinnoh_route_202'&&event==='route202Sign'){
    sayField(g,'202번도로 안내',['북쪽: 축복시티 · 남쪽: 잔모래마을\n잔모래 쪽 첫 풀밭은 길의 동쪽에 있다.'],undefined,[
      {label:'포획 안내를 읽는다',action:()=>catchingLesson(g,'포획 안내')},
      {label:'길을 계속 간다',action:()=>{}},
    ]);return true;
  }
  if(g.save.map!=='tour_sandgem_center'||event!=='tourExhibit2')return false;
  const save=g.save,rival=NEXUS_FIRST_RIVAL;
  if(save.flags[F.reunion]){reunionChoices(g);return true;}
  const memory=save.flags[rival.completed]
    ?save.flags[rival.won]?'첫 승부에서 네가 고른 기술, 기억나.\n다음엔 나도 쉽게 지지 않을 거야.':'우리 첫 승부, 나도 많이 배웠어.\n다음엔 서로 더 잘할 수 있겠지?'
    :save.flags[rival.met]?'마을에서 헤어진 뒤로 잘 왔네.\n승부는 서두르지 않아도 괜찮아.':'너도 여행을 시작했구나! 난 유진이야.\n비버니와 신오리그에 도전하러 가.';
  sayField(g,'유진',[
    '여기야! 201번도로는 어땠어?\n나는 비버니와 잠깐 쉬어 가려고.',memory,
    '회복은 간호사에게 말을 걸어 부탁해.\n오른쪽 PC에서는 동료를\n맡기거나 데려올 수 있어.',
    '다음 길은 마을 북쪽 202번도로야.\n길에서 새로운 친구도 만나 보자.',
  ],()=>{save.flags[F.reunion]=true;save.flags[rival.met]=true;g.persist();reunionChoices(g);});
  return true;
}

/** Called only by the actual nurse service, after HP/PP restoration. */
export function recordSandgemCare(save:SaveData):boolean {
  if(!nexusEarlyReady(save)||save.map!=='tour_sandgem_center'||!save.party.length)return false;
  save.flags[F.rested]=true;
  if(!hasSandgemSupply(save))return false;
  save.inventory.pokeBalls=Math.max(5,save.inventory.pokeBalls);
  return true;
}

/** The ordinary battle owns capture/XP. This records only its actual results. */
export function recordNexusEarlyBattle(save:SaveData,battle:Battle,turn:TurnResult):void {
  if(!nexusEarlyReady(save)||!['tour_sinnoh_route_201','tour_sinnoh_route_202'].includes(save.map)
    ||battle.special||turn.retry)return;
  if(battle.kind==='wild'&&battle.result&&turn.outcome==='caught')save.flags[F.caught]=true;
  if(turn.outcome==='won'&&battle.result&&battle.defeatedOpponentParticipants?.some(isEarlyPartner))save.flags[F.partnerBattled]=true;
}
