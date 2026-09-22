import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectSave, newSave, SAVE_KEY } from '../src/save';
import { SaveSession } from '../src/save-session';
import type { SaveStorage } from '../src/save-library';
import { Engine } from '../src/engine';
import { grantPokemon } from '../src/pokemon';

const KEY='save-session-test';
const LEGACY=KEY+':explore';
const POINTER=KEY+':active';

class MemoryStorage implements SaveStorage {
  readonly values=new Map<string,string>();
  readonly writes:Array<{key:string;value:string}>=[];
  beforeRead?: (key:string)=>void;
  beforeWrite?: (key:string,value:string)=>void;
  getItem(key:string):string|null {
    this.beforeRead?.(key);
    return this.values.get(key)??null;
  }
  setItem(key:string,value:string):void {
    this.beforeWrite?.(key,value);
    this.values.set(key,value);
    this.writes.push({key,value});
  }
}

function fixture(){
  const storage=new MemoryStorage();
  return {storage,session:new SaveSession(storage,KEY,LEGACY)};
}
function saved(seconds:number){const save=newSave();save.seconds=seconds;return save;}
function rawSave(seconds:number){return JSON.stringify(saved(seconds),null,2)+'\n';}
function activeKey(storage:MemoryStorage):string {
  const raw=storage.getItem(POINTER);
  assert.notEqual(raw,null);
  return (JSON.parse(raw!) as {key:string}).key;
}
function engineStorage(storage:MemoryStorage,run:(key:string)=>void){
  const descriptors=['localStorage','location','document'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)] as const);
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:storage});
  Object.defineProperty(globalThis,'location',{configurable:true,value:{search:'?qa=save-session'}});
  Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{run(SAVE_KEY+':qa:save-session');}
  finally{for(const [key,descriptor] of descriptors)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else Reflect.deleteProperty(globalThis,key);}
}

test('inspection distinguishes a missing key from corrupt and future documents',()=>{
  assert.deepEqual(inspectSave(null),{kind:'missing'});
  assert.deepEqual(inspectSave(''),{kind:'rejected',reason:'invalid-json'});
  assert.deepEqual(inspectSave('{'),{kind:'rejected',reason:'invalid-json'});
  assert.deepEqual(inspectSave('null'),{kind:'rejected',reason:'invalid-data'});
  assert.deepEqual(inspectSave(JSON.stringify({...newSave(),version:2})),{kind:'rejected',reason:'future-version'});
  assert.deepEqual(inspectSave(JSON.stringify({...newSave(),worldRevision:newSave().worldRevision!+1})),{kind:'rejected',reason:'future-world'});
  assert.equal(inspectSave(JSON.stringify(newSave())).kind,'ready');
});

test('the first save forks a primary document without rewriting any original bytes',()=>{
  const {storage,session}=fixture(),original=rawSave(12);
  storage.values.set(KEY,original);
  const loaded=session.open();assert(loaded);
  assert.equal(loaded.seconds,12);
  loaded.seconds=34;
  assert(session.persist(loaded));
  assert.equal(storage.getItem(KEY),original);
  assert.notEqual(activeKey(storage),KEY);
  assert.equal(new SaveSession(storage,KEY,LEGACY).open()?.seconds,34);
});

test('migration remains a candidate until persistence and retains the old raw document',()=>{
  const {storage,session}=fixture(),old=saved(23);
  old.worldRevision=1;
  const original=JSON.stringify(old,null,2);
  storage.values.set(KEY,original);
  const loaded=session.open();assert(loaded);
  assert.equal(loaded.worldRevision,newSave().worldRevision);
  assert.equal(storage.getItem(POINTER),null);
  assert.equal(storage.getItem(KEY),original);
  assert(session.persist(loaded));
  assert.equal(storage.getItem(KEY),original);
  assert.equal(new SaveSession(storage,KEY,LEGACY).open()?.worldRevision,newSave().worldRevision);
});

