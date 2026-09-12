import type { ExpandedTown } from './explore-expansion';

export const ETERNA_CITY_SIZE={width:56,height:64};
export const ETERNA_BORDER_NAME='숲 경계의 옛 돌담';

/** Keep the original 36x34 city's buildings, statue and saved floor intact. */
export function extendEternaCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...ETERNA_CITY_SIZE,
    features:[...plan.features,
      {kind:'grove',x:36,y:4,w:8,h:7,name:'역사관 뒤 오래된 숲',description:'역사관 뒤로 오래된 나무들이 이어진다.\n돌담은 나무 뿌리를 피해 굽어 있다.'},
      {kind:'rocks',x:36,y:16,w:5,h:3,name:ETERNA_BORDER_NAME,description:'돌담의 끝에서 나무 뿌리가 드러난다.\n숲과 마을 사이에 남긴 낮은 경계다.'},
      {kind:'water',x:36,y:25,w:7,h:6,name:'정원으로 흐르는 수로',description:'나무 그늘 아래로 좁은 물길이 흐른다.\n수로를 따라 남쪽 산책길로 돌아간다.'},
      {kind:'garden',x:23,y:35,w:6,h:3,name:'주민들이 가꾸는 남쪽 정원',description:'주택가와 숲 사이에 작은 꽃밭이 있다.\n동료들과 쉬며 꽃을 돌보는 자리다.'},
      {kind:'grove',x:3,y:45,w:8,h:10,name:'남쪽길 오래된 나무터',description:'숲에서 내려온 나무들이 길을 감싼다.\n낮은 그늘 아래 작은 쉼터가 있다.'},
      {kind:'garden',x:20,y:47,w:9,h:6,name:'숲지기들의 묘목밭',description:'영원숲에서 옮긴 어린 나무를 돌본다.\n포켓몬이 쉬도록 흙길을 비워 두었다.'},
      {kind:'water',x:38,y:53,w:11,h:6,name:'남쪽 수로의 얕은 못',description:'동쪽 수로가 이곳에서 잠시 넓어진다.\n나무다리 아래로 숲 방향 물이 흐른다.'},
      {kind:'rocks',x:45,y:42,w:6,h:4,name:'천관산에서 온 이끼 바위',description:'산에서 흘러온 돌에 이끼가 두껍다.\n숲과 산이 가까운 도시임을 보여 준다.'},
    ],
    paths:[...plan.paths,[30,11,15,3],[33,11,2,24],[34,20,11,3],[43,12,2,23],
      [32,32,13,3],[12,32,3,8],[13,38,31,2],[21,33,2,6],[22,33,13,2],
      [35,14,7,2],[35,19,7,2],[35,15,1,5],[41,15,1,5],
      [12,38,5,24],[2,41,52,3],[10,50,30,3],[28,44,4,15],[31,56,21,3],
      [11,45,4,7],[16,46,4,3],[29,48,10,3]],
    boardwalks:[...plan.boardwalks,[35,24,9,1],[35,24,1,8],[43,24,1,8],[35,31,9,1],
      [36,52,15,2],[36,52,2,9],[50,52,2,9],[36,59,16,2]],
  };
}
