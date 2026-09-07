"""Build reviewable NEXUS design documents; never imports or edits game runtime.

Reference CSV files are cached by immutable PokeAPI commit in the OS temp directory.
Run from any directory: python -X utf8 scripts/design/build_databases.py
"""
from __future__ import annotations

import collections
import concurrent.futures
import csv
import datetime
import hashlib
import json
import pathlib
import re
import tempfile
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs'
OUT = DOCS / 'design-data'
PLAN = json.loads((OUT / 'nexus-plan.json').read_text(encoding='utf-8-sig'))
SHA = PLAN['referenceCommit']
CACHE = pathlib.Path(tempfile.gettempdir()) / ('nexus-pokeapi-' + SHA)
CACHE.mkdir(exist_ok=True)
FILES = '''pokemon_species pokemon_species_names pokemon pokemon_types type_names
pokemon_stats pokemon_abilities ability_names pokemon_evolution evolution_triggers
items item_names item_categories moves move_names versions version_groups locations
location_names location_areas encounters encounter_slots encounter_methods
encounter_condition_value_map encounter_condition_values languages pokemon_moves'''.split()


def fetch(name):
    dest = CACHE / (name + '.csv')
    if not dest.exists():
        url = f'https://raw.githubusercontent.com/PokeAPI/pokeapi/{SHA}/data/v2/csv/{name}.csv'
        dest.write_bytes(urllib.request.urlopen(url, timeout=45).read())
    return {'file': dest.name, 'sha256': hashlib.sha256(dest.read_bytes()).hexdigest(),
            'bytes': dest.stat().st_size}


with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    MANIFEST = list(pool.map(fetch, FILES))


def rows(name):
    with (CACHE / (name + '.csv')).open(encoding='utf8', newline='') as stream:
        yield from csv.DictReader(stream)


def by_id(name):
    return {int(r['id']): r for r in rows(name)}


def names(name, id_field):
    return {int(r[id_field]): r['name'] for r in rows(name) if r['local_language_id'] == '3'}


SPECIES = by_id('pokemon_species')
NAMES = names('pokemon_species_names', 'pokemon_species_id')
NAME_IDS = {n: i for i, n in NAMES.items()}
POKEMON = by_id('pokemon')
DEFAULT = {int(p['species_id']): int(p['id']) for p in POKEMON.values() if p['is_default'] == '1'}
TYPE_NAMES = names('type_names', 'type_id')
ABILITY_NAMES = names('ability_names', 'ability_id')
ITEMS = by_id('items')
ITEM_NAMES = names('item_names', 'item_id')
ITEM_SLUGS = {r['identifier']: i for i, r in ITEMS.items()}
MOVES = by_id('moves')
MOVE_NAMES = names('move_names', 'move_id')
MOVE_SLUGS = {r['identifier']: i for i, r in MOVES.items()}
VERSION_GROUPS = by_id('version_groups')
VERSIONS = by_id('versions')
LOCATIONS = by_id('locations')
LOCATION_NAMES = names('location_names', 'location_id')
AREAS = by_id('location_areas')
SLOTS = by_id('encounter_slots')
METHODS = by_id('encounter_methods')
EVOLUTIONS = list(rows('pokemon_evolution'))
TRIGGERS = by_id('evolution_triggers')
TYPES = collections.defaultdict(list)
STATS = collections.defaultdict(dict)
ABILITIES = collections.defaultdict(list)
for r in rows('pokemon_types'):
    TYPES[int(r['pokemon_id'])].append((int(r['slot']), int(r['type_id'])))
for r in rows('pokemon_stats'):
    STATS[int(r['pokemon_id'])][int(r['stat_id'])] = int(r['base_stat'])
for r in rows('pokemon_abilities'):
    ABILITIES[int(r['pokemon_id'])].append({'id': int(r['ability_id']), 'hidden': r['is_hidden'] == '1', 'slot': int(r['slot'])})


def sid(name):
    assert name in NAME_IDS, f'Unknown Korean species: {name}'
    return NAME_IDS[name]


def label(i):
    return f'#{i:04d} {NAMES[i]}'


def md_table(headers, data):
    def clean(s):
        return str(s).replace('|', '／').replace('\n', '<br>')
    lines = ['| ' + ' | '.join(headers) + ' |', '| ' + ' | '.join('---' for _ in headers) + ' |']
    lines += ['| ' + ' | '.join(clean(v) for v in row) + ' |' for row in data]
    return '\n'.join(lines) + '\n'


def write(name, content):
    (DOCS / name).write_text(content.rstrip() + '\n', encoding='utf8')


def write_json(name, obj):
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf8')


MAP_TEXT = (DOCS / '개발용_초안맵.md').read_text(encoding='utf8')
STORY_TEXT = (DOCS / '개발용_초안스토리.md').read_text(encoding='utf8')
NODES = {}
GYM_META = {}
REQUESTED = []
for line in MAP_TEXT.splitlines():
    cols = [x.strip() for x in line.strip().strip('|').split('|')]
    if not line.startswith('| '):
        continue
    if re.fullmatch(r'[SKJUX]\d{2}', cols[0]):
        NODES[cols[0]] = {'name': cols[1], 'opening': cols[2], 'content': cols[3]}
    elif re.fullmatch(r'G[SKJU]\d{2}', cols[0]):
        GYM_META[cols[0]] = {'city': cols[1], 'node': re.search(r'[SKJU]\d{2}', cols[1])[0],
                             'type': cols[2], 'mandatory': '본편' in cols[3], 'puzzle': cols[5]}
    elif cols[0].isdigit() and len(cols) == 5:
        REQUESTED.append({'id': sid(cols[1]), 'name': cols[1], 'nodes': cols[2].split('/'),
                          'acquisition': cols[3], 'opening': cols[4]})
assert len(REQUESTED) == 123
assert len(NODES) == 90

# Original encounters are evidence, never blindly copied as NEXUS slots.
REF_VERSIONS = {10, 11, 14, 15, 16, 17, 18, 21, 22}
ENCOUNTERS = collections.defaultdict(list)
CONDITION_IDS = collections.defaultdict(list)
CONDITIONS = by_id('encounter_condition_values')
for r in rows('encounter_condition_value_map'):
    CONDITION_IDS[int(r['encounter_id'])].append(int(r['encounter_condition_value_id']))
for r in rows('encounters'):
    if int(r['version_id']) not in REF_VERSIONS:
        continue
    pid = int(r['pokemon_id'])
    species_id = int(POKEMON[pid]['species_id'])
    if pid != DEFAULT.get(species_id):
        continue
    area = AREAS[int(r['location_area_id'])]
    loc = LOCATIONS[int(area['location_id'])]
    slot = SLOTS[int(r['encounter_slot_id'])]
    ENCOUNTERS[species_id].append({'encounterId': int(r['id']), 'version': VERSIONS[int(r['version_id'])]['identifier'],
        'locationId': int(loc['id']), 'location': loc['identifier'], 'area': area['identifier'],
        'regionId': int(loc['region_id']) if loc['region_id'] else None,
        'method': METHODS[int(slot['encounter_method_id'])]['identifier'],
        'levels': [int(r['min_level']), int(r['max_level'])], 'slotWeight': int(slot['rarity']),
        'conditions': [CONDITIONS[c]['identifier'] for c in CONDITION_IDS[int(r['id'])]]})


def evidence(species_id, node):
    prefixes = PLAN['originalLocationPrefixes'].get(node, [])
    hits = [e for e in ENCOUNTERS[species_id] if any(e['location'].startswith(p) for p in prefixes)]
    region_id = {'S': 4, 'K': 1, 'J': 2, 'U': 5}.get(node[0])
    region_hits = [e for e in ENCOUNTERS[species_id] if e['regionId'] == region_id]
    selected = hits or region_hits
    unique = {}
    for e in selected:
        key = (e['version'], e['location'], e['method'])
        unique.setdefault(key, e)
    return {'basis': '원작 장소 참고' if hits else '같은 지방 참고' if region_hits else '창작·교류 배치',
            'samples': list(unique.values())[:3]}


selected = {r['id'] for r in REQUESTED}
direct = collections.defaultdict(list)
for r in REQUESTED:
    # The previous shortlist remains an explicit editorial acquisition promise.
    for node in r['nodes']:
        direct[r['id']].append({'node': node, 'kind': '이전 초안', 'condition': r['acquisition'], 'chapter': r['opening']})
for entry in PLAN['extraDirect']:
    for name in entry['names'].split():
        i = sid(name)
        selected.add(i)
        direct[i].append({'node': entry['node'], 'kind': entry['method'], 'condition': entry['detail'], 'chapter': entry['chapter']})
for p in PLAN['wildPools']:
    for name in p['species']:
        i = sid(name)
        selected.add(i)
        direct[i].append({'node': p['node'], 'kind': '야생', 'condition': p['method'] + ' / ' + p['condition'], 'chapter': p['chapter']})
for g in PLAN['gyms']:
    for mon in g['party']:
        selected.add(sid(mon['name']))

# Close families through generation 5; post-gen5 families only when explicitly selected.
modern_chains = {SPECIES[i]['evolution_chain_id'] for i in selected if int(SPECIES[i]['generation_id']) >= 6}
chain_ids = {SPECIES[i]['evolution_chain_id'] for i in selected}
selected |= {i for i, s in SPECIES.items() if s['evolution_chain_id'] in chain_ids and
             (int(s['generation_id']) <= 5 or (s['evolution_chain_id'] in modern_chains and int(s['generation_id']) <= 8))}


