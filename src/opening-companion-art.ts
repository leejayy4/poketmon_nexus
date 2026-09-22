import type { Engine } from './engine';
import type { Point,Direction } from './types';
import { paintTownPokemon } from './explore-life-art';
import { isNexusCampaign,isNexusStarter } from './nexus-starters';
import { NEXUS_OPENING } from './nexus-opening-state';

type Track={save:Engine['save'];species:number;move:Engine['move'];from:Point;to:Point;facing:Direction;steps:number};
const tracks=new WeakMap<Engine,Track>();

/** Presentation only: follow the player's previous tile, never reserve or move a save cell. */
export function openingCompanionLayer(g:Engine,images:Record<string,HTMLImageElement|HTMLCanvasElement>){
  const s=g.save,nexusWalk=isNexusCampaign(s)&&s.flags[NEXUS_OPENING.outside];
  const mon=s.party.find(p=>(nexusWalk?isNexusStarter(p.species):p.species===s.flags.openingWalkSpecies)&&p.hp>0);
  if(s.map!=='town'||!s.flags.openingPartnerIntroduced&&!nexusWalk||s.flags.departureCleared||!mon||g.battle||g.transition){tracks.delete(g);return null;}
  const safe=(p:Point)=>g.map.walkable[p.y]?.[p.x]==='.'&&!g.map.warps.some(w=>w.x===p.x&&w.y===p.y)&&!g.map.npcs.some(n=>n.x===p.x&&n.y===p.y);
  let t=tracks.get(g);
  if(!t||t.save!==s||t.species!==mon.species||s.steps<t.steps||s.steps-t.steps>1){
    const base=g.move?.from??s.player;
    const start=g.move?base:[{x:base.x,y:base.y+1},{x:base.x+1,y:base.y},{x:base.x-1,y:base.y}].find(safe);
    if(!start)return null;
    t={save:s,species:mon.species,move:g.move,from:{...start},to:{...base},facing:s.player.facing,steps:s.steps};tracks.set(g,t);
    if(!g.move)t.to={...start};
  }
  if(g.move&&g.move!==t.move){
    t.from={...t.to};t.to={...g.move.from};t.move=g.move;
    const dx=t.to.x-t.from.x,dy=t.to.y-t.from.y;
    if(Math.abs(dx)+Math.abs(dy)>1||!safe(t.to)){tracks.delete(g);return null;}
    t.facing=dx?'right':dy>0?'down':'up';if(dx<0)t.facing='left';
  }
  if(!g.move){t.from={...t.to};t.move=null;}
  t.steps=s.steps;
  const moving=!!g.move&&(t.from.x!==t.to.x||t.from.y!==t.to.y);
  const phase=moving?Math.min(1,g.move!.elapsed/g.move!.duration):1;
  const x=t.from.x+(t.to.x-t.from.x)*phase,y=t.from.y+(t.to.y-t.from.y)*phase;
  const facing=t.facing,species=mon.species;
  return {depth:y-.01,draw:(c:CanvasRenderingContext2D)=>{
    if(species===25){paintTownPokemon(c,images,{id:'openingCompanion',name:'피카츄',sprite:'field-pikachu',species:'pikachu',x,y,facing,dialogue:'',pages:[]},0,s.player.facing,false,moving?phase:0);return;}
    const sprite=images[(facing==='up'?'pokemon-back-':'pokemon-')+species];if(!sprite)return;
    const hop=moving?Math.sin(phase*Math.PI)*2:0;
    c.save();c.translate(Math.round(x*16+8),Math.round(y*16+8));
    c.fillStyle='#293d3945';c.beginPath();c.ellipse(0,-1,6,2,0,0,Math.PI*2);c.fill();
    if(facing==='left')c.scale(-1,1);
    c.translate(0,-hop);c.rotate(moving?Math.sin(phase*Math.PI*2)*.055:0);
    c.drawImage(sprite,-14,-26,28,28);c.restore();
  }};
}
