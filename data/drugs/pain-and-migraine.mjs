/* Pain: non-opioid painkillers, opioids, and migraine. The anti-inflammatory
   painkillers (NSAIDs) are with muscles and joints. Controlled substances
   carry `controlled` to match data/controlled.json. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Painkillers (non-opioid) ---------- */
{ sci:'Paracetamol', ar:'باراسيتامول', atc:'N02BE01', cat:'cns.analgesic', form:'tablet',
  doses:['120 mg/5 mL', '250 mg/5 mL', '500 mg', '1 g'], brand:['Panadol', 'Tylenol'], aka:['Acetaminophen'],
  notes:{en:'Maximum 4 g daily in adults. Check combination cold remedies — most already contain paracetamol.',
         ar:'الحد الأقصى 4 غم يومياً للبالغين. تحقّق من أدوية الزكام المركّبة — أكثرها يحتوي باراسيتامول أصلاً.'},
  ix:[
    ['Warfarin', W, 'Regular high-dose use may raise INR.', 'الاستخدام المنتظم بجرعة عالية قد يرفع INR.'],
    ['Carbamazepine', W, 'Enzyme induction increases the hepatotoxic metabolite.', 'تحريض الإنزيمات يزيد المستقلب السام للكبد.']
  ],
  ci:['hepSevere'],
  ask:['sameIngredient', 'liver', 'childAge'] },

{ sci:'Caffeine', ar:'كافيين', atc:'N06BC01', cat:'cns.analgesic', form:'tablet',
  doses:['in painkiller combinations (30–65 mg)', 'with ergotamine', '50 mg tablet'], aka:['Caffeine anhydrous'],
  notes:{en:'Added to painkillers to make them work a little better; the tablets count towards the day’s coffee and tea. Too much causes palpitations, shakiness and poor sleep — not late in the day.',
         ar:'يُضاف إلى المسكّنات ليزيد أثرها قليلاً؛ وتُحسب الأقراص مع قهوة اليوم وشايه. الزيادة تسبّب الخفقان والرجفة وسوء النوم — لا يؤخذ في آخر النهار.'},
  ix:[
    ['Ciprofloxacin', W, 'Raises caffeine — jitteriness and palpitations.', 'يرفع الكافيين — عصبية وخفقان.'],
    ['Theophylline', W, 'Adds to theophylline’s side effects.', 'يزيد الآثار الجانبية للثيوفيلين.'],
    ['Lithium', W, 'Lowers lithium; stopping caffeine suddenly raises it.', 'يخفض الليثيوم؛ والتوقف المفاجئ عن الكافيين يرفعه.']
  ],
  ci:['arrhythmia'],
  ask:['heart', 'sameIngredient', 'preg'] },

{ sci:'Metamizole', ar:'ميتاميزول', atc:'N02BB02', cat:'cns.analgesic', form:'tablet',
  doses:['500 mg', '500 mg/mL drops', '1 g/2 mL and 2.5 g/5 mL injection', '300 mg suppository'], brand:['Novalgin', 'Baralgin'], aka:['Dipyrone', 'Metamizole sodium'],
  notes:{en:'A strong painkiller and fever reducer. Rarely it wipes out the white cells — stop and get a blood count at once for fever, sore throat or mouth ulcers. The injection is given slowly, lying down.',
         ar:'مسكّن قوي وخافض للحرارة. نادراً ما يُفني الكريات البيض — أوقفه وأجرِ تعداد دم فوراً عند الحرارة أو التهاب الحلق أو قروح الفم. تُعطى الحقنة ببطء والمريض مستلقٍ.'},
  ix:[
    ['Methotrexate', S, 'More marrow toxicity — avoid.', 'سمّية نقي أكثر — يُتجنّب.'],
    ['Ciclosporin', W, 'Lowers ciclosporin levels.', 'يخفض مستوى السيكلوسبورين.']
  ],
  ci:['marrow', 'g6pd', 'porphyria', 'preg3', {en:'Infants under 3 months or under 5 kg', ar:'الرضّع دون 3 أشهر أو دون 5 كغ'}],
  ask:['allergyNsaid', 'infection', 'childAge'] },

