import type { GameMap,SaveData } from './types';

const stations=[
  {event:'tourIcirrusMoorReeds',flag:'icirrusMoorReedsObserved'},
  {event:'tourIcirrusMoorBirds',flag:'icirrusMoorBirdsObserved'},
  {event:'tourIcirrusMoorNorth',flag:'icirrusMoorObservationCompleted'},
] as const;

/** Field records use the existing investigation flags; painting never advances progress. */
export function icirrusMoorObservationLayers(c:CanvasRenderingContext2D,map:GameMap,save:SaveData,clock:number){
  if(map.id!=='tour_icirrus_moor')return [];
  const slot=save.flags.icirrusMoorPartnerSlot;
  const partner=typeof slot==='number'?save.party[slot]:undefined;
  const ready=!save.flags.icirrusMoorObservationCompleted&&!!partner&&partner.hp>0&&partner.species===save.flags.icirrusMoorPartnerSpecies;
  const next=stations.findIndex(station=>!save.flags[station.flag]);
  return stations.flatMap((station,index)=>{
    const prop=map.props.find(p=>p.dialogue===station.event);if(!prop)return [];
    const recorded=!!save.flags[station.flag],x=prop.x*16,y=prop.y*16;
    return [{depth:prop.y+.2,draw:()=>{
      const r=(dx:number,dy:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x+dx,y+dy,w,h);};
      c.save();
      try{
        r(2,11,12,4,'#405950');r(4,4,3,10,'#6f7359');r(10,4,3,10,'#6f7359');
        r(0,-8,16,18,'#546963');r(1,-7,14,14,'#d4c89e');
        if(index===0){
          // A graduated gauge, then the traveller's measured reference line.
          r(4,-5,2,11,'#657b72');for(let i=0;i<4;i++)r(6,-4+i*3,4,1,'#7b886c');
          // Visible evidence precedes the answer; the recorded tick appears afterwards.
          r(2,1,11,2,'#3e807d');
          if(recorded){r(11,-1,2,2,'#ad664c');r(12,-3,2,3,'#ad664c');}
        }else if(index===1){
          // Feather silhouette remains visible before observation; notes fill in afterwards.
          for(let i=0;i<7;i++){r(4+i,-4+i,2,2,'#637970');if(i<5)r(6+i,-4+i,3,1,'#9eac8b');}
          if(recorded){r(3,4,5,1,'#456c66');r(9,4,3,1,'#456c66');}
        }else{
          r(7,-5,1,10,'#aa9d7c');
          if(save.flags.icirrusMoorReedsObserved)for(let i=0;i<3;i++)r(2,-4+i*3,4,1,'#527972');
          if(save.flags.icirrusMoorBirdsObserved)for(let i=0;i<3;i++)r(9,-4+i*3,4,1,'#527972');
          if(recorded){r(4,6,8,3,'#416e64');r(7,6,2,2,'#d8d5ad');}
        }
        // A small bookmark marks the next stop only while the chosen companion can continue.
        if(ready&&index===next){const lift=Math.round(Math.sin(clock*3));r(5,-14+lift,6,2,'#e8d59b');r(6,-12+lift,4,2,'#e8d59b');r(7,-10+lift,2,1,'#e8d59b');}
      }finally{c.restore();}
    }}];
  });
}

/** A stationary observation companion, not a roaming NPC or collision actor. */
export function icirrusMoorPartnerLayer(map:GameMap,save:SaveData,draw:(species:number,x:number,y:number)=>void){
  // Completed notes are historical; their old party slot cannot identify an actor.
  if(map.id!=='tour_icirrus_moor'||save.flags.icirrusMoorObservationCompleted)return [];
  const slot=save.flags.icirrusMoorPartnerSlot;
  const partner=typeof slot==='number'?save.party[slot]:undefined;
  if(!partner||partner.hp<=0||partner.species!==save.flags.icirrusMoorPartnerSpecies)return [];
  const player=save.player;
  const station=map.props.find(prop=>stations.some(s=>s.event===prop.dialogue)&&Math.abs(prop.x-player.x)+Math.abs(prop.y-player.y)<=3);
  if(!station)return [];
  // Reserve the player's immediate interaction face and every functional tile.
  const candidates=[{x:station.x-1,y:station.y+1},{x:station.x+1,y:station.y+1},{x:station.x-1,y:station.y-1},{x:station.x+1,y:station.y-1}];
  const position=candidates.find(p=>map.walkable[p.y]?.[p.x]==='.'&&
    Math.abs(p.x-player.x)+Math.abs(p.y-player.y)>1&&
    !map.npcs.some(n=>n.x===p.x&&n.y===p.y)&&
    !map.props.some(n=>n.x===p.x&&n.y===p.y)&&
    !map.warps.some(n=>n.x===p.x&&n.y===p.y));
  if(!position)return [];
  return [{depth:position.y,draw:()=>draw(partner.species,position.x*16+8,position.y*16+8)}];
}
