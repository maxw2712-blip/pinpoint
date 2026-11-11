# -*- coding: utf-8 -*-
import json
D='data/'
S,E,A,M,O='S','E','A','M','O'
PERIODS={}
# ---------- 500 BCE ----------
PERIODS['classical']=('bc500',[
 ["Achaemenid Empire","Achaemenid Persian Empire",None,S],["Greek city-states","Greek city-states",None,E],["Rome","Roman Republic",None,E],
 ["Carthaginian Empire","Carthaginian Empire",None,A],["Zhou states","Zhou China","Luoyang",S],["Etrurians","Etruscans",None,E],
 ["Olmec","Olmec",None,M],["Magadha","Magadha","Rajagriha",S],["Meroe","Kingdom of Kush",None,A],["Saba","Saba (Sheba)","Marib",S],
 ["Chavin","Chav\u00edn culture",None,M],["Late Jomon culture","Late J\u014dmon Japan",None,S],["Illyrians","Illyrians",None,E],["Samnites","Samnites",None,E],
 ["Boii","Boii (Celts)",None,E],["Kosala","Kosala","Shravasti",S],["Avanti","Avanti","Ujjain",S],["Gandh\u0101ra","Gandhara",None,S],["Kuru","Kuru",None,S],
 ["Pancala","Panchala",None,S],["Simhala","Sri Lanka (Simhala)",None,S],["Hindu kingdoms","Hindu kingdoms",None,S],["Adena Culture","Adena culture",None,M],
 ["Khoisan","Khoisan peoples",None,A],["Ainu","Ainu",None,S],["Saami","Saami",None,E],["Curonians","Curonians",None,E],["Guanches","Guanches",None,A],
 ["Blemmyes","Blemmyes",None,A],["Austronesians","Austronesians",None,O],["Chorrera","Chorrera",None,M],["El Paraiso","El Para\u00edso",None,M],
 ["Proto-Altaic pastoralists","Proto-Altaic pastoralists",None,S],["Surasena","Surasena",None,S],["Vatsa","Vatsa","Kaushambi",S],["Kasi","Kashi","Varanasi",S],
 ["Malla","Malla",None,S],["Sabini","Sabines",None,E]],
 ["Achaemenid Empire","Greek city-states","Rome","Carthaginian Empire","Zhou states","Etrurians","Olmec","Meroe","Magadha","Saba","Chavin","Late Jomon culture","Illyrians","Gandh\u0101ra","Boii","Khoisan","Ainu","Simhala","Guanches","Austronesians"],
 ["Surasena","Vatsa","Kasi","Malla","Kuru","Pancala","Avanti","Kosala","Sabini","Samnites","Blemmyes","El Paraiso","Chorrera","Curonians","Saami"])
