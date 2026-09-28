/* Vitamins, minerals and supplements — a large share of what an Iraqi
   pharmacy sells over the counter, and where "more is better" does harm
   (vitamin A in pregnancy, vitamin D and kidney stones, iron and children).
   Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Vitamins ---------- */
{ sci:'Cholecalciferol', ar:'كولي كالسيفيرول', atc:'A11CC05', cat:'nut.vitamin', form:'capsule',
  doses:['1000 IU', '5000 IU', '50000 IU'], brand:['Vigantol'], aka:['Vitamin D3', 'Colecalciferol'],
  take:['withFood'],
  notes:{en:'With a fatty meal — it is fat-soluble. The 50,000 IU capsule is weekly, not daily; the mix-up is common and harmful.',
         ar:'مع وجبة دسمة — ذائب في الدهن. جرعة الـ 50000 وحدة أسبوعية لا يومية؛ خطأ شائع ومؤذٍ.'},
  ix:[
    ['Digoxin', W, 'Hypercalcaemia raises digoxin toxicity.', 'فرط الكالسيوم يزيد سميّة الديجوكسين.'],
    ['Hydrochlorothiazide', W, 'Risk of hypercalcaemia.', 'خطر فرط كالسيوم.']
  ],
  ci:['hyperCa', {en:'Calcium renal stones', ar:'حصيات كلوية كلسية'}],
  ask:['stones', 'whoFor'] },

{ sci:'Retinol', ar:'ريتينول', atc:'A11CA01', cat:'nut.vitamin', form:'capsule',
  doses:['50,000 IU', '100,000 IU', '200,000 IU capsule', 'drops'], brand:['Arovit'], aka:['Vitamin A', 'Retinol palmitate'],
  notes:{en:'High single doses are given to children in supplementation campaigns. Regular high doses in pregnancy harm the baby, and it must not be taken with isotretinoin.',
         ar:'تُعطى جرعات مفردة عالية للأطفال في حملات التكميل. الجرعات العالية المنتظمة في الحمل تؤذي الجنين، ولا يؤخذ مع الأيزوتريتينوين.'},
  ix:[
    ['Isotretinoin', S, 'Vitamin A toxicity — no vitamin A supplements with it.', 'تسمّم بفيتامين أ — لا مكمّلات فيتامين أ معه.']
  ],
  ci:[{en:'High doses in pregnancy', ar:'الجرعات العالية في الحمل'}],
  ask:['preg', 'childAge', 'otherMeds'] },

{ sci:'Thiamine', ar:'ثيامين', atc:'A11DA01', cat:'nut.vitamin', form:'tablet',
  doses:['50 mg', '100 mg', '100 mg/mL injection', 'in B-complex'], brand:['Benerva'], aka:['Vitamin B1'],
  notes:{en:'For deficiency and in heavy drinkers. In anyone malnourished or dependent on alcohol it is given before glucose, to protect the brain.',
         ar:'للنقص ولمن يُفرط في الكحول. عند سوء التغذية أو الاعتماد على الكحول يُعطى قبل الغلوكوز لحماية الدماغ.'},
  ask:['alcohol', 'whoFor'] },

{ sci:'Riboflavin', ar:'ريبوفلافين', atc:'A11HA04', cat:'nut.vitamin', form:'tablet',
  doses:['5 mg', '400 mg (migraine prevention)', 'in B-complex'], aka:['Vitamin B2'],
  notes:{en:'Mostly an ingredient of B-complex products; high doses are used to prevent migraine. It turns urine bright yellow — harmless.',
         ar:'في الغالب مكوّن في مستحضرات فيتامين B المركّب؛ وتُستعمل الجرعات العالية للوقاية من الشقيقة. يلوّن البول بالأصفر الفاقع — وهذا غير ضار.'},
  ask:['whoFor'] },

{ sci:'Nicotinamide', ar:'نيكوتيناميد', atc:'A11HA01', cat:'nut.vitamin', form:'tablet',
  doses:['in B-complex', '500 mg', '4% gel'], aka:['Niacinamide', 'Vitamin B3'],
  notes:{en:'A B vitamin found in B-complex and multivitamin products; the gel is used for acne.',
         ar:'فيتامين B يوجد في مستحضرات B المركّب والفيتامينات المتعددة؛ والهلام يُستعمل لحب الشباب.'},
  ask:['whoFor'] },