def candidate_evos(i):
    parent = int(SPECIES[i]['evolves_from_species_id'] or 0)
    result = []
    for e in EVOLUTIONS:
        if int(e['evolved_species_id']) != i or int(VERSION_GROUPS[int(e['version_group_id'])]['generation_id']) > 8:
            continue
        if e['base_form_id'] and int(e['base_form_id']) != DEFAULT.get(parent):
            continue
        if e['evolved_form_id'] and int(e['evolved_form_id']) != DEFAULT.get(i):
            continue
        result.append(e)
    return result


for i in list(selected):
    for e in candidate_evos(i):
        for field in ['party_species_id', 'trade_species_id']:
            if e[field]:
                selected.add(int(e[field]))

FAMILIES = collections.defaultdict(list)
for i in sorted(selected):
    FAMILIES[SPECIES[i]['evolution_chain_id']].append(i)

# A final evolution appearing in a trainer team does not count as obtainable.
# Add a repeatable, named shelter route for a root not otherwise obtainable.
AUTO_GIFTS = []
for members in FAMILIES.values():
    family_locations = [r for i in members for r in direct[i]]
    if not family_locations:
        gym = next((g for g in PLAN['gyms'] if any(sid(m['name']) in members for m in g['party'])), None)
        node = GYM_META[gym['id']]['node'] if gym else 'K19'
        chapter = 'CH03' if node[0] == 'K' else 'CH04' if node[0] == 'J' else 'CH06' if node[0] == 'U' else 'CH02'
    else:
        first = family_locations[0]
        node, chapter = first['node'], first['chapter']
    for i in members:
        parent = int(SPECIES[i]['evolves_from_species_id'] or 0)
        concrete = [x for x in direct[i] if x['kind'] != '이전 초안']
        if not parent and not concrete and SPECIES[i]['is_legendary'] == '0' and SPECIES[i]['is_mythical'] == '0':
            entry = {'speciesId': i, 'node': node, 'kind': '보호 의뢰', 'chapter': chapter,
                     'condition': f'보호소 현장에서 {NAMES[i]} 관찰·먹이 분류 → 위탁. 사전 도감·소유 불필요; 종별 첫 보상 후 보호구역 반복 조우'}
            AUTO_GIFTS.append(entry)
            direct[i].append(entry)

WEIGHTS = {1: [100], 2: [70, 30], 3: [60, 30, 10], 4: [45, 30, 20, 5],
           5: [35, 25, 20, 15, 5], 6: [30, 25, 20, 12, 8, 5],
           7: [25, 22, 18, 15, 10, 7, 3], 8: [23, 20, 17, 14, 11, 8, 5, 2]}
POOLS = []
for idx, p in enumerate(PLAN['wildPools'], 1):
    assert p['node'] in NODES
    assert len(set(p['species'])) == len(p['species'])
    weights = WEIGHTS[len(p['species'])]
    record = {**p, 'id': f'ENC-{idx:03d}', 'slots': []}
    for name, w in zip(p['species'], weights):
        i = sid(name)
        record['slots'].append({'speciesId': i, 'weight': w, 'evidence': evidence(i, p['node'])})
    POOLS.append(record)

SOURCE_BASE = f'https://github.com/PokeAPI/pokeapi/blob/{SHA}/data/v2/csv/'
COMMON = ('작성일: 2026-09-06 · 현황 정리: 2026-09-07 · NEXUS 설계 DB v0.1 · **전체 기획 데이터, 런타임 부분 반영**\n\n'
          '연결: [데이터베이스 안내](개발용_데이터베이스_안내.md) · [스토리](개발용_초안스토리.md) · [맵](개발용_초안맵.md)\n\n'
          '> 이 문서의 표 전체가 구현된 것은 아니다. 최신 항목별 판정은 [DEVELOPMENT 85절](DEVELOPMENT.md#85-설계-문서-반영-현황)을 우선한다.\n\n')

ITEM_DB = []
for item in PLAN['items']:
    assert item['slug'] in ITEM_SLUGS, item['slug']
    i = ITEM_SLUGS[item['slug']]
    sell = item['buy'] // 2
    if item['category'] == 'VALUE':
        sell = {'nugget': 5000, 'pearl': 1000, 'big-pearl': 4000, 'stardust': 1500, 'star-piece': 6000}[item['slug']]
    ITEM_DB.append({**item, 'id': 'IT-' + item['slug'], 'sourceItemId': i, 'name': ITEM_NAMES.get(i, item['slug']),
                   'sell': sell, 'consumed': item['category'] in {'BALL', 'HEAL', 'BERRY', 'FIELD', 'GROWTH', 'FOSSIL'} or item['slug']=='focus-sash',
                   'cap': 99, 'referenceCost': int(ITEMS[i]['cost'])})

EVOLUTION_DB = []
ITEM_REQUIREMENTS = set()


def evo_text(e):
    parts = []
    trigger = int(e['evolution_trigger_id'])
    parts.append({1: '레벨업', 2: '통신교환', 3: '도구 사용', 4: '추가 개체 발생'}.get(trigger, TRIGGERS[trigger]['identifier']))
    if e['minimum_level']: parts.append('Lv' + e['minimum_level'] + ' 이상')
    for key, suffix in [('trigger_item_id', ' 사용'), ('held_item_id', ' 소지')]:
        if e[key]:
            item_id = int(e[key]); ITEM_REQUIREMENTS.add(item_id)
            parts.append(ITEM_NAMES.get(item_id, ITEMS[item_id]['identifier']) + suffix)
    if e['gender_id']: parts.append({'1': '암컷', '2': '수컷', '3': '성별 없음'}[e['gender_id']])
    if e['location_id']:
        loc = LOCATIONS[int(e['location_id'])]
        parts.append(LOCATION_NAMES.get(int(loc['id']), loc['identifier']))
    if e['near_special_rock'] == '1': parts.append('특수 바위 근처')
    if e['time_of_day']: parts.append({'day': '낮', 'night': '밤', 'dusk': '해질녘'}.get(e['time_of_day'], e['time_of_day']))
    for key, title in [('minimum_happiness', '친밀도'), ('minimum_beauty', '아름다움'), ('minimum_affection', '애정')]:
        if e[key]: parts.append(title + ' ' + e[key] + ' 이상')
    if e['known_move_id']: parts.append(MOVE_NAMES[int(e['known_move_id'])] + ' 습득')
    if e['known_move_type_id']: parts.append(TYPE_NAMES[int(e['known_move_type_id'])] + ' 기술 습득')
    if e['relative_physical_stats']:
        parts.append({'-1': '공격<방어', '0': '공격=방어', '1': '공격>방어'}[e['relative_physical_stats']])
    if e['party_species_id']: parts.append(NAMES[int(e['party_species_id'])] + '와 같은 파티')
    if e['party_type_id']: parts.append(TYPE_NAMES[int(e['party_type_id'])] + ' 타입을 파티에 포함')
    if e['trade_species_id']: parts.append(NAMES[int(e['trade_species_id'])] + '와 교환')
    if e['needs_overworld_rain'] == '1': parts.append('필드 비')
    if e['turn_upside_down'] == '1': parts.append('기기 뒤집기')
    return ' + '.join(parts)


for i in sorted(selected):
    parent = int(SPECIES[i]['evolves_from_species_id'] or 0)
    if not parent: continue
    assert parent in selected, f'Missing evolution parent {i}'
    candidates = candidate_evos(i)
    assert candidates, f'No base-form evolution rule for {i} {NAMES[i]}'
    e = sorted(candidates, key=lambda x: (x['is_default'] == '1', int(x['version_group_id']), int(x['id'])), reverse=True)[0]
    original = evo_text(e)
    active = original
    changed = []
    if int(e['evolution_trigger_id']) == 2:
        active = active.replace('통신교환', '같은 지방 포켓몬센터 진화교류 접수')
        active += '; 대상 개체는 돌려받고 필요한 소지 도구만 1개 소모'
        if e['trade_species_id']:
            active += '; 교환 상대 종은 센터 NPC가 준비'
        changed.append('온라인 교환을 게임 내 의뢰로 대체')
    if i == 470:
        active = '이브이와 S05 이끼바위 상호작용 → 진화 확인(소모품 없음)'; changed.append('숲 탐험 조건 채택')
    elif i == 471:
        active = '이브이와 S19 얼음바위 상호작용 → 진화 확인(소모품 없음)'; changed.append('설원 탐험 조건 채택')
    elif i == 700:
        active = '친밀도 160 이상 + 페어리 기술 습득 + 레벨업 때 님피아 선택'; changed.append('애정 수치를 별도 중복 관리하지 않음')
    elif i in (266, 268):
        active = '개무소 Lv7 이상 + 개체 생성 때 저장한 진화분기 ' + ('0' if i == 266 else '1')
        changed.append('분기는 저장 후 고정, 야생 실쿤·카스쿤도 별도 획득 가능')
    elif i == 292:
        active = '토중몬 Lv20 이상에서 아이스크 진화 확정 + 파티 빈칸 + 몬스터볼 1개 → 껍질몬 추가'
        ITEM_REQUIREMENTS.add(ITEM_SLUGS['poke-ball']); changed.append('지급 확인·개체 중복 방지 필요')
    elif i == 745:
        active = '암멍이 Lv25 이상 + 낮; 기본 낮의 모습만 우선 수록'
        changed.append('밤·황혼 모습은 별도 폼 데이터 도입 뒤 확장')
    if e['location_id'] and i not in (470, 471):
        active = original + '; NEXUS 대체 조사 지점 S15의 지정 관측실 사용'
        changed.append('원작 특정 지점을 신오 관측실로 대응')
    if e['turn_upside_down'] == '1':
        active = active.replace('기기 뒤집기', '진화 화면에서 반전 문양 확인'); changed.append('기기 동작 대체')
    required_items = ['IT-' + ITEMS[int(e[k])]['identifier'] for k in ['trigger_item_id', 'held_item_id'] if e[k]]
    if i in (470, 471): required_items = []
    source_generation = int(VERSION_GROUPS[int(e['version_group_id'])]['generation_id'])
    source_tag_warning = source_generation < max(int(SPECIES[i]['generation_id']), int(SPECIES[parent]['generation_id']))
    EVOLUTION_DB.append({'id': f'EV-{parent:04d}-{i:04d}', 'from': parent, 'to': i,
        'sourceRowId': int(e['id']), 'sourceVersionGroup': VERSION_GROUPS[int(e['version_group_id'])]['identifier'],
        'sourceTagPredatesSpecies': source_tag_warning,
        'sourceRule': e, 'referenceSummary': original, 'nexusRule': active, 'changes': changed,
        'requiredItems': required_items})

