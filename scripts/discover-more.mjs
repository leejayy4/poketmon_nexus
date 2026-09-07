import fs from 'node:fs/promises';
const tree=JSON.parse(await fs.readFile('scripts/platinum-tree.json','utf8')).tree;
console.log(tree.filter(x=>/field_sprites\/player|field_sprites\/npc\/scientist|field_sprites\/npc\/youngster/.test(x.path)).map(x=>x.path).join('\n'));
const res=await fetch('https://api.github.com/repos/ICEREG1992/pkmnmap4/git/trees/main?recursive=1'); const j=await res.json(); await fs.writeFile('scripts/maps-tree.json',JSON.stringify(j)); console.log((j.tree||[]).filter(x=>/maps\/|Twinleaf|Sandgem|twinleaf|sandgem/.test(x.path)).map(x=>x.path).slice(0,160).join('\n'));
const h=await (await fetch('https://bulbapedia.bulbagarden.net/wiki/File:Twinleaf_Town_Pt.png')).text(); console.log([...h.matchAll(/(?:src|href)="([^"]+Twinleaf[^\"]+\.png[^"]*)"/g)].map(x=>x[1]).slice(0,12));
