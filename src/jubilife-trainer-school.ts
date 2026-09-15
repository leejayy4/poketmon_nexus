import type { Place,TourId } from './explore-world';
import type { TourInterior } from './explore-interiors';
import type { GameMap,Point } from './types';

export const JUBILIFE_TRAINER_SCHOOL='tour_jubilife_school' as TourId;

const block=(rows:string[][],x:number,y:number,w:number,h:number)=>{
  for(let py=y;py<y+h;py++)for(let px=x;px<x+w;px++)rows[py][px]='#';
};

export function installJubilifeTrainerSchool(a:{
  maps:Record<TourId,GameMap>;
  rooms:Record<string,TourInterior>;
  spawns:Record<TourId,Point>;
  roomParents:Record<string,Place>;
  place:Place;
}){
  const {maps,rooms,spawns,roomParents,place}=a,city=maps.tour_jubilife;
  const rows=Array.from({length:18},(_,y)=>Array.from({length:24},(_,x)=>x>=2&&x<=21&&y>=3&&y<=15||x===12&&y>=16?'.':'#'));
  block(rows,2,3,20,1); // rear wall: blackboard and shelves are approached from below
  block(rows,4,7,6,2); // lesson desks
  block(rows,14,6,6,1); // blue practice mat boundary
  block(rows,14,11,6,1);
  const map:GameMap={
    id:JUBILIFE_TRAINER_SCHOOL,name:'축복시티 · 트레이너스쿨',width:24,height:18,
    background:JUBILIFE_TRAINER_SCHOOL,walkable:rows.map(row=>row.join('')),
    warps:[{x:12,y:17,to:'tour_jubilife',spawn:{x:7,y:18},entry:'down',facing:'down'}],
    npcs:[
      {id:'jubilifeSchoolTeacher',name:'트레이너스쿨 선생님',sprite:'scientist_f',x:7,y:5,facing:'down',dialogue:'jubilifeSchoolTeacher'},
      {id:'jubilifeSchoolStarly',name:'트레이너스쿨 학생',sprite:'school_kid_m',x:15,y:8,facing:'right',dialogue:'jubilifeSchoolStarly'},
      {id:'jubilifeSchoolBidoof',name:'트레이너스쿨 학생',sprite:'school_kid_f',x:18,y:9,facing:'left',dialogue:'jubilifeSchoolBidoof'},
    ],
    props:[
      {x:6,y:3,dialogue:'jubilifeSchoolBoard'},
      {x:11,y:3,dialogue:'jubilifeSchoolNotebook'},
      {x:17,y:3,dialogue:'jubilifeSchoolRouteBoard'},
    ],
  };
  maps[JUBILIFE_TRAINER_SCHOOL]=map;
  rooms[JUBILIFE_TRAINER_SCHOOL]={style:'dojo',title:'트레이너스쿨',host:{x:7,y:5},greeting:['초보 트레이너가 동료의 상태와 실전을 배우는 교실이다.'],objects:[]};
  spawns[JUBILIFE_TRAINER_SCHOOL]={x:12,y:14};
  roomParents[JUBILIFE_TRAINER_SCHOOL]=place;
  const door=city.warps.find(w=>w.to===JUBILIFE_TRAINER_SCHOOL);
  if(door)door.spawn={x:12,y:14};
}
