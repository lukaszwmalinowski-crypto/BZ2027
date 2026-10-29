(function(){
 const NS='http://www.w3.org/2000/svg', tooltip=document.getElementById('gusChartTooltip'); let pinned=null;
 function el(tag,attrs={},txt=''){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(txt!=='' )n.textContent=txt;return n}
 function clear(id){const s=document.getElementById(id);if(s)s.innerHTML='';return s}
 function grid(svg,ys,x1,x2){ys.forEach(y=>svg.appendChild(el('line',{x1,y1:y,x2,y2:y,class:'gridLine'})))}
 function pl(v){return Number(v).toFixed(1).replace('.',',')} function fmtInt(v){return new Intl.NumberFormat('pl-PL').format(v)}
 function posTip(ev){const pad=14,w=tooltip.offsetWidth||190,h=tooltip.offsetHeight||64;let x=ev.clientX+14,y=ev.clientY-h-14;if(x+w>innerWidth-pad)x=ev.clientX-w-14;if(y<pad)y=ev.clientY+14;tooltip.style.left=Math.max(pad,x)+'px';tooltip.style.top=Math.max(pad,y)+'px'}
 function showTip(mark,ev,title,value,detail){tooltip.innerHTML=`<b>${title}</b><span>${value}</span>${detail?`<small>${detail}</small>`:''}`;tooltip.classList.add('show');if(ev&&'clientX' in ev)posTip(ev);if(mark.tagName==='circle'){mark.dataset.r0=mark.dataset.r0||mark.getAttribute('r');mark.setAttribute('r',String(Number(mark.dataset.r0)+2.2));}else{mark.setAttribute('opacity','0.78');mark.setAttribute('stroke','#173d66');mark.setAttribute('stroke-width','1.5')}}
 function resetMark(mark){if(!mark)return;if(mark.tagName.toLowerCase()==='circle'){if(mark.dataset.r0)mark.setAttribute('r',mark.dataset.r0);return;}mark.removeAttribute('opacity');mark.removeAttribute('stroke');mark.removeAttribute('stroke-width')}
 function hideTip(mark){if(pinned===mark)return;resetMark(mark);tooltip.classList.remove('show')}
 function bind(mark,title,value,detail){mark.dataset.interactive='1';mark.setAttribute('tabindex','0');mark.setAttribute('role','button');mark.setAttribute('aria-label',`${title}: ${value}`);mark.addEventListener('pointerenter',e=>showTip(mark,e,title,value,detail));mark.addEventListener('pointermove',e=>{if(pinned!==mark)posTip(e)});mark.addEventListener('pointerleave',()=>hideTip(mark));mark.addEventListener('click',e=>{e.stopPropagation();if(pinned===mark){showTip(mark,e,title,value,detail);return}if(pinned)resetMark(pinned);pinned=mark;showTip(mark,e,title,value,detail)});mark.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();mark.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:innerWidth/2,clientY:innerHeight/2}))}})}
 document.addEventListener('click',e=>{if(pinned&&!e.target.closest('[data-interactive="1"]')){resetMark(pinned);pinned=null;tooltip.classList.remove('show')}});
 window.addEventListener('scroll',()=>{if(!pinned)tooltip.classList.remove('show')},{passive:true});
 function compareLines(id,labels,detailLabels,slaskie,polska,opts={}){
   const svg=clear(id);if(!svg)return;if(pinned){resetMark(pinned);pinned=null;tooltip.classList.remove('show')}
   const W=opts.width||760,H=opts.height||260,L=58,R=30,T=46,B=52;
   const all=[...slaskie,...polska], rawMin=Math.min(...all),rawMax=Math.max(...all),pad=Math.max(.7,(rawMax-rawMin)*.18),min=opts.min??Math.floor((rawMin-pad)*2)/2,max=opts.max??Math.ceil((rawMax+pad)*2)/2;
   const X=i=>L+i*(W-L-R)/(labels.length-1),Y=v=>T+(max-v)*(H-T-B)/(max-min);
   const ticks=[max,(max+min)/2,min];grid(svg,ticks.map(Y),L,W-R);ticks.forEach(v=>svg.appendChild(el('text',{x:10,y:Y(v)+4,class:'axisText'},pl(v)+'%')));svg.appendChild(el('text',{x:14,y:20,class:'axisUnit'},'%'));
   const series=[{vals:slaskie,color:opts.slaskieColor||'#173d66',dash:'',name:'woj. śląskie',klass:'slaskie'},{vals:polska,color:opts.polskaColor||'#c58a2b',dash:'7 5',name:'Polska',klass:'poland'}];
   series.forEach(s=>{svg.appendChild(el('polyline',{points:s.vals.map((v,i)=>`${X(i)},${Y(v)}`).join(' '),fill:'none',stroke:s.color,'stroke-width':3,'stroke-dasharray':s.dash,'stroke-linejoin':'round','stroke-linecap':'round'}));});

   // Stały układ etykiet zapobiega ich zderzaniu: Polska zawsze nad punktem,
   // woj. śląskie zawsze pod punktem. Przy małej różnicy zwiększamy odstęp.
   labels.forEach((lab,i)=>{
      const x=X(i), yS=Y(slaskie[i]), yP=Y(polska[i]);
      const close=Math.abs(yS-yP)<34;
      const plOffset=close?-24:-18;
      const slOffset=close?30:24;
      const points=[
        {v:polska[i],y:yP,color:series[1].color,name:series[1].name,klass:'poland',off:plOffset},
        {v:slaskie[i],y:yS,color:series[0].color,name:series[0].name,klass:'slaskie',off:slOffset}
      ];
      points.forEach(o=>{
        const c=el('circle',{cx:x,cy:o.y,r:4.2,fill:'#fff',stroke:o.color,'stroke-width':2.5});svg.appendChild(c);
        bind(c,detailLabels[i],`${pl(o.v)}%`,`${opts.metric||'Wskaźnik'} • ${o.name}`);
        const labelY=Math.max(18,Math.min(H-B-5,o.y+o.off));
        const lineEnd=o.off<0?labelY+5:labelY-10;
        svg.appendChild(el('line',{x1:x,y1:o.y+(o.off<0?-5:5),x2:x,y2:lineEnd,stroke:o.color,class:'pointConnector'}));
        svg.appendChild(el('text',{x,y:labelY,'text-anchor':'middle',class:`pointValue ${o.klass}`},pl(o.v)+'%'));
      });
      svg.appendChild(el('text',{x,y:H-17,'text-anchor':'middle',class:'axisText'},lab));
   });
 }
 function bars(id,labels,vals,min,max){const svg=clear(id);if(!svg)return;const W=640,H=190,L=46,R=18,T=24,B=38,plotW=W-L-R,plotH=H-T-B,step=plotW/vals.length,bw=Math.max(18,step*.54),Y=v=>T+(max-v)*plotH/(max-min);grid(svg,[Y(min),Y((min+max)/2),Y(max)],L,W-R);[min,Math.round((min+max)/2),max].forEach(v=>svg.appendChild(el('text',{x:7,y:Y(v)+4,class:'axisText'},String(v))));svg.appendChild(el('text',{x:8,y:13,class:'axisUnit'},'na 10 tys.'));vals.forEach((v,i)=>{const x=L+i*step+(step-bw)/2,y=Y(v),h=H-B-y,r=el('rect',{x,y,width:bw,height:h,rx:5,fill:i===vals.length-1?'#4d927d':'#d7e7e1'});svg.appendChild(r);bind(r,labels[i],String(v),'Podmioty REGON na 10 tys. ludności • woj. śląskie');svg.appendChild(el('text',{x:x+bw/2,y:Math.max(18,y-6),'text-anchor':'middle',class:'valueLabel'},String(v)));svg.appendChild(el('text',{x:x+bw/2,y:H-14,'text-anchor':'middle',class:'axisText'},labels[i]))});}
 function regonCurrentBars(){
   const svg=clear('gusRegonChart');if(!svg)return;
   const items=[{period:window.PANEL_DATA.gus.regon.prevAsOf,value:window.PANEL_DATA.gus.regon.total2025},{period:window.PANEL_DATA.gus.regon.currentAsOf,value:window.PANEL_DATA.gus.regon.total2026}];
   const W=640,H=190,L=82,R=30,T=26,B=40,max=600000,Y=v=>T+(max-v)*(H-T-B)/max;
   grid(svg,[Y(0),Y(300000),Y(600000)],L,W-R);
   [0,300000,600000].forEach(v=>svg.appendChild(el('text',{x:10,y:Y(v)+4,class:'axisText'},fmtInt(v))));
   svg.appendChild(el('text',{x:10,y:15,class:'axisUnit'},'podmioty'));
   items.forEach((o,i)=>{const x=180+i*240,w=84,y=Y(o.value),h=H-B-y,color=i===1?'#4d927d':'#b8cbd7';
     const mark=el('rect',{x,y,width:w,height:h,rx:8,fill:color});svg.appendChild(mark);bind(mark,o.period,fmtInt(o.value)+' podmiotów','Województwo śląskie • REGON');
     svg.appendChild(el('text',{x:x+w/2,y:Math.max(17,y-8),'text-anchor':'middle',class:'valueLabel'},fmtInt(o.value)));
     svg.appendChild(el('text',{x:x+w/2,y:H-15,'text-anchor':'middle',class:'axisText'},o.period));});
 }
 function renderRegon(mode){
   document.querySelectorAll('[data-regon-mode]').forEach(b=>{const on=b.dataset.regonMode===mode;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
   const cur=mode==='current',label='2016-2025';
   document.getElementById('gusRegonFresh').textContent=cur?'sierpień 2026':'2025';
   document.getElementById('gusRegonSubtitle').textContent=cur?'Zarejestrowane podmioty • grudzień 2025 vs sierpień 2026':'Podmioty na 10 tys. mieszkańców • pełne lata 2016-2025';
   document.getElementById('gusRegonPeriod').textContent=cur?'grudzień 2025 → sierpień 2026':'lata 2016-2025';
   document.getElementById('gusRegonUnit').textContent=cur?'liczba podmiotów':'na 10 tys. ludności';
   if(cur){regonCurrentBars();
     document.getElementById('gusRegonKpi1').textContent=fmtInt(window.PANEL_DATA.gus.regon.total2026);document.getElementById('gusRegonKpiLabel1').textContent='podmioty w REGON • sierpień 2026';
     document.getElementById('gusRegonKpi2').textContent=fmtInt(window.PANEL_DATA.gus.regon.persons2026);document.getElementById('gusRegonKpiLabel2').textContent='osoby fizyczne prowadzące działalność';
     document.getElementById('gusRegonChartNote').innerHTML='<b>Opis wykresu:</b> liczba zarejestrowanych podmiotów w woj. śląskim według stanu na <b>31 grudnia 2025 r.</b> oraz <b>31 sierpnia 2026 r.</b> Pokazujemy wartości bezwzględne, a nie wskaźnik na 10 tys. mieszkańców.';
     document.getElementById('gusRegonInsight').innerHTML=`<strong>${window.PANEL_DATA.gus.regon.currentAsOf}:</strong> <b>${fmtInt(window.PANEL_DATA.gus.regon.total2026)}</b> podmiotów (w tym <b>${fmtInt(window.PANEL_DATA.gus.regon.companies2026)}</b> spółek handlowych). W porównaniu z końcem 2025 r. (<b>${fmtInt(window.PANEL_DATA.gus.regon.total2025)}</b>) liczba podmiotów ${window.PANEL_DATA.gus.regon.total2026>=window.PANEL_DATA.gus.regon.total2025?'była większa':'była mniejsza'} o <b>${fmtInt(Math.abs(window.PANEL_DATA.gus.regon.total2026-window.PANEL_DATA.gus.regon.total2025))}</b>.`;
     document.getElementById('gusRegonNote').textContent='Nie jest to dynamika rok do roku: zestawiamy koniec grudnia 2025 r. z końcem sierpnia 2026 r. Rejestr REGON obejmuje wpisane podmioty, nie wyłącznie przedsiębiorstwa aktywnie prowadzące działalność.';
     document.getElementById('gusRegonSource').innerHTML='Źródło: US w Katowicach / GUS. <a href="https://katowice.stat.gov.pl/zakladka1/" target="_blank" rel="noopener">Stan na sierpień 2026</a> · <a href="https://publikacje.new.stat.gov.pl/portal-publikacje/podmioty-gospodarki-narodowej-w-rejestrze-regon-w-wojewodztwie-slaskim-stan-na-koniec-2025-r" target="_blank" rel="noopener">Stan na koniec 2025</a>';
   } else {
     const values=window.PANEL_DATA.gus.regon.historyPer10k;
     bars('gusRegonChart',window.PANEL_DATA.gus.regon.historicalYears,values,Math.floor(Math.min(...values)*.96),Math.ceil(Math.max(...values)*1.04));
     document.getElementById('gusRegonKpi1').textContent=fmtInt(window.PANEL_DATA.gus.regon.historyPer10k.at(-1));document.getElementById('gusRegonKpiLabel1').textContent='na 10 tys. mieszkańców • 2025';
     document.getElementById('gusRegonKpi2').textContent=fmtInt(window.PANEL_DATA.gus.regon.total2026);document.getElementById('gusRegonKpiLabel2').textContent='liczba podmiotów • sierpień 2026';
     document.getElementById('gusRegonChartNote').innerHTML='<b>Opis wykresu:</b> liczba podmiotów REGON <b>na 10 tys. mieszkańców</b> województwa śląskiego w latach <b>2016-2025</b>, bez mieszania z bieżącą liczbą podmiotów z 2026 r.';
     document.getElementById('gusRegonInsight').innerHTML=`<strong>${window.PANEL_DATA.gus.regon.historicalYears[0]}-${window.PANEL_DATA.gus.regon.historicalYears.at(-1)}:</strong> wskaźnik zmienił się z <b>${values[0]}</b> do <b>${values.at(-1)}</b> na 10 tys. mieszkańców, o <b>${values.at(-1)-values[0]}</b> (${pl((values.at(-1)/values[0]-1)*100)}%).`;
     document.getElementById('gusRegonNote').textContent='Wykres roczny kończy się na 2025 r. Najnowszy stan z sierpnia 2026 r. jest w drugim trybie, ponieważ dotyczy liczby podmiotów, a nie wskaźnika przeliczonego na ludność.';
     document.getElementById('gusRegonSource').innerHTML='Źródła: GUS / BDL oraz agregacja historyczna według danych GUS. <a href="https://bdl.stat.gov.pl/bdl/dane/podgrup/tablica" target="_blank" rel="noopener">BDL</a> · <a href="https://katowice.stat.gov.pl/zakladka1/" target="_blank" rel="noopener">Stan 2026</a>';
   }
 }
 function singleLine(id,labels,detail,vals,opts={}){
   const svg=clear(id);if(!svg)return;const W=opts.width||640,H=opts.height||250,L=66,R=28,T=38,B=52;
   const rawMin=Math.min(...vals),rawMax=Math.max(...vals),pad=Math.max(2500,(rawMax-rawMin)*.16),min=opts.min??Math.max(0,Math.floor((rawMin-pad)/5000)*5000),max=opts.max??Math.ceil((rawMax+pad)/5000)*5000;
   const X=i=>L+i*(W-L-R)/(labels.length-1),Y=v=>T+(max-v)*(H-T-B)/(max-min),color=opts.color||'#b35e62';
   const ticks=[max,(max+min)/2,min];grid(svg,ticks.map(Y),L,W-R);ticks.forEach(v=>svg.appendChild(el('text',{x:8,y:Y(v)+4,class:'axisText'},fmtInt(Math.round(v)))));svg.appendChild(el('text',{x:10,y:22,class:'axisUnit'},opts.axisUnit||'osoby'));
   const pts=vals.map((v,i)=>`${X(i)},${Y(v)}`).join(' ');svg.appendChild(el('polyline',{points:pts,fill:'none',stroke:color,'stroke-width':3,'stroke-linejoin':'round','stroke-linecap':'round'}));
   vals.forEach((v,i)=>{const x=X(i),y=Y(v),c=el('circle',{cx:x,cy:y,r:4.2,fill:'#fff',stroke:color,'stroke-width':2.5});svg.appendChild(c);bind(c,detail[i],fmtInt(v)+' osób',(opts.metric||'Liczba bezrobotnych')+' • woj. śląskie');const off=(i%2===0?-18:26),ly=Math.max(18,Math.min(H-B-4,y+off));svg.appendChild(el('line',{x1:x,y1:y+(off<0?-5:5),x2:x,y2:off<0?ly+5:ly-10,stroke:color,class:'pointConnector'}));svg.appendChild(el('text',{x,y:ly,'text-anchor':'middle',class:'pointValue red'},fmtInt(v)));svg.appendChild(el('text',{x,y:H-17,'text-anchor':'middle',class:'axisText'},labels[i]));});
 }
 const bael=window.PANEL_DATA.gus.bael;
 let baelMode='activity',baelPeriod='historic';
 function baelPoland2026(vals,metric,lastSl,lastPl){
   // Distinct periods: regional observations are verified only to Q4/2025,
   // and the Poland-only points for 2026 must not be presented as comparable
   // with fabricated regional values.
   const svg=clear('gusBaelChart');if(!svg)return;
   const W=760,H=280,L=98,R=49,T=37,B=67;
   const all=[lastSl,lastPl,...vals];const min=Math.floor((Math.min(...all)-1)*2)/2,max=Math.ceil((Math.max(...all)+1)*2)/2;
   const X=i=>L+i*(W-L-R)/2,Y=v=>T+(max-v)*(H-T-B)/(max-min);
   const ticks=[min,(min+max)/2,max];grid(svg,ticks.map(Y),L,W-R);
   ticks.forEach(v=>svg.appendChild(el('text',{x:26,y:Y(v)+4,class:'axisText'},pl(v)+'%')));
   svg.appendChild(el('text',{x:26,y:20,class:'axisUnit'},'%'));
   const periods=['IV kw. 2025','I kw. 2026','II kw. 2026'];
   const plVals=[lastPl,...vals];
   svg.appendChild(el('polyline',{points:plVals.map((v,i)=>`${X(i)},${Y(v)}`).join(' '),stroke:'#c58a2b','stroke-width':3.2,'stroke-dasharray':'7 5',fill:'none','stroke-linecap':'round','stroke-linejoin':'round'}));
   plVals.forEach((v,i)=>{const x=X(i),y=Y(v),c=el('circle',{cx:x,cy:y,r:5.5,fill:'#fff',stroke:'#c58a2b','stroke-width':3});svg.appendChild(c);bind(c,periods[i],pl(v)+'%',metric+' • Polska');svg.appendChild(el('text',{x,y:y-15,'text-anchor':'middle',class:'pointValue poland'},pl(v)+'%'));});
   const sx=X(0),sy=Y(lastSl),c=el('circle',{cx:sx,cy:sy,r:6,fill:'#fff',stroke:'#173d66','stroke-width':3.2});svg.appendChild(c);bind(c,periods[0],pl(lastSl)+'%',metric+' • województwo śląskie');svg.appendChild(el('text',{x:sx,y:sy+25,'text-anchor':'middle',class:'pointValue slaskie'},pl(lastSl)+'%'));
   periods.forEach((t,i)=>svg.appendChild(el('text',{x:X(i),y:H-44,'text-anchor':'middle',class:'axisText'},t)));
   svg.appendChild(el('text',{x:(X(1)+X(2))/2,y:H-17,'text-anchor':'middle',class:'axisText'},'Śląskie: wartości 2026 niezweryfikowane w panelu'));
 }
 function renderBael(mode=baelMode,period=baelPeriod){
   baelMode=mode;baelPeriod=period;
   const a=mode==='employment',d=a?bael.employment:bael.activity,metric=a?'Wskaźnik zatrudnienia':'Współczynnik aktywności zawodowej',current=period==='current';
   document.querySelectorAll('[data-bael-mode]').forEach(b=>{const on=b.dataset.baelMode===mode;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
   document.querySelectorAll('[data-bael-period]').forEach(b=>{const on=b.dataset.baelPeriod===period;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
   const source=document.getElementById('gusBaelSource'),note=document.getElementById('gusBaelNote');
   if(current){
     const values=(a?window.PANEL_DATA.gus.bael2026.employment:window.PANEL_DATA.gus.bael2026.activity).poland2026;
     const lastSl=(a?window.PANEL_DATA.gus.bael2026.employment:window.PANEL_DATA.gus.bael2026.activity).slaskie2025,lastPl=(a?window.PANEL_DATA.gus.bael2026.employment:window.PANEL_DATA.gus.bael2026.activity).poland2025;
     baelPoland2026(values,metric,lastSl,lastPl);
     document.getElementById('gusBaelFresh').textContent='2025-II kw. 2026';document.getElementById('gusBaelSubtitle').textContent=metric+' • porównanie do 2025 i dane krajowe za 2026';
     document.getElementById('gusBaelPeriod').textContent='IV kw. 2025 oraz I-II kw. 2026';document.getElementById('gusBaelTerritory').textContent='Śląskie: IV kw. 2025 • Polska: do II kw. 2026';
     document.getElementById('gusBaelSlaskie').textContent=pl(lastSl)+'%';document.getElementById('gusBaelSlaskie').classList.remove('gusKpiUnavailable');
     document.getElementById('gusBaelSlaskieLabel').textContent='Śląskie • IV kw. 2025 (ostatni potwierdzony w panelu)';
     document.getElementById('gusBaelPolska').textContent=pl(values[1])+'%';document.getElementById('gusBaelPolskaLabel').textContent='Polska • II kw. 2026';
     document.getElementById('gusBaelGap').textContent='brak porównania dla tego samego kwartału 2026';
     document.getElementById('gusBaelChartNote').innerHTML='<b>Co pokazuje wykres?</b> Po lewej <b>Śląskie i Polska - IV kw. 2025</b>, a następnie <b>tylko Polska - I-II kw. 2026</b>. Śląski punkt z 2025 r. nie stanowi szacunku na 2026 r. Dane dotyczą ludności w wieku 15-89 lat.';
     document.getElementById('gusBaelInsight').innerHTML=`<strong>Ostatni pełny porównywalny okres (IV kw. 2025):</strong> Śląskie <b>${pl(lastSl)}%</b>, Polska <b>${pl(lastPl)}%</b>. W II kw. 2026 r. Polska <b>${pl(values[1])}%</b>; brak regionalnej wartości w bazie panelu.`;
     note.innerHTML='<b>Uwaga - brakująca seria Śląskiego:</b> US Katowice opublikował dane BAEL za II kwartał 2026 (29.09.2026), jednak wartości regionalne nie są zweryfikowane w dostarczonej bazie. Dane z IV kw. 2025 są pokazane z własną datą, bez interpolowania ani łączenia nieporównywalnych okresów.';
     source.innerHTML='Źródła: <a href="https://ssgk.stat.gov.pl/Rynek_pracy_BAEL.html" target="_blank" rel="noopener">GUS - Polska, II kw. 2026</a> · <a href="https://katowice.stat.gov.pl/opracowania-biezace/opracowania-sygnalne/praca-wynagrodzenie/aktywnosc-ekonomiczna-ludnosci-w-wojewodztwie-slaskim-w-4-kwartale-2025-r-%2C2%2C57.html" target="_blank" rel="noopener">US Katowice - Śląskie, IV kw. 2025</a> · <a href="https://publikacje.new.stat.gov.pl/portal-publikacje/aktywnosc-ekonomiczna-ludnosci-w-wojewodztwie-slaskim-w-2-kwartale-2026-r" target="_blank" rel="noopener">Publikacja BAEL Śląskie 2026 - do uzupełnienia</a>';
     return;
   }
   document.getElementById('gusBaelSlaskie').classList.remove('gusKpiUnavailable');
   compareLines('gusBaelChart',d.labels,d.detail,d.sl,d.pl,{metric,width:760,height:280});
   const last=d.labels.length-1,gap=d.sl[last]-d.pl[last],p=a?'IV kw. 2024 - IV kw. 2025':'IV kwartał każdego roku';
   document.getElementById('gusBaelSubtitle').textContent=a?'Wskaźnik zatrudnienia • kwartalnie • Śląskie vs Polska':'Współczynnik aktywności zawodowej • IV kwartał każdego roku';
   document.getElementById('gusBaelFresh').textContent=a?'IV kw. 2024-2025':'2016-2025';document.getElementById('gusBaelPeriod').textContent=p;
   document.getElementById('gusBaelTerritory').textContent='Śląskie vs Polska';
   document.getElementById('gusBaelSlaskie').textContent=pl(d.sl[last])+'%';document.getElementById('gusBaelPolska').textContent=pl(d.pl[last])+'%';
   document.getElementById('gusBaelSlaskieLabel').textContent='Śląskie • '+d.detail[last];document.getElementById('gusBaelPolskaLabel').textContent='Polska • '+d.detail[last];
   document.getElementById('gusBaelGap').textContent=`różnica: ${gap>0?'+':'−'}${pl(Math.abs(gap))} p.p.`;
   document.getElementById('gusBaelChartNote').innerHTML=a?'<b>Co pokazuje wykres?</b> Wskaźnik zatrudnienia - udział osób pracujących w ludności w wieku <b>15-89 lat</b>. Te same kwartały dla regionu i kraju.':'<b>Co pokazuje wykres?</b> Współczynnik aktywności zawodowej - udział osób aktywnych zawodowo (pracujących i bezrobotnych według BAEL) w ludności w wieku <b>15-89 lat</b>. Porównujemy <b>IV kwartał każdego roku</b>.';
   document.getElementById('gusBaelInsight').innerHTML=`<strong>${d.detail[last]}:</strong> Śląskie <b>${pl(d.sl[last])}%</b>, Polska <b>${pl(d.pl[last])}%</b>; różnica <b>${gap>0?'+':'−'}${pl(Math.abs(gap))} p.p.</b>.`;
   note.innerHTML='<b>Uwaga metodologiczna:</b> porównania danych sprzed i po NSP 2021 wymagają uwzględnienia zmiany podstawy uogólniania BAEL.';
   source.innerHTML='Źródła: GUS / BDL oraz US Katowice. <a href="https://katowice.stat.gov.pl/opracowania-biezace/opracowania-sygnalne/praca-wynagrodzenie/aktywnosc-ekonomiczna-ludnosci-w-wojewodztwie-slaskim-w-4-kwartale-2025-r-%2C2%2C57.html" target="_blank" rel="noopener">Śląskie</a> · <a href="https://ssgk.stat.gov.pl/04.2026/Rynek_pracy_BAEL.html" target="_blank" rel="noopener">Polska</a>';
 }
 const unempMonthly=window.PANEL_DATA.gus.unempMonthly;
 const unempAnnual=window.PANEL_DATA.gus.unempAnnual;
 const unempCountMonthly=window.PANEL_DATA.gus.unempCountMonthly;
 const unempCountAnnual=window.PANEL_DATA.gus.unempCountAnnual;
 let unempMetric='rate',unempMode='monthly';
 function renderUnemployment(){
   const annual=unempMode==='annual',count=unempMetric==='count';
   document.querySelectorAll('[data-unemp-mode]').forEach(b=>{const on=b.dataset.unempMode===unempMode;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
   document.querySelectorAll('[data-unemp-metric]').forEach(b=>{const on=b.dataset.unempMetric===unempMetric;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
   const period=annual?'stan na 31 grudnia każdego roku':'styczeń-wrzesień 2026';document.getElementById('gusUnempPeriod').textContent=period;
   document.getElementById('gusUnempFresh').textContent=annual?'2016-2025':'30.09.2026';
   document.getElementById('gusUnempLegendPl').classList.toggle('is-hidden',count);
   document.getElementById('gusUnempArea').textContent=count?'woj. śląskie':'Śląskie vs Polska';document.getElementById('gusUnempUnit').textContent=count?'jednostka: osoby':'jednostka: %';
   if(count){
     const d=annual?unempCountAnnual:unempCountMonthly;singleLine('gusUnempChart',d.labels,d.detail,d.vals,{metric:'Liczba bezrobotnych zarejestrowanych',width:640,height:250,color:'#b35e62'});
     document.getElementById('gusUnempSubtitle').textContent=annual?'Liczba bezrobotnych na koniec roku • woj. śląskie':'Miesięczna liczba bezrobotnych w 2026 r. • woj. śląskie';
     const first=d.vals[0],last=d.vals[d.vals.length-1],chg=last-first,pct=chg/first*100,maxV=Math.max(...d.vals),maxI=d.vals.indexOf(maxV);
     document.getElementById('gusUnempGap').textContent=annual?`2025: ${fmtInt(last)} osób`:`wrzesień 2026: ${fmtInt(last)} osób`;
     document.getElementById('gusUnempChartNote').innerHTML=annual?'<b>Opis wykresu:</b> liczba <b>bezrobotnych zarejestrowanych</b> w województwie śląskim według stanu na <b>31 grudnia</b> każdego roku w latach <b>2016-2025</b>. Każdy punkt pokazuje dokładną liczbę osób.':'<b>Opis wykresu:</b> miesięczna liczba <b>bezrobotnych zarejestrowanych</b> w województwie śląskim od stycznia do września 2026 r. Każdy punkt pokazuje stan na koniec miesiąca.';
     document.getElementById('gusUnempInsight').innerHTML=annual?`<strong>Zmiana 2016-2025:</strong> liczba bezrobotnych spadła z <b>${fmtInt(first)}</b> do <b>${fmtInt(last)}</b> osób, czyli o <b>${fmtInt(Math.abs(chg))}</b> (${pct<0?'−':'+'}${pl(Math.abs(pct))}%).`:`<strong>2026:</strong> w styczniu zarejestrowanych było <b>${fmtInt(first)}</b> osób, najwyższą wartość odnotowano w ${d.labels[maxI]} - <b>${fmtInt(maxV)}</b>, a we wrześniu <b>${fmtInt(last)}</b> osób.`;
     document.getElementById('gusUnempNote').innerHTML=annual?'<b>Uwaga metodologiczna:</b> od 1 czerwca 2025 r. zmieniły się zasady rejestracji osób bezrobotnych (miejsce zamieszkania zamiast zameldowania), dlatego porównania 2025 z wcześniejszymi latami należy interpretować ostrożnie.':'Dane miesięczne pokazują stan rejestrów PUP na koniec miesiąca. Od 1 czerwca 2025 r. obowiązują nowe zasady rejestracji według miejsca zamieszkania.';
     document.getElementById('gusUnempSource').innerHTML='Źródło: GUS / BDL oraz Wojewódzki Urząd Pracy w Katowicach. <a href="https://wupkatowice.praca.gov.pl/rynek-pracy/statystyki-i-analizy" target="_blank" rel="noopener">Otwórz dane WUP</a>';
   }else{
     const d=annual?unempAnnual:unempMonthly,all=[...d.sl,...d.pl],min=Math.floor((Math.min(...all)-.4)*2)/2,max=Math.ceil((Math.max(...all)+.4)*2)/2;
     compareLines('gusUnempChart',d.labels,d.detail,d.sl,d.pl,{metric:'Stopa bezrobocia rejestrowanego',width:640,height:250,min,max,slaskieColor:'#b35e62'});
     document.getElementById('gusUnempSubtitle').textContent=annual?'Stopa bezrobocia na koniec roku • Śląskie vs Polska':'Miesięczny przebieg stopy bezrobocia w 2026 r. • Śląskie vs Polska';
     const last=d.labels.length-1,gap=d.sl[last]-d.pl[last];document.getElementById('gusUnempGap').textContent=`${annual?'grudzień 2025':'wrzesień 2026'}: ${gap>0?'+':'−'}${pl(Math.abs(gap))} p.p.`;
     document.getElementById('gusUnempChartNote').innerHTML=annual?'<b>Opis wykresu:</b> stopa bezrobocia rejestrowanego według stanu na <b>31 grudnia</b> w latach <b>2016-2025</b> - woj. śląskie na tle Polski. Każdy punkt ma podaną dokładną wartość.':'<b>Opis wykresu:</b> miesięczny przebieg <b>stopy bezrobocia rejestrowanego</b> od stycznia do września 2026 r. - woj. śląskie na tle Polski. Każdy punkt ma podaną dokładną wartość.';
     document.getElementById('gusUnempInsight').innerHTML=annual?`<strong>2025:</strong> Śląskie <b>${pl(d.sl[last])}%</b>, Polska <b>${pl(d.pl[last])}%</b>; region był niżej o <b>${pl(Math.abs(gap))} p.p.</b>. W 2016 r. różnica wynosiła ${pl(Math.abs(d.sl[0]-d.pl[0]))} p.p.`:`<strong>Wrzesień 2026:</strong> Śląskie <b>${pl(d.sl[last])}%</b>, Polska <b>${pl(d.pl[last])}%</b>; różnica wynosiła <b>${pl(Math.abs(gap))} p.p.</b>.`;
     document.getElementById('gusUnempNote').innerHTML=annual?'<b>Uwaga metodologiczna:</b> dla 2020-2021 GUS publikował także wartości po rewizji. Wykres zachowuje historyczną serię zgodną z wykorzystaną serią wojewódzką.':'Główna mapa Barometru wykorzystuje dane powiatowe wg stanu na 31.08.2026 r. Ten wykres pokazuje nowszy wskaźnik wojewódzki i krajowy za wrzesień 2026 r.';
     document.getElementById('gusUnempSource').innerHTML='Źródło: GUS / Wojewódzki Urząd Pracy w Katowicach. <a href="https://stat.gov.pl/obszary-tematyczne/rynek-pracy/bezrobocie-rejestrowane/stopa-bezrobocia-rejestrowanego-w-latach-1990-2026%2C4%2C1.html" target="_blank" rel="noopener">Otwórz źródło GUS</a>';
   }
 }
 document.querySelectorAll('[data-bael-mode]').forEach(btn=>btn.addEventListener('click',()=>renderBael(btn.dataset.baelMode)));document.querySelectorAll('[data-unemp-mode]').forEach(btn=>btn.addEventListener('click',()=>{unempMode=btn.dataset.unempMode;renderUnemployment()}));document.querySelectorAll('[data-unemp-metric]').forEach(btn=>btn.addEventListener('click',()=>{unempMetric=btn.dataset.unempMetric;renderUnemployment()}));
 document.querySelectorAll('[data-regon-mode]').forEach(btn=>btn.addEventListener('click',()=>renderRegon(btn.dataset.regonMode)));document.querySelectorAll('[data-bael-period]').forEach(btn=>btn.addEventListener('click',()=>renderBael(baelMode,btn.dataset.baelPeriod)));renderRegon('historic');renderBael('activity','historic');renderUnemployment();
})();
