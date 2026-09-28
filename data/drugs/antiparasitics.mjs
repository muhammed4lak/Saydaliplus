/* Worms, parasites and malaria — including leishmaniasis, which is endemic
   in Iraq, and the G6PD question that primaquine turns on. Scabies and lice
   are with the skin. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Worms ---------- */

{ sci:'Albendazole', ar:'ألبيندازول', atc:'P02CA03', cat:'inf.antiparasitic', form:'tablet',
  doses:['200 mg', '400 mg chewable', '200 mg/5 mL suspension'], brand:['Zentel', 'Alzental'],
  notes:{en:'For most worms a single 400 mg dose, chewed or swallowed; for pinworm, repeat after two weeks and treat the whole household. Longer courses (hydatid cysts) need liver tests and blood counts. Not in pregnancy.',
         ar:'لمعظم الديدان جرعة واحدة 400 ملغ، تُمضغ أو تُبلع؛ وللدودة الدبوسية تُكرّر بعد أسبوعين ويُعالج جميع أفراد البيت. الدورات الأطول (الأكياس المائية) تحتاج فحص الكبد وتعداد الدم. لا يُستعمل في الحمل.'},
  ci:['preg'],
  ask:['preg', 'childAge'] },

{ sci:'Levamisole', ar:'ليفاميزول', atc:'P02CE01', cat:'inf.antiparasitic', form:'syrup',
  doses:['40 mg/5 mL syrup', '40 mg', '50 mg tablet'], brand:['Ketrax', 'Ergamisol'],
  notes:{en:'A single dose for roundworm. Longer courses can lower white cells — report fever or a sore throat.',
         ar:'جرعة واحدة لديدان الأسكاريس. الدورات الأطول قد تخفض الكريات البيض — أبلغ عن الحرارة أو التهاب الحلق.'},
  ci:[{en:'Previous agranulocytosis', ar:'ندرة المحببات السابقة'}],
  ask:['childAge', 'feverBlood'] },

{ sci:'Piperazine', ar:'بيبرازين', atc:'P02CB01', cat:'inf.antiparasitic', form:'syrup',
  doses:['piperazine citrate syrup', 'piperazine adipate tablet', 'with senna (sachet)'], aka:['Piperazine citrate', 'Piperazine adipate'],
  notes:{en:'An older treatment for threadworm and roundworm. Treat the whole family and keep nails short. Not in epilepsy or kidney failure.',
         ar:'علاج أقدم للديدان الدبوسية والأسكاريس. عالج العائلة كلها وقصّ الأظافر. لا يُستعمل في الصرع أو الفشل الكلوي.'},
  ci:['epilepsy', 'renalSevere'],
  ask:['childAge', 'epilepsy', 'kidney'] },

{ sci:'Mebendazole', ar:'ميبيندازول', atc:'P02CA01', cat:'inf.antiparasitic', form:'tablet',
  doses:['100 mg', '500 mg', '100 mg/5 mL suspension'], brand:['Vermox'],
  notes:{en:'Pinworm: one 100 mg dose repeated after two weeks, for the whole household, with hand-washing and short nails. Other worms: twice a day for three days.',
         ar:'الدودة الدبوسية: جرعة 100 ملغ تُكرّر بعد أسبوعين، لجميع أفراد البيت، مع غسل اليدين وتقليم الأظافر. الديدان الأخرى: مرتين يومياً لثلاثة أيام.'},
  ci:['preg1', {en:'Infants under 1 year', ar:'الرضّع دون سنة'}],
  ask:['preg', 'childAge'] },

{ sci:'Pyrantel', ar:'بيرانتيل', atc:'P02CC01', cat:'inf.antiparasitic', form:'syrup',
  doses:['250 mg/5 mL suspension', '125 mg tablet'], brand:['Combantrin'], aka:['Pyrantel pamoate', 'Pyrantel embonate'],
  notes:{en:'A single dose by body weight for pinworm and roundworm; repeat after two weeks for pinworm.',
         ar:'جرعة واحدة حسب الوزن للدودة الدبوسية والأسكارس؛ وتُكرّر بعد أسبوعين للدبوسية.'},
  ask:['childAge', 'preg'] },

