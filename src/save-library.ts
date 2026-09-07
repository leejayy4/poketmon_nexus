import { markTourVisit } from './explore-journal';
import { getMap } from './maps';
import { parseSave } from './save';
import type { SaveData } from './types';

export interface SaveFile { format:'first-partner-save'; savedAt:string; save:SaveData }
export interface SaveStorage { getItem(key:string):string|null; setItem(key:string,value:string):void }

// Saves capture a stable field position; dialogue and menus reopen through normal interaction.
export function checkpoint(save:SaveData):SaveData {
  const copy=JSON.parse(JSON.stringify(save)) as SaveData;
  markTourVisit(copy);
  const warp=getMap(copy.map,copy.flags).warps.find(w=>w.x===copy.player.x&&w.y===copy.player.y);
  if(warp){copy.map=warp.to;copy.player={...warp.spawn,facing:warp.facing};}
  markTourVisit(copy);
  return copy;
}
export function encodeSave(save:SaveData):string {
  return JSON.stringify({format:'first-partner-save',savedAt:new Date().toISOString(),save:checkpoint(save)} satisfies SaveFile,null,2);
}
export function decodeSave(raw:string):SaveFile|null {
  try {
    if(raw.length>262144)return null;
    const data=JSON.parse(raw);
    if(!data||typeof data!=='object')return null;
    const wrapped=data.format==='first-partner-save';
    const save=parseSave(wrapped?JSON.stringify(data.save):raw);
    if(!save)return null;
    const savedAt=wrapped&&typeof data.savedAt==='string'&&Number.isFinite(Date.parse(data.savedAt))?data.savedAt:new Date().toISOString();
    return {format:'first-partner-save',savedAt,save:checkpoint(save)};
  }catch{return null;}
}
export class SaveLibrary {
  constructor(private storage:SaveStorage,private prefix:string){}
  read(slot:number|'backup'):SaveFile|null {const raw=this.storage.getItem(`${this.prefix}:${slot}`);return raw?decodeSave(raw):null;}
  write(slot:number|'backup',save:SaveData):void {this.storage.setItem(`${this.prefix}:${slot}`,encodeSave(save));}
}
