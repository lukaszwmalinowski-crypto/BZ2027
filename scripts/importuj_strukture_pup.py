#!/usr/bin/env python3
"""Odczyt tabel MRPiPS-01/Dział 5 oraz załącznika 1. Import tylko po uzgodnieniu sum."""
import json,re,pathlib,subprocess,hashlib,zipfile,io,concurrent.futures,collections,unicodedata,os
BASE=pathlib.Path(os.environ.get('PUP_IMPORT_ROOT',pathlib.Path.cwd()));CACHE=BASE/'tmp/pup-extract';CACHE.mkdir(exist_ok=True)
NAMES=['będziński','bielski','cieszyński','częstochowski','gliwicki','kłobucki','lubliniecki','mikołowski','myszkowski','pszczyński','raciborski','rybnicki','tarnogórski','bieruńsko-lędziński','wodzisławski','zawierciański','żywiecki']
CODES={str(2401+i):n for i,n in enumerate(NAMES)}
CODES.update(dict(zip(map(str,range(2461,2480)),['Bielsko-Biała','Bytom','Chorzów','Częstochowa','Dąbrowa Górnicza','Gliwice','Jastrzębie-Zdrój','Jaworzno','Katowice','Mysłowice','Piekary Śląskie','Ruda Śląska','Rybnik','Siemianowice Śląskie','Sosnowiec','Świętochłowice','Tychy','Zabrze','Żory'])))
MAN=json.load(open(BASE/'pup-slaskie-do-pobrania/wykaz_plikow.json'))
jobs=[];seen=set();stats=collections.Counter()
def add(b,source,member=''):
 h=hashlib.sha256(b).hexdigest()
 if h in seen:return
 seen.add(h);f=CACHE/(h+'.pdf')
 if not f.exists():f.write_bytes(b)
 jobs.append((f,source,member))
def unzip(b,source,prefix='',depth=0):
 if depth>2:return
 try:
  with zipfile.ZipFile(io.BytesIO(b)) as z:
   for m in z.infolist():
    if m.file_size>30_000_000:continue
    if m.filename.lower().endswith('.pdf'):add(z.read(m),source,prefix+m.filename)
    elif m.filename.lower().endswith('.zip'):unzip(z.read(m),source,prefix+m.filename+'/',depth+1)
 except (zipfile.BadZipFile,RuntimeError):stats['unreadable_archive']+=1
for r in MAN:
 if r['pup']=='tychy':f=BASE/'historia-tychy'/pathlib.Path(r['plik']).name
 else:
  folder=BASE/'slaskie-pup-archiwum'/r['pup']/'pliki';a=list(folder.glob(pathlib.Path(r['plik']).stem+'.*'));f=a[0] if a else None
 if not f or not f.exists():continue
 if f.suffix=='.pdf':add(f.read_bytes(),r)
 elif f.suffix=='.zip':unzip(f.read_bytes(),r)
 else:stats['non_pdf_attachment']+=1

SINGLE={'bedzin':'będziński','bytom':'Bytom','chorzow':'Chorzów','cieszyn':'cieszyński','dabrowagornicza':'Dąbrowa Górnicza','jastrzebiezdroj':'Jastrzębie-Zdrój','jaworzno':'Jaworzno','katowice':'Katowice','klobuck':'kłobucki','lubliniec':'lubliniecki','mikolow':'mikołowski','myslowice':'Mysłowice','myszkow':'myszkowski','piekaryslaskie':'Piekary Śląskie','pszczyna':'pszczyński','raciborz':'raciborski','rudaslaska':'Ruda Śląska','siemianowiceslaskie':'Siemianowice Śląskie','sosnowiec':'Sosnowiec','swietochlowice':'Świętochłowice','tarnowskiegory':'tarnogórski','wodzislawslaski':'wodzisławski','zabrze':'Zabrze','zawiercie':'zawierciański','zory':'Żory','zywiec':'żywiecki'}
def norm(s):return ''.join(c for c in unicodedata.normalize('NFKD',s.lower()) if not unicodedata.combining(c)).replace('ł','l')
def source_period(text):
 t=norm(text)
 patterns=[r'(?<![0-9])(202[0-6])[_. -](0?[1-9]|1[0-2])(?![0-9])',r'(?<![0-9])(0?[1-9]|1[0-2])[_. -](202[0-6])(?![0-9])']
 for i,p in enumerate(patterns):
  m=re.search(p,t)
  if m:return (int(m[2]),int(m[1])) if i==0 else (int(m[1]),int(m[2]))
 m=re.search(r'(?<![a-z])(iv|iii|ii|i|[1-4])[ ._-]*(?:kwart|kw[ ._-]).*?(202[0-6])',t)
 if m:return (int(m[1]) if m[1].isdigit() else {'i':1,'ii':2,'iii':3,'iv':4}[m[1]])*3,int(m[2])
 months=['styczen','luty','marzec','kwiecien','maj','czerwiec','lipiec','sierpien','wrzesien','pazdziernik','listopad','grudzien']
 for i,n in enumerate(months,1):
  m=re.search(r'\b'+n+r'\b[^0-9]{0,15}(202[0-6])',t)
  if m:return i,int(m[1])
 return None
