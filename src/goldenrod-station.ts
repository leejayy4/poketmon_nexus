import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourInterior } from './explore-interiors';
import type { TourOutdoors } from './explore-outdoors';
import { TRANSIT_LINKS } from './journey-world';

export const GOLDENROD_STATION='tour_goldenrod_station' as const;

/** Preserve both cities' outdoor exits and return points while inserting a station. */
export function installGoldenrodStation(w:{places:Place[];maps:Record<TourId,GameMap>;rooms:Record<string,TourInterior>;parents:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>}){
  TRANSIT_LINKS[GOLDENROD_STATION]=['tour_saffron','tour_goldenrod'];
  const city=w.places.find(p=>p.id==='tour_goldenrod')!;
  const goldenrod=w.maps[city.id],saffron=w.maps.tour_saffron;
  const outward=goldenrod.warps.find(exit=>exit.to==='tour_saffron')!;
  const inward=saffron.warps.find(exit=>exit.to===city.id)!;
  const cityReturn={...inward.spawn},saffronReturn={...outward.spawn};
  const room:TourInterior={style:'terminal',title:'금빛역 · 노랑행 승강장',host:{x:6,y:15},greeting:[
    '노랑시티와 금빛시티를 잇는 역입니다.\n동료들과 함께 무료로 이용하세요.',
    '오른쪽 위의 열린 열차 문으로 가면\n노랑시티로 이동합니다.',
    '금빛 거리로 나가려면 아래 현관으로,\n방송 체험은 라디오 타워로 가세요.',
  ],objects:[
    {x:4,y:12,w:3,h:1,kind:'chart',name:'노랑행 노선 안내',event:'tourStationBoard',pages:['금빛역 ↔ 노랑시티\n운임 없음 · 동료와 함께 왕복 가능','열차 문: 오른쪽 위\n금빛 거리: 아래 현관']},
    {x:4,y:17,w:5,h:1,kind:'bench',name:'동료와 쉬는 대합 의자',event:'tourStationBench',pages:['의자 옆에는 포켓몬이 쉴 자리도 있다.\n짐을 내려놓고 떠날 곳을 살펴본다.']},
  ]};
  const rows=Array.from({length:22},(_,y)=>Array.from({length:28},(_,x)=>x>=2&&x<=25&&y>=9&&y<=19||x===14&&y>=20?'.':'#'));
  const props:GameMap['props']=[];
  for(const o of room.objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){rows[y][x]='#';props.push({x,y,dialogue:o.event});}
  w.maps[GOLDENROD_STATION]={id:GOLDENROD_STATION,name:room.title,width:28,height:22,background:GOLDENROD_STATION,walkable:rows.map(row=>row.join('')),
    warps:[{x:14,y:21,to:city.id,spawn:cityReturn,entry:'down',facing:inward.facing},{x:22,y:9,to:'tour_saffron',spawn:saffronReturn,entry:'up',facing:outward.facing}],
    npcs:[{id:'tourHost',name:'역 안내원',sprite:'worker',...room.host,facing:'right',dialogue:'tourHost'}],props};
  w.rooms[GOLDENROD_STATION]=room;w.parents[GOLDENROD_STATION]=city;w.spawns[GOLDENROD_STATION]={x:14,y:19};
  outward.to=GOLDENROD_STATION;outward.spawn={x:14,y:19};outward.facing='up';
  inward.to=GOLDENROD_STATION;inward.spawn={x:22,y:10};inward.facing='down';
  const sign=w.outdoors[city.id].signs.find(s=>s.destination==='tour_saffron')!;
  sign.destination=GOLDENROD_STATION;sign.name='금빛역 · 노랑행';
  sign.pages=['← 서쪽 금빛역\n노랑시티행 열차 · 무료 왕복','역 안 오른쪽 위의 열차 문으로 가세요.\n금빛 거리로 돌아오는 현관은 아래입니다.'];
  const reverse=w.outdoors.tour_saffron.signs.find(s=>s.destination===city.id)!;
  reverse.destination=GOLDENROD_STATION;reverse.name='금빛역행 열차';
  reverse.pages=['↓ 남쪽 금빛역행 열차\n성도 금빛시티 · 무료 왕복','금빛역 대합실에 도착합니다.\n아래 현관으로 나가면 금빛 거리입니다.'];
}
