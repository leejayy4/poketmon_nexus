import test from 'node:test';
import assert from 'node:assert/strict';
import {paintMoveTechnique, MOVE_TECHNIQUE_SECONDS, moveTechniqueStyle, type MoveTechnique} from '../src/move-art';
import {SPECIES} from '../src/pokemon';

const moves=['불꽃세례','물대포','덩굴채찍','매지컬리프','흡수','전기쇼크','돌떨구기','놀래키기','핥기','염동력','태권당수','발경','할퀴기','날개치기','전광석화','방어','울음소리','꼬리흔들기','몸통박치기','박치기'];
function record(technique:MoveTechnique,elapsed:number){
  const pixels:{x:number;y:number;w:number;h:number;color:string;alpha:number}[]=[];
  const stack:{fillStyle:string;globalAlpha:number;imageSmoothingEnabled:boolean}[]=[];
  let saves=0,restores=0;
  const context={fillStyle:'#123456',globalAlpha:.8,imageSmoothingEnabled:true,
    save(){saves++;stack.push({fillStyle:this.fillStyle,globalAlpha:this.globalAlpha,imageSmoothingEnabled:this.imageSmoothingEnabled});},
    restore(){restores++;Object.assign(this,stack.pop());},
    fillRect(x:number,y:number,w:number,h:number){pixels.push({x,y,w,h,color:this.fillStyle,alpha:this.globalAlpha});},
  };
  paintMoveTechnique(context as unknown as CanvasRenderingContext2D,technique,elapsed);
  return {pixels,context,saves,restores};
}

test('techniques stop at .7 seconds and reject invalid clocks without touching Canvas',()=>{
  assert.equal(MOVE_TECHNIQUE_SECONDS,.7);
  for(const elapsed of [-1,NaN,Infinity,-Infinity,.7,1,100]){
    const r=record({move:'불꽃세례',target:'enemy'},elapsed);
    assert.equal(r.pixels.length,0);assert.equal(r.saves,0);assert.equal(r.restores,0);
  }
  assert.ok(record({move:'불꽃세례',target:'enemy'},0).pixels.length);
  assert.ok(record({move:'불꽃세례',target:'enemy'},.699).pixels.length);
});

test('all effects are deterministic integer pixels within the arena and restore caller state',()=>{
  for(const move of moves)for(const target of ['enemy','player'] as const)for(const elapsed of [0,.07,.23,.41,.59,.699]){
    const technique=Object.freeze({move,target}),r=record(technique,elapsed);
    assert.deepEqual(r.pixels,record(technique,elapsed).pixels,move);
    assert.ok(r.pixels.length>0&&r.pixels.length<2500,`${move}: bounded draw calls`);
    for(const {x,y,w,h,alpha} of r.pixels){
      assert.ok([x,y,w,h].every(Number.isInteger),move);
      assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=256&&y+h<=144,move);
      assert.ok(alpha>0&&alpha<=1,move);
    }
    assert.equal(r.saves,1);assert.equal(r.restores,1);
    assert.equal(r.context.fillStyle,'#123456');assert.equal(r.context.globalAlpha,.8);assert.equal(r.context.imageSmoothingEnabled,true);
  }
});

test('requested techniques have distinct geometry, not only a changed palette',()=>{
  const signatures=moves.map(move=>JSON.stringify(record({move,target:'enemy'},.32).pixels.map(({x,y,w,h})=>[x,y,w,h])));
  assert.equal(new Set(signatures).size,moves.length);
  assert.notDeepEqual(record({move:'매지컬리프',target:'enemy'},.32).pixels,record({move:'잎날가르기',target:'enemy'},.32).pixels);
});

test('attacks travel in both directions and finish at the specified sprite, defense surrounds its user',()=>{
  for(const [target,cx,cy] of [['enemy',196,58],['player',64,103]] as const){
    for(const move of ['물대포','불꽃세례','전광석화','방어','몸통박치기']){
      const {pixels}=record({move,target},.42);
      assert.ok(pixels.some(p=>Math.abs(p.x-cx)<8&&Math.abs(p.y-cy)<22),`${move} ${target}`);
    }
    const shield=record({move:'방어',target},.2).pixels;
    assert.ok(shield.every(p=>Math.abs(p.x-cx)<=23&&Math.abs(p.y-cy)<=23));
  }
  for(const move of ['물대포','전광석화','덩굴채찍']){
    assert.notDeepEqual(record({move,target:'enemy'},.04).pixels,record({move,target:'enemy'},.4).pixels);
  }
});

test('current named techniques are covered and unknown future moves get a safe impact',()=>{
  for(const species of Object.values(SPECIES))for(const move of species.moves){
    assert.ok(record({move,target:'player'},.2).pixels.length,move);
  }
  assert.equal(moveTechniqueStyle('미등록기술'),'impact');
  assert.equal(moveTechniqueStyle('constructor'),'impact');
  assert.deepEqual(record({move:'미등록기술',target:'enemy'},.2).pixels,record({move:'몸통박치기',target:'enemy'},.2).pixels);
});

test('even a Canvas drawing error restores the caller context',()=>{
  let restores=0;
  const context={save(){},restore(){restores++;},fillRect(){throw new Error('drawing interrupted');}};
  assert.throws(()=>paintMoveTechnique(context as unknown as CanvasRenderingContext2D,{move:'방어',target:'player'},.2),/drawing interrupted/);
  assert.equal(restores,1);
});
