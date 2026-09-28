/* Muscles, bones and joints: NSAIDs, muscle relaxants, gout, osteoporosis,
   rheumatoid arthritis, pain rubs and joint supplements. Shape: see
   data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Anti-inflammatory painkillers (NSAIDs) ---------- */
{ sci:'Ibuprofen', ar:'إيبوبروفين', atc:'M01AE01', cat:'msk.nsaid', form:'tablet',
  doses:['100 mg/5 mL', '200 mg', '400 mg', '600 mg'], brand:['Brufen', 'Advil', 'Nurofen'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'With food, for the shortest course that works. Avoid in the third trimester.',
         ar:'يؤخذ مع الطعام ولأقصر مدة ممكنة. يُتجنّب في الثلث الأخير من الحمل.'},
  ix:[
    ['Aspirin', S, 'Blocks aspirin’s antiplatelet effect if taken first — separate the doses.', 'يمنع التأثير المضاد للصفيحات إذا أُخذ قبل الأسبرين — باعد بينهما.'],
    ['Warfarin', S, 'Compounded GI bleeding risk.', 'خطر نزف هضمي مضاعف.'],
    ['Lisinopril', S, 'With a diuretic, the "triple whammy" — acute kidney injury.', 'مع مدرّ بول: ثلاثي يؤذي الكلية حاداً.'],
    ['Methotrexate', S, 'Reduces methotrexate clearance.', 'يقلّل طرح الميثوتريكسيت.']
  ],
  ci:['ulcer', 'preg3', 'hfSevere', {en:'Renal impairment (eGFR < 30)', ar:'قصور كلوي (eGFR < 30)'}],
  ask:['ulcer', 'thinner', 'kidney'] },

{ sci:'Diclofenac', ar:'ديكلوفيناك', atc:'M01AB05', cat:'msk.nsaid', form:'tablet',
  doses:['1% gel', '25 mg', '50 mg', '75 mg/3 mL', '100 mg SR'], brand:['Voltaren', 'Cataflam'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'The highest cardiovascular risk of the common NSAIDs — avoid in ischaemic heart disease. The topical gel is the safer option for local pain.',
         ar:'أعلى خطر قلبي وعائي بين مضادات الالتهاب الشائعة — يُتجنّب في مرض القلب الإقفاري. الهلام الموضعي بديل أأمن للألم الموضعي.'},
  ix:[
    ['Warfarin', S, 'Compounded GI bleeding risk.', 'خطر نزف هضمي مضاعف.'],
    ['Methotrexate', S, 'Reduces methotrexate clearance.', 'يقلّل طرح الميثوتريكسيت.'],
    ['Aspirin', W, 'Doubles bleeding risk with no added benefit.', 'يضاعف خطر النزف دون فائدة إضافية.']
  ],
  ci:['ihd', 'ulcer', 'preg3'],
  ask:['heart', 'ulcer', 'thinner'] },

{ sci:'Naproxen', ar:'نابروكسين', atc:'M01AE02', cat:'msk.nsaid', form:'tablet',
  doses:['250 mg', '500 mg'], brand:['Naprosyn'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'Longer acting than ibuprofen and the lowest cardiovascular risk of the group — the one to choose if an NSAID is unavoidable.',
         ar:'أطول مفعولاً من الإيبوبروفين وأقلّها خطراً على القلب — الخيار المفضّل إذا كان مضاد الالتهاب لا مفرّ منه.'},
  ix:[
    ['Warfarin', S, 'Compounded GI bleeding risk.', 'خطر نزف هضمي مضاعف.'],
    ['Lithium', S, 'Raises lithium to toxic levels.', 'يرفع مستوى الليثيوم إلى حدّ السميّة.'],
    ['Methotrexate', S, 'Reduces methotrexate clearance.', 'يقلّل طرح الميثوتريكسيت.']
  ],
  ci:['ulcer', 'preg3', 'renalSevere'],
  ask:['ulcer', 'thinner', 'kidney'] },

{ sci:'Mefenamic acid', ar:'حمض الميفيناميك', atc:'M01AG01', cat:'msk.nsaid', form:'capsule',
  doses:['250 mg', '500 mg'], brand:['Ponstan'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'A common first choice for period pain — start at the first twinge, take with food.',
         ar:'خيار شائع لعسر الطمث — يبدأ مع أول إحساس بالألم ويؤخذ مع الطعام.'},
  ix:[
    ['Warfarin', S, 'Compounded GI bleeding risk.', 'خطر نزف هضمي مضاعف.']
  ],
  ci:['ulcer', 'ibd', 'renalSevere'],
  ask:['ulcer', 'kidney', 'asthma'] },

{ sci:'Celecoxib', ar:'سيليكوكسيب', atc:'M01AH01', cat:'msk.nsaid', form:'capsule',
  doses:['100 mg', '200 mg'], brand:['Celebrex'],
  tags:['nsaid'],
  notes:{en:'Gentler on the stomach than the other NSAIDs; the cardiovascular risk is not lower.',
         ar:'ألطف على المعدة من بقية مضادات الالتهاب، لكن الخطر القلبي ليس أقل.'},
  ix:[
    ['Warfarin', S, 'Raises INR — monitor coagulation.', 'يرفع INR — راقب التخثر.'],
    ['Fluconazole', W, 'Doubles celecoxib levels — halve the dose.', 'يضاعف مستوى السيليكوكسيب — تُنصّف الجرعة.']
  ],
  ci:['sulfaAllergy', {en:'Ischaemic heart disease', ar:'مرض قلبي إقفاري'}, 'preg3'],
  ask:['heart', 'allergySulfa', 'kidney'] },

{ sci:'Meloxicam', ar:'ميلوكسيكام', atc:'M01AC06', cat:'msk.nsaid', form:'tablet',
  doses:['7.5 mg', '15 mg'], brand:['Mobic'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'Once daily, with food.',
         ar:'مرة واحدة يومياً مع الطعام.'},
  ix:[
    ['Warfarin', S, 'Compounded GI bleeding risk.', 'خطر نزف هضمي مضاعف.'],
    ['Lisinopril', S, 'With a diuretic, a risk of acute kidney injury.', 'مع مدرّ بول: خطر أذية كلوية حادة.']
  ],
  ci:['ulcer', 'hfSevere', 'preg3'],
  ask:['ulcer', 'thinner', 'kidney'] },

