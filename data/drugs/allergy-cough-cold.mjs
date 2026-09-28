/* Allergy, cough and cold: antihistamines, cough medicines and decongestants,
   and the nose. Most of what the counter sells without a prescription, and
   most of it in combinations — so the questions here are mostly about what
   else the patient is already taking for the same symptoms. Shape: see
   data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Antihistamines ---------- */
{ sci:'Cetirizine', ar:'سيتريزين', atc:'R06AE07', cat:'res.antihistamine', form:'tablet',
  doses:['5 mg', '10 mg', '5 mg/5 mL'], brand:['Zyrtec'],
  notes:{en:'Less sedating than the old antihistamines, but not free of it — the driving warning still applies.',
         ar:'أقل تنويماً من القديمة لكنه ليس خالياً منه — تحذير القيادة يبقى قائماً.'},
  ix:[
    ['Diazepam', W, 'Compounded sedation.', 'تنويم مضاعف.']
  ],
  ci:['renalSevere'],
  ask:['drive', 'childAge'] },

{ sci:'Loratadine', ar:'لوراتادين', atc:'R06AX13', cat:'res.antihistamine', form:'tablet',
  doses:['10 mg', '5 mg/5 mL'], brand:['Clarityne', 'Claritin'],
  notes:{en:'The least sedating of the common antihistamines — the one for a driver or someone on machinery.',
         ar:'الأقل تنويماً بين مضادات الهيستامين الشائعة — الخيار لمن يقود أو يعمل على آلة.'},
  ci:['hepSevere'],
  ask:['childAge'] },

{ sci:'Fexofenadine', ar:'فيكسوفينادين', atc:'R06AX26', cat:'res.antihistamine', form:'tablet',
  doses:['30 mg', '120 mg', '180 mg'], brand:['Telfast', 'Allegra'],
  notes:{en:'Not with fruit juice — it cuts absorption by a third. Water only.',
         ar:'لا يُؤخذ مع عصير الفواكه — يقلّل الامتصاص بالثلث. بماء فقط.'},
  ix:[
    ['Magnesium trisilicate', W, 'Reduces absorption — space by two hours.', 'يقلّل الامتصاص — باعد ساعتين.']
  ],
  ask:['childAge', 'antacids'] },

{ sci:'Chlorphenamine', ar:'كلورفينيرامين', atc:'R06AB04', cat:'res.antihistamine', form:'tablet',
  doses:['4 mg', '2 mg/5 mL', '10 mg/mL'], brand:['Piriton'], aka:['Chlorpheniramine'],
  tags:['sedative', 'anticholinergic'],
  notes:{en:'Frankly sedating — no driving. Useful at night for itch, and the injection is part of anaphylaxis treatment.',
         ar:'منوّم بوضوح — لا قيادة. مفيد ليلاً للحكة، وشكله الحقني جزء من علاج التأق.'},
  ix:[
    ['Amitriptyline', W, 'Compounded anticholinergic effects and sedation.', 'آثار مضادة للكولين وتنويم مضاعف.'],
    ['Diazepam', S, 'Marked sedation.', 'تنويم شديد.']
  ],
  ci:['angleGlaucoma', {en:'Prostatic enlargement with retention', ar:'تضخّم البروستات مع احتباس بول'}],
  ask:['drive', 'childAge', 'prostate'] },

{ sci:'Desloratadine', ar:'ديسلوراتادين', atc:'R06AX27', cat:'res.antihistamine', form:'tablet',
  doses:['5 mg', '0.5 mg/mL syrup'], brand:['Aerius', 'Clarinex'],
  notes:{en:'Once a day. Drowsiness is rare. The syrup is measured with the syringe or cup provided, by age.',
         ar:'مرة واحدة يومياً. النعاس نادر. يُقاس الشراب بالمحقنة أو الكوب المرفق حسب العمر.'},
  ask:['childAge'] },

{ sci:'Levocetirizine', ar:'ليفوسيتيريزين', atc:'R06AE09', cat:'res.antihistamine', form:'tablet',
  doses:['5 mg', '0.5 mg/mL syrup'], brand:['Xyzal'],
  take:['evening'],
  notes:{en:'Once a day — in the evening if it makes you drowsy. Avoid alcohol with it.',
         ar:'مرة واحدة يومياً — مساءً إن سبّب لك النعاس. تجنّب الكحول معه.'},
  ix:[
    ['Alcohol', W, 'More drowsiness in some people.', 'نعاس أكثر عند بعض الناس.']
  ],
  ci:[{en:'End-stage kidney disease', ar:'مرض كلوي في مراحله الأخيرة'}],
  ask:['drive', 'childAge', 'kidney'] },

