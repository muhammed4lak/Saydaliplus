/* Antibiotics, part two: the other antibacterials (glycopeptides,
   linezolid, polymyxins, nitroimidazoles, urinary and topical-systemic
   agents) and tuberculosis. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Other antibiotics ---------- */
{ sci:'Metronidazole', ar:'ميترونيدازول', atc:'J01XD01', cat:'inf.antibacterial', form:'tablet',
  doses:['200 mg/5 mL', '250 mg', '500 mg'], brand:['Flagyl'],
  take:['afterFood', 'noAlcohol'],
  notes:{en:'No alcohol during the course or for 48 hours after — a disulfiram-like reaction. A metallic taste is common and harmless.',
         ar:'ممنوع الكحول أثناء الكورس ولمدة 48 ساعة بعده — تفاعل شبيه بالديسلفيرام. طعم معدني شائع وغير مقلق.'},
  ix:[
    ['Warfarin', S, 'Markedly raises INR.', 'يرفع INR بوضوح.'],
    ['Lithium', S, 'Raises lithium to toxic levels.', 'يرفع الليثيوم إلى حدّ السميّة.'],
    ['Alcohol', S, 'Flushing, vomiting and palpitations (disulfiram-like) — no alcohol during and for 48 hours after.', 'احمرار وتقيؤ وخفقان (تفاعل شبيه بالديسلفيرام) — لا كحول أثناء العلاج و48 ساعة بعده.']
  ],
  ci:[{en:'High doses in the first trimester', ar:'الثلث الأول من الحمل بالجرعات العالية'}, 'alcohol'],
  ask:['alcohol', 'preg', 'thinner'] },

{ sci:'Nitrofurantoin', ar:'نيتروفورانتوين', atc:'J01XE01', cat:'inf.antibacterial', form:'capsule',
  doses:['50 mg', '100 mg'], brand:['Macrodantin', 'Furadantin'],
  take:['withFood'],
  notes:{en:'With food. Brown urine is expected and harmless. No use in kidney infection — it only works in the bladder.',
         ar:'مع الطعام. لون البول البنّي طبيعي ولا يستدعي القلق. لا يصلح لالتهاب الكلية — يعمل في المثانة فقط.'},
  ix:[
    ['Magnesium trisilicate', W, 'Reduces absorption — space the doses.', 'يقلّل الامتصاص — باعد بينهما.']
  ],
  ci:[{en:'Renal impairment (eGFR < 45)', ar:'قصور كلوي (eGFR < 45)'}, {en:'Pregnancy from 38 weeks to term', ar:'الحمل من الأسبوع 38 حتى الولادة'}, 'g6pd', {en:'Infants under 3 months', ar:'الرضّع دون 3 أشهر'}],
  ask:['kidney', 'preg', 'g6pd'] },

{ sci:'Trimethoprim/Sulfamethoxazole', ar:'تراي ميثوبريم/سلفاميثوكسازول', atc:'J01EE01', cat:'inf.antibacterial', form:'tablet',
  doses:['240 mg/5 mL', '480 mg', '960 mg'], brand:['Bactrim', 'Septrin'], aka:['Co-trimoxazole'],
  notes:{en:'With plenty of fluid. Its interactions are more dangerous than how ordinary it looks — check warfarin and methotrexate first.',
         ar:'مع كمية وفيرة من السوائل. تفاعلاته أخطر مما يوحي به شيوعه — راجع الوارفارين والميثوتريكسيت أولاً.'},
  ix:[
    ['Warfarin', C, 'Sharp rise in INR and bleeding — avoid the combination.', 'ارتفاع حاد في INR ونزف — يُتجنّب الجمع.'],
    ['Methotrexate', C, 'Severe marrow suppression — the combination is contraindicated.', 'تثبيط نقي شديد — ممنوع الجمع.'],
    ['Spironolactone', S, 'Dangerous hyperkalaemia.', 'فرط بوتاسيوم خطر.'],
    ['Lisinopril', S, 'Hyperkalaemia.', 'فرط بوتاسيوم.']
  ],
  ci:['sulfaAllergy', 'pregBf', 'g6pd', 'hepRenalSevere'],
  ask:['allergySulfa', 'g6pd', 'preg'] },

