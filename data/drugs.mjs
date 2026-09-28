/* ==========================================================================
   THE DRUG REFERENCE — one list, two builds.

   This file is the source of truth's front door. The molecules themselves
   live in data/drugs/*.mjs, one file per part of the body, and the shared
   vocabulary they draw on (categories, the questions asked at the counter,
   contraindications, interaction classes) in data/drugs/banks.mjs. This file
   joins them into the one list the rest of the repository reads, in the same
   shape it has always had. `npm run drugs` embeds it into both single-file
   builds, between the DRUGS:BEGIN / DRUGS:END markers, so the pharmacist's
   reference in the app and the operator's module in the CRM can never quietly
   disagree about what a drug is.

   WHAT IS IN IT. Every molecule on the Iraqi market as the two Ministry
   sources describe it — the register of registered medicines and the NCDS
   Essential Drugs List (data/sources/) — each with its category, scientific
   and Arabic names, the originator brands it is known by, the strengths
   marketed, the counselling a patient should hear, the interactions that
   change what a pharmacist does, its contraindications, and at most three
   questions to ask the patient when dispensing it. The brands registered in
   Iraq are not typed here: they come from the register itself, through
   scripts/read-sources.py, so a trade name on screen is one the Ministry
   lists and not one somebody remembered.

   WHAT IS REAL AND WHAT IS NOT. The molecule-level content is formulary
   reference written from standard sources, and it is PLACEHOLDER CLINICAL
   CONTENT until the clinical curator (W19) has reviewed it. The brand rows
   of the CRM's own Brands module are still fixtures.

   IT IS A REFERENCE, NOT A PRESCRIBER. Interactions are the ones worth
   stopping for, not the complete list; a drug with none listed is not a drug
   with none. Every screen that shows this says so, because a reference that
   looks exhaustive and is not is worse than no reference.

   SHAPE OF EACH DRUG (as exported — the source files write it more briefly):
     sci    scientific name — the identifier, and unique
     ar     Arabic name as dispensed in Iraq
     atc    WHO ATC code
     cat    category: a class key of CATEGORIES ("cvs.acei"); the group is the
            part before the dot ("cvs", heart and blood vessels)
     form   the MAIN presentation, one of FORM_KEYS below. A molecule sold in
            several forms carries the one most dispensed here and the rest
            among its strengths — diclofenac is a tablet that also comes as a
            1% gel, so the gel is a strength rather than a second row. Both
            builds label the field "main form" for that reason.
     doses  the strengths marketed, strongest last
     brand  optional — originator or international brand names the molecule
            is asked for by ("Augmentin", "Concor"). Search only; the brands
            registered in Iraq come from the register.
     aka    optional — other names for the same molecule (acetaminophen,
            frusemide, glyceryl guaiacolate). Search and register matching.
     notes  the counselling line — what you tell the patient handing it over
     interactions [{ with, severity: warning|serious|critical, note }]
            `with` is a drug of the reference, a class ("#nsaid", a key of
            TAGS), or a partner that is not a medicine (OUTSIDE: alcohol,
            grapefruit juice). Class interactions that hold whichever two
            drugs meet are in RULES, not repeated on every drug.
     tags   optional — the interaction classes the drug belongs to, keys of
            TAGS. Membership is what makes RULES and "#class" partners find it.
     contraindications [{ ar, en }]
     ask    [{ ar, en }], at most THREE — the questions to ask the patient when
            dispensing it, the three whose answer changes what happens next.
            The Helper merges them across a basket, matched on the text.
     controlled  optional, true — a controlled substance: every movement of it
            appears in the pharmacy's controlled register (v0.0013). Which
            substances are controlled, and under which convention, is
            data/controlled.json (the UN lists until Iraq's own schedule).
     take   optional — WHEN and HOW to take it, as keys of TAKE below: before or
            after food, in the morning, once a week. What the till prints under
            a medicine by default (v0.0012.1). Only where the timing changes
            something; a drug with none prints no default line at all, because
            "swallow with water" tells a patient nothing. Never a dose — the
            dose is typed by the dispensing pharmacist, every time.
   ========================================================================== */

