import type { GameMap, Point, MapId } from './types';
import type { Place,TourId,TourBuilding } from './explore-world';
import type { TourInterior,Furnishing } from './explore-interiors';
import { applyJourneyRouteLayout } from './journey-route-layouts';

export interface Passage { id:TourId; a:Place; b:Place; kind:'road'|'cave'|'coast'; bend:number }
export const PASSAGES:Record<string,Passage>={};
export const ROOM_PARENTS:Record<string,Place>={};
export const FLOOR_INFO:Record<string,{floor:number;total:number;title:string}>={};
export const MART_ROOMS=new Set<string>();
export const HOME_ROOMS=new Set<string>();
export const MART_DOORS:Record<string,Point>={};
/** The owning city is distinct from the immediate floor used by map navigation. */
export const FLOOR_PARENTS:Record<string,TourId>={};
export const PASSAGE_PLACES:Record<string,Place>={};
export const journeyItemFlag=(id:string)=>'pickup:'+id;
// Passage loops are deliberately additive: these are former wall tiles only.
// Each kind gets a distinct two-tile-wide outer lane while the shared centre,
// props, terrain and exits remain unchanged.
const rect=(x:number,y:number,w:number,h:number):Point[]=>Array.from({length:h},(_,j)=>Array.from({length:w},(_,i)=>({x:x+i,y:y+j}))).flat();
export const PASSAGE_LOOP_OPENINGS:Record<Passage['kind'],Point[]>={
  road:rect(5,2,20,2).concat(rect(5,3,2,7),rect(23,3,2,8)),
  cave:rect(5,16,22,2).concat(rect(5,10,2,7),rect(25,10,2,7)),
  coast:rect(18,2,10,2).concat(rect(26,3,2,12),rect(18,14,10,2),rect(18,3,2,2)),
};
export function journeyConnection(map:GameMap,destination:MapId){
  return map.warps.find(w=>w.to===destination||PASSAGES[w.to]&&[PASSAGES[w.to].a.id,PASSAGES[w.to].b.id].includes(destination as TourId));
}
type World={places:Place[];maps:Record<TourId,GameMap>;buildings:Record<string,TourBuilding[]>;rooms:Record<string,TourInterior>;spawns:Record<TourId,Point>};
const fixture=(kind:Furnishing['kind'],name:string,text:string,x:number,y:number,w=3,h=2):Furnishing=>({kind,name,pages:[text],x,y,w,h,event:'tourDetail'+x+'_'+y});

function addRoom(w:World,p:Place,id:TourId,room:TourInterior,exit:GameMap['warps'][number]){
  const rows=Array.from({length:14},(_,y)=>Array.from({length:16},(_,x)=>x>=2&&x<=13&&y>=3&&y<=11||x===8&&y>=12?'.':'#'));
  const props:GameMap['props']=[];
  if(room.reception){const r=room.reception;for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){rows[y][x]='#';props.push({x,y,dialogue:MART_ROOMS.has(id)?'martClerk':'tourHost'});}}
  for(const o of room.objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){rows[y][x]='#';props.push({x,y,dialogue:o.event});}
  w.rooms[id]=room;ROOM_PARENTS[id]=p;w.spawns[id]={x:8,y:10};
  w.maps[id]={id,name:p.name+' · '+room.title,width:16,height:14,background:id,walkable:rows.map(r=>r.join('')),warps:[exit],props,npcs:[{id:'tourHost',name:MART_ROOMS.has(id)?'점원':HOME_ROOMS.has(id)?'주민':'시설 안내원',sprite:MART_ROOMS.has(id)?'school_kid_m':HOME_ROOMS.has(id)?'pokemon_breeder_f':'scientist_f',...room.host,facing:'down',dialogue:MART_ROOMS.has(id)?'martClerk':'tourHost'}]};
}

