/* The heart itself: angina, rhythm, heart failure, vasopressors, pulmonary
   hypertension, and the circulation of the legs. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Nitrates and angina ---------- */
{ sci:'Isosorbide dinitrate', ar:'أيزوسوربيد ثنائي النترات', atc:'C01DA08', cat:'cvs.angina', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg'], brand:['Isordil'],
  tags:['nitrate'],
  notes:{en:'A nitrate-free interval each day or tolerance develops. Headache in the first days is expected.',
         ar:'فترة خالية من النترات يومياً وإلا تطوّر التحمّل. الصداع متوقّع في الأيام الأولى.'},
  ix:[
    ['Sildenafil', C, 'Fatal hypotension — the combination is contraindicated.', 'هبوط ضغط قاتل — ممنوع الجمع.']
  ],
  ci:[{en:'Concurrent PDE5 inhibitor', ar:'الاستعمال المتزامن مع مثبطات PDE5'}, 'hypotension', 'aorticStenosis'],
  ask:['pde5', 'lowBp'] },

{ sci:'Glyceryl trinitrate', ar:'ثلاثي نترات الغليسيريل', atc:'C01DA02', cat:'cvs.angina', form:'spray',
  doses:['400 mcg/spray', '0.5 mg sublingual'], brand:['Nitrolingual'], aka:['Nitroglycerin'],
  tags:['nitrate'],
  notes:{en:'Under the tongue, sitting down — standing with the blood-pressure drop causes a faint. No relief after the third dose means call an ambulance.',
         ar:'تحت اللسان جالساً — الوقوف مع هبوط الضغط يسبّب إغماءً. جرعة ثالثة دون تحسّن تعني الإسعاف.'},
  ix:[
    ['Sildenafil', C, 'Fatal hypotension — the combination is contraindicated.', 'هبوط ضغط قاتل — ممنوع الجمع.']
  ],
  ci:[{en:'Concurrent PDE5 inhibitor', ar:'الاستعمال المتزامن مع مثبطات PDE5'}, 'hypotension'],
  ask:['pde5', 'lowBp', 'chestPain'] },

{ sci:'Isosorbide mononitrate', ar:'إيزوسوربيد أحادي النترات', atc:'C01DA14', cat:'cvs.angina', form:'tablet',
  doses:['20 mg', '40 mg', '60 mg SR'], brand:['Imdur', 'Elantan', 'Monomack'],
  tags:['nitrate'],
  notes:{en:'Take the doses at the times given — a nitrate-free gap, usually overnight, keeps it working. Headache is common at first and eases. Never with Viagra-type medicines.',
         ar:'خذ الجرعات في أوقاتها المحددة — فترة خالية من النترات، عادة في الليل، تُبقي مفعوله. الصداع شائع في البداية ويخفّ. لا يُجمع أبداً مع أدوية من نوع الفياغرا.'},
  ci:['hypotension', 'hocm', 'aorticStenosis'],
  ask:['pde5', 'lowBp'] },

{ sci:'Nicorandil', ar:'نيكوراندِل', atc:'C01DX16', cat:'cvs.angina', form:'tablet',
  doses:['10 mg', '20 mg'], brand:['Ikorel'],
  tags:['nitrate'],
  notes:{en:'Headache is common at first. Report any ulcers in the mouth, on the skin or around the anus — it can cause them, and they heal only when it is stopped. Never with Viagra-type medicines.',
         ar:'الصداع شائع في البداية. أبلغ عن أي تقرّحات في الفم أو الجلد أو حول الشرج — قد يسبّبها ولا تشفى إلا بإيقافه. لا يُجمع أبداً مع أدوية من نوع الفياغرا.'},
  ci:['shock', 'hypotension', 'hfDecomp'],
  ask:['pde5', 'lowBp'] },

