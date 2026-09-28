/* Kidney, bladder and prostate: prostate enlargement, sexual health,
   overactive bladder, urine alkalinisers and stones. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Prostate enlargement ---------- */
{ sci:'Tamsulosin', ar:'تامسولوسين', atc:'G04CA02', cat:'uro.bph', form:'capsule',
  doses:['0.4 mg'], brand:['Flomax', 'Omnic'],
  tags:['alphaBlocker', 'sub3a4'], take:['afterFood'],
  notes:{en:'After the same meal each day. The first dose can cause postural dizziness. The eye surgeon must be told before cataract surgery.',
         ar:'بعد نفس الوجبة يومياً. الجرعة الأولى قد تسبّب دواراً انتصابياً. يجب إخبار طبيب العيون قبل جراحة الساد.'},
  ix:[
    ['Sildenafil', S, 'Postural hypotension.', 'هبوط ضغط انتصابي.'],
    ['Clarithromycin', S, 'Raises tamsulosin and drops blood pressure.', 'يرفع التامسولوسين وهبوط الضغط.']
  ],
  ci:[{en:'Previous postural hypotension', ar:'هبوط ضغط انتصابي سابق'}, 'hepSevere'],
  ask:['lowBp', 'cataract', 'pde5'] },

{ sci:'Alfuzosin', ar:'ألفوزوسين', atc:'G04CA01', cat:'uro.bph', form:'tablet',
  doses:['2.5 mg', '10 mg XL'], brand:['Xatral', 'Uroxatral'],
  tags:['alphaBlocker', 'sub3a4crit', 'qtPossible'], take:['afterFood'],
  notes:{en:'After the same meal each day. Dizziness on standing, especially after the first dose — get up slowly. Tell the eye surgeon before cataract surgery.',
         ar:'بعد الوجبة نفسها كل يوم. دوخة عند الوقوف، خاصة بعد الجرعة الأولى — انهض ببطء. أخبر جرّاح العيون قبل عملية الساد.'},
  ci:['posturalHypo', 'hepSevere'],
  ask:['lowBp', 'cataract', 'pde5'] },

{ sci:'Silodosin', ar:'سيلودوسين', atc:'G04CA04', cat:'uro.bph', form:'capsule',
  doses:['4 mg', '8 mg'], brand:['Urief', 'Rapaflo'],
  tags:['alphaBlocker', 'sub3a4crit'], take:['withFood'],
  notes:{en:'With food. Ejaculation without semen is common and harmless. Tell the eye surgeon before cataract surgery.',
         ar:'مع الطعام. القذف دون سائل منوي شائع وغير ضار. أخبر جرّاح العيون قبل عملية الساد.'},
  ci:['hepSevere', 'renal30'],
  ask:['lowBp', 'cataract', 'kidney'] },

{ sci:'Terazosin', ar:'تيرازوسين', atc:'G04CA03', cat:'uro.bph', form:'tablet',
  doses:['1 mg', '2 mg', '5 mg', '10 mg'], brand:['Hytrin'],
  tags:['alphaBlocker'], take:['bedtime'],
  notes:{en:'The first dose at bedtime — it can make you faint. Get up slowly.',
         ar:'الجرعة الأولى قبل النوم — قد تسبّب الإغماء. انهض ببطء.'},
  ci:['posturalHypo'],
  ask:['lowBp', 'cataract', 'pde5'] },

{ sci:'Finasteride', ar:'فيناسترايد', atc:'G04CB01', cat:'uro.bph', form:'tablet',
  doses:['5 mg (prostate)', '1 mg (hair)'], brand:['Proscar', 'Propecia'],
  notes:{en:'It takes months to shrink the prostate or regrow hair. A woman who is or may be pregnant must not handle crushed or broken tablets. It halves the PSA result — tell whoever tests it. Report low mood.',
         ar:'يحتاج أشهراً لتصغير البروستاتا أو إنبات الشعر. يجب ألا تلمس المرأة الحامل أو التي قد تحمل الأقراص المسحوقة أو المكسورة. يخفض نتيجة PSA إلى النصف — أخبر من يُجري الفحص. أبلغ عن انخفاض المزاج.'},
  ci:[{en:'Women and children', ar:'النساء والأطفال'}],
  ask:['mood', 'labs', 'pregnantHandler'] },

