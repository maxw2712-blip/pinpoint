# -*- coding: utf-8 -*-
import json
RAW=json.loads(open('raw_table.js',encoding='utf-8').read()); KEYS={r[0] for r in RAW}
NATO=["Albania","Belgium","Bulgaria","Canada","Croatia","Czechia","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Iceland","Italy","Latvia","Lithuania","Luxembourg","Macedonia","Montenegro","Netherlands","Norway","Poland","Portugal","Romania","Slovakia","Slovenia","Spain","Sweden","Turkey","United Kingdom","United States of America"]
EU=["Austria","Belgium","Bulgaria","Croatia","Cyprus","Czechia","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy","Latvia","Lithuania","Luxembourg","Netherlands","Poland","Portugal","Romania","Slovakia","Slovenia","Spain","Sweden"]
P5=["United States of America","Russia","China","United Kingdom","France"]
G7=["United States of America","Canada","United Kingdom","France","Germany","Italy","Japan"]
FIVE=["United States of America","United Kingdom","Canada","Australia","New Zealand"]
Q=[]
def c(t,q,a,f): Q.append({'t':t,'q':q,'a':a if isinstance(a,list) else [a],'f':f,'k':'c'})
def p(t,q,name,f): Q.append({'t':t,'q':q,'a':[name],'f':f,'k':'p'})
US="United States of America"
# ---- Tier 1 ----
c(1,"Click any member of NATO.",NATO,"NATO was founded in 1949. Finland joined in 2023 and Sweden in 2024, bringing it to 32 members.")
c(1,"Click any of the five permanent members of the UN Security Council.",P5,"The five are the United States, United Kingdom, France, Russia and China, and each holds a veto.")
c(1,"Click any of the five nuclear-weapon states recognized by the Non-Proliferation Treaty.",P5,"They are the same five countries that hold permanent Security Council seats.")
c(1,"Click the country that hosts the United Nations headquarters.",US,"The UN headquarters in New York City opened in 1952.")
c(1,"Click the only country that has used nuclear weapons in war.",US,"The United States bombed Hiroshima and Nagasaki in August 1945.")
c(1,"Click the country that hosts NATO's headquarters.","Belgium","NATO's headquarters are in Brussels.")
c(1,"Click the country that Russia invaded in February 2022.","Ukraine","The full-scale invasion began on February 24, 2022.")
c(1,"Click either of the two countries formed from the divided Korean Peninsula.",["South Korea","North Korea"],"The peninsula was divided at the 38th parallel in 1945, and the Korean War (1950-53) ended in an armistice, not a peace treaty.")
c(1,"Click the country that left the European Union in 2020.","United Kingdom","The UK left on January 31, 2020, after a 2016 referendum.")
c(1,"Click any member of the G7.",G7,"The G7 countries are the U.S., U.K., France, Germany, Italy, Japan and Canada, and the EU also takes part.")
c(1,"Click the country where the Taliban returned to power in 2021.","Afghanistan","They took Kabul in August 2021 as U.S. forces withdrew.")
c(1,"Click the island nation at the center of the 1962 missile crisis.","Cuba","Soviet missiles in Cuba triggered a 13-day standoff between the U.S. and the USSR.")
c(1,"Click the country with the world's largest military budget.",US,"U.S. defense spending exceeds that of the next several countries combined.")
c(1,"Click the world's most populous country, as of 2023.","India","India passed China in 2023, according to the United Nations.")
p(1,"Find the Suez Canal, which links the Mediterranean and the Red Sea.","Suez Canal","Roughly 12 percent of global trade passes through it.")
p(1,"Find the Panama Canal, which links the Atlantic and Pacific oceans.","Panama Canal","It opened in 1914, and the U.S. handed control to Panama at the end of 1999.")
p(1,"Find the Strait of Gibraltar, the gateway into the Mediterranean.","Strait of Gibraltar","It is only about 14 km wide at its narrowest point.")
# ---- Tier 2 ----
c(2,"Click any member of the European Union.",EU,"The EU has 27 members. Malta is a member too, but it's too small to appear on this map.")
c(2,"Click any member of the Five Eyes intelligence alliance.",FIVE,"The alliance traces back to the 1946 UKUSA Agreement.")
c(2,"Click any of the three countries outside the five recognized nuclear powers that have tested nuclear weapons.",["India","Pakistan","North Korea"],"India tested in 1974 and 1998, Pakistan in 1998 and North Korea starting in 2006.")
c(2,"Click the country that joined NATO in 2023.","Finland","It ended decades of military non-alignment after Russia's 2022 invasion of Ukraine.")
c(2,"Click the newest NATO member, which joined in March 2024.","Sweden","Sweden's accession followed Finland's, after Turkey and Hungary ratified.")
c(2,"Click the country that hosts the International Court of Justice and the International Criminal Court.","Netherlands","Both are in The Hague.")
c(2,"Click the country that hosts the International Atomic Energy Agency.","Austria","The IAEA is headquartered in Vienna.")
c(2,"Click the country that Iraq invaded in 1990.","Kuwait","A U.S.-led coalition liberated Kuwait in early 1991.")
c(2,"Click the country whose 1979 revolution created an Islamic republic.","Iran","The Shah fled in January 1979 and Ayatollah Khomeini returned from exile.")
c(2,"Click the Mediterranean island divided since 1974.","Cyprus","A UN buffer zone, the Green Line, separates the Greek-Cypriot south from the Turkish-controlled north.")
c(2,"Click the country that fought a 1982 war with Britain over the Falkland Islands.","Argentina","The war lasted 74 days and ended in Argentine defeat.")
c(2,"Click the country created in 1947 as a Muslim-majority state when British India was partitioned.","Pakistan","Bangladesh split from Pakistan in 1971.")
c(2,"Click the Central African country where a 1994 genocide killed an estimated 800,000 people.","Rwanda","It lasted about 100 days.")
c(2,"Click the country that claimed to annex Crimea in 2014, a move most countries reject.","Russia","The UN General Assembly voted to affirm Ukraine's territorial integrity.")
c(2,"Click the NATO member that controls the Bosporus and Dardanelles straits.","Turkey","The 1936 Montreux Convention gives Turkey control over warship passage.")
p(2,"Find the Strait of Hormuz, through which a large share of the world's oil exports pass.","Strait of Hormuz","It is only about 33 km wide at its narrowest.")
p(2,"Find the Bosporus, the strait that splits Istanbul and links the Black Sea to the Sea of Marmara.","Bosporus","Turkey controls it under the 1936 Montreux Convention.")
p(2,"Find the Strait of Malacca, which links the Indian and Pacific oceans.","Strait of Malacca","Roughly a quarter of world trade sails through it.")
p(2,"Find the English Channel, one of the world's busiest shipping lanes.","English Channel","It separates England from France and is about 33 km wide at the Strait of Dover.")
# ---- Tier 3 ----
c(3,"Click the host of Camp Lemonnier, the only permanent U.S. military base in Africa.","Djibouti","It sits at the mouth of the Red Sea near Bab-el-Mandeb.")
c(3,"Click the NATO member that borders Iran, Iraq and Syria.","Turkey","Turkey also borders Georgia, Armenia, Azerbaijan, Greece and Bulgaria.")
c(3,"Click the NATO member that borders Russia's Kaliningrad exclave to the south.","Poland","Lithuania borders it to the north and east.")
c(3,"Click the country that left NATO's integrated military command in 1966 and rejoined in 2009.","France","President de Gaulle took France out but kept it in the alliance itself.")
c(3,"Click the newest member of the European Union, which joined in 2013.","Croatia","Croatia also joined the euro and the Schengen area in 2023.")
c(3,"Click either country divided by the Kashmir Line of Control.",["India","Pakistan"],"Both claim all of Kashmir, and China holds part of the region too.")
c(3,"Click the country that hosts Europe's largest nuclear power plant, at Zaporizhzhia.","Ukraine","Russian forces seized the plant in March 2022.")
c(3,"Click any of the three former Soviet republics that gave up inherited nuclear weapons in the 1990s.",["Ukraine","Belarus","Kazakhstan"],"They transferred their Soviet-era warheads to Russia.")
c(3,"Click the country whose war ended with the 1995 Dayton Accords.","Bosnia and Herz.","The accords were negotiated at Wright-Patterson Air Force Base in Dayton, Ohio.")
c(3,"Click the country where the 1986 Chernobyl nuclear disaster occurred.","Ukraine","It was then part of the Soviet Union.")
c(3,"Click the country that hosts Ramstein Air Base, a hub of U.S. military power in Europe.","Germany","Ramstein is home to U.S. Air Forces in Europe and Air Forces Africa.")
c(3,"Click the country that leases the Baikonur Cosmodrome to Russia.","Kazakhstan","Baikonur launched Sputnik and Yuri Gagarin's Vostok 1.")
c(3,"Click the world's largest producer of uranium.","Kazakhstan","It produces more than a third of the world's mined uranium.")
p(3,"Find Bab-el-Mandeb, the strait linking the Red Sea to the Gulf of Aden.","Bab-el-Mandeb","Attacks on ships since late 2023 have pushed many vessels to sail around Africa.")
p(3,"Find the Taiwan Strait.","Taiwan Strait","It is about 180 km wide at its narrowest.")
p(3,"Find the Danish Straits, which guard the entrance to the Baltic Sea.","Danish Straits","Denmark controls them, and ships pass through the Oresund and the Great Belt.")
p(3,"Find the Cape of Good Hope, the route around Africa.","Cape of Good Hope","Ships use it when the Suez Canal or Red Sea is closed or unsafe.")
p(3,"Find the Korea Strait, between South Korea and Japan.","Korea Strait","The Tsushima Islands divide it into two channels.")
# ---- Tier 4 ----
c(4,"Click the country that formally left the Warsaw Pact in 1968.","Albania","It had broken with the Soviet Union in 1961 and sided with China.")
c(4,"Click the only country to have voluntarily dismantled its home-built nuclear weapons.","South Africa","It destroyed six devices and joined the NPT in 1991.")
c(4,"Click the country whose 1956 uprising was crushed by Soviet tanks.","Hungary","Thousands died and about 200,000 people fled.")
c(4,"Click either country that was once Czechoslovakia, where the 1968 Prague Spring was crushed.",["Czechia","Slovakia"],"The two split peacefully in 1993.")
c(4,"Click the Nordic country that hosted the 1975 conference that produced the Helsinki Final Act.","Finland","Finland's neutrality made it a natural host.")
c(4,"Click the country that hosts the Organisation for the Prohibition of Chemical Weapons.","Netherlands","The OPCW sits in The Hague and won the 2013 Nobel Peace Prize.")
c(4,"Click the country whose Arctic territory hosts Thule Air Base, the northernmost U.S. military base.",["Denmark","Greenland"],"The base, now called Pituffik Space Base, is in Greenland, a self-governing part of the Kingdom of Denmark.")
c(4,"Click the country that hosts the Aviano and Sigonella air bases.","Italy","Both are important to U.S. and NATO air operations in the Mediterranean.")
c(4,"Click the country divided along the 17th parallel in 1954.","Vietnam","The Geneva Accords split it into North and South.")
c(4,"Click the country that hosts Pine Gap, a joint U.S.-Australian satellite ground station.","Australia","Pine Gap is near Alice Springs in the Northern Territory.")
c(4,"Click the Nordic country that hosted the 1986 Reagan-Gorbachev summit.","Iceland","They met in Reykjavik and nearly agreed to abolish nuclear weapons.")
c(4,"Click the country that governs Svalbard under a 1920 treaty.","Norway","The treaty lets signatory countries mine and do business there, but forbids military bases.")
c(4,"Click the country that hosted the 1943 Tehran Conference of Churchill, Roosevelt and Stalin.","Iran","It was the first meeting of the three together.")
c(4,"Click the country that hosted the 1945 Potsdam Conference.","Germany","Truman, Stalin and Churchill (later Attlee) met near Berlin.")
p(4,"Find the Lombok Strait, a deep-water alternative to the Strait of Malacca.","Lombok Strait","Large tankers can pass through it, and it runs between Bali and Lombok.")
p(4,"Find the Kerch Strait, between the Black Sea and the Sea of Azov.","Kerch Strait","A bridge across it, built after Russia's 2014 annexation of Crimea, is a contested symbol.")
CH={ # name: [lat, lon, radius km, region]
 "Suez Canal":[30.6,32.35,180,"Africa"],"Panama Canal":[9.1,-79.7,200,"Americas"],"Strait of Gibraltar":[35.97,-5.6,150,"Europe"],
 "Strait of Hormuz":[26.55,56.4,220,"Asia"],"Bosporus":[41.1,29.05,120,"Europe"],"Strait of Malacca":[2.6,101.4,350,"Asia"],
 "English Channel":[50.2,0.5,250,"Europe"],"Bab-el-Mandeb":[12.65,43.35,170,"Asia"],"Taiwan Strait":[24.4,119.3,250,"Asia"],
 "Danish Straits":[55.7,12.7,150,"Europe"],"Cape of Good Hope":[-34.35,18.5,250,"Africa"],"Korea Strait":[34.4,129.3,200,"Asia"],
 "Lombok Strait":[-8.75,115.75,150,"Asia"],"Kerch Strait":[45.3,36.6,120,"Europe"]}
bad=[(q['q'],a) for q in Q if q['k']=='c' for a in q['a'] if a not in KEYS and a!='Greenland']
badp=[q['q'] for q in Q if q['k']=='p' and q['a'][0] not in CH]
from collections import Counter
print(Counter(q['t'] for q in Q),len(Q),'bad country keys:',bad,'bad choke names:',badp)
json.dump({'Q':Q,'CH':CH},open('sec.json','w',encoding='utf-8'),ensure_ascii=True)
