/* Antifungals (systemic and oral), antivirals — herpes, flu, CMV,
   hepatitis B and C, COVID-19 — and HIV. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Antifungals ---------- */
{ sci:'Fluconazole', ar:'فلوكونازول', atc:'J02AC01', cat:'inf.antifungal', form:'capsule',
  doses:['50 mg', '150 mg', '200 mg'], brand:['Diflucan'],
  tags:['qt', 'inh3a4mod'],
  notes:{en:'A single 150 mg dose for vaginal thrush. Longer courses are a serious enzyme inhibitor.',
         ar:'جرعة 150 ملغ مفردة للمبيضات المهبلية. الكورسات الطويلة مثبّط إنزيمي معتبر.'},
  ix:[
    ['Warfarin', S, 'Markedly raises INR.', 'يرفع INR بوضوح.'],
    ['Simvastatin', S, 'Myopathy risk — hold the statin on longer courses.', 'خطر اعتلال عضلي — يُوقف الستاتين في الكورسات الطويلة.'],
    ['Amiodarone', S, 'QT prolongation.', 'إطالة QT.']
  ],
  ci:[{en:'Pregnancy, on repeated doses', ar:'الحمل بالجرعات المتكررة'}, 'qt'],
  ask:['preg', 'rhythm', 'thinner'] },

{ sci:'Terbinafine', ar:'تيربينافين', atc:'D01BA02', cat:'inf.antifungal', form:'tablet',
  doses:['1% cream', '250 mg'], brand:['Lamisil'],
  notes:{en:'Nail infection needs six weeks for fingers, twelve for toes — say the length up front.',
         ar:'فطر الأظافر يحتاج 6 أسابيع لليد و12 أسبوعاً للقدم — اذكر المدة من البداية.'},
  ix:[
    ['Warfarin', W, 'May move INR either way.', 'قد يغيّر INR في الاتجاهين.'],
    ['Amitriptyline', W, 'Raises amitriptyline levels.', 'يرفع مستوى الأميتريبتيلين.']
  ],
  ci:[{en:'Chronic or active liver disease', ar:'مرض كبدي مزمن أو فعّال'}, 'renalSevere'],
  ask:['liver', 'preg'] },

{ sci:'Itraconazole', ar:'إيتراكونازول', atc:'J02AC02', cat:'inf.antifungal', form:'capsule',
  doses:['100 mg capsule', '10 mg/mL solution'], brand:['Sporanox'],
  tags:['inh3a4', 'qtPossible'], take:['afterFood'],
  notes:{en:'Capsules straight after a full meal; the liquid on an empty stomach. It interacts with many medicines — read the whole list. Report swelling, breathlessness or yellowing.',
         ar:'الكبسولات بعد وجبة كاملة مباشرة؛ والمحلول على معدة فارغة. يتداخل مع أدوية كثيرة — اقرأ القائمة كلها. أبلغ عن التورّم أو ضيق النفس أو الاصفرار.'},
  ci:[{en:'Heart failure', ar:'قصور القلب'}, 'preg'],
  ask:['otherMeds', 'heartFailure', 'liver'] },

{ sci:'Voriconazole', ar:'فوريكونازول', atc:'J02AC03', cat:'inf.antifungal', form:'tablet',
  doses:['50 mg', '200 mg tablet', '200 mg vial', '40 mg/mL suspension'], brand:['Vfend'],
  tags:['inh3a4', 'qt'], take:['emptyStomach'],
  notes:{en:'An hour before or after meals. Visual disturbances are common early on — no driving at night. The skin burns easily in the sun; cover up.',
         ar:'قبل الوجبات أو بعدها بساعة. اضطرابات الرؤية شائعة في البداية — لا قيادة ليلاً. يحترق الجلد بسهولة في الشمس؛ غطِّ جلدك.'},
  ci:['qt'],
  ask:['otherMeds', 'sun', 'liver'] },

{ sci:'Posaconazole', ar:'بوساكونازول', atc:'J02AC04', cat:'inf.antifungal', form:'tablet',
  doses:['100 mg tablet', '40 mg/mL suspension', '300 mg vial'], brand:['Noxafil'],
  tags:['inh3a4', 'qtPossible'], take:['withFood'],
  notes:{en:'With food. It interacts with many medicines — read the whole list.',
         ar:'مع الطعام. يتداخل مع أدوية كثيرة — اقرأ القائمة كلها.'},
  ask:['otherMeds', 'rhythm', 'liver'] },

