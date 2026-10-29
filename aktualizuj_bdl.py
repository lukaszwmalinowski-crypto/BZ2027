#!/usr/bin/env python3
"""Aktualizacja miesięcznego bezrobocia powiatowego GUS/BDL (2016–2026).
Bez bibliotek zewnętrznych. Zachowuje poprzedni poprawny zbiór, jeżeli API nie odpowiada.
Uruchamianie: python aktualizuj_bdl.py [--rate-only].
"""
from __future__ import annotations
import argparse, csv, datetime as dt, json, pathlib, re, sys, time, unicodedata
from urllib.request import Request, urlopen
from urllib.parse import urlencode
from urllib.error import HTTPError, URLError

BASE='https://bdl.stat.gov.pl/api/v1'
HERE=pathlib.Path(__file__).resolve().parent
OUT=HERE/'data'/'dane.json'
HTML=HERE/'index.html'
RATE_SUBJECT='P3559'
COUNT_SUBJECT='P2961'
PROVINCE='012400000000'
MONTHS=['styczeń','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpień','wrzesień','październik','listopad','grudzień']
EXPECTED=['będziński','bielski','cieszyński','częstochowski','gliwicki','kłobucki','lubliniecki','mikołowski','myszkowski','pszczyński','raciborski','rybnicki','tarnogórski','bieruńsko-lędziński','wodzisławski','zawierciański','żywiecki','Bielsko-Biała','Bytom','Chorzów','Częstochowa','Dąbrowa Górnicza','Gliwice','Jastrzębie-Zdrój','Jaworzno','Katowice','Mysłowice','Piekary Śląskie','Ruda Śląska','Rybnik','Siemianowice Śląskie','Sosnowiec','Świętochłowice','Tychy','Zabrze','Żory']

def norm(t):
    t=str(t).strip().casefold().replace('ł','l').replace('–','-').replace('—','-')
    t=re.sub(r'^powiat\s+(?:m\.\s*|miasto\s+|miejskie?\s+|grodzki\s+)?','',t)
    t=re.sub(r'^m\.\s*','',t)
    return ''.join(c for c in unicodedata.normalize('NFKD',t) if not unicodedata.combining(c)).replace(' ','').replace('-','')
LOOKUP={norm(name):name for name in EXPECTED}

def request(endpoint, params=None, retries=4):
    url=BASE+endpoint+('?' + urlencode(params, doseq=True) if params else '')
    for attempt in range(retries):
        try:
            req=Request(url,headers={'Accept':'application/json','User-Agent':'WUP-Katowice-Obserwatorium/1.0 (dane publiczne GUS BDL)'})
            with urlopen(req,timeout=55) as response:
                data=json.load(response)
            time.sleep(.28) # w ramach limitu 5 żądań/sekundę
            return data
        except (HTTPError,URLError,TimeoutError,OSError,ValueError) as e:
            if isinstance(e,HTTPError) and e.code in (400,401,403,404):
                raise RuntimeError(f'BDL: HTTP {e.code} — {url}') from e
            if attempt==retries-1:raise RuntimeError(f'BDL nie odpowiada: {url}: {e}') from e
            time.sleep(min(3*(attempt+1),12))

def pages(endpoint,params=None):
    params={**(params or {}),'page-size':100}
    first=request(endpoint,params)
    results=first.get('results')
    if results is None: raise ValueError(f'BDL zwrócił inny format dla {endpoint}: {list(first)}')
    all_results=list(results)
    pages_count=first.get('totalPages',1)
    for pg in range(1,int(pages_count)):
        nxt=request(endpoint,{**params,'page':pg})
        all_results.extend(nxt.get('results',[]))
    return all_results

def month_ids(subject,metric):
    variables=pages('/variables',{'subject-id':subject,'lang':'pl'})
    grouped={}
    for v in variables:
        n1=norm(v.get('n1',''))
        if n1 not in {norm(m) for m in MONTHS}:continue
        n2=norm(v.get('n2',''))
        if metric=='rate':
            # stopy napływu to inne zjawisko; nie należy ich importować jako stopę bezrobocia
            if 'stopabezrobociarejestrowanego' not in n2 or 'naplywu' in n2:continue
        else:
            # jedynie bezrobotni ogółem, bez podziału na płeć
            if n2 not in ('ogolem','bezrobotnizarejestrowaniogolem','bezrobotniogolem'):
                continue
        month=next((i for i,m in enumerate(MONTHS,1) if norm(m)==n1),None)
        if month:grouped.setdefault(month,[]).append(v)
    if len(grouped)!=12 or any(len(x)!=1 for x in grouped.values()):
        examples=[f"{x.get('id')} {x.get('n1')} / {x.get('n2')}" for x in variables[:30]]
        raise ValueError(f'Nie można jednoznacznie ustalić 12 zmiennych BDL {metric} w {subject}: {len(grouped)} miesięcy. Próbka: {examples}')
    return {m:grouped[m][0]['id'] for m in range(1,13)}

def units():
    rows=pages('/units',{'parent-id':PROVINCE,'level':5,'lang':'pl'})
    matches={};unknown=[]
    for r in rows:
        name=LOOKUP.get(norm(r.get('name','')))
        if name:
            if name in matches: raise ValueError(f'Duplikat jednostki {name}')
            matches[name]=str(r.get('id'))
        else:unknown.append(r.get('name'))
    if set(matches)!=set(EXPECTED):
        raise ValueError(f'BDL: znaleziono {len(matches)}/36 powiatów. Brak: {sorted(set(EXPECTED)-set(matches))}. Nieznane: {unknown[:20]}')
    return matches

