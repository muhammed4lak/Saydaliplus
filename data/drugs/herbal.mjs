/* Herbal medicines — registered herbal products are a large, busy shelf in
   Iraqi pharmacies (ivy-leaf syrups, urinary "stone" remedies, black seed).
   "Natural" is not "harmless": the entries flag the herbs that interact
   (St John's wort above all) and those that are unsafe in pregnancy, in
   children or in liver disease.
   Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Herbal cough and cold ---------- */

{ sci:'Ivy leaf extract', ar:'خلاصة أوراق اللبلاب', atc:'R05CA12', cat:'hrb.respiratory', form:'syrup',
  doses:['35 mg/5 mL syrup', 'drops', 'effervescent tablet', 'with thyme'], brand:['Prospan', 'Hederix', 'Bronchipret'], aka:['Hedera helix', 'Hederae helicis folium'],
  notes:{en:'Loosens phlegm in a productive cough. It may upset the stomach. Not for children under two; see a doctor for breathlessness, a high fever, or a cough lasting over a week.',
         ar:'يليّن البلغم في السعال المنتج. قد يزعج المعدة. لا يُعطى للأطفال دون السنتين؛ راجع الطبيب عند ضيق التنفس أو الحرارة العالية أو سعال يستمر أكثر من أسبوع.'},
  ci:['under2'],
  ask:['childAge', 'productiveCough', 'duration'] },

{ sci:'Thyme extract', ar:'خلاصة الزعتر', atc:'R05CA', cat:'hrb.respiratory', form:'syrup',
  doses:['syrup', 'drops', 'with ivy or primula root'], brand:['Bronchicum', 'Bronchipret'], aka:['Thymus vulgaris', 'Thymi herba'],
  notes:{en:'A traditional remedy for coughs and bronchitis. Some syrups contain alcohol or sugar — check the label for children and people with diabetes.',
         ar:'علاج تقليدي للسعال والتهاب القصبات. بعض الأشربة تحتوي كحولاً أو سكراً — راجع النشرة للأطفال ومرضى السكري.'},
  ask:['childAge', 'diabetes', 'duration'] },

{ sci:'Pelargonium sidoides', ar:'بيلارغونيوم سيدويدس', atc:'R05', cat:'hrb.respiratory', form:'drops',
  doses:['oral drops', 'syrup', '20 mg tablet'], brand:['Umckaloabo', 'Kaloba'], aka:['Umckaloabo', 'South African geranium'],
  notes:{en:'For colds and acute bronchitis, for up to three weeks. Rarely it has harmed the liver — stop it and see a doctor if the skin or eyes turn yellow.',
         ar:'لنزلات البرد والتهاب القصبات الحاد، لمدة أقصاها ثلاثة أسابيع. أذى الكبد نادراً — أوقفه وراجع الطبيب إذا اصفرّ الجلد أو العينان.'},
  ix:[
    ['#anticoag', W, 'Contains coumarins — a theoretical effect on the INR.', 'يحتوي كومارينات — تأثير نظري على INR.']
  ],
  ci:['hepSevere', 'under2'],
  ask:['liver', 'thinner', 'childAge'] },

{ sci:'Primula root', ar:'جذر زهرة الربيع', atc:'R05CA', cat:'hrb.respiratory', form:'syrup',
  doses:['in cough syrups with thyme'], aka:['Primulae radix', 'Cowslip root'],
  notes:{en:'Loosens phlegm in a productive cough; it can upset the stomach.',
         ar:'يليّن البلغم في السعال المنتج؛ وقد يزعج المعدة.'},
  ask:['childAge', 'productiveCough'] },

