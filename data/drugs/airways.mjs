/* Airways: bronchodilators, inhaled steroids, other asthma and COPD
   medicines, and the rest of the chest. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Bronchodilators ---------- */
{ sci:'Salbutamol', ar:'سالبوتامول', atc:'R03AC02', cat:'res.bronchodilator', form:'inhaler',
  doses:['100 mcg/dose', '2 mg/5 mL', '5 mg/mL nebuliser'], brand:['Ventolin'], aka:['Albuterol'],
  tags:['betaAgonist'],
  notes:{en:'A reliever, not a preventer. Needing it more than three times a week means the asthma is not controlled — see the doctor. Demonstrate the inhaler; do not just describe it.',
         ar:'مُسعف لا وقائي. الحاجة إليه أكثر من ثلاث مرات أسبوعياً تعني ربواً غير مضبوط — راجع الطبيب. اعرض طريقة الاستنشاق ولا تكتفِ بالشرح.'},
  ix:[
    ['Bisoprolol', S, 'Beta blockers cancel the bronchodilator.', 'حاصرات بيتا تلغي أثر موسّع القصبات.'],
    ['Furosemide', W, 'Compounded potassium loss at high doses.', 'نقص بوتاسيوم مضاعف مع الجرعات العالية.']
  ],
  ask:['reliever', 'inhaler'] },

{ sci:'Theophylline', ar:'ثيوفيلين', atc:'R03DA04', cat:'res.bronchodilator', form:'tablet',
  doses:['200 mg MR', '300 mg MR', '400 mg MR'], brand:['Uniphyllin', 'Theo-Dur'],
  tags:['xanthine', 'seizure'],
  notes:{en:'A narrow window. Do not switch brands — modified-release profiles differ. Nausea and palpitations mean the level is too high.',
         ar:'هامش علاجي ضيّق. لا يُبدّل بين الشركات — الشكل الممتد يختلف في التحرّر. الغثيان والخفقان علامات تجاوز.'},
  ix:[
    ['Ciprofloxacin', S, 'Raises theophylline to toxic levels.', 'يرفع الثيوفيلين إلى حدّ السميّة.'],
    ['Clarithromycin', S, 'Raises theophylline.', 'يرفع الثيوفيلين.'],
    ['Carbamazepine', W, 'Lowers theophylline and loses control.', 'يخفض الثيوفيلين ويفقد السيطرة.']
  ],
  ci:['arrhythmia', {en:'Uncontrolled epilepsy', ar:'الصرع غير المضبوط'}],
  ask:['smoke', 'otherMeds', 'labs'] },

{ sci:'Terbutaline', ar:'تيربوتالين', atc:'R03AC03', cat:'res.bronchodilator', form:'inhaler',
  doses:['500 microgram/dose inhaler', '2.5 mg tablet', '1.5 mg/5 mL syrup', '0.5 mg/mL injection'], brand:['Bricanyl'],
  tags:['betaAgonist'],
  notes:{en:'A reliever, like salbutamol. Tremor and a fast heartbeat are common. Needing it more than twice a week means the asthma needs review.',
         ar:'مُسعف مثل السالبوتامول. الرجفة وتسارع القلب شائعان. الحاجة إليه أكثر من مرتين أسبوعياً تعني أن الربو يحتاج مراجعة.'},
  ask:['reliever', 'inhaler', 'heart'] },

{ sci:'Fenoterol', ar:'فينوتيرول', atc:'R03AC04', cat:'res.bronchodilator', form:'inhaler',
  doses:['50 microgram/dose (with ipratropium 20 microgram)', 'nebuliser solution'], brand:['Berodual', 'Berotec'],
  tags:['betaAgonist'],
  notes:{en:'A reliever, usually combined with ipratropium. Tremor and palpitations are common. Keep nebuliser mist away from the eyes.',
         ar:'مُسعف، يُركّب عادة مع الإبراتروبيوم. الرجفة والخفقان شائعان. أبعد رذاذ جهاز الإرذاذ عن العينين.'},
  ask:['reliever', 'inhaler', 'heart'] },

