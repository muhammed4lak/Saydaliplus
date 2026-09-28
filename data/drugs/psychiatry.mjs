/* Psychiatry: antipsychotics, antidepressants, mood stabilisers, anxiety and
   sleep, ADHD, and dependence. Controlled substances carry `controlled` to
   match data/controlled.json. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Antipsychotics ---------- */
{ sci:'Haloperidol', ar:'هالوبيريدول', atc:'N05AD01', cat:'cns.antipsychotic', form:'tablet',
  doses:['0.5 mg', '5 mg', '5 mg/mL'], brand:['Haldol'],
  tags:['qt', 'dopamineBlocker', 'sedative'],
  notes:{en:'Extrapyramidal effects are common and early. Prolongs QT. Rigidity with fever and confusion is neuroleptic malignant syndrome — emergency.',
         ar:'أعراض خارج هرمية شائعة ومبكّرة. إطالة QT. تصلّب مع حمّى وتخليط: متلازمة خبيثة — إسعاف.'},
  ix:[
    ['Metoclopramide', S, 'Compounded extrapyramidal effects.', 'أعراض خارج هرمية مضاعفة.'],
    ['Amiodarone', C, 'QT prolongation — avoid the combination.', 'إطالة QT — يُتجنّب الجمع.'],
    ['Escitalopram', S, 'Additive QT prolongation.', 'إطالة QT مضاعفة.']
  ],
  ci:['parkinson', 'qt', 'cnsDepression'],
  ask:['parkinson', 'rhythm', 'whoFor'] },

{ sci:'Chlorpromazine', ar:'كلوربرومازين', atc:'N05AA01', cat:'cns.antipsychotic', form:'tablet',
  doses:['10 mg', '25 mg', '50 mg', '100 mg', '25 mg/5 mL syrup', '25 mg/mL injection'], brand:['Largactil'],
  tags:['dopamineBlocker', 'sedative', 'anticholinergic', 'qt'],
  notes:{en:'Drowsiness, dizziness on standing and a dry mouth are common. The skin burns easily in the sun — cover up. Report stiffness, restlessness, or fever with rigid muscles.',
         ar:'النعاس والدوخة عند الوقوف وجفاف الفم شائعة. يحترق الجلد بسهولة في الشمس — غطِّ جلدك. أبلغ عن التيبّس أو التململ أو الحرارة مع تصلّب العضلات.'},
  ci:['cnsDepression', 'elderlyDementia', 'angleGlaucoma'],
  ask:['drive', 'sun', 'epilepsy'] },

{ sci:'Fluphenazine', ar:'فلوفينازين', atc:'N05AB02', cat:'cns.antipsychotic', form:'injection',
  doses:['25 mg/mL decanoate depot', '1 mg', '2.5 mg tablet'], brand:['Modecate'],
  tags:['dopamineBlocker', 'sedative', 'qtPossible'],
  notes:{en:'A long-acting injection every two to five weeks — keep to the dates. Report stiffness, tremor or restlessness.',
         ar:'حقنة طويلة المفعول كل أسبوعين إلى خمسة — التزم بالمواعيد. أبلغ عن التيبّس أو الرجفة أو التململ.'},
  ci:['cnsDepression', 'parkinson', 'elderlyDementia'],
  ask:['parkinson', 'whoFor'] },

{ sci:'Trifluoperazine', ar:'تريفلوبيرازين', atc:'N05AB06', cat:'cns.antipsychotic', form:'tablet',
  doses:['1 mg', '5 mg'], brand:['Stelazine', 'Iralzine'],
  tags:['dopamineBlocker', 'sedative', 'qtPossible'],
  notes:{en:'Drowsiness and stiffness or restlessness can occur — report them. Low doses are sometimes used for anxiety.',
         ar:'قد يسبّب النعاس والتيبّس أو التململ — أبلغ عنها. تُستعمل الجرعات المنخفضة أحياناً للقلق.'},
  ci:['cnsDepression', 'parkinson', 'elderlyDementia'],
  ask:['parkinson', 'drive'] },

{ sci:'Flupentixol', ar:'فلوبنتيكسول', atc:'N05AF01', cat:'cns.antipsychotic', form:'tablet',
  doses:['0.5 mg with melitracen 10 mg', '0.5 mg', '1 mg', '3 mg', '20 mg/mL depot'], brand:['Deanxit', 'Fluanxol'],
  tags:['dopamineBlocker', 'qtPossible'],
  notes:{en:'The low-dose tablets (often with melitracen) are widely used for anxiety and low mood: in the morning and at midday, not in the evening, as they can keep you awake. Report restlessness or tremor.',
         ar:'الأقراص منخفضة الجرعة (غالباً مع الميليتراسين) شائعة الاستعمال للقلق وانخفاض المزاج: صباحاً وظهراً لا مساءً، لأنها قد تسبّب الأرق. أبلغ عن التململ أو الرجفة.'},
  ci:['cnsDepression', 'recentMI'],
  ask:['heart', 'mood', 'epilepsy'] },

{ sci:'Zuclopenthixol', ar:'زوكلوبنتيكسول', atc:'N05AF05', cat:'cns.antipsychotic', form:'injection',
  doses:['200 mg/mL decanoate depot', '50 mg/mL acetate', '10 mg', '25 mg tablet'], brand:['Clopixol'],
  tags:['dopamineBlocker', 'sedative', 'qtPossible'],
  notes:{en:'Depot injections every two to four weeks. Drowsiness, stiffness and restlessness can occur.',
         ar:'حقن طويلة المفعول كل أسبوعين إلى أربعة. قد يسبّب النعاس والتيبّس والتململ.'},
  ci:['cnsDepression', 'elderlyDementia'],
  ask:['parkinson', 'whoFor'] },

{ sci:'Sulpiride', ar:'سولبيريد', atc:'N05AL01', cat:'cns.antipsychotic', form:'tablet',
  doses:['50 mg', '200 mg'], brand:['Dogmatil'],
  tags:['dopamineBlocker', 'qt'],
  notes:{en:'It raises prolactin: breast swelling, milk leakage and missed periods can happen. Also used at low dose for dizziness and stomach complaints.',
         ar:'يرفع هرمون الحليب: قد يسبّب تورّم الثدي وإفراز الحليب وانقطاع الدورة. يُستعمل أيضاً بجرعة منخفضة للدوخة وشكاوى المعدة.'},
  ci:['phaeo', {en:'Prolactin-dependent tumours', ar:'أورام معتمدة على البرولاكتين'}],
  ask:['rhythm', 'preg', 'parkinson'] },

