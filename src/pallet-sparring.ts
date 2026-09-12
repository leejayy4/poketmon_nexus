import type { Engine } from './engine';
import type { SaveData } from './types';
import { battleTurn, createTrainerBattle, type BattleAction } from './battle';
import { pokemonMoves, SPECIES } from './pokemon';

export function createPracticeBattle(source:SaveData,attacker:number,target:number){
  if(attacker===target||!source.party[attacker]||!source.party[target])return null;
  const save=structuredClone(source),player=save.party[attacker],opponent=save.party[target];
  player.hp=player.maxHp;opponent.hp=opponent.maxHp;save.party=[player];
  const battle=createTrainerBattle(save,{id:'pallet-simulation',name:'실험 상대',reward:0,team:[opponent]});
  if(!battle)return null;
  // No switches are offered, so no participants can be added later. This
  // suppresses growth even inside the disposable simulation copy.
  battle.participants=[];
  return {save,battle};
}

export function startPalletSparring(g:Engine,attacker:number,target:number,valid:()=>boolean,back:()=>void){
  const trial=createPracticeBattle(g.save,attacker,target);if(!trial||!valid())return;
  let revision=0,ended=false;
  const current=()=>!ended&&valid();
  const menu=()=>{
    if(!current())return;
    const token=++revision,p=trial.save.party[0],enemy=trial.battle.enemy;
    g.say('연속 모의전',[
      `${SPECIES[p.species].name} HP ${p.hp}/${p.maxHp}\n${SPECIES[enemy.species].name} HP ${enemy.hp}/${enemy.maxHp}`,
      '양쪽 모두 건강한 상태로 시작한다.\n실제 HP·경험치·도구는 바뀌지 않는다.',
    ],undefined,[
      ...pokemonMoves(p).map((move,index)=>({label:move,action:()=>{
        if(!current()||revision!==token)return;revision++;
        const result=battleTurn(trial.save,trial.battle,`move${index}` as BattleAction);
        const pages=result.outcome==='won'?[...result.pages.slice(0,-1),'모의전에서 이겼다!\n다른 기술 순서도 시험해 보자.']:result.pages;
        if(result.outcome){
          const endToken=revision;
          g.say('모의전 종료',pages,undefined,[
            {label:'같은 동료로 다시',action:()=>{if(!current()||revision!==endToken)return;ended=true;startPalletSparring(g,attacker,target,valid,back);}},
            {label:'기술 비교로',action:()=>{if(!current())return;ended=true;back();}},
            {label:'실험 끝내기',action:()=>{ended=true;}},
          ]);
        }else g.say('모의전 경과',pages,menu);
      }})),
      {label:'기술 비교로',action:()=>{if(!current())return;ended=true;back();}},
      {label:'실험 끝내기',action:()=>{ended=true;}},
    ]);
  };
  menu();
}
