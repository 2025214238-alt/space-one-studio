import { memo } from 'react';
export type FurnitureType = 'bed' | 'desk' | 'chair' | 'sofa' | 'fridge' | 'mirror' | 'speaker' | 'plant' | 'table' | 'shelf' | 'mat' | 'island';
export type Furniture = { id: string; type: FurnitureType; x: number; y: number; rotation: number; colors: [string, string] };
export const catalog: { type: FurnitureType; name: string; category: string; w: number; h: number; parts: [string, string]; colors: [string,string] }[] = [
  { type:'bed', name:'포근한 싱글 침대', category:'침실', w:5, h:7, parts:['프레임','침구'], colors:['#C6A889','#B5CEBA'] },
  { type:'desk', name:'우드 데스크', category:'침실', w:6, h:3, parts:['상판','프레임'], colors:['#CFB798','#94795D'] },
  { type:'chair', name:'데일리 체어', category:'거실', w:2, h:2, parts:['프레임','방석'], colors:['#B79A79','#E3B08C'] },
  { type:'sofa', name:'모듈 패브릭 소파', category:'거실', w:7, h:3, parts:['프레임','쿠션'], colors:['#6F8A70','#A4BA9B'] },
  { type:'fridge', name:'미니멀 냉장고', category:'주방', w:3, h:3, parts:['본체','도어'], colors:['#9AA7A3','#E1E7E3'] },
  { type:'plant', name:'초록 한 포트', category:'거실', w:2, h:2, parts:['화분','잎'], colors:['#C4A58B','#76926B'] },
  { type:'table', name:'라운드 사이드 테이블', category:'거실', w:2, h:2, parts:['상판','테두리'], colors:['#D9C4A4','#B59875'] },
  { type:'shelf', name:'오픈 수납장', category:'침실', w:4, h:2, parts:['프레임','선반'], colors:['#AC937B','#D6C1A2'] },
  { type:'mirror', name:'대형 거울 파티션', category:'전용', w:6, h:1, parts:['프레임','거울'], colors:['#AF9D8B','#C2DAD9'] },
  { type:'speaker', name:'연습용 스피커', category:'전용', w:2, h:2, parts:['본체','유닛'], colors:['#444B4A','#82908B'] },
  { type:'mat', name:'스트레칭 매트', category:'전용', w:3, h:6, parts:['매트','테두리'], colors:['#C7B3CF','#9988A3'] },
  { type:'island', name:'아일랜드 작업대', category:'전용', w:5, h:3, parts:['상판','프레임'], colors:['#E1D8C7','#A2B9AC'] },
];
export const spec = (type: FurnitureType) => catalog.find(f => f.type === type)!;
export const size = (f: Furniture) => { const d = spec(f.type); return f.rotation % 180 ? {w:d.h,h:d.w} : {w:d.w,h:d.h}; };
export function overlaps(a: {x:number;y:number;w:number;h:number}, b: {x:number;y:number;w:number;h:number}) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
export const initial: Furniture[] = [
  {id:'bed-1',type:'bed',x:2,y:1,rotation:0,colors:['#C6A889','#B5CEBA']},
  {id:'desk-1',type:'desk',x:12,y:1,rotation:0,colors:['#CFB798','#94795D']},
  {id:'chair-1',type:'chair',x:14,y:5,rotation:0,colors:['#B79A79','#E3B08C']},
  {id:'sofa-1',type:'sofa',x:11,y:11,rotation:0,colors:['#6F8A70','#A4BA9B']},
  {id:'table-1',type:'table',x:14,y:8,rotation:0,colors:['#D9C4A4','#B59875']},
  {id:'plant-1',type:'plant',x:1,y:10,rotation:0,colors:['#C4A58B','#76926B']},
];
export const FurnitureArt = memo(function FurnitureArt({type, colors, uid='art'}: {type:FurnitureType; colors:[string,string];uid?:string}) {
 const d=spec(type), w=d.w*40, h=d.h*40, [a,b]=colors;
 const stroke='#685F514D';
 return <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" overflow="visible" aria-hidden="true">
  <defs><filter id={`shadow-${uid}`} x="-30%" y="-30%" width="170%" height="180%"><feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#344E3E" floodOpacity=".14" /></filter></defs>
  <g filter={`url(#shadow-${uid})`} stroke={stroke} strokeWidth="2" strokeLinejoin="round">
  {type==='bed' && <><rect x="3" y="3" width={w-6} height={h-6} rx="8" fill={a}/><rect x="12" y="18" width={w-24} height={h-28} rx="7" fill="#F4F1E9"/><rect x="20" y="29" width="73" height="49" rx="9" fill="#FFFCF5"/><rect x="107" y="29" width="73" height="49" rx="9" fill="#FFFCF5"/><path d={`M12 96 Q100 87 188 96 V${h-17} Q100 ${h-10} 12 ${h-17}Z`} fill={b}/><path d="M14 108 Q100 101 186 108" fill="none" stroke="#FFFFFF75" strokeWidth="8"/><path d={`M26 126 V${h-32} M175 126 V${h-32}`} opacity=".15"/></>}
  {type==='desk' && <><rect x="13" y="9" width={w-26} height={h-7} rx="4" fill={b}/><rect x="2" y="2" width={w-4} height={h-15} rx="7" fill={a}/><path d={`M15 18 H${w-15} M15 24 H${w-15}`} opacity=".16"/><rect x="86" y="18" width="76" height="45" rx="3" fill="#64756E"/><rect x="91" y="22" width="66" height="35" rx="2" fill="#C8D8D0"/><path d="M123 63 V72 M109 73 H137" stroke="#6F796E" strokeWidth="4"/><rect x="90" y="81" width="65" height="13" rx="3" fill="#EEEDE4"/><rect x="20" y="59" width="36" height="41" rx="3" fill="#EEE9DC" transform="rotate(-7 38 80)"/><path d="M28 70 H46 M28 78 H43" opacity=".25"/><circle cx="201" cy="74" r="13" fill="#F7F3E7"/><circle cx="201" cy="74" r="8" fill="#A48B6D"/></>}
  {type==='chair' && <><rect x="8" y="8" width="64" height="62" rx="14" fill={a}/><rect x="15" y="27" width="50" height="44" rx="14" fill={b}/><rect x="7" y="3" width="66" height="21" rx="9" fill={a}/><path d="M15 11 H65" stroke="#FFFFFF55"/><path d="M9 38 V61 M71 38 V61" stroke={a} strokeWidth="9"/></>}
  {type==='sofa' && <><rect x="10" y="10" width={w-20} height={h-15} rx="13" fill={a}/><rect x="26" y="25" width="110" height="79" rx="12" fill={b}/><rect x="143" y="25" width="110" height="79" rx="12" fill={b}/><rect x="17" y="5" width={w-34} height="32" rx="12" fill={a}/><rect x="3" y="17" width="28" height="94" rx="10" fill={a}/><rect x={w-31} y="17" width="28" height="94" rx="10" fill={a}/><rect x="39" y="44" width="39" height="40" rx="8" fill="#DFDAC4" transform="rotate(-12 58 64)"/><rect x="201" y="45" width="35" height="38" rx="8" fill="#E7D8BB" transform="rotate(13 220 64)"/></>}
  {type==='fridge' && <><rect x="5" y="4" width={w-10} height={h-8} rx="9" fill={a}/><rect x="10" y="8" width={w-20} height={h-22} rx="6" fill={b}/><path d={`M12 47 H${w-12}`} /><path d="M22 59 V85 M22 20 V36" stroke={a} strokeWidth="5"/></>}
  {type==='plant' && <><circle cx="40" cy="42" r="29" fill={a}/><circle cx="40" cy="42" r="22" fill="#897C60"/>{[0,60,120,180,240,300].map(r=><ellipse key={r} cx="40" cy="23" rx="12" ry="23" fill={b} transform={`rotate(${r} 40 40)`}/>)}<circle cx="40" cy="40" r="9" fill="#8CA778"/></>}
  {type==='table' && <><circle cx="40" cy="40" r="37" fill={b}/><circle cx="40" cy="38" r="33" fill={a}/><path d="M18 29 Q40 22 64 30 M17 39 Q38 31 65 40" opacity=".18"/><rect x="25" y="24" width="27" height="31" rx="2" fill="#ECE6D9" transform="rotate(-15 38 40)"/><circle cx="49" cy="47" r="11" fill="#F7F3E7"/><circle cx="49" cy="47" r="7" fill="#B29C7B"/></>}
  {type==='mirror' && <><rect x="2" y="2" width={w-4} height={h-4} rx="5" fill={a}/><rect x="9" y="8" width={w-18} height={h-16} rx="2" fill={b}/><path d="M30 31 L65 9 M50 31 L85 9 M170 31 L200 9" stroke="#FFFFFFAA" strokeWidth="5"/></>}
  {type==='speaker' && <><rect x="5" y="3" width="70" height="74" rx="6" fill={a}/><circle cx="40" cy="49" r="23" fill={b}/><circle cx="40" cy="49" r="12" fill={a}/><circle cx="40" cy="16" r="7" fill={b}/></>}
  {type==='shelf' && <><rect x="3" y="3" width={w-6} height={h-6} rx="4" fill={a}/>{[0,1,2].map(i=><g key={i}><rect x={10+i*49} y="10" width="42" height="57" rx="2" fill={b}/><path d={`M${20+i*49} 18 v40 M${29+i*49} 15 v43 M${39+i*49} 21 v37`} stroke={['#97AEA2','#D9BEA4','#A7B5BB'][i]} strokeWidth="7"/></g>)}</>}
  {type==='mat' && <><rect x="3" y="3" width={w-6} height={h-6} rx="12" fill={b}/><rect x="9" y="10" width={w-18} height={h-20} rx="8" fill={a}/>{Array.from({length:14},(_,i)=><path key={i} d={`M20 ${25+i*14} H100`} opacity=".1"/>)}</>}
  {type==='island' && <><rect x="8" y="8" width={w-16} height={h-10} rx="4" fill={b}/><rect x="2" y="2" width={w-4} height={h-16} rx="6" fill={a}/><rect x="18" y="18" width="66" height="65" rx="8" fill="#B3BEB8"/><circle cx="51" cy="51" r="10" fill="#869A90"/><path d="M100 22 H177 M100 33 H177" opacity=".18"/></>}
  </g>
 </svg>;
});
