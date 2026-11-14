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
// Date this map: no names before the answer, scoring by distance, 10 different periods, end screen, back to normal games
const Y=new Date().getFullYear(), HI=Y+100, UMIN=Math.log(100), UMAX=Math.log(HI+1500);
const posToYear=p=>{ const y=Math.round(HI-Math.exp(UMAX-p*(UMAX-UMIN))); return y===0?1:y; };
const parseYear=t=>/BCE/.test(t)?-parseInt(t,10):parseInt(t,10);
(async()=>{
  await sleep(200);
  click($('settingsBtn')); click(doc.querySelector('#optNight .optBtn[data-v="all"]')); click($('stDone'));
  click($('tabDate')); await sleep(20);
  console.log('tab:', $('lede').textContent.slice(0,60)+'...', '| mode chips hidden', $('modeSet').hidden);
  for(const lv of [0,1,3]){
    click(doc.querySelector('#ticks button[data-i="'+lv+'"]')); click($('start')); await sleep(30);
    const seen=new Set(); let total=0, bad=0;
    for(let i=0;i<10;i++){
      const labelsBefore=doc.querySelectorAll('#map .plabel').length, flags=doc.querySelectorAll('#map .pfill').length;
      const themed=['era-parchment','era-night'].filter(c=>$('app').classList.contains(c));
      if(lv>0 && labelsBefore) errors.push('names shown before the answer');
      if(lv===0 && !labelsBefore) errors.push('Easy without names');
      if(themed.length) errors.push('era theme on while dating: '+themed);
      if(lv>0 && flags) errors.push('flags on level '+lv);
      const p=Math.random(); const r=$('dateRange'); r.value=String(Math.round(p*1000)); r.dispatchEvent(new w.Event('input',{bubbles:true}));
      const guess=parseYear($('dateYear').textContent);
      if(guess!==posToYear(Math.round(p*1000)/1000)) errors.push('slider year mismatch');
      const before=+$('score').textContent;
      click($('act')); await sleep(20);
      const ans=parseYear($('dateYear').textContent), pts=+$('score').textContent-before;
      const tol=Math.max(10,0.08*(Y-ans))*[1.5,1,0.75,0.75][lv], err=Math.abs(guess-ans);
      const want=err<=tol?3:err<=2.5*tol?2:err<=5*tol?1:0;
      if(pts!==want) bad++;
      seen.add(ans); total+=pts;
      if(!doc.querySelectorAll('#map .plabel').length) errors.push('no names after the answer');
      if(i<3 && lv===1) console.log(`  L${lv} q${i+1}: guessed ${guess}, answer ${ans}, ${err} off -> +${pts} | "${$('dateRes').textContent}"`);
      click($('act')); await sleep(20);
    }
    console.log(`level ${lv}: 10 rounds, ${seen.size} different years, score ${total}, scoring mismatches ${bad}, end screen ${!$('end').hidden}, log rows ${doc.querySelectorAll('#log li').length}, recap hidden ${$('recapWrap').hidden}, practice hidden ${$('practice').hidden}`);
    if(bad) errors.push('scoring mismatch'); if(seen.size!==10) errors.push('repeated period');
    if(lv===1) console.log('  log row:', doc.querySelector('#log li').textContent);
    click($('change')); await sleep(30);
  }
  console.log('back on setup: dating class off', !$('app').classList.contains('dating'), '| best saved', Object.keys(w.localStorage).filter(k=>k.includes('dating')));
  // Impossible: timer runs out without moving the slider -> 0 points
  click(doc.querySelector('#ticks button[data-i="3"]')); click($('start')); await sleep(30);
  console.log('impossible: timer visible', !$('timer').hidden, '| zoomed', doc.querySelector('#map > g').getAttribute('transform'));
  click($('home')); await sleep(5); click($('home')); await sleep(30);
  // a normal game afterwards works and has no slider
  click($('tabMap')); click(doc.querySelector('#ticks button[data-i="1"]')); click($('start')); await sleep(30);
  console.log('normal game after: slider hidden', $('dateCtl').hidden, '| question', $('qname').textContent, '| hint visible', w.getComputedStyle($('hint')).display!=='none');
  if(!$('dateCtl').hidden) errors.push('slider leaks into normal game');
  console.log('errors',errors); process.exit(0);
})();
