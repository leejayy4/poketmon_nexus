import type {BattleFrame} from './battle';

export const BATTLE_EFFECT_SECONDS=.6;
// A page-local drawing instruction. Never mutates the committed battle or save.
export function battleEffect(frame:BattleFrame|null,elapsed:number){
  const effect=frame?.effect;
  if(!effect||!Number.isFinite(elapsed)||elapsed<0||elapsed>=BATTLE_EFFECT_SECONDS)return null;
  const progress=elapsed/BATTLE_EFFECT_SECONDS;
  return {...effect,progress,rise:Math.round(progress*12),recoil:effect.kind==='damage'&&progress<.5?Math.round(Math.sin(progress*Math.PI*8)*3):0};
}

export function captureMotion(frame:BattleFrame|null,elapsed:number){
  if(frame?.capture!=='throw'||!Number.isFinite(elapsed)||elapsed<0)return null;
  if(elapsed<.45){const t=elapsed/.45;return {phase:'flight' as const,x:Math.round(80+116*t),y:Math.round(100-50*t-30*Math.sin(Math.PI*t)),hideEnemy:false};}
  if(elapsed<.65)return {phase:'settling' as const,x:196,y:Math.round(50+30*(elapsed-.45)/.2),hideEnemy:true};
  if(elapsed<1.25)return {phase:'settling' as const,x:196+Math.round(Math.sin((elapsed-.65)/.6*Math.PI*4)*3),y:80,hideEnemy:true};
  return {phase:'rest' as const,x:196,y:80,hideEnemy:true};
}
