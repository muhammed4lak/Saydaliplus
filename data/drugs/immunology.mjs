/* The immune system: transplant immunosuppressants and the biologics used
   for inflammatory disease. What they share is that infections (tuberculosis
   and hepatitis B above all) are screened for first, and that live vaccines
   are off the table. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Immunosuppressants ---------- */
{ sci:'Azathioprine', ar:'آزاثيوبرين', atc:'L04AX01', cat:'imm.suppressant', form:'tablet',
  doses:['25 mg', '50 mg'], brand:['Imuran'],
  tags:['immunosuppressant', 'thiopurine'], take:['afterFood'],
  notes:{en:'Needs regular blood counts. Any fever or sore throat means check the count before anything else.',
         ar:'يستوجب تعداد دم منتظماً. أي حمّى أو التهاب حلق يستوجب فحص التعداد قبل أي شيء آخر.'},
  ix:[
    ['Allopurinol', C, 'Life-threatening marrow suppression — quarter the dose or avoid the combination.', 'تثبيط نقي مهدّد للحياة — تُخفّض الجرعة إلى الربع أو يُتجنّب الجمع.'],
    ['Trimethoprim/Sulfamethoxazole', S, 'Compounded marrow suppression.', 'تثبيط نقي مضاعف.'],
    ['Warfarin', W, 'Reduces warfarin’s effect.', 'يقلّل أثر الوارفارين.']
  ],
  ci:['preg', 'marrow', 'infection'],
  ask:['labs', 'infection', 'otherMeds'] },

{ sci:'Ciclosporin', ar:'سيكلوسبورين', atc:'L04AD01', cat:'imm.suppressant', form:'capsule',
  doses:['25 mg', '50 mg', '100 mg capsule', '100 mg/mL solution', '50 mg/mL injection', '0.05% eye emulsion'], brand:['Neoral', 'Sandimmun', 'Restasis'], aka:['Cyclosporine', 'Cyclosporin'],
  tags:['immunosuppressant', 'nephrotoxic', 'sub3a4', 'inducerSensitive'],
  notes:{en:'At the same times every day, and stay on one brand — they are not interchangeable. Blood levels, kidney function and blood pressure are checked. No grapefruit. The eye emulsion is for dry eyes.',
         ar:'في الأوقات نفسها كل يوم، مع البقاء على ماركة واحدة — الماركات غير قابلة للتبديل. يُفحص مستواه في الدم ووظائف الكلى والضغط. لا جريب فروت. مستحلب العين لجفاف العين.'},
  ix:[
    ['Simvastatin', C, 'Rhabdomyolysis — contraindicated.', 'انحلال العضلات المخططة — ممنوع الجمع.'],
    ['#statin', S, 'Raises statin levels — muscle damage; use the lowest dose.', 'يرفع مستوى الستاتين — أذية عضلية؛ استعمل أقل جرعة.'],
    ['#kSparing', S, 'Hyperkalaemia.', 'فرط بوتاسيوم.'],
    ['Grapefruit juice', S, 'Raises ciclosporin — none during treatment.', 'يرفع السيكلوسبورين — لا يُشرب أثناء العلاج.']
  ],
  ci:['seriousInfection', 'uncontrolledHtn'],
  ask:['otherMeds', 'labs', 'bp'] },

{ sci:'Tacrolimus', ar:'تاكروليموس', atc:'L04AD02', cat:'imm.suppressant', form:'capsule',
  doses:['0.5 mg', '1 mg', '5 mg capsule', '0.5–5 mg prolonged-release', '0.03% and 0.1% ointment'], brand:['Prograf', 'Advagraf', 'Protopic'],
  tags:['immunosuppressant', 'nephrotoxic', 'sub3a4', 'inducerSensitive', 'qtPossible'], take:['emptyStomach'],
  notes:{en:'On an empty stomach at the same times. Twice-daily and once-daily products are not interchangeable — mix-ups have been fatal. Blood levels are checked. No grapefruit. The ointment is for eczema: burning at first, and avoid strong sun.',
         ar:'على معدة فارغة في الأوقات نفسها. المستحضرات مرتين يومياً ومرة يومياً غير قابلة للتبديل — الخلط بينها كان قاتلاً. يُفحص مستواه في الدم. لا جريب فروت. المرهم للإكزيما: حرقة في البداية، وتجنّب الشمس القوية.'},
  ix:[
    ['Grapefruit juice', S, 'Raises tacrolimus — none during treatment.', 'يرفع التاكروليموس — لا يُشرب أثناء العلاج.']
  ],
  ci:['seriousInfection'],
  ask:['otherMeds', 'labs', 'diabetes'] },

