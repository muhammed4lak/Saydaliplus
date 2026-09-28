/* Blood: iron and anaemia, bleeding and clotting factors, iron chelators
   (thalassaemia is common in Iraq), plasma products and other blood
   disorders. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Iron and anaemia ---------- */
{ sci:'Ferrous sulfate', ar:'كبريتات الحديدوز', atc:'B03AA07', cat:'bld.anaemia', form:'tablet',
  doses:['200 mg', '325 mg', '60 mg/5 mL'], brand:['Ferrograd'], aka:['Ferrous sulphate'],
  tags:['polyvalent'],
  notes:{en:'Empty stomach with vitamin C absorbs best; with food if that is not tolerated. Black stools are expected. Two hours away from tea.',
         ar:'على معدة فارغة مع فيتامين C لأفضل امتصاص، ومع الطعام إذا لم يُحتمل. البراز الأسود متوقّع. بعيداً عن الشاي بساعتين.'},
  ix:[
    ['Levothyroxine', S, 'Blocks levothyroxine absorption — space by four hours.', 'يمنع امتصاص الليفوثيروكسين — باعد أربع ساعات.'],
    ['Doxycycline', S, 'Chelates with doxycycline and loses absorption.', 'يرتبط بالدوكسيسيكلين ويفقد الامتصاص.'],
    ['Ciprofloxacin', S, 'Chelates with ciprofloxacin and loses absorption.', 'يرتبط بالسيبروفلوكساسين ويفقد الامتصاص.']
  ],
  ci:[{en:'Haemochromatosis', ar:'داء ترسّب الأصبغة الدموية'}, {en:'Anaemia not due to iron deficiency', ar:'فقر دم غير ناجم عن عوز الحديد'}],
  ask:['childAge', 'antacids'] },

{ sci:'Folic acid', ar:'حمض الفوليك', atc:'B03BB01', cat:'bld.anaemia', form:'tablet',
  doses:['400 mcg', '1 mg', '5 mg'],
  notes:{en:'400 micrograms from a month before conception to week twelve; 5 mg with diabetes, an antiepileptic, or a previous neural tube defect.',
         ar:'400 ميكروغرام قبل الحمل بشهر وحتى الأسبوع الثاني عشر؛ 5 ملغ مع السكري أو مضادات الاختلاج أو سوابق عيب أنبوب عصبي.'},
  ix:[
    ['Methotrexate', W, 'Given on a different day from the methotrexate.', 'يُعطى بيوم مختلف عن الميثوتريكسيت.'],
    ['Phenytoin', S, 'Lowers phenytoin levels.', 'يخفض مستوى الفينيتوين.']
  ],
  ci:[{en:'Untreated B12 deficiency anaemia', ar:'فقر دم بعوز B12 غير معالج'}],
  ask:['preg', 'methotrexate'] },

{ sci:'Ferrous fumarate', ar:'فومارات الحديدوز', atc:'B03AA02', cat:'bld.anaemia', form:'tablet',
  doses:['200 mg', '322 mg', '140 mg/5 mL syrup'], brand:['Galfer', 'Fersaday'],
  tags:['polyvalent'],
  notes:{en:'Best absorbed on an empty stomach; with food if it upsets you. Stools turn black — that is expected. Keep it away from children: iron overdose is dangerous.',
         ar:'يُمتص أفضل على معدة فارغة؛ ومع الطعام إن أزعجك. يسودّ البراز — وهذا متوقع. أبعده عن الأطفال: جرعة الحديد الزائدة خطيرة.'},
  ask:['childAge', 'antacids'] },

{ sci:'Ferrous gluconate', ar:'غلوكونات الحديدوز', atc:'B03AA03', cat:'bld.anaemia', form:'tablet',
  doses:['300 mg'], brand:['Fergon'],
  tags:['polyvalent'],
  notes:{en:'Gentler on the stomach than ferrous sulfate. Black stools are expected. Not with tea, milk or antacids at the same time. Keep away from children.',
         ar:'ألطف على المعدة من كبريتات الحديدوز. سواد البراز متوقع. لا يؤخذ مع الشاي أو الحليب أو مضادات الحموضة في الوقت نفسه. أبعده عن الأطفال.'},
  ask:['childAge', 'antacids'] },

