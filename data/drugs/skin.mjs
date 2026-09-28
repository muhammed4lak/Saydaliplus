/* Skin: steroid creams, antibiotic and antifungal creams, acne, psoriasis
   and eczema, pigment, hair, scabies and lice, moisturisers and wound care,
   itch, cold sores and warts.
   A molecule that also comes as tablets or injections has its skin form
   here as "<name> (topical)": a cream is not a tablet, and it must not
   raise the tablet's interaction alerts (see data/drugs.mjs, "Routes").
   Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Steroid creams (mild → very potent) ---------- */

{ sci:'Hydrocortisone (topical)', ar:'هيدروكورتيزون (موضعي)', atc:'D07AA02', cat:'skn.steroid', form:'cream',
  doses:['1% cream', '1% ointment', '0.1% butyrate cream', 'with fusidic acid or miconazole', 'rectal foam and ointment'], brand:['Locoid', 'Fucidin H', 'Daktacort'], aka:['Hydrocortisone cream', 'Hydrocortisone butyrate', 'Hydrocortisone acetate cream'],
  notes:{en:'A mild steroid for eczema, bites and nappy rash: a thin layer once or twice a day for up to a week or two. The butyrate is much stronger. Not on infected skin unless mixed with an antimicrobial.',
         ar:'كورتيزون خفيف للإكزيما واللدغات والتهاب الحفاض: طبقة رقيقة مرة أو مرتين يومياً لمدة أسبوع أو اثنين. البيوتيرات أقوى بكثير. لا يوضع على جلد ملتهب بعدوى إلا ممزوجاً بمضاد للميكروبات.'},
  ci:['skinInfection', 'rosacea'],
  ask:['skinSite', 'useLength', 'whoFor'] },

{ sci:'Betamethasone (topical)', ar:'بيتاميثازون (موضعي)', atc:'D07AC01', cat:'skn.steroid', form:'cream',
  doses:['0.1% valerate cream', '0.05% dipropionate cream and ointment', 'scalp lotion', 'with salicylic acid', 'with gentamicin', 'with clotrimazole', 'with fusidic acid'], brand:['Betnovate', 'Diprosone', 'Diprosalic', 'Fucicort', 'Lotriderm'], aka:['Betamethasone valerate', 'Betamethasone dipropionate cream'],
  notes:{en:'A potent steroid: a thin layer once or twice a day, usually for no more than four weeks, and not on the face or in skin folds unless the doctor says so. Mixed creams with antibiotics or antifungals are for short courses only.',
         ar:'كورتيزون قوي: طبقة رقيقة مرة أو مرتين يومياً، عادة لا أكثر من أربعة أسابيع، ولا يوضع على الوجه أو ثنايا الجلد إلا بأمر الطبيب. الكريمات المخلوطة بمضاد حيوي أو فطري للدورات القصيرة فقط.'},
  ci:['skinInfection', 'rosacea', {en:'Babies under one year', ar:'الرضّع دون السنة'}],
  ask:['skinSite', 'useLength', 'whoFor'] },

{ sci:'Clobetasol', ar:'كلوبيتازول', atc:'D07AD01', cat:'skn.steroid', form:'cream',
  doses:['0.05% cream', '0.05% ointment', '0.05% scalp application', '0.05% shampoo'], brand:['Dermovate', 'Clobex'], aka:['Clobetasol propionate'],
  notes:{en:'The strongest steroid cream: for short courses on thick patches, no more than 50 g a week, and never on the face, groin or armpits. Using it to lighten the skin damages it permanently.',
         ar:'أقوى كريم كورتيزون: لدورات قصيرة على البقع السميكة، لا أكثر من 50 غ أسبوعياً، ولا يوضع أبداً على الوجه أو المغبن أو الإبطين. استعماله لتفتيح البشرة يُتلفها بشكل دائم.'},
  ci:['skinInfection', 'rosacea', {en:'Children under one year', ar:'الأطفال دون السنة'}],
  ask:['skinSite', 'useLength', 'whatFor'] },

{ sci:'Mometasone (topical)', ar:'موميتازون (موضعي)', atc:'D07AC13', cat:'skn.steroid', form:'cream',
  doses:['0.1% cream', '0.1% ointment', '0.1% lotion'], brand:['Elocon'], aka:['Mometasone furoate cream'],
  notes:{en:'A potent steroid applied once a day, in a thin layer. Keep off the face and skin folds unless told, and keep courses short.',
         ar:'كورتيزون قوي يوضع مرة واحدة يومياً بطبقة رقيقة. أبعده عن الوجه وثنايا الجلد ما لم يُطلب، واجعل الدورات قصيرة.'},
  ci:['skinInfection', 'rosacea'],
  ask:['skinSite', 'useLength', 'whoFor'] },

{ sci:'Clobetasone', ar:'كلوبيتازون', atc:'D07AB01', cat:'skn.steroid', form:'cream',
  doses:['0.05% cream', '0.05% ointment', '0.1% eye drops'], brand:['Eumovate'], aka:['Clobetasone butyrate'],
  notes:{en:'A moderately potent steroid — much milder than clobetasol, despite the similar name. Twice a day for short courses.',
         ar:'كورتيزون متوسط القوة — أخف بكثير من الكلوبيتازول رغم تشابه الاسم. مرتين يومياً لدورات قصيرة.'},
  ci:['skinInfection', 'rosacea'],
  ask:['skinSite', 'useLength', 'whoFor'] },

{ sci:'Fluocinolone', ar:'فلوسينولون', atc:'D07AC04', cat:'skn.steroid', form:'cream',
  doses:['0.025% cream', '0.025% ointment', '0.01% scalp solution', 'ear drops with antibiotics', 'with tretinoin and hydroquinone'], brand:['Synalar', 'Tri-Luma'], aka:['Fluocinolone acetonide'],
  notes:{en:'A potent steroid for eczema and psoriasis, twice a day for short courses. In the triple cream for melasma it is used at night for no more than eight weeks.',
         ar:'كورتيزون قوي للإكزيما والصدفية، مرتين يومياً لدورات قصيرة. في الكريم الثلاثي للكلف يُستعمل ليلاً لمدة لا تتجاوز ثمانية أسابيع.'},
  ci:['skinInfection', 'rosacea'],
  ask:['skinSite', 'useLength', 'preg'] },

