import { setupExplorePanel } from './explore-panel';
import { Engine } from './engine';
import { MAPS } from './maps';
import { SPECIES } from './pokemon';
import { checkpoint,decodeSave,encodeSave,SaveLibrary,SaveLibraryError } from './save-library';
import type { SaveFile } from './save-library';

export function setupTestPanel(game:Engine){
  const root=document.querySelector<HTMLElement>('#test-panel')!;
  root.innerHTML=`<div class="panel-heading"><span class="panel-dot"></span> 모험 기록</div>
    <p id="current-save" class="panel-current"></p>
    <div class="panel-actions"><button id="reset-game">처음으로</button><button id="quick-save">빠른 저장</button></div>
    <p class="panel-hint">새 게임과 불러온 진행은 별도로 저장하며 이전 기록은 보관합니다.</p>
    <div id="save-protection" class="panel-section" hidden>
      <p id="save-protection-message" class="save-info" role="status" aria-live="polite"></p>
      <button id="export-original" class="full-button" hidden>보호 중인 원본을 파일로 보관 ↓</button>
      <button id="save-separate-copy" class="full-button">현재 진행을 별도 저장으로 계속</button>
    </div>
    <div class="panel-section"><label for="save-slot">저장 슬롯</label>
      <select id="save-slot"><option value="1">슬롯 1</option><option value="2">슬롯 2</option><option value="3">슬롯 3</option></select>
      <p id="slot-info" class="save-info"></p>
      <div class="panel-actions"><button id="slot-save">슬롯에 저장</button><button id="slot-load">불러오기</button></div>
      <button id="slot-export-original" class="full-button" hidden>이 슬롯의 원본을 파일로 보관 ↓</button>
    </div>
    <div class="panel-section"><span class="panel-label">세이브 파일</span>
      <button id="export-save" class="full-button">현재 상태를 파일로 저장 ↓</button>
      <label for="save-file" class="file-label">세이브 파일 선택 (.json)</label>
      <input id="save-file" type="file" accept=".json,application/json" aria-label="세이브 파일 선택"/>
      <p id="file-info" class="save-info">다른 테스트의 저장 파일을 선택할 수 있어요.</p>
      <button id="import-load" class="full-button" disabled>선택한 파일 불러오기</button>
    </div>
    <button id="backup-load" class="undo-button" disabled>↶ 전환 전 상태로 되돌리기</button>
    <button id="backup-export-original" class="full-button" hidden>읽지 못한 전환 전 원본을 파일로 보관 ↓</button>
    <p id="panel-status" role="status" aria-live="polite">위치·포켓몬·이야기 진행을 저장합니다.</p>`;
  const updateExplore=setupExplorePanel(game,root);
  // Storage can be unavailable in private/restricted browser contexts. Report failures instead of losing progress.
  const library=new SaveLibrary({getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)},game.storageKey+':library');
  const el=<T extends HTMLElement=HTMLElement>(id:string)=>root.querySelector<T>('#'+id)!;
  const status=(message:string,error=false)=>{el('panel-status').textContent=message;el('panel-status').classList.toggle('error',error)};
  const summary=(file:SaveFile)=>`${MAPS[file.save.map].name} · ${file.save.party.length?file.save.party.map(p=>SPECIES[p.species].name).join(', '):'포켓몬 없음'}\n${new Date(file.savedAt).toLocaleString('ko-KR')}`;
  const selected=()=>Number(el<HTMLSelectElement>('save-slot').value);
  let pending:SaveFile|null=null;
  let previousProtection='';
  function refreshProtection(){
    const protection=game.saveStatus,recovery=game.saveRecovery;
    const current=JSON.stringify([protection.writable,protection.reason,protection.activeKey,protection.recoveryKey,game.saveError,game.saveStatusMessage,recovery?.key]);
    if(current===previousProtection)return;
    previousProtection=current;
    const visible=!protection.writable||game.saveError||!!recovery;
    el('save-protection').hidden=!visible;
    el('save-protection-message').textContent=game.saveStatusMessage;
    el('save-protection-message').classList.toggle('error',!protection.writable||game.saveError);
    el('export-original').hidden=!recovery;
    el('save-separate-copy').hidden=protection.writable&&!game.saveError;
  }
  function refresh(){try{
    for(let i=1;i<=3;i++){const entry=library.inspect(i);el<HTMLSelectElement>('save-slot').options[i-1].textContent=`슬롯 ${i} · ${entry.kind==='ready'?MAPS[entry.file.save.map].name:entry.kind==='unreadable'?'읽을 수 없는 기록':'비어 있음'}`;}
    const entry=library.inspect(selected());
    el('slot-info').textContent=entry.kind==='ready'?summary(entry.file):entry.kind==='unreadable'?'기록이 있지만 현재 버전에서 읽을 수 없습니다. 이 슬롯에 저장하면 원본을 별도로 보관한 뒤 새 기록을 씁니다.':'아직 저장하지 않은 슬롯입니다.';
    el<HTMLButtonElement>('slot-load').disabled=entry.kind!=='ready';
    el('slot-save').textContent=entry.kind==='ready'?'덮어쓰기':entry.kind==='unreadable'?'원본 보관 후 저장':'슬롯에 저장';
    el('slot-export-original').hidden=entry.kind!=='unreadable'&&!library.recovery(selected());
    el('slot-export-original').textContent=entry.kind==='unreadable'?'이 슬롯의 원본을 파일로 보관 ↓':'이 슬롯의 보관 원본을 파일로 받기 ↓';
    const backup=library.inspect('backup');
    el<HTMLButtonElement>('backup-load').disabled=backup.kind!=='ready';
    el('backup-load').textContent=backup.kind==='unreadable'?'전환 전 기록을 현재 버전에서 읽을 수 없습니다':'↶ 전환 전 상태로 되돌리기';
    el('backup-export-original').hidden=backup.kind!=='unreadable'&&!library.recovery('backup');
  }catch{status('브라우저 저장을 사용할 수 없어요. 파일로 저장해 주세요.',true)}finally{refreshProtection()}}
  function guard(action:()=>void){game.clearInput();try{action();refresh();document.querySelector<HTMLCanvasElement>('#field')!.focus()}catch(error){
    const message=error instanceof SaveLibraryError?{
      'invalid-save':'현재 진행을 저장 형식으로 확인하지 못했습니다. 이전 기록은 유지됩니다.',
      'recovery-failed':'슬롯 원본을 별도로 보관하지 못해 덮어쓰기를 중단했습니다. 원본을 파일로 보관해 주세요.',
      'changed':'다른 창에서 슬롯을 변경했습니다. 기록을 다시 확인한 뒤 시도해 주세요.',
      'write-failed':'슬롯 저장을 확인하지 못했습니다. 현재 진행을 파일로 보관해 주세요.'
    }[error.code]:'저장 공간에 접근하지 못했습니다. 현재 플레이는 유지됩니다.';
    status(message,true);refreshProtection();
  }}
  function stableField(){
    if(game.move||game.locked){status('대화·전투·메뉴·이동을 마친 뒤 다시 시도해 주세요.');return false;}
    return true;
  }
  function download(raw:string,name:string){
    const blob=new Blob([raw],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`${name}-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function switchTo(save:SaveFile['save'],message:string){
    if(!stableField())return;
    // Invalid current state must remain recoverable without preventing a valid import.
    const backup=library.backup(game.save);
    if(!game.activateSave(save)){status('기록을 전환하지 못했습니다. '+game.saveStatusMessage,true);return;}
    if(game.saveError){status('기록을 불러왔지만 이후 자동 저장을 확인하지 못했습니다. '+game.saveStatusMessage,true);return;}
    status(message+(backup.readable?'':' 이전 상태는 전환 전 원본 보관 버튼에서 파일로 받을 수 있습니다.'));
  }
  root.addEventListener('focusin',()=>game.keys.clear());
  el('reset-game').addEventListener('click',()=>guard(()=>switchTo(game.freshSave(),'주인공 방에서 별도 리포트로 시작합니다.')));
  el('quick-save').addEventListener('click',()=>guard(()=>{
    if(!stableField())return;
    const saved=game.persist();status(saved?'현재 진행을 저장했습니다. 새로고침해도 이어집니다.':game.saveStatusMessage,!saved);
  }));
  el('save-slot').addEventListener('change',refresh);
  el('slot-save').addEventListener('click',()=>guard(()=>{if(!stableField())return;const result=library.write(selected(),game.save);status(`슬롯 ${selected()}에 저장했습니다.${result.recoveryKey?' 읽을 수 없었던 원본은 별도로 보관했습니다.':''}`)}));
  el('slot-load').addEventListener('click',()=>guard(()=>{const file=library.read(selected());if(file)switchTo(file.save,`슬롯 ${selected()}의 진행을 불러왔습니다.`);else status('선택한 슬롯이 비어 있거나 손상되었습니다.',true)}));
  el('backup-load').addEventListener('click',()=>guard(()=>{const backup=library.read('backup');if(backup)switchTo(backup.save,'전환 전 상태를 복원했습니다.')}));
  el('export-save').addEventListener('click',()=>guard(()=>{
    let encoded:string|null=null;
    if(!game.move&&!game.locked){try{const candidate=encodeSave(game.save);if(decodeSave(candidate))encoded=candidate;}catch{/* A damaged current state can still be exported as raw recovery data. */}}
    if(encoded!==null){download(encoded,'first-partner');status('현재 상태를 세이브 파일로 내보냈습니다.');return;}
    download(JSON.stringify(game.save),'first-partner-recovery');
    status('현재 상태를 복구용 원본으로 내보냈습니다. 진행 중이거나 읽을 수 없는 상태이므로 정상 불러오기는 확인되지 않았습니다.');
  }));
  el('export-original').addEventListener('click',()=>guard(()=>{
    const recovery=game.saveRecovery;if(!recovery)return;
    download(recovery.raw,'first-partner-original');status('보호 중인 원본을 변환 없이 파일로 내보냈습니다.');
  }));
  el('slot-export-original').addEventListener('click',()=>guard(()=>{
    const entry=library.inspect(selected()),original=entry.kind==='unreadable'?entry:library.recovery(selected());if(!original)return;
    download(original.raw,`first-partner-slot-${selected()}-original`);status('슬롯 원본을 변환 없이 파일로 내보냈습니다.');
  }));
  el('backup-export-original').addEventListener('click',()=>guard(()=>{
    const entry=library.inspect('backup'),original=entry.kind==='unreadable'?entry:library.recovery('backup');if(!original)return;
    download(original.raw,'first-partner-backup-original');status('전환 전 원본을 변환 없이 파일로 내보냈습니다.');
  }));
  el('save-separate-copy').addEventListener('click',()=>guard(()=>{
    if(!stableField())return;
    if(!game.activateSave(checkpoint(game.save))){status('별도 저장을 시작하지 못했습니다. '+game.saveStatusMessage,true);return;}
    if(game.saveError){status('별도 기록을 선택했지만 이후 자동 저장을 확인하지 못했습니다. '+game.saveStatusMessage,true);return;}
    status('현재 진행을 별도 기록에 저장했습니다. 이전 원본은 보관됩니다.');
  }));
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
  return ()=>{updateExplore();refreshProtection();const current=`${game.map.name}\n함께하는 포켓몬 ${game.save.party.length}마리`;if(current!==previous){el('current-save').textContent=current;previous=current;}};
}

