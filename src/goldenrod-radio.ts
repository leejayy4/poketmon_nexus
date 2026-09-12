import type { Engine } from './engine';
import { availableMoves,MOVE_RULES,pokemonMoves,RUNTIME_SPECIES,SPECIES } from './pokemon';
import { GOLDENROD_ROUTE } from './goldenrod-route';
import { GOLDENROD_STATION } from './goldenrod-station';
import { encounterPool } from './runtime-encounters';
import { encounterGuidance } from './encounter-guidance';
import type { SaveData,GameMap } from './types';
import type { TourInterior } from './explore-interiors';

const MARKET_PREPARED='goldenrodMarketPrepared';
const PASTURE_OBSERVED='goldenrodPastureObserved';
const PASTURE_SHARED='goldenrodPastureShared';
const ROUTE_34_ECOLOGY:Record<string,{species:number;place:string;trace:string}>={
  tourRoute34RiverGrass:{species:19,place:'강가 풀숲',trace:'물가로 이어진 작은 발자국과 갉은 풀잎이 있다.\n꼬렛이 먹이를 찾고 물을 마신 흔적 같다.'},
  tourRoute34BendGrass:{species:96,place:'굽이 풀숲',trace:'그늘진 풀이 둥글게 눌려 있다.\n낮 동안 졸음이 많은 슬리프가 쉬었을지도 모른다.'},
  tourRoute34PastureGrass:{species:19,place:'목장 가장자리',trace:'작은 이빨 자국 난 열매가 울타리 밖에 남았다.\n목장 먹이를 노린 꼬렛이 다녀간 흔적이다.'},
  tourRoute34ForestGrass:{species:96,place:'숲 문턱',trace:'짙은 그늘 아래 마른 잎이 둥글게 모였다.\n조용한 곳을 찾은 슬리프가 쉬어 간 흔적 같다.'},
};

function pastureActivityPages(save:SaveData):string[]{
  return [
    `시장 준비 · ${save.flags[MARKET_PREPARED]===true?'확인함':'아직'}\n목장 관찰 · ${save.flags[PASTURE_OBSERVED]===true?'기록함':'아직'}`,
    save.flags[PASTURE_OBSERVED]===true?'목장지기와 파치리스가 울타리 곁을 살피고,\n시장으로 보낼 바구니를 함께 준비했다.':'금빛 남쪽 시장에서 준비한 뒤\n34번도로 목장 울타리를 직접 살펴보자.',
    save.flags[PASTURE_SHARED]===true?'이 현지 소식은 라디오 체험에서 정리했다.\n보상 없이 여행 수첩에 남는 생활 기록이다.':'관찰 뒤 라디오 타워 1층에서\n목장 현지 소식으로 정리할 수 있다.',
  ];
}

export function installGoldenrodRadioFloors(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>){
  const production=rooms.tour_goldenrod_hall_2f;
  production.objects[0].kind='console';production.objects[0].name='방송 원고 책상';
  production.objects[0].pages=['동료를 소개할 원고를 준비하는 책상이다.\n만난 장소와 몸 상태를 살펴볼 수 있다.'];
  production.greeting=['동료와 만난 이야기를 원고로 준비해요.\n실제 체험 녹음은 1층 조정석에서 해요.'];
  maps.tour_goldenrod_hall_2f.npcs[0].name='방송 제작 안내원';
  const lounge=rooms.tour_goldenrod_hall_3f;
  lounge.objects[2].name='34번도로 여행 수첩';
  lounge.objects[2].pages=['34번도로에서 만난 동료를\n파티와 박스 기록에서 살펴본다.'];
  lounge.greeting=['여행 수첩에서 현지 동료를 살펴보세요.\n다음 길은 금빛 남쪽 34번도로입니다.'];
}

export function route34RecordPages(save:SaveData):string[]{
  const owned=[...save.party,...save.box??[]];
  return (encounterPool(GOLDENROD_ROUTE)?.slots??[]).map(slot=>{
    const name=SPECIES[slot.speciesId].name;
    const local=owned.filter(mon=>mon.species===slot.speciesId&&mon.met==='성도 34번도로');
    const recorded=save.pokedex?.caught.includes(slot.speciesId)||owned.some(mon=>mon.species===slot.speciesId);
    return `${name}\n${local.length?'34번도로에서 만난 동료 '+local.length+'마리':recorded?'도감에 포획 기록 있음 · 현지 동료 없음':'아직 포획 기록 없음'}`;
  });
}

