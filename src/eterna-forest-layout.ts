import type { TourFeature } from './explore-world';

export const ETERNA_FOREST_SIZE={width:56,height:64};
export const ETERNA_FOREST_SOUTH={point:{x:10,y:62},spawn:{x:10,y:61},facing:'up' as const};
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
  {x:32,y:3,w:21,h:16,kind:'grove',name:'동쪽 고목의 장막',description:'높은 고목이 햇빛을 여러 겹 가린다.\n뿌리 사이 길은 남쪽 개울로 내려간다.'},
  {x:34,y:23,w:8,h:13,kind:'grove',name:'개울 서쪽의 깊은 숲',description:'축축한 이끼와 고사리가 자란다.\n좁은 흙길은 두 갈래 길로 돌아간다.'},
  {x:47,y:22,w:6,h:20,kind:'grove',name:'동쪽 숲 경계',description:'나무가 빽빽해 더 동쪽으로 갈 수 없다.\n새소리가 개울 쪽에서 이어진다.'},
  {x:18,y:39,w:12,h:12,kind:'grove',name:'묘목 보호 구역',description:'어린 나무 주변을 낮은 울타리로 감쌌다.\n동료가 지나갈 흙길은 남겨 두었다.'},
  {x:35,y:43,w:16,h:8,kind:'grove',name:'남동쪽 벌레 포켓몬 숲',description:'나뭇잎 아래 작은 먹이 흔적이 보인다.\n긴 풀은 큰길과 떨어진 곳에만 자란다.'},
  {x:2,y:45,w:8,h:15,kind:'grove',name:'남쪽 입구의 나무벽',description:'남쪽길에서 이어진 나무들이 줄지어 있다.\n가운데 흙길로 안전하게 드나들 수 있다.'},
  {x:15,y:55,w:38,h:5,kind:'grove',name:'숲 남쪽 완충림',description:'도시와 숲 사이의 낮은 나무 군락이다.\n입구 주변은 동료를 위해 비워 두었다.'},
];
export const ETERNA_FOREST_PATHS:Rect[]=[
  [9,16,2,5],[9,19,16,2],[22,19,3,13],[10,30,15,2],[10,32,1,1],
  [6,27,3,5],[6,20,3,2],[6,19,5,2],[24,19,6,2],[24,27,6,2],
  [10,31,3,32],[2,35,52,4],[29,18,4,21],[31,19,16,4],[41,22,5,17],
  [9,42,9,4],[10,50,8,4],[29,39,6,16],[31,51,22,4],[10,60,6,3],
];
export const ETERNA_FOREST_GRASS=[
  {kind:'tallGrass' as const,x:4,y:10,w:4,h:3},
  {kind:'tallGrass' as const,x:2,y:22,w:7,h:5},
  {kind:'tallGrass' as const,x:27,y:21,w:3,h:6},
  {kind:'tallGrass' as const,x:14,y:35,w:10,h:3},
  {kind:'tallGrass' as const,x:43,y:25,w:4,h:10},
  {kind:'tallGrass' as const,x:11,y:45,w:6,h:5},
  {kind:'tallGrass' as const,x:35,y:51,w:12,h:4},
];
export function makeEternaForestFloor():string[][]{
  const {width,height}=ETERNA_FOREST_SIZE;
  return Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>{
    if(x>=9&&x<=10&&y>=16&&y<=17)return '.';
    if(x<20&&y<18)return x>=2&&x<=17&&y>=3&&y<=15?'.':'#';
    return x>=2&&x<width-2&&y>=3&&y<height-2?'.':'#';
  }));
}
