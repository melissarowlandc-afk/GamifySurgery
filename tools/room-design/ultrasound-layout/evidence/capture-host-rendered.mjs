import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
for(const[name,width]of[['ultrasound-host-desktop',900],['ultrasound-host-320',320]]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto('file:///C:/Users/Kyle%20Kent/Projects/GamifySurgery/tools/room-design/ultrasound-layout/evidence/ultrasound-layout-host.html');
  const frame=page.frameLocator('iframe'),proof=frame.locator('#ultrasound-layout-proof');
  await proof.waitFor();
  await frame.locator('body').evaluate(()=>window.__ultrasoundLayout?.ready());
  await page.waitForTimeout(100);
  const height=await frame.locator('html').evaluate(el=>el.scrollHeight);
  await page.locator('iframe').evaluate((el,h)=>el.style.height=`${h}px`,height);
  await proof.screenshot({path:`tools/room-design/ultrasound-layout/evidence/${name}.png`});
  if(name==='ultrasound-host-desktop'){
    for(const button of await frame.locator('.ultrasound-controls [data-segment]').all())if(await button.getAttribute('aria-pressed')!=='true')await button.click();
    for(const input of await frame.locator('[data-adjacent]').all())if(!await input.isChecked())await input.check();
    await proof.screenshot({path:'tools/room-design/ultrasound-layout/evidence/ultrasound-host-all-open-backed.png'});
  }
  await page.close();
}
await browser.close();
