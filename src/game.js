(function(){
'use strict';

var W = 960, H = 500;
var PACKS = __JSON__("data/maps/PACKS.json");
var HIST = __JSON__("data/HIST.json");
var PACKS2 = __JSON__("data/maps/PACKS2.json");
Object.keys(PACKS2).forEach(function(k){ PACKS[k] = PACKS2[k]; });
var HIST2 = __JSON__("data/HIST2.json");
Object.keys(HIST2).forEach(function(k){ HIST[k] = HIST2[k]; });
var FAME_HIST2 = __JSON__("data/FAME_HIST2.json");

/* ---------- Modern table: [atlas name, capital, region code, display name] ---------- */
var R = {A:'Africa', E:'Europe', S:'Asia', M:'Americas', O:'Oceania'};
var RAW = [
  ["Fiji","Suva","O"],["Papua New Guinea","Port Moresby","O"],["Vanuatu","Port Vila","O"],
  ["Solomon Is.","Honiara","O","Solomon Islands"],["New Zealand","Wellington","O"],["Australia","Canberra","O"],

  ["Kazakhstan","Astana","S"],["Uzbekistan","Tashkent","S"],["Indonesia","Jakarta","S"],["Timor-Leste","Dili","S"],
  ["Israel",null,"S"],["Lebanon","Beirut","S"],["Jordan","Amman","S"],["United Arab Emirates","Abu Dhabi","S"],
  ["Qatar","Doha","S"],["Kuwait","Kuwait City","S"],["Iraq","Baghdad","S"],["Oman","Muscat","S"],
  ["Cambodia","Phnom Penh","S"],["Thailand","Bangkok","S"],["Laos","Vientiane","S"],["Myanmar","Naypyidaw","S"],
  ["Vietnam","Hanoi","S"],["North Korea","Pyongyang","S"],["South Korea","Seoul","S"],["Mongolia","Ulaanbaatar","S"],
  ["India","New Delhi","S"],["Bangladesh","Dhaka","S"],["Bhutan","Thimphu","S"],["Nepal","Kathmandu","S"],
  ["Pakistan","Islamabad","S"],["Afghanistan","Kabul","S"],["Tajikistan","Dushanbe","S"],["Kyrgyzstan","Bishkek","S"],
  ["Turkmenistan","Ashgabat","S"],["Iran","Tehran","S"],["Syria","Damascus","S"],["Armenia","Yerevan","S"],
  ["Turkey","Ankara","S"],["Sri Lanka","Sri Jayawardenepura Kotte","S"],["China","Beijing","S"],["Taiwan","Taipei","S"],
  ["Azerbaijan","Baku","S"],["Georgia","Tbilisi","S"],["Philippines","Manila","S"],["Malaysia","Kuala Lumpur","S"],
  ["Brunei","Bandar Seri Begawan","S"],["Japan","Tokyo","S"],["Yemen","Sana\u2019a","S"],["Saudi Arabia","Riyadh","S"],

  ["Russia","Moscow","E"],["Norway","Oslo","E"],["France","Paris","E"],["Sweden","Stockholm","E"],["Belarus","Minsk","E"],
  ["Ukraine","Kyiv","E"],["Poland","Warsaw","E"],["Austria","Vienna","E"],["Hungary","Budapest","E"],["Moldova","Chi\u0219in\u0103u","E"],
  ["Romania","Bucharest","E"],["Lithuania","Vilnius","E"],["Latvia","Riga","E"],["Estonia","Tallinn","E"],["Germany","Berlin","E"],
  ["Bulgaria","Sofia","E"],["Greece","Athens","E"],["Albania","Tirana","E"],["Croatia","Zagreb","E"],["Switzerland","Bern","E"],
  ["Luxembourg","Luxembourg City","E"],["Belgium","Brussels","E"],["Netherlands","Amsterdam","E"],["Portugal","Lisbon","E"],
  ["Spain","Madrid","E"],["Ireland","Dublin","E"],["Italy","Rome","E"],["Denmark","Copenhagen","E"],["United Kingdom","London","E"],
  ["Iceland","Reykjav\u00edk","E"],["Slovenia","Ljubljana","E"],["Finland","Helsinki","E"],["Slovakia","Bratislava","E"],
  ["Czechia","Prague","E"],["Cyprus","Nicosia","E"],["Bosnia and Herz.","Sarajevo","E","Bosnia and Herzegovina"],
  ["Macedonia","Skopje","E","North Macedonia"],["Serbia","Belgrade","E"],["Montenegro","Podgorica","E"],["Kosovo","Pristina","E"],

  ["Canada","Ottawa","M"],["United States of America","Washington, D.C.","M","United States"],["Argentina","Buenos Aires","M"],
  ["Chile","Santiago","M"],["Haiti","Port-au-Prince","M"],["Dominican Rep.","Santo Domingo","M","Dominican Republic"],
  ["Bahamas","Nassau","M"],["Mexico","Mexico City","M"],["Uruguay","Montevideo","M"],["Brazil","Bras\u00edlia","M"],
  ["Bolivia","Sucre","M"],["Peru","Lima","M"],["Colombia","Bogot\u00e1","M"],["Panama","Panama City","M"],
  ["Costa Rica","San Jos\u00e9","M"],["Nicaragua","Managua","M"],["Honduras","Tegucigalpa","M"],["El Salvador","San Salvador","M"],
  ["Guatemala","Guatemala City","M"],["Belize","Belmopan","M"],["Venezuela","Caracas","M"],["Guyana","Georgetown","M"],
  ["Suriname","Paramaribo","M"],["Ecuador","Quito","M"],["Jamaica","Kingston","M"],["Cuba","Havana","M"],
  ["Paraguay","Asunci\u00f3n","M"],["Trinidad and Tobago","Port of Spain","M"],

  ["Tanzania","Dodoma","A"],["Dem. Rep. Congo","Kinshasa","A","DR Congo"],["Somalia","Mogadishu","A"],["Kenya","Nairobi","A"],
  ["Sudan","Khartoum","A"],["Chad","N\u2019Djamena","A"],["South Africa","Pretoria","A"],["Lesotho","Maseru","A"],
  ["Zimbabwe","Harare","A"],["Botswana","Gaborone","A"],["Namibia","Windhoek","A"],["Senegal","Dakar","A"],["Mali","Bamako","A"],
  ["Mauritania","Nouakchott","A"],["Benin","Porto-Novo","A"],["Niger","Niamey","A"],["Nigeria","Abuja","A"],
  ["Cameroon","Yaound\u00e9","A"],["Togo","Lom\u00e9","A"],["Ghana","Accra","A"],["C\u00f4te d'Ivoire","Yamoussoukro","A","C\u00f4te d\u2019Ivoire"],
  ["Guinea","Conakry","A"],["Guinea-Bissau","Bissau","A"],["Liberia","Monrovia","A"],["Sierra Leone","Freetown","A"],
  ["Burkina Faso","Ouagadougou","A"],["Central African Rep.","Bangui","A","Central African Republic"],
  ["Congo","Brazzaville","A","Republic of the Congo"],["Gabon","Libreville","A"],["Eq. Guinea","Malabo","A","Equatorial Guinea"],
  ["Zambia","Lusaka","A"],["Malawi","Lilongwe","A"],["Mozambique","Maputo","A"],["eSwatini","Mbabane","A","Eswatini"],
  ["Angola","Luanda","A"],["Burundi","Gitega","A"],["Madagascar","Antananarivo","A"],["Gambia","Banjul","A"],
  ["Tunisia","Tunis","A"],["Algeria","Algiers","A"],["Eritrea","Asmara","A"],["Morocco","Rabat","A"],["Egypt","Cairo","A"],
  ["Libya","Tripoli","A"],["Ethiopia","Addis Ababa","A"],["Djibouti","Djibouti","A"],["Uganda","Kampala","A"],
  ["Rwanda","Kigali","A"],["S. Sudan","Juba","A","South Sudan"]
];
var EXTRA = {'W. Sahara':'Western Sahara','Falkland Is.':'Falkland Islands','Fr. S. Antarctic Lands':'French Southern Lands','N. Cyprus':'Northern Cyprus'};

var REGION_BOX = {
  World:null,
  Africa:[[-20,-36],[52,38]],
  Europe:[[-25,34],[45,72]],
  Asia:[[25,-11],[150,55]],
  Americas:[[-170,-58],[-30,72]],
  Oceania:[[105,-50],[180,5]]
};

var RELIEF = __IMAGE__("img/relief.webp");
var PIMG = __IMAGES__("img/planets");
/* Planets mode is archived (Max, 2026-11-13): build.py leaves the planet textures out unless run with --planets, and
   with no textures the Planets tab, its Explore option and its credit line are removed. All planet code and data stay. */
var PLANETS_ON = Object.keys(PIMG).length > 0;
if(!PLANETS_ON) document.querySelectorAll('.planetsOnly').forEach(function(e){ e.remove(); });
var PFEATS = __JSON__("data/PFEATS.json");
var BODIES = {mars:{R:3389.5, label:'Mars', short:'Mars'}, moon:{R:1737.4, label:'the Moon', short:'Moon'}, venus:{R:6051.8, label:'Venus', short:'Venus'}};
var FLAGS = __IMAGES__("flags/modern");
var HFLAGS = __JSON__("data/HFLAGS.json");
var FAME = __JSON__("data/FAME.json");
FAME.H = {ancient:FAME.A, medieval:FAME.D};
Object.keys(FAME_HIST2).forEach(function(k){ FAME.H[k] = FAME_HIST2[k]; });
var PACKS3 = __JSON__("data/maps/PACKS3.json");
Object.keys(PACKS3).forEach(function(k){ PACKS[k] = PACKS3[k]; });
var HIST3 = __JSON__("data/HIST3.json");
Object.keys(HIST3).forEach(function(k){ HIST[k] = HIST3[k]; });
FAME.H.bronze = {"order": ["Egypt", "Hittites", "Greek city-states", "Babylonia", "Sinic", "Assyria", "Elam", "Kush", "Olmec", "Vedic Aryans", "Dravidians", "Thrace", "Illyrians", "N. European Bronze Age cultures", "Late Jomon culture", "Austronesians", "Berbers", "Tibetans", "Khoisan"], "last": ["Saami", "Burmese", "Chorrera", "El Paraiso", "Poverty point culture", "Zhoa", "Karasuk culture", "Iranian pastoralists", "Arabian pastoral nomads", "Proto-Altaic pastoralists", "Saharan pastoral nomads", "West African cereal farmers", "Ethiopian highland farmers"]};
var PACKS4 = __JSON__("data/maps/PACKS4.json");
Object.keys(PACKS4).forEach(function(k){ PACKS[k] = PACKS4[k]; });
var HIST4 = __JSON__("data/HIST4.json");
Object.keys(HIST4).forEach(function(k){ HIST[k] = HIST4[k]; });
var FAME_H4 = __JSON__("data/FAME_H4.json");
Object.keys(FAME_H4).forEach(function(k){ FAME.H[k] = FAME_H4[k]; });
var SEC = __JSON__("data/SEC.json");
var CHOKES = __JSON__("data/CHOKES.json");
var FAMOUS_GEO = {}, FAMOUS_PL = {}, ICONIC_GEO = {}, ICONIC_PL = {}, TOP_GEO = {}, TOP_PL = {};
// how much of each pack counts as Easy (the very best-known slice)
var EASY_FRAC = {modern:0.18, flags:0.18, bronze:0.15, classical:0.15, ancient:0.16, early:0.15, medieval:0.17, discovery:0.16, wwi:0.17, vienna:0.16, ww2:0.17, coldwar:0.17, geo:0.14, planets:0.13};
// periods whose famous realms are so few that Easy is a short game
var EASY_COUNT = {bronze:6, classical:6, ancient:6, early:8};
FAME.G.forEach(function(n){ FAMOUS_GEO[n] = 1; });
FAME.P.forEach(function(n){ FAMOUS_PL[n] = 1; });
FAME.G2.forEach(function(n){ ICONIC_GEO[n] = 1; });
FAME.P2.forEach(function(n){ ICONIC_PL[n] = 1; });
FAME.G3.forEach(function(n){ TOP_GEO[n] = 1; });
FAME.P3.forEach(function(n){ TOP_PL[n] = 1; });
var TRIVIA = __JSON__("data/TRIVIA.json");
var RFLAGS = __IMAGES__("flags/realms");
/* flags that differ by period are keyed "period|name", so Afghanistan or Mongolia can fly a different flag in each era */
['British Empire:United Kingdom','French Empire:France','Belgian Empire:Belgium','Portuguese Empire:Portugal','Spanish Empire:Spain','Dutch Empire:Netherlands'].forEach(function(pr){
  // each period's empire flies that period's flag of the ruling country (e.g. Franco's Spain for 1945 and 1960)
  var a = pr.split(':');
  ['ww2','coldwar'].forEach(function(per){
    var src = RFLAGS[per+'|'+a[1]] || RFLAGS[a[1]] || FLAGS[a[1]];
    if(src) RFLAGS[per+'|'+a[0]] = src;
  });
});
// "name:modern flag key" when the modern flag is filed under another name
// (Bhutan is left out: it had no national flag until 1949)
['Haiti','Dominican Republic:Dominican Rep.','Nicaragua','Costa Rica','Guatemala','Honduras','El Salvador','Panama','Bolivia','Paraguay','Uruguay','Ecuador','Liberia','Iceland','Luxembourg','Andorra','Mexico','Yemen','Oman'].forEach(function(n){
  var a = n.split(':'); if(FLAGS[a[1] || a[0]]) RFLAGS['ww2|'+a[0]] = FLAGS[a[1] || a[0]];
});
// 1960: states whose flag at the end of 1960 is the one they fly today (the others have their own files in flags/realms)
['Niger','Chad','Central African Republic:Central African Rep.','Malagasy Republic (Madagascar):Madagascar','Dahomey:Benin','Togo',
 "Ivory Coast:C\u00f4te d'Ivoire",'Congo (Brazzaville):Congo','Gabon','Senegal','Guinea','Liberia','Somalia','Haiti',
 'Dominican Republic:Dominican Rep.','Nicaragua','Costa Rica','Panama','Guatemala','Honduras','El Salvador','Bolivia','Paraguay',
 'Ecuador','Uruguay','Luxembourg','Mexico','Republic of China (Taiwan):Taiwan'].forEach(function(n){
  var a = n.split(':'); if(FLAGS[a[1] || a[0]]) RFLAGS['coldwar|'+a[0]] = FLAGS[a[1] || a[0]];
});
// 1914: colonies fly the ruling power's flag; independent states use their modern flag where it matches the 1914 one
[['United Kingdom', ['British Nyasaland','British Bechuanaland','British Gold Coast','British Somaliland','British Sierra Leone',
  'British Gambia','British Uganda','British Swaziland','British Basutoland','British Guiana','British Honduras','British West Indies',
  'British Malta','Brunei (British protectorate)','British Hong Kong','British Fiji','British Arabia (Aden, Oman, Trucial States)']],
 ['German Empire', ['German Togoland','German Samoa','German New Guinea']], ['Italy', ['Italian Eritrea','Italian Somaliland']],
 ['France', ['French Guiana','French Somaliland','French West Indies','French Wallis and Futuna']],
 ['Spain', ['Spanish Guinea','Spanish Morocco','Spanish Sahara (R\u00edo de Oro)']], ['Portugal', ['Portuguese Guinea']],
 ['Netherlands', ['Dutch Suriname','Dutch Cura\u00e7ao']], ['Denmark', ['Danish West Indies']],
 ['Dominican Rep.', ['Dominican Republic']], ['Nicaragua', ['Nicaragua']], ['Costa Rica', ['Costa Rica']],
 ['Honduras', ['Honduras']], ['El Salvador', ['El Salvador']]].forEach(function(pr){
  var src = RFLAGS[pr[0]] || FLAGS[pr[0]];
  if(src) pr[1].forEach(function(dn){ RFLAGS['wwi|'+dn] = src; });
});
// 1815: colonies fly the ruling power's flag (the Bourbon white flag for France)
[['United Kingdom', ['British West Indies','British Ceylon','British Sierra Leone','British New South Wales']],
 ['Netherlands', ['United Kingdom of the Netherlands','Dutch Guiana (Suriname)','Dutch Cura\u00e7ao','Dutch East Indies']],
 ['Kingdom of France', ['French West Indies','French Senegal']],
 ['Portugal', ['Portuguese Angola','Portuguese Mozambique','Portuguese Goa','Portuguese Guinea']],
 ['Spain', ['Spanish Philippines']], ['Sweden\u2013Norway', ['Swedish Saint Barth\u00e9lemy']]].forEach(function(pr){
  var src = RFLAGS[pr[0]] || FLAGS[pr[0]];
  if(src) pr[1].forEach(function(dn){ RFLAGS['vienna|'+dn] = src; });
});
// realms that flew another realm's flag: Soviet-zone Korea used the same flag as the U.S. zone (Max's choice), Finland
// flew the Russian flag, Xinjiang the Republic of China's, the Cape was British after 1814
[['ww2|Korea (Soviet zone)', 'ww2|Korea (U.S. zone)'], ['wwi|Grand Duchy of Finland', 'Russian Empire'],
 ['wwi|Xinjiang', 'wwi|China (Republic of China)'], ['wwi|Australian Papua', 'wwi|Australia'], ['ww2|Xinjiang', 'China'], ['vienna|Cape Colony', 'United Kingdom']].forEach(function(pr){
  if(RFLAGS[pr[1]]) RFLAGS[pr[0]] = RFLAGS[pr[1]];
});
var PARCHMENT_ERAS = ['bronze','classical','ancient','early','medieval'];
/* ---------- Menu header: a small globe turning slowly (paused whenever the menu is hidden; still with reduced motion) ---------- */
var globe = (function(){
  var cv = document.getElementById('globe'); if(!cv || !cv.getContext) return null;
  // the canvas context is only asked for once the globe has a size on screen (never in a layout-less test environment)
  var ctx = null, land = null, grat = d3.geoGraticule10(), proj0 = d3.geoOrthographic().clipAngle(90), gp = null;
  var lam = -15, last = 0, running = false, colors = null, colorsAt = 0, size = 0;
  function readColors(){
    var cs = getComputedStyle(cv);
    colors = {sea:cs.getPropertyValue('--globe-sea').trim()||'#7fb8cf', sea2:cs.getPropertyValue('--globe-sea2').trim()||'#4f8fae',
              land:cs.getPropertyValue('--globe-land').trim()||'#e9f1e4', line:cs.getPropertyValue('--globe-line').trim()||'#0d2a3a'};
  }
  function fit(){
    var r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio||1), px = Math.round(r.width);
    if(!px) return false;
    if(!ctx){ try{ ctx = cv.getContext('2d'); }catch(e){} if(!ctx) return false; gp = d3.geoPath(proj0, ctx); }
    if(px!==size){ size = px; cv.width = cv.height = Math.round(px*dpr); ctx.setTransform(dpr,0,0,dpr,0,0); proj0.translate([px/2, px/2]).scale(px/2-1); }
    return true;
  }
  function draw(){
    if(!fit()) return;
    if(!land){ var t = PACKS.modern; land = topojson.merge(t, t.objects.countries.geometries); }
    if(!colors || performance.now()-colorsAt > 1000){ readColors(); colorsAt = performance.now(); }
    proj0.rotate([lam, -18, 0]);
    var r = size/2; ctx.clearRect(0, 0, size, size);
    var g = ctx.createRadialGradient(r*0.7, r*0.6, r*0.1, r, r, r);   // a soft highlight, so it reads as a sphere
    g.addColorStop(0, colors.sea); g.addColorStop(1, colors.sea2);
    ctx.beginPath(); gp({type:'Sphere'}); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); gp(grat); ctx.strokeStyle = colors.line; ctx.globalAlpha = .12; ctx.lineWidth = .6; ctx.stroke(); ctx.globalAlpha = 1;
    ctx.beginPath(); gp(land); ctx.fillStyle = colors.land; ctx.fill();
    ctx.beginPath(); gp({type:'Sphere'}); ctx.strokeStyle = colors.line; ctx.globalAlpha = .55; ctx.lineWidth = 1.2; ctx.stroke(); ctx.globalAlpha = 1;
  }
  function tick(t){
    var setup = document.getElementById('setup');
    if(!setup || setup.hidden || document.hidden){ running = false; return; }
    if(t-last > 50){ lam += (last ? (t-last) : 0)*0.006; last = t; draw(); }   // about 6 degrees a second, at most 20 frames a second
    requestAnimationFrame(tick);
  }
  function start(){
    if(reduce){ draw(); return; }
    if(running) return; running = true; last = 0; requestAnimationFrame(tick);
  }
  new MutationObserver(start).observe(document.getElementById('setup'), {attributes:true, attributeFilter:['hidden']});
  document.addEventListener('visibilitychange', start);
  window.addEventListener('resize', function(){ size = 0; if(reduce) draw(); });
  return {start:start};
})();