{ sci:'Formoterol', ar:'فورموتيرول', atc:'R03AC13', cat:'res.bronchodilator', form:'inhaler',
  doses:['12 microgram/dose', '4.5 microgram (with budesonide)', '6 microgram (with beclometasone)'], brand:['Foradil', 'Oxis'], aka:['Eformoterol'],
  tags:['betaAgonist'],
  notes:{en:'A long-acting bronchodilator. In asthma it is never used on its own — always with an inhaled steroid, usually in the same inhaler.',
         ar:'موسّع قصبات طويل المفعول. في الربو لا يُستعمل وحده أبداً — دائماً مع كورتيزون مستنشق، وغالباً في البخاخ نفسه.'},
  ci:[{en:'Asthma without an inhaled steroid', ar:'الربو دون كورتيزون مستنشق'}],
  ask:['inhaler', 'reliever'] },

{ sci:'Salmeterol', ar:'سالميتيرول', atc:'R03AC12', cat:'res.bronchodilator', form:'inhaler',
  doses:['25 microgram/dose inhaler', '50 microgram Diskus', 'with fluticasone'], brand:['Serevent'],
  tags:['betaAgonist', 'sub3a4'],
  notes:{en:'Twice a day; it is not for quick relief. In asthma only with an inhaled steroid — usually the combination inhaler.',
         ar:'مرتين يومياً؛ ليس للإسعاف السريع. في الربو فقط مع كورتيزون مستنشق — عادة في البخاخ المركّب.'},
  ci:[{en:'Asthma without an inhaled steroid', ar:'الربو دون كورتيزون مستنشق'}],
  ask:['inhaler', 'reliever'] },

{ sci:'Indacaterol', ar:'إنداكاتيرول', atc:'R03AC18', cat:'res.bronchodilator', form:'inhaler',
  doses:['150 microgram', '300 microgram inhalation capsule'], brand:['Onbrez'],
  tags:['betaAgonist'],
  notes:{en:'Once a day for COPD. The capsules go in the inhaler — never swallow them. Cough just after inhaling is common.',
         ar:'مرة واحدة يومياً للانسداد الرئوي المزمن. الكبسولات توضع في جهاز الاستنشاق — لا تُبلع أبداً. السعال بعد الاستنشاق مباشرة شائع.'},
  ci:[{en:'Asthma (not licensed for it)', ar:'الربو (غير مرخّص له)'}],
  ask:['inhaler'] },

{ sci:'Ipratropium', ar:'إبراتروبيوم', atc:'R03BB01', cat:'res.bronchodilator', form:'inhaler',
  doses:['20 microgram/dose inhaler', '250 microgram/mL nebuliser solution', 'nasal spray'], brand:['Atrovent'], aka:['Ipratropium bromide'],
  notes:{en:'With a nebuliser mask, keep the mist away from the eyes — it can bring on glaucoma. A dry mouth is common.',
         ar:'مع قناع جهاز الإرذاذ، أبعد الرذاذ عن العينين — قد يُحدث الزرق. جفاف الفم شائع.'},
  ask:['glaucoma', 'prostate', 'inhaler'] },

{ sci:'Tiotropium', ar:'تيوتروبيوم', atc:'R03BB04', cat:'res.bronchodilator', form:'inhaler',
  doses:['18 microgram capsule (HandiHaler)', '2.5 microgram Respimat'], brand:['Spiriva'], aka:['Tiotropium bromide'],
  notes:{en:'Once a day at the same time. The capsules are for the inhaler — never swallow them. Dry mouth is common; report eye pain or difficulty passing urine.',
         ar:'مرة واحدة يومياً في الوقت نفسه. الكبسولات لجهاز الاستنشاق — لا تُبلع أبداً. جفاف الفم شائع؛ أبلغ عن ألم العين أو صعوبة التبوّل.'},
  ask:['inhaler', 'glaucoma', 'prostate'] },