{ sci:'Triamcinolone (topical)', ar:'تريامسينولون (موضعي)', atc:'D07AB09', cat:'skn.steroid', form:'cream',
  doses:['0.1% cream', '0.1% dental paste', 'with nystatin, neomycin and gramicidin'], brand:['Kenacomb', 'Kenalog in Orabase', 'Adcortyl'], aka:['Triamcinolone acetonide cream'],
  notes:{en:'A moderate steroid. The dental paste is dabbed onto mouth ulcers without rubbing, after meals and at bedtime. The combined cream is for infected eczema, for a week or two.',
         ar:'كورتيزون متوسط القوة. معجون الفم يُوضع على القروح دون فرك، بعد الوجبات وقبل النوم. الكريم المركّب للإكزيما الملتهبة بعدوى، لأسبوع أو اثنين.'},
  ci:['skinInfection', 'rosacea'],
  ask:['skinSite', 'useLength', 'whoFor'] },

{ sci:'Diflucortolone', ar:'ديفلوكورتولون', atc:'D07AC06', cat:'skn.steroid', form:'cream',
  doses:['0.1% cream', '0.1% ointment', 'with isoconazole'], brand:['Nerisone', 'Travocort'], aka:['Diflucortolone valerate'],
  notes:{en:'A potent steroid; with isoconazole it treats inflamed fungal rashes, for up to two weeks, then the antifungal alone.',
         ar:'كورتيزون قوي؛ ومع الإيزوكونازول يعالج الطفح الفطري الملتهب لمدة أقصاها أسبوعان، ثم مضاد الفطريات وحده.'},
  ci:['skinInfection', 'rosacea'],
  ask:['skinSite', 'useLength', 'whoFor'] },

{ sci:'Prednicarbate', ar:'بريدنيكاربات', atc:'D07AC18', cat:'skn.steroid', form:'cream',
  doses:['0.25% cream', '0.25% ointment'], brand:['Dermatop'],
  notes:{en:'A moderately potent steroid with less skin thinning; once or twice a day for short courses.',
         ar:'كورتيزون متوسط القوة أقل ترقيقاً للجلد؛ مرة أو مرتين يومياً لدورات قصيرة.'},
  ci:['skinInfection', 'rosacea'],
  ask:['skinSite', 'useLength', 'whoFor'] },

/* ---------- Antibiotic creams and antiseptics ---------- */

{ sci:'Mupirocin', ar:'موبيروسين', atc:'D06AX09', cat:'skn.antiinfective', form:'ointment',
  doses:['2% ointment', '2% cream', '2% nasal ointment'], brand:['Bactroban'],
  notes:{en:'For impetigo and infected cuts: three times a day for no more than 10 days, so that resistance does not build up. The nasal ointment clears staph carriage before surgery.',
         ar:'للقوباء والجروح الملتهبة: ثلاث مرات يومياً لمدة لا تتجاوز 10 أيام حتى لا تتكوّن مقاومة. مرهم الأنف يزيل حمل العنقوديات قبل الجراحة.'},
  ask:['useLength', 'skinSite', 'whoFor'] },

{ sci:'Fusidic acid (topical)', ar:'حمض الفوسيديك (موضعي)', atc:'D06AX01', cat:'skn.antiinfective', form:'cream',
  doses:['2% cream', '2% ointment (sodium fusidate)', '1% eye drops', 'with hydrocortisone or betamethasone'], brand:['Fucidin', 'Fucithalmic', 'Fucicort', 'Fucidin H'], aka:['Fusidic acid cream', 'Sodium fusidate ointment'],
  notes:{en:'Three times a day for up to 10 days — longer use breeds resistance. The eye drops are used twice a day for a week.',
         ar:'ثلاث مرات يومياً لمدة لا تتجاوز 10 أيام — الاستعمال الأطول يولّد مقاومة. قطرة العين مرتين يومياً لمدة أسبوع.'},
  ask:['useLength', 'skinSite', 'contactLens'] },

{ sci:'Neomycin', ar:'نيومايسين', atc:'D06AX04', cat:'skn.antiinfective', form:'ointment',
  doses:['in creams and ointments with steroids', 'with bacitracin powder', 'in eye and ear drops', '500 mg tablet'], brand:['Nebanol', 'Sofradex', 'Betnovate-N'], aka:['Neomycin sulfate', 'Framycetin'],
  notes:{en:'Mostly an ingredient of mixed creams and drops. It is a common cause of skin allergy, and on large raw areas or a perforated eardrum it can damage hearing. The tablets are a hospital treatment for liver coma.',
         ar:'غالباً مكوّن في الكريمات والقطرات المخلوطة. سبب شائع لحساسية الجلد، وعلى المساحات المتقرّحة الكبيرة أو طبلة الأذن المثقوبة قد يؤذي السمع. الأقراص علاج مستشفى لغيبوبة الكبد.'},
  ci:['eardrum'],
  ask:['earDrum', 'allergy', 'useLength'] },

{ sci:'Gramicidin', ar:'غراميسيدين', atc:'R02AB30', cat:'skn.antiinfective', form:'cream',
  doses:['in combination creams', 'in eye and ear drops'], brand:['Kenacomb', 'Sofradex'],
  notes:{en:'Only found mixed with other antibiotics and steroids, in creams and ear or eye drops, for short courses.',
         ar:'يوجد ممزوجاً فقط مع مضادات حيوية وكورتيزون أخرى، في الكريمات وقطرات الأذن والعين، لدورات قصيرة.'},
  ci:['eardrum'],
  ask:['earDrum', 'useLength'] },

{ sci:'Gentamicin (topical)', ar:'جنتاميسين (موضعي)', atc:'D06AX07', cat:'skn.antiinfective', form:'cream',
  doses:['0.1% cream', '0.1% ointment', '0.3% eye and ear drops', 'with betamethasone'], brand:['Garamycin', 'Genticin', 'Diprogenta'], aka:['Gentamicin cream', 'Gentamicin eye drops', 'Gentamycin'],
  notes:{en:'For skin, eye or ear infections, for about a week. Ear drops must not go into an ear with a perforated eardrum.',
         ar:'لالتهابات الجلد أو العين أو الأذن، لمدة أسبوع تقريباً. قطرة الأذن لا توضع في أذن طبلتها مثقوبة.'},
  ci:['eardrum'],
  ask:['earDrum', 'contactLens', 'useLength'] },

{ sci:'Tetracycline (topical)', ar:'تتراسيكلين (موضعي)', atc:'D06AA04', cat:'skn.antiinfective', form:'ointment',
  doses:['3% skin ointment'], aka:['Tetracycline skin ointment'],
  notes:{en:'An older antibiotic ointment for minor skin infections, two or three times a day for up to a week. It can stain skin and clothes yellow.',
         ar:'مرهم مضاد حيوي قديم لالتهابات الجلد البسيطة، مرتين أو ثلاثاً يومياً لمدة أقصاها أسبوع. قد يصبغ الجلد والملابس بالأصفر.'},
  ask:['skinSite', 'useLength'] },

