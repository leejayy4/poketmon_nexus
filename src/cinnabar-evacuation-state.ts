import type { GameMap,NPC,SaveData } from './types';

export const CINNABAR_EVAC_MAP='tour_cinnabar_control_site' as const;
export const CINNABAR_MEWTWO_ASSISTED='nexusCinnabarMewtwoAssisted';
export const CINNABAR_SHORE_HANDOFF='nexusCinnabarShoreHandoffComplete';
export const CINNABAR_SHORE_EVENT='tourCinnabarShoreHandoff';
export const CINNABAR_EVACUEES=[
  {id:'cinnabarSitePikachu',name:'피카츄',sprite:'field-pikachu',event:'tourCinnabarEvacuatePikachu',flag:'nexusCinnabarPikachuEvacuation',shelter:{x:18,y:23},east:{x:33,y:23},lobby:{x:18,y:42},shore:{x:40,y:40}},
  {id:'cinnabarSiteMachop',name:'알통몬',sprite:'field-machop',event:'tourCinnabarEvacuateMachop',flag:'nexusCinnabarMachopEvacuation',shelter:{x:23,y:23},east:{x:35,y:24},lobby:{x:22,y:42},shore:{x:43,y:40}},
] as const;
// 0 shelter; 1 east checkpoint; 2 south lobby; 3 shore awaiting handoff; 4 handed over.
export const evacuationStage=(flags:SaveData['flags'],key:string)=>{
  const value=flags[key];return typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<=4?value:0;
};
export const cinnabarAllHandedOver=(flags:SaveData['flags'])=>CINNABAR_EVACUEES.every(mon=>evacuationStage(flags,mon.flag)===4);

/** Idempotent save projection, also safe when applied to an already projected roaming map. */
export function applyCinnabarEvacuation(map:GameMap,flags:SaveData['flags']):GameMap{
  if(map.id!==CINNABAR_EVAC_MAP&&map.id!=='tour_cinnabar')return map;
  const ids=new Set<string>([...CINNABAR_EVACUEES.map(mon=>mon.id),'cinnabarEvacMewtwo','cinnabarShoreYujin','cinnabarSiteYujin']);
  const npcs=map.npcs.filter(n=>!ids.has(n.id));
  for(const mon of CINNABAR_EVACUEES){
    const stage=evacuationStage(flags,mon.flag),inside=stage<3;
    if((map.id===CINNABAR_EVAC_MAP)!==inside)continue;
    const point=stage===0?mon.shelter:stage===1?mon.east:stage===2?mon.lobby:mon.shore;
    npcs.push({id:mon.id,name:stage===4?'해안에서 쉬는 '+mon.name:mon.name,sprite:mon.sprite,...point,facing:'down',dialogue:mon.event});
  }
  if(map.id===CINNABAR_EVAC_MAP&&CINNABAR_EVACUEES.some(mon=>evacuationStage(flags,mon.flag)===2)&&!flags[CINNABAR_MEWTWO_ASSISTED]){
    npcs.push({id:'cinnabarEvacMewtwo',name:'뮤츠',sprite:'cinnabar-mewtwo',x:24,y:42,facing:'left',dialogue:'tourCinnabarMewtwoWitness'});
  }
  if(map.id==='tour_cinnabar'&&CINNABAR_EVACUEES.some(mon=>evacuationStage(flags,mon.flag)>=3)){
    npcs.push({id:'cinnabarShoreYujin',name:'유진',sprite:'school_kid_m',x:42,y:41,facing:'up',dialogue:CINNABAR_SHORE_EVENT});
  }
  // Yujin accompanies the shore handoff once either evacuee reaches the coast.
  const shoreStarted=CINNABAR_EVACUEES.some(mon=>evacuationStage(flags,mon.flag)>=3);
  if(!shoreStarted&&map.id===CINNABAR_EVAC_MAP)npcs.push({id:'cinnabarSiteYujin',name:'유진',sprite:'school_kid_m',x:20,y:25,facing:'down',dialogue:'tourCinnabarSiteArrival'});
  return {...map,npcs};
}

/** A code-drawn story apparition; no capturable species or external sprite is registered. */
export function paintCinnabarEvacuationNpc(c:CanvasRenderingContext2D,n:NPC):boolean{
  if(n.id!=='cinnabarEvacMewtwo')return false;
  const x=n.x*16,y=n.y*16;
  c.save();c.fillStyle='#76648655';c.beginPath();c.ellipse(x+8,y+13,11,4,0,0,Math.PI*2);c.fill();
  c.strokeStyle='#957caf';c.lineWidth=4;c.beginPath();c.moveTo(x+10,y+6);c.bezierCurveTo(x+24,y+11,x+22,y-10,x+15,y-12);c.stroke();
  c.fillStyle='#c9c8d4';c.fillRect(x+3,y-8,10,16);c.fillRect(x+1,y+5,5,8);c.fillRect(x+10,y+5,5,8);
  c.beginPath();c.ellipse(x+8,y-13,7,6,0,0,Math.PI*2);c.fill();
  c.fillRect(x+2,y-22,3,6);c.fillRect(x+11,y-22,3,6);c.fillRect(x-2,y-5,5,4);c.fillRect(x+13,y-5,5,4);
  c.fillStyle='#9980ad';c.fillRect(x+5,y-2,6,8);c.fillStyle='#68547e';c.fillRect(x+3,y-14,3,2);c.fillRect(x+10,y-14,3,2);c.restore();return true;
}
