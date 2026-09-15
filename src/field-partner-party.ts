import type { SaveData } from './types';
import { trackCherrygrovePartner } from './johto-cherrygrove-party';

/** Follow the actual object during roster edits; species alone is not identity. */
export function trackFieldPartners(save:SaveData):()=>void{
  const trackCare=trackCherrygrovePartner(save);
  const records=[
    ...(!save.flags.nexusDriftveilLedgerPreserved?[{slot:'nexusDriftveilWorkPartnerSlot',species:'nexusDriftveilWorkPartner'}]:[]),
    ...(!save.flags.nexusRoute43ResidentFramesReturned?[{slot:'nexusRoute43ResidentFramesSlot',species:'nexusRoute43ResidentFramesSpecies'}]:[]),
    ...(!save.flags.nexusCasteliaSewerParkReturned?[{slot:'nexusCasteliaSewerParkPartnerSlot',species:'nexusCasteliaSewerParkPartner'}]:[]),
    ...(!save.flags.icirrusMoorObservationCompleted?[{slot:'icirrusMoorPartnerSlot',species:'icirrusMoorPartnerSpecies'}]:[]),
    ...(!save.flags.nexusMistraltonCargoCompleted?[{slot:'nexusMistraltonCargoPartnerSlot',species:'nexusMistraltonCargoPartner'}]:[]),
    ...(!save.flags.jubilifeCityLearningCompleted?[{slot:'jubilifeCityLearningPartnerSlot',species:'jubilifeCityLearningPartner'}]:[]),
    ...(!save.flags.icePathTraverseObserved?[{slot:'icePathCompanionSlot',species:'icePathCompanionSpecies'}]:[]),
    ...(!save.flags.darkCaveSurveyCompleted?[{slot:'darkCaveSurveyPartnerSlot',species:'darkCaveSurveyPartnerSpecies'}]:[]),
    ...(!save.flags.dragonsDenObservationCompleted?[{slot:'blackthornTrainingSlot',species:'blackthornTrainingSpecies'}]:[]),
    // Completed Sinnoh notes describe the historical companion, not today's roster.
    ...(!save.flags.coronet211LayersCompared?[{slot:'coronet211PartnerSlot',species:'coronet211Partner'}]:[]),
    // This result is queried against the current companion even after victory.
    {slot:'celesticRouteBattlePartnerSlot',species:'celesticRouteBattlePartner'},
    {slot:'nexusRoute43BattlePartnerSlot',species:'nexusRoute43BattlePartner'},
    {slot:'nexusJohtoEastBattlePartnerSlot',species:'nexusJohtoEastBattlePartner'},
    {slot:'nexusJohtoSouthBattlePartnerSlot',species:'nexusJohtoSouthBattlePartner'},
    {slot:'nexusRouteTwelveBattlePartnerSlot',species:'nexusRouteTwelveBattlePartner'},
    {slot:'nexusRouteElevenBattlePartnerSlot',species:'nexusRouteElevenBattlePartner'},
    {slot:'nexusRouteNineBattlePartnerSlot',species:'nexusRouteNineBattlePartner'},
    {slot:'nexusRouteEightBattlePartnerSlot',species:'nexusRouteEightBattlePartner'},
    {slot:'sinnohRoute203PartnerSlot',species:'sinnohRoute203Partner'},
    {slot:'oreburghGatePartnerSlot',species:'oreburghGatePartner'},
    {slot:'nexusRoute20BattlePartnerSlot',species:'nexusRoute20BattlePartner'},
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