{ sci:'Trimetazidine', ar:'تريميتازيدين', atc:'C01EB15', cat:'cvs.angina', form:'tablet',
  doses:['20 mg', '35 mg MR'], brand:['Vastarel'],
  take:['withFood'],
  notes:{en:'An add-on for angina, with meals. It can cause tremor, stiffness or unsteadiness — report these, as they settle when it is stopped.',
         ar:'علاج إضافي للذبحة، مع الوجبات. قد يسبّب رجفة أو تيبّساً أو عدم ثبات — أبلغ عنها، فهي تزول بإيقافه.'},
  ix:[
    ['#dopamineBlocker', W, 'Both can cause parkinsonism — tremor and stiffness.', 'كلاهما قد يسبّب أعراض باركنسون — رعاش وتيبّس.']
  ],
  ci:['parkinson', {en:'Tremor, restless legs or other movement disorders', ar:'الرجفة أو تململ الساقين أو اضطرابات الحركة الأخرى'}, 'renal30'],
  ask:['parkinson', 'kidney', 'falls'] },

{ sci:'Ivabradine', ar:'إيفابرادين', atc:'C01EB17', cat:'cvs.angina', form:'tablet',
  doses:['5 mg', '7.5 mg'], brand:['Procoralan'],
  tags:['bradycardic', 'sub3a4crit', 'qtPossible'], take:['withFood'],
  notes:{en:'Twice a day with meals. Brief flashes of light in the vision are common at first. Report a slow pulse, dizziness or palpitations. No grapefruit juice.',
         ar:'مرتين يومياً مع الوجبات. ومضات ضوئية عابرة في النظر شائعة في البداية. أبلغ عن بطء النبض أو الدوخة أو الخفقان. لا عصير جريب فروت.'},
  ix:[
    ['Grapefruit juice', S, 'Raises ivabradine — none during treatment.', 'يرفع الإيفابرادين — لا يُشرب أثناء العلاج.'],
    ['#nondhp', C, 'Verapamil and diltiazem raise ivabradine and slow the heart — contraindicated.', 'الفيراباميل والديلتيازيم يرفعان الإيفابرادين ويبطّئان القلب — ممنوع الجمع.']
  ],
  ci:['bradycardia', 'sickSinus', 'shock', 'preg', 'hepSevere'],
  ask:['slowPulse', 'preg', 'otherMeds'] },

{ sci:'Ranolazine', ar:'رانولازين', atc:'C01EB18', cat:'cvs.angina', form:'tablet',
  doses:['375 mg', '500 mg', '750 mg', '1000 mg ER'], brand:['Ranexa'],
  tags:['qtPossible', 'sub3a4crit'],
  notes:{en:'Swallow whole, twice a day. Dizziness, nausea and constipation are common. Report fainting or palpitations.',
         ar:'يُبلع كاملاً، مرتين يومياً. الدوخة والغثيان والإمساك شائعة. أبلغ عن الإغماء أو الخفقان.'},
  ix:[
    ['Simvastatin', S, 'Raises simvastatin — no more than 20 mg.', 'يرفع السيمفاستاتين — لا يتجاوز 20 ملغ.'],
    ['Metformin', W, 'Raises metformin — no more than 1,700 mg a day with ranolazine 1,000 mg.', 'يرفع الميتفورمين — لا يتجاوز 1700 ملغ يومياً مع رانولازين 1000 ملغ.']
  ],
  ci:['hepSevere', 'renal30'],
  ask:['rhythm', 'kidney', 'otherMeds'] },

/* ---------- Heart rhythm ---------- */
{ sci:'Amiodarone', ar:'أميودارون', atc:'C01BD01', cat:'cvs.arrhythmia', form:'tablet',
  doses:['100 mg', '200 mg'], brand:['Cordarone'],
  tags:['qt', 'bradycardic', 'inh3a4mod'],
  notes:{en:'It stays in the body for weeks after stopping. Needs thyroid, liver and lung monitoring. Sunscreen, permanently.',
         ar:'يبقى في الجسم أسابيع بعد التوقف. يستوجب متابعة الغدة الدرقية والكبد والرئة. واقٍ شمسي دائم.'},
  ix:[
    ['Digoxin', C, 'Doubles digoxin levels — halve the dose.', 'يضاعف الديجوكسين — تُنصّف الجرعة.'],
    ['Warfarin', C, 'Greatly raises INR — cut the warfarin dose.', 'يرفع INR كثيراً — تُخفّض جرعة الوارفارين.'],
    ['Simvastatin', S, 'Myopathy risk — limit to 20 mg.', 'خطر اعتلال عضلي — يُحدّ بـ 20 ملغ.']
  ],
  ci:[{en:'Thyroid dysfunction', ar:'اضطراب درقي'}, {en:'Severe bradycardia or heart block', ar:'بطء قلب شديد أو حصار قلبي'}, {en:'Iodine hypersensitivity', ar:'فرط الحساسية لليود'}],
  ask:['thyroid', 'labs', 'sun'] },

