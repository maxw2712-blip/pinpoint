const fs=require('fs'); const d3=require('d3');
const {topology}=require('topojson-server'); const {presimplify,simplify,quantile}=require('topojson-simplify'); const tc=require('topojson-client');
function mk(objects,q,p){ let t=topology(objects,q); t=presimplify(t); t=simplify(t,quantile(t,p)); return tc.quantize(t,q); }
const rd=f=>JSON.parse(fs.readFileSync(f,'utf8')); const bad=f=>d3.geoArea(f)>2*Math.PI;
function robust(objs,q,p){
  for(let it=0;it<4;it++){
    const t=mk(objs,q,p); let any=false;
    for(const k of Object.keys(objs)){
      const fs_=tc.feature(t,t.objects[k]).features, keep=[];
      fs_.forEach((f,i)=>{ if(f.geometry && /Polygon/.test(f.geometry.type) && bad(f)){ any=true; console.log('  dropping inverted',f.properties&&f.properties.name||'(unnamed)'); } else keep.push(objs[k].features[i]); });
      objs[k]={type:'FeatureCollection',features:keep};
    }
    if(!any) return t;
  }
  return mk(objs,q,p);
}
const out={};
for(const id of ['bronze']){
  out[id]=robust({shapes:rd(`work_${id}.geojson`)},1e4,0.92);
  console.log(id,Math.round(JSON.stringify(out[id]).length/1024)+'KB');
}
fs.writeFileSync('packs_bronze.json',JSON.stringify(out));
// preview svg of 1914 and 1500 for a quick look
const W=960,H=500,proj=d3.geoNaturalEarth1().fitExtent([[6,6],[W-6,H-6]],{type:'Sphere'}),path=d3.geoPath(proj);
for(const id of ['wwi','discovery','classical','early']){
  const f=tc.feature(out[id],out[id].objects.shapes).features;
  fs.writeFileSync(`pv3_${id}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#cfe3ea"/>`+f.map(x=>`<path d="${path(x)}" fill="${x.properties.name?'#f0b400':'#86aab0'}" stroke="#0d2a3a" stroke-width=".4"/>`).join('')+'</svg>');
}
