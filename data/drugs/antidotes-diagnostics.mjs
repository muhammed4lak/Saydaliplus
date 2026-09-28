/* Poisoning and antidotes, antivenoms and antitoxins, contrast media and
   other diagnostics. Iraq sees organophosphate (pesticide) poisoning,
   scorpion stings and snake bites every summer, so those antidotes are here.
   Antidotes kept elsewhere: acetylcysteine (cough), glucagon (diabetes),
   phytomenadione, deferoxamine and hydroxocobalamin (blood), dantrolene
   (muscle), naltrexone (dependence).
   Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Antidotes ---------- */

{ sci:'Atropine', ar:'أتروبين', atc:'A03BA01', cat:'tox.antidote', form:'injection',
  doses:['0.5 mg/mL', '0.6 mg/mL', '1 mg/mL injection', '2 mg auto-injector'], aka:['Atropine sulfate'],
  tags:['anticholinergic'],
  notes:{en:'For organophosphate (insecticide) and nerve-agent poisoning, given repeatedly until the chest is dry; also for a very slow pulse and before surgery to dry secretions. A dry mouth, flushing and a fast pulse are expected.',
         ar:'لتسمّم الفوسفات العضوية (المبيدات) وغازات الأعصاب، ويُعاد حتى يجفّ الصدر؛ ولبطء النبض الشديد وقبل الجراحة لتجفيف الإفرازات. جفاف الفم واحمرار الجلد وتسرّع النبض متوقّعة.'},
  ci:['angleGlaucoma'],
  ask:['whatTaken', 'glaucoma', 'prostate'] },

{ sci:'Pralidoxime', ar:'براليدوكسيم', atc:'V03AB04', cat:'tox.antidote', form:'injection',
  doses:['1 g vial', '600 mg auto-injector'], brand:['Protopam'], aka:['2-PAM', 'Pralidoxime chloride', 'Obidoxime'],
  notes:{en:'Given with atropine early in organophosphate poisoning to restart the blocked enzyme; it does not replace atropine.',
         ar:'يُعطى مع الأتروبين مبكراً في تسمّم الفوسفات العضوية لإعادة تنشيط الإنزيم المثبَّط؛ ولا يغني عن الأتروبين.'},
  ci:['myasthenia'],
  ask:['whatTaken', 'kidney'] },

{ sci:'Naloxone', ar:'نالوكسون', atc:'V03AB15', cat:'tox.antidote', form:'injection',
  doses:['400 microgram/mL injection', '1.8 mg nasal spray', '20 microgram/mL neonatal'], brand:['Narcan', 'Nyxoid', 'Prenoxad'],
  notes:{en:'Reverses an opioid overdose within minutes. It wears off sooner than many opioids, so breathing can fail again — call an ambulance and stay with the person. It can bring on sudden withdrawal.',
         ar:'يعكس جرعة الأفيونات الزائدة خلال دقائق. يزول أثره قبل كثير من الأفيونات، فقد يتوقف التنفس مجدداً — اتصل بالإسعاف وابقَ مع المصاب. قد يسبّب أعراض انسحاب مفاجئة.'},
  ask:['whatTaken', 'whoFor'] },

{ sci:'Flumazenil', ar:'فلومازينيل', atc:'V03AB25', cat:'tox.antidote', form:'injection',
  doses:['100 microgram/mL injection'], brand:['Anexate', 'Romazicon'],
  notes:{en:'Reverses benzodiazepine sedation after procedures. It is not used for unknown overdoses — in long-term benzodiazepine users or after tricyclic overdose it can cause seizures.',
         ar:'يعكس تهدئة البنزوديازيبينات بعد الإجراءات. لا يُستعمل للجرعات الزائدة المجهولة — عند مستخدمي البنزوديازيبينات لفترات طويلة أو بعد جرعة زائدة من مضادات الاكتئاب ثلاثية الحلقات قد يسبّب نوبات صرع.'},
  ci:[{en:'Tricyclic overdose or long-term benzodiazepine use for epilepsy', ar:'جرعة زائدة من ثلاثيات الحلقات أو استعمال البنزوديازيبينات طويلاً للصرع'}],
  ask:['whatTaken', 'epilepsy', 'sedatives'] },

