import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {passageSignPages} from '../src/encounter-guidance';
import {handleRoadTrainer} from '../src/road-trainers';
import {newSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';

test('cave arena is selected by actual location without changing the outdoor arena',()=>{
 const g=new Engine(),colors:string[]=[],state={fillStyle:''};
 const ctx=new Proxy(state,{get:(t,k)=>k==='fillStyle'?t.fillStyle:k==='fillRect'?()=>colors.push(t.fillStyle):()=>{}}) as CanvasRenderingContext2D;
 const canvas={getContext:()=>ctx} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);
 g.save.map='tour_pass_jubilife_oreburgh';const before=structuredClone(g.save);r.battleArena(ctx);assert(!colors.includes('#f3f3dc'));assert(!colors.includes('#e7edd5'));assert.deepEqual(g.save,before);
 colors.length=0;g.save.map='route_s01';r.battleArena(ctx);assert(colors.includes('#f3f3dc'));assert(colors.includes('#e7edd5'));
});
test('cave sign and trainer help explain gravel encounters and safe passage',()=>{
 const pages=passageSignPages('tour_pass_jubilife_oreburgh','축복','무쇠');assert.match(pages.join(''),/자갈밭/);assert.match(pages.join(''),/안전/);
 const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.map='tour_pass_jubilife_oreburgh';g.announce=()=>{};const before=structuredClone(g.save);
 handleRoadTrainer(g,'journeyWalker');const c=g.dialogue!.choices!.find(c=>c.label==='도움말을 듣는다')!;g.dialogue=null;c.action();assert.match(g.dialogue!.pages.join(''),/자갈밭/);assert.doesNotMatch(g.dialogue!.pages.join(''),/풀밭/);assert.deepEqual(g.save,before);
});