{ sci:'Silver sulfadiazine', ar:'سلفاديازين الفضة', atc:'D06BA01', cat:'skn.antiinfective', form:'cream',
  doses:['1% cream'], brand:['Flamazine', 'Silvadene'], aka:['Silver sulphadiazine', 'Sulfadiazine silver'],
  notes:{en:'For burns: a thick layer once or twice a day under a clean dressing. Not for late pregnancy, newborns, or anyone allergic to sulfa drugs.',
         ar:'للحروق: طبقة سميكة مرة أو مرتين يومياً تحت ضماد نظيف. لا يُستعمل في آخر الحمل ولا لحديثي الولادة ولا لمن لديه حساسية من السلفا.'},
  ci:['sulfaAllergy', {en:'Late pregnancy and babies under 2 months', ar:'آخر الحمل والرضّع دون شهرين'}],
  ask:['allergySulfa', 'preg', 'whoFor'] },

{ sci:'Povidone-iodine', ar:'بوفيدون اليود', atc:'D08AG02', cat:'skn.antiinfective', form:'solution',
  doses:['10% solution', '10% ointment', '7.5% surgical scrub', '1% mouthwash', 'vaginal douche'], brand:['Betadine'], aka:['Povidone iodine', 'PVP-iodine', 'Polyvidone iodine'],
  notes:{en:'An antiseptic for cuts, wounds and skin before procedures. Not for regular use in pregnancy, breastfeeding, newborns or thyroid disease; it stains skin and clothes.',
         ar:'مطهّر للجروح والخدوش وتحضير الجلد قبل الإجراءات. لا يُستعمل بانتظام في الحمل والرضاعة ولحديثي الولادة ومرضى الدرقية؛ ويصبغ الجلد والملابس.'},
  ci:[{en:'Thyroid disease or radio-iodine treatment', ar:'مرض الدرقية أو العلاج باليود المشع'}, {en:'Iodine allergy', ar:'الحساسية من اليود'}],
  ask:['thyroid', 'preg', 'whoFor'] },

{ sci:'Chlorhexidine', ar:'كلورهيكسيدين', atc:'D08AC02', cat:'skn.antiinfective', form:'solution',
  doses:['0.2% mouthwash', '4% skin wash', '2% in alcohol', '0.05% with cetrimide', '1% gel', 'umbilical cord 7.1% gel'], brand:['Corsodyl', 'Hibiscrub', 'Savlon'], aka:['Chlorhexidine gluconate'],
  notes:{en:'The mouthwash can stain teeth brown — keep it 30 minutes apart from toothpaste and do not swallow it. Never let the skin solutions reach the eyes or ears.',
         ar:'غسول الفم قد يصبغ الأسنان بالبني — افصله عن معجون الأسنان 30 دقيقة ولا تبلعه. لا تدع محاليل الجلد تصل إلى العين أو الأذن أبداً.'},
  ask:['whatFor', 'allergy'] },

{ sci:'Ethanol', ar:'الإيثانول', atc:'D08AX08', cat:'skn.antiinfective', form:'solution',
  doses:['70% solution', '70% hand rub', '96% (not for skin)'], aka:['Ethyl alcohol', 'Medical alcohol', 'Rubbing alcohol'],
  notes:{en:'An antiseptic for the skin and hands. It is flammable — let it dry fully before any heat or flame. Poisonous if swallowed; keep away from children.',
         ar:'مطهّر للجلد واليدين. قابل للاشتعال — دعه يجف تماماً قبل أي حرارة أو لهب. سام إذا ابتُلع؛ أبعده عن الأطفال.'},
  ask:['whatFor', 'childAge'] },

{ sci:'Cetrimide', ar:'سيتريميد', atc:'D08AJ04', cat:'skn.antiinfective', form:'solution',
  doses:['with chlorhexidine (antiseptic liquid and cream)', '40% concentrate'], brand:['Savlon', 'Cetavlon'],
  notes:{en:'An antiseptic for cleaning cuts and grazes; the concentrate must be diluted as the label says.',
         ar:'مطهّر لتنظيف الجروح والخدوش؛ والمركّز يُخفّف كما تقول النشرة.'},
  ask:['whatFor'] },

{ sci:'Clioquinol', ar:'كليوكوينول', atc:'D08AH30', cat:'skn.antiinfective', form:'cream',
  doses:['with flumethasone (cream and ear drops)', 'with hydrocortisone'], brand:['Locacorten-Vioform', 'Vioform-Hydrocortisone'],
  notes:{en:'Mixed with a steroid for infected eczema and outer-ear infections, for up to a week. It stains skin, hair and clothes yellow.',
         ar:'ممزوج بالكورتيزون للإكزيما الملتهبة بعدوى والتهاب الأذن الخارجية، لمدة أقصاها أسبوع. يصبغ الجلد والشعر والملابس بالأصفر.'},
  ci:['eardrum', {en:'Iodine allergy', ar:'الحساسية من اليود'}, {en:'Children under two', ar:'الأطفال دون السنتين'}],
  ask:['earDrum', 'whoFor', 'useLength'] },

/* ---------- Antifungal creams ---------- */
{ sci:'Clotrimazole', ar:'كلوتريمازول', atc:'G01AF02', cat:'skn.antifungal', form:'cream',
  doses:['1% cream', '100 mg pessary', '500 mg pessary'], brand:['Canesten'],
  notes:{en:'Keep going two weeks after the symptoms clear or it returns. The pessaries weaken latex condoms.',
         ar:'يُستمر أسبوعين بعد اختفاء الأعراض وإلا عاد. التحاميل تُضعف الواقي المطاطي.'},
  ci:[{en:'Imidazole hypersensitivity', ar:'فرط الحساسية للإيميدازولات'}],
  ask:['firstEpisode', 'diabetes', 'preg'] },

{ sci:'Ketoconazole', ar:'كيتوكونازول', atc:'D01AC08', cat:'skn.antifungal', form:'cream',
  doses:['2% cream', '2% shampoo'], brand:['Nizoral'],
  notes:{en:'Leave the shampoo on for three to five minutes before rinsing — the contact time is what works, not the amount.',
         ar:'الشامبو يُترك 3–5 دقائق قبل الشطف — الأثر في مدة الملامسة لا في الكمية.'},
  ci:[{en:'Imidazole hypersensitivity', ar:'فرط الحساسية للإيميدازولات'}],
  ask:['skinSite', 'useLength'] },

