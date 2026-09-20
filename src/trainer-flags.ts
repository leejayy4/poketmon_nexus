/** Save-flag key for an optional trainer battle already won.
 *
 * Kept dependency-free on purpose. Place and story modules read this key while a
 * world is still being constructed, so it must not pull in the map registry: it
 * previously lived in `road-trainers.ts`, whose `maps` import made every consumer
 * evaluate `maps.ts` from inside `explore-world.ts` and hit its initialisation order.
 * Add nothing here that imports maps, the engine or a place module.
 */
export const trainerWinFlag=(id:string)=>'trainerWon:'+id;
