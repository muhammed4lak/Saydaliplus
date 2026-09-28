/* Diabetes and weight: insulins, the rest of the diabetes medicines, and
   weight-loss drugs. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Insulins ---------- */
{ sci:'Insulin glargine', ar:'إنسولين غلارجين', atc:'A10AE04', cat:'end.insulin', form:'injection',
  doses:['100 U/mL', '300 U/mL'], brand:['Lantus', 'Toujeo'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['sameTime'],
  notes:{en:'Basal, once daily at the same time. Never mixed with another insulin in the syringe. The pen in use stays out of the fridge for 28 days.',
         ar:'قاعدي مرة يومياً بنفس الوقت. لا يُخلط مع إنسولين آخر في المحقنة. القلم قيد الاستعمال يُحفظ خارج الثلاجة 28 يوماً.'},
  ix:[
    ['Atenolol', S, 'Masks the warning signs of hypoglycaemia.', 'يُخفي أعراض نقص السكر.'],
    ['Prednisolone', S, 'Raises glucose — the dose may need to go up.', 'يرفع سكر الدم — قد تلزم زيادة الجرعة.']
  ],
  ci:['hypoglycaemia'],
  ask:['hypo', 'injectTech', 'meals'] },

{ sci:'Insulin regular', ar:'إنسولين نظامي', atc:'A10AB01', cat:'end.insulin', form:'injection',
  doses:['100 U/mL'], brand:['Actrapid', 'Humulin R'], aka:['Soluble insulin'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['beforeFood'],
  notes:{en:'Thirty minutes before the meal, not with it. A clear solution: cloudiness means it has spoiled.',
         ar:'قبل الوجبة بـ 30 دقيقة — وليس معها. محلول رائق: العكارة تعني التلف.'},
  ix:[
    ['Atenolol', S, 'Masks the warning signs of hypoglycaemia.', 'يُخفي أعراض نقص السكر.'],
    ['Prednisolone', S, 'Raises glucose.', 'يرفع سكر الدم.']
  ],
  ci:['hypoglycaemia'],
  ask:['hypo', 'injectTech', 'meals'] },

{ sci:'Insulin aspart', ar:'إنسولين أسبارت', atc:'A10AB05', cat:'end.insulin', form:'injection',
  doses:['100 units/mL pen and vial', '30/70 biphasic'], brand:['NovoRapid', 'NovoMix 30', 'Fiasp'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['beforeFood'],
  notes:{en:'Rapid-acting: inject just before a meal, or right after it. The pen in use keeps four weeks at room temperature; spares go in the fridge — never frozen.',
         ar:'سريع المفعول: يُحقن قبل الوجبة مباشرة أو بعدها فوراً. القلم المستعمل يبقى أربعة أسابيع بحرارة الغرفة؛ والاحتياطي في الثلاجة — دون تجميد أبداً.'},
  ci:['hypoglycaemia'],
  ask:['hypo', 'injectTech', 'meals'] },

{ sci:'Insulin lispro', ar:'إنسولين ليسبرو', atc:'A10AB04', cat:'end.insulin', form:'injection',
  doses:['100 units/mL', '200 units/mL', 'Mix 25 and Mix 50'], brand:['Humalog', 'Humalog Mix'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['beforeFood'],
  notes:{en:'Rapid-acting: inject within 15 minutes before a meal. Mixes are rolled gently until evenly cloudy. Keep spares in the fridge, never frozen.',
         ar:'سريع المفعول: يُحقن خلال 15 دقيقة قبل الوجبة. المخاليط تُقلّب بلطف حتى تصبح عكرة بتجانس. يُحفظ الاحتياطي في الثلاجة دون تجميد.'},
  ci:['hypoglycaemia'],
  ask:['hypo', 'injectTech', 'meals'] },

{ sci:'Insulin glulisine', ar:'إنسولين غلوليزين', atc:'A10AB06', cat:'end.insulin', form:'injection',
  doses:['100 units/mL pen'], brand:['Apidra'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['beforeFood'],
  notes:{en:'Rapid-acting: inject within 15 minutes before or just after a meal. Keep spares in the fridge.',
         ar:'سريع المفعول: يُحقن خلال 15 دقيقة قبل الوجبة أو بعدها مباشرة. يُحفظ الاحتياطي في الثلاجة.'},
  ci:['hypoglycaemia'],
  ask:['hypo', 'injectTech', 'meals'] },

{ sci:'Insulin detemir', ar:'إنسولين ديتيمير', atc:'A10AE05', cat:'end.insulin', form:'injection',
  doses:['100 units/mL pen'], brand:['Levemir'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['sameTime'],
  notes:{en:'A long-acting basal insulin, once or twice a day at the same times. Never mixed with other insulins in one syringe.',
         ar:'أنسولين قاعدي طويل المفعول، مرة أو مرتين يومياً في الأوقات نفسها. لا يُمزج مع أنسولين آخر في محقنة واحدة.'},
  ci:['hypoglycaemia'],
  ask:['hypo', 'injectTech', 'meals'] },

{ sci:'Insulin degludec', ar:'إنسولين ديغلوديك', atc:'A10AE06', cat:'end.insulin', form:'injection',
  doses:['100 units/mL', '200 units/mL', 'with insulin aspart', 'with liraglutide'], brand:['Tresiba', 'Ryzodeg', 'Xultophy'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['sameTime'],
  notes:{en:'An ultra-long basal insulin, once a day — ideally at the same time, but it tolerates some variation. Check the pen strength (100 or 200) before dialling.',
         ar:'أنسولين قاعدي فائق طول المفعول، مرة واحدة يومياً — يُفضّل في الوقت نفسه، ويتحمّل بعض التغيير. تحقّق من تركيز القلم (100 أو 200) قبل ضبط الجرعة.'},
  ci:['hypoglycaemia'],
  ask:['hypo', 'injectTech', 'meals'] },

{ sci:'Insulin isophane', ar:'إنسولين إيزوفان', atc:'A10AC01', cat:'end.insulin', form:'injection',
  doses:['100 units/mL', '30/70 biphasic with soluble insulin'], brand:['Humulin N', 'Insulatard', 'Humulin 70/30', 'Mixtard 30'], aka:['NPH insulin', 'Isophane insulin', 'Biphasic isophane insulin', 'Human insulin'],
  tags:['antidiabetic', 'hypoglycaemic'],
  notes:{en:'Cloudy insulin: roll and tip it about ten times until evenly milky before every injection. The 30/70 mixes go 30 minutes before breakfast and dinner.',
         ar:'أنسولين عكر: يُقلّب ويُدحرج نحو عشر مرات حتى يصبح حليبياً متجانساً قبل كل حقنة. مخاليط 30/70 تُحقن قبل الفطور والعشاء بنصف ساعة.'},
  ci:['hypoglycaemia'],
  ask:['hypo', 'injectTech', 'meals'] },

/* ---------- Diabetes medicines (non-insulin) ---------- */
{ sci:'Metformin', ar:'ميتفورمين', atc:'A10BA02', cat:'end.diabetes', form:'tablet',
  doses:['500 mg', '850 mg', '1000 mg'], brand:['Glucophage'],
  tags:['antidiabetic'], take:['withFood'],
  notes:{en:'With food and built up slowly — GI upset is the main reason people quit, and it passes. Hold before iodinated contrast imaging.',
         ar:'مع الطعام ويُرفع تدريجياً — الاضطراب المعوي سبب التوقف الأول وهو يزول. يُوقف مؤقتاً قبل التصوير بصبغة اليود.'},
  ix:[
    ['#contrast', C, 'Lactic acidosis risk — withhold before the procedure.', 'خطر الحماض اللبني — يُوقف قبل الإجراء.'],
    ['Furosemide', W, 'Dehydration raises the lactic acidosis risk.', 'التجفاف يرفع خطر الحماض اللبني.']
  ],
  ci:['renal30', 'dka', 'hepSevere'],
  ask:['kidney', 'dehydration', 'alcohol'] },

{ sci:'Gliclazide', ar:'غليكلازيد', atc:'A10BB09', cat:'end.diabetes', form:'tablet',
  doses:['30 mg MR', '60 mg MR', '80 mg'], brand:['Diamicron'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['withBreakfast'],
  notes:{en:'With breakfast. It causes hypoglycaemia — they should carry fast sugar at all times.',
         ar:'مع الفطور. يسبّب نقص سكر — يجب أن يحمل المريض سكّراً سريعاً معه دائماً.'},
  ix:[
    ['Atenolol', W, 'Masks the warning signs of hypoglycaemia.', 'يُخفي أعراض نقص السكر.'],
    ['Fluconazole', S, 'Raises gliclazide and the risk of a hypo.', 'يرفع الغليكلازيد وخطر نقص السكر.'],
    ['Trimethoprim/Sulfamethoxazole', S, 'Severe hypoglycaemia.', 'نقص سكر شديد.']
  ],
  ci:['type1', 'dka', 'hepRenalSevere'],
  ask:['hypo', 'meals', 'kidney'] },

{ sci:'Glimepiride', ar:'غليميبيريد', atc:'A10BB12', cat:'end.diabetes', form:'tablet',
  doses:['1 mg', '2 mg', '3 mg', '4 mg'], brand:['Amaryl'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['withBreakfast'],
  notes:{en:'Once daily with the first meal. Never take it and then skip the meal.',
         ar:'مرة واحدة مع أول وجبة. لا تُفوّت الوجبة بعد أخذه.'},
  ix:[
    ['Fluconazole', S, 'Risk of hypoglycaemia.', 'خطر نقص سكر.'],
    ['Atenolol', W, 'Masks the warning signs of hypoglycaemia.', 'يُخفي أعراض نقص السكر.']
  ],
  ci:['type1', 'dka', 'pregBf'],
  ask:['hypo', 'meals', 'kidney'] },

{ sci:'Glibenclamide', ar:'غليبنكلاميد', atc:'A10BB01', cat:'end.diabetes', form:'tablet',
  doses:['2.5 mg', '5 mg'], brand:['Daonil', 'Euglucon'], aka:['Glyburide'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['withBreakfast'],
  notes:{en:'The longest-acting sulfonylurea and the most dangerous in the elderly — a hypo can run for hours.',
         ar:'أطول السلفونيل يوريا مفعولاً وأخطرها على كبار السن — نقص السكر قد يطول ساعات.'},
  ix:[
    ['Fluconazole', S, 'Risk of prolonged hypoglycaemia.', 'خطر نقص سكر مطوّل.'],
    ['Trimethoprim/Sulfamethoxazole', S, 'Severe hypoglycaemia.', 'نقص سكر شديد.']
  ],
  ci:['type1', 'renal', {en:'Elderly patients', ar:'كبار السن'}],
  ask:['hypo', 'meals', 'kidney'] },

{ sci:'Sitagliptin', ar:'سيتاغليبتين', atc:'A10BH01', cat:'end.diabetes', form:'tablet',
  doses:['25 mg', '50 mg', '100 mg'], brand:['Januvia'],
  tags:['antidiabetic'],
  notes:{en:'No hypoglycaemia on its own. Dose reduced in kidney impairment. Severe persistent abdominal pain: think pancreatitis.',
         ar:'لا يسبّب نقص سكر وحده. تُخفّض الجرعة مع قصور الكلية. ألم بطني شديد مستمر: احتمال التهاب بنكرياس.'},
  ix:[
    ['Gliclazide', W, 'Raises hypo risk — the sulfonylurea may need reducing.', 'يزيد خطر نقص السكر — قد تُخفّض السلفونيل يوريا.']
  ],
  ci:['type1', 'dka', 'pancreatitis'],
  ask:['kidney', 'pancreatitis'] },

{ sci:'Empagliflozin', ar:'إمباغليفلوزين', atc:'A10BK03', cat:'end.diabetes', form:'tablet',
  doses:['10 mg', '25 mg'], brand:['Jardiance'],
  tags:['antidiabetic'], take:['morning'],
  notes:{en:'Hold on sick days with dehydration. Genital thrush is common — hygiene and fluids. Ketoacidosis can happen with a normal glucose.',
         ar:'يُوقف أيام المرض مع التجفاف. إنتانات تناسلية فطرية شائعة — نظافة وسوائل. حماض كيتوني ممكن مع سكر طبيعي.'},
  ix:[
    ['Furosemide', S, 'Dehydration and hypotension.', 'تجفاف وهبوط ضغط.'],
    ['Gliclazide', W, 'Raises hypo risk.', 'يزيد خطر نقص السكر.']
  ],
  ci:['type1', 'dka', 'pregBf'],
  ask:['kidney', 'dehydration', 'uti'] },

{ sci:'Glipizide', ar:'غليبيزيد', atc:'A10BB07', cat:'end.diabetes', form:'tablet',
  doses:['5 mg', '10 mg'], brand:['Minidiab', 'Glucotrol'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['beforeFood'],
  notes:{en:'Half an hour before breakfast (and dinner if twice a day). Never skip meals on it — low sugar can follow.',
         ar:'قبل الفطور بنصف ساعة (والعشاء إن كان مرتين يومياً). لا تترك الوجبات معه — قد يعقبه هبوط سكر.'},
  ci:['type1', 'dka', 'hepSevere'],
  ask:['hypo', 'meals', 'kidney'] },

{ sci:'Pioglitazone', ar:'بيوغليتازون', atc:'A10BG03', cat:'end.diabetes', form:'tablet',
  doses:['15 mg', '30 mg', '45 mg', 'with metformin'], brand:['Actos'],
  tags:['antidiabetic'],
  notes:{en:'Once a day. It can cause fluid retention and weight gain — report swelling or breathlessness. Report blood in the urine (a small bladder-cancer risk).',
         ar:'مرة واحدة يومياً. قد يسبّب احتباس السوائل وزيادة الوزن — أبلغ عن التورّم أو ضيق النفس. أبلغ عن الدم في البول (خطر ضئيل لسرطان المثانة).'},
  ci:[{en:'Heart failure, current or previous', ar:'قصور القلب، حالياً أو سابقاً'}, 'hepActive', {en:'Bladder cancer or unexplained blood in the urine', ar:'سرطان المثانة أو دم غير مبرّر في البول'}, 'dka'],
  ask:['heartFailure', 'liver', {en:'Have you had blood in your urine, or bladder cancer?', ar:'هل لاحظت دماً في البول، أو أُصبت بسرطان المثانة؟'}] },

{ sci:'Vildagliptin', ar:'فيلداغليبتين', atc:'A10BH02', cat:'end.diabetes', form:'tablet',
  doses:['50 mg', '50/850 mg and 50/1000 mg with metformin'], brand:['Galvus', 'Galvus Met'],
  tags:['antidiabetic'],
  notes:{en:'Twice a day. Liver tests are checked early on. Severe stomach pain going through to the back could be pancreatitis — stop and seek help.',
         ar:'مرتين يومياً. تُفحص وظائف الكبد في البداية. ألم البطن الشديد الممتد إلى الظهر قد يكون التهاب بنكرياس — أوقفه واطلب المساعدة.'},
  ci:['hep', 'dka'],
  ask:['liver', 'pancreatitis', 'kidney'] },

{ sci:'Linagliptin', ar:'ليناغليبتين', atc:'A10BH05', cat:'end.diabetes', form:'tablet',
  doses:['5 mg', 'with metformin', 'with empagliflozin'], brand:['Trajenta', 'Jentadueto', 'Glyxambi'],
  tags:['antidiabetic'],
  notes:{en:'Once a day; the dose does not change with kidney disease. Report severe stomach pain.',
         ar:'مرة واحدة يومياً؛ لا تتغيّر الجرعة مع أمراض الكلى. أبلغ عن ألم البطن الشديد.'},
  ci:['dka'],
  ask:['pancreatitis', 'diabetesMeds'] },

{ sci:'Saxagliptin', ar:'ساكساغليبتين', atc:'A10BH03', cat:'end.diabetes', form:'tablet',
  doses:['2.5 mg', '5 mg', 'with dapagliflozin'], brand:['Onglyza', 'Qtern'],
  tags:['antidiabetic', 'sub3a4'],
  notes:{en:'Once a day. Report severe stomach pain, or swelling and breathlessness (heart failure).',
         ar:'مرة واحدة يومياً. أبلغ عن ألم البطن الشديد، أو التورّم وضيق النفس (قصور القلب).'},
  ci:['dka'],
  ask:['kidney', 'pancreatitis', 'heartFailure'] },

{ sci:'Alogliptin', ar:'ألوغليبتين', atc:'A10BH04', cat:'end.diabetes', form:'tablet',
  doses:['6.25 mg', '12.5 mg', '25 mg'], brand:['Vipidia', 'Nesina'],
  tags:['antidiabetic'],
  notes:{en:'Once a day; the dose is lowered in kidney impairment. Report severe stomach pain.',
         ar:'مرة واحدة يومياً؛ تُخفّض الجرعة في القصور الكلوي. أبلغ عن ألم البطن الشديد.'},
  ci:['dka'],
  ask:['kidney', 'pancreatitis', 'heartFailure'] },

{ sci:'Dapagliflozin', ar:'داباغليفلوزين', atc:'A10BK01', cat:'end.diabetes', form:'tablet',
  doses:['5 mg', '10 mg', 'with metformin'], brand:['Forxiga', 'Farxiga', 'Xigduo'],
  tags:['antidiabetic'],
  notes:{en:'Once a day; also used for heart failure and kidney disease. Keep the genital area clean and dry, and drink enough. During vomiting or diarrhoea, or before surgery, stop it and ask — there is a ketoacidosis risk.',
         ar:'مرة واحدة يومياً؛ يُستعمل أيضاً لقصور القلب وأمراض الكلى. حافظ على نظافة المنطقة التناسلية وجفافها، واشرب ما يكفي. عند القيء أو الإسهال أو قبل الجراحة، أوقفه واستشر — هناك خطر حماض كيتوني.'},
  ci:['dka', 'type1', 'dehydration'],
  ask:['kidney', 'dehydration', 'uti'] },

{ sci:'Canagliflozin', ar:'كاناغليفلوزين', atc:'A10BK02', cat:'end.diabetes', form:'tablet',
  doses:['100 mg', '300 mg'], brand:['Invokana'],
  tags:['antidiabetic'], take:['beforeBreakfast'],
  notes:{en:'Before breakfast. Keep the genital area clean and dry; drink enough. Stop during vomiting, diarrhoea or before surgery and ask. Look after your feet — report sores.',
         ar:'قبل الفطور. حافظ على نظافة المنطقة التناسلية وجفافها؛ واشرب ما يكفي. أوقفه عند القيء أو الإسهال أو قبل الجراحة واستشر. اعتنِ بقدميك — أبلغ عن أي قرحة.'},
  ci:['dka', 'type1', 'dehydration'],
  ask:['kidney', 'dehydration', 'uti'] },

{ sci:'Repaglinide', ar:'ريباغلينيد', atc:'A10BX02', cat:'end.diabetes', form:'tablet',
  doses:['0.5 mg', '1 mg', '2 mg'], brand:['NovoNorm', 'Prandin'],
  tags:['antidiabetic', 'hypoglycaemic'], take:['beforeFood'],
  notes:{en:'Within 15 minutes before each main meal — skip the dose if you skip the meal.',
         ar:'خلال 15 دقيقة قبل كل وجبة رئيسية — تخطَّ الجرعة إن تخطّيت الوجبة.'},
  ix:[
    ['Clopidogrel', S, 'Raises repaglinide — low sugar.', 'يرفع الريباغلينيد — هبوط سكر.']
  ],
  ci:['hepSevere', 'dka', 'type1'],
  ask:['hypo', 'meals', 'otherMeds'] },

{ sci:'Acarbose', ar:'أكاربوز', atc:'A10BF01', cat:'end.diabetes', form:'tablet',
  doses:['50 mg', '100 mg'], brand:['Glucobay'],
  tags:['antidiabetic'], take:['withFood'],
  notes:{en:'With the first mouthful of each meal. Wind and bloating are common. If a low sugar happens (with other diabetes medicines), treat it with glucose, not table sugar.',
         ar:'مع أول لقمة من كل وجبة. الغازات والانتفاخ شائعان. إن حدث هبوط سكر (مع أدوية سكري أخرى)، عالجه بالغلوكوز لا بالسكر العادي.'},
  ci:['ibd', 'obstruction', 'hepSevere'],
  ask:['hypo', 'diabetesMeds', 'redFlagsGI'] },

{ sci:'Liraglutide', ar:'ليراغلوتايد', atc:'A10BJ02', cat:'end.diabetes', form:'injection',
  doses:['6 mg/mL pen (0.6–1.8 mg for diabetes; up to 3 mg for weight)'], brand:['Victoza', 'Saxenda'],
  tags:['antidiabetic'],
  notes:{en:'A daily injection under the skin. Nausea early on is common — eat smaller meals. Severe stomach pain going through to the back means stop and seek help (pancreatitis). Not in pregnancy.',
         ar:'حقنة يومية تحت الجلد. الغثيان في البداية شائع — تناول وجبات أصغر. ألم البطن الشديد الممتد إلى الظهر يستوجب الإيقاف وطلب المساعدة (التهاب البنكرياس). لا يُستعمل في الحمل.'},
  ci:['mtc', 'pancreatitis', 'preg'],
  ask:['pancreatitis', 'injectTech', 'preg'] },

{ sci:'Semaglutide', ar:'سيماغلوتايد', atc:'A10BJ06', cat:'end.diabetes', form:'injection',
  doses:['0.25–2 mg weekly pen', '2.4 mg weekly (weight)', '3 mg', '7 mg', '14 mg tablet'], brand:['Ozempic', 'Wegovy', 'Rybelsus'],
  tags:['antidiabetic'],
  notes:{en:'The injection is weekly on the same day. Tablets are taken on waking with a sip of water, 30 minutes before any food, drink or other medicine. Nausea early on; report severe stomach pain. Not in pregnancy.',
         ar:'الحقنة أسبوعية في اليوم نفسه. الأقراص تؤخذ عند الاستيقاظ مع رشفة ماء، قبل أي طعام أو شراب أو دواء آخر بنصف ساعة. غثيان في البداية؛ أبلغ عن ألم البطن الشديد. لا يُستعمل في الحمل.'},
  ci:['mtc', 'pancreatitis', 'preg'],
  ask:['pancreatitis', 'preg', 'injectTech'] },

{ sci:'Dulaglutide', ar:'دولاغلوتايد', atc:'A10BJ05', cat:'end.diabetes', form:'injection',
  doses:['0.75 mg', '1.5 mg', '3 mg', '4.5 mg weekly pen'], brand:['Trulicity'],
  tags:['antidiabetic'],
  notes:{en:'A weekly injection on the same day. Nausea and diarrhoea early on; report severe stomach pain. Not in pregnancy.',
         ar:'حقنة أسبوعية في اليوم نفسه. غثيان وإسهال في البداية؛ أبلغ عن ألم البطن الشديد. لا يُستعمل في الحمل.'},
  ci:['mtc', 'pancreatitis', 'preg'],
  ask:['pancreatitis', 'preg', 'injectTech'] },

{ sci:'Exenatide', ar:'إكسيناتايد', atc:'A10BJ01', cat:'end.diabetes', form:'injection',
  doses:['5 microgram', '10 microgram twice daily pen', '2 mg weekly'], brand:['Byetta', 'Bydureon'],
  tags:['antidiabetic'],
  notes:{en:'Twice-daily pens within an hour before the morning and evening meals; the weekly form on the same day each week. Report severe stomach pain.',
         ar:'الأقلام مرتين يومياً خلال ساعة قبل وجبتي الصباح والمساء؛ والشكل الأسبوعي في اليوم نفسه كل أسبوع. أبلغ عن ألم البطن الشديد.'},
  ci:['pancreatitis', 'renal30', 'preg'],
  ask:['pancreatitis', 'kidney', 'injectTech'] },

{ sci:'Tirzepatide', ar:'تيرزيباتايد', atc:'A10BX16', cat:'end.diabetes', form:'injection',
  doses:['2.5 mg', '5 mg', '7.5 mg', '10 mg', '12.5 mg', '15 mg weekly pen'], brand:['Mounjaro', 'Zepbound'],
  tags:['antidiabetic'],
  notes:{en:'A weekly injection. Nausea and diarrhoea at first. It makes the pill less reliable for four weeks after starting and after each dose increase — add condoms. Report severe stomach pain.',
         ar:'حقنة أسبوعية. غثيان وإسهال في البداية. يجعل حبوب منع الحمل أقل موثوقية لأربعة أسابيع بعد البدء وبعد كل رفع للجرعة — أضيفي الواقي. أبلغ عن ألم البطن الشديد.'},
  ix:[
    ['#hormonalContraceptive', S, 'The pill is less reliable for 4 weeks after starting and after each increase — add a barrier method.', 'حبوب منع الحمل أقل موثوقية 4 أسابيع بعد البدء وبعد كل رفع — أضيفي وسيلة حاجزة.']
  ],
  ci:['mtc', 'pancreatitis', 'preg'],
  ask:['pancreatitis', 'ocp', 'preg'] },

{ sci:'Glucagon', ar:'غلوكاغون', atc:'H04AA01', cat:'end.diabetes', form:'injection',
  doses:['1 mg kit', '3 mg nasal powder'], brand:['GlucaGen', 'Baqsimi'],
  notes:{en:'For a severe low sugar when the person cannot swallow: inject into the thigh (or spray into the nose), turn them on their side, and give sugar once they wake. Show the family how.',
         ar:'لهبوط السكر الشديد حين لا يستطيع المريض البلع: يُحقن في الفخذ (أو يُرشّ في الأنف)، ويُدار المريض على جانبه، ويُعطى سكراً حين يستيقظ. علّم العائلة طريقة استعماله.'},
  ci:['phaeo'],
  ask:['injectTech', 'whoFor'] },

/* ---------- Weight loss ---------- */

{ sci:'Orlistat', ar:'أورليستات', atc:'A08AB01', cat:'end.obesity', form:'capsule',
  doses:['60 mg', '120 mg'], brand:['Xenical', 'Alli'],
  take:['withFood'],
  notes:{en:'With each main meal that contains fat — skip it if the meal has none. Oily spotting and urgent stools follow fatty meals. A multivitamin at bedtime. Keep four hours from levothyroxine.',
         ar:'مع كل وجبة رئيسية تحتوي دهوناً — تخطَّه إن خلت الوجبة منها. البقع الزيتية والحاجة الملحّة للتبرّز تعقب الوجبات الدسمة. فيتامين متعدد قبل النوم. افصل بينه وبين الليفوثيروكسين أربع ساعات.'},
  ix:[
    ['Levothyroxine', W, 'Lowers absorption — four hours apart.', 'يقلّل الامتصاص — بفاصل أربع ساعات.'],
    ['Ciclosporin', S, 'Lowers ciclosporin — avoid, or separate and monitor.', 'يخفض السيكلوسبورين — يُتجنّب، أو يُفصل بينهما مع المراقبة.'],
    ['Warfarin', W, 'Vitamin K absorption changes — check the INR.', 'يتغيّر امتصاص فيتامين K — افحص INR.']
  ],
  ci:[{en:'Chronic malabsorption or cholestasis', ar:'سوء امتصاص مزمن أو ركود صفراوي'}, 'preg'],
  ask:['otherMeds', 'preg', 'thyroid'] },

{ sci:'Phentermine', ar:'فينتيرمين', atc:'A08AA01', cat:'end.obesity', form:'capsule',
  doses:['15 mg', '30 mg', '37.5 mg'], brand:['Adipex', 'Duromine'],
  tags:['sympathomimetic'], controlled:true, take:['morning'],
  notes:{en:'A short-term appetite suppressant, in the morning. Raised pulse and blood pressure, insomnia and a dry mouth are common. Habit-forming.',
         ar:'كابح شهية لفترة قصيرة، صباحاً. تسارع النبض وارتفاع الضغط والأرق وجفاف الفم شائعة. يسبّب الاعتياد.'},
  ci:['ihd', 'uncontrolledHtn', 'maoi', 'thyrotoxicosis', 'angleGlaucoma'],
  ask:['heart', 'bp', 'prescription'] }

];