{ sci:'Iron polymaltose', ar:'الحديد متعدد المالتوز', atc:'B03AB05', cat:'bld.anaemia', form:'syrup',
  doses:['50 mg/5 mL syrup', '50 mg/mL drops', '100 mg chewable tablet', '100 mg/2 mL injection'], brand:['Maltofer', 'Ferrum Hausmann'], aka:['Ferric hydroxide polymaltose complex'],
  notes:{en:'Can be taken with food and causes less stomach upset than iron salts. Stools may darken. Drops for infants are measured by the dropper, not a spoon.',
         ar:'يمكن أخذه مع الطعام ويسبّب اضطراب معدة أقل من أملاح الحديد. قد يغمق لون البراز. نقط الرضّع تُقاس بالقطّارة لا بالملعقة.'},
  ci:[{en:'Anaemia not due to iron deficiency', ar:'فقر دم غير ناجم عن عوز الحديد'}, {en:'Iron overload (e.g. thalassaemia major)', ar:'فرط الحديد (كالثلاسيميا الكبرى)'}],
  ask:['childAge', {en:'Has the anaemia been confirmed as iron deficiency (not thalassaemia)?', ar:'هل تأكّد أن فقر الدم بسبب نقص الحديد (وليس ثلاسيميا)؟'}] },

{ sci:'Iron sucrose', ar:'سكروز الحديد', atc:'B03AC02', cat:'bld.anaemia', form:'injection',
  doses:['100 mg/5 mL ampoule'], brand:['Venofer'],
  notes:{en:'A slow intravenous injection or infusion in hospital or clinic, with 30 minutes of observation afterwards for allergic reactions. Oral iron is stopped while it is given.',
         ar:'حقن وريدي بطيء أو تسريب في المستشفى أو العيادة، مع مراقبة 30 دقيقة بعده لتفاعلات التحسّس. يُوقف الحديد الفموي خلال إعطائه.'},
  ci:[{en:'Anaemia not due to iron deficiency', ar:'فقر دم غير ناجم عن عوز الحديد'}, {en:'Iron overload', ar:'فرط الحديد'}, 'preg1'],
  ask:['allergy', 'preg'] },

{ sci:'Ferric carboxymaltose', ar:'كربوكسي مالتوز الحديديك', atc:'B03AC01', cat:'bld.anaemia', form:'injection',
  doses:['500 mg/10 mL', '1000 mg/20 mL'], brand:['Ferinject'],
  notes:{en:'An intravenous infusion that replaces iron in one or two sittings, with observation afterwards. It can lower blood phosphate — tiredness or bone pain later should be reported.',
         ar:'تسريب وريدي يعوّض الحديد في جلسة أو جلستين، مع مراقبة بعده. قد يخفض الفوسفات في الدم — أبلغ عن التعب أو ألم العظام لاحقاً.'},
  ci:[{en:'Anaemia not due to iron deficiency', ar:'فقر دم غير ناجم عن عوز الحديد'}, {en:'Iron overload', ar:'فرط الحديد'}, 'preg1'],
  ask:['allergy', 'preg'] },

{ sci:'Cyanocobalamin', ar:'سيانوكوبالامين', atc:'B03BA01', cat:'bld.anaemia', form:'injection',
  doses:['1000 microgram/mL injection', '1000 microgram tablet'], brand:['Cytamen'], aka:['Vitamin B12'],
  notes:{en:'For B12 deficiency, the injections follow a schedule — often for life after the loading course when absorption is the problem. Urine may turn pinkish; that is harmless.',
         ar:'لنقص B12، تُعطى الحقن وفق جدول — غالباً مدى الحياة بعد الجرعات الأولى إن كانت المشكلة في الامتصاص. قد يصبح البول وردياً؛ وهذا غير ضار.'},
  ask:['otherMeds', 'whoFor'] },

