/**
 * The product catalogue — the layer beneath the molecule reference (W17).
 *
 * The clinical rules in data/drugs.mjs are keyed on MOLECULES and stay small.
 * What a till scans is a PRODUCT: a barcode, a name, a pack, a price, and the
 * molecules inside it. This file is that lookup.
 *
 * Every product carries a `mapping` — how far we know what is in it:
 *   verified  the ingredients are linked and a pharmacist has checked the link
 *   auto      linked automatically (by name or supplier data), not yet checked
 *   unmapped  known to exist, ingredients not linked yet — sellable, uncheckable
 *   nondrug   sold at the counter, not a medicine; nothing to check
 *
 * A molecule can also be linked but OUTSIDE the reference (`ref: false`):
 * caffeine, pseudoephedrine, triprolidine. Knowing a product contains one is
 * not the same as the Dispensing Helper being able to check it, and the
 * Helper says so rather than implying coverage it does not have. Anything not
 * marked `ref: false` must name a molecule that is in the reference — the
 * embed step and the unit tests both refuse a typo.
 *
 * FIXTURES. Barcodes are fictional — a plausible prefix, a running number and
 * a correct EAN-13 check digit — and correspond to no real product. Prices are
 * illustrative IQD. Brand names are used as a pharmacist would recognise them.
 */
