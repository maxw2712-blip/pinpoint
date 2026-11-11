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
  const seen=new Set(), byLv=[[],[],[],[]], kinds=new Set();
  for(let lv=0;lv<4;lv++){
    click($('tabMap')); click(doc.querySelector('.seg[data-key="mode"] button[data-v="wwi"]')); click(doc.querySelector('#ticks button[data-i="'+lv+'"]'));
    for(let rep=0;rep<8;rep++){
      click($('start')); await sleep(10);
      for(let i=0;i<10;i++){
        if($('hudTop').hidden) break;
        seen.add($('qname').textContent); byLv[lv].push($('kind').textContent+': '+$('qname').textContent); kinds.add($('kind').textContent);
        click($('act')); await sleep(5); click($('act')); await sleep(5);
        if(i<9 && $('hudTop').hidden) break;
      }
      await sleep(10);
      if(!$('end').hidden) click($('endHome')||$('change'));
      else click($('home'));
      await sleep(5);
    }
  }
  const NEW=['British Nyasaland','British Bechuanaland','British Gold Coast','British Somaliland','Italian Somaliland','Italian Eritrea','German Togoland','German Samoa','British Sierra Leone','British Gambia','British Uganda','British Swaziland','British Basutoland','British Guiana','British Honduras','British West Indies','French West Indies','Danish West Indies','Dutch Curaçao','Dutch Suriname','French Guiana','French Somaliland','Spanish Guinea','Spanish Morocco','Spanish Sahara (Río de Oro)','Portuguese Guinea','British Malta','British Hong Kong','British Fiji','Tonga (British protectorate)','Brunei (British protectorate)','Kuwait (British protectorate)','Qatar','Bhutan',"Nejd and Ha'il (central Arabia)",'British Arabia (Aden, Oman, Trucial States)','French Wallis and Futuna','Dominican Republic','Nicaragua','Costa Rica','Honduras','El Salvador'];
  console.log('1914 games: 32 (8 per level); distinct questions:',seen.size,'| question kinds:',[...kinds].join(' / '));
  ['Easy','Medium','Hard','Impossible'].forEach((l,i)=>{ const nw=[...new Set(byLv[i].map(q=>q.split(': ').slice(1).join(': ')).filter(n=>NEW.some(x=>n===x||n.indexOf(x+' and ')===0||n.indexOf(' and '+x)>0)))]; console.log(l.padEnd(10),'asked',byLv[i].length,'| new 1914 realms asked:',nw.join(', ')||'none'); });
  const empCap=[...seen].filter(n=>/British West Indies|French West Indies|British Arabia|Nejd|Bhutan/.test(n)&&byLv[3].some(q=>/capital/i.test(q)&&q.includes(n)));
  console.log('capital questions about realms without a capital (should be none):',empCap.length);
  console.log('errors',errors); process.exit(0);
})();
