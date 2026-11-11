# -*- coding: utf-8 -*-
import json, re, collections

D='data/'
def load(f): return json.load(open(D+f,encoding='utf-8'))

# ---------------- Historical packs ----------------
ANCIENT = [
 ["Roman Empire","Roman Empire","Rome","E"],["Han","Han Empire","Luoyang","S"],
 ["Parthian Empire","Parthian Empire","Ctesiphon","S"],["Kushan Empire","Kushan Empire",None,"S"],
 ["Axum","Kingdom of Axum","Axum","A"],["Meroe","Kingdom of Meroë","Meroë","A"],
 ["Nabatean Kingdom","Nabataean Kingdom","Petra","S"],["Armenia","Kingdom of Armenia","Artaxata","S"],
 ["Dacia","Dacia","Sarmizegetusa","E"],["Bosporian Kingdom","Bosporan Kingdom","Panticapaeum","E"],
 ["Himyarite Kingdom","Himyarite Kingdom","Zafar","S"],["Hadramaut","Hadramaut","Shabwa","S"],
 ["Satavahanihara","Satavahana Empire","Pratishthana","S"],["Koguryo","Goguryeo",None,"S"],
 ["Paekche","Baekje",None,"S"],["Silla","Silla","Seorabeol","S"],["Yayoi","Yayoi Japan",None,"S"],
 ["Scythians","Scythians",None,"E"],["Alans","Alans",None,"E"],["Saka Kingdom","Saka Kingdom",None,"S"],
 ["Southern Xiongnu","Southern Xiongnu",None,"S"],["Suren Kingdom","Suren (Indo-Parthian) Kingdom",None,"S"],
 ["Simhala","Simhala (Sri Lanka)","Anuradhapura","S"],["Teotihuacan","Teotihuacan",None,"M"],
 ["Maya chiefdoms and states","Maya city-states",None,"M"],["Moche","Moche",None,"M"],["Nazca","Nazca",None,"M"],
 ["Monte Albán","Monte Albán (Zapotec)",None,"M"],["Hopewell Culture","Hopewell culture",None,"M"],
 ["Khoisan","Khoisan peoples",None,"A"],["Hindu kingdoms","Hindu kingdoms",None,"S"],["Ainu","Ainu",None,"S"],
 ["Guanches","Guanches",None,"A"],["Kalinga","Kalinga",None,"S"],["Arakan","Arakan",None,"S"],
 ["Saami","Saami",None,"E"],["Curonians","Curonians",None,"E"],
]
MEDIEVAL = [
 ["Almohad Caliphate","Almohad Caliphate","Marrakesh","A"],["Angevin Empire","Angevin Empire",None,"E"],
 ["Aragón","Aragón",None,"E"],["Castilla","Castile",None,"E"],["León","León",None,"E"],
 ["Navarre","Navarre","Pamplona","E"],["Portugal","Portugal","Coimbra","E"],
 ["Byzantine Empire","Byzantine Empire","Constantinople","E"],["Kingdom of France","Kingdom of France","Paris","E"],
 ["Holy Roman Empire","Holy Roman Empire",None,"E"],["Papal States","Papal States","Rome","E"],
 ["Venice","Republic of Venice",None,"E"],["Denmark","Denmark",None,"E"],["Norway","Norway",None,"E"],
 ["Sweden","Sweden",None,"E"],["Poland","Poland",None,"E"],["Hungary","Hungary",None,"E"],
 ["Scotland","Scotland",None,"E"],["Croatia","Croatia",None,"E"],["Cyprus","Cyprus","Nicosia","E"],
 ["Sardinia","Sardinia",None,"E"],["Principality of Kyiv","Principality of Kyiv","Kyiv","E"],
 ["Principality of Novgorod","Principality of Novgorod","Novgorod","E"],
 ["Principality of Vladimir-Suzdal","Vladimir-Suzdal","Vladimir","E"],
 ["Principality of Galicia-Volhynia","Galicia-Volhynia",None,"E"],
 ["Georgia","Kingdom of Georgia","Tbilisi","S"],["Armenia","Armenia",None,"S"],
 ["Buyid dynasty","Buyid dynasty",None,"S"],["Ghaznavid Emirate","Ghaznavid Emirate",None,"S"],
 ["Khwarazmian dynasty","Khwarazmian Empire",None,"S"],["Kara Khitai Khaganate","Kara Khitai",None,"S"],
 ["Mongol Empire","Mongol Empire",None,"S"],["Song Empire","Song Empire","Hangzhou","S"],
 ["Xixia","Western Xia","Xingqing","S"],["Imperial Japan (Fujiwara)","Heian Japan","Kyoto","S"],
 ["Goryeo","Goryeo","Kaesong","S"],["Đại Việt","Đại Việt","Thăng Long","S"],
 ["Khmer Empire","Khmer Empire","Angkor","S"],["Bagan","Bagan Kingdom",None,"S"],
 ["Champa City States","Champa",None,"S"],["Srivijaya Empire","Srivijaya","Palembang","S"],
 ["Sultanate of Delhi","Delhi Sultanate",None,"S"],["Chola Empire","Chola Empire",None,"S"],
 ["Rajput kingdoms","Rajput kingdoms",None,"S"],["Tibet","Tibet",None,"S"],["Yemen","Yemen",None,"S"],
 ["Ghana","Ghana Empire","Koumbi Saleh","A"],["Kanem","Kanem Empire",None,"A"],["Mali","Mali",None,"A"],
 ["Takrur","Takrur",None,"A"],["Ifat","Ifat Sultanate",None,"A"],["Makkura","Makuria","Dongola","A"],
 ["Alwa","Alwa","Soba","A"],["Merina Kingdom","Merina Kingdom",None,"A"],["Great Zimbabwe","Great Zimbabwe",None,"A"],
 ["Chimú Empire","Chimú Empire","Chan Chan","M"],["Toltec Empire","Toltec Empire","Tula","M"],
 ["Taino","Taíno",None,"M"],["Mesoamerican city-states and chiefdoms","Mesoamerican city-states",None,"M"],
 ["Maya city-states","Maya city-states",None,"M"],
 ["Tuʻi Tonga Empire","Tuʻi Tonga Empire","Mu‘a","O"],["Polynesians","Polynesians",None,"O"],["Papuans","Papuans",None,"O"],
]
def hist(year, table, out):
    d=load(f'world_{year}.geojson')
    cur={r[0]:r for r in table}
    feats=[]; found=set()
    for f in d['features']:
        if not f.get('geometry'): continue
        lats=[]
        def _w(a):
            if isinstance(a[0],(int,float)): lats.append(a[1])
            else:
                for b in a: _w(b)
        _w(f['geometry']['coordinates'])
        if lats and max(lats)<-58: continue
        k=f['properties'].get('NAME'); k=k.strip() if k else None
        props={}
        if k in cur: props={'name':k}; found.add(k)
        feats.append({'type':'Feature','properties':props,'geometry':f['geometry'],'_p':1 if props else 0})
    feats.sort(key=lambda x:x['_p'])
    for x in feats: del x['_p']
    missing=[k for k in cur if k not in found]
    print(year,'features',len(feats),'playable',len(found),'MISSING',missing)
    json.dump({'type':'FeatureCollection','features':feats},open(out,'w',encoding='utf-8'),ensure_ascii=False)
    return [[r[0],r[1],r[2],r[3]] for r in table if r[0] in found]