{ sci:'Rupatadine', ar:'روباتادين', atc:'R06AX28', cat:'res.antihistamine', form:'tablet',
  doses:['10 mg', '1 mg/mL solution'], brand:['Rupafin'],
  tags:['sub3a4'],
  notes:{en:'Once a day. No grapefruit juice. Drowsiness is uncommon.',
         ar:'مرة واحدة يومياً. لا عصير جريب فروت. النعاس غير شائع.'},
  ix:[
    ['Grapefruit juice', S, 'Raises rupatadine several-fold — none with it.', 'يرفع الروباتادين أضعافاً — لا يُشرب معه.']
  ],
  ask:['childAge', 'drive'] },

{ sci:'Bilastine', ar:'بيلاستين', atc:'R06AX29', cat:'res.antihistamine', form:'tablet',
  doses:['20 mg', '10 mg orodispersible', '2.5 mg/mL solution'], brand:['Bilaxten'],
  take:['emptyStomach'],
  notes:{en:'On an empty stomach — an hour before or two hours after food or fruit juice, which block its absorption.',
         ar:'على معدة فارغة — قبل الطعام أو عصير الفاكهة بساعة أو بعدهما بساعتين، لأنهما يمنعان امتصاصه.'},
  ix:[
    ['Grapefruit juice', W, 'Grapefruit and other fruit juices lower its absorption — take it an hour before or two hours after food or juice.', 'الغريب فروت وعصائر الفاكهة الأخرى تقلّل امتصاصه — خذه قبل الطعام أو العصير بساعة أو بعدهما بساعتين.']
  ],
  ask:['childAge'] },

{ sci:'Ebastine', ar:'إيباستين', atc:'R06AX22', cat:'res.antihistamine', form:'tablet',
  doses:['10 mg', '20 mg', '1 mg/mL syrup'], brand:['Kestine'],
  tags:['qtPossible', 'sub3a4'],
  notes:{en:'Once a day. Rarely drowsy. Tell us about any heart-rhythm problem.',
         ar:'مرة واحدة يومياً. نادراً ما يسبّب النعاس. أخبرنا عن أي مشكلة في نظم القلب.'},
  ask:['rhythm', 'childAge'] },

{ sci:'Diphenhydramine', ar:'ديفينهيدرامين', atc:'R06AA02', cat:'res.antihistamine', form:'syrup',
  doses:['12.5 mg/5 mL syrup', '25 mg', '50 mg', '50 mg/mL injection'], brand:['Benadryl'],
  tags:['sedative', 'anticholinergic'],
  notes:{en:'Very drowsy — no driving. Not a cough or sleep remedy for children under six. It is an ingredient of many cough syrups, so check for a double dose.',
         ar:'منوّم جداً — لا قيادة. لا يُستعمل كدواء للسعال أو النوم للأطفال دون السادسة. يدخل في تركيب كثير من أشربة السعال، فانتبه للجرعة المضاعفة.'},
  ci:['angleGlaucoma', 'retention', 'under2'],
  ask:['drive', 'childAge', 'sameIngredient'] },

{ sci:'Promethazine', ar:'بروميثازين', atc:'R06AD02', cat:'res.antihistamine', form:'tablet',
  doses:['10 mg', '25 mg', '5 mg/5 mL syrup', '25 mg/mL injection'], brand:['Phenergan'],
  tags:['sedative', 'anticholinergic', 'dopamineBlocker', 'qtPossible'],
  notes:{en:'Strongly sedating. Never for children under two — it can stop their breathing. Used for allergy, nausea and as a night-time sedative.',
         ar:'منوّم بقوة. لا يُعطى أبداً للأطفال دون السنتين — قد يوقف تنفسهم. يُستعمل للحساسية والغثيان وكمنوّم ليلي.'},
  ci:['under2', 'cnsDepression', 'angleGlaucoma'],
  ask:['childAge', 'drive', 'sedatives'] },

