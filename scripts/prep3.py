# -*- coding: utf-8 -*-
import json
D='data/'
S,E,A,M,O='S','E','A','M','O'
P={}
P['vienna']=('1815',[
 ["Austrian Empire","Austrian Empire","Vienna",E],["Prussia","Prussia","Berlin",E],["Russian Empire","Russian Empire","Saint Petersburg",E],
 ["United Kingdom of Great Britain and Ireland","United Kingdom","London",E],["France","France","Paris",E],["Spain","Spain","Madrid",E],["Portugal","Portugal",None,E],
 ["Ottoman Empire","Ottoman Empire","Constantinople",S],["Kingdom of Sardinia","Kingdom of Sardinia","Turin",E],["Kingdom of the Two Sicilies","Kingdom of the Two Sicilies","Naples",E],
 ["Papal States","Papal States","Rome",E],["Sweden\u2013Norway","Sweden\u2013Norway","Stockholm",E],["Denmark","Denmark","Copenhagen",E],["Switzerland","Switzerland",None,E],
 ["Bavaria","Bavaria","Munich",E],["W\u00fcrttemberg","W\u00fcrttemberg","Stuttgart",E],["Saxony","Saxony","Dresden",E],["Hanover","Hanover",None,E],["Baden","Baden","Karlsruhe",E],
 ["Tuscany","Grand Duchy of Tuscany","Florence",E],["Venetia","Venetia",None,E],["Lombardy","Lombardy",None,E],["Luxembourg","Luxembourg",None,E],["Republic of Krak\u00f3w","Free City of Krak\u00f3w",None,E],
 ["Persia","Persia","Tehran",S],["Afghanistan","Afghanistan",None,S],["Nepal","Nepal","Kathmandu",S],["Manchu Empire","Qing China","Beijing",S],["Japan","Japan (Tokugawa)","Edo",S],
 ["Korea","Joseon Korea","Hanyang (Seoul)",S],["Rattanakosin Kingdom","Siam","Bangkok",S],["Burma","Burma (Konbaung)","Amarapura",S],["Annam","Vietnam (Nguy\u1ec5n)","Hu\u1ebf",S],
 ["Maratha Confederacy","Maratha Confederacy","Pune",S],["British East India Company","British East India Company","Calcutta",S],["Mysore (Indian princely state)","Mysore",None,S],
 ["Egypt","Egypt (Muhammad Ali)","Cairo",A],["Morocco","Morocco",None,A],["Algiers","Algiers (Regency)",None,A],["Tunis","Tunis (Regency)",None,A],["Tripolitania","Tripolitania",None,A],
 ["Ethiopia","Ethiopia",None,A],["Asante","Asante Empire","Kumasi",A],["Zulu","Zulu Kingdom",None,A],["Buganda","Buganda",None,A],["Oyo","Oyo",None,A],["Fulani Empire","Sokoto (Fulani Empire)",None,A],
 ["Kanem-Bornu","Kanem-Bornu",None,A],["Cape Colony","Cape Colony","Cape Town",A],["Merina Kingdom","Merina Kingdom","Antananarivo",A],
 ["United States","United States","Washington, D.C.",M],["Canada","British North America",None,M],["Haiti","Haiti",None,M],["Viceroyalty of New Spain","Viceroyalty of New Spain","Mexico City",M],
 ["Viceroyalty of Peru","Viceroyalty of Peru","Lima",M],["Viceroyalty of New Granada","Viceroyalty of New Granada","Bogot\u00e1",M],["Viceroyalty of Brazil","Brazil (Portuguese)","Rio de Janeiro",M],
 ["United Provinces of the R\u00edo de la Plata","United Provinces of the R\u00edo de la Plata","Buenos Aires",M],["Paraguay","Paraguay",None,M],["Kingdom of Hawaii","Kingdom of Hawaii",None,O],
 ["Maori","M\u0101ori",None,O],["Tu\u02bbi Tonga Empire","Tu\u02bbi Tonga Empire",None,O],["Oman","Oman",None,S],["Yemen","Yemen",None,S],["Nejd","Nejd (Emirate of Diriyah)",None,S]],
 ["Russian Empire","United Kingdom of Great Britain and Ireland","France","Austrian Empire","Prussia","Ottoman Empire","Spain","United States","Qing China","Japan","Portugal","Papal States","Sweden\u2013Norway","Egypt","Persia","Viceroyalty of New Spain","Viceroyalty of Peru","Viceroyalty of Brazil","Denmark","Switzerland"] and
 ["Russian Empire","United Kingdom of Great Britain and Ireland","France","Austrian Empire","Prussia","Ottoman Empire","Spain","United States","Manchu Empire","Japan","Portugal","Papal States","Sweden\u2013Norway","Egypt","Persia","Viceroyalty of New Spain","Viceroyalty of Peru","Viceroyalty of Brazil","Denmark","Switzerland","Kingdom of the Two Sicilies","Kingdom of Sardinia","Bavaria","Maratha Confederacy","British East India Company","Korea","Rattanakosin Kingdom","Burma"],
 ["Mysore (Indian princely state)","Tripolitania","Buganda","Oyo","Kanem-Bornu","Fulani Empire","Asante","Zulu","Tu\u02bbi Tonga Empire","Maori","Kingdom of Hawaii","Nejd","Oman","Yemen","Republic of Krak\u00f3w","Luxembourg","Hanover","Baden","Venetia","Lombardy","Paraguay","Haiti"])