{ sci:'Activated charcoal', ar:'الفحم المنشّط', atc:'A07BA01', cat:'tox.antidote', form:'solution',
  doses:['50 g suspension', 'powder for suspension', '250 mg capsule (wind)'], brand:['Actidose', 'Carbomix', 'Charcodote'], aka:['Charcoal'],
  notes:{en:'Binds many poisons in the gut if given within an hour of swallowing them. It does not work for iron, lithium, alcohol, acids or alkalis, and is never given to a drowsy person who could choke. Stools turn black.',
         ar:'يربط كثيراً من السموم في الأمعاء إذا أُعطي خلال ساعة من ابتلاعها. لا يفيد للحديد والليثيوم والكحول والأحماض والقلويات، ولا يُعطى أبداً لشخص نعسان قد يختنق. يصبح البراز أسود.'},
  ix:[
    ['#hormonalContraceptive', W, 'Repeated doses can stop the pill working — use extra protection.', 'الجرعات المتكررة قد تُبطل حبوب منع الحمل — استعملي حماية إضافية.']
  ],
  ci:['obstruction', {en:'Swallowed acids, alkalis or hydrocarbons', ar:'ابتلاع الأحماض أو القلويات أو المشتقات النفطية'}],
  ask:['whatTaken', 'otherMeds'] },

{ sci:'Protamine', ar:'بروتامين', atc:'V03AB14', cat:'tox.antidote', form:'injection',
  doses:['10 mg/mL injection'], aka:['Protamine sulfate'],
  notes:{en:'Reverses heparin, for example after heart surgery or bleeding; given slowly, as it can drop the blood pressure. It only partly reverses enoxaparin.',
         ar:'يعكس أثر الهيبارين، مثلاً بعد جراحة القلب أو عند النزف؛ ويُعطى ببطء لأنه قد يخفض الضغط. لا يعكس الإينوكسابارين إلا جزئياً.'},
  ci:[{en:'Allergy to fish, or previous protamine insulin reaction', ar:'الحساسية من السمك، أو تفاعل سابق مع أنسولين البروتامين'}],
  ask:['allergy', 'diabetesMeds'] },

{ sci:'Idarucizumab', ar:'إيداروسيزوماب', atc:'V03AB37', cat:'tox.antidote', form:'injection',
  doses:['2.5 g/50 mL vial (two given)'], brand:['Praxbind'],
  notes:{en:'Reverses dabigatran within minutes for emergency surgery or life-threatening bleeding.',
         ar:'يعكس الدابيغاتران خلال دقائق للجراحة الطارئة أو النزف المهدّد للحياة.'},
  ask:['thinner', 'whatTaken'] },

{ sci:'Digoxin immune fab', ar:'الأجسام المضادة للديجوكسين', atc:'V03AB24', cat:'tox.antidote', form:'injection',
  doses:['40 mg vial'], brand:['DigiFab', 'Digibind'], aka:['Digoxin antibody'],
  notes:{en:'Binds digoxin in a dangerous overdose or toxicity; potassium and the heart rhythm are watched closely.',
         ar:'يربط الديجوكسين في الجرعة الزائدة الخطيرة أو التسمّم؛ ويُراقب البوتاسيوم ونظم القلب عن كثب.'},
  ask:['whatTaken', 'kidney'] },

