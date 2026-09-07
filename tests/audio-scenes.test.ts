import test, {type TestContext} from 'node:test';
import assert from 'node:assert/strict';
import {GameAudio,type AudioScene} from '../src/audio';

class Param {
  events:[string,number,number][]=[];
  setValueAtTime(value:number,time:number){this.events.push(['set',value,time]);}
  linearRampToValueAtTime(value:number,time:number){this.events.push(['linear',value,time]);}
  exponentialRampToValueAtTime(value:number,time:number){this.events.push(['exp',value,time]);}
}
class Osc {
  type='sine';frequency=new Param();starts:number[]=[];stops:(number|undefined)[]=[];disconnected=false;onended:(()=>void)|null=null;
  connect<T>(node:T){return node;}disconnect(){this.disconnected=true;}
  start(time:number){this.starts.push(time);}stop(time?:number){this.stops.push(time);}
}
class Gain {gain=new Param();disconnected=false;connect<T>(node:T){return node;}disconnect(){this.disconnected=true;}}
class Context {
  state='running';currentTime=10;destination={};oscs:Osc[]=[];gains:Gain[]=[];resumes=0;
  resumeResult:()=>Promise<void>=()=>Promise.resolve();
  resume(){this.resumes++;return this.resumeResult();}
  createOscillator(){const o=new Osc();this.oscs.push(o);return o;}
  createGain(){const g=new Gain();this.gains.push(g);return g;}
}
function harness(t:TestContext){
  const contexts:Context[]=[],timers=new Map<number,{callback:()=>void;delay:number}>();let next=1;
  const doc={hidden:false};
  const originals=new Map(['AudioContext','setInterval','clearInterval','document'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
  Object.defineProperties(globalThis,{
    AudioContext:{configurable:true,writable:true,value:class extends Context{constructor(){super();contexts.push(this);}}},
    setInterval:{configurable:true,writable:true,value:(callback:()=>void,delay:number)=>{const id=next++;timers.set(id,{callback,delay});return id;}},
    clearInterval:{configurable:true,writable:true,value:(id:number)=>timers.delete(id)},
    document:{configurable:true,writable:true,value:doc},
  });
  const audio=new GameAudio();
  t.after(()=>{audio.dispose();for(const [key,descriptor] of originals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else Reflect.deleteProperty(globalThis,key);}});
  return {audio,contexts,timers,doc};
}

test('audio is opt-in; scene/effects/fanfare never create a context or timer while muted',t=>{
  const h=harness(t);h.audio.setScene('cave');h.audio.playMove('불꽃세례');h.audio.play('receive');h.audio.play('victory');h.audio.note(440);h.audio.melody();
  assert.equal(h.audio.enabled,false);assert.equal(h.contexts.length,0);assert.equal(h.timers.size,0);
  assert.equal(h.audio.toggle(),true);assert.equal(h.contexts.length,1);assert.equal(h.contexts[0].resumes,1);
  assert.equal(h.timers.size,1);assert.equal([...h.timers.values()][0].delay,420);
});

test('scene changes reset beat and cancel queued audio; repeated same-scene calls keep one timer',t=>{
  const h=harness(t);h.audio.toggle();const c=h.contexts[0];h.audio.melody();h.audio.play('receive');
  const previous=c.oscs.slice();h.audio.setScene('wild');
  assert.equal(h.audio.beat,0);assert.equal(h.timers.size,1);assert.equal([...h.timers.values()][0].delay,170);
  assert.ok(previous.every(o=>o.disconnected&&o.stops.includes(undefined)));assert.ok(c.gains.every(g=>g.disconnected));
  const timer=h.audio.timer;h.audio.melody();const beat=h.audio.beat;
  for(let i=0;i<100;i++)h.audio.setScene('wild');
  assert.equal(h.audio.timer,timer);assert.equal(h.audio.beat,beat);assert.equal(h.timers.size,1);
});

test('mute stops present and future voices and old fanfare never survives re-enable',t=>{
  const h=harness(t);h.audio.toggle();h.audio.play('evolution');const c=h.contexts[0],queued=c.oscs.slice();
  assert.ok(queued.some(o=>o.starts[0]>c.currentTime));
  assert.equal(h.audio.toggle(),false);assert.equal(h.timers.size,0);assert.equal(h.audio.timer,0);
  assert.ok(queued.every(o=>o.disconnected&&o.onended===null));
  h.audio.play('receive');h.audio.playMove('물대포');assert.equal(c.oscs.length,queued.length);
  h.audio.toggle();assert.equal(h.contexts.length,1);assert.equal(h.timers.size,1);
  h.audio.melody();assert.equal(h.audio.beat,1);
});

test('five original scenes have different melodies and bounded gentle voices',t=>{
  const h=harness(t);h.audio.toggle();const c=h.contexts[0],signatures=[];
  for(const scene of ['town','route','cave','wild','gym'] as AudioScene[]){
    h.audio.setScene(scene);const start=c.oscs.length;
    for(let i=0;i<32;i++){h.audio.melody();c.currentTime+=.5;}
    signatures.push(JSON.stringify(c.oscs.slice(start).map(o=>[o.type,o.frequency.events[0][1]])));
  }
  assert.equal(new Set(signatures).size,5);
  for(const o of c.oscs){assert.ok(['sine','triangle'].includes(o.type));assert.ok(o.frequency.events.every(([,f])=>f>=65&&f<=1600));}
  for(const g of c.gains)assert.ok(g.gain.events.every(([,v])=>v>0&&v<=.035));
  assert.ok(c.oscs.filter(o=>!o.disconnected).length<=32);
});

test('technical effects sound distinct and use Web Audio scheduling without adding timers',t=>{
  const h=harness(t);h.audio.toggle();const c=h.contexts[0],signatures=[];
  for(const move of ['불꽃세례','물대포','덩굴채찍','흡수','전기쇼크','돌떨구기','놀래키기','핥기','염동력','태권당수','할퀴기','날개치기','전광석화','방어','울음소리','꼬리흔들기','몸통박치기']){
    const start=c.oscs.length;h.audio.playMove(move);const notes=c.oscs.slice(start);
    signatures.push(JSON.stringify(notes.map(o=>[o.type,o.frequency.events])));
    assert.ok(notes.length>=2&&notes.length<=7);assert.ok(notes.every(o=>o.starts[0]>=c.currentTime&&o.starts[0]<c.currentTime+.7));
    assert.equal(h.timers.size,1);
  }
  assert.equal(new Set(signatures).size,17);
});

test('fanfare ducks music and resumes selected scene without a second timer',t=>{
  const h=harness(t);h.audio.toggle();h.audio.setScene('gym');const c=h.contexts[0],signatures=[];
  for(const kind of ['victory','catch','evolution'] as const){
    const start=c.oscs.length;h.audio.playFanfare(kind);const notes=c.oscs.slice(start);
    signatures.push(JSON.stringify(notes.map(o=>o.frequency.events[0][1])));
    h.audio.melody();assert.equal(c.oscs.length,start+notes.length);assert.equal(h.audio.beat,0);
    c.currentTime+=4;h.audio.melody();assert.equal(h.audio.beat,1);assert.equal(h.audio.scene,'gym');assert.equal(h.timers.size,1);
  }
  assert.equal(new Set(signatures).size,3);
});

test('hidden or suspended contexts do not advance beats or pile up background notes',t=>{
  const h=harness(t);h.audio.toggle();const c=h.contexts[0],n=c.oscs.length;
  h.doc.hidden=true;for(let i=0;i<100;i++)h.audio.melody();assert.equal(c.oscs.length,n);assert.equal(h.audio.beat,0);
  h.doc.hidden=false;c.state='suspended';h.audio.melody();assert.equal(c.oscs.length,n);
  c.state='running';h.audio.melody();assert.equal(h.audio.beat,1);
});

test('ended voices disconnect and invalid public note inputs do not reach Web Audio',t=>{
  const h=harness(t);h.audio.toggle();const c=h.contexts[0],n=c.oscs.length;
  for(const bad of [NaN,Infinity,-1,0]){h.audio.note(bad);h.audio.note(440,bad);h.audio.note(440,.1,bad);}
  assert.equal(c.oscs.length,n);c.oscs[0].onended?.();assert.equal(c.oscs[0].disconnected,true);assert.equal(c.gains[0].disconnected,true);
});

test('failed resume disables cleanly but stale rejection cannot mute a newer user enable',async t=>{
  const h=harness(t);const c=new Context();h.audio.context=c as unknown as AudioContext;
  let reject!:(reason?:unknown)=>void;c.resumeResult=()=>new Promise<void>((_,r)=>{reject=r;});
  h.audio.toggle();h.audio.toggle();c.resumeResult=()=>Promise.resolve();h.audio.toggle();reject(new Error('old request'));
  await Promise.resolve();assert.equal(h.audio.enabled,true);assert.equal(h.timers.size,1);
  h.audio.toggle();c.resumeResult=()=>Promise.reject(new Error('blocked'));h.audio.toggle();await Promise.resolve();
  assert.equal(h.audio.enabled,false);assert.equal(h.timers.size,0);assert.ok(c.oscs.every(o=>o.disconnected));
});

test('unavailable AudioContext fails safely and closed context can be recreated by a user toggle',t=>{
  const h=harness(t),constructor=globalThis.AudioContext;
  Object.defineProperty(globalThis,'AudioContext',{configurable:true,value:undefined});
  assert.equal(h.audio.toggle(),false);assert.equal(h.timers.size,0);
  Object.defineProperty(globalThis,'AudioContext',{configurable:true,value:constructor});
  h.audio.toggle();h.audio.toggle();h.contexts[0].state='closed';h.audio.toggle();assert.equal(h.contexts.length,2);
});