P['ww2']=('1945',[
 ["United States","United States","Washington, D.C.",M],["USSR","Soviet Union","Moscow",E],["United Kingdom","United Kingdom","London",E],["France","France","Paris",E],["China","China","Chongqing",S],
 ["Japan (USA)","Japan (U.S. occupation)","Tokyo",S],["Germany (USA)","Germany (U.S. zone)",None,E],["Germany (UK)","Germany (British zone)",None,E],["Germany (France)","Germany (French zone)",None,E],
 ["Germany (Soviet)","Germany (Soviet zone)",None,E],["Italy","Italy","Rome",E],["Poland","Poland","Warsaw",E],["Czechoslovakia","Czechoslovakia","Prague",E],["Yugoslavia","Yugoslavia","Belgrade",E],
 ["Spain","Spain","Madrid",E],["Portugal","Portugal","Lisbon",E],["Turkey","Turkey","Ankara",S],["Iran","Iran","Tehran",S],["Egypt","Egypt","Cairo",A],["India","British India","New Delhi",S],
 ["Australia","Australia","Canberra",O],["Canada","Canada","Ottawa",M],["Brazil","Brazil","Rio de Janeiro",M],["Argentina","Argentina","Buenos Aires",M],["Mexico","Mexico","Mexico City",M],
 ["Austria","Austria","Vienna",E],["Hungary","Hungary","Budapest",E],["Romania","Romania","Bucharest",E],["Bulgaria","Bulgaria","Sofia",E],["Greece","Greece","Athens",E],["Finland","Finland","Helsinki",E],
 ["Sweden","Sweden","Stockholm",E],["Norway","Norway","Oslo",E],["Denmark","Denmark","Copenhagen",E],["Netherlands","Netherlands","Amsterdam",E],["Belgium","Belgium","Brussels",E],
 ["Switzerland","Switzerland","Bern",E],["Ireland","Ireland","Dublin",E],["Albania","Albania","Tirana",E],["Saudi Arabia","Saudi Arabia","Riyadh",S],["Iraq","Iraq","Baghdad",S],["Syria","Syria","Damascus",S],
 ["Lebanon","Lebanon","Beirut",S],["Ethiopia","Ethiopia","Addis Ababa",A],["South Africa","South Africa","Pretoria",A],["Korea (USA)","Korea (U.S. zone)",None,S],["Korea (USSR)","Korea (Soviet zone)",None,S],
 ["Mongolia","Mongolia","Ulaanbaatar",S],["Thailand","Thailand","Bangkok",S],["Philippines","Philippines","Manila",S],["New Zealand","New Zealand","Wellington",O],["Chile","Chile","Santiago",M],
 ["Cuba","Cuba","Havana",M],["Colombia","Colombia","Bogot\u00e1",M],["Venezuela","Venezuela","Caracas",M],["Peru","Peru","Lima",M],["Afghanistan","Afghanistan","Kabul",S],["Indonesia","Dutch East Indies",None,S],
 ["Manchuria","Manchuria",None,S],["Tibet","Tibet","Lhasa",S],["Xinjiang","Xinjiang",None,S],["Nepal","Nepal","Kathmandu",S]],
 ["United States","USSR","United Kingdom","France","China","Japan (USA)","Germany (USA)","Germany (Soviet)","Germany (UK)","Germany (France)","Italy","Poland","Yugoslavia","India","Australia","Canada","Brazil","Spain","Turkey","Egypt","Iran","Netherlands","Sweden","Greece","Czechoslovakia","Mexico","Argentina","South Africa"],
 ["Nepal","Tibet","Xinjiang","Manchuria","Mongolia","Albania","Ethiopia","Afghanistan","Lebanon","Syria","Iraq","Ireland","Finland","Bulgaria","Romania","Hungary","Austria","Philippines","Thailand","Venezuela","Peru","Colombia","Cuba","Chile"])