{ sci:'Nefopam', ar:'نيفوبام', atc:'N02BG06', cat:'cns.analgesic', form:'tablet',
  doses:['30 mg', '20 mg/2 mL injection'], brand:['Acupan'],
  tags:['anticholinergic', 'seizure'],
  notes:{en:'A non-opioid painkiller. Nausea, sweating, a dry mouth and a fast heartbeat are common; urine may turn pink.',
         ar:'مسكّن غير أفيوني. الغثيان والتعرّق وجفاف الفم وتسارع القلب شائعة؛ وقد يصبح البول وردياً.'},
  ci:['epilepsy', 'angleGlaucoma', 'retention', 'recentMI'],
  ask:['epilepsy', 'glaucoma', 'prostate'] },

/* ---------- Opioid painkillers ---------- */
{ sci:'Tramadol', ar:'ترامادول', atc:'N02AX02', cat:'cns.opioid', form:'capsule',
  doses:['50 mg', '100 mg/2 mL', '100 mg SR'], brand:['Tramal', 'Ultram'],
  tags:['opioid', 'sedative', 'sero', 'seizure'], controlled:true,
  notes:{en:'A controlled substance. Lowers the seizure threshold and causes drowsiness — no driving until they know how it affects them.',
         ar:'مادة خاضعة للرقابة. يخفض عتبة الاختلاج وينبّه للنعاس — لا قيادة حتى يُعرف أثره.'},
  ix:[
    ['Sertraline', S, 'Serotonin syndrome when combined with an SSRI.', 'متلازمة السيروتونين — الجمع مع مثبطات استرداد السيروتونين.'],
    ['Fluoxetine', S, 'Serotonin syndrome, and reduces tramadol’s effect.', 'متلازمة السيروتونين، ويقلّل فعالية الترامادول.'],
    ['Carbamazepine', W, 'Reduces tramadol’s effect through enzyme induction.', 'يقلّل فعالية الترامادول بتحريض الإنزيمات.']
  ],
  ci:['uncontrolledEpilepsy', 'maoi', 'respDepression'],
  ask:['prescription', 'epilepsy', 'antidep'] },

{ sci:'Codeine', ar:'كودائين', atc:'R05DA04', cat:'cns.opioid', form:'tablet',
  doses:['8 mg with paracetamol', '30 mg with paracetamol', '10 mg in cough syrups', '15 mg/5 mL linctus'], brand:['Solpadeine', 'Panadeine', 'Co-codamol'],
  tags:['opioid', 'sedative'], controlled:true,
  notes:{en:'Constipating and drowsy — no driving. Not for anyone under 12, or under 18 after tonsil surgery, or while breastfeeding: some people turn it into morphine very fast. Habit-forming — short courses only.',
         ar:'يسبّب الإمساك والنعاس — لا قيادة. لا يُعطى لمن هم دون 12 سنة، ولا دون 18 بعد استئصال اللوزتين، ولا أثناء الإرضاع: بعض الناس يحوّلونه إلى مورفين بسرعة كبيرة. يسبّب الاعتياد — دورات قصيرة فقط.'},
  ci:['under12', 'breastfeeding', 'respDepression'],
  ask:['prescription', 'childAge', 'sedatives'] },

