/* Hormones: thyroid, systemic corticosteroids, pituitary and growth,
   calcium and parathyroid, male hormones. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Thyroid ---------- */
{ sci:'Levothyroxine', ar:'ليفوثيروكسين', atc:'H03AA01', cat:'end.thyroid', form:'tablet',
  doses:['25 mcg', '50 mcg', '75 mcg', '100 mcg'], brand:['Euthyrox', 'Eltroxin'], aka:['Thyroxine', 'L-thyroxine'],
  tags:['chelatableMild'], take:['emptyStomach', 'beforeBreakfast'],
  notes:{en:'Empty stomach, thirty minutes before breakfast, and four hours away from iron and calcium. Do not switch between manufacturers without reason.',
         ar:'على معدة فارغة قبل الفطور بنصف ساعة، وبعيداً عن الحديد والكالسيوم بأربع ساعات. لا يُبدّل بين الشركات بلا داعٍ.'},
  ix:[
    ['Ferrous sulfate', S, 'Blocks absorption — space by four hours.', 'يمنع الامتصاص — باعد أربع ساعات.'],
    ['Calcium carbonate', S, 'Blocks absorption — space by four hours.', 'يمنع الامتصاص — باعد أربع ساعات.'],
    ['Omeprazole', W, 'Reduces absorption.', 'يقلّل الامتصاص.'],
    ['Warfarin', S, 'Warfarin’s effect grows as the thyroid state corrects.', 'يزيد أثر الوارفارين مع تحسّن الحالة الدرقية.']
  ],
  ci:['thyrotoxicosis', 'adrenal'],
  ask:['antacids', 'heart', 'preg'] },

{ sci:'Carbimazole', ar:'كاربيمازول', atc:'H03BB01', cat:'end.thyroid', form:'tablet',
  doses:['5 mg', '20 mg'], brand:['Neo-Mercazole'],
  notes:{en:'Rarely it wipes out the white cells: a sore throat, fever or mouth ulcers mean stop and get a blood count the same day. In the first trimester of pregnancy, propylthiouracil is used instead.',
         ar:'نادراً ما يُفني الكريات البيض: التهاب الحلق أو الحرارة أو قروح الفم تستوجب الإيقاف وإجراء تعداد دم في اليوم نفسه. في الثلث الأول من الحمل يُستعمل البروبيل ثيويوراسيل بدلاً منه.'},
  ci:['preg1', {en:'Previous agranulocytosis on carbimazole', ar:'ندرة محبّبات سابقة مع الكاربيمازول'}],
  ask:['infection', 'preg', 'labs'] },

{ sci:'Thiamazole', ar:'ثيامازول', atc:'H03BB02', cat:'end.thyroid', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg'], brand:['Thyrozol', 'Tapazole'], aka:['Methimazole'],
  notes:{en:'A sore throat, fever or mouth ulcers mean stop and get a blood count the same day. Not in the first trimester of pregnancy.',
         ar:'التهاب الحلق أو الحرارة أو قروح الفم تستوجب الإيقاف وإجراء تعداد دم في اليوم نفسه. لا يُستعمل في الثلث الأول من الحمل.'},
  ci:['preg1', {en:'Previous agranulocytosis on this drug', ar:'ندرة محبّبات سابقة مع هذا الدواء'}],
  ask:['infection', 'preg', 'labs'] },

{ sci:'Propylthiouracil', ar:'بروبيل ثيويوراسيل', atc:'H03BA02', cat:'end.thyroid', form:'tablet',
  doses:['50 mg', '100 mg'], brand:['PTU'],
  notes:{en:'Used in early pregnancy and in thyroid storm. It can harm the liver — report nausea, dark urine or yellowing — and a sore throat or fever needs a blood count.',
         ar:'يُستعمل في بداية الحمل وفي عاصفة الدرق. قد يؤذي الكبد — أبلغ عن الغثيان أو غمق البول أو الاصفرار — والتهاب الحلق أو الحرارة يستوجب تعداد دم.'},
  ci:['hepActive'],
  ask:['preg', 'liver', 'infection'] },