{ sci:'Methylthioninium chloride', ar:'كلوريد الميثيلثيونينيوم', atc:'V03AB17', cat:'tox.antidote', form:'injection',
  doses:['5 mg/mL injection', '10 mg/mL'], brand:['Proveblue'], aka:['Methylene blue'],
  notes:{en:'Treats blood that cannot carry oxygen (methaemoglobinaemia) from poisons or drugs. Urine and skin turn blue-green. It interacts dangerously with serotonin-raising antidepressants.',
         ar:'يعالج عجز الدم عن حمل الأكسجين (ميتهيموغلوبينية الدم) الناتج عن السموم أو الأدوية. يتلوّن البول والجلد بالأزرق المخضر. يتفاعل تفاعلاً خطيراً مع مضادات الاكتئاب الرافعة للسيروتونين.'},
  tags:['maoi'],
  ci:['g6pd', 'renalSevere'],
  ask:['g6pd', 'antidep', 'whatTaken'] },

{ sci:'Dimercaprol', ar:'ديميركابرول', atc:'V03AB09', cat:'tox.antidote', form:'injection',
  doses:['50 mg/mL oily injection'], aka:['BAL', 'British anti-Lewisite'],
  notes:{en:'A deep, painful muscle injection for arsenic, mercury, gold and severe lead poisoning.',
         ar:'حقنة عضلية عميقة مؤلمة لتسمّم الزرنيخ والزئبق والذهب والرصاص الشديد.'},
  ci:[{en:'Peanut allergy (peanut-oil base)', ar:'الحساسية من الفول السوداني (قاعدة زيت الفول السوداني)'}, 'g6pd'],
  ask:['whatTaken', 'allergy', 'g6pd'] },

{ sci:'Sodium calcium edetate', ar:'إيديتات الكالسيوم والصوديوم', atc:'V03AB03', cat:'tox.antidote', form:'injection',
  doses:['200 mg/mL injection'], brand:['Ledclair'], aka:['Calcium disodium EDTA', 'Edetate calcium disodium'],
  notes:{en:'A drip for lead poisoning, with kidney function watched.',
         ar:'تسريب لتسمّم الرصاص، مع مراقبة وظائف الكلى.'},
  ci:['anuria'],
  ask:['whatTaken', 'kidney'] },

{ sci:'Sodium thiosulfate', ar:'ثيوكبريتات الصوديوم', atc:'V03AB06', cat:'tox.antidote', form:'injection',
  doses:['250 mg/mL injection', 'with sodium nitrite'], aka:['Sodium thiosulphate', 'Sodium nitrite'],
  notes:{en:'For cyanide poisoning (smoke from house fires), often after sodium nitrite or with hydroxocobalamin.',
         ar:'لتسمّم السيانيد (دخان حرائق المنازل)، غالباً بعد نتريت الصوديوم أو مع الهيدروكسوكوبالامين.'},
  ask:['whatTaken'] },

/* ---------- Antivenoms and antitoxins ---------- */

{ sci:'Scorpion antivenom', ar:'مضاد سم العقرب', atc:'J06AA', cat:'tox.antivenom', form:'injection',
  doses:['vial (equine F(ab’)2)'], aka:['Anti-scorpion serum', 'Scorpion antivenin'],
  notes:{en:'For severe scorpion stings, especially in children — sweating, vomiting, drooling, breathing trouble or abnormal movements. Given in hospital, watching for allergic reactions. Mild local pain only needs painkillers and a cold pack.',
         ar:'للدغات العقرب الشديدة، خصوصاً عند الأطفال — تعرّق وتقيؤ وسيلان لعاب وصعوبة تنفس أو حركات غير طبيعية. يُعطى في المستشفى مع مراقبة تفاعلات الحساسية. الألم الموضعي الخفيف يكفيه مسكّن وكمّادة باردة.'},
  ask:['childAge', 'allergy', 'whatTaken'] },

{ sci:'Snake antivenom', ar:'مضاد سم الأفاعي', atc:'J06AA03', cat:'tox.antivenom', form:'injection',
  doses:['polyvalent vial (equine)'], aka:['Polyvalent snake antivenom', 'Snake venom antiserum', 'Anti-snake venom'],
  notes:{en:'For snake bites with swelling spreading, bleeding or weakness. Keep the person still and the limb at heart level; no cutting, sucking or tight tourniquets. Given in hospital, watching for allergic reactions.',
         ar:'للدغات الأفاعي مع تورّم ممتد أو نزف أو ضعف. أبقِ المصاب ساكناً والطرف بمستوى القلب؛ لا جرح ولا مصّ ولا رباط ضاغط. يُعطى في المستشفى مع مراقبة تفاعلات الحساسية.'},
  ask:['allergy', 'thinner', 'whatTaken'] },