{ sci:'Sotalol', ar:'سوتالول', atc:'C07AA07', cat:'cvs.arrhythmia', form:'tablet',
  doses:['80 mg', '160 mg'], brand:['Sotalex', 'Betapace'],
  tags:['betaBlocker', 'bbNonSelective', 'qt'],
  notes:{en:'Started with ECG monitoring. Keep potassium normal — tell us at once about vomiting or diarrhoea. Do not stop it suddenly.',
         ar:'يُبدأ به مع مراقبة تخطيط القلب. يجب أن يبقى البوتاسيوم طبيعياً — أبلغ فوراً عن القيء أو الإسهال. لا يُوقف فجأة.'},
  ci:['asthma', 'qt', 'bradycardia', 'hypoK', 'renal30'],
  ask:['rhythm', 'asthma', 'dehydration'] },

{ sci:'Mexiletine', ar:'ميكسيليتين', atc:'C01BB02', cat:'cvs.arrhythmia', form:'injection',
  doses:['25 mg/mL injection', '167 mg capsule'], brand:['Namuscla', 'Mexitil'],
  take:['withFood'],
  notes:{en:'For dangerous heart rhythms (and, as capsules, muscle stiffness in myotonia). With food; nausea, tremor and dizziness are common. Heart tracings are checked.',
         ar:'لاضطرابات نظم القلب الخطيرة (وككبسولات لتيبّس العضلات في الوهن التأتري). مع الطعام؛ الغثيان والرعاش والدوخة شائعة. يُفحص تخطيط القلب.'},
  ix:[
    ['Theophylline', S, 'Raises theophylline — toxicity.', 'يرفع الثيوفيلين — تسمّم.'],
    ['#inducer', W, 'Lowers mexiletine.', 'يخفض الميكسيليتين.']
  ],
  ci:['heartBlock', 'hfSevere', 'recentMI'],
  ask:['heart', 'liver', 'otherMeds'] },

{ sci:'Flecainide', ar:'فليكاينيد', atc:'C01BC04', cat:'cvs.arrhythmia', form:'tablet',
  doses:['50 mg', '100 mg'], brand:['Tambocor'],
  tags:['qtPossible'],
  notes:{en:'For rhythm problems in a heart without structural disease. Keep to the dose; report palpitations, fainting or breathlessness.',
         ar:'لاضطرابات النظم في قلب سليم البنية. التزم بالجرعة؛ أبلغ عن الخفقان أو الإغماء أو ضيق النفس.'},
  ci:[{en:'Heart failure', ar:'قصور القلب'}, {en:'Previous heart attack or structural heart disease', ar:'احتشاء سابق أو مرض قلبي بنيوي'}, 'heartBlock', 'sickSinus'],
  ask:['heart', 'rhythm', 'otherMeds'] },

{ sci:'Propafenone', ar:'بروبافينون', atc:'C01BC03', cat:'cvs.arrhythmia', form:'tablet',
  doses:['150 mg', '300 mg'], brand:['Rytmonorm'],
  tags:['qtPossible'],
  notes:{en:'For rhythm problems; swallow whole after food. A metallic taste is common. Report palpitations, fainting or breathlessness.',
         ar:'لاضطرابات النظم؛ يُبلع كاملاً بعد الطعام. طعم معدني في الفم شائع. أبلغ عن الخفقان أو الإغماء أو ضيق النفس.'},
  ix:[
    ['Digoxin', S, 'Raises digoxin — check the level.', 'يرفع الديجوكسين — افحص مستواه.'],
    ['Warfarin', S, 'Raises the INR.', 'يرفع INR.']
  ],
  ci:['hfDecomp', 'heartBlock', 'sickSinus', 'bradycardia', {en:'Marked obstructive lung disease', ar:'مرض رئوي انسدادي واضح'}],
  ask:['heart', 'asthma', 'otherMeds'] },

