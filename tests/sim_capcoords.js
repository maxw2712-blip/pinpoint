// every pre-1914 capital with a firelight glow should sit inside or near its own realm (the simplified borders put a few
// real capitals up to ~1500 km off, e.g. Gurganj outside the 1200 Khwarazmian shape; over 2000 km means a typo)
const fs=require('fs'), d3=require('d3'), topojson=require('topojson-client');
const S='../src/data/', J=f=>JSON.parse(fs.readFileSync(S+f,'utf8'));
const C=J('CAPCOORDS.json'), H=Object.assign({}, J('HIST.json'), J('HIST2.json'), J('HIST3.json'), J('HIST4.json'));
const packs=Object.assign({}, ...['PACKS','PACKS2','PACKS3','PACKS4'].map(n=>J('maps/'+n+'.json')));
const errors=[], far=[];
let n=0;
for(const p of ['bronze','classical','ancient','early','medieval','discovery','vienna']){
  const T=packs[p]; const fc=topojson.feature(T, T.objects[Object.keys(T.objects)[0]]);
  for(const [mn, dn, cap] of H[p]){
    if(!cap) continue; n++;
    const xy=C[cap]; if(!xy){ errors.push('no coords: '+cap); continue; }
    const fs_=fc.features.filter(f=>f.properties && f.properties.name===mn);
    if(!fs_.length){ errors.push(p+' no shape: '+mn); continue; }
    if(fs_.some(f=>d3.geoContains(f, xy))) continue;
    // distance in km to the nearest vertex of the realm
    let best=1e9; for(const f of fs_){ const g=f.geometry, polys=g.type==='Polygon'?[g.coordinates]:g.coordinates;
      for(const P of polys) for(const ring of P) for(const v of ring){ const d=d3.geoDistance(v, xy)*6371; if(d<best) best=d; } }
    far.push([Math.round(best), p, dn, cap]);
  }
}
far.sort((a,b)=>b[0]-a[0]);
console.log('capitals checked', n, '| outside their realm:', far.length);
far.forEach(f=>console.log('  ', f.join(' | ')));
far.filter(f=>f[0]>2000).forEach(f=>errors.push('capital far from realm: '+f.slice(1).join(' / ')+' ('+f[0]+' km)'));
console.log('errors', errors); process.exit(0);
