/* Obserwatorium v131 - zweryfikowane szeregi miesięczne WUP 2020-2026.
   Oddzielne dane liczebności i zdarzeń; nie modyfikuje istniejącej stopy GUS. */
(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 const months=['styczeń','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpień','wrzesień','październik','listopad','grudzień'];
 const NS='http://www.w3.org/2000/svg';
 const fmt=n=>Number(n).toLocaleString('pl-PL',{maximumFractionDigits:0});
 function node(t,a={},value){const n=document.createElementNS(NS,t);Object.entries(a).forEach(([k,v])=>n.setAttribute(k,String(v)));if(value!==undefined)n.textContent=String(value);return n}
 const dataElement=$('wupMonthlyDetailedData');const card=$('gusWupDetailsCard');
 if(!dataElement||!card)return;
 let data;
 try{data=JSON.parse(dataElement.textContent)}catch(e){console.warn('[WUP v131] Nie udało się odczytać danych',e);return}
 const metrics=data.metrics||{},select=$('wupMetric'),year=$('wupYear'),compare=$('wupCompare');
 const groups={
  registered:'Stan na koniec miesiąca',women:'Stan na koniec miesiąca',rural:'Stan na koniec miesiąca',benefits:'Stan na koniec miesiąca',graduates:'Stan na koniec miesiąca',jobseekers:'Stan na koniec miesiąca',offers_end:'Stan na koniec miesiąca'
 };
 for(const [key,m] of Object.entries(metrics)){
  const option=document.createElement('option');option.value=key;option.textContent=m.label;select.append(option)
 }
 for(const y of data.meta.years){const option=document.createElement('option');option.value=y;option.textContent=y;year.append(option)}
 select.value='registered';year.value='2026';
 function render(){
  const key=select.value,y=year.value,metric=metrics[key];if(!metric)return;
  const yy=Number(y)-1,prev=String(yy),availablePrev=Boolean(metric.values[prev]);
  compare.disabled=!availablePrev;if(!availablePrev)compare.checked=false;
  const withPrev=availablePrev&&compare.checked;
  card.querySelector('.gusFresh').textContent=y==='2026'?'I–IX 2026':y;
  const values=metric.values[y]||[];
  const length=values.reduce((a,n,i)=>n===null?a:i+1,0);
  const curr=values.slice(0,length);
  const prior=withPrev?metric.values[prev].slice(0,length):null;
  const selected=curr.map((v,i)=>({month:i,year:y,value:v})).filter(p=>Number.isFinite(p.value));
  const historical=(prior||[]).map((v,i)=>({month:i,year:prev,value:v})).filter(p=>Number.isFinite(p.value));
  const all=[...selected,...historical].map(o=>o.value);
  if(!all.length){$('wupChartNote').textContent='Brak wartości dla wybranego okresu.';return}
  const last=selected.at(-1),counterpart=prior?.[last.month];
  const diff=Number.isFinite(counterpart)?last.value-counterpart:null;
  $('wupLatest').textContent=fmt(last.value);$('wupLatestPeriod').textContent=months[last.month]+' '+y+' · '+(metric.kind==='stan'?'stan na koniec miesiąca':'wartość miesięczna');
  $('wupChange').textContent=diff===null?'–':(diff>0?'+':'')+fmt(diff);
  $('wupChange').classList.toggle('isPositive',diff!==null&&diff>0);
  $('wupChangeDetail').textContent=diff===null?'Włącz porównanie r/r':`wobec ${months[last.month]} ${prev} (${fmt(counterpart)} osób)`;
  $('wupMetricNote').textContent=(metric.kind==='stan'?'Stan rejestru na koniec miesiąca.':'Liczba zdarzeń w danym miesiącu (nie stan rejestru).')+' · Województwo śląskie';
  $('wupChartNote').textContent=`${metric.label}: ${fmt(last.value)} ${metric.unit.replace(' / miesiąc','')} (${months[last.month]} ${y} r.).`+(diff!==null?` Różnica względem tego samego miesiąca ${prev} r.: ${diff>0?'+':''}${fmt(diff)}.`:'');
  const svg=$('wupUnemploymentChart');svg.replaceChildren();
  const W=690,H=300,L=77,R=31,T=30,B=51;
  const lo=Math.min(...all),hi=Math.max(...all);const pad=Math.max(1,(hi-lo)*.17);
  const min=Math.max(0,Math.floor((lo-pad)/Math.max(1,Math.pow(10,Math.floor(Math.log10(Math.max(1,hi)))-1)))*Math.max(1,Math.pow(10,Math.floor(Math.log10(Math.max(1,hi)))-1)));
  const max=hi+pad===min?min+1:hi+pad;
  const X=i=>L+i*(W-L-R)/Math.max(1,length-1),Y=v=>T+(max-v)*(H-T-B)/(max-min);
  for(let j=0;j<=4;j++){
   const val=min+(max-min)*j/4,py=Y(val);
   svg.append(node('line',{x1:L,y1:py,x2:W-R,y2:py,stroke:'#E6ECF3','stroke-width':1}));
   svg.append(node('text',{x:L-12,y:py+4,'text-anchor':'end',fill:'#64748B','font-size':13},fmt(Math.round(val))));
  }
  for(let i=0;i<length;i++)svg.append(node('text',{x:X(i),y:H-15,'text-anchor':'middle',fill:'#516983','font-size':12},data.meta.months[i]));
  function series(items,color,dashed=false){
   if(!items.length)return;
   svg.append(node('polyline',{points:items.map(p=>`${X(p.month)},${Y(p.value)}`).join(' '),fill:'none',stroke:color,'stroke-width':dashed?2.6:3.4,'stroke-dasharray':dashed?'7 5':'none','stroke-linejoin':'round','stroke-linecap':'round'}));
   items.forEach((p,i)=>{
    const circle=node('circle',{cx:X(p.month),cy:Y(p.value),r:4.4,fill:'#fff',stroke:color,'stroke-width':2.5,tabindex:'0','aria-label':`${months[p.month]} ${p.year}: ${fmt(p.value)} ${metric.unit}`});
    circle.append(node('title',{},`${metric.label} • ${p.year}-${String(p.month+1).padStart(2,'0')} • ${fmt(p.value)} ${metric.unit}`));svg.append(circle);
   });
  }
  if(historical.length)series(historical,'#91A2B9',true);
  series(selected,'#B76738',false);
  // Small, deliberately sparse data labels that never cross the other line.
  const labels=[0,last.month].filter((v,i,a)=>a.indexOf(v)===i);
  labels.forEach(i=>{
   const p=selected.find(a=>a.month===i);if(!p)return;
   const x=X(i),yP=Y(p.value),py=Math.max(15,Math.min(H-B-8,yP-13));
   const t=node('text',{x:x+(i===0?5:i===11?-5:0),y:py,'text-anchor':i===0?'start':i===11?'end':'middle',fill:'#97461E','font-size':12,'font-weight':700},fmt(p.value));svg.append(t);
  });
  $('wupLegend').replaceChildren();
  const legend=(text,color,dash)=>{const item=document.createElement('span');const line=document.createElement('i');line.style.cssText='background:'+color+(dash?';opacity:.65':'');item.append(line,document.createTextNode(' '+text));$('wupLegend').append(item)};
  legend(y,'#B76738',false);if(withPrev)legend(prev+' (porównanie)','#91A2B9',true);
  const head=$('wupTableHead'),body=$('wupTableBody');head.replaceChildren();body.replaceChildren();
  const tr=document.createElement('tr');for(const val of ['Miesiąc',y,...(withPrev?[prev,'Różnica r/r']:[])]){const th=document.createElement('th');th.textContent=val;tr.append(th)}head.append(tr);
  for(let i=0;i<length;i++){
   const row=document.createElement('tr');const rowValues=[months[i],fmt(values[i]),...(withPrev?[Number.isFinite(prior[i])?fmt(prior[i]):'–',Number.isFinite(prior[i])?(values[i]-prior[i]>0?'+':'')+fmt(values[i]-prior[i]):'–']:[])];
   rowValues.forEach(v=>{const cell=document.createElement('td');cell.textContent=v;row.append(cell)});body.append(row)
  }
  // Snapshot structured, numerical source data independently of SVG styling.
  window.WUP_UNEMP_EXPORT_DATA={kind:'series',labels:selected.map(p=>data.meta.months[p.month]),series:[{name:y,values:selected.map(p=>p.value)},...(withPrev?[{name:prev,values:historical.map(p=>p.value)}]:[])],unit:metric.unit,source:data.meta.source};
  svg.dataset.wupMetric=key;svg.dataset.wupYear=y;
 }
 select.addEventListener('change',render);year.addEventListener('change',render);compare.addEventListener('change',render);
 render();
})();
