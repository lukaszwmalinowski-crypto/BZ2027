/* Struktura bezrobocia z urzędowych tabel PUP. Wszystkie liczby pochodzą z PANEL_DATA. */
(function(){
'use strict';
const db=window.PANEL_DATA.strukturaPup;
if(!db)return;
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names=Object.keys(window.PANEL_DATA.barometr.powiaty).sort((a,b)=>a.localeCompare(b,'pl'));
const byCounty=Object.fromEntries(names.map(n=>[n,db.obserwacje.filter(r=>r.powiat===n)]));
const monthly=Object.fromEntries(names.map(n=>[n,(db.miesieczne||[]).filter(r=>r.powiat===n)]));
const titles={wiek:'Wiek',wyksztalcenie:'Wykształcenie',staz:'Staż pracy',czas:'Czas pozostawania bez pracy'};
const fmt=(n,d=0)=>n==null?'—':Number(n).toLocaleString('pl-PL',{maximumFractionDigits:d,minimumFractionDigits:d});
const date=p=>p?`${p.slice(5)}.${p.slice(0,4)}`:'brak danych';
const periodEnd=p=>p?`${new Date(Number(p.slice(0,4)),Number(p.slice(5)),0).getDate()}.${p.slice(5)}.${p.slice(0,4)}`:'brak danych';
const validUrl=u=>{try{const a=new URL(u);return a.protocol==='https:'||a.protocol==='http:'?a.href:''}catch{return ''}};
const state={county:names.includes($('countySelect')?.value)?$('countySelect').value:'Tychy',period:'',group:'wiek',population:'all',unit:'count',trend:'total'};
const root=document.createElement('section');root.id='pupStructureModule';root.className='pupModule countyUPanel';
root.innerHTML=`<div class="pupHeading"><div><span class="eyeb">DANE POWIATOWYCH URZĘDÓW PRACY</span><h2>Struktura bezrobocia i historia zmian</h2><p>Wiek, wykształcenie, staż pracy i czas pozostawania bez pracy.</p></div><button type="button" id="pupPrint">Drukuj / PDF</button></div>
<div class="pupCoverageSummary" id="pupCoverageSummary"></div>
<div class="pupControls"><div><label for="pupCounty">Powiat / miasto</label><select id="pupCounty"></select></div><div><label for="pupPeriod">Stan na koniec miesiąca</label><select id="pupPeriod"></select></div><div><label for="pupPopulation">Grupa osób</label><select id="pupPopulation"><option value="all">Wszyscy bezrobotni</option><option value="women">Kobiety</option></select></div><div><label for="pupUnit">Wartości na wykresie</label><select id="pupUnit"><option value="count">Liczba osób</option><option value="share">Udział w grupie (%)</option></select></div></div>
<div id="pupStatus" class="pupStatus" role="status" aria-live="polite"></div><div class="pupKpis" id="pupKpis"></div>
<div class="pupGroupTabs" role="group" aria-label="Przekrój struktury">${Object.entries(titles).map(([k,v])=>`<button type="button" data-pup-group="${k}">${v}</button>`).join('')}</div>
<div class="pupGrid"><article class="pupCard"><h3 id="pupGroupTitle"></h3><div id="pupBars"></div><p class="pupCaption" id="pupDistributionCaption"></p></article><article class="pupCard"><div class="pupTrendHeading"><h3>Historia zmian</h3><label for="pupTrendMetric" class="pupSrOnly">Wskaźnik historii zmian</label><select id="pupTrendMetric"></select></div><div id="pupTrendChart"></div><p class="pupCaption">Punkty oznaczają dostępne obserwacje. Przerwy w szeregu nie są uzupełniane.</p></article></div>
<details class="pupDetails" id="pupAllTables"><summary>Wszystkie 25 tablic WUP — pełny zestaw wskaźników dla powiatu</summary><p class="pupCaption">Dane ze wszystkich tablic arkusza WUP, w tym dodatkowe podgrupy i przekroje. Nazwy kolumn mogą różnić się między latami.</p><label for="pupRawTableSelect">Wybierz tablicę</label><select id="pupRawTableSelect"></select><div class="pupTableScroll" id="pupRawNumbers"></div></details>
<div class="pupSource" id="pupSource"></div>
<details class="pupDetails"><summary>Dane liczbowe i pobieranie</summary><div class="pupActions"><button type="button" id="pupCsv">Pobierz historię powiatu (CSV)</button><button type="button" id="pupJson">Pobierz dane powiatu (JSON)</button></div><div class="pupTableScroll" id="pupNumbers"></div></details>
<details class="pupDetails"><summary>Dostępność danych dla 36 powiatów i miast</summary><p>Każdy powiat ma własny zakres okresów. Brak danych nie oznacza braku bezrobocia.</p><div class="pupTableScroll" id="pupCoverage"></div></details>
<details class="pupDetails"><summary>Dokumenty źródłowe właściwego PUP</summary><label for="pupSourceSearch">Szukaj w nazwie dokumentu (np. 2026)</label><input id="pupSourceSearch" type="search" placeholder="Rok, miesiąc lub nazwa dokumentu"/><p id="pupSourceScope"></p><div id="pupSourceList"></div><button type="button" id="pupSourceMore">Pokaż kolejne dokumenty</button></details><details class="pupDetails"><summary>Źródła i sposób odczytu</summary><p>Źródłem są tabele MRPiPS-01 (dział 5 i dział 1) oraz załącznik nr 1 do sprawozdania. Dla każdej struktury sprawdzono, czy sumy według wieku, wykształcenia, stażu i czasu bez pracy są równe ogółem. Tak samo sprawdzono zestawienia kobiet. Zestawienia gminne i nierozstrzygnięte sprzeczności pominięto.</p><p>Czas pozostawania bez pracy powyżej 12 miesięcy jest inną miarą niż ustawowa kategoria „długotrwale bezrobotni”. Kategorie wykształcenia zachowują łączny zakres tabel źródłowych.</p><p>Od czerwca 2025 r. zmieniły się zasady rejestracji i część kategorii sprawozdawczych. Porównania okresów wymagają uwzględnienia tej zmiany. Nie wyliczamy sumy wojewódzkiej z niepełnego zbioru powiatów.</p></details>`;
$('countyUnempModule').querySelector('.countyUWrap').appendChild(root);
// Keep documentation and coverage in the final Sources section.
const sourcePanel=document.createElement('section');sourcePanel.id='pupSourcesSection';sourcePanel.className='pupModule srcGroup';
sourcePanel.innerHTML='<h3>Dane PUP — źródła i dostępność</h3><div class="pupSourceCounty"><label for="pupSourceCounty">Powiat / miasto</label><select id="pupSourceCounty"></select></div>';
$('sourceRegistry').querySelector('.sourceRegistryContent').appendChild(sourcePanel);
sourcePanel.appendChild($('pupCoverageSummary'));
sourcePanel.appendChild($('pupSource'));
sourcePanel.appendChild($('pupCoverage').closest('details'));
sourcePanel.appendChild($('pupSourceSearch').closest('details'));
const method=Array.from(root.querySelectorAll('details')).find(d=>d.querySelector('summary')?.textContent==='Źródła i sposób odczytu');if(method)sourcePanel.appendChild(method);
const sourceJump=document.createElement('a');sourceJump.href='#pupSourcesSection';sourceJump.className='pupSourcesJump';sourceJump.textContent='Źródła i dostępność danych';root.appendChild(sourceJump);
sourceJump.addEventListener('click',e=>{e.preventDefault();$('sourceRegistry').open=true;sourcePanel.scrollIntoView({behavior:'smooth',block:'start'})});
$('pupSourceCounty').innerHTML=names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');
$('pupSourceCounty').addEventListener('change',e=>chooseCounty(e.target.value));

$('pupCounty').innerHTML=names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');
function periods(){return [...new Set([...byCounty[state.county],...monthly[state.county]].map(r=>r.okres))].sort().reverse()}
function resetPeriod(){const p=periods();state.period=p[0]||'';$('pupPeriod').innerHTML=p.length?p.map(p=>`<option value="${p}">${periodEnd(p)}</option>`).join(''):'<option value="">Brak danych</option>';$('pupPeriod').disabled=!p.length}
function records(){return {detail:byCounty[state.county].find(r=>r.okres===state.period),month:monthly[state.county].find(r=>r.okres===state.period)}}
function count(r){return state.population==='women'?(r?.kobiety??null):(r?.ogolem??r?.liczba_osob??null)}
function values(r){return r?.[state.group+(state.population==='women'?'Kobiety':'')]}
function render(){
 $('pupCounty').value=state.county;$('pupSourceCounty').value=state.county;$('pupPeriod').value=state.period;
 const {detail,month}=records(),r=detail||month,total=r?.ogolem??r?.liczba_osob,women=r?.kobiety,denom=count(r);
 const own=byCounty[state.county],all=periods();
 $('pupStatus').innerHTML=!r?`Brak odczytanych danych PUP dla jednostki: <b>${esc(state.county)}</b>.`:`<b>${esc(state.county)}</b> · stan na <b>${periodEnd(state.period)}</b> · ${detail?'pełna struktura bezrobocia':'liczba bezrobotnych; szczegółowa struktura niedostępna dla tego miesiąca'}.`;
 if(!detail&&own.length)$('pupStatus').innerHTML+=` <button type="button" id="pupLatestStructure">Pokaż ostatnią pełną strukturę (${date(own.at(-1).okres)})</button>`;
 $('pupLatestStructure')?.addEventListener('click',()=>{state.period=own.at(-1).okres;render()});
 const over=detail?detail.czas[4]+detail.czas[5]:null;
 $('pupKpis').innerHTML=[['Zarejestrowani bezrobotni',total,'osób'],['Kobiety',women,total>0?fmt(women/total*100,1)+'% ogółu':'osób'],['Mężczyźni',total!=null&&women!=null?total-women:null,'osób'],['Bez pracy ponad 12 miesięcy',over,detail&&total>0?fmt(over/total*100,1)+'% ogółu':'brak pełnej struktury']].map(([label,n,sub])=>`<div><span>${label}</span><strong>${fmt(n)}</strong><small>${sub}</small></div>`).join('');
 root.querySelectorAll('[data-pup-group]').forEach(b=>{const active=b.dataset.pupGroup===state.group;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 $('pupGroupTitle').textContent=titles[state.group]+(state.population==='women'?' — kobiety':'');
 const vals=values(detail);
 $('pupBars').innerHTML=vals?vals.map((v,i)=>{const share=denom>0?v/denom*100:0;return `<button type="button" class="pupBar" data-pup-index="${i}" aria-label="${esc(db.etykiety[state.group][i])}: ${fmt(v)} osób; ${fmt(share,1)} procent. Pokaż historię."><span>${esc(db.etykiety[state.group][i])}</span><span class="pupBarTrack"><i style="width:${share}%"></i></span><b>${state.unit==='share'?fmt(share,1)+'%':fmt(v)}</b></button>`}).join(''):'<p class="pupEmpty">Brak pełnej struktury dla wybranego powiatu i okresu.</p>';
 $('pupDistributionCaption').textContent=vals?`Razem: ${fmt(denom)} ${state.population==='women'?'kobiet':'osób'}. Udziały obliczone w wybranej grupie. Kliknij kategorię, aby zobaczyć jej historię.`:'';
 const opts=[['total','Bezrobotni ogółem'],...db.etykiety[state.group].map((l,i)=>[String(i),l])];
 if(!opts.some(([v])=>v===state.trend))state.trend='total';
 $('pupTrendMetric').innerHTML=opts.map(([v,l])=>`<option value="${v}">${esc(l)}</option>`).join('');$('pupTrendMetric').value=state.trend;
 trend();sources(r);table(detail);renderRawTables(detail);coverage();sourceLimit=20;catalogue();
 $('pupCsv').disabled=!all.length;$('pupJson').disabled=!all.length;$('pupPrint').disabled=!r;
 root.querySelectorAll('[data-pup-index]').forEach(b=>b.addEventListener('click',()=>{state.trend=b.dataset.pupIndex;render()}));
}
function sources(r){
 const u=validUrl(r?.zrodlo),doc=r?.dokument||'';
 $('pupSource').innerHTML=r?`<b>Źródło:</b> ${u?`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(doc||'Dokument PUP')} ↗</a>`:esc(doc)}${r.plikArchiwum?`<span>Plik w archiwum: ${esc(r.plikArchiwum)}</span>`:''}`:'Źródło pojawi się po wybraniu dostępnej obserwacji.';
}
function trend(){
 const points=state.trend==='total'?monthly[state.county].map(r=>({p:r.okres,v:count(r)})):byCounty[state.county].map(r=>({p:r.okres,v:values(r)?.[Number(state.trend)]??null}));
 if(!points.length){$('pupTrendChart').innerHTML='<p class="pupEmpty">Brak historii dla tego wskaźnika.</p>';return}
 const w=Math.max(280,Math.min(640,$('pupTrendChart').clientWidth||(window.innerWidth<1100?340:640))),narrow=w<480,h=240,l=narrow?48:58,t=20,r=narrow?29:38,b=43,max=Math.max(...points.map(x=>x.v||0),1)*1.12;
 const mi=p=>Number(p.slice(0,4))*12+Number(p.slice(5))-1,minX=mi(points[0].p),maxX=mi(points.at(-1).p),x=p=>l+(maxX===minX?(w-l-r)/2:(mi(p)-minX)/(maxX-minX)*(w-l-r)),y=v=>h-b-v/max*(h-b-t);
 let chart=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Historia liczby osób, ${esc(state.county)}, ${date(points[0].p)}–${date(points.at(-1).p)}"><title>Historia liczby osób. Dokładne wartości są w tabeli poniżej wykresu.</title>`;
 for(let i=0;i<=4;i++){const v=max*i/4,yy=y(v);chart+=`<line x1="${l}" x2="${w-r}" y1="${yy}" y2="${yy}" stroke="#dce6f0"/><text x="${l-9}" y="${yy+4}" text-anchor="end" fill="#526579" font-size="11">${fmt(v)}</text>`}
 let path='',last;
 points.forEach(p=>{if(p.v==null){last=null;return}const connected=last&&mi(p.p)-mi(last.p)<=1;path+=`${connected?'L':'M'}${x(p.p)},${y(p.v)} `;last=p});
 chart+=`<path d="${path}" fill="none" stroke="#416bbf" stroke-width="2.5"/>`;
 points.forEach((p,i)=>{if(p.v==null)return;chart+=`<circle cx="${x(p.p)}" cy="${y(p.v)}" r="${p.p===state.period?5:3}" fill="${p.p===state.period?'#b44e70':'#416bbf'}"><title>${date(p.p)}: ${fmt(p.v)} osób</title></circle>`;});
 // Etykiety osi: lata zamiast wszystkich miesiecy; minimalny odstep zapobiega kolizjom.
 const yearCandidates=[...new Set(points.map(p=>Number(p.p.slice(0,4))))].map(year=>{
  const candidate=points.find(p=>Number(p.p.slice(0,4))===year);
  return {label:String(year),position:x(candidate.p)};
 });
 const minGap=narrow?68:76,drawn=[];
 for(const item of yearCandidates){
  if(item.position<l+15||item.position>w-r-15)continue;
  if(drawn.some(prev=>Math.abs(prev-item.position)<minGap))continue;
  drawn.push(item.position);
  chart+=`<text x="${item.position}" y="${h-18}" text-anchor="middle" font-size="11" fill="#526579">${item.label}</text>`;
 }
 chart+='</svg>';
 const first=points[0],lastPoint=points.at(-1),diff=lastPoint.v-first.v;
 chart+=`<p class="pupTrendSummary">${date(first.p)}: <b>${fmt(first.v)}</b> → ${date(lastPoint.p)}: <b>${fmt(lastPoint.v)}</b>. Zmiana: <b>${diff>0?'+':''}${fmt(diff)} osób</b>.</p><details><summary>Tabela historii (${points.length} obserwacji)</summary><div class="pupTableScroll pupHistoryTable"><table><thead><tr><th>Okres</th><th>Liczba osób</th></tr></thead><tbody>${points.slice().reverse().map(p=>`<tr><th scope="row">${date(p.p)}</th><td>${fmt(p.v)}</td></tr>`).join('')}</tbody></table></div></details>`;
 $('pupTrendChart').innerHTML=chart;
}
function renderRawTables(detail){
 const tables=detail?.tabeleWup||[];
 const selector=$('pupRawTableSelect'),old=selector.value;
 selector.innerHTML=tables.length?tables.map(t=>`<option value="${t.nr}">Tablica ${t.nr} — ${esc(t.tytul)}</option>`).join(''):'<option value="">Brak kompletnych tablic dla tego okresu</option>';
 selector.disabled=!tables.length;
 selector.value=tables.some(t=>String(t.nr)===old)?old:(tables[0]?String(tables[0].nr):'');
 const renderOne=()=>{const t=tables.find(t=>String(t.nr)===selector.value);
 $('pupRawNumbers').innerHTML=!t?'<p class="pupEmpty">Brak zweryfikowanego pełnego zestawu tablic dla wybranego okresu. Historia liczby osób może być nadal dostępna.</p>':`<table><caption>${esc(state.county)} · ${periodEnd(state.period)} · Tablica ${t.nr}: ${esc(t.tytul)}</caption><thead><tr><th>Kolumna</th><th>Wskaźnik z tabeli WUP</th><th>Liczba osób</th></tr></thead><tbody>${t.wartosci.map(v=>`<tr><td>${v.kolumna}</td><td>${esc(v.etykieta)}</td><td>${fmt(v.wartosc)}</td></tr>`).join('')}</tbody></table>`;
 };
 selector.onchange=renderOne;renderOne();
}
function table(detail){
 if(!detail){$('pupNumbers').innerHTML='<p>Brak szczegółowej tabeli dla wybranego okresu. Eksport historii obejmuje dostępne obserwacje.</p>';return}
 const denom=count(detail);
 $('pupNumbers').innerHTML=`<table><caption>${esc(state.county)} — ${periodEnd(state.period)} — ${state.population==='women'?'kobiety':'wszyscy bezrobotni'}</caption><thead><tr><th>Przekrój</th><th>Kategoria</th><th>Liczba osób</th><th>Udział (%)</th></tr></thead><tbody>${Object.keys(titles).flatMap(g=>detail[g+(state.population==='women'?'Kobiety':'')].map((v,i)=>`<tr><th scope="row">${titles[g]}</th><td>${esc(db.etykiety[g][i])}</td><td>${fmt(v)}</td><td>${denom>0?fmt(v/denom*100,1):'—'}</td></tr>`)).join('')}</tbody></table>`;
}
function coverage(){
 const n=names.filter(n=>byCounty[n].length).length,nm=names.filter(n=>monthly[n].length).length;
 $('pupCoverageSummary').textContent=`Pełna struktura: ${n}/36 powiatów i miast · liczba bezrobotnych: ${nm}/36 · ${db.obserwacje.length.toLocaleString('pl-PL')} sprawdzonych zestawień struktury.`;
 $('pupCoverage').innerHTML=`<table><thead><tr><th>Powiat / miasto</th><th>Pełna struktura</th><th>Liczba bezrobotnych</th><th>Ostatni okres struktury</th></tr></thead><tbody>${names.map(n=>`<tr><th scope="row"><button type="button" data-pup-county="${esc(n)}">${esc(n)}</button></th><td>${byCounty[n].length?byCounty[n].length+' okresów':'Brak odczytanych danych'}</td><td>${monthly[n].length?monthly[n].length+' okresów':'Brak odczytanych danych'}</td><td>${date(byCounty[n].at(-1)?.okres)}</td></tr>`).join('')}</tbody></table>`;
 sourcePanel.querySelectorAll('[data-pup-county]').forEach(b=>b.addEventListener('click',()=>{chooseCounty(b.dataset.pupCounty);$('countyUnempModule').open=true;root.scrollIntoView({behavior:'smooth',block:'start'})}));
}
function countyData(){return {powiat:state.county,pobrano:db.meta.pobrano,etykiety:db.etykiety,struktura:byCounty[state.county],miesieczne:monthly[state.county]}}
function save(text,type,extension){const blob=new Blob([text],{type});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=`bezrobocie_${state.county.replace(/\s+/g,'_')}.${extension}`;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)}
$('pupCsv').addEventListener('click',()=>{const rows=[['powiat','okres','przekroj','kategoria','ogolem','kobiety','zrodlo']];monthly[state.county].forEach(r=>rows.push([r.powiat,r.okres,'ogolem','Bezrobotni',r.liczba_osob,r.kobiety,r.zrodlo]));byCounty[state.county].forEach(r=>Object.keys(titles).forEach(g=>r[g].forEach((v,i)=>rows.push([r.powiat,r.okres,g,db.etykiety[g][i],v,r[g+'Kobiety'][i],r.zrodlo]))));save('\ufeff'+rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n'),'text/csv;charset=utf-8','csv')});
$('pupJson').addEventListener('click',()=>save(JSON.stringify(countyData(),null,2),'application/json','json'));
$('pupPrint').addEventListener('click',()=>{const {detail,month}=records(),r=detail||month;if(!r)return;const win=window.open('','_blank');if(!win){$('pupStatus').textContent='Przeglądarka zablokowała okno wydruku. Zezwól na otwieranie okien dla tej strony.';return}const title=`Struktura bezrobocia — ${state.county} — ${periodEnd(state.period)}`;win.document.write(`<!doctype html><html lang="pl"><meta charset="utf-8"><title>${esc(title)}</title><style>body{font:11pt Arial;color:#203447;margin:28px}h1{font-size:23pt}table{border-collapse:collapse;width:100%;font-size:10pt}td,th{padding:7px;border-bottom:1px solid #d4dde6;text-align:left}caption{text-align:left;margin:12px 0}thead{display:table-header-group}tr{break-inside:avoid}a{overflow-wrap:anywhere}.pupKpis{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin:25px 0}.pupKpis span,.pupKpis small{display:block;font-size:9pt}.pupKpis strong{font-size:21pt}button{padding:10px 16px}@page{size:A4 landscape;margin:32mm 12mm 16mm}@media print{body{margin:0}.printButton{display:none}}${window.EXPORT_BRAND?.css||''}</style>${window.EXPORT_BRAND?.markup()||''}<button class="printButton" onclick="window.print()">Drukuj lub zapisz jako PDF</button><h1>${esc(title)}</h1><div class="pupKpis">${$('pupKpis').innerHTML}</div>${$('pupNumbers').innerHTML}<p>${$('pupSource').innerHTML}</p><p>Dane PUP. Stan na koniec miesiąca. Kategorie wykształcenia zgodne z łącznym zakresem formularza. Od czerwca 2025 r. zmieniły się zasady rejestracji.</p></html>`);win.document.close()});
function chooseCounty(name){const main=$('countySelect');if(main&&main.value!==name){main.value=name;main.dispatchEvent(new Event('change',{bubbles:true}))}else{state.county=name;resetPeriod();render()}}
$('pupCounty').addEventListener('change',e=>chooseCounty(e.target.value));
$('pupPeriod').addEventListener('change',e=>{state.period=e.target.value;render()});
$('pupPopulation').addEventListener('change',e=>{state.population=e.target.value;render()});
$('pupUnit').addEventListener('change',e=>{state.unit=e.target.value;render()});
$('pupTrendMetric').addEventListener('change',e=>{state.trend=e.target.value;trend()});
root.querySelectorAll('[data-pup-group]').forEach(b=>b.addEventListener('click',()=>{state.group=b.dataset.pupGroup;state.trend='total';render()}));
document.addEventListener('panel:county-change',e=>{if(names.includes(e.detail?.name)){state.county=e.detail.name;resetPeriod();render()}});
$('countyUCounty').addEventListener('change',e=>{if(names.includes(e.target.value)){state.county=e.target.value;resetPeriod();render()}});
let sourceLimit=20;
function catalogue(){
 const office=db.urzedy?.find(o=>o.powiaty.includes(state.county));
 const search=($('pupSourceSearch').value||'').toLocaleLowerCase('pl');
 const docs=(db.dokumenty||[]).filter(d=>d.pup===office?.id&&d.nazwa.toLocaleLowerCase('pl').includes(search));
 $('pupSourceScope').textContent=office?`PUP: ${office.nazwa}. Obszar obsługi: ${office.powiaty.join(', ')}. Dokumenty mogą dotyczyć całego obszaru PUP albo wskazanych w tytule powiatów lub gmin. Znaleziono: ${docs.length}.`: 'Brak przypisanego źródła.';
 $('pupSourceList').innerHTML=docs.length?'<ul>'+docs.slice(0,sourceLimit).map(d=>`<li><a href="${esc(validUrl(d.url))}" target="_blank" rel="noopener noreferrer">${esc(d.nazwa.replace(/^Załącznik\s+/,''))}</a></li>`).join('')+'</ul>':'<p>Nie pozyskano dokumentów spełniających ten wybór.</p>';
 $('pupSourceMore').hidden=docs.length<=sourceLimit;
}
$('pupSourceSearch').addEventListener('input',()=>{sourceLimit=20;catalogue()});
$('pupSourceMore').addEventListener('click',()=>{sourceLimit+=30;catalogue()});
const jump=document.createElement('button');jump.id='pupGoToStructure';jump.type='button';jump.textContent='Przejdź do danych PUP i struktury bezrobocia';jump.className='pupJump';$('countyTitle').insertAdjacentElement('afterend',jump);jump.addEventListener('click',()=>{$('countyUnempModule').open=true;root.scrollIntoView({behavior:'smooth',block:'start'})});
resetPeriod();render();
window.addEventListener('resize',()=>{if(root.getClientRects().length)trend()});
window.PUP_MODULE={state,render,countyData};
})();
