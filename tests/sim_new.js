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
const proj=d3.geoNaturalEarth1().fitExtent([[6,6],[954,494]],{type:'Sphere'});
// security questions and chokepoints, read from src/ (this used to read an old pipeline file, sec.json)
const SEC={Q:JSON.parse(fs.readFileSync('../src/data/SEC.json','utf8')), CH:JSON.parse(fs.readFileSync('../src/data/CHOKES.json','utf8'))}; const bySq={}; SEC.Q.forEach(q=>bySq[q.q]=q);
const find=n=>[...doc.querySelectorAll('#map path.country')].find(p=>p.__data__.properties.name===n);
const mapClick=(ll)=>{ const p=proj(ll); doc.querySelector('#map').dispatchEvent(new w.MouseEvent('click',{bubbles:true,clientX:p[0],clientY:p[1]})); };
(async()=>{
  await sleep(200);
  console.log('tabs:',[...doc.querySelectorAll('.tab')].map(b=>b.querySelector('.tl').textContent).join(' | '));
  console.log('Nation States modes:',[...doc.querySelectorAll('.seg[data-key="mode"] button')].map(b=>b.textContent).join(' | '));
  // new periods
  for(const mode of ['vienna','ww2','coldwar']){
    click(doc.querySelector(`.seg[data-key="mode"] button[data-v="${mode}"]`)); await sleep(10);
    const row=[];
    for(const lv of [0,1,3]){
      click(doc.querySelector(`#ticks button[data-i="${lv}"]`)); const seen={}; let caps=0,tot=0; const rounds=new Set();
      for(let g=0;g<12;g++){ click($('start')); await sleep(2); const n=+$('round').textContent.split(' of ')[1]; rounds.add(n); for(let r=0;r<n;r++){ if(/capital/i.test($('kind').textContent)) caps++; tot++; seen[$('qname').textContent]=1; click($('act')); click($('act')); } click($('change')); }
      row.push(`L${lv}: rounds=[${[...rounds]}] distinct=${Object.keys(seen).length} caps=${caps}/${tot}`);
    }
    console.log(mode.padEnd(8),row.join(' | '));
  }
  // security tab
  click($('tabSecurity')); await sleep(10);
  console.log('\nSecurity note:',$('histNote').textContent.slice(0,60),'| desc L0:',(click(doc.querySelector('#ticks button[data-i="0"]')),$('lvlDesc').textContent));
  for(const lv of [0,1,2,3]){
    click(doc.querySelector(`#ticks button[data-i="${lv}"]`));
    let chokes=0,tot=0,prompts=[];
    for(let g=0;g<15;g++){ click($('start')); await sleep(2); for(let r=0;r<10;r++){ const q=$('qname').textContent; const s=bySq[q]; if(s&&s.k==='p') chokes++; tot++; if(g===0&&r<2) prompts.push(q.slice(0,50)); click($('act')); click($('act')); } click($('change')); }
    console.log(` L${lv}: strait questions ${chokes}/${tot} | e.g. ${prompts.join(' || ')}`);
  }
  // answer a country question correctly + a strait question correctly
  click(doc.querySelector('#ticks button[data-i="0"]')); 
  let doneC=false, doneP=false;
  for(let g=0;g<40&&!(doneC&&doneP);g++){
    click($('start')); await sleep(5);
    for(let r=0;r<10;r++){
      const s=bySq[$('qname').textContent];
      if(s&&s.k==='c'&&!doneC){ const before=+$('score').textContent; click(find(s.a[s.a.length-1])); console.log('\ncountry question:',s.q.slice(0,55),'| clicked',s.a[s.a.length-1],'=> +'+(+$('score').textContent-before),'| highlighted',doc.querySelectorAll('#map path.country.hit').length,'of',s.a.length,'| hint/fact:',$('hint').textContent.slice(0,50)); doneC=true; }
      else if(s&&s.k==='p'&&!doneP){ const ch=SEC.CH[s.a[0]]; const before=+$('score').textContent; mapClick([ch[1]+0.3,ch[0]+0.2]); console.log('strait question:',s.q.slice(0,50),'| clicked near',s.a[0],'=> +'+(+$('score').textContent-before),'| label:',[...doc.querySelectorAll('#map g.plabel text')].map(x=>x.textContent).join(',')); doneP=true; }
      await sleep(5); click($('act')); click($('act'));
    }
    click($('change'));
  }
  // explore mode
  click($('tabMap')); click(doc.querySelector('.seg[data-key="mode"] button[data-v="modern"]')); click($('tabExplore')); await sleep(10);
  click(find('Kenya')); click(find('Japan'));
  console.log('\nexplore: labels',[...doc.querySelectorAll('#map g.plabel text')].map(x=>x.textContent).join(','),'| bar visible',!$('exploreBar').hidden,'| hud hidden',$('hudTop').hidden);
  click($('exploreHome')); await sleep(5); console.log('explore Home -> setup visible',!$('setup').hidden,'labels',doc.querySelectorAll('#map g.plabel').length);
  click($('tabHist')); console.log('History tab: explore button hidden =',$('tabExplore').hidden);
  // practice misses
  click($('tabMap')); click($('start')); await sleep(10);
  for(let r=0;r<10;r++){ if(r<4){ click($('act')); click($('act')); } else { click($('act')); click($('act')); } }
  console.log('\nend screen: practice button',$('practice').hidden?'hidden':$('practice').textContent,'| best note:',$('best2').textContent.slice(0,40));
  click($('practice')); await sleep(10); console.log('practice game rounds:',$('round').textContent);
  for(let r=0;r<10;r++){ click($('act')); click($('act')); }
  console.log('after practice: best note:',$('best2').textContent,'| errors',errors); process.exit(0);
})();