{ sci:'Miconazole (topical)', ar:'ميكونازول (موضعي)', atc:'D01AC02', cat:'skn.antifungal', form:'cream',
  doses:['2% cream', '2% powder', '2% vaginal cream', '400 mg and 1200 mg pessary', 'with hydrocortisone'], brand:['Daktarin', 'Gyno-Daktarin', 'Daktacort'], aka:['Miconazole nitrate'],
  notes:{en:'Twice a day, and for 10 days after the rash has gone. Enough reaches the blood from the vaginal forms to raise the INR on warfarin. The pessaries weaken latex condoms.',
         ar:'مرتين يومياً، و10 أيام بعد اختفاء الطفح. يصل منه إلى الدم من الأشكال المهبلية ما يكفي لرفع INR مع الوارفارين. التحاميل تُضعف الواقي المطاطي.'},
  ix:[
    ['Warfarin', S, 'Vaginal and even skin use can raise the INR — check it.', 'الاستعمال المهبلي وحتى الجلدي قد يرفع INR — افحصه.']
  ],
  ci:[{en:'Imidazole hypersensitivity', ar:'فرط الحساسية للإيميدازولات'}],
  ask:['firstEpisode', 'thinner', 'preg'] },

{ sci:'Econazole', ar:'إيكونازول', atc:'D01AC03', cat:'skn.antifungal', form:'cream',
  doses:['1% cream', '150 mg pessary'], brand:['Pevaryl', 'Gyno-Pevaryl', 'Ecostatin'], aka:['Econazole nitrate'],
  notes:{en:'Twice a day on the skin, and for two weeks after it clears. The pessaries go in at bedtime for three nights and weaken latex condoms.',
         ar:'مرتين يومياً على الجلد، وأسبوعين بعد الشفاء. التحاميل تُوضع قبل النوم لثلاث ليالٍ وتُضعف الواقي المطاطي.'},
  ci:[{en:'Imidazole hypersensitivity', ar:'فرط الحساسية للإيميدازولات'}],
  ask:['firstEpisode', 'diabetes', 'preg'] },

{ sci:'Isoconazole', ar:'إيزوكونازول', atc:'D01AC05', cat:'skn.antifungal', form:'cream',
  doses:['1% cream', '600 mg vaginal tablet', 'with diflucortolone'], brand:['Travogen', 'Gyno-Travogen', 'Travocort'], aka:['Isoconazole nitrate'],
  notes:{en:'For fungal skin rashes and vaginal thrush. The mixed cream with a steroid is for the first week or two only.',
         ar:'للطفح الفطري الجلدي وفطريات المهبل. الكريم المخلوط بالكورتيزون للأسبوع الأول أو الثاني فقط.'},
  ci:[{en:'Imidazole hypersensitivity', ar:'فرط الحساسية للإيميدازولات'}],
  ask:['firstEpisode', 'skinSite', 'preg'] },

{ sci:'Sertaconazole', ar:'سيرتاكونازول', atc:'D01AC14', cat:'skn.antifungal', form:'cream',
  doses:['2% cream', '2% powder', '300 mg pessary'], brand:['Dermofix', 'Zalain'], aka:['Sertaconazole nitrate'],
  notes:{en:'Twice a day for about four weeks on the skin; a single pessary for vaginal thrush.',
         ar:'مرتين يومياً لنحو أربعة أسابيع على الجلد؛ وتحميلة واحدة لفطريات المهبل.'},
  ci:[{en:'Imidazole hypersensitivity', ar:'فرط الحساسية للإيميدازولات'}],
  ask:['firstEpisode', 'skinSite', 'preg'] },

{ sci:'Terbinafine (topical)', ar:'تيربينافين (موضعي)', atc:'D01AE15', cat:'skn.antifungal', form:'cream',
  doses:['1% cream', '1% gel', '1% spray', '1% film-forming solution'], brand:['Lamisil', 'Lamisil Once'], aka:['Terbinafine cream'],
  notes:{en:'Works fast: once or twice a day for one to two weeks for athlete’s foot and groin rash. It does not cure nail infection.',
         ar:'سريع المفعول: مرة أو مرتين يومياً لأسبوع أو أسبوعين لقدم الرياضي وطفح المغبن. لا يشفي فطريات الأظافر.'},
  ask:['skinSite', 'firstEpisode', 'diabetes'] },

{ sci:'Tolnaftate', ar:'تولنافتات', atc:'D01AE18', cat:'skn.antifungal', form:'cream',
  doses:['1% cream', '1% powder', '1% solution'], brand:['Tinactin', 'Tinaderm'],
  notes:{en:'For athlete’s foot and ringworm, twice a day for two to six weeks; the powder helps keep feet dry and prevent return.',
         ar:'لقدم الرياضي والسعفة، مرتين يومياً لمدة أسبوعين إلى ستة؛ والمسحوق يساعد على إبقاء القدمين جافتين ومنع العودة.'},
  ask:['skinSite', 'diabetes'] },

{ sci:'Amorolfine', ar:'أمورولفين', atc:'D01AE16', cat:'skn.antifungal', form:'solution',
  doses:['5% nail lacquer'], brand:['Loceryl'],
  notes:{en:'Once or twice a week on the filed nail, for six months (fingers) to a year (toes). File with a separate file and clean the nail with the swab first; no nail varnish on top.',
         ar:'مرة أو مرتين أسبوعياً على الظفر بعد بَرده، لستة أشهر (اليدين) إلى سنة (القدمين). ابرد بمبرد خاص ونظّف الظفر بالمسحة أولاً؛ ولا طلاء أظافر فوقه.'},
  ask:['diabetes', 'duration'] },

{ sci:'Ciclopirox', ar:'سيكلوبيروكس', atc:'D01AE14', cat:'skn.antifungal', form:'solution',
  doses:['8% nail lacquer', '1% cream', '1% shampoo'], brand:['Batrafen', 'Penlac', 'Stieprox'], aka:['Ciclopirox olamine'],
  notes:{en:'The nail lacquer is painted on daily for months; the shampoo treats dandruff and seborrhoeic dermatitis twice a week.',
         ar:'طلاء الأظافر يُدهن يومياً لأشهر؛ والشامبو يعالج القشرة والتهاب الجلد الدهني مرتين أسبوعياً.'},
  ask:['diabetes', 'duration'] },

