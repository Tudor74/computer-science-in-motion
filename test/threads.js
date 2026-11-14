// Connection threads on the local map: merged by name, the travelled thread is kept, and scenes in several
// threads offer an "Other connection" switch that changes the up/down neighbours.
const {chromium}=require('playwright');const path=require('path');
const file='file://'+path.resolve(process.env.FILE||path.resolve(__dirname,'../index.html'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});const errs=[],fails=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});
 await p.goto(file);await p.waitForTimeout(300);const ok=(c,m)=>{if(!c)fails.push(m)};
 const ids=await p.evaluate(()=>csApp.route);let multi=0,checked=0;
 for(const id of ids){
  await p.evaluate(id=>csApp.go(id),id);
  const sw=await p.$('#map-switch');if(!sw)continue;multi++;
  const before=await p.evaluate(()=>[document.getElementById('map-up').dataset.node,document.getElementById('map-down').dataset.node,document.getElementById('map-caption').textContent].join('|'));
  await sw.click();
  const after=await p.evaluate(()=>[document.getElementById('map-up').dataset.node,document.getElementById('map-down').dataset.node,document.getElementById('map-caption').textContent].join('|'));
  ok(before!==after,id+': Other connection changes the connection');checked++;
  // Travelling down along the chosen thread keeps that thread active.
  const down=await p.evaluate(()=>document.getElementById('map-down').dataset.node);const cap=after.split('|')[2].split(' Other')[0];
  if(down){await p.click('#map-down');const capNow=await p.$eval('#map-caption',e=>e.textContent.split(' Other')[0]);ok(capNow===cap||!capNow.startsWith('↑↓'),id+': thread kept after moving down ('+cap+' → '+capNow+')')}
 }
 console.log('scenes with several connections:',multi);
 console.log(fails.length||errs.length?'FAIL:\n'+fails.concat(errs).join('\n'):'Threads: all checks pass.');await b.close();process.exit(fails.length+errs.length?1:0)})();
