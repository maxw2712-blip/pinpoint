# -*- coding: utf-8 -*-
import json, math, io, base64, os
import cairosvg
from PIL import Image

def star(cx,cy,R,r,n=5,rot=-90):
    pts=[]
    for i in range(2*n):
        a=math.radians(rot+i*180/n); rad=R if i%2==0 else r
        pts.append(f"{cx+rad*math.cos(a):.1f},{cy+rad*math.sin(a):.1f}")
    return " ".join(pts)
def svg(body): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480">{body}</svg>'
def rect(x,y,w,h,f): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{f}"/>'

H={}
# Soviet Union
H['Soviet Union']=svg(rect(0,0,640,480,'#CC0000')+'<g transform="translate(-22,-18) scale(1.45)">'+
  f'<polygon points="{star(112,66,38,15)}" fill="#CC0000" stroke="#FFD700" stroke-width="5" stroke-linejoin="miter"/>'
  '<path d="M 62 176 A 60 60 0 0 0 150 120" fill="none" stroke="#FFD700" stroke-width="10" stroke-linecap="round"/>'
  '<path d="M 150 120 L 160 100 L 142 112 Z" fill="#FFD700"/>'
  '<line x1="64" y1="118" x2="148" y2="178" stroke="#FFD700" stroke-width="10" stroke-linecap="round"/>'
  '<polygon points="52,104 84,92 94,110 60,124" fill="#FFD700"/></g>')
# Yugoslavia
H['Yugoslavia']=svg(rect(0,0,640,160,'#0C4076')+rect(0,160,640,160,'#FFFFFF')+rect(0,320,640,160,'#C6363C')+
  f'<polygon points="{star(320,240,86,34)}" fill="#C6363C" stroke="#FFD700" stroke-width="7"/>')
# Czechoslovakia
H['Czechoslovakia']=svg(rect(0,0,640,240,'#FFFFFF')+rect(0,240,640,240,'#D7141A')+'<polygon points="0,0 320,240 0,480" fill="#11457E"/>')
# East Germany
H['East Germany']=svg(rect(0,0,640,160,'#000000')+rect(0,160,640,160,'#DD0000')+rect(0,320,640,160,'#FFCE00')+
  '<g transform="translate(320,240)"><ellipse rx="82" ry="92" fill="none" stroke="#FFCE00" stroke-width="16" stroke-dasharray="9 5"/>'
  '<rect x="-9" y="-62" width="18" height="128" fill="#FFCE00"/><rect x="-36" y="-66" width="72" height="26" fill="#FFCE00"/>'
  '<path d="M -50 62 L 0 -34 L 50 62" fill="none" stroke="#FFCE00" stroke-width="11"/></g>')
# Ottoman Empire (1844)
H['Ottoman Empire']=svg(rect(0,0,640,480,'#E30A17')+'<circle cx="262" cy="240" r="124" fill="#FFFFFF"/><circle cx="296" cy="240" r="100" fill="#E30A17"/>'
  f'<polygon points="{star(392,240,50,26,8)}" fill="#FFFFFF"/>')
# Zaire
H['Zaire']=svg(rect(0,0,640,480,'#0A9F4A')+'<circle cx="320" cy="240" r="140" fill="#FFD400"/>'
  '<rect x="312" y="150" width="16" height="96" fill="#5B3A1A"/>'
  '<polygon points="320,100 352,150 336,166 304,166 288,150" fill="#E4002B"/>'
  '<rect x="304" y="238" width="32" height="104" rx="12" fill="#B5651D"/><circle cx="320" cy="236" r="22" fill="#B5651D"/>')
# South Vietnam
H['South Vietnam']=svg(rect(0,0,640,480,'#FFD200')+rect(0,172,640,24,'#DD0000')+rect(0,228,640,24,'#DD0000')+rect(0,284,640,24,'#DD0000'))
# Rhodesia
H['Rhodesia']=svg(rect(0,0,214,480,'#00A859')+rect(214,0,212,480,'#FFFFFF')+rect(426,0,214,480,'#00A859')+
  '<path d="M 270 150 L 370 150 L 370 270 Q 370 320 320 340 Q 270 320 270 270 Z" fill="#FFC72C" stroke="#222" stroke-width="5"/>'
  '<path d="M 270 150 L 370 150 L 370 200 L 270 200 Z" fill="#CC0000"/><circle cx="320" cy="260" r="18" fill="#222"/>'
  '<path d="M 270 150 L 370 150 L 370 270 Q 370 320 320 340 Q 270 320 270 270 Z" fill="none" stroke="#222" stroke-width="5"/>')
