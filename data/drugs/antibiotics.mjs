/* Antibiotics, part one: penicillins, cephalosporins, carbapenems,
   macrolides and clindamycin, quinolones, tetracyclines, aminoglycosides.
   Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Penicillins ---------- */
{ sci:'Amoxicillin', ar:'أموكسيسيلين', atc:'J01CA04', cat:'inf.penicillin', form:'capsule',
  doses:['125 mg/5 mL', '250 mg/5 mL', '250 mg', '500 mg', '1 g'], brand:['Amoxil'],
  notes:{en:'With food to reduce GI upset. Finish the course.',
         ar:'يُفضّل مع الطعام لتقليل الاضطراب المعوي. يُكمل الكورس كاملاً.'},
  ix:[
    ['Methotrexate', S, 'Reduces methotrexate clearance, raising toxicity.', 'يقلّل طرح الميثوتريكسيت ويزيد سميّته.'],
    ['Warfarin', W, 'May raise INR — monitor coagulation.', 'قد يرفع INR — راقب التخثر.']
  ],
  ci:['penAllergy', {en:'Infectious mononucleosis', ar:'كثرة الوحيدات العدائية'}],
  ask:['allergyPen', 'childAge'] },

{ sci:'Amoxicillin/Clavulanic acid', ar:'أموكسيسيلين/حمض الكلافولانيك', atc:'J01CR02', cat:'inf.penicillin', form:'tablet',
  doses:['228 mg/5 mL', '457 mg/5 mL', '625 mg', '1 g'], brand:['Augmentin'], aka:['Co-amoxiclav'],
  take:['withFood'],
  notes:{en:'Take at the start of a meal — the clavulanate is what causes the diarrhoea, and food blunts it.',
         ar:'يؤخذ في بداية الوجبة — الكلافولانيك هو سبب الإسهال، والطعام يخفّفه.'},
  ix:[
    ['Methotrexate', S, 'Reduces methotrexate clearance.', 'يقلّل طرح الميثوتريكسيت.'],
    ['Warfarin', W, 'May raise INR.', 'قد يرفع INR.'],
    ['Allopurinol', W, 'Raises the chance of a rash.', 'يزيد احتمال الطفح الجلدي.']
  ],
  ci:['penAllergy', {en:'Previous jaundice or hepatic dysfunction with this drug', ar:'يرقان أو خلل كبدي سابق مع هذا الدواء'}],
  ask:['allergyPen', 'liver', 'childAge'] },

{ sci:'Ampicillin', ar:'أمبيسيلين', atc:'J01CA01', cat:'inf.penicillin', form:'capsule',
  doses:['250 mg', '500 mg capsule', '125 mg/5 mL', '250 mg/5 mL suspension', '500 mg', '1 g vial'], brand:['Penbritin'],
  take:['emptyStomach'],
  notes:{en:'Capsules on an empty stomach. A rash is common, and almost certain with glandular fever. Finish the course.',
         ar:'الكبسولات على معدة فارغة. الطفح شائع، ويكاد يكون مؤكداً مع كثرة الوحيدات. أكمل الدورة.'},
  ci:['penAllergy', {en:'Infectious mononucleosis', ar:'كثرة الوحيدات العدائية'}],
  ask:['allergyPen', 'childAge'] },

{ sci:'Ampicillin/Sulbactam', ar:'أمبيسيلين/سلباكتام', atc:'J01CR01', cat:'inf.penicillin', form:'injection',
  doses:['1.5 g', '3 g vial', '375 mg tablet (sultamicillin)', '250 mg/5 mL suspension'], brand:['Unasyn'], aka:['Sultamicillin'],
  notes:{en:'An injection in hospital, or sultamicillin tablets and suspension by mouth. Diarrhoea is common; finish the course.',
         ar:'حقنة في المستشفى، أو أقراص ومعلّق السلتاميسيلين بالفم. الإسهال شائع؛ أكمل الدورة.'},
  ci:['penAllergy'],
  ask:['allergyPen', 'kidney', 'childAge'] },

{ sci:'Flucloxacillin', ar:'فلوكلوكساسيلين', atc:'J01CF05', cat:'inf.penicillin', form:'capsule',
  doses:['250 mg', '500 mg capsule', '125 mg/5 mL', '500 mg and 1 g vial'], brand:['Floxapen'],
  take:['emptyStomach'],
  notes:{en:'An hour before food, four times a day. Rarely it causes jaundice, even weeks after stopping — report yellowing or dark urine.',
         ar:'قبل الطعام بساعة، أربع مرات يومياً. نادراً ما يسبّب اليرقان ولو بعد أسابيع من الإيقاف — أبلغ عن الاصفرار أو غمق البول.'},
  ci:['penAllergy', {en:'Previous jaundice with flucloxacillin', ar:'يرقان سابق مع الفلوكلوكساسيلين'}],
  ask:['allergyPen', 'liver', 'childAge'] },

