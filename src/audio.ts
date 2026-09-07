import {moveTechniqueStyle, type MoveStyle} from './move-art';

export type AudioScene = 'town'|'route'|'cave'|'wild'|'gym';
export type Fanfare = 'victory'|'catch'|'evolution';
type Sound = 'confirm'|'bump'|'receive'|'menu'|'door'|Fanfare;
type Score = {step:number; notes:readonly number[]; bass:readonly number[]};
// Original short compositions in MIDI notes (0 = rest), no external recordings.
const SCORES:Record<AudioScene,Score> = {
  town:{step:300,notes:[64,0,67,69,67,64,62,0,60,64,67,0,69,67,64,0,65,69,72,69,67,65,62,0,64,67,69,67,62,64,60,0],bass:[48,53,50,48]},
  route:{step:230,notes:[62,66,69,0,71,69,66,64,62,0,66,69,74,71,69,0,67,71,74,0,76,74,71,69,66,69,71,66,64,66,62,0],bass:[50,55,52,57]},
  cave:{step:420,notes:[57,0,0,64,0,60,0,0,59,0,65,0,64,0,0,0,60,0,67,0,0,64,0,62,59,0,0,62,57,0,0,0],bass:[45,41,48,40]},
  wild:{step:170,notes:[64,67,71,67,66,69,72,69,64,67,71,74,72,71,67,66,64,64,67,71,69,66,62,66,67,71,74,71,69,66,64,0],bass:[40,43,45,47]},
  gym:{step:195,notes:[62,0,69,72,74,72,69,65,67,0,70,74,77,74,70,67,69,72,76,72,74,72,69,65,67,70,74,69,65,64,62,0],bass:[38,43,45,41]},
};
const FANFARES:Record<Fanfare,{notes:readonly number[];step:number}> = {
  victory:{notes:[60,64,67,72,0,71,74,72],step:.14},
  catch:{notes:[64,67,72,0,76,72],step:.13},
  evolution:{notes:[60,64,67,71,72,76,79,0,77,76,72],step:.16},
};
const MOVE_SOUNDS:Record<MoveStyle,readonly [number,number,number,OscillatorType]> = {
  fire:[185,420,5,'triangle'],water:[460,240,7,'sine'],vine:[210,510,3,'triangle'],
  leaf:[680,380,5,'triangle'],absorb:[240,660,6,'sine'],electric:[740,260,7,'triangle'],
  rock:[180,85,4,'triangle'],ghost:[270,160,5,'sine'],lick:[330,160,3,'sine'],
  psychic:[390,780,5,'sine'],fight:[160,350,3,'triangle'],scratch:[620,220,3,'triangle'],
  wing:[340,620,4,'sine'],quick:[300,850,3,'triangle'],guard:[440,660,3,'sine'],
  cry:[580,290,4,'sine'],tail:[390,480,4,'sine'],impact:[150,85,2,'triangle'],
};
const hz=(midi:number)=>440*2**((midi-69)/12);
type Voice = {osc:OscillatorNode;gain:GainNode};

export class GameAudio {
  context?:AudioContext;
  enabled=false;
  timer=0;
  beat=0;
  scene:AudioScene='town';
  private voices=new Set<Voice>();
  private musicAfter=0;
  private generation=0;

  /** Only call from the existing user's sound toggle. Other methods never enable audio. */
  toggle():boolean {
    if(this.enabled){this.disable();return false;}
    try {
      if(!this.context||this.context.state==='closed')this.context=new AudioContext();
      this.enabled=true;
      const generation=++this.generation;
      void this.context.resume().catch(()=>{if(this.generation===generation)this.disable();});
      this.beat=0;this.musicAfter=0;
      this.play('confirm');this.startTimer();
      return true;
    } catch {this.disable();return false;}
  }

  /** Idempotent: safe to call every frame. A different scene resets music and queued sounds. */
  setScene(scene:AudioScene):void {
    if(this.scene===scene||!Object.hasOwn(SCORES,scene))return;
    this.scene=scene;this.beat=0;this.musicAfter=0;
    this.stopVoices();this.clearTimer();
    if(this.enabled)this.startTimer();
  }