{ sci:'Indometacin', ar:'إندوميثاسين', atc:'M01AB01', cat:'msk.nsaid', form:'capsule',
  doses:['25 mg', '50 mg', '75 mg SR', '100 mg suppository'], brand:['Indocid'], aka:['Indomethacin'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'After food. Headache and dizziness are common, and the stomach-bleeding risk is higher than with ibuprofen. Used in short courses, for example for gout attacks.',
         ar:'بعد الطعام. الصداع والدوخة شائعان، وخطر نزف المعدة أعلى منه مع الإيبوبروفين. يُستعمل لفترات قصيرة، كنوبات النقرس.'},
  ci:['ulcer', 'preg3', 'renalSevere'],
  ask:['ulcer', 'kidney', 'thinner'] },

{ sci:'Ketorolac', ar:'كيتورولاك', atc:'M01AB15', cat:'msk.nsaid', form:'tablet',
  doses:['10 mg', '30 mg/mL injection', '0.5% eye drops'], brand:['Toradol', 'Acular'], aka:['Ketorolac trometamol'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'Strong, but for up to five days only (two days by injection) — bleeding and kidney risk rise quickly after that. The eye drops are used after eye surgery.',
         ar:'قوي، لكن لمدة لا تتجاوز خمسة أيام (يومين حقناً) — يرتفع خطر النزف وأذية الكلى بسرعة بعدها. قطرة العين تُستعمل بعد جراحة العين.'},
  ci:['ulcer', 'renalSevere', 'bleeding', 'preg3'],
  ask:['ulcer', 'kidney', 'thinner'] },

{ sci:'Aceclofenac', ar:'أسيكلوفيناك', atc:'M01AB16', cat:'msk.nsaid', form:'tablet',
  doses:['100 mg', '200 mg SR'], brand:['Airtal', 'Biofenac'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'Twice a day after food, for the shortest time that works. Like diclofenac, it is avoided in heart disease.',
         ar:'مرتين يومياً بعد الطعام، لأقصر مدة تكفي. يُتجنّب في أمراض القلب كالديكلوفيناك.'},
  ci:['ihd', 'ulcer', 'preg3'],
  ask:['heart', 'ulcer', 'thinner'] },

{ sci:'Etodolac', ar:'إيتودولاك', atc:'M01AB08', cat:'msk.nsaid', form:'tablet',
  doses:['200 mg', '300 mg', '400 mg', '600 mg SR'], brand:['Lodine'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'After food, for the shortest course that works.',
         ar:'بعد الطعام، لأقصر مدة تكفي.'},
  ci:['ulcer', 'preg3', 'renalSevere'],
  ask:['ulcer', 'kidney', 'thinner'] },

{ sci:'Ketoprofen', ar:'كيتوبروفين', atc:'M01AE03', cat:'msk.nsaid', form:'capsule',
  doses:['50 mg', '100 mg', '200 mg SR', '100 mg/2 mL injection', '100 mg suppository', '2.5% gel'], brand:['Profenid', 'Oruvail', 'Fastum'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'After food. The gel makes treated skin burn in sunlight — keep the area covered during use and for two weeks after.',
         ar:'بعد الطعام. الهلام يجعل الجلد المعالج يحترق في الشمس — غطِّ المنطقة أثناء الاستعمال ولمدة أسبوعين بعده.'},
  ci:['ulcer', 'preg3', 'renalSevere'],
  ask:['ulcer', 'kidney', 'sun'] },

{ sci:'Dexketoprofen', ar:'ديكسكيتوبروفين', atc:'M01AE17', cat:'msk.nsaid', form:'tablet',
  doses:['25 mg', '50 mg/2 mL injection'], brand:['Keral', 'Enantyum'],
  tags:['nsaid'],
  notes:{en:'For short-term pain: at least 30 minutes before a meal for speed, or with food if it upsets the stomach. No more than a few days.',
         ar:'للألم قصير الأمد: قبل الوجبة بنصف ساعة لسرعة المفعول، أو مع الطعام إن أزعج المعدة. لا يتجاوز بضعة أيام.'},
  ci:['ulcer', 'preg3', 'renalSevere'],
  ask:['ulcer', 'kidney', 'thinner'] },

{ sci:'Flurbiprofen', ar:'فلوربيبروفين', atc:'M01AE09', cat:'msk.nsaid', form:'tablet',
  doses:['50 mg', '100 mg', '8.75 mg lozenge'], brand:['Froben', 'Strefen'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'Tablets after food. The lozenges are for sore throat — let one dissolve slowly, up to five a day for three days.',
         ar:'الأقراص بعد الطعام. أقراص المصّ لالتهاب الحلق — تُترك لتذوب ببطء، حتى خمس يومياً لثلاثة أيام.'},
  ci:['ulcer', 'preg3', 'nsaidAsthma'],
  ask:['ulcer', 'asthma', 'thinner'] },

{ sci:'Piroxicam', ar:'بيروكسيكام', atc:'M01AC01', cat:'msk.nsaid', form:'capsule',
  doses:['10 mg', '20 mg', '20 mg/mL injection', '0.5% gel'], brand:['Feldene'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'Once a day after food. Its stomach-bleeding risk is higher than most NSAIDs — second-line only, and not for short-term pain in older people.',
         ar:'مرة واحدة يومياً بعد الطعام. خطر نزف المعدة معه أعلى من معظم مضادات الالتهاب — خيار ثانٍ فقط، ولا يُعطى للألم العابر عند كبار السن.'},
  ci:['ulcer', 'preg3', 'renalSevere', 'giBleed'],
  ask:['ulcer', 'thinner', 'kidney'] },

{ sci:'Tenoxicam', ar:'تينوكسيكام', atc:'M01AC02', cat:'msk.nsaid', form:'tablet',
  doses:['20 mg', '20 mg injection'], brand:['Tilcotil'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'Once a day after food. Long-acting — side effects take a while to clear.',
         ar:'مرة واحدة يومياً بعد الطعام. طويل المفعول — تحتاج آثاره الجانبية وقتاً لتزول.'},
  ci:['ulcer', 'preg3', 'renalSevere'],
  ask:['ulcer', 'kidney', 'thinner'] },