{ sci:'Mycophenolate', ar:'ميكوفينولات', atc:'L04AA06', cat:'imm.suppressant', form:'tablet',
  doses:['250 mg capsule', '500 mg tablet', '1 g/5 mL suspension', '180 mg', '360 mg (mycophenolic acid)'], brand:['CellCept', 'Myfortic'], aka:['Mycophenolate mofetil', 'Mycophenolic acid', 'Mycophenolate sodium'],
  tags:['immunosuppressant', 'chelatableMild'],
  notes:{en:'It causes birth defects and miscarriage — two reliable contraceptive methods and pregnancy tests. The two forms (mofetil and sodium) are not interchangeable milligram for milligram. Blood counts are checked; report infections.',
         ar:'يسبّب تشوّهات للجنين والإجهاض — وسيلتان موثوقتان لمنع الحمل واختبارات حمل. الشكلان (موفيتيل والصوديوم) غير متساويين ملغماً بملغم. يُفحص تعداد الدم؛ أبلغ عن العدوى.'},
  ci:['pregTeratogen', 'seriousInfection'],
  ask:['pregTest', 'infection', 'labs'] },

{ sci:'Sirolimus', ar:'سيروليموس', atc:'L04AA10', cat:'imm.suppressant', form:'tablet',
  doses:['0.5 mg', '1 mg', '2 mg', '1 mg/mL solution'], brand:['Rapamune'],
  tags:['immunosuppressant', 'sub3a4crit', 'inducerSensitive'],
  notes:{en:'Once a day, consistently with or without food. Blood levels are checked; mouth ulcers, raised lipids and slow wound healing are common. No grapefruit.',
         ar:'مرة واحدة يومياً، إما دائماً مع الطعام أو دائماً بدونه. يُفحص مستواه في الدم؛ قروح الفم وارتفاع الدهون وبطء التئام الجروح شائعة. لا جريب فروت.'},
  ci:['seriousInfection'],
  ask:['otherMeds', 'labs', 'infection'] },

{ sci:'Basiliximab', ar:'باسيليكسيماب', atc:'L04AC02', cat:'imm.suppressant', form:'injection',
  doses:['20 mg vial'], brand:['Simulect'],
  tags:['immunosuppressant'],
  notes:{en:'Two infusions around a kidney transplant to prevent early rejection.',
         ar:'تسريبتان حول زرع الكلية للوقاية من الرفض المبكر.'},
  ask:['infection'] },

{ sci:'Antithymocyte globulin', ar:'الغلوبولين المضاد للخلايا التوتية', atc:'L04AA04', cat:'imm.suppressant', form:'injection',
  doses:['25 mg (rabbit)', '250 mg (equine)'], brand:['Thymoglobulin', 'ATGAM'], aka:['ATG', 'Anti-thymocyte globulin'],
  tags:['immunosuppressant'],
  notes:{en:'Hospital infusions for transplant rejection and aplastic anaemia; fever, chills and allergic reactions during infusion are watched for.',
         ar:'تسريب في المستشفى لرفض الزرع وفقر الدم اللاتنسّجي؛ تُراقب الحمى والرعشة وتفاعلات التحسّس أثناء التسريب.'},
  ask:['allergy', 'infection'] },

/* ---------- Biologics for inflammatory disease ---------- */

