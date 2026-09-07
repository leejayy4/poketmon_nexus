"""Export the deliberately limited playable roster from design DB + pinned CSVs.

Run: python -X utf8 scripts/design/export-runtime-pokemon.py [--assets]
Acquisition levels use Platinum; power/type values use the existing DB snapshot.
No chapter locks, night clock, fishing or unreleased evolution rules are inferred.
"""
import csv
import hashlib
import json
import pathlib
import sys
import tempfile
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
DB = ROOT / 'docs/design-data'
SHA = json.loads((DB / 'nexus-plan.json').read_text(encoding='utf8'))['referenceCommit']
CACHE = pathlib.Path(tempfile.gettempdir()) / ('nexus-pokeapi-' + SHA)
CACHE.mkdir(exist_ok=True)
SPRITE_SHA = '6e523c72bb714306c90912647e0b2ccc4fd2fff1'

def rows(name):
    path = CACHE / (name + '.csv')
    if not path.exists():
        path.write_bytes(urllib.request.urlopen(f'https://raw.githubusercontent.com/PokeAPI/pokeapi/{SHA}/data/v2/csv/{name}.csv', timeout=60).read())
    with path.open(encoding='utf8', newline='') as stream:
        yield from csv.DictReader(stream)

def read(name):
    return json.loads((DB / (name + '.json')).read_text(encoding='utf8'))

pools = [{k:r[k] for k in ('id','node','levels','method','condition')} | {'slots':[{k:s[k] for k in ('speciesId','weight')} for s in r['slots']]} for r in read('encounters') if r['id'] in ['ENC-001','ENC-002','ENC-003','ENC-004','ENC-016']]
owned = sorted({1,2,4,5,7,8,25} | {s['speciesId'] for p in pools for s in p['slots']})
ids = set(owned) | {420,315,425,92,200,448,408}
names = {int(r['move_id']):r['name'] for r in rows('move_names') if r['local_language_id']=='3'}
types = {int(r['type_id']):r['name'] for r in rows('type_names') if r['local_language_id']=='3'}
# Every exposed move has a runtime rule. Secondary status chances, crits, PP and
# accuracy are intentionally not simulated; these damage moves use direct damage.
damage = set('pound karate-chop gust wing-attack slam headbutt tackle scratch vine-whip bite ember water-gun bubble razor-leaf thunder-shock confusion quick-attack rock-throw slash spark astonish lick magical-leaf force-palm aerial-ace air-cutter bug-bite hyper-fang rapid-spin water-pulse shadow-ball'.split())
rules = {s:'damage' for s in damage}
rules.update({s:'drain' for s in ['absorb','mega-drain','leech-life','drain-punch']})
rules.update({'growl':'attackDrop','charm':'attackDrop','tail-whip':'defenseDrop','leer':'defenseDrop','harden':'defenseUp','withdraw':'defenseUp','defense-curl':'defenseUp','protect':'protect','detect':'protect','teleport':'escape','splash':'nothing','stealth-rock':'hazard','grass-knot':'weightDamage','low-kick':'weightDamage','struggle':'struggle','dragon-rage':'fixedDamage','seismic-toss':'levelDamage'})
move_rows = {int(r['id']):r for r in rows('moves') if r['identifier'] in rules}
moves = {names[i]:{'id':i,'slug':r['identifier'],'type':types[int(r['type_id'])],'power':int(r['power'] or 0),'priority':int(r['priority']),'rule':rules[r['identifier']]} for i,r in move_rows.items()}
learn = {i:[] for i in ids}
tm = {i:[] for i in ids}
tm_slugs = {'stealth-rock','grass-knot','shadow-ball','drain-punch'}
for r in rows('pokemon_moves'):
    i, m = int(r['pokemon_id']), int(r['move_id'])
    if i not in ids or r['version_group_id']!='9' or m not in move_rows:
        continue
    if r['pokemon_move_method_id']=='1' and int(r['level'])<=25:
        entry = {'level':int(r['level']), 'move':names[m]}
        if entry not in learn[i]: learn[i].append(entry)
    if r['pokemon_move_method_id']=='4' and move_rows[m]['identifier'] in tm_slugs:
        if names[m] not in tm[i]: tm[i].append(names[m])
species = {}
weights = {int(r['id']):int(r['weight']) for r in rows('pokemon') if r['is_default']=='1'}
for p in read('pokemon'):
    i=p['nationalId']
    if i in ids:
        species[i] = {k:p[k] for k in ('name','types','stats') } | {'weight':weights[i], 'learnset':sorted(learn[i],key=lambda r:(r['level'],r['move'])), 'tm':sorted(tm[i])}
evolutions = [{'from':r['from'],'to':r['to'],'level':int(r['sourceRule']['minimum_level'])} for r in read('evolutions') if (r['from'],r['to']) in [(1,2),(4,5),(7,8)]]
chart = {}
for r in rows('type_efficacy'):
    a,b=int(r['damage_type_id']),int(r['target_type_id'])
    if a in types and b in types and int(r['damage_factor'])!=100:
        chart.setdefault(types[a],{})[types[b]]=int(r['damage_factor'])/100
out = {'referenceCommit':SHA,'learnsetVersion':'platinum','timePolicy':'day-only','limits':'Two selected moves; direct damage ignores secondary effects, accuracy and PP. Modern snapshot powers with Platinum acquisition. Struggle is the explicit fallback when no supported damaging move exists. Only first starter evolutions enabled.','pools':pools,'ownable':owned,'species':species,'moves':moves,'evolutions':evolutions,'typeChart':chart}
(ROOT/'src/runtime-pokemon-data.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
manifest={'dataCommit':SHA,'learnsetVersionGroup':9,'sources':[],'sprites':[]}
for name in ['pokemon_moves','moves','move_names','type_names','type_efficacy','pokemon']:
    path=CACHE/(name+'.csv')
    manifest['sources'].append({'file':name+'.csv','url':f'https://raw.githubusercontent.com/PokeAPI/pokeapi/{SHA}/data/v2/csv/{name}.csv','sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
for name in ['encounters','pokemon','evolutions']:
    manifest['sources'].append({'file':'docs/design-data/'+name+'.json','sha256':hashlib.sha256((DB/(name+'.json')).read_bytes()).hexdigest()})
if '--assets' in sys.argv:
    import concurrent.futures
    def sprite(job):
        i,back=job
        filename=f'pokemon-{"back-" if back else ""}{i}.png'
        url=f'https://raw.githubusercontent.com/PokeAPI/sprites/{SPRITE_SHA}/sprites/pokemon/versions/generation-iv/platinum/{"back/" if back else ""}{i}.png'
        path=ROOT/'public/assets'/filename
        # Existing assets belong to earlier work; retain them verbatim.
        if not path.exists(): path.write_bytes(urllib.request.urlopen(url,timeout=60).read())
        return {'file':filename,'url':url,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'processing':'Original PNG, existing assets preserved; see sources.json for preexisting artwork.'}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        manifest['sprites']=list(executor.map(sprite,[(i,b) for i in sorted(ids) for b in [False,True]]))
else:
    old=ROOT/'public/assets/pokemon-runtime-sources.json'
    if old.exists(): manifest['sprites']=json.loads(old.read_text(encoding='utf8'))['sprites']
(ROOT/'public/assets/pokemon-runtime-sources.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(f'Exported {len(owned)} ownable species, {len(pools)} pools, {len(moves)} supported moves.')
