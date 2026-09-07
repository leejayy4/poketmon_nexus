import { withParticle } from './korean-text';
import { gymCoachPages } from './gym-coach';
import { routeCompanionPages } from './encounter-guidance';
import { hasWildEncounters } from './runtime-encounters';
import { handleRoadTrainer,trainerWinFlag } from './road-trainers';
import { PASSAGES } from './journey-world';
import { handleCityActivity } from './city-activities';
import { showMoveSchool } from './move-school';
import { collectGrowthLearning,hasGrowthLearning,openGrowthLearning } from './growth-learning';
import { handleJourneyEvent,showPokedex } from './journey-services';
import { adventureGuide,itemSupply } from './adventure-guide';
import { battleEffect,captureMotion } from './battle-effect';
import { starterPresentation } from './starter-presentation';
import { worldMapId,worldSpawn,isWorldCenter } from './unified-world';
import { gridSelection } from './menu-grid';
import { markTourVisit } from './explore-journal';
import { TownRoaming } from './explore-roaming';
import { leadPokemon,healFieldPokemon } from './team';
import { planTourNavigation,type TourNavigation } from './explore-navigation';
import type { Choice, Dialogue, Direction, Panel, SaveData, Point, MapId, Pokemon } from './types';
import { getMap, getWorldOutdoors, ACTIVE_MAPS, canEnter } from './maps';
import { TEXT } from './dialogues';
import { newSave, parseSave, SAVE_KEY } from './save';
import { grantPokemon, SPECIES, STARTERS } from './pokemon';
import { GameAudio } from './audio';
import { motherConversation, professorConversation } from './story';
import { checkpoint } from './save-library';
import { GYMS,gymById,gymPreparation,awardGym,type GymId } from './gyms';
import { SINNOH_CENTERS } from './sinnoh-maps';
import { tourPlaceForMap,TOUR_MAPS,TOUR_POKEMON,TOUR_RESIDENTS,TOUR_OUTDOORS,TOUR_INTERIORS,TOUR_SPAWNS,TOUR_NEIGHBORS,placeById,type TourId } from './explore-world';
import { sinnohEvent } from './sinnoh-story';
import { createBattle, battleTurn, type Battle, type BattleAction, type BattleFrame } from './battle';
export const VECTOR:Record<Direction,Point>={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
export const KEY_DIRECTION:Record<string,Direction>={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
export class Engine {
  save:SaveData; panel:Panel='field'; dialogue:Dialogue|null=null; keys=new Set<string>(); audio=new GameAudio();
  private pendingFieldAction:'confirm'|'cancel'|'map'|null=null;
  clearInput(){this.keys.clear();this.pendingFieldAction=null;}
  private deferFieldAction(action:'confirm'|'cancel'|'map'){
    if(this.transition>0)return true;
    if(!this.move)return false;
    if(!this.locked){this.pendingFieldAction??=action;this.keys.clear();}
    return true;
  }
  move:null|{from:Point;to:Point;elapsed:number;duration:number}=null;
  transition=0; transitionWarp: (()=>void)|null=null; labelTime=3; clock=0; stepPhase=0; menuIndex=0; starterIndex=0; partyIndex=0; optionIndex=0; toast=''; toastTime=0; saveError=false; loaded=false; textSpeed=36; bumpCooldown=0;
  caughtPreview:number|null=null;
  caughtBoxPreview:Pokemon|null=null;
  get caughtPokemon(){return this.caughtBoxPreview??(this.caughtPreview===null?null:this.save.party[this.caughtPreview]);}
  dialogueElapsed=0;
  get battleEffect(){return this.dialogue&&this.dialogue.page<(this.battleFrames?.length??0)?battleEffect(this.battleFrame,this.dialogueElapsed):null}
  get captureMotion(){return this.dialogue&&this.dialogue.page<(this.battleFrames?.length??0)?captureMotion(this.battleFrame,this.dialogueElapsed):null}
  gymReward:{id:GymId;money:number;page:number}|null=null;
  get showingGymReward(){return !!this.gymReward&&!!this.dialogue&&this.dialogue.page>=this.gymReward.page}
  get showingCatch(){return !!this.caughtPokemon&&!!this.dialogue&&this.dialogue.page===this.dialogue.pages.length-1}
  confirmingBattleExit=false;
  defeatScene:Battle|null=null; recoveryPreview=false;
  get presentedBattle(){return this.battle??(this.dialogue?this.defeatScene:null)}
  battleFrames:BattleFrame[]|null=null;
  get battleFrame(){return this.presentedBattle&&this.dialogue&&this.battleFrames?.length?this.battleFrames[Math.min(this.dialogue.page,this.battleFrames.length-1)]:null}
  get battlePresentation(){
    const page=this.dialogue?.page;
    if(!this.presentedBattle||page===undefined||!this.battleFrames||page>=this.battleFrames.length)return null;
    return starterPresentation(this.battleFrames[page],this.battleFrames[page-1]??null,this.dialogueElapsed);
  }
  battle:Battle|null=null; gymPreview:GymId|null=null; grassSteps=0; random=()=>Math.random();
  summaryActionIndex=0; bagIndex=1;
  exploring=false; // Compatibility observation only; there is one playable world.
  storageKey=SAVE_KEY+(typeof location!=='undefined'&&new URLSearchParams(location.search).has('qa')?':qa:'+new URLSearchParams(location.search).get('qa'):'');
  constructor(){
    let raw:string|null=null,legacy:string|null=null;try{raw=localStorage.getItem(this.storageKey);legacy=localStorage.getItem(this.storageKey.replace(SAVE_KEY,SAVE_KEY+':explore'));}catch{}
    const parsed=parseSave(raw),oldTour=parseSave(legacy);this.save=parsed??oldTour??this.freshSave();
    if(parsed&&oldTour&&(JSON.parse(raw!).worldRevision??1)<17)this.save.tourVisited=[...new Set([...(parsed.tourVisited??[]),...(oldTour.tourVisited??[])])];
    delete this.save.flags.exploration;this.loaded=!!(parsed||oldTour);
    if(raw&&!parsed)this.notice('저장 데이터를 읽지 못했습니다. 원본은 유지됩니다.');
    if(this.save.party.length&&this.save.party.every(p=>p.hp===0)){this.returnHome();this.notice('포켓몬이 건강을 되찾았습니다.');}
  }
  freshSave(){return newSave()}
  exploreTo(id:string){if(this.locked||this.move||this.transition)return;const point=id==='town'?{x:8,y:25}:TOUR_SPAWNS[id as TourId];if(!point)return;const save=structuredClone(this.save);save.map=id as SaveData['map'];save.player={...point,facing:'down'};this.restore(save);}
  fieldMap=false;followingObjective=false;
  tourDestination:MapId|null=null;
  tourEvent:string|null=null;
  toggleFieldMap(){if(this.locked||this.deferFieldAction('map'))return;this.clearInput();this.fieldMap=!this.fieldMap;}
  guideObjective(){if(this.locked||this.move)return;this.clearInput();this.followingObjective=true;this.tourEvent=null;this.fieldMap=true;this.navigationCache=null;}
  private navigationCache:{key:string;value:TourNavigation|null}|null=null;
  private roamingState:TownRoaming|null=null;
  private roamingSave:SaveData|null=null;
  get roaming(){
    const home=TOUR_POKEMON[this.save.map];
    if(!home){this.roamingState=null;this.roamingSave=null;return null;}
    if(this.roamingSave!==this.save||this.roamingState?.base.id!==this.save.map){this.roamingState=new TownRoaming(getMap(this.save.map,this.save.flags),home,this.save.player);this.roamingSave=this.save;}
    return this.roamingState;
  }
  setTourDestination(id:string|null,event?:string){if(id!==null&&!Object.hasOwn(ACTIVE_MAPS,id))return;this.followingObjective=false;this.tourEvent=event??null;this.tourDestination=id as MapId|null;if(id)this.fieldMap=true;this.navigationCache=null;}
  get tourNavigation(){
    const objective=this.followingObjective?adventureGuide(this.save)?.objective:null;
    if(this.followingObjective)this.tourDestination=objective?.map??null;
    if(!this.tourDestination)return null;
    const key=JSON.stringify([this.save.map,this.save.player.x,this.save.player.y,this.tourDestination,objective?.event??this.tourEvent,this.save.flags,this.roaming?.revision,this.roaming?.npc.x,this.roaming?.npc.y]);
    if(this.navigationCache?.key!==key)this.navigationCache={key,value:planTourNavigation(this.save,this.tourDestination,this.map,objective?.event??this.tourEvent??undefined)};
    return this.navigationCache.value;
  }
  get map(){return this.roaming?.map??getMap(this.save.map,this.save.flags)}
  get interactionHint(){
    if(this.move||this.locked)return null;
    const p=this.save.player,v=VECTOR[p.facing],x=p.x+v.x,y=p.y+v.y;
    const npc=this.map.npcs.find(n=>n.x===x&&n.y===y);if(npc)return npc.id==='tourPokemon'&&this.roaming?.move?null:'Z 말걸기 · '+npc.name;
    const prop=this.map.props.find(o=>o.x===x&&o.y===y);if(!prop)return null;
    if(!TOUR_MAPS[this.save.map as TourId])return 'Z 조사하기';
    if(prop.dialogue==='tourHost'&&TOUR_INTERIORS[this.save.map]?.reception)return 'Z 말걸기 · 간호사';
    const outdoors=getWorldOutdoors(this.map);
    const sign=outdoors?.signs.find(o=>o.event===prop.dialogue);if(sign)return 'Z 읽기 · '+sign.name+' 방면';
    const object=outdoors?.objects.find(o=>o.event===prop.dialogue)??TOUR_INTERIORS[this.save.map]?.objects.find(o=>o.event===prop.dialogue);
    return 'Z 조사 · '+(object?.name??(prop.dialogue==='tourHouse'?'주택 현관':'사물'));
  }
  get locked(){return !!this.battle||!!this.dialogue||this.panel!=='field'||this.transition>0}
  get position(){if(!this.move)return this.save.player;const t=Math.min(1,this.move.elapsed/this.move.duration);return {x:this.move.from.x+(this.move.to.x-this.move.from.x)*t,y:this.move.from.y+(this.move.to.y-this.move.from.y)*t}}
  notice(text:string){this.toast=text;this.toastTime=3}
  persist(manual=false){markTourVisit(this.save);try{localStorage.setItem(this.storageKey,JSON.stringify(this.save));this.saveError=false;if(manual)this.say('리포트',['지금까지의 모험을\n리포트에 기록했습니다!']);return true;}catch{this.saveError=true;if(manual)this.say('리포트',['브라우저가 저장을 허용하지 않습니다.\n현재 창에서는 계속 플레이할 수 있어요.']);return false;}}
  say(speaker:string,pages:string[],after?:()=>void,choices?:Choice[]){this.dialogueElapsed=0;this.caughtPreview=null;this.caughtBoxPreview=null;this.gymReward=null;this.confirmingBattleExit=false;this.defeatScene=null;this.recoveryPreview=false;this.battleFrames=null;this.gymPreview=null;this.dialogue={speaker,pages,page:0,shown:0,selected:0,after,choices};this.clearInput();this.announce()}
  announce(){const el=document.getElementById('a11y');if(el&&this.dialogue)el.textContent=this.dialogue.speaker+' '+this.dialogue.pages[this.dialogue.page]}
  private soundedFrame:BattleFrame|null=null;
  private soundedResult:Battle|null=null;
  private battleFanfare:'victory'|'catch'|null=null;
  private updateAudio(){
    const battle=this.presentedBattle,place=tourPlaceForMap(this.save.map),passage=PASSAGES[this.save.map];
    this.audio.setScene(battle?(battle.kind==='wild'?'wild':'gym'):passage?.kind==='cave'||place?.theme==='cave'?'cave':passage||this.save.map==='route_s01'||place?.theme==='forest'?'route':'town');
    const finished=this.battle?.result&&this.dialogue&&this.dialogue.page===this.dialogue.pages.length-1;
    if(finished&&this.battleFanfare&&this.soundedResult!==this.battle){this.soundedResult=this.battle;this.audio.play(this.battleFanfare!);}
    const frame=this.battleFrame;
    if(frame!==this.soundedFrame){this.soundedFrame=frame;if(frame?.technique)this.audio.playMove(frame.technique.move);else if(frame?.growth?.kind==='evolution')this.audio.play('evolution');}
  }
  update(dt:number){this.updateAudio();dt=Math.min(dt,.05);this.clock+=dt;this.save.seconds+=dt;this.labelTime=Math.max(0,this.labelTime-dt);this.toastTime=Math.max(0,this.toastTime-dt);this.bumpCooldown=Math.max(0,this.bumpCooldown-dt);
    this.roaming?.update(dt,this.save.player,this.move?.to,this.locked);

    if(this.transition>0){const old=this.transition;this.transition=Math.max(0,this.transition-dt);if(old>.18&&this.transition<=.18){this.transitionWarp?.();this.transitionWarp=null;}return}
    if(this.dialogue){this.dialogueElapsed+=dt;this.dialogue.shown+=dt*this.textSpeed;return}
    if(this.move){this.move.elapsed+=dt;if(this.move.elapsed>=this.move.duration){this.save.player.x=this.move.to.x;this.save.player.y=this.move.to.y;this.move=null;this.save.steps++;this.stepPhase++;const warp=this.map.warps.find(w=>w.x===this.save.player.x&&w.y===this.save.player.y&&w.entry===this.save.player.facing);if(warp){this.clearInput();this.transition=.4;this.audio.play('door');this.transitionWarp=()=>{this.save.map=warp.to;this.save.player={...warp.spawn,facing:warp.facing};this.labelTime=2.6;this.grassSteps=0;this.persist()};return}this.onFieldStep();if(this.locked)return;
      const pending=this.pendingFieldAction;
      if(pending){this.clearInput();if(pending==='confirm')this.confirm();else if(pending==='cancel')this.cancel();else this.toggleFieldMap();return;}
    }}
    if(!this.battle&&this.panel==='field'&&!this.move){const direction=[...this.keys].reverse().map(k=>KEY_DIRECTION[k]).find(Boolean);if(direction)this.walk(direction)}
  }
  walk(direction:Direction){if(this.locked||this.move)return;this.save.player.facing=direction;const p=this.save.player,v=VECTOR[direction],to={x:p.x+v.x,y:p.y+v.y};if(canEnter(this.map,to.x,to.y,direction)){this.move={from:{x:p.x,y:p.y},to,elapsed:0,duration:this.keys.has('Shift')?.09:.16}}else if(this.bumpCooldown<=0){this.audio.play('bump');this.bumpCooldown=.3}}
  press(key:string,repeat=false){
    if(this.transition>0)return;
    const direction=KEY_DIRECTION[key];
    if(direction||key==='Shift'){
      // UI directions and stale OS repeats must never seed a new field walk.
      if(!this.locked&&!this.pendingFieldAction&&(!repeat||this.keys.has(key)))this.keys.add(key);
      if(repeat||this.pendingFieldAction)return;
      if(direction){if(this.locked)this.navigate(direction);else this.walk(direction);}
      return;
    }
    if(repeat)return;
    if(key==='m')this.toggleFieldMap();
    else if(key==='z'||key==='Enter'||key===' ')this.confirm();
    else if(key==='x'||key==='Escape')this.cancel();
  }
  release(key:string){this.keys.delete(key)}
  navigate(dir:Direction){const delta=dir==='up'||dir==='left'?-1:1;this.audio.play('menu');if(this.dialogue){if(this.dialogue.choices&&this.dialogue.page===this.dialogue.pages.length-1)this.dialogue.selected=(this.dialogue.selected+delta+this.dialogue.choices.length)%this.dialogue.choices.length;return}if(this.battle){this.battle.selected=gridSelection(this.battle.selected,(this.battle.menu==='party'||this.battle.menu==='heal')?this.save.party.length:this.battle.menu==='actions'?4:2,dir);return}if(this.panel==='menu')this.menuIndex=(this.menuIndex+delta+6)%6;else if(this.panel==='starters')this.starterIndex=(this.starterIndex+delta+3)%3;else if((this.panel==='party'||this.panel==='fieldHeal')&&this.save.party.length)this.partyIndex=gridSelection(this.partyIndex,this.save.party.length,dir);else if(this.panel==='bag')this.bagIndex=gridSelection(this.bagIndex,2,dir);else if(this.panel==='summary'){if(dir==='up'||dir==='down')this.browseParty(delta);else this.summaryActionIndex=(this.summaryActionIndex+delta+3)%3;}else if(this.panel==='options')this.optionIndex=(this.optionIndex+delta+3)%3;}
  confirm(){if(this.deferFieldAction('confirm'))return;this.audio.play('confirm');if(this.dialogue){const d=this.dialogue,page=d.pages[d.page];if(d.shown<page.length){d.shown=page.length;return}if(this.battlePresentation?.canAdvance===false)return;if(d.page<d.pages.length-1){d.page++;d.shown=0;this.dialogueElapsed=0;this.announce();return}this.dialogue=null;if(d.choices)d.choices[d.selected].action();else d.after?.();return}
    if(this.battle){this.selectBattle();return}
    if(this.panel==='field'){this.interact();return}
    if(this.panel==='menu'){this.selectMenu(this.menuIndex);return}
    if(this.panel==='starters'){this.chooseStarter();return}
    if(this.panel==='party'){if(this.save.party.length){this.panel='summary';this.summaryActionIndex=0;}return}
    if(this.panel==='bag'){this.selectFieldItem(this.bagIndex);return}
    if(this.panel==='fieldHeal'){this.useFieldPotion(this.partyIndex);return}
    if(this.panel==='summary'){this.manageParty(this.summaryActionIndex);return}
    if(this.panel==='trainer'){showPokedex(this);return}
    if(this.panel==='options'){this.selectOption(this.optionIndex);return}
  }
  cancel(){if(this.deferFieldAction('cancel'))return;this.audio.play('menu');this.clearInput();if(this.dialogue&&this.battlePresentation){this.confirm();return}if(this.dialogue){const d=this.dialogue;if(d.choices){this.dialogue=null;d.choices[d.choices.length-1].action()}else this.confirm();return}if(this.battle){if(this.battle.betweenOpponents){if(this.battle.menu==='party'){this.battle.menu='between';this.battle.selected=1;}else{this.battle.betweenOpponents=false;this.battle.menu='actions';this.battle.selected=0;}return}if(this.battle.forcedSwitch){this.notice('다음에 싸울 포켓몬을 선택하세요.');return}if(this.battle.menu==='heal'){this.battle.menu='bag';this.battle.selected=1}else if(this.battle.menu!=='actions'){this.battle.selected=this.battle.menu==='bag'?1:this.battle.menu==='party'?2:0;this.battle.menu='actions';}else this.notice(this.battle.kind==='gym'?'중단하려면 도전 중단을 선택하세요.':'도망치려면 도망친다를 선택하세요.');return}if(this.panel==='field'){this.panel='menu';this.menuIndex=0}else if(this.panel==='starters'){this.panel='field';this.say('은솔박사',['천천히 생각해 보거라.\n마음이 정해지면 다시 말을 걸어라.'])}else if(this.panel==='fieldHeal'){this.panel='bag';this.bagIndex=1;}else if(this.panel==='summary')this.panel='party';else if(this.panel==='menu')this.panel='field';else this.panel='menu';}
  selectMenu(index:number){this.clearInput();if(index===0){this.panel='party';this.partyIndex=0}else if(index===1){this.panel='bag';this.bagIndex=1;}else if(index===2)this.panel='trainer';else if(index===3)this.persist(true);else if(index===4)this.panel='options';else this.panel='field';}
  selectOption(index:number){if(index===0){this.textSpeed=this.textSpeed===36?80:36;this.notice(this.textSpeed===80?'대화 속도: 빠르게':'대화 속도: 보통')}else if(index===1){const enabled=this.audio.toggle();document.getElementById('sound')!.textContent=enabled?'소리 ON':'소리 OFF'}else this.say('처음부터',['현재 리포트를 지우고\n처음부터 다시 시작할까요?'],undefined,[{label:'처음부터',action:()=>{this.save=this.freshSave();this.panel='field';this.labelTime=3;this.persist()}},{label:'돌아가기',action:()=>{}}]);}
  interact(){const p=this.save.player,v=VECTOR[p.facing],x=p.x+v.x,y=p.y+v.y;const npc=this.map.npcs.find(n=>n.x===x&&n.y===y);if(npc){if(npc.id==='tourPokemon'&&this.roaming?.move)return;npc.facing=({up:'down',down:'up',left:'right',right:'left'} as const)[p.facing];this.event(npc.dialogue);return}const prop=this.map.props.find(q=>q.x===x&&q.y===y);if(prop){this.event(prop.dialogue);return}}
  event(id:string){if(handleRoadTrainer(this,id)||handleCityActivity(this,id)||handleJourneyEvent(this,id))return;if(id==='tourHost'&&isWorldCenter(this.save.map))id='nurse';if(TOUR_MAPS[this.save.map as TourId]&&(id.startsWith('tour')||TOUR_RESIDENTS[this.save.map]?.some(n=>n.dialogue===id))){const pokemon=TOUR_POKEMON[this.save.map];if(pokemon&&id===pokemon.dialogue){this.say(pokemon.name,pokemon.pages);return}const resident=TOUR_RESIDENTS[this.save.map]?.find(n=>n.dialogue===id);if(resident){this.say(resident.name,resident.pages);return}const outdoors=getWorldOutdoors(this.map);const outdoor=outdoors?.objects.find(o=>o.event===id)??outdoors?.signs.find(o=>o.event===id);if(outdoor){this.say(outdoor.name,outdoor.pages);return}const room=TOUR_INTERIORS[this.save.map];const object=room?.objects.find(o=>o.event===id);if(object){this.say(object.name,object.pages);return}if(room&&id==='tourHost'){this.say(this.map.npcs[0].name,room.greeting);return}const p=tourPlaceForMap(this.save.map);if(id==='tourGuide'&&p&&outdoors?.signs.length){this.say(this.map.npcs.find(n=>n.dialogue==='tourGuide')?.name??'마을 안내원',[p.concept+'\n출구 표지와 같은 방향으로 걸어가세요.',...outdoors.signs.map(sign=>sign.pages[0])]);return}this.say(id==='tourHost'?'시설 안내원':'마을 안내',p?[id==='tourHouse'?'주민들이 사는 집입니다.\n센터와 주요 시설 안을 둘러볼 수 있어요.':p.concept+'\n이곳은 자유롭게 둘러볼 수 있어요.',...TOUR_NEIGHBORS(p.id).map(n=>{const q=placeById(n)!;return(q.region===p.region?'길을 따라 ':'지방 연결편: ')+q.name+'로 이동할 수 있어요.'})]:['새잎마을의 시작 구간이에요.\n서쪽 출구가 축복시티로 이어집니다.']);return}if(id==='mom'){const pages=motherConversation(this.save);if(this.save.party.some(p=>p.hp<p.maxHp)){this.healParty();this.persist();pages.push('조금 쉬었다 가렴.\n포켓몬들이 모두 건강해졌단다.')}this.say('엄마',pages);return}
    if(GYMS.some(g=>g.id===id)){this.challengeGym(id as GymId);return}
    if(sinnohEvent(this,id))return;
    if(id==='nurse'){
      if(isWorldCenter(this.save.map)&&this.save.party.length)this.save.healingPoint=this.save.map as SaveData['healingPoint'];
      this.healParty();if(!this.save.badges.length)this.save.inventory.potions=Math.max(2,this.save.inventory.potions);this.persist();
      this.say('간호사',[this.save.badges.length?'포켓몬들이 모두 건강해졌어요!\n필요한 도구는 상점에서 구입하세요.':'포켓몬들이 모두 건강해졌어요!\n상처약도 2개까지 보충했어요.', '모험 중 쓰러지면 여기로 데려올게요.\n언제든 편히 쉬러 오세요.']);return
    }
    if(id==='gymGuide'&&this.save.map==='oreburgh_gym'){
      const save=this.save;
      const current=()=>this.save===save&&save.map==='oreburgh_gym'&&!this.battle;
      this.say('체육관 안내원',['강석에게 도전하기 전에\n동료와 기술을 함께 살펴볼까?'],undefined,[
        {label:'내 파티 준비 상담',action:()=>{if(!current())return;this.say('체육관 안내원',gymCoachPages(save),undefined,[
          {label:'포켓몬 확인',action:()=>{if(!current())return;this.panel='party';this.partyIndex=0;}},
          {label:'돌아가기',action:()=>{}}
        ]);}},
        {label:'체육관 안내',action:()=>{if(current())this.say(TEXT.gymGuide.speaker,TEXT.gymGuide.pages);}},
        {label:'돌아가기',action:()=>{}}
      ]);return;
    }
    if(id==='routeSign'&&this.save.map==='route_s01'){
      this.say('서쪽길 안내판',[TEXT.routeSign.pages[0],...routeCompanionPages(this.save.map),'흙길은 포켓몬을 만나지 않는 길이다.']);return;
    }
    if(id==='gatekeeper'){this.departure();return}
    if(id==='routeGuide'){this.healParty();if(!this.save.badges.length){this.save.inventory.pokeBalls=Math.max(5,this.save.inventory.pokeBalls);this.save.inventory.potions=Math.max(2,this.save.inventory.potions);}this.persist();this.say('길 안내원',['포켓몬들을 쉬게 해 줄게요.\n모두 건강해졌어요!', this.save.badges.length?'첫 배지까지의 무료 보급은 끝났어요.\n이제 마을 상점에서 도구를 준비하세요.':'몬스터볼 5개, 상처약 2개까지\n부족한 도구도 보충했어요.', ...routeCompanionPages(this.save.map), '힘들면 도망쳐도 괜찮아요.\n흙길을 따라 동쪽이 새잎마을이에요.']);return}
    if(id==='professor'||id==='pokeballs'){const story=professorConversation(this.save);this.save.flags.professorMet=true;this.say('은솔박사',story.pages,()=>{this.save.flags.professorIntroHeard=true;if(story.offerStarter){this.panel='starters';this.starterIndex=0;}this.persist();});return}
    if(id==='assistant'){this.assistant();return}const text=TEXT[id];if(text)this.say(text.speaker,text.pages);
  }
  chooseStarter(){const species=STARTERS[this.starterIndex],name=SPECIES[species].name;this.say('은솔박사',[`${name}! 이 포켓몬을\n너의 첫 파트너로 선택하겠니?`],undefined,[{label:'예',action:()=>{this.receive(species)}},{label:'아니요',action:()=>{this.panel='starters'}}]);}
  receive(species:number){this.panel='field';if(!grantPokemon(this.save,species)){this.say('',['이미 함께하고 있는 친구입니다.']);return}this.audio.play('receive');this.persist();const name=SPECIES[species].name;this.say('',[`${withParticle(name,'과/와')} 친구가 되었다!`,`${withParticle(name,'이/가')} 파티에 등록되었다!\nX → 포켓몬에서 확인할 수 있다.`],()=>{if(species===25)this.say('연구원',['정말 고마워! 서두르지 말고\n이 친구의 마음을 알아가 줘.']);else this.say('은솔박사',['이제 너도 포켓몬 트레이너로구나!\n함께 마을을 둘러보고 오렴.'])});}
  assistant(){if(this.save.flags.pikachuReceived){this.say('연구원',['피카츄가 널 조금씩 믿는 것 같아.\n이 친구를 맡아 줘서 고마워!']);return}const count=Math.min(4,Number(this.save.flags.assistantTalks??0)+1);this.save.flags.assistantTalks=count;this.persist();if(count===1)this.say('연구원',['말을 안 듣는 포켓몬이 있어\n고민이야…']);else if(count===2)this.say('연구원',['이 녀석을 데려갈 트레이너가\n없으려나…']);else if(count===3)this.say('연구원',['…','피카츄도 사실은\n친구가 필요한 걸지도 모르겠어.']);else this.say('연구원',['네가 혹시 이 친구를\n데려가 주겠니?'],undefined,[{label:'피카츄를 데려간다',action:()=>this.receive(25)},{label:'조금 더 생각한다',action:()=>this.say('연구원',['괜찮아. 마음이 바뀌면\n다시 이야기해 줘.'])}]);}
  restore(save:SaveData){const canonical=worldMapId(save.map);if(canonical!==save.map)save={...save,map:canonical,player:{...worldSpawn(canonical)!,facing:'down'},healingPoint:worldMapId(save.healingPoint)};if(save.flags.exploration){save={...structuredClone(this.save),map:save.map,player:{...save.player},tourVisited:[...new Set([...(this.save.tourVisited??[]),...(save.tourVisited??[])])]};}save={...save,flags:{...save.flags}};delete save.flags.exploration;this.save=checkpoint(save);this.tourEvent=null;this.caughtPreview=null;this.caughtBoxPreview=null;this.gymReward=null;this.confirmingBattleExit=false;this.defeatScene=null;this.recoveryPreview=false;this.battle=null;this.battleFrames=null;this.gymPreview=null;this.grassSteps=0;this.clearInput();this.move=null;this.transition=0;this.transitionWarp=null;this.dialogue=null;this.dialogueElapsed=0;this.panel='field';this.menuIndex=0;this.partyIndex=0;this.bagIndex=1;this.starterIndex=0;this.optionIndex=0;this.stepPhase=0;this.labelTime=2.6;this.toastTime=0;if(this.save.party.length&&this.save.party.every(p=>p.hp===0))this.returnHome();this.persist();}

  healParty(){for(const p of this.save.party)p.hp=p.maxHp}
  returnHome(){this.defeatScene=null;this.recoveryPreview=false;this.battleFrames=null;this.battle=null;this.grassSteps=0;this.clearInput();this.move=null;this.transition=0;this.transitionWarp=null;this.save.map=worldMapId(this.save.healingPoint);this.save.healingPoint=this.save.map;this.save.player=this.save.map==='home'?{x:4,y:5,facing:'up'}:{...(worldSpawn(this.save.map)??{x:8,y:10}),facing:'up'};this.panel='field';this.healParty();this.labelTime=2.6;this.persist()}
  departure(){
    if(this.save.flags.departureCleared){this.say('이웃 도윤',['길은 이제 안전하게 지날 수 있단다.\n서쪽길 안내원에게 쉬어 가렴.']);return}
    if(!this.save.party.some(p=>p.hp>0)){this.say('이웃 도윤',['서쪽길 정비가 끝났단다.\n하지만 혼자 나가면 위험해.', '건강한 포켓몬과 함께 오렴.\n첫 파트너는 연구소에서 만날 수 있어.']);return}
    this.say('이웃 도윤',['새 친구와 함께 왔구나!\n서쪽길 정비가 끝났단다.', '몬스터볼 5개와 상처약 2개를 줄게.\n서쪽길 안내원에게 쉬어 갈 수 있어.', '풀밭을 피해 흙길로 돌아와도 돼.\n자, 너희의 첫 모험을 시작해 보렴!'],()=>{
      this.save.flags.departureCleared=true;this.save.inventory.pokeBalls=Math.min(999,this.save.inventory.pokeBalls+5);this.save.inventory.potions=Math.min(999,this.save.inventory.potions+2);this.persist();
    });
  }
  onFieldStep(){
    if(!hasWildEncounters(this.save.map)||!this.save.flags.departureCleared)return;
    const p=this.save.player;
    if(!this.map.terrain?.some(r=>p.x>=r.x&&p.x<r.x+r.w&&p.y>=r.y&&p.y<r.y+r.h))return;
    if(++this.grassSteps<6)return;
    this.grassSteps=0;this.clearInput();this.battle=createBattle(this.save,'wild','roark',this.random);
    if(!this.battle){this.returnHome();this.say(this.save.healingPoint==='home'?'엄마':'간호사',['쉬었던 곳으로 돌아왔다.\n포켓몬들이 모두 건강해졌다!']);return}
    this.persist();this.say('',[`앗! 야생 ${withParticle(SPECIES[this.battle.enemy.species].name,'이/가')} 나타났다!`]);
  }
  challengeRoark(){this.challengeGym('roark')}
  challengeGym(id:GymId){
    const gym=gymById(id),speaker='관장 '+gym.name;
    if(this.save.badges.includes(gym.badge)){this.say(speaker,[gym.label+'는 함께 이뤄 낸 증거야.\n다음 여행에서도 서로를 믿어 줘.']);return}
    const preparation=gymPreparation(this.save,id);
    if(preparation.blocked){this.say(speaker,[preparation.blocked]);return}
    this.say(speaker,['나는 이 체육관의 관장 '+gym.name+(id==='roark'?'이야.':'야.')+'\n파트너와 쌓은 믿음을 보여 줘!',gym.team.map(p=>SPECIES[p[0]].name).join(', ')+'!\n준비가 되었다면 도전해 볼래?',preparation.advice],undefined,[
      {label:'도전한다',action:()=>{this.battle=createBattle(this.save,'gym',id);if(this.battle){this.persist();this.say(speaker,['좋아! '+SPECIES[gym.team[0][0]].name+', 부탁한다!'])}}},
      {label:'준비하고 온다',action:()=>{this.gymPreview=null}}
    ]);
    this.gymPreview=id;
  }
  selectBattle(){const b=this.battle;if(!b||b.result||this.dialogue)return;this.clearInput();
    if(b.menu==='between'){if(b.selected===0){b.betweenOpponents=false;b.menu='actions';b.selected=0;}else{b.menu='party';b.selected=this.save.party.findIndex((p,i)=>i!==b.active&&p.hp>0);}return}
    if(b.menu==='party'){this.actBattle({switch:b.selected});return}
    if(b.menu==='heal'){this.actBattle({potion:b.selected});return}
    if(b.menu==='bag'){if(b.selected===0)this.actBattle('ball');else{b.menu='heal';b.selected=b.active;}return}
    if(b.menu==='moves'){this.actBattle(b.selected===0?'move0':'move1');return}
    if(b.selected===0){b.menu='moves';b.selected=b.moveSelections[b.active]??0;return}
    if(b.selected===1){b.menu='bag';b.selected=0;return}
    if(b.selected===2){b.menu='party';b.selected=b.active;return}
    this.requestBattleExit();
  }
  requestBattleExit(){
    const b=this.battle;if(!b||b.result||this.dialogue||this.move||this.transition)return;
    if(b.kind==='wild'){this.actBattle('run');return;}
    this.say('도전 중단',['중단하면 다음 도전은 처음부터야.\n얻은 경험치와 현재 HP는 유지돼.','이번 승리 보상은 받을 수 없어.\n도전을 중단할까?'],undefined,[
      {label:'도전을 중단한다',action:()=>{this.confirmingBattleExit=false;if(this.battle===b)this.actBattle('run')}},
      {label:'계속 싸운다',action:()=>{this.confirmingBattleExit=false}}
    ]);
    this.dialogue!.selected=1;this.confirmingBattleExit=true;
  }
  selectFieldItem(index:number){
    if(this.battle||this.dialogue||this.panel!=='bag'||this.move||this.transition||!Number.isInteger(index)||index<0||index>1)return;
    this.bagIndex=index;this.clearInput();
    if(index===0){if(this.save.inventory.pokeBalls===0)this.showSupplyHint('pokeBalls');else this.say('몬스터볼',['야생 포켓몬과 싸울 때\n가방에서 사용할 수 있어요.']);return;}
    if(!this.save.party.length){this.say('상처약',['먼저 함께할 포켓몬을 만나세요.']);return;}
    if(this.save.inventory.potions<=0){this.showSupplyHint('potions');return;}
    const injured=this.save.party.findIndex(p=>p.hp>0&&p.hp<p.maxHp);
    this.partyIndex=injured<0?0:injured;this.panel='fieldHeal';
  }
  showSupplyHint(item:keyof SaveData['inventory']){
    if(this.battle||this.dialogue||this.panel!=='bag'||this.move||this.transition)return;
    const supply=itemSupply(this.save,item),name=item==='pokeBalls'?'몬스터볼':'상처약',save=this.save;
    if(!supply){this.say(name,[`${name}이 없어요.\n먼저 모험 출발 준비를 마쳐 주세요.`]);return;}
    this.say(name,[`${name}이 없어요.\n보충: ${supply.title}`,supply.event==='martClerk'?`${name}은 상점에서 200원에 살 수 있어요.\n가까운 상점까지 길을 안내할까요?`:`${item==='pokeBalls'?'몬스터볼 5개':'상처약 2개'}까지 무료로 채워 줘요.\n보충 장소까지 길을 안내할까요?`],undefined,[
      {label:'보충 장소 안내',action:()=>{if(this.save!==save||this.panel!=='bag')return;this.panel='field';this.setTourDestination(supply.map,supply.event);}},
      {label:'가방으로 돌아가기',action:()=>{}}
    ]);this.dialogue!.selected=1;
  }
  useFieldPotion(index:number){
    if(this.battle||this.dialogue||this.panel!=='fieldHeal'||this.move||this.transition)return;
    if(!Number.isInteger(index)||!this.save.party[index])return;
    this.partyIndex=index;this.clearInput();
    const message=healFieldPokemon(this.save,index);
    this.persist();this.say('상처약',[message]);
  }
  browseParty(delta:number){
    if(this.battle||this.dialogue||this.panel!=='summary'||this.move||this.transition)return;
    if((delta!==-1&&delta!==1)||this.save.party.length<2)return;
    this.clearInput();
    this.partyIndex=(this.partyIndex+delta+this.save.party.length)%this.save.party.length;
  }
  manageParty(action:number){
    if(this.battle||this.dialogue||this.panel!=='summary'||this.move||this.transition)return;
    const selected=this.save.party[this.partyIndex];if(!selected)return;
    if(action===2){showMoveSchool(this);return;}
    const message=action===0?leadPokemon(this.save,this.partyIndex):healFieldPokemon(this.save,this.partyIndex);
    this.partyIndex=this.save.party.indexOf(selected);this.persist();this.say('포켓몬', [message]);
  }
  actBattle(action:BattleAction){const b=this.battle;if(!b||b.result||this.dialogue)return;
    this.clearInput();const turn=battleTurn(this.save,b,action,this.random);if(b.forcedSwitch)b.menu='party';else if(b.betweenOpponents&&!turn.retry){b.menu='between';b.selected=0;}else if(!turn.retry){b.menu='actions';b.selected=0;}
    collectGrowthLearning(this,b,turn.frames);
    this.battleFanfare=turn.outcome==='caught'?'catch':turn.outcome==='won'?'victory':null;
    if(turn.outcome==='lost'){
      // Commit a safe, healed checkpoint now; the remaining defeat scene is display only.
      this.returnHome();
      this.say('',[...turn.pages,'더는 싸울 수 있는 포켓몬이 없다…\n쉬었던 곳으로 돌아가자.'],()=>{
        const home=this.save.map==='home';
        this.say(home?'엄마':'간호사',['쉬었던 곳으로 돌아왔다.\n포켓몬들이 모두 건강을 되찾았다!',this.save.inventory.potions<2?(this.save.badges.length?'도구가 부족하면 마을 상점에서\n상처약과 몬스터볼을 구입하자.':home?'상처약이 부족하면 길 안내원이나\n포켓몬센터에 들러 보렴.':'상처약이 부족하면 다시 말을 걸어 줘.\n2개까지 보충해 줄게.'):'파트너의 상태를 확인하고\n준비가 되면 다시 출발하자.'],()=>{this.recoveryPreview=false;});
        this.recoveryPreview=true;this.labelTime=2.6;
      });
      this.defeatScene=b;this.battleFrames=turn.frames??null;return;
    }
    if(turn.outcome==='won'&&b.kind==='trainer'&&b.trainer)this.save.flags[trainerWinFlag(b.trainer.id)]=true;
    if(turn.outcome==='won'&&b.kind==='gym'){
      const previousMoney=this.save.money;
      if(awardGym(this.save,b.gymId)){
        const gym=gymById(b.gymId),money=this.save.money-previousMoney,page=turn.pages.length;
        turn.pages.push(`${gym.name}에게 ${gym.label}를 받았다!`,`기술머신 「${gym.move}」 획득!\n상금 ${money.toLocaleString()}원을 받았다!`);
        const close=()=>{if(this.battle!==b)return false;this.gymReward=null;this.battleFrames=null;this.battle=null;this.grassSteps=0;return true;};
        this.persist();this.say('',turn.pages,undefined,[
          {label:'목표 안내',action:()=>{if(close())this.guideObjective();}},
          ...(hasGrowthLearning(this,b)?[{label:'기술 배우기',action:()=>{if(close())openGrowthLearning(this,b);}}]:[]),
          {label:'계속 모험하기',action:()=>{close();}}
        ]);
        this.dialogue!.selected=this.dialogue!.choices!.length-1;this.gymReward={id:b.gymId,money,page};this.battleFrames=turn.frames??null;return;
      }
    }
    if(turn.outcome==='caught'){
      const index=this.save.party.length-1,caught=turn.caughtInBox?this.save.box!.at(-1)!:this.save.party[index];
      const close=()=>{if(this.battle!==b)return false;this.caughtPreview=null;this.caughtBoxPreview=null;this.battleFrames=null;this.battle=null;this.grassSteps=0;return true;};
      this.persist();this.say('',turn.pages,undefined,[
        {label:turn.caughtInBox?'도감 보기':'정보 보기',action:()=>{if(!close())return;if(turn.caughtInBox)showPokedex(this);else if(this.save.party[index]===caught){this.partyIndex=index;this.summaryActionIndex=0;this.panel='summary';}}},
        {label:'계속 모험하기',action:()=>{close();}}
      ]);
      this.dialogue!.selected=1;if(turn.caughtInBox)this.caughtBoxPreview=caught;else this.caughtPreview=index;this.battleFrames=turn.frames??null;return;
    }
    if(turn.outcome==='won'&&hasGrowthLearning(this,b)){
      const close=()=>{if(this.battle!==b)return false;this.battleFrames=null;this.battle=null;this.grassSteps=0;return true;};
      this.persist();this.say('',turn.pages,undefined,[
        {label:'기술 배우기',action:()=>{if(close())openGrowthLearning(this,b);}},
        {label:'계속 모험하기',action:()=>{close();}},
      ]);this.dialogue!.selected=1;this.battleFrames=turn.frames??null;return;
    }
    this.persist();this.say('',turn.pages,()=>{this.battleFrames=null;if(turn.outcome&&this.battle===b){this.battle=null;this.grassSteps=0;}});this.battleFrames=turn.frames??null;
  }
  snapshot(){return {battlePresentation:this.battlePresentation,captureMotion:this.captureMotion,tourEvent:this.tourEvent,battleEffect:this.battleEffect,dialogueElapsed:this.dialogueElapsed,gymReward:this.gymReward,showingGymReward:this.showingGymReward,caughtPreview:this.caughtPreview,caughtBoxPreview:this.caughtBoxPreview,showingCatch:this.showingCatch,confirmingBattleExit:this.confirmingBattleExit,defeatScene:this.defeatScene?{kind:this.defeatScene.kind,gymId:this.defeatScene.gymId}:null,recoveryPreview:this.recoveryPreview,battleFrame:this.battleFrame?structuredClone(this.battleFrame):null,gymPreview:this.gymPreview,fieldMap:this.fieldMap,followingObjective:this.followingObjective,roaming:this.roaming?{position:this.roaming.position,moving:!!this.roaming.move,tiles:this.roaming.tiles}:null,navigation:this.tourNavigation,interactionHint:this.interactionHint,exploring:this.exploring,battle:this.battle?JSON.parse(JSON.stringify(this.battle)):null,grassSteps:this.grassSteps,save:JSON.parse(JSON.stringify(this.save)),panel:this.panel,dialogue:this.dialogue?{speaker:this.dialogue.speaker,pages:this.dialogue.pages,page:this.dialogue.page,shown:this.dialogue.shown,selected:this.dialogue.selected,choices:this.dialogue.choices?.map(c=>c.label)}:null,moving:!!this.move,transition:this.transition,menuIndex:this.menuIndex,bagIndex:this.bagIndex,starterIndex:this.starterIndex,partyIndex:this.partyIndex,map:{walkable:this.map.walkable,npcs:this.map.npcs.map(n=>({id:n.id,x:n.x,y:n.y})),warps:this.map.warps,reserved:this.map.reserved??[],terrain:this.map.terrain??[]},position:this.position};}
}