{ sci:'Ivermectin', ar:'إيفرمكتين', atc:'P02CF01', cat:'inf.antiparasitic', form:'tablet',
  doses:['3 mg', '6 mg tablet', '1% cream'], brand:['Stromectol', 'Soolantra'],
  take:['emptyStomach'],
  notes:{en:'Tablets on an empty stomach with water, for scabies (repeated after a week) and some worms. The cream is a different use — for rosacea.',
         ar:'الأقراص على معدة فارغة مع الماء، للجرب (تُكرّر بعد أسبوع) وبعض الديدان. الكريم استعمال مختلف — للوردية.'},
  ci:[{en:'Children under 15 kg (tablets)', ar:'الأطفال دون 15 كغ (الأقراص)'}],
  ask:['childAge', 'preg'] },

{ sci:'Praziquantel', ar:'برازيكوانتيل', atc:'P02BA01', cat:'inf.antiparasitic', form:'tablet',
  doses:['600 mg'], brand:['Biltricide'],
  tags:['inducerSensitive', 'sub3a4'], take:['withFood'],
  notes:{en:'For bilharzia and tapeworms, with food. Drowsiness and dizziness — no driving that day.',
         ar:'للبلهارسيا والديدان الشريطية، مع الطعام. نعاس ودوخة — لا قيادة في ذلك اليوم.'},
  ix:[
    ['Rifampicin', C, 'Praziquantel levels fall to almost nothing — contraindicated.', 'ينخفض مستوى البرازيكوانتيل إلى ما يقارب الصفر — ممنوع الجمع.']
  ],
  ci:[{en:'Worm cysts in the eye', ar:'أكياس الديدان في العين'}],
  ask:['otherMeds', 'drive'] },

{ sci:'Niclosamide', ar:'نيكلوساميد', atc:'P02DA01', cat:'inf.antiparasitic', form:'tablet',
  doses:['500 mg chewable'], brand:['Yomesan'],
  notes:{en:'For tapeworm: chewed thoroughly on an empty stomach and swallowed with a little water; a laxative may follow.',
         ar:'للدودة الشريطية: يُمضغ جيداً على معدة فارغة ويُبلع بقليل من الماء؛ وقد يُتبع بمليّن.'},
  ask:['childAge'] },

{ sci:'Triclabendazole', ar:'تريكلابيندازول', atc:'P02BX04', cat:'inf.antiparasitic', form:'tablet',
  doses:['250 mg'], brand:['Egaten'],
  take:['withFood'],
  notes:{en:'For liver fluke (fascioliasis): one or two doses with food. Tummy pain as the flukes die is common.',
         ar:'لدودة الكبد (الفاشيولا): جرعة أو جرعتان مع الطعام. ألم البطن عند موت الديدان شائع.'},
  ask:['rhythm', 'preg'] },

/* ---------- Gut protozoa ---------- */

{ sci:'Nitazoxanide', ar:'نيتازوكسانيد', atc:'P01AX11', cat:'inf.antiparasitic', form:'tablet',
  doses:['500 mg', '100 mg/5 mL suspension'], brand:['Alinia', 'Nanazoxid'],
  take:['withFood'],
  notes:{en:'For giardia and cryptosporidium diarrhoea: with food for three days. Urine may turn yellow-green.',
         ar:'لإسهال الجيارديا والكريبتوسبوريديوم: مع الطعام لثلاثة أيام. قد يصبح البول أصفر مخضراً.'},
  ask:['childAge', 'feverBlood'] },

{ sci:'Diloxanide', ar:'ديلوكسانيد', atc:'P01AC01', cat:'inf.antiparasitic', form:'tablet',
  doses:['500 mg'], brand:['Furamide'], aka:['Diloxanide furoate'],
  notes:{en:'Clears amoebic cysts from the gut, usually after metronidazole; wind is common.',
         ar:'يزيل أكياس الأميبا من الأمعاء، عادة بعد الميترونيدازول؛ الغازات شائعة.'},
  ask:['preg'] },

{ sci:'Paromomycin', ar:'باروموميسين', atc:'A07AA06', cat:'inf.antiparasitic', form:'capsule',
  doses:['250 mg capsule', '15% ointment'], brand:['Humatin'],
  notes:{en:'By mouth for gut amoebae and cryptosporidium; the ointment treats cutaneous leishmaniasis (the Baghdad boil).',
         ar:'فموياً للأميبا المعوية والكريبتوسبوريديوم؛ والمرهم يعالج الليشمانيا الجلدية (حبة بغداد).'},
  ci:['obstruction'],
  ask:['kidney', 'preg'] },

