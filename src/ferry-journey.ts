import type {Engine} from './engine';
import type {SaveData} from './types';
import {TOUR_SPAWNS} from './explore-world';

export interface FerryJourney {elapsed:number;duration:number;outbound:boolean}
type JourneyRun={save:SaveData;map:'tour_canalave'|'tour_vermilion';view:FerryJourney};
const runs=new WeakMap<Engine,JourneyRun>();
export const FERRY_DURATION=1.8;

function active(g:Engine){
  const run=runs.get(g);
  if(run&&(g.save!==run.save||g.save.map!==run.map||!g.save.flags.researchDelivered)){
    runs.delete(g);return undefined;
  }
  return run;
}
export function ferryJourneyView(g:Engine):FerryJourney|null{
  const run=active(g);return run?{...run.view}:null;
}
export function cancelFerryJourney(g:Engine):void{runs.delete(g);}
export function startFerryJourney(g:Engine,outbound:boolean):boolean{
  const map=outbound?'tour_canalave':'tour_vermilion';
  if(active(g)||g.save.map!==map||!g.save.flags.researchDelivered||g.battle||g.move||g.transition>0||g.panel!=='field')return false;
  g.dialogue=null;g.clearInput();
  runs.set(g,{save:g.save,map,view:{elapsed:0,duration:FERRY_DURATION,outbound}});
  return true;
}
/** Returns true for the whole arrival frame so no held movement can run afterward. */
export function updateFerryJourney(g:Engine,dt:number):boolean{
  const run=active(g);if(!run)return false;
  run.view.elapsed=Math.min(run.view.duration,run.view.elapsed+Math.max(0,dt));
  if(run.view.elapsed<run.view.duration)return true;
  runs.delete(g);
  const outbound=run.view.outbound;
  g.save.flags.ferryPass=true;g.save.map=outbound?'tour_vermilion':'tour_canalave';
  g.save.player={...TOUR_SPAWNS[g.save.map],facing:'down'};
  g.clearInput();g.labelTime=3;g.grassSteps=0;g.persist();
  g.say('조사선 선원',[outbound?'갈색항에 도착했습니다!\n돌아갈 때도 제게 말해 주세요.':'운하항에 도착했습니다!\n연구 연결길로 축복에 갈 수 있어요.']);
  return true;
}