var LIGHTS = __IMAGE__("img/lights.webp");
function isNight(){
  if(!pack || pack.kind==='planet') return false;
  var mode = (typeof CFG!=='undefined' && CFG.night) || 'auto';
  if(mode==='off') return false;
  if(mode==='all') return true;
  if(pack.kind==='trivia') return false;
  return !!(pack.isSecurity || pack.id==='coldwar');
}
/* the night layers: a soft glow under the borders (the coastline on physical maps) and the city lights above the
   countries and flags; added or removed in place, so switching the setting mid-game keeps the game as it is */
function setNightLayers(on){
  g.selectAll('path.glowlines, .lights').remove();
  if(!on) return;
  var src = pack.kind==='political' ? pack.features : (pack.landF ? [pack.landF] : []);
  // the glow goes right after the graticule (a direct child on every map type), so it sits under all shapes
  var grat = g.node().querySelector(':scope > path.graticule'), next = grat ? grat.nextSibling : null;
  g.insert('path', next ? function(){ return next; } : null).attr('class','glowlines').attr('d', src.map(function(f){ return path(f) || ''; }).join(''));
  var after = fills && fills.node() ? fills.node().nextSibling : null;
  var before = after ? function(){ return after; } : null;
  g.select('defs').selectAll('.nightdef').remove();
  if(FIRE_ERAS.indexOf(pack.id)>=0){
    // no electric light yet: a warm glow at each capital
    var pts = [];
    Object.keys(pack.items).forEach(function(n){ var c = pack.items[n].cap, xy = c && CAPXY[c] && proj(CAPXY[c]); if(xy) pts.push(xy); });
    var gr = g.select('defs').append('radialGradient').attr('class','nightdef').attr('id','fireGlow');
    [[0,'#fff6d8',1],[.15,'#ffd27a',.95],[.4,'#ff9a3a',.5],[.7,'#ff7414',.16],[1,'#ff6a00',0]].forEach(function(s){
      gr.append('stop').attr('offset', s[0]).attr('stop-color', s[1]).attr('stop-opacity', s[2]); });
    var fg = g.insert('g', before).attr('class','lights fire');
    fg.selectAll('circle').data(pts).join('circle').attr('r', 7).attr('fill','url(#fireGlow)')
      .style('animation-delay', function(d, i){ return (-(i*0.37)%3).toFixed(2)+'s'; });
    fireScale(d3.zoomTransform(svg.node()).k);
    return;
  }
  var img = g.insert('image', before).attr('class','lights').attr('href', LIGHTS).attr('x',0).attr('y',0).attr('width',W).attr('height',H)
    .attr('preserveAspectRatio','none').attr('clip-path','url(#sphereClip)');
  var spec = ELECTRIC[pack.id];
  if(spec && pack.kind==='political'){
    // electric light only as far as it had spread by then
    var id = 'elecMask-'+pack.id;
    var m = g.select('defs').append('mask').attr('class','nightdef').attr('id', id).attr('maskUnits','userSpaceOnUse')
      .attr('x',0).attr('y',0).attr('width',W).attr('height',H);
    pack.features.forEach(function(f){
      var v = Math.round(255*elecLevel(spec, pack.items[f.properties.name]));
      if(v>0) m.append('path').attr('d', path(f)).attr('fill','rgb('+v+','+v+','+v+')');
    });
    img.attr('mask','url(#'+id+')');
  }
}
/* Night lights follow the period (Max's choice, 2026-11-12). Before electric light (Bronze Age to 1815) there are no
   city lights, only a faint flickering firelight at each realm's capital (coordinates in CAPCOORDS.json). 1914, 1945
   and 1960 show the 1994 satellite lights masked realm by realm to a rough electrification level for that year:
   industrial Europe, North America and later Japan first, most colonies and rural empires nearly dark. The modern
   map and Geography show the lights in full. */