{ sci:'Lornoxicam', ar:'لورنوكسيكام', atc:'M01AC05', cat:'msk.nsaid', form:'tablet',
  doses:['4 mg', '8 mg', '8 mg injection'], brand:['Xefo'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'After food, for the shortest time that works.',
         ar:'بعد الطعام، لأقصر مدة تكفي.'},
  ci:['ulcer', 'preg3', 'renalSevere'],
  ask:['ulcer', 'kidney', 'thinner'] },

{ sci:'Etoricoxib', ar:'إيتوريكوكسيب', atc:'M01AH05', cat:'msk.nsaid', form:'tablet',
  doses:['30 mg', '60 mg', '90 mg', '120 mg'], brand:['Arcoxia'],
  tags:['nsaid'],
  notes:{en:'Once a day. Gentler on the stomach, but it raises blood pressure — have it checked. Not with heart disease or uncontrolled blood pressure.',
         ar:'مرة واحدة يومياً. ألطف على المعدة، لكنه يرفع الضغط — افحصه. لا يُستعمل مع أمراض القلب أو الضغط غير المنضبط.'},
  ci:['ihd', 'uncontrolledHtn', 'hfSevere', 'preg3'],
  ask:['bp', 'heart', 'kidney'] },

{ sci:'Nimesulide', ar:'نيميسولايد', atc:'M01AX17', cat:'msk.nsaid', form:'tablet',
  doses:['100 mg', '100 mg sachet'], brand:['Aulin', 'Nise'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'No more than 15 days — it can damage the liver. Report yellowing, dark urine or unusual tiredness. Not for children under 12.',
         ar:'لا يتجاوز 15 يوماً — قد يؤذي الكبد. أبلغ عن الاصفرار أو غمق البول أو التعب غير المعتاد. لا يُعطى لمن هم دون 12 سنة.'},
  ci:['hepActive', 'under12', 'ulcer', 'preg3'],
  ask:['liver', 'alcohol', 'childAge'] },

{ sci:'Nabumetone', ar:'نابوميتون', atc:'M01AX01', cat:'msk.nsaid', form:'tablet',
  doses:['500 mg'], brand:['Relifex'],
  tags:['nsaid'], take:['afterFood'],
  notes:{en:'Once a day, usually at night after food.',
         ar:'مرة واحدة يومياً، عادة ليلاً بعد الطعام.'},
  ci:['ulcer', 'preg3', 'hepSevere'],
  ask:['ulcer', 'kidney', 'thinner'] },

/* ---------- Muscle relaxants ---------- */
{ sci:'Tizanidine', ar:'تيزانيدين', atc:'M03BX02', cat:'msk.relaxant', form:'tablet',
  doses:['2 mg', '4 mg'], brand:['Sirdalud', 'Zanaflex'],
  tags:['sedative'],
  notes:{en:'Sedating and lowers blood pressure. Titrated up and down, never stopped at once.',
         ar:'منوّم ويخفض الضغط. يُرفع ويُخفض تدريجياً.'},
  ix:[
    ['Ciprofloxacin', C, 'Severe hypotension and sedation — the combination is contraindicated.', 'هبوط ضغط شديد ونعاس — ممنوع الجمع.'],
    ['Fluvoxamine', C, 'The combination is contraindicated.', 'ممنوع الجمع.']
  ],
  ci:[{en:'Concurrent ciprofloxacin', ar:'الاستعمال المتزامن مع سيبروفلوكساسين'}, 'hepSevere'],
  ask:['drive', 'liver', 'otherMeds'] },

{ sci:'Orphenadrine', ar:'أورفينادرين', atc:'M03BC01', cat:'msk.relaxant', form:'tablet',
  doses:['100 mg SR', '35 mg with paracetamol 450 mg'], brand:['Norflex', 'Norgesic'],
  tags:['anticholinergic', 'sedative'],
  notes:{en:'For muscle spasm, a short course. Dry mouth and drowsiness are common — no driving. Often combined with paracetamol: count it towards the daily paracetamol limit.',
         ar:'لتشنّج العضلات، لفترة قصيرة. جفاف الفم والنعاس شائعان — لا قيادة. يُركّب كثيراً مع الباراسيتامول: احسبه ضمن الحد اليومي للباراسيتامول.'},
  ci:['angleGlaucoma', 'retention', 'myasthenia'],
  ask:['glaucoma', 'prostate', 'sameIngredient'] },

{ sci:'Methocarbamol', ar:'ميثوكاربامول', atc:'M03BA03', cat:'msk.relaxant', form:'tablet',
  doses:['500 mg', '750 mg'], brand:['Robaxin'],
  tags:['sedative'],
  notes:{en:'For muscle spasm, a short course. Drowsiness and dizziness — no driving. Urine may darken.',
         ar:'لتشنّج العضلات، لفترة قصيرة. النعاس والدوخة — لا قيادة. قد يغمق لون البول.'},
  ci:['myasthenia'],
  ask:['drive', 'sedatives'] },

{ sci:'Chlorzoxazone', ar:'كلورزوكسازون', atc:'M03BB03', cat:'msk.relaxant', form:'tablet',
  doses:['250 mg', '500 mg', 'with paracetamol'], brand:['Parafon', 'Myolgin'],
  tags:['sedative'],
  notes:{en:'For muscle spasm. Rarely it damages the liver — report yellowing or dark urine. Urine can turn orange.',
         ar:'لتشنّج العضلات. نادراً ما يؤذي الكبد — أبلغ عن الاصفرار أو غمق البول. قد يصبح البول برتقالياً.'},
  ci:['hep'],
  ask:['liver', 'drive', 'sameIngredient'] },

