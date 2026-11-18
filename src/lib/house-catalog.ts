import { catalog as originalCatalog } from './furniture';

export type Mount = 'floor'|'surface'|'wall';
export type Definition = { type:string; name:string; category:string; w:number; h:number; art:string; mount:Mount; colors:[string,string]; parts:[string,string]; surface?:'general'|'kitchen'; surfaceAreas?:{x:number;y:number;w:number;h:number}[]; capacity?:number; kitchenOnly?:boolean; alternate?:[number,number]; tags:string[]; soft?:boolean };
// 25cm 한 칸. 색상 변형은 별도 종류로 세지 않아요.
type Row = [string,string,number,number,string,Mount?,string?];
const groups: [string,Row[]][] = [
 ['침실',[
 ['superSingle','슈퍼싱글 침대',5,8,'bed'],['doubleBed','더블 침대',6,8,'bed'],['queenBed','퀸 침대',6,9,'bed'],['kingBed','킹사이즈 침대',8,9,'bed'],['loftBed','책상형 벙커 침대',5,8,'loft'],['foldBed','접이식 침대',4,8,'bed'],['sofaBed','펼치는 소파베드',6,7,'sofa'],['mattress','바닥 매트리스',4,8,'mattress'],['wallBed','벽면 수납 침대',5,8,'bed'],['trundle','슬라이딩 침대',5,8,'bed'],['crib','아기 침대',3,5,'crib'],['builtCloset','대형 붙박이장',10,3,'cabinet'],['mobileCloset','이동식 옷장',4,2,'rack'],['lowDresser','낮은 와이드 서랍장',6,2,'cabinet'],['jewelryVanity','코너 화장대',3,3,'vanity'],['floorMirror','타원 전신거울',2,2,'mirror'],['bedLamp','침대 독서 조명',1,1,'lamp','surface'],['pillow','베개 쿠션',2,1,'pillow','surface'],['duvet','접은 침구',2,2,'linen','surface'],['underBox','침대 밑 수납함',3,2,'box'],['bedBench','침실 풋 벤치',5,2,'bench'],
 ]],
 ['거실',[
 ['sofa3','3인 와이드 소파',9,4,'sofa'],['cornerSofa','코너형 소파',9,7,'corner'],['recliner','발받침 리클라이너',4,5,'armchair'],['beanbag','빈백 소파',4,4,'beanbag'],['tv','스탠드 TV',5,1,'monitor','surface'],['wallTv','벽걸이 TV',6,1,'monitor','wall'],['projector','빔프로젝터',2,2,'projector','surface'],['screen','프로젝터 스크린',7,1,'screen','wall'],['glassCabinet','유리 장식장',5,2,'display'],['roomDivider','패브릭 파티션',6,1,'divider'],['airCleaner','공기청정기',2,2,'air'],['humidifier','가습기',1,1,'vase','surface'],['fan','선풍기',2,2,'fan'],['aircon','스탠드 에어컨',2,2,'air'],['wallAircon','벽걸이 에어컨',4,1,'air','wall'],['floorLamp','장스탠드',2,2,'lamp'],['largePlant','대형 몬스테라',3,3,'plant'],['roundRug','원형 러그',6,6,'rug'],['longRug','복도 러너 러그',3,10,'rug'],['footstool','발받침 오토만',3,2,'pillow'],['nestTable','네스팅 테이블',3,3,'roundTable'],['magazineRack','잡지 꽂이',2,2,'books'],
 ]],
 ['주방',[
 ['doubleFridge','양문형 냉장고',4,3,'fridge'],['kimchiFridge','뚜껑형 김치냉장고',4,3,'chest'],['freezer','독립형 냉동고',3,3,'fridge'],['smallFridge','초소형 냉장고',2,2,'fridge'],['counter','긴 주방 조리대',7,3,'counter'],['cornerCounter','코너 주방 하부장',4,4,'counter'],['upperCabinet','주방 상부장',5,1,'cabinet','wall'],['lowerCabinet','주방 하부 수납장',4,3,'cabinet'],['gasHob','3구 가스레인지',3,2,'hob','surface','kitchen'],['portableInduction','상판용 인덕션',2,2,'hob','surface','kitchen'],['microwave','전자레인지',2,2,'microwave','surface'],['airFryer','에어프라이어',2,2,'fryer','surface'],['riceCooker','전기밥솥',2,2,'cooker','surface'],['coffeeMachine','에스프레소 머신',2,2,'coffee','surface'],['toaster','팝업 토스터',2,1,'toaster','surface'],['blender','믹서기',1,2,'blender','surface'],['waterPurifier','정수기',2,2,'water','surface'],['dishwasher','빌트인 식기세척기',3,3,'dishwasher'],['dishRack','식기 건조대',2,2,'dishrack','surface'],['pot','뚜껑 냄비',2,2,'pot','surface','kitchen'],['pan','프라이팬',2,1,'pan','surface','kitchen'],['utensil','조리도구 꽂이',1,1,'utensil','surface'],['plates','포개 놓은 접시',1,1,'plates','surface'],['spice','향신료 선반',3,1,'spice','wall'],['kitchenCart','바퀴 달린 주방 카트',3,2,'cart'],['rangeHood','주방 후드',4,2,'hood','wall'],['cuttingBoard','원목 도마',2,1,'board','surface','kitchen'],['fruitBowl','과일 바구니',2,2,'fruit','surface'],
 ]],
 ['식사',[
 ['table2','2인 정사각 식탁',3,3,'dining'],['table6','6인 식탁',8,4,'dining'],['table8','8인 롱테이블',10,4,'dining'],['roundDining','원형 다이닝 식탁',5,5,'roundTable'],['foldTable','접이식 식탁',5,4,'dining'],['extendTable','확장형 식탁',8,4,'dining'],['barTable','슬림 바 테이블',7,2,'counter'],['diningChair','등받이 식탁 의자',2,2,'chair'],['diningBench','3인 다이닝 벤치',6,2,'bench'],['highChair','유아 식탁 의자',2,2,'chair'],['servingTray','서빙 트레이',2,1,'tray','surface'],['teaSet','티포트와 찻잔',2,2,'tea','surface'],
 ]],
 ['욕실·세탁',[
 ['toilet','양변기',2,3,'toilet'],['basin','세면대와 수전',3,2,'basin'],['bathtub','독립형 욕조',4,7,'bathtub'],['shower','유리 샤워부스',4,4,'shower'],['showerHead','벽 샤워기',2,1,'showerhead','wall'],['bathMirror','욕실 원형 거울',3,1,'mirror','wall'],['bathCabinet','욕실 수납장',3,2,'cabinet'],['towelRack','수건걸이',3,1,'towel','wall'],['paperRoll','휴지걸이',1,1,'paper','wall'],['bathShelf','욕실 코너 선반',2,1,'shelf','wall'],['dryer','의류 건조기',3,3,'washer'],['laundryBasket','세탁 바구니',2,2,'basket'],['bathMat','욕실 발매트',3,2,'rug'],['cleanTools','청소도구 보관대',2,2,'clean'],['mop','밀대 거치대',1,2,'mop'],['towels','접은 수건',2,1,'linen','surface'],['soap','비누와 디스펜서',1,1,'soap','surface'],['dryingRack','접이식 빨래 건조대',5,3,'dryrack'],
 ]],
 ['학습·업무',[
 ['studyDesk','빈 상판 공부 책상',5,3,'desk'],['computerDesk','컴퓨터용 넓은 책상',7,3,'desk'],['standingDesk','전동 높이 조절 책상',6,3,'desk'],['studyChair','스터디 체어',2,2,'chair'],['kneelingChair','자세 교정 의자',2,3,'chair'],['laptop','노트북',2,2,'laptop','surface'],['desktop','데스크톱 본체',1,2,'pc','surface'],['monitor','싱글 모니터',2,1,'monitor','surface'],['dualMonitor','듀얼 모니터',4,1,'dual','surface'],['keyboard','키보드',2,1,'keyboard','surface'],['mouse','마우스 패드',1,1,'mouse','surface'],['printer','복합기 프린터',2,2,'printer','surface'],['fileCabinet','서류 수납장',3,2,'cabinet'],['bookRest','각도 조절 독서대',2,2,'bookrest','surface'],['deskLamp','관절형 스탠드',1,1,'lamp','surface'],['tablet','태블릿',1,2,'tablet','surface'],['phoneStand','휴대폰 거치대',1,1,'phone','surface'],['charger','무선 충전 패드',1,1,'charger','surface'],['noticeBoard','코르크 게시판',4,1,'notice','wall'],['whiteboard','화이트보드',5,1,'whiteboard','wall'],['books','책 묶음',2,1,'books','surface'],['deskOrganizer','문구 정리함',1,1,'utensil','surface'],
 ]],
 ['운동',[
 ['bike','실내 자전거',3,5,'bike'],['dumbbell','한 쌍의 덤벨',2,2,'dumbbell'],['barbell','역기 바벨',6,2,'barbell'],['yogaMat','요가 매트',3,7,'mat'],['foamRoller','폼롤러',1,3,'roller'],['weightBench','운동 벤치',3,6,'bench'],['squatRack','스쿼트 랙',6,5,'squat'],['pullup','실내 철봉',4,3,'squat'],['stretch','스트레칭 보드',2,3,'board'],['gymMirror','벽면 운동 거울',8,1,'mirror','wall'],['stepBox','스텝박스',3,2,'step'],['gymBall','짐볼',3,3,'ball'],['kettlebell','케틀벨',2,2,'kettlebell'],
 ]],
 ['게임·촬영',[
 ['gamingPC','발광 게이밍 PC',2,2,'pc','surface'],['gamingMonitor','울트라와이드 게이밍 모니터',4,1,'monitor','surface'],['gamingDesk','L자 게이밍 책상',8,5,'cornerDesk'],['gamingChair','게이밍 의자',3,3,'gamingChair'],['console','거치형 게임기',2,1,'console','surface'],['controller','무선 컨트롤러',1,1,'controller','surface'],['headset','헤드셋 거치대',1,1,'headset','surface'],['mic','방송용 마이크',1,1,'mic','surface'],['camera','방송용 카메라',2,1,'camera','surface'],['tripod','카메라 삼각대',3,3,'tripod'],['ringLight','링라이트',2,2,'ring'],['softbox','대형 소프트박스',3,3,'softbox'],['greenScreen','이동식 크로마키',7,1,'screen'],['backdrop','촬영 배경막',8,1,'screen'],['editDesk','편집용 워크스테이션',8,3,'desk'],['soundPanel','벽 방음 패널',4,1,'sound','wall'],['webcam','웹캠 스탠드',1,1,'camera','surface'],['streamDeck','스트리밍 컨트롤러',1,1,'keys','surface'],
 ]],
 ['음악·연습',[
 ['piano','그랜드 피아노',7,7,'piano'],['digitalPiano','전자피아노',6,2,'pianoKeys'],['guitar','어쿠스틱 기타 거치대',2,3,'guitar'],['drum','어쿠스틱 드럼 세트',6,6,'drum'],['eDrum','전자 드럼',5,4,'drum'],['vocalMic','스탠딩 보컬 마이크',2,2,'mic'],['audioInterface','오디오 인터페이스',2,1,'keys','surface'],['recordGear','레코딩 믹싱 콘솔',4,2,'mixer','surface'],['musicStand','악보대',2,2,'bookrest'],['practiceMirror','이동식 연습 거울',5,1,'mirror'],['danceMat','대형 댄스 매트',8,8,'mat'],['guitarRack','기타 3대 보관대',4,2,'guitars'],['amp','기타 앰프',3,2,'speaker'],
 ]],
 ['미술·디자인',[
 ['easel','화실 이젤',3,3,'easel'],['canvas','작업 캔버스',3,1,'canvas','wall'],['artTable','대형 미술 작업대',8,4,'desk'],['drawingDesk','경사형 드로잉 책상',6,4,'draft'],['penTablet','펜 태블릿',2,2,'tablet','surface'],['paintCabinet','물감 보관함',3,2,'paint'],['brushPot','붓 꽂이',1,1,'brush','surface'],['dryArt','작품 건조대',4,3,'dryart'],['artStorage','대형 작품 보관장',6,2,'canvasRack'],['sewing','재봉틀',2,2,'sewing','surface'],['mannequin','입체 재단 마네킹',2,2,'mannequin'],['fabric','원단 롤 보관장',4,2,'fabric'],['cuttingTable','재단 작업대',8,5,'counter'],['threadBox','실과 바느질 도구함',2,1,'thread','surface'],
 ]],
 ['반려동물',[
 ['catTower','다단 캣타워',3,4,'catTower'],['catToilet','고양이 화장실',3,2,'catToilet'],['petBed','반려동물 쿠션 침대',3,3,'petBed'],['petBowl','사료와 물그릇',2,1,'bowls'],['autoFeeder','자동 급식기',2,2,'feeder'],['petWater','순환식 급수기',2,2,'water'],['petToy','노즈워크 장난감',2,2,'pettoy'],['carrier','반려동물 이동장',3,2,'carrier'],['petFence','이동식 펫 울타리',5,1,'fence'],['petStorage','반려동물 수납장',3,2,'cabinet'],['scratch','기둥형 스크래처',2,2,'scratch'],['catWheel','대형 캣휠',4,2,'catWheel'],['petHouse','강아지 하우스',4,4,'petHouse'],['groomTable','미용 전용 작업대',4,3,'groom'],['petBath','반려동물 목욕조',4,3,'bathtub'],['catwalk','벽면 캣워크',4,1,'shelf','wall'],
 ]],
 ['취미·수집',[
 ['lpPlayer','LP 턴테이블',2,2,'lp','surface'],['lpStorage','LP 음반 수납장',4,2,'lpCabinet'],['figureCase','계단형 피규어 장식장',5,2,'display'],['legoCase','블록 작품 전시대',6,3,'lego'],['boardgame','보드게임 펼침 세트',2,2,'boardgame','surface'],['readingChair','독서용 윙 체어',4,4,'armchair'],['collectShelf','수집품 벽 선반',5,1,'shelf','wall'],['vitrine','독립형 유리 진열장',3,3,'vitrine'],['telescope','천체망원경',3,3,'telescope'],['aquarium','관상어 수조',3,2,'aquarium','surface'],
 ]],
 ['장식·소품',[
 ['idolPoster','창작 아이돌 포스터',2,1,'poster','wall'],['characterPoster','창작 캐릭터 포스터',2,1,'character','wall'],['plush','동글동글 인형',1,1,'plush','surface'],['figure','미니 피규어',1,1,'figure','surface'],['keyring','키링 전시판',2,1,'keyring','wall'],['photoFrame','작은 사진 액자',1,1,'frame','surface'],['wallFrame','풍경 벽 액자',3,1,'landscape','wall'],['wallClock','원형 벽시계',2,1,'clock','wall'],['deskClock','탁상 알람시계',1,1,'clock','surface'],['calendar','벽 달력',2,1,'calendar','wall'],['diffuser','리드 디퓨저',1,1,'diffuser','surface'],['candle','향초',1,1,'candle','surface'],['moodLamp','버섯 무드등',1,1,'mushroom','surface'],['smallPlant','미니 다육 화분',1,1,'plant','surface'],['vase','꽃이 꽂힌 꽃병',1,1,'vase','surface'],['phone','스마트폰',1,1,'phone','surface'],['comic','만화책 한 권',1,1,'comic','surface'],['ornament','도자기 장식품',1,1,'vase','surface'],['cushion','별 쿠션',1,1,'star','surface'],['bin','분리수거 휴지통',2,2,'bin'],['powerStrip','안전 멀티탭',2,1,'power'],['robot','로봇청소기',2,2,'robot'],['robotDock','로봇 충전 스테이션',2,2,'dock'],['smartLamp','스마트 스탠드',2,2,'lamp'],['smartBed','전동 스마트 침대',6,8,'bed'],['smartTable','전동 높이 조절 테이블',5,3,'desk'],['smartStorage','자동화 수납장',5,2,'cabinet'],
 ]],
 ['수납·공간',[
 ['wallShelf','벽 부착 선반',4,1,'shelf','wall'],['mobileShelf','이동식 수납장',3,2,'cart'],['multiCabinet','다목적 수납장',6,2,'cabinet'],['storageBench','수납형 벤치',5,2,'bench'],['foldChair','접이식 의자',2,2,'chair'],['lockers','3칸 개인 사물함',5,2,'locker'],['suitcase','캐리어 보관장',4,3,'luggage'],['waterBox','방수 수납함',3,2,'chest'],['outdoorTable','야외 피크닉 테이블',6,4,'picnic'],['outdoorChair','야외 라탄 의자',3,3,'chair'],['hammock','자립형 해먹',4,9,'hammock'],['lantern','휴대용 랜턴',1,1,'lantern','surface'],['shoeCabinet','대형 신발장',6,2,'cabinet'],['umbrella','우산꽂이',2,2,'umbrella'],['coatHook','벽면 옷걸이',3,1,'hooks','wall'],['foldScreen','3단 접이식 병풍',6,1,'divider'],
 ]],
];
const oldCategories:Record<string,string>={mirror:'음악·연습',speaker:'음악·연습',mat:'운동',island:'주방',bunkBed:'침실',clothesRack:'침실',vanity:'침실',loveseat:'거실',officeChair:'학습·업무',bookcase:'학습·업무',plantStand:'거실',greenhouse:'거실',treadmill:'운동',dumbbellRack:'운동',oven:'주방',recordingDesk:'게임·촬영',desk:'학습·업무',washer:'욕실·세탁'};
const original = originalCatalog.map((d):Definition=>({ ...d, category:oldCategories[d.type]||d.category, art:'legacy', mount:'floor', tags:[] }));
export const library:Definition[] = [...original,...groups.flatMap(([category,rows])=>rows.map(([type,name,w,h,art,mount='floor',rule]):Definition=>({type,name,w,h,art,mount,category,kitchenOnly:rule==='kitchen',colors:['#C5AC8B',category==='욕실·세탁'?'#D4E4E5':category==='게임·촬영'?'#8CA6B7':'#B5C8B1'],parts:mount==='surface'?['본체','장식']:['프레임','표면'],tags:[category]})))];
const surfaces = ['desk','table','shelf','nightstand','dresser','coffeeTable','tvStand','diningTable','shoeRack','vanity','bookcase','recordingDesk','studyDesk','computerDesk','standingDesk','table2','table6','table8','roundDining','foldTable','extendTable','barTable','gamingDesk','editDesk','artTable','drawingDesk','cuttingTable','multiCabinet','storageBench','collectShelf','wallShelf','basin','bathCabinet','plantStand','lowDresser','legoCase','lpStorage'];
for(const d of library){
 if(surfaces.includes(d.type)){d.surface='general';d.capacity=Math.max(1,Math.floor(d.w*d.h/2));}
 if(['sink','island','counter','cornerCounter','lowerCabinet','kitchenCart','oven'].includes(d.type)){d.surface='kitchen';d.capacity=Math.max(1,Math.floor(d.w*d.h/2));}
 if(['mat','yogaMat','danceMat','roundRug','longRug','bathMat'].includes(d.type))d.soft=true;
 const alt:Record<string,[number,number]>={foldBed:[4,2],wallBed:[5,2],sofaBed:[6,3],trundle:[5,4],foldTable:[2,4],extendTable:[5,4],foldChair:[2,1],dryingRack:[1,3]};
 d.alternate=alt[d.type];
 if(['smartBed','smartTable','smartStorage','standingDesk','robot','smartLamp'].includes(d.type))d.tags.push('전동');
 if(d.type==='gamingDesk')d.surfaceAreas=[{x:0,y:0,w:8,h:2},{x:6,y:0,w:2,h:5}];
 if(d.type==='sink'){d.surface='general';d.surfaceAreas=[{x:3,y:0,w:1,h:2}];d.capacity=1;}
 if(d.type==='island'){d.surfaceAreas=[{x:3,y:0,w:2,h:3}];d.capacity=3;}
 if(d.type==='vanity')d.surfaceAreas=[{x:0,y:1,w:4,h:1}];
}
export const definitionMap = new Map(library.map(d=>[d.type,d]));
export const def=(type:string)=>definitionMap.get(type)!;
export const categories=['전체',...groups.map(([c])=>c)];
