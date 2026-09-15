import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { JOHTO_ROUTE_43 } from './johto-route-43';
import { ROUTE43_BATTLE } from './johto-route-43-battle';

export const ROUTE43_HOMEWARD_FLAGS={
  started:'nexusRoute43ResidentFramesStarted',slot:'nexusRoute43ResidentFramesSlot',species:'nexusRoute43ResidentFramesSpecies',
  rinsed:'nexusRoute43ResidentFramesRinsed',dried:'nexusRoute43ResidentFramesDried',returned:'nexusRoute43ResidentFramesReturned',
} as const;
export const ROUTE43_HOMEWARD_EVENTS={lake:'tourRoute43LakeBoard',water:'tourRoute43WaterRail',dry:'tourRoute43GateTrace',town:'tourRoute43MahoganyBoard'} as const;
const sessions=new WeakMap<Engine,object>();

export function handleJohtoRoute43Life(g:Engine,event:string):boolean{
  if(g.save.map!==JOHTO_ROUTE_43)return false;
  const save=g.save,player=save.player,x=player.x,y=player.y,token={};sessions.set(g,token);
  const current=()=>g.save===save&&save.player===player&&save.map===JOHTO_ROUTE_43&&player.x===x&&player.y===y&&!g.battle&&sessions.get(g)===token;
  const lead=save.party[0],party=lead?`선두 ${SPECIES[lead.species].name} · HP ${lead.hp}/${lead.maxHp}`:'현재 함께 걷는 동료가 없다.';
  const local=[...save.party,...save.box??[]].filter(mon=>mon.met==='성도 43번도로'),localParty=local.filter(mon=>save.party.includes(mon));
  const localLine=local.length?`43번도로 출신 동료 ${local.length}마리 · 파티 ${localParty.length} · PC ${local.length-localParty.length}\n${[...new Set(local.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].join('·')}`:'43번도로에서 만난 보유 동료는 아직 없다.';
  const camperWon=Boolean(save.flags['trainerWon:johto-route-43-camper-practice']);
  const won=Boolean(save.flags['trainerWon:johto-route-43-practice']),f=ROUTE43_HOMEWARD_FLAGS,e=ROUTE43_HOMEWARD_EVENTS;
  const bf=ROUTE43_BATTLE,battleSlot=save.flags[bf.slot],battlePartner=typeof battleSlot==='number'?save.party[battleSlot]:undefined;
  const battleLine=save.flags[bf.participated]&&battlePartner&&battlePartner.species===save.flags[bf.partner]&&battlePartner.met==='성도 43번도로'
    ?`${SPECIES[battlePartner.species].name} 실제 참가 · 시작 Lv.${Number(save.flags[bf.level]??battlePartner.level)} → 현재 Lv.${battlePartner.level} · HP ${battlePartner.hp}/${battlePartner.maxHp}`
    :'43번도로 출신 동료의 실제 선택전 승리 참가는 아직 기록되지 않았다.';
  const guide=(target:string)=>()=>{if(current())g.setTourDestination(JOHTO_ROUTE_43,target);};
  const chosen=()=>{const slot=save.flags[f.slot],mon=typeof slot==='number'?save.party[slot]:undefined;return mon&&mon.species===Number(save.flags[f.species])&&mon.met==='성도 43번도로'&&mon.hp>0?mon:undefined;};
  if(save.flags.nexusRageResidentsResumed&&[e.lake,e.water,e.dry,e.town].includes(event as typeof e[keyof typeof e])){
    const mon=chosen(),name=mon?SPECIES[mon.species].name:SPECIES[Number(save.flags[f.species])]?.name;
    if(event===e.lake&&!save.flags[f.started]){
      const candidates=save.party.filter(p=>p.hp>0&&p.met==='성도 43번도로');
      if(!candidates.length){g.say('호숫가 작업틀 귀환',['주민이 씻어 다시 쓸 갈대 거름틀의 빈 틀을 남쪽 길에 세워 두었다.','43번도로에서 만난 포켓몬을 건강한 상태로 파티에 데려오면, 풀밭과 마른 본선을 아는 동료와 함께 황토까지 옮길 수 있다.','이 작업과 관계없이 가운데 본선은 자유롭게 왕복할 수 있다.'],undefined,[{label:'43번도로 풀밭을 살핀다',action:()=>{}},{label:'황토센터에서 편성',action:()=>{if(current())g.setTourDestination('tour_mahogany_center','pc');}},{label:'그대로 지나간다',action:()=>{}}]);return true;}
      g.say('호숫가 작업틀 귀환',['주민의 취수·갈대 작업에 쓰던 빈 거름틀이다. 마른 본선으로 황토까지 가져가며 물길 상태를 다시 살피자.','43번도로에서 실제로 만난 건강한 동료를 고르자.'],undefined,[...candidates.map(p=>({label:`${SPECIES[p.species].name} · Lv.${p.level}`,action:()=>{const slot=save.party.indexOf(p);if(!current()||slot<0||p.hp<=0||p.met!=='성도 43번도로')return;save.flags[f.started]=true;save.flags[f.slot]=slot;save.flags[f.species]=p.species;delete save.flags[f.rinsed];delete save.flags[f.dried];delete save.flags[f.returned];g.persist();g.say('갈대 거름틀 운반',[`${SPECIES[p.species].name}이 풀밭 가장자리에서 빈 틀이 기울지 않게 지켜 준다.`,'가운데 상류 물길 관찰대에서 틈에 남은 진흙을 씻어 내자.'],undefined,[{label:'상류 물길 관찰대로',action:guide(e.water)},{label:'여기서 더 준비한다',action:()=>{}}]);}})),{label:'나중에 돕는다',action:()=>{}}]);return true;
    }
    if(!save.flags[f.started])return false;
    if(!mon){
      const storedSlot=save.flags[f.slot],stored=typeof storedSlot==='number'?save.party[storedSlot]:undefined;
      const tracked=Boolean(stored&&stored.species===Number(save.flags[f.species])&&stored.met==='성도 43번도로');
      if(!tracked){
        const candidates=save.party.filter(p=>p.hp>0&&p.met==='성도 43번도로');
        g.say('거름틀 작업 동료 다시 정하기',[`${name??'앞선 동료'}와 시작한 기록은 남아 있지만 PC 교체 뒤 실제 개체를 가리키는 슬롯이 끊겼다.`,'거름틀은 현재 위치와 단계에 그대로 있다. 현재 파티의 43번도로 출신 동료에게 남은 작업을 명시적으로 맡길 수 있다.'],undefined,[
          ...candidates.map(p=>({label:`${SPECIES[p.species].name} · Lv.${p.level}`,action:()=>{const slot=save.party.indexOf(p);if(!current()||slot<0||p.hp<=0||p.met!=='성도 43번도로')return;save.flags[f.slot]=slot;save.flags[f.species]=p.species;g.persist();g.say('남은 작업 인계',[`${SPECIES[p.species].name}에게 현재 위치의 거름틀과 남은 순서를 보여 주었다.`,'이미 씻거나 말린 단계는 반복하지 않는다. 같은 표지를 다시 살피면 이어갈 수 있다.']);}})),
          {label:'황토센터에서 편성',action:()=>{if(current())g.setTourDestination('tour_mahogany_center','pc');}},{label:'거름틀을 그대로 둔다',action:()=>{}},
        ]);return true;
      }
      g.say('함께 걷던 동료 확인',[`${name??'선택한 동료'}가 현재 건강한 상태로 같은 슬롯에 없다.`,'기절했다면 황토센터에서 회복한 뒤 같은 표지에서 이어가자. 거름틀은 현재 단계에 그대로 남아 있다.'],undefined,[{label:'황토센터로',action:()=>{if(current())g.setTourDestination('tour_mahogany_center','tourHost');}},{label:'그대로 둔다',action:()=>{}}]);return true;
    }
    if(event===e.lake){g.say('호숫가 작업틀 귀환',[`${name}과 빈 거름틀을 황토로 돌려보내는 중이다.`,save.flags[f.rinsed]?'틀의 진흙을 씻었다. 옛 검문 기단의 마른 자리에서 물기를 빼자.':'상류 물길 관찰대에서 틈의 진흙을 씻자.'],undefined,[{label:save.flags[f.rinsed]?'마른 기단으로':'상류 물길로',action:guide(save.flags[f.rinsed]?e.dry:e.water)},{label:'호수에 더 머문다',action:()=>{}}]);return true;}
    if(event===e.water){
      if(save.flags[f.rinsed]){g.say('씻어 둔 갈대 거름틀',[`${name}과 틈의 진흙을 씻어 냈다. 거름틀은 마른 둑에 기대어 둔 상태다.`,'남쪽 옛 검문 기단의 마른 자리에서 물기를 빼자.'],undefined,[{label:'옛 검문 기단으로',action:guide(e.dry)},{label:'물길을 더 살핀다',action:()=>{}}]);return true;}
      g.say('상류 물길의 거름틀',[`${name}이 마른 둑 쪽에서 빈 틀이 기울지 않도록 기다린다.`,'흐르는 가장자리 물로 틈의 진흙과 느슨한 잎만 씻을 수 있다. 물길 전체 정화나 식수 처리가 아니다.'],undefined,[{label:`${name}과 거름틀을 씻는다`,action:()=>{
        const partner=chosen();if(!current()||!partner)return;
        save.flags[f.rinsed]=true;g.persist();g.say('상류 물길에서 틀 씻기',[`${SPECIES[partner.species].name}이 마른 둑 쪽에서 틀을 받쳐 주는 동안 진흙과 느슨한 잎을 씻어 냈다.`,'남쪽 옛 검문 기단의 마른 자리에서 물기를 빼자.'],undefined,[{label:'옛 검문 기단으로',action:guide(e.dry)},{label:'물길을 더 살핀다',action:()=>{}}]);
      }},{label:'아직 씻지 않는다',action:()=>{}}]);return true;
    }
    if(event===e.dry){
      if(!save.flags[f.rinsed]){g.say('마른 작업 기단',['아직 거름틀 틈에 진흙이 남아 있다. 북쪽 상류 물길 관찰대에서 먼저 씻어 내자.'],undefined,[{label:'상류 물길로',action:guide(e.water)},{label:'그대로 지나간다',action:()=>{}}]);return true;}
      if(save.flags[f.dried]){g.say('말려 둔 갈대 거름틀',[`${name}과 평평한 돌에 세워 물기를 뺐다.`,'남쪽 황토 표석까지 옮겨 주민에게 돌려주자.'],undefined,[{label:'황토 북쪽 표석으로',action:guide(e.town)},{label:'조금 더 머문다',action:()=>{}}]);return true;}
      g.say('옛 기단의 마른 자리',[`${name}이 씻은 거름틀을 받쳐 들고 있다.`,'오래된 검문 기단의 평평한 돌은 길을 막지 않고 틀을 말릴 수 있는 자리다. 통행료나 검문 기능을 되살리는 것은 아니다.'],undefined,[{label:`${name}과 거름틀을 세운다`,action:()=>{
        const partner=chosen();if(!current()||!partner||!save.flags[f.rinsed])return;
        save.flags[f.dried]=true;g.persist();g.say('거름틀 물기 빼기',[`${SPECIES[partner.species].name}과 평평한 돌 위에 거름틀을 세워 물기를 뺐다.`,'남쪽 황토 표석까지 옮겨 주민에게 돌려주자.'],undefined,[{label:'황토 북쪽 표석으로',action:guide(e.town)},{label:'조금 더 말린다',action:()=>{}}]);
      }},{label:'아직 세우지 않는다',action:()=>{}}]);return true;
    }
    if(event===e.town){
      if(!save.flags[f.dried]){g.say('황토 북쪽 43번도로 표석',['거름틀을 돌려주기 전에 북쪽 물길에서 진흙을 씻고 옛 검문 기단의 마른 자리에서 물기를 빼자.'],undefined,[{label:save.flags[f.rinsed]?'마른 기단으로':'상류 물길로',action:guide(save.flags[f.rinsed]?e.dry:e.water)},{label:'황토로 그냥 돌아간다',action:()=>{if(current())g.setTourDestination('tour_mahogany');}}]);return true;}
      const onward=()=>[{label:'황토 산기슭 주택으로',action:()=>{if(current())g.setTourDestination('tour_mahogany_home1','tourHost');}},{label:'황토센터로',action:()=>{if(current())g.setTourDestination('tour_mahogany_center','tourHost');}},{label:'호수로 다시 걷기',action:guide(e.lake)}];
      if(save.flags[f.returned]){g.say('황토로 돌아온 거름틀',[`${name}과 돌려온 갈대 거름틀이 황토 쪽 작업 바구니 곁에 세워져 있다.`,'호수 주민은 필요할 때 같은 43번도로로 다시 가져갈 수 있다.'],undefined,onward());return true;}
      g.say('황토 북쪽의 작업 바구니',[`${name}과 씻고 말린 갈대 거름틀을 여기까지 옮겼다.`,'작업 바구니 곁에 세우면 호수 주민과 황토 주민이 다시 사용할 수 있다. 전력·송신·배수·상류 상태는 각각 별도 기록이다.'],undefined,[{label:'거름틀을 주민에게 돌려준다',action:()=>{
        const partner=chosen();if(!current()||!partner||!save.flags[f.dried])return;
        save.flags[f.returned]=true;g.persist();g.say('황토로 돌아온 거름틀',[`${SPECIES[partner.species].name}과 갈대 거름틀을 작업 바구니 곁에 세웠다.`,'호수 주민의 작업이 43번도로와 황토의 실제 왕복으로 이어졌다.'],undefined,onward());
      }},{label:'아직 들고 있는다',action:()=>{}}]);return true;
    }
  }
  if(event==='journeyWalker'){g.say('43번도로 상류 여행자',[party,localLine,`서쪽 선택 실전 · 남부 새잡이 ${won?'승리':'미승리'} · 북부 야영객 ${camperWon?'승리':'미승리'}`,battleLine,'북쪽은 분노의호수, 남쪽은 황토마을이며 서쪽 풀길과 동쪽 옛 검문 길이 양쪽 합류부로 이어진다.','옛 검문 흔적에는 현재 통행료·강제 전투·길막이 없다.']);return true;}
  const titles:Record<string,string>={tourRoute43LakeBoard:'분노의호수 남쪽 도착 표지',tourRoute43WaterRail:'상류 물길 관찰대',tourRoute43GateTrace:'옛 검문 흔적 표지',tourRoute43MahoganyBoard:'황토 북쪽 43번도로 표석'};
  if(!titles[event])return false;
  const boundary=event==='tourRoute43WaterRail'?'물길은 풍경 구역이며 수상 이동·낚시·야생 조우를 제공하지 않는다.':event==='tourRoute43GateTrace'?'현재 통행료·강제 전투·길막 조건은 없다.':'호숫가 주택에서 주민과 이야기를 나눌 수 있다. 물가에서는 표지와 둑길을 따라 걷자.';
  g.say(titles[event],[party,localLine,`서쪽 선택 실전 · 새잡이 ${won?'승리':'미승리'} · 야영객 ${camperWon?'승리':'미승리'}`,battleLine,'황토마을 ↔ 43번도로 ↔ 분노의호수',boundary]);return true;
}
