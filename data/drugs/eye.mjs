/* Eye: infections, inflammation, glaucoma, allergy and redness, dilating
   and numbing drops, dry eye, and retina injections.
   A molecule that also comes as tablets or injections has its eye form here
   as "<name> (eye)" — the same drops are often licensed for the ear, and
   ear products fall back to it (see data/drugs.mjs, "Routes").
   Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Eye infections ---------- */

{ sci:'Ciprofloxacin (eye)', ar:'سيبروفلوكساسين (للعين)', atc:'S01AE03', cat:'eye.antiinfective', form:'drops',
  doses:['0.3% eye drops', '0.3% eye ointment', '0.3% ear drops', 'with dexamethasone or hydrocortisone, ear drops'], brand:['Ciloxan', 'Ciprodex', 'Cipro HC'], aka:['Ciprofloxacin eye drops', 'Ciprofloxacin ear drops'],
  notes:{en:'Eye drops every two hours while awake for two days, then four times a day, for about a week. As ear drops, warm the bottle in the hand first and lie with the ear up for a few minutes. No contact lenses during treatment.',
         ar:'قطرة العين كل ساعتين أثناء اليقظة ليومين ثم أربع مرات يومياً، لنحو أسبوع. كقطرة أذن، دفّئ القارورة في اليد أولاً واستلقِ والأذن للأعلى بضع دقائق. لا عدسات لاصقة أثناء العلاج.'},
  ask:['contactLens', 'eyeRedFlags', 'earDrum'] },

{ sci:'Ofloxacin (eye)', ar:'أوفلوكساسين (للعين)', atc:'S01AE01', cat:'eye.antiinfective', form:'drops',
  doses:['0.3% eye drops', '0.3% eye ointment', '0.3% ear drops'], brand:['Exocin', 'Floxal', 'Tarivid Ophthalmic'], aka:['Ofloxacin eye drops', 'Ofloxacin ear drops'],
  notes:{en:'Eye drops four times a day for up to 10 days; ear drops twice a day, and they may be used when the eardrum is perforated. No contact lenses during treatment.',
         ar:'قطرة العين أربع مرات يومياً لمدة أقصاها 10 أيام؛ وقطرة الأذن مرتين يومياً، ويجوز استعمالها مع ثقب طبلة الأذن. لا عدسات لاصقة أثناء العلاج.'},
  ask:['contactLens', 'eyeRedFlags', 'childAge'] },

{ sci:'Levofloxacin (eye)', ar:'ليفوفلوكساسين (للعين)', atc:'S01AE05', cat:'eye.antiinfective', form:'drops',
  doses:['0.5% eye drops', '1.5% eye drops'], brand:['Oftaquix', 'Cravit Ophthalmic'], aka:['Levofloxacin eye drops'],
  notes:{en:'Every two hours on the first two days, then four times a day, for five days in all. No contact lenses during treatment.',
         ar:'كل ساعتين في أول يومين، ثم أربع مرات يومياً، لخمسة أيام إجمالاً. لا عدسات لاصقة أثناء العلاج.'},
  ask:['contactLens', 'eyeRedFlags'] },

{ sci:'Moxifloxacin (eye)', ar:'موكسيفلوكساسين (للعين)', atc:'S01AE07', cat:'eye.antiinfective', form:'drops',
  doses:['0.5% eye drops', 'with dexamethasone'], brand:['Vigamox', 'Moxeza', 'Vigadexa'], aka:['Moxifloxacin eye drops'],
  notes:{en:'Three times a day for a week; often used after cataract surgery with a steroid drop. Wait five minutes between different eye drops.',
         ar:'ثلاث مرات يومياً لمدة أسبوع؛ وتُستعمل كثيراً بعد عملية الماء الأبيض مع قطرة كورتيزون. انتظر خمس دقائق بين قطرات العين المختلفة.'},
  ask:['contactLens', 'eyeRedFlags'] },

{ sci:'Gatifloxacin', ar:'غاتيفلوكساسين', atc:'S01AE06', cat:'eye.antiinfective', form:'drops',
  doses:['0.3% eye drops', '0.5% eye drops', 'with prednisolone'], brand:['Zymar', 'Zymaxid'],
  notes:{en:'Eye drops for bacterial conjunctivitis, every two hours on the first day, then fewer. No contact lenses during treatment.',
         ar:'قطرة عين لالتهاب الملتحمة الجرثومي، كل ساعتين في اليوم الأول ثم أقل. لا عدسات لاصقة أثناء العلاج.'},
  ask:['contactLens', 'eyeRedFlags'] },

