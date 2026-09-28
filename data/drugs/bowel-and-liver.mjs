/* Digestive system, part two: inflammatory bowel disease, liver and
   gallbladder, digestive enzymes and wind, haemorrhoids, probiotics.
   Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Inflammatory bowel disease ---------- */

{ sci:'Mesalazine', ar:'ميسالازين', atc:'A07EC02', cat:'gis.ibd', form:'tablet',
  doses:['400 mg', '500 mg', '800 mg', '1 g', '1.2 g', '1 g suppository', '1 g enema', '2 g granules'], brand:['Pentasa', 'Asacol', 'Salofalk', 'Mezavant'], aka:['Mesalamine', '5-ASA'],
  notes:{en:'Swallow tablets whole. Brands release the drug differently, so stay on the same one. Report unexplained bruising, fever or a sore throat, and keep the kidney tests you are booked for.',
         ar:'تُبلع الأقراص كاملة. تختلف الماركات في طريقة إطلاق الدواء، فابقَ على الماركة نفسها. أبلغ عن كدمات غير مبرّرة أو حرارة أو التهاب حلق، والتزم بفحوص الكلى المحددة.'},
  ix:[
    ['Azathioprine', W, 'More risk of low white cells.', 'خطر أكبر لانخفاض الكريات البيض.'],
    ['Warfarin', W, 'May weaken warfarin.', 'قد يُضعف الوارفارين.']
  ],
  ci:['renalSevere', {en:'Salicylate hypersensitivity', ar:'فرط الحساسية للساليسيلات'}],
  ask:['kidney', 'allergyNsaid', 'labs'] },

{ sci:'Sulfasalazine', ar:'سلفاسالازين', atc:'A07EC01', cat:'gis.ibd', form:'tablet',
  doses:['500 mg', '500 mg EC'], brand:['Salazopyrin', 'Azulfidine'],
  take:['afterFood'],
  notes:{en:'After food with plenty of water. It turns urine and sweat orange and can stain soft contact lenses. Blood counts and liver tests in the first months; report fever, sore throat or rash.',
         ar:'بعد الطعام مع ماء كثير. يلوّن البول والعرق باللون البرتقالي وقد يصبغ العدسات اللاصقة اللينة. تعداد دم وفحص كبد في الأشهر الأولى؛ أبلغ عن الحرارة أو التهاب الحلق أو الطفح.'},
  ix:[
    ['Digoxin', W, 'Lowers digoxin absorption.', 'يقلّل امتصاص الديجوكسين.'],
    ['Folic acid', W, 'Lowers folate absorption.', 'يقلّل امتصاص الفولات.'],
    ['Azathioprine', W, 'More marrow suppression.', 'مزيد من تثبيط نقي العظم.'],
    ['Methotrexate', W, 'More liver and marrow toxicity.', 'مزيد من السمّية على الكبد ونقي العظم.']
  ],
  ci:['sulfaAllergy', {en:'Salicylate hypersensitivity', ar:'فرط الحساسية للساليسيلات'}, 'porphyria'],
  ask:['allergySulfa', 'g6pd', 'labs'] },

/* ---------- Liver and gallbladder ---------- */

{ sci:'Ursodeoxycholic acid', ar:'حمض الأورسوديوكسيكوليك', atc:'A05AA02', cat:'gis.liver', form:'capsule',
  doses:['150 mg', '250 mg', '300 mg', '500 mg'], brand:['Ursofalk', 'Urso', 'Actigall'], aka:['Ursodiol'],
  take:['withFood'],
  notes:{en:'With food — for gallstones, with the evening meal. It takes months to dissolve stones. Loose stools are the usual side effect.',
         ar:'مع الطعام — ولحصى المرارة مع وجبة المساء. يحتاج أشهراً لإذابة الحصى. ليونة البراز أشيع آثاره.'},
  ix:[
    ['Aluminium hydroxide', W, 'Binds it — two hours apart.', 'يربطه — بفاصل ساعتين.'],
    ['Colestyramine', W, 'Binds it — keep the doses apart.', 'يربطه — افصل بين الجرعات.']
  ],
  ci:[{en:'Acute inflammation of the gallbladder or bile ducts', ar:'التهاب حاد في المرارة أو القنوات الصفراوية'}, {en:'Calcified gallstones', ar:'حصى مرارة متكلّسة'}],
  ask:[{en:'Do you have pain under the right ribs with fever or yellow eyes?', ar:'هل لديك ألم تحت الأضلاع اليمنى مع حرارة أو اصفرار العينين؟'}, 'preg'] },

