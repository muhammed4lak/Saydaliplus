/* Anaesthesia and critical care: general anaesthetics and sedation, local
   anaesthetics (including dental cartridges and numbing creams), and the
   muscle blockers and their reversal. Opioids live with pain; pressors with
   the heart. Mostly hospital supply — the questions are the ones worth
   asking before a procedure.
   Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

const MH = {en:'Personal or family history of malignant hyperthermia', ar:'تاريخ شخصي أو عائلي لفرط الحرارة الخبيث'};

export default [

/* ---------- General anaesthesia and sedation ---------- */

{ sci:'Propofol', ar:'بروبوفول', atc:'N01AX10', cat:'ana.general', form:'injection',
  doses:['10 mg/mL emulsion', '20 mg/mL emulsion'], brand:['Diprivan', 'Propoven'],
  tags:['sedative'],
  notes:{en:'Puts you to sleep for surgery or sedation within seconds; the injection can sting. After sedation: no driving, machinery or important decisions for 24 hours, and an adult should take you home.',
         ar:'ينوّمك للجراحة أو التهدئة خلال ثوانٍ؛ وقد تلسع الحقنة. بعد التهدئة: لا قيادة ولا تشغيل آلات ولا قرارات مهمة لمدة 24 ساعة، ويجب أن يرافقك بالغ إلى البيت.'},
  ci:[{en:'Allergy to soya or peanut', ar:'الحساسية من الصويا أو الفول السوداني'}],
  ask:['lastMeal', 'anaesthetic', 'allergy'] },

{ sci:'Ketamine', ar:'كيتامين', atc:'N01AX03', cat:'ana.general', form:'injection',
  doses:['10 mg/mL', '50 mg/mL', '100 mg/mL injection'], brand:['Ketalar'],
  tags:['sedative'],
  notes:{en:'An anaesthetic that keeps breathing going, used for short procedures, trauma and in children. Vivid dreams or confusion on waking are common. It raises blood pressure and heart rate.',
         ar:'مخدّر يحافظ على التنفس، يُستعمل للإجراءات القصيرة والإصابات وعند الأطفال. الأحلام الواضحة أو التشوّش عند الاستيقاظ شائعة. يرفع الضغط وسرعة القلب.'},
  ci:['uncontrolledHtn', 'recentMI', {en:'Psychosis', ar:'الذهان'}],
  ask:['lastMeal', 'bp', 'mood'] },

{ sci:'Thiopental', ar:'ثيوبنتال', atc:'N01AF03', cat:'ana.general', form:'injection',
  doses:['500 mg vial', '1 g vial'], brand:['Pentothal'], aka:['Thiopentone', 'Thiopental sodium'],
  tags:['sedative'],
  notes:{en:'A fast-acting barbiturate for starting anaesthesia; drowsiness can last into the next day.',
         ar:'باربيتورات سريع المفعول لبدء التخدير؛ وقد يستمر النعاس إلى اليوم التالي.'},
  ci:['porphyria', 'asthmaUncontrolled'],
  ask:['lastMeal', 'anaesthetic', 'asthma'] },

{ sci:'Etomidate', ar:'إيتوميدات', atc:'N01AX07', cat:'ana.general', form:'injection',
  doses:['2 mg/mL emulsion'], brand:['Hypnomidate', 'Etomidate-Lipuro'],
  tags:['sedative'],
  notes:{en:'Starts anaesthesia with little effect on blood pressure, useful in unstable patients; brief muscle twitching is common.',
         ar:'يبدأ التخدير بتأثير قليل على الضغط، مفيد عند المرضى غير المستقرين؛ ارتعاش العضلات العابر شائع.'},
  ci:['addison'],
  ask:['lastMeal', 'anaesthetic', 'steroids'] },

{ sci:'Sevoflurane', ar:'سيفوفلوران', atc:'N01AB08', cat:'ana.general', form:'solution',
  doses:['250 mL bottle for vaporiser'], brand:['Sevorane', 'Ultane'],
  tags:['sedative', 'qtPossible'],
  notes:{en:'A sweet-smelling anaesthetic gas, often used to put children to sleep by mask. Agitation on waking is common in children and passes.',
         ar:'غاز تخدير عطِر الرائحة، يُستعمل كثيراً لتنويم الأطفال بالقناع. الهياج عند الاستيقاظ شائع عند الأطفال ويزول.'},
  ci:[MH],
  ask:['anaesthetic', 'lastMeal', 'childAge'] },

