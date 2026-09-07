import {writeFileSync} from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
// Public import fixture for reward display near the existing money cap.
const save=newSave();grantPokemon(save,7);
Object.assign(save.party[0],{level:25,hp:maxHpAtLevel(7,25),maxHp:maxHpAtLevel(7,25)});
save.flags.departureCleared=true;save.map='oreburgh_gym';save.player={x:8,y:5,facing:'up'};save.money=999990;
if(!parseSave(JSON.stringify(save)))throw Error('invalid reward fixture');
writeFileSync('tests/gym-reward-save.json',JSON.stringify(save,null,2));