// Extend existing places. IDs of old rooms, exits and story events remain stable.
export function buildJourneyWorld(w:World){
  const gymCities=new Set(['tour_oreburgh','tour_eterna','tour_hearthome','tour_veilstone']);
  for(const p of w.places){
    const town=w.maps[p.id],houses=(w.buildings[p.id]??[]).filter(b=>b.kind==='house');
    if(!houses.length)continue;
    let shop=false;
    for(const [i,b] of houses.entries()){
      if(gymCities.has(p.id)&&i===0)continue;
      const isShop=!shop;shop=true;
      const id=`${p.id}_${isShop?'mart':'home'+i}` as TourId;b.room=id;
      if(isShop){MART_ROOMS.add(id);MART_DOORS[p.id]=b.door;}else HOME_ROOMS.add(id);
      const room:TourInterior=isShop?{style:'shop',title:'프렌들리숍',host:{x:8,y:5},reception:{x:6,y:6,w:4,h:1},greeting:['여행에 필요한 도구를 골라 주세요.'],objects:[fixture('shelf','몬스터볼 여행용품','몬스터볼 200원\n야생 포켓몬을 새로운 동료로!',3,4,2,2),fixture('shelf','상처약 여행용품','상처약 200원\n포켓몬 한 마리의 HP를 20 회복한다.',11,4,2,2),fixture('plants','화분','잎을 깨끗하게 닦아 놓았다.',3,9,2,1)]}:{style:'dojo',title:i%2?'주민의 집 · 거실':'주민의 집 · 작업방',host:{x:10,y:8},greeting:[p.name+'에서 살고 있어요.',p.theme==='port'?'항구에서 돌아오면 파트너와\n따뜻한 차를 마시곤 해요.':p.theme==='mine'?'돌 틈의 포켓몬을 만날 때는\n상처약과 몬스터볼을 챙겨 가세요.':'여행 중 만난 포켓몬은 센터 PC에\n맡기고 다시 데려올 수 있어요.'],objects:[fixture('workbench',i%2?'가족 식탁':'주민의 작업대',i%2?'두 사람과 포켓몬이 먹을\n따뜻한 식사가 준비되어 있다.':'여행 가방의 끈을 수선하고 있다.\n파트너의 작은 방석도 만들었다.',4,7,3,1),fixture('shelf','생활 책장',p.name+'의 사진과\n포켓몬을 돌보는 책이 꽂혀 있다.',3,4),fixture('bench','창가 소파','햇볕이 잘 드는 창가다.\n포켓몬용 방석도 놓여 있다.',10,4),fixture('plants','작은 화분','어린 잎이 창문 쪽을 향한다.',3,10,2,1)]};
      addRoom(w,p,id,room,{x:8,y:13,to:p.id,spawn:{x:b.door.x,y:b.door.y+1},entry:'down',facing:'down'});
      town.walkable[b.door.y]=town.walkable[b.door.y].slice(0,b.door.x)+'.'+town.walkable[b.door.y].slice(b.door.x+1);
      town.props=town.props.filter(q=>q.x!==b.door.x||q.y!==b.door.y);
      town.warps.push({...b.door,to:id,spawn:{x:8,y:10},entry:'up',facing:'up'});
      // Five-tile urban houses use the existing tall apartment sprite. Give its
      // visible storeys rooms; low rural houses stay one-storey homes.
      if(!isShop&&b.w>=5){
        const floors=[id,`${id}_2f`,`${id}_3f`] as TourId[];
        for(let f=0;f<3;f++){
          const floor=floors[f],title='주민 공동주택 '+(f+1)+'층';
          FLOOR_INFO[floor]={floor:f+1,total:3,title};ROOM_PARENTS[floor]=p;HOME_ROOMS.add(floor);
          if(f){
            FLOOR_PARENTS[floor]=floors[f-1];
            const upper:TourInterior={style:f===1?'dojo':'garden',title,host:{x:9,y:8},greeting:[f===1?'가족이 조용히 책을 읽는 층이에요.':'이웃과 포켓몬이 함께 쉬는 정원이에요.','오른쪽 아래 계단을 내려가면\n1층 현관으로 돌아갈 수 있어요.'],objects:f===1?[
              fixture('shelf','가족의 책장','포켓몬과 함께 자란 가족들의\n사진과 책이 정리되어 있다.',3,4),
              fixture('bench','독서 소파','폭신한 쿠션과 얇은 담요가 있다.\n곁에 파트너의 잠자리를 마련했다.',9,4),
              fixture('workbench','독서 책상','여행지에서 보낸 엽서가 있다.\n가족에게 새 동료를 소개하는 글이다.',3,9),
            ]:[
              fixture('plants','공동 텃밭','이웃들이 함께 가꾸는 화분이다.\n각 화분에 돌보는 사람 이름이 있다.',3,4),
              fixture('tank','작은 수초 연못','파트너들이 모여 쉬는 작은 수조다.\n맑은 물속에서 수초가 흔들린다.',9,4),
              fixture('bench','이웃의 쉼터','작은 물뿌리개를 내려놓고\n도시를 바라보며 쉬는 자리다.',3,9),
            ]};
            addRoom(w,p,floor,upper,{x:12,y:10,to:floors[f-1],spawn:{x:12,y:8},entry:'down',facing:'down'});
            w.maps[floor].walkable[12]='#'.repeat(16);w.maps[floor].walkable[13]='#'.repeat(16);
          }else w.rooms[floor].greeting.push('오른쪽 계단으로 올라가면\n독서실과 공동 정원도 있어요.');
          w.maps[floor].name=p.name+' · '+title;
          if(f<2)w.maps[floor].warps.push({x:12,y:7,to:floors[f+1],spawn:{x:12,y:9},entry:'up',facing:'up'});
        }
      }
    }
    const hall=`${p.id}_hall` as TourId;
    // Urban landmarks are visibly tall DS buildings too, not just named towers.
    if(!w.rooms[hall]||!(/탑|타워|등대|백화점|사옥|방송국/.test(p.landmark)||['city','factory','airport','fair'].includes(p.theme)||p.id==='tour_castelia'))continue;
    const total=3,ids=[hall,`${hall}_2f`,`${hall}_3f`] as TourId[];
    // Department stores have an actual shop counter on their first floor.
    if(p.landmark==='백화점'){
      MART_ROOMS.add(hall);w.maps[hall].npcs[0].dialogue='martClerk';w.maps[hall].npcs[0].name='백화점 점원';
      w.rooms[hall].objects[0].pages=['여행용품 판매층입니다.\n점원에게 몬스터볼과 상처약을 사세요.'];
      for(const o of w.rooms[hall].objects)if(/안내판/.test(o.name))o.pages=['1층 판매장 · 2층 자료실\n3층 휴게실. 오른쪽 계단을 이용하세요.'];
    }
    for(let f=0;f<total;f++){
      const id=ids[f],title=p.landmark+' '+(f+1)+'층';FLOOR_INFO[id]={floor:f+1,total,title};ROOM_PARENTS[id]=p;if(f)FLOOR_PARENTS[id]=ids[f-1];
      if(f){
        const shrine=/탑/.test(p.landmark)&&p.theme!=='city';
        const broadcast=/방송|라디오/.test(p.landmark),lighthouse=p.landmark==='등대',office=p.landmark==='실프 사옥';
        const purpose=f===1?(shrine?'수련층':broadcast?'방송 제작실':lighthouse?'항로 관측실':office?'제품 연구실':'도시 자료실'):(lighthouse?'등실과 전망 휴게소':shrine?'명상과 쉼의 층':'여행자 휴게실');
        const room:TourInterior={style:shrine?'shrine':f===1?(office?'lab':broadcast?'studio':'terminal'):'garden',title:title+' · '+purpose,host:{x:9,y:8},greeting:[purpose+'입니다.\n오른쪽 계단으로 오르내릴 수 있어요.',f===1?'작업 공간을 천천히 둘러보세요.':'여행자와 포켓몬이 함께 쉬는 층이에요.'],objects:f===1?[fixture(shrine?'altar':lighthouse?'machine':broadcast?'camera':'console',shrine?'수련 기둥':lighthouse?'항로 관측 렌즈':broadcast?'방송용 카메라':'작업 책상',p.landmark+'의 작업과 기록을\n정리해 놓았다.',3,4),fixture('shelf','자료 보관함',p.name+'의 지난 풍경을\n기록한 사진들이 보인다.',9,4),fixture('chart','층별 안내','오른쪽 위 계단은 위층,\n오른쪽 아래 계단은 아래층이다.',3,9,2,1)]:[fixture(lighthouse?'machine':'plants',lighthouse?'등대 등불':'실내 정원',lighthouse?'커다란 렌즈가 바다를 비춘다.\n돌아오는 배들의 길잡이다.':'포켓몬이 쉴 수 있도록\n부드러운 풀을 가꾼 자리다.',3,4),fixture('bench','창가 휴게석',p.name+'의 지붕과\n도시 밖으로 이어지는 길이 보인다.',9,4),fixture('workbench','여행 수첩','오늘 만난 포켓몬과 지나온 길을\n기록하는 수첩이다.',3,9)]};
        addRoom(w,p,id,room,{x:12,y:10,to:ids[f-1],spawn:{x:12,y:8},entry:'down',facing:'down'});
        // Upper floors have stairs only, never a ground-level outdoor door.
        w.maps[id].walkable[12]='#'.repeat(16);w.maps[id].walkable[13]='#'.repeat(16);
      }
      w.maps[id].name=p.name+' · '+title;
      if(!f){w.rooms[id].title=title;w.rooms[id].greeting.push('오른쪽 계단으로 3층까지\n올라가 둘러볼 수 있어요.');}
      if(f<total-1)w.maps[id].warps.push({x:12,y:7,to:ids[f+1],spawn:{x:12,y:9},entry:'up',facing:'up'});
    }
  }
  // Existing forests, research corridor and inter-region transport remain distinct.
  const used=new Set<string>();
  for(const p of w.places)for(const exit of [...w.maps[p.id].warps]){
    const q=w.places.find(q=>q.id===exit.to);if(!q||q.region!==p.region||!w.buildings[p.id]?.length||!w.buildings[q.id]?.length)continue;
    const key=[p.id,q.id].sort().join('_');if(used.has(key)||[p.id,q.id].includes('tour_jubilife')&&[p.id,q.id].includes('tour_canalave'))continue;used.add(key);
    const back=w.maps[q.id].warps.find(w=>w.to===p.id);if(!back)continue;
    const id=`tour_pass_${p.id.slice(5)}_${q.id.slice(5)}` as TourId;
    const kind=['mine','dragon'].includes(p.theme)||['mine','dragon'].includes(q.theme)?'cave':['port','coast'].includes(p.theme)||['port','coast'].includes(q.theme)?'coast':'road';
    const bend=used.size%2?7:12;PASSAGES[id]={id,a:p,b:q,kind,bend};
    const name=p.name.replace('시티','')+'–'+q.name.replace('시티','')+(kind==='cave'?' 암반굴':kind==='coast'?' 해안길':' 연결도로');
    PASSAGE_PLACES[id]={id,name,region:p.region,theme:kind==='cave'?'cave':kind==='coast'?'coast':'forest',concept:'서쪽 '+p.name+' · 동쪽 '+q.name,landmark:'길 표지',x:(p.x+q.x)/2,y:(p.y+q.y)/2};
    const width=32,height=20;
    const rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
    const open=(x:number,y:number,rw:number,rh:number)=>{for(let j=y;j<y+rh;j++)for(let i=x;i<x+rw;i++)rows[j][i]='.';};
    open(1,9,10,3);open(9,Math.min(9,bend),4,Math.abs(bend-9)+3);open(10,bend,13,3);open(21,Math.min(9,bend),4,Math.abs(bend-9)+3);open(23,9,8,3);
    // Optional clearing connects to the main trail; item and grass do not block passage.
    open(14,4,6,12);open(13,4,8,4);
    const aSpawn={...back.spawn},bSpawn={...exit.spawn};
    w.maps[id]={id,name,width,height,background:id,walkable:rows.map(r=>r.join('')),warps:[{x:1,y:10,to:p.id,spawn:aSpawn,entry:'left',facing:back.facing},{x:30,y:10,to:q.id,spawn:bSpawn,entry:'right',facing:exit.facing}],npcs:[{id:'pathWalker',name:kind==='cave'?'산행객':'여행자',sprite:kind==='cave'?'worker':'rancher',x:18,y:5,facing:'down',dialogue:'journeyWalker'}],props:[{x:15,y:5,dialogue:'journeyItem'},{x:3,y:8,dialogue:'journeySign'},{x:28,y:8,dialogue:'journeySign'}],terrain:[{kind:'tallGrass',x:14,y:13,w:5,h:2}]};
    rows[5][15]='#';
    for(const point of PASSAGE_LOOP_OPENINGS[kind]){
      if(rows[point.y][point.x]!=='.')rows[point.y][point.x]='.';
    }
    w.maps[id].walkable=rows.map(r=>r.join(''));
    applyJourneyRouteLayout(w.maps[id]);
    exit.to=id;exit.spawn={x:2,y:10};exit.facing='right';back.to=id;back.spawn={x:w.maps[id].width-3,y:10};back.facing='left';w.spawns[id]={x:2,y:10};
  }
}