{ sci:'Pyridoxine', ar:'بيريدوكسين', atc:'A11HA02', cat:'nut.vitamin', form:'tablet',
  doses:['10 mg', '25 mg', '50 mg', '100 mg/2 mL injection', 'in B-complex'], aka:['Vitamin B6'],
  notes:{en:'Given with isoniazid to prevent nerve damage, and for nausea in pregnancy (with doxylamine). Very high doses for months can themselves damage the nerves.',
         ar:'يُعطى مع الأيزونيازيد للوقاية من أذية الأعصاب، ولغثيان الحمل (مع الدوكسيلامين). الجرعات العالية جداً لأشهر قد تؤذي الأعصاب بنفسها.'},
  ask:['otherMeds', 'preg'] },

{ sci:'Biotin', ar:'بيوتين', atc:'A11HA05', cat:'nut.vitamin', form:'tablet',
  doses:['5 mg', '10 mg'], aka:['Vitamin B7', 'Vitamin H'],
  notes:{en:'Popular for hair and nails. High doses distort blood tests (thyroid, heart troponin) — stop it two days before any blood test.',
         ar:'شائع للشعر والأظافر. الجرعات العالية تُربك نتائج التحاليل (الدرقية، تروبونين القلب) — أوقفه قبل أي تحليل دم بيومين.'},
  ask:['labs'] },

{ sci:'Vitamin B complex', ar:'فيتامين B المركّب', atc:'A11EA', cat:'nut.vitamin', form:'tablet',
  doses:['tablet', 'syrup', 'injection', 'B1 + B6 + B12'], brand:['Neurobion', 'Becozyme', 'B-Plex'],
  notes:{en:'A mix of B vitamins for deficiency and nerve symptoms. It turns urine bright yellow. The injections are given into muscle, slowly.',
         ar:'مزيج من فيتامينات B للنقص وأعراض الأعصاب. يلوّن البول بالأصفر الفاقع. الحقن تُعطى في العضل ببطء.'},
  ask:['whoFor', 'diabetes'] },

{ sci:'Ascorbic acid', ar:'حمض الأسكوربيك', atc:'A11GA01', cat:'nut.vitamin', form:'tablet',
  doses:['500 mg', '1 g effervescent', '100 mg/mL drops', '500 mg/5 mL injection'], brand:['Redoxon', 'Cebion'], aka:['Vitamin C'],
  notes:{en:'High doses can cause kidney stones and diarrhoea; effervescent tablets contain a lot of sodium. It helps iron absorption when taken together.',
         ar:'الجرعات العالية قد تسبّب حصى الكلى والإسهال؛ والأقراص الفوّارة تحتوي كثيراً من الصوديوم. يساعد امتصاص الحديد إذا أُخذ معه.'},
  ask:['stones', 'kidney', 'g6pd'] },

{ sci:'Tocopherol', ar:'توكوفيرول', atc:'A11HA03', cat:'nut.vitamin', form:'capsule',
  doses:['200 IU', '400 IU', '1000 IU'], aka:['Vitamin E', 'Alpha-tocopherol'],
  notes:{en:'A supplement; high doses add to the effect of blood thinners.',
         ar:'مكمّل غذائي؛ الجرعات العالية تزيد أثر مميّعات الدم.'},
  ix:[
    ['Warfarin', W, 'High doses may raise the INR.', 'الجرعات العالية قد ترفع INR.']
  ],
  ask:['thinner'] },

{ sci:'Ergocalciferol', ar:'إرغوكالسيفيرول', atc:'A11CC01', cat:'nut.vitamin', form:'capsule',
  doses:['50,000 IU'], aka:['Vitamin D2'],
  notes:{en:'High-dose vitamin D, usually weekly for a set number of weeks — not daily. Report thirst, nausea or confusion (too much calcium).',
         ar:'فيتامين د بجرعة عالية، أسبوعياً عادة لعدد محدد من الأسابيع — لا يومياً. أبلغ عن العطش أو الغثيان أو التشوّش (زيادة الكالسيوم).'},
  ci:['hyperCa'],
  ask:['stones', 'whoFor'] },

{ sci:'Multivitamins', ar:'الفيتامينات المتعددة', atc:'A11BA', cat:'nut.vitamin', form:'tablet',
  doses:['tablet', 'syrup', 'drops', 'with minerals', 'pregnancy formulas'], brand:['Centrum', 'Pregnacare', 'Supradyn'], aka:['Multivitamin', 'Multivitamins with minerals'],
  notes:{en:'One a day with food; not a replacement for a varied diet. Products with iron are dangerous to small children — keep them out of reach. In pregnancy, use a pregnancy formula (limited vitamin A).',
         ar:'واحدة يومياً مع الطعام؛ لا تغني عن غذاء متنوّع. المستحضرات الحاوية على الحديد خطيرة على الأطفال الصغار — أبعدها عن متناولهم. في الحمل استعملي تركيبة مخصّصة للحمل (فيتامين أ محدود).'},
  ask:['preg', 'childAge', 'otherMeds'] },

