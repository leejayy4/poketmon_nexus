import type { Engine } from './engine';
import type { MapId, SaveData, TrainerProfile } from './types';
import { SPECIES } from './pokemon';
import { isNexusCampaign, isNexusStarter } from './nexus-starters';
import { NEXUS_OPENING as F, trainerName, validTrainerProfile } from './nexus-opening-state';
import { sayField } from './field-scene';
import { withParticle } from './korean-text';

const deferredProfiles=new WeakSet<SaveData>();
/** Leave the modal without writing, so existing reports remain accessible. */
export function deferNexusProfile(g:Engine){
  if(g.panel!=='profile')return;
  deferredProfiles.add(g.save);g.panel='field';g.clearInput();
}

export function completeNexusProfile(g:Engine,profile:TrainerProfile):boolean {
  if(!isNexusCampaign(g.save)||g.save.flags[F.profile]||g.panel!=='profile'||g.dialogue||g.move||g.transition||!validTrainerProfile(profile))return false;
  g.save.trainer={...profile};g.save.flags[F.profile]=true;
  g.panel='field';g.clearInput();g.persist();return true;
}

/** Restart an unfinished introduction after reload, without persisting scene cursors. */
export function updateNexusOpening(g:Engine):boolean {
  if(!isNexusCampaign(g.save)||g.locked||g.move)return false;
  if(!g.save.flags[F.profile]){
    if(deferredProfiles.has(g.save))return false;
    g.panel='profile';g.clearInput();return true;
  }
  if(!g.save.flags[F.broadcast]){showOpeningBroadcast(g);return true;}
  return false;
}

function showOpeningBroadcast(g:Engine){
  const save=g.save;
  sayField(g,'TV 중계',[
    '신오리그 결승전의 마지막 순간.\n난천과 한카리아스가 서로를 바라본다.',
    '관중석의 함성이 방 안을 채운다.\n화면 속 두 친구는 오랫동안 함께한 듯하다.',
    `${trainerName(save)}도 오늘 떠난다.\n첫 동료와의 만남을 앞두고\n아래층에서 엄마가 부른다.`,
  ],()=>{save.flags[F.broadcast]=true;g.persist();});
}

