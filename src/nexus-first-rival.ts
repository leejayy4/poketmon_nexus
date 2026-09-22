import type { Engine } from './engine';
import type { Pokemon, SaveData } from './types';
import { createTrainerBattle, type Battle, type TurnResult } from './battle';
import { maxHpAtLevel } from './growth';
import { hasGrowthLearning, openGrowthLearning } from './growth-learning';
import { pokemonMoves, SPECIES } from './pokemon';
import { restorePp } from './move-pp';
import { isNexusCampaign } from './nexus-starters';
import { NEXUS_OPENING, trainerName } from './nexus-opening-state';
import { trainerWinFlag } from './trainer-flags';
import { sayField } from './field-scene';

export const NEXUS_FIRST_RIVAL_TRAINER='nexus-yujin-first';
export const NEXUS_FIRST_RIVAL={
  met:'nexusYujinMet',started:'nexusYujinBattleStarted',
  participated:'nexusYujinBattleParticipated',completed:'nexusYujinBattleCompleted',
  won:'nexusYujinBattleWon',
} as const;
const activeBattles=new WeakMap<Battle,SaveData>();

function canMeet(g:Engine):boolean {
  return isNexusCampaign(g.save)&&g.save.map==='town'&&g.save.flags[NEXUS_OPENING.outside]===true
    &&g.save.flags.departureCleared===true&&!g.battle&&!g.dialogue&&!g.move&&!g.transition&&g.panel==='field';
}

/** Optional first rivalry follows the real lab exit and departure supplies. */
export function meetNexusFirstRival(g:Engine):boolean {
  if(!canMeet(g))return false;
  const save=g.save,f=NEXUS_FIRST_RIVAL;
  if(save.flags[f.completed]){
    sayField(g,'유진',[
      save.flags[f.won]?'아까 네가 기술을 고르는 모습, 기억할게.\n다음에 만나면 나도 더 잘할 거야.':'다음엔 네가 어떤 기술을 고를지 궁금해.\n서로 새 친구도 많이 만나 보자.',
      '나는 잔모래 쪽으로 갈 거야.\n201번도로에서 서로 놓치면 센터에서 만나자.',
    ]);return true;
  }
  const offer=()=>{
    if(!canMeet(g)||g.save!==save||save.flags[f.completed])return;
    sayField(g,'유진',[
      '내 비버니와 첫 승부를 해 볼래?\n우리 둘 다 방금 여행을 시작했잖아.',
      '서두를 필요는 없어. 먼저 길을 둘러봐도 돼.\n겨룬 뒤에는 동료들을 쉬게 해 주자.',
    ],undefined,[
      {label:'첫 승부를 한다',action:()=>startFirstBattle(g,save)},
      {label:'먼저 길을 둘러본다',action:()=>{
        sayField(g,'유진',['좋아. 난 여기서 조금 더 준비할게.\n다시 생각나면 도윤 아저씨 곁으로 와.']);
      }},
    ]);
    if(g.dialogue)g.dialogue.selected=1;
  };
  if(save.flags[f.met]){offer();return true;}
  sayField(g,'이웃 도윤',[
    '풍향계 나사는 이제 단단히 조였단다.\n서쪽길로 나가기 전에 친구가 왔구나.',
  ],()=>sayField(g,'유진',[
    `${trainerName(save)}! 기다렸어.\n나도 오늘부터 신오리그에 도전할 거야.`,
    '챔피언이 되면 우승 인터뷰는 내가 할게.\n그 전에, 서로의 첫 배틀부터 기억해 두자.',
  ],()=>{
    save.flags[f.met]=true;g.persist();offer();
  }));
  return true;
}

