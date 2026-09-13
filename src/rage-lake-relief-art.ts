import type {GameMap,SaveData} from './types';
import type {Furnishing} from './explore-interiors';

export function paintRageLakeReliefFurnishing(c:CanvasRenderingContext2D,mapId:string,o:Furnishing,f:SaveData['flags']):void{
  if(mapId!=='tour_rage_lake_home1'||o.event!=='rageLakeHomeReedTable'||!f.nexusRageAlternativesNeeded)return;
  const x=o.x*16,y=o.y*16;c.save();c.beginPath();c.rect(x,y,o.w*16,o.h*16);c.clip();
  c.fillStyle='#c5b898';c.fillRect(x+5,y+7,47,12);c.fillStyle='#6d756c';
  if(!f.nexusRageReliefChannel)for(let i=0;i<3;i++){c.fillRect(x+8+i*12,y+9,8,3);c.fillRect(x+8+i*12,y+15,8,3);}
  if(!f.nexusRageReliefBell){c.fillStyle='#bda76a';c.fillRect(x+58,y+10,7,7);c.fillStyle='#d6dac6';c.fillRect(x+69,y+7,6,12);}
  if(f.nexusRageReliefParts){c.strokeStyle='#887151';c.strokeRect(x+4,y+5,49,16);}
  c.restore();
}

/** Ground channels occupy only the previously blocked dry bank, never paths or lake water. */
export function rageLakeReliefLayers(c:CanvasRenderingContext2D,map:GameMap,f:SaveData['flags']):{depth:number;draw:()=>void}[]{
  if(map.id!=='tour_rage_lake')return [];
  const layers:{depth:number;draw:()=>void}[]=[];
  const cell=(x:number,y:number,draw:()=>void)=>{if(map.walkable[y]?.[x]!=='#')return;c.save();c.beginPath();c.rect(x*16,y*16,16,16);c.clip();draw();c.restore();};
  if(f.nexusRageReliefChannel)for(const x of [26,27])layers.push({depth:20.5,draw:()=>cell(x,20,()=>{
    c.fillStyle='#716b58';c.fillRect(x*16,20*16+4,16,8);c.fillStyle='#b9ae90';c.fillRect(x*16,20*16+6,16,4);
    if(f.nexusRageReliefWater){c.fillStyle='#83abb8';c.fillRect(x*16,20*16+7,16,2);}
  })});
  if(f.nexusRageReliefChannel)for(let y=20;y<=28;y++)layers.push({depth:y+.5,draw:()=>cell(25,y,()=>{
    const x=25*16,py=y*16;c.fillStyle='#716b58';c.fillRect(x+4,py,8,16);c.fillStyle='#b9ae90';c.fillRect(x+6,py,4,16);
    if(f.nexusRageReliefWater){c.fillStyle='#83abb8';c.fillRect(x+7,py,2,16);}
    c.fillStyle='#787f72';c.fillRect(x+3,py+12,10,2);
  })});
  for(const [event,y] of [['rageReliefIntake',20],['rageReliefBasin',28],['rageReliefBell',30]] as const){
    if(!map.props.some(p=>p.x===25&&p.y===y&&p.dialogue===event))continue;
    layers.push({depth:y+.95,draw:()=>cell(25,y,()=>{
      const x=25*16,py=y*16;c.fillStyle='#858775';c.fillRect(x+1,py+8,14,8);
      if(event==='rageReliefIntake'&&f.nexusRageReliefChannel){c.fillStyle='#a5ab92';c.fillRect(x+2,py+4,11,5);c.fillStyle='#55695e';c.fillRect(x+5,py+5,4,2);}
      if(event==='rageReliefBasin'&&f.nexusRageReliefChannel){c.fillStyle='#bcaf8c';c.fillRect(x+2,py+3,12,10);c.fillStyle=f.nexusRageReliefWater?'#7ca8b7':'#736d60';c.fillRect(x+4,py+5,8,6);}
      if(event==='rageReliefBell'&&f.nexusRageReliefBell){c.fillStyle='#6d705b';c.fillRect(x+3,py,2,13);c.fillStyle='#c6ad62';c.fillRect(x+6,py+6,5,5);c.fillStyle=f.nexusRageReliefSignal?'#e0c77c':'#c6d6c2';c.fillRect(x+5,py+1,8,4);if(f.nexusRageReliefReceived){c.fillStyle='#f1e2b2';c.fillRect(x+11,py+8,3,4);}}
    })});
  }
  if(f.nexusRageReliefSignal)layers.push({depth:18.98,draw:()=>cell(50,18,()=>{c.fillStyle='#e0c77c';c.fillRect(50*16+1,18*16+1,6,4);})});
  return layers;
}
