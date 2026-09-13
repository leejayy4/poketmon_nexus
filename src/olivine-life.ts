import type { Engine } from './engine';
import { SPECIES } from './pokemon';

const partyState=(g:Engine)=>!g.save.party.length?'아직 함께 걷는 포켓몬이 없다.':g.save.party.some(p=>p.hp<=0)?'지친 동료가 있어 포켓몬센터에서 먼저 쉬는 편이 좋다.':`${SPECIES[g.save.party[0].species].name}을 선두로 항구를 걷고 있다.`;

/** City guidance and harbour observations; no rewards, healing, travel unlocks or story gates. */
export function handleOlivineLife(g:Engine,event:string):boolean{
  if(!g.save.map.startsWith('tour_olivine'))return false;
  const state=partyState(g);
  const origins=new Set(['성도 38번도로','성도 39번도로']),owned=[...g.save.party,...g.save.box??[]].filter(p=>origins.has(p.met));
  const localLine=`38·39번도로 출신 동료 ${owned.length}마리 · 파티 ${owned.filter(p=>g.save.party.includes(p)).length} · PC ${owned.filter(p=>!g.save.party.includes(p)).length}`;
  const lines:Record<string,[string,string,string]>={
    tourOlivineRoute39Stone:['39번도로 도착 표석','북쪽은 39번도로 → 38번도로 → 인주시티다.','39번도로 동쪽 튼튼목장은 선택 생활 구역이며 방문 여부가 담청 통행을 막지 않는다.'],
    tourOlivineHarborBoard:['담청항 노선 안내판','도시 북쪽은 39번도로 육상길, 남쪽은 적용된 40·41번수로 정기 연락선과 진청 방향이다.','담청항 ↔ 구름항은 프로젝트 고유 국제 항로이며 성도 연락선과 별도 노선이다.'],
    tourOlivineWorkDock:['작업항 안전선','작업 포켓몬과 짐수레가 오가는 적재선 밖의 판자길을 걷는다.','관찰만으로 도구나 돈을 얻거나 동료의 체력이 회복되지는 않는다.'],
    tourOlivineLighthouseBoard:['등대 오름길 표지','동쪽 길은 담청등대 입구, 서쪽 길은 센터와 작업항으로 이어진다.','등대 생활 전시는 체육관 도전·전설 조우·항로 잠금 조건이 아니다.'],
    tourOlivineRoute40Lookout:['40번수로 출발 전망대','남쪽 승선 데크에서 40번수로 연락선 → 41번수로·소용돌이섬 외부 선택 분기 → 진청시티로 간다.','수상 기술 없이 이용하는 정기 연락선이며 담청↔구름 국제 항로와 구분한다.'],
  };
  const save=g.save,selected=()=>{const species=Number(save.flags.olivineLighthouseSpecies??0);return save.party.find(p=>p.species===species&&p.hp>0);};
  if(event==='tourResident0'){g.say('항구 작업자',[state,localLine,save.flags.olivineLighthouseCompleted?'등대에서 외항 안전선을 기록했군. 작업항 트레이너와 선택 실전을 해 볼 수 있어.':'등대 1층에서 동료를 골라 외항 안전선을 살핀 뒤 작업항으로 돌아와 봐.','기록이나 배틀 없이도 센터·39번도로·기존 여객 항로는 이용할 수 있다.']);return true;}
  if(event==='tourResident1'){g.say('등대 방문객',[state,localLine,'북쪽은 39번도로와 튼튼목장·38번도로·인주 방향이다.','남쪽은 40·41번수로 정기 연락선·진청 방향이며 담청↔구름 국제 항로와 구분한다.']);return true;}
  if(event==='olivineCenterRouteBench'||event==='olivineCenterRouteChart'||event==='olivineCenterDryingBench'){
    g.say(event==='olivineCenterRouteChart'?'담청 여행 방향도':event==='olivineCenterDryingBench'?'항구 동료 장비 건조대':'39번도로 동료 휴게석',[state,localLine,save.flags.olivineLighthouseCompleted?'등대 외항 기록 완료 · 작업항 선택 실전 가능':'등대 1층 렌즈→2층 항로 표지→3층 등실 기록을 이어갈 수 있다.','실제 회복과 PC 편성은 간호사와 센터 PC를 이용한다.']);return true;
  }
  if(/^olivineMart/.test(event)){g.say('담청 출발 준비',[state,localLine,'실제 판매 품목은 기존 몬스터볼과 상처약이다. 40·41번수로 정기 연락선은 새 도구나 수상 기술을 요구하지 않는다.']);return true;}
  if(/^tour_olivine_home/.test(event)){g.say('담청 공동주택 생활',[state,localLine,save.flags.olivineLighthouseCompleted?'등대에서 기록한 안전선을 주민의 항구 생활 기록과 비교할 수 있다.':'장비 손질·물때 기록·옥상 화분은 항구에서 사람과 포켓몬이 함께 살아가는 생활 흔적이다.','생활 조사는 회복·아이템·보상·사건 완료를 만들지 않는다.']);return true;}
  if(event==='olivineLighthouseLensTable'){
    const healthy=save.party.filter(p=>p.hp>0);if(!healthy.length){g.say('등대 렌즈 손질대',[state,'센터에서 동료를 쉬게 한 뒤 함께 렌즈 빛을 살펴볼 수 있다.']);return true;}
    g.say('등대 관찰 동료',['보조 렌즈의 빛과 항로 표지를 함께 살필 건강한 동료를 고르자.','특정 종이나 포획 출처는 필요하지 않다.'],undefined,[...healthy.map(p=>({label:SPECIES[p.species].name,action:()=>{if(g.save!==save||!save.party.includes(p)||p.hp<=0)return;save.flags.olivineLighthouseSpecies=p.species;save.flags.olivineRouteObserved=false;save.flags.olivineLighthouseCompleted=false;g.persist();g.say('렌즈 빛 적응',[`${SPECIES[p.species].name}와 작은 보조 렌즈의 빛을 옆에서 천천히 살폈다.`,'2층 항로 관측 렌즈에서 외항 표지를 이어서 비교할 수 있다.']);}})),{label:'나중에 살핀다',action:()=>{}}]);return true;
  }
  if(event==='olivineLighthouseRouteLens'){
    const p=selected();if(!p){g.say('항로 관측 렌즈',[state,'1층 렌즈 손질대에서 건강한 동료를 먼저 고르자. 계단 통행은 막히지 않는다.']);return true;}
    save.flags.olivineRouteObserved=true;save.flags.olivineLighthouseCompleted=false;g.persist();g.say('외항 표지 관찰',[`${SPECIES[p.species].name}와 방파제·부표·작업항 안전선의 간격을 비교했다.`,'40·41번수로나 새 항로가 열리는 활동은 아니다. 3층 등실에서 빛의 방향을 기록할 수 있다.']);return true;
  }
  if(event==='olivineLighthouseLamp'){
    const p=selected();if(!p||!save.flags.olivineRouteObserved){g.say('담청 등실',[state,'1층에서 동료를 고르고 2층 외항 표지를 관찰하면 같은 동료와 빛의 방향을 기록할 수 있다.','관찰 없이도 등대와 도시를 자유롭게 오르내릴 수 있다.']);return true;}
    save.flags.olivineLighthouseCompleted=true;g.persist();g.say('담청 등실 기록',[`${SPECIES[p.species].name}와 외항에서 돌아오는 빛의 방향을 기록했다.`,'HP·경험치·도구·돈·항로·체육관 진행은 바뀌지 않는다.']);return true;
  }
  const entry=lines[event];if(!entry)return false;
  g.say(entry[0],[state,entry[1],entry[2]]);return true;
}
