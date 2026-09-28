/* Blood pressure: ACE inhibitors, sartans, beta-blockers, calcium-channel
   blockers, diuretics and the rest. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- ACE inhibitors ---------- */
{ sci:'Lisinopril', ar:'ليزينوبريل', atc:'C09AA03', cat:'cvs.acei', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg'], brand:['Zestril'],
  tags:['raas', 'acei'],
  notes:{en:'A persistent dry cough is the usual reason people stop — switch to a sartan. Creatinine and potassium two weeks after any change.',
         ar:'السعال الجاف المستمر سبب شائع للتوقف — يُبدّل إلى سارتان. يُراجع الكرياتينين والبوتاسيوم بعد أسبوعين من أي تعديل.'},
  ix:[
    ['Spironolactone', S, 'Hyperkalaemia — monitor.', 'فرط بوتاسيوم — يُراقب مخبرياً.'],
    ['Ibuprofen', S, 'With a diuretic, a risk of acute kidney injury.', 'مع مدرّ بول: خطر أذية كلوية حادة.'],
    ['Potassium chloride', S, 'Hyperkalaemia.', 'فرط بوتاسيوم.']
  ],
  ci:['preg', 'angioedemaAcei', 'ras'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Enalapril', ar:'إينالابريل', atc:'C09AA02', cat:'cvs.acei', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg'], brand:['Renitec', 'Vasotec'],
  tags:['raas', 'acei'],
  notes:{en:'The first dose can cause dizziness — take it at bedtime.',
         ar:'الجرعة الأولى قد تسبّب دواراً — تُؤخذ قبل النوم.'},
  ix:[
    ['Spironolactone', S, 'Hyperkalaemia.', 'فرط بوتاسيوم.'],
    ['Ibuprofen', S, 'Risk of acute kidney injury.', 'خطر أذية كلوية حادة.']
  ],
  ci:['preg', 'angioedemaAcei'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Captopril', ar:'كابتوبريل', atc:'C09AA01', cat:'cvs.acei', form:'tablet',
  doses:['12.5 mg', '25 mg', '50 mg'], brand:['Capoten'],
  tags:['raas', 'acei'], take:['beforeFood'],
  notes:{en:'An hour before meals. A dry cough is common; swelling of the lips, tongue or face means stop and get help at once. Get up slowly at first — it can make you dizzy.',
         ar:'يؤخذ قبل الأكل بساعة. السعال الجاف شائع؛ أما تورّم الشفتين أو اللسان أو الوجه فيستوجب إيقافه وطلب المساعدة فوراً. انهض ببطء في البداية — قد يسبّب دوخة.'},
  ix:[
    ['Allopurinol', W, 'More hypersensitivity reactions and low white cells.', 'تفاعلات تحسّس أكثر ونقص في الكريات البيض.']
  ],
  ci:['preg', 'angioedemaAcei', 'ras'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Ramipril', ar:'راميبريل', atc:'C09AA05', cat:'cvs.acei', form:'tablet',
  doses:['1.25 mg', '2.5 mg', '5 mg', '10 mg'], brand:['Tritace'],
  tags:['raas', 'acei'],
  notes:{en:'Once a day. A dry, tickly cough is common — tell your doctor rather than just stopping. Swelling of the face, lips or tongue: stop and get help at once. No potassium salt substitutes.',
         ar:'مرة واحدة يومياً. السعال الجاف المزعج شائع — أخبر طبيبك بدل أن توقفه بنفسك. تورّم الوجه أو الشفتين أو اللسان: أوقفه واطلب المساعدة فوراً. لا تستعمل بدائل الملح التي تحوي البوتاسيوم.'},
  ci:['preg', 'angioedemaAcei', 'ras'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Perindopril', ar:'بيريندوبريل', atc:'C09AA04', cat:'cvs.acei', form:'tablet',
  doses:['2.5 mg', '4 mg', '5 mg', '8 mg', '10 mg'], brand:['Coversyl'],
  tags:['raas', 'acei'], take:['beforeBreakfast'],
  notes:{en:'In the morning before breakfast. A dry cough is common; swelling of the face or tongue means stop and get help. Often sold combined with indapamide or amlodipine — do not take a separate tablet of the same drug.',
         ar:'صباحاً قبل الفطور. السعال الجاف شائع؛ أما تورّم الوجه أو اللسان فيستوجب إيقافه وطلب المساعدة. يُباع كثيراً مركّباً مع الإنداباميد أو الأملوديبين — لا تأخذ حبة منفصلة من الدواء نفسه.'},
  ci:['preg', 'angioedemaAcei', 'ras'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Fosinopril', ar:'فوسينوبريل', atc:'C09AA09', cat:'cvs.acei', form:'tablet',
  doses:['10 mg', '20 mg'], brand:['Monopril'],
  tags:['raas', 'acei'],
  notes:{en:'Once a day. Cleared by both liver and kidney, so it suits kidney impairment. Dry cough and dizziness are the usual side effects; facial swelling means stop at once.',
         ar:'مرة واحدة يومياً. يُطرح عن طريق الكبد والكلية معاً، فيناسب القصور الكلوي. السعال الجاف والدوخة أشيع آثاره؛ وتورّم الوجه يستوجب الإيقاف فوراً.'},
  ix:[
    ['#polyvalent', W, 'Antacids reduce its absorption — two hours apart.', 'مضادات الحموضة تقلّل امتصاصه — بفاصل ساعتين.']
  ],
  ci:['preg', 'angioedemaAcei', 'ras'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Quinapril', ar:'كينابريل', atc:'C09AA06', cat:'cvs.acei', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg', '40 mg'], brand:['Accupril'],
  tags:['raas', 'acei'],
  notes:{en:'Once or twice a day. Dry cough and dizziness are common; facial or tongue swelling means stop and get help.',
         ar:'مرة أو مرتين يومياً. السعال الجاف والدوخة شائعان؛ وتورّم الوجه أو اللسان يستوجب الإيقاف وطلب المساعدة.'},
  ix:[
    ['Tetracycline', W, 'The tablet’s magnesium binds tetracycline — two hours apart.', 'المغنيسيوم في الحبة يربط التتراسيكلين — بفاصل ساعتين.']
  ],
  ci:['preg', 'angioedemaAcei', 'ras'],
  ask:['preg', 'kidney', 'potassium'] },

/* ---------- Sartans ---------- */
{ sci:'Losartan', ar:'لوسارتان', atc:'C09CA01', cat:'cvs.arb', form:'tablet',
  doses:['25 mg', '50 mg', '100 mg'], brand:['Cozaar'],
  tags:['raas'],
  notes:{en:'The answer to the ACE-inhibitor cough. It also lowers uric acid, which helps if there is gout.',
         ar:'بديل مثبطات ACE عند السعال. يخفض حمض البول أيضاً — مفيد مع النقرس.'},
  ix:[
    ['Spironolactone', S, 'Hyperkalaemia.', 'فرط بوتاسيوم.'],
    ['Lithium', S, 'Raises lithium.', 'يرفع الليثيوم.']
  ],
  ci:['preg', 'ras'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Valsartan', ar:'فالسارتان', atc:'C09CA03', cat:'cvs.arb', form:'tablet',
  doses:['40 mg', '80 mg', '160 mg', '320 mg'], brand:['Diovan'],
  tags:['raas'],
  notes:{en:'Once daily, with or without food.',
         ar:'مرة واحدة يومياً بغض النظر عن الطعام.'},
  ix:[
    ['Spironolactone', S, 'Hyperkalaemia.', 'فرط بوتاسيوم.'],
    ['Ibuprofen', S, 'Blunts the effect and raises renal risk.', 'يقلّل الأثر ويزيد الخطر الكلوي.']
  ],
  ci:['preg', 'hepSevere'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Irbesartan', ar:'إربيسارتان', atc:'C09CA04', cat:'cvs.arb', form:'tablet',
  doses:['75 mg', '150 mg', '300 mg'], brand:['Aprovel'],
  tags:['raas'],
  notes:{en:'Once a day, with or without food. Can make you dizzy at first. Not in pregnancy. No potassium supplements or salt substitutes unless prescribed.',
         ar:'مرة واحدة يومياً، مع الطعام أو بدونه. قد يسبّب دوخة في البداية. لا يُستعمل في الحمل. لا مكمّلات بوتاسيوم ولا بدائل ملح إلا بوصفة.'},
  ci:['preg', 'ras'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Candesartan', ar:'كانديسارتان', atc:'C09CA06', cat:'cvs.arb', form:'tablet',
  doses:['4 mg', '8 mg', '16 mg', '32 mg'], brand:['Atacand'],
  tags:['raas'],
  notes:{en:'Once a day. Also used in heart failure, where the dose is built up slowly with blood tests. Not in pregnancy.',
         ar:'مرة واحدة يومياً. يُستعمل أيضاً في قصور القلب حيث تُرفع الجرعة تدريجياً مع تحاليل الدم. لا يُستعمل في الحمل.'},
  ci:['preg', 'hepSevere', 'ras'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Telmisartan', ar:'تلميسارتان', atc:'C09CA07', cat:'cvs.arb', form:'tablet',
  doses:['20 mg', '40 mg', '80 mg'], brand:['Micardis'],
  tags:['raas'],
  notes:{en:'Once a day. Long-acting, so a late dose still counts — do not double up. Not in pregnancy.',
         ar:'مرة واحدة يومياً. طويل المفعول، فالجرعة المتأخرة ما زالت نافعة — لا تضاعف الجرعة. لا يُستعمل في الحمل.'},
  ix:[
    ['Digoxin', W, 'Raises digoxin levels — check them when starting.', 'يرفع مستوى الديجوكسين — افحصه عند البدء.']
  ],
  ci:['preg', {en:'Biliary obstruction', ar:'انسداد صفراوي'}, 'hepSevere'],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Olmesartan', ar:'أولميسارتان', atc:'C09CA08', cat:'cvs.arb', form:'tablet',
  doses:['10 mg', '20 mg', '40 mg'], brand:['Olmetec', 'Benicar'],
  tags:['raas'],
  notes:{en:'Once a day. Rarely it causes severe, lasting diarrhoea with weight loss months after starting — report it, because stopping cures it. Not in pregnancy.',
         ar:'مرة واحدة يومياً. نادراً ما يسبّب إسهالاً شديداً مستمراً مع نقص وزن بعد أشهر من البدء — أبلغ عنه، فالإيقاف يشفيه. لا يُستعمل في الحمل.'},
  ci:['preg', {en:'Biliary obstruction', ar:'انسداد صفراوي'}],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Azilsartan', ar:'أزيلسارتان', atc:'C09CA09', cat:'cvs.arb', form:'tablet',
  doses:['20 mg', '40 mg', '80 mg'], brand:['Edarbi'],
  tags:['raas'],
  notes:{en:'Once a day. Dizziness at first; drink normally, since dehydration makes it worse. Not in pregnancy.',
         ar:'مرة واحدة يومياً. دوخة في البداية؛ اشرب السوائل كالمعتاد، فالجفاف يزيدها. لا يُستعمل في الحمل.'},
  ci:['preg'],
  ask:['preg', 'kidney', 'dehydration'] },

/* ---------- Beta-blockers ---------- */
{ sci:'Bisoprolol', ar:'بيسوبرولول', atc:'C07AB07', cat:'cvs.bb', form:'tablet',
  doses:['1.25 mg', '2.5 mg', '5 mg', '10 mg'], brand:['Concor'],
  tags:['betaBlocker'], take:['morning'],
  notes:{en:'Never stop abruptly — rebound angina or infarction. Taper it down.',
         ar:'لا يُوقف فجأة — الإيقاف المفاجئ يسبّب ذبحة أو احتشاء ارتدادياً. يُخفّض تدريجياً.'},
  ix:[
    ['Verapamil', C, 'Severe bradycardia and heart block — avoid the combination.', 'بطء قلب شديد وحصار — يُتجنّب الجمع.'],
    ['Salbutamol', W, 'Blunts the bronchodilator.', 'يقلّل أثر موسّع القصبات.']
  ],
  ci:['asthmaUncontrolled', 'heartBlock', 'bradycardia'],
  ask:['asthma', 'slowPulse', 'diabetes'] },

{ sci:'Atenolol', ar:'أتينولول', atc:'C07AB03', cat:'cvs.bb', form:'tablet',
  doses:['25 mg', '50 mg', '100 mg'], brand:['Tenormin'],
  tags:['betaBlocker'],
  notes:{en:'Renally cleared — reduce the dose in kidney impairment. Do not stop abruptly.',
         ar:'يُطرح كلوياً — تُخفّض الجرعة مع قصور الكلية. لا يُوقف فجأة.'},
  ix:[
    ['Verapamil', C, 'Severe bradycardia and heart block.', 'بطء قلب شديد وحصار.'],
    ['Gliclazide', W, 'Masks the warning signs of hypoglycaemia.', 'يُخفي أعراض نقص السكر.']
  ],
  ci:['asthmaUncontrolled', 'heartBlock'],
  ask:['asthma', 'slowPulse', 'kidney'] },

{ sci:'Metoprolol', ar:'ميتوبرولول', atc:'C07AB02', cat:'cvs.bb', form:'tablet',
  doses:['25 mg', '50 mg', '100 mg'], brand:['Betaloc', 'Lopressor'],
  tags:['betaBlocker'], take:['withFood'],
  notes:{en:'The modified-release form is once daily and the plain one twice — check which they are actually holding.',
         ar:'الشكل الممتد مرة واحدة يومياً والعادي مرتين — تأكد أيّهما بيد المريض.'},
  ix:[
    ['Verapamil', C, 'Severe bradycardia and heart block.', 'بطء قلب شديد وحصار.'],
    ['Fluoxetine', S, 'Substantially raises metoprolol levels.', 'يرفع مستوى الميتوبرولول كثيراً.']
  ],
  ci:['asthmaUncontrolled', 'hfDecomp'],
  ask:['asthma', 'slowPulse'] },

{ sci:'Carvedilol', ar:'كارفيديلول', atc:'C07AG02', cat:'cvs.bb', form:'tablet',
  doses:['3.125 mg', '6.25 mg', '12.5 mg', '25 mg'], brand:['Dilatrend'],
  tags:['betaBlocker', 'bbNonSelective'], take:['withFood'],
  notes:{en:'With food to blunt the postural drop. Titrated up slowly in heart failure.',
         ar:'مع الطعام لتقليل هبوط الضغط الانتصابي. يُرفع تدريجياً في قصور القلب.'},
  ix:[
    ['Verapamil', C, 'Severe bradycardia and heart block.', 'بطء قلب شديد وحصار.'],
    ['Digoxin', S, 'Raises digoxin and slows the heart.', 'يرفع الديجوكسين ويبطّئ القلب.']
  ],
  ci:['asthmaUncontrolled', 'hfDecomp', 'hepSevere'],
  ask:['asthma', 'slowPulse', 'lowBp'] },

{ sci:'Propranolol', ar:'بروبرانولول', atc:'C07AA05', cat:'cvs.bb', form:'tablet',
  doses:['10 mg', '40 mg', '80 mg SR', '1 mg/mL injection'], brand:['Inderal'],
  tags:['betaBlocker', 'bbNonSelective'],
  notes:{en:'Used for blood pressure, tremor, anxiety, migraine prevention and an overactive thyroid. Do not stop suddenly. It can hide the signs of low sugar and bring on wheeze in asthma.',
         ar:'يُستعمل للضغط والرجفة والقلق والوقاية من الشقيقة وفرط نشاط الدرق. لا يُوقف فجأة. قد يُخفي علامات هبوط السكر ويُحدث صفيراً عند مريض الربو.'},
  ix:[
    ['Rizatriptan', S, 'Raises rizatriptan — use the 5 mg dose, not 10 mg.', 'يرفع الريزاتريبتان — تُستعمل جرعة 5 ملغ لا 10.'],
    ['Chlorpromazine', W, 'Each raises the other — more hypotension.', 'كلٌّ منهما يرفع الآخر — هبوط ضغط أكثر.']
  ],
  ci:['asthma', 'heartBlock', 'bradycardia', 'shock'],
  ask:['asthma', 'slowPulse', 'diabetes'] },

{ sci:'Nebivolol', ar:'نيبيفولول', atc:'C07AB12', cat:'cvs.bb', form:'tablet',
  doses:['2.5 mg', '5 mg'], brand:['Nebilet'],
  tags:['betaBlocker'],
  notes:{en:'Once a day at the same time. Do not stop suddenly. Tiredness and cold hands are common at first.',
         ar:'مرة واحدة يومياً في الوقت نفسه. لا يُوقف فجأة. التعب وبرودة اليدين شائعان في البداية.'},
  ci:['hepSevere', 'hfDecomp', 'bradycardia', 'heartBlock'],
  ask:['asthma', 'slowPulse'] },

{ sci:'Labetalol', ar:'لابيتالول', atc:'C07AG01', cat:'cvs.bb', form:'tablet',
  doses:['100 mg', '200 mg', '5 mg/mL injection'], brand:['Trandate'],
  tags:['betaBlocker', 'bbNonSelective'], take:['withFood'],
  notes:{en:'Often used for high blood pressure in pregnancy. With food. Dizziness on standing and a tingling scalp are common at first; tell us about yellow skin or dark urine.',
         ar:'يُستعمل كثيراً لارتفاع الضغط في الحمل. مع الطعام. الدوخة عند الوقوف ووخز فروة الرأس شائعان في البداية؛ أبلغ عن اصفرار الجلد أو غمق البول.'},
  ci:['asthma', 'heartBlock', 'bradycardia', 'shock'],
  ask:['asthma', 'lowBp', 'liver'] },

{ sci:'Esmolol', ar:'إسمولول', atc:'C07AB09', cat:'cvs.bb', form:'injection',
  doses:['100 mg/10 mL', '2.5 g/250 mL'], brand:['Brevibloc'],
  tags:['betaBlocker'],
  notes:{en:'Hospital only — a very short-acting intravenous beta-blocker for fast heart rates and blood pressure around surgery; its effect fades within half an hour of stopping.',
         ar:'للمستشفى فقط — حاصر بيتا وريدي قصير المفعول جداً لتسرّع القلب والضغط حول العمليات؛ يزول أثره خلال نصف ساعة من الإيقاف.'},
  ci:['bradycardia', 'heartBlock', 'shock', 'hfDecomp'],
  ask:['asthma'] },

/* ---------- Calcium-channel blockers ---------- */
{ sci:'Amlodipine', ar:'أملوديبين', atc:'C08CA01', cat:'cvs.ccb', form:'tablet',
  doses:['5 mg', '10 mg'], brand:['Norvasc'],
  tags:['sub3a4'],
  notes:{en:'Ankle swelling is its commonest side effect and is not a sign of heart failure. Any time of day, but the same time.',
         ar:'الوذمة حول الكاحل أشيع أعراضه وليست علامة قصور قلب. أي وقت من اليوم، بثبات.'},
  ix:[
    ['Simvastatin', W, 'Limit simvastatin to 20 mg daily.', 'يُحدّ سيمفاستاتين بـ 20 ملغ يومياً.'],
    ['Clarithromycin', S, 'Raises amlodipine and causes hypotension.', 'يرفع الأملوديبين ويسبّب هبوط ضغط.']
  ],
  ci:['shock', 'aorticStenosis'],
  ask:['lowBp', 'heartFailure'] },

{ sci:'Nifedipine', ar:'نيفيديبين', atc:'C08CA05', cat:'cvs.ccb', form:'tablet',
  doses:['10 mg', '20 mg', '30 mg SR', '60 mg SR'], brand:['Adalat'],
  tags:['sub3a4'],
  notes:{en:'Only the modified-release form for blood pressure — the short-acting one causes reflex tachycardia. Swallow whole.',
         ar:'الشكل الممتد فقط لضغط الدم — القصير يسبّب تسرّعاً انعكاسياً. يُبلع كاملاً.'},
  ix:[
    ['Clarithromycin', S, 'Severe hypotension.', 'هبوط ضغط شديد.'],
    ['Carbamazepine', W, 'Reduces nifedipine’s effect.', 'يقلّل فعالية النيفيديبين.']
  ],
  ci:['shock', 'unstableAngina', 'aorticStenosis'],
  ask:['lowBp', 'heart'] },

{ sci:'Verapamil', ar:'فيراباميل', atc:'C08DA01', cat:'cvs.ccb', form:'tablet',
  doses:['40 mg', '80 mg', '120 mg', '240 mg SR'], brand:['Isoptin'],
  tags:['nondhp', 'inh3a4mod', 'sub3a4'],
  notes:{en:'Constipation is by far its commonest side effect. Not combined with a beta blocker except on a specialist’s decision.',
         ar:'الإمساك أشيع أعراضه بفارق كبير. لا يُجمع مع حاصرات بيتا إلا بقرار اختصاصي.'},
  ix:[
    ['Bisoprolol', C, 'Severe bradycardia and heart block — avoid the combination.', 'بطء قلب شديد وحصار — يُتجنّب الجمع.'],
    ['Atenolol', C, 'Severe bradycardia and heart block.', 'بطء قلب شديد وحصار.'],
    ['Digoxin', S, 'Raises digoxin.', 'يرفع الديجوكسين.'],
    ['Simvastatin', S, 'Myopathy risk — limit to 20 mg.', 'خطر اعتلال عضلي — يُحدّ بـ 20 ملغ.']
  ],
  ci:['hfDecomp', 'heartBlock', 'hypotension'],
  ask:['slowPulse', 'heartFailure', 'statin'] },

{ sci:'Diltiazem', ar:'ديلتيازيم', atc:'C08DB01', cat:'cvs.ccb', form:'tablet',
  doses:['60 mg', '90 mg SR', '120 mg SR', '180 mg SR', '25 mg injection'], brand:['Tildiem', 'Cardizem', 'Herbesser'],
  tags:['nondhp', 'inh3a4mod', 'sub3a4'],
  notes:{en:'Swallow modified-release tablets whole, and do not switch between brands of them. Ankle swelling, headache and constipation can occur; tell us about fainting or a very slow pulse.',
         ar:'تُبلع الأقراص ممتدة المفعول كاملة، ولا يُبدّل بين ماركاتها. قد يحدث تورّم الكاحلين والصداع والإمساك؛ أبلغ عن الإغماء أو بطء النبض الشديد.'},
  ix:[
    ['Digoxin', W, 'Raises digoxin and slows the heart further.', 'يرفع الديجوكسين ويبطّئ القلب أكثر.']
  ],
  ci:['sickSinus', 'heartBlock', 'hfDecomp', 'hypotension'],
  ask:['slowPulse', 'heartFailure', 'statin'] },

{ sci:'Felodipine', ar:'فيلوديبين', atc:'C08CA02', cat:'cvs.ccb', form:'tablet',
  doses:['2.5 mg', '5 mg', '10 mg'], brand:['Plendil'],
  tags:['sub3a4'],
  notes:{en:'Once a day, swallowed whole. No grapefruit or its juice. Flushing, headache and ankle swelling are common and usually settle.',
         ar:'مرة واحدة يومياً، تُبلع كاملة. لا جريب فروت ولا عصيره. الاحمرار والصداع وتورّم الكاحلين شائعة وتخفّ عادة.'},
  ix:[
    ['Grapefruit juice', S, 'Raises felodipine several-fold — none during treatment.', 'يرفع الفيلوديبين أضعافاً — لا يُشرب أثناء العلاج.']
  ],
  ci:['shock', 'aorticStenosis', 'unstableAngina', 'hfDecomp'],
  ask:['lowBp', 'heartFailure'] },

{ sci:'Lercanidipine', ar:'ليركانيديبين', atc:'C08CA13', cat:'cvs.ccb', form:'tablet',
  doses:['10 mg', '20 mg'], brand:['Zanidip'],
  tags:['sub3a4'], take:['beforeFood'],
  notes:{en:'Once a day, at least 15 minutes before a meal. No grapefruit juice. Ankle swelling is less common than with amlodipine.',
         ar:'مرة واحدة يومياً، قبل الوجبة بربع ساعة على الأقل. لا عصير جريب فروت. تورّم الكاحلين أقل منه مع الأملوديبين.'},
  ix:[
    ['Grapefruit juice', S, 'Raises lercanidipine — none during treatment.', 'يرفع الليركانيديبين — لا يُشرب أثناء العلاج.']
  ],
  ci:['aorticStenosis', 'unstableAngina', 'recentMI', 'hepSevere', 'renal30'],
  ask:['lowBp', 'heartFailure'] },

{ sci:'Nimodipine', ar:'نيموديبين', atc:'C08CA06', cat:'cvs.ccb', form:'tablet',
  doses:['30 mg', '10 mg/50 mL infusion'], brand:['Nimotop'],
  tags:['sub3a4'],
  notes:{en:'Given after a brain haemorrhage to protect the brain, usually every four hours for three weeks — keep to the times exactly. It can lower blood pressure.',
         ar:'يُعطى بعد نزف الدماغ لحمايته، عادة كل أربع ساعات لمدة ثلاثة أسابيع — التزم بالمواعيد بدقة. قد يخفض الضغط.'},
  ix:[
    ['Grapefruit juice', S, 'Raises nimodipine — none during treatment.', 'يرفع النيموديبين — لا يُشرب أثناء العلاج.']
  ],
  ci:['unstableAngina', 'recentMI'],
  ask:['lowBp', 'otherMeds'] },

{ sci:'Lacidipine', ar:'لاسيديبين', atc:'C08CA09', cat:'cvs.ccb', form:'tablet',
  doses:['2 mg', '4 mg'], brand:['Motens', 'Lacipil'],
  tags:['sub3a4'], take:['morning'],
  notes:{en:'Once a day in the morning. Flushing, headache and ankle swelling are the usual side effects.',
         ar:'مرة واحدة صباحاً. الاحمرار والصداع وتورّم الكاحلين أشيع آثاره.'},
  ci:['aorticStenosis', 'recentMI', 'unstableAngina'],
  ask:['lowBp', 'heartFailure'] },

{ sci:'Nicardipine', ar:'نيكارديبين', atc:'C08CA04', cat:'cvs.ccb', form:'injection',
  doses:['2.5 mg/mL injection', '20 mg capsule'], brand:['Cardene'],
  tags:['sub3a4'],
  notes:{en:'Mostly an intravenous hospital drug for severe high blood pressure, with the pressure watched closely.',
         ar:'دواء وريدي للمستشفى في الغالب لارتفاع الضغط الشديد، مع مراقبة الضغط عن قرب.'},
  ci:['aorticStenosis', 'shock'],
  ask:['lowBp'] },

/* ---------- Diuretics ---------- */
{ sci:'Hydrochlorothiazide', ar:'هيدروكلوروثيازيد', atc:'C03AA03', cat:'cvs.diuretic', form:'tablet',
  doses:['12.5 mg', '25 mg', '50 mg'], brand:['Esidrex'],
  tags:['diuretic', 'thiazide', 'kLosing'], take:['morning'],
  notes:{en:'Morning, not evening. It raises uric acid and glucose and lowers potassium and sodium.',
         ar:'صباحاً لا مساءً. يرفع حمض البول وسكر الدم ويخفض البوتاسيوم والصوديوم.'},
  ix:[
    ['Lithium', S, 'Raises lithium to toxic levels.', 'يرفع الليثيوم إلى حدّ السميّة.'],
    ['Digoxin', S, 'The potassium loss makes digoxin toxic.', 'نقص البوتاسيوم يزيد سميّة الديجوكسين.']
  ],
  ci:['anuria', 'hypoNaK', 'sulfaAllergy'],
  ask:['gout', 'diabetes', 'lowBp'] },

{ sci:'Furosemide', ar:'فوروسيميد', atc:'C03CA01', cat:'cvs.diuretic', form:'tablet',
  doses:['20 mg', '40 mg', '20 mg/2 mL'], brand:['Lasix'], aka:['Frusemide'],
  tags:['diuretic', 'kLosing', 'ototoxic'], take:['morning'],
  notes:{en:'Morning, and a second dose before four in the afternoon — otherwise nobody sleeps. Watch potassium.',
         ar:'صباحاً، والجرعة الثانية قبل الرابعة عصراً — وإلا لن ينام المريض. يُراقب البوتاسيوم.'},
  ix:[
    ['Digoxin', S, 'The potassium loss makes digoxin toxic.', 'نقص البوتاسيوم يزيد سميّة الديجوكسين.'],
    ['Lithium', S, 'Raises lithium.', 'يرفع الليثيوم.'],
    ['Gentamicin', S, 'Compounded ear and kidney toxicity.', 'سميّة أذنية وكلوية مضاعفة.']
  ],
  ci:['anuria', 'dehydration'],
  ask:['lowBp', 'dehydration', 'kidney'] },

{ sci:'Spironolactone', ar:'سبيرونولاكتون', atc:'C03DA01', cat:'cvs.diuretic', form:'tablet',
  doses:['25 mg', '50 mg', '100 mg'], brand:['Aldactone'],
  tags:['diuretic', 'kSparing'], take:['morning'],
  notes:{en:'Potassium-sparing — no salt substitutes and no potassium supplements. Gynaecomastia in men is common.',
         ar:'مدرّ حافظ للبوتاسيوم — لا بدائل ملح ولا مكمّلات بوتاسيوم. التثدّي عند الرجال شائع.'},
  ix:[
    ['Lisinopril', S, 'Hyperkalaemia — monitor.', 'فرط بوتاسيوم — يُراقب مخبرياً.'],
    ['Trimethoprim/Sulfamethoxazole', S, 'Dangerous hyperkalaemia.', 'فرط بوتاسيوم خطر.'],
    ['Potassium chloride', C, 'Life-threatening hyperkalaemia.', 'فرط بوتاسيوم مهدّد للحياة.']
  ],
  ci:['hyperK', 'addison', 'renalSevere'],
  ask:['potassium', 'kidney', 'preg'] },

{ sci:'Indapamide', ar:'إنداباميد', atc:'C03BA11', cat:'cvs.diuretic', form:'tablet',
  doses:['1.5 mg SR', '2.5 mg'], brand:['Natrilix'],
  tags:['diuretic', 'thiazide', 'kLosing', 'qtPossible'], take:['morning'],
  notes:{en:'In the morning. It can lower potassium and sodium, so blood tests are part of taking it; tell us about cramps, weakness or confusion.',
         ar:'صباحاً. قد يخفض البوتاسيوم والصوديوم، فتحاليل الدم جزء من استعماله؛ أبلغ عن التشنّجات أو الضعف أو التشوّش.'},
  ci:['renalSevere', 'hepSevere', 'hypoK'],
  ask:['gout', 'diabetes', 'kidney'] },

{ sci:'Chlortalidone', ar:'كلورتاليدون', atc:'C03BA04', cat:'cvs.diuretic', form:'tablet',
  doses:['12.5 mg', '25 mg', '50 mg'], brand:['Hygroton'], aka:['Chlorthalidone'],
  tags:['diuretic', 'thiazide', 'kLosing'], take:['morning'],
  notes:{en:'In the morning. Long-acting: it keeps working the next day. It can lower potassium and raise sugar and uric acid.',
         ar:'صباحاً. طويل المفعول: يبقى أثره في اليوم التالي. قد يخفض البوتاسيوم ويرفع السكر وحمض البول.'},
  ci:['anuria', 'hypoNaK', 'hyperCa'],
  ask:['gout', 'diabetes', 'lowBp'] },

{ sci:'Bumetanide', ar:'بوميتانيد', atc:'C03CA02', cat:'cvs.diuretic', form:'tablet',
  doses:['1 mg', '0.5 mg/mL injection'], brand:['Burinex'],
  tags:['diuretic', 'kLosing', 'ototoxic'], take:['morning'],
  notes:{en:'A strong water tablet: in the morning, with any second dose by early afternoon. In heart failure, weigh yourself daily and report a gain of 2 kg in two days.',
         ar:'مدرّ قوي: صباحاً، والجرعة الثانية قبل العصر. في قصور القلب، زِن نفسك يومياً وأبلغ عن زيادة 2 كغ خلال يومين.'},
  ci:['anuria', 'dehydration', 'hypoK'],
  ask:['lowBp', 'dehydration', 'kidney'] },

{ sci:'Torasemide', ar:'توراسيميد', atc:'C03CA04', cat:'cvs.diuretic', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg'], brand:['Torem'], aka:['Torsemide'],
  tags:['diuretic', 'kLosing', 'ototoxic'], take:['morning'],
  notes:{en:'Once a day in the morning. In heart failure, daily weights tell you whether the dose is right. Dizziness means drink and tell us.',
         ar:'مرة واحدة صباحاً. في قصور القلب، يدلّ الوزن اليومي على صحة الجرعة. الدوخة تعني اشرب وأبلغنا.'},
  ci:['anuria', 'dehydration', 'hypoK'],
  ask:['lowBp', 'dehydration', 'kidney'] },

{ sci:'Amiloride', ar:'أميلورايد', atc:'C03DB01', cat:'cvs.diuretic', form:'tablet',
  doses:['5 mg', '5 mg + hydrochlorothiazide 50 mg'], brand:['Moduretic', 'Midamor'],
  tags:['diuretic', 'kSparing'], take:['morning'],
  notes:{en:'Keeps potassium in — no potassium supplements or salt substitutes unless prescribed. Mostly sold combined with hydrochlorothiazide.',
         ar:'يحافظ على البوتاسيوم — لا مكمّلات بوتاسيوم ولا بدائل ملح إلا بوصفة. يُباع غالباً مركّباً مع الهيدروكلوروثيازيد.'},
  ci:['hyperK', 'renalSevere', 'anuria'],
  ask:['potassium', 'kidney', 'diabetes'] },

{ sci:'Eplerenone', ar:'إبليرينون', atc:'C03DA04', cat:'cvs.diuretic', form:'tablet',
  doses:['25 mg', '50 mg'], brand:['Inspra'],
  tags:['diuretic', 'kSparing', 'sub3a4crit'],
  notes:{en:'For the heart after a heart attack or in heart failure. Potassium is checked regularly; no potassium supplements or salt substitutes.',
         ar:'لحماية القلب بعد الاحتشاء أو في قصوره. يُفحص البوتاسيوم بانتظام؛ لا مكمّلات بوتاسيوم ولا بدائل ملح.'},
  ci:['hyperK', 'renal30', 'hepSevere'],
  ask:['potassium', 'kidney', 'otherMeds'] },

{ sci:'Metolazone', ar:'ميتولازون', atc:'C03BA08', cat:'cvs.diuretic', form:'tablet',
  doses:['2.5 mg', '5 mg'], brand:['Zaroxolyn'],
  tags:['diuretic', 'thiazide', 'kLosing'], take:['morning'],
  notes:{en:'Very powerful when added to furosemide — often only a few doses a week. Daily weights and blood tests are essential; report dizziness, cramps or confusion.',
         ar:'قوي جداً عند إضافته إلى الفوروسيميد — غالباً بضع جرعات في الأسبوع فقط. الوزن اليومي وتحاليل الدم ضرورية؛ أبلغ عن الدوخة أو التشنّجات أو التشوّش.'},
  ci:['anuria', 'hypoNaK', 'hepSevere'],
  ask:['dehydration', 'kidney', 'labs'] },

/* ---------- Other blood-pressure medicines ---------- */

{ sci:'Methyldopa', ar:'ميثيل دوبا', atc:'C02AB01', cat:'cvs.antihtn', form:'tablet',
  doses:['250 mg', '500 mg'], brand:['Aldomet'],
  tags:['sedative'],
  notes:{en:'The standard blood-pressure tablet in pregnancy. Drowsiness in the first days usually passes. Tell us about fever, dark urine, yellow eyes or low mood.',
         ar:'حبة الضغط المعتادة في الحمل. النعاس في الأيام الأولى يزول عادة. أبلغ عن الحرارة أو غمق البول أو اصفرار العينين أو انخفاض المزاج.'},
  ix:[
    ['Ferrous sulfate', W, 'Iron reduces methyldopa absorption — two hours apart.', 'الحديد يقلّل امتصاص الميثيل دوبا — بفاصل ساعتين.']
  ],
  ci:['hepActive', {en:'Active depression', ar:'اكتئاب فعّال'}, 'phaeo'],
  ask:['preg', 'liver', 'mood'] },

{ sci:'Clonidine', ar:'كلونيدين', atc:'C02AC01', cat:'cvs.antihtn', form:'tablet',
  doses:['25 microgram', '100 microgram', '150 microgram/mL injection'], brand:['Catapres'],
  tags:['sedative', 'bradycardic'],
  notes:{en:'Never stop it suddenly — blood pressure can rebound dangerously. Drowsiness and a dry mouth are common.',
         ar:'لا يُوقف فجأة أبداً — قد يرتدّ الضغط ارتداداً خطيراً. النعاس وجفاف الفم شائعان.'},
  ci:['bradycardia', 'sickSinus'],
  ask:['slowPulse', 'drive', 'sedatives'] },

{ sci:'Moxonidine', ar:'موكسونيدين', atc:'C02AC05', cat:'cvs.antihtn', form:'tablet',
  doses:['0.2 mg', '0.4 mg'], brand:['Physiotens'],
  tags:['sedative'],
  notes:{en:'Do not stop it suddenly. A dry mouth and drowsiness are common at first.',
         ar:'لا يُوقف فجأة. جفاف الفم والنعاس شائعان في البداية.'},
  ci:['sickSinus', 'heartBlock', 'bradycardia', 'hfSevere'],
  ask:['slowPulse', 'heartFailure', 'kidney'] },

{ sci:'Hydralazine', ar:'هيدرالازين', atc:'C02DB02', cat:'cvs.antihtn', form:'tablet',
  doses:['25 mg', '50 mg', '20 mg injection'], brand:['Apresoline'],
  notes:{en:'Used in pregnancy and, with a nitrate, in heart failure. Headache and a racing heart are common at first. Report joint pains, rash or fever — a lupus-like reaction.',
         ar:'يُستعمل في الحمل، ومع النترات في قصور القلب. الصداع وتسارع القلب شائعان في البداية. أبلغ عن آلام المفاصل أو الطفح أو الحرارة — تفاعل يشبه الذئبة.'},
  ci:[{en:'Systemic lupus erythematosus', ar:'الذئبة الحمامية الجهازية'}, {en:'Severe tachycardia or high-output heart failure', ar:'تسرّع قلب شديد أو قصور قلب عالي النتاج'}, 'porphyria'],
  ask:['preg', 'heart'] },

{ sci:'Doxazosin', ar:'دوكسازوسين', atc:'C02CA04', cat:'cvs.antihtn', form:'tablet',
  doses:['1 mg', '2 mg', '4 mg', '4 mg XL'], brand:['Cardura'],
  tags:['alphaBlocker'], take:['bedtime'],
  notes:{en:'The first dose can make you faint — take it at bedtime and get up slowly. It also eases prostate symptoms.',
         ar:'الجرعة الأولى قد تسبّب إغماء — خذها قبل النوم وانهض ببطء. تخفّف أيضاً أعراض البروستاتا.'},
  ci:['posturalHypo'],
  ask:['lowBp', 'cataract', 'pde5'] },

{ sci:'Prazosin', ar:'برازوسين', atc:'C02CA01', cat:'cvs.antihtn', form:'tablet',
  doses:['1 mg', '2 mg', '5 mg'], brand:['Minipress'],
  tags:['alphaBlocker'], take:['bedtime'],
  notes:{en:'The first dose can cause fainting — take it at bedtime. Get up slowly from lying or sitting.',
         ar:'الجرعة الأولى قد تسبّب إغماء — خذها قبل النوم. انهض ببطء من الاستلقاء أو الجلوس.'},
  ci:['posturalHypo'],
  ask:['lowBp', 'pde5'] },

{ sci:'Aliskiren', ar:'أليسكيرين', atc:'C09XA02', cat:'cvs.antihtn', form:'tablet',
  doses:['150 mg', '300 mg'], brand:['Rasilez'],
  tags:['raas'],
  notes:{en:'Once a day, taken the same way each day — a heavy fatty meal lowers its effect. Not in pregnancy.',
         ar:'مرة واحدة يومياً، بالطريقة نفسها كل يوم — الوجبة الدسمة الثقيلة تُضعف مفعوله. لا يُستعمل في الحمل.'},
  ix:[
    ['Ciclosporin', C, 'Raises aliskiren sharply — contraindicated.', 'يرفع الأليسكيرين بشدة — ممنوع الجمع.'],
    ['Itraconazole', C, 'Raises aliskiren sharply — contraindicated.', 'يرفع الأليسكيرين بشدة — ممنوع الجمع.']
  ],
  ci:['preg', 'angioedema', {en:'With an ACE inhibitor or sartan in diabetes or kidney impairment', ar:'مع مثبط ACE أو سارتان عند مرضى السكري أو القصور الكلوي'}],
  ask:['preg', 'kidney', 'diabetes'] },

{ sci:'Sodium nitroprusside', ar:'نتروبروسيد الصوديوم', atc:'C02DD01', cat:'cvs.antihtn', form:'injection',
  doses:['50 mg vial'], brand:['Nipride'],
  notes:{en:'Hospital only, for hypertensive emergencies under continuous monitoring. Protect the infusion from light; cyanide builds up with long or high-dose use.',
         ar:'للمستشفى فقط، لطوارئ ارتفاع الضغط مع مراقبة مستمرة. يُحمى التسريب من الضوء؛ يتراكم السيانيد مع الاستعمال الطويل أو بجرعات عالية.'},
  ci:[{en:'Compensatory hypertension (coarctation of the aorta, arteriovenous shunt)', ar:'ارتفاع ضغط معاوض (تضيّق برزخ الأبهر، تحويلة شريانية وريدية)'}, {en:'Leber’s optic atrophy or vitamin B12 deficiency', ar:'ضمور ليبر البصري أو عوز فيتامين B12'}],
  ask:['kidney', 'liver'] },

{ sci:'Urapidil', ar:'يورابيديل', atc:'C02CA06', cat:'cvs.antihtn', form:'injection',
  doses:['25 mg/5 mL', '50 mg/10 mL'], brand:['Ebrantil'],
  tags:['alphaBlocker'],
  notes:{en:'Hospital use — intravenous for severe high blood pressure. The pressure falls quickly, so the patient lies down and is monitored.',
         ar:'للمستشفى — وريدياً لارتفاع الضغط الشديد. ينخفض الضغط بسرعة، فيستلقي المريض ويُراقب.'},
  ci:['aorticStenosis', {en:'Arteriovenous shunt (except dialysis shunts)', ar:'تحويلة شريانية وريدية (عدا تحويلات الغسيل)'}],
  ask:['lowBp', 'preg'] }

];
