/* IV fluids and electrolytes, clinical nutrition, and metabolic and rare
   diseases (enzyme replacement and the like). Mostly hospital supply.
   Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- IV fluids and electrolytes ---------- */
{ sci:'Calcium gluconate', ar:'غلوكونات الكالسيوم', atc:'A12AA03', cat:'nut.fluid', form:'injection',
  doses:['10% 10 mL'],
  notes:{en:'Slow IV. Never mixed with ceftriaxone. Extravasation causes tissue necrosis.',
         ar:'وريدي بطيء. لا يُمزج مع السيفترياكسون أبداً. التسرّب خارج الوريد يسبّب نخراً نسيجياً.'},
  ix:[
    ['Ceftriaxone', C, 'Precipitates in lung and kidney — the IV combination is contraindicated.', 'ترسّب في الرئة والكلية — ممنوع الجمع وريدياً.'],
    ['Digoxin', S, 'IV calcium with digoxin causes arrhythmia.', 'الكالسيوم الوريدي مع الديجوكسين يسبّب اضطراب نظم.']
  ],
  ci:['hyperCa', {en:'Concurrent IV ceftriaxone', ar:'الاستعمال الوريدي المتزامن مع السيفترياكسون'}],
  ask:['digoxin'] },

{ sci:'Sodium chloride', ar:'كلوريد الصوديوم', atc:'B05XA03', cat:'nut.fluid', form:'injection',
  doses:['0.9% infusion', '0.45%', '3%', '10 mL flush', '0.9% nasal drops'], aka:['Normal saline', 'Saline'],
  notes:{en:'The standard drip for fluid replacement. Saline nose drops clear a blocked nose in babies before feeds.',
         ar:'التسريب المعتاد لتعويض السوائل. نقط الأنف الملحية تفتح أنف الرضيع المسدود قبل الرضعات.'},
  ask:['heartFailure', 'kidney'] },

{ sci:'Glucose', ar:'غلوكوز', atc:'B05BA03', cat:'nut.fluid', form:'injection',
  doses:['5%', '10%', '25%', '50% infusion', 'powder', 'tablets'], aka:['Dextrose', 'Glucose monohydrate'],
  notes:{en:'Infusions give fluid and calories; stronger solutions treat low blood sugar. Oral glucose treats a hypo in someone awake and able to swallow.',
         ar:'التسريب يعطي سوائل وسعرات؛ والمحاليل الأقوى تعالج هبوط السكر. الغلوكوز الفموي يعالج هبوط السكر عند شخص واعٍ قادر على البلع.'},
  ask:['diabetes'] },

{ sci:'Compound sodium lactate', ar:'لاكتات الصوديوم المركّبة', atc:'B05BB01', cat:'nut.fluid', form:'injection',
  doses:['500 mL', '1000 mL'], aka:["Ringer's lactate", 'Ringer lactate', 'Ringers lactate', "Hartmann's solution", 'Hartmann solution', "Lactated Ringer's", 'Lactated Ringer', 'Sodium lactate compound'],
  notes:{en:'A balanced drip for fluid replacement in surgery, burns and dehydration.',
         ar:'تسريب متوازن لتعويض السوائل في الجراحة والحروق والجفاف.'},
  ix:[
    ['Ceftriaxone', C, 'The calcium in it forms crystals with ceftriaxone — never in the same line, and not within 48 hours in newborns.', 'الكالسيوم فيه يكوّن بلورات مع السيفترياكسون — لا يُعطيان في الخط نفسه أبداً، ولا خلال 48 ساعة عند حديثي الولادة.']
  ],
  ask:['kidney', 'heartFailure'] },

{ sci:"Ringer's solution", ar:'محلول رينغر', atc:'B05BB01', cat:'nut.fluid', form:'injection',
  doses:['500 mL'], aka:['Ringers solution', 'Ringer solution', 'Ringer injection'],
  notes:{en:'A balanced electrolyte drip for fluid replacement.',
         ar:'تسريب أملاح متوازن لتعويض السوائل.'},
  ix:[
    ['Ceftriaxone', C, 'The calcium in it forms crystals with ceftriaxone — never in the same line, and not within 48 hours in newborns.', 'الكالسيوم فيه يكوّن بلورات مع السيفترياكسون — لا يُعطيان في الخط نفسه أبداً، ولا خلال 48 ساعة عند حديثي الولادة.']
  ],
  ask:['kidney', 'heartFailure'] },

