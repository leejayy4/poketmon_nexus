import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { Passage } from './journey-world';
import type { TourOutdoors } from './explore-outdoors';
import { paintTourGround,paintTourPaths } from './explore-materials';

export const UNOVA_ROUTE_ONE='tour_unova_route_01' as const;
export const UNOVA_ROUTE_FOUR='tour_unova_route_04' as const;
export const JOIN_AVENUE='tour_join_avenue' as const;
// The old U-R01 key stays in saves; player-facing text follows the official route atlas.
export const UNOVA_ROUTE_ONE_NAME='4번도로 · 리조트데저트 입구';
const WIDTH=72,HEIGHT=36;
const PATHS=[
  [1,9,12,3],[10,9,3,10],[11,16,16,3],[24,7,3,12],
  [25,7,17,3],[39,8,3,10],[40,15,17,3],[54,9,3,9],[55,9,16,3],
  // The sandstone overlook is optional and rejoins the main route at two points.
  [16,17,3,12],[17,26,34,3],[48,16,3,13],
] as const;
const SIGNS=[{x:4,y:8},{x:67,y:8}];
const ROCK={x:33,y:27};

export function installUnovaRouteOne(world:{places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;edges:[TourId,TourId][];transitLinks:Record<string,readonly string[]>}){
  const a=world.places.find(p=>p.id==='tour_castelia')!,b=world.places.find(p=>p.id==='tour_desert')!,nimbasa=world.places.find(p=>p.id==='tour_nimbasa')!;
  const outward=world.maps[a.id].warps.find(w=>w.to===b.id)!,back=world.maps[b.id].warps.find(w=>w.to===a.id)!;
  const desertToNimbasa=world.maps[b.id].warps.find(w=>w.to===nimbasa.id)!,nimbasaFromDesert=world.maps[nimbasa.id].warps.find(w=>w.to===b.id)!;
  const rows=Array.from({length:HEIGHT},()=>Array<string>(WIDTH).fill('#'));
  for(const [x,y,w,h] of PATHS)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';
  // Space for the guide and for reading either sign from the main path.
  for(let y=12;y<16;y++)for(let x=12;x<19;x++)rows[y][x]='.';
  rows[ROCK.y][ROCK.x]='#';
  const signs=SIGNS.map((p,i)=>({...p,direction:i?'right' as const:'left' as const,destination:i?b.id:a.id,name:UNOVA_ROUTE_ONE_NAME,event:'journeySign',pages:[
    '← 서쪽 4번도로 본선\n→ 동쪽 리조트데저트','4번도로 · 리조트데저트 입구',
    '남쪽 사암 전망길은 큰길로 돌아옵니다.\n이 구간에는 야생 조우가 없습니다.',
  ]}));
  const objects=[{name:'바람에 닳은 사암',event:'tourUnovaRouteOneRock',cells:[ROCK],pages:[
    '빌딩의 반듯한 돌과 달리\n바람을 맞은 모서리가 둥글다.',
    '돌 아래쪽에 모래가 모여 있다.\n동쪽 큰길 너머는 리조트데저트다.',
  ]}];
  world.maps[UNOVA_ROUTE_ONE]={id:UNOVA_ROUTE_ONE,name:UNOVA_ROUTE_ONE_NAME,width:WIDTH,height:HEIGHT,background:UNOVA_ROUTE_ONE,
    walkable:rows.map(r=>r.join('')),terrain:[],
    warps:[{x:1,y:10,entry:'left',to:a.id,spawn:{...back.spawn},facing:back.facing},{x:70,y:10,entry:'right',to:b.id,spawn:{...outward.spawn},facing:outward.facing}],
    npcs:[{id:'unovaRouteOneGuide',name:'사막 분기 안내원',sprite:'rancher',x:15,y:14,facing:'down',dialogue:'journeyWalker'}],
    props:[...signs.map(s=>({x:s.x,y:s.y,dialogue:'journeySign'})),{...ROCK,dialogue:objects[0].event}],
  };
  world.passages[UNOVA_ROUTE_ONE]={id:UNOVA_ROUTE_ONE,a,b,kind:'road',bend:16};
  world.passagePlaces[UNOVA_ROUTE_ONE]={id:UNOVA_ROUTE_ONE,name:UNOVA_ROUTE_ONE_NAME,region:'하나',theme:'desert',concept:'4번도로 본선에서 갈라져 리조트데저트 입구로 이어지는 선택 사암길',landmark:'리조트데저트 분기 이정표',x:(a.x+b.x)/2,y:(a.y+b.y)/2};
  world.spawns[UNOVA_ROUTE_ONE]={x:2,y:10};world.outdoors[UNOVA_ROUTE_ONE]={objects,signs};
  outward.to=UNOVA_ROUTE_ONE;outward.spawn={x:2,y:10};outward.facing='right';
  back.to=UNOVA_ROUTE_ONE;back.spawn={x:69,y:10};back.facing='left';

  const open=(grid:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)grid[j][i]='.';};
  const main=Array.from({length:88},()=>Array<string>(36).fill('#'));
  open(main,16,1,4,86);open(main,18,40,17,4);open(main,8,18,8,4);open(main,8,18,4,18);open(main,8,33,8,4);open(main,20,61,8,4);open(main,24,61,4,15);open(main,20,73,8,4);
  const routeObjects=[
    {name:'모래바람 관측 말뚝',event:'tourRouteFourWindStake',cells:[{x:15,y:24}],pages:['말뚝의 여러 높이에 모래 자국이 남아 있다.\n작업원들이 바람의 세기를 기록한다.','모래가 심한 날에는 포켓몬과 함께\n포장된 중앙 길로 이동하라는 쪽지가 묶여 있다.']},
    {name:'분기 공사 표본',event:'tourRouteFourWorkSample',cells:[{x:20,y:42}],pages:['단단히 굳힌 노반과 사암 조각을\n나란히 놓고 상태를 비교하고 있다.','동쪽은 리조트데저트 탐사로,\n남북은 도시를 잇는 본선으로 표시돼 있다.']},
    {name:'사막 포켓몬 발자국판',event:'tourRouteFourFootprints',cells:[{x:28,y:68}],pages:['모래 위 발자국을 본뜬 관찰판이다.\n작은 발자국들이 그늘 쪽으로 이어진다.','야생 포켓몬 조우 구역이 아니라\n사막 생태를 소개하는 현장 기록이다.']},
  ];
  for(const object of routeObjects)for(const cell of object.cells)main[cell.y][cell.x]='#';
  world.maps[UNOVA_ROUTE_FOUR]={id:UNOVA_ROUTE_FOUR,name:'하나 4번도로',width:36,height:88,background:UNOVA_ROUTE_FOUR,walkable:main.map(row=>row.join('')),
    warps:[
      {x:17,y:86,to:a.id,spawn:{...world.maps[UNOVA_ROUTE_ONE].warps[0].spawn},entry:'down',facing:'left'},
      {x:17,y:1,to:JOIN_AVENUE,spawn:{x:14,y:60},entry:'up',facing:'up'},
      {x:34,y:42,to:UNOVA_ROUTE_ONE,spawn:{x:2,y:10},entry:'right',facing:'right'},
    ],
    npcs:[{id:'routeFourWorker',name:'4번도로 작업원',sprite:'worker',x:11,y:34,facing:'right',dialogue:'unovaRouteFourGuide'}],
    props:[{x:15,y:82,dialogue:'unovaRouteFourSign'},{x:21,y:39,dialogue:'unovaRouteFourSign'},{x:15,y:5,dialogue:'unovaRouteFourSign'},...routeObjects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))],
  };
  const avenue=Array.from({length:64},()=>Array<string>(28).fill('#'));
  open(avenue,12,1,4,62);open(avenue,4,8,8,7);open(avenue,16,18,8,7);open(avenue,4,30,8,7);open(avenue,16,40,8,7);open(avenue,4,50,8,7);
  const avenueObjects=[
    {name:'구름 항구 교환대',event:'tourJoinAvenueHarborDisplay',cells:[{x:11,y:11}],pages:['유리 진열대에 구름시티 항구에서 온\n향신료 상자와 배 모형이 놓여 있다.','상자 옆 카드에는 물에 약한 짐을\n포켓몬과 함께 지키는 법이 적혀 있다.']},
    {name:'사막 탐사 진열대',event:'tourJoinAvenueDesertDisplay',cells:[{x:16,y:21}],pages:['고글과 물통, 모래를 털어 내는 솔이\n여행 순서에 맞춰 진열돼 있다.','4번도로 동쪽 분기를 다녀온 여행자가\n남긴 사암 사진도 걸려 있다.']},
    {name:'파트너 휴게 창구',event:'tourJoinAvenuePartnerRest',cells:[{x:11,y:33}],pages:['크기가 다른 물그릇과 낮은 방석이 있다.\n여행 포켓몬이 잠시 쉬어 가는 자리다.','벽에는 포켓몬의 상태를 먼저 살피고\n무리하지 말라는 안내가 붙어 있다.']},
    {name:'뇌문 공연 게시판',event:'tourJoinAvenueNimbasaBoard',cells:[{x:16,y:43}],pages:['뇌문시티의 무대와 관람차를 그린\n색색의 공연 안내가 빼곡하다.','구름시티 거리 공연 사진도 함께 붙어\n두 도시의 분위기를 이어 준다.']},
    {name:'여행자 교류 기록',event:'tourJoinAvenueTravelNotes',cells:[{x:11,y:53}],pages:['여행자들이 어느 도시에서 왔는지\n작은 카드에 적어 꽂아 두었다.','구름시티, 4번도로, 뇌문시티를 오간\n파트너 포켓몬의 그림도 보인다.']},
  ];
  for(const object of avenueObjects)for(const cell of object.cells)avenue[cell.y][cell.x]='#';
  world.maps[JOIN_AVENUE]={id:JOIN_AVENUE,name:'조인애버뉴',width:28,height:64,background:JOIN_AVENUE,walkable:avenue.map(row=>row.join('')),
    warps:[{x:14,y:62,to:UNOVA_ROUTE_FOUR,spawn:{x:17,y:3},entry:'down',facing:'down'},{x:14,y:1,to:nimbasa.id,spawn:{...desertToNimbasa.spawn},entry:'up',facing:desertToNimbasa.facing}],
    npcs:[{id:'joinAvenueGuide',name:'조인애버뉴 안내원',sprite:'ace_trainer_f',x:9,y:33,facing:'right',dialogue:'joinAvenueGuide'}],
    props:[{x:11,y:58,dialogue:'joinAvenueSign'},{x:16,y:27,dialogue:'joinAvenueSign'},{x:11,y:5,dialogue:'joinAvenueSign'},...avenueObjects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})))],
  };
  world.passages[UNOVA_ROUTE_FOUR]={id:UNOVA_ROUTE_FOUR,a,b:nimbasa,kind:'road',bend:42};
  world.passagePlaces[UNOVA_ROUTE_FOUR]={id:UNOVA_ROUTE_FOUR,name:'하나 4번도로',region:'하나',theme:'desert',concept:'구름시티에서 사막 선택 분기를 지나 조인애버뉴로 이어지는 본선',landmark:'사막 공사장',x:(a.x+nimbasa.x)/2,y:(a.y+nimbasa.y)/2};
  world.passagePlaces[JOIN_AVENUE]={id:JOIN_AVENUE,name:'조인애버뉴',region:'하나',theme:'city',concept:'4번도로와 뇌문시티를 잇는 선형 상업 거리',landmark:'교류 상점가',x:nimbasa.x,y:nimbasa.y+.5};
  world.spawns[UNOVA_ROUTE_FOUR]={x:17,y:84};world.spawns[JOIN_AVENUE]={x:14,y:60};
  world.outdoors[UNOVA_ROUTE_FOUR]={objects:routeObjects,signs:[
    {x:15,y:82,direction:'down',destination:a.id,name:'구름시티',event:'unovaRouteFourSign',pages:['↓ 구름시티','4번도로 남쪽 출구는 구름시티 동쪽 산책로로 이어집니다.']},
    {x:21,y:39,direction:'right',destination:UNOVA_ROUTE_ONE,name:'리조트데저트 입구',event:'unovaRouteFourSign',pages:['→ 리조트데저트 선택 분기','사막을 둘러본 뒤 같은 길로 본선에 돌아올 수 있습니다.']},
    {x:15,y:5,direction:'up',destination:JOIN_AVENUE,name:'조인애버뉴',event:'unovaRouteFourSign',pages:['↑ 조인애버뉴 · 뇌문시티','북쪽 큰길은 조인애버뉴를 거쳐 뇌문시티로 이어집니다.']},
  ]};
  world.outdoors[JOIN_AVENUE]={objects:avenueObjects,signs:[
    {x:11,y:58,direction:'down',destination:UNOVA_ROUTE_FOUR,name:'하나 4번도로',event:'joinAvenueSign',pages:['↓ 하나 4번도로 · 구름시티','남쪽 중앙 통로를 따라 4번도로로 돌아갈 수 있습니다.']},
    {x:16,y:27,direction:'up',destination:nimbasa.id,name:'뇌문시티',event:'joinAvenueSign',pages:['↑ 뇌문시티','중앙 상점가를 지나 북쪽 출구로 향하세요.']},
    {x:11,y:5,direction:'up',destination:nimbasa.id,name:'뇌문시티',event:'joinAvenueSign',pages:['↑ 뇌문시티 입구','북쪽 출구 앞 마지막 안내판입니다.']},
  ]};
  outward.to=UNOVA_ROUTE_FOUR;outward.spawn={x:17,y:84};outward.facing='up';
  world.maps[UNOVA_ROUTE_ONE].warps[0].to=UNOVA_ROUTE_FOUR;world.maps[UNOVA_ROUTE_ONE].warps[0].spawn={x:33,y:42};world.maps[UNOVA_ROUTE_ONE].warps[0].facing='left';
  nimbasaFromDesert.to=JOIN_AVENUE;nimbasaFromDesert.spawn={x:14,y:2};nimbasaFromDesert.facing='down';
  world.maps[b.id].warps=world.maps[b.id].warps.filter(w=>w!==desertToNimbasa);
  // The initial compact world needs the old edges to allocate exits. Runtime
  // navigation exposes the applied topology after those exits are rewired.
  const oldEdges=new Set([`${b.id}|${nimbasa.id}`,`${nimbasa.id}|${b.id}`]);
  for(let i=world.edges.length-1;i>=0;i--)if(oldEdges.has(world.edges[i].join('|')))world.edges.splice(i,1);
  if(!world.edges.some(([from,to])=>from===a.id&&to===nimbasa.id||from===nimbasa.id&&to===a.id))world.edges.push([a.id,nimbasa.id]);
  world.transitLinks[UNOVA_ROUTE_FOUR]=[nimbasa.id,b.id];
  world.transitLinks[JOIN_AVENUE]=[a.id];
  const retiredSign=world.outdoors[b.id].signs.find(sign=>sign.destination===nimbasa.id);
  if(retiredSign){world.outdoors[b.id].signs=world.outdoors[b.id].signs.filter(sign=>sign!==retiredSign);world.maps[b.id].props=world.maps[b.id].props.filter(prop=>prop.x!==retiredSign.x||prop.y!==retiredSign.y);}
  const citySign=world.outdoors[a.id].signs.find(sign=>sign.direction==='right');
  if(citySign){citySign.destination=UNOVA_ROUTE_FOUR;citySign.name='하나 4번도로';citySign.pages=['동쪽 → 하나 4번도로\n조인애버뉴 · 뇌문시티 방향','4번도로 동쪽에는\n리조트데저트 선택 분기가 있습니다.'];}
  const nimbasaSign=world.outdoors[nimbasa.id].signs.find(sign=>sign.destination===b.id);
  if(nimbasaSign){nimbasaSign.destination=JOIN_AVENUE;nimbasaSign.name='조인애버뉴';nimbasaSign.pages=['남쪽 → 조인애버뉴\n4번도로 · 구름시티 방향','리조트데저트는 4번도로의\n동쪽 선택 분기에서 들어갑니다.'];}
}