{ sci:'Amphotericin B', ar:'أمفوتيريسين B', atc:'J02AA01', cat:'inf.antifungal', form:'injection',
  doses:['50 mg vial (conventional)', '50 mg liposomal', 'lipid complex'], brand:['Fungizone', 'AmBisome', 'Abelcet'],
  tags:['nephrotoxic', 'kLosing'],
  notes:{en:'A hospital infusion for serious fungal infections and leishmaniasis; kidney function and potassium are checked daily. Fever and shivering during the infusion are common.',
         ar:'تسريب في المستشفى للعدوى الفطرية الخطيرة وداء الليشمانيات؛ تُفحص وظائف الكلى والبوتاسيوم يومياً. الحمى والرعشة أثناء التسريب شائعة.'},
  ask:['kidney', 'labs'] },

{ sci:'Caspofungin', ar:'كاسبوفانجين', atc:'J02AX04', cat:'inf.antifungal', form:'injection',
  doses:['50 mg', '70 mg vial'], brand:['Cancidas'],
  notes:{en:'A daily hospital infusion for serious fungal infections.',
         ar:'تسريب يومي في المستشفى للعدوى الفطرية الخطيرة.'},
  ask:['liver'] },

{ sci:'Micafungin', ar:'ميكافانجين', atc:'J02AX05', cat:'inf.antifungal', form:'injection',
  doses:['50 mg', '100 mg vial'], brand:['Mycamine'],
  notes:{en:'A daily hospital infusion for serious fungal infections; liver tests are checked.',
         ar:'تسريب يومي في المستشفى للعدوى الفطرية الخطيرة؛ تُفحص وظائف الكبد.'},
  ask:['liver'] },

{ sci:'Nystatin', ar:'نيستاتين', atc:'A07AA02', cat:'inf.antifungal', form:'drops',
  doses:['100,000 units/mL oral suspension', '500,000 units tablet', '100,000 units pessary', '100,000 units/g cream'], brand:['Mycostatin', 'Nystan'],
  notes:{en:'For mouth thrush: drop it into the mouth and hold it there before swallowing, four times a day after feeds or meals, and for two days after it clears. It is not absorbed.',
         ar:'لقلاع الفم: يُقطّر في الفم ويُبقى فيه قبل البلع، أربع مرات يومياً بعد الرضعات أو الوجبات، ولمدة يومين بعد الشفاء. لا يُمتص.'},
  ask:['childAge', 'inhaler'] },

{ sci:'Griseofulvin', ar:'غريزيوفولفين', atc:'D01BA01', cat:'inf.antifungal', form:'tablet',
  doses:['125 mg', '250 mg', '500 mg'], brand:['Fulcin', 'Grisovin'],
  tags:['inducer'], take:['withFood'],
  notes:{en:'With a fatty meal; courses last weeks to months. It makes the pill unreliable and causes birth defects — contraception during and for a month after (six months for men). No alcohol.',
         ar:'مع وجبة دسمة؛ تستمر الدورة أسابيع إلى أشهر. يجعل حبوب منع الحمل غير موثوقة ويسبّب تشوّهات للجنين — منع الحمل أثناء العلاج وشهراً بعده (ستة أشهر للرجال). لا كحول.'},
  ix:[
    ['Alcohol', W, 'Flushing and a racing heart.', 'احمرار وتسارع في القلب.']
  ],
  ci:['pregTeratogen', 'hepSevere', 'porphyria', {en:'Lupus', ar:'الذئبة'}],
  ask:['pregTest', 'ocp', 'liver'] },

/* ---------- Antivirals ---------- */
{ sci:'Acyclovir', ar:'أسيكلوفير', atc:'J05AB01', cat:'inf.antiviral', form:'tablet',
  doses:['5% cream', '200 mg', '400 mg', '800 mg'], brand:['Zovirax'], aka:['Aciclovir'],
  notes:{en:'Start within 72 hours of the rash or the benefit falls away. Plenty of fluid on the higher doses.',
         ar:'يبدأ خلال 72 ساعة من ظهور الطفح وإلا قلّت الفائدة. شرب سوائل وفير مع الجرعات العالية.'},
  ix:[
    ['Ibuprofen', W, 'Compounded renal risk at high doses.', 'خطر كلوي مضاعف مع الجرعات العالية.']
  ],
  ci:[{en:'Severe renal impairment without dose adjustment', ar:'قصور كلوي شديد دون تعديل الجرعة'}],
  ask:['kidney', 'preg'] },