ITEM_REQUIREMENTS = {ITEM_SLUGS[item_id.removeprefix('IT-')] for e in EVOLUTION_DB for item_id in e['requiredItems']}
for item_id in sorted(ITEM_REQUIREMENTS):
    slug = ITEMS[item_id]['identifier']
    if any(x['sourceItemId'] == item_id for x in ITEM_DB): continue
    held_note = {'metal-coat': '소지 중 강철 기술 피해 1.2배. ', 'kings-rock': '소지 중 유효 공격의 풀죽음 판정은 별도 효과 구현 필요. ',
                 'razor-claw': '소지 중 급소율 단계 +1. ', 'razor-fang': '소지 중 유효 공격의 풀죽음 판정은 별도 효과 구현 필요. '}.get(slug,'')
    ITEM_DB.append({'id': 'IT-' + slug, 'sourceItemId': item_id, 'slug': slug, 'name': ITEM_NAMES.get(item_id, slug),
        'category': 'EVOLUTION', 'effect': held_note + '진화표에서 지정한 종·조건에 사용. 진화 확정 시 1개 소모',
        'buy': 3000, 'sell': 1500, 'unlock': 'CH03', 'node': 'K07', 'consumed': True, 'cap': 99,
        'referenceCost': int(ITEMS[item_id]['cost'])})
for key in PLAN['keyItems']:
    ITEM_DB.append({**key, 'id': 'KEY-' + key['slug'], 'sourceItemId': ITEM_SLUGS.get(key['slug']),
                   'category': 'KEY', 'buy': 0, 'sell': 0, 'consumed': False, 'cap': 1})

# Gym move sets: source learnability across generations 1-8, level/egg/TM/tutor union.
# A legal source row is recorded for every chosen move. NEXUS uses this explicit union.
gym_species = {sid(m['name']) for g in PLAN['gyms'] for m in g['party']}
gym_species |= {sid(n) for g in PLAN['gyms'] for n in g.get('lowLevelReplacements', {}).values()}
for i in list(gym_species):
    while SPECIES[i]['evolves_from_species_id']:
        i = int(SPECIES[i]['evolves_from_species_id']); gym_species.add(i)
LEARN = collections.defaultdict(list)
for r in rows('pokemon_moves'):
    pid = int(r['pokemon_id'])
    if pid not in POKEMON: continue
    i = int(POKEMON[pid]['species_id'])
    if i not in gym_species or pid != DEFAULT[i]: continue
    if int(VERSION_GROUPS[int(r['version_group_id'])]['generation_id']) > 8: continue
    if int(r['pokemon_move_method_id']) not in {1, 2, 3, 4}: continue
    LEARN[i].append(r)

MOVE_ALLOW = '''tackle pound scratch quick-attack bite headbutt slash strength body-slam return
growl tail-whip leer scary-face screech double-team sand-attack smokescreen protect detect rest
water-gun bubble bubble-beam water-pulse aqua-jet surf brine scald waterfall hydro-pump
ember flame-wheel fire-fang flame-charge flamethrower fire-blast will-o-wisp sunny-day
vine-whip razor-leaf absorb mega-drain magical-leaf seed-bomb energy-ball giga-drain grass-knot leaf-blade synthesis leech-seed
thunder-shock spark shock-wave thunder-fang discharge thunderbolt thunder-wave charge-beam volt-switch
powder-snow icy-wind ice-shard ice-fang ice-beam avalanche ice-punch hail
karate-chop low-kick rock-smash mach-punch force-palm brick-break drain-punch aura-sphere bulk-up close-combat
poison-sting acid poison-fang poison-jab sludge sludge-bomb venoshock toxic
mud-slap magnitude mud-shot bulldoze dig earth-power earthquake
gust peck wing-attack air-cutter air-slash aerial-ace acrobatics fly roost
confusion psybeam psychic psyshock calm-mind light-screen reflect hypnosis
bug-bite fury-cutter struggle-bug signal-beam x-scissor u-turn silver-wind
rock-throw rock-tomb rock-slide power-gem stone-edge stealth-rock sandstorm
astonish lick night-shade hex shadow-punch shadow-claw shadow-ball confuse-ray
twister dragon-rage dragon-breath dragon-claw dragon-pulse dragon-tail dragon-dance
payback assurance feint-attack snarl dark-pulse crunch night-slash sucker-punch
metal-claw iron-head flash-cannon iron-tail bullet-punch gyro-ball magnet-bomb
fairy-wind disarming-voice draining-kiss dazzling-gleam moonblast sweet-kiss charm
attract work-up swords-dance agility minimize pursuit sonic-boom stomp take-down double-kick rolling-kick
revenge vital-throw focus-energy wish heal-bell taunt torment knock-off mud-bomb rock-blast pin-missile
rapid-spin super-fang hyper-fang fury-swipes double-slap fury-attack triple-kick thunder-punch fire-punch
feather-dance cotton-spore string-shot sing extrasensory incinerate flame-burst retaliate facade
'''.split()
ALLOW_IDS = {MOVE_SLUGS[x] for x in MOVE_ALLOW if x in MOVE_SLUGS}
EVO_BY_TO = {x['to']: x for x in EVOLUTION_DB}


def legal_stage(i, level):
    while i in EVO_BY_TO:
        e = EVO_BY_TO[i]['sourceRule']
        if e['minimum_level'] and int(e['minimum_level']) > level:
            i = EVO_BY_TO[i]['from']
        else: break
    return i


def make_member(i, level, ace=False):
    i = legal_stage(i, level)
    types = [t for _, t in sorted(TYPES[DEFAULT[i]])]
    candidate = {}
    cap = 65 if level < 20 else 85 if level < 35 else 120
    for r in LEARN[i]:
        mid = int(r['move_id']); m = MOVES[mid]
        if mid not in ALLOW_IDS: continue
        if r['pokemon_move_method_id'] == '1' and int(r['level']) > level: continue
        if m['power'] and int(m['power']) > cap: continue
        if level < 20 and m['identifier'] in {'dragon-rage', 'sonic-boom', 'night-shade'}: continue
        candidate.setdefault(mid, r)
    attack = [mid for mid in candidate if MOVES[mid]['damage_class_id'] != '1']
    status = [mid for mid in candidate if MOVES[mid]['damage_class_id'] == '1']
    attack.sort(key=lambda mid: (int(MOVES[mid]['type_id']) in types,
        int(MOVES[mid]['damage_class_id']) == (2 if STATS[DEFAULT[i]][2] >= STATS[DEFAULT[i]][4] else 3),
        int(MOVES[mid]['power'] or 45)), reverse=True)
    picked = []
    seen_types = set()
    for mid in attack:
        typ = MOVES[mid]['type_id']
        if typ not in seen_types and len(picked) < 3:
            picked.append(mid); seen_types.add(typ)
    status.sort(key=lambda mid: ({'protect': 5, 'thunder-wave': 4, 'will-o-wisp': 4, 'reflect': 3,
        'light-screen': 3, 'calm-mind': 3, 'bulk-up': 3}.get(MOVES[mid]['identifier'], 0), mid), reverse=True)
    if status: picked.append(status[0])
    for mid in attack + status:
        if len(picked) >= 4: break
        if mid not in picked: picked.append(mid)
    assert len(picked) == 4, f'Insufficient legal moves: {NAMES[i]} Lv{level}: {len(picked)}'
    ability = next(a for a in sorted(ABILITIES[DEFAULT[i]], key=lambda a:a['slot']) if not a['hidden'])
    held = 'IT-sitrus-berry' if ace and level >= 25 else 'IT-oran-berry' if ace else None
    return {'speciesId': i, 'level': level, 'abilityId': ability['id'], 'heldItem': held,
            'moves': picked, 'moveEvidence': {str(mid): candidate[mid] for mid in picked}}


GYM_DB = []
for g in PLAN['gyms']:
    meta = GYM_META[g['id']]
    mid = MOVE_SLUGS[g['rewardMove']]
    reward = 'TM-' + g['rewardMove']
    ITEM_DB.append({'id': reward, 'sourceItemId': None, 'slug': g['rewardMove'], 'name': '기술머신: ' + MOVE_NAMES[mid],
        'category': 'TM', 'effect': f'{MOVE_NAMES[mid]} 습득 자격이 있는 개체에게 학습, 반복 사용 가능',
        'moveId': mid, 'buy': 0, 'sell': 0, 'unlock': g['id'], 'node': meta['node'], 'consumed': False, 'cap': 1})
    variants = []
    if meta['mandatory']:
        squads = [('본편', [m['level'] for m in g['party']])]
        if g['id'] in {'GS05', 'GS06'}:
            squads = [('귀환 첫 도전', [49, 50, 51, 52]), ('귀환 두 번째', [51, 52, 53, 54])]
    else:
        squads = [(ch, [lv-3, lv-2, lv-1, lv]) for ch, lv in [('CH03', 30), ('CH04~05', 40), ('CH06~07', 49), ('CH08', 58), ('CH10', 65)]]
    for key, levels in squads:
        party = []
        for idx, (m, lv) in enumerate(zip(g['party'], levels)):
            original = sid(m['name'])
            candidate = legal_stage(original, lv)
            if meta['type'] not in [TYPE_NAMES[t] for _, t in TYPES[DEFAULT[candidate]]]:
                replacement = g.get('lowLevelReplacements', {}).get(m['name'])
                assert replacement, f"Explicit typed replacement required: {g['id']} {m['name']} Lv{lv}"
                original = sid(replacement)
            party.append(make_member(original, lv, idx == len(levels)-1))
        variants.append({'name': key, 'party': party})
    GYM_DB.append({**meta, 'id': g['id'], 'leader': g['leader'], 'leaderEnglish': g['leaderEnglish'],
        'badgeId': 'BADGE-' + g['id'], 'rewardItem': reward, 'variants': variants,
        'money': max(x['level'] for x in variants[0]['party']) * 120})

