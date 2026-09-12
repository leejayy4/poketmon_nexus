import type { ExpandedTown } from './explore-expansion';

export const SINNOH_LAKE_SIZE={width:56,height:48};

/** Creative consolidated lake hub. It is not Verity, Valor, or Acuity Lake. */
export function extendSinnohLake(plan:ExpandedTown):ExpandedTown{
  return {...plan,...SINNOH_LAKE_SIZE,
    features:[
      {kind:'water',x:3,y:31,w:17,h:13,name:'서쪽 잔물결 관찰수면',description:'천관산 하부에서 흘러온 물이 잔잔하게 머문다.\n세 호수 중 한 곳을 재현한 장소는 아니다.'},
      {kind:'water',x:24,y:28,w:28,h:16,name:'통합 호수 관찰수면',description:'신오 여러 물가의 생태를 비교하는 창작 관찰 구역이다.\n진실·입지·예지호수의 이름을 대신하지 않는다.'},
      {kind:'garden',x:22,y:34,w:9,h:6,name:'작은 관찰섬',description:'호숫가 데크에서 수초와 물결을 살피는 작은 섬이다.\n포켓몬이 쉬는 자리는 울타리 안쪽에 남겨 두었다.'},
      {kind:'grove',x:4,y:43,w:15,h:3,name:'호숫가 방풍림',description:'산에서 내려오는 찬 바람을 낮추는 나무 띠다.\n북쪽 설원길을 앞둔 동료가 쉬어 간다.'},
      {kind:'garden',x:34,y:45,w:13,h:2,name:'관찰 기록 마당',description:'물빛과 발자국을 수첩에 옮기는 마른 자리다.\n관찰 뒤 북쪽 연결도로의 장비를 정리한다.'},
    ],
    paths:[...plan.paths,[2,27,52,4],[11,25,5,20],[18,37,8,4],[29,37,7,4],[32,27,5,20],[45,12,5,35]],
    boardwalks:[...plan.boardwalks,[18,31,8,2],[18,41,8,2],[18,33,2,8],[24,33,2,8],[29,28,2,16],[31,37,16,2]],
  };
}