{ sci:'Hydroxyzine', ar:'هيدروكسيزين', atc:'N05BB01', cat:'res.antihistamine', form:'tablet',
  doses:['10 mg', '25 mg', '10 mg/5 mL syrup'], brand:['Atarax'],
  tags:['sedative', 'anticholinergic', 'qtPossible'],
  notes:{en:'For itching and anxiety. Drowsy — no driving. The daily dose is capped because of a heart-rhythm risk.',
         ar:'للحكة والقلق. منوّم — لا قيادة. للجرعة اليومية حدّ أعلى بسبب خطر على نظم القلب.'},
  ci:['qt', 'porphyria'],
  ask:['drive', 'rhythm', 'childAge'] },

{ sci:'Cyproheptadine', ar:'سيبروهيبتادين', atc:'R06AX02', cat:'res.antihistamine', form:'tablet',
  doses:['4 mg', '2 mg/5 mL syrup'], brand:['Periactin'],
  tags:['sedative', 'anticholinergic'],
  notes:{en:'A sedating antihistamine, often asked for to boost appetite — which is not what it is licensed for. Not for children under two.',
         ar:'مضاد هيستامين منوّم، يُطلب كثيراً لفتح الشهية — وهذا ليس من استعمالاته المرخّصة. لا يُعطى للأطفال دون السنتين.'},
  ci:['under2', 'angleGlaucoma', 'retention'],
  ask:['childAge', 'drive', 'whatFor'] },

{ sci:'Dexchlorpheniramine', ar:'ديكس كلورفينيرامين', atc:'R06AB02', cat:'res.antihistamine', form:'tablet',
  doses:['2 mg', '2 mg/5 mL syrup', '5 mg/mL injection'], brand:['Polaramine'],
  tags:['sedative', 'anticholinergic'],
  notes:{en:'A sedating antihistamine — no driving. Also found in cough and cold mixtures; check for doubles.',
         ar:'مضاد هيستامين منوّم — لا قيادة. يوجد أيضاً في خلطات السعال والزكام؛ انتبه للتكرار.'},
  ci:['angleGlaucoma', 'retention'],
  ask:['drive', 'childAge', 'prostate'] },

{ sci:'Pheniramine', ar:'فينيرامين', atc:'R06AB05', cat:'res.antihistamine', form:'tablet',
  doses:['22.7 mg', '45.5 mg/2 mL injection', 'with naphazoline, eye drops'], brand:['Avil'],
  tags:['sedative', 'anticholinergic'],
  notes:{en:'A sedating antihistamine for allergy and itching. No driving after a dose; the injection is given slowly.',
         ar:'مضاد هيستامين منوّم للحساسية والحكة. لا قيادة بعد الجرعة؛ والحقنة تُعطى ببطء.'},
  ci:['angleGlaucoma', 'retention'],
  ask:['drive', 'glaucoma', 'childAge'] },

{ sci:'Triprolidine', ar:'تريبروليدين', atc:'R06AX07', cat:'res.antihistamine', form:'tablet',
  doses:['2.5 mg with pseudoephedrine 60 mg', '1.25 mg/5 mL with pseudoephedrine, syrup'], brand:['Actifed'],
  tags:['sedative', 'anticholinergic'],
  notes:{en:'Almost always sold with pseudoephedrine for colds. Drowsiness and a dry mouth are common.',
         ar:'يُباع دائماً تقريباً مع السودوإيفيدرين للزكام. النعاس وجفاف الفم شائعان.'},
  ci:['angleGlaucoma', 'retention'],
  ask:['drive', 'childAge', 'sameIngredient'] },

{ sci:'Dimetindene', ar:'ديميتيندين', atc:'R06AB03', cat:'res.antihistamine', form:'drops',
  doses:['1 mg/mL drops', '0.1% gel', '1 mg tablet'], brand:['Fenistil'],
  tags:['sedative'],
  notes:{en:'Drops for itchy rashes and allergy in children, dosed by weight; the gel soothes insect bites — not on large areas of skin, and keep treated skin out of strong sun.',
         ar:'نقط للطفح المثير للحكة والحساسية عند الأطفال، تُحسب حسب الوزن؛ والهلام يهدّئ لدغات الحشرات — لا يوضع على مساحات جلد واسعة، ولا يُعرّض الجلد المعالج للشمس القوية.'},
  ci:[{en:'Babies under one month (drops)', ar:'الرضّع دون شهر واحد (النقط)'}],
  ask:['childAge', 'drive'] },