def extract(job):
 f,source,member=job;txt=f.with_suffix('.txt')
 if not txt.exists():subprocess.run(['pdftotext','-layout',str(f),str(txt)],stderr=subprocess.DEVNULL)
 if not txt.exists():return None,'no_text'
 s=txt.read_text(errors='replace');codes=set(re.findall(r'Powiat:\s*(\d{4})(?!\d)',s))
 label=source['nazwa']+' '+member
 gminas=set(re.findall(r'Gmina:\s*(\d+)',s))
 if gminas and gminas!={'999999'}:return None,'gmina_not_county'
 if re.search(r'(?:^|[^a-z])gmin[ay](?:[^a-z]|$)|(?<![0-9])24[0-9]{4,5}(?![0-9])',norm(label)):return None,'gmina_not_county'
 territory_basis='TERYT w formularzu'
 if len(codes)==1 and next(iter(codes)) in CODES:county=CODES[next(iter(codes))]
 elif len(codes)>1:return None,'no_single_county_code'
 else:
  named=set(re.findall(r'(?<![0-9])(24(?:0[1-9]|1[0-7]|6[1-9]|7[0-9]))(?![0-9])',label))
  if len(named)==1 and next(iter(named)) in CODES:codes=named;county=CODES[next(iter(codes))];territory_basis='TERYT w nazwie dokumentu'
  elif source['pup'] in SINGLE:
   county=SINGLE[source['pup']];codes={next(k for k,v in CODES.items() if v==county)};territory_basis='Jedyny powiat obsługiwany przez PUP; dokument bez oznaczenia gminy'
  else:return None,'no_single_county_code'
 new=re.search(r'DZIAŁ\s*5\.\s*STRUKTURA\s+BEZROBOTNYCH',s,re.I)
 old=re.search(r'ZAŁĄCZNIK\s+nr\s*1\s+do\s+sprawozdania',s,re.I)
 if not new and not old:return None,'no_structure_form'
 form='dzial5' if new else 'zalacznik1';start=new.start() if new else old.start();body=s[start:]
 if new:
  # Heading can repeat on subsequent pages. Stop at the next numbered department.
  nxt=re.search(r'DZIAŁ\s*[6-9]\.',body[50:])
  if nxt:body=body[:nxt.start()+50]
 else:
  end=re.search(r'2\.\s*Bezrobotni|2\.1\.',body,re.I)
  if end:body=body[:end.start()]
 header=s[:start+1800] if new else s[:2500]
 dates=re.findall(r'\d{1,2}[.]\d{1,2}[.]20\d{2}\s*[--]\s*\d{1,2}[.](\d{1,2})[.](20\d{2})',header)
 if dates:month,year=map(int,dates[0])
 else:
  q=re.search(r'Stan\s+w\s+końcu\s+(\d)\s*kwartału\s+(20\d{2})',header,re.I)
  if q:month=int(q[1])*3;year=int(q[2])
  else:
   parsed=source_period(member) or source_period(source['nazwa'])
   if not parsed:return None,'no_form_period'
   month,year=parsed
 if year<2020 or year>2026 or not 1<=month<=12:return None,'outside_period'
 period=f'{year}-{month:02d}';rows={}
 for line in body.splitlines():
  for m in re.finditer(r'(?=(?<!\S)(0[1-9]|1\d|2[0-5])\s+((?:\d+|[Xx])(?:\s+(?:\d+|[Xx])){14,18})\s*$)',line):
   vals=m[2].split();idx=int(m[1]);expected=(15,16) if new else (18,)
   if len(vals) not in expected:continue
   if new and 1 in rows and len(vals)!=len(rows[1]):continue
   vals=[int(v) if v.lower()!='x' else None for v in vals]
   if idx in rows and rows[idx]!=vals:return None,'duplicate_form_rows'
   rows[idx]=vals
 if new and 1 in rows:
  # Some PDF exports wrap the final columns onto the previous line.
  # Read only the two needed columns at the verified row-number position.
  anchor=None
  for line in body.splitlines():
   m=re.search(r'(?<!\S)01\s+(\d+)\s+(\d+)',line)
   if m and int(m[1])==rows[1][0] and int(m[2])==rows[1][1]:anchor=m.start();break
  if anchor is not None:
   for line in body.splitlines():
    candidates=[m for m in re.finditer(r'(?=(?<!\S)(0[1-9]|1\d|2[0-5])\s+(\d+|X)\s+(\d+|X))',line) if abs(m.start()-anchor)<=4]
    if not candidates:continue
    m=min(candidates,key=lambda m:abs(m.start()-anchor));idx=int(m[1])
    if idx not in rows:rows[idx]=[int(m[2]) if m[2]!='X' else None,int(m[3]) if m[3]!='X' else None]
 if len(rows)!=25:return None,'incomplete_rows'
 total=rows[1][0] if new else rows[25][0];women=rows[1][1] if new else rows[25][7]
 if total is None or women is None or not 0<=women<=total:return None,'invalid_total'
 ranges={'czas':range(2,8),'wiek':range(8,14),'wyksztalcenie':range(14,19),'staz':range(19,26)} if new else {'czas':range(1,7),'wiek':range(7,13),'wyksztalcenie':range(13,18),'staz':range(18,25)}
 out={'powiat':county,'okres':period,'ogolem':total,'kobiety':women,'zrodlo':source['url'],'dokument':source['nazwa'],'plikArchiwum':member,'formularz':form,'teryt':next(iter(codes)),'podstawaTerytorialna':territory_basis}
 for k,rr in ranges.items():
  counts=[rows[i][0] for i in rr];ws=[rows[i][1 if new else 7] for i in rr]
  if k=='wiek' and ws[-1] is None:ws[-1]=0
  if any(v is None or v<0 for v in counts+ws) or sum(counts)!=total or sum(ws)!=women or any(w>c for w,c in zip(ws,counts)):return None,'sum_mismatch'
  out[k]=counts;out[k+'Kobiety']=ws
 return out,'accepted'
