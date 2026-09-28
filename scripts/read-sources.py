"""
Reads the two Ministry sources in data/sources/ into small JSON files the
builds can embed.

  data/sources/moh-register.csv        the register of registered medicines
                                       (5,214 products; no barcodes)
  data/sources/ncds-essential-drugs-list-2023.pdf / .txt
                                       the NCDS Essential Drugs List, 25 Jul 2023
                                       (the .txt is its text, extracted once)

Writes:
  data/register.json   the register, one trimmed row per product (CRM only)
  data/edl.json        the EDL: national code, item text, class — and, per
                       molecule in data/drugs.mjs, the codes that name it

  python3 scripts/read-sources.py

Both sources are "for now" — the user will replace them with firmer ones.
Nothing here decides what is controlled: neither source is a schedule.
"""
import csv, json, re, subprocess, os

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'data', 'sources')
clean = lambda s: re.sub(r'\s+', ' ', (s or '').replace(' ', ' ')).strip()

# ---------- the register ----------
rows = list(csv.reader(open(os.path.join(SRC, 'moh-register.csv'), encoding='utf-8', errors='replace')))
register = []
for r in rows[1:]:
    r = (r + [''] * 12)[:12]
    code, sci, trade, pack, maker, country, mah, reg_old, reg, notes, shelf = [clean(x) for x in r[:11]]
    if not (sci or trade):
        continue
    register.append({ 'id': 'R%04d' % (len(register) + 1), 'code': code or None, 'sci': sci, 'trade': trade, 'pack': pack,
                      'maker': maker, 'country': country, 'mah': mah or None, 'regOld': reg_old or None, 'reg': reg or None,
                      'notes': notes or None, 'shelfLife': shelf or None })