{ sci:'Cloxacillin', ar:'كلوكساسيلين', atc:'J01CF02', cat:'inf.penicillin', form:'capsule',
  doses:['250 mg', '500 mg', '500 mg vial', 'with ampicillin'], brand:['Orbenin', 'Ampiclox'],
  take:['emptyStomach'],
  notes:{en:'An hour before food, four times a day. Finish the course.',
         ar:'قبل الطعام بساعة، أربع مرات يومياً. أكمل الدورة.'},
  ci:['penAllergy'],
  ask:['allergyPen', 'childAge'] },

{ sci:'Benzylpenicillin', ar:'بنزيل بنسلين', atc:'J01CE01', cat:'inf.penicillin', form:'injection',
  doses:['500,000 units', '1 million units', '5 million units vial'], brand:['Crystapen'], aka:['Penicillin G', 'Crystalline penicillin'],
  notes:{en:'An injection for serious infections, given several times a day in hospital.',
         ar:'حقنة للالتهابات الخطيرة، تُعطى عدة مرات يومياً في المستشفى.'},
  ci:['penAllergy'],
  ask:['allergyPen'] },

{ sci:'Benzathine benzylpenicillin', ar:'بنزاثين بنزيل بنسلين', atc:'J01CE08', cat:'inf.penicillin', form:'injection',
  doses:['600,000 units', '1.2 million units', '2.4 million units vial'], brand:['Retarpen', 'Extencilline', 'Bicillin L-A'], aka:['Benzathine penicillin'],
  notes:{en:'A deep injection into muscle — never into a vein — for syphilis, or every 3–4 weeks to prevent rheumatic fever. Keep every appointment.',
         ar:'حقنة عميقة في العضل — لا في الوريد أبداً — للزهري، أو كل 3–4 أسابيع للوقاية من الحمى الروماتيزمية. التزم بكل موعد.'},
  ci:['penAllergy'],
  ask:['allergyPen', 'whoFor'] },

{ sci:'Phenoxymethylpenicillin', ar:'فينوكسي ميثيل بنسلين', atc:'J01CE02', cat:'inf.penicillin', form:'tablet',
  doses:['250 mg', '125 mg/5 mL', '250 mg/5 mL'], brand:['Ospen'], aka:['Penicillin V'],
  take:['emptyStomach'],
  notes:{en:'On an empty stomach, four times a day, for the full ten days in a strep throat.',
         ar:'على معدة فارغة، أربع مرات يومياً، لعشرة أيام كاملة في التهاب الحلق العقدي.'},
  ci:['penAllergy'],
  ask:['allergyPen', 'childAge'] },

{ sci:'Piperacillin/Tazobactam', ar:'بيبيراسيلين/تازوباكتام', atc:'J01CR05', cat:'inf.penicillin', form:'injection',
  doses:['2.25 g', '4.5 g vial'], brand:['Tazocin', 'Zosyn'],
  notes:{en:'A hospital intravenous antibiotic; the dose is adjusted for the kidneys.',
         ar:'مضاد حيوي وريدي للمستشفى؛ تُعدّل الجرعة حسب وظائف الكلى.'},
  ix:[
    ['Vancomycin', W, 'More kidney injury together — monitor kidney function.', 'أذية كلوية أكثر معاً — راقب وظائف الكلى.'],
    ['Methotrexate', S, 'Reduces methotrexate clearance.', 'يقلّل طرح الميثوتريكسيت.']
  ],
  ci:['penAllergy'],
  ask:['allergyPen', 'kidney'] },

/* ---------- Cephalosporins ---------- */
{ sci:'Cefixime', ar:'سيفيكسيم', atc:'J01DD08', cat:'inf.cephalosporin', form:'capsule',
  doses:['100 mg/5 mL', '200 mg', '400 mg'], brand:['Suprax'],
  notes:{en:'Once or twice daily, with or without food.',
         ar:'مرة أو مرتين يومياً بغض النظر عن الطعام.'},
  ix:[
    ['Warfarin', W, 'May raise INR.', 'قد يرفع INR.']
  ],
  ci:['cephAllergy'],
  ask:['allergyPen', 'childAge'] },

{ sci:'Cephalexin', ar:'سيفالكسين', atc:'J01DB01', cat:'inf.cephalosporin', form:'capsule',
  doses:['125 mg/5 mL', '250 mg/5 mL', '250 mg', '500 mg'], brand:['Keflex'], aka:['Cefalexin'],
  notes:{en:'Usually four times a day — adherence is the usual failure, so say the times out loud.',
         ar:'أربع مرات يومياً عادة — الالتزام هو المشكلة الشائعة، فاذكر التوقيت.'},
  ix:[
    ['Metformin', W, 'Modestly raises metformin levels.', 'يرفع مستوى الميتفورمين قليلاً.']
  ],
  ci:['cephAllergy'],
  ask:['allergyPen', 'childAge'] },