{ sci:'Liothyronine', ar:'ليوثيرونين', atc:'H03AA02', cat:'end.thyroid', form:'tablet',
  doses:['20 microgram', '25 microgram'], brand:['Cytomel', 'Tertroxin'],
  tags:['chelatableMild'],
  notes:{en:'Faster and shorter-acting than levothyroxine. Report palpitations, chest pain or tremor — signs of too much.',
         ar:'أسرع وأقصر مفعولاً من الليفوثيروكسين. أبلغ عن الخفقان أو ألم الصدر أو الرجفة — علامات الزيادة.'},
  ci:['thyrotoxicosis', 'adrenal'],
  ask:['heart', 'antacids'] },

/* ---------- Corticosteroids (systemic) ---------- */
{ sci:'Prednisolone', ar:'بريدنيزولون', atc:'H02AB06', cat:'end.steroid', form:'tablet',
  doses:['5 mg', '20 mg', '25 mg'], brand:['Deltacortril'],
  tags:['corticosteroid'], take:['morning', 'withFood'],
  notes:{en:'In the morning, with food. Never stopped abruptly after more than three weeks — adrenal crisis. They need a steroid card.',
         ar:'صباحاً مع الطعام. لا يُوقف فجأة بعد أكثر من ثلاثة أسابيع — قصور كظر. بطاقة الستيرويد ضرورية.'},
  ix:[
    ['Ibuprofen', S, 'Compounded ulcer and GI bleeding risk.', 'خطر قرحة ونزف هضمي مضاعف.'],
    ['Insulin glargine', S, 'Raises glucose — the dose may need to go up.', 'يرفع سكر الدم — قد تلزم زيادة الجرعة.'],
    ['Warfarin', W, 'May raise INR.', 'قد يرفع INR.']
  ],
  ci:['systemicInfection', {en:'Live vaccines at immunosuppressive doses', ar:'اللقاحات الحية بالجرعات المثبّطة للمناعة'}],
  ask:['steroidCourse', 'diabetes', 'infection'] },

{ sci:'Hydrocortisone', ar:'هيدروكورتيزون', atc:'H02AB09', cat:'end.steroid', form:'tablet',
  doses:['10 mg', '20 mg tablet', '100 mg injection'], brand:['Cortef', 'Solu-Cortef'], aka:['Hydrocortisone sodium succinate'],
  tags:['corticosteroid'],
  notes:{en:'In adrenal insufficiency it replaces a missing hormone: never miss or stop it, double it during a fever (the sick-day rules), and carry a steroid card. The injection treats severe asthma, allergic reactions and adrenal crisis.',
         ar:'في قصور الكظر يعوّض هرموناً ناقصاً: لا تفوّت جرعة ولا توقفه، وضاعفه أثناء الحمّى (قواعد أيام المرض)، واحمل بطاقة الكورتيزون. الحقنة تعالج الربو الشديد وتفاعلات الحساسية وأزمة الكظر.'},
  ci:['systemicInfection'],
  ask:['steroidCourse', 'infection', 'diabetes'] },

{ sci:'Dexamethasone', ar:'ديكساميثازون', atc:'H02AB02', cat:'end.steroid', form:'tablet',
  doses:['0.5 mg', '4 mg', '8 mg tablet', '4 mg/mL and 8 mg/2 mL injection', '0.5 mg/5 mL elixir'], brand:['Decadron', 'Dexona'],
  tags:['corticosteroid'], take:['morning', 'withFood'],
  notes:{en:'A strong steroid: in the morning with food. It raises blood sugar and can disturb sleep and mood. Courses longer than a few weeks are tapered, never stopped at once.',
         ar:'كورتيزون قوي: صباحاً مع الطعام. يرفع سكر الدم وقد يُربك النوم والمزاج. الدورات الأطول من بضعة أسابيع تُخفّض تدريجياً ولا تُوقف دفعة واحدة.'},
  ci:['systemicInfection', 'fungalSystemic'],
  ask:['diabetes', 'infection', 'steroidCourse'] },