export function route34EcologyPages(save:SaveData):string[]{
  const wild=(encounterPool(GOLDENROD_ROUTE)?.slots??[]).map(slot=>SPECIES[slot.speciesId].name);
  return [
    `야생 조우 기록 · ${wild.length?wild.join(' · '):'현재 조우 풀 없음'}\n34번도로의 선택 풀밭에서 만날 수 있다.`,
    '생활 포켓몬 · 시장의 알통몬 · 목장의 파치리스\n주민과 함께 일하거나 산책하는 동료다.',
    '생활 포켓몬은 이 장소의 야생 조우 풀이 아니다.\n관찰 활동이 포획이나 도감 획득을 대신하지 않는다.',
    save.flags[PASTURE_OBSERVED]===true?'목장 생활 관찰 완료\n파치리스와 목장지기의 공동 작업을 기록했다.':'목장 생활 관찰 전\n남쪽 울타리에서 파치리스의 생활을 살펴보자.',
  ];
}

export function route34TrainingPages(save:SaveData):string[]{
  const pool=encounterPool(GOLDENROD_ROUTE),levels=pool?.levels??[22,24];
  const pages:string[]=[];
  for(const slot of pool?.slots??[]){
    const species=SPECIES[slot.speciesId],natural=(RUNTIME_SPECIES[slot.speciesId]?.learnset??[]).filter(entry=>entry.level<=levels[1]);
    const moves=natural.map(entry=>{
      const rule=MOVE_RULES[entry.move],power=rule?.power?` · 위력 ${rule.power}`:' · 변화';
      return `${entry.move}(${rule?.type??'타입 미상'}${power})`;
    });
    pages.push(`${species.name} · Lv.${levels[0]}~${levels[1]} 포획 범위\n34번도로 선택 풀밭에서 만날 수 있다.`);
    for(let i=0;i<moves.length;i+=2){
      const part=moves.slice(i,i+2);
      pages.push(`${species.name} 레벨 기술 ${Math.floor(i/2)+1}/${Math.ceil(moves.length/2)}\n${part.join('\n')}`);
    }
    const local=[...save.party,...save.box??[]].filter(mon=>mon.species===slot.speciesId&&mon.met==='성도 34번도로');
    if(local.length)for(const mon of local){
      const current=pokemonMoves(mon),options=availableMoves(mon,save).filter(move=>!current.includes(move));
      for(let i=0;i<current.length;i+=2)pages.push(`${species.name} Lv.${mon.level} · 현재 기술 ${Math.floor(i/2)+1}/${Math.ceil(current.length/2)}\n${current.slice(i,i+2).join(' · ')}`);
      if(options.length)for(let i=0;i<options.length;i+=2)pages.push(`${species.name} · 준비 가능 ${Math.floor(i/2)+1}/${Math.ceil(options.length/2)}\n${options.slice(i,i+2).join(' · ')}`);
      else pages.push(`${species.name} Lv.${mon.level} · 준비 가능\n새 후보 없음`);
    }else pages.push(`${species.name} 현지 동료 없음\n포획하지 않아도 도로와 생활 활동은 진행할 수 있다.`);
  }
  return pages;
}

export function route34TacticsPages(save:SaveData):string[]{
  const pages=[
    '34번도로 동료는 숲 여행의 선택지다.\n특정 종을 포획하지 않아도 큰길과 기존 파티로 진행할 수 있다.',
  ];
  for(const speciesId of [19,96]){
    const species=SPECIES[speciesId],stats=RUNTIME_SPECIES[speciesId]?.stats;
    if(!stats)continue;
    const role=speciesId===19
      ?`공격 ${stats.attack} · 스피드 ${stats.speed}\n빠르게 물기·필살앞니로 먼저 압박하는 물리 역할`
      :`특수방어 ${stats.specialDefense} · 스피드 ${stats.speed}\n염동력으로 싸우며 특수 공격을 받아 내는 역할`;
    const local=[...save.party,...save.box??[]].filter(mon=>mon.species===speciesId&&mon.met==='성도 34번도로');
    pages.push(`${species.name} · ${role}`);
    pages.push(local.length
      ?`현지 ${species.name} ${local.length}마리 보유\n숲 출발 전 센터 회복과 기술 구성을 확인하자.`
      :`${species.name} 없이도 진행 가능\n현재 파티의 회복·공격 기술을 확인하고 숲으로 가자.`);
  }
  const ilex=encounterPool('tour_ilex');
  pages.push(...(ilex?encounterGuidance('tour_ilex').pages:['현재 숲 안쪽의 별도 야생 조우는 준비 전이다.\n34번도로 동료가 없어도 표시 길로 이동할 수 있다.']),'숲에서는 안전한 표시 길과 풀밭을 구분하고\n필요하면 금빛센터로 같은 길을 돌아올 수 있다.');
  return pages;
}