function startFirstBattle(g:Engine,save:SaveData){
  const f=NEXUS_FIRST_RIVAL;
  if(g.save!==save||!canMeet(g)||save.flags[f.met]!==true||save.flags[f.completed])return;
  if(!save.party.some(partner=>partner.hp>0)){
    sayField(g,'유진',['먼저 동료를 쉬게 해 주자.\n집에서 회복하고 오면 기다리고 있을게.']);return;
  }
  // A known local neutral-type partner avoids choosing an unapproved rival starter.
  const species=399,level=5,maxHp=maxHpAtLevel(species,level);
  const opponent:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'유진의 첫 동료'};
  opponent.moves=['몸통박치기','울음소리'];
  const battle=createTrainerBattle(save,{id:NEXUS_FIRST_RIVAL_TRAINER,name:'유진',reward:0,team:[opponent]});
  if(!battle)return;
  save.flags[f.started]=true;
  g.battle=battle;activeBattles.set(battle,save);g.persist();
  g.say('유진',[`${SPECIES[species].name}, 같이 해 보자!\n${trainerName(save)}, 준비됐어?`]);
}

/** Called after battleTurn, before the engine's generic defeat/reward branches. */
export function finishNexusFirstRivalBattle(g:Engine,battle:Battle,turn:TurnResult):boolean {
  const save=g.save,f=NEXUS_FIRST_RIVAL;
  if(g.battle!==battle||activeBattles.get(battle)!==save||!isNexusCampaign(save)
    ||battle.kind!=='trainer'||battle.trainer?.id!==NEXUS_FIRST_RIVAL_TRAINER)return false;
  if(!turn.retry&&turn.outcome!=='escaped')save.flags[f.participated]=true;
  if(!battle.result||(turn.outcome!=='won'&&turn.outcome!=='lost'&&turn.outcome!=='escaped'))return false;
  if(save.flags[f.completed])return true;
  const won=turn.outcome==='won',cancelled=turn.outcome==='escaped';
  if(!cancelled){save.flags[f.completed]=true;save.flags[f.won]=won;}
  if(won)save.flags[trainerWinFlag(NEXUS_FIRST_RIVAL_TRAINER)]=true;
  // A friendly opening battle leaves no loss toll or exhausted party checkpoint.
  // Keep the gate and ordinary road journey; Sandgem is reached by walking.
  for(const partner of save.party){partner.hp=partner.maxHp;restorePp(partner,pokemonMoves(partner));}
  g.persist();
  const pages=turn.pages.map(page=>page.startsWith('유진에게 이겼다!')?'유진과의 첫 승부에서 이겼다!':page);
  let revision=0,closed=false;
  const close=()=>{
    if(closed||g.sceneRevision!==revision||g.save!==save||g.battle!==battle)return;
    closed=true;activeBattles.delete(battle);g.battle=null;g.battleFrames=null;g.grassSteps=0;g.clearInput();
    sayField(g,'유진',[
      cancelled?'좋아, 잠깐 쉬자.\n다시 겨루고 싶어지면 여기서 불러 줘.':won?'아, 졌다! 네 동료가 네 목소리를 듣고\n바로 움직이는 걸 봤어.':'비버니도 열심히 했네. 다음번에는\n네가 어떤 기술을 쓸지 기대할게.',
      '도윤이 구급 상자를 꺼내\n두 친구를 돌봤다.\nHP와 기술 횟수가 모두 회복되었다.',
      '201번도로를 지나면 잔모래마을이야.\n다음에는 거기 센터에서 함께 쉬자.',
    ],undefined,[
      ...(hasGrowthLearning(g,battle)?[{label:'새 기술을 살펴본다',action:()=>openGrowthLearning(g,battle)}]:[]),
      {label:'201번도로로 출발',action:()=>g.setTourDestination('tour_sinnoh_route_201')},
      {label:'마을에서 더 준비',action:()=>{}},
    ]);
    if(g.dialogue)g.dialogue.selected=g.dialogue.choices!.length-1;
  };
  g.say('',pages,close);revision=g.sceneRevision;g.battleFrames=turn.frames??null;
  return true;
}
