const {JSDOM}=require('jsdom'); const fs=require('fs');
const file=process.argv[2]||'../pinpoint.html';   // optional: another build to check
let html=fs.readFileSync(file,'utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const errors=[];
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:true,addListener(){},removeListener(){}});w.addEventListener('error',e=>errors.push(e.message));}});
const w=dom.window,doc=w.document,$=id=>doc.getElementById(id);
const click=el=>el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const find=n=>[...doc.querySelectorAll('#map path.country')].find(p=>p.__data__.properties.name===n);
function rects(){ return [...doc.querySelectorAll('#map g.plabel')].filter(g=>g.parentNode.style.display!=='none').map(g=>{ const m=g.getAttribute('transform').match(/translate\(([^,]+),([^)]+)\) scale\(([^)]+)\)/); const r=g.querySelector('rect.pbox'); const s=+m[3],x=+m[1],y=+m[2],ww=(+r.getAttribute('width'))*s,hh=(+r.getAttribute('height'))*s; return {n:g.querySelector('text').textContent,x0:x-ww/2,x1:x+ww/2,y0:y-hh/2,y1:y+hh/2}; }); }
function overlaps(){ const R=rects(); const bad=[]; for(let i=0;i<R.length;i++)for(let j=i+1;j<R.length;j++){ const a=R[i],b=R[j]; if(Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0)>0.5 && Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0)>0.5) bad.push(a.n+' x '+b.n); } return bad; }
(async()=>{
  await sleep(200);
  const sets={
   modern:['Belgium','Netherlands','Luxembourg','Germany','France','Switzerland','Austria','Czechia','Poland','Italy','Slovenia','Croatia','Hungary','Serbia','Romania','Bulgaria','Greece','Albania','Macedonia','Kosovo','Montenegro','Bosnia and Herz.','Slovakia','Denmark','Lithuania','Latvia','Estonia'],
   bronze:['Egypt','Hittites','Babylonia','Assyria','Elam','Greek city-states','Illyrians','Thrace','Kush','Arabian pastoral nomads','Iranian pastoralists','Dravidians','Vedic Aryans','Sinic','Zhoa','Tibetans','Burmese','Austro-Asiatic rice cultures','West African cereal farmers','Saharan pastoral nomads','Berbers','Ethiopian highland farmers','Khoisan','N. European Bronze Age cultures','Saami'],
   wwi:['German Empire','Austro-Hungarian Empire','Serbia','Bulgaria','Romania','Montenegro','Albania','Greece','Belgium','Netherlands','Luxembourg','Switzerland','Kingdom of Italy','France']
  };
  for(const [mode,names] of Object.entries(sets)){
    click($('tabExplore')); { const sel=$('exploreMode'); sel.value=mode; sel.dispatchEvent(new w.Event('change',{bubbles:true})); } await sleep(10);
    let tapped=0; for(const n of names){ const el=find(n); if(el){ click(el); tapped++; } }
    console.log(mode.padEnd(8),'labels',doc.querySelectorAll('#map g.plabel').length,'of',tapped,'tapped | overlapping label pairs:',overlaps().length, overlaps().slice(0,4).join(', '));
    click($('exploreHome')); await sleep(5);
  }
  console.log('errors',errors); process.exit(0);
})();
