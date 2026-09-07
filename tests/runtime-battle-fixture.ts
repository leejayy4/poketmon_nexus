import {createBattle as createRuntimeBattle} from '../src/battle';
import type {SaveData} from '../src/types';
import type {GymId} from '../src/gyms';
// Explicitly construct the lowest S02 slot/level for turn/presentation tests.
// The runtime continues to reject unbound maps; geometry is tested separately.
export function createBattle(save:SaveData,kind:'wild'|'gym'='wild',gym:GymId='roark'){
  return createRuntimeBattle(kind==='wild'?{...save,map:'route_s01'}:save,kind,gym,()=>0);
}
