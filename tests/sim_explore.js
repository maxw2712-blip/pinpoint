const {JSDOM}=require('jsdom'); const fs=require('fs'); const d3=require('d3');
let html=fs.readFileSync(process.env.PINPOINT_HTML||'../pinpoint.html','utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:true,addListener(){},removeListener(){}});w.addEventListener('error',e=>errors.push(e.message));}});
const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const find=n=>[...doc.querySelectorAll('#map path.country')].find(p=>p.__data__.properties.name===n);
const labels=()=>[...doc.querySelectorAll('#map g.plabel text')].map(t=>t.textContent);
const proj=d3.geoNaturalEarth1().fitExtent([[6,6],[954,494]],{type:'Sphere'});
const mapClick=ll=>{ const p=proj(ll); doc.querySelector('#map').dispatchEvent(new w.MouseEvent('click',{bubbles:true,clientX:p[0],clientY:p[1]})); };
const set=(id,v)=>{ const s=$(id); s.value=v; s.dispatchEvent(new w.Event('change',{bubbles:true})); };
(async()=>{
  await sleep(200);
  console.log('tabs:',[...doc.querySelectorAll('[role=tab]')].map(b=>b.querySelector('.tl').textContent).join(' | '));
  console.log('old "Explore the map" button gone:',!$('explore'));
  click($('tabExplore')); await sleep(10);
  console.log('\nExplore tab: setup hidden =',$('setup').hidden,'| explore bar visible =',!$('exploreBar').hidden,'| hud hidden =',$('hud')?$('hud').hidden:'n/a','| picker =',$('exploreMode').value);
  click(find('Kenya')); click(find('France')); console.log('modern labels  :',labels().join(' / '));
  set('exploreMode','medieval'); await sleep(10);
  console.log('\nswitched to Medieval without leaving: labels cleared =',labels().length===0,'| pack paths =',doc.querySelectorAll('#map path.country').length);
  ['Song Empire','Kingdom of France','Mongol Empire','Venice'].forEach(n=>{ const e=find(n); if(e) click(e); });
  console.log('medieval labels:',labels().join(' / '));
  set('exploreMode','bronze'); await sleep(10); ['Dravidians','Vedic Aryans','Egypt'].forEach(n=>{ const e=find(n); if(e) click(e); }); console.log('bronze labels  :',labels().join(' / '));
  set('exploreMode','wwi'); await sleep(10); ['German Empire','Austro-Hungarian Empire','Serbia'].forEach(n=>{ const e=find(n); if(e) click(e); }); console.log('1914 labels    :',labels().join(' / '));
  set('exploreMode','geo'); await sleep(20); mapClick([32,26]); console.log('\ngeography      :',labels().join(' / ')||'(none)','| bar still visible =',!$('exploreBar').hidden);
  if($('exploreMode').querySelector('option[value="planets"]')){ set('exploreMode','planets'); await sleep(20); console.log('planets: switch-world button visible =',!$('exploreWorld').hidden); }
  else console.log('planets: archived, not in the Explore picker');
  set('exploreMode','modern'); await sleep(10);
  click($('exploreHome')); await sleep(10);
  console.log('\nHome: setup visible =',!$('setup').hidden,'| explore bar hidden =',$('exploreBar').hidden,'| tab highlighted =',[...doc.querySelectorAll('[role=tab].on')].map(b=>b.querySelector('.tl').textContent).join(','));
  // a normal game still works afterwards, and its labels do NOT show the capital
  click($('tabMap')); click(doc.querySelector('#ticks button[data-i="0"]')); click($('start')); await sleep(10);
  const q=[...doc.querySelectorAll('#map path.country')][3]; click(q);
  console.log('game after exploring works; label text in a game round:',labels().join(' / ')||'(none)');
  console.log('errors',errors); process.exit(0);
})();
