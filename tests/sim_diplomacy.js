const {JSDOM}=require('jsdom'); const fs=require('fs'); const d3=require('d3');
let html=fs.readFileSync('../pinpoint.html','utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:true,addListener(){},removeListener(){}});w.addEventListener('error',e=>errors.push(e.message));}});
const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const topojson=require('topojson-client');
const proj=d3.geoNaturalEarth1().fitExtent([[6,6],[954,494]],{type:'Sphere'});
// Diplomacy & Security: data checks, topic filter, organizations, HQ cities by location, "which treaty drew this border?"
const J=f=>JSON.parse(fs.readFileSync('../src/data/'+f,'utf8'));
const SEC=J('SEC.json'), CH=J('CHOKES.json'), HQ=J('HQS.json'), T=J('maps/PACKS.json').modern;
const names=new Set(T.objects.countries.geometries.map(g=>g.properties&&g.properties.name));
const bySq={}; SEC.forEach(q=>bySq[q.q]=q);
const find=n=>[...doc.querySelectorAll('#map path.country')].find(p=>p.__data__.properties.name===n);
const mapClick=(ll)=>{ const p=proj(ll); doc.querySelector('#map').dispatchEvent(new w.MouseEvent('click',{bubbles:true,clientX:p[0],clientY:p[1]})); };
const pHits=[];
// after a correct map answer the game moves on by itself (1.7 s when zoomed); wait for that
async function nextQ(q){ for(let t=0;t<40;t++){ if($('qname').textContent!==q || !$('end').hidden || $('hudTop').hidden) return; await sleep(100); } }
(async()=>{
  // ---- data
  const groups={}; SEC.forEach(s=>{ groups[s.g]=(groups[s.g]||0)+1; });
  SEC.forEach((s,i)=>{
    if(!['sec','org','treaty'].includes(s.g)) errors.push('no topic: '+i);
    if(s.k==='c') s.a.forEach(n=>{ if(!names.has(n)) errors.push('unknown country "'+n+'" in: '+s.q); });
    if(s.k==='p' && !CH[s.a[0]] && !HQ[s.a[0]]) errors.push('unknown place '+s.a[0]);
    if(s.k==='t'){
      if(new Set(s.a.concat(s.o)).size!==4) errors.push('treaty options not 4 distinct: '+s.q);
      const L=s.line; let segs=0;
      if(L.coords) segs=1; else {
        (L.mesh||[]).flat().concat(L.around?[L.around]:[]).forEach(n=>{ if(!names.has(n)) errors.push('unknown country in line: '+n); });
        const m=topojson.mesh(T,T.objects.countries,(a,b)=>a!==b&&(L.around?(a.properties.name===L.around||b.properties.name===L.around):L.mesh.some(pr=>(a.properties.name===pr[0]&&b.properties.name===pr[1])||(a.properties.name===pr[1]&&b.properties.name===pr[0]))));
        segs=m.coordinates.length;
      }
      if(!segs) errors.push('empty border line: '+s.q);
    }
  });
  console.log('questions by topic', JSON.stringify(groups), '| HQ cities', Object.keys(HQ).length);
  await sleep(200);
  click($('tabSecurity')); await sleep(20);
  console.log('tab:', $('tabSecurity').querySelector('.tl').textContent, '| topic chips visible', !$('secTopicSet').hidden, '| map modes hidden', $('modeSet').hidden);
  // ---- each topic and level: questions stay in the topic; answer them correctly
  for(const topic of ['treaty','org','sec','all']){
    click(doc.querySelector('.seg[data-key="secTopic"] button[data-v="'+topic+'"]'));
    for(const lv of [0,3]){
      click(doc.querySelector('#ticks button[data-i="'+lv+'"]')); click($('start')); await sleep(30);
      let n=0, firstTry=0, offTopic=0, kinds={};
      for(let i=0;i<10 && !$('hudTop').hidden;i++){
        const sq=bySq[$('qname').textContent]; if(!sq){ errors.push('unknown question '+$('qname').textContent); break; }
        if(topic!=='all' && sq.g!==topic) offTopic++;
        kinds[sq.k]=(kinds[sq.k]||0)+1;
        const before=+$('score').textContent;
        if(sq.k==='t'){
          if(!doc.querySelector('#map .tline')) errors.push('no line drawn');
          const btns=[...$('secOpts').querySelectorAll('button')];
          if(btns.length!==4 || $('secOpts').hidden) errors.push('options missing');
          btns.find(b=>b.textContent===sq.a[0]).dispatchEvent(new w.MouseEvent('click',{bubbles:true})); await sleep(10);
          if(!$('hint').textContent.length) errors.push('no fact after the answer');
          click($('act')); await sleep(15);
        } else if(sq.k==='p'){
          // location questions start zoomed on Impossible; reset the view so the click lands where it should
          doc.querySelector('#map > g').setAttribute('transform',''); await sleep(5);
          if(lv===3){ click($('act')); await sleep(10); click($('act')); await sleep(15); n++; continue; }
          const c=CH[sq.a[0]]||HQ[sq.a[0]]; mapClick([c[1],c[0]]); await nextQ(sq.q);
        } else {
          const el=find(sq.a[0]); if(el){ click(el); await nextQ(sq.q); }
        }
        if(sq.k==='p' && lv===0){ const got=+$('score').textContent-before; pHits.push(sq.a[0]+' '+got); if(got!==3) errors.push('HQ click missed: '+sq.a[0]); }
        if(+$('score').textContent-before===3) firstTry++;
        n++;
        if(!$('end').hidden) break;
        if(+$('score').textContent===before){ click($('act')); await sleep(10); click($('act')); await sleep(15); }
      }
      await sleep(30);
      console.log(`${topic.padEnd(6)} L${lv}: ${n} questions ${JSON.stringify(kinds)}, off-topic ${offTopic}, full marks ${firstTry}, end screen ${!$('end').hidden}`);
      if(offTopic) errors.push('off-topic questions in '+topic);
      if(!$('end').hidden){
        const row=doc.querySelector('#log li'); if(topic==='treaty') console.log('   end-screen row:', row && row.textContent.slice(0,110));
        click($('change')); await sleep(20);
      } else { click($('home')); await sleep(5); click($('home')); await sleep(20); }
    }
  }
  console.log('city clicks on Easy:', pHits.join(', '));
  console.log('best keys:', Object.keys(w.localStorage).filter(k=>k.includes('security')).join(', '));
  console.log('errors',errors); process.exit(0);
})();
