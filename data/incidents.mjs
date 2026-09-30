/* Incidents inside a pharmacy (v0.0019): what the prototypes start with.

   The app embeds these in full — they are the pharmacy's own record. The CRM
   gets only how many there are at each pharmacy (decided 30 Sep 2026): the
   build writes the counts into the CRM and nothing else, so no text, kind,
   name or date from here can reach it. */

export const INCIDENT_KINDS = ['conduct', 'cash', 'stock', 'dispensing', 'other'];

export const INCIDENT_SEED = [
  { id:'IN001', pharmacy:'P1', by:'hassan@example.com', about:'omar@example.com', kind:'stock', daysAgo:2, sale:null, state:'open',
    text:{ en:'Two boxes of Augmentin missing from Shelf 1 after the evening count.', ar:'علبتان من أوغمنتين مفقودتان من الرف 1 بعد جرد المساء.' } },
  { id:'IN002', pharmacy:'P1', by:'zahraa@example.com', about:null, kind:'dispensing', daysAgo:6, sale:null, state:'closed',
    text:{ en:'A patient came back: the strength on the box was 875 mg, the prescription said 625 mg. Exchanged.', ar:'عاد مريض: التركيز على العلبة 875 ملغ والوصفة 625 ملغ. استُبدلت.' },
    reply:{ en:'Thank you — we now read the strength aloud at the counter.', ar:'شكراً — صرنا نقرأ التركيز بصوت عالٍ عند الصرف.' } },
  { id:'IN003', pharmacy:'P8', by:'ali@example.com', about:null, kind:'cash', daysAgo:4, sale:null, state:'open',
    text:{ en:'The drawer was 5,000 IQD short at hand-over; the note was left in the log.', ar:'نقص الصندوق 5,000 د.ع عند التسليم؛ تُركت ملاحظة في السجل.' } }
];

export const incidentCounts = seed => seed.reduce((o, x) => { o[x.pharmacy] = (o[x.pharmacy] || 0) + 1; return o; }, {});
