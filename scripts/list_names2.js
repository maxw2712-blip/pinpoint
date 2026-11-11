const {JSDOM}=require('jsdom'); const fs=require('fs');
let html=fs.readFileSync('dbg5.html','utf8');
const d3src=fs.readFileSync('node_modules/d3/dist/d3.min.js','utf8'), tjsrc=fs.readFileSync('node_modules/topojson-client/dist/topojson-client.min.js','utf8');
html=html.replace(/<script src="[^"]*d3[^"]*"><\/script>/,()=>'<script>'+d3src.replace(/<\/script>/g,'<\\/script>')+'</script>')
         .replace(/<script src="[^"]*topojson[^"]*"><\/script>/,()=>'<script>'+tjsrc.replace(/<\/script>/g,'<\\/script>')+'</script>');
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'https://example.com/',beforeParse(w){w.matchMedia=()=>({matches:true,addListener(){},removeListener(){}});}});
const w=dom.window;
setTimeout(()=>{
  const pat=/cambod|khmer|ceylon|sri lanka|laos|afghan|albania|australia|china|chinese|congo|german|korea|manchu|mexico|mongol|montenegro|tibet|zone|occup/i;
  for(const id of ['wwi','ww2','coldwar']){
    const P=w.__pin.getPack(id); const out=[];
    for(const [k,it] of Object.entries(P.items)){ if(pat.test(it.disp)) out.push(`${it.disp}${w.__pin.RFLAGS[it.disp]?' [has flag]':''} {map:${k}}`); }
    console.log(id.padEnd(10),out.join(' | '));
  }
  process.exit(0);
},300);
