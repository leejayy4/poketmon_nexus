import type { SaveData, TrainerProfile } from './types';
import { isNexusCampaign } from './nexus-starters';

export const NEXUS_OPENING = {
  profile:'nexusProfileReady', broadcast:'nexusBroadcastSeen',
  postcards:'nexusPostcardsReceived', reply:'nexusPostcardReply',
  outside:'nexusPartnerOutside',
} as const;
export const DEFAULT_TRAINER:TrainerProfile={name:'빛나래',appearance:'blue'};
export function validTrainerProfile(value:unknown):value is TrainerProfile {
  if(!value||typeof value!=='object'||Array.isArray(value))return false;
  const profile=value as TrainerProfile;
  return typeof profile.name==='string'&&profile.name===profile.name.trim()
    &&profile.name.length>=1&&profile.name.length<=12&&!/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(profile.name)
    &&(profile.appearance==='blue'||profile.appearance==='coral');
}
export function trainerName(save:SaveData){return isNexusCampaign(save)?save.trainer?.name??DEFAULT_TRAINER.name:'빛나래';}
