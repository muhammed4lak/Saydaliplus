/* Cholesterol and lipids, antiplatelets, anticoagulants and clot-dissolving
   drugs. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Cholesterol and lipids ---------- */
{ sci:'Atorvastatin', ar:'أتورفاستاتين', atc:'C10AA05', cat:'cvs.lipid', form:'tablet',
  doses:['10 mg', '20 mg', '40 mg', '80 mg'], brand:['Lipitor'],
  tags:['statin', 'sub3a4'],
  notes:{en:'Any time of day. Unexplained muscle pain means get it checked, not push through.',
         ar:'أي وقت من اليوم. ألم عضلي غير مفسّر يستوجب المراجعة لا الاستمرار.'},
  ix:[
    ['Clarithromycin', S, 'Raises the statin — hold it for the course.', 'يرفع الستاتين — يُوقف طوال الكورس.'],
    ['Warfarin', W, 'May raise INR.', 'قد يرفع INR.'],
    ['Colchicine', S, 'Compounded myopathy risk.', 'خطر اعتلال عضلي مضاعف.']
  ],
  ci:['hepActive', 'pregBf'],
  ask:['preg', 'liver', 'muscle'] },

{ sci:'Rosuvastatin', ar:'روزوفاستاتين', atc:'C10AA07', cat:'cvs.lipid', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg', '40 mg'], brand:['Crestor'],
  tags:['statin'],
  notes:{en:'The most potent statin per milligram, and less entangled in enzyme interactions than atorvastatin.',
         ar:'أقوى الستاتينات لكل ملغ، وتفاعلاته الإنزيمية أقل من الأتورفاستاتين.'},
  ix:[
    ['Warfarin', S, 'Raises INR — recheck within a week.', 'يرفع INR — يُعاد الفحص بعد أسبوع.'],
    ['Clopidogrel', W, 'Raises rosuvastatin levels.', 'يرفع مستوى الروزوفاستاتين.']
  ],
  ci:['hepActive', 'pregBf', {en:'Myopathy', ar:'اعتلال عضلي'}],
  ask:['preg', 'kidney', 'muscle'] },

{ sci:'Simvastatin', ar:'سيمفاستاتين', atc:'C10AA01', cat:'cvs.lipid', form:'tablet',
  doses:['10 mg', '20 mg', '40 mg'], brand:['Zocor'],
  tags:['statin', 'sub3a4crit'], take:['evening'],
  notes:{en:'In the evening — cholesterol is made overnight. The most interaction-prone statin: check clarithromycin and amlodipine.',
         ar:'مساءً — تصنيع الكوليسترول ليلي. أكثر الستاتينات تفاعلاً: راجع الكلاريثرومايسين والأملوديبين.'},
  ix:[
    ['Clarithromycin', C, 'Rhabdomyolysis — the combination is contraindicated.', 'انحلال ربيدات — ممنوع الجمع.'],
    ['Amlodipine', W, 'Limit simvastatin to 20 mg daily.', 'يُحدّ السيمفاستاتين بـ 20 ملغ يومياً.'],
    ['Fluconazole', S, 'Myopathy risk.', 'خطر اعتلال عضلي.']
  ],
  ci:['hepActive', 'pregBf', {en:'Concurrent clarithromycin', ar:'الاستعمال المتزامن مع الكلاريثرومايسين'}],
  ask:['otherMeds', 'preg', 'muscle'] },

{ sci:'Pravastatin', ar:'برافاستاتين', atc:'C10AA03', cat:'cvs.lipid', form:'tablet',
  doses:['10 mg', '20 mg', '40 mg'], brand:['Pravachol'],
  tags:['statin'], take:['bedtime'],
  notes:{en:'At bedtime. It has fewer interactions than other statins. Report unexplained muscle pain or weakness.',
         ar:'قبل النوم. تداخلاته أقل من غيره من الستاتينات. أبلغ عن ألم أو ضعف عضلي غير مبرّر.'},
  ci:['hepActive', 'pregBf'],
  ask:['preg', 'liver', 'muscle'] },

