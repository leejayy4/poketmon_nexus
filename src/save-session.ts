import { inspectSave, type SaveReadFailure } from './save';
import type { SaveStorage } from './save-library';
import type { SaveData } from './types';

type SaveBlockReason = SaveReadFailure | 'storage-unavailable' | 'invalid-pointer' | 'missing-active' | 'changed-elsewhere' | 'invalid-current' | 'write-failed' | 'activation-uncertain';
export interface SaveSessionStatus {
  writable:boolean;
  reason:SaveBlockReason|null;
  activeKey:string|null;
  sourceKey:string;
  recoveryKey:string|null;
}
interface ActiveSave {format:'nexus-active-save';version:1;key:string;recoveryKey?:string}

// The old save, explicit replacements and migration inputs never become write
// targets. Only a verified managed copy can be selected by the active pointer.
export class SaveSession {
  private pointerRaw:string|null|undefined;
  private sourceRaw:string|null|undefined;
  private sourceKnown=false;
  private primaryAbsent=false;
  private sourceKey:string;
  private activeKey:string|null=null;
  private mustFork=true;
  private reason:SaveBlockReason|null=null;
  private recovery:{raw:string;key:string}|null=null;
  private recoveryKey:string|null=null;
  private readonly pointerKey:string;

  constructor(private storage:SaveStorage,readonly namespace:string,private legacyKey?:string){
    this.sourceKey=namespace;
    this.pointerKey=namespace+':active';
  }

  get status():SaveSessionStatus {return {writable:this.reason===null,reason:this.reason,activeKey:this.activeKey,sourceKey:this.sourceKey,recoveryKey:this.recoveryKey};}
  get original(){return this.recovery?{...this.recovery}:null;}

  open():SaveData|null {
    try {
      this.pointerRaw=this.storage.getItem(this.pointerKey);
      if(this.pointerRaw!==null){
        const pointer=this.readPointer(this.pointerRaw);
        if(!pointer){this.protect(this.pointerKey,this.pointerRaw);this.sourceKnown=true;this.reason='invalid-pointer';return null;}
        this.sourceKey=pointer.key;
        this.activeKey=pointer.key;
        // A previous source remains downloadable after activation and reload.
        if(typeof pointer.recoveryKey==='string'&&pointer.recoveryKey.startsWith(this.namespace+':recovery:')){
          try{
            const raw=this.storage.getItem(pointer.recoveryKey);
            if(raw!==null){this.recovery={key:pointer.recoveryKey,raw};this.recoveryKey=pointer.recoveryKey;}
          }catch{/* An optional archive read must not invalidate a valid active save. */}
        }
      }
      this.sourceRaw=this.storage.getItem(this.sourceKey);
      this.sourceKnown=true;
      this.primaryAbsent=this.sourceKey===this.namespace&&this.sourceRaw===null;
      if(this.sourceRaw===null&&this.pointerRaw!==null){this.reason='missing-active';return null;}
      // Legacy exploration is consulted only when no primary save exists. A
      // rejected primary must never be silently replaced by a different journey.
      if(this.sourceRaw===null&&this.legacyKey){
        const legacy=this.storage.getItem(this.legacyKey);
        if(legacy!==null){this.sourceKey=this.legacyKey;this.sourceRaw=legacy;}
      }
      const result=inspectSave(this.sourceRaw);
      if(result.kind==='missing')return null;
      if(result.kind==='rejected'){
        this.protect(this.sourceKey,this.sourceRaw!);this.reason=result.reason;return null;
      }
      this.mustFork=this.activeKey===null||result.migrated;
      // Preserve the old pre-revision17 visit union without making the legacy
      // storage key an active target, or relying on it for primary recovery.
      if(result.sourceRevision<17&&this.sourceKey===this.namespace&&this.legacyKey){
        try{
          const legacy=inspectSave(this.storage.getItem(this.legacyKey));
          if(legacy.kind==='ready')result.save.tourVisited=[...new Set([...(result.save.tourVisited??[]),...(legacy.save.tourVisited??[])])];
        }catch{/* Optional visit history cannot invalidate a valid primary. */}
      }
      if(result.save.flags.exploration){delete result.save.flags.exploration;this.mustFork=true;}
      return result.save;
    }catch{this.sourceKnown=false;this.reason='storage-unavailable';return null;}
  }