SPECIES_DB = []
for i in sorted(selected):
    s = SPECIES[i]; pid = DEFAULT[i]
    family_sources = [x for member in FAMILIES[s['evolution_chain_id']] for x in direct[member]]
    record = {'nationalId': i, 'name': NAMES[i], 'slug': s['identifier'], 'generation': int(s['generation_id']),
        'defaultPokemonId': pid, 'types': [TYPE_NAMES[t] for _, t in sorted(TYPES[pid])],
        'stats': {name: STATS[pid][k] for k, name in enumerate(['hp','attack','defense','specialAttack','specialDefense','speed'],1)},
        'abilities': [{**a, 'name': ABILITY_NAMES.get(a['id'], str(a['id']))} for a in ABILITIES[pid]],
        'captureRate': int(s['capture_rate']), 'growthRateId': int(s['growth_rate_id']),
        'legendary': s['is_legendary']=='1', 'mythical': s['is_mythical']=='1', 'ultraBeast': i in {793,794,795,796,797,798,799,803,804,805,806},
        'requested': any(x['id']==i for x in REQUESTED), 'family': FAMILIES[s['evolution_chain_id']],
        'evolvesFrom': int(s['evolves_from_species_id'] or 0) or None,
        'directAcquisition': direct[i], 'familyNodes': sorted({x['node'] for x in family_sources}),
        'implemented': i in {1,4,7,25}}
    SPECIES_DB.append(record)

MOVE_IDS = sorted({mid for g in GYM_DB for v in g['variants'] for m in v['party'] for mid in m['moves']} |
                  {MOVE_SLUGS[g['rewardMove']] for g in PLAN['gyms']} |
                  {int(e['sourceRule']['known_move_id']) for e in EVOLUTION_DB if e['sourceRule']['known_move_id']})
MOVE_DB = [{'id': i, 'name': MOVE_NAMES[i], 'slug': MOVES[i]['identifier'], 'type': TYPE_NAMES[int(MOVES[i]['type_id'])],
    'category': {'1':'변화','2':'물리','3':'특수'}[MOVES[i]['damage_class_id']],
    'power': int(MOVES[i]['power']) if MOVES[i]['power'] else None,
    'accuracy': int(MOVES[i]['accuracy']) if MOVES[i]['accuracy'] else None,
    'pp': int(MOVES[i]['pp']), 'priority': int(MOVES[i]['priority']),
    'effectId': int(MOVES[i]['effect_id']), 'effectChance': int(MOVES[i]['effect_chance']) if MOVES[i]['effect_chance'] else None,
    'targetId': int(MOVES[i]['target_id'])} for i in MOVE_IDS]

def generate_documents():
    # Document rendering is defined below, keeping the data assembly independent.
    render_dex()
    render_encounters()
    render_evolutions()
    render_gyms()
    render_items()
    render_moves()
    render_quests()
    render_index()


def render_dex():
    regional_counts = collections.Counter(s['generation'] for s in SPECIES_DB)
    text = '# 개발용 포켓몬도감\n\n' + COMMON
    text += (f'## 1. 수록 범위\n\n인기투표 목록 123종을 모두 유지하고, 지방 생태·체육관·진화 계열을 보완한 **{len(SPECIES_DB)}종**의 기본 모습 도감이다. '
             '이 목록은 모든 포켓몬이나 원작 지역도감 전체를 수록한다는 뜻이 아니다. 진화 중간 종과 분기 종도 별개의 전국도감 번호로 관리한다.\n\n')
    text += md_table(['첫 등장 세대', '수록 종 수'], [[g, regional_counts[g]] for g in sorted(regional_counts)])
    text += ('\n전국번호·한국어 이름·타입·종족값·특성은 [고정한 PokéAPI 종 자료](' + SOURCE_BASE + 'pokemon_species.csv) 및 연결 표를 사용했다. '
             '공식 한국어 표기·모습 구분의 기준은 [포켓몬코리아 도감](https://www.pokemonkorea.co.kr/pokedex)이다. '
             'PokéAPI는 커뮤니티 자료이며 모든 행을 공식 사이트와 대조했다는 뜻은 아니다.\n\n'
             '타입·종족값은 고정 스냅샷의 기본 모습 값이다. 페어리 타입을 포함하며 DP 시절 수치 그대로가 아니다. '
             '진화·기술 습득의 프로젝트 채택 규칙은 별도 DB를 따른다. 지역 모습·메가진화·거다이맥스·배틀 전용 모습은 기본 종과 구분한다.\n\n'
             '## 2. 표의 의미\n\n'
             '- `요청`은 앞선 123종, `추가`는 이번에 보완한 종이다. 현재 런타임 등록 33종·소유 가능 26종과 이 설계표 전체를 구분한다.\n'
             '- `서식/획득 권역`은 이 게임의 배치 제안이다. 진화형의 권역은 진화 전 종을 기르는 출발 권역도 포함한다.\n'
             '- `진화 육성`은 야생 출현을 뜻하지 않는다. 직접 조우만 있는 종은 출현표에서 방법·시간·조건을 확인한다.\n'
             '- 종족값 표기는 HP/공격/방어/특수공격/특수방어/스피드 순서다. 현재 파티의 고정 HP와 같은 값이 아니다.\n'
             '- 특성 뒤 `(숨김)`은 숨겨진 특성이다. 수록 사실과 초반 획득 가능 여부는 별개이며 첫 버전은 일반 특성만 지급하는 안이다.\n\n')
    for gen in sorted(regional_counts):
        text += f'## {gen + 2}. {gen}세대 출신\n\n'
        data = []
        for s in SPECIES_DB:
            if s['generation'] != gen: continue
            kinds = sorted({r['kind'] for r in s['directAcquisition'] if r['kind'] != '이전 초안'})
            if s['evolvesFrom']: kinds.append('진화 육성')
            if s['legendary'] or s['mythical']: kinds = ['전설·환상 후일담']
            if not kinds: kinds = ['이전 초안 의뢰']
            data.append([f"{s['nationalId']:04d}", s['name'], '/'.join(s['types']),
                '요청' if s['requested'] else '추가', '·'.join(s['familyNodes']), '/'.join(kinds),
                '/'.join(str(v) for v in s['stats'].values()),
                '·'.join(a['name'] + ('(숨김)' if a['hidden'] else '') for a in s['abilities'])])
        text += md_table(['전국번호','이름','타입','구분','서식/획득 권역','획득 방식','종족값 6항목','특성'], data) + '\n'
    text += ('## 도감 기록과 구현 계약\n\n'
             '발견·소유·진화 관찰·색이 다른 모습은 분리 기록한다. 붉은 갸라도스는 #0130 개체의 색 상태이며 새 전국번호가 아니다. '
             '박사에게 받은 피카츄가 라이츄로 진화해도 과거 수령 플래그는 유지한다. 도감 완성 조건에 통신·유료 배포·현실 요일을 요구하지 않는다.\n\n'
             '종별 상세 JSON은 [pokemon.json](design-data/pokemon.json), 실제 후보 슬롯은 [지역별 출현표](개발용_지역별출현표.md), '
             '진화 분기는 [진화 DB](개발용_진화데이터베이스.md)를 따른다. 각 종의 `captureRate`는 포획 확률(%)이 아닌 기초 상수다. '
             '그 상수·기술·아이템만으로 포획·전투 엔진이 완성된 것으로 해석하지 않는다.\n')
    write('개발용_포켓몬도감.md', text)