{ sci:'Ezetimibe', ar:'إيزيتيمايب', atc:'C10AX09', cat:'cvs.lipid', form:'tablet',
  doses:['10 mg', '10 mg + simvastatin 20 mg', '10 mg + atorvastatin 20 mg'], brand:['Ezetrol', 'Zetia'],
  notes:{en:'Once a day at any time. Usually added to a statin. Report unexplained muscle pain.',
         ar:'مرة واحدة يومياً في أي وقت. يُضاف عادة إلى ستاتين. أبلغ عن ألم عضلي غير مبرّر.'},
  ix:[
    ['Ciclosporin', W, 'Each raises the other — monitor.', 'كلٌّ منهما يرفع الآخر — يُراقب.']
  ],
  ci:['hepModSevere'],
  ask:['liver', 'muscle'] },

{ sci:'Fenofibrate', ar:'فينوفايبرات', atc:'C10AB05', cat:'cvs.lipid', form:'capsule',
  doses:['145 mg', '160 mg', '200 mg', '267 mg'], brand:['Lipanthyl', 'Tricor'],
  take:['withFood'],
  notes:{en:'With food, once a day. Mainly for high triglycerides. Report unexplained muscle pain or pain under the right ribs.',
         ar:'مع الطعام، مرة واحدة يومياً. للدهون الثلاثية المرتفعة غالباً. أبلغ عن ألم عضلي غير مبرّر أو ألم تحت الأضلاع اليمنى.'},
  ix:[
    ['Warfarin', S, 'Raises the INR — check it and lower warfarin.', 'يرفع INR — افحصه وخفّض الوارفارين.'],
    ['#statin', W, 'More risk of muscle damage — report muscle pain.', 'خطر أكبر لأذية العضلات — أبلغ عن ألم العضلات.']
  ],
  ci:['hepSevere', 'renalSevere', {en:'Gallbladder disease', ar:'مرض المرارة'}],
  ask:['kidney', 'thinner', 'muscle'] },

{ sci:'Gemfibrozil', ar:'جيمفيبروزيل', atc:'C10AB04', cat:'cvs.lipid', form:'tablet',
  doses:['300 mg', '600 mg'], brand:['Lopid'],
  take:['beforeFood'],
  notes:{en:'Half an hour before breakfast and dinner. It interacts badly with statins and some diabetes tablets — tell every prescriber you take it.',
         ar:'قبل الفطور والعشاء بنصف ساعة. يتداخل تداخلاً سيئاً مع الستاتينات وبعض أدوية السكري — أخبر كل طبيب أنك تأخذه.'},
  ix:[
    ['Simvastatin', C, 'Rhabdomyolysis — contraindicated.', 'انحلال العضلات المخططة — ممنوع الجمع.'],
    ['#statin', S, 'Muscle damage — avoid; fenofibrate is the fibrate to use with a statin.', 'أذية عضلية — يُتجنّب؛ الفينوفايبرات هو الفايبرات المناسب مع الستاتين.'],
    ['Repaglinide', C, 'Severe prolonged hypoglycaemia — contraindicated.', 'هبوط سكر شديد مطوّل — ممنوع الجمع.'],
    ['Warfarin', S, 'Raises the INR.', 'يرفع INR.']
  ],
  ci:['hepSevere', 'renalSevere', {en:'Gallbladder disease', ar:'مرض المرارة'}],
  ask:['statin', 'diabetesMeds', 'thinner'] },

{ sci:'Omega-3 acid ethyl esters', ar:'إسترات أحماض أوميغا 3', atc:'C10AX06', cat:'cvs.lipid', form:'capsule',
  doses:['1 g'], brand:['Omacor'], aka:['Omega-3 fatty acids', 'Fish oil'],
  take:['withFood'],
  notes:{en:'With food. A fishy aftertaste and burping are common. High doses slightly increase bleeding.',
         ar:'مع الطعام. طعم السمك في الفم والتجشّؤ شائعان. الجرعات العالية تزيد النزف قليلاً.'},
  ix:[
    ['#anticoag', W, 'Slightly more bleeding at high doses.', 'نزف أكثر قليلاً بالجرعات العالية.']
  ],
  ask:[{en:'Are you allergic to fish or shellfish?', ar:'هل لديك حساسية من السمك أو المأكولات البحرية؟'}, 'thinner'] },