var CAPXY = __JSON__("data/CAPCOORDS.json");
var FIRE_ERAS = ['bronze','classical','ancient','early','medieval','discovery','vienna'];
var ELECTRIC = {
  wwi: {base:{E:.2, S:.04, A:.03, M:.06, O:.05}, by:[
    [/^(United Kingdom|German Empire|Belgium|Netherlands|Switzerland|France|Denmark|Sweden|Norway|Luxembourg)$/, .45],
    [/^(Austria-Hungary|Italy)$/, .3], [/^(Russian Empire|Grand Duchy of Finland)$/, .15], [/^(United States|Canada)$/, .45],
    [/^Empire of Japan$/, .3], [/^(Australia|New Zealand)$/, .3], [/^(Argentina|Uruguay|Chile|Cuba)$/, .18],
    [/^(Mexico|Brazil)$/, .1], [/^Union of South Africa$/, .12], [/^(British Hong Kong|British Malta)$/, .3]]},
  ww2: {base:{E:.35, S:.07, A:.04, M:.15, O:.1}, by:[
    [/^(United Kingdom|Sweden|Switzerland|Netherlands|Belgium|Denmark|Norway|Luxembourg|Ireland|Iceland)$/, .55],
    [/^France$/, .45], [/^Germany \(/, .2], [/^(Poland|Yugoslavia)$/, .15], [/^Soviet Union$/, .25],
    [/^(United States|Canada)$/, .85], [/^Japan/, .15], [/^(Australia|New Zealand)$/, .5],
    [/^(Argentina|Uruguay|Chile|Cuba|Mexico|Brazil|Venezuela)$/, .25], [/^South Africa$/, .2], [/ Empire$/, .04]]},
  coldwar: {base:{E:.55, S:.12, A:.05, M:.25, O:.15}, by:[
    [/^(United States|Canada)$/, .95], [/^(United Kingdom|West Germany|Netherlands|Belgium|Switzerland|Sweden|Denmark|Norway|Luxembourg|France)$/, .8],
    [/^(East Germany|Czechoslovakia|Italy|Austria|Finland|Ireland|Iceland)$/, .65], [/^Soviet Union$/, .4], [/^Japan$/, .7],
    [/^(Australia|New Zealand)$/, .7], [/^(Israel|Kuwait)$/, .4], [/^(Argentina|Uruguay|Chile|Venezuela|Mexico|Cuba)$/, .4],
    [/^South Africa$/, .3], [/^(People's Republic of China|India)$/, .1], [/ Empire$/, .06]]}
};
function elecLevel(spec, it){
  if(!it) return 0;
  for(var i=0; i<spec.by.length; i++) if(spec.by[i][0].test(it.disp)) return spec.by[i][1];
  return spec.base[{Europe:'E', Asia:'S', Africa:'A', Americas:'M', Oceania:'O'}[it.reg]] || 0;
}
/* firelight glows grow only slowly as you zoom in, so crowded capitals (1815 Germany) stay apart */
function fireScale(k){
  g.selectAll('g.fire circle').attr('transform', function(d){ return 'translate('+d[0]+','+d[1]+') scale('+Math.pow(k, -0.75)+')'; });
}
/* in a night-theme game the map darkens after every question and the city lights come up */
function duskFor(i){ var n = (st.qs && st.qs.length) || 10; return Math.max(0, Math.min(1, i/Math.max(1, n-1))); }
function setDusk(v){ app.style.setProperty('--dusk', String(v)); }
/* period themes: night (Settings > Night map) wins over parchment; --dusk runs from 0 (dusk) to 1 (deep night) */
function applyTheme(){
  var night = isNight();
  app.classList.toggle('era-night', night);
  app.classList.toggle('era-parchment', !night && PARCHMENT_ERAS.indexOf(pack.id)>=0);
  setNightLayers(night);
}
var PAPER = __IMAGE__("img/paper.webp");
document.documentElement.style.setProperty('--paper', 'url("'+PAPER+'")');
var TERRITORY_FLAGS = {modern:['Greenland','Puerto Rico','New Caledonia','Falkland Is.','Fr. S. Antarctic Lands']};
var SCATTERED = {'British Empire':1, 'French Empire':1, 'Belgian Empire':1, 'Portuguese Empire':1, 'Spanish Empire':1, 'Dutch Empire':1};
function rflag(dn){ return RFLAGS[pack.id+'|'+dn] || RFLAGS[dn] || null; }
var ERAS = ['the ancient world','the Middle Ages','the early modern period','the 1800s','the 20th century or later'];
var ROUNDS = 10;
var LEVELS = [
  {id:'easy', label:'Easy', tries:3, pts:[3,2,1], hints:true, type:'find', band:['top',0.25], time:0},
  {id:'medium', label:'Medium', tries:3, pts:[3,2,1], hints:true, type:'find', band:['top',0.66], time:0},
  {id:'hard', label:'Hard', tries:2, pts:[3,1], hints:false, type:'find', band:['bottom',0.4], time:0},
  {id:'impossible', label:'Impossible', tries:1, pts:[3], hints:false, type:'tricky', band:['bottom',0.15], time:20}
];
var MODE_NOTE = {
  modern:'Today\u2019s countries and capitals.',
  vienna:'The world in 1815: Europe after Napoleon, the Qing and Ottoman empires, and a Latin America on the brink of independence.',
  ww2:'The world at the end of World War II in 1945, with Germany split into four occupation zones.',
  coldwar:'The world in 1960: the superpowers, the Iron Curtain and a wave of African independence.',
  security:'Alliances, nuclear powers, bases, flashpoints and the straits the world trades through. Click the answer on the map.',
  bronze:'The Late Bronze Age, around 1500 BCE: New Kingdom Egypt, the Hittites, Babylonia, Mycenaean Greece and Shang China.',
  classical:'The world around 500 BCE: Persia, the Greek city-states, Carthage, Zhou China and early India.',
  early:'The world around 800 CE: Charlemagne, the Abbasids, Tang China and the Vikings.',
  discovery:'The world around 1500: Ming China, the Ottomans, the Aztecs, the Incas and the Age of Exploration.',
  wwi:'The world in 1914: the great empires, their colonies and the eve of the First World War.',
  ancient:'The world around 100 CE: Rome, Han China, Parthia and their neighbors.',
  medieval:'The world around 1200 CE: Byzantines, Song China, the Mongol rise and more.',
  geo:'Rivers, mountains, deserts, seas and more. The map has no borders at all.',
  flags:'Name the country behind each flag. The harder levels include flags of countries that no longer exist.',
  history:'Ten trivia questions on ancient, medieval, early modern and modern history. No map needed.',
  planets:'Volcanoes, craters, plains and canyons across Mars, the Moon and Venus, mixed together on real imagery.'
};

/* ---------- Map shell ---------- */
var $ = function(id){ return document.getElementById(id); };
var app = $('app');
var svg = d3.select('#map').attr('viewBox','0 0 '+W+' '+H).attr('preserveAspectRatio','xMidYMid meet');
var proj = d3.geoNaturalEarth1().fitExtent([[6,6],[W-6,H-6]], {type:'Sphere'});
var path = d3.geoPath(proj);
var g = svg.append('g');
var zoom = d3.zoom().scaleExtent([1,60]).translateExtent([[0,0],[W,H]]).clickDistance(6)
  .on('zoom', function(e){
    g.attr('transform', e.transform);
    fireScale(e.transform.k);
    if(labels) labels.selectAll('g.plabel').attr('transform', function(d){ var k = e.transform.k, nom = d.nom || 1, s = d.fit ? (d.out ? Math.max(Math.min(nom/k, d.fit), (d.sp || 0.55)/k) : Math.min(nom/k, d.fit)) : 1/k; return 'translate('+d.x+','+d.y+') scale('+s+')'; });
  })
  .on('end', function(){ if(labelRecs.length) layoutLabels(); });
// label sizes depend on how large the map is drawn, so lay them out again after a resize or rotation
var resizeT = null;
window.addEventListener('resize', function(){ clearTimeout(resizeT); resizeT = setTimeout(function(){ if(labelRecs.length) layoutLabels(); }, 150); });
svg.call(zoom).on('dblclick.zoom', null);
svg.on('click.pick', function(ev){ physPick(ev); });

var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var DUR = reduce ? 0 : 700;

function viewFor(box){
  if(!box) return d3.zoomIdentity;
  var l=box[0][0], b=box[0][1], r=box[1][0], t=box[1][1], pts=[], i;
  for(i=0;i<=4;i++){
    var lon=l+(r-l)*i/4, lat=b+(t-b)*i/4;
    pts.push(proj([lon,b]), proj([lon,t]), proj([l,lat]), proj([r,lat]));
  }
  var xs=pts.map(function(p){return p[0];}), ys=pts.map(function(p){return p[1];});
  var x0=Math.min.apply(null,xs), x1=Math.max.apply(null,xs), y0=Math.min.apply(null,ys), y1=Math.max.apply(null,ys);
  var k=Math.min(8, 0.94/Math.max((x1-x0)/W,(y1-y0)/H));
  return d3.zoomIdentity.translate(W/2-k*(x0+x1)/2, H/2-k*(y0+y1)/2).scale(k);
}
function bigPart(f){
  if(!f.geometry || f.geometry.type!=='MultiPolygon') return f;
  var best=null, bestA=-1;
  f.geometry.coordinates.forEach(function(c){
    var poly={type:'Polygon',coordinates:c}, a=d3.geoArea(poly);
    if(a>bestA){bestA=a;best=poly;}
  });
  return best;
}
function moveTo(t, dur){
  svg.transition().duration(dur===undefined?DUR:dur).call(zoom.transform, t);
}

/* ---------- Packs ---------- */
var packs = {};
var pack = null, paths = null, marks = null, labels = null, fills = null, leads = null, curBody = 'mars';

function getPack(id){
  if(packs[id]) return packs[id];
  if(id==='history'){
    var HP = {id:'history', kind:'trivia', items:{}, size:{}, byName:{}, capCount:0, regCount:{}, noun:'question', past:false};
    TRIVIA.forEach(function(T,i){ HP.items['q'+i] = {disp:T.q, ans:T.a, tier:T.t}; });
    packs[id] = HP; return HP;
  }
  if(id==='security'){
    var M2 = getPack('modern'), S2 = {};
    Object.keys(M2).forEach(function(k){ S2[k] = M2[k]; });
    S2.id = 'security'; S2.isSecurity = true; S2.items = {}; S2.byName = {};
    Object.keys(M2.items).forEach(function(k){ S2.items[k] = M2.items[k]; });
    Object.keys(M2.byName).forEach(function(k){ S2.byName[k] = M2.byName[k]; });
    S2.chokeFeatures = [];
    Object.keys(CHOKES).forEach(function(n){
      var c = CHOKES[n], radDeg = c[2]/6371*180/Math.PI;
      var f = {type:'Feature', properties:{name:n}, geometry:d3.geoCircle().center([c[1], c[0]]).radius(radDeg).precision(3)()};
      S2.items[n] = {disp:n, choke:true, lat:c[0], lon:c[1], rad:c[2], reg:c[3]};
      S2.byName[n] = f; S2.chokeFeatures.push(f);
    });
    SEC.forEach(function(sq,i){
      var first = sq.a[0];
      var ansText = sq.a.slice(0,3).map(function(n){ return S2.items[n] ? S2.items[n].disp : n; }).join(', ') + (sq.a.length>3 ? ' and others' : '');
      S2.items['sq'+i] = {disp:sq.q, answers:sq.a, fact:sq.f, tier:sq.t, choke:sq.k==='p', ch:sq.k==='p' ? S2.items[first] : null, reg:(S2.items[first] ? S2.items[first].reg : ''), ansText:ansText};
    });
    packs[id] = S2; return S2;
  }
  if(id==='flags'){
    var M = getPack('modern'), F = {};
    Object.keys(M).forEach(function(k){ F[k] = M[k]; });
    F.id = 'flags'; F.isFlags = true; F.items = {};
    Object.keys(M.items).forEach(function(k){ F.items[k] = M.items[k]; });
    HFLAGS.forEach(function(h){ F.items[h.id] = {disp:h.disp, cap:null, reg:h.reg, hist:true, tier:h.tier, answers:h.answers}; });
    packs[id] = F; return F;
  }
  var P = {id:id, items:{}, size:{}, byName:{}};
  var t;
  if(id==='modern'){
    t = PACKS.modern;
    var geoms = t.objects.countries.geometries;
    var idx = geoms.map(function(x){ return x.properties.name; });
    var nb = topojson.neighbors(geoms);
    RAW.forEach(function(r){ P.items[r[0]] = {disp:r[3]||r[0], cap:r[1], reg:R[r[2]]}; });
    P.neighbors = {};
    idx.forEach(function(n,i){ P.neighbors[n] = nb[i].map(function(j){ return idx[j]; }).filter(function(m){ return P.items[m]; }); });
    P.features = topojson.feature(t, t.objects.countries).features.filter(function(f){ return f.properties.name!=='Antarctica'; });
    P.kind='political'; P.noun='country'; P.past=false;
  } else if(HIST[id]){
    t = PACKS[id];
    HIST[id].forEach(function(r){ P.items[r[0]] = {disp:r[1], cap:r[2], reg:R[r[3]]}; });
    P.features = topojson.feature(t, t.objects.shapes).features;
    P.kind='political'; P.noun=(id==='wwi' || id==='ww2' || id==='coldwar' ? 'country' : 'realm'); P.past=true;
  } else if(id==='planets'){
    P.kind='planet'; P.byBody = {};
    Object.keys(BODIES).forEach(function(bid){
      var Rk = BODIES[bid].R;
      P.byBody[bid] = [];
      PFEATS[bid].forEach(function(r){
        var rad = r[4], radDeg = rad/Rk*180/Math.PI, pts;
        if(r[5]){
          pts = [];
          for(var s=1; s<r[5].length; s++){
            var a = r[5][s-1], b = r[5][s], interp = d3.geoInterpolate(a,b);
            var distKm = d3.geoDistance(a,b)*Rk, n = Math.max(1, Math.ceil(distKm/(rad*0.7)));
            for(var q=(s===1?0:1); q<=n; q++) pts.push(interp(q/n));
          }
        } else pts = [[r[3], r[2]]];
        var rings = pts.map(function(c){ return d3.geoCircle().center(c).radius(radDeg).precision(3)(); });
        var geom = rings.length===1 ? rings[0] : {type:'MultiPolygon', coordinates:rings.map(function(g){ return g.coordinates; })};
        var f = {type:'Feature', properties:{name:r[0]}, geometry:geom};
        P.items[r[0]] = {disp:r[0], noun:r[1], lat:r[2], lon:r[3], rad:rad, radRad:rad/Rk, pts:pts, body:bid};
        P.byName[r[0]] = f; P.size[r[0]] = rad/Rk; P.byBody[bid].push(f);
      });
      P.byBody[bid].sort(function(a,b){ return P.size[b.properties.name]-P.size[a.properties.name]; });
    });
    var pn = Object.keys(P.items).sort(function(a,b){ return P.size[b]-P.size[a]; });
    P.rank = {};
    pn.forEach(function(n,i){ P.rank[n] = 1 - i/pn.length + (TOP_PL[n] ? 3 : ICONIC_PL[n] ? 2 : FAMOUS_PL[n] ? 1 : 0); });
  } else {
    t = PACKS.geo;
    P.kind='physical';
    P.landF = topojson.feature(t, t.objects.land).features[0];
    var areas = topojson.feature(t, t.objects.areas).features;
    var rivers = topojson.feature(t, t.objects.rivers).features;
    P.seas=[]; P.areas=[]; P.lakes=[]; P.rivers=rivers; P.riverPts={}; P.polyList=[];
    areas.forEach(function(f){
      var p=f.properties;
      P.items[p.name] = {disp:p.name, cat:p.cat, noun:p.noun};
      P.byName[p.name] = f;
      P.size[p.name] = Math.sqrt(d3.geoArea(f));
      if(p.cat==='waters' && p.noun!=='lake') P.seas.push(f);
      else if(p.noun==='lake') P.lakes.push(f);
      else P.areas.push(f);
      P.polyList.push(p.name);
    });
    rivers.forEach(function(f){
      var p=f.properties;
      P.items[p.name] = {disp:p.name, cat:p.cat, noun:p.noun};
      P.byName[p.name] = f;
      P.size[p.name] = d3.geoLength(f);
      var lines = f.geometry.type==='MultiLineString' ? f.geometry.coordinates : [f.geometry.coordinates];
      P.riverPts[p.name] = lines.map(function(l){ return l.map(function(c){ return proj(c); }); });
    });
    // difficulty bands use each feature's size rank within its own type, so every level mixes rivers, ranges, deserts, waters and land
    P.rank = {};
    var byCat = {};
    Object.keys(P.items).forEach(function(n){ (byCat[P.items[n].cat] = byCat[P.items[n].cat] || []).push(n); });
    Object.keys(byCat).forEach(function(c){
      var arr = byCat[c].sort(function(a,b){ return P.size[b]-P.size[a]; });
      arr.forEach(function(n,i){ P.rank[n] = 1 - i/arr.length + (TOP_GEO[n] ? 3 : ICONIC_GEO[n] ? 2 : FAMOUS_GEO[n] ? 1 : 0); });
    });
    P.polyList.sort(function(a,b){ return P.size[a]-P.size[b]; });
  }
  if(P.kind==='political'){
    P.features.forEach(function(f){
      var n=f.properties.name; if(!n) return;
      P.size[n] = (P.size[n]||0) + d3.geoArea(f);
      if(!P.byName[n]) P.byName[n]=f;
    });
  }
  if(id==='modern' || HIST[id]){
    var spec = id==='modern' ? FAME.M : FAME.H[id];
    var listed = spec.order.filter(function(n){ return P.items[n]; });
    var tail = spec.last.filter(function(n){ return P.items[n]; });
    var rest = Object.keys(P.items).filter(function(n){ return listed.indexOf(n)<0 && tail.indexOf(n)<0; })
      .sort(function(a,b){ return (P.size[b]||0)-(P.size[a]||0); });
    var order = listed.concat(rest, tail);
    P.rank = {};
    order.forEach(function(n,i){ P.rank[n] = order.length>1 ? 1 - i/(order.length-1) : 1; });
  }
  P.capCount = 0; P.regCount = {};
  Object.keys(P.items).forEach(function(n){
    var it=P.items[n];
    if(it.cap) P.capCount++;
    if(it.reg) P.regCount[it.reg] = (P.regCount[it.reg]||0)+1;
  });
  packs[id]=P; return P;
}

function disp(n){
  if(!n) return null;
  return pack.items[n] ? pack.items[n].disp : (EXTRA[n] || n);
}

function drawPack(){
  g.selectAll('*').remove();
  labelRecs = [];
  var defs = g.append('defs');
  // soft shadow under name labels, so they lift off the map
  defs.append('filter').attr('id','lblShadow').attr('x','-30%').attr('y','-40%').attr('width','160%').attr('height','200%')
    .append('feDropShadow').attr('dx',0).attr('dy',1.2).attr('stdDeviation',1.3).attr('flood-color','#08202d').attr('flood-opacity',0.38);
  g.append('path').attr('class','sphere').attr('d', path({type:'Sphere'}));
  defs.append('clipPath').attr('id','sphereClip').append('path').attr('d', path({type:'Sphere'}));
  g.append('image').attr('class','relief').attr('href', pack.kind==='planet' ? PIMG[curBody] : RELIEF).attr('x',0).attr('y',0).attr('width',W).attr('height',H)
    .attr('preserveAspectRatio','none').attr('clip-path','url(#sphereClip)');
  g.append('path').attr('class','graticule').attr('d', path(d3.geoGraticule10()));
  if(pack.kind==='political'){
    paths = g.selectAll('path.country').data(pack.features).join('path')
      .attr('class', function(d){ return 'country'+(d.properties.name ? '' : ' bg'); })
      .attr('d', path)
      .on('click', function(ev, d){ onPick(ev.currentTarget, d.properties.name || null); });
    if(pack.isSecurity){
      g.selectAll('path.feat').data(pack.chokeFeatures).join('path').attr('class','feat pl').attr('d', path);
      paths = g.selectAll('path.country, path.feat');
    }
  } else if(pack.kind==='planet'){
    paths = g.selectAll('path.feat').data(pack.byBody[curBody]).join('path').attr('class','feat pl').attr('d', path);
  } else if(pack.kind==='trivia'){
    paths = g.selectAll('path.feat').data([]).join('path');
  } else {
    var cls = function(base){ return function(d){ return 'feat '+base+' k-'+d.properties.cat; }; };
    var mask = defs.append('mask').attr('id','oceanMask').attr('maskUnits','userSpaceOnUse').attr('x',0).attr('y',0).attr('width',W).attr('height',H);
    mask.append('rect').attr('width',W).attr('height',H).attr('fill','#fff');
    mask.append('path').datum(pack.landF).attr('d', path).attr('fill','#000');
    var sg = g.append('g').attr('mask','url(#oceanMask)');
    sg.selectAll('path.sea').data(pack.seas).join('path').attr('class', cls('sea')).attr('d', path);
    g.append('path').attr('class','land').datum(pack.landF).attr('d', path);
    g.selectAll('path.area').data(pack.areas).join('path').attr('class', cls('area')).attr('d', path);
    g.selectAll('path.lake').data(pack.lakes).join('path').attr('class', cls('lake')).attr('d', path);
    g.selectAll('path.river').data(pack.rivers).join('path').attr('class', cls('river')).attr('d', path);
    paths = g.selectAll('path.feat');
  }
  marks = g.append('g');
  fills = g.append('g');
  leads = g.append('g');
  labels = g.append('g');
  app.classList.toggle('physical', pack.kind!=='political');
  // period theme: ancient to medieval maps look like aged parchment; 1500 onwards and the modern map stay clean
  applyTheme();
  setDusk(st.phase==='play' ? duskFor(st.i) : 1);
  app.classList.toggle('space', pack.kind==='planet');
  app.classList.toggle('trivia', pack.kind==='trivia');
}

/* ---------- State ---------- */
var st = {mode:'modern', tab:'map', lastMap:'modern', body:'mars', level:1, region:'World', cat:'all', qs:[], i:0, score:0, tries:0, locked:true, revealed:false, phase:'setup', log:[], saved:null, timing:false, tick:0};
var timers = [];
function later(fn, ms){ var id=setTimeout(fn, ms); timers.push(id); return id; }
function clearTimers(){ timers.forEach(clearTimeout); timers=[]; }
function shuffle(a){
  for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; }
  return a;
}
function regionPhrase(r){ return r==='Americas' ? 'the Americas' : r; }
function effLevel(){
  var L = LEVELS[st.level], type = L.type, tricky = (type==='tricky');
  if(tricky) type = 'mixed';
  if(pack.kind!=='political') type = 'find';
  return {id:L.id, label:L.label, tries:L.tries, pts:L.pts, hints:L.hints, type:type, band:L.band, time:L.time, tricky:tricky};
}
function scopeKey(){ return pack.kind==='physical' ? st.cat : pack.kind==='planet' ? 'all' : st.region; }
function bestKey(){ return 'pinpoint:best:'+st.mode+':'+LEVELS[st.level].id+':'+scopeKey()+':'+ROUNDS; }
function getBest(){ try{ var v=localStorage.getItem(bestKey()); return v===null?null:parseInt(v,10); }catch(e){ return null; } }
function setBest(v){ try{ localStorage.setItem(bestKey(), String(v)); }catch(e){} }
function showBest(){
  if(typeof showWeakBtn==='function') showWeakBtn();
  if(typeof showDaily==='function') showDaily();
  var b=getBest();
  $('best').textContent = b===null ? '' : 'Your best for this setup: '+b+' points.';
}

function isOff(name){
  if(pack.kind==='physical') return st.cat!=='all' && !(pack.items[name] && pack.items[name].cat===st.cat);
  return st.region!=='World' && !(pack.items[name] && pack.items[name].reg===st.region);
}
function applyRegion(dur){
  paths.classed('off', function(d){ return isOff(d.properties.name); });
  var box = pack.kind==='physical' ? null : REGION_BOX[st.region];
  moveTo(viewFor(box), dur);
}

/* ---------- Setup UI ---------- */
function levelDesc(i){
  if(pack.isSecurity){
    return [
      'The best-known alliances, bases and flashpoints, with hints and three tries.',
      'Well-known security facts and the great straits, with hints and three tries.',
      'Deeper cuts, no hints and just two tries.',
      'The obscure and the tricky, with one try, 20 seconds and a random zoomed-in start.'
    ][i];
  }
  if(pack.kind==='trivia'){
    return [
      'The moments and figures everyone should know, with the era shown, hints and three tries.',
      'Well-known events and leaders, with the era shown, hints and three tries.',
      'Deeper cuts, no hints, no era shown and just two tries.',
      'The obscure and the tricky, including \u201cwhich is NOT\u201d questions. One try, 20 seconds and no hints.'
    ][i];
  }
  if(st.mode==='flags'){
    return [
      'The most recognizable flags, with hints and three tries.',
      'Well-known and moderately known flags, with hints and three tries.',
      'Lesser-known flags, plus flags of countries that no longer exist. No hints and just two tries.',
      'The most obscure flags and more lost countries, plus tricks: one try, 20 seconds, a random zoomed-in start.'
    ][i];
  }
  var phys = pack.kind!=='political';
  var things = phys ? 'features' : (pack.noun==='realm' ? 'realms' : 'countries');
  var show = phys ? ' the type shown,' : '';
  if(i===0) return 'The most recognizable '+things+' only,'+show+' with hints and three tries.'+(EASY_COUNT[pack.id] ? ' This one is just '+EASY_COUNT[pack.id]+' rounds.' : '');
  if(i===1) return 'Well-known and moderately known '+things+','+show+' with hints and three tries.';
  if(i===2) return 'Lesser-known '+things+' only, no hints and just two tries.'+(phys ? ' The type is hidden.' : '');
  return 'The most obscure '+things+' plus tricks: one try, 20 seconds, a random zoomed-in start'
    +(phys ? '.' : (pack.id==='modern' ? ', and capital and border puzzles.' : ', and capital puzzles.'));
}
var $level = $('level');
function setLevel(i){
  st.level = i;
  var L = LEVELS[i];
  $level.value = i;
  $level.style.setProperty('--p', (i/3*100)+'%');
  $level.setAttribute('aria-valuetext', L.label);
  $('lvlDesc').textContent = levelDesc(i);
  document.querySelectorAll('#ticks button').forEach(function(b){
    b.classList.toggle('on', parseInt(b.getAttribute('data-i'),10)===i);
  });
  showBest();
}
$level.addEventListener('input', function(){ setLevel(parseInt($level.value,10)); });
$('ticks').addEventListener('click', function(e){
  var b = e.target.closest('button'); if(b) setLevel(parseInt(b.getAttribute('data-i'),10));
});

function setPressed(key, val){
  document.querySelectorAll('.seg[data-key="'+key+'"] button').forEach(function(b){
    b.setAttribute('aria-pressed', b.getAttribute('data-v')===val ? 'true' : 'false');
  });
}
function refreshChips(){
  var phys = pack.kind==='physical';
  $('modeNote').textContent = MODE_NOTE[st.mode];
  var tabNote = ['modern','bronze','classical','ancient','early','medieval','discovery','vienna','wwi','ww2','coldwar'].indexOf(st.mode)<0;
  $('histNote').hidden = !tabNote;
  $('histNote').textContent = tabNote ? MODE_NOTE[st.mode] : '';
}
function setMode(id){
  st.mode = id; pack = getPack(id);
  if(['modern','bronze','classical','ancient','early','medieval','discovery','vienna','wwi','ww2','coldwar'].indexOf(id)>=0) st.lastMap = id;
  st.region = 'World'; st.cat = 'all';
  drawPack(); refreshChips(); applyRegion(0); setLevel(st.level);
}
document.querySelectorAll('.seg').forEach(function(seg){
  seg.addEventListener('click', function(e){
    var btn = e.target.closest('button'); if(!btn || btn.disabled) return;
    var key = seg.getAttribute('data-key'), v = btn.getAttribute('data-v');
    setPressed(key, v);
    if(key==='mode'){ setMode(v); return; }
    st[key] = v;
    applyRegion(); showBest();
  });
});
$('start').addEventListener('click', startGame);
var LEDE_MAP = $('lede').textContent;
var MAP_MODES = ['modern','bronze','classical','ancient','early','medieval','discovery','vienna','wwi','ww2','coldwar'];
var LEDES = {
  map: LEDE_MAP,
  geo: 'Find rivers, mountains, deserts, seas and more on a map with no borders. The fewer tries you need, the more points you score. Games run ten rounds.',
  flags: 'A flag appears and you click its country on the map. The fewer tries you need, the more points you score. Games run ten rounds.',
  planets: 'Find volcanoes, craters, plains and canyons on Mars, the Moon and Venus. The fewer tries you need, the more points you score. Games run ten rounds.',
  security: 'Answer global-security questions by clicking the country or the strait on the map. The fewer tries you need, the more points you score. Games run ten rounds.',
  history: 'Answer history trivia questions. The fewer tries you need, the more points you score. Games run ten rounds.'
};
var TABS = [['map','tabMap'],['geo','tabGeo'],['flags','tabFlags'],['planets','tabPlanets'],['history','tabHist'],['security','tabSecurity'],['explore','tabExplore']]
  .filter(function(t){ return PLANETS_ON || t[0]!=='planets'; });
function selectTab(tab){
  if(tab==='explore'){ enterExplore(); return; }
  st.tab = tab;
  TABS.forEach(function(p){
    $(p[1]).classList.toggle('on', p[0]===tab);
    $(p[1]).setAttribute('aria-selected', p[0]===tab ? 'true' : 'false');
  });
  $('modeSet').hidden = tab!=='map';
  $('lede').textContent = LEDES[tab];
  setMode(tab==='map' ? st.lastMap : tab);
}
TABS.forEach(function(p){ $(p[1]).addEventListener('click', function(){ selectTab(p[0]); }); });
$('again').addEventListener('click', startGame);
$('practice').addEventListener('click', startPractice);
$('weakBtn').addEventListener('click', startWeakPractice);
$('exploreWeak').addEventListener('click', startWeakPractice);
$('masteryBtn').addEventListener('click', function(){
  st.mastery = !st.mastery;
  clearLabels();
  if(pack.kind==='political') autoLabelAll();
  drawMastery(); refreshMastery();
});
$('shareBtn').addEventListener('click', function(){ shareResult(); });
$('dailyBtn').addEventListener('click', function(){
  var D = loadDaily(), rec = D.days[dayKey()];
  if(rec && rec.done) shareResult(dailyShareData(rec, D), $('dailySub'));
  else startDaily();
});
$('exploreHome').addEventListener('click', function(){ toSetup(); });
$('exploreMode').addEventListener('change', function(){
  st.exploreMode = this.value;
  var v = this.value;
  crossFade(function(){ setMode(v); startExplore(); });
});
/* Cross-fade the map: a snapshot of the old map (with its theme frozen inline) sits on top and fades out while the new
   map is drawn underneath. */
function crossFade(draw){
  var old = $('map');
  if(reduce || !old){ draw(); return; }
  var snap = old.cloneNode(true);
  snap.removeAttribute('id'); snap.setAttribute('aria-hidden','true'); snap.classList.add('xfade');
  // freeze the old period theme (parchment or clean) on the snapshot before the new theme class lands
  var pairs = [['.relief',['filter']], ['.sphere',['fill']], ['.graticule',['stroke','stroke-opacity']], ['.country',['stroke','stroke-opacity','fill','fill-opacity']],
               ['.plabel text',['font-family','font-size','font-weight','fill']], ['.plabel text tspan.pcap',['font-family','font-size','font-weight','font-style','fill']],
               ['.plabel rect.pbox',['fill']], ['.ptint',['fill','fill-opacity']], ['.pfill',['filter']],
               ['.lights',['display','opacity']], ['g.fire circle',['opacity']], ['.glowlines',['display','stroke','stroke-opacity','stroke-width']], ['.relief',['opacity']]];
  pairs.forEach(function(p){
    var a = old.querySelectorAll(p[0]), b = snap.querySelectorAll(p[0]);
    for(var i=0; i<a.length && i<b.length; i++){
      var cs = getComputedStyle(a[i]);
      p[1].forEach(function(prop){ b[i].style.setProperty(prop, cs.getPropertyValue(prop)); });
    }
  });
  snap.style.background = getComputedStyle(old).backgroundColor;
  old.parentNode.insertBefore(snap, old.nextSibling);
  draw();
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ snap.classList.add('xfadeOut'); }); });
  setTimeout(function(){ if(snap.parentNode) snap.parentNode.removeChild(snap); }, 700);
}
$('exploreWorld').addEventListener('click', function(){ var order = Object.keys(BODIES); setBody(order[(order.indexOf(curBody)+1)%order.length]); });
function toSetup(){
  if(st.daily){ var D = loadDaily(); finishDaily(D, st.daily.key); st.daily = null; }
  if(st.dailyPrev){
    var pv = st.dailyPrev; st.dailyPrev = null;
    st.lastMap = pv.lastMap; setLevel(pv.level);
    selectTab(pv.tab==='explore' || !pv.tab ? 'map' : pv.tab);
  }
  stopTimer(); clearTimers(); hideToast(); clearLabels(); st.devPick = false; DEV_PANELS.forEach(function(id){ var e = $(id); if(e) e.hidden = true; }); devPausedMs = null;
  $('flagImg').hidden = true; app.classList.remove('flagq');
  $('end').hidden = true; $('setup').hidden = false;
  app.classList.remove('playing'); app.classList.remove('tint'); app.classList.remove('noterrain'); app.classList.remove('exploring'); app.classList.remove('mastering'); st.phase='setup';
  $('exploreBar').hidden = true;
  $('hudTop').hidden = true; $('hudBottom').hidden = true; $('zoomBtns').hidden = true;
  paths.classed('hit miss reveal', false);
  marks.selectAll('*').remove();
  applyRegion(); showBest();
  if(st.tab==='explore') selectTab('map');
}
$('change').addEventListener('click', toSetup);

var homeArmed = false, homeTimer = null;
function resetHome(){
  homeArmed = false; clearTimeout(homeTimer);
  var b = $('home'); b.textContent = 'Home'; b.classList.remove('armed');
}
$('home').addEventListener('click', function(){
  if(st.phase!=='play') return;
  if(st.log.length===0 || homeArmed){ resetHome(); toSetup(); return; }
  homeArmed = true; this.textContent = 'Leave game?'; this.classList.add('armed');
  homeTimer = setTimeout(resetHome, 3000);
});