{ sci:'Sodium bicarbonate', ar:'بيكربونات الصوديوم', atc:'B05XA02', cat:'nut.fluid', form:'injection',
  doses:['8.4% (1 mmol/mL)', '4.2%', '500 mg tablet'],
  notes:{en:'Intravenous for severe acidosis and some poisonings; tablets correct acidosis in kidney disease. It carries a lot of sodium.',
         ar:'وريدياً للحماض الشديد وبعض حالات التسمّم؛ والأقراص تصحّح الحماض في أمراض الكلى. يحمل كمية كبيرة من الصوديوم.'},
  ix:[
    ['Lithium', W, 'Alkaline urine lowers lithium levels.', 'البول القلوي يخفض مستوى الليثيوم.'],
    ['Aspirin', W, 'Speeds aspirin removal (used deliberately in overdose).', 'يسرّع طرح الأسبرين (ويُستعمل عمداً في الجرعة الزائدة).']
  ],
  ask:['kidney', 'heartFailure'] },

{ sci:'Magnesium sulfate', ar:'كبريتات المغنيسيوم', atc:'B05XA05', cat:'nut.fluid', form:'injection',
  doses:['50% (2 mmol/mL) injection', 'oral Epsom salt'], aka:['Magnesium sulphate', 'Epsom salt'],
  notes:{en:'Intravenous for eclampsia, low magnesium and severe asthma, with reflexes and breathing watched. By mouth it is a laxative.',
         ar:'وريدياً للارتعاج ونقص المغنيسيوم والربو الشديد، مع مراقبة المنعكسات والتنفس. بالفم يعمل مليّناً.'},
  ix:[
    ['Nifedipine', S, 'A deep fall in blood pressure and muscle weakness.', 'هبوط عميق في الضغط وضعف عضلي.'],
    ['Rocuronium', S, 'Magnesium deepens and prolongs the muscle block.', 'المغنيسيوم يعمّق الإحصار العضلي ويطيله.']
  ],
  ci:['renalSevere', 'heartBlock', 'myasthenia'],
  ask:['kidney', 'myasthenia'] },

{ sci:'Calcium chloride', ar:'كلوريد الكالسيوم', atc:'B05XA07', cat:'nut.fluid', form:'injection',
  doses:['10% injection (100 mg/mL)'], aka:['Calcium chloride dihydrate'],
  tags:['polyvalent'],
  notes:{en:'Given slowly into a large vein for dangerously high potassium, low calcium or calcium-channel-blocker overdose; it burns badly if it leaks under the skin.',
         ar:'يُعطى ببطء في وريد كبير لارتفاع البوتاسيوم الخطير أو نقص الكالسيوم أو الجرعة الزائدة من حاصرات الكالسيوم؛ ويحرق بشدة إذا تسرّب تحت الجلد.'},
  ix:[
    ['Digoxin', S, 'Heart rhythm problems — given with great care.', 'اضطرابات نظم القلب — يُعطى بحذر شديد.'],
    ['Ceftriaxone', C, 'Not in the same line or mixed — crystals can form.', 'لا يُعطيان في الخط نفسه ولا يُمزجان — قد تتكوّن بلورات.']
  ],
  ci:['hyperCa'],
  ask:['digoxin', 'kidney'] },

{ sci:'Glucose/Sodium chloride', ar:'غلوكوز/كلوريد الصوديوم', atc:'B05BB02', cat:'nut.fluid', form:'injection',
  doses:['glucose 5% + sodium chloride 0.9%', 'glucose 5% + sodium chloride 0.45%', 'glucose 4% + sodium chloride 0.18%'], aka:['Dextrose saline', 'Glucose saline', 'Dextrose-saline'],
  notes:{en:'A maintenance drip giving water, salt and a little sugar; sodium and blood sugar are watched, especially in children.',
         ar:'تسريب صيانة يعطي الماء والملح وقليلاً من السكر؛ ويُراقب الصوديوم وسكر الدم، خصوصاً عند الأطفال.'},
  ask:['diabetes', 'heartFailure', 'kidney'] },

{ sci:'Glycine', ar:'غلايسين', atc:'B05CX03', cat:'nut.fluid', form:'solution',
  doses:['1.5% irrigation'], aka:['Glycine irrigation'],
  notes:{en:'A bladder irrigation for urological surgery only — not for injection. Too much absorbed can lower blood sodium.',
         ar:'غسول للمثانة في جراحة المسالك البولية فقط — ليس للحقن. امتصاص كمية كبيرة منه قد يخفض صوديوم الدم.'},
  ask:['heartFailure', 'kidney'] },

{ sci:'Mannitol', ar:'مانيتول', atc:'B05BC01', cat:'nut.fluid', form:'injection',
  doses:['10%', '20% infusion'],
  tags:['diuretic'],
  notes:{en:'A hospital infusion to reduce brain swelling or eye pressure; fluid balance and electrolytes are watched.',
         ar:'تسريب في المستشفى لتخفيف وذمة الدماغ أو ضغط العين؛ يُراقب توازن السوائل والأملاح.'},
  ci:['anuria', 'hfDecomp'],
  ask:['kidney', 'heartFailure'] },

