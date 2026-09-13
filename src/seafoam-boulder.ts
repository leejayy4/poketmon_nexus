import type { Engine } from './engine';
import type { GameMap,SaveData } from './types';
import type { TourOutdoors } from './explore-outdoors';

export const SEAFOAM_BOULDER_MAP='tour_kanto_seafoam_b2f' as const;
export const SEAFOAM_BOULDER_EVENT='tourSeafoamB2Boulder';
export const SEAFOAM_BOULDER_MOVED='seafoamB2BoulderMoved';
export const SEAFOAM_BOULDER_START={x:17,y:21};
export const SEAFOAM_BOULDER_END={x:17,y:22};
const tiles=[{x:15,y:21},{x:16,y:21},{x:17,y:21},{x:17,y:20},{x:17,y:22}];
const sessions=new WeakMap<Engine,object>();
type PushMotion={save:Engine['save'];player:Engine['save']['player'];elapsed:number;valid:()=>boolean;done:()=>void};
const pushes=new WeakMap<Engine,PushMotion>();
const pushSeconds=.32;
const pushValid=(g:Engine,m:PushMotion)=>g.save===m.save&&g.save.player===m.player&&g.save.map===SEAFOAM_BOULDER_MAP&&!g.battle&&!g.move&&!g.transition&&!g.save.flags[SEAFOAM_BOULDER_MOVED]&&m.player.x===17&&m.player.y===20&&m.player.facing==='down'&&m.valid();
export function cancelSeafoamBoulderPush(g:Engine){pushes.delete(g);}
export function seafoamBoulderPushing(g:Engine){const m=pushes.get(g);return Boolean(m&&pushValid(g,m));}
export function startSeafoamBoulderPush(g:Engine,valid:()=>boolean,done:()=>void):boolean{
  const previous=pushes.get(g);if(previous&&!pushValid(g,previous))cancelSeafoamBoulderPush(g);
  if(pushes.has(g))return false;
  const m:PushMotion={save:g.save,player:g.save.player,elapsed:0,valid,done};
  if(!pushValid(g,m)||g.panel!=='field')return false;
  pushes.set(g,m);g.clearInput();return true;
}
/** Before normal input/locked returns. dt uses seconds; no saved position changes mid-push. */
export function updateSeafoamBoulderPush(g:Engine,dt:number){
  const m=pushes.get(g);if(!m)return;
  if(!pushValid(g,m)){cancelSeafoamBoulderPush(g);return;}
  m.elapsed+=Math.max(0,Math.min(Number.isFinite(dt)?dt:0,.05));
  if(m.elapsed<pushSeconds)return;
  cancelSeafoamBoulderPush(g);
  m.save.flags[SEAFOAM_BOULDER_MOVED]=true;m.player.x=17;m.player.y=21;m.player.facing='down';
  g.persist();g.clearInput();m.done();
}
export function seafoamBoulderPushView(g:Engine){
  const m=pushes.get(g);if(!m||!pushValid(g,m))return null;
  const t=Math.min(1,m.elapsed/pushSeconds);
  return {rock:{x:17,y:21+t},player:{x:17,y:20+t,facing:'down' as const}};
}

/** Initial authored additions are all previously blocked cells, never old save floor. */
export function installSeafoamBoulder(map:GameMap,outdoors:TourOutdoors){
  if(map.id!==SEAFOAM_BOULDER_MAP||map.props.some(p=>p.dialogue===SEAFOAM_BOULDER_EVENT))return;
  const rows=map.walkable.map(r=>r.split(''));
  for(const p of tiles)rows[p.y][p.x]='.';
  rows[21][17]='#';map.walkable=rows.map(r=>r.join(''));
  map.props.push({...SEAFOAM_BOULDER_START,dialogue:SEAFOAM_BOULDER_EVENT});
  outdoors.objects.push({name:'홈 위의 작은 둥근 바위',event:SEAFOAM_BOULDER_EVENT,cells:[SEAFOAM_BOULDER_START],pages:['북쪽의 마른 발판에서 남쪽 홈으로 밀면 암벽 사이의 가로 곁길이 열린다.']});
}

/** Rebuild authored cells and the one prop from flags; safe on an already projected map. */
export function applySeafoamBoulder(map:GameMap,flags:SaveData['flags']):GameMap{
  if(map.id!==SEAFOAM_BOULDER_MAP)return map;
  const rows=map.walkable.map(r=>r.split(''));
  for(const p of tiles)rows[p.y][p.x]='.';
  const rock=flags[SEAFOAM_BOULDER_MOVED]===true?SEAFOAM_BOULDER_END:SEAFOAM_BOULDER_START;
  rows[rock.y][rock.x]='#';
  return {...map,walkable:rows.map(r=>r.join('')),props:[...map.props.filter(p=>p.dialogue!==SEAFOAM_BOULDER_EVENT),{...rock,dialogue:SEAFOAM_BOULDER_EVENT}]};
}