{ sci:'Adenosine', ar:'أدينوزين', atc:'C01EB10', cat:'cvs.arrhythmia', form:'injection',
  doses:['6 mg/2 mL'], brand:['Adenocor'],
  notes:{en:'Hospital only — a rapid intravenous push that stops certain fast rhythms. A few seconds of chest tightness, flushing and a sense of doom are expected and pass.',
         ar:'للمستشفى فقط — دفعة وريدية سريعة توقف بعض أنواع تسرّع القلب. ثوانٍ من ضيق الصدر والاحمرار والشعور بالرهبة متوقعة وتزول.'},
  ix:[
    ['Dipyridamole', S, 'Greatly increases the effect — a much smaller dose is needed.', 'يزيد المفعول كثيراً — تلزم جرعة أصغر بكثير.'],
    ['#xanthine', S, 'Theophylline blocks adenosine.', 'الثيوفيلين يُبطل مفعول الأدينوزين.']
  ],
  ci:['heartBlock', 'sickSinus', 'asthma', 'qt'],
  ask:['asthma', 'otherMeds'] },

/* ---------- Heart failure and inotropes ---------- */
{ sci:'Digoxin', ar:'ديجوكسين', atc:'C01AA05', cat:'cvs.hf', form:'tablet',
  doses:['62.5 mcg', '125 mcg', '250 mcg'], brand:['Lanoxin'],
  tags:['digoxin', 'bradycardic'],
  notes:{en:'A narrow therapeutic window. Nausea, visual disturbance and haloes are toxicity, not ordinary side effects.',
         ar:'هامش علاجي ضيّق. الغثيان والاضطراب البصري ورؤية الهالات علامات تسمّم لا آثار جانبية عادية.'},
  ix:[
    ['Furosemide', S, 'The potassium loss makes digoxin toxic.', 'نقص البوتاسيوم يزيد سميّة الديجوكسين.'],
    ['Amiodarone', C, 'Doubles digoxin levels — halve the dose.', 'يضاعف الديجوكسين — تُنصّف الجرعة.'],
    ['Verapamil', S, 'Raises digoxin.', 'يرفع الديجوكسين.']
  ],
  ci:['heartBlock', 'hocm', {en:'Ventricular tachycardia', ar:'تسرّع بطيني'}],
  ask:['slowPulse', 'kidney', 'labs'] },

{ sci:'Sacubitril/Valsartan', ar:'ساكوبيتريل/فالسارتان', atc:'C09DX04', cat:'cvs.hf', form:'tablet',
  doses:['24/26 mg', '49/51 mg', '97/103 mg'], brand:['Entresto'],
  tags:['raas'],
  notes:{en:'For heart failure, twice a day. Dizziness is common; potassium and kidney tests are part of taking it. Never within 36 hours of an ACE inhibitor. Not in pregnancy.',
         ar:'لقصور القلب، مرتين يومياً. الدوخة شائعة؛ وتحاليل البوتاسيوم والكلى جزء من استعماله. لا يُؤخذ أبداً خلال 36 ساعة من مثبط ACE. لا يُستعمل في الحمل.'},
  ix:[
    ['#acei', C, 'Angio-oedema — contraindicated; stop the ACE inhibitor 36 hours before the first dose.', 'وذمة وعائية — ممنوع الجمع؛ يُوقف مثبط ACE قبل الجرعة الأولى بـ 36 ساعة.']
  ],
  ci:['preg', 'angioedema', 'hepSevere'],
  ask:['preg', {en:'Have you taken an ACE inhibitor (such as lisinopril, enalapril or ramipril) in the last 36 hours?', ar:'هل أخذت مثبط ACE (مثل ليزينوبريل أو إينالابريل أو راميبريل) خلال آخر 36 ساعة؟'}, 'kidney'] },