/* ---------- Leishmaniasis ---------- */

{ sci:'Sodium stibogluconate', ar:'ستيبوغلوكونات الصوديوم', atc:'P01CB02', cat:'inf.antiparasitic', form:'injection',
  doses:['100 mg antimony/mL'], brand:['Pentostam'],
  tags:['qt'],
  notes:{en:'Injections into the sore or into a vein or muscle for leishmaniasis. ECG, liver, pancreas and kidney tests are checked; report palpitations or severe tummy pain.',
         ar:'حقن في القرحة أو في الوريد أو العضل لداء الليشمانيات. يُفحص تخطيط القلب والكبد والبنكرياس والكلى؛ أبلغ عن الخفقان أو ألم البطن الشديد.'},
  ci:['renalSevere', 'qt'],
  ask:['rhythm', 'kidney', 'preg'] },

{ sci:'Meglumine antimoniate', ar:'أنتيمونات الميغلومين', atc:'P01CB01', cat:'inf.antiparasitic', form:'injection',
  doses:['1.5 g/5 mL (425 mg antimony)'], brand:['Glucantime'],
  tags:['qt'],
  notes:{en:'Injections into the sore or into muscle for leishmaniasis. ECG and blood tests are checked; report palpitations or tummy pain.',
         ar:'حقن في القرحة أو في العضل لداء الليشمانيات. يُفحص تخطيط القلب والدم؛ أبلغ عن الخفقان أو ألم البطن.'},
  ci:['renalSevere', 'qt'],
  ask:['rhythm', 'kidney', 'preg'] },

{ sci:'Miltefosine', ar:'ميلتيفوسين', atc:'P01CX04', cat:'inf.antiparasitic', form:'capsule',
  doses:['10 mg', '50 mg'], brand:['Impavido'],
  take:['withFood'],
  notes:{en:'An oral treatment for leishmaniasis, with food. It causes birth defects — contraception during and for five months after.',
         ar:'علاج فموي لداء الليشمانيات، مع الطعام. يسبّب تشوّهات للجنين — منع الحمل أثناء العلاج وخمسة أشهر بعده.'},
  ci:['pregTeratogen'],
  ask:['pregTest', 'kidney'] },

/* ---------- Malaria ---------- */

{ sci:'Chloroquine', ar:'كلوروكين', atc:'P01BA01', cat:'inf.antiparasitic', form:'tablet',
  doses:['250 mg (150 mg base)', '50 mg/5 mL syrup'], brand:['Nivaquine', 'Aralen'],
  tags:['qt'],
  notes:{en:'For malaria treatment and weekly prevention, starting before travel. Keep it away from children — overdose is quickly fatal. Report vision changes on long use.',
         ar:'لعلاج الملاريا وللوقاية الأسبوعية، بدءاً قبل السفر. أبعده عن الأطفال — الجرعة الزائدة قاتلة بسرعة. أبلغ عن تغيّر النظر مع الاستعمال الطويل.'},
  ci:['qt', 'epilepsy'],
  ask:['vision', 'epilepsy', 'rhythm'] },

{ sci:'Primaquine', ar:'بريماكين', atc:'P01BA03', cat:'inf.antiparasitic', form:'tablet',
  doses:['7.5 mg', '15 mg base'],
  notes:{en:'Clears the dormant liver stage of vivax malaria. G6PD is tested first — in deficiency, common in Iraq, it destroys red cells.',
         ar:'يزيل الطور الكامن في الكبد لملاريا فيفاكس. يُفحص G6PD أولاً — ففي حالة العوز، الشائعة في العراق، يحلّ الكريات الحمر.'},
  ci:['g6pd', 'preg'],
  ask:['g6pd', 'preg'] },

{ sci:'Artemether', ar:'أرتيميثر', atc:'P01BE02', cat:'inf.antiparasitic', form:'tablet',
  doses:['20 mg with lumefantrine 120 mg', '80 mg/mL injection'], brand:['Coartem', 'Riamet'], aka:['Artemether/Lumefantrine', 'Lumefantrine'],
  tags:['qtPossible'], take:['withFood'],
  notes:{en:'Six doses over three days, each with fatty food or milk so it is absorbed. Repeat a dose vomited within an hour.',
         ar:'ست جرعات خلال ثلاثة أيام، كل منها مع طعام دسم أو حليب ليُمتص. أعد الجرعة إن حدث قيء خلال ساعة.'},
  ci:['qt'],
  ask:['rhythm', 'preg', 'otherMeds'] },

