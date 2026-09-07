import fs from 'node:fs/promises';
let s=await fs.readFile('src/engine.ts','utf8');s=s.replace("import { GameAudio } from './audio';","import { GameAudio } from './audio';\nimport { professorConversation } from './story';\nimport { checkpoint } from './save-library';");
s=s.replace("this.say('리포트',['지금까지의 모험을\\n리포트에 기록했습니다!'])}catch", "this.say('리포트',['지금까지의 모험을\\n리포트에 기록했습니다!']);return true;}catch");
s=s.replace("this.say('리포트',['브라우저가 저장을 허용하지 않습니다.\\n현재 창에서는 계속 플레이할 수 있어요.'])}}", "this.say('리포트',['브라우저가 저장을 허용하지 않습니다.\\n현재 창에서는 계속 플레이할 수 있어요.']);return false;}}");
const start=s.indexOf("    if(id==='professor'||id==='pokeballs')");const end=s.indexOf("    if(id==='assistant')",start);
s=s.slice(0,start)+`    if(id==='professor'||id==='pokeballs'){const story=professorConversation(this.save);this.save.flags.professorMet=true;this.say('은솔박사',story.pages,()=>{this.save.flags.professorIntroHeard=true;if(story.offerStarter){this.panel='starters';this.starterIndex=0;}this.persist();});return}
`+s.slice(end);
s=s.replace('  snapshot(){',`  restore(save:SaveData){this.save=checkpoint(save);this.keys.clear();this.move=null;this.transition=0;this.transitionWarp=null;this.dialogue=null;this.panel='field';this.menuIndex=0;this.partyIndex=0;this.starterIndex=0;this.optionIndex=0;this.stepPhase=0;this.labelTime=2.6;this.toastTime=0;this.persist();}
  snapshot(){`);
await fs.writeFile('src/engine.ts',s);
