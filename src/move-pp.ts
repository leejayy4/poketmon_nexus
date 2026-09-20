import { RUNTIME_MOVE_DATA } from './data/runtime';
import { RUNTIME_RULES } from './data/rules';
import type { Pokemon } from './types';

/** Shared PP rules for every region. Values come from the pinned exporter data;
 * never restate a move's PP in a place, gym or story module.
 *
 * Struggle keeps the series behaviour: it carries no counter, never spends PP and
 * stays selectable so an out-of-PP party can still act instead of soft-locking.
 * Opposing Pokemon are deliberately not PP limited yet; see docs/RUNTIME_DATABASE.md.
 */
export const STRUGGLE='발버둥';
/** Highest PP in the exported roster; the bound for a counter whose slot no
 * longer has a move, which `currentPp` ignores rather than reads. */
export const PP_CEILING=Math.max(...Object.values(RUNTIME_MOVE_DATA).map(m=>m.pp??0));
export const unlimitedPp=(move:string)=>RUNTIME_MOVE_DATA[move]?.rule==='struggle';
export function maxPp(move:string):number{return unlimitedPp(move)?0:RUNTIME_MOVE_DATA[move]?.pp??0}

/** Current PP aligned to `moves`. A missing, short or out-of-range saved entry
 * becomes that move's full PP so saves written before PP existed keep playing. */
export function currentPp(p:Pokemon,moves:readonly string[]):number[]{
  return moves.map((move,i)=>{
    const max=maxPp(move);if(!max)return 0;
    const saved=p.pp?.[i];
    return typeof saved==='number'&&Number.isInteger(saved)&&saved>=0&&saved<=max?saved:max;
  });
}
export function ppOf(p:Pokemon,moves:readonly string[],slot:number):number{return currentPp(p,moves)[slot]??0}
export function usablePp(p:Pokemon,moves:readonly string[],slot:number):boolean{
  const move=moves[slot];
  return move!==undefined&&(unlimitedPp(move)||ppOf(p,moves,slot)>0);
}
export const anyUsablePp=(p:Pokemon,moves:readonly string[])=>moves.some((_,i)=>usablePp(p,moves,i));
export function spendPp(p:Pokemon,moves:readonly string[],slot:number):void{
  const move=moves[slot];if(move===undefined||unlimitedPp(move))return;
  const list=currentPp(p,moves);list[slot]=Math.max(0,list[slot]-1);p.pp=list;
}
/** Pokemon Center rest and the same full-recovery points restore PP with HP. */
export function restorePp(p:Pokemon,moves:readonly string[]):void{p.pp=moves.map(maxPp)}
/** A replaced or newly learned move starts at its own full PP. */
export function resetSlotPp(p:Pokemon,moves:readonly string[],slot:number):void{
  const move=moves[slot];if(move===undefined)return;
  const list=currentPp(p,moves);list[slot]=maxPp(move);p.pp=list;
}
/** Shape and roster bounds only. A per-move maximum is enforced by `currentPp`,
 * which reads anything above a move's PP as that move's full PP, so a counter left
 * over from a replaced move cannot grant extra uses and does not invalidate a save.
 * Rejecting here would refuse whole files over a harmless stale entry. */
export function validPokemonPp(p:Pokemon,moves:readonly string[]):boolean{
  if(p.pp===undefined)return true;
  if(!Array.isArray(p.pp)||p.pp.length>Math.max(RUNTIME_RULES.moveCapacity,moves.length))return false;
  return p.pp.every(v=>typeof v==='number'&&Number.isInteger(v)&&v>=0&&v<=PP_CEILING);
}
