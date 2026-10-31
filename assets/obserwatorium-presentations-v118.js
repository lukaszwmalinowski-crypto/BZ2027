/* Obserwatorium v122: generator odporny na puste wykresy, z danymi liczbowymi.
   Nie wpływa na pozostałe eksporty (PDF / klasyczna prezentacja powiatowa). */
(() => {
  'use strict';
  const PALETTE={
    map:'3469AF',jobs:'C14C64',trends:'2A9075',rankings:'C14C64',
    unemployment:'B96B2B',gus:'7964BD'
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
  function clean(s){return String(s||'').replace(/(?:Do prezentacji|Wybrane ✓|Dodano ✓|Dodaj|Kliknij kategorię, aby zobaczyć jej historię|Wybierz powiat lub miasto na prawach powiatu)/gi,' ').replace(/\s+/g,' ').trim()}
  function short(s,n=120){const v=clean(s);return v.length>n?v.slice(0,n-1).replace(/\s+\S*$/,'')+'…':v}
  function number(s){const n=Number(String(s).replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?n:null}
  function fill(slide,pptx,x,y,w,h,color,rad=.14,stroke=null){slide.addShape(pptx.ShapeType.roundRect,{x,y,w,h,rectRadius:rad,radius:rad,fill:{color},line:{color:stroke||color,width:stroke?0.7:0},adjustPoint:0.11})}
  function txt(slide,s,x,y,w,h,size=16,opt={}){slide.addText(clean(s),{x,y,w,h,fontFace:'Aptos',fontSize:size,color:TEXT,margin:0,breakLine:false,valign:'mid',...opt})}
  function shade(hex,a=0.1){const b=hex.match(/../g).map(x=>parseInt(x,16)),k=1-a;return b.map(x=>Math.round(x*a+255*k).toString(16).padStart(2,'0')).join('').toUpperCase()}
  function drawHeader(slide,pptx,title,unit,section,i,source){
    background(slide,pptx);
    const accent=PALETTE[section]||'3469AF';
    const headerTitle=section==='gus'?'SYTUACJA GOSPODARCZA':section==='unemployment'?'BEZROBOCIE':'BAROMETR ZAWODÓW 2027';
    fill(slide,pptx,LAYOUT.left,LAYOUT.overline,.07,.27,accent,.01);
    txt(slide,headerTitle,LAYOUT.left+.17,LAYOUT.overline-.01,10.8,.30,10.4,{bold:true,color:accent,charSpacing:1.5});
    const t=short(title,115);
    txt(slide,t,LAYOUT.left,LAYOUT.title,11.8,.49,t.length>74?21.5:t.length>55?24:27.5,
      {bold:true,color:NAVY,breakLine:false});
    txt(slide,short(unit,135),LAYOUT.left+.01,LAYOUT.subtitle,11.7,.26,12.5,{color:MUTED});
    slide.addShape(pptx.ShapeType.line,{x:LAYOUT.left,y:LAYOUT.divider,w:11.84,h:0,line:{color:'DCE7F2',width:1}});
    // Source/page label placed ABOVE the source letterhead's printed bottom border.
    txt(slide,short('Źródło danych: '+(source||'Obserwatorium Rynku Pracy'),114),LAYOUT.left+.04,LAYOUT.sourceY,10.8,.23,8.5,{color:MUTED});
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
  function addRank(slide,pptx,rows,accent,heading='LICZBA WSKAZAŃ'){
    const r=rows.filter(z=>z.label&&Number.isFinite(Number(z.value))).slice(0,10),max=Math.max(1,...r.map(z=>z.value));
    if(!r.length)return false;
    contentPanel(slide,pptx);
    const long=r.some(v=>v.label.length>36),left=long?5.19:4.52;
    txt(slide,heading,left,2.98,3,.21,9.3,{color:MUTED,bold:true});
    const barX=left,barW=12.23-left;
    r.forEach((z,i)=>{
      const y=3.31+i*.293;
      txt(slide,short(z.label,long?58:48),.97,y+.006,left-1.13,.25,10.1,{color:TEXT});
      fill(slide,pptx,barX,y+.06,barW-.62,.12,'E9EFF5',.045);
      if(z.value>0)fill(slide,pptx,barX,y+.06,(barW-.62)*z.value/max,.12,accent,.045);
      txt(slide,Number(z.value).toLocaleString('pl-PL',{maximumFractionDigits:2}),11.84,y+.003,.45,.24,10.7,{color:NAVY,bold:true,align:'right'});
    });
    return true;
  }
  function addMetrics(slide,pptx,metrics,accent){
    const list=metrics.filter(m=>m.label&&m.value).slice(0,8);
    if(!list.length)return false;
    contentPanel(slide,pptx);
    const cols=list.length<=2?2:(list.length===4?2:(list.length<=6?3:4));
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
  // v122: editable PowerPoint charts generated from stored numeric values,
  // rather than relying on screenshot conversion of browser-only SVG content.
  function drawSeries(slide,pptx,chart,accent){
    const labels=chart?.labels||[],series=(chart?.series||[]).filter(s=>s.values?.some(v=>Number.isFinite(v)));
    if(labels.length<2||!series.length)return false;
    contentPanel(slide,pptx);
    const plot={x:1.68,y:3.26,w:9.76,h:2.32};
    const all=series.flatMap(s=>s.values).filter(v=>Number.isFinite(v));
    if(!all.length)return false;
    let min=Math.min(...all),max=Math.max(...all);const pad=Math.max((max-min)*.13,Math.max(Math.abs(max),1)*.012);
    min=min-pad;max=max+pad;
    if(min>0&&min/max<.33)min=0;
    const vy=n=>plot.y+plot.h*(max-n)/(max-min||1);
    const vx=i=>plot.x+i*plot.w/(labels.length-1);
    const fmt=n=>Number(n).toLocaleString('pl-PL',{maximumFractionDigits:Number.isInteger(n)?0:2});
    for(let i=0;i<=4;i++){
      const v=min+(max-min)*i/4,y=vy(v);
      slide.addShape(pptx.ShapeType.line,{x:plot.x,y,w:plot.w,h:0,line:{color:'E4EBF2',width:.85}});
      txt(slide,fmt(v),.95,y-.11,.62,.24,8.5,{align:'right',color:MUTED});
    }
    const tick=Math.max(1,Math.ceil(labels.length/8));
    labels.forEach((label,i)=>{if(i%tick!==0&&i!==labels.length-1)return;
      txt(slide,short(label,16),Math.max(.91,vx(i)-.34),5.72,.76,.22,8.7,{align:'center',color:MUTED});
    });
    const colors=[accent,'869EBF','2A9075','CA904B'];
    series.slice(0,4).forEach((ser,idx)=>{
      const c=colors[idx];let previous=null;
      ser.values.forEach((value,i)=>{
        if(!Number.isFinite(value)){previous=null;return}
        const x=vx(i),y=vy(value);
        if(previous)slide.addShape(pptx.ShapeType.line,{x:previous.x,y:previous.y,w:x-previous.x,h:y-previous.y,line:{color:c,width:2.2}});
        if(labels.length<=16||i===labels.length-1||i===0)slide.addShape(pptx.ShapeType.ellipse,{x:x-.039,y:y-.039,w:.078,h:.078,line:{color:c,width:0},fill:{color:c}});
        previous={x,y};
      });
      const legendX=1.23+idx*2.76;
      fill(slide,pptx,legendX,6.15,.13,.12,c,.01);
      txt(slide,short(ser.name||'Seria',34),legendX+.19,6.095,2.52,.23,10,{color:TEXT});
    });
    return true;
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
      const part=t.slice(start+label.length,end),match=part.match(/(?:-?\d[\d\s]*(?:[,.]\d+)?\s*(?:tys\.|mld\s*zł|zł|etatów|osób|%))/i);
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
    const u=clean(item.unit);return (u==='Województwo śląskie - średnie'?'WOJEWÓDZTWO ŚLĄSKIE':u.toUpperCase())+' · '+short(item.period||'dane z Obserwatorium',36);
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
    txt(slide,'OBSERWATORIUM RYNKU PRACY 2027',1.20,2.11,10.48,.39,13,{color:'2F6FB0',bold:true,charSpacing:1.4});
    txt(slide,'Wybrane analizy\nrynku pracy',1.18,2.68,10.7,1.24,36,{color:NAVY,bold:true,breakLine:false,valign:'top'});
    const scopes=[...new Set(items.map(x=>scope(x)))];
    const units=[...new Set(items.map(x=>clean(x.unit)).filter(Boolean))];
    const description=units.length===1?'Zakres: '+short(units[0],95):units.length<=3?'Zakres: '+short(units.join(' · '),105):'Zestawienie obejmuje kilka jednostek terytorialnych';
    txt(slide,description,1.2,4.29,10.5,.61,16,{color:TEXT,breakLine:false});
    slide.addShape(pptx.ShapeType.line,{x:1.2,y:5.27,w:10.79,h:0,line:{color:'D7E4F1',width:1}});
    txt(slide,`${items.length} wybranych analiz`,1.20,5.55,5.3,.40,16,{color:NAVY,bold:true});
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
  async function run(basket){
    const selected=groupInsightSlides(dedupe(basket.filter(x=>x.included!==false)));
    if(!selected.length){alert('Wybierz przynajmniej jeden panel do prezentacji.');return}
    const Constructor=window.PptxGenJS||window.pptxgen;if(!Constructor){alert('Brak biblioteki PowerPoint.');return}
    const btn=document.getElementById('v111Generate');if(btn){btn.disabled=true;btn.textContent='Tworzenie slajdów…'}
    try{
      await loadBrandImage();
      const pptx=new Constructor();pptx.layout='LAYOUT_WIDE';pptx.author='Obserwatorium Rynku Pracy';pptx.subject='Analizy rynku pracy województwa śląskiego';pptx.title='Obserwatorium - wybrane analizy';pptx.lang='pl-PL';
      drawCover(pptx,selected);let index=1;const skipped=[],rendered=[];
      for(const item of selected){
        if(item.structured?.occupationList){index+=addOccupationListSlides(pptx,item,index+1);rendered.push(item);continue;}
        index++;const slide=pptx.addSlide(),name=normalizeTitle(item),accent=drawHeader(slide,pptx,name,scope(item),item.view,index, /Zobacz źródła/i.test(item.source||'')?(item.view==='gus'?'GUS / BDL':item.view==='unemployment'?'Zestawienia PUP':'Barometr Zawodów 2027'):(item.source||'Obserwatorium'));
        let drawn=false;const struct=item.structured||{};
        const columnTitle=item.view==='unemployment'?(item.settings?.params?.pupUnit==='share'?'UDZIAŁ PROCENTOWY':'LICZBA OSÓB'):
          /porównaj powiaty/i.test(name)?(item.settings?.params?.compareChartMetric==='unemp'?'STOPA BEZROBOCIA (%)':'WARTOŚĆ WSKAŹNIKA'):'LICZBA WSKAZAŃ';
        if(struct.chartData?.kind==='series')drawn=drawSeries(slide,pptx,struct.chartData,accent);
        if(!drawn&&struct.chartData?.kind==='bars'&&struct.chartData.rankings?.length)drawn=addRank(slide,pptx,struct.chartData.rankings,accent,columnTitle);
        if(!drawn&&struct.map){const im=await imageFor(item);if(im){contentPanel(slide,pptx);imageFit(slide,im,.97,2.93,11.35,3.16);
             txt(slide,short(struct.map.legend||name,110),1.13,6.21,10.9,.22,10.7,{bold:true,color:accent});drawn=true;}}
        if(!drawn&&struct.chart?.kind==='svg'){
          const im=await imageFor(item);
          if(im){contentPanel(slide,pptx);imageFit(slide,im,1.05,2.94,11.17,3.38);drawn=true;}
        }
        const ranking=drawn?[]:(struct.rankings&&struct.rankings.length?struct.rankings:(legacyCategoryRows(item).length?legacyCategoryRows(item):((item.view==='rankings')?parseRank(item):parseAge(item))));
        if(!drawn&&ranking.length>=3)drawn=addRank(slide,pptx,ranking,accent,columnTitle);
        if(!drawn){
          const metrics=struct.metrics?.length?struct.metrics:(/Gospodarka województwa/i.test(name)?parseSector(item):(/punkt odniesienia/i.test(name)?parseBenchmark(item):parseOccupationStructure(item)));
          if(metrics?.length>=2)drawn=addMetrics(slide,pptx,metrics,accent);
        }
        if(!drawn&&struct.signals?.length>=2)drawn=addStatements(slide,pptx,struct.signals,accent);
        if(!drawn){const image=await imageFor(item);
          if(image){contentPanel(slide,pptx);imageFit(slide,image,.97,2.91,11.35,item.structured?.map?3.18:3.34);
            if(item.structured?.map)txt(slide,short(item.structured.map.legend||item.title,115),1.12,6.18,10.9,.25,10.8,{bold:true,color:accent});drawn=true}
        }
        if(!drawn&&item.view==='jobs'&&/Analiza zawodów/i.test(item.title||'')){
           const narrative=usefulNarrative(item);if(narrative)drawn=drawText(slide,pptx,narrative,accent);
        }
        if(!drawn){
          // Never output empty slides: remove the just-created slide and disclose the missing source.
          pptx._slides.pop();index--;skipped.push(name);
        }else rendered.push(item);
      }
      if(!rendered.length){alert('Nie utworzono prezentacji: wybrane analizy nie mają zapisanych danych wykresów. Odznacz je i wybierz ponownie aktualne wykresy.');return;}
      const cover=pptx._slides[0];
      const summary=cover?._slideObjects?.find(o=>o._type==='text'&&o.text?.some(t=>/wybranych analiz/i.test(t.text||'')));
      if(summary?.text?.length){
        const gen=rendered.length===1?'wygenerowana analiza':rendered.length<5?'wygenerowane analizy':'wygenerowanych analiz';
        const skip=skipped.length===1?'pominięta':skipped.length<5?'pominięte':'pominiętych';
        summary.text[0].text=`${rendered.length} ${gen}`+(skipped.length?` · ${skipped.length} ${skip}`:``);
      }
      await pptx.writeFile({fileName:'Obserwatorium_wybrane_analizy_WUP_firmowka.pptx'});
      if(skipped.length)alert('Pominięto '+skipped.length+' '+(skipped.length===1?'element':skipped.length<5?'elementy':'elementów')+' bez danych niezbędnych do wygenerowania slajdu:\n• '+skipped.slice(0,16).join('\n• ')+ (skipped.length>16?'\n…':'')+'\nZaznacz je ponownie przy widocznym wykresie.');
    }catch(e){console.error('PPTX v118',e);alert('Generowanie prezentacji nie powiodło się: '+(e?.message||e))}
    finally{if(btn){btn.disabled=false;btn.textContent='Generuj PPTX'}}
  }
  window.OBS_DECK_V118=run;
  window.OBS_DECK_V117=run;
})();
