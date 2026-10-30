#!/usr/bin/env python3
"""Aktualizacja ludności powiatów z oficjalnego API GUS BDL. Bez zależności zewnętrznych.
Nie publikuje pustego/niepełnego pliku jako kompletnego zestawu.
"""
import json, pathlib, urllib.request, urllib.parse, time, sys, datetime, unicodedata, os
ROOT=pathlib.Path(__file__).resolve().parents[1]
URL='https://bdl.stat.gov.pl/api/v1'
VARIABLE=72305 # Kandydat: ludność ogółem; metadane weryfikujemy przed zapisaniem
COUNTIES=['bielski','Bielsko-Biała','bieruńsko-lędziński','będziński','Bytom','Chorzów','cieszyński','Częstochowa','częstochowski','Dąbrowa Górnicza','Gliwice','gliwicki','Jastrzębie-Zdrój','Jaworzno','Katowice','kłobucki','lubliniecki','mikołowski','Mysłowice','myszkowski','Piekary Śląskie','pszczyński','raciborski','Ruda Śląska','Rybnik','rybnicki','Siemianowice Śląskie','Sosnowiec','Świętochłowice','tarnogórski','Tychy','wodzisławski','Zabrze','zawierciański','Żory','żywiecki']
def norm(s):
 s=unicodedata.normalize('NFKD',s.casefold()).replace('ł','l')
 return ''.join(c for c in s if c.isalnum())
def get(endpoint, params=None):
 q=urllib.parse.urlencode(params or {},doseq=True)
 req=urllib.request.Request(URL+endpoint+('?' + q if q else ''),headers={'User-Agent':'Obserwatorium-WUP/1.0','Accept':'application/json'})
 with urllib.request.urlopen(req,timeout=50) as response:return json.load(response)
def fetch():
 meta=get(f'/variables/{VARIABLE}',{'lang':'pl','format':'json'})
 desc=json.dumps(meta,ensure_ascii=False).casefold()
 if 'ludno' not in desc or not any(t in desc for t in ['ogółem','ogolem','total']):
  raise ValueError(f'Zmienna {VARIABLE} nie jest jednoznacznie ludnością ogółem; metadane: {desc[:400]}')
 results=[]
 page=0
 while True:
  page+=1
  data=get(f'/data/by-variable/{VARIABLE}',{'format':'json','unit-level':5,'unit-parent-id':'012400000000','page-size':100,'page':page})
  results.extend(data.get('results',[]))
  if page>=data.get('totalPages',1):break
  if page>10:raise ValueError('Nieoczekiwana liczba stron z BDL')
  time.sleep(.25)
 out={}
 for row in results:
  name=row.get('name') or row.get('unitName') or ''
  def canon(raw):
   key=norm(raw)
   exact=[c for c in COUNTIES if norm(c)==key]
   if len(exact)==1:return exact[0]
   if key.startswith('powiat'):
    stripped=key[6:]
    exact=[c for c in COUNTIES if norm(c)==stripped]
    if len(exact)==1:return exact[0]
   if key.startswith('miasto'):
    exact=[c for c in COUNTIES if norm(c)==key[6:]]
    if len(exact)==1:return exact[0]
   return None
  county=canon(name)
  if not county:continue
  series={}
  for val in row.get('values',[]):
   try: year=int(val.get('year')); value=val.get('val')
   except (ValueError,TypeError):continue
   if 2014<=year<=2026 and value is not None and isinstance(value,(int,float)) and value>0:
    series[str(year)]=int(round(value))
  if series:out[county]=series
 if len(out)<30:raise ValueError(f'BDL zwrócił tylko {len(out)}/36 rozpoznanych jednostek. Nie nadpisano danych; sprawdź ID zmiennej i kod województwa. Przykładowe nazwy: {[r.get("name") for r in results[:7]]}')
 return {'source':'GUS BDL API','variable_id':VARIABLE,'variable_metadata':meta,'retrieved_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'ludność ogółem, rocznie; weryfikacja nazw i agregacji wymagana przy zmianie metodologii','coverage_counties':len(out),'series':out}
if __name__=='__main__':
 try:
  data=fetch()
  target=ROOT/'data'/'gus_bdl_demografia.json'
  target.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
  print('Zapisano',target,'jednostek:',data['coverage_counties'])
 except Exception as exc:
  print('Nie pobrano danych GUS:',exc,file=sys.stderr)
  sys.exit(1)
