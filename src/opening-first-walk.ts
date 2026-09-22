import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { withParticle } from './korean-text';
import { trainerName } from './nexus-opening-state';
import { sayField } from './field-scene';

export function introduceOpeningPartner(g:Engine):boolean{
  const save=g.save;
  if(save.map!=='home'||save.flags.departureCleared||save.flags.openingPartnerIntroduced||!save.party.length)return false;
  const mon=save.party[0],name=SPECIES[mon.species].name;
  g.healParty();g.persist();
  sayField(g,'엄마',[`이 친구가 ${name}구나.\n${withParticle(trainerName(save),'과/와')} 함께 와 줘서\n반갑다!`,
    '밖으로 나갈 날을 기다렸지?\n처음부터 멀리 갈 필요는 없단다.',
    '집 앞에서 네 걸음만 천천히 걸어 보렴.\n그다음 서쪽 길목의 도윤 아저씨에게 가 보자.',
  ],()=>{
    if(g.save!==save||save.map!=='home'||g.battle||save.flags.departureCleared||save.flags.openingPartnerIntroduced)return;
    save.flags.openingPartnerIntroduced=true;
    save.flags.openingWalkSpecies=mon.species;
    save.flags.openingWalkSteps=0;g.persist();
  });return true;
}

/** Called only after a completed player tile step, never on a timer or warp. */
export function stepOpeningWalk(g:Engine):boolean{
  const s=g.save,p=s.player;
  if(s.map!=='town'||!s.flags.openingPartnerIntroduced||s.flags.openingWalkCompleted||s.flags.departureCleared||g.battle)return false;
  if(p.x<6||p.x>13||p.y<25||p.y>28)return false;
  const mon=s.party.find(m=>m.species===s.flags.openingWalkSpecies&&m.hp>0);
  if(!mon)return false;
  const n=Math.min(4,Number(s.flags.openingWalkSteps??0)+1);
  s.flags.openingWalkSteps=n;
  if(n<4){g.persist();return false;}
  s.flags.openingWalkCompleted=true;g.persist();g.clearInput();
  g.say('',[`${withParticle(SPECIES[mon.species].name,'과/와')} 집 앞길을 천천히 걸었다.`,
    '혼자 다니던 마을길이 조금 다르게 느껴진다.\n이제 서쪽 길목의 도윤 아저씨를 만나 보자.']);
  return true;
}