a=hist('100',ANCIENT,'work_ancient.geojson')
m=hist('1200',MEDIEVAL,'work_medieval.geojson')
json.dump({'ancient':a,'medieval':m},open('hist_table.json','w',encoding='utf-8'),ensure_ascii=False)

# ---------------- Physical pack ----------------
regs=load('ne_50m_geography_regions_polys.geojson')['features']
mar=load('ne_50m_geography_marine_polys.geojson')['features']
riv=load('ne_50m_rivers_lake_centerlines.geojson')['features']
lak=load('ne_50m_lakes.geojson')['features']

OVR={
 'PENÍNSULA IBÉRICA':'Iberian Peninsula','INDIA':'Indian Peninsula','SCANDINAVIA':'Scandinavian Peninsula','KOREA':'Korean Peninsula',
 'FLORIDA':'Florida Peninsula','BAJA CALIFORNIA':'Baja California','PEN. DE YUCATÁN':'Yucatán Peninsula','BALKAN PEN.':'Balkan Peninsula',
 'CRIMEA':'Crimean Peninsula','INDOCHINA PENINSULA':'Indochina Peninsula','ARABIAN PENINSULA':'Arabian Peninsula','TAYMYR PENINSULA':'Taymyr Peninsula',
 'YAMAL PENINSULA':'Yamal Peninsula','KAMCHATKA PENINSULA':'Kamchatka Peninsula','MALAY PENINSULA':'Malay Peninsula','SOMALI PENINSULA':'Horn of Africa',
 'KOLA PENINSULA':'Kola Peninsula','CAPE YORK PEN.':'Cape York Peninsula','ALASKA PENINSULA':'Alaska Peninsula','Shandong Pen.':'Shandong Peninsula',
 'GREAT DIVIDING RANGE':'Great Dividing Range','CAUCASUS MTS.':'Caucasus Mountains','KARAKORAM RA.':'Karakoram Range','APPALACHIAN MTS.':'Appalachian Mountains',
 'CHAÎNE ANNAMITIQUE':'Annamite Range','ATLAS SAHARIEN':'Saharan Atlas','HAUT ATLAS':'High Atlas','TIBESTI MTS.':'Tibesti Mountains','AHAGGAR MTS.':'Ahaggar Mountains',
 'KJØLEN MOUNTAINS':'Scandinavian Mountains','APPENNINI':'Apennines','HEJAZ MTS.':'Hejaz Mountains','ASIR MTS.':'Asir Mountains','ELBURZ MTS.':'Elburz Mountains',
 'PYRENEES':'Pyrenees','ALPS':'Alps','ANDES':'Andes','HIMALAYAS':'Himalayas','TIAN SHAN':'Tian Shan','ETHIOPIAN HIGHLANDS':'Ethiopian Highlands',
 'GREAT RIFT VALLEY':'Great Rift Valley','RUB’ AL KHALI':'Rub’ al Khali','DESIERTO DE ATACAMA':'Atacama Desert','SAHARA':'Sahara','GOBI DESERT':'Gobi Desert',
 'QIZILQUM DESERT':'Kyzylkum Desert','GARAGUM DESERT':'Karakum Desert','TAKLIMAKAN DESERT':'Taklamakan Desert','LUT DESERT':'Dasht-e Lut',
 'WESTERN DESERT':'Western Desert (Egypt)','Ténéré':'Ténéré',
 'HONSHÜ':'Honshu','KYÜSHÜ':'Kyushu','HOKKAIDÖ':'Hokkaido','ISLAND OF NEWFOUNDLAND':'Newfoundland','ELLESMERE  ISLAND':'Ellesmere Island',
 'Sardegna':'Sardinia','Corse':'Corsica','Sicilia':'Sicily','SOUTH ISLAND':'South Island (New Zealand)','NORTH ISLAND':'North Island (New Zealand)',
 'GREAT BRITAIN':'Great Britain','TIERRA DEL FUEGO':'Tierra del Fuego','SOLOMON ISANDS':'Solomon Islands','JAPAN':'Japanese Islands','PHILIPPINES':'Philippine Islands',
 'WEST INDIES':'West Indies','HAWAIIAN ISLANDS':'Hawaiian Islands','NEW ZEALAND':'New Zealand','ARCTIC ARCHIPELAGO':'Canadian Arctic Archipelago',
 'AÇORES':'Azores','MALAY ARCHIPELAGO':'Malay Archipelago','GREATER SUNDA ISLANDS':'Greater Sunda Islands','LESSER SUNDA ISLANDS':'Lesser Sunda Islands',
 'ANATOLIA':'Anatolia','Mesopotamia':'Mesopotamia','PATAGONIA':'Patagonia','SIBERIA':'Siberia','ALASKA':'Alaska','LAPLAND':'Lapland','JUTLAND':'Jutland','SUDD':'Sudd',
 'PLATEAU OF TIBET':'Tibetan Plateau','WESTERN PLATEAU':'Western Plateau (Australia)','ALTIPLANO':'Altiplano','BRAZILIAN HIGHLANDS':'Brazilian Highlands',
 'CENTRAL SIBERIAN PLATEAU':'Central Siberian Plateau','MONGOLIAN PLATEAU':'Mongolian Plateau','DECCAN PLATEAU':'Deccan Plateau','COLORADO PLATEAU':'Colorado Plateau',
 'KAZAKH STEPPE':'Kazakh Steppe','NORTHERN EUROPEAN PLAIN':'North European Plain','GREAT PLAINS':'Great Plains','NORTH CHINA PLAIN':'North China Plain',
 'PAMPAS':'Pampas','SAHEL':'Sahel','GRAN CHACO':'Gran Chaco','LLANOS':'Llanos','GANGES PLAIN':'Ganges Plain','PONTIC STEPPE':'Pontic Steppe',
 'CONGO BASIN':'Congo Basin','AMAZON BASIN':'Amazon Basin','GREAT BASIN':'Great Basin','CANADIAN SHIELD':'Canadian Shield','CENTRAL AMERICA':'Central America',
 'ISTHMUS OF KRA':'Isthmus of Kra','Is. de Panamá':'Isthmus of Panama','GREAT LAKES':'Great Lakes',
}
def pretty(n):
    if n in OVR: return OVR[n]
    if n.isupper() or n.upper()==n:
        n=n.title()
    n=n.replace(' Mts.',' Mountains').replace(' Ra.',' Range').replace(' Pen.',' Peninsula').replace(' Plat.',' Plateau').replace(' I.',' Island')
    return n