{ sci:'Dihydrocodeine', ar:'ثنائي هيدرو الكودائين', atc:'N02AA08', cat:'cns.opioid', form:'tablet',
  doses:['30 mg', '60 mg SR', 'with paracetamol'], brand:['DF118'],
  tags:['opioid', 'sedative'], controlled:true,
  notes:{en:'An opioid painkiller: drowsy and constipating, and habit-forming. No alcohol, no driving until you know how it affects you.',
         ar:'مسكّن أفيوني: يسبّب النعاس والإمساك والاعتياد. لا كحول، ولا قيادة حتى تعرف أثره عليك.'},
  ci:['respDepression', 'under12'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Morphine', ar:'مورفين', atc:'N02AA01', cat:'cns.opioid', form:'injection',
  doses:['10 mg/mL injection', '10 mg/5 mL oral solution', '10 mg', '30 mg SR tablet'], brand:['MST Continus', 'Oramorph'],
  tags:['opioid', 'sedative'], controlled:true,
  notes:{en:'For severe pain. Constipation is certain — a laxative goes with it. Drowsiness, nausea and confusion can occur; slow or shallow breathing is an emergency. Keep it locked away.',
         ar:'للألم الشديد. الإمساك مؤكد — ويُعطى معه ملين. قد يحدث نعاس وغثيان وتشوّش؛ والتنفس البطيء أو السطحي حالة طارئة. يُحفظ مقفلاً عليه.'},
  ci:['respDepression', 'headInjury', 'ileus'],
  ask:['prescription', 'sedatives', 'kidney'] },

{ sci:'Pethidine', ar:'بيثيدين', atc:'N02AB02', cat:'cns.opioid', form:'injection',
  doses:['50 mg/mL injection'], brand:['Demerol'], aka:['Meperidine'],
  tags:['opioid', 'sedative', 'sero', 'seizure'], controlled:true,
  notes:{en:'An injectable opioid, mostly in labour and hospital. Its breakdown product causes fits with repeated doses or kidney impairment. Never with an MAO inhibitor.',
         ar:'أفيون يُحقن، في الولادة والمستشفى غالباً. يسبّب مستقلبه الاختلاج مع الجرعات المتكررة أو القصور الكلوي. لا يُجمع أبداً مع مثبط MAO.'},
  ci:['maoi', 'respDepression', 'renalSevere'],
  ask:['maoi', 'kidney', 'epilepsy'] },

{ sci:'Fentanyl', ar:'فنتانيل', atc:'N02AB03', cat:'cns.opioid', form:'injection',
  doses:['50 microgram/mL injection', '12, 25, 50, 75, 100 microgram/h patch'], brand:['Durogesic', 'Sublimaze'],
  tags:['opioid', 'sedative', 'seroWeak', 'sub3a4'], controlled:true,
  notes:{en:'Patches last 72 hours: never cut them, keep heat (hot baths, heating pads, fever) away, and fold used patches sticky sides together before disposal — a patch stuck to a child can kill.',
         ar:'اللصقة تدوم 72 ساعة: لا تُقصّ أبداً، ويُبعد عنها الحرّ (الحمّام الساخن، الوسائد الحرارية، الحمّى)، وتُطوى اللصقة المستعملة على وجهيها اللاصقين قبل رميها — لصقة تعلق بطفل قد تقتله.'},
  ci:['respDepression', {en:'Opioid-naive patients (patches)', ar:'مرضى لم يستعملوا الأفيونات من قبل (اللصقات)'}],
  ask:['prescription', 'sedatives', 'otherMeds'] },

{ sci:'Remifentanil', ar:'ريميفنتانيل', atc:'N01AH06', cat:'cns.opioid', form:'injection',
  doses:['1 mg', '2 mg', '5 mg vial'], brand:['Ultiva'],
  tags:['opioid', 'sedative'], controlled:true,
  notes:{en:'An ultra-short-acting opioid infused during anaesthesia and intensive care; its effect ends within minutes of stopping, so pain relief must be planned.',
         ar:'أفيون فائق قصر المفعول يُسرّب أثناء التخدير والعناية المركّزة؛ ينتهي أثره خلال دقائق من الإيقاف، فيجب التخطيط لتسكين الألم بعده.'},
  ci:['respDepression'],
  ask:['allergy'] },

{ sci:'Sufentanil', ar:'سوفنتانيل', atc:'N01AH03', cat:'cns.opioid', form:'injection',
  doses:['50 microgram/mL'], brand:['Sufenta'],
  tags:['opioid', 'sedative'], controlled:true,
  notes:{en:'A very potent opioid used in anaesthesia and intensive care only.',
         ar:'أفيون شديد القوة يُستعمل في التخدير والعناية المركّزة فقط.'},
  ci:['respDepression'],
  ask:['allergy'] },

{ sci:'Oxycodone', ar:'أوكسيكودون', atc:'N02AA05', cat:'cns.opioid', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg', '40 mg SR'], brand:['OxyContin', 'OxyNorm'],
  tags:['opioid', 'sedative', 'sub3a4'], controlled:true,
  notes:{en:'For severe pain. Swallow slow-release tablets whole — crushing releases a dangerous dose. Constipation is certain; a laxative goes with it. Keep it locked away.',
         ar:'للألم الشديد. تُبلع الأقراص بطيئة الإطلاق كاملة — سحقها يطلق جرعة خطيرة. الإمساك مؤكد؛ ويُعطى معه ملين. يُحفظ مقفلاً عليه.'},
  ci:['respDepression', 'ileus', 'headInjury'],
  ask:['prescription', 'sedatives', 'kidney'] },

{ sci:'Hydromorphone', ar:'هيدرومورفون', atc:'N02AA03', cat:'cns.opioid', form:'tablet',
  doses:['1.3 mg', '2.6 mg', '2 mg/mL injection'], brand:['Palladone', 'Dilaudid'],
  tags:['opioid', 'sedative'], controlled:true,
  notes:{en:'A strong opioid for severe pain; doses are small and not interchangeable with morphine milligram for milligram. Constipation and drowsiness are expected.',
         ar:'أفيون قوي للألم الشديد؛ جرعاته صغيرة ولا تُساوى بالمورفين ملغماً بملغم. الإمساك والنعاس متوقعان.'},
  ci:['respDepression', 'ileus'],
  ask:['prescription', 'sedatives', 'kidney'] },

{ sci:'Methadone', ar:'ميثادون', atc:'N07BC02', cat:'cns.opioid', form:'solution',
  doses:['1 mg/mL oral solution', '5 mg', '10 mg tablet'], brand:['Physeptone'],
  tags:['opioid', 'sedative', 'qt', 'sero', 'sub3a4'], controlled:true,
  notes:{en:'For opioid dependence or severe pain. It builds up over the first week — dose changes are slow. It prolongs QT. Keep it locked away: a dose for an adult can kill a child.',
         ar:'لعلاج الاعتماد على الأفيونات أو الألم الشديد. يتراكم خلال الأسبوع الأول — تُعدّل الجرعة ببطء. يطيل QT. يُحفظ مقفلاً عليه: جرعة البالغ قد تقتل طفلاً.'},
  ci:['respDepression', 'qt'],
  ask:['prescription', 'rhythm', 'sedatives'] },

{ sci:'Tapentadol', ar:'تابنتادول', atc:'N02AX06', cat:'cns.opioid', form:'tablet',
  doses:['50 mg', '100 mg', '50–250 mg SR'], brand:['Palexia', 'Nucynta'],
  tags:['opioid', 'sedative', 'sero', 'seizure'], controlled:true,
  notes:{en:'A strong painkiller with drowsiness, nausea and constipation. Habit-forming. It can lower the seizure threshold.',
         ar:'مسكّن قوي يسبّب النعاس والغثيان والإمساك. يسبّب الاعتياد. قد يخفض عتبة الاختلاج.'},
  ci:['respDepression', 'maoi', 'uncontrolledEpilepsy'],
  ask:['prescription', 'antidep', 'epilepsy'] },

{ sci:'Buprenorphine', ar:'بوبرينورفين', atc:'N02AE01', cat:'cns.opioid', form:'tablet',
  doses:['2 mg', '8 mg sublingual', '5, 10, 20 microgram/h patch', '0.3 mg/mL injection'], brand:['Subutex', 'Suboxone', 'Temgesic', 'Butrans'],
  tags:['opioid', 'sedative', 'sub3a4'], controlled:true,
  notes:{en:'Sublingual tablets dissolve under the tongue — not swallowed. For dependence, it can bring on withdrawal if started too soon after another opioid. Patches last seven days.',
         ar:'الأقراص تحت اللسان تذوب هناك — ولا تُبلع. في علاج الاعتماد، قد يسبّب أعراض انسحاب إن بُدئ به قبل الأوان بعد أفيون آخر. اللصقات تدوم سبعة أيام.'},
  ci:['respDepression', 'hepSevere'],
  ask:['prescription', 'sedatives', 'liver'] },

{ sci:'Nalbuphine', ar:'نالبوفين', atc:'N02AF02', cat:'cns.opioid', form:'injection',
  doses:['10 mg/mL', '20 mg/2 mL'], brand:['Nubain'],
  tags:['opioid', 'sedative'],
  notes:{en:'An injectable painkiller; drowsiness and sweating are common. In someone taking regular opioids it can bring on withdrawal.',
         ar:'مسكّن يُحقن؛ النعاس والتعرّق شائعان. قد يسبّب أعراض انسحاب لمن يأخذ أفيونات بانتظام.'},
  ci:['respDepression'],
  ask:['sedatives', 'prescription'] },

{ sci:'Pentazocine', ar:'بنتازوسين', atc:'N02AD01', cat:'cns.opioid', form:'injection',
  doses:['30 mg/mL injection', '25 mg tablet'], brand:['Fortral', 'Talwin'],
  tags:['opioid', 'sedative'], controlled:true,
  notes:{en:'An opioid painkiller that can cause hallucinations and raise blood pressure; habit-forming. Not in heart attack.',
         ar:'مسكّن أفيوني قد يسبّب الهلوسة ويرفع الضغط؛ يسبّب الاعتياد. لا يُستعمل في الاحتشاء.'},
  ci:['respDepression', 'recentMI', 'headInjury'],
  ask:['prescription', 'heart', 'sedatives'] },

/* ---------- Migraine ---------- */

{ sci:'Pizotifen', ar:'بيزوتيفين', atc:'N02CX01', cat:'cns.migraine', form:'tablet',
  doses:['0.5 mg tablet', '1.5 mg tablet', '0.25 mg/5 mL syrup'], brand:['Sandomigran'], aka:['Pizotyline'],
  tags:['sedative', 'anticholinergic'],
  notes:{en:'Taken every day to prevent migraine, usually at night — not for an attack. It increases appetite and weight and causes drowsiness.',
         ar:'يؤخذ كل يوم للوقاية من الشقيقة، ليلاً عادة — لا لعلاج النوبة. يزيد الشهية والوزن ويسبّب النعاس.'},
  ci:['angleGlaucoma', 'retention'],
  ask:['drive', 'glaucoma', 'prostate'] },

{ sci:'Sumatriptan', ar:'سوماتريبتان', atc:'N02CC01', cat:'cns.migraine', form:'tablet',
  doses:['50 mg', '100 mg', '6 mg injection', '20 mg nasal spray'], brand:['Imigran', 'Imitrex'],
  tags:['triptan', 'seroWeak'],
  notes:{en:'At the start of the headache, not the aura. A second dose only if it came back, at least two hours later; no more than two doses a day. Chest tightness can occur.',
         ar:'في بداية الصداع لا في مرحلة الهالة. جرعة ثانية فقط إن عاد الصداع، وبعد ساعتين على الأقل؛ ولا أكثر من جرعتين يومياً. قد يحدث ضيق في الصدر.'},
  ci:['ihd', 'uncontrolledHtn', {en:'Hemiplegic or basilar migraine', ar:'الشقيقة الفالجية أو القاعدية'}],
  ask:['heart', 'bp', 'antidep'] },

{ sci:'Rizatriptan', ar:'ريزاتريبتان', atc:'N02CC04', cat:'cns.migraine', form:'tablet',
  doses:['5 mg', '10 mg', '10 mg orodispersible'], brand:['Maxalt'],
  tags:['triptan', 'seroWeak'],
  notes:{en:'At the start of the headache; a second dose after two hours if it returns, no more than two in a day. On propranolol, only the 5 mg strength.',
         ar:'في بداية الصداع؛ جرعة ثانية بعد ساعتين إن عاد، ولا أكثر من جرعتين يومياً. مع البروبرانولول، تركيز 5 ملغ فقط.'},
  ci:['ihd', 'uncontrolledHtn', 'maoi'],
  ask:['heart', 'bp', 'otherMeds'] },

{ sci:'Zolmitriptan', ar:'زولميتريبتان', atc:'N02CC03', cat:'cns.migraine', form:'tablet',
  doses:['2.5 mg', '5 mg', '2.5 mg orodispersible', '5 mg nasal spray'], brand:['Zomig'],
  tags:['triptan', 'seroWeak'],
  notes:{en:'At the start of the headache; a second dose after two hours if it returns. Tingling, warmth and chest tightness can occur.',
         ar:'في بداية الصداع؛ جرعة ثانية بعد ساعتين إن عاد. قد يحدث وخز وسخونة وضيق في الصدر.'},
  ci:['ihd', 'uncontrolledHtn', {en:'Wolff–Parkinson–White syndrome', ar:'متلازمة وولف-باركنسون-وايت'}],
  ask:['heart', 'bp', 'antidep'] },

{ sci:'Eletriptan', ar:'إليتريبتان', atc:'N02CC06', cat:'cns.migraine', form:'tablet',
  doses:['20 mg', '40 mg'], brand:['Relpax'],
  tags:['triptan', 'seroWeak', 'sub3a4crit'],
  notes:{en:'At the start of the headache; a second dose after two hours if it returns. Not with clarithromycin or ketoconazole-type antifungals.',
         ar:'في بداية الصداع؛ جرعة ثانية بعد ساعتين إن عاد. لا يُجمع مع الكلاريثرومايسين أو مضادات الفطريات من نوع الكيتوكونازول.'},
  ci:['ihd', 'uncontrolledHtn', 'hepSevere'],
  ask:['heart', 'bp', 'otherMeds'] },

{ sci:'Ergotamine', ar:'إرغوتامين', atc:'N02CA02', cat:'cns.migraine', form:'tablet',
  doses:['1 mg with caffeine 100 mg', '2 mg suppository with caffeine'], brand:['Cafergot', 'Migril'],
  tags:['ergot', 'sub3a4crit'],
  notes:{en:'At the first sign of migraine; strict weekly limits, as overuse narrows the blood vessels of the hands and feet. Never in pregnancy. A precursor chemical: sales are recorded.',
         ar:'عند أول علامة للشقيقة؛ مع حدود أسبوعية صارمة، فالإفراط يضيّق أوعية اليدين والقدمين. لا يُستعمل أبداً في الحمل. مادة سليفة: تُسجّل مبيعاته.'},
  ci:['preg', 'ihd', 'uncontrolledHtn', 'hepRenalSevere'],
  ask:['preg', 'heart', 'otherMeds'] },

{ sci:'Flunarizine', ar:'فلوناريزين', atc:'N07CA03', cat:'cns.migraine', form:'capsule',
  doses:['5 mg', '10 mg'], brand:['Sibelium'],
  tags:['sedative'], take:['bedtime'],
  notes:{en:'Prevents migraine and vertigo: at bedtime. Drowsiness and weight gain are common; stop and report low mood, tremor or stiffness.',
         ar:'يقي من الشقيقة والدوار: قبل النوم. النعاس وزيادة الوزن شائعان؛ أوقفه وأبلغ عن انخفاض المزاج أو الرجفة أو التيبّس.'},
  ci:[{en:'Depression', ar:'الاكتئاب'}, 'parkinson'],
  ask:['mood', 'parkinson', 'drive'] }

];
