# -*- coding: utf-8 -*-
import json, math, io, base64, cairosvg
from PIL import Image
def star(cx,cy,R,r,n=5,rot=-90):
    return " ".join(f"{cx+(R if i%2==0 else r)*math.cos(math.radians(rot+i*180/n)):.1f},{cy+(R if i%2==0 else r)*math.sin(math.radians(rot+i*180/n)):.1f}" for i in range(2*n))
def svg(b): return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480">{b}</svg>'
def R(x,y,w,h,f): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{f}"/>'
def hbands(cols):
    n=len(cols); h=480/n
    return "".join(R(0,i*h,640,h+0.5,c) for i,c in enumerate(cols))
def vbands(cols):
    n=len(cols); w=640/n
    return "".join(R(i*w,0,w+0.5,480,c) for i,c in enumerate(cols))
def crescent(cx,cy,r,fill,off=0.26,shr=0.84,bg=None):
    s=f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"/><circle cx="{cx+r*off}" cy="{cy}" r="{r*shr}" fill="{bg}"/>'
    return s
def ucross(bg,cross,sal,field=None):  # union-jack style
    s=(f'<rect width="640" height="480" fill="{bg}"/>'
       f'<path d="M0,0 L640,480 M640,0 L0,480" stroke="{sal}" stroke-width="96"/>'
       f'<clipPath id="uj"><path d="M320,240 L640,240 L640,480 Z M320,240 L320,480 L0,480 Z M320,240 L0,240 L0,0 Z M320,240 L320,0 L640,0 Z"/></clipPath>'
       f'<path d="M0,0 L640,480 M640,0 L0,480" clip-path="url(#uj)" stroke="{cross}" stroke-width="32"/>'
       f'<path d="M320,0 V480 M0,240 H640" stroke="{sal}" stroke-width="160"/>'
       f'<path d="M320,0 V480 M0,240 H640" stroke="{cross}" stroke-width="96"/>')
    return s
def nordic(bg,cross,cross2=None):
    s=f'<rect width="640" height="480" fill="{bg}"/>'
    if cross2: s+=f'<path d="M0,240 H640 M240,0 V480" stroke="{cross2}" stroke-width="144"/>'
    s+=f'<path d="M0,240 H640 M240,0 V480" stroke="{cross}" stroke-width="96"/>'
    return s
