/* Women's health: contraception, female hormones and HRT, fertility,
   pregnancy and labour, vaginal preparations. A combined pill links to both
   of its hormones in the register, so the oestrogen and the progestogen each
   carry the class `hormonalContraceptive`. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Contraception ---------- */

{ sci:'Ethinylestradiol', ar:'إيثينيل إستراديول', atc:'G03CA01', cat:'wom.contraceptive', form:'tablet',
  doses:['20 microgram', '30 microgram', '35 microgram (in combined pills)'], brand:['Microgynon', 'Yasmin', 'Marvelon', 'Diane-35'], aka:['Ethinyloestradiol', 'Ethinyl estradiol'],
  tags:['hormonalContraceptive', 'inducerSensitive'], take:['sameTime'],
  notes:{en:'The combined pill: one a day at the same time. More than 24 hours late, or vomiting within 3 hours, needs condoms for 7 days (see the leaflet). Stop and get help for calf pain, chest pain, breathlessness or a sudden severe headache.',
         ar:'الحبة المركّبة: واحدة يومياً في الوقت نفسه. التأخّر أكثر من 24 ساعة، أو القيء خلال 3 ساعات، يستوجب الواقي 7 أيام (انظري النشرة). أوقفيها واطلبي المساعدة عند ألم الساق أو ألم الصدر أو ضيق النفس أو صداع شديد مفاجئ.'},
  ci:['vte', 'migraineAura', 'smoker35', 'estrogenCancer', 'hepActive', 'uncontrolledHtn'],
  ask:['clots', 'smoke', 'migraineAura'] },

{ sci:'Levonorgestrel', ar:'ليفونورجيستريل', atc:'G03AC03', cat:'wom.contraceptive', form:'tablet',
  doses:['1.5 mg emergency', '0.15 mg with ethinylestradiol', '52 mg intrauterine system'], brand:['Postinor', 'Microgynon', 'Mirena'],
  tags:['hormonalContraceptive', 'inducerSensitive'],
  notes:{en:'The emergency pill: as soon as possible, within 72 hours. Vomiting within 3 hours needs another dose. On an enzyme-inducing medicine a double dose or a copper coil is needed. It does not protect against later sex in the same cycle.',
         ar:'حبة الطوارئ: بأسرع وقت، خلال 72 ساعة. القيء خلال 3 ساعات يستوجب جرعة أخرى. مع دواء محرّض للإنزيمات تلزم جرعة مضاعفة أو لولب نحاسي. لا تحمي من علاقة لاحقة في الدورة نفسها.'},
  ask:['ecTiming', 'otherMeds', 'breastfeed'] },

{ sci:'Desogestrel', ar:'ديسوجيستريل', atc:'G03AC09', cat:'wom.contraceptive', form:'tablet',
  doses:['75 microgram progestogen-only', '150 microgram with ethinylestradiol'], brand:['Cerazette', 'Marvelon'],
  tags:['hormonalContraceptive', 'inducerSensitive'], take:['sameTime'],
  notes:{en:'The progestogen-only pill: every day with no break, within 12 hours of the usual time. Irregular bleeding is common; it suits breastfeeding.',
         ar:'حبة البروجستين وحده: كل يوم دون انقطاع، خلال 12 ساعة من الموعد المعتاد. النزف غير المنتظم شائع؛ وتناسب الإرضاع.'},
  ci:['estrogenCancer', 'hepSevere', 'vte'],
  ask:['otherMeds', 'breastfeed'] },

{ sci:'Drospirenone', ar:'دروسبيرينون', atc:'G03AA12', cat:'wom.contraceptive', form:'tablet',
  doses:['3 mg with ethinylestradiol 30 or 20 microgram'], brand:['Yasmin', 'Yaz'],
  tags:['hormonalContraceptive', 'inducerSensitive'], take:['sameTime'],
  notes:{en:'A combined pill, one a day at the same time; the clot risk is somewhat higher than with levonorgestrel pills. It holds on to potassium slightly.',
         ar:'حبة مركّبة، واحدة يومياً في الوقت نفسه؛ خطر الجلطات أعلى قليلاً منه مع حبوب الليفونورجيستريل. تحبس البوتاسيوم قليلاً.'},
  ix:[
    ['#raas', W, 'Can raise potassium — check it in the first month.', 'قد يرفع البوتاسيوم — افحصيه في الشهر الأول.']
  ],
  ci:['vte', 'migraineAura', 'smoker35', 'renalSevere'],
  ask:['clots', 'smoke', 'kidney'] },