SKIP_REG={'Antarctica','Seven seas (open ocean)'}
SKIPNAMES={'KNUD RASMUSSEN LAND','PLANALTO CENTRAL','PLANALTO DO MATO GROSSO','ALTI-PLANICIE MEXICANA','GUIANA SHIELD','YUNGUI PLATEAU','PUTORANA PLATEAU','Aldan Upland','CUMBERLAND PLAT.','ALLEGHENY PLATEAU','YUKON PLATEAU','FRASER PLATEAU','Khorat Plat.','SHAN PLATEAU','CENTRAL RUSSIAN UPLAND','KATANGA PLATEAU','CASPIAN DEPRESSION','Puerto Rico','MOLUCCAS','TURAN LOWLAND','COLUMBIA PLAT.','Hamada du Drâa','PUNJAB','CAATINGAS','BETPAQDALA DESERT','Idhän Murzuq','Hamada du Drâa','Tassili oua-n-Ahaggar','Tassili-n-Ajjer','Sarïr Kalanshiyu ar Ramli al Kabi',
 'Hawai‘i','KIRIBATI','LINE ISLANDS','CAROLINE ISLANDS','Isabela','Maui','Tahiti','Viti Levu','Espiritu Santo','Guadalcanal','Bougainville','Bol’shoy Begichev I.',
 'Komsomolets I.','Bol’shevik I.','October Revolution I.','Arctic Institute I.','Shmidta I.','S. Andaman','Middle Andaman','N. Andaman','Great Nicobar','Berkner Island','Alexander Island',
 'LABRADOR','Nova Scotia','ARNHEM LAND','Cà Mau Point','Península Valdés','Talos Dome','American Highland','Polar Plateau','Rockefeller Plateau','Hollick-Kenyon Plateau',
 'Dome C (Charlie)','Dome A (Argus)','Dome F (Fuji)','SELVAS','PIEDMONT','YUNGAS','COASTAL PLAIN','CENTRAL LOWLAND','NORTH SLOPE','CHACO BOREAL','CHACO AUSTRAL','Siwalik Hills','Central Highlands',
 'MARSHALL ISLANDS','RATAK CHAIN','RALIK CHAIN','Myeik Arch.','SOUTHERN COOK ISLANDS','NORTHERN COOK ISLANDS','Savai‘i','Raiatea','Hiva Oa','Nuku Hiva','Kiritimati','Santa Cruz','Malakula','Santa Isabel','San Cristobal','New Ireland',
 'Bismarck Archipelago','NAMPÖ-SHOTÖ','SEVERNAYA ZEMLYA','FRANZ JOSEF LAND','NEW SIBERIAN ISLANDS','PARRY ISLANDS','QUEEN ELIZABETH ISLANDS','Spratly Islands','NEW BRITAIN','ARCHIPEL DES TUAMOTU','ARCHIPEL DES COMORES','MASCARENE ISLANDS',
 'MELANESIA','MICRONESIA','POLYNESIA','LESSER ANTILLES','GREATER ANTILLES','BAHAMA ISLANDS','Coast'}