def read_data(variable_id,years,unit_ids):
    rows=pages('/data/by-variable/'+str(variable_id),{'unit-parent-id':PROVINCE,'unit-level':5,'year':years,'lang':'pl'})
    seen={}
    for row in rows:
        uid=str(row.get('id'))
        if uid not in unit_ids:continue
        if uid in seen:raise ValueError('Powtórzony identyfikator BDL w danych: '+uid)
        seen[uid]=row.get('values') or []
    return seen

def build(rate_only=False):
    mapping=units();unit_to_name={v:k for k,v in mapping.items()}
    print('Jednostki:',len(mapping))
    rates=month_ids(RATE_SUBJECT,'rate')
    print('Identyfikatory 12 miesięcy stopy:',rates)
    if rate_only:
        counts={}
    else:
        try:counts=month_ids(COUNT_SUBJECT,'count')
        except ValueError as e:
            # Nie akceptuj przypadkowych zmiennych (np. według płci)
            print('UWAGA: liczby bezrobotnych nie zostały pobrane:',e,file=sys.stderr)
            counts={}
    years=list(range(2016,2027))
    observations={}
    problems=[]
    for kind,series in [('rate',rates),('count',counts)]:
      for month,vid in series.items():
        period_suffix=f'-{month:02d}'
        by_unit=read_data(vid,years,set(unit_to_name))
        print(kind,MONTHS[month-1],len(by_unit),'powiatów')
        for uid,vals in by_unit.items():
          name=unit_to_name[uid]
          for row in vals:
            try:
              year=int(row.get('year'));value=row.get('val')
              if year not in years or value is None:continue
              value=float(value)
              if kind=='rate' and not (0<=value<=100):continue
              if kind=='count' and (value<0 or not value.is_integer()):continue
              key=(name,f'{year}{period_suffix}')
              record=observations.setdefault(key,{'powiat':name,'okres':key[1],'stopa_proc':None,'liczba_osob':None,'zrodlo':'GUS / BDL API'})
              record['stopa_proc' if kind=='rate' else 'liczba_osob']=round(value,2) if kind=='rate' else int(value)
            except (ValueError,TypeError) as exc:problems.append((uid,kind,row,str(exc)))
    entries=sorted(observations.values(),key=lambda r:(r['powiat'],r['okres']))
    rate_count=sum(r['stopa_proc'] is not None for r in entries)
    coverage={name:sum(r['powiat']==name and r['stopa_proc'] is not None for r in entries) for name in EXPECTED}
    if min(coverage.values(),default=0)<90 or rate_count<3600:
       raise ValueError(f'Niepełny eksport BDL: {rate_count} stóp, minimalna historia powiatu {min(coverage.values(),default=0)} miesięcy. Nie nadpisano poprzednich plików.')
    now=dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')
    meta={'source':'GUS / Bank Danych Lokalnych (BDL) API','updated_at':now,'years':'2016–2026','province':'śląskie','powiat_count':len(mapping),'observation_count':len(entries),'rate_observation_count':rate_count,'count_observation_count':sum(r['liczba_osob'] is not None for r in entries),'subject_rate':RATE_SUBJECT,'subject_count':COUNT_SUBJECT if counts else None,'variables_rate':rates,'variables_count':counts,'unit_ids':mapping,'license':'CC BY 4.0 – GUS','limitations':'Dane po korektach BDL; stopa po grudniu 2021 nie w pełni porównywalna z latami wcześniejszymi.'}
    return {'meta':meta,'entries':entries}

def save(payload, no_embed=False):
    # Jedyny plik aktualizowany przez skrypt: data/dane.json
    if not OUT.exists():raise RuntimeError('Brak centralnego pliku data/dane.json')
    document=json.loads(OUT.read_text(encoding='utf-8'))
    if not isinstance(document.get('powiatBezrobocie'),dict) or not document.get('barometr'):
        raise RuntimeError('Niepoprawny format data/dane.json – odmowa nadpisania')
    document['powiatBezrobocie']['bdl']=payload
    document['meta']['ostatniaAktualizacjaBDL']=payload['meta']['updated_at']
    document['meta']['wersja']='BDL '+payload['meta']['updated_at'][:10]
    tmp=OUT.with_suffix('.tmp')
    tmp.write_text(json.dumps(document,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    tmp.replace(OUT)
    print('Zaktualizowano JEDYNY plik danych:',OUT,'; obserwacje:',len(payload['entries']))

if __name__=='__main__':
    arg=argparse.ArgumentParser(description=__doc__)
    arg.add_argument('--rate-only',action='store_true',help='pobierz tylko stopę bezrobocia, bez liczby osób')
    args=arg.parse_args()
    try:
      result=build(args.rate_only)
      save(result)
      print('GOTOWE. Dane GUS/BDL wczytają się do panelu po jego otwarciu / odświeżeniu.')
    except Exception as e:
      print('BŁĄD AKTUALIZACJI:',e,file=sys.stderr)
      sys.exit(1)