def render_encounters():
    text = '# 개발용 지역별 포켓몬 출현표\n\n' + COMMON
    text += (f'## 1. 실제 서식 참고와 창작 배치\n\n90개 권역 전체를 관리하며, 현재 **{len(POOLS)}개 야생 조우 풀**을 제안한다. '
             '출처는 FR/LG의 관동, HG/SS의 관동·성도, 플라티나의 신오, BW/BW2의 하나 조우 기록이다. '
             '[원자료 encounters.csv](' + SOURCE_BASE + 'encounters.csv), [장소](' + SOURCE_BASE + 'locations.csv), '
             '[조우 슬롯](' + SOURCE_BASE + 'encounter_slots.csv)를 연결했다.\n\n'
             '`원작 장소 참고`도 원작과 같은 조건·레벨·확률이라는 뜻이 아니다. 원작 장소 또는 인접 권역에 해당 종 기록이 있다는 뜻이다. '
             '`같은 지방 참고`는 그 지방 다른 곳의 조우를 참고한 이식이다. `창작·교류 배치`는 해당 버전 자료에서 근거를 찾지 못한 제안이며, '
             '원작에 없음을 증명하는 표시는 아니다. 후대 종은 교류 시설·이주 개체로 다룬다.\n\n'
             '## 2. 조우 규칙\n\n'
             '- 슬롯 가중치 합은 **각 풀 내부에서 100**이다. 한 걸음당 조우 확률과 포획 확률은 별도다.\n'
             '- 풀 ID는 권역+세부 지형+시간 조건으로 하나를 선택한 뒤 샘플링한다. 서로 다른 풀의 확률을 합산하지 않는다.\n'
             '- 상시는 하루 전체, 낮 06:00~17:59, 밤 18:00~05:59의 게임 내 시각이다. 휴식으로 변경 가능하다.\n'
             '- 낚시는 현장과 초보 낚싯대부터 가능, 상위 낚싯대는 기본 풀을 없애지 않는다. 수면은 해당 권역의 조사선·탐사 지원 해금 후 접근한다.\n'
             '- 피카츄 마을 구조, 조로아 환상, 안농 탁본 등은 풀에 적힌 조건을 별도로 만족해야 한다. 보스전은 야생 풀에 섞지 않는다.\n'
             '- 도시 보도·실내·항구 접수실에는 무작위 전투가 없다. 도시 권역 풀은 표에 적힌 외곽·공원·물가만 사용한다.\n'
             '- 저레벨 서식지는 재방문해도 레벨이 오르지 않는다. 균열·후일담의 높은 레벨 풀은 별도의 단계로 추가한다.\n\n')
    by_node = collections.defaultdict(list)
    for p in POOLS: by_node[p['node']].append(p)
    for prefix, title in [('S','신오'),('K','관동'),('J','성도'),('U','하나'),('X','특별 탐사')]:
        text += f'## {title} 권역\n\n'
        for node in sorted(n for n in NODES if n.startswith(prefix)):
            text += f"### {node} {NODES[node]['name']}\n\n"
            pools = by_node[node]
            if pools:
                data = []
                for p in pools:
                    for s in p['slots']:
                        ev = s['evidence']
                        sample = ev['samples'][0] if ev['samples'] else None
                        ref = f"{sample['version']} / {sample['location']} / encounter#{sample['encounterId']}" if sample else '창작 서식·교류 제안'
                        data.append([p['id'], p['chapter'], p['method'] + '·' + p['condition'],
                            f"{p['levels'][0]}~{p['levels'][1]}", label(s['speciesId']), str(s['weight'])+'%', ev['basis'], ref])
                text += md_table(['풀 ID','개방','지형·시간','Lv','포켓몬','슬롯','근거 구분','원작 기록 예시'], data)
            else:
                text += '기본 야생 조우 풀 없음. 생활 NPC·교통·체육관·고정 사건을 위한 권역이다.\n'
            specials = []
            for i, entries in direct.items():
                explicit = [r for r in entries if r['node'] == node and r['kind'] not in {'야생','이전 초안','진화'}]
                for r in explicit:
                    specials.append([label(i), r['kind'], r['chapter'], r['condition']])
                if not explicit and (SPECIES[i]['is_legendary']=='1' or SPECIES[i]['is_mythical']=='1'):
                    prior = next((r for r in entries if r['node']==node),None)
                    if prior: specials.append([label(i),'후일담',prior['chapter'],prior['condition']])
            if specials:
                text += '\n' + md_table(['고정·선물 대상','방식','개방','조건'], specials)
            text += '\n'
    text += ('## 세부 맵으로 나눌 때의 주의\n\nS17의 세 호수, S18의 꽃밭·발전소·돌탑, K18·J13·U10의 도로 묶음은 각 하위 맵으로 분리해야 한다. '
             '이번 풀은 해당 생태 유형의 후보이며 모든 하위 지도에 같은 풀을 복사한다는 뜻이 아니다. 현재 선택된 ENC-001·002·003·004·016 외에는 `mapId/subArea`와 런타임 연결을 별도로 확정해야 한다.\n\n'
             '현재 자료의 물가 낚시·숲·동굴 풀에 없는 종은 선물·진화·고정 사건 표로 획득한다. 보호 의뢰는 지역 보호소 NPC를 새로 작성할 때 구현하며, '
             '각 의뢰의 보상은 한 번만 지급하고 반복 조우 구역은 별도로 연다.\n')
    write('개발용_지역별출현표.md', text)


def render_evolutions():
    text = '# 개발용 진화 데이터베이스\n\n' + COMMON
    text += (f'## 1. 채택 기준\n\n수록 종을 연결하는 **{len(EVOLUTION_DB)}개 진화 간선**이다. '
             '[고정한 진화 원자료](' + SOURCE_BASE + 'pokemon_evolution.csv)에서 8세대까지의 기본 모습 조건을 참고했다. '
             '원자료 조건은 버전별로 다를 수 있어 출처 행과 버전 그룹 태그를 각 행에 남긴다. `원자료 참고`는 모든 세대에 공통이라는 뜻이 아니다. '
             '일부 원자료 태그는 종의 도입 세대보다 앞선 게임을 가리킨다. 예를 들어 피츄 진화에 red-blue 태그가 붙어 있어도 1세대에 피츄가 있었다는 뜻이 아니다. '
             '해당 행은 태그 불일치를 표시하고, 원작 등장 시기는 포켓몬 종의 세대 필드를 따른다. 태그는 원본 행 추적용으로만 사용한다.\n\n'
             '이 프로젝트는 온라인 교환을 센터의 진화교류 의뢰로 바꾸고, 이브이의 8진화를 여행과 연결한다. 분기 조건이 겹치면 진화 선택 화면에서 확인한다. '
             '레벨업 진화에서 취소했으면 다음 레벨업/진화 연구원 재확인으로 다시 제안하며, 최대 레벨에서도 재확인할 수 있다.\n\n'
             '## 2. 상태와 아이템\n\n'
             '진화는 같은 개체 ID를 유지한다. 이름을 새로 지은 경우 닉네임도 유지하며 HP·능력치는 새 종 기준으로 보정한다. '
             '아이템·개체 종·도감·이벤트 완료를 한 번의 확정 결과로 저장하고 취소·실패 때 아이템을 쓰지 않는다. '
             '왕의징표석·금속코트 같은 도구는 소지 효과와 진화 소모를 구분한다. 친밀도·성별·개체 분기·날씨는 현재 저장에 없는 신규 필드다.\n\n'
             '루가루암은 기본 낮 모습만 우선 채택한다. 지역 모습의 진화, 특수 폼, 9세대 이후 신규 진화는 이번 기본 도감에 자동 포함하지 않는다. '
             '같은 종의 모습 전환은 이 표의 종 간 진화와 다르다.\n\n')
    text += md_table(['진화 ID','이전 → 이후','원자료 참고 조건','NEXUS 채택 조건','원자료 태그 / 행','필요 아이템 ID'],
        [[e['id'], label(e['from'])+' → '+label(e['to']), e['referenceSummary'], e['nexusRule'],
          e['sourceVersionGroup']+' / '+str(e['sourceRowId'])+(' (도입 세대와 태그 불일치)' if e['sourceTagPredatesSpecies'] else ''), ', '.join(e['requiredItems']) or '없음'] for e in EVOLUTION_DB])
    text += ('\n## 부화·분기·재획득\n\n'
             '알 부화는 종 간 진화가 아니다. 리오르·마나피 알은 별도 선물 개체로 기록한다. 번식은 이번 범용 육성 범위에서 아직 구현되지 않았으며, '
             '아기 포켓몬은 직접 조우·보호 의뢰로 얻을 수 있게 했다. 이브이의 다른 진화형을 얻기 위해 이미 진화한 개체를 되돌리지 않는다.\n\n'
             '껍질몬은 추가 개체 생성 사건이다. 아이스크와 같은 개체 ID를 공유하지 않고, 빈칸·볼이 없을 때 결과를 명확히 안내한다. '
             '개무소 분기는 저장한 개체 값에 고정하고 불러오기마다 바꾸지 않는다.\n')
    write('개발용_진화데이터베이스.md', text)