{ sci:'Selenium sulfide', ar:'كبريتيد السيلينيوم', atc:'D01AE13', cat:'skn.antifungal', form:'solution',
  doses:['2.5% shampoo', '1% shampoo'], brand:['Selsun', 'Selsun Blue'], aka:['Selenium disulfide', 'Selenium sulphide'],
  notes:{en:'For dandruff and pityriasis versicolor: leave on for a few minutes, then rinse well. Keep out of the eyes and off broken skin; remove jewellery first.',
         ar:'للقشرة والنخالية المبرقشة: يُترك بضع دقائق ثم يُشطف جيداً. أبعده عن العينين والجلد المتشقق؛ واخلع الحلي أولاً.'},
  ask:['skinSite', 'preg'] },

/* ---------- Acne and rosacea ---------- */
{ sci:'Isotretinoin', ar:'أيزوتريتينوين', atc:'D10BA01', cat:'skn.acne', form:'capsule',
  doses:['10 mg', '20 mg'], brand:['Roaccutane'],
  tags:['retinoid'], take:['withFood'],
  notes:{en:'Extremely teratogenic — documented contraception before, during and for a month after. With a fatty meal. No blood donation during treatment.',
         ar:'مشوّه للجنين بدرجة قصوى — منع حمل موثّق قبل وأثناء وشهراً بعد العلاج. مع وجبة دسمة. لا تبرّع بالدم أثناء العلاج.'},
  ix:[
    ['Doxycycline', S, 'Raised intracranial pressure — avoid the combination.', 'ارتفاع ضغط داخل القحف — يُتجنّب الجمع.'],
    ['Cholecalciferol', W, 'Risk of hypervitaminosis A.', 'خطر فرط الفيتامين A.']
  ],
  ci:['pregBf', 'hep', {en:'Severe hyperlipidaemia', ar:'فرط شحوم الدم الشديد'}],
  ask:['pregTest', 'mood', 'otherMeds'] },

{ sci:'Tretinoin', ar:'تريتينوين', atc:'D10AD01', cat:'skn.acne', form:'cream',
  doses:['0.025% cream', '0.05% cream', '0.1% cream', '0.025% gel', 'with clindamycin', '10 mg capsule (leukaemia)'], brand:['Retin-A', 'Vesanoid'], aka:['All-trans retinoic acid', 'Retinoic acid'],
  notes:{en:'At night on dry skin, a pea-sized amount for the whole face. Redness and peeling in the first weeks are expected; use sunscreen by day. Not in pregnancy. The capsules are a hospital treatment for a type of leukaemia.',
         ar:'ليلاً على جلد جاف، كمية بحجم حبة البازلاء للوجه كله. الاحمرار والتقشّر في الأسابيع الأولى متوقّعان؛ واستعمل واقي الشمس نهاراً. لا يُستعمل في الحمل. الكبسولات علاج مستشفى لنوع من ابيضاض الدم.'},
  ci:['preg', 'rosacea'],
  ask:['preg', 'sun', 'otherMeds'] },

{ sci:'Adapalene', ar:'أدابالين', atc:'D10AD03', cat:'skn.acne', form:'gel',
  doses:['0.1% gel', '0.1% cream', '0.3% gel', 'with benzoyl peroxide 2.5%'], brand:['Differin', 'Epiduo'],
  notes:{en:'Once at night on the whole affected area, not just spots. Dryness and irritation settle after a few weeks; results take about three months. Use sunscreen. Not in pregnancy.',
         ar:'مرة ليلاً على كامل المنطقة المصابة لا على الحبوب فقط. الجفاف والتهيّج يهدآن بعد أسابيع؛ والنتيجة تحتاج نحو ثلاثة أشهر. استعمل واقي الشمس. لا يُستعمل في الحمل.'},
  ci:['preg'],
  ask:['preg', 'sun', 'otherMeds'] },

{ sci:'Benzoyl peroxide', ar:'بيروكسيد البنزويل', atc:'D10AE01', cat:'skn.acne', form:'gel',
  doses:['2.5% gel', '5% gel', '10% gel', '4% and 10% wash', 'with clindamycin or adapalene'], brand:['PanOxyl', 'Benzac', 'Duac'],
  notes:{en:'Start with the weaker strength once a day. It bleaches hair, towels and clothes. Dryness and stinging are common at first.',
         ar:'ابدأ بالتركيز الأضعف مرة يومياً. يقصّر لون الشعر والمناشف والملابس. الجفاف واللسع شائعان في البداية.'},
  ask:['skinSite', 'sun'] },

{ sci:'Azelaic acid', ar:'حمض الأزيليك', atc:'D10AX03', cat:'skn.acne', form:'cream',
  doses:['20% cream', '15% gel'], brand:['Skinoren', 'Finacea'],
  notes:{en:'Twice a day for acne, rosacea and dark patches; safe in pregnancy. Stinging at first is common and settles.',
         ar:'مرتين يومياً لحب الشباب والوردية والبقع الداكنة؛ آمن في الحمل. اللسع في البداية شائع ويهدأ.'},
  ask:['skinSite', 'whatFor'] },

{ sci:'Clindamycin (topical)', ar:'كليندامايسين (موضعي)', atc:'D10AF01', cat:'skn.acne', form:'gel',
  doses:['1% gel', '1% solution', '1% lotion', 'with benzoyl peroxide', 'with tretinoin', '2% vaginal cream'], brand:['Dalacin T', 'Duac', 'Dalacin V'], aka:['Clindamycin gel', 'Clindamycin phosphate gel'],
  notes:{en:'For acne, twice a day, best combined with benzoyl peroxide so that resistance does not develop. Report diarrhoea. The vaginal cream weakens latex condoms.',
         ar:'لحب الشباب مرتين يومياً، والأفضل مع البنزويل بيروكسيد حتى لا تنشأ مقاومة. أبلغ عن الإسهال. الكريم المهبلي يُضعف الواقي المطاطي.'},
  ci:['colitisHistory'],
  ask:['skinSite', 'preg', 'bowelDisease'] },

{ sci:'Erythromycin (topical)', ar:'إريثرومايسين (موضعي)', atc:'D10AF02', cat:'skn.acne', form:'gel',
  doses:['2% gel', '4% solution with zinc', 'with tretinoin', 'with benzoyl peroxide', '0.5% eye ointment'], brand:['Zineryt', 'Benzamycin', 'Stiemycin'], aka:['Erythromycin gel'],
  notes:{en:'Twice a day for acne; combined with benzoyl peroxide or zinc to limit resistance. The eye ointment protects newborns’ eyes.',
         ar:'مرتين يومياً لحب الشباب؛ مع البنزويل بيروكسيد أو الزنك للحدّ من المقاومة. مرهم العين يحمي عيون حديثي الولادة.'},
  ask:['skinSite', 'useLength'] },