{ sci:'Isoflurane', ar:'إيزوفلوران', atc:'N01AB06', cat:'ana.general', form:'solution',
  doses:['100 mL and 250 mL bottle for vaporiser'], brand:['Forane', 'Aerrane'],
  tags:['sedative'],
  notes:{en:'An anaesthetic gas for keeping anaesthesia going during surgery.',
         ar:'غاز تخدير للمحافظة على التخدير أثناء الجراحة.'},
  ci:[MH],
  ask:['anaesthetic', 'lastMeal'] },

{ sci:'Desflurane', ar:'ديسفلوران', atc:'N01AB07', cat:'ana.general', form:'solution',
  doses:['240 mL bottle for vaporiser'], brand:['Suprane'],
  tags:['sedative'],
  notes:{en:'A fast on-and-off anaesthetic gas for keeping anaesthesia going; not used to put people to sleep by mask, as it irritates the airway.',
         ar:'غاز تخدير سريع البدء والزوال للمحافظة على التخدير؛ لا يُستعمل للتنويم بالقناع لأنه يهيّج المجاري التنفسية.'},
  ci:[MH],
  ask:['anaesthetic', 'lastMeal', 'asthma'] },

{ sci:'Halothane', ar:'هالوثان', atc:'N01AB01', cat:'ana.general', form:'solution',
  doses:['250 mL bottle for vaporiser'], brand:['Fluothane'],
  tags:['sedative'],
  notes:{en:'An older anaesthetic gas. Repeated exposure within a few months can inflame the liver, so it is avoided if it was used recently or caused jaundice before.',
         ar:'غاز تخدير قديم. التعرّض المتكرر خلال بضعة أشهر قد يلهب الكبد، لذا يُتجنّب إن استُعمل مؤخراً أو سبّب يرقاناً من قبل.'},
  ix:[
    ['Adrenaline', S, 'Halothane sensitises the heart to adrenaline — dangerous rhythms; adrenaline in local anaesthetic is kept small.', 'يجعل الهالوثان القلب حساساً للأدرينالين — اضطرابات نظم خطيرة؛ ويُقلَّل الأدرينالين في المخدّر الموضعي.']
  ],
  ci:[MH, {en:'Jaundice after a previous halothane anaesthetic, or exposure in the last three months', ar:'يرقان بعد تخدير سابق بالهالوثان، أو تعرّض له خلال الأشهر الثلاثة الماضية'}],
  ask:['anaesthetic', 'liver', 'lastMeal'] },

{ sci:'Nitrous oxide', ar:'أكسيد النيتروز', atc:'N01AX13', cat:'ana.general', form:'solution',
  doses:['50% with oxygen (Entonox)', 'medical gas cylinder'], brand:['Entonox'], aka:['Laughing gas'],
  notes:{en:'Breathed in through a mouthpiece for labour pain and short painful procedures; the effect wears off within minutes of stopping. No driving for 30 minutes after.',
         ar:'يُستنشق عبر قطعة فم لآلام الولادة والإجراءات القصيرة المؤلمة؛ ويزول أثره خلال دقائق من التوقف. لا قيادة لمدة 30 دقيقة بعده.'},
  ix:[
    ['Methotrexate', S, 'Nitrous oxide inactivates vitamin B12 and adds to methotrexate toxicity — avoid repeated use.', 'يُعطّل أكسيد النيتروز فيتامين B12 ويزيد سمّية الميثوتريكسيت — يُتجنّب الاستعمال المتكرر.']
  ],
  ci:[{en:'Air trapped in the chest, skull, bowel or eye (pneumothorax, recent eye gas surgery, bowel obstruction)', ar:'هواء محبوس في الصدر أو الجمجمة أو الأمعاء أو العين (استرواح الصدر، جراحة عين حديثة بالغاز، انسداد الأمعاء)'}, {en:'Vitamin B12 deficiency', ar:'نقص فيتامين B12'}],
  ask:['whoFor', 'drive'] },