for(const [name,raw] of [
  ['empty string',''],
  ['invalid JSON','{truncated'],
  ['invalid shape','{}'],
  ['future version',JSON.stringify({...newSave(),version:2})],
  ['future world',JSON.stringify({...newSave(),worldRevision:999999})],
] as const){
  test(`${name} blocks automatic persistence and is retained exactly`,()=>{
    const {storage,session}=fixture();storage.values.set(KEY,raw);
    assert.equal(session.open(),null);
    assert.equal(session.status.writable,false);
    assert.equal(session.persist(newSave()),false);
    assert.equal(storage.getItem(KEY),raw);
    assert.equal(storage.getItem(POINTER),null);
    assert.deepEqual(session.original,{key:KEY,raw});
    assert(session.status.recoveryKey);
    assert.equal(storage.getItem(session.status.recoveryKey),raw);
  });
}

test('explicit activation after a rejected source creates a separate reloadable journey',()=>{
  const {storage,session}=fixture(),original='{broken';storage.values.set(KEY,original);
  assert.equal(session.open(),null);
  assert(session.activate(saved(45)));
  assert.equal(session.status.writable,true);
  assert.equal(storage.getItem(KEY),original);
  assert.equal(new SaveSession(storage,KEY,LEGACY).open()?.seconds,45);
});

test('explicit replacement preserves the previous managed journey',()=>{
  const {storage,session}=fixture();session.open();assert(session.activate(saved(10)));
  const previousKey=activeKey(storage),previous=storage.getItem(previousKey);
  assert(session.activate(saved(20)));
  assert.notEqual(activeKey(storage),previousKey);
  assert.equal(storage.getItem(previousKey),previous);
  assert.equal(new SaveSession(storage,KEY,LEGACY).open()?.seconds,20);
});

test('legacy fallback is used only when the primary is missing',()=>{
  for(const primary of [null,rawSave(10),''] as const){
    const {storage,session}=fixture();storage.values.set(LEGACY,rawSave(99));
    if(primary!==null)storage.values.set(KEY,primary);
    const loaded=session.open();
    assert.equal(loaded?.seconds,primary===null?99:primary===''?undefined:10);
    assert.equal(storage.getItem(LEGACY),rawSave(99));
  }
});

test('a primary created after legacy fallback blocks activation of the stale legacy journey',()=>{
  const {storage,session}=fixture(),legacy=rawSave(99),primary=rawSave(10);
  storage.values.set(LEGACY,legacy);assert.equal(session.open()?.seconds,99);
  storage.values.set(KEY,primary);
  assert.equal(session.persist(saved(100)),false);
  assert.equal(session.status.reason,'changed-elsewhere');
  assert.equal(session.activate(saved(100)),false);
  assert.equal(storage.getItem(POINTER),null);
  assert.equal(storage.getItem(KEY),primary);
  assert.equal(storage.getItem(LEGACY),legacy);
  assert.equal(new SaveSession(storage,KEY,LEGACY).open()?.seconds,10);
});

test('missing managed target does not silently fall back to primary or legacy',()=>{
  const {storage,session}=fixture();
  storage.values.set(KEY,rawSave(10));storage.values.set(LEGACY,rawSave(99));
  storage.values.set(POINTER,JSON.stringify({format:'nexus-active-save',version:1,key:KEY+':session:missing'}));
  assert.equal(session.open(),null);
  assert.equal(session.status.reason,'missing-active');
  assert.equal(session.persist(newSave()),false);
  assert.equal(storage.getItem(KEY),rawSave(10));
  assert.equal(storage.getItem(LEGACY),rawSave(99));
});

test('an invalid active pointer is protected before an explicit replacement',()=>{
  const {storage,session}=fixture(),original='{"format":"unknown-save-pointer"}\n';
  storage.values.set(POINTER,original);storage.values.set(KEY,rawSave(10));
  assert.equal(session.open(),null);
  assert.equal(session.status.reason,'invalid-pointer');
  assert.equal(session.persist(newSave()),false);
  assert.equal(storage.getItem(POINTER),original);
  assert.deepEqual(session.original,{key:POINTER,raw:original});
  assert(session.activate(saved(99)));
  const reopened=new SaveSession(storage,KEY,LEGACY);
  assert.equal(reopened.open()?.seconds,99);
  assert.equal(reopened.original?.raw,original);
  assert.equal(storage.getItem(KEY),rawSave(10));
});