{ sci:'Colestyramine', ar:'كوليستيرامين', atc:'C10AC01', cat:'cvs.lipid', form:'sachet',
  doses:['4 g sachet'], brand:['Questran'], aka:['Cholestyramine'],
  notes:{en:'Stir into water or juice. It binds other medicines in the gut — take them one hour before or four to six hours after. Constipation is common.',
         ar:'يُذاب في الماء أو العصير. يربط الأدوية الأخرى في الأمعاء — خذها قبله بساعة أو بعده بأربع إلى ست ساعات. الإمساك شائع.'},
  ix:[
    ['Levothyroxine', S, 'Binds it — four hours apart.', 'يربطه — بفاصل أربع ساعات.'],
    ['Warfarin', S, 'Binds it — an erratic INR.', 'يربطه — INR غير مستقر.'],
    ['Digoxin', W, 'Binds it — keep the doses apart.', 'يربطه — افصل بين الجرعات.']
  ],
  ci:[{en:'Complete biliary obstruction', ar:'انسداد صفراوي تام'}],
  ask:['otherMeds', 'redFlagsGI'] },

{ sci:'Evolocumab', ar:'إيفولوكوماب', atc:'C10AX13', cat:'cvs.lipid', form:'injection',
  doses:['140 mg/mL pen'], brand:['Repatha'],
  notes:{en:'An injection under the skin every two weeks. Keep it in the fridge and let it reach room temperature for 30 minutes before injecting.',
         ar:'حقنة تحت الجلد كل أسبوعين. تُحفظ في الثلاجة وتُترك 30 دقيقة لتبلغ حرارة الغرفة قبل الحقن.'},
  ask:['injectTech', 'cold'] },

{ sci:'Alirocumab', ar:'أليروكوماب', atc:'C10AX14', cat:'cvs.lipid', form:'injection',
  doses:['75 mg pen', '150 mg pen'], brand:['Praluent'],
  notes:{en:'An injection under the skin every two weeks or monthly. Keep it in the fridge; warm to room temperature before injecting.',
         ar:'حقنة تحت الجلد كل أسبوعين أو شهرياً. تُحفظ في الثلاجة؛ وتُترك لتبلغ حرارة الغرفة قبل الحقن.'},
  ask:['injectTech', 'cold'] },

/* ---------- Antiplatelets ---------- */
{ sci:'Aspirin', ar:'أسبرين', atc:'B01AC06', cat:'cvs.antiplatelet', form:'tablet',
  doses:['75 mg', '81 mg', '100 mg', '300 mg'], brand:['Aspirin Protect', 'Aspro'], aka:['Acetylsalicylic acid'],
  tags:['antiplatelet'], take:['afterFood'],
  notes:{en:'75–100 mg is antiplatelet, not analgesic. Never under 16 with a fever — Reye’s syndrome.',
         ar:'جرعة 75–100 ملغ مضادة للصفيحات لا مسكّنة. لا يُعطى لمن دون 16 سنة مع حمّى — متلازمة راي.'},
  ix:[
    ['Warfarin', S, 'Major bleeding risk — combined only on a specialist’s decision.', 'خطر نزف كبير — يُجمع بينهما بقرار اختصاصي فقط.'],
    ['Ibuprofen', S, 'Cancels the antiplatelet effect — separate the doses.', 'يلغي التأثير المضاد للصفيحات — باعد بين الجرعتين.'],
    ['Methotrexate', S, 'Reduces methotrexate clearance.', 'يقلّل طرح الميثوتريكسيت.']
  ],
  ci:['under16', 'ulcer', 'nsaidAsthma', 'bleedingDisorder'],
  ask:['under16', 'ulcer', 'thinner'] },