{ sci:'Vancomycin', ar:'فانكومايسين', atc:'J01XA01', cat:'inf.antibacterial', form:'injection',
  doses:['500 mg', '1 g vial', '125 mg and 250 mg capsule (gut only)'], brand:['Vancocin'],
  tags:['nephrotoxic', 'ototoxic'],
  notes:{en:'By slow infusion in hospital, with blood levels and kidney tests; a fast infusion causes flushing ("red man"). Capsules act only in the gut, for C. difficile colitis.',
         ar:'بتسريب بطيء في المستشفى، مع فحص المستوى في الدم ووظائف الكلى؛ التسريب السريع يسبّب احمراراً ("متلازمة الرجل الأحمر"). الكبسولات تعمل في الأمعاء فقط، لالتهاب القولون بالمطثية العسيرة.'},
  ci:['hearingLoss'],
  ask:['kidney', 'hearing', 'allergy'] },

{ sci:'Teicoplanin', ar:'تيكوبلانين', atc:'J01XA02', cat:'inf.antibacterial', form:'injection',
  doses:['200 mg', '400 mg vial'], brand:['Targocid'],
  tags:['nephrotoxic', 'ototoxic'],
  notes:{en:'A once-daily injection after loading doses, sometimes continued at home; kidney function and hearing are watched.',
         ar:'حقنة مرة واحدة يومياً بعد جرعات التحميل، وقد تُستكمل في البيت؛ تُراقب وظائف الكلى والسمع.'},
  ask:['kidney', 'hearing', 'allergy'] },

{ sci:'Linezolid', ar:'لينيزوليد', atc:'J01XX08', cat:'inf.antibacterial', form:'tablet',
  doses:['600 mg tablet', '600 mg/300 mL infusion', '100 mg/5 mL suspension'], brand:['Zyvox'],
  tags:['maoi'],
  notes:{en:'It acts as a weak MAO inhibitor: no large amounts of aged cheese or cured meat, and many antidepressants and cold remedies must be avoided. Courses over two weeks need blood counts; report vision changes or tingling.',
         ar:'يعمل كمثبط MAO ضعيف: لا كميات كبيرة من الأجبان المعتّقة أو اللحوم المقدّدة، ويجب تجنّب كثير من مضادات الاكتئاب وأدوية الزكام. الدورات الأطول من أسبوعين تحتاج تعداد دم؛ أبلغ عن تغيّر النظر أو الوخز.'},
  ix:[
    ['Tyramine-rich food', W, 'Large amounts can raise blood pressure.', 'الكميات الكبيرة قد ترفع الضغط.']
  ],
  ask:['antidep', 'labs', 'bp'] },

{ sci:'Colistin', ar:'كوليستين', atc:'J01XB01', cat:'inf.antibacterial', form:'injection',
  doses:['1 million IU', '2 million IU vial (colistimethate)', 'nebuliser'], brand:['Colomycin', 'Promixin'], aka:['Colistimethate sodium', 'Polymyxin E'],
  tags:['nephrotoxic'],
  notes:{en:'A last-line hospital antibiotic for resistant infections; kidney function is checked, and numbness or tingling around the mouth should be reported.',
         ar:'مضاد حيوي أخير الخط للمستشفى للعدوى المقاومة؛ تُفحص وظائف الكلى، ويُبلغ عن الخدر أو الوخز حول الفم.'},
  ci:['myasthenia'],
  ask:['kidney', 'myasthenia'] },

{ sci:'Polymyxin B', ar:'بوليميكسين B', atc:'J01XB02', cat:'inf.antibacterial', form:'ointment',
  doses:['in eye and ear drops and skin ointments', '500,000 units vial'], brand:['Polysporin'],
  tags:['nephrotoxic'],
  notes:{en:'Mostly an ingredient of eye, ear and skin preparations with other antibiotics; the injection is a last-line hospital drug.',
         ar:'غالباً مكوّن في قطرات العين والأذن ومراهم الجلد مع مضادات أخرى؛ والحقنة دواء أخير الخط للمستشفى.'},
  ci:['eardrum'],
  ask:['earDrum', 'allergy'] },

