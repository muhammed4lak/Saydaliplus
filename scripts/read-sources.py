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
clean = lambda s: re.sub(r'\s+', ' ', (s or '').replace('\u00a0', ' ')).strip()

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
# A molecule is named by its scientific name, its other names (aka) and the
# spellings below. Skin and eye forms of a molecule that also comes as
# tablets are entries of their own, "<name> (topical)" and "<name> (eye)":
# a product goes to the one its form says (eye and ear drops to "(eye)",
# then "(topical)"; creams, gels, ointments, lotions, shampoos and vaginal
# forms to "(topical)"; everything else to the plain name).
REF = json.loads(subprocess.check_output(['node', '--input-type=module', '-e',
    "import D from './data/drugs.mjs'; console.log(JSON.stringify(D.map(d => ({ sci: d.sci, aka: d.aka || [], brand: d.brand || [], cat: d.cat }))))"], cwd=ROOT))
drugs = [d['sci'] for d in REF]
AKA = { d['sci']: d['aka'] for d in REF }
# Spellings and abbreviations the sources use that are not names worth
# showing (each alternative is a list of words that must all be there).
ALIAS = { 'Furosemide': [['frusemide']], 'Phenobarbital': [['phenobarbitone']], 'Paracetamol': [['acetaminophen']],
          'Levothyroxine': [['thyroxine']], 'Salbutamol': [['albuterol']], 'Glyceryl trinitrate': [['nitroglycerin']],
          'Cholecalciferol': [['vitamin d3']], 'Ferrous sulfate': [['ferrous sulphate']], 'Aspirin': [['acetylsalicylic acid']],
          'Amoxicillin': [['amoxycillin']], 'Amoxicillin/Clavulanic acid': [['amoxycillin', 'clavulanic acid'], ['co-amoxiclav']],
          'Trimethoprim/Sulfamethoxazole': [['co-trimoxazole'], ['cotrimoxazole'], ['sulphamethoxazole', 'trimethoprim']],
          'Insulin glargine': [['glargine']], 'Beclometasone': [['beclomethasone']],
          'Insulin regular': [['insulin human', 'regular'], ['insulin human', 'soluble'], ['insulin human', 'neutral'], ['insulin neutral'], ['neutral insulin']],
          'Iron polymaltose': [['iron', 'polymaltose']], 'Ivy leaf extract': [['ivy leaves'], ['ivy leaf'], ['hedera helix'], ['hedra helix']],
          'Erythropoietin': [['erythropoetin'], ['epoetin α'], ['epoetin']], 'Iopromide': [['lopromide']],
          'Somatropin': [['somatotropin']], 'Scorpion antivenom': [['antiscorpion'], ['anti-scorpion'], ['anti scorpion']],
          'BCG vaccine': [['b.c.g']], 'Chloral hydrate': [['chloralhydrate']], 'Hydroxocobalamin': [['hydroxocobalamine']],
          'Hypromellose': [['hydroxypropyl methyl cellulose'], ['hypermellose']], 'Bupivacaine': [['bupivacain']],
          'Amphotericin B': [['amphotericin lipid'], ['liposomal amphotericin'], ['amphotericin']],
          'Alteplase': [['tissue type plasminogen activator'], ['tissue plasminogen activator']],
          'Sodium calcium edetate': [['disodium calcium edetate'], ['calcium disodium edetate']],
          'Diphtheria, tetanus and pertussis vaccine': [['d.p.t'], ['diphtheria', 'tetanus', 'pertus']],
          'Diphtheria and tetanus vaccine': [['diphtheria & tetanus'], ['td/adult'], ['dt/child']],
          'Poliomyelitis vaccine, oral': [['oral poliomyelitis'], ['oral polio']], 'Influenza vaccine': [['influenza', 'vaccine']],
          'Meningococcal vaccine': [['meningococcal', 'vaccine']], 'Measles vaccine': [['measles vial']],
          'Pentavalent vaccine': [['dpwt', 'hib']], 'Pneumococcal polysaccharide vaccine': [['streptococcus pneumonia', 'polysaccharide']],
          'Pneumococcal conjugate vaccine': [['pneumococcal', 'conjugate'], ['streptococcus pneumoniae', 'conjugate']],
          'Factor VIII inhibitor bypassing activity': [['anti-inhibitor coagulant']],
          'Thiamine': [['vitamin b1']], 'Pyridoxine': [['vitamin b6']], 'Cyanocobalamin': [['vitamin b12']], 'Riboflavin': [['vitamin b2']],
          'Naproxen': [['naproxcin']], 'Esomeprazole': [['esmoprazole'], ['esmoperazole']], 'Formoterol': [['formetrol']],
          'Risperidone': [['respirdone']], 'Sodium fluoride': [['fluorion']], 'Iron sucrose': [['ferric hydroxide sucrose'], ['iron sucrose']],
          'Omega-3 acid ethyl esters': [['docosahexaenoic'], ['eicosapentaenoic'], ['omega 3'], ['omega-3']],
          'Potassium chloride': [['pot. chloride'], ['pot chloride'], ['kcl']], 'Povidone-iodine': [['povidone', 'iodine']],
          'Factor VIII': [['octocog'], ['moroctocog'], ['maroctocogalfa'], ['turoctocog'], ['turoctocogalfa']],
          'Measles, mumps and rubella vaccine': [['measles virus', 'mumps virus'], ['measles', 'mumps', 'rubella']],
          'Water for injections': [['water for injection']], 'Compound sodium lactate': [['sodium lactate', 'calcium chloride'], ['ringer', 'lactate']],
          'Vitamin B complex': [['b1', 'b6', 'b12'], ['b1', 'b2', 'b6']], 'Pancreatin': [['amylase', 'lipase', 'protease'], ['pancrelipase']],
          'Piperazine': [['piprazine'], ['piprazin']], 'Beta-sitosterol': [['sitosterol']],
          'Hyoscine butylbromide': [['hyoscine butyl'], ['hyoscine-n-butyl']] + [[h, b] for h in ('hyoscine', 'hyosine', 'hyoscin', 'hyocin') for b in ('butyl', 'butylbromide')],
          'Insulin isophane': [['insulin human', 'isophane'], ['insulin human', 'nph'], ['insulin human', '30/70'], ['insulin human', '70/30'], ['biphasic isophane']] }