/* ---------- Minerals ---------- */
{ sci:'Potassium chloride', ar:'كلوريد البوتاسيوم', atc:'A12BA01', cat:'nut.mineral', form:'tablet',
  doses:['600 mg MR', '20 mEq sachet'], brand:['Slow-K'],
  tags:['kSupp'], take:['afterFood'],
  notes:{en:'With food, a full glass, and sitting upright — it ulcerates the oesophagus. Swallow whole, never crushed.',
         ar:'مع الطعام وكوب ماء كامل وبقاء منتصباً — يقرّح المريء. يُبلع كاملاً دون سحق.'},
  ix:[
    ['Spironolactone', C, 'Life-threatening hyperkalaemia.', 'فرط بوتاسيوم مهدّد للحياة.'],
    ['Lisinopril', S, 'Hyperkalaemia.', 'فرط بوتاسيوم.'],
    ['Losartan', S, 'Hyperkalaemia.', 'فرط بوتاسيوم.']
  ],
  ci:['hyperK', 'renalSevere', {en:'Untreated Addison’s disease', ar:'داء أديسون غير معالج'}],
  ask:['kidney', 'bpMeds', 'swallow'] },

{ sci:'Calcium citrate', ar:'سترات الكالسيوم', atc:'A12AA13', cat:'nut.mineral', form:'tablet',
  doses:['250 mg with vitamin D', '500 mg'], brand:['Citracal'],
  tags:['polyvalent'],
  notes:{en:'Absorbed with or without food, and better than carbonate on acid-reducing medicines. Keep two hours from thyroid tablets, iron and some antibiotics.',
         ar:'يُمتص مع الطعام أو بدونه، وأفضل من الكربونات مع خافضات الحمض. افصل بينه وبين حبوب الدرقية والحديد وبعض المضادات الحيوية ساعتين.'},
  ask:['stones', 'otherMeds'] },

{ sci:'Calcium lactate', ar:'لاكتات الكالسيوم', atc:'A12AA05', cat:'nut.mineral', form:'tablet',
  doses:['300 mg'],
  tags:['polyvalent'],
  notes:{en:'A calcium supplement; keep it two hours from iron, thyroid tablets and some antibiotics.',
         ar:'مكمّل كالسيوم؛ افصل بينه وبين الحديد وحبوب الدرقية وبعض المضادات الحيوية ساعتين.'},
  ask:['stones', 'otherMeds'] },

{ sci:'Magnesium oxide', ar:'أكسيد المغنيسيوم', atc:'A12CC10', cat:'nut.mineral', form:'tablet',
  doses:['400 mg', 'in effervescent bowel preparations'],
  tags:['polyvalent'],
  notes:{en:'A magnesium supplement; it can loosen stools. Keep two hours from other medicines. Not in kidney failure.',
         ar:'مكمّل مغنيسيوم؛ قد يليّن البراز. افصل بينه وبين الأدوية الأخرى ساعتين. لا يُستعمل في الفشل الكلوي.'},
  ci:['renalSevere'],
  ask:['kidney', 'otherMeds'] },

{ sci:'Zinc sulfate', ar:'كبريتات الزنك', atc:'A12CB01', cat:'nut.mineral', form:'tablet',
  doses:['20 mg dispersible', '220 mg capsule', '10 mg/5 mL syrup', '0.25% eye drops'], aka:['Zinc sulphate', 'Zinc gluconate', 'Zinc acetate'],
  tags:['polyvalent'],
  notes:{en:'For children with diarrhoea: once a day for 10–14 days alongside rehydration. With food if it upsets the stomach; keep apart from quinolone and tetracycline antibiotics.',
         ar:'للأطفال المصابين بالإسهال: مرة يومياً لمدة 10–14 يوماً مع الإرواء. مع الطعام إن أزعج المعدة؛ وبعيداً عن مضادات الكينولون والتتراسيكلين.'},
  ask:['childAge', 'otherMeds'] },

{ sci:'Sodium fluoride', ar:'فلوريد الصوديوم', atc:'A12CD01', cat:'nut.mineral', form:'tablet',
  doses:['0.25 mg', '0.5 mg', '1 mg tablet or drops'], brand:['Zymafluor'],
  notes:{en:'Only where drinking water is low in fluoride and on a dentist’s advice — too much mottles the teeth.',
         ar:'فقط حيث يكون الفلوريد في ماء الشرب منخفضاً وبنصيحة طبيب الأسنان — الزيادة تبقّع الأسنان.'},
  ask:['childAge'] },

