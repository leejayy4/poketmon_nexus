import { atlasPoint,atlasNature,atlasSvg } from './region-atlas';
import { journeyConnection } from './journey-world';
import { tourVisitSummary } from './explore-journal';
import { getMap } from './maps';
import { DIRECTION_LABEL,tourPassageLabel } from './explore-navigation';
import type { Engine } from './engine';
import { PLACES,TOUR_INTERIORS,TOUR_NEIGHBORS,TOUR_MAPS,tourPlaceForMap,placeById,type TourId } from './explore-world';
export function setupExplorePanel(game:Engine,root:HTMLElement){
  const section=document.createElement('details');section.className='tour-panel';
  section.innerHTML=`<summary>개발 도구 · 지도 확인</summary><p class="panel-hint">같은 게임 지도의 그래픽과 이동을 확인합니다. 바로 이동은 개발용이며 파티·배지를 지급하지 않습니다.</p><div class="tour-regions" role="group" aria-label="지도 지방">${['신오','관동','성도','하나'].map((r,i)=>`<button data-region="${r}" aria-pressed="${i===0}">${r}</button>`).join('')}</div><p id="tour-visit-summary" class="panel-hint"></p><div class="tour-atlas" aria-label="지방 지도"></div><p class="tour-atlas-key"><b class="city-key">■</b> 도시 <b class="nature-key">■</b> 자연 <b class="visited-key">✓</b> 방문 <b>◎</b> 현재 위치</p><p class="panel-hint">원작 지형 참고 · 연결선은 현재 모험 기준<br>지도 표식에 마우스를 올리거나 초점을 맞추면 장소 이름이 표시됩니다.</p><details class="tour-journal"><summary>방문 수첩</summary><label class="tour-journal-filter"><input id="tour-unvisited" type="checkbox"> 야외 미방문만 보기</label><div id="tour-journal-list"></div></details><label for="tour-place">목적지</label><select id="tour-place" aria-label="지도 목적지"></select><button id="tour-walk" class="full-button">선택한 마을까지 길안내</button><div id="tour-navigation" class="tour-navigation" hidden><p id="tour-route-status" role="status"></p><p id="tour-route-list"></p><button id="tour-route-clear" class="full-button">길안내 해제</button></div><button id="tour-go" class="full-button">선택한 마을로 이동</button><p id="tour-concept"></p><div id="tour-neighbors"></div><button id="tour-start" class="full-button">새잎마을로 돌아가기</button>`;
  root.append(section);
  const select=section.querySelector<HTMLSelectElement>('#tour-place')!,atlas=section.querySelector<HTMLElement>('.tour-atlas')!;let region='신오';
  let previousJournal='';
  function refreshJournal(){
    const onlyNew=section.querySelector<HTMLInputElement>('#tour-unvisited')!.checked;
    const key=JSON.stringify([region,game.save.tourVisited,onlyNew]);if(key===previousJournal)return;previousJournal=key;
    const visited=new Set(game.save.tourVisited??[]),summary=tourVisitSummary(game.save,region);
    section.querySelector('#tour-visit-summary')!.textContent='야외 '+summary.outdoors+'/'+PLACES.length+' · 실내 '+summary.interiors+'/'+Object.keys(TOUR_INTERIORS).length+' 방문\n'+region+' '+summary.regionVisited+'/'+summary.regionTotal+' · ✓: 방문';
    const places=PLACES.filter(p=>p.region===region&&(!onlyNew||!visited.has(p.id)));
    section.querySelector('#tour-journal-list')!.innerHTML=places.length?places.map(p=>{
      const rooms=Object.hasOwn(TOUR_MAPS,p.id+'_center');
      const facilities=rooms?'<div class="tour-facility-guides">'+(['center','hall'] as const).map(kind=>{
        const id=(p.id+'_'+kind) as TourId,label=kind==='center'?'센터':p.landmark;
        return '<button data-guide="'+id+'" aria-label="'+p.name+' '+label+' 길안내">'+(visited.has(id)?'✓ ':'○ ')+label+' ↗</button>';
      }).join('')+'</div>':'';
      return '<div class="tour-journal-place" data-journal-place="'+p.id+'"><span>'+ (visited.has(p.id)?'✓ ':'○ ')+p.name+'</span><small>'+(rooms?'시설을 누르면 입구까지 길안내':'야외 산책 구역')+'</small><button class="tour-place-guide" data-guide="'+p.id+'" aria-label="'+p.name+' 길안내">길안내</button>'+facilities+'</div>';
    }).join(''):'<p class="panel-hint">이 지방의 야외 구역을 모두 방문했습니다.</p>';
    section.querySelectorAll<HTMLElement>('.tour-node').forEach(n=>{const seen=visited.has(n.dataset.place as TourId);n.classList.toggle('visited',seen);n.setAttribute('aria-description',seen?'방문한 장소':'아직 방문하지 않은 장소');});
  }
  section.querySelector('#tour-unvisited')!.addEventListener('change',refreshJournal);
  const jump=(id:string)=>{game.exploreTo(id);document.querySelector<HTMLCanvasElement>('#field')!.focus()};
  function renderRegion(){
    const places=PLACES.filter(p=>p.region===region);
    select.innerHTML=places.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
    const edges=places.flatMap(p=>TOUR_NEIGHBORS(p.id).filter(id=>id>p.id&&placeById(id)?.region===region).map(id=>[p.id,id]));
    atlas.setAttribute('aria-label',region+'지방 지도');
    atlas.innerHTML=atlasSvg(region,edges)+places.map(p=>{
      const [x,y]=atlasPoint(region,p.id);
      return `<button class="tour-node${atlasNature(p.id)?' nature':''}${y>160?' label-above':''}${tourPlaceForMap(game.save.map)?.id===p.id?' current':''}" data-place="${p.id}" style="left:${x/256*100}%;top:${y/192*100}%" aria-label="${p.name}로 이동" title="${p.name}"><i></i><span class="${x<48?'label-left':x>208?'label-right':''}">${p.name}</span></button>`;
    }).join('');
    section.querySelectorAll<HTMLButtonElement>('[data-region]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.region===region)));
    previousJournal='';refreshJournal();
  }
  section.addEventListener('click',event=>{const target=(event.target as HTMLElement).closest<HTMLElement>('button');if(!target)return;if(target.dataset.region){region=target.dataset.region;renderRegion()}if(target.dataset.place)jump(target.dataset.place);if(target.dataset.guide){game.setTourDestination(target.dataset.guide);document.querySelector<HTMLCanvasElement>('#field')!.focus()}});
  section.querySelector('#tour-walk')!.addEventListener('click',()=>{game.setTourDestination(select.value);document.querySelector<HTMLCanvasElement>('#field')!.focus()});section.querySelector('#tour-route-clear')!.addEventListener('click',()=>{game.setTourDestination(null);document.querySelector<HTMLCanvasElement>('#field')!.focus()});
  section.querySelector('#tour-go')!.addEventListener('click',()=>jump(select.value));section.querySelector('#tour-start')!.addEventListener('click',()=>jump('town'));renderRegion();
  let previous='',previousRoute='';const update=()=>{refreshJournal();
    const route=game.tourNavigation,routeKey=JSON.stringify(route&&[route.destination,route.status,route.maps,route.interaction]);
    if(routeKey!==previousRoute){previousRoute=routeKey;section.querySelector<HTMLElement>('#tour-navigation')!.hidden=!route;
      if(route){section.querySelector('#tour-route-status')!.textContent=route.status==='arrived'?(route.interaction?DIRECTION_LABEL[route.interaction.facing]+'을 보고 Z로 대화하세요.':route.name+'에 도착했습니다.'):route.status==='blocked'?'지금 위치에서 길을 찾을 수 없습니다.':route.interaction?'목표 인물 앞까지 노란 길을 따라가세요.':route.name+'까지 길안내 · '+(route.maps.length-1)+'개 구역 이동\n다음: '+route.nextName+' / '+DIRECTION_LABEL[route.exit!.entry]+' '+tourPassageLabel(route.exit!);
        section.querySelector('#tour-route-list')!.textContent=route.status==='walking'?route.maps.map(id=>getMap(id,game.save.flags).name).join(' → '):'';}
    }
    const id=game.save.map;if(id===previous)return;previous=id;const p=tourPlaceForMap(id);if(p){if(region!==p.region){region=p.region;renderRegion()}select.value=p.id;section.querySelector('#tour-concept')!.textContent=p.concept;section.querySelector('#tour-neighbors')!.innerHTML=TOUR_NEIGHBORS(p.id).map(dest=>{const w=journeyConnection(TOUR_MAPS[p.id],dest)!,other=placeById(dest)!;return `<button data-place="${dest}">${({up:'↑',down:'↓',left:'←',right:'→'})[w.entry]} ${other.name}${other.region!==p.region?' · '+(p.id==='tour_saffron'||p.id==='tour_goldenrod'?'열차':'배'):''}</button>`}).join('');}else{section.querySelector('#tour-concept')!.textContent='새잎마을 서쪽 출구에서 축복시티로 갈 수 있습니다.';section.querySelector('#tour-neighbors')!.innerHTML='<button data-place="tour_jubilife">축복시티로 이동</button>';}
    section.querySelectorAll<HTMLElement>('.tour-node').forEach(n=>n.classList.toggle('current',n.dataset.place===p?.id));};update();return update;
}
