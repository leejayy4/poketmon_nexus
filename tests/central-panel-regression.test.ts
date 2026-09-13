import test from 'node:test';
import assert from 'node:assert/strict';
import { PLACES } from '../src/explore-world';
import { atlasPoint,atlasSvg } from '../src/region-atlas';
import { guardedPanelUpdate } from '../src/panel-update';
import { Engine } from '../src/engine';
import { newSave } from '../src/save';
import { neighborJourneyLabel } from '../src/neighbor-journey';

test('Fuchsia neighbor label includes the actual cycling-road journey',()=>{
  assert.equal(neighborJourneyLabel('tour_fuchsia','tour_celadon',{}),'← 무지개시티 · 경유: 관동 18번도로 → 관동 17번도로 → 관동 16번도로');
});

test('all selectable places in all four atlases have visible distinct coordinates',()=>{
  for(const region of ['신오','관동','성도','하나']){
    const occupied=new Set<string>();
    for(const place of PLACES.filter(p=>p.region===region)){
      const [x,y]=atlasPoint(region,place.id);
      assert(x>=0&&x<=256&&y>=0&&y<=192,place.id);
      assert(!occupied.has(`${x},${y}`),place.id);
      occupied.add(`${x},${y}`);
    }
    assert(atlasSvg(region,[]).includes('<svg'));
  }
});
test('developer panel exception is reported once and does not interrupt later game frames',()=>{
  let frames=0,reports=0,calls=0;
  const update=guardedPanelUpdate(()=>{calls++;throw Error('missing neighbor');},()=>reports++);
  for(let i=0;i<4;i++){update();frames++;}
  assert.equal(frames,4);assert.equal(reports,1);assert.equal(calls,1);
});
test('Route 202 entry completes the Jubilife fade and releases movement',()=>{
  const game=new Engine();game.save=newSave();
  game.save.map='tour_sinnoh_route_202';game.save.player={x:14,y:2,facing:'up'};
  game.walk('up');for(let i=0;i<30;i++)game.update(.04);
  assert.equal(game.save.map,'tour_jubilife');assert.equal(game.transition,0);assert.equal(game.locked,false);
  assert.equal(game.map.walkable[game.save.player.y]?.[game.save.player.x],'.');
});