import { CATEGORIES, QUESTIONS, CONTRA, TAGS, RULES, OUTSIDE } from './drugs/banks.mjs';
import { expandDrug } from './drugs/expand.mjs';
import bloodPressure from './drugs/blood-pressure.mjs';
import heart from './drugs/heart.mjs';
import lipidsAndClotting from './drugs/lipids-and-clotting.mjs';
import blood from './drugs/blood.mjs';
import digestive from './drugs/digestive.mjs';
import bowelAndLiver from './drugs/bowel-and-liver.mjs';
import airways from './drugs/airways.mjs';
import allergyCoughCold from './drugs/allergy-cough-cold.mjs';
import painAndMigraine from './drugs/pain-and-migraine.mjs';
import neurology from './drugs/neurology.mjs';
import psychiatry from './drugs/psychiatry.mjs';
import musculoskeletal from './drugs/musculoskeletal.mjs';
import diabetes from './drugs/diabetes.mjs';
import hormones from './drugs/hormones.mjs';
import womensHealth from './drugs/womens-health.mjs';
import urology from './drugs/urology.mjs';
import antibiotics from './drugs/antibiotics.mjs';
import antibioticsOther from './drugs/antibiotics-other.mjs';
import antifungalsAntivirals from './drugs/antifungals-antivirals.mjs';
import antiparasitics from './drugs/antiparasitics.mjs';
import chemotherapy from './drugs/chemotherapy.mjs';
import cancerTargeted from './drugs/cancer-targeted.mjs';
import immunology from './drugs/immunology.mjs';
import vaccines from './drugs/vaccines.mjs';
import vitaminsMinerals from './drugs/vitamins-minerals.mjs';
import fluidsNutrition from './drugs/fluids-nutrition.mjs';
import skin from './drugs/skin.mjs';
import eye from './drugs/eye.mjs';
import ent from './drugs/ent.mjs';
import anaesthesia from './drugs/anaesthesia.mjs';
import antidotesDiagnostics from './drugs/antidotes-diagnostics.mjs';
import herbal from './drugs/herbal.mjs';

export { CATEGORIES, TAGS, RULES, OUTSIDE, QUESTIONS, CONTRA };

/* The fixed vocabulary for `take`, and the quick choices the pharmacist taps
   at the till. Fixed so that every instruction exists in both languages: a
   receipt switches to English with one press, and a line typed in one
   language cannot follow it. */
export const TAKE = {
  beforeFood:      { ar:'قبل الأكل',                          en:'Before food' },
  afterFood:       { ar:'بعد الأكل',                          en:'After food' },
  withFood:        { ar:'مع الأكل',                           en:'With food' },
  emptyStomach:    { ar:'على معدة فارغة',                     en:'On an empty stomach' },
  beforeBreakfast: { ar:'صباحاً قبل الفطور بنصف ساعة',        en:'In the morning, 30 minutes before breakfast' },
  withBreakfast:   { ar:'صباحاً مع الفطور',                   en:'In the morning with breakfast' },
  morning:         { ar:'صباحاً',                             en:'In the morning' },
  evening:         { ar:'مساءً',                              en:'In the evening' },
  bedtime:         { ar:'قبل النوم',                          en:'At bedtime' },
  sameTime:        { ar:'في الوقت نفسه كل يوم',               en:'At the same time every day' },
  weekly:          { ar:'مرة واحدة في الأسبوع فقط',           en:'Once a week only' },
  noMilk:          { ar:'بعيداً عن الحليب ومضادات الحموضة بساعتين', en:'Two hours apart from milk and antacids' },
  noAlcohol:       { ar:'تجنّب الكحول',                       en:'No alcohol' }
};

export const FORM_KEYS = ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment',
  'gel', 'drops', 'inhaler', 'spray', 'suppository', 'sachet', 'solution', 'patch', 'pessary'];

export default [
  bloodPressure, heart, lipidsAndClotting, blood, digestive, bowelAndLiver, airways, allergyCoughCold,
  painAndMigraine, neurology, psychiatry, musculoskeletal, diabetes, hormones, womensHealth, urology,
  antibiotics, antibioticsOther, antifungalsAntivirals, antiparasitics, chemotherapy, cancerTargeted,
  immunology, vaccines, vitaminsMinerals, fluidsNutrition, skin, eye, ent, anaesthesia,
  antidotesDiagnostics, herbal
].flat().map(expandDrug);

