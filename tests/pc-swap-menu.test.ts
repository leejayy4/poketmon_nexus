import test from 'node:test';
import assert from 'node:assert/strict';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import type {Engine} from '../src/engine';
import type {Choice} from '../src/types';
import {showPcSwap} from '../src/pc-swap-menu';
import {maxHpAtLevel} from '../src/growth';

function fixture(){
 const save=newSave();grantPokemon(save,7);save.flags.departureCleared=true;save.map='tour_jubilife_center';save.player={x:10,y:5,facing:'right'};
 save.party=Array.from({length:6},(_,i)=>({...save.party[0],...(i?{species:399,hp:18,maxHp:maxHpAtLevel(399,5),moves:['몸통박치기','울음소리']}:{}),experience:i}));
 save.box=Array.from({length:60},(_,i)=>({...save.party[0],species:74,hp:1,maxHp:maxHpAtLevel(74,5),experience:i%40,moves:['몸통박치기','웅크리기']}));
 let dialogue:{pages:string[];choices:Choice[];selected:number;after?:()=>void}={pages:[],choices:[],selected:0},writes=0;
 const g={save,battle:null,say(_s:string,pages:string[],after?:()=>void,choices:Choice[]=[]){dialogue={pages,choices,after,selected:0};this.dialogue=dialogue;},persist(){writes++;}} as unknown as Engine;
 return {g,get d(){return dialogue;},get writes(){return writes;},choose(label:string){const c=dialogue.choices.find(c=>c.label===label);assert(c,label);c.action();}};
}
test('full party and full box can select later pages, compare, cancel and swap once',()=>{
 const f=fixture(),s=f.g.save,before=structuredClone(s);showPcSwap(f.g,()=>{});
 f.choose('다음 페이지');f.choose('꼬마돌 Lv.5');f.choose('다음 페이지');f.choose('비버니 Lv.5');
 assert.equal(f.d.selected,1);assert.deepEqual(s,before);for(const p of f.d.pages)assert(p.split('\n').length<=3);
 f.choose('다시 고른다');assert.deepEqual(s,before);f.choose('비버니 Lv.5');
 const action=f.d.choices[0].action,party=s.party[3],boxed=s.box![3];action();action();
 assert.equal(s.party[3],boxed);assert.equal(s.box![3],party);assert.equal(s.party.length,6);assert.equal(s.box!.length,60);assert.equal(f.writes,1);
 assert(parseSave(JSON.stringify(s)));f.d.after!();assert(f.d.pages[0].includes('2/20쪽'));
});
test('stale swap confirmations do not mutate another save, location, battle or selected individual',()=>{
 for(const mutation of [(g:Engine)=>{g.save=structuredClone(g.save);},(g:Engine)=>{g.save.map='route_s01';},(g:Engine)=>{g.battle={} as NonNullable<Engine['battle']>;},(g:Engine)=>{g.save.box![0]={...g.save.box![0]};}]){
  const f=fixture();showPcSwap(f.g,()=>{});f.choose('꼬마돌 Lv.5');f.choose('비버니 Lv.5');const action=f.d.choices[0].action;mutation(f.g);const before=structuredClone(f.g.save);action();assert.deepEqual(f.g.save,before);assert.equal(f.writes,0);
 }
});
test('empty storage returns to PC without changing the save',()=>{
 const f=fixture();f.g.save.box=[];let back=0;showPcSwap(f.g,()=>{back++;});assert(f.d.pages[0].includes('아직 보관'));f.choose('PC 메뉴로');assert.equal(back,1);assert.equal(f.writes,0);
});