{ sci:'Dutasteride', ar:'دوتاسترايد', atc:'G04CB02', cat:'uro.bph', form:'capsule',
  doses:['0.5 mg', '0.5 mg with tamsulosin 0.4 mg'], brand:['Avodart', 'Duodart'],
  notes:{en:'Swallow whole — the capsule contents should not be handled by a woman who is or may be pregnant. It halves the PSA result. Takes months to work.',
         ar:'تُبلع كاملة — يجب ألا تلمس المرأة الحامل أو التي قد تحمل محتوى الكبسولة. يخفض نتيجة PSA إلى النصف. يحتاج أشهراً ليعمل.'},
  ci:[{en:'Women and children', ar:'النساء والأطفال'}, 'hepSevere'],
  ask:['labs', 'mood', 'pregnantHandler'] },

/* ---------- Sexual health ---------- */
{ sci:'Sildenafil', ar:'سيلدينافيل', atc:'G04BE03', cat:'uro.sexual', form:'tablet',
  doses:['25 mg', '50 mg', '100 mg'], brand:['Viagra'],
  tags:['pde5', 'sub3a4'],
  notes:{en:'Absolutely not with any nitrate — ask specifically about a sublingual spray, which many patients do not count as a medicine.',
         ar:'ممنوع تماماً مع أي نترات — اسأل عن بخاخ تحت اللسان تحديداً، فكثير من المرضى لا يعدّونه دواءً.'},
  ix:[
    ['Glyceryl trinitrate', C, 'Fatal hypotension — the combination is contraindicated.', 'هبوط ضغط قاتل — ممنوع الجمع.'],
    ['Isosorbide dinitrate', C, 'Fatal hypotension — the combination is contraindicated.', 'هبوط ضغط قاتل — ممنوع الجمع.'],
    ['Tamsulosin', S, 'Postural hypotension.', 'هبوط ضغط انتصابي.'],
    ['Clarithromycin', S, 'Substantially raises sildenafil.', 'يرفع السيلدينافيل كثيراً.']
  ],
  ci:['nitrates', {en:'Recent infarction or stroke', ar:'احتشاء أو سكتة حديثة'}, 'hypotension'],
  ask:['nitrates', 'heart', 'lowBp'] },

{ sci:'Tadalafil', ar:'تادالافيل', atc:'G04BE08', cat:'uro.sexual', form:'tablet',
  doses:['2.5 mg', '5 mg daily', '10 mg', '20 mg'], brand:['Cialis', 'Adcirca'],
  tags:['pde5', 'sub3a4'],
  notes:{en:'On demand at least 30 minutes before sex, lasting up to 36 hours, or 5 mg daily (also used for the prostate). Never with nitrates. Headache, flushing and back pain are common. An erection lasting over four hours is an emergency.',
         ar:'عند الحاجة قبل العلاقة بنصف ساعة على الأقل ويدوم حتى 36 ساعة، أو 5 ملغ يومياً (ويُستعمل أيضاً للبروستاتا). لا يُجمع أبداً مع النترات. الصداع والاحمرار وألم الظهر شائعة. الانتصاب الذي يدوم أكثر من أربع ساعات حالة طارئة.'},
  ci:['nitrates', 'hypotension', 'recentMI'],
  ask:['nitrates', 'heart', 'lowBp'] },

{ sci:'Vardenafil', ar:'فاردينافيل', atc:'G04BE09', cat:'uro.sexual', form:'tablet',
  doses:['5 mg', '10 mg', '20 mg', '10 mg orodispersible'], brand:['Levitra', 'Staxyn'],
  tags:['pde5', 'sub3a4crit', 'qtPossible'],
  notes:{en:'About an hour before sex. Never with nitrates. Headache and flushing are common; an erection over four hours is an emergency.',
         ar:'قبل العلاقة بساعة تقريباً. لا يُجمع أبداً مع النترات. الصداع والاحمرار شائعان؛ والانتصاب أكثر من أربع ساعات حالة طارئة.'},
  ci:['nitrates', 'hypotension', 'hepSevere'],
  ask:['nitrates', 'heart', 'rhythm'] },

{ sci:'Avanafil', ar:'أفانافيل', atc:'G04BE10', cat:'uro.sexual', form:'tablet',
  doses:['50 mg', '100 mg', '200 mg'], brand:['Spedra', 'Stendra'],
  tags:['pde5', 'sub3a4crit'],
  notes:{en:'About 15–30 minutes before sex. Never with nitrates. An erection over four hours is an emergency.',
         ar:'قبل العلاقة بـ 15–30 دقيقة. لا يُجمع أبداً مع النترات. الانتصاب أكثر من أربع ساعات حالة طارئة.'},
  ci:['nitrates', 'hypotension', 'recentMI'],
  ask:['nitrates', 'heart', 'lowBp'] },