{ sci:'Betamethasone', ar:'بيتاميثازون', atc:'H02AB01', cat:'end.steroid', form:'injection',
  doses:['7 mg/mL depot injection (dipropionate + phosphate)', '4 mg/mL injection', '0.5 mg tablet', '0.5 mg soluble tablet', 'eye, ear and nose drops'], brand:['Diprofos', 'Diprospan', 'Celestone', 'Betnesol'], aka:['Betamethasone sodium phosphate', 'Betamethasone dipropionate injection'],
  tags:['corticosteroid'],
  notes:{en:'The depot injection acts for weeks, so it is given sparingly — a few times a year at most; it raises blood sugar for days. Before an early birth it matures the baby’s lungs. Tablets go in the morning with food.',
         ar:'الحقنة طويلة المفعول تعمل أسابيع، لذا تُعطى باعتدال — بضع مرات في السنة كحد أقصى؛ وترفع سكر الدم لأيام. قبل الولادة المبكرة تُنضج رئتي الجنين. الأقراص صباحاً مع الطعام.'},
  ci:['systemicInfection', 'fungalSystemic'],
  ask:['diabetes', 'infection', 'steroidCourse'] },

{ sci:'Methylprednisolone', ar:'ميثيل بريدنيزولون', atc:'H02AB04', cat:'end.steroid', form:'tablet',
  doses:['4 mg', '16 mg', '32 mg tablet', '40 mg', '125 mg', '500 mg', '1 g injection', '40 mg/mL depot (acetate)'], brand:['Medrol', 'Solu-Medrol', 'Depo-Medrol'],
  tags:['corticosteroid'], take:['morning', 'withFood'],
  notes:{en:'In the morning with food. Raises blood sugar; long courses are tapered. Depot injections into joints are limited to a few a year.',
         ar:'صباحاً مع الطعام. يرفع سكر الدم؛ والدورات الطويلة تُخفّض تدريجياً. حقن المفاصل طويلة المفعول محدودة ببضع مرات في السنة.'},
  ci:['systemicInfection', 'fungalSystemic'],
  ask:['diabetes', 'infection', 'steroidCourse'] },

{ sci:'Triamcinolone', ar:'تريامسينولون', atc:'H02AB08', cat:'end.steroid', form:'injection',
  doses:['40 mg/mL injection', '10 mg/mL injection', '55 microgram nasal spray'], brand:['Kenacort-A', 'Kenalog', 'Nasacort'], aka:['Triamcinolone acetonide'],
  tags:['corticosteroid'],
  notes:{en:'Injected into joints or keloids by a doctor, a few times a year at most; a depot injection into muscle acts for weeks. The nasal spray treats hay fever once a day.',
         ar:'يحقنه الطبيب في المفاصل أو الجُدرات، بضع مرات في السنة كحد أقصى؛ وحقنة العضل طويلة المفعول تعمل أسابيع. بخاخ الأنف يعالج حساسية الأنف مرة يومياً.'},
  ci:['systemicInfection', 'skinInfection'],
  ask:['diabetes', 'infection', 'steroidCourse'] },

{ sci:'Deflazacort', ar:'ديفلازاكورت', atc:'H02AB13', cat:'end.steroid', form:'tablet',
  doses:['6 mg', '30 mg'], brand:['Calcort'],
  tags:['corticosteroid'], take:['morning', 'withFood'],
  notes:{en:'In the morning with food. Long courses are tapered, never stopped at once. Carry a steroid card on long courses.',
         ar:'صباحاً مع الطعام. الدورات الطويلة تُخفّض تدريجياً ولا تُوقف دفعة واحدة. احمل بطاقة الكورتيزون في الدورات الطويلة.'},
  ci:['systemicInfection'],
  ask:['diabetes', 'infection', 'steroidCourse'] },

