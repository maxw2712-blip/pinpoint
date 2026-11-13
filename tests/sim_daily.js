// daily challenge: same questions for everyone on a day, one play a day, streaks, leaving early, spoiler-free share text
const {JSDOM}=require('jsdom'); const fs=require('fs');
let html=fs.readFileSync('../pinpoint.html','utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const pad=n=>String(n).padStart(2,'0'), key=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=new Date(), yest=new Date(); yest.setDate(yest.getDate()-1);
function boot(storage){
  let copied=null;
  const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){
    w.matchMedia=()=>({matches:false,addListener(){},removeListener(){}});
    w.addEventListener('error',e=>errors.push(e.message));
    for(const k in storage) w.localStorage.setItem(k, storage[k]);
    const noop=new Proxy(function(){},{get:(t,p)=>p==='measureText'?()=>({width:10}):noop,apply:()=>undefined,set:()=>true});
    w.HTMLCanvasElement.prototype.getContext=()=>noop;
    w.HTMLCanvasElement.prototype.toBlob=cb=>cb(null);
    Object.defineProperty(w.navigator,'clipboard',{value:{writeText:t=>{copied=t;return Promise.resolve();}}});
  }});
  const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
  return {w,doc,$,click:el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true})),copied:()=>copied};
}
async function playDaily(B, stopAfter){
  const {$,click}=B; await sleep(200);
  const title=$('dailyTitle').textContent, btn=$('dailyBtn').textContent;
  click($('dailyBtn')); await sleep(20);
  const qs=[], mode=$('kind').textContent;
  for(let i=0;i<10;i++){
    if(stopAfter!==undefined && i===stopAfter){ click($('home')); await sleep(5); click($('home')); await sleep(20); break; }
    qs.push($('qname').textContent); click($('act')); await sleep(5); click($('act')); await sleep(5);
  }
  await sleep(30);
  return {title, btn, qs, mode};
}
(async()=>{
  const A=boot({}); const a=await playDaily(A);
  console.log('strip before:', a.title, '| button', a.btn);
  console.log('run 1 questions:', a.qs.join(', '));
  console.log('end screen:', A.$('best2').textContent, '| Play again hidden', A.$('again').hidden);
  const D1=JSON.parse(A.w.localStorage.getItem('pinpoint:daily'));
  console.log('saved:', JSON.stringify(D1.days[key(today)]), 'streak', D1.streak);
  // same day, another player (fresh storage) -> same questions
  const B=boot({}); const b=await playDaily(B);
  const same=JSON.stringify(a.qs)===JSON.stringify(b.qs);
  console.log('another player, same questions =', same); if(!same) errors.push('daily questions differ between players');
  // a second play the same day is not allowed: the button shares instead
  A.click(A.$('change')); await sleep(30);
  console.log('after: strip', A.$('dailyTitle').textContent, '|', A.$('dailySub').textContent, '| button', A.$('dailyBtn').textContent);
  if(A.$('dailyBtn').textContent!=='Share') errors.push('can play twice');
  A.click(A.$('dailyBtn')); await sleep(60);
  const txt=A.copied();
  console.log('share text:\n'+txt);
  if(!txt || a.qs.some(n=>n && txt.includes(n))) errors.push('share text missing or spoils a place name');
  // setup restored: back on the player's own map and level
  console.log('setup restored: Medium on =', A.doc.querySelector('#ticks button.on').textContent);
  // streak: played yesterday with a 4-day streak -> 5 today
  const C=boot({'pinpoint:daily':JSON.stringify({last:key(yest),streak:4,best:4,days:{[key(yest)]:{n:0,mode:'modern',log:[3,3,3,3,3,3,3,3,3,3],done:true}}})});
  await sleep(200); console.log('streak shown before playing (yesterday counts):', C.$('dailyStreak').textContent);
  await playDaily(C); const D3=JSON.parse(C.w.localStorage.getItem('pinpoint:daily'));
  console.log('streak after playing today:', D3.streak, 'best', D3.best); if(D3.streak!==5) errors.push('streak not continued');
  // a gap breaks the streak
  const old=new Date(); old.setDate(old.getDate()-3);
  const E=boot({'pinpoint:daily':JSON.stringify({last:key(old),streak:7,best:7,days:{}})});
  await sleep(200); console.log('3 days ago, streak shown:', JSON.stringify(E.$('dailyStreak').textContent), 'hidden', E.$('dailyStreak').hidden);
  await playDaily(E); const D4=JSON.parse(E.w.localStorage.getItem('pinpoint:daily'));
  console.log('after playing: streak', D4.streak, 'best', D4.best); if(D4.streak!==1||D4.best!==7) errors.push('gap handling wrong');
  // leaving after 3 questions counts the rest as missed
  const F=boot({}); await playDaily(F, 3); const D5=JSON.parse(F.w.localStorage.getItem('pinpoint:daily'));
  const r=D5.days[key(today)];
  console.log('left after 3: log', JSON.stringify(r.log), 'done', r.done, '| strip button', F.$('dailyBtn').textContent);
  if(!r.done||r.log.length!==10) errors.push('leaving early not settled');
  console.log('errors',errors); process.exit(0);
})();
