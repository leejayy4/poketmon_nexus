import type { Engine } from './engine';
import type { Direction,Point } from './types';
import { CINNABAR_EVAC_MAP,CINNABAR_EVACUEES,evacuationStage } from './cinnabar-evacuation-state';

type Motion={save:Engine['save'];player:Engine['save']['player'];id:string;flag:string;stage:number;path:Point[];step:number;elapsed:number;done:()=>void};
const motions=new WeakMap<Engine,Motion>();
const tileSeconds=.16;
const ready=(g:Engine,m:Motion)=>g.save===m.save&&g.save.player===m.player&&g.save.map===CINNABAR_EVAC_MAP&&!g.battle&&evacuationStage(g.save.flags,m.flag)===m.stage&&Boolean(g.save.flags.nexusSilphRecordsSecured&&g.save.flags.nexusCinnabarProtectionReady&&g.save.flags.nexusCinnabarEvacuationReady&&g.save.flags.nexusCinnabarControlSeparated);
const passable=(g:Engine,id:string,p:Point)=>{
  const map=g.map;
  return map.walkable[p.y]?.[p.x]==='.'&&!map.props.some(o=>o.x===p.x&&o.y===p.y)&&!map.npcs.some(n=>n.id!==id&&n.x===p.x&&n.y===p.y)&&!map.reserved?.some(r=>r.x===p.x&&r.y===p.y)&&!map.warps.some(w=>w.x===p.x&&w.y===p.y)&&!(g.save.player.x===p.x&&g.save.player.y===p.y);
};

export function cancelCinnabarEvacuationMotion(g:Engine){motions.delete(g);}
export function cinnabarEvacuationMoving(g:Engine):boolean{
  const motion=motions.get(g);return Boolean(motion&&ready(g,motion));
}
export function startCinnabarEvacuationMotion(g:Engine,id:string,done:()=>void):boolean{
  const previous=motions.get(g);if(previous&&!ready(g,previous))cancelCinnabarEvacuationMotion(g);
  if(motions.has(g))return false;
  const mon=CINNABAR_EVACUEES.find(m=>m.id===id);if(!mon)return false;
  const stage=evacuationStage(g.save.flags,mon.flag);if(stage>1)return false;
  const start=stage===0?mon.shelter:mon.east,end=stage===0?mon.east:mon.lobby;
  const motion:Motion={save:g.save,player:g.save.player,id,flag:mon.flag,stage,path:[],step:0,elapsed:0,done};
  if(!ready(g,motion)||g.move||g.transition||g.panel!=='field')return false;
  if(!g.map.npcs.some(n=>n.id===id&&n.x===start.x&&n.y===start.y))return false;
  const key=(p:Point)=>p.x+','+p.y,queue:Point[]=[start],parents=new Map<string,Point|null>([[key(start),null]]);
  for(let i=0;i<queue.length;i++){
    const p=queue[i];if(key(p)===key(end))break;
    for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]){
      const q={x:p.x+dx,y:p.y+dy};if(parents.has(key(q))||!passable(g,id,q))continue;
      parents.set(key(q),p);queue.push(q);
    }
  }
  if(!parents.has(key(end))){g.say(mon.name,['대기 자리까지 안전하게 지날 길이 막혀 있다. 통로에서 조금 비켜선 뒤 다시 안내하자.']);return false;}
  let point:Point|null=end;while(point){motion.path.unshift(point);point=parents.get(key(point))??null;}
  motions.set(g,motion);g.clearInput();return true;
}

/** Run once per frame before the normal locked/input early return. dt is seconds. */
export function updateCinnabarEvacuationMotion(g:Engine,dt:number){
  const m=motions.get(g);if(!m)return;
  if(!ready(g,m)){cancelCinnabarEvacuationMotion(g);return;}
  const target=m.path[m.step+1];
  if(target&&!passable(g,m.id,target)){
    cancelCinnabarEvacuationMotion(g);g.say('대피 잠시 멈춤',['앞길이 막혀 안내를 멈췄다. 포켓몬은 마지막으로 확인한 대기 자리에서 다시 안내할 수 있다.']);return;
  }
  m.elapsed+=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.05));
  if(m.elapsed<tileSeconds)return;
  m.elapsed-=tileSeconds;m.step++;
  if(m.step<m.path.length-1)return;
  if(!ready(g,m)){cancelCinnabarEvacuationMotion(g);return;}
  // Only arrival commits a stage. Saves made mid-motion retain the old checkpoint.
  cancelCinnabarEvacuationMotion(g);m.save.flags[m.flag]=m.stage+1;g.persist();g.clearInput();
  const mon=CINNABAR_EVACUEES.find(candidate=>candidate.id===m.id);
  g.notice(`${mon?.name??'포켓몬'}: ${m.stage===0?'동쪽 대기 자리':'남쪽 로비'}에 도착했어요.`);
  m.done();
}

/** Tile-space position for the existing sprite, depth ordering and optional camera focus. */
export function cinnabarEvacuationMotionView(g:Engine):{id:string;x:number;y:number;facing:Direction}|null{
  const m=motions.get(g);if(!m||!ready(g,m))return null;
  const a=m.path[m.step],b=m.path[m.step+1]??a,t=Math.min(1,m.elapsed/tileSeconds);
  const facing:Direction=b.x>a.x?'right':b.x<a.x?'left':b.y<a.y?'up':'down';
  return {id:m.id,x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,facing};
}
