import type { SaveData } from './types';
import { SPECIES } from './pokemon';

export function leadPokemon(save:SaveData,index:number):string{
  const p=save.party[index];
  if(!Number.isInteger(index)||!p)return '포켓몬을 선택해 주세요.';
  if(p.hp<=0)return '쓰러진 포켓몬은 선두로 세울 수 없어요.';
  if(index===0)return '이미 선두에 있는 포켓몬이에요.';
  save.party.splice(index,1);save.party.unshift(p);
  return `${SPECIES[p.species].name}를 선두로 세웠어요.\n다음 전투에 먼저 나갑니다.`;
}
function fieldPotionIssue(save:SaveData,index:number):string|null{
  const p=save.party[index];
  if(!Number.isInteger(index)||!p)return '포켓몬을 선택해 주세요.';
  if(p.hp<=0)return '쓰러진 포켓몬에게는 쓸 수 없어요.\n포켓몬센터에서 쉬게 해 주세요.';
  if(p.hp===p.maxHp)return 'HP가 가득 차 있어요.';
  if(save.inventory.potions<=0)return '상처약이 없어요.\n길 안내원이나 센터를 찾아가세요.';
  return null;
}
export function fieldPotionPreview(save:SaveData,index:number):string[]{
  const issue=fieldPotionIssue(save,index);if(issue)return issue.split('\n');
  const p=save.party[index],healed=Math.min(20,p.maxHp-p.hp);
  return [`HP ${p.hp} → ${p.hp+healed} / ${p.maxHp}`,`상처약 1개 사용 · ${healed} 회복`];
}
export function healFieldPokemon(save:SaveData,index:number):string{
  const issue=fieldPotionIssue(save,index);if(issue)return issue;
  const p=save.party[index];
  const amount=Math.min(20,p.maxHp-p.hp);p.hp+=amount;save.inventory.potions--;
  return `${SPECIES[p.species].name}의 HP를\n${amount} 회복했어요.`;
}
