/* Cancer, part two: hormonal therapy, targeted (kinase and other) inhibitors,
   and antibodies and immunotherapy. Many of the tablets are broken down by
   CYP3A4 and several are not absorbed with acid-reducing medicines, which is
   what a community pharmacy needs to catch. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Hormonal cancer therapy ---------- */

{ sci:'Tamoxifen', ar:'تاموكسيفين', atc:'L02BA01', cat:'onc.hormonal', form:'tablet',
  doses:['10 mg', '20 mg'], brand:['Nolvadex'],
  tags:['inducerSensitive'],
  notes:{en:'Every day, usually for five to ten years. Hot flushes are common. Report calf pain or breathlessness (clots) and any vaginal bleeding after the menopause. It causes birth defects — use non-hormonal contraception.',
         ar:'كل يوم، عادة لمدة خمس إلى عشر سنوات. الهبّات الساخنة شائعة. أبلغي عن ألم الساق أو ضيق النفس (جلطات) وأي نزف مهبلي بعد انقطاع الطمث. يسبّب تشوّهات للجنين — استعملي منع حمل غير هرموني.'},
  ix:[
    ['Warfarin', S, 'Raises the INR markedly.', 'يرفع INR كثيراً.']
  ],
  ci:['preg', 'vte'],
  ask:['clots', 'pmBleeding', 'antidep'] },

{ sci:'Letrozole', ar:'ليتروزول', atc:'L02BG04', cat:'onc.hormonal', form:'tablet',
  doses:['2.5 mg'], brand:['Femara'],
  notes:{en:'Once a day. Joint aches and hot flushes are common; bone density is checked, and calcium with vitamin D helps. Also used by fertility specialists to trigger ovulation.',
         ar:'مرة واحدة يومياً. آلام المفاصل والهبّات الساخنة شائعة؛ تُفحص كثافة العظام، والكالسيوم مع فيتامين د يفيدان. يستعمله أطباء الخصوبة أيضاً لتحريض الإباضة.'},
  ix:[
    ['Tamoxifen', W, 'Tamoxifen lowers letrozole levels — not used together.', 'التاموكسيفين يخفض مستوى الليتروزول — لا يُستعملان معاً.'],
    ['Estradiol', S, 'Oestrogens cancel its effect.', 'الإستروجينات تُبطل أثره.']
  ],
  ci:['preg'],
  ask:['pregTest', 'labs'] },

{ sci:'Anastrozole', ar:'أناستروزول', atc:'L02BG03', cat:'onc.hormonal', form:'tablet',
  doses:['1 mg'], brand:['Arimidex'],
  notes:{en:'Once a day after the menopause. Joint aches and hot flushes are common; bone density is checked.',
         ar:'مرة واحدة يومياً بعد انقطاع الطمث. آلام المفاصل والهبّات الساخنة شائعة؛ تُفحص كثافة العظام.'},
  ix:[
    ['Estradiol', S, 'Oestrogens cancel its effect.', 'الإستروجينات تُبطل أثره.'],
    ['Tamoxifen', W, 'Not used together — no added benefit.', 'لا يُستعملان معاً — دون فائدة إضافية.']
  ],
  ci:['preg', 'hepSevere'],
  ask:['pregTest', 'labs'] },

{ sci:'Exemestane', ar:'إكسيميستان', atc:'L02BG06', cat:'onc.hormonal', form:'tablet',
  doses:['25 mg'], brand:['Aromasin'],
  take:['afterFood'],
  tags:['inducerSensitive'],
  notes:{en:'Once a day after a meal. Joint aches and hot flushes are common; bone density is checked.',
         ar:'مرة واحدة يومياً بعد وجبة. آلام المفاصل والهبّات الساخنة شائعة؛ تُفحص كثافة العظام.'},
  ix:[
    ['Estradiol', S, 'Oestrogens cancel its effect.', 'الإستروجينات تُبطل أثره.']
  ],
  ci:['preg'],
  ask:['pregTest', 'labs'] },

{ sci:'Fulvestrant', ar:'فولفيسترانت', atc:'L02BA03', cat:'onc.hormonal', form:'injection',
  doses:['250 mg/5 mL'], brand:['Faslodex'],
  notes:{en:'Two injections into the buttocks monthly, after loading doses. Pain at the injection sites is common.',
         ar:'حقنتان في الأرداف شهرياً بعد جرعات التحميل. الألم مكان الحقن شائع.'},
  ix:[
    ['#anticoag', W, 'Bruising and bleeding at the injection sites.', 'كدمات ونزف في مواضع الحقن.']
  ],
  ci:['preg', 'hepSevere'],
  ask:['thinner', 'preg'] },

{ sci:'Bicalutamide', ar:'بيكالوتامايد', atc:'L02BB03', cat:'onc.hormonal', form:'tablet',
  doses:['50 mg', '150 mg'], brand:['Casodex'],
  notes:{en:'For prostate cancer. Breast swelling and tenderness are common. Liver tests are checked; report yellowing or dark urine.',
         ar:'لسرطان البروستاتا. تورّم الثدي وألمه شائعان. تُفحص وظائف الكبد؛ أبلغ عن الاصفرار أو غمق البول.'},
  ix:[
    ['Warfarin', W, 'May raise the INR.', 'قد يرفع INR.']
  ],
  ask:['liver', 'thinner'] },

