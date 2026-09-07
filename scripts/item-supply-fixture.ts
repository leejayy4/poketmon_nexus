import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
const save=newSave();grantPokemon(save,7);save.flags.departureCleared=true;
save.map='route_s01';save.player={x:29,y:12,facing:'left'};save.inventory={pokeBalls:0,potions:0};save.money=123;
if(!parseSave(JSON.stringify(save)))throw Error('invalid supply fixture');
writeFileSync('tests/item-supply-save.json',JSON.stringify(save,null,2));