{ sci:'Amisulpride', ar:'أميسولبرايد', atc:'N05AL05', cat:'cns.antipsychotic', form:'tablet',
  doses:['50 mg', '100 mg', '200 mg', '400 mg'], brand:['Solian'],
  tags:['dopamineBlocker', 'qt'],
  notes:{en:'It raises prolactin (breast changes, missed periods) and can prolong QT. The dose is lowered in kidney impairment.',
         ar:'يرفع هرمون الحليب (تغيّرات الثدي، انقطاع الدورة) وقد يطيل QT. تُخفّض الجرعة في القصور الكلوي.'},
  ci:['phaeo', {en:'Prolactin-dependent tumours', ar:'أورام معتمدة على البرولاكتين'}, 'renalSevere'],
  ask:['rhythm', 'kidney'] },

{ sci:'Risperidone', ar:'ريسبيريدون', atc:'N05AX08', cat:'cns.antipsychotic', form:'tablet',
  doses:['0.5 mg', '1 mg', '2 mg', '3 mg', '4 mg', '1 mg/mL solution', '25–50 mg depot'], brand:['Risperdal', 'Risperdal Consta'],
  tags:['dopamineBlocker', 'sedative', 'qtPossible'],
  notes:{en:'Weight gain, raised prolactin and restlessness can occur. Stand up slowly at first. Weight and blood sugar are checked.',
         ar:'قد يسبّب زيادة الوزن وارتفاع هرمون الحليب والتململ. انهض ببطء في البداية. يُراقب الوزن وسكر الدم.'},
  ci:['elderlyDementia'],
  ask:['diabetes', 'parkinson', 'whoFor'] },

{ sci:'Paliperidone', ar:'باليبيريدون', atc:'N05AX13', cat:'cns.antipsychotic', form:'tablet',
  doses:['3 mg', '6 mg', '9 mg ER', '50–150 mg monthly depot'], brand:['Invega', 'Xeplion'],
  tags:['dopamineBlocker', 'qtPossible'],
  notes:{en:'Swallow extended-release tablets whole — the empty shell may appear in the stool. Depot injections monthly. Weight and prolactin effects as with risperidone.',
         ar:'تُبلع الأقراص ممتدة المفعول كاملة — وقد تظهر قشرتها الفارغة في البراز. الحقن طويلة المفعول شهرياً. آثار الوزن وهرمون الحليب كالريسبيريدون.'},
  ci:['elderlyDementia', 'renalSevere'],
  ask:['rhythm', 'kidney', 'diabetes'] },

{ sci:'Olanzapine', ar:'أولانزابين', atc:'N05AH03', cat:'cns.antipsychotic', form:'tablet',
  doses:['2.5 mg', '5 mg', '10 mg', '15 mg', '20 mg', 'orodispersible', '10 mg injection'], brand:['Zyprexa'],
  tags:['dopamineBlocker', 'sedative', 'anticholinergic', 'qtPossible'],
  notes:{en:'Weight gain, drowsiness and raised sugar and cholesterol are common — weight and blood tests are checked. Smoking lowers its level; stopping smoking raises it.',
         ar:'زيادة الوزن والنعاس وارتفاع السكر والكوليسترول شائعة — يُراقب الوزن وتحاليل الدم. التدخين يخفض مستواه؛ والإقلاع عنه يرفعه.'},
  ci:['angleGlaucoma', 'elderlyDementia'],
  ask:['diabetes', 'smoke', 'drive'] },

{ sci:'Quetiapine', ar:'كويتيابين', atc:'N05AH04', cat:'cns.antipsychotic', form:'tablet',
  doses:['25 mg', '100 mg', '200 mg', '300 mg', '50–400 mg XR'], brand:['Seroquel'],
  tags:['dopamineBlocker', 'sedative', 'anticholinergic', 'qtPossible', 'sub3a4'],
  notes:{en:'Drowsiness and dizziness on standing, especially at first. Weight, sugar and cholesterol are checked. It is not a sleeping tablet.',
         ar:'النعاس والدوخة عند الوقوف، خاصة في البداية. يُراقب الوزن والسكر والكوليسترول. ليس حبة نوم.'},
  ci:['elderlyDementia'],
  ask:['drive', 'diabetes', 'otherMeds'] },

{ sci:'Clozapine', ar:'كلوزابين', atc:'N05AH02', cat:'cns.antipsychotic', form:'tablet',
  doses:['25 mg', '100 mg'], brand:['Clozaril', 'Leponex'],
  tags:['sedative', 'anticholinergic', 'qtPossible', 'seizure'],
  notes:{en:'Blood counts are compulsory — no count, no supply. Fever, sore throat or a flu-like illness needs a count the same day. Constipation can become dangerous — report it. Smoking changes the dose needed.',
         ar:'تعداد الدم إلزامي — لا تعداد، لا صرف. الحرارة أو التهاب الحلق أو أعراض الإنفلونزا تستوجب تعداداً في اليوم نفسه. الإمساك قد يصبح خطيراً — أبلغ عنه. التدخين يغيّر الجرعة اللازمة.'},
  ix:[
    ['Carbamazepine', C, 'Both suppress the marrow — contraindicated.', 'كلاهما يثبّط نقي العظم — ممنوع الجمع.'],
    ['Fluvoxamine', C, 'Raises clozapine many-fold.', 'يرفع الكلوزابين أضعافاً.'],
    ['Ciprofloxacin', S, 'Raises clozapine sharply.', 'يرفع الكلوزابين بشدة.']
  ],
  ci:['marrow', 'uncontrolledEpilepsy', 'ileus', {en:'Previous agranulocytosis or myocarditis on clozapine', ar:'ندرة محبّبات أو التهاب عضلة قلب سابق مع الكلوزابين'}],
  ask:['infection', 'labs', 'smoke'] },