{ sci:'Flutamide', ar:'فلوتامايد', atc:'L02BB01', cat:'onc.hormonal', form:'tablet',
  doses:['250 mg'], brand:['Eulexin'],
  notes:{en:'Three times a day for prostate cancer. It can damage the liver — tests are regular; report nausea, dark urine or yellowing.',
         ar:'ثلاث مرات يومياً لسرطان البروستاتا. قد يؤذي الكبد — الفحوص منتظمة؛ أبلغ عن الغثيان أو غمق البول أو الاصفرار.'},
  ix:[
    ['Warfarin', S, 'Raises the INR.', 'يرفع INR.']
  ],
  ci:['hepActive'],
  ask:['liver', 'thinner'] },

{ sci:'Abiraterone', ar:'أبيراتيرون', atc:'L02BX03', cat:'onc.hormonal', form:'tablet',
  doses:['250 mg', '500 mg'], brand:['Zytiga'], aka:['Abiraterone acetate'],
  tags:['inducerSensitive'], take:['emptyStomach'],
  notes:{en:'On an empty stomach — food multiplies how much is absorbed. Taken with prednisolone. Blood pressure, potassium and liver tests are checked.',
         ar:'على معدة فارغة — الطعام يضاعف الكمية الممتصة. يؤخذ مع البريدنيزولون. يُفحص الضغط والبوتاسيوم ووظائف الكبد.'},
  ci:['hepSevere'],
  ask:['liver', 'bp', 'heart'] },

{ sci:'Enzalutamide', ar:'إنزالوتامايد', atc:'L02BB04', cat:'onc.hormonal', form:'capsule',
  doses:['40 mg', '80 mg'], brand:['Xtandi'],
  tags:['inducer', 'seizure'],
  notes:{en:'Once a day. Tiredness and hot flushes are common; rarely it causes fits. It lowers the level of many other medicines.',
         ar:'مرة واحدة يومياً. التعب والهبّات الساخنة شائعة؛ ونادراً ما يسبّب الاختلاج. يخفض مستوى أدوية أخرى كثيرة.'},
  ask:['epilepsy', 'otherMeds', 'falls'] },

{ sci:'Degarelix', ar:'ديغاريليكس', atc:'L02BX02', cat:'onc.hormonal', form:'injection',
  doses:['120 mg vial (starting dose)', '80 mg vial (monthly)'], brand:['Firmagon'],
  tags:['qtPossible'],
  notes:{en:'A monthly injection under the belly skin for prostate cancer; it lowers testosterone within days without the early flare. Hot flushes and a sore injection site are common.',
         ar:'حقنة شهرية تحت جلد البطن لسرطان البروستاتا؛ تخفض التستوستيرون خلال أيام دون الارتفاع الأولي. هبّات الحرارة وألم مكان الحقن شائعة.'},
  ask:['heart', 'otherMeds'] },

{ sci:'Leuprorelin', ar:'ليوبروريلين', atc:'L02AE02', cat:'onc.hormonal', form:'injection',
  doses:['3.75 mg monthly', '11.25 mg three-monthly', '22.5 mg', '45 mg'], brand:['Lucrin', 'Eligard', 'Lupron'], aka:['Leuprolide'],
  tags:['qtPossible'],
  notes:{en:'An injection every one, three or six months for prostate cancer, endometriosis or fibroids. Hot flushes are common; at first, prostate symptoms can flare (a tablet covers this). Long use thins the bones.',
         ar:'حقنة كل شهر أو ثلاثة أو ستة أشهر لسرطان البروستاتا أو بطانة الرحم المهاجرة أو الأورام الليفية. الهبّات الساخنة شائعة؛ وقد تتفاقم أعراض البروستاتا في البداية (يغطّيها قرص). الاستعمال الطويل يُضعف العظام.'},
  ask:['heart', 'diabetes', 'labs'] },

{ sci:'Goserelin', ar:'غوسيريلين', atc:'L02AE03', cat:'onc.hormonal', form:'injection',
  doses:['3.6 mg', '10.8 mg implant'], brand:['Zoladex'],
  tags:['qtPossible'],
  notes:{en:'An implant under the skin of the belly every 4 or 12 weeks. Hot flushes are common; bone density is watched on long use.',
         ar:'غرسة تحت جلد البطن كل 4 أو 12 أسبوعاً. الهبّات الساخنة شائعة؛ تُراقب كثافة العظام مع الاستعمال الطويل.'},
  ask:['heart', 'diabetes', 'labs'] },

{ sci:'Triptorelin', ar:'تريبتوريلين', atc:'L02AE04', cat:'onc.hormonal', form:'injection',
  doses:['0.1 mg daily (IVF)', '3.75 mg', '11.25 mg', '22.5 mg'], brand:['Decapeptyl', 'Diphereline'],
  tags:['qtPossible'],
  notes:{en:'Daily low doses in IVF; monthly or three-monthly depots for prostate cancer, endometriosis or early puberty. Hot flushes are common.',
         ar:'جرعات يومية منخفضة في أطفال الأنابيب؛ وحقن طويلة المفعول شهرية أو كل ثلاثة أشهر لسرطان البروستاتا أو بطانة الرحم المهاجرة أو البلوغ المبكر. الهبّات الساخنة شائعة.'},
  ask:['injectTech', 'diabetes', 'heart'] },