{ sci:'Adalimumab', ar:'أداليموماب', atc:'L04AB04', cat:'imm.biologic', form:'injection',
  doses:['40 mg pen and syringe', '20 mg', '80 mg'], brand:['Humira', 'Amgevita', 'Hyrimoz'],
  tags:['immunosuppressant'],
  notes:{en:'An injection every two weeks, kept in the fridge. Tuberculosis and hepatitis B are checked first; report fever, cough, weight loss or night sweats. No live vaccines.',
         ar:'حقنة كل أسبوعين، تُحفظ في الثلاجة. يُفحص السل والتهاب الكبد B أولاً؛ أبلغ عن الحرارة أو السعال أو نقص الوزن أو التعرّق الليلي. لا لقاحات حية.'},
  ci:['seriousInfection', 'hfDecomp'],
  ask:['tb', 'infection', 'cold'] },

{ sci:'Etanercept', ar:'إيتانيرسيبت', atc:'L04AB01', cat:'imm.biologic', form:'injection',
  doses:['25 mg', '50 mg'], brand:['Enbrel', 'Benepali'],
  tags:['immunosuppressant'],
  notes:{en:'A weekly (or twice-weekly) injection, kept in the fridge. Tuberculosis is checked first; report fever or persistent cough. No live vaccines.',
         ar:'حقنة أسبوعية (أو مرتين أسبوعياً)، تُحفظ في الثلاجة. يُفحص السل أولاً؛ أبلغ عن الحرارة أو السعال المستمر. لا لقاحات حية.'},
  ci:['seriousInfection'],
  ask:['tb', 'infection', 'cold'] },

{ sci:'Infliximab', ar:'إنفليكسيماب', atc:'L04AB02', cat:'imm.biologic', form:'injection',
  doses:['100 mg vial', '120 mg subcutaneous pen'], brand:['Remicade', 'Remsima', 'Inflectra'],
  tags:['immunosuppressant'],
  notes:{en:'An infusion every eight weeks after the loading doses. Tuberculosis and hepatitis B are checked first; infusion reactions are watched for. No live vaccines.',
         ar:'تسريب كل ثمانية أسابيع بعد جرعات التحميل. يُفحص السل والتهاب الكبد B أولاً؛ وتُراقب تفاعلات التسريب. لا لقاحات حية.'},
  ci:['seriousInfection', 'hfDecomp'],
  ask:['tb', 'hepatitis', 'infection'] },

{ sci:'Golimumab', ar:'غوليموماب', atc:'L04AB06', cat:'imm.biologic', form:'injection',
  doses:['50 mg', '100 mg pen'], brand:['Simponi'],
  tags:['immunosuppressant'],
  notes:{en:'A monthly injection, kept in the fridge. Tuberculosis is checked first; report fever or persistent cough.',
         ar:'حقنة شهرية، تُحفظ في الثلاجة. يُفحص السل أولاً؛ أبلغ عن الحرارة أو السعال المستمر.'},
  ci:['seriousInfection', 'hfDecomp'],
  ask:['tb', 'infection', 'cold'] },

{ sci:'Certolizumab pegol', ar:'سيرتوليزوماب بيغول', atc:'L04AB05', cat:'imm.biologic', form:'injection',
  doses:['200 mg syringe'], brand:['Cimzia'],
  tags:['immunosuppressant'],
  notes:{en:'Injections every two or four weeks; tuberculosis is checked first. It crosses the placenta very little, so it is often chosen around pregnancy.',
         ar:'حقن كل أسبوعين أو أربعة؛ يُفحص السل أولاً. يعبر المشيمة قليلاً جداً، لذا يُختار كثيراً حول الحمل.'},
  ci:['seriousInfection', 'hfDecomp'],
  ask:['tb', 'infection', 'preg'] },

{ sci:'Tocilizumab', ar:'توسيليزوماب', atc:'L04AC07', cat:'imm.biologic', form:'injection',
  doses:['80 mg', '200 mg', '400 mg vial', '162 mg syringe'], brand:['Actemra', 'RoActemra'],
  tags:['immunosuppressant'],
  notes:{en:'Infusions monthly or weekly injections. Lipids and liver tests are checked. It can hide signs of infection (it suppresses fever) — report feeling unwell, and tummy pain.',
         ar:'تسريب شهري أو حقن أسبوعية. تُفحص الدهون ووظائف الكبد. قد يُخفي علامات العدوى (يكبت الحرارة) — أبلغ عن الشعور بالتوعّك وعن ألم البطن.'},
  ci:['seriousInfection'],
  ask:['tb', 'infection', 'liver'] },

