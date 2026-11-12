const {JSDOM}=require('jsdom'); const fs=require('fs');
let html=fs.readFileSync('../pinpoint.html','utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:false,addListener(){},removeListener(){}});w.addEventListener('error',e=>errors.push(e.message));}});
const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// night lights follow the period: firelight at capitals before 1914, masked electric light 1914-1960, full lights today
(async()=>{
  await sleep(200);
  click($('settingsBtn')); click(doc.querySelector('#optNight .optBtn[data-v="all"]')); click($('stDone'));
  const want={bronze:'fire',vienna:'fire',wwi:'mask',ww2:'mask',coldwar:'mask',modern:'full'};
  for(const mode of Object.keys(want)){
    click($('tabMap')); click(doc.querySelector('.seg[data-key="mode"] button[data-v="'+mode+'"]')); click(doc.querySelector('#ticks button[data-i="0"]'));
    click($('start')); await sleep(20);
    const fire=doc.querySelectorAll('#map g.fire circle').length, img=doc.querySelector('#map image.lights');
    const mask=img && img.getAttribute('mask'), mp=mask ? doc.querySelectorAll(mask.slice(4,-1)+' path').length : 0;
    const got = fire ? 'fire' : mask ? 'mask' : img ? 'full' : 'none';
    console.log(mode.padEnd(8), 'night', $('app').classList.contains('era-night'), '| fire glows', fire, '| lights image', !!img, '| mask paths', mp, '|', got===want[mode] ? 'ok' : 'WRONG');
    if(got!==want[mode]) errors.push(mode+': '+got);
    click($('home')); await sleep(5); click($('home')); await sleep(20); $('setup').hidden=false;
  }
  console.log('errors',errors); process.exit(0);
})();
