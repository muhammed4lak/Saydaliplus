/* Neurology: epilepsy and nerve pain, Parkinson's disease, dementia, vertigo
   and motion sickness, memory and cerebral circulation, multiple sclerosis
   and neuromuscular disease. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Epilepsy and nerve pain ---------- */
{ sci:'Carbamazepine', ar:'كاربامازيبين', atc:'N03AF01', cat:'cns.epilepsy', form:'tablet',
  doses:['100 mg/5 mL', '200 mg', '400 mg'], brand:['Tegretol'],
  tags:['inducer', 'sub3a4'], take:['withFood'],
  notes:{en:'A powerful enzyme inducer — it undermines the contraceptive pill and much else. A rash in the first weeks means stop immediately.',
         ar:'محرّض إنزيمي قوي يُضعف حبوب منع الحمل وكثيراً غيرها. طفح جلدي في الأسابيع الأولى يستوجب التوقف الفوري.'},
  ix:[
    ['Warfarin', S, 'Lowers INR and loses the protection.', 'يخفض INR ويفقد الحماية.'],
    ['Clarithromycin', S, 'Raises carbamazepine to toxic levels.', 'يرفع الكاربامازيبين إلى حدّ السميّة.'],
    ['Rivaroxaban', S, 'Lowers levels and loses the protection.', 'يخفض المستوى ويفقد الحماية.'],
    ['Sertraline', W, 'Reduces sertraline’s effect.', 'يقلّل فعالية السيرترالين.']
  ],
  ci:[{en:'Atrioventricular block', ar:'حصار أذيني بطيني'}, {en:'Previous bone marrow depression', ar:'تثبيط نقي عظم سابق'}, 'porphyria'],
  ask:['rash', 'ocp', 'labs'] },

{ sci:'Sodium valproate', ar:'فالبروات الصوديوم', atc:'N03AG01', cat:'cns.epilepsy', form:'tablet',
  doses:['200 mg', '500 mg', '200 mg/5 mL'], brand:['Depakine', 'Epilim'], aka:['Valproic acid', 'Valproate'],
  take:['afterFood'],
  notes:{en:'Contraindicated in pregnancy and in any woman of childbearing potential without a documented pregnancy-prevention plan — the malformation and neurodevelopmental risk is very high.',
         ar:'ممنوع في الحمل وعند أي امرأة في سنّ الإنجاب دون برنامج منع حمل موثّق — خطر تشوّه واضطراب نمو عصبي عالٍ جداً.'},
  ix:[
    ['Carbamazepine', S, 'Each one shifts the other’s level.', 'تغيّر متبادل في المستويات.'],
    ['Aspirin', S, 'Raises free valproate.', 'يرفع الفالبروات الحر.'],
    ['Lamotrigine', C, 'Doubles lamotrigine and the risk of a severe rash.', 'يضاعف اللاموتريجين وخطر الطفح الشديد.']
  ],
  ci:['preg', 'noPregPlan', 'hepActive', {en:'Urea cycle disorders', ar:'اضطرابات دورة اليوريا'}],
  ask:['pregTest', 'liver', 'labs'] },

{ sci:'Pregabalin', ar:'بريغابالين', atc:'N03AX16', cat:'cns.epilepsy', form:'capsule',
  doses:['25 mg', '75 mg', '150 mg', '300 mg'], brand:['Lyrica'],
  tags:['gabapentinoid', 'sedative'], controlled:true,
  notes:{en:'A controlled substance and widely misused. Not stopped abruptly. The dizziness and drowsiness of the first days settle.',
         ar:'مادة خاضعة للرقابة ويُساء استعمالها. لا يُوقف فجأة. الدوار والنعاس في الأيام الأولى يزولان.'},
  ix:[
    ['Tramadol', S, 'Respiratory depression and compounded sedation.', 'تثبيط تنفسي وتنويم مضاعف.'],
    ['Diazepam', S, 'Marked sedation.', 'تنويم شديد.']
  ],
  ask:['prescription', 'sedatives', 'kidney'] },

{ sci:'Phenobarbital', ar:'فينوباربيتال', atc:'N03AA02', cat:'cns.epilepsy', form:'tablet',
  doses:['15 mg', '30 mg', '60 mg', '100 mg'], brand:['Luminal', 'Gardenal'], aka:['Phenobarbitone'],
  tags:['inducer', 'sedative'], controlled:true,
  notes:{en:'A powerful enzyme inducer — it undermines the contraceptive pill and much else. Never stopped abruptly: status epilepticus.',
         ar:'محرّض إنزيمي قوي يُضعف حبوب منع الحمل وكثيراً غيرها. لا يُوقف فجأة — خطر حالة صرعية.'},
  ix:[
    ['Warfarin', S, 'Lowers INR and loses the protection.', 'يخفض INR ويفقد الحماية.'],
    ['Montelukast', W, 'Lowers montelukast levels.', 'يقلّل مستوى المونتيلوكاست.'],
    ['Diazepam', S, 'Compounded respiratory depression.', 'تثبيط تنفسي مضاعف.']
  ],
  ci:['porphyria', 'respInsufficiency', 'hepSevere'],
  ask:['prescription', 'ocp', 'sedatives'] },

{ sci:'Lamotrigine', ar:'لاموتريجين', atc:'N03AX09', cat:'cns.epilepsy', form:'tablet',
  doses:['25 mg', '50 mg', '100 mg', '200 mg'], brand:['Lamictal'],
  tags:['inducerSensitive'],
  notes:{en:'Titrated very slowly — going faster is what causes the serious rash. Any rash means stop and be seen the same day.',
         ar:'يُرفع ببطء شديد — التسريع هو سبب الطفح الخطير. أي طفح جلدي يعني التوقف والمراجعة فوراً.'},
  ix:[
    ['Sodium valproate', C, 'Doubles lamotrigine and the risk of a severe rash — halve the dose.', 'يضاعف اللاموتريجين وخطر الطفح الشديد — تُنصّف الجرعة.'],
    ['Carbamazepine', S, 'Lowers lamotrigine and loses control.', 'يخفض اللاموتريجين ويفقد السيطرة.']
  ],
  ci:[{en:'Previous severe rash with lamotrigine', ar:'طفح جلدي شديد سابق مع اللاموتريجين'}],
  ask:['rash', 'ocp', 'otherMeds'] },