{ sci:'Artesunate', ar:'أرتيسونات', atc:'P01BE03', cat:'inf.antiparasitic', form:'injection',
  doses:['60 mg vial', '50 mg', '200 mg tablet'], brand:['Artesun'],
  notes:{en:'The first-choice injection for severe malaria, in hospital; blood counts are checked weeks later.',
         ar:'الحقنة المفضّلة للملاريا الشديدة، في المستشفى؛ ويُفحص تعداد الدم بعد أسابيع.'},
  ask:['preg'] },

{ sci:'Quinine', ar:'كينين', atc:'P01BC01', cat:'inf.antiparasitic', form:'tablet',
  doses:['300 mg', '600 mg/2 mL injection'],
  tags:['qt'],
  notes:{en:'For malaria — not for leg cramps. Ringing in the ears, nausea and blurred vision mean the dose is too high. It can lower blood sugar.',
         ar:'للملاريا — لا لتشنّجات الساق. الطنين والغثيان وتشوّش الرؤية تعني أن الجرعة عالية. قد يخفض سكر الدم.'},
  ci:['qt', 'myasthenia', {en:'Optic neuritis', ar:'التهاب العصب البصري'}],
  ask:['rhythm', 'hearing', 'g6pd'] },

{ sci:'Mefloquine', ar:'ميفلوكين', atc:'P01BC02', cat:'inf.antiparasitic', form:'tablet',
  doses:['250 mg'], brand:['Lariam'],
  tags:['qtPossible'],
  notes:{en:'Weekly for malaria prevention. It can cause vivid dreams, anxiety or depression — stop and seek advice.',
         ar:'أسبوعياً للوقاية من الملاريا. قد يسبّب أحلاماً واضحة أو قلقاً أو اكتئاباً — أوقفه واستشر.'},
  ci:['epilepsy', {en:'Depression or other psychiatric illness', ar:'الاكتئاب أو مرض نفسي آخر'}],
  ask:['mood', 'epilepsy', 'rhythm'] },

{ sci:'Atovaquone/Proguanil', ar:'أتوفاكون/بروغوانيل', atc:'P01BB51', cat:'inf.antiparasitic', form:'tablet',
  doses:['250/100 mg', '62.5/25 mg paediatric'], brand:['Malarone'],
  take:['withFood'],
  notes:{en:'Daily for malaria prevention, from a day or two before travel until a week after; with food or a milky drink.',
         ar:'يومياً للوقاية من الملاريا، من يوم أو يومين قبل السفر حتى أسبوع بعده؛ مع الطعام أو مشروب حليبي.'},
  ix:[
    ['Warfarin', W, 'May raise the INR.', 'قد يرفع INR.']
  ],
  ci:['renal30'],
  ask:['kidney', 'preg'] },

{ sci:'Pyrimethamine', ar:'بيريميثامين', atc:'P01BD01', cat:'inf.antiparasitic', form:'tablet',
  doses:['25 mg'], brand:['Daraprim'],
  notes:{en:'With sulfadiazine for toxoplasmosis, together with folinic acid to protect the blood; blood counts are checked.',
         ar:'مع السلفاديازين لداء المقوّسات، ومعه حمض الفولينيك لحماية الدم؛ يُفحص تعداد الدم.'},
  ix:[
    ['Methotrexate', S, 'Both block folate — marrow suppression.', 'كلاهما يمنع الفولات — تثبيط نقي العظم.']
  ],
  ask:['labs', 'preg'] },

{ sci:'Pentamidine', ar:'بنتاميدين', atc:'P01CX01', cat:'inf.antiparasitic', form:'injection',
  doses:['300 mg vial'], brand:['Pentacarinat'],
  tags:['qt', 'nephrotoxic'],
  notes:{en:'Hospital use for pneumocystis and some tropical infections; blood pressure, sugar and kidney tests are watched.',
         ar:'للمستشفى لذات الرئة بالمتكيسة وبعض العدوى المدارية؛ يُراقب الضغط والسكر ووظائف الكلى.'},
  ci:['qt'],
  ask:['kidney', 'diabetes', 'rhythm'] }

];