{ sci:'Fosfomycin', ar:'فوسفومايسين', atc:'J01XX01', cat:'inf.antibacterial', form:'sachet',
  doses:['3 g sachet', '2 g and 4 g vial'], brand:['Monurol'],
  take:['emptyStomach', 'bedtime'],
  notes:{en:'A single sachet for simple cystitis: dissolve in water and drink on an empty stomach at bedtime, after emptying the bladder.',
         ar:'كيس واحد لالتهاب المثانة البسيط: يُذاب في الماء ويُشرب على معدة فارغة قبل النوم بعد إفراغ المثانة.'},
  ci:['renal30'],
  ask:['preg', 'kidney', 'duration'] },

{ sci:'Trimethoprim', ar:'تراي ميثوبريم', atc:'J01EA01', cat:'inf.antibacterial', form:'tablet',
  doses:['100 mg', '200 mg', '50 mg/5 mL suspension'], brand:['Triprim', 'Monotrim'],
  notes:{en:'For urine infections, usually three days. It can raise potassium, especially with blood-pressure medicines. Not in early pregnancy.',
         ar:'لالتهابات البول، ثلاثة أيام عادة. قد يرفع البوتاسيوم، خاصة مع أدوية الضغط. لا يُستعمل في بداية الحمل.'},
  ix:[
    ['Methotrexate', C, 'Severe marrow suppression — avoid.', 'تثبيط نقي شديد — يُتجنّب.'],
    ['#raas', S, 'Raises potassium.', 'يرفع البوتاسيوم.'],
    ['#kSparing', S, 'Dangerous rise in potassium.', 'ارتفاع خطير في البوتاسيوم.']
  ],
  ci:['preg1', 'marrow', {en:'Folate-deficiency anaemia', ar:'فقر دم بعوز الفولات'}],
  ask:['preg', 'kidney', 'potassium'] },

{ sci:'Tinidazole', ar:'تينيدازول', atc:'J01XD02', cat:'inf.antibacterial', form:'tablet',
  doses:['500 mg'], brand:['Fasigyn'],
  take:['withFood'],
  notes:{en:'Often a single 2 g dose, with food. No alcohol during treatment and for three days after — it causes vomiting and flushing. A metallic taste is common.',
         ar:'غالباً جرعة واحدة 2 غم مع الطعام. لا كحول أثناء العلاج وثلاثة أيام بعده — يسبّب القيء والاحمرار. الطعم المعدني شائع.'},
  ix:[
    ['Alcohol', S, 'Flushing, vomiting and palpitations — none for 72 hours after.', 'احمرار وقيء وخفقان — لا كحول لمدة 72 ساعة بعده.'],
    ['Warfarin', S, 'Raises the INR.', 'يرفع INR.']
  ],
  ci:['preg1'],
  ask:['alcohol', 'preg', 'thinner'] },

{ sci:'Secnidazole', ar:'سيكنيدازول', atc:'P01AB07', cat:'inf.antibacterial', form:'sachet',
  doses:['1 g', '2 g granules'], brand:['Flagentyl', 'Solosec'],
  notes:{en:'A single dose for bacterial vaginosis or amoebiasis, sprinkled on soft food. No alcohol for two days after.',
         ar:'جرعة واحدة للالتهاب المهبلي الجرثومي أو الأميبا، تُنثر على طعام لين. لا كحول ليومين بعدها.'},
  ix:[
    ['Alcohol', S, 'Flushing and vomiting — none for 48 hours after.', 'احمرار وقيء — لا كحول لمدة 48 ساعة بعده.']
  ],
  ci:['preg1'],
  ask:['alcohol', 'preg'] },

{ sci:'Ornidazole', ar:'أورنيدازول', atc:'J01XD03', cat:'inf.antibacterial', form:'tablet',
  doses:['500 mg', '500 mg/100 mL infusion'], brand:['Tiberal'],
  take:['afterFood'],
  notes:{en:'After meals. Dizziness and drowsiness can occur. Avoid alcohol while taking it.',
         ar:'بعد الوجبات. قد يسبّب الدوخة والنعاس. تجنّب الكحول أثناء استعماله.'},
  ix:[
    ['Warfarin', S, 'Raises the INR.', 'يرفع INR.']
  ],
  ci:['preg1', 'epilepsy'],
  ask:['alcohol', 'preg', 'thinner'] },

