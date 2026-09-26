import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport:{ width:1440, height:900 } })).newPage();
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file:///home/user/Saydaliplus/demo/saydali-plus_v0.0013.html');
console.log(await p.evaluate(() => {
  signInAs('rahma@example.com'); setLang('en');
  goto('count'); startCount('Shelf 3'); countScan('5000000001316'); countScan('5000000001316'); countScan('5000000001316');
  countExpiry(0, '11/27'); countSplit(0); countSameAsLast(1); countSplit(0); countExpiry(1, '02/28');
  saveCount(); resumeCount(S.countSessions.find(x => x.shelf === 'Shelf 3').id);
  countScan('5000000001316');
  const items1 = JSON.stringify(openCountSession().items);
  openCountSession().items.forEach((it, i) => { if (!it.expiry) countExpiry(i, '11/27'); });
  countScan('4000000001294'); const items2 = JSON.stringify(openCountSession().items);
  countExpiry(openCountSession().items.length - 1, '05/28'); const items3 = JSON.stringify(openCountSession().items); confirmCount();
  return { items1, items2, items3, nex: stockOf('P1','5000000001316').available, note:S.stockNote, screen:S.screen, shelves: document.querySelector('.st-shelves') && document.querySelector('.st-shelves').innerText };
}));
await b.close();
