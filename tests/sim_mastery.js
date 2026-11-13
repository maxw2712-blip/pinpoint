const {JSDOM}=require('jsdom'); const fs=require('fs');
let html=fs.readFileSync('../pinpoint.html','utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:false,addListener(){},removeListener(){}});w.addEventListener('error',e=>errors.push(e.message));}});
const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// mastery: results are saved per period and realm, Explore > Mastery shades the map, "Practice my weak spots" uses them
(async()=>{
  await sleep(200);
  const M=()=>JSON.parse(w.localStorage.getItem('pinpoint:mastery')||'{}');
  click($('tabMap')); click(doc.querySelector('.seg[data-key="mode"] button[data-v="modern"]')); click(doc.querySelector('#ticks button[data-i="0"]'));
  console.log('fresh: weak-spots button hidden =', $('weakBtn').hidden);
  // game 1: skip every question (all missed)
  click($('start')); await sleep(10);
  const asked=[];
  for(let i=0;i<10;i++){ asked.push($('qname').textContent); click($('act')); await sleep(5); click($('act')); await sleep(5); }
  await sleep(20);
  const m1=M().modern||{};
  console.log('after a game of misses: saved realms', Object.keys(m1).length, '| sample', JSON.stringify(Object.entries(m1)[0]));
  if(Object.keys(m1).length<5) errors.push('results not saved');
  click($('change')); await sleep(20);
  console.log('setup: weak-spots button =', $('weakBtn').hidden ? 'hidden' : '"'+$('weakBtn').textContent+'"');
  if($('weakBtn').hidden) errors.push('weak button hidden');
  // practice weak spots: the questions are exactly the saved weak realms
  click($('weakBtn')); await sleep(10);
  const pq=$('qname').textContent, disp=new Set(asked);
  console.log('practice started: round', $('round').textContent, '| first question', pq, '| was missed before =', disp.has(pq));
  if(!disp.has(pq)) errors.push('practice question not a weak spot');
  // answer correctly by clicking the right country path: find it by name through the label peek is hard, so just skip and check counting
  click($('act')); await sleep(5); click($('act')); await sleep(5);
  const r=Object.values(M().modern).find(v=>v[0]>=2);
  console.log('practice answers are recorded too: a realm asked twice ->', JSON.stringify(r));
  if(!r) errors.push('practice not recorded');
  click($('home')); await sleep(5); click($('home')); await sleep(20);
  // explore with mastery
  click($('tabExplore')); await sleep(50);
  console.log('explore: mastery button visible =', !$('masteryBtn').hidden, '| shading paths before =', doc.querySelectorAll('#map .mst').length);
  click($('masteryBtn')); await sleep(50);
  const red=[...doc.querySelectorAll('#map .mst:not(.none)')], none=doc.querySelectorAll('#map .mst.none').length;
  const pct=[...doc.querySelectorAll('#map .plabel text')].map(t=>t.textContent).filter(t=>/\d%\)$/.test(t));
  console.log('mastery on: coloured', red.length, '| grey (not asked)', none, '| fill', red[0]&&red[0].getAttribute('fill'), '| labels with %:', pct.slice(0,3), '| key:', $('masteryKey').textContent.replace(/\s+/g,' '));
  console.log('explore practice button:', $('exploreWeak').hidden ? 'hidden' : $('exploreWeak').textContent);
  if(!red.length || !pct.length) errors.push('mastery shading/labels missing');
  const cap=[...doc.querySelectorAll('#map .plabel text')].map(t=>t.textContent).filter(t=>/Nairobi|Paris|Washington/.test(t));
  if(cap.length) errors.push('capitals still shown in mastery mode');
  // switch period keeps mastery on; geography hides it
  const sel=$('exploreMode'); sel.value='ww2'; sel.dispatchEvent(new w.Event('change',{bubbles:true})); await sleep(900);
  console.log('ww2: mastery button visible', !$('masteryBtn').hidden, '| all grey', doc.querySelectorAll('#map .mst.none').length, 'coloured', doc.querySelectorAll('#map .mst:not(.none)').length);
  sel.value='geo'; sel.dispatchEvent(new w.Event('change',{bubbles:true})); await sleep(900);
  console.log('geo: mastery button hidden', $('masteryBtn').hidden, '| key hidden', $('masteryKey').hidden, '| shading', doc.querySelectorAll('#map .mst').length);
  if(!$('masteryBtn').hidden || doc.querySelectorAll('#map .mst').length) errors.push('mastery leaks into geo');
  sel.value='modern'; sel.dispatchEvent(new w.Event('change',{bubbles:true})); await sleep(900);
  click($('masteryBtn')); await sleep(30);
  console.log('mastery off: shading', doc.querySelectorAll('#map .mst').length, '| capitals back', [...doc.querySelectorAll('#map .plabel text')].some(t=>/\(Nairobi\)|\(Paris\)/.test(t.textContent)));
  console.log('errors',errors); process.exit(0);
})();