{ sci:'Chloramphenicol', ar:'كلورامفينيكول', atc:'J01BA01', cat:'inf.antibacterial', form:'drops',
  doses:['0.5% eye drops', '1% eye ointment', '250 mg capsule', '1 g vial'], brand:['Chloromycetin', 'Optrex Infected Eyes'],
  notes:{en:'Mostly eye drops: every two hours for two days, then less often, for five days in all. By mouth or injection it can rarely wipe out the marrow and is reserved for serious infections.',
         ar:'في الغالب قطرة عين: كل ساعتين ليومين ثم أقل، لخمسة أيام إجمالاً. بالفم أو الحقن قد يُفني نقي العظم نادراً، فيُحصر في الالتهابات الخطيرة.'},
  ci:['marrow', {en:'Neonates (grey baby syndrome) — systemic use', ar:'حديثو الولادة (متلازمة الطفل الرمادي) — الاستعمال الجهازي'}],
  ask:['contactLens', 'eyeRedFlags', 'childAge'] },

{ sci:'Fusidic acid', ar:'حمض الفوسيديك', atc:'J01XC01', cat:'inf.antibacterial', form:'tablet',
  doses:['250 mg tablet (sodium fusidate)', '250 mg/5 mL suspension', '500 mg vial'], brand:['Fucidin'], aka:['Sodium fusidate', 'Fucidic acid'],
  notes:{en:'Tablets and injections are for serious staphylococcal infections, usually with another antibiotic, and must never be combined with a statin. The liver is checked on long courses.',
         ar:'الأقراص والحقن لالتهابات العنقوديات الخطيرة، مع مضاد حيوي آخر عادة، ولا تُجمع أبداً مع ستاتين. يُفحص الكبد في الدورات الطويلة.'},
  ix:[
    ['#statin', C, 'Rhabdomyolysis, sometimes fatal — stop the statin for the course and a week after.', 'انحلال عضلات قد يكون مميتاً — يُوقف الستاتين طوال الدورة وأسبوعاً بعدها.']
  ],
  ci:['hepSevere'],
  ask:['statin', 'liver', 'otherMeds'] },

{ sci:'Sulfadiazine', ar:'سلفاديازين', atc:'J01EC02', cat:'inf.antibacterial', form:'tablet',
  doses:['500 mg'],
  notes:{en:'Used with pyrimethamine for toxoplasmosis. Drink plenty to protect the kidneys; report rash, fever or sore throat.',
         ar:'يُستعمل مع البيريميثامين لداء المقوّسات. اشرب كثيراً لحماية الكلى؛ أبلغ عن الطفح أو الحرارة أو التهاب الحلق.'},
  ci:['sulfaAllergy', 'g6pd', 'porphyria'],
  ask:['allergySulfa', 'g6pd', 'kidney'] },

{ sci:'Daptomycin', ar:'داباتومايسين', atc:'J01XX09', cat:'inf.antibacterial', form:'injection',
  doses:['350 mg', '500 mg vial'], brand:['Cubicin'],
  notes:{en:'A hospital antibiotic for resistant staphylococci; muscle enzymes are checked — report muscle pain or weakness.',
         ar:'مضاد حيوي للمستشفى للعنقوديات المقاومة؛ تُفحص إنزيمات العضلات — أبلغ عن ألم العضلات أو ضعفها.'},
  ix:[
    ['#statin', W, 'More muscle damage — consider pausing the statin.', 'أذية عضلية أكثر — فكّر بإيقاف الستاتين مؤقتاً.']
  ],
  ask:['statin', 'kidney'] },

/* ---------- Tuberculosis and leprosy ---------- */