{ sci:'Fludrocortisone', ar:'فلودروكورتيزون', atc:'H02AA02', cat:'end.steroid', form:'tablet',
  doses:['0.1 mg'], brand:['Florinef'],
  tags:['kLosing'],
  notes:{en:'Replaces aldosterone in adrenal insufficiency, or raises blood pressure in postural hypotension. Report ankle swelling, headaches or muscle cramps.',
         ar:'يعوّض الألدوستيرون في قصور الكظر، أو يرفع الضغط في هبوطه الانتصابي. أبلغ عن تورّم الكاحلين أو الصداع أو تشنّجات العضلات.'},
  ci:['systemicInfection', 'hfDecomp'],
  ask:['bp', 'steroidCourse'] },

/* ---------- Pituitary and growth ---------- */

{ sci:'Somatropin', ar:'سوماتروبين', atc:'H01AC01', cat:'end.pituitary', form:'injection',
  doses:['5 mg', '10 mg', '12 mg pen'], brand:['Genotropin', 'Norditropin', 'Omnitrope'], aka:['Growth hormone', 'rhGH'],
  notes:{en:'A daily injection in the evening, rotating sites; keep it in the fridge. Report headaches with vision changes, or a limp or hip pain in a child.',
         ar:'حقنة يومية مساءً مع تبديل المواضع؛ تُحفظ في الثلاجة. أبلغ عن الصداع مع تغيّر النظر، أو العرج أو ألم الورك عند الطفل.'},
  ci:[{en:'Active cancer', ar:'سرطان فعّال'}, {en:'Acute critical illness', ar:'مرض حرج حاد'}],
  ask:['injectTech', 'cold', 'diabetes'] },

{ sci:'Octreotide', ar:'أوكتريوتايد', atc:'H01CB02', cat:'end.pituitary', form:'injection',
  doses:['0.05 mg', '0.1 mg', '0.5 mg/mL injection', '10 mg', '20 mg', '30 mg LAR'], brand:['Sandostatin'],
  tags:['qtPossible'],
  notes:{en:'For acromegaly, hormone-secreting tumours, and bleeding varices in hospital. Injections between meals; long use can cause gallstones.',
         ar:'لضخامة الأطراف والأورام المفرزة للهرمونات، ولنزف الدوالي في المستشفى. تُعطى الحقن بين الوجبات؛ والاستعمال الطويل قد يسبّب حصى المرارة.'},
  ask:['diabetes', 'rhythm'] },

{ sci:'Desmopressin', ar:'ديسموبريسين', atc:'H01BA02', cat:'end.pituitary', form:'tablet',
  doses:['0.1 mg', '0.2 mg tablet', '120 microgram melt', '10 microgram/dose nasal spray', '4 microgram/mL injection'], brand:['Minirin', 'DDAVP'],
  notes:{en:'For bedwetting and diabetes insipidus. Limit drinks from an hour before until eight hours after an evening dose: too much fluid dangerously lowers sodium — headache, vomiting, confusion or fits.',
         ar:'للتبوّل الليلي والسكري الكاذب. قلّل الشرب من ساعة قبل الجرعة المسائية حتى ثماني ساعات بعدها: السوائل الكثيرة تخفض الصوديوم خفضاً خطيراً — صداع أو قيء أو تشوّش أو اختلاج.'},
  ci:[{en:'Habitual excessive drinking', ar:'الإفراط المعتاد في الشرب'}, 'hfDecomp', {en:'Low sodium', ar:'نقص الصوديوم'}],
  ask:['childAge', 'heartFailure', 'kidney'] },

{ sci:'Cabergoline', ar:'كابرغولين', atc:'G02CB03', cat:'end.pituitary', form:'tablet',
  doses:['0.5 mg'], brand:['Dostinex'],
  tags:['dopaminergic'], take:['withFood'],
  notes:{en:'For high prolactin, usually twice a week, or to stop breast milk. With food; dizziness and nausea at first. Long, high-dose use needs heart-valve checks.',
         ar:'لارتفاع هرمون الحليب، مرتين أسبوعياً عادة، أو لإيقاف حليب الثدي. مع الطعام؛ دوخة وغثيان في البداية. الاستعمال الطويل بجرعات عالية يحتاج فحص صمامات القلب.'},
  ci:[{en:'Heart-valve disease or fibrosis', ar:'مرض صمامات القلب أو التليّف'}, {en:'Pre-eclampsia or high blood pressure after delivery', ar:'مقدمات الارتعاج أو ارتفاع الضغط بعد الولادة'}],
  ask:['bp', 'heart', 'preg'] },