json.dump(register, open(os.path.join(ROOT, 'data', 'register.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

# ---------- the Essential Drugs List ----------
text = open(os.path.join(SRC, 'ncds-essential-drugs-list-2023.txt'), encoding='utf-8').read()
arabic = re.compile(r'[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]+')
classes = {}
for line in text.split('\n'):
    m = re.match(r'^(\d{1,2}[A-Z]{0,3})\s+([A-Za-z][A-Za-z0-9 ,()\-/&\'.]{3,})', line)
    if m and not re.match(r'^\d{2}-', line):
        key = m.group(1)
        if key not in classes:
            classes[key] = clean(arabic.sub('', m.group(2))).rstrip(' -').title()
UNITS = r'(Tablet|tablet|Ampoul|ampoul|vial|Vial|bottle|Bottle|Capsule|capsule|tube|Tube|sachet|Sachet|pen|Pen|inhaler|Inhaler|supp|Supp|bag|Bag)\b'
def tidy(s):
    # The list's text runs on into its own columns: a unit ("Tablet",
    # "Ampoul"), a stray page number ("976", "\\1070"). Keep the item, drop
    # the run-on, and space the units ("250mg" -> "250 mg").
    s = re.sub(r'(\d)(mg|mcg|ml|g|iu|IU)(?=[A-Za-z(]|\b)', r'\1 \2', s)
    s = re.sub(r'(\d (?:mg|mcg|ml|g))(?=[A-Z])', r'\1 ', s)
    s = re.sub(r'\s*\\?\d{3,4}\s*$', '', s).strip()
    # One unit column only: "Tablet or scored Tablet Tablet" keeps its last "Tablet".
    m = re.search(r'\s+(' + UNITS[1:-4] + r')e?s?(\s+or)?\s*$', s)
    if m and re.search(r'\b' + m.group(1)[:5], s[:m.start()], re.I):
        s = s[:m.start()].rstrip(' ,')
    return re.sub(r'\s{2,}', ' ', s).strip()

items = []
for m in re.finditer(r'(\d{2})-([A-Z0-9]{3})-(\d{3})\s*(.*)', text):
    code = '%s-%s-%s' % (m.group(1), m.group(2), m.group(3))
    if any(i['code'] == code for i in items):
        continue
    raw = clean(arabic.sub(' ', m.group(4)))
    raw = re.split(r'\s+\d{2}-[A-Z0-9]{3}-\d{3}', raw)[0]
    group = str(int(m.group(1))) + re.sub(r'[0-9]', '', m.group(2))
    items.append({ 'code': code, 'item': tidy(raw)[:160], 'group': group, 'class': classes.get(group) or classes.get(group[:len(str(int(m.group(1)))) + 1]) or classes.get(str(int(m.group(1)))) })

# Which molecules of the drug reference each item names.
drugs = json.loads(subprocess.check_output(['node', '--input-type=module', '-e',
    "import D from './data/drugs.mjs'; console.log(JSON.stringify(D.map(d => d.sci)))"], cwd=ROOT))
ALIAS = { 'Furosemide': [['frusemide']], 'Phenobarbital': [['phenobarbitone']], 'Paracetamol': [['acetaminophen']],
          'Levothyroxine': [['thyroxine']], 'Salbutamol': [['albuterol']], 'Glyceryl trinitrate': [['nitroglycerin']],
          'Cholecalciferol': [['vitamin d3']], 'Ferrous sulfate': [['ferrous sulphate']], 'Aspirin': [['acetylsalicylic acid']],
          'Amoxicillin': [['amoxycillin']], 'Amoxicillin/Clavulanic acid': [['amoxycillin', 'clavulanic acid'], ['co-amoxiclav']],
          'Trimethoprim/Sulfamethoxazole': [['co-trimoxazole'], ['cotrimoxazole'], ['sulphamethoxazole', 'trimethoprim']],
          'Insulin glargine': [['glargine']], 'Beclometasone': [['beclomethasone']], 'Hyoscine butylbromide': [['hyoscine butyl']] }
def names(sci):
    return [[p.strip().lower() for p in sci.split('/')]] + ALIAS.get(sci, [])
by_drug = {}
for sci in drugs:
    hits = []
    for it in items:
        t = it['item'].lower()
        if any(all(re.search(r'\b' + re.escape(p) + r'\b', t) for p in alt) for alt in names(sci)):
            # a single molecule never claims a combination item it is only part of
            if '/' not in sci and re.search(r'\+|\band\b', t):
                continue
            hits.append(it['code'])
    if hits:
        by_drug[sci] = hits
json.dump({ 'source': 'NCDS Essential Drugs List, 25 Jul 2023 (list 1188)', 'classes': classes, 'items': items, 'byDrug': by_drug },
          open(os.path.join(ROOT, 'data', 'edl.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('register', len(register), '· EDL items', len(items), '· classes', len(classes), '· reference drugs on the EDL', len(by_drug), 'of', len(drugs))

# ---------- the catalogue, linked to its registrations ----------
# A catalogue product (it has a barcode; the register has none) is linked to a
# register row only when its trade name and its strength both agree, and one
# row is clearly the best. No link is better than a wrong one.
products = json.loads(subprocess.check_output(['node', '--input-type=module', '-e',
    "import P from './data/products.mjs'; console.log(JSON.stringify(P.map(p => ({ b:p.barcode, n:p.name.en, s:p.strength, f:p.form }))))"], cwd=ROOT))
def toks(s):
    s = (s or '').lower().replace('®', ' ').replace('™', ' ')
    s = re.sub(r'(\d)\s*(mg|mcg|g|ml|%|iu|units?)\b', r'\1', s)
    return [w for w in re.split(r'[^a-z0-9.]+', s) if w and w not in ('tab', 'tabs', 'tablet', 'tablets', 'caps', 'capsule', 'capsules',
            'film', 'coated', 'syrup', 'cream', 'the', 'for', 'of', 'mg', 'ml', 'and', 'oral', 'solution', 'injection')]
links = {}
for p in products:
    a = toks(p['n']); nums = [w for w in a if re.match(r'^\d', w)]; words = [w for w in a if not re.match(r'^\d', w)]
    if not words: continue
    scored = []
    for r in register:
        b = toks(r['trade'])
        if words[0] not in b: continue                       # the brand word must be there
        inj = re.search(r'\b(amp|ampoules?|inj|injection|vials?|infusion)\b', r['trade'].lower() + ' ' + r['pack'].lower())
        if bool(inj) != (p['f'] == 'injection'): continue    # a tablet is not its ampoule
        rn = [w for w in b if re.match(r'^\d', w)]
        if nums and rn and not all(n in rn for n in nums): continue   # a strength that disagrees is another product
        sc = sum(1 for w in words if w in b) / len(words) + (0.5 if nums and all(n in rn for n in nums) else 0)
        scored.append((sc, r))
    scored.sort(key=lambda x: -x[0])
    if scored and scored[0][0] >= 1 and (len(scored) == 1 or scored[1][0] < scored[0][0] or scored[1][1]['trade'].lower() == scored[0][1]['trade'].lower()):
        r = scored[0][1]
        full = r['reg'] or r['regOld'] or ''
        m = re.match(r'^\s*([0-9A-Za-z]+\s*/\s*[0-9]{1,2}-[0-9]{1,2}-[0-9]{4})', full)
        links[p['b']] = { 'id': r['id'], 'trade': r['trade'], 'reg': m.group(1).replace(' ', '') if m else full[:40],
                          'regNote': full[m.end():].strip() or None if m else None, 'holder': r['mah'] or r['maker'], 'country': r['country'] }
json.dump(links, open(os.path.join(ROOT, 'data', 'product-registrations.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('catalogue products linked to a registration:', len(links), 'of', len(products))

# ---------- v0.0015.1: every registered product, for the app's catalogue ----------
# Each register row becomes a product with no barcode yet. Its ingredients are
# the reference drugs its scientific name names (so the Helper can check it);
# its control, from data/controlled.json (the UN lists until Iraq's own). A
# registration the register notes as cancelled is left out; a suspended one is
# kept, marked, and not offered for sale.
CONTROL = json.load(open(os.path.join(ROOT, 'data', 'controlled.json'), encoding='utf-8'))['substances']
FORMS = [('injection', r'\b(amp|ampoules?|inj|injection|vials?|infusion|i\.?v\.?)\b'), ('inhaler', r'\b(inhaler|inhalation|evohaler|diskus|turbuhaler)\b'),
         ('spray', r'\bspray\b'), ('drops', r'\bdrops?\b'), ('suppository', r'\bsupp(ository|ositories)?\b'), ('pessary', r'\bpessar'),
         ('patch', r'\bpatch'), ('sachet', r'\bsachets?\b'), ('syrup', r'\b(syrup|susp|suspension|elixir)\b'),
         ('ointment', r'\boint(ment)?\b'), ('cream', r'\bcream\b'), ('gel', r'\bgel\b'), ('capsule', r'\bcap(s|sule|sules)?\b'),
         ('tablet', r'\b(tab|tabs|tablets?|caplets?)\b'), ('solution', r'\b(solution|sol\.?|lotion)\b')]
def form_of(r):
    t = (r['trade'] + ' ' + (r['pack'] or '') + ' ' + (r['sci'] or '')).lower()
    for f, rx in FORMS:
        if re.search(rx, t): return f
    return None
def strength_of(r):
    m = re.search(r'(\d+(?:\.\d+)?\s*(?:mg|mcg|µg|g|iu|%)(?:\s*/\s*\d*(?:\.\d+)?\s*(?:ml|g))?)', (r['sci'] or '') + ' ' + r['trade'], re.I)
    return re.sub(r'\s+', ' ', m.group(1)).replace(' /', '/').replace('/ ', '/') if m else ''
def status_of(r):
    n = r['notes'] or ''
    if re.search(r'الغاء|إلغاء', n) and not re.search(r'رفع', n): return 'cancelled'
    if re.search(r'تعليق|ايقاف|إيقاف', n) and not re.search(r'رفع تعليق', n): return 'suspended'
    return None
def trade_name(s):
    s = clean(s)
    return ' '.join(w.capitalize() if w.isupper() and len(w) > 2 and not re.search(r'\d', w) else w for w in s.split(' '))
def molecules_of(sci):
    t = (sci or '').lower()
    hits = [d for d in drugs if any(all(re.search(r'\b' + re.escape(p) + r'\b', t) for p in alt) for alt in names(d))]
    # a combination entry of the reference replaces the single molecules it contains
    for d in [h for h in hits if '/' in h]:
        for part in d.split('/'): hits = [h for h in hits if h.lower() != part.strip().lower()]
    return hits
def control_of(sci):
    t = (sci or '').lower()
    out = []
    for c in CONTROL:
        if any(re.search(r'\b' + re.escape(n.lower()) + r'\b', t) for n in [c['name']] + c.get('aliases', [])): out.append(c['name'])
    return out
regp, skipped = [], 0
for r in register:
    st = status_of(r)
    if st == 'cancelled': skipped += 1; continue
    regp.append([r['id'], trade_name(r['trade']), clean(r['sci'])[:160], clean(r['pack'] or '')[:90], form_of(r), strength_of(r),
                 molecules_of(r['sci']), control_of(r['sci']), st, (r['reg'] or r['regOld'] or '')[:30], r['maker'] or '', r['country'] or ''])
json.dump({ 'fields': ['id', 'trade', 'sci', 'pack', 'form', 'strength', 'molecules', 'control', 'status', 'reg', 'maker', 'country'], 'rows': regp },
          open(os.path.join(ROOT, 'data', 'register-products.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('register products for the app:', len(regp), '· cancelled left out:', skipped,
      '· suspended:', sum(1 for x in regp if x[8] == 'suspended'), '· linked to the reference:', sum(1 for x in regp if x[6]),
      '· controlled or precursor:', sum(1 for x in regp if x[7]))

# ---------- v0.0015.1: the EDL's generics that the reference does not have ----------
def generic_of(item):
    s = re.sub(r'\([^)]*\)', ' ', item)
    # the name ends where a strength, an "or", a "with", a salt's "as", or a pharmacopoeia begins
    s = re.split(r'\d|\bor\b|\bwith\b|\bas\b|:|;|,|\bPh\.?\s?Eur|\bB\.?P\.?\b|\bUSP\b', s, flags=re.I)[0]
    s = re.split(r'\s\d|\s(?:tablet|tab|capsule|cap|syrup|suspension|injection|ampoule|vial|cream|ointment|drops?|inhaler|each|sachet|powder|solution|gel|suppository|oral|eye|ear|nasal|topical|for)\b', s, flags=re.I)[0]
    s = re.split(r'\s(?:conc|suspention|liquid|IV|infusion|preparation|eq)\b', s, flags=re.I)[0]
    s = re.sub(r'\s{2,}', ' ', s).strip(' ,.-+/')
    return '' if re.match(r'^(one|each|every)\b', s, re.I) else s
SALTS = r'\b(hydrochloride|hcl|sulphate|sulfate|sodium|potassium|calcium|maleate|mesylate|mesilate|acetate|tromethamine|dihydrate|trihydrate|anhydrous|citrate|phosphate|bromide|tartrate)\b'
norm = lambda x: re.sub(r'\s+', ' ', re.sub(SALTS, '', x.lower())).strip().replace('y', 'i').replace('ph', 'f')
known = set(n.lower() for d in drugs for alt in names(d) for n in alt)
known_n = set(norm(n) for n in known) | set(norm(d) for d in drugs)
gens = {}
for it in items:
    g = generic_of(it['item'])
    if len(g) < 4 or not re.match(r'^[A-Za-z]', g): continue
    key = g.lower()
    if key in known or any(key == d.lower() for d in drugs) or norm(key) in known_n: continue
    if any(it['code'] in v for v in by_drug.values()): continue
    e = gens.setdefault(key, { 'sci': g[0].upper() + g[1:], 'items': [] })
    e['items'].append({ 'code': it['code'], 'item': it['item'], 'cls': it['class'] })
json.dump(sorted(gens.values(), key=lambda e: e['sci'].lower()),
          open(os.path.join(ROOT, 'data', 'edl-generics.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('EDL generics not in the reference:', len(gens))
