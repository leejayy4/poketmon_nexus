import assert from 'node:assert/strict';
import test from 'node:test';
import {withParticle} from '../src/korean-text';

test('selects the standard Korean particle for final consonants and vowels',()=>{
  assert.equal(withParticle('꼬마돌','은/는'),'꼬마돌은');
  assert.equal(withParticle('비버니','이/가'),'비버니가');
  assert.equal(withParticle('꼬마돌','을/를'),'꼬마돌을');
  assert.equal(withParticle('비버니','과/와'),'비버니와');
});

test('uses 로 after a vowel or rieul and 으로 after other final consonants',()=>{
  assert.equal(withParticle('피카츄','으로/로'),'피카츄로');
  assert.equal(withParticle('달','으로/로'),'달로');
  assert.equal(withParticle('밥','으로/로'),'밥으로');
});

test('uses the explicit no-final fallback for unsupported endings',()=>{
  assert.equal(withParticle('Pikachu','은/는'),'Pikachu는');
  assert.equal(withParticle('123','으로/로'),'123로');
  assert.equal(withParticle('','이/가'),'가');
});