# Biafra
rays=''.join(f'<line x1="{320+62*math.cos(math.radians(a)):.1f}" y1="{300-62*math.sin(math.radians(a)):.1f}" x2="{320+92*math.cos(math.radians(a)):.1f}" y2="{300-92*math.sin(math.radians(a)):.1f}" stroke="#F7D117" stroke-width="9" stroke-linecap="round"/>' for a in range(10,171,16))
H['Biafra']=svg(rect(0,0,640,160,'#CE1126')+rect(0,160,640,160,'#000000')+rect(0,320,640,160,'#009739')+
  '<path d="M 258 300 A 62 62 0 0 1 382 300 Z" fill="#F7D117"/>'+rays)
# Republic of Texas
H['Republic of Texas']=svg(rect(0,0,640,240,'#FFFFFF')+rect(0,240,640,240,'#BF0A30')+rect(0,0,214,480,'#002868')+f'<polygon points="{star(107,240,70,28)}" fill="#FFFFFF"/>')
# Kingdom of Hawaii
cols=['#FFFFFF','#C8102E','#012169']*3
stripes=''.join(rect(0,i*60,640,60,['#FFFFFF','#C8102E','#012169','#FFFFFF','#C8102E','#012169','#FFFFFF','#C8102E'][i]) for i in range(8))
jack=('<clipPath id="c"><rect x="0" y="0" width="256" height="240"/></clipPath><g clip-path="url(#c)">'
  '<rect width="256" height="240" fill="#012169"/>'
  '<path d="M 0 0 L 256 240 M 256 0 L 0 240" stroke="#FFFFFF" stroke-width="40"/>'
  '<path d="M 0 0 L 256 240 M 256 0 L 0 240" stroke="#C8102E" stroke-width="14"/>'
  '<path d="M 128 0 V 240 M 0 120 H 256" stroke="#FFFFFF" stroke-width="64"/>'
  '<path d="M 128 0 V 240 M 0 120 H 256" stroke="#C8102E" stroke-width="38"/></g>')
H['Kingdom of Hawaii']=svg(stripes+jack)
# Union of Burma (1948-74)
small=''.join(f'<polygon points="{star(150+92*math.cos(math.radians(a)),120+92*math.sin(math.radians(a)),24,9.5)}" fill="#FFFFFF"/>' for a in (-90,-18,54,126,198))
H['Union of Burma']=svg(rect(0,0,640,480,'#BF0A30')+rect(0,0,300,240,'#002868')+f'<polygon points="{star(150,120,50,20)}" fill="#FFFFFF"/>'+small)
# Upper Volta
H['Upper Volta']=svg(rect(0,0,640,160,'#000000')+rect(0,160,640,160,'#FFFFFF')+rect(0,320,640,160,'#EF2B2D'))
# Union of South Africa flag (1928-94)
H['South Africa (1928\u20131994 flag)']=svg(rect(0,0,640,160,'#E8590C')+rect(0,160,640,160,'#FFFFFF')+rect(0,320,640,160,'#002395')+
  '<clipPath id="u"><rect x="268" y="206" width="104" height="68"/></clipPath><g clip-path="url(#u)"><rect x="268" y="206" width="104" height="68" fill="#012169"/>'
  '<path d="M 268 206 L 372 274 M 372 206 L 268 274" stroke="#FFFFFF" stroke-width="14"/><path d="M 268 206 L 372 274 M 372 206 L 268 274" stroke="#C8102E" stroke-width="5"/>'
  '<path d="M 320 206 V 274 M 268 240 H 372" stroke="#FFFFFF" stroke-width="22"/><path d="M 320 206 V 274 M 268 240 H 372" stroke="#C8102E" stroke-width="13"/></g>'
  +rect(176,210,66,60,'#E8590C')+rect(176,230,66,20,'#FFFFFF')+rect(176,250,66,20,'#002395')
  +rect(398,210,66,20,'#DE3831')+rect(398,230,66,20,'#FFFFFF')+rect(398,250,66,20,'#002395')+rect(398,210,18,60,'#007749'))