{ sci:'Water for injections', ar:'ماء للحقن', atc:'V07AB', cat:'nut.fluid', form:'injection',
  doses:['5 mL', '10 mL', '100 mL'], aka:['Distilled water', 'Sterile water'],
  notes:{en:'Only for dissolving or diluting medicines — never infused on its own, as it bursts red cells.',
         ar:'لإذابة الأدوية أو تمديدها فقط — لا يُسرّب وحده أبداً لأنه يحلّ الكريات الحمر.'},
  ask:[{en:'Which medicine is it for dissolving?', ar:'لإذابة أي دواء؟'}] },

{ sci:'Peritoneal dialysis solution', ar:'محلول الغسيل البريتوني', atc:'B05DB', cat:'nut.fluid', form:'solution',
  doses:['1.36%', '2.27%', '3.86% glucose', 'icodextrin 7.5%'], brand:['Dianeal', 'Extraneal', 'Physioneal'], aka:['Dialysis solution'],
  notes:{en:'For peritoneal dialysis at home: strict hand hygiene every exchange. Cloudy fluid or tummy pain means infection — call the unit the same day.',
         ar:'للغسيل البريتوني في البيت: نظافة يدين صارمة في كل تبديل. السائل العكر أو ألم البطن يعني عدوى — اتصل بالوحدة في اليوم نفسه.'},
  ask:['diabetes', 'infection'] },

{ sci:'Cardioplegia solution', ar:'محلول شلّ القلب', atc:'B05XA16', cat:'nut.fluid', form:'solution',
  doses:['1000 mL'], aka:['Cardioplegia'],
  notes:{en:'Used only by the surgical team to stop the heart during open-heart surgery.',
         ar:'يستعمله الفريق الجراحي فقط لإيقاف القلب أثناء جراحة القلب المفتوح.'},
  ask:['allergy'] },

/* ---------- Clinical nutrition ---------- */

{ sci:'Amino acids', ar:'الأحماض الأمينية', atc:'B05BA01', cat:'nut.nutrition', form:'injection',
  doses:['5%', '10% infusion'], brand:['Aminoven', 'Aminoplasmal'], aka:['Amino acid infusion'],
  notes:{en:'Part of intravenous feeding in hospital; blood sugar, electrolytes and liver tests are watched.',
         ar:'جزء من التغذية الوريدية في المستشفى؛ يُراقب السكر والأملاح ووظائف الكبد.'},
  ask:['kidney', 'liver'] },

{ sci:'Lipid emulsion', ar:'مستحلب الدهون', atc:'B05BA02', cat:'nut.nutrition', form:'injection',
  doses:['10%', '20% infusion'], brand:['Intralipid', 'SMOFlipid'], aka:['Fat emulsion'],
  notes:{en:'Calories and essential fats in intravenous feeding; made from soya, egg and sometimes fish. Blood lipids are checked.',
         ar:'سعرات ودهون أساسية في التغذية الوريدية؛ مصنوع من الصويا والبيض وأحياناً السمك. تُفحص دهون الدم.'},
  ix:[
    ['Warfarin', W, 'Soya-based emulsions carry vitamin K — they can lower the INR.', 'المستحلبات المصنوعة من الصويا تحمل فيتامين K — قد تخفض INR.']
  ],
  ask:['allergy'] },

/* ---------- Metabolic and rare diseases ---------- */

{ sci:'Imiglucerase', ar:'إيميغلوسيراز', atc:'A16AB02', cat:'nut.metabolic', form:'injection',
  doses:['400 units vial'], brand:['Cerezyme'],
  notes:{en:'Enzyme replacement for Gaucher disease, infused every two weeks; infusion reactions are watched for.',
         ar:'تعويض إنزيمي لداء غوشيه، يُسرّب كل أسبوعين؛ تُراقب تفاعلات التسريب.'},
  ask:['allergy'] },

{ sci:'Agalsidase', ar:'أغالسيداز', atc:'A16AB04', cat:'nut.metabolic', form:'injection',
  doses:['35 mg vial (beta)', '3.5 mg (alfa)'], brand:['Fabrazyme', 'Replagal'], aka:['Agalsidase beta', 'Agalsidase alfa'],
  notes:{en:'Enzyme replacement for Fabry disease, infused every two weeks.',
         ar:'تعويض إنزيمي لداء فابري، يُسرّب كل أسبوعين.'},
  ask:['allergy'] },