{ sci:'Bromocriptine', ar:'بروموكريبتين', atc:'G02CB01', cat:'end.pituitary', form:'tablet',
  doses:['2.5 mg'], brand:['Parlodel'],
  tags:['dopaminergic'], take:['withFood'],
  notes:{en:'For high prolactin and acromegaly. With food, starting at bedtime; dizziness on standing and nausea are common at first.',
         ar:'لارتفاع هرمون الحليب وضخامة الأطراف. مع الطعام، ويُبدأ به قبل النوم؛ الدوخة عند الوقوف والغثيان شائعان في البداية.'},
  ci:['uncontrolledHtn', {en:'Pre-eclampsia or high blood pressure after delivery', ar:'مقدمات الارتعاج أو ارتفاع الضغط بعد الولادة'}],
  ask:['bp', 'heart', 'preg'] },

{ sci:'Thyrotropin alfa', ar:'ثيروتروبين ألفا', atc:'H01AB01', cat:'end.pituitary', form:'injection',
  doses:['0.9 mg vial'], brand:['Thyrogen'],
  notes:{en:'Two injections on consecutive days before thyroid-cancer scans or radioiodine; nausea and headache are common.',
         ar:'حقنتان في يومين متتاليين قبل فحوص سرطان الدرق أو اليود المشع؛ الغثيان والصداع شائعان.'},
  ask:['heart'] },

/* ---------- Calcium and parathyroid ---------- */

{ sci:'Calcitriol', ar:'كالسيتريول', atc:'A11CC04', cat:'end.calcium', form:'capsule',
  doses:['0.25 microgram', '0.5 microgram', '1 microgram/mL injection'], brand:['Rocaltrol'],
  notes:{en:'Active vitamin D for kidney disease and low parathyroid. Calcium is checked — report thirst, nausea or confusion (high calcium).',
         ar:'فيتامين د النشط لأمراض الكلى وقصور الجارات الدرقية. يُفحص الكالسيوم — أبلغ عن العطش أو الغثيان أو التشوّش (ارتفاع الكالسيوم).'},
  ix:[
    ['#thiazide', W, 'Thiazides raise calcium further — check it.', 'المدرّات الثيازيدية ترفع الكالسيوم أكثر — افحصه.']
  ],
  ci:['hyperCa'],
  ask:['stones', 'labs', 'kidney'] },

{ sci:'Alfacalcidol', ar:'ألفاكالسيدول', atc:'A11CC03', cat:'end.calcium', form:'capsule',
  doses:['0.25 microgram', '0.5 microgram', '1 microgram', '2 microgram/mL drops'], brand:['One-Alpha'],
  notes:{en:'Active vitamin D for kidney disease and low parathyroid. Calcium is checked — report thirst, nausea or confusion.',
         ar:'فيتامين د النشط لأمراض الكلى وقصور الجارات الدرقية. يُفحص الكالسيوم — أبلغ عن العطش أو الغثيان أو التشوّش.'},
  ix:[
    ['#thiazide', W, 'Thiazides raise calcium further — check it.', 'المدرّات الثيازيدية ترفع الكالسيوم أكثر — افحصه.']
  ],
  ci:['hyperCa'],
  ask:['stones', 'labs', 'kidney'] },

{ sci:'Paricalcitol', ar:'باريكالسيتول', atc:'H05BX02', cat:'end.calcium', form:'capsule',
  doses:['1 microgram', '2 microgram capsule', '5 microgram/mL injection'], brand:['Zemplar'],
  notes:{en:'For raised parathyroid hormone in kidney disease; calcium and phosphate are checked.',
         ar:'لارتفاع هرمون الجارات الدرقية في أمراض الكلى؛ يُفحص الكالسيوم والفوسفات.'},
  ci:['hyperCa'],
  ask:['labs', 'kidney'] },