# Russian Empire (black-yellow-white)
H['Russian Empire']=svg(rect(0,0,640,160,'#000000')+rect(0,160,640,160,'#FFD100')+rect(0,320,640,160,'#FFFFFF'))
# German Empire (black-white-red)
H['German Empire']=svg(rect(0,0,640,160,'#000000')+rect(0,160,640,160,'#FFFFFF')+rect(0,320,640,160,'#DD0000'))

META={
 'Soviet Union':('Soviet Union (1922\u20131991)','hard','Europe',["Russia","Ukraine","Belarus","Moldova","Estonia","Latvia","Lithuania","Georgia","Armenia","Azerbaijan","Kazakhstan","Uzbekistan","Turkmenistan","Tajikistan","Kyrgyzstan"]),
 'Yugoslavia':('Yugoslavia (1945\u20131992)','hard','Europe',["Serbia","Croatia","Slovenia","Bosnia and Herz.","Montenegro","Macedonia","Kosovo"]),
 'Czechoslovakia':('Czechoslovakia (1918\u20131992)','hard','Europe',["Czechia","Slovakia"]),
 'East Germany':('East Germany (1949\u20131990)','hard','Europe',["Germany"]),
 'Ottoman Empire':('Ottoman Empire (until 1922)','hard','Asia',["Turkey"]),
 'Zaire':('Zaire (1971\u20131997)','impossible','Africa',["Dem. Rep. Congo"]),
 'South Vietnam':('South Vietnam (1955\u20131975)','impossible','Asia',["Vietnam"]),
 'Rhodesia':('Rhodesia (1965\u20131979)','impossible','Africa',["Zimbabwe"]),
 'Biafra':('Biafra (1967\u20131970)','impossible','Africa',["Nigeria"]),
 'Republic of Texas':('Republic of Texas (1836\u20131846)','impossible','Americas',["United States of America"]),
 'Kingdom of Hawaii':('Kingdom of Hawaii (1795\u20131893)','impossible','Oceania',["United States of America"]),
 'Union of Burma':('Union of Burma (1948\u20131974)','impossible','Asia',["Myanmar"]),
 'Upper Volta':('Upper Volta (1958\u20131984)','impossible','Africa',["Burkina Faso"]),
 'South Africa (1928\u20131994 flag)':('Union of South Africa (1910\u20131961)','impossible','Africa',["South Africa"]),
 'Russian Empire':('Russian Empire (1721\u20131917)','impossible','Europe',["Russia"]),
 'German Empire':('German Empire (1871\u20131918)','impossible','Europe',["Germany"]),
}
def render(svg_bytes, q=78):
    png=cairosvg.svg2png(bytestring=svg_bytes,output_width=192,output_height=144)
    im=Image.open(io.BytesIO(png)).convert('RGB')
    b=io.BytesIO(); im.save(b,'WEBP',quality=q,method=6); return im,b.getvalue()
flags={}; total=0
code=json.load(open('code_map.json'))
for key,c in code.items():
    im,wb=render(open(f'package/flags/4x3/{c}.svg','rb').read())
    flags[key]='data:image/webp;base64,'+base64.b64encode(wb).decode(); total+=len(wb)
print('modern flags KB',total//1024)
hist_meta=[]; sheet=Image.new('RGB',(192*4,144*4),(255,255,255)); i=0; htotal=0
for hid,s in H.items():
    im,wb=render(s.encode('utf-8'))
    disp,tier,reg,ans=META[hid]
    key='h:'+hid
    flags[key]='data:image/webp;base64,'+base64.b64encode(wb).decode(); htotal+=len(wb)
    hist_meta.append({'id':key,'disp':disp,'tier':tier,'reg':reg,'answers':ans})
    sheet.paste(im,((i%4)*192,(i//4)*144)); i+=1
sheet.save('hist_sheet.png'); print('hist flags KB',htotal//1024,len(hist_meta))
json.dump(flags,open('flags.json','w')); json.dump(hist_meta,open('hist_meta.json','w'),ensure_ascii=False)
print('json KB',os.path.getsize('flags.json')//1024)