{ sci:'Megestrol', ar:'ميجيسترول', atc:'L02AB01', cat:'onc.hormonal', form:'tablet',
  doses:['40 mg', '160 mg', '40 mg/mL suspension'], brand:['Megace'], aka:['Megestrol acetate'],
  notes:{en:'For some cancers and to improve appetite and weight in serious illness. It raises clot risk and blood sugar; after long use it is not stopped suddenly.',
         ar:'لبعض الأورام ولتحسين الشهية والوزن في الأمراض الشديدة. يرفع خطر الجلطات وسكر الدم؛ وبعد الاستعمال الطويل لا يُوقف فجأة.'},
  ix:[
    ['Warfarin', W, 'May raise the INR.', 'قد يرفع INR.']
  ],
  ci:['vte', 'preg'],
  ask:['clots', 'diabetes'] },

/* ---------- Targeted therapy ---------- */

{ sci:'Imatinib', ar:'إيماتينيب', atc:'L01EA01', cat:'onc.targeted', form:'tablet',
  doses:['100 mg', '400 mg'], brand:['Glivec', 'Gleevec'],
  tags:['sub3a4', 'inh3a4mod', 'inducerSensitive'], take:['withFood'],
  notes:{en:'With food and a large glass of water. Puffy eyes, ankle swelling, muscle cramps and nausea are common — weigh yourself, as sudden gain means fluid. No grapefruit juice.',
         ar:'مع الطعام وكأس ماء كبير. انتفاخ الجفون وتورّم الكاحلين وتشنّجات العضلات والغثيان شائعة — زِن نفسك، فالزيادة المفاجئة تعني احتباس سوائل. لا عصير جريب فروت.'},
  ix:[
    ['Warfarin', S, 'Raises the INR — a heparin is preferred.', 'يرفع INR — يُفضّل الهيبارين.'],
    ['Paracetamol', W, 'Regular high doses add to liver strain.', 'الجرعات العالية المنتظمة تزيد إجهاد الكبد.']
  ],
  ci:['pregTeratogen'],
  ask:['otherMeds', 'pregTest', 'liver'] },

{ sci:'Nilotinib', ar:'نيلوتينيب', atc:'L01EA03', cat:'onc.targeted', form:'capsule',
  doses:['150 mg', '200 mg'], brand:['Tasigna'],
  tags:['qt', 'sub3a4crit', 'inducerSensitive'], take:['emptyStomach'],
  notes:{en:'Twice a day on an empty stomach — nothing to eat for two hours before and one hour after, because food raises the level and the QT risk. No grapefruit.',
         ar:'مرتين يومياً على معدة فارغة — لا طعام قبله بساعتين ولا بعده بساعة، لأن الطعام يرفع مستواه وخطر إطالة QT. لا جريب فروت.'},
  ix:[
    ['#acidReducer', W, 'PPIs lower absorption — an H2 blocker timed 10 hours before or 2 hours after is used instead.', 'مثبطات المضخة تقلّل الامتصاص — يُستعمل بدلها حاصر H2 قبله بعشر ساعات أو بعده بساعتين.']
  ],
  ci:['qt', 'hypoK', 'pregTeratogen'],
  ask:['rhythm', 'otherMeds', 'pregTest'] },

{ sci:'Dasatinib', ar:'داساتينيب', atc:'L01EA02', cat:'onc.targeted', form:'tablet',
  doses:['20 mg', '50 mg', '70 mg', '100 mg'], brand:['Sprycel'],
  tags:['qtPossible', 'sub3a4crit', 'inducerSensitive'],
  notes:{en:'Once a day. Fluid can collect around the lungs — report breathlessness or a cough. No antacid within two hours, and acid-reducing tablets are avoided.',
         ar:'مرة واحدة يومياً. قد تتجمع السوائل حول الرئتين — أبلغ عن ضيق النفس أو السعال. لا مضاد حموضة خلال ساعتين منه، وتُتجنّب أقراص خفض الحمض.'},
  ix:[
    ['#acidReducer', S, 'Stops dasatinib being absorbed — avoid.', 'يمنع امتصاص الداساتينيب — يُتجنّب.']
  ],
  ci:['pregTeratogen'],
  ask:['antacids', 'otherMeds', 'pregTest'] },

{ sci:'Bosutinib', ar:'بوسوتينيب', atc:'L01EA04', cat:'onc.targeted', form:'tablet',
  doses:['100 mg', '400 mg', '500 mg'], brand:['Bosulif'],
  tags:['sub3a4crit', 'inducerSensitive'], take:['withFood'],
  notes:{en:'Once a day with food. Diarrhoea and liver changes are common early — report them.',
         ar:'مرة واحدة يومياً مع الطعام. الإسهال وتغيّرات الكبد شائعة في البداية — أبلغ عنها.'},
  ix:[
    ['#acidReducer', W, 'PPIs lower absorption — short-acting antacids, well separated, instead.', 'مثبطات المضخة تقلّل الامتصاص — تُستعمل بدلها مضادات حموضة قصيرة المفعول مع الفصل.']
  ],
  ci:['hepSevere', 'pregTeratogen'],
  ask:['liver', 'otherMeds', 'pregTest'] },

{ sci:'Ponatinib', ar:'بوناتينيب', atc:'L01EA05', cat:'onc.targeted', form:'tablet',
  doses:['15 mg', '30 mg', '45 mg'], brand:['Iclusig'],
  tags:['sub3a4'],
  notes:{en:'Artery blockages and clots are a serious risk: report chest pain, weakness on one side or leg pain at once. Blood pressure is kept controlled.',
         ar:'انسداد الشرايين والجلطات خطر جدي: أبلغ فوراً عن ألم الصدر أو ضعف في جانب واحد أو ألم الساق. يُحافظ على ضبط الضغط.'},
  ci:['pregTeratogen'],
  ask:['heart', 'bp', 'clots'] },

