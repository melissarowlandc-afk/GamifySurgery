// A console performance advisory is not a page error. Application errors still fail.
exports.listen=function(page){
 const errors=[],warnings=[],ignoredCanvasPerformanceWarnings=[];
 page.on('pageerror',e=>errors.push({kind:'pageerror',message:String(e)}));
 page.on('console',m=>{const message=m.text();if(/^Canvas2D:\s*Multiple readback operations using getImageData.*willReadFrequently.*attribute/i.test(message)){ignoredCanvasPerformanceWarnings.push(message);return;}if(m.type()==='error')errors.push({kind:'console.error',message});else if(m.type()==='warning')warnings.push(message);});
 page.on('requestfailed',r=>errors.push({kind:'requestfailed',url:r.url(),message:r.failure()?.errorText}));
 page.on('response',r=>{if(r.status()>=400)errors.push({kind:'http-error',url:r.url(),status:r.status()});});
 return{errors,warnings,ignoredCanvasPerformanceWarnings};
};
