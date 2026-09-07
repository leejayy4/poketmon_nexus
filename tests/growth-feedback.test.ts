import test from 'node:test';
import assert from 'node:assert/strict';
import { Renderer } from '../src/renderer';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { createBattle,battleTurn } from '../src/battle';
import { gainExperience,maxHpAtLevel } from '../src/growth';

function painter(){
  const rectangles:{w:number;color:string}[]=[];
  const renderer=Object.create(Renderer.prototype) as Renderer;
  renderer.rect=(_c,_x,_y,w,_h,color)=>{rectangles.push({w,color});};
  return {renderer,rectangles,ctx:{} as CanvasRenderingContext2D};
}
function ready(){const save=newSave();grantPokemon(save,7);return save;}

test('HP danger colors include exact half and fifth boundaries; living 1 HP remains visible and fainted HP is empty',()=>{
  const {renderer,rectangles,ctx}=painter(),p=ready().party[0];
  p.maxHp=80;
  for(const [hp,color] of [[41,'#64ad73'],[40,'#cfaa45'],[17,'#cfaa45'],[16,'#cc595b'],[1,'#cc595b'],[0,'#cc595b']] as const){
    rectangles.length=0;p.hp=hp;renderer.hp(ctx,0,0,60,p);
    assert.equal(rectangles[2].color,color);
    assert.equal(rectangles[2].w>0,hp>0);
    assert(rectangles[2].w<=58);
  }
});

test('victory bar follows level-local experience through level-up and validated save restoration',()=>{
  const save=ready(),p=save.party[0];p.experience=40;
  const {renderer,rectangles,ctx}=painter();
  renderer.experience(ctx,0,0,102,p);assert.equal(rectangles[2].w,80);
  const battle=createBattle(save);battle.enemy.hp=1;
  const turn=battleTurn(save,battle,'move0');
  assert.equal(turn.outcome,'won');assert.equal(p.level,6);assert.equal(p.experience,20);
  assert.equal(p.maxHp,23);assert(turn.pages.some(page=>page.includes('レベル')||page.includes('레벨')));
  const loaded=parseSave(JSON.stringify(save));assert(loaded);
  rectangles.length=0;renderer.experience(ctx,0,0,102,loaded.party[0]);
  assert.equal(rectangles[2].w,33);assert.equal(rectangles[2].color,'#599ecb');
});

test('reaching the current growth cap displays a full distinct bar even though saved experience resets to zero',()=>{
  const save=ready(),p=save.party[0];p.level=24;p.maxHp=maxHpAtLevel(7,24);p.hp=p.maxHp;p.experience=230;
  gainExperience(p,30);assert.equal(p.level,25);assert.equal(p.experience,0);
  const loaded=parseSave(JSON.stringify(save));assert(loaded);
  const {renderer,rectangles,ctx}=painter();renderer.experience(ctx,0,0,102,loaded.party[0]);
  assert.equal(rectangles[2].w,100);assert.equal(rectangles[2].color,'#a69b6a');
});