# Short abbreviations name a molecule only in capitals and only when they are
# unambiguous; "MR" (modified release) and "DT" (dispersible tablet) are not.
AMBIGUOUS = { 'MR', 'DT', 'Td', 'TT', 'Penta' }
ROUTE = re.compile(r'\s*\((topical|eye)\)$')
base_of = lambda sci: ROUTE.sub('', sci)
route_in = lambda sci: (ROUTE.search(sci) or [None, None])[1]
plain = lambda x: x.replace('\u2019', "'").lower()
def names(sci):
    alts = [[p.strip().lower() for p in base_of(sci).split('/')]]
    alts += [[plain(a)] for a in AKA.get(sci, []) if len(a) > 3 and a not in AMBIGUOUS]
    return alts + ALIAS.get(sci, [])
def acronyms(sci):
    return [a for a in AKA.get(sci, []) if len(a) <= 3 and a not in AMBIGUOUS]
def WB(p):
    left = r'(?<![A-Za-z])' if p[:1].isalpha() else r'(?<![A-Za-z0-9])'
    right = r'(?![A-Za-z])' if p[-1:].isalpha() else r'(?![A-Za-z0-9])'
    return re.compile(left + re.escape(p) + right)
MATCHERS = [(sci, [(alt[0], [WB(q) for q in alt]) for alt in names(sci)], [WB(a) for a in acronyms(sci)]) for sci in drugs]