{ sci:'Gestodene', ar:'جيستودين', atc:'G03AA10', cat:'wom.contraceptive', form:'tablet',
  doses:['75 microgram with ethinylestradiol'], brand:['Femoden', 'Minulet'],
  tags:['hormonalContraceptive', 'inducerSensitive'], take:['sameTime'],
  notes:{en:'A combined pill, one a day at the same time. Stop and get help for calf pain, chest pain or sudden breathlessness.',
         ar:'حبة مركّبة، واحدة يومياً في الوقت نفسه. أوقفيها واطلبي المساعدة عند ألم الساق أو الصدر أو ضيق النفس المفاجئ.'},
  ci:['vte', 'migraineAura', 'smoker35'],
  ask:['clots', 'smoke', 'migraineAura'] },

{ sci:'Medroxyprogesterone', ar:'ميدروكسي بروجستيرون', atc:'G03AC06', cat:'wom.contraceptive', form:'injection',
  doses:['150 mg/mL every 12 weeks', '5 mg', '10 mg tablet'], brand:['Depo-Provera', 'Provera'], aka:['Medroxyprogesterone acetate'],
  tags:['hormonalContraceptive'],
  notes:{en:'The contraceptive injection every 12–13 weeks. Irregular bleeding is common; fertility can take up to a year to return; long use thins the bones.',
         ar:'حقنة منع الحمل كل 12–13 أسبوعاً. النزف غير المنتظم شائع؛ وقد تحتاج الخصوبة سنة لتعود؛ والاستعمال الطويل يُضعف العظام.'},
  ci:['vaginalBleeding', 'estrogenCancer', 'hepSevere'],
  ask:[{en:'When was your last injection?', ar:'متى كانت آخر حقنة؟'}, 'clots'] },

{ sci:'Etonogestrel', ar:'إيتونوجيستريل', atc:'G03AC08', cat:'wom.contraceptive', form:'injection',
  doses:['68 mg implant (3 years)', 'vaginal ring'], brand:['Implanon', 'Nexplanon', 'NuvaRing'],
  tags:['hormonalContraceptive', 'inducerSensitive'],
  notes:{en:'An implant in the upper arm, effective for three years; irregular bleeding is common. Enzyme-inducing medicines make it unreliable.',
         ar:'غرسة في أعلى الذراع، فعّالة ثلاث سنوات؛ النزف غير المنتظم شائع. الأدوية المحرّضة للإنزيمات تجعلها غير موثوقة.'},
  ci:['estrogenCancer', 'hepSevere', 'vaginalBleeding'],
  ask:['otherMeds', 'clots'] },

{ sci:'Ulipristal', ar:'أوليبريستال', atc:'G03AD02', cat:'wom.contraceptive', form:'tablet',
  doses:['30 mg emergency', '5 mg (fibroids)'], brand:['ellaOne', 'Esmya'],
  tags:['inducerSensitive'],
  notes:{en:'The emergency pill up to 120 hours after sex. Hormonal contraception restarts 5 days later, with condoms until then. Not breastfed for a week after.',
         ar:'حبة الطوارئ حتى 120 ساعة بعد العلاقة. يُستأنف منع الحمل الهرموني بعد 5 أيام، مع الواقي حتى ذلك الحين. لا إرضاع لمدة أسبوع بعدها.'},
  ix:[
    ['#hormonalContraceptive', W, 'Each blunts the other — wait 5 days before restarting the pill.', 'كلٌّ منهما يُضعف الآخر — انتظري 5 أيام قبل استئناف الحبوب.']
  ],
  ci:['hepSevere'],
  ask:['ecTiming', 'otherMeds', 'breastfeed'] },

/* ---------- Female hormones and HRT ---------- */

