import {
  chromium
}
from'playwright';
import {
  pathToFileURL
}
from'node:url';
import {
  resolve
}
from'node:path';
const repo=resolve(import.meta.dirname,'../../..'),out=resolve(repo,'artifacts/character-movement/retained-donor-merge/two-character-eight-east-v2'),html=resolve(out,'two-character-eight-east.html'),browser=await chromium.launch( {
  headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'
}
);
try {
  const page=await browser.newPage( {
    viewport: {
      width:1280,height:900
    }
    ,deviceScaleFactor:1
  }
  );
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(html).href, {
    waitUntil:'load'
  }
  );
  await page.waitForSelector('body[data-ready="true"]');
  await page.screenshot( {
    path:resolve(out,'two-character-eight-east-native.png'),fullPage:true
  }
  );
  for(const expected of['02','03','04','05','06','07','08']) {
    await page.click('#next');
    if((await page.textContent('#phase')).trim()!==expected)throw new Error(`phase stepping failed ${expected}`)
  }
  await page.click('#joints');
  await page.screenshot( {
    path:resolve(out,'two-character-eight-east-joints.png'),fullPage:false
  }
  );
  await page.click('#sil');
  const guideSources=await page.locator('#stage img').evaluateAll(images=>images.map(image=>image.getAttribute('src')));
  if(guideSources.some(source=>!source.includes('guide')))throw new Error('guide toggle failed');
  await page.waitForFunction(()=>Array.from(document.querySelectorAll('#stage img')).every(image=>image.complete&&image.naturalWidth>0));
  await page.screenshot( {
    path:resolve(out,'two-character-eight-east-guide.png'),fullPage:false
  }
  );
  const map=await browser.newPage( {
    viewport: {
      width:1280,height:900
    }
    ,deviceScaleFactor:2
  }
  );
  await map.goto(pathToFileURL(html).href, {
    waitUntil:'load'
  }
  );
  await map.screenshot( {
    path:resolve(out,'two-character-eight-east-map-scale.png'),fullPage:true
  }
  );
  if(errors.length)throw new Error(errors.join('; '));
  console.log(JSON.stringify( {
    pageErrors:0,phaseStepping:8,guideToggle:2,native:'two-character-eight-east-native.png',mapScale:'two-character-eight-east-map-scale.png'
  }
  ))
}
finally {
  await browser.close()
}