{ sci:'Ustekinumab', ar:'أوستيكينوماب', atc:'L04AC05', cat:'imm.biologic', form:'injection',
  doses:['45 mg', '90 mg syringe', '130 mg vial'], brand:['Stelara'],
  tags:['immunosuppressant'],
  notes:{en:'For psoriasis and Crohn’s disease: an injection every 8–12 weeks after loading. Tuberculosis is checked first.',
         ar:'للصدفية وداء كرون: حقنة كل 8–12 أسبوعاً بعد التحميل. يُفحص السل أولاً.'},
  ci:['seriousInfection'],
  ask:['tb', 'infection', 'vaccine'] },

{ sci:'Secukinumab', ar:'سيكوكينوماب', atc:'L04AC10', cat:'imm.biologic', form:'injection',
  doses:['150 mg', '300 mg pen'], brand:['Cosentyx'],
  tags:['immunosuppressant'],
  notes:{en:'Weekly loading, then monthly injections for psoriasis and related arthritis. Thrush and colds are more common; it can worsen Crohn’s or colitis.',
         ar:'تحميل أسبوعي ثم حقن شهرية للصدفية والتهاب المفاصل المرتبط بها. القلاع ونزلات البرد أكثر شيوعاً؛ وقد يفاقم داء كرون أو التهاب القولون.'},
  ci:['seriousInfection'],
  ask:['tb', 'bowelDisease', 'infection'] },

{ sci:'Ixekizumab', ar:'إيكسيكيزوماب', atc:'L04AC13', cat:'imm.biologic', form:'injection',
  doses:['80 mg pen'], brand:['Taltz'],
  tags:['immunosuppressant'],
  notes:{en:'Injections every two to four weeks for psoriasis. Injection-site reactions are common; it can worsen inflammatory bowel disease.',
         ar:'حقن كل أسبوعين إلى أربعة للصدفية. تفاعلات موضع الحقن شائعة؛ وقد يفاقم داء الأمعاء الالتهابي.'},
  ci:['seriousInfection'],
  ask:['tb', 'bowelDisease', 'infection'] },

{ sci:'Dupilumab', ar:'دوبيلوماب', atc:'D11AH05', cat:'imm.biologic', form:'injection',
  doses:['200 mg', '300 mg pen'], brand:['Dupixent'],
  notes:{en:'An injection every two weeks for eczema, asthma or nasal polyps, kept in the fridge. Red, sore eyes are common — report them.',
         ar:'حقنة كل أسبوعين للإكزيما أو الربو أو السلائل الأنفية، تُحفظ في الثلاجة. احمرار العينين وألمهما شائعان — أبلغ عنهما.'},
  ix:[
    ['#liveVaccine', S, 'Live vaccines are avoided during treatment.', 'تُتجنّب اللقاحات الحية أثناء العلاج.']
  ],
  ask:['injectTech', 'cold', 'eyeRedFlags'] },

{ sci:'Vedolizumab', ar:'فيدوليزوماب', atc:'L04AG05', cat:'imm.biologic', form:'injection',
  doses:['300 mg vial', '108 mg pen'], brand:['Entyvio'],
  tags:['immunosuppressant'],
  notes:{en:'For ulcerative colitis and Crohn’s disease: infusions every eight weeks or injections every two. It acts mainly in the gut.',
         ar:'لالتهاب القولون التقرّحي وداء كرون: تسريب كل ثمانية أسابيع أو حقن كل أسبوعين. يعمل في الأمعاء أساساً.'},
  ci:['seriousInfection'],
  ask:['infection', 'tb'] },

{ sci:'Abatacept', ar:'أباتاسيبت', atc:'L04AA24', cat:'imm.biologic', form:'injection',
  doses:['250 mg vial', '125 mg syringe'], brand:['Orencia'],
  tags:['immunosuppressant'],
  notes:{en:'Monthly infusions or weekly injections for rheumatoid arthritis; tuberculosis is checked first.',
         ar:'تسريب شهري أو حقن أسبوعية لالتهاب المفاصل الروماتويدي؛ يُفحص السل أولاً.'},
  ci:['seriousInfection'],
  ask:['tb', 'infection', 'asthma'] }

];