{ sci:'Ceftriaxone', ar:'سيفترياكسون', atc:'J01DD04', cat:'inf.cephalosporin', form:'injection',
  doses:['250 mg', '500 mg', '1 g', '2 g'], brand:['Rocephin'],
  notes:{en:'Never mix or co-infuse with a calcium-containing fluid — the precipitate is fatal in neonates.',
         ar:'لا يُمزج ولا يُعطى بالتوازي مع محاليل تحتوي كالسيوم — ترسّب قاتل عند الولدان.'},
  ix:[
    ['Calcium gluconate', C, 'Precipitates in lung and kidney — the IV combination is contraindicated.', 'ترسّب في الرئة والكلية — ممنوع الجمع وريدياً.'],
    ['Warfarin', W, 'May raise INR.', 'قد يرفع INR.']
  ],
  ci:['cephAllergy', {en:'Neonates with hyperbilirubinaemia', ar:'الولدان مع فرط بيليروبين الدم'}],
  ask:['allergyPen', 'childAge'] },

{ sci:'Cefuroxime', ar:'سيفوروكسيم', atc:'J01DC02', cat:'inf.cephalosporin', form:'tablet',
  doses:['125 mg/5 mL', '250 mg', '500 mg'], brand:['Zinnat'],
  take:['afterFood'],
  notes:{en:'Straight after food — absorption depends on it.',
         ar:'بعد الطعام مباشرة — الامتصاص يعتمد عليه.'},
  ix:[
    ['Omeprazole', W, 'Reduced stomach acid cuts absorption.', 'رفع حموضة المعدة يقلّل الامتصاص.']
  ],
  ci:['cephAllergy'],
  ask:['allergyPen', 'childAge'] },

{ sci:'Cefadroxil', ar:'سيفادروكسيل', atc:'J01DB05', cat:'inf.cephalosporin', form:'capsule',
  doses:['500 mg capsule', '1 g tablet', '125 mg/5 mL', '250 mg/5 mL'], brand:['Duricef'],
  notes:{en:'Once or twice a day, with or without food. Finish the course.',
         ar:'مرة أو مرتين يومياً، مع الطعام أو بدونه. أكمل الدورة.'},
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'childAge'] },

{ sci:'Cefaclor', ar:'سيفاكلور', atc:'J01DC04', cat:'inf.cephalosporin', form:'capsule',
  doses:['250 mg', '500 mg', '375 mg MR', '125 mg/5 mL', '250 mg/5 mL'], brand:['Ceclor', 'Distaclor'],
  notes:{en:'Three times a day. A rash with joint pains (a serum-sickness reaction) is more common with cefaclor in children — report it.',
         ar:'ثلاث مرات يومياً. الطفح مع آلام المفاصل (تفاعل يشبه داء المصل) أشيع مع السيفاكلور عند الأطفال — أبلغ عنه.'},
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'childAge'] },

{ sci:'Cefprozil', ar:'سيفبروزيل', atc:'J01DC10', cat:'inf.cephalosporin', form:'tablet',
  doses:['250 mg', '500 mg', '125 mg/5 mL', '250 mg/5 mL'], brand:['Cefzil'],
  notes:{en:'Once or twice a day. Finish the course.',
         ar:'مرة أو مرتين يومياً. أكمل الدورة.'},
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'childAge'] },

{ sci:'Cefdinir', ar:'سيفدينير', atc:'J01DD15', cat:'inf.cephalosporin', form:'capsule',
  doses:['300 mg', '125 mg/5 mL', '250 mg/5 mL'], brand:['Omnicef'],
  tags:['chelatableMild'],
  notes:{en:'Keep two hours apart from iron and antacids. Stools may turn reddish with iron-containing food or formula — harmless.',
         ar:'افصل بينه وبين الحديد ومضادات الحموضة ساعتين. قد يصبح البراز محمراً مع الأطعمة أو الحليب الصناعي المدعّم بالحديد — وهذا غير ضار.'},
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'childAge', 'antacids'] },

{ sci:'Cefpodoxime', ar:'سيفبودوكسيم', atc:'J01DD13', cat:'inf.cephalosporin', form:'tablet',
  doses:['100 mg', '200 mg', '40 mg/5 mL'], brand:['Orelox', 'Vantin'],
  take:['withFood'],
  notes:{en:'Twice a day with food. Antacids and acid-reducing medicines lower its absorption.',
         ar:'مرتين يومياً مع الطعام. مضادات الحموضة وخافضات الحمض تقلّل امتصاصه.'},
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'childAge', 'antacids'] },

{ sci:'Cefazolin', ar:'سيفازولين', atc:'J01DB04', cat:'inf.cephalosporin', form:'injection',
  doses:['500 mg', '1 g vial'], brand:['Kefzol', 'Ancef'],
  notes:{en:'A hospital injection, often given just before surgery to prevent infection.',
         ar:'حقنة في المستشفى، تُعطى غالباً قبل الجراحة مباشرة للوقاية من العدوى.'},
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'kidney'] },

{ sci:'Cefotaxime', ar:'سيفوتاكسيم', atc:'J01DD01', cat:'inf.cephalosporin', form:'injection',
  doses:['500 mg', '1 g', '2 g vial'], brand:['Claforan'],
  notes:{en:'An injection into a vein or muscle for serious infections; the intramuscular form comes with a lidocaine solvent.',
         ar:'حقنة في الوريد أو العضل للالتهابات الخطيرة؛ الشكل العضلي يأتي مع مذيب يحتوي الليدوكائين.'},
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'childAge'] },