/* ==========================================================================
   THERAPEUTIC DUPLICATION

   The obvious implementation is "two drugs sharing an ATC class", and it is
   wrong. Run it over this list and it fires on metformin + gliclazide, on
   basal + bolus insulin, on aspirin + clopidogrel after a stent, on a
   background nitrate plus a rescue spray, and on two antiepileptics — every
   one of them a standard regimen. A checker that shouts at the most ordinary
   prescriptions in the pharmacy gets muted inside a week, and then it is
   silent for the one that mattered. Alert fatigue is the documented way these
   tools fail, not missing data.

   So duplication is a CURATED list of classes where a second drug is a real
   problem, not a rule derived from the codes. Each carries its own wording,
   and the ones that are often deliberate say so rather than crying wolf.

   Deliberately absent, because combining them is normal practice: antibiotics
   as a whole (J01), oral antidiabetics as a whole (A10B), insulins (A10A),
   nitrates (C01D), and antiepileptics (N03A). What IS here from those
   families is only the narrow class where a second member is never a regimen
   — two macrolides, two quinolones, two sulfonylureas.

   The codes are as narrow as the claim. "Two NSAIDs" names the NSAID codes
   and not all of M01A, which also holds glucosamine; "two statins" is C10AA
   and not C10A, which also holds ezetimibe; "more than one acid suppressant"
   is A02BA and A02BC, not the sucralfate beside them in A02B.
   ========================================================================== */