{ sci:'Metronidazole (topical)', ar:'ميترونيدازول (موضعي)', atc:'D06BX01', cat:'skn.acne', form:'gel',
  doses:['0.75% gel', '1% cream', '0.75% vaginal gel', '500 mg vaginal pessary'], brand:['Rozex', 'Metrogel', 'Zidoval'], aka:['Metronidazole gel'],
  notes:{en:'For rosacea, twice a day for a few months. The vaginal gel treats bacterial vaginosis at bedtime for five nights — avoid alcohol during it and for two days after.',
         ar:'للوردية مرتين يومياً لبضعة أشهر. الهلام المهبلي يعالج التهاب المهبل الجرثومي قبل النوم لخمس ليالٍ — تجنّب الكحول أثناءه ويومين بعده.'},
  ix:[
    ['Alcohol', W, 'Vaginal use: a disulfiram-like reaction is possible — no alcohol.', 'الاستعمال المهبلي: تفاعل شبيه بالديسلفيرام ممكن — لا كحول.'],
    ['Warfarin', W, 'Vaginal use may raise the INR.', 'الاستعمال المهبلي قد يرفع INR.']
  ],
  ask:['preg', 'alcohol', 'thinner'] },

/* ---------- Psoriasis and eczema ---------- */

{ sci:'Calcipotriol', ar:'كالسيبوتريول', atc:'D05AX02', cat:'skn.psoriasis', form:'ointment',
  doses:['50 microgram/g ointment', 'cream', 'scalp solution', 'with betamethasone (gel and ointment)'], brand:['Daivonex', 'Daivobet', 'Xamiol', 'Enstilar'], aka:['Calcipotriene'],
  notes:{en:'Once or twice a day on psoriasis plaques, no more than 100 g a week (too much raises blood calcium). Wash hands after, and keep it off the face.',
         ar:'مرة أو مرتين يومياً على لويحات الصدفية، لا أكثر من 100 غ أسبوعياً (الزيادة ترفع كالسيوم الدم). اغسل يديك بعده وأبعده عن الوجه.'},
  ci:['hyperCa', 'renalSevere'],
  ask:['skinSite', 'kidney', 'useLength'] },

{ sci:'Coal tar', ar:'قطران الفحم', atc:'D05AA', cat:'skn.psoriasis', form:'solution',
  doses:['shampoo', 'ointment', 'bath emulsion', 'with salicylic acid'], brand:['Polytar', 'Neutrogena T/Gel', 'Sebco'], aka:['Coal tar solution', 'Pix lithanthracis'],
  notes:{en:'For scalp psoriasis and dandruff; it smells and stains. It makes the skin sensitive to sun.',
         ar:'لصدفية فروة الرأس والقشرة؛ له رائحة ويصبغ. يجعل الجلد حساساً للشمس.'},
  ask:['skinSite', 'sun'] },

{ sci:'Salicylic acid', ar:'حمض الساليسيليك', atc:'D02AF', cat:'skn.psoriasis', form:'ointment',
  doses:['2% ointment', '3% with betamethasone', '17% wart paint', '26% wart gel', '2% acne wash'], brand:['Diprosalic', 'Duofilm', 'Occlusal'],
  notes:{en:'Softens and lifts thick scale and warts. Wart paint goes on the wart only, after soaking and filing, for up to 12 weeks. Not on the feet of people with diabetes or poor circulation, nor on large areas in young children.',
         ar:'يليّن القشور السميكة والثآليل ويزيلها. طلاء الثآليل على الثؤلول فقط بعد النقع والبَرد، لمدة تصل إلى 12 أسبوعاً. لا يوضع على قدمي مريض السكري أو ضعيف الدورة الدموية، ولا على مساحات كبيرة عند الأطفال الصغار.'},
  ci:[{en:'Diabetes or poor circulation — wart paint on the feet', ar:'السكري أو ضعف الدورة الدموية — طلاء الثآليل على القدمين'}, {en:'Large areas in children under two', ar:'مساحات كبيرة عند الأطفال دون السنتين'}],
  ask:['diabetes', 'skinSite', 'childAge'] },

{ sci:'Pimecrolimus', ar:'بيميكروليموس', atc:'D11AH02', cat:'skn.psoriasis', form:'cream',
  doses:['1% cream'], brand:['Elidel'],
  notes:{en:'A steroid-free cream for eczema on the face and folds, from two years of age. Warmth or burning at first is common. Use sun protection; not on infected skin.',
         ar:'كريم خالٍ من الكورتيزون لإكزيما الوجه والثنايا، من عمر سنتين. الدفء أو الحرقة في البداية شائعان. احمِ الجلد من الشمس؛ ولا يوضع على جلد ملتهب بعدوى.'},
  ci:['skinInfection', 'under2', 'immunocompromised'],
  ask:['whoFor', 'infection', 'sun'] },

{ sci:'Tacrolimus (topical)', ar:'تاكروليموس (موضعي)', atc:'D11AH01', cat:'skn.psoriasis', form:'ointment',
  doses:['0.03% ointment', '0.1% ointment'], brand:['Protopic'], aka:['Tacrolimus ointment'],
  notes:{en:'A steroid-free ointment for eczema, twice a day in flares, then twice a week to prevent them. Burning at first settles. The face may flush with alcohol. Use sun protection.',
         ar:'مرهم خالٍ من الكورتيزون للإكزيما، مرتين يومياً في النوبات، ثم مرتين أسبوعياً للوقاية. الحرقة في البداية تهدأ. قد يحمرّ الوجه مع الكحول. احمِ الجلد من الشمس.'},
  ix:[
    ['Alcohol', W, 'Facial flushing and skin irritation.', 'احمرار الوجه وتهيّج الجلد.']
  ],
  ci:['skinInfection', 'under2', 'immunocompromised'],
  ask:['whoFor', 'infection', 'sun'] },

