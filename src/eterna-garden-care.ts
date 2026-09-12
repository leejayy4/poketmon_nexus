import type { Engine } from './engine';
import type { GameMap } from './types';
import type { TourOutdoors } from './explore-outdoors';
import { SPECIES } from './pokemon';

export const ETERNA_NURSERY_NAME='숲지기들의 묘목밭';
export const ETERNA_POOL_NAME='남쪽 수로의 얕은 못';
export const ETERNA_NURSERY_EVENT='eternaNurseryCare';
export const ETERNA_POOL_EVENT='eternaNurseryWater';
const SLOT='eternaGardenPartnerSlot',SPECIES_FLAG='eternaGardenPartner';
const CARED='eternaGardenSaplingCare',WATERED='eternaGardenWaterChecked';

/** Give the two expanded-city landmarks stable activity events. */
export function installEternaGardenCare(map:GameMap,outdoors:TourOutdoors){
  for(const [name,event] of [[ETERNA_NURSERY_NAME,ETERNA_NURSERY_EVENT],[ETERNA_POOL_NAME,ETERNA_POOL_EVENT]] as const){
    const object=outdoors.objects.find(item=>item.name===name);if(!object)continue;
    const previous=object.event,keys=new Set(object.cells.map(cell=>`${cell.x},${cell.y}`));
    object.event=event;
    for(const prop of map.props)if(prop.dialogue===previous&&keys.has(`${prop.x},${prop.y}`))prop.dialogue=event;
  }
}

/** Optional daily-life activity; it never grants rewards or gates travel. */
export function handleEternaGardenCare(g:Engine,event:string):boolean{
  if(g.save.map!=='tour_eterna'||![ETERNA_NURSERY_EVENT,ETERNA_POOL_EVENT].includes(event))return false;
  const save=g.save,current=()=>g.save===save&&save.map==='tour_eterna'&&!g.battle;
  const selected=()=>{
    const slot=save.flags[SLOT],mon=typeof slot==='number'?save.party[slot]:undefined;
    return mon&&mon.species===save.flags[SPECIES_FLAG]?mon:undefined;
  };
  const choose=(page=0)=>{
    if(!current())return;
    if(!save.party.length){g.say('묘목밭 관리판',['함께 걸을 동료가 생기면\n묘목 사이 흙길을 살펴보자.']);return;}
    g.say('묘목밭 관리판',['묘목을 돌볼 동료를 골라 주세요.\n건강한 동료와 천천히 걸어요.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:SPECIES[mon.species].name,action:()=>{
        if(!current()||!save.party.includes(mon))return;
        if(mon.hp<=0){g.say('묘목밭 관리판',['이 동료는 먼저 센터에서 쉬어야 해요.\n회복한 뒤 다시 함께 걸어요.']);return;}
        save.flags[SLOT]=save.party.indexOf(mon);save.flags[SPECIES_FLAG]=mon.species;save.flags[CARED]=true;save.flags[WATERED]=false;
        g.persist();g.audio.play('confirm');
        g.say(ETERNA_NURSERY_NAME,[`${SPECIES[mon.species].name}와 묘목 사이를 걸었다.\n마른 잎과 쓰러진 작은 가지를 골랐다.`,'이제 남쪽 수로의 얕은 못에서\n묘목으로 이어지는 물길을 확인해 보자.']);
      }})),
      ...(save.party.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>choose(page?0:1)}]:[]),
      {label:'다음에 돌보기',action:()=>{}},
    ]);
  };
  if(event===ETERNA_NURSERY_EVENT){
    const mon=selected();
    if(save.flags[WATERED]&&mon){g.say(ETERNA_NURSERY_NAME,[`${SPECIES[mon.species].name}와 살펴본 묘목이다.\n수로에서 흐른 물이 흙을 촉촉하게 했다.`,'꽃밭을 밟지 않도록 비워 둔 길로\n동료들이 조용히 오가고 있다.']);return true;}
    choose();return true;
  }
  const mon=selected();
  if(!save.flags[CARED]||!mon){g.say(ETERNA_POOL_NAME,['얕은 못에서 작은 물길이 갈라진다.\n먼저 서쪽 묘목밭 관리판을 살펴보자.']);return true;}
  if(mon.hp<=0){g.say(ETERNA_POOL_NAME,[`${SPECIES[mon.species].name}은 지금 지쳐 있다.\n센터에서 쉬고 물길을 확인하자.`]);return true;}
  if(save.flags[WATERED]){g.say(ETERNA_POOL_NAME,[`${SPECIES[mon.species].name}와 확인한 물길이다.\n낙엽이 걸리지 않게 가장자리를 비워 두었다.`]);return true;}
  g.say(ETERNA_POOL_NAME,[`${SPECIES[mon.species].name}와 얕은 물가를 살펴보았다.\n물은 나무다리 아래에서 묘목밭 쪽으로 흐른다.`,'떠내려온 잎을 가장자리로 옮기자\n막혔던 작은 물길이 다시 이어졌다.'],()=>{
    if(!current()||selected()!==mon||mon.hp<=0)return;
    save.flags[WATERED]=true;g.persist();g.audio.play('confirm');
    g.say('묘목 돌봄 기록',['묘목밭과 남쪽 수로를 함께 살폈다.\n정원 주민에게 이야기해 보자.','이 활동은 체육관이나 이동 조건이 아니다.\n다른 동료와 다시 둘러봐도 좋다.']);
  });return true;
}