/** Sandstone boundaries follow collision; the west paving gives way to sand. */
export function paintUnovaRouteOne(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  const paths=new Set<string>();
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16;
    paintTourGround(c,images['town-reference'],px,py,'desert');
    if(map.walkable[y][x]==='.'){
      if(x<9)c.drawImage(images['jubilife-reference'],464,112,16,16,px,py,16,16);
      else paths.add(`${x},${y}`);
    }else{
      fill(px,py,16,16,'#aa916f');fill(px+1,py+1,14,7,'#cbbb8c');fill(px+3,py+2,8,2,'#e5d3a0');
      fill(px+2+(y%2)*6,py+10,6,2,'#88795d');
      if(map.walkable[y+1]?.[x]==='.'){
        fill(px,py+8,16,7,'#927d60');fill(px+1,py+8,14,2,'#d6bf8f');fill(px,py+15,16,1,'#74634f');
      }
    }
  }
  paintTourPaths(c,images['town-reference'],paths,'desert');
  for(const s of SIGNS){
    fill(s.x*16+6,s.y*16+8,4,8,'#77654d');fill(s.x*16+1,s.y*16,14,10,'#83745a');
    fill(s.x*16+2,s.y*16+1,12,7,'#eee0b1');fill(s.x*16+4,s.y*16+4,8,1,'#8d795a');
  }
  // The observed stone is a visible, blocked object within the optional loop.
  fill(ROCK.x*16+1,ROCK.y*16+5,14,9,'#8b755a');fill(ROCK.x*16+3,ROCK.y*16+2,10,9,'#c8aa7f');
  fill(ROCK.x*16+4,ROCK.y*16+3,7,2,'#e4c69a');
}

