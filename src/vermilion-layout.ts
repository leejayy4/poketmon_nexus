import type { ExpandedTown } from './explore-expansion';

export const VERMILION_SIZE={width:72,height:56};
export const VERMILION_CERULEAN_ROUTE='tour_pass_vermilion_cerulean';
export const VERMILION_CERULEAN_NAME='갈색–블루 해안길';

/** Keep the original port and its ferry/doors intact; extend east and south. */
export function extendVermilionTown(plan:ExpandedTown):ExpandedTown{
  return {...plan,...VERMILION_SIZE,
    features:[...plan.features,
      {kind:'water',x:41,y:16,w:10,h:9,name:'갈색 작업 부두',description:'짐을 내리는 부두의 안쪽 수면이다.\n물가를 따라 터미널 뒤편까지 걸을 수 있다.'},
      {kind:'water',x:22,y:34,w:27,h:7,name:'남쪽 정박 수면',description:'잔잔한 항구 안쪽에 물결이 번진다.\n조사선 승선은 기존 선원과 이야기 진행을 확인하자.'},
      {kind:'garden',x:5,y:35,w:6,h:4,name:'부두 주민의 쉼터',description:'작업을 마친 주민들이 쉬는 작은 정원.\n주택 골목과 항구 산책길이 여기서 만난다.'},
      {kind:'rocks',x:42,y:5,w:7,h:3,name:'항구 동쪽 방파제',description:'겹쳐 놓은 바위가 바닷바람을 막아 준다.\n북쪽 길은 블루 방면 출구로 이어진다.'},
      {kind:'water',x:57,y:19,w:10,h:19,name:'동쪽 하역 수면',description:'긴 부두 사이로 물결이 흘러든다.\n짐을 나르는 길과 물가 산책길이 나뉜다.'},
      {kind:'garden',x:27,y:47,w:9,h:4,name:'항구 산책 정원',description:'바닷바람을 피해 동료와 쉬는 자리다.\n서쪽 주택 골목으로 다시 돌아갈 수 있다.'},
    ],
    paths:[...plan.paths,[36,11,35,3],[37,12,3,21],[12,28,5,25],[3,31,50,3],[3,40,65,3],[3,33,2,8],[12,35,9,3],[39,9,13,2],[51,13,4,39],[14,51,54,3],[37,44,3,8],[17,45,23,2]],
    boardwalks:[...plan.boardwalks,[40,15,12,1],[40,16,1,10],[41,25,11,2],[51,16,2,10],[21,33,29,1],[20,34,2,8],[22,41,29,2],[49,34,2,8],[55,17,14,2],[55,19,2,21],[67,19,2,34],[57,38,12,2]],
  };
}
