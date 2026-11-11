const {JSDOM}=require('jsdom'); const fs=require('fs');
let html=fs.readFileSync('../pinpoint.html','utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[]; const exp=JSON.parse(fs.readFileSync('../scripts/flags/uploaded_realm_flags3.json','utf8'));
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:true,addListener(){},removeListener(){}});w.addEventListener('error',e=>errors.push(e.message));}});
const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const find=n=>[...doc.querySelectorAll('#map path.country')].find(p=>p.__data__.properties.name===n);
const cases={
 wwi:[['Montenegro','Montenegro'],['Afghanistan','Afghanistan'],['Tibet','Tibet'],['Mongolia','Mongolia'],['Mexico','Mexico'],['Australia','Australia'],['Manchu Empire','China (Republic of China)']],
 ww2:[['Afghanistan','Afghanistan'],['Albania','Albania'],['Mongolia','Mongolia'],['Tibet','Tibet'],['Manchuria','Manchuria'],['Germany (USA)','Germany (U.S. zone)'],['Germany (UK)','Germany (British zone)'],['Germany (France)','Germany (French zone)'],['Germany (Soviet)','Germany (Soviet zone)'],['Korea (USA)','Korea (U.S. zone)'],['Korea (USSR)','Korea (Soviet zone)']],
 coldwar:[['Afghanistan','Afghanistan'],['Albania','Albania'],['Mongolia','Mongolia'],['Tibet','Tibet'],['Laos','Laos'],['Cambodia','Cambodia'],['Sri Lanka','Ceylon (Sri Lanka)'],['Zaire','Congo (L\u00e9opoldville)']]
};
(async()=>{
  await sleep(200); click($('tabExplore'));
  for(const [mode,list] of Object.entries(cases)){
    const s=$('exploreMode'); s.value=mode; s.dispatchEvent(new w.Event('change',{bubbles:true})); await sleep(10);
    const res=list.map(([k,d])=>{ const e=find(k); if(!e) return d+': NOT ON MAP'; click(e);
      const img=[...doc.querySelectorAll('#map g.pfill image')].filter(i=>i.closest('g.pfill')&&i.closest('g.pfill').getAttribute('data-key')===k).pop() || [...doc.querySelectorAll('#map g.pfill image')].pop();
      const g=[...doc.querySelectorAll('#map g.pfill')].find(x=>x.getAttribute('data-key')===k);
      const href=g&&g.querySelector('image')&&g.querySelector('image').getAttribute('href');
      const want=exp[mode+'|'+d];
      return d+': '+(want ? (href===want ? 'NEW FLAG' : (href?'other flag (not the new one)':'no flag')) : (href?'flag':'badges/none')); });
    console.log(mode.padEnd(8),res.join(' | '));
  }
  console.log('errors',errors); process.exit(0);
})();