{ sci:'Tobramycin', ar:'توبرامايسين', atc:'S01AA12', cat:'eye.antiinfective', form:'drops',
  doses:['0.3% eye drops', '0.3% eye ointment', 'with dexamethasone (drops and ointment)', '80 mg/2 mL injection', '300 mg/5 mL nebuliser solution'], brand:['Tobrex', 'Tobradex', 'Tobi'],
  notes:{en:'Eye drops every four hours for about a week; the ointment at night. The combination with dexamethasone is not for red eyes without a diagnosis. The injection and nebuliser (cystic fibrosis) are hospital treatments with level checks, as they can harm the kidneys and hearing.',
         ar:'قطرة العين كل أربع ساعات لنحو أسبوع؛ والمرهم ليلاً. التركيبة مع الديكساميثازون ليست لاحمرار العين دون تشخيص. الحقنة والبخاخ (التليف الكيسي) علاجات مستشفى مع فحص المستوى، لأنها قد تؤذي الكلى والسمع.'},
  ask:['contactLens', 'eyeRedFlags', 'kidney'] },

{ sci:'Tetracycline (eye)', ar:'تتراسيكلين (للعين)', atc:'S01AA09', cat:'eye.antiinfective', form:'ointment',
  doses:['1% eye ointment'], aka:['Tetracycline eye ointment'],
  notes:{en:'Used in newborns to prevent eye infection and for trachoma. Pull the lower lid down and apply a thin line; vision blurs for a while.',
         ar:'يُستعمل لحديثي الولادة للوقاية من التهاب العين وللتراخوما. اسحب الجفن السفلي وضع خطاً رفيعاً؛ وتتشوّش الرؤية قليلاً.'},
  ask:['whoFor', 'eyeRedFlags'] },

{ sci:'Ganciclovir (eye)', ar:'غانسيكلوفير (للعين)', atc:'S01AD09', cat:'eye.antiinfective', form:'gel',
  doses:['0.15% eye gel'], brand:['Virgan', 'Zirgan'], aka:['Ganciclovir eye gel'],
  notes:{en:'For herpes infection of the cornea: five times a day until it heals, then three times a day for a week. Needs an eye doctor’s follow-up.',
         ar:'لالتهاب القرنية الهربسي: خمس مرات يومياً حتى الشفاء، ثم ثلاث مرات يومياً لمدة أسبوع. يحتاج متابعة طبيب العيون.'},
  ask:['contactLens', 'eyeRedFlags', 'preg'] },

{ sci:'Natamycin', ar:'ناتاميسين', atc:'S01AA10', cat:'eye.antiinfective', form:'drops',
  doses:['5% eye suspension'], brand:['Natacyn'], aka:['Pimaricin'],
  notes:{en:'For fungal infection of the cornea, under an eye specialist: shake well, one drop every one to two hours at first. Treatment lasts weeks.',
         ar:'لالتهاب القرنية الفطري، تحت إشراف اختصاصي العيون: رجّ جيداً، قطرة كل ساعة إلى ساعتين في البداية. يستمر العلاج أسابيع.'},
  ask:['contactLens', 'eyeRedFlags'] },

/* ---------- Eye inflammation ---------- */

{ sci:'Dexamethasone (eye)', ar:'ديكساميثازون (للعين)', atc:'S01BA01', cat:'eye.antiinflammatory', form:'drops',
  doses:['0.1% eye drops', 'with tobramycin', 'with neomycin and polymyxin B', 'with chloramphenicol', '0.7 mg intravitreal implant'], brand:['Maxidex', 'Maxitrol', 'Tobradex', 'Ozurdex'], aka:['Dexamethasone eye drops'],
  notes:{en:'Steroid eye drops: only on an eye doctor’s advice. On a herpes or fungal infection they can destroy the eye, and weeks of use can raise eye pressure and cause cataract. Do not stop suddenly after a long course.',
         ar:'قطرة عين كورتيزونية: بمشورة طبيب العيون فقط. على التهاب هربسي أو فطري قد تُتلف العين، والاستعمال لأسابيع قد يرفع ضغط العين ويسبّب الماء الأبيض. لا تُوقف فجأة بعد دورة طويلة.'},
  ci:[{en:'Herpes, fungal or untreated eye infection', ar:'التهاب العين الهربسي أو الفطري أو غير المعالج'}],
  ask:['eyeRedFlags', 'glaucoma', 'useLength'] },

{ sci:'Betamethasone (eye)', ar:'بيتاميثازون (للعين)', atc:'S01BA06', cat:'eye.antiinflammatory', form:'drops',
  doses:['0.1% eye, ear and nose drops', 'with neomycin'], brand:['Betnesol', 'Betnesol-N', 'Vistamethasone'], aka:['Betamethasone eye drops', 'Betamethasone ear drops'],
  notes:{en:'Steroid drops for the eye, ear or nose, for short courses on medical advice. Not on an infected eye; in the ear, not with a perforated eardrum when neomycin is included.',
         ar:'قطرات كورتيزونية للعين أو الأذن أو الأنف، لدورات قصيرة بمشورة طبية. لا توضع على عين ملتهبة بعدوى؛ وفي الأذن لا تُستعمل مع ثقب الطبلة إذا احتوت على النيومايسين.'},
  ci:[{en:'Herpes, fungal or untreated eye infection', ar:'التهاب العين الهربسي أو الفطري أو غير المعالج'}, 'eardrum'],
  ask:['eyeRedFlags', 'earDrum', 'glaucoma'] },