  persist(save:SaveData):boolean {
    if(this.reason!==null)return false;
    const raw=this.validated(save);
    if(raw===null)return false;
    if(this.mustFork||this.activeKey===null)return this.activateRaw(raw);
    try {
      if(!this.unchanged())return false;
      this.storage.setItem(this.activeKey,raw);
      if(this.storage.getItem(this.activeKey)!==raw)throw new Error('Save readback differs');
      this.sourceRaw=raw;
      return true;
    }catch{this.reason='write-failed';return false;}
  }

  // Explicit new game/import/recovery: validate and stage before the engine
  // swaps its live state. Even a rejected source is retained, never overwritten.
  activate(save:SaveData):boolean {
    const raw=this.validated(save);
    return raw!==null&&this.activateRaw(raw);
  }

  private validated(save:SaveData):string|null {
    try{
      const raw=JSON.stringify(save);
      if(inspectSave(raw).kind==='ready')return raw;
    }catch{/* Serialization failure is a rejected candidate, not a new game. */}
    this.reason='invalid-current';return null;
  }

  private readPointer(raw:string):ActiveSave|null {
    try{
      const value=JSON.parse(raw) as ActiveSave;
      const prefix=this.namespace+':session:';
      return value?.format==='nexus-active-save'&&value.version===1&&typeof value.key==='string'&&value.key.startsWith(prefix)&&/^[a-z0-9-]+$/.test(value.key.slice(prefix.length))?value:null;
    }catch{return null;}
  }

  private uniqueKey(kind:'session'|'recovery'):string {
    for(let attempt=0;attempt<8;attempt++){
      const key=`${this.namespace}:${kind}:${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${attempt}`;
      if(this.storage.getItem(key)===null)return key;
    }
    throw new Error('Could not reserve an unused save key');
  }

  private protect(key:string,raw:string){
    this.recovery={key,raw};
    try{this.copyRecovery();}catch{/* The source is still locked even if storage is full. */}
  }

  private copyRecovery(){
    if(!this.recovery)return;
    if(this.recoveryKey&&this.storage.getItem(this.recoveryKey)===this.recovery.raw)return;
    const key=this.uniqueKey('recovery');
    this.storage.setItem(key,this.recovery.raw);
    if(this.storage.getItem(key)!==this.recovery.raw)throw new Error('Recovery readback differs');
    this.recoveryKey=key;
  }

  private unchanged():boolean {
    // A failed read is never interpreted as an empty browser. Reload is needed
    // before changing an unknown or externally replaced active selection.
    if(this.pointerRaw===undefined||!this.sourceKnown){this.reason='storage-unavailable';return false;}
    if(this.storage.getItem(this.pointerKey)!==this.pointerRaw){this.reason='changed-elsewhere';return false;}
    if(this.primaryAbsent&&this.storage.getItem(this.namespace)!==null){this.reason='changed-elsewhere';return false;}
    if(this.sourceRaw!==undefined&&this.storage.getItem(this.sourceKey)!==this.sourceRaw){this.reason='changed-elsewhere';return false;}
    return true;
  }

  private activateRaw(raw:string):boolean {
    let selecting=false;
    try {
      if(!this.unchanged())return false;
      if(this.sourceRaw!==undefined&&this.sourceRaw!==null&&this.recovery?.raw!==this.sourceRaw){
        this.recovery={key:this.sourceKey,raw:this.sourceRaw};this.recoveryKey=null;
      }
      this.copyRecovery();
      const key=this.uniqueKey('session');
      this.storage.setItem(key,raw);
      const staged=this.storage.getItem(key);
      if(staged!==raw||inspectSave(staged).kind!=='ready')throw new Error('Invalid staged save');
      if(!this.unchanged())return false;
      const pointer=JSON.stringify({format:'nexus-active-save',version:1,key,...(this.recoveryKey?{recoveryKey:this.recoveryKey}:{})} satisfies ActiveSave);
      selecting=true;
      this.storage.setItem(this.pointerKey,pointer);
      if(this.storage.getItem(this.pointerKey)!==pointer)throw new Error('Activation readback differs');
      this.pointerRaw=pointer;this.sourceKey=key;this.sourceRaw=raw;this.activeKey=key;
      this.mustFork=false;this.primaryAbsent=false;this.reason=null;
      return true;
    }catch{this.reason=selecting?'activation-uncertain':'write-failed';return false;}
  }
}
