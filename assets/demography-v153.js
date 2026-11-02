/* Demografia: odrębny widok GUS 2020-2025, zachowuje istniejące wykresy powiatowe. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),f=new Intl.NumberFormat('pl-PL'),dec=n=>Number(n).toFixed(1).replace('.',',');
const source=$('demographyReport2025');if(!source)return;
let d;try{d=JSON.parse(source.textContent)}catch(e){console.warn('Brak danych raportu demograficznego',e);return}
function initializeDemography(){const root=$('demographyReportRoot');if(!root)return false;
const colors={total:'#227cb4',men:'#5578c6',women:'#db6e8c',urban:'#319f9a',rural:'#c28b46'};
const series={total:'Ludność ogółem',men:'Mężczyźni',women:'Kobiety',urban:'Mieszkańcy miast',rural:'Mieszkańcy wsi'};
const link=d.meta.zrodlo_url;
const lineCard=(id,title,subtitle,extra='')=>`<article class="demographyReportCard" id="${id}Card"><div class="demographyReportCardHead"><div><span class="demographyEyebrow">GUS · 2020-2025</span><h3>${title}</h3><p>${subtitle}</p></div>${extra}</div><svg class="demographyReportSvg" id="${id}" role="img" aria-label="${title} - wykres w latach 2020-2025" viewBox="0 0 760 280" preserveAspectRatio="xMidYMid meet"></svg><div class="demographyChartFoot" id="${id}Foot"></div></article>`;
root.innerHTML=`
<section class="demographyReportIntro" id="chapterDemography"><div><span class="demographyEyebrow">GUS / ROZWÓJ LUDNOŚCIOWY</span><h2>Demografia województwa śląskiego</h2><p>Zmiany liczby mieszkańców, urodzenia, zgony i migracje. Dane roczne 2020-2025 z Urzędu Statystycznego w Katowicach.</p></div><span class="demographyReportDate">Raport opublikowany 08.07.2026</span></section>
<div class="demographyKpis" aria-label="Najważniejsze wskaźniki demograficzne za 2025 rok">
<div class="demographyKpi"><span>Mieszkańcy</span><strong>${f.format(d.population.total[5])}</strong><small>31 grudnia 2025</small></div>
<div class="demographyKpi"><span>Zmiana 2020-2025</span><strong class="negative">${f.format(d.population.total[5]-d.population.total[0])}</strong><small>−${dec(100*(1-d.population.total[5]/d.population.total[0]))}% mieszkańców</small></div>
<div class="demographyKpi"><span>Ubytek naturalny</span><strong class="negative">${f.format(d.net_natural[5])}</strong><small>2025 · urodzenia minus zgony</small></div>
<div class="demographyKpi"><span>Saldo migracji stałych</span><strong class="negative">${f.format(d.migration_net[5])}</strong><small>2025 · osoby</small></div></div>
<div class="demographyNote"><b>Różne okresy:</b> pełne dane roczne kończą się w 2025 r. Nowszy stan ludności z <b>30.06.2026</b> znajduje się w osobnej karcie powyżej. Wartości z 2025 i połowy 2026 r. nie są łączone w jedną serię roczną.</div>
<div class="demographyCharts">
${lineCard('demographyPopulationChart','Liczba ludności','Stan na 31 grudnia, w tysiącach osób',`<label class="demographySeriesLabel">Zakres <select id="demographyPopulationSeries" aria-label="Wybierz grupę ludności">${Object.entries(series).map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label>`)}
${lineCard('demographyNaturalChart','Urodzenia i zgony','Roczne liczby zdarzeń, w tysiącach osób')}
${lineCard('demographyMigrationChart','Saldo migracji stałych','Napływ minus odpływ; wartości ujemne oznaczają przewagę wyjazdów')}
</div>
<div class="demographyInterpretation"><strong>Co wynika z danych?</strong><p>Ubytek naturalny był głównym czynnikiem zmniejszania się liczby ludności w 2025 r., a ujemne saldo migracji dodatkowo pogłębiało tę tendencję. Współczynnik dzietności wynosił ${String(d.fertility_2025).replace('.',',')}. Szczegółowe wartości urodzeń, zgonów i migracji znajdują się na wykresach oraz w kartach wskaźników powyżej.</p><small>Na podstawie publikacji GUS. Wnioski dotyczą województwa, nie poszczególnych powiatów. Dane za 2025 r. nie są prognozą na 2026 lub 2027 r.</small></div>
<p class="demographySource">Źródło: Urząd Statystyczny w Katowicach, <a href="${link}" target="_blank" rel="noopener noreferrer">„Sytuacja demograficzna województwa śląskiego w 2025 r.”</a>, tablice 1, 9, 10 i 11. Dostęp offline: wartości i szeregi zapisane w aplikacji.</p>

`;
function el(name,attrs={},value=''){const n=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(value!=='')n.textContent=value;return n}
const add=(root,n,attrs,txt)=>{const x=el(n,attrs,txt);root.appendChild(x);return x};
/* Wykresy inspirowane widokiem Porównaj powiaty: zaokrąglone słupki, wyraźne
   punkty, etykiety typu pill. Każda oś i skala ma wydzieloną przestrzeń. */