{ sci:'Prednisolone (eye)', ar:'بريدنيزولون (للعين)', atc:'S01BA04', cat:'eye.antiinflammatory', form:'drops',
  doses:['1% acetate eye drops', '0.5% sodium phosphate eye and ear drops', '0.12% eye drops'], brand:['Pred Forte', 'Predsol'], aka:['Prednisolone acetate eye drops', 'Prednisolone eye drops'],
  notes:{en:'Shake the suspension well. Used after eye surgery and for uveitis on a tapering schedule — follow it exactly. Eye pressure is checked on long courses.',
         ar:'رجّ المعلّق جيداً. يُستعمل بعد جراحة العين ولالتهاب العنبية بجدول تخفيض تدريجي — اتبعه بدقة. يُفحص ضغط العين في الدورات الطويلة.'},
  ci:[{en:'Herpes, fungal or untreated eye infection', ar:'التهاب العين الهربسي أو الفطري أو غير المعالج'}],
  ask:['eyeRedFlags', 'glaucoma', 'useLength'] },

{ sci:'Fluorometholone', ar:'فلوروميثولون', atc:'S01BA07', cat:'eye.antiinflammatory', form:'drops',
  doses:['0.1% eye drops', '0.25% eye drops', 'with tetrahydrozoline'], brand:['FML', 'Flarex', 'Efemoline'],
  notes:{en:'A milder steroid eye drop, less likely to raise eye pressure; still only on medical advice and for limited periods. Shake well.',
         ar:'قطرة كورتيزون أخف، أقل رفعاً لضغط العين؛ ومع ذلك بمشورة طبية فقط ولفترات محدودة. رجّ جيداً.'},
  ci:[{en:'Herpes, fungal or untreated eye infection', ar:'التهاب العين الهربسي أو الفطري أو غير المعالج'}],
  ask:['eyeRedFlags', 'glaucoma', 'contactLens'] },

{ sci:'Loteprednol', ar:'لوتيبريدنول', atc:'S01BA14', cat:'eye.antiinflammatory', form:'drops',
  doses:['0.5% eye suspension', '0.2% eye suspension', 'with tobramycin'], brand:['Lotemax', 'Alrex', 'Zylet'], aka:['Loteprednol etabonate'],
  notes:{en:'A steroid eye drop for allergy and after surgery, with less effect on eye pressure. Shake well; follow the doctor’s course.',
         ar:'قطرة كورتيزون للحساسية وبعد الجراحة، أقل تأثيراً على ضغط العين. رجّ جيداً؛ واتبع دورة الطبيب.'},
  ci:[{en:'Herpes, fungal or untreated eye infection', ar:'التهاب العين الهربسي أو الفطري أو غير المعالج'}],
  ask:['eyeRedFlags', 'glaucoma', 'contactLens'] },

{ sci:'Ketorolac (eye)', ar:'كيتورولاك (للعين)', atc:'S01BC05', cat:'eye.antiinflammatory', form:'drops',
  doses:['0.5% eye drops', '0.4% eye drops'], brand:['Acular', 'Acuvail'], aka:['Ketorolac eye drops'],
  notes:{en:'A non-steroid anti-inflammatory eye drop for pain and swelling after eye surgery and for itchy allergic eyes. It stings briefly.',
         ar:'قطرة عين مضادة للالتهاب غير كورتيزونية لألم وتورم ما بعد جراحة العين ولحكّة العين التحسسية. تلسع لحظياً.'},
  ci:['nsaidAsthma'],
  ask:['allergyNsaid', 'contactLens', 'asthma'] },

{ sci:'Diclofenac (eye)', ar:'ديكلوفيناك (للعين)', atc:'S01BC03', cat:'eye.antiinflammatory', form:'drops',
  doses:['0.1% eye drops'], brand:['Voltaren Ophtha', 'Uniclophen'], aka:['Diclofenac eye drops'],
  notes:{en:'Used around cataract surgery and for eye pain after injury or laser, as the eye doctor directs.',
         ar:'تُستعمل حول عملية الماء الأبيض ولألم العين بعد الإصابة أو الليزر، حسب توجيه طبيب العيون.'},
  ci:['nsaidAsthma'],
  ask:['allergyNsaid', 'contactLens', 'asthma'] },

{ sci:'Nepafenac', ar:'نيبافيناك', atc:'S01BC10', cat:'eye.antiinflammatory', form:'drops',
  doses:['0.1% eye suspension', '0.3% eye suspension'], brand:['Nevanac', 'Ilevro'],
  notes:{en:'For pain and swelling after cataract surgery: shake well, from the day before surgery for a few weeks.',
         ar:'لألم وتورم ما بعد عملية الماء الأبيض: رجّ جيداً، من اليوم السابق للعملية ولبضعة أسابيع.'},
  ci:['nsaidAsthma'],
  ask:['allergyNsaid', 'contactLens'] },