CATS=[]  # (name,cat,noun,geom, size)
seen=set()
def add(name,cat,noun,geom):
    if name in seen: return
    seen.add(name); CATS.append((name,cat,noun,geom))

NOUN={'Range/mtn':('mountains','mountain range'),'Desert':('deserts','desert'),'Island':('land','island'),'Island group':('land','island group'),
 'Pen/cape':('land','peninsula'),'Peninsula':('land','peninsula'),'Plateau':('land','plateau'),'Plain':('land','plain'),'Basin':('land','basin'),
 'Geoarea':('land','region'),'Isthmus':('land','isthmus'),'Delta':('land','river delta'),'Valley':('land','valley'),'Tundra':('land','tundra'),
 'Lowland':('land','lowland')}
MAXRANK={'Range/mtn':3,'Desert':3,'Island':2,'Island group':2,'Pen/cape':3,'Peninsula':1,'Plateau':3,'Plain':2,'Basin':2,'Geoarea':3,'Isthmus':1,'Delta':3,'Valley':3,'Tundra':1,'Lowland':3}
EXTRA_INCLUDE={'ARABIAN PENINSULA','ICELAND','HISPANIOLA','CUBA','JAMAICA','Cyprus','TAIWAN','HAINAN','SRI LANKA','JAVA','SULAWESI','LUZON','MINDANAO','SAKHALIN','NEW GUINEA','BORNEO','SUMATRA','TIMOR','Palawan',
 'GREAT RIFT VALLEY','Fergana Valley','Grand Canyon','Nile Delta','Ganges Delta','Mekong Delta','Danube Delta','Volga Delta','Mississippi Delta','Niger Delta','Mekong Delta','Cuba','Puerto Rico'}