{ sci:'Dapoxetine', ar:'دابوكستين', atc:'G04BX14', cat:'uro.sexual', form:'tablet',
  doses:['30 mg', '60 mg'], brand:['Priligy'],
  tags:['sero', 'sub3a4crit'],
  notes:{en:'For premature ejaculation: 1–3 hours before sex with a full glass of water, no more than once a day. It can cause fainting — sit or lie down if dizzy; no alcohol.',
         ar:'لسرعة القذف: قبل العلاقة بساعة إلى ثلاث مع كأس ماء كامل، ولا أكثر من مرة يومياً. قد يسبّب الإغماء — اجلس أو استلقِ إن شعرت بدوخة؛ لا كحول.'},
  ci:[{en:'Significant heart disease', ar:'مرض قلبي هام'}, 'maoi', 'hepModSevere'],
  ask:['heart', 'antidep', 'alcohol'] },

/* ---------- Overactive bladder ---------- */

{ sci:'Oxybutynin', ar:'أوكسيبوتينين', atc:'G04BD04', cat:'uro.bladder', form:'tablet',
  doses:['2.5 mg', '5 mg', '10 mg XL', 'patch'], brand:['Ditropan', 'Cystrin'],
  tags:['anticholinergic'],
  notes:{en:'Dry mouth, constipation and blurred vision are common; older people can become confused — report it.',
         ar:'جفاف الفم والإمساك وتشوّش الرؤية شائعة؛ وقد يصاب كبار السن بالتشوّش — أبلغ عنه.'},
  ci:['angleGlaucoma', 'retention', 'myasthenia'],
  ask:['glaucoma', 'prostate', 'falls'] },

{ sci:'Tolterodine', ar:'تولتيرودين', atc:'G04BD07', cat:'uro.bladder', form:'tablet',
  doses:['1 mg', '2 mg', '4 mg XL'], brand:['Detrusitol'],
  tags:['anticholinergic', 'qtPossible', 'sub3a4'],
  notes:{en:'Dry mouth and constipation are common. Report difficulty passing urine.',
         ar:'جفاف الفم والإمساك شائعان. أبلغ عن صعوبة التبوّل.'},
  ci:['angleGlaucoma', 'retention', 'myasthenia'],
  ask:['glaucoma', 'prostate', 'falls'] },

{ sci:'Solifenacin', ar:'سوليفيناسين', atc:'G04BD08', cat:'uro.bladder', form:'tablet',
  doses:['5 mg', '10 mg', '6 mg with tamsulosin 0.4 mg'], brand:['Vesicare', 'Vesomni'],
  tags:['anticholinergic', 'qtPossible', 'sub3a4'],
  notes:{en:'Once a day. Dry mouth, constipation and blurred vision are common.',
         ar:'مرة واحدة يومياً. جفاف الفم والإمساك وتشوّش الرؤية شائعة.'},
  ci:['angleGlaucoma', 'retention', 'myasthenia', 'hepSevere'],
  ask:['glaucoma', 'prostate', 'rhythm'] },

{ sci:'Trospium', ar:'تروسبيوم', atc:'G04BD09', cat:'uro.bladder', form:'tablet',
  doses:['20 mg', '60 mg XL'], brand:['Regurin', 'Spasmex'], aka:['Trospium chloride'],
  tags:['anticholinergic'], take:['emptyStomach'],
  notes:{en:'On an empty stomach, an hour before food. Less confusion than other bladder medicines, as little reaches the brain.',
         ar:'على معدة فارغة، قبل الطعام بساعة. تشوّش أقل من أدوية المثانة الأخرى لأن القليل منه يصل إلى الدماغ.'},
  ci:['angleGlaucoma', 'retention', 'myasthenia'],
  ask:['glaucoma', 'prostate', 'kidney'] },

{ sci:'Darifenacin', ar:'داريفيناسين', atc:'G04BD10', cat:'uro.bladder', form:'tablet',
  doses:['7.5 mg', '15 mg'], brand:['Emselex', 'Enablex'],
  tags:['anticholinergic', 'sub3a4'],
  notes:{en:'Once a day, swallowed whole. Dry mouth and constipation are common.',
         ar:'مرة واحدة يومياً، يُبلع كاملاً. جفاف الفم والإمساك شائعان.'},
  ci:['angleGlaucoma', 'retention', 'hepSevere'],
  ask:['glaucoma', 'prostate'] },

