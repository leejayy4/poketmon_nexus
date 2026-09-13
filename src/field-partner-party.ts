import type { SaveData } from './types';
import { trackCherrygrovePartner } from './johto-cherrygrove-party';

/** Follow the actual object during roster edits; species alone is not identity. */
export function trackFieldPartners(save:SaveData):()=>void{
  const trackCare=trackCherrygrovePartner(save);
  const records=[
    ...(!save.flags.icirrusMoorObservationCompleted?[{slot:'icirrusMoorPartnerSlot',species:'icirrusMoorPartnerSpecies'}]:[]),
    // Completed Sinnoh notes describe the historical companion, not today's roster.
    ...(!save.flags.coronet211LayersCompared?[{slot:'coronet211PartnerSlot',species:'coronet211Partner'}]:[]),
  ].map(keys=>{
    const slot=save.flags[keys.slot];
    const partner=typeof slot==='number'?save.party[slot]:undefined;
    return {...keys,partner:partner?.species===save.flags[keys.species]?partner:undefined};
  });
  return ()=>{
    trackCare();
    for(const record of records){
      if(!record.partner)continue;
      const next=save.party.indexOf(record.partner);
      if(next>=0){save.flags[record.slot]=next;save.flags[record.species]=record.partner.species;}
      // Keep the notebook, but never assign it to a replacement in this slot.
      else delete save.flags[record.slot];
    }
  };
}