  private clearTimer():void {if(this.timer)globalThis.clearInterval(this.timer);this.timer=0;}
  private startTimer():void {
    this.clearTimer();
    this.timer=globalThis.setInterval(()=>this.melody(),SCORES[this.scene].step);
  }
  private disconnect(voice:Voice):void {
    voice.osc.onended=null;voice.osc.disconnect();voice.gain.disconnect();this.voices.delete(voice);
  }
  private stopVoices():void {
    for(const voice of this.voices){try{voice.osc.stop();}catch{/* already ended */}this.disconnect(voice);}
  }
  private disable():void {
    this.enabled=false;this.generation++;this.clearTimer();this.stopVoices();this.beat=0;this.musicAfter=0;
  }
  /** Release the instance on teardown; a later user toggle can enable it again. */
  dispose():void {this.disable();}

  note(f:number,duration=.07,volume=.025,type:OscillatorType='triangle'):void {
    this.schedule(f,duration,volume,type,0);
  }
  private schedule(f:number,duration:number,volume:number,type:OscillatorType,delay:number,endFrequency?:number):void {
    const c=this.context;
    if(!this.enabled||!c||c.state==='closed'||!Number.isFinite(f)||f<=0||!Number.isFinite(duration)||duration<=0||!Number.isFinite(volume)||volume<=0)return;
    // Bounded polyphony also bounds queues while a tab/context is suspended.
    if(this.voices.size>=32){const oldest=this.voices.values().next().value!;try{oldest.osc.stop();}catch{}this.disconnect(oldest);}
    const osc=c.createOscillator(),gain=c.createGain(),start=c.currentTime+delay;
    const length=Math.min(2,Math.max(.025,duration)),peak=Math.min(.035,volume);
    osc.type=type;osc.frequency.setValueAtTime(Math.max(65,Math.min(1600,f)),start);
    if(endFrequency)osc.frequency.linearRampToValueAtTime(Math.max(65,Math.min(1600,endFrequency)),start+length);
    gain.gain.setValueAtTime(.0001,start);
    gain.gain.linearRampToValueAtTime(peak,start+.012);
    gain.gain.exponentialRampToValueAtTime(.0001,start+length);
    osc.connect(gain);gain.connect(c.destination);
    const voice={osc,gain};this.voices.add(voice);osc.onended=()=>this.disconnect(voice);
    osc.start(start);osc.stop(start+length+.015);
  }

  play(kind:Sound):void {
    if(kind==='victory'||kind==='catch'||kind==='evolution'){this.playFanfare(kind);return;}
    if(kind==='receive'){this.playFanfare('catch');return;}
    if(kind==='bump')this.note(120,.065,.012);
    else if(kind==='door')this.schedule(220,.18,.016,'triangle',0,150);
    else this.note(kind==='menu'?660:880,.065,.012,'sine');
  }
  /** Call once on a technique page transition, not on every animation frame. */
  playMove(move:string):void {
    if(!this.enabled)return;
    const [from,to,count,type]=MOVE_SOUNDS[moveTechniqueStyle(move)];
    for(let i=0;i<count;i++){
      const f=from+(to-from)*i/(count-1);
      this.schedule(f,.09,.015,type,i*.055,Math.max(70,f*.78));
    }
    if(move==='박치기')this.schedule(210,.15,.013,'sine',.1,85);
    if(move==='발경')this.schedule(540,.18,.01,'sine',.1,270);
  }
  /** Cancels previous phrases, ducks music, then resumes the selected scene on its one timer. */
  playFanfare(kind:Fanfare):void {
    if(!this.enabled||!this.context)return;
    const phrase=FANFARES[kind];
    this.stopVoices();
    phrase.notes.forEach((note,i)=>{if(note){this.schedule(hz(note),phrase.step*1.5,.022,'triangle',i*phrase.step);this.schedule(hz(note-12),phrase.step*1.6,.01,'sine',i*phrase.step);}});
    this.musicAfter=this.context.currentTime+phrase.notes.length*phrase.step+.25;this.beat=0;
  }

  melody():void {
    if(!this.enabled||!this.context||this.context.state!=='running')return;
    if(typeof document!=='undefined'&&document.hidden)return;
    if(this.context.currentTime<this.musicAfter)return;
    const score=SCORES[this.scene],beat=this.beat++%score.notes.length,note=score.notes[beat];
    if(note)this.note(hz(note),score.step/1000*.82,.008,this.scene==='cave'?'sine':'triangle');
    if(beat%4===0)this.note(hz(score.bass[Math.floor(beat/8)%score.bass.length]),score.step/1000*2.3,.009,'sine');
  }
}