{ sci:'Aripiprazole', ar:'أريبيبرازول', atc:'N05AX12', cat:'cns.antipsychotic', form:'tablet',
  doses:['5 mg', '10 mg', '15 mg', '30 mg', '1 mg/mL solution', '400 mg monthly depot'], brand:['Abilify'],
  tags:['sub3a4'],
  notes:{en:'Restlessness is common at first. Report compulsive urges — gambling, shopping, eating.',
         ar:'التململ شائع في البداية. أبلغ عن الاندفاعات القهرية — القمار، التسوّق، الأكل.'},
  ci:['elderlyDementia'],
  ask:['mood', 'diabetes', 'otherMeds'] },

{ sci:'Ziprasidone', ar:'زيبراسيدون', atc:'N05AE04', cat:'cns.antipsychotic', form:'capsule',
  doses:['20 mg', '40 mg', '60 mg', '80 mg', '20 mg injection'], brand:['Geodon', 'Zeldox'],
  tags:['dopamineBlocker', 'qt'], take:['withFood'],
  notes:{en:'Twice a day with food. It prolongs QT — report palpitations or fainting.',
         ar:'مرتين يومياً مع الطعام. يطيل QT — أبلغ عن الخفقان أو الإغماء.'},
  ci:['qt', 'recentMI', 'hfDecomp'],
  ask:['rhythm', 'heart'] },

{ sci:'Lurasidone', ar:'لوراسيدون', atc:'N05AE05', cat:'cns.antipsychotic', form:'tablet',
  doses:['20 mg', '40 mg', '80 mg'], brand:['Latuda'],
  tags:['dopamineBlocker', 'sub3a4crit'], take:['withFood'],
  notes:{en:'Once a day with a proper meal (at least 350 calories) — on an empty stomach it is barely absorbed. No grapefruit juice.',
         ar:'مرة واحدة يومياً مع وجبة كاملة (350 سعرة على الأقل) — على معدة فارغة لا يكاد يُمتص. لا عصير جريب فروت.'},
  ci:['elderlyDementia'],
  ask:['otherMeds', 'diabetes'] },

/* ---------- Antidepressants ---------- */
{ sci:'Amitriptyline', ar:'أميتريبتيلين', atc:'N06AA09', cat:'cns.antidepressant', form:'tablet',
  doses:['10 mg', '25 mg', '50 mg'], brand:['Tryptizol', 'Elavil'],
  tags:['anticholinergic', 'sedative', 'qtPossible', 'seroWeak'], take:['bedtime'],
  notes:{en:'The neuropathic-pain dose is far below the antidepressant one — reassure them the prescription is not about depression. Take it in the evening.',
         ar:'جرعة الألم العصبي أقل بكثير من جرعة الاكتئاب — طمئن المريض أن الوصفة ليست لاكتئاب. تُؤخذ مساءً.'},
  ix:[
    ['Fluoxetine', S, 'Raises amitriptyline and the serotonergic risk.', 'يرفع الأميتريبتيلين ويزيد خطر السيروتونين.'],
    ['Tramadol', S, 'Seizures and serotonin syndrome.', 'اختلاج ومتلازمة سيروتونين.'],
    ['Amiodarone', S, 'Additive QT prolongation.', 'إطالة QT مضاعفة.']
  ],
  ci:['recentMI', {en:'Cardiac arrhythmias', ar:'اضطرابات نظم قلبية'}, 'angleGlaucoma', 'maoi'],
  ask:['rhythm', 'glaucoma', 'mood'] },

{ sci:'Fluoxetine', ar:'فلوكسيتين', atc:'N06AB03', cat:'cns.antidepressant', form:'capsule',
  doses:['10 mg', '20 mg', '40 mg'], brand:['Prozac'],
  tags:['ssri', 'sero', 'qtPossible'], take:['morning'],
  notes:{en:'In the morning. It takes two to four weeks, and anxiety can worsen in the first days — that is the single most important thing to say at the counter.',
         ar:'صباحاً. الأثر يحتاج 2–4 أسابيع والقلق قد يزيد في الأيام الأولى — هذه أهم جملة تُقال عند الصرف.'},
  ix:[
    ['Tramadol', S, 'Serotonin syndrome and seizures.', 'متلازمة السيروتونين واختلاج.'],
    ['Metoprolol', S, 'Substantially raises metoprolol.', 'يرفع الميتوبرولول كثيراً.'],
    ['Warfarin', S, 'Raised bleeding risk.', 'خطر نزف مرتفع.'],
    ['Ibuprofen', S, 'GI bleeding.', 'نزف هضمي.']
  ],
  ci:['maoi', 'mania'],
  ask:['mood', 'bipolar', 'thinner'] },

{ sci:'Sertraline', ar:'سيرترالين', atc:'N06AB06', cat:'cns.antidepressant', form:'tablet',
  doses:['25 mg', '50 mg', '100 mg'], brand:['Zoloft', 'Lustral'],
  tags:['ssri', 'sero', 'qtPossible'],
  notes:{en:'With food. Never stopped abruptly — the discontinuation symptoms are unpleasant; taper it.',
         ar:'مع الطعام. لا يُوقف فجأة — أعراض الانسحاب مزعجة ويُخفّض تدريجياً.'},
  ix:[
    ['Tramadol', S, 'Serotonin syndrome.', 'متلازمة السيروتونين.'],
    ['Warfarin', S, 'Raised bleeding risk.', 'خطر نزف مرتفع.'],
    ['Ibuprofen', S, 'GI bleeding.', 'نزف هضمي.']
  ],
  ci:['maoi', {en:'Concurrent pimozide', ar:'الاستعمال المتزامن مع بيموزيد'}],
  ask:['mood', 'bipolar', 'thinner'] },

{ sci:'Escitalopram', ar:'إسيتالوبرام', atc:'N06AB10', cat:'cns.antidepressant', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg'], brand:['Cipralex', 'Lexapro'],
  tags:['ssri', 'sero', 'qt'],
  notes:{en:'Maximum 10 mg over 65 because of QT. Do not stop abruptly.',
         ar:'الجرعة القصوى 10 ملغ فوق 65 سنة بسبب QT. لا يُوقف فجأة.'},
  ix:[
    ['Amiodarone', S, 'Additive QT prolongation.', 'إطالة QT مضاعفة.'],
    ['Tramadol', S, 'Serotonin syndrome.', 'متلازمة السيروتونين.'],
    ['Omeprazole', W, 'Raises escitalopram.', 'يرفع الإسيتالوبرام.']
  ],
  ci:['maoi', 'qt'],
  ask:['mood', 'rhythm', 'thinner'] },