def render_gyms():
    text = '# 개발용 체육관 데이터베이스\n\n' + COMMON
    text += ('## 1. 원작 기반과 창작 변경\n\n'
             '32개 체육관의 도시·타입은 이전 맵 초안과 연결했다. 관장 배치는 플라티나, HG/SS, BW2를 참고한 **동시대 재구성 제안**이다. '
             '원작 그대로의 시간대·레벨·팀·보상이라는 뜻이 아니다. 관동은 도희·그린이 관장인 시기의 인물 구성을 채택한다. '
             '그린의 원작 팀은 타입이 혼합되어 있지만 본편의 32타입 테마 표를 유지하기 위해 여기서는 땅 특화 도전 팀을 제안한다.\n\n'
             '참고: [플라티나 관장](https://pokemondb.net/platinum/gymleaders-elitefour), '
             '[HG/SS 관장](https://pokemondb.net/heartgold-soulsilver/gymleaders-elitefour), '
             '[BW2 관장](https://pokemondb.net/black-white-2/gymleaders-elitefour). '
             '[공식 무청 소개](https://pokemonkorea.co.kr/bdsp/menu135?mode=view&number=2399&stype1=&stype2=)도 대조했다. '
             '이 문서의 팀·퍼즐·획득 조건·돈은 NEXUS 설계값이다.\n\n'
             '## 2. 진행·전투 공통 규칙\n\n'
             '- 본편 필수 20, 선택 12. 배지 ID별로 검사하며 총 개수만으로 핵심 배지를 대체하지 않는다.\n'
             '- 필수 20곳은 표의 단계별 고정 팀. GS05·GS06은 먼저 도전한 쪽 에이스52, 나중54다.\n'
             '- 선택 12곳은 현재 장별 30/40/49/58/65 팀을 준비한다. 해당 지방 도착 전의 낮은 단계 팀은 노출하지 않는다.\n'
             '- 접수 시 팀을 고정한다. 낮은 레벨에서 진화할 수 없는 최종형은 같은 계열의 이전 단계로 교체했다. 친밀도·도구 진화는 레벨만으로 금지하지 않는다.\n'
             '- 1대1 기본 배틀, 상대 교체 힌트를 주는 Shift형 진행을 기본 제안. 관장 가방 회복은 0회, 보유 열매 효과는 허용한다.\n'
             '- 첫 패배는 배지·아이템을 잃지 않으며 센터 회복 뒤 재도전. 배지·TM·초회 상금은 함께 저장하고 한 번만 지급한다.\n'
             '- AI는 내성·자속·현재 공개된 상태로 행동한다. 플레이어가 선택한 기술을 미리 읽지 않는다.\n'
             '- 아래 기술은 1~8세대 기본 모습의 레벨업/TM/교배/가르침 습득 기록 중에서 골랐다. **세대 통합 습득 규칙이라는 창작안**이며 단일 원작 버전 팀이 아니다.\n'
             '- 기술 효과와 특성은 구현 전 별도 검토가 필요하다. 기술명·위력만으로 전투 가능 상태로 판정하지 않는다.\n\n')
    text += md_table(['체육관','도시','관장','타입','본편','배지 ID','초회 TM'],
        [[g['id'],g['city'],g['leader'],g['type'],'필수' if g['mandatory'] else '선택',g['badgeId'],g['rewardItem']] for g in GYM_DB])
    for g in GYM_DB:
        text += f"\n## {g['id']} {g['city']} — {g['leader']}\n\n"
        text += f"퍼즐·체험: {g['puzzle']}\n\n"
        text += f"초회 보상: {g['badgeId']} + {g['rewardItem']}. 상금은 실제 도전 팀 최고 레벨 × 120원. 재도전의 보상 중복 지급은 금지한다.\n\n"
        if not g['mandatory']:
            text += '선택 체육관의 단계표는 현재 장을 따른다. 아직 해당 지방이 열리지 않은 단계는 데이터 후보일 뿐 실제 접수할 수 없다.\n\n'
        data = []
        for v in g['variants']:
            for idx, m in enumerate(v['party']):
                data.append([v['name'],str(idx+1),label(m['speciesId']),m['level'],ABILITY_NAMES[m['abilityId']],
                    ' / '.join(MOVE_NAMES[mid] for mid in m['moves']),m['heldItem'] or '없음'])
        text += md_table(['단계','순서','포켓몬','Lv','특성','기술 4개','소지품'],data)
    text += ('\n## 리그와 재대결\n\n'
             '관동·성도는 K17 석영 시설을 공유하지만 대회 접수·제패 기록은 분리한다. 신오 S14, 하나 U09는 각각 별도 시설이다. '
             '지역 리그는 CH09 종료+해당 지역 8배지로 개방, 월드 마스터즈 X08은 32배지+4리그 제패로 개방한다. '
             '사천왕·챔피언의 전원 세부 팀은 이번 32체육관 DB와 별도 범위이며 빈 데이터를 완성 팀으로 표시하지 않는다.\n')
    write('개발용_체육관데이터베이스.md',text)


def render_items():
    text = '# 개발용 아이템 데이터베이스\n\n' + COMMON
    text += (f'## 1. 수록과 가격 기준\n\n**{len(ITEM_DB)}개 아이템 레코드**를 관리한다. '
             '원작 이름과 식별자는 [items.csv](' + SOURCE_BASE + 'items.csv)·[한국어 이름](' + SOURCE_BASE + 'item_names.csv)를 참고했다. '
             '가격·판매처·개방·일부 효과 간소화는 NEXUS 제안이다. 특히 회복량, 볼 조건, 재사용 정책을 서로 다른 세대의 원작 공통 규칙이라고 주장하지 않는다.\n\n'
             '금액은 게임 내 원 단위다. 구매가 0은 무료 상시 구매가 아니라 **비매품**을 뜻한다. 상금·판매차익 밸런스는 실제 플레이 전 미검증이다. '
             '판매가 0의 중요한 물건·TM은 판매/버리기 불가, 나머지 비매품 소모품은 판매 허용 여부를 첫 구현에서 잠근다.\n\n'
             '## 2. 사용 계약\n\n'
             '- 일반 스택 한도99, 중요품·TM 한도1. 파티 소지품과 가방 수량은 별도로 기록한다.\n'
             '- 대상·조건을 검증한 뒤 효과와 수량 차감을 같이 저장한다. 이미 회복되었거나 대상이 없으면 소모하지 않는다.\n'
             '- 필드 소모품은 일반 플레이에서만 사용한다. 고정 사건의 필수 분기·워프 중에는 사용을 차단한다.\n'
             '- 트레이너 전투에는 포획 볼을 사용할 수 없다. 전설도 이야기에서 포획이 허용된 상태에만 사용한다.\n'
             '- 야생 조우 억제는 강제 스토리·고정 심볼을 없애지 않는다. 동굴탈출은 안전점이 없는 장소에서 소모 없이 거절한다.\n'
             '- 회복 비율은 내림하되 회복이 가능한 경우 최소1, 최대 HP를 넘지 않는다. 능력치·피해 소수 처리도 전투 규칙에서 통일한다.\n'
             '- 진화 도구·교환 도구는 진화 DB의 조건이 우선이다. 중요품은 완료 플래그만으로 재발급할 수 있어야 한다.\n'
             '- 생명의구슬·검은진흙·기합의띠 등 특수 판정은 전투 효과 구현과 함께 수용한다. 문서에 있다고 효과가 작동하는 것은 아니다.\n\n')
    for cat,title in [('BALL','포획 볼'),('HEAL','회복'),('BERRY','나무열매'),('HELD','소지품'),('EVOLUTION','진화 도구'),('FOSSIL','화석 복원'),
                      ('FIELD','탐색'),('GROWTH','육성'),('VALUE','판매용 보물'),('TM','기술머신'),('KEY','중요한 물건')]:
        group = [x for x in ITEM_DB if x['category']==cat]
        text += f'## {title}\n\n'
        text += md_table(['아이템 ID','이름','효과·조건','구매 / 판매','개방','획득 거점','소모·한도'],
            [[x['id'],x['name'],x['effect'],f"{x['buy']} / {x['sell']}",x['unlock'],x['node'],
              ('소모' if x['consumed'] else '유지')+f" / {x['cap']}"] for x in group]) + '\n'
    text += ('## 상점과 재발급\n\n'
             '각 도시 센터 옆 상점은 해당 장까지 열린 기본 회복·볼·조우 억제 품목을 판매한다. 표의 거점은 최초 획득 또는 전문 판매처다. '
             '진화 도구는 K07 백화점에서 CH03부터 확보하도록 해 교환 불가로 도감이 막히지 않게 한다. '
             'GS01의 두개도스처럼 NPC의 소유 포켓몬이 먼저 등장하는 것과 플레이어의 도구 입수 시점은 구분한다.\n\n'
             '비매품 마스터볼은 CH10 관측 보고 초회 보상 1개, 전기구슬은 SQ01 초회 보상, 기술머신은 해당 배지 초회 보상이다. '
             '상점 판매가 없는 회복·육성 소모품은 표의 거점 필드 보물/의뢰 보상 후보로 두고 보물 ID는 실제 타일 배치 때 확정한다. '
             '매일·매 접속마다 마스터볼을 재지급하지 않는다. 포획 실패 후 재도전은 볼을 환불하는 기능과 다르다.\n\n'
             '화석은 지정 발굴 거점의 반복 가능한 표본 의뢰로 얻고 K04에서 복원한다. 다른 화석을 택했다고 나머지 종이 영구 차단되지 않는다. '
             '초회 화석 복원은 Lv20, 보관함이 가득 차면 소모 없이 대기한다. 화석 이름은 데이터베이스의 한국어 이름 열을 기준으로 한다.\n\n'
             '수선용 천은 소비 스택 대신 수선 의뢰 진행품으로 관리한다. SQ03 완료 때 단계가 바뀌며 재발급은 중복 따라큐 지급을 만들지 않는다. '
             '낚싯대·승선권·피리·쐐기돌·공명 관측기는 NPC 재발급 경로를 둔다.\n')
    write('개발용_아이템데이터베이스.md',text)


def render_moves():
    text = '# 개발용 기술 데이터베이스\n\n' + COMMON
    text += (f'## 1. 현재 선정 기술\n\n체육관의 모든 선택 단계 팀, 배지 보상 TM, 기술 습득 진화에 필요한 **{len(MOVE_DB)}개 기술**이다. '
             '전 도감의 전체 레벨업 기술표를 완성한 것이 아니다. 기술의 수치 출처는 [moves.csv](' + SOURCE_BASE + 'moves.csv), '
             '관장 팀의 습득 가능 근거는 [pokemon_moves.csv](' + SOURCE_BASE + 'pokemon_moves.csv)다.\n\n'
             '현재 수치는 스냅샷의 값이며 원작 플라티나 수치만을 뜻하지 않는다. 습득 근거는 1~8세대의 기본 모습 기록을 합친 프로젝트 제안이다. '
             '변화기·가변 위력의 `—`는 0위력이 아니다. 명중 `—`도 명중률0이 아니라 별도 판정 또는 필중 처리 검토 대상이다.\n\n')
    text += md_table(['기술 ID','한국어 이름','타입','분류','위력','명중','PP','우선도','원자료 효과 ID'],
        [[f"MV-{m['id']:04d}",m['name'],m['type'],m['category'],m['power'] if m['power'] is not None else '—',
          m['accuracy'] if m['accuracy'] is not None else '—',m['pp'],m['priority'],m['effectId']] for m in MOVE_DB])
    text += ('\n## 구현 경계\n\n효과 ID는 원자료의 참조 키이지 현재 게임이 실행할 수 있는 함수가 아니다. '
             '피해·상태·날씨·필드·교체·반동·회복·흡수·턴 지연을 각 효과 구현으로 연결해야 한다. '
             '추가 효과 확률·대상 ID와 관장 개체별 습득 근거는 [moves.json](design-data/moves.json) 및 '
             '[gyms.json](design-data/gyms.json)에 보존했다.\n\n'
             '먼저 몸통박치기·전기쇼크·울음소리 같은 작은 기술 집합으로 전투를 검증한 후 체육관별 필요한 효과를 늘린다. '
             '미구현 기술을 이름만 표시한 채 전투 가능 팀으로 출하하지 않는다.\n')
    write('개발용_기술데이터베이스.md',text)