{ sci:'Clopidogrel', ar:'كلوبيدوغريل', atc:'B01AC04', cat:'cvs.antiplatelet', form:'tablet',
  doses:['75 mg', '300 mg'], brand:['Plavix'],
  tags:['antiplatelet'],
  notes:{en:'Stopped seven days before surgery — by the doctor, not the patient. It needs liver activation to work.',
         ar:'يُوقف 7 أيام قبل الجراحة بقرار الطبيب لا من تلقاء المريض. يحتاج تفعيلاً كبدياً.'},
  ix:[
    ['Omeprazole', S, 'Blocks clopidogrel activation — switch to pantoprazole.', 'يقلّل تفعيل كلوبيدوغريل — يُبدّل إلى بانتوبرازول.'],
    ['Esomeprazole', S, 'The same problem — switch to pantoprazole.', 'نفس المشكلة — يُبدّل إلى بانتوبرازول.'],
    ['Warfarin', S, 'Major bleeding risk.', 'خطر نزف كبير.']
  ],
  ci:['bleeding', 'hepSevere'],
  ask:['bleedNow', 'ulcer', 'dental'] },

{ sci:'Prasugrel', ar:'براسوغريل', atc:'B01AC22', cat:'cvs.antiplatelet', form:'tablet',
  doses:['5 mg', '10 mg'], brand:['Effient'],
  tags:['antiplatelet'],
  notes:{en:'After a stent, usually with aspirin, for as long as the cardiologist says — never stop early on your own. Tell dentists and surgeons. Report black stools or unusual bleeding.',
         ar:'بعد الدعامة، مع الأسبرين عادة، للمدة التي يحددها طبيب القلب — لا توقفه مبكراً من تلقاء نفسك. أخبر طبيب الأسنان والجرّاح. أبلغ عن البراز الأسود أو النزف غير المعتاد.'},
  ci:['bleeding', {en:'Previous stroke or transient ischaemic attack', ar:'سكتة دماغية أو نوبة إقفارية عابرة سابقة'}, 'hepSevere'],
  ask:['bleedNow', 'dental', {en:'Have you ever had a stroke or a mini-stroke?', ar:'هل أُصبت سابقاً بسكتة دماغية أو نوبة إقفارية عابرة؟'}] },

{ sci:'Ticagrelor', ar:'تيكاغريلور', atc:'B01AC24', cat:'cvs.antiplatelet', form:'tablet',
  doses:['60 mg', '90 mg'], brand:['Brilinta', 'Brilique'],
  tags:['antiplatelet', 'sub3a4crit', 'inducerSensitive'],
  notes:{en:'Twice a day, usually with low-dose aspirin. Mild breathlessness is common — report it if it troubles you. Never stop early without the cardiologist.',
         ar:'مرتين يومياً، مع أسبرين بجرعة منخفضة عادة. ضيق نفس خفيف شائع — أبلغ عنه إن أزعجك. لا توقفه مبكراً دون طبيب القلب.'},
  ix:[
    ['Aspirin', W, 'Aspirin above 100 mg a day makes ticagrelor work less well.', 'الأسبرين فوق 100 ملغ يومياً يُضعف مفعول التيكاغريلور.'],
    ['Simvastatin', S, 'Raises simvastatin — no more than 40 mg.', 'يرفع السيمفاستاتين — لا يتجاوز 40 ملغ.']
  ],
  ci:['bleeding', {en:'Previous brain haemorrhage', ar:'نزف دماغي سابق'}, 'hepSevere'],
  ask:['bleedNow', 'dental', 'otherMeds'] },

{ sci:'Dipyridamole', ar:'ديبيريدامول', atc:'B01AC07', cat:'cvs.antiplatelet', form:'tablet',
  doses:['75 mg', '200 mg MR + aspirin 25 mg'], brand:['Persantin', 'Aggrenox'],
  tags:['antiplatelet'],
  notes:{en:'Headache is common in the first days and fades. Swallow modified-release capsules whole.',
         ar:'الصداع شائع في الأيام الأولى ويخفّ. تُبلع الكبسولات ممتدة المفعول كاملة.'},
  ci:[{en:'Recent heart attack or unstable angina', ar:'احتشاء حديث أو ذبحة غير مستقرة'}],
  ask:['bleedNow', 'heart'] },

