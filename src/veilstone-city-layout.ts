import type { ExpandedTown } from './explore-expansion';

export const VEILSTONE_CITY_SIZE={width:64,height:56};

/** Preserve the original northwest district and extend Veilstone by elevation and use. */
export function extendVeilstoneCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...VEILSTONE_CITY_SIZE,
    features:[...plan.features,
      {kind:'garden',x:3,y:37,w:10,h:7,name:'고갯길 도착 쉼터',description:'긴 고갯길을 건너온 동료가 숨을 고르는 작은 화단이다.\n서쪽 길과 중앙 계단광장이 이어진다.'},
      {kind:'rocks',x:18,y:38,w:12,h:6,name:'백화점 아래 단차',description:'회색 돌벽 위로 상업 거리의 간판이 층층이 보인다.\n완만한 계단길이 양쪽 광장을 잇는다.'},
      {kind:'fountain',x:35,y:38,w:7,h:7,name:'수련광장 급수대',description:'연습을 마친 사람과 포켓몬이 물을 마시는 낮은 급수대다.\n체육관과 상점 사이의 쉼터 역할을 한다.'},
      {kind:'garden',x:48,y:37,w:11,h:7,name:'공동주택 옥상 화단',description:'단차 아래에서도 보이는 높은 화단이다.\n주민들이 교대로 허브와 작은 꽃을 돌본다.'},
      {kind:'rocks',x:16,y:47,w:13,h:5,name:'남쪽 훈련 절벽',description:'낮은 돌계단과 평평한 발판이 반복된다.\n승패 없는 몸풀기와 균형 연습에 쓰인다.'},
      {kind:'grove',x:45,y:48,w:14,h:4,name:'동쪽 출구 방풍수',description:'바람을 막는 나무 사이로 다음 길의 표지가 보인다.\n도시로 돌아오는 보행로도 함께 이어진다.'},
    ],
    paths:[...plan.paths,
      [2,34,60,4],[10,32,5,20],[14,45,37,4],[29,36,5,17],
      [40,34,5,18],[43,50,19,4],[52,42,5,10],[57,12,5,42],
    ],
    boardwalks:[...plan.boardwalks],
  };
}
