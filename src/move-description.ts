import { MOVE_RULES } from './pokemon';

// Describe only effects implemented by battleTurn/techniqueDamage.
// Leave one of the three dialogue lines for the comparison target's name.
export function moveDescription(move:string):string {
  const data=MOVE_RULES[move];
  if(!data)return '효과 정보 없음';
  const header=`${data.type} 타입`;
  switch(data.rule){
    case 'fixedDamage':return `${header} · 고정 피해 40\n타입 무효인 상대에게는 피해 없음`;
    case 'levelDamage':return `${header} · 자기 레벨만큼 피해\n타입 무효인 상대에게는 피해 없음`;
    case 'weightDamage':return `${header} · 위력 20~120\n상대가 무거울수록 위력 증가`;
    case 'drain':return `${header} · 위력 ${data.power}\n준 피해>0: 절반 HP 흡수(최소1)`;
    case 'protect':return `${header} · 이번 상대 공격 방어\n연속 사용하면 성공률 감소`;
    case 'defenseDrop':return `${header} · 상대 방어 1단계 하락\n최대 3단계 · 상대 교대 시 해제`;
    case 'attackDrop':return `${header} · 상대 공격 1단계 하락\n최대 3단계 · 상대 교대 시 해제`;
    case 'defenseUp':return `${header} · 자기 방어 1단계 상승\n최대 3단계 · 교대 시 해제`;
    case 'struggle':return `타입 상성 무시 · 위력 ${data.power}\n반동 최대HP1/4·최소1·기절주의`;
    case 'hazard':return `${header} · 상대 교대 때만 피해\n상대 최대HP·바위 상성에 비례`;
    case 'escape':return `${header} · 야생전에서 도주\n트레이너전에서는 효과 없음`;
    case 'nothing':return `${header} · 아무 효과 없음`;
    case 'damage':return `${header} · 위력 ${data.power}\n타입 상성에 따라 피해 변화`;
    default:return `${header}\n효과 정보 없음`;
  }
}