/* ---------- Anticoagulants ---------- */
{ sci:'Warfarin', ar:'وارفارين', atc:'B01AA03', cat:'cvs.anticoag', form:'tablet',
  doses:['1 mg', '2 mg', '2.5 mg', '5 mg'], brand:['Coumadin', 'Marevan'],
  tags:['anticoag', 'inducerSensitive'], take:['sameTime'],
  notes:{en:'Consistency with leafy greens matters more than avoiding them. Any new antibiotic means recheck the INR. Same time every day.',
         ar:'ثبات الخضروات الورقية أهم من تجنّبها. أي صادّ حيوي جديد يستوجب إعادة فحص INR. نفس الوقت يومياً.'},
  ix:[
    ['Trimethoprim/Sulfamethoxazole', C, 'Sharp rise in INR — avoid the combination.', 'ارتفاع حاد في INR — يُتجنّب الجمع.'],
    ['Metronidazole', S, 'Markedly raises INR.', 'يرفع INR بوضوح.'],
    ['Ibuprofen', S, 'GI bleeding.', 'نزف هضمي.'],
    ['Carbamazepine', S, 'Lowers INR and loses the protection.', 'يخفض INR ويفقد الحماية.']
  ],
  ci:['preg', 'bleeding', 'ulcer', 'uncontrolledHtn'],
  ask:['inr', 'bleedNow', 'otherMeds'] },

{ sci:'Rivaroxaban', ar:'ريفاروكسابان', atc:'B01AF01', cat:'cvs.anticoag', form:'tablet',
  doses:['2.5 mg', '10 mg', '15 mg', '20 mg'], brand:['Xarelto'],
  tags:['anticoag', 'sub3a4', 'inducerSensitive'], take:['withFood'],
  notes:{en:'The 15 and 20 mg doses must be taken with food or they will not absorb. No INR needed, but no safer than warfarin once bleeding starts.',
         ar:'جرعة 15 و20 ملغ مع الطعام وإلا لم تُمتص. لا يحتاج INR لكنه ليس أأمن من الوارفارين مع النزف.'},
  ix:[
    ['Clarithromycin', S, 'Raises rivaroxaban levels and bleeding risk.', 'يرفع مستوى الريفاروكسابان وخطر النزف.'],
    ['Ibuprofen', S, 'GI bleeding.', 'نزف هضمي.'],
    ['Carbamazepine', S, 'Lowers levels and loses the protection.', 'يخفض المستوى ويفقد الحماية.']
  ],
  ci:['bleeding', 'pregBf', {en:'Hepatic disease with coagulopathy', ar:'قصور كبدي مع اعتلال تخثر'}],
  ask:['kidney', 'bleedNow', 'dental'] },

{ sci:'Apixaban', ar:'أبيكسابان', atc:'B01AF02', cat:'cvs.anticoag', form:'tablet',
  doses:['2.5 mg', '5 mg'], brand:['Eliquis'],
  tags:['anticoag', 'sub3a4', 'inducerSensitive'],
  notes:{en:'Twice a day, about 12 hours apart — missed doses leave you unprotected. Carry a card saying you take it. Report black stools, blood in the urine or heavy bruising.',
         ar:'مرتين يومياً، بفاصل 12 ساعة تقريباً — نسيان الجرعات يتركك دون حماية. احمل بطاقة تذكر أنك تأخذه. أبلغ عن البراز الأسود أو الدم في البول أو الكدمات الكثيرة.'},
  ci:['bleeding', 'hepSevere', {en:'Mechanical heart valve', ar:'صمام قلب ميكانيكي'}],
  ask:['kidney', 'bleedNow', 'dental'] },

