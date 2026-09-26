/* ==========================================================================
   THE DRUG REFERENCE — one list, two builds.

   This file is the source of truth. `npm run drugs` embeds it into both
   single-file builds, between the DRUGS:BEGIN / DRUGS:END markers, so the
   pharmacist's reference in the app and the operator's module in the CRM can
   never quietly disagree about what a drug is.

   WHAT IS REAL AND WHAT IS NOT.
   The molecule-level content is real formulary reference: scientific name,
   ATC code, dosage form, the strengths actually marketed, the interactions
   that change what a pharmacist does, and the contraindications that stop a
   sale. The BRAND names in the CRM are fixtures — who registers what in Iraq
   changes and cannot be verified from here, so those stay invented and the
   CRM says so on screen.

   IT IS A REFERENCE, NOT A PRESCRIBER. Interactions are the ones worth
   stopping for, not the complete list; a drug with none listed is not a drug
   with none. Every screen that shows this says so, because a reference that
   looks exhaustive and is not is worse than no reference.

   SHAPE. Each entry:
     sci    scientific name — the identifier, and unique
     ar     Arabic name as dispensed in Iraq
     atc    WHO ATC code
     form   the MAIN presentation, one of FORM_KEYS below. A molecule sold in
            several forms carries the one most dispensed here and the rest
            among its strengths — diclofenac is a tablet that also comes as a
            1% gel, so the gel is a strength rather than a second row. Both
            builds label the field "main form" for that reason.
     doses  the strengths marketed, strongest last
     notes  the counselling line — what you say handing it over
     interactions [{ with, severity: warning|serious|critical, note }]
     contraindications [{ ar, en }]
     take   optional — WHEN and HOW to take it, as keys of TAKE below: before or
            after food, in the morning, once a week. What the till prints under
            a medicine by default (v0.0012.1). Only where the timing changes
            something; a drug with none prints no default line at all, because
            "swallow with water" tells a patient nothing. Never a dose — the
            dose is typed by the dispensing pharmacist, every time. Placeholder
            content until the clinical curator (W19) reviews it.
   ========================================================================== */

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

/* ---------- Analgesics, antipyretics and NSAIDs ---------- */

{ sci:'Paracetamol', ar:'باراسيتامول', atc:'N02BE01', form:'tablet',
  doses:['120 mg/5 mL','250 mg/5 mL','500 mg','1 g'],
  notes:{ar:'الحد الأقصى 4 غم يومياً للبالغين. تحقّق من أدوية الزكام المركّبة — أكثرها يحتوي باراسيتامول أصلاً.',
         en:'Maximum 4 g daily in adults. Check combination cold remedies — most already contain paracetamol.'},
  interactions:[
    { with:'Warfarin', severity:'warning', note:{ar:'الاستخدام المنتظم بجرعة عالية قد يرفع INR.', en:'Regular high-dose use may raise INR.'} },
    { with:'Carbamazepine', severity:'warning', note:{ar:'تحريض الإنزيمات يزيد المستقلب السام للكبد.', en:'Enzyme induction increases the hepatotoxic metabolite.'} }
  ],
  contraindications:[{ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}] },

{ sci:'Ibuprofen', ar:'إيبوبروفين', atc:'M01AE01', form:'tablet', take:['afterFood'],
  doses:['100 mg/5 mL','200 mg','400 mg','600 mg'],
  notes:{ar:'يؤخذ مع الطعام ولأقصر مدة ممكنة. يُتجنّب في الثلث الأخير من الحمل.',
         en:'With food, for the shortest course that works. Avoid in the third trimester.'},
  interactions:[
    { with:'Aspirin', severity:'serious', note:{ar:'يمنع التأثير المضاد للصفيحات إذا أُخذ قبل الأسبرين — باعد بينهما.', en:'Blocks aspirin’s antiplatelet effect if taken first — separate the doses.'} },
    { with:'Warfarin', severity:'serious', note:{ar:'خطر نزف هضمي مضاعف.', en:'Compounded GI bleeding risk.'} },
    { with:'Lisinopril', severity:'serious', note:{ar:'مع مدرّ بول: ثلاثي يؤذي الكلية حاداً.', en:'With a diuretic, the "triple whammy" — acute kidney injury.'} },
    { with:'Methotrexate', severity:'serious', note:{ar:'يقلّل طرح الميثوتريكسيت.', en:'Reduces methotrexate clearance.'} }
  ],
  contraindications:[
    {ar:'قرحة هضمية فعّالة', en:'Active peptic ulcer'},
    {ar:'الثلث الأخير من الحمل', en:'Third trimester of pregnancy'},
    {ar:'قصور قلب شديد', en:'Severe heart failure'},
    {ar:'قصور كلوي (eGFR < 30)', en:'Renal impairment (eGFR < 30)'}
  ] },

{ sci:'Diclofenac', ar:'ديكلوفيناك', atc:'M01AB05', form:'tablet', take:['afterFood'],
  doses:['1% gel','25 mg','50 mg','75 mg/3 mL','100 mg SR'],
  notes:{ar:'أعلى خطر قلبي وعائي بين مضادات الالتهاب الشائعة — يُتجنّب في مرض القلب الإقفاري. الهلام الموضعي بديل أأمن للألم الموضعي.',
         en:'The highest cardiovascular risk of the common NSAIDs — avoid in ischaemic heart disease. The topical gel is the safer option for local pain.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'خطر نزف هضمي مضاعف.', en:'Compounded GI bleeding risk.'} },
    { with:'Methotrexate', severity:'serious', note:{ar:'يقلّل طرح الميثوتريكسيت.', en:'Reduces methotrexate clearance.'} },
    { with:'Aspirin', severity:'warning', note:{ar:'يضاعف خطر النزف دون فائدة إضافية.', en:'Doubles bleeding risk with no added benefit.'} }
  ],
  contraindications:[
    {ar:'مرض قلبي إقفاري أو سكتة أو داء شرايين محيطية', en:'Ischaemic heart disease, stroke or peripheral arterial disease'},
    {ar:'قرحة هضمية فعّالة', en:'Active peptic ulcer'},
    {ar:'الثلث الأخير من الحمل', en:'Third trimester of pregnancy'}
  ] },

{ sci:'Naproxen', ar:'نابروكسين', atc:'M01AE02', form:'tablet', take:['afterFood'],
  doses:['250 mg','500 mg'],
  notes:{ar:'أطول مفعولاً من الإيبوبروفين وأقلّها خطراً على القلب — الخيار المفضّل إذا كان مضاد الالتهاب لا مفرّ منه.',
         en:'Longer acting than ibuprofen and the lowest cardiovascular risk of the group — the one to choose if an NSAID is unavoidable.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'خطر نزف هضمي مضاعف.', en:'Compounded GI bleeding risk.'} },
    { with:'Lithium', severity:'serious', note:{ar:'يرفع مستوى الليثيوم إلى حدّ السميّة.', en:'Raises lithium to toxic levels.'} },
    { with:'Methotrexate', severity:'serious', note:{ar:'يقلّل طرح الميثوتريكسيت.', en:'Reduces methotrexate clearance.'} }
  ],
  contraindications:[
    {ar:'قرحة هضمية فعّالة', en:'Active peptic ulcer'},
    {ar:'الثلث الأخير من الحمل', en:'Third trimester of pregnancy'},
    {ar:'قصور كلوي شديد', en:'Severe renal impairment'}
  ] },

{ sci:'Aspirin', ar:'أسبرين', atc:'B01AC06', form:'tablet', take:['afterFood'],
  doses:['75 mg','81 mg','100 mg','300 mg'],
  notes:{ar:'جرعة 75–100 ملغ مضادة للصفيحات لا مسكّنة. لا يُعطى لمن دون 16 سنة مع حمّى — متلازمة راي.',
         en:'75–100 mg is antiplatelet, not analgesic. Never under 16 with a fever — Reye’s syndrome.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'خطر نزف كبير — يُجمع بينهما بقرار اختصاصي فقط.', en:'Major bleeding risk — combined only on a specialist’s decision.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'يلغي التأثير المضاد للصفيحات — باعد بين الجرعتين.', en:'Cancels the antiplatelet effect — separate the doses.'} },
    { with:'Methotrexate', severity:'serious', note:{ar:'يقلّل طرح الميثوتريكسيت.', en:'Reduces methotrexate clearance.'} }
  ],
  contraindications:[
    {ar:'العمر دون 16 سنة', en:'Under 16 years of age'},
    {ar:'قرحة هضمية فعّالة', en:'Active peptic ulcer'},
    {ar:'ربو محرّض بالأسبرين', en:'Aspirin-induced asthma'},
    {ar:'اضطرابات النزف', en:'Bleeding disorders'}
  ] },

{ sci:'Mefenamic acid', ar:'حمض الميفيناميك', atc:'M01AG01', form:'capsule', take:['afterFood'],
  doses:['250 mg','500 mg'],
  notes:{ar:'خيار شائع لعسر الطمث — يبدأ مع أول إحساس بالألم ويؤخذ مع الطعام.',
         en:'A common first choice for period pain — start at the first twinge, take with food.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'خطر نزف هضمي مضاعف.', en:'Compounded GI bleeding risk.'} }
  ],
  contraindications:[
    {ar:'قرحة هضمية فعّالة', en:'Active peptic ulcer'},
    {ar:'داء الأمعاء الالتهابي', en:'Inflammatory bowel disease'},
    {ar:'قصور كلوي شديد', en:'Severe renal impairment'}
  ] },

{ sci:'Celecoxib', ar:'سيليكوكسيب', atc:'M01AH01', form:'capsule',
  doses:['100 mg','200 mg'],
  notes:{ar:'ألطف على المعدة من بقية مضادات الالتهاب، لكن الخطر القلبي ليس أقل.',
         en:'Gentler on the stomach than the other NSAIDs; the cardiovascular risk is not lower.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'يرفع INR — راقب التخثر.', en:'Raises INR — monitor coagulation.'} },
    { with:'Fluconazole', severity:'warning', note:{ar:'يضاعف مستوى السيليكوكسيب — تُنصّف الجرعة.', en:'Doubles celecoxib levels — halve the dose.'} }
  ],
  contraindications:[
    {ar:'فرط الحساسية للسلفوناميدات', en:'Sulfonamide hypersensitivity'},
    {ar:'مرض قلبي إقفاري', en:'Ischaemic heart disease'},
    {ar:'الثلث الأخير من الحمل', en:'Third trimester of pregnancy'}
  ] },

{ sci:'Meloxicam', ar:'ميلوكسيكام', atc:'M01AC06', form:'tablet', take:['afterFood'],
  doses:['7.5 mg','15 mg'],
  notes:{ar:'مرة واحدة يومياً مع الطعام.', en:'Once daily, with food.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'خطر نزف هضمي مضاعف.', en:'Compounded GI bleeding risk.'} },
    { with:'Lisinopril', severity:'serious', note:{ar:'مع مدرّ بول: خطر أذية كلوية حادة.', en:'With a diuretic, a risk of acute kidney injury.'} }
  ],
  contraindications:[
    {ar:'قرحة هضمية فعّالة', en:'Active peptic ulcer'},
    {ar:'قصور قلب شديد', en:'Severe heart failure'},
    {ar:'الثلث الأخير من الحمل', en:'Third trimester of pregnancy'}
  ] },

{ sci:'Tramadol', ar:'ترامادول', atc:'N02AX02', form:'capsule',
  doses:['50 mg','100 mg/2 mL','100 mg SR'],
  notes:{ar:'مادة خاضعة للرقابة. يخفض عتبة الاختلاج وينبّه للنعاس — لا قيادة حتى يُعرف أثره.',
         en:'A controlled substance. Lowers the seizure threshold and causes drowsiness — no driving until they know how it affects them.'},
  interactions:[
    { with:'Sertraline', severity:'serious', note:{ar:'متلازمة السيروتونين — الجمع مع مثبطات استرداد السيروتونين.', en:'Serotonin syndrome when combined with an SSRI.'} },
    { with:'Fluoxetine', severity:'serious', note:{ar:'متلازمة السيروتونين، ويقلّل فعالية الترامادول.', en:'Serotonin syndrome, and reduces tramadol’s effect.'} },
    { with:'Carbamazepine', severity:'warning', note:{ar:'يقلّل فعالية الترامادول بتحريض الإنزيمات.', en:'Reduces tramadol’s effect through enzyme induction.'} }
  ],
  contraindications:[
    {ar:'صرع غير مضبوط', en:'Uncontrolled epilepsy'},
    {ar:'تناول مثبطات MAO خلال 14 يوماً', en:'MAO inhibitor within 14 days'},
    {ar:'تثبيط تنفسي شديد', en:'Severe respiratory depression'}
  ] },

/* ---------- Antibacterials ---------- */

{ sci:'Amoxicillin', ar:'أموكسيسيلين', atc:'J01CA04', form:'capsule',
  doses:['125 mg/5 mL','250 mg/5 mL','250 mg','500 mg','1 g'],
  notes:{ar:'يُفضّل مع الطعام لتقليل الاضطراب المعوي. يُكمل الكورس كاملاً.',
         en:'With food to reduce GI upset. Finish the course.'},
  interactions:[
    { with:'Methotrexate', severity:'serious', note:{ar:'يقلّل طرح الميثوتريكسيت ويزيد سميّته.', en:'Reduces methotrexate clearance, raising toxicity.'} },
    { with:'Warfarin', severity:'warning', note:{ar:'قد يرفع INR — راقب التخثر.', en:'May raise INR — monitor coagulation.'} }
  ],
  contraindications:[
    {ar:'فرط الحساسية للبنسلينات', en:'Penicillin hypersensitivity'},
    {ar:'كثرة الوحيدات العدائية', en:'Infectious mononucleosis'}
  ] },

{ sci:'Amoxicillin/Clavulanic acid', ar:'أموكسيسيلين/حمض الكلافولانيك', atc:'J01CR02', form:'tablet', take:['withFood'],
  doses:['228 mg/5 mL','457 mg/5 mL','625 mg','1 g'],
  notes:{ar:'يؤخذ في بداية الوجبة — الكلافولانيك هو سبب الإسهال، والطعام يخفّفه.',
         en:'Take at the start of a meal — the clavulanate is what causes the diarrhoea, and food blunts it.'},
  interactions:[
    { with:'Methotrexate', severity:'serious', note:{ar:'يقلّل طرح الميثوتريكسيت.', en:'Reduces methotrexate clearance.'} },
    { with:'Warfarin', severity:'warning', note:{ar:'قد يرفع INR.', en:'May raise INR.'} },
    { with:'Allopurinol', severity:'warning', note:{ar:'يزيد احتمال الطفح الجلدي.', en:'Raises the chance of a rash.'} }
  ],
  contraindications:[
    {ar:'فرط الحساسية للبنسلينات', en:'Penicillin hypersensitivity'},
    {ar:'يرقان أو خلل كبدي سابق مع هذا الدواء', en:'Previous jaundice or hepatic dysfunction with this drug'}
  ] },

{ sci:'Azithromycin', ar:'أزيثرومايسين', atc:'J01FA10', form:'tablet',
  doses:['200 mg/5 mL','250 mg','500 mg'],
  notes:{ar:'كورس ثلاثة أيام عادة، مرة واحدة يومياً. الأثر يستمر بعد انتهاء الأقراص.',
         en:'Usually a three-day course, once daily. It keeps working after the tablets run out.'},
  interactions:[
    { with:'Amiodarone', severity:'critical', note:{ar:'إطالة QT — يُتجنّب الجمع.', en:'QT prolongation — avoid the combination.'} },
    { with:'Domperidone', severity:'serious', note:{ar:'إطالة QT مضاعفة.', en:'Additive QT prolongation.'} },
    { with:'Warfarin', severity:'warning', note:{ar:'قد يرفع INR.', en:'May raise INR.'} }
  ],
  contraindications:[
    {ar:'يرقان ركودي سابق مع الماكروليدات', en:'Previous cholestatic jaundice with a macrolide'},
    {ar:'إطالة QT معروفة', en:'Known QT prolongation'}
  ] },