{ sci:'Glycopyrronium', ar:'غليكوبيرونيوم', atc:'R03BB06', cat:'res.bronchodilator', form:'inhaler',
  doses:['44 microgram capsule (Breezhaler)', 'with indacaterol', 'with formoterol and budesonide', '200 microgram/mL injection', '320 microgram/mL oral solution'], brand:['Seebri', 'Ultibro', 'Trixeo', 'Robinul', 'Sialanar'], aka:['Glycopyrrolate', 'Glycopyrronium bromide'],
  notes:{en:'For COPD, once a day at the same time; the capsules go in the inhaler — never swallow them. Dry mouth is common; report eye pain or difficulty passing urine. The injection dries secretions during surgery; the oral solution treats drooling in children.',
         ar:'للانسداد الرئوي المزمن، مرة يومياً في الوقت نفسه؛ الكبسولات لجهاز الاستنشاق — لا تُبلع أبداً. جفاف الفم شائع؛ أبلغ عن ألم العين أو صعوبة التبوّل. الحقنة تجفّف الإفرازات أثناء الجراحة؛ والمحلول الفموي يعالج سيلان اللعاب عند الأطفال.'},
  ask:['inhaler', 'glaucoma', 'prostate'] },

{ sci:'Umeclidinium', ar:'يوميكليدينيوم', atc:'R03BB07', cat:'res.bronchodilator', form:'inhaler',
  doses:['55 microgram Ellipta', 'with vilanterol', 'with vilanterol and fluticasone furoate'], brand:['Incruse', 'Anoro', 'Trelegy'], aka:['Umeclidinium bromide'],
  notes:{en:'For COPD, one inhalation once a day at the same time. Dry mouth is common; report eye pain or difficulty passing urine.',
         ar:'للانسداد الرئوي المزمن، استنشاقة واحدة يومياً في الوقت نفسه. جفاف الفم شائع؛ أبلغ عن ألم العين أو صعوبة التبوّل.'},
  ask:['inhaler', 'glaucoma', 'prostate'] },

{ sci:'Aminophylline', ar:'أمينوفيلين', atc:'R03DA05', cat:'res.bronchodilator', form:'injection',
  doses:['250 mg/10 mL injection', '100 mg tablet', '225 mg SR tablet'], brand:['Phyllocontin'],
  tags:['xanthine', 'seizure'],
  notes:{en:'Mostly a hospital infusion for severe asthma, with blood levels checked. Nausea, palpitations and fits are signs of too much.',
         ar:'في الغالب تسريب في المستشفى للربو الشديد، مع فحص مستواه في الدم. الغثيان والخفقان والاختلاج علامات الجرعة الزائدة.'},
  ix:[
    ['Ciprofloxacin', S, 'Raises theophylline to toxic levels.', 'يرفع الثيوفيلين إلى حدّ السمّية.'],
    ['Clarithromycin', S, 'Raises theophylline.', 'يرفع الثيوفيلين.'],
    ['Erythromycin', S, 'Raises theophylline.', 'يرفع الثيوفيلين.']
  ],
  ci:['porphyria', 'arrhythmia'],
  ask:['smoke', 'otherMeds', 'labs'] },

{ sci:'Doxofylline', ar:'دوكسوفيلين', atc:'R03DA11', cat:'res.bronchodilator', form:'tablet',
  doses:['400 mg', '200 mg/10 mL injection'], brand:['Ansimar'],
  notes:{en:'A theophylline-like bronchodilator with fewer interactions, usually twice a day. Nausea or palpitations mean the dose may be too high.',
         ar:'موسّع قصبات شبيه بالثيوفيلين بتداخلات أقل، مرتين يومياً عادة. الغثيان أو الخفقان يعني أن الجرعة قد تكون مرتفعة.'},
  ci:['recentMI'],
  ask:['heart', 'otherMeds'] },