{ sci:'Liquorice root', ar:'جذر السوس', atc:'A02BX', cat:'hrb.respiratory', form:'syrup',
  doses:['in cough syrups and lozenges', 'deglycyrrhizinised tablets', 'dried root (erq sous)'], aka:['Glycyrrhiza glabra', 'Licorice', 'Glycyrrhizin'],
  tags:['kLosing'],
  notes:{en:'Regular large amounts — including the popular erq sous drink — raise blood pressure, retain fluid and lower potassium. Avoid in high blood pressure, heart or kidney disease and pregnancy.',
         ar:'الكميات الكبيرة المنتظمة — ومنها شراب عرق السوس الشائع — ترفع الضغط وتحبس السوائل وتخفض البوتاسيوم. يُتجنّب في ارتفاع الضغط وأمراض القلب والكلى والحمل.'},
  ci:['uncontrolledHtn', 'hypoK', 'hfSevere', 'preg'],
  ask:['bp', 'potassium', 'preg'] },

{ sci:'Echinacea', ar:'إشنسا', atc:'L03AX', cat:'hrb.respiratory', form:'tablet',
  doses:['tablets', 'drops', 'with vitamin C'], brand:['Echinaforce'], aka:['Echinacea purpurea', 'Purple coneflower'],
  notes:{en:'Taken at the start of a cold, for up to 10 days. People allergic to daisies or ragweed may react. Not with immune-suppressing treatment.',
         ar:'يؤخذ في بداية الزكام لمدة أقصاها 10 أيام. قد يتحسّس منه من لديهم حساسية من الأقحوان أو الرجيد. لا يُستعمل مع العلاجات المثبطة للمناعة.'},
  ix:[
    ['#immunosuppressant', W, 'May work against the immunosuppressant.', 'قد يعاكس أثر مثبط المناعة.']
  ],
  ci:[{en:'Autoimmune disease or immunosuppressive treatment', ar:'مرض مناعي ذاتي أو علاج مثبط للمناعة'}],
  ask:['immune', 'allergy', 'duration'] },

/* ---------- Herbal digestive ---------- */

{ sci:'Peppermint oil', ar:'زيت النعناع', atc:'A03AX15', cat:'hrb.digestive', form:'capsule',
  doses:['187 mg enteric-coated capsule', '0.2 mL capsule'], brand:['Colpermin', 'Mintec', 'Buscomint'], aka:['Mentha piperita oil', 'Menthae piperitae aetheroleum'],
  take:['beforeFood'],
  notes:{en:'For irritable bowel cramps: swallowed whole, before meals. Acid reducers or antacids dissolve the coating early and cause heartburn — keep them apart.',
         ar:'لتقلّصات القولون العصبي: تُبلع كاملة قبل الوجبات. خافضات الحمض أو مضادات الحموضة تذيب الغلاف مبكراً فتسبّب الحرقة — افصل بينهما.'},
  ix:[
    ['#acidReducer', W, 'The capsule opens too early — heartburn.', 'تنفتح الكبسولة مبكراً — حرقة.']
  ],
  ci:[{en:'Children under eight (capsules)', ar:'الأطفال دون الثامنة (الكبسولات)'}],
  ask:['redFlagsGI', 'antacids', 'childAge'] },

{ sci:'Artichoke leaf extract', ar:'خلاصة أوراق الخرشوف', atc:'A05AX', cat:'hrb.digestive', form:'tablet',
  doses:['tablets', 'capsules', 'with other liver herbs'], brand:['Hepar-SL', 'Chophytol'], aka:['Cynara scolymus', 'Cynarae folium'],
  notes:{en:'A traditional remedy for indigestion and bloating after fatty meals. Not with gallstones or a blocked bile duct.',
         ar:'علاج تقليدي لعسر الهضم والانتفاخ بعد الوجبات الدسمة. لا يُستعمل مع حصى المرارة أو انسداد القناة الصفراوية.'},
  ci:[{en:'Gallstones or bile duct obstruction', ar:'حصى المرارة أو انسداد القناة الصفراوية'}, {en:'Allergy to daisy-family plants', ar:'الحساسية من نباتات الفصيلة النجمية'}],
  ask:['redFlagsGI', 'liver', 'allergy'] },