{ sci:'Hydroxocobalamin', ar:'هيدروكسوكوبالامين', atc:'B03BA03', cat:'bld.anaemia', form:'injection',
  doses:['1000 microgram/mL', '5 g vial (cyanide antidote)'], brand:['Neo-Cytamen', 'Cyanokit'],
  notes:{en:'For B12 deficiency, an injection every two to three months after the loading doses. The 5 g vial is the antidote for cyanide poisoning and turns urine red.',
         ar:'لنقص B12، حقنة كل شهرين إلى ثلاثة بعد الجرعات الأولى. عبوة 5 غم هي ترياق التسمّم بالسيانيد وتجعل البول أحمر.'},
  ask:['whoFor'] },

{ sci:'Mecobalamin', ar:'ميكوبالامين', atc:'B03BA05', cat:'bld.anaemia', form:'tablet',
  doses:['500 microgram', '1500 microgram', '500 microgram/mL injection'], brand:['Methycobal'], aka:['Methylcobalamin'],
  notes:{en:'A form of vitamin B12 used for nerve pain and deficiency, usually three times a day. Mild stomach upset is uncommon.',
         ar:'شكل من فيتامين B12 يُستعمل لآلام الأعصاب والنقص، ثلاث مرات يومياً عادة. اضطراب المعدة الخفيف غير شائع.'},
  ask:['diabetes', 'otherMeds'] },

{ sci:'Erythropoietin', ar:'إريثروبويتين', atc:'B03XA01', cat:'bld.anaemia', form:'injection',
  doses:['2,000 IU', '4,000 IU', '10,000 IU prefilled syringe'], brand:['Eprex', 'Recormon', 'Binocrit'], aka:['Epoetin alfa', 'Epoetin beta', 'Recombinant human erythropoietin', 'EPO'],
  notes:{en:'Injected under the skin (or into the vein at dialysis). Keep it in the fridge. Blood pressure and haemoglobin are checked — too high a haemoglobin raises the risk of clots and stroke.',
         ar:'يُحقن تحت الجلد (أو في الوريد أثناء الغسيل). يُحفظ في الثلاجة. يُفحص الضغط والهيموغلوبين — الهيموغلوبين المرتفع أكثر من اللازم يزيد خطر الجلطات والسكتة.'},
  ci:['uncontrolledHtn', {en:'Pure red cell aplasia after erythropoietin', ar:'عدم تنسّج الكريات الحمر الصافي بعد الإريثروبويتين'}],
  ask:['bp', 'cold', 'injectTech'] },

{ sci:'Darbepoetin alfa', ar:'داربيبويتين ألفا', atc:'B03XA02', cat:'bld.anaemia', form:'injection',
  doses:['20–500 microgram prefilled syringe'], brand:['Aranesp'],
  notes:{en:'A longer-acting erythropoietin — weekly to monthly injections. Keep it in the fridge; blood pressure and haemoglobin are checked.',
         ar:'إريثروبويتين طويل المفعول — حقن أسبوعية إلى شهرية. يُحفظ في الثلاجة؛ ويُفحص الضغط والهيموغلوبين.'},
  ci:['uncontrolledHtn'],
  ask:['bp', 'cold', 'injectTech'] },

/* ---------- Bleeding control and clotting factors ---------- */

{ sci:'Tranexamic acid', ar:'حمض الترانيكساميك', atc:'B02AA02', cat:'bld.haemostatic', form:'tablet',
  doses:['500 mg', '500 mg/5 mL injection'], brand:['Cyklokapron', 'Transamin'],
  notes:{en:'Reduces bleeding. For heavy periods: three times a day on the bleeding days only, up to four or five days. Not for anyone who has had a blood clot.',
         ar:'يقلّل النزف. للدورة الغزيرة: ثلاث مرات يومياً في أيام النزف فقط، حتى أربعة أو خمسة أيام. لا يُستعمل لمن أُصيب بجلطة سابقاً.'},
  ix:[
    ['#hormonalContraceptive', W, 'Together they raise the clot risk.', 'معاً يرفعان خطر الجلطات.']
  ],
  ci:['vte', {en:'Blood clots in the urine from the kidneys', ar:'خثرات دموية في البول مصدرها الكلى'}, 'renalSevere'],
  ask:['clots', 'ocp', 'kidney'] },