/* ---------- Inhaled steroids ---------- */
{ sci:'Budesonide/Formoterol', ar:'بوديزونيد/فورموتيرول', atc:'R03AK07', cat:'res.inhaledsteroid', form:'inhaler',
  doses:['80/4.5 mcg', '160/4.5 mcg', '320/9 mcg'], brand:['Symbicort'],
  tags:['betaAgonist'],
  notes:{en:'Rinse the mouth every time — oral thrush and a hoarse voice come from not doing it. A preventer: taken on the good days too.',
         ar:'المضمضة بعد كل استعمال — القلاع الفموي وبحّة الصوت سببهما إهمالها. وقائي يؤخذ حتى في الأيام الجيدة.'},
  ix:[
    ['Bisoprolol', S, 'Beta blockers cancel the formoterol.', 'حاصرات بيتا تلغي أثر الفورموتيرول.'],
    ['Clarithromycin', W, 'Raises systemic budesonide.', 'يرفع البوديزونيد الجهازي.']
  ],
  ask:['inhaler', 'reliever'] },

{ sci:'Beclometasone', ar:'بيكلوميتازون', atc:'R03BA01', cat:'res.inhaledsteroid', form:'inhaler',
  doses:['50 mcg/dose', '100 mcg/dose', '250 mcg/dose'], brand:['Clenil', 'Qvar'], aka:['Beclomethasone'],
  notes:{en:'A pure preventer — no use during an attack. Rinse the mouth every time.',
         ar:'وقائي محض — لا يفيد أثناء النوبة. المضمضة بعد كل استعمال.'},
  ask:['inhaler', 'reliever'] },

{ sci:'Budesonide', ar:'بوديسونايد', atc:'R03BA02', cat:'res.inhaledsteroid', form:'inhaler',
  doses:['100 microgram', '200 microgram Turbuhaler', '0.25 mg/mL and 0.5 mg/mL nebuliser suspension', '64 microgram nasal spray', '3 mg capsule (gut)'], brand:['Pulmicort', 'Rhinocort', 'Entocort'],
  tags:['sub3a4'],
  notes:{en:'A preventer: use it every day, even when well. Rinse the mouth and spit after each inhaled dose to avoid thrush and hoarseness.',
         ar:'وقائي: يُستعمل كل يوم حتى في الأيام الجيدة. تمضمض وابصق بعد كل استنشاق لتجنّب القلاع وبحّة الصوت.'},
  ask:['inhaler', 'reliever'] },

{ sci:'Fluticasone', ar:'فلوتيكازون', atc:'R03BA05', cat:'res.inhaledsteroid', form:'inhaler',
  doses:['50', '125', '250 microgram/dose inhaler', '50 microgram nasal spray (propionate)', '27.5 microgram nasal spray (furoate)', 'with salmeterol or vilanterol'], brand:['Flixotide', 'Flixonase', 'Avamys'], aka:['Fluticasone propionate', 'Fluticasone furoate'],
  tags:['sub3a4'],
  notes:{en:'A preventer: every day, even when well. Rinse the mouth and spit after each inhaled dose. Nasal sprays take a few days to reach full effect.',
         ar:'وقائي: كل يوم حتى في الأيام الجيدة. تمضمض وابصق بعد كل استنشاق. بخاخات الأنف تحتاج بضعة أيام لتبلغ أثرها الكامل.'},
  ix:[
    ['Ritonavir', C, 'Cushing’s syndrome and adrenal suppression — avoid.', 'متلازمة كوشينغ وتثبيط الكظر — يُتجنّب.']
  ],
  ask:['inhaler', 'reliever'] },

