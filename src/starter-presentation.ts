import type {BattleFrame} from './battle';

export const STARTER_TECHNIQUE_SECONDS = .9;
export const STARTER_DAMAGE_SECONDS = .65;
export type StarterPresentationPhase = 'prepare'|'travel'|'afterglow'|'impact'|'hp';
export interface StarterPresentation {
  frame:BattleFrame;
  phase:StarterPresentationPhase;
  canAdvance:boolean;
  keepEnemyVisible:boolean;
  keepPlayerVisible:boolean;
}
// Art contract: dialogueElapsed is page-local seconds (not wall time).
// Declaration: prepare [0,.15), travel [.15,.65), afterglow [.65,+inf).
// Damage: impact [0,.15), hp [.15,+inf); HP is final at .65.
// Keep flags last for the entire damage page, including after canAdvance=true.
// Consumers use frame for drawing only; battleFrame remains the raw snapshot.
const moves = new Set(['불꽃세례','물대포','덩굴채찍']);
/** Page-local display only. Raw frames, resolved HP and saves are never changed. */
export function starterPresentation(frame:BattleFrame|null,previous:BattleFrame|null,elapsed:number):StarterPresentation|null {
  if(!frame)return null;
  const declaration=!!frame.technique&&moves.has(frame.technique.move);
  const damage=frame.effect?.kind==='damage'&&!!previous?.technique&&moves.has(previous.technique.move)
    &&previous.technique.target===frame.effect.target
    &&previous.active===frame.active&&previous.enemyIndex===frame.enemyIndex;
  if(!declaration&&!damage)return null;
  const time=Number.isFinite(elapsed)?Math.max(0,elapsed):0;
  const shown=structuredClone(frame);
  if(declaration)return {frame:shown,phase:time<.15?'prepare':time<.65?'travel':'afterglow',canAdvance:time>=STARTER_TECHNIQUE_SECONDS,keepEnemyVisible:false,keepPlayerVisible:false};
  const target=frame.effect!.target,before=previous![target].hp,after=frame[target].hp;
  const progress=Math.max(0,Math.min(1,(time-.15)/.5));
  shown[target].hp=before-Math.floor(Math.max(0,before-after)*progress);
  return {frame:shown,phase:time<.15?'impact':'hp',canAdvance:time>=STARTER_DAMAGE_SECONDS,
    keepEnemyVisible:target==='enemy'&&before>0,keepPlayerVisible:target==='player'&&before>0};
}
