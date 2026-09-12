import type { TourFeature } from './explore-world';

export const CORONET_SIZE={width:56,height:48};
export const CORONET_SOUTH={point:{x:10,y:46},spawn:{x:10,y:45},facing:'up' as const};
export const CORONET_EAST={point:{x:54,y:12},spawn:{x:53,y:12},facing:'left' as const};
export const CORONET_FEATURES:TourFeature[]=[
  {x:2,y:16,w:7,h:2,kind:'rocks',name:'북쪽 통로의 서쪽 암벽',description:'바위 사이로 북쪽 통로가 이어진다.\n그 너머 안내원에게 회복을 부탁하자.'},
  {x:11,y:16,w:7,h:2,kind:'rocks',name:'북쪽 통로의 동쪽 암벽',description:'길이 남쪽의 넓은 암반으로 이어진다.\n동쪽 흙길을 따르면 조우를 피할 수 있다.'},
  {x:8,y:20,w:7,h:5,kind:'rocks',name:'남쪽의 넓은 지층',description:'동쪽 흙길은 암벽을 돌아가는 안전길이다.\n서쪽 조우 샛길도 남쪽 길에 합류한다.'},
  {x:2,y:26,w:5,h:2,kind:'rocks',name:'연고 쪽 서쪽 암반',description:'바위 옆 샛길이 큰 통로에 합류한다.\n남쪽 출구 너머는 연고시티다.'},
  {x:16,y:26,w:2,h:2,kind:'rocks',name:'연고 쪽 동쪽 암반',description:'흙길을 따라 남쪽 출구로 걸어가자.\n이 길로 천관산에 다시 돌아올 수 있다.'},
  {x:21,y:3,w:13,h:12,kind:'rocks',name:'서쪽 통과층의 높은 암벽',description:'오래된 지층이 천장 가까이 솟아 있다.\n낮은 통로가 암벽 아래를 돌아간다.'},
  {x:39,y:3,w:14,h:8,kind:'rocks',name:'호수 분기의 푸른 암반',description:'젖은 바위에 푸른 광물이 희미하게 빛난다.\n동쪽 길은 통합 호수 거점으로 이어진다.'},
  {x:25,y:18,w:10,h:13,kind:'rocks',name:'통과층 중앙의 돌기둥',description:'넓은 돌기둥이 길을 둘로 나눈다.\n양쪽 길은 남쪽 계단 앞에서 합류한다.'},
  {x:41,y:16,w:11,h:15,kind:'rocks',name:'동쪽 선택 동굴벽',description:'작은 돌 틈과 발자국이 이어져 있다.\n풀밭 샛길은 안전한 통로로 돌아온다.'},
  {x:17,y:34,w:16,h:10,kind:'rocks',name:'연고 방향 층계 암반',description:'암반 사이 길이 아래층처럼 낮아진다.\n남쪽 출구에서 산 밖 하산길이 시작된다.'},
  {x:39,y:35,w:14,h:9,kind:'rocks',name:'남동쪽 지하수 벽',description:'바위 아래로 가느다란 물줄기가 흐른다.\n연고 방향 길에는 젖은 발자국이 남아 있다.'},
];
export const CORONET_PATHS:[number,number,number,number][]=[
  [9,16,2,4],[9,18,9,2],[15,18,3,8],[9,25,9,1],[9,26,2,2],[10,28,1,1],
  [4,18,6,2],[4,25,6,1],
  [18,8,5,4],[18,11,22,3],[34,10,7,8],[35,15,8,3],[51,10,4,5],
  [18,31,25,3],[10,29,4,18],[13,41,5,4],[33,29,5,13],[32,39,9,3],
  [41,31,4,8],[44,29,9,4],[33,42,8,3],
];
export const CORONET_GRASS=[
  {kind:'tallGrass' as const,x:4,y:10,w:4,h:3},
  {kind:'tallGrass' as const,x:2,y:20,w:6,h:5},
  {kind:'tallGrass' as const,x:35,y:18,w:6,h:8},
  {kind:'tallGrass' as const,x:45,y:31,w:7,h:4},
  {kind:'tallGrass' as const,x:33,y:42,w:8,h:3},
];
export function makeCoronetFloor():string[][]{
  const {width,height}=CORONET_SIZE;
  return Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>{
    if(x>=9&&x<=10&&y>=16&&y<=17)return '.';
    if(x<20&&y<30){
      if(y<18)return x>=2&&x<=17&&y>=3&&y<=15?'.':'#';
      return x>=2&&x<=17&&y<28?'.':'#';
    }
    return x>=2&&x<width-2&&y>=3&&y<height-2?'.':'#';
  }));
}