QUEST_DB = []
MAIN_ROWS = []
for line in STORY_TEXT.splitlines():
    if re.match(r'^\| CH\d{2} ',line):
        c=[x.strip() for x in line.strip('|').split('|')]
        if len(c)==5:
            qid=c[0].split()[0]
            QUEST_DB.append({'id':qid,'name':c[0][5:],'kind':'본편','places':c[1],'action':c[2],'condition':c[3],'result':c[4]})

SIDE = [
('SQ01','작은 불빛들의 숲','K05','CH03; 숨은 숲 발견','피츄','IT-light-ball KEY-mending-cloth'),
('SQ02','여덟 개의 길','K08','CH03; 하린 소개','이브이',''),
('SQ03','천 아래의 친구','K11','CH03; 밤 방문; 천 대체 의뢰 가능','따라큐',''),
('SQ04','호수의 오래된 목격담','J09','CH04; 송신기 정지·구조','갸라도스',''),
('SQ05','말보다 먼저 닿는 것','S11','CH02; 갱도 구조','리오르',''),
('SQ06','돌아오지 않는 마을','U13','CH06; 환상·보호처 조사','조로아',''),
('SQ07','유령열차','U04','CH06; 밤/게임 내 예약','불켜미',''),
('SQ08','검이 지키는 빈 왕좌','U15','CH06; 유적 시험','단칼빙','IT-dusk-stone'),
('SQ09','비가 그친 수련장','U12','CH06; 수상·은신·구조 시험','개구마르',''),
('SQ10','산이 화낸 이유','J16','CH05; 산기슭 구조','애버라스',''),
('SQ11','서로 다른 두 약속','S07','CH01; 두 트레이너 보호 의뢰','랄토스',''),
('SQ12','잘못 배달된 프로그램','K09','CH03; 데이터 복구','폴리곤',''),
('SQ13','꺼지지 않는 TV','S05','CH03; TV·배선 조사','로토무',''),
('SQ14','돌틈에 남은 목소리','S18','CH08; 사연 기록·쐐기돌','화강돌',''),
('SQ15','돌아오는 배','J07/S18','지역 도착; 게임 내 시간 예약','라프라스 흔들풍손',''),
('SQ16','읽을 수 없는 문장','J14','CH04; 탁본 조사','안농','KEY-rubbing-kit'),
]
for qid,name,node,condition,mons,item_ids in SIDE:
    QUEST_DB.append({'id':qid,'name':name,'kind':'지역 사건','places':node,'condition':condition,
        'speciesRewards':[sid(n) for n in mons.split()], 'itemRewards':item_ids.split(),
        'result':'사건 해결과 포켓몬 수령 분리. 패배·거절·가방 가득 참 뒤 재제안 가능'})
for line in STORY_TEXT.splitlines():
    if re.match(r'^\| PG\d{2} ',line):
        c=[x.strip() for x in line.strip('|').split('|')]
        if len(c)==4:
            qid=c[0].split()[0]
            QUEST_DB.append({'id':qid,'name':c[0][5:],'kind':'후일담','places':c[1],'condition':c[3], 'result':c[2]})
CORE_LEGENDS = {sid(n) for n in '뮤츠 라이코 앤테이 스이쿤 칠색조 루기아 레시라무 제크로무 디아루가 펄기아 기라티나'.split()}
for line in STORY_TEXT.splitlines():
    if not line.startswith('| '): continue
    c=[x.strip() for x in line.strip('|').split('|')]
    if len(c)==4 and c[0] in NAME_IDS and sid(c[0]) in CORE_LEGENDS and re.search(r'[SKJUX]\d{2}',c[2]):
        i=sid(c[0])
        QUEST_DB.append({'id':f'LEG-{i:04d}','name':c[0]+' 후일담','kind':'핵심 전설',
            'places':c[2],'condition':c[3],'encounterSpecies':[i],
            'result':'사건 해결 후 포획 선택. 해결 플래그와 소유 플래그 분리, 패배·도주 후 재도전'})
for idx,entry in enumerate(AUTO_GIFTS,1):
    QUEST_DB.append({'id':f'CARE-{entry["speciesId"]:04d}','name':NAMES[entry['speciesId']]+' 보호 의뢰',
        'kind':'도감 보완','places':entry['node'],'condition':entry['chapter'],
        'speciesRewards':[entry['speciesId']],'itemRewards':[], 'result':entry['condition']})


def render_quests():
    text = '# 개발용 퀘스트 데이터베이스\n\n' + COMMON
    text += (f'## 1. 구성\n\n본편 CH·지역 사건 SQ·후일담 PG와 도감 보완 보호 의뢰를 합쳐 **{len(QUEST_DB)}개 관리 레코드**다. '
             '기존 스토리의 챕터·퀘스트 ID를 유지하고 핵심 전설 11종의 LEG 사건 ID를 추가했다. 포켓몬·아이템 보상 ID는 다른 DB와 연결했다. '
             '동일 포켓몬이 야생과 선물 양쪽에 있는 경우 선물의 고유 개체와 야생 개체는 다르며 선물 중복을 허용하는 뜻이 아니다.\n\n')
    text += md_table(['퀘스트 ID','이름','종류','장소','개시·완료 조건','결과·보상'],
        [[q['id'],q['name'],q['kind'],q['places'],q['condition'],
          q.get('result','')+' '+', '.join(label(i) for i in q.get('speciesRewards',[]))+' '+', '.join(q.get('itemRewards',[]))] for q in QUEST_DB])
    text += ('\n## 2. 저장과 재진입\n\n'
             '제안 상태는 `미발견 → 진행 → 해결 → 보상 수령`이다. 포켓몬과 중요한 아이템 지급은 각각 idempotent한 보상 ID를 가진다. '
             '대화 페이지나 콜백을 저장하지 않는다. 현재 박스와 세 스타팅의 첫 진화는 별도 런타임 계약으로 구현됐지만, 이 표의 범용 퀘스트 상태·알·부화·나머지 진화·보상은 추가 저장 이행이 필요하다.\n\n'
             '목표는 이야기 속 행동과 수치 조건을 함께 표시한다. 특정 포켓몬을 소유해야 한다면 대체 해결 경로를 먼저 설계한다. '
             '따라큐를 수선방에 남겨도 사건은 완료되고 나중에 동행 제안 가능하다. 전설을 포획하지 않아도 사건 해결 조건을 만족할 수 있다.\n\n'
             'CARE 의뢰는 추가 종의 획득 누락을 막기 위한 제작 후보다. 장소·대상이 지정되었지만 개별 NPC 이름과 대사를 아직 구현한 것은 아니다. '
             '해당 종의 야생·선물 경로를 실제로 구현한 뒤 불필요한 CARE를 제거하되 도감 획득 경로 검사를 통과해야 한다.\n')
    write('개발용_퀘스트데이터베이스.md',text)


