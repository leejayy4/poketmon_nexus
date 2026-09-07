import fs from 'node:fs/promises';
const names=['ace_trainer_m','ace_trainer_f','scientist_f','pokemon_breeder_f','worker','rancher','school_kid_m','school_kid_f','camper'];
await Promise.all(names.map(async n=>{const r=await fetch('https://raw.githubusercontent.com/pret/pokeplatinum/main/res/graphics/field_sprites/npc/'+n+'.png');if(!r.ok)throw Error(n);await fs.writeFile('public/assets/'+n+'.png',Buffer.from(await r.arrayBuffer()))}));
const sharp=(await import('sharp')).default;
const cells=[];for(let i=0;i<32;i++)cells.push({input:await sharp('public/assets/player_m.png').extract({left:0,top:i*32,width:32,height:32}).resize(96,96,{kernel:'nearest'}).png().toBuffer(),left:(i%8)*96,top:Math.floor(i/8)*112});
await sharp({create:{width:768,height:448,channels:4,background:'#d8decf'}}).composite(cells).png().toFile('scripts/player-frames.png');
const people=[];for(let i=0;i<names.length;i++)people.push({input:await sharp('public/assets/'+names[i]+'.png').extract({left:0,top:0,width:32,height:64}).resize(96,192,{kernel:'nearest'}).png().toBuffer(),left:i*96,top:0});
await sharp({create:{width:names.length*96,height:192,channels:4,background:'#d8decf'}}).composite(people).png().toFile('scripts/people-preview.png');