{ sci:'Ketotifen', ar:'كيتوتيفين', atc:'R06AX17', cat:'res.antihistamine', form:'syrup',
  doses:['1 mg/5 mL syrup', '1 mg tablet', '0.025% eye drops'], brand:['Zaditen'],
  tags:['sedative'],
  notes:{en:'Taken regularly, it takes several weeks to prevent allergy and wheeze. Drowsiness and a bigger appetite are common. The eye drops are for itchy eyes.',
         ar:'يُؤخذ بانتظام ويحتاج عدة أسابيع ليقي من الحساسية والصفير. النعاس وزيادة الشهية شائعان. قطرة العين للعيون المثيرة للحكة.'},
  ask:['drive', 'childAge'] },

/* ---------- Cough and cold ---------- */
{ sci:'Dextromethorphan', ar:'ديكستروميثورفان', atc:'R05DA09', cat:'res.cough', form:'syrup',
  doses:['15 mg/5 mL', '10 mg'],
  tags:['sero'],
  notes:{en:'Dry cough only — it suppresses the reflex, so not with a productive cough. Abused at high doses.',
         ar:'للسعال الجاف فقط — يُكبت المنعكس، فلا يُعطى مع سعال منتج. يُساء استعماله بجرعات عالية.'},
  ix:[
    ['Fluoxetine', S, 'Serotonin syndrome.', 'متلازمة السيروتونين.'],
    ['Sertraline', S, 'Serotonin syndrome.', 'متلازمة السيروتونين.']
  ],
  ci:['maoi', {en:'Productive cough', ar:'سعال منتج'}],
  ask:['productiveCough', 'antidep', 'childAge'] },

{ sci:'Ambroxol', ar:'أمبروكسول', atc:'R05CB06', cat:'res.cough', form:'syrup',
  doses:['15 mg/5 mL', '30 mg/5 mL', '30 mg'], brand:['Mucosolvan'],
  notes:{en:'A mucolytic — useless without plenty of fluid alongside. Never combined with a cough suppressant.',
         ar:'حالّ للقشع — مع سوائل وفيرة وإلا لم يفد. لا يُجمع مع كابت للسعال.'},
  ci:['ulcer'],
  ask:['productiveCough', 'childAge', 'preg'] },

{ sci:'Guaifenesin', ar:'غوايفينيسين', atc:'R05CA03', cat:'res.cough', form:'syrup',
  doses:['100 mg/5 mL syrup', '200 mg', '600 mg ER'], brand:['Robitussin', 'Mucinex'], aka:['Glyceryl guaiacolate', 'Guaiphenesin'],
  notes:{en:'Loosens phlegm — drink plenty of water. Many cough syrups also contain an antihistamine or decongestant, so read the whole label.',
         ar:'يُسيّل البلغم — اشرب ماء كثيراً. كثير من أشربة السعال تحتوي أيضاً مضاد هيستامين أو مزيل احتقان، فاقرأ الملصق كله.'},
  ci:['under6'],
  ask:['productiveCough', 'childAge', 'sameIngredient'] },

{ sci:'Bromhexine', ar:'بروميكسين', atc:'R05CB02', cat:'res.cough', form:'syrup',
  doses:['4 mg/5 mL syrup', '8 mg tablet', '2 mg/mL injection'], brand:['Bisolvon'],
  notes:{en:'Loosens phlegm; it takes a few days to help. Mild stomach upset can occur.',
         ar:'يُسيّل البلغم؛ ويحتاج بضعة أيام ليفيد. قد يحدث اضطراب خفيف في المعدة.'},
  ask:['productiveCough', 'childAge', 'ulcer'] },

{ sci:'Carbocisteine', ar:'كاربوسيستين', atc:'R05CB03', cat:'res.cough', form:'syrup',
  doses:['250 mg/5 mL syrup', '375 mg capsule'], brand:['Mucodyne', 'Rhinathiol'],
  notes:{en:'Thins phlegm; long courses are used in COPD. It can irritate the stomach lining.',
         ar:'يُرقّق البلغم؛ ويُستعمل لفترات طويلة في الانسداد الرئوي. قد يهيّج بطانة المعدة.'},
  ci:['ulcer'],
  ask:['productiveCough', 'ulcer', 'childAge'] },

