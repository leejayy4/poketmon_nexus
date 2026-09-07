import fs from 'node:fs/promises';
const jobs=[['lab-reference.png','https://archives.bulbagarden.net/media/upload/c/c4/Rowan_Lab_DPPt.png']]; await Promise.all(jobs.map(async([n,u])=>{const r=await fetch(u);await fs.writeFile('public/assets/'+n,Buffer.from(await r.arrayBuffer()))}));
const h=await(await fetch('https://bulbapedia.bulbagarden.net/wiki/Player%27s_house')).text();console.log([...h.matchAll(/src="([^"]+\.png[^"]*)"/g)].map(x=>x[1]).filter(x=>/DPP|DP|Pt|Lucas|Sinnoh|2F/i.test(x)).slice(0,40));
