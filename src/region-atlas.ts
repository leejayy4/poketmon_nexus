/** Presentation coordinates only. Never use these to derive world exits or save positions.
 * Geography references and intentional project differences: docs/REGION_ATLAS.md.
 */
export interface AtlasPlace { id:string; name:string; region:string }
type Point=readonly [number,number];
interface RegionAtlas { land:string[]; hills:string[]; water?:string[]; snow?:string[]; points:Record<string,Point> }
export const REGION_ATLASES:Record<string,RegionAtlas>={
  '관동':{
    land:['24,0 256,0 256,124 232,124 232,144 208,144 208,160 152,160 152,150 112,150 112,136 64,136 64,152 40,152 40,124 24,124','32,174 52,174 52,186 32,186','112,174 126,174 126,182 112,182'],
    hills:['30,0 92,0 92,30 76,30 76,48 40,48 40,96 30,96','112,0 242,0 242,64 226,64 226,88 204,88 204,38 112,38','74,74 106,74 106,108 92,108 92,124 74,124'],
    water:['154,0 164,0 164,32 174,32 174,44 162,44 162,60 154,60'],
    points:{pallet:[44,130],viridian:[44,100],viridian_forest:[44,72],pewter:[44,42],cerulean:[160,42],celadon:[116,94],saffron:[160,94],lavender:[214,94],vermilion:[160,126],fuchsia:[160,150],cinnabar:[44,178]},
  },
  '성도':{
    land:['44,0 256,0 256,192 148,192 148,178 120,178 120,164 88,164 88,150 68,150 68,108 44,108','12,134 30,134 30,148 38,148 38,180 10,180 10,164 4,164 4,146 12,146'],
    hills:['46,0 256,0 256,68 234,68 234,40 204,40 204,68 184,68 184,32 142,32 142,52 104,52 104,76 76,76 76,52 46,52','92,144 154,144 154,170 140,170 140,180 110,180 110,164 92,164','208,96 240,96 240,160 224,160 224,182 210,182'],
    water:['168,20 192,20 192,40 184,40 184,48 166,48 166,30'],
    points:{goldenrod:[98,126],violet:[158,102],azalea:[148,166],ilex:[112,158],ecruteak:[108,62],mahogany:[178,62],rage_lake:[178,30],olivine:[58,104],cianwood:[22,158],blackthorn:[230,62]},
  },
  '신오':{
    land:['60,0 168,0 168,16 184,16 184,40 196,40 196,66 222,66 222,98 240,98 240,152 224,152 224,166 186,166 186,178 112,178 112,166 52,166 52,154 24,154 24,124 42,124 42,84 52,84 52,42 60,42','214,10 244,10 244,18 252,18 252,40 222,40 222,30 210,30'],
    hills:['112,0 148,0 148,26 142,26 142,52 150,52 150,76 140,76 140,104 146,104 146,142 128,142 128,166 112,166 112,134 104,134 104,100 116,100 116,70 108,70','54,72 88,72 88,102 76,102 76,118 54,118','174,60 204,60 204,96 184,96 184,110 166,110','170,140 210,140 210,166 168,166'],
    water:['72,26 94,26 94,46 76,46 76,38 68,38','56,146 68,146 68,158 56,158','192,118 204,118 204,132 190,132'],
    snow:['60,0 168,0 168,16 180,16 180,36 154,36 154,48 118,48 118,38 98,38 98,24 60,24'],
    points:{jubilife:[68,132],oreburgh:[100,140],eterna_forest:[68,94],eterna:[100,86],coronet:[128,114],hearthome:[156,130],veilstone:[204,90],pastoria:[180,154],canalave:[30,132],snowpoint:[136,24],sunyshore:[232,144],lake:[84,34]},
  },
  '하나':{
    land:['0,0 256,0 256,90 238,90 238,120 250,120 250,164 232,164 232,178 214,178 214,154 196,154 196,142 184,142 184,102 170,102 170,62 152,62 152,22 136,22 136,0','0,0 100,0 100,34 112,34 112,60 100,60 100,92 110,92 110,130 98,130 98,148 86,148 86,158 54,158 54,172 26,172 26,188 0,188','112,0 134,0 134,36 150,36 150,64 166,64 166,110 180,110 180,130 164,130 164,158 158,158 158,174 150,174 150,164 142,164 142,180 134,180 134,166 126,166 126,176 120,176 120,150 112,150 112,124 118,124 118,88 110,88 110,62 122,62 122,38 112,38'],
    hills:['12,0 92,0 92,40 76,40 76,62 44,62 44,82 18,82','170,0 236,0 236,24 214,24 214,46 186,46 186,32 170,32','14,120 42,120 42,148 26,148 26,170 14,170'],
    points:{castelia:[140,156],aspertia:[26,174],virbank:[74,146],nimbasa:[140,100],driftveil:[74,100],mistralton:[44,66],opelucid:[146,44],humilau:[234,38],desert:[132,124],dragonspiral:[76,20]},
  },
};
export function atlasPoint(region:string,id:string):Point {
  const point=REGION_ATLASES[region]?.points[id.replace(/^tour_/,'')];
  if(!point)throw new Error(`Missing atlas location: ${region}/${id}`);
  return point;
}
export const atlasNature=(id:string)=>/_(forest|ilex|coronet|lake|rage_lake|desert|dragonspiral)$/.test(id);
const polygon=(points:string,fill:string,stroke=fill,width=1)=>`<polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="miter"/>`;
function relief(shapes:string[]):string {
  // Small stepped contours stay inside the higher ground, at native town-map pixel scale.
  return shapes.map(shape=>{
    const points=shape.split(' ').map(p=>p.split(',').map(Number));
    const inside=(x:number,y:number)=>{
      let hit=false;
      for(let i=0,j=points.length-1;i<points.length;j=i++){
        const [a,b]=points[i],[c,d]=points[j];
        if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)hit=!hit;
      }
      return hit;
    };
    let result='';
    for(let y=6;y<186;y+=12)for(let x=6;x<250;x+=12){
      if(inside(x-4,y-4)&&inside(x+5,y-4)&&inside(x-4,y+5)&&inside(x+5,y+5))
        result+=`<path d="M${x-4} ${y+3}v-4h2v-3h5v3h2v4z" fill="#88c267"/><path d="M${x-2} ${y-3}h4v2h-4z" fill="#a4d078"/><path d="M${x-4} ${y+4}h9v2h-9z" fill="#64a95d"/>`;
    }
    return result;
  }).join('');
}
/** These lines represent existing project connections, not the complete original route network. */
export function atlasSvg(region:string,edges:readonly (readonly string[])[]):string {
  const atlas=REGION_ATLASES[region];
  const terrain=atlas.land.map(p=>polygon(p,'#99ce66','#398f81',6)+polygon(p,'#99ce66','#d6dc83',2)).join('');
  const hills=atlas.hills.map(p=>polygon(p,'#73b65d','#b4d575',4)).join('')+relief(atlas.hills);
  const water=(atlas.water??[]).map(p=>polygon(p,'#40b9c4','#d2e08f',3)).join('');
  const snow=(atlas.snow??[]).map(p=>polygon(p,'#e0eedb','#b9d9c5',2)).join('');
  const routes=edges.filter(([a,b])=>atlas.points[a.replace(/^tour_/,'')]&&atlas.points[b.replace(/^tour_/,'')]).map(([a,b])=>{
    const [x,y]=atlasPoint(region,a),[u,v]=atlasPoint(region,b);
    const sea=/cinnabar|cianwood/.test(a+b)||(region==='하나'&&/castelia/.test(a+b)&&/aspertia|virbank/.test(a+b));
    // Bend each corridor on the atlas grid; runtime pathfinding still uses actual maps.
    const mid=Math.round((x+u)/4)*2;
    const d=x===u||y===v?`M${x} ${y}H${u}V${v}`:`M${x} ${y}H${mid}V${v}H${u}`;
    return `<path d="${d}" fill="none" stroke="${sea?'#6dd4dd':'#dfac4d'}" stroke-width="7"/><path d="${d}" fill="none" stroke="${sea?'#b8eef0':'#ffe484'}" stroke-width="3"${sea?' stroke-dasharray="4 3"':''}/>`;
  }).join('');
  const desert=region==='하나'?polygon('120,112 152,112 152,136 124,136 124,128 118,128','#e7d17b','#f3e5a2',2):'';
  return `<svg class="tour-atlas-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 192" shape-rendering="crispEdges" aria-hidden="true"><rect width="256" height="192" fill="#239fad"/><path d="M0 24H256M0 56H256M0 88H256M0 120H256M0 152H256M0 184H256" stroke="#3ab1bb" stroke-width="1" opacity=".45"/>${terrain}${hills}${snow}${water}${desert}${routes}<g fill="#b7e6de"><path d="M238 178v-10h-3l5-7 5 7h-3v10z"/></g></svg>`;
}
