// Original WUP letterheads, embedded for offline exports.
const exportBrandAssets=JSON.parse(document.getElementById('exportBrandAssets').textContent);
const exportBrandCss=`
.brandPrintHeader,.brandPrintFooter{display:none}
@media print{
 @page{size:A4 landscape;margin:32mm 12mm 16mm}
 .brandPrintHeader,.brandPrintFooter{display:block!important;position:fixed;left:-12mm;width:297mm;overflow:hidden;z-index:1000;pointer-events:none;background:white}
 .brandPrintHeader{top:-32mm;height:27.6mm}.brandPrintFooter{bottom:-16mm;height:10mm}
 .brandPrintHeader img,.brandPrintFooter img{position:absolute;width:297mm!important;max-width:none!important;height:auto!important;left:0}
 .brandPrintHeader img{top:0}.brandPrintFooter img{bottom:0}
 body.brandPrint{margin:0!important;background:white!important}
 body.brandPrint .studioContent,body.brandPrint .pdfStamp{display:none!important}
 body.brandPrint #printReport{display:block!important;background:white!important}
 body.brandPrint #printReport>.pdfPage{height:auto!important;min-height:0!important;padding:0!important;background:white!important}
 body.brandPrint #printReport>.pdfPage:first-child{display:block!important;height:auto!important}
 body.brandPrint #printReport>.pdfPage:first-child .pdfGrid2{display:flex!important;align-items:flex-start!important;gap:3mm!important}
 body.brandPrint #printReport>.pdfPage:first-child .pdfGrid2>.pdfBox{width:49%!important;flex:1!important}
 body.brandPrint #printReport>.pdfPage:first-child .pdfMap .mapCanvas{display:block!important;height:82mm!important;min-height:82mm!important;flex:none!important}
 body.brandPrint #printReport>.pdfPage:first-child .pdfBox,body.brandPrint #printReport>.pdfPage:first-child .pdfMap,body.brandPrint #printReport>.pdfPage:first-child .mapCanvas{height:auto!important;min-height:0!important}
 body.brandPrint #printReport>.pdfPage:first-child .pdfMap svg{height:82mm!important;max-height:82mm!important;transform:none!important}
 body.brandPrint #printReport>.pdfPage.exportChartPage{display:block!important}
 body.brandPrint #printReport .exportChartImage{height:78mm!important;margin:2mm auto 3mm!important}
 body.brandPrint #printReport .exportChartSubtitle{margin-bottom:3mm!important}
 body.brandPrint #printReport .exportChartNote,body.brandPrint #printReport .exportChartInsight,body.brandPrint #printReport .exportChartSource{margin-top:2mm!important;font-size:8pt!important}
 body.brandPrint #printReport .pdfHeader{margin-bottom:3mm!important;padding-bottom:3mm!important}
 body.brandPrint #printReport .pdfTrend svg{height:43mm!important}
}
`;
const exportBrandStyle=document.createElement('style');exportBrandStyle.id='exportBrandStyle';exportBrandStyle.textContent=exportBrandCss;document.head.append(exportBrandStyle);
window.EXPORT_BRAND={
 get data(){return exportBrandAssets.blue},
 css:exportBrandCss,
 markup(){return '<div class="brandPrintHeader"><img alt="Wojewódzki Urząd Pracy w Katowicach" src="'+this.data+'"></div><div class="brandPrintFooter"><img alt="Dane kontaktowe WUP Katowice" src="'+this.data+'"></div>'},
 prepare(){document.body.classList.add('brandPrint');document.querySelectorAll('body>.brandPrintHeader,body>.brandPrintFooter').forEach(e=>e.remove());document.body.insertAdjacentHTML('beforeend',this.markup())}
};
window.addEventListener('afterprint',()=>{document.body.classList.remove('brandPrint');document.querySelectorAll('body>.brandPrintHeader,body>.brandPrintFooter').forEach(e=>e.remove())});

const HIST_SHARE_2023 = window.PANEL_DATA.barometr.histShare2023;
const DATA = window.PANEL_DATA.barometr.powiaty;
const HIST_DATA = window.PANEL_DATA.barometr.trendHistoryczne;
const TOP_OCC = window.PANEL_DATA.barometr.rankingZawodow;
const VOIV_UNEMPLOYMENT = window.PANEL_DATA.barometr.stopaWojewodztwa;
const UNIT_COUNT = Object.keys(DATA).length;
const AVG = {
  deficit:Object.values(DATA).reduce((a,d)=>a+d.deficit,0)/UNIT_COUNT,
  balance:Object.values(DATA).reduce((a,d)=>a+d.balance,0)/UNIT_COUNT,
  surplus:Object.values(DATA).reduce((a,d)=>a+d.surplus,0)/UNIT_COUNT,
  no_eval:Object.values(DATA).reduce((a,d)=>a+d.no_eval,0)/UNIT_COUNT
};
function pl1(v){return v.toFixed(1).replace('.',',');}
function benchmarkHtml(value, avg, inverse=false){
  const diff=Math.round((value-avg)*10)/10;
  const cls=Math.abs(diff)<0.05?'neutral':((inverse?diff<0:diff>0)?'good':'bad');
  const sign=diff>0?'+':'';
  return `<span class="benchmark ${cls}">śr. woj.: ${pl1(avg)} • ${sign}${pl1(diff)} od średniej</span>`;
}
const UNEMPLOYMENT = window.PANEL_DATA.barometr.stopaPowiatow;
const OVERALL = window.PANEL_DATA.barometr.podsumowanie;
const OCC_DATA = window.PANEL_DATA.barometr.zawody;
const OCC_STATUS = {DD:{label:"Duży deficyt",color:"#8f2634"},D:{label:"Deficyt",color:"#d95c64"},R:{label:"Równowaga",color:"#56a47d"},N:{label:"Nadwyżka",color:"#537db7"},X:{label:"Bez oceny",color:"#cbd4de"}};
let selectedOccupation="";
const EMBEDDED_PATHS = window.PANEL_DATA.barometr.geometriaMapy;
const WANTED = Object.keys(DATA);
const normalize = s => (s||"").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").replace(/^powiat\s+/,"").trim();

document.getElementById("k-counties").textContent=OVERALL.counties;
document.getElementById("k-occ").textContent=OVERALL.occupations;
document.getElementById("k-def").textContent=OVERALL.deficit_marks.toLocaleString("pl-PL");
document.getElementById("k-bal").textContent=OVERALL.balance_marks.toLocaleString("pl-PL");
document.getElementById("k-sur").textContent=OVERALL.surplus_marks.toLocaleString("pl-PL");