/* ---------- Questions ---------- */
function borderPuzzle(n){
  var nb = pack.neighbors && pack.neighbors[n];
  if(!nb || nb.length<2) return null;
  var opts = [];
  for(var i=0;i<nb.length;i++) for(var j=i+1;j<nb.length;j++){
    var a = nb[i], b = nb[j];
    var common = pack.neighbors[a].filter(function(x){ return x!==a && x!==b && pack.neighbors[b].indexOf(x)>=0; });
    if(common.length===1 && common[0]===n) opts.push([a,b]);
  }
  return opts.length ? opts[Math.floor(Math.random()*opts.length)] : null;
}
function buildFlagQuestions(){
  var L = LEVELS[st.level];
  var modern = Object.keys(pack.items).filter(function(n){ return !pack.items[n].hist; });
  var sz = pack.rank || pack.size;
  modern.sort(function(a,b){ return sz[b]-sz[a]; });
  var frac = (L.id==='easy' && EASY_FRAC.flags!==undefined) ? EASY_FRAC.flags : L.band[1];
  var keep = Math.max(Math.min(ROUNDS, modern.length), Math.ceil(modern.length*frac));
  var names = L.band[0]==='top' ? modern.slice(0,keep) : modern.slice(modern.length-keep);
  var hist = Object.keys(pack.items).filter(function(n){ return pack.items[n].hist; });
  var quota = 0, hp = [];
  if(L.id==='hard'){ quota = 3; hp = hist.filter(function(n){ return pack.items[n].tier==='hard'; }); }
  else if(L.id==='impossible'){ quota = 5; hp = hist; }
  hp = shuffle(hp.slice()).slice(0, quota);
  var m = shuffle(names.slice()).slice(0, ROUNDS - hp.length);
  return shuffle(m.concat(hp)).map(function(n){ return {name:n, type:'flag'}; });
}
function buildSecurity(){
  var tier = st.level+1, idxs = [];
  SEC.forEach(function(sq,i){ if(sq.t===tier) idxs.push(i); });
  return shuffle(idxs).slice(0, ROUNDS).map(function(i){ return {name:'sq'+i, type:'sec', idx:i}; });
}
function buildTrivia(){
  var tier = st.level+1, idxs = [];
  TRIVIA.forEach(function(T,i){ if(T.t===tier) idxs.push(i); });
  return shuffle(idxs).slice(0, ROUNDS).map(function(i){ return {name:'q'+i, type:'trivia', idx:i}; });
}
function buildQuestions(){
  if(pack.kind==='trivia') return buildTrivia();
  if(pack.isSecurity) return buildSecurity();
  if(pack.isFlags) return buildFlagQuestions();
  var lvl = effLevel();
  var all = Object.keys(pack.items).filter(function(n){
    var it = pack.items[n];
    if(pack.kind==='physical') return st.cat==='all' || it.cat===st.cat;
    return true;
  });
  var sz = pack.rank || pack.size;
  all.sort(function(a,b){ return sz[b]-sz[a]; });
  var frac = (lvl.id==='easy' && EASY_FRAC[pack.id]!==undefined) ? EASY_FRAC[pack.id] : lvl.band[1];
  var ec = lvl.id==='easy' ? EASY_COUNT[pack.id] : undefined;
  var floor = ec || Math.min(ROUNDS, all.length);
  var keep = ec ? ec : Math.max(floor, Math.ceil(all.length*frac));
  var names = lvl.band[0]==='top' ? all.slice(0,keep) : all.slice(all.length-keep);
  // Impossible should still ask about capitals in the older periods, where the very obscurest realms rarely have a known capital
  if(lvl.tricky && pack.kind==='political' && pack.id!=='modern'){
    var added = 0;
    [0.4,0.6,0.8,1].some(function(fr){
      all.slice(all.length-Math.ceil(all.length*fr)).forEach(function(n){ if(pack.items[n].cap && names.indexOf(n)<0){ names.push(n); added++; } });
      return added >= 4;
    });
  }
  var total = ec ? Math.min(ec, ROUNDS) : ROUNDS;
  var seen = {}, list = [], last = null;
  while(list.length < total){
    var batch = shuffle(names.slice());
    if(batch.length>1 && batch[0]===last) batch.push(batch.shift());
    for(var i=0; i<batch.length && list.length<total; i++){
      var n = batch[i], t;
      if(lvl.tricky && pack.id==='modern' && Math.random()<0.4){
        var bp = borderPuzzle(n);
        if(bp){ seen[n] = 'border'; list.push({name:n, type:'border', a:bp[0], b:bp[1]}); last = n; continue; }
      }
      if(lvl.type!=='mixed') t = lvl.type;
      else if(!pack.items[n].cap) t = 'find';
      else if(seen[n]) t = seen[n]==='find' ? 'capital' : 'find';
      else t = Math.random()<0.5 ? 'capital' : 'find';
      seen[n] = t; list.push({name:n, type:t}); last = n;
    }
  }
  return list;
}

/* ---------- Timer ---------- */
function startTimer(secs, remainMs){
  var wrap = $('timer'), fill = $('timerFill');
  st.tick++;
  if(!secs){ wrap.hidden = true; st.timing = false; return; }
  wrap.hidden = false; fill.style.width = '100%';
  var total = secs*1000, end = Date.now()+(remainMs!==undefined ? remainMs : total), token = st.tick;
  st.tEnd = end;
  st.timing = true;
  (function frame(){
    if(!st.timing || token!==st.tick) return;
    var left = end - Date.now();
    fill.style.width = Math.max(0, left/total*100)+'%';
    if(left<=0){ st.timing = false; timeUp(); return; }
    requestAnimationFrame(frame);
  })();
}
function stopTimer(){ st.timing = false; st.tick++; }
function timeUp(){ if(st.phase==='play' && !st.locked) reveal(null, true); }

/* ---------- Game ---------- */
function startGame(qsOverride){
  clearTimers();
  st.daily = st.dailyStart || null; st.dailyStart = null;
  var practice = Array.isArray(qsOverride) && !st.daily;
  st.practice = practice;
  st.qs = Array.isArray(qsOverride) ? qsOverride : buildQuestions();
  st.i=0; st.score=0; st.log=[]; st.phase='play'; st.saved=null;
  clearLabels();
  $('exploreBar').hidden = true; app.classList.remove('exploring'); app.classList.remove('mastering');
  paths.classed('hit miss reveal', false);
  marks.selectAll('*').remove();
  applyRegion();
  app.classList.add('playing');
  app.classList.toggle('tint', pack.kind==='physical' && effLevel().hints);
  app.classList.toggle('noterrain', pack.kind==='physical' && !effLevel().hints);
  $('setup').hidden = true; $('end').hidden = true;
  $('hudTop').hidden = false; $('hudBottom').hidden = false; $('zoomBtns').hidden = pack.kind==='trivia';
  showQuestion();
}

function startPractice(){
  var missed = st.log.filter(function(e){ return e.pts===0; }).map(function(e){ return Object.assign({}, e.q); });
  if(missed.length) startGame(missed);
}
function enterExplore(){
  st.tab = 'explore';
  TABS.forEach(function(p){
    $(p[1]).classList.toggle('on', p[0]==='explore');
    $(p[1]).setAttribute('aria-selected', p[0]==='explore' ? 'true' : 'false');
  });
  st.exploreMode = st.exploreMode || 'modern';
  setMode(st.exploreMode);
  startExplore();
}
function startExplore(){
  if(pack.kind==='trivia') return;
  $('exploreMode').value = st.exploreMode || st.mode;
  clearTimers(); stopTimer(); hideToast(); clearLabels();
  st.phase = 'explore'; st.practice = false;
  paths.classed('hit miss reveal', false); marks.selectAll('*').remove();
  applyRegion();
  app.classList.add('playing'); app.classList.add('exploring'); app.classList.remove('tint'); app.classList.remove('noterrain');
  $('setup').hidden = true; $('end').hidden = true;
  $('hudTop').hidden = true; $('hudBottom').hidden = true;
  $('zoomBtns').hidden = false; $('exploreBar').hidden = false;
  $('exploreWorld').hidden = pack.kind!=='planet';
  if(pack.kind==='political') autoLabelAll();
  drawMastery(); refreshMastery();
}
/* Explore: every nation shows its flag, name and capital from the start; labels too small to read appear as you zoom in. */
function autoLabelAll(){
  var seen = {};
  paths.each(function(d){
    var nm = d.properties && d.properties.name;
    if(!nm || seen[nm] || !pack.items[nm]) return;
    seen[nm] = 1;
    var info = peekFor(nm);
    placeLabel(info, nm, path.centroid(bigPart(d)), bigFeature(nm, d), {auto:true, defer:true});
    if(!info.fill) tintRealm(nm);
  });
  // overseas territories drawn as their own shapes are not answers (untappable, unlabelled) but show their own flag
  (TERRITORY_FLAGS[pack.id] || []).forEach(function(n){
    var f = pack.features.filter(function(x){ return x.properties.name===n; })[0];
    if(f && FLAGS[n]) paintFlag(n, FLAGS[n], f);
  });
  layoutLabels();
}
function setPips(){
  var max = LEVELS[st.level].tries, left = max - st.tries;
  document.querySelectorAll('.pip').forEach(function(p,i){ p.hidden = i >= max; p.classList.toggle('used', i >= left); });
  $('pips').setAttribute('aria-label', left+' '+(left===1?'try':'tries')+' left');
}
function toast(msg, good, sticky){
  var t = $('toast');
  t.textContent = msg; t.className = 'show' + (good ? ' good' : '');
  // phone: the question card is full width and its height varies (long names, flags, timer), so sit just below it
  var pr = document.querySelector('.prompt');
  if(window.matchMedia('(max-width:620px)').matches && !$('hudTop').hidden && !app.classList.contains('trivia') && pr){
    t.style.top = Math.round(pr.getBoundingClientRect().bottom - app.getBoundingClientRect().top + 10)+'px';
  } else t.style.top = '';
  clearTimeout(toast._id);
  if(!sticky) toast._id = setTimeout(function(){ t.className=''; }, 1800);
}
function hideToast(){ clearTimeout(toast._id); $('toast').className=''; }

function setBody(b){
  if(b===curBody) return;
  curBody = b;
  g.select('image.relief').attr('href', PIMG[b]);
  clearLabels();
  paths = g.selectAll('path.feat').data(pack.byBody[b]).join('path').attr('class','feat pl').attr('d', path);
  marks.raise();
}
function scatterView(q){
  var names = Object.keys(pack.items).filter(function(n){ return n!==q.name && pack.byName[n] && (!pack.items[n].body || pack.items[n].body===pack.items[q.name].body); });
  var n = names[Math.floor(Math.random()*names.length)];
  var c = proj(d3.geoCentroid(pack.byName[n]));
  if(!c) return;
  var k = 3.5;
  moveTo(d3.zoomIdentity.translate(W/2-k*c[0], H/2-k*c[1]).scale(k));
}
function triviaButtons(){ return $('tOpts').querySelectorAll('button'); }
function showTrivia(){
  var q = st.qs[st.i], T = TRIVIA[q.idx], lvl = effLevel();
  st.tries = 0; st.locked = false; st.revealed = false;
  $('flagImg').hidden = true; app.classList.remove('flagq');
  $('kind').textContent = 'History trivia'; $('qname').textContent = '';
  $('round').textContent = (st.i+1)+' of '+st.qs.length;
  $('score').textContent = st.score;
  $('tEra').textContent = lvl.hints ? 'From '+ERAS[T.e] : '';
  $('tQuestion').textContent = T.q;
  $('tFact').textContent = '';
  q.opts = shuffle([T.a].concat(T.w));
  var box = $('tOpts'); box.innerHTML = '';
  q.opts.forEach(function(o,i){
    var b = document.createElement('button'); b.type = 'button'; b.className = 'topt';
    var k = document.createElement('b'); k.textContent = String.fromCharCode(65+i);
    var s = document.createElement('span'); s.textContent = o;
    b.appendChild(k); b.appendChild(s);
    b.addEventListener('click', function(){ triviaPick(i); });
    box.appendChild(b);
  });
  $('hint').textContent = lvl.hints ? 'Pick the best answer. You can also press 1 to 4.' : 'No hints on this level. You can press 1 to 4.';
  var act = $('act'); act.textContent = 'Skip'; act.disabled = false; act.classList.remove('primary');
  setPips(); hideToast(); startTimer(lvl.time);
}
function triviaNext(){
  var last = st.i >= st.qs.length-1;
  var act = $('act'); act.textContent = last ? 'See results' : 'Next question'; act.disabled = false; act.classList.add('primary');
  act.focus({preventScroll:true});
  autoNext();
}
function triviaPick(i){
  if(st.phase!=='play' || st.locked || pack.kind!=='trivia') return;
  var q = st.qs[st.i], T = TRIVIA[q.idx], lvl = effLevel(), btns = triviaButtons();
  if(q.opts[i]===T.a){
    var pts = LEVELS[st.level].pts[st.tries];
    stopTimer(); st.locked = true; st.revealed = true; st.score += pts;
    st.log.push({q:q, pts:pts});
    btns[i].classList.add('good');
    btns.forEach(function(b){ b.disabled = true; });
    $('score').textContent = st.score; $('tFact').textContent = T.f;
    toast('Correct, +'+pts, true);
    triviaNext();
  } else {
    st.tries++; setPips();
    btns[i].classList.add('bad'); btns[i].disabled = true;
    if(st.tries >= lvl.tries){ triviaReveal(false); return; }
    var left = lvl.tries - st.tries;
    toast('Not quite. '+left+(left===1 ? ' try' : ' tries')+' left.');
    if(lvl.hints) $('hint').textContent = 'Hint: the answer starts with \u201c'+T.a.charAt(0)+'\u201d.';
  }
}
function triviaReveal(timedOut){
  if(st.revealed) return;
  var q = st.qs[st.i], T = TRIVIA[q.idx], btns = triviaButtons();
  stopTimer(); st.locked = true; st.revealed = true; st.tries = LEVELS[st.level].tries; setPips();
  st.log.push({q:q, pts:0});
  btns.forEach(function(b,i){ b.disabled = true; if(q.opts[i]===T.a) b.classList.add('good'); });
  $('tFact').textContent = T.f;
  toast((timedOut ? 'Time\u2019s up. ' : '')+'The answer: '+T.a, false, true);
  triviaNext();
}
function showQuestion(){
  var q = st.qs[st.i], it = pack.items[q.name], lvl = effLevel();
  if(pack.kind==='trivia'){ if(isNight()) setDusk(duskFor(st.i)); showTrivia(); return; }
  if(pack.kind==='planet') setBody(it.body);
  st.tries=0; st.locked=false; st.revealed=false;
  if(isNight()) setDusk(duskFor(st.i));
  var flagImg = $('flagImg');
  app.classList.toggle('flagq', q.type==='flag');
  $('qname').classList.toggle('long', q.type==='sec');
  flagImg.hidden = q.type!=='flag';
  if(q.type==='flag') flagImg.src = FLAGS[q.name];
  if(q.type==='sec'){
    $('kind').textContent = 'Global security';
    $('qname').textContent = it.disp;
  } else if(q.type==='flag'){
    $('kind').textContent = 'Which country\u2019s flag is this?';
    $('qname').textContent = '';
  } else if(q.type==='border'){
    $('kind').textContent = 'Find the country that borders';
    $('qname').textContent = pack.items[q.a].disp+' and '+pack.items[q.b].disp;
  } else if(q.type==='capital'){
    $('kind').textContent = 'Which '+pack.noun+' '+(pack.past?'had':'has')+' the capital';
    $('qname').textContent = it.cap;
  } else {
    if(pack.kind==='planet') $('kind').textContent = 'On '+BODIES[it.body].label+', find'+(lvl.hints ? ' the '+it.noun : '');
    else $('kind').textContent = (pack.kind!=='political' && lvl.hints) ? 'Find the '+it.noun : 'Find';
    $('qname').textContent = it.disp;
  }
  $('round').textContent = (st.i+1)+' of '+st.qs.length;
  $('score').textContent = st.score;
  $('hint').textContent = lvl.hints ? 'Click the answer on the map. Scroll or pinch to zoom.' : 'No hints on this level. Scroll or pinch to zoom.';
  var act = $('act'); act.textContent='Skip'; act.disabled=false; act.classList.remove('primary');
  setPips(); hideToast();
  startTimer(lvl.time);
  if(lvl.tricky) scatterView(q);
}

/* political click */
var peekTimer = null;
function showPeek(){ $('peek').hidden = true; }   // the old bottom-left card is retired; names and flags now sit on the map
function clearLabels(){
  if(labels) labels.selectAll('*').remove();
  if(fills) fills.selectAll('*').remove();
  if(leads) leads.selectAll('*').remove();
  if(paths) paths.classed('flagged', false);
  labelRecs = [];
}
var bigCache = {};
function bigFeature(name, d){
  if(!name) return d;
  var key = pack.id+':'+name;
  if(bigCache[key]) return bigCache[key];
  var same = pack.features.filter(function(x){ return x.properties.name===name; }), best = same[0], ba = -1;
  same.forEach(function(x){ var a = d3.geoArea(x); if(a>ba){ ba = a; best = x; } });
  bigCache[key] = best || d;
  return bigCache[key];
}
var clipN = 0;
function segDist2(a, b, px, py){
  var dx = b[0]-a[0], dy = b[1]-a[1], l2 = dx*dx+dy*dy, tt = 0;
  if(l2>0){ tt = ((px-a[0])*dx+(py-a[1])*dy)/l2; tt = Math.max(0, Math.min(1, tt)); }
  var ex = px-(a[0]+tt*dx), ey = py-(a[1]+tt*dy);
  return ex*ex+ey*ey;
}
/* Roomy spots inside a country. The costly geometry is worked out once per country and reused for every label size. */
var geoCache = new Map();
function fitGeo(f){
  if(geoCache.has(f)) return geoCache.get(f);
  var bp = bigPart(f), geom = bp.geometry || bp, G = null;
  if(geom && geom.type==='Polygon'){
    var rings = geom.coordinates.map(function(r){ return r.map(function(c){ return proj(c); }); });
    var ring = rings[0], holes = rings.slice(1), i, j, m;
    // a spot counts only if it is inside the outline and not in a hole (another realm can sit inside this one)
    var inShape = function(pt){
      if(!d3.polygonContains(ring, pt)) return false;
      for(var hi=0; hi<holes.length; hi++) if(d3.polygonContains(holes[hi], pt)) return false;
      return true;
    };
    var x0=Infinity, x1=-Infinity, y0=Infinity, y1=-Infinity;
    ring.forEach(function(r){ x0=Math.min(x0,r[0]); x1=Math.max(x1,r[0]); y0=Math.min(y0,r[1]); y1=Math.max(y1,r[1]); });
    var pts = [], N = 28;
    for(i=0;i<=N;i++) for(j=0;j<=N;j++){
      var px = x0+(x1-x0)*i/N, py = y0+(y1-y0)*j/N;
      if(!inShape([px,py])) continue;
      var md = Infinity;
      rings.forEach(function(rg){ var sv = Math.max(1, Math.floor(rg.length/260)); for(m=sv;m<rg.length;m+=sv){ var dd = segDist2(rg[m-sv], rg[m], px, py); if(dd<md) md = dd; } });
      pts.push({x:px, y:py, cl:md});
    }
    if(!pts.length){ var cc = d3.polygonCentroid(ring); pts.push({x:cc[0], y:cc[1], cl:0}); }
    pts.sort(function(a,b){ return b.cl-a.cl; });
    var sep = 0.14*Math.sqrt(Math.max((x1-x0)*(y1-y0), 1e-6)), chosen = [];
    pts.forEach(function(pt){
      if(chosen.length>=14) return;
      if(chosen.every(function(c){ return Math.hypot(c.x-pt.x, c.y-pt.y) >= sep; })) chosen.push(pt);
    });
    var cen = d3.polygonCentroid(ring), far = null, fd = -1;
    ring.forEach(function(v){ var d = Math.hypot(v[0]-cen[0], v[1]-cen[1]); if(d>fd){ fd = d; far = v; } });
    G = {ring:ring, inShape:inShape, chosen:chosen, far:far, fd:fd, area:Math.abs(d3.polygonArea(ring))};
  }
  geoCache.set(f, G);
  return G;
}
function labelFit(f, w, h){
  var G = fitGeo(f);
  if(!G) return null;
  var inShape = G.inShape;
  function fitAt(cx, cy){
    function fits(s){
      var hw = w*s/2, hh = h*s/2;
      return [[-hw,-hh],[0,-hh],[hw,-hh],[hw,0],[hw,hh],[0,hh],[-hw,hh],[-hw,0]].every(function(q){
        return inShape([cx+q[0], cy+q[1]]);
      });
    }
    if(fits(1)) return 1;
    var lo = 0, hi = 1;
    for(var it=0; it<12; it++){ var mid = (lo+hi)/2; if(fits(mid)) lo = mid; else hi = mid; }
    return Math.max(lo, 0.012);
  }
  var cands = G.chosen.map(function(c){ return {x:c.x, y:c.y, fit:fitAt(c.x, c.y)}; });
  cands.sort(function(a,b){ return b.fit-a.fit; });
  // spots between the roomiest point and the far end (tip) of the shape, all inside it
  var far = G.far, toward = [];
  [0.5, 0.62, 0.74, 0.86, 0.94].forEach(function(tt){
    var x = cands[0].x+(far[0]-cands[0].x)*tt, y = cands[0].y+(far[1]-cands[0].y)*tt;
    if(inShape([x,y])) toward.push({x:x, y:y, fit:fitAt(x,y), toward:true, dist:Math.hypot(far[0]-x, far[1]-y)});
  });
  return {xy:[cands[0].x, cands[0].y], s:cands[0].fit, cands:cands, toward:toward, area:G.area, elong:G.fd/Math.sqrt(Math.max(G.area,1e-6)/Math.PI)};
}
/* Labels of neighbouring places step aside so none sits on top of another. */
var labelRecs = [];
var LABEL_REL = [[0,0]];
[1.1,2.2,3.3].forEach(function(r){ [[0,-1],[0,1],[1,0],[-1,0],[0.8,-0.8],[-0.8,-0.8],[0.8,0.8],[-0.8,0.8]].forEach(function(d){ LABEL_REL.push([d[0]*r, d[1]*r]); }); });
/* Labels fade in and out instead of popping. A hidden label is switched off completely (display:none) once its fade
   has finished, so hidden labels cost nothing to draw. New labels start faded out; all fade-ins of one layout pass start
   together on the next frame. With reduced motion everything is instant. */
