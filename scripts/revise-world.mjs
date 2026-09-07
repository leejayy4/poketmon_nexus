import fs from 'node:fs/promises';
let s=await fs.readFile('src/renderer.ts','utf8');
s=s.replace("import type { Direction, Pokemon } from './types';","import type { Direction, Pokemon } from './types';\nimport { buildTownArt,paintTallGrass,TOWN_GRASS } from './town';\nimport { spriteFrame,recolorSprite } from './sprites';");
s=s.replace('images:Record<string,HTMLImageElement>','images:Record<string,HTMLImageElement|HTMLCanvasElement>');
s=s.replace("'middle_aged_man',...Object.keys", "'middle_aged_man','ace_trainer_m','ace_trainer_f','scientist_f','pokemon_breeder_f','worker','rancher','school_kid_m','school_kid_f',...Object.keys");
s=s.replace("await document.fonts.load('10px Galmuri');}",`await document.fonts.load('10px Galmuri');
+    this.images.hero=recolorSprite(this.images.ace_trainer_m as HTMLImageElement,{'637b4a':'4a627b','425239':'303e53','8ca563':'7894a5','9c5a63':'b57947','de8c73':'ebba73','4a3139':'493e38'});
+    this.images.professor=recolorSprite(this.images.scientist_f as HTMLImageElement,{'525a52':'696078','848c6b':'aaa0b1','313139':'40384d','c66b52':'579e96'});
+    this.images.mother=recolorSprite(this.images.pokemon_breeder_f as HTMLImageElement,{'42735a':'706492','52a584':'9b8bbb','294a4a':'453d65'});
+    this.images.gardener=recolorSprite(this.images.ace_trainer_f as HTMLImageElement,{'637b4a':'735544','425239':'493c36','8ca563':'af8660'});
+    this.images.town=buildTownArt(this.images);
+  }`.replaceAll('\n+','\n'));
const start=s.indexOf("    if(map.id==='town'){");const end=s.indexOf('    const characters=',start);
s=s.slice(0,start)+`    if(map.id==='town')for(let k=0;k<4;k++){this.rect(c,465+((k*19+Math.floor(g.clock*3))%78),237+(k%2)*17,7,1,'#a3d9ed')}
`+s.slice(end);
s=s.replace("sprite:'player_m',player:true","sprite:'hero',player:true");
s=s.replace("    c.restore();\n    if(g.labelTime",`    if(map.id==='town')for(let y=TOWN_GRASS.y;y<TOWN_GRASS.y+TOWN_GRASS.h;y++)for(let x=TOWN_GRASS.x;x<TOWN_GRASS.x+TOWN_GRASS.w;x++)paintTallGrass(c,x*16,y*16,true,g.clock*2+x);
    c.restore();
    if(g.labelTime`);
const cs=s.indexOf('  character(c:'); const ce=s.indexOf('  labTable(',cs);
s=s.slice(0,cs)+`  character(c:CanvasRenderingContext2D,name:string,x:number,y:number,dir:Direction,moving:boolean){const g=this.game,image=this.images[name];const frame=spriteFrame(dir,moving,g.stepPhase,g.move?g.move.elapsed/g.move.duration:0,g.keys.has('Shift'),image.height/32);c.fillStyle='#293d393d';c.beginPath();c.ellipse(Math.round(x),Math.round(y-2),6,2,0,0,Math.PI*2);c.fill();c.drawImage(image,0,frame*32,32,32,Math.round(x-16),Math.round(y-30),32,32)}
`+s.slice(ce);
s=s.replace("this.character(c,'player_m',211","this.character(c,'hero',211");
await fs.writeFile('src/renderer.ts',s);
s=await fs.readFile('src/engine.ts','utf8');s=s.replaceAll('마박사','은솔박사').replace('집을 나가서 오른쪽 위로 가 보렴.','집 앞길을 따라 위쪽으로 가 보렴.');
// A quick tap must be consumed on keydown, not lost between animation frames.
s=s.replace("if(direction&&this.locked){this.navigate(direction);return}","if(direction){if(this.locked)this.navigate(direction);else this.walk(direction);return}");
s=s.replace("warps:this.map.warps},position", "warps:this.map.warps,terrain:this.map.terrain??[]},position");
await fs.writeFile('src/engine.ts',s);
s=await fs.readFile('src/dialogues.ts','utf8');s=s.replace("speaker:'마을 소녀'","speaker:'정원사 소윤'").replace('마을 오른쪽 위의 파란 지붕이야!','꽃섬 왼쪽 위의 파란 지붕이야!').replace("speaker:'산책하는 소년'","speaker:'산책하는 민우'").replace('이 마을은 작지만 참 좋아.\\n천천히 구석구석 둘러봐!','이 작은 풀밭, 기분 좋지 않아?\\n지금은 조용히 바람만 불고 있어.').replace("speaker:'할아버지'","speaker:'연못지기'").replace("speaker:'이웃 아저씨'","speaker:'이웃 도윤'").replace('↗ 포켓몬 연구소\\n↘ 우리 집','↖ 포켓몬 연구소 · ↙ 우리 집\\n↗ 작은 풀밭 · → 연못').replace('연구소는 우리 집에서\\n오른쪽으로 가면 있단다.','꽃섬을 지나 왼쪽 위로 가면\\n파란 지붕의 연구소가 보일 거야.').replace("speaker:'책 읽는 소년'","speaker:'책 읽는 소녀'");await fs.writeFile('src/dialogues.ts',s);