{ sci:'Acetylcysteine', ar:'أسيتيل سيستئين', atc:'R05CB01', cat:'res.cough', form:'sachet',
  doses:['200 mg sachet', '600 mg effervescent', '100 mg/mL solution', '200 mg/mL injection (antidote)'], brand:['Fluimucil', 'ACC', 'Parvolex'], aka:['N-acetylcysteine', 'NAC'],
  notes:{en:'As a mucolytic, dissolve the sachet or effervescent tablet in water; a faint sulphur smell is normal. The injection is the antidote to paracetamol overdose, given in hospital.',
         ar:'كمُسيّل للبلغم، يُذاب الكيس أو القرص الفوّار في الماء؛ ورائحة الكبريت الخفيفة طبيعية. الحقنة هي ترياق الجرعة الزائدة من الباراسيتامول، وتُعطى في المستشفى.'},
  ix:[
    ['Glyceryl trinitrate', W, 'Can deepen the headache and fall in blood pressure from nitrates.', 'قد يزيد صداع النترات وهبوط الضغط.'],
    ['Activated charcoal', W, 'Charcoal binds acetylcysteine taken by mouth.', 'الفحم يربط الأسيتيل سيستئين المأخوذ بالفم.']
  ],
  ask:['productiveCough', 'asthma', 'childAge'] },

{ sci:'Erdosteine', ar:'إردوستئين', atc:'R05CB15', cat:'res.cough', form:'capsule',
  doses:['300 mg', '175 mg/5 mL suspension'], brand:['Erdotin'],
  notes:{en:'Thins phlegm, usually twice a day. Mild stomach upset is uncommon.',
         ar:'يُرقّق البلغم، عادة مرتين يومياً. اضطراب المعدة الخفيف غير شائع.'},
  ci:['hepSevere'],
  ask:['productiveCough', 'childAge'] },

{ sci:'Butamirate', ar:'بوتاميرات', atc:'R05DB13', cat:'res.cough', form:'syrup',
  doses:['7.5 mg/5 mL syrup', '5 mg/mL drops', '50 mg SR tablet'], brand:['Sinecod'],
  notes:{en:'For a dry, irritating cough only — not together with a phlegm-loosening medicine. Drowsiness or nausea occasionally.',
         ar:'للسعال الجاف المزعج فقط — لا يُجمع مع مُسيّل للبلغم. قد يسبّب أحياناً نعاساً أو غثياناً.'},
  ask:['productiveCough', 'childAge'] },

{ sci:'Levodropropizine', ar:'ليفودروبروبيزين', atc:'R05DB27', cat:'res.cough', form:'syrup',
  doses:['30 mg/5 mL syrup', '60 mg tablet'], brand:['Levopront'],
  notes:{en:'For a dry cough. It rarely causes drowsiness. Not with a phlegm-loosening medicine.',
         ar:'للسعال الجاف. نادراً ما يسبّب النعاس. لا يُجمع مع مُسيّل للبلغم.'},
  ix:[
    ['#sedative', W, 'More drowsiness.', 'نعاس أكثر.']
  ],
  ci:['under2', 'hepSevere'],
  ask:['productiveCough', 'childAge'] },

{ sci:'Ammonium chloride', ar:'كلوريد الأمونيوم', atc:'R05CA04', cat:'res.cough', form:'syrup',
  doses:['with diphenhydramine or chlorphenamine, syrup'],
  notes:{en:'An old expectorant found in cough syrups; the other ingredients matter more — check what else the syrup contains.',
         ar:'مقشّع قديم يوجد في أشربة السعال؛ والمكوّنات الأخرى أهم — تحقّق مما يحتويه الشراب أيضاً.'},
  ci:['hepSevere', 'renalSevere'],
  ask:['sameIngredient', 'childAge'] },

{ sci:'Pseudoephedrine', ar:'سودوإيفيدرين', atc:'R01BA02', cat:'res.cough', form:'tablet',
  doses:['60 mg', '30 mg/5 mL syrup', 'with antihistamines or paracetamol'], brand:['Sudafed'],
  tags:['sympathomimetic'],
  notes:{en:'A decongestant for a few days only. It raises blood pressure and heart rate and can keep you awake. A precursor chemical: sales are recorded.',
         ar:'مزيل احتقان لأيام قليلة فقط. يرفع الضغط وسرعة القلب وقد يسبّب الأرق. مادة سليفة: تُسجّل مبيعاته.'},
  ci:['uncontrolledHtn', 'ihd', 'maoi', 'under6'],
  ask:['bp', 'heart', 'maoi'] },