{ sci:'Bromfenac', ar:'برومفيناك', atc:'S01BC11', cat:'eye.antiinflammatory', form:'drops',
  doses:['0.09% eye drops'], brand:['Yellox', 'Prolensa'],
  notes:{en:'Twice a day for two weeks after cataract surgery.',
         ar:'مرتين يومياً لمدة أسبوعين بعد عملية الماء الأبيض.'},
  ci:['nsaidAsthma'],
  ask:['allergyNsaid', 'contactLens'] },

/* ---------- Glaucoma ---------- */

{ sci:'Timolol', ar:'تيمولول', atc:'S01ED01', cat:'eye.glaucoma', form:'drops',
  doses:['0.25% eye drops', '0.5% eye drops', '0.1% gel', 'with dorzolamide, brimonidine, latanoprost, travoprost or bimatoprost'], brand:['Timoptol', 'Cosopt', 'Combigan', 'Xalacom', 'DuoTrav', 'Ganfort'], aka:['Timolol maleate'],
  notes:{en:'A beta-blocker eye drop that lowers eye pressure. Enough reaches the body to slow the pulse and tighten the airways — press on the inner corner of the eye for a minute after each drop. Glaucoma drops are lifelong.',
         ar:'قطرة من حاصرات بيتا تخفض ضغط العين. يصل منها إلى الجسم ما يكفي لإبطاء النبض وتضييق المجاري التنفسية — اضغط على الزاوية الداخلية للعين دقيقة بعد كل قطرة. قطرات الزرق مدى الحياة.'},
  ix:[
    ['#nondhp', S, 'Slow pulse and heart block — even from eye drops.', 'بطء النبض وإحصار القلب — حتى من قطرة العين.'],
    ['#betaBlocker', W, 'Adds to the slowing of the pulse and to the pressure-lowering; two beta-blockers are rarely needed.', 'يزيد بطء النبض وانخفاض الضغط؛ ونادراً ما يُحتاج إلى حاصرَي بيتا.']
  ],
  ci:['asthma', 'bradycardia', 'heartBlock'],
  ask:['asthma', 'slowPulse', 'bpMeds'] },

{ sci:'Betaxolol', ar:'بيتاكسولول', atc:'S01ED02', cat:'eye.glaucoma', form:'drops',
  doses:['0.25% eye suspension', '0.5% eye drops'], brand:['Betoptic', 'Betoptic S'],
  notes:{en:'A beta-blocker eye drop gentler on the airways than timolol, though still used with care in asthma. Press on the inner corner of the eye after each drop.',
         ar:'قطرة من حاصرات بيتا ألطف على المجاري التنفسية من التيمولول، مع الحذر رغم ذلك في الربو. اضغط على الزاوية الداخلية للعين بعد كل قطرة.'},
  ix:[
    ['#nondhp', W, 'Slower pulse is possible.', 'بطء النبض ممكن.']
  ],
  ci:['bradycardia', 'heartBlock'],
  ask:['asthma', 'slowPulse', 'bpMeds'] },

{ sci:'Latanoprost', ar:'لاتانوبروست', atc:'S01EE01', cat:'eye.glaucoma', form:'drops',
  doses:['0.005% eye drops', 'with timolol', 'preservative-free'], brand:['Xalatan', 'Xalacom', 'Monoprost'],
  notes:{en:'One drop in the evening. It can slowly darken the coloured part of the eye (permanently) and lengthen the lashes. Keep unopened bottles in the fridge; remove contact lenses first and wait 15 minutes.',
         ar:'قطرة واحدة مساءً. قد يُغمّق لون القزحية ببطء (بشكل دائم) ويطيل الرموش. احفظ القوارير غير المفتوحة في الثلاجة؛ وانزع العدسات اللاصقة أولاً وانتظر 15 دقيقة.'},
  ask:['contactLens', 'eyeRedFlags', 'preg'] },

{ sci:'Travoprost', ar:'ترافوبروست', atc:'S01EE04', cat:'eye.glaucoma', form:'drops',
  doses:['0.004% eye drops', 'with timolol'], brand:['Travatan', 'DuoTrav'],
  notes:{en:'One drop in the evening; it can darken the iris and the eyelid skin and lengthen the lashes.',
         ar:'قطرة واحدة مساءً؛ قد يُغمّق القزحية وجلد الجفن ويطيل الرموش.'},
  ask:['contactLens', 'eyeRedFlags', 'preg'] },

{ sci:'Bimatoprost', ar:'بيماتوبروست', atc:'S01EE03', cat:'eye.glaucoma', form:'drops',
  doses:['0.01% eye drops', '0.03% eye drops', 'with timolol', '0.03% eyelash solution'], brand:['Lumigan', 'Ganfort', 'Latisse'],
  notes:{en:'One drop in the evening for glaucoma; red eyes are common at first. It can darken the iris and eyelid skin. As an eyelash product it is brushed on the upper lid margin only.',
         ar:'قطرة واحدة مساءً للزرق؛ احمرار العين شائع في البداية. قد يُغمّق القزحية وجلد الجفن. كمستحضر للرموش يُدهن على حافة الجفن العلوي فقط.'},
  ask:['contactLens', 'eyeRedFlags', 'preg'] },

