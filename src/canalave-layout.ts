import type { ExpandedTown } from './explore-expansion';
export const CANALAVE_CITY_SIZE={width:64,height:56};
export function extendCanalaveCity(plan:ExpandedTown):ExpandedTown{return {...plan,...CANALAVE_CITY_SIZE,features:[...plan.features,
{kind:'water',x:3,y:34,w:19,h:12,name:'서부 연구길 도착 운하',description:'도보 연구길에서 내려온 여행자가 운하의 수위와 화물을 살핀다.'},
{kind:'water',x:26,y:31,w:13,h:17,name:'중앙 도개 수로',description:'작업선이 지나는 수로다. 사람과 포켓몬은 난간 안쪽 보행로를 쓴다.'},
{kind:'rocks',x:42,y:32,w:9,h:8,name:'광물 화물 적치장',description:'운반 포켓몬이 옮긴 광물 상자를 무게와 목적지별로 나눠 두었다.'},
{kind:'garden',x:5,y:49,w:13,h:3,name:'항만 동료 휴게마당',description:'작업을 마친 포켓몬이 물을 마시고 발을 쉬는 작은 마당이다.'},
{kind:'water',x:52,y:27,w:9,h:20,name:'동쪽 조사선 계류수면',description:'자료 전달 뒤 이용하는 조사선의 작업 수면이다. 일반 도보 연결과 별도다.'},
{kind:'garden',x:35,y:49,w:12,h:4,name:'운하 주민 공동뜰',description:'항만 가족과 동료가 젖은 장비를 말리고 쉬는 생활 공간이다.'}],
paths:[...plan.paths,[2,28,60,4],[12,26,5,27],[21,43,9,4],[38,28,5,25],[47,26,5,27],[57,12,5,41],[14,51,44,3]],
boardwalks:[...plan.boardwalks,[2,32,22,2],[22,32,2,14],[2,46,22,2],[24,30,17,2],[24,48,17,2],[24,32,2,16],[39,32,2,16],[50,26,12,2],[50,47,12,2],[50,28,2,19]]};}
