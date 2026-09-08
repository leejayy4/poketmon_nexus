import type { TourFeature } from './explore-world';

export const ETERNA_FOREST_SIZE={width:32,height:34};
export const ETERNA_FOREST_SOUTH={point:{x:10,y:32},spawn:{x:10,y:31},facing:'up' as const};
type Rect=[number,number,number,number];
// The previous 20x18 forest remains in the northwest. New groves occupy only
// its old border or the extension, so all formerly valid save tiles survive.
export const ETERNA_FOREST_FEATURES:TourFeature[]=[
  {x:18,y:3,w:12,h:13,kind:'grove',name:'동쪽 깊은 나무 군락',description:'겹겹의 나무가 숲의 동쪽을 감싼다.\n남쪽 굽은 길이 숲 입구로 이어진다.'},
  {x:2,y:16,w:7,h:3,kind:'grove',name:'옛 숲길의 나무 그늘',description:'나무 사이 좁은 목을 지나면\n길 안내원이 있는 북쪽 숲길이다.'},
  {x:11,y:16,w:19,h:3,kind:'grove',name:'북쪽 숲의 경계',description:'나무를 따라 서쪽으로 걸으면\n영원시티 쪽 숲길에 합류한다.'},
  {x:9,y:21,w:13,h:9,kind:'grove',name:'가운데 큰 나무 군락',description:'동쪽 흙길은 풀밭을 피해 돌아간다.\n서쪽 풀밭 샛길도 북쪽에서 합류한다.'},
  {x:25,y:21,w:2,h:6,kind:'grove',name:'동쪽 풀밭의 나무',description:'나무 오른쪽의 긴 풀 사이로\n위아래 흙길에 이어지는 샛길이 있다.'},
  {x:25,y:29,w:5,h:3,kind:'grove',name:'입구 동쪽 나무',description:'흙길이 나무를 따라 북쪽으로 굽는다.\n남쪽 입구 너머는 축복시티다.'},
  {x:2,y:28,w:4,h:4,kind:'grove',name:'입구 서쪽 나무',description:'나무 옆 샛길에서 풀 스치는 소리가 난다.\n풀밭을 지나면 북쪽 길에 합류한다.'},
];
export const ETERNA_FOREST_PATHS:Rect[]=[
  [9,16,2,5],[9,19,16,2],[22,19,3,13],[10,30,15,2],[10,32,1,1],
  [6,27,3,5],[6,20,3,2],[6,19,5,2],[24,19,6,2],[24,27,6,2],
];
export const ETERNA_FOREST_GRASS=[
  {kind:'tallGrass' as const,x:4,y:10,w:4,h:3},
  {kind:'tallGrass' as const,x:2,y:22,w:7,h:5},
  {kind:'tallGrass' as const,x:27,y:21,w:3,h:6},
];
export function makeEternaForestFloor():string[][]{
  const {width,height}=ETERNA_FOREST_SIZE;
  return Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>{
    if(x>=9&&x<=10&&y>=16&&y<=17)return '.';
    if(x<20&&y<18)return x>=2&&x<=17&&y>=3&&y<=15?'.':'#';
    return x>=2&&x<width-2&&y>=3&&y<height-2?'.':'#';
  }));
}
