import type { ExpandedTown } from './explore-expansion';

export const GOLDENROD_CITY_SIZE={width:56,height:72};

/** Preserve the original 40x36 city and extend its station, market and southern approach. */
export function extendGoldenrodCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...GOLDENROD_CITY_SIZE,
    features:[...plan.features,
      {kind:'rail',x:41,y:4,w:10,h:8,name:'금빛역 선로 전망대',description:'노랑시티로 향하는 선로가 도시 밖으로 뻗는다.\n낮은 난간 너머로 열차를 기다리는 포켓몬이 보인다.'},
      {kind:'garden',x:42,y:20,w:8,h:6,name:'방송 엽서 정원',description:'라디오 청취자들이 보낸 엽서 모양 화단이다.\n타워 앞 광장과 동쪽 산책로가 이어진다.'},
      {kind:'fountain',x:20,y:40,w:6,h:5,name:'금빛 중앙 분수',description:'시장과 주택가 사이에서 동료들이 쉬어 간다.\n남쪽 큰길은 34번도로 방향이다.'},
      {kind:'garden',x:5,y:49,w:10,h:7,name:'남쪽 시장 텃밭',description:'도시락 가게에서 쓰는 나무열매와 채소를 기른다.\n작은 포켓몬이 쉬도록 흙길을 남겨 두었다.'},
      {kind:'grove',x:38,y:48,w:11,h:10,name:'34번도로 들머리 숲',description:'도시의 포장길이 낮은 나무 그늘로 바뀐다.\n숲 사이의 큰길을 따라 34번도로로 나간다.'},
      {kind:'garden',x:20,y:60,w:8,h:5,name:'여행자 배웅 화단',description:'34번도로로 떠나는 동료를 배웅하는 자리다.\n라디오에서 들은 여행 이야기가 팻말에 적혀 있다.'},
    ],
    paths:[...plan.paths,
      [36,11,18,3],[38,4,3,26],[40,27,12,3],[12,32,5,38],
      [3,37,50,3],[3,45,50,3],[3,57,50,3],[14,66,5,4],
      [16,40,22,3],[27,30,3,18],[29,43,10,3],[16,54,22,3],
      [4,47,13,2],[15,60,22,3],[28,58,3,9],[37,42,3,18],
    ],
    boardwalks:[...plan.boardwalks],
  };
}