/* ---------- Nose ---------- */
{ sci:'Xylometazoline', ar:'زايلوميتازولين', atc:'R01AA07', cat:'res.nasal', form:'spray',
  doses:['0.05%', '0.1%'], brand:['Otrivin'],
  tags:['sympathomimetic'],
  notes:{en:'Five days maximum — longer causes a rebound congestion that is hard to undo.',
         ar:'خمسة أيام كحدّ أقصى — الاستعمال الأطول يسبّب احتقاناً ارتدادياً يصعب علاجه.'},
  ci:[{en:'After trans-sphenoidal surgery', ar:'بعد جراحة عبر الأنف الوتدي'}, 'angleGlaucoma', 'under2'],
  ask:['useLength', 'childAge', 'bp'] },

{ sci:'Oxymetazoline', ar:'أوكسي ميتازولين', atc:'R01AA05', cat:'res.nasal', form:'spray',
  doses:['0.05% nasal spray', '0.025% children', '0.01% infant drops'], brand:['Afrin', 'Nasivin'],
  tags:['sympathomimetic'],
  notes:{en:'No more than 5–7 days — longer use causes a rebound blocked nose. Use the strength made for the child’s age.',
         ar:'لا يتجاوز 5–7 أيام — الاستعمال الأطول يسبّب انسداداً ارتدادياً. استعمل التركيز المخصّص لعمر الطفل.'},
  ask:['useLength', 'childAge', 'bp'] },

{ sci:'Naphazoline', ar:'نافازولين', atc:'R01AA08', cat:'res.nasal', form:'drops',
  doses:['0.05% nasal drops', '0.1%', 'with pheniramine, eye drops'], brand:['Privine', 'Naphcon-A'],
  tags:['sympathomimetic'],
  notes:{en:'For a blocked nose or red eyes, for a few days only — longer use causes rebound. Not for infants.',
         ar:'لانسداد الأنف أو احمرار العين، لأيام قليلة فقط — الاستعمال الأطول يسبّب ارتداداً. لا يُستعمل للرضّع.'},
  ci:['angleGlaucoma', 'under2'],
  ask:['useLength', 'childAge', 'glaucoma'] },

{ sci:'Phenylephrine', ar:'فينيليفرين', atc:'R01BA03', cat:'res.nasal', form:'tablet',
  doses:['in cold remedies', '0.25% nasal drops', '2.5% and 10% eye drops', '10 mg/mL injection'], brand:['Neo-Synephrine'],
  tags:['sympathomimetic'],
  notes:{en:'The decongestant in many cold remedies; it can raise blood pressure. The eye drops widen the pupil for eye examinations.',
         ar:'مزيل الاحتقان في كثير من أدوية الزكام؛ قد يرفع الضغط. قطرة العين توسّع الحدقة لفحص العين.'},
  ci:['uncontrolledHtn', 'maoi'],
  ask:['bp', 'heart', 'maoi'] },

{ sci:'Azelastine', ar:'أزيلاستين', atc:'R01AC03', cat:'res.nasal', form:'spray',
  doses:['0.1% nasal spray', '0.05% eye drops', 'with fluticasone, nasal spray'], brand:['Allergodil', 'Dymista'],
  notes:{en:'A bitter taste after spraying is common — tilt the head forward, not back. It can cause mild drowsiness.',
         ar:'الطعم المرّ بعد الرشّ شائع — أمل الرأس إلى الأمام لا إلى الخلف. قد يسبّب نعاساً خفيفاً.'},
  ix:[
    ['Alcohol', W, 'More drowsiness.', 'نعاس أكثر.']
  ],
  ask:['childAge', 'drive'] },

{ sci:'Mometasone', ar:'موميتازون', atc:'R01AD09', cat:'res.nasal', form:'spray',
  doses:['50 microgram/dose nasal spray', '200 and 400 microgram inhaler', 'with olopatadine or azelastine, nasal spray'], brand:['Nasonex', 'Asmanex', 'Ryaltris'], aka:['Mometasone furoate'],
  notes:{en:'A steroid nose spray for hay fever and polyps, once a day; it takes a few days to work fully, so use it every day through the season. Aim away from the middle of the nose; nosebleeds can occur.',
         ar:'بخاخ أنف كورتيزوني لحساسية الأنف والسلائل، مرة يومياً؛ يحتاج بضعة أيام ليعمل كلياً، فاستعمله كل يوم طوال الموسم. وجّهه بعيداً عن الحاجز الأنفي؛ وقد يحدث رعاف.'},
  ix:[
    ['Ritonavir', S, 'Raises steroid levels — Cushing’s syndrome is possible.', 'يرفع مستوى الكورتيزون — متلازمة كوشينغ ممكنة.']
  ],
  ask:['whoFor', 'useLength', 'glaucoma'] }

];
