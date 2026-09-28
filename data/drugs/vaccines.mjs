/* Vaccines and immunoglobulins — the Iraqi national schedule, travel and
   occupational vaccines, and the passive immunisations. Live vaccines carry
   the class `liveVaccine`, which is what makes an immunosuppressant in the
   same basket a critical finding. Antivenoms and antitoxins are with the
   antidotes. Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Vaccines ---------- */

{ sci:'BCG vaccine', ar:'لقاح السل (BCG)', atc:'J07AN01', cat:'imm.vaccine', form:'injection',
  doses:['intradermal, 0.05 mL infant', '81 mg intravesical (bladder cancer)'], brand:['BCG', 'OncoTICE'], aka:['BCG', 'Bacillus Calmette-Guerin'],
  tags:['liveVaccine'],
  notes:{en:'Given into the skin of the upper arm at birth; a small sore forms and heals into a scar over weeks — keep it clean and uncovered. Bladder instillations for cancer are a separate use.',
         ar:'يُعطى في جلد أعلى الذراع عند الولادة؛ تتكوّن قرحة صغيرة تلتئم بندبة خلال أسابيع — حافظ على نظافتها ودون تغطية. التقطير في المثانة للسرطان استعمال مختلف.'},
  ci:['immunocompromised', 'preg'],
  ask:['immune', 'childAge', 'feverToday'] },

