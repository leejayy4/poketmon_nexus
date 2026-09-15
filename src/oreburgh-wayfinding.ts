import type { TourOutdoors,TourSign } from './explore-outdoors';
import type { GameMap } from './types';

const SIGN_DATA:Array<Omit<TourSign,'pages'>>=[
  {x:4,y:10,direction:'left',destination:'tour_oreburgh_gate_1f',name:'무쇠게이트 1층',event:'oreburghWestGateSign'},
  {x:20,y:5,direction:'up',destination:'tour_sinnoh_route_207',name:'신오 207번도로',event:'oreburghNorth207Sign'},
  {x:20,y:39,direction:'down',destination:'tour_oreburgh_mine',name:'무쇠탄갱',event:'oreburghSouthMineSign'},
];

/** Rebuild signs after late route installers have moved and added Oreburgh exits. */
export function installOreburghWayfinding(map:GameMap,outdoors:TourOutdoors){
  const oldEvents=new Set(outdoors.signs.map(sign=>sign.event));
  const rows=map.walkable.map(row=>row.split(''));
  for(const sign of outdoors.signs)if(rows[sign.y]?.[sign.x]==='#')rows[sign.y][sign.x]='.';
  map.props=map.props.filter(prop=>!oldEvents.has(prop.dialogue));outdoors.signs=[];
  for(const data of SIGN_DATA){
    if(rows[data.y]?.[data.x]!=='.')continue;
    rows[data.y][data.x]='#';map.props.push({x:data.x,y:data.y,dialogue:data.event});
    outdoors.signs.push({...data,pages:[`${data.direction==='left'?'← 서쪽':data.direction==='up'?'↑ 북쪽':'↓ 남쪽'} 출구 → ${data.name}`,'표지 옆 큰길을 따라가면 도착합니다. 같은 길로 무쇠시티에 돌아올 수 있습니다.']});
  }
  map.props.push({x:24,y:16,dialogue:'oreburghCityDirectory'});rows[16][24]='#';
  map.walkable=rows.map(row=>row.join(''));
}