{ sci:'Erlotinib', ar:'إرلوتينيب', atc:'L01EB02', cat:'onc.targeted', form:'tablet',
  doses:['25 mg', '100 mg', '150 mg'], brand:['Tarceva'],
  tags:['sub3a4', 'inducerSensitive'], take:['emptyStomach'],
  notes:{en:'On an empty stomach. An acne-like rash and diarrhoea are common. Smoking lowers its level, and acid-reducing medicines stop it being absorbed.',
         ar:'على معدة فارغة. طفح يشبه حب الشباب والإسهال شائعان. التدخين يخفض مستواه، وخافضات الحمض تمنع امتصاصه.'},
  ix:[
    ['#acidReducer', S, 'Stops it being absorbed — avoid PPIs; an H2 blocker only with careful timing.', 'تمنع امتصاصه — تُتجنّب مثبطات المضخة؛ وحاصر H2 فقط مع توقيت دقيق.'],
    ['Warfarin', S, 'Raises the INR.', 'يرفع INR.']
  ],
  ci:['pregTeratogen'],
  ask:['smoke', 'antacids', 'thinner'] },

{ sci:'Gefitinib', ar:'جيفيتينيب', atc:'L01EB01', cat:'onc.targeted', form:'tablet',
  doses:['250 mg'], brand:['Iressa'],
  tags:['sub3a4', 'inducerSensitive'],
  notes:{en:'Once a day. Rash and diarrhoea are common; report a new cough or breathlessness. Acid-reducing medicines stop it being absorbed.',
         ar:'مرة واحدة يومياً. الطفح والإسهال شائعان؛ أبلغ عن سعال جديد أو ضيق نفس. خافضات الحمض تمنع امتصاصه.'},
  ix:[
    ['#acidReducer', S, 'Stops it being absorbed — avoid, or take gefitinib well before.', 'تمنع امتصاصه — تُتجنّب، أو يؤخذ الجيفيتينيب قبلها بوقت كافٍ.']
  ],
  ci:['pregTeratogen'],
  ask:['antacids', 'liver', 'otherMeds'] },

{ sci:'Osimertinib', ar:'أوسيميرتينيب', atc:'L01EB04', cat:'onc.targeted', form:'tablet',
  doses:['40 mg', '80 mg'], brand:['Tagrisso'],
  tags:['qtPossible', 'inducerSensitive'],
  notes:{en:'Once a day. Diarrhoea, rash and dry skin are common. ECGs and heart checks are done; report breathlessness or palpitations.',
         ar:'مرة واحدة يومياً. الإسهال والطفح وجفاف الجلد شائعة. يُجرى تخطيط القلب وفحوصه؛ أبلغ عن ضيق النفس أو الخفقان.'},
  ci:['pregTeratogen'],
  ask:['rhythm', 'heart', 'pregTest'] },

{ sci:'Afatinib', ar:'أفاتينيب', atc:'L01EB03', cat:'onc.targeted', form:'tablet',
  doses:['20 mg', '30 mg', '40 mg'], brand:['Giotrif'],
  take:['emptyStomach'],
  notes:{en:'On an empty stomach. Diarrhoea is very common — start loperamide at the first loose stool. Rash and mouth sores are common.',
         ar:'على معدة فارغة. الإسهال شائع جداً — ابدأ اللوبيراميد عند أول براز ليّن. الطفح وقروح الفم شائعة.'},
  ix:[
    ['Ritonavir', W, 'P-glycoprotein inhibitors raise afatinib — take them six hours apart.', 'مثبطات P-glycoprotein ترفع الأفاتينيب — بفاصل ست ساعات.']
  ],
  ci:['pregTeratogen'],
  ask:['otherMeds', 'pregTest'] },

{ sci:'Lapatinib', ar:'لاباتينيب', atc:'L01EH01', cat:'onc.targeted', form:'tablet',
  doses:['250 mg'], brand:['Tykerb', 'Tyverb'],
  tags:['qtPossible', 'sub3a4crit'], take:['emptyStomach'],
  notes:{en:'On an empty stomach, an hour before or after food. Diarrhoea is common; heart and liver are checked.',
         ar:'على معدة فارغة، قبل الطعام أو بعده بساعة. الإسهال شائع؛ يُفحص القلب والكبد.'},
  ci:['pregTeratogen'],
  ask:['heart', 'liver', 'otherMeds'] },

{ sci:'Sorafenib', ar:'سورافينيب', atc:'L01EX02', cat:'onc.targeted', form:'tablet',
  doses:['200 mg'], brand:['Nexavar'],
  take:['emptyStomach'],
  tags:['inducerSensitive', 'qtPossible'],
  notes:{en:'Without food or with a low-fat meal. Sore, blistering palms and soles, diarrhoea and high blood pressure are common. It slows wound healing — surgery is planned around it.',
         ar:'دون طعام أو مع وجبة قليلة الدسم. ألم وتقرّح راحتي اليدين وباطن القدمين والإسهال وارتفاع الضغط شائعة. يبطّئ التئام الجروح — تُخطّط الجراحة حوله.'},
  ix:[
    ['Warfarin', W, 'INR rises and bleeding reported.', 'سُجّل ارتفاع INR ونزف.']
  ],
  ci:['pregTeratogen'],
  ask:['bp', 'dental', 'pregTest'] },