DELTA_NAMES={'Mississippi Delta','Niger Delta','Volga Delta','Danube Delta','Amazon Delta','Mekong Delta','Nile Delta','Lena Delta','Ganges Delta','Indus Delta'}
for f in regs:
    p=f['properties']; cl=p['FEATURECLA']; n=p['NAME']
    if cl not in NOUN or p['REGION'] in SKIP_REG or n in SKIPNAMES: continue
    if cl=='Delta':
        if n not in DELTA_NAMES: continue
    elif p['SCALERANK']>MAXRANK[cl] and n not in EXTRA_INCLUDE: continue
    if cl=='Valley' and n not in ('GREAT RIFT VALLEY','Fergana Valley'): continue
    if cl=='Tundra' and n!='CANADIAN SHIELD': continue
    if cl=='Lowland' and n not in ('WESTERN SIBERIAN PLAIN','CASPIAN DEPRESSION'): continue
    cat,noun=NOUN[cl]
    add(pretty(n),cat,noun,f['geometry'])
# a few land names that are mis-classed as deserts/regions in the source
for bad in ['Punjab','Caatingas']:
    pass
MN={'ocean':'ocean','sea':'sea','gulf':'gulf','bay':'bay','strait':'strait','channel':'channel','sound':'sound'}
MSKIP={'Inner Seas','Inner Sea','Sargasso Sea','Ross Sea','Weddell Sea','Bellingshausen Sea','Amundsen Sea','Scotia Sea','Beaufort Sea','Amundsen Gulf','Viscount Melville Sound','Cook Inlet','Bristol Bay','Melville Bay','Ungava Bay','Shelikhova Gulf','The North Western Passages','Strait of Singapore','Ceram Sea','Molucca Sea','Bismarck Sea','Solomon Sea','Bo Hai','Gulf of Kutch','Gulf of Mannar','Golfo San Jorge','Gulf of Maine','Bay of Plenty','Bay of Fundy','Chesapeake Bay','Laccadive Sea','Balearic Sea','Timor Sea','Arafura Sea','Banda Sea','Sulu Sea','Celebes Sea','Java Sea','Straits of Florida','Korea Strait'}
MOVR={'Golfo de California':'Gulf of California','Golfe du Lion':'Gulf of Lion','Bahía de Campeche':'Bay of Campeche','Golfo de Panamá':'Gulf of Panama','SOUTHERN OCEAN':'Southern Ocean','INDIAN OCEAN':'Indian Ocean','Río de la Plata':'Río de la Plata','Gulf of Saint Lawrence':'Gulf of St. Lawrence','Straits of Florida':'Straits of Florida'}
for f in mar:
    p=f['properties']; cl=p['featurecla']; n=p['name']
    if cl not in MN or n in MSKIP: continue
    if cl in('sea','gulf','bay') and p['scalerank']>3 and n not in ('Aegean Sea','Baltic Sea','Gulf of Finland','Persian Gulf'): continue
    if cl=='strait' and n not in ('Strait of Gibraltar','Strait of Malacca','Luzon Strait','Davis Strait','Hudson Strait','Taiwan Strait','Makassar Strait'): continue
    if cl=='channel' and n not in ('English Channel','Mozambique Channel','Drake Passage'): continue
    add(MOVR.get(n,n),'waters',MN[cl],f['geometry'])