# ---------- 800 CE ----------
PERIODS['early']=('800',[
 ["Tang Empire","Tang China","Chang\u2019an",S],["Abbasid Caliphate","Abbasid Caliphate","Baghdad",S],["Byzantine Empire","Byzantine Empire","Constantinople",E],
 ["Carolingian Empire","Carolingian Empire","Aachen",E],["Japan","Japan","Kyoto",S],["Tibetan Empire","Tibetan Empire","Lhasa",S],
 ["Northmen","Vikings (Northmen)",None,E],["Papal States","Papal States","Rome",E],["Srivijaya Empire","Srivijaya","Palembang",S],
 ["Emirate of C\u00f3rdoba","Emirate of C\u00f3rdoba",None,E],["Asturias","Kingdom of Asturias","Oviedo",E],["Idrisid Caliphate","Idrisid dynasty","Fez",A],
 ["Aghlabid Emirate","Aghlabid Emirate","Kairouan",A],["Khazars","Khazar Khaganate","Atil",E],["Bulgars","First Bulgarian Empire","Pliska",E],
 ["Avars","Avar Khaganate",None,E],["Magyars","Magyars",None,E],["Danes","Danes",None,E],["Wessex","Wessex","Winchester",E],["Mercia","Mercia",None,E],
 ["Northumbria","Northumbria","York",E],["Parhae","Balhae",None,S],["Silia","Silla","Gyeongju",S],["Nan Chao","Nanzhao",None,S],["Palas","Pala Empire",None,S],
 ["Gurjara Pratihara","Gurjara-Pratihara Empire","Kannauj",S],["Rashtrakuta state","Rashtrakuta Empire",None,S],["Pallava state","Pallava dynasty","Kanchipuram",S],
 ["Pandya state","Pandya dynasty","Madurai",S],["Champa","Champa",None,S],["Chen-La","Chenla",None,S],["Ghana","Ghana Empire","Koumbi Saleh",A],
 ["Makkura","Makuria","Dongola",A],["Alwa","Alwa","Soba",A],["Axum","Kingdom of Axum",None,A],["Kanem","Kanem",None,A],["Huari Empire","Wari Empire",None,M],
 ["Tiahuanaco Empire","Tiwanaku",None,M],["Maya city-states","Maya city-states",None,M],["Toltec Empire","Toltec culture",None,M],["Uyghurs","Uyghur Khaganate","Ordu-Baliq",S],
 ["Irlanda","Ireland",None,E],["Picts","Picts",None,E],["Scots","Scots",None,E],["Lombard duchies","Lombard duchies",None,E],["Slavonic tribes","Slavic tribes",None,E],
 ["Rus' Khaganate","Rus\u2019 Khaganate",None,E],["Swedes and Goths","Swedes and Goths",None,E],["Czechs","Czechs (Moravia)",None,E],["Anasazi","Ancestral Puebloans",None,M],
 ["Malay","Malay states",None,S],["Mataram","Mataram",None,S],["Dvaravati","Dvaravati",None,S],["Pyu state","Pyu city-states",None,S],["Mon state","Mon kingdoms",None,S],
 ["Celtic kingdoms","Celtic kingdoms",None,E],["Welsh","Welsh kingdoms",None,E],["Cyprus","Cyprus",None,E],["Karelians","Karelians",None,E],["Bantu peoples","Bantu peoples",None,A],["Malagasy","Malagasy",None,A]],
 ["Tang Empire","Abbasid Caliphate","Byzantine Empire","Carolingian Empire","Japan","Tibetan Empire","Northmen","Papal States","Srivijaya Empire","Maya city-states","Ghana","Axum","Emirate of C\u00f3rdoba","Khazars","Bulgars","Magyars","Silia","Huari Empire","Tiahuanaco Empire","Uyghurs"],
 ["Dvaravati","Pyu state","Mon state","Mataram","Malay","Karelians","Czechs","Scots","Picts","Welsh","Celtic kingdoms","Lombard duchies","Slavonic tribes","Mercia","Danes","Swedes and Goths","Rus' Khaganate","Malagasy","Cyprus","Anasazi"])