{ sci:'Phytomenadione', ar:'فيتوميناديون', atc:'B02BA01', cat:'bld.haemostatic', form:'injection',
  doses:['10 mg/mL', '2 mg/0.2 mL paediatric', '10 mg tablet'], brand:['Konakion'], aka:['Vitamin K1', 'Vitamin K', 'Phytonadione'],
  notes:{en:'Reverses warfarin and prevents bleeding in newborns. Intravenous doses are given slowly because of rare severe reactions.',
         ar:'يعكس مفعول الوارفارين ويقي حديثي الولادة من النزف. تُعطى الجرعات الوريدية ببطء بسبب تفاعلات شديدة نادرة.'},
  ix:[
    ['Warfarin', S, 'Reverses warfarin for days — the dose must be deliberate.', 'يعكس الوارفارين لأيام — يجب أن تكون الجرعة مقصودة.'],
    ['Acenocoumarol', S, 'Reverses acenocoumarol for days — the dose must be deliberate.', 'يعكس الأسينوكومارول لأيام — يجب أن تكون الجرعة مقصودة.']
  ],
  ask:['thinner', 'whoFor'] },

{ sci:'Etamsylate', ar:'إيتامسيلات', atc:'B02BX01', cat:'bld.haemostatic', form:'tablet',
  doses:['250 mg', '500 mg', '250 mg/2 mL injection'], brand:['Dicynone', 'Dicynene'], aka:['Ethamsylate'],
  notes:{en:'Reduces small-vessel bleeding such as heavy periods — taken on the bleeding days. Headache and nausea can occur.',
         ar:'يقلّل نزف الأوعية الصغيرة كالدورة الغزيرة — يؤخذ في أيام النزف. قد يسبّب صداعاً وغثياناً.'},
  ci:['porphyria'],
  ask:['preg', 'bleeding'] },

{ sci:'Factor VIII', ar:'العامل الثامن', atc:'B02BD02', cat:'bld.haemostatic', form:'injection',
  doses:['250 IU', '500 IU', '1000 IU'], brand:['Advate', 'Octanate', 'Koate'], aka:['Coagulation factor VIII', 'Antihaemophilic factor', 'Octocog alfa'],
  notes:{en:'For haemophilia A — injected into a vein at home or in clinic as the haemophilia centre plans. Keep the cold chain and record every dose.',
         ar:'للناعور (الهيموفيليا) A — يُحقن في الوريد في البيت أو العيادة حسب خطة مركز الناعور. حافظ على سلسلة التبريد وسجّل كل جرعة.'},
  ask:['injectTech', 'cold'] },

{ sci:'Factor IX', ar:'العامل التاسع', atc:'B02BD04', cat:'bld.haemostatic', form:'injection',
  doses:['500 IU', '1000 IU'], brand:['BeneFIX', 'Octanine', 'Immunine'], aka:['Coagulation factor IX', 'Nonacog alfa'],
  notes:{en:'For haemophilia B — injected into a vein as planned by the haemophilia centre. Keep the cold chain and record every dose.',
         ar:'للناعور B — يُحقن في الوريد حسب خطة مركز الناعور. حافظ على سلسلة التبريد وسجّل كل جرعة.'},
  ask:['injectTech', 'cold'] },

{ sci:'Eptacog alfa', ar:'إبتاكوغ ألفا', atc:'B02BD08', cat:'bld.haemostatic', form:'injection',
  doses:['1 mg', '2 mg', '5 mg'], brand:['NovoSeven'], aka:['Recombinant factor VIIa'],
  notes:{en:'Recombinant factor VIIa for bleeds in haemophilia with inhibitors and some other bleeding disorders; given intravenously by the haemophilia team.',
         ar:'العامل السابع المؤتلف لنزف الناعور المصحوب بمثبطات وبعض اضطرابات النزف الأخرى؛ يُعطى وريدياً بإشراف فريق الناعور.'},
  ask:['clots'] },