{ sci:'Fennel', ar:'الشمر', atc:'A03AX', cat:'hrb.digestive', form:'sachet',
  doses:['herbal tea', 'fennel-seed drops', 'in colic and wind remedies'], brand:['Babynos'], aka:['Foeniculum vulgare', 'Fennel seed'],
  notes:{en:'A traditional remedy for wind and colic. Not for long periods in babies, young children or pregnancy — the oil contains estragole.',
         ar:'علاج تقليدي للغازات والمغص. لا يُستعمل لفترات طويلة عند الرضّع والأطفال الصغار أو في الحمل — لأن زيته يحتوي الإستراغول.'},
  ask:['childAge', 'preg', 'duration'] },

{ sci:'Chamomile', ar:'البابونج', atc:'A03AX', cat:'hrb.digestive', form:'sachet',
  doses:['herbal tea', 'extract', 'mouthwash', 'cream'], aka:['Matricaria chamomilla', 'Matricariae flos'],
  notes:{en:'A calming tea for indigestion and sleep, and a soothing mouthwash. People allergic to daisies or ragweed may react.',
         ar:'شاي مهدّئ لعسر الهضم والنوم، وغسول فم ملطّف. قد يتحسّس منه من لديهم حساسية من الأقحوان أو الرجيد.'},
  ix:[
    ['Warfarin', W, 'Large amounts may raise the INR.', 'الكميات الكبيرة قد ترفع INR.']
  ],
  ask:['allergy', 'thinner'] },

{ sci:'Nigella sativa', ar:'الحبة السوداء', atc:'V03AX', cat:'hrb.other', form:'capsule',
  doses:['oil capsules', 'oil', 'seeds'], aka:['Black seed', 'Black cumin', 'Habbat al-barakah', 'Kalonji'],
  notes:{en:'A popular traditional remedy. In supplement doses it may lower blood sugar and blood pressure a little — watch sugar readings on diabetes medicines. Large amounts are best avoided in pregnancy.',
         ar:'علاج تقليدي شائع. بجرعات المكمّلات قد يخفض سكر الدم والضغط قليلاً — راقب قراءات السكر مع أدوية السكري. يُفضّل تجنّب الكميات الكبيرة في الحمل.'},
  ix:[
    ['#antidiabetic', W, 'May lower blood sugar further.', 'قد يزيد انخفاض سكر الدم.'],
    ['#anticoag', W, 'May add to bleeding in large amounts.', 'قد يزيد النزف بالكميات الكبيرة.']
  ],
  ask:['diabetesMeds', 'thinner', 'preg'] },

/* ---------- Herbal kidney and urinary ---------- */

{ sci:'Cranberry', ar:'التوت البري', atc:'G04BX', cat:'hrb.urinary', form:'capsule',
  doses:['capsules', 'juice', 'sachets'], aka:['Vaccinium macrocarpon'],
  notes:{en:'May help prevent repeated bladder infections in some women; it does not treat an infection. Large amounts can raise the INR on warfarin.',
         ar:'قد يساعد على منع التهابات المثانة المتكررة عند بعض النساء؛ لكنه لا يعالج الالتهاب. الكميات الكبيرة قد ترفع INR مع الوارفارين.'},
  ix:[
    ['Warfarin', W, 'Large amounts may raise the INR.', 'الكميات الكبيرة قد ترفع INR.']
  ],
  ask:['uti', 'thinner', 'stones'] },

