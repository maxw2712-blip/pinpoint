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
  const seen=new Set();
  for(let lv=0;lv<4;lv++){
    click($('tabMap')); click(doc.querySelector('.seg[data-key="mode"] button[data-v="ww2"]')); click(doc.querySelector('#ticks button[data-i="'+lv+'"]'));
    for(let rep=0;rep<3;rep++){
      click($('start')); await sleep(10);
      for(let i=0;i<10;i++){
        if($('hudTop').hidden) break;
        seen.add($('qname').textContent);
        click($('act')); await sleep(5); click($('act')); await sleep(5);
        if(i<9 && $('hudTop').hidden) break;
      }
      await sleep(10);
      if(!$('end').hidden) click($('endHome')||$('change'));
      else click($('home'));
      await sleep(5);
    }
  }
  const emp=[...seen].filter(n=>/Empire/.test(n));
  console.log('questions asked across 12 games:',seen.size,'| empire questions seen:',emp.join(', ')||'none');
  console.log('errors',errors); process.exit(0);
})();