{ sci:'Estradiol', ar:'إستراديول', atc:'G03CA03', cat:'wom.hormone', form:'tablet',
  doses:['1 mg', '2 mg tablet', '0.06% gel', '25–100 microgram patch', '10 microgram vaginal tablet', 'with norethisterone or dydrogesterone'], brand:['Progynova', 'Estrofem', 'Femoston', 'Vagifem', 'Oestrogel'], aka:['Oestradiol', 'Estradiol valerate'],
  tags:['inducerSensitive'],
  notes:{en:'For menopause symptoms. With a womb, a progestogen must be added. Report calf or chest pain, breathlessness, a breast lump, or bleeding after the menopause.',
         ar:'لأعراض انقطاع الطمث. مع وجود الرحم يجب إضافة بروجستين. أبلغي عن ألم الساق أو الصدر أو ضيق النفس أو كتلة في الثدي أو نزف بعد انقطاع الطمث.'},
  ci:['estrogenCancer', 'vte', 'vaginalBleeding', 'hepActive'],
  ask:['clots', 'hysterectomy', 'pmBleeding'] },

{ sci:'Conjugated estrogens', ar:'الإستروجينات المقترنة', atc:'G03CA57', cat:'wom.hormone', form:'tablet',
  doses:['0.3 mg', '0.625 mg', 'vaginal cream'], brand:['Premarin'],
  tags:['inducerSensitive'],
  notes:{en:'For menopause symptoms; with a womb a progestogen is added. Report calf or chest pain, breast lumps, or bleeding after the menopause.',
         ar:'لأعراض انقطاع الطمث؛ مع وجود الرحم يُضاف بروجستين. أبلغي عن ألم الساق أو الصدر أو كتل الثدي أو نزف بعد انقطاع الطمث.'},
  ci:['estrogenCancer', 'vte', 'vaginalBleeding', 'hepActive'],
  ask:['clots', 'hysterectomy', 'pmBleeding'] },

{ sci:'Estriol', ar:'إستريول', atc:'G03CA04', cat:'wom.hormone', form:'cream',
  doses:['0.1% vaginal cream', '0.5 mg pessary'], brand:['Ovestin'],
  notes:{en:'A vaginal oestrogen for dryness and irritation after the menopause: daily at first, then twice a week. Report any bleeding.',
         ar:'إستروجين مهبلي للجفاف والتهيّج بعد انقطاع الطمث: يومياً في البداية ثم مرتين في الأسبوع. أبلغي عن أي نزف.'},
  ci:['estrogenCancer', 'vaginalBleeding', 'vte'],
  ask:['pmBleeding', 'clots'] },

{ sci:'Progesterone', ar:'بروجستيرون', atc:'G03DA04', cat:'wom.hormone', form:'capsule',
  doses:['100 mg', '200 mg capsule (oral or vaginal)', '25 mg/mL and 50 mg/mL injection', '8% vaginal gel', '400 mg pessary'], brand:['Utrogestan', 'Cyclogest', 'Crinone', 'Prolutex'],
  notes:{en:'Used in IVF, to support early pregnancy, and in HRT. Oral capsules at bedtime (they cause drowsiness); vaginal forms are inserted lying down.',
         ar:'يُستعمل في أطفال الأنابيب ولتثبيت الحمل المبكر وفي العلاج التعويضي. الكبسولات الفموية قبل النوم (تسبّب النعاس)؛ والأشكال المهبلية تُدخل مع الاستلقاء.'},
  ci:['vaginalBleeding', 'hepSevere', 'estrogenCancer'],
  ask:['preg', 'clots', 'liver'] },

{ sci:'Dydrogesterone', ar:'ديدروجيستيرون', atc:'G03DB01', cat:'wom.hormone', form:'tablet',
  doses:['10 mg', 'with estradiol'], brand:['Duphaston', 'Femoston'],
  notes:{en:'For irregular or painful periods, endometriosis, threatened miscarriage and in HRT. It does not stop ovulation and is not a contraceptive.',
         ar:'لاضطراب الدورة أو ألمها وبطانة الرحم المهاجرة والإجهاض المنذر وفي العلاج التعويضي. لا يمنع الإباضة وليس مانعاً للحمل.'},
  ci:['vaginalBleeding', 'hepSevere'],
  ask:['preg', 'liver'] },