{ sci:'Valaciclovir', ar:'فالاسيكلوفير', atc:'J05AB11', cat:'inf.antiviral', form:'tablet',
  doses:['500 mg', '1 g'], brand:['Valtrex'], aka:['Valacyclovir'],
  notes:{en:'For cold sores or shingles, start at the first tingle or rash. Drink plenty of water. The dose is lowered in kidney impairment.',
         ar:'للقروح الباردة أو الحزام الناري، ابدأ عند أول وخز أو طفح. اشرب ماء كثيراً. تُخفّض الجرعة في القصور الكلوي.'},
  ask:['kidney', 'preg'] },

{ sci:'Famciclovir', ar:'فامسيكلوفير', atc:'J05AB09', cat:'inf.antiviral', form:'tablet',
  doses:['125 mg', '250 mg', '500 mg'], brand:['Famvir'],
  notes:{en:'For shingles and genital herpes, started as early as possible. The dose is lowered in kidney impairment.',
         ar:'للحزام الناري والحلأ التناسلي، يُبدأ به بأسرع وقت ممكن. تُخفّض الجرعة في القصور الكلوي.'},
  ask:['kidney', 'preg'] },

{ sci:'Ganciclovir', ar:'غانسيكلوفير', atc:'J05AB06', cat:'inf.antiviral', form:'injection',
  doses:['500 mg vial', '0.15% eye gel'], brand:['Cymevene', 'Virgan'],
  notes:{en:'A hospital infusion for CMV; blood counts are checked. It causes birth defects — contraception for both partners.',
         ar:'تسريب في المستشفى لفيروس CMV؛ يُفحص تعداد الدم. يسبّب تشوّهات للجنين — منع الحمل للزوجين.'},
  ci:['pregTeratogen', 'marrow'],
  ask:['pregTest', 'labs', 'kidney'] },

{ sci:'Valganciclovir', ar:'فالغانسيكلوفير', atc:'J05AB14', cat:'inf.antiviral', form:'tablet',
  doses:['450 mg', '50 mg/mL solution'], brand:['Valcyte'],
  take:['withFood'],
  notes:{en:'With food. Do not break or crush the tablets, and wash hands after handling. Blood counts are checked; it causes birth defects.',
         ar:'مع الطعام. لا تُكسر الأقراص ولا تُسحق، واغسل يديك بعد لمسها. يُفحص تعداد الدم؛ ويسبّب تشوّهات للجنين.'},
  ci:['pregTeratogen', 'marrow'],
  ask:['pregTest', 'labs', 'kidney'] },

{ sci:'Oseltamivir', ar:'أوسيلتاميفير', atc:'J05AH02', cat:'inf.antiviral', form:'capsule',
  doses:['30 mg', '45 mg', '75 mg capsule', '6 mg/mL suspension'], brand:['Tamiflu'],
  take:['withFood'],
  notes:{en:'Start within 48 hours of flu symptoms, twice a day for five days, with food to reduce nausea. Report unusual behaviour in children.',
         ar:'ابدأ خلال 48 ساعة من أعراض الإنفلونزا، مرتين يومياً لخمسة أيام، مع الطعام لتقليل الغثيان. أبلغ عن أي سلوك غير معتاد عند الأطفال.'},
  ask:['duration', 'kidney', 'childAge'] },

{ sci:'Ribavirin', ar:'ريبافيرين', atc:'J05AP01', cat:'inf.antiviral', form:'capsule',
  doses:['200 mg capsule', '400 mg', '6 g inhalation'], brand:['Copegus', 'Virazole'],
  take:['withFood'],
  notes:{en:'It causes birth defects — two reliable contraceptive methods for both partners, during and for months after. It breaks down red cells; blood counts are checked.',
         ar:'يسبّب تشوّهات للجنين — وسيلتان موثوقتان لمنع الحمل للزوجين، أثناء العلاج ولأشهر بعده. يحلّ الكريات الحمر؛ يُفحص تعداد الدم.'},
  ci:['pregTeratogen', {en:'Severe heart disease', ar:'مرض قلبي شديد'}, 'hepSevere'],
  ask:['pregTest', 'heart', 'labs'] },