{ sci:'Dobutamine', ar:'دوبوتامين', atc:'C01CA07', cat:'cvs.hf', form:'injection',
  doses:['250 mg/20 mL'], brand:['Dobutrex'],
  tags:['sympathomimetic'],
  notes:{en:'An intravenous infusion in hospital to support a failing heart, with heart rate and rhythm monitored.',
         ar:'تسريب وريدي في المستشفى لدعم القلب الفاشل، مع مراقبة سرعة القلب ونظمه.'},
  ci:['hocm', 'aorticStenosis'],
  ask:['heart'] },

{ sci:'Milrinone', ar:'ميلرينون', atc:'C01CE02', cat:'cvs.hf', form:'injection',
  doses:['10 mg/10 mL'], brand:['Primacor'],
  notes:{en:'An intravenous infusion in intensive care for acute heart failure; rhythm and blood pressure are monitored, and the dose is cut in kidney impairment.',
         ar:'تسريب وريدي في العناية المركّزة لقصور القلب الحاد؛ يُراقب النظم والضغط، وتُخفّض الجرعة في القصور الكلوي.'},
  ix:[
    ['#nitrate', W, 'More low blood pressure.', 'مزيد من انخفاض الضغط.']
  ],
  ci:['aorticStenosis', 'hocm'],
  ask:['kidney'] },

{ sci:'Levosimendan', ar:'ليفوسيميندان', atc:'C01CX08', cat:'cvs.hf', form:'injection',
  doses:['12.5 mg/5 mL'], brand:['Simdax'],
  notes:{en:'A hospital infusion for acute heart failure; its effect lasts for days after the infusion ends.',
         ar:'تسريب في المستشفى لقصور القلب الحاد؛ يستمر أثره أياماً بعد انتهاء التسريب.'},
  ix:[
    ['#nitrate', W, 'More low blood pressure.', 'مزيد من انخفاض الضغط.']
  ],
  ci:['hypotension', 'renal30', 'hepSevere'],
  ask:['kidney', 'liver'] },

/* ---------- Vasopressors ---------- */

{ sci:'Adrenaline', ar:'أدرينالين', atc:'C01CA24', cat:'cvs.pressor', form:'injection',
  doses:['1 mg/mL (1:1000)', '0.1 mg/mL (1:10,000)', '0.15 mg and 0.3 mg auto-injector'], brand:['EpiPen'], aka:['Epinephrine'],
  tags:['sympathomimetic'],
  notes:{en:'For anaphylaxis: 0.5 mg (0.5 mL of 1:1000) into the outer thigh muscle for an adult, repeated after 5 minutes if needed — then emergency care. With auto-injectors, carry two and check the expiry date.',
         ar:'للتأق (الصدمة التحسسية): 0.5 ملغ (0.5 مل من تركيز 1:1000) في عضلة الفخذ الخارجية للبالغ، تُكرّر بعد 5 دقائق عند الحاجة — ثم إلى الطوارئ. مع الأقلام الجاهزة، احمل قلمين وتحقّق من تاريخ الصلاحية.'},
  ix:[
    ['#bbNonSelective', S, 'Unopposed alpha effect — severe hypertension, and anaphylaxis responds poorly.', 'تأثير ألفا غير متوازن — ارتفاع ضغط شديد، والتأق يستجيب ضعيفاً.']
  ],
  ci:[{en:'None in anaphylaxis — it is given regardless', ar:'لا موانع في التأق — يُعطى في جميع الأحوال'}],
  ask:['whoFor', 'injectTech'] },

{ sci:'Noradrenaline', ar:'نورأدرينالين', atc:'C01CA03', cat:'cvs.pressor', form:'injection',
  doses:['4 mg/4 mL', '8 mg/8 mL'], brand:['Levophed'], aka:['Norepinephrine', 'Noradrenaline tartrate'],
  tags:['sympathomimetic'],
  notes:{en:'An intensive-care infusion for shock, through a large vein, with blood pressure watched continuously. Leakage at the drip site damages tissue.',
         ar:'تسريب في العناية المركّزة للصدمة، عبر وريد كبير، مع مراقبة الضغط باستمرار. تسرّبه خارج الوريد يُتلف الأنسجة.'},
  ci:[{en:'Low blood pressure from uncorrected blood-volume loss', ar:'هبوط ضغط بسبب نقص حجم دم غير مصحّح'}],
  ask:['maoi'] },

