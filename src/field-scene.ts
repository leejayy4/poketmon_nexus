import type { Engine } from './engine';
import type { Choice } from './types';

/** A completed field scene may act once, on the save and tile that opened it. */
export function sayField(g:Engine,speaker:string,pages:string[],after?:()=>void,choices?:Choice[]):void {
  const save=g.save,map=save.map,{x,y}=save.player;
  let used=false,serial=0;
  const guarded=(action:()=>void)=>()=>{
    if(used||g.sceneRevision!==serial||g.save!==save||save.map!==map||save.player.x!==x||save.player.y!==y||g.dialogue||g.battle||g.move||g.transition)return;
    used=true;action();
  };
  g.say(speaker,pages,after&&guarded(after),choices?.map(choice=>({...choice,action:guarded(choice.action)})));
  serial=g.sceneRevision;
}