# The register is typed by hand: words run together ("rivaroxaban20",
# "containsLactulose") and names are misspelt ("loratidine", "ceftriaxon").
# Before matching, split the run-ons and put each misspelt name back to the
# reference's spelling — only when one name is clearly the nearest.
def prep(text):
    t = (text or '').replace('\u2019', "'").replace('\u00a0', ' ').replace('\u2013', '-').replace('\u2014', '-')
    t = re.sub(r'(?i)\b(each|contains?|containing)(?=[a-z]{4})', r'\1 ', t)
    t = re.sub(r'(?<=[a-z])(?=H(Br|Cl|CL|BR)\b)', ' ', t)
    t = re.sub(r'(?<=[a-z])(?=[A-Z][a-z])', ' ', t)
    t = re.sub(r'(?<=[A-Za-z]{5})(?=\d)', ' ', t)
    t = re.sub(r'(?i)\bvit\b\.?', 'vitamin', t)
    return t
def skel(x):
    out = ''
    for w in re.findall(r'[a-z0-9]+', x.lower()):
        for a, b in (('ph', 'f'), ('th', 't'), ('y', 'i'), ('ae', 'e'), ('oe', 'e')): w = w.replace(a, b)
        w = re.sub(r'(.)\1+', r'\1', w)
        out += w[:-1] if len(w) > 4 and w.endswith('e') else w
    return out
