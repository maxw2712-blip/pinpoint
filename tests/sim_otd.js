const {JSDOM}=require('jsdom'); const fs=require('fs');
let html=fs.readFileSync('../pinpoint.html','utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:false,addListener(){},removeListener(){}});w.addEventListener('error',e=>errors.push(e.message));}});
const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// On this day: every calendar date has a fact, and the menu shows today's
(async()=>{
  await sleep(200);
  const D=JSON.parse(fs.readFileSync('../src/data/ONTHISDAY.json','utf8'));
  const keys=[]; for(let d=new Date(2024,0,1); d.getFullYear()===2024; d.setDate(d.getDate()+1)) keys.push(String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'));
  const missing=keys.filter(k=>!D[k]), bad=Object.entries(D).filter(([k,v])=>!Array.isArray(v)||v.length!==2||!v[0]||!v[1]||v[1].length>110);
  console.log('dates covered', keys.length-missing.length, 'of', keys.length, '| malformed or too long', bad.map(b=>b[0]));
  if(missing.length) errors.push('missing dates: '+missing.join(','));
  if(bad.length) errors.push('bad entries');
  const t=new Date(), k=String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
  console.log('menu shows:', $('otd').textContent, '| visible', !$('otd').hidden);
  if($('otd').hidden || !$('otd').textContent.includes(D[k][1])) errors.push('menu does not show today\'s fact');
  console.log('errors',errors); process.exit(0);
})();