test('malformed optional archive metadata does not hide a valid active journey',()=>{
  const {storage,session}=fixture();session.open();assert(session.persist(saved(10)));
  const pointer=JSON.parse(storage.getItem(POINTER)!);
  pointer.recoveryKey=42;
  storage.values.set(POINTER,JSON.stringify(pointer));
  const reopened=new SaveSession(storage,KEY,LEGACY);
  assert.equal(reopened.open()?.seconds,10);
  assert.equal(reopened.status.writable,true);
});

test('storage read failures never turn unknown storage into a writable fresh game',()=>{
  const {storage,session}=fixture();storage.values.set(KEY,rawSave(10));
  storage.beforeRead=()=>{throw new Error('Storage disabled');};
  assert.equal(session.open(),null);
  assert.equal(session.status.reason,'storage-unavailable');
  assert.equal(session.persist(newSave()),false);
  assert.equal(session.activate(newSave()),false);
  assert.equal(storage.values.get(KEY),rawSave(10));
  assert.equal(storage.writes.length,0);
});

for(const failedPart of ['session','pointer'] as const){
  test(`${failedPart} write failure preserves the selected journey`,()=>{
    const {storage,session}=fixture();storage.values.set(KEY,rawSave(10));session.open();
    assert(session.persist(saved(11)));
    const previousPointer=storage.getItem(POINTER),previousKey=activeKey(storage),previous=storage.getItem(previousKey);
    storage.beforeWrite=(key)=>{
      if(failedPart==='pointer'?key===POINTER:key.startsWith(KEY+':session:'))throw new Error('Quota exceeded');
    };
    assert.equal(session.activate(saved(99)),false);
    assert.equal(session.status.reason,failedPart==='pointer'?'activation-uncertain':'write-failed');
    assert.equal(storage.getItem(POINTER),previousPointer);
    assert.equal(storage.getItem(previousKey),previous);
    assert.equal(new SaveSession(storage,KEY,LEGACY).open()?.seconds,11);
  });
}

test('staged data must be read back before the active pointer changes',()=>{
  const {storage,session}=fixture();storage.values.set(KEY,rawSave(10));session.open();
  assert(session.persist(saved(11)));
  const previousPointer=storage.getItem(POINTER);
  storage.beforeRead=(key)=>{
    if(key.startsWith(KEY+':session:')&&storage.values.has(key)&&key!==session.status.activeKey)throw new Error('Readback failed');
  };
  assert.equal(session.activate(saved(99)),false);
  assert.equal(storage.getItem(POINTER),previousPointer);
  assert.equal(new SaveSession(storage,KEY,LEGACY).open()?.seconds,11);
});

test('pointer readback failure reports uncertainty, locks autosave, and keeps the prior raw copy',()=>{
  const {storage,session}=fixture();storage.values.set(KEY,rawSave(10));session.open();
  assert(session.persist(saved(11)));
  const previousKey=activeKey(storage),previous=storage.getItem(previousKey);
  let selected=false,failed=false;
  storage.beforeWrite=(key)=>{if(key===POINTER)selected=true;};
  storage.beforeRead=(key)=>{
    if(key===POINTER&&selected&&!failed){failed=true;throw new Error('Activation readback failed');}
  };
  assert.equal(session.activate(saved(99)),false);
  assert.equal(session.status.reason,'activation-uncertain');
  assert.equal(session.status.activeKey,previousKey);
  assert.equal(session.persist(saved(12)),false);
  assert.equal(storage.getItem(previousKey),previous);
  const reopened=new SaveSession(storage,KEY,LEGACY);
  assert.equal(reopened.open()?.seconds,99);
  assert.equal(reopened.original?.raw,previous);
  assert(reopened.status.recoveryKey);
  assert.equal(storage.getItem(reopened.status.recoveryKey),previous);
});

test('a valid primary cannot be replaced when its recovery copy cannot be verified',()=>{
  const {storage,session}=fixture(),original=rawSave(10);storage.values.set(KEY,original);assert(session.open());
  storage.beforeRead=(key)=>{
    if(key.startsWith(KEY+':recovery:')&&storage.values.has(key))throw new Error('Recovery readback failed');
  };
  assert.equal(session.activate(saved(99)),false);
  assert.equal(session.status.reason,'write-failed');
  assert.equal(storage.getItem(KEY),original);
  assert.equal(storage.getItem(POINTER),null);
});

