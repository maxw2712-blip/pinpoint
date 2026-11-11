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
const find=n=>[...doc.querySelectorAll('#map path.country')].find(p=>p.__data__.properties.name===n);
const info=()=>({fills:doc.querySelectorAll('#map g.pfill').length, edges:doc.querySelectorAll('#map path.pfillEdge').length, fillImg:doc.querySelectorAll('#map g.pfill image').length, labels:[...doc.querySelectorAll('#map g.plabel')].map(g=>g.querySelector('text').textContent+'['+g.querySelectorAll('image').length+' badge]').join(','), flagged:doc.querySelectorAll('#map path.country.flagged').length});
(async()=>{
  await sleep(150);
  click($('start')); await sleep(20);
  click(find('Kenya')); click(find('Brazil')); click(find('Kenya'));
  console.log('modern, 3 clicks:',JSON.stringify(info()));
  const f=doc.querySelector('#map g.pfill'); console.log('fill uses flag data:',f.querySelector('image').getAttribute('href').slice(0,22),'| clip-path set:',f.getAttribute('clip-path'));
  const kids=[...doc.querySelector('#map g').children].map(c=>c.tagName+(c.getAttribute('class')?'.'+c.getAttribute('class').split(' ')[0]:''));
  console.log('layer order (tail):',kids.slice(-6).join(' > '));
  // correct answer: fill + gold outline, order preserved
  const q=$('qname').textContent; const keyFor=n=>n; 
  click($('act')); click(find('France')); console.log('after skip+click France:',JSON.stringify(info()));
  click($('change')); await sleep(5); console.log('after Home:',JSON.stringify(info()));
  // flags tab and security tab
  click($('tabFlags')); click($('start')); await sleep(10); click(find('Japan')); console.log('flags tab:',JSON.stringify(info())); click($('change'));
  click($('tabSecurity')); click($('start')); await sleep(10); click(find('Germany')); console.log('security tab:',JSON.stringify(info())); click($('change'));
  // realms keep the old small flags (no single flag exists)
  click($('tabMap')); click(doc.querySelector('.seg[data-key="mode"] button[data-v="medieval"]')); click($('start')); await sleep(10); click(find('Mongol Empire'));
  console.log('medieval realm:',JSON.stringify(info()));
  console.log('errors',errors); process.exit(0);
})();