{ sci:'Ceftazidime', ar:'سيفتازيديم', atc:'J01DD02', cat:'inf.cephalosporin', form:'injection',
  doses:['500 mg', '1 g', '2 g vial'], brand:['Fortum', 'Fortaz'],
  notes:{en:'A hospital injection, including for Pseudomonas; the dose is cut in kidney impairment.',
         ar:'حقنة في المستشفى، ومنها لعدوى الزائفة؛ تُخفّض الجرعة في القصور الكلوي.'},
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'kidney'] },

{ sci:'Ceftazidime/Avibactam', ar:'سيفتازيديم/أفيباكتام', atc:'J01DD52', cat:'inf.cephalosporin', form:'injection',
  doses:['2.5 g vial'], brand:['Zavicefta', 'Avycaz'],
  notes:{en:'A reserve hospital antibiotic for resistant infections; the dose is adjusted for the kidneys.',
         ar:'مضاد حيوي احتياطي للمستشفى للعدوى المقاومة؛ تُعدّل الجرعة حسب الكلى.'},
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'kidney'] },

{ sci:'Cefepime', ar:'سيفيبيم', atc:'J01DE01', cat:'inf.cephalosporin', form:'injection',
  doses:['1 g', '2 g vial'], brand:['Maxipime'],
  notes:{en:'A hospital injection. In kidney impairment the dose must be cut — high levels cause confusion and fits.',
         ar:'حقنة في المستشفى. في القصور الكلوي يجب تخفيض الجرعة — المستويات العالية تسبّب التشوّش والاختلاج.'},
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'kidney', 'epilepsy'] },

{ sci:'Cefoperazone', ar:'سيفوبيرازون', atc:'J01DD12', cat:'inf.cephalosporin', form:'injection',
  doses:['1 g', '2 g vial', 'with sulbactam'], brand:['Cefobid', 'Sulperazon'],
  notes:{en:'A hospital injection. No alcohol during and for three days after (a flushing, vomiting reaction). It can affect clotting.',
         ar:'حقنة في المستشفى. لا كحول أثناء العلاج وثلاثة أيام بعده (تفاعل احمرار وقيء). قد يؤثر في التخثّر.'},
  ix:[
    ['Alcohol', S, 'Flushing, vomiting and palpitations — none for 72 hours after.', 'احمرار وقيء وخفقان — لا كحول لمدة 72 ساعة بعده.'],
    ['Warfarin', W, 'Raises the INR.', 'يرفع INR.']
  ],
  ci:['cephAllergy', 'betaLactamAnaphylaxis'],
  ask:['allergyPen', 'alcohol', 'thinner'] },

/* ---------- Carbapenems and monobactams ---------- */

{ sci:'Meropenem', ar:'ميروبينيم', atc:'J01DH02', cat:'inf.carbapenem', form:'injection',
  doses:['500 mg', '1 g vial'], brand:['Meronem'],
  notes:{en:'A reserve hospital antibiotic for serious or resistant infections; the dose is adjusted for the kidneys.',
         ar:'مضاد حيوي احتياطي للمستشفى للالتهابات الخطيرة أو المقاومة؛ تُعدّل الجرعة حسب الكلى.'},
  ix:[
    ['Sodium valproate', C, 'Valproate levels collapse within a day — fits; avoid the combination.', 'ينهار مستوى الفالبروات خلال يوم — اختلاج؛ يُتجنّب الجمع.']
  ],
  ci:['betaLactamAnaphylaxis'],
  ask:['allergyPen', 'epilepsy', 'kidney'] },

{ sci:'Imipenem/Cilastatin', ar:'إيميبينيم/سيلاستاتين', atc:'J01DH51', cat:'inf.carbapenem', form:'injection',
  doses:['500 mg/500 mg vial'], brand:['Tienam', 'Primaxin'],
  tags:['seizure'],
  notes:{en:'A reserve hospital antibiotic; fits are more likely than with meropenem, especially in kidney impairment.',
         ar:'مضاد حيوي احتياطي للمستشفى؛ الاختلاج معه أرجح منه مع الميروبينيم، خاصة في القصور الكلوي.'},
  ix:[
    ['Sodium valproate', C, 'Valproate levels collapse — fits; avoid the combination.', 'ينهار مستوى الفالبروات — اختلاج؛ يُتجنّب الجمع.']
  ],
  ci:['betaLactamAnaphylaxis'],
  ask:['allergyPen', 'epilepsy', 'kidney'] },