{ sci:'Remdesivir', ar:'ريمديسيفير', atc:'J05AB16', cat:'inf.antiviral', form:'injection',
  doses:['100 mg vial'], brand:['Veklury'],
  notes:{en:'A hospital infusion for COVID-19; liver and kidney tests are checked.',
         ar:'تسريب في المستشفى لكوفيد-19؛ تُفحص وظائف الكبد والكلى.'},
  ask:['liver', 'kidney'] },

{ sci:'Favipiravir', ar:'فافيبيرافير', atc:'J05AX27', cat:'inf.antiviral', form:'tablet',
  doses:['200 mg'], brand:['Avigan'],
  notes:{en:'An antiviral used for influenza and COVID-19 in some countries. It causes birth defects — not in pregnancy, and contraception for both partners.',
         ar:'مضاد فيروسي يُستعمل للإنفلونزا وكوفيد-19 في بعض الدول. يسبّب تشوّهات للجنين — لا يُستعمل في الحمل، ومنع الحمل للزوجين.'},
  ci:['pregTeratogen'],
  ask:['pregTest', 'liver', 'gout'] },

{ sci:'Nirmatrelvir', ar:'نيرماتريلفير', atc:'J05AE30', cat:'inf.antiviral', form:'tablet',
  doses:['150 mg (packed with ritonavir 100 mg)'], brand:['Paxlovid'],
  tags:['inh3a4'],
  notes:{en:'For COVID-19 within five days of symptoms, twice a day for five days. The ritonavir in the pack interacts with a great many medicines — read the whole list first.',
         ar:'لكوفيد-19 خلال خمسة أيام من الأعراض، مرتين يومياً لخمسة أيام. الريتونافير في العبوة يتداخل مع أدوية كثيرة جداً — اقرأ القائمة كلها أولاً.'},
  ci:['hepSevere', 'renal30'],
  ask:['otherMeds', 'kidney', 'liver'] },

{ sci:'Entecavir', ar:'إنتيكافير', atc:'J05AF10', cat:'inf.antiviral', form:'tablet',
  doses:['0.5 mg', '1 mg'], brand:['Baraclude'],
  take:['emptyStomach'],
  notes:{en:'For hepatitis B, on an empty stomach. Never stop without the specialist — the hepatitis can flare severely.',
         ar:'لالتهاب الكبد B، على معدة فارغة. لا يُوقف أبداً دون الطبيب المختص — قد ينتكس التهاب الكبد انتكاساً شديداً.'},
  ask:['kidney', 'labs'] },

{ sci:'Tenofovir disoproxil', ar:'تينوفوفير ديزوبروكسيل', atc:'J05AF07', cat:'inf.antiviral', form:'tablet',
  doses:['300 mg', 'with emtricitabine', 'with lamivudine and dolutegravir'], brand:['Viread', 'Truvada'], aka:['Tenofovir', 'Tenofovir disoproxil fumarate'],
  tags:['nephrotoxic'],
  notes:{en:'For hepatitis B and HIV, once a day. Kidney function and bone health are checked. Never stop hepatitis B treatment suddenly.',
         ar:'لالتهاب الكبد B وفيروس نقص المناعة، مرة واحدة يومياً. تُفحص وظائف الكلى وصحة العظام. لا يُوقف علاج التهاب الكبد B فجأة أبداً.'},
  ask:['kidney', 'labs'] },

{ sci:'Tenofovir alafenamide', ar:'تينوفوفير ألافيناميد', atc:'J05AF13', cat:'inf.antiviral', form:'tablet',
  doses:['25 mg', 'in HIV combinations'], brand:['Vemlidy', 'Descovy'],
  notes:{en:'For hepatitis B and HIV, once a day with food; gentler on kidneys and bones than tenofovir disoproxil. Never stop hepatitis B treatment suddenly.',
         ar:'لالتهاب الكبد B وفيروس نقص المناعة، مرة واحدة يومياً مع الطعام؛ ألطف على الكلى والعظام من تينوفوفير ديزوبروكسيل. لا يُوقف علاج التهاب الكبد B فجأة أبداً.'},
  ask:['kidney', 'labs'] },