F={}
# ---- Europe, modern-ish national flags of the period ----
F['Austrian Empire']=svg(hbands(['#ED2939','#FFFFFF','#ED2939'])+R(230,160,180,160,'#FCDD09')+'<text x="320" y="282" font-size="150" font-family="serif" font-weight="bold" fill="#000" text-anchor="middle">&#9790;</text>')
F['Austria-Hungary']=svg(hbands(['#ED2939','#FFFFFF','#ED2939'])+R(236,150,168,180,'#FCDD09')+'<path d="M260 200 h118 v62 q0 48 -59 68 q-59 -20 -59 -68 Z" fill="#ED2939" stroke="#000" stroke-width="5"/>')
F['Prussia']=svg(R(0,0,640,480,'#FFFFFF')+'<path d="M300 140 q-28 20 -28 56 q0 44 48 70 q48 -26 48 -70 q0 -36 -28 -56 q-20 32 -40 0 Z" fill="#000"/><path d="M320 266 l-34 70 h68 Z" fill="#000"/><path d="M262 196 l-46 -22 l16 44 Z M378 196 l46 -22 l-16 44 Z" fill="#000"/>')
F['Russian Empire']=svg(hbands(['#000000','#FFD100','#FFFFFF']))
F['United Kingdom']=svg(ucross('#012169','#C8102E','#FFFFFF'))
F['United Kingdom of Great Britain and Ireland']=F['United Kingdom']
F['France']=svg(vbands(['#002395','#FFFFFF','#ED2939']))
F['Spain']=svg(hbands(['#AA151B','#F1BF00','#F1BF00','#AA151B'])+R(0,120,640,240,'#F1BF00')+R(120,180,120,120,'#AA151B'))
F['Portugal']=svg(R(0,0,256,480,'#006600')+R(256,0,384,480,'#FF0000')+f'<circle cx="256" cy="240" r="84" fill="#FFFF00" stroke="#FFFFFF" stroke-width="6"/><circle cx="256" cy="240" r="58" fill="#FFFFFF" stroke="#FF0000" stroke-width="6"/><rect x="232" y="206" width="48" height="68" fill="#FF0000"/>')
F['Ottoman Empire']=svg(R(0,0,640,480,'#E30A17')+crescent(262,240,124,'#FFFFFF',0.27,0.80,'#E30A17')+f'<polygon points="{star(392,240,50,26,8)}" fill="#FFFFFF"/>')
F['Kingdom of Sardinia']=svg(R(0,0,640,480,'#FFFFFF')+'<path d="M0 198 h640 v84 H0 Z M278 0 h84 v480 h-84 Z" fill="#CE2B37"/>'+R(236,156,168,168,'#0039A6')+R(260,180,120,120,'#FFFFFF')+'<path d="M296 180 h48 v120 h-48 Z M260 216 h120 v48 h-120 Z" fill="#CE2B37"/>')
F['Kingdom of the Two Sicilies']=svg(R(0,0,640,480,'#FFFFFF')+R(252,172,136,136,'#0039A6')+f'<polygon points="{star(320,240,52,22)}" fill="#FCDD09"/>')
F['Papal States']=svg(vbands(['#FFE000','#FFFFFF'])+'<g transform="translate(470,240) rotate(-20)"><rect x="-10" y="-70" width="20" height="140" rx="8" fill="#C8A000"/><circle cx="0" cy="-70" r="18" fill="#C8A000"/></g><g transform="translate(470,240) rotate(20)"><rect x="-10" y="-70" width="20" height="140" rx="8" fill="#9AA0A6"/><circle cx="0" cy="-70" r="18" fill="#9AA0A6"/></g>')
F['Sweden\u2013Norway']=svg(nordic('#006AA7','#FECC00')+R(0,0,260,200,'#006AA7')+'<path d="M0 0 L260 200 M260 0 L0 200" stroke="#FFFFFF" stroke-width="46"/><path d="M130 0 V200 M0 100 H260" stroke="#FFFFFF" stroke-width="56"/><path d="M130 0 V200 M0 100 H260" stroke="#BA0C2F" stroke-width="30"/><path d="M0 0 L260 200 M260 0 L0 200" stroke="#BA0C2F" stroke-width="16"/>')
F['Denmark']=svg(nordic('#C8102E','#FFFFFF'))
F['Norway']=svg(nordic('#BA0C2F','#00205B','#FFFFFF'))
F['Sweden']=svg(nordic('#006AA7','#FECC00'))
F['Finland']=svg(nordic('#FFFFFF','#003580'))
F['Grand Duchy of Finland']=svg(hbands(['#FFFFFF','#FFFFFF'])+'<rect width="640" height="480" fill="#FFFFFF"/>'+R(120,100,400,280,'#C8102E')+f'<polygon points="{star(320,160,42,18)}" fill="#FFD100"/><path d="M250 200 h140 v80 q0 60 -70 86 q-70 -26 -70 -86 Z" fill="#FFD100" stroke="#8B0000" stroke-width="4"/>')
F['Switzerland']=svg(R(0,0,640,480,'#D52B1E')+R(288,140,64,200,'#FFFFFF')+R(220,208,200,64,'#FFFFFF'))
F['Swiss Confederacy']=F['Switzerland']
F['Bavaria']=svg(''.join(f'<rect x="{(i%8)*80}" y="{(i//8)*80}" width="80" height="80" fill="{"#FFFFFF" if (i//8+i%8)%2==0 else "#0066B3"}"/>' for i in range(48)))
F['Saxony']=svg(hbands(['#FFFFFF','#009036']))
F['Hanover']=svg(hbands(['#FFD100','#FFFFFF'])+R(0,0,640,240,'#FFD100'))
F['Baden']=svg(hbands(['#FFD100','#C8102E']))
F['W\u00fcrttemberg']=svg(hbands(['#000000','#C8102E']))
F['Grand Duchy of Tuscany']=svg(R(0,0,640,480,'#FFFFFF')+R(0,160,640,160,'#C8102E'))
F['Venetia']=svg(R(0,0,640,480,'#C8102E')+'<path d="M90 240 l70 -70 v40 h260 v60 h-260 v40 Z" fill="#FFD100"/>')
F['Republic of Venice']=F['Venetia']
F['Lombardy']=svg(R(0,0,640,480,'#FFFFFF')+'<path d="M320 120 v240 M200 240 h240" stroke="#C8102E" stroke-width="56"/>')
F['Luxembourg']=svg(hbands(['#ED2939','#FFFFFF','#00A1DE']))
F['Belgium']=svg(vbands(['#000000','#FAE042','#ED2939']))
F['Netherlands']=svg(hbands(['#AE1C28','#FFFFFF','#21468B']))
F['Italy']=svg(vbands(['#008C45','#F4F5F0','#CD212A']))
F['Kingdom of Italy']=svg(vbands(['#008C45','#F4F5F0','#CD212A'])+R(236,150,168,180,'#F4F5F0')+'<path d="M258 180 h124 v70 q0 52 -62 76 q-62 -24 -62 -76 Z" fill="#CD212A" stroke="#FFD700" stroke-width="6"/><path d="M290 180 h26 v126 h-26 Z M258 212 h124 v26 h-124 Z" fill="#FFFFFF"/>')
F['German Empire']=svg(hbands(['#000000','#FFFFFF','#DD0000']))
F['Serbia']=svg(hbands(['#C6363C','#0C4076','#FFFFFF']))
F['Montenegro']=svg(R(0,0,640,480,'#C40308')+'<rect x="18" y="18" width="604" height="444" fill="none" stroke="#D4AF37" stroke-width="22"/>'+f'<circle cx="320" cy="240" r="70" fill="#D4AF37"/>')
F['Bulgaria']=svg(hbands(['#FFFFFF','#00966E','#D62612']))
F['Romania']=svg(vbands(['#002B7F','#FCD116','#CE1126']))
F['Greece']=svg(hbands(['#0D5EAF','#FFFFFF','#0D5EAF','#FFFFFF','#0D5EAF','#FFFFFF','#0D5EAF','#FFFFFF','#0D5EAF'])+R(0,0,208,208,'#0D5EAF')+'<path d="M80 0 v208 M0 80 h208" stroke="#FFFFFF" stroke-width="42"/>')
F['Albania']=svg(R(0,0,640,480,'#E41E20')+'<path d="M250 160 q30 -30 70 -10 q40 -20 70 10 q-20 30 -50 30 l20 60 h-80 l20 -60 q-30 0 -50 -30 Z" fill="#000"/>')
F['Iceland']=svg(nordic('#02529C','#DC1E35','#FFFFFF'))
F['Poland']=svg(hbands(['#FFFFFF','#DC143C']))
F['Poland-Lithuania']=svg(R(0,0,640,480,'#DC143C')+'<path d="M300 140 q-30 24 -30 62 q0 48 50 76 q50 -28 50 -76 q0 -38 -30 -62 q-20 28 -40 0 Z" fill="#FFFFFF"/>'+R(300,264,40,80,'#FFFFFF'))
F['Czechoslovakia']=svg(hbands(['#FFFFFF','#D7141A'])+'<polygon points="0,0 320,240 0,480" fill="#11457E"/>')
F['Yugoslavia']=svg(hbands(['#0C4076','#FFFFFF','#C6363C'])+f'<polygon points="{star(320,240,86,34)}" fill="#C6363C" stroke="#FFD700" stroke-width="7"/>')
F['Hungary']=svg(hbands(['#CE2939','#FFFFFF','#477050']))
F['Soviet Union']=svg(R(0,0,640,480,'#CC0000')+'<g transform="translate(-22,-18) scale(1.45)">'+f'<polygon points="{star(112,66,38,15)}" fill="#CC0000" stroke="#FFD700" stroke-width="5"/>'+'<path d="M 62 176 A 60 60 0 0 0 150 120" fill="none" stroke="#FFD700" stroke-width="10" stroke-linecap="round"/><path d="M 150 120 L 160 100 L 142 112 Z" fill="#FFD700"/><line x1="64" y1="118" x2="148" y2="178" stroke="#FFD700" stroke-width="10" stroke-linecap="round"/><polygon points="52,104 84,92 94,110 60,124" fill="#FFD700"/></g>')
F['USSR']=F['Soviet Union']
F['East Germany']=svg(hbands(['#000000','#DD0000','#FFCE00'])+'<g transform="translate(320,240)"><ellipse rx="82" ry="92" fill="none" stroke="#FFCE00" stroke-width="16" stroke-dasharray="9 5"/><rect x="-9" y="-62" width="18" height="128" fill="#FFCE00"/><rect x="-36" y="-66" width="72" height="26" fill="#FFCE00"/><path d="M -50 62 L 0 -34 L 50 62" fill="none" stroke="#FFCE00" stroke-width="11"/></g>')
F['West Germany']=svg(hbands(['#000000','#DD0000','#FFCE00']))
F['Germany']=F['West Germany']
F['Ireland']=svg(vbands(['#169B62','#FFFFFF','#FF883E']))
F['Turkey']=svg(R(0,0,640,480,'#E30A17')+crescent(262,240,110,'#FFFFFF',0.27,0.82,'#E30A17')+f'<polygon points="{star(392,240,46,20)}" fill="#FFFFFF"/>')
F['Free City of Krak\u00f3w']=svg(hbands(['#FFFFFF','#0039A6']))
# ---- Asia ----
F['Qing China']=svg(R(0,0,640,480,'#FFD800')+'<path d="M120 330 q70 -120 180 -130 q90 -8 150 40 q50 40 60 100" fill="none" stroke="#2E64A0" stroke-width="18"/><path d="M450 240 q40 -50 90 -20" fill="none" stroke="#2E64A0" stroke-width="14"/><circle cx="170" cy="180" r="34" fill="#D7262B"/><path d="M160 300 q60 -40 120 -30" fill="none" stroke="#2E64A0" stroke-width="12"/>')
F['Manchu Empire']=F['Qing China']
F['China (Republic of China)']=svg(R(0,0,640,480,'#FE0000')+R(0,0,320,240,'#000081')+f'<circle cx="160" cy="120" r="60" fill="#FFFFFF"/>'+''.join(f'<polygon points="{160+70*math.cos(math.radians(a))},{120+70*math.sin(math.radians(a))} {160+30*math.cos(math.radians(a-14))},{120+30*math.sin(math.radians(a-14))} {160+30*math.cos(math.radians(a+14))},{120+30*math.sin(math.radians(a+14))}" fill="#FFFFFF"/>' for a in range(0,360,30)))
F['China']=F['China (Republic of China)']
F["People's Republic of China"]=svg(R(0,0,640,480,'#EE1C25')+f'<polygon points="{star(120,120,64,26)}" fill="#FFFF00"/>'+''.join(f'<polygon points="{star(x,y,22,9,5,rot)}" fill="#FFFF00"/>' for x,y,rot in [(232,58,-70),(284,110,-50),(284,186,-30),(232,238,-10)]))
F['Empire of Japan']=svg(R(0,0,640,480,'#FFFFFF')+''.join(f'<polygon points="320,240 {320+460*math.cos(math.radians(a-7))},{240+460*math.sin(math.radians(a-7))} {320+460*math.cos(math.radians(a+7))},{240+460*math.sin(math.radians(a+7))}" fill="#BC002D"/>' for a in range(0,360,22))+f'<circle cx="320" cy="240" r="96" fill="#BC002D"/>')
F['Japan']=svg(R(0,0,640,480,'#FFFFFF')+f'<circle cx="320" cy="240" r="144" fill="#BC002D"/>')
F['Japan (U.S. occupation)']=F['Japan']
F['Japan (Tokugawa)']=svg(R(0,0,640,480,'#FFFFFF')+'<g transform="translate(320,240)"><circle r="130" fill="none" stroke="#111" stroke-width="16"/>'+''.join(f'<path d="M0 0 L{96*math.cos(math.radians(a))} {96*math.sin(math.radians(a))}" stroke="#111" stroke-width="14" stroke-linecap="round"/>' for a in range(0,360,120))+'<circle r="26" fill="#111"/></g>')
F['Joseon Korea']=svg(R(0,0,640,480,'#FFFFFF')+'<g transform="translate(320,240) rotate(-45)"><path d="M -88 0 a 88 88 0 0 1 176 0 a 44 44 0 0 0 -88 0 a 44 44 0 0 1 -88 0" fill="#C60C30"/><path d="M 88 0 a 88 88 0 0 1 -176 0 a 44 44 0 0 0 88 0 a 44 44 0 0 1 88 0" fill="#003478"/></g>'+''.join(f'<g transform="translate({320+170*math.cos(math.radians(a))},{240+170*math.sin(math.radians(a))}) rotate({a})"><rect x="-8" y="-40" width="16" height="80" fill="#000"/></g>' for a in (45,135,225,315)))
F['South Korea']=F['Joseon Korea']
F['North Korea']=svg(hbands(['#024FA2','#FFFFFF','#ED1C27','#FFFFFF','#024FA2'])+R(0,96,640,288,'#FFFFFF')+R(0,120,640,240,'#ED1C27')+f'<circle cx="214" cy="240" r="84" fill="#FFFFFF"/><polygon points="{star(214,240,66,27)}" fill="#ED1C27"/>')
F['Siam']=svg(R(0,0,640,480,'#A51931')+'<ellipse cx="320" cy="240" rx="150" ry="110" fill="#FFFFFF"/><ellipse cx="320" cy="240" rx="120" ry="84" fill="#A51931"/>')
F['Rattanakosin Kingdom']=F['Siam']
F['Thailand']=svg(hbands(['#A51931','#F4F5F8','#2D2A4A','#2D2A4A','#F4F5F8','#A51931'])+R(0,160,640,160,'#2D2A4A'))
F['Persia']=svg(hbands(['#239F40','#FFFFFF','#DA0000'])+'<g transform="translate(320,240)"><circle r="76" fill="#FFD700"/><path d="M-60 20 q20 -70 70 -56 q40 10 48 56 q-30 26 -60 10 q-34 18 -58 -10 Z" fill="#C8A000"/><rect x="40" y="-66" width="76" height="14" fill="#C8A000" transform="rotate(-30 40 -66)"/></g>')
F['Iran']=svg(hbands(['#239F40','#FFFFFF','#DA0000'])+'<g transform="translate(320,240)"><path d="M0 -58 q22 30 0 58 q-22 -28 0 -58 Z M-54 -14 q30 10 30 44 q-40 -6 -30 -44 Z M54 -14 q10 38 -30 44 q0 -34 30 -44 Z" fill="#DA0000"/></g>')
F['Afghanistan']=svg(vbands(['#000000','#D32011','#007A36'])+f'<circle cx="320" cy="240" r="78" fill="#FFFFFF"/><rect x="286" y="188" width="68" height="20" fill="#FFFFFF"/>')
F['Nepal']=svg('<path d="M90 40 L420 230 L250 230 L420 420 L90 420 Z" fill="#DC143C" stroke="#003893" stroke-width="26" stroke-linejoin="round"/>'+f'<polygon points="{star(190,340,32,13,12,0)}" fill="#FFFFFF"/>'+crescent(190,160,34,'#FFFFFF',0.0,0.0,None)+'<path d="M160 150 a34 34 0 1 0 60 0 Z" fill="#FFFFFF"/>')
F['Tibet']=svg(R(0,0,640,480,'#FFD700')+''.join(f'<polygon points="320,480 {320+520*math.cos(math.radians(a))},{480+520*math.sin(math.radians(a))} {320+520*math.cos(math.radians(a+15))},{480+520*math.sin(math.radians(a+15))}" fill="{"#D7262B" if i%2 else "#1961AE"}"/>' for i,a in enumerate(range(-180,-10,15)))+f'<circle cx="320" cy="300" r="70" fill="#FFD700" stroke="#C8A000" stroke-width="6"/>')
F['Mongolia']=svg(vbands(['#C4272F','#015197','#C4272F'])+'<g transform="translate(106,240)" fill="#F9CF02"><circle cy="-128" r="22"/><rect x="-26" y="-98" width="52" height="18"/><rect x="-26" y="-62" width="52" height="60"/><rect x="-26" y="20" width="52" height="18"/><circle cy="60" r="22"/><rect x="-44" y="-10" width="18" height="60"/><rect x="26" y="-10" width="18" height="60"/></g>')
F['British India']=svg(ucross('#012169','#C8102E','#FFFFFF'))
F['India']=svg(hbands(['#FF9933','#FFFFFF','#138808'])+f'<circle cx="320" cy="240" r="58" fill="none" stroke="#000088" stroke-width="10"/>'+''.join(f'<line x1="320" y1="240" x2="{320+56*math.cos(math.radians(a))}" y2="{240+56*math.sin(math.radians(a))}" stroke="#000088" stroke-width="4"/>' for a in range(0,360,15)))
F['Pakistan']=svg(R(0,0,640,480,'#01411C')+R(0,0,160,480,'#FFFFFF')+crescent(390,240,110,'#FFFFFF',0.3,0.84,'#01411C')+f'<polygon points="{star(470,180,40,17)}" fill="#FFFFFF"/>')
F['Israel']=svg(R(0,0,640,480,'#FFFFFF')+R(0,70,640,56,'#0038B8')+R(0,354,640,56,'#0038B8')+'<g fill="none" stroke="#0038B8" stroke-width="16"><polygon points="320,160 390,280 250,280"/><polygon points="320,320 250,200 390,200"/></g>')
F['Saudi Arabia']=svg(R(0,0,640,480,'#006C35')+R(120,210,400,26,'#FFFFFF')+'<path d="M180 300 h280 l-26 36 h-228 Z" fill="#FFFFFF"/>')
F['Iraq']=svg(hbands(['#CE1126','#FFFFFF','#000000'])+''.join(f'<polygon points="{star(x,240,36,15)}" fill="#007A3D"/>' for x in (230,320,410)))
F['Syria']=svg(hbands(['#CE1126','#FFFFFF','#000000'])+''.join(f'<polygon points="{star(x,240,36,15)}" fill="#007A3D"/>' for x in (240,400)))
F['Lebanon']=svg(hbands(['#ED1C24','#FFFFFF','#FFFFFF','#ED1C24'])+R(0,120,640,240,'#FFFFFF')+'<path d="M320 160 l60 120 h-120 Z M320 210 l80 110 h-160 Z" fill="#00A850"/><rect x="306" y="300" width="28" height="48" fill="#5B3A1A"/>')
F['Vietnam (Nguy\u1ec5n)']=svg(R(0,0,640,480,'#FFD700')+R(0,150,640,40,'#C8102E')+R(0,290,640,40,'#C8102E'))
F['\u0110\u1ea1i Vi\u1ec7t']=F['Vietnam (Nguy\u1ec5n)']
F['Vietnam (divided)']=svg(R(0,0,640,480,'#DA251D')+f'<polygon points="{star(320,240,110,46)}" fill="#FFFF00"/>')
F['Burma (Konbaung)']=svg(R(0,0,640,480,'#FFD700')+'<g transform="translate(320,250)"><ellipse rx="92" ry="66" fill="#2E8B57"/><path d="M-30 -60 q30 -60 60 0 q-30 20 -60 0 Z" fill="#2E8B57"/><circle cx="-54" cy="-18" r="10" fill="#FFD700"/></g>')
F['Burma']=svg(R(0,0,640,480,'#CE1126')+R(0,0,260,200,'#012169')+f'<polygon points="{star(130,100,56,23)}" fill="#FFFFFF"/>'+''.join(f'<polygon points="{star(130+96*math.cos(math.radians(a)),100+96*math.sin(math.radians(a)),22,9)}" fill="#FFFFFF"/>' for a in (-90,-18,54,126,198)))
F['Indonesia']=svg(hbands(['#CE1126','#FFFFFF']))
F['Dutch East Indies']=svg(hbands(['#AE1C28','#FFFFFF','#21468B']))
F['Philippines']=svg('<rect width="640" height="480" fill="#0038A8"/>'+R(0,240,640,240,'#CE1126')+'<polygon points="0,0 277,240 0,480" fill="#FFFFFF"/>'+f'<circle cx="92" cy="240" r="46" fill="#FCD116"/>'+''.join(f'<polygon points="{star(x,y,26,11)}" fill="#FCD116"/>' for x,y in [(42,110),(42,370),(214,240)]))
F['American Philippines']=F['Philippines']
F['Taiwan']=F['China (Republic of China)']
# ---- Americas ----
def usflag(stars=True):
    s=''.join(R(0,i*480/13,640,480/13+0.5,'#B22234' if i%2==0 else '#FFFFFF') for i in range(13))
    s+=R(0,0,256,480*7/13,'#3C3B6E')
    if stars:
        for r_ in range(9):
            for c in range(11 if r_%2==0 else 10):
                x=14+c*(228/10 if r_%2==0 else 228/10)+(0 if r_%2==0 else 11.4); y=12+r_*(480*7/13-24)/8
                s+=f'<polygon points="{star(x,y,8,3.4)}" fill="#FFFFFF"/>'
    return svg(s)
