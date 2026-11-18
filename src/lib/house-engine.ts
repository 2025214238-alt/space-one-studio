import { def, definitionMap, type Definition } from './house-catalog';

export type Item={id:string;type:string;x:number;y:number;rotation:number;colors:[string,string];parentId?:string;wallId?:string;folded?:boolean};
export type Wall={id:string;x1:number;y1:number;x2:number;y2:number};
export type Opening={id:string;wallId:string;at:number;length:number;kind:'door'|'window'};
export type Zone={id:string;name:string;x:number;y:number;w:number;h:number};
export type Design={w:number;h:number;items:Item[];walls:Wall[];openings:Opening[];zones:Zone[]};
export type Project={version:2;mode:'free'|'class';stage:'design'|'redesign'|'complete';design:Design;first:Design|null;final:Design|null;mission:number|null;answers:string[];coach:string[];favorites:string[];recent:string[];legacyImported?:boolean};
export const STORE='ai-house-survival-v2';
export const sizes=[{name:'소형',w:32,h:30,area:60},{name:'중형',w:40,h:40,area:100},{name:'대형',w:48,h:50,area:150}];
export const uid=()=>crypto.randomUUID();
export const copy=<T,>(data:T):T=>structuredClone(data);
export function dimensions(f:Item){const d=def(f.type);return f.folded&&d.alternate?{w:d.alternate[0],h:d.alternate[1]}:{w:d.w,h:d.h};}
export function extent(f:Item){const d=dimensions(f);return f.rotation%180?{w:d.h,h:d.w}:d;}
export function rect(f:Item){return {x:f.x,y:f.y,...extent(f)};}
export function intersects(a:{x:number;y:number;w:number;h:number},b:{x:number;y:number;w:number;h:number}){return a.x<b.x+b.w-.001&&a.x+a.w>b.x+.001&&a.y<b.y+b.h-.001&&a.y+a.h>b.y+.001;}
export function wallsOf(d:Design):Wall[]{return [{id:'north',x1:0,y1:0,x2:d.w,y2:0},{id:'east',x1:d.w,y1:0,x2:d.w,y2:d.h},{id:'south',x1:0,y1:d.h,x2:d.w,y2:d.h},{id:'west',x1:0,y1:0,x2:0,y2:d.h},...d.walls];}
export function wallLength(w:Wall){return Math.abs(w.x2-w.x1)+Math.abs(w.y2-w.y1);}
export function wallPoint(w:Wall,at:number){return{x:w.x1+(w.x1===w.x2?0:at),y:w.y1+(w.y1===w.y2?0:at)};}
export function solidPieces(w:Wall,d:Design):Wall[]{let from=0;const pieces:Wall[]=[];for(const o of d.openings.filter(o=>o.wallId===w.id&&o.kind==='door').sort((a,b)=>a.at-b.at)) {if(o.at>from)pieces.push({...w,...{x1:wallPoint(w,from).x,y1:wallPoint(w,from).y,x2:wallPoint(w,o.at).x,y2:wallPoint(w,o.at).y}});from=o.at+o.length;}const end=wallLength(w);if(from<end)pieces.push({...w,x1:wallPoint(w,from).x,y1:wallPoint(w,from).y});return pieces;}
export function wallHits(f:Item,d:Design){const r=rect(f);return wallsOf(d).some(w=>solidPieces(w,d).some(p=>p.x1===p.x2?p.x1>r.x+.01&&p.x1<r.x+r.w-.01&&p.y1<r.y+r.h-.01&&p.y2>r.y+.01:p.y1>r.y+.01&&p.y1<r.y+r.h-.01&&p.x1<r.x+r.w-.01&&p.x2>r.x+.01));}
export function worldRect(f:Item,d:Design):{x:number;y:number;w:number;h:number;rotation:number}{
 const parent=d.items.find(p=>p.id===f.parentId);if(!parent)return {...rect(f),rotation:f.rotation};
 const p=worldRect(parent,d),base=dimensions(parent),r=rect(f);let x=r.x,y=r.y,w=r.w,h=r.h;
 switch(parent.rotation){case 90:[x,y,w,h]=[base.h-r.y-r.h,r.x,r.h,r.w];break;case 180:[x,y]=[base.w-r.x-r.w,base.h-r.y-r.h];break;case 270:[x,y,w,h]=[r.y,base.w-r.x-r.w,r.h,r.w];break;}
 return{x:p.x+x,y:p.y+y,w,h,rotation:(p.rotation+f.rotation)%360};
}
export function placementError(f:Item,d:Design):string|null{
 const spec=def(f.type),r=rect(f);
 if(f.parentId){const parent=d.items.find(p=>p.id===f.parentId);if(!parent||!def(parent.type).surface)return '먼저 물건을 올릴 책상·선반·조리대를 선택해 주세요.';const pd=def(parent.type),z=dimensions(parent);
  if(spec.mount!=='surface')return '이 가구는 바닥에 놓아 주세요.';
  if(spec.kitchenOnly&&pd.surface!=='kitchen')return '이 조리기구는 안전한 주방 조리대에만 놓을 수 있어요.';
  if(r.x<0||r.y<0||r.x+r.w>z.w||r.y+r.h>z.h)return '소품이 상판 밖으로 나가요. 더 넓은 받침 가구를 선택해 주세요.';
  if(pd.surfaceAreas&&!pd.surfaceAreas.some(a=>r.x>=a.x&&r.y>=a.y&&r.x+r.w<=a.x+a.w&&r.y+r.h<=a.y+a.h))return '이 부분은 물건을 놓는 상판이 아니에요. 비어 있는 작업 면에 놓아 주세요.';
  const siblings=d.items.filter(p=>p.parentId===f.parentId&&p.id!==f.id);
  if(siblings.length>=(pd.capacity||1))return '상판에 놓을 수 있는 개수를 채웠어요.';
  if(siblings.some(p=>intersects(r,rect(p))))return '상판 위의 다른 소품과 겹쳐요.';return null;
 }
 if(spec.mount==='surface')return '상판이 있는 가구를 선택한 뒤 소품을 놓아 주세요.';
 if(spec.mount==='wall'){const w=wallsOf(d).find(w=>w.id===f.wallId);if(!w)return '문이나 창문이 없는 벽을 눌러 설치해 주세요.';
  const horizontal=w.y1===w.y2,at=horizontal?f.x-w.x1:f.y-w.y1;
  if((horizontal&&(f.y!==w.y1||f.rotation!==0))||(!horizontal&&(f.x!==w.x1||f.rotation!==90)))return '벽 장식은 벽을 따라 놓아야 해요.';
  if(at<0||at+spec.w>wallLength(w))return '벽의 길이가 부족해요.';
  if(d.openings.some(o=>o.wallId===w.id&&at<o.at+o.length&&at+spec.w>o.at))return '문·창문 위에는 설치할 수 없어요.';
  if(d.items.some(i=>i.id!==f.id&&i.wallId===w.id&&(horizontal?intersects({x:at,y:0,w:spec.w,h:1},{x:i.x-w.x1,y:0,w:def(i.type).w,h:1}):intersects({x:at,y:0,w:spec.w,h:1},{x:i.y-w.y1,y:0,w:def(i.type).w,h:1}))))return '다른 벽 장식과 겹쳐요.';return null;
 }
 if(r.x<0||r.y<0||r.x+r.w>d.w||r.y+r.h>d.h)return '외벽 밖으로 나갈 수 없어요.';
 if(wallHits(f,d))return '벽을 가로질러 놓을 수 없어요. 문이나 방 안의 빈 공간을 찾아 주세요.';
 if(!spec.soft&&d.items.some(p=>p.id!==f.id&&!p.parentId&&def(p.type).mount==='floor'&&!def(p.type).soft&&intersects(r,rect(p))))return '다른 가구와 겹쳐요. 빈 공간을 찾아 주세요.';
 // 받침 크기를 바꿀 때도 소품이 밖으로 나가지 않게 해요.
 for(const child of d.items.filter(p=>p.parentId===f.id)){const c=rect(child),base=dimensions(f);if(c.x+c.w>base.w||c.y+c.h>base.h)return '위에 놓인 소품을 먼저 옮겨 주세요.';}
 return null;
}
export function descendants(id:string,items:Item[]):Set<string>{const result=new Set([id]);let changed=true;while(changed){changed=false;for(const i of items)if(i.parentId&&result.has(i.parentId)&&!result.has(i.id)){result.add(i.id);changed=true;}}return result;}
export function makeItem(type:string,x=0,y=0):Item {return {id:uid(),type,x,y,rotation:0,colors:[...def(type).colors]};}
export function findSpot(type:string,d:Design,parentId?:string):Item|null{
 const spec=def(type),f=makeItem(type);if(spec.mount==='surface'){
  const parents=parentId?d.items.filter(p=>p.id===parentId):d.items.filter(p=>!!def(p.type).surface);
  for(const p of parents){const base=dimensions(p);for(let y=0;y<base.h;y++)for(let x=0;x<base.w;x++){const n={...f,x,y,parentId:p.id};if(!placementError(n,d))return n;}}return null;
 }
 if(spec.mount==='wall'){for(const wall of wallsOf(d)){for(let at=0;at<=wallLength(wall)-spec.w;at++){const p=wallPoint(wall,at),n={...f,...p,rotation:wall.x1===wall.x2?90:0,wallId:wall.id};if(!placementError(n,d))return n;}}return null;}
 for(let y=1;y<=d.h-extent(f).h;y++)for(let x=1;x<=d.w-extent(f).w;x++){const n={...f,x,y};if(!placementError(n,d))return n;}return null;
}
export function snapWall(d:Design,x:number,y:number){return wallsOf(d).map(w=>({wall:w,dist:w.x1===w.x2?Math.abs(x-w.x1)+Math.max(0,w.y1-y,y-w.y2):Math.abs(y-w.y1)+Math.max(0,w.x1-x,x-w.x2),at:Math.round(w.x1===w.x2?y-w.y1:x-w.x1)})).sort((a,b)=>a.dist-b.dist)[0];}
export function openingRect(o:Opening,d:Design){const w=wallsOf(d).find(w=>w.id===o.wallId)!;const p=wallPoint(w,o.at);return w.x1===w.x2?{x:Math.max(0,p.x-2),y:p.y,w:Math.min(4,d.w),h:o.length}:{x:p.x,y:Math.max(0,p.y-2),w:o.length,h:Math.min(4,d.h)};}
export function pathReport(d:Design){
 const obstacles=d.items.filter(i=>!i.parentId&&def(i.type).mount==='floor'&&!def(i.type).soft), doors=d.openings.filter(o=>o.kind==='door');
 const blocked=doors.filter(o=>obstacles.some(i=>intersects(rect(i),openingRect(o,d))));
 const occupied=(x:number,y:number)=>obstacles.some(i=>intersects({x,y,w:2,h:2},rect(i)));
 const outer=doors.find(o=>['north','south','east','west'].includes(o.wallId));
 if(!outer)return{blocked,unreachable:d.zones.map(z=>z.name),reachable:[] as {x:number;y:number}[]};
 const r=openingRect(outer,d),start={x:Math.min(d.w-2,Math.max(0,Math.floor((r.x+r.w/2)/2)*2)),y:Math.min(d.h-2,Math.max(0,Math.floor((r.y+r.h/2)/2)*2))};
 const queue=[start],seen=new Set<string>();const solids=wallsOf(d).flatMap(w=>solidPieces(w,d));
 for(let k=0;k<queue.length;k++){const p=queue[k],key=`${p.x},${p.y}`;if(seen.has(key)||occupied(p.x,p.y))continue;seen.add(key);
  for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]]){const n={x:p.x+dx,y:p.y+dy};if(n.x<0||n.y<0||n.x+2>d.w||n.y+2>d.h||seen.has(`${n.x},${n.y}`))continue;
   const a={x:Math.min(p.x,n.x)+.01,y:Math.min(p.y,n.y)+.01,w:2+Math.abs(dx)-.02,h:2+Math.abs(dy)-.02};
   if(solids.some(w=>w.x1===w.x2?w.x1>a.x&&w.x1<a.x+a.w&&w.y1<a.y+a.h&&w.y2>a.y:w.y1>a.y&&w.y1<a.y+a.h&&w.x1<a.x+a.w&&w.x2>a.x))continue;queue.push(n);}
 }
 const reachable=[...seen].map(s=>{const [x,y]=s.split(',').map(Number);return{x,y};});
 return{blocked,reachable,unreachable:d.zones.filter(z=>!reachable.some(p=>p.x>=z.x&&p.y>=z.y&&p.x+2<=z.x+z.w&&p.y+2<=z.y+z.h)).map(z=>z.name)};
}
export function createDesign(w=40,h=40):Design{
 const split=14,bathY=h-12,kitchenY=14;
 const d:Design={w,h,items:[],walls:[{id:'left',x1:split,y1:0,x2:split,y2:h},{id:'bath',x1:0,y1:bathY,x2:split,y2:bathY},{id:'kitchen',x1:split,y1:kitchenY,x2:w,y2:kitchenY}],openings:[{id:'entry',wallId:'south',at:w-10,length:4,kind:'door'},{id:'bed-door',wallId:'left',at:12,length:4,kind:'door'},{id:'bath-door',wallId:'left',at:h-7,length:4,kind:'door'},{id:'kitchen-door',wallId:'kitchen',at:7,length:4,kind:'door'},{id:'win1',wallId:'north',at:3,length:6,kind:'window'},{id:'win2',wallId:'east',at:h-17,length:6,kind:'window'}],zones:[{id:'bedroom',name:'침실',x:0,y:0,w:split,h:bathY},{id:'bathroom',name:'욕실',x:0,y:bathY,w:split,h:12},{id:'kitchen-zone',name:'주방·식사',x:split,y:0,w:w-split,h:kitchenY},{id:'living',name:'거실',x:split,y:kitchenY,w:w-split,h:h-kitchenY}]};
 const fixed:[string,number,number][]=[['bed',2,2],['wardrobe',8,2],['studyDesk',2,12],['toilet',2,h-7],['basin',6,h-4],['shower',8,h-10],['counter',w-10,2],['fridge',w-5,7],['sink',w-10,7],['sofa',18,19],['coffeeTable',20,24],['diningTable',16,6],['plant',w-4,18]];
 for(const [type,x,y] of fixed){const n=makeItem(type,x,y);if(!placementError(n,d))d.items.push(n);}return d;
}
export function freshProject(mode:'free'|'class'='class',w=40,h=40):Project{return{version:2,mode,stage:'design',design:createDesign(w,h),first:null,final:null,mission:null,answers:['','','','',''],coach:[],favorites:[],recent:[]};}
const finite=(n:unknown)=>typeof n==='number'&&Number.isFinite(n)&&Number.isInteger(n);
function validateDesign(data:unknown):data is Design{
 if(!data||typeof data!=='object')return false;const d=data as Design;
 if(!finite(d.w)||!finite(d.h)||d.w<24||d.h<24||d.w>64||d.h>64||!Array.isArray(d.items)||d.items.length>1000||!Array.isArray(d.walls)||d.walls.length>150||!Array.isArray(d.openings)||d.openings.length>200||!Array.isArray(d.zones)||d.zones.length>100)return false;
 if(!d.items.every(i=>i&&typeof i.id==='string'&&i.id.length<100&&definitionMap.has(i.type)&&finite(i.x)&&finite(i.y)&&[0,90,180,270].includes(i.rotation)&&Array.isArray(i.colors)&&i.colors.length===2&&i.colors.every(c=>typeof c==='string'&&/^#[0-9a-fA-F]{6}$/.test(c))&&(!i.parentId||typeof i.parentId==='string')&&(i.folded===undefined||typeof i.folded==='boolean')))return false;
 if(new Set(d.items.map(i=>i.id)).size!==d.items.length)return false;
 if(!d.walls.every(w=>w&&typeof w.id==='string'&&![ 'north','south','east','west'].includes(w.id)&&[w.x1,w.x2,w.y1,w.y2].every(finite)&&w.x1>=0&&w.y1>=0&&w.x2<=d.w&&w.y2<=d.h&&w.x2>=w.x1&&w.y2>=w.y1&&((w.x1===w.x2)!==(w.y1===w.y2))))return false;
 if(new Set(d.walls.map(w=>w.id)).size!==d.walls.length)return false;
 if(!d.openings.every(o=>o&&typeof o.id==='string'&&['door','window'].includes(o.kind)&&finite(o.at)&&finite(o.length)&&o.at>=0&&o.length>=2&&wallsOf(d).some(w=>w.id===o.wallId&&o.at+o.length<=wallLength(w))))return false;
 if(new Set(d.openings.map(o=>o.id)).size!==d.openings.length||d.openings.some((o,i)=>d.openings.some((p,j)=>j>i&&p.wallId===o.wallId&&p.at<o.at+o.length&&p.at+p.length>o.at)))return false;
 if(!d.zones.every(z=>z&&typeof z.id==='string'&&typeof z.name==='string'&&z.name.length<61&&[z.x,z.y,z.w,z.h].every(finite)&&z.x>=0&&z.y>=0&&z.w>=1&&z.h>=1&&z.x+z.w<=d.w&&z.y+z.h<=d.h))return false;
 if(new Set(d.zones.map(z=>z.id)).size!==d.zones.length)return false;
 for(const i of d.items){if(i.parentId){const p=d.items.find(p=>p.id===i.parentId);if(!p||p.parentId)return false;}if(placementError(i,d))return false;}
 return true;
}
export function parseProject(raw:string):Project{
 if(raw.length>4_000_000)throw Error('파일이 너무 커요. 이 게임에서 저장한 설계 파일을 골라 주세요.');
 let p:Project;try{p=JSON.parse(raw);}catch{throw Error('파일을 읽을 수 없어요. 설계 저장 파일을 골라 주세요.');}
 if(!p||p.version!==2||!['free','class'].includes(p.mode)||!['design','redesign','complete'].includes(p.stage)||!validateDesign(p.design)||(p.first!==null&&!validateDesign(p.first))||(p.final!==null&&!validateDesign(p.final))||!(p.mission===null||Number.isInteger(p.mission)&&p.mission>=0&&p.mission<15)||!Array.isArray(p.answers)||p.answers.length!==5||!p.answers.every(a=>typeof a==='string'&&a.length<=5000)||!Array.isArray(p.coach)||p.coach.length>100||!p.coach.every(a=>typeof a==='string'&&a.length<=2000)||!Array.isArray(p.favorites)||!Array.isArray(p.recent)||![...p.favorites,...p.recent].every(t=>typeof t==='string'&&definitionMap.has(t)))throw Error('설계 파일의 내용이 올바르지 않아요. 현재 집은 그대로 유지했어요.');
 if(p.stage!=='design'&&(!p.first||p.mission===null||p.design.w!==p.first.w||p.design.h!==p.first.h))throw Error('최초 설계 기록과 면적이 맞지 않아요.');
 if(p.stage==='design'&&(p.first!==null||p.final!==null||p.mission!==null)||p.mode==='free'&&p.stage!=='design')throw Error('진행 단계와 설계 기록이 맞지 않아요.');
 if(p.final&&(!p.first||p.final.w!==p.first.w||p.final.h!==p.first.h))throw Error('완료 기록과 최초 설계의 면적이 맞지 않아요.');
 if(p.stage==='complete'&&!p.final)throw Error('완료된 재설계 기록이 없어요.');
 return p;
}
export function loadProject():{project:Project;error:string;legacy:boolean}{try{const stored=localStorage.getItem(STORE);if(stored)return{project:parseProject(stored),error:'',legacy:false};return{project:freshProject(),error:'',legacy:!!localStorage.getItem('space-one-v1')};}catch{return{project:freshProject(),error:'저장한 설계를 읽지 못했어요. 원본은 보존했어요. 파일로 불러오기를 이용해 주세요.',legacy:false};}}
export function changedItems(first:Design,current:Design){const before=new Map(first.items.map(i=>[i.id,i])),after=new Map(current.items.map(i=>[i.id,i]));return{added:current.items.filter(i=>!before.has(i.id)),removed:first.items.filter(i=>!after.has(i.id)),moved:current.items.filter(i=>{const old=before.get(i.id);if(!old)return false;const a=worldRect(old,first),b=worldRect(i,current);return a.x!==b.x||a.y!==b.y||a.rotation!==b.rotation||i.parentId!==old.parentId;}),styled:current.items.filter(i=>{const old=before.get(i.id);return old&&(i.folded!==old.folded||JSON.stringify(i.colors)!==JSON.stringify(old.colors));})};}
export function importLegacy(raw:string):Design{const old=JSON.parse(raw);if(!old||!Array.isArray(old.items))throw Error('이전 설계를 읽을 수 없어요.');const d:Design={w:40,h:40,items:[],walls:[],zones:[],openings:[{id:'entry',wallId:'south',at:26,length:4,kind:'door'}]};for(const i of old.items){if(!definitionMap.has(i.type))throw Error('이전 설계에 알 수 없는 가구가 있어요.');const n={...i,x:i.x+2,y:i.y+2};d.items.push(n);}if(!validateDesign(d))throw Error('이전 설계의 배치를 확인할 수 없어요. 원본은 보존했어요.');return d;}
export function surfaceName(d:Definition){return d.mount==='wall'?'벽 부착':d.mount==='surface'?'상판 소품':'바닥 가구';}
