import type { Engine } from './engine';
import type { Choice,Pokemon,SaveData } from './types';
import { SPECIES } from './pokemon';
import { encounterGuidance, passageSignPages, passageWalkerPages } from './encounter-guidance';
import { isWorldCenter } from './unified-world';
import { MART_ROOMS,PASSAGES } from './journey-world';
import { speciesHabitats } from './runtime-encounters';
import { showPcSwap } from './pc-swap-menu';
import { withParticle } from './korean-text';

// Prices are the NEXUS items.json project values, not another generation's prices.
export const SHOP_ITEMS=[{key:'pokeBalls' as const,name:'몬스터볼',price:200,source:'IT-poke-ball'},{key:'potions' as const,name:'상처약',price:200,source:'IT-potion'}];
export const BOX_CAPACITY=60;
type CollectionSave=SaveData&{box?:Pokemon[];pokedex?:{seen:number[];caught:number[]}};
export function purchase(s:SaveData,index:number,quantity:number):string{
  const item=SHOP_ITEMS[index];
  if(!item||!Number.isInteger(quantity)||quantity<1||quantity>99)return '구매할 수량을 다시 선택해 주세요.';
  if(s.inventory[item.key]+quantity>999)return '가방에 더 담을 수 없어요.\n수량을 줄여 주세요.';
  const cost=item.price*quantity;if(s.money<cost)return `돈이 부족해요.\n필요 금액 ${cost}원 · 소지금 ${s.money}원`;
  s.money-=cost;s.inventory[item.key]+=quantity;
  return `${item.name} ${quantity}개를 샀다!\n남은 돈 ${s.money}원`;
}
export function depositPokemon(s:CollectionSave,index:number):string{
  const p=s.party[index];if(!Number.isInteger(index)||!p)return '맡길 포켓몬을 선택해 주세요.';
  if((s.box?.length??0)>=BOX_CAPACITY)return '박스가 가득 찼어요. (60마리)';
  if(s.party.length<=1||!s.party.some((mon,i)=>i!==index&&mon.hp>0))return '모험할 수 있는 건강한 포켓몬을\n한 마리 이상 데리고 있어야 해요.';
  (s.box??=[]).push(s.party.splice(index,1)[0]);
  return `${withParticle(SPECIES[p.species].name,'을/를')} 박스에 맡겼다.\n센터 PC에서 다시 데려올 수 있다.`;
}
export function withdrawPokemon(s:CollectionSave,index:number):string{
  const p=s.box?.[index];if(!Number.isInteger(index)||!p)return '데려올 포켓몬을 선택해 주세요.';
  if(s.party.length>=6)return '파티가 가득 찼어요.\n먼저 한 마리를 맡겨 주세요.';
  s.party.push(s.box!.splice(index,1)[0]);return `${withParticle(SPECIES[p.species].name,'이/가')} 파티로 돌아왔다!`;
}
function pcMenu(g:Engine){
  const s=g.save as CollectionSave;
  g.say('포켓몬 보관 시스템',[`파티 ${s.party.length}/6 · 박스 ${s.box?.length??0}/${BOX_CAPACITY}\n무엇을 할까요?`],undefined,[
    {label:'포켓몬 맡기기',action:()=>collectionMenu(g,false,0)},
    {label:'포켓몬 데려오기',action:()=>collectionMenu(g,true,0)},
    {label:'파티·박스 교체',action:()=>showPcSwap(g,()=>pcMenu(g))},
    {label:'포켓몬도감',action:()=>showPokedex(g,0,()=>pcMenu(g))},
    {label:'PC 끄기',action:()=>{}}
  ]);
}
function collectionMenu(g:Engine,withdraw:boolean,page:number){
  const s=g.save as CollectionSave,list=withdraw?s.box??[]:s.party,pages=Math.max(1,Math.ceil(list.length/3));page=Math.max(0,Math.min(page,pages-1));
  const choices:Choice[]=list.slice(page*3,page*3+3).map((mon,i)=>({label:`${SPECIES[mon.species].name} Lv.${mon.level}`,action:()=>{
    if(g.save!==s||!isWorldCenter(s.map))return;
    const index=page*3+i;if((withdraw?s.box:s.party)?.[index]!==mon)return;
    g.say(SPECIES[mon.species].name,[`Lv.${mon.level} · HP ${mon.hp}/${mon.maxHp}\n${withdraw?'파티로 데려올까요?':'박스에 맡길까요?'}`],undefined,[
      {label:withdraw?'데려온다':'맡긴다',action:()=>{if(g.save!==s||!isWorldCenter(s.map)||(withdraw?s.box:s.party)?.[index]!==mon)return;const message=withdraw?withdrawPokemon(s,index):depositPokemon(s,index);g.persist();g.say('포켓몬 PC',[message],()=>collectionMenu(g,withdraw,page));}},
      {label:'돌아가기',action:()=>collectionMenu(g,withdraw,page)}
    ]);
  }}));
  if(page<pages-1)choices.push({label:'다음 페이지',action:()=>collectionMenu(g,withdraw,page+1)});
  if(page>0)choices.push({label:'이전 페이지',action:()=>collectionMenu(g,withdraw,page-1)});
  choices.push({label:'PC 메뉴로',action:()=>pcMenu(g)});
  g.say(withdraw?'박스':'파티',[`${withdraw?'데려올':'맡길'} 포켓몬 · ${page+1}/${pages}쪽\n${list.length?'포켓몬을 선택해 주세요.':'아직 보관 중인 포켓몬이 없어요.'}`],undefined,choices);
}
export function showPokedex(g:Engine,page=0,back:()=>void=()=>{}){
  const s=g.save as CollectionSave,owned=[...s.party,...s.box??[]].map(p=>p.species),caught=new Set([...(s.pokedex?.caught??[]),...owned]);
  const seen=[...new Set([...(s.pokedex?.seen??[]),...caught])].filter(id=>SPECIES[id]).sort((a,b)=>a-b),pages=Math.max(1,Math.ceil(seen.length/3));page=Math.max(0,Math.min(page,pages-1));
  const choices:Choice[]=seen.slice(page*3,page*3+3).map(id=>({label:`${caught.has(id)?'●':'○'} ${SPECIES[id].name}`,action:()=>{
    if(g.save!==s||g.battle)return;
    const p=SPECIES[id],habitats=speciesHabitats(id);
    g.say('포켓몬도감',[`No.${String(id).padStart(3,'0')} ${p.name}\n${p.types.join(' / ')} · ${caught.has(id)?'잡은 포켓몬':'발견한 포켓몬'}`,p.description,
      ...(habitats.length?habitats.map(h=>`야생 서식지\n${h.name}\nLv.${h.minLevel}~${h.maxLevel} · ${h.rarity}`):['야생 서식지 정보가 없다.']),
    ],()=>{if(g.save===s&&!g.battle)showPokedex(g,page,back);});
  }}));
  if(page<pages-1)choices.push({label:'다음 페이지',action:()=>showPokedex(g,page+1,back)});
  if(page>0)choices.push({label:'이전 페이지',action:()=>showPokedex(g,page-1,back)});
  choices.push({label:'돌아가기',action:back});
  g.say('포켓몬도감',[`발견 ${seen.length}종 · 포획 ${caught.size}종\n${page+1}/${pages}쪽 · ● 포획 / ○ 발견`],undefined,choices);
}
function shopMenu(g:Engine){
  if(!MART_ROOMS.has(g.save.map))return;
  g.say('점원',[`어서 오세요! 소지금 ${g.save.money}원\n필요한 도구를 골라 주세요.`],undefined,[...SHOP_ITEMS.map((item,i)=>({label:`${item.name} ${item.price}원`,action:()=>shopQuantity(g,i)})),{label:'그만 산다',action:()=>{}}]);
}
function shopQuantity(g:Engine,index:number){
  const s=g.save,item=SHOP_ITEMS[index];
  g.say(item.name,[`소지금 ${s.money}원 · 보유 ${s.inventory[item.key]}개\n몇 개 살까요?`],undefined,[...[1,5,10].map(quantity=>({label:`${quantity}개 · ${quantity*item.price}원`,action:()=>{
    if(g.save!==s||!MART_ROOMS.has(s.map))return;
    g.say('구매 확인',[`${item.name} ${quantity}개 · ${quantity*item.price}원\n구매할까요?`],undefined,[{label:'산다',action:()=>{if(g.save!==s||!MART_ROOMS.has(s.map))return;const text=purchase(s,index,quantity);g.persist();g.say('점원',[text],()=>shopMenu(g));}},{label:'돌아가기',action:()=>shopQuantity(g,index)}]);
  }})),{label:'상품 목록으로',action:()=>shopMenu(g)}]);
}
export function handleJourneyEvent(g:Engine,id:string):boolean{
  if(id==='jubilifeGrassSign'&&g.save.map==='tour_jubilife'){g.say('축복시티 외곽 풀밭',encounterGuidance(g.save.map).pages);return true;}
  if(id==='martClerk'&&MART_ROOMS.has(g.save.map)){shopMenu(g);return true;}
  if(isWorldCenter(g.save.map)&&id==='tourExhibit1'){pcMenu(g);return true;}
  const passage=PASSAGES[g.save.map];if(!passage)return false;
  if(id==='journeySign'){g.say('이정표',passageSignPages(g.save.map,passage.a.name,passage.b.name));return true;}
  if(id==='journeyWalker'){
    g.say('여행자',passageWalkerPages(g.save.map,passage.a.name,passage.b.name,Boolean(g.save.flags['pickup:'+g.save.map])));return true;
  }
  if(id==='journeyItem'){
    const key='pickup:'+g.save.map;
    if(g.save.flags[key])g.say('작은 공터',['여기서 상처약을 찾았었다.\n여행자가 지나간 발자국이 남아 있다.']);
    else if(g.save.inventory.potions>=999)g.say('상처약',['가방이 가득 찼다.\n빈자리가 생기면 다시 오자.']);
    else {g.save.flags[key]=true;g.save.inventory.potions++;g.persist();g.audio.play('receive');g.say('',['상처약 1개를 주웠다!\n가방의 도구 주머니에 넣었다.']);}
    return true;
  }
  return false;
}
