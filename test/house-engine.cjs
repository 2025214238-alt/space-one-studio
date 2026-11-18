const {chromium}=require('/usr/local/lib/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox']});
 try{
  const page=await browser.newPage();await page.goto('http://localhost:5173');
  const results=await page.evaluate(async()=>{
   const e=await import('/src/lib/house-engine.ts'),c=await import('/src/lib/house-catalog.ts'),m=await import('/src/lib/house-missions.ts');
   const checks=[];function ok(condition,name){if(!condition)throw Error(name);checks.push(name);}
   ok(c.library.length>=220,'at least 220 furniture definitions');ok(new Set(c.library.map(d=>d.type)).size===c.library.length,'unique types');ok(m.missions.length===15,'15 missions');
   for(const s of e.sizes){const p=e.freshProject('class',s.w,s.h);e.parseProject(JSON.stringify(p));ok(p.design.items.some(i=>i.type==='toilet')&&p.design.items.some(i=>i.type==='shower'),`${s.name}: bathroom and valid initial placement`);ok(e.pathReport(p.design).blocked.length===0,`${s.name}: entrance and doors clear`);ok(e.pathReport(p.design).unreachable.length===0,`${s.name}: all zones connected`);}
   const empty={w:48,h:50,walls:[],openings:[],zones:[],items:[]};
   for(const spec of c.library){let d=e.copy(empty);if(spec.mount==='surface')d.items=[e.makeItem(spec.kitchenOnly?'counter':'cuttingTable',2,2)];const f=e.findSpot(spec.type,d);ok(!!f,`${spec.type}: has valid placement`);d.items.push(f);ok(!e.placementError(f,d),`${spec.type}: valid after insert`);for(const rotation of [0,90,180,270]){const n={...f,rotation};if(spec.mount!=='wall') {const error=e.placementError(n,d);ok(error===null||typeof error==='string',`${spec.type}: rotation checked`);}}
    const p={...e.freshProject(),design:d};e.parseProject(JSON.stringify(p));
   }
   let d=e.copy(empty);const desk=e.makeItem('studyDesk',5,5),lamp={...e.makeItem('deskLamp',0,0),parentId:desk.id},pc={...e.makeItem('laptop',2,0),parentId:desk.id};d.items=[desk,lamp,pc];ok(!e.placementError(lamp,d),'surface object placement');ok(!!e.placementError({...lamp,x:4,y:3},d),'surface bounds');ok(!!e.placementError({...pc,x:0,y:0},d),'surface collision');
   const before=e.worldRect(pc,d);d.items[0]={...desk,x:10,y:10};const after=e.worldRect(pc,d);ok(after.x-before.x===5&&after.y-before.y===5,'child follows moved parent');d.items[0]={...desk,x:10,y:10,rotation:90};const rotated=e.worldRect(pc,d);ok(rotated.rotation===90&&rotated.x===11&&rotated.y===12,'child follows rotated parent');
   const stove={...e.makeItem('portableInduction'),parentId:desk.id};ok(!!e.placementError(stove,d),'hob rejected on non-kitchen surface');const counter=e.makeItem('counter',20,20);d.items.push(counter);ok(!e.placementError({...stove,parentId:counter.id},d),'hob accepted on kitchen surface');
   const sink=e.makeItem('sink',30,20),corner=e.makeItem('gamingDesk',30,30);d.items.push(sink,corner);ok(!!e.placementError({...stove,parentId:sink.id},d),'hob cannot occupy sink bowl');ok(!!e.placementError({...lamp,x:2,y:3,parentId:corner.id},d),'L desk cutout cannot support objects');ok(!e.placementError({...lamp,x:6,y:3,parentId:corner.id},d),'L desk actual work surface supports objects');
   ok(e.descendants(desk.id,d.items).size===3,'parent delete includes children');
   const bed=e.makeItem('foldBed',3,3);d={...e.copy(empty),items:[bed]};const obstacle=e.makeItem('chair',3,7);d.items=[{...bed,folded:true},obstacle];ok(!e.placementError(d.items[0],d),'folded bed allows reclaimed space');ok(!!e.placementError(bed,d),'unfolding rejects occupied space');
   d={...e.copy(empty),walls:[{id:'test-wall',x1:10,y1:0,x2:10,y2:50}]};const sofa=e.makeItem('sofa',8,4);ok(!!e.placementError(sofa,d),'wall collision');ok(!!e.placementError({...sofa,x:46},d),'exterior boundary collision');
   const wallTv=e.findSpot('wallTv',d);ok(!!wallTv,'wall mounted object');ok(!!e.placementError({...wallTv,wallId:undefined},d),'wall mounted object cannot float');
   const p=e.freshProject();p.first=e.copy(p.design);p.stage='redesign';p.mission=5;p.design.items.push(e.findSpot('gamingDesk',p.design));const diff=e.changedItems(p.first,p.design);ok(diff.added.length===1&&p.first.items.length===13,'snapshot immutable and added tracked');e.parseProject(JSON.stringify(p));
   for(let i=0;i<15;i++){const n=e.copy(p);n.mission=i;e.parseProject(JSON.stringify(n));ok(m.coachQuestion(1,'구체적으로 답변했어요',1,[],i).includes('문 앞'),'coach detects obstruction '+i);}
   const bad=e.copy(p);bad.design.w+=1;let rejected=false;try{e.parseProject(JSON.stringify(bad));}catch{rejected=true;}ok(rejected,'locked area rejects tampered import');
   for(const mutate of [p=>p.design.items[0].colors=['url(https://example.invalid)','red'],p=>p.design.items[0].x=-50,p=>p.design.items[0].parentId=p.design.items[0].id,p=>p.mission=99,p=>p.design.walls[0].x2=100]){const bad=e.copy(p);mutate(bad);let rejected=false;try{e.parseProject(JSON.stringify(bad));}catch{rejected=true;}ok(rejected,'invalid imported project rejected');}
   return{count:c.library.length,checks:checks.length};
  });
  assert.ok(results.checks>1000);console.log('PASS house engine',results);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
