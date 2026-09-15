import { RUNTIME_RULES } from './data/rules';
import type { Engine } from './engine';
import type { GameMap,SaveData } from './types';
import type { TourOutdoors } from './explore-outdoors';
import { pokemonMoves,SPECIES } from './pokemon';
import { isSeafoamCompanion } from './cinnabar-habitats';

export const SEAFOAM_SUPPLY_EVENT='tourSeafoamB1Supply';
export const SEAFOAM_SUPPLY_MAP='tour_kanto_seafoam_b1f';
const OPEN='seafoamSupplyCleared',TAKEN='seafoamSupplyTaken';
const point={x:24,y:18};
const methods=['박치기','날개치기'];

export function installSeafoamSupply(map:GameMap,outdoors:TourOutdoors){
  if(map.id!==SEAFOAM_SUPPLY_MAP||map.props.some(p=>p.dialogue===SEAFOAM_SUPPLY_EVENT))return;
  // Existing blocked bank beside the eastern arm of the optional B1F loop.
  if(map.walkable[point.y]?.[point.x]!=='#')return;
  map.props.push({...point,dialogue:SEAFOAM_SUPPLY_EVENT});
  outdoors.objects.push({name:'눈 덮인 비상 보관함',event:SEAFOAM_SUPPLY_EVENT,cells:[point],pages:['둘레길 가장자리에 작은 비상 보관함이 있다.']});
}

export function handleSeafoamSupply(g:Engine,event:string):boolean{
  if(event!==SEAFOAM_SUPPLY_EVENT||g.save.map!==SEAFOAM_SUPPLY_MAP)return false;
  const save=g.save,player=save.player;
  const current=()=>g.save===save&&save.player===player&&save.map===SEAFOAM_SUPPLY_MAP&&!g.battle&&!g.move&&!g.transition&&player.x===23&&player.y===18&&player.facing==='right';
  const guide=(map:string,event?:string)=>()=>{if(current())g.setTourDestination(map,event);};
  const menu=()=>{
    if(!current())return;
    const cleared=save.flags[OPEN]===true,taken=save.flags[TAKEN]===true;
    g.say('비상 보관함',[taken?'덮개 안은 비어 있다. 꺼낸 상처약은 가방에 넣어 두었다.':cleared?'눈이 걷히고 덮개가 풀렸다. 안쪽에 상처약 한 개가 보인다.':'눈과 얇은 서리가 덮개에 끼었다. 동료의 박치기로 걸쇠를 가볍게 두드리거나 날개치기로 눈을 털 수 있다.'],undefined,[
      ...(!cleared?[{label:'동료와 덮개 정리',action:()=>choose(0)}]:[]),
      ...(cleared&&!taken?[{label:'상처약 꺼내기',action:()=>{
        if(!current()||save.flags[OPEN]!==true||save.flags[TAKEN]===true)return;
        if(save.inventory.potions>=RUNTIME_RULES.inventoryCapacity){
          g.say('가방에 자리가 없다',['상처약을 더 넣을 수 없다. 약은 보관함 안에 그대로 두었다.'],undefined,[
            {label:'가방에서 동료 돌보기',action:()=>{if(current())g.panel='bag';}},
            {label:'보관함으로',action:menu},
          ]);return;
        }
        save.flags[TAKEN]=true;save.inventory.potions++;g.persist();menu();
      }}]:[]),
      ...(taken?[{label:'가방에서 동료 돌보기',action:()=>{if(current())g.panel='bag';}}]:[]),
      {label:'홍련센터로 귀환 안내',action:guide('tour_cinnabar_center','nurse')},
      {label:'그대로 두기',action:()=>{}},
    ]);
  };
  const choose=(page:number)=>{
    if(!current()||save.flags[OPEN]===true)return;
    const partners=save.party.filter(p=>isSeafoamCompanion(p)&&p.hp>0&&pokemonMoves(p).some(move=>methods.includes(move)));
    g.say('동료와 현장 작업',partners.length?['함께 작업할 동료를 골라 보자.']:['쌍둥이섬에서 만난 건강한 동료 중 박치기 또는 날개치기를 편성한 동료가 없다.','쥬쥬의 박치기와 주뱃의 날개치기는 홍련 연구소 기술 편성에서 확인할 수 있다. 보관함을 열지 않아도 여행할 수 있다.'],undefined,[
      ...partners.slice(page*3,page*3+3).map(p=>({label:`${SPECIES[p.species].name} Lv.${p.level}`,action:()=>{
        if(!current()||save.flags[OPEN]===true||!save.party.includes(p)||p.hp<=0||!isSeafoamCompanion(p))return;
        const move=pokemonMoves(p).find(m=>methods.includes(m));if(!move)return;
        // Commit once at the actual object, using the selected live party member.
        save.flags[OPEN]=true;save.flags.seafoamSupplyPartner=p.species;g.persist();
        g.say(SPECIES[p.species].name,[move==='날개치기'?'날개치기로 덮개 위의 눈을 털어 냈다!':'박치기로 걸쇠를 가볍게 두드렸다. 서리가 떨어지며 덮개가 풀렸다!'],undefined,[{label:'보관함 안 살피기',action:menu}]);
      }})),
      ...(partners.length>3?[{label:page?'앞쪽 동료':'다음 동료',action:()=>choose(page?0:1)}]:[]),
      {label:'홍련 연구소에서 기술 준비',action:guide('tour_cinnabar_hall','tourExhibit2')},
      {label:'보관함으로',action:menu},
    ]);
  };
  menu();return true;
}

/** Draw after cached cave background, using live flags; confined to the blocked tile. */
export function paintSeafoamSupply(c:CanvasRenderingContext2D,map:GameMap,flags:SaveData['flags']){
  if(map.id!==SEAFOAM_SUPPLY_MAP)return;
  const x=point.x*16,y=point.y*16;
  c.save();
  const fill=(dx:number,dy:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x+dx,y+dy,w,h);};
  fill(0,0,16,16,'#58758b');fill(2,5,12,10,'#6f807f');fill(3,6,10,7,'#abc0bb');
  if(flags[OPEN]===true){fill(2,1,12,4,'#c5d8ce');fill(4,7,8,6,'#344c59');if(flags[TAKEN]!==true){fill(7,8,3,4,'#c9a1c0');fill(7,7,3,1,'#e9e6cf');}}
  else{fill(1,3,14,5,'#d8eae5');fill(3,2,8,2,'#edf3e9');fill(7,8,2,3,'#d0c296');}
  c.restore();
}