const PRODUCTS = [
  {"barcode":"5000000001002","name":{"ar":"بنادول 500 ملغ","en":"Panadol 500 mg"},"form":"tablet","strength":"500 mg","pack":{"ar":"24 قرصاً","en":"24 tablets"},"price":2500,"mapping":"verified","molecules":[{"sci":"Paracetamol","strength":"500 mg"}]},
  {"barcode":"5000000001019","name":{"ar":"بنادول إكسترا","en":"Panadol Extra"},"form":"tablet","strength":"500/65 mg","pack":{"ar":"24 قرصاً","en":"24 tablets"},"price":3000,"mapping":"verified","molecules":[{"sci":"Paracetamol","strength":"500 mg"},{"sci":"Caffeine","strength":"65 mg","ref":false}]},
  {"barcode":"5000000001026","name":{"ar":"بنادول للزكام والإنفلونزا — نهاري","en":"Panadol Cold & Flu Day"},"form":"tablet","strength":"500/30 mg","pack":{"ar":"24 قرصاً","en":"24 tablets"},"price":3500,"mapping":"auto","molecules":[{"sci":"Paracetamol","strength":"500 mg"},{"sci":"Pseudoephedrine","strength":"30 mg","ref":false}]},
  {"barcode":"5000000001033","name":{"ar":"بروفين 400 ملغ","en":"Brufen 400 mg"},"form":"tablet","strength":"400 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":3000,"mapping":"verified","molecules":[{"sci":"Ibuprofen","strength":"400 mg"}]},
  {"barcode":"7600000001040","name":{"ar":"فولتارين 50 ملغ","en":"Voltaren 50 mg"},"form":"tablet","strength":"50 mg","pack":{"ar":"20 قرصاً","en":"20 tablets"},"price":4000,"mapping":"verified","molecules":[{"sci":"Diclofenac","strength":"50 mg"}]},
  {"barcode":"7600000001057","name":{"ar":"كتافلام 50 ملغ","en":"Cataflam 50 mg"},"form":"tablet","strength":"50 mg","pack":{"ar":"20 قرصاً","en":"20 tablets"},"price":4500,"mapping":"auto","molecules":[{"sci":"Diclofenac","strength":"50 mg"}]},
  {"barcode":"4000000001065","name":{"ar":"أسبرين بروتكت 100 ملغ","en":"Aspirin Protect 100 mg"},"form":"tablet","strength":"100 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":3500,"mapping":"verified","molecules":[{"sci":"Aspirin","strength":"100 mg"}]},
  {"barcode":"5000000001071","name":{"ar":"أوغمنتين 1 غ","en":"Augmentin 1 g"},"form":"tablet","strength":"875/125 mg","pack":{"ar":"14 قرصاً","en":"14 tablets"},"price":12000,"mapping":"verified","molecules":[{"sci":"Amoxicillin/Clavulanic acid","strength":"875/125 mg"}]},
  {"barcode":"6210000001080","name":{"ar":"ساماموكس 500 ملغ","en":"Samamox 500 mg"},"form":"capsule","strength":"500 mg","pack":{"ar":"16 كبسولة","en":"16 capsules"},"price":2500,"mapping":"verified","molecules":[{"sci":"Amoxicillin","strength":"500 mg"}]},
  {"barcode":"3000000001097","name":{"ar":"زيثروماكس 500 ملغ","en":"Zithromax 500 mg"},"form":"tablet","strength":"500 mg","pack":{"ar":"3 أقراص","en":"3 tablets"},"price":9000,"mapping":"verified","molecules":[{"sci":"Azithromycin","strength":"500 mg"}]},
  {"barcode":"4000000001102","name":{"ar":"سيبروباي 500 ملغ","en":"Ciprobay 500 mg"},"form":"tablet","strength":"500 mg","pack":{"ar":"10 أقراص","en":"10 tablets"},"price":7000,"mapping":"verified","molecules":[{"sci":"Ciprofloxacin","strength":"500 mg"}]},
  {"barcode":"3000000001110","name":{"ar":"فلاجيل 500 ملغ","en":"Flagyl 500 mg"},"form":"tablet","strength":"500 mg","pack":{"ar":"20 قرصاً","en":"20 tablets"},"price":3000,"mapping":"verified","molecules":[{"sci":"Metronidazole","strength":"500 mg"}]},
  {"barcode":"8900000001125","name":{"ar":"سيفيكسيم 400 ملغ","en":"Cefixime 400 mg"},"form":"capsule","strength":"400 mg","pack":{"ar":"5 كبسولات","en":"5 capsules"},"price":8000,"mapping":"auto","molecules":[{"sci":"Cefixime","strength":"400 mg"}]},
  {"barcode":"3000000001134","name":{"ar":"ديفلوكان 150 ملغ","en":"Diflucan 150 mg"},"form":"capsule","strength":"150 mg","pack":{"ar":"كبسولة واحدة","en":"1 capsule"},"price":4000,"mapping":"verified","molecules":[{"sci":"Fluconazole","strength":"150 mg"}]},
  {"barcode":"4000000001140","name":{"ar":"كانستين كريم 1%","en":"Canesten 1% cream"},"form":"cream","strength":"1%","pack":{"ar":"أنبوب 20 غ","en":"20 g tube"},"price":3500,"mapping":"verified","molecules":[{"sci":"Clotrimazole","strength":"1%"}]},
  {"barcode":"3000000001158","name":{"ar":"نورفاسك 5 ملغ","en":"Norvasc 5 mg"},"form":"tablet","strength":"5 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":9000,"mapping":"verified","molecules":[{"sci":"Amlodipine","strength":"5 mg"}]},
  {"barcode":"4000000001164","name":{"ar":"كونكور 5 ملغ","en":"Concor 5 mg"},"form":"tablet","strength":"5 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":8000,"mapping":"verified","molecules":[{"sci":"Bisoprolol","strength":"5 mg"}]},
  {"barcode":"5000000001170","name":{"ar":"كوزار 50 ملغ","en":"Cozaar 50 mg"},"form":"tablet","strength":"50 mg","pack":{"ar":"28 قرصاً","en":"28 tablets"},"price":10000,"mapping":"verified","molecules":[{"sci":"Losartan","strength":"50 mg"}]},
  {"barcode":"7600000001187","name":{"ar":"كو-ديوفان 160/12.5 ملغ","en":"Co-Diovan 160/12.5 mg"},"form":"tablet","strength":"160/12.5 mg","pack":{"ar":"28 قرصاً","en":"28 tablets"},"price":16000,"mapping":"verified","molecules":[{"sci":"Valsartan","strength":"160 mg"},{"sci":"Hydrochlorothiazide","strength":"12.5 mg"}]},
  {"barcode":"5000000001194","name":{"ar":"ليبيتور 20 ملغ","en":"Lipitor 20 mg"},"form":"tablet","strength":"20 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":15000,"mapping":"verified","molecules":[{"sci":"Atorvastatin","strength":"20 mg"}]},
  {"barcode":"5000000001200","name":{"ar":"كريستور 10 ملغ","en":"Crestor 10 mg"},"form":"tablet","strength":"10 mg","pack":{"ar":"28 قرصاً","en":"28 tablets"},"price":18000,"mapping":"verified","molecules":[{"sci":"Rosuvastatin","strength":"10 mg"}]},
  {"barcode":"3000000001219","name":{"ar":"بلافيكس 75 ملغ","en":"Plavix 75 mg"},"form":"tablet","strength":"75 mg","pack":{"ar":"28 قرصاً","en":"28 tablets"},"price":20000,"mapping":"verified","molecules":[{"sci":"Clopidogrel","strength":"75 mg"}]},
  {"barcode":"5000000001224","name":{"ar":"ماريفان 5 ملغ","en":"Marevan 5 mg"},"form":"tablet","strength":"5 mg","pack":{"ar":"100 قرص","en":"100 tablets"},"price":6000,"mapping":"verified","molecules":[{"sci":"Warfarin","strength":"5 mg"}]},
  {"barcode":"4000000001232","name":{"ar":"زاريلتو 20 ملغ","en":"Xarelto 20 mg"},"form":"tablet","strength":"20 mg","pack":{"ar":"28 قرصاً","en":"28 tablets"},"price":45000,"mapping":"verified","molecules":[{"sci":"Rivaroxaban","strength":"20 mg"}]},
  {"barcode":"5000000001248","name":{"ar":"لانوكسين 0.25 ملغ","en":"Lanoxin 0.25 mg"},"form":"tablet","strength":"0.25 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":4000,"mapping":"verified","molecules":[{"sci":"Digoxin","strength":"0.25 mg"}]},
  {"barcode":"3000000001257","name":{"ar":"غلوكوفاج 850 ملغ","en":"Glucophage 850 mg"},"form":"tablet","strength":"850 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":3500,"mapping":"verified","molecules":[{"sci":"Metformin","strength":"850 mg"}]},
  {"barcode":"3000000001264","name":{"ar":"دياميكرون MR 60 ملغ","en":"Diamicron MR 60 mg"},"form":"tablet","strength":"60 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":9000,"mapping":"verified","molecules":[{"sci":"Gliclazide","strength":"60 mg"}]},
  {"barcode":"4000000001270","name":{"ar":"أماريل 2 ملغ","en":"Amaryl 2 mg"},"form":"tablet","strength":"2 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":8000,"mapping":"verified","molecules":[{"sci":"Glimepiride","strength":"2 mg"}]},
  {"barcode":"5000000001286","name":{"ar":"جانوميت 50/1000 ملغ","en":"Janumet 50/1000 mg"},"form":"tablet","strength":"50/1000 mg","pack":{"ar":"56 قرصاً","en":"56 tablets"},"price":35000,"mapping":"auto","molecules":[{"sci":"Sitagliptin","strength":"50 mg"},{"sci":"Metformin","strength":"1000 mg"}]},
  {"barcode":"4000000001294","name":{"ar":"جارديانس 10 ملغ","en":"Jardiance 10 mg"},"form":"tablet","strength":"10 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":38000,"mapping":"verified","molecules":[{"sci":"Empagliflozin","strength":"10 mg"}]},
  {"barcode":"3000000001301","name":{"ar":"لانتوس سولوستار","en":"Lantus SoloStar"},"form":"injection","strength":"100 units/mL","pack":{"ar":"5 أقلام × 3 مل","en":"5 pens × 3 mL"},"price":55000,"mapping":"verified","molecules":[{"sci":"Insulin glargine","strength":"100 units/mL"}]},
  {"barcode":"5000000001316","name":{"ar":"نيكسيوم 40 ملغ","en":"Nexium 40 mg"},"form":"capsule","strength":"40 mg","pack":{"ar":"14 كبسولة","en":"14 capsules"},"price":12000,"mapping":"verified","molecules":[{"sci":"Esomeprazole","strength":"40 mg"}]},
  {"barcode":"6210000001325","name":{"ar":"أوميبرازول 20 ملغ (سامراء)","en":"Omeprazole 20 mg (SDI)"},"form":"capsule","strength":"20 mg","pack":{"ar":"14 كبسولة","en":"14 capsules"},"price":2500,"mapping":"verified","molecules":[{"sci":"Omeprazole","strength":"20 mg"}]},
  {"barcode":"7600000001330","name":{"ar":"موتيليوم 10 ملغ","en":"Motilium 10 mg"},"form":"tablet","strength":"10 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":4500,"mapping":"verified","molecules":[{"sci":"Domperidone","strength":"10 mg"}]},
  {"barcode":"7600000001347","name":{"ar":"إيموديوم 2 ملغ","en":"Imodium 2 mg"},"form":"capsule","strength":"2 mg","pack":{"ar":"6 كبسولات","en":"6 capsules"},"price":3000,"mapping":"verified","molecules":[{"sci":"Loperamide","strength":"2 mg"}]},
  {"barcode":"4000000001355","name":{"ar":"دوفالاك","en":"Duphalac"},"form":"syrup","strength":"3.3 g/5 mL","pack":{"ar":"قنينة 200 مل","en":"200 mL bottle"},"price":6000,"mapping":"verified","molecules":[{"sci":"Lactulose","strength":"3.3 g/5 mL"}]},
  {"barcode":"5000000001361","name":{"ar":"فنتولين إيفوهيلر","en":"Ventolin Evohaler"},"form":"inhaler","strength":"100 mcg","pack":{"ar":"200 بخة","en":"200 doses"},"price":5000,"mapping":"verified","molecules":[{"sci":"Salbutamol","strength":"100 mcg"}]},
  {"barcode":"5000000001378","name":{"ar":"سيمبيكورت 160/4.5","en":"Symbicort 160/4.5"},"form":"inhaler","strength":"160/4.5 mcg","pack":{"ar":"120 بخة","en":"120 doses"},"price":30000,"mapping":"verified","molecules":[{"sci":"Budesonide/Formoterol","strength":"160/4.5 mcg"}]},
  {"barcode":"5000000001385","name":{"ar":"سينغولير 10 ملغ","en":"Singulair 10 mg"},"form":"tablet","strength":"10 mg","pack":{"ar":"28 قرصاً","en":"28 tablets"},"price":20000,"mapping":"auto","molecules":[{"sci":"Montelukast","strength":"10 mg"}]},
  {"barcode":"7600000001392","name":{"ar":"زيرتك 10 ملغ","en":"Zyrtec 10 mg"},"form":"tablet","strength":"10 mg","pack":{"ar":"20 قرصاً","en":"20 tablets"},"price":4000,"mapping":"verified","molecules":[{"sci":"Cetirizine","strength":"10 mg"}]},
  {"barcode":"4000000001409","name":{"ar":"كلاريتين 10 ملغ","en":"Claritine 10 mg"},"form":"tablet","strength":"10 mg","pack":{"ar":"10 أقراص","en":"10 tablets"},"price":3500,"mapping":"verified","molecules":[{"sci":"Loratadine","strength":"10 mg"}]},
  {"barcode":"7600000001415","name":{"ar":"أوتريفين بخاخ أنف 0.1%","en":"Otrivin 0.1% nasal spray"},"form":"spray","strength":"0.1%","pack":{"ar":"10 مل","en":"10 mL"},"price":3000,"mapping":"verified","molecules":[{"sci":"Xylometazoline","strength":"0.1%"}]},
  {"barcode":"5000000001422","name":{"ar":"أكتيفيد شراب","en":"Actifed syrup"},"form":"syrup","strength":"1.25/30 mg per 5 mL","pack":{"ar":"قنينة 100 مل","en":"100 mL bottle"},"price":4000,"mapping":"verified","molecules":[{"sci":"Triprolidine","strength":"1.25 mg/5 mL","ref":false},{"sci":"Pseudoephedrine","strength":"30 mg/5 mL","ref":false}]},
  {"barcode":"7600000001439","name":{"ar":"تيغريتول 200 ملغ","en":"Tegretol 200 mg"},"form":"tablet","strength":"200 mg","pack":{"ar":"50 قرصاً","en":"50 tablets"},"price":7000,"mapping":"verified","molecules":[{"sci":"Carbamazepine","strength":"200 mg"}]},
  {"barcode":"3000000001448","name":{"ar":"ليريكا 75 ملغ","en":"Lyrica 75 mg"},"form":"capsule","strength":"75 mg","pack":{"ar":"14 كبسولة","en":"14 capsules"},"price":12000,"mapping":"verified","molecules":[{"sci":"Pregabalin","strength":"75 mg"}]},
  {"barcode":"3000000001455","name":{"ar":"زاناكس 0.5 ملغ","en":"Xanax 0.5 mg"},"form":"tablet","strength":"0.5 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":6000,"mapping":"verified","molecules":[{"sci":"Alprazolam","strength":"0.5 mg"}]},
  {"barcode":"4000000001461","name":{"ar":"يوثيروكس 50 مكغ","en":"Euthyrox 50 mcg"},"form":"tablet","strength":"50 mcg","pack":{"ar":"50 قرصاً","en":"50 tablets"},"price":4000,"mapping":"verified","molecules":[{"sci":"Levothyroxine","strength":"50 mcg"}]},
  {"barcode":"6210000001479","name":{"ar":"بريدنيزولون 5 ملغ (سامراء)","en":"Prednisolone 5 mg (SDI)"},"form":"tablet","strength":"5 mg","pack":{"ar":"20 قرصاً","en":"20 tablets"},"price":1500,"mapping":"auto","molecules":[{"sci":"Prednisolone","strength":"5 mg"}]},
  {"barcode":"8900000001484","name":{"ar":"حمض الفوليك 5 ملغ","en":"Folic acid 5 mg"},"form":"tablet","strength":"5 mg","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":1000,"mapping":"auto","molecules":[{"sci":"Folic acid","strength":"5 mg"}]},
  {"barcode":"6250000001499","name":{"ar":"فيتامين د3 50,000 وحدة","en":"Vitamin D3 50,000 IU"},"form":"capsule","strength":"50,000 IU","pack":{"ar":"4 كبسولات","en":"4 capsules"},"price":6000,"mapping":"auto","molecules":[{"sci":"Cholecalciferol","strength":"50,000 IU"}]},
  {"barcode":"6220000001508","name":{"ar":"أملاح الإماهة الفموية","en":"ORS sachet"},"form":"sachet","strength":"20.5 g","pack":{"ar":"كيس واحد","en":"1 sachet"},"price":500,"mapping":"verified","molecules":[{"sci":"Oral rehydration salts","strength":"20.5 g"}]},
  {"barcode":"4000000001515","name":{"ar":"نيوروبيون","en":"Neurobion"},"form":"tablet","strength":"","pack":{"ar":"20 قرصاً","en":"20 tablets"},"price":5000,"mapping":"unmapped","molecules":[]},
  {"barcode":"5000000001521","name":{"ar":"سولبادين","en":"Solpadeine"},"form":"tablet","strength":"","pack":{"ar":"24 قرصاً","en":"24 tablets"},"price":4000,"mapping":"unmapped","molecules":[]},
  {"barcode":"5000000001538","name":{"ar":"غافيسكون شراب","en":"Gaviscon liquid"},"form":"syrup","strength":"","pack":{"ar":"قنينة 200 مل","en":"200 mL bottle"},"price":7000,"mapping":"unmapped","molecules":[]},
  {"barcode":"8690000001545","name":{"ar":"ميبيفرين 135 ملغ","en":"Mebeverine 135 mg"},"form":"tablet","strength":"","pack":{"ar":"30 قرصاً","en":"30 tablets"},"price":5000,"mapping":"unmapped","molecules":[]},
  {"barcode":"8690000001552","name":{"ar":"محرار رقمي","en":"Digital thermometer"},"form":null,"strength":"","pack":{"ar":"قطعة واحدة","en":"1 unit"},"price":6000,"mapping":"nondrug","molecules":[]},
  {"barcode":"4000000001560","name":{"ar":"حليب أبتاميل 1","en":"Aptamil 1 infant formula"},"form":null,"strength":"","pack":{"ar":"علبة 400 غ","en":"400 g tin"},"price":18000,"mapping":"nondrug","molecules":[]},
  {"barcode":"8690000001576","name":{"ar":"كمامات طبية","en":"Surgical face masks"},"form":null,"strength":"","pack":{"ar":"علبة 50","en":"Box of 50"},"price":3000,"mapping":"nondrug","molecules":[]},
  {"barcode":"3000000001585","name":{"ar":"واقي شمس SPF 50","en":"Sunscreen SPF 50"},"form":null,"strength":"","pack":{"ar":"50 مل","en":"50 mL"},"price":15000,"mapping":"nondrug","molecules":[]}
];

export const MAPPING_STATES = ['verified', 'auto', 'unmapped', 'nondrug'];

export default PRODUCTS;