{ sci:'Diphtheria antitoxin', ar:'مضاد ذيفان الخناق', atc:'J06AA01', cat:'tox.antivenom', form:'injection',
  doses:['10,000 units vial (equine)'],
  notes:{en:'Given in hospital for suspected diphtheria, with antibiotics, after a test for horse-serum allergy.',
         ar:'يُعطى في المستشفى عند الاشتباه بالخناق، مع المضادات الحيوية، بعد اختبار الحساسية من مصل الخيل.'},
  ask:['allergy', 'vaccine'] },

{ sci:'Botulism antitoxin', ar:'مضاد ذيفان التسمّم الوشيقي', atc:'J06AA04', cat:'tox.antivenom', form:'injection',
  doses:['heptavalent vial (equine)'], aka:['Botulinum antitoxin'],
  notes:{en:'For botulism from spoiled canned or preserved food; given early in hospital to stop paralysis progressing.',
         ar:'للتسمّم الوشيقي من الأطعمة المعلّبة أو المحفوظة الفاسدة؛ يُعطى مبكراً في المستشفى لإيقاف تقدّم الشلل.'},
  ask:['allergy', 'whatTaken'] },

/* ---------- Contrast media ---------- */

{ sci:'Iohexol', ar:'يوهيكسول', atc:'V08AB02', cat:'dia.contrast', form:'injection',
  doses:['300 mg iodine/mL', '350 mg iodine/mL'], brand:['Omnipaque'],
  tags:['contrast'],
  notes:{en:'An iodine dye for CT scans and X-rays. A warm feeling during the injection is normal. Drink plenty afterwards; kidney function is checked first in those at risk.',
         ar:'صبغة يودية للمفراس والأشعة. الإحساس بالدفء أثناء الحقن طبيعي. اشرب كثيراً بعده؛ وتُفحص وظائف الكلى أولاً لمن لديهم خطر.'},
  ci:[{en:'Previous severe reaction to iodine contrast', ar:'تفاعل شديد سابق مع الصبغة اليودية'}, 'thyrotoxicosis'],
  ask:['contrastBefore', 'kidney', 'diabetesMeds'] },

{ sci:'Iopromide', ar:'يوبروميد', atc:'V08AB05', cat:'dia.contrast', form:'injection',
  doses:['300 mg iodine/mL', '370 mg iodine/mL'], brand:['Ultravist'],
  tags:['contrast'],
  notes:{en:'An iodine dye for CT scans and angiography; drink plenty afterwards. Tell staff about asthma, allergies or kidney disease.',
         ar:'صبغة يودية للمفراس وتصوير الأوعية؛ اشرب كثيراً بعده. أخبر الفريق عن الربو أو الحساسية أو أمراض الكلى.'},
  ci:[{en:'Previous severe reaction to iodine contrast', ar:'تفاعل شديد سابق مع الصبغة اليودية'}, 'thyrotoxicosis'],
  ask:['contrastBefore', 'kidney', 'diabetesMeds'] },

{ sci:'Iodixanol', ar:'يوديكسانول', atc:'V08AB09', cat:'dia.contrast', form:'injection',
  doses:['270 mg iodine/mL', '320 mg iodine/mL'], brand:['Visipaque'],
  tags:['contrast'],
  notes:{en:'An iodine dye with the same concentration as blood, often used in heart catheterisation and for people with weaker kidneys.',
         ar:'صبغة يودية بتركيز مماثل للدم، تُستعمل كثيراً في قسطرة القلب ولمن لديهم ضعف في الكلى.'},
  ci:[{en:'Previous severe reaction to iodine contrast', ar:'تفاعل شديد سابق مع الصبغة اليودية'}, 'thyrotoxicosis'],
  ask:['contrastBefore', 'kidney', 'diabetesMeds'] },

