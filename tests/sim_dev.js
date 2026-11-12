const {JSDOM}=require('jsdom'); const fs=require('fs'); const d3=require('d3');
let html=fs.readFileSync('../pinpoint-dev.html','utf8')   /* dev mode exists only in the private build */;
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:true,addListener(){},removeListener(){}});w.addEventListener('error',e=>errors.push(e.message));}});
const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const proj=d3.geoNaturalEarth1().fitExtent([[6,6],[954,494]],{type:'Sphere'});
const find=n=>[...doc.querySelectorAll('#map path.country')].find(p=>p.__data__.properties.name===n);
const mapClick=(ll)=>{ const p=proj(ll); doc.querySelector('#map').dispatchEvent(new w.MouseEvent('click',{bubbles:true,clientX:p[0],clientY:p[1]})); };
(async()=>{
  await sleep(200);
  console.log('dev off: report button hidden =',$('reportBtn').hidden,'| reports link hidden =',$('devReports').hidden);
  $('devToggle').checked=true; $('devToggle').dispatchEvent(new w.Event('change',{bubbles:true}));
  console.log('dev on : report button hidden =',$('reportBtn').hidden,'| reports link:',$('devReports').textContent);
  // 1) medieval, Hard, point at a realm
  click(doc.querySelector('.seg[data-key="mode"] button[data-v="medieval"]')); click(doc.querySelector('#ticks button[data-i="2"]')); click($('start')); await sleep(10);
  click($('reportBtn')); console.log('\npanel open =',!$('reportPanel').hidden,'\n'+$('rpContext').textContent);
  click($('rpPoint')); console.log('pointing: panel hidden =',$('reportPanel').hidden,'| toast:',$('toast').textContent);
  const tries0=[...doc.querySelectorAll('.pip')].filter(p=>!p.hidden&&!p.classList.contains('used')).length;
  click(find('Song Empire')); const tries1=[...doc.querySelectorAll('.pip')].filter(p=>!p.hidden&&!p.classList.contains('used')).length;
  console.log('tap while pointing did not count as an answer: tries',tries0,'->',tries1,'| panel back =',!$('reportPanel').hidden,'|',$('rpTarget').textContent);
  $('rpType').value='Wrong answer or capital'; $('rpNote').value='Lin\u2019an (Hangzhou) was the capital in 1200.';
  click($('rpSave')); console.log('saved -> panel hidden =',$('reportPanel').hidden,'| reports link:',$('devReports').textContent);
  click($('change')); await sleep(5);
  // 2) trivia, Impossible (timer), report auto-captures the question
  click($('tabHist')); click(doc.querySelector('#ticks button[data-i="3"]')); click($('start')); await sleep(10);
  const barBefore=$('timerFill').style.width; click($('reportBtn')); await sleep(250);
  const frozen=$('timerFill').style.width; await sleep(250); console.log('\ntrivia: point button hidden =',$('rpPoint').hidden,'| timer paused while open:',frozen===$('timerFill').style.width);
  $('rpType').value='Wrong date or period'; click($('rpSave')); await sleep(60);
  console.log('timer resumed after save: bar moved =',$('timerFill').style.width!==frozen);
  click($('change')); await sleep(5);
  // 3) geography: point at open land
  click($('tabGeo')); click(doc.querySelector('#ticks button[data-i="0"]')); click($('start')); await sleep(20);
  click($('reportBtn')); click($('rpPoint')); mapClick([10,23]); console.log('\ngeo: pointed ->',$('rpTarget').textContent);
  $('rpType').value='Wrong position or border on the map'; click($('rpSave')); click($('change')); await sleep(5);
  // 4) explore mode report
  click($('tabMap')); click(doc.querySelector('.seg[data-key="mode"] button[data-v="modern"]')); click($('tabExplore')); await sleep(10);
  click(find('Kenya')); click($('exploreReport')); console.log('\nexplore: auto target ->',$('rpTarget').textContent); click($('rpCancel'));
  console.log('explore report cancelled, reports still',$('devReports').textContent);
  click($('exploreHome')); await sleep(5);
  // view + copy
  click($('devReports')); console.log('\n---- saved reports ----\n'+$('rvText').value);
  click($('rvClear')); console.log('\nafter clear:',$('rvText').value,'|',$('devReports').textContent);
  console.log('errors',errors); process.exit(0);
})();