def render_index():
    text = '# 개발용 데이터베이스 안내\n\n작성일: 2026-09-06 · v0.1 · 기획 데이터\n\n'
    text += ('## 1. 문서 목록\n\n현재 게임 구현은 [DEVELOPMENT.md](DEVELOPMENT.md)와 [STORY.md](STORY.md), '
             '큰 이야기와 지리는 [스토리 초안](개발용_초안스토리.md)·[맵 초안](개발용_초안맵.md)을 따른다. '
             '이번 묶음은 사용자가 요청한 도감·체육관·아이템과 이들을 연결하는 상세 DB다.\n\n')
    text += md_table(['문서','책임','현재 수량'],[
        ['[포켓몬도감](개발용_포켓몬도감.md)','전국번호·기본 모습·타입·종족값·특성·획득 권역',len(SPECIES_DB)],
        ['[지역별 출현표](개발용_지역별출현표.md)','90권역의 야생·고정·선물·원작 참고 기록',str(len(POOLS))+' 야생 풀'],
        ['[진화 DB](개발용_진화데이터베이스.md)','진화 간선·원자료 조건·프로젝트 조건·도구',len(EVOLUTION_DB)],
        ['[체육관 DB](개발용_체육관데이터베이스.md)','32관장·배지·단계별 팀·기술·특성·소지품',32],
        ['[아이템 DB](개발용_아이템데이터베이스.md)','효과·가격·입수·소모·중요품·TM',len(ITEM_DB)],
        ['[기술 DB](개발용_기술데이터베이스.md)','선정 기술의 수치와 원자료 효과 참조',len(MOVE_DB)],
        ['[퀘스트 DB](개발용_퀘스트데이터베이스.md)','본편·지역 사건·후일담·보호 의뢰의 조건과 보상',len(QUEST_DB)]])
    text += ('\n## 2. 원작 자료와 프로젝트 제안의 경계\n\n'
             '한국어 도감 표기·모습 개념은 [포켓몬코리아 공식 도감](https://www.pokemonkorea.co.kr/pokedex)을 우선 참고했다. '
             '따라큐는 [공식 개별 도감](https://pokemonkorea.co.kr/pokedex/view/987)의 고스트·페어리 기본 종으로 대조했다. '
             '분류·수치·진화·조우를 대량으로 연결하기 위해 [PokéAPI 프로젝트](https://github.com/PokeAPI/pokeapi)의 공개 자료를 사용했다. '
             'PokéAPI는 포켓몬 공식 배급사의 데이터베이스가 아닌 커뮤니티 프로젝트다. 모든 원자료 행의 공식 검증을 완료했다는 주장은 하지 않는다.\n\n'
             f'원자료 커밋은 `{SHA}`, 커밋 일시는 2026-09-03T19:01:48Z다. '
             '조회 기준일은 2026-09-06이다. 파일별 SHA-256과 크기는 [출처 명세](design-data/source-manifest.json)에 기록했다. '
             '프로그램은 동일 커밋 파일을 로컬 캐시에 보관해 반복 다운로드를 피한다. [PokéAPI 문서](https://pokeapi.co/docs/v2)의 읽기·캐시 원칙을 참고했다.\n\n')
    text += md_table(['필드','근거 / 결정 수준'],[
        ['전국번호·기본 종 이름·타입·종족값·특성','고정 원자료 스냅샷. 공식 이름 일부 대조, 전체 행 공식 개별 검증은 아님'],
        ['원작 조우 예시','버전+원작 장소+방법+조건+레벨+encounter ID를 보존한 커뮤니티 자료'],
        ['NEXUS 조우 확률·레벨·시간·이동 후 개방','창작 배치. 원작에서 그대로 추출한 값이 아님'],
        ['진화 규칙','8세대까지 기본 모습 자료 참고. 교환 대체·이브이 탐험 등 프로젝트 변경을 별도 표시'],
        ['관장·도시·타입','원작 배치 참고, 4지방 동시대와 일부 팀 테마는 재구성'],
        ['관장 팀·상금·보상·선택 체육관 단계','프로젝트 설계. 기술 습득 근거는 1~8세대 합집합을 명시'],
        ['아이템 가격·효과 선택·개방','프로젝트 규칙. 원작 모든 세대와 동일하다고 주장하지 않음'],
        ['현재 구현','실사용 지도 391개, 런타임 33종 중 26종 소유 가능, 설계 풀 5개, 첫 진화 3개, 신오 체육관 4개, 제한된 기술·상점·박스·도감. 전체 DB 구현은 아님']])
    text += ('\n## 3. 데이터 파일과 수정 순서\n\n'
             '편집 입력은 [nexus-plan.json](design-data/nexus-plan.json)이다. 원작 사실을 바꾸지 않고 배치·팀·가격 등을 수정한다. '
             '생성 결과는 [pokemon.json](design-data/pokemon.json), [encounters.json](design-data/encounters.json), '
             '[evolutions.json](design-data/evolutions.json), [gyms.json](design-data/gyms.json), '
             '[items.json](design-data/items.json), [moves.json](design-data/moves.json), [quests.json](design-data/quests.json)이다. '
             '이 JSON 전체를 게임이 자동 로드하지 않는다. `scripts/design/export-runtime-pokemon.py`가 선택한 조우·종·진화·기술 자료만 `src/runtime-pokemon-data.json`으로 추출한다. 세부 출현·진화·보상 수치는 이번 DB를 우선하고, '
             '큰 장 순서·지역 이동·기존 구현 계약은 앞선 스토리·맵·기준 문서를 유지한다.\n\n'
             '```powershell\npython -X utf8 scripts/design/build_databases.py\n```\n\n'
             '생성기는 [이전 맵](개발용_초안맵.md)의 90노드·32체육관·123종 표도 읽는다. 기존 표의 열 구조를 바꾸면 파서와 검사도 함께 고쳐야 한다. '
             '문서를 직접 고치기보다 입력 JSON 또는 생성기의 해당 설명을 고친 뒤 재생성한다. 참고 커밋을 바꾸려면 원자료 변경 영향과 이름·조건 차이를 검토한다.\n\n'
             '## 4. ID와 참조 계약\n\n'
             '전국번호는 원작 species ID, 장소는 기존 S/K/J/U/X, 체육관은 GS/GK/GJ/GU를 유지한다. '
             '`ENC-`는 야생 풀, `EV-이전-이후`는 진화, `IT-`는 원작 아이템 기반, `KEY-`는 중요한 물건, '
             '`TM-기술명`은 프로젝트 기술머신이며 원작 버전별 TM 번호와 혼동하지 않는다. '
             '`MV-` 뒤 숫자는 원자료 기술 ID, `BADGE-체육관ID`는 프로젝트 배지다.\n\n'
             '기존 종 ID·MapId·수령 플래그는 변경하지 않는다. 현재 저장 version 1 / worldRevision 23은 박스·도감·선택 기술·첫 진화를 지원한다. 그 밖의 진화 조건·새 배지·가방 분류를 구현할 때는 기존 저장 이행을 먼저 설계한다. 게임의 기존 `grantPokemon()`을 모든 선물에 그대로 재사용하면 일반 스타팅 제한과 충돌한다.\n\n'
             '## 5. 검사와 미완성 범위\n\n'
             '생성 시 요청123종 누락, 종·진화 부모·필요 도구·체육관 팀·기술 습득 근거·퀘스트 보상·장소 참조·풀 가중치·문서 링크를 검사한다. '
             '[validation.json](design-data/validation.json)에 이번 생성 결과를 남긴다. 수록 후보의 자료 검증이며 실제 게임 밸런스·브라우저 플레이 통과가 아니다.\n\n'
             '현재 선택 범위 밖의 레벨업 기술표·모든 기술 효과·32관장의 전체 AI·사천왕 세부 팀·모든 폼·타일별 보물 좌표는 아직 별도 제작 대상이다. '
             '첫 도로의 작은 종 집합부터 구현하고 각 체육관 단위로 확장한다. 이름만 있는 기술이나 파일만 있는 포켓몬을 플레이 가능으로 표시하지 않는다.\n')
    write('개발용_데이터베이스_안내.md',text)


def validate():
    ids={x['nationalId'] for x in SPECIES_DB}
    assert len(ids)==len(SPECIES_DB)
    assert all(r['id'] in ids for r in REQUESTED)
    item_ids={x['id'] for x in ITEM_DB}
    assert len(item_ids)==len(ITEM_DB), 'Duplicate item ID'
    assert len(GYM_DB)==32 and sum(x['mandatory'] for x in GYM_DB)==20
    for s in SPECIES_DB:
        assert len(s['stats'])==6 and s['types'] and s['abilities']
        assert all(n in NODES for n in s['familyNodes'])
        assert s['directAcquisition'] or s['evolvesFrom'], 'No acquisition: '+s['name']
    for p in POOLS:
        assert sum(s['weight'] for s in p['slots'])==100
        assert all(s['speciesId'] in ids for s in p['slots'])
    for e in EVOLUTION_DB:
        assert e['from'] in ids and e['to'] in ids
        assert all(i in item_ids for i in e['requiredItems']), e['id']
    for g in GYM_DB:
        assert g['node'] in NODES and g['rewardItem'] in item_ids
        for v in g['variants']:
            for m in v['party']:
                assert m['speciesId'] in ids and len(set(m['moves']))==4
                assert m['heldItem'] is None or m['heldItem'] in item_ids
                assert g['type'] in [TYPE_NAMES[t] for _,t in TYPES[DEFAULT[m['speciesId']]]], (g['id'],NAMES[m['speciesId']],g['type'])
    for item in ITEM_DB: assert item['node'] in NODES, item['id']
    for q in QUEST_DB:
        assert all(i in ids for i in q.get('speciesRewards',[])),q['id']
        assert all(i in item_ids for i in q.get('itemRewards',[])),q['id']
    files=list(DOCS.glob('개발용_*.md'))+[DOCS/'DEVELOPMENT.md',DOCS/'STORY.md']
    links=0
    for path in files:
        content=path.read_text(encoding='utf8')
        assert '\ufffd' not in content, path.name
        assert len(re.findall(r'^```',content,re.M))%2==0,path.name
        for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)',content):
            if target.startswith(('http:','https:','#')):continue
            target=target.split('#')[0]
            assert (path.parent/target).exists(),(path.name,target)
            links+=1
    return {'date':PLAN['date'],'referenceCommit':SHA,'status':'PASS','species':len(SPECIES_DB),
        'requestedCovered':123,'nodes':len(NODES),'wildPools':len(POOLS),'evolutions':len(EVOLUTION_DB),
        'gyms':len(GYM_DB),'mandatoryGyms':20,'optionalGyms':12,
        'gymVariants':sum(len(g['variants']) for g in GYM_DB),'items':len(ITEM_DB),'moves':len(MOVE_DB),
        'quests':len(QUEST_DB),'documentLinksChecked':links,
        'sourceEvolutionTagWarnings':sum(e['sourceTagPredatesSpecies'] for e in EVOLUTION_DB),'runtimeImplemented':False}


if __name__ == '__main__':
    OUT.mkdir(exist_ok=True,parents=True)
    for filename,data in [('pokemon.json',SPECIES_DB),('encounters.json',POOLS),('evolutions.json',EVOLUTION_DB),
        ('gyms.json',GYM_DB),('items.json',ITEM_DB),('moves.json',MOVE_DB),('quests.json',QUEST_DB)]:
        write_json(filename,data)
    write_json('source-manifest.json',{'commit':SHA,'retrievedOn':PLAN['date'],'files':MANIFEST,
        'source':'https://github.com/PokeAPI/pokeapi','scope':'design-reference, not runtime'})
    # Existence is needed for the doc-link check; never leave a stale PASS on failure.
    write_json('validation.json',{'status':'PENDING'})
    generate_documents()
    report=validate()
    write_json('validation.json',report)
    print(json.dumps(report,ensure_ascii=False,indent=2))
