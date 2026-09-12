import { CASTELIA_HOMES as HOMES } from './castelia-home-data';
import type { GameMap,MapId } from './types';
import type { TourInterior } from './explore-interiors';
import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { showMoveSchool } from './move-school';
import { casteliaChosenSketch } from './castelia-gallery';

export function installCasteliaHomes(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,floors:Record<string,{title:string}>){
  for(const home of HOMES)for(let f=0;f<3;f++){
    const id=home.id+(f?`_${f+1}f`:''),room=rooms[id],map=maps[id];
    const title=`${home.title} · ${f+1}층 ${home.floors[f]}`;
    room.title=title;map.name='구름시티 · '+title;floors[id].title=title;
    map.npcs[0].name=home.host;
    room.greeting=[home.greeting,f?'오른쪽 아래 계단으로 내려가면\n1층 현관으로 돌아갈 수 있어.':'오른쪽 계단 위에도\n동료와 쉴 자리가 있어.'];
    if(!f)room.objects.forEach((object,i)=>{const [kind,name,text]=home.details[i];object.kind=kind;object.name=name;object.pages=[text];});
    else room.objects.forEach((object,i)=>{
      const detail=home.details[(i+f)%home.details.length];object.name=detail[1];object.pages=[detail[2]];
    });
  }
}

export function handleCasteliaHome(g:Engine,event:string):boolean{
  const home=HOMES.find(h=>h.id===g.save.map);if(!home||!['tourHost','tourDetail4_7'].includes(event))return false;
  const s=g.save,current=()=>g.save===s&&s.map===home.id&&!g.battle;
  const guide=(map:MapId,event?:string)=>{if(current())g.setTourDestination(map,event);};
  const choose=(page=0)=>{
    if(!current())return;
    g.say('함께 걷는 동료',[s.party.length?'기술을 준비할 동료를 골라 봐.':'동료를 만난 뒤 다시 찾아와.'],undefined,[
      ...s.party.slice(page*3,page*3+3).map(mon=>({label:SPECIES[mon.species].name,action:()=>{
        if(!current()||!s.party.includes(mon))return;g.partyIndex=s.party.indexOf(mon);showMoveSchool(g);
      }})),
      ...(s.party.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>choose(page?0:1)}]:[]),
      {label:'닫기',action:()=>{}},
    ]);
  };
  const sketch=casteliaChosenSketch(s.flags);
  g.say(home.host,[home.greeting,home.id.endsWith('home4')?(sketch?`네가 고른 풍경은 ${sketch}이구나.\n다음에는 다른 자리에서도 바라보렴.`:'항구에서 마음에 남는 풍경을 찾아봐.\n갤러리에서 스케치를 골라 둘 수 있어.'):`동료 ${s.party.length}마리 중\n다친 동료는 ${s.party.filter(p=>p.hp<p.maxHp).length}마리야.`],undefined,[
    ...(home.id.endsWith('home5')?[{label:'동료 기술 준비',action:()=>choose()}]:[]),
    {label:'갤러리로 안내',action:()=>guide('tour_castelia_hall','tourExhibit0')},
    {label:'센터에서 쉬기',action:()=>guide('tour_castelia_center','nurse')},
    {label:'정원으로 안내',action:()=>guide('tour_castelia','tourPokemon')},
    {label:'인사하고 나가기',action:()=>{}},
  ]);return true;
}
