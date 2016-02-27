// Version 2
DailyBikeData = new Mongo.Collection('dailyBikeData');
if (Meteor.isServer) {
    // Create Bike GPS coordinates
    function randGPS() {
	  // Set bounding constraints
	  var bottomLng = -76.936569;
	  var topLng = -76.950603;
	  var leftLat = 38.994052;
	  var rightLat = 38.981376;
	  var TypeConvFactor = 1000000; // To account for the int based getRandomArbitrary function
	  // Create random coordinates
	  function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	  }
	  var randCoordinates = {
		lat: (getRandomArbitrary(leftLat * TypeConvFactor, rightLat *
		    TypeConvFactor) / TypeConvFactor),
		lng: (getRandomArbitrary(bottomLng * TypeConvFactor, topLng *
		    TypeConvFactor) / TypeConvFactor)
	  };
	  return randCoordinates;
    };
    // Insert data into the database
    if (DailyBikeData.find().count() === 0) {
	  var i = 1;
	  while (i <= 2) {
		var randCoordinates = randGPS();
		DailyBikeData.insert({
		    Bike: i,
		    Tag: Math.round(0.65 * Math.random()) === 0 ?
			  'Available' : 'In Use',
		    Positions: {
			  lat: randCoordinates.lat,
			  lng: randCoordinates.lng
		    }
		});
		i++;
	  }
	  console.log('Created DailyBikeData data schema');
    }
}
// Version 3
if (Meteor.isClient) {
    Template.map.rendered = function() {
	  // Create the Leaflet Map
	  L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
	  var map = new L.Map('BikeMap', {
		// center: new L.LatLng(38.987701, -76.940989),
		center: new L.LatLng(38.992080,-76.946151),
		zoom: 18
	  });
	  L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map);
	  map.spin(false);
	  var data = [
[-63,38.992080,-76.946151,49.40,16494100],
[-38,38.992088,-76.946136,50.20,16495000],
[-41,38.992088,-76.946136,50.20,16495600],
[-36,38.992092,-76.946136,50.20,16500200],
[-47,38.992065,-76.946250,50.80,16501100],
[-42,38.992042,-76.946380,51.60,16502000],
[-38,38.992050,-76.946502,51.70,16502900],
[-47,38.992031,-76.946609,51.40,16503500],
[-60,38.992023,-76.946708,50.90,16504100],
[-51,38.992015,-76.946838,50.90,16505000],
[-55,38.992042,-76.946868,50.80,16505600],
[-51,38.992084,-76.946868,50.80,16510200],
[-55,38.992053,-76.947044,50.70,16511100],
[-59,38.992038,-76.947128,50.80,16511700],
[-68,38.992008,-76.947212,50.90,16512300],
[-67,38.991966,-76.947288,50.90,16513200],
[-64,38.991909,-76.947372,0.00,16514000],
[-59,38.991855,-76.947380,50.60,16514900],
[-62,38.991806,-76.947341,50.60,16515500],
[-57,38.991744,-76.947288,50.40,16520100],
[-68,38.991641,-76.947196,49.80,16521200],
[-73,38.991603,-76.947097,49.50,16522000],
[-70,38.991573,-76.946968,49.10,16522900],
[-66,38.991600,-76.946861,48.10,16523500],
[-75,38.991641,-76.946807,47.70,16524100],
[-69,38.991676,-76.946723,46.70,16525000],
[-63,38.991668,-76.946594,46.30,16525900],
[-69,38.991653,-76.946487,45.90,16530800],
[-64,38.991657,-76.946388,45.40,16531400],
[-61,38.991664,-76.946304,44.60,16532000],
[-62,38.991649,-76.946189,43.70,16532900],
[-66,38.991584,-76.946250,42.90,16533500],
[-67,38.991519,-76.946289,41.80,16534100],
[-72,38.991416,-76.946319,40.20,16535000],
[-73,38.991348,-76.946342,39.20,16535600],
[-74,38.991283,-76.946365,38.60,16540200],
[-75,38.991180,-76.946342,37.90,16541100],
[-80,38.991092,-76.946296,37.20,16541900],
[-79,0.000000,0.000000,0.00,0],
[-67,38.991691,-76.945960,37.20,16561000],
[-69,38.991664,-76.945808,39.00,16561900],
[-66,38.991653,-76.945724,40.10,16562500],
[-60,38.991611,-76.945648,40.10,16563100],
[-70,38.991569,-76.945533,40.70,16564000],
[-74,38.991546,-76.945442,41.40,16564600],
[-64,38.991535,-76.945350,41.50,16565200],
[-69,38.991519,-76.945220,41.20,16570100],
[-77,38.991516,-76.945091,40.20,16571000],
[-76,38.991508,-76.944961,39.00,16571900],
[-72,38.991504,-76.944869,38.50,16572500],
[-80,38.991493,-76.944778,38.60,16573100],
[-80,38.991493,-76.944633,39.00,16574000],
[-70,38.991489,-76.944488,39.40,16574900],
[-70,38.991477,-76.944374,39.90,16575800],
[-68,38.991470,-76.944297,40.10,16580400],
[-65,38.991436,-76.944229,39.20,16581000],
[-77,38.991321,-76.944229,38.30,16581900],
[-73,38.991249,-76.944236,37.90,16582500],
[-74,0.000000,0.000000,0.00,0],
[-71,38.991073,-76.944229,38.40,16583900],
[-74,38.990985,-76.944190,39.70,16584700],
[-79,38.990928,-76.944190,38.50,16585200],
[-85,38.990859,-76.944198,37.50,16585800],
[-75,38.990760,-76.944206,35.60,16590700],
[-77,38.990661,-76.944198,32.50,16591600],
[-82,38.990627,-76.944068,29.80,16592500],
[-77,38.990623,-76.943977,29.20,16593100],
[-77,38.990619,-76.943817,27.90,16594100],
[-73,38.990619,-76.943717,27.70,16594700],
[-83,38.990627,-76.943588,27.20,16595400],
[-51,38.991970,-76.946090,32.20,17053900],
[-48,38.991992,-76.946075,32.90,17054400],
[-49,38.991989,-76.946075,33.30,17055000],
[-43,38.991992,-76.946060,34.20,17055600],
[-54,38.991962,-76.946052,35.30,17060200],
[-46,38.991947,-76.945991,35.70,17060800],
[-38,38.991905,-76.945861,36.80,17061700],
[-36,38.991954,-76.945762,37.60,17062600],
[-41,38.992046,-76.945709,37.20,17063500],
[-57,38.992042,-76.945617,37.40,17064400],
[-55,38.991985,-76.945556,38.00,17070100],
[-53,38.991935,-76.945556,38.00,17070600],
[-69,38.991886,-76.945510,38.10,17071200],
[-70,38.991817,-76.945411,38.30,17072100],
[-65,38.991779,-76.945350,38.50,17072700],
[-64,38.991691,-76.945152,37.60,17074200],
[-56,38.991641,-76.945098,36.20,17074800],
[-47,38.991626,-76.945007,35.10,17075400],
[-70,38.991615,-76.944869,34.20,17080300],
[-69,38.991611,-76.944770,34.50,17080900],
[-71,38.991611,-76.944671,34.50,17081500],
[-67,38.991607,-76.944534,32.80,17082400],
[-65,38.991596,-76.944450,32.30,17083000],
[-66,38.991592,-76.944343,31.70,17083600],
[-64,38.991573,-76.944221,30.80,17084500],
[-64,38.991573,-76.944122,30.90,17085100],
[-71,38.991569,-76.944038,30.70,17085700],
[-67,38.991523,-76.943946,29.10,17090500],
[-77,38.991458,-76.943885,28.40,17091200],
[-69,38.991950,-76.944885,36.50,17110900],
[-76,0.000000,0.000000,0.00,0],
[-65,38.992118,-76.945213,32.90,17114100],
[-68,0.000000,0.000000,0.00,0],
[-72,38.992069,-76.945541,30.60,17131900],
[-75,38.992076,-76.945518,30.20,17132500],
[-64,38.992073,-76.945442,30.10,17133100],
[-66,38.992076,-76.945358,30.10,17133700],
[-67,38.992076,-76.945266,30.20,17134300],
[-72,38.992076,-76.945175,30.20,17134900],
[-66,38.992111,-76.945068,30.10,17135800],
[-71,38.992137,-76.944946,32.20,17140600],
[-72,38.992191,-76.944816,34.00,17141500],
[-77,38.992259,-76.944725,36.30,17142400],
[-72,38.992343,-76.944633,37.50,17143300],
[-74,38.992408,-76.944519,38.40,17144200],
[-72,38.992408,-76.944435,38.70,17144800],
[-75,38.992412,-76.944381,38.60,17145400],
[-75,38.992416,-76.944305,38.70,17150100],
[-79,38.992382,-76.944229,38.80,17150900],
[-63,38.992050,-76.945770,33.90,17183600],
[-57,38.992156,-76.945739,34.20,17184900],
[-62,38.992206,-76.945739,34.70,17185400],
[-59,38.992259,-76.945739,35.10,17190000],
[-73,38.992355,-76.945724,37.10,17190600],
[-74,38.992435,-76.945709,37.50,17191200],
[-65,38.992515,-76.945709,38.10,17191800],
[-71,38.992610,-76.945709,37.80,17192700],
[-74,38.992675,-76.945716,39.00,17193400],
[-68,38.992576,-76.946128,41.80,17205400],
[-71,38.992607,-76.946136,43.60,17210500],
[-70,38.992641,-76.946151,44.50,17211100],
[-79,38.992679,-76.946159,45.00,17211700],
[-65,38.992763,-76.946136,44.90,17212400],
[-72,38.992866,-76.946136,0.00,17213200],
[-75,38.992958,-76.946189,43.70,17214100],
[-75,38.993019,-76.946189,43.00,17214600],
[-76,38.993095,-76.946197,42.30,17215200],
[-76,38.993228,-76.946189,43.50,17220300],
[-57,38.992465,-76.946243,42.20,17235600],
[-69,38.992389,-76.946243,41.90,17240800],
[-66,38.992366,-76.946243,41.70,17241400],
[-52,38.992324,-76.946228,41.70,17242000],
[-61,38.992256,-76.946197,41.80,17242600],
[-54,38.992172,-76.946189,43.30,17243200],
[-57,38.992107,-76.946197,43.80,17243800],
[-57,38.992000,-76.946258,45.10,17244700],
[-68,38.992008,-76.946311,46.60,17245600],
[-60,38.992050,-76.946388,47.90,17250500],
[-56,38.992084,-76.946548,48.50,17251400],
[-57,38.992061,-76.946739,49.20,17252300],
[-54,38.992084,-76.946876,50.10,17253200],
[-51,38.992099,-76.946968,50.90,17253800],
[-40,38.992107,-76.947067,51.70,17254400],
[-42,38.992115,-76.947189,50.90,17255300],
[-50,38.992130,-76.947250,49.30,17255900],
[-45,38.992259,-76.947257,48.90,17261400],
[-54,38.992328,-76.947242,48.80,17261900],
[-59,38.992408,-76.947242,46.80,17262500],
[-59,38.992481,-76.947273,44.80,17263400],
[-59,38.992538,-76.947242,45.50,17264000],
[-62,38.992591,-76.947212,46.90,17264600],
[-55,38.992668,-76.947181,48.30,17265500],
[-67,38.992755,-76.947196,47.60,17270100],
[-57,38.992835,-76.947212,47.30,17270700],
[-63,38.992942,-76.947212,46.50,17271500],
[-63,38.992286,-76.947059,35.20,17302900],
[-65,38.992183,-76.947250,32.80,17304000],
[-57,38.991970,-76.947257,24.60,17310500],
[-73,38.991889,-76.947372,37.90,17314900],
[-68,38.991889,-76.947402,40.20,17315500],
[-66,38.992164,-76.946754,58.70,17335400],
[-56,38.992168,-76.946739,59.20,17340500],
[-56,38.992153,-76.946701,59.10,17341100],
[-56,38.992160,-76.946640,59.00,17341700],
[-54,38.992130,-76.946548,59.00,17342900],
[-55,38.992084,-76.946479,59.00,17343500],
[-57,38.992019,-76.946357,61.30,17344400],
[-66,38.991996,-76.946243,62.30,17345300]
	  ]
	 //  var data = [
		// // [-45,38.986026,-76.944404,36.10,20422900],
		// // [-69,38.986011,-76.944458,35.90,20423700],
		// // [-66,38.986022,-76.944526,36.20,20424500],
		// // [-63,38.986053,-76.944587,36.60,20425200],
		// [-77, 38.986133, -76.944641, 37.00, 20425900],
		// [-76, 38.986248, -76.944648, 36.50, 20430700],
		// [-78, 38.986320, -76.944610, 38.10, 20431500],
		// [-82, 38.986400, -76.944679, 38.60, 20432300],
		// [-85, 38.986434, -76.944786, 37.00, 20433100],
		// [-87, 38.986438, -76.944885, 36.10, 20433800],
		// [-89, 38.986434, -76.944961, 35.30, 20434600],
		// [-85, 38.986461, -76.944908, 35.20, 20435400],
		// [-87, 38.986480, -76.944831, 35.00, 20440100],
		// [-85, 38.986515, -76.944801, 35.70, 20440900],
		// [-86, 38.986568, -76.944862, 35.40, 20441700],
		// [-84, 38.986618, -76.944869, 34.80, 20442500],
		// [-79, 38.986625, -76.944808, 33.50, 20443300],
		// [-82, 38.986637, -76.944717, 32.50, 20444100],
		// [-76, 38.986591, -76.944564, 32.40, 20444900],
		// [-75, 38.986545, -76.944549, 32.20, 20445600],
		// [-78, 38.986522, -76.944526, 31.70, 20450400],
		// [-70, 38.986553, -76.944541, 31.40, 20451200],
		// [-85, 38.986576, -76.944549, 31.00, 20451900],
		// [-80, 38.986606, -76.944496, 31.30, 20452700],
		// [-69, 38.986629, -76.944404, 30.90, 20453400],
		// [-84, 38.986679, -76.944328, 31.00, 20454100],
		// [-80, 38.986732, -76.944297, 31.20, 20454800],
		// [-86, 38.986831, -76.944221, 31.60, 20455600],
		// [-90, 38.986938, -76.944221, 32.20, 20460400],
		// [-80, 38.986984, -76.944198, 34.90, 20461200],
		// [-83, 38.987003, -76.944198, 35.50, 20461900],
		// [-85, 38.987045, -76.944206, 36.50, 20464200],
		// [-85, 38.987033, -76.944206, 36.30, 20465000],
		// [-85, 38.986999, -76.944213, 35.60, 20465700],
		// [-87, 38.986938, -76.944244, 35.60, 20470500],
		// [-83, 38.986885, -76.944297, 36.20, 20471300],
		// [-84, 38.986782, -76.944259, 36.30, 20472100],
		// [-84, 38.986759, -76.944206, 36.30, 20472900],
		// [-84, 38.986732, -76.944114, 36.90, 20473600],
		// [-84, 38.986724, -76.944023, 38.00, 20474400],
		// [-79, 38.986663, -76.943916, 38.90, 20475200],
		// [-89, 38.986625, -76.943855, 40.40, 20475900],
		// [-80, 38.986579, -76.943771, 41.10, 20480600],
		// [-74, 38.986553, -76.943763, 41.80, 20481400],
		// [-70, 38.986534, -76.943801, 42.10, 20482200],
		// [-75, 38.986526, -76.943901, 42.10, 20482900],
		// [-66, 38.986476, -76.943984, 41.60, 20483700],
		// [-62, 38.986434, -76.944030, 41.10, 20484500],
		// [-66, 38.986396, -76.944061, 41.00, 20485300],
		// [-74, 38.986347, -76.944114, 41.00, 20490100],
		// [-71, 38.986289, -76.944198, 40.90, 20490900],
		// [-67, 38.986236, -76.944252, 40.80, 20491600],
		// [-65, 38.986183, -76.944274, 40.80, 20492400],
		// [-63, 38.986122, -76.944236, 40.80, 20493200],
		// [-57, 38.986045, -76.944213, 40.90, 20494100],
		// [-60, 38.985950, -76.944198, 41.00, 20494900],
		// [-66, 38.985858, -76.944175, 40.10, 20495700],
		// [-69, 38.985691, -76.944145, 39.20, 20501200],
		// [-68, 38.985614, -76.944137, 39.30, 20502000],
		// [-69, 38.985546, -76.944145, 39.50, 20502700],
		// [-71, 38.985485, -76.944145, 39.80, 20503400],
		// [-62, 38.985469, -76.944091, 40.10, 20504100],
		// [-68, 38.985488, -76.944023, 40.10, 20504900],
		// [-72, 38.985561, -76.943984, 39.90, 20505600],
		// [-70, 38.985668, -76.943962, 39.50, 20510400],
		// [-55, 38.985771, -76.943946, 39.00, 20511200],
		// [-70, 38.985866, -76.943923, 37.30, 20512000],
		// [-63, 38.986053, -76.943893, 34.60, 20513600],
		// [-67, 38.986152, -76.943885, 34.50, 20514400],
		// [-63, 38.986236, -76.943878, 34.40, 20515200],
		// [-63, 38.986305, -76.943885, 36.00, 20520000],
		// [-72, 38.986396, -76.943870, 36.80, 20520800],
		// [-67, 38.986461, -76.943855, 38.20, 20521600],
		// [-69, 38.986507, -76.943817, 38.30, 20522400],
		// [-69, 38.986515, -76.943740, 38.70, 20523100],
		// [-72, 38.986465, -76.943672, 38.80, 20523900],
		// [-71, 38.986415, -76.943672, 38.90, 20524600],
		// [-68, 38.986335, -76.943656, 39.10, 20525400],
		// [-64, 38.986232, -76.943649, 38.60, 20530200],
		// [-69, 38.986148, -76.943641, 37.90, 20530900],
		// [-74, 38.986061, -76.943626, 37.30, 20531700],
		// [-75, 38.985961, -76.943626, 36.90, 20532500],
		// [-82, 38.985866, -76.943626, 36.30, 20533300],
		// [-83, 38.985774, -76.943626, 36.30, 20534100],
		// [-71, 38.985679, -76.943618, 36.40, 20534900],
		// [-74, 38.985580, -76.943611, 36.40, 20535700],
		// [-81, 38.985511, -76.943626, 36.40, 20540400],
		// [-84, 38.985485, -76.943565, 36.10, 20541200],
		// [-61, 38.985500, -76.943496, 36.30, 20542000],
		// [-69, 38.985549, -76.943450, 36.80, 20542800],
		// [-76, 38.985637, -76.943435, 36.50, 20543600],
		// [-72, 38.985736, -76.943443, 35.40, 20544400],
		// [-68, 38.985828, -76.943450, 35.30, 20545100],
		// [-61, 38.985916, -76.943450, 36.10, 20545800],
		// [-64, 38.986011, -76.943450, 35.60, 20550600],
		// [-65, 38.986087, -76.943450, 33.40, 20551400],
		// [-66, 38.986171, -76.943443, 32.30, 20552200],
		// [-60, 38.986251, -76.943458, 32.50, 20553000],
		// [-60, 38.986312, -76.943458, 32.20, 20553700],
		// [-61, 38.986385, -76.943458, 33.50, 20554400],
		// [-64, 38.986461, -76.943466, 33.30, 20555200],
		// [-64, 38.986537, -76.943450, 31.40, 20560000],
		// [-71, 38.986606, -76.943450, 32.40, 20560800],
		// [-78, 38.986660, -76.943367, 33.20, 20561600],
		// [-70, 38.986713, -76.943275, 33.60, 20562400],
		// [-72, 38.986747, -76.943183, 33.60, 20563200],
		// [-78, 38.986797, -76.943107, 34.40, 20564000],
		// [-79, 38.986846, -76.943069, 35.00, 20564700],
		// [-87, 38.986904, -76.943038, 35.50, 20565500],
		// [-89, 38.986919, -76.943069, 35.80, 20570300],
		// [-87, 38.986930, -76.943061, 36.50, 20571100],
		// [-90, 38.986995, -76.943046, 36.90, 20571900],
		// [-90, 38.987033, -76.943069, 37.20, 20572700],
		// [-83, 38.986976, -76.943054, 37.20, 20573500],
		// [-84, 38.986904, -76.943061, 37.10, 20574300],
		// [-80, 38.986827, -76.943038, 37.40, 20575100],
		// [-75, 38.986740, -76.942947, 38.10, 20575900],
		// [-85, 38.986709, -76.942893, 38.30, 20580700],
		// [-76, 38.986648, -76.942886, 38.10, 20581400],
		// [-75, 38.986579, -76.942939, 37.70, 20582200],
		// [-79, 38.986560, -76.943031, 37.20, 20583000],
		// [-78, 38.986553, -76.943122, 37.10, 20583700],
		// [-71, 38.986534, -76.943183, 37.00, 20584400],
		// [-73, 38.986488, -76.943191, 36.80, 20585100],
		// [-61, 38.986427, -76.943222, 36.70, 20585800],
		// [-71, 38.986328, -76.943237, 36.10, 20590600],
		// [-73, 38.986232, -76.943244, 35.70, 20591300],
		// [-78, 38.986129, -76.943260, 35.10, 20592000],
		// [-72, 38.986022, -76.943260, 34.30, 20592800],
		// [-80, 38.985916, -76.943260, 33.90, 20593600],
		// [-75, 38.985836, -76.943244, 33.60, 20594300],
		// [-83, 38.985744, -76.943229, 33.40, 20595100],
		// [-83, 38.985656, -76.943222, 33.30, 20595800],
		// [-78, 38.985576, -76.943214, 33.80, 21000500],
		// [-80, 38.985507, -76.943214, 34.60, 21001300],
		// [-82, 38.985492, -76.943153, 34.40, 21002100],
		// [-74, 38.985500, -76.943054, 33.60, 21002900],
		// [-69, 38.985561, -76.942993, 33.90, 21003700],
		// [-69, 38.985633, -76.942977, 34.30, 21004400],
		// [-78, 38.985729, -76.942970, 34.20, 21005200],
		// [-70, 38.985824, -76.942962, 34.20, 21010000],
		// [-79, 38.985877, -76.942970, 33.30, 21010800],
		// [-73, 38.985950, -76.942962, 31.90, 21011600],
		// [-75, 38.986015, -76.942970, 30.90, 21012300],
		// [-72, 38.986095, -76.942970, 29.20, 21013100],
		// [-68, 38.986179, -76.942970, 30.40, 21013900],
		// [-66, 38.986270, -76.942970, 32.10, 21014700],
		// [-79, 38.986354, -76.942970, 34.00, 21015500],
		// [-74, 38.986415, -76.942970, 36.30, 21020200],
		// [-80, 38.986473, -76.942970, 36.10, 21021000],
		// [-61, 38.986476, -76.942970, 36.90, 21021800],
		// [-79, 38.986480, -76.943016, 37.10, 21035200],
		// [-73, 38.986526, -76.942962, 36.50, 21040000],
		// [-76, 38.986503, -76.942886, 33.80, 21040700],
		// [-71, 38.986461, -76.942901, 34.20, 21041500],
		// [-67, 38.986400, -76.942893, 34.50, 21042200],
		// [-74, 38.986301, -76.942878, 34.90, 21043000],
		// [-75, 38.986198, -76.942863, 34.50, 21043800],
		// [-77, 38.986091, -76.942848, 33.60, 21044600],
		// [-75, 38.986000, -76.942840, 31.50, 21045300],
		// [-76, 38.985900, -76.942825, 31.00, 21050100],
		// [-86, 38.985801, -76.942810, 29.70, 21050900],
		// [-84, 38.985706, -76.942810, 27.00, 21051700],
		// [-72, 38.985630, -76.942794, 27.60, 21052400],
		// [-82, 38.985557, -76.942771, 30.40, 21053200],
		// [-80, 38.985488, -76.942771, 33.20, 21054000],
		// [-84, 38.985469, -76.942710, 34.90, 21054700],
		// [-75, 38.985485, -76.942626, 35.30, 21055500],
		// [-74, 38.985546, -76.942588, 34.30, 21060300],
		// [-72, 38.985641, -76.942573, 33.80, 21061100],
		// [-67, 38.985748, -76.942565, 34.10, 21061900],
		// [-65, 38.985855, -76.942558, 33.80, 21062700],
		// [-67, 38.985961, -76.942543, 33.00, 21063500],
		// [-79, 38.986064, -76.942535, 34.50, 21064300],
		// [-69, 38.986160, -76.942550, 34.30, 21065100],
		// [-63, 38.986248, -76.942543, 32.70, 21065900],
		// [-61, 38.986331, -76.942543, 30.50, 21070700],
		// [-69, 38.986408, -76.942535, 29.40, 21071400],
		// [-71, 38.986469, -76.942527, 30.40, 21072200],
		// [-72, 38.986541, -76.942520, 31.60, 21072900],
		// [-77, 38.986568, -76.942474, 31.40, 21073600],
		// [-83, 38.986541, -76.942390, 30.70, 21074400],
		// [-85, 38.986488, -76.942329, 30.70, 21075200],
		// [-74, 38.986412, -76.942298, 30.90, 21080000],
		// [-84, 38.986309, -76.942298, 31.00, 21080800],
		// [-81, 38.986213, -76.942298, 30.80, 21081600],
		// [-89, 38.986118, -76.942291, 31.10, 21082400],
		// [-89, 38.986042, -76.942314, 31.00, 21083200],
		// [-78, 38.985988, -76.942298, 31.00, 21084000],
		// [-87, 38.985916, -76.942298, 30.90, 21084800],
		// [-84, 38.985843, -76.942298, 30.90, 21085600],
		// [-86, 38.985759, -76.942298, 0.00, 21090500],
		// [-88, 38.985614, -76.942306, 29.50, 21092000],
		// [-88, 38.985538, -76.942298, 29.00, 21092800],
		// [-84, 38.985492, -76.942245, 28.60, 21093600],
		// [-86, 38.985500, -76.942184, 28.70, 21094300],
		// [-74, 38.985557, -76.942138, 28.40, 21095100],
		// [-74, 38.985652, -76.942138, 27.00, 21095900],
		// [-75, 38.985744, -76.942138, 27.10, 21100600],
		// [-74, 38.985843, -76.942138, 27.30, 21101400],
		// [-74, 38.985935, -76.942138, 27.40, 21102200],
		// [-83, 38.986011, -76.942123, 27.50, 21103000],
		// [-83, 38.985996, -76.942024, 25.30, 21103800],
		// [-84, 38.985988, -76.941978, 25.60, 21104600],
		// [-83, 38.985946, -76.941932, 26.10, 21105400],
		// [-85, 38.985870, -76.941932, 26.20, 21110200],
		// [-73, 38.985862, -76.941963, 25.50, 21110900],
		// [-80, 38.985816, -76.941947, 25.50, 21111700],
		// [-80, 38.985729, -76.941947, 26.80, 21112500],
		// [-77, 38.985694, -76.941970, 27.80, 21113200],
		// [-71, 38.985710, -76.941978, 28.20, 21114000],
		// [-72, 38.985710, -76.941978, 28.30, 21114700],
		// [-74, 38.985683, -76.941970, 28.30, 21115500],
		// [-74, 38.985668, -76.941986, 28.50, 21120300],
		// [-74, 38.985668, -76.941978, 28.50, 21121100],
		// [-72, 38.985668, -76.941978, 28.50, 21121900],
		// [-79, 38.985652, -76.941993, 28.60, 21122700],
		// [-72, 38.985660, -76.942436, 30.70, 21165500],
		// [-85, 38.985652, -76.942367, 29.30, 21170300],
		// [-84, 38.985626, -76.942253, 27.00, 21171100],
		// [-85, 38.985572, -76.942184, 27.00, 21171900],
		// [-86, 38.985515, -76.942192, 27.00, 21172600],
		// [-86, 38.985473, -76.942199, 27.40, 21173300],
		// [-81, 38.985443, -76.942237, 27.10, 21174100],
		// [-85, 38.985446, -76.942283, 27.80, 21174900],
		// [-80, 38.985435, -76.942298, 28.20, 21175700],
		// [-82, 38.985431, -76.942260, 28.60, 21180400],
		// [-84, 38.985439, -76.942222, 29.10, 21181100],
		// [-83, 38.985431, -76.942146, 29.20, 21181800],
		// [-83, 38.985416, -76.942031, 29.00, 21182600],
		// [-88, 38.985408, -76.941932, 29.00, 21183400],
		// [-82, 38.985458, -76.941864, 29.20, 21184200],
		// [-80, 38.985496, -76.941795, 29.80, 21185000],
		// [-76, 38.985595, -76.941795, 30.30, 21185800],
		// [-75, 38.985702, -76.941780, 30.20, 21190600],
		// [-75, 38.985782, -76.941780, 30.10, 21191300],
		// [-76, 38.985881, -76.941787, 30.10, 21192100],
		// [-76, 38.985961, -76.941795, 30.40, 21192800],
		// [-87, 38.985996, -76.941757, 29.50, 21193600],
		// [-87, 38.985988, -76.941665, 29.50, 21194300],
		// [-87, 38.985935, -76.941642, 30.30, 21195100],
		// [-86, 38.985916, -76.941650, 30.50, 21195900],
		// [-82, 38.985912, -76.941650, 30.60, 21200700],
		// [-85, 38.985916, -76.941650, 30.60, 21201500],
		// [-84, 38.985919, -76.941650, 30.60, 21202300],
		// [-84, 38.985919, -76.941658, 30.60, 21203100],
		// [-82, 38.985919, -76.941658, 30.60, 21203800],
		// [-82, 38.985919, -76.941658, 30.60, 21204600],
		// [-82, 38.985916, -76.941658, 30.60, 21205300],
		// [-86, 38.985916, -76.941658, 30.60, 21210100],
		// [-77, 38.985687, -76.941673, 31.60, 21244100],
		// [-83, 38.985683, -76.941650, 31.80, 21244900],
		// [-73, 38.985671, -76.941635, 31.60, 21245700],
		// [-84, 38.985637, -76.941619, 31.90, 21250500],
		// [-86, 38.985572, -76.941604, 32.20, 21251200],
		// [-86, 38.985504, -76.941596, 32.30, 21252000],
		// [-86, 38.985469, -76.941535, 32.20, 21252800],
		// [-74, 38.985507, -76.941505, 31.90, 21253600],
		// [-75, 38.985576, -76.941474, 31.80, 21254400],
		// [-77, 38.985660, -76.941436, 31.20, 21255100],
		// [-80, 38.985763, -76.941406, 30.50, 21255900],
		// [-80, 38.985855, -76.941398, 29.50, 21260600],
		// [-79, 38.985946, -76.941375, 28.90, 21261400],
		// [-79, 38.986038, -76.941368, 27.90, 21262200],
		// [-82, 38.986118, -76.941360, 28.00, 21263000],
		// [-81, 38.986213, -76.941345, 27.40, 21263800],
		// [-80, 38.986305, -76.941345, 26.50, 21264600],
		// [-75, 38.986373, -76.941345, 28.30, 21265300],
		// [-70, 38.986457, -76.941345, 28.80, 21270100],
		// [-75, 38.986537, -76.941337, 29.00, 21270900],
		// [-85, 38.986591, -76.941337, 27.40, 21271700],
		// [-83, 38.986656, -76.941406, 30.10, 21272500],
		// [-83, 38.986648, -76.941505, 30.10, 21273300],
		// [-83, 38.986633, -76.941558, 29.60, 21274100],
		// [-80, 38.986618, -76.941612, 29.40, 21274800],
		// [-80, 38.986610, -76.941650, 30.10, 21275600],
		// [-81, 38.986595, -76.941680, 31.20, 21280300],
		// [-75, 38.986572, -76.941749, 32.00, 21281900],
		// [-81, 38.986564, -76.941795, 32.00, 21282700],
		// [-84, 38.986557, -76.941856, 31.90, 21283400],
		// [-85, 38.986557, -76.941932, 31.90, 21284100],
		// [-79, 38.986560, -76.942031, 31.90, 21284900],
		// [-79, 38.986553, -76.942123, 31.50, 21285700],
		// [-81, 38.986503, -76.942153, 31.40, 21290500],
		// [-78, 38.986423, -76.942169, 31.60, 21291300],
		// [-75, 38.986331, -76.942176, 32.00, 21292100],
		// [-78, 38.986251, -76.942176, 32.20, 21292800],
		// [-84, 38.986160, -76.942176, 33.00, 21293600],
		// [-79, 38.986080, -76.942169, 33.50, 21294400],
		// [-84, 38.986064, -76.942085, 32.90, 21295200],
		// [-85, 38.986076, -76.941978, 32.40, 21300000],
		// [-70, 38.986137, -76.941947, 31.30, 21300800],
		// [-75, 38.986221, -76.941955, 30.60, 21301600],
		// [-76, 38.986301, -76.941970, 30.40, 21302400],
		// [-79, 38.986373, -76.941978, 30.70, 21303100],
		// [-74, 38.986446, -76.941986, 32.00, 21303900],
		// [-84, 38.986511, -76.941970, 32.80, 21304700],
		// [-85, 38.986515, -76.941909, 0.00, 21305400],
		// [-79, 38.986392, -76.941810, 35.40, 21311100],
		// [-81, 38.986309, -76.941810, 35.60, 21311800],
		// [-86, 38.986209, -76.941802, 35.80, 21312600],
		// [-86, 38.986167, -76.941802, 35.60, 21313400],
		// [-87, 38.986095, -76.941780, 35.60, 21314200],
		// [-89, 38.986076, -76.941688, 34.60, 21315000],
		// [-89, 38.986106, -76.941619, 33.50, 21315700],
		// [-78, 38.986194, -76.941596, 32.30, 21320500],
		// [-79, 38.986286, -76.941581, 31.20, 21321300],
		// [-82, 38.986373, -76.941566, 31.40, 21322100],
		// [-73, 38.986434, -76.941558, 31.30, 21322800],
		// [-77, 38.986492, -76.941558, 33.70, 21323500],
		// [-88, 38.986526, -76.941528, 32.70, 21324300],
		// [-87, 38.986518, -76.941429, 32.20, 21325100],
		// [-76, 38.986499, -76.941360, 32.20, 21325800],
		// [-85, 38.986419, -76.941337, 32.60, 21330600],
		// [-85, 38.986328, -76.941322, 32.50, 21331400],
		// [-82, 38.986248, -76.941322, 32.40, 21332100],
		// [-89, 38.986152, -76.941322, 32.30, 21332900],
		// [-85, 38.986076, -76.941307, 32.30, 21333600],
		// [-87, 38.986000, -76.941299, 32.10, 21334400],
		// [-84, 38.985912, -76.941291, 31.90, 21335200],
		// [-88, 38.985839, -76.941291, 31.60, 21335900],
		// [-85, 38.985755, -76.941291, 31.80, 21340700],
		// [-89, 38.985671, -76.941291, 32.60, 21341500],
		// [-88, 38.985603, -76.941299, 33.20, 21342300],
		// [-90, 38.985538, -76.941261, 33.40, 21343100],
		// [-87, 38.985511, -76.941162, 33.30, 21343900],
		// [-87, 38.985492, -76.941062, 33.60, 21344700],
		// [-85, 38.985481, -76.940994, 33.60, 21345500],
		// [-78, 38.985481, -76.940902, 34.20, 21350300],
		// [-79, 38.985565, -76.940895, 33.90, 21351100],
		// [-85, 38.985652, -76.940940, 33.30, 21351800],
		// [-81, 38.985729, -76.941001, 32.90, 21352600],
		// [-82, 38.985801, -76.941047, 32.50, 21353300],
		// [-82, 38.985881, -76.941116, 32.50, 21354100],
		// [-80, 38.985954, -76.941177, 32.20, 21354900],
		// [-89, 38.985965, -76.941139, 31.50, 21355700],
		// [-88, 38.985916, -76.941055, 30.90, 21360500],
		// [-90, 38.985866, -76.940956, 30.50, 21361300],
		// [-91, 38.985813, -76.940864, 30.50, 21362100],
		// [-87, 38.985767, -76.940780, 30.40, 21362800],
		// [-91, 38.985717, -76.940681, 29.90, 21363600],
		// [-88, 38.985668, -76.940597, 29.50, 21364300],
		// [-91, 38.985626, -76.940528, 29.00, 21365000],
		// [-87, 38.985576, -76.940444, 28.50, 21365800],
		// [-88, 38.985527, -76.940368, 28.20, 21370600],
		// [-85, 38.985500, -76.940284, 28.20, 21371300],
		// [-84, 38.985538, -76.940231, 27.90, 21372100],
		// [-79, 38.985641, -76.940231, 28.00, 21372900],
		// [-81, 38.985740, -76.940223, 28.60, 21373700],
		// [-74, 38.985820, -76.940238, 27.80, 21374400],
		// [-86, 38.985908, -76.940261, 27.20, 21375200],
		// [-85, 38.985996, -76.940322, 27.30, 21380000],
		// [-82, 38.986076, -76.940322, 26.70, 21380700],
		// [-90, 38.986164, -76.940277, 25.70, 21381500],
		// [-88, 38.986232, -76.940254, 25.40, 21382200],
		// [-74, 38.986320, -76.940246, 24.80, 21383000],
		// [-80, 38.986408, -76.940246, 24.60, 21383800],
		// [-78, 38.986484, -76.940246, 26.70, 21384600],
		// [-81, 38.986553, -76.940261, 28.10, 21385300],
		// [-90, 38.986598, -76.940338, 30.80, 21390100],
		// [-87, 38.986606, -76.940406, 32.50, 21390800],
		// [-88, 38.986621, -76.940521, 33.40, 21391600],
		// [-88, 38.986640, -76.940650, 34.70, 21392400],
		// [-86, 38.986629, -76.940780, 35.30, 21393200],
		// [-86, 38.986557, -76.940864, 34.60, 21394000],
		// [-85, 38.986488, -76.940917, 34.80, 21394700],
		// [-85, 38.986412, -76.940986, 35.10, 21395500],
		// [-90, 38.986335, -76.941055, 34.90, 21400200],
		// [-91, 38.986251, -76.941116, 34.90, 21401000],
		// [-87, 38.986160, -76.941192, 35.10, 21401800],
		// [-85, 38.986080, -76.941223, 34.40, 21402600],
		// [-88, 38.986103, -76.941139, 33.30, 21403300],
		// [-86, 38.986152, -76.941047, 31.90, 21404100],
		// [-84, 38.986206, -76.940956, 30.70, 21404900],
		// [-83, 38.986270, -76.940864, 30.00, 21405700],
		// [-89, 38.986320, -76.940788, 29.40, 21410400],
		// [-78, 38.986381, -76.940719, 29.60, 21411200],
		// [-85, 38.986434, -76.940650, 31.40, 21412000],
		// [-90, 38.986476, -76.940597, 31.80, 21412700],
		// [-86, 38.986534, -76.940513, 31.70, 21413500],
		// [-82, 38.986625, -76.940505, 31.80, 21414300],
		// [-87, 38.986713, -76.940498, 32.00, 21415100],
		// [-88, 38.986785, -76.940498, 32.30, 21415800],
		// [-87, 38.986740, -76.940483, 34.90, 21423600],
		// [-87, 38.986701, -76.940437, 34.90, 21424400],
		// [-83, 38.986633, -76.940376, 35.00, 21425200],
		// [-90, 38.986591, -76.940299, 34.90, 21430000],
		// [-90, 38.986568, -76.940193, 34.70, 21430700],
		// [-87, 38.986526, -76.940109, 34.50, 21431500],
		// [-85, 38.986473, -76.940048, 33.90, 21432300],
		// [-86, 38.986503, -76.939994, 33.60, 21433100],
		// [-82, 38.986564, -76.940017, 33.10, 21433900],
		// [-87, 38.986633, -76.940063, 33.00, 21434600],
		// [-87, 38.986724, -76.940086, 32.50, 21435300],
		// [-87, 38.986740, -76.940086, 32.40, 21440100],
		// [-89, 38.986705, -76.940101, 32.50, 21440900],
		// [-89, 38.986660, -76.940101, 32.80, 21441600],
		// [-87, 38.986621, -76.940101, 33.00, 21442300],
		// [-88, 38.986549, -76.940116, 32.80, 21443100],
		// [-86, 38.986446, -76.940101, 31.70, 21443800],
		// [-88, 38.986354, -76.940086, 31.40, 21444600],
		// [-86, 38.986248, -76.940086, 31.40, 21445400],
		// [-83, 38.986148, -76.940093, 31.50, 21450200],
		// [-87, 38.986061, -76.940093, 31.50, 21450900],
		// [-78, 38.985992, -76.940093, 32.00, 21451600],
		// [-86, 38.985893, -76.940078, 32.10, 21452400],
		// [-90, 38.985809, -76.940048, 31.70, 21453200],
		// [-83, 38.985740, -76.940040, 31.20, 21454000],
		// [-87, 38.985656, -76.939979, 30.30, 21454800],
		// [-91, 38.985645, -76.939872, 29.70, 21455600],
		// [-91, 38.985649, -76.939788, 28.90, 21460300],
		// [-88, 38.985668, -76.939788, 29.00, 21461100],
		// [-91, 38.985664, -76.939758, 28.80, 21461900],
		// [-91, 38.985603, -76.939689, 28.70, 21462700],
		// [-90, 38.985576, -76.939750, 29.40, 21463500],
		// [-90, 38.985572, -76.939842, 29.90, 21464300],
		// [-90, 38.985588, -76.939918, 29.80, 21465000],
		// [-88, 38.985580, -76.940017, 29.10, 21465700],
		// [-91, 38.985527, -76.940071, 28.80, 21470500],
		// [-88, 38.986003, -76.941261, 29.50, 21510800],
		// [-88, 38.985992, -76.941207, 29.70, 21511600],
		// [-85, 38.985919, -76.941139, 29.70, 21512400],
		// [-88, 38.985832, -76.941070, 30.10, 21513200],
		// [-90, 38.985763, -76.941009, 30.30, 21513900],
		// [-85, 38.985683, -76.940940, 30.30, 21514700],
		// [-84, 38.985607, -76.940872, 30.20, 21515500],
		// [-86, 38.985542, -76.940826, 30.90, 21520200],
		// [-90, 38.985496, -76.940879, 32.00, 21521000],
		// [-89, 38.985466, -76.940933, 32.80, 21521700],
		// [-85, 38.985401, -76.941040, 33.90, 21522500],
		// [-85, 38.985363, -76.941131, 34.60, 21523300],
		// [-90, 38.985382, -76.941238, 35.70, 21524100],
		// [-89, 38.985378, -76.941345, 36.50, 21524900],
		// [-88, 38.985366, -76.941459, 36.90, 21525700],
		// [-86, 38.985351, -76.941589, 37.60, 21530500],
		// [-89, 38.985340, -76.941711, 37.90, 21531300],
		// [-88, 38.985343, -76.941810, 38.20, 21532100],
		// [-84, 38.985374, -76.941894, 38.80, 21532800],
		// [-87, 38.985366, -76.941978, 39.50, 21533600],
		// [-88, 38.985317, -76.942314, 42.00, 21535900],
		// [-88, 38.985298, -76.942420, 42.10, 21540600],
		// [-87, 38.985279, -76.942543, 42.50, 21541400],
		// [-88, 38.985275, -76.942657, 42.40, 21542200],
		// [-86, 38.985260, -76.942764, 43.00, 21543000],
		// [-87, 38.985260, -76.942886, 42.90, 21543800],
		// [-84, 38.985271, -76.942985, 42.40, 21544600],
		// [-84, 38.985275, -76.943084, 41.90, 21545300],
		// [-86, 38.985267, -76.943206, 42.00, 21550100],
		// [-75, 38.985260, -76.943313, 42.10, 21550800],
		// [-83, 38.985252, -76.943435, 42.20, 21551600],
		// [-83, 38.985275, -76.943527, 44.10, 21552400],
		// [-74, 38.985282, -76.943626, 47.60, 21553200],
		// [-79, 38.985244, -76.943733, 48.70, 21554000],
		// [-71, 38.985179, -76.943824, 49.40, 21554800],
		// [-74, 38.985134, -76.943923, 50.20, 21555600],
		// [-70, 38.985115, -76.943992, 50.50, 21560400],
		// [-75, 38.985099, -76.944046, 50.30, 21561200],
		// [-81, 38.985111, -76.944107, 50.10, 21562000],
		// [-84, 38.985164, -76.944160, 50.00, 21562800],
		// [-74, 38.985256, -76.944221, 50.10, 21563600],
		// [-83, 38.985309, -76.944305, 50.30, 21564300],
		// [-70, 38.985340, -76.944419, 50.50, 21565100],
		// [-75, 38.985366, -76.944511, 50.50, 21565900],
		// [-75, 38.985378, -76.944595, 50.50, 21570600],
		// [-81, 38.985366, -76.944717, 50.40, 21571400],
		// [-83, 38.985336, -76.944801, 50.90, 21572200],
		// [-85, 38.985351, -76.944786, 50.10, 21573000],
		// [-83, 38.985404, -76.944747, 48.90, 21573800],
		// [-81, 38.985466, -76.944702, 47.60, 21574600],
		// [-81, 38.985565, -76.944625, 47.00, 21575400],
		// [-75, 38.985664, -76.944595, 46.20, 21580100],
		// [-81, 38.985687, -76.944557, 46.00, 21580800],
		// [-69, 38.985572, -76.944412, 44.60, 21582300],
		// [-70, 38.985511, -76.944320, 43.90, 21583100],
		// [-76, 38.985488, -76.944335, 44.00, 21583900],
		// [-87, 38.985488, -76.944435, 44.40, 21584600],
		// [-83, 38.985507, -76.944511, 44.10, 21585300],
		// // [-76,38.985607,-76.944534,43.30,21590100],
		// // [-83,38.985694,-76.944541,41.80,21590900],
		// // [-64,38.985786,-76.944549,41.40,21591600],
		// // [-71,38.985893,-76.944564,39.60,21592400],
		// // [-70,38.985969,-76.944534,37.30,21593100],
		// // [-64,38.985973,-76.944458,36.30,21593900],
		// // [-56,38.986015,-76.944435,34.70,21594600],
		// // [-36,38.986022,-76.944419,34.90,21595300]
	 //  ];
	  var cleanData = [];
	  _.each(data, function(d) {
		var upperLimit = 100; // 81 db
		if (d[0] + upperLimit > 0) {
		    // var LinearizedValue = 0.22;
		    var LinearizedValue = (d[0] + upperLimit) /
			  upperLimit;
		} else {
		    var LinearizedValue = 0;
		}
		cleanData.push([d[1], d[2], LinearizedValue]);
		var latlng = [d[1], d[2]];
		// var marker = L.marker(latlng,
		//     {title: "#" + LinearizedValue,
		//     opacity: 0.5} // Adjust the opacity
		//     ).addTo(map);
	  });

	  // Custom Marker for
	 //  var Coordinator = L.icon({
		// iconUrl: 'Coordinator.png',
		// iconSize: [80, 80],
	 //  });
	 //  L.marker(new L.LatLng(38.986022, -76.944419), {
		// icon: Coordinator
	 //  }).addTo(map);

	  // console.log(cleanData);
	  var heat = L.heatLayer(cleanData, {
		radius: 40,
		// gradient: {
		//     0.4: 'HSLA(61, 74%, 60%, 0.01)', 0.65: 'HSLA(8, 70%, 49%, 0.01)', 1: 'HSLA(8, 70%, 49%, 0.05)'
		// }
	  }).addTo(map);
	  // // Zoom to user location
	  // map.locate({ setView: true })

	  // Notes for using included MarkCluster Package
	  // var markers = new L.MarkerClusterGroup();
	  // markers.addLayer(new L.Marker([51.5, -0.09]));
	  // map.addLayer(markers);
    };
}