{ sci:'Alglucosidase alfa', ar:'ألغلوكوسيداز ألفا', atc:'A16AB07', cat:'nut.metabolic', form:'injection',
  doses:['50 mg vial'], brand:['Myozyme'],
  notes:{en:'Enzyme replacement for Pompe disease, infused every two weeks.',
         ar:'تعويض إنزيمي لداء بومبي، يُسرّب كل أسبوعين.'},
  ask:['allergy'] },

{ sci:'Velaglucerase alfa', ar:'فيلاغلوسيراز ألفا', atc:'A16AB10', cat:'nut.metabolic', form:'injection',
  doses:['400 units vial'], brand:['Vpriv'],
  notes:{en:'Enzyme replacement for Gaucher disease, infused every two weeks; infusion reactions are watched for.',
         ar:'تعويض إنزيمي لداء غوشيه، يُسرّب كل أسبوعين؛ وتُراقب تفاعلات التسريب.'},
  ask:['allergy'] },

{ sci:'Laronidase', ar:'لارونيداز', atc:'A16AB05', cat:'nut.metabolic', form:'injection',
  doses:['500 units/5 mL vial'], brand:['Aldurazyme'],
  notes:{en:'Enzyme replacement for mucopolysaccharidosis type I, infused weekly.',
         ar:'تعويض إنزيمي لداء عديد السكاريد المخاطي من النمط الأول، يُسرّب أسبوعياً.'},
  ask:['allergy'] },

{ sci:'Idursulfase', ar:'إيدورسلفاز', atc:'A16AB09', cat:'nut.metabolic', form:'injection',
  doses:['6 mg/3 mL vial'], brand:['Elaprase'],
  notes:{en:'Enzyme replacement for mucopolysaccharidosis type II (Hunter syndrome), infused weekly.',
         ar:'تعويض إنزيمي لمتلازمة هنتر (عديد السكاريد المخاطي II)، يُسرّب أسبوعياً.'},
  ask:['allergy'] },

{ sci:'Galsulfase', ar:'غالسلفاز', atc:'A16AB08', cat:'nut.metabolic', form:'injection',
  doses:['5 mg/5 mL vial'], brand:['Naglazyme'],
  notes:{en:'Enzyme replacement for mucopolysaccharidosis type VI, infused weekly.',
         ar:'تعويض إنزيمي لداء عديد السكاريد المخاطي من النمط السادس، يُسرّب أسبوعياً.'},
  ask:['allergy'] },

{ sci:'Sapropterin', ar:'سابروبتيرين', atc:'A16AX07', cat:'nut.metabolic', form:'tablet',
  doses:['100 mg soluble tablet', '100 mg and 500 mg powder'], brand:['Kuvan'],
  notes:{en:'For phenylketonuria that responds to it, dissolved in water with breakfast; the diet continues and phenylalanine levels are checked.',
         ar:'لبيلة الفينيل كيتون المستجيبة له، يُذاب في الماء مع الفطور؛ ويستمر النظام الغذائي وتُفحص مستويات الفينيل ألانين.'},
  ix:[
    ['Levodopa', W, 'Fits and irritability reported together.', 'سُجّلت نوبات وهياج عند الجمع.'],
    ['Methotrexate', W, 'Lowers its active levels.', 'يخفض مستوياته الفعّالة.']
  ],
  ask:['labs'] },

{ sci:'Nitisinone', ar:'نيتيسينون', atc:'A16AX04', cat:'nut.metabolic', form:'capsule',
  doses:['2 mg', '5 mg', '10 mg', '20 mg'], brand:['Orfadin'],
  notes:{en:'For hereditary tyrosinaemia, with a special diet; report eye irritation or light sensitivity.',
         ar:'لداء التيروزين الوراثي، مع نظام غذائي خاص؛ أبلغ عن تهيّج العين أو الحساسية للضوء.'},
  ask:['labs', 'vision'] },

{ sci:'Sodium phenylbutyrate', ar:'فينيل بوتيرات الصوديوم', atc:'A16AX03', cat:'nut.metabolic', form:'tablet',
  doses:['500 mg tablet', 'granules'], brand:['Ammonaps'],
  notes:{en:'For urea-cycle disorders, with a protein-restricted diet; it contains a lot of sodium.',
         ar:'لاضطرابات دورة اليوريا، مع نظام غذائي مقيّد البروتين؛ يحتوي كثيراً من الصوديوم.'},
  ix:[
    ['Sodium valproate', S, 'Valproate raises ammonia — it can bring on a crisis.', 'الفالبروات يرفع الأمونيا — قد يسبّب نوبة.'],
    ['#corticosteroid', W, 'Steroids break down body protein and raise ammonia.', 'الكورتيزون يفكّك بروتين الجسم ويرفع الأمونيا.']
  ],
  ask:['labs', 'heartFailure'] }

];