# ---------- 1500 ----------
PERIODS['discovery']=('1500',[
 ["Ming Chinese Empire","Ming China","Beijing",S],["Ottoman Empire","Ottoman Empire","Constantinople",E],["Aztec Empire","Aztec Empire","Tenochtitlan",M],["Inca Empire","Inca Empire","Cusco",M],
 ["Portugal","Portugal","Lisbon",E],["Castille","Castile",None,E],["Arag\u00f3n","Arag\u00f3n",None,E],["France","France","Paris",E],["England","England","London",E],["Scotland","Scotland","Edinburgh",E],
 ["Holy Roman Empire","Holy Roman Empire",None,E],["Venice","Republic of Venice",None,E],["Papal States","Papal States","Rome",E],["Poland-Lithuania","Poland-Lithuania",None,E],
 ["Grand Duchy of Moscow","Grand Duchy of Moscow","Moscow",E],["Golden Horde","Golden Horde",None,E],["Crimean Khanate","Crimean Khanate",None,E],["Mamluke Sultanate","Mamluk Sultanate","Cairo",A],
 ["Songhai","Songhai Empire","Gao",A],["Mali","Mali",None,A],["Benin","Kingdom of Benin",None,A],["Kanem-Bornu","Kanem-Bornu",None,A],["Ethiopia","Ethiopian Empire",None,A],
 ["Mwenemutapa","Mutapa Empire",None,A],["Congo","Kingdom of Kongo","Mbanza Kongo",A],["Oyo","Oyo",None,A],["Vijayanagara","Vijayanagara Empire",None,S],["Sultanate of Delhi","Delhi Sultanate",None,S],
 ["Bahmani Kingdom","Bahmani Sultanate","Bidar",S],["Bengal","Bengal Sultanate",None,S],["Ayutthaya","Ayutthaya Kingdom",None,S],["\u0110\u1ea1i Vi\u1ec7t","\u0110\u1ea1i Vi\u1ec7t","Th\u0103ng Long",S],
 ["Korea","Joseon Korea","Hanyang (Seoul)",S],["Japan","Japan","Kyoto",S],["Tibet","Tibet",None,S],["Timurid Emirates","Timurid emirates",None,S],["Emirate of the White Sheep Turks","Aq Qoyunlu",None,S],
 ["Hafsid Caliphate","Hafsid Sultanate","Tunis",A],["Zayyanid Caliphate","Zayyanid Sultanate","Tlemcen",A],["Wattasid Caliphate","Wattasid Sultanate","Fez",A],["Georgia","Georgia","Tbilisi",S],
 ["Denmark-Norway","Denmark-Norway","Copenhagen",E],["Kalmar Union","Kalmar Union",None,E],["Swiss Confederation","Swiss Confederacy",None,E],["Teutonic Knights","Teutonic Order",None,E],["Navarre","Navarre",None,E],
 ["Cyprus","Cyprus",None,E],["Aceh","Aceh",None,S],["Malacca","Malacca Sultanate",None,S],["Pegu","Pegu",None,S],["Cambodia","Cambodia",None,S],["Laos","Lan Xang","Luang Prabang",S],["Champa","Champa",None,S],
 ["Philippines","Philippine islands",None,S],["Maori","M\u0101ori",None,O],["Polynesians","Polynesians",None,O],["Iroquois","Iroquois Confederacy",None,M],["Cherokee","Cherokee",None,M],["Navajo","Navajo",None,M],
 ["Apache","Apache",None,M],["Comanche","Comanche",None,M],["Huron","Huron",None,M],["Mixtec Empire","Mixtec kingdoms",None,M],["Maya city-states","Maya city-states",None,M],["Tu\u02bbi Tonga Empire","Tu\u02bbi Tonga Empire",None,O],
 ["Merina Kingdom","Merina Kingdom",None,A],["Taiwan","Taiwan",None,S],["Muscat","Muscat",None,S],["Yemen","Yemen",None,S],["Hadramaut","Hadramaut",None,S],["Ahmadnagar","Ahmadnagar Sultanate",None,S],
 ["Bijapur","Bijapur Sultanate",None,S],["Golkonda","Golconda Sultanate",None,S],["Orissa","Orissa (Gajapati)",None,S],["Rajastan","Rajput states",None,S],["Oirat Confederation","Oirat Confederation",None,S],
 ["Chagatai Khanate","Chagatai Khanate",None,S],["Khanate of Sibir","Khanate of Sibir",None,S],["Ndongo","Ndongo",None,A],["Hausa States","Hausa city-states",None,A],["Akan","Akan states",None,A],
 ["Funj","Funj Sultanate",None,A],["Adal","Adal Sultanate",None,A],["Madagascar","Madagascar",None,A],["Ainus","Ainu",None,S]],
 ["Ming Chinese Empire","Ottoman Empire","Aztec Empire","Inca Empire","Portugal","France","England","Holy Roman Empire","Castille","Arag\u00f3n","Papal States","Venice","Grand Duchy of Moscow","Japan","Songhai","Mamluke Sultanate","Mali","Sultanate of Delhi","Vijayanagara","Poland-Lithuania","Ethiopia","Benin","Korea","Mwenemutapa","Congo","Tibet","Denmark-Norway","Scotland","Golden Horde","Ayutthaya","\u0110\u1ea1i Vi\u1ec7t","Iroquois","Maya city-states","Maori"],
 ["Ndongo","Hausa States","Akan","Funj","Adal","Orissa","Rajastan","Bijapur","Ahmadnagar","Golkonda","Oirat Confederation","Khanate of Sibir","Chagatai Khanate","Wattasid Caliphate","Zayyanid Caliphate","Hafsid Caliphate","Muscat","Hadramaut","Teutonic Knights","Navarre","Merina Kingdom","Comanche","Huron","Apache"])
