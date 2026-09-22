import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
for(const[name,width]of[['minor-host-desktop',900],['minor-host-320',320]]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto('file:///C:/Users/Kyle%20Kent/Projects/GamifySurgery/tools/room-design/minor-procedure-layout/evidence/minor-procedure-layout-host.html');
  const frame=page.frameLocator('iframe'),proof=frame.locator('#minor-procedure-layout-proof');
  await proof.waitFor();
  await frame.locator('body').evaluate(()=>window.__minorProcedureLayout?.ready());
  await page.waitForTimeout(100);
  const height=await frame.locator('html').evaluate(el=>el.scrollHeight);
  await page.locator('iframe').evaluate((el,h)=>el.style.height=`${h}px`,height);
  await proof.screenshot({path:`tools/room-design/minor-procedure-layout/evidence/${name}.png`});
  await page.close();
}
await browser.close();