{ sci:'Sunitinib', ar:'سونيتينيب', atc:'L01EX01', cat:'onc.targeted', form:'capsule',
  doses:['12.5 mg', '25 mg', '37.5 mg', '50 mg'], brand:['Sutent'],
  tags:['qtPossible', 'sub3a4'],
  notes:{en:'Often four weeks on and two off. Tiredness, sore palms and soles, yellowish skin, high blood pressure and an underactive thyroid are common.',
         ar:'غالباً أربعة أسابيع استعمال ثم أسبوعان راحة. التعب وألم راحتي اليدين وباطن القدمين واصفرار الجلد وارتفاع الضغط وقصور الدرق شائعة.'},
  ci:['pregTeratogen'],
  ask:['bp', 'thyroid', 'pregTest'] },

{ sci:'Pazopanib', ar:'بازوبانيب', atc:'L01EX03', cat:'onc.targeted', form:'tablet',
  doses:['200 mg', '400 mg'], brand:['Votrient'],
  tags:['qtPossible', 'sub3a4'], take:['emptyStomach'],
  notes:{en:'On an empty stomach. Liver tests are checked often; hair may lose its colour. Acid-reducing medicines lower absorption.',
         ar:'على معدة فارغة. تُفحص وظائف الكبد كثيراً؛ وقد يفقد الشعر لونه. خافضات الحمض تقلّل امتصاصه.'},
  ix:[
    ['#acidReducer', S, 'Lowers absorption — avoid, or use short-acting antacids well apart.', 'يقلّل الامتصاص — يُتجنّب، أو تُستعمل مضادات حموضة قصيرة المفعول مع فصل كافٍ.']
  ],
  ci:['pregTeratogen', 'hepSevere'],
  ask:['liver', 'bp', 'antacids'] },

{ sci:'Lenvatinib', ar:'لينفاتينيب', atc:'L01EX08', cat:'onc.targeted', form:'capsule',
  doses:['4 mg', '10 mg'], brand:['Lenvima'],
  tags:['qtPossible'],
  notes:{en:'Once a day. High blood pressure, protein in the urine and diarrhoea are common; blood pressure is checked often. It slows wound healing.',
         ar:'مرة واحدة يومياً. ارتفاع الضغط وظهور البروتين في البول والإسهال شائعة؛ يُفحص الضغط كثيراً. يبطّئ التئام الجروح.'},
  ci:['pregTeratogen'],
  ask:['bp', 'kidney', 'dental'] },

{ sci:'Ibrutinib', ar:'إيبروتينيب', atc:'L01EL01', cat:'onc.targeted', form:'tablet',
  doses:['140 mg', '280 mg', '420 mg'], brand:['Imbruvica'],
  tags:['sub3a4crit', 'antiplatelet'],
  notes:{en:'Once a day at the same time, with water. Bruising and bleeding are more likely — it is paused around surgery. Report palpitations. No grapefruit or Seville oranges.',
         ar:'مرة واحدة يومياً في الوقت نفسه مع الماء. الكدمات والنزف أكثر احتمالاً — يُوقف مؤقتاً حول الجراحة. أبلغ عن الخفقان. لا جريب فروت ولا نارنج.'},
  ask:['thinner', 'rhythm', 'dental'] },

{ sci:'Ruxolitinib', ar:'روكسوليتينيب', atc:'L01EJ01', cat:'onc.targeted', form:'tablet',
  doses:['5 mg', '10 mg', '15 mg', '20 mg'], brand:['Jakavi'],
  tags:['sub3a4', 'immunosuppressant'],
  notes:{en:'Blood counts are checked; infections, including shingles, are more likely. Never stop suddenly — the symptoms rebound.',
         ar:'يُفحص تعداد الدم؛ والعدوى، ومنها الحزام الناري، أكثر احتمالاً. لا يُوقف فجأة أبداً — ترتدّ الأعراض.'},
  ask:['infection', 'labs', 'otherMeds'] },

{ sci:'Palbociclib', ar:'بالبوسيكليب', atc:'L01EF01', cat:'onc.targeted', form:'capsule',
  doses:['75 mg', '100 mg', '125 mg'], brand:['Ibrance'],
  tags:['sub3a4'],
  notes:{en:'Three weeks on, one week off, with an aromatase inhibitor or fulvestrant; blood counts before each cycle. No grapefruit.',
         ar:'ثلاثة أسابيع استعمال ثم أسبوع راحة، مع مثبط أروماتاز أو فولفيسترانت؛ تعداد دم قبل كل دورة. لا جريب فروت.'},
  ci:['pregTeratogen'],
  ask:['feverChemo', 'otherMeds', 'pregTest'] },

{ sci:'Ribociclib', ar:'ريبوسيكليب', atc:'L01EF02', cat:'onc.targeted', form:'tablet',
  doses:['200 mg'], brand:['Kisqali'],
  tags:['qt', 'sub3a4', 'inh3a4mod'],
  notes:{en:'Three weeks on, one off. ECGs and liver tests are done; report palpitations or fainting. Not with tamoxifen.',
         ar:'ثلاثة أسابيع استعمال ثم أسبوع راحة. يُجرى تخطيط القلب وفحص الكبد؛ أبلغ عن الخفقان أو الإغماء. لا يُجمع مع التاموكسيفين.'},
  ci:['qt', 'pregTeratogen'],
  ask:['rhythm', 'liver', 'otherMeds'] },