{ sci:'Terpenes (pinene, camphene, borneol, anethole, fenchone, cineole)', ar:'التربينات (بينين، كامفين، بورنيول، أنيثول، فينشون، سينيول)', atc:'G04BC', cat:'hrb.urinary', form:'capsule',
  doses:['capsules', 'drops'], brand:['Rowatinex', 'Rowachol'], aka:['Rowatinex'],
  notes:{en:'Used to help small kidney stones pass, with plenty of fluid; severe pain, fever or blood in the urine need a doctor.',
         ar:'يُستعمل للمساعدة على خروج حصى الكلى الصغيرة، مع سوائل كثيرة؛ والألم الشديد أو الحرارة أو الدم في البول تستوجب الطبيب.'},
  ix:[
    ['Warfarin', W, 'May weaken warfarin — check the INR.', 'قد يُضعف الوارفارين — افحص INR.']
  ],
  ask:['stones', 'thinner', 'kidney'] },

{ sci:'Saw palmetto', ar:'البلميط المنشاري', atc:'G04CX02', cat:'hrb.urinary', form:'capsule',
  doses:['320 mg capsule'], brand:['Prostamol Uno', 'Permixon'], aka:['Serenoa repens', 'Sabal'],
  notes:{en:'Used for mild prostate symptoms. Prostate symptoms need a check-up first, including a PSA test.',
         ar:'يُستعمل لأعراض البروستاتا الخفيفة. أعراض البروستاتا تحتاج فحصاً أولاً، ومنه تحليل PSA.'},
  ix:[
    ['#anticoag', W, 'Rare bleeding reports.', 'تقارير نادرة عن نزف.']
  ],
  ask:['prostate', 'thinner'] },

{ sci:'Pygeum africanum', ar:'البرقوق الأفريقي', atc:'G04CX01', cat:'hrb.urinary', form:'capsule',
  doses:['50 mg capsule'], brand:['Tadenan'], aka:['Prunus africana'],
  notes:{en:'Used for mild prostate symptoms; a check-up comes first.',
         ar:'يُستعمل لأعراض البروستاتا الخفيفة؛ والفحص يسبق ذلك.'},
  ask:['prostate'] },

/* ---------- Other herbal ---------- */

{ sci:'St John’s wort', ar:'عشبة سانت جون', atc:'N06AX25', cat:'hrb.other', form:'tablet',
  doses:['300 mg tablet', 'capsules', 'tea'], brand:['Jarsin', 'Kira'], aka:['Hypericum perforatum', 'Hypericum', 'St Johns wort'],
  tags:['inducer', 'sero'],
  notes:{en:'A herbal antidepressant with many serious interactions: it weakens the pill, warfarin, ciclosporin, HIV and heart medicines, and with antidepressants causes serotonin toxicity. Ask before combining it with anything.',
         ar:'مضاد اكتئاب عشبي له تفاعلات خطيرة كثيرة: يُضعف حبوب منع الحمل والوارفارين والسيكلوسبورين وأدوية الإيدز والقلب، ومع مضادات الاكتئاب يسبّب تسمّم السيروتونين. اسأل قبل جمعه مع أي دواء.'},
  ix:[
    ['#hormonalContraceptive', S, 'The pill can fail — pregnancy risk.', 'قد تفشل حبوب منع الحمل — خطر الحمل.'],
    ['Warfarin', S, 'Lowers the INR — clots.', 'يخفض INR — جلطات.'],
    ['Digoxin', S, 'Lowers digoxin levels.', 'يخفض مستوى الديجوكسين.']
  ],
  ci:['mania', 'preg'],
  ask:['otherMeds', 'ocp', 'antidep'] },

{ sci:'Ginkgo biloba', ar:'الجنكة بيلوبا', atc:'N06DX02', cat:'hrb.other', form:'tablet',
  doses:['40 mg', '80 mg', '120 mg tablet'], brand:['Tanakan', 'Tebonin', 'Ginkor Fort'], aka:['Ginkgo', 'EGb 761'],
  notes:{en:'Used for memory and circulation; the benefit is modest. It may increase bleeding — stop it before surgery and take care with blood thinners.',
         ar:'يُستعمل للذاكرة والدورة الدموية؛ والفائدة متواضعة. قد يزيد النزف — أوقفه قبل الجراحة واحذر مع مميّعات الدم.'},
  ix:[
    ['#anticoag', W, 'More bleeding.', 'نزف أكثر.'],
    ['#antiplatelet', W, 'More bleeding.', 'نزف أكثر.'],
    ['#nsaid', W, 'More bleeding.', 'نزف أكثر.']
  ],
  ci:['bleedingDisorder', 'epilepsy'],
  ask:['thinner', 'dental', 'epilepsy'] },

