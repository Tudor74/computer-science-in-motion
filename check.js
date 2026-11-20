// Hub page check: no console errors, no horizontal scroll at phone to desktop widths, every course link present,
// and screenshots for review. Usage: node check.js [shots-dir]
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const file='file://'+path.resolve(__dirname,'index.html'),out=process.argv[2]||path.resolve(__dirname,'shots');fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch();const errs=[],fails=[];
 const p=await b.newPage({viewport:{width:1100,height:900},deviceScaleFactor:2});
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});
 await p.goto(file);await p.waitForTimeout(300);
 const hrefs=await p.$$eval('a',as=>as.map(a=>a.href));
 for(const h of ['https://mathematics-in-motion.puter.site/','https://computer-science-in-motion.puter.site/','https://hci-in-motion.puter.site/','https://therapies-in-motion.puter.site/','https://therapies-in-motion.puter.site/atlas.html','https://thinkers-in-motion.puter.site/','https://physics-in-motion.puter.site/','https://electronic-music-in-motion.puter.site/','https://philosophy-in-motion.puter.site/','https://awais-rashid-in-motion.puter.site/','https://the-future-in-motion.puter.site/','https://music-in-motion.puter.site/','https://mind-in-motion.puter.site/','https://ted-nelson-in-motion.puter.site/','https://biology-in-motion.puter.site/','https://language-in-motion.puter.site/','https://abiogenesis-in-motion.puter.site/','https://economics-in-motion.puter.site/','https://chemistry-in-motion.puter.site/','https://senses-in-motion.puter.site/','https://tripitaka-in-motion.puter.site/','https://techno-in-motion.puter.site/','https://frontier-in-motion.puter.site/','https://brain-in-motion.puter.site/','https://dimensions-in-motion.puter.site/','https://levin-lab-in-motion.puter.site/','https://consciousness-in-motion.puter.site/'])if(!hrefs.includes(h))fails.push('missing link '+h);
 await p.screenshot({path:path.join(out,'hub-desktop.png'),fullPage:true});
 for(const w of [320,375,760,1024]){await p.setViewportSize({width:w,height:800});await p.waitForTimeout(50);const ov=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(ov>0)fails.push(`overflow ${ov}px at ${w}`)}
 const ph=await b.newPage({viewport:{width:375,height:800},isMobile:true,hasTouch:true});await ph.goto(file);await ph.waitForTimeout(200);
 await ph.screenshot({path:path.join(out,'hub-phone.png'),fullPage:true});
 console.log(fails.length||errs.length?'FAIL:\n'+fails.concat(errs).join('\n'):'Hub: no console errors, no overflow, all links present.');await b.close();process.exit(fails.length+errs.length?1:0)})();