export function handleNexusOpening(g:Engine,event:string):boolean {
  const save=g.save;
  if(!isNexusCampaign(save))return false;
  if(!save.flags[F.profile]){deferredProfiles.delete(save);g.panel='profile';g.clearInput();return true;}
  if(event==='tv'&&(save.map==='bedroom'||save.map==='home')){
    if(save.flags[F.broadcast])g.say('TV 중계',['신오리그 결승전의 녹화 방송이 흐른다.\n난천과 한카리아스가 나란히 서 있다.',save.flags.starterReceived?'처음 이 화면을 보던 때와 달리,\n지금은 곁에 함께할 동료가 있다.':'나도 곧 함께 여행할 친구를 만난다.']);
    else showOpeningBroadcast(g);
    return true;
  }
  if(event==='mom'&&save.map==='home'&&!save.flags[F.postcards]){
    if(!save.flags[F.broadcast]){showOpeningBroadcast(g);return true;}
    sayField(g,'엄마',[
      '이건 빈 엽서 네 장이야.\n한 지방에 한 장씩, 마음에 남은 걸 써 줘.',
      '꼭 이긴 이야기가 아니어도 괜찮아.\n어떤 풍경을 보고 누구를 만났는지,\n그런 이야기가 궁금하구나.',
      '첫 엽서에는 어떤 이야기가 담길까?',
    ],undefined,[
      {label:'새 친구 이야기',action:()=>givePostcards(1)},
      {label:'처음 보는 풍경',action:()=>givePostcards(2)},
      {label:'아직 모르겠어',action:()=>givePostcards(3)},
      {label:'잠깐만, 나중에 이야기할게',action:()=>{}},
    ]);
    function givePostcards(reply:number){
      if(save.flags[F.postcards])return;
      save.flags[F.postcards]=true;save.flags[F.reply]=reply;g.persist();
      g.say('엄마',['빈 엽서 네 장을 가방 안쪽에 넣었다.',
        '연구소에서 은솔박사님이 기다리고 계셔.\n집 앞길 위쪽, 파란 지붕의 건물이야.',
        '새 친구를 만나면 함께 들러 주렴.\n천천히 다녀와.']);
    }
    return true;
  }
  if(save.map!=='lab')return false;
  if(event==='assistant'){
    g.say('연구원',['박사님이 세 친구의 여행 준비를 마쳤어.\n먼저 은솔박사님과 이야기해 봐.',
      '함께 떠날 친구는 네가 만나서 정하면 돼.\n여기서는 서두를 필요 없어.']);return true;
  }
  if(event==='eeveeResearcher'){
    g.say('연구원 하린',[save.flags.starterReceived?'첫날부터 잘 맞는 팀이 될 필요는 없어.\n같이 걸으며 조금씩 알아가면 돼.':'손부터 뻗지 않아도 괜찮아.\n친구가 먼저 다가올 시간을 줘.',
      '오늘은 싸우기보다 같이 바깥으로 나가 보자.\n같은 길도 둘이 걸으면 다르게 보일 거야.']);return true;
  }
  if(event!=='professor'&&event!=='pokeballs')return false;
  if(!save.flags[F.postcards]){
    g.say('은솔박사',['어서 오너라. 엄마가 전해 줄 게 있다더구나.\n집에 들러 출발 인사를 나누고 오렴.']);return true;
  }
  if(save.flags.starterReceived){
    g.say('은솔박사',['새 친구와 천천히 밖으로 나가 보렴.\n엄마에게도 함께 인사하고.',
      '누군가에게 이기는 것보다 먼저,\n서로의 걸음을 알아 가면 좋겠구나.']);return true;
  }
  sayField(g,'은솔박사',[
    `${trainerName(save)}, 반갑구나.\n오늘은 세 친구를 소개하마.`,
    '새록은 풀잎을 살피는 걸 좋아하는\n작은 사슴 포켓몬이란다.',
    '잿울은 따뜻한 불씨를 품은\n늑대 포켓몬이지.',
    '포말이는 물결을 좋아하는 물범이야.\n세 친구 모두 여행할 준비가 되었단다.',
  ],()=>sayField(g,'연구원 하린',[
    '잠깐, 손부터 뻗지 않아도 괜찮아.\n누가 먼저 다가오는지 기다려 볼래?',
    '한 친구씩 바라보며 천천히 생각해 봐.\n마음이 끌리는 친구와 눈을 맞춰 보자.',
  ],()=>{
    if(save.flags.starterReceived)return;
    save.flags.professorMet=true;save.flags.professorIntroHeard=true;
    g.panel='starters';g.starterIndex=0;g.persist();
  }));
  return true;
}

/** Actual lab exit, not a menu read or elapsed timer, records the first shared walk. */
export function arriveNexusOpening(g:Engine,from:MapId){
  const save=g.save;
  if(!isNexusCampaign(save)||from!=='lab'||save.map!=='town'||save.flags[F.outside])return;
  const partner=save.party.find(p=>isNexusStarter(p.species)&&p.hp>0);
  if(!partner||!save.flags.starterReceived)return;
  save.flags[F.outside]=true;
  g.say('',[`${withParticle(SPECIES[partner.species].name,'과/와')} 연구소 밖으로 나왔다.`,
    '동료가 낯선 마을길을 바라본다.\n집에 함께 들러 엄마에게 소개해 주자.']);
}

export function nexusDepartureReady(g:Engine):boolean {
  if(!isNexusCampaign(g.save)||g.save.flags[F.outside])return true;
  g.say('이웃 도윤',['먼저 연구소에서 첫 동료를 만나렴.\n문을 나서며 함께 걷는 것부터 시작해 봐.']);return false;
}