{ sci:'Factor VIII inhibitor bypassing activity', ar:'عامل تجاوز مثبطات العامل الثامن', atc:'B02BD03', cat:'bld.haemostatic', form:'injection',
  doses:['500 U', '1000 U'], brand:['FEIBA'], aka:['Anti-inhibitor coagulant complex'],
  notes:{en:'For bleeds in haemophilia with inhibitors, by intravenous infusion under the haemophilia team.',
         ar:'لنزف الناعور المصحوب بمثبطات، بالتسريب الوريدي بإشراف فريق الناعور.'},
  ci:['vte'],
  ask:['clots', 'otherMeds'] },

{ sci:'Prothrombin complex concentrate', ar:'مركّز معقّد البروثرومبين', atc:'B02BD01', cat:'bld.haemostatic', form:'injection',
  doses:['500 IU'], brand:['Octaplex', 'Beriplex'], aka:['PCC', 'Human prothrombin complex'],
  notes:{en:'Hospital use to reverse warfarin urgently in serious bleeding, given with vitamin K.',
         ar:'للمستشفى لعكس الوارفارين بسرعة في النزف الخطير، ويُعطى مع فيتامين K.'},
  ci:[{en:'Heparin-induced thrombocytopenia', ar:'نقص الصفيحات المحرّض بالهيبارين'}],
  ask:['thinner'] },

{ sci:'Von Willebrand factor', ar:'عامل فون ويلبراند', atc:'B02BD06', cat:'bld.haemostatic', form:'injection',
  doses:['500 IU', '1000 IU (with factor VIII)'], brand:['Haemate P', 'Wilate'],
  notes:{en:'For von Willebrand disease — intravenously before surgery or for bleeds, as the haemophilia centre advises.',
         ar:'لداء فون ويلبراند — وريدياً قبل الجراحة أو عند النزف، حسب توصية مركز الناعور.'},
  ask:['injectTech'] },

{ sci:'Fibrinogen concentrate', ar:'مركّز الفيبرينوجين', atc:'B02BB01', cat:'bld.haemostatic', form:'injection',
  doses:['1 g'], brand:['Haemocomplettan', 'RiaSTAP'], aka:['Human fibrinogen'],
  notes:{en:'Hospital use for bleeding with a low fibrinogen level.',
         ar:'للمستشفى للنزف مع انخفاض الفيبرينوجين.'},
  ask:['clots'] },

{ sci:'Factor XIII concentrate', ar:'مركّز العامل الثالث عشر', atc:'B02BD07', cat:'bld.haemostatic', form:'injection',
  doses:['250 IU'], brand:['Fibrogammin'],
  notes:{en:'For inherited factor XIII deficiency — regular intravenous doses to prevent bleeding.',
         ar:'لعوز العامل الثالث عشر الوراثي — جرعات وريدية منتظمة للوقاية من النزف.'},
  ask:['injectTech'] },

{ sci:'Emicizumab', ar:'إيميسيزوماب', atc:'B02BX06', cat:'bld.haemostatic', form:'injection',
  doses:['30 mg', '60 mg', '105 mg', '150 mg'], brand:['Hemlibra'],
  notes:{en:'An injection under the skin, weekly or less often, that prevents bleeds in haemophilia A. The plan must say how breakthrough bleeds are treated — FEIBA with it can cause dangerous clots.',
         ar:'حقنة تحت الجلد أسبوعياً أو أقل، تقي من النزف في الناعور A. يجب أن تحدد الخطة علاج النزف الطارئ — فالـ FEIBA معه قد يسبّب جلطات خطيرة.'},
  ix:[
    ['Factor VIII inhibitor bypassing activity', C, 'Thrombotic microangiopathy and clots — avoid, or the lowest dose under specialist advice.', 'اعتلال أوعية دقيقة خثاري وجلطات — يُتجنّب، أو بأقل جرعة بإشراف مختص.']
  ],
  ask:['injectTech', 'cold'] },

/* ---------- Iron chelators ---------- */

