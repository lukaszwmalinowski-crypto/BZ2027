(function(){
 'use strict';
 const NS='http://www.w3.org/2000/svg';
 const $=id=>document.getElementById(id);
 const counties=Object.keys(UNEMPLOYMENT).sort((a,b)=>a.localeCompare(b,'pl'));
 const provinceRate2026=window.PANEL_DATA.powiatBezrobocie.stopaWojewodztwa2026;
 const initial=Object.fromEntries(counties.map(name=>[name,{'2026-08':{rate:UNEMPLOYMENT[name],count:null,source:'Panel v7 / 31.08.2026'}}]));
 const verifiedSeed=window.PANEL_DATA.powiatBezrobocie.verified.entries;
 for(const row of verifiedSeed){if(!initial[row.powiat])continue;initial[row.powiat][row.okres]={rate:row.stopa_proc,count:row.liczba_osob,source:row.zrodlo}}
 const bdlSeed=window.PANEL_DATA.powiatBezrobocie.bdl;
 for(const row of (bdlSeed.entries||[])){if(!initial[row.powiat]||!/^20\d{2}-(0[1-9]|1[0-2])$/.test(row.okres))continue;const old=initial[row.powiat][row.okres]||{};initial[row.powiat][row.okres]={rate:row.stopa_proc??old.rate??null,count:row.liczba_osob??old.count??null,source:row.zrodlo||'GUS / BDL'}}
 const pupSeed=window.PANEL_DATA.powiatBezrobocie.pup||{entries:[]};
 for(const row of pupSeed.entries||[]){
  if(!initial[row.powiat]||!/^20\d{2}-(0[1-9]|1[0-2])$/.test(row.okres))continue;
  const old=initial[row.powiat][row.okres]||{};
  initial[row.powiat][row.okres]={...old,count:row.liczba_osob,source:row.zrodlo};
 }
 const defaultCountyDate=bdlSeed.entries?.length?[...new Set(bdlSeed.entries.filter(r=>r.stopa_proc!=null).map(r=>r.okres))].sort().reverse().find(d=>bdlSeed.entries.filter(r=>r.okres===d&&r.stopa_proc!=null).length===36)||'2026-08':'2026-08';
 const state={view:'single',metric:'rate',period:'monthly',year:2026,county:counties.includes('Ruda Śląska')?'Ruda Śląska':counties[0],compare:['Ruda Śląska','Katowice','Bytom'].filter(x=>counties.includes(x)),mapDate:defaultCountyDate,mapMode:'level'};
 let data=JSON.parse(JSON.stringify(initial));
 const key='wup-powiaty-bezrobocie-v8-dane';
 const safe=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fmt=(n,frac=1)=>Number(n).toLocaleString('pl-PL',{maximumFractionDigits:frac,minimumFractionDigits:frac});
 const val=(name,date,metric)=>{const v=data[name]?.[date]?.[metric];return v===undefined||v===null||!Number.isFinite(v)?null:v};
 const make=(tag,attrs={},text)=>{const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));if(text!==undefined)e.textContent=String(text);return e};
 const rate=(raw)=>{if(raw==null||String(raw).trim()==='')return null;const n=Number(String(raw).trim().replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?n:null};
 const periodValid=(d)=>/^\d{4}-(0[1-9]|1[0-2])$/.test(d);
 const dates=()=>[...new Set(counties.flatMap(name=>Object.keys(data[name]||{})))].filter(periodValid).sort();
 const chosenDates=period=>{
   if(period==='annual')return Array.from({length:10},(_,i)=>`${2016+i}-12`);
   const yyyy=Number(state.year)||2026;
   const present=dates().filter(p=>p.startsWith(String(yyyy)+'-'));
   const maxM=present.length?Math.max(...present.map(p=>Number(p.slice(-2)))):12;
   return Array.from({length:maxM},(_,i)=>`${yyyy}-${String(i+1).padStart(2,'0')}`);
 };
 function normalizeCounty(raw){
  const n=String(raw||'').trim();if(counties.includes(n))return n;
  const simple=x=>x.toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/^powiat\s+/,'').trim();
  return counties.find(x=>simple(x)===simple(n))||null;
 }
 function incorporate(rows){
  let accepted=0,skipped=0;
  for(const r of rows){
   const name=normalizeCounty(r.powiat??r.county??r.nazwa),date=String(r.okres??r.period??r.miesiac??'').trim();
   const rr=rate(r.stopa_proc??r.rate??r.stopa),cc=rate(r.liczba_osob??r.count??r.liczba);
   if(!name||!periodValid(date)||((rr===null||rr<0||rr>100)&&(cc===null||cc<0))){skipped++;continue}
   if((rr!==null&&(rr<0||rr>100))||(cc!==null&&(!Number.isInteger(cc)||cc<0))){skipped++;continue}
   data[name] ||= {};
   const old=data[name][date]||{};
   data[name][date]={rate:rr??old.rate??null,count:cc??old.count??null,source:String(r.zrodlo??r.source??'Import użytkownika')};
   accepted++;
  }
  return {accepted,skipped};
 }
 function readLocal(){
  try{const raw=localStorage.getItem(key);if(!raw)return;const obj=JSON.parse(raw);if(!Array.isArray(obj.entries))return;
   // Stary zapis localStorage zawierał także kopię danych bazowych. Nie wolno dopuścić,
   // by nieaktualny 'Panel v7' nadpisał nowszy, urzędowy zestaw GUS/BDL.
   const rows=(bdlSeed.entries?.length||pupSeed.entries?.length)?obj.entries.filter(row=>!/^panel v[0-9]|^PUP Ruda Śląska|^https?:/i.test(String(row.zrodlo||''))):obj.entries;
   incorporate(rows);
  }catch(e){console.warn('Brak dostępu do zapisanej bazy powiatowej',e)}
 }
 function store(){
  try{localStorage.setItem(key,JSON.stringify({entries:asEntries()}));return true}catch(e){return false}
 }
 function asEntries(){return counties.flatMap(name=>Object.entries(data[name]||{}).map(([okres,x])=>({powiat:name,okres,stopa_proc:x.rate,liczba_osob:x.count,zrodlo:x.source})))}
 function countStatus(){
  const rows=asEntries(),periods=dates().length;
  $('countyUImportedCount').textContent=`Baza: ${rows.length} obserwacji • ${periods} okresów • historia: ${counties.filter(c=>Object.keys(data[c]||{}).length>1).length}/36 jednostek`;
  const meta=bdlSeed.meta||{}, badge=$('countyUBDLBadge');
  if(pupSeed.entries?.length){const scope=$('countyUScope');if(scope)scope.textContent=`Baza PUP: ${pupSeed.entries.length.toLocaleString('pl-PL')} obserwacji liczby bezrobotnych dla ${new Set(pupSeed.entries.map(r=>r.powiat)).size} powiatów i miast. Zakres okresów różni się między jednostkami. Wskaźniki stopy bezrobocia GUS pozostają odrębną serią. Szczegółowa struktura i źródła są poniżej.`;}
  if(meta.updated_at&&Array.isArray(bdlSeed.entries)&&bdlSeed.entries.length){badge.textContent=`BDL/GUS • ${meta.updated_at.slice(0,10)} • ${meta.powiat_count||'?'} powiatów • ${(meta.observation_count||bdlSeed.entries.length).toLocaleString('pl-PL')} obserwacji`;badge.dataset.status='ready';}
  else {badge.textContent='BDL/GUS: pełne dane niepobrane - tylko dane początkowe';badge.dataset.status='pending';}
  const scope=$('countyUScope');if(scope&&meta.updated_at&&bdlSeed.entries?.length){scope.innerHTML=`Zasilenie GUS/BDL z <b>${safe(meta.updated_at.slice(0,10))}</b>: <b>${meta.powiat_count||'?'} powiatów</b>, <b>${(meta.observation_count||bdlSeed.entries.length).toLocaleString('pl-PL')}</b> obserwacji miesięcznych (stopa bezrobocia${meta.count_observation_count?' / liczba osób':''}). Wyświetlane są wyłącznie okresy faktycznie dostępne w BDL. Źródło: <a href="https://bdl.stat.gov.pl/BDL/dane/podgrup/temat/4/12/3559" target="_blank" rel="noopener">GUS/BDL</a>.`;}

 }
 function updateMapDates(){
  const old=$('countyUMapDate').value||state.mapDate;
  const ds=dates();$('countyUMapDate').innerHTML=ds.map(d=>`<option value="${safe(d)}">${safe(d.slice(0,4))} / ${safe(d.slice(5))}</option>`).join('');
  state.mapDate=ds.includes(old)?old:(ds[ds.length-1]||'2026-08');$('countyUMapDate').value=state.mapDate;
 }
 function renderSnapshot(){
  const latest=dates().slice().reverse().find(d=>counties.every(n=>val(n,d,'rate')!==null))||'2026-08';
  const valid=counties.map(n=>[n,val(n,latest,'rate')]).filter(([,v])=>Number.isFinite(v)).sort((a,b)=>a[1]-b[1]);
  const rates=valid.map(v=>v[1]);const n=rates.length;
  const mid=n%2?rates[(n-1)/2]:(rates[n/2-1]+rates[n/2])/2;
  const min=valid[0],max=valid[n-1];
  const pills=[['36', 'jednostek ze stopą bezrobocia'],[fmt(mid)+'%', 'mediana stóp bezrobocia'],[fmt(min[1])+'%',min[0]+' · najniższa'],[fmt(max[1])+'%',max[0]+' · najwyższa']];
  const bar=(a,maxV)=>`<div class="countyUSnapshotBar"><span>${safe(a[0])}</span><div><i style="width:${Math.max(3,Math.round(a[1]/maxV*100))}%"></i></div><strong>${fmt(a[1])}%</strong></div>`;
  $('countyUSnapshot').innerHTML=`<div class="countyUSnapshotHead"><b>Przekrój powiatów · ${safe(latest)}</b><span>Stan w jednym miesiącu, nie trend</span></div><div class="countyUSnapshotMetrics">${pills.map(p=>`<div class="countyUSnapshotMetric"><strong>${safe(p[0])}</strong><span>${safe(p[1])}</span></div>`).join('')}</div><div class="countyUSnapshotPair"><div><b>5 najniższych wartości</b>${valid.slice(0,5).map(x=>bar(x,max[1])).join('')}</div><div><b>5 najwyższych wartości</b>${valid.slice(-5).reverse().map(x=>bar(x,max[1])).join('')}</div></div><div class="countyUSnapshotNote">Źródło przekroju: ${bdlSeed.meta?.updated_at?'GUS / BDL, aktualizacja '+safe(bdlSeed.meta.updated_at.slice(0,10)):'dane początkowe panelu - sierpień 2026'}. Dodatkowe dane: <a href="https://rudaslaska.praca.gov.pl/stopy-bezrobocia" target="_blank" rel="noopener">PUP Ruda Śląska</a>. Różnice regionalne nie są zmianą w czasie.</div>`;
 }
 function renderToolbar(){
  $('countyUCountyBox').hidden=state.view!=='single';$('countyUCompareBox').hidden=state.view!=='compare';$('countyUMapPeriodBox').hidden=state.view!=='map';$('countyUMapModeBox').hidden=state.view!=='map';
  $('countyUPeriodBox').hidden=state.view==='map';$('countyUYearBox').hidden=state.view==='map'||state.period!=='monthly';
  $('countyUnempChart').toggleAttribute('hidden',state.view==='map');$('countyUnempMap').toggleAttribute('hidden',state.view!=='map');
  document.querySelectorAll('[data-cu-view]').forEach(b=>{b.classList.toggle('active',b.dataset.cuView===state.view);b.setAttribute('aria-pressed',String(b.dataset.cuView===state.view))});
  $('countyUCounty').value=state.county;$('countyUMetric').value=state.metric;$('countyUPeriod').value=state.period;$('countyUYear').value=String(state.year);$('countyUMapMode').value=state.mapMode;
  $('countyUCompareBox').innerHTML=counties.map(name=>`<label class="countyUCheck"><input type="checkbox" data-cu-cmp="${safe(name)}" ${state.compare.includes(name)?'checked':''}>${safe(name)}</label>`).join('');
  updateMapDates();countStatus();
 }
 const palette=['#b75863','#286a94','#3e917c','#ad8743'];
 function renderLine(){
  const svg=$('countyUnempChart');svg.replaceChildren();
  const dateset=chosenDates(state.period),single=state.view==='single',metric=state.metric;
  const selected=single?[state.county]:state.compare;
  const W=960,H=310,L=70,R=31,T=35,B=52;
  const xs=i=>L+(W-L-R)*(dateset.length===1?0.5:i/(dateset.length-1));
  const series=selected.map((name,i)=>({name,color:palette[i%4],values:dateset.map(d=>val(name,d,metric))}));
  const province=single&&metric==='rate'&&state.period==='monthly'&&state.year===2026?{name:'woj. śląskie',color:'#a0abb5',values:dateset.map(d=>provinceRate2026[d]??null)}:null;
  const values=series.flatMap(s=>s.values).concat(province?.values||[]).filter(Number.isFinite);
  const floor=metric==='rate'?Math.max(0,Math.floor((Math.min(0,...values)-.6)*2)/2):0;
  const ceil=Math.max(metric==='rate'?3:1,...values)*1.22+(.3*(metric==='rate'));
  const lo=metric==='rate'?(values.length?Math.max(0,Math.floor((Math.min(...values)-1.4)*2)/2):0):0;
  const hi=metric==='rate'?(values.length?Math.max(4,Math.ceil((Math.max(...values)+1.4)*2)/2):10):Math.max(100,Math.ceil(ceil/100)*100);
  const ys=v=>T+(H-T-B)*(hi-v)/(hi-lo||1);
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  svg.append(make('rect',{x:0,y:0,width:W,height:H,fill:'#fff'}));
  [0,1,2,3,4].forEach(i=>{const y=T+(H-T-B)*i/4,n=hi-(hi-lo)*i/4;svg.append(make('line',{x1:L,y1:y,x2:W-R,y2:y,stroke:'#e7edf2','stroke-width':1}),make('text',{x:L-10,y:y+4,'text-anchor':'end','font-size':11,fill:'#687b8e'},metric==='rate'?fmt(n)+'%':Math.round(n).toLocaleString('pl-PL')))});
  dateset.forEach((d,i)=>{if(dateset.length>12&&i%2) return;svg.append(make('text',{x:xs(i),y:H-21,'text-anchor':'middle','font-size':12,fill:'#526d83'},state.period==='monthly'?d.slice(5):d.slice(0,4)))});
  function addSeries(s,dashed){
   let segment=[];
   function flush(){if(segment.length>1)svg.append(make('polyline',{points:segment.join(' '),fill:'none',stroke:s.color,'stroke-width':dashed?2.4:3.2,'stroke-dasharray':dashed?'6 6':'','stroke-linejoin':'round','stroke-linecap':'round'}));segment=[]}
   s.values.forEach((v,i)=>{if(v===null){flush();return}segment.push(`${xs(i)},${ys(v)}`)});flush();
   s.values.forEach((v,i)=>{if(v===null)return;const x=xs(i),y=ys(v);const dot=make('circle',{cx:x,cy:y,r:dashed?4:5.2,fill:'#fff',stroke:s.color,'stroke-width':3});dot.append(make('title',{},`${s.name} • ${dateset[i]} • ${metric==='rate'?fmt(v)+'%':Math.round(v).toLocaleString('pl-PL')+' osób'}`));svg.append(dot); if((s.values.filter(x=>x!==null).length<=3)&&!dashed)svg.append(make('text',{x,y:y-13,'text-anchor':'middle','font-size':14,'font-weight':'bold',fill:s.color},metric==='rate'?fmt(v)+'%':Math.round(v).toLocaleString('pl-PL')))});
  }
  if(province)addSeries(province,true);
  series.forEach(s=>addSeries(s,false));
  const actual=series.flatMap(s=>s.values).filter(v=>v!==null).length;
  $('countyULegend').innerHTML=[...series,...(province?[province]:[])].map(s=>`<span><i style="background:${s.color}"></i>${safe(s.name)}</span>`).join('');
  if(!actual){svg.append(make('text',{x:480,y:153,'text-anchor':'middle','font-size':18,fill:'#8d6d51'},'Brak zweryfikowanych danych powiatowych w tym zakresie'))}
  const periodsWithValues=new Set(series.flatMap(s=>s.values.map((v,i)=>v===null?null:dateset[i]).filter(Boolean)));
  const status=$('countyUStatus');status.classList.toggle('ok',periodsWithValues.size>1);
  if(periodsWithValues.size===0)status.innerHTML=`<b>Brak danych powiatowych.</b> Dla ${state.period==='annual'?'lat 2016-2025 (wartości grudniowych)':`miesięcy ${state.year}`} i wybranego wskaźnika potrzebny jest import oficjalnych danych. ${province?'Szara linia przedstawia jedynie znaną serię wojewódzką.':''}`;
  else if(periodsWithValues.size===1)status.innerHTML=`<b>Dostępny tylko jeden punkt w czasie:</b> ${safe([...periodsWithValues][0])}. Z tego nie można obliczyć trendu. Dodatkowe miesiące lub lata wczytaj z GUS/BDL. ${province?'Szara linia jest serią dla całego województwa.':''}`;
  else status.innerHTML=`<b>Obserwacje powiatowe w ${periodsWithValues.size} okresach.</b> Wykres pokazuje wyłącznie istniejące wartości; przerwy nie są interpolowane.`;
  // Zwięzłe zestawienie trendów: tylko zaobserwowane punkty, bez imputacji.
  const trends=$('countyUTrends');
  if(trends){
   const cards=series.map(s=>{
    const obs=s.values.map((v,i)=>({v,date:dateset[i]})).filter(x=>Number.isFinite(x.v));
    if(obs.length<2)return `<div class="countyTrendCard"><strong>${safe(s.name)}</strong><span>Za mało danych do oceny zmiany (${obs.length} pkt)</span></div>`;
    const first=obs[0],last=obs[obs.length-1],delta=last.v-first.v;
    const direction=delta>0?'Wzrost':delta<0?'Spadek':'Bez zmiany';
    const diff=(delta>0?'+':'')+(metric==='rate'?fmt(delta)+' p.p.':Math.round(delta).toLocaleString('pl-PL')+' osób');
    const gaps=obs.length<dateset.length?` • ${obs.length}/${dateset.length} okresów`:'';
    return `<div class="countyTrendCard"><strong>${safe(s.name)}</strong><b class="${delta>0?'trendUp':delta<0?'trendDown':'trendFlat'}">${direction} · ${diff}</b><span>${safe(first.date)} → ${safe(last.date)}${gaps}</span></div>`;
   });
   trends.innerHTML=cards.join('');
   trends.hidden=false;
  }

 }
 function renderMap(){
  const svg=$('countyUnempMap');svg.replaceChildren();
  svg.append(make('rect',{x:0,y:0,width:760,height:760,fill:'#fff'}));
  const ds=dates(), idx=ds.indexOf(state.mapDate),prev=idx>0?ds[idx-1]:null,metric=state.metric;
  const changes=state.mapMode==='change',values=[];
  for(const name of counties){const v=val(name,state.mapDate,metric),p=prev?val(name,prev,metric):null;if(v!==null&&(!changes||p!==null))values.push(changes?v-p:v)}
  const scale=changes?Math.max(.4,...values.map(Math.abs)):Math.max(metric==='rate'?10:10,...values);
  const color=(value)=>{if(value===null)return '#e5e9ed';if(changes){let t=Math.min(1,Math.abs(value)/scale),n=Math.round(238-126*t);return value>=0?`rgb(213,${n},${n})`:`rgb(${n},${Math.round(202+33*t)},${Math.round(208+20*t)})`};const t=Math.min(1,Math.max(0,value/scale));return `rgb(${Math.round(232-65*t)},${Math.round(243-155*t)},${Math.round(241-140*t)})`};
  for(const name of counties){const v=val(name,state.mapDate,metric),p=prev?val(name,prev,metric):null,value=changes?(v!==null&&p!==null?v-p:null):v;
   const path=make('path',{d:EMBEDDED_PATHS[name],fill:color(value),'fill-rule':'evenodd'});
   path.append(make('title',{},`${name} • ${state.mapDate}: ${value===null?'brak danych':changes?(value>0?'+':'')+fmt(value)+(metric==='rate'?' p.p.':' osób'):metric==='rate'?fmt(value)+'%':Math.round(value).toLocaleString('pl-PL')+' osób'}`));
   path.addEventListener('click',()=>{state.county=name;state.view='single';render()});svg.append(path);
  }
  const status=$('countyUStatus');const n=values.length;status.classList.toggle('ok',n===36);
  status.innerHTML=changes?`<b>Mapa zmian:</b> ${prev?`${safe(prev)} → ${safe(state.mapDate)}`:'brak wcześniejszego okresu'}. Dostępne porównania: <b>${n}/36</b>. Szare jednostki nie mają dwóch porównywalnych wartości.`:`<b>Mapa poziomu bezrobocia:</b> ${safe(state.mapDate)}. Dane dostępne dla <b>${n}/36</b> jednostek. Kliknij powiat, aby przejść do wykresu. Przeniesione z panelu v7 wartości mają stan na 31.08.2026.`;
  $('countyULegend').innerHTML=changes?'<span><i style="background:#75bbbd"></i>spadek</span><span><i style="background:#d57575"></i>wzrost</span><span><i style="background:#e5e9ed"></i>brak danych</span>':'<span><i style="background:#e8f3f1"></i>niższa stopa</span><span><i style="background:#a75865"></i>wyższa stopa</span><span><i style="background:#e5e9ed"></i>brak danych</span>';
 }
 function useAvailableSeries(name){
  if(state.view!=='single')return;
  const year=String(state.year),rows=Object.entries(data[name]||{}).filter(([d])=>d.startsWith(year+'-'));
  const rates=rows.filter(([,v])=>Number.isFinite(v.rate)).length;
  const counts=rows.filter(([,v])=>Number.isFinite(v.count)).length;
  if(state.metric==='rate'&&rates<2&&counts>=2){state.metric='count';state.period='monthly';}
 }
 function render(){renderToolbar();if(state.view==='map'){renderMap();const trends=$('countyUTrends');if(trends)trends.hidden=true;}else renderLine();syncReport()}
 // Readiness is determined for the exact selected county, year, metric and chart mode.
 // Never enable a slide because another county has historical observations.
 const chartIds=['county-rate-monthly','county-rate-annual','county-compare-monthly','county-compare-annual','county-map',
   'county-count-monthly','county-count-annual','county-count-compare-monthly','county-count-compare-annual','county-count-map'];
 function optionInfo(which){
   const metric=which.includes('-count-')?'count':'rate';
   const period=which.includes('annual')?'annual':'monthly';
   const view=which.endsWith('-map')?'map':which.includes('compare')?'compare':'single';
   const selectedCounty=(document.getElementById('reportCountySelect')?.value || state.county);
   const ds=chosenDates(period);
   if(view==='single'){
     const pts=ds.filter(d=>val(selectedCounty,d,metric)!==null);
     return {ok:pts.length>=2,reason:`${selectedCounty}: ${pts.length} z ${ds.length} okresów z danymi (minimum 2)`,view,period,metric};
   }
   if(view==='compare'){
     const selected=[...new Set(state.compare)];
     if(!selected.includes(selectedCounty))return {ok:false,reason:'Porównanie nie obejmuje powiatu wybranego do raportu. Wybierz go w porównywarce.',view,period,metric};
     if(selected.length<2)return {ok:false,reason:'Wybierz co najmniej dwa powiaty do porównania.',view,period,metric};
     const shared=ds.filter(d=>selected.every(name=>val(name,d,metric)!==null));
     return {ok:shared.length>=2,reason:`Wspólne okresy dla ${selected.join(', ')}: ${shared.length} (minimum 2)`,view,period,metric};
   }
   const mapDate=state.mapDate;
   const all=dates();const earlier=all[all.indexOf(mapDate)-1];
   const valid=counties.filter(name=>val(name,mapDate,metric)!==null &&
      (state.mapMode!=='change'||(earlier&&val(name,earlier,metric)!==null))).length;
   const min=state.mapMode==='change'?30:30;
   return {ok:valid>=min,reason:`Mapa ${mapDate}: dane dla ${valid}/36 jednostek (minimum ${min})`,view,period,metric};
 }
 function syncReport(){
   chartIds.forEach(id=>{
     const ch=document.querySelector(`#reportItems input[value="${id}"]`);if(!ch)return;
     const info=optionInfo(id);
     ch.disabled=!info.ok;
     if(!info.ok)ch.checked=false;
     const label=ch.closest('label');
     if(label){
       label.style.opacity=info.ok?'1':'.55';
       label.title=info.ok?'Dane dostępne: '+info.reason:'Pominięte - '+info.reason;
       const old=label.querySelector('.reportAvailability');if(old)old.remove();
       if(!info.ok){const msg=document.createElement('small');msg.className='reportAvailability';msg.style.cssText='display:block;color:#8a4a45;margin-top:4px;line-height:1.4';msg.textContent='Niedostępne: '+info.reason;label.querySelector('span')?.appendChild(msg)}
     }
   });
   if(typeof syncReportSelection==='function')syncReportSelection();
 }
 function capture(which){
   const readiness=optionInfo(which);
   if(!readiness.ok)return null;
   const old={...state,compare:[...state.compare]};
   try{
     state.view=readiness.view;state.period=readiness.period;state.metric=readiness.metric;
     if(state.view==='single')state.county=document.getElementById('reportCountySelect')?.value||old.county;
     render();
     const svg=$(state.view==='map'?'countyUnempMap':'countyUnempChart').cloneNode(true);
     svg.removeAttribute('hidden');svg.setAttribute('xmlns',NS);
     svg.setAttribute('width',state.view==='map'?'760':'960');svg.setAttribute('height',state.view==='map'?'760':'310');
     const markup=new XMLSerializer().serializeToString(svg);
     const title=which.endsWith('-map')?'Bezrobocie - mapa powiatów':(state.view==='single'?`Bezrobocie - ${state.county}`:'Bezrobocie - porównanie powiatów');
     const subtitle=state.view==='map'?`Mapa • ${state.mapDate} • ${state.mapMode==='change'?'zmiana':'poziom'} • ${state.metric==='rate'?'stopa (%)':'liczba osób'}`:(state.period==='annual'?'Grudzień 2016-2025':`Miesiące ${state.year}`)+(state.metric==='count'?' • bezrobotni (osoby)':' • stopa bezrobocia rejestrowanego (%)');
     const source=(state.metric==='count'&&pupSeed.entries?.length)?'Źródło: zestawienia PUP i dane początkowe; źródła oraz okresy poszczególnych obserwacji: data/dane.json.':bdlSeed.meta?.updated_at?`Źródło: GUS/BDL, aktualizacja ${bdlSeed.meta.updated_at.slice(0,10)}; https://bdl.stat.gov.pl/BDL/dane/podgrup/temat/4/12/3559`:'Źródło: GUS/BDL i dane początkowe, zakres i dostępność według pliku data/dane.json.';
     return {id:which,title,subtitle,markup,data:'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(markup))),note:$('countyUStatus').textContent,insight:state.view==='compare'?'Porównywane powiaty: '+state.compare.join(', '):state.view==='single'?'Powiat: '+state.county:'Mapa obejmuje jednostki z danymi dla wskazanego okresu.',source};
   }finally{Object.assign(state,old);render()}
 }
 $('countyUCounty').innerHTML=counties.map(name=>`<option value="${safe(name)}">${safe(name)}</option>`).join('');
 document.querySelectorAll('[data-cu-view]').forEach(btn=>btn.addEventListener('click',()=>{state.view=btn.dataset.cuView;render()}));
 $('countyUCounty').addEventListener('change',e=>{
   state.county=e.target.value;
   useAvailableSeries(state.county);
   if(typeof selectCounty==='function' && DATA[state.county])selectCounty(state.county);
   render();
 });
 document.addEventListener('panel:county-change',e=>{
   const name=e.detail?.name;
   if(counties.includes(name) && state.county!==name){state.county=name;useAvailableSeries(name);render();}
 });
 $('countyUMetric').addEventListener('change',e=>{state.metric=e.target.value;render()});
 const quick=$('countyUQuickTrends');
 if(quick)quick.addEventListener('click',()=>{state.view='compare';state.metric='count';state.period='monthly';state.year=2026;
  state.compare=counties.map(c=>({c,n:chosenDates('monthly').filter(d=>val(c,d,'count')!==null).length})).filter(x=>x.n>=2).sort((a,b)=>b.n-a.n||a.c.localeCompare(b.c,'pl')).slice(0,4).map(x=>x.c);
  render();});

 $('countyUPeriod').addEventListener('change',e=>{state.period=e.target.value;render()});
 $('countyUYear').addEventListener('change',e=>{state.year=Number(e.target.value);render()});
 $('countyUMapDate').addEventListener('change',e=>{state.mapDate=e.target.value;render()});
 $('countyUMapMode').addEventListener('change',e=>{state.mapMode=e.target.value;render()});
 $('countyUCompareBox').addEventListener('change',e=>{if(!e.target.matches('[data-cu-cmp]'))return;const c=e.target.dataset.cuCmp;
  if(e.target.checked){if(state.compare.length>=4){e.target.checked=false;alert('Do porównania można wybrać maksymalnie cztery powiaty.');return}state.compare.push(c)}else{state.compare=state.compare.filter(n=>n!==c)}render()});
 $('countyUImport').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{let rows,text=await file.text();if(file.name.toLowerCase().endsWith('.json')){const obj=JSON.parse(text);rows=Array.isArray(obj)?obj:obj.entries}else{
   const lines=text.replace(/^\uFEFF/,'').trim().split(/\r?\n/);const heads=lines.shift().split(';').map(x=>x.trim());rows=lines.map(line=>{const obj={};line.split(';').forEach((value,i)=>obj[heads[i]]=value.trim().replace(/^"|"$/g,''));return obj});
  }
  if(!Array.isArray(rows))throw Error('Nie znaleziono listy obserwacji.');const {accepted,skipped}=incorporate(rows);
  if(!accepted)throw Error('Nie znaleziono poprawnych danych; sprawdź nazwy kolumn i okres YYYY-MM.');
  const saved=store();render();alert(`Wczytano ${accepted} obserwacji; pominięto ${skipped}. ${saved?'Zapisano lokalnie.':'Przeglądarka nie pozwoliła zapisać zmian na stałe.'}`);
  }catch(err){alert('Import nieudany: '+err.message)}finally{e.target.value=''}
 });
 $('countyUReset').addEventListener('click',()=>{if(!confirm('Przywrócić dane z paczki (wraz z ewentualnym pobraniem BDL)? Zaimportowane wartości zostaną usunięte z tej przeglądarki.'))return;data=JSON.parse(JSON.stringify(initial));try{localStorage.removeItem(key)}catch(e){}state.mapDate=dates().slice(-1)[0]||'2026-08';renderSnapshot();render()});
 renderSnapshot();
 const exportBtn=document.createElement('button');exportBtn.type='button';exportBtn.textContent='Zapisz bazę JSON';$('countyUReset').after(exportBtn);
 exportBtn.addEventListener('click',()=>{const blob=new Blob([JSON.stringify({meta:{exported:new Date().toISOString(),source:'GUS / BDL + lokalne dane użytkownika + dane początkowe, patrz pole zrodlo'},entries:asEntries()},null,2)],{type:'application/json'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='bezrobocie_powiaty_historia.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),500)});
 window.countyUnemploymentCapture=capture;window.countyUnemploymentSyncReport=syncReport;
 render(); // GitHub JSON ma priorytet; brak wczytywania danych z localStorage.
})();