{ sci:'Iopamidol', ar:'يوباميدول', atc:'V08AB04', cat:'dia.contrast', form:'injection',
  doses:['300 mg iodine/mL', '370 mg iodine/mL'], brand:['Iopamiro', 'Isovue'],
  tags:['contrast'],
  notes:{en:'An iodine dye for CT scans and angiography; drink plenty afterwards.',
         ar:'صبغة يودية للمفراس وتصوير الأوعية؛ اشرب كثيراً بعده.'},
  ci:[{en:'Previous severe reaction to iodine contrast', ar:'تفاعل شديد سابق مع الصبغة اليودية'}, 'thyrotoxicosis'],
  ask:['contrastBefore', 'kidney', 'diabetesMeds'] },

{ sci:'Amidotrizoate', ar:'أميدوتريزوات', atc:'V08AA01', cat:'dia.contrast', form:'solution',
  doses:['oral solution (meglumine and sodium)', 'injection'], brand:['Gastrografin', 'Urografin'], aka:['Diatrizoate', 'Meglumine diatrizoate'],
  tags:['contrast'],
  notes:{en:'A drinkable iodine dye for bowel X-rays and CT; it can cause diarrhoea. Not for anyone who might breathe it in.',
         ar:'صبغة يودية تُشرب لتصوير الأمعاء بالأشعة والمفراس؛ قد تسبّب الإسهال. لا تُعطى لمن قد يستنشقها.'},
  ci:[{en:'Previous severe reaction to iodine contrast', ar:'تفاعل شديد سابق مع الصبغة اليودية'}, 'thyrotoxicosis'],
  ask:['contrastBefore', 'swallow', 'kidney'] },

{ sci:'Gadoterate', ar:'غادوتيرات', atc:'V08CA02', cat:'dia.contrast', form:'injection',
  doses:['0.5 mmol/mL injection'], brand:['Dotarem', 'Clariscan'], aka:['Gadoteric acid', 'Gadoterate meglumine'],
  notes:{en:'A gadolinium dye for MRI. Tell staff about kidney disease, pregnancy or a previous reaction.',
         ar:'صبغة غادولينيوم للرنين المغناطيسي. أخبر الفريق عن أمراض الكلى أو الحمل أو تفاعل سابق.'},
  ci:[{en:'Previous severe reaction to gadolinium', ar:'تفاعل شديد سابق مع الغادولينيوم'}],
  ask:['contrastBefore', 'kidney', 'preg'] },

{ sci:'Gadobutrol', ar:'غادوبوترول', atc:'V08CA09', cat:'dia.contrast', form:'injection',
  doses:['1 mmol/mL injection'], brand:['Gadovist', 'Gadavist'],
  notes:{en:'A gadolinium dye for MRI and MR angiography. Tell staff about kidney disease, pregnancy or a previous reaction.',
         ar:'صبغة غادولينيوم للرنين المغناطيسي وتصوير الأوعية بالرنين. أخبر الفريق عن أمراض الكلى أو الحمل أو تفاعل سابق.'},
  ci:[{en:'Previous severe reaction to gadolinium', ar:'تفاعل شديد سابق مع الغادولينيوم'}],
  ask:['contrastBefore', 'kidney', 'preg'] },

{ sci:'Gadopentetate', ar:'غادوبنتيتات', atc:'V08CA01', cat:'dia.contrast', form:'injection',
  doses:['0.5 mmol/mL injection'], brand:['Magnevist'], aka:['Gadopentetic acid'],
  notes:{en:'An older gadolinium MRI dye, avoided in severe kidney disease.',
         ar:'صبغة غادولينيوم أقدم للرنين المغناطيسي، تُتجنّب في أمراض الكلى الشديدة.'},
  ci:['renalSevere'],
  ask:['contrastBefore', 'kidney', 'preg'] },

