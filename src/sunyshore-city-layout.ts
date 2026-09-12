import type { ExpandedTown } from './explore-expansion';

export const SUNYSHORE_CITY_SIZE={width:64,height:56};
export function extendSunyshoreCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...SUNYSHORE_CITY_SIZE,
    features:[...plan.features,
      {kind:'water',x:3,y:36,w:13,h:10,name:'서쪽 해안 도착 만',description:'해안길을 지나온 파도가 낮은 방파제에 닿는다.\n도시 보행로와 등대길이 여기서 갈라진다.'},
      {kind:'garden',x:20,y:37,w:10,h:7,name:'태양광 산책 화단',description:'낮은 꽃 사이에 작은 태양광 판이 기울어져 있다.\n포켓몬 눈높이의 길은 그늘을 남겨 두었다.'},
      {kind:'rocks',x:35,y:35,w:10,h:8,name:'해안 전력 설비 마당',description:'낮은 기초석 위에 견학용 태양광 판과 계기판이 있다.\n전력 복구 사건이나 통행 잠금은 적용하지 않는다.'},
      {kind:'water',x:49,y:32,w:11,h:13,name:'등대 아래 물결길',description:'긴 데크 아래로 바닷물이 드나든다.\n등대 입구와 동쪽 주거지를 이어 주는 길이다.'},
      {kind:'grove',x:5,y:49,w:14,h:3,name:'해풍 방풍수',description:'강한 바람을 낮추는 나무 뒤에 동료 쉼터가 있다.'},
      {kind:'garden',x:27,y:48,w:11,h:5,name:'주민 공동 햇빛마당',description:'빨래와 작은 장비를 말리며 포켓몬이 쉬는 생활 마당이다.'},
    ],
    paths:[...plan.paths,[2,32,60,4],[14,30,5,22],[18,44,25,4],[31,32,5,20],[43,31,5,21],[47,46,15,4],[57,12,5,38]],
    boardwalks:[...plan.boardwalks,[2,34,16,2],[16,34,2,13],[2,46,16,2],[47,30,14,2],[47,45,14,2],[47,32,2,13],[59,32,2,13]],
  };
}