{ sci:'Tafluprost', ar:'تافلوبروست', atc:'S01EE05', cat:'eye.glaucoma', form:'drops',
  doses:['0.0015% single-dose eye drops', 'with timolol'], brand:['Saflutan', 'Taptiqom'],
  notes:{en:'A preservative-free glaucoma drop, one in the evening; throw each single-dose unit away after use.',
         ar:'قطرة زرق خالية من المواد الحافظة، واحدة مساءً؛ تُرمى كل عبوة أحادية الجرعة بعد الاستعمال.'},
  ask:['contactLens', 'eyeRedFlags'] },

{ sci:'Dorzolamide', ar:'دورزولاميد', atc:'S01EC03', cat:'eye.glaucoma', form:'drops',
  doses:['2% eye drops', 'with timolol'], brand:['Trusopt', 'Cosopt'],
  notes:{en:'Three times a day alone, twice with timolol. A bitter taste after the drop is common.',
         ar:'ثلاث مرات يومياً وحده، ومرتين مع التيمولول. الطعم المرّ بعد القطرة شائع.'},
  ci:['renalSevere'],
  ask:['allergySulfa', 'kidney', 'contactLens'] },

{ sci:'Brinzolamide', ar:'برينزولاميد', atc:'S01EC04', cat:'eye.glaucoma', form:'drops',
  doses:['1% eye suspension', 'with timolol', 'with brimonidine'], brand:['Azopt', 'Azarga', 'Simbrinza'],
  notes:{en:'Shake well; twice a day. Blurred vision and a bitter taste just after the drop are common.',
         ar:'رجّ جيداً؛ مرتين يومياً. تشوّش الرؤية والطعم المرّ بعد القطرة مباشرة شائعان.'},
  ci:['renalSevere'],
  ask:['allergySulfa', 'kidney', 'contactLens'] },

{ sci:'Brimonidine', ar:'بريمونيدين', atc:'S01EA05', cat:'eye.glaucoma', form:'drops',
  doses:['0.2% eye drops', '0.15% eye drops', 'with timolol', 'with brinzolamide'], brand:['Alphagan', 'Alphagan P', 'Combigan'],
  notes:{en:'Twice to three times a day. It can cause tiredness and a dry mouth. Never for babies and small children — it can stop their breathing.',
         ar:'مرتين إلى ثلاث مرات يومياً. قد يسبّب التعب وجفاف الفم. لا يُستعمل أبداً للرضّع والأطفال الصغار — قد يوقف تنفسهم.'},
  ix:[
    ['#maoi', C, 'Contraindicated — risk of dangerous blood-pressure changes.', 'ممنوع — خطر تغيّرات خطيرة في ضغط الدم.'],
    ['#sedative', W, 'More drowsiness.', 'نعاس أكثر.']
  ],
  ci:['maoi', 'under2'],
  ask:['antidep', 'childAge', 'drive'] },

{ sci:'Pilocarpine', ar:'بيلوكاربين', atc:'S01EB01', cat:'eye.glaucoma', form:'drops',
  doses:['1% eye drops', '2% eye drops', '4% eye drops', '5 mg tablet (dry mouth)'], brand:['Isopto Carpine', 'Salagen'],
  notes:{en:'Makes the pupil small: vision is dim in poor light and a brow ache is common at first — take care driving at night. The tablets treat dry mouth after radiotherapy or in Sjögren’s syndrome.',
         ar:'يصغّر الحدقة: تضعف الرؤية في الإضاءة الخافتة وألم الجبين شائع في البداية — احذر القيادة ليلاً. الأقراص تعالج جفاف الفم بعد العلاج الإشعاعي أو في متلازمة شوغرن.'},
  ci:[{en:'Acute iritis', ar:'التهاب القزحية الحاد'}, 'asthmaUncontrolled'],
  ask:['drive', 'asthma', 'vision'] },

{ sci:'Acetazolamide', ar:'أسيتازولاميد', atc:'S01EC01', cat:'eye.glaucoma', form:'tablet',
  doses:['250 mg tablet', '250 mg SR capsule', '500 mg vial'], brand:['Diamox'],
  tags:['kLosing'],
  notes:{en:'Lowers eye pressure quickly, and is used for altitude sickness and raised pressure in the skull. Tingling fingers, a metallic taste and passing more urine are common; drink plenty to avoid kidney stones.',
         ar:'يخفض ضغط العين بسرعة، ويُستعمل لداء المرتفعات وارتفاع الضغط داخل الجمجمة. تنميل الأصابع والطعم المعدني وكثرة التبول شائعة؛ اشرب كثيراً لتجنّب حصى الكلى.'},
  ix:[
    ['Aspirin', S, 'High-dose aspirin: acidosis and toxicity.', 'الأسبرين بجرعة عالية: حماض وتسمّم.'],
    ['Lithium', W, 'Lithium levels change — monitor.', 'يتغيّر مستوى الليثيوم — يُراقب.']
  ],
  ci:['sulfaAllergy', 'hypoK', 'hypoNaK', 'hepSevere', 'renalSevere'],
  ask:['allergySulfa', 'kidney', 'stones'] },