{ sci:'Paroxetine', ar:'باروكسيتين', atc:'N06AB05', cat:'cns.antidepressant', form:'tablet',
  doses:['20 mg', '30 mg', '12.5 mg and 25 mg CR'], brand:['Seroxat', 'Paxil'],
  tags:['ssri', 'sero', 'anticholinergic', 'qtPossible'], take:['morning'],
  notes:{en:'In the morning. Nausea and disturbed sleep at first; the benefit takes 2–4 weeks. Never stop suddenly — withdrawal is marked with paroxetine.',
         ar:'صباحاً. غثيان واضطراب نوم في البداية؛ والفائدة تحتاج 2–4 أسابيع. لا يُوقف فجأة أبداً — أعراض الانسحاب واضحة مع الباروكسيتين.'},
  ix:[
    ['Tamoxifen', S, 'Blocks activation of tamoxifen — use another antidepressant.', 'يمنع تنشيط التاموكسيفين — استعمل مضاد اكتئاب آخر.'],
    ['Metoprolol', W, 'Raises metoprolol.', 'يرفع الميتوبرولول.']
  ],
  ci:['maoi'],
  ask:['mood', 'preg', 'thinner'] },

{ sci:'Citalopram', ar:'سيتالوبرام', atc:'N06AB04', cat:'cns.antidepressant', form:'tablet',
  doses:['10 mg', '20 mg', '40 mg'], brand:['Cipram', 'Celexa'],
  tags:['ssri', 'sero', 'qt'],
  notes:{en:'At most 20 mg over 65, because of the heart rhythm. The benefit takes 2–4 weeks; do not stop suddenly.',
         ar:'بحد أقصى 20 ملغ فوق سن 65 بسبب نظم القلب. الفائدة تحتاج 2–4 أسابيع؛ ولا يُوقف فجأة.'},
  ci:['qt', 'maoi'],
  ask:['rhythm', 'mood', 'thinner'] },

{ sci:'Fluvoxamine', ar:'فلوفوكسامين', atc:'N06AB08', cat:'cns.antidepressant', form:'tablet',
  doses:['50 mg', '100 mg'], brand:['Faverin', 'Luvox'],
  tags:['ssri', 'sero'],
  notes:{en:'For depression and OCD. It blocks the breakdown of several medicines — read the whole list before dispensing. Do not stop suddenly.',
         ar:'للاكتئاب والوسواس القهري. يمنع تفكيك عدة أدوية — اقرأ القائمة كاملة قبل الصرف. لا يُوقف فجأة.'},
  ix:[
    ['Tizanidine', C, 'Raises tizanidine many-fold — contraindicated.', 'يرفع التيزانيدين أضعافاً — ممنوع الجمع.'],
    ['Theophylline', C, 'Raises theophylline to toxic levels — avoid.', 'يرفع الثيوفيلين إلى حدّ السمّية — يُتجنّب.'],
    ['Melatonin', S, 'Raises melatonin many-fold.', 'يرفع الميلاتونين أضعافاً.']
  ],
  ci:['maoi'],
  ask:['otherMeds', 'mood', 'smoke'] },

{ sci:'Venlafaxine', ar:'فينلافاكسين', atc:'N06AX16', cat:'cns.antidepressant', form:'capsule',
  doses:['37.5 mg', '75 mg', '150 mg XR'], brand:['Efexor', 'Effexor'],
  tags:['ssri', 'sero', 'qtPossible'], take:['withFood'],
  notes:{en:'With food. Higher doses can raise blood pressure. Never stop suddenly — withdrawal symptoms are common.',
         ar:'مع الطعام. الجرعات الأعلى قد ترفع الضغط. لا يُوقف فجأة أبداً — أعراض الانسحاب شائعة.'},
  ci:['maoi', 'uncontrolledHtn'],
  ask:['bp', 'mood', 'thinner'] },

{ sci:'Desvenlafaxine', ar:'ديسفينلافاكسين', atc:'N06AX23', cat:'cns.antidepressant', form:'tablet',
  doses:['50 mg', '100 mg'], brand:['Pristiq'],
  tags:['ssri', 'sero'],
  notes:{en:'Once a day, swallowed whole. Blood pressure is checked. Do not stop suddenly.',
         ar:'مرة واحدة يومياً، يُبلع كاملاً. يُراقب الضغط. لا يُوقف فجأة.'},
  ci:['maoi'],
  ask:['bp', 'mood'] },

{ sci:'Duloxetine', ar:'دولوكسيتين', atc:'N06AX21', cat:'cns.antidepressant', form:'capsule',
  doses:['30 mg', '60 mg'], brand:['Cymbalta'],
  tags:['ssri', 'sero'],
  notes:{en:'For depression, anxiety and nerve pain. Swallow whole. Nausea at first; do not stop suddenly. Avoid heavy drinking — it strains the liver.',
         ar:'للاكتئاب والقلق وآلام الأعصاب. يُبلع كاملاً. غثيان في البداية؛ ولا يُوقف فجأة. تجنّب الإفراط في الكحول — يُجهد الكبد.'},
  ix:[
    ['Ciprofloxacin', C, 'Raises duloxetine sharply — contraindicated.', 'يرفع الدولوكسيتين بشدة — ممنوع الجمع.'],
    ['Fluvoxamine', C, 'Raises duloxetine sharply — contraindicated.', 'يرفع الدولوكسيتين بشدة — ممنوع الجمع.']
  ],
  ci:['maoi', 'hep', 'renal30'],
  ask:['liver', 'bp', 'mood'] },

{ sci:'Mirtazapine', ar:'ميرتازابين', atc:'N06AX11', cat:'cns.antidepressant', form:'tablet',
  doses:['15 mg', '30 mg', '45 mg', 'orodispersible'], brand:['Remeron'],
  tags:['sedative', 'seroWeak'], take:['bedtime'],
  notes:{en:'At bedtime: drowsiness and a bigger appetite are common. Report fever or a sore throat (rarely it lowers white cells).',
         ar:'قبل النوم: النعاس وزيادة الشهية شائعان. أبلغ عن الحرارة أو التهاب الحلق (نادراً ما يخفض الكريات البيض).'},
  ci:['maoi'],
  ask:['drive', 'mood', 'infection'] },