P['coldwar']=('1960',[
 ["United States","United States","Washington, D.C.",M],["USSR","Soviet Union","Moscow",E],["United Kingdom","United Kingdom","London",E],["France","France","Paris",E],["West Germany","West Germany","Bonn",E],
 ["East Germany","East Germany","East Berlin",E],["China","People's Republic of China","Beijing",S],["Japan","Japan","Tokyo",S],["India","India","New Delhi",S],["Pakistan","Pakistan",None,S],["Israel","Israel",None,S],
 ["Egypt","Egypt (United Arab Republic)","Cairo",A],["Cuba","Cuba","Havana",M],["Yugoslavia","Yugoslavia","Belgrade",E],["Czechoslovakia","Czechoslovakia","Prague",E],["Hungary","Hungary","Budapest",E],
 ["Poland","Poland","Warsaw",E],["Romania","Romania","Bucharest",E],["Bulgaria","Bulgaria","Sofia",E],["Albania","Albania","Tirana",E],["Italy","Italy","Rome",E],["Spain","Spain","Madrid",E],
 ["Portugal","Portugal","Lisbon",E],["Greece","Greece","Athens",E],["Turkey","Turkey","Ankara",S],["Iran","Iran","Tehran",S],["Iraq","Iraq","Baghdad",S],["Saudi Arabia","Saudi Arabia","Riyadh",S],
 ["Korea, Democratic People's Republic of","North Korea","Pyongyang",S],["Korea, Republic of","South Korea","Seoul",S],["Vietnam","Vietnam (divided)",None,S],["Laos","Laos","Vientiane",S],["Cambodia","Cambodia","Phnom Penh",S],
 ["Thailand","Thailand","Bangkok",S],["Indonesia","Indonesia","Jakarta",S],["Philippines","Philippines","Manila",S],["Australia","Australia","Canberra",O],["Canada","Canada","Ottawa",M],["Brazil","Brazil","Bras\u00edlia",M],
 ["Argentina","Argentina","Buenos Aires",M],["Mexico","Mexico","Mexico City",M],["Chile","Chile","Santiago",M],["South Africa","South Africa","Pretoria",A],["Ghana","Ghana","Accra",A],["Nigeria","Nigeria","Lagos",A],
 ["Zaire","Congo (L\u00e9opoldville)","L\u00e9opoldville",A],["Ethiopia","Ethiopia","Addis Ababa",A],["Algeria","French Algeria","Algiers",A],["Kenya","Kenya (British colony)","Nairobi",A],["Cyprus","Cyprus","Nicosia",E],
 ["Netherlands","Netherlands","Amsterdam",E],["Belgium","Belgium","Brussels",E],["Sweden","Sweden","Stockholm",E],["Norway","Norway","Oslo",E],["Denmark","Denmark","Copenhagen",E],["Switzerland","Switzerland","Bern",E],
 ["Austria","Austria","Vienna",E],["Finland","Finland","Helsinki",E],["Ireland","Ireland","Dublin",E],["Iceland","Iceland","Reykjav\u00edk",E],["Mongolia","Mongolia","Ulaanbaatar",S],["Afghanistan","Afghanistan","Kabul",S],
 ["Tibet","Tibet","Lhasa",S],["Libya","Libya",None,A],["Morocco","Morocco","Rabat",A],["Tunisia","Tunisia","Tunis",A],["Sudan","Sudan","Khartoum",A],["Syria","Syria","Damascus",S],["Jordan","Jordan","Amman",S],
 ["Lebanon","Lebanon","Beirut",S],["Kuwait","Kuwait",None,S],["Yemen","Yemen",None,S],["Burma","Burma","Rangoon",S],["Sri Lanka","Ceylon (Sri Lanka)","Colombo",S],["New Zealand","New Zealand","Wellington",O],
 ["Venezuela","Venezuela","Caracas",M],["Colombia","Colombia","Bogot\u00e1",M],["Peru","Peru","Lima",M]],
 ["United States","USSR","United Kingdom","France","West Germany","East Germany","China","Japan","India","Cuba","Israel","Egypt","Yugoslavia","Czechoslovakia","Hungary","Poland","Italy","Spain","Turkey","Iran","Korea, Democratic People's Republic of","Korea, Republic of","Vietnam","Canada","Australia","Brazil","Mexico","Argentina","South Africa","Zaire","Greece","Albania","Pakistan","Iraq","Saudi Arabia","Netherlands","Sweden"],
 ["Laos","Cambodia","Ghana","Kenya","Algeria","Cyprus","Libya","Tunisia","Morocco","Sudan","Kuwait","Yemen","Jordan","Lebanon","Mongolia","Tibet","Burma","Sri Lanka","Iceland","Ireland","Finland","Austria","Venezuela","Peru","Colombia","Chile"])