export function paintUnovaRouteNetwork(c:CanvasRenderingContext2D,images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  const fill=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  const avenue=map.id===JOIN_AVENUE,paths=new Set<string>();
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y]?.[x]==='.';
    paintTourGround(c,images['town-reference'],px,py,avenue?'city':'desert');
    if(walk)paths.add(`${x},${y}`);
    else if(avenue){fill(px,py,16,16,'#46525b');fill(px+2,py+2,12,5,'#71818a');fill(px+3,py+9,10,2,'#313e48');}
    else{fill(px,py,16,16,'#ad916c');fill(px+1,py+1,14,7,'#d4bd89');fill(px+3,py+3,8,2,'#ead49e');}
  }
  paintTourPaths(c,images['town-reference'],paths,avenue?'city':'desert');
  if(avenue)for(let y=9;y<map.height-7;y+=11){fill(5*16,y*16,6*16,5*16,'#8f7865');fill(6*16,y*16+8,4*16,3*16,'#d7c79f');fill(17*16,y*16,6*16,5*16,'#667e87');fill(18*16,y*16+8,4*16,3*16,'#c2d3c7');}
  else for(let y=12;y<map.height-8;y+=18){fill(3*16,y*16,5*16,3*16,'#c1a071');fill(4*16,y*16+4,3*16,2*16,'#e3cca0');fill(28*16,(y+7)*16,5*16,3*16,'#91785c');}
  const markers=avenue?[[11,11],[16,21],[11,33],[16,43],[11,53]]:[[15,24],[20,42],[28,68]];
  for(const [x,y] of markers){fill(x*16+2,y*16+3,12,11,avenue?'#e8d8ac':'#725f49');fill(x*16+4,y*16+5,8,5,avenue?'#70a1a0':'#d6bd84');fill(x*16+5,y*16+11,6,2,'#4f4035');}
}