{ sci:'Acitretin', ar:'أسيتريتين', atc:'D05BB02', cat:'skn.psoriasis', form:'capsule',
  doses:['10 mg', '25 mg'], brand:['Neotigason', 'Soriatane'],
  tags:['retinoid'], take:['withFood'],
  notes:{en:'For severe psoriasis, with food. It causes birth defects: no pregnancy during treatment and for three years after. No alcohol (it makes the drug last years longer), no blood donation, and lipids and liver are checked.',
         ar:'للصدفية الشديدة، مع الطعام. يسبّب تشوّهات الجنين: لا حمل أثناء العلاج ولثلاث سنوات بعده. لا كحول (يجعل الدواء يبقى سنوات أطول)، ولا تبرّع بالدم، وتُفحص الدهون والكبد.'},
  ix:[
    ['Methotrexate', C, 'Severe liver damage — do not combine.', 'أذية كبدية شديدة — لا يُجمعان.'],
    ['#tetracycline', S, 'Raised pressure in the skull — avoid the combination.', 'ارتفاع الضغط داخل الجمجمة — يُتجنّب الجمع.'],
    ['Alcohol', S, 'Turns it into a form that stays for years, lengthening the pregnancy ban.', 'يحوّله إلى شكل يبقى سنوات، فتطول مدة منع الحمل.'],
    ['Retinol', S, 'Vitamin A toxicity — no vitamin A supplements.', 'تسمّم بفيتامين أ — لا مكمّلات فيتامين أ.']
  ],
  ci:['pregTeratogen', 'hepSevere', 'renalSevere'],
  ask:['pregTest', 'alcohol', 'liver'] },

{ sci:'Methoxsalen', ar:'ميثوكسالين', atc:'D05BA02', cat:'skn.pigment', form:'tablet',
  doses:['10 mg tablet', '0.75% and 1% solution'], brand:['Meladinine', 'Oxsoralen'], aka:['8-Methoxypsoralen', 'Psoralen'],
  take:['withFood'],
  notes:{en:'Taken two hours before light treatment (PUVA) for vitiligo or psoriasis. Wear wraparound UV sunglasses for the rest of the day and avoid the sun.',
         ar:'يؤخذ قبل العلاج الضوئي (PUVA) بساعتين للبهاق أو الصدفية. ارتدِ نظارات شمسية مغلقة الجوانب واقية من الأشعة بقية اليوم وتجنّب الشمس.'},
  ci:['porphyria', {en:'Light-sensitive diseases (such as lupus)', ar:'الأمراض الحساسة للضوء (مثل الذئبة)'}, 'hepSevere'],
  ask:['sun', 'liver', 'cataract'] },

/* ---------- Pigmentation ---------- */

{ sci:'Hydroquinone', ar:'هيدروكينون', atc:'D11AX11', cat:'skn.pigment', form:'cream',
  doses:['2% cream', '4% cream', 'with tretinoin and fluocinolone'], brand:['Eldoquin', 'Tri-Luma'],
  notes:{en:'At night on dark patches only, for up to three months, with strict daily sunscreen. Longer use can leave permanent blue-black darkening.',
         ar:'ليلاً على البقع الداكنة فقط، لمدة أقصاها ثلاثة أشهر، مع واقي شمس يومي صارم. الاستعمال الأطول قد يترك اسوداداً مزرقّاً دائماً.'},
  ci:['preg'],
  ask:['preg', 'sun', 'useLength'] },

/* ---------- Hair ---------- */

{ sci:'Minoxidil', ar:'مينوكسيديل', atc:'D11AX01', cat:'skn.hair', form:'solution',
  doses:['2% solution', '5% solution', '5% foam', '2.5 mg and 10 mg tablet'], brand:['Regaine', 'Rogaine', 'Loniten'],
  notes:{en:'Twice a day on a dry scalp. Shedding may increase in the first weeks; results take four months, and the hair lost returns if it is stopped. The tablets are a strong blood-pressure medicine.',
         ar:'مرتين يومياً على فروة رأس جافة. قد يزداد التساقط في الأسابيع الأولى؛ والنتيجة تحتاج أربعة أشهر، ويعود الشعر المفقود للتساقط إذا توقّف. الأقراص دواء قوي للضغط.'},
  ci:[{en:'Inflamed or broken scalp', ar:'فروة رأس ملتهبة أو متشققة'}, 'preg'],
  ask:['whoFor', 'bp', 'preg'] },

/* ---------- Scabies and lice ---------- */

{ sci:'Permethrin', ar:'بيرميثرين', atc:'P03AC04', cat:'skn.parasite', form:'cream',
  doses:['5% cream (scabies)', '1% creme rinse (lice)'], brand:['Lyclear', 'Elimite', 'Nix'],
  notes:{en:'Scabies: from the neck down (and the scalp in small children) over the whole body, washed off after 8–12 hours, repeated after a week. Treat everyone in the house on the same day and wash bedding hot. The itch can last weeks.',
         ar:'الجرب: من الرقبة إلى القدمين (والرأس عند الأطفال الصغار) على الجسم كله، ويُغسل بعد 8–12 ساعة ويُكرّر بعد أسبوع. عالج كل أفراد البيت في اليوم نفسه واغسل الأغطية بماء ساخن. قد تستمر الحكّة أسابيع.'},
  ask:['whoFor', 'preg', 'childAge'] },

{ sci:'Benzyl benzoate', ar:'بنزوات البنزيل', atc:'P03AX01', cat:'skn.parasite', form:'solution',
  doses:['25% emulsion'], brand:['Ascabiol'],
  notes:{en:'For scabies: over the whole body from the neck down, repeated as directed. It stings — for children it must be diluted, and it is not for babies.',
         ar:'للجرب: على الجسم كله من الرقبة إلى القدمين ويُكرّر حسب الإرشاد. يلسع — ويجب تخفيفه للأطفال، ولا يُستعمل للرضّع.'},
  ci:[{en:'Babies and broken or inflamed skin', ar:'الرضّع والجلد المتشقق أو الملتهب'}],
  ask:['childAge', 'preg', 'skinSite'] },

/* ---------- Itch and skin numbing ---------- */

{ sci:'Crotamiton', ar:'كروتاميتون', atc:'D04AX', cat:'skn.itch', form:'cream',
  doses:['10% cream', '10% lotion', 'with hydrocortisone'], brand:['Eurax'],
  notes:{en:'Eases itch two or three times a day; for scabies it is a weaker option. Not on broken skin or near the eyes.',
         ar:'يخفّف الحكّة مرتين أو ثلاثاً يومياً؛ وللجرب خيار أضعف. لا يوضع على جلد متشقق أو قرب العينين.'},
  ask:['whoFor', 'skinSite'] },

