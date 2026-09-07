import { setupExplorePanel } from './explore-panel';
import { Engine } from './engine';
import { MAPS } from './maps';
import { SPECIES } from './pokemon';
import { newSave } from './save';
import { checkpoint,decodeSave,encodeSave,SaveLibrary } from './save-library';
import type { SaveFile } from './save-library';

export function setupTestPanel(game:Engine){
  const root=document.querySelector<HTMLElement>('#test-panel')!;
  root.innerHTML=`<div class="panel-heading"><span class="panel-dot"></span> 모험 기록</div>
    <p id="current-save" class="panel-current"></p>
    <div class="panel-actions"><button id="reset-game">처음으로</button><button id="quick-save">빠른 저장</button></div>
    <p class="panel-hint">처음으로 돌아가도 저장 슬롯은 유지됩니다.</p>
    <div class="panel-section"><label for="save-slot">저장 슬롯</label>
      <select id="save-slot"><option value="1">슬롯 1</option><option value="2">슬롯 2</option><option value="3">슬롯 3</option></select>
      <p id="slot-info" class="save-info"></p>
      <div class="panel-actions"><button id="slot-save">슬롯에 저장</button><button id="slot-load">불러오기</button></div>
    </div>
    <div class="panel-section"><span class="panel-label">세이브 파일</span>
      <button id="export-save" class="full-button">현재 상태를 파일로 저장 ↓</button>
      <label for="save-file" class="file-label">세이브 파일 선택 (.json)</label>
      <input id="save-file" type="file" accept=".json,application/json" aria-label="세이브 파일 선택"/>
      <p id="file-info" class="save-info">다른 테스트의 저장 파일을 선택할 수 있어요.</p>
      <button id="import-load" class="full-button" disabled>선택한 파일 불러오기</button>
    </div>
    <button id="backup-load" class="undo-button" disabled>↶ 전환 전 상태로 되돌리기</button>
    <p id="panel-status" role="status" aria-live="polite">위치·포켓몬·이야기 진행을 저장합니다.</p>`;
  const updateExplore=setupExplorePanel(game,root);
  // Storage can be unavailable in private/restricted browser contexts. Report failures instead of losing progress.
  const library=new SaveLibrary({getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)},game.storageKey+':library');
  const el=<T extends HTMLElement=HTMLElement>(id:string)=>root.querySelector<T>('#'+id)!;
  const status=(message:string,error=false)=>{el('panel-status').textContent=message;el('panel-status').classList.toggle('error',error)};
  const summary=(file:SaveFile)=>`${MAPS[file.save.map].name} · ${file.save.party.length?file.save.party.map(p=>SPECIES[p.species].name).join(', '):'포켓몬 없음'}\n${new Date(file.savedAt).toLocaleString('ko-KR')}`;
  const selected=()=>Number(el<HTMLSelectElement>('save-slot').value);
  let pending:SaveFile|null=null;
  function refresh(){try{
    for(let i=1;i<=3;i++){const file=library.read(i);el<HTMLSelectElement>('save-slot').options[i-1].textContent=`슬롯 ${i} · ${file?MAPS[file.save.map].name:'비어 있음'}`;}
    const file=library.read(selected());el('slot-info').textContent=file?summary(file):'아직 저장하지 않은 슬롯입니다.';
    el<HTMLButtonElement>('slot-load').disabled=!file;el('slot-save').textContent=file?'덮어쓰기':'슬롯에 저장';
    el<HTMLButtonElement>('backup-load').disabled=!library.read('backup');
  }catch{status('브라우저 저장을 사용할 수 없어요. 파일로 저장해 주세요.',true)}}
  function guard(action:()=>void){game.keys.clear();try{action();refresh();document.querySelector<HTMLCanvasElement>('#field')!.focus()}catch{status('저장 공간에 접근하지 못했습니다. 현재 플레이는 유지됩니다.',true)}}
  function switchTo(save:SaveFile['save'],message:string){
    // Keep one undo checkpoint before resets, slot loads and imported file loads.
    library.write('backup',checkpoint(game.save));
    game.restore(save);status(game.saveError?'불러왔지만 자동 저장에 실패했습니다. 파일로 보관해 주세요.':message,game.saveError);
  }
  root.addEventListener('focusin',()=>game.keys.clear());
  el('reset-game').addEventListener('click',()=>guard(()=>switchTo(game.freshSave(),'주인공 방에서 새로 시작합니다. 이전 상태는 되돌릴 수 있어요.')));
  el('quick-save').addEventListener('click',()=>guard(()=>{
    if(game.move||game.transition){status('한 걸음이 끝난 뒤 다시 저장해 주세요.');return;}
    const saved=game.persist();status(saved?'현재 진행을 저장했습니다. 새로고침해도 이어집니다.':'빠른 저장에 실패했습니다. 파일로 저장해 주세요.',!saved);
  }));
  el('save-slot').addEventListener('change',refresh);
  el('slot-save').addEventListener('click',()=>guard(()=>{library.write(selected(),game.save);status(`슬롯 ${selected()}에 저장했습니다.`)}));
  el('slot-load').addEventListener('click',()=>guard(()=>{const file=library.read(selected());if(file)switchTo(file.save,`슬롯 ${selected()}의 진행을 불러왔습니다.`);else status('선택한 슬롯이 비어 있거나 손상되었습니다.',true)}));
  el('backup-load').addEventListener('click',()=>guard(()=>{const backup=library.read('backup');if(backup)switchTo(backup.save,'전환 전 상태를 복원했습니다.')}));
  el('export-save').addEventListener('click',()=>{
    game.keys.clear();const blob=new Blob([encodeSave(game.save)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`first-partner-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('현재 상태를 세이브 파일로 내보냈습니다.');
  });
  let importRequest=0;
  el('save-file').addEventListener('change',async()=>{
    const request=++importRequest;pending=null;el<HTMLButtonElement>('import-load').disabled=true;
    const file=el<HTMLInputElement>('save-file').files?.[0];if(!file){el('file-info').textContent='선택한 파일이 없습니다.';return;}
    if(file.size>262144){el('file-info').textContent='파일이 너무 큽니다. 256KB 이하의 세이브 파일을 선택해 주세요.';return;}
    try{const decoded=decodeSave(await file.text());if(request!==importRequest)return;
      if(!decoded){el('file-info').textContent='올바른 세이브 파일이 아닙니다. 현재 진행은 유지됩니다.';return;}
      pending=decoded;el('file-info').textContent=file.name+'\n'+summary(decoded);el<HTMLButtonElement>('import-load').disabled=false;
      status('파일을 확인했습니다. 불러오기 버튼을 누르면 이어집니다.');
    }catch{if(request===importRequest)el('file-info').textContent='파일을 읽지 못했습니다. 다시 선택해 주세요.';}
  });
  el('import-load').addEventListener('click',()=>guard(()=>{if(pending)switchTo(pending.save,'선택한 세이브 파일을 불러왔습니다.')}));
  refresh();
  let previous='';
  return ()=>{updateExplore();const current=`${game.map.name}\n함께하는 포켓몬 ${game.save.party.length}마리`;if(current!==previous){el('current-save').textContent=current;previous=current;}};
}