{ sci:'Lamivudine', ar:'لاميفودين', atc:'J05AF05', cat:'inf.antiviral', form:'tablet',
  doses:['100 mg (hepatitis B)', '150 mg', '300 mg', 'in HIV combinations'], brand:['Epivir', 'Zeffix'],
  notes:{en:'For HIV and hepatitis B. Well tolerated; the dose is lowered in kidney impairment. Stopping it in hepatitis B can cause a flare.',
         ar:'لفيروس نقص المناعة والتهاب الكبد B. جيد التحمّل؛ تُخفّض الجرعة في القصور الكلوي. إيقافه في التهاب الكبد B قد يسبّب انتكاساً.'},
  ask:['kidney', 'labs'] },

{ sci:'Sofosbuvir', ar:'سوفوسبوفير', atc:'J05AP08', cat:'inf.antiviral', form:'tablet',
  doses:['400 mg', 'with ledipasvir', 'with velpatasvir', 'with daclatasvir'], brand:['Sovaldi', 'Harvoni', 'Epclusa'],
  tags:['inducerSensitive'],
  notes:{en:'For hepatitis C: once a day, every day, usually for 12 weeks. Never with amiodarone. Acid-reducing medicines interfere with some combinations — ask before taking any.',
         ar:'لالتهاب الكبد C: مرة واحدة كل يوم، عادة لمدة 12 أسبوعاً. لا يُجمع أبداً مع الأميودارون. خافضات الحمض تتداخل مع بعض التركيبات — استشر قبل أخذ أي منها.'},
  ix:[
    ['Amiodarone', C, 'Severe, sometimes fatal slowing of the heart — contraindicated.', 'بطء شديد في القلب قد يكون مميتاً — ممنوع الجمع.'],
    ['#inducer', C, 'Loses its effect — contraindicated.', 'يفقد مفعوله — ممنوع الجمع.']
  ],
  ask:['otherMeds', 'hepatitis', 'antacids'] },

{ sci:'Daclatasvir', ar:'داكلاتاسفير', atc:'J05AP07', cat:'inf.antiviral', form:'tablet',
  doses:['30 mg', '60 mg'], brand:['Daklinza'],
  tags:['sub3a4', 'inducerSensitive'],
  notes:{en:'With sofosbuvir for hepatitis C, once a day for 12 weeks. Never with amiodarone.',
         ar:'مع السوفوسبوفير لالتهاب الكبد C، مرة يومياً لمدة 12 أسبوعاً. لا يُجمع أبداً مع الأميودارون.'},
  ix:[
    ['Amiodarone', C, 'With sofosbuvir: severe slowing of the heart — contraindicated.', 'مع السوفوسبوفير: بطء شديد في القلب — ممنوع الجمع.']
  ],
  ask:['otherMeds', 'hepatitis'] },

{ sci:'Ledipasvir', ar:'ليديباسفير', atc:'J05AP65', cat:'inf.antiviral', form:'tablet',
  doses:['90 mg with sofosbuvir 400 mg'], brand:['Harvoni'],
  tags:['inducerSensitive'],
  notes:{en:'Combined with sofosbuvir for hepatitis C. Acid-reducing medicines lower its absorption — ask before taking any. Never with amiodarone.',
         ar:'مركّب مع السوفوسبوفير لالتهاب الكبد C. خافضات الحمض تقلّل امتصاصه — استشر قبل أخذ أي منها. لا يُجمع أبداً مع الأميودارون.'},
  ask:['antacids', 'otherMeds'] },

{ sci:'Velpatasvir', ar:'فيلباتاسفير', atc:'J05AP55', cat:'inf.antiviral', form:'tablet',
  doses:['100 mg with sofosbuvir 400 mg'], brand:['Epclusa'],
  tags:['inducerSensitive'],
  notes:{en:'Combined with sofosbuvir for all hepatitis C types. Acid-reducing medicines lower its absorption. Never with amiodarone.',
         ar:'مركّب مع السوفوسبوفير لجميع أنماط التهاب الكبد C. خافضات الحمض تقلّل امتصاصه. لا يُجمع أبداً مع الأميودارون.'},
  ask:['antacids', 'otherMeds'] },

