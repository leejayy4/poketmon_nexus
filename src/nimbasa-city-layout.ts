import type { ExpandedTown } from './explore-expansion';
import type { TourBuilding,TourFeature } from './explore-world';

export const NIMBASA_CITY_SIZE={width:72,height:56};

/** Keep the original 40x36 centre and grow the amusement and Join Avenue sides. */
export function nimbasaPlan():ExpandedTown{
  const buildings:TourBuilding[]=[
    {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_nimbasa_center'},
    {kind:'landmark',x:26,y:17,w:10,h:4,door:{x:31,y:20},room:'tour_nimbasa_hall'},
    {kind:'house',x:5,y:25,w:5,h:2,door:{x:7,y:26}},
    {kind:'house',x:22,y:27,w:5,h:2,door:{x:24,y:28}},
    {kind:'house',x:5,y:16,w:5,h:2,door:{x:7,y:17}},
    {kind:'house',x:18,y:7,w:5,h:2,door:{x:20,y:8}},
  ];
  const features:TourFeature[]=[
    {x:5,y:28,w:4,h:5,kind:'garden',name:'중심가 꽃놀이 터',description:'공연을 기다리는 주민과 포켓몬이 쉬는 작은 화단이다.\n동쪽 큰길에서 관람차가 보인다.'},
    {x:16,y:19,w:3,h:2,kind:'fountain',name:'공연 거리 분수',description:'조명이 켜지면 물줄기가 무대 음악에 맞춰 흔들린다.\n센터와 놀이공원 안내소 사이의 약속 장소다.'},
    {x:42,y:5,w:10,h:10,kind:'garden',name:'뇌문 관람차 광장',description:'색색의 객실이 도시 동쪽 하늘을 천천히 돈다.\n파트너와 광장을 돌며 다음 객실을 바라볼 수 있다.'},
    {x:58,y:7,w:7,h:8,kind:'statue',name:'뮤지컬 파트너 조형물',description:'사람과 포켓몬이 같은 박자로 인사하는 조형물이다.\n공연 포스터의 동작을 본떠 만들었다.'},
    {x:44,y:27,w:7,h:5,kind:'fountain',name:'동쪽 조명 분수',description:'놀이 구역과 경기 관람길 사이를 밝히는 분수다.\n밤 공연에 쓰는 색유리 조명이 둘레에 놓여 있다.'},
    {x:57,y:25,w:9,h:8,kind:'garden',name:'경기 관람 휴게원',description:'응원 뒤 목소리를 고르는 조용한 정원이다.\n포켓몬용 낮은 급수대와 긴 의자가 함께 있다.'},
    {x:22,y:41,w:10,h:7,kind:'garden',name:'조인애버뉴 환영 광장',description:'남쪽 거리에서 도착한 여행자를 맞는 밝은 화단이다.\n구름시티와 4번도로 방향 표지가 나란히 서 있다.'},
    {x:43,y:40,w:9,h:7,kind:'garden',name:'공연 연습 마당',description:'트레이너와 파트너가 짧은 동작을 맞춰 보는 공간이다.\n통행을 막지 않도록 무대 선이 가장자리에 그려져 있다.'},
    {x:58,y:40,w:8,h:7,kind:'garden',name:'야간 조명 정원',description:'작은 전구가 꽃길의 윤곽을 따라 이어진다.\n밝은 빛에 놀라지 않도록 휴식 구역은 은은하게 비춘다.'},
  ];
  return {...NIMBASA_CITY_SIZE,style:'urban',buildings,features,
    paths:[
      [12,3,5,51],[2,11,68,3],[2,24,68,3],[2,49,68,3],
      [7,9,10,2],[7,18,10,2],[7,27,10,2],[20,9,3,3],
      [15,21,18,3],[24,29,14,3],[31,12,5,9],
      [35,11,5,39],[38,17,31,3],[38,34,31,3],
      [53,3,4,47],[67,11,3,39],[16,38,23,3],[14,47,25,3],
      [14,51,5,4],[32,20,7,3],[39,27,5,3],[51,28,7,3],
      [40,47,14,3],[54,36,3,14],
    ],boardwalks:[],
  };
}
