import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';

test('options and header sound toggles keep visible and accessible labels in sync',t=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');
  const attributes:Record<string,string>={},button={textContent:'소리 OFF',setAttribute(key:string,value:string){attributes[key]=value;}};
  Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:(id:string)=>id==='sound'?button:null}});
  try{
    const g=new Engine(),save=structuredClone(g.save);let enabled=false;
    t.mock.method(g.audio,'toggle',()=>enabled=!enabled);
    g.selectOption(1);assert.equal(button.textContent,'소리 ON');assert.equal(attributes['aria-label'],'소리 끄기');
    assert.equal(g.toggleSound(),false);assert.equal(button.textContent,'소리 OFF');assert.equal(attributes['aria-label'],'소리 켜기');
    g.toggleSound();g.selectOption(1);assert.equal(button.textContent,'소리 OFF');assert.equal(attributes['aria-label'],'소리 켜기');assert.deepEqual(g.save,save);
  }finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}
});
