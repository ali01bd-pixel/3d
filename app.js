(() => {
"use strict";
const $=id=>document.getElementById(id);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));
const TAU=Math.PI*2;
const mulberry32=a=>()=>{let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};

const state={posterCount:5,designMode:"solidGradientEditorial",shapeSize:100,density:8,gradientSoftness:72,spacing:24,textAmount:55,seed:260831,format:"portrait",quality:"large",darkColor:"#050509",lightColor:"#f6efe5"};
let zoom=1;

function dims(){const b={portrait:{w:1200,h:1800},square:{w:1600,h:1600},landscape:{w:1800,h:1200}}[state.format],q={standard:1,large:1.35,xl:1.8}[state.quality];return{w:Math.round(b.w*q),h:Math.round(b.h*q)}}
function rgb(hex){let s=String(hex).replace("#","");if(s.length===3)s=s.split("").map(x=>x+x).join("");const v=parseInt(s,16)||0;return[(v>>16)&255,(v>>8)&255,v&255]}
function mix(a,b,t){const A=rgb(a),B=rgb(b);return"#"+A.map((v,i)=>Math.round(v*(1-t)+B[i]*t).toString(16).padStart(2,"0")).join("")}
function sf(){return clamp(Number(state.shapeSize)/100,.55,1.4)}
function neonPalette(i){
  const t=(i*0.19+(Number(state.seed)%97)/97)%1;
  const sets=[
    ["#081019","#4030e8","#ff299e","#ff4f70","#55d8ff","#fff5ff"],
    ["#05070f","#1739c9","#8256ff","#ff3a9d","#ff7d4f","#fff4e5"],
    ["#070a14","#2357ff","#00cfe8","#b343ff","#ff3b88","#fff6e9"],
    ["#0a0711","#4a20bd","#ff2fbd","#ff693f","#ffd05b","#f8f2ff"],
  ];
  const s=sets[i%sets.length],u=(t*0.8);
  return {bg:mix(s[0],s[1],u*.18),c1:s[1],c2:s[2],c3:s[3],c4:s[4],light:s[5]};
}
function defs(id,p){
 return `<defs>
 <linearGradient id="${id}g1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="${p.bg}"/><stop offset="${Math.round(35+Number(state.gradientSoftness)*.25)}%" stop-color="${p.c1}"/><stop offset="100%" stop-color="${p.c2}"/></linearGradient>
 <linearGradient id="${id}g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${p.c2}"/><stop offset="48%" stop-color="${p.c3}"/><stop offset="100%" stop-color="${p.c4}"/></linearGradient>
 <linearGradient id="${id}g3" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="${p.c1}"/><stop offset="50%" stop-color="${p.c4}"/><stop offset="100%" stop-color="${p.light}"/></linearGradient>
 <radialGradient id="${id}r1" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="${p.light}"/><stop offset="40%" stop-color="${p.c2}"/><stop offset="75%" stop-color="${p.c1}"/><stop offset="100%" stop-color="${p.bg}"/></radialGradient>
 </defs>`;
}

function ribbonPath(x,y,w,h,lean){return `M ${x.toFixed(1)} ${y.toFixed(1)} C ${(x+w*.28).toFixed(1)} ${(y-h*lean).toFixed(1)}, ${(x+w*.72).toFixed(1)} ${(y+h*(1+lean)).toFixed(1)}, ${(x+w).toFixed(1)} ${(y+h).toFixed(1)}`;}