export function handleSeafoamBoulder(g:Engine,event:string):boolean{
  if(seafoamBoulderPushing(g))return true;
  if(g.save.map!==SEAFOAM_BOULDER_MAP||event!==SEAFOAM_BOULDER_EVENT){sessions.delete(g);return false;}
  const save=g.save,player=save.player,token={};sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===SEAFOAM_BOULDER_MAP&&!g.battle&&!g.move&&sessions.get(g)===token;
  const close=()=>{if(sessions.get(g)===token)sessions.delete(g);};
  if(save.flags[SEAFOAM_BOULDER_MOVED]===true){g.say('홈에 멈춘 바위',['남쪽 홈에 바위가 안정돼 있다. 열린 가로 곁길은 서쪽 본선과 동쪽 암반 회랑을 잇는다.','계단으로 가는 기존 큰길도 그대로 열려 있다.']);return true;}
  const inPosition=()=>player.x===17&&player.y===20&&player.facing==='down';
  if(!inPosition()){g.say('바위를 밀 방향',['바위 남쪽에 멈춤 홈이 보인다. 북쪽 마른 발판에 서서 남쪽을 향해 밀어 보자.']);return true;}
  const clear=()=>{
    const map=g.map,p=SEAFOAM_BOULDER_END;
    return map.walkable[p.y]?.[p.x]==='.'&&!map.npcs.some(n=>n.x===p.x&&n.y===p.y)&&!map.props.some(o=>o.x===p.x&&o.y===p.y)&&!map.warps.some(w=>w.x===p.x&&w.y===p.y)&&!map.reserved?.some(r=>r.x===p.x&&r.y===p.y)&&map.props.some(o=>o.x===17&&o.y===21&&o.dialogue===SEAFOAM_BOULDER_EVENT);
  };
  g.say('홈 위의 작은 둥근 바위',['얼음 가루가 얇게 깔린 홈에 작은 바위가 걸쳐 있다. 남쪽 빈 홈으로 한 칸 밀 수 있다.'],undefined,[
    {label:'남쪽 홈으로 민다',action:()=>{
      if(!active()||!inPosition()||save.flags[SEAFOAM_BOULDER_MOVED])return;
      if(!clear()){g.say('바위 앞에서',['남쪽 홈에 방해물이 있다. 바위를 움직이지 않고 그대로 두었다.']);return;}
      g.say('바위를 밀 준비',['발판을 확인하고 바위에 손을 댔다. 남쪽 홈까지 밀어 보자.'],()=>{
        if(!active()||!inPosition()||save.flags[SEAFOAM_BOULDER_MOVED]||!clear())return;
        startSeafoamBoulderPush(g,()=>active()&&inPosition()&&clear(),()=>{
          close();g.say('열린 암벽 곁길',['바위가 남쪽 홈에 멈췄다. 한 걸음 앞으로 나와 열린 가로 곁길을 확인했다.','서쪽은 기존 큰길, 동쪽은 선택 암반 회랑이다. 아래층 계단은 큰길에서 그대로 갈 수 있다.']);
        });
      });
    }},
    {label:'그대로 둔다',action:close},
  ]);return true;
}

/** Paint these five ground tiles before actors, regardless of the cached background state. */
export function paintSeafoamBoulderGround(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!==SEAFOAM_BOULDER_MAP)return;
  c.save();for(const p of tiles){const x=p.x*16,y=p.y*16;c.fillStyle='#a0b6bc';c.fillRect(x,y,16,16);c.fillStyle='#728d9a';c.fillRect(x+3,y+9,8,1);c.fillStyle='#cbd9cf';c.fillRect(x+1,y+1,14,1);}
  c.strokeStyle='#597587';c.lineWidth=2;c.strokeRect(17*16+3,22*16+3,10,10);c.restore();
}
export function seafoamBoulderView(flags:SaveData['flags']){return flags[SEAFOAM_BOULDER_MOVED]===true?SEAFOAM_BOULDER_END:SEAFOAM_BOULDER_START;}
/** Put into its own actor depth layer at rock.y+.9, after the dynamic ground. */
export function paintSeafoamBoulder(c:CanvasRenderingContext2D,flags:SaveData['flags'],position?:{x:number;y:number}){
  const p=position??seafoamBoulderView(flags),x=p.x*16,y=p.y*16;c.save();
  c.fillStyle='#354758';c.fillRect(x+1,y+7,14,9);c.fillStyle='#7290a1';c.fillRect(x+2,y+1,12,12);
  c.fillStyle='#c0d4d4';c.fillRect(x+4,y-1,8,4);c.fillStyle='#94b0bd';c.fillRect(x+3,y+4,9,4);c.fillStyle='#4b667b';c.fillRect(x+5,y+11,9,3);c.restore();
}