{ sci:'Dabigatran', ar:'دابيغاتران', atc:'B01AE07', cat:'cvs.anticoag', form:'capsule',
  doses:['75 mg', '110 mg', '150 mg'], brand:['Pradaxa'],
  tags:['anticoag', 'inducerSensitive'], take:['withFood'],
  notes:{en:'Swallow the capsule whole — never open it, which multiplies the dose absorbed. Keep it in the original pack. Take with food if it upsets the stomach. Report any bleeding.',
         ar:'تُبلع الكبسولة كاملة — لا تُفتح أبداً لأن ذلك يضاعف الجرعة الممتصة. تُحفظ في عبوتها الأصلية. تؤخذ مع الطعام إن أزعجت المعدة. أبلغ عن أي نزف.'},
  ix:[
    ['Verapamil', S, 'Raises dabigatran — a lower dose is used.', 'يرفع الدابيغاتران — تُستعمل جرعة أقل.'],
    ['Ketoconazole', C, 'Raises dabigatran sharply — contraindicated with ketoconazole tablets.', 'يرفع الدابيغاتران بشدة — ممنوع مع أقراص الكيتوكونازول.']
  ],
  ci:['renal30', 'bleeding', {en:'Mechanical heart valve', ar:'صمام قلب ميكانيكي'}],
  ask:['kidney', 'bleedNow', 'dental'] },

{ sci:'Edoxaban', ar:'إيدوكسابان', atc:'B01AF03', cat:'cvs.anticoag', form:'tablet',
  doses:['15 mg', '30 mg', '60 mg'], brand:['Lixiana', 'Savaysa'],
  tags:['anticoag'],
  notes:{en:'Once a day at the same time. Carry a card saying you take it. Report black stools, blood in the urine or heavy bruising.',
         ar:'مرة واحدة يومياً في الوقت نفسه. احمل بطاقة تذكر أنك تأخذه. أبلغ عن البراز الأسود أو الدم في البول أو الكدمات الكثيرة.'},
  ci:['bleeding', 'hepSevere', {en:'Mechanical heart valve', ar:'صمام قلب ميكانيكي'}],
  ask:['kidney', 'bleedNow', 'dental'] },

{ sci:'Acenocoumarol', ar:'أسينوكومارول', atc:'B01AA07', cat:'cvs.anticoag', form:'tablet',
  doses:['1 mg', '4 mg'], brand:['Sintrom'],
  tags:['anticoag', 'inducerSensitive'], take:['sameTime'],
  notes:{en:'Like warfarin: the same time every day, regular INR tests, and a steady diet rather than avoiding greens. Any new medicine, including antibiotics, means an earlier INR check.',
         ar:'كالوارفارين: في الوقت نفسه كل يوم، وفحوص INR منتظمة، ونظام غذائي ثابت بدل تجنّب الخضار. أي دواء جديد، ومنه المضادات الحيوية، يستدعي فحص INR مبكراً.'},
  ix:[
    ['Metronidazole', S, 'Markedly raises the INR.', 'يرفع INR كثيراً.'],
    ['Trimethoprim/Sulfamethoxazole', C, 'Sharp rise in the INR — avoid.', 'ارتفاع حاد في INR — يُتجنّب.'],
    ['Fluconazole', S, 'Raises the INR.', 'يرفع INR.']
  ],
  ci:['preg', 'bleeding', 'hepSevere'],
  ask:['inr', 'bleedNow', 'otherMeds'] },

{ sci:'Enoxaparin', ar:'إينوكسابارين', atc:'B01AB05', cat:'cvs.anticoag', form:'injection',
  doses:['20 mg', '40 mg', '60 mg', '80 mg', '100 mg prefilled syringe'], brand:['Clexane', 'Lovenox'],
  tags:['anticoag'],
  notes:{en:'Injected under the skin of the belly, alternating sides; do not push out the air bubble or rub afterwards. A bruise at the site is normal; report other bleeding.',
         ar:'يُحقن تحت جلد البطن بالتناوب بين الجانبين؛ لا تُخرج فقاعة الهواء ولا تدلك بعد الحقن. الكدمة مكان الحقن طبيعية؛ أبلغ عن أي نزف آخر.'},
  ci:['bleeding', {en:'Heparin-induced thrombocytopenia, past or present', ar:'نقص الصفيحات المحرّض بالهيبارين، حالياً أو سابقاً'}],
  ask:['kidney', 'bleedNow', 'injectTech'] },