{ sci:'Ertapenem', ar:'إرتابينيم', atc:'J01DH03', cat:'inf.carbapenem', form:'injection',
  doses:['1 g vial'], brand:['Invanz'],
  notes:{en:'A once-daily injection for serious infections, sometimes given at home.',
         ar:'حقنة مرة واحدة يومياً للالتهابات الخطيرة، تُعطى أحياناً في البيت.'},
  ix:[
    ['Sodium valproate', C, 'Valproate levels collapse — fits; avoid the combination.', 'ينهار مستوى الفالبروات — اختلاج؛ يُتجنّب الجمع.']
  ],
  ci:['betaLactamAnaphylaxis'],
  ask:['allergyPen', 'epilepsy', 'kidney'] },

{ sci:'Aztreonam', ar:'أزتريونام', atc:'J01DF01', cat:'inf.carbapenem', form:'injection',
  doses:['1 g vial', '75 mg inhalation'], brand:['Azactam', 'Cayston'],
  notes:{en:'A hospital antibiotic that is usually safe in penicillin allergy (though not with a ceftazidime allergy).',
         ar:'مضاد حيوي للمستشفى آمن عادة مع حساسية البنسلين (لكن ليس مع حساسية السيفتازيديم).'},
  ask:['allergy', 'kidney'] },

/* ---------- Macrolides and clindamycin ---------- */
{ sci:'Azithromycin', ar:'أزيثرومايسين', atc:'J01FA10', cat:'inf.macrolide', form:'tablet',
  doses:['200 mg/5 mL', '250 mg', '500 mg'], brand:['Zithromax'],
  tags:['qt'],
  notes:{en:'Usually a three-day course, once daily. It keeps working after the tablets run out.',
         ar:'كورس ثلاثة أيام عادة، مرة واحدة يومياً. الأثر يستمر بعد انتهاء الأقراص.'},
  ix:[
    ['Amiodarone', C, 'QT prolongation — avoid the combination.', 'إطالة QT — يُتجنّب الجمع.'],
    ['Domperidone', S, 'Additive QT prolongation.', 'إطالة QT مضاعفة.'],
    ['Warfarin', W, 'May raise INR.', 'قد يرفع INR.']
  ],
  ci:[{en:'Previous cholestatic jaundice with a macrolide', ar:'يرقان ركودي سابق مع الماكروليدات'}, 'qt'],
  ask:['allergy', 'rhythm', 'childAge'] },

{ sci:'Clarithromycin', ar:'كلاريثرومايسين', atc:'J01FA09', cat:'inf.macrolide', form:'tablet',
  doses:['125 mg/5 mL', '250 mg', '500 mg'], brand:['Klacid', 'Biaxin'],
  tags:['qt', 'inh3a4'],
  notes:{en:'A strong CYP3A4 inhibitor — read the patient’s whole list before dispensing, not just this one.',
         ar:'مثبّط قوي لـ CYP3A4 — راجع قائمة أدوية المريض كاملة قبل الصرف، لا هذا الدواء وحده.'},
  ix:[
    ['Simvastatin', C, 'Rhabdomyolysis — stop the statin for the course.', 'انحلال ربيدات — يُوقف الستاتين طوال الكورس.'],
    ['Amiodarone', C, 'QT prolongation — avoid the combination.', 'إطالة QT — يُتجنّب الجمع.'],
    ['Atorvastatin', S, 'Raises statin levels — reduce or hold.', 'يرفع مستوى الستاتين — تُخفّض الجرعة أو يُوقف.'],
    ['Warfarin', S, 'Markedly raises INR.', 'يرفع INR بوضوح.']
  ],
  ci:['qt', {en:'Concurrent simvastatin', ar:'الاستعمال المتزامن مع سيمفاستاتين'}, {en:'Hepatic impairment with renal impairment', ar:'قصور كبدي مع قصور كلوي'}],
  ask:['statin', 'rhythm', 'otherMeds'] },

{ sci:'Clindamycin', ar:'كليندامايسين', atc:'J01FF01', cat:'inf.macrolide', form:'capsule',
  doses:['150 mg', '300 mg', '1% solution'], brand:['Dalacin'],
  notes:{en:'Stop and seek advice at once with watery diarrhoea — the C. difficile colitis risk is the highest of the common oral antibiotics.',
         ar:'يُوقف ويُراجع فوراً عند حدوث إسهال مائي — خطر التهاب القولون بالمطثية العسيرة هو الأعلى بين الصادات الفموية الشائعة.'},
  ix:[
    ['Erythromycin', W, 'Antagonistic mechanisms.', 'تضاد في آلية العمل.']
  ],
  ci:['colitisHistory'],
  ask:['allergy', 'abxDiarrhoea'] },

{ sci:'Erythromycin', ar:'إريثرومايسين', atc:'J01FA01', cat:'inf.macrolide', form:'tablet',
  doses:['125 mg/5 mL', '250 mg', '500 mg'], brand:['Erythrocin'],
  tags:['qt', 'inh3a4'],
  notes:{en:'GI upset is the usual reason people stop. An enzyme inhibitor like clarithromycin — read the patient’s list.',
         ar:'الاضطراب المعوي أشيع أسباب التوقف. مثبّط إنزيمي مثل الكلاريثرومايسين — راجع قائمة المريض.'},
  ix:[
    ['Simvastatin', C, 'Rhabdomyolysis — hold the statin.', 'انحلال ربيدات — يُوقف الستاتين.'],
    ['Warfarin', S, 'Raises INR.', 'يرفع INR.'],
    ['Amiodarone', C, 'QT prolongation — avoid the combination.', 'إطالة QT — يُتجنّب الجمع.'],
    ['Clindamycin', W, 'Antagonistic mechanisms.', 'تضاد في آلية العمل.']
  ],
  ci:['qt', 'hepSevere'],
  ask:['rhythm', 'otherMeds', 'liver'] },

