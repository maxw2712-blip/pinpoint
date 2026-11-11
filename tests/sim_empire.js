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
  await sleep(200); click($('tabExplore'));
  const s=$('exploreMode'); s.value='ww2'; s.dispatchEvent(new w.Event('change',{bubbles:true})); await sleep(20);
  const all=[...doc.querySelectorAll('#map path.country')];
  const named=all.filter(p=>p.__data__.properties&&p.__data__.properties.name), bg=all.filter(p=>!(p.__data__.properties&&p.__data__.properties.name));
  console.log('1945 shapes: named',named.length,'| still unnamed',bg.length);
  const count={}; named.forEach(p=>{ const n=p.__data__.properties.name; count[n]=(count[n]||0)+1; });
  console.log('pieces per empire:',['British Empire','French Empire','Belgian Empire','Portuguese Empire','Spanish Empire','Dutch Empire'].map(n=>n+' '+count[n]).join(' | '));
  const fillsBy={}; doc.querySelectorAll('#map g.pfill').forEach(g=>{ const k=g.getAttribute('data-key'); fillsBy[k]=(fillsBy[k]||0)+1; });
  console.log('flags painted:',['British Empire','French Empire','Belgian Empire','Portuguese Empire','Spanish Empire','Dutch Empire','Liberia'].map(n=>n+' '+(fillsBy[n]||0)+' pieces').join(' | '));
  const labels=[...doc.querySelectorAll('#map g.plabelwrap')].filter(w=>w.style.display!=='none').map(w=>w.querySelector('text').textContent);
  console.log('labels showing at world view:',labels.length,'|',labels.slice(0,12).join(' / '));
  // a game on 1945: click an empire piece, answer a question about an empire
  click($('exploreHome')); await sleep(5);
  console.log('errors',errors); process.exit(0);
})();