{ sci:'Silymarin', ar:'سيليمارين', atc:'A05BA03', cat:'gis.liver', form:'capsule',
  doses:['70 mg', '140 mg'], brand:['Legalon'], aka:['Milk thistle'],
  notes:{en:'A herbal liver support; the evidence is limited. It does not treat hepatitis or undo alcohol damage.',
         ar:'داعم كبدي عشبي؛ والأدلة على فائدته محدودة. لا يعالج التهاب الكبد ولا يصلح ضرر الكحول.'},
  ask:['liver', 'preg'] },

{ sci:'Phosphatidylcholine', ar:'فوسفاتيديل كولين', atc:'A05C', cat:'gis.liver', form:'capsule',
  doses:['300 mg'], brand:['Essentiale'], aka:['Essential phospholipids', 'Polyenylphosphatidylcholine'],
  take:['withFood'],
  notes:{en:'A liver supplement taken with meals; evidence is limited. Mild stomach upset or loose stools can occur.',
         ar:'مكمّل للكبد يؤخذ مع الوجبات؛ والأدلة محدودة. قد يسبّب انزعاجاً خفيفاً في المعدة أو ليونة في البراز.'},
  ask:['liver'] },

{ sci:'L-ornithine L-aspartate', ar:'إل-أورنيثين إل-أسبارتات', atc:'A05BA06', cat:'gis.liver', form:'sachet',
  doses:['3 g granules', '5 g/10 mL infusion'], brand:['Hepa-Merz'], aka:['LOLA', 'Ornithine aspartate'],
  notes:{en:'Lowers ammonia in liver disease: granules dissolved in water after meals, or an infusion in hospital.',
         ar:'يخفض الأمونيا في أمراض الكبد: حبيبات تُذاب في الماء بعد الوجبات، أو تسريب في المستشفى.'},
  ci:['renalSevere'],
  ask:['kidney'] },

{ sci:'Rifaximin', ar:'ريفاكسيمين', atc:'A07AA11', cat:'gis.liver', form:'tablet',
  doses:['200 mg', '550 mg'], brand:['Xifaxan', 'Normix'],
  notes:{en:'An antibiotic that stays in the gut: short courses for traveller’s diarrhoea, and long term with lactulose to prevent confusion in liver disease.',
         ar:'مضاد حيوي يبقى في الأمعاء: دورات قصيرة لإسهال المسافرين، وطويلاً مع اللاكتولوز للوقاية من التشوّش الذهني في أمراض الكبد.'},
  ix:[
    ['Ciclosporin', S, 'Raises rifaximin levels many times over.', 'يرفع مستوى الريفاكسيمين أضعافاً.'],
    ['Warfarin', W, 'INR changes reported — check it.', 'سُجّلت تغيّرات في INR — افحصه.']
  ],
  ci:['dysentery'],
  ask:['liver', 'feverBlood'] },

/* ---------- Digestive enzymes and wind ---------- */

{ sci:'Pancreatin', ar:'بانكرياتين', atc:'A09AA02', cat:'gis.digestive', form:'capsule',
  doses:['10,000', '25,000', '40,000 lipase units'], brand:['Creon'], aka:['Pancrelipase'],
  notes:{en:'With every meal and snack, swallowed whole — or the granules sprinkled on acidic soft food, not chewed. Drink plenty of fluid.',
         ar:'مع كل وجبة ووجبة خفيفة، تُبلع كاملة — أو تُنثر الحبيبات على طعام لين حمضي دون مضغ. اشرب سوائل كثيرة.'},
  ix:[
    ['Acarbose', W, 'Pancreatic enzymes weaken acarbose.', 'إنزيمات البنكرياس تُضعف الأكاربوز.']
  ],
  ask:['whoFor', {en:'How many capsules do you take with a meal, and with a snack?', ar:'كم كبسولة تأخذ مع الوجبة، وكم مع الوجبة الخفيفة؟'}] },

{ sci:'Simeticone', ar:'سيميثيكون', atc:'A03AX13', cat:'gis.digestive', form:'drops',
  doses:['40 mg/mL drops', '80 mg chewable', '125 mg'], brand:['Espumisan', 'Infacol', 'Mylicon'], aka:['Simethicone', 'Dimeticone', 'Dimethicone'],
  notes:{en:'For wind and colic: after meals and at bedtime, or for infants before feeds. It is not absorbed.',
         ar:'للغازات والمغص: بعد الوجبات وقبل النوم، أو للرضّع قبل الرضعات. لا يُمتص.'},
  ix:[
    ['Levothyroxine', W, 'May reduce absorption — keep four hours apart.', 'قد يقلّل الامتصاص — افصل بينهما أربع ساعات.']
  ],
  ask:['childAge', 'redFlagsGI'] },

