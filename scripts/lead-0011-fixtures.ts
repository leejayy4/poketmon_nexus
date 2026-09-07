import fs from 'node:fs';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.map='tour_oreburgh_center';s.player={x:10,y:5,facing:'right'};
s.party=Array.from({length:6},(_,i)=>({...s.party[0],...(i?{species:399,hp:18,maxHp:maxHpAtLevel(399,5),moves:['몸통박치기','울음소리']}:{}),experience:i}));
s.box=Array.from({length:60},(_,i)=>({...s.party[0],species:74,hp:10,maxHp:maxHpAtLevel(74,5),experience:i%40,moves:['몸통박치기','웅크리기']}));
if(!parseSave(JSON.stringify(s)))throw Error('Invalid fixture');
fs.mkdirSync('tests/lead-0011-fixtures',{recursive:true});fs.writeFileSync('tests/lead-0011-fixtures/full-pc.json',JSON.stringify(s,null,2));
