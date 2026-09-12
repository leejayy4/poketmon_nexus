import type { Engine } from './engine';
import { encounterGuidance } from './encounter-guidance';

const ILEX_FOREST='tour_ilex';

/** Ilex ecology and directions without turning the shrine into a story gate. */
export function handleIlexLife(g:Engine,event:string):boolean{
  if(g.save.map!==ILEX_FOREST)return false;
  if(event==='tourGuide'){
    g.say('너도밤나무숲 안내원',[
      '북쪽 길은 34번도로와 금빛시티,\n동쪽 긴 길은 고동마을로 이어집니다.',
      ...encounterGuidance(ILEX_FOREST).pages,
      '표시된 흙길은 조우 없이 통과할 수 있어요.\n포켓몬을 찾으려면 남쪽 순환길의 긴풀로 들어가세요.',
      '숲 사당은 조용히 살펴보는 장소입니다.\n방문만으로 특별한 만남이나 통행 조건이 생기지 않아요.',
    ]);return true;
  }
  if(event==='tourIlexTracks'){
    g.say('남쪽 순환길의 발자국',[
      '작은 애벌레 포켓몬의 자국과\n박쥐 포켓몬이 내려앉은 흔적이 풀 가장자리에 남았다.',
      ...encounterGuidance(ILEX_FOREST).pages,
      '사람이 걷는 흙길로 돌아가면 조우 구역을 벗어난다.\n동쪽은 고동마을, 북쪽은 34번도로다.',
    ]);return true;
  }
  return false;
}