{ sci:'Ciclesonide', ar:'سيكليسونايد', atc:'R03BA08', cat:'res.inhaledsteroid', form:'inhaler',
  doses:['80 microgram', '160 microgram/dose'], brand:['Alvesco'],
  notes:{en:'Once a day as a preventer. It causes less thrush than other inhaled steroids, but rinsing the mouth is still wise.',
         ar:'مرة واحدة يومياً كوقائي. يسبّب قلاعاً أقل من غيره من الكورتيزونات المستنشقة، ويبقى المضمضة تصرفاً حكيماً.'},
  ask:['inhaler', 'reliever'] },

/* ---------- Other asthma and COPD medicines ---------- */
{ sci:'Montelukast', ar:'مونتيلوكاست', atc:'R03DC03', cat:'res.asthma', form:'tablet',
  doses:['4 mg', '5 mg', '10 mg'], brand:['Singulair'],
  take:['evening'],
  notes:{en:'In the evening. Mood change, nightmares and other neuropsychiatric effects are a recognised risk — report them and stop.',
         ar:'مساءً. اضطرابات نفسية وكوابيس وتغيّر مزاج أثر معروف — يستوجب الإبلاغ والتوقف.'},
  ix:[
    ['Phenobarbital', W, 'Lowers montelukast levels.', 'يقلّل مستوى المونتيلوكاست.']
  ],
  ask:['mood', 'whoFor'] },

{ sci:'Roflumilast', ar:'روفلوميلاست', atc:'R03DX07', cat:'res.asthma', form:'tablet',
  doses:['250 microgram', '500 microgram'], brand:['Daxas'],
  tags:['inducerSensitive'],
  notes:{en:'Once a day for severe COPD with frequent flare-ups. Weight loss, diarrhoea and trouble sleeping are common; report low mood.',
         ar:'مرة واحدة يومياً للانسداد الرئوي الشديد مع نوبات متكررة. نقص الوزن والإسهال وصعوبة النوم شائعة؛ أبلغ عن انخفاض المزاج.'},
  ci:['hepModSevere'],
  ask:['mood', 'liver'] },

{ sci:'Omalizumab', ar:'أوماليزوماب', atc:'R03DX05', cat:'res.asthma', form:'injection',
  doses:['75 mg', '150 mg prefilled syringe'], brand:['Xolair'],
  notes:{en:'An injection every two or four weeks for severe allergic asthma or chronic hives; the first doses are given where anaphylaxis can be treated.',
         ar:'حقنة كل أسبوعين أو أربعة للربو التحسسي الشديد أو الشرى المزمن؛ تُعطى الجرعات الأولى حيث يمكن علاج التأق.'},
  ask:['allergy', 'cold'] },

{ sci:'Mepolizumab', ar:'ميبوليزوماب', atc:'R03DX09', cat:'res.asthma', form:'injection',
  doses:['100 mg'], brand:['Nucala'],
  notes:{en:'A monthly injection under the skin for severe eosinophilic asthma. Worm infections should be treated before starting.',
         ar:'حقنة شهرية تحت الجلد للربو اليوزيني الشديد. تُعالج الإصابات بالديدان قبل البدء.'},
  ask:['injectTech', 'cold'] },

{ sci:'Benralizumab', ar:'بنراليزوماب', atc:'R03DX10', cat:'res.asthma', form:'injection',
  doses:['30 mg'], brand:['Fasenra'],
  notes:{en:'An injection every four weeks for the first three doses, then every eight weeks, for severe eosinophilic asthma.',
         ar:'حقنة كل أربعة أسابيع في الجرعات الثلاث الأولى، ثم كل ثمانية أسابيع، للربو اليوزيني الشديد.'},
  ask:['injectTech', 'cold'] },

/* ---------- Other respiratory ---------- */