{ sci:'Fesoterodine', ar:'فيسوتيرودين', atc:'G04BD11', cat:'uro.bladder', form:'tablet',
  doses:['4 mg', '8 mg'], brand:['Toviaz'],
  tags:['anticholinergic', 'sub3a4'],
  notes:{en:'Once a day, swallowed whole. Dry mouth and constipation are common.',
         ar:'مرة واحدة يومياً، يُبلع كاملاً. جفاف الفم والإمساك شائعان.'},
  ci:['angleGlaucoma', 'retention', 'hepSevere'],
  ask:['glaucoma', 'prostate'] },

{ sci:'Mirabegron', ar:'ميرابيغرون', atc:'G04BD12', cat:'uro.bladder', form:'tablet',
  doses:['25 mg', '50 mg'], brand:['Betmiga', 'Myrbetriq'],
  tags:['qtPossible'],
  notes:{en:'Once a day. It can raise blood pressure — have it checked. No dry mouth or confusion, unlike the older bladder medicines.',
         ar:'مرة واحدة يومياً. قد يرفع الضغط — افحصه. لا يسبّب جفاف الفم أو التشوّش بخلاف أدوية المثانة الأقدم.'},
  ix:[
    ['Metoprolol', W, 'Raises metoprolol.', 'يرفع الميتوبرولول.'],
    ['Digoxin', W, 'Raises digoxin — check the level.', 'يرفع الديجوكسين — افحص مستواه.']
  ],
  ci:['uncontrolledHtn'],
  ask:['bp', 'kidney'] },

{ sci:'Flavoxate', ar:'فلافوكسات', atc:'G04BD02', cat:'uro.bladder', form:'tablet',
  doses:['200 mg'], brand:['Urispas', 'Genurin'],
  tags:['anticholinergic'],
  notes:{en:'Relieves bladder spasm and the urge to pass urine. Dry mouth and blurred vision can occur.',
         ar:'يخفّف تشنّج المثانة والحاجة الملحّة للتبوّل. قد يسبّب جفاف الفم وتشوّش الرؤية.'},
  ci:['angleGlaucoma', 'obstruction'],
  ask:['glaucoma', 'prostate'] },

/* ---------- Urine alkalinisers and stones ---------- */

{ sci:'Potassium citrate', ar:'سترات البوتاسيوم', atc:'A12BA02', cat:'uro.stone', form:'sachet',
  doses:['1.08 g', '15 mEq ER tablet', 'granules with sodium citrate'], brand:['Urocit-K', 'Uralyt-U'],
  tags:['kSupp'], take:['afterFood'],
  notes:{en:'Keeps urine alkaline to prevent some stones and ease the burning of cystitis: dissolved in water after meals, with plenty to drink.',
         ar:'يُبقي البول قلوياً للوقاية من بعض الحصى وتخفيف حرقة التهاب المثانة: يُذاب في الماء بعد الوجبات، مع الإكثار من الشرب.'},
  ci:['hyperK', 'renalSevere'],
  ask:['kidney', 'potassium', 'stones'] },

{ sci:'Sodium citrate', ar:'سترات الصوديوم', atc:'G04BX', cat:'uro.stone', form:'sachet',
  doses:['sachet', 'effervescent granules with citric acid'], brand:['Citravescent'],
  notes:{en:'Eases the burning of cystitis by making urine less acidic, with plenty of water; it is high in sodium. Also found in some cough syrups.',
         ar:'يخفّف حرقة التهاب المثانة بتقليل حموضة البول، مع الإكثار من الماء؛ وهو غني بالصوديوم. يوجد أيضاً في بعض أشربة السعال.'},
  ci:['hfDecomp', 'renalSevere'],
  ask:['bp', 'kidney', 'duration'] },

{ sci:'Phenazopyridine', ar:'فينازوبيريدين', atc:'G04BX06', cat:'uro.stone', form:'tablet',
  doses:['100 mg', '200 mg'], brand:['Pyridium'],
  take:['afterFood'],
  notes:{en:'Eases burning on passing urine for up to two days while the infection is treated. It turns urine orange-red and can stain contact lenses and clothes.',
         ar:'يخفّف حرقة التبوّل لمدة تصل إلى يومين ريثما تُعالج العدوى. يلوّن البول برتقالياً محمراً وقد يصبغ العدسات اللاصقة والملابس.'},
  ci:['renalSevere', 'g6pd'],
  ask:['kidney', 'g6pd', 'duration'] }

];
