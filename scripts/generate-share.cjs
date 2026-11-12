const { chromium } = require('/usr/local/lib/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:800,height:400},deviceScaleFactor:1});
  await page.goto('http://localhost:5173');
  const drawing=await page.locator('.room-svg').evaluate(el=>el.outerHTML);
  await page.setContent(`<html lang="ko"><head><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"><style>*{box-sizing:border-box}body{margin:0;background:#F0F4EE;color:#293D33;font-family:Pretendard,sans-serif;width:800px;height:400px;display:flex;align-items:center;padding:36px;gap:10px}.copy{width:340px;flex-shrink:0}small{color:#54785D;font-size:15px}h1{font-size:44px;letter-spacing:-2px;margin:12px 0 10px}p{font-size:19px;line-height:1.8;word-break:keep-all;margin:0;color:#64775F}.tag{display:inline-block;background:#34785B;color:white;border-radius:8px;padding:9px 15px;font-size:14px;margin-top:24px}.drawing{width:380px;height:340px;flex-shrink:0}.drawing>svg{width:100%;height:100%}</style></head><body><div class="copy"><small>나만의 공간을 만드는 즐거움</small><h1>공간 한 칸</h1><p>가구를 놓고, 색을 입혀<br>나만의 일상을 설계해 보세요.</p><div class="tag">2D 공간 설계 시뮬레이션</div></div><div class="drawing">${drawing}</div></body></html>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:'public/og.png'});
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