/* ---------- Eye allergy and redness ---------- */

{ sci:'Sodium cromoglicate', ar:'كروموغليكات الصوديوم', atc:'S01GX01', cat:'eye.allergy', form:'drops',
  doses:['2% eye drops', '4% nasal spray', '100 mg oral ampoule (Nalcrom)'], brand:['Opticrom', 'Rynacrom', 'Nalcrom'], aka:['Cromoglicic acid', 'Sodium cromoglycate', 'Cromolyn'],
  notes:{en:'A preventer for allergic eyes and nose: four times a day, every day through the season — it takes a few days to work.',
         ar:'وقائي لحساسية العين والأنف: أربع مرات يومياً، كل يوم طوال الموسم — يحتاج بضعة أيام ليعمل.'},
  ask:['contactLens', 'whoFor'] },

{ sci:'Olopatadine', ar:'أولوباتادين', atc:'S01GX09', cat:'eye.allergy', form:'drops',
  doses:['0.1% eye drops', '0.2% eye drops', '0.7% eye drops'], brand:['Patanol', 'Pataday', 'Opatanol'],
  notes:{en:'For itchy allergic eyes, once or twice a day. Remove contact lenses first and wait 10–15 minutes before putting them back.',
         ar:'لحكّة العين التحسسية، مرة أو مرتين يومياً. انزع العدسات اللاصقة أولاً وانتظر 10–15 دقيقة قبل إعادتها.'},
  ask:['contactLens', 'childAge'] },

{ sci:'Ketotifen (eye)', ar:'كيتوتيفين (للعين)', atc:'S01GX08', cat:'eye.allergy', form:'drops',
  doses:['0.025% eye drops', 'single-dose units'], brand:['Zaditen Ophtha', 'Zaditor'], aka:['Ketotifen eye drops'],
  notes:{en:'Twice a day for allergic eyes. Remove contact lenses first and wait 15 minutes.',
         ar:'مرتين يومياً لحساسية العين. انزع العدسات اللاصقة أولاً وانتظر 15 دقيقة.'},
  ask:['contactLens', 'childAge'] },

{ sci:'Tetrahydrozoline', ar:'تتراهيدروزولين', atc:'S01GA02', cat:'eye.allergy', form:'drops',
  doses:['0.05% eye drops', 'with antazoline'], brand:['Visine', 'Spersallerg'], aka:['Tetryzoline'],
  notes:{en:'Takes the red out of tired or irritated eyes, for three days at most — longer use makes the redness come back worse. See a doctor for a painful red eye.',
         ar:'يزيل احمرار العين المتعبة أو المتهيّجة، لثلاثة أيام كحد أقصى — الاستعمال الأطول يعيد الاحمرار أسوأ. راجع الطبيب إذا كانت العين حمراء ومؤلمة.'},
  ci:['angleGlaucoma', 'under2'],
  ask:['eyeRedFlags', 'glaucoma', 'useLength'] },

/* ---------- Dilating, numbing and diagnostic drops ---------- */

{ sci:'Cyclopentolate', ar:'سيكلوبنتولات', atc:'S01FA04', cat:'eye.diagnostic', form:'drops',
  doses:['0.5% eye drops', '1% eye drops'], brand:['Mydrilate', 'Cyclogyl'],
  notes:{en:'Widens the pupil and relaxes focusing for an eye examination: vision is blurred and light-sensitive for up to a day — no driving. Children may become flushed or restless.',
         ar:'يوسّع الحدقة ويُرخي التركيز لفحص العين: تتشوّش الرؤية وتتحسّس للضوء حتى يوم كامل — لا قيادة. قد يحمرّ الأطفال أو يضطربون.'},
  ci:['angleGlaucoma'],
  ask:['drive', 'glaucoma', 'childAge'] },

{ sci:'Tropicamide', ar:'تروبيكاميد', atc:'S01FA06', cat:'eye.diagnostic', form:'drops',
  doses:['0.5% eye drops', '1% eye drops', 'with phenylephrine'], brand:['Mydriacyl', 'Mydrin-P'],
  notes:{en:'Widens the pupil for an eye examination; blurred vision and glare last four to six hours — no driving until it clears.',
         ar:'يوسّع الحدقة لفحص العين؛ وتستمر الرؤية المشوّشة والوهج أربع إلى ست ساعات — لا قيادة حتى تزول.'},
  ci:['angleGlaucoma'],
  ask:['drive', 'glaucoma'] },