{ sci:'Dexmedetomidine', ar:'ديكسميديتوميدين', atc:'N05CM18', cat:'ana.general', form:'injection',
  doses:['100 microgram/mL concentrate', '4 microgram/mL ready-diluted'], brand:['Precedex', 'Dexdor'],
  tags:['sedative', 'bradycardic'],
  notes:{en:'A calming sedative for intensive care and procedures that keeps patients rousable; the pulse and blood pressure often drop.',
         ar:'مهدّئ للعناية المركّزة والإجراءات يُبقي المريض قابلاً للإيقاظ؛ وكثيراً ما ينخفض النبض والضغط.'},
  ci:['heartBlock'],
  ask:['slowPulse', 'lowBp', 'allergy'] },

{ sci:'Midazolam', ar:'ميدازولام', atc:'N05CD08', cat:'ana.general', form:'injection',
  doses:['1 mg/mL', '5 mg/mL injection', '7.5 mg and 15 mg tablet', '2.5 mg to 10 mg oromucosal solution (seizures)'], brand:['Dormicum', 'Hypnovel', 'Buccolam'],
  tags:['benzo', 'sedative', 'sub3a4crit'], controlled:true,
  notes:{en:'Sedation for procedures, and a rescue medicine for long seizures given into the cheek. Memory of the procedure may be patchy; no driving or important decisions for 24 hours after.',
         ar:'للتهدئة أثناء الإجراءات، ودواء إسعافي للنوبات الطويلة يُعطى داخل الخد. قد تكون ذاكرة الإجراء متقطعة؛ لا قيادة ولا قرارات مهمة لمدة 24 ساعة بعده.'},
  ci:['respInsufficiency', 'sleepApnoea', 'myasthenia'],
  ask:['sedatives', 'drive', 'otherMeds'] },

/* ---------- Local anaesthetics ---------- */

{ sci:'Lidocaine', ar:'ليدوكايين', atc:'N01BB02', cat:'ana.local', form:'injection',
  doses:['1% and 2% injection', '2% with adrenaline (dental)', '2% gel', '10% spray', '5% ointment', '4% cream', '5% plaster', '2% viscous oral solution', '100 mg/5 mL IV (heart rhythm)'], brand:['Xylocaine', 'Instillagel', 'Versatis', 'Lignospan'], aka:['Lignocaine', 'Lidocaine hydrochloride'],
  notes:{en:'Numbs the skin, mouth, throat or a nerve. After mouth or throat numbing, eat or drink nothing hot until feeling returns (about an hour) and do not chew the numb lip. Plasters go on for 12 hours, then off for 12.',
         ar:'يخدّر الجلد أو الفم أو الحلق أو العصب. بعد تخدير الفم أو الحلق لا تأكل ولا تشرب شيئاً ساخناً حتى يعود الإحساس (نحو ساعة) ولا تعضّ الشفة المخدّرة. اللصقات توضع 12 ساعة ثم تُنزع 12 ساعة.'},
  ix:[
    ['Amiodarone', S, 'Raises lidocaine levels when given into a vein — numbness, fits and rhythm problems.', 'يرفع مستوى الليدوكايين عند إعطائه وريدياً — تنميل ونوبات واضطراب نظم.'],
    ['#betaBlocker', W, 'Propranolol and other beta-blockers raise lidocaine levels (intravenous use).', 'البروبرانولول وحاصرات بيتا الأخرى ترفع مستوى الليدوكايين (الاستعمال الوريدي).']
  ],
  ci:[{en:'Allergy to amide local anaesthetics', ar:'الحساسية من المخدّرات الموضعية الأميدية'}, 'heartBlock'],
  ask:['allergy', 'heart', 'whatFor'] },