{ sci:'Peginterferon alfa', ar:'بيغ إنترفيرون ألفا', atc:'L03AB11', cat:'inf.antiviral', form:'injection',
  doses:['135 microgram', '180 microgram prefilled syringe'], brand:['Pegasys', 'PegIntron'], aka:['Peginterferon alfa-2a', 'Peginterferon alfa-2b'],
  notes:{en:'A weekly injection for hepatitis B or C. Flu-like symptoms, tiredness and low mood are common — report depression. Blood counts are checked.',
         ar:'حقنة أسبوعية لالتهاب الكبد B أو C. أعراض تشبه الإنفلونزا والتعب وانخفاض المزاج شائعة — أبلغ عن الاكتئاب. يُفحص تعداد الدم.'},
  ci:['hepSevere', {en:'Severe depression', ar:'اكتئاب شديد'}, 'preg'],
  ask:['mood', 'labs', 'injectTech'] },

{ sci:'Interferon alfa', ar:'إنترفيرون ألفا', atc:'L03AB04', cat:'inf.antiviral', form:'injection',
  doses:['3 MIU', '5 MIU', '10 MIU'], brand:['Intron A', 'Roferon-A'], aka:['Interferon alfa-2a', 'Interferon alfa-2b'],
  notes:{en:'Injections for some viral hepatitis and cancers. Flu-like symptoms and low mood are common — report depression.',
         ar:'حقن لبعض حالات التهاب الكبد الفيروسي والأورام. أعراض تشبه الإنفلونزا وانخفاض المزاج شائعة — أبلغ عن الاكتئاب.'},
  ci:['hepSevere', {en:'Severe depression', ar:'اكتئاب شديد'}],
  ask:['mood', 'labs', 'cold'] },

/* ---------- HIV ---------- */

{ sci:'Dolutegravir', ar:'دولوتيغرافير', atc:'J05AJ03', cat:'inf.hiv', form:'tablet',
  doses:['50 mg', 'with lamivudine', 'with tenofovir and lamivudine'], brand:['Tivicay', 'Dovato'],
  tags:['chelatable', 'inducerSensitive'],
  notes:{en:'Once a day. Keep it 2 hours before or 6 hours after antacids, calcium or iron — or take calcium and iron together with it and food. It raises metformin.',
         ar:'مرة واحدة يومياً. خذه قبل مضادات الحموضة أو الكالسيوم أو الحديد بساعتين أو بعدها بست ساعات — أو خذ الكالسيوم والحديد معه ومع الطعام. يرفع الميتفورمين.'},
  ix:[
    ['Metformin', W, 'Raises metformin — the dose may need lowering.', 'يرفع الميتفورمين — قد تحتاج جرعته إلى تخفيض.']
  ],
  ask:['antacids', 'otherMeds', 'preg'] },

{ sci:'Efavirenz', ar:'إيفافيرينز', atc:'J05AG03', cat:'inf.hiv', form:'tablet',
  doses:['600 mg', 'with tenofovir and emtricitabine'], brand:['Stocrin', 'Sustiva', 'Atripla'],
  tags:['inducer', 'qtPossible'], take:['bedtime', 'emptyStomach'],
  notes:{en:'At bedtime on an empty stomach. Vivid dreams and dizziness are common in the first weeks. Report low mood. It makes the pill unreliable.',
         ar:'قبل النوم على معدة فارغة. الأحلام الواضحة والدوخة شائعة في الأسابيع الأولى. أبلغ عن انخفاض المزاج. يجعل حبوب منع الحمل غير موثوقة.'},
  ask:['mood', 'ocp', 'otherMeds'] },

{ sci:'Nevirapine', ar:'نيفيرابين', atc:'J05AG01', cat:'inf.hiv', form:'tablet',
  doses:['200 mg', '400 mg XR', '10 mg/mL suspension'], brand:['Viramune'],
  tags:['inducer'],
  notes:{en:'Started at a lower dose for two weeks. A rash, especially with fever, or yellowing in the first months means stop and seek help.',
         ar:'يُبدأ بجرعة أقل لمدة أسبوعين. الطفح، خاصة مع الحرارة، أو الاصفرار في الأشهر الأولى يستوجب الإيقاف وطلب المساعدة.'},
  ci:['hepModSevere'],
  ask:['rash', 'liver', 'ocp'] },