/** A local radio rehearsal uses current party facts and never grants story rewards. */
export function handleGoldenrodRadio(g:Engine,event:string):boolean{
  const upper=g.save.map;
  if(upper==='tour_goldenrod_center'&&event==='goldenrod_centerDetail3'){
    const save=g.save,current=()=>g.save===save&&save.map==='tour_goldenrod_center'&&!g.battle;
    const injured=save.party.filter(mon=>mon.hp<mon.maxHp).length,local=[...save.party,...save.box??[]].filter(mon=>[19,96].includes(mon.species)&&mon.met==='성도 34번도로');
    g.say('34번도로 출발 안내판',[
      `파티 ${save.party.length}마리 · 회복 필요 ${injured}마리\n34번도로 출신 동료 ${local.length}마리`,
      ...route34TacticsPages(save),
    ],undefined,[
      {label:'간호사에게 회복 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_center','nurse');}},
      {label:'PC에서 동료 준비',action:()=>{if(current())g.setTourDestination('tour_goldenrod_center','tourExhibit1');}},
      {label:'기술 준비 작업방',action:()=>{if(current())g.setTourDestination('tour_goldenrod_home2','tourHost');}},
      {label:'34번도로로 출발',action:()=>{if(current())g.setTourDestination(GOLDENROD_ROUTE);}},
      {label:'안내판 닫기',action:()=>{}},
    ]);return true;
  }
  if(upper==='tour_ilex'&&event==='tourGuide'){
    const save=g.save,current=()=>g.save===save&&save.map==='tour_ilex'&&!g.battle;
    g.say('너도밤나무숲 안내원',[
      '북쪽 34번도로는 금빛시티로,\n동쪽 숲길은 고동마을로 이어집니다.',
      ...route34TacticsPages(save),
      '특정 동료가 없어도 표시된 길을 따라갈 수 있어요.\n다쳤다면 북쪽 길로 금빛센터에 돌아가세요.',
    ],undefined,[
      {label:'금빛센터로 돌아가기',action:()=>{if(current())g.setTourDestination('tour_goldenrod_center','nurse');}},
      {label:'34번도로 관찰 기록',action:()=>{if(current())g.setTourDestination(GOLDENROD_ROUTE,'tourRoute34Pasture');}},
      {label:'고동마을로 계속 가기',action:()=>{if(current())g.setTourDestination('tour_azalea');}},
      {label:'숲을 더 둘러보기',action:()=>{}},
    ]);return true;
  }
  if((upper==='tour_goldenrod_hall_2f'&&['tourHost','tourDetail3_4'].includes(event))||(upper==='tour_goldenrod_hall_3f'&&['tourHost','tourDetail3_9'].includes(event))){
    const save=g.save,current=()=>g.save===save&&save.map===upper&&!g.battle;
    const pages=upper.endsWith('2f')?[
      '방송 원고에 동료와 만난 장소를 적어요.\n오늘 함께 걷는 친구들을 살펴볼까요?',
      ...save.party.map(mon=>`${SPECIES[mon.species].name} · Lv.${mon.level}\n${mon.met} · HP ${mon.hp}/${mon.maxHp}`),
      ...pastureActivityPages(save),...route34EcologyPages(save),...route34TrainingPages(save),
      '준비가 끝나면 1층 조정석에서\n소개 주제를 골라 체험해 보세요.',
    ]:[...encounterGuidance(GOLDENROD_ROUTE).pages,...route34RecordPages(save),...route34EcologyPages(save),...route34TrainingPages(save),...pastureActivityPages(save)];
    g.say(upper.endsWith('2f')?'방송 원고 준비':'34번도로 여행 수첩',pages,undefined,[
      {label:'1층 방송 체험 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_hall','tourExhibit0');}},
      {label:'목장 현지 기록 보기',action:()=>{if(current())g.say('34번도로 생태·생활 기록',[...route34EcologyPages(save),...pastureActivityPages(save)]);}},
      {label:'34번 동료 기술 보기',action:()=>{if(current())g.say('34번도로 동료 육성',route34TrainingPages(save));}},
      {label:'숲 여행 전술 보기',action:()=>{if(current())g.say('너도밤나무숲 준비',route34TacticsPages(save));}},
      {label:'34번도로 안내',action:()=>{if(current())g.setTourDestination(GOLDENROD_ROUTE);}},
      {label:'수첩 덮기',action:()=>{}},
    ]);return true;
  }
  if(g.save.map===GOLDENROD_STATION&&event==='tourHost'){
    const save=g.save;
    const guide=(target:'tour_goldenrod'|'tour_goldenrod_hall'|'tour_goldenrod_center'|typeof GOLDENROD_ROUTE,action?:string)=>()=>{
      if(g.save===save&&save.map===GOLDENROD_STATION&&!g.battle)g.setTourDestination(target,action);
    };
    g.say('금빛역 안내원',[
      '금빛시티에 오신 것을 환영합니다.\n아래 현관이 금빛 거리로 이어집니다.',
      '노랑행 열차는 오른쪽 위 열린 문입니다.\n운임 없이 동료들과 왕복할 수 있어요.',
      '도시에서 쉬거나 방송 체험을 해 보세요.\n남쪽 34번도로는 너도밤나무숲으로 이어져요.',
      ...pastureActivityPages(save),
    ],undefined,[
      {label:save.flags[MARKET_PREPARED]===true?'남쪽 시장 기록 확인':'남쪽 시장에서 준비',action:guide('tour_goldenrod','tourResident0')},
      {label:'라디오 타워 안내',action:guide('tour_goldenrod_hall','tourExhibit0')},
      {label:'포켓몬센터 안내',action:guide('tour_goldenrod_center','nurse')},
      {label:'34번도로 안내',action:guide(GOLDENROD_ROUTE)},
      {label:'이야기 마치기',action:()=>{}},
    ]);return true;
  }
  if(g.save.map==='tour_goldenrod'&&event==='tourGuide'){
    const save=g.save,current=()=>g.save===save&&save.map==='tour_goldenrod'&&!g.battle;
    const guide=(target:Parameters<Engine['setTourDestination']>[0])=>()=>{if(current())g.setTourDestination(target);};
    g.say('금빛시티 안내원',[
      '남쪽은 34번도로를 지나\n너도밤나무숲과 고동마을로 이어집니다.',
      '북쪽 도라지 방향은 본래 35번도로·자연공원·36번도로를 지납니다.\n현재는 한 연결도로입니다.',
      '동쪽 인주 방향은 본래 35번도로부터 36·37번도로를 함께 지납니다.\n현재는 별도의 한 연결도로입니다.',
      '서쪽 금빛역에서는 노랑시티행 열차를\n운임 없이 왕복할 수 있습니다.',
    ],undefined,[
      {label:'남쪽 34번도로',action:guide(GOLDENROD_ROUTE)},
      {label:'북쪽 도라지 방향',action:guide('tour_pass_goldenrod_violet')},
      {label:'동쪽 인주 방향',action:guide('tour_pass_goldenrod_ecruteak')},
      {label:'서쪽 금빛역',action:guide(GOLDENROD_STATION)},
      {label:'안내 마치기',action:()=>{}},
    ]);return true;
  }
  if(g.save.map==='tour_goldenrod'&&['tourResident0','tourResident1','tourResident2','tourResident3','tourResident4'].includes(event)){
    const save=g.save,current=()=>g.save===save&&save.map==='tour_goldenrod'&&!g.battle;
    const travel=(target:'tour_goldenrod_center'|'tour_goldenrod_mart'|'tour_goldenrod_hall',action:string)=>()=>{if(current())g.setTourDestination(target,action);};
    if(event==='tourResident0'){
      const hurt=save.party.filter(p=>p.hp<p.maxHp).length;
      g.say('시장 주민',[
        hurt?`다친 동료가 ${hurt}마리 있구나.\n남쪽 숲길에 가기 전에 센터에서 쉬렴.`:'남쪽 34번도로로 떠나는 길이니?\n상점에서 볼과 상처약을 챙겨 가렴.',
        `몬스터볼 ${save.inventory.pokeBalls}개 · 상처약 ${save.inventory.potions}개\nPC에서 동료를 바꾸고 출발해도 좋아.`,
      ],undefined,[
        {label:save.flags[MARKET_PREPARED]===true?'목장 관찰 준비 확인':'목장 관찰 준비',action:()=>{
          if(!current())return;
          const first=save.flags[MARKET_PREPARED]!==true;if(first){save.flags[MARKET_PREPARED]=true;g.persist();g.audio.play('confirm');}
          g.say('남쪽 시장 여행 준비',[first?'도시락 가게와 목장 배달 장부를 살폈다.\n34번도로로 떠날 준비를 기록했다.':'시장 준비 기록이 남아 있다.\n34번도로 목장 울타리를 살펴보자.',...pastureActivityPages(save)]);
        }},
        {label:'상점까지 안내',action:travel('tour_goldenrod_mart','martClerk')},{label:'센터까지 안내',action:travel('tour_goldenrod_center','nurse')},{label:'인사하고 떠나기',action:()=>{}}
      ]);
    }else if(event==='tourResident1'){
      g.say('라디오 청취자',[
        '동료와 만난 이야기를 듣는 게 좋아.\n같은 포켓몬도 여행 이야기는 다르잖아.',
        ...route34RecordPages(save),
        '라디오 타워 1층 조정석에 가 봐.\n함께 걷는 동료를 소개할 수 있어.',
      ],undefined,[{label:'방송 체험 안내',action:travel('tour_goldenrod_hall','tourExhibit0')},{label:'이야기 마치기',action:()=>{}}]);
    }else if(event==='tourResident2'){
      g.say('선로를 바라보는 여행자',['저 선로는 금빛역에서 노랑시티로 이어져.','서쪽 역에 들어가 노선표를 확인하면\n열차 문과 금빛 거리 현관을 찾을 수 있어.'],undefined,[
        {label:'금빛역 노선표 안내',action:()=>{if(current())g.setTourDestination(GOLDENROD_STATION,'tourStationBoard');}},
        {label:'이야기 마치기',action:()=>{}},
      ]);
    }else if(event==='tourResident3'){
      g.say('34번도로 숲지기',['포장이 끝나는 곳부터 34번도로의 긴 길이 시작돼.','강가와 목장 곁의 풀밭을 살핀 뒤\n남쪽 너도밤나무숲 문턱으로 내려가렴.'],undefined,[
        {label:'34번도로 안내',action:()=>{if(current())g.setTourDestination(GOLDENROD_ROUTE);}},
        {label:'센터부터 들르기',action:travel('tour_goldenrod_center','nurse')},
        {label:'계속 걷기',action:()=>{}},
      ]);
    }else{
      g.say('시장 일을 돕는 알통몬',['알통!\n텃밭에서 옮긴 바구니를 내려놓고 숨을 고른다.','상인을 돌아보고 다시 힘차게 팔을 들었다.\n사람과 포켓몬이 함께 꾸리는 시장이다.'],undefined,[
        {label:'상점 안내 보기',action:travel('tour_goldenrod_mart','martClerk')},
        {label:'인사하고 떠나기',action:()=>{}},
      ]);
    }
    return true;
  }
  if(g.save.map===GOLDENROD_ROUTE&&['tourGuide','tourRoute34Sign'].includes(event)){
    const save=g.save,current=()=>g.save===save&&save.map===GOLDENROD_ROUTE&&!g.battle;
    g.say(event==='tourGuide'?'숲길 여행자':'34번도로 이정표',[
      '↑ 북쪽 금빛시티\n↓ 남쪽 너도밤나무숲 · 고동마을',
      ...encounterGuidance(GOLDENROD_ROUTE).pages,
      '큰길과 강가 산책길은 풀밭을 피해 가.\n강가와 남쪽 목장 곁의 긴 풀에서 동료를 만날 수 있어.',
      '새 동료를 만나면 금빛 라디오에서\n어디서 만났는지 소개해 봐.',
      ...route34EcologyPages(save),
      ...route34TacticsPages(save),
    ],undefined,[
      {label:'금빛센터 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_center','nurse');}},
      {label:'굽이 트레이너 안내',action:()=>{if(current())g.setTourDestination(GOLDENROD_ROUTE,'tourRoute34Trainer');}},
      {label:'숲 여행 전술 보기',action:()=>{if(current())g.say('너도밤나무숲 준비',route34TacticsPages(save));}},
      {label:'라디오 타워 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_hall','tourExhibit0');}},
      {label:'계속 걷기',action:()=>{}},
    ]);return true;
  }
  if(g.save.map===GOLDENROD_ROUTE&&event==='tourRoute34Keeper'){
    const save=g.save,current=()=>g.save===save&&save.map===GOLDENROD_ROUTE&&!g.battle;
    g.say('34번도로 목장지기',[
      '이 남쪽 초지는 금빛 시장으로 물건을 보내는 작은 목장이야.',
      '울타리 밖 긴 풀에는 꼬렛과 슬리프가 살아.\n큰길에서 지켜보다 만날 준비가 되면 들어가렴.',
      '더 남쪽으로 가면 나무 그늘이 짙어지고\n너도밤나무숲의 북쪽 문턱에 닿아.',
    ],undefined,[
      {label:'금빛 시장으로 돌아가기',action:()=>{if(current())g.setTourDestination('tour_goldenrod','tourResident0');}},
      {label:'너도밤나무숲으로 출발',action:()=>{if(current())g.setTourDestination('tour_ilex');}},
      {label:'목장길 더 둘러보기',action:()=>{}},
    ]);return true;
  }
  if(g.save.map===GOLDENROD_ROUTE&&event==='tourRoute34Pasture'){
    const save=g.save,first=save.flags[PASTURE_OBSERVED]!==true;
    if(first){save.flags[PASTURE_OBSERVED]=true;g.persist();g.audio.play('confirm');}
    g.say('34번도로 목장 관찰',[
      save.flags[MARKET_PREPARED]===true?'시장 배달 장부에서 본 울타리다.\n바구니를 옮긴 작은 발자국이 길까지 이어진다.':'낮은 울타리 안쪽에 목장 바구니가 놓였다.\n금빛 시장과 오가는 표시가 붙어 있다.',
      '목장지기가 길을 살피는 동안 파치리스가\n울타리 기둥을 오르내리며 주변을 확인한다.',
      first?'사람과 포켓몬이 함께 일하는 모습을 기록했다.\n금빛 라디오 타워에서 현지 소식으로 정리해 보자.':'이미 관찰한 생활 기록이다.\n라디오 타워에서 현지 소식을 다시 볼 수 있다.',
    ]);return true;
  }
  if(g.save.map===GOLDENROD_ROUTE&&event==='tourRoute34Pokemon'){
    g.say('목장 옆 파치리스',[
      '파치파치!\n울타리 기둥을 오르내리며 길을 살핀다.',
      '야생 조우를 기다리는 포켓몬은 아닌 듯하다.\n목장지기가 부르자 큰길 옆으로 돌아왔다.',
    ]);return true;
  }
  const ecology=ROUTE_34_ECOLOGY[event];
  if(g.save.map===GOLDENROD_ROUTE&&ecology){
    const save=g.save,current=()=>g.save===save&&save.map===GOLDENROD_ROUTE&&!g.battle;
    const species=SPECIES[ecology.species],owned=[...save.party,...save.box??[]],local=owned.filter(mon=>mon.species===ecology.species&&mon.met==='성도 34번도로');
    g.say(ecology.place,[
      ecology.trace,
      `${species.name} · 34번도로 야생 조우종\n현지에서 만난 동료 ${local.length}마리`,
      local.length?'이미 함께한 동료의 기술과 몸 상태를\n금빛 주택과 라디오에서 살펴볼 수 있다.':'포획은 선택이다. 큰길로 지나가도 되며\n관찰 기록만으로 포획·도감 획득이 되지 않는다.',
      ...route34TrainingPages(save).filter(page=>page.startsWith(species.name)),
    ],undefined,[
      ...(local.length?[{label:'동료 기술 준비 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_home2','tourHost');}},{label:'라디오 현지 기록 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_hall','tourExhibit0');}}]:[]),
      {label:'금빛센터 안내',action:()=>{if(current())g.setTourDestination('tour_goldenrod_center','nurse');}},
      {label:'계속 관찰하기',action:()=>{}},
    ]);return true;
  }
  if(g.save.map!=='tour_goldenrod_hall'||!['tourExhibit0','tourHost'].includes(event))return false;
  const save=g.save,current=()=>g.save===save&&save.map==='tour_goldenrod_hall'&&!g.battle;
  const menu=()=>{
    if(!current())return;
    g.say('금빛 라디오',['여행자와 포켓몬의 이야기를 담는\n체험 방송석입니다.','동료를 소개하는 짧은 녹음을 해 보세요.\n녹음 뒤에는 남쪽 숲길도 안내해 드려요.'],undefined,[
      {label:'동료 소개 녹음',action:()=>select(0)},
      {label:save.flags[PASTURE_OBSERVED]===true?'목장 현지 소식 정리':'목장 현지 소식 확인',action:()=>{
        if(!current())return;
        if(save.flags[PASTURE_OBSERVED]!==true){g.say('목장 현지 소식',['아직 34번도로 목장 관찰 기록이 없어요.\n남쪽 목장 울타리를 살펴보고 돌아와 주세요.'],menu);return;}
        const first=save.flags[PASTURE_SHARED]!==true;if(first){save.flags[PASTURE_SHARED]=true;g.persist();g.audio.play('confirm');}
        g.say('금빛 라디오 · 목장 현지 소식',[...route34EcologyPages(save),...route34TrainingPages(save),...pastureActivityPages(save),'시장과 도로의 생활을 이어 본 기록입니다.\n도구·돈·포켓몬·진행 보상은 바뀌지 않습니다.'],menu);
      }},
      {label:'34번도로 관찰 기록',action:()=>{if(current())g.say('34번도로 동료 기록',[...encounterGuidance(GOLDENROD_ROUTE).pages,...route34RecordPages(save),...route34EcologyPages(save),'박스의 동료도 함께 확인했어요.\n소개하려면 센터 PC에서 데려와 주세요.'],menu);}},
      {label:'숲 여행 전술',action:()=>{if(current())g.say('너도밤나무숲 준비',route34TacticsPages(save),menu);}},
      {label:'34번도로 안내',action:()=>{if(current()){g.setTourDestination(GOLDENROD_ROUTE);g.say('여행 안내',['금빛 남쪽 출구 → 34번도로\n→ 너도밤나무숲 → 고동마을','아래 지도에 34번도로까지 표시했어요.\n떠나기 전에 센터와 상점에 들러 보세요.']);}}},
      {label:'체험 마치기',action:()=>{}},
    ]);
  };
  const select=(page:number)=>{
    if(!current())return;
    if(!save.party.length){g.say('방송 담당자',['소개할 동료가 아직 없네요.\n파트너와 함께 다시 찾아와 주세요.'],menu);return;}
    g.say('오늘의 여행 동료',['마이크 앞에 함께 설 동료를 골라 주세요.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:SPECIES[mon.species].name,action:()=>{
        if(!current()||!save.party.includes(mon))return;
        const name=SPECIES[mon.species].name;
        g.say('방송 원고 확인',[`오늘 함께한 동료는 ${name}!\n${mon.met}에서 만났습니다.`,`현재 Lv.${mon.level} · ${SPECIES[mon.species].types.join(' / ')} 타입\n어떤 여행 이야기를 전할까요?`],undefined,[
          {label:'함께한 만남 소개',action:()=>record('만남')},
          {label:'다음 숲길 여행 소개',action:()=>record('여행')},
          {label:'다시 고르기',action:()=>select(page)},
        ]);
        function record(topic:'만남'|'여행'){
          if(!current()||!save.party.includes(mon))return;
          g.audio.play('confirm');
          g.say('체험 방송 · 녹음 중',[
            '마이크 표시등이 켜졌다.\n동료와 나란히 서서 이야기를 시작했다.',
            topic==='만남'?`저와 함께 여행하는 ${name}입니다.\n${mon.met}에서 만났어요.`:`오늘은 ${name}와 함께\n34번도로를 지나 숲으로 향합니다.`,
            mon.hp<mon.maxHp?'떠나기 전에 센터에서 쉬려고 해요.\n친구의 몸 상태도 챙겨야 하니까요.':'길에서 쉬어 가며 주변을 살펴볼 거예요.\n다음 마을에서도 함께 걷고 싶어요.',
          ],()=>{if(current())g.say('체험 방송 · 다시 듣기',[
            `${name}와 함께한 목소리가\n방송석 스피커에서 흘러나왔다.`,
            '짧은 녹음 체험이 끝났습니다.\n동료와 다음 여행도 즐겁게 다녀오세요!',
          ],menu);});
        }
      }})),
      ...(save.party.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>select(page?0:1)}]:[]),
      {label:'돌아가기',action:menu},
    ]);
  };
  menu();return true;
}