{ sci:'Lidocaine/Prilocaine', ar:'ليدوكايين/بريلوكايين', atc:'N01BB20', cat:'ana.local', form:'cream',
  doses:['2.5% / 2.5% cream', 'patch'], brand:['EMLA'], aka:['EMLA cream'],
  notes:{en:'Numbs the skin before needles: a thick blob under a clear dressing one hour before (up to five hours). In babies the dose and time on the skin are limited, as too much can turn the blood unable to carry oxygen.',
         ar:'يخدّر الجلد قبل الإبر: كتلة سميكة تحت ضماد شفاف قبل ساعة (حتى خمس ساعات). عند الرضّع تُحدَّد الكمية ومدة البقاء على الجلد، لأن الزيادة قد تُفقد الدم قدرته على حمل الأكسجين.'},
  ix:[
    ['Dapsone', W, 'Adds to the risk of methaemoglobinaemia (blood that cannot carry oxygen).', 'يزيد خطر ميتهيموغلوبينية الدم (عجز الدم عن حمل الأكسجين).'],
    ['Trimethoprim/Sulfamethoxazole', W, 'Sulfonamides add to the risk of methaemoglobinaemia.', 'السلفوناميدات تزيد خطر ميتهيموغلوبينية الدم.']
  ],
  ci:[{en:'Premature babies under 37 weeks', ar:'الخدّج دون 37 أسبوعاً'}, {en:'Methaemoglobinaemia', ar:'ميتهيموغلوبينية الدم'}],
  ask:['childAge', 'g6pd', 'whatFor'] },

{ sci:'Bupivacaine', ar:'بوبيفاكايين', atc:'N01BB01', cat:'ana.local', form:'injection',
  doses:['0.25% injection', '0.5% injection', '0.5% heavy (spinal)', 'with adrenaline'], brand:['Marcaine', 'Sensorcaine'],
  notes:{en:'A long-acting local anaesthetic for spinal and epidural anaesthesia and nerve blocks; numbness can last many hours — protect the numb limb.',
         ar:'مخدّر موضعي طويل المفعول للتخدير النخاعي وفوق الجافية وإحصار الأعصاب؛ قد يستمر الخدر ساعات طويلة — احمِ الطرف المخدّر.'},
  ix:[
    ['Amiodarone', W, 'Additive effects on the heart — more cardiac toxicity if levels run high.', 'تأثيرات مضافة على القلب — سمّية قلبية أكبر إذا ارتفعت المستويات.']
  ],
  ci:[{en:'Intravenous regional anaesthesia (Bier’s block)', ar:'التخدير الوريدي الناحي (إحصار بيير)'}, {en:'Allergy to amide local anaesthetics', ar:'الحساسية من المخدّرات الموضعية الأميدية'}],
  ask:['thinner', 'allergy', 'heart'] },

{ sci:'Levobupivacaine', ar:'ليفوبوبيفاكايين', atc:'N01BB10', cat:'ana.local', form:'injection',
  doses:['2.5 mg/mL', '5 mg/mL', '7.5 mg/mL injection'], brand:['Chirocaine'],
  notes:{en:'A long-acting local anaesthetic for epidurals and nerve blocks, slightly gentler on the heart than bupivacaine.',
         ar:'مخدّر موضعي طويل المفعول لفوق الجافية وإحصار الأعصاب، ألطف قليلاً على القلب من البوبيفاكايين.'},
  ix:[
    ['Amiodarone', W, 'Additive effects on the heart — more cardiac toxicity if levels run high.', 'تأثيرات مضافة على القلب — سمّية قلبية أكبر إذا ارتفعت المستويات.']
  ],
  ask:['thinner', 'allergy', 'heart'] },

{ sci:'Ropivacaine', ar:'روبيفاكايين', atc:'N01BB09', cat:'ana.local', form:'injection',
  doses:['2 mg/mL', '7.5 mg/mL', '10 mg/mL injection'], brand:['Naropin'],
  notes:{en:'A long-acting local anaesthetic for epidurals (including in labour) and nerve blocks.',
         ar:'مخدّر موضعي طويل المفعول لفوق الجافية (ومنها أثناء الولادة) وإحصار الأعصاب.'},
  ix:[
    ['Amiodarone', W, 'Additive effects on the heart — more cardiac toxicity if levels run high.', 'تأثيرات مضافة على القلب — سمّية قلبية أكبر إذا ارتفعت المستويات.'],
    ['Fluvoxamine', S, 'Fluvoxamine (and ciprofloxacin, less) raise ropivacaine — avoid long infusions together.', 'الفلوفوكسامين (والسيبروفلوكساسين بدرجة أقل) يرفع الروبيفاكايين — تُتجنّب التسريبات الطويلة معاً.']
  ],
  ask:['thinner', 'allergy', 'heart'] },

