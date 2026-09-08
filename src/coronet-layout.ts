import type { TourFeature } from './explore-world';

export const CORONET_SIZE={width:20,height:30};
export const CORONET_SOUTH={point:{x:10,y:28},spawn:{x:10,y:27},facing:'up' as const};
export const CORONET_FEATURES:TourFeature[]=[
  {x:2,y:16,w:7,h:2,kind:'rocks',name:'북쪽 통로의 서쪽 암벽',description:'바위 사이로 북쪽 통로가 이어진다.\n그 너머 안내원에게 회복을 부탁하자.'},
  {x:11,y:16,w:7,h:2,kind:'rocks',name:'북쪽 통로의 동쪽 암벽',description:'길이 남쪽의 넓은 암반으로 이어진다.\n동쪽 흙길을 따르면 조우를 피할 수 있다.'},
  {x:8,y:20,w:7,h:5,kind:'rocks',name:'남쪽의 넓은 지층',description:'동쪽 흙길은 암벽을 돌아가는 안전길이다.\n서쪽 조우 샛길도 남쪽 길에 합류한다.'},
  {x:2,y:26,w:5,h:2,kind:'rocks',name:'연고 쪽 서쪽 암반',description:'바위 옆 샛길이 큰 통로에 합류한다.\n남쪽 출구 너머는 연고시티다.'},
  {x:16,y:26,w:2,h:2,kind:'rocks',name:'연고 쪽 동쪽 암반',description:'흙길을 따라 남쪽 출구로 걸어가자.\n이 길로 천관산에 다시 돌아올 수 있다.'},
];
export const CORONET_PATHS:[number,number,number,number][]=[
  [9,16,2,4],[9,18,9,2],[15,18,3,8],[9,25,9,1],[9,26,2,2],[10,28,1,1],
  [4,18,6,2],[4,25,6,1],
];
export const CORONET_GRASS=[
  {kind:'tallGrass' as const,x:4,y:10,w:4,h:3},
  {kind:'tallGrass' as const,x:2,y:20,w:6,h:5},
];
export function makeCoronetFloor():string[][]{
  const {width,height}=CORONET_SIZE;
  return Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>{
    if(x>=9&&x<=10&&y>=16&&y<=17)return '.';
    if(y<18)return x>=2&&x<=17&&y>=3&&y<=15?'.':'#';
    return x>=2&&x<width-2&&y<height-2?'.':'#';
  }));
}
