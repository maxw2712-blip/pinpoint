/* Build src/img/lights.webp: city lights reprojected onto the game's map frame (Natural Earth 1, 960x500 map units at
   3 px per unit, same as relief.webp), lights only, as warm glows on transparency.
   Source: NASA "Earth's City Lights by DMSP, 1994-1995 (large)" (4800x2400 equirectangular, public domain,
   Wikimedia Commons). Usage (from tests/, which has d3): node ../scripts/make_lights.js <source.jpg> <out.webp> <sharp dir> */
const d3 = require(require.resolve('d3', {paths:[process.cwd()]})); const [src, out, sharpDir] = process.argv.slice(2); const sharp = require(sharpDir);
const W = 960, H = 500, S = 3, OW = W*S, OH = H*S;
const proj = d3.geoNaturalEarth1().fitExtent([[6,6],[W-6,H-6]], {type:'Sphere'});
(async () => {
  const {data, info} = await sharp(src).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const sw = info.width, sh = info.height, ch = info.channels;
  const px = (x, y) => { x = Math.max(0, Math.min(sw-1, x)); y = Math.max(0, Math.min(sh-1, y)); const i = (y*sw+x)*ch; return [data[i], data[i+1], data[i+2]]; };
  const outBuf = Buffer.alloc(OW*OH*4);
  for (let y = 0; y < OH; y++) for (let x = 0; x < OW; x++) {
    const m = [(x+0.5)/S, (y+0.5)/S], ll = proj.invert(m);
    if (!ll || isNaN(ll[0])) continue;
    const back = proj(ll); if (Math.hypot(back[0]-m[0], back[1]-m[1]) > 0.3) continue;   // outside the globe
    // bilinear sample of the light intensity (lights are warm white; the dim land base is blue, so use min(R,G))
    const fx = (ll[0]+180)/360*sw - 0.5, fy = (90-ll[1])/180*sh - 0.5, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx-x0, ty = fy-y0;
    const L = (p) => Math.max(0, (Math.min(p[0], p[1]) - 42) / 213);
    const v = L(px(x0,y0))*(1-tx)*(1-ty) + L(px(x0+1,y0))*tx*(1-ty) + L(px(x0,y0+1))*(1-tx)*ty + L(px(x0+1,y0+1))*tx*ty;
    if (v <= 0.004) continue;
    const a = Math.min(1, Math.pow(v, 0.75)*1.25), i = (y*OW+x)*4;
    outBuf[i] = 255; outBuf[i+1] = Math.round(206 + 40*v); outBuf[i+2] = Math.round(120 + 110*v); outBuf[i+3] = Math.round(a*255);
  }
  const r = await sharp(outBuf, {raw:{width:OW, height:OH, channels:4}}).webp({quality:70, alphaQuality:80}).toFile(out);
  console.log('wrote', out, r.width+'x'+r.height, r.size, 'bytes');
})();