{ sci:'Thiocolchicoside', ar:'ثيوكولشيكوسايد', atc:'M03BX05', cat:'msk.relaxant', form:'capsule',
  doses:['4 mg', '8 mg', '4 mg/2 mL injection', '0.25% ointment'], brand:['Muscoril', 'Coltramyl'],
  tags:['seizure'],
  notes:{en:'No more than 7 days by mouth (5 by injection): longer use raises concern about damage to chromosomes. Not in pregnancy or breastfeeding; women need contraception.',
         ar:'لا يتجاوز 7 أيام فموياً (5 حقناً): الاستعمال الأطول يثير القلق من أذية الصبغيات. لا يُستعمل في الحمل أو الإرضاع؛ وتلزم المرأة وسيلة لمنع الحمل.'},
  ci:['pregBf', 'epilepsy', 'under16'],
  ask:['pregTest', 'epilepsy'] },

{ sci:'Baclofen', ar:'باكلوفين', atc:'M03BX01', cat:'msk.relaxant', form:'tablet',
  doses:['10 mg', '25 mg', 'intrathecal'], brand:['Lioresal'],
  tags:['sedative'],
  notes:{en:'For spasticity. Drowsiness and weakness. Never stop suddenly — hallucinations and fits can follow. The dose is lowered in kidney impairment.',
         ar:'للتشنّج العضلي. نعاس وضعف. لا يُوقف فجأة أبداً — قد تعقبه هلوسة واختلاج. تُخفّض الجرعة في القصور الكلوي.'},
  ci:['ulcer'],
  ask:['kidney', 'epilepsy', 'drive'] },

{ sci:'Cyclobenzaprine', ar:'سيكلوبنزابرين', atc:'M03BX08', cat:'msk.relaxant', form:'tablet',
  doses:['5 mg', '10 mg'], brand:['Flexeril'],
  tags:['sedative', 'anticholinergic', 'seroWeak'],
  notes:{en:'For muscle spasm, two or three weeks at most. Drowsiness and a dry mouth are common.',
         ar:'لتشنّج العضلات، أسبوعين أو ثلاثة كحد أقصى. النعاس وجفاف الفم شائعان.'},
  ci:['recentMI', 'arrhythmia', 'maoi', 'thyrotoxicosis'],
  ask:['heart', 'antidep', 'drive'] },

{ sci:'Tolperisone', ar:'تولبيريزون', atc:'M03BX04', cat:'msk.relaxant', form:'tablet',
  doses:['50 mg', '150 mg'], brand:['Mydocalm'],
  take:['afterFood'],
  notes:{en:'After meals with water. Allergic reactions — rash, swelling, wheeze — mean stop at once.',
         ar:'بعد الوجبات مع الماء. تفاعلات التحسّس — الطفح أو التورّم أو الصفير — تستوجب الإيقاف فوراً.'},
  ci:['myasthenia'],
  ask:['allergy', 'drive'] },

{ sci:'Dantrolene', ar:'دانترولين', atc:'M03CA01', cat:'msk.relaxant', form:'injection',
  doses:['20 mg vial', '25 mg capsule'], brand:['Dantrium'],
  notes:{en:'The injection is the treatment for malignant hyperthermia in theatre. Capsules for spasticity need regular liver tests.',
         ar:'الحقنة هي علاج فرط الحرارة الخبيث في غرفة العمليات. الكبسولات للتشنّج العضلي تحتاج فحوص كبد منتظمة.'},
  ix:[
    ['#nondhp', C, 'With intravenous dantrolene, verapamil or diltiazem can cause dangerously high potassium and heart failure — avoid.', 'مع الدانترولين الوريدي قد يسبّب الفيراباميل أو الديلتيازيم ارتفاعاً خطيراً في البوتاسيوم وقصوراً قلبياً — يُتجنّب.'],
    ['Alcohol', W, 'More drowsiness.', 'نعاس أكثر.']
  ],
  ci:['hepActive'],
  ask:['liver'] },

/* ---------- Gout ---------- */
{ sci:'Allopurinol', ar:'ألوبيورينول', atc:'M04AA01', cat:'msk.gout', form:'tablet',
  doses:['100 mg', '300 mg'], brand:['Zyloric'],
  tags:['xanthineOxidase'], take:['afterFood'],
  notes:{en:'Never started during an acute gout attack — it makes it worse. Plenty of fluid. A rash means stop at once.',
         ar:'لا يُبدأ أثناء نوبة نقرس حادة — يُفاقمها. سوائل وفيرة. طفح جلدي يستوجب التوقف الفوري.'},
  ix:[
    ['Azathioprine', C, 'Life-threatening marrow suppression — the azathioprine dose drops to a quarter.', 'تثبيط نقي مهدّد للحياة — تُخفّض جرعة الآزاثيوبرين إلى الربع.'],
    ['Amoxicillin/Clavulanic acid', W, 'Raises the chance of a rash.', 'يزيد احتمال الطفح.'],
    ['Warfarin', W, 'May raise INR.', 'قد يرفع INR.']
  ],
  ci:[{en:'An acute gout attack in progress', ar:'نوبة نقرس حادة فعّالة'}],
  ask:['rash', 'kidney', 'otherMeds'] },

{ sci:'Colchicine', ar:'كولشيسين', atc:'M04AC01', cat:'msk.gout', form:'tablet',
  doses:['0.5 mg', '1 mg'], brand:['Colcrys'],
  tags:['sub3a4crit'],
  notes:{en:'A very narrow window. Diarrhoea is the first sign of too much — stop there, do not push on.',
         ar:'هامش علاجي ضيّق جداً. الإسهال أول علامة تجاوز الجرعة — يُوقف عندها لا يُكمل.'},
  ix:[
    ['Clarithromycin', C, 'Fatal colchicine toxicity — the combination is contraindicated.', 'سميّة كولشيسين قاتلة — ممنوع الجمع.'],
    ['Atorvastatin', S, 'Compounded myopathy risk.', 'خطر اعتلال عضلي مضاعف.'],
    ['Simvastatin', S, 'Rhabdomyolysis risk.', 'خطر انحلال ربيدات.']
  ],
  ci:[{en:'Renal and hepatic impairment together', ar:'قصور كلوي وكبدي معاً'}, {en:'Concurrent clarithromycin', ar:'الاستعمال المتزامن مع الكلاريثرومايسين'}],
  ask:['kidney', 'statin', 'otherMeds'] },