{ sci:'Norethisterone', ar:'نوريثيستيرون', atc:'G03DC02', cat:'wom.hormone', form:'tablet',
  doses:['5 mg', 'with estradiol (HRT)'], brand:['Primolut N'], aka:['Norethindrone'],
  notes:{en:'To delay a period or control heavy bleeding: three times a day, starting three days before the period is due. At this dose it is not a contraceptive.',
         ar:'لتأخير الدورة أو ضبط النزف الغزير: ثلاث مرات يومياً، بدءاً قبل موعد الدورة بثلاثة أيام. بهذه الجرعة ليس مانعاً للحمل.'},
  ci:['vte', 'hepActive', 'preg'],
  ask:['clots', 'preg', 'liver'] },

{ sci:'Dienogest', ar:'دينوجيست', atc:'G03DB08', cat:'wom.hormone', form:'tablet',
  doses:['2 mg (endometriosis)', 'with ethinylestradiol or estradiol valerate'], brand:['Visanne', 'Qlaira'],
  tags:['hormonalContraceptive', 'inducerSensitive'], take:['sameTime'],
  notes:{en:'For endometriosis: one a day without a break; irregular bleeding and headache are common. Report low mood.',
         ar:'لبطانة الرحم المهاجرة: واحدة يومياً دون انقطاع؛ النزف غير المنتظم والصداع شائعان. أبلغي عن انخفاض المزاج.'},
  ci:['vte', 'hepSevere', 'vaginalBleeding'],
  ask:['clots', 'mood', 'liver'] },

{ sci:'Cyproterone', ar:'سيبروتيرون', atc:'G03HA01', cat:'wom.hormone', form:'tablet',
  doses:['2 mg with ethinylestradiol 35 microgram', '50 mg', '100 mg'], brand:['Diane-35', 'Androcur'],
  tags:['hormonalContraceptive', 'inducerSensitive'],
  notes:{en:'With ethinylestradiol (Diane-35) for acne and excess hair in women; it also prevents pregnancy, with a higher clot risk than most pills. High doses (Androcur) for prostate cancer need liver tests.',
         ar:'مع الإيثينيل إستراديول (ديان-35) لحب الشباب وزيادة الشعر عند النساء؛ ويمنع الحمل أيضاً، مع خطر جلطات أعلى من معظم الحبوب. الجرعات العالية (أندروكور) لسرطان البروستاتا تحتاج فحوص كبد.'},
  ci:['vte', 'hepActive', {en:'Meningioma', ar:'الورم السحائي'}],
  ask:['clots', 'smoke', 'liver'] },

{ sci:'Tibolone', ar:'تيبولون', atc:'G03CX01', cat:'wom.hormone', form:'tablet',
  doses:['2.5 mg'], brand:['Livial'],
  notes:{en:'For menopause symptoms, at least a year after the last period. Report vaginal bleeding, calf pain or breast lumps.',
         ar:'لأعراض انقطاع الطمث، بعد سنة على الأقل من آخر دورة. أبلغي عن النزف المهبلي أو ألم الساق أو كتل الثدي.'},
  ci:['estrogenCancer', 'vte', 'vaginalBleeding'],
  ask:['clots', 'pmBleeding'] },

/* ---------- Fertility ---------- */

{ sci:'Clomifene', ar:'كلوميفين', atc:'G03GB02', cat:'wom.fertility', form:'tablet',
  doses:['50 mg'], brand:['Clomid'], aka:['Clomiphene', 'Clomiphene citrate'],
  notes:{en:'For five days early in the cycle as instructed, usually for no more than six cycles. Visual disturbance means stop. Twins are more likely.',
         ar:'لخمسة أيام في بداية الدورة حسب التعليمات، ولا يتجاوز عادة ست دورات. اضطراب الرؤية يستوجب الإيقاف. احتمال التوائم أعلى.'},
  ci:['preg', 'hepActive', {en:'Ovarian cysts other than polycystic ovaries', ar:'أكياس المبيض غير المتعددة الكيسات'}, 'vaginalBleeding'],
  ask:['pregTest', 'vision', 'liver'] },