{ sci:'Prilocaine', ar:'بريلوكايين', atc:'N01BB04', cat:'ana.local', form:'injection',
  doses:['3% with felypressin (dental)', '4% plain (dental)', '2% heavy (spinal)'], brand:['Citanest'],
  notes:{en:'A dental and spinal anaesthetic, useful when adrenaline is best avoided. In large doses it can stop the blood carrying oxygen — a blue tinge needs urgent help.',
         ar:'مخدّر للأسنان وللتخدير النخاعي، مفيد حين يُفضّل تجنّب الأدرينالين. بجرعات كبيرة قد يمنع الدم من حمل الأكسجين — الزرقة تستوجب مساعدة عاجلة.'},
  ix:[
    ['Dapsone', W, 'Adds to the risk of methaemoglobinaemia (blood that cannot carry oxygen).', 'يزيد خطر ميتهيموغلوبينية الدم (عجز الدم عن حمل الأكسجين).'],
    ['Trimethoprim/Sulfamethoxazole', W, 'Sulfonamides add to the risk of methaemoglobinaemia.', 'السلفوناميدات تزيد خطر ميتهيموغلوبينية الدم.']
  ],
  ci:[{en:'Methaemoglobinaemia', ar:'ميتهيموغلوبينية الدم'}, 'g6pd'],
  ask:['allergy', 'g6pd', 'preg'] },

{ sci:'Articaine', ar:'أرتيكايين', atc:'N01BB08', cat:'ana.local', form:'injection',
  doses:['4% with adrenaline 1:100,000', '4% with adrenaline 1:200,000 (dental cartridges)'], brand:['Septanest', 'Ubistesin', 'Septocaine'],
  notes:{en:'The usual dental anaesthetic. The numbness lasts two to four hours — do not eat, chew the lip or cheek, or drink hot drinks until it wears off; watch children closely.',
         ar:'المخدّر المعتاد في طب الأسنان. يستمر الخدر ساعتين إلى أربع — لا تأكل ولا تعضّ الشفة أو الخد ولا تشرب ساخناً حتى يزول؛ وراقب الأطفال عن قرب.'},
  ix:[
    ['#bbNonSelective', S, 'The adrenaline in dental cartridges can cause a sharp rise in blood pressure with a slow pulse — use a plain cartridge or small volumes.', 'الأدرينالين في خراطيش الأسنان قد يسبّب ارتفاعاً حاداً في الضغط مع بطء النبض — تُستعمل خرطوشة دون أدرينالين أو كميات صغيرة.'],
    ['Amitriptyline', W, 'Tricyclics strengthen the effect of the adrenaline in dental cartridges on blood pressure.', 'ثلاثيات الحلقات تقوّي أثر أدرينالين خراطيش الأسنان على الضغط.']
  ],
  ci:[{en:'Allergy to amide local anaesthetics or sulfites', ar:'الحساسية من المخدّرات الموضعية الأميدية أو الكبريتيت'}],
  ask:['allergy', 'heart', 'bp'] },

{ sci:'Mepivacaine', ar:'ميبيفاكايين', atc:'N01BB03', cat:'ana.local', form:'injection',
  doses:['3% plain (dental)', '2% with adrenaline (dental)', '1% and 2% injection'], brand:['Scandonest', 'Carbocaine'],
  notes:{en:'A dental anaesthetic; the plain 3% suits people in whom adrenaline is best avoided. Take care not to bite the numb lip or cheek.',
         ar:'مخدّر للأسنان؛ و3% دون أدرينالين يناسب من يُفضّل تجنّب الأدرينالين لديهم. احذر عضّ الشفة أو الخد المخدّر.'},
  ix:[
    ['#bbNonSelective', S, 'The adrenaline in dental cartridges can cause a sharp rise in blood pressure with a slow pulse — use a plain cartridge or small volumes.', 'الأدرينالين في خراطيش الأسنان قد يسبّب ارتفاعاً حاداً في الضغط مع بطء النبض — تُستعمل خرطوشة دون أدرينالين أو كميات صغيرة.'],
    ['Amitriptyline', W, 'Tricyclics strengthen the effect of the adrenaline in dental cartridges on blood pressure.', 'ثلاثيات الحلقات تقوّي أثر أدرينالين خراطيش الأسنان على الضغط.']
  ],
  ask:['allergy', 'heart', 'bp'] },