{ sci:'Febuxostat', ar:'فيبوكسوستات', atc:'M04AA03', cat:'msk.gout', form:'tablet',
  doses:['80 mg', '120 mg'], brand:['Adenuric', 'Uloric'],
  tags:['xanthineOxidase'],
  notes:{en:'Once a day. Flares are common in the first months — keep taking it, with the flare treatment advised. Not with azathioprine or mercaptopurine.',
         ar:'مرة واحدة يومياً. النوبات شائعة في الأشهر الأولى — استمر عليه مع علاج النوبة الموصى به. لا يُجمع مع الأزاثيوبرين أو المركابتوبورين.'},
  ci:['ihd'],
  ask:['heart', 'otherMeds', 'liver'] },

{ sci:'Probenecid', ar:'بروبينيسيد', atc:'M04AB01', cat:'msk.gout', form:'tablet',
  doses:['500 mg'], brand:['Benemid'],
  notes:{en:'Increases the kidneys’ removal of uric acid — drink plenty of water. Not started during an attack.',
         ar:'يزيد إطراح الكلى لحمض البول — اشرب ماء كثيراً. لا يُبدأ به أثناء النوبة.'},
  ix:[
    ['Methotrexate', S, 'Raises methotrexate.', 'يرفع الميثوتريكسيت.']
  ],
  ci:['renalSevere', {en:'Uric acid kidney stones', ar:'حصى الكلى من حمض البول'}, {en:'An acute gout attack in progress', ar:'نوبة نقرس حادة فعّالة'}],
  ask:['stones', 'kidney'] },

/* ---------- Osteoporosis ---------- */

{ sci:'Alendronic acid', ar:'حمض الأليندرونيك', atc:'M05BA04', cat:'msk.bone', form:'tablet',
  doses:['10 mg', '70 mg weekly'], brand:['Fosamax'], aka:['Alendronate', 'Alendronate sodium'],
  tags:['chelatableMild'], take:['weekly', 'beforeBreakfast'],
  notes:{en:'Once a week, first thing in the morning, with a full glass of plain water on an empty stomach; stay upright and eat nothing for 30 minutes. A dental check before starting.',
         ar:'مرة في الأسبوع، أول الصباح، مع كأس ماء عادي كامل على معدة فارغة؛ ابقَ منتصباً ولا تأكل شيئاً لمدة 30 دقيقة. فحص الأسنان قبل البدء.'},
  ci:['oesophagus', 'hypoCa', 'renalSevere'],
  ask:['upright', 'swallow', 'dental'] },

{ sci:'Risedronic acid', ar:'حمض الريزيدرونيك', atc:'M05BA07', cat:'msk.bone', form:'tablet',
  doses:['5 mg', '35 mg weekly', '150 mg monthly'], brand:['Actonel'], aka:['Risedronate'],
  tags:['chelatableMild'], take:['beforeBreakfast'],
  notes:{en:'On an empty stomach with a full glass of plain water, staying upright for 30 minutes before food. Weekly and monthly packs are easy to take daily by mistake — check.',
         ar:'على معدة فارغة مع كأس ماء عادي كامل، مع البقاء منتصباً 30 دقيقة قبل الطعام. العبوات الأسبوعية والشهرية قد تؤخذ خطأً يومياً — تحقّق.'},
  ci:['oesophagus', 'hypoCa', 'renalSevere'],
  ask:['upright', 'swallow', 'dental'] },

{ sci:'Ibandronic acid', ar:'حمض الإيباندرونيك', atc:'M05BA06', cat:'msk.bone', form:'tablet',
  doses:['150 mg monthly', '50 mg', '3 mg/3 mL injection every 3 months', '6 mg/6 mL (cancer)'], brand:['Bonviva', 'Bondronat'], aka:['Ibandronate'],
  tags:['chelatableMild'], take:['beforeBreakfast'],
  notes:{en:'The monthly tablet: on the same date each month, fasting, with plain water, upright for an hour before food. The injection is every three months.',
         ar:'القرص الشهري: في التاريخ نفسه كل شهر، صائماً، مع ماء عادي، منتصباً لمدة ساعة قبل الطعام. الحقنة كل ثلاثة أشهر.'},
  ci:['oesophagus', 'hypoCa'],
  ask:['upright', 'dental', 'kidney'] },

{ sci:'Zoledronic acid', ar:'حمض الزوليدرونيك', atc:'M05BA08', cat:'msk.bone', form:'injection',
  doses:['5 mg/100 mL yearly', '4 mg/5 mL (cancer)'], brand:['Aclasta', 'Zometa'],
  tags:['nephrotoxic'],
  notes:{en:'An infusion once a year for osteoporosis (every 3–4 weeks in cancer). Drink well beforehand; flu-like symptoms for a few days are common. A dental check first, with calcium and vitamin D alongside.',
         ar:'تسريب مرة في السنة لهشاشة العظام (كل 3–4 أسابيع في السرطان). اشرب جيداً قبله؛ أعراض تشبه الإنفلونزا لبضعة أيام شائعة. فحص الأسنان أولاً، مع الكالسيوم وفيتامين د.'},
  ci:['hypoCa', {en:'Creatinine clearance below 35 mL/min', ar:'تصفية كرياتينين أقل من 35 مل/دقيقة'}],
  ask:['kidney', 'dental', 'labs'] },

{ sci:'Denosumab', ar:'دينوسوماب', atc:'M05BX04', cat:'msk.bone', form:'injection',
  doses:['60 mg every 6 months', '120 mg monthly (Xgeva)'], brand:['Prolia', 'Xgeva'],
  notes:{en:'An injection every six months — never late, and never stopped without a plan: bone loss and fractures rebound quickly. Calcium and vitamin D alongside; a dental check first.',
         ar:'حقنة كل ستة أشهر — لا تتأخر أبداً، ولا تُوقف دون خطة: فقدان العظم والكسور يرتدّان بسرعة. مع الكالسيوم وفيتامين د؛ وفحص الأسنان أولاً.'},
  ix:[
    ['#immunosuppressant', W, 'Higher risk of infections.', 'خطر أعلى للالتهابات.']
  ],
  ci:['hypoCa'],
  ask:['dental', 'kidney', 'labs'] },