{ sci:'Isoniazid', ar:'أيزونيازيد', atc:'J04AC01', cat:'inf.tb', form:'tablet',
  doses:['100 mg', '300 mg', 'with rifampicin (and pyrazinamide, ethambutol)'], brand:['Isozide', 'Rimifon'], aka:['INH'],
  take:['emptyStomach'],
  notes:{en:'On an empty stomach, every day for the whole course. Pyridoxine is usually given with it to prevent tingling in the hands and feet. Report nausea, dark urine or yellowing (liver). No alcohol.',
         ar:'على معدة فارغة، كل يوم طوال الدورة. يُعطى معه البيريدوكسين عادة للوقاية من وخز اليدين والقدمين. أبلغ عن الغثيان أو غمق البول أو الاصفرار (الكبد). لا كحول.'},
  ix:[
    ['Phenytoin', S, 'Raises phenytoin.', 'يرفع الفينيتوين.'],
    ['Carbamazepine', S, 'Raises carbamazepine; more liver toxicity.', 'يرفع الكاربامازيبين؛ وسمّية كبدية أكثر.']
  ],
  ci:['hepActive'],
  ask:['liver', 'alcohol', 'otherMeds'] },

{ sci:'Rifamycin', ar:'ريفامايسين', atc:'J04AB03', cat:'inf.tb', form:'injection',
  doses:['250 mg vial', '1% ear drops', '200 mg modified-release tablet (travellers’ diarrhoea)'], brand:['Rifocin', 'Aemcolo'], aka:['Rifamycin SV'],
  notes:{en:'An older relative of rifampicin, used as an injection or locally; it turns urine, tears and sweat orange-red.',
         ar:'قريب أقدم للريفامبيسين، يُستعمل حقناً أو موضعياً؛ ويلوّن البول والدموع والعرق بالبرتقالي المحمر.'},
  ci:['hepSevere'],
  ask:['liver', 'contactLens'] },

{ sci:'Rifampicin', ar:'ريفامبيسين', atc:'J04AB02', cat:'inf.tb', form:'capsule',
  doses:['150 mg', '300 mg', '100 mg/5 mL', 'in combination tablets'], brand:['Rifadin', 'Rimactane'], aka:['Rifampin'],
  tags:['inducer'], take:['emptyStomach'],
  notes:{en:'On an empty stomach. It turns urine, sweat and tears orange and stains soft contact lenses. It stops many medicines working, including the pill — read the whole list.',
         ar:'على معدة فارغة. يلوّن البول والعرق والدموع بالبرتقالي ويصبغ العدسات اللاصقة اللينة. يُفقد أدوية كثيرة مفعولها، ومنها حبوب منع الحمل — اقرأ القائمة كلها.'},
  ci:['hepActive', {en:'Jaundice', ar:'اليرقان'}],
  ask:['otherMeds', 'ocp', 'liver'] },

{ sci:'Rifabutin', ar:'ريفابوتين', atc:'J04AB04', cat:'inf.tb', form:'capsule',
  doses:['150 mg'], brand:['Mycobutin'],
  tags:['inducer', 'sub3a4'],
  notes:{en:'Turns urine and body fluids orange-brown. It lowers the level of many medicines, though less than rifampicin. Report eye pain or blurred vision.',
         ar:'يلوّن البول وسوائل الجسم ببني برتقالي. يخفض مستوى أدوية كثيرة، وإن أقل من الريفامبيسين. أبلغ عن ألم العين أو تشوّش الرؤية.'},
  ask:['otherMeds', 'ocp', 'vision'] },

{ sci:'Rifapentine', ar:'ريفابنتين', atc:'J04AB05', cat:'inf.tb', form:'tablet',
  doses:['150 mg'], brand:['Priftin'],
  tags:['inducer'],
  notes:{en:'Used weekly with isoniazid to treat latent TB. Turns body fluids orange-red and weakens many medicines, including the pill.',
         ar:'يُستعمل أسبوعياً مع الأيزونيازيد لعلاج السل الكامن. يلوّن سوائل الجسم ببرتقالي محمر ويُضعف أدوية كثيرة، ومنها حبوب منع الحمل.'},
  ask:['otherMeds', 'ocp', 'liver'] },

