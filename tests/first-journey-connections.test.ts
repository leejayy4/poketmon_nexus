import test from 'node:test';
import assert from 'node:assert/strict';
import { MAPS,getMap,canEnter,canStand } from '../src/maps';
import { createUnifiedWorld } from '../src/unified-world';
import type { MapId,Warp } from '../src/types';

// Prepared for QA resumption; adding this file does not establish playthrough evidence.
const departureFlags={departureCleared:true};
const steps={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};

function connection(from:MapId,expected:Warp){
  const map=getMap(from,departureFlags);
  const actual=map.warps.find(w=>w.x===expected.x&&w.y===expected.y&&w.entry===expected.entry);
  assert.deepEqual(actual,expected,`${from} to ${expected.to}`);
  const step=steps[expected.entry];
  assert(canStand(map,expected.x-step.x,expected.y-step.y),`${from} approach`);
  assert(canEnter(map,expected.x,expected.y,expected.entry),`${from} doorway`);
  const destination=getMap(expected.to,departureFlags);
  assert(canStand(destination,expected.spawn.x,expected.spawn.y),`${expected.to} arrival`);
  assert(!destination.warps.some(w=>w.x===expected.spawn.x&&w.y===expected.spawn.y),`${expected.to} arrival is clear of doorways`);
}

test('the active first journey retains the authored Verity branch and both lake returns',()=>{
  connection('tour_sinnoh_route_201',{x:10,y:5,to:'tour_verity_lakefront',spawn:{x:20,y:35},entry:'up',facing:'up'});
  connection('tour_verity_lakefront',{x:20,y:38,to:'tour_sinnoh_route_201',spawn:{x:10,y:7},entry:'down',facing:'down'});
  connection('tour_verity_lakefront',{x:20,y:7,to:'tour_lake_verity',spawn:{x:28,y:44},entry:'up',facing:'up'});
  connection('tour_lake_verity',{x:28,y:46,to:'tour_verity_lakefront',spawn:{x:20,y:9},entry:'down',facing:'down'});
});

test('Sandgem keeps its center and research lab round trips alongside the two roads',()=>{
  connection('tour_sandgem',{x:9,y:11,to:'tour_sandgem_center',spawn:{x:10,y:12},entry:'up',facing:'up'});
  connection('tour_sandgem_center',{x:10,y:15,to:'tour_sandgem',spawn:{x:9,y:12},entry:'down',facing:'down'});
  connection('tour_sandgem',{x:29,y:13,to:'tour_sandgem_lab',spawn:{x:12,y:14},entry:'up',facing:'up'});
  connection('tour_sandgem_lab',{x:12,y:17,to:'tour_sandgem',spawn:{x:29,y:14},entry:'down',facing:'down'});
  connection('tour_sandgem',{x:2,y:18,to:'tour_sinnoh_route_201',spawn:{x:60,y:11},entry:'left',facing:'left'});
  connection('tour_sandgem',{x:20,y:1,to:'tour_sinnoh_route_202',spawn:{x:14,y:61},entry:'up',facing:'up'});
  connection('tour_sinnoh_route_201',{x:62,y:11,to:'tour_sandgem',spawn:{x:3,y:18},entry:'right',facing:'right'});
  connection('tour_sinnoh_route_202',{x:14,y:62,to:'tour_sandgem',spawn:{x:20,y:3},entry:'down',facing:'down'});
});

test('journey assembly updates an existing trunk endpoint without losing an unrelated authored exit or mutating the source',()=>{
  const authored=structuredClone(MAPS.tour_sinnoh_route_202);
  const branch:Warp={x:10,y:20,to:'tour_verity_lakefront',spawn:{x:20,y:35},entry:'left',facing:'left'};
  authored.warps.push(branch,{x:14,y:1,to:'town',spawn:{x:3,y:15},entry:'up',facing:'up'});
  const before=structuredClone(authored);
  const unified=createUnifiedWorld({...MAPS,tour_sinnoh_route_202:authored});
  const warps=unified.tour_sinnoh_route_202!.warps;
  assert.deepEqual(warps.find(w=>w.x===branch.x&&w.y===branch.y),branch);
  const north=warps.filter(w=>w.x===14&&w.y===1&&w.entry==='up');
  assert.equal(north.length,1);
  assert.deepEqual(north[0],{x:14,y:1,to:'tour_jubilife',spawn:{x:14,y:33},entry:'up',facing:'up'});
  assert.deepEqual(authored,before);
});