test('failure writing the active session preserves its prior persisted progress',()=>{
  const {storage,session}=fixture();session.open();assert(session.persist(saved(10)));
  const key=activeKey(storage),previous=storage.getItem(key),pointer=storage.getItem(POINTER);
  storage.beforeWrite=(target)=>{if(target===key)throw new Error('Quota exceeded');};
  assert.equal(session.persist(saved(99)),false);
  assert.equal(session.status.reason,'write-failed');
  assert.equal(storage.getItem(key),previous);
  assert.equal(storage.getItem(POINTER),pointer);
  assert.equal(new SaveSession(storage,KEY,LEGACY).open()?.seconds,10);
});

test('a failed recovery copy keeps a corrupt source locked and unchanged',()=>{
  const {storage,session}=fixture(),original='';storage.values.set(KEY,original);
  storage.beforeWrite=(key)=>{if(key.startsWith(KEY+':recovery:'))throw new Error('Quota exceeded');};
  assert.equal(session.open(),null);
  assert.equal(session.persist(newSave()),false);
  assert.equal(session.activate(newSave()),false);
  assert.equal(storage.getItem(KEY),original);
  assert.equal(storage.getItem(POINTER),null);
  assert.deepEqual(session.original,{key:KEY,raw:original});
});

test('another session changing the active pointer blocks stale writes and activation',()=>{
  const {storage,session}=fixture();session.open();assert(session.persist(saved(10)));
  const originalKey=activeKey(storage),original=storage.getItem(originalKey);
  const other=new SaveSession(storage,KEY,LEGACY);assert(other.open());assert(other.activate(saved(20)));
  const otherPointer=storage.getItem(POINTER);
  assert.equal(session.persist(saved(30)),false);
  assert.equal(session.status.reason,'changed-elsewhere');
  assert.equal(session.activate(saved(40)),false);
  assert.equal(storage.getItem(POINTER),otherPointer);
  assert.equal(storage.getItem(originalKey),original);
  assert.equal(new SaveSession(storage,KEY,LEGACY).open()?.seconds,20);
});

test('another session changing the active data blocks a stale write even with the same pointer',()=>{
  const {storage,session}=fixture();session.open();assert(session.persist(saved(10)));
  const other=new SaveSession(storage,KEY,LEGACY);assert(other.open());assert(other.persist(saved(20)));
  assert.equal(session.persist(saved(30)),false);
  assert.equal(session.status.reason,'changed-elsewhere');
  assert.equal(new SaveSession(storage,KEY,LEGACY).open()?.seconds,20);
});

test('engine fallback, persistence and in-world restore cannot release a rejected-source guard',()=>{
  const storage=new MemoryStorage();
  engineStorage(storage,key=>{
    const original='{broken engine save';storage.values.set(key,original);
    const game=new Engine();
    assert.equal(game.loaded,false);
    assert.equal(game.saveError,true);
    assert.equal(game.saveStatus.reason,'invalid-json');
    assert.equal(game.persist(),false);
    game.restore(newSave());
    assert.equal(game.saveError,true);
    assert.equal(game.saveStatus.reason,'invalid-json');
    assert.equal(storage.getItem(key),original);
    assert.equal(storage.getItem(key+':active'),null);
    assert.equal(new Engine().saveError,true);
  });
});

test('engine constructor recovers a fainted party in a managed copy while retaining the source',()=>{
  const storage=new MemoryStorage();
  engineStorage(storage,key=>{
    const save=newSave();assert(grantPokemon(save,7));save.party[0].hp=0;
    const original=JSON.stringify(save,null,2)+'\n';storage.values.set(key,original);
    const game=new Engine();
    assert.equal(game.loaded,true);
    assert.equal(game.saveError,false);
    assert.equal(game.save.map,'home');
    assert.equal(game.save.party[0].hp,game.save.party[0].maxHp);
    assert.equal(storage.getItem(key),original);
    assert(game.saveStatus.activeKey?.startsWith(key+':session:'));
    assert.equal(game.saveRecovery?.raw,original);
    const reopened=new Engine();
    assert.equal(reopened.save.map,'home');
    assert.equal(reopened.save.party[0].hp,reopened.save.party[0].maxHp);
    assert.equal(reopened.saveRecovery?.raw,original);
    assert.equal(storage.getItem(key),original);
  });
});