{ sci:'Heparin', ar:'هيبارين', atc:'B01AB01', cat:'cvs.anticoag', form:'injection',
  doses:['5,000 units/mL', '25,000 units/5 mL'], aka:['Heparin sodium', 'Unfractionated heparin'],
  tags:['anticoag'],
  notes:{en:'Hospital use, by infusion or injection, with regular clotting tests (aPTT) and platelet counts. Report any bleeding.',
         ar:'للمستشفى، تسريباً أو حقناً، مع فحوص تخثّر منتظمة (aPTT) وتعداد صفيحات. أبلغ عن أي نزف.'},
  ci:['bleeding', {en:'Heparin-induced thrombocytopenia, past or present', ar:'نقص الصفيحات المحرّض بالهيبارين، حالياً أو سابقاً'}],
  ask:['bleedNow', 'kidney'] },

{ sci:'Fondaparinux', ar:'فوندابارينوكس', atc:'B01AX05', cat:'cvs.anticoag', form:'injection',
  doses:['2.5 mg', '7.5 mg prefilled syringe'], brand:['Arixtra'],
  tags:['anticoag'],
  notes:{en:'Once a day under the skin of the belly. Bruising at the site is common; report other bleeding.',
         ar:'مرة واحدة يومياً تحت جلد البطن. الكدمات مكان الحقن شائعة؛ أبلغ عن أي نزف آخر.'},
  ci:['bleeding', {en:'Creatinine clearance below 20 mL/min', ar:'تصفية كرياتينين أقل من 20 مل/دقيقة'}],
  ask:['kidney', 'bleedNow', 'injectTech'] },

/* ---------- Clot-dissolving drugs ---------- */

{ sci:'Alteplase', ar:'ألتيبلاز', atc:'B01AD02', cat:'cvs.thrombolytic', form:'injection',
  doses:['50 mg vial'], brand:['Actilyse'], aka:['Recombinant tissue plasminogen activator', 'rt-PA'],
  notes:{en:'Hospital only, for stroke, heart attack or a lung clot within strict time windows. Bleeding is the main danger.',
         ar:'للمستشفى فقط، للسكتة أو الاحتشاء أو خثرة الرئة ضمن نوافذ زمنية صارمة. النزف هو الخطر الأكبر.'},
  ci:['bleeding', {en:'Recent stroke, surgery or head injury', ar:'سكتة أو جراحة أو إصابة رأس حديثة'}, 'uncontrolledHtn'],
  ask:['bleeding', 'thinner'] },

{ sci:'Tenecteplase', ar:'تينيكتيبلاز', atc:'B01AD11', cat:'cvs.thrombolytic', form:'injection',
  doses:['50 mg vial'], brand:['Metalyse'],
  notes:{en:'Hospital only — a single injection for a heart attack within hours of onset. Bleeding is the main danger.',
         ar:'للمستشفى فقط — حقنة واحدة للاحتشاء خلال ساعات من بدئه. النزف هو الخطر الأكبر.'},
  ci:['bleeding', {en:'Recent stroke, surgery or head injury', ar:'سكتة أو جراحة أو إصابة رأس حديثة'}, 'uncontrolledHtn'],
  ask:['bleeding', 'thinner'] },

{ sci:'Streptokinase', ar:'ستربتوكيناز', atc:'B01AD01', cat:'cvs.thrombolytic', form:'injection',
  doses:['1,500,000 units vial'], brand:['Streptase'],
  notes:{en:'Hospital only, for a heart attack. Allergic reactions and low blood pressure are watched for during the infusion; it is not repeated once antibodies have formed.',
         ar:'للمستشفى فقط، للاحتشاء. تُراقب تفاعلات التحسّس وهبوط الضغط أثناء التسريب؛ ولا يُكرّر بعد تكوّن الأضداد.'},
  ci:['bleeding', {en:'Streptokinase given between 5 days and 12 months ago', ar:'إعطاء ستربتوكيناز قبل 5 أيام إلى 12 شهراً'}, 'uncontrolledHtn'],
  ask:['bleeding', 'allergy'] }

];