{ sci:'Dopamine', ar:'دوبامين', atc:'C01CA04', cat:'cvs.pressor', form:'injection',
  doses:['200 mg/5 mL'], brand:['Intropin'],
  tags:['sympathomimetic'],
  notes:{en:'An intensive-care infusion for shock or low cardiac output; the drip site is watched, as leakage damages tissue.',
         ar:'تسريب في العناية المركّزة للصدمة أو ضعف نتاج القلب؛ يُراقب موضع التسريب لأن تسرّبه يُتلف الأنسجة.'},
  ci:['phaeo', {en:'Uncorrected fast arrhythmia or ventricular fibrillation', ar:'تسرّع نظم أو رجفان بطيني غير مصحّح'}],
  ask:['maoi'] },

{ sci:'Ephedrine', ar:'إيفيدرين', atc:'C01CA26', cat:'cvs.pressor', form:'injection',
  doses:['30 mg/mL injection', '3 mg/mL injection'],
  tags:['sympathomimetic'],
  notes:{en:'Mostly an injection to raise blood pressure during anaesthesia. A precursor chemical: sales are recorded in the precursor list.',
         ar:'حقنة في الغالب لرفع الضغط أثناء التخدير. مادة سليفة: تُسجّل مبيعاته في قائمة السلائف.'},
  ci:['uncontrolledHtn', 'angleGlaucoma', 'maoi'],
  ask:['maoi', 'bp'] },

{ sci:'Vasopressin', ar:'فازوبريسين', atc:'H01BA01', cat:'cvs.pressor', form:'injection',
  doses:['20 units/mL'], brand:['Pitressin'],
  notes:{en:'An intensive-care infusion for shock that does not respond to other pressors; it can narrow the heart’s own arteries.',
         ar:'تسريب في العناية المركّزة للصدمة غير المستجيبة لرافعات الضغط الأخرى؛ قد يضيّق شرايين القلب نفسها.'},
  ci:['ihd'],
  ask:['heart'] },

{ sci:'Terlipressin', ar:'تيرليبريسين', atc:'H01BA04', cat:'cvs.pressor', form:'injection',
  doses:['1 mg vial'], brand:['Glypressin'],
  notes:{en:'Hospital use for bleeding varices in the gullet and for kidney failure in liver disease; pale skin, cramps and a slow pulse are watched for.',
         ar:'للمستشفى لنزف دوالي المريء وللفشل الكلوي المرافق لمرض الكبد؛ يُراقب شحوب الجلد والتقلّصات وبطء النبض.'},
  ix:[
    ['#bradycardic', S, 'Severe slowing of the heart.', 'بطء شديد في القلب.']
  ],
  ci:['preg', 'ihd'],
  ask:['heart', 'preg'] },

/* ---------- Pulmonary hypertension ---------- */

{ sci:'Bosentan', ar:'بوسنتان', atc:'C02KX01', cat:'cvs.pah', form:'tablet',
  doses:['62.5 mg', '125 mg'], brand:['Tracleer'],
  tags:['inducer', 'sub3a4'],
  notes:{en:'Liver tests every month, and a pregnancy test every month: it causes birth defects and makes hormonal contraception unreliable, so a second method is needed.',
         ar:'فحص الكبد شهرياً واختبار حمل شهرياً: يسبّب تشوّهات للجنين ويجعل موانع الحمل الهرمونية غير موثوقة، فتلزم وسيلة ثانية.'},
  ix:[
    ['Ciclosporin', C, 'Raises bosentan sharply and lowers ciclosporin — contraindicated.', 'يرفع البوسنتان بشدة ويخفض السيكلوسبورين — ممنوع الجمع.'],
    ['Glibenclamide', C, 'Liver injury — contraindicated.', 'أذية كبدية — ممنوع الجمع.']
  ],
  ci:['pregTeratogen', 'hepModSevere'],
  ask:['pregTest', 'liver', 'labs'] },