{ sci:'Teriparatide', ar:'تيريباراتايد', atc:'H05AA02', cat:'msk.bone', form:'injection',
  doses:['20 microgram/day pen'], brand:['Forsteo', 'Forteo'],
  notes:{en:'A daily injection for up to two years; keep the pen in the fridge. Dizziness on standing after the first doses — inject sitting or lying down at first.',
         ar:'حقنة يومية لمدة تصل إلى سنتين؛ يُحفظ القلم في الثلاجة. دوخة عند الوقوف بعد الجرعات الأولى — احقن جالساً أو مستلقياً في البداية.'},
  ix:[
    ['Digoxin', W, 'A passing rise in calcium can make digoxin toxic.', 'ارتفاع عابر في الكالسيوم قد يجعل الديجوكسين ساماً.']
  ],
  ci:['hyperCa', 'renalSevere', {en:'Paget’s disease or previous radiotherapy to bone', ar:'داء باجيت أو علاج إشعاعي سابق للعظام'}],
  ask:['injectTech', 'cold', 'stones'] },

{ sci:'Raloxifene', ar:'رالوكسيفين', atc:'G03XC01', cat:'msk.bone', form:'tablet',
  doses:['60 mg'], brand:['Evista'],
  notes:{en:'Once a day. It raises the risk of clots in the legs and lungs — stop before long immobility or surgery. Hot flushes and leg cramps are common.',
         ar:'مرة واحدة يومياً. يرفع خطر الجلطات في الساقين والرئتين — يُوقف قبل عدم الحركة الطويل أو الجراحة. الهبّات الساخنة وتشنّجات الساق شائعة.'},
  ix:[
    ['Colestyramine', S, 'Blocks raloxifene absorption — do not combine.', 'يمنع امتصاص الرالوكسيفين — لا يُجمعان.'],
    ['Warfarin', W, 'May lower the INR slightly.', 'قد يخفض INR قليلاً.'],
    ['Estradiol', W, 'Not used with oestrogen therapy.', 'لا يُستعمل مع العلاج بالإستروجين.']
  ],
  ci:['vte', 'vaginalBleeding', 'hepSevere'],
  ask:['clots', 'dental'] },

/* ---------- Rheumatoid arthritis (DMARDs) ---------- */
{ sci:'Methotrexate', ar:'ميثوتريكسيت', atc:'L04AX03', cat:'msk.dmard', form:'tablet',
  doses:['2.5 mg', '10 mg', '50 mg/2 mL'],
  tags:['methotrexate', 'immunosuppressant'], take:['weekly'],
  notes:{en:'ONCE A WEEK. A daily dose is a documented fatal error. Folic acid on a different day. Say the day of the week out loud when you hand it over.',
         ar:'ONCE A WEEK — الجرعة اليومية خطأ قاتل ومسجّل. حمض الفوليك بيوم مختلف. اذكر يوم الأسبوع بصوت عالٍ عند الصرف.'},
  ix:[
    ['Trimethoprim/Sulfamethoxazole', C, 'Severe marrow suppression — the combination is contraindicated.', 'تثبيط نقي شديد — ممنوع الجمع.'],
    ['Ibuprofen', S, 'Reduces methotrexate clearance, raising toxicity.', 'يقلّل طرح الميثوتريكسيت ويزيد سميّته.'],
    ['Amoxicillin', S, 'Reduces renal clearance.', 'يقلّل الطرح الكلوي.'],
    ['Omeprazole', W, 'Delays clearance at high doses.', 'يؤخّر الطرح مع الجرعات العالية.']
  ],
  ci:['pregBf', 'hepRenalSevere', 'marrow', 'infection'],
  ask:['weekly', 'labs', 'pregTest'] },

{ sci:'Hydroxychloroquine', ar:'هيدروكسي كلوروكين', atc:'P01BA02', cat:'msk.dmard', form:'tablet',
  doses:['200 mg', '400 mg'], brand:['Plaquenil'],
  tags:['qt'], take:['withFood'],
  notes:{en:'With food. Eye checks for the retina — yearly after five years of use. It can lower blood sugar. Keep it away from children: overdose is dangerous.',
         ar:'مع الطعام. فحص شبكية العين — سنوياً بعد خمس سنوات من الاستعمال. قد يخفض سكر الدم. أبعده عن الأطفال: الجرعة الزائدة خطيرة.'},
  ci:['qt', {en:'Existing damage to the macula', ar:'اعتلال بقعي سابق'}],
  ask:['vision', 'rhythm', 'diabetes'] },

{ sci:'Leflunomide', ar:'ليفلونومايد', atc:'L04AA13', cat:'msk.dmard', form:'tablet',
  doses:['10 mg', '20 mg', '100 mg loading'], brand:['Arava'],
  tags:['immunosuppressant'],
  notes:{en:'Blood counts, liver tests and blood pressure are checked. It causes birth defects and stays in the body for up to two years — a wash-out exists. Keep alcohol low.',
         ar:'يُفحص تعداد الدم ووظائف الكبد والضغط. يسبّب تشوّهات للجنين ويبقى في الجسم حتى سنتين — وتوجد طريقة لطرحه. قلّل الكحول.'},
  ci:['pregTeratogen', 'hepActive', 'seriousInfection', 'marrow'],
  ask:['pregTest', 'liver', 'alcohol'] },

{ sci:'Tofacitinib', ar:'توفاسيتينيب', atc:'L04AF01', cat:'msk.dmard', form:'tablet',
  doses:['5 mg', '11 mg XR'], brand:['Xeljanz'],
  tags:['immunosuppressant', 'sub3a4'],
  notes:{en:'Twice a day. Infections, including shingles, are more likely; clots and heart problems are a risk in older smokers. Tuberculosis is checked for first.',
         ar:'مرتين يومياً. العدوى، ومنها الحزام الناري، أكثر احتمالاً؛ والجلطات ومشاكل القلب خطر عند المدخنين الأكبر سناً. يُفحص السل قبل البدء.'},
  ci:['seriousInfection', 'hepSevere'],
  ask:['infection', 'clots', 'smoke'] },