{ sci:'Follitropin', ar:'فوليتروبين', atc:'G03GA05', cat:'wom.fertility', form:'injection',
  doses:['75 IU', '300 IU', '450 IU', '900 IU pen'], brand:['Gonal-f', 'Puregon'], aka:['Follitropin alfa', 'Follitropin beta', 'Recombinant FSH'],
  notes:{en:'Daily injections during IVF, adjusted by scans. Report tummy swelling, pain, vomiting or breathlessness — ovarian hyperstimulation.',
         ar:'حقن يومية أثناء أطفال الأنابيب تُعدّل حسب السونار. أبلغي عن انتفاخ البطن أو ألمه أو القيء أو ضيق النفس — فرط تنبيه المبيض.'},
  ask:['injectTech', 'cold'] },

{ sci:'Urofollitropin', ar:'يوروفوليتروبين', atc:'G03GA04', cat:'wom.fertility', form:'injection',
  doses:['75 IU', '150 IU'], brand:['Fostimon', 'Bravelle'],
  notes:{en:'Daily injections during fertility treatment, adjusted by scans. Report tummy swelling, pain or breathlessness.',
         ar:'حقن يومية أثناء علاج الخصوبة تُعدّل حسب السونار. أبلغي عن انتفاخ البطن أو ألمه أو ضيق النفس.'},
  ask:['injectTech'] },

{ sci:'Lutropin alfa', ar:'لوتروبين ألفا', atc:'G03GA07', cat:'wom.fertility', form:'injection',
  doses:['75 IU vial'], brand:['Luveris'], aka:['Recombinant LH', 'r-hLH'],
  notes:{en:'Given with FSH injections in fertility treatment, under ultrasound monitoring. Report tummy swelling, pain or breathlessness (ovarian hyperstimulation).',
         ar:'يُعطى مع حقن FSH في علاج الخصوبة، مع مراقبة بالأمواج فوق الصوتية. أبلغي عن انتفاخ البطن أو ألمه أو ضيق التنفس (فرط تنبيه المبيض).'},
  ci:['estrogenCancer', 'vaginalBleeding'],
  ask:['injectTech', 'cold'] },

{ sci:'Menotropins', ar:'مينوتروبين', atc:'G03GA02', cat:'wom.fertility', form:'injection',
  doses:['75 IU', '600 IU'], brand:['Menopur'], aka:['Menotrophin', 'hMG'],
  notes:{en:'Daily injections during IVF, adjusted by scans. Report tummy swelling, pain or breathlessness.',
         ar:'حقن يومية أثناء أطفال الأنابيب تُعدّل حسب السونار. أبلغي عن انتفاخ البطن أو ألمه أو ضيق النفس.'},
  ask:['injectTech'] },

{ sci:'Chorionic gonadotrophin', ar:'موجهة الغدد التناسلية المشيمائية', atc:'G03GA01', cat:'wom.fertility', form:'injection',
  doses:['5,000 IU', '10,000 IU', '250 microgram choriogonadotropin alfa'], brand:['Pregnyl', 'Ovitrelle'], aka:['hCG', 'Human chorionic gonadotrophin', 'Choriogonadotropin alfa'],
  notes:{en:'The trigger injection is given at exactly the time instructed — usually 36 hours before egg collection.',
         ar:'حقنة التفجير تُعطى في الوقت المحدد بالضبط — عادة قبل سحب البويضات بـ 36 ساعة.'},
  ask:['injectTech'] },

{ sci:'Cetrorelix', ar:'سيتروريليكس', atc:'H01CC02', cat:'wom.fertility', form:'injection',
  doses:['0.25 mg'], brand:['Cetrotide'],
  notes:{en:'A daily injection during IVF to stop early ovulation, at the same time each day.',
         ar:'حقنة يومية أثناء أطفال الأنابيب لمنع الإباضة المبكرة، في الوقت نفسه كل يوم.'},
  ask:['injectTech'] },

{ sci:'Ganirelix', ar:'غانيريليكس', atc:'H01CC01', cat:'wom.fertility', form:'injection',
  doses:['0.25 mg'], brand:['Orgalutran'],
  notes:{en:'A daily injection during IVF to stop early ovulation, at the same time each day.',
         ar:'حقنة يومية أثناء أطفال الأنابيب لمنع الإباضة المبكرة، في الوقت نفسه كل يوم.'},
  ask:['injectTech'] },

