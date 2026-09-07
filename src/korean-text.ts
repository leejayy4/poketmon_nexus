export type ParticlePair='은/는'|'이/가'|'을/를'|'으로/로'|'과/와';

const FALLBACK:Record<ParticlePair,string>={'은/는':'는','이/가':'가','을/를':'를','으로/로':'로','과/와':'와'};

function particle(pair:ParticlePair,hasFinal:boolean,isRieul:boolean){
  if(pair==='은/는')return hasFinal?'은':'는';
  if(pair==='이/가')return hasFinal?'이':'가';
  if(pair==='을/를')return hasFinal?'을':'를';
  if(pair==='으로/로')return hasFinal&&!isRieul?'으로':'로';
  return hasFinal?'과':'와';
}

/** Append a Korean particle. Non-Hangul endings use the no-final-consonant fallback. */
export function withParticle(text:string,pair:ParticlePair):string{
  const last=[...text].at(-1);
  if(!last)return text+FALLBACK[pair];
  const code=last.codePointAt(0)!;
  if(code<0xAC00||code>0xD7A3)return text+FALLBACK[pair];
  const jong=(code-0xAC00)%28;
  return text+particle(pair,jong!==0,jong===8);
}