{ sci:'Ginseng', ar:'الجنسنغ', atc:'A13A', cat:'hrb.other', form:'capsule',
  doses:['capsules', 'tablets', 'with vitamins'], brand:['Ginsana', 'Pharmaton'], aka:['Panax ginseng', 'Korean ginseng'],
  notes:{en:'A tonic for tiredness; it can cause sleeplessness and raise blood pressure, and may lower blood sugar.',
         ar:'مقوٍّ للتعب؛ قد يسبّب الأرق ويرفع الضغط، وقد يخفض سكر الدم.'},
  ix:[
    ['Warfarin', W, 'May lower the INR.', 'قد يخفض INR.'],
    ['#antidiabetic', W, 'May lower blood sugar further.', 'قد يزيد انخفاض سكر الدم.'],
    ['#maoi', W, 'Headache, tremor and mania have been reported.', 'سُجّل صداع ورعاش وهوس.']
  ],
  ask:['bp', 'diabetesMeds', 'thinner'] },

{ sci:'Valerian', ar:'الناردين', atc:'N05CM09', cat:'hrb.other', form:'tablet',
  doses:['tablets', 'drops', 'with hops or lemon balm'], brand:['Sedonium', 'Valdispert'], aka:['Valeriana officinalis', 'Valerian root'],
  notes:{en:'A mild sleep aid, taken an hour before bed. It can cause morning drowsiness — take care driving. Not with alcohol or other sleeping medicines.',
         ar:'مساعد خفيف على النوم، يؤخذ قبل النوم بساعة. قد يسبّب نعاساً صباحياً — احذر القيادة. لا يُجمع مع الكحول أو أدوية النوم الأخرى.'},
  ix:[
    ['#sedative', W, 'More drowsiness.', 'نعاس أكثر.'],
    ['Alcohol', W, 'More drowsiness.', 'نعاس أكثر.']
  ],
  ask:['sedatives', 'drive', 'liver'] },

{ sci:'Garlic', ar:'الثوم', atc:'C10AX', cat:'hrb.other', form:'capsule',
  doses:['garlic oil capsules', 'powder tablets'], brand:['Kwai', 'Garlicin'], aka:['Allium sativum'],
  notes:{en:'Supplements are taken for cholesterol and circulation, with modest effect. High doses thin the blood — stop them before surgery.',
         ar:'تُؤخذ المكمّلات للكوليسترول والدورة الدموية بأثر متواضع. الجرعات العالية تميّع الدم — أوقفها قبل الجراحة.'},
  ix:[
    ['#anticoag', W, 'High doses: more bleeding.', 'الجرعات العالية: نزف أكثر.']
  ],
  ask:['thinner', 'dental'] },

{ sci:'Curcumin', ar:'الكركمين', atc:'A05', cat:'hrb.other', form:'capsule',
  doses:['capsules', 'with piperine', 'with boswellia'], aka:['Turmeric', 'Curcuma longa'],
  notes:{en:'Taken for joint pain and inflammation. Concentrated supplements have rarely harmed the liver, and they may add to blood thinners.',
         ar:'يؤخذ لآلام المفاصل والالتهاب. المكمّلات المركّزة أذت الكبد نادراً، وقد تزيد أثر مميّعات الدم.'},
  ix:[
    ['#anticoag', W, 'May add to bleeding.', 'قد يزيد النزف.']
  ],
  ci:[{en:'Gallstones or bile duct obstruction', ar:'حصى المرارة أو انسداد القناة الصفراوية'}],
  ask:['thinner', 'liver'] },