/* ---------- Pregnancy and labour ---------- */

{ sci:'Oxytocin', ar:'أوكسيتوسين', atc:'H01BB02', cat:'wom.obstetric', form:'injection',
  doses:['5 units/mL', '10 units/mL'], brand:['Syntocinon', 'Pitocin'],
  notes:{en:'Hospital use to start or strengthen labour and to stop bleeding after birth; the drip rate is controlled closely.',
         ar:'للمستشفى لبدء الولادة أو تقويتها ولإيقاف النزف بعد الولادة؛ ويُضبط معدّل التسريب بدقة.'},
  ci:[{en:'Obstructed labour or foetal distress', ar:'تعسّر الولادة الانسدادي أو ضائقة الجنين'}],
  ask:['allergy'] },

{ sci:'Carbetocin', ar:'كاربيتوسين', atc:'H01BB03', cat:'wom.obstetric', form:'injection',
  doses:['100 microgram/mL'], brand:['Duratocin', 'Pabal'],
  notes:{en:'A single injection after a caesarean or delivery to prevent heavy bleeding.',
         ar:'حقنة واحدة بعد القيصرية أو الولادة للوقاية من النزف الغزير.'},
  ci:['ihd', 'hepRenalSevere'],
  ask:['heart'] },

{ sci:'Methylergometrine', ar:'ميثيل إرغومترين', atc:'G02AB01', cat:'wom.obstetric', form:'tablet',
  doses:['0.125 mg tablet', '0.2 mg/mL injection'], brand:['Methergine'], aka:['Methylergonovine'],
  tags:['ergot', 'sub3a4crit'],
  notes:{en:'Contracts the womb after delivery to control bleeding. It raises blood pressure — not in pre-eclampsia.',
         ar:'يقلّص الرحم بعد الولادة لضبط النزف. يرفع الضغط — لا يُستعمل في مقدمات الارتعاج.'},
  ci:['uncontrolledHtn', {en:'Pre-eclampsia', ar:'مقدمات الارتعاج'}, 'ihd'],
  ask:['bp', 'otherMeds'] },

{ sci:'Ergometrine', ar:'إرغومترين', atc:'G02AB03', cat:'wom.obstetric', form:'injection',
  doses:['0.5 mg/mL', '500 microgram with oxytocin 5 units'], brand:['Syntometrine'], aka:['Ergonovine'],
  tags:['ergot'],
  notes:{en:'Given at delivery to prevent heavy bleeding. A precursor chemical, recorded as such.',
         ar:'يُعطى عند الولادة للوقاية من النزف الغزير. مادة سليفة تُسجّل على هذا الأساس.'},
  ci:['uncontrolledHtn', {en:'Pre-eclampsia', ar:'مقدمات الارتعاج'}],
  ask:['bp'] },

{ sci:'Carboprost', ar:'كاربوبروست', atc:'G02AD04', cat:'wom.obstetric', form:'injection',
  doses:['250 microgram/mL injection'], brand:['Hemabate'], aka:['Carboprost trometamol'],
  notes:{en:'A deep muscle injection for heavy bleeding after childbirth when oxytocin has not worked. Diarrhoea, vomiting and fever are common.',
         ar:'حقنة عضلية عميقة للنزف الشديد بعد الولادة حين لا ينفع الأوكسيتوسين. الإسهال والتقيؤ والحرارة شائعة.'},
  ci:['asthma', {en:'Heart, lung, kidney or liver disease', ar:'أمراض القلب أو الرئة أو الكلى أو الكبد'}],
  ask:['asthma', 'heart'] },

{ sci:'Dinoprostone', ar:'دينوبروستون', atc:'G02AD02', cat:'wom.obstetric', form:'pessary',
  doses:['10 mg vaginal insert', '3 mg pessary', '1 mg and 2 mg gel'], brand:['Propess', 'Prostin E2'],
  notes:{en:'Placed in hospital to ripen the cervix before induction of labour.',
         ar:'يوضع في المستشفى لتهيئة عنق الرحم قبل تحريض الولادة.'},
  ci:[{en:'Previous caesarean or major uterine surgery', ar:'قيصرية سابقة أو جراحة رحمية كبيرة'}],
  ask:['asthma'] },