(CACHE/'indeks_pdf.json').write_text(json.dumps([{'text':str(j[0].with_suffix('.txt')),'source':j[1],'member':j[2]} for j in jobs],ensure_ascii=False))
def monthly(job):
 f,source,member=job;s=f.with_suffix('.txt').read_text(errors='replace')
 m=re.search(r'Dział\s*1[.]\s*STRUKTURA\s+I\s+BILANS',s,re.I)
 if not m:return None
 label=source['nazwa']+' '+member
 if re.search(r'(?:^|[^a-z])gmin[ay](?:[^a-z]|$)|(?<![0-9])24[0-9]{4,5}(?![0-9])',norm(label)):return None
 gminas=set(re.findall(r'Gmina:\s*(\d+)',s))
 if gminas and gminas!={'999999'}:return None
 codes=set(re.findall(r'Powiat:\s*(\d{4})(?!\d)',s))
 if len(codes)==1 and next(iter(codes)) in CODES:county=CODES[next(iter(codes))]
 elif codes:return None
 else:
  named=set(re.findall(r'(?<![0-9])(24(?:0[1-9]|1[0-7]|6[1-9]|7[0-9]))(?![0-9])',label))
  if len(named)==1 and next(iter(named)) in CODES:county=CODES[next(iter(named))]
  elif source['pup'] in SINGLE and not member:county=SINGLE[source['pup']]
  else:return None
 dates=re.findall(r'\d{1,2}[.]\d{1,2}[.]20\d{2}\s*[--]\s*\d{1,2}[.](\d{1,2})[.](20\d{2})',s[:m.start()+200])
 if dates:month,year=map(int,dates[0])
 else:
  p=source_period(member) or source_period(source['nazwa'])
  if not p:return None
  month,year=p
 if not 2020<=year<=2026 or not 1<=month<=12:return None
 body=s[m.start():];stop=re.search(r'1[.]2[.]',body)
 if stop:body=body[:stop.start()]
 rows={}
 for line in body.splitlines():
  for r in re.finditer(r'(?=(?<!\S)(0[1-4])\s+((?:\d+)(?:\s+\d+){7})\s*$)',line):
   idx=int(r[1]);v=list(map(int,r[2].split()))
   if idx in rows and rows[idx]!=v:return None
   rows[idx]=v
 if not {1,2,4}<=rows.keys():return None
 if any(rows[1][i]!=rows[2][i]+rows[4][i] for i in range(8)):return None
 v=rows[1]
 if v[5]>v[4]:return None
 return {'powiat':county,'okres':f'{year}-{month:02d}','liczba_osob':v[4],'kobiety':v[5],'zrodlo':source['url'],'dokument':source['nazwa'],'plikArchiwum':member}
