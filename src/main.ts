import './style.css';
import { Engine, KEY_DIRECTION } from './engine';
import { Renderer } from './renderer';
import { setupTestPanel } from './test-panel';
const game=new Engine();
const query=new URLSearchParams(location.search);if(query.has('explore')){query.delete('explore');history.replaceState(null,'',location.pathname+(query.size?'?'+query:'')+location.hash);}
const field=document.querySelector<HTMLCanvasElement>('#field')!;
const touch=document.querySelector<HTMLCanvasElement>('#touch')!;
const renderer=new Renderer(game,field,touch);
const updatePanel=setupTestPanel(game);
const allowed=(key:string)=>KEY_DIRECTION[key]||['Shift','m','z','x','Enter',' ','Escape'].includes(key);
const normalize=(key:string)=>key.length===1?key.toLowerCase():key;
window.addEventListener('keydown',event=>{if(event.target instanceof HTMLElement&&event.target.closest('#test-panel, .header-actions, #help'))return;const key=normalize(event.key);if(allowed(key)){event.preventDefault();game.press(key,event.repeat)}});
document.addEventListener('focusin',event=>{if(event.target instanceof HTMLElement&&event.target.closest('#test-panel, .header-actions, #help'))game.clearInput()});
window.addEventListener('keyup',event=>game.release(normalize(event.key)));
window.addEventListener('blur',()=>game.clearInput());
document.addEventListener('visibilitychange',()=>{game.clearInput();if(document.hidden&&!game.move&&!game.transition)game.persist()});
window.addEventListener('pagehide',()=>{if(!game.move&&!game.transition)game.persist()});
touch.addEventListener('pointerdown',event=>{event.preventDefault();field.focus({preventScroll:true});const r=touch.getBoundingClientRect();renderer.click((event.clientX-r.left)*256/r.width,(event.clientY-r.top)*192/r.height)});
field.addEventListener('pointerdown',()=>{field.focus();if(game.dialogue)game.confirm()});
document.querySelectorAll<HTMLButtonElement>('[data-key]').forEach(button=>{button.addEventListener('pointerdown',event=>{event.preventDefault();field.focus({preventScroll:true});button.setPointerCapture(event.pointerId);game.press(button.dataset.key!)});for(const type of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(type,()=>game.release(button.dataset.key!));});
document.querySelector('#sound')!.addEventListener('click',()=>game.toggleSound());
document.querySelector('#fullscreen')!.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{game.notice('이 브라우저에서는 전체 화면을 지원하지 않아요.')}});
document.querySelector('#help')!.addEventListener('click',()=>{if(game.locked||game.move)return;field.focus({preventScroll:true});game.say('조작 안내',['방향키 / WASD : 이동\nZ / Enter : 조사 · 대화 · 확인','X / Esc : 메뉴 · 취소\nShift : 달리기 · M : 지도','아래 화면을 눌러 선택할 수도 있어요.\n리포트는 메뉴에서 기록해 주세요.'])});
// Read-only observable state for reproducible browser playthroughs; no teleport or event shortcuts.
Object.defineProperty(window,'__game',{value:Object.freeze({snapshot:()=>game.snapshot()}),writable:false});
try{await renderer.load();let previous=performance.now();const frame=(now:number)=>{game.update((now-previous)/1000);previous=now;renderer.draw();updatePanel();field.dataset.state=JSON.stringify(game.snapshot());requestAnimationFrame(frame)};requestAnimationFrame(frame);field.focus();}catch(error){document.querySelector('.console')!.innerHTML='<p style="padding:30px;max-width:380px">게임 리소스를 불러오지 못했습니다.<br>페이지를 새로고침해 주세요.</p>';console.error(error)}