{ sci:'Pirfenidone', ar:'بيرفينيدون', atc:'L04AX05', cat:'res.other', form:'tablet',
  doses:['267 mg', '801 mg'], brand:['Esbriet'],
  take:['withFood'],
  notes:{en:'With food, built up over two weeks. It causes sunburn-like rashes — avoid the sun and use a high-factor sunscreen. Liver tests are checked.',
         ar:'مع الطعام، تُرفع الجرعة خلال أسبوعين. يسبّب طفحاً يشبه حروق الشمس — تجنّب الشمس واستعمل واقياً عالي الحماية. تُفحص وظائف الكبد.'},
  ix:[
    ['Fluvoxamine', C, 'Raises pirfenidone several-fold — contraindicated.', 'يرفع البيرفينيدون أضعافاً — ممنوع الجمع.'],
    ['Ciprofloxacin', S, 'Raises pirfenidone — a lower dose is needed.', 'يرفع البيرفينيدون — تلزم جرعة أقل.']
  ],
  ci:['hepSevere', 'renal30'],
  ask:['sun', 'smoke', 'liver'] },

{ sci:'Nintedanib', ar:'نينتيدانيب', atc:'L01EX09', cat:'res.other', form:'capsule',
  doses:['100 mg', '150 mg'], brand:['Ofev'],
  take:['withFood'],
  notes:{en:'Twice a day with food. Diarrhoea is very common — start loperamide at the first loose stool and drink plenty. It causes birth defects.',
         ar:'مرتين يومياً مع الطعام. الإسهال شائع جداً — ابدأ اللوبيراميد عند أول براز ليّن واشرب كثيراً. يسبّب تشوّهات للجنين.'},
  ix:[
    ['#anticoag', W, 'More bleeding.', 'نزف أكثر.']
  ],
  ci:['pregTeratogen', 'hepModSevere'],
  ask:['pregTest', 'liver', 'thinner'] },

{ sci:'Dornase alfa', ar:'دورناز ألفا', atc:'R05CB13', cat:'res.other', form:'solution',
  doses:['2.5 mg/2.5 mL nebuliser ampoule'], brand:['Pulmozyme'],
  notes:{en:'Once a day by jet nebuliser for cystic fibrosis. Keep in the fridge, and never mix it with other nebules.',
         ar:'مرة واحدة يومياً بجهاز إرذاذ نفّاث للتليّف الكيسي. يُحفظ في الثلاجة، ولا يُمزج أبداً مع أمبولات إرذاذ أخرى.'},
  ask:['cold', 'inhaler'] },

{ sci:'Caffeine citrate', ar:'سترات الكافيين', atc:'N06BC01', cat:'res.other', form:'solution',
  doses:['20 mg/mL oral solution', '20 mg/mL injection'], brand:['Peyona', 'Cafcit'],
  notes:{en:'For breathing pauses in premature babies, once a day; heart rate and feeding are watched.',
         ar:'لتوقّف التنفس عند الخدّج، مرة واحدة يومياً؛ تُراقب سرعة القلب والتغذية.'},
  ask:['childAge'] },

{ sci:'Doxapram', ar:'دوكسابرام', atc:'R07AB01', cat:'res.other', form:'injection',
  doses:['20 mg/mL'], brand:['Dopram'],
  notes:{en:'A hospital respiratory stimulant, given by infusion under close monitoring.',
         ar:'منبّه تنفسي للمستشفى، يُعطى تسريباً مع مراقبة دقيقة.'},
  ci:['epilepsy', 'uncontrolledHtn', 'ihd'],
  ask:['epilepsy', 'heart'] },

{ sci:'Pulmonary surfactant', ar:'مادة السورفاكتانت الرئوية', atc:'R07AA', cat:'res.other', form:'solution',
  doses:['poractant alfa 120 mg/1.5 mL', 'beractant 25 mg/mL', 'calfactant 35 mg/mL'], brand:['Curosurf', 'Survanta', 'Infasurf'], aka:['Poractant alfa', 'Beractant', 'Calfactant'],
  notes:{en:'Given into the windpipe of premature babies with breathing distress, in the neonatal unit only.',
         ar:'يُعطى في القصبة الهوائية للخدّج المصابين بضائقة تنفسية، في وحدة حديثي الولادة فقط.'},
  ask:['childAge'] }

];
