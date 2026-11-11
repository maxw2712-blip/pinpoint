# -*- coding: utf-8 -*-
import json
def w(l):  # 0..360 east -> -180..180
    l=l%360
    return l-360 if l>180 else l
# [name, noun, lat, lonE, radius_km, optional spine [[lonE,lat],...]]
MARS=[
 ["Olympus Mons","volcano",18.65,226.2,300],["Arsia Mons","volcano",-8.35,239.9,220],["Pavonis Mons","volcano",0.8,246.7,190],
 ["Ascraeus Mons","volcano",11.8,255.5,230],["Elysium Mons","volcano",25.0,147.2,200],["Alba Mons","volcano",40.5,250.4,550],
 ["Apollinaris Mons","volcano",-9.3,174.4,150],["Hecates Tholus","volcano",32.1,150.2,90],
 ["Hellas Planitia","impact basin",-42.4,70.5,1150],["Argyre Planitia","impact basin",-49.7,316.0,900],["Isidis Planitia","impact basin",12.9,87.0,750],
 ["Utopia Planitia","plain",46.7,117.5,1400],["Acidalia Planitia","plain",49.8,339.0,1300],["Chryse Planitia","plain",28.4,320.0,800],
 ["Amazonis Planitia","plain",24.8,196.0,900],["Arcadia Planitia","plain",47.2,184.7,800],["Elysium Planitia","plain",3.0,154.7,800],
 ["Hesperia Planum","plain",-21.4,110.0,800],["Syrtis Major Planum","volcanic plain",8.4,69.5,700],
 ["Valles Marineris","canyon",-12.0,300.8,300,[[262,-7],[275,-10],[290,-12.5],[305,-13.5],[318,-12]]],
 ["Gale Crater","crater",-5.4,137.8,77],["Jezero Crater","crater",18.4,77.6,22],["Schiaparelli Crater","crater",-3.0,343.3,230],
 ["Gusev Crater","crater",-14.5,175.4,80],["Huygens Crater","crater",-13.8,55.6,235],["Lyot Crater","crater",50.5,29.3,110],
 ["Holden Crater","crater",-26.5,325.2,70],["Meridiani Planum","plain",-2.0,354.5,450],["Arabia Terra","highland",21.0,6.0,1400],
 ["Tempe Terra","highland",39.6,289.2,700],["Lunae Planum","plain",10.0,292.0,550],["Solis Planum","plain",-25.0,270.0,650],
 ["Terra Cimmeria","highland",-34.0,145.0,1200],
]
MOON=[
 ["Oceanus Procellarum","mare",18.4,-57.4,1250],["Mare Imbrium","mare",32.8,-15.6,560],["Mare Serenitatis","mare",28.0,17.5,350],
 ["Mare Tranquillitatis","mare",8.5,31.4,435],["Mare Crisium","mare",17.0,59.1,275],["Mare Fecunditatis","mare",-7.8,51.3,420],
 ["Mare Nectaris","mare",-15.2,35.5,165],["Mare Nubium","mare",-21.3,-16.6,350],["Mare Humorum","mare",-24.4,-38.6,210],
 ["Mare Cognitum","mare",-10.0,-23.1,190],["Mare Vaporum","mare",13.3,3.6,120],
 ["Mare Frigoris","mare",56.0,1.4,130,[[-45,56],[1.4,56],[45,57]]],
 ["Orientale Basin","impact basin",-19.4,-92.8,465],["Mare Australe","mare",-38.9,93.0,300],["Mare Smythii","mare",1.3,87.5,185],
 ["Mare Moscoviense","mare",27.3,147.9,140],["Mare Marginis","mare",13.3,86.1,210],["Mare Ingenii","mare",-33.7,163.5,170],
 ["Sinus Iridum","bay",44.1,-31.7,125],["South Pole\u2013Aitken Basin","impact basin",-53.0,-169.0,1250],
 ["Tycho","crater",-43.3,-11.4,42],["Copernicus","crater",9.6,-20.1,46],["Kepler","crater",8.1,-38.0,16],["Aristarchus","crater",23.7,-47.4,20],
 ["Plato","crater",51.6,-9.3,50],["Clavius","crater",-58.8,-14.4,112],["Grimaldi","crater",-5.2,-68.3,86],["Tsiolkovskiy","crater",-20.4,129.1,90],
 ["Hertzsprung Basin","impact basin",2.6,-129.2,270],["Apollo Basin","impact basin",-36.1,-151.8,246],["Schr\u00f6dinger Basin","impact basin",-75.0,132.4,160],
 ["Korolev","crater",-4.0,-157.4,218],["Ptolemaeus","crater",-9.2,-1.9,77],["Alphonsus","crater",-13.4,-3.2,59],["Theophilus","crater",-11.4,26.4,52],
 ["Langrenus","crater",-8.9,61.1,66],["Petavius","crater",-25.3,60.4,90],["Bailly","crater",-66.5,-69.1,150],["Humboldt","crater",-27.0,81.0,95],
 ["Sinus Medii","bay",0.4,-1.7,150],["Montes Apenninus","mountains",19.0,-3.7,60,[[-11.3,14.5],[-6,18],[-1,21.5],[3.6,26]]],
]
VENUS=[
 ["Maxwell Montes","mountains",65.2,3.3,380],["Lakshmi Planum","plateau",68.6,339.3,900],
 ["Aphrodite Terra","highland",-8.0,135.0,700,[[65,-7],[100,-9],[135,-10],[170,-8],[205,-5]]],
 ["Ovda Regio","highland",-2.7,83.4,1000],["Thetis Regio","highland",-11.0,129.0,600],["Atla Regio","highland",9.0,199.0,1000],
 ["Beta Regio","highland",25.0,282.0,1000],["Alpha Regio","highland",-25.0,5.0,650],["Sif Mons","volcano",22.0,352.0,150],
 ["Gula Mons","volcano",22.0,359.7,150],["Maat Mons","volcano",0.5,194.5,200],["Sapas Mons","volcano",8.5,188.3,200],
 ["Theia Mons","volcano",22.0,280.0,300],["Rhea Mons","volcano",32.5,283.0,350],["Tellus Regio","highland",40.0,78.0,1200],
 ["Bell Regio","highland",33.0,51.0,700],["Sedna Planitia","plain",42.0,340.0,1500],["Guinevere Planitia","plain",25.0,325.0,1600],
 ["Atalanta Planitia","plain",65.0,165.0,1300],["Lavinia Planitia","plain",-47.0,347.0,1300],["Artemis Corona","corona",-35.0,135.0,1000],
 ["Lada Terra","highland",-65.0,20.0,1400],["Phoebe Regio","highland",-6.0,282.0,900],["Dione Regio","highland",-32.0,328.0,650],
 ["Themis Regio","highland",-37.0,285.0,700],["Cleopatra","crater",65.8,7.0,52],["Mead","crater",12.5,57.2,135],
 ["Isabella","crater",-30.2,204.2,87],["Idunn Mons","volcano",-46.4,214.5,100],
]
def conv(rows):
    out=[]
    for r in rows:
        name,noun,lat,lon,rad=r[:5]
        e=[name,noun,lat,round(w(lon),2),rad]
        if len(r)>5: e.append([[round(w(a),2),b] for a,b in r[5]])
        out.append(e)
    return out
data={'mars':conv(MARS),'moon':conv(MOON),'venus':conv(VENUS)}
json.dump(data,open('planet_feats.json','w'),ensure_ascii=False)
print({k:len(v) for k,v in data.items()})