# ---------- 1914 ----------
PERIODS['wwi']=('1914',[
 ["German Empire","German Empire","Berlin",E],["Austro-Hungarian Empire","Austria-Hungary","Vienna",E],["Russian Empire","Russian Empire","Saint Petersburg",E],["Ottoman Empire","Ottoman Empire","Constantinople",S],
 ["United Kingdom of Great Britain and Ireland","United Kingdom","London",E],["France","France","Paris",E],["Kingdom of Italy","Italy","Rome",E],["Spain","Spain","Madrid",E],["Portugal","Portugal","Lisbon",E],
 ["Belgium","Belgium","Brussels",E],["Netherlands","Netherlands","Amsterdam",E],["Denmark","Denmark","Copenhagen",E],["Norway","Norway","Kristiania (Oslo)",E],["Sweden","Sweden","Stockholm",E],
 ["Switzerland","Switzerland","Bern",E],["Luxembourg","Luxembourg",None,E],["Serbia","Serbia","Belgrade",E],["Montenegro","Montenegro","Cetinje",E],["Bulgaria","Bulgaria","Sofia",E],["Romania","Romania","Bucharest",E],
 ["Greece","Greece","Athens",E],["Albania","Albania",None,E],["Iceland","Iceland","Reykjav\u00edk",E],["Grand Duchy of Finland","Grand Duchy of Finland","Helsinki",E],["Persia","Persia","Tehran",S],["Afghanistan","Afghanistan","Kabul",S],
 ["Manchu Empire","China (Republic of China)","Beijing",S],["Empire of Japan","Empire of Japan","Tokyo",S],["British Raj","British India","Delhi",S],["Rattanakosin Kingdom","Siam","Bangkok",S],["Nepal","Nepal","Kathmandu",S],
 ["Tibet","Tibet","Lhasa",S],["Mongolia","Mongolia","Urga",S],["Xinjiang","Xinjiang",None,S],["Abyssinia","Ethiopia (Abyssinia)","Addis Ababa",A],["Liberia","Liberia","Monrovia",A],["Egypt","Egypt","Cairo",A],
 ["Morocco","Morocco",None,A],["Tunisia","Tunisia","Tunis",A],["Algeria","French Algeria","Algiers",A],["Libya","Italian Libya","Tripoli",A],["Anglo-Egyptian Sudan","Anglo-Egyptian Sudan","Khartoum",A],
 ["South Africa","Union of South Africa","Pretoria",A],["Belgian Congo","Belgian Congo","Boma",A],["German E. Africa (Tanganyika)","German East Africa","Dar es Salaam",A],["German South-West Africa","German South West Africa","Windhoek",A],
 ["Kamerun","German Kamerun",None,A],["French West Africa","French West Africa","Dakar",A],["French Equatorial Africa","French Equatorial Africa","Brazzaville",A],["Angola","Portuguese Angola",None,A],
 ["Mozambique","Portuguese Mozambique",None,A],["Rhodesia","Rhodesia","Salisbury",A],["Nigeria","British Nigeria","Lagos",A],["British East Africa","British East Africa","Nairobi",A],["Madagascar (France)","French Madagascar","Antananarivo",A],
 ["United States","United States","Washington, D.C.",M],["Canada","Canada","Ottawa",M],["Mexico","Mexico","Mexico City",M],["Brazil","Brazil","Rio de Janeiro",M],["Argentina","Argentina","Buenos Aires",M],["Chile","Chile","Santiago",M],
 ["Peru","Peru","Lima",M],["Colombia","Colombia","Bogot\u00e1",M],["Venezuela","Venezuela","Caracas",M],["Cuba","Cuba","Havana",M],["Bolivia","Bolivia",None,M],["Uruguay","Uruguay","Montevideo",M],["Paraguay","Paraguay","Asunci\u00f3n",M],
 ["Ecuador","Ecuador","Quito",M],["Panama","Panama","Panama City",M],["Guatemala","Guatemala","Guatemala City",M],["Haiti","Haiti","Port-au-Prince",M],["Australia","Australia","Melbourne",O],["New Zealand","New Zealand","Wellington",O],
 ["Papua New Guinea","Papua and New Guinea",None,O],["Netherlands Indies","Dutch East Indies","Batavia",S],["French Indochina","French Indochina","Hanoi",S],["Philippines","American Philippines","Manila",S],["Ceylon","British Ceylon","Colombo",S],["Malaya","British Malaya",None,S]],
 ["German Empire","Russian Empire","United Kingdom of Great Britain and Ireland","France","Austro-Hungarian Empire","Ottoman Empire","Kingdom of Italy","United States","Empire of Japan","Serbia","Belgium","British Raj","Manchu Empire","Canada","Australia","Brazil","Mexico","Egypt","Spain","Netherlands","Portugal","Greece","Bulgaria","Romania","Norway","Sweden","Denmark","Switzerland","South Africa","Belgian Congo","Argentina","Abyssinia","Afghanistan","Persia","Cuba","New Zealand"],
 ["German E. Africa (Tanganyika)","Kamerun","Anglo-Egyptian Sudan","Montenegro","Albania","Luxembourg","Iceland","Xinjiang","Tibet","Mongolia","Nepal","Papua New Guinea","Rhodesia","Angola","Mozambique","Ceylon","Malaya","Haiti","Paraguay","Bolivia","Madagascar (France)","British East Africa","Liberia","Grand Duchy of Finland"])