{ sci:'Boswellia serrata', ar:'اللبان الهندي', atc:'M01AX', cat:'hrb.other', form:'capsule',
  doses:['capsules', 'with curcumin'], aka:['Boswellia', 'Indian frankincense', 'Frankincense'],
  notes:{en:'Taken for joint pain; it can upset the stomach.',
         ar:'يؤخذ لآلام المفاصل؛ وقد يزعج المعدة.'},
  ask:['thinner', 'redFlagsGI'] },

{ sci:'Aescin', ar:'الإيسين', atc:'C05CX03', cat:'hrb.other', form:'tablet',
  doses:['20 mg tablet', '50 mg (horse chestnut extract)', 'gel'], brand:['Reparil', 'Venastat'], aka:['Escin', 'Horse chestnut', 'Aesculus hippocastanum'],
  notes:{en:'For heavy, swollen legs from varicose veins, and bruising (gel). Not on broken skin.',
         ar:'لثقل الساقين وتورمهما بسبب الدوالي، وللكدمات (الهلام). لا يوضع على جلد مجروح.'},
  ix:[
    ['#anticoag', W, 'May add to bleeding.', 'قد يزيد النزف.']
  ],
  ci:['renalSevere'],
  ask:['thinner', 'kidney'] },

{ sci:'Vitex agnus-castus', ar:'كف مريم', atc:'G02CX03', cat:'hrb.other', form:'tablet',
  doses:['4 mg', '20 mg tablet', 'drops'], brand:['Agnucaston', 'Premular'], aka:['Chasteberry', 'Agni casti fructus'],
  notes:{en:'Used for premenstrual symptoms and breast tenderness, for about three months. Not in pregnancy or breastfeeding.',
         ar:'يُستعمل لأعراض ما قبل الدورة وألم الثدي، لنحو ثلاثة أشهر. لا يُستعمل في الحمل أو الرضاعة.'},
  ix:[
    ['#dopaminergic', W, 'May interfere with dopamine medicines.', 'قد يتداخل مع أدوية الدوبامين.'],
    ['#dopamineBlocker', W, 'May interfere with dopamine blockers.', 'قد يتداخل مع حاصرات الدوبامين.']
  ],
  ci:['pregBf', 'estrogenCancer'],
  ask:['preg', 'ocp'] },

{ sci:'Black cohosh', ar:'الكوهوش الأسود', atc:'G02CX04', cat:'hrb.other', form:'tablet',
  doses:['6.5 mg', '20 mg tablet'], brand:['Remifemin'], aka:['Cimicifuga racemosa', 'Actaea racemosa'],
  notes:{en:'Used for menopausal hot flushes. It has rarely harmed the liver — stop and see a doctor for dark urine, yellow skin or tummy pain.',
         ar:'يُستعمل لهبّات الحرارة في سن اليأس. أذى الكبد نادراً — أوقفه وراجع الطبيب عند البول الداكن أو اصفرار الجلد أو ألم البطن.'},
  ci:['hep', 'estrogenCancer'],
  ask:['liver', 'pmBleeding'] },

{ sci:'Evening primrose oil', ar:'زيت زهرة الربيع المسائية', atc:'D11AX02', cat:'hrb.other', form:'capsule',
  doses:['500 mg', '1000 mg capsule'], brand:['Efamol'], aka:['Oenothera biennis', 'Gamolenic acid'],
  notes:{en:'Taken for breast tenderness and dry skin; evidence is weak. It may lower the seizure threshold with some antipsychotics.',
         ar:'يؤخذ لألم الثدي وجفاف الجلد؛ والأدلة ضعيفة. قد يخفض عتبة النوبات مع بعض مضادات الذهان.'},
  ix:[
    ['#anticoag', W, 'May add to bleeding.', 'قد يزيد النزف.']
  ],
  ask:['epilepsy', 'thinner'] }

];
