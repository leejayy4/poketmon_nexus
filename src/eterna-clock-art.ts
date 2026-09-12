import type { GameMap } from './types';
import type { TourOutdoors } from './explore-outdoors';

export const ETERNA_CLOCK={x:40,y:18,event:'eternaClockRecord'};
export const ETERNA_CLOCK_PAGES=[
  '도시 시계와 기준 시각을 나란히 그렸다.\n두 초침 사이에 ‘3초’라고 적혀 있다.',
  '이것은 이전 관측을 옮긴 고정 그림이다.\n지금의 시간을 표시하는 시계는 아니다.',
  '영원과 연고에서 같은 어긋남을 보았다.\n장막의 연구원이 기록을 모으고 있다.'
];

export function installEternaClock(map:GameMap,outdoors:TourOutdoors){
  const {x,y,event}=ETERNA_CLOCK;
  // The board replaces one wall face; a tile cannot advertise both events.
  for(const object of outdoors.objects)object.cells=object.cells.filter(cell=>cell.x!==x||cell.y!==y);
  outdoors.objects.push({name:'시계 관측 기록판',event,cells:[{x,y}],pages:[...ETERNA_CLOCK_PAGES]});
  map.props=map.props.filter(prop=>prop.x!==x||prop.y!==y);
  map.props.push({x,y,dialogue:event});
}

/** A fixed exhibit of the existing three-second discrepancy, not a live clock. */
export function paintEternaClock(c:CanvasRenderingContext2D){
  const x=ETERNA_CLOCK.x*16,y=ETERNA_CLOCK.y*16;
  c.save();c.fillStyle='#546762';c.fillRect(x-14,y-23,43,37);
  c.fillStyle='#d8d3b1';c.fillRect(x-12,y-21,39,31);
  for(const [cx,second] of [[x-3,0],[x+17,57]]){
    c.fillStyle='#f2ebce';c.beginPath();c.arc(cx,y-10,8,0,Math.PI*2);c.fill();
    c.strokeStyle='#627772';c.lineWidth=1;c.stroke();
    c.beginPath();c.moveTo(cx,y-10);c.lineTo(cx,y-16);c.stroke();
    const angle=second/60*Math.PI*2-Math.PI/2;
    c.strokeStyle='#a86558';c.beginPath();c.moveTo(cx,y-10);c.lineTo(cx+Math.cos(angle)*6,y-10+Math.sin(angle)*6);c.stroke();
  }
  c.font='8px Galmuri11, monospace';c.textAlign='center';c.fillStyle='#546762';c.fillText('−3s',x+7,y+7);c.restore();
}