def lat_max(g):
    mx=[-999]
    def w(a):
        if isinstance(a[0],(int,float)): mx[0]=max(mx[0],a[1])
        else:
            for b in a: w(b)
    w(g['coordinates']); return mx[0]
HISTT={}; FAME={}
for pid,(year,rows,order,last) in P.items():
    d=json.load(open(f'{D}world_{year}.geojson',encoding='utf-8'))
    cur={r[0]:r for r in rows}; found=set(); feats=[]
    for f in d['features']:
        if not f.get('geometry'): continue
        g=f['geometry']
        if g['type']=='MultiPolygon':
            keep=[c for c in g['coordinates'] if lat_max({'coordinates':c})>=-58]
            if not keep: continue
            f['geometry']={'type':'MultiPolygon','coordinates':keep}
        elif lat_max(g)<-58: continue
        k=(f['properties'].get('NAME') or '').strip() or None
        props={'name':k} if k in cur else {}
        if props: found.add(k)
        feats.append({'type':'Feature','properties':props,'geometry':f['geometry'],'_p':1 if props else 0})
    feats.sort(key=lambda x:x['_p'])
    for x in feats: del x['_p']
    missing=[k for k in cur if k not in found]
    print(pid,year,'features',len(feats),'playable',len(found),'missing',missing,'order-not-found',[k for k in order+last if k not in cur])
    json.dump({'type':'FeatureCollection','features':feats},open(f'work_{pid}.geojson','w',encoding='utf-8'),ensure_ascii=False)
    HISTT[pid]=[r for r in rows if r[0] in found]
    FAME[pid]={'order':[k for k in order if k in found],'last':[k for k in last if k in found]}
json.dump(HISTT,open('hist_table3.json','w',encoding='utf-8'),ensure_ascii=True)
json.dump(FAME,open('fame_hist3.json','w',encoding='utf-8'),ensure_ascii=True)