{ sci:'Trazodone', ar:'ترازودون', atc:'N06AX05', cat:'cns.antidepressant', form:'tablet',
  doses:['50 mg', '100 mg', '150 mg'], brand:['Desyrel', 'Trittico'],
  tags:['sedative', 'seroWeak', 'qtPossible', 'sub3a4'], take:['bedtime'],
  notes:{en:'At bedtime after food. Drowsiness and dizziness are common. A painful erection lasting more than a few hours is an emergency.',
         ar:'قبل النوم بعد الطعام. النعاس والدوخة شائعان. الانتصاب المؤلم الذي يستمر أكثر من بضع ساعات حالة طارئة.'},
  ci:['recentMI'],
  ask:['drive', 'rhythm', 'mood'] },

{ sci:'Bupropion', ar:'بوبروبيون', atc:'N06AX12', cat:'cns.antidepressant', form:'tablet',
  doses:['150 mg', '300 mg XL'], brand:['Wellbutrin', 'Zyban'], aka:['Amfebutamone'],
  tags:['seizure'], take:['morning'],
  notes:{en:'For depression and for stopping smoking. Swallow whole, in the morning. It lowers the seizure threshold. Insomnia and a dry mouth are common.',
         ar:'للاكتئاب وللإقلاع عن التدخين. يُبلع كاملاً صباحاً. يخفض عتبة الاختلاج. الأرق وجفاف الفم شائعان.'},
  ix:[
    ['Tamoxifen', S, 'Blocks activation of tamoxifen — avoid.', 'يمنع تنشيط التاموكسيفين — يُتجنّب.'],
    ['Tramadol', S, 'Seizure risk.', 'خطر الاختلاج.']
  ],
  ci:['epilepsy', {en:'Bulimia or anorexia nervosa', ar:'الشره أو فقدان الشهية العصبي'}, 'maoi', {en:'Sudden withdrawal from alcohol or benzodiazepines', ar:'انسحاب مفاجئ من الكحول أو البنزوديازيبينات'}],
  ask:['epilepsy', 'mood', 'alcohol'] },

{ sci:'Agomelatine', ar:'أغوميلاتين', atc:'N06AX22', cat:'cns.antidepressant', form:'tablet',
  doses:['25 mg'], brand:['Valdoxan'],
  take:['bedtime'],
  notes:{en:'At bedtime. Liver tests at the start and at 3, 6, 12 and 24 weeks — report dark urine or yellowing.',
         ar:'قبل النوم. فحص الكبد عند البدء وبعد 3 و6 و12 و24 أسبوعاً — أبلغ عن غمق البول أو الاصفرار.'},
  ix:[
    ['Fluvoxamine', C, 'Raises agomelatine many-fold — contraindicated.', 'يرفع الأغوميلاتين أضعافاً — ممنوع الجمع.'],
    ['Ciprofloxacin', S, 'Raises agomelatine.', 'يرفع الأغوميلاتين.']
  ],
  ci:['hep'],
  ask:['liver', 'mood', 'otherMeds'] },

{ sci:'Vortioxetine', ar:'فورتيوكسيتين', atc:'N06AX26', cat:'cns.antidepressant', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg'], brand:['Brintellix', 'Trintellix'],
  tags:['sero'],
  notes:{en:'Once a day. Nausea is the common side effect, usually early.',
         ar:'مرة واحدة يومياً. الغثيان أشيع آثاره، في البداية عادة.'},
  ci:['maoi'],
  ask:['mood', 'thinner'] },

{ sci:'Clomipramine', ar:'كلوميبرامين', atc:'N06AA04', cat:'cns.antidepressant', form:'tablet',
  doses:['10 mg', '25 mg', '75 mg SR'], brand:['Anafranil'],
  tags:['sero', 'anticholinergic', 'sedative', 'qtPossible', 'seizure'],
  notes:{en:'For depression, OCD and panic. Dry mouth, constipation, sweating and drowsiness are common. Dangerous in overdose.',
         ar:'للاكتئاب والوسواس القهري ونوبات الهلع. جفاف الفم والإمساك والتعرّق والنعاس شائعة. خطير عند الجرعة الزائدة.'},
  ci:['recentMI', 'maoi', 'angleGlaucoma'],
  ask:['rhythm', 'glaucoma', 'mood'] },

{ sci:'Imipramine', ar:'إيميبرامين', atc:'N06AA02', cat:'cns.antidepressant', form:'tablet',
  doses:['10 mg', '25 mg'], brand:['Tofranil'],
  tags:['anticholinergic', 'sedative', 'qtPossible', 'seroWeak'],
  notes:{en:'For depression and, at low dose, bedwetting in children. Dry mouth and constipation are common. Dangerous in overdose — keep away from children.',
         ar:'للاكتئاب، وبجرعة منخفضة للتبوّل الليلي عند الأطفال. جفاف الفم والإمساك شائعان. خطير عند الجرعة الزائدة — أبعده عن الأطفال.'},
  ci:['recentMI', 'maoi'],
  ask:['rhythm', 'glaucoma', 'childAge'] },

{ sci:'Nortriptyline', ar:'نورتريبتيلين', atc:'N06AA10', cat:'cns.antidepressant', form:'capsule',
  doses:['10 mg', '25 mg', 'with fluphenazine'], brand:['Aventyl', 'Motival'],
  tags:['anticholinergic', 'sedative', 'qtPossible', 'seroWeak'],
  notes:{en:'For depression and nerve pain. Dry mouth, constipation and drowsiness are common.',
         ar:'للاكتئاب وآلام الأعصاب. جفاف الفم والإمساك والنعاس شائعة.'},
  ci:['recentMI', 'maoi'],
  ask:['rhythm', 'glaucoma', 'mood'] },

{ sci:'Melitracen', ar:'ميليتراسين', atc:'N06AA14', cat:'cns.antidepressant', form:'tablet',
  doses:['10 mg with flupentixol 0.5 mg'], brand:['Deanxit'],
  tags:['anticholinergic', 'qtPossible', 'seroWeak'],
  notes:{en:'Almost always with flupentixol (Deanxit): morning and midday. Dry mouth and restlessness can occur; not after a recent heart attack.',
         ar:'دائماً تقريباً مع الفلوبنتيكسول (ديانكسيت): صباحاً وظهراً. قد يسبّب جفاف الفم والتململ؛ ولا يُستعمل بعد احتشاء حديث.'},
  ci:['recentMI', 'heartBlock', 'angleGlaucoma', 'maoi'],
  ask:['heart', 'glaucoma', 'mood'] },