{ sci:'Baricitinib', ar:'باريسيتينيب', atc:'L04AF02', cat:'msk.dmard', form:'tablet',
  doses:['2 mg', '4 mg'], brand:['Olumiant'],
  tags:['immunosuppressant'],
  notes:{en:'Once a day. More infections, including shingles; clots are a risk. Tuberculosis is checked for first; the dose is lowered in kidney impairment.',
         ar:'مرة واحدة يومياً. عدوى أكثر، ومنها الحزام الناري؛ والجلطات خطر. يُفحص السل قبل البدء؛ وتُخفّض الجرعة في القصور الكلوي.'},
  ci:['seriousInfection', 'preg'],
  ask:['infection', 'clots', 'kidney'] },

{ sci:'Upadacitinib', ar:'أوباداسيتينيب', atc:'L04AF03', cat:'msk.dmard', form:'tablet',
  doses:['15 mg', '30 mg', '45 mg'], brand:['Rinvoq'],
  tags:['immunosuppressant', 'sub3a4'],
  notes:{en:'Once a day, swallowed whole. More infections and clots; it causes birth defects — contraception during and for four weeks after.',
         ar:'مرة واحدة يومياً، يُبلع كاملاً. عدوى وجلطات أكثر؛ ويسبّب تشوّهات للجنين — منع الحمل أثناء العلاج و4 أسابيع بعده.'},
  ci:['seriousInfection', 'pregTeratogen', 'hepSevere'],
  ask:['infection', 'clots', 'pregTest'] },

{ sci:'Penicillamine', ar:'بنسيلامين', atc:'M01CC01', cat:'msk.dmard', form:'tablet',
  doses:['125 mg', '250 mg'], brand:['Cuprimine', 'Distamine'],
  tags:['chelatable'], take:['emptyStomach'],
  notes:{en:'For Wilson’s disease and some arthritis: on an empty stomach, apart from iron, zinc and antacids. Blood counts and urine tests are regular; report rash, fever or mouth ulcers.',
         ar:'لمرض ويلسون وبعض أنواع التهاب المفاصل: على معدة فارغة، بعيداً عن الحديد والزنك ومضادات الحموضة. تعداد الدم وتحليل البول منتظمان؛ أبلغ عن الطفح أو الحرارة أو قروح الفم.'},
  ci:['penAllergy', 'marrow', {en:'Lupus', ar:'الذئبة'}],
  ask:['labs', 'allergyPen', 'antacids'] },

/* ---------- Pain rubs and gels ---------- */

{ sci:'Methyl salicylate', ar:'ساليسيلات الميثيل', atc:'M02AC', cat:'msk.topical', form:'cream',
  doses:['cream or ointment with menthol'], brand:['Bengay', 'Deep Heat'], aka:['Wintergreen oil'],
  notes:{en:'Rub in gently on unbroken skin; never under a tight bandage or heat pad. Keep away from children — swallowed, it is poisonous.',
         ar:'يُدلك بلطف على جلد سليم؛ لا يوضع أبداً تحت ضماد محكم أو وسادة حرارية. أبعده عن الأطفال — ابتلاعه سام.'},
  ix:[
    ['Warfarin', W, 'Large amounts on the skin can raise the INR.', 'الكميات الكبيرة على الجلد قد ترفع INR.']
  ],
  ci:['nsaidAsthma', 'under2'],
  ask:['thinner', 'allergyNsaid'] },

{ sci:'Menthol', ar:'منثول', atc:'M02AX', cat:'msk.topical', form:'cream',
  doses:['in rubs, balms and cough preparations'], aka:['Levomenthol'],
  notes:{en:'A cooling rub. Not on broken skin or near the eyes, and never on a baby’s face or nose.',
         ar:'دهان مُبرّد. لا يوضع على جلد مجروح أو قرب العينين، ولا أبداً على وجه الرضيع أو أنفه.'},
  ci:['under2'],
  ask:['childAge'] },

{ sci:'Camphor', ar:'كافور', atc:'M02AX', cat:'msk.topical', form:'ointment',
  doses:['in rubs and balms', 'with calamine lotion'], aka:['Camphora'],
  notes:{en:'A warming rub. Poisonous if swallowed, even in small amounts — keep it well away from children; not on babies.',
         ar:'دهان مُدفئ. سام إذا ابتُلع ولو بكمية قليلة — أبعده جيداً عن الأطفال؛ ولا يوضع على الرضّع.'},
  ci:['under2'],
  ask:['childAge'] },

{ sci:'Capsaicin', ar:'كابسيسين', atc:'M02AB01', cat:'msk.topical', form:'cream',
  doses:['0.025%', '0.075% cream', '8% patch'], brand:['Zostrix', 'Qutenza'],
  notes:{en:'Burning at first is expected and fades with regular use, three or four times a day. Wash your hands afterwards and keep it away from the eyes.',
         ar:'الحرقة في البداية متوقعة وتخفّ مع الاستعمال المنتظم، ثلاث أو أربع مرات يومياً. اغسل يديك بعده وأبعده عن العينين.'},
  ci:[{en:'Broken or inflamed skin', ar:'الجلد المجروح أو الملتهب'}],
  ask:['skinSite'] },

{ sci:'Etofenamate', ar:'إيتوفينامات', atc:'M02AA06', cat:'msk.topical', form:'gel',
  doses:['5% gel', '10% gel', '1 g/2 mL injection'], brand:['Rheumon', 'Traumon'],
  notes:{en:'Rub the gel over the painful area two to four times a day; not on broken skin or near the eyes.',
         ar:'يُدلك الهلام على المنطقة المؤلمة مرتين إلى أربع مرات يومياً؛ لا يوضع على جلد مجروح أو قرب العينين.'},
  ci:['preg3', 'nsaidAsthma'],
  ask:['allergyNsaid', 'skinSite'] },

{ sci:'Diclofenac (topical)', ar:'ديكلوفيناك (موضعي)', atc:'M02AA15', cat:'msk.topical', form:'gel',
  doses:['1% gel', '2.32% gel (12-hourly)', '1% emulgel', '140 mg plaster', '4% spray gel'], brand:['Voltaren Emulgel', 'Flector'], aka:['Diclofenac gel', 'Diclofenac diethylamine', 'Diclofenac emulgel'],
  notes:{en:'Rub gently into the painful joint or muscle three or four times a day, for up to two weeks unless the doctor says longer. Little reaches the blood, so it is the safer choice for local pain. Not on broken skin, and wash your hands after.',
         ar:'يُدلك بلطف على المفصل أو العضلة المؤلمة ثلاث أو أربع مرات يومياً، لمدة أقصاها أسبوعان ما لم يقل الطبيب غير ذلك. القليل منه يصل إلى الدم، لذا هو الخيار الأأمن للألم الموضعي. لا يوضع على جلد مجروح، واغسل يديك بعده.'},
  ci:['preg3', 'nsaidAsthma'],
  ask:['allergyNsaid', 'skinSite', 'preg'] },