{ sci:'Atosiban', ar:'أتوسيبان', atc:'G02CX01', cat:'wom.obstetric', form:'injection',
  doses:['6.75 mg/0.9 mL', '37.5 mg/5 mL'], brand:['Tractocile'],
  notes:{en:'A hospital infusion that holds off premature labour for up to 48 hours.',
         ar:'تسريب في المستشفى يؤخّر الولادة المبكرة حتى 48 ساعة.'},
  ask:['allergy'] },

{ sci:'Hydroxyprogesterone caproate', ar:'كابروات هيدروكسي بروجستيرون', atc:'G03DA03', cat:'wom.obstetric', form:'injection',
  doses:['250 mg/mL'], brand:['Proluton Depot', 'Primolut Depot'], aka:['Hydroxyprogesterone', 'Hydroxyprogesterone hexanoate'],
  notes:{en:'A weekly injection in some pregnancies at risk of preterm birth; the benefit is now doubted and practice varies.',
         ar:'حقنة أسبوعية في بعض حالات الحمل المعرّضة للولادة المبكرة؛ فائدتها صارت موضع شك وتختلف الممارسات.'},
  ci:['vte', 'hepActive'],
  ask:['clots', 'diabetes'] },

/* ---------- Vaginal preparations ---------- */

{ sci:'Fenticonazole', ar:'فينتيكونازول', atc:'G01AF12', cat:'wom.vaginal', form:'pessary',
  doses:['600 mg ovule', '2% cream'], brand:['Lomexin', 'Gynoxin'],
  notes:{en:'For vaginal thrush: one ovule at bedtime, deep in the vagina. Latex condoms can be weakened.',
         ar:'للفطريات المهبلية: تحميلة واحدة قبل النوم في عمق المهبل. قد يُضعف الواقي المطاطي.'},
  ask:['firstEpisode', 'diabetes', 'preg'] },

{ sci:'Dequalinium chloride', ar:'كلوريد الديكوالينيوم', atc:'G01AC05', cat:'wom.vaginal', form:'pessary',
  doses:['10 mg vaginal tablet', '0.25 mg lozenge'], brand:['Fluomizin', 'Dequadin'],
  notes:{en:'For bacterial vaginosis: one vaginal tablet at bedtime for six days — not during a period. The lozenges are for sore throats.',
         ar:'للالتهاب المهبلي الجرثومي: قرص مهبلي قبل النوم لستة أيام — لا خلال الدورة. أقراص المصّ لالتهاب الحلق.'},
  ask:['firstEpisode', 'preg'] },

{ sci:'Policresulen', ar:'بوليكريسولين', atc:'G01AX03', cat:'wom.vaginal', form:'pessary',
  doses:['90 mg ovule', '36% concentrate', 'gel', 'with cinchocaine, rectal'], brand:['Albothyl', 'Faktu'],
  notes:{en:'For cervical and vaginal inflammation (and piles, with cinchocaine). Local burning is common; no intercourse during treatment.',
         ar:'لالتهاب عنق الرحم والمهبل (وللبواسير مع السينشوكائين). الحرقة الموضعية شائعة؛ ولا علاقة زوجية أثناء العلاج.'},
  ask:['preg', 'firstEpisode'] },

{ sci:'Nonoxinol-9', ar:'نونوكسينول-9', atc:'G02BB02', cat:'wom.contraceptive', form:'pessary',
  doses:['100 mg vaginal pessary', 'gel'], aka:['Nonoxynol-9', 'Nonoxinol 9', 'Nonoxinol'],
  notes:{en:'A spermicide put high in the vagina 10 minutes to an hour before sex. On its own it is not very reliable, and frequent use irritates the vagina and can raise the risk of HIV.',
         ar:'مبيد للنطاف يُوضع عميقاً في المهبل قبل الجماع بعشر دقائق إلى ساعة. وحده ليس موثوقاً جداً، والاستعمال المتكرر يهيّج المهبل وقد يزيد خطر فيروس الإيدز.'},
  ask:['allergy', 'uti'] }

];
