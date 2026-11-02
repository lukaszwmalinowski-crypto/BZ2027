/* Obserwatorium · Rynek Pracy · 2027 v143 — raport DOCX w stylu redakcyjnym.
   Wykorzystuje te same, zapisane wybory co generator PowerPoint.
   Wykresy są tworzone wyłącznie z zachowanych wartości, nie z tekstu interfejsu. */
(()=>{'use strict';
const JSZIP=window.JSZip;
const FONT='Georgia',NAVY='20242B',BLUE='305F8B',SOFT='F6F8FB',GRAY='4F5965',WHITE='FFFFFF';
const ACCENTS={map:'B44860',jobs:'B44860',trends:'B44860',rankings:'B44860',unemployment:'B77530',gus:'745FB1'};
const BRAND_IMG='';
const W=9480;let imgs=[],mediaId=0,skipped=[];
const esc=s=>String(s??'').replace(/[\u2013\u2014]/g,'-').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
// Normalize typography only when writing the output file.
const exportText=s=>String(s??'').replace(/[\u2013\u2014]/g,'-')
 .replace(/(?:według aktualnego widoku|Kliknij kategorię, aby zobaczyć jej historię|Kliknij powiat, by sprawdzić jego profil|Dodaj ten wykres|Dodaj tę mapę|Do prezentacji|Wybrane\s*✓|Dodano\s*✓)/gi,' ')
 .replace(/(?:Zobacz źródła i metodologię w Obserwatorium|Wybierz powiat lub miasto na prawach powiatu|Wybierz zawód z listy)/gi,' ')
 .replace(/\s+/g,' ').trim();
const safe=s=>exportText(s);
const publicSource=(source,view)=>{const value=safe(source||'').replace(/^Źródło(?:\s+danych)?\s*:\s*/i,'');
 if(!value||/^(?:zobacz|źródła i metodologia|obserwatorium rynku pracy|obserwatorium)$/i.test(value))
   return view==='gus'?'GUS / Bank Danych Lokalnych':view==='unemployment'?'WUP w Katowicach / GUS':'Barometr Zawodów';
 return value;
};
// v143: Word uses the same captured indicator/period/scope/source as PowerPoint v142.
function wordMeta(item){
 try{const meta=window.OBS_DECK_V142_METADATA?.presentationMeta?.(item);
  if(meta){if(!meta.comparison&&item.exportMeta?.measure)meta.measure=safe(item.exportMeta.measure);return meta;}}
 catch(e){console.warn('[DOCX] Metadane slajdu niedostępne',e)}
 return {title:safe(item.title||'Analiza rynku pracy'),scope:safe(item.unit),
   period:safe(item.exportMeta?.period||item.period),unit:safe(item.exportMeta?.unit),
   measure:safe(item.exportMeta?.measure||''),source:publicSource(item.exportMeta?.source||item.source,item.view),
   comparison:false};
}
function formatMeasure(value,meta){
 const n=toNum(value);if(n===null)return '-';
 return (meta?.unit==='%'?n.toLocaleString('pl-PL',{minimumFractionDigits:1,maximumFractionDigits:1}):num(n))+(meta?.unit==='%'?'%':'');
}
function indicatorLabel(meta){
 const label=safe(meta?.measure||meta?.title||'Wartość');
 return label+(meta?.unit==='%'&&!label.includes('%')?' (%)':meta?.unit&&meta.unit!=='%'&&!label.includes(meta.unit)?' ('+meta.unit+')':'');
}
const hex=c=>String(c||NAVY).replace(/^#/,'').toUpperCase();
const run=(s,{bold=false,color=NAVY,size=21,italic=false}={})=>`<w:r><w:rPr><w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}" w:eastAsia="${FONT}"/><w:color w:val="${hex(color)}"/><w:sz w:val="${size}"/>${bold?'<w:b/>':''}${italic?'<w:i/>':''}</w:rPr><w:t xml:space="preserve">${esc(s)}</w:t></w:r>`;
function p(s='',o={}){const {style='',align='left',before=0,after=90,keep=false,pageBreak=false,shading='',border='',color=NAVY,size=21,bold=false,italic=false}=o;
 const pp=`<w:pPr>${style?`<w:pStyle w:val="${style}"/>`:''}<w:jc w:val="${align}"/><w:spacing w:before="${before}" w:after="${after}" w:line="270" w:lineRule="auto"/>${keep?'<w:keepNext/>':''}${pageBreak?'<w:pageBreakBefore/>':''}${shading?`<w:shd w:fill="${hex(shading)}"/>`:''}${border?`<w:pBdr><w:bottom w:val="single" w:sz="5" w:space="7" w:color="${hex(border)}"/></w:pBdr>`:''}</w:pPr>`;
 return `<w:p>${pp}${run(s,{bold,color,size,italic})}</w:p>`;
}
const cell=(content,{width=1800,head=false,shade='',align='left',value=false}={})=>`<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="center"/>${shade?`<w:shd w:fill="${hex(shade)}"/>`:''}</w:tcPr>${p(content,{align,color:head?NAVY:value?BLUE:NAVY,size:head?19:19,bold:head||value,after:25,before:25})}</w:tc>`;
function table(headers,rows,weights){const cols=headers.length;const sizes=(weights?.length===cols?weights:Array(cols).fill(1));const all=sizes.reduce((a,b)=>a+b,0);const widths=sizes.map(n=>Math.round(W*n/all));
 const grid=widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('');
 const make=(row,idx,head=false)=>`<w:tr>${head?'<w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>':'<w:trPr><w:cantSplit/></w:trPr>'}${Array.from({length:cols},(_,i)=>cell(row[i]??'',{width:widths[i],head,value:i>0&&/^\s*[+\-]?[0-9]/.test(String(row[i]??''))})).join('')}</w:tr>`;
 return `<w:tbl><w:tblPr><w:tblW w:type="dxa" w:w="${W}"/><w:tblInd w:w="0" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="9" w:color="31363D"/><w:bottom w:val="single" w:sz="5" w:color="B9C2CC"/><w:insideH w:val="single" w:sz="4" w:color="DDE2E7"/></w:tblBorders><w:tblCellMar><w:top w:w="83" w:type="dxa"/><w:left w:w="135" w:type="dxa"/><w:bottom w:w="83" w:type="dxa"/><w:right w:w="135" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${make(headers,0,true)}${rows.map((row,i)=>make(row,i)).join('')}</w:tbl>`;
}
const num=x=>Number.isFinite(x)?new Intl.NumberFormat('pl-PL',{maximumFractionDigits:Number.isInteger(x)?0:2}).format(x):'-';
function toNum(v){if(typeof v==='number')return Number.isFinite(v)?v:null;if(v===null||v===undefined||String(v).trim()==='')return null;const n=Number(String(v).replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?n:null;}
function comparisonImage(rows,meta){
 const points=rows.filter(r=>safe(r.label)&&toNum(r.value)!==null).slice(0,8);
 if(points.length<2)return null;
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=825;
 const c=canvas.getContext('2d');if(!c)return null;
 const CW=canvas.width,CH=canvas.height;
 c.fillStyle='#F8FAFE';c.fillRect(0,0,CW,CH);
 const left=115,right=60,top=135,bottom=170,W=CW-left-right,H=CH-top-bottom;
 const max=Math.max(0,...points.map(r=>toNum(r.value))),axisMax=meta.unit==='%'?Math.max(1,Math.ceil(max*1.08*2)/2):Math.max(1,Math.ceil(max*1.08/4)*4);
 const scale=v=>H*Math.max(0,v)/axisMax;
 c.font='bold 31px Arial';c.fillStyle='#466180';c.textAlign='left';
 c.fillText(indicatorLabel(meta),left,52);
 if(meta.period){c.font='24px Arial';c.fillStyle='#607790';c.fillText(safe(meta.period).slice(0,100),left,90);}
 c.lineWidth=2;c.setLineDash([9,8]);c.font='24px Arial';c.textBaseline='middle';
 for(let k=0;k<=4;k++){
  const y=top+H-k*H/4,val=axisMax*k/4;
  c.strokeStyle='#DCE6F1';c.beginPath();c.moveTo(left,y);c.lineTo(CW-right,y);c.stroke();
  c.textAlign='right';c.fillStyle='#566D88';
  const f=meta.unit==='%'?val.toFixed(1).replace('.',',')+'%':num(Number(val.toFixed(1)));
  c.fillText(f,left-19,y);
 }
 c.setLineDash([]);
 const colors=['#3469AF','#209687','#B65C86','#BF873C','#7964C6','#377D9B','#5D98A5','#6E77AE'];
 const step=W/points.length,barWidth=Math.min(205,step*.76);
 points.forEach((r,i)=>{
  const v=toNum(r.value),x=left+step*i+step/2,h=scale(v),y=top+H-h;
  c.fillStyle=colors[i%colors.length];
  c.beginPath();const radius=Math.min(19,h/2,barWidth/3);c.roundRect(x-barWidth/2,y,barWidth,h,[radius,radius,0,0]);c.fill();
  c.textAlign='center';c.fillStyle='#1C3B5B';c.font='bold 31px Arial';
  c.fillText(formatMeasure(v,meta),x,Math.max(top+17,y-29));
  const label=safe(r.label).replace(/^powiat\s+/i,'');
  c.font='bold '+(label.length>23?22:label.length>17?24:27)+'px Arial';c.fillStyle='#344B64';
  const lines=label.length>20 && label.includes(' ') ? [label.slice(0,label.lastIndexOf(' ',20)),label.slice(label.lastIndexOf(' ',20)+1)]:[label];
  lines.forEach((line,j)=>c.fillText(line,x,top+H+45+j*25,step-10));
 });
 c.fillStyle='#62748B';c.font='22px Arial';c.textAlign='left';
 c.fillText('Porównanie wspólnego wskaźnika dla wybranych jednostek',left,CH-25);
 return canvas.toDataURL('image/png');
}
function chartImage(data,meta={}){
 const labels=(data?.labels||[]).map(safe),series=(data?.series||[]).map(s=>({...s,values:labels.map((_,i)=>toNum(s.values?.[i]))})).filter(s=>s.values.some(Number.isFinite));
 if(!labels.length||!series.length)return null;
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=720;const c=canvas.getContext('2d');if(!c)return null;
 const CW=canvas.width,CH=canvas.height;c.fillStyle='#FFFFFF';c.fillRect(0,0,CW,CH);
 const left=145,right=140,top=78,bottom=130,ww=CW-left-right,hh=CH-top-bottom;
 const vals=series.flatMap(s=>s.values).filter(Number.isFinite),min=Math.min(...vals),max=Math.max(...vals);if(!vals.length)return null;
 const range=Math.max(max-min,Math.abs(max)*.05,1);let ymin=Math.max(0,min-range*.15),ymax=max+range*.18;
 if(vals.every(Number.isInteger)&&min>=0&&max<100000000){
  // Four round tick intervals even for large REGON/registered-person counts.
  // The plotted numbers stay unrounded; only the axis ticks use a nice step.
  const target=Math.max(1,(max-min)*1.3/4),scale=10**Math.floor(Math.log10(target));
  const steps=[1,2,2.5,5,10,20,25,50,100].map(n=>n*scale);
  for(const st of steps){const lo=Math.max(0,Math.floor((min-.1*st)/st)*st),hi=lo+4*st;
   if(hi>=max+.1*st){ymin=lo;ymax=hi;break;}
  }
 }
 const xAt=i=>left+(labels.length===1?0.5:i/Math.max(1,labels.length-1))*ww,yAt=v=>top+(ymax-v)/Math.max(1,ymax-ymin)*hh;
 c.lineWidth=1;c.font='27px Arial';c.textBaseline='middle';
 for(let k=0;k<=4;k++){const y=top+k*hh/4;c.strokeStyle='#E5EDF5';c.beginPath();c.moveTo(left,y);c.lineTo(left+ww,y);c.stroke();c.fillStyle='#66788A';c.textAlign='right';c.fillText(formatMeasure(ymax-(ymax-ymin)*k/4,meta),left-19,y)}
 const every=Math.max(1,Math.ceil(labels.length/9));c.fillStyle='#52667C';c.textAlign='center';c.font='24px Arial';labels.forEach((lab,i)=>{if(i%every&&i!==labels.length-1)return;const x=xAt(i);c.fillText(lab.length>17?lab.slice(0,16)+'…':lab,x,top+hh+37)});
 const colors=['#2768A3','#BA4F65','#2B917A','#C18B36'];
 series.slice(0,4).forEach((s,si)=>{const color=colors[si];
 if(series.length===1&&s.values.every(Number.isFinite)&&s.values.length>1){c.save();c.beginPath();s.values.forEach((v,i)=>{if(i===0)c.moveTo(xAt(i),yAt(v));else c.lineTo(xAt(i),yAt(v))});c.lineTo(xAt(s.values.length-1),top+hh);c.lineTo(xAt(0),top+hh);c.closePath();c.fillStyle='rgba(49,96,144,.12)';c.fill();c.restore();}
 c.lineWidth=4;c.strokeStyle=color;c.lineJoin='round';c.lineCap='round';c.beginPath();let prev=false;
 s.values.forEach((v,i)=>{if(!Number.isFinite(v)){prev=false;return}const x=xAt(i),y=yAt(v);if(prev)c.lineTo(x,y);else c.moveTo(x,y);prev=true});c.stroke();
 s.values.forEach((v,i)=>{if(!Number.isFinite(v))return;const x=xAt(i),y=yAt(v);c.fillStyle='#FFFFFF';c.strokeStyle=color;c.lineWidth=3;c.beginPath();c.arc(x,y,5.5,0,2*Math.PI);c.fill();c.stroke()});
 const valid=s.values.map((v,i)=>({v,i})).filter(x=>Number.isFinite(x.v));const last=valid.at(-1);if(last){const x=xAt(last.i),y=yAt(last.v);c.fillStyle=color;c.font='bold 29px Arial';c.textAlign=last.i===labels.length-1?'left':'center';c.fillText(formatMeasure(last.v,meta),Math.min(CW-78,x+13),Math.max(28,y-18))}
 });
 c.font='26px Arial';c.textAlign='left';series.slice(0,4).forEach((s,i)=>{const x=left+i*(ww/Math.min(4,series.length));c.fillStyle=colors[i];c.fillRect(x,CH-57,24,5);c.fillStyle='#334F6A';c.fillText(safe(s.name||'Wartość').slice(0,25),x+34,CH-54)});
 return canvas.toDataURL('image/png');
}
function barImage(rows,meta={}){const points=rows.filter(r=>safe(r.label)&&Number.isFinite(toNum(r.value))).slice(0,12);if(!points.length)return null;
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=Math.max(470,points.length*64+85);const c=canvas.getContext('2d');c.fillStyle='#FFFFFF';c.fillRect(0,0,canvas.width,canvas.height);
 const x=540,w=830,m=Math.max(...points.map(x=>toNum(x.value)),1);c.font='18px Arial';
 points.forEach((r,i)=>{const y=54+i*64,v=toNum(r.value);c.textAlign='right';c.fillStyle='#304B66';const label=safe(r.label);c.fillText(label.length>42?label.slice(0,40)+'…':label,x-24,y+14);c.fillStyle='#EDF2F8';c.fillRect(x,y,Math.max(1,w),21);c.fillStyle='#356FA7';c.fillRect(x,y,Math.max(0,w*Math.max(0,v)/m),21);c.textAlign='left';c.fillStyle='#244C73';c.font='bold 20px Arial';c.fillText(formatMeasure(v,meta),x+w+15,y+13);c.font='18px Arial';});return canvas.toDataURL('image/png');
}
function imagePng(src){return new Promise(resolve=>{if(!src)return resolve(null);try{const img=new Image();img.onload=()=>{try{const maxWidth=1580,ratio=img.naturalHeight/Math.max(1,img.naturalWidth),w=maxWidth,h=Math.max(100,Math.round(w*ratio));if(h>1800)return resolve(null);const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.fillStyle=WHITE;ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);resolve(canvas.toDataURL('image/png'))}catch{resolve(null)}};img.onerror=()=>resolve(null);
 if(src.startsWith('<svg')){const doc=new DOMParser().parseFromString(src,'image/svg+xml');const root=doc.documentElement;root.setAttribute('xmlns','http://www.w3.org/2000/svg');if(!root.getAttribute('viewBox')){root.setAttribute('viewBox','0 0 '+(root.getAttribute('width')||960)+' '+(root.getAttribute('height')||600));}const blob=new Blob([new XMLSerializer().serializeToString(root)],{type:'image/svg+xml'});const url=URL.createObjectURL(blob);img.onload=()=>{try{const canvas=document.createElement('canvas');canvas.width=1580;canvas.height=900;const c=canvas.getContext('2d');c.fillStyle=WHITE;c.fillRect(0,0,1580,900);c.drawImage(img,0,0,1580,900);resolve(canvas.toDataURL('image/png'))}catch{resolve(null)}finally{URL.revokeObjectURL(url)}};img.onerror=()=>{URL.revokeObjectURL(url);resolve(null)};img.src=url;
 }else img.src=src;
 }catch{resolve(null)}})}
const dataBytes=data=>Uint8Array.from(atob(data.split(',').pop()),x=>x.charCodeAt(0));
function addImage(data,{maxW=8800,maxH=4800,caption='',ratio=null}={}){const id=++mediaId;const bytes=dataBytes(data);imgs.push({id,bytes});
 // Fit to content; original pixel dimensions aren't reliable for all source SVGs.
 let w=maxW,h=Math.round(maxW*(ratio||.53));if(caption==='map')h=Math.min(maxH,5200);h=Math.min(maxH,h);
 const cx=Math.round(w*635),cy=Math.round(h*635); // 1 twip ≈635 EMU
 return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="130" w:after="130"/></w:pPr><w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="Wykres ${id}" descr="Wykres lub mapa analityczna"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${id}" name="Analiza ${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdImg${id}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
}
function cleanText(txt){return safe(txt).replace(/(?:Dodaj ten wykres|Do prezentacji|Wybrane\s*✓|Dodaj tę mapę|Kliknij kategorię, aby zobaczyć jej historię|Wybierz zawód z listy)[.\s]*/gi,' ').slice(0,1600);}
function normalizeRows(item){const s=item.structured||{};if(s.chartData?.kind==='bars')return s.chartData.rankings||[];return s.rankings||[];}
function unique(items){const keys=new Set();return items.filter(it=>{if(!it?.title||it.included===false)return false;const key=it.selectionKey||JSON.stringify([it.title,it.unit,it.period,it.settings?.params||{}]);if(keys.has(key))return false;keys.add(key);return true;});}
function sectionHeading(item,n){
 const meta=wordMeta(item),parts=[meta.scope,meta.period,meta.unit&&meta.unit!==meta.measure?'jednostka: '+meta.unit:''].filter(Boolean);
 const title=safe(meta.title||item.title).slice(0,200);
 return p(title,{style:'Heading1',size:29,bold:true,color:NAVY,after:80,before:n===1?190:285,keep:true})+
   p(parts.join('  |  '),{size:18,color:GRAY,after:125,italic:true,keep:true});
}
function factualDescription(item){const s=item.structured||{},c=s.chartData||{},meta=wordMeta(item);
 if(s.occupationList){const o=s.occupationList;return `Zestawienie obejmuje ${o.rows?.length||0} grup zawodów w kategorii „${safe(o.label||item.title)}” dla: ${safe(meta.scope||item.unit||'wybrany obszar')}.`;}
 if(c.kind==='series'&&Array.isArray(c.labels)&&c.labels.length>=2){
  const lines=(c.series||[]).filter(z=>(z.values||[]).some(x=>toNum(x)!==null)).slice(0,3);
  return lines.map(line=>{const vals=line.values||[],a=toNum(vals[0]),b=toNum(vals.at(-1));
    if(a===null||b===null)return '';
    const valA=formatMeasure(a,meta),valB=formatMeasure(b,meta);
    return `${safe(line.name||meta.measure||'Wskaźnik')}: ${valA} (${safe(c.labels[0])}) i ${valB} (${safe(c.labels.at(-1))}).`;}).filter(Boolean).join(' ');
 }
 if(c.kind==='bars'){
  const rows=(c.rankings||[]).filter(r=>toNum(r.value)!==null);
  if(rows.length){const min=rows.reduce((a,b)=>toNum(a.value)<=toNum(b.value)?a:b),max=rows.reduce((a,b)=>toNum(a.value)>=toNum(b.value)?a:b);
   let out=`Porównano ${rows.length} jednostek. Najwyższą wartość wskaźnika odnotowano w ${safe(max.label)} (${formatMeasure(max.value,meta)}), a najniższą w ${safe(min.label)} (${formatMeasure(min.value,meta)}).`;
   if(meta.unit==='%')out+=` Różnica wynosi ${num(toNum(max.value)-toNum(min.value))} p.p.`;
   return out;
  }
 }
 if(s.metrics?.length)return `Zestawienie obejmuje ${s.metrics.length} wskaźników dla: ${safe(meta.scope||item.unit||'wybrany obszar')}.`;
 return '';
}
function reportOverview(items){
 const scopes=[...new Set(items.map(x=>safe(wordMeta(x).scope)).filter(Boolean))];
 const analyses=items.length;
 let summary=`W raporcie przedstawiono ${analyses} ${analyses===1?'analizę':analyses<5?'analizy':'analiz'} rynku pracy.`;
 if(scopes.length===1)summary+=' Zakres terytorialny: '+scopes[0]+'.';
 else summary+=' Analizy dotyczą różnych zakresów terytorialnych - każdy został podany w nagłówku odpowiedniej sekcji.';
 summary+=' Okres, jednostkę miary i źródło przedstawiono osobno przy każdej analizie. Braki danych nie są zastępowane wartościami szacunkowymi.';
 return summary;
}
function overviewIndicators(items){const list=[];
 for(const item of items){const meta=wordMeta(item),area=safe(meta.scope||item.unit)||'-';
  for(const metric of item.structured?.metrics||[]){
   if(!safe(metric.value)||list.find(x=>x[0]===safe(metric.label)&&x[2]===area))continue;
   list.push([safe(metric.label),safe(metric.value),area]);if(list.length===6)break;
  }
  if(list.length===6)break;
 }
 if(!list.length){for(const item of items){const c=item.structured?.chartData,meta=wordMeta(item),area=safe(meta.scope||item.unit)||'-';
  if(c?.kind==='series'){
   const line=c.series?.[0],vals=line?.values||[],last=toNum(vals.at(-1));
   if(last!==null)list.push([safe(meta.measure||meta.title||item.title),formatMeasure(last,meta),line?.name?(area.includes('na tle Polski')?safe(line.name)+' (na tle Polski)':area+' - '+safe(line.name)):area]);
  }else if(item.structured?.occupationList){list.push([safe(meta.title||item.title),String(item.structured.occupationList.rows?.length||0),area]);}
  if(list.length===5)break;
 }}
 return list;
}
async function sectionContent(item){
 const s=item.structured||{},c=s.chartData||{},meta=wordMeta(item);
 let content='',used=false;const description=factualDescription(item);
 if(meta.note)content+=p('Uwaga dotycząca zakresu danych: '+safe(meta.note),{size:18,color:'99552A',after:100});
 if(description)content+=p(description,{size:20,after:145,keep:true});
 if(s.occupationList){const o=s.occupationList,rows=o.rows||[];
  content+=p(`Liczba grup zawodów: ${rows.length}. Status: ${o.label||''}.`,{size:20,after:125});
  if(rows.length)content+=table(o.regional?['Lp.','Zawód','Liczba jednostek']:['Lp.','Zawód'],rows.map((r,i)=>o.regional?[String(i+1),r.name,String(r.count)]:[String(i+1),r.name]),o.regional?[.75,6.6,1.7]:[.75,8.3]);
  else content+=p('Nie wskazano grup zawodów w tej kategorii.',{color:GRAY});
  return {content,used:true};
 }
 if(c.kind==='series'){
  const labels=c.labels||[],series=c.series||[];const img=chartImage(c,meta);
  if(img){content+=addImage(img,{maxH:4050,ratio:720/1600});used=true;}
  if(labels.length&&series.some(z=>(z.values||[]).some(v=>toNum(v)!==null))){
   content+=p('Dane źródłowe w poszczególnych okresach',{style:'Heading2',size:24,bold:true,after:95,before:150,keep:true});
   const displaySeries=series.slice(0,4),header=displaySeries.map(x=>safe(x.name||meta.measure||'Wartość')+(meta.unit==='%'?' (%)':''));
   content+=table(['Okres',...header],labels.map((lab,i)=>[lab,...displaySeries.map(x=>formatMeasure(x.values?.[i],meta))]),[1.9,...displaySeries.map(()=>1.7)]);used=true;
  }
 }else if(c.kind==='bars'||normalizeRows(item).length){
  const rows=normalizeRows(item).filter(r=>safe(r.label)&&toNum(r.value)!==null);
  if(rows.length){
   const comparison=meta.comparison&&rows.length>=2;
   const img=comparison?comparisonImage(rows,meta):barImage(rows,meta);
   if(img)content+=addImage(img,{maxH:comparison?4500:4600,ratio:comparison?825/1600:Math.max(470,Math.min(12,rows.length)*64+85)/1600});
   content+=p(comparison?'Dane porównywanych jednostek':'Zestawienie wartości',{style:'Heading2',size:24,bold:true,before:150,after:95,keep:true});
   content+=table([comparison?'Powiat / miasto':'Kategoria',indicatorLabel(meta)],rows.map(r=>[r.label,formatMeasure(r.value,meta)]),[5.8,1.8]);used=true;
  }
 }
 if(!used&&s.map){const image=await imagePng(item.png||item.svg);if(image){content+=addImage(image,{maxH:4900,caption:'map',ratio:900/1580});if(s.map.legend)content+=p(s.map.legend,{color:GRAY,size:17,after:120});used=true;}}
 if(!used&&(item.png||item.svg)){const image=await imagePng(item.png||item.svg);if(image){content+=addImage(image,{maxH:4800});used=true;}}
 if(!used&&s.metrics?.length){const described=s.metrics.some(m=>safe(m.detail));content+=described?table(['Wskaźnik','Wartość','Objaśnienie'],s.metrics.map(m=>[m.label,m.value,m.detail||'']),[3.1,1.5,3.2]):table(['Wskaźnik','Wartość'],s.metrics.map(m=>[m.label,m.value]),[5.5,2]);used=true;}
 if(!used&&s.signals?.length){content+=table(['Sygnał','Interpretacja'],s.signals.map(x=>[x.label,x.detail]),[2.5,5]);used=true;}
 if(!used&&item.view==='jobs'){const text=cleanText(item.text);if(text.length>=35&&!/Powiat \/ miasto Województwo|Wybierz powiat lub miasto/i.test(text)){content+=p(text,{size:19,after:140});used=true;}}
 return {content,used};
}
function cover(items){const date=new Date().toLocaleDateString('pl-PL');
 const units=[...new Set(items.map(x=>safe(wordMeta(x).scope)).filter(Boolean))];
 const title=units.length===1&&units[0].length<50?`Rynek pracy - ${units[0]}`:'Raport z analiz rynku pracy';
 let out=p('WOJEWÓDZKI URZĄD PRACY W KATOWICACH  |  OBSERWATORIUM · RYNEK PRACY · 2027',{size:16,color:BLUE,bold:true,after:150,keep:true});
 out+=p(title,{style:'Title',size:43,color:'1D2228',bold:true,after:65,keep:true});
 out+=p(`Analiza rynku pracy | ${date}`,{size:21,color:GRAY,italic:true,after:235});
 out+=p('Podsumowanie',{style:'Heading1',size:30,color:NAVY,bold:true,before:75,after:105,keep:true});
 out+=p(reportOverview(items),{size:21,color:NAVY,after:225});
 const indicators=overviewIndicators(items);if(indicators.length){out+=p('Kluczowe wskaźniki',{style:'Heading1',size:29,color:NAVY,bold:true,before:60,after:115,keep:true});out+=table(['Wskaźnik','Wartość','Obszar'],indicators,[4.15,1.35,2.4]);}
 return out;
}
function footerSources(item){const meta=wordMeta(item);return p('Źródło: '+safe(meta.source||'brak określonego źródła').slice(0,420),{size:16,color:GRAY,italic:true,before:110,after:160});}
function createDocument(body){return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${body}<w:sectPr><w:headerReference w:type="default" r:id="rIdHeader"/><w:footerReference w:type="default" r:id="rIdFooter"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1300" w:right="1190" w:bottom="1180" w:left="1190" w:header="450" w:footer="550"/><w:cols w:space="425"/></w:sectPr></w:body></w:document>`}
const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}"/><w:sz w:val="21"/><w:color w:val="${NAVY}"/></w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:spacing w:after="90" w:line="270" w:lineRule="auto"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:qFormat/></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/></w:style></w:styles>`;
const footer=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="right"/><w:spacing w:after="0"/></w:pPr>${run('OBSERWATORIUM · RYNEK PRACY · 2027',{size:14,color:'727C87'})}</w:p></w:hdr>`;
const footXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="right"/><w:pBdr><w:top w:val="single" w:sz="4" w:color="D6DCE3"/></w:pBdr></w:pPr>${run('WUP Katowice  |  Strona ',{size:15,color:GRAY})}<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;
async function generateDocx(basket){if(!JSZIP){alert('Brak modułu tworzenia Word. Odśwież aplikację lub rozpakuj pełną paczkę.');return}
 const selected=unique(basket||[]);if(!selected.length){alert('Najpierw wybierz przynajmniej jedną analizę.');return}
 const btn=document.getElementById('v128GenerateDocx');if(btn){btn.disabled=true;btn.textContent='Tworzenie raportu…'}
 imgs=[];mediaId=0;skipped=[];
 try{
 let body='',ok=0;const sectionBlocks=[],included=[];
 const firstMetrics=selected.find(item=>item.structured?.metrics?.length>0);
 for(const [i,item] of selected.entries()){
   if(item===firstMetrics&&item.structured.metrics.length<=6&&!item.structured.metrics.some(m=>safe(m.detail))){included.push(item);ok++;continue;}
   try{const sec=await sectionContent(item);if(!sec.used){skipped.push(safe(item.title));continue;}
     sectionBlocks.push(sectionHeading(item,++ok)+sec.content+footerSources(item));included.push(item);
   }catch(error){console.warn('DOCX: nie można utworzyć rozdziału',item.title,error);skipped.push(safe(item.title));}
 }
 if(!ok){alert('Nie utworzono raportu: wybrane analizy nie zawierają zapisanych danych. Zaznacz je ponownie przy aktualnych wykresach.');return}
 body=cover(included)+sectionBlocks.join('');
 if(included.length>3)body+=p('Źródła i metodologia',{style:'Heading1',size:29,bold:true,before:250,after:105,keep:true})+p('W opracowaniu wykorzystano dane ze źródeł wymienionych przy poszczególnych analizach. Brakujących wartości nie zastępowano szacunkami.',{size:20,color:NAVY});
 const zip=new JSZIP();zip.file('[Content_Types].xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`);
 zip.file('_rels/.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`);
 zip.file('word/document.xml',createDocument(body));zip.file('word/styles.xml',styles);zip.file('word/header1.xml',footer);zip.file('word/footer1.xml',footXml);
 zip.file('word/_rels/document.xml.rels',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdHeader" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/><Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>${imgs.map(im=>`<Relationship Id="rIdImg${im.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${im.id}.png"/>`).join('')}</Relationships>`);
 imgs.forEach(im=>zip.file(`word/media/image${im.id}.png`,im.bytes));
 const now=new Date().toISOString();zip.file('docProps/core.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Raport rynku pracy - Obserwatorium · Rynek Pracy · 2027</dc:title><dc:creator>Wojewódzki Urząd Pracy w Katowicach</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created></cp:coreProperties>`);
 zip.file('docProps/app.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Obserwatorium Rynku Pracy</Application></Properties>');
 const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:5}});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Obserwatorium_Rynek_Pracy_2027_raport.docx';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),8000);
 if(skipped.length)alert('Raport utworzono. Pominięto '+skipped.length+' elementów bez zapisanych danych:\n• '+skipped.slice(0,12).join('\n• '));
 }catch(error){console.error('Generator DOCX v143:',error);alert('Nie udało się wygenerować raportu Word: '+(error?.message||error));}
 finally{if(btn){btn.disabled=false;btn.textContent='Word DOCX';}}
}
window.OBS_WORD_V128=generateDocx;
})();