{ sci:'Pyrazinamide', ar:'بيرازيناميد', atc:'J04AK01', cat:'inf.tb', form:'tablet',
  doses:['400 mg', '500 mg'], brand:['Zinamide'],
  notes:{en:'For the first two months of TB treatment. It raises uric acid (gout attacks) and can affect the liver — report joint pain, nausea or yellowing.',
         ar:'للشهرين الأولين من علاج السل. يرفع حمض البول (نوبات النقرس) وقد يؤثر في الكبد — أبلغ عن ألم المفاصل أو الغثيان أو الاصفرار.'},
  ci:['hepSevere', 'porphyria'],
  ask:['liver', 'gout', 'diabetes'] },

{ sci:'Ethambutol', ar:'إيثامبوتول', atc:'J04AK02', cat:'inf.tb', form:'tablet',
  doses:['100 mg', '400 mg'], brand:['Myambutol'],
  notes:{en:'Report any change in vision or colour vision at once — it can damage the optic nerve. The dose is lowered in kidney impairment.',
         ar:'أبلغ فوراً عن أي تغيّر في الرؤية أو رؤية الألوان — قد يؤذي العصب البصري. تُخفّض الجرعة في القصور الكلوي.'},
  ci:[{en:'Optic neuritis', ar:'التهاب العصب البصري'}],
  ask:['vision', 'kidney'] },

{ sci:'Streptomycin', ar:'ستربتومايسين', atc:'J01GA01', cat:'inf.tb', form:'injection',
  doses:['1 g vial'],
  tags:['nephrotoxic', 'ototoxic'],
  notes:{en:'A daily injection in some TB regimens and for plague or brucellosis; hearing, balance and kidneys are monitored.',
         ar:'حقنة يومية في بعض أنظمة علاج السل وللطاعون أو الحمى المالطية؛ يُراقب السمع والتوازن والكلى.'},
  ci:['myasthenia', 'preg'],
  ask:['hearing', 'kidney', 'preg'] },

{ sci:'Bedaquiline', ar:'بيداكيلين', atc:'J04AK05', cat:'inf.tb', form:'tablet',
  doses:['20 mg', '100 mg'], brand:['Sirturo'],
  tags:['qt', 'sub3a4', 'inducerSensitive'], take:['withFood'],
  notes:{en:'For drug-resistant TB, with food. It prolongs QT — ECGs are done; report palpitations or fainting. No alcohol.',
         ar:'للسل المقاوم، مع الطعام. يطيل QT — يُجرى تخطيط القلب؛ أبلغ عن الخفقان أو الإغماء. لا كحول.'},
  ci:['qt'],
  ask:['rhythm', 'liver', 'otherMeds'] },

{ sci:'Delamanid', ar:'ديلامانيد', atc:'J04AK06', cat:'inf.tb', form:'tablet',
  doses:['50 mg'], brand:['Deltyba'],
  tags:['qt', 'inducerSensitive'], take:['withFood'],
  notes:{en:'For drug-resistant TB, twice a day with food. It prolongs QT — ECGs are done.',
         ar:'للسل المقاوم، مرتين يومياً مع الطعام. يطيل QT — يُجرى تخطيط القلب.'},
  ci:['qt'],
  ask:['rhythm', 'otherMeds'] },

{ sci:'Pretomanid', ar:'بريتومانيد', atc:'J04AK08', cat:'inf.tb', form:'tablet',
  doses:['200 mg'], brand:['Dovprela'],
  tags:['qtPossible'], take:['withFood'],
  notes:{en:'With bedaquiline and linezolid for resistant TB; liver tests and blood counts are checked. No alcohol.',
         ar:'مع البيداكيلين واللينيزوليد للسل المقاوم؛ تُفحص وظائف الكبد وتعداد الدم. لا كحول.'},
  ask:['liver', 'rhythm', 'alcohol'] },

{ sci:'Cycloserine', ar:'سيكلوسيرين', atc:'J04AB01', cat:'inf.tb', form:'capsule',
  doses:['250 mg'], brand:['Seromycin'],
  notes:{en:'For resistant TB. It can cause low mood, anxiety, confusion or fits — report any change. No alcohol.',
         ar:'للسل المقاوم. قد يسبّب انخفاض المزاج أو القلق أو التشوّش أو الاختلاج — أبلغ عن أي تغيّر. لا كحول.'},
  ci:['epilepsy', {en:'Depression or psychosis', ar:'الاكتئاب أو الذهان'}, 'renalSevere'],
  ask:['mood', 'epilepsy', 'alcohol'] },