{ sci:'Ambrisentan', ar:'أمبريسنتان', atc:'C02KX02', cat:'cvs.pah', form:'tablet',
  doses:['5 mg', '10 mg'], brand:['Volibris', 'Letairis'],
  notes:{en:'A pregnancy test every month — it causes birth defects. Leg swelling and a blocked nose are common.',
         ar:'اختبار حمل شهرياً — يسبّب تشوّهات للجنين. تورّم الساقين وانسداد الأنف شائعان.'},
  ix:[
    ['Ciclosporin', S, 'Raises ambrisentan — the dose is capped at 5 mg.', 'يرفع الأمبريسنتان — لا تتجاوز الجرعة 5 ملغ.']
  ],
  ci:['pregTeratogen', 'hepSevere', {en:'Idiopathic pulmonary fibrosis', ar:'التليّف الرئوي مجهول السبب'}],
  ask:['pregTest', 'liver'] },

{ sci:'Macitentan', ar:'ماسيتنتان', atc:'C02KX04', cat:'cvs.pah', form:'tablet',
  doses:['10 mg'], brand:['Opsumit'],
  tags:['sub3a4'],
  notes:{en:'Once a day. A pregnancy test every month — it causes birth defects. Blood count and liver tests are checked.',
         ar:'مرة واحدة يومياً. اختبار حمل شهرياً — يسبّب تشوّهات للجنين. يُفحص تعداد الدم ووظائف الكبد.'},
  ci:['pregTeratogen', 'hepSevere'],
  ask:['pregTest', 'liver', 'labs'] },

{ sci:'Riociguat', ar:'ريوسيغوات', atc:'C02KX05', cat:'cvs.pah', form:'tablet',
  doses:['0.5 mg', '1 mg', '1.5 mg', '2 mg', '2.5 mg'], brand:['Adempas'],
  notes:{en:'Three times a day, built up slowly. It causes birth defects — a pregnancy test every month. Never with nitrates or Viagra-type medicines.',
         ar:'ثلاث مرات يومياً، تُرفع الجرعة تدريجياً. يسبّب تشوّهات للجنين — اختبار حمل شهرياً. لا يُجمع أبداً مع النترات أو أدوية من نوع الفياغرا.'},
  ix:[
    ['#pde5', C, 'Severe hypotension — contraindicated.', 'هبوط ضغط شديد — ممنوع الجمع.'],
    ['#nitrate', C, 'Severe hypotension — contraindicated.', 'هبوط ضغط شديد — ممنوع الجمع.']
  ],
  ci:['pregTeratogen', 'nitrates', 'hypotension'],
  ask:['pregTest', 'nitrates', 'pde5'] },

/* ---------- Circulation and veins ---------- */

{ sci:'Pentoxifylline', ar:'بنتوكسيفيلين', atc:'C04AD03', cat:'cvs.vascular', form:'tablet',
  doses:['400 mg SR'], brand:['Trental'],
  take:['afterFood'],
  notes:{en:'Swallow whole, after meals. Nausea and flushing are common. Tell us about any bleeding.',
         ar:'يُبلع كاملاً بعد الوجبات. الغثيان والاحمرار شائعان. أبلغ عن أي نزف.'},
  ix:[
    ['#anticoag', W, 'More bleeding — monitor.', 'نزف أكثر — يُراقب.'],
    ['Theophylline', W, 'Raises theophylline.', 'يرفع الثيوفيلين.']
  ],
  ci:[{en:'Recent brain or retinal haemorrhage', ar:'نزف حديث في الدماغ أو الشبكية'}, 'recentMI', 'bleeding'],
  ask:['bleeding', 'thinner', 'heart'] },

