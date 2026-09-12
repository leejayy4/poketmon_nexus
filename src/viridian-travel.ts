import type { Engine } from './engine';
import type { MapId } from './types';
import { getMap } from './maps';
import { placeById, TOUR_NEIGHBORS } from './explore-world';
import { tourMapRoute } from './explore-navigation';

/** Existing destinations only; choosing a route never moves or rewards the player. */
export function handleViridianTravel(g:Engine,id:string):boolean{
  if(g.save.map!=='tour_viridian_hall'||!['tourHost','tourExhibit1'].includes(id))return false;
  const save=g.save,current=()=>g.save===save&&save.map==='tour_viridian_hall'&&!g.battle;
  const guide=(target:MapId,event?:string)=>()=>{
    if(!current())return;
    g.setTourDestination(target,event);
  };
  if(id==='tourHost'){
    const town=getMap('tour_viridian',save.flags);
    const center=town.warps.find(w=>w.to.endsWith('_center'));
    const mart=town.warps.find(w=>w.to.endsWith('_mart'));
    g.say('시설 안내원',[
      save.party.some(p=>p.hp<p.maxHp)?'다친 친구가 있군요.\n센터에서 쉬고 여행을 준비해요.':'숲에서 만난 친구들과\n다음 여행을 준비해 볼까요?',
      `몬스터볼 ${save.inventory.pokeBalls}개 · 상처약 ${save.inventory.potions}개\n센터 PC에서는 박스 친구를 데려와요.`,
    ],undefined,[
      ...(center?[{label:'센터로 안내',action:guide(center.to,'nurse')}]:[]),
      ...(mart?[{label:'상점으로 안내',action:guide(mart.to,'martClerk')}]:[]),
      {label:'다음 여행 고르기',action:()=>{if(current())handleViridianTravel(g,'tourExhibit1');}},
      {label:'돌아가기',action:()=>{}},
    ]);return true;
  }
  const targets=TOUR_NEIGHBORS('tour_viridian').filter(target=>placeById(target)?.region==='관동'&&tourMapRoute('tour_viridian',target,save.flags).length>1);
  g.say('상록 여행 지도',['갈 길을 고르면 아래 지도에\n문과 출구까지의 길이 표시된다.','북쪽 숲에서 다시 동료를 만나거나\n다른 관동 마을로 여행을 이어 가자.'],undefined,[
    ...targets.map(target=>({label:placeById(target)!.name+' 안내',action:guide(target)})),
    {label:'지도 접기',action:()=>{}},
  ]);return true;
}
