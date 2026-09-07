import fs from 'node:fs';
import {parseSave} from '../src/save';
import {maxHpAtLevel} from '../src/growth';
const dir='tests/lead-0005-fixtures';
const s=JSON.parse(fs.readFileSync(`${dir}/1.json`,'utf8'));Object.assign(s.party[0],{level:9,hp:maxHpAtLevel(1,9),maxHp:maxHpAtLevel(1,9)});if(!parseSave(JSON.stringify(s)))throw Error('learn');fs.writeFileSync(`${dir}/learn.json`,JSON.stringify(s,null,2));
const g=JSON.parse(fs.readFileSync(`${dir}/4.json`,'utf8'));Object.assign(g.party[0],{level:10,hp:maxHpAtLevel(4,10),maxHp:maxHpAtLevel(4,10)});g.map='eterna_gym';g.player={x:8,y:5,facing:'up'};g.badges=['BADGE-GS01'];g.keyItems=['TM-stealth-rock'];g.inventory.potions=0;if(!parseSave(JSON.stringify(g)))throw Error('supply');fs.writeFileSync(`${dir}/supply.json`,JSON.stringify(g,null,2));
const r=JSON.parse(fs.readFileSync(`${dir}/4.json`,'utf8'));r.map='route_s01';r.player={x:6,y:11,facing:'up'};fs.writeFileSync(`${dir}/road.json`,JSON.stringify(r,null,2));