{ sci:'Tetracaine', ar:'تتراكايين', atc:'N01BA03', cat:'ana.local', form:'gel',
  doses:['4% gel', '0.5% and 1% eye drops', '1% spinal injection'], brand:['Ametop', 'Minims Tetracaine'], aka:['Amethocaine'],
  notes:{en:'The gel numbs skin before needles in 30–45 minutes, under a dressing; the skin may go red. The eye drops numb the eye in the clinic only.',
         ar:'الهلام يخدّر الجلد قبل الإبر خلال 30–45 دقيقة تحت ضماد؛ وقد يحمرّ الجلد. قطرة العين تخدّر العين في العيادة فقط.'},
  ix:[
    ['#cholinesterase', W, 'Anticholinesterases slow the breakdown of tetracaine — more side effects.', 'مثبطات الكولين إستيراز تبطئ تفكّك التتراكايين — آثار جانبية أكثر.']
  ],
  ci:[{en:'Babies under one month', ar:'الرضّع دون الشهر'}],
  ask:['childAge', 'allergy'] },

{ sci:'Benzocaine', ar:'بنزوكايين', atc:'N01BA05', cat:'ana.local', form:'gel',
  doses:['20% oral gel', 'lozenges', 'throat spray', 'in haemorrhoid and ear products'], brand:['Orajel', 'Anbesol'],
  notes:{en:'Numbs mouth ulcers and sore throats. Not for teething babies or children under two — it can stop the blood carrying oxygen (a blue or grey tinge needs urgent help).',
         ar:'يخدّر قروح الفم والتهاب الحلق. لا يُستعمل للرضّع أثناء التسنين ولا للأطفال دون السنتين — قد يمنع الدم من حمل الأكسجين (الزرقة أو الشحوب الرمادي تستوجب مساعدة عاجلة).'},
  ix:[
    ['Dapsone', W, 'Adds to the risk of methaemoglobinaemia (blood that cannot carry oxygen).', 'يزيد خطر ميتهيموغلوبينية الدم (عجز الدم عن حمل الأكسجين).']
  ],
  ci:['under2', {en:'Methaemoglobinaemia', ar:'ميتهيموغلوبينية الدم'}],
  ask:['childAge', 'allergy', 'duration'] },

{ sci:'Hyaluronidase', ar:'هيالورونيداز', atc:'B06AA03', cat:'ana.local', form:'injection',
  doses:['1500 units vial'], brand:['Hyalase', 'Hylenex'],
  notes:{en:'Helps injected fluid or anaesthetic spread under the skin, and dissolves filler complications; given by clinicians only.',
         ar:'يساعد السائل أو المخدّر المحقون على الانتشار تحت الجلد، ويذيب مضاعفات الفيلر؛ يعطيه الأطباء فقط.'},
  ix:[
    ['#corticosteroid', W, 'High-dose steroids can weaken its effect.', 'الكورتيزون بجرعات عالية قد يُضعف أثره.']
  ],
  ci:[{en:'Injection into infected or cancerous areas', ar:'الحقن في مناطق ملتهبة بعدوى أو سرطانية'}],
  ask:['allergy', 'infection'] },

/* ---------- Muscle blockers and reversal ---------- */