{ sci:'Clarithromycin', ar:'كلاريثرومايسين', atc:'J01FA09', form:'tablet',
  doses:['125 mg/5 mL','250 mg','500 mg'],
  notes:{ar:'مثبّط قوي لـ CYP3A4 — راجع قائمة أدوية المريض كاملة قبل الصرف، لا هذا الدواء وحده.',
         en:'A strong CYP3A4 inhibitor — read the patient’s whole list before dispensing, not just this one.'},
  interactions:[
    { with:'Simvastatin', severity:'critical', note:{ar:'انحلال ربيدات — يُوقف الستاتين طوال الكورس.', en:'Rhabdomyolysis — stop the statin for the course.'} },
    { with:'Amiodarone', severity:'critical', note:{ar:'إطالة QT — يُتجنّب الجمع.', en:'QT prolongation — avoid the combination.'} },
    { with:'Atorvastatin', severity:'serious', note:{ar:'يرفع مستوى الستاتين — تُخفّض الجرعة أو يُوقف.', en:'Raises statin levels — reduce or hold.'} },
    { with:'Warfarin', severity:'serious', note:{ar:'يرفع INR بوضوح.', en:'Markedly raises INR.'} }
  ],
  contraindications:[
    {ar:'إطالة QT معروفة', en:'Known QT prolongation'},
    {ar:'الاستعمال المتزامن مع سيمفاستاتين', en:'Concurrent simvastatin'},
    {ar:'قصور كبدي مع قصور كلوي', en:'Hepatic impairment with renal impairment'}
  ] },

{ sci:'Ciprofloxacin', ar:'سيبروفلوكساسين', atc:'J01MA02', form:'tablet', take:['noMilk'],
  doses:['250 mg','500 mg','750 mg','0.3% drops'],
  notes:{ar:'يُباعد ساعتين قبل أو ست ساعات بعد الحليب ومضادات الحموضة والحديد والزنك — وإلا لن يُمتص.',
         en:'Two hours before or six after milk, antacids, iron or zinc — otherwise it simply will not absorb.'},
  interactions:[
    { with:'Tizanidine', severity:'critical', note:{ar:'هبوط ضغط شديد ونعاس — ممنوع الجمع.', en:'Severe hypotension and sedation — the combination is contraindicated.'} },
    { with:'Calcium carbonate', severity:'serious', note:{ar:'يرتبط بالكالسيوم ويفقد الامتصاص.', en:'Chelates with calcium and loses absorption.'} },
    { with:'Theophylline', severity:'serious', note:{ar:'يرفع الثيوفيلين إلى حدّ السميّة.', en:'Raises theophylline to toxic levels.'} },
    { with:'Warfarin', severity:'serious', note:{ar:'يرفع INR.', en:'Raises INR.'} }
  ],
  contraindications:[
    {ar:'اعتلال وتر سابق مع الكينولونات', en:'Previous tendon disorder with a quinolone'},
    {ar:'الوهن العضلي الوبيل', en:'Myasthenia gravis'},
    {ar:'الحمل والإرضاع', en:'Pregnancy and breastfeeding'}
  ] },

{ sci:'Levofloxacin', ar:'ليفوفلوكساسين', atc:'J01MA12', form:'tablet', take:['noMilk'],
  doses:['250 mg','500 mg','750 mg'],
  notes:{ar:'مرة واحدة يومياً. نفس قاعدة المباعدة عن الكالسيوم والحديد ومضادات الحموضة.',
         en:'Once daily. Same spacing rule as ciprofloxacin for calcium, iron and antacids.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'يرفع INR.', en:'Raises INR.'} },
    { with:'Calcium carbonate', severity:'serious', note:{ar:'يرتبط بالكالسيوم ويفقد الامتصاص.', en:'Chelates with calcium and loses absorption.'} },
    { with:'Amiodarone', severity:'serious', note:{ar:'إطالة QT مضاعفة.', en:'Additive QT prolongation.'} }
  ],
  contraindications:[
    {ar:'اعتلال وتر سابق مع الكينولونات', en:'Previous tendon disorder with a quinolone'},
    {ar:'الوهن العضلي الوبيل', en:'Myasthenia gravis'},
    {ar:'الصرع', en:'Epilepsy'}
  ] },

{ sci:'Cefixime', ar:'سيفيكسيم', atc:'J01DD08', form:'capsule',
  doses:['100 mg/5 mL','200 mg','400 mg'],
  notes:{ar:'مرة أو مرتين يومياً بغض النظر عن الطعام.', en:'Once or twice daily, with or without food.'},
  interactions:[
    { with:'Warfarin', severity:'warning', note:{ar:'قد يرفع INR.', en:'May raise INR.'} }
  ],
  contraindications:[{ar:'فرط الحساسية للسيفالوسبورينات', en:'Cephalosporin hypersensitivity'}] },

{ sci:'Cephalexin', ar:'سيفالكسين', atc:'J01DB01', form:'capsule',
  doses:['125 mg/5 mL','250 mg/5 mL','250 mg','500 mg'],
  notes:{ar:'أربع مرات يومياً عادة — الالتزام هو المشكلة الشائعة، فاذكر التوقيت.',
         en:'Usually four times a day — adherence is the usual failure, so say the times out loud.'},
  interactions:[
    { with:'Metformin', severity:'warning', note:{ar:'يرفع مستوى الميتفورمين قليلاً.', en:'Modestly raises metformin levels.'} }
  ],
  contraindications:[{ar:'فرط الحساسية للسيفالوسبورينات', en:'Cephalosporin hypersensitivity'}] },

{ sci:'Ceftriaxone', ar:'سيفترياكسون', atc:'J01DD04', form:'injection',
  doses:['250 mg','500 mg','1 g','2 g'],
  notes:{ar:'لا يُمزج ولا يُعطى بالتوازي مع محاليل تحتوي كالسيوم — ترسّب قاتل عند الولدان.',
         en:'Never mix or co-infuse with a calcium-containing fluid — the precipitate is fatal in neonates.'},
  interactions:[
    { with:'Calcium gluconate', severity:'critical', note:{ar:'ترسّب في الرئة والكلية — ممنوع الجمع وريدياً.', en:'Precipitates in lung and kidney — the IV combination is contraindicated.'} },
    { with:'Warfarin', severity:'warning', note:{ar:'قد يرفع INR.', en:'May raise INR.'} }
  ],
  contraindications:[
    {ar:'فرط الحساسية للسيفالوسبورينات', en:'Cephalosporin hypersensitivity'},
    {ar:'الولدان مع فرط بيليروبين الدم', en:'Neonates with hyperbilirubinaemia'}
  ] },

{ sci:'Doxycycline', ar:'دوكسيسيكلين', atc:'J01AA02', form:'capsule',
  doses:['50 mg','100 mg'],
  notes:{ar:'مع كوب ماء كامل وبقاء منتصباً نصف ساعة — يسبّب تقرّح المريء عند الاستلقاء. واقٍ شمسي: يسبّب حساسية ضوئية.',
         en:'A full glass of water and stay upright for thirty minutes — it ulcerates the oesophagus lying down. Warn about sun: it causes photosensitivity.'},
  interactions:[
    { with:'Ferrous sulfate', severity:'serious', note:{ar:'يرتبط بالحديد ويفقد الامتصاص — باعد ساعتين.', en:'Chelates with iron and loses absorption — space by two hours.'} },
    { with:'Calcium carbonate', severity:'serious', note:{ar:'يرتبط بالكالسيوم ويفقد الامتصاص.', en:'Chelates with calcium and loses absorption.'} },
    { with:'Isotretinoin', severity:'serious', note:{ar:'ارتفاع ضغط داخل القحف.', en:'Raised intracranial pressure.'} },
    { with:'Warfarin', severity:'warning', note:{ar:'قد يرفع INR.', en:'May raise INR.'} }
  ],
  contraindications:[
    {ar:'الحمل', en:'Pregnancy'},
    {ar:'الأطفال دون 12 سنة', en:'Children under 12'}
  ] },

{ sci:'Metronidazole', ar:'ميترونيدازول', atc:'J01XD01', form:'tablet', take:['afterFood', 'noAlcohol'],
  doses:['200 mg/5 mL','250 mg','500 mg'],
  notes:{ar:'ممنوع الكحول أثناء الكورس ولمدة 48 ساعة بعده — تفاعل شبيه بالديسلفيرام. طعم معدني شائع وغير مقلق.',
         en:'No alcohol during the course or for 48 hours after — a disulfiram-like reaction. A metallic taste is common and harmless.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'يرفع INR بوضوح.', en:'Markedly raises INR.'} },
    { with:'Lithium', severity:'serious', note:{ar:'يرفع الليثيوم إلى حدّ السميّة.', en:'Raises lithium to toxic levels.'} }
  ],
  contraindications:[
    {ar:'الثلث الأول من الحمل بالجرعات العالية', en:'High doses in the first trimester'},
    {ar:'تناول الكحول', en:'Alcohol use'}
  ] },

{ sci:'Nitrofurantoin', ar:'نيتروفورانتوين', atc:'J01XE01', form:'capsule', take:['withFood'],
  doses:['50 mg','100 mg'],
  notes:{ar:'مع الطعام. لون البول البنّي طبيعي ولا يستدعي القلق. لا يصلح لالتهاب الكلية — يعمل في المثانة فقط.',
         en:'With food. Brown urine is expected and harmless. No use in kidney infection — it only works in the bladder.'},
  interactions:[
    { with:'Magnesium trisilicate', severity:'warning', note:{ar:'يقلّل الامتصاص — باعد بينهما.', en:'Reduces absorption — space the doses.'} }
  ],
  contraindications:[
    {ar:'قصور كلوي (eGFR < 45)', en:'Renal impairment (eGFR < 45)'},
    {ar:'الحمل من الأسبوع 38 حتى الولادة', en:'Pregnancy from 38 weeks to term'},
    {ar:'عوز G6PD', en:'G6PD deficiency'},
    {ar:'الرضّع دون 3 أشهر', en:'Infants under 3 months'}
  ] },

{ sci:'Trimethoprim/Sulfamethoxazole', ar:'تراي ميثوبريم/سلفاميثوكسازول', atc:'J01EE01', form:'tablet',
  doses:['240 mg/5 mL','480 mg','960 mg'],
  notes:{ar:'مع كمية وفيرة من السوائل. تفاعلاته أخطر مما يوحي به شيوعه — راجع الوارفارين والميثوتريكسيت أولاً.',
         en:'With plenty of fluid. Its interactions are more dangerous than how ordinary it looks — check warfarin and methotrexate first.'},
  interactions:[
    { with:'Warfarin', severity:'critical', note:{ar:'ارتفاع حاد في INR ونزف — يُتجنّب الجمع.', en:'Sharp rise in INR and bleeding — avoid the combination.'} },
    { with:'Methotrexate', severity:'critical', note:{ar:'تثبيط نقي شديد — ممنوع الجمع.', en:'Severe marrow suppression — the combination is contraindicated.'} },
    { with:'Spironolactone', severity:'serious', note:{ar:'فرط بوتاسيوم خطر.', en:'Dangerous hyperkalaemia.'} },
    { with:'Lisinopril', severity:'serious', note:{ar:'فرط بوتاسيوم.', en:'Hyperkalaemia.'} }
  ],
  contraindications:[
    {ar:'فرط الحساسية للسلفوناميدات', en:'Sulfonamide hypersensitivity'},
    {ar:'الحمل والإرضاع', en:'Pregnancy and breastfeeding'},
    {ar:'عوز G6PD', en:'G6PD deficiency'},
    {ar:'قصور كبدي أو كلوي شديد', en:'Severe hepatic or renal impairment'}
  ] },

{ sci:'Clindamycin', ar:'كليندامايسين', atc:'J01FF01', form:'capsule',
  doses:['150 mg','300 mg','1% solution'],
  notes:{ar:'يُوقف ويُراجع فوراً عند حدوث إسهال مائي — خطر التهاب القولون بالمطثية العسيرة هو الأعلى بين الصادات الفموية الشائعة.',
         en:'Stop and seek advice at once with watery diarrhoea — the C. difficile colitis risk is the highest of the common oral antibiotics.'},
  interactions:[
    { with:'Erythromycin', severity:'warning', note:{ar:'تضاد في آلية العمل.', en:'Antagonistic mechanisms.'} }
  ],
  contraindications:[{ar:'التهاب قولون سابق مرتبط بالصادات', en:'Previous antibiotic-associated colitis'}] },

{ sci:'Cefuroxime', ar:'سيفوروكسيم', atc:'J01DC02', form:'tablet', take:['afterFood'],
  doses:['125 mg/5 mL','250 mg','500 mg'],
  notes:{ar:'بعد الطعام مباشرة — الامتصاص يعتمد عليه.', en:'Straight after food — absorption depends on it.'},
  interactions:[
    { with:'Omeprazole', severity:'warning', note:{ar:'رفع حموضة المعدة يقلّل الامتصاص.', en:'Reduced stomach acid cuts absorption.'} }
  ],
  contraindications:[{ar:'فرط الحساسية للسيفالوسبورينات', en:'Cephalosporin hypersensitivity'}] },

/* ---------- Antifungals and antivirals ---------- */

{ sci:'Fluconazole', ar:'فلوكونازول', atc:'J02AC01', form:'capsule',
  doses:['50 mg','150 mg','200 mg'],
  notes:{ar:'جرعة 150 ملغ مفردة للمبيضات المهبلية. الكورسات الطويلة مثبّط إنزيمي معتبر.',
         en:'A single 150 mg dose for vaginal thrush. Longer courses are a serious enzyme inhibitor.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'يرفع INR بوضوح.', en:'Markedly raises INR.'} },
    { with:'Simvastatin', severity:'serious', note:{ar:'خطر اعتلال عضلي — يُوقف الستاتين في الكورسات الطويلة.', en:'Myopathy risk — hold the statin on longer courses.'} },
    { with:'Amiodarone', severity:'serious', note:{ar:'إطالة QT.', en:'QT prolongation.'} }
  ],
  contraindications:[
    {ar:'الحمل بالجرعات المتكررة', en:'Pregnancy, on repeated doses'},
    {ar:'إطالة QT معروفة', en:'Known QT prolongation'}
  ] },

{ sci:'Acyclovir', ar:'أسيكلوفير', atc:'J05AB01', form:'tablet',
  doses:['5% cream','200 mg','400 mg','800 mg'],
  notes:{ar:'يبدأ خلال 72 ساعة من ظهور الطفح وإلا قلّت الفائدة. شرب سوائل وفير مع الجرعات العالية.',
         en:'Start within 72 hours of the rash or the benefit falls away. Plenty of fluid on the higher doses.'},
  interactions:[
    { with:'Ibuprofen', severity:'warning', note:{ar:'خطر كلوي مضاعف مع الجرعات العالية.', en:'Compounded renal risk at high doses.'} }
  ],
  contraindications:[{ar:'قصور كلوي شديد دون تعديل الجرعة', en:'Severe renal impairment without dose adjustment'}] },

{ sci:'Clotrimazole', ar:'كلوتريمازول', atc:'G01AF02', form:'cream',
  doses:['1% cream','100 mg pessary','500 mg pessary'],
  notes:{ar:'يُستمر أسبوعين بعد اختفاء الأعراض وإلا عاد. التحاميل تُضعف الواقي المطاطي.',
         en:'Keep going two weeks after the symptoms clear or it returns. The pessaries weaken latex condoms.'},
  interactions:[],
  contraindications:[{ar:'فرط الحساسية للإيميدازولات', en:'Imidazole hypersensitivity'}] },

{ sci:'Terbinafine', ar:'تيربينافين', atc:'D01BA02', form:'tablet',
  doses:['1% cream','250 mg'],
  notes:{ar:'فطر الأظافر يحتاج 6 أسابيع لليد و12 أسبوعاً للقدم — اذكر المدة من البداية.',
         en:'Nail infection needs six weeks for fingers, twelve for toes — say the length up front.'},
  interactions:[
    { with:'Warfarin', severity:'warning', note:{ar:'قد يغيّر INR في الاتجاهين.', en:'May move INR either way.'} },
    { with:'Amitriptyline', severity:'warning', note:{ar:'يرفع مستوى الأميتريبتيلين.', en:'Raises amitriptyline levels.'} }
  ],
  contraindications:[
    {ar:'مرض كبدي مزمن أو فعّال', en:'Chronic or active liver disease'},
    {ar:'قصور كلوي شديد', en:'Severe renal impairment'}
  ] },

{ sci:'Ketoconazole', ar:'كيتوكونازول', atc:'D01AC08', form:'cream',
  doses:['2% cream','2% shampoo'],
  notes:{ar:'الشامبو يُترك 3–5 دقائق قبل الشطف — الأثر في مدة الملامسة لا في الكمية.',
         en:'Leave the shampoo on for three to five minutes before rinsing — the contact time is what works, not the amount.'},
  interactions:[],
  contraindications:[{ar:'فرط الحساسية للإيميدازولات', en:'Imidazole hypersensitivity'}] },

/* ---------- Cardiovascular ---------- */

