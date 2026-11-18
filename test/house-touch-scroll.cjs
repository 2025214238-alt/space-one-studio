const {chromium}=require('/usr/local/lib/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox']});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();await page.goto(process.env.STUDIO_URL||'http://localhost:5173');
  await page.getByRole('button',{name:/가구 고르기/}).tap();
  const r=await page.locator('[data-catalog]').first().boundingBox(),cdp=await context.newCDPSession(page),x=r.x+r.width/2,y=r.y+70;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=12;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-i*15}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForFunction(()=>document.querySelector('.hs-catalog-scroll').scrollTop>0);
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('ai-house-survival-v2'))?.design.items.length===13);
  assert.equal(await page.locator('[data-furniture="preview"]').count(),0);
  console.log('PASS mobile catalogue: swipe scrolls over furniture cards, does not accidentally place an item.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
