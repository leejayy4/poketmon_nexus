/** A developer panel failure must not stop the game's animation/transition loop. */
export function guardedPanelUpdate(update:()=>void,report:(error:unknown)=>void){
  let failed=false;
  return ()=>{
    if(failed)return;
    try{update();}catch(error){failed=true;report(error);}
  };
}
