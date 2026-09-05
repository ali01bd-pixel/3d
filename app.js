(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));
  const mulberry32 = a => () => { let t=a+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; };
  const state={posterCount:5,designMode:"oceanWatercolor",shapeSize:100,density:8,gradientSoftness:72,spacing:24,textAmount:55,seed:260831,format:"portrait",quality:"large",darkColor:"#075475",lightColor:"#eafcff"};
  let zoom=1;

  function dims(){const b={portrait:{w:1200,h:1800},square:{w:1600,h:1600},landscape:{w:1800,h:1200}}[state.format]; const q={standard:1,large:1.35,xl:1.8}[state.quality]; return {w:Math.round(b.w*q),h:Math.round(b.h*q)};}
  function hexToRgb(h){const s=String(h).replace("#","");const v=parseInt(s.length===3?s.split("").map(x=>x+x).join(""):s,16)||0;return {r:(v>>16)&255,g:(v>>8)&255,b:v&255};}
  function mixHex(a,b,t){const A=hexToRgb(a),B=hexToRgb(b);return "#"+[A.r,A.g,A.b].map((v,i)=>Math.round(v*(1-t)+[B.r,B.g,B.b][i]*t).toString(16).padStart(2,"0")).join("");}
  function sizeFactor(){return clamp(Number(state.shapeSize)/100,.55,1.4);}
  function palette(index){
    const base=["#075475","#0a6f91","#2ca8c9","#6bc9da","#c8edf1","#edfaff","#d7f3ef"];
    const jitter=(index*17+(Number(state.seed)||1)%31)%base.length;
    return {dark:state.darkColor, deep:mixHex(base[(jitter+0)%base.length],state.darkColor,.45), mid:mixHex(base[(jitter+2)%base.length],"#4ab9cf",.35), cyan:base[(jitter+3)%base.length], light:state.lightColor, foam:mixHex(base[(jitter+5)%base.length],state.lightColor,.40), white:"#f8ffff", ink:"#16445a"};
  }
  function defs(id,p){return `<defs>
    <linearGradient id="${id}_sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${p.white}"/><stop offset="48%" stop-color="${p.light}"/><stop offset="100%" stop-color="${p.mid}"/></linearGradient>
    <linearGradient id="${id}_sea" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${p.light}"/><stop offset="42%" stop-color="${p.cyan}"/><stop offset="100%" stop-color="${p.dark}"/></linearGradient>
    <linearGradient id="${id}_foam" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${p.white}"/><stop offset="45%" stop-color="${p.foam}"/><stop offset="100%" stop-color="${p.cyan}"/></linearGradient>
    <linearGradient id="${id}_deep" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${p.mid}"/><stop offset="55%" stop-color="${p.deep}"/><stop offset="100%" stop-color="${p.dark}"/></linearGradient>
    <radialGradient id="${id}_wash" cx="50%" cy="42%" r="70%"><stop offset="0%" stop-color="${p.white}" stop-opacity=".92"/><stop offset="40%" stop-color="${p.light}" stop-opacity=".72"/><stop offset="78%" stop-color="${p.cyan}" stop-opacity=".44"/><stop offset="100%" stop-color="${p.dark}" stop-opacity=".14"/></radialGradient>
    <radialGradient id="${id}_aqua" cx="44%" cy="40%" r="68%"><stop offset="0%" stop-color="${p.white}" stop-opacity=".85"/><stop offset="45%" stop-color="${p.cyan}" stop-opacity=".72"/><stop offset="100%" stop-color="${p.deep}" stop-opacity=".12"/></radialGradient>
  </defs>`;}

  function oceanLayout(index,w,h,p,rnd,id){
    const s=sizeFactor(), d=Number(state.density); let out="";
    // 1: white sky / large cresting sea wash.
    if(index%5===0){
      out+=`<rect width="${w}" height="${h}" fill="url(#${id}_sky)"/>`;
      out+=`<path d="M 0 ${h*.66} C ${w*.10} ${h*.48}, ${w*.28} ${h*.54}, ${w*.43} ${h*.67} C ${w*.61} ${h*.84}, ${w*.74} ${h*.62}, ${w} ${h*.49} L ${w} ${h} L 0 ${h} Z" fill="url(#${id}_sea)" opacity=".78"/>`;
      for(let i=0;i<d;i++){
        const y=h*(.66+i*.022), x=w*(.12+(i%4)*.06), a=w*(.16+i*.015);
        out+=`<path d="M ${x.toFixed(1)} ${y.toFixed(1)} C ${(x+a*.35).toFixed(1)} ${(y-h*.06).toFixed(1)}, ${(x+a*.72).toFixed(1)} ${(y-h*.10).toFixed(1)}, ${(x+a).toFixed(1)} ${(y-h*.025).toFixed(1)} C ${(x+a*.76).toFixed(1)} ${(y+h*.02).toFixed(1)}, ${(x+a*.38).toFixed(1)} ${(y+h*.035).toFixed(1)}, ${x.toFixed(1)} ${(y+h*.02).toFixed(1)} Z" fill="${i%3===0?p.white:p.foam}" opacity="${(.15+.045*(d-i)).toFixed(2)}"/>`;
      }
      out+=`<ellipse cx="${w*.27}" cy="${h*.16}" rx="${w*.23}" ry="${h*.16}" fill="url(#${id}_wash)" opacity=".72"/>`;
      return out;
    }
    // 2: layered ocean wave bands.
    if(index%5===1){
      out+=`<rect width="${w}" height="${h}" fill="${p.white}"/>`;
      const bands=7+Math.floor(d/2);
      for(let i=0;i<bands;i++){
        const y=h*(.40+i*.075), amp=h*(.035+i*.005)*s, col=i%3===0?p.cyan:(i%2?p.mid:p.deep);
        out+=`<path d="M 0 ${y.toFixed(1)} C ${w*.20} ${(y-amp).toFixed(1)}, ${w*.42} ${(y+amp*.85).toFixed(1)}, ${w*.62} ${(y-amp*.55).toFixed(1)} C ${w*.78} ${(y-amp*.92).toFixed(1)}, ${w*.90} ${(y+amp*.48).toFixed(1)}, ${w} ${(y-amp*.14).toFixed(1)} L ${w} ${(y+amp*1.05).toFixed(1)} C ${w*.84} ${(y+amp*.42).toFixed(1)}, ${w*.67} ${(y+amp*1.15).toFixed(1)}, ${w*.48} ${(y+amp*.58).toFixed(1)} C ${w*.27} ${(y-amp*.18).toFixed(1)}, ${w*.15} ${(y+amp*.92).toFixed(1)}, 0 ${(y+amp*.50).toFixed(1)} Z" fill="${col}" opacity="${(.32+.055*i).toFixed(2)}"/>`;
      }
      out+=`<path d="M 0 ${h*.78} C ${w*.23} ${h*.68}, ${w*.51} ${h*.90}, ${w} ${h*.73} L ${w} ${h} L 0 ${h} Z" fill="url(#${id}_deep)" opacity=".76"/>`;
      return out;
    }
    // 3: deep sea tonal blobs/arches without filters.
    if(index%5===2){
      out+=`<rect width="${w}" height="${h}" fill="url(#${id}_sea)"/>`;
      const shapes=6+Math.floor(d/3);
      for(let i=0;i<shapes;i++){
        const x=w*(.12+rnd()*.72), y=h*(.18+rnd()*.64), rx=w*(.11+rnd()*.17)*s, ry=h*(.06+rnd()*.13)*s;
        const c=i%4===0?p.white:(i%3===0?p.light:(i%2?p.cyan:p.deep));
        out+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${c}" opacity="${(.10+.09*rnd()).toFixed(2)}"/>`;
      }
      out+=`<path d="M 0 ${h*.74} C ${w*.18} ${h*.62}, ${w*.34} ${h*.84}, ${w*.55} ${h*.70} C ${w*.74} ${h*.56}, ${w*.88} ${h*.74}, ${w} ${h*.62} L ${w} ${h} L 0 ${h} Z" fill="url(#${id}_deep)" opacity=".82"/>`;
      return out;
    }
    // 4: horizon + calm stacked water layers.
    if(index%5===3){
      out+=`<rect width="${w}" height="${h}" fill="url(#${id}_sky)"/>`;
      out+=`<rect x="0" y="${h*.52}" width="${w}" height="${h*.48}" fill="url(#${id}_sea)"/>`;
      for(let i=0;i<9;i++){
        const y=h*(.57+i*.043), hh=h*(.028+.008*(i%3)), col=i%3===0?p.white:(i%2?p.light:p.cyan);
        out+=`<rect x="0" y="${y.toFixed(1)}" width="${w}" height="${hh.toFixed(1)}" fill="${col}" opacity="${(.10+.06*(i%4)).toFixed(2)}"/>`;
      }
      out+=`<path d="M 0 ${h*.59} C ${w*.22} ${h*.50}, ${w*.45} ${h*.63}, ${w*.72} ${h*.54} C ${w*.86} ${h*.50}, ${w*.93} ${h*.55}, ${w} ${h*.51}" fill="none" stroke="${p.white}" stroke-width="${Math.max(7,w*.006).toFixed(1)}" opacity=".46"/>`;
      out+=`<ellipse cx="${w*.50}" cy="${h*.20}" rx="${w*.32}" ry="${h*.13}" fill="url(#${id}_wash)" opacity=".68"/>`;
      return out;
    }
    // 5: big translucent wave halves, closest to the reference set.
    out+=`<rect width="${w}" height="${h}" fill="${p.white}"/>`;
    const R=Math.min(w,h)*.48*s;
    out+=`<path d="M ${-R} ${h*.72} C ${w*.04} ${h*.35}, ${w*.34} ${h*.30}, ${w*.52} ${h*.54} C ${w*.68} ${h*.74}, ${w*.86} ${h*.63}, ${w+R*.08} ${h*.35} L ${w+R*.10} ${h} L ${-R} ${h} Z" fill="url(#${id}_aqua)" opacity=".78"/>`;
    out+=`<path d="M 0 ${h*.79} C ${w*.16} ${h*.55}, ${w*.39} ${h*.53}, ${w*.58} ${h*.76} C ${w*.72} ${h*.92}, ${w*.88} ${h*.74}, ${w} ${h*.61} L ${w} ${h} L 0 ${h} Z" fill="url(#${id}_deep)" opacity=".55"/>`;
    for(let i=0;i<d;i++){
      const y=h*(.30+i*.038), off=w*(.08+i*.02);
      out+=`<path d="M ${(off*-1).toFixed(1)} ${y.toFixed(1)} C ${w*.18} ${(y-h*.055).toFixed(1)}, ${w*.42} ${(y+h*.05).toFixed(1)}, ${w*.62} ${(y-h*.015).toFixed(1)} C ${w*.77} ${(y-h*.055).toFixed(1)}, ${w*.90} ${(y+h*.02).toFixed(1)}, ${(w+off).toFixed(1)} ${(y-h*.02).toFixed(1)}" fill="none" stroke="${i%3===0?p.white:p.foam}" stroke-width="${Math.max(5,w*.004).toFixed(1)}" opacity="${(.16+.025*i).toFixed(2)}"/>`;
    }
    return out;
  }

  function textLayer(index,w,h){
    const a=Number(state.textAmount)/100; if(a<=0) return "";
    const titles=["SEA WAVE","OCEAN WAVES","DEEP SEA","OCEAN STUDY","SEA FORM"];
    const subs=["ABSTRACT WATERCOLOR","OCEAN EDITORIAL","WATER / COLOR","DEEP BLUE STUDY","VISUAL OCEAN"];
    const fs=Math.max(18,Math.round(Math.min(w,h)*.028));
    return `<g font-family="Arial, Helvetica, sans-serif" fill="#163f55" opacity="${(.72+.25*a).toFixed(2)}">
      <text x="${(w*.10).toFixed(1)}" y="${(h*.13).toFixed(1)}" font-size="${fs}" font-weight="700" letter-spacing="${Math.max(2,fs*.14).toFixed(1)}">${esc(titles[index%titles.length])}</text>
      <text x="${(w*.10).toFixed(1)}" y="${(h*.16).toFixed(1)}" font-size="${Math.round(fs*.36)}" letter-spacing="${Math.max(1,fs*.06).toFixed(1)}">${esc(subs[index%subs.length])}</text>
      <text x="${(w*.10).toFixed(1)}" y="${(h*.90).toFixed(1)}" font-size="${Math.round(fs*.33)}" font-weight="700" letter-spacing="${Math.max(1,fs*.07).toFixed(1)}">ALI STUDIO / ${String(index+1).padStart(2,"0")}</text>
      <text x="${(w*.10).toFixed(1)}" y="${(h*.925).toFixed(1)}" font-size="${Math.round(fs*.24)}" letter-spacing="${Math.max(1,fs*.05).toFixed(1)}">OCEAN COLOR SERIES</text>
    </g>`;
  }

  function makeSvg(index){
    const {w,h}=dims(); const rnd=mulberry32((Number(state.seed)||1)+index*7919); const p=palette(index); const id=`ocean_${Number(state.seed)||1}_${index}`;
    let out=defs(id,p); out+=oceanLayout(index,w,h,p,rnd,id); out+=textLayer(index,w,h);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><title>ALI STUDIO — Ocean Watercolor ${String(index+1).padStart(2,"0")}</title><metadata>Generated locally by ALI STUDIO. Solid colors and gradients only. No SVG effects.</metadata>${out}</svg>`;
  }
  function makeCombinedSvg(){const {w:pw,h:ph}=dims();const count=Number(state.posterCount),cols=Math.min(4,Math.max(1,count)),rows=Math.ceil(count/cols),gap=36;const aw=pw*cols+gap*(cols+1),ah=ph*rows+gap*(rows+1);let out=`<svg xmlns="http://www.w3.org/2000/svg" width="${aw}" height="${ah}" viewBox="0 0 ${aw} ${ah}"><title>ALI STUDIO — Ocean Watercolor Collection</title><rect width="${aw}" height="${ah}" fill="#eaf3f6"/>`;for(let i=0;i<count;i++){const x=gap+(i%cols)*(pw+gap),y=gap+Math.floor(i/cols)*(ph+gap);const inner=makeSvg(i).replace(/^<svg[^>]*>/,"").replace(/<\/svg>\s*$/i,"");out+=`<g transform="translate(${x} ${y})">${inner}</g>`;}return out+"</svg>";}
  function download(filename,content,mime="image/svg+xml"){const blob=new Blob([content],{type:mime}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
  async function copyText(text){try{await navigator.clipboard.writeText(text);alert("SVG copied to clipboard.");}catch{const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();alert("SVG copied to clipboard.");}}
  function readControls(){const numeric=["posterCount","shapeSize","density","gradientSoftness","spacing","textAmount"];["posterCount","shapeSize","density","gradientSoftness","spacing","textAmount","format","quality","darkColor","lightColor"].forEach(k=>{const el=$(k);state[k]=numeric.includes(k)?Number(el.value):el.value;});state.seed=Number($("seed").value)||1;}
  function updateOutputs(){const map={posterCount:["posterCountVal",v=>v],shapeSize:["shapeSizeVal",v=>v+"%"],density:["densityVal",v=>v],gradientSoftness:["gradientSoftnessVal",v=>v+"%"],spacing:["spacingVal",v=>v+"%"],textAmount:["textAmountVal",v=>v+"%"]};Object.entries(map).forEach(([id,[oid,fn]])=>$(oid).textContent=fn($(id).value));$("collectionCount").textContent=$("posterCount").value;}
  function render(){readControls();updateOutputs();const grid=$("posterGrid");grid.innerHTML="";const tpl=$("posterTemplate");for(let i=0;i<state.posterCount;i++){const node=tpl.content.firstElementChild.cloneNode(true),svg=makeSvg(i);node.querySelector(".poster-number").textContent=`DESIGN ${String(i+1).padStart(2,"0")}`;node.querySelector(".poster-mode").textContent=`OCEAN / ${String(i+1).padStart(2,"0")}`;node.querySelector(".poster-frame").innerHTML=svg;node.querySelector(".download-one").addEventListener("click",()=>download(`ali-studio-ocean-watercolor-${String(i+1).padStart(2,"0")}.svg`,svg));node.querySelector(".copy-one").addEventListener("click",()=>copyText(svg));grid.appendChild(node);}grid.style.gridTemplateColumns=`repeat(${Math.min(4,state.posterCount)},minmax(0,1fr))`;applyZoom();}
  function applyZoom(){$("posterGrid").style.transform=`scale(${zoom})`;$("zoomLabel").textContent=`${Math.round(zoom*100)}%`;}
  ["posterCount","shapeSize","density","gradientSoftness","spacing","textAmount","seed","format","quality","darkColor","lightColor"].forEach(id=>{$(id).addEventListener("input",()=>{updateOutputs();render();});$(id).addEventListener("change",()=>{updateOutputs();render();});});
  $("regenerate").addEventListener("click",render);
  $("randomize").addEventListener("click",()=>{$("seed").value=Math.floor(Math.random()*9999999)+1;$("shapeSize").value=75+Math.floor(Math.random()*50);$("density").value=5+Math.floor(Math.random()*10);$("gradientSoftness").value=45+Math.floor(Math.random()*50);$("spacing").value=10+Math.floor(Math.random()*46);updateOutputs();render();});
  $("downloadAll").addEventListener("click",()=>download("ali-studio-ocean-watercolor-collection.svg",makeCombinedSvg()));
  $("downloadJson").addEventListener("click",()=>download("ali-studio-ocean-watercolor-settings.json",JSON.stringify(state,null,2),"application/json"));
  $("zoomIn").addEventListener("click",()=>{zoom=clamp(zoom+.1,.5,1.8);applyZoom();}); $("zoomOut").addEventListener("click",()=>{zoom=clamp(zoom-.1,.5,1.8);applyZoom();});
  updateOutputs();render();
})();