{ sci:'Suxamethonium', ar:'سوكساميثونيوم', atc:'M03AB01', cat:'ana.nmb', form:'injection',
  doses:['50 mg/mL injection', '100 mg/2 mL'], brand:['Scoline', 'Anectine'], aka:['Succinylcholine'],
  notes:{en:'A very fast, short muscle relaxant for placing a breathing tube. Muscle aches the next day are common. In a rare inherited condition its effect lasts hours — tell the team if a relative had this.',
         ar:'مرخٍ عضلي سريع جداً وقصير لإدخال أنبوب التنفس. آلام العضلات في اليوم التالي شائعة. في حالة وراثية نادرة يستمر أثره ساعات — أخبر الفريق إن حدث ذلك لأحد أقاربك.'},
  ix:[
    ['Digoxin', S, 'Potassium released by suxamethonium can trigger dangerous rhythms with digoxin.', 'البوتاسيوم الذي يطلقه السوكساميثونيوم قد يثير اضطرابات نظم خطيرة مع الديجوكسين.'],
    ['#cholinesterase', S, 'Anticholinesterases prolong its effect — long paralysis.', 'مثبطات الكولين إستيراز تطيل أثره — شلل مديد.']
  ],
  ci:[MH, 'hyperK', {en:'Major burns, crush injury or paralysis more than 72 hours old', ar:'الحروق الكبيرة أو إصابات السحق أو الشلل بعد 72 ساعة'}, {en:'Pseudocholinesterase deficiency', ar:'نقص الكولين إستيراز الكاذب'}],
  ask:['anaesthetic', 'lastMeal', 'kidney'] },

{ sci:'Atracurium', ar:'أتراكوريوم', atc:'M03AC04', cat:'ana.nmb', form:'injection',
  doses:['10 mg/mL injection'], brand:['Tracrium'], aka:['Atracurium besilate'],
  notes:{en:'A muscle relaxant for surgery that breaks down on its own, useful in liver or kidney failure; it can cause flushing.',
         ar:'مرخٍ عضلي للجراحة يتفكّك ذاتياً، مفيد في فشل الكبد أو الكلى؛ وقد يسبّب احمرار الجلد.'},
  ix:[
    ['Gentamicin', S, 'Aminoglycoside antibiotics deepen and prolong the muscle block.', 'المضادات الأمينوغليكوزيدية تعمّق الإحصار العضلي وتطيله.'],
    ['Magnesium sulfate', S, 'Magnesium deepens and prolongs the muscle block.', 'المغنيسيوم يعمّق الإحصار العضلي ويطيله.']
  ],
  ask:['anaesthetic', 'asthma', 'myasthenia'] },

{ sci:'Cisatracurium', ar:'سيس أتراكوريوم', atc:'M03AC11', cat:'ana.nmb', form:'injection',
  doses:['2 mg/mL injection', '5 mg/mL'], brand:['Nimbex'],
  notes:{en:'A muscle relaxant for surgery and intensive care that breaks down on its own, with little histamine release.',
         ar:'مرخٍ عضلي للجراحة والعناية المركّزة يتفكّك ذاتياً، مع قليل من إطلاق الهيستامين.'},
  ix:[
    ['Gentamicin', S, 'Aminoglycoside antibiotics deepen and prolong the muscle block.', 'المضادات الأمينوغليكوزيدية تعمّق الإحصار العضلي وتطيله.'],
    ['Magnesium sulfate', S, 'Magnesium deepens and prolongs the muscle block.', 'المغنيسيوم يعمّق الإحصار العضلي ويطيله.']
  ],
  ask:['anaesthetic', 'myasthenia'] },

{ sci:'Rocuronium', ar:'روكورونيوم', atc:'M03AC09', cat:'ana.nmb', form:'injection',
  doses:['10 mg/mL injection'], brand:['Esmeron', 'Zemuron'], aka:['Rocuronium bromide'],
  notes:{en:'A muscle relaxant for surgery; its effect can be reversed quickly with sugammadex. A rare cause of allergic reactions during anaesthesia.',
         ar:'مرخٍ عضلي للجراحة؛ ويمكن عكس أثره بسرعة بالسوغاماديكس. سبب نادر لتفاعلات الحساسية أثناء التخدير.'},
  ix:[
    ['Gentamicin', S, 'Aminoglycoside antibiotics deepen and prolong the muscle block.', 'المضادات الأمينوغليكوزيدية تعمّق الإحصار العضلي وتطيله.'],
    ['Magnesium sulfate', S, 'Magnesium deepens and prolongs the muscle block.', 'المغنيسيوم يعمّق الإحصار العضلي ويطيله.']
  ],
  ask:['anaesthetic', 'allergy', 'myasthenia'] },