def lat_max(g):
    mx=[-999]
    def w(a):
        if isinstance(a[0],(int,float)): mx[0]=max(mx[0],a[1])
        else:
            for b in a: w(b)
    w(g['coordinates']); return mx[0]
HISTT={}; FAME={}
for pid,(year,rows,order,last) in PERIODS.items():
    d=json.load(open(f'{D}world_{year}.geojson',encoding='utf-8'))
    cur={r[0]:r for r in rows}
    found=set(); feats=[]
    for f in d['features']:
        if not f.get('geometry'): continue
        if lat_max(f['geometry'])<-58: continue
        k=f['properties'].get('NAME'); k=k.strip() if k else None
        props={}
        if k in cur: props={'name':k}; found.add(k)
        feats.append({'type':'Feature','properties':props,'geometry':f['geometry'],'_p':1 if props else 0})
    feats.sort(key=lambda x:x['_p'])
    for x in feats: del x['_p']
    # keys in the raw data may carry stray spaces; report anything missing
    names_raw={(f['properties'].get('NAME') or '').strip() for f in d['features']}
    missing=[k for k in cur if k not in found]
    bad_order=[k for k in order+last if k not in cur]
    print(pid,year,'features',len(feats),'playable',len(found),'missing',missing,'order-not-in-table',bad_order)
    json.dump({'type':'FeatureCollection','features':feats},open(f'work_{pid}.geojson','w',encoding='utf-8'),ensure_ascii=False)
    HISTT[pid]=[r for r in rows if r[0] in found]
    FAME[pid]={'order':[k for k in order if k in found],'last':[k for k in last if k in found]}
json.dump(HISTT,open('hist_table2.json','w',encoding='utf-8'),ensure_ascii=True)
json.dump(FAME,open('fame_hist2.json','w',encoding='utf-8'),ensure_ascii=True)
