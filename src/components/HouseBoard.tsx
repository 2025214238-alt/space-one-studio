import { memo, useMemo, type PointerEvent as PEvent, type Ref } from 'react';
import { HouseArt } from './HouseArt';
import { def } from '../lib/house-catalog';
import { dimensions, extent, placementError, solidPieces, wallsOf, wallPoint, openingRect, worldRect, type Design, type Item, type Wall } from '../lib/house-engine';

type Props={design:Design;selected?:string|null;ghost?:Item|null;grid?:boolean;paths?:boolean;reachable?:{x:number;y:number}[];blocked?:string[];prefix:string;onItem?:(e:PEvent<SVGGElement>,f:Item)=>void;onBoard?:(e:PEvent<SVGSVGElement>)=>void;onSelect?:(id:string)=>void;sketch?:Wall|null;emphasis?:'mission';ref?:Ref<SVGSVGElement>};
export const HouseBoard=memo(function HouseBoard({design:d,selected,ghost,grid=true,paths=false,reachable=[],blocked=[],prefix,onItem,onBoard,onSelect,sketch,emphasis,ref}:Props){
 const byParent=useMemo(()=>{const map=new Map<string,Item[]>();for(const i of d.items)if(i.parentId){const list=map.get(i.parentId)||[];list.push(i);map.set(i.parentId,list);}return map;},[d.items]);
 const renderItem=(f:Item,preview=false)=>{const base=dimensions(f),z=extent(f),chosen=selected===f.id&&!preview;const children=byParent.get(f.id)||[];
  return <g key={preview?'ghost':f.id} transform={`translate(${f.x} ${f.y})`} data-furniture={preview?'preview':f.id} data-type={f.type} role={onItem?'button':undefined} tabIndex={onItem&&!preview?0:undefined} aria-label={onItem?`${def(f.type).name} 선택`:undefined} onPointerDown={onItem&&!preview?e=>{e.stopPropagation();onItem(e,f);}:undefined} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect?.(f.id);}}} style={{cursor:onItem?'grab':'default'}}>
   {chosen&&<rect x="-.25" y="-.25" width={z.w+.5} height={z.h+.5} fill="#33826A15" stroke="#20765C" strokeWidth=".12" strokeDasharray=".3 .2"/>}
   {preview&&<rect x="-.12" y="-.12" width={z.w+.24} height={z.h+.24} fill={placementError(f,d)?'#DF665678':'#64B99078'} stroke={placementError(f,d)?'#B54136':'#287E5B'} strokeWidth=".16"/>}
   <g transform={`translate(${z.w/2} ${z.h/2}) rotate(${f.rotation}) translate(${-base.w/2} ${-base.h/2})`}>
    <rect x=".1" y=".18" width={base.w} height={base.h} rx=".16" fill="#4B584C" opacity=".12"/>
    <svg width={base.w} height={base.h} overflow="visible"><HouseArt type={f.type} colors={f.colors} uid={`${prefix}-${f.id}${preview?'-ghost':''}`}/></svg>
    {chosen&&def(f.type).surface&&(def(f.type).surfaceAreas||[{x:0,y:0,...base}]).map((a,i)=><g key={i} pointerEvents="none"><rect x={a.x+.08} y={a.y+.08} width={a.w-.16} height={a.h-.16} fill="#4F9E7716" stroke="#F8FFF4" strokeWidth=".065" strokeDasharray=".15 .12"/><text x={a.x+.2} y={a.y+.5} fill="#23563A" stroke="#F5F7E9" strokeWidth=".025" paintOrder="stroke" fontSize=".4">상판</text></g>)}
    {children.map(c=>renderItem(c))}
   </g>
   {f.folded&&<path d={`M.1 ${z.h-.2}h${Math.min(z.w,2)}`} stroke="#2B6F62" strokeWidth=".16" strokeDasharray=".2 .1"/>}
  </g>;
 };
 return <svg ref={ref} className="hs-house" viewBox={`-3 -3 ${d.w+6} ${d.h+6}`} aria-label={`${d.w*.25}미터 × ${d.h*.25}미터 주택 설계`} onPointerDown={onBoard}>
  <defs><pattern id={`${prefix}-grid`} width="1" height="1" patternUnits="userSpaceOnUse"><path d="M1 0H0V1" fill="none" stroke="#BDCCBC" strokeWidth=".035"/></pattern><pattern id={`${prefix}-wood`} width="4" height="2" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#EBDCC5"/><path d="M0 2H4M0 0V2M2 0H3.4" fill="none" stroke="#C1AB8B" strokeWidth=".025"/></pattern><pattern id={`${prefix}-tile`} width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#D9E7E3"/><path d="M2 0H0V2" fill="none" stroke="#ACCCC5" strokeWidth=".045"/></pattern></defs>
  <rect x="-.5" y="-.25" width={d.w+1} height={d.h+1} rx=".3" fill="#8E9D8A" opacity=".18" transform="translate(.4 .6)"/>
  <rect width={d.w} height={d.h} fill={`url(#${prefix}-wood)`}/>
  {d.zones.map((z,i)=><g key={z.id}><rect x={z.x} y={z.y} width={z.w} height={z.h} fill={z.name.includes('욕실')||z.name.includes('화장')?`url(#${prefix}-tile)`:['#F5EFDC20','#D7E6DF50','#EFE7D470','#FCF9F020'][i%4]}/>{!onItem&&<rect x={z.x} y={z.y} width={z.w} height={z.h} fill="none" stroke="#61796422" strokeWidth=".07"/>}</g>)}
  {grid&&<rect width={d.w} height={d.h} fill={`url(#${prefix}-grid)`} pointerEvents="none"/>}
  {paths&&reachable.map(p=><rect key={`${p.x}-${p.y}`} x={p.x+.15} y={p.y+.15} width="1.7" height="1.7" rx=".25" fill="#3E9B7520" pointerEvents="none"/>)}
  {d.zones.map(z=><text key={z.id} x={z.x+1} y={z.y+z.h-1} fontSize=".65" fill="#506658" opacity=".85" pointerEvents="none">{z.name}</text>)}
  {d.items.filter(i=>!i.parentId&&def(i.type).soft).map(i=>renderItem(i))}
  {d.items.filter(i=>!i.parentId&&!def(i.type).soft&&def(i.type).mount!=='wall').map(i=>renderItem(i))}
  {wallsOf(d).map(w=><g key={w.id}>{solidPieces(w,d).map((p,i)=><g key={i}><path d={`M${p.x1} ${p.y1+.1}L${p.x2} ${p.y2+.1}`} stroke="#7F8A7833" strokeWidth=".7"/><path d={`M${p.x1} ${p.y1}L${p.x2} ${p.y2}`} stroke={['north','south','east','west'].includes(w.id)?'#8B927B':'#9DA78F'} strokeWidth=".4" strokeLinecap="square"/><path d={`M${p.x1} ${p.y1-.1}L${p.x2} ${p.y2-.1}`} stroke="#F6F2DE" strokeWidth=".12"/></g>)}</g>)}
  {d.openings.map(o=>{const w=wallsOf(d).find(w=>w.id===o.wallId);if(!w)return null;const p=wallPoint(w,o.at),vertical=w.x1===w.x2,alert=blocked.includes(o.id);return <g key={o.id} transform={`translate(${p.x} ${p.y}) rotate(${vertical?90:0})`}>
   {o.kind==='window'?<><rect x=".1" y="-.22" width={o.length-.2} height=".44" fill="#AED2D8" stroke="#789D9E" strokeWidth=".08"/><path d={`M${o.length/2} -.2v.4 M.2 0H${o.length-.2}`} stroke="#F5FAF6" strokeWidth=".08"/></>:<><path d={`M0 0V${-o.length}A${o.length} ${o.length} 0 0 1 ${o.length} 0`} fill="#F5F2DF33" stroke={alert?'#BA5543':'#BCA17A'} strokeWidth=".065" strokeDasharray=".2 .1"/><path d={`M0 0V${-o.length}`} stroke="#A9906C" strokeWidth=".14"/>{(paths||alert)&&<rect x="0" y="-2" width={o.length} height="4" fill={alert?'#E05C4450':'#3A967C25'} pointerEvents="none"/>}</>}
  </g>;})}
  {d.items.filter(i=>!i.parentId&&def(i.type).mount==='wall').map(i=>renderItem(i))}
  {ghost&&(()=>{const r=worldRect(ghost,d);return <g pointerEvents="none" transform={`translate(${r.x} ${r.y})`}><rect width={r.w} height={r.h} fill={placementError(ghost,d)?'#DF665678':'#64B99078'} stroke={placementError(ghost,d)?'#B54136':'#287E5B'} strokeWidth=".16"/><g transform={`translate(${r.w/2} ${r.h/2}) rotate(${r.rotation}) translate(${-dimensions(ghost).w/2} ${-dimensions(ghost).h/2})`}><svg width={dimensions(ghost).w} height={dimensions(ghost).h} opacity=".75"><HouseArt type={ghost.type} colors={ghost.colors} uid="ghost"/></svg></g></g>;})()}
  {sketch&&<path d={`M${sketch.x1} ${sketch.y1}L${sketch.x2} ${sketch.y2}`} stroke="#247763" strokeWidth=".3" strokeDasharray=".35 .15" pointerEvents="none"/>}
  {emphasis==='mission'&&d.openings.filter(o=>blocked.includes(o.id)).map(o=>{const r=openingRect(o,d);return <rect key={o.id} {...r} fill="#D95A4438" stroke="#C45740" strokeWidth=".12" pointerEvents="none"/>;})}
  <g stroke="#81937C" strokeWidth=".04" fill="none"><path d={`M0 -1.4H${d.w} M0 -1.7V-1.1 M${d.w} -1.7V-1.1 M-1.4 0V${d.h}`}/></g><text x={d.w/2} y="-1.7" textAnchor="middle" fontSize=".7" fill="#61715F">{d.w*.25}m × {d.h*.25}m</text>
 </svg>;
});
