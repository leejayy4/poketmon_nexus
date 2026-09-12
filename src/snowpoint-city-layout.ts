import type { ExpandedTown } from './explore-expansion';

export const SNOWPOINT_CITY_SIZE={width:48,height:44};

/** Extend Snowpoint with a sheltered arrival street and temple approach. */
export function extendSnowpointCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...SNOWPOINT_CITY_SIZE,
    features:[...plan.features,
      {kind:'rocks',x:3,y:31,w:10,h:7,name:'설원길 도착 바위표식',description:'눈에 묻히지 않는 돌기둥이 남쪽 입구를 표시한다.\n현행 연결길은 원작 216·217번도로 전체가 아니다.'},
      {kind:'grove',x:16,y:34,w:10,h:6,name:'눈바람 피난림',description:'낮은 침엽수 사이에 사람과 포켓몬이 쉬는 공간이 있다.\n발자국을 지우지 않도록 한쪽 길을 비워 두었다.'},
      {kind:'garden',x:29,y:32,w:7,h:8,name:'얼음결정 관찰뜰',description:'눈과 얼음의 모양을 비교하는 작은 뜰이다.\n신전으로 가는 길과 주민 생활길이 여기서 갈라진다.'},
      {kind:'rocks',x:38,y:29,w:7,h:11,name:'선단신전 접근 석주',description:'바람 속에서도 신전 방향을 알 수 있는 돌기둥이다.\n통행을 막는 새 조건이나 의식은 없다.'},
      {kind:'grove',x:5,y:40,w:12,h:2,name:'남쪽 눈막이 숲',description:'설원 연결도로에서 들어온 여행자가 방향을 고르는 경계다.'},
    ],
    paths:[...plan.paths,[2,27,44,4],[11,25,5,17],[14,37,18,4],[26,29,5,12],[35,27,5,14],[42,12,4,29]],
  };
}