{ sci:'Amlodipine', ar:'أملوديبين', atc:'C08CA01', form:'tablet',
  doses:['5 mg','10 mg'],
  notes:{ar:'الوذمة حول الكاحل أشيع أعراضه وليست علامة قصور قلب. أي وقت من اليوم، بثبات.',
         en:'Ankle swelling is its commonest side effect and is not a sign of heart failure. Any time of day, but the same time.'},
  interactions:[
    { with:'Simvastatin', severity:'warning', note:{ar:'يُحدّ سيمفاستاتين بـ 20 ملغ يومياً.', en:'Limit simvastatin to 20 mg daily.'} },
    { with:'Clarithromycin', severity:'serious', note:{ar:'يرفع الأملوديبين ويسبّب هبوط ضغط.', en:'Raises amlodipine and causes hypotension.'} }
  ],
  contraindications:[
    {ar:'صدمة قلبية', en:'Cardiogenic shock'},
    {ar:'تضيّق أبهري شديد', en:'Severe aortic stenosis'}
  ] },

{ sci:'Lisinopril', ar:'ليزينوبريل', atc:'C09AA03', form:'tablet',
  doses:['5 mg','10 mg','20 mg'],
  notes:{ar:'السعال الجاف المستمر سبب شائع للتوقف — يُبدّل إلى سارتان. يُراجع الكرياتينين والبوتاسيوم بعد أسبوعين من أي تعديل.',
         en:'A persistent dry cough is the usual reason people stop — switch to a sartan. Creatinine and potassium two weeks after any change.'},
  interactions:[
    { with:'Spironolactone', severity:'serious', note:{ar:'فرط بوتاسيوم — يُراقب مخبرياً.', en:'Hyperkalaemia — monitor.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'مع مدرّ بول: خطر أذية كلوية حادة.', en:'With a diuretic, a risk of acute kidney injury.'} },
    { with:'Potassium chloride', severity:'serious', note:{ar:'فرط بوتاسيوم.', en:'Hyperkalaemia.'} }
  ],
  contraindications:[
    {ar:'الحمل', en:'Pregnancy'},
    {ar:'وذمة وعائية سابقة مع مثبطات ACE', en:'Previous angio-oedema with an ACE inhibitor'},
    {ar:'تضيّق شريان كلوي ثنائي الجانب', en:'Bilateral renal artery stenosis'}
  ] },

{ sci:'Enalapril', ar:'إينالابريل', atc:'C09AA02', form:'tablet',
  doses:['5 mg','10 mg','20 mg'],
  notes:{ar:'الجرعة الأولى قد تسبّب دواراً — تُؤخذ قبل النوم.', en:'The first dose can cause dizziness — take it at bedtime.'},
  interactions:[
    { with:'Spironolactone', severity:'serious', note:{ar:'فرط بوتاسيوم.', en:'Hyperkalaemia.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'خطر أذية كلوية حادة.', en:'Risk of acute kidney injury.'} }
  ],
  contraindications:[
    {ar:'الحمل', en:'Pregnancy'},
    {ar:'وذمة وعائية سابقة مع مثبطات ACE', en:'Previous angio-oedema with an ACE inhibitor'}
  ] },

{ sci:'Losartan', ar:'لوسارتان', atc:'C09CA01', form:'tablet',
  doses:['25 mg','50 mg','100 mg'],
  notes:{ar:'بديل مثبطات ACE عند السعال. يخفض حمض البول أيضاً — مفيد مع النقرس.',
         en:'The answer to the ACE-inhibitor cough. It also lowers uric acid, which helps if there is gout.'},
  interactions:[
    { with:'Spironolactone', severity:'serious', note:{ar:'فرط بوتاسيوم.', en:'Hyperkalaemia.'} },
    { with:'Lithium', severity:'serious', note:{ar:'يرفع الليثيوم.', en:'Raises lithium.'} }
  ],
  contraindications:[
    {ar:'الحمل', en:'Pregnancy'},
    {ar:'تضيّق شريان كلوي ثنائي الجانب', en:'Bilateral renal artery stenosis'}
  ] },

{ sci:'Valsartan', ar:'فالسارتان', atc:'C09CA03', form:'tablet',
  doses:['40 mg','80 mg','160 mg','320 mg'],
  notes:{ar:'مرة واحدة يومياً بغض النظر عن الطعام.', en:'Once daily, with or without food.'},
  interactions:[
    { with:'Spironolactone', severity:'serious', note:{ar:'فرط بوتاسيوم.', en:'Hyperkalaemia.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'يقلّل الأثر ويزيد الخطر الكلوي.', en:'Blunts the effect and raises renal risk.'} }
  ],
  contraindications:[
    {ar:'الحمل', en:'Pregnancy'},
    {ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}
  ] },

{ sci:'Bisoprolol', ar:'بيسوبرولول', atc:'C07AB07', form:'tablet', take:['morning'],
  doses:['1.25 mg','2.5 mg','5 mg','10 mg'],
  notes:{ar:'لا يُوقف فجأة — الإيقاف المفاجئ يسبّب ذبحة أو احتشاء ارتدادياً. يُخفّض تدريجياً.',
         en:'Never stop abruptly — rebound angina or infarction. Taper it down.'},
  interactions:[
    { with:'Verapamil', severity:'critical', note:{ar:'بطء قلب شديد وحصار — يُتجنّب الجمع.', en:'Severe bradycardia and heart block — avoid the combination.'} },
    { with:'Salbutamol', severity:'warning', note:{ar:'يقلّل أثر موسّع القصبات.', en:'Blunts the bronchodilator.'} }
  ],
  contraindications:[
    {ar:'ربو غير مضبوط', en:'Uncontrolled asthma'},
    {ar:'حصار قلبي من الدرجة الثانية أو الثالثة', en:'Second- or third-degree heart block'},
    {ar:'بطء قلب شديد', en:'Severe bradycardia'}
  ] },

{ sci:'Atenolol', ar:'أتينولول', atc:'C07AB03', form:'tablet',
  doses:['25 mg','50 mg','100 mg'],
  notes:{ar:'يُطرح كلوياً — تُخفّض الجرعة مع قصور الكلية. لا يُوقف فجأة.',
         en:'Renally cleared — reduce the dose in kidney impairment. Do not stop abruptly.'},
  interactions:[
    { with:'Verapamil', severity:'critical', note:{ar:'بطء قلب شديد وحصار.', en:'Severe bradycardia and heart block.'} },
    { with:'Gliclazide', severity:'warning', note:{ar:'يُخفي أعراض نقص السكر.', en:'Masks the warning signs of hypoglycaemia.'} }
  ],
  contraindications:[
    {ar:'ربو غير مضبوط', en:'Uncontrolled asthma'},
    {ar:'حصار قلبي من الدرجة الثانية أو الثالثة', en:'Second- or third-degree heart block'}
  ] },

{ sci:'Metoprolol', ar:'ميتوبرولول', atc:'C07AB02', form:'tablet', take:['withFood'],
  doses:['25 mg','50 mg','100 mg'],
  notes:{ar:'الشكل الممتد مرة واحدة يومياً والعادي مرتين — تأكد أيّهما بيد المريض.',
         en:'The modified-release form is once daily and the plain one twice — check which they are actually holding.'},
  interactions:[
    { with:'Verapamil', severity:'critical', note:{ar:'بطء قلب شديد وحصار.', en:'Severe bradycardia and heart block.'} },
    { with:'Fluoxetine', severity:'serious', note:{ar:'يرفع مستوى الميتوبرولول كثيراً.', en:'Substantially raises metoprolol levels.'} }
  ],
  contraindications:[
    {ar:'ربو غير مضبوط', en:'Uncontrolled asthma'},
    {ar:'قصور قلب غير معاوَض', en:'Decompensated heart failure'}
  ] },

{ sci:'Carvedilol', ar:'كارفيديلول', atc:'C07AG02', form:'tablet', take:['withFood'],
  doses:['3.125 mg','6.25 mg','12.5 mg','25 mg'],
  notes:{ar:'مع الطعام لتقليل هبوط الضغط الانتصابي. يُرفع تدريجياً في قصور القلب.',
         en:'With food to blunt the postural drop. Titrated up slowly in heart failure.'},
  interactions:[
    { with:'Verapamil', severity:'critical', note:{ar:'بطء قلب شديد وحصار.', en:'Severe bradycardia and heart block.'} },
    { with:'Digoxin', severity:'serious', note:{ar:'يرفع الديجوكسين ويبطّئ القلب.', en:'Raises digoxin and slows the heart.'} }
  ],
  contraindications:[
    {ar:'ربو غير مضبوط', en:'Uncontrolled asthma'},
    {ar:'قصور قلب غير معاوَض', en:'Decompensated heart failure'},
    {ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}
  ] },

{ sci:'Hydrochlorothiazide', ar:'هيدروكلوروثيازيد', atc:'C03AA03', form:'tablet', take:['morning'],
  doses:['12.5 mg','25 mg','50 mg'],
  notes:{ar:'صباحاً لا مساءً. يرفع حمض البول وسكر الدم ويخفض البوتاسيوم والصوديوم.',
         en:'Morning, not evening. It raises uric acid and glucose and lowers potassium and sodium.'},
  interactions:[
    { with:'Lithium', severity:'serious', note:{ar:'يرفع الليثيوم إلى حدّ السميّة.', en:'Raises lithium to toxic levels.'} },
    { with:'Digoxin', severity:'serious', note:{ar:'نقص البوتاسيوم يزيد سميّة الديجوكسين.', en:'The potassium loss makes digoxin toxic.'} }
  ],
  contraindications:[
    {ar:'انقطاع بول', en:'Anuria'},
    {ar:'نقص صوديوم أو بوتاسيوم شديد', en:'Severe hyponatraemia or hypokalaemia'},
    {ar:'فرط الحساسية للسلفوناميدات', en:'Sulfonamide hypersensitivity'}
  ] },

{ sci:'Furosemide', ar:'فوروسيميد', atc:'C03CA01', form:'tablet', take:['morning'],
  doses:['20 mg','40 mg','20 mg/2 mL'],
  notes:{ar:'صباحاً، والجرعة الثانية قبل الرابعة عصراً — وإلا لن ينام المريض. يُراقب البوتاسيوم.',
         en:'Morning, and a second dose before four in the afternoon — otherwise nobody sleeps. Watch potassium.'},
  interactions:[
    { with:'Digoxin', severity:'serious', note:{ar:'نقص البوتاسيوم يزيد سميّة الديجوكسين.', en:'The potassium loss makes digoxin toxic.'} },
    { with:'Lithium', severity:'serious', note:{ar:'يرفع الليثيوم.', en:'Raises lithium.'} },
    { with:'Gentamicin', severity:'serious', note:{ar:'سميّة أذنية وكلوية مضاعفة.', en:'Compounded ear and kidney toxicity.'} }
  ],
  contraindications:[
    {ar:'انقطاع بول', en:'Anuria'},
    {ar:'نقص حجم شديد أو تجفاف', en:'Severe hypovolaemia or dehydration'}
  ] },

{ sci:'Spironolactone', ar:'سبيرونولاكتون', atc:'C03DA01', form:'tablet', take:['morning'],
  doses:['25 mg','50 mg','100 mg'],
  notes:{ar:'مدرّ حافظ للبوتاسيوم — لا بدائل ملح ولا مكمّلات بوتاسيوم. التثدّي عند الرجال شائع.',
         en:'Potassium-sparing — no salt substitutes and no potassium supplements. Gynaecomastia in men is common.'},
  interactions:[
    { with:'Lisinopril', severity:'serious', note:{ar:'فرط بوتاسيوم — يُراقب مخبرياً.', en:'Hyperkalaemia — monitor.'} },
    { with:'Trimethoprim/Sulfamethoxazole', severity:'serious', note:{ar:'فرط بوتاسيوم خطر.', en:'Dangerous hyperkalaemia.'} },
    { with:'Potassium chloride', severity:'critical', note:{ar:'فرط بوتاسيوم مهدّد للحياة.', en:'Life-threatening hyperkalaemia.'} }
  ],
  contraindications:[
    {ar:'فرط بوتاسيوم الدم', en:'Hyperkalaemia'},
    {ar:'داء أديسون', en:'Addison’s disease'},
    {ar:'قصور كلوي شديد', en:'Severe renal impairment'}
  ] },

{ sci:'Atorvastatin', ar:'أتورفاستاتين', atc:'C10AA05', form:'tablet',
  doses:['10 mg','20 mg','40 mg','80 mg'],
  notes:{ar:'أي وقت من اليوم. ألم عضلي غير مفسّر يستوجب المراجعة لا الاستمرار.',
         en:'Any time of day. Unexplained muscle pain means get it checked, not push through.'},
  interactions:[
    { with:'Clarithromycin', severity:'serious', note:{ar:'يرفع الستاتين — يُوقف طوال الكورس.', en:'Raises the statin — hold it for the course.'} },
    { with:'Warfarin', severity:'warning', note:{ar:'قد يرفع INR.', en:'May raise INR.'} },
    { with:'Colchicine', severity:'serious', note:{ar:'خطر اعتلال عضلي مضاعف.', en:'Compounded myopathy risk.'} }
  ],
  contraindications:[
    {ar:'مرض كبدي فعّال', en:'Active liver disease'},
    {ar:'الحمل والإرضاع', en:'Pregnancy and breastfeeding'}
  ] },

{ sci:'Rosuvastatin', ar:'روزوفاستاتين', atc:'C10AA07', form:'tablet',
  doses:['5 mg','10 mg','20 mg','40 mg'],
  notes:{ar:'أقوى الستاتينات لكل ملغ، وتفاعلاته الإنزيمية أقل من الأتورفاستاتين.',
         en:'The most potent statin per milligram, and less entangled in enzyme interactions than atorvastatin.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'يرفع INR — يُعاد الفحص بعد أسبوع.', en:'Raises INR — recheck within a week.'} },
    { with:'Clopidogrel', severity:'warning', note:{ar:'يرفع مستوى الروزوفاستاتين.', en:'Raises rosuvastatin levels.'} }
  ],
  contraindications:[
    {ar:'مرض كبدي فعّال', en:'Active liver disease'},
    {ar:'الحمل والإرضاع', en:'Pregnancy and breastfeeding'},
    {ar:'اعتلال عضلي', en:'Myopathy'}
  ] },

{ sci:'Simvastatin', ar:'سيمفاستاتين', atc:'C10AA01', form:'tablet', take:['evening'],
  doses:['10 mg','20 mg','40 mg'],
  notes:{ar:'مساءً — تصنيع الكوليسترول ليلي. أكثر الستاتينات تفاعلاً: راجع الكلاريثرومايسين والأملوديبين.',
         en:'In the evening — cholesterol is made overnight. The most interaction-prone statin: check clarithromycin and amlodipine.'},
  interactions:[
    { with:'Clarithromycin', severity:'critical', note:{ar:'انحلال ربيدات — ممنوع الجمع.', en:'Rhabdomyolysis — the combination is contraindicated.'} },
    { with:'Amlodipine', severity:'warning', note:{ar:'يُحدّ السيمفاستاتين بـ 20 ملغ يومياً.', en:'Limit simvastatin to 20 mg daily.'} },
    { with:'Fluconazole', severity:'serious', note:{ar:'خطر اعتلال عضلي.', en:'Myopathy risk.'} }
  ],
  contraindications:[
    {ar:'مرض كبدي فعّال', en:'Active liver disease'},
    {ar:'الحمل والإرضاع', en:'Pregnancy and breastfeeding'},
    {ar:'الاستعمال المتزامن مع الكلاريثرومايسين', en:'Concurrent clarithromycin'}
  ] },

{ sci:'Clopidogrel', ar:'كلوبيدوغريل', atc:'B01AC04', form:'tablet',
  doses:['75 mg','300 mg'],
  notes:{ar:'يُوقف 7 أيام قبل الجراحة بقرار الطبيب لا من تلقاء المريض. يحتاج تفعيلاً كبدياً.',
         en:'Stopped seven days before surgery — by the doctor, not the patient. It needs liver activation to work.'},
  interactions:[
    { with:'Omeprazole', severity:'serious', note:{ar:'يقلّل تفعيل كلوبيدوغريل — يُبدّل إلى بانتوبرازول.', en:'Blocks clopidogrel activation — switch to pantoprazole.'} },
    { with:'Esomeprazole', severity:'serious', note:{ar:'نفس المشكلة — يُبدّل إلى بانتوبرازول.', en:'The same problem — switch to pantoprazole.'} },
    { with:'Warfarin', severity:'serious', note:{ar:'خطر نزف كبير.', en:'Major bleeding risk.'} }
  ],
  contraindications:[
    {ar:'نزف فعّال', en:'Active bleeding'},
    {ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}
  ] },

{ sci:'Warfarin', ar:'وارفارين', atc:'B01AA03', form:'tablet', take:['sameTime'],
  doses:['1 mg','2 mg','2.5 mg','5 mg'],
  notes:{ar:'ثبات الخضروات الورقية أهم من تجنّبها. أي صادّ حيوي جديد يستوجب إعادة فحص INR. نفس الوقت يومياً.',
         en:'Consistency with leafy greens matters more than avoiding them. Any new antibiotic means recheck the INR. Same time every day.'},
  interactions:[
    { with:'Trimethoprim/Sulfamethoxazole', severity:'critical', note:{ar:'ارتفاع حاد في INR — يُتجنّب الجمع.', en:'Sharp rise in INR — avoid the combination.'} },
    { with:'Metronidazole', severity:'serious', note:{ar:'يرفع INR بوضوح.', en:'Markedly raises INR.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'نزف هضمي.', en:'GI bleeding.'} },
    { with:'Carbamazepine', severity:'serious', note:{ar:'يخفض INR ويفقد الحماية.', en:'Lowers INR and loses the protection.'} }
  ],
  contraindications:[
    {ar:'الحمل', en:'Pregnancy'},
    {ar:'نزف فعّال', en:'Active bleeding'},
    {ar:'قرحة هضمية فعّالة', en:'Active peptic ulcer'},
    {ar:'ارتفاع ضغط شديد غير مضبوط', en:'Severe uncontrolled hypertension'}
  ] },

{ sci:'Rivaroxaban', ar:'ريفاروكسابان', atc:'B01AF01', form:'tablet', take:['withFood'],
  doses:['2.5 mg','10 mg','15 mg','20 mg'],
  notes:{ar:'جرعة 15 و20 ملغ مع الطعام وإلا لم تُمتص. لا يحتاج INR لكنه ليس أأمن من الوارفارين مع النزف.',
         en:'The 15 and 20 mg doses must be taken with food or they will not absorb. No INR needed, but no safer than warfarin once bleeding starts.'},
  interactions:[
    { with:'Clarithromycin', severity:'serious', note:{ar:'يرفع مستوى الريفاروكسابان وخطر النزف.', en:'Raises rivaroxaban levels and bleeding risk.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'نزف هضمي.', en:'GI bleeding.'} },
    { with:'Carbamazepine', severity:'serious', note:{ar:'يخفض المستوى ويفقد الحماية.', en:'Lowers levels and loses the protection.'} }
  ],
  contraindications:[
    {ar:'نزف فعّال', en:'Active bleeding'},
    {ar:'الحمل والإرضاع', en:'Pregnancy and breastfeeding'},
    {ar:'قصور كبدي مع اعتلال تخثر', en:'Hepatic disease with coagulopathy'}
  ] },

{ sci:'Digoxin', ar:'ديجوكسين', atc:'C01AA05', form:'tablet',
  doses:['62.5 mcg','125 mcg','250 mcg'],
  notes:{ar:'هامش علاجي ضيّق. الغثيان والاضطراب البصري ورؤية الهالات علامات تسمّم لا آثار جانبية عادية.',
         en:'A narrow therapeutic window. Nausea, visual disturbance and haloes are toxicity, not ordinary side effects.'},
  interactions:[
    { with:'Furosemide', severity:'serious', note:{ar:'نقص البوتاسيوم يزيد سميّة الديجوكسين.', en:'The potassium loss makes digoxin toxic.'} },
    { with:'Amiodarone', severity:'critical', note:{ar:'يضاعف الديجوكسين — تُنصّف الجرعة.', en:'Doubles digoxin levels — halve the dose.'} },
    { with:'Verapamil', severity:'serious', note:{ar:'يرفع الديجوكسين.', en:'Raises digoxin.'} }
  ],
  contraindications:[
    {ar:'حصار قلبي من الدرجة الثانية أو الثالثة', en:'Second- or third-degree heart block'},
    {ar:'اعتلال عضلة قلب ضخامي انسدادي', en:'Hypertrophic obstructive cardiomyopathy'},
    {ar:'تسرّع بطيني', en:'Ventricular tachycardia'}
  ] },

{ sci:'Isosorbide dinitrate', ar:'أيزوسوربيد ثنائي النترات', atc:'C01DA08', form:'tablet',
  doses:['5 mg','10 mg','20 mg'],
  notes:{ar:'فترة خالية من النترات يومياً وإلا تطوّر التحمّل. الصداع متوقّع في الأيام الأولى.',
         en:'A nitrate-free interval each day or tolerance develops. Headache in the first days is expected.'},
  interactions:[
    { with:'Sildenafil', severity:'critical', note:{ar:'هبوط ضغط قاتل — ممنوع الجمع.', en:'Fatal hypotension — the combination is contraindicated.'} }
  ],
  contraindications:[
    {ar:'الاستعمال المتزامن مع مثبطات PDE5', en:'Concurrent PDE5 inhibitor'},
    {ar:'هبوط ضغط شديد', en:'Severe hypotension'},
    {ar:'تضيّق أبهري شديد', en:'Severe aortic stenosis'}
  ] },

{ sci:'Glyceryl trinitrate', ar:'ثلاثي نترات الغليسيريل', atc:'C01DA02', form:'spray',
  doses:['400 mcg/spray','0.5 mg sublingual'],
  notes:{ar:'تحت اللسان جالساً — الوقوف مع هبوط الضغط يسبّب إغماءً. جرعة ثالثة دون تحسّن تعني الإسعاف.',
         en:'Under the tongue, sitting down — standing with the blood-pressure drop causes a faint. No relief after the third dose means call an ambulance.'},
  interactions:[
    { with:'Sildenafil', severity:'critical', note:{ar:'هبوط ضغط قاتل — ممنوع الجمع.', en:'Fatal hypotension — the combination is contraindicated.'} }
  ],
  contraindications:[
    {ar:'الاستعمال المتزامن مع مثبطات PDE5', en:'Concurrent PDE5 inhibitor'},
    {ar:'هبوط ضغط شديد', en:'Severe hypotension'}
  ] },

{ sci:'Amiodarone', ar:'أميودارون', atc:'C01BD01', form:'tablet',
  doses:['100 mg','200 mg'],
  notes:{ar:'يبقى في الجسم أسابيع بعد التوقف. يستوجب متابعة الغدة الدرقية والكبد والرئة. واقٍ شمسي دائم.',
         en:'It stays in the body for weeks after stopping. Needs thyroid, liver and lung monitoring. Sunscreen, permanently.'},
  interactions:[
    { with:'Digoxin', severity:'critical', note:{ar:'يضاعف الديجوكسين — تُنصّف الجرعة.', en:'Doubles digoxin levels — halve the dose.'} },
    { with:'Warfarin', severity:'critical', note:{ar:'يرفع INR كثيراً — تُخفّض جرعة الوارفارين.', en:'Greatly raises INR — cut the warfarin dose.'} },
    { with:'Simvastatin', severity:'serious', note:{ar:'خطر اعتلال عضلي — يُحدّ بـ 20 ملغ.', en:'Myopathy risk — limit to 20 mg.'} }
  ],
  contraindications:[
    {ar:'اضطراب درقي', en:'Thyroid dysfunction'},
    {ar:'بطء قلب شديد أو حصار قلبي', en:'Severe bradycardia or heart block'},
    {ar:'فرط الحساسية لليود', en:'Iodine hypersensitivity'}
  ] },

{ sci:'Nifedipine', ar:'نيفيديبين', atc:'C08CA05', form:'tablet',
  doses:['10 mg','20 mg','30 mg SR','60 mg SR'],
  notes:{ar:'الشكل الممتد فقط لضغط الدم — القصير يسبّب تسرّعاً انعكاسياً. يُبلع كاملاً.',
         en:'Only the modified-release form for blood pressure — the short-acting one causes reflex tachycardia. Swallow whole.'},
  interactions:[
    { with:'Clarithromycin', severity:'serious', note:{ar:'هبوط ضغط شديد.', en:'Severe hypotension.'} },
    { with:'Carbamazepine', severity:'warning', note:{ar:'يقلّل فعالية النيفيديبين.', en:'Reduces nifedipine’s effect.'} }
  ],
  contraindications:[
    {ar:'صدمة قلبية', en:'Cardiogenic shock'},
    {ar:'ذبحة غير مستقرة', en:'Unstable angina'},
    {ar:'تضيّق أبهري شديد', en:'Severe aortic stenosis'}
  ] },

/* ---------- Diabetes ---------- */

{ sci:'Metformin', ar:'ميتفورمين', atc:'A10BA02', form:'tablet', take:['withFood'],
  doses:['500 mg','850 mg','1000 mg'],
  notes:{ar:'مع الطعام ويُرفع تدريجياً — الاضطراب المعوي سبب التوقف الأول وهو يزول. يُوقف مؤقتاً قبل التصوير بصبغة اليود.',
         en:'With food and built up slowly — GI upset is the main reason people quit, and it passes. Hold before iodinated contrast imaging.'},
  interactions:[
    { with:'Contrast media', severity:'critical', note:{ar:'خطر الحماض اللبني — يُوقف قبل الإجراء.', en:'Lactic acidosis risk — withhold before the procedure.'} },
    { with:'Furosemide', severity:'warning', note:{ar:'التجفاف يرفع خطر الحماض اللبني.', en:'Dehydration raises the lactic acidosis risk.'} }
  ],
  contraindications:[
    {ar:'قصور كلوي شديد (eGFR < 30)', en:'Severe renal impairment (eGFR < 30)'},
    {ar:'الحماض الكيتوني السكري', en:'Diabetic ketoacidosis'},
    {ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}
  ] },

{ sci:'Gliclazide', ar:'غليكلازيد', atc:'A10BB09', form:'tablet', take:['withBreakfast'],
  doses:['30 mg MR','60 mg MR','80 mg'],
  notes:{ar:'مع الفطور. يسبّب نقص سكر — يجب أن يحمل المريض سكّراً سريعاً معه دائماً.',
         en:'With breakfast. It causes hypoglycaemia — they should carry fast sugar at all times.'},
  interactions:[
    { with:'Atenolol', severity:'warning', note:{ar:'يُخفي أعراض نقص السكر.', en:'Masks the warning signs of hypoglycaemia.'} },
    { with:'Fluconazole', severity:'serious', note:{ar:'يرفع الغليكلازيد وخطر نقص السكر.', en:'Raises gliclazide and the risk of a hypo.'} },
    { with:'Trimethoprim/Sulfamethoxazole', severity:'serious', note:{ar:'نقص سكر شديد.', en:'Severe hypoglycaemia.'} }
  ],
  contraindications:[
    {ar:'السكري من النمط الأول', en:'Type 1 diabetes'},
    {ar:'الحماض الكيتوني السكري', en:'Diabetic ketoacidosis'},
    {ar:'قصور كبدي أو كلوي شديد', en:'Severe hepatic or renal impairment'}
  ] },

{ sci:'Glimepiride', ar:'غليميبيريد', atc:'A10BB12', form:'tablet', take:['withBreakfast'],
  doses:['1 mg','2 mg','3 mg','4 mg'],
  notes:{ar:'مرة واحدة مع أول وجبة. لا تُفوّت الوجبة بعد أخذه.',
         en:'Once daily with the first meal. Never take it and then skip the meal.'},
  interactions:[
    { with:'Fluconazole', severity:'serious', note:{ar:'خطر نقص سكر.', en:'Risk of hypoglycaemia.'} },
    { with:'Atenolol', severity:'warning', note:{ar:'يُخفي أعراض نقص السكر.', en:'Masks the warning signs of hypoglycaemia.'} }
  ],
  contraindications:[
    {ar:'السكري من النمط الأول', en:'Type 1 diabetes'},
    {ar:'الحماض الكيتوني السكري', en:'Diabetic ketoacidosis'},
    {ar:'الحمل والإرضاع', en:'Pregnancy and breastfeeding'}
  ] },

{ sci:'Glibenclamide', ar:'غليبنكلاميد', atc:'A10BB01', form:'tablet', take:['withBreakfast'],
  doses:['2.5 mg','5 mg'],
  notes:{ar:'أطول السلفونيل يوريا مفعولاً وأخطرها على كبار السن — نقص السكر قد يطول ساعات.',
         en:'The longest-acting sulfonylurea and the most dangerous in the elderly — a hypo can run for hours.'},
  interactions:[
    { with:'Fluconazole', severity:'serious', note:{ar:'خطر نقص سكر مطوّل.', en:'Risk of prolonged hypoglycaemia.'} },
    { with:'Trimethoprim/Sulfamethoxazole', severity:'serious', note:{ar:'نقص سكر شديد.', en:'Severe hypoglycaemia.'} }
  ],
  contraindications:[
    {ar:'السكري من النمط الأول', en:'Type 1 diabetes'},
    {ar:'قصور كلوي', en:'Renal impairment'},
    {ar:'كبار السن', en:'Elderly patients'}
  ] },

{ sci:'Sitagliptin', ar:'سيتاغليبتين', atc:'A10BH01', form:'tablet',
  doses:['25 mg','50 mg','100 mg'],
  notes:{ar:'لا يسبّب نقص سكر وحده. تُخفّض الجرعة مع قصور الكلية. ألم بطني شديد مستمر: احتمال التهاب بنكرياس.',
         en:'No hypoglycaemia on its own. Dose reduced in kidney impairment. Severe persistent abdominal pain: think pancreatitis.'},
  interactions:[
    { with:'Gliclazide', severity:'warning', note:{ar:'يزيد خطر نقص السكر — قد تُخفّض السلفونيل يوريا.', en:'Raises hypo risk — the sulfonylurea may need reducing.'} }
  ],
  contraindications:[
    {ar:'السكري من النمط الأول', en:'Type 1 diabetes'},
    {ar:'الحماض الكيتوني السكري', en:'Diabetic ketoacidosis'},
    {ar:'التهاب بنكرياس سابق', en:'Previous pancreatitis'}
  ] },

{ sci:'Empagliflozin', ar:'إمباغليفلوزين', atc:'A10BK03', form:'tablet', take:['morning'],
  doses:['10 mg','25 mg'],
  notes:{ar:'يُوقف أيام المرض مع التجفاف. إنتانات تناسلية فطرية شائعة — نظافة وسوائل. حماض كيتوني ممكن مع سكر طبيعي.',
         en:'Hold on sick days with dehydration. Genital thrush is common — hygiene and fluids. Ketoacidosis can happen with a normal glucose.'},
  interactions:[
    { with:'Furosemide', severity:'serious', note:{ar:'تجفاف وهبوط ضغط.', en:'Dehydration and hypotension.'} },
    { with:'Gliclazide', severity:'warning', note:{ar:'يزيد خطر نقص السكر.', en:'Raises hypo risk.'} }
  ],
  contraindications:[
    {ar:'السكري من النمط الأول', en:'Type 1 diabetes'},
    {ar:'الحماض الكيتوني السكري', en:'Diabetic ketoacidosis'},
    {ar:'الحمل والإرضاع', en:'Pregnancy and breastfeeding'}
  ] },

{ sci:'Insulin glargine', ar:'إنسولين غلارجين', atc:'A10AE04', form:'injection', take:['sameTime'],
  doses:['100 U/mL','300 U/mL'],
  notes:{ar:'قاعدي مرة يومياً بنفس الوقت. لا يُخلط مع إنسولين آخر في المحقنة. القلم قيد الاستعمال يُحفظ خارج الثلاجة 28 يوماً.',
         en:'Basal, once daily at the same time. Never mixed with another insulin in the syringe. The pen in use stays out of the fridge for 28 days.'},
  interactions:[
    { with:'Atenolol', severity:'serious', note:{ar:'يُخفي أعراض نقص السكر.', en:'Masks the warning signs of hypoglycaemia.'} },
    { with:'Prednisolone', severity:'serious', note:{ar:'يرفع سكر الدم — قد تلزم زيادة الجرعة.', en:'Raises glucose — the dose may need to go up.'} }
  ],
  contraindications:[{ar:'نقص سكر الدم', en:'Hypoglycaemia'}] },

{ sci:'Insulin regular', ar:'إنسولين نظامي', atc:'A10AB01', form:'injection', take:['beforeFood'],
  doses:['100 U/mL'],
  notes:{ar:'قبل الوجبة بـ 30 دقيقة — وليس معها. محلول رائق: العكارة تعني التلف.',
         en:'Thirty minutes before the meal, not with it. A clear solution: cloudiness means it has spoiled.'},
  interactions:[
    { with:'Atenolol', severity:'serious', note:{ar:'يُخفي أعراض نقص السكر.', en:'Masks the warning signs of hypoglycaemia.'} },
    { with:'Prednisolone', severity:'serious', note:{ar:'يرفع سكر الدم.', en:'Raises glucose.'} }
  ],
  contraindications:[{ar:'نقص سكر الدم', en:'Hypoglycaemia'}] },

/* ---------- Gastrointestinal ---------- */

{ sci:'Omeprazole', ar:'أوميبرازول', atc:'A02BC01', form:'capsule', take:['beforeBreakfast'],
  doses:['10 mg','20 mg','40 mg'],
  notes:{ar:'قبل الفطور بنصف ساعة على معدة فارغة. الاستعمال الطويل يقلّل امتصاص B12 والمغنيسيوم.',
         en:'Thirty minutes before breakfast, on an empty stomach. Long-term use reduces B12 and magnesium absorption.'},
  interactions:[
    { with:'Clopidogrel', severity:'serious', note:{ar:'يقلّل تفعيل كلوبيدوغريل — يُبدّل إلى بانتوبرازول.', en:'Blocks clopidogrel activation — switch to pantoprazole.'} },
    { with:'Cefuroxime', severity:'warning', note:{ar:'يقلّل امتصاص السيفوروكسيم.', en:'Reduces cefuroxime absorption.'} }
  ],
  contraindications:[{ar:'الاستعمال المتزامن مع كلوبيدوغريل', en:'Concurrent clopidogrel'}] },

{ sci:'Esomeprazole', ar:'إيزوميبرازول', atc:'A02BC05', form:'capsule', take:['beforeBreakfast'],
  doses:['20 mg','40 mg'],
  notes:{ar:'قبل الطعام بنصف ساعة. يُبلع كاملاً أو تُنثر الحبيبات على طعام لين دون مضغ.',
         en:'Thirty minutes before food. Swallow whole, or sprinkle the granules on soft food without chewing.'},
  interactions:[
    { with:'Clopidogrel', severity:'serious', note:{ar:'يقلّل تفعيل كلوبيدوغريل.', en:'Blocks clopidogrel activation.'} }
  ],
  contraindications:[{ar:'الاستعمال المتزامن مع كلوبيدوغريل', en:'Concurrent clopidogrel'}] },

{ sci:'Pantoprazole', ar:'بانتوبرازول', atc:'A02BC02', form:'tablet', take:['beforeBreakfast'],
  doses:['20 mg','40 mg'],
  notes:{ar:'مثبّط المضخة المفضّل مع كلوبيدوغريل — لا يتداخل مع تفعيله.',
         en:'The proton pump inhibitor to use alongside clopidogrel — it does not block its activation.'},
  interactions:[],
  contraindications:[{ar:'فرط الحساسية للبنزيميدازولات', en:'Benzimidazole hypersensitivity'}] },

{ sci:'Famotidine', ar:'فاموتيدين', atc:'A02BA03', form:'tablet',
  doses:['20 mg','40 mg'],
  notes:{ar:'يعمل خلال ساعة — أسرع من مثبطات المضخة وأقل استمراراً. تُخفّض الجرعة مع قصور الكلية.',
         en:'Works within an hour — faster than a proton pump inhibitor and shorter-lived. Dose reduced in kidney impairment.'},
  interactions:[
    { with:'Ketoconazole', severity:'warning', note:{ar:'يقلّل امتصاص الكيتوكونازول الفموي.', en:'Reduces oral ketoconazole absorption.'} }
  ],
  contraindications:[{ar:'قصور كلوي شديد دون تعديل الجرعة', en:'Severe renal impairment without dose adjustment'}] },

{ sci:'Domperidone', ar:'دومبيريدون', atc:'A03FA03', form:'tablet', take:['beforeFood'],
  doses:['10 mg','1 mg/mL'],
  notes:{ar:'قبل الطعام بـ 15–30 دقيقة. أقصر مدة ممكنة — أسبوع عادة — بسبب خطر QT.',
         en:'Fifteen to thirty minutes before food. The shortest course possible — usually a week — because of the QT risk.'},
  interactions:[
    { with:'Azithromycin', severity:'serious', note:{ar:'إطالة QT مضاعفة.', en:'Additive QT prolongation.'} },
    { with:'Fluconazole', severity:'serious', note:{ar:'يرفع الدومبيريدون ويطيل QT.', en:'Raises domperidone and prolongs QT.'} },
    { with:'Clarithromycin', severity:'critical', note:{ar:'إطالة QT — يُتجنّب الجمع.', en:'QT prolongation — avoid the combination.'} }
  ],
  contraindications:[
    {ar:'إطالة QT معروفة', en:'Known QT prolongation'},
    {ar:'انسداد أو نزف هضمي', en:'GI obstruction or haemorrhage'},
    {ar:'قصور كبدي معتدل إلى شديد', en:'Moderate to severe hepatic impairment'}
  ] },

{ sci:'Metoclopramide', ar:'ميتوكلوبراميد', atc:'A03FA01', form:'tablet', take:['beforeFood'],
  doses:['10 mg','5 mg/5 mL','10 mg/2 mL'],
  notes:{ar:'خمسة أيام كحد أقصى. الأعراض خارج الهرمية أشيع عند الشباب والنساء — تقلّص عضلي في الرقبة أو العين يستوجب الإسعاف.',
         en:'Five days maximum. Extrapyramidal reactions are commonest in the young and in women — a spasm of the neck or eyes needs urgent care.'},
  interactions:[
    { with:'Levodopa', severity:'serious', note:{ar:'تضاد متبادل في الأثر.', en:'Each one blocks the other.'} },
    { with:'Haloperidol', severity:'serious', note:{ar:'أعراض خارج هرمية مضاعفة.', en:'Compounded extrapyramidal effects.'} }
  ],
  contraindications:[
    {ar:'انسداد أو نزف أو انثقاب هضمي', en:'GI obstruction, haemorrhage or perforation'},
    {ar:'داء باركنسون', en:'Parkinson’s disease'},
    {ar:'الصرع', en:'Epilepsy'},
    {ar:'ورم القواتم', en:'Phaeochromocytoma'}
  ] },

{ sci:'Ondansetron', ar:'أوندانسيترون', atc:'A04AA01', form:'tablet',
  doses:['4 mg','8 mg','4 mg/2 mL'],
  notes:{ar:'الإمساك أشيع أعراضه. الشكل الذائب في الفم مفيد عند تعذّر البلع.',
         en:'Constipation is its commonest side effect. The orodispersible form is the one for a patient who cannot keep anything down.'},
  interactions:[
    { with:'Amiodarone', severity:'serious', note:{ar:'إطالة QT مضاعفة.', en:'Additive QT prolongation.'} },
    { with:'Tramadol', severity:'warning', note:{ar:'يقلّل التسكين ويزيد خطر السيروتونين.', en:'Blunts the analgesia and adds serotonergic risk.'} }
  ],
  contraindications:[
    {ar:'إطالة QT معروفة', en:'Known QT prolongation'},
    {ar:'متلازمة QT الطويل الخلقية', en:'Congenital long QT syndrome'}
  ] },

{ sci:'Loperamide', ar:'لوبيراميد', atc:'A07DA03', form:'capsule',
  doses:['2 mg'],
  notes:{ar:'لا يُستعمل مع حمّى أو دم في البراز — يحبس الإنتان. السوائل والأملاح أهم منه.',
         en:'Not with a fever or blood in the stool — it traps the infection. Fluid and salts matter more than it does.'},
  interactions:[
    { with:'Clarithromycin', severity:'serious', note:{ar:'يرفع اللوبيراميد وخطر إطالة QT.', en:'Raises loperamide and the QT risk.'} }
  ],
  contraindications:[
    {ar:'إسهال دموي أو مع حمّى', en:'Bloody or febrile diarrhoea'},
    {ar:'التهاب قولون تقرّحي حاد', en:'Acute ulcerative colitis'},
    {ar:'الأطفال دون 12 سنة', en:'Children under 12'}
  ] },

{ sci:'Lactulose', ar:'لاكتولوز', atc:'A06AD11', form:'syrup',
  doses:['3.35 g/5 mL'],
  notes:{ar:'يحتاج 2–3 أيام ليعمل — ليس ملّيناً فورياً. الانتفاخ يقلّ مع الوقت. سوائل وفيرة.',
         en:'It takes two to three days to work — not a rescue laxative. The bloating settles. Plenty of fluid.'},
  interactions:[],
  contraindications:[
    {ar:'انسداد معوي', en:'Intestinal obstruction'},
    {ar:'عدم تحمّل الغالاكتوز', en:'Galactose intolerance'}
  ] },

{ sci:'Mebeverine', ar:'ميبيفيرين', atc:'A03AA04', form:'tablet', take:['beforeFood'],
  doses:['135 mg','200 mg MR'],
  notes:{ar:'قبل الطعام بـ 20 دقيقة. لا ينفع كمسكّن عند الطلب — يحتاج انتظاماً.',
         en:'Twenty minutes before food. No use taken when the pain comes — it needs to be regular.'},
  interactions:[],
  contraindications:[{ar:'العلوص الشللي', en:'Paralytic ileus'}] },

{ sci:'Hyoscine butylbromide', ar:'هيوسين بوتيل بروميد', atc:'A03BB01', form:'tablet',
  doses:['10 mg','20 mg/mL'],
  notes:{ar:'للمغص التشنّجي عند الطلب. جفاف الفم وتشوّش الرؤية متوقّعان.',
         en:'For colicky cramp, as needed. Dry mouth and blurred vision are expected.'},
  interactions:[
    { with:'Amitriptyline', severity:'warning', note:{ar:'آثار مضادة للكولين مضاعفة.', en:'Compounded anticholinergic effects.'} }
  ],
  contraindications:[
    {ar:'الزرق ضيّق الزاوية', en:'Angle-closure glaucoma'},
    {ar:'الوهن العضلي الوبيل', en:'Myasthenia gravis'},
    {ar:'تضخّم البروستات مع احتباس بول', en:'Prostatic enlargement with retention'}
  ] },

{ sci:'Oral rehydration salts', ar:'أملاح الإماهة الفموية', atc:'A07CA', form:'sachet',
  doses:['1 sachet/200 mL','1 sachet/1 L'],
  notes:{ar:'يُذاب بماء نظيف فقط وبالحجم المكتوب — الخلطة المركّزة تزيد التجفاف. يُتلف بعد 24 ساعة.',
         en:'Clean water only, and exactly the volume on the sachet — a concentrated mix makes dehydration worse. Discard after 24 hours.'},
  interactions:[],
  contraindications:[
    {ar:'انسداد معوي', en:'Intestinal obstruction'},
    {ar:'تجفاف شديد يستوجب الوريد', en:'Severe dehydration needing IV fluids'}
  ] },

/* ---------- Respiratory and allergy ---------- */

{ sci:'Salbutamol', ar:'سالبوتامول', atc:'R03AC02', form:'inhaler',
  doses:['100 mcg/dose','2 mg/5 mL','5 mg/mL nebuliser'],
  notes:{ar:'مُسعف لا وقائي. الحاجة إليه أكثر من ثلاث مرات أسبوعياً تعني ربواً غير مضبوط — راجع الطبيب. اعرض طريقة الاستنشاق ولا تكتفِ بالشرح.',
         en:'A reliever, not a preventer. Needing it more than three times a week means the asthma is not controlled — see the doctor. Demonstrate the inhaler; do not just describe it.'},
  interactions:[
    { with:'Bisoprolol', severity:'serious', note:{ar:'حاصرات بيتا تلغي أثر موسّع القصبات.', en:'Beta blockers cancel the bronchodilator.'} },
    { with:'Furosemide', severity:'warning', note:{ar:'نقص بوتاسيوم مضاعف مع الجرعات العالية.', en:'Compounded potassium loss at high doses.'} }
  ],
  contraindications:[] },

{ sci:'Budesonide/Formoterol', ar:'بوديزونيد/فورموتيرول', atc:'R03AK07', form:'inhaler',
  doses:['80/4.5 mcg','160/4.5 mcg','320/9 mcg'],
  notes:{ar:'المضمضة بعد كل استعمال — القلاع الفموي وبحّة الصوت سببهما إهمالها. وقائي يؤخذ حتى في الأيام الجيدة.',
         en:'Rinse the mouth every time — oral thrush and a hoarse voice come from not doing it. A preventer: taken on the good days too.'},
  interactions:[
    { with:'Bisoprolol', severity:'serious', note:{ar:'حاصرات بيتا تلغي أثر الفورموتيرول.', en:'Beta blockers cancel the formoterol.'} },
    { with:'Clarithromycin', severity:'warning', note:{ar:'يرفع البوديزونيد الجهازي.', en:'Raises systemic budesonide.'} }
  ],
  contraindications:[] },

{ sci:'Beclometasone', ar:'بيكلوميتازون', atc:'R03BA01', form:'inhaler',
  doses:['50 mcg/dose','100 mcg/dose','250 mcg/dose'],
  notes:{ar:'وقائي محض — لا يفيد أثناء النوبة. المضمضة بعد كل استعمال.',
         en:'A pure preventer — no use during an attack. Rinse the mouth every time.'},
  interactions:[],
  contraindications:[] },

{ sci:'Montelukast', ar:'مونتيلوكاست', atc:'R03DC03', form:'tablet', take:['evening'],
  doses:['4 mg','5 mg','10 mg'],
  notes:{ar:'مساءً. اضطرابات نفسية وكوابيس وتغيّر مزاج أثر معروف — يستوجب الإبلاغ والتوقف.',
         en:'In the evening. Mood change, nightmares and other neuropsychiatric effects are a recognised risk — report them and stop.'},
  interactions:[
    { with:'Phenobarbital', severity:'warning', note:{ar:'يقلّل مستوى المونتيلوكاست.', en:'Lowers montelukast levels.'} }
  ],
  contraindications:[] },

{ sci:'Cetirizine', ar:'سيتريزين', atc:'R06AE07', form:'tablet',
  doses:['5 mg','10 mg','5 mg/5 mL'],
  notes:{ar:'أقل تنويماً من القديمة لكنه ليس خالياً منه — تحذير القيادة يبقى قائماً.',
         en:'Less sedating than the old antihistamines, but not free of it — the driving warning still applies.'},
  interactions:[
    { with:'Diazepam', severity:'warning', note:{ar:'تنويم مضاعف.', en:'Compounded sedation.'} }
  ],
  contraindications:[{ar:'قصور كلوي شديد', en:'Severe renal impairment'}] },

{ sci:'Loratadine', ar:'لوراتادين', atc:'R06AX13', form:'tablet',
  doses:['10 mg','5 mg/5 mL'],
  notes:{ar:'الأقل تنويماً بين مضادات الهيستامين الشائعة — الخيار لمن يقود أو يعمل على آلة.',
         en:'The least sedating of the common antihistamines — the one for a driver or someone on machinery.'},
  interactions:[],
  contraindications:[{ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}] },

{ sci:'Fexofenadine', ar:'فيكسوفينادين', atc:'R06AX26', form:'tablet',
  doses:['30 mg','120 mg','180 mg'],
  notes:{ar:'لا يُؤخذ مع عصير الفواكه — يقلّل الامتصاص بالثلث. بماء فقط.',
         en:'Not with fruit juice — it cuts absorption by a third. Water only.'},
  interactions:[
    { with:'Magnesium trisilicate', severity:'warning', note:{ar:'يقلّل الامتصاص — باعد ساعتين.', en:'Reduces absorption — space by two hours.'} }
  ],
  contraindications:[] },

{ sci:'Chlorphenamine', ar:'كلورفينيرامين', atc:'R06AB04', form:'tablet',
  doses:['4 mg','2 mg/5 mL','10 mg/mL'],
  notes:{ar:'منوّم بوضوح — لا قيادة. مفيد ليلاً للحكة، وشكله الحقني جزء من علاج التأق.',
         en:'Frankly sedating — no driving. Useful at night for itch, and the injection is part of anaphylaxis treatment.'},
  interactions:[
    { with:'Amitriptyline', severity:'warning', note:{ar:'آثار مضادة للكولين وتنويم مضاعف.', en:'Compounded anticholinergic effects and sedation.'} },
    { with:'Diazepam', severity:'serious', note:{ar:'تنويم شديد.', en:'Marked sedation.'} }
  ],
  contraindications:[
    {ar:'الزرق ضيّق الزاوية', en:'Angle-closure glaucoma'},
    {ar:'تضخّم البروستات مع احتباس بول', en:'Prostatic enlargement with retention'}
  ] },

{ sci:'Dextromethorphan', ar:'ديكستروميثورفان', atc:'R05DA09', form:'syrup',
  doses:['15 mg/5 mL','10 mg'],
  notes:{ar:'للسعال الجاف فقط — يُكبت المنعكس، فلا يُعطى مع سعال منتج. يُساء استعماله بجرعات عالية.',
         en:'Dry cough only — it suppresses the reflex, so not with a productive cough. Abused at high doses.'},
  interactions:[
    { with:'Fluoxetine', severity:'serious', note:{ar:'متلازمة السيروتونين.', en:'Serotonin syndrome.'} },
    { with:'Sertraline', severity:'serious', note:{ar:'متلازمة السيروتونين.', en:'Serotonin syndrome.'} }
  ],
  contraindications:[
    {ar:'تناول مثبطات MAO خلال 14 يوماً', en:'MAO inhibitor within 14 days'},
    {ar:'سعال منتج', en:'Productive cough'}
  ] },

{ sci:'Ambroxol', ar:'أمبروكسول', atc:'R05CB06', form:'syrup',
  doses:['15 mg/5 mL','30 mg/5 mL','30 mg'],
  notes:{ar:'حالّ للقشع — مع سوائل وفيرة وإلا لم يفد. لا يُجمع مع كابت للسعال.',
         en:'A mucolytic — useless without plenty of fluid alongside. Never combined with a cough suppressant.'},
  interactions:[],
  contraindications:[{ar:'قرحة هضمية فعّالة', en:'Active peptic ulcer'}] },

{ sci:'Xylometazoline', ar:'زايلوميتازولين', atc:'R01AA07', form:'spray',
  doses:['0.05%','0.1%'],
  notes:{ar:'خمسة أيام كحدّ أقصى — الاستعمال الأطول يسبّب احتقاناً ارتدادياً يصعب علاجه.',
         en:'Five days maximum — longer causes a rebound congestion that is hard to undo.'},
  interactions:[],
  contraindications:[
    {ar:'بعد جراحة عبر الأنف الوتدي', en:'After trans-sphenoidal surgery'},
    {ar:'الزرق ضيّق الزاوية', en:'Angle-closure glaucoma'},
    {ar:'الأطفال دون سنتين', en:'Children under two'}
  ] },

/* ---------- Central nervous system ---------- */

{ sci:'Amitriptyline', ar:'أميتريبتيلين', atc:'N06AA09', form:'tablet', take:['bedtime'],
  doses:['10 mg','25 mg','50 mg'],
  notes:{ar:'جرعة الألم العصبي أقل بكثير من جرعة الاكتئاب — طمئن المريض أن الوصفة ليست لاكتئاب. تُؤخذ مساءً.',
         en:'The neuropathic-pain dose is far below the antidepressant one — reassure them the prescription is not about depression. Take it in the evening.'},
  interactions:[
    { with:'Fluoxetine', severity:'serious', note:{ar:'يرفع الأميتريبتيلين ويزيد خطر السيروتونين.', en:'Raises amitriptyline and the serotonergic risk.'} },
    { with:'Tramadol', severity:'serious', note:{ar:'اختلاج ومتلازمة سيروتونين.', en:'Seizures and serotonin syndrome.'} },
    { with:'Amiodarone', severity:'serious', note:{ar:'إطالة QT مضاعفة.', en:'Additive QT prolongation.'} }
  ],
  contraindications:[
    {ar:'بعد احتشاء قلبي حديث', en:'Recent myocardial infarction'},
    {ar:'اضطرابات نظم قلبية', en:'Cardiac arrhythmias'},
    {ar:'الزرق ضيّق الزاوية', en:'Angle-closure glaucoma'},
    {ar:'تناول مثبطات MAO خلال 14 يوماً', en:'MAO inhibitor within 14 days'}
  ] },

{ sci:'Fluoxetine', ar:'فلوكسيتين', atc:'N06AB03', form:'capsule', take:['morning'],
  doses:['10 mg','20 mg','40 mg'],
  notes:{ar:'صباحاً. الأثر يحتاج 2–4 أسابيع والقلق قد يزيد في الأيام الأولى — هذه أهم جملة تُقال عند الصرف.',
         en:'In the morning. It takes two to four weeks, and anxiety can worsen in the first days — that is the single most important thing to say at the counter.'},
  interactions:[
    { with:'Tramadol', severity:'serious', note:{ar:'متلازمة السيروتونين واختلاج.', en:'Serotonin syndrome and seizures.'} },
    { with:'Metoprolol', severity:'serious', note:{ar:'يرفع الميتوبرولول كثيراً.', en:'Substantially raises metoprolol.'} },
    { with:'Warfarin', severity:'serious', note:{ar:'خطر نزف مرتفع.', en:'Raised bleeding risk.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'نزف هضمي.', en:'GI bleeding.'} }
  ],
  contraindications:[
    {ar:'تناول مثبطات MAO خلال 14 يوماً', en:'MAO inhibitor within 14 days'},
    {ar:'هوس غير مضبوط', en:'Uncontrolled mania'}
  ] },

{ sci:'Sertraline', ar:'سيرترالين', atc:'N06AB06', form:'tablet',
  doses:['25 mg','50 mg','100 mg'],
  notes:{ar:'مع الطعام. لا يُوقف فجأة — أعراض الانسحاب مزعجة ويُخفّض تدريجياً.',
         en:'With food. Never stopped abruptly — the discontinuation symptoms are unpleasant; taper it.'},
  interactions:[
    { with:'Tramadol', severity:'serious', note:{ar:'متلازمة السيروتونين.', en:'Serotonin syndrome.'} },
    { with:'Warfarin', severity:'serious', note:{ar:'خطر نزف مرتفع.', en:'Raised bleeding risk.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'نزف هضمي.', en:'GI bleeding.'} }
  ],
  contraindications:[
    {ar:'تناول مثبطات MAO خلال 14 يوماً', en:'MAO inhibitor within 14 days'},
    {ar:'الاستعمال المتزامن مع بيموزيد', en:'Concurrent pimozide'}
  ] },

{ sci:'Escitalopram', ar:'إسيتالوبرام', atc:'N06AB10', form:'tablet',
  doses:['5 mg','10 mg','20 mg'],
  notes:{ar:'الجرعة القصوى 10 ملغ فوق 65 سنة بسبب QT. لا يُوقف فجأة.',
         en:'Maximum 10 mg over 65 because of QT. Do not stop abruptly.'},
  interactions:[
    { with:'Amiodarone', severity:'serious', note:{ar:'إطالة QT مضاعفة.', en:'Additive QT prolongation.'} },
    { with:'Tramadol', severity:'serious', note:{ar:'متلازمة السيروتونين.', en:'Serotonin syndrome.'} },
    { with:'Omeprazole', severity:'warning', note:{ar:'يرفع الإسيتالوبرام.', en:'Raises escitalopram.'} }
  ],
  contraindications:[
    {ar:'تناول مثبطات MAO خلال 14 يوماً', en:'MAO inhibitor within 14 days'},
    {ar:'إطالة QT معروفة', en:'Known QT prolongation'}
  ] },

{ sci:'Diazepam', ar:'ديازيبام', atc:'N05BA01', form:'tablet',
  doses:['2 mg','5 mg','10 mg','10 mg/2 mL'],
  notes:{ar:'مادة خاضعة للرقابة. أسبوعان كحدّ أقصى — الاعتماد يبدأ بعدها. لا قيادة ولا كحول.',
         en:'A controlled substance. Two weeks maximum — dependence starts after that. No driving, no alcohol.'},
  interactions:[
    { with:'Tramadol', severity:'critical', note:{ar:'تثبيط تنفسي — يُتجنّب الجمع.', en:'Respiratory depression — avoid the combination.'} },
    { with:'Clarithromycin', severity:'serious', note:{ar:'يرفع الديازيبام ويطيل التنويم.', en:'Raises diazepam and prolongs sedation.'} }
  ],
  contraindications:[
    {ar:'قصور تنفسي شديد', en:'Severe respiratory insufficiency'},
    {ar:'توقّف تنفس نومي', en:'Sleep apnoea'},
    {ar:'الوهن العضلي الوبيل', en:'Myasthenia gravis'},
    {ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}
  ] },

{ sci:'Alprazolam', ar:'ألبرازولام', atc:'N05BA12', form:'tablet',
  doses:['0.25 mg','0.5 mg','1 mg'],
  notes:{ar:'مادة خاضعة للرقابة وأسرع البنزوديازيبينات إحداثاً للاعتماد. لا يُوقف فجأة بعد استعمال منتظم.',
         en:'A controlled substance and the fastest of the benzodiazepines to create dependence. Never stopped abruptly after regular use.'},
  interactions:[
    { with:'Tramadol', severity:'critical', note:{ar:'تثبيط تنفسي.', en:'Respiratory depression.'} },
    { with:'Clarithromycin', severity:'serious', note:{ar:'يرفع الألبرازولام كثيراً.', en:'Substantially raises alprazolam.'} },
    { with:'Fluconazole', severity:'serious', note:{ar:'يرفع الألبرازولام.', en:'Raises alprazolam.'} }
  ],
  contraindications:[
    {ar:'قصور تنفسي شديد', en:'Severe respiratory insufficiency'},
    {ar:'توقّف تنفس نومي', en:'Sleep apnoea'},
    {ar:'الزرق ضيّق الزاوية', en:'Angle-closure glaucoma'}
  ] },

{ sci:'Carbamazepine', ar:'كاربامازيبين', atc:'N03AF01', form:'tablet', take:['withFood'],
  doses:['100 mg/5 mL','200 mg','400 mg'],
  notes:{ar:'محرّض إنزيمي قوي يُضعف حبوب منع الحمل وكثيراً غيرها. طفح جلدي في الأسابيع الأولى يستوجب التوقف الفوري.',
         en:'A powerful enzyme inducer — it undermines the contraceptive pill and much else. A rash in the first weeks means stop immediately.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'يخفض INR ويفقد الحماية.', en:'Lowers INR and loses the protection.'} },
    { with:'Clarithromycin', severity:'serious', note:{ar:'يرفع الكاربامازيبين إلى حدّ السميّة.', en:'Raises carbamazepine to toxic levels.'} },
    { with:'Rivaroxaban', severity:'serious', note:{ar:'يخفض المستوى ويفقد الحماية.', en:'Lowers levels and loses the protection.'} },
    { with:'Sertraline', severity:'warning', note:{ar:'يقلّل فعالية السيرترالين.', en:'Reduces sertraline’s effect.'} }
  ],
  contraindications:[
    {ar:'حصار أذيني بطيني', en:'Atrioventricular block'},
    {ar:'تثبيط نقي عظم سابق', en:'Previous bone marrow depression'},
    {ar:'بورفيريا', en:'Porphyria'}
  ] },

{ sci:'Sodium valproate', ar:'فالبروات الصوديوم', atc:'N03AG01', form:'tablet', take:['afterFood'],
  doses:['200 mg','500 mg','200 mg/5 mL'],
  notes:{ar:'ممنوع في الحمل وعند أي امرأة في سنّ الإنجاب دون برنامج منع حمل موثّق — خطر تشوّه واضطراب نمو عصبي عالٍ جداً.',
         en:'Contraindicated in pregnancy and in any woman of childbearing potential without a documented pregnancy-prevention plan — the malformation and neurodevelopmental risk is very high.'},
  interactions:[
    { with:'Carbamazepine', severity:'serious', note:{ar:'تغيّر متبادل في المستويات.', en:'Each one shifts the other’s level.'} },
    { with:'Aspirin', severity:'serious', note:{ar:'يرفع الفالبروات الحر.', en:'Raises free valproate.'} },
    { with:'Lamotrigine', severity:'critical', note:{ar:'يضاعف اللاموتريجين وخطر الطفح الشديد.', en:'Doubles lamotrigine and the risk of a severe rash.'} }
  ],
  contraindications:[
    {ar:'الحمل', en:'Pregnancy'},
    {ar:'النساء في سنّ الإنجاب دون برنامج منع حمل', en:'Women of childbearing potential without a pregnancy-prevention plan'},
    {ar:'مرض كبدي فعّال', en:'Active liver disease'},
    {ar:'اضطرابات دورة اليوريا', en:'Urea cycle disorders'}
  ] },

{ sci:'Pregabalin', ar:'بريغابالين', atc:'N03AX16', form:'capsule',
  doses:['25 mg','75 mg','150 mg','300 mg'],
  notes:{ar:'مادة خاضعة للرقابة ويُساء استعمالها. لا يُوقف فجأة. الدوار والنعاس في الأيام الأولى يزولان.',
         en:'A controlled substance and widely misused. Not stopped abruptly. The dizziness and drowsiness of the first days settle.'},
  interactions:[
    { with:'Tramadol', severity:'serious', note:{ar:'تثبيط تنفسي وتنويم مضاعف.', en:'Respiratory depression and compounded sedation.'} },
    { with:'Diazepam', severity:'serious', note:{ar:'تنويم شديد.', en:'Marked sedation.'} }
  ],
  contraindications:[] },

{ sci:'Levothyroxine', ar:'ليفوثيروكسين', atc:'H03AA01', form:'tablet', take:['emptyStomach', 'beforeBreakfast'],
  doses:['25 mcg','50 mcg','75 mcg','100 mcg'],
  notes:{ar:'على معدة فارغة قبل الفطور بنصف ساعة، وبعيداً عن الحديد والكالسيوم بأربع ساعات. لا يُبدّل بين الشركات بلا داعٍ.',
         en:'Empty stomach, thirty minutes before breakfast, and four hours away from iron and calcium. Do not switch between manufacturers without reason.'},
  interactions:[
    { with:'Ferrous sulfate', severity:'serious', note:{ar:'يمنع الامتصاص — باعد أربع ساعات.', en:'Blocks absorption — space by four hours.'} },
    { with:'Calcium carbonate', severity:'serious', note:{ar:'يمنع الامتصاص — باعد أربع ساعات.', en:'Blocks absorption — space by four hours.'} },
    { with:'Omeprazole', severity:'warning', note:{ar:'يقلّل الامتصاص.', en:'Reduces absorption.'} },
    { with:'Warfarin', severity:'serious', note:{ar:'يزيد أثر الوارفارين مع تحسّن الحالة الدرقية.', en:'Warfarin’s effect grows as the thyroid state corrects.'} }
  ],
  contraindications:[
    {ar:'انسمام درقي غير معالج', en:'Untreated thyrotoxicosis'},
    {ar:'قصور كظر غير معالج', en:'Untreated adrenal insufficiency'}
  ] },

{ sci:'Prednisolone', ar:'بريدنيزولون', atc:'H02AB06', form:'tablet', take:['morning', 'withFood'],
  doses:['5 mg','20 mg','25 mg'],
  notes:{ar:'صباحاً مع الطعام. لا يُوقف فجأة بعد أكثر من ثلاثة أسابيع — قصور كظر. بطاقة الستيرويد ضرورية.',
         en:'In the morning, with food. Never stopped abruptly after more than three weeks — adrenal crisis. They need a steroid card.'},
  interactions:[
    { with:'Ibuprofen', severity:'serious', note:{ar:'خطر قرحة ونزف هضمي مضاعف.', en:'Compounded ulcer and GI bleeding risk.'} },
    { with:'Insulin glargine', severity:'serious', note:{ar:'يرفع سكر الدم — قد تلزم زيادة الجرعة.', en:'Raises glucose — the dose may need to go up.'} },
    { with:'Warfarin', severity:'warning', note:{ar:'قد يرفع INR.', en:'May raise INR.'} }
  ],
  contraindications:[
    {ar:'إنتان جهازي غير معالج', en:'Untreated systemic infection'},
    {ar:'اللقاحات الحية بالجرعات المثبّطة للمناعة', en:'Live vaccines at immunosuppressive doses'}
  ] },

{ sci:'Allopurinol', ar:'ألوبيورينول', atc:'M04AA01', form:'tablet', take:['afterFood'],
  doses:['100 mg','300 mg'],
  notes:{ar:'لا يُبدأ أثناء نوبة نقرس حادة — يُفاقمها. سوائل وفيرة. طفح جلدي يستوجب التوقف الفوري.',
         en:'Never started during an acute gout attack — it makes it worse. Plenty of fluid. A rash means stop at once.'},
  interactions:[
    { with:'Azathioprine', severity:'critical', note:{ar:'تثبيط نقي مهدّد للحياة — تُخفّض جرعة الآزاثيوبرين إلى الربع.', en:'Life-threatening marrow suppression — the azathioprine dose drops to a quarter.'} },
    { with:'Amoxicillin/Clavulanic acid', severity:'warning', note:{ar:'يزيد احتمال الطفح.', en:'Raises the chance of a rash.'} },
    { with:'Warfarin', severity:'warning', note:{ar:'قد يرفع INR.', en:'May raise INR.'} }
  ],
  contraindications:[{ar:'نوبة نقرس حادة فعّالة', en:'An acute gout attack in progress'}] },

{ sci:'Colchicine', ar:'كولشيسين', atc:'M04AC01', form:'tablet',
  doses:['0.5 mg','1 mg'],
  notes:{ar:'هامش علاجي ضيّق جداً. الإسهال أول علامة تجاوز الجرعة — يُوقف عندها لا يُكمل.',
         en:'A very narrow window. Diarrhoea is the first sign of too much — stop there, do not push on.'},
  interactions:[
    { with:'Clarithromycin', severity:'critical', note:{ar:'سميّة كولشيسين قاتلة — ممنوع الجمع.', en:'Fatal colchicine toxicity — the combination is contraindicated.'} },
    { with:'Atorvastatin', severity:'serious', note:{ar:'خطر اعتلال عضلي مضاعف.', en:'Compounded myopathy risk.'} },
    { with:'Simvastatin', severity:'serious', note:{ar:'خطر انحلال ربيدات.', en:'Rhabdomyolysis risk.'} }
  ],
  contraindications:[
    {ar:'قصور كلوي وكبدي معاً', en:'Renal and hepatic impairment together'},
    {ar:'الاستعمال المتزامن مع الكلاريثرومايسين', en:'Concurrent clarithromycin'}
  ] },

{ sci:'Ferrous sulfate', ar:'كبريتات الحديدوز', atc:'B03AA07', form:'tablet',
  doses:['200 mg','325 mg','60 mg/5 mL'],
  notes:{ar:'على معدة فارغة مع فيتامين C لأفضل امتصاص، ومع الطعام إذا لم يُحتمل. البراز الأسود متوقّع. بعيداً عن الشاي بساعتين.',
         en:'Empty stomach with vitamin C absorbs best; with food if that is not tolerated. Black stools are expected. Two hours away from tea.'},
  interactions:[
    { with:'Levothyroxine', severity:'serious', note:{ar:'يمنع امتصاص الليفوثيروكسين — باعد أربع ساعات.', en:'Blocks levothyroxine absorption — space by four hours.'} },
    { with:'Doxycycline', severity:'serious', note:{ar:'يرتبط بالدوكسيسيكلين ويفقد الامتصاص.', en:'Chelates with doxycycline and loses absorption.'} },
    { with:'Ciprofloxacin', severity:'serious', note:{ar:'يرتبط بالسيبروفلوكساسين ويفقد الامتصاص.', en:'Chelates with ciprofloxacin and loses absorption.'} }
  ],
  contraindications:[
    {ar:'داء ترسّب الأصبغة الدموية', en:'Haemochromatosis'},
    {ar:'فقر دم غير ناجم عن عوز الحديد', en:'Anaemia not due to iron deficiency'}
  ] },

{ sci:'Folic acid', ar:'حمض الفوليك', atc:'B03BB01', form:'tablet',
  doses:['400 mcg','1 mg','5 mg'],
  notes:{ar:'400 ميكروغرام قبل الحمل بشهر وحتى الأسبوع الثاني عشر؛ 5 ملغ مع السكري أو مضادات الاختلاج أو سوابق عيب أنبوب عصبي.',
         en:'400 micrograms from a month before conception to week twelve; 5 mg with diabetes, an antiepileptic, or a previous neural tube defect.'},
  interactions:[
    { with:'Methotrexate', severity:'warning', note:{ar:'يُعطى بيوم مختلف عن الميثوتريكسيت.', en:'Given on a different day from the methotrexate.'} },
    { with:'Phenytoin', severity:'serious', note:{ar:'يخفض مستوى الفينيتوين.', en:'Lowers phenytoin levels.'} }
  ],
  contraindications:[{ar:'فقر دم بعوز B12 غير معالج', en:'Untreated B12 deficiency anaemia'}] },

{ sci:'Cholecalciferol', ar:'كولي كالسيفيرول', atc:'A11CC05', form:'capsule', take:['withFood'],
  doses:['1000 IU','5000 IU','50000 IU'],
  notes:{ar:'مع وجبة دسمة — ذائب في الدهن. جرعة الـ 50000 وحدة أسبوعية لا يومية؛ خطأ شائع ومؤذٍ.',
         en:'With a fatty meal — it is fat-soluble. The 50,000 IU capsule is weekly, not daily; the mix-up is common and harmful.'},
  interactions:[
    { with:'Digoxin', severity:'warning', note:{ar:'فرط الكالسيوم يزيد سميّة الديجوكسين.', en:'Hypercalcaemia raises digoxin toxicity.'} },
    { with:'Hydrochlorothiazide', severity:'warning', note:{ar:'خطر فرط كالسيوم.', en:'Risk of hypercalcaemia.'} }
  ],
  contraindications:[
    {ar:'فرط كالسيوم الدم', en:'Hypercalcaemia'},
    {ar:'حصيات كلوية كلسية', en:'Calcium renal stones'}
  ] },

{ sci:'Tamsulosin', ar:'تامسولوسين', atc:'G04CA02', form:'capsule', take:['afterFood'],
  doses:['0.4 mg'],
  notes:{ar:'بعد نفس الوجبة يومياً. الجرعة الأولى قد تسبّب دواراً انتصابياً. يجب إخبار طبيب العيون قبل جراحة الساد.',
         en:'After the same meal each day. The first dose can cause postural dizziness. The eye surgeon must be told before cataract surgery.'},
  interactions:[
    { with:'Sildenafil', severity:'serious', note:{ar:'هبوط ضغط انتصابي.', en:'Postural hypotension.'} },
    { with:'Clarithromycin', severity:'serious', note:{ar:'يرفع التامسولوسين وهبوط الضغط.', en:'Raises tamsulosin and drops blood pressure.'} }
  ],
  contraindications:[
    {ar:'هبوط ضغط انتصابي سابق', en:'Previous postural hypotension'},
    {ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}
  ] },

/* ---------- Named interaction partners ----------
   These nineteen were already named by the hundred above as the other half of
   an interaction, without being in the reference themselves. A checker that
   warns about methotrexate eight times and then cannot be shown methotrexate
   is incoherent, so they are here.

   Contrast media stays out deliberately, and is the best argument for the
   coverage line: it is named by metformin, it is not a dispensed medicine, and
   no formulary will ever contain it. The screen has to be able to say "checked
   4 of 5" rather than pretend. */

{ sci:'Methotrexate', ar:'ميثوتريكسيت', atc:'L04AX03', form:'tablet', take:['weekly'],
  doses:['2.5 mg','10 mg','50 mg/2 mL'],
  notes:{ar:'ONCE A WEEK — الجرعة اليومية خطأ قاتل ومسجّل. حمض الفوليك بيوم مختلف. اذكر يوم الأسبوع بصوت عالٍ عند الصرف.',
         en:'ONCE A WEEK. A daily dose is a documented fatal error. Folic acid on a different day. Say the day of the week out loud when you hand it over.'},
  interactions:[
    { with:'Trimethoprim/Sulfamethoxazole', severity:'critical', note:{ar:'تثبيط نقي شديد — ممنوع الجمع.', en:'Severe marrow suppression — the combination is contraindicated.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'يقلّل طرح الميثوتريكسيت ويزيد سميّته.', en:'Reduces methotrexate clearance, raising toxicity.'} },
    { with:'Amoxicillin', severity:'serious', note:{ar:'يقلّل الطرح الكلوي.', en:'Reduces renal clearance.'} },
    { with:'Omeprazole', severity:'warning', note:{ar:'يؤخّر الطرح مع الجرعات العالية.', en:'Delays clearance at high doses.'} }
  ],
  contraindications:[
    {ar:'الحمل والإرضاع', en:'Pregnancy and breastfeeding'},
    {ar:'قصور كبدي أو كلوي شديد', en:'Severe hepatic or renal impairment'},
    {ar:'تثبيط نقي العظم', en:'Bone marrow suppression'},
    {ar:'إنتان فعّال', en:'Active infection'}
  ] },

{ sci:'Lithium', ar:'ليثيوم', atc:'N05AN01', form:'tablet',
  doses:['300 mg','400 mg MR'],
  notes:{ar:'هامش علاجي ضيّق جداً. سوائل وملح ثابتان — التعرّق والإسهال والحمية قليلة الملح ترفع المستوى. الرعاش والإسهال والتخليط علامات تسمّم.',
         en:'A very narrow window. Steady fluid and salt — sweating, diarrhoea or a low-salt diet push levels up. Tremor, diarrhoea and confusion are toxicity.'},
  interactions:[
    { with:'Hydrochlorothiazide', severity:'serious', note:{ar:'يرفع الليثيوم إلى حدّ السميّة.', en:'Raises lithium to toxic levels.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'مضادات الالتهاب ترفع الليثيوم.', en:'NSAIDs raise lithium.'} },
    { with:'Lisinopril', severity:'serious', note:{ar:'يرفع الليثيوم.', en:'Raises lithium.'} },
    { with:'Metronidazole', severity:'serious', note:{ar:'يرفع الليثيوم.', en:'Raises lithium.'} }
  ],
  contraindications:[
    {ar:'قصور كلوي شديد', en:'Severe renal impairment'},
    {ar:'داء أديسون', en:'Addison’s disease'},
    {ar:'اضطراب توازن الصوديوم', en:'Disturbed sodium balance'}
  ] },

{ sci:'Verapamil', ar:'فيراباميل', atc:'C08DA01', form:'tablet',
  doses:['40 mg','80 mg','120 mg','240 mg SR'],
  notes:{ar:'الإمساك أشيع أعراضه بفارق كبير. لا يُجمع مع حاصرات بيتا إلا بقرار اختصاصي.',
         en:'Constipation is by far its commonest side effect. Not combined with a beta blocker except on a specialist’s decision.'},
  interactions:[
    { with:'Bisoprolol', severity:'critical', note:{ar:'بطء قلب شديد وحصار — يُتجنّب الجمع.', en:'Severe bradycardia and heart block — avoid the combination.'} },
    { with:'Atenolol', severity:'critical', note:{ar:'بطء قلب شديد وحصار.', en:'Severe bradycardia and heart block.'} },
    { with:'Digoxin', severity:'serious', note:{ar:'يرفع الديجوكسين.', en:'Raises digoxin.'} },
    { with:'Simvastatin', severity:'serious', note:{ar:'خطر اعتلال عضلي — يُحدّ بـ 20 ملغ.', en:'Myopathy risk — limit to 20 mg.'} }
  ],
  contraindications:[
    {ar:'قصور قلب غير معاوَض', en:'Decompensated heart failure'},
    {ar:'حصار قلبي من الدرجة الثانية أو الثالثة', en:'Second- or third-degree heart block'},
    {ar:'هبوط ضغط شديد', en:'Severe hypotension'}
  ] },

{ sci:'Calcium carbonate', ar:'كربونات الكالسيوم', atc:'A02AC01', form:'tablet', take:['withFood'],
  doses:['500 mg','600 mg','1250 mg'],
  notes:{ar:'يُباعد عن الحديد والليفوثيروكسين والكينولونات والتتراسيكلينات — يمنع امتصاصها. جرعة واحدة لا تزيد عن 600 ملغ عنصري.',
         en:'Spaced away from iron, levothyroxine, quinolones and tetracyclines — it blocks all of them. No more than 600 mg elemental in one dose.'},
  interactions:[
    { with:'Levothyroxine', severity:'serious', note:{ar:'يمنع الامتصاص — باعد أربع ساعات.', en:'Blocks absorption — space by four hours.'} },
    { with:'Ciprofloxacin', severity:'serious', note:{ar:'يرتبط به ويفقد الامتصاص.', en:'Chelates and loses absorption.'} },
    { with:'Doxycycline', severity:'serious', note:{ar:'يرتبط به ويفقد الامتصاص.', en:'Chelates and loses absorption.'} },
    { with:'Ferrous sulfate', severity:'warning', note:{ar:'يقلّل امتصاص الحديد — باعد ساعتين.', en:'Reduces iron absorption — space by two hours.'} }
  ],
  contraindications:[
    {ar:'فرط كالسيوم الدم', en:'Hypercalcaemia'},
    {ar:'حصيات كلوية كلسية', en:'Calcium renal stones'}
  ] },

{ sci:'Sildenafil', ar:'سيلدينافيل', atc:'G04BE03', form:'tablet',
  doses:['25 mg','50 mg','100 mg'],
  notes:{ar:'ممنوع تماماً مع أي نترات — اسأل عن بخاخ تحت اللسان تحديداً، فكثير من المرضى لا يعدّونه دواءً.',
         en:'Absolutely not with any nitrate — ask specifically about a sublingual spray, which many patients do not count as a medicine.'},
  interactions:[
    { with:'Glyceryl trinitrate', severity:'critical', note:{ar:'هبوط ضغط قاتل — ممنوع الجمع.', en:'Fatal hypotension — the combination is contraindicated.'} },
    { with:'Isosorbide dinitrate', severity:'critical', note:{ar:'هبوط ضغط قاتل — ممنوع الجمع.', en:'Fatal hypotension — the combination is contraindicated.'} },
    { with:'Tamsulosin', severity:'serious', note:{ar:'هبوط ضغط انتصابي.', en:'Postural hypotension.'} },
    { with:'Clarithromycin', severity:'serious', note:{ar:'يرفع السيلدينافيل كثيراً.', en:'Substantially raises sildenafil.'} }
  ],
  contraindications:[
    {ar:'الاستعمال المتزامن مع النترات', en:'Concurrent nitrate use'},
    {ar:'احتشاء أو سكتة حديثة', en:'Recent infarction or stroke'},
    {ar:'هبوط ضغط شديد', en:'Severe hypotension'}
  ] },

{ sci:'Potassium chloride', ar:'كلوريد البوتاسيوم', atc:'A12BA01', form:'tablet', take:['afterFood'],
  doses:['600 mg MR','20 mEq sachet'],
  notes:{ar:'مع الطعام وكوب ماء كامل وبقاء منتصباً — يقرّح المريء. يُبلع كاملاً دون سحق.',
         en:'With food, a full glass, and sitting upright — it ulcerates the oesophagus. Swallow whole, never crushed.'},
  interactions:[
    { with:'Spironolactone', severity:'critical', note:{ar:'فرط بوتاسيوم مهدّد للحياة.', en:'Life-threatening hyperkalaemia.'} },
    { with:'Lisinopril', severity:'serious', note:{ar:'فرط بوتاسيوم.', en:'Hyperkalaemia.'} },
    { with:'Losartan', severity:'serious', note:{ar:'فرط بوتاسيوم.', en:'Hyperkalaemia.'} }
  ],
  contraindications:[
    {ar:'فرط بوتاسيوم الدم', en:'Hyperkalaemia'},
    {ar:'قصور كلوي شديد', en:'Severe renal impairment'},
    {ar:'داء أديسون غير معالج', en:'Untreated Addison’s disease'}
  ] },

{ sci:'Tizanidine', ar:'تيزانيدين', atc:'M03BX02', form:'tablet',
  doses:['2 mg','4 mg'],
  notes:{ar:'منوّم ويخفض الضغط. يُرفع ويُخفض تدريجياً.', en:'Sedating and lowers blood pressure. Titrated up and down, never stopped at once.'},
  interactions:[
    { with:'Ciprofloxacin', severity:'critical', note:{ar:'هبوط ضغط شديد ونعاس — ممنوع الجمع.', en:'Severe hypotension and sedation — the combination is contraindicated.'} },
    { with:'Fluvoxamine', severity:'critical', note:{ar:'ممنوع الجمع.', en:'The combination is contraindicated.'} }
  ],
  contraindications:[
    {ar:'الاستعمال المتزامن مع سيبروفلوكساسين', en:'Concurrent ciprofloxacin'},
    {ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}
  ] },

{ sci:'Theophylline', ar:'ثيوفيلين', atc:'R03DA04', form:'tablet',
  doses:['200 mg MR','300 mg MR','400 mg MR'],
  notes:{ar:'هامش علاجي ضيّق. لا يُبدّل بين الشركات — الشكل الممتد يختلف في التحرّر. الغثيان والخفقان علامات تجاوز.',
         en:'A narrow window. Do not switch brands — modified-release profiles differ. Nausea and palpitations mean the level is too high.'},
  interactions:[
    { with:'Ciprofloxacin', severity:'serious', note:{ar:'يرفع الثيوفيلين إلى حدّ السميّة.', en:'Raises theophylline to toxic levels.'} },
    { with:'Clarithromycin', severity:'serious', note:{ar:'يرفع الثيوفيلين.', en:'Raises theophylline.'} },
    { with:'Carbamazepine', severity:'warning', note:{ar:'يخفض الثيوفيلين ويفقد السيطرة.', en:'Lowers theophylline and loses control.'} }
  ],
  contraindications:[
    {ar:'اضطراب نظم قلبي غير مضبوط', en:'Uncontrolled arrhythmia'},
    {ar:'الصرع غير المضبوط', en:'Uncontrolled epilepsy'}
  ] },

{ sci:'Isotretinoin', ar:'أيزوتريتينوين', atc:'D10BA01', form:'capsule', take:['withFood'],
  doses:['10 mg','20 mg'],
  notes:{ar:'مشوّه للجنين بدرجة قصوى — منع حمل موثّق قبل وأثناء وشهراً بعد العلاج. مع وجبة دسمة. لا تبرّع بالدم أثناء العلاج.',
         en:'Extremely teratogenic — documented contraception before, during and for a month after. With a fatty meal. No blood donation during treatment.'},
  interactions:[
    { with:'Doxycycline', severity:'serious', note:{ar:'ارتفاع ضغط داخل القحف — يُتجنّب الجمع.', en:'Raised intracranial pressure — avoid the combination.'} },
    { with:'Cholecalciferol', severity:'warning', note:{ar:'خطر فرط الفيتامين A.', en:'Risk of hypervitaminosis A.'} }
  ],
  contraindications:[
    {ar:'الحمل والإرضاع', en:'Pregnancy and breastfeeding'},
    {ar:'قصور كبدي', en:'Hepatic impairment'},
    {ar:'فرط شحوم الدم الشديد', en:'Severe hyperlipidaemia'}
  ] },

{ sci:'Erythromycin', ar:'إريثرومايسين', atc:'J01FA01', form:'tablet',
  doses:['125 mg/5 mL','250 mg','500 mg'],
  notes:{ar:'الاضطراب المعوي أشيع أسباب التوقف. مثبّط إنزيمي مثل الكلاريثرومايسين — راجع قائمة المريض.',
         en:'GI upset is the usual reason people stop. An enzyme inhibitor like clarithromycin — read the patient’s list.'},
  interactions:[
    { with:'Simvastatin', severity:'critical', note:{ar:'انحلال ربيدات — يُوقف الستاتين.', en:'Rhabdomyolysis — hold the statin.'} },
    { with:'Warfarin', severity:'serious', note:{ar:'يرفع INR.', en:'Raises INR.'} },
    { with:'Amiodarone', severity:'critical', note:{ar:'إطالة QT — يُتجنّب الجمع.', en:'QT prolongation — avoid the combination.'} },
    { with:'Clindamycin', severity:'warning', note:{ar:'تضاد في آلية العمل.', en:'Antagonistic mechanisms.'} }
  ],
  contraindications:[
    {ar:'إطالة QT معروفة', en:'Known QT prolongation'},
    {ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}
  ] },

{ sci:'Gentamicin', ar:'جنتامايسين', atc:'J01GB03', form:'injection',
  doses:['40 mg/mL','80 mg/2 mL','0.3% drops'],
  notes:{ar:'سميّة أذنية وكلوية تعتمد على المستوى — يستوجب قياس المستويات ووظيفة الكلية. الطنين وعدم التوازن علامات إنذار.',
         en:'Level-dependent ear and kidney toxicity — needs level and renal monitoring. Tinnitus and unsteadiness are the warning signs.'},
  interactions:[
    { with:'Furosemide', severity:'serious', note:{ar:'سميّة أذنية وكلوية مضاعفة.', en:'Compounded ear and kidney toxicity.'} },
    { with:'Ibuprofen', severity:'serious', note:{ar:'خطر كلوي مضاعف.', en:'Compounded renal risk.'} }
  ],
  contraindications:[
    {ar:'الوهن العضلي الوبيل', en:'Myasthenia gravis'},
    {ar:'الحمل', en:'Pregnancy'},
    {ar:'اضطراب سمعي سابق', en:'Pre-existing hearing loss'}
  ] },

{ sci:'Levodopa', ar:'ليفودوبا', atc:'N04BA01', form:'tablet',
  doses:['100 mg','250 mg'],
  notes:{ar:'التوقيت أهم من الجرعة — التأخير عشرين دقيقة يُحدث فرقاً ملموساً. يُباعد عن الوجبات الغنية بالبروتين.',
         en:'Timing matters more than dose — twenty minutes late is felt. Kept away from protein-heavy meals.'},
  interactions:[
    { with:'Metoclopramide', severity:'serious', note:{ar:'تضاد متبادل في الأثر.', en:'Each one blocks the other.'} },
    { with:'Haloperidol', severity:'serious', note:{ar:'يلغي أثر الليفودوبا.', en:'Cancels levodopa’s effect.'} },
    { with:'Ferrous sulfate', severity:'warning', note:{ar:'يقلّل الامتصاص — باعد ساعتين.', en:'Reduces absorption — space by two hours.'} }
  ],
  contraindications:[
    {ar:'الزرق ضيّق الزاوية', en:'Angle-closure glaucoma'},
    {ar:'ميلانوما مشتبهة', en:'Suspected melanoma'},
    {ar:'تناول مثبطات MAO غير الانتقائية', en:'Non-selective MAO inhibitors'}
  ] },

{ sci:'Haloperidol', ar:'هالوبيريدول', atc:'N05AD01', form:'tablet',
  doses:['0.5 mg','5 mg','5 mg/mL'],
  notes:{ar:'أعراض خارج هرمية شائعة ومبكّرة. إطالة QT. تصلّب مع حمّى وتخليط: متلازمة خبيثة — إسعاف.',
         en:'Extrapyramidal effects are common and early. Prolongs QT. Rigidity with fever and confusion is neuroleptic malignant syndrome — emergency.'},
  interactions:[
    { with:'Metoclopramide', severity:'serious', note:{ar:'أعراض خارج هرمية مضاعفة.', en:'Compounded extrapyramidal effects.'} },
    { with:'Amiodarone', severity:'critical', note:{ar:'إطالة QT — يُتجنّب الجمع.', en:'QT prolongation — avoid the combination.'} },
    { with:'Escitalopram', severity:'serious', note:{ar:'إطالة QT مضاعفة.', en:'Additive QT prolongation.'} }
  ],
  contraindications:[
    {ar:'داء باركنسون', en:'Parkinson’s disease'},
    {ar:'إطالة QT معروفة', en:'Known QT prolongation'},
    {ar:'تثبيط الجهاز العصبي المركزي', en:'CNS depression'}
  ] },

{ sci:'Phenobarbital', ar:'فينوباربيتال', atc:'N03AA02', form:'tablet',
  doses:['15 mg','30 mg','60 mg','100 mg'],
  notes:{ar:'محرّض إنزيمي قوي يُضعف حبوب منع الحمل وكثيراً غيرها. لا يُوقف فجأة — خطر حالة صرعية.',
         en:'A powerful enzyme inducer — it undermines the contraceptive pill and much else. Never stopped abruptly: status epilepticus.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'يخفض INR ويفقد الحماية.', en:'Lowers INR and loses the protection.'} },
    { with:'Montelukast', severity:'warning', note:{ar:'يقلّل مستوى المونتيلوكاست.', en:'Lowers montelukast levels.'} },
    { with:'Diazepam', severity:'serious', note:{ar:'تثبيط تنفسي مضاعف.', en:'Compounded respiratory depression.'} }
  ],
  contraindications:[
    {ar:'بورفيريا', en:'Porphyria'},
    {ar:'قصور تنفسي شديد', en:'Severe respiratory insufficiency'},
    {ar:'قصور كبدي شديد', en:'Severe hepatic impairment'}
  ] },

{ sci:'Lamotrigine', ar:'لاموتريجين', atc:'N03AX09', form:'tablet',
  doses:['25 mg','50 mg','100 mg','200 mg'],
  notes:{ar:'يُرفع ببطء شديد — التسريع هو سبب الطفح الخطير. أي طفح جلدي يعني التوقف والمراجعة فوراً.',
         en:'Titrated very slowly — going faster is what causes the serious rash. Any rash means stop and be seen the same day.'},
  interactions:[
    { with:'Sodium valproate', severity:'critical', note:{ar:'يضاعف اللاموتريجين وخطر الطفح الشديد — تُنصّف الجرعة.', en:'Doubles lamotrigine and the risk of a severe rash — halve the dose.'} },
    { with:'Carbamazepine', severity:'serious', note:{ar:'يخفض اللاموتريجين ويفقد السيطرة.', en:'Lowers lamotrigine and loses control.'} }
  ],
  contraindications:[{ar:'طفح جلدي شديد سابق مع اللاموتريجين', en:'Previous severe rash with lamotrigine'}] },

{ sci:'Azathioprine', ar:'آزاثيوبرين', atc:'L04AX01', form:'tablet', take:['afterFood'],
  doses:['25 mg','50 mg'],
  notes:{ar:'يستوجب تعداد دم منتظماً. أي حمّى أو التهاب حلق يستوجب فحص التعداد قبل أي شيء آخر.',
         en:'Needs regular blood counts. Any fever or sore throat means check the count before anything else.'},
  interactions:[
    { with:'Allopurinol', severity:'critical', note:{ar:'تثبيط نقي مهدّد للحياة — تُخفّض الجرعة إلى الربع أو يُتجنّب الجمع.', en:'Life-threatening marrow suppression — quarter the dose or avoid the combination.'} },
    { with:'Trimethoprim/Sulfamethoxazole', severity:'serious', note:{ar:'تثبيط نقي مضاعف.', en:'Compounded marrow suppression.'} },
    { with:'Warfarin', severity:'warning', note:{ar:'يقلّل أثر الوارفارين.', en:'Reduces warfarin’s effect.'} }
  ],
  contraindications:[
    {ar:'الحمل', en:'Pregnancy'},
    {ar:'تثبيط نقي العظم', en:'Bone marrow suppression'},
    {ar:'إنتان فعّال', en:'Active infection'}
  ] },

{ sci:'Phenytoin', ar:'فينيتوين', atc:'N03AB02', form:'capsule',
  doses:['30 mg/5 mL','50 mg','100 mg'],
  notes:{ar:'حرائك غير خطية — زيادة صغيرة في الجرعة ترفع المستوى كثيراً. تضخّم اللثة شائع: العناية بالفم من يوم البدء.',
         en:'Non-linear kinetics — a small dose rise moves the level a long way. Gum overgrowth is common: mouth care from day one.'},
  interactions:[
    { with:'Warfarin', severity:'serious', note:{ar:'تغيّر غير متوقّع في INR في الاتجاهين.', en:'Unpredictable INR movement in both directions.'} },
    { with:'Folic acid', severity:'serious', note:{ar:'يخفض مستوى الفينيتوين.', en:'Lowers phenytoin levels.'} },
    { with:'Omeprazole', severity:'warning', note:{ar:'يرفع الفينيتوين.', en:'Raises phenytoin.'} },
    { with:'Trimethoprim/Sulfamethoxazole', severity:'serious', note:{ar:'يرفع الفينيتوين إلى حدّ السميّة.', en:'Raises phenytoin to toxic levels.'} }
  ],
  contraindications:[
    {ar:'بطء قلب جيبي أو حصار قلبي', en:'Sinus bradycardia or heart block'},
    {ar:'بورفيريا', en:'Porphyria'}
  ] },

{ sci:'Magnesium trisilicate', ar:'ثلاثي سيليكات المغنيسيوم', atc:'A02AA05', form:'tablet',
  doses:['250 mg','500 mg'],
  notes:{ar:'مضاد حموضة سريع وقصير الأثر. يُباعد ساعتين عن أي دواء آخر — يقلّل امتصاص الكثير منها.',
         en:'A fast, short-lived antacid. Two hours away from everything else — it reduces the absorption of a lot of things.'},
  interactions:[
    { with:'Ciprofloxacin', severity:'serious', note:{ar:'يمنع الامتصاص.', en:'Blocks absorption.'} },
    { with:'Doxycycline', severity:'serious', note:{ar:'يمنع الامتصاص.', en:'Blocks absorption.'} },
    { with:'Nitrofurantoin', severity:'warning', note:{ar:'يقلّل الامتصاص.', en:'Reduces absorption.'} },
    { with:'Fexofenadine', severity:'warning', note:{ar:'يقلّل الامتصاص — باعد ساعتين.', en:'Reduces absorption — space by two hours.'} }
  ],
  contraindications:[{ar:'قصور كلوي شديد', en:'Severe renal impairment'}] },

{ sci:'Calcium gluconate', ar:'غلوكونات الكالسيوم', atc:'A12AA03', form:'injection',
  doses:['10% 10 mL'],
  notes:{ar:'وريدي بطيء. لا يُمزج مع السيفترياكسون أبداً. التسرّب خارج الوريد يسبّب نخراً نسيجياً.',
         en:'Slow IV. Never mixed with ceftriaxone. Extravasation causes tissue necrosis.'},
  interactions:[
    { with:'Ceftriaxone', severity:'critical', note:{ar:'ترسّب في الرئة والكلية — ممنوع الجمع وريدياً.', en:'Precipitates in lung and kidney — the IV combination is contraindicated.'} },
    { with:'Digoxin', severity:'serious', note:{ar:'الكالسيوم الوريدي مع الديجوكسين يسبّب اضطراب نظم.', en:'IV calcium with digoxin causes arrhythmia.'} }
  ],
  contraindications:[
    {ar:'فرط كالسيوم الدم', en:'Hypercalcaemia'},
    {ar:'الاستعمال الوريدي المتزامن مع السيفترياكسون', en:'Concurrent IV ceftriaxone'}
  ] },

];

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
   (J01), oral antidiabetics (A10B), insulins (A10A), nitrates (C01D), and
   antiepileptics (N03A).
   ========================================================================== */

export const DUPLICATE_RULES = [
  { id:'nsaid', codes:['M01A'], severity:'serious',
    label:{ar:'مضادّا التهاب غير ستيرويديين', en:'Two NSAIDs'},
    note:{ar:'يضاعفان خطر القرحة والأذية الكلوية دون أن يضيفا تسكيناً.',
          en:'Doubles the ulcer and kidney risk without adding pain relief.'} },

  { id:'ras', codes:['C09A','C09C'], severity:'serious',
    label:{ar:'حصار مضاعف لجملة الرينين', en:'Dual blockade of the renin system'},
    note:{ar:'مثبّط ACE مع سارتان — أو سارتانان — يرفع خطر الأذية الكلوية وفرط البوتاسيوم بلا فائدة مثبتة.',
          en:'An ACE inhibitor with an ARB — or two ARBs — raises kidney injury and hyperkalaemia with no proven benefit.'} },

  { id:'betablocker', codes:['C07A'], severity:'serious',
    label:{ar:'حاصرا بيتا', en:'Two beta blockers'},
    note:{ar:'بطء قلب وهبوط ضغط مضاعفان.', en:'Compounded bradycardia and hypotension.'} },

  { id:'statin', codes:['C10A'], severity:'serious',
    label:{ar:'ستاتينان', en:'Two statins'},
    note:{ar:'لا أثر إضافي على الشحوم، وخطر اعتلال عضلي مضاعف.',
          en:'No added effect on lipids, and a compounded myopathy risk.'} },

  { id:'ccb', codes:['C08C'], severity:'serious',
    label:{ar:'حاصرا كالسيوم من الفئة نفسها', en:'Two dihydropyridine calcium blockers'},
    note:{ar:'هبوط ضغط ووذمة محيطية مضاعفان.', en:'Compounded hypotension and ankle swelling.'} },

  { id:'benzo', codes:['N05B'], severity:'serious',
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

  { id:'acid', codes:['A02B'], severity:'warning', oftenIntended:true,
    label:{ar:'أكثر من خافض للحموضة', en:'More than one acid suppressant'},
    note:{ar:'مثبّط مضخة نهاراً وحاصر H2 ليلاً نمط مشروع؛ وغالباً ما يكون تكراراً غير مقصود.',
          en:'A proton pump inhibitor by day and an H2 blocker at night is a legitimate pattern; more often it is an unintended duplicate.'} },

  { id:'antihistamine', codes:['R06A'], severity:'warning', oftenIntended:true,
    label:{ar:'مضادّا هيستامين', en:'Two antihistamines'},
    note:{ar:'غير منوّم نهاراً ومنوّم ليلاً نمط شائع ومشروع. تحقّق فقط أنه مقصود.',
          en:'A non-sedating one by day and a sedating one at night is common and legitimate. Just check it is intended.'} }
];