F['United States']=usflag()
F['Canada']=svg(R(0,0,640,480,'#FFFFFF')+R(0,0,160,480,'#FF0000')+R(480,0,160,480,'#FF0000')+'<path d="M320 120 l16 54 l44 -24 l-14 52 l48 -8 l-34 40 l44 24 l-50 12 l10 48 l-46 -28 l-18 54 l-18 -54 l-46 28 l10 -48 l-50 -12 l44 -24 l-34 -40 l48 8 l-14 -52 l44 24 Z" fill="#FF0000"/>')
F['British North America']=svg(ucross('#012169','#C8102E','#FFFFFF'))
F['Mexico']=svg(vbands(['#006847','#FFFFFF','#CE1126'])+'<ellipse cx="320" cy="240" rx="52" ry="34" fill="#8B5A2B"/><path d="M290 226 q30 -36 60 0 q-30 24 -60 0 Z" fill="#4C6B2F"/>')
F['Brazil']=svg(R(0,0,640,480,'#009C3B')+'<polygon points="320,56 596,240 320,424 44,240" fill="#FFDF00"/><circle cx="320" cy="240" r="92" fill="#002776"/><path d="M232 212 q90 42 176 -8 v36 q-88 46 -176 8 Z" fill="#FFFFFF"/>')
F['Brazil (Portuguese)']=svg(R(0,0,640,480,'#009C3B')+'<polygon points="320,56 596,240 320,424 44,240" fill="#FFDF00"/><circle cx="320" cy="240" r="86" fill="#FFFFFF" stroke="#003F87" stroke-width="10"/><rect x="286" y="196" width="68" height="88" fill="#003F87"/>')
F['Argentina']=svg(hbands(['#74ACDF','#FFFFFF','#74ACDF'])+f'<circle cx="320" cy="240" r="44" fill="#F6B40E" stroke="#843511" stroke-width="5"/>')
F['United Provinces of the R\u00edo de la Plata']=F['Argentina']
F['Chile']=svg(R(0,0,640,480,'#FFFFFF')+R(0,240,640,240,'#D52B1E')+R(0,0,240,240,'#0039A6')+f'<polygon points="{star(120,120,68,28)}" fill="#FFFFFF"/>')
F['Peru']=svg(vbands(['#D91023','#FFFFFF','#D91023']))
F['Viceroyalty of Peru']=svg(R(0,0,640,480,'#FFFFFF')+'<path d="M160 100 h320 v200 q0 90 -160 130 q-160 -40 -160 -130 Z" fill="#C60B1E" stroke="#AA8000" stroke-width="8"/><path d="M160 100 h160 v160 h-160 Z M320 260 h160 v40 q0 90 -160 130 Z" fill="#FFD100"/>')
F['Viceroyalty of New Spain']=F['Viceroyalty of Peru']
F['Viceroyalty of New Granada']=F['Viceroyalty of Peru']
F['Colombia']=svg(hbands(['#FCD116','#FCD116','#003893','#CE1126']))
F['Venezuela']=svg(hbands(['#FFCE00','#00247D','#CF142B'])+''.join(f'<polygon points="{star(320+120*math.cos(math.radians(a)),250+120*math.sin(math.radians(a)),16,7)}" fill="#FFFFFF"/>' for a in range(-150,-20,26)))
F['Cuba']=svg(hbands(['#002A8F','#FFFFFF','#002A8F','#FFFFFF','#002A8F'])+'<polygon points="0,0 277,240 0,480" fill="#CF142B"/>'+f'<polygon points="{star(92,240,46,19)}" fill="#FFFFFF"/>')
F['Haiti']=svg(hbands(['#00209F','#D21034'])+R(240,180,160,120,'#FFFFFF'))
F['Paraguay']=svg(hbands(['#D52B1E','#FFFFFF','#0038A8'])+f'<circle cx="320" cy="240" r="52" fill="#FFFFFF" stroke="#0038A8" stroke-width="4"/><polygon points="{star(320,240,26,11)}" fill="#009B3A"/>')
F['Uruguay']=svg(''.join(R(0,i*53.3,640,54,'#FFFFFF' if i%2==0 else '#0038A8') for i in range(9))+R(0,0,256,240,'#FFFFFF')+f'<circle cx="128" cy="120" r="46" fill="#FCD116"/>')
F['Bolivia']=svg(hbands(['#D52B1E','#F9E300','#007934']))
F['Ecuador']=svg(hbands(['#FFDD00','#FFDD00','#034EA2','#ED1C24']))
F['Panama']=svg(R(0,0,640,480,'#FFFFFF')+R(320,0,320,240,'#DA121A')+R(0,240,320,240,'#072357')+f'<polygon points="{star(160,120,56,23)}" fill="#072357"/><polygon points="{star(480,360,56,23)}" fill="#DA121A"/>')
F['Guatemala']=svg(vbands(['#4997D0','#FFFFFF','#4997D0']))
F['Kingdom of Hawaii']=svg(''.join(R(0,i*60,640,61,['#FFFFFF','#C8102E','#012169','#FFFFFF','#C8102E','#012169','#FFFFFF','#C8102E'][i]) for i in range(8))+'<clipPath id="hj"><rect width="256" height="240"/></clipPath><g clip-path="url(#hj)"><rect width="256" height="240" fill="#012169"/><path d="M0 0 L256 240 M256 0 L0 240" stroke="#FFFFFF" stroke-width="40"/><path d="M0 0 L256 240 M256 0 L0 240" stroke="#C8102E" stroke-width="14"/><path d="M128 0 V240 M0 120 H256" stroke="#FFFFFF" stroke-width="64"/><path d="M128 0 V240 M0 120 H256" stroke="#C8102E" stroke-width="38"/></g>')
# ---- Africa & Middle East ----
F['Egypt (Muhammad Ali)']=svg(R(0,0,640,480,'#CE1126')+''.join(crescent(180+i*150,240,56,'#FFFFFF',0.3,0.82,'#CE1126')+f'<polygon points="{star(220+i*150,240,22,9)}" fill="#FFFFFF"/>' for i in range(3)))
F['Egypt']=svg(hbands(['#CE1126','#FFFFFF','#000000'])+'<g transform="translate(320,240)"><path d="M-44 -30 q44 -34 88 0 l-10 46 q-34 22 -68 0 Z" fill="#C09300"/><circle cy="-44" r="14" fill="#C09300"/></g>')
F['Egypt (United Arab Republic)']=svg(hbands(['#CE1126','#FFFFFF','#000000'])+''.join(f'<polygon points="{star(x,240,40,17)}" fill="#007A3D"/>' for x in (260,380)))
F['Morocco']=svg(R(0,0,640,480,'#C1272D')+f'<polygon points="{star(320,240,120,52,5,-90)}" fill="none" stroke="#006233" stroke-width="16"/>')
F['Ethiopia']=svg(hbands(['#078930','#FCDD09','#DA121A']))
F['Ethiopian Empire']=svg(hbands(['#078930','#FCDD09','#DA121A']))
F['Ethiopia (Abyssinia)']=svg(hbands(['#078930','#FCDD09','#DA121A'])+'<rect x="280" y="190" width="30" height="130" fill="#DA121A"/><rect x="236" y="214" width="118" height="30" fill="#DA121A"/>')
F['Liberia']=svg(''.join(R(0,i*43.6,640,44,'#BF0A30' if i%2==0 else '#FFFFFF') for i in range(11))+R(0,0,256,196,'#002868')+f'<polygon points="{star(128,98,66,27)}" fill="#FFFFFF"/>')
F['Union of South Africa']=svg(hbands(['#E8590C','#FFFFFF','#002395'])+'<clipPath id="sa"><rect x="268" y="206" width="104" height="68"/></clipPath><g clip-path="url(#sa)"><rect x="268" y="206" width="104" height="68" fill="#012169"/><path d="M268 206 L372 274 M372 206 L268 274" stroke="#FFFFFF" stroke-width="14"/><path d="M268 206 L372 274 M372 206 L268 274" stroke="#C8102E" stroke-width="5"/><path d="M320 206 V274 M268 240 H372" stroke="#FFFFFF" stroke-width="22"/><path d="M320 206 V274 M268 240 H372" stroke="#C8102E" stroke-width="13"/></g>'+R(176,210,66,60,'#E8590C')+R(176,230,66,20,'#FFFFFF')+R(176,250,66,20,'#002395')+R(398,210,66,20,'#DE3831')+R(398,230,66,20,'#FFFFFF')+R(398,250,66,20,'#002395')+R(398,210,18,60,'#007749'))
F['South Africa']=F['Union of South Africa']
F['Tunisia']=svg(R(0,0,640,480,'#E70013')+f'<circle cx="320" cy="240" r="110" fill="#FFFFFF"/>'+crescent(330,240,74,'#E70013',0.3,0.8,'#FFFFFF')+f'<polygon points="{star(362,240,32,13)}" fill="#E70013"/>')
F['Oman']=svg(R(0,0,640,480,'#FFFFFF')+R(0,160,640,160,'#C8102E')+R(0,320,640,160,'#008000')+R(0,0,180,480,'#C8102E'))
F['Muscat']=svg(R(0,0,640,480,'#C8102E'))
F['Yemen']=svg(hbands(['#CE1126','#FFFFFF','#000000']))
F['Nejd (Emirate of Diriyah)']=svg(R(0,0,640,480,'#006C35')+R(120,220,400,22,'#FFFFFF'))
F['Libya']=svg(R(0,0,640,480,'#239E46'))
F['Italian Libya']=F['Kingdom of Italy']
F['Sudan']=svg(hbands(['#D21034','#FFFFFF','#000000'])+'<polygon points="0,0 240,240 0,480" fill="#007229"/>')
F['Jordan']=svg(hbands(['#000000','#FFFFFF','#007A3D'])+'<polygon points="0,0 260,240 0,480" fill="#CE1126"/>'+f'<polygon points="{star(96,240,30,13,7,-90)}" fill="#FFFFFF"/>')
F['Kuwait']=svg(hbands(['#007A3D','#FFFFFF','#CE1126'])+'<polygon points="0,0 200,160 200,320 0,480" fill="#000000"/>')
F['Ghana']=svg(hbands(['#CE1126','#FCD116','#006B3F'])+f'<polygon points="{star(320,240,54,22)}" fill="#000000"/>')
F['Nigeria']=svg(vbands(['#008751','#FFFFFF','#008751']))
F['British Nigeria']=svg(ucross('#012169','#C8102E','#FFFFFF'))
F['Kenya (British colony)']=svg(ucross('#012169','#C8102E','#FFFFFF'))
F['Congo (L\u00e9opoldville)']=svg(R(0,0,640,480,'#0082C8')+f'<polygon points="{star(320,240,70,28)}" fill="#FFD700"/>'+''.join(f'<polygon points="{star(50,40+i*60,22,9)}" fill="#FFD700"/>' for i in range(6)))
F['Belgian Congo']=svg(R(0,0,640,480,'#0082C8')+f'<polygon points="{star(320,240,80,32)}" fill="#FFD700"/>')
F['Zaire']=svg(R(0,0,640,480,'#0A9F4A')+f'<circle cx="320" cy="240" r="140" fill="#FFD400"/>'+R(312,150,16,96,'#5B3A1A')+'<polygon points="320,100 352,150 336,166 304,166 288,150" fill="#E4002B"/><rect x="304" y="238" width="32" height="104" rx="12" fill="#B5651D"/><circle cx="320" cy="236" r="22" fill="#B5651D"/>')
F['Rhodesia']=svg(R(0,0,214,480,'#00A859')+R(214,0,212,480,'#FFFFFF')+R(426,0,214,480,'#00A859')+'<path d="M270 150 h100 v120 q0 50 -50 70 q-50 -20 -50 -70 Z" fill="#FFC72C" stroke="#222" stroke-width="5"/><path d="M270 150 h100 v50 h-100 Z" fill="#CC0000"/><circle cx="320" cy="260" r="18" fill="#222"/>')
F['Asante Empire']=svg(hbands(['#000000','#FFD700','#006B3F'])+R(0,0,640,160,'#FFD700')+R(0,160,640,160,'#000000')+'<circle cx="320" cy="240" r="52" fill="#FFD700"/>')
F['Zulu Kingdom']=svg(R(0,0,640,480,'#8B1A1A')+'<path d="M320 60 q90 60 90 180 t-90 180 q-90 -60 -90 -180 t90 -180 Z" fill="#F5E6C8" stroke="#3A2A1A" stroke-width="10"/><path d="M320 60 q90 60 90 180 t-90 180" fill="#3A2A1A" fill-opacity=".25"/>')
F['Kingdom of Benin']=svg(R(0,0,640,480,'#8B1A1A')+'<circle cx="320" cy="240" r="110" fill="#D4AF37"/><path d="M250 240 q70 -70 140 0 q-70 70 -140 0 Z" fill="#8B1A1A"/>')
F['Kingdom of Kongo']=svg(R(0,0,640,480,'#FFD700')+'<path d="M320 110 v260 M200 240 h240" stroke="#000" stroke-width="30"/>')
F['Merina Kingdom']=svg(R(0,0,640,480,'#FFFFFF')+R(0,0,640,160,'#C8102E'))
F['Madagascar']=svg(R(0,0,640,480,'#FFFFFF')+R(0,240,640,240,'#007E3A')+R(0,0,213,480,'#FFFFFF')+R(213,0,427,240,'#FC3D32')+R(213,240,427,240,'#007E3A'))
# ---- Early-modern / medieval banners ----
F['Holy Roman Empire']=svg(R(0,0,640,480,'#FFD700')+'<g transform="translate(320,240)"><path d="M0 -150 q-52 -44 -104 0 q-40 36 -8 86 q-48 -6 -58 40 q-8 44 44 60 q-30 36 12 70 q38 28 72 -14 q34 42 72 14 q42 -34 12 -70 q52 -16 44 -60 q-10 -46 -58 -40 q32 -50 -8 -86 q-52 -44 -104 0 Z" fill="#000"/><rect x="-18" y="-10" width="36" height="150" fill="#000"/></g>')
F['England']=svg(R(0,0,640,480,'#FFFFFF')+'<path d="M320 0 V480 M0 240 H640" stroke="#CE1124" stroke-width="112"/>')
F['Scotland']=svg(R(0,0,640,480,'#0065BD')+'<path d="M0 0 L640 480 M640 0 L0 480" stroke="#FFFFFF" stroke-width="96"/>')
F['Castile']=svg(R(0,0,640,480,'#C60B1E')+'<g fill="#FFD100" transform="translate(320,240)"><rect x="-90" y="-10" width="180" height="120" rx="8"/><rect x="-60" y="-80" width="40" height="80"/><rect x="-10" y="-110" width="40" height="110"/><rect x="40" y="-80" width="40" height="80"/></g>')
F['Arag\u00f3n']=svg(''.join(R(0,i*68.6,640,69,'#FFD100' if i%2==0 else '#C60B1E') for i in range(7)))
F['Navarre']=svg(R(0,0,640,480,'#C60B1E')+'<g stroke="#FFD100" stroke-width="18" fill="none"><circle cx="320" cy="240" r="110"/><path d="M320 130 V350 M210 240 H430 M243 163 L397 317 M397 163 L243 317"/></g>')
F['Denmark-Norway']=svg(nordic('#C8102E','#FFFFFF'))
F['Kalmar Union']=svg(R(0,0,640,480,'#FFFFFF')+'<path d="M0 240 H640 M240 0 V480" stroke="#C8102E" stroke-width="96"/>')
F['Teutonic Order']=svg(R(0,0,640,480,'#FFFFFF')+'<path d="M320 60 V420 M140 240 H500" stroke="#000" stroke-width="86"/>')
F['Grand Duchy of Moscow']=svg(R(0,0,640,480,'#C8102E')+'<g transform="translate(320,240)"><circle r="130" fill="none" stroke="#FFD700" stroke-width="10"/><path d="M-70 60 q10 -120 70 -120 q60 0 70 120 Z" fill="#FFD700"/><circle cy="-80" r="26" fill="#FFD700"/></g>')
F['Mamluk Sultanate']=svg(R(0,0,640,480,'#FFD700')+'<path d="M180 300 q140 -120 280 0" fill="none" stroke="#8B1A1A" stroke-width="20"/><circle cx="320" cy="180" r="54" fill="#8B1A1A"/>')
F['Golden Horde']=svg(R(0,0,640,480,'#FFFFFF')+'<circle cx="320" cy="240" r="110" fill="none" stroke="#1F6FB2" stroke-width="20"/><path d="M320 130 v220" stroke="#1F6FB2" stroke-width="20"/>')
F['Crimean Khanate']=svg(R(0,0,640,480,'#0092CC')+'<g transform="translate(320,240)" fill="none" stroke="#FFD700" stroke-width="22" stroke-linecap="round"><path d="M-80 60 q0 -90 80 -90 q80 0 80 90"/><path d="M0 -30 v-90"/></g>')
F['Delhi Sultanate']=svg(R(0,0,640,480,'#0C7B3E')+crescent(300,240,96,'#FFFFFF',0.3,0.84,'#0C7B3E'))
F['Mali']=svg(R(0,0,640,480,'#FFD700')+'<circle cx="320" cy="240" r="96" fill="#8B1A1A"/>')
F['Songhai Empire']=svg(R(0,0,640,480,'#0C7B3E')+crescent(320,240,96,'#FFD700',0.3,0.84,'#0C7B3E'))
F['Ming China']=svg(R(0,0,640,480,'#D7262B')+'<path d="M140 320 q80 -140 200 -150 q110 -10 160 60" fill="none" stroke="#FFD700" stroke-width="20"/><circle cx="190" cy="170" r="36" fill="#FFD700"/>')
F['Inca Empire']=svg(''.join(R(0,i*68.6,640,69,c) for i,c in enumerate(['#E40303','#FF8C00','#FFED00','#008026','#004DFF','#750787','#8B00FF'])))
F['Aztec Empire']=svg(R(0,0,640,480,'#2E8B57')+'<g transform="translate(320,240)"><ellipse rx="70" ry="48" fill="#8B5A2B"/><path d="M-66 -10 q66 -76 132 0 q-66 44 -132 0 Z" fill="#D7262B"/><circle cy="-70" r="24" fill="#FFD700"/></g>')
F['Ayutthaya Kingdom']=svg(R(0,0,640,480,'#A51931'))
F['Georgia']=svg(R(0,0,640,480,'#FFFFFF')+'<path d="M320 0 V480 M0 240 H640" stroke="#FF0000" stroke-width="92"/>'+''.join(f'<path d="M{x} {y-28} v56 M{x-28} {y} h56" stroke="#FF0000" stroke-width="18"/>' for x,y in [(150,110),(490,110),(150,370),(490,370)]))
F['Byzantine Empire']=svg(R(0,0,640,480,'#FFD700')+'<g transform="translate(320,240)" fill="#8B1A1A"><path d="M-130 -60 q40 -40 70 -10 q60 -40 120 0 q50 36 10 80 q-10 50 -70 40 q-60 10 -70 -40 q-40 -44 0 -70 Z"/><rect x="-14" y="20" width="28" height="90"/><ellipse cy="110" rx="80" ry="22"/></g>')
F['Papal States']=F['Papal States']
F['Mutapa Empire']=svg(R(0,0,640,480,'#8B1A1A')+'<path d="M320 120 l40 90 l96 8 l-72 66 l22 96 l-86 -52 l-86 52 l22 -96 l-72 -66 l96 -8 Z" fill="#FFD700"/>')
F['Kanem-Bornu']=svg(R(0,0,640,480,'#0C7B3E')+R(0,180,640,120,'#FFD700'))
F['Oyo']=svg(R(0,0,640,480,'#FFFFFF')+R(0,0,640,160,'#1F6FB2')+R(0,320,640,160,'#1F6FB2'))
F['Hafsid Sultanate']=svg(R(0,0,640,480,'#FFFFFF')+crescent(320,240,110,'#D7262B',0.3,0.84,'#FFFFFF'))
F['Aceh']=svg(R(0,0,640,480,'#D7262B')+crescent(300,240,96,'#FFFFFF',0.3,0.84,'#D7262B')+'<rect x="300" y="150" width="20" height="180" fill="#FFFFFF" transform="rotate(30 310 240)"/>')
F['Malacca Sultanate']=svg(R(0,0,640,480,'#FFD700')+crescent(300,240,90,'#D7262B',0.3,0.84,'#FFD700'))
F['Iroquois Confederacy']=svg(R(0,0,640,480,'#59259D')+'<g fill="#FFFFFF"><rect x="60" y="222" width="110" height="36"/><rect x="470" y="222" width="110" height="36"/><path d="M320 150 l60 90 l-60 90 l-60 -90 Z"/><circle cx="214" cy="240" r="30"/><circle cx="426" cy="240" r="30"/></g>')
F['Tu\u02bbi Tonga Empire']=svg(R(0,0,640,480,'#C10000')+R(0,0,256,196,'#FFFFFF')+'<path d="M128 40 V156 M70 98 H186" stroke="#C10000" stroke-width="34"/>')
F['M\u0101ori']=svg(R(0,0,640,480,'#000000')+'<path d="M0 480 Q180 300 100 160 Q60 90 140 60 Q120 140 200 190 Q320 270 300 480 Z" fill="#FFFFFF"/><path d="M340 480 Q420 320 360 200" fill="none" stroke="#C8102E" stroke-width="22"/>')
F['Australia']=svg(ucross('#012169','#C8102E','#FFFFFF')+'<g transform="scale(0.5) translate(0,0)"></g>')
F['New Zealand']=svg('<rect width="640" height="480" fill="#012169"/><g transform="scale(0.5)"><rect width="640" height="480" fill="#012169"/><path d="M0 0 L640 480 M640 0 L0 480" stroke="#FFFFFF" stroke-width="96"/><clipPath id="nz"><path d="M320,240 L640,240 L640,480 Z M320,240 L320,480 L0,480 Z M320,240 L0,240 L0,0 Z M320,240 L320,0 L640,0 Z"/></clipPath><path d="M0 0 L640 480 M640 0 L0 480" clip-path="url(#nz)" stroke="#C8102E" stroke-width="32"/><path d="M320 0 V480 M0 240 H640" stroke="#FFFFFF" stroke-width="160"/><path d="M320 0 V480 M0 240 H640" stroke="#C8102E" stroke-width="96"/></g>'+''.join(f'<polygon points="{star(x,y,r_,r_*0.42)}" fill="#C8102E" stroke="#FFFFFF" stroke-width="5"/>' for x,y,r_ in [(470,110,26),(530,230,22),(470,350,26),(416,240,20)]))
DROP=['Inca Empire', 'Aztec Empire', 'Mutapa Empire', 'Zulu Kingdom', 'Kingdom of Benin', 'Asante Empire', 'Māori', 'Iroquois Confederacy', 'Golden Horde', 'Crimean Khanate', 'Mamluk Sultanate', 'Grand Duchy of Moscow', 'Byzantine Empire', 'Ming China', 'Qing China', 'Manchu Empire', 'Japan (Tokugawa)', 'Burma (Konbaung)', 'Egypt (Muhammad Ali)', 'Oyo', 'Kanem-Bornu', 'Mali', 'Songhai Empire', 'Delhi Sultanate', 'Hafsid Sultanate', 'Aceh', 'Malacca Sultanate', 'Kingdom of Kongo', 'Ayutthaya Kingdom', 'Holy Roman Empire', 'Prussia', 'Austrian Empire', 'Austria-Hungary', 'Venetia', 'Republic of Venice', 'Viceroyalty of Peru', 'Viceroyalty of New Spain', 'Viceroyalty of New Granada', 'Brazil (Portuguese)', 'Persia', 'Tibet', 'Merina Kingdom', 'Congo (Léopoldville)', 'Belgian Congo', 'Australia', 'Nepal', 'Mexico', 'Papal States', 'Zaire', 'Castile', 'Navarre', 'Kalmar Union', 'Grand Duchy of Finland', 'Montenegro', 'Albania', 'Lebanon', 'Afghanistan', 'Mongolia', 'Georgia']
for d in DROP: F.pop(d, None)
META=json.load(open('hist_meta.json',encoding='utf-8'))
out={}
for name,s in F.items():
    png=cairosvg.svg2png(bytestring=s.encode('utf-8'),output_width=192,output_height=144)
    im=Image.open(io.BytesIO(png)).convert('RGB'); b=io.BytesIO(); im.save(b,'WEBP',quality=76,method=6)
    out[name]='data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
print(len(out),'realm flags,',sum(len(v) for v in out.values())//1024,'KB')
json.dump(out,open('realm_flags.json','w'),ensure_ascii=True)
# contact sheet
names=list(F.keys()); cols=10; rows=(len(names)+cols-1)//cols
sheet=Image.new('RGB',(cols*128,rows*96),(240,244,246))
for i,n in enumerate(names):
    png=cairosvg.svg2png(bytestring=F[n].encode('utf-8'),output_width=128,output_height=96)
    sheet.paste(Image.open(io.BytesIO(png)).convert('RGB'),((i%cols)*128,(i//cols)*96))
sheet.save('realm_sheet.png')
print('names:', ' | '.join(names))