{ sci:'Gadoxetate', ar:'غادوكسيتات', atc:'V08CA10', cat:'dia.contrast', form:'injection',
  doses:['0.25 mmol/mL injection'], brand:['Primovist', 'Eovist'], aka:['Gadoxetic acid'],
  notes:{en:'A gadolinium dye taken up by the liver, for liver MRI.',
         ar:'صبغة غادولينيوم يلتقطها الكبد، لتصوير الكبد بالرنين المغناطيسي.'},
  ask:['contrastBefore', 'kidney', 'liver'] },

{ sci:'Barium sulfate', ar:'كبريتات الباريوم', atc:'V08BA01', cat:'dia.contrast', form:'solution',
  doses:['suspension for swallow, meal or enema'], brand:['E-Z-Paque', 'Micropaque'], aka:['Barium sulphate', 'Barium meal'],
  notes:{en:'A chalky drink or enema that outlines the gut on X-ray. Drink plenty of water afterwards — stools are white for a day or two and constipation is common.',
         ar:'مشروب أو حقنة شرجية طباشيرية تُظهر الأمعاء في الأشعة. اشرب ماءً كثيراً بعده — يكون البراز أبيض ليوم أو يومين والإمساك شائع.'},
  ci:['obstruction', {en:'Suspected perforation of the gut', ar:'الاشتباه بانثقاب الأمعاء'}],
  ask:['swallow', 'bowelDisease'] },

{ sci:'Sulfur hexafluoride microbubbles', ar:'فقاعات سداسي فلوريد الكبريت', atc:'V08DA05', cat:'dia.contrast', form:'injection',
  doses:['8 microlitre/mL (kit)'], brand:['SonoVue', 'Lumason'],
  notes:{en:'A contrast for ultrasound scans of the heart, liver and blood vessels; it leaves the body in the breath within minutes.',
         ar:'مادة تباين لتصوير القلب والكبد والأوعية بالأمواج فوق الصوتية؛ تخرج من الجسم مع النَّفَس خلال دقائق.'},
  ci:[{en:'Unstable heart disease or recent heart attack', ar:'مرض قلبي غير مستقر أو نوبة قلبية حديثة'}],
  ask:['heart', 'allergy'] },

/* ---------- Other diagnostics ---------- */

{ sci:'Tuberculin PPD', ar:'التوبركولين PPD', atc:'V04CF01', cat:'dia.other', form:'injection',
  doses:['2 TU/0.1 mL', '5 TU/0.1 mL intradermal'], brand:['Tubersol', 'PPD RT 23'], aka:['Tuberculin', 'Mantoux test', 'Purified protein derivative'],
  notes:{en:'The skin test for tuberculosis: a small bleb under the skin of the forearm, read after 48–72 hours — come back on time. Do not scratch or cover it.',
         ar:'اختبار الجلد للسل: فقاعة صغيرة تحت جلد الساعد تُقرأ بعد 48–72 ساعة — عُد في الموعد. لا تحكّها ولا تغطّها.'},
  ci:[{en:'Previous severe reaction to a tuberculin test', ar:'تفاعل شديد سابق مع اختبار التوبركولين'}],
  ask:['tb', 'vaccine', 'immune'] },

{ sci:'Tetracosactide', ar:'تتراكوساكتيد', atc:'H01AA02', cat:'dia.other', form:'injection',
  doses:['250 microgram/mL (short test)', '1 mg/mL depot'], brand:['Synacthen'], aka:['Cosyntropin', 'Tetracosactrin'],
  notes:{en:'Used to test whether the adrenal glands can make cortisol: blood is taken before and 30–60 minutes after the injection.',
         ar:'يُستعمل لاختبار قدرة الغدد الكظرية على إنتاج الكورتيزول: يُسحب الدم قبل الحقنة وبعدها بـ 30–60 دقيقة.'},
  ci:['asthma', {en:'Allergic disorders', ar:'الاضطرابات التحسسية'}],
  ask:['steroids', 'asthma', 'allergy'] }

];