{ sci:'Roxithromycin', ar:'روكسيثرومايسين', atc:'J01FA06', cat:'inf.macrolide', form:'tablet',
  doses:['150 mg', '300 mg', '50 mg dispersible'], brand:['Rulid'],
  tags:['qt', 'inh3a4mod'], take:['beforeFood'],
  notes:{en:'Before meals, once or twice a day. Nausea is common. Tell us every other medicine you take.',
         ar:'قبل الوجبات، مرة أو مرتين يومياً. الغثيان شائع. أخبرنا بكل دواء آخر تأخذه.'},
  ci:['qt'],
  ask:['allergy', 'rhythm', 'otherMeds'] },

{ sci:'Spiramycin', ar:'سبيرامايسين', atc:'J01FA02', cat:'inf.macrolide', form:'tablet',
  doses:['1.5 MIU', '3 MIU', '750,000 IU with metronidazole 125 mg'], brand:['Rovamycine', 'Rodogyl'],
  tags:['qtPossible'],
  notes:{en:'Used for dental infections (with metronidazole — then no alcohol) and for toxoplasmosis in pregnancy.',
         ar:'يُستعمل لالتهابات الأسنان (مع الميترونيدازول — فلا كحول حينها) ولداء المقوّسات في الحمل.'},
  ask:['allergy', 'preg', 'alcohol'] },

{ sci:'Lincomycin', ar:'لينكومايسين', atc:'J01FF02', cat:'inf.macrolide', form:'capsule',
  doses:['500 mg capsule', '300 mg/mL injection'], brand:['Lincocin'],
  take:['emptyStomach'],
  notes:{en:'On an empty stomach. Severe or bloody diarrhoea during or after the course means stop and see a doctor (C. difficile).',
         ar:'على معدة فارغة. الإسهال الشديد أو الدموي أثناء الدورة أو بعدها يستوجب الإيقاف ومراجعة الطبيب (المطثية العسيرة).'},
  ci:['colitisHistory'],
  ask:['abxDiarrhoea', 'allergy'] },

/* ---------- Quinolones ---------- */
{ sci:'Ciprofloxacin', ar:'سيبروفلوكساسين', atc:'J01MA02', cat:'inf.quinolone', form:'tablet',
  doses:['250 mg', '500 mg', '750 mg', '0.3% drops'], brand:['Ciprobay', 'Cipro'],
  tags:['quinolone', 'qt', 'chelatable', 'seizure'], take:['noMilk'],
  notes:{en:'Two hours before or six after milk, antacids, iron or zinc — otherwise it simply will not absorb.',
         ar:'يُباعد ساعتين قبل أو ست ساعات بعد الحليب ومضادات الحموضة والحديد والزنك — وإلا لن يُمتص.'},
  ix:[
    ['Tizanidine', C, 'Severe hypotension and sedation — the combination is contraindicated.', 'هبوط ضغط شديد ونعاس — ممنوع الجمع.'],
    ['Calcium carbonate', S, 'Chelates with calcium and loses absorption.', 'يرتبط بالكالسيوم ويفقد الامتصاص.'],
    ['Theophylline', S, 'Raises theophylline to toxic levels.', 'يرفع الثيوفيلين إلى حدّ السميّة.'],
    ['Warfarin', S, 'Raises INR.', 'يرفع INR.']
  ],
  ci:['tendon', 'myasthenia', 'pregBf'],
  ask:['tendon', 'antacids', 'preg'] },

{ sci:'Levofloxacin', ar:'ليفوفلوكساسين', atc:'J01MA12', cat:'inf.quinolone', form:'tablet',
  doses:['250 mg', '500 mg', '750 mg'], brand:['Tavanic'],
  tags:['quinolone', 'qt', 'chelatable', 'seizure'], take:['noMilk'],
  notes:{en:'Once daily. Same spacing rule as ciprofloxacin for calcium, iron and antacids.',
         ar:'مرة واحدة يومياً. نفس قاعدة المباعدة عن الكالسيوم والحديد ومضادات الحموضة.'},
  ix:[
    ['Warfarin', S, 'Raises INR.', 'يرفع INR.'],
    ['Calcium carbonate', S, 'Chelates with calcium and loses absorption.', 'يرتبط بالكالسيوم ويفقد الامتصاص.'],
    ['Amiodarone', S, 'Additive QT prolongation.', 'إطالة QT مضاعفة.']
  ],
  ci:['tendon', 'myasthenia', 'epilepsy'],
  ask:['tendon', 'antacids', 'diabetesMeds'] },

