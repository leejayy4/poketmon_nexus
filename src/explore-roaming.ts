import type { Direction,GameMap,Point } from './types';
import type { TownPokemon } from './explore-pokemon';

const directions:[Direction,number,number][]=[['right',1,0],['down',0,1],['left',-1,0],['up',0,-1]];
const same=(a:Point,b:Point)=>a.x===b.x&&a.y===b.y;
const distance=(a:Point,b:Point)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);

// Stay in open areas, away from entrances, investigation fronts and other minimap markers.
export function roamingTiles(map:GameMap,home:Point):Point[]{
  const scale=Math.min(6,126/map.height),others=map.npcs.filter(n=>n.id!=='tourPokemon');
  const floor=(x:number,y:number)=>map.walkable[y]?.[x]==='.'&&!others.some(n=>n.x===x&&n.y===y);
  const candidates:Point[]=[];
  for(let y=home.y-2;y<=home.y+2;y++)for(let x=home.x-2;x<=home.x+2;x++){
    const p={x,y};if(!floor(x,y)||!directions.every(([,dx,dy])=>floor(x+dx,y+dy)))continue;
    if([...map.warps,...map.props].some(q=>distance(p,q)<=1))continue;
    if([...others,...map.warps.filter(w=>w.to.endsWith('_hall')||w.to.endsWith('_center'))].some(q=>Math.abs(q.x-x)*scale<12&&Math.abs(q.y-y)*scale<12))continue;
    candidates.push(p);
  }
  const reached:Point[]=[{...home}];
  for(const p of reached)for(const [,dx,dy]of directions){const q={x:p.x+dx,y:p.y+dy};if(candidates.some(t=>same(t,q))&&!reached.some(t=>same(t,q)))reached.push(q);}
  return reached;
}

export class TownRoaming {
  npc:TownPokemon;
  tiles:Point[];
  move:null|{from:Point;to:Point;elapsed:number;duration:number}=null;
  wait=1.5; cursor=0; revision=0;
  previous:Point|null=null;
  constructor(public base:GameMap,home:TownPokemon,player:Point){
    this.tiles=roamingTiles(base,home);
    const start=this.tiles.find(p=>!same(p,player))!;
    this.npc={...home,...start};
  }
  get position(){
    if(!this.move)return {...this.npc};
    const m=this.move,t=m.elapsed/m.duration;
    return {...this.npc,x:m.from.x+(m.to.x-m.from.x)*t,y:m.from.y+(m.to.y-m.from.y)*t};
  }
  get map():GameMap {
    return {...this.base,reserved:this.move?[this.move.to]:[],npcs:this.base.npcs.map(n=>n.id==='tourPokemon'?this.npc:n)};
  }
  update(dt:number,player:Point,playerTarget:Point|undefined,paused:boolean){
    if(paused)return;
    if(this.move){
      this.move.elapsed=Math.min(this.move.duration,this.move.elapsed+dt);
      if(this.move.elapsed>=this.move.duration){this.previous=this.move.from;Object.assign(this.npc,this.move.to);this.move=null;this.wait=1.4;this.revision++;}
      return;
    }
    if(distance(this.npc,player)<=2||(playerTarget&&distance(this.npc,playerTarget)<=2)){this.wait=1.4;return;}
    this.wait-=dt;if(this.wait>0)return;this.wait=1.4;
    for(let i=0;i<directions.length*2;i++){
      const index=(this.cursor+i)%directions.length,[facing,dx,dy]=directions[index],to={x:this.npc.x+dx,y:this.npc.y+dy};
      if(!this.tiles.some(p=>same(p,to))||same(to,player)||(playerTarget&&same(to,playerTarget)))continue;
      if(i<directions.length&&this.previous&&same(to,this.previous))continue;
      this.cursor=(index+1)%directions.length;this.npc.facing=facing;
      this.move={from:{x:this.npc.x,y:this.npc.y},to,elapsed:0,duration:.32};this.revision++;return;
    }
  }
}