const select=document.getElementById("countySelect");
select.innerHTML='<option value="__WOJ__">Województwo śląskie - średnie</option>'+WANTED.slice().sort((a,b)=>a.localeCompare(b,"pl")).map(n=>`<option>${n}</option>`).join("");
const occupationSelect=document.getElementById("occupationSelect");
occupationSelect.innerHTML='<option value="">Wybierz zawód z listy…</option>'+Object.keys(OCC_DATA).map(n=>`<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join("");
occupationSelect.addEventListener("change",()=>setOccupation(occupationSelect.value));
document.getElementById("occupationClear").addEventListener("click",()=>{setOccupation(""); if(active) selectCounty(active); else selectProvinceOverview();});
select.addEventListener("change",()=>{if(select.value==="__WOJ__") selectProvinceOverview(); else selectCounty(select.value);});

let mode="delta", active="", jobStatusFilter="D", svg=document.getElementById("map"), tooltip=document.getElementById("tooltip");
let mapFeatures=[];

function deltaHtml(v){
  const sign=v>0?"+":"";
  const cls=v>0?"up":v<0?"down":"neutral";
  return `<span class="${cls}">${sign}${v} vs 2026</span>`;
}
function avgDelta(field){
  const vals=Object.values(DATA).map(d=>Number(d[field])).filter(Number.isFinite);
  return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;
}
function selectProvinceOverview(){
  active="";
  select.value="__WOJ__";
  document.querySelectorAll('#map .county').forEach(el=>el.classList.remove('selected'));
  svg.querySelectorAll('.selectionOutline').forEach(x=>x.remove());
  const total=AVG.deficit+AVG.balance+AVG.surplus+AVG.no_eval;
  document.getElementById('countyTitle').textContent='Województwo śląskie';
  document.getElementById('countyHint').textContent='Widok startowy - średnie dla 36 powiatów i miast na prawach powiatu.';
  document.getElementById('m-def').textContent=pl1(AVG.deficit);
  document.getElementById('m-bal').textContent=pl1(AVG.balance);
  document.getElementById('m-sur').textContent=pl1(AVG.surplus);
  document.getElementById('m-no').textContent=pl1(AVG.no_eval);
  document.getElementById('m-unemp').textContent=pl1(VOIV_UNEMPLOYMENT)+'%';
  [['def','delta_deficit'],['bal','delta_balance'],['sur','delta_surplus'],['no','delta_no_eval']].forEach(([id,k])=>{
    const v=avgDelta(k), el=document.getElementById('d-'+id); el.className='delta neutral';
    el.innerHTML=`<span class="neutral">średnia zmiana: ${v>0?'+':''}${pl1(v)} vs 2026</span>`;
  });
  const ud=document.getElementById('d-unemp'); ud.className='delta neutral'; ud.textContent='oficjalny wskaźnik wojewódzki';
  document.getElementById('v-context-name').textContent='Województwo śląskie';
  [['def','deficit'],['bal','balance'],['sur','surplus'],['no','no_eval']].forEach(([id,k])=>{
    document.getElementById('v-'+id).textContent=pl1(AVG[k]);
    const el=document.getElementById('vc-'+id); el.className='vCompare neutral'; el.innerHTML='<span class="vDelta">wartość wojewódzka</span><span class="vHint">Średnia dla 36 jednostek</span>';
  });
  document.getElementById('v-unemp').textContent=pl1(VOIV_UNEMPLOYMENT)+'%';
  const ucmp=document.getElementById('vc-unemp'); ucmp.className='vCompare neutral'; ucmp.innerHTML='<span class="vDelta">wskaźnik wojewódzki</span><span class="vHint">stan na 31.08.2026 r.</span>';
  const struct=[['Deficyt',AVG.deficit,'#c74d56'],['Równowaga',AVG.balance,'#3b8f75'],['Nadwyżka',AVG.surplus,'#d59a32'],['Bez oceny',AVG.no_eval,'#98a6b5']];
  document.getElementById('structure').innerHTML=struct.map(([n,v,c])=>`<div class="barRow"><span>${n}</span><div class="barTrack"><div class="barFill" style="width:${v/total*100}%;background:${c}"></div></div><b>${pl1(v)}</b></div>`).join('');
  const dd=avgDelta('delta_deficit');
  const sDef=document.getElementById('sig-def'); sDef.className='mapSignal neutral'; document.getElementById('sig-def-v').textContent=(dd>0?'+':'')+pl1(dd); document.getElementById('sig-def-h').textContent='średnia zmiana liczby grup deficytowych vs 2026';
  const sU=document.getElementById('sig-unemp'); sU.className='mapSignal neutral'; document.getElementById('sig-unemp-v').textContent=pl1(VOIV_UNEMPLOYMENT)+'%'; document.getElementById('sig-unemp-h').textContent='stan na 31.08.2026 r.';
  document.getElementById('sig-bal-v').textContent=pl1(AVG.balance/total*100)+'%'; document.getElementById('sig-bal-h').textContent=`średnio ${pl1(AVG.balance)} z ${pl1(total)} grup w równowadze`;
  document.getElementById('jobs').innerHTML='<div class="hint">Wybierz konkretny powiat, aby zobaczyć listę zawodów według statusu.</div>';
  document.getElementById('comments').innerHTML='<div class="hint">Komentarze jakościowe są dostępne po wybraniu konkretnego powiatu.</div>';
  renderProvinceTrend();
  renderProvinceSignals();
  updateMapLabels();
  syncUrlState();
}
function renderProvinceSignals(){
  const box=document.getElementById('analyticSignals'); if(!box) return;
  const total=AVG.deficit+AVG.balance+AVG.surplus+AVG.no_eval, share=100*AVG.balance/total;
  const p24=avgPoint(2024,'deficit'), p27=avgPoint(2027,'deficit'), ch=p27-p24;
  box.innerHTML=[
    {c:ch<0?'good':ch>0?'bad':'neutral',t:`Średni deficyt ${ch<0?'spadł':ch>0?'wzrósł':'nie zmienił się'} od 2024 r.`,d:`${pl1(p24)} → ${pl1(p27)} grup.`},
    {c:share>=85?'good':'info',t:`${pl1(share)}% grup średnio w równowadze`,d:`Średnio ${pl1(AVG.balance)} z ${pl1(total)} grup w 2027 r.`},
    {c:'neutral',t:`Stopa bezrobocia ${pl1(VOIV_UNEMPLOYMENT)}%`,d:'Stan na 31.08.2026 r. - oficjalny wskaźnik dla województwa śląskiego.'},
    {c:'info',t:`Średnio ${pl1(AVG.deficit)} grup deficytowych`,d:'Średnia dla 36 powiatów i miast na prawach powiatu.'}
  ].map(s=>`<div class="analyticSignal ${s.c}"><b>${s.t}</b><span>${s.d}</span></div>`).join('');
  const pill=document.getElementById('signalCounty'); if(pill) pill.textContent='Województwo śląskie';
}
function renderProvinceTrend(){
  const years=[2024,2025,2026,2027];
  const totals=years.map(y=>trendPoint(WANTED[0],y).total);
  const counts=years.map(y=>avgPoint(y,trendMetric));
  const vals=trendMode==='share'?counts.map((v,i)=>pct(v,totals[i])):counts;
  let min=Math.min(...vals), max=Math.max(...vals), range=Math.max(max-min,trendMode==='share'?5:4), pad=range*.2;
  min=Math.max(0,min-pad); max=max+pad;
  const W=Math.max(300,document.getElementById('trendChart').clientWidth||760),H=window.innerWidth<768?250:290,L=48,R=76,T=28,B=42,x=i=>L+i*(W-L-R)/3,y=v=>H-B-(v-min)/(max-min||1)*(H-T-B),colors=TREND_COLORS[trendMetric]||TREND_COLORS.deficit;
  let svg=`<rect x="0" y="0" width="${W}" height="${H}" rx="15" fill="transparent"/>`;
  for(let i=0;i<=4;i++){const val=min+(max-min)*i/4,yy=y(val),lab=trendMode==='share'?`${Math.round(val)}%`:pl1(val);svg+=`<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}" stroke="#e9eef4"/><text x="${L-11}" y="${yy+4}" text-anchor="end" fill="#8291a2" font-size="10.5">${lab}</text>`;}
  years.forEach((yr,i)=>svg+=`<text x="${x(i)}" y="${H-18}" text-anchor="middle" fill="#607286" font-size="12" font-weight="800">${yr}</text>`);
  if(trendChartType==='bar'){
    vals.forEach((v,i)=>{const top=y(v),bottom=y(min),height=Math.max(2,bottom-top);svg+=`<rect x="${x(i)-23}" y="${top}" width="46" height="${height}" rx="5" fill="${colors.main}" data-trend-point="1" data-year="${years[i]}" data-value="${pl1(v)}" data-area="Średnia wojewódzka"/>`;});
  }else{
    svg+=`<path d="${vals.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="${colors.main}" stroke-width="4.5"/>`;
    vals.forEach((v,i)=>svg+=`<circle cx="${x(i)}" cy="${y(v)}" r="8" fill="${colors.main}" stroke="#fff" stroke-width="2.5" data-trend-point="1" data-year="${years[i]}" data-value="${pl1(v)}" data-area="Średnia wojewódzka"/>`);
  }
  document.getElementById('trendChart').setAttribute('viewBox',`0 0 ${W} ${H}`);
  document.getElementById('trendChart').innerHTML=svg;
  document.getElementById('trendSubtitle').textContent=`Województwo śląskie • średnia 36 jednostek • ${trendMode==='share'?'udział procentowy':'liczba grup zawodów'}`;
  document.getElementById('trendCountyLegend').textContent='Średnia wojewódzka';
  document.querySelector('.trendLegend span:nth-child(2)').style.display='none';
  document.getElementById('trendMetricLabel').textContent=TREND_LABELS[trendMetric];
  document.getElementById('trendMetricLabel').style.color=colors.dark;
  const diff=vals[3]-vals[0]; document.getElementById('trendHeadline').textContent=`${diff>0?'+':''}${trendMode==='share'?pl1(diff)+' p.p.':pl1(diff)}`; document.getElementById('trendHeadline').style.color=colors.main;
  document.getElementById('trendHeadlineDesc').textContent=`zmiana średniej: 2024 → 2027 (${pl1(vals[0])}${trendMode==='share'?'%':''} → ${pl1(vals[3])}${trendMode==='share'?'%':''})`;
  document.getElementById('trendInsight').textContent=`Średnia wojewódzka dla kategorii „${TREND_LABELS[trendMetric].toLowerCase()}” ${diff<0?'spadła':diff>0?'wzrosła':'pozostała bez zmian'} między 2024 a 2027 r.`;
  document.getElementById('trendYears').innerHTML=years.map((yr,i)=>`<div class="yearCard" style="border-top-color:${colors.main}"><div class="year">${yr}</div><div class="yearValue" style="color:${colors.main}">${trendMode==='share'?pl1(vals[i])+'%':pl1(vals[i])}</div><div class="yearPct">${trendMode==='share'?pl1(counts[i])+' grup średnio':pl1(pct(counts[i],totals[i]))+'% wszystkich grup'}</div><div class="yearAvg">średnia wojewódzka</div></div>`).join('');
}
function selectCounty(name){
  if(!name || !DATA[name]) return;
  const avgLegend=document.querySelector('.trendLegend span:nth-child(2)'); if(avgLegend) avgLegend.style.display='flex';
  active=name; select.value=name;
  document.dispatchEvent(new CustomEvent('panel:county-change',{detail:{name}}));
  let selectedPath=null;
  document.querySelectorAll("#map .county").forEach(el=>{
    const isSelected=el.dataset.name===name;
    el.classList.toggle("selected",isSelected);
    if(isSelected) selectedPath=el;
  });
  // Draw a separate outline clone instead of reordering the actual county path.
  // This preserves choropleth fills while keeping the full selected border visible.
  svg.querySelectorAll('.selectionOutline').forEach(x=>x.remove());
  if(selectedPath){
    const outline=document.createElementNS("http://www.w3.org/2000/svg","path");
    outline.setAttribute('d',selectedPath.getAttribute('d'));
    outline.setAttribute('fill','none');
    outline.setAttribute('stroke','#07192d');
    outline.setAttribute('stroke-width','4.2');
    outline.setAttribute('stroke-linejoin','round');
    outline.setAttribute('stroke-linecap','round');
    outline.setAttribute('vector-effect','non-scaling-stroke');
    outline.setAttribute('pointer-events','none');
    outline.classList.add('selectionOutline');
    const firstLabel=svg.querySelector('.mapLabel');
    if(firstLabel) svg.insertBefore(outline,firstLabel); else svg.appendChild(outline);
  }
  updateMapLabels();
  const d=DATA[name];
  document.getElementById("countyTitle").textContent=name;
  document.getElementById("countyHint").textContent=`Profil powiatu, benchmark wojewódzki, lista zawodów i komentarze jakościowe.`;
  const u=UNEMPLOYMENT[name];
  document.getElementById("m-unemp").textContent=(u ?? "-")+((u ?? null)!==null?"%":"");
  const ud=document.getElementById("d-unemp");
  ud.className="delta neutral";
  ud.textContent="stan na 31.08.2026 r.";
  [["def","deficit","delta_deficit"],["bal","balance","delta_balance"],["sur","surplus","delta_surplus"],["no","no_eval","delta_no_eval"]].forEach(([id,k,dk])=>{
    document.getElementById("m-"+id).textContent=d[k];
    document.getElementById("d-"+id).innerHTML=deltaHtml(d[dk]);
  });
  document.getElementById("v-context-name").textContent=name;
  const refItems=[["def","deficit",false],["bal","balance",false],["sur","surplus",true],["no","no_eval",true]];
  refItems.forEach(([id,k,inverse])=>{
    const avg=AVG[k], diff=Math.round((d[k]-avg)*10)/10;
    document.getElementById("v-"+id).textContent=pl1(avg);
    const el=document.getElementById("vc-"+id);
    const cls=Math.abs(diff)<0.05?'neutral':((inverse?diff<0:diff>0)?'good':'bad');
    el.className='vCompare '+cls;
    const label = Math.abs(diff)<0.05 ? 'na poziomie średniej' : (diff>0?'+':'')+pl1(diff);
    const hint = Math.abs(diff)<0.05 ? 'Odchylenie powiatu względem średniej wojewódzkiej' : 'Odchylenie powiatu względem średniej wojewódzkiej';
    el.innerHTML=`<span class="vDelta">${label}</span><span class="vHint">${hint}</span>`;
  });
  document.getElementById("v-unemp").textContent=pl1(VOIV_UNEMPLOYMENT)+"%";
  const ucmp=document.getElementById("vc-unemp");
  if(u==null){ucmp.className='vCompare neutral';ucmp.innerHTML=`<span class="vDelta">brak danych</span><span class="vHint">Brak danych dla wybranego powiatu</span>`;}
  else {
    const udiff=Math.round((u-VOIV_UNEMPLOYMENT)*10)/10;
    ucmp.className='vCompare '+(udiff>0?'bad':udiff<0?'good':'neutral');
    const label = Math.abs(udiff)<0.05 ? 'na poziomie woj.' : `${udiff>0?'+':''}${pl1(udiff)} p.p.`;
    ucmp.innerHTML=`<span class="vDelta">${label}</span><span class="vHint">Różnica powiatu względem wskaźnika wojewódzkiego</span>`;
  }
  const struct=[
    ["Deficyt",d.deficit,"#c74d56"],["Równowaga",d.balance,"#3b8f75"],["Nadwyżka",d.surplus,"#d59a32"],["Bez oceny",d.no_eval,"#98a6b5"]
  ];
  document.getElementById("structure").innerHTML=struct.map(([n,v,c])=>`<div class="barRow"><span>${n}</span><div class="barTrack"><div class="barFill" style="width:${v/d.total*100}%;background:${c}"></div></div><b>${v}</b></div>`).join("");
  const sDef=document.getElementById('sig-def'), sDefV=document.getElementById('sig-def-v'), sDefH=document.getElementById('sig-def-h');
  const dd=d.delta_deficit||0; sDef.className='mapSignal '+(dd>0?'bad':dd<0?'good':'neutral'); sDefV.textContent=(dd>0?'+':'')+dd; sDefH.textContent=dd===0?'bez zmiany względem 2026':(dd>0?'więcej grup deficytowych niż w 2026':'mniej grup deficytowych niż w 2026');
  const sU=document.getElementById('sig-unemp'), sUV=document.getElementById('sig-unemp-v'), sUH=document.getElementById('sig-unemp-h');
  if(u==null){sU.className='mapSignal neutral';sUV.textContent='-';sUH.textContent='brak danych o stopie bezrobocia';}
  else{const du=Math.round((u-VOIV_UNEMPLOYMENT)*10)/10;sU.className='mapSignal '+(du>0?'bad':du<0?'good':'neutral');sUV.textContent=(du>0?'+':'')+pl1(du)+' p.p.';sUH.textContent=du===0?'na poziomie województwa':(du>0?'powyżej wskaźnika wojewódzkiego':'poniżej wskaźnika wojewódzkiego');}
  const share=d.total?d.balance/d.total*100:0; document.getElementById('sig-bal-v').textContent=pl1(share)+'%'; document.getElementById('sig-bal-h').textContent=`${d.balance} z ${d.total} grup zawodów w równowadze`;
  jobsExpanded=false;
  renderCountyJobs(name);
  const comments=d.comments||[];
  document.getElementById("comments").innerHTML=comments.length?comments.slice(0,2).map(c=>`<div class="comment">${escapeHtml(c)}</div>`).join(""):'<div class="hint">Brak komentarzy jakościowych w bazie dla tej jednostki.</div>';
  renderTrend(name);
  
  renderAnalyticSignals(name);
  syncUrlState();
}
function countyJobsByStatus(county,status){
  const idx=WANTED.indexOf(county); if(idx<0) return [];
  return Object.entries(OCC_DATA).filter(([name,rec])=>rec.s[idx]===status).map(([name,rec])=>({name,branch:rec.branch||"-",code:rec.code||"-"})).sort((a,b)=>a.name.localeCompare(b.name,"pl"));
}
let jobsExpanded=false;
const JOBS_PREVIEW=8;
function renderCountyJobs(county){
  document.querySelectorAll(".jobStatusTab").forEach(b=>b.classList.toggle("active",b.dataset.status===jobStatusFilter));
  const labels={D:"Deficyt",R:"Równowaga",N:"Nadwyżka",X:"Bez oceny"};
  const jobs=countyJobsByStatus(county,jobStatusFilter);
  const box=document.getElementById("jobs");
  if(!jobs.length){
    box.innerHTML=`<div class="hint">Brak zawodów w kategorii „${labels[jobStatusFilter]}” dla tej jednostki.</div>`;
    return;
  }
  const previewLimit=window.innerWidth<768?4:window.innerWidth<1100?6:JOBS_PREVIEW;
  const visible=jobsExpanded?jobs:jobs.slice(0,previewLimit);
  const rows=visible.map(j=>`<div class="job clickable" data-occ="${escapeHtml(j.name)}" title="Pokaż sytuację tego zawodu na mapie"><span>${escapeHtml(j.name)}</span><span class="rel status-${jobStatusFilter}"><span class="statusBadge">${labels[jobStatusFilter]}</span><span class="branchBadge">${escapeHtml(j.branch)}</span></span></div>`).join("");
  const footer=jobs.length>previewLimit?`<div class="jobsFooter"><span class="jobsCount">${jobsExpanded?jobs.length:Math.min(previewLimit,jobs.length)} z ${jobs.length} zawodów</span><button type="button" class="jobsToggle" id="jobsToggle">${jobsExpanded?'Zwiń listę':'Pokaż wszystkie'}</button></div>`:`<div class="jobsFooter"><span class="jobsCount">${jobs.length} ${jobs.length===1?'zawód':'zawodów'}</span></div>`;
  box.innerHTML=`<div class="jobsViewport ${jobsExpanded?'expanded':''}"><div class="jobs">${rows}</div></div>${footer}`;
  box.querySelectorAll(".job.clickable").forEach(el=>el.addEventListener("click",()=>setOccupation(el.dataset.occ)));
  const toggle=box.querySelector("#jobsToggle");
  if(toggle) toggle.addEventListener("click",()=>{jobsExpanded=!jobsExpanded;renderCountyJobs(county);});
}
document.querySelectorAll(".jobStatusTab").forEach(b=>b.addEventListener("click",()=>{jobStatusFilter=b.dataset.status;jobsExpanded=false;if(active) renderCountyJobs(active);}));
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}


let trendMetric="deficit";
let trendMode="count";
let trendChartType="line";
const TREND_LABELS={deficit:"Deficyt",balance:"Równowaga",surplus:"Nadwyżka",no_eval:"Bez oceny"};
const TREND_AVG_COLOR="#bca4d9";
const TREND_AVG_DARK="#79639f";
const TREND_COLORS={
  deficit:{main:"#d94e62",soft:"#fff0f2",avg:"#eaa0aa",dark:"#a82f43"},
  balance:{main:"#168d84",soft:"#e7f6f4",avg:"#80c1b7",dark:"#11675f"},
  surplus:{main:"#4a62c4",soft:"#eef1ff",avg:"#91a3e3",dark:"#2f479f"},
  no_eval:{main:"#697a96",soft:"#f1f4fa",avg:"#a8b6c9",dark:"#44536c"}
};