{ sci:'Moxifloxacin', ar:'موكسيفلوكساسين', atc:'J01MA14', cat:'inf.quinolone', form:'tablet',
  doses:['400 mg tablet', '400 mg/250 mL infusion', '0.5% eye drops'], brand:['Avelox', 'Vigamox'],
  tags:['quinolone', 'qt', 'chelatable', 'seizure'], take:['noMilk'],
  notes:{en:'Once a day, apart from milk, antacids, iron and zinc. Stop at the first tendon pain, and report palpitations or fainting. The eye drops have none of these effects.',
         ar:'مرة واحدة يومياً، بعيداً عن الحليب ومضادات الحموضة والحديد والزنك. أوقفه عند أول ألم في الوتر، وأبلغ عن الخفقان أو الإغماء. قطرة العين ليس لها هذه الآثار.'},
  ci:['qt', 'tendon', 'hepSevere', 'under18'],
  ask:['tendon', 'rhythm', 'antacids'] },

{ sci:'Ofloxacin', ar:'أوفلوكساسين', atc:'J01MA01', cat:'inf.quinolone', form:'tablet',
  doses:['200 mg', '400 mg tablet', '0.3% eye and ear drops'], brand:['Tarivid', 'Floxin', 'Exocin'],
  tags:['quinolone', 'qtPossible', 'chelatable', 'seizure'], take:['noMilk'],
  notes:{en:'Apart from milk, antacids and iron. Stop at the first tendon pain. The drops are used for eye and ear infections.',
         ar:'بعيداً عن الحليب ومضادات الحموضة والحديد. أوقفه عند أول ألم في الوتر. القطرات تُستعمل لالتهابات العين والأذن.'},
  ci:['tendon', 'epilepsy', 'under18'],
  ask:['tendon', 'antacids', 'preg'] },

{ sci:'Norfloxacin', ar:'نورفلوكساسين', atc:'J01MA06', cat:'inf.quinolone', form:'tablet',
  doses:['400 mg'], brand:['Noroxin'],
  tags:['quinolone', 'chelatable'], take:['emptyStomach', 'noMilk'],
  notes:{en:'For urine infections: on an empty stomach, apart from milk and antacids. Stop at the first tendon pain.',
         ar:'لالتهابات البول: على معدة فارغة، بعيداً عن الحليب ومضادات الحموضة. أوقفه عند أول ألم في الوتر.'},
  ci:['tendon', 'under18'],
  ask:['tendon', 'antacids', 'preg'] },

{ sci:'Nalidixic acid', ar:'حمض الناليديكسيك', atc:'J01MB02', cat:'inf.quinolone', form:'tablet',
  doses:['500 mg', '300 mg/5 mL suspension'], brand:['Negram'],
  tags:['chelatable'],
  notes:{en:'An old urinary antiseptic. It makes skin burn in the sun. Not for young infants.',
         ar:'مطهّر بولي قديم. يجعل الجلد يحترق في الشمس. لا يُعطى للرضّع الصغار.'},
  ci:['g6pd', 'epilepsy', 'porphyria', {en:'Infants under 3 months', ar:'الرضّع دون 3 أشهر'}],
  ask:['childAge', 'g6pd', 'epilepsy'] },

/* ---------- Tetracyclines ---------- */
{ sci:'Doxycycline', ar:'دوكسيسيكلين', atc:'J01AA02', cat:'inf.tetracycline', form:'capsule',
  doses:['50 mg', '100 mg'], brand:['Vibramycin'],
  tags:['tetracycline', 'chelatable'],
  notes:{en:'A full glass of water and stay upright for thirty minutes — it ulcerates the oesophagus lying down. Warn about sun: it causes photosensitivity.',
         ar:'مع كوب ماء كامل وبقاء منتصباً نصف ساعة — يسبّب تقرّح المريء عند الاستلقاء. واقٍ شمسي: يسبّب حساسية ضوئية.'},
  ix:[
    ['Ferrous sulfate', S, 'Chelates with iron and loses absorption — space by two hours.', 'يرتبط بالحديد ويفقد الامتصاص — باعد ساعتين.'],
    ['Calcium carbonate', S, 'Chelates with calcium and loses absorption.', 'يرتبط بالكالسيوم ويفقد الامتصاص.'],
    ['Isotretinoin', S, 'Raised intracranial pressure.', 'ارتفاع ضغط داخل القحف.'],
    ['Warfarin', W, 'May raise INR.', 'قد يرفع INR.']
  ],
  ci:['preg', 'under12'],
  ask:['preg', 'antacids', 'sun'] },

