import type {SaveData} from './types';

/** Capture identity before a roster mutation, then relocate the same object afterwards. */
export function trackCherrygrovePartner(save:SaveData):()=>void{
  const slot=save.flags.cherrygroveCareSlot;
  const partner=typeof slot==='number'?save.party[slot]:undefined;
  if(save.flags.cherrygroveCareDone||!partner||partner.species!==save.flags.cherrygroveCareSpecies)return ()=>{};
  return ()=>{
    const next=save.party.indexOf(partner);
    if(next>=0){save.flags.cherrygroveCareSlot=next;save.flags.cherrygroveCareSpecies=partner.species;return;}
    delete save.flags.cherrygroveCareSlot;
    delete save.flags.cherrygroveCareSpecies;
    delete save.flags.cherrygroveCareWind;
  };
}