function trendPoint(name,year){
  const d=DATA[name];
  if(year===2024 || year===2025) return HIST_DATA[name]?.[String(year)] || null;
  if(year===2026) return {deficit:d.prev_deficit,balance:d.prev_balance,surplus:d.prev_surplus,no_eval:d.prev_no_eval,total:168};
  return {deficit:d.deficit,balance:d.balance,surplus:d.surplus,no_eval:d.no_eval,total:d.total};
}
function avgPoint(year,metric){
  const names=Object.keys(DATA);
  const vals=names.map(n=>trendPoint(n,year)?.[metric]).filter(v=>Number.isFinite(v));
  return vals.reduce((a,b)=>a+b,0)/vals.length;
}
function pct(v,total){return total?100*v/total:0}
function signed(v,digits=1){const x=Number(v); return `${x>0?"+":""}${x.toFixed(digits).replace(".",",")}`}
function trendInterpretation(name,metric,pts,avgs){
  const raw=pts.map(p=>p[metric]);
  const vals=trendMode==='share'?pts.map(p=>pct(p[metric],p.total)):raw;
  const avgVals=trendMode==='share'?avgs.map((a,i)=>pct(a,pts[i].total)):avgs;
  const first=vals[0], last=vals[3], diff=last-first;
  const dAvg=last-avgVals[3];
  const rel=dAvg>0?"powyżej":dAvg<0?"poniżej":"na poziomie";
  const unit=trendMode==='share'?" p.p.":"";
  let firstSentence='';
  if(Math.abs(diff)<0.05){
    firstSentence=`W latach 2024–2027 wartość dla kategorii „${TREND_LABELS[metric].toLowerCase()}” pozostała bez zmian.`;
  }else{
    const dir=diff>0?"wzrosła":"spadła";
    firstSentence=`W latach 2024–2027 wartość dla kategorii „${TREND_LABELS[metric].toLowerCase()}” ${dir} o ${pl1(Math.abs(diff))}${unit}.`;
  }
  return `${firstSentence} W 2027 r. ${name} znajduje się ${rel} średniej wojewódzkiej.`;
}
function renderTrend(name){
  if(!name || !DATA[name]) return;
  const years=[2024,2025,2026,2027];
  const pts=years.map(y=>trendPoint(name,y));
  const avgCounts=years.map(y=>avgPoint(y,trendMetric));
  const countVals=pts.map(p=>p[trendMetric]);
  const vals=trendMode==='share'?pts.map(p=>pct(p[trendMetric],p.total)):countVals;
  const avgs=trendMode==='share'?avgCounts.map((v,i)=>pct(v,pts[i].total)):avgCounts;
  const all=vals.concat(avgs);
  let min=Math.min(...all), max=Math.max(...all);
  const range=Math.max(max-min, trendMode==='share'?5:4);
  const pad=range*.18;
  min=Math.max(0,min-pad); max=max+pad;
  if(trendMode==='share'){min=Math.max(0,Math.floor(min/5)*5);max=Math.min(100,Math.ceil(max/5)*5||5)}
  else {min=Math.max(0,Math.floor(min));max=Math.ceil(max)}
  const W=Math.max(300,document.getElementById('trendChart').clientWidth||760),H=window.innerWidth<768?250:290,L=48,R=76,T=28,B=42;
  const x=i=>L+i*(W-L-R)/3;
  const y=v=>H-B-(v-min)/(max-min||1)*(H-T-B);
  const colors=TREND_COLORS[trendMetric]||TREND_COLORS.deficit;
  const gridN=4;
  let svg=`<rect x="0" y="0" width="${W}" height="${H}" rx="15" fill="transparent"/>`;
  for(let i=0;i<=gridN;i++){
    const val=min+(max-min)*i/gridN, yy=y(val);
    const lab=trendMode==='share'?`${Math.round(val)}%`:Math.round(val);
    svg+=`<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}" stroke="#e9eef4" stroke-width="1"/><text x="${L-11}" y="${yy+4}" text-anchor="end" fill="#8291a2" font-size="10.5">${lab}</text>`;
  }
  years.forEach((yr,i)=>{
    svg+=`<line x1="${x(i)}" y1="${T}" x2="${x(i)}" y2="${H-B}" stroke="#f2f5f8" stroke-width="1"/>`;
    svg+=`<text x="${x(i)}" y="${H-18}" text-anchor="middle" fill="#607286" font-size="12" font-weight="800">${yr}</text>`;
  });
  const pathAvg=avgs.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join(' ');
  const pathCounty=vals.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join(' ');
  if(trendChartType==='bar'){
    years.forEach((yr,i)=>{
      [[avgs[i],TREND_AVG_COLOR,-24,'Średnia wojewódzka'],[vals[i],colors.main,4,name]].forEach(([v,c,dx,area])=>{
        const top=y(v),bottom=y(min),height=Math.max(2,bottom-top);
        svg+=`<rect x="${x(i)+dx}" y="${top}" width="20" height="${height}" rx="4" fill="${c}" data-trend-point="1" data-year="${yr}" data-value="${pl1(v)}" data-area="${escapeHtml(area)}"/>`;
      });
    });
  }else{
    svg+=`<path d="${pathAvg}" fill="none" stroke="${TREND_AVG_COLOR}" stroke-width="3" stroke-dasharray="8 7" opacity=".9"/>`;
    svg+=`<path d="${pathCounty}" fill="none" stroke="${colors.main}" stroke-width="4.5"/>`;
    avgs.forEach((v,i)=>svg+=`<circle cx="${x(i)}" cy="${y(v)}" r="7" fill="#fff" stroke="${TREND_AVG_COLOR}" stroke-width="3" data-trend-point="1" data-year="${years[i]}" data-value="${pl1(v)}" data-area="Średnia wojewódzka"/>`);
    vals.forEach((v,i)=>svg+=`<circle cx="${x(i)}" cy="${y(v)}" r="8" fill="${colors.main}" stroke="#fff" stroke-width="2.5" data-trend-point="1" data-year="${years[i]}" data-value="${pl1(v)}" data-area="${escapeHtml(name)}"/>`);
  }
  const lastV=vals[3], lastA=avgs[3];
  const fmt=v=>trendMode==='share'?`${pl1(v)}%`:pl1(v);
  const endX=x(3);
  const yV=y(lastV), yA=y(lastA);
  const close=Math.abs(yA-yV)<46;
  const countyLabelY=Math.max(T+16, Math.min(H-B-18, yV + (close?28:-24)));
  const avgLabelY=Math.max(T+14, Math.min(H-B-16, yA + (close?-28:22)));
  // Powiat: pigułka po prawej stronie ostatniego punktu.
  svg+=`<g transform="translate(${endX+34},${countyLabelY})"><rect x="-30" y="-13" width="60" height="26" rx="13" fill="#fff" stroke="${colors.main}" stroke-width="1.5"/><text text-anchor="middle" y="4" fill="${colors.dark}" font-size="11" font-weight="800">${fmt(lastV)}</text></g>`;
  // Średnia wojewódzka: osobna etykieta po lewej, zawsze widoczna.
  svg+=`<g transform="translate(${endX-48},${avgLabelY})"><rect x="-38" y="-12" width="76" height="24" rx="12" fill="#fffaf1" stroke="${TREND_AVG_COLOR}" stroke-width="1.2"/><text text-anchor="middle" y="4" fill="${TREND_AVG_DARK}" font-size="10.5" font-weight="800">śr. ${fmt(lastA)}</text></g>`;
  document.getElementById('trendChart').setAttribute('viewBox',`0 0 ${W} ${H}`);
  document.getElementById('trendChart').innerHTML=svg;
  document.getElementById('trendSubtitle').textContent=`${name} • czteroletni trend • ${trendMode==='share'?'udział procentowy':'liczba grup zawodów'}`;
  document.getElementById('trendModeNote').textContent=trendMode==='share'?'Wykres pokazuje udział danej kategorii w klasyfikacji każdego roku.':'Wykres pokazuje liczbę grup zawodów.';
  document.getElementById('trendCountyLegend').textContent=name;
  document.getElementById('trendMetricLabel').textContent=TREND_LABELS[trendMetric];
  document.getElementById('trendMetricLabel').style.color=colors.dark;
  const diff=vals[3]-vals[0];
  document.getElementById('trendHeadline').textContent=`${diff>0?'+':''}${trendMode==='share'?pl1(diff)+' p.p.':pl1(diff)}`;
  document.getElementById('trendHeadline').style.color=colors.main;
  document.getElementById('trendHeadlineDesc').textContent=trendMode==='share'?`zmiana udziału: 2024 → 2027 (${pl1(vals[0])}% → ${pl1(vals[3])}%)`:`zmiana liczby grup: 2024 → 2027 (${countVals[0]} → ${countVals[3]})`;
  const insight=document.getElementById('trendInsight');
  insight.textContent=trendInterpretation(name,trendMetric,pts,avgCounts);
  insight.style.borderLeftColor=TREND_AVG_COLOR;
  const summaryBox=document.querySelector('.trendSummaryBox'); if(summaryBox) summaryBox.style.borderLeftColor=colors.main;
  const countyDot=document.querySelector('.trendDot.county'); if(countyDot) countyDot.style.background=colors.main;
  const avgDot=document.querySelector('.trendDot.avg'); if(avgDot) avgDot.style.background=TREND_AVG_COLOR;
  const trendYearStrip=document.getElementById('trendYearStrip');
  if(trendYearStrip) trendYearStrip.innerHTML=years.map((yr,i)=>{
    const countyDisplay=trendMode==='share'?`${pl1(vals[i])}%`:pl1(vals[i]);
    const avgDisplay=trendMode==='share'?`${pl1(avgs[i])}%`:pl1(avgs[i]);
    return `<div class="trendYearMini ${yr===2027?'current':''}" style="border-color:${yr===2027?colors.main:'#e4eaf1'}"><div class="miniYear">${yr}</div><div class="miniCounty" style="color:${colors.main}">${countyDisplay}</div><div class="miniAvg">śr. woj. ${avgDisplay}</div></div>`;
  }).join('');
  document.getElementById('trendYears').innerHTML=years.map((yr,i)=>{
    const v=countVals[i], p=pct(v,pts[i].total), a=avgCounts[i], da=v-a;
    const mainValue=trendMode==='share'?`${pl1(p)}%`:v;
    const secondary=trendMode==='share'?`${v} grup zawodów`:`${pl1(p)}% wszystkich grup`;
    const avgText=trendMode==='share'?`śr. woj. ${pl1(pct(a,pts[i].total))}%`:`śr. woj. ${pl1(a)} • ${signed(da)} od średniej`;
    return `<div class="yearCard" style="border-top-color:${colors.main}"><div class="year">${yr}</div><div class="yearValue" style="color:${colors.main}">${mainValue}</div><div class="yearPct">${secondary}</div><div class="yearAvg">${avgText}</div></div>`;
  }).join('');
}
document.querySelectorAll(".trendBtn").forEach(b=>b.addEventListener("click",()=>{
  trendMetric=b.dataset.trend;
  document.querySelectorAll(".trendBtn").forEach(x=>x.classList.toggle("active",x===b));
  if(active) renderTrend(active); else renderProvinceTrend();
}));
document.querySelectorAll('[data-trend-chart]').forEach(b=>b.addEventListener('click',()=>{
  trendChartType=b.dataset.trendChart;
  document.querySelectorAll('[data-trend-chart]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});
  if(active && DATA[active]) renderTrend(active); else renderProvinceTrend();
}));
(function initTrendInteraction(){
  const chart=document.getElementById('trendChart');
  const tip=document.createElement('div');tip.className='trendPointTooltip';tip.setAttribute('role','status');document.body.appendChild(tip);
  const show=(el)=>{
    if(!el)return;
    const suffix=trendMode==='share'?'%':' grup';
    tip.textContent=`${el.dataset.area} · ${el.dataset.year}: ${el.dataset.value}${suffix}`;
    tip.classList.add('visible');
    const r=el.getBoundingClientRect();tip.style.left=`${Math.max(12,Math.min(window.innerWidth-245,r.left+r.width/2-100))}px`;
    tip.style.top=`${Math.max(10,r.top-58)}px`;
  };
  chart.addEventListener('click',e=>{const el=e.target.closest('[data-trend-point]');if(el)show(el);});
  chart.addEventListener('pointerover',e=>{const el=e.target.closest('[data-trend-point]');if(el)show(el);});
  chart.addEventListener('pointerleave',()=>tip.classList.remove('visible'));
  document.addEventListener('click',e=>{if(!chart.contains(e.target))tip.classList.remove('visible');});
})();
document.querySelectorAll("[data-trend-mode]").forEach(b=>b.addEventListener("click",()=>{
  trendMode=b.dataset.trendMode;
  document.querySelectorAll("[data-trend-mode]").forEach(x=>x.classList.toggle("active",x===b));
  if(active) renderTrend(active);
}));

function getValue(name){
  const d=DATA[name];
  if(!d) return 0;
  if(mode==="deficit") return d.deficit;
  if(mode==="delta") return d.delta_deficit;
  if(mode==="unemployment") return UNEMPLOYMENT[name] ?? 0;
  return Math.round(d.balance/d.total*1000)/10;
}
function lerp(a,b,t){return Math.round(a+(b-a)*t)}
function rgb(a,b,t){return `rgb(${lerp(a[0],b[0],t)},${lerp(a[1],b[1],t)},${lerp(a[2],b[2],t)})`}
function colorFor(v,min,max){
  if(mode==="delta"){
    if(v<0){let t=Math.min(1,Math.abs(v)/Math.max(1,Math.abs(min))); return rgb([225,239,234],[59,143,117],t)}
    if(v>0){let t=Math.min(1,v/Math.max(1,max)); return rgb([249,233,234],[199,77,86],t)}
    return "#e9edf2";
  }
  const t=(v-min)/Math.max(0.1,(max-min));
  if(mode==="unemployment") return rgb([235,244,241],[184,73,73],Math.max(0,Math.min(1,t)));
  return rgb([225,235,244],[23,61,102],Math.max(0,Math.min(1,t)));
}
function occupationStatus(occName,county){
  const rec=OCC_DATA[occName]; if(!rec) return "X";
  const i=WANTED.indexOf(county); return i>=0 ? rec.s[i] : "X";
}
function renderOccupationSummary(){
  const box=document.getElementById("occupationSummary");
  const clear=document.getElementById("occupationClear");
  if(!selectedOccupation){box.classList.remove("show");clear.classList.remove("show");return;}
  const rec=OCC_DATA[selectedOccupation], counts={DD:0,D:0,R:0,N:0,X:0};
  WANTED.forEach(c=>counts[occupationStatus(selectedOccupation,c)]++);
  box.classList.add("show"); clear.classList.add("show");
  document.getElementById("occupationTitle").textContent=selectedOccupation;
  document.getElementById("occupationMeta").textContent=`Branża: ${rec.branch||"-"} • kod grupy: ${rec.code||"-"} • sytuacja w 36 powiatach i miastach na prawach powiatu`;
  const order=["DD","D","R","N","X"];
  document.getElementById("occupationStats").innerHTML=order.map(k=>`<div class="occStat"><strong style="color:${OCC_STATUS[k].color}">${counts[k]}</strong><span>${OCC_STATUS[k].label}</span></div>`).join("");
}
function setOccupation(name){
  selectedOccupation=(name&&OCC_DATA[name])?name:""; occupationSelect.value=selectedOccupation;
  const occupationTools=document.querySelector('.occupationTools');
  if(occupationTools) occupationTools.classList.toggle('occupationActive',!!selectedOccupation);
  document.body.classList.toggle('hasSelectedOccupation',!!selectedOccupation);
  const occupationProfile=document.querySelector('.occupationProfileCard');
  if(occupationProfile) occupationProfile.classList.toggle('occupationProfileActive',!!selectedOccupation);
  renderOccupationSummary(); renderOccupationProfile(); recolor(); syncUrlState();
}
function recolor(){
  if(selectedOccupation){
    document.getElementById("numericLegend").style.display="none";
    document.getElementById("occLegend").classList.add("show");
    document.querySelectorAll("#map .county").forEach(el=>{const s=occupationStatus(selectedOccupation,el.dataset.name);el.setAttribute("fill",OCC_STATUS[s].color)});
    return;
  }
  document.getElementById("numericLegend").style.display="flex";
  document.getElementById("occLegend").classList.remove("show");
  const vals=WANTED.map(getValue), min=Math.min(...vals), max=Math.max(...vals);
  document.querySelectorAll("#map .county").forEach(el=>{el.setAttribute("fill",colorFor(getValue(el.dataset.name),min,max))});
  document.getElementById("legendMin").textContent=(mode==="balance"||mode==="unemployment")?min+"%":min;
  document.getElementById("legendMax").textContent=(mode==="balance"||mode==="unemployment")?max+"%":max;
  document.getElementById("legendLabel").textContent=mode==="deficit"?"liczba grup deficytowych":mode==="delta"?"zmiana liczby deficytów vs 2026":mode==="unemployment"?"stopa bezrobocia rejestrowanego - 31.08.2026":"udział równowagi w %";
  document.getElementById("legendGradient").classList.toggle("delta",mode==="delta");
  document.getElementById("legendGradient").style.background = mode==="unemployment" ? "linear-gradient(90deg,#ebf4f1,#e0c7b7,#c88376,#b84949)" : "";
}
document.querySelectorAll(".btn[data-mode]").forEach(b=>b.addEventListener("click",()=>{
  mode=b.dataset.mode; document.querySelectorAll(".btn[data-mode]").forEach(x=>x.classList.toggle("active",x===b)); recolor();
}));

function allPoints(g){let out=[]; const rec=x=>{if(Array.isArray(x)&&typeof x[0]==="number")out.push(x);else if(Array.isArray(x))x.forEach(rec)};rec(g.coordinates);return out}
function pathForGeometry(g,proj){
  const ringPath=ring=>ring.map((p,i)=>{const [x,y]=proj(p);return `${i?"L":"M"}${x.toFixed(1)},${y.toFixed(1)}`}).join("")+"Z";
  if(g.type==="Polygon") return g.coordinates.map(ringPath).join("");
  if(g.type==="MultiPolygon") return g.coordinates.flatMap(poly=>poly.map(ringPath)).join("");
  return "";
}
function buildMap(){
  svg.innerHTML="";
  mapFeatures=[];
  for(const name of WANTED){
    const d=EMBEDDED_PATHS[name];
    if(!d) continue;
    const p=document.createElementNS("http://www.w3.org/2000/svg","path");
    p.setAttribute("d",d);
    p.setAttribute("fill-rule","evenodd");
    p.setAttribute("fill","#dbe5ee");
    p.classList.add("county");
    p.dataset.name=name;
    p.addEventListener("click",()=>selectCounty(name));
    p.addEventListener("mousemove",ev=>{
      const row=DATA[name];
      tooltip.style.display="block";
      tooltip.style.left=(ev.offsetX+18)+"px";
      tooltip.style.top=(ev.offsetY+12)+"px";
      if(selectedOccupation){
        const s=occupationStatus(selectedOccupation,name), meta=OCC_STATUS[s];
        tooltip.innerHTML=`<div style="font-size:14px;font-weight:800;margin-bottom:4px">${name}</div><div style="max-width:250px;margin-bottom:6px">${escapeHtml(selectedOccupation)}</div><div style="font-weight:800;color:${meta.color}">${meta.label}</div>`;
      } else {
        tooltip.innerHTML=`<div style="font-size:14px;font-weight:800;margin-bottom:4px">${name}</div><div>Stopa bezrobocia <b style="float:right">${UNEMPLOYMENT[name] ?? "-"}%</b></div><div style="font-size:11px;opacity:.72">stan na 31.08.2026 r.</div><div>Deficyt 2027 <b style="float:right">${row.deficit}</b></div><div>Równowaga <b style="float:right">${row.balance}</b></div><div style="margin-top:4px;opacity:.82">Zmiana deficytu vs 2026: <b>${row.delta_deficit>0?"+":""}${row.delta_deficit}</b></div>`;
      }
    });
    p.addEventListener("mouseleave",()=>tooltip.style.display="none");
    svg.appendChild(p);
  }
  addMapLabels();
  recolor();
  selectProvinceOverview();
}
function addMapLabels(){
  svg.querySelectorAll('.mapLabel').forEach(x=>x.remove());
  const labelNames=['Częstochowa','Gliwice','Katowice','Rybnik','Bielsko-Biała'];
  labelNames.forEach(name=>{
    const p=[...svg.querySelectorAll('.county')].find(x=>x.dataset.name===name);
    if(!p) return;
    const b=p.getBBox();
    const t=document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x',b.x+b.width/2); t.setAttribute('y',b.y+b.height/2);
    t.setAttribute('text-anchor','middle'); t.setAttribute('dominant-baseline','middle');
    t.classList.add('mapLabel'); t.dataset.name=name; t.textContent=name; svg.appendChild(t);
  });
}
function updateMapLabels(){
  svg.querySelectorAll('.mapLabel').forEach(t=>t.classList.toggle('active',t.dataset.name===active));
}
function pdfTrendSvg(name,metric){
  const PDF_AVG_COLOR="#c58a2b";
  const PDF_AVG_DARK="#9a6a1d";
  const PDF_TREND_COLORS={
    deficit:{main:'#c74d56',avg:'#d98b93',dark:'#a63a45',soft:'#f8e6e8'},
    balance:{main:'#3b8f75',avg:'#84b8a4',dark:'#26745e',soft:'#e5f4ee'},
    surplus:{main:'#2f6fb0',avg:'#88add2',dark:'#245d97',soft:'#e7f0fb'},
    no_eval:{main:'#7d8997',avg:'#a9b2bc',dark:'#677280',soft:'#eef1f4'}
  };
  const colors=PDF_TREND_COLORS[metric]||PDF_TREND_COLORS.deficit;
  const years=[2024,2025,2026,2027];
  const pts=years.map(y=>trendPoint(name,y));
  const avgs=years.map(y=>avgPoint(y,metric));
  const vals=pts.map(p=>p[metric]);
  const all=vals.concat(avgs), min=Math.min(0,...all), max=Math.max(...all,1);
  const W=720,H=300,L=50,R=24,T=32,B=46;
  const x=i=>L+i*(W-L-R)/3, y=v=>H-B-(v-min)/(max-min||1)*(H-T-B);
  let svg=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${TREND_LABELS[metric]} 2024-2027">`;
  for(let i=0;i<=4;i++){const val=min+(max-min)*i/4,yy=y(val);svg+=`<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}" stroke="#e7edf3"/><text x="${L-8}" y="${yy+4}" text-anchor="end" fill="#7b8999" font-size="10">${Math.round(val)}</text>`;}
  years.forEach((yr,i)=>{
    const isLast=yr===2027;
    svg+=`<text x="${x(i)}" y="${H-16}" text-anchor="middle" fill="${isLast?'#173d66':'#607286'}" font-size="${isLast?13:12}" font-weight="${isLast?900:800}">${yr}</text>`;
  });
  svg+=`<path d="${avgs.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="${PDF_AVG_COLOR}" stroke-width="3" stroke-dasharray="7 6"/>`;
  svg+=`<path d="${vals.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="${colors.main}" stroke-width="4"/>`;
  avgs.forEach((v,i)=>svg+=`<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#fff" stroke="${PDF_AVG_COLOR}" stroke-width="3"/><text x="${x(i)-8}" y="${Math.max(14,y(v)-12)}" text-anchor="middle" fill="${PDF_AVG_DARK}" font-size="9">${pl1(v)}</text>`);
  vals.forEach((v,i)=>svg+=`<circle cx="${x(i)}" cy="${y(v)}" r="5" fill="${colors.main}" stroke="#fff" stroke-width="2"/><text x="${x(i)+8}" y="${Math.min(H-B-3,y(v)+18)}" text-anchor="middle" fill="${colors.dark}" font-size="10" font-weight="800">${v}</text>`);
  return svg+'</svg>';
}
function buildPdfFindings(name,d,u){
  const trends=[
    {metric:'deficit', label:'deficyt', diff: trendPoint(name,2027).deficit - trendPoint(name,2024).deficit},
    {metric:'balance', label:'równowaga', diff: trendPoint(name,2027).balance - trendPoint(name,2024).balance},
    {metric:'surplus', label:'nadwyżka', diff: trendPoint(name,2027).surplus - trendPoint(name,2024).surplus},
    {metric:'no_eval', label:'bez oceny', diff: trendPoint(name,2027).no_eval - trendPoint(name,2024).no_eval}
  ];
  const biggest=trends.slice().sort((a,b)=>Math.abs(b.diff)-Math.abs(a.diff))[0];
  const relUnemp=u==null?'brak danych o stopie bezrobocia':(u>VOIV_UNEMPLOYMENT?`stopa bezrobocia jest wyższa od wskaźnika wojewódzkiego o ${pl1(u-VOIV_UNEMPLOYMENT)} p.p.`:u<VOIV_UNEMPLOYMENT?`stopa bezrobocia jest niższa od wskaźnika wojewódzkiego o ${pl1(VOIV_UNEMPLOYMENT-u)} p.p.`:'stopa bezrobocia jest na poziomie wskaźnika wojewódzkiego');
  return [
    `<b>Deficyt 2027:</b> ${d.deficit} grup zawodów (${signed(d.delta_deficit)} vs 2026).`,
    `<b>Równowaga:</b> ${d.balance} grup, czyli ${pl1(pct(d.balance,d.total))}% całej klasyfikacji 2027.`,
    `<b>Pozycja względem województwa:</b> deficyt ${d.deficit>AVG.deficit?'powyżej':'poniżej'} średniej wojewódzkiej, a równowaga ${d.balance>AVG.balance?'powyżej':'poniżej'} średniej.`,
    `<b>Najsilniejsza zmiana 2024–2027:</b> kategoria „${biggest.label}” ${Math.abs(biggest.diff)<0.05?'pozostała bez zmian':(biggest.diff>0?'wzrosła':'spadła') + ' o ' + pl1(Math.abs(biggest.diff))}.`,
    `<b>Rynek pracy:</b> ${relUnemp}.`
  ];
}

function getReportCounty(){
  const current=document.getElementById('countySelect')?.value;
  return (current && DATA[current]) ? current : (active && DATA[active] ? active : '');
}
function buildPrintReport(){
  const name=getReportCounty(), d=DATA[name], u=UNEMPLOYMENT[name];
  if(!d) return;
  const now=new Date();
  const report=document.getElementById('printReport');
  const statusDefs=[['D','Deficyt'],['R','Równowaga'],['N','Nadwyżka'],['X','Bez oceny']];
  const metrics=[
    ['Deficyt',d.deficit,d.delta_deficit],['Równowaga',d.balance,d.delta_balance],['Nadwyżka',d.surplus,d.delta_surplus],['Bez oceny',d.no_eval,d.delta_no_eval],['Stopa bezrobocia',u==null?'–':pl1(u)+'%',null]
  ];
  const struct=[['Deficyt',d.deficit,'#c74d56'],['Równowaga',d.balance,'#3b8f75'],['Nadwyżka',d.surplus,'#d59a32'],['Bez oceny',d.no_eval,'#98a6b5']];
  const refs=[
    ['Deficyt',AVG.deficit,d.deficit-AVG.deficit,false],['Równowaga',AVG.balance,d.balance-AVG.balance,false],['Nadwyżka',AVG.surplus,d.surplus-AVG.surplus,true],['Bez oceny',AVG.no_eval,d.no_eval-AVG.no_eval,true],['Stopa bezrobocia',VOIV_UNEMPLOYMENT,u==null?null:u-VOIV_UNEMPLOYMENT,true]
  ];
  const mapClone=document.getElementById('map').cloneNode(true); mapClone.removeAttribute('id');
  let selectedClone=null;
  mapClone.querySelectorAll('.selectionOutline').forEach(x=>x.remove());
  mapClone.querySelectorAll('.county').forEach(p=>{p.classList.remove('selected'); if(p.dataset.name===name) selectedClone=p; });
  if(selectedClone){
    const outline=document.createElementNS("http://www.w3.org/2000/svg","path");
    outline.setAttribute('d',selectedClone.getAttribute('d'));
    outline.classList.add('selectionOutline');
    outline.setAttribute('fill','none'); outline.setAttribute('stroke','#07192d'); outline.setAttribute('stroke-width','4');
    outline.setAttribute('stroke-linejoin','round'); outline.setAttribute('stroke-linecap','round'); outline.setAttribute('pointer-events','none');
    const firstLabel=mapClone.querySelector('.mapLabel');
    if(firstLabel) mapClone.insertBefore(outline,firstLabel); else mapClone.appendChild(outline);
  }
  const trendMetrics=['deficit','balance','surplus','no_eval'];
  const trendMap={};
  trendMetrics.forEach(metric=>{
    const years=[2024,2025,2026,2027], pts=years.map(y=>trendPoint(name,y)), avgs=years.map(y=>avgPoint(y,metric)), vals=pts.map(p=>p[metric]);
    const c={deficit:'#c74d56',balance:'#3b8f75',surplus:'#2f6fb0',no_eval:'#7d8997'}[metric]||'#173d66';
    const yearsHtml=years.map((yr,i)=>`<div class="pdfYear" style="border-top:3px solid ${c}"><b style="color:${c}">${yr}: ${vals[i]}</b><span>${pl1(pct(vals[i],pts[i].total))}% grup</span><span>śr. woj. ${pl1(avgs[i])}</span></div>`).join('');
    trendMap[metric]=`<div class="pdfTrend" data-metric="${metric}"><h3 style="color:${c}">${TREND_LABELS[metric]}</h3><div class="sub">${name} (linia ciągła) vs średnia województwa (linia przerywana)</div>${pdfTrendSvg(name,metric)}<div class="pdfYearRow">${yearsHtml}</div><div class="pdfTrendInsight" style="border-left-color:${c}">${escapeHtml(trendInterpretation(name,metric,pts,avgs))}</div></div>`;
  });
  const pdfStatusLabel={DD:'Duży deficyt',D:'Deficyt',R:'Równowaga',N:'Nadwyżka',X:'Bez oceny'};
  const jobsHtml=statusDefs.map(([code,label])=>{
    const jobs=countyJobsByStatus(name,code);
    const rows=jobs.map(j=>`<div class="pdfJob status-${code}"><span>${escapeHtml(j.name)}</span><span class="meta">${code==='R'?'':`<span class="pdfStatusBadge status-${code}">${pdfStatusLabel[code]||label}</span>`}<span class="branch">${escapeHtml(j.branch)}</span></span></div>`).join('');
    return `<div class="pdfJobsSection status-${code}"><h3>${label}<span>${jobs.length} grup zawodów</span></h3><div class="pdfJobs">${rows||'<div>Brak pozycji.</div>'}</div></div>`;
  }).join('');
  const comments=(d.comments||[]).map(c=>`<div class="pdfComment">${escapeHtml(c)}</div>`).join('')||'<div class="pdfComment">Brak komentarzy jakościowych w bazie dla tej jednostki.</div>';
  const findings=buildPdfFindings(name,d,u).map(x=>`<li>${x}</li>`).join('');
  report.innerHTML=`
    <section class="pdfPage">
      <div class="pdfHeader"><div><div class="eyeb">Prognoza rynku pracy 2027</div><h1>${escapeHtml(name)}</h1><p>Pełny raport powiatowy • dane 2024–2027</p></div><div class="pdfMeta">Województwo śląskie<br>Stan stopy bezrobocia: 31.08.2026<br>Wygenerowano: ${now.toLocaleDateString('pl-PL')}</div></div>
      <div class="pdfKpis">${metrics.map(([l,v,delta])=>`<div class="pdfKpi"><div class="l">${l}</div><div class="v">${v}</div><div class="d">${delta==null?(l==='Stopa bezrobocia'?`stan na 31.08.2026 r. • woj. ${pl1(VOIV_UNEMPLOYMENT)}%`:''):`${delta>0?'+':''}${delta} vs 2026`}</div></div>`).join('')}</div>
      <div class="pdfGrid2"><div class="pdfBox pdfMap"><h3>Powiat na mapie województwa</h3><div class="mapCanvas">${mapClone.outerHTML}</div></div><div class="pdfBox"><h3>Struktura ocen 2027</h3><div class="pdfBars">${struct.map(([l,v,c])=>`<div class="pdfBarRow"><span>${l}</span><div class="pdfBarTrack"><div class="pdfBarFill" style="width:${v/d.total*100}%;background:${c}"></div></div><b>${v}</b></div>`).join('')}</div><h3 style="margin-top:6mm">Komentarz</h3>${comments}</div></div>
    </section>
    <section class="pdfPage">
      <div class="pdfHeader"><div><div class="eyeb">Benchmark wojewódzki</div><h1>${escapeHtml(name)} na tle woj. śląskiego</h1><p>Punkt odniesienia dla kluczowych wskaźników</p></div></div>
      <div class="pdfBenchmark">${refs.map(([l,avg,diff,inverse])=>{const cls=diff==null?'':((inverse?diff<0:diff>0)?'color:#26745e':'color:#b2444d');return `<div class="pdfRef"><div class="l">${l}</div><div class="v">${l==='Stopa bezrobocia'?pl1(avg)+'%':pl1(avg)}</div><div class="c" style="${cls}">${diff==null?'brak danych':`${diff>0?'+':''}${pl1(diff)}${l==='Stopa bezrobocia'?' p.p.':' od średniej'}`}</div></div>`}).join('')}</div>
      <h2 class="pdfSectionTitle" style="margin-top:4mm">Trendy 2024–2027</h2><p class="pdfLead">Wszystkie cztery kategorie ocen. W latach 2024–2025 oceniano 163 grupy zawodów, a w 2026–2027 - 168.</p>
      <div class="pdfTrendGrid">${trendMap.deficit}${trendMap.balance}</div>
    </section>
    <section class="pdfPage">
      <div class="pdfHeader"><div><div class="eyeb">Trendy 2024–2027</div><h1>${escapeHtml(name)} - nadwyżka i bez oceny</h1><p>Uzupełnienie przeglądu trendów oraz skrócone wnioski.</p></div></div>
      <div class="pdfTrendGrid">${trendMap.surplus}${trendMap.no_eval}</div>
      <div class="pdfSummaryBox"><h3>Najważniejsze wnioski dla powiatu</h3><ul class="pdfSummaryList">${findings}</ul></div>
    </section>
    <section class="pdfPage pdfJobsStart">
      <div class="pdfHeader"><div><div class="eyeb">Pełne zestawienie</div><h1>Zawody według sytuacji - ${escapeHtml(name)}</h1><p>Wszystkie grupy zawodów w prognozie 2027</p></div></div>
      ${jobsHtml}
      <div class="pdfMethod">Uwaga metodologiczna: liczby w kategoriach odnoszą się do liczby grup zawodów ocenionych w danym roku. Średnia wojewódzka jest średnią dla 36 powiatów i miast na prawach powiatu. Stopa bezrobocia: stan na 31.08.2026 r. Wartość wojewódzka jest oficjalnym wskaźnikiem wojewódzkim, a nie średnią arytmetyczną powiatów.</div>
    </section>`;
}

function pptSvgData(svgEl){
  const clone=svgEl.cloneNode(true);
  clone.setAttribute('xmlns','http://www.w3.org/2000/svg');
  const s=new XMLSerializer().serializeToString(clone);
  return 'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(s)));
}
function pptAddTitle(slide,title,subtitle=''){
  slide.addText(title,{x:.6,y:.35,w:12.1,h:.45,fontFace:'Arial',fontSize:24,bold:true,color:'173D66',margin:0});
  if(subtitle) slide.addText(subtitle,{x:.6,y:.86,w:12.1,h:.3,fontFace:'Arial',fontSize:10.5,color:'66758A',margin:0});
  slide.addShape('line',{x:.6,y:1.18,w:12.1,h:0,line:{color:'DCE5EE',width:1.2}});
}
function pptAddFooter(slide,name){
  slide.addText(`Prognoza rynku pracy 2027 • ${name} • Materiał roboczy dla Obserwatorium Rynku Pracy`,{x:.6,y:7.16,w:12.1,h:.18,fontFace:'Arial',fontSize:6.8,color:'8796A8',margin:0,align:'right'});
}
function pptMetricBox(slide,x,y,w,label,value,sub,color='173D66'){
  slide.addShape('roundRect',{x,y,w,h:1.05,rectRadius:.06,fill:{color:'F8FAFC'},line:{color:'DCE5EE',width:1}});
  slide.addText(label.toUpperCase(),{x:x+.14,y:y+.12,w:w-.28,h:.18,fontFace:'Arial',fontSize:7.5,bold:true,color:'718198',margin:0});
  slide.addText(String(value),{x:x+.14,y:y+.36,w:w-.28,h:.34,fontFace:'Arial',fontSize:20,bold:true,color,margin:0});
  if(sub) slide.addText(sub,{x:x+.14,y:y+.76,w:w-.28,h:.17,fontFace:'Arial',fontSize:7.5,color:'5F7084',margin:0});
}
function pptTrendSeries(name,metric){
  const years=[2024,2025,2026,2027];
  const vals=years.map(y=>trendPoint(name,y)[metric]);
  const avgs=years.map(y=>avgPoint(y,metric));
  return {years,vals,avgs};
}
function pptFindings(name,d,u){
  const metrics=[['Deficyt','deficit'],['Równowaga','balance'],['Nadwyżka','surplus'],['Bez oceny','no_eval']];
  const changes=metrics.map(([label,m])=>({label,m,diff:trendPoint(name,2027)[m]-trendPoint(name,2024)[m]})).sort((a,b)=>Math.abs(b.diff)-Math.abs(a.diff));
  const unemp=u==null?'Brak danych o stopie bezrobocia.':(u<VOIV_UNEMPLOYMENT?`Stopa bezrobocia jest niższa od wojewódzkiej o ${pl1(VOIV_UNEMPLOYMENT-u)} p.p.`:u>VOIV_UNEMPLOYMENT?`Stopa bezrobocia jest wyższa od wojewódzkiej o ${pl1(u-VOIV_UNEMPLOYMENT)} p.p.`:'Stopa bezrobocia jest na poziomie wojewódzkim.');
  return [
    `Deficyt 2027: ${d.deficit} grup (${d.delta_deficit>0?'+':''}${d.delta_deficit} vs 2026).`,
    `Równowaga: ${d.balance} grup (${pl1(100*d.balance/d.total)}% klasyfikacji).`,
    `Najsilniejsza zmiana 2024–2027: ${changes[0].label.toLowerCase()} ${changes[0].diff>0?'wzrosła':changes[0].diff<0?'spadła':'pozostała bez zmian'}${changes[0].diff?` o ${Math.abs(changes[0].diff)}`:''}.`,
    unemp
  ];
}
async function generatePPTX(){
  if(typeof PptxGenJS==='undefined'){
    alert('Nie udało się załadować modułu PPTX. Sprawdź, czy folder assets znajduje się obok index.html.');
    return;
  }
  const name=getReportCounty();
  if(!name){alert('Wybierz powiat przed wygenerowaniem prezentacji.');return;}
  const d=DATA[name], u=UNEMPLOYMENT[name];
  if(!d) return;

  const pptx=new PptxGenJS();
  pptx.layout='LAYOUT_WIDE';
  pptx.author='Wojewódzki Urząd Pracy w Katowicach';
  pptx.subject='Prognoza rynku pracy 2027';
  pptx.title=`Prognoza rynku pracy 2027 - ${name}`;
  pptx.company='Wojewódzki Urząd Pracy w Katowicach';
  pptx.lang='pl-PL';
  pptx.theme={headFontFace:'Arial',bodyFontFace:'Arial',lang:'pl-PL'};

  const C={navy:'173D66',navy2:'214C78',red:'C74D56',green:'3B8F75',blue:'2F6FB0',gray:'7D8997',gold:'C58A2B',text:'33485D',muted:'66758A',line:'DCE5EE',pale:'F6F9FC',white:'FFFFFF'};
  pptx.defineSlideMaster({
    title:'MASTER',background:{color:'FFFFFF'},
    objects:[{image:{data:window.EXPORT_BRAND.data,x:0,y:0,w:13.333333,h:7.5}}],
    slideNumber:{x:12.25,y:6.91,w:.45,h:.12,fontFace:'Arial',fontSize:6.4,color:'66758A',align:'right'}
  });
  // Map existing content into the white area between the original header and footer.
  const originalAddSlide=pptx.addSlide.bind(pptx);
  pptx.addSlide=(master='MASTER')=>{
    // PptxGenJS expects an options object, not a bare master-name string.
    const slide=originalAddSlide({masterName:master});
    for(const method of ['addText','addShape','addImage','addChart']){
      const original=slide[method].bind(slide);
      slide[method]=(...args)=>{
        const last=method==='addImage'?0:method==='addChart'?2:1;
        const opts={...(args[last]||{})};
        if(typeof opts.y==='number')opts.y=1.08+opts.y*.82;
        if(typeof opts.h==='number')opts.h*=.82;
        if(typeof opts.fontSize==='number')opts.fontSize*=.92;
        if(method==='addImage'&&typeof opts.w==='number'){const oldW=opts.w;opts.w*=.82;opts.x=(opts.x||0)+(oldW-opts.w)/2;}
        args[last]=opts;return original(...args);
      };
    }
    return slide;
  };

  const addHeader=(slide,title,subtitle='')=>{
    slide.addText(title,{x:.6,y:.35,w:12.1,h:.42,fontFace:'Arial',fontSize:24,bold:true,color:C.navy,margin:0});
    if(subtitle) slide.addText(subtitle,{x:.6,y:.84,w:12.1,h:.25,fontFace:'Arial',fontSize:10.3,color:C.muted,margin:0});
    slide.addShape('line',{x:.6,y:1.17,w:12.1,h:0,line:{color:C.line,width:1.1}});
  };
  const addKpi=(slide,x,y,w,label,value,sub,color=C.navy)=>{
    slide.addShape('roundRect',{x,y,w,h:1.02,rectRadius:.06,fill:{color:'F9FBFD'},line:{color:C.line,width:1}});
    slide.addText(label.toUpperCase(),{x:x+.14,y:y+.12,w:w-.28,h:.16,fontSize:7.3,bold:true,color:'718198',margin:0});
    slide.addText(String(value),{x:x+.14,y:y+.34,w:w-.28,h:.32,fontSize:20,bold:true,color,margin:0});
    slide.addText(sub,{x:x+.14,y:y+.74,w:w-.28,h:.16,fontSize:7.2,color:'5F7084',margin:0});
  };
  const addCallout=(slide,x,y,w,h,text,color=C.navy,fill='F5F8FB')=>{
    slide.addShape('roundRect',{x,y,w,h,rectRadius:.06,fill:{color:fill},line:{color:'E1E8EF',width:1}});
    slide.addShape('rect',{x:x,y:y,w:.08,h,fill:{color},line:{color}});
    slide.addText(text,{x:x+.22,y:y+.16,w:w-.38,h:h-.3,fontSize:11.2,bold:true,color:C.text,margin:0,fit:'shrink',valign:'mid'});
  };
  const pct=(a,b)=>b?Math.round((a/b)*100):0;
  const years=[2024,2025,2026,2027];
  const deficitT=pptTrendSeries(name,'deficit');
  const balanceT=pptTrendSeries(name,'balance');
  const decline=deficitT.vals[0]?Math.round((1-deficitT.vals[3]/deficitT.vals[0])*100):0;
  const balShare=d.total?100*d.balance/d.total:0;
  const deficitVsAvg=AVG.deficit?Math.round((1-d.deficit/AVG.deficit)*100):0;
  const unemploymentText=u==null?'brak danych':`${pl1(u)}%`;
  const unempDiff=u==null?null:u-VOIV_UNEMPLOYMENT;

  // 1. Okładka + trzy liczby
  let s=pptx.addSlide();
  s.background={color:'FFFFFF'};
  s.addText('PROGNOZA RYNKU PRACY 2027',{x:.72,y:1.03,w:11.8,h:.3,fontSize:12.5,bold:true,color:C.muted,charSpacing:1.2,margin:0});
  s.addText(name,{x:.72,y:1.58,w:11.7,h:.68,fontSize:35,bold:true,color:C.navy,margin:0});
  s.addText('Materiał roboczy dla Obserwatorium Rynku Pracy',{x:.72,y:2.45,w:11.7,h:.34,fontSize:15.5,color:C.text,margin:0});
  s.addText('Dane 2024–2027 • benchmark wojewódzki • stopa bezrobocia 2026',{x:.72,y:2.95,w:11.7,h:.26,fontSize:10.5,color:C.muted,margin:0});
  const coverKpis=[
    ['DEFICYT 2027',d.deficit,'grup',C.red],
    ['RÓWNOWAGA',`${pl1(balShare)}%`,'klasyfikacji',C.green],
    ['STOPA BEZROBOCIA',unemploymentText,`stan na 31.08.2026 r. • woj. ${pl1(VOIV_UNEMPLOYMENT)}%`,C.navy]
  ];
  coverKpis.forEach((k,i)=>{
    const x=.72+i*3.02;
    s.addShape('roundRect',{x,y:4.17,w:2.72,h:1.12,rectRadius:.06,fill:{color:'F4F7FA',transparency:0},line:{color:C.line,width:1}});
    s.addText(k[0],{x:x+.16,y:4.35,w:2.4,h:.16,fontSize:7.4,bold:true,color:C.muted,margin:0});
    s.addText(String(k[1]),{x:x+.16,y:4.58,w:2.4,h:.34,fontSize:22,bold:true,color:k[3],margin:0});
    s.addText(k[2],{x:x+.16,y:4.96,w:2.4,h:.15,fontSize:7.6,color:C.muted,margin:0});
  });

  // 2. Obraz rynku 2027
  s=pptx.addSlide('MASTER');
  addHeader(s,`Obraz rynku pracy w 2027 - ${name}`,'Najważniejsze wskaźniki, struktura ocen i pozycja powiatu na mapie województwa');
  const metrics=[
    ['Deficyt',d.deficit,`${d.delta_deficit>0?'+':''}${d.delta_deficit} vs 2026`,C.red],
    ['Równowaga',d.balance,`${d.delta_balance>0?'+':''}${d.delta_balance} vs 2026`,C.green],
    ['Nadwyżka',d.surplus,`${d.delta_surplus>0?'+':''}${d.delta_surplus} vs 2026`,C.blue],
    ['Bez oceny',d.no_eval,`${d.delta_no_eval>0?'+':''}${d.delta_no_eval} vs 2026`,C.gray],
    ['Stopa bezrobocia',unemploymentText,`stan na 31.08.2026 r. • woj. ${pl1(VOIV_UNEMPLOYMENT)}%`,C.navy]
  ];
  metrics.forEach((z,i)=>addKpi(s,.6+i*2.47,1.43,2.25,z[0],z[1],z[2],z[3]));
  const map=document.getElementById('map');
  if(map) s.addImage({data:pptSvgData(map),x:.68,y:2.75,w:5.55,h:3.45});
  s.addText('Struktura ocen 2027',{x:6.65,y:2.78,w:2.9,h:.25,fontSize:14,bold:true,color:C.navy,margin:0});
  const struct=[['Deficyt',d.deficit,C.red],['Równowaga',d.balance,C.green],['Nadwyżka',d.surplus,C.blue],['Bez oceny',d.no_eval,C.gray]];
  struct.forEach((z,i)=>{
    const yy=3.25+i*.62, share=d.total?z[1]/d.total:0;
    s.addText(z[0],{x:6.65,y:yy,w:1.4,h:.18,fontSize:8.8,color:C.muted,margin:0});
    s.addShape('rect',{x:8.05,y:yy+.02,w:3.05,h:.13,fill:{color:'E8EEF4'},line:{color:'E8EEF4'}});
    if(z[1]>0) s.addShape('rect',{x:8.05,y:yy+.02,w:Math.max(.035,3.05*share),h:.13,fill:{color:z[2]},line:{color:z[2]}});
    s.addText(`${z[1]}`,{x:11.28,y:yy-.02,w:.5,h:.2,fontSize:9.2,bold:true,color:C.navy,align:'right',margin:0});
    s.addText(`${pl1(100*share)}%`,{x:11.84,y:yy-.02,w:.55,h:.2,fontSize:8.2,color:C.muted,align:'right',margin:0});
  });
  const takeaway=d.balance/d.total>.85
    ? `${name}: zdecydowana dominacja równowagi - ${pl1(balShare)}% wszystkich grup zawodów.`
    : `${name}: struktura ocen jest bardziej zróżnicowana - równowaga obejmuje ${pl1(balShare)}% grup.`;
  addCallout(s,6.65,5.68,5.7,.78,takeaway,C.green,'F4F9F7');

  // 3. Benchmark
  s=pptx.addSlide('MASTER');
  addHeader(s,`${name} na tle województwa śląskiego`,'Odchylenia od średniej dla 36 powiatów i miast na prawach powiatu');
  const bench=[
    ['Deficyt',d.deficit,AVG.deficit,d.deficit-AVG.deficit,C.red],
    ['Równowaga',d.balance,AVG.balance,d.balance-AVG.balance,C.green],
    ['Nadwyżka',d.surplus,AVG.surplus,d.surplus-AVG.surplus,C.blue],
    ['Bez oceny',d.no_eval,AVG.no_eval,d.no_eval-AVG.no_eval,C.gray]
  ];
  s.addText('Powiat',{x:.75,y:1.48,w:1.2,h:.2,fontSize:8,bold:true,color:C.muted,margin:0});
  s.addText('Średnia woj.',{x:2.15,y:1.48,w:1.15,h:.2,fontSize:8,bold:true,color:C.muted,margin:0});
  s.addText('Odchylenie',{x:3.52,y:1.48,w:1.2,h:.2,fontSize:8,bold:true,color:C.muted,margin:0});
  bench.forEach((b,i)=>{
    const yy=1.86+i*.9;
    s.addText(b[0],{x:.75,y:yy,w:1.2,h:.24,fontSize:10.5,bold:true,color:b[4],margin:0});
    s.addText(pl1(b[1]),{x:2.15,y:yy,w:.9,h:.24,fontSize:12,bold:true,color:C.navy,margin:0});
    s.addText(pl1(b[2]),{x:3.12,y:yy,w:.9,h:.24,fontSize:10.5,color:C.muted,margin:0});
    const diff=b[3], max=25, bar=Math.min(2.15,Math.abs(diff)/max*2.15);
    s.addShape('line',{x:5.3,y:yy+.14,w:2.15,h:0,line:{color:'D5DEE7',width:1}});
    s.addShape('line',{x:6.375,y:yy-.02,w:0,h:.34,line:{color:'9AA8B6',width:1}});
    if(diff!==0) s.addShape('rect',{x:diff<0?6.375-bar:6.375,y:yy+.065,w:bar,h:.13,fill:{color:b[4]},line:{color:b[4]}});
    s.addText(`${diff>0?'+':''}${pl1(diff)}`,{x:7.62,y:yy,w:.8,h:.22,fontSize:10,bold:true,color:diff<0?C.red:(diff>0?C.green:C.gray),margin:0,align:'right'});
  });
  const benchHeadline=d.deficit<AVG.deficit
    ? `${name} ma o ${Math.abs(deficitVsAvg)}% mniej grup deficytowych niż wynosi średnia powiatowa województwa.`
    : d.deficit>AVG.deficit
      ? `${name} ma o ${Math.abs(deficitVsAvg)}% więcej grup deficytowych niż wynosi średnia powiatowa województwa.`
      : `${name} ma liczbę grup deficytowych zbliżoną do średniej wojewódzkiej.`;
  addCallout(s,8.65,1.62,3.85,1.15,benchHeadline,C.red,'FFF6F6');
  const unempHeadline=u==null?'Brak danych o stopie bezrobocia dla powiatu.':(unempDiff<0?`Stopa bezrobocia jest niższa od wojewódzkiej o ${pl1(Math.abs(unempDiff))} p.p.`:unempDiff>0?`Stopa bezrobocia jest wyższa od wojewódzkiej o ${pl1(unempDiff)} p.p.`:'Stopa bezrobocia odpowiada poziomowi wojewódzkiemu.');
  addCallout(s,8.65,3.05,3.85,1.02,unempHeadline,C.navy,'F5F8FB');
  addCallout(s,8.65,4.35,3.85,1.12,`Równowaga obejmuje ${pl1(balShare)}% klasyfikacji (${d.balance} z ${d.total} grup).`,C.green,'F4F9F7');

  // 4. Trendy - tylko najważniejsze
  s=pptx.addSlide('MASTER');
  addHeader(s,'Jak zmieniał się rynek pracy w latach 2024–2027',name);
  const chartOpts=(x,color)=>({x,y:1.78,w:5.72,h:3.55,showTitle:false,showLegend:true,legendPos:'b',showValue:false,catAxisLabelFontFace:'Arial',catAxisLabelFontSize:9.5,valAxisLabelFontSize:8.5,valGridLine:{color:'E7EDF3',width:1},chartColors:[color,C.gold],showMarker:true,lineSize:2.5,showBorder:false});
  s.addText('Deficyt',{x:.65,y:1.38,w:2,h:.25,fontSize:15,bold:true,color:C.red,margin:0});
  s.addChart(pptx.ChartType.line,[{name,label:name,labels:years.map(String),values:deficitT.vals},{name:'Średnia województwa',labels:years.map(String),values:deficitT.avgs}],chartOpts(.65,C.red));
  s.addText('Równowaga',{x:6.95,y:1.38,w:2.5,h:.25,fontSize:15,bold:true,color:C.green,margin:0});
  s.addChart(pptx.ChartType.line,[{name,label:name,labels:years.map(String),values:balanceT.vals},{name:'Średnia województwa',labels:years.map(String),values:balanceT.avgs}],chartOpts(6.95,C.green));
  const trendText=deficitT.vals[0]>0?`Deficyt: ${deficitT.vals[0]} → ${deficitT.vals[3]} (${decline>=0?'spadek':'wzrost'} o ${Math.abs(decline)}%).`:`Deficyt w 2024 r. wynosił 0; w 2027 r. wynosi ${deficitT.vals[3]}.`;
  addCallout(s,.65,5.65,3.8,.75,trendText,C.red,'FFF6F6');
  addCallout(s,4.75,5.65,3.8,.75,`Równowaga: ${balanceT.vals[0]} → ${balanceT.vals[3]} (${balanceT.vals[3]-balanceT.vals[0]>=0?'+':''}${balanceT.vals[3]-balanceT.vals[0]} grup).`,C.green,'F4F9F7');
  addCallout(s,8.85,5.65,3.8,.75,d.surplus===0?'Brak grup nadwyżkowych w prognozie 2027.':`Nadwyżka 2027: ${d.surplus} grup.`,C.blue,'F4F8FC');

  // 5. Zawody + wnioski
  s=pptx.addSlide('MASTER');
  addHeader(s,'Najważniejsze zawody i wnioski',`${name} • prognoza 2027`);
  const deficitJobs=countyJobsByStatus(name,'D');
  const noEvalJobs=countyJobsByStatus(name,'X');
  s.addText(`Deficyt - ${deficitJobs.length}`,{x:.7,y:1.48,w:3.9,h:.26,fontSize:15,bold:true,color:C.red,margin:0});
  const showDef=deficitJobs.slice(0,8);
  showDef.forEach((j,i)=>{
    const yy=1.88+i*.43;
    s.addShape('ellipse',{x:.72,y:yy+.05,w:.12,h:.12,fill:{color:C.red},line:{color:C.red}});
    s.addText(j.name,{x:.95,y:yy,w:4.7,h:.25,fontSize:9.5,color:C.text,margin:0,fit:'shrink'});
  });
  if(deficitJobs.length>8) s.addText(`… +${deficitJobs.length-8} kolejnych`,{x:.95,y:5.34,w:4.5,h:.2,fontSize:8.5,color:C.muted,italic:true,margin:0});
  if(!deficitJobs.length) s.addText('Brak grup deficytowych.',{x:.95,y:1.9,w:4.3,h:.28,fontSize:10,color:C.muted,margin:0});

  s.addText(`Bez oceny - ${noEvalJobs.length}`,{x:.7,y:5.78,w:3.8,h:.24,fontSize:12.5,bold:true,color:C.gray,margin:0});
  const noTxt=noEvalJobs.slice(0,5).map(j=>j.name).join(' • ') || 'Brak pozycji.';
  s.addText(noTxt,{x:.7,y:6.08,w:5.3,h:.42,fontSize:8.3,color:C.muted,margin:0,fit:'shrink'});

  s.addText('Co wynika z prognozy?',{x:6.55,y:1.48,w:4.8,h:.28,fontSize:15,bold:true,color:C.navy,margin:0});
  const findings=pptFindings(name,d,u);
  const extra=d.surplus===0?'Brak grup nadwyżkowych w 2027 r.':`W 2027 r. wskazano ${d.surplus} grup nadwyżkowych.`;
  const bullets=[
    d.deficit<AVG.deficit?`Deficyt jest niższy niż przeciętnie w województwie (${d.deficit} vs śr. ${pl1(AVG.deficit)}).`:`Deficyt wynosi ${d.deficit} grup przy średniej wojewódzkiej ${pl1(AVG.deficit)}.`,
    `Równowaga obejmuje ${pl1(balShare)}% klasyfikacji.`,
    `W latach 2024–2027 liczba grup deficytowych zmieniła się z ${deficitT.vals[0]} do ${deficitT.vals[3]}.`,
    extra,
    u==null?'Brak danych o stopie bezrobocia.':unempHeadline
  ];
  bullets.forEach((b,i)=>{
    const yy=1.95+i*.83;
    s.addShape('roundRect',{x:6.55,y:yy,w:5.7,h:.62,rectRadius:.04,fill:{color:i===0?'FFF6F6':i===1?'F4F9F7':'F7F9FB'},line:{color:'E1E8EF',width:1}});
    s.addText(String(i+1),{x:6.72,y:yy+.17,w:.28,h:.2,fontSize:9,bold:true,color:i===0?C.red:i===1?C.green:C.navy,margin:0,align:'center'});
    s.addText(b,{x:7.15,y:yy+.11,w:4.85,h:.38,fontSize:9.4,bold:i<2,color:C.text,margin:0,fit:'shrink',valign:'mid'});
  });
  s.addShape('roundRect',{x:6.55,y:6.22,w:5.7,h:.42,rectRadius:.04,fill:{color:C.navy},line:{color:C.navy}});
  s.addText(`Równowaga: ${d.balance} grup • ${pl1(balShare)}% klasyfikacji`,{x:6.78,y:6.33,w:5.25,h:.18,fontSize:9.5,bold:true,color:C.white,margin:0,align:'center'});

  if(window.reportSelectedSlides){
    const chosen=window.reportSelectedSlides;
    pptx._slides=pptx._slides.filter((slide,index)=>chosen.includes(index));
  }
  for(const c of (window.reportExtraCharts||[])){
    const slide=pptx.addSlide('MASTER');
    addHeader(slide,c.title,c.subtitle);
    try{slide.addImage({data:c.data,x:.85,y:1.40,w:11.6,h:4.15})}
    catch(e){slide.addText('Nie udało się osadzić wykresu SVG.',{x:1,y:2,w:11,h:.4,fontSize:14,color:C.red})}
    if(c.insight)slide.addText(c.insight,{x:.85,y:5.65,w:11.7,h:.52,fontSize:11,color:C.text,margin:0,breakLine:false,fit:'shrink'});
    if(c.note)slide.addText(c.note,{x:.85,y:6.25,w:11.7,h:.45,fontSize:8.8,color:C.muted,margin:0,fit:'shrink'});
    if(c.source)slide.addText(c.source,{x:.85,y:6.85,w:11.7,h:.22,fontSize:7,color:C.muted,margin:0,fit:'shrink'});
  }
  // Sort exported slides by the presentation narrative, independently of selection order.
  if(window.reportSelectedSlides){
    const originalIds=['cover','overview','benchmark','trends','jobs'];
    const slideIds=window.reportSelectedSlides.map(i=>originalIds[i]).concat((window.reportExtraCharts||[]).map(c=>c.id));
    const priority=new Map(reportChoices.map(([id],i)=>[id,i]));
    pptx._slides=pptx._slides.map((slide,i)=>({slide,id:slideIds[i],seq:i}))
      .sort((a,b)=>(priority.get(a.id)??999)-(priority.get(b.id)??999)||a.seq-b.seq).map(x=>x.slide);
  }
  // PptxGenJS keeps the original slide numbers even after filtering/sorting.
  // Renumber, otherwise PowerPoint reorders by stale numbers and breaks the narrative.
  pptx._slides.forEach((slide,index)=>{slide._slideNum=index+1;slide._slideId=256+index;slide._rId=index+2});
  const safe=name.replace(/[\\/:*?"<>|]/g,'_');
  await pptx.writeFile({fileName:`Prognoza rynku pracy 2027 - ${safe}.pptx`});
}


// ===== v3: moduły analityczne =====
function renderAnalyticSignals(name){
  const box=document.getElementById('analyticSignals'); if(!box||!DATA[name]) return;
  const d=DATA[name], u=UNEMPLOYMENT[name], share=d.total?100*d.balance/d.total:0;
  const p24=trendPoint(name,2024), change24=p24?d.deficit-p24.deficit:null;
  const rank=Object.entries(DATA).sort((a,b)=>a[1].deficit-b[1].deficit).findIndex(([n])=>n===name)+1;
  const signals=[];
  if(change24!==null) signals.push({c:change24<0?'good':change24>0?'bad':'neutral',t:`Deficyt ${change24<0?'spadł':change24>0?'wzrósł':'nie zmienił się'} od 2024 r.`,d:`${p24.deficit} → ${d.deficit} grup (${change24>0?'+':''}${change24}).`});
  signals.push({c:share>=90?'good':'info',t:`${pl1(share)}% grup w równowadze`,d:`${d.balance} z ${d.total} ocenionych grup zawodów w 2027 r.`});
  if(u!=null){const du=Math.round((u-VOIV_UNEMPLOYMENT)*10)/10;signals.push({c:du<0?'good':du>0?'bad':'neutral',t:`Bezrobocie ${du<0?'poniżej':du>0?'powyżej':'na poziomie'} województwa`,d:`${pl1(u)}% wobec ${pl1(VOIV_UNEMPLOYMENT)}% w województwie (${du>0?'+':''}${pl1(du)} p.p.).`});}
  signals.push({c:d.surplus===0?'good':'info',t:d.surplus===0?'Brak grup nadwyżkowych':`${d.surplus} grup nadwyżkowych`,d:d.surplus===0?'W 2027 r. nie wskazano żadnej grupy w nadwyżce.':'Warto sprawdzić, których zawodów dotyczy nadwyżka.'});
  signals.push({c:'info',t:`Pozycja ${rank}. pod względem liczby deficytów`,d:`Ranking rosnący wśród ${Object.keys(DATA).length} powiatów i miast na prawach powiatu.`});
  box.innerHTML=signals.slice(0,4).map(s=>`<div class="analyticSignal ${s.c}"><b>${escapeHtml(s.t)}</b><span>${escapeHtml(s.d)}</span></div>`).join('');
  const pill=document.getElementById('signalCounty'); if(pill) pill.textContent=name;
}

function populateCompareSelects(){
  const first=document.getElementById('compare1');
  if(first&&!first.value){
    const initial=(active&&DATA[active])?active:(DATA['Katowice']?'Katowice':'');
    if(initial) first.value=initial;
  }
  bindCompareOptions();
  syncComparePickers();
}
function syncComparePickers(){
  document.querySelectorAll('.comparePicker').forEach(picker=>{
    const target=document.getElementById(picker.dataset.target), menu=picker.querySelector('.comparePickerMenu'), txt=picker.querySelector('.comparePickerText');
    if(!target||!menu||!txt) return;
    txt.textContent=target.value||'— wybierz —';
    menu.querySelectorAll('.comparePickerOption').forEach(opt=>opt.classList.toggle('active',(opt.dataset.value||'')===target.value));
  });
}
function bindCompareOptions(){
  document.querySelectorAll('.comparePicker').forEach(picker=>{
    const target=document.getElementById(picker.dataset.target), menu=picker.querySelector('.comparePickerMenu'), txt=picker.querySelector('.comparePickerText');
    if(!target||!menu||picker.dataset.bound==='1') return;
    picker.dataset.bound='1';
    menu.addEventListener('click',e=>{
      const opt=e.target.closest('.comparePickerOption'); if(!opt) return;
      e.stopPropagation();
      target.value=opt.dataset.value||'';
      txt.textContent=target.value||'— wybierz —';
      picker.classList.remove('open');
      picker.querySelector('.comparePickerBtn')?.setAttribute('aria-expanded','false');
      syncComparePickers();
      renderComparison();
    });
  });
}
function initComparePickers(){
  document.querySelectorAll('.comparePicker').forEach(picker=>{
    const btn=picker.querySelector('.comparePickerBtn');
    btn.addEventListener('click',e=>{
      e.stopPropagation(); const willOpen=!picker.classList.contains('open');
      document.querySelectorAll('.comparePicker.open').forEach(p=>{p.classList.remove('open');p.querySelector('.comparePickerBtn')?.setAttribute('aria-expanded','false')});
      picker.classList.toggle('open',willOpen); btn.setAttribute('aria-expanded',String(willOpen));
    });
  });
  document.addEventListener('click',()=>document.querySelectorAll('.comparePicker.open').forEach(p=>{p.classList.remove('open');p.querySelector('.comparePickerBtn')?.setAttribute('aria-expanded','false')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.comparePicker.open').forEach(p=>{p.classList.remove('open');p.querySelector('.comparePickerBtn')?.setAttribute('aria-expanded','false')})});
}
function renderComparison(){
  const names=[1,2,3].map(i=>document.getElementById(`compare${i}`)?.value).filter((n,i,a)=>n&&a.indexOf(n)===i);
  const out=document.getElementById('compareOutput'); if(!out) return;
  if(names.length<2){out.innerHTML='<div class="hint">Wybierz co najmniej dwa różne powiaty.</div>';return;}
  const metrics=[['Deficyt','deficit','min'],['Równowaga','balance','max'],['Nadwyżka','surplus','min'],['Bez oceny','no_eval','min'],['Stopa bezrobocia','unemp','min']];
  let rows='';
  metrics.forEach(([label,key,best])=>{
    const vals=names.map(n=>key==='unemp'?UNEMPLOYMENT[n]:DATA[n][key]); const valid=vals.filter(Number.isFinite); const target=best==='max'?Math.max(...valid):Math.min(...valid);
    rows+=`<tr><td>${label}</td>`+vals.map((v,i)=>`<td class="${Number.isFinite(v)&&v===target?'compareBest':''}">${v==null?'—':(key==='unemp'?pl1(v)+'%':v)}</td>`).join('')+'</tr>';
  });
  rows+=`<tr><td>Zmiana deficytu vs 2026</td>`+names.map(n=>{const v=DATA[n].delta_deficit;return `<td>${v>0?'+':''}${v}</td>`}).join('')+'</tr>';
  out.innerHTML=`<table class="compareTable"><thead><tr><th>Wskaźnik</th>${names.map(n=>`<th>${escapeHtml(n)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`;
}

function renderOccupationProfile(){
  const root=document.getElementById('occProfileBody'), title=document.getElementById('occProfileTitle'), sub=document.getElementById('occProfileSub'); if(!root) return;
  if(!selectedOccupation||!OCC_DATA[selectedOccupation]){title.textContent='Wybierz zawód, aby zobaczyć profil wojewódzki';sub.textContent='Mapa, statusy w 36 jednostkach oraz koncentracja deficytu.';root.className='occProfileEmpty';root.innerHTML='Wybierz zawód z listy nad mapą albo kliknij zawód w profilu powiatu.';return;}
  const rec=OCC_DATA[selectedOccupation], groups={DD:[],D:[],R:[],N:[],X:[]};
  WANTED.forEach((n,i)=>{const s=rec.s[i]||'X';(groups[s]||(groups[s]=[])).push(n)});
  const deficitN=groups.D.length+groups.DD.length;
  title.textContent=selectedOccupation; sub.textContent=`Branża: ${rec.branch||'—'} • kod: ${rec.code||'—'} • status w 36 jednostkach`;
  root.className='occProfileGrid';
  const cards=[['Deficyt',deficitN,'#c74d56'],['Równowaga',groups.R.length,'#3b8f75'],['Nadwyżka',groups.N.length,'#2f6fb0'],['Bez oceny',groups.X.length,'#7d8997']];
  const left=`<div><div class="occKpis">${cards.map(([l,n,c])=>`<div class="occKpi"><div class="l">${l}</div><div class="n" style="color:${c}">${n}</div></div>`).join('')}</div><div class="analyticSignal info" style="margin-top:10px"><b>Koncentracja deficytu</b><span>${deficitN} z ${WANTED.length} jednostek (${pl1(100*deficitN/WANTED.length)}%) wskazuje deficyt lub duży deficyt.</span></div></div>`;
  const labels={DD:'Duży deficyt',D:'Deficyt',R:'Równowaga',N:'Nadwyżka',X:'Bez oceny'};
  // Pełny wykaz: żadnych limitów ani skrótów typu „+3”. Równowaga jest osobną kategorią.
  const right=`<div class="occCountyGroups">${['DD','D','R','N','X'].map(s=>`<div class="occStatusGroup"><h4 style="color:${OCC_STATUS[s].color}">${labels[s]} • ${groups[s].length}</h4><div class="occTags">${groups[s].length?groups[s].map(n=>`<button type="button" class="occTag" data-county="${escapeHtml(n)}" title="Przejdź do profilu: ${escapeHtml(n)}">${escapeHtml(n)}</button>`).join(''):'<span class="hint">Brak</span>'}</div></div>`).join('')}</div>`;
  root.innerHTML=left+right; root.querySelectorAll('.occTag').forEach(b=>b.addEventListener('click',()=>selectCounty(b.dataset.county)));
}

// Minimalny generator XLSX bez zewnętrznego CDN (OOXML + ZIP store)
function xlsxXmlEscape(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function xlsxCol(n){let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s}
function crc32(bytes){let c=-1;for(const b of bytes){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xEDB88320:0)}return (c^(-1))>>>0}
function u16(n){return [n&255,(n>>>8)&255]} function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]}
function zipStore(files){const enc=new TextEncoder(), chunks=[], central=[];let offset=0;for(const [name,content] of files){const nb=enc.encode(name),data=enc.encode(content),crc=crc32(data);const local=new Uint8Array([0x50,0x4b,0x03,0x04,...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(data.length),...u32(data.length),...u16(nb.length),...u16(0),...nb]);chunks.push(local,data);central.push(new Uint8Array([0x50,0x4b,0x01,0x02,...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(data.length),...u32(data.length),...u16(nb.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...nb]));offset+=local.length+data.length}const csize=central.reduce((a,b)=>a+b.length,0),end=new Uint8Array([0x50,0x4b,0x05,0x06,...u16(0),...u16(0),...u16(central.length),...u16(central.length),...u32(csize),...u32(offset),...u16(0)]);return new Blob([...chunks,...central,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
function sheetXml(rows){let xml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>';rows.forEach((row,r)=>{xml+=`<row r="${r+1}">`;row.forEach((v,c)=>{if(v===null||v===undefined)return;const ref=xlsxCol(c)+(r+1),style=r===0?' s="1"':'';if(typeof v==='number'&&Number.isFinite(v))xml+=`<c r="${ref}"${style}><v>${v}</v></c>`;else xml+=`<c r="${ref}" t="inlineStr"${style}><is><t>${xlsxXmlEscape(v)}</t></is></c>`});xml+='</row>'});return xml+'</sheetData></worksheet>'}
function generateXLSX(){
  const name=active||'Katowice',d=DATA[name],years=[2024,2025,2026,2027];if(!d)return;
  const profile=[['Wskaźnik','Wartość','Zmiana / benchmark'],['Powiat',name,''],['Deficyt',d.deficit,d.delta_deficit],['Równowaga',d.balance,d.delta_balance],['Nadwyżka',d.surplus,d.delta_surplus],['Bez oceny',d.no_eval,d.delta_no_eval],['Stopa bezrobocia',UNEMPLOYMENT[name]??'',`stan na 31.08.2026 r. • woj. ${VOIV_UNEMPLOYMENT}%`]];
  const trends=[['Rok','Deficyt','Równowaga','Nadwyżka','Bez oceny','Liczba grup'],...years.map(y=>{const t=trendPoint(name,y);return [y,t.deficit,t.balance,t.surplus,t.no_eval,t.total]})];
  const jobs=[['Zawód','Status','Branża','Kod']];['D','R','N','X'].forEach(s=>countyJobsByStatus(name,s).forEach(j=>jobs.push([j.name,{D:'Deficyt',R:'Równowaga',N:'Nadwyżka',X:'Bez oceny'}[s],j.branch,j.code])));
  const benchmark=[['Wskaźnik','Powiat','Średnia wojewódzka','Różnica'],['Deficyt',d.deficit,AVG.deficit,d.deficit-AVG.deficit],['Równowaga',d.balance,AVG.balance,d.balance-AVG.balance],['Nadwyżka',d.surplus,AVG.surplus,d.surplus-AVG.surplus],['Bez oceny',d.no_eval,AVG.no_eval,d.no_eval-AVG.no_eval],['Stopa bezrobocia',UNEMPLOYMENT[name]??'',VOIV_UNEMPLOYMENT,(UNEMPLOYMENT[name]??VOIV_UNEMPLOYMENT)-VOIV_UNEMPLOYMENT]];
  const sheets=[['Profil',profile],['Trendy',trends],['Zawody',jobs],['Benchmark',benchmark]];
  const files=[];files.push(['[Content_Types].xml',`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`]);
  files.push(['_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>']);
  files.push(['xl/workbook.xml',`<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map(([n],i)=>`<sheet name="${xlsxXmlEscape(n)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')}</sheets></workbook>`]);
  files.push(['xl/_rels/workbook.xml.rels',`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`]);
  files.push(['xl/styles.xml','<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Aptos"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Aptos"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF173D66"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="1" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs></styleSheet>']);
  sheets.forEach(([_,rows],i)=>files.push([`xl/worksheets/sheet${i+1}.xml`,sheetXml(rows)]));
  const blob=zipStore(files),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`Prognoza rynku pracy 2027 - ${name.replace(/[\\/:*?"<>|]/g,'_')}.xlsx`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}


function toggleHistoryYear(year, btn){
  const card=document.querySelector(`.historyYearCard[data-year="${year}"]`);
  if(!card) return;
  const open=!card.classList.contains('open');
  card.classList.toggle('open',open);
  if(btn){
    btn.setAttribute('aria-expanded',open?'true':'false');
    const label=btn.querySelector('span');
    if(label) label.textContent=open?'Ukryj zawody':'Pokaż zawody';
  }
  const panel=card.querySelector('.historyJobsPanel');
  if(panel){
    panel.hidden=!open;
    panel.setAttribute('aria-hidden',open?'false':'true');
    panel.style.display=open?'block':'none';
  }
}

// Awaryjna obsługa akordeonu - działa nawet jeśli inline handler zostanie usunięty przez przeglądarkę/CSP.
document.addEventListener('click',function(e){
  const btn=e.target.closest('.historyYearToggle');
  if(!btn) return;
  const year=btn.dataset.year;
  if(!year) return;
  // Inline onclick już wykonał akcję; zabezpieczenie uruchamiamy tylko gdy event nie pochodzi z aktywnego handlera.
  if(!btn.hasAttribute('onclick')) toggleHistoryYear(year,btn);
});

function initHistoryArchiveJobs(){
  document.querySelectorAll('.historyJobsSearch').forEach(inp=>{
    inp.addEventListener('input',()=>{
      const q=normalize(inp.value);
      const panel=inp.closest('.historyJobsPanel'); if(!panel) return;
      panel.querySelectorAll('.historyJob').forEach(el=>{el.style.display=!q||normalize(el.textContent).includes(q)?'':'none';});
    });
  });
}
function syncUrlState(){try{const p=new URLSearchParams(location.search);active?p.set('powiat',active):p.delete('powiat');selectedOccupation?p.set('zawod',selectedOccupation):p.delete('zawod');history.replaceState(null,'',location.pathname+(p.toString()?'?'+p.toString():'')+location.hash)}catch(e){}}
function restoreUrlState(){try{const p=new URLSearchParams(location.search),c=p.get('powiat'),o=p.get('zawod');if(c&&DATA[c])selectCounty(c);if(o&&OCC_DATA[o])setOccupation(o)}catch(e){}}

async function loadExternalDataOverrides(){ return true; /* Centralny plik dane.json jest wczytany przez bootstrap. */ }

async function generatePDF(){
  // Drukuj dane aktualnie wybranego powiatu, nigdy domyślnych Katowic.
  const name=getReportCounty();
  if(!name){alert('Wybierz powiat przed wygenerowaniem PDF.');return;}
  buildPrintReport();
  const basePages=[...document.querySelectorAll('#printReport > .pdfPage')];
  basePages.forEach((page,i)=>page.classList.toggle('reportExcluded',
    Array.isArray(window.reportSelectedPdfPages)&&!window.reportSelectedPdfPages.includes(i)));
  if(window.reportExtraCharts?.length)appendChartPdfPages(window.reportExtraCharts);
  if(Array.isArray(window.reportSelectedPdfPages)){
    const report=document.getElementById('printReport');
    const keys=['cover','benchmark','trends','jobs'];
    const pages=[...report.querySelectorAll(':scope > .pdfPage')];
    const chartPages=pages.filter(p=>p.classList.contains('exportChartPage'));
    const regularPages=pages.filter(p=>!p.classList.contains('exportChartPage'));
    const items=regularPages.map((node,i)=>({node,id:keys[i]||'jobs',seq:i}));
    chartPages.forEach((node,i)=>items.push({node,id:(window.reportExtraCharts||[])[i]?.id||'jobs',seq:regularPages.length+i}));
    const priority=new Map(reportChoices.map(([id],i)=>[id,i]));
    items.sort((a,b)=>(priority.get(a.id)??999)-(priority.get(b.id)??999)||a.seq-b.seq).forEach(x=>report.appendChild(x.node));
  }
  const now=new Date();
  const selected=name;
  document.getElementById('pdfStamp').textContent=`Widok: ${selected} • wygenerowano ${now.toLocaleDateString('pl-PL')} ${now.toLocaleTimeString('pl-PL',{hour:'2-digit',minute:'2-digit'})}`;
  const win=window.open('','_blank');
  if(!win){alert('Zezwól na otwarcie okna raportu PDF dla tej strony.');return;}
  const css=JSON.parse(document.getElementById('exportPrintCss').textContent)+window.EXPORT_BRAND.css;
  win.document.write('<!doctype html><html lang="pl"><meta charset="utf-8"><title>Prognoza rynku pracy 2027 - '+escapeHtml(selected)+'</title><style>'+css+'</style><body class="brandPrint">'+window.EXPORT_BRAND.markup()+'<button class="printButton" onclick="window.print()">Drukuj lub zapisz jako PDF</button><div id="printReport">'+document.getElementById('printReport').innerHTML+'</div></body></html>');
  win.document.close();
  window.reportSelectedPdfPages=null;window.reportExtraCharts=null;
  await Promise.all([...win.document.images].map(img=>img.decode?.().catch(()=>{})||Promise.resolve()));
  win.print();
}

const reportChoices=[
  ['cover','01 · Strona tytułowa','Podsumowanie i najważniejsze wskaźniki'],
  ['overview','02 · Profil powiatu i mapa','Oceny zawodów, struktura i mapa'],
  ['unemp-rate-monthly','03 · Bezrobocie – stopa 2026','Miesiące: Śląskie na tle Polski'],
  ['unemp-rate-annual','Bezrobocie – stopa 2016–2025','Porównanie historyczne'],
  ['unemp-count-monthly','Bezrobocie – liczba osób 2026','Dane miesięczne'],
  ['unemp-count-annual','Bezrobocie – liczba osób 2016–2025','Dane historyczne'],
  ['county-rate-monthly','Bezrobocie powiatów – miesiące wybranego roku','2016–2026 · wybrany powiat'],
  ['county-rate-annual','Bezrobocie powiatów – lata 2016–2025','Szereg grudniowy wybranego powiatu'],
  ['county-compare-monthly','Porównanie powiatów – wybrany rok','Do czterech powiatów na jednym wykresie'],
  ['county-compare-annual','Porównanie powiatów – 2016–2025','Do czterech powiatów na jednym wykresie'],
  ['county-map','Mapa bezrobocia w powiatach','Dostępne okresy i poziomy bezrobocia'],
  ['county-count-monthly','Bezrobocie powiatów – liczba osób · miesiące','Wybierany rok i powiat'],
  ['county-count-annual','Bezrobocie powiatów – liczba osób · grudzień','Grudzień 2016–2025'],
  ['county-count-compare-monthly','Liczba bezrobotnych – porównanie · miesiące','Do czterech powiatów'],
  ['county-count-compare-annual','Liczba bezrobotnych – porównanie · grudzień','Do czterech powiatów'],
  ['county-count-map','Mapa bezrobocia – liczba osób','Wybrany miesiąc'],
  ['bael-historic','04 · BAEL – aktywność 2016–2025','Śląskie i Polska, IV kwartał każdego roku'],
  ['bael-employment-historic','BAEL – zatrudnienie 2024–2025','Śląskie i Polska, porównanie kwartalne'],
  ['bael-current','BAEL – aktywność 2026','Polska 2026 i ostatni potwierdzony punkt Śląskiego 2025'],
  ['bael-employment-current','BAEL – zatrudnienie 2026','Polska 2026 i ostatni potwierdzony punkt Śląskiego 2025'],
  ['regon-current','05 · REGON – rok 2026','Liczba podmiotów'],
  ['regon-historic','REGON – historia','Podmioty na 10 tys. mieszkańców'],
  ['benchmark','06 · Porównanie z województwem','Benchmark i odchylenia od średniej'],
  ['trends','07 · Trendy 2024–2027','Zmiany deficytu i równowagi'],
  ['rank-deficit-most','08 · Najwięcej grup deficytowych','Ranking powiatów w 2027'],
  ['rank-deficit-least','Najmniej grup deficytowych','Ranking powiatów w 2027'],
  ['rank-jobs-most','Najczęstsze zawody deficytowe','Ranking zawodów w 2027'],
  ['rank-jobs-least','Najrzadsze zawody deficytowe','Ranking zawodów w 2027'],
  ['occupation-profile','09 · Profil wybranego zawodu','Tylko po wybraniu zawodu na mapie'],
  ['jobs','10 · Zawody i wnioski','Podsumowanie i interpretacja']
];
const reportDialog=document.getElementById('reportDialog');
const reportCountySelect=document.getElementById('reportCountySelect');
reportCountySelect.innerHTML='<option value="">— wybierz powiat do raportu —</option>'+
  WANTED.slice().sort((a,b)=>a.localeCompare(b,'pl')).map(n=>`<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
reportCountySelect.addEventListener('change',()=>{
  if(DATA[reportCountySelect.value])selectCounty(reportCountySelect.value);
  window.countyUnemploymentSyncReport?.();
});
function confirmReportCounty(){
  const name=reportCountySelect.value;
  if(!name||!DATA[name]){
    alert('Wybierz powiat lub miasto w polu „Powiat / miasto dla raportu”. Dokument nie zostanie wygenerowany dla innych danych.');
    reportCountySelect.focus();
    return false;
  }
  if(getReportCounty()!==name)selectCounty(name);
  return true;
}
const reportItems=document.getElementById('reportItems');
const reportSelection=new Set(reportChoices.map(x=>x[0]));
reportItems.innerHTML=reportChoices.map(([id,title,sub])=>`<label class="reportOption"><input type="checkbox" value="${id}" checked><span><b>${title}</b><small>${sub}</small></span></label>`).join('');
// BAEL 2026 is not a comparable Śląskie–Polska series until the regional values
// for matching 2026 quarters are both available AND supported by the chart renderer.
function syncBaelReportChoices(){
  for(const id of ['bael-current','bael-employment-current']){
    const box=reportItems.querySelector(`input[value="${id}"]`);if(!box)continue;
    // Current renderer is explicitly a mixed 2025/2026 chart; never export it as a valid comparison.
    box.disabled=true;box.checked=false;
    const label=box.closest('label');label.style.opacity='.55';
    label.title='Brak porównywalnych danych Śląskiego i Polski za te same kwartały 2026.';
    if(!label.querySelector('.reportAvailability')){
      const note=document.createElement('small');note.className='reportAvailability';
      note.textContent='Niedostępne: brak potwierdzonej serii Śląskiego za 2026.';
      note.style.cssText='display:block;color:#8a4a45;margin-top:4px;line-height:1.4';
      label.querySelector('span')?.append(note);
    }
  }
}
function syncOccupationReportChoice(){
 const box=reportItems.querySelector('input[value="occupation-profile"]');
 if(!box)return;
 const ready=!!(selectedOccupation&&OCC_DATA[selectedOccupation]);
 box.disabled=!ready;
 box.closest('label').style.display=ready?'':'none';
 if(!ready)box.checked=false;
 else if(box.dataset.seen!==selectedOccupation){box.checked=true;box.dataset.seen=selectedOccupation}
}
function syncReportSelection(){
  reportSelection.clear();reportItems.querySelectorAll('input:checked:not(:disabled)').forEach(e=>reportSelection.add(e.value));
  document.getElementById('reportCount').textContent=`Do eksportu: ${reportSelection.size} elementów (niedostępne są wyłączone)`;
  document.getElementById('reportPdf').disabled=document.getElementById('reportPpt').disabled=!reportSelection.size;
}
reportItems.addEventListener('change',syncReportSelection);
syncReportSelection();
document.getElementById('reportClose').addEventListener('click',()=>reportDialog.close());
function openReportDialog(){
  syncOccupationReportChoice();
  syncBaelReportChoices();
  window.countyUnemploymentSyncReport?.();
  syncReportSelection();
  reportCountySelect.value=getReportCounty();
  reportDialog.showModal();
}
document.getElementById('pdfBtn').addEventListener('click',openReportDialog);
document.getElementById('pptBtn').addEventListener('click',openReportDialog);
const reportChartSpecs={
 'unemp-rate-monthly':['gusUnempChart','Bezrobocie – stopa, miesiące 2026',[['unemp-metric','rate'],['unemp-mode','monthly']],'gusUnemp'],
 'unemp-rate-annual':['gusUnempChart','Bezrobocie – stopa, lata 2016–2025',[['unemp-metric','rate'],['unemp-mode','annual']],'gusUnemp'],
 'unemp-count-monthly':['gusUnempChart','Bezrobocie – liczba osób, miesiące 2026',[['unemp-metric','count'],['unemp-mode','monthly']],'gusUnemp'],
 'unemp-count-annual':['gusUnempChart','Bezrobocie – liczba osób, lata 2016–2025',[['unemp-metric','count'],['unemp-mode','annual']],'gusUnemp'],
 'bael-historic':['gusBaelChart','BAEL – aktywność: Śląskie vs Polska 2016–2025',[['bael-mode','activity'],['bael-period','historic']],'gusBael'],
 'bael-employment-historic':['gusBaelChart','BAEL – zatrudnienie: Śląskie vs Polska 2024–2025',[['bael-mode','employment'],['bael-period','historic']],'gusBael'],
 'bael-employment-current':['gusBaelChart','BAEL – zatrudnienie: Śląskie 2025, Polska 2026',[['bael-mode','employment'],['bael-period','current']],'gusBael'],
 'bael-current':['gusBaelChart','BAEL – aktywność: Śląskie 2025, Polska 2026',[['bael-mode','activity'],['bael-period','current']],'gusBael'],
 'regon-historic':['gusRegonChart','REGON – podmioty na 10 tys. ludności',[['regon-mode','historic']],'gusRegon'],
 'regon-current':['gusRegonChart','REGON – liczba podmiotów w 2026',[['regon-mode','current']],'gusRegon']
};
const rankExportSpecs={
 'rank-deficit-most':['countyRank','Najwięcej grup deficytowych w 2027','Liczba grup zawodów w deficycie w powiecie'],
 'rank-deficit-least':['countyRankLow','Najmniej grup deficytowych w 2027','Liczba grup zawodów w deficycie w powiecie'],
 'rank-jobs-most':['occupationRank','Najczęściej wskazywane zawody deficytowe','Liczba powiatów wskazujących zawód w deficycie'],
 'rank-jobs-least':['occupationRankLow','Najrzadziej wskazywane zawody deficytowe','Liczba powiatów wskazujących zawód w deficycie']
};
function captureRankChart(id){
 const [elementId,title,subtitle]=rankExportSpecs[id];
 const root=document.getElementById(elementId);
 if(!root)return null;
 const rows=[...root.querySelectorAll('.rankitem')].map(item=>({
  name:item.querySelector('.rankname')?.getAttribute('title')||item.querySelector('.rankname')?.textContent?.trim()||'',
  value:Number(item.querySelector('b')?.textContent?.trim()||0)
 }));
 if(!rows.length)return null;
 const W=1100,H=630,left=435,barMax=950,max=Math.max(1,...rows.map(r=>r.value));
 const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const label=t=>t.length>53?t.slice(0,50)+'…':t;
 const body=rows.map((r,i)=>{
  const y=48+i*55;const width=Math.max(3,(barMax-left)*r.value/max);
  return `<text x="${left-15}" y="${y+22}" fill="#273e57" font-family="Arial,sans-serif" font-size="20" text-anchor="end">${esc(label(r.name))}</text><rect x="${left}" y="${y}" width="${barMax-left}" height="30" rx="7" fill="#edf2f7"/><rect x="${left}" y="${y}" width="${width}" height="30" rx="7" fill="${id.includes('least')?'#548ca8':'#d45e65'}"/><text x="${barMax+22}" y="${y+23}" fill="#173d66" font-family="Arial,sans-serif" font-size="21" font-weight="bold">${r.value}</text>`;
 }).join('');
 const markup=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#ffffff"/>${body}</svg>`;
 return {id,title,subtitle,note:'Ranking przedstawia 10 pozycji. Dane: Barometr Zawodów 2027, województwo śląskie.',insight:'',source:'Źródło: Barometr Zawodów 2027 – prognoza dla województwa śląskiego.',markup,data:'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(markup)))};
}
function captureOccupationProfile(){
 if(!selectedOccupation||!OCC_DATA[selectedOccupation])return null;
 const rec=OCC_DATA[selectedOccupation];
 const groups={DD:[],D:[],R:[],N:[],X:[]};
 WANTED.forEach((county,i)=>{const code=(rec.s&&rec.s[i])||'X';(groups[code]||groups.X).push(county)});
 const defs=groups.D.length+groups.DD.length;
 const rows=[['Duży deficyt',groups.DD.length,'#9c2b38'],['Deficyt',groups.D.length,'#c74d56'],['Równowaga',groups.R.length,'#3b8f75'],['Nadwyżka',groups.N.length,'#2f6fb0'],['Bez oceny',groups.X.length,'#7d8997']];
 const esc=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const lines=rows.map(([label,count,color],i)=>{const y=110+i*92;return `<text x="55" y="${y}" font-size="27" font-family="Arial" fill="#243f59">${esc(label)}</text><rect x="315" y="${y-28}" width="520" height="36" rx="9" fill="#e9eff5"/><rect x="315" y="${y-28}" width="${Math.max(0,520*count/WANTED.length)}" height="36" rx="9" fill="${color}"/><text x="865" y="${y}" font-size="28" font-family="Arial" font-weight="bold" fill="#243f59">${count}</text>`}).join('');
 const deficitPlaces=[...groups.DD,...groups.D].join(', ')||'Brak powiatów z deficytem';
 const title=`Profil zawodu – ${selectedOccupation}`;
 const markup=`<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="680" viewBox="0 0 1100 680"><rect width="1100" height="680" fill="#ffffff"/><text x="55" y="50" font-size="24" font-family="Arial" fill="#173d66">Status zawodu w ${WANTED.length} jednostkach</text>${lines}<text x="55" y="610" font-size="22" font-family="Arial" fill="#173d66" font-weight="bold">Deficyt łącznie: ${defs} z ${WANTED.length} jednostek</text><text x="55" y="649" font-size="19" font-family="Arial" fill="#52677b">Branża: ${esc(rec.branch||'brak danych')} • Kod: ${esc(rec.code||'brak danych')}</text></svg>`;
 return {id:'occupation-profile',title,subtitle:`Barometr Zawodów 2027 • status w województwie śląskim`,markup,data:'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(markup))),note:`Jednostki z deficytem: ${deficitPlaces}.`,insight:`Deficyt w ${defs} z ${WANTED.length} jednostek.`,source:'Źródło: Barometr Zawodów 2027'};
}
// Dodatkowa strona/slajd z pełnymi nazwami powiatów z profilu zawodu.
function captureOccupationCountyLists(){
 if(!selectedOccupation||!OCC_DATA[selectedOccupation])return null;
 const rec=OCC_DATA[selectedOccupation], groups={DD:[],D:[],R:[],N:[],X:[]};
 WANTED.forEach((name,i)=>{const code=rec.s?.[i]||'X';(groups[code]||groups.X).push(name)});
 const rows=[['DD','Duży deficyt','#982b40'],['D','Deficyt','#c74d56'],['R','Równowaga','#29866c'],['N','Nadwyżka','#2f6fb0'],['X','Bez oceny','#77879a']];
 const esc=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const wrap=(names,max=91)=>{
   if(!names.length)return ['Brak'];
   const lines=[];let line='';
   for(const name of names){const next=line?line+'  •  '+name:name;
     if(next.length>max&&line){lines.push(line);line=name;}else line=next;
   }
   if(line)lines.push(line);
   return lines;
 };
 let y=52,body='';
 for(const [key,label,color] of rows){
   const lines=wrap(groups[key]);
   body+=`<rect x="38" y="${y-23}" width="6" height="30" rx="3" fill="${color}"/><text x="59" y="${y}" font-size="25" font-weight="bold" font-family="Arial,sans-serif" fill="${color}">${esc(label)} · ${groups[key].length}</text>`;
   y+=34;
   for(const line of lines){body+=`<text x="59" y="${y}" font-size="20" font-family="Arial,sans-serif" fill="#263853">${esc(line)}</text>`;y+=27;}
   y+=21;
 }
 const height=Math.max(660,y+35),markup=`<svg xmlns="http://www.w3.org/2000/svg" width="1160" height="${height}" viewBox="0 0 1160 ${height}"><rect width="1160" height="${height}" fill="#fff"/>${body}</svg>`;
 return {id:'occupation-profile-lists',title:'Profil zawodu – wszystkie powiaty',subtitle:selectedOccupation,markup,data:'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(markup))),note:'Pełny wykaz 36 jednostek w pięciu statusach, bez ukrywania nazw.',source:'Źródło: Barometr Zawodów 2027'};
}
function captureSelectedCharts(){
 const activeBefore={};
 for(const attr of ['unemp-metric','unemp-mode','bael-mode','bael-period','regon-mode'])activeBefore[attr]=document.querySelector(`[data-${attr}].active`)?.dataset[attr];
 const images=[];
 const change=(attr,value)=>{const b=document.querySelector(`[data-${attr}="${value}"]`);if(b&&!b.classList.contains('active'))b.click()};
 try{
  for(const id of reportChoices.map(x=>x[0]).filter(x=>reportSelection.has(x)&&rankExportSpecs[x])){
   const chart=captureRankChart(id);if(chart)images.push(chart);
 }
 for(const id of reportChoices.map(x=>x[0]).filter(x=>reportSelection.has(x)&&reportChartSpecs[x]&&!['bael-current','bael-employment-current'].includes(x))){
   const [svgId,title,controls,prefix]=reportChartSpecs[id];
   controls.forEach(([a,v])=>change(a,v));
   const original=document.getElementById(svgId);
   if(!original)continue;
   const svg=original.cloneNode(true);svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
   svg.querySelectorAll('[data-tooltip],.chartTooltip,.chart-tooltip').forEach(el=>el.remove());
   const markup=new XMLSerializer().serializeToString(svg);
   const subtitle=document.getElementById(prefix+'Subtitle')?.textContent||'';
   const note=document.getElementById(prefix+'ChartNote')?.textContent||'';
   const insight=document.getElementById(prefix+'Insight')?.textContent||'';
   const source=document.getElementById(prefix+'Source')?.textContent||'';
   images.push({id,title,subtitle,note,insight,source,markup,data:'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(markup)))});
  }
 }finally{Object.entries(activeBefore).forEach(([a,v])=>{if(v)change(a,v)})}
 for(const id of reportChoices.map(x=>x[0]).filter(x=>reportSelection.has(x)&&x.startsWith('county-'))){ const chart=window.countyUnemploymentCapture?.(id);if(chart)images.push(chart); }
 if(reportSelection.has('occupation-profile')){
   const profile=captureOccupationProfile();if(profile){
     images.push(profile);
     const fullList=captureOccupationCountyLists();if(fullList)images.push(fullList);
   }
 }
 const order=new Map(reportChoices.map(([id],i)=>[id,i]));
 const orderOf=id=>id==='occupation-profile-lists'?(order.get('occupation-profile')??999)+.1:(order.get(id)??999);
 images.sort((a,b)=>orderOf(a.id)-orderOf(b.id));
 return images;
}
function appendChartPdfPages(charts){
 const report=document.getElementById('printReport');
 charts.forEach(c=>{
  const section=document.createElement('section');section.className='pdfPage exportChartPage';
  const h=document.createElement('h1');h.textContent=c.title;section.append(h);
  const sub=document.createElement('p');sub.className='exportChartSubtitle';sub.textContent=c.subtitle;section.append(sub);
  const img=document.createElement('img');img.alt=c.title;img.src=c.data;img.className='exportChartImage';section.append(img);
  for(const [cls,value] of [['exportChartNote',c.note],['exportChartInsight',c.insight],['exportChartSource',c.source]]){if(!value)continue;const div=document.createElement('div');div.className=cls;div.textContent=value;section.append(div)}
  report.append(section);
 });
}
document.getElementById('reportPdf').addEventListener('click',()=>{
   if(!confirmReportCounty())return;
  const charts=captureSelectedCharts();
  if(!charts.length && !['cover','overview','benchmark','trends','jobs'].some(id=>reportSelection.has(id))){alert('Brak slajdów z wystarczającymi danymi. Zmień zakres lub zaznacz inne elementy.');return;}
  window.reportSelectedPdfPages=[0,1,2,3].filter(i=>[
    reportSelection.has('cover')||reportSelection.has('overview'),
    reportSelection.has('benchmark')||reportSelection.has('trends'),
    reportSelection.has('trends')||reportSelection.has('jobs'),
    reportSelection.has('jobs')
  ][i]);
  reportDialog.close();
  // PDF builds original pages first; new charts appended after them.
  window.reportExtraCharts=charts;
  generatePDF().catch(error=>{console.error("Eksport PDF:",error);alert("Nie udało się przygotować PDF. Sprawdź konsolę przeglądarki.")});
});
document.getElementById('reportPpt').addEventListener('click',async()=>{
   if(!confirmReportCounty())return;
  window.reportExtraCharts=captureSelectedCharts();
  if(!window.reportExtraCharts.length && !['cover','overview','benchmark','trends','jobs'].some(id=>reportSelection.has(id))){alert('Brak slajdów z wystarczającymi danymi. Zmień zakres lub zaznacz inne elementy.');window.reportExtraCharts=null;return;}
  window.reportSelectedSlides=['cover','overview','benchmark','trends','jobs'].map((id,i)=>reportSelection.has(id)?i:-1).filter(i=>i>=0);
  reportDialog.close();
  const button=document.getElementById('reportPpt');
  button.disabled=true;
  try{
    await generatePPTX();
  }catch(error){
    console.error('[PPTX] Nie udało się wygenerować prezentacji',error);
    alert('Nie udało się wygenerować prezentacji PPTX.\n\n'+(error?.message||String(error))+'\n\nSprawdź, czy plik został pobrany. W razie potrzeby prześlij treść tego komunikatu.');
  }finally{
    window.reportSelectedSlides=null;
    window.reportExtraCharts=null;
    button.disabled=false;
  }
});
document.getElementById('xlsxBtn').addEventListener('click',generateXLSX);
initComparePickers();
bindCompareOptions();
syncComparePickers();
['compare1','compare2','compare3'].forEach(id=>document.getElementById(id).addEventListener('change',()=>{syncComparePickers();renderComparison()}));
document.getElementById('compareClearBtn').addEventListener('click',()=>{['compare1','compare2','compare3'].forEach(id=>document.getElementById(id).value='');syncComparePickers();renderComparison();});
document.getElementById('occProfileClear').addEventListener('click',()=>setOccupation(''));
document.getElementById('fullscreenBtn').addEventListener('click',async()=>{
  const entering=!document.body.classList.contains('presentationMode');
  const countyPanel=document.getElementById('countyUnempModule');
  if(countyPanel){if(entering){countyPanel.dataset.beforePresentation=countyPanel.open?'1':'0';countyPanel.open=true}else{countyPanel.open=countyPanel.dataset.beforePresentation==='1';delete countyPanel.dataset.beforePresentation}}
  document.body.classList.toggle('presentationMode',entering);
  document.getElementById('fullscreenBtn').textContent=entering?'✕ Zakończ prezentację':'⛶ Tryb prezentacji';
  try{if(entering&&!document.fullscreenElement) await document.documentElement.requestFullscreen(); else if(!entering&&document.fullscreenElement) await document.exitFullscreen()}catch(e){}
});
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&document.body.classList.contains('presentationMode')){document.body.classList.remove('presentationMode');document.getElementById('fullscreenBtn').textContent='⛶ Tryb prezentacji';const cp=document.getElementById('countyUnempModule');if(cp){cp.open=cp.dataset.beforePresentation==='1';delete cp.dataset.beforePresentation}}});

function renderRanks(){
  const allCounties=Object.entries(DATA);
  const cr=allCounties.slice().sort((a,b)=>b[1].deficit-a[1].deficit || a[0].localeCompare(b[0],"pl")).slice(0,10);
  const crLow=allCounties.slice().sort((a,b)=>a[1].deficit-b[1].deficit || a[0].localeCompare(b[0],"pl")).slice(0,10);
  const mx=Math.max(...cr.map(([,d])=>d.deficit),1);
  const mxLow=Math.max(...crLow.map(([,d])=>d.deficit),1);
  document.getElementById("countyRank").innerHTML=cr.map(([n,d])=>`<div class="rankitem"><span class="rankname" title="${n}">${n}</span><div class="rankbar"><i style="width:${d.deficit/mx*100}%"></i></div><b>${d.deficit}</b></div>`).join("");
  document.getElementById("countyRankLow").innerHTML=crLow.map(([n,d])=>`<div class="rankitem"><span class="rankname" title="${n}">${n}</span><div class="rankbar"><i style="width:${d.deficit/mxLow*100}%"></i></div><b>${d.deficit}</b></div>`).join("");

  const occDef=Object.entries(OCC_DATA)
    .map(([name,o])=>({name,deficit_count:o.s.filter(x=>x==="D"||x==="DD").length}))
    .filter(o=>o.deficit_count>0);
  const occHigh=occDef.slice().sort((a,b)=>b.deficit_count-a.deficit_count || a.name.localeCompare(b.name,"pl")).slice(0,10);
  const occLow=occDef.slice().sort((a,b)=>a.deficit_count-b.deficit_count || a.name.localeCompare(b.name,"pl")).slice(0,10);
  const mo=Math.max(...occHigh.map(o=>o.deficit_count),1);
  const moLow=Math.max(...occLow.map(o=>o.deficit_count),1);
  document.getElementById("occupationRank").innerHTML=occHigh.map(o=>`<div class="rankitem"><span class="rankname" title="${o.name}">${o.name}</span><div class="rankbar"><i style="width:${o.deficit_count/mo*100}%"></i></div><b>${o.deficit_count}</b></div>`).join("");
  document.getElementById("occupationRankLow").innerHTML=occLow.map(o=>`<div class="rankitem"><span class="rankname" title="${o.name}">${o.name}</span><div class="rankbar"><i style="width:${o.deficit_count/moLow*100}%"></i></div><b>${o.deficit_count}</b></div>`).join("");
}
populateCompareSelects(); renderComparison(); renderRanks(); buildMap(); selectProvinceOverview(); renderOccupationProfile(); initHistoryArchiveJobs();
requestAnimationFrame(()=>{ if(!active && !selectedOccupation) selectProvinceOverview(); });
setTimeout(()=>{ if(!active && !selectedOccupation) selectProvinceOverview(); },80);
restoreUrlState();

window.addEventListener("resize",()=>{if(document.getElementById("trendChart").getClientRects().length){if(active)renderTrend(active);else renderProvinceTrend();}});
