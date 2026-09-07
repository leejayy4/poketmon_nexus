export class GameAudio {
  context?: AudioContext; enabled=false; timer=0;
  toggle(){this.enabled=!this.enabled;if(this.enabled){this.context??=new AudioContext();void this.context.resume();this.play('confirm');this.timer=window.setInterval(()=>this.melody(),300)}else clearInterval(this.timer);return this.enabled}
  note(f:number,duration=.07,volume=.025,type:OscillatorType='square'){if(!this.enabled||!this.context)return;const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(volume,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+duration)}
  play(kind:'confirm'|'bump'|'receive'|'menu'|'door'){if(kind==='bump')this.note(120,.04,.012);else if(kind==='door')this.note(220,.14,.018,'triangle');else if(kind==='receive'){[523,659,784,1046].forEach((f,i)=>setTimeout(()=>this.note(f,.18,.027,'triangle'),i*100))}else this.note(kind==='menu'?740:987,.055,.014)}
  beat=0;
  melody(){if(document.hidden)return;const notes=[659,0,784,0,880,784,659,0,587,0,659,0,523,0,0,0,587,0,659,0,784,659,587,0,523,0,494,0,523,0,0,0];const f=notes[this.beat++%notes.length];if(f)this.note(f,.28,.009,'triangle');if(this.beat%4===1)this.note([131,175,147,131][Math.floor(this.beat/8)%4],.7,.01,'sine')}
}