{ sci:'Phenytoin', ar:'فينيتوين', atc:'N03AB02', cat:'cns.epilepsy', form:'capsule',
  doses:['30 mg/5 mL', '50 mg', '100 mg'], brand:['Epanutin', 'Dilantin'],
  tags:['inducer'],
  notes:{en:'Non-linear kinetics — a small dose rise moves the level a long way. Gum overgrowth is common: mouth care from day one.',
         ar:'حرائك غير خطية — زيادة صغيرة في الجرعة ترفع المستوى كثيراً. تضخّم اللثة شائع: العناية بالفم من يوم البدء.'},
  ix:[
    ['Warfarin', S, 'Unpredictable INR movement in both directions.', 'تغيّر غير متوقّع في INR في الاتجاهين.'],
    ['Folic acid', S, 'Lowers phenytoin levels.', 'يخفض مستوى الفينيتوين.'],
    ['Omeprazole', W, 'Raises phenytoin.', 'يرفع الفينيتوين.'],
    ['Trimethoprim/Sulfamethoxazole', S, 'Raises phenytoin to toxic levels.', 'يرفع الفينيتوين إلى حدّ السميّة.']
  ],
  ci:[{en:'Sinus bradycardia or heart block', ar:'بطء قلب جيبي أو حصار قلبي'}, 'porphyria'],
  ask:['labs', 'ocp', 'otherMeds'] },

{ sci:'Levetiracetam', ar:'ليفيتيراسيتام', atc:'N03AX14', cat:'cns.epilepsy', form:'tablet',
  doses:['250 mg', '500 mg', '750 mg', '1000 mg', '100 mg/mL solution', '500 mg/5 mL injection'], brand:['Keppra'],
  notes:{en:'Twice a day; never stop suddenly. Irritability, low mood or aggression can occur — report them. The dose is lowered in kidney impairment.',
         ar:'مرتين يومياً؛ لا يُوقف فجأة أبداً. قد يسبّب العصبية أو انخفاض المزاج أو العدوانية — أبلغ عنها. تُخفّض الجرعة في القصور الكلوي.'},
  ix:[
    ['Methotrexate', W, 'Can raise methotrexate levels.', 'قد يرفع مستوى الميثوتريكسيت.'],
    ['Alcohol', W, 'More drowsiness.', 'نعاس أكثر.']
  ],
  ask:['mood', 'kidney', 'preg'] },

{ sci:'Gabapentin', ar:'غابابنتين', atc:'N03AX12', cat:'cns.epilepsy', form:'capsule',
  doses:['100 mg', '300 mg', '400 mg capsule', '600 mg', '800 mg tablet'], brand:['Neurontin'],
  tags:['gabapentinoid', 'sedative'],
  notes:{en:'Built up slowly and never stopped suddenly. Drowsiness and dizziness — no driving until you know how it affects you. Keep two hours from antacids.',
         ar:'تُرفع الجرعة تدريجياً ولا يُوقف فجأة أبداً. النعاس والدوخة — لا قيادة حتى تعرف أثره عليك. افصل بينه وبين مضادات الحموضة ساعتين.'},
  ix:[
    ['Aluminium hydroxide', W, 'Reduces gabapentin absorption — two hours apart.', 'يقلّل امتصاص الغابابنتين — بفاصل ساعتين.'],
    ['Magnesium hydroxide', W, 'Reduces gabapentin absorption — two hours apart.', 'يقلّل امتصاص الغابابنتين — بفاصل ساعتين.']
  ],
  ask:['kidney', 'sedatives', 'drive'] },

{ sci:'Topiramate', ar:'توبيرامات', atc:'N03AX11', cat:'cns.epilepsy', form:'tablet',
  doses:['25 mg', '50 mg', '100 mg'], brand:['Topamax'],
  notes:{en:'Drink plenty of water — it can cause kidney stones. Tingling, poor concentration and weight loss are common. Sudden eye pain or blurred vision is urgent. It causes birth defects.',
         ar:'اشرب ماء كثيراً — قد يسبّب حصى الكلى. الوخز وضعف التركيز ونقص الوزن شائعة. ألم العين المفاجئ أو تشوّش الرؤية أمر طارئ. يسبّب تشوّهات للجنين.'},
  ix:[
    ['#hormonalContraceptive', S, 'At 200 mg a day or more, the pill becomes unreliable.', 'بجرعة 200 ملغ يومياً أو أكثر يصبح منع الحمل بالحبوب غير موثوق.']
  ],
  ci:['noPregPlan'],
  ask:['pregTest', 'stones', 'ocp'] },

{ sci:'Oxcarbazepine', ar:'أوكسكاربازيبين', atc:'N03AF02', cat:'cns.epilepsy', form:'tablet',
  doses:['150 mg', '300 mg', '600 mg', '60 mg/mL suspension'], brand:['Trileptal'],
  notes:{en:'Low sodium can cause headache, confusion or drowsiness — report these. A serious skin rash means stop and seek help. It makes the pill unreliable.',
         ar:'نقص الصوديوم قد يسبّب الصداع أو التشوّش أو النعاس — أبلغ عنها. الطفح الجلدي الشديد يستوجب الإيقاف وطلب المساعدة. يجعل حبوب منع الحمل غير موثوقة.'},
  ix:[
    ['#hormonalContraceptive', S, 'Makes hormonal contraception unreliable — use another method.', 'يجعل منع الحمل الهرموني غير موثوق — استعملي وسيلة أخرى.']
  ],
  ask:['rash', 'ocp', 'labs'] },