{ sci:'Hepatitis B vaccine', ar:'لقاح التهاب الكبد B', atc:'J07BC01', cat:'imm.vaccine', form:'injection',
  doses:['10 microgram paediatric', '20 microgram adult'], brand:['Engerix-B', 'Euvax B'],
  notes:{en:'A course of three doses (0, 1 and 6 months; at birth in the national schedule). A sore arm is common.',
         ar:'دورة من ثلاث جرعات (0 و1 و6 أشهر؛ وعند الولادة في البرنامج الوطني). ألم الذراع شائع.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:['vaccineReaction', 'feverToday', 'childAge'] },

{ sci:'Poliomyelitis vaccine, inactivated', ar:'لقاح شلل الأطفال المعطّل (IPV)', atc:'J07BF03', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL'], brand:['IPOL', 'Imovax Polio'], aka:['IPV', 'Injectable polio vaccine'],
  notes:{en:'An injection in the national schedule, alongside the oral drops. Soreness at the site is common.',
         ar:'حقنة ضمن البرنامج الوطني، إلى جانب النقط الفموية. الألم مكان الحقن شائع.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:['vaccineReaction', 'feverToday', 'childAge'] },

{ sci:'Poliomyelitis vaccine, oral', ar:'لقاح شلل الأطفال الفموي (OPV)', atc:'J07BF02', cat:'imm.vaccine', form:'drops',
  doses:['2 drops'], aka:['OPV', 'Bivalent oral polio vaccine', 'bOPV'],
  tags:['liveVaccine'],
  notes:{en:'Two drops by mouth in the national schedule and campaigns. Repeat if the child spits it out straight away.',
         ar:'نقطتان بالفم ضمن البرنامج الوطني والحملات. تُعاد إن بصقها الطفل فوراً.'},
  ci:['immunocompromised'],
  ask:['immune', 'childAge'] },

{ sci:'Pentavalent vaccine', ar:'اللقاح الخماسي', atc:'J07CA11', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL (diphtheria, tetanus, pertussis, hepatitis B, Hib)'], aka:['DTP-HepB-Hib', 'Penta'],
  notes:{en:'Given at 2, 4 and 6 months in the national schedule. Fever and a sore, swollen thigh for a day or two are common — paracetamol by weight helps.',
         ar:'يُعطى بعمر 2 و4 و6 أشهر ضمن البرنامج الوطني. الحرارة وألم الفخذ وتورّمه ليوم أو يومين شائعة — والباراسيتامول حسب الوزن يفيد.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ci:[{en:'Encephalopathy within 7 days of a previous pertussis-containing dose', ar:'اعتلال دماغي خلال 7 أيام من جرعة سابقة تحوي لقاح السعال الديكي'}],
  ask:['vaccineReaction', 'feverToday', 'childAge'] },

{ sci:'Hexavalent vaccine', ar:'اللقاح السداسي', atc:'J07CA09', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL (diphtheria, tetanus, pertussis, polio, hepatitis B, Hib)'], brand:['Hexaxim', 'Infanrix hexa'],
  notes:{en:'Six vaccines in one injection in infancy. Fever and a sore leg for a day or two are common.',
         ar:'ستة لقاحات في حقنة واحدة في الرضاعة. الحرارة وألم الساق ليوم أو يومين شائعان.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ci:[{en:'Encephalopathy within 7 days of a previous pertussis-containing dose', ar:'اعتلال دماغي خلال 7 أيام من جرعة سابقة تحوي لقاح السعال الديكي'}],
  ask:['vaccineReaction', 'feverToday', 'childAge'] },

{ sci:'Diphtheria, tetanus and pertussis vaccine', ar:'اللقاح الثلاثي (الدفتريا والكزاز والسعال الديكي)', atc:'J07AJ52', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL DTP booster', 'Tdap adult'], brand:['Boostrix', 'Adacel', 'Infanrix'], aka:['DTP', 'DTaP', 'Tdap', 'Triple vaccine'],
  notes:{en:'Boosters in childhood, and Tdap in each pregnancy (from 20 weeks) to protect the newborn from whooping cough.',
         ar:'جرعات معزّزة في الطفولة، ولقاح Tdap في كل حمل (من الأسبوع 20) لحماية المولود من السعال الديكي.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:['vaccineReaction', 'feverToday', 'preg'] },

{ sci:'Diphtheria and tetanus vaccine', ar:'اللقاح الثنائي (الدفتريا والكزاز)', atc:'J07AM51', cat:'imm.vaccine', form:'injection',
  doses:['DT child', 'Td adult 0.5 mL'], aka:['Td', 'DT', 'Tetanus-diphtheria vaccine'],
  notes:{en:'Boosters for children and adults, and after dirty wounds if the last tetanus dose was long ago. A sore arm is common.',
         ar:'جرعات معزّزة للأطفال والبالغين، وبعد الجروح الملوثة إن مضى وقت طويل على آخر جرعة كزاز. ألم الذراع شائع.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:['vaccineReaction', 'feverToday', 'whoFor'] },

{ sci:'Tetanus toxoid', ar:'ذوفان الكزاز', atc:'J07AM01', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL'], aka:['TT', 'Tetanus vaccine'],
  notes:{en:'Given after wounds and in pregnancy to protect the newborn from tetanus. A sore arm is common.',
         ar:'يُعطى بعد الجروح وفي الحمل لحماية المولود من الكزاز. ألم الذراع شائع.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:['vaccineReaction', 'preg'] },

{ sci:'Haemophilus influenzae type b vaccine', ar:'لقاح المستدمية النزلية نوع b', atc:'J07AG01', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL'], aka:['Hib vaccine'],
  notes:{en:'Usually given within the pentavalent or hexavalent vaccine in infancy.',
         ar:'يُعطى عادة ضمن اللقاح الخماسي أو السداسي في الرضاعة.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:['vaccineReaction', 'childAge'] },

{ sci:'Rotavirus vaccine', ar:'لقاح الروتا', atc:'J07BH01', cat:'imm.vaccine', form:'drops',
  doses:['1.5 mL oral', '2 mL oral'], brand:['Rotarix', 'RotaTeq'],
  tags:['liveVaccine'],
  notes:{en:'Drops by mouth in early infancy, within strict age limits. Wash hands after nappy changes for a week.',
         ar:'نقط بالفم في بداية الرضاعة، ضمن حدود عمرية صارمة. اغسل يديك بعد تغيير الحفاض لمدة أسبوع.'},
  ci:['immunocompromised', {en:'Previous intussusception', ar:'انغلاف معوي سابق'}],
  ask:['childAge', 'immune', 'feverToday'] },

{ sci:'Measles, mumps and rubella vaccine', ar:'اللقاح الثلاثي الفيروسي (الحصبة والنكاف والحصبة الألمانية)', atc:'J07BD52', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL'], brand:['Priorix', 'M-M-R II'], aka:['MMR'],
  tags:['liveVaccine'],
  notes:{en:'At 12 months and 18 months (or as the schedule sets). A fever or mild rash 7–12 days later is common. Not in pregnancy — avoid pregnancy for a month after.',
         ar:'بعمر 12 و18 شهراً (أو حسب البرنامج). الحرارة أو الطفح الخفيف بعد 7–12 يوماً شائعان. لا يُعطى في الحمل — ويُتجنّب الحمل شهراً بعده.'},
  ci:['preg', 'immunocompromised'],
  ask:['immune', 'pregTest', 'feverToday'] },

{ sci:'Measles vaccine', ar:'لقاح الحصبة', atc:'J07BD01', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL'], aka:['Measles-rubella vaccine', 'MR'],
  tags:['liveVaccine'],
  notes:{en:'At nine months in the national schedule and in campaigns. Mild fever or rash a week later is common.',
         ar:'بعمر تسعة أشهر ضمن البرنامج الوطني وفي الحملات. الحرارة أو الطفح الخفيف بعد أسبوع شائعان.'},
  ci:['preg', 'immunocompromised'],
  ask:['immune', 'feverToday', 'childAge'] },

{ sci:'Varicella vaccine', ar:'لقاح جدري الماء', atc:'J07BK01', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL'], brand:['Varivax', 'Varilrix'], aka:['Chickenpox vaccine'],
  tags:['liveVaccine'],
  notes:{en:'Two doses. A few spots can appear; keep them covered around pregnant women and the immunosuppressed. No aspirin for six weeks after in children.',
         ar:'جرعتان. قد تظهر بضع حبات؛ غطّها عند الحوامل ومثبّطي المناعة. لا أسبرين للأطفال لمدة ستة أسابيع بعده.'},
  ci:['preg', 'immunocompromised'],
  ask:['immune', 'pregTest', 'under16'] },

{ sci:'Pneumococcal conjugate vaccine', ar:'لقاح المكورات الرئوية المقترن', atc:'J07AL02', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL (PCV13, PCV15, PCV20)'], brand:['Prevenar 13', 'Prevenar 20', 'Vaxneuvance'], aka:['PCV', 'Conjugated pneumococcal vaccine'],
  notes:{en:'In infancy in the national schedule, and for older adults and people with long-term illness. A sore arm and mild fever are common.',
         ar:'في الرضاعة ضمن البرنامج الوطني، ولكبار السن وأصحاب الأمراض المزمنة. ألم الذراع والحرارة الخفيفة شائعان.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:['vaccineReaction', 'feverToday', 'whoFor'] },

{ sci:'Pneumococcal polysaccharide vaccine', ar:'لقاح المكورات الرئوية عديد السكاريد', atc:'J07AL01', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL (PPSV23)'], brand:['Pneumovax 23'], aka:['PPSV23'],
  notes:{en:'For adults over 65 and people with long-term illness or no spleen.',
         ar:'للبالغين فوق 65 سنة وأصحاب الأمراض المزمنة أو من استُؤصل طحالهم.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:['vaccineReaction', 'feverToday'] },

{ sci:'Meningococcal vaccine', ar:'لقاح المكورات السحائية', atc:'J07AH08', cat:'imm.vaccine', form:'injection',
  doses:['ACWY conjugate 0.5 mL', 'B vaccine'], brand:['Menactra', 'Nimenrix', 'Menveo', 'Bexsero'], aka:['Conjugated meningococcal vaccine', 'MenACWY'],
  notes:{en:'Required for Hajj and Umrah (ACWY), and given to people without a spleen and some age groups.',
         ar:'مطلوب للحج والعمرة (ACWY)، ويُعطى لمن استُؤصل طحالهم ولبعض الفئات العمرية.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:['vaccineReaction', 'feverToday', 'whoFor'] },

{ sci:'Influenza vaccine', ar:'لقاح الإنفلونزا', atc:'J07BB02', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL (this season’s strains)'], brand:['Vaxigrip', 'Influvac', 'Fluarix'],
  notes:{en:'Every autumn, as the strains change yearly. Recommended in pregnancy, over 65, for long-term illness and for health workers. A sore arm and aches for a day are common.',
         ar:'كل خريف، لأن السلالات تتغيّر سنوياً. يُوصى به في الحمل وفوق 65 سنة ولأصحاب الأمراض المزمنة والعاملين الصحيين. ألم الذراع والأوجاع ليوم شائعة.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.'],
    ['Warfarin', W, 'The INR occasionally rises after flu vaccination.', 'يرتفع INR أحياناً بعد لقاح الإنفلونزا.']
  ],
  ask:['vaccineReaction', 'feverToday', 'whoFor'] },

{ sci:'Hepatitis A vaccine', ar:'لقاح التهاب الكبد A', atc:'J07BC02', cat:'imm.vaccine', form:'injection',
  doses:['720 ELISA units paediatric', '1440 ELISA units adult'], brand:['Havrix', 'Avaxim'],
  notes:{en:'Two doses six to twelve months apart give long protection.',
         ar:'جرعتان بفاصل ستة إلى اثني عشر شهراً تمنحان حماية طويلة.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:['vaccineReaction', 'feverToday', 'childAge'] },

{ sci:'Rabies vaccine', ar:'لقاح داء الكلب', atc:'J07BG01', cat:'imm.vaccine', form:'injection',
  doses:['1 mL vial'], brand:['Verorab', 'Rabipur'],
  notes:{en:'After a dog, cat or wild-animal bite: wash the wound with soap and water for 15 minutes at once, then complete every dose on the dates given — rabies is fatal once symptoms start.',
         ar:'بعد عضّة كلب أو قطة أو حيوان بري: اغسل الجرح بالماء والصابون 15 دقيقة فوراً، ثم أكمل كل الجرعات في مواعيدها — داء الكلب قاتل متى ظهرت أعراضه.'},
  ix:[
    ['#immunosuppressant', W, 'The vaccine may work less well during immunosuppressive treatment.', 'قد يعمل اللقاح بدرجة أقل أثناء العلاج المثبط للمناعة.']
  ],
  ask:[{en:'When were you bitten, and by what animal?', ar:'متى حدثت العضّة، ومن أي حيوان؟'}, 'immune'] },

{ sci:'Typhoid vaccine', ar:'لقاح التيفوئيد', atc:'J07AP03', cat:'imm.vaccine', form:'injection',
  doses:['25 microgram Vi polysaccharide', 'Vi conjugate'], brand:['Typhim Vi', 'Typbar-TCV'],
  notes:{en:'A single injection protects for about three years; food and water hygiene still matter.',
         ar:'حقنة واحدة تحمي نحو ثلاث سنوات؛ وتبقى نظافة الطعام والماء مهمة.'},
  ask:['vaccineReaction', 'feverToday'] },

{ sci:'Human papillomavirus vaccine', ar:'لقاح فيروس الورم الحليمي البشري', atc:'J07BM03', cat:'imm.vaccine', form:'injection',
  doses:['0.5 mL (9-valent)'], brand:['Gardasil 9', 'Cervarix'], aka:['HPV vaccine'],
  notes:{en:'Protects against cervical and other cancers; best before sexual activity starts. Fainting just after injection can happen — sit for 15 minutes.',
         ar:'يحمي من سرطان عنق الرحم وسرطانات أخرى؛ الأفضل قبل بدء النشاط الجنسي. قد يحدث إغماء بعد الحقن مباشرة — اجلس 15 دقيقة.'},
  ask:['vaccineReaction', 'preg'] },

{ sci:'COVID-19 vaccine', ar:'لقاح كوفيد-19', atc:'J07BN01', cat:'imm.vaccine', form:'injection',
  doses:['mRNA', 'inactivated', 'viral vector'], brand:['Comirnaty', 'Spikevax', 'Sinopharm'],
  notes:{en:'A sore arm, tiredness and fever for a day or two are common. Chest pain, palpitations or breathlessness in the week after needs a doctor.',
         ar:'ألم الذراع والتعب والحرارة ليوم أو يومين شائعة. ألم الصدر أو الخفقان أو ضيق النفس في الأسبوع التالي يحتاج طبيباً.'},
  ask:['vaccineReaction', 'feverToday'] },

/* ---------- Immunoglobulins and antisera ---------- */

{ sci:'Human normal immunoglobulin', ar:'الغلوبولين المناعي البشري الطبيعي', atc:'J06BA02', cat:'imm.immunoglobulin', form:'injection',
  doses:['5 g', '10 g intravenous', '16.5% subcutaneous'], brand:['Octagam', 'Privigen', 'Gammanorm'], aka:['IVIG', 'Immunoglobulin'],
  notes:{en:'Infusions for immune deficiency and some immune diseases. Headache and flu-like symptoms afterwards are common. It blunts live vaccines for months.',
         ar:'تسريب لنقص المناعة وبعض الأمراض المناعية. الصداع وأعراض تشبه الإنفلونزا بعده شائعة. يُضعف مفعول اللقاحات الحية لأشهر.'},
  ix:[
    ['#liveVaccine', W, 'Can stop a live vaccine working — live vaccines (measles, chickenpox) are delayed for three months.', 'قد يمنع اللقاح الحي من العمل — تُؤجّل اللقاحات الحية (الحصبة، الجدري المائي) ثلاثة أشهر.']
  ],
  ask:['kidney', 'clots', 'vaccine'] },

{ sci:'Anti-D immunoglobulin', ar:'الغلوبولين المناعي المضاد لـ D', atc:'J06BB01', cat:'imm.immunoglobulin', form:'injection',
  doses:['250 microgram', '300 microgram', '1500 microgram'], brand:['Rhophylac', 'WinRho'], aka:['Rho(D) immunoglobulin', 'Anti-D'],
  notes:{en:'For Rh-negative mothers after delivery, and after bleeding or procedures in pregnancy, within 72 hours — it protects future pregnancies.',
         ar:'للأمهات سلبيات عامل Rh بعد الولادة، وبعد النزف أو الإجراءات أثناء الحمل، خلال 72 ساعة — يحمي الحمل القادم.'},
  ix:[
    ['#liveVaccine', W, 'Can stop a live vaccine working — live vaccines (measles, chickenpox) are delayed for three months.', 'قد يمنع اللقاح الحي من العمل — تُؤجّل اللقاحات الحية (الحصبة، الجدري المائي) ثلاثة أشهر.']
  ],
  ask:['whoFor', {en:'When was the delivery, bleeding or procedure?', ar:'متى كانت الولادة أو النزف أو الإجراء؟'}] },

{ sci:'Hepatitis B immunoglobulin', ar:'الغلوبولين المناعي لالتهاب الكبد B', atc:'J06BB04', cat:'imm.immunoglobulin', form:'injection',
  doses:['200 IU', '500 IU'], brand:['Hepatect', 'HepaBig'], aka:['HBIG'],
  notes:{en:'Given to newborns of infected mothers (with the vaccine, within 12 hours) and after needle-stick exposure.',
         ar:'يُعطى لحديثي الولادة من أمهات مصابات (مع اللقاح خلال 12 ساعة) وبعد الوخز بالإبر.'},
  ix:[
    ['#liveVaccine', W, 'Can stop a live vaccine working — live vaccines (measles, chickenpox) are delayed for three months.', 'قد يمنع اللقاح الحي من العمل — تُؤجّل اللقاحات الحية (الحصبة، الجدري المائي) ثلاثة أشهر.']
  ],
  ask:['whoFor'] },

{ sci:'Tetanus immunoglobulin', ar:'الغلوبولين المناعي للكزاز', atc:'J06BB02', cat:'imm.immunoglobulin', form:'injection',
  doses:['250 IU'], brand:['Tetagam', 'Igantet'],
  notes:{en:'For dirty wounds in someone not fully vaccinated, together with a tetanus vaccine dose.',
         ar:'للجروح الملوثة عند غير المكتملين للتلقيح، مع جرعة من لقاح الكزاز.'},
  ix:[
    ['#liveVaccine', W, 'Can stop a live vaccine working — live vaccines (measles, chickenpox) are delayed for three months.', 'قد يمنع اللقاح الحي من العمل — تُؤجّل اللقاحات الحية (الحصبة، الجدري المائي) ثلاثة أشهر.']
  ],
  ask:['whoFor'] },

{ sci:'Rabies immunoglobulin', ar:'الغلوبولين المناعي لداء الكلب', atc:'J06BB05', cat:'imm.immunoglobulin', form:'injection',
  doses:['150 IU/mL'], brand:['Imogam', 'KamRAB'], aka:['HRIG', 'Human rabies immunoglobulin'],
  notes:{en:'Infiltrated into and around a serious bite wound on the first day, alongside the rabies vaccine course.',
         ar:'يُحقن في جرح العضّة الخطيرة وحوله في اليوم الأول، إلى جانب دورة لقاح داء الكلب.'},
  ix:[
    ['#liveVaccine', W, 'Can stop a live vaccine working — live vaccines (measles, chickenpox) are delayed for three months.', 'قد يمنع اللقاح الحي من العمل — تُؤجّل اللقاحات الحية (الحصبة، الجدري المائي) ثلاثة أشهر.'],
    ['Rabies vaccine', W, 'Given at a different site, and not over-dosed, or it weakens the vaccine.', 'يُعطى في موضع مختلف ودون زيادة الجرعة، وإلا أضعف اللقاح.']
  ],
  ask:['whoFor'] },

{ sci:'Cytomegalovirus immunoglobulin', ar:'الغلوبولين المناعي للفيروس المضخّم للخلايا', atc:'J06BB09', cat:'imm.immunoglobulin', form:'injection',
  doses:['100 U/mL'], brand:['Cytotect'],
  notes:{en:'Hospital infusions to prevent CMV after transplantation.',
         ar:'تسريب في المستشفى للوقاية من فيروس CMV بعد الزرع.'},
  ix:[
    ['#liveVaccine', W, 'Can stop a live vaccine working — live vaccines (measles, chickenpox) are delayed for three months.', 'قد يمنع اللقاح الحي من العمل — تُؤجّل اللقاحات الحية (الحصبة، الجدري المائي) ثلاثة أشهر.']
  ],
  ask:['kidney'] },

{ sci:'Palivizumab', ar:'باليفيزوماب', atc:'J06BD01', cat:'imm.immunoglobulin', form:'injection',
  doses:['50 mg', '100 mg vial'], brand:['Synagis'],
  notes:{en:'Monthly injections through the RSV season for premature babies and infants with heart or lung disease.',
         ar:'حقن شهرية خلال موسم الفيروس المخلوي التنفسي للخدّج والرضّع المصابين بأمراض القلب أو الرئة.'},
  ask:['childAge'] }

];
