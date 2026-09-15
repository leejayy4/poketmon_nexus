import type { Engine } from './engine';
import type { Furnishing,TourInterior } from './explore-interiors';
import type { GameMap } from './types';
import { SPECIES } from './pokemon';
import { withParticle } from './korean-text';

export const CELESTIC_TRACE_EVENT='tourCelesticRuinsTrace';
export const CELESTIC_TRACE_DONE='celesticRuinsTraceCompleted';
const MAP='tour_celestic_ruins',DONE='coronet211LayersCompared',TRACE=CELESTIC_TRACE_DONE;
const SLOT='coronet211PartnerSlot',PARTNER='coronet211Partner';

export function installCelesticTrace(map:GameMap,room:TourInterior){
  if(map.id!==MAP||map.props.some(p=>p.dialogue===CELESTIC_TRACE_EVENT))return;
  const o:Furnishing={kind:'workbench',name:'전승 문양 모사대',pages:['천관산 현장 기록을 벽화 문양과 나란히 맞춰 보는 낮은 작업대다.'],x:3,y:14,w:5,h:2,event:CELESTIC_TRACE_EVENT};
  const rows=map.walkable.map(r=>r.split(''));
  for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){rows[y][x]='#';map.props.push({x,y,dialogue:o.event});}
  map.walkable=rows.map(r=>r.join(''));room.objects.push(o);
}

/** Live result layer; the footprint is the registered blocked furnishing only. */
export function paintCelesticTrace(c:CanvasRenderingContext2D,map:GameMap,flags:Engine['save']['flags']){
  if(map.id!==MAP)return;
  const x=3*16,y=14*16,w=5*16,h=2*16,fill=(dx:number,dy:number,rw:number,rh:number,color:string)=>{c.fillStyle=color;c.fillRect(x+dx,y+dy,rw,rh);};
  c.save();fill(2,12,w-4,h-12,'#6f6255');fill(6,4,w-12,h-14,'#e8dcba');fill(9,7,w-18,2,'#b9aa86');
  if(flags[TRACE]){
    for(let i=0;i<3;i++){const cx=Math.round(w*(i+1)/4);fill(cx-5,10+(i===1?5:0),10,4,'#788f85');fill(cx-2,7+(i===1?5:0),4,10,'#788f85');}
    fill(13,22,21,2,'#8b7b67');fill(34,20,2,7,'#8b7b67');fill(36,25,24,2,'#8b7b67');
  }else{for(let row=0;row<3;row++)fill(12,11+row*5,w-26,1,'#b9aa86');}
  fill(w-14,6,3,17,'#9d7058');fill(w-15,21,5,3,'#e1c889');c.restore();
}

export function handleCelesticTrace(g:Engine,event:string):boolean{
  if(event!==CELESTIC_TRACE_EVENT||g.save.map!==MAP)return false;
  const save=g.save,current=()=>g.save===save&&save.map===MAP&&!g.battle&&!g.move&&!g.transition;
  const slot=save.flags[SLOT],mon=typeof slot==='number'?save.party[slot]:undefined;
  const selected=()=>mon&&save.party[slot as number]===mon&&mon.species===save.flags[PARTNER]?mon:undefined;
  const guide=(map:Parameters<Engine['setTourDestination']>[0],target:string)=>()=>{if(current())g.setTourDestination(map,target);};
  const menu=()=>{
    if(!current())return;
    if(save.flags[TRACE]){
      const species=save.flags[PARTNER],name=typeof species==='number'?SPECIES[species]?.name:undefined;
      g.say('전승 문양 모사대',[name?`${name}와 천관산 지층선을 맞춰 만든 모사가 보존되어 있다.`:'천관산 지층선과 벽화 문양을 맞춘 모사가 보존되어 있다.','모사지는 유적에 남기고 동료와 다음 산길을 준비할 수 있다.'],undefined,[{label:'벽화와 다시 비교',action:guide(MAP,'tourCelesticRuinsMural')},{label:'센터에서 동료 돌보기',action:guide('tour_celestic_center','tourHost')},{label:'210번도로로 출발',action:guide('tour_sinnoh_route_210_north','route210NorthWalker')}]);return;
    }
    if(!save.flags[DONE]){g.say('전승 문양 모사대',['먼저 천관산 211 통과층의 밝은 지층과 짙은 지층을 한 동료와 모두 기록하자.'],undefined,[{label:'천관산 현장으로',action:guide('tour_coronet_211_pass','coronet211Guide')},{label:'나중에 이어가기',action:()=>{}}]);return;}
    const partner=selected();
    if(!partner){g.say('전승 문양 모사대',['현장 기록을 함께 만든 동료가 현재 파티에 없다. 기록은 유지된다.'],undefined,[{label:'센터 PC로',action:guide('tour_celestic_center','tourPC')},{label:'나중에 이어가기',action:()=>{}}]);return;}
    if(partner.hp<=0){g.say('전승 문양 모사대',[`${withParticle(SPECIES[partner.species].name,'은/는')} 지금 쉬어야 한다. 현장 기록은 그대로 남아 있다.`],undefined,[{label:'센터에서 회복',action:guide('tour_celestic_center','tourHost')},{label:'나중에 이어가기',action:()=>{}}]);return;}
    g.say('전승 문양 모사대',[`${withParticle(SPECIES[partner.species].name,'과/와')} 기록한 밝은 균열과 짙은 물자국을 얇은 종이에 옮겨 보자.`,'현장 지층을 살펴본 순서대로 문양 주위의 선을 맞춘다.'],undefined,[{label:'밝은 균열→짙은 물자국',action:()=>{if(!current()||selected()!==partner||!save.flags[DONE])return;save.flags[TRACE]=true;g.persist();g.audio.play('confirm');menu();}},{label:'짙은 물자국→밝은 균열',action:()=>{if(current())g.say('전승 문양 모사대',['현장 기록은 서쪽의 밝고 어긋난 균열에서 동쪽의 짙은 물자국으로 이어졌다. 순서를 다시 맞춰 보자.'],()=>{if(current())menu();});}},{label:'나중에 맞추기',action:()=>{}}]);
  };
  menu();return true;
}