{ sci:'Lacosamide', ar:'لاكوساميد', atc:'N03AX18', cat:'cns.epilepsy', form:'tablet',
  doses:['50 mg', '100 mg', '150 mg', '200 mg', '10 mg/mL syrup', '200 mg/20 mL injection'], brand:['Vimpat'],
  notes:{en:'Twice a day. Dizziness and double vision are common. It slows conduction in the heart — report fainting or a slow pulse.',
         ar:'مرتين يومياً. الدوخة وازدواج الرؤية شائعان. يُبطئ التوصيل في القلب — أبلغ عن الإغماء أو بطء النبض.'},
  ix:[
    ['#bradycardic', W, 'Slows conduction in the heart (PR prolongation) — heart block risk with other drugs that do.', 'يبطئ التوصيل في القلب (إطالة PR) — خطر إحصار مع أدوية أخرى تفعل ذلك.']
  ],
  ci:['heartBlock'],
  ask:['rhythm', 'slowPulse', 'drive'] },

{ sci:'Clonazepam', ar:'كلونازيبام', atc:'N03AE01', cat:'cns.epilepsy', form:'tablet',
  doses:['0.5 mg', '2 mg', '2.5 mg/mL drops', '1 mg/mL injection'], brand:['Rivotril'],
  tags:['benzo', 'sedative'], controlled:true,
  notes:{en:'Drowsiness and unsteadiness — no driving. Habit-forming: stopped only gradually. Drops are counted carefully.',
         ar:'نعاس وعدم ثبات — لا قيادة. يسبّب الاعتياد: لا يُوقف إلا تدريجياً. تُعدّ النقط بدقة.'},
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia', 'hepSevere'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Clobazam', ar:'كلوبازام', atc:'N05BA09', cat:'cns.epilepsy', form:'tablet',
  doses:['10 mg'], brand:['Frisium'],
  tags:['benzo', 'sedative'], controlled:true,
  notes:{en:'Used alongside other epilepsy medicines. Drowsiness; habit-forming, stopped gradually.',
         ar:'يُستعمل مع أدوية صرع أخرى. يسبّب النعاس؛ ويسبّب الاعتياد، فيُوقف تدريجياً.'},
  ci:['myasthenia', 'respInsufficiency', 'sleepApnoea'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Ethosuximide', ar:'إيثوسوكسيميد', atc:'N03AD01', cat:'cns.epilepsy', form:'capsule',
  doses:['250 mg capsule', '250 mg/5 mL syrup'], brand:['Zarontin'],
  tags:['inducerSensitive'],
  notes:{en:'For absence seizures. Nausea and hiccups are common. Report fever, sore throat or bruising.',
         ar:'لنوبات الغياب. الغثيان والفواق شائعان. أبلغ عن الحرارة أو التهاب الحلق أو الكدمات.'},
  ci:['porphyria'],
  ask:['labs', 'infection'] },

{ sci:'Vigabatrin', ar:'فيغاباترين', atc:'N03AG04', cat:'cns.epilepsy', form:'tablet',
  doses:['500 mg tablet', '500 mg sachet'], brand:['Sabril'],
  notes:{en:'It can permanently narrow the field of vision — visual-field tests every six months. Drowsiness and weight gain are common.',
         ar:'قد يُضيّق مجال الرؤية بشكل دائم — فحص مجال الرؤية كل ستة أشهر. النعاس وزيادة الوزن شائعان.'},
  ix:[
    ['Phenytoin', W, 'Lowers phenytoin levels.', 'يخفض مستوى الفينيتوين.']
  ],
  ask:['vision', 'mood'] },

{ sci:'Perampanel', ar:'بيرامبانيل', atc:'N03AX22', cat:'cns.epilepsy', form:'tablet',
  doses:['2 mg', '4 mg', '6 mg', '8 mg', '10 mg', '12 mg'], brand:['Fycompa'],
  take:['bedtime'],
  tags:['inducerSensitive'],
  notes:{en:'Once a day at bedtime. Dizziness is common; report irritability, aggression or any change in mood at once.',
         ar:'مرة واحدة قبل النوم. الدوخة شائعة؛ أبلغ فوراً عن العصبية أو العدوانية أو أي تغيّر في المزاج.'},
  ix:[
    ['#hormonalContraceptive', W, 'At 12 mg a day it can weaken progestogen-only contraception.', 'بجرعة 12 ملغ يومياً قد يُضعف موانع الحمل البروجستينية.'],
    ['Alcohol', W, 'Worse mood, aggression and drowsiness.', 'تدهور المزاج والعدوانية والنعاس.']
  ],
  ask:['mood', 'drive'] },

{ sci:'Primidone', ar:'بريميدون', atc:'N03AA03', cat:'cns.epilepsy', form:'tablet',
  doses:['50 mg', '250 mg'], brand:['Mysoline'],
  tags:['inducer', 'sedative'],
  notes:{en:'Also used for tremor, at low doses. Drowsiness and unsteadiness at first. It makes the pill unreliable.',
         ar:'يُستعمل أيضاً للرجفة بجرعات منخفضة. نعاس وعدم ثبات في البداية. يجعل حبوب منع الحمل غير موثوقة.'},
  ci:['porphyria'],
  ask:['ocp', 'drive', 'sedatives'] },

/* ---------- Parkinson's disease ---------- */
{ sci:'Levodopa', ar:'ليفودوبا', atc:'N04BA01', cat:'cns.parkinson', form:'tablet',
  doses:['100 mg', '250 mg'], brand:['Sinemet', 'Madopar'],
  tags:['dopaminergic'],
  notes:{en:'Timing matters more than dose — twenty minutes late is felt. Kept away from protein-heavy meals.',
         ar:'التوقيت أهم من الجرعة — التأخير عشرين دقيقة يُحدث فرقاً ملموساً. يُباعد عن الوجبات الغنية بالبروتين.'},
  ix:[
    ['Metoclopramide', S, 'Each one blocks the other.', 'تضاد متبادل في الأثر.'],
    ['Haloperidol', S, 'Cancels levodopa’s effect.', 'يلغي أثر الليفودوبا.'],
    ['Ferrous sulfate', W, 'Reduces absorption — space by two hours.', 'يقلّل الامتصاص — باعد ساعتين.']
  ],
  ci:['angleGlaucoma', {en:'Suspected melanoma', ar:'ميلانوما مشتبهة'}, {en:'Non-selective MAO inhibitors', ar:'تناول مثبطات MAO غير الانتقائية'}],
  ask:['otherMeds', 'drive'] },

{ sci:'Pramipexole', ar:'براميبيكسول', atc:'N04BC05', cat:'cns.parkinson', form:'tablet',
  doses:['0.088 mg', '0.18 mg', '0.35 mg', '0.7 mg', '0.26–3.15 mg ER'], brand:['Mirapex', 'Sifrol'],
  tags:['dopaminergic', 'sedative'],
  notes:{en:'Sudden sleep can come without warning — no driving if it happens. Report compulsive gambling, shopping, eating or sexual urges. At low dose, it is used for restless legs.',
         ar:'قد يأتي النوم فجأة دون إنذار — لا قيادة إن حدث ذلك. أبلغ عن اندفاع قهري للقمار أو التسوّق أو الأكل أو الجنس. يُستعمل بجرعة منخفضة لتململ الساقين.'},
  ask:['drive', 'kidney', 'otherMeds'] },

{ sci:'Ropinirole', ar:'روبينيرول', atc:'N04BC04', cat:'cns.parkinson', form:'tablet',
  doses:['0.25 mg', '1 mg', '2 mg', '5 mg', '2–8 mg ER'], brand:['Requip'],
  tags:['dopaminergic', 'sedative'],
  notes:{en:'Sudden sleep can come without warning — no driving if it happens. Report compulsive urges (gambling, shopping, eating). Also used for restless legs.',
         ar:'قد يأتي النوم فجأة دون إنذار — لا قيادة إن حدث ذلك. أبلغ عن الاندفاعات القهرية (القمار، التسوّق، الأكل). يُستعمل أيضاً لتململ الساقين.'},
  ix:[
    ['Ciprofloxacin', S, 'Raises ropinirole — watch for side effects.', 'يرفع الروبينيرول — راقب الآثار الجانبية.']
  ],
  ask:['drive', 'otherMeds', 'smoke'] },

{ sci:'Rotigotine', ar:'روتيغوتين', atc:'N04BC09', cat:'cns.parkinson', form:'patch',
  doses:['2 mg', '4 mg', '6 mg', '8 mg/24 h patch'], brand:['Neupro'],
  tags:['dopaminergic', 'sedative'],
  notes:{en:'A new patch every day on a different site; remove it before an MRI scan. Sudden sleep and compulsive urges can occur.',
         ar:'لصقة جديدة كل يوم في موضع مختلف؛ تُنزع قبل تصوير الرنين المغناطيسي. قد يحدث نوم مفاجئ واندفاعات قهرية.'},
  ask:['drive', 'otherMeds'] },

{ sci:'Amantadine', ar:'أمانتادين', atc:'N04BB01', cat:'cns.parkinson', form:'capsule',
  doses:['100 mg'], brand:['PK-Merz', 'Symmetrel'],
  tags:['anticholinergic'],
  notes:{en:'Confusion, hallucinations, swollen ankles and a blotchy purple rash on the legs can occur. The dose is cut in kidney impairment; do not stop suddenly.',
         ar:'قد يسبّب التشوّش والهلوسة وتورّم الكاحلين وطفحاً بنفسجياً مبقّعاً على الساقين. تُخفّض الجرعة في القصور الكلوي؛ ولا يُوقف فجأة.'},
  ci:['renalSevere', 'uncontrolledEpilepsy'],
  ask:['kidney', 'epilepsy', 'mood'] },

{ sci:'Rasagiline', ar:'راساجيلين', atc:'N04BD02', cat:'cns.parkinson', form:'tablet',
  doses:['0.5 mg', '1 mg'], brand:['Azilect'],
  tags:['maoi'],
  notes:{en:'Once a day. Not with pethidine, tramadol or many antidepressants — tell every prescriber you take it.',
         ar:'مرة واحدة يومياً. لا يُجمع مع البيثيدين أو الترامادول أو كثير من مضادات الاكتئاب — أخبر كل طبيب أنك تأخذه.'},
  ci:['hepModSevere'],
  ask:['antidep', 'otherMeds'] },

{ sci:'Selegiline', ar:'سيليجيلين', atc:'N04BD01', cat:'cns.parkinson', form:'tablet',
  doses:['5 mg', '10 mg'], brand:['Eldepryl', 'Jumex'],
  tags:['maoi'],
  notes:{en:'In the morning (it can keep you awake). Not with pethidine, tramadol or many antidepressants.',
         ar:'صباحاً (قد يسبّب الأرق). لا يُجمع مع البيثيدين أو الترامادول أو كثير من مضادات الاكتئاب.'},
  ask:['antidep', 'otherMeds'] },

{ sci:'Entacapone', ar:'إنتاكابون', atc:'N04BX02', cat:'cns.parkinson', form:'tablet',
  doses:['200 mg', 'with levodopa and carbidopa'], brand:['Comtan', 'Stalevo'],
  tags:['dopaminergic'],
  notes:{en:'Taken with every levodopa dose. It turns urine reddish-brown — harmless. It can bring on extra involuntary movements; report them.',
         ar:'يؤخذ مع كل جرعة ليفودوبا. يلوّن البول بني محمر — وهذا غير ضار. قد يزيد الحركات اللاإرادية؛ أبلغ عنها.'},
  ix:[
    ['#maoi', S, 'Not with non-selective MAO inhibitors.', 'لا يُجمع مع مثبطات MAO غير الانتقائية.'],
    ['#polyvalent', W, 'Iron binds entacapone — take them two to three hours apart.', 'الحديد يربط الإنتاكابون — بفاصل ساعتين إلى ثلاث.']
  ],
  ci:['hepSevere', 'phaeo'],
  ask:['otherMeds', 'liver'] },

{ sci:'Trihexyphenidyl', ar:'تريهيكسيفينيديل', atc:'N04AA01', cat:'cns.parkinson', form:'tablet',
  doses:['2 mg', '5 mg'], brand:['Artane', 'Parkizol'], aka:['Benzhexol'],
  tags:['anticholinergic'],
  notes:{en:'Dry mouth, blurred vision and constipation are common; older people can become confused. It is misused for a "high" — dispense against a prescription.',
         ar:'جفاف الفم وتشوّش الرؤية والإمساك شائعة؛ وقد يصاب كبار السن بالتشوّش. يُساء استعماله للنشوة — يُصرف بوصفة.'},
  ci:['angleGlaucoma', 'retention', 'myasthenia'],
  ask:['glaucoma', 'prostate', 'whatFor'] },

{ sci:'Procyclidine', ar:'بروسيكليدين', atc:'N04AA04', cat:'cns.parkinson', form:'tablet',
  doses:['5 mg', '10 mg/2 mL injection'], brand:['Kemadrin'],
  tags:['anticholinergic'],
  notes:{en:'For stiffness and spasms caused by antipsychotics, and in Parkinson’s. Dry mouth and blurred vision are common.',
         ar:'للتيبّس والتشنّجات الناتجة عن مضادات الذهان، وفي باركنسون. جفاف الفم وتشوّش الرؤية شائعان.'},
  ci:['angleGlaucoma', 'retention'],
  ask:['glaucoma', 'prostate'] },

{ sci:'Biperiden', ar:'بيبيريدين', atc:'N04AA02', cat:'cns.parkinson', form:'tablet',
  doses:['2 mg', '5 mg/mL injection'], brand:['Akineton'],
  tags:['anticholinergic'],
  notes:{en:'For medicine-induced stiffness and Parkinson’s. Dry mouth, blurred vision and confusion in older people; it can be misused.',
         ar:'للتيبّس الناتج عن الأدوية ولباركنسون. جفاف فم وتشوّش رؤية، وتشوّش ذهني عند كبار السن؛ وقد يُساء استعماله.'},
  ci:['angleGlaucoma', 'retention', 'obstruction'],
  ask:['glaucoma', 'prostate', 'whatFor'] },

/* ---------- Dementia ---------- */

{ sci:'Donepezil', ar:'دونيبيزيل', atc:'N06DA02', cat:'cns.dementia', form:'tablet',
  doses:['5 mg', '10 mg', '23 mg'], brand:['Aricept'],
  tags:['cholinesterase', 'bradycardic', 'qt'], take:['bedtime'],
  notes:{en:'At bedtime. Nausea, vivid dreams and a slow pulse can occur — report fainting or black stools.',
         ar:'قبل النوم. قد يسبّب الغثيان والأحلام الواضحة وبطء النبض — أبلغ عن الإغماء أو البراز الأسود.'},
  ask:['slowPulse', 'ulcer', 'otherMeds'] },

{ sci:'Rivastigmine', ar:'ريفاستيغمين', atc:'N06DA03', cat:'cns.dementia', form:'capsule',
  doses:['1.5 mg', '3 mg', '4.5 mg', '6 mg capsule', '4.6 mg and 9.5 mg/24 h patch'], brand:['Exelon'],
  tags:['cholinesterase', 'bradycardic'],
  notes:{en:'Capsules with food; a patch is changed daily onto a new site. After more than three missed days, restart at the lowest dose — vomiting can be severe.',
         ar:'الكبسولات مع الطعام؛ واللصقة تُبدّل يومياً على موضع جديد. بعد نسيان أكثر من ثلاثة أيام، يُعاد البدء بأقل جرعة — فقد يكون القيء شديداً.'},
  ask:['slowPulse', 'ulcer', 'otherMeds'] },

{ sci:'Galantamine', ar:'غالانتامين', atc:'N06DA04', cat:'cns.dementia', form:'capsule',
  doses:['8 mg', '16 mg', '24 mg ER'], brand:['Reminyl'],
  tags:['cholinesterase', 'bradycardic'], take:['withFood'],
  notes:{en:'With food, and plenty of fluid. Nausea and dizziness at first; report fainting or a very slow pulse.',
         ar:'مع الطعام والكثير من السوائل. غثيان ودوخة في البداية؛ أبلغ عن الإغماء أو بطء النبض الشديد.'},
  ci:['hepSevere', 'renalSevere'],
  ask:['slowPulse', 'kidney', 'otherMeds'] },

{ sci:'Memantine', ar:'ميمانتين', atc:'N06DX01', cat:'cns.dementia', form:'tablet',
  doses:['10 mg', '20 mg', '10 mg/mL solution'], brand:['Ebixa', 'Namenda'],
  notes:{en:'Built up weekly. Dizziness, headache and constipation are common at first. The dose is lowered in kidney impairment.',
         ar:'تُرفع الجرعة أسبوعياً. الدوخة والصداع والإمساك شائعة في البداية. تُخفّض الجرعة في القصور الكلوي.'},
  ix:[
    ['Amantadine', S, 'Both act on the same brain receptors — risk of psychosis; avoid.', 'كلاهما يعمل على المستقبلات نفسها — خطر ذهان؛ يُتجنّب.'],
    ['Dextromethorphan', W, 'Same receptors — more side effects.', 'المستقبلات نفسها — آثار جانبية أكثر.']
  ],
  ask:['kidney', 'epilepsy'] },

/* ---------- Vertigo and motion sickness ---------- */

{ sci:'Betahistine', ar:'بيتاهيستين', atc:'N07CA01', cat:'cns.vertigo', form:'tablet',
  doses:['8 mg', '16 mg', '24 mg'], brand:['Betaserc'],
  take:['withFood'],
  notes:{en:'For Ménière’s-type vertigo, with meals; it takes weeks to judge. Stomach upset is the common side effect.',
         ar:'لدوار مينيير، مع الوجبات؛ ويحتاج أسابيع للحكم على فائدته. اضطراب المعدة أشيع آثاره.'},
  ix:[
    ['Chlorphenamine', W, 'Antihistamines can weaken betahistine.', 'مضادات الهيستامين قد تُضعف البيتاهيستين.'],
    ['Cinnarizine', W, 'Antihistamines can weaken betahistine.', 'مضادات الهيستامين قد تُضعف البيتاهيستين.']
  ],
  ci:['phaeo'],
  ask:['asthma', 'ulcer'] },

{ sci:'Cinnarizine', ar:'سيناريزين', atc:'N07CA02', cat:'cns.vertigo', form:'tablet',
  doses:['25 mg', '75 mg'], brand:['Stugeron'],
  tags:['sedative'],
  notes:{en:'For vertigo and travel sickness. Drowsy — no driving. Long use in older people can cause tremor or stiffness.',
         ar:'للدوار ودوار السفر. منوّم — لا قيادة. الاستعمال الطويل عند كبار السن قد يسبّب الرجفة أو التيبّس.'},
  ci:['parkinson'],
  ask:['drive', 'parkinson'] },

{ sci:'Dimenhydrinate', ar:'ديمينهيدرينات', atc:'A04AB02', cat:'cns.vertigo', form:'tablet',
  doses:['50 mg', '50 mg/mL injection', 'suppository'], brand:['Dramamine', 'Travamin'],
  tags:['sedative', 'anticholinergic'],
  notes:{en:'For travel sickness: 30–60 minutes before the journey. Drowsy — no driving.',
         ar:'لدوار السفر: قبل الرحلة بـ 30–60 دقيقة. منوّم — لا قيادة.'},
  ci:['angleGlaucoma', 'retention', 'under2'],
  ask:['drive', 'childAge', 'glaucoma'] },

{ sci:'Meclozine', ar:'ميكلوزين', atc:'R06AE05', cat:'cns.vertigo', form:'tablet',
  doses:['12.5 mg', '25 mg'], brand:['Antivert', 'Bonine'], aka:['Meclizine'],
  tags:['sedative', 'anticholinergic'],
  notes:{en:'For vertigo and travel sickness — an hour before travel. Drowsy — no driving.',
         ar:'للدوار ودوار السفر — قبل الرحلة بساعة. منوّم — لا قيادة.'},
  ci:['angleGlaucoma', 'retention'],
  ask:['drive', 'glaucoma'] },

{ sci:'Hyoscine hydrobromide', ar:'بروميد هيدرات الهيوسين', atc:'A04AD01', cat:'cns.vertigo', form:'tablet',
  doses:['0.3 mg tablet', '1 mg/72 h patch'], brand:['Kwells', 'Scopoderm'], aka:['Scopolamine hydrobromide', 'Scopolamine'],
  tags:['anticholinergic', 'sedative'],
  notes:{en:'The patch goes behind the ear 5–6 hours before travel. Wash your hands after touching it — rubbing an eye with patch residue widens the pupil.',
         ar:'توضع اللصقة خلف الأذن قبل السفر بـ 5–6 ساعات. اغسل يديك بعد لمسها — فرك العين ببقاياها يوسّع الحدقة.'},
  ci:['angleGlaucoma', 'retention'],
  ask:['glaucoma', 'prostate', 'childAge'] },

/* ---------- Memory and cerebral circulation ---------- */

{ sci:'Piracetam', ar:'بيراسيتام', atc:'N06BX03', cat:'cns.nootropic', form:'tablet',
  doses:['400 mg', '800 mg', '1200 mg', '20% solution', '1 g/5 mL injection'], brand:['Nootropil'],
  notes:{en:'Used for memory problems and cortical myoclonus; its benefit for memory is uncertain. Nervousness and weight gain can occur.',
         ar:'يُستعمل لمشاكل الذاكرة والرمع العضلي القشري؛ وفائدته للذاكرة غير مؤكدة. قد يسبّب العصبية وزيادة الوزن.'},
  ix:[
    ['#anticoag', W, 'Affects platelets — more bleeding.', 'يؤثر في الصفيحات — نزف أكثر.']
  ],
  ci:['renalSevere', {en:'Brain haemorrhage', ar:'نزف دماغي'}, {en:'Huntington’s chorea', ar:'رقص هنتنغتون'}],
  ask:['kidney', 'bleeding'] },

{ sci:'Citicoline', ar:'سيتيكولين', atc:'N06BX06', cat:'cns.nootropic', form:'tablet',
  doses:['500 mg', '1000 mg', '100 mg/mL solution', '500 mg/4 mL injection'], brand:['Somazina', 'Cognizin'],
  notes:{en:'Used after stroke and for memory problems; the evidence is modest. It is well tolerated.',
         ar:'يُستعمل بعد السكتة ولمشاكل الذاكرة؛ والأدلة متواضعة. يتحمّله المرضى جيداً.'},
  ix:[
    ['Levodopa', W, 'May strengthen the effects of levodopa.', 'قد يقوّي آثار الليفودوبا.']
  ],
  ask:['whatFor'] },

{ sci:'Cerebrolysin', ar:'سيريبروليسين', atc:'N06BX', cat:'cns.nootropic', form:'injection',
  doses:['5 mL', '10 mL ampoule'], brand:['Cerebrolysin'],
  notes:{en:'An injection course after stroke or brain injury; the evidence is limited.',
         ar:'دورة حقن بعد السكتة أو إصابة الدماغ؛ والأدلة محدودة.'},
  ix:[
    ['#maoi', W, 'Possible added effects with MAO inhibitors.', 'تأثيرات مضافة ممكنة مع مثبطات MAO.']
  ],
  ci:['epilepsy', 'renalSevere'],
  ask:['epilepsy', 'kidney'] },

{ sci:'Vinpocetine', ar:'فينبوسيتين', atc:'N06BX18', cat:'cns.nootropic', form:'tablet',
  doses:['5 mg', '10 mg'], brand:['Cavinton'],
  notes:{en:'Said to improve blood flow in the brain; the evidence is weak. Not in pregnancy. It can add to the effect of blood thinners.',
         ar:'يُقال إنه يحسّن جريان الدم في الدماغ؛ والأدلة ضعيفة. لا يُستعمل في الحمل. قد يزيد أثر مميّعات الدم.'},
  ix:[
    ['#anticoag', W, 'More bleeding.', 'نزف أكثر.']
  ],
  ci:['preg'],
  ask:['preg', 'thinner'] },

/* ---------- Multiple sclerosis and neuromuscular ---------- */

{ sci:'Interferon beta-1a', ar:'إنترفيرون بيتا-1a', atc:'L03AB07', cat:'cns.neuro', form:'injection',
  doses:['30 microgram weekly', '22 and 44 microgram three times weekly'], brand:['Avonex', 'Rebif'], aka:['Interferon beta', 'Recombinant interferon beta'],
  notes:{en:'Injected on a fixed schedule; flu-like symptoms after each dose are common — paracetamol helps. Blood counts and liver tests are checked. Report low mood.',
         ar:'يُحقن وفق جدول ثابت؛ أعراض تشبه الإنفلونزا بعد كل جرعة شائعة — والباراسيتامول يفيد. يُفحص تعداد الدم ووظائف الكبد. أبلغ عن انخفاض المزاج.'},
  ix:[
    ['Zidovudine', W, 'More low blood counts.', 'مزيد من انخفاض تعداد الدم.']
  ],
  ci:[{en:'Severe depression or suicidal thoughts', ar:'اكتئاب شديد أو أفكار انتحارية'}, 'hepActive'],
  ask:['mood', 'cold', 'injectTech'] },

{ sci:'Interferon beta-1b', ar:'إنترفيرون بيتا-1b', atc:'L03AB08', cat:'cns.neuro', form:'injection',
  doses:['250 microgram every other day'], brand:['Betaferon', 'Extavia'],
  notes:{en:'Every other day under the skin; flu-like symptoms and injection-site reactions are common. Report low mood.',
         ar:'يوماً بعد يوم تحت الجلد؛ أعراض تشبه الإنفلونزا وتفاعلات موضع الحقن شائعة. أبلغ عن انخفاض المزاج.'},
  ix:[
    ['Zidovudine', W, 'More low blood counts.', 'مزيد من انخفاض تعداد الدم.']
  ],
  ci:[{en:'Severe depression or suicidal thoughts', ar:'اكتئاب شديد أو أفكار انتحارية'}, 'hepActive'],
  ask:['mood', 'injectTech'] },

{ sci:'Glatiramer acetate', ar:'أسيتات الغلاتيرامر', atc:'L03AX13', cat:'cns.neuro', form:'injection',
  doses:['20 mg daily', '40 mg three times weekly'], brand:['Copaxone'],
  notes:{en:'Injected under the skin, rotating sites. A brief flush with chest tightness and palpitations just after injecting can happen and passes.',
         ar:'يُحقن تحت الجلد مع تبديل المواضع. قد يحدث بعد الحقن مباشرة احمرار عابر مع ضيق صدر وخفقان، ويزول.'},
  ask:['injectTech', 'cold'] },

{ sci:'Fingolimod', ar:'فينغوليمود', atc:'L04AA27', cat:'cns.neuro', form:'capsule',
  doses:['0.25 mg', '0.5 mg'], brand:['Gilenya'],
  tags:['bradycardic', 'qtPossible', 'immunosuppressant'],
  notes:{en:'The first dose is watched for six hours because the pulse slows. Eye checks for swelling at the back of the eye; report infections. It causes birth defects — stop two months before a pregnancy.',
         ar:'تُراقب الجرعة الأولى ست ساعات لأن النبض يتباطأ. فحص للعين لتورّم قاع العين؛ وأبلغ عن أي عدوى. يسبّب تشوّهات للجنين — يُوقف قبل الحمل بشهرين.'},
  ci:['pregTeratogen', 'recentMI', 'heartBlock', 'seriousInfection'],
  ask:['pregTest', 'slowPulse', 'infection'] },

{ sci:'Teriflunomide', ar:'تيريفلونومايد', atc:'L04AA31', cat:'cns.neuro', form:'tablet',
  doses:['7 mg', '14 mg'], brand:['Aubagio'],
  tags:['immunosuppressant'],
  notes:{en:'Liver tests, blood counts and blood pressure are checked. It causes birth defects and stays in the body for up to two years — a wash-out procedure exists.',
         ar:'تُفحص وظائف الكبد وتعداد الدم والضغط. يسبّب تشوّهات للجنين ويبقى في الجسم حتى سنتين — وتوجد طريقة لتسريع طرحه.'},
  ci:['pregTeratogen', 'hepSevere', 'seriousInfection'],
  ask:['pregTest', 'liver', 'infection'] },

{ sci:'Dimethyl fumarate', ar:'فومارات ثنائي الميثيل', atc:'L04AX07', cat:'cns.neuro', form:'capsule',
  doses:['120 mg', '240 mg'], brand:['Tecfidera'],
  take:['withFood'],
  tags:['immunosuppressant'],
  notes:{en:'With food, to reduce flushing and stomach upset. White-cell counts are checked regularly.',
         ar:'مع الطعام، لتقليل الاحمرار واضطراب المعدة. يُفحص تعداد الكريات البيض بانتظام.'},
  ask:['infection', 'labs'] },

{ sci:'Natalizumab', ar:'ناتاليزوماب', atc:'L04AG03', cat:'cns.neuro', form:'injection',
  doses:['300 mg infusion'], brand:['Tysabri'],
  tags:['immunosuppressant'],
  notes:{en:'A monthly infusion. The main risk is a rare brain infection (PML) — report new weakness, clumsiness, speech or vision change, or confusion.',
         ar:'تسريب شهري. الخطر الأكبر عدوى دماغية نادرة (PML) — أبلغ عن ضعف جديد أو ارتباك في الحركة أو تغيّر في الكلام أو النظر أو تشوّش.'},
  ci:['seriousInfection', 'immunocompromised'],
  ask:['infection'] },

{ sci:'Ocrelizumab', ar:'أوكريليزوماب', atc:'L04AG08', cat:'cns.neuro', form:'injection',
  doses:['300 mg/10 mL'], brand:['Ocrevus'],
  tags:['immunosuppressant'],
  notes:{en:'An infusion every six months after the first two. Hepatitis B is tested for first; vaccines are best given beforehand.',
         ar:'تسريب كل ستة أشهر بعد الجرعتين الأوليين. يُفحص التهاب الكبد B قبل البدء؛ ويُفضّل إعطاء اللقاحات قبله.'},
  ci:['seriousInfection', 'hepActive'],
  ask:['hepatitis', 'infection', 'vaccine'] },

{ sci:'Pyridostigmine', ar:'بيريدوستيغمين', atc:'N07AA02', cat:'cns.neuro', form:'tablet',
  doses:['60 mg'], brand:['Mestinon'],
  tags:['cholinesterase'],
  notes:{en:'For myasthenia gravis, at regular times. Cramps, diarrhoea and too much saliva mean the dose may be high; weakness with breathing difficulty is an emergency.',
         ar:'للوهن العضلي الوبيل، في أوقات منتظمة. التقلّصات والإسهال وكثرة اللعاب تعني أن الجرعة قد تكون عالية؛ والضعف مع صعوبة التنفس حالة طارئة.'},
  ci:['obstruction', 'retention'],
  ask:['asthma', 'slowPulse', 'otherMeds'] },

{ sci:'Fampridine', ar:'فامبريدين', atc:'N07XX07', cat:'cns.neuro', form:'tablet',
  doses:['10 mg prolonged-release'], brand:['Fampyra', 'Ampyra'], aka:['Dalfampridine', '4-Aminopyridine'],
  tags:['seizure'],
  notes:{en:'Improves walking in multiple sclerosis: one tablet every 12 hours, swallowed whole, never two together — too much can cause fits. It is stopped if walking has not improved after two weeks.',
         ar:'يحسّن المشي في التصلب المتعدد: قرص كل 12 ساعة يُبلع كاملاً، ولا يؤخذ قرصان معاً أبداً — الزيادة قد تسبّب نوبات. يُوقف إذا لم يتحسّن المشي بعد أسبوعين.'},
  ci:['epilepsy', 'renal'],
  ask:['epilepsy', 'kidney', 'otherMeds'] },

{ sci:'Riluzole', ar:'ريلوزول', atc:'N07XX02', cat:'cns.neuro', form:'tablet',
  doses:['50 mg'], brand:['Rilutek'],
  take:['emptyStomach'],
  notes:{en:'For motor neurone disease: on an empty stomach, twice a day. Liver tests and blood counts are checked; report fever.',
         ar:'لمرض العصبون الحركي: على معدة فارغة، مرتين يومياً. تُفحص وظائف الكبد وتعداد الدم؛ أبلغ عن الحرارة.'},
  ix:[
    ['Ciprofloxacin', W, 'Ciprofloxacin and fluvoxamine raise riluzole.', 'السيبروفلوكساسين والفلوفوكسامين يرفعان الريلوزول.']
  ],
  ci:['hepActive'],
  ask:['liver', 'infection'] },

{ sci:'Botulinum toxin type A', ar:'ذيفان البوتولينوم نوع A', atc:'M03AX01', cat:'cns.neuro', form:'injection',
  doses:['50', '100', '200 units vial', '300 and 500 units vial'], brand:['Botox', 'Dysport', 'Xeomin'], aka:['Botulinum toxin', 'OnabotulinumtoxinA'],
  notes:{en:'Injected by a specialist for spasticity, dystonia, migraine, sweating or cosmetic lines. Report difficulty swallowing, speaking or breathing — the toxin can spread.',
         ar:'يحقنه الطبيب المختص للتشنّج العضلي وخلل التوتر والشقيقة والتعرّق والتجاعيد. أبلغ عن صعوبة البلع أو الكلام أو التنفس — قد ينتشر الذيفان.'},
  ix:[
    ['#ototoxic', W, 'Aminoglycosides strengthen the toxin’s effect.', 'الأمينوغليكوزيدات تقوّي أثر الذيفان.']
  ],
  ci:['myasthenia', {en:'Infection at the injection site', ar:'التهاب في موضع الحقن'}],
  ask:['myasthenia', 'preg', 'otherMeds'] },

{ sci:'Thioctic acid', ar:'حمض الثيوكتيك', atc:'A16AX01', cat:'cns.neuro', form:'tablet',
  doses:['300 mg', '600 mg tablet', '600 mg/24 mL injection'], brand:['Thiogamma', 'Thioctacid'], aka:['Alpha-lipoic acid', 'Lipoic acid'],
  take:['emptyStomach'],
  notes:{en:'For diabetic nerve pain: on an empty stomach 30 minutes before breakfast. It can lower blood sugar slightly.',
         ar:'لآلام الأعصاب السكرية: على معدة فارغة قبل الفطور بنصف ساعة. قد يخفض سكر الدم قليلاً.'},
  ix:[
    ['#hypoglycaemic', W, 'Can lower blood sugar further — check it.', 'قد يخفض السكر أكثر — افحصه.']
  ],
  ask:['diabetes', 'hypo'] }

];
