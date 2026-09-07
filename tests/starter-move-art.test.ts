import test from 'node:test';
import assert from 'node:assert/strict';
import {paintMoveTechnique, type MoveTechnique} from '../src/move-art';
import {Renderer} from '../src/renderer';
import {starterPresentation} from '../src/starter-presentation';
import type {BattleFrame} from '../src/battle';

function pixels(move:string,time:number,target:MoveTechnique['target']='enemy',enabled=true){
  const out:{x:number;y:number;w:number;h:number;color:string}[]=[];
  const stack:any[]=[];
  const c={fillStyle:'original',globalAlpha:.4,imageSmoothingEnabled:true,
    save(){stack.push([this.fillStyle,this.globalAlpha,this.imageSmoothingEnabled]);},
    restore(){[this.fillStyle,this.globalAlpha,this.imageSmoothingEnabled]=stack.pop();},
    fillRect(x:number,y:number,w:number,h:number){out.push({x,y,w,h,color:this.fillStyle});}};
  paintMoveTechnique(c as unknown as CanvasRenderingContext2D,{move,target},time,enabled);
  assert.deepEqual([c.fillStyle,c.globalAlpha,c.imageSmoothingEnabled],['original',.4,true]);
  assert.equal(stack.length,0);
  return out;
}
const moves=['불꽃세례','물대포','덩굴채찍'];
test('starter declaration boundaries stay deterministic, clipped and restore Canvas',()=>{
  for(const move of moves)for(const target of ['enemy','player'] as const){
    for(const t of [-1,NaN,Infinity,.9,1])assert.equal(pixels(move,t,target).length,0);
    for(const t of [0,.149,.15,.4,.649,.65,.899]){
      const p=pixels(move,t,target);assert.ok(p.length);
      assert.deepEqual(p,pixels(move,t,target));
      for(const r of p){assert.ok([r.x,r.y,r.w,r.h].every(Number.isInteger));assert.ok(r.x>=0&&r.y>=0&&r.x+r.w<=256&&r.y+r.h<=144);}
    }
    assert.notDeepEqual(pixels(move,.14,target),pixels(move,.4,target));
    assert.notDeepEqual(pixels(move,.4,target),pixels(move,.8,target));
  }
});
test('projectiles leave the attacker toward either target and have distinct shapes',()=>{
  for(const target of ['enemy','player'] as const){
    const direction=target==='enemy'?1:-1;
    for(const move of moves.slice(0,2)){
      const mean=(t:number)=>{const p=pixels(move,t,target);return p.reduce((n,r)=>n+r.x,0)/p.length;};
      assert.ok((mean(.6)-mean(.2))*direction>60);
    }
    const signatures=moves.map(move=>JSON.stringify(pixels(move,.4,target).map(({x,y,w,h})=>[x,y,w,h])));
    assert.equal(new Set(signatures).size,3);
  }
  for(const move of ['화염방사','거품','몸통박치기'])for(const t of [.2,.69,.7,.8])assert.deepEqual(pixels(move,t),pixels(move,t,'enemy',false));
});
test('starter Canvas state restores even if drawing throws',()=>{
  let restored=0;
  const c={save(){},restore(){restored++;},fillRect(){throw Error('draw failure');}};
  assert.throws(()=>paintMoveTechnique(c as any,{move:'물대포',target:'enemy'},.3,true),/draw failure/);
  assert.equal(restored,1);
});
test('battleTop keeps a zero HP target visible, uses shown HP and stops recoil during HP phase',()=>{
  for(const target of ['enemy','player'] as const){
    const mon={species:7,hp:20,maxHp:20,level:5,experience:0};
    const previous={enemy:{...mon},player:{...mon},enemyIndex:0,active:0,enemyAttackDrop:0,enemyDefenseDrop:0,technique:{move:'물대포',target}} as BattleFrame;
    const raw=structuredClone(previous);delete raw.technique;raw[target].hp=0;raw.effect={target,kind:'damage',amount:20};
    for(const time of [.04,.4,.65]){
      const presentation=starterPresentation(raw,previous,time)!;
      const drawn:{side:string;x:number}[]=[],hp:number[]=[];
      const context={drawImage(_image:unknown,x:number){drawn.push({side:'player',x});}};
      const renderer=Object.create(Renderer.prototype);
      renderer.game={battlePresentation:presentation,battleFrame:raw,presentedBattle:{active:0,enemy:raw.enemy},save:{party:[raw.player]},dialogue:{},dialogueElapsed:time,battleEffect:{target,recoil:9},captureMotion:null};
      renderer.images={'pokemon-back-7':{}};
      renderer.battleArena=()=>{};renderer.pokemon=(_c:unknown,_s:number,x:number)=>drawn.push({side:'enemy',x});
      renderer.hp=(_c:unknown,_x:number,_y:number,_w:number,p:{hp:number})=>hp.push(p.hp);
      for(const name of ['rect','frame','text','experience'])renderer[name]=()=>{};
      renderer.battleTop(context);
      assert.equal(drawn.length,2,'lethal damage does not prematurely remove the sprite');
      assert.deepEqual(hp,[presentation.frame.enemy.hp,presentation.frame.player.hp]);
      const affected=drawn.find(p=>p.side===target)!;
      if(time>=.15)assert.equal(affected.x,target==='enemy'?155:20,'HP phase has no lingering recoil');
      else assert.notEqual(affected.x,target==='enemy'?155:20);
    }
    assert.equal(raw[target].hp,0,'display did not mutate committed frame');
  }
});