/* ---------- Haemorrhoids and anal fissure ---------- */

{ sci:'Cinchocaine', ar:'سينشوكائين', atc:'C05AD04', cat:'gis.haemorrhoid', form:'ointment',
  doses:['0.5% with hydrocortisone, ointment and suppository'], brand:['Proctosedyl', 'Ultraproct', 'Scheriproct'], aka:['Dibucaine'],
  notes:{en:'After each bowel movement, up to three times a day, for no more than seven days. Bleeding that keeps coming back needs a doctor.',
         ar:'بعد كل تبرّز، حتى ثلاث مرات يومياً، لمدة لا تتجاوز سبعة أيام. النزف المتكرّر يحتاج طبيباً.'},
  ci:['skinInfection'],
  ask:['redFlagsGI', 'duration', 'preg'] },

{ sci:'Tribenoside', ar:'تريبينوسيد', atc:'C05AX05', cat:'gis.haemorrhoid', form:'suppository',
  doses:['400 mg with lidocaine 40 mg suppository', 'cream'], brand:['Procto-Glyvenol'],
  notes:{en:'For piles: a suppository or cream morning and evening until the attack settles. See a doctor for bleeding that persists.',
         ar:'للبواسير: تحميلة أو كريم صباحاً ومساءً حتى تهدأ النوبة. راجع الطبيب إن استمر النزف.'},
  ci:['preg1'],
  ask:['redFlagsGI', 'duration', 'preg'] },

/* ---------- Probiotics ---------- */

{ sci:'Saccharomyces boulardii', ar:'سكارومايسس بولاردي', atc:'A07FA02', cat:'gis.probiotic', form:'capsule',
  doses:['250 mg capsule', '250 mg sachet'], brand:['Perenterol', 'Florastor', 'Ultra-Levure'],
  notes:{en:'A yeast probiotic for diarrhoea, including with antibiotics. Open into cool food or drink, never hot. Not for people with a central line or very weak immunity.',
         ar:'بروبيوتيك من الخمائر للإسهال، ومنه المرافق للمضادات الحيوية. يُفتح في طعام أو شراب بارد، لا ساخن أبداً. لا يُستعمل لمن لديه قثطرة وريدية مركزية أو مناعة ضعيفة جداً.'},
  ix:[
    ['Fluconazole', W, 'Antifungals kill the yeast — do not take together.', 'مضادات الفطريات تقتل الخميرة — لا يُؤخذان معاً.'],
    ['Nystatin', W, 'Antifungals kill the yeast — do not take together.', 'مضادات الفطريات تقتل الخميرة — لا يُؤخذان معاً.']
  ],
  ci:['immunocompromised', {en:'Central venous catheter', ar:'قثطرة وريدية مركزية'}],
  ask:['childAge', 'feverBlood'] },

{ sci:'Lactobacillus', ar:'لاكتوباسيلس', atc:'A07FA01', cat:'gis.probiotic', form:'capsule',
  doses:['capsule', 'sachet', 'drops'], brand:['Lacteol', 'Culturelle', 'BioGaia'], aka:['Lactobacillus acidophilus', 'Lactobacillus rhamnosus', 'Lactobacillus reuteri', 'Bifidobacterium'],
  notes:{en:'A probiotic for diarrhoea or alongside antibiotics — take it two hours apart from the antibiotic dose.',
         ar:'بروبيوتيك للإسهال أو مع المضادات الحيوية — يؤخذ بفاصل ساعتين عن جرعة المضاد.'},
  ix:[
    ['Amoxicillin', W, 'Antibiotics kill it — take it two hours away from the antibiotic.', 'المضادات الحيوية تقتله — خذه بفاصل ساعتين عن المضاد.']
  ],
  ci:['immunocompromised'],
  ask:['childAge', 'feverBlood'] },

{ sci:'Bacillus clausii', ar:'باسيلس كلاوزي', atc:'A07FA', cat:'gis.probiotic', form:'solution',
  doses:['2 billion spores/5 mL vial'], brand:['Enterogermina'],
  notes:{en:'Spore probiotic vials for diarrhoea, drunk as they are or mixed in a drink; two hours apart from an antibiotic dose.',
         ar:'قناني بروبيوتيك من الأبواغ للإسهال، تُشرب كما هي أو تُمزج في شراب؛ بفاصل ساعتين عن جرعة المضاد الحيوي.'},
  ci:['immunocompromised'],
  ask:['childAge', 'feverBlood'] }

];
