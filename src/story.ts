import type { SaveData } from './types';

export function motherConversation(save: SaveData): string[] {
  if (save.party.some(p=>p.species===399)) {
    return ['모험길에서 새 친구를 만났구나!\n함께하는 친구들을 모두 아껴 주렴.'];
  }
  if (save.flags.starterReceived && save.flags.pikachuReceived) {
    return ['어머, 새 친구가 둘이나 생겼구나!\n피카츄도 함께 왔네.', '두 친구 모두 소중히 아껴 주렴.\n서로 알아가는 시간도 필요하단다.'];
  }
  if (save.flags.pikachuReceived) {
    return ['어머, 피카츄와 친구가 되었구나!\n정말 반갑다, 피카츄야.', '서두르지 말고 천천히 친해지렴.\n앞으로 서로 아껴 주고.'];
  }
  if (save.flags.starterReceived) {
    return ['어머, 새로운 친구가 생겼구나!\n앞으로 서로 아껴 주렴.'];
  }
  return ['잘 잤니? 박사님이 연구소에서\n너를 기다리고 계신단다.', '집 앞길을 따라 위쪽으로 가 보렴.\n파란 지붕의 건물이 연구소야.'];
}

export function professorConversation(save: SaveData): { pages:string[]; offerStarter:boolean } {
  const pages:string[]=[];
  if(save.flags.pikachuReceived){
    pages.push('어, 이미 피카츄를 받았구나!\n연구원에게 이야기를 들었단다.');
    if(!save.flags.professorIntroHeard)pages.push('너희 엄마한테 이야기는 들었단다.\n포켓몬과 모험을 시작하고 싶다지?');
    pages.push('뭐라고? 또 다른 포켓몬을\n받고 싶다고?', '빛나래는 욕심쟁이구나, 하하!\n안 된단다.', '이미 멋진 파트너가 생겼잖니.\n피카츄와 함께 모험을 준비해 보렴.');
    return {pages,offerStarter:false};
  }
  if(save.flags.starterReceived){
    pages.push('너와 포켓몬이 함께할 이야기가\n이 작은 마을에서 시작되는 거란다.','오늘은 마을을 천천히 둘러보렴.\n엄마에게 새 친구도 소개해 드리고.');
    return {pages,offerStarter:false};
  }
  if(!save.flags.professorIntroHeard){
    pages.push('어서 오너라. 나는 은솔박사란다.\n너희 엄마한테 이야기는 들었단다.','포켓몬과 함께 모험을 시작하려고\n오늘을 손꼽아 기다렸다지?','네 엄마도 처음 여행을 떠나던 날,\n꼭 너처럼 설레는 얼굴이었단다.','모험은 서두를 필요가 없단다.\n서로 믿을 친구를 만나는 게 먼저지.');
  }
  pages.push('여기 너의 첫 파트너가 될\n세 친구가 기다리고 있단다.', '천천히 살펴보거라.\n마음이 끌리는 포켓몬을 골라 보렴.');
  return {pages,offerStarter:true};
}