LAKES={'Lake Superior','Lake Victoria','Lake Baikal','Lake Tanganyika','Lake Malawi','Lake Michigan','Lake Huron','Lake Erie','Lake Ontario','Great Bear Lake','Great Slave Lake','Lake Titicaca','Lake Ladoga','Lake Winnipeg','Lake Chad','Lake Balkhash','Lake Onega','Aral Sea','Lake Nicaragua','Dead Sea','Lake Eyre','Lake Turkana'}
LK={'Lago Titicaca':'Lake Titicaca','Lake Nyasa':'Lake Malawi','Ozero Baykal':'Lake Baikal','Ozero Ladozhskoye':'Lake Ladoga','Ozero Balkhash':'Lake Balkhash','Lago de Nicaragua':'Lake Nicaragua','Lake Nyasa (Lake Malawi)':'Lake Malawi'}
lk_found=[]
for f in lak:
    n=f['properties']['name']; n2=LK.get(n,n)
    if n2 in LAKES and n2 not in seen:
        add(n2,'waters','lake',f['geometry']); lk_found.append(n2)
print('lakes found',lk_found)

# rivers: merge by curated groups
RIVERS={
 'Nile':['Nile','Bahr el Jebel','Albert Nile','Victoria Nile','El Bahr el Abyad','Damietta Branch','Rosetta Branch'],
 'Amazon':['Amazonas','Ucayali'],'Yangtze':['Yangtze','Chang Jiang','Jinsha','Tongtian','Tuotuo'],
 'Mississippi':['Mississippi'],'Missouri':['Missouri'],'Ohio':['Ohio'],'Congo':['Congo','Lualaba'],'Mekong':['Mekong','Lancang'],
 'Danube':['Danube','Donau'],'Ganges':['Ganges'],'Brahmaputra':['Brahmaputra','Dihang','Yarlung'],'Irrawaddy':['Ayeyarwady','Nmai'],
 'Indus':['Indus'],'Euphrates':['Euphrates','Al Furat','Firat'],'Tigris':['Tigris','Dicle'],'Niger':['Niger'],'Zambezi':['Zambezi'],
 'Volga':['Volga'],'Lena':['Lena'],'Ob':['Ob'],'Irtysh':['Irtysh','Ertis','Ertix'],'Amur':['Amur','Heilong Jiang','Argun’'],
 'Yellow River':['Huang'],'Mackenzie River':['Mackenzie'],'St. Lawrence River':['St. Lawrence'],'Columbia River':['Columbia'],
 'Rio Grande':['Rio Grande'],'Orinoco':['Orinoco'],'Paraná':['Paraná'],'São Francisco':['São  Francisco'],'Murray':['Murray'],
 'Orange':['Orange'],'Rhine':['Rhine','Rhein','Rhin','Waal','Nederrijn','Lek'],'Seine':['Seine'],'Dnieper':['Dnipro','Dnepre'],
 'Ural':['Ural'],'Pechora':['Pechora'],'Kolyma':['Kolyma'],'Salween':['Salween'],'Yukon':['Yukon'],'Arkansas':['Arkansas'],
 'Snake River':['Snake'],'Senegal':['Sénégal'],'Angara':['Angara'],'Aldan':['Aldan'],'Magdalena':['Magdalena'],'Madeira':['Madeira'],
 'Colorado River':['Colorado'],'Elbe':['Elbe'],'Don':['Don'],'Limpopo':['Limpopo'],'Tocantins':['Tocantins'],'Saskatchewan':['Saskatchewan','North Saskatchewan'],
}
byname=collections.defaultdict(list)
for f in riv:
    p=f['properties']
    if p['featurecla']=='River' and p['name']: byname[p['name']].append(f['geometry'])