export const DUPLICATE_RULES = [
  { id:'nsaid', codes:['M01AA','M01AB','M01AC','M01AE','M01AG','M01AH','M01AX01','M01AX17'], severity:'serious',
    label:{ar:'مضادّا التهاب غير ستيرويديين', en:'Two NSAIDs'},
    note:{ar:'يضاعفان خطر القرحة والأذية الكلوية دون أن يضيفا تسكيناً.',
          en:'Doubles the ulcer and kidney risk without adding pain relief.'} },

  { id:'ras', codes:['C09A','C09B','C09C','C09D','C09XA'], severity:'serious',
    label:{ar:'حصار مضاعف لجملة الرينين', en:'Dual blockade of the renin system'},
    note:{ar:'مثبّط ACE مع سارتان — أو سارتانان — يرفع خطر الأذية الكلوية وفرط البوتاسيوم بلا فائدة مثبتة.',
          en:'An ACE inhibitor with an ARB — or two ARBs — raises kidney injury and hyperkalaemia with no proven benefit.'} },

  { id:'betablocker', codes:['C07A','C07B','C07C','C07F'], severity:'serious',
    label:{ar:'حاصرا بيتا', en:'Two beta blockers'},
    note:{ar:'بطء قلب وهبوط ضغط مضاعفان.', en:'Compounded bradycardia and hypotension.'} },

  { id:'statin', codes:['C10AA','C10BA','C10BX'], severity:'serious',
    label:{ar:'ستاتينان', en:'Two statins'},
    note:{ar:'لا أثر إضافي على الشحوم، وخطر اعتلال عضلي مضاعف.',
          en:'No added effect on lipids, and a compounded myopathy risk.'} },

  { id:'ccb', codes:['C08C','C08G','C09BB','C09DB','C10BX03'], severity:'serious',
    label:{ar:'حاصرا كالسيوم من الفئة نفسها', en:'Two dihydropyridine calcium blockers'},
    note:{ar:'هبوط ضغط ووذمة محيطية مضاعفان.', en:'Compounded hypotension and ankle swelling.'} },

  { id:'benzo', codes:['N05BA','N05CD','N05CF'], severity:'serious',
    label:{ar:'بنزوديازيبينان', en:'Two benzodiazepines'},
    note:{ar:'تثبيط تنفسي وتنويم مضاعفان، وخطر اعتماد أعلى.',
          en:'Compounded respiratory depression and sedation, and a higher dependence risk.'} },

  /* Real, and sometimes deliberate. The wording has to carry both, or a
     pharmacist who has seen it prescribed on purpose stops reading the rest. */
  { id:'antidepressant', codes:['N06A'], severity:'serious', oftenIntended:true,
    label:{ar:'مضادّا اكتئاب', en:'Two antidepressants'},
    note:{ar:'خطر متلازمة السيروتونين. يُوصف أحياناً عن قصد — تأكّد أن الطبيب قصده.',
          en:'Serotonin syndrome risk. Sometimes prescribed deliberately — confirm the prescriber meant it.'} },

  { id:'antithrombotic', codes:['B01A'], severity:'serious', oftenIntended:true,
    label:{ar:'أكثر من دواء مضاد للتخثّر أو الصفيحات', en:'More than one drug affecting clotting'},
    note:{ar:'العلاج المزدوج بعد الدعامة قياسي؛ أما مضاد تخثّر مع مضاد صفيحات فيحتاج سبباً مذكوراً.',
          en:'Dual antiplatelet therapy after a stent is standard; an anticoagulant plus an antiplatelet needs a stated reason.'} },

  { id:'acid', codes:['A02BA','A02BC','A02BD'], severity:'warning', oftenIntended:true,
    label:{ar:'أكثر من خافض للحموضة', en:'More than one acid suppressant'},
    note:{ar:'مثبّط مضخة نهاراً وحاصر H2 ليلاً نمط مشروع؛ وغالباً ما يكون تكراراً غير مقصود.',
          en:'A proton pump inhibitor by day and an H2 blocker at night is a legitimate pattern; more often it is an unintended duplicate.'} },

  { id:'antihistamine', codes:['R06A'], severity:'warning', oftenIntended:true,
    label:{ar:'مضادّا هيستامين', en:'Two antihistamines'},
    note:{ar:'غير منوّم نهاراً ومنوّم ليلاً نمط شائع ومشروع. تحقّق فقط أنه مقصود.',
          en:'A non-sedating one by day and a sedating one at night is common and legitimate. Just check it is intended.'} },

  /* v0.0015.3 — with the whole market in the reference, the narrow classes
     where a second member is a duplicate rather than a regimen. */
  { id:'opioid', codes:['N02A'], severity:'serious', oftenIntended:true,
    label:{ar:'أفيونان', en:'Two opioids'},
    note:{ar:'تهدئة وتثبيط تنفّس مضاعفان. أفيون منتظم مع آخر للألم الاختراقي يُوصف أحياناً عن قصد — تأكّد.',
          en:'Compounded sedation and breathing depression. A regular opioid plus one for breakthrough pain is sometimes deliberate — confirm it.'} },

  { id:'antipsychotic', codes:['N05AA','N05AB','N05AC','N05AD','N05AE','N05AF','N05AG','N05AH','N05AL','N05AX'], severity:'serious', oftenIntended:true,
    label:{ar:'مضادّا ذهان', en:'Two antipsychotics'},
    note:{ar:'آثار جانبية مضاعفة — QT والتهدئة والحركة والاستقلاب. يُوصف أحياناً عن قصد في الحالات المعنّدة — تأكّد.',
          en:'Compounded side effects — QT, sedation, movement and metabolic. Sometimes deliberate in resistant illness — confirm it.'} },

  { id:'sulfonylurea', codes:['A10BB'], severity:'serious',
    label:{ar:'سلفونيل يوريا مرتين', en:'Two sulfonylureas'},
    note:{ar:'يضاعفان خطر هبوط السكر دون فائدة إضافية.', en:'Doubles the hypoglycaemia risk with no added benefit.'} },

  { id:'incretin', codes:['A10BH','A10BJ','A10BD07','A10BD08','A10BD10','A10BD11','A10BD19','A10BD21'], severity:'warning',
    label:{ar:'دواءان من فئة الإنكريتين', en:'Two incretin drugs (DPP-4 inhibitor or GLP-1 agonist)'},
    note:{ar:'يعملان على المسار نفسه — لا فائدة من الجمع.', en:'They act on the same pathway — no benefit from combining them.'} },

  { id:'sglt2', codes:['A10BK','A10BD15','A10BD20','A10BD19','A10BD21'], severity:'warning',
    label:{ar:'مثبّطا SGLT2', en:'Two SGLT2 inhibitors'},
    note:{ar:'لا فائدة إضافية، وخطر جفاف وحماض كيتوني أعلى.', en:'No added benefit, and more dehydration and ketoacidosis risk.'} },

  { id:'steroid', codes:['H02AB'], severity:'serious',
    label:{ar:'كورتيزونان جهازيان', en:'Two systemic corticosteroids'},
    note:{ar:'يُجمعان في جرعة كورتيزون أكبر — تأكّد أنه مقصود.', en:'They add up to one larger steroid dose — confirm it is intended.'} },

  { id:'triptan', codes:['N02CC'], severity:'serious',
    label:{ar:'تريبتانان', en:'Two triptans'},
    note:{ar:'تضيّق وعائي مضاف — لا يؤخذ تريبتان آخر خلال 24 ساعة.', en:'Additive vasoconstriction — no second triptan within 24 hours.'} },

  { id:'bisphosphonate', codes:['M05BA','M05BB'], severity:'serious',
    label:{ar:'بيسفوسفونيتان', en:'Two bisphosphonates'},
    note:{ar:'لا فائدة إضافية، وخطر أعلى لنخر الفك ونقص الكالسيوم.', en:'No added benefit, and more risk of jaw osteonecrosis and low calcium.'} },

  { id:'pde5', codes:['G04BE03','G04BE08','G04BE09','G04BE10','G04BE11'], severity:'serious',
    label:{ar:'مثبّطا PDE5', en:'Two PDE5 inhibitors'},
    note:{ar:'هبوط ضغط مضاعف دون فائدة إضافية.', en:'Compounded hypotension with no added benefit.'} },

  { id:'alphablocker', codes:['G04CA','C02CA'], severity:'serious',
    label:{ar:'حاصرا ألفا', en:'Two alpha-blockers'},
    note:{ar:'هبوط ضغط انتصابي وإغماء.', en:'Postural hypotension and fainting.'} },

  { id:'bladder', codes:['G04BD'], severity:'warning',
    label:{ar:'دواءان مضادان للمسكارين للمثانة', en:'Two bladder antimuscarinics'},
    note:{ar:'آثار مضادة للكولين مضاعفة — جفاف فم وإمساك واحتباس وتشوّش.', en:'Compounded anticholinergic effects — dry mouth, constipation, retention and confusion.'} },

  { id:'musclerelaxant', codes:['M03B'], severity:'warning',
    label:{ar:'مرخيا عضلات', en:'Two muscle relaxants'},
    note:{ar:'نعاس ودوخة مضاعفان دون فائدة مثبتة.', en:'Compounded drowsiness and dizziness with no proven benefit.'} },

  { id:'macrolide', codes:['J01FA'], severity:'serious',
    label:{ar:'ماكروليدان', en:'Two macrolides'},
    note:{ar:'التغطية نفسها مرتين، مع إطالة QT وتداخلات مضاعفة.', en:'The same cover twice, with compounded QT and interaction risk.'} },

  { id:'quinolone', codes:['J01MA'], severity:'serious',
    label:{ar:'كينولونان', en:'Two quinolones'},
    note:{ar:'التغطية نفسها مرتين، مع خطر مضاعف على الأوتار وQT.', en:'The same cover twice, with compounded tendon and QT risk.'} },

  { id:'cephalosporin', codes:['J01DB','J01DC','J01DD','J01DE'], severity:'serious',
    label:{ar:'سيفالوسبورينان', en:'Two cephalosporins'},
    note:{ar:'التغطية نفسها مرتين — غالباً انتقال من الحقن إلى الفم لم يُوقف فيه الأول.', en:'The same cover twice — often a switch from injection to tablets where the first was not stopped.'} },

  { id:'tetracycline', codes:['J01AA'], severity:'serious',
    label:{ar:'تتراسيكلينان', en:'Two tetracyclines'},
    note:{ar:'التغطية نفسها مرتين.', en:'The same cover twice.'} }
];