var fadeIns = [];
function showWrap(w, on){
  var n = w.node ? w.node() : w;
  if(!n) return;
  clearTimeout(n._hideT);
  if(on){
    if(n.style.display==='none') n.style.display = '';
    if(n.classList.contains('lbl-off')){ if(reduce) n.classList.remove('lbl-off'); else fadeIns.push(n); }
  } else {
    if(n.style.display==='none') return;
    if(reduce || n.classList.contains('lbl-off')){ n.classList.add('lbl-off'); n.style.display = 'none'; return; }
    n.classList.add('lbl-off');
    n._hideT = setTimeout(function(){ n.style.display = 'none'; }, 240);
  }
}
function flushFadeIns(){
  if(!fadeIns.length) return;
  var list = fadeIns; fadeIns = [];
  requestAnimationFrame(function(){ list.forEach(function(n){ n.classList.remove('lbl-off'); }); });
}
function layoutLabels(){
  var k = d3.zoomTransform(svg.node()).k, placed = [], pad = 3/k, floors = [0.55, 0.4, 0.28, 0.18, 0];
  // screen pixels per map unit: about 1.5 on a 1440 px desktop, about 0.4 on a phone. Label text is 11 map units, so
  // automatic labels are sized in screen pixels: at least 11 px when room allows, never under 8 px (9 px when spilling).
  var sr = svg.node().getBoundingClientRect(), px = Math.min(sr.width/W, sr.height/H) || 1;
  var nom = Math.max(1, 1/px), minS = Math.max(0.5, 8/(11*px)), spillS = Math.max(0.55, 9/(11*px));
  // a spilled label may sit at most SPILL_GAP screen pixels (anchor to the label's nearest edge) from its country;
  // with no room that close it stays hidden until you zoom in, instead of drifting over another sea or continent
  var SPILL_GAP = 40, maxGap = SPILL_GAP/(k*px);
  function overlapOf(cx, cy, hw, hh){
    var ov = 0;
    for(var j=0;j<placed.length;j++){
      var pr = placed[j], ox = Math.min(cx+hw, pr.x1)-Math.max(cx-hw, pr.x0), oy = Math.min(cy+hh, pr.y1)-Math.max(cy-hh, pr.y0);
      if(ox>0 && oy>0) ov += ox*oy;
    }
    return ov;
  }
  // automatic labels (Explore): shown only where they fit inside their own country at a readable size without touching another label
  function layoutAuto(rec){
    var tiers = [{id:'full', w:rec.w, h:rec.h, cands:rec.cands, name:rec.fullName}];
    if(rec.short) tiers.push({id:'short', w:rec.short.w, h:rec.short.h, cands:rec.short.cands, name:rec.short.name});
    var shown = null, tier = null, i, ti, tr, c, s, hw, hh;
    // 1) the label fits inside its own country at a readable size
    for(ti=0; ti<tiers.length && !shown; ti++){
      tr = tiers[ti];
      for(i=0;i<tr.cands.length && !shown;i++){
        c = tr.cands[i];
        if(c.rel || c.toward) continue;
        s = Math.min(nom/k, c.fit);
        if(s*k < minS) break;   // spots are sorted roomiest first, so the rest are smaller still
        hw = tr.w*s/2+pad; hh = tr.h*s/2+pad;
        if(overlapOf(c.x, c.y, hw, hh)===0){ shown = {cx:c.x, cy:c.y, s:s, fit:c.fit, hw:hw, hh:hh, over:false, anc:null}; tier = tr; }
      }
    }
    // 2) blocked: the label spills over the neighbouring flags at a readable size, but never over another label
    if(!shown && rec.anchor){
      var so = spillS/k, A = rec.anchor;
      for(ti=0; ti<tiers.length && !shown; ti++){
        tr = tiers[ti]; hw = tr.w*so/2+pad; hh = tr.h*so/2+pad;
        var spots = [], near = [];
        rec.cands.forEach(function(sc){ if(!sc.rel && !sc.toward) spots.push({x:sc.x, y:sc.y, anc:null}); });
        // then the nearest free spots around it, mostly above and below so the name stays beside its country
        [0,-0.35,0.35,-0.7,0.7,-1,1].forEach(function(fx){ [0,-1.2,1.2,-2.4,2.4,-3.6,3.6].forEach(function(fy){
          if(fx||fy) near.push({x:A[0]+fx*tr.w*so, y:A[1]+fy*tr.h*so, anc:A, d:Math.hypot(fx*tr.w*so, fy*tr.h*so)});
        }); });
        near.sort(function(a,b){ return a.d-b.d; });
        spots = spots.concat(near);
        for(i=0;i<spots.length && !shown;i++){
          if(spots[i].x-hw<0 || spots[i].x+hw>W || spots[i].y-hh<0 || spots[i].y+hh>H) continue;   // stay on the map
          if(spots[i].anc && Math.hypot(Math.max(Math.abs(spots[i].x-A[0])-hw, 0), Math.max(Math.abs(spots[i].y-A[1])-hh, 0)) > maxGap) continue;
          if(overlapOf(spots[i].x, spots[i].y, hw, hh)===0){ shown = {cx:spots[i].x, cy:spots[i].y, s:so, fit:rec.cands[0].fit, hw:hw, hh:hh, over:true, anc:spots[i].anc}; tier = tr; }
        }
      }
    }
    showWrap(rec.wrap, !!shown);
    if(!shown){ rec.leader.style('display','none'); rec.dot.style('display','none'); return; }
    if(rec.curTier!==tier.id){ rec.curTier = tier.id; rec.rect.attr('x', -tier.w/2).attr('width', tier.w); setLabelText(rec.text, tier.name, rec.base); }
    placed.push({x0:shown.cx-shown.hw, x1:shown.cx+shown.hw, y0:shown.cy-shown.hh, y1:shown.cy+shown.hh});
    d3.select(rec.el).datum({x:shown.cx, y:shown.cy, fit:shown.fit, out:shown.over, nom:nom, sp:spillS}).attr('transform','translate('+shown.cx+','+shown.cy+') scale('+shown.s+')');
    rec.wrap.attr('clip-path', shown.over ? null : rec.clip);
    var far = shown.anc && Math.hypot(shown.cx-shown.anc[0], shown.cy-shown.anc[1]) > tier.h*shown.s*0.55;
    rec.leader.style('display', far ? null : 'none').attr('x1',shown.anc ? shown.anc[0] : 0).attr('y1',shown.anc ? shown.anc[1] : 0).attr('x2',shown.cx).attr('y2',shown.cy);
    rec.dot.style('display', far ? null : 'none').attr('cx',shown.anc ? shown.anc[0] : 0).attr('cy',shown.anc ? shown.anc[1] : 0).attr('r',2.4/k);
  }
  // tapped labels are placed first, then automatic ones, biggest country first
  var order = labelRecs.slice().sort(function(a,b){ return (a.auto?1:0)-(b.auto?1:0) || (a.auto ? (b.area||0)-(a.area||0) : 0); });
  order.forEach(function(rec){
    if(rec.auto){ layoutAuto(rec); return; }
    if(rec.wrap) showWrap(rec.wrap, true);
    var best = null, i, c, s, cx, cy, hw, hh, ov, cand;
    // rule: a label stays inside its own country, and only leaves it if it is blocking or blocked by another label
    var inside = rec.cands.filter(function(c){ return !c.rel && !c.toward; }), outside = rec.cands.filter(function(c){ return !!c.rel; }), toward = rec.cands.filter(function(c){ return !!c.toward; });
    var leastIn = null, leastInOv = Infinity;
    // a narrow, tall shape whose roomiest spot is taken: slide the name toward the tip of the shape, staying inside it
    if(rec.elong>=1.4 && inside.length && toward.length){
      var f0 = inside[0], s0 = Math.min(1/k, f0.fit);
      if(overlapOf(f0.x, f0.y, rec.w*s0/2+pad, rec.h*s0/2+pad) > 0){
        toward.slice().sort(function(a,b){ return a.dist-b.dist; }).forEach(function(tc){
          if(best || tc.fit < 0.05) return;
          var ts = Math.min(1/k, tc.fit), thw = rec.w*ts/2+pad, thh = rec.h*ts/2+pad;
          if(overlapOf(tc.x, tc.y, thw, thh)===0) best = {cx:tc.x, cy:tc.y, s:ts, fit:tc.fit, hw:thw, hh:thh, over:false};
        });
      }
    }
    for(i=0;i<inside.length && !best;i++){
      c = inside[i]; s = c.fit ? Math.min(1/k, c.fit) : 1/k;
      cx = c.x; cy = c.y; hw = rec.w*s/2+pad; hh = rec.h*s/2+pad; ov = overlapOf(cx, cy, hw, hh);
      cand = {cx:cx, cy:cy, s:s, fit:c.fit, hw:hw, hh:hh, over:false};
      if(ov===0) best = cand; else if(ov<leastInOv){ leastInOv = ov; leastIn = cand; }
    }
    // a non-polygon label (a river, a crater) has no territory of its own, so its centred spot counts as "inside"
    if(!best && !rec.anchor){
      c = outside[0]; s = 1/k; cx = c.x; cy = c.y; hw = rec.w*s/2+pad; hh = rec.h*s/2+pad;
      ov = overlapOf(cx, cy, hw, hh);
      cand = {cx:cx, cy:cy, s:s, fit:0, hw:hw, hh:hh, over:false};
      if(ov===0) best = cand; else if(ov<leastInOv){ leastInOv = ov; leastIn = cand; }
      outside = outside.slice(1);
    }
    // blocked: step out of the territory to the nearest free spot, as large as is readable
    for(var fi=0; fi<floors.length && !best; fi++){
      var bestOv = Infinity, pick = null;
      for(i=0;i<outside.length;i++){
        c = outside[i];
        s = c.fit ? Math.max(Math.min(1/k, c.fit), floors[fi]/k) : 1/k;
        cx = c.x + c.rel[0]*rec.w*s; cy = c.y + c.rel[1]*rec.h*s; hw = rec.w*s/2+pad; hh = rec.h*s/2+pad;
        ov = overlapOf(cx, cy, hw, hh);
        cand = {cx:cx, cy:cy, s:s, fit:c.fit, hw:hw, hh:hh, over:!!(c.fit && s > c.fit*1.001)};
        if(ov===0){ pick = cand; bestOv = 0; break; }
        if(ov<bestOv){ bestOv = ov; pick = cand; }
      }
      if(bestOv===0) best = pick;
    }
    if(!best) best = leastIn || {cx:rec.cands[0].x, cy:rec.cands[0].y, s:1/k, fit:rec.cands[0].fit, hw:rec.w/(2*k), hh:rec.h/(2*k), over:false};
    placed.push({x0:best.cx-best.hw, x1:best.cx+best.hw, y0:best.cy-best.hh, y1:best.cy+best.hh});
    d3.select(rec.el).datum({x:best.cx, y:best.cy, fit:best.fit, out:best.over}).attr('transform','translate('+best.cx+','+best.cy+') scale('+best.s+')');
    if(rec.wrap){
      rec.wrap.attr('clip-path', best.over ? null : rec.clip);
      var far = rec.anchor && best.over && Math.hypot(best.cx-rec.anchor[0], best.cy-rec.anchor[1]) > rec.h*best.s*0.55;
      rec.leader.style('display', far ? null : 'none').attr('x1',rec.anchor ? rec.anchor[0] : 0).attr('y1',rec.anchor ? rec.anchor[1] : 0).attr('x2',best.cx).attr('y2',best.cy);
      rec.dot.style('display', far ? null : 'none').attr('cx',rec.anchor ? rec.anchor[0] : 0).attr('cy',rec.anchor ? rec.anchor[1] : 0).attr('r',2.4/k);
    }
  });
  flushFadeIns();
}
/* ---------- Mastery (2026-11-12) ----------
   Every answered map question on a nation map (Modern and the 10 historical periods; find and capital questions, practice
   rounds included) is saved per period and realm in localStorage 'pinpoint:mastery' as [times asked, last 5 scores (0-3)].
   Accuracy = mean of the last 5 scores / 3, so improvement shows. Weak < 50%, learning 50-79%, mastered 80%+.
   Explore > Mastery shades each realm by it; "Practice weak spots" builds a practice round from the weakest realms. */
var MKEY = 'pinpoint:mastery';
var MASTERY = {};
try{ MASTERY = JSON.parse(localStorage.getItem(MKEY) || '{}') || {}; }catch(e){ MASTERY = {}; }
function masteryPack(P){ P = P || pack; return !!P && P.kind==='political' && !P.isFlags && !P.isSecurity && MAP_MODES.indexOf(P.id)>=0; }
function recordResult(q, pts){
  dailyProgress(pts);
  if(!masteryPack() || !q || (q.type!=='find' && q.type!=='capital') || !pack.items[q.name]) return;
  var P = MASTERY[pack.id] || (MASTERY[pack.id] = {});
  var r = P[q.name] || (P[q.name] = [0, []]);
  r[0]++; r[1].push(pts);
  if(r[1].length > 5) r[1].shift();
  try{ localStorage.setItem(MKEY, JSON.stringify(MASTERY)); }catch(e){}
}
function masteryOf(name){
  var r = (MASTERY[pack.id] || {})[name];
  if(!r || !r[1].length) return null;
  var sum = r[1].reduce(function(a, b){ return a + b; }, 0);
  return {n:r[0], acc:sum/(3*r[1].length)};
}
function masteryBand(m){ return !m ? 'none' : m.acc>=0.8 ? 'good' : m.acc>=0.5 ? 'mid' : 'weak'; }
var mColor = d3.interpolateRgbBasis(['#d64545','#e8a33d','#3fa463']);
function masteryCounts(){
  var c = {weak:0, mid:0, good:0, none:0};
  Object.keys(pack.items).forEach(function(n){ if(isOff(n)) return; c[masteryBand(masteryOf(n))]++; });
  return c;
}
/* the weakest realms first (lowest accuracy, then the most often asked), only those below 80%, at most ten */
function weakSpots(){
  if(!masteryPack()) return [];
  return Object.keys(pack.items).filter(function(n){ var m = masteryOf(n); return m && m.acc<0.8 && !isOff(n); })
    .sort(function(a, b){ var x = masteryOf(a), y = masteryOf(b); return (x.acc - y.acc) || (y.n - x.n); })
    .slice(0, ROUNDS);
}
function startWeakPractice(){
  var list = weakSpots();
  if(!list.length) return;
  startGame(shuffle(list).map(function(n){ return {name:n, type:'find'}; }));
}
function drawMastery(){
  if(!fills) return;
  fills.selectAll('g.mastery').remove();
  var on = st.mastery && st.phase==='explore' && masteryPack();
  app.classList.toggle('mastering', !!on);
  if(!on) return;
  var mg = fills.append('g').attr('class','mastery');
  pack.features.forEach(function(f){
    var nm = f.properties && f.properties.name;
    // overseas territories (Greenland...) are not answers: grey them too, so their own flags don't stand out
    if(!nm || (!pack.items[nm] && (TERRITORY_FLAGS[pack.id] || []).indexOf(nm)<0)) return;
    var m = pack.items[nm] ? masteryOf(nm) : null;
    mg.append('path').attr('d', path(f)).attr('class', m ? 'mst' : 'mst none').attr('fill', m ? mColor(m.acc) : null);
  });
}
function refreshMastery(){
  var ok = st.phase==='explore' && masteryPack();
  $('masteryBtn').hidden = !ok;
  $('masteryBtn').setAttribute('aria-pressed', st.mastery ? 'true' : 'false');
  $('masteryBtn').classList.toggle('on', !!st.mastery);
  var show = ok && st.mastery;
  $('masteryKey').hidden = !show;
  var weak = show ? weakSpots().length : 0;
  $('exploreWeak').hidden = !weak;
  $('exploreWeak').textContent = 'Practice '+weak+' weak spot'+(weak===1 ? '' : 's');
  if(show){
    var c = masteryCounts();
    $('mkWeak').textContent = c.weak; $('mkMid').textContent = c.mid; $('mkGood').textContent = c.good; $('mkNone').textContent = c.none;
  }
}
function showWeakBtn(){
  var b = $('weakBtn'), n = (st.tab==='map' && masteryPack()) ? weakSpots().length : 0;
  b.hidden = !n;
  b.innerHTML = '<span class="wsLong">Practice my weak spots</span><span class="wsShort">Weak spots</span> ('+n+')';
}
/* ---------- Daily challenge (2026-11-13) ----------
   Everyone gets the same 10 questions on the same local calendar day: day 1 is 2026-11-13, the map rotates through the 11
   nation maps (MAP_MODES order), Medium rules, questions picked by buildQuestions with Math.random swapped for a PRNG
   seeded with the date. One play a day: the result is saved as you go, so leaving early (or reloading) counts the rest as
   missed. localStorage 'pinpoint:daily' = {last, streak, best, days:{date:{n, mode, log:[pts], done}}}. The share text
   and card are spoiler-free: squares only, no place names, no map. */
