const {JSDOM}=require('jsdom'); const fs=require('fs');
let html=fs.readFileSync(process.env.PINPOINT_HTML||'../pinpoint.html','utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:true,addListener(){},removeListener(){}});w.addEventListener('error',e=>errors.push(e.message));}});
const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  await sleep(150);
  console.log('tabs:',[...doc.querySelectorAll('.tab')].map(b=>b.textContent).join(' | '));
  console.log('Map games modes:',[...doc.querySelectorAll('.seg[data-key="mode"] button')].map(b=>b.textContent).join(', '));
  click(doc.querySelector('.seg[data-key="mode"] button[data-v="ancient"]')); await sleep(10);
  // Planets is archived: its tab exists only in a build made with --planets (PINPOINT_HTML=... to test that build)
  console.log('planets tab present =', !!$('tabPlanets'));
  for(const tab of ['tabGeo','tabFlags','tabPlanets','tabHist']){
    if(!$(tab)) continue;
    click($(tab)); await sleep(15);
    for(const lv of [0,3]){
      click(doc.querySelector(`#ticks button[data-i="${lv}"]`)); click($('start')); await sleep(15);
      const first=$('kind').textContent+' '+($('qname').textContent||'['+(!$('flagImg').hidden?'flag':'')+$('tQuestion').textContent.slice(0,30)+']');
      for(let r=0;r<10;r++){ click($('act')); click($('act')); await sleep(2); }
      console.log(` ${tab} L${lv}: first="${first.slice(0,60)}" ended=${!$('end').hidden}`);
      click($('change')); await sleep(5);
    }
  }
  click($('tabMap')); await sleep(10);
  console.log('Back on Map games: mode =',doc.querySelector('.seg[data-key="mode"] button[aria-pressed="true"]').textContent,'| picker visible =',!$('modeSet').hidden,'| lede starts:',$('lede').textContent.slice(0,32));
  click($('start')); await sleep(15); console.log('map game prompt:',$('kind').textContent,'|',$('qname').textContent);
  console.log('errors',errors); process.exit(0);
})();