{ sci:'Abemaciclib', ar:'أبيماسيكليب', atc:'L01EF03', cat:'onc.targeted', form:'tablet',
  doses:['50 mg', '100 mg', '150 mg', '200 mg'], brand:['Verzenios', 'Verzenio'],
  tags:['sub3a4'],
  notes:{en:'Twice a day. Diarrhoea is very common — start loperamide at the first loose stool and drink plenty. Report clots.',
         ar:'مرتين يومياً. الإسهال شائع جداً — ابدأ اللوبيراميد عند أول براز ليّن واشرب كثيراً. أبلغ عن الجلطات.'},
  ci:['pregTeratogen'],
  ask:['feverChemo', 'otherMeds', 'pregTest'] },

{ sci:'Olaparib', ar:'أولاباريب', atc:'L01XK01', cat:'onc.targeted', form:'tablet',
  doses:['100 mg', '150 mg'], brand:['Lynparza'],
  tags:['sub3a4'],
  notes:{en:'Twice a day. Nausea, tiredness and anaemia are common; blood counts are checked monthly.',
         ar:'مرتين يومياً. الغثيان والتعب وفقر الدم شائعة؛ يُفحص تعداد الدم شهرياً.'},
  ci:['pregTeratogen'],
  ask:['labs', 'pregTest', 'otherMeds'] },

{ sci:'Alectinib', ar:'أليكتينيب', atc:'L01ED03', cat:'onc.targeted', form:'capsule',
  doses:['150 mg'], brand:['Alecensa'],
  tags:['bradycardic'], take:['withFood'],
  notes:{en:'Twice a day with food. Muscle aches, constipation and a slow pulse can occur; the skin burns more easily in the sun.',
         ar:'مرتين يومياً مع الطعام. قد يسبّب آلام العضلات والإمساك وبطء النبض؛ ويحترق الجلد بسهولة أكبر في الشمس.'},
  ci:['pregTeratogen'],
  ask:['slowPulse', 'sun', 'liver'] },

{ sci:'Everolimus', ar:'إيفيروليموس', atc:'L01EG02', cat:'onc.targeted', form:'tablet',
  doses:['2.5 mg', '5 mg', '10 mg (cancer)', '0.25–0.75 mg (transplant)'], brand:['Afinitor', 'Certican'],
  tags:['immunosuppressant', 'sub3a4crit', 'inducerSensitive'],
  notes:{en:'Mouth ulcers are common — an alcohol-free steroid mouthwash helps. Report infections, and a new cough or breathlessness (lung inflammation). Blood sugar and lipids rise.',
         ar:'قروح الفم شائعة — غسول فم كورتيزوني خالٍ من الكحول يفيد. أبلغ عن العدوى والسعال الجديد أو ضيق النفس (التهاب الرئة). يرتفع سكر الدم والدهون.'},
  ci:['pregTeratogen'],
  ask:['infection', 'diabetes', 'otherMeds'] },

{ sci:'Venetoclax', ar:'فينيتوكلاكس', atc:'L01XX52', cat:'onc.targeted', form:'tablet',
  doses:['10 mg', '50 mg', '100 mg'], brand:['Venclexta', 'Venclyxto'],
  tags:['sub3a4crit', 'inducerSensitive'], take:['withFood'],
  notes:{en:'The dose is built up slowly over weeks with plenty of fluid, to prevent tumour lysis. With food and water at the same time daily. No grapefruit.',
         ar:'تُرفع الجرعة ببطء على مدى أسابيع مع الكثير من السوائل، للوقاية من متلازمة انحلال الورم. مع الطعام والماء في الوقت نفسه يومياً. لا جريب فروت.'},
  ci:['pregTeratogen'],
  ask:['kidney', 'otherMeds', 'feverChemo'] },

/* ---------- Antibodies and immunotherapy ---------- */

{ sci:'Rituximab', ar:'ريتوكسيماب', atc:'L01FA01', cat:'onc.antibody', form:'injection',
  doses:['100 mg/10 mL', '500 mg/50 mL', '1400 mg subcutaneous'], brand:['MabThera', 'Rituxan'],
  tags:['immunosuppressant'],
  notes:{en:'Infusion reactions are common with the first dose, so medicines are given beforehand. Hepatitis B is tested first; infections and the timing of vaccines are discussed.',
         ar:'تفاعلات التسريب شائعة مع الجرعة الأولى، فتُعطى أدوية قبلها. يُفحص التهاب الكبد B أولاً؛ ويُناقش خطر العدوى وتوقيت اللقاحات.'},
  ci:['seriousInfection', 'hepActive'],
  ask:['hepatitis', 'infection', 'vaccine'] },

{ sci:'Trastuzumab', ar:'تراستوزوماب', atc:'L01FD01', cat:'onc.antibody', form:'injection',
  doses:['150 mg', '440 mg vial', '600 mg subcutaneous'], brand:['Herceptin'],
  notes:{en:'Every three weeks. Heart scans every few months — report breathlessness or ankle swelling. Not in pregnancy.',
         ar:'كل ثلاثة أسابيع. فحوص للقلب كل بضعة أشهر — أبلغي عن ضيق النفس أو تورّم الكاحلين. لا يُستعمل في الحمل.'},
  ix:[
    ['Doxorubicin', S, 'Heart damage — the heart is checked, and they are not given at the same time.', 'أذية قلبية — يُفحص القلب ولا يُعطيان في الوقت نفسه.']
  ],
  ci:['preg'],
  ask:['heart', 'pregTest'] },

