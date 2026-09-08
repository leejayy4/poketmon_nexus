import type { Pokemon } from './types';
import { RUNTIME_SPECIES, SPECIES, availableMoves, pokemonMoves } from './pokemon';
import { LEVEL_CAP } from './growth';
import DATA from './runtime-pokemon-data.json';

// Only report future events supported by the current growth implementation.
export function growthPreview(p: Pokemon): string {
  const known=new Set(availableMoves(p));
  const selected=new Set(pokemonMoves(p));
  // No save/TM argument: only currently available natural moves can be pending.
  // Prefer the last unselected entry in the runtime learning order, retaining
  // earlier options in the move school rather than changing any selected slot.
  const pending=[...known].filter(move=>!selected.has(move)).at(-1);
  if(pending)return `배울 수 있음 · ${pending}`;
  if(p.level>=LEVEL_CAP)return '배운 기술은 기술 배우기에서 확인';
  const nextMove=RUNTIME_SPECIES[p.species]?.learnset
    .filter(entry=>entry.level>p.level&&entry.level<=LEVEL_CAP&&!known.has(entry.move))
    .sort((a,b)=>a.level-b.level)[0];
  const evolution=DATA.evolutions.find(e=>e.from===p.species&&e.level<=LEVEL_CAP);
  // Old valid saves can contain a starter already above its evolution level.
  const evolutionLevel=evolution?Math.max(evolution.level,p.level+1):null;
  if(evolution&&evolutionLevel!==null&&(!nextMove||evolutionLevel<=nextMove.level))return `다음 진화 Lv.${evolutionLevel} · ${SPECIES[evolution.to].name}`;
  if(nextMove)return `다음 기술 Lv.${nextMove.level} · ${nextMove.move}`;
  return '배운 기술은 기술 배우기에서 확인';
}
