/* Obserwatorium v127: etykiety liczbowe w prezentacjach i płynne linie w PowerPoint.
   Nie wpływa na pozostałe eksporty (PDF / klasyczna prezentacja powiatowa). */
(() => {
  'use strict';
  const PALETTE={
    map:'3469AF',jobs:'C14C64',trends:'2A9075',rankings:'C14C64',
    unemployment:'B96B2B',foreigners:'3477AC',gus:'7964BD',demography:'26849B'
  };
  const NAVY='183758',TEXT='213D5C',MUTED='63768C',LIGHT='F4F7FB',BORDER='DCE5EF',WHITE='FFFFFF';
  const WIDTH=13.333,HEIGHT=7.5;
  // WUP 16:9 letterhead has its own logos, top divider and bottom contact bar.
  // All presentation objects are placed within its original unobstructed white area.
  const LAYOUT={left:.72,right:12.60,overline:1.40,title:1.69,subtitle:2.22,divider:2.62,
    contentTop:2.79,contentBottom:6.55,sourceY:6.71};
  let BRAND_IMAGE=null;
  async function loadBrandImage(){
    if(BRAND_IMAGE)return BRAND_IMAGE;
    try{
      const embedded=window.EXPORT_BRAND?.data || JSON.parse(document.getElementById('exportBrandAssets').textContent).blue;
      if(typeof embedded==='string' && /^data:image\/(?:jpeg|png);base64,/.test(embedded))return BRAND_IMAGE=embedded;
    }catch(_){}
    // Fallback is a same-origin asset supplied in the ZIP and stored by the service worker.
    const response=await fetch('assets/firmowka-blue.jpg');
    if(!response.ok)throw new Error('Nie można odczytać firmówki WUP.');
    const blob=await response.blob();
    BRAND_IMAGE=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('Błąd odczytu firmówki'));r.readAsDataURL(blob)});
    return BRAND_IMAGE;
  }
  function background(slide,pptx){
    slide.background={color:WHITE};
    if(BRAND_IMAGE)slide.addImage({data:BRAND_IMAGE,x:0,y:0,w:WIDTH,h:HEIGHT});
  }
  function contentPanel(slide,pptx,x=.76,y=LAYOUT.contentTop,w=11.82,h=LAYOUT.contentBottom-LAYOUT.contentTop){
    fill(slide,pptx,x,y,w,h,'F9FBFE',.12,'E4EBF3');
  }
  // Only document-facing text is normalized. Original labels and data stay unchanged.
  function exportText(s){return String(s??'')
    .replace(/[\u2013\u2014]/g,'-')
    .replace(/(?:według aktualnego widoku|Kliknij kategorię, aby zobaczyć jej historię|Kliknij powiat, by sprawdzić jego profil|Dodaj ten wykres|Dodaj tę mapę|Do prezentacji|Wybrane\s*✓|Dodano\s*✓)/gi,' ')
    .replace(/(?:Zobacz źródła i metodologię w Obserwatorium|Wybierz powiat lub miasto na prawach powiatu|Wybierz zawód z listy|Dane zapisane w chwili wyboru)/gi,' ')
    .replace(/\s+/g,' ').trim();}
  function clean(s){return exportText(s).replace(/\bDodaj\b/gi,' ').replace(/\s+/g,' ').trim()}
  function publicSource(source,section){const s=clean(source||'');
    if(!s||/^(?:źródło\s*:?)?\s*(?:zobacz|źródła i metodologia|obserwatorium rynku pracy|obserwatorium)$/i.test(s)){
      return section==='gus'?'GUS / Bank Danych Lokalnych':section==='unemployment'?'WUP w Katowicach / GUS':'Barometr Zawodów';
    }
    return s.replace(/^Źródło(?:\s+danych)?\s*:\s*/i,'');
  }
  function short(s,n=120){const v=clean(s);return v.length>n?v.slice(0,n-1).replace(/\s+\S*$/,'')+'…':v}
  // v142: Unified, evidence-based metadata for every exported analysis.
  // Prefer a snapshot captured with the chart; never use the globally selected
  // county as the subject of a multi-county chart.
  const COMPARE_METRICS={
    unemp:{name:'Stopa bezrobocia rejestrowanego',unit:'%',measure:'Stopa bezrobocia (%)',period:'30.09.2026 r.',source:'GUS / WUP Katowice - stopa bezrobocia rejestrowanego'},
    deficit:{name:'Grupy zawodów w deficycie',unit:'grup zawodów',measure:'Liczba grup zawodów',period:'prognoza 2027',source:'Barometr Zawodów 2027'},
    balance:{name:'Grupy zawodów w równowadze',unit:'grup zawodów',measure:'Liczba grup zawodów',period:'prognoza 2027',source:'Barometr Zawodów 2027'},
    surplus:{name:'Grupy zawodów w nadwyżce',unit:'grup zawodów',measure:'Liczba grup zawodów',period:'prognoza 2027',source:'Barometr Zawodów 2027'},
    no_eval:{name:'Grupy zawodów bez oceny',unit:'grup zawodów',measure:'Liczba grup zawodów',period:'prognoza 2027',source:'Barometr Zawodów 2027'}
  };
  function chartId(item){return item.settings?.chart||item.elementId||String(item.elementRef||'').replace(/^#/,'').split('/')[0]||''}
  function comparisonMeta(item){
    const metric=item.exportMeta?.metric||item.settings?.params?.compareChartMetric||'deficit';
    const m=COMPARE_METRICS[metric]||COMPARE_METRICS.deficit;
    const names=item.exportMeta?.counties||item.settings?.params?.comparedCounties||item.structured?.chartData?.rankings?.map(r=>r.label)||[];
    const count=[...new Set(names.filter(Boolean))].length;
    const unitsLabel=count%10>=2&&count%10<=4&&(count%100<12||count%100>14)?'wybrane jednostki':'wybranych jednostek';
    const captured=item.exportMeta?.period;
    // Old baskets might have come from August 2026. Attribute September only
    // if every saved value still equals the published September data in PANEL_DATA.
    const current=window.PANEL_DATA?.barometr?.stopaPowiatow||{};
    const oldRows=item.structured?.chartData?.rankings||[];
    const allMatch=metric==='unemp' && oldRows.length>=2 && oldRows.every(row=>
      Number.isFinite(current[row.label]) && Math.abs(Number(row.value)-current[row.label])<0.001);
    const period=captured||(metric==='unemp'?(allMatch?'stan na 30.09.2026 r.':'okres nieustalony - zaznacz ponownie wykres'):'prognoza 2027');
    return {comparison:true,metric,unit:m.unit,measure:m.measure,period,scope:(count?count+' '+unitsLabel:'Wybrane powiaty')+' województwa śląskiego',source:m.source,title:m.name+' - porównanie powiatów'};
  }
  function presentationMeta(item){
    const id=chartId(item),title=clean(item.title||'');
    const compare=id==='compareSection'||Boolean(item.settings?.params?.comparedCounties?.length)||/^(?:porównaj powiaty|porównanie na żywo)$/i.test(title);
    if(compare)return comparisonMeta(item);
    const stamp=item.exportMeta||{};
    const source=publicSource(item.source,item.view);
    const base={comparison:false,title:normalizeTitle(item),scope:scopeFallback(item),period:clean(stamp.period||item.period||''),unit:clean(stamp.unit||''),source,measure:clean(stamp.measure||''),note:clean(stamp.note||'')};
    if(id.startsWith('uk2026')){base.scope=clean(item.unit||'Województwo śląskie');base.source=source;base.period=clean(stamp.period||item.period||'');base.unit=stamp.unit||'osoby / zdarzenia';return base;}
    if(id==='baelQuarterSummary'||item.structured?.baelQuarter?.rows?.length){
      base.title='Liczba osób według BAEL - I vs II kwartał 2026';
      base.scope='Województwo śląskie';base.period='I i II kwartał 2026';
      base.unit='tys. osób';base.measure='Liczba osób (tys.)';
      base.source='GUS / Urząd Statystyczny w Katowicach - BAEL';
      return base;
    }
    if(item.structured?.occupationList){base.period='prognoza 2027';base.unit='liczba grup zawodów';base.source='Barometr Zawodów 2027';return base;}
    if(item.structured?.map){const map=item.structured.map;
      if(map.kind==='unemployment'){base.title='Mapa bezrobocia - '+(map.metric==='count'?'liczba bezrobotnych':'stopa bezrobocia rejestrowanego');base.period=map.period||base.period;base.unit=map.metric==='count'?'osoby':'%';base.source='GUS / WUP / PUP - dane powiatowe';}
      else if(map.mode==='unemployment'){base.period='stan na 30.09.2026 r.';base.unit='%';base.source='GUS / WUP Katowice - stopa bezrobocia rejestrowanego';}
      else {base.period='prognoza 2027';base.unit=map.mode==='balance'?'%': 'grupy zawodów';base.source='Barometr Zawodów 2027';}
      base.scope='Województwo śląskie - 36 powiatów i miast';return base;
    }
    if(item.view==='foreigners'){base.scope=clean(item.unit||'Województwo śląskie');base.source=source;base.period=clean(stamp.period||item.period||'');base.unit=clean(stamp.unit||base.unit||'osoby / %');return base;}
    if(item.view==='unemployment'||/gusUnempChart|wupUnemploymentChart|countyUnempChart|pupBars|pupTrendChart/i.test(id)){
      base.source=/^pupBars$|^pupTrendChart$/.test(id)?'Powiatowe urzędy pracy / MRPiPS-01':'WUP Katowice / GUS - bezrobocie rejestrowane';
      const isRate=/stopa|\brate\b|stopę/i.test(title+' '+(stamp.measure||''))||item.settings?.params?.countyUMetric==='rate';
      const share=item.settings?.params?.pupUnit==='share';
      base.unit=isRate||share?'%':'osoby';
      base.measure=isRate?'Stopa bezrobocia (%)':share?'Udział w grupie (%)':'Liczba osób';
      base.period=stamp.period||((id==='gusUnempChart')?'miesiące I-IX 2026 lub lata 2016-2025 (zgodnie z wykresem)':base.period);
      if(id==='gusUnempChart'||id==='wupUnemploymentChart'){base.scope='Województwo śląskie';}
    }
    if(item.view==='demography'){
      const isCounty=id==='demogCountyCard'||/demografia powiatowa/i.test(title);
      const isRegionalChart=/^demography(?:Population|Natural|Migration)ChartCard$/.test(id);
      base.scope=isCounty?clean(item.settings?.params?.demogCounty||item.exportMeta?.county||item.unit||'Wybrany powiat'):'Województwo śląskie';
      base.source=isCounty?'GUS / BDL, InfoGZM - szereg ludności':
        'Urząd Statystyczny w Katowicach - Sytuacja demograficzna województwa śląskiego w 2025 r.';
      base.period=stamp.period||(isCounty?'lata 2014-2025 (zgodnie z dostępnym szeregiem)':isRegionalChart?'2020-2025':'stan na 30.06.2026 r.');
      base.unit=stamp.unit||(isCounty||isRegionalChart?'osób':'osób');
      base.measure=stamp.measure||(isCounty||isRegionalChart?'Wskaźnik demograficzny':'Stan ludności');
    }
    if(item.view==='gus'){
      if(/demog/i.test(id+' '+title)){base.source='GUS / BDL oraz InfoGZM - dane o ludności';base.unit='osób';base.measure='Liczba mieszkańców';base.period=stamp.period||'szereg historyczny do 2025 r.';}
      else if(/Bael/i.test(id+' '+title)){base.source='GUS / Urząd Statystyczny w Katowicach - BAEL';base.unit='%';base.measure='Wskaźnik (%)';base.period=stamp.period||'historyczne do 2025 lub I-II kw. 2026 zgodnie z wykresem';base.scope='Województwo śląskie na tle Polski';}
      else if(/Regon/i.test(id+' '+title)){base.source='GUS / Urząd Statystyczny w Katowicach - REGON';base.unit=item.structured?.chartData?.unit||stamp.unit||'podmioty';base.measure='Liczba podmiotów lub wskaźnik REGON';base.period=stamp.period||'dane do sierpnia 2026';base.scope='Województwo śląskie';}
      else {base.source='GUS / Urząd Statystyczny w Katowicach';
        if(id==='regionalPulse'||id==='regionalNationalChart'||id==='regionalHistoryPanel')base.period=stamp.period||'głównie lipiec 2026; okres zależny od wskaźnika';}
    }
    if(item.view==='jobs'||item.view==='rankings'||item.view==='trends'){
      if(/stopa bezrobocia/i.test(title)){base.source='GUS / WUP Katowice - stopa bezrobocia rejestrowanego';base.period=stamp.period||'stan na 30.09.2026 r.';base.unit='%';}
      else {base.period=stamp.period||'prognoza Barometru Zawodów 2027';base.source='Barometr Zawodów 2027';}
      if(item.structured?.metrics?.some(m=>/stopa bezrobocia/i.test(m.label||''))||item.structured?.signals?.some(m=>/bezroboc/i.test((m.label||'')+' '+(m.detail||'')))){base.period='Barometr Zawodów 2027 · stopa bezrobocia 09.2026';base.source='Barometr Zawodów 2027; GUS / WUP Katowice';}
    }
    return base;
  }
  function scopeFallback(item){
    const id=chartId(item),name=clean(item.unit||'');
    if(id==='demogCountyCard')return clean(item.settings?.params?.demogCounty||item.exportMeta?.county||'Powiat - dane demograficzne');
    if((item.view==='gus'||item.view==='demography')&&id!=='demogLineChart'&&id!=='demogCountyCard')return 'Województwo śląskie';
    if(item.view==='unemployment'&&/gusUnempChart|wupUnemploymentChart/.test(id))return 'Województwo śląskie';
    if(item.view==='rankings')return 'Województwo śląskie';
    return name==='Województwo śląskie - średnie'?'Województwo śląskie':name;
  }
  function countAnalyses(n){return `${n} ${n===1?'analiza':(n%10>=2&&n%10<=4&&(n%100<12||n%100>14))?'analizy':'analiz'}`;}
  function number(s){const n=Number(String(s).replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?n:null}
  function fill(slide,pptx,x,y,w,h,color,rad=.14,stroke=null){slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h,rectRadius:rad,radius:rad,fill:{color},line:{color:stroke||color,width:stroke?0.7:0},adjustPoint:0.11})}
  function txt(slide,s,x,y,w,h,size=16,opt={}){slide.addText(clean(s),{x,y,w,h,fontFace:'Aptos',fontSize:size,color:TEXT,margin:0,breakLine:false,valign:'mid',...opt})}
  function shade(hex,a=0.1){const b=hex.match(/../g).map(x=>parseInt(x,16)),k=1-a;return b.map(x=>Math.round(x*a+255*k).toString(16).padStart(2,'0')).join('').toUpperCase()}
  function drawHeader(slide,pptx,title,unit,section,i,source){
    background(slide,pptx);
    const accent=PALETTE[section]||'3469AF';
    const headerTitle=section==='foreigners'?(/Ukrain/i.test(title)?'OBYWATELE UKRAINY / PUP':'CUDZOZIEMCY / GUS'):section==='demography'?'DEMOGRAFIA / GUS':section==='gus'?'DANE GUS / BDL':section==='unemployment'?'BEZROBOCIE REJESTROWANE':(/bezroboc/i.test(title)?'BEZROBOCIE REJESTROWANE':'BAROMETR ZAWODÓW 2027');
    fill(slide,pptx,LAYOUT.left,LAYOUT.overline,.07,.27,accent,.01);
    txt(slide,headerTitle,LAYOUT.left+.17,LAYOUT.overline-.01,10.8,.30,10.4,{bold:true,color:accent,charSpacing:1.5});
    // v125: Keep the heading on ONE line. Move detailed chart-switch labels
    // into the subtitle instead of letting the title cover the scope or plot.
    const parts=clean(title).split(' · ');
    const heading=short(parts[0],88);
    const detail=parts.slice(1).filter(Boolean).join(' · ');
    txt(slide,heading,LAYOUT.left,LAYOUT.title,11.8,.49,heading.length>69?17:heading.length>56?19.5:heading.length>42?22:27.5,
      {bold:true,color:NAVY,breakLine:false});
    const secondary=short((unit||'')+(detail?' · '+detail:''),143);
    txt(slide,secondary,LAYOUT.left+.01,LAYOUT.subtitle,11.7,.30,secondary.length>115?10.6:12.1,{color:MUTED});
    slide.addShape(pptx.ShapeType.line,{x:LAYOUT.left,y:LAYOUT.divider,w:11.84,h:0,line:{color:'DCE7F2',width:1}});
    // Source/page label placed ABOVE the source letterhead's printed bottom border.
    txt(slide,short('Źródło: '+publicSource(source,section),114),LAYOUT.left+.04,LAYOUT.sourceY,10.8,.23,8.5,{color:MUTED});
    txt(slide,String(i).padStart(2,'0'),11.96,LAYOUT.sourceY,.56,.23,9,{align:'right',color:accent,bold:true});
    return accent;
  }
  function card(slide,pptx,x,y,w,h,label,value,accent,desc=''){
    fill(slide,pptx,x,y,w,h,WHITE,.14,'E0E8F1');
    fill(slide,pptx,x,y,.064,h,accent,.02);
    txt(slide,short(label,70).toUpperCase(),x+.22,y+.16,w-.43,.27,10.1,{bold:true,color:MUTED,charSpacing:.35});
    txt(slide,short(value,42),x+.22,y+.47,w-.42,.62,String(value).length>19?21:27,{bold:true,color:NAVY});
    if(desc)txt(slide,short(desc,95),x+.22,y+h-.57,w-.43,.42,10.7,{color:MUTED,valign:'top',breakLine:false});
  }
  // v142: Same vertical, five-color layout as the comparison chart in the app.
  // v169: native PowerPoint columns, with an embedded editable Excel data table.
  // v179: Narracja Barometru w pełnej długości, jako EDYTOWALNE pola tekstowe PPTX.
  // Zwykłe karty sygnałów skracają opisy do 170 znaków; analiza lokalna nie może tracić treści.
  function drawMapCommentary(slide,pptx,item,accent){
    const pieces=item.structured?.signals||[];
    if(pieces.length<2)return false;
    contentPanel(slide,pptx);
    const rows=pieces.slice(0,2);
    const pos=[{y:2.96,h:1.66},{y:4.82,h:1.63}];
    rows.forEach((part,i)=>{
      const {y,h}=pos[i],x=1.05,w=11.13;
      fill(slide,pptx,x,y,w,h,WHITE,.13,'DDE7F3');
      fill(slide,pptx,x,y,.07,h,accent,.01);
      txt(slide,part.label,x+.24,y+.14,w-.49,.31,14,{bold:true,color:NAVY,valign:'mid'});
      const content=String(part.detail||'').trim();
      const size=content.length>450?10.7:content.length>340?11.1:11.7;
      txt(slide,content,x+.24,y+.49,w-.49,h-.59,size,{color:TEXT,fit:'shrink',valign:'top',breakLine:false});
    });
    return true;
  }
  function drawComparison(slide,pptx,rows,meta){
    const valid=(rows||[]).filter(x=>x?.label&&Number.isFinite(Number(x.value))).slice(0,5);
    if(valid.length<2)return false;
    const labels=valid.map(z=>short(String(z.label).replace(/^powiat\s+/i,''),32));
    const values=valid.map(z=>Number(z.value));
    contentPanel(slide,pptx);
    txt(slide,meta.measure,1.08,2.96,10.7,.23,11.8,{bold:true,color:'48617B'});
    try{
      slide.addChart(pptx.ChartType.bar,[{name:meta.measure||'Wartość',labels,values}],{
        x:1.17,y:3.22,w:11.02,h:3.05,barDir:'col',grouping:'clustered',
        chartColors:['3469AF'],varyColors:true,showLegend:false,showTitle:false,
        showValue:true,dataLabelPosition:'outEnd',dataLabelFontFace:'Aptos',dataLabelFontSize:10,
        dataLabelColor:NAVY,dataLabelFormatCode:meta.unit==='%'?'0.0':'#,##0',
        showCatName:false,showSerName:false,showMarker:false,
        catAxisLabelFontFace:'Aptos',catAxisLabelFontSize:9.4,catAxisLabelColor:'536B83',
        catAxisColor:'B9CADA',valAxisLabelFontFace:'Aptos',valAxisLabelFontSize:9,
        valAxisLabelColor:'536B83',valAxisColor:'FFFFFF',
        valGridLine:{color:'E4EBF2',width:.75},showBorder:false,showShadow:false,
        showChartTitle:false,
      });
      return true;
    }catch(err){console.warn('Porównanie PPTX',err);return false}
  }
  // v169: rankings can be edited with Chart Design -> Edit Data in PowerPoint.
  function addRank(slide,pptx,rows,accent,heading='LICZBA WSKAZAŃ'){
    const r=(rows||[]).filter(z=>z.label&&Number.isFinite(Number(z.value))).slice(0,10);
    if(!r.length)return false;
    contentPanel(slide,pptx);
    txt(slide,short(heading,90),1.13,2.96,10.7,.20,10,{color:MUTED,bold:true});
    const labels=r.map(z=>short(z.label,51)).reverse();
    const values=r.map(z=>Number(z.value)).reverse();
    const isPct=/%/.test(heading);
    try{
      slide.addChart(pptx.ChartType.bar,[{name:heading,labels,values}],{
        x:.91,y:3.19,w:11.42,h:3.12,barDir:'bar',grouping:'clustered',
        chartColors:[accent],showTitle:false,showLegend:false,
        showValue:true,dataLabelPosition:'outEnd',dataLabelFontFace:'Aptos',
        dataLabelFontSize:9.2,dataLabelColor:NAVY,
        dataLabelFormatCode:isPct?'0.0':'#,##0',
        catAxisLabelFontFace:'Aptos',catAxisLabelFontSize:8.6,catAxisLabelColor:'213D5C',
        catAxisColor:'FFFFFF',valAxisLabelFontFace:'Aptos',valAxisLabelFontSize:8.4,
        valAxisLabelColor:'64748B',valAxisColor:'FFFFFF',
        valGridLine:{color:'E4EBF2',width:.65},
        showBorder:false,showShadow:false,showChartTitle:false,
      });
      return true;
    }catch(err){console.warn('Ranking PPTX',err);return false}
  }

// v169: three independent EDITABLE bar charts, each with embedded worksheet values.
function drawBaelQuarterCards(slide,pptx,rows,accent){
  const list=(rows||[]).filter(r=>r&&r.label&&(r.q1||r.q2)).slice(0,3);
  if(!list.length)return false;
  contentPanel(slide,pptx);
  const x0=1.02,y=3.06,gap=.24,w=(11.26-gap*2)/3,h=2.67;
  list.forEach((row,i)=>{
    const x=x0+i*(w+gap),q1=number(row.q1),q2=number(row.q2);
    fill(slide,pptx,x,y,w,h,WHITE,.15,'DCE5EF');
    txt(slide,short(row.label,48),x+.18,y+.16,w-.36,.24,11.6,{bold:true,color:NAVY});
    txt(slide,'I kw. '+Number(q1).toLocaleString('pl-PL')+' tys.',x+.20,y+.48,w*.50,.30,12.2,{bold:true,color:NAVY});
    txt(slide,'II kw. '+Number(q2).toLocaleString('pl-PL')+' tys.',x+w*.50,y+.48,w*.50-.17,.30,12.2,{bold:true,color:NAVY,align:'right'});
    // Data series are separate so that the 2026 quarters keep two tones.
    try{
      slide.addChart(pptx.ChartType.bar,[
        {name:'I kw. 2026',labels:[row.label],values:[q1]},
        {name:'II kw. 2026',labels:[row.label],values:[q2]}
      ],{
        x:x+.12,y:y+.82,w:w-.24,h:1.20,barDir:'col',grouping:'clustered',
        chartColors:['A5C7EB','377AB9'],showTitle:false,showLegend:false,
        showValue:false,showCatName:false,showSerName:false,
        showCatAxis:false,showValAxis:false,catAxisLabelPos:'none',valAxisLabelPos:'none',
        catAxisLabelColor:'FFFFFF',valAxisLabelColor:'FFFFFF',
        catAxisLabelFontSize:1,valAxisLabelFontSize:1,
        valAxisMinVal:0,valGridLine:{color:'FFFFFF',width:0},
        showBorder:false,showShadow:false,showChartTitle:false
      });
    }catch(err){throw new Error('BAEL: nie można utworzyć edytowalnego wykresu '+row.label+': '+err.message)}
    txt(slide,short(row.detail||'',70),x+.18,y+h-.45,w-.36,.24,9.4,{color:TEXT});
  });
  txt(slide,'Dane w tysiącach osób, z badania reprezentacyjnego BAEL. Nie porównuj bezpośrednio z rejestracjami w PUP.',1.04,6.31,10.9,.18,8.6,{color:MUTED});
  return true;
}

// v169: a faithful chart type is chosen from the nature of the series.
// Both charts below are true PowerPoint column charts (not PNGs or drawn bars).
function drawDemographyColumns(slide,pptx,chart,kind){
  const labels=(chart?.labels||[]).map(String);
  const source=chart?.series||[];
  if(labels.length<2||!source.length)return false;
  const series=source.map(z=>({
    name:String(z.name||'Wartość'),labels,
    values:labels.map((_,i)=>{
      const v=z.values?.[i];return v===null||v===undefined?null:Number((Number(v)/1000).toFixed(3));
    })
  }));
  if(!series.every(z=>z.values.some(Number.isFinite)))return false;
  const isMigration=kind==='migration';
  contentPanel(slide,pptx);
  txt(slide,isMigration?'Saldo migracji (tys. osób)':'Urodzenia i zgony (tys. zdarzeń)',1.22,2.90,10.7,.20,10.7,{bold:true,color:MUTED});
  const observed=series.flatMap(z=>z.values).filter(Number.isFinite);
  const min=Math.min(...observed),max=Math.max(...observed);
  const opts={
    x:1.15,y:3.22,w:11.07,h:3.10,barDir:'col',grouping:'clustered',
    chartColors:isMigration?['B65B78']:['1CA5A2','D54D75'],
    showTitle:false,showLegend:!isMigration,legendPos:'b',legendFontFace:'Aptos',legendFontSize:10,
    showValue:true,dataLabelPosition:isMigration?'inEnd':'outEnd',
    dataLabelFontFace:'Aptos',dataLabelFontSize:9.6,
    dataLabelColor:isMigration?'FFFFFF':NAVY,dataLabelFormatCode:'0.0',
    showCatName:false,showSerName:false,
    catAxisLabelFontFace:'Aptos',catAxisLabelFontSize:10.2,
    catAxisColor:'A9BDD1',catAxisLabelColor:'536B83',
    valAxisLabelFontFace:'Aptos',valAxisLabelFontSize:9,
    valAxisLabelColor:'536B83',valAxisColor:'FFFFFF',
    valAxisLabelFormatCode:'0.0',valGridLine:{color:'E4EBF2',width:.7},
    showBorder:false,showShadow:false,showChartTitle:false
  };
  if(isMigration){
    opts.valAxisMinVal=Math.floor(Math.min(-.2,min*1.12)*2)/2;
    opts.valAxisMaxVal=0;
  }else{
    opts.valAxisMinVal=0;
    opts.valAxisMaxVal=Math.ceil(max*1.16/10)*10;
  }
  try{slide.addChart(pptx.ChartType.bar,series,opts)}
  catch(err){console.warn('Demografia PPTX',err);return false}
  const fmt=n=>Math.round(n).toLocaleString('pl-PL');
  const last=labels.length-1;
  if(isMigration)txt(slide,'2025: '+fmt(source[0].values[last])+' osób - ujemne saldo oznacza przewagę wyjazdów.',1.12,6.34,11.1,.18,9.1,{color:MUTED});
  else txt(slide,'2025: '+fmt(source[0].values[last])+' urodzeń i '+fmt(source[1].values[last])+' zgonów.',1.12,6.34,11.1,.18,9.1,{color:MUTED});
  return true;
}

  // v170: two distinct periods -> editable native column chart, not SVG screenshot.
  function drawEconomicComparisonColumns(slide,pptx,chart){
    const raw=chart?.series?.[0]?.values||[];
    const values=raw.map(Number);
    if(values.length!==2||!values.every(Number.isFinite))return false;
    contentPanel(slide,pptx);
    txt(slide,'Porównanie poziomu wskaźnika - lipiec 2025 i lipiec 2026',1.10,2.93,10.9,.24,12,{bold:true,color:MUTED});
    try{
      slide.addChart(pptx.ChartType.bar,[{name:chart.series[0].name,labels:['Lipiec 2025*','Lipiec 2026'],values}],{
        x:1.12,y:3.29,w:11.02,h:2.85,barDir:'col',grouping:'clustered',
        chartColors:['346BA5'],showTitle:false,showLegend:false,showValue:true,
        dataLabelPosition:'outEnd',dataLabelFontFace:'Aptos',dataLabelFontSize:12.5,
        dataLabelColor:NAVY,dataLabelFormatCode:chart.unit==='zł brutto'?'#,##0.00':'#,##0.0',
        catAxisLabelFontSize:12,catAxisLabelColor:TEXT,
        valAxisLabelFontSize:9,valAxisLabelColor:MUTED,
        valAxisMinVal:0,valGridLine:{color:'E4EBF2',width:.8},
        showBorder:false,showShadow:false,
      });
      txt(slide,'* 2025: wartość przybliżona odtworzona z dynamiki r/r. Nie jest osobną obserwacją GUS.',1.18,6.23,11.0,.27,8.6,{color:MUTED});
      return true;
    }catch(e){console.warn('PPTX porównanie 2 okresów',e);return false}
  }
  function addMetrics(slide,pptx,metrics,accent){
    const list=metrics.filter(m=>m.label && m.value!==null && m.value!==undefined && String(m.value).trim()!=='').slice(0,8);
    if(!list.length)return false;
    contentPanel(slide,pptx);
    const cols=list.length===1?1:list.length<=2?2:(list.length===4?2:(list.length<=6?3:4));
    const rows=Math.ceil(list.length/cols),width=(11.22-(cols-1)*.19)/cols;
    const usable=3.29,height=Math.min(1.73,(usable-(rows-1)*.17)/rows);
    const total=rows*height+(rows-1)*.17,sy=3.01+(usable-total)/2;
    list.forEach((m,i)=>card(slide,pptx,1.04+(i%cols)*(width+.19),sy+Math.floor(i/cols)*(height+.17),width,height,m.label,String(m.value),accent,m.detail||''));
    return true;
  }
  function addStatements(slide,pptx,items,accent){
    const q=items.filter(o=>o.label||o.detail).slice(0,5);
    if(!q.length)return false;
    contentPanel(slide,pptx);
    const n=q.length,cols=n<=2?1:2,w=cols===2?5.45:11.12,rows=Math.ceil(n/cols);
    const h=Math.min(1.62,(3.31-(rows-1)*.16)/rows);
    const start=3.02+(3.31-(rows*h+(rows-1)*.16))/2;
    q.forEach((m,i)=>{
      const x=1.05+(i%cols)*(w+.22),y=start+Math.floor(i/cols)*(h+.16);
      fill(slide,pptx,x,y,w,h,WHITE,.13,'E0E8F1');
      fill(slide,pptx,x,y,.063,h,accent,.02);
      txt(slide,short(m.label,98),x+.23,y+.17,w-.43,.38,15.2,{bold:true,color:NAVY});
      txt(slide,short(m.detail,170),x+.23,y+.62,w-.45,Math.max(.33,h-.73),11.6,{color:MUTED,valign:'top',breakLine:false});
    });
    return true;
  }
  // v126: Use ONE native editable PowerPoint line chart per time series.
  // Previously every interval was an independent ShapeType.line; their corners
  // and endpoints produced visibly broken/rough joins (especially in Keynote).
  // A native chart joins each series as a single path without overlapping ends.
  // Do NOT interpolate missing observations or smooth discrete observations.
  function drawSeries(slide,pptx,chart,accent){
    const labels=Array.isArray(chart?.labels)?chart.labels.map(x=>clean(x)):[];
    const source=Array.isArray(chart?.series)?chart.series:[];
    const series=source.map(s=>({
      name:clean(s.name||'Wartość'),
      values:labels.map((_,i)=>{
        const v=s.values?.[i];
        if(v===null||v===undefined||v==='')return null;
        const n=typeof v==='number'?v:Number(String(v).replace(/\s/g,'').replace(',','.'));
        return Number.isFinite(n)?n:null;
      })
    })).filter(s=>s.values.some(Number.isFinite));
    if(!labels.length||!series.length)return false;
    if(labels.length===1){
      const metrics=series.map(s=>({label:s.name,value:Number(s.values[0]).toLocaleString('pl-PL'),detail:labels[0]}));
      return addMetrics(slide,pptx,metrics,accent);
    }
    const observed=series.flatMap(s=>s.values).filter(Number.isFinite);
    if(!observed.length)return false;
    contentPanel(slide,pptx);
    const chartColors=[accent,'7296BD','2A9075','CA904B'];
    if(chart.unit)txt(slide,'Jednostka: '+chart.unit,1.27,2.83,7.5,.18,9.1,{color:MUTED});
    const entries=series.slice(0,4).map(s=>({name:short(s.name,56),labels,values:s.values}));
    // For sparse time series keep the actual spacing of observations; gaps stay gaps.
    // Reducing marker size on long series also avoids overlapping circles.
    const marker=labels.length<=20;
    const isPercentage=chart.unit==='%'||/%/.test(String(chart.unit||''));
    const decimals=isPercentage||observed.some(x=>!Number.isInteger(x))?1:0;
    const min=Math.min(...observed),max=Math.max(...observed);
    // Rounded axis limits matter: fractional tick labels for *integer people*
    // (e.g. "9 278,984") look unprofessional and imply false precision.
    const span=Math.max(max-min,Math.abs(max)*.025,0.0001);
    const roughStep=span/4.4,base=Math.pow(10,Math.floor(Math.log10(roughStep)));
    const fraction=roughStep/base;
    const step=base*(fraction<=1?1:fraction<=2?2:fraction<=2.5?2.5:fraction<=5?5:10);
    let lower=Math.floor((min-step*.30)/step)*step;
    let upper=Math.ceil((max+step*.30)/step)*step;
    if(min>=0 && lower<0)lower=0;
    if(upper<=lower)upper=lower+step;
    // Floating point noise can leak into the axis XML; limit it here.
    const precision=Math.max(0,-Math.floor(Math.log10(step))+1);
    const fixed=n=>Number(n.toFixed(precision));
    lower=fixed(lower);upper=fixed(upper);
    // v127 — native labels only for sufficiently sparse, non-colliding data.
    // The chart engine positions these labels next to actual markers. Dense
    // series use a small row with selected point values instead of overlapping.
    const closeSeries=entries.length>1 && entries.some((s,si)=>entries.slice(si+1).some(other=>
      s.values.some((v,i)=>Number.isFinite(v)&&Number.isFinite(other.values[i])&&Math.abs(v-other.values[i])<Math.max(step*.70,(upper-lower)*.11))));
    const labelAtPoints=entries.length===1 ? labels.length<=9 : entries.length===2&&labels.length<=6&&!closeSeries;
    const chartOpts={
      x:1.24,y:3.01,w:10.95,h:labelAtPoints?3.18:2.96,
      chartColors,showTitle:false,showValue:labelAtPoints,showSerName:false,
      dataLabelPosition:'t',dataLabelFontFace:'Aptos',dataLabelFontSize:8,
      dataLabelColor:'3B536D',dataLabelFormatCode:decimals?'0.0':'#,##0',
      showLegend:entries.length>1,legendPos:'b',legendFontFace:'Aptos',
      legendFontSize:9.5,showMarker:marker,markerSize:labels.length<=10?4.5:3,
      lineSize:2.3,smoothLine:false,displayBlanksAs:'gap',
      showCatAxisTitle:false,showValAxisTitle:false,
      catAxisLabelFontFace:'Aptos',catAxisLabelFontSize:9,
      catAxisColor:'B9CADA',catAxisLabelColor:'536B83',
      valAxisLabelFontFace:'Aptos',valAxisLabelFontSize:8.8,
      valAxisLabelColor:'536B83',valAxisColor:'FFFFFF',
      valGridLine:{color:'E4EBF2',width:0.75},
      showBorder:false,showShadow:false,
      showCatName:false,showDataLabelLegendKey:false,
      valAxisMinVal:lower,valAxisMaxVal:upper,valAxisMajorUnit:fixed(step),
            showChartTitle:false,
    };
    // With many observations, reduce label frequency rather than crowding labels.
    if(labels.length>12)chartOpts.catAxisLabelFreq=Math.ceil(labels.length/9);
    try{
      // Comparisons covering only 2-3 dates are clearer as editable columns.
      const shortComparison=labels.length<=3;
      const kind=shortComparison?pptx.ChartType.bar:pptx.ChartType.line;
      if(shortComparison){
        chartOpts.barDir='col';chartOpts.grouping='clustered';
        chartOpts.showMarker=false;chartOpts.showValue=true;
        chartOpts.legendPos='b';chartOpts.dataLabelPosition='outEnd';
        chartOpts.x=1.32;chartOpts.y=3.05;chartOpts.w=10.85;chartOpts.h=3.03;
        delete chartOpts.lineSize;delete chartOpts.markerSize;delete chartOpts.smoothLine;
      }
      slide.addChart(kind,entries,chartOpts);
      if(!labelAtPoints){
        // Place the numbers in a collision-free reference strip, below the plot.
        // Avoid claiming that every measurement fits above its point.
        const keys=[];
        entries.slice(0,2).forEach((s,si)=>{
          const valid=s.values.map((v,i)=>({v,i})).filter(z=>Number.isFinite(z.v));
          if(!valid.length)return;
          const chosen=[valid[0],valid[Math.floor(valid.length/2)],valid[valid.length-1]];
          const uniq=[...new Map(chosen.map(z=>[z.i,z])).values()];
          uniq.forEach(z=>keys.push({name:s.name,period:labels[z.i],value:z.v,accent:chartColors[si]}));
        });
        const visible=keys.slice(0,6), w=10.55/Math.max(1,visible.length);
        visible.forEach((z,i)=>{
          const fmt=z.value.toLocaleString('pl-PL',{minimumFractionDigits:decimals,maximumFractionDigits:decimals})+(isPercentage?'%':'');
          const x=1.29+i*w;
          txt(slide,short((entries.length>1?z.name+' · ':'')+z.period,24),x,6.08,w-.10,.15,7.6,{color:MUTED,align:'center'});
          txt(slide,fmt,x,6.24,w-.10,.21,9.6,{color:z.accent,bold:true,align:'center'});
        });
      }
      return true;
    }catch(error){
      // Prevent an apparently valid empty slide on engines lacking chart support.
      console.error('PowerPoint line chart:',error);
      return false;
    }
  }
  function legacyCategoryRows(item){
    const title=clean(item.title).toLowerCase(),t=clean(item.text||'');
    let names=[];
    if(title.includes('wykształcenie'))names=['Wyższe','Policealne i średnie zawodowe / branżowe','Średnie ogólnokształcące','Zasadnicze zawodowe / branżowe','Gimnazjalne / podstawowe i poniżej'];
    else if(title.includes('staż pracy'))names=['Do 1 roku','1-5 lat','5-10 lat','10-20 lat','20-30 lat','30 lat i więcej','Bez stażu'];
    else if(title.includes('płeć'))names=['Kobiety','Mężczyźni'];
    else if(title.includes('czas pozostawania'))names=['Do 1 miesiąca','1-3 miesiące','3-6 miesięcy','6-12 miesięcy','12-24 miesiące','Powyżej 24 miesięcy'];
    if(!names.length)return [];
    const out=[];
    for(let i=0;i<names.length;i++){
      const start=t.indexOf(names[i]);if(start<0)continue;
      const segment=t.slice(start+names[i].length, i<names.length-1&&t.indexOf(names[i+1],start+names[i].length)>=0?t.indexOf(names[i+1],start+names[i].length):undefined);
      const m=segment.match(/^\s*([\d\s.,]+)(?=\s|$)/),v=m?number(m[1]):NaN;
      if(Number.isFinite(v))out.push({label:names[i],value:v});
    }
    return out;
  }
  function usefulNarrative(item){
    const t=parseNarrative(item);
    if(t.length<26)return '';
    if(/^(?:Zestawienie od dwóch|Wybierz|Brak danych|Dane pojawią się|Porównanie na żywo|Najważniejsze|Demografia powiatowa)/i.test(t))return '';
    return t;
  }
  function parseRank(item){
    if(item.structured?.rankings?.length)return item.structured.rankings;
    let t=clean(item.text),title=clean(item.title);if(t.startsWith(title))t=t.slice(title.length);
    t=t.replace(/Tylko zawody wskazane.*$/i,'');
    const out=[];const re=/([^0-9]+?)\s+(\d{1,3})(?=\s|$)/g;let m;
    while((m=re.exec(t))!==null){let label=clean(m[1]).replace(/^[·:;,-]+/,'');if(label.length<3)continue;
      if(/(województwo|2027|2026|najczęściej|najmniej|wskazywane zawody)/i.test(label)&&!out.length){label=label.replace(/^.*?(?:2027|deficytowe)\s+/i,'').trim();}
      if(label.length>70)label=label.slice(-70);
      if(label.length<3)continue;
      out.push({label,value:Number(m[2])});if(out.length>=10)break;
    }
    return out;
  }
  function parseAge(item){
    const t=clean(item.text),re=/((?:18[–-]24|25[–-]34|35[–-]44|45[–-]54|55[–-]59)\s+lat(?:a)?|60\s+lat\s+i\s+więcej)\s+(\d{1,7})/gi,rows=[];let m;
    while((m=re.exec(t))!==null)rows.push({label:m[1],value:+m[2]});return rows;
  }
  function parseSector(item){
    const t=clean(item.text),defs=[
      ['Zatrudnienie','Zatrudnienie w przedsiębiorstwach'],
      ['Wynagrodzenia','Przeciętne wynagrodzenie brutto'],
      ['Produkcja przemysłowa','Produkcja sprzedana przemysłu'],
      ['Inwestycje','Nakłady inwestycyjne przedsiębiorstw']
    ];
    const arr=[];
    for(let i=0;i<defs.length;i++){
      const label=defs[i][1],start=t.indexOf(label);if(start<0)continue;
      let end=t.length;
      for(let j=i+1;j<defs.length;j++){const pos=t.indexOf(defs[j][1],start+label.length);if(pos>=0){end=pos;break}}
      const part=t.slice(start+label.length,end),match=part.match(/(?:-?\d[\d\s ]*(?:[,.]\d+)?\s*(?:tys\.\s*(?:etatów|osób)?|mld\s*zł|zł|etatów|osób|%))/i);
      if(match){const detailText=part.slice(match.index+match[0].length),period=detailText.match(/[+-]\d+(?:[,.]\d+)?%\s*r\/r\s*(?:VII|VI|I-VI|\d{1,2})?\s*2026/i);arr.push({label:defs[i][0],value:match[0].trim(),detail:period?period[0]:short(detailText,55)});}
    }
    return arr;
  }
  function parseBenchmark(item){
    const t=clean(item.text),upper=t.toUpperCase(),defs=['DEFICYT','RÓWNOWAGA','NADWYŻKA','BEZ OCENY','STOPA BEZROBOCIA'];const arr=[];
    for(let i=0;i<defs.length;i++){
      const lab=defs[i],start=upper.indexOf(lab);if(start<0)continue;
      let end=t.length;
      for(const next of defs.slice(i+1)){const ix=upper.indexOf(next,start+lab.length);if(ix>=0&&ix<end)end=ix;}
      const part=t.slice(start+lab.length,end).trim();const m=part.match(/^(-?\d+(?:[,.]\d+)?%?)\s*([+-]\d+(?:[,.]\d+)?(?:\s*p\.p\.)?)?/);
      if(m){const delta=m[2]?.trim();arr.push({label:lab,value:m[1],detail:delta?'Odchylenie: '+delta+' względem województwa':'Średnia dla województwa'});}
    }return arr;
  }
  function parseOccupationStructure(item){
    const t=clean(item.text);if(!/STRUKTURA OCEN 2027/i.test(t))return [];
    const rows=[];for(const label of ['Deficyt','Równowaga','Nadwyżka','Bez oceny']){
      const re=new RegExp(label+'\\s+(\\d{1,3})(?=\\s|$)','i'),m=t.match(re);if(m)rows.push({label,value:m[1]});
    }return rows;
  }
  function parseNarrative(item){
    let t=clean(item.text||'');const title=clean(item.title);
    if(title&&t.startsWith(title))t=t.slice(title.length).trim();
    const ex=['Powiat / miasto','Województwo śląskie - średnie','Widok mapy i analiza zawodu','Wybierz powiat','Wybierz zawód','Powiat lub miasto na prawach powiatu','Otwórz źródło','Źródło GUS','Dane GUS / BDL'];
    for(const x of ex)t=t.replaceAll(x,' ');
    t=t.replace(/\b(?:będziński|Bielsko-Biała|bieruńsko-lędziński|Chorzów|Częstochowa|Gliwice|Katowice|Tychy)\b(?=\s+(?:bielski|Bielsko-Biała|bieruńsko-lędziński|Bytom|Chorzów|Częstochowa))/gi,' ');
    t=clean(t);
    const result=t.match(/^(.*?)(?:\.|;)(?:\s|$)/)?.[1]||t;
    return short(result,240);
  }
  function scope(item){
    if(item.structured?.map)return 'WOJEWÓDZTWO ŚLĄSKIE · '+short(item.structured.map.occupation||item.structured.map.period||item.structured.map.mode||'',94);
    const t=clean(item.title);if(/Województwo śląskie - punkt odniesienia/i.test(t))return clean(item.unit).toUpperCase()+' · W PORÓWNANIU ZE ŚREDNIĄ WOJEWÓDZKĄ';
    if(item.view==='rankings'||/Gospodarka województwa|Najwięcej grup deficytowych|Najmniej grup deficytowych|Najczęściej wskazywane|Najrzadziej wskazywane/i.test(t))return 'WOJEWÓDZTWO ŚLĄSKIE · ZESTAWIENIE REGIONALNE';
    if(item.view==='gus'&&/demografia powiatowa/i.test(t))return item.settings?.params?.demogCounty?`POWIAT / MIASTO: ${item.settings.params.demogCounty}`:'DEMOGRAFIA POWIATOWA';
    const u=clean(item.unit),period=clean(item.period||'');return (u==='Województwo śląskie - średnie'?'WOJEWÓDZTWO ŚLĄSKIE':u.toUpperCase())+(period?' · '+short(period,36):'');
  }
  function normalizeTitle(item){
    if(/^Analiza zawodów$/i.test(item.title)){const t=clean(item.text);return short(t.replace(/^(?:Analiza zawodów\s*)/i,''),85)||item.title;}
    if(item.title===item.unit)return 'Profil powiatu i struktura zawodów';
    return clean(item.title||'Analiza rynku pracy');
  }
  function drawCover(pptx,items){
    const slide=pptx.addSlide();background(slide,pptx);
    fill(slide,pptx,.82,1.71,11.64,4.79,'F7FAFE',.19,'D9E5F1');
    fill(slide,pptx,.82,1.71,.095,4.79,'2F6FB0',.01);
    txt(slide,'OBSERWATORIUM · RYNEK PRACY · 2027',1.20,2.11,10.48,.39,13,{color:'2F6FB0',bold:true,charSpacing:1.4});
    txt(slide,'Wybrane analizy\nrynku pracy',1.18,2.68,10.7,1.24,36,{color:NAVY,bold:true,breakLine:false,valign:'top'});
    const scopes=items.map(presentationMeta);
    const units=[...new Set(scopes.map(x=>x.scope).filter(Boolean))];
    const description=units.length===1?'Zakres: '+short(units[0],95):units.length<=3?'Zakres: '+short(units.join(' · '),105):'Zakres: województwo śląskie - różne analizy i jednostki';
    txt(slide,description,1.2,4.29,10.5,.61,16,{color:TEXT,breakLine:false});
    slide.addShape(pptx.ShapeType.line,{x:1.2,y:5.27,w:10.79,h:0,line:{color:'D7E4F1',width:1}});
    txt(slide,countAnalyses(items.length),1.20,5.55,5.3,.40,16,{color:NAVY,bold:true});
    txt(slide,new Date().toLocaleDateString('pl-PL'),9.18,5.57,2.73,.35,14,{color:MUTED,align:'right'});
  }
  function svgConvert(input){return new Promise(async(resolve)=>{
    if(!input)return resolve(null);
    try{let svg=new DOMParser().parseFromString(input,'image/svg+xml').documentElement;if(svg.tagName?.toLowerCase()!=='svg')return resolve(null);
      svg.setAttribute('xmlns','http://www.w3.org/2000/svg');const vb=svg.getAttribute('viewBox')?.trim().split(/[ ,]+/).map(Number)||[];
      const w=Math.min(1500,Math.max(340,parseFloat(svg.getAttribute('width'))||vb[2]||1100)),h=Math.min(1000,Math.max(250,parseFloat(svg.getAttribute('height'))||vb[3]||700));
      svg.setAttribute('width',String(w));svg.setAttribute('height',String(h));
      const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
      const img=new Image();img.onload=()=>{try{const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
      const px=ctx.getImageData(0,0,w,h).data;let visual=0;const step=Math.max(1,Math.floor(Math.max(w,h)/300));
      for(let yy=0;yy<h;yy+=step)for(let xx=0;xx<w;xx+=step){const j=(yy*w+xx)*4;
        if(px[j+3]>90 && (px[j]<220||px[j+1]<220||px[j+2]<220))visual++;
      }
      resolve(visual>=12?{data:c.toDataURL('image/png'),ratio:w/h}:null)}catch{resolve(null)}finally{URL.revokeObjectURL(url)}};img.onerror=()=>{URL.revokeObjectURL(url);resolve(null)};img.src=url;
    }catch{resolve(null)}
  })}
  async function imageFor(item){let data=item.png;if(data){const ratio=await new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img.width/img.height);img.onerror=()=>resolve(1.8);img.src=data});return {data,ratio}}return svgConvert(item.svg)}
  function imageFit(slide,im,x,y,w,h){const ratio=im.ratio||1.7;let dw=w,dh=w/ratio;if(dh>h){dh=h;dw=h*ratio}slide.addImage({data:im.data,x:x+(w-dw)/2,y:y+(h-dh)/2,w:dw,h:dh})}
  function drawText(slide,pptx,statement,accent){
    if(!statement)return false;
    contentPanel(slide,pptx);
    fill(slide,pptx,1.06,3.02,11.18,3.20,WHITE,.14,'DFE8F1');
    fill(slide,pptx,1.06,3.02,.075,3.20,accent,.01);
    const match=statement.match(/(?:[+-]?\d+(?:[,.]\d+)?\s*%|[+-]?\d+(?:[,.]\d+)?\s*p\.p\.|\d+\s*→\s*\d+)/);
    if(match&&statement.length<210){
      txt(slide,match[0],1.43,3.44,10.32,.87,35,{bold:true,color:accent});
      txt(slide,short(statement.replace(match[0],' ').trim(),205),1.43,4.55,10.32,1.24,18,{color:TEXT,valign:'top'});
    } else txt(slide,short(statement,310),1.43,3.75,10.3,1.86,statement.length>180?18:24,{color:TEXT,bold:statement.length<145,valign:'mid'});
    return true;
  }
  function dedupe(items){const seen=new Set(),out=[];
 for(const item of items){if(!item||!item.title)continue;
  const signature=item.selectionKey||JSON.stringify([item.title,item.view,item.unit,item.period,item.settings?.params||{},clean(item.text).slice(0,500),String(item.png||'').slice(0,48)]);
  if(seen.has(signature))continue;seen.add(signature);out.push(item);
 }return out}

  function groupInsightSlides(items){const grouped=[];
    for(let i=0;i<items.length;i++){
      const item=items[i],t=clean(item.text);
      if(item.view==='jobs'&&item.title==='Analiza zawodów'&&t.length<260){
        const peers=[item];while(i+1<items.length&&items[i+1].view==='jobs'&&items[i+1].title==='Analiza zawodów'&&clean(items[i+1].text).length<260){peers.push(items[++i]);}
        if(peers.length>=2){grouped.push({view:'jobs',title:'Najważniejsze sygnały z analizy zawodów',unit:item.unit,period:item.period,structured:{signals:peers.map(p=>({label:(/Brak grup nadwyżkowych/i.test(p.text)?'Brak nadwyżek':/Bezrobocie powyżej/i.test(p.text)?'Bezrobocie na tle województwa':/Deficyt spadł/i.test(p.text)?'Zmiana liczby deficytów':/grup w równowadze/i.test(p.text)?'Udział grup w równowadze':'Wniosek'),detail:short(p.text,220)}))},text:peers.map(p=>clean(p.text)).join(' · '),source:item.source});continue}
      }
      grouped.push(item);
    }return grouped;
  }
  function addOccupationListSlides(pptx,item,firstIndex){
    const o=item.structured.occupationList,rows=o.rows||[],perPage=20,pages=Math.max(1,Math.ceil(rows.length/perPage));
    const accent=o.status==='D'?'C14C64':o.status==='R'?'2A9075':o.status==='N'?'4C74B5':'708397';
    for(let page=0;page<pages;page++){
      const slide=pptx.addSlide();
      drawHeader(slide,pptx,'Zawody — '+o.label+' · '+(page+1)+'/'+pages,
        o.regional?'ŚLĄSKIE · LICZBA JEDNOSTEK Z DANYM WSKAZANIEM':item.unit.toUpperCase()+' · BAROMETR 2027',
        'jobs',firstIndex+page,'Barometr Zawodów 2027');
      contentPanel(slide,pptx);
      const start=page*perPage,part=rows.slice(start,start+perPage);
      txt(slide,`${rows.length} grup zawodów • pozycje ${part.length?start+1:0}–${start+part.length} z ${rows.length}`,1.05,2.96,10.9,.30,11.7,{bold:true,color:accent});
      if(!part.length){txt(slide,'Nie wskazano zawodów w tej kategorii.',1.1,4.15,10.8,.48,18,{color:TEXT});continue}
      for(let i=0;i<part.length;i++){
        const c=Math.floor(i/10),r=i%10,x=c===0?1.06:6.72,y=3.36+r*.294,w=5.46;
        if(r%2===0)fill(slide,pptx,x-.06,y-.02,w+.06,.285,'F0F4FA',.03);
        txt(slide,String(start+i+1).padStart(2,'0'),x,y+.018,.33,.245,9.5,{color:MUTED});
        const label=part[i].name||'',value=o.regional?part[i].count+'/36':'';
        txt(slide,label,x+.39,y,w-(o.regional?1.09:.48),.278,label.length>59?8.3:label.length>39?9.0:9.65,{color:TEXT,breakLine:false,valign:'mid'});
        if(value)txt(slide,value,x+w-.74,y+.009,.65,.245,9.5,{color:accent,bold:true,align:'right'});
      }
      if(o.regional)txt(slide,'Jedna grupa może mieć różny status w różnych powiatach. Liczby oznaczają wystąpienia w 36 jednostkach.',1.04,6.35,11.2,.18,7.8,{color:MUTED});
    }
    return pages;
  }
  // v172: reconcile an economic comparison in the saved basket against
  // the same central GUS record used by the displayed app. In particular,
  // previously saved selections may contain outdated or illustrative values.
  // The editable PPTX worksheet must never silently differ from the dashboard.
  function refreshEconomicFromDashboard(item){
    if(chartId(item)!=='regionalHistoryPanel')return;
    let context;
    try{context=JSON.parse(document.getElementById('aiRegionalGusContext')?.textContent||'{}')}
    catch(e){console.warn('Brak poprawnej bazy GUS do porównania PPTX',e);return}
    const title=String(item.title||'').toLowerCase();
    const hints=[title,String(item.settings?.params?.regionalHistoryMetric||'').toLowerCase()];
    const key=hints.some(x=>x.includes('wynagrodz'))?'wynagrodzenie_brutto':
      hints.some(x=>x.includes('zatrudnien'))?'zatrudnienie_sektor_przedsiebiorstw':null;
    if(!key)return;
    const record=(context.wskazniki||[]).find(x=>x.id===key);
    const current=Number(record?.wartosc),growth=Number(record?.zmiana_rdr?.wartosc);
    if(!Number.isFinite(current)||!Number.isFinite(growth)||growth<=-100){
      console.warn('Brak zweryfikowanej kwoty lub dynamiki w centralnej bazie GUS',key);return;
    }
    const unit=key==='wynagrodzenie_brutto'?'zł brutto':'tys. etatów';
    const heading=key==='wynagrodzenie_brutto'?'Przeciętne miesięczne wynagrodzenie brutto':'Przeciętne zatrudnienie w sektorze przedsiębiorstw';
    const previous=Number((current/(1+growth/100)).toFixed(key==='wynagrodzenie_brutto'?2:1));
    item.structured={...(item.structured||{}),chartData:{kind:'series',
      labels:['Lipiec 2025 (szac.)','Lipiec 2026'],
      series:[{name:heading,values:[previous,current]}],unit}};
    item.title=heading+' - lipiec 2025 / lipiec 2026';
    item.unit='Województwo śląskie';item.period='lipiec 2025 i lipiec 2026';
    item.source='GUS / Urząd Statystyczny w Katowicach - sytuacja społeczno-gospodarcza, lipiec 2026';
    item.exportMeta={...(item.exportMeta||{}),period:item.period,measure:heading,unit,
      note:'Lipiec 2026: wartość GUS zgodna z aplikacją. Lipiec 2025: szacunek na podstawie dynamiki r/r, nie osobna obserwacja GUS.'};
  }
  async function run(basket){
    const selected=groupInsightSlides(dedupe(basket.filter(x=>x.included!==false)));
    selected.forEach(refreshEconomicFromDashboard);
    if(!selected.length){alert('Wybierz przynajmniej jeden panel do prezentacji.');return}
    const Constructor=window.PptxGenJS||window.pptxgen;if(!Constructor){alert('Brak biblioteki PowerPoint.');return}
    const btn=document.getElementById('v111Generate');if(btn){btn.disabled=true;btn.textContent='Tworzenie slajdów…'}
    try{
      await loadBrandImage();
      const pptx=new Constructor();pptx.layout='LAYOUT_WIDE';pptx.author='Obserwatorium Rynku Pracy';pptx.subject='Analizy rynku pracy województwa śląskiego';pptx.title='Obserwatorium - wybrane analizy';pptx.lang='pl-PL';
      drawCover(pptx,selected);let index=1;const skipped=[],rendered=[];
      for(const item of selected){
        if(item.structured?.occupationList){index+=addOccupationListSlides(pptx,item,index+1);rendered.push(item);continue;}
        const meta=presentationMeta(item);
        index++;const slide=pptx.addSlide();
        const caption=[meta.scope,meta.period,meta.unit&&meta.unit!==meta.measure?meta.unit:''].filter(Boolean).join(' · ');
        const accent=drawHeader(slide,pptx,meta.title,caption,item.view,index,meta.source);
        let drawn=false;const struct=item.structured||{};
        const columnTitle=/^uk2026/.test(chartId(item))?(struct.chartData?.unit||meta.unit||'liczba').toUpperCase():(meta.measure?meta.measure.toUpperCase():(item.view==='unemployment'?'LICZBA OSÓB':'LICZBA GRUP ZAWODÓW'));
        const isEconomicPulse=chartId(item)==='regionalPulse'||/Gospodarka województwa śląskiego/i.test(item.title||'');
        if(struct.baelQuarter?.rows?.length)drawn=drawBaelQuarterCards(slide,pptx,struct.baelQuarter.rows,accent);
        if(isEconomicPulse){
          // Some earlier selections predate the structured-metrics fix.
          // Fall back to parsing the saved source snapshot so re-selection is not required.
          const metrics=struct.metrics?.filter(m=>m.label&&m.value).length?struct.metrics:parseSector(item);
          drawn=addMetrics(slide,pptx,metrics,accent);
        }
        if(!drawn&&meta.comparison && struct.chartData?.kind==='bars')drawn=drawComparison(slide,pptx,struct.chartData.rankings||[],meta);
        if(!drawn&&struct.chartData?.kind==='series'){
          const id=chartId(item);
          if(id==='demographyNaturalChartCard')drawn=drawDemographyColumns(slide,pptx,struct.chartData,'natural');
          else if(id==='demographyMigrationChartCard')drawn=drawDemographyColumns(slide,pptx,struct.chartData,'migration');
          else if(id==='regionalHistoryPanel')drawn=drawEconomicComparisonColumns(slide,pptx,struct.chartData);
          if(!drawn)drawn=drawSeries(slide,pptx,struct.chartData,accent);
        }
        if(!drawn&&struct.chartData?.kind==='bars'&&struct.chartData.rankings?.length)drawn=addRank(slide,pptx,struct.chartData.rankings,accent,columnTitle);
        if(!drawn&&struct.map){const im=await imageFor(item);if(im){contentPanel(slide,pptx);imageFit(slide,im,.97,2.93,11.35,3.16);
             txt(slide,short(struct.map.legend||meta.title,110),1.13,6.21,10.9,.22,10.7,{bold:true,color:accent});drawn=true;}}
        if(!drawn&&struct.chart?.kind==='svg'){
          const im=await imageFor(item);
          if(im){contentPanel(slide,pptx);imageFit(slide,im,1.05,2.94,11.17,3.38);drawn=true;}
        }
        const ranking=drawn?[]:(struct.rankings&&struct.rankings.length?struct.rankings:(legacyCategoryRows(item).length?legacyCategoryRows(item):((item.view==='rankings')?parseRank(item):parseAge(item))));
        if(!drawn&&ranking.length>=1)drawn=meta.comparison?drawComparison(slide,pptx,ranking,meta):addRank(slide,pptx,ranking,accent,columnTitle);
        if(!drawn){
          const metrics=struct.metrics?.length?struct.metrics:(/Gospodarka województwa/i.test(item.title||'')?parseSector(item):(/punkt odniesienia/i.test(item.title||'')?parseBenchmark(item):parseOccupationStructure(item)));
          if(metrics?.length>=1)drawn=addMetrics(slide,pptx,metrics,accent);
        }
        if(!drawn&&String(item.selectionKey||'').startsWith('map-commentary-v179:'))drawn=drawMapCommentary(slide,pptx,item,accent);
        if(!drawn&&struct.signals?.length>=1)drawn=addStatements(slide,pptx,struct.signals,accent);
        if(!drawn){const image=await imageFor(item);
          if(image){contentPanel(slide,pptx);imageFit(slide,image,.97,2.91,11.35,item.structured?.map?3.18:3.34);
            if(item.structured?.map)txt(slide,short(item.structured.map.legend||item.title,115),1.12,6.18,10.9,.25,10.8,{bold:true,color:accent});drawn=true}
        }
        if(!drawn&&item.view==='jobs'&&/Analiza zawodów/i.test(item.title||'')){
           const narrative=usefulNarrative(item);if(narrative)drawn=drawText(slide,pptx,narrative,accent);
        }
        if(drawn && meta.note)txt(slide,short(meta.note,170),1.08,6.46,11.05,.16,8.2,{color:'AE4F33'});
        if(!drawn){
          // Never output empty slides: remove the just-created slide and disclose the missing source.
          pptx._slides.pop();index--;skipped.push(meta.title);
        }else rendered.push(item);
      }
      if(!rendered.length){alert('Nie utworzono prezentacji: wybrane analizy nie mają zapisanych danych wykresów. Odznacz je i wybierz ponownie aktualne wykresy.');return;}
      const cover=pptx._slides[0];
      const summary=cover?._slideObjects?.find(o=>o._type==='text'&&o.text?.some(t=>/wybranych analiz/i.test(t.text||'')));
      if(summary?.text?.length){
        summary.text[0].text=countAnalyses(rendered.length);
      }
      await pptx.writeFile({fileName:'Obserwatorium_wybrane_analizy_WUP_firmowka.pptx'});
      if(skipped.length)alert('Pominięto '+skipped.length+' '+(skipped.length===1?'element':skipped.length<5?'elementy':'elementów')+' bez danych niezbędnych do wygenerowania slajdu:\n• '+skipped.slice(0,16).join('\n• ')+ (skipped.length>16?'\n…':'')+'\nZaznacz je ponownie przy widocznym wykresie.');
    }catch(e){console.error('PPTX v118',e);alert('Generowanie prezentacji nie powiodło się: '+(e?.message||e))}
    finally{if(btn){btn.disabled=false;btn.textContent='Generuj PPTX'}}
  }
  window.OBS_DECK_V142_METADATA={presentationMeta,comparisonMeta};
  window.OBS_DECK_V118=run;
  window.OBS_DECK_V117=run;
})();