{ sci:'Sevelamer', ar:'سيفيلامير', atc:'V03AE02', cat:'nut.mineral', form:'tablet',
  doses:['800 mg', '2.4 g sachet'], brand:['Renvela', 'Renagel'], aka:['Sevelamer carbonate', 'Sevelamer hydrochloride'],
  notes:{en:'With meals, to bind phosphate in kidney failure. Other medicines one hour before or three hours after.',
         ar:'مع الوجبات، لربط الفوسفات في الفشل الكلوي. تؤخذ الأدوية الأخرى قبله بساعة أو بعده بثلاث ساعات.'},
  ix:[
    ['Ciprofloxacin', S, 'Binds it — ciprofloxacin two hours before.', 'يربطه — يؤخذ السيبروفلوكساسين قبله بساعتين.'],
    ['Levothyroxine', W, 'Binds it — four hours apart.', 'يربطه — بفاصل أربع ساعات.'],
    ['Mycophenolate', W, 'Lowers mycophenolate absorption.', 'يقلّل امتصاص الميكوفينولات.']
  ],
  ci:['obstruction'],
  ask:['kidney', 'otherMeds'] },

{ sci:'Calcium acetate', ar:'أسيتات الكالسيوم', atc:'V03AE07', cat:'nut.mineral', form:'tablet',
  doses:['667 mg', '950 mg'], brand:['PhosLo', 'Renacet'],
  tags:['polyvalent'],
  notes:{en:'With meals, to bind phosphate in kidney failure. Calcium levels are checked.',
         ar:'مع الوجبات، لربط الفوسفات في الفشل الكلوي. يُفحص مستوى الكالسيوم.'},
  ci:['hyperCa'],
  ask:['kidney', 'otherMeds'] },

/* ---------- Supplements ---------- */

{ sci:'Ubidecarenone', ar:'يوبيديكارينون', atc:'C01EB09', cat:'nut.supplement', form:'capsule',
  doses:['30 mg', '100 mg', '200 mg'], aka:['Coenzyme Q10', 'Ubiquinone', 'CoQ10'],
  notes:{en:'A supplement, sometimes taken for statin muscle aches; the evidence is limited. It may slightly weaken warfarin.',
         ar:'مكمّل غذائي، يُؤخذ أحياناً لآلام العضلات من الستاتينات؛ والأدلة محدودة. قد يُضعف الوارفارين قليلاً.'},
  ix:[
    ['Warfarin', W, 'May lower the INR.', 'قد يخفض INR.']
  ],
  ask:['thinner'] },

{ sci:'Levocarnitine', ar:'ليفوكارنيتين', atc:'A16AA01', cat:'nut.supplement', form:'solution',
  doses:['1 g/10 mL oral solution', '330 mg', '500 mg tablet', '1 g/5 mL injection'], brand:['Carnitor'], aka:['L-carnitine', 'Carnitine'],
  notes:{en:'For carnitine deficiency and in dialysis. As a slimming or sports supplement the evidence is weak. A fishy body odour can occur.',
         ar:'لنقص الكارنيتين وفي الغسيل الكلوي. كمكمّل للتنحيف أو الرياضة الأدلة ضعيفة. قد تظهر رائحة جسم تشبه السمك.'},
  ask:['kidney', 'whatFor'] },

{ sci:'Aspartame', ar:'أسبارتام', atc:'V06', cat:'nut.supplement', form:'tablet',
  doses:['18 mg', '20 mg sweetener tablet'], brand:['Canderel', 'Kandrine', 'Furasweet'],
  notes:{en:'A sugar-free sweetener for tea and coffee, suitable in diabetes. It contains phenylalanine, so it is not for people with phenylketonuria.',
         ar:'مُحلٍّ خالٍ من السكر للشاي والقهوة، مناسب لمرضى السكري. يحتوي على الفينيل ألانين، لذا لا يُستعمل لمن لديهم بيلة الفينيل كيتون.'},
  ci:[{en:'Phenylketonuria', ar:'بيلة الفينيل كيتون'}],
  ask:['diabetes', 'whoFor'] },

{ sci:'Inositol', ar:'إينوزيتول', atc:'A11HA07', cat:'nut.supplement', form:'sachet',
  doses:['2 g myo-inositol with folic acid', '600 mg capsule'], brand:['Ovasitol', 'Inofolic'], aka:['Myo-inositol'],
  notes:{en:'Used in polycystic ovary syndrome to help regular cycles and insulin resistance; well tolerated.',
         ar:'يُستعمل في متلازمة تكيّس المبايض لتنظيم الدورة ومقاومة الأنسولين؛ جيد التحمّل.'},
  ask:['preg', 'diabetes'] }

];
