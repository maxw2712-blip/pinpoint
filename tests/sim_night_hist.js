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
(async()=>{
  await sleep(200);
  for(const mode of ['auto','all','off']){
    click($('settingsBtn')); click(doc.querySelector('#optNight .optBtn[data-v="'+mode+'"]')); click($('stDone'));
    click($('tabHist')); click(doc.querySelector('#ticks button[data-i="0"]')); click($('start')); await sleep(20);
    const night1=$('app').classList.contains('era-night'), d1=$('app').style.getPropertyValue('--dusk');
    click($('act')); await sleep(30); click($('act')); await sleep(30);
    console.log(mode.padEnd(5),'history night =',night1,'| dusk q1 =',d1,'-> after next =',$('app').style.getPropertyValue('--dusk'),'| round',$('round').textContent);
    click($('home')); await sleep(5); click($('home')); await sleep(20);
    $('setup').hidden=false;
  }
  console.log('errors',errors); process.exit(0);
})();