{ sci:'Calamine', ar:'كالامين', atc:'D02AB', cat:'skn.itch', form:'solution',
  doses:['lotion', 'with zinc oxide', 'aqueous cream'], aka:['Calamine lotion'],
  notes:{en:'Soothes itching from chickenpox, bites and sunburn. Shake well; it dries on the skin.',
         ar:'يلطّف حكّة الجدري المائي واللدغات وحروق الشمس. رجّه جيداً؛ ويجفّ على الجلد.'},
  ask:['whoFor', 'duration'] },

/* ---------- Moisturisers, barrier and wound care ---------- */

{ sci:'Zinc oxide', ar:'أكسيد الزنك', atc:'D02AB', cat:'skn.emollient', form:'ointment',
  doses:['10–15% cream', '25% paste', 'with castor oil', 'with cod-liver oil'], brand:['Sudocrem', 'Desitin'],
  notes:{en:'A barrier for nappy rash and irritated skin, at every nappy change on clean dry skin. See a doctor if the rash is raw, bleeding, or not better in a few days.',
         ar:'حاجز لالتهاب الحفاض والجلد المتهيّج، عند كل تغيير حفاض على جلد نظيف جاف. راجع الطبيب إذا كان الطفح متقرّحاً أو ينزف أو لم يتحسّن خلال أيام.'},
  ask:['whoFor', 'duration'] },

{ sci:'Dexpanthenol', ar:'ديكسبانثينول', atc:'D03AX03', cat:'skn.emollient', form:'ointment',
  doses:['5% ointment', '5% cream', 'nasal spray'], brand:['Bepanthen'], aka:['Panthenol', 'Provitamin B5'],
  notes:{en:'Soothes and helps heal nappy rash, sore nipples, minor burns and dry skin; safe for babies and in breastfeeding.',
         ar:'يلطّف ويساعد على شفاء التهاب الحفاض وتشقق الحلمات والحروق البسيطة والجلد الجاف؛ آمن للرضّع وفي الرضاعة.'},
  ask:['whoFor'] },

{ sci:'Urea', ar:'يوريا', atc:'D02AE01', cat:'skn.emollient', form:'cream',
  doses:['5% cream', '10% cream', '40% cream (nails and calluses)'], brand:['Eucerin Urea', 'Calmurid'],
  notes:{en:'Moisturises very dry, cracked skin; the strong cream softens calluses and thick nails. It can sting on cracked skin at first.',
         ar:'يرطّب الجلد الجاف جداً والمتشقق؛ والكريم القوي يليّن الكالو والأظافر السميكة. قد يلسع على الجلد المتشقق في البداية.'},
  ask:['skinSite', 'diabetes'] },

{ sci:'Beta-sitosterol', ar:'بيتا سيتوستيرول', atc:'D03AX', cat:'skn.emollient', form:'ointment',
  doses:['0.25% ointment'], brand:['MEBO', 'Burnasores'], aka:['β-sitosterol', 'Moist exposed burn ointment'],
  notes:{en:'A herbal burn and wound ointment in a sesame-oil base, applied thickly two to four times a day after gently removing the old layer. Deep, large or infected burns need a doctor.',
         ar:'مرهم عشبي للحروق والجروح بقاعدة زيت السمسم، يُدهن بطبقة سميكة مرتين إلى أربع مرات يومياً بعد إزالة الطبقة القديمة بلطف. الحروق العميقة أو الكبيرة أو الملتهبة تحتاج طبيباً.'},
  ask:['whoFor', 'duration', 'diabetes'] },

{ sci:'White soft paraffin', ar:'البارافين الأبيض الطري', atc:'D02AC', cat:'skn.emollient', form:'ointment',
  doses:['ointment', 'with liquid paraffin (50/50)', 'emollient creams'], brand:['Vaseline', 'Diprobase'], aka:['Petrolatum', 'Petroleum jelly', 'Paraffin emollient'],
  notes:{en:'Apply often, in the direction of hair growth. Paraffin soaked into clothes and dressings catches fire easily — keep away from flames and cigarettes.',
         ar:'يُدهن كثيراً باتجاه نمو الشعر. البارافين المتشرّب في الملابس والضمادات يشتعل بسهولة — أبعده عن اللهب والسجائر.'},
  ask:['smoke', 'whoFor'] },

/* ---------- Cold sores and warts ---------- */

{ sci:'Acyclovir (topical)', ar:'أسيكلوفير (موضعي)', atc:'D06BB03', cat:'skn.antiviral', form:'cream',
  doses:['5% cream', '3% eye ointment'], brand:['Zovirax'], aka:['Aciclovir cream', 'Acyclovir cream', 'Aciclovir (topical)'],
  notes:{en:'Start at the first tingle of a cold sore: five times a day for five days. Wash hands after, and do not touch the eyes. The eye ointment treats herpes of the eye, five times a day.',
         ar:'ابدأ عند أول وخز لقرحة البرد: خمس مرات يومياً لخمسة أيام. اغسل يديك بعده ولا تلمس العينين. مرهم العين يعالج الهربس في العين، خمس مرات يومياً.'},
  ask:['firstEpisode', 'immune', 'eyeRedFlags'] },

{ sci:'Imiquimod', ar:'إيميكويمود', atc:'D06BB10', cat:'skn.antiviral', form:'cream',
  doses:['5% cream sachet', '3.75% cream'], brand:['Aldara', 'Zyclara'],
  notes:{en:'For genital warts and some skin cancers: at bedtime on set nights of the week, washed off after 6–10 hours. Redness and soreness are expected; it weakens condoms.',
         ar:'للثآليل التناسلية وبعض سرطانات الجلد: قبل النوم في ليالٍ محددة من الأسبوع، ويُغسل بعد 6–10 ساعات. الاحمرار والألم متوقّعان؛ ويُضعف الواقي الذكري.'},
  ci:['preg'],
  ask:['preg', 'immune', 'skinSite'] },

{ sci:'Podophyllotoxin', ar:'بودوفيلوتوكسين', atc:'D06BB04', cat:'skn.antiviral', form:'solution',
  doses:['0.5% solution', '0.15% cream'], brand:['Condyline', 'Warticon'],
  notes:{en:'For genital warts: twice a day for three days, then four days off, for up to four cycles. On the warts only. Not in pregnancy.',
         ar:'للثآليل التناسلية: مرتين يومياً لثلاثة أيام ثم أربعة أيام راحة، لأربع دورات كحد أقصى. على الثآليل فقط. لا يُستعمل في الحمل.'},
  ci:['preg'],
  ask:['preg', 'firstEpisode', 'skinSite'] }

];
