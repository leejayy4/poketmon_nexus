import { markTourVisit } from './explore-journal';
import { getMap } from './maps';
import { parseSave } from './save';
import type { SaveData } from './types';

export interface SaveFile { format:'first-partner-save'; savedAt:string; save:SaveData }
export interface SaveStorage { getItem(key:string):string|null; setItem(key:string,value:string):void }
export type SaveSlot = number|'backup';
export type SaveSlotEntry =
  | {kind:'empty';key:string;raw:null}
  | {kind:'ready';key:string;raw:string;file:SaveFile}
  | {kind:'unreadable';key:string;raw:string};
export class SaveLibraryError extends Error {
  constructor(public readonly code:'invalid-save'|'recovery-failed'|'changed'|'write-failed'){
    super(code);this.name='SaveLibraryError';
  }
}

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
  private recoverySequence=0;
  constructor(private storage:SaveStorage,private prefix:string){}
  inspect(slot:SaveSlot):SaveSlotEntry {
    const key=`${this.prefix}:${slot}`,raw=this.storage.getItem(key);
    if(raw===null)return {kind:'empty',key,raw};
    const file=decodeSave(raw);
    return file?{kind:'ready',key,raw,file}:{kind:'unreadable',key,raw};
  }
  read(slot:SaveSlot):SaveFile|null {const entry=this.inspect(slot);return entry.kind==='ready'?entry.file:null;}
  recovery(slot:SaveSlot):{key:string;raw:string}|null {
    const base=`${this.prefix}:${slot}`,key=this.storage.getItem(`${base}:recovery-latest`);
    if(!key||!key.startsWith(`${base}:recovery:`))return null;
    const raw=this.storage.getItem(key);
    return raw===null?null:{key,raw};
  }
  backup(save:SaveData):{readable:boolean;recoveryKey:string|null} {
    let readable=false;
    try{readable=decodeSave(encodeSave(save))!==null;}catch{/* Keep invalid live data verbatim instead of blocking recovery imports. */}
    if(readable)return {readable:true,...this.write('backup',save)};
    let raw:string;
    try{
      raw=JSON.stringify(save);
      if(typeof raw!=='string')throw new Error('Current state is not serializable');
    }catch{throw new SaveLibraryError('recovery-failed');}
    // Retain an existing readable undo slot and separately archive this state.
    const recoveryKey=this.preserve({kind:'unreadable',key:`${this.prefix}:backup`,raw});
    return {readable:false,recoveryKey};
  }
  private preserve(entry:Extract<SaveSlotEntry,{kind:'unreadable'}>):string {
    try{
      // Use a new key for every distinct overwrite; never replace an older recovery copy.
      for(let attempt=0;attempt<100;attempt++){
        const key=`${entry.key}:recovery:${Date.now().toString(36)}:${Math.random().toString(36).slice(2)}:${this.recoverySequence++}`;
        if(this.storage.getItem(key)!==null)continue;
        this.storage.setItem(key,entry.raw);
        if(this.storage.getItem(key)!==entry.raw)throw new Error('Recovery readback differs');
        const reference=`${entry.key}:recovery-latest`;
        this.storage.setItem(reference,key);
        if(this.storage.getItem(reference)!==key)throw new Error('Recovery reference readback differs');
        return key;
      }
      throw new Error('No unused recovery key');
    }catch{throw new SaveLibraryError('recovery-failed');}
  }
  write(slot:SaveSlot,save:SaveData):{recoveryKey:string|null} {
    const encoded=encodeSave(save);
    if(!decodeSave(encoded))throw new SaveLibraryError('invalid-save');
    const entry=this.inspect(slot);
    const recoveryKey=entry.kind==='unreadable'?this.preserve(entry):null;
    // A different tab may have changed the slot since the explicit overwrite began.
    if(this.storage.getItem(entry.key)!==entry.raw)throw new SaveLibraryError('changed');
    try{
      this.storage.setItem(entry.key,encoded);
      if(this.storage.getItem(entry.key)!==encoded)throw new Error('Save readback differs');
    }catch{throw new SaveLibraryError('write-failed');}
    return {recoveryKey};
  }
}
