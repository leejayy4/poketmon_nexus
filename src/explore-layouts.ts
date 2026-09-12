import type { TourFeature } from './explore-world';
import { ETERNA_FOREST_FEATURES,ETERNA_FOREST_PATHS } from './eterna-forest-layout';
import { CORONET_FEATURES,CORONET_PATHS } from './coronet-layout';
import { ILEX_FOREST_FEATURES,ILEX_FOREST_PATHS } from './ilex-forest-layout';

interface TourLayout { features:TourFeature[]; paths:[number,number,number,number][]; boardwalks?:[number,number,number,number][] }
export const TOUR_LAYOUTS:Record<string,TourLayout>={
  tour_ilex:{
    features:[
      {x:4,y:4,w:4,h:4,kind:'grove',name:'햇살이 비치는 숲길 나무',description:'나무 너머로 북쪽 흙길이 보인다.\n금빛시티로 가는 길이다.'},
      {x:7,y:11,w:6,h:3,kind:'grove',name:'남쪽 나무 그늘',description:'산책길이 나무 그늘에서 끝난다.\n출구는 북쪽과 동쪽 흙길에 있다.'},
      {x:14,y:4,w:3,h:2,kind:'grove',name:'깊은 숲 들머리 나무',description:'낮은 가지 아래로 옛 표지가 보인다.\n동쪽 흙길은 깊은 숲으로 이어진다.'},
      ...ILEX_FOREST_FEATURES,
    ],
    // Only the north and east roads reach a boundary; the southwest spur ends at a grove.
    paths:[[9,3,2,5],[9,8,9,2],[9,9,2,2],[10,5,3,1],[4,9,5,2],[4,10,2,5],[4,14,7,1],...ILEX_FOREST_PATHS],
  },
  tour_desert:{
    features:[
      {x:3,y:8,w:3,h:3,kind:'rocks',name:'모래에 묻힌 유적 기둥',description:'고대 건축물의 기둥이 묻혀 있다.\n북쪽 흙길은 뇌문시티로 이어진다.'},
      {x:4,y:12,w:4,h:2,kind:'rocks',name:'바람이 쌓은 모래 언덕',description:'바람에 실려 온 모래가 쌓였다.\n남쪽 출구는 구름시티로 이어진다.'},
      {x:14,y:6,w:3,h:3,kind:'rocks',name:'유적 외곽 석벽',description:'단단한 석벽이 모래바람을 막는다.\n표지판 옆 길을 따라 걸을 수 있다.'},
    ],
    paths:[[9,3,2,4],[8,6,6,3],[9,8,3,5],[9,13,3,3],[11,5,2,1],[12,15,1,1],[6,8,3,1]],
  },
  tour_viridian_forest:{
    features:[
      {x:8,y:6,w:3,h:4,kind:'grove',name:'갈림길의 큰 나무',description:'나무 양쪽으로 숲길이 갈라진다.\n두 길은 남쪽에서 다시 만난다.'},
      {x:3,y:5,w:2,h:4,kind:'grove',name:'서쪽 그늘 나무',description:'길 옆으로 짙은 그늘이 드리워졌다.\n북쪽 흙길은 회색시티로 이어진다.'},
      {x:4,y:12,w:4,h:2,kind:'grove',name:'남쪽 잎새 쉼터',description:'낮은 가지 사이로 바람이 지나간다.\n남쪽 출구 너머는 상록시티다.'},
      {x:14,y:10,w:2,h:4,kind:'grove',name:'동쪽 샛길 나무',description:'잎 사이로 안내원이 있는 길이 보인다.\n샛길을 돌아도 같은 흙길로 이어진다.'},
    ],
    // A broad western route and a narrow eastern loop rejoin below the central grove.
    paths:[[9,3,2,3],[6,5,8,1],[6,6,2,5],[6,10,8,2],[9,11,2,5],[9,15,4,1],[10,15,1,2],[13,5,1,7],[12,8,2,1]],
  },
  tour_coronet:{
    features:[
      {x:8,y:6,w:3,h:2,kind:'rocks',name:'겹겹이 드러난 지층',description:'돌에 여러 겹의 층이 드러나 있다.\n바위 오른쪽으로 흙길이 돌아간다.'},
      {x:10,y:11,w:2,h:3,kind:'rocks',name:'풀밭 옆 바위턱',description:'바위 왼쪽에 풀밭으로 가는 샛길이 있다.\n흙길은 남쪽 출구까지 이어진다.'},
      {x:14,y:5,w:2,h:2,kind:'rocks',name:'호수 쪽 암반',description:'바위 아래로 넓은 통로가 이어진다.\n동쪽 표지는 신오 호수를 가리킨다.'},
      ...CORONET_FEATURES,
    ],
    paths:[[9,3,2,3],[10,5,4,1],[12,5,2,4],[8,8,10,2],[8,10,5,1],[8,10,2,6],[8,15,5,1],[10,15,1,2],...CORONET_PATHS],
  },
  tour_eterna_forest:{
    features:[
      {x:4,y:4,w:4,h:4,kind:'grove',name:'빛이 스미는 나무',description:'겹겹의 잎 사이로 햇살이 떨어진다.\n나무 아래로 작은 숲길이 이어진다.'},
      {x:13,y:4,w:4,h:4,kind:'grove',name:'북쪽 나무 군락',description:'나무 사이로 길 안내원이 보인다.\n북쪽 길은 영원시티로 이어진다.'},
      {x:10,y:11,w:2,h:4,kind:'grove',name:'풀밭 옆 나무',description:'나무 왼쪽 샛길에 긴 풀이 자란다.\n풀밭에 들어가면 포켓몬을 만날지도.'},
      {x:13,y:11,w:4,h:4,kind:'grove',name:'숲 가장자리 나무',description:'잎이 바람에 부딪쳐 바스락거린다.\n흙길을 따라가면 남쪽 출구가 나온다.'},
      ...ETERNA_FOREST_FEATURES,
    ],
    // Two-tile bends keep the guide approachable and leave the existing grass optional.
    paths:[[9,3,2,3],[9,5,4,2],[11,6,2,5],[8,9,5,2],[8,10,2,6],[8,15,3,1],[10,15,1,2],...ETERNA_FOREST_PATHS],
  },
  tour_eterna:{
    features:[
      {x:5,y:11,w:4,h:4,kind:'grove',name:'역사관 나무 정원',description:'오래 자란 나무들이 그늘을 만든다.\n정원 옆 길이 석상 광장으로 이어진다.'},
      {x:12,y:14,w:3,h:3,kind:'statue',name:'오래된 석상',description:'세월에 닳은 석상이 광장을 지킨다.\n받침돌에 이끼가 조금 남아 있다.'},
      {x:22,y:14,w:2,h:2,kind:'garden',name:'역사관 옆 화단',description:'역사관 옆에 작은 꽃밭을 가꾸었다.\n나무 정원과 다른 꽃들이 피어 있다.'},
    ],paths:[[13,3,2,10],[2,11,24,2],[10,12,2,6],[15,12,2,6],[10,17,7,2],[13,18,2,4],[17,10,4,3]],
  },
  tour_pastoria:{
    features:[
      {x:5,y:11,w:4,h:5,kind:'water',name:'갈대 습지',description:'얕은 물가에 갈대가 모여 자란다.\n옆의 나무 데크에서 살펴볼 수 있다.'},
      {x:18,y:14,w:5,h:3,kind:'water',name:'수초 관찰 연못',description:'수면 사이로 수초가 고개를 내민다.\n연못 둘레로 관찰 데크가 이어진다.'},
      {x:17,y:18,w:2,h:2,kind:'garden',name:'습지 입구 화단',description:'습지 입구에 작은 꽃들이 피었다.\n관찰을 마친 여행자가 쉬어 가는 곳.'},
    ],paths:[[13,3,2,19],[2,11,24,2],[9,10,3,7],[16,12,8,2],[16,17,8,1]],
    boardwalks:[[9,11,2,6],[16,13,2,5],[18,13,6,1],[23,14,1,4],[18,17,5,1]],
  },
  tour_canalave:{
    features:[
      {x:5,y:10,w:4,h:7,kind:'water',name:'창고 옆 운하',description:'창고 거리 옆으로 긴 물길이 놓였다.\n물가를 따라 부두 산책길이 이어진다.'},
      {x:18,y:14,w:5,h:3,kind:'water',name:'항만 계류장',description:'배를 묶어 두는 나무 말뚝이 보인다.\n지방 연결편은 마을 출구로 향하자.'},
    ],paths:[[13,3,2,19],[2,11,3,2],[9,11,17,2],[9,9,3,9],[4,17,8,1],[16,13,8,1],[16,17,8,1]],
    boardwalks:[[9,10,1,8],[16,13,2,5],[18,13,6,1],[23,14,1,4],[18,17,5,1]],
  },
  tour_jubilife:{
    features:[
      {x:18,y:25,w:4,h:3,kind:'garden',name:'방송국 앞 정원',description:'광장으로 들어오는 길에 꽃을 심었다.\n분수를 둘러보며 쉬어 갈 수 있다.'},
      {x:14,y:19,w:3,h:2,kind:'fountain',name:'교류 광장 분수',description:'물줄기를 중심으로 광장이 펼쳐진다.\n네 방향 길에서 여행자들이 모인다.'},
      {x:33,y:28,w:3,h:3,kind:'garden',name:'광장 모퉁이 화단',description:'작은 화단이 광장 모퉁이를 꾸민다.\n방송국 쪽으로 난 길이 옆에 있다.'},
    ],paths:[[10,3,8,31],[2,10,24,7],[12,21,27,7],[4,9,8,3],[4,18,8,3],[4,25,8,3],[18,9,7,3],[24,21,13,3],[23,29,8,3],[31,26,7,6]],
  },
  tour_oreburgh:{
    features:[
      {x:5,y:11,w:4,h:5,kind:'rocks',name:'광석 선별장',description:'광석을 크기별로 나누어 쌓아 두었다.\n돌마다 색과 결이 조금씩 다르다.'},
      {x:18,y:14,w:5,h:2,kind:'rail',name:'운반 레일과 광차',description:'짧은 레일 위에 광차 모형이 놓였다.\n광산 전시관과 함께 둘러보는 자리다.'},
    ],paths:[[13,3,2,19],[2,11,24,2],[9,10,3,8],[16,12,8,2],[16,16,8,2],[16,13,2,5]],
  },
  tour_hearthome:{
    features:[
      {x:5,y:11,w:4,h:5,kind:'garden',name:'공연장 산책 정원',description:'꽃들이 공연장으로 가는 길을 꾸민다.\n천천히 걸으며 색을 비교해 보자.'},
      {x:12,y:14,w:3,h:3,kind:'garden',name:'리본 화단',description:'밝은 꽃을 리본처럼 모아 심었다.\n화단 양쪽으로 산책길이 이어진다.'},
      {x:17,y:17,w:2,h:2,kind:'garden',name:'휴식 화단',description:'주택가 앞 작은 꽃밭이다.\n공연장을 둘러보고 잠깐 쉬어 가자.'},
    ],paths:[[13,3,2,10],[2,11,24,2],[10,12,2,7],[15,12,2,8],[10,18,7,2],[13,19,2,3],[17,10,4,3]],
  },
};
