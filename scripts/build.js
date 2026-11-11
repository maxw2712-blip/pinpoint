const fs=require('fs');
const d3=require('d3');
const {topology}=require('topojson-server');
const {presimplify,simplify,quantile}=require('topojson-simplify');
const tc=require('topojson-client');
function mk(objects,q,p){ let t=topology(objects,q); t=presimplify(t); t=simplify(t,quantile(t,p)); return tc.quantize(t,q); }
function size(t){return Math.round(JSON.stringify(t).length/1024)+'KB';}
const rd=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const bad=f=>d3.geoArea(f)>2*Math.PI;
const out={};
out.modern=rd('package/countries-110m.json');

// build, drop features that invert after simplification, rebuild
function robust(objs,q,p,keyObj){
  for(let it=0;it<4;it++){
    const t=mk(objs,q,p);
    let any=false;
    for(const k of Object.keys(objs)){
      if(objs[k].type!=='FeatureCollection') continue;
      const fs_=tc.feature(t,t.objects[k]).features;
      const keep=[];
      fs_.forEach((f,i)=>{ if(f.geometry && /Polygon/.test(f.geometry.type) && bad(f)){ any=true; console.log('  dropping inverted',k,f.properties&&f.properties.name||'(unnamed)'); } else keep.push(objs[k].features[i]); });
      objs[k]={type:'FeatureCollection',features:keep};
    }
    if(!any) return t;
  }
  return mk(objs,q,p);
}
for (const [k,f] of [['ancient','work_ancient.geojson'],['medieval','work_medieval.geojson']]){
  out[k]=robust({shapes:rd(f)},1e4,0.92); console.log(k,size(out[k]));
}
const land=rd('package/land-50m.json');
const lf=tc.feature(land,land.objects.land);
let polys=[];
const geoms=lf.type==='FeatureCollection'?lf.features.map(x=>x.geometry):[lf.geometry];
geoms.forEach(g=>{ (g.type==='Polygon'?[g.coordinates]:g.coordinates).forEach(c=>{
  const ys=c[0].map(p=>p[1]); if(Math.max.apply(null,ys)>-60) polys.push(c); }); });
const landFC={type:'FeatureCollection',features:[{type:'Feature',properties:{},geometry:{type:'MultiPolygon',coordinates:polys}}]};
out.geo=robust({land:landFC,areas:rd('work_areas.geojson'),rivers:rd('work_rivers.geojson')},1e4,0.985);
console.log('geo',size(out.geo));
fs.writeFileSync('packs.json',JSON.stringify(out));
console.log('total',Math.round(fs.statSync('packs.json').size/1024)+'KB');