var DKEY = 'pinpoint:daily', DAILY_START = Date.UTC(2026, 10, 13);
function dayKey(d){ d = d || new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function dayNum(d){ d = d || new Date(); return Math.max(1, Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - DAILY_START)/864e5) + 1); }
function dailyMode(n){ return MAP_MODES[(n-1) % MAP_MODES.length]; }
function loadDaily(){
  var D;
  try{ D = JSON.parse(localStorage.getItem(DKEY) || '{}') || {}; }catch(e){ D = {}; }
  D.days = D.days || {}; D.streak = D.streak || 0; D.best = D.best || 0;
  return D;
}
function saveDaily(D){
  var keys = Object.keys(D.days).sort();
  while(keys.length > 60) delete D.days[keys.shift()];
  try{ localStorage.setItem(DKEY, JSON.stringify(D)); }catch(e){}
}
/* a finished daily counts toward the streak: played yesterday -> +1, otherwise it starts again at 1 */
function finishDaily(D, key){
  var rec = D.days[key];
  if(!rec || rec.done) return;
  while(rec.log.length < 10) rec.log.push(0);
  rec.done = true;
  var y = new Date(); y.setDate(y.getDate()-1);
  if(D.last !== key) D.streak = D.last===dayKey(y) ? D.streak+1 : 1;
  D.last = key; D.best = Math.max(D.best, D.streak);
  saveDaily(D);
}
function curStreak(D){
  var y = new Date(); y.setDate(y.getDate()-1);
  return (D.last===dayKey() || D.last===dayKey(y)) ? D.streak : 0;
}
function seededRandom(str){
  var h = 1779033703 ^ str.length;
  for(var i=0; i<str.length; i++){ h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  var a = h >>> 0;
  return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
function modeLabel(id){ var o = document.querySelector('#exploreMode option[value="'+id+'"]'); return o ? o.textContent : id; }
function dailySquares(log){ return log.map(function(p){ return p>=3 ? '\ud83d\udfe9' : p>0 ? '\ud83d\udfe7' : '\ud83d\udfe5'; }); }
function dailyShareData(rec, D){
  var sc = rec.log.reduce(function(a, b){ return a+b; }, 0), sq = dailySquares(rec.log), k = curStreak(D);
  var text = 'Pinpoint Daily #'+rec.n+' \u00b7 '+modeLabel(rec.mode)+'\n'+sc+'/30'+(k ? '  \ud83d\udd25 '+k : '')+'\n'+sq.slice(0,5).join('')+'\n'+sq.slice(5).join('')+'\nhttps://maxw2712-blip.github.io/pinpoint/';
  return {text:text, label:'Daily #'+rec.n+' \u00b7 '+modeLabel(rec.mode), score:sc, max:30, pts:rec.log, recap:false, extra:k ? k+'-day streak' : ''};
}
function startDaily(){
  var D = loadDaily(), key = dayKey(), n = dayNum();
  if(D.days[key]) return;
  st.dailyPrev = st.dailyPrev || {tab:st.tab, mode:st.mode, lastMap:st.lastMap, level:st.level};
  setLevel(1); setMode(dailyMode(n));
  var saved = Math.random, qs;
  Math.random = seededRandom('pinpoint-daily-'+key);
  try{ qs = buildQuestions(); } finally { Math.random = saved; }
  D.days[key] = {n:n, mode:dailyMode(n), log:[], done:false};
  saveDaily(D);
  st.dailyStart = {key:key, n:n};
  startGame(qs);
}
/* called with every logged answer in a daily game, so progress survives leaving or reloading */
function dailyProgress(pts){
  if(!st.daily) return;
  var D = loadDaily(), rec = D.days[st.daily.key];
  if(!rec || rec.done) return;
  rec.log.push(pts);
  saveDaily(D);
}
function untilTomorrow(){
  var t = new Date(); t.setHours(24, 0, 0, 0);
  var m = Math.max(1, Math.round((t - new Date())/60000));
  return m>=60 ? Math.floor(m/60)+' h '+(m%60)+' min' : m+' min';
}
/* On this day (2026-11-13): one well-known event for each calendar date (366, written from memory for Max to check;
   src/data/ONTHISDAY.json, "MM-DD": [year, text]), shown under the title on the menu. Informational only, no question. */
var OTD = __JSON__("data/ONTHISDAY.json");
function showOtd(){
  var d = new Date(), e = OTD[String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')];
  $('otd').hidden = !e;
  if(!e) return;
  $('otdTag').textContent = 'On this day, '+e[0]+':';
  $('otdText').textContent = e[1];
}
function showDaily(){
  showOtd();
  var D = loadDaily(), key = dayKey(), n = dayNum();
  // an unfinished daily from an earlier visit (page closed mid-game) is settled now
  Object.keys(D.days).forEach(function(k){ if(!D.days[k].done && !(st.daily && st.daily.key===k)) finishDaily(D, k); });
  D = loadDaily();
  var rec = D.days[key], k = curStreak(D);
  $('dailyTitle').textContent = 'Daily #'+n+' \u00b7 '+modeLabel(dailyMode(n));
  if(rec && rec.done){
    var sc = rec.log.reduce(function(a, b){ return a+b; }, 0);
    $('dailySub').textContent = sc+'/30 '+dailySquares(rec.log).join('')+' \u00b7 next in '+untilTomorrow();
    $('dailyBtn').textContent = 'Share'; $('dailyBtn').classList.remove('primary');
  } else {
    $('dailySub').textContent = 'Medium \u00b7 same 10 questions for all';
    $('dailyBtn').textContent = 'Play'; $('dailyBtn').classList.add('primary');
  }
  $('dailyStreak').textContent = k ? '\ud83d\udd25 '+k : '';
  $('dailyStreak').title = k ? k+'-day streak (best '+D.best+')' : '';
  $('dailyStreak').hidden = !k;
}
/* Explore: a realm with no flag of its own is shaded in a muted colour for its region, so the map reads as complete. */
var REGION_TINT = {Europe:'eu', Asia:'as', Africa:'af', Americas:'am', Oceania:'oc'};
function tintRealm(key){
  var it = pack.items[key], cls = it && REGION_TINT[it.reg];
  if(!cls) return;
  fills.selectAll('.ptint').filter(function(){ return this.getAttribute('data-key')===key; }).remove();
  pack.features.filter(function(x){ return x.properties.name===key; }).forEach(function(f){
    fills.insert('path', ':first-child').attr('class','ptint t-'+cls).attr('data-key',key).attr('d', path(f));
  });
}
/* The flag becomes the country: every piece of it (Alaska, Hawaii, islands, the scattered parts of an empire) gets its own
   copy of the flag, sized to that piece, so the whole territory is covered. */
function paintFlag(key, fill, feat){
    // the flag becomes the country: every piece of it (Alaska, Hawaii, islands, overseas territories, the scattered
    // parts of an empire) gets its own copy of the flag, sized to that piece, so the whole territory is covered
    fills.selectAll('.pfill, .pfillEdge').filter(function(){ return this.getAttribute('data-key')===key; }).remove();
    var feats = pack.features ? pack.features.filter(function(x){ return x.properties.name===key; }) : [];
    if(!feats.length) feats = [feat];
    var painted = false;
    feats.forEach(function(f){
      var g = f.geometry; if(!g) return;
      var polys = g.type==='MultiPolygon' ? g.coordinates.map(function(c){ return {type:'Polygon', coordinates:c}; }) : [g];
      polys.forEach(function(pc){
        var pb = path.bounds(pc), pw = pb[1][0]-pb[0][0], ph = pb[1][1]-pb[0][1];
        if(!(pw>0 && ph>0)) return;
        var pcid = 'fc'+(++clipN);
        var pg = fills.append('g').attr('class','pfill').attr('data-key',key).attr('clip-path','url(#'+pcid+')');
        pg.append('clipPath').attr('id',pcid).append('path').attr('d', path(pc));
        // "slice" keeps the flag's proportions and still covers the whole box; very long or tall pieces stretch instead
        pg.append('image').attr('href',fill).attr('x',pb[0][0]).attr('y',pb[0][1]).attr('width',pw).attr('height',ph)
          .attr('preserveAspectRatio', (pw/ph >= 0.8 && pw/ph <= 2.0) ? 'xMidYMid slice' : 'none');
        painted = true;
      });
      fills.append('path').attr('class','pfillEdge').attr('data-key',key).attr('d', path(f));
    });
    if(painted && paths) paths.filter(function(d){ return d.properties.name===key; }).classed('flagged', true);
    var mg = fills.select('g.mastery');
    if(!mg.empty()) mg.raise();
}
/* Label text: the name in bold, the capital lighter and smaller. Handles "Kenya (Nairobi)" and merged names such as
   "Egypt (New Kingdom · Thebes)" (base "Egypt (New Kingdom)"). */
function labelParts(name, base){
  if(!base || name===base) return [{t:name}];
  if(name.indexOf(base+' (')===0 && name.slice(-1)===')') return [{t:base}, {t:name.slice(base.length), cap:true}];
  var stem = base.slice(-1)===')' ? base.slice(0,-1) : null;
  if(stem && name.indexOf(stem+' \u00b7 ')===0 && name.slice(-1)===')') return [{t:stem}, {t:name.slice(stem.length,-1), cap:true}, {t:')'}];
  return [{t:name}];
}
function labelTextW(name, base){
  return labelParts(name, base).reduce(function(w, p){ return w + p.t.length*(p.cap ? 5.3 : 6.3); }, 0);
}
function setLabelText(sel, name, base){
  sel.selectAll('tspan').remove(); sel.text(null);
  labelParts(name, base).forEach(function(p){ sel.append('tspan').attr('class', p.cap ? 'pcap' : null).text(p.t); });
}
function placeLabel(info, key, xy, feat, opts){
  var auto = !!(opts && opts.auto);
  if(!auto) st.lastKey = key;
  if(!labels || !xy || isNaN(xy[0]) || isNaN(xy[1])) return;
  labels.selectAll('g.plabelwrap').filter(function(){ return this.getAttribute('data-key')===key; }).remove();
  leads.selectAll('*').filter(function(){ return this.getAttribute('data-key')===key; }).remove();
  var k = d3.zoomTransform(svg.node()).k;
  var flags = info.flags || [], fw = flags.length>1 ? 24 : 30, fh = fw*0.75, gap = 4;
  var rowW = flags.length ? flags.length*fw+(flags.length-1)*gap : 0;
  var boxW = Math.max(labelTextW(info.name, info.base)+14, rowW+14), boxH = (flags.length ? fh+8 : 0)+20;
  // inside a country the label may never outgrow it, so it can't cover its neighbours
  var fit = feat ? labelFit(feat, boxW, boxH) : null;
  var anchor = fit ? fit.xy : xy;
  var REL = [[0,0]];
  [1.1,2.2,3.3].forEach(function(r){ [[0,-1],[0,1],[1,0],[-1,0],[0.8,-0.8],[-0.8,-0.8],[0.8,0.8],[-0.8,0.8]].forEach(function(d){ REL.push([d[0]*r, d[1]*r]); }); });
  var cands;
  if(fit){
    cands = fit.cands.slice();
    fit.toward.forEach(function(tw){ cands.push(tw); });
    REL.forEach(function(r){ cands.push({x:fit.cands[0].x, y:fit.cands[0].y, fit:fit.cands[0].fit, rel:r}); });
  } else cands = REL.map(function(r){ return {x:xy[0], y:xy[1], fit:0, rel:r}; });
  labelRecs = labelRecs.filter(function(r){ return r.key!==key; });
  if(info.fill && feat) paintFlag(key, info.fill, feat);
  var wrap = labels.append('g').attr('class','plabelwrap lbl-off').attr('data-key',key);
  var clipRef = null;
  if(feat){
    var cid = 'lc'+(++clipN);
    wrap.append('clipPath').attr('id',cid).append('path').attr('d', path(feat));
    clipRef = 'url(#'+cid+')';
    wrap.attr('clip-path', clipRef);
  }
  var leader = leads.append('line').attr('class','pleader').attr('data-key',key).style('display','none');
  var dot = leads.append('circle').attr('class','pdot').attr('data-key',key).style('display','none');
  var s0 = fit ? Math.min(1/k, fit.s) : 1/k;
  var el = wrap.append('g').attr('class','plabel').datum({x:anchor[0], y:anchor[1], fit:fit ? fit.s : 0})
    .attr('transform','translate('+anchor[0]+','+anchor[1]+') scale('+s0+')');
  var box = el.append('rect').attr('class','pbox').attr('x',-boxW/2).attr('y',-boxH/2).attr('width',boxW).attr('height',boxH).attr('rx',6);
  // thin edge in the realm's flag colours: the flag itself, stretched over the box, used as the stroke
  if(info.fill){
    var pid = 'pe'+(++clipN);
    el.append('pattern').attr('id',pid).attr('patternUnits','userSpaceOnUse').attr('x',-boxW/2).attr('y',-boxH/2).attr('width',boxW).attr('height',boxH)
      .append('image').attr('href',info.fill).attr('width',boxW).attr('height',boxH).attr('preserveAspectRatio','none');
    box.style('stroke','url(#'+pid+')').classed('flagEdge', true);
  } else {
    var reg = pack.items && pack.items[key] && REGION_TINT[pack.items[key].reg];
    if(reg) box.classed('edge-'+reg, true);
  }
  flags.forEach(function(src,i){
    var x = -rowW/2+i*(fw+gap), y = -boxH/2+5;
    el.append('image').attr('href',src).attr('x',x).attr('y',y).attr('width',fw).attr('height',fh).attr('preserveAspectRatio','xMidYMid slice');
    el.append('rect').attr('class','pfr').attr('x',x).attr('y',y).attr('width',fw).attr('height',fh);
  });
  setLabelText(el.append('text').attr('text-anchor','middle').attr('x',0).attr('y',boxH/2-6), info.name, info.base);
  var short = null;
  if(auto && feat && info.base && info.base!==info.name){
    var w2 = Math.max(info.base.length*6.3+14, rowW+14), f2 = labelFit(feat, w2, boxH);
    if(f2) short = {w:w2, h:boxH, name:info.base, cands:f2.cands};
  }
  labelRecs.push({key:key, short:short, rect:el.select('rect.pbox'), text:el.select('text'), fullName:info.name, base:info.base, auto:auto, area:fit ? fit.area : 0, w:boxW, h:boxH, elong:fit ? fit.elong : 0, cands:cands, el:el.node(), wrap:wrap, clip:clipRef, leader:leader, dot:dot, anchor:fit ? [fit.cands[0].x, fit.cands[0].y] : null});
  if(!(opts && opts.defer)) layoutLabels();
}
function labelXY(label, fallback){
  var it = pack.items[label];
  if(pack.kind==='planet' && it) return proj([it.lon, it.lat]);
  var f = it ? pack.byName[label] : null;
  return f ? path.centroid(bigPart(f)) : fallback;
}
/* which modern countries does a feature sit in? (used for flags on realms and landforms) */
var peekCache = {}, modernB = null;
function modernBoxes(){
  if(modernB) return modernB;
  modernB = getPack('modern').features.map(function(cf){ return {name:cf.properties.name, f:cf, b:d3.geoBounds(cf)}; });
  return modernB;
}
function inBox(b, lon, lat){
  if(lat<b[0][1] || lat>b[1][1]) return false;
  return b[0][0]<=b[1][0] ? (lon>=b[0][0] && lon<=b[1][0]) : (lon>=b[0][0] || lon<=b[1][0]);
}
function samplePoints(f){
  var pts = [], g = f.geometry, i, j;
  if(g.type==='LineString' || g.type==='MultiLineString'){
    var lines = g.type==='LineString' ? [g.coordinates] : g.coordinates, all = [];
    lines.forEach(function(l){ l.forEach(function(c){ all.push(c); }); });
    var step = Math.max(1, Math.floor(all.length/40));
    for(i=0;i<all.length;i+=step) pts.push(all[i]);
    return pts;
  }
  var b = d3.geoBounds(f), w = b[0][0], e = b[1][0];
  if(w>e) e += 360;
  var n = 18;
  for(i=0;i<n;i++) for(j=0;j<n;j++){
    var lon = w+(e-w)*(i+0.5)/n, lat = b[0][1]+(b[1][1]-b[0][1])*(j+0.5)/n;
    if(lon>180) lon -= 360;
    if(d3.geoContains(f,[lon,lat])) pts.push([lon,lat]);
  }
  if(!pts.length) pts.push(d3.geoCentroid(f));
  return pts;
}
function countriesFor(f, key){
  if(key in peekCache) return peekCache[key];
  var counts = {}, boxes = modernBoxes(), pts = samplePoints(f), total = 0;
  pts.forEach(function(pt){
    for(var i=0;i<boxes.length;i++){
      var B = boxes[i];
      if(inBox(B.b, pt[0], pt[1]) && d3.geoContains(B.f, pt)){ counts[B.name] = (counts[B.name]||0)+1; total++; break; }
    }
  });
  var names = Object.keys(counts).sort(function(a,b){ return counts[b]-counts[a]; })
    .filter(function(n){ return counts[n] >= Math.max(1, total*0.1); }).slice(0,3);
  peekCache[key] = names;
  return names;
}
function modernName(n){ var it = getPack('modern').items[n]; return it ? it.disp : n; }
/* While exploring, a nation's capital is shown in parentheses after its name (merged into existing parentheses). */
function withCap(dn, it, name){
  if(st.phase!=='explore' || !it) return dn;
  var extra = it.cap;
  if(st.mastery && masteryPack()){
    var m = name ? masteryOf(name) : null;
    extra = m ? Math.round(m.acc*100)+'%' : null;
  }
  if(!extra) return dn;
  return /\)$/.test(dn) ? dn.slice(0,-1)+' \u00b7 '+extra+')' : dn+' ('+extra+')';
}
function peekFor(name){
  if(!name) return {name:'Unclaimed land'};
  var it = pack.items[name];
  if(pack.id==='modern' || pack.isFlags || pack.isSecurity){
    return {base:disp(name), name:withCap(disp(name), it, name), flags:[], fill:FLAGS[name] || null, sub:(it && it.cap) ? 'Capital: '+it.cap : ''};
  }
  var dn = it ? it.disp : name;
  if(rflag(dn)){
    // this realm flew a flag of its own, so paint it in
    return {base:dn, name:withCap(dn, it, name), flags:[], fill:rflag(dn), sub:(it && it.cap) ? 'Capital: '+it.cap : ''};
  }
  // realms with no flag of their own: show the countries that cover their land today
  var f = pack.byName[name], cs = f ? countriesFor(f, pack.id+':'+name) : [];
  var sub = ((it && it.cap) ? 'Capital: '+it.cap+'. ' : '') + (cs.length ? 'Today: '+cs.map(modernName).join(', ') : '');
  return {base:dn, name:withCap(dn, it, name), flags:cs.map(function(n){ return FLAGS[n]; }).filter(Boolean), sub:sub};
}
function peekPhys(label){
  var it = pack.items[label];
  if(!it) return {name:label.charAt(0).toUpperCase()+label.slice(1)};
  if(pack.kind==='planet'){
    var c = proj([it.lon, it.lat]);
    return {name:it.disp, sub:it.noun+' on '+BODIES[it.body].label, thumb:{body:it.body, x:c[0], y:c[1]}};
  }
  var cs = (it.cat==='waters' && it.noun!=='lake' && it.noun!=='') ? [] : countriesFor(pack.byName[label], 'geo:'+label);
  return {name:it.disp, flags:cs.map(function(n){ return FLAGS[n]; }).filter(Boolean), sub:it.noun+(cs.length ? ' \u00b7 '+cs.map(modernName).join(', ') : '')};
}
function onPick(el, name){
  if((st.phase!=='play' && st.phase!=='explore') || pack.kind!=='political') return;
  if(!name) return;   // unclaimed land is not a place you can answer with or inspect
  if(st.devPick){ devPointed(name); return; }
  var cxy = path.centroid(bigPart(d3.select(el).datum()));
  placeLabel(peekFor(name), name || ('bg:'+cxy.join(',')), cxy, bigFeature(name, d3.select(el).datum()));
  if(st.phase==='explore' || st.locked) return;
  if(name && isOff(name)) return;
  if(!name && st.region!=='World') return;
  var q = st.qs[st.i];
  var qi = pack.items[q.name];
  if(qi && qi.choke) return;   // strait questions are answered by location (see secPick)
  if(name===q.name || (name && qi.answers && qi.answers.indexOf(name)>=0)) correct(); else wrong(name ? disp(name) : 'unclaimed land', el);
}

/* physical click */
function distToSeg(p,a,b){
  var dx=b[0]-a[0], dy=b[1]-a[1], l2=dx*dx+dy*dy, t=0;
  if(l2>0){ t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/l2; t=Math.max(0,Math.min(1,t)); }
  return Math.hypot(p[0]-(a[0]+t*dx), p[1]-(a[1]+t*dy));
}
function riverDist(name, p){
  var best=Infinity, lines=pack.riverPts[name];
  for(var i=0;i<lines.length;i++){
    var L=lines[i];
    for(var j=1;j<L.length;j++){
      var d=distToSeg(p,L[j-1],L[j]); if(d<best) best=d;
    }
  }
  return best;
}
function isMarine(it){ return it.cat==='waters' && it.noun!=='lake'; }
function llAt(pt){
  var ll = proj.invert(pt);
  if(!ll || isNaN(ll[0]) || isNaN(ll[1])) return null;
  var back = proj(ll);
  if(!back || Math.hypot(back[0]-pt[0], back[1]-pt[1]) > 1.5) return null;
  return ll;
}
function hitsTarget(p, k, name){
  var it = pack.items[name];
  if(it.cat==='rivers') return riverDist(name,p) <= 9/k;
  var f = pack.byName[name], pts = [p];
  if(!isMarine(it)){
    var r = 6/k;
    for(var a=0;a<8;a++) pts.push([p[0]+r*Math.cos(a*Math.PI/4), p[1]+r*Math.sin(a*Math.PI/4)]);
  }
  for(var i=0;i<pts.length;i++){
    var ll = llAt(pts[i]); if(!ll) continue;
    if(!d3.geoContains(f, ll)) continue;
    if(isMarine(it) && d3.geoContains(pack.landF, ll)) continue;
    return true;
  }
  return false;
}
function describeClick(p, k){
  var ll = llAt(p), best=null, bd=9/k, n;
  var rivers = Object.keys(pack.riverPts);
  for(var i=0;i<rivers.length;i++){
    n = rivers[i]; if(isOff(n)) continue;
    var d = riverDist(n,p); if(d<bd){ bd=d; best=n; }
  }
  if(best) return best;
  var onLand = ll ? d3.geoContains(pack.landF, ll) : false;
  if(ll){
    for(var j=0;j<pack.polyList.length;j++){
      n = pack.polyList[j]; if(isOff(n)) continue;
      var it = pack.items[n];
      if(isMarine(it) && onLand) continue;
      if(d3.geoContains(pack.byName[n], ll)) return n;
    }
  }
  return onLand ? 'open land' : 'open water';
}
function mark(p, good, k){
  var c = marks.append('circle').attr('class','mark '+(good?'good':'bad')).attr('cx',p[0]).attr('cy',p[1]).attr('r',9/k);
  setTimeout(function(){ c.remove(); }, 800);
}
function planetTol(p, k){
  var ll = llAt(p), ll2 = llAt([p[0]+14/k, p[1]]);
  if(!ll) return 0;
  return ll2 ? d3.geoDistance(ll, ll2) : 0.05;
}
function planetDist(ll, it){
  var best = Infinity;
  for(var i=0;i<it.pts.length;i++){ var d = d3.geoDistance(ll, it.pts[i]); if(d<best) best=d; }
  return best;
}
function planetHit(p, k, name){
  var ll = llAt(p); if(!ll) return false;
  var it = pack.items[name];
  return planetDist(ll, it) <= Math.max(it.radRad, planetTol(p,k));
}
function describePlanet(p, k){
  var ll = llAt(p); if(!ll) return 'open terrain';
  var tol = planetTol(p,k), best = null, bestSize = Infinity;
  Object.keys(pack.items).forEach(function(n){
    var it = pack.items[n];
    if(it.body!==curBody) return;
    if(planetDist(ll,it) <= Math.max(it.radRad, tol*0.6) && it.radRad < bestSize){ best = n; bestSize = it.radRad; }
  });
  return best || 'unnamed terrain';
}
function secPick(p, k, q){
  if(st.locked) return;
  var ll = llAt(p), ch = pack.items[q.name].ch;
  var hit = d3.geoDistance(ll, [ch.lon, ch.lat]) <= Math.max(ch.rad/6371, planetTol(p,k));
  mark(p, hit, k);
  if(hit){ placeLabel({name:ch.disp}, ch.disp, proj([ch.lon, ch.lat])); correct(); }
  else wrong('not it', null);
}
function physPick(ev){
  if(pack.kind==='trivia' || (st.phase!=='play' && st.phase!=='explore')) return;
  var cq = st.qs[st.i];
  var secChoke = st.phase==='play' && pack.isSecurity && cq && pack.items[cq.name] && pack.items[cq.name].choke;
  if(pack.kind==='political' && !secChoke) return;
  var p = d3.pointer(ev, g.node());
  if(!llAt(p)) return;
  var k = d3.zoomTransform(svg.node()).k, q = st.qs[st.i];
  if(st.devPick){ devPointed(pack.isSecurity ? 'open water' : (pack.kind==='planet' ? describePlanet(p,k) : describeClick(p,k))); return; }
  if(secChoke){ secPick(p, k, q); return; }
  if(st.phase==='explore'){ var le = pack.kind==='planet' ? describePlanet(p,k) : describeClick(p,k); placeLabel(peekPhys(le), le, labelXY(le,p)); return; }
  if(st.locked){ var l0 = pack.kind==='planet' ? describePlanet(p,k) : describeClick(p,k); placeLabel(peekPhys(l0), l0, labelXY(l0,p)); return; }
  var hit = pack.kind==='planet' ? planetHit(p, k, q.name) : hitsTarget(p, k, q.name);
  mark(p, hit, k);
  if(hit){ placeLabel(peekPhys(q.name), q.name, labelXY(q.name,p)); correct(); }
  else { var lab = pack.kind==='planet' ? describePlanet(p,k) : describeClick(p,k); placeLabel(peekPhys(lab), lab, labelXY(lab,p)); wrong(lab, null); }
}

function targetPaths(){
  var q = st.qs[st.i], it = pack.items[q.name], set = (it && it.answers) ? it.answers : [q.name];
  return paths.filter(function(d){ return set.indexOf(d.properties.name)>=0; });
}
function lift(sel){
  sel.filter(function(){ return !this.classList.contains('sea'); }).raise();
  if(fills) fills.raise();
  if(labels) labels.raise();
  if(marks) marks.raise();
  return sel;
}

function correct(){
  var q = st.qs[st.i], pts = LEVELS[st.level].pts[st.tries];
  stopTimer();
  st.locked = true; st.score += pts;
  st.log.push({q:q, pts:pts});
  recordResult(q, pts);
  var hitSel = lift(targetPaths()).classed('hit', true);
  $('score').textContent = st.score;
  $('act').disabled = true;
  var qi = pack.items[q.name];
  toast('Correct, +'+pts+(qi.hist ? '. That was the flag of '+qi.disp+'.' : ''), true);
  if(qi.fact) $('hint').textContent = qi.fact;
  // motion: zoom to the country and give it a gold pulse (the next question restores the view)
  var zoomed = false;
  if(!reduce){
    var target = qi.answers ? null : q.name;
    if(target && pack.byName[target] && !((pack.id==='ww2' || pack.id==='coldwar') && SCATTERED[q.name])){
      st.saved = d3.zoomTransform(svg.node()); moveTo(viewForFeature(target)); zoomed = true;
    }
    hitSel.classed('goldPulse', false); void (hitSel.node() && hitSel.node().getBBox);
    hitSel.classed('goldPulse', true);
  }
  later(advance, qi.fact ? 2800 : (zoomed ? 1700 : 1100));
}

function nearby(name){
  var f = pack.byName[name]; if(!f) return [];
  var c = d3.geoCentroid(f);
  var names = Object.keys(pack.items).filter(function(n){ return n!==name && pack.byName[n]; });
  var withD = names.map(function(n){ return {n:n, d:d3.geoDistance(c, d3.geoCentroid(pack.byName[n]))}; });
  withD.sort(function(a,b){ return a.d-b.d; });
  return withD.slice(0,3).map(function(x){ return x.n; });
}
var contCache = {};
function continentOf(name){
  if(name in contCache) return contCache[name];
  var m = getPack('modern'), c = d3.geoCentroid(pack.byName[name]), out = null;
  for(var i=0;i<m.features.length;i++){
    var f = m.features[i];
    if(d3.geoContains(f, c)){ out = m.items[f.properties.name] ? m.items[f.properties.name].reg : null; break; }
  }
  contCache[name] = out; return out;
}

/* A small shake for a wrong answer: the tapped shape (amplitude fixed in screen pixels at any zoom), or the question card
   when there is no shape (a missed river, sea or point). Skipped with reduced motion. */
function shake(el){
  if(reduce) return;
  var n = el || document.querySelector('#hudTop .prompt');
  if(!n) return;
  if(el) n.style.setProperty('--shk', (3/d3.zoomTransform(svg.node()).k)+'px');
  n.classList.remove(el ? 'shakeMap' : 'shakeCard');
  void n.getBoundingClientRect();
  n.classList.add(el ? 'shakeMap' : 'shakeCard');
  setTimeout(function(){ n.classList.remove('shakeMap', 'shakeCard'); }, 450);
}
function wrong(label, el){
  var q = st.qs[st.i], lvl = effLevel(), it = pack.items[q.name];
  st.tries++; setPips();
  if(el){
    var sel = d3.select(el).classed('miss', true);
    later(function(){ sel.classed('miss', false); }, 650);
  }
  shake(el);
  if(st.tries>=lvl.tries){ reveal(label); return; }
  var left = lvl.tries - st.tries;
  toast('That\u2019s '+label+'. '+left+(left===1?' try':' tries')+' left.');
  if(!lvl.hints) return;
  var h;
  if(st.tries===1){
    if(pack.kind==='planet'){
      h = 'Hint: it\u2019s in the '+(it.lat>=0 ? 'northern' : 'southern')+' hemisphere.';
    } else if(pack.kind==='physical'){
      var c = continentOf(q.name);
      h = c ? 'Hint: it\u2019s in or near '+regionPhrase(c)+'.' : 'Hint: the name has '+it.disp.length+' letters.';
    } else {
      h = 'Hint: it '+(pack.past?'was':'is')+' in '+regionPhrase(it.reg)+'.';
    }
  } else if(q.type==='sec'){
    h = 'Hint: one answer starts with \u201c'+disp(it.answers[0]).charAt(0)+'\u201d.';
  } else if(q.type==='flag'){
    h = it.cap ? 'Hint: its capital is '+it.cap+'.' : 'Hint: the name starts with \u201c'+it.disp.charAt(0)+'\u201d.';
  } else if(pack.kind!=='political' || q.type==='capital'){
    h = 'Hint: the name starts with \u201c'+it.disp.charAt(0)+'\u201d.';
  } else {
    var nb = (pack.neighbors && pack.neighbors[q.name] && pack.neighbors[q.name].length) ? pack.neighbors[q.name] : nearby(q.name);
    h = nb.length ? 'Hint: '+(pack.neighbors && pack.neighbors[q.name] && pack.neighbors[q.name].length ? 'it shares a border with ' : 'it lies near ')+pack.items[nb[Math.floor(Math.random()*nb.length)]].disp+'.'
                  : 'Hint: it\u2019s small, so try zooming in.';
  }
  $('hint').textContent = h;
}

function viewForFeature(name){
  var f = pack.byName[name];
  if(!f) return d3.zoomIdentity;
  var bb = path.bounds(bigPart(f));
  var w=bb[1][0]-bb[0][0], h=bb[1][1]-bb[0][1];
  var frac = pack.kind==='political' ? 0.3 : 0.5;
  var k = Math.max(1.4, Math.min(7, frac/Math.max(w/W, h/H, 0.001)));
  var cx=(bb[0][0]+bb[1][0])/2, cy=(bb[0][1]+bb[1][1])/2;
  return d3.zoomIdentity.translate(W/2-k*cx, H/2-k*cy).scale(k);
}

function reveal(clicked, timedOut){
  if(pack.kind==='trivia'){ triviaReveal(timedOut); return; }
  if(st.revealed) return;
  var q = st.qs[st.i], it = pack.items[q.name];
  stopTimer();
  st.locked = true; st.revealed = true; st.tries = LEVELS[st.level].tries; setPips();
  st.log.push({q:q, pts:0});
  recordResult(q, 0);
  lift(targetPaths()).classed('reveal', true);
  st.saved = d3.zoomTransform(svg.node());
  moveTo(((it.answers && it.answers.length>3) || ((pack.id==='ww2' || pack.id==='coldwar') && SCATTERED[q.name])) ? d3.zoomIdentity : viewForFeature(it.answers ? it.answers[0] : q.name));
  var last = st.i >= st.qs.length-1;
  var what = q.type==='flag' ? 'the flag of '+it.disp : it.disp;
  if(q.type==='sec') what = it.ansText;
  if(it.hist) what += ' (now '+it.answers.slice(0,3).map(disp).join(', ')+(it.answers.length>3 ? ' and others' : '')+')';
  toast(timedOut ? 'Time\u2019s up. It was '+what+'.' : clicked ? 'That\u2019s '+clicked+'. It was '+what+'.' : 'It was '+what+'.', false, true);
  $('hint').textContent = q.type==='capital' ? it.cap+' was the capital of '+it.disp+'.' : 'Take a good look, then keep going.';
  if(q.type==='capital' && !pack.past) $('hint').textContent = it.cap+' is the capital of '+it.disp+'.';
  if(q.type==='sec') $('hint').textContent = it.fact;
  var act = $('act'); act.textContent = last ? 'See results' : 'Next country'; act.disabled=false; act.classList.add('primary');
  if(pack.kind==='physical') act.textContent = last ? 'See results' : 'Next feature';
  else if(pack.past) act.textContent = last ? 'See results' : (pack.noun==='realm' ? 'Next realm' : 'Next country');
  act.focus({preventScroll:true});
  autoNext();
}

function advance(){
  clearTimers(); hideToast();
  paths.classed('hit miss reveal goldPulse', false);
  marks.selectAll('*').remove();
  st.i++;
  if(st.i >= st.qs.length){ endGame(); return; }
  if(st.saved){ moveTo(st.saved); st.saved=null; }
  showQuestion();
}

$('act').addEventListener('click', function(){
  if(st.phase!=='play') return;
  if(st.revealed) advance(); else if(!st.locked) reveal();
});

/* ---------- End screen: score count-up, recap map, shareable summary ---------- */
function countUp(el, to){
  if(reduce || to<=0){ el.textContent = to; return; }
  var t0 = performance.now(), dur = Math.min(1400, 500+to*35);
  el.textContent = '0';
  (function step(t){
    var x = Math.min(1, (t-t0)/dur), e = 1-Math.pow(1-x, 3);
    el.textContent = Math.round(to*e);
    if(x<1) requestAnimationFrame(step);
  })(t0);
}
/* What each logged question points at on the map: features (filled or stroked) and/or a lat-lon point. */
function recapTargets(e){
  var it = pack.items[e.q.name], out = {feats:[], pts:[]};
  if(!it) return out;
  if(it.choke && it.lat!==undefined) out.pts.push([it.lon, it.lat]);
  if(it.ch && it.ch.lat!==undefined) out.pts.push([it.ch.lon, it.ch.lat]);
  var names = it.answers ? it.answers.slice() : [e.q.name];
  names.forEach(function(n){
    (pack.features || []).forEach(function(f){ if(f.properties && f.properties.name===n) out.feats.push(f); });
  });
  if(!out.feats.length && pack.byName && pack.byName[e.q.name]) out.feats.push(pack.byName[e.q.name]);
  return out;
}
var RECAP = {hit:'#2e9e5b', part:'#e8890c', miss:'#d9482b', base:'#c7d3d8', edge:'#ffffff', sea:'#e8f0f3', ink:'#0d2a3a'};
/* The recap is drawn with plain attributes (no CSS classes), so the same SVG can be turned into the share image. */
function drawRecap(){
  var wrap = $('recapWrap'), svgEl = d3.select('#recapMap');
  svgEl.selectAll('*').remove();
  if(pack.kind==='trivia' || pack.kind==='planet' || !st.log.length){ wrap.hidden = true; return; }
  wrap.hidden = false;
  var dark = app.classList.contains('era-night') || document.documentElement.getAttribute('data-theme')==='dark' ||
             (document.documentElement.getAttribute('data-theme')!=='light' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  var C = dark ? {hit:'#3fc27a', part:'#ffa33a', miss:'#ff6a4d', base:'#36566a', edge:'#0f2b3d', sea:'#0f2b3d', ink:'#e8f2f5'} : RECAP;
  svgEl.append('path').attr('d', path({type:'Sphere'})).attr('fill', C.sea);
  var base = pack.kind==='political' ? pack.features : (pack.landF ? [pack.landF] : []);
  svgEl.append('g').selectAll('path').data(base).join('path').attr('d', path).attr('fill', C.base).attr('stroke', C.edge).attr('stroke-width', 0.4);
  var marks = svgEl.append('g'), dots = svgEl.append('g'), bb = null;
  function grow(b){ if(!b || !isFinite(b[0][0])) return; bb = bb ? [[Math.min(bb[0][0],b[0][0]),Math.min(bb[0][1],b[0][1])],[Math.max(bb[1][0],b[1][0]),Math.max(bb[1][1],b[1][1])]] : b; }
  st.log.forEach(function(e){
    // green = first try, orange = found after one or two misses, red = missed
    var full = LEVELS[st.level].pts[0], col = e.pts>=full ? C.hit : e.pts>0 ? C.part : C.miss, t = recapTargets(e);
    t.feats.forEach(function(f){
      var line = f.geometry && /LineString/.test(f.geometry.type);
      marks.append('path').attr('d', path(f)).attr('fill', line ? 'none' : col).attr('fill-opacity', line ? null : 0.85)
        .attr('stroke', line ? col : C.edge).attr('stroke-width', line ? 2.4 : 0.5);
      var b = path.bounds(f); grow(b);
      // a dot on every answer, so micro-states, straits and islands still show at this size
      var c = (f.geometry && f.geometry.type==='MultiPolygon') ? path.centroid(bigPart(f)) : path.centroid(f);
      if(isFinite(c[0])) dots.append('circle').attr('cx', c[0]).attr('cy', c[1]).attr('r', 4.2).attr('fill', col).attr('stroke', C.edge).attr('stroke-width', 1.2);
    });
    t.pts.forEach(function(ll){
      var p = proj(ll); if(!p) return;
      dots.append('circle').attr('cx', p[0]).attr('cy', p[1]).attr('r', 5).attr('fill', col).attr('stroke', C.edge).attr('stroke-width', 1.4);
      grow([[p[0]-8,p[1]-8],[p[0]+8,p[1]+8]]);
    });
  });
  // frame the answers (2:1, with some margin), never smaller than a fifth of the world
  if(!bb) bb = [[0,0],[W,H]];
  var cx = (bb[0][0]+bb[1][0])/2, cy = (bb[0][1]+bb[1][1])/2, w = Math.max(bb[1][0]-bb[0][0]+60, (bb[1][1]-bb[0][1]+40)*2, W/5);
  w = Math.min(w, W); var h = w/2;
  var x0 = Math.max(0, Math.min(W-w, cx-w/2)), y0 = Math.max(0, Math.min(H-h, cy-h/2));
  svgEl.attr('viewBox', [x0, y0, w, h].join(' ')).attr('preserveAspectRatio','xMidYMid meet');
  dots.selectAll('circle').attr('r', function(){ return +this.getAttribute('r')*w/W; }).attr('stroke-width', function(){ return +this.getAttribute('stroke-width')*w/W; });
  marks.selectAll('path').attr('stroke-width', function(){ return +this.getAttribute('stroke-width')*Math.max(0.35, w/W); });
}
function setupLabel(){
  var m = document.querySelector('.seg[data-key="mode"] button[data-v="'+st.mode+'"]');
  var parts = [st.tab==='map' && m ? m.textContent : TAB_NAMES[st.tab], LEVELS[st.level].label];
  if(st.region && st.region!=='World') parts.push(st.region);
  return parts.join(' · ');
}
function shareText(){
  var max = st.qs.length*3;
  var squares = st.log.map(function(e){ return e.pts>=3 ? '🟩' : e.pts>0 ? '🟧' : '🟥'; }).join('');
  return 'Pinpoint · '+setupLabel()+'\n'+st.score+'/'+max+'  '+squares+'\nhttps://maxw2712-blip.github.io/pinpoint/';
}
/* The summary card: 1200x630 PNG with the setup, score, one square per question and the recap map. */
function gameShareData(){
  if(st.daily){ var D = loadDaily(), rec = D.days[st.daily.key]; if(rec) return dailyShareData(rec, D); }
  return {text:shareText(), label:setupLabel(), score:st.score, max:st.qs.length*3, pts:st.log.map(function(e){ return e.pts; }), recap:true, extra:''};
}
function shareImage(data){
  data = data || gameShareData();
  return new Promise(function(resolve){
    var Wc = 1200, Hc = 630, cv = document.createElement('canvas'); cv.width = Wc; cv.height = Hc;
    var c = cv.getContext('2d'), max = data.max;
    c.fillStyle = '#0d2a3a'; c.fillRect(0, 0, Wc, Hc);
    c.fillStyle = '#f0b400'; c.fillRect(0, 0, Wc, 10);
    c.fillStyle = '#ffffff'; c.font = '800 64px "Bricolage Grotesque", system-ui, sans-serif'; c.fillText('Pinpoint', 56, 112);
    c.fillStyle = '#9bb6c2'; c.font = '600 28px Figtree, system-ui, sans-serif'; c.fillText(data.label, 56, 160);
    c.fillStyle = '#ffffff'; c.font = '800 120px "Bricolage Grotesque", system-ui, sans-serif'; c.fillText(String(data.score), 56, 300);
    var sw = c.measureText(String(data.score)).width;
    c.fillStyle = '#9bb6c2'; c.font = '700 44px "Bricolage Grotesque", system-ui, sans-serif'; c.fillText('/ '+max, 56+sw+18, 300);
    if(data.extra){ c.fillStyle = '#f0b400'; c.font = '700 30px Figtree, system-ui, sans-serif'; c.fillText(data.extra, 56, 200); }
    data.pts.forEach(function(p, i){
      c.fillStyle = p>=3 ? '#3fc27a' : p>0 ? '#ffa33a' : '#ff6a4d';
      var x = 56+(i%5)*58, y = 350+Math.floor(i/5)*58;
      c.beginPath(); if(c.roundRect) c.roundRect(x, y, 46, 46, 8); else c.rect(x, y, 46, 46); c.fill();
    });
    c.fillStyle = '#9bb6c2'; c.font = '500 22px Figtree, system-ui, sans-serif'; c.fillText('maxw2712-blip.github.io/pinpoint', 56, Hc-44);
    var done = function(){ cv.toBlob(function(b){ resolve(b); }, 'image/png'); };
    var rm = $('recapMap');
    if(!data.recap || $('recapWrap').hidden || !rm.getAttribute('viewBox')){ done(); return; }
    var xml = new XMLSerializer().serializeToString(rm);
    if(!/xmlns=/.test(xml)) xml = xml.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    var img = new Image();
    img.onload = function(){
      var mx = 430, my = 120, mw = Wc-mx-48, mh = mw/2;
      c.save(); c.beginPath(); if(c.roundRect) c.roundRect(mx, my, mw, mh, 18); else c.rect(mx, my, mw, mh); c.clip();
      c.drawImage(img, mx, my, mw, mh); c.restore(); done();
    };
    img.onerror = done;
    img.src = 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(xml.replace(/<svg([^>]*)>/, '<svg$1 width="1440" height="720">'));
  });
}
function shareResult(data, note){
  data = (data && data.text) ? data : gameShareData();
  note = note || $('shareNote');
  var text = data.text;
  shareImage(data).then(function(blob){
    var file = blob ? new File([blob], 'pinpoint-result.png', {type:'image/png'}) : null;
    if(file && navigator.canShare && navigator.canShare({files:[file]})){
      navigator.share({files:[file], text:text, title:'Pinpoint'}).catch(function(){});
      return;
    }
    if(navigator.share && /Mobi|Android|iPhone|iPad/.test(navigator.userAgent)){
      navigator.share({text:text, title:'Pinpoint'}).catch(function(){});
      return;
    }
    // desktop: copy the text and save the image
    var copied = navigator.clipboard ? navigator.clipboard.writeText(text).then(function(){ return true; }, function(){ return false; }) : Promise.resolve(false);
    copied.then(function(ok){
      if(blob){
        var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pinpoint-result.png';
        document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      }
      note.textContent = (ok ? 'Summary copied to the clipboard' : 'Could not copy the summary')+(blob ? ' and the image saved.' : '.');
    });
  });
}
function endGame(){
  st.phase='end'; showPeek(null); app.classList.remove('playing'); app.classList.remove('tint');
  $('hudTop').hidden = true; $('hudBottom').hidden = true;
  var max = st.qs.length*3, pct = max ? st.score/max : 0;
  countUp($('finalScore'), st.score);
  $('finalMax').textContent = '/ '+max;
  $('verdict').textContent =
    pct>=0.9 ? 'Outstanding. You know this map cold.' :
    pct>=0.7 ? 'Strong run. A few tricky spots, nothing you can\u2019t fix.' :
    pct>=0.4 ? 'Solid start. Try the same setup again to lock it in.' :
               'Good practice. Narrow it to one region or feature type and replay to build the map in your head.';
  if(st.daily && pct<0.7) $('verdict').textContent = pct>=0.4 ? 'Solid start. A new daily opens at midnight.' : 'A tough one. A new daily opens at midnight; practise your misses meanwhile.';
  var prev = getBest(), msg;
  $('again').hidden = !!st.daily;
  if(st.daily){
    var D = loadDaily(); finishDaily(D, st.daily.key); D = loadDaily();
    var ks = curStreak(D);
    msg = 'Daily #'+st.daily.n+' saved. Streak: '+ks+(ks===1 ? ' day' : ' days')+' (best '+D.best+'). Next daily in '+untilTomorrow()+'.';
  }
  else if(st.practice){ msg = 'Practice round, so this score isn\u2019t saved.'; }
  else if(prev===null || st.score>prev){ setBest(st.score); msg = prev===null ? 'First score saved for this setup.' : 'New best for this setup. Previous: '+prev+'.'; }
  else { msg = 'Your best for this setup: '+prev+' points.'; }
  $('best2').textContent = msg;
  var missedN = st.log.filter(function(e){ return e.pts===0; }).length;
  $('practice').hidden = missedN===0;
  $('practice').textContent = 'Practice '+missedN+(missedN===1 ? ' miss' : ' misses');
  var ul = $('log'); ul.innerHTML='';
  st.log.forEach(function(e){
    var it = pack.items[e.q.name];
    var li = document.createElement('li');
    var left = document.createElement('span');
    left.textContent = (e.q.type==='capital' ? it.cap+' \u2192 ' : e.q.type==='border' ? 'Borders '+pack.items[e.q.a].disp+' and '+pack.items[e.q.b].disp+' \u2192 ' : e.q.type==='flag' ? 'Flag of ' : '') + it.disp + (it.body ? ' ('+BODIES[it.body].short+')' : '');
    if(e.q.type==='trivia') left.textContent = it.disp+' \u2014 '+it.ans;
    if(e.q.type==='sec') left.textContent = it.disp+' \u2014 '+it.ansText;
    var right = document.createElement('span');
    right.className = 'pts' + (e.pts===0 ? ' zero' : '');
    right.textContent = e.pts===0 ? 'Missed' : '+'+e.pts;
    li.appendChild(left); li.appendChild(right); ul.appendChild(li);
  });
  moveTo(viewFor(pack.kind==='physical' ? null : REGION_BOX[st.region]));
  paths.classed('hit miss reveal goldPulse', false);
  drawRecap();
  $('shareNote').textContent = '';
  $('end').hidden = false;
  $('again').focus({preventScroll:true});
}

/* ---------- Zoom buttons ---------- */
$('zin').addEventListener('click', function(){ svg.transition().duration(reduce?0:250).call(zoom.scaleBy, 1.7); });
$('zout').addEventListener('click', function(){ svg.transition().duration(reduce?0:250).call(zoom.scaleBy, 1/1.7); });
$('zhome').addEventListener('click', function(){
  moveTo(viewFor(pack.kind==='physical' ? null : REGION_BOX[st.region]));
});

document.addEventListener('keydown', function(e){
  if(/INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) return;
  if(DEV_PANELS.concat(['settingsPanel']).some(function(id){ var e = $(id); return e && !e.hidden; })) return;
  if(pack && pack.kind==='trivia' && st.phase==='play' && !st.locked && e.key>='1' && e.key<='4') triviaPick(parseInt(e.key,10)-1);
});

/* Pause the question timer while a panel is open (Settings, and the dev report panel in the private build). */
var devPausedMs = null;
var DEV_PANELS = [];   // overlay panels that exist only in the private build (registered inside the dev block)
function devPause(){
  if(devPausedMs===null && st.timing){ devPausedMs = Math.max(0, st.tEnd-Date.now()); stopTimer(); }
}
function devResume(){
  if(devPausedMs!==null){
    var ms = devPausedMs; devPausedMs = null;
    if(ms>0 && !st.locked && st.phase==='play') startTimer(LEVELS[st.level].time, ms);
  }
}

// @dev-start
/* ---------- Dev mode: report a problem while playing (private build only: python3 build.py --dev) ---------- */
var DEV = false, devMem = [], devDraft = null;
DEV_PANELS.push('reportPanel', 'reportsView');
try{ DEV = localStorage.getItem('pinpoint:dev')==='1'; }catch(e){}
function devLoad(){ try{ return JSON.parse(localStorage.getItem('pinpoint:reports') || '[]'); }catch(e){ return devMem; } }
function devSave(list){ devMem = list; try{ localStorage.setItem('pinpoint:reports', JSON.stringify(list)); }catch(e){} }
function refreshDev(){
  $('devToggle').checked = DEV;
  $('reportBtn').hidden = !DEV; $('exploreReport').hidden = !DEV; $('devReports').hidden = !DEV;
  $('devReports').textContent = 'Reports ('+devLoad().length+')';
}
var TAB_NAMES = {map:'Nation States', geo:'Geography', flags:'Flags', planets:'Planets', history:'History', security:'Security'};
function devTargetInfo(key){
  if(!key) return null;
  var it = pack.items[key] || {}, d = {key:key, name:it.disp || key};
  if(it.cap) d.capital = it.cap;
  if(it.reg) d.region = it.reg;
  if(it.noun) d.type = it.noun;
  if(pack.kind==='political'){
    if(pack.id==='modern' || pack.isFlags || pack.isSecurity) d.flag = FLAGS[key] ? 'its own flag' : 'no flag';
    else d.flag = rflag(it.disp || key) ? 'its own banner' : 'flags of the modern countries on that land';
  }
  return d;
}
function devQuestion(){
  var q = st.qs[st.i];
  if(!q || st.phase==='setup' || st.phase==='end') return '(no question on screen)';
  var it = pack.items[q.name] || {};
  if(q.type==='trivia'){ var T = TRIVIA[q.idx]; return 'Trivia: "'+T.q+'"\n  correct answer in game: '+T.a+'\n  other options: '+T.w.join(' / ')+'\n  fact shown: '+T.f; }
  if(q.type==='sec') return 'Security: "'+it.disp+'"\n  answer in game: '+it.ansText+'\n  fact shown: '+(it.fact || '');
  if(q.type==='flag') return 'Flag question: flag of '+it.disp+(it.hist ? ' (a lost country)' : '');
  if(q.type==='capital') return 'Capital question: '+it.cap+' -> '+it.disp;
  if(q.type==='border') return 'Border puzzle: '+pack.items[q.a].disp+' and '+pack.items[q.b].disp+' -> '+it.disp;
  return 'Find'+(it.noun ? ' the '+it.noun : '')+': '+(it.disp || q.name);
}
function devWhere(){
  var m = document.querySelector('.seg[data-key="mode"] button[data-v="'+st.mode+'"]');
  var mode = (st.tab==='map' && m) ? ' > '+m.textContent : '';
  return TAB_NAMES[st.tab]+mode+' > '+LEVELS[st.level].label;
}
function devTargetText(){
  var d = devDraft && devDraft.target;
  if(!d) return 'Nothing pointed at yet. Use the button above to tap the place on the map.';
  return 'Pointed at: '+d.name+(d.capital ? ' (capital in game: '+d.capital+')' : '')+(d.flag ? ', flag: '+d.flag : '');
}
function openReport(){
  if(!DEV) return;
  devPause();
  devDraft = devDraft || {target:null};
  if(!devDraft.target && st.lastKey) devDraft.target = devTargetInfo(st.lastKey);
  $('rpContext').textContent = 'Where: '+devWhere()+'\nQuestion: '+devQuestion();
  $('rpTarget').textContent = devTargetText();
  $('rpPoint').hidden = pack.kind==='trivia';
  $('reportPanel').hidden = false;
}
function devPointed(key){
  st.devPick = false; hideToast();
  devDraft = devDraft || {target:null};
  devDraft.target = devTargetInfo(key) || {key:key, name:key};
  openReport();
}
function devCloseReport(){
  $('reportPanel').hidden = true; devDraft = null; st.devPick = false; hideToast();
  $('rpNote').value = ''; devResume();
}
function fmtReport(r, i){
  var tg = r.target;
  return 'Report '+(i+1)+' ('+r.time+')\n'
    +'Where: '+r.where+'\n'
    +'Question: '+r.question+'\n'
    +'Pointed at: '+(tg ? tg.name+' [map name: '+tg.key+']'+(tg.capital ? ' [capital in game: '+tg.capital+']' : '')+(tg.region ? ' [region: '+tg.region+']' : '')+(tg.flag ? ' [flag: '+tg.flag+']' : '') : '(nothing)')+'\n'
    +'Problem: '+r.problem+'\n'
    +'Note: '+(r.note || '(none)');
}
$('devToggle').addEventListener('change', function(){
  DEV = this.checked; try{ localStorage.setItem('pinpoint:dev', DEV ? '1' : '0'); }catch(e){}
  refreshDev();
});
$('reportBtn').addEventListener('click', openReport);
$('exploreReport').addEventListener('click', openReport);
$('rpPoint').addEventListener('click', function(){
  st.devPick = true; $('reportPanel').hidden = true;
  toast('Tap the place with the problem', false, true);
});
$('rpCancel').addEventListener('click', devCloseReport);
$('rpSave').addEventListener('click', function(){
  var list = devLoad();
  list.push({time:new Date().toLocaleString(), where:devWhere(), question:devQuestion(), target:devDraft && devDraft.target, problem:$('rpType').value, note:$('rpNote').value.trim()});
  devSave(list);
  devCloseReport(); refreshDev();
  toast('Report saved ('+list.length+' so far)', true);
});
$('devReports').addEventListener('click', function(){
  var list = devLoad();
  $('rvText').value = list.length ? list.map(fmtReport).join('\n\n') : 'No reports saved yet.';
  $('reportsView').hidden = false;
});
$('rvClose').addEventListener('click', function(){ $('reportsView').hidden = true; });
$('rvClear').addEventListener('click', function(){ devSave([]); $('rvText').value = 'No reports saved yet.'; refreshDev(); });
$('rvCopy').addEventListener('click', function(){
  var ta = $('rvText'), done = function(){ toast('Copied. Paste it to Claude.', true); },
      manual = function(){ ta.focus(); ta.select(); toast('Copy blocked here: the text is selected, copy it by hand.'); };
  ta.focus(); ta.select();
  // copy while the tap still counts as a user action (works inside embedded pages such as a claude.ai artifact),
  // then fall back to the clipboard API, and finally to a selected text the user copies by hand
  var ok = false;
  try{ ok = document.execCommand('copy'); }catch(e){}
  if(ok){ done(); return; }
  if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(ta.value).then(done, manual); }
  else manual();
});
refreshDev();
// @dev-end

/* ---------- Settings ---------- */
var CFG = {auto:false, delay:5, night:'auto'};
try{
  var savedCfg = JSON.parse(localStorage.getItem('pinpoint:cfg') || '{}');
  if(typeof savedCfg.auto==='boolean') CFG.auto = savedCfg.auto;
  if([3,5,8].indexOf(savedCfg.delay)>=0) CFG.delay = savedCfg.delay;
  if(['auto','all','off'].indexOf(savedCfg.night)>=0) CFG.night = savedCfg.night;
}catch(e){}
function saveCfg(){ try{ localStorage.setItem('pinpoint:cfg', JSON.stringify(CFG)); }catch(e){} }
function settingsOpen(){ return !$('settingsPanel').hidden; }
function refreshSettings(){
  $('optAuto').checked = CFG.auto;
  $('optDelayBox').disabled = !CFG.auto;
  document.querySelectorAll('#optDelay .optBtn').forEach(function(b){ b.classList.toggle('on', +b.getAttribute('data-v')===CFG.delay); });
  document.querySelectorAll('#optNight .optBtn').forEach(function(b){ var on = b.getAttribute('data-v')===CFG.night; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
}
function openSettings(){
  if(st.phase==='play') devPause();
  refreshSettings(); $('settingsPanel').hidden = false;
}
function closeSettings(){ $('settingsPanel').hidden = true; devResume(); }
$('settingsBtn').addEventListener('click', openSettings);
$('settingsBtn2').addEventListener('click', openSettings);
$('stDone').addEventListener('click', closeSettings);
$('optAuto').addEventListener('change', function(){ CFG.auto = this.checked; saveCfg(); refreshSettings(); });
$('optDelay').addEventListener('click', function(e){
  var b = e.target.closest ? e.target.closest('.optBtn') : null;
  if(!b) return;
  CFG.delay = +b.getAttribute('data-v'); saveCfg(); refreshSettings();
});
$('optNight').addEventListener('click', function(e){
  var b = e.target.closest ? e.target.closest('.optBtn') : null;
  if(!b || b.getAttribute('data-v')===CFG.night) return;
  CFG.night = b.getAttribute('data-v'); saveCfg(); refreshSettings();
  // apply now: in a game in place (the game is kept), in Explore with a cross-fade, elsewhere straight away
  if(st.phase==='explore') crossFade(function(){ applyTheme(); setDusk(1); });
  else { applyTheme(); if(isNight()) setDusk(st.phase==='play' ? duskFor(st.i) : 1); }
});
document.addEventListener('keydown', function(e){ if(e.key==='Escape' && settingsOpen()) closeSettings(); });
/* After a miss, a timeout or a trivia answer, count down on the button and then move to the next question. */
function autoNext(){
  if(!CFG.auto || st.phase!=='play') return;
  var act = $('act'), base = act.textContent, n = CFG.delay;
  (function tick(){
    if(st.phase!=='play' || !st.revealed) return;
    if(!CFG.auto){ act.textContent = base; return; }
    if(settingsOpen()){ later(tick, 300); return; }   // wait while the settings panel is open
    if(n<=0){ advance(); return; }
    act.textContent = base+' ('+n+')'; n--;
    later(tick, 1000);
  })();
}

setMode('modern');
if(globe) globe.start();
})();