function layout(index,w,h,p,rnd,id){
 const s=sf(), d=Number(state.density);
 let o="";
 if(index%5===0){
   // Flowing multi-color rings on black.
   o+=`<rect width="${w}" height="${h}" fill="${p.bg}"/>`;
   const cx=w*(.50+rnd()*.08),cy=h*(.47+rnd()*.08),R=Math.min(w,h)*.28*s;
   const cols=[p.c2,p.c1,p.c4,p.c3,p.c2,p.light];
   const n=8+Math.floor(d*.7);
   for(let i=0;i<n;i++){
     const r=R*(1-i/n*.72),dx=Math.sin(i*.55)*w*.012,dy=Math.cos(i*.42)*h*.014;
     o+=`<ellipse cx="${(cx+dx).toFixed(1)}" cy="${(cy+dy).toFixed(1)}" rx="${(r*1.18).toFixed(1)}" ry="${(r*.52).toFixed(1)}" transform="rotate(${-16+i*2} ${cx} ${cy})" fill="none" stroke="${cols[i%cols.length]}" stroke-width="${Math.max(12,r*.11).toFixed(1)}"/>`;
   }
   o+=`<circle cx="${(cx-w*.01).toFixed(1)}" cy="${(cy-h*.01).toFixed(1)}" r="${(R*.17).toFixed(1)}" fill="${p.c4}"/>`;
   return o;
 }
 if(index%5===1){
   // Ivory background + bold 3D-style ribbon built from solid gradient faces (no effects).
   const bg=state.lightColor||"#f4efe6"; o+=`<rect width="${w}" height="${h}" fill="${bg}"/>`;
   const x=w*.23,y=h*.18,ww=w*.56,hh=h*.60;
   const seg=7; const colors=[p.c1,p.c2,p.c3,p.c4,p.c2,p.c1,p.c3];
   for(let i=0;i<seg;i++){
     const yy=y+i*(hh/seg), twist=Math.sin(i*.8)*w*.025, sw=ww*(.62+.10*Math.sin(i));
     const pts=`${(x+twist).toFixed(1)},${yy.toFixed(1)} ${(x+sw+twist).toFixed(1)},${(yy+hh/seg*.22).toFixed(1)} ${(x+sw+twist*1.1).toFixed(1)},${(yy+hh/seg*.62).toFixed(1)} ${(x+twist*.3).toFixed(1)},${(yy+hh/seg).toFixed(1)}`;
     o+=`<polygon points="${pts}" fill="${i%2?`url(#${id}g2)`:`url(#${id}g3)`}" />`;
   }
   o+=`<polygon points="${w*.20},${h*.68} ${w*.67},${h*.55} ${w*.77},${h*.63} ${w*.28},${h*.78}" fill="${p.c2}"/>`;
   return o;
 }
 if(index%5===2){
   // Black poster with colorful orbiting bands.
   o+=`<rect width="${w}" height="${h}" fill="${p.bg}"/>`;
   const cx=w*.53,cy=h*.55,cols=[p.c1,p.c2,p.c3,p.c4,p.light];
   for(let i=0;i<10+Math.floor(d/2);i++){
     const rx=w*(.08+i*.055)*s, ry=h*(.045+i*.035)*s;
     const rot=-22+i*3.2;
     o+=`<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" transform="rotate(${rot.toFixed(1)} ${cx} ${cy})" fill="none" stroke="${cols[i%cols.length]}" stroke-width="${Math.max(10,w*.007).toFixed(1)}"/>`;
   }
   for(let i=0;i<5;i++){
     const x=w*(.18+i*.16),y=h*(.13+i*.11);
     o+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${w*.055}" ry="${h*.018}" transform="rotate(-18 ${x} ${y})" fill="url(#${id}g3)"/>`;
   }
   return o;
 }
 if(index%5===3){
   // Bright geometric letter-like collage.
   o+=`<rect width="${w}" height="${h}" fill="${p.c2}"/>`;
   const pieces=[
    [0,0,.42,.28,p.c1],[.40,0,.32,.22,p.c4],[.73,.03,.27,.28,p.c3],
    [.06,.25,.30,.25,p.c4],[.34,.22,.28,.30,p.light],[.62,.27,.34,.22,p.c1],
    [.00,.49,.25,.27,p.c3],[.25,.51,.36,.30,p.c1],[.59,.49,.29,.28,p.c4],[.86,.54,.14,.25,p.c2],
    [.05,.78,.29,.20,p.c4],[.35,.80,.25,.18,p.c1],[.60,.77,.40,.22,p.c3]
   ];
   pieces.forEach(q=>{const [x,y,ww,hh,c]=q;o+=`<rect x="${(w*x).toFixed(1)}" y="${(h*y).toFixed(1)}" width="${(w*ww).toFixed(1)}" height="${(h*hh).toFixed(1)}" fill="${c}"/>`});
   o+=`<path d="M ${w*.18} ${h*.08} L ${w*.52} ${h*.08} L ${w*.36} ${h*.43} L ${w*.18} ${h*.43} Z" fill="url(#${id}g2)"/>`;
   o+=`<path d="M ${w*.52} ${h*.43} L ${w*.83} ${h*.43} L ${w*.66} ${h*.76} L ${w*.39} ${h*.76} Z" fill="url(#${id}g3)"/>`;
   return o;
 }
 // 5: vertical gradient bars.
 o+=`<rect width="${w}" height="${h}" fill="${p.bg}"/>`;
 const n=8+Math.floor(d*.65), bw=w/(n*1.55);
 for(let i=0;i<n;i++){
   const x=w*.08+i*(w*.84/(n-1)), bh=h*(.28+.055*i)*(0.88+rnd()*.18)*s, y=h*.82-bh;
   const c=[p.c1,p.c2,p.c3,p.c4,p.light][i%5];
   o+=`<rect x="${(x-bw/2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${c}" />`;
   if(i%2===0) o+=`<rect x="${(x-bw*.31).toFixed(1)}" y="${(y+bh*.18).toFixed(1)}" width="${(bw*.62).toFixed(1)}" height="${(bh*.58).toFixed(1)}" fill="url(#${id}g2)"/>`;
 }
 return o;
}

function textLayer(index,w,h,p){
 const amount=Number(state.textAmount)/100;if(amount<=0)return"";
 const titles=["design","DESIGN","abstract","visual","gradient art","creative layout"];
 const title=titles[index%titles.length];
 const fs=Math.max(18,Math.round(Math.min(w,h)*.055*(.72+.28*amount)));
 const fill=index===1 ? "#111216" : (state.lightColor&&index===4 ? "#111216" : "#ffffff");
 return `<g font-family="Arial, Helvetica, sans-serif" fill="${fill}">
   <text x="${(w*.07).toFixed(1)}" y="${(h*.11).toFixed(1)}" font-size="${Math.round(fs*.32)}" font-weight="700" letter-spacing="${Math.max(2,fs*.07)}">ALI STUDIO</text>
   <text x="${(w*.07).toFixed(1)}" y="${(h*.18).toFixed(1)}" font-size="${fs}" font-weight="500" letter-spacing="${Math.max(0,fs*.01)}">${esc(title)}</text>
   <text x="${(w*.07).toFixed(1)}" y="${(h*.90).toFixed(1)}" font-size="${Math.round(fs*.23)}" font-weight="700" letter-spacing="${Math.max(1,fs*.08)}">VISUAL SYSTEM / ${String(index+1).padStart(2,"0")}</text>
   <text x="${(w*.07).toFixed(1)}" y="${(h*.93).toFixed(1)}" font-size="${Math.round(fs*.18)}" letter-spacing="${Math.max(1,fs*.05)}">SOLID COLOR + GRADIENT / EDITORIAL STUDY</text>
 </g>`;
}

function makeSvg(index){
 const {w,h}=dims(),rnd=mulberry32((Number(state.seed)||1)+index*7919),p=neonPalette(index),id=`ag_${Number(state.seed)||1}_${index}`;
 // IMPORTANT: only gradients/solid colors are included. No filter, mask, clipPath or SVG effect.
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
   <title>ALI STUDIO — Solid + Gradient Editorial ${String(index+1).padStart(2,"0")}</title>
   <metadata>Solid colors and gradients only. No SVG filter effects.</metadata>
   ${defs(id,p)}
   ${layout(index,w,h,p,rnd,id)}
   ${textLayer(index,w,h,p)}
 </svg>`;
}

function makeCombinedSvg(){
 const {w:pw,h:ph}=dims(),count=Number(state.posterCount),cols=Math.min(4,count),rows=Math.ceil(count/cols),gap=36;
 const aw=pw*cols+gap*(cols+1),ah=ph*rows+gap*(rows+1);
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="${aw}" height="${ah}" viewBox="0 0 ${aw} ${ah}"><title>ALI STUDIO — Solid + Gradient Editorial Collection</title><rect width="${aw}" height="${ah}" fill="#e6e7e6"/>`;
 for(let i=0;i<count;i++){const x=gap+(i%cols)*(pw+gap),y=gap+Math.floor(i/cols)*(ph+gap);out+=`<g transform="translate(${x} ${y})">${makeSvg(i).replace(/^<svg[^>]*>/,"").replace(/<\/svg>\s*$/i,"")}</g>`}
 return out+"</svg>";
}
function download(name,content,mime="image/svg+xml"){const b=new Blob([content],{type:mime}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),800)}
async function copyText(t){try{await navigator.clipboard.writeText(t);alert("SVG copied.");}catch{const ta=document.createElement("textarea");ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();alert("SVG copied.");}}
function readControls(){["posterCount","shapeSize","density","gradientSoftness","spacing","textAmount"].forEach(k=>state[k]=Number($(k).value));["designMode","format","quality","darkColor","lightColor"].forEach(k=>state[k]=$(k).value);state.seed=Number($("seed").value)||1}
function updateOutputs(){$("posterCountVal").textContent=state.posterCount;$("shapeSizeVal").textContent=state.shapeSize+"%";$("densityVal").textContent=state.density;$("gradientSoftnessVal").textContent=state.gradientSoftness+"%";$("spacingVal").textContent=state.spacing+"%";$("textAmountVal").textContent=state.textAmount+"%";$("collectionCount").textContent=state.posterCount}
function render(){readControls();updateOutputs();const g=$("posterGrid");g.innerHTML="";for(let i=0;i<state.posterCount;i++){const n=$("posterTemplate").content.firstElementChild.cloneNode(true),svg=makeSvg(i);n.querySelector(".poster-number").textContent=`DESIGN ${String(i+1).padStart(2,"0")}`;n.querySelector(".poster-frame").innerHTML=svg;n.querySelector(".download-one").onclick=()=>download(`ali-studio-editorial-${String(i+1).padStart(2,"0")}.svg`,svg);n.querySelector(".copy-one").onclick=()=>copyText(svg);g.appendChild(n)}g.style.gridTemplateColumns=`repeat(${Math.min(4,state.posterCount)},minmax(0,1fr))`;$("workspaceTitle").textContent="SOLID + GRADIENT EDITORIAL";$("statusText").textContent="Solid colors + gradients only";applyZoom()}
function applyZoom(){$("posterGrid").style.transform=`scale(${zoom})`;$("zoomLabel").textContent=Math.round(zoom*100)+"%"}
["posterCount","designMode","shapeSize","density","gradientSoftness","spacing","textAmount","seed","format","quality","darkColor","lightColor"].forEach(id=>{$(id).addEventListener("input",()=>{updateOutputs();render()});$(id).addEventListener("change",()=>{updateOutputs();render()})})
$("regenerate").onclick=render;
$("randomize").onclick=()=>{$("seed").value=Math.floor(Math.random()*9999999)+1;$("shapeSize").value=70+Math.floor(Math.random()*60);$("density").value=5+Math.floor(Math.random()*11);$("gradientSoftness").value=45+Math.floor(Math.random()*56);$("spacing").value=10+Math.floor(Math.random()*51);render()};
$("downloadAll").onclick=()=>download("ali-studio-solid-gradient-editorial-collection.svg",makeCombinedSvg());
$("downloadJson").onclick=()=>download("ali-studio-solid-gradient-editorial-settings.json",JSON.stringify(state,null,2),"application/json");
$("zoomIn").onclick=()=>{zoom=clamp(zoom+.1,.5,1.8);applyZoom()};$("zoomOut").onclick=()=>{zoom=clamp(zoom-.1,.5,1.8);applyZoom()};
render();
})();