{ sci:'Moclobemide', ar:'موكلوبيمايد', atc:'N06AG02', cat:'cns.antidepressant', form:'tablet',
  doses:['150 mg', '300 mg'], brand:['Aurorix'],
  tags:['maoi'], take:['afterFood'],
  notes:{en:'After meals. A reversible MAO inhibitor: avoid large amounts of aged cheese and cured meats, and many cold remedies and antidepressants must not be combined with it.',
         ar:'بعد الوجبات. مثبط MAO عكوس: تجنّب الكميات الكبيرة من الأجبان المعتّقة واللحوم المقدّدة، وكثير من أدوية الزكام ومضادات الاكتئاب يُمنع جمعها معه.'},
  ix:[
    ['Tyramine-rich food', W, 'Large amounts can raise blood pressure.', 'الكميات الكبيرة قد ترفع الضغط.']
  ],
  ask:['otherMeds', 'antidep', 'bp'] },

/* ---------- Mood stabilisers ---------- */
{ sci:'Lithium', ar:'ليثيوم', atc:'N05AN01', cat:'cns.mood', form:'tablet',
  doses:['300 mg', '400 mg MR'], brand:['Priadel', 'Camcolit'],
  tags:['lithium'],
  notes:{en:'A very narrow window. Steady fluid and salt — sweating, diarrhoea or a low-salt diet push levels up. Tremor, diarrhoea and confusion are toxicity.',
         ar:'هامش علاجي ضيّق جداً. سوائل وملح ثابتان — التعرّق والإسهال والحمية قليلة الملح ترفع المستوى. الرعاش والإسهال والتخليط علامات تسمّم.'},
  ix:[
    ['Hydrochlorothiazide', S, 'Raises lithium to toxic levels.', 'يرفع الليثيوم إلى حدّ السميّة.'],
    ['Ibuprofen', S, 'NSAIDs raise lithium.', 'مضادات الالتهاب ترفع الليثيوم.'],
    ['Lisinopril', S, 'Raises lithium.', 'يرفع الليثيوم.'],
    ['Metronidazole', S, 'Raises lithium.', 'يرفع الليثيوم.']
  ],
  ci:['renalSevere', 'addison', {en:'Disturbed sodium balance', ar:'اضطراب توازن الصوديوم'}],
  ask:['labs', 'dehydration', 'otherMeds'] },

