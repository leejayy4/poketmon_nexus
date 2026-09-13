import { tourMapRoute } from './explore-navigation';
import { getMap } from './maps';
import type { MapId,SaveData } from './types';

export function neighborJourneyLabel(from:MapId,to:MapId,flags:SaveData['flags']):string{
  const route=tourMapRoute(from,to,flags),name=getMap(to,flags).name;
  if(route.length<2)return `${name} · 현재 보행 경로 없음`;
  const exit=getMap(from,flags).warps.find(w=>w.to===route[1]);
  const arrow=exit?({up:'↑',down:'↓',left:'←',right:'→'})[exit.entry]:'';
  const via=route.slice(1,-1).map(id=>getMap(id,flags).name);
  return `${arrow} ${name}${via.length?' · 경유: '+via.join(' → '):''}`.trim();
}