{ sci:'Deferasirox', ar:'ديفيراسيروكس', atc:'V03AC03', cat:'bld.chelator', form:'tablet',
  doses:['90 mg', '180 mg', '360 mg film-coated', '125 mg', '250 mg', '500 mg dispersible'], brand:['Exjade', 'Jadenu'],
  notes:{en:'Once a day. Dispersible tablets are stirred into water or juice on an empty stomach; film-coated ones can be taken with a light meal. Kidney and liver tests monthly, hearing and eyes yearly.',
         ar:'مرة واحدة يومياً. الأقراص القابلة للانحلال تُذاب في الماء أو العصير على معدة فارغة؛ والمغلّفة يمكن أخذها مع وجبة خفيفة. فحص الكلى والكبد شهرياً، والسمع والعين سنوياً.'},
  ix:[
    ['Aluminium hydroxide', W, 'Do not take aluminium antacids at the same time.', 'لا تُؤخذ مضادات الحموضة الحاوية على الألمنيوم معه.'],
    ['#nsaid', W, 'More stomach ulceration and bleeding.', 'تقرّح ونزف معدي أكثر.']
  ],
  ci:[{en:'Creatinine clearance below 60 mL/min', ar:'تصفية كرياتينين أقل من 60 مل/دقيقة'}, 'hepSevere', {en:'Platelets below 50,000', ar:'صفيحات أقل من 50,000'}],
  ask:['kidney', 'labs', 'hearing'] },

{ sci:'Deferoxamine', ar:'ديفيروكسامين', atc:'V03AC01', cat:'bld.chelator', form:'injection',
  doses:['500 mg vial'], brand:['Desferal'], aka:['Desferrioxamine'],
  notes:{en:'A slow infusion under the skin over 8–12 hours, usually five to seven nights a week, with a pump. Eyes and hearing are checked yearly. It is also the antidote for iron poisoning.',
         ar:'تسريب بطيء تحت الجلد خلال 8–12 ساعة، عادة خمس إلى سبع ليالٍ في الأسبوع، بمضخة. تُفحص العين والسمع سنوياً. وهو أيضاً ترياق التسمّم بالحديد.'},
  ci:['anuria'],
  ask:['hearing', 'vision', 'labs'] },

{ sci:'Deferiprone', ar:'ديفيريبرون', atc:'V03AC02', cat:'bld.chelator', form:'tablet',
  doses:['500 mg', '1000 mg', '100 mg/mL solution'], brand:['Ferriprox'],
  notes:{en:'It can wipe out the white cells: a blood count every week, and at the first sign of fever or sore throat stop it and get a count the same day. Urine may turn reddish-brown.',
         ar:'قد يُفني الكريات البيض: تعداد دم كل أسبوع، وعند أول حرارة أو التهاب حلق يُوقف ويُجرى التعداد في اليوم نفسه. قد يصبح البول بنياً محمراً.'},
  ci:['marrow', {en:'Previous agranulocytosis', ar:'ندرة المحبّبات سابقاً'}],
  ask:['infection', 'labs'] },

/* ---------- Plasma products and volume expanders ---------- */

{ sci:'Human albumin', ar:'الألبومين البشري', atc:'B05AA01', cat:'bld.plasma', form:'injection',
  doses:['5%', '20%', '25%'], brand:['Albutein', 'Human Albumin Grifols'], aka:['Albumin'],
  notes:{en:'A hospital infusion for low blood volume, burns, or alongside large fluid drainage in liver disease.',
         ar:'تسريب في المستشفى لنقص حجم الدم والحروق، أو مع سحب كميات كبيرة من السوائل في أمراض الكبد.'},
  ci:['hfSevere', {en:'Severe anaemia', ar:'فقر دم شديد'}],
  ask:['heartFailure'] },

{ sci:'Plasma protein fraction', ar:'جزء بروتين البلازما', atc:'B05AA02', cat:'bld.plasma', form:'injection',
  doses:['5% 250 mL'],
  notes:{en:'A hospital infusion to restore blood volume.',
         ar:'تسريب في المستشفى لتعويض حجم الدم.'},
  ci:['hfSevere'],
  ask:['heartFailure'] },

