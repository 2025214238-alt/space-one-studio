const {chromium}=require('/usr/local/lib/node_modules/playwright');
const assert=require('node:assert/strict');
const site=process.env.STUDIO_URL||'http://localhost:5173';
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox']});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(site);
  const types=await page.locator('[data-catalog]').evaluateAll(cards=>cards.map(c=>c.dataset.catalog));
  assert.equal(types.length,36);assert.equal(new Set(types).size,36);
  for(const type of types.slice(12)) {
   // Each case uses only this isolated test browser's empty layout.
   await page.evaluate(()=>localStorage.setItem('space-one-v1',JSON.stringify({items:[],scenario:0})));
   await page.reload();
   const card=page.locator(`[data-catalog="${type}"]`);
   assert.ok(await card.locator('svg rect, svg path, svg circle').count()>0);
   await card.focus();await page.keyboard.press('Enter');
   await page.waitForFunction(()=>JSON.parse(localStorage.getItem('space-one-v1')).items.length===1);
   const get=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('space-one-v1')).items[0]);
   assert.equal((await get()).type,type);
   await page.getByRole('button',{name:'색상 변경',exact:true}).click();
   await page.locator('.part-tabs button').nth(0).click();
   await page.locator('.palette-row').nth(1).locator('button').nth(0).click();
   await page.locator('.part-tabs button').nth(1).click();
   await page.locator('.palette-row').nth(1).locator('button').nth(1).click();
   await page.waitForFunction(()=>JSON.parse(localStorage.getItem('space-one-v1')).items[0].colors[1]==='#4C78CA');
   assert.deepEqual((await get()).colors,['#D94F4F','#4C78CA']);
   await page.getByRole('button',{name:/^회전/}).click();
   await page.waitForFunction(()=>JSON.parse(localStorage.getItem('space-one-v1')).items[0].rotation===90);
   await page.reload();
   assert.equal(await page.locator(`.room-svg>[data-furniture]`).count(),1);
   assert.equal((await get()).type,type);assert.equal((await get()).rotation,90);
   assert.deepEqual((await get()).colors,['#D94F4F','#4C78CA']);
  }
  const expected=[['clothesRack'],['bunkBed','clothesRack','vanity'],['loveseat'],['officeChair','bookcase'],['plantStand','greenhouse'],['treadmill','dumbbellRack'],['oven'],['recordingDesk']];
  for(let i=0;i<8;i++) {
   await page.getByRole('button',{name:'시나리오 변경',exact:true}).click();
   await page.locator('.scenario-grid>button').nth(i).click();
   for(const type of expected[i])assert.equal(await page.locator(`[data-catalog="${type}"]`).count(),1);
  }
  await page.getByRole('tab',{name:'전체',exact:true}).click();
  await page.getByRole('textbox',{name:'가구 검색'}).fill('세탁기');
  assert.equal(await page.locator('[data-catalog]').count(),1);
  assert.equal(await page.locator('[data-catalog="washer"]').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS: 36 unique furniture types; all 24 additions render, place, recolor both parts, rotate and persist; all 8 scenario filters; search.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
