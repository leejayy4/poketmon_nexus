import type { ExpandedTown } from './explore-expansion';

export const HEARTHOME_SIZE={width:64,height:64};

/** Preserve the original district and grow Hearthome around performance and companion life. */
export function extendHearthomeCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...HEARTHOME_SIZE,
    features:[...plan.features,
      {kind:'garden',x:20,y:4,w:10,h:6,name:'208번도로 도착 화단',description:'산길에서 내려온 여행자를 맞는 꽃밭이다.\n중앙 공연 거리로 이어지는 길을 비워 두었다.'},
      {kind:'garden',x:39,y:5,w:13,h:8,name:'동쪽 야외 연습 정원',description:'리본을 단 표식 사이로 동료가 움직인다.\n콘테스트 전 걸음과 호흡을 맞추는 곳이다.'},
      {kind:'fountain',x:43,y:19,w:7,h:7,name:'공연 거리의 원형 분수',description:'낮은 물줄기가 무대 박자처럼 차례로 솟는다.\n주민과 동료가 둘레에서 쉬어 간다.'},
      {kind:'water',x:35,y:31,w:15,h:9,name:'정원 사이 반영 연못',description:'꽃과 리본 장식이 잔잔한 수면에 비친다.\n나무 데크가 공연 거리와 산책길을 잇는다.'},
      {kind:'garden',x:5,y:42,w:12,h:8,name:'동료와 걷는 남쪽 정원',description:'높이가 다른 꽃 사이로 넓은 흙길이 난다.\n동료의 걸음에 맞춰 천천히 돌 수 있다.'},
      {kind:'garden',x:23,y:48,w:11,h:7,name:'리본 연습 잔디마당',description:'작은 표식과 낮은 단상이 놓여 있다.\n완전한 대회가 아닌 일상 연습 공간이다.'},
      {kind:'garden',x:46,y:46,w:12,h:10,name:'주민 공동 꽃정원',description:'주민들이 색과 계절별로 꽃을 돌본다.\n동료가 쉴 낮은 그늘도 마련해 두었다.'},
      {kind:'grove',x:38,y:57,w:20,h:4,name:'남쪽 출구 가로수길',description:'도시 밖으로 이어지는 길에 나무가 늘어서 있다.\n다음 여행 전에 그늘에서 잠시 쉴 수 있다.'},
    ],
    paths:[...plan.paths,
      [12,3,6,59],[2,28,60,5],[30,9,5,45],[33,12,26,4],[50,13,5,20],
      [17,40,18,4],[16,51,8,4],[33,41,29,4],[34,55,9,4],[5,56,35,4],
      [57,14,5,45],[18,9,21,3],[35,26,20,4]],
    boardwalks:[...plan.boardwalks,
      [33,29,19,2],[33,30,2,12],[50,29,2,13],[33,40,19,2],[40,38,4,5]],
  };
}
