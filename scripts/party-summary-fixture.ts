// Load through the existing save-file UI on a unique ?qa= URL.
import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
const s=newSave();grantPokemon(s,7);grantPokemon(s,25);s.party[1].hp=3;
s.party.push({species:399,level:3,hp:0,maxHp:18,experience:12,nature:'성실',met:'새잎 서쪽길'});
s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:2};
const raw=JSON.stringify(s,null,2);if(!parseSave(raw))throw Error('invalid party fixture');
writeFileSync(new URL('../tests/party-summary-save.json',import.meta.url),raw);