def osa(a, b, limit):
    # optimal string alignment distance, giving up past the limit
    if abs(len(a) - len(b)) > limit: return limit + 1
    prev2, prev = None, list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        cur = [i] + [0] * len(b)
        for j in range(1, len(b) + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
            if i > 1 and j > 1 and a[i - 1] == b[j - 2] and a[i - 2] == b[j - 1]:
                cur[j] = min(cur[j], prev2[j - 2] + 1)
        if min(cur) > limit: return limit + 1
        prev2, prev = prev, cur
    return prev[-1]
VOCAB, KNOWN = {}, set()
for sci in drugs:
    for alt in names(sci):
        for q in alt:
            KNOWN.update(re.findall(r'[a-z]+', q))
            k = skel(q)
            if len(k) >= 6: VOCAB.setdefault(k, q)
KNOWN |= set(('each contains contain containing tablet tablets tab tabs capsule capsules cap caps film coated '
    'sugar syrup suspension solution injection inj infusion vial vials ampoule ampoules amp cream ointment gel drops drop '
    'oral eye ear nasal spray powder for with and the of as to equivalent eq base usp bp ph eur sodium potassium calcium '
    'magnesium hydrochloride hcl chloride sulfate sulphate phosphate acetate citrate maleate tartrate mesylate besylate '
    'succinate fumarate bromide dihydrate trihydrate monohydrate anhydrous hydrate other ingredients excipients water '
    'sterile units unit mg mcg ml gm per dose doses pack bottle tube sachet release sustained extended prolonged modified '
    'delayed dispersible effervescent chewable orodispersible soft hard gelatin vitamin extract dry dried leaves leaf root '
    'oil acid free preservative prefilled pen syringe single multi use only im iv sc '
    'chlorohydrate chlorite dimethylamine bisulphate bisulfate hydrogen zeta vii viii ix xiii '
    # nutrients that sit one letter away from a drug (tyrosine / thyroxine)
    'tyrosine arginine lysine glycine alanine cysteine citrulline glutamine leucine isoleucine valine methionine '
    'taurine tryptophan histidine proline serine threonine ornithine inulin ginger').split())
BY_FIRST = {}
for k, q in VOCAB.items(): BY_FIRST.setdefault(k[0], []).append((k, q))
FUZZ = {}
def nearest(k, prefix=False):
    key = (k, prefix)
    if key in FUZZ: return FUZZ[key]
    best, second, found = 9, 9, None
    if re.search(r'\d', k): FUZZ[key] = None; return None   # "B1" is not a misspelt "B12"
    for c, q in BY_FIRST.get(k[:1], []):
        L = len(c)
        if L < 8 or re.search(r'\d', c): continue
        lim = 2 if L >= 12 else 1
        if prefix:
            if len(k) < L + 3: continue
            d = min(osa(k[:n], c, lim) for n in (L - 1, L, L + 1))
        else:
            d = osa(k, c, lim)
        if d > lim or (d == 2 and not prefix and len(k) == L): continue   # two edits only when letters are missing
        if d < best: best, second, found = d, best, q
        elif d == best and q != found: second = d
    FUZZ[key] = found if found and second > best else None
    return FUZZ[key]
def correct(text, fuzzy=True):
    t = prep(text)
    toks = [(m.start(), m.end(), m.group(0)) for m in re.finditer(r'[A-Za-z][A-Za-z0-9]*', t)]
    reps, i = [], 0
    while i < len(toks):
        done = False
        for n in (3, 2, 1):
            if i + n > len(toks): continue
            seg = t[toks[i][0]:toks[i + n - 1][1]]
            if n > 1 and re.search(r'[^A-Za-z0-9 \-]', seg): continue
            k = skel(seg)
            if len(k) < 6: continue
            words = [w.lower() for _, _, w in toks[i:i + n]]
            if k in VOCAB: canon = VOCAB[k]
            elif not fuzzy or all(w in KNOWN for w in words): continue
            else:
                canon = nearest(k)
                if not canon and n == 1:
                    head = nearest(k, prefix=True)
                    canon = head and head + ' ' + seg
            if not canon: continue
            if seg.lower() != canon.lower(): reps.append((toks[i][0], toks[i + n - 1][1], canon))
            i += n; done = True
            break
        if not done: i += 1
    for x, y, c in reversed(reps): t = t[:x] + c + t[y:]
    return t
def match(text, fuzzy=True):
    raw = correct(text, fuzzy)
    t = raw.lower()
    return [sci for sci, alts, acr in MATCHERS
            if any(first in t and all(rx.search(t) for rx in rxs) for first, rxs in alts) or any(rx.search(raw) for rx in acr)]
# a product whose ingredients name nothing may still carry a brand the reference knows
BRANDS = [(d['sci'], re.compile(r'(?<![A-Za-z])' + re.escape(b.lower()) + r'(?![A-Za-z])')) for d in REF for b in d['brand'] if len(b) >= 5]
def by_brand(trade):
    t = (trade or '').lower()
    return list(dict.fromkeys(sci for sci, rx in BRANDS if rx.search(t)))

EYE = re.compile(r'\b(eyes?|ophth\w*|opth\w*|ocular|occular|ears?|otic|auric\w*)\b')
NOT_TOPICAL = re.compile(r'\b(oral\s+gel|gel\s+for\s+oral|oromucosal|buccal|dental\s+gel|soft\s*gels?|transdermal)\b')
TOPICAL = re.compile(r'\b(creams?|crem|creme|creamogel|oint|ointment|gel|emulgel|lotion|shampoo|foam|paste|topical|cutaneous|dermal|scalp|nail|lacquer|vaginal|intravaginal|vag|pessar\w*|ovules?|plasters?|skin|wash|dusting)\b')
def route_of(text):
    t = (text or '').lower()
    if EYE.search(t): return 'eye'
    if NOT_TOPICAL.search(t): return None
    return 'topical' if TOPICAL.search(t) else None
ORDER = { 'eye': ['eye', 'topical', None], 'topical': ['topical', None, 'eye'], None: [None, 'topical', 'eye'] }
VARIANTS = {}
for sci in drugs: VARIANTS.setdefault(base_of(sci), {})[route_in(sci)] = sci
def pick(hits, route):
    # a product names its molecule; its form picks the entry ("Sodium fusidate 2% cream" is the cream)
    out = []
    for base in dict.fromkeys(base_of(h) for h in hits):
        by = VARIANTS[base]
        out.append(next(by[r] for r in ORDER[route] if r in by))
    return out
# An EDL line that is itself a combination ("A + B") is claimed by combination
# entries only, and by the named mixtures (Ringer's, ORS, vaccines...).
CAT = { d['sci']: d['cat'] for d in REF }
MIXTURES = { 'Oral rehydration salts', 'Ringer’s solution', 'Compound sodium lactate', 'Multivitamins', 'Vitamin B complex',
             'Peritoneal dialysis solution', 'Cardioplegia solution', 'Glucose/Sodium chloride', 'Pulmonary surfactant' }
# Old Samarra (SDI) and other products the register lists by trade name only,
# whose contents are plain from the name and the product range.
BY_TRADE = { 'multisamavit': ['Multivitamins'], 'tetravit': ['Multivitamins'], 'samavit c': ['Ascorbic acid'],
             'samavit b6': ['Pyridoxine'], 'samavit b1': ['Thiamine'], 'ferrosam': ['Ferrous sulfate'],
             'gastrigel': ['Aluminium hydroxide', 'Magnesium hydroxide'], 'pectokaolin': ['Kaolin'],
             'isofampicin': ['Isoniazid/Rifampicin'], 'samacycline': ['Tetracycline'], 'samaphenicol': ['Chloramphenicol'],
             'samacetamide': ['Sulfacetamide'], 'travemine': ['Dimenhydrinate'], 'largapromactil': ['Chlorpromazine'],
             'mycil': ['Tolnaftate'], 'cicatrin': ['Neomycin'], 'neo-dexon': ['Neomycin', 'Dexamethasone (eye)'],
             'zincosulf': ['Zinc sulfate'], 'aspin infant': ['Aspirin'], 'b plex': ['Vitamin B complex'],
             'b.plex': ['Vitamin B complex'], 'bemiks': ['Vitamin B complex'], 'oystercal': ['Calcium carbonate'],
             'kalinor': ['Potassium citrate'], 'paracodol': ['Paracetamol', 'Codeine'], 'compound sodium lactate': ['Compound sodium lactate'] }
is_combo_line = lambda t: bool(re.search(r'\+(?!\s*(solvent|diluent|water|sterile|amp|syringe|needle|device|$))|\band\b', t.lower().strip()))
def molecules_in(text, route_text=None, combos_only=False, trade=None, fuzzy=True):
    hits = match(text, fuzzy)
    if not hits and trade: hits = by_brand(trade)
    if not hits and trade: hits = next((v for k, v in BY_TRADE.items() if k in trade.lower()), [])
    if combos_only and is_combo_line(text or ''):
        hits = [h for h in hits if '/' in base_of(h) or h in MIXTURES or CAT[h] == 'imm.vaccine']
    hits = pick(hits, route_of(route_text if route_text is not None else text))
    # a combination entry of the reference replaces the single molecules it contains
    for d in [h for h in hits if '/' in base_of(h)]:
        parts = [q.strip().lower() for q in base_of(d).split('/')]
        hits = [h for h in hits if base_of(h).lower() not in parts]
    # a name inside a longer one is the longer one ("Factor VIII inhibitor bypassing activity")
    hits = [h for h in hits if not any(h != o and base_of(h).lower() in base_of(o).lower() for o in hits)]
    # the solvent in a kit is not an ingredient
    return [h for h in hits if h not in SOLVENTS] or hits
SOLVENTS = { 'Water for injections' }
by_drug = {}
for it in items:
    for sci in molecules_in(it['item'], combos_only=True):
        by_drug.setdefault(sci, []).append(it['code'])
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
                 molecules_in(r['sci'] or r['trade'], (r['sci'] or '') + ' ' + r['trade'] + ' ' + (r['pack'] or ''), trade=r['trade'], fuzzy=bool(r['sci'])), control_of(r['sci']), st, (r['reg'] or r['regOld'] or '')[:30], r['maker'] or '', r['country'] or ''])
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