rv_found=[]; rv_miss=[]
for disp,srcs in RIVERS.items():
    lines=[]
    for s in srcs:
        for g in byname.get(s,[]):
            if g['type']=='MultiLineString': lines+=g['coordinates']
            elif g['type']=='LineString': lines.append(g['coordinates'])
    if lines:
        # Colorado: avoid the Rio Colorado (Argentina) duplicates - keep as is
        add(disp,'rivers','river',{'type':'MultiLineString','coordinates':lines}); rv_found.append(disp)
    else: rv_miss.append(disp)
print('rivers',len(rv_found),'missing',rv_miss)
cnt=collections.Counter(c[1] for c in CATS); print(cnt, len(CATS))
polys=[{'type':'Feature','properties':{'name':n,'cat':c,'noun':nn},'geometry':g} for (n,c,nn,g) in CATS if c!='rivers']
lines=[{'type':'Feature','properties':{'name':n,'cat':c,'noun':nn},'geometry':g} for (n,c,nn,g) in CATS if c=='rivers']
# draw big polygons first so small ones sit on top
def bbarea(g):
    xs=[];ys=[]
    def walk(a):
        if isinstance(a[0],(int,float)): xs.append(a[0]); ys.append(a[1])
        else:
            for b in a: walk(b)
    walk(g['coordinates']); return (max(xs)-min(xs))*(max(ys)-min(ys))
polys.sort(key=lambda f:-bbarea(f['geometry']))
json.dump({'type':'FeatureCollection','features':polys},open('work_areas.geojson','w',encoding='utf-8'),ensure_ascii=False)
json.dump({'type':'FeatureCollection','features':lines},open('work_rivers.geojson','w',encoding='utf-8'),ensure_ascii=False)
print([p['properties']['name'] for p in polys if p['properties']['cat']=='land'][:200])