/* ---------- Anxiety and sleep ---------- */
{ sci:'Diazepam', ar:'ديازيبام', atc:'N05BA01', cat:'cns.anxiolytic', form:'tablet',
  doses:['2 mg', '5 mg', '10 mg', '10 mg/2 mL'], brand:['Valium'],
  tags:['benzo', 'sedative'], controlled:true,
  notes:{en:'A controlled substance. Two weeks maximum — dependence starts after that. No driving, no alcohol.',
         ar:'مادة خاضعة للرقابة. أسبوعان كحدّ أقصى — الاعتماد يبدأ بعدها. لا قيادة ولا كحول.'},
  ix:[
    ['Tramadol', C, 'Respiratory depression — avoid the combination.', 'تثبيط تنفسي — يُتجنّب الجمع.'],
    ['Clarithromycin', S, 'Raises diazepam and prolongs sedation.', 'يرفع الديازيبام ويطيل التنويم.']
  ],
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia', 'hepSevere'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Alprazolam', ar:'ألبرازولام', atc:'N05BA12', cat:'cns.anxiolytic', form:'tablet',
  doses:['0.25 mg', '0.5 mg', '1 mg'], brand:['Xanax'],
  tags:['benzo', 'sedative', 'sub3a4'], controlled:true,
  notes:{en:'A controlled substance and the fastest of the benzodiazepines to create dependence. Never stopped abruptly after regular use.',
         ar:'مادة خاضعة للرقابة وأسرع البنزوديازيبينات إحداثاً للاعتماد. لا يُوقف فجأة بعد استعمال منتظم.'},
  ix:[
    ['Tramadol', C, 'Respiratory depression.', 'تثبيط تنفسي.'],
    ['Clarithromycin', S, 'Substantially raises alprazolam.', 'يرفع الألبرازولام كثيراً.'],
    ['Fluconazole', S, 'Raises alprazolam.', 'يرفع الألبرازولام.']
  ],
  ci:['respInsufficiency', 'sleepApnoea', 'angleGlaucoma'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Lorazepam', ar:'لورازيبام', atc:'N05BA06', cat:'cns.anxiolytic', form:'tablet',
  doses:['1 mg', '2.5 mg', '4 mg/mL injection'], brand:['Ativan'],
  tags:['benzo', 'sedative'], controlled:true,
  notes:{en:'Drowsiness and unsteadiness — no driving, no alcohol. Habit-forming: short courses, stopped gradually.',
         ar:'النعاس وعدم الثبات — لا قيادة ولا كحول. يسبّب الاعتياد: دورات قصيرة، ويُوقف تدريجياً.'},
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Bromazepam', ar:'برومازيبام', atc:'N05BA08', cat:'cns.anxiolytic', form:'tablet',
  doses:['1.5 mg', '3 mg', '6 mg'], brand:['Lexotan'],
  tags:['benzo', 'sedative'], controlled:true,
  notes:{en:'For anxiety, short term. Drowsiness — no driving, no alcohol. Habit-forming: stopped gradually.',
         ar:'للقلق لفترة قصيرة. يسبّب النعاس — لا قيادة ولا كحول. يسبّب الاعتياد: يُوقف تدريجياً.'},
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia', 'hepSevere'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Chlordiazepoxide', ar:'كلورديازيبوكسيد', atc:'N05BA02', cat:'cns.anxiolytic', form:'capsule',
  doses:['5 mg', '10 mg', '25 mg', '5 mg with clidinium 2.5 mg'], brand:['Librium', 'Librax'],
  tags:['benzo', 'sedative'], controlled:true,
  notes:{en:'For anxiety, and alcohol withdrawal under supervision. Drowsy — no driving, no alcohol. Habit-forming.',
         ar:'للقلق، ولانسحاب الكحول تحت الإشراف. منوّم — لا قيادة ولا كحول. يسبّب الاعتياد.'},
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia'],
  ask:['prescription', 'alcohol', 'sedatives'] },

{ sci:'Oxazepam', ar:'أوكسازيبام', atc:'N05BA04', cat:'cns.anxiolytic', form:'tablet',
  doses:['10 mg', '15 mg', '30 mg'], brand:['Seresta', 'Serax'],
  tags:['benzo', 'sedative'], controlled:true,
  notes:{en:'A shorter-acting benzodiazepine for anxiety. Drowsy — no driving, no alcohol. Habit-forming.',
         ar:'بنزوديازيبين أقصر مفعولاً للقلق. منوّم — لا قيادة ولا كحول. يسبّب الاعتياد.'},
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Nitrazepam', ar:'نيترازيبام', atc:'N05CD02', cat:'cns.anxiolytic', form:'tablet',
  doses:['5 mg'], brand:['Mogadon'],
  tags:['benzo', 'sedative'], controlled:true, take:['bedtime'],
  notes:{en:'At bedtime, for short-term insomnia. Hangover drowsiness next morning is common — no driving. Habit-forming.',
         ar:'قبل النوم، للأرق قصير الأمد. النعاس في صباح اليوم التالي شائع — لا قيادة. يسبّب الاعتياد.'},
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Temazepam', ar:'تيمازيبام', atc:'N05CD07', cat:'cns.anxiolytic', form:'tablet',
  doses:['10 mg', '20 mg'], brand:['Restoril'],
  tags:['benzo', 'sedative'], controlled:true, take:['bedtime'],
  notes:{en:'At bedtime, for short-term insomnia only. Habit-forming.',
         ar:'قبل النوم، للأرق قصير الأمد فقط. يسبّب الاعتياد.'},
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Zolpidem', ar:'زولبيديم', atc:'N05CF02', cat:'cns.anxiolytic', form:'tablet',
  doses:['10 mg', '6.25 mg and 12.5 mg CR'], brand:['Stilnox', 'Ambien'],
  tags:['benzo', 'sedative', 'sub3a4'], controlled:true, take:['bedtime'],
  notes:{en:'Take it in bed, only when there are 7–8 hours to sleep. Sleep-walking, sleep-driving and next-morning drowsiness can occur. Short courses only.',
         ar:'يؤخذ في السرير فقط حين تتوفر 7–8 ساعات للنوم. قد يحدث المشي أو القيادة أثناء النوم ونعاس في الصباح التالي. دورات قصيرة فقط.'},
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia', 'hepSevere'],
  ask:['prescription', 'sedatives', 'drive'] },

{ sci:'Zopiclone', ar:'زوبيكلون', atc:'N05CF01', cat:'cns.anxiolytic', form:'tablet',
  doses:['3.75 mg', '7.5 mg'], brand:['Imovane'],
  tags:['benzo', 'sedative'], take:['bedtime'],
  notes:{en:'At bedtime, for short-term insomnia. A bitter taste is common; next-morning drowsiness can affect driving.',
         ar:'قبل النوم، للأرق قصير الأمد. الطعم المرّ شائع؛ والنعاس في الصباح التالي قد يؤثر في القيادة.'},
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia'],
  ask:['sedatives', 'drive', 'prescription'] },

{ sci:'Buspirone', ar:'بوسبيرون', atc:'N05BE01', cat:'cns.anxiolytic', form:'tablet',
  doses:['5 mg', '10 mg'], brand:['Buspar'],
  tags:['seroWeak', 'sub3a4'],
  notes:{en:'For anxiety: it takes two weeks to work and is not habit-forming. No grapefruit juice.',
         ar:'للقلق: يحتاج أسبوعين ليعمل ولا يسبّب الاعتياد. لا عصير جريب فروت.'},
  ix:[
    ['Grapefruit juice', S, 'Raises buspirone several-fold.', 'يرفع البوسبيرون أضعافاً.']
  ],
  ci:['maoi', 'hepSevere', 'renalSevere'],
  ask:['antidep', 'otherMeds'] },

{ sci:'Melatonin', ar:'ميلاتونين', atc:'N05CH01', cat:'cns.anxiolytic', form:'tablet',
  doses:['2 mg PR', '3 mg', '5 mg'], brand:['Circadin'],
  take:['bedtime'],
  notes:{en:'One to two hours before bedtime, for trouble falling asleep and jet lag. Next-morning drowsiness is uncommon.',
         ar:'قبل النوم بساعة إلى ساعتين، لصعوبة بدء النوم ولاضطراب السفر. النعاس في الصباح التالي غير شائع.'},
  ask:['drive', 'otherMeds'] },

{ sci:'Chloral hydrate', ar:'هيدرات الكلورال', atc:'N05CC01', cat:'cns.anxiolytic', form:'solution',
  doses:['500 mg/5 mL'],
  tags:['sedative'],
  notes:{en:'Used to sedate children for procedures such as scans, in hospital; not for regular use.',
         ar:'يُستعمل لتهدئة الأطفال قبل الإجراءات كالتصوير، في المستشفى؛ لا للاستعمال المنتظم.'},
  ci:['hepSevere', 'renalSevere', {en:'Severe heart disease', ar:'مرض قلبي شديد'}],
  ask:['childAge'] },

/* ---------- ADHD and wakefulness ---------- */

{ sci:'Methylphenidate', ar:'ميثيل فينيديت', atc:'N06BA04', cat:'cns.adhd', form:'tablet',
  doses:['5 mg', '10 mg', '18 mg', '27 mg', '36 mg', '54 mg ER'], brand:['Ritalin', 'Concerta'],
  tags:['sympathomimetic'], controlled:true, take:['morning'],
  notes:{en:'In the morning (and midday for short-acting) — later doses spoil sleep. Appetite loss is common; a child’s height and weight are checked. Store it securely.',
         ar:'صباحاً (وظهراً للقصير المفعول) — الجرعات المتأخرة تُفسد النوم. فقدان الشهية شائع؛ ويُراقب طول الطفل ووزنه. يُحفظ في مكان آمن.'},
  ci:['maoi', 'thyrotoxicosis', 'uncontrolledHtn', {en:'Severe anxiety, agitation or psychosis', ar:'قلق أو هياج أو ذهان شديد'}],
  ask:['heart', 'childAge', 'prescription'] },

{ sci:'Atomoxetine', ar:'أتوموكسيتين', atc:'N06BA09', cat:'cns.adhd', form:'capsule',
  doses:['10 mg', '18 mg', '25 mg', '40 mg', '60 mg', '80 mg'], brand:['Strattera'],
  tags:['qtPossible'],
  notes:{en:'Not a stimulant, not habit-forming; it takes weeks to work. Nausea and reduced appetite; report low mood, or yellow skin or dark urine.',
         ar:'ليس منبّهاً ولا يسبّب الاعتياد؛ ويحتاج أسابيع ليعمل. غثيان ونقص شهية؛ أبلغ عن انخفاض المزاج أو اصفرار الجلد أو غمق البول.'},
  ci:['maoi', 'angleGlaucoma', 'phaeo'],
  ask:['heart', 'mood', 'liver'] },

{ sci:'Modafinil', ar:'مودافينيل', atc:'N06BA07', cat:'cns.adhd', form:'tablet',
  doses:['100 mg', '200 mg'], brand:['Provigil', 'Modalert'],
  take:['morning'],
  notes:{en:'For narcolepsy and shift-work sleepiness: in the morning. A serious rash is rare but means stop at once. It makes the pill unreliable.',
         ar:'للتغفيق ونعاس العمل المناوب: صباحاً. الطفح الشديد نادر لكنه يستوجب الإيقاف فوراً. يجعل حبوب منع الحمل غير موثوقة.'},
  ix:[
    ['#hormonalContraceptive', S, 'Contraception unreliable during and for two months after.', 'منع الحمل غير موثوق أثناء العلاج وشهرين بعده.']
  ],
  ci:['uncontrolledHtn', 'arrhythmia'],
  ask:['heart', 'ocp', 'prescription'] },

/* ---------- Addiction and smoking cessation ---------- */

{ sci:'Naltrexone', ar:'نالتريكسون', atc:'N07BB04', cat:'cns.dependence', form:'tablet',
  doses:['50 mg'], brand:['Revia', 'Nodict'],
  notes:{en:'It blocks opioids. Taken while still dependent it brings on sudden withdrawal; using opioids to overcome it can cause overdose, especially after stopping. Carry a card.',
         ar:'يحجب الأفيونات. إن أُخذ مع استمرار الاعتماد يسبّب انسحاباً مفاجئاً؛ واستعمال الأفيونات لتجاوزه قد يسبّب جرعة زائدة، خاصة بعد إيقافه. احمل بطاقة تبيّن ذلك.'},
  ci:['hepActive', {en:'Current opioid use or dependence', ar:'استعمال حالي للأفيونات أو اعتماد عليها'}],
  ask:[{en:'Have you taken any opioid — tramadol, codeine, methadone or heroin — in the last 7–10 days?', ar:'هل أخذت أي أفيون — ترامادول أو كودائين أو ميثادون أو هيروين — خلال آخر 7–10 أيام؟'}, 'liver'] },

{ sci:'Acamprosate', ar:'أكامبروسات', atc:'N07BB03', cat:'cns.dependence', form:'tablet',
  doses:['333 mg'], brand:['Campral'],
  take:['withFood'],
  notes:{en:'Helps stay off alcohol after detox: three times a day with meals. Diarrhoea is common.',
         ar:'يساعد على الابتعاد عن الكحول بعد إزالة السموم: ثلاث مرات يومياً مع الوجبات. الإسهال شائع.'},
  ci:['renalSevere'],
  ask:['kidney', 'mood'] },

{ sci:'Disulfiram', ar:'ديسلفيرام', atc:'N07BB01', cat:'cns.dependence', form:'tablet',
  doses:['200 mg', '250 mg', '500 mg'], brand:['Antabuse', 'Esperal'],
  notes:{en:'Any alcohol — even in mouthwash, cough syrup or cooking — causes a violent reaction. Start only 24 hours after the last drink; the effect lasts a week after stopping.',
         ar:'أي كحول — ولو في غسول الفم أو شراب السعال أو الطبخ — يسبّب تفاعلاً عنيفاً. لا يُبدأ به إلا بعد 24 ساعة من آخر شراب؛ ويستمر أثره أسبوعاً بعد الإيقاف.'},
  ix:[
    ['Alcohol', C, 'Violent flushing, vomiting, palpitations and collapse.', 'احمرار عنيف وقيء وخفقان وانهيار.'],
    ['Metronidazole', S, 'Confusion and psychosis — avoid.', 'تشوّش وذهان — يُتجنّب.']
  ],
  ci:['ihd', {en:'Psychosis', ar:'الذهان'}],
  ask:['alcohol', 'heart', 'otherMeds'] },

{ sci:'Varenicline', ar:'فارينيكلين', atc:'N07BA03', cat:'cns.dependence', form:'tablet',
  doses:['0.5 mg', '1 mg'], brand:['Champix', 'Chantix'],
  take:['afterFood'],
  notes:{en:'Start one to two weeks before the stop date. Nausea is common — take it after food with a full glass of water. Report mood changes; vivid dreams are common.',
         ar:'ابدأ قبل موعد الإقلاع بأسبوع إلى أسبوعين. الغثيان شائع — خذه بعد الطعام مع كأس ماء كامل. أبلغ عن تغيّرات المزاج؛ والأحلام الواضحة شائعة.'},
  ask:['mood', 'kidney', 'epilepsy'] },

{ sci:'Nicotine', ar:'نيكوتين', atc:'N07BA01', cat:'cns.dependence', form:'patch',
  doses:['7 mg', '14 mg', '21 mg/24 h patch', '2 mg and 4 mg gum', 'lozenge'], brand:['Nicorette', 'NiQuitin'],
  notes:{en:'Chew the gum slowly and rest it in the cheek. Put a patch on clean, dry, hairless skin, a new site daily; take it off at night if dreams are vivid.',
         ar:'امضغ العلكة ببطء ثم أرِحها في الخد. ضع اللصقة على جلد نظيف جاف بلا شعر، في موضع جديد كل يوم؛ وانزعها ليلاً إن كانت الأحلام مزعجة.'},
  ask:[{en:'How many cigarettes a day do you smoke, and how soon after waking?', ar:'كم سيجارة تدخّن يومياً، وبعد كم من استيقاظك؟'}, 'heart', 'preg'] }

];