{ sci:'Ibuprofen (topical)', ar:'إيبوبروفين (موضعي)', atc:'M02AA13', cat:'msk.topical', form:'gel',
  doses:['5% gel', '10% gel'], brand:['Ibugel', 'Nurofen gel'], aka:['Ibuprofen gel'],
  notes:{en:'Rub in up to three times a day for sprains and muscle pain; not on broken skin or near the eyes.',
         ar:'يُدلك حتى ثلاث مرات يومياً للالتواءات وآلام العضلات؛ لا يوضع على جلد مجروح أو قرب العينين.'},
  ci:['preg3', 'nsaidAsthma'],
  ask:['allergyNsaid', 'skinSite'] },

{ sci:'Ketoprofen (topical)', ar:'كيتوبروفين (موضعي)', atc:'M02AA10', cat:'msk.topical', form:'gel',
  doses:['2.5% gel'], brand:['Fastum', 'Oruvail gel'], aka:['Ketoprofen gel'],
  notes:{en:'Two or three times a day for up to a week. It can cause a severe sun rash: keep the treated skin covered from the sun, and off sunbeds, during use and for two weeks after.',
         ar:'مرتين أو ثلاثاً يومياً لمدة أقصاها أسبوع. قد يسبّب طفحاً شديداً مع الشمس: غطِّ الجلد المعالَج عن الشمس وأجهزة التسمير أثناء الاستعمال ولأسبوعين بعده.'},
  ci:['preg3', 'nsaidAsthma', {en:'Past sun or skin reaction to ketoprofen, fenofibrate or sunscreens', ar:'تفاعل ضوئي أو جلدي سابق مع الكيتوبروفين أو الفينوفايبرات أو واقيات الشمس'}],
  ask:['sun', 'allergyNsaid', 'skinSite'] },

{ sci:'Piroxicam (topical)', ar:'بيروكسيكام (موضعي)', atc:'M02AA07', cat:'msk.topical', form:'gel',
  doses:['0.5% gel'], brand:['Feldene gel'], aka:['Piroxicam gel'],
  notes:{en:'Rub in three or four times a day for local pain; not on broken skin, and avoid strong sun on the area.',
         ar:'يُدلك ثلاث أو أربع مرات يومياً للألم الموضعي؛ لا يوضع على جلد مجروح، وتجنّب الشمس القوية على المنطقة.'},
  ci:['preg3', 'nsaidAsthma'],
  ask:['allergyNsaid', 'skinSite'] },

/* ---------- Joint supplements and injections ---------- */

{ sci:'Glucosamine', ar:'غلوكوزامين', atc:'M01AX05', cat:'msk.joint', form:'sachet',
  doses:['1500 mg sachet', '500 mg capsule', 'with chondroitin'], brand:['Viartril-S', 'Dona'],
  notes:{en:'For osteoarthritis; any benefit takes weeks. It is made from shellfish, and can raise the INR with warfarin.',
         ar:'لخشونة المفاصل؛ وأي فائدة تحتاج أسابيع. مصنوع من المحار، وقد يرفع INR مع الوارفارين.'},
  ix:[
    ['Warfarin', S, 'Raises the INR.', 'يرفع INR.']
  ],
  ask:[{en:'Are you allergic to shellfish?', ar:'هل لديك حساسية من المحار؟'}, 'thinner', 'diabetes'] },

{ sci:'Chondroitin', ar:'كوندرويتين', atc:'M01AX25', cat:'msk.joint', form:'capsule',
  doses:['400 mg', '800 mg', 'with glucosamine'], brand:['Condrosulf', 'Structum'], aka:['Chondroitin sulfate'],
  notes:{en:'For osteoarthritis; benefit, if any, takes weeks.',
         ar:'لخشونة المفاصل؛ والفائدة، إن وُجدت، تحتاج أسابيع.'},
  ix:[
    ['Warfarin', W, 'May raise the INR.', 'قد يرفع INR.']
  ],
  ask:['thinner'] },

{ sci:'Diacerein', ar:'دياسيرين', atc:'M01AX21', cat:'msk.joint', form:'capsule',
  doses:['50 mg'], brand:['Artrodar', 'Art 50'],
  take:['withFood'],
  notes:{en:'With meals. Diarrhoea is common — stop if it is severe. Urine may turn yellow-brown. Not for people over 65.',
         ar:'مع الوجبات. الإسهال شائع — أوقفه إن كان شديداً. قد يصبح البول أصفر بنياً. لا يُستعمل فوق سن 65.'},
  ix:[
    ['#polyvalent', W, 'Antacids reduce its absorption — keep two hours apart.', 'مضادات الحموضة تقلّل امتصاصه — افصل بينهما ساعتين.']
  ],
  ci:['hep', {en:'Over 65 years of age', ar:'العمر فوق 65 سنة'}],
  ask:['liver', 'whoFor'] },

{ sci:'Hyaluronic acid', ar:'حمض الهيالورونيك', atc:'M09AX01', cat:'msk.joint', form:'injection',
  doses:['20 mg/2 mL', '60 mg/3 mL knee injection', '0.1–0.4% eye drops'], brand:['Synvisc', 'Hyalgan', 'Ostenil', 'Hylo'], aka:['Sodium hyaluronate', 'Hyaluronate'],
  notes:{en:'Knee injections are given by a doctor; rest the joint for a couple of days afterwards. The eye drops are for dry eyes.',
         ar:'حقن الركبة يعطيها الطبيب؛ أرِح المفصل يومين بعدها. قطرة العين لجفاف العين.'},
  ci:[{en:'Infection in or around the joint', ar:'التهاب في المفصل أو حوله'}],
  ask:['infection', 'thinner'] }

];
