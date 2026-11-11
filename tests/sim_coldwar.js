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
    click($('tabMap')); click(doc.querySelector('.seg[data-key="mode"] button[data-v="coldwar"]')); click(doc.querySelector('#ticks button[data-i="'+lv+'"]'));
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
  const NEW=['British Empire','French Empire','Belgian Empire','Portuguese Empire','Spanish Empire','Dutch Empire','Mali','Niger','Chad','Upper Volta','Dahomey','Togo','Ivory Coast','Senegal','Guinea','Mauritania','Somalia','Cameroon','Gabon','Congo (Brazzaville)','Central African Republic','Malagasy Republic (Madagascar)','Liberia','Federation of Malaya','Republic of China (Taiwan)','Muscat and Oman','Nepal','Bhutan','Luxembourg','Andorra','Haiti','Dominican Republic','Nicaragua','Costa Rica','Panama','Guatemala','Honduras','El Salvador','Bolivia','Paraguay','Ecuador','Uruguay'];
  console.log('1960 games: 32 (8 per level); distinct questions:',seen.size,'| question kinds:',[...kinds].join(' / '));
  ['Easy','Medium','Hard','Impossible'].forEach((l,i)=>{ const nw=[...new Set(byLv[i].map(q=>q.split(': ').slice(1).join(': ')).filter(n=>NEW.some(x=>n===x||n.indexOf(x+' and ')===0||n.indexOf(' and '+x)>0)))]; console.log(l.padEnd(10),'asked',byLv[i].length,'| new 1960 realms asked:',nw.join(', ')||'none'); });
  const empCap=[...seen].filter(n=>/Empire/.test(n)&&byLv[3].some(q=>/capital/i.test(q)&&q.includes(n)));
  console.log('capital questions about empires (should be none):',empCap.length);
  console.log('errors',errors); process.exit(0);
})();