function addSvg(root,name,attrs={},value=''){
 return add(root,name,attrs,value);
}
function roundRect(svg,x,y,w,h,r,fill,opacity=1){
 return add(svg,'rect',{x,y,width:w,height:h,rx:r,fill,opacity});
}
function pill(svg,cx,cy,text,stroke,opts={}){
 const w=Math.max(46,Math.min(102,18+text.length*(opts.mobile?7.1:7.8)));
 const h=opts.mobile?25:28;
 const safeCx=Math.min(opts.W-w/2-7,Math.max(opts.L+w/2+5,cx));
 const safeCy=Math.min(opts.H-opts.B-13,Math.max(opts.T+14,cy));
 const g=add(svg,'g',{transform:`translate(${safeCx},${safeCy})`});
 roundRect(g,-w/2,-h/2,w,h,h/2,'#fff');
 add(g,'rect',{x:-w/2,y:-h/2,width:w,height:h,rx:h/2,fill:'none',stroke:'#d2e0ed','stroke-width':1.4});
 add(g,'circle',{cx:-w/2+12,cy:0,r:3.7,fill:stroke});
 add(g,'text',{x:5,y:4,'text-anchor':'middle',fill:'#213e5a','font-size':opts.mobile?12.2:13.2,'font-weight':850},text);
 return g;
}
function frame(id,ymin,ymax,{unit='tys.',color='#66829f',zero=false}={}){
 const svg=$(id);svg.replaceChildren();
 const mobile=window.innerWidth<650;
 const W=mobile?410:760,H=mobile?308:314;
 const L=mobile?68:80,R=mobile?18:38,T=mobile?53:52,B=mobile?47:51;
 svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
 svg.setAttribute('preserveAspectRatio','xMidYMid meet');
 const plotW=W-L-R,plotH=H-T-B,step=plotW/6;
 const x=i=>L+(i+.5)*step;
 const y=v=>T+(ymax-v)/(ymax-ymin||1)*plotH;
 // Piony dla lat i tło przedziałów są ZA liniami siatki. Pierwszy i ostatni
 // słupek leżą w 1/2 przedziału od osi, więc nie dotykają opisów skali.
 d.years.forEach((yr,i)=>{
  const xx=x(i);roundRect(svg,xx-step*.38,T,step*.76,plotH,14,'#e9f0f7',.52);
 });
 for(let i=0;i<=4;i++){
  const v=ymin+(ymax-ymin)*i/4,yy=y(v);
  add(svg,'line',{x1:L,y1:yy,x2:W-R,y2:yy,stroke:'#d4e1ed','stroke-width':1,'stroke-dasharray':'4 6'});
  const axis=Math.abs(v)<1e-8?'0':Math.abs(v)>=100?dec(v):dec(v);
  add(svg,'text',{x:L-12,y:yy+4,'text-anchor':'end',fill:'#526c85','font-size':mobile?12.2:12.6,'font-weight':750},axis);
 }
 d.years.forEach((yr,i)=>add(svg,'text',{x:x(i),y:H-16,'text-anchor':'middle',fill:'#355674','font-size':mobile?12.1:13.1,'font-weight':850},String(yr)));
 add(svg,'text',{x:L,y:23,fill:color,'font-size':mobile?12.5:13.2,'font-weight':850},unit);
 if(zero)add(svg,'line',{x1:L,y1:y(0),x2:W-R,y2:y(0),stroke:'#728ca6','stroke-width':2});
 return {svg,x,y,W,H,L,R,T,B,plotW,plotH,step,mobile};
}
function tooltip(mark,value,label){
 const t=el('title',{},`${label}: ${value}`);mark.appendChild(t);
 mark.setAttribute('tabindex','0');mark.setAttribute('role','img');mark.setAttribute('aria-label',`${label}: ${value}`);
}
function drawPopulation(){
 const type=$('demographyPopulationSeries').value,values=d.population[type],color=colors[type];
 const scaled=values.map(v=>v/1000),spread=Math.max(...scaled)-Math.min(...scaled);
 const pad=Math.max(10,spread*.22);
 const min=Math.floor((Math.min(...scaled)-pad)/20)*20,max=Math.ceil((Math.max(...scaled)+pad)/20)*20;
 const box=frame('demographyPopulationChart',min,max,{unit:'tys. mieszkańców',color});
 const {svg,x,y,mobile,W,L,T,H,B}=box;
 const pts=scaled.map((v,i)=>[x(i),y(v)]),polyline=pts.map(p=>p.join(',')).join(' ');
 add(svg,'polyline',{points:polyline,fill:'none',stroke:'#ffffff','stroke-width':8,'stroke-linecap':'round','stroke-linejoin':'round'});
 add(svg,'polyline',{points:polyline,fill:'none',stroke:color,'stroke-width':4.8,'stroke-linecap':'round','stroke-linejoin':'round'});
 pts.forEach(([cx,cy],i)=>{
  add(svg,'circle',{cx,cy,r:mobile?9:10,fill:'#ffffff',stroke:color,'stroke-width':4});
  const hit=add(svg,'circle',{cx,cy,r:14,fill:'transparent'});
  tooltip(hit,f.format(values[i])+' osób',String(d.years[i]));
  if(i===0||i===5){
   const offset=i===0?25:-25,up=i===0?-26:30;
   pill(svg,cx+offset,cy+up,`${dec(scaled[i])} tys.`,color,box);
  }
 });
 $('demographyPopulationChartFoot').textContent=`${series[type]}: ${f.format(values[0])} → ${f.format(values[5])} osób (2020-2025). Dotknij punktu, aby zobaczyć dokładną wartość.`;
}
function drawNatural(){
 const births=d.live_births.map(v=>v/1000),deaths=d.deaths.map(v=>v/1000);
 const box=frame('demographyNaturalChart',0,Math.ceil((Math.max(...deaths)+7)/10)*10,{unit:'tys. zdarzeń',color:'#356587'});
 const {svg,x,y,step,mobile}=box;
 const bw=Math.min(mobile?17:26,step*.26),gap=mobile?5:8;
 [births,deaths].forEach((values,seriesIndex)=>{
  const color=seriesIndex?'#d45577':'#1ba5a2';
  values.forEach((v,i)=>{
   const cx=x(i)+(seriesIndex?1:-1)*(bw+gap)/2;
   const top=y(v),base=y(0),h=Math.max(0,base-top);
   const track=add(svg,'rect',{x:cx-bw/2,y:top,width:bw,height:h,rx:bw/2,fill:color});
   const halo=add(svg,'circle',{cx,cy:top+Math.min(10,bw*.5),r:mobile?5.3:6.5,fill:'#fff',stroke:color,'stroke-width':3.1});
   tooltip(track,f.format((seriesIndex?d.deaths:d.live_births)[i])+' osób',`${seriesIndex?'Zgony':'Urodzenia'} ${d.years[i]}`);
   tooltip(halo,f.format((seriesIndex?d.deaths:d.live_births)[i])+' osób',`${seriesIndex?'Zgony':'Urodzenia'} ${d.years[i]}`);
   // Jedynie dla ostatniego roku oba warianty etykiet bez ryzyka kolizji.
   if(i===5&&!mobile){pill(svg,cx+(seriesIndex?13:-13),top-(seriesIndex?16:14),dec(v),color,box);}
  });
 });
 $('demographyNaturalChartFoot').innerHTML='<span class="demographyKey"><i style="background:#1ba5a2"></i> Urodzenia żywe</span><span class="demographyKey"><i style="background:#d45577"></i> Zgony</span><span>2025: <strong>'+f.format(d.live_births[5])+'</strong> urodzeń i <strong>'+f.format(d.deaths[5])+'</strong> zgonów</span>';
}
function drawMigration(){
 const vals=d.migration_net.map(v=>v/1000),min=Math.floor((Math.min(...vals)-.6)*2)/2;
 const box=frame('demographyMigrationChart',min,0,{unit:'tys. osób',color:'#b25370',zero:true});
 const {svg,x,y,step,mobile}=box;
 const bw=Math.min(mobile?34:55,step*.56);
 vals.forEach((v,i)=>{
  const cx=x(i),start=y(0),end=y(v),h=Math.max(3,end-start),color=i===5?'#a74362':'#bf7187';
  const bar=add(svg,'rect',{x:cx-bw/2,y:start,width:bw,height:h,rx:Math.min(15,bw/3),fill:color});
  const halo=add(svg,'circle',{cx,cy:end-Math.min(10,h*.22),r:mobile?5.8:7.2,fill:'#fff',stroke:color,'stroke-width':3.4});
  tooltip(bar,f.format(d.migration_net[i])+' osób',String(d.years[i]));tooltip(halo,f.format(d.migration_net[i])+' osób',String(d.years[i]));
  // Ujemne etykiety wewnątrz słupków, poza skalą i poza osią poziomą.
  if(h>38){add(svg,'text',{x:cx,y:start+h*.55+4,'text-anchor':'middle',fill:'#fff','font-size':mobile?12:13.2,'font-weight':850},dec(v));}
 });
 $('demographyMigrationChartFoot').textContent='Saldo migracji stałych: w 2025 r. '+f.format(d.migration_net[5])+' osób. Ujemne wartości oznaczają przewagę wyjazdów. Wszystkie słupki mają wspólną skalę.';
}
$('demographyPopulationSeries').addEventListener('change',drawPopulation);
drawPopulation();drawNatural();drawMigration();let phone=window.innerWidth<650;window.addEventListener('resize',()=>{const next=window.innerWidth<650;if(next!==phone){phone=next;drawPopulation();drawNatural();drawMigration();}});return true;}
if(!initializeDemography()){let retries=0;const timer=setInterval(()=>{if(initializeDemography()||++retries>180)clearInterval(timer)},130);}
})();