{ sci:'Cilostazol', ar:'سيلوستازول', atc:'B01AC23', cat:'cvs.vascular', form:'tablet',
  doses:['50 mg', '100 mg'], brand:['Pletal'],
  tags:['antiplatelet', 'sub3a4', 'qt'], take:['beforeFood'],
  notes:{en:'For leg pain on walking: twice a day, half an hour before or two hours after breakfast and dinner. Headache, loose stools and palpitations are common. No grapefruit juice.',
         ar:'لألم الساق عند المشي: مرتين يومياً، قبل الفطور والعشاء بنصف ساعة أو بعدهما بساعتين. الصداع وليونة البراز والخفقان شائعة. لا عصير جريب فروت.'},
  ix:[
    ['Grapefruit juice', W, 'Raises cilostazol.', 'يرفع السيلوستازول.']
  ],
  ci:[{en:'Heart failure of any severity', ar:'قصور القلب بأي درجة'}, 'bleeding', 'unstableAngina'],
  ask:['heartFailure', 'thinner', 'bleeding'] },

{ sci:'Diosmin', ar:'ديوسمين', atc:'C05CA53', cat:'cvs.vascular', form:'tablet',
  doses:['500 mg (with hesperidin)', '1000 mg'], brand:['Daflon'], aka:['Diosmin/Hesperidin', 'Micronised purified flavonoid fraction'],
  take:['withFood'],
  notes:{en:'For varicose veins and piles, with meals. For an acute attack of piles a short course at a higher dose is used. Mild stomach upset is the usual side effect.',
         ar:'للدوالي والبواسير، مع الوجبات. لنوبة البواسير الحادة تُستعمل جرعة أعلى لفترة قصيرة. انزعاج المعدة الخفيف أشيع آثاره.'},
  ask:['redFlagsGI', 'preg'] },

{ sci:'Calcium dobesilate', ar:'دوبيسيلات الكالسيوم', atc:'C05BX01', cat:'cvs.vascular', form:'capsule',
  doses:['250 mg', '500 mg'], brand:['Doxium'],
  take:['withFood'],
  notes:{en:'For diabetic eye changes and vein problems, with meals. Rarely it lowers white cells — report fever or a sore throat.',
         ar:'لتغيّرات العين السكرية ومشاكل الأوردة، مع الوجبات. نادراً ما يخفض الكريات البيض — أبلغ عن الحرارة أو التهاب الحلق.'},
  ci:['preg1'],
  ask:['infection', 'preg'] },

{ sci:'Polidocanol', ar:'بوليدوكانول', atc:'C05BB02', cat:'cvs.vascular', form:'injection',
  doses:['0.5%', '1%', '2%', '3%'], brand:['Aethoxysklerol'], aka:['Lauromacrogol 400'],
  notes:{en:'Injected by a doctor to close varicose and spider veins; compression stockings are worn afterwards as advised, and walking is encouraged.',
         ar:'يحقنه الطبيب لإغلاق الدوالي والأوردة العنكبوتية؛ تُلبس الجوارب الضاغطة بعده حسب التعليمات، ويُشجَّع المشي.'},
  ci:['vte', {en:'Bed rest or immobility', ar:'ملازمة الفراش أو عدم الحركة'}],
  ask:['clots', 'preg'] },

{ sci:'Mucopolysaccharide polysulfate', ar:'متعدد كبريتات عديد السكاريد المخاطي', atc:'C05BA01', cat:'cvs.vascular', form:'cream',
  doses:['0.3% cream', '0.3% gel'], brand:['Hirudoid'], aka:['Heparinoid'],
  notes:{en:'Rub in gently over bruises and superficial vein inflammation two or three times a day; not on broken skin, the eyes or mucous membranes.',
         ar:'يُدلك بلطف فوق الكدمات والتهاب الأوردة السطحية مرتين أو ثلاثاً يومياً؛ ليس على جلد مجروح ولا في العينين ولا على الأغشية المخاطية.'},
  ci:[{en:'Broken or infected skin', ar:'الجلد المجروح أو الملتهب'}],
  ask:[{en:'Is the whole leg swollen, or the calf painful? That needs a doctor, not a cream.', ar:'هل الساق كلها متورّمة، أو ربلة الساق مؤلمة؟ هذا يحتاج طبيباً لا كريماً.'}] }

];