{ sci:'Cinacalcet', ar:'سيناكالسيت', atc:'H05BX01', cat:'end.calcium', form:'tablet',
  doses:['30 mg', '60 mg', '90 mg'], brand:['Mimpara', 'Sensipar'],
  take:['withFood'],
  notes:{en:'With food. It lowers calcium — report tingling, cramps or twitching.',
         ar:'مع الطعام. يخفض الكالسيوم — أبلغ عن الوخز أو التشنّجات أو الارتعاش.'},
  ci:['hypoCa'],
  ask:['labs', 'epilepsy'] },

{ sci:'Calcitonin', ar:'كالسيتونين', atc:'H05BA01', cat:'end.calcium', form:'injection',
  doses:['50 units/mL', '100 units/mL injection', '200 units nasal spray'], brand:['Miacalcic'], aka:['Salmon calcitonin'],
  notes:{en:'Mostly for high calcium or Paget’s disease in hospital; nausea and flushing are common.',
         ar:'لارتفاع الكالسيوم أو داء باجيت في المستشفى غالباً؛ الغثيان والاحمرار شائعان.'},
  ci:['hypoCa'],
  ask:['allergy'] },

/* ---------- Male hormones ---------- */

{ sci:'Testosterone', ar:'تستوستيرون', atc:'G03BA03', cat:'end.androgen', form:'injection',
  doses:['250 mg/mL mixed esters', '1000 mg/4 mL undecanoate', '1% and 2% gel', '40 mg capsule'], brand:['Sustanon', 'Nebido', 'Androgel', 'Testoviron'],
  notes:{en:'Blood count, PSA and liver tests are checked. The gel passes on by skin contact — cover the area, wash your hands, and keep it from women and children. It stops sperm production.',
         ar:'يُفحص تعداد الدم وPSA ووظائف الكبد. الهلام ينتقل بملامسة الجلد — غطِّ المنطقة واغسل يديك وأبعده عن النساء والأطفال. يوقف إنتاج النطاف.'},
  ci:['prostateCancer', 'preg'],
  ask:['whatFor', 'prostate', 'clots'] },

{ sci:'Nandrolone', ar:'ناندرولون', atc:'A14AB01', cat:'end.androgen', form:'injection',
  doses:['25 mg/mL', '50 mg/mL', '100 mg/mL'], brand:['Deca-Durabolin'],
  notes:{en:'An anabolic steroid with narrow medical uses. It is misused for body-building and harms the liver, heart and fertility — dispense only against a prescription.',
         ar:'ستيرويد ابتنائي لاستعمالات طبية محدودة. يُساء استعماله لبناء العضلات ويؤذي الكبد والقلب والخصوبة — لا يُصرف إلا بوصفة.'},
  ci:['prostateCancer', 'preg', 'hepSevere'],
  ask:['whatFor', 'prescription'] },

{ sci:'Mesterolone', ar:'ميستيرولون', atc:'G03BB01', cat:'end.androgen', form:'tablet',
  doses:['25 mg'], brand:['Proviron'],
  notes:{en:'An oral androgen for low testosterone; it does not improve fertility. Liver tests and PSA may be checked.',
         ar:'أندروجين فموي لنقص التستوستيرون؛ لا يحسّن الخصوبة. قد تُفحص وظائف الكبد وPSA.'},
  ci:['prostateCancer', 'hepSevere'],
  ask:['whatFor', 'prostate'] },

{ sci:'Danazol', ar:'دانازول', atc:'G03XA01', cat:'end.androgen', form:'capsule',
  doses:['100 mg', '200 mg'], brand:['Danol'],
  notes:{en:'It causes birth defects — a non-hormonal contraceptive is needed. Weight gain, acne, oily skin and a deeper voice (which may not reverse) can occur.',
         ar:'يسبّب تشوّهات للجنين — تلزم وسيلة منع حمل غير هرمونية. قد يسبّب زيادة الوزن وحب الشباب ودهنية الجلد وخشونة الصوت (وقد لا تزول).'},
  ci:['pregTeratogen', 'vte', 'hepSevere'],
  ask:['pregTest', 'clots'] }

];
