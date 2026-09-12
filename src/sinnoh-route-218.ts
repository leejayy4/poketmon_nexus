import type { GameMap } from './types';
import type { TourFeature,TourId } from './explore-world';
export const SINNOH_ROUTE_218='tour_sinnoh_route_218' as TourId;
export function createSinnohRoute218():{map:GameMap;features:TourFeature[]}{const width=64,height=28,rows=Array.from({length:height},()=>Array<string>(width).fill('#'));const open=(x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
open(1,12,18,3);open(8,7,3,8);open(9,6,14,3);open(20,7,3,8);open(18,12,10,3);open(26,9,3,6);open(27,8,9,3);open(34,8,3,7);open(35,12,12,3);open(45,10,3,5);open(46,9,17,3);
const features:TourFeature[]=[{kind:'water',x:29,y:15,w:17,h:8,name:'218번도로 수로 전망',description:'원작218번도로의 수상 구간을 바라보는 물가다. 현재 물 위를 건너지는 않는다.'},{kind:'grove',x:10,y:18,w:12,h:4,name:'축복 서쪽 방풍림',description:'도시 바람을 낮추고 육지 접근로의 경계를 만드는 나무 띠다.'},{kind:'rocks',x:49,y:15,w:10,h:5,name:'운하 쪽 수로 표석',description:'동쪽 보행 우회 연결과 미구현 수상 본선을 구분하는 표식이다.'}];
for(const feature of features)for(let y=feature.y;y<feature.y+feature.h;y++)for(let x=feature.x;x<feature.x+feature.w;x++)rows[y][x]='#';
const map:GameMap={id:SINNOH_ROUTE_218,name:'신오 218번도로 · 육지 접근부',width,height,background:SINNOH_ROUTE_218,walkable:rows.map(r=>r.join('')),warps:[],terrain:[],npcs:[{id:'route218Observer',name:'218번도로 수로 관찰자',sprite:'rancher',x:34,y:9,facing:'down',dialogue:'route218Observer'}],props:[{x:5,y:10,dialogue:'route218Sign'},{x:57,y:7,dialogue:'route218Sign'}]};return {map,features};}