print('PDF files',len(jobs),flush=True)
records=[];errors=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as ex:
 for job,(r,status) in zip(jobs,ex.map(extract,jobs)):
  stats[status]+=1
  if r:records.append(r)
  elif status not in ('no_structure_form','no_single_county_code','gmina_not_county','outside_period'):errors.append({'dokument':job[1]['nazwa'],'url':job[1]['url'],'member':job[2],'status':status,'text':str(job[0].with_suffix('.txt'))})
# Do not resolve conflicting observations by download order.
by=collections.defaultdict(list)
for r in records:by[(r['powiat'],r['okres'])].append(r)
accepted=[];conflicts=[]
for key,rs in by.items():
 sigs={json.dumps({k:r[k] for k in ['ogolem','kobiety','czas','wiek','wyksztalcenie','staz']},sort_keys=True) for r in rs}
 if len(sigs)>1:conflicts.append({'powiat':key[0],'okres':key[1],'warianty':rs});continue
 # Keep provenance for duplicate official reports.
 r=rs[0];r['inneZrodla']=list(dict.fromkeys(x['zrodlo'] for x in rs if x['zrodlo']!=r['zrodlo']));accepted.append(r)
accepted.sort(key=lambda r:(r['powiat'],r['okres']))
result={'meta':{'pobrano':'2026-10-29','liczbaDokumentowPDF':len(jobs),'liczbaObserwacji':len(accepted),'liczbaPowiatow':len(set(r['powiat'] for r in accepted)),'walidacja':'Sumy kategorii oraz kobiet uzgodnione z ogółem w każdej obserwacji. Gminy wyłączone. Sprzeczne obserwacje pominięte.'},'etykiety':{'czas':['Do 1 miesiąca','1-3 miesiące','3-6 miesięcy','6-12 miesięcy','12-24 miesiące','Powyżej 24 miesięcy'],'wiek':['18-24 lata','25-34 lata','35-44 lata','45-54 lata','55-59 lat','60 lat i więcej'],'wyksztalcenie':['Wyższe','Policealne i średnie zawodowe / branżowe','Średnie ogólnokształcące','Zasadnicze zawodowe / branżowe','Gimnazjalne / podstawowe i poniżej'],'staz':['Do 1 roku','1-5 lat','5-10 lat','10-20 lat','20-30 lat','30 lat i więcej','Bez stażu']},'obserwacje':accepted}
(CACHE/'struktura.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));(CACHE/'bledy_odczytu.json').write_text(json.dumps(errors,ensure_ascii=False,indent=2));(CACHE/'konflikty.json').write_text(json.dumps(conflicts,ensure_ascii=False,indent=2));print(json.dumps({'stats':dict(stats),'accepted':len(accepted),'counties':result['meta']['liczbaPowiatow'],'conflicts':len(conflicts)},ensure_ascii=False),flush=True)

monthly_rows=[r for j in jobs if (r:=monthly(j))]
for r in accepted:monthly_rows.append({'powiat':r['powiat'],'okres':r['okres'],'liczba_osob':r['ogolem'],'kobiety':r['kobiety'],'zrodlo':r['zrodlo'],'dokument':r['dokument'],'plikArchiwum':r['plikArchiwum']})
by_month=collections.defaultdict(list)
for r in monthly_rows:by_month[(r['powiat'],r['okres'])].append(r)
monthly_ok=[];monthly_conflicts=[]
for key,rs in by_month.items():
 if len({(r['liczba_osob'],r['kobiety']) for r in rs})>1:monthly_conflicts.append({'powiat':key[0],'okres':key[1],'warianty':rs})
 else:monthly_ok.append(rs[0])
(CACHE/'miesieczne.json').write_text(json.dumps(sorted(monthly_ok,key=lambda r:(r['powiat'],r['okres'])),ensure_ascii=False,indent=2))
(CACHE/'konflikty_miesieczne.json').write_text(json.dumps(monthly_conflicts,ensure_ascii=False,indent=2))
print('monthly',len(monthly_ok),'counties',len(set(r['powiat'] for r in monthly_ok)),'conflicts',len(monthly_conflicts),flush=True)
