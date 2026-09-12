import type { ExpandedTown } from './explore-expansion';

export const PASTORIA_CITY_SIZE={width:56,height:48};

/** Preserve the original northwest district and extend Pastoria around wetland observation. */
export function extendPastoriaCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...PASTORIA_CITY_SIZE,
    features:[...plan.features,
      {kind:'garden',x:3,y:34,w:10,h:7,name:'212번도로 도착 갈대밭',description:'정원길에서 내려온 물기가 갈대 사이로 번진다.\n도시 보행로와 습지 데크가 여기서 갈라진다.'},
      {kind:'water',x:17,y:34,w:12,h:9,name:'도시 안쪽 얕은 습지',description:'낮은 갈대와 수초 사이로 작은 물결이 번진다.\n울타리 밖에서 조용히 관찰하는 장소다.'},
      {kind:'garden',x:33,y:35,w:8,h:7,name:'갈대 표본 화단',description:'습지 관찰소에서 돌보는 갈대를 높이별로 나눴다.\n뿌리 주변의 흙은 밟지 않게 표시했다.'},
      {kind:'water',x:44,y:31,w:9,h:12,name:'동쪽 관찰 수로',description:'도시 물길이 다음 해안 방향으로 천천히 흐른다.\n나무 데크가 양쪽 둑을 이어 준다.'},
      {kind:'grove',x:5,y:43,w:12,h:3,name:'습지 그늘 쉼터',description:'비와 햇빛을 피할 수 있는 낮은 나무 그늘이다.\n여행자와 동료가 데크에 오르기 전 쉬어 간다.'},
      {kind:'garden',x:31,y:44,w:10,h:3,name:'관찰 기록 마당',description:'젖은 장화를 털고 관찰 수첩을 정리하는 마당이다.\n포획이나 보상 없이 흔적을 비교한다.'},
    ],
    paths:[...plan.paths,
      [2,30,52,4],[10,28,5,17],[13,42,22,4],[28,31,5,14],
      [40,31,5,15],[48,12,5,34],[31,43,22,4],
    ],
    boardwalks:[...plan.boardwalks,
      [15,33,16,2],[15,43,16,2],[15,35,2,8],[29,35,2,8],
      [42,30,12,2],[42,43,12,2],[42,32,2,11],[52,32,2,11],
    ],
  };
}