{ sci:'Atropine (eye)', ar:'أتروبين (للعين)', atc:'S01FA01', cat:'eye.diagnostic', form:'drops',
  doses:['1% eye drops', '0.5% eye drops', '0.01% and 0.05% eye drops (myopia in children)', '1% eye ointment'], brand:['Isopto Atropine'], aka:['Atropine eye drops'],
  notes:{en:'Keeps the pupil wide for days — used for inflammation inside the eye, lazy eye, and in weak strengths to slow short sight in children. Vision blurs and light dazzles; press on the inner corner of the eye to limit absorption, and keep the bottle away from children.',
         ar:'يُبقي الحدقة واسعة لأيام — يُستعمل لالتهاب داخل العين والعين الكسولة، وبتراكيز ضعيفة لإبطاء قصر النظر عند الأطفال. تتشوّش الرؤية ويزعج الضوء؛ اضغط على الزاوية الداخلية للعين للحدّ من الامتصاص، وأبعد القارورة عن الأطفال.'},
  ci:['angleGlaucoma'],
  ask:['glaucoma', 'childAge', 'drive'] },

{ sci:'Homatropine', ar:'هوماتروبين', atc:'S01FA05', cat:'eye.diagnostic', form:'drops',
  doses:['2% eye drops'], aka:['Homatropine hydrobromide'],
  notes:{en:'Widens the pupil and eases pain in inflammation inside the eye; vision blurs for a day or two.',
         ar:'يوسّع الحدقة ويخفّف الألم في التهاب داخل العين؛ وتتشوّش الرؤية يوماً أو يومين.'},
  ci:['angleGlaucoma'],
  ask:['glaucoma', 'drive'] },

{ sci:'Fluorescein', ar:'فلوريسئين', atc:'S01JA01', cat:'eye.diagnostic', form:'drops',
  doses:['1% and 2% eye drops', 'impregnated strips', '10% injection (angiography)'], brand:['Fluorets', 'Fluorescite'], aka:['Fluorescein sodium'],
  notes:{en:'A yellow dye that shows scratches on the eye. After the injection, the skin looks yellow for hours and urine is bright yellow for a day or two.',
         ar:'صبغة صفراء تُظهر خدوش العين. بعد الحقنة يبدو الجلد أصفر لساعات والبول أصفر فاقعاً ليوم أو يومين.'},
  ask:['allergy', 'contactLens'] },

{ sci:'Proxymetacaine', ar:'بروكسي ميتاكايين', atc:'S01HA04', cat:'eye.diagnostic', form:'drops',
  doses:['0.5% eye drops'], brand:['Alcaine', 'Minims Proxymetacaine'], aka:['Proparacaine'],
  notes:{en:'Numbs the eye for examinations and minor procedures, in the clinic only. It is never given for home use — repeated numbing drops destroy the cornea. Do not rub the eye until feeling returns.',
         ar:'يخدّر العين للفحص والإجراءات البسيطة، في العيادة فقط. لا يُعطى أبداً للاستعمال المنزلي — تكرار قطرات التخدير يُتلف القرنية. لا تفرك العين حتى يعود الإحساس.'},
  ask:['allergy', 'contactLens'] },

{ sci:'Oxybuprocaine', ar:'أوكسي بوبروكايين', atc:'S01HA02', cat:'eye.diagnostic', form:'drops',
  doses:['0.4% eye drops'], brand:['Novesine', 'Benoxinate'], aka:['Benoxinate'],
  notes:{en:'Numbs the eye for examinations, in the clinic only — never for home use. Do not rub the eye until feeling returns.',
         ar:'يخدّر العين للفحص، في العيادة فقط — لا يُستعمل أبداً في البيت. لا تفرك العين حتى يعود الإحساس.'},
  ask:['allergy', 'contactLens'] },

/* ---------- Dry eye ---------- */

{ sci:'Hypromellose', ar:'هيبروميلوز', atc:'S01XA20', cat:'eye.lubricant', form:'drops',
  doses:['0.3% eye drops', '0.5% eye drops', 'with dextran'], brand:['Tears Naturale', 'Isopto Tears'], aka:['Hydroxypropyl methylcellulose', 'Artificial tears'],
  notes:{en:'Artificial tears as often as needed. With frequent use, or with contact lenses, a preservative-free product is better.',
         ar:'دموع اصطناعية كلما احتجت. مع الاستعمال المتكرر أو العدسات اللاصقة، المستحضر الخالي من المواد الحافظة أفضل.'},
  ask:['contactLens', 'eyeRedFlags'] },

{ sci:'Carmellose', ar:'كارميلوز', atc:'S01XA20', cat:'eye.lubricant', form:'drops',
  doses:['0.5% eye drops', '1% eye drops', 'single-dose units'], brand:['Refresh Tears', 'Celluvisc', 'Optive'], aka:['Carboxymethylcellulose', 'Carmellose sodium'],
  notes:{en:'Lubricating drops for dry eyes, as often as needed; the thicker 1% suits night-time.',
         ar:'قطرات مرطّبة لجفاف العين كلما احتجت؛ والتركيز الأسمك 1% يناسب الليل.'},
  ask:['contactLens', 'eyeRedFlags'] },