{ sci:'Zidovudine', ar:'زيدوفودين', atc:'J05AF01', cat:'inf.hiv', form:'capsule',
  doses:['100 mg', '250 mg', '300 mg', 'with lamivudine', '50 mg/5 mL', '10 mg/mL infusion'], brand:['Retrovir', 'Combivir'], aka:['AZT'],
  notes:{en:'It can cause anaemia and low white cells — blood counts are checked. Headache and nausea at first.',
         ar:'قد يسبّب فقر الدم ونقص الكريات البيض — يُفحص تعداد الدم. صداع وغثيان في البداية.'},
  ci:['marrow'],
  ask:['labs', 'otherMeds'] },

{ sci:'Abacavir', ar:'أباكافير', atc:'J05AF06', cat:'inf.hiv', form:'tablet',
  doses:['300 mg', '600 mg with lamivudine 300 mg'], brand:['Ziagen', 'Kivexa'],
  notes:{en:'A serious allergic reaction can start in the first six weeks — fever, rash, vomiting, breathlessness: stop and never restart. The HLA-B*5701 test is done first.',
         ar:'قد يبدأ تفاعل تحسّسي خطير في الأسابيع الستة الأولى — حرارة أو طفح أو قيء أو ضيق نفس: أوقفه ولا تعد إليه أبداً. يُجرى فحص HLA-B*5701 أولاً.'},
  ci:[{en:'HLA-B*5701 positive, or previous hypersensitivity to abacavir', ar:'إيجابية HLA-B*5701، أو فرط حساسية سابق للأباكافير'}],
  ask:['allergy', 'heart'] },

{ sci:'Emtricitabine', ar:'إمتريسيتابين', atc:'J05AF09', cat:'inf.hiv', form:'capsule',
  doses:['200 mg', 'with tenofovir'], brand:['Emtriva', 'Truvada'],
  notes:{en:'Part of HIV treatment and prevention. Stopping it can cause a hepatitis B flare in people who have both.',
         ar:'جزء من علاج فيروس نقص المناعة والوقاية منه. إيقافه قد يسبّب انتكاس التهاب الكبد B لمن لديه الاثنان.'},
  ask:['kidney', 'hepatitis'] },

{ sci:'Lopinavir/Ritonavir', ar:'لوبينافير/ريتونافير', atc:'J05AR10', cat:'inf.hiv', form:'tablet',
  doses:['200/50 mg tablet', '80/20 mg/mL solution'], brand:['Kaletra'],
  tags:['inh3a4', 'qtPossible'],
  notes:{en:'Twice a day. It interacts with a great many medicines — read the whole list before dispensing anything alongside it.',
         ar:'مرتين يومياً. يتداخل مع أدوية كثيرة جداً — اقرأ القائمة كلها قبل صرف أي دواء معه.'},
  ask:['otherMeds', 'ocp', 'liver'] },

{ sci:'Ritonavir', ar:'ريتونافير', atc:'J05AE03', cat:'inf.hiv', form:'tablet',
  doses:['100 mg'], brand:['Norvir'],
  tags:['inh3a4'],
  notes:{en:'Used in small doses to boost other HIV and hepatitis medicines. It interacts with a great many medicines — read the whole list.',
         ar:'يُستعمل بجرعات صغيرة لتعزيز أدوية أخرى لفيروس نقص المناعة والتهاب الكبد. يتداخل مع أدوية كثيرة جداً — اقرأ القائمة كلها.'},
  ask:['otherMeds', 'ocp'] },

{ sci:'Raltegravir', ar:'رالتيغرافير', atc:'J05AJ01', cat:'inf.hiv', form:'tablet',
  doses:['400 mg', '600 mg'], brand:['Isentress'],
  tags:['chelatable'],
  notes:{en:'Twice a day (or 1,200 mg once). Keep apart from aluminium and magnesium antacids.',
         ar:'مرتين يومياً (أو 1200 ملغ مرة واحدة). افصل بينه وبين مضادات الحموضة الحاوية على الألمنيوم والمغنيسيوم.'},
  ask:['antacids', 'otherMeds'] }

];