{ sci:'Vecuronium', ar:'فيكورونيوم', atc:'M03AC03', cat:'ana.nmb', form:'injection',
  doses:['10 mg vial'], brand:['Norcuron'], aka:['Vecuronium bromide'],
  notes:{en:'A muscle relaxant for surgery, with little effect on the heart; reversible with sugammadex.',
         ar:'مرخٍ عضلي للجراحة قليل التأثير على القلب؛ ويمكن عكس أثره بالسوغاماديكس.'},
  ix:[
    ['Gentamicin', S, 'Aminoglycoside antibiotics deepen and prolong the muscle block.', 'المضادات الأمينوغليكوزيدية تعمّق الإحصار العضلي وتطيله.'],
    ['Magnesium sulfate', S, 'Magnesium deepens and prolongs the muscle block.', 'المغنيسيوم يعمّق الإحصار العضلي ويطيله.']
  ],
  ask:['anaesthetic', 'myasthenia'] },

{ sci:'Pancuronium', ar:'بانكورونيوم', atc:'M03AC01', cat:'ana.nmb', form:'injection',
  doses:['2 mg/mL injection'], brand:['Pavulon'], aka:['Pancuronium bromide'],
  notes:{en:'A long-acting muscle relaxant for surgery and ventilated patients; it can speed up the heart.',
         ar:'مرخٍ عضلي طويل المفعول للجراحة والمرضى على جهاز التنفس؛ وقد يسرّع القلب.'},
  ix:[
    ['Gentamicin', S, 'Aminoglycoside antibiotics deepen and prolong the muscle block.', 'المضادات الأمينوغليكوزيدية تعمّق الإحصار العضلي وتطيله.'],
    ['Magnesium sulfate', S, 'Magnesium deepens and prolongs the muscle block.', 'المغنيسيوم يعمّق الإحصار العضلي ويطيله.']
  ],
  ci:['myasthenia'],
  ask:['anaesthetic', 'kidney', 'myasthenia'] },

{ sci:'Neostigmine', ar:'نيوستيغمين', atc:'N07AA01', cat:'ana.nmb', form:'injection',
  doses:['2.5 mg/mL injection', 'with glycopyrronium', '15 mg tablet'], brand:['Prostigmin'],
  tags:['cholinesterase'],
  notes:{en:'Reverses muscle relaxants at the end of surgery, given with glycopyrronium or atropine to protect the heart; tablets are an older treatment for myasthenia.',
         ar:'يعكس أثر المرخيات العضلية في نهاية الجراحة، ويُعطى مع الغليكوبيرونيوم أو الأتروبين لحماية القلب؛ والأقراص علاج أقدم للوهن العضلي.'},
  ci:['obstruction', 'asthmaUncontrolled', 'bradycardia'],
  ask:['asthma', 'slowPulse', 'myasthenia'] },

{ sci:'Sugammadex', ar:'سوغاماديكس', atc:'V03AB35', cat:'ana.nmb', form:'injection',
  doses:['100 mg/mL injection'], brand:['Bridion'],
  notes:{en:'Reverses rocuronium or vecuronium quickly at the end of surgery. It stops the contraceptive pill or implant working for a week — use condoms for seven days after.',
         ar:'يعكس أثر الروكورونيوم أو الفيكورونيوم بسرعة في نهاية الجراحة. يُبطل مفعول حبوب منع الحمل أو الغرسة لمدة أسبوع — استعملي الواقي سبعة أيام بعده.'},
  ix:[
    ['#hormonalContraceptive', S, 'Works like a missed pill — use condoms for seven days.', 'يعمل كحبة منسية — يُستعمل الواقي سبعة أيام.']
  ],
  ci:['renalSevere'],
  ask:['ocp', 'kidney', 'allergy'] }

];