{ sci:'Hyaluronic acid (eye)', ar:'حمض الهيالورونيك (للعين)', atc:'S01XA20', cat:'eye.lubricant', form:'drops',
  doses:['0.1% eye drops', '0.15% eye drops', '0.2% and 0.3% eye drops'], brand:['Hylo', 'Vismed', 'Artelac'], aka:['Sodium hyaluronate eye drops', 'Hyaluronic acid eye drops'],
  notes:{en:'Long-lasting lubricating drops for dry eyes, safe with contact lenses when preservative-free.',
         ar:'قطرات مرطّبة طويلة الأثر لجفاف العين، آمنة مع العدسات اللاصقة إذا كانت خالية من المواد الحافظة.'},
  ask:['contactLens', 'eyeRedFlags'] },

{ sci:'Carbomer', ar:'كاربومير', atc:'S01XA20', cat:'eye.lubricant', form:'gel',
  doses:['0.2% eye gel', '0.25% eye gel'], brand:['Viscotears', 'Vidisic', 'Liposic'],
  notes:{en:'A thicker eye gel for dry eyes, three or four times a day and at bedtime; vision blurs briefly after it.',
         ar:'هلام أسمك لجفاف العين، ثلاث أو أربع مرات يومياً وقبل النوم؛ وتتشوّش الرؤية قليلاً بعده.'},
  ask:['contactLens', 'eyeRedFlags'] },

{ sci:'Ciclosporin (eye)', ar:'سيكلوسبورين (للعين)', atc:'S01XA18', cat:'eye.lubricant', form:'drops',
  doses:['0.05% eye emulsion', '0.1% eye emulsion'], brand:['Restasis', 'Ikervis'], aka:['Cyclosporine eye drops'],
  notes:{en:'For severe dry eye: once or twice a day for months — it takes weeks to help. Burning at first is common. Remove contact lenses first.',
         ar:'لجفاف العين الشديد: مرة أو مرتين يومياً لأشهر — يحتاج أسابيع ليفيد. الحرقة في البداية شائعة. انزع العدسات اللاصقة أولاً.'},
  ci:[{en:'Active eye infection', ar:'التهاب عين نشط'}],
  ask:['contactLens', 'eyeRedFlags', 'infection'] },

/* ---------- Retina injections ---------- */

{ sci:'Ranibizumab', ar:'رانيبيزوماب', atc:'S01LA04', cat:'eye.retina', form:'injection',
  doses:['10 mg/mL intravitreal injection'], brand:['Lucentis', 'Byooviz'],
  notes:{en:'Injected into the eye every month or two for wet macular degeneration and diabetic eye swelling. Seek help the same day for a painful red eye or worsening vision after an injection.',
         ar:'يُحقن في العين كل شهر أو شهرين للتنكّس البقعي الرطب ووذمة الشبكية السكرية. اطلب المساعدة في اليوم نفسه إذا احمرّت العين وتألّمت أو ساءت الرؤية بعد الحقنة.'},
  ci:[{en:'Eye or eyelid infection', ar:'التهاب العين أو الجفن'}],
  ask:['eyeRedFlags', 'preg', 'infection'] },

{ sci:'Aflibercept', ar:'أفليبرسبت', atc:'S01LA05', cat:'eye.retina', form:'injection',
  doses:['40 mg/mL intravitreal injection', '114.3 mg/mL (8 mg)', '25 mg/mL infusion (bowel cancer)'], brand:['Eylea', 'Zaltrap'],
  notes:{en:'Injected into the eye every one to four months for macular degeneration and diabetic eye disease; seek help the same day for a painful red eye or worsening vision. The infusion form is a cancer treatment.',
         ar:'يُحقن في العين كل شهر إلى أربعة أشهر للتنكّس البقعي وأمراض العين السكرية؛ اطلب المساعدة في اليوم نفسه إذا احمرّت العين وتألّمت أو ساءت الرؤية. شكل التسريب علاج للسرطان.'},
  ci:[{en:'Eye or eyelid infection', ar:'التهاب العين أو الجفن'}],
  ask:['eyeRedFlags', 'preg', 'infection'] },

{ sci:'Faricimab', ar:'فاريسيماب', atc:'S01LA09', cat:'eye.retina', form:'injection',
  doses:['120 mg/mL intravitreal injection'], brand:['Vabysmo'],
  notes:{en:'Injected into the eye, up to every four months once stable, for macular degeneration and diabetic eye swelling. Seek help the same day for a painful red eye or worsening vision.',
         ar:'يُحقن في العين، حتى كل أربعة أشهر بعد الاستقرار، للتنكّس البقعي ووذمة الشبكية السكرية. اطلب المساعدة في اليوم نفسه إذا احمرّت العين وتألّمت أو ساءت الرؤية.'},
  ci:[{en:'Eye or eyelid infection', ar:'التهاب العين أو الجفن'}],
  ask:['eyeRedFlags', 'preg', 'infection'] }

];