{ sci:'Trastuzumab emtansine', ar:'تراستوزوماب إمتانسين', atc:'L01FD03', cat:'onc.antibody', form:'injection',
  doses:['100 mg', '160 mg vial'], brand:['Kadcyla'],
  notes:{en:'Every three weeks. Liver tests, platelet counts and heart function are checked; report bleeding or yellowing.',
         ar:'كل ثلاثة أسابيع. تُفحص وظائف الكبد والصفيحات والقلب؛ أبلغي عن النزف أو الاصفرار.'},
  ix:[
    ['#inh3a4', W, 'Strong inhibitors raise the emtansine part — avoid.', 'المثبطات القوية ترفع جزء الإمتانسين — تُتجنّب.']
  ],
  ci:['preg'],
  ask:['heart', 'liver'] },

{ sci:'Pertuzumab', ar:'بيرتوزوماب', atc:'L01FD02', cat:'onc.antibody', form:'injection',
  doses:['420 mg/14 mL'], brand:['Perjeta', 'Phesgo'],
  notes:{en:'Given with trastuzumab every three weeks. Diarrhoea is common; heart function is checked.',
         ar:'يُعطى مع التراستوزوماب كل ثلاثة أسابيع. الإسهال شائع؛ تُفحص وظيفة القلب.'},
  ix:[
    ['Doxorubicin', S, 'Heart damage — the heart is checked, and they are not given at the same time.', 'أذية قلبية — يُفحص القلب ولا يُعطيان في الوقت نفسه.']
  ],
  ci:['preg'],
  ask:['heart', 'pregTest'] },

{ sci:'Ramucirumab', ar:'راموسيروماب', atc:'L01FG02', cat:'onc.antibody', form:'injection',
  doses:['100 mg/10 mL', '500 mg/50 mL vial'], brand:['Cyramza'],
  notes:{en:'An infusion every two or three weeks for stomach, lung, bowel and liver cancers. Blood pressure and urine protein are checked; wounds heal slowly — tell the team before any surgery.',
         ar:'تسريب كل أسبوعين أو ثلاثة لسرطانات المعدة والرئة والأمعاء والكبد. يُفحص الضغط والبروتين في البول؛ وتلتئم الجروح ببطء — أخبر الفريق قبل أي جراحة.'},
  ix:[
    ['#anticoag', W, 'Bleeding risk.', 'خطر نزف.']
  ],
  ci:['pregTeratogen', 'uncontrolledHtn'],
  ask:['bp', 'dental', 'bleeding'] },

{ sci:'Bevacizumab', ar:'بيفاسيزوماب', atc:'L01FG01', cat:'onc.antibody', form:'injection',
  doses:['100 mg/4 mL', '400 mg/16 mL'], brand:['Avastin'],
  notes:{en:'It raises blood pressure and protein in the urine, and slows wound healing — surgery is timed around it. Report stomach pain or bleeding. (Also injected into the eye for retinal disease.)',
         ar:'يرفع الضغط والبروتين في البول، ويبطّئ التئام الجروح — تُوقّت الجراحة حوله. أبلغ عن ألم البطن أو النزف. (يُحقن أيضاً في العين لأمراض الشبكية.)'},
  ix:[
    ['#anticoag', W, 'Bleeding risk.', 'خطر نزف.'],
    ['Sunitinib', S, 'A blood-vessel disease of the kidney (microangiopathic anaemia) reported — avoid.', 'سُجّل مرض وعائي في الكلى (فقر دم اعتلال الأوعية الدقيقة) — يُتجنّب.']
  ],
  ci:['preg', {en:'Recent surgery or an unhealed wound', ar:'جراحة حديثة أو جرح غير ملتئم'}],
  ask:['bp', 'dental', 'bleedNow'] },

{ sci:'Cetuximab', ar:'سيتوكسيماب', atc:'L01FE01', cat:'onc.antibody', form:'injection',
  doses:['100 mg/20 mL', '500 mg/100 mL'], brand:['Erbitux'],
  notes:{en:'An acne-like rash is very common — moisturisers and sun protection help. Magnesium is checked.',
         ar:'طفح يشبه حب الشباب شائع جداً — المرطّبات والوقاية من الشمس تفيد. يُفحص المغنيسيوم.'},
  ask:['sun', 'allergy'] },

{ sci:'Pembrolizumab', ar:'بيمبروليزوماب', atc:'L01FF02', cat:'onc.antibody', form:'injection',
  doses:['100 mg/4 mL'], brand:['Keytruda'],
  notes:{en:'Immunotherapy can inflame any organ, even months later: report diarrhoea, cough, rash, yellowing, unusual tiredness or thirst promptly, and always say you are on immunotherapy.',
         ar:'العلاج المناعي قد يسبّب التهاب أي عضو ولو بعد أشهر: أبلغ سريعاً عن الإسهال أو السعال أو الطفح أو الاصفرار أو التعب غير المعتاد أو العطش، وقل دائماً إنك تتلقّى علاجاً مناعياً.'},
  ix:[
    ['#corticosteroid', W, 'Steroids before starting can weaken the treatment — they are used freely for its side effects once started.', 'الكورتيزون قبل البدء قد يُضعف العلاج — ويُستعمل بحرية لآثاره الجانبية بعد البدء.']
  ],
  ask:['thyroid', 'diabetes', 'steroids'] },