{ sci:'Prothionamide', ar:'بروثيوناميد', atc:'J04AD01', cat:'inf.tb', form:'tablet',
  doses:['250 mg'],
  notes:{en:'For resistant TB. Nausea and a metallic taste are common; it can lower thyroid function and blood sugar.',
         ar:'للسل المقاوم. الغثيان والطعم المعدني شائعان؛ وقد يخفض وظيفة الدرق وسكر الدم.'},
  ci:['hepSevere'],
  ask:['liver', 'diabetes', 'thyroid'] },

{ sci:'Aminosalicylic acid', ar:'حمض الأمينوساليسيليك', atc:'J04AA01', cat:'inf.tb', form:'sachet',
  doses:['4 g granules'], brand:['PASER'], aka:['Para-aminosalicylic acid', 'PAS'],
  notes:{en:'Granules sprinkled on acidic food or juice for resistant TB. Stomach upset is common; it can lower thyroid function.',
         ar:'حبيبات تُنثر على طعام أو عصير حمضي للسل المقاوم. اضطراب المعدة شائع؛ وقد يخفض وظيفة الدرق.'},
  ask:['thyroid', 'liver'] },

{ sci:'Clofazimine', ar:'كلوفازيمين', atc:'J04BA01', cat:'inf.tb', form:'capsule',
  doses:['50 mg', '100 mg'], brand:['Lamprene'],
  tags:['qt'], take:['withFood'],
  notes:{en:'For leprosy and resistant TB, with food. It turns skin and body fluids reddish-brown, slowly fading after stopping.',
         ar:'للجذام والسل المقاوم، مع الطعام. يلوّن الجلد وسوائل الجسم ببني محمر، ويزول ببطء بعد الإيقاف.'},
  ask:['rhythm', 'sun'] },

{ sci:'Dapsone', ar:'دابسون', atc:'J04BA02', cat:'inf.tb', form:'tablet',
  doses:['50 mg', '100 mg', '5% gel'], brand:['Aczone'],
  notes:{en:'For leprosy, some skin diseases and pneumocystis prevention. It can break down red cells (worse with G6PD deficiency) — report breathlessness, blue lips, fever or sore throat.',
         ar:'للجذام وبعض أمراض الجلد والوقاية من المتكيسة الرئوية. قد يحلّ الكريات الحمر (أسوأ مع عوز G6PD) — أبلغ عن ضيق النفس أو زرقة الشفتين أو الحرارة أو التهاب الحلق.'},
  ci:['g6pd', 'porphyria', 'sulfaAllergy'],
  ask:['g6pd', 'allergySulfa', 'labs'] },

{ sci:'Isoniazid/Rifampicin', ar:'أيزونيازيد/ريفامبيسين', atc:'J04AM02', cat:'inf.tb', form:'tablet',
  doses:['75/150 mg', '150/300 mg', 'with pyrazinamide and ethambutol (4-drug tablets)'], brand:['Rifinah', 'Isofampicin'], aka:['Rifampicin and isoniazid'],
  tags:['inducer'], take:['emptyStomach'],
  notes:{en:'TB tablets on an empty stomach, every day for the whole course — missed doses breed resistance. Urine, tears and sweat turn orange-red. It stops the pill working. Report yellow eyes, dark urine or tingling feet.',
         ar:'أقراص السل على معدة فارغة، كل يوم طوال الدورة — الجرعات المنسية تولّد مقاومة. يتلوّن البول والدموع والعرق بالبرتقالي المحمر. يُبطل حبوب منع الحمل. أبلغ عن اصفرار العينين أو البول الداكن أو تنميل القدمين.'},
  ix:[
    ['#hormonalContraceptive', S, 'The pill fails — use another method.', 'تفشل حبوب منع الحمل — استعملي وسيلة أخرى.'],
    ['Warfarin', S, 'Much weaker warfarin — INR checks.', 'وارفارين أضعف بكثير — فحوص INR.']
  ],
  ci:['hepActive'],
  ask:['liver', 'ocp', 'alcohol'] }

];
