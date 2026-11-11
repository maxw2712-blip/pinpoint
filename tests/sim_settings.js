const {JSDOM}=require('jsdom'); const fs=require('fs');
let html=fs.readFileSync('../pinpoint.html','utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:true,addListener(){},removeListener(){}});w.addEventListener('error',e=>errors.push(e.message));}});
const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const round=()=>$('round').textContent;
(async()=>{
  await sleep(200);
  console.log('gear on menu:',!!$('settingsBtn'),'| dev toggle now lives in settings:',!!doc.querySelector('#settingsPanel #devToggle'),'| old menu row gone:',!doc.querySelector('#setup .devrow'));
  click($('settingsBtn')); console.log('settings open =',!$('settingsPanel').hidden,'| auto checked =',$('optAuto').checked,'| delay buttons disabled while off =',$('optDelayBox').disabled);
  $('optAuto').checked=true; $('optAuto').dispatchEvent(new w.Event('change',{bubbles:true}));
  click(doc.querySelector('#optDelay .optBtn[data-v="3"]'));
  console.log('auto on, delay 3s -> saved:',w.localStorage.getItem('pinpoint:cfg'),'| delay buttons enabled =',!$('optDelayBox').disabled);
  click($('stDone')); console.log('closed =',$('settingsPanel').hidden);
  // map game: skip a question -> reveal -> countdown -> next question on its own
  click(doc.querySelector('#ticks button[data-i="1"]')); click($('start')); await sleep(10);
  console.log('\nmap game, Round',round(),'| gear in game:',!!$('settingsBtn2'));
  click($('act')); await sleep(30);
  console.log('after Skip: button reads "'+$('act').textContent+'"');
  await sleep(1100); console.log('1 s later: "'+$('act').textContent+'"');
  // open settings mid-countdown: it must wait
  click($('settingsBtn2')); await sleep(2600);
  console.log('settings open for 2.6 s -> still on Round',round(),'(paused)');
  click($('stDone')); await sleep(2800);
  console.log('after closing and waiting -> Round',round(),'| button:',$('act').textContent);
  // turn it off in game: no countdown on the next miss
  click($('settingsBtn2')); $('optAuto').checked=false; $('optAuto').dispatchEvent(new w.Event('change',{bubbles:true})); click($('stDone'));
  click($('act')); await sleep(3600);
  console.log('\nauto OFF: after a miss and 3.6 s -> Round',round(),'| button:',$('act').textContent,'(waits for you)');
  click($('act')); await sleep(20); console.log('pressing it manually still works -> Round',round());
  click($('home')); await sleep(5); click($('home')); await sleep(5);
  // trivia
  $('setup').hidden=false;
  click($('settingsBtn')); $('optAuto').checked=true; $('optAuto').dispatchEvent(new w.Event('change',{bubbles:true})); click(doc.querySelector('#optDelay .optBtn[data-v="3"]')); click($('stDone'));
  click($('tabHist')); click(doc.querySelector('#ticks button[data-i="0"]')); click($('start')); await sleep(10);
  const btns=[...doc.querySelectorAll('#tOpts button')];
  for(const b of btns){ click(b); if($('act').textContent!=='Skip') break; }
  await sleep(1300);
  console.log('\ntrivia: after the question is answered or revealed, button reads "'+$('act').textContent+'"');
  await sleep(2400); console.log('trivia: ~3.7 s later -> Round',round());
  console.log('errors',errors); process.exit(0);
})();