{ sci:'Nivolumab', ar:'نيفولوماب', atc:'L01FF01', cat:'onc.antibody', form:'injection',
  doses:['40 mg', '100 mg', '240 mg vial'], brand:['Opdivo'],
  notes:{en:'Immunotherapy can inflame any organ, even months later: report diarrhoea, cough, rash, yellowing or unusual tiredness promptly, and always say you are on immunotherapy.',
         ar:'العلاج المناعي قد يسبّب التهاب أي عضو ولو بعد أشهر: أبلغ سريعاً عن الإسهال أو السعال أو الطفح أو الاصفرار أو التعب غير المعتاد، وقل دائماً إنك تتلقّى علاجاً مناعياً.'},
  ix:[
    ['#corticosteroid', W, 'Steroids before starting can weaken the treatment — they are used freely for its side effects once started.', 'الكورتيزون قبل البدء قد يُضعف العلاج — ويُستعمل بحرية لآثاره الجانبية بعد البدء.']
  ],
  ask:['thyroid', 'diabetes', 'steroids'] },

{ sci:'Atezolizumab', ar:'أتيزوليزوماب', atc:'L01FF05', cat:'onc.antibody', form:'injection',
  doses:['840 mg', '1200 mg vial'], brand:['Tecentriq'],
  notes:{en:'Immunotherapy can inflame any organ, even months later — report new symptoms promptly and say you are on immunotherapy.',
         ar:'العلاج المناعي قد يسبّب التهاب أي عضو ولو بعد أشهر — أبلغ عن الأعراض الجديدة سريعاً وقل إنك تتلقّى علاجاً مناعياً.'},
  ix:[
    ['#corticosteroid', W, 'Steroids before starting can weaken the treatment — they are used freely for its side effects once started.', 'الكورتيزون قبل البدء قد يُضعف العلاج — ويُستعمل بحرية لآثاره الجانبية بعد البدء.']
  ],
  ask:['thyroid', 'diabetes', 'steroids'] },

{ sci:'Durvalumab', ar:'دورفالوماب', atc:'L01FF03', cat:'onc.antibody', form:'injection',
  doses:['120 mg', '500 mg vial'], brand:['Imfinzi'],
  notes:{en:'Immunotherapy can inflame any organ, even months later — report new symptoms promptly and say you are on immunotherapy.',
         ar:'العلاج المناعي قد يسبّب التهاب أي عضو ولو بعد أشهر — أبلغ عن الأعراض الجديدة سريعاً وقل إنك تتلقّى علاجاً مناعياً.'},
  ix:[
    ['#corticosteroid', W, 'Steroids before starting can weaken the treatment — they are used freely for its side effects once started.', 'الكورتيزون قبل البدء قد يُضعف العلاج — ويُستعمل بحرية لآثاره الجانبية بعد البدء.']
  ],
  ask:['thyroid', 'diabetes', 'steroids'] },

{ sci:'Ipilimumab', ar:'إيبيليموماب', atc:'L01FX04', cat:'onc.antibody', form:'injection',
  doses:['50 mg', '200 mg vial'], brand:['Yervoy'],
  notes:{en:'Immune side effects — especially diarrhoea and colitis — are common and can be severe; report them the same day.',
         ar:'الآثار المناعية — خاصة الإسهال والتهاب القولون — شائعة وقد تكون شديدة؛ أبلغ عنها في اليوم نفسه.'},
  ix:[
    ['#corticosteroid', W, 'Steroids before starting can weaken the treatment — they are used freely for its side effects once started.', 'الكورتيزون قبل البدء قد يُضعف العلاج — ويُستعمل بحرية لآثاره الجانبية بعد البدء.']
  ],
  ask:['thyroid', 'steroids', 'feverBlood'] },

{ sci:'Daratumumab', ar:'داراتوموماب', atc:'L01FC01', cat:'onc.antibody', form:'injection',
  doses:['100 mg', '400 mg vial', '1800 mg subcutaneous'], brand:['Darzalex'],
  notes:{en:'For myeloma. It interferes with blood-bank cross-matching for months — carry the card that says you are on it. Infusion reactions can occur with the first doses.',
         ar:'للورم النقوي. يتداخل مع فحص توافق الدم في بنك الدم لأشهر — احمل البطاقة التي تبيّن أنك تأخذه. قد تحدث تفاعلات التسريب مع الجرعات الأولى.'},
  ask:['hepatitis', 'asthma', 'infection'] },

{ sci:'Isatuximab', ar:'إيزاتوكسيماب', atc:'L01FC02', cat:'onc.antibody', form:'injection',
  doses:['100 mg', '500 mg vial'], brand:['Sarclisa'],
  notes:{en:'For myeloma. It interferes with blood-bank cross-matching — carry the card. Infusion reactions and infections are watched for.',
         ar:'للورم النقوي. يتداخل مع فحص توافق الدم في بنك الدم — احمل البطاقة. تُراقب تفاعلات التسريب والعدوى.'},
  ask:['infection', 'asthma'] },

{ sci:'Brentuximab vedotin', ar:'برينتوكسيماب فيدوتين', atc:'L01FX05', cat:'onc.antibody', form:'injection',
  doses:['50 mg vial'], brand:['Adcetris'],
  notes:{en:'For Hodgkin and some other lymphomas. Report numbness or tingling, and any new weakness, clumsiness or confusion.',
         ar:'للمفوما هودجكن وبعض أنواع اللمفوما الأخرى. أبلغ عن الخدر أو الوخز، وعن أي ضعف أو ارتباك في الحركة أو تشوّش جديد.'},
  ix:[
    ['Bleomycin', C, 'Serious lung toxicity — contraindicated.', 'سمّية رئوية خطيرة — ممنوع الجمع.'],
    ['#inh3a4', W, 'Raises the vedotin part — more nerve damage and low white cells.', 'يرفع جزء الفيدوتين — مزيد من أذية الأعصاب ونقص الكريات البيض.']
  ],
  ask:['infection', 'diabetes'] }

];