{ sci:'Succinylated gelatin', ar:'الجيلاتين المُسكسن', atc:'B05AA06', cat:'bld.plasma', form:'injection',
  doses:['4% 500 mL'], brand:['Gelofusine'], aka:['Gelatin polysuccinate'],
  notes:{en:'A plasma substitute infused to restore blood volume; allergic reactions are watched for.',
         ar:'بديل بلازما يُسرّب لتعويض حجم الدم؛ تُراقب تفاعلات التحسّس.'},
  ci:['hfSevere'],
  ask:['allergy'] },

{ sci:'Hydroxyethyl starch', ar:'نشاء هيدروكسي إيثيل', atc:'B05AA07', cat:'bld.plasma', form:'injection',
  doses:['6% 500 mL'], brand:['Voluven', 'HAES-steril'], aka:['HES'],
  notes:{en:'A plasma substitute now restricted: not in sepsis, critical illness, burns or kidney impairment, where it harms the kidneys.',
         ar:'بديل بلازما صار مقيّداً: لا يُستعمل في الإنتان أو الحالات الحرجة أو الحروق أو القصور الكلوي، حيث يؤذي الكلى.'},
  ci:['renal', {en:'Sepsis, burns or critical illness', ar:'الإنتان أو الحروق أو الحالات الحرجة'}],
  ask:['kidney'] },

/* ---------- Other blood disorders ---------- */

{ sci:'Hydroxycarbamide', ar:'هيدروكسي كارباميد', atc:'L01XX05', cat:'bld.other', form:'capsule',
  doses:['500 mg', '100 mg/mL solution'], brand:['Hydrea', 'Siklos'], aka:['Hydroxyurea'],
  tags:['immunosuppressant'],
  notes:{en:'For sickle cell disease, polycythaemia and some leukaemias. Regular blood counts. Handle capsules with gloves or washed hands; it causes birth defects, so both partners use contraception.',
         ar:'لفقر الدم المنجلي وكثرة الحمر وبعض أنواع الابيضاض. تعداد دم منتظم. تُمسك الكبسولات بقفازات أو بيدين مغسولتين؛ يسبّب تشوّهات للجنين، فيستعمل الزوجان وسيلة لمنع الحمل.'},
  ci:['pregTeratogen', 'marrow'],
  ask:['pregTest', 'labs', 'infection'] },

{ sci:'Eltrombopag', ar:'إلترومبوباغ', atc:'B02BX05', cat:'bld.other', form:'tablet',
  doses:['25 mg', '50 mg'], brand:['Revolade', 'Promacta'],
  tags:['chelatable'],
  notes:{en:'On an empty stomach, 2 hours before or 4 hours after dairy, antacids or mineral supplements. Liver tests and platelet counts are checked.',
         ar:'على معدة فارغة، قبل منتجات الألبان أو مضادات الحموضة أو مكمّلات المعادن بساعتين أو بعدها بأربع ساعات. تُفحص وظائف الكبد وتعداد الصفيحات.'},
  ci:['hepModSevere'],
  ask:['antacids', 'liver', 'labs'] },

{ sci:'Romiplostim', ar:'روميبلوستيم', atc:'B02BX04', cat:'bld.other', form:'injection',
  doses:['125 microgram', '250 microgram', '500 microgram'], brand:['Nplate'],
  notes:{en:'A weekly injection under the skin for low platelets (ITP), with weekly counts until stable.',
         ar:'حقنة أسبوعية تحت الجلد لنقص الصفيحات المناعي، مع تعداد أسبوعي حتى الاستقرار.'},
  ask:['labs'] },

{ sci:'Anagrelide', ar:'أناغريليد', atc:'L01XX35', cat:'bld.other', form:'capsule',
  doses:['0.5 mg'], brand:['Agrylin', 'Xagrid'],
  tags:['qt'],
  notes:{en:'Lowers a high platelet count. Palpitations, headache and diarrhoea are common, especially at first.',
         ar:'يخفض الصفيحات المرتفعة. الخفقان والصداع والإسهال شائعة، خاصة في البداية.'},
  ci:['hepModSevere'],
  ask:['heart', 'rhythm'] }

];
