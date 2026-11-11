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
(async()=>{
  await sleep(200);
  for(const mode of ['bronze','ancient','medieval','discovery','wwi']){
    click(doc.querySelector(`.seg[data-key="mode"] button[data-v="${mode}"]`));
    click(doc.querySelector('#ticks button[data-i="2"]')); click($('start')); await sleep(15);
    const bg=[...doc.querySelectorAll('#map path.country.bg')]; const named=[...doc.querySelectorAll('#map path.country:not(.bg)')];
    const pips0=[...doc.querySelectorAll('.pip')].filter(p=>!p.hidden&&!p.classList.contains('used')).length;
    bg.slice(0,6).forEach(click);
    const pips1=[...doc.querySelectorAll('.pip')].filter(p=>!p.hidden&&!p.classList.contains('used')).length;
    console.log(`${mode.padEnd(10)} unclaimed shapes=${bg.length} playable=${named.length} | after 6 taps on unclaimed: tries ${pips0}->${pips1}, labels=${doc.querySelectorAll('#map g.plabel').length}, toast="${$('toast').textContent}"`);
    click($('change')); await sleep(5);
  }
  // explore mode too
  click(doc.querySelector('.seg[data-key="mode"] button[data-v="medieval"]')); click($('tabExplore')); await sleep(10);
  [...doc.querySelectorAll('#map path.country.bg')].slice(0,4).forEach(click);
  console.log('explore: labels after tapping unclaimed =',doc.querySelectorAll('#map g.plabel').length);
  console.log('errors',errors); process.exit(0);
})();
