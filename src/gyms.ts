import type { Pokemon, SaveData } from './types';
export const GYMS = [
  {id:'roark',name:'강석',badge:'BADGE-GS01',label:'콜배지',tm:'TM-stealth-rock',move:'스텔스록',level:8,damage:5,xp:50,team:[[74,10,22],[95,11,24],[408,12,26]]},
  {id:'gardenia',name:'유채',badge:'BADGE-GS02',label:'포리스트배지',tm:'TM-grass-knot',move:'풀묶기',level:10,damage:5,xp:70,team:[[406,14,27],[420,15,29],[315,16,31]]},
  {id:'fantina',name:'멜리사',badge:'BADGE-GS03',label:'레릭배지',tm:'TM-shadow-ball',move:'섀도볼',level:12,damage:6,xp:90,team:[[425,17,32],[92,18,34],[200,19,36]]},
  {id:'maylene',name:'자두',badge:'BADGE-GS04',label:'코블배지',tm:'TM-drain-punch',move:'드레인펀치',level:15,damage:7,xp:110,team:[[307,21,38],[66,22,40],[448,23,42]]},
] as const;
export type GymId=typeof GYMS[number]['id'];
export function gymById(id:GymId){return GYMS.find(g=>g.id===id)!}
export function gymTeam(id:GymId):Pokemon[]{return gymById(id).team.map(([species,level,maxHp])=>({species,level,maxHp,hp:maxHp,experience:0,nature:'성실',met:'체육관'}))}
export function gymChallengeBlock(save:SaveData,id:GymId):string|null{
  if(!save.party.length)return '먼저 새잎마을 연구소에서\n함께할 첫 파트너를 만나 줘.';
  if(!save.party.some(p=>p.hp>0))return '지금은 싸울 수 있는 포켓몬이 없어.\n포켓몬센터에서 먼저 쉬고 와 줘.';
  if(save.flags.departureCleared!==true)return '새잎마을 서쪽 출구의 도윤과\n출발 준비를 먼저 마쳐 줘.';
  const index=GYMS.findIndex(g=>g.id===id),missing=GYMS.slice(0,index).find(g=>!save.badges.includes(g.badge));
  return missing?`먼저 관장 ${missing.name}에게 도전해\n${missing.label}를 받고 와 줘.`:null;
}
export function canChallenge(save:SaveData,id:GymId){return gymChallengeBlock(save,id)===null}
export function gymPreparation(save:SaveData,id:GymId){
  const healthy=save.party.filter(p=>p.hp>0),injured=save.party.filter(p=>p.hp<p.maxHp).length;
  const highestLevel=Math.max(0,...healthy.map(p=>p.level)),recommendedLevel=gymById(id).level;
  const blocked=gymChallengeBlock(save,id);
  const advice=blocked??(injured?'다친 친구가 있으니 센터에서 쉬면\n더 든든하게 도전할 수 있을 거야.':highestLevel<recommendedLevel?`권장 레벨은 ${recommendedLevel}이야. 풀밭에서\n연습하거나 지금 도전해도 좋아.`:save.inventory.potions<2?(save.badges.length?'상처약은 마을 상점에서\n준비해 주세요.':'센터에서 상처약을 2개까지\n보충해 주니 준비할 때 들러 봐.'):'파트너의 기술과 교대를 활용해 봐.\n준비가 되었다면 시작하자!');
  return {available:healthy.length,total:save.party.length,injured,highestLevel,recommendedLevel,potions:save.inventory.potions,blocked,advice};
}
export function awardGym(save:SaveData,id:GymId){const gym=gymById(id);if(save.badges.includes(gym.badge)||!canChallenge(save,id))return false;save.badges.push(gym.badge);save.keyItems.push(gym.tm);save.money=Math.min(999999,save.money+gym.team[2][1]*120);return true}