{ sci:'Tetracycline', ar:'تتراسيكلين', atc:'J01AA07', cat:'inf.tetracycline', form:'capsule',
  doses:['250 mg capsule', '1% eye ointment', '3% skin ointment'], brand:['Achromycin'],
  tags:['tetracycline', 'chelatable'], take:['emptyStomach', 'noMilk'],
  notes:{en:'On an empty stomach with a full glass of water, sitting up; never with milk, antacids or iron. Not for children under 12 or in pregnancy — it stains growing teeth.',
         ar:'على معدة فارغة مع كأس ماء كامل وأنت جالس؛ لا يؤخذ أبداً مع الحليب أو مضادات الحموضة أو الحديد. لا يُعطى لمن هم دون 12 سنة ولا في الحمل — يصبغ الأسنان النامية.'},
  ci:['under12', 'preg', 'renalSevere'],
  ask:['preg', 'antacids', 'childAge'] },

{ sci:'Minocycline', ar:'مينوسيكلين', atc:'J01AA08', cat:'inf.tetracycline', form:'capsule',
  doses:['50 mg', '100 mg'], brand:['Minocin'],
  tags:['tetracycline', 'chelatable'],
  notes:{en:'With a full glass of water, sitting up. Dizziness is common; long use can cause blue-grey skin patches. Report joint pains or yellowing.',
         ar:'مع كأس ماء كامل وأنت جالس. الدوخة شائعة؛ والاستعمال الطويل قد يسبّب بقعاً رمادية مزرقة في الجلد. أبلغ عن آلام المفاصل أو الاصفرار.'},
  ci:['under12', 'preg'],
  ask:['preg', 'antacids', 'sun'] },

{ sci:'Oxytetracycline', ar:'أوكسي تتراسيكلين', atc:'J01AA06', cat:'inf.tetracycline', form:'ointment',
  doses:['eye ointment with polymyxin B', '250 mg tablet', 'injection'], brand:['Terramycin'],
  tags:['tetracycline', 'chelatable'],
  notes:{en:'Mostly the eye ointment (with polymyxin B), a small strip inside the lower lid. The tablets are taken on an empty stomach, apart from milk and antacids.',
         ar:'غالباً مرهم العين (مع البوليميكسين B)، شريط صغير داخل الجفن السفلي. الأقراص تؤخذ على معدة فارغة بعيداً عن الحليب ومضادات الحموضة.'},
  ci:['under12', 'preg'],
  ask:['preg', 'childAge'] },

{ sci:'Tigecycline', ar:'تيغيسيكلين', atc:'J01AA12', cat:'inf.tetracycline', form:'injection',
  doses:['50 mg vial'], brand:['Tygacil'],
  tags:['tetracycline'],
  notes:{en:'A reserve hospital antibiotic for resistant infections; nausea and vomiting are common.',
         ar:'مضاد حيوي احتياطي للمستشفى للعدوى المقاومة؛ الغثيان والقيء شائعان.'},
  ci:['under12', 'preg'],
  ask:['allergy', 'liver'] },

/* ---------- Aminoglycosides ---------- */
{ sci:'Gentamicin', ar:'جنتامايسين', atc:'J01GB03', cat:'inf.aminoglycoside', form:'injection',
  doses:['40 mg/mL', '80 mg/2 mL', '0.3% drops'], brand:['Garamycin'],
  tags:['nephrotoxic', 'ototoxic'],
  notes:{en:'Level-dependent ear and kidney toxicity — needs level and renal monitoring. Tinnitus and unsteadiness are the warning signs.',
         ar:'سميّة أذنية وكلوية تعتمد على المستوى — يستوجب قياس المستويات ووظيفة الكلية. الطنين وعدم التوازن علامات إنذار.'},
  ix:[
    ['Furosemide', S, 'Compounded ear and kidney toxicity.', 'سميّة أذنية وكلوية مضاعفة.'],
    ['Ibuprofen', S, 'Compounded renal risk.', 'خطر كلوي مضاعف.']
  ],
  ci:['myasthenia', 'preg', 'hearingLoss'],
  ask:['kidney', 'hearing', 'preg'] },

{ sci:'Amikacin', ar:'أميكاسين', atc:'J01GB06', cat:'inf.aminoglycoside', form:'injection',
  doses:['100 mg/2 mL', '500 mg/2 mL'], brand:['Amikin'],
  tags:['nephrotoxic', 'ototoxic'],
  notes:{en:'A hospital injection; blood levels and kidney function are checked. Report ringing in the ears, hearing loss or unsteadiness.',
         ar:'حقنة في المستشفى؛ يُفحص مستواه في الدم ووظائف الكلى. أبلغ عن الطنين أو ضعف السمع أو عدم الثبات.'},
  ci:['myasthenia'],
  ask:['kidney', 'hearing', 'preg'] },

{ sci:'Kanamycin', ar:'كاناميسين', atc:'J01GB04', cat:'inf.aminoglycoside', form:'injection',
  doses:['0.5 g', '1 g vial'],
  tags:['nephrotoxic', 'ototoxic'],
  notes:{en:'An older injectable aminoglycoside, now mostly in tuberculosis regimens; hearing and kidney function are monitored.',
         ar:'أمينوغليكوزيد حقني أقدم، يُستعمل الآن غالباً في أنظمة علاج السل؛ يُراقب السمع ووظائف الكلى.'},
  ci:['myasthenia', 'preg'],
  ask:['kidney', 'hearing'] }

];
