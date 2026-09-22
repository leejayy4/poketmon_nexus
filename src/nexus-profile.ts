import type { Engine } from './engine';
import type { SaveData } from './types';
import { completeNexusProfile,deferNexusProfile } from './nexus-opening';
import { validTrainerProfile } from './nexus-opening-state';

/** Native form supplies text entry and focus; the engine owns all persisted choices. */
export function setupNexusProfile(g:Engine):()=>void {
  const dialog=document.createElement('dialog');dialog.className='nexus-profile';
  dialog.setAttribute('aria-labelledby','nexus-profile-title');
  dialog.innerHTML=`<form>
    <p class="nexus-profile-kicker">Pokémon NEXUS</p>
    <h2 id="nexus-profile-title">여행을 시작하는 날</h2>
    <p class="nexus-profile-protection" role="status" hidden></p>
    <label for="nexus-trainer-name">이름</label>
    <input id="nexus-trainer-name" name="trainerName" required maxlength="12" autocomplete="off" spellcheck="false">
    <fieldset><legend>여행 옷 색</legend>
      <label><input type="radio" name="appearance" value="blue" checked> 파랑</label>
      <label><input type="radio" name="appearance" value="coral"> 산호</label>
    </fieldset>
    <p class="nexus-profile-error" role="alert"></p>
    <button type="submit">이 이름으로 출발하기</button>
    <button type="button" class="nexus-profile-reports">기존 리포트 살펴보기</button>
    <p class="nexus-profile-hint">이름 고르기는 방의 TV나 엄마에게 말을 걸면 다시 열 수 있어요.</p>
  </form>`;
  document.body.append(dialog);
  const form=dialog.querySelector('form')!,input=dialog.querySelector<HTMLInputElement>('#nexus-trainer-name')!;
  const error=dialog.querySelector<HTMLElement>('.nexus-profile-error')!;
  const protection=dialog.querySelector<HTMLElement>('.nexus-profile-protection')!;
  let source:SaveData|null=null;
  let composing=false;
  input.addEventListener('compositionstart',()=>{composing=true;});
  input.addEventListener('compositionend',()=>{composing=false;});
  input.addEventListener('keydown',event=>{if(event.key==='Enter'&&(composing||event.isComposing||event.keyCode===229))event.preventDefault();});
  const reports=()=>{deferNexusProfile(g);dialog.close();document.querySelector<HTMLInputElement>('#save-file')?.focus();};
  dialog.addEventListener('cancel',event=>{event.preventDefault();reports();});
  dialog.querySelector('.nexus-profile-reports')!.addEventListener('click',reports);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(composing||g.save!==source)return;
    const appearance=form.querySelector<HTMLInputElement>('input[name="appearance"]:checked')?.value;
    const profile={name:input.value.trim(),appearance};
    if(!validTrainerProfile(profile)){error.textContent='이름을 1~12자로 입력해 주세요.';input.focus();return;}
    if(!completeNexusProfile(g,profile))return;
    dialog.close();document.querySelector<HTMLCanvasElement>('#field')?.focus();
  });
  return ()=>{
    if(g.panel!=='profile'){if(dialog.open)dialog.close();source=null;return;}
    protection.hidden=g.saveStatus.writable;protection.textContent=protection.hidden?'':g.saveStatusMessage;
    if(source!==g.save){source=g.save;input.value=source.trainer?.name??'빛나래';error.textContent='';
      form.querySelector<HTMLInputElement>(`input[value="${source.trainer?.appearance==='coral'?'coral':'blue'}"]`)!.checked=true;}
    if(!dialog.open){g.clearInput();dialog.showModal();input.focus();input.select();}
  };
}
