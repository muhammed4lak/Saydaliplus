/* Ear, mouth and throat. Nose sprays live with allergy and colds
   (res.nasal); eye-and-ear drops with the eye (data/drugs/eye.mjs).
   Shape: see data/drugs.mjs. */
import { W, S, C } from './banks.mjs';

export default [

/* ---------- Ear ---------- */

{ sci:'Phenazone/Lidocaine', ar:'فينازون/ليدوكايين', atc:'S02DA30', cat:'ent.ear', form:'drops',
  doses:['4% / 1% ear drops'], brand:['Otipax', 'Otalgan'], aka:['Phenazone', 'Antipyrine'],
  notes:{en:'Eases the pain of an ear infection or barotrauma: four drops two or three times a day for up to 10 days. Only if the eardrum is intact — see a doctor if the ear discharges.',
         ar:'يخفّف ألم التهاب الأذن أو الرضح الضغطي: أربع قطرات مرتين أو ثلاثاً يومياً لمدة أقصاها 10 أيام. فقط إذا كانت طبلة الأذن سليمة — راجع الطبيب إذا خرج إفراز من الأذن.'},
  ci:['eardrum'],
  ask:['earDrum', 'childAge', 'duration'] },

{ sci:'Carbamide peroxide', ar:'بيروكسيد الكارباميد', atc:'S02DC', cat:'ent.ear', form:'drops',
  doses:['6.5% ear drops'], brand:['Otex', 'Debrox'], aka:['Urea hydrogen peroxide'],
  notes:{en:'Softens ear wax: five drops once or twice a day for three to four days, lying with the ear up. It fizzes; that is expected. Not if the ear hurts or discharges.',
         ar:'يليّن شمع الأذن: خمس قطرات مرة أو مرتين يومياً لثلاثة إلى أربعة أيام، مع الاستلقاء والأذن للأعلى. يُحدث فوراناً؛ وهذا متوقّع. لا يُستعمل إذا تألّمت الأذن أو خرج منها إفراز.'},
  ci:['eardrum'],
  ask:['earDrum', 'childAge'] },

{ sci:'Docusate', ar:'دوكوسات', atc:'A06AA02', cat:'ent.ear', form:'drops',
  doses:['0.5% ear drops', '100 mg capsule (laxative)'], brand:['Waxsol', 'Dulcoease'], aka:['Docusate sodium', 'Dioctyl sodium sulfosuccinate'],
  notes:{en:'As ear drops it softens wax, at bedtime for up to two nights. As a capsule it is a stool softener.',
         ar:'كقطرة أذن يليّن الشمع، قبل النوم لليلتين كحد أقصى. وككبسولة ملين للبراز.'},
  ci:['eardrum'],
  ask:['earDrum', 'whatFor'] },

/* ---------- Mouth and throat ---------- */

{ sci:'Miconazole', ar:'ميكونازول', atc:'A01AB09', cat:'ent.mouth', form:'gel',
  doses:['2% oral gel (20 mg/g)', '50 mg buccal tablet'], brand:['Daktarin oral gel', 'Loramyc'],
  tags:['inh3a4'],
  notes:{en:'For oral thrush: after meals, held in the mouth as long as possible, and for a week after it clears. In babies, smear small amounts on the inside of the cheeks — never a large blob, which can choke. Enough is absorbed to affect other medicines, warfarin above all.',
         ar:'لقلاع الفم: بعد الوجبات، ويُبقى في الفم أطول وقت ممكن، ولأسبوع بعد الشفاء. عند الرضّع تُدهن كميات صغيرة على باطن الخدين — لا تُوضع كتلة كبيرة أبداً لأنها قد تسبّب الاختناق. يُمتص منه ما يكفي للتأثير في أدوية أخرى، والوارفارين أولاً.'},
  ix:[
    ['Warfarin', C, 'INR rises sharply with bleeding — avoid, or check the INR very closely.', 'يرتفع INR بشدة مع نزف — يُتجنّب، أو يُفحص INR عن كثب شديد.'],
    ['Gliclazide', S, 'Low blood sugar.', 'هبوط سكر الدم.'],
    ['Glimepiride', S, 'Low blood sugar.', 'هبوط سكر الدم.'],
    ['Glibenclamide', S, 'Low blood sugar.', 'هبوط سكر الدم.'],
    ['Phenytoin', S, 'Raises phenytoin to toxic levels.', 'يرفع الفينيتوين إلى حدّ السميّة.']
  ],
  ci:['hepSevere', {en:'Babies under 4 months (choking)', ar:'الرضّع دون 4 أشهر (خطر الاختناق)'}],
  ask:['thinner', 'otherMeds', 'childAge'] },

{ sci:'Benzydamine', ar:'بنزيدامين', atc:'A01AD02', cat:'ent.mouth', form:'solution',
  doses:['0.15% mouthwash', '0.15% throat spray', '3 mg lozenge'], brand:['Difflam', 'Tantum Verde'],
  notes:{en:'For a painful mouth or throat: rinse or gargle 15 mL for 30 seconds and spit out, every 1½–3 hours. Stinging or numbness is common; dilute it if it stings too much.',
         ar:'لألم الفم أو الحلق: غرغر أو تمضمض بـ 15 مل لمدة 30 ثانية ثم ابصق، كل ساعة ونصف إلى ثلاث ساعات. اللسع أو التنميل شائع؛ خفّفه بالماء إذا لسع كثيراً.'},
  ask:['childAge', 'duration'] },

{ sci:'Hexetidine', ar:'هيكسيتيدين', atc:'A01AB12', cat:'ent.mouth', form:'solution',
  doses:['0.1% mouthwash', '0.2% spray'], brand:['Oraldene', 'Hexoral'],
  notes:{en:'An antiseptic mouthwash, used undiluted two or three times a day and spat out — not swallowed.',
         ar:'غسول فم مطهّر، يُستعمل دون تخفيف مرتين أو ثلاثاً يومياً ويُبصق — لا يُبلع.'},
  ask:['childAge', 'duration'] },

{ sci:'Choline salicylate', ar:'ساليسيلات الكولين', atc:'A01AD11', cat:'ent.mouth', form:'gel',
  doses:['8.7% oral gel', 'ear drops'], brand:['Bonjela', 'Audax'],
  notes:{en:'Eases mouth ulcers and denture sores. It is a salicylate, related to aspirin: not for anyone under 16 or allergic to aspirin, and not for teething babies.',
         ar:'يخفّف قروح الفم وتقرحات أطقم الأسنان. من الساليسيلات القريبة من الأسبرين: لا يُستعمل لمن هم دون 16 عاماً أو لديهم حساسية من الأسبرين، ولا للرضّع أثناء التسنين.'},
  ci:['under16', 'nsaidAsthma'],
  ask:['under16', 'allergyNsaid', 'duration'] },

{ sci:'Amylmetacresol/Dichlorobenzyl alcohol', ar:'أميل ميتاكريزول/كحول ثنائي كلورو البنزيل', atc:'R02AA20', cat:'ent.mouth', form:'tablet',
  doses:['0.6 mg / 1.2 mg lozenge', 'with lidocaine'], brand:['Strepsils'], aka:['Amylmetacresol', 'Dichlorobenzyl alcohol'],
  notes:{en:'Sore-throat lozenges: one every two to three hours, up to 12 a day, for no more than three days. Not for children under six. See a doctor for a high fever or trouble swallowing.',
         ar:'أقراص استحلاب لالتهاب الحلق: واحدة كل ساعتين إلى ثلاث، حتى 12 يومياً، لثلاثة أيام كحد أقصى. لا تُعطى للأطفال دون ست سنوات. راجع الطبيب عند الحرارة العالية أو صعوبة البلع.'},
  ci:['under6'],
  ask:['childAge', 'duration', 'diabetes'] },

{ sci:'Cetylpyridinium', ar:'سيتيل بيريدينيوم', atc:'R02AA06', cat:'ent.mouth', form:'tablet',
  doses:['1.4 mg lozenge', '0.05% and 0.07% mouthwash', 'with benzocaine'], brand:['Cepacol', 'Merocets'], aka:['Cetylpyridinium chloride'],
  notes:{en:'An antiseptic in lozenges and mouthwashes for a sore throat and gum care. The mouthwash may stain teeth slightly.',
         ar:'مطهّر في أقراص الاستحلاب وغسول الفم لالتهاب الحلق والعناية باللثة. قد يصبغ الغسول الأسنان قليلاً.'},
  ask:['childAge', 'duration'] }

];
