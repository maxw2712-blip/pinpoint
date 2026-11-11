const d3=require('d3'),tc=require('topojson-client'),fs=require('fs');
const src=JSON.parse(fs.readFileSync('src/world_1945.geojson')).features;
const P=JSON.parse(fs.readFileSync('packs3.json')).ww2; const feats=tc.feature(P,P.objects.shapes).features;
const sc=src.map(f=>({f,c:d3.geoCentroid(f),a:d3.geoArea(f)}));
const used=new Set(); const rows=[];
feats.forEach((pf,i)=>{
  const c=d3.geoCentroid(pf), a=d3.geoArea(pf); let best=-1,bd=1e9;
  sc.forEach((s,j)=>{ const d=d3.geoDistance(c,s.c)+Math.abs(Math.log((a+1e-9)/(s.a+1e-9)))*0.02; if(d<bd){bd=d;best=j;} });
  const s=sc[best].f.properties; rows.push({i,named:!!(pf.properties&&pf.properties.name),pname:pf.properties&&pf.properties.name,src:s.NAME,subj:s.SUBJECTO,part:s.PARTOF,c,bd});
});
fs.writeFileSync('match45.json',JSON.stringify(rows));
const un=rows.filter(r=>!r.named);
console.log('unnamed shapes:',un.length,'| mean match distance',(un.reduce((a,r)=>a+r.bd,0)/un.length).toFixed(4));
const by={}; un.forEach(r=>{ const k=(r.subj||'(none)')+' / '+(r.part||''); (by[k]=by[k]||[]).push(r.src+'@'+r.c.map(x=>Math.round(x)).join(',')); });
Object.entries(by).sort((a,b)=>b[1].length-a[1].length).forEach(([k,v])=>console.log(k.padEnd(36),v.length,v.slice(0,6).join('; ')));
