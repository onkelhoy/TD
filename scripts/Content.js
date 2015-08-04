var jsonText = '{"turrets":[' +
	'{"name": "single cannon", "image_src": "content//turrets/turret2.png", "displayImg_src": "content//turrets/turret2.png",' +
	'"radius": 180, "reloadTime": 42, "bulletSpeed": 5, "bullet_src": "", "damage": 5, "type": 1,' +
	'"info": "A basic turret that has one cannon, does the job done for a low price", "cost": 250},' +
	'{"name": "two way cannon", "image_src": "content//turrets/turret1.png", "displayImg_src": "content//turrets/turret1.png",' +
	'"radius": 250, "reloadTime": 80, "bulletSpeed": 4, "bullet_src": "", "damage": 7, "type": 2,' +
	'"info": "A turret that has two cannons and can shoot a target twice", "cost": 350},' +
	'{"name": "The squid", "image_src": "content//turrets/turret3.png", "displayImg_src": "content//turrets/turret3.png",' +
	'"radius": 360, "reloadTime": 60, "bulletSpeed": 9, "bullet_src": "", "damage": 8, "type": 8,' +
	'"info": "The squid shoots up to eight bullet at once and therefor can hit multible target", "cost": 450},' +

	'{"name": "single cannon", "image_src": "content//turrets/turret5.png", "displayImg_src": "content//turrets/turret5.png",' +
	'"radius": 180, "reloadTime": 42, "bulletSpeed": 5, "bullet_src": "", "damage": 5, "type": 1,' +
	'"info": "A basic turret that has one cannon, does the job done for a low price", "cost": 250},' +
	'{"name": "two way cannon", "image_src": "content//turrets/turret4.png", "displayImg_src": "content//turrets/turret4.png",' +
	'"radius": 250, "reloadTime": 80, "bulletSpeed": 4, "bullet_src": "", "damage": 7, "type": 2,' +
	'"info": "A turret that has two cannons and can shoot a target twice", "cost": 350},' +
	'{"name": "The squid", "image_src": "content//turrets/turret6.png", "displayImg_src": "content//turrets/turret6.png",' +
	'"radius": 360, "reloadTime": 60, "bulletSpeed": 9, "bullet_src": "", "damage": 8, "type": 8,' +
	'"info": "The squid shoots up to eight bullet at once and therefor can hit multible target", "cost": 450},' +

	'{"name": "single cannon", "image_src": "content//turrets/turret2.png", "displayImg_src": "content//turrets/turret8.png",' +
	'"radius": 180, "reloadTime": 42, "bulletSpeed": 5, "bullet_src": "", "damage": 5, "type": 1,' +
	'"info": "A basic turret that has one cannon, does the job done for a low price", "cost": 250},' +
	'{"name": "two way cannon", "image_src": "content//turrets/turret7.png", "displayImg_src": "content//turrets/turret7.png",' +
	'"radius": 250, "reloadTime": 80, "bulletSpeed": 4, "bullet_src": "", "damage": 7, "type": 2,' +
	'"info": "A turret that has two cannons and can shoot a target twice", "cost": 350},' +
	'{"name": "The squid", "image_src": "content//turrets/turret9.png", "displayImg_src": "content//turrets/turret9.png",' +
	'"radius": 360, "reloadTime": 60, "bulletSpeed": 9, "bullet_src": "", "damage": 8, "type": 8,' +
	'"info": "The squid shoots up to eight bullet at once and therefor can hit multible target", "cost": 450}],' +

	'"map1": [{"p": "0-1.5", "d": "1,0"}, {"p": "1.8-1.5", "d": "0,1"},{"p": "1.8-7", "d": "1,0"},{"p": "5-7", "d": "0,-1"}, {"p": "5-4.8", "d": "1,0"},' +
	'{"p": "7-4.8", "d": "0,-1"},{"p": "7-3.3", "d": "-1,0"},{"p": "3.5-3.3", "d": "0,-1"},{"p": "3.5-1.5", "d": "1,0"},{"p": "15-1.5", "d": "0,1"},' +
	'{"p": "15-5.4", "d": "-1,0"},{"p": "11.3-5.4", "d": "0,-1"},{"p": "11.3-2.9", "d": "-1,0"},{"p": "9.3-2.9", "d": "0,1"},{"p": "9.3-7", "d": "1,0"},' +
	'{"p": "12.1-7", "d": "0,1"},{"p": "12.1-8", "d": "0,1"}]}';

	//max distance is 500
	//min reloadtime is 10.. therefor the speed is high when reloadtime is low
	//max damage is 15

	//type = bullet shoot... type 2 is to cannons!
	//bullet_src = ""... no image for bullet.. code will handle it

jsonContent = JSON.parse(jsonText);
var MapPoints = [];
for(var i = 0; i < jsonContent.map1.length; i++){
	var pArr = jsonContent.map1[i].p.split("-");
	var tp = Vector.create(Number(pArr[0]), Number(pArr[1]));
	var p = Vector.create(0, 0);
	p.x = ((window.innerWidth * 4 / 5) / 16) * tp.x;//the width / dimensoin * relativePos
	p.y = ((window.innerHeight * 4 / 5) / 8) * tp.y;

	var dArr = jsonContent.map1[i].d.split(",");
	var d = Vector.create(Number(dArr[0]), Number(dArr[1]));

	var mappoint = MapPoint.create(p, d);
	MapPoints.push(mappoint);
}

console.log(MapPoints);

var turretImages = [];
for(var i = 0; i < jsonContent.turrets.length; i++){
	var img1 = new Image();
	img1.src = jsonContent.turrets[i].image_src;
	console.log("img is loaded!");
	turretImages.push(img1);
}

var land_top = new Image();
var land_side = new Image();
land_top.src = "content//landT.png";
land_side.src = "content//landB.png";
var imgBricks = []; //Rectangles (x, z, w, h)
var landBrick = {
	rectangle: null,
	type: 0,
	create: function(type, rec){
		var obj = Object.create(this);
		obj.rectangle = rec;
		obj.type = type;
		return obj;
	},
	render: function(context){
		context.drawImage((this.type == 0) ? land_top : land_side, this.rectangle.x, this.rectangle.y, this.rectangle.w, this.rectangle.h);
	}
}

function loadMap(){
	var x, y, w, h, imgbrick;
	var index = land_top.width / 2;

	for(var i = 0; i < MapPoints.length - 1; i++){
		if(MapPoints[i].direction.x != 0){
			x = (MapPoints[i].direction.x == 1) ? MapPoints[i].position.x - index : MapPoints[i + 1].position.x - index;
			y = MapPoints[i].position.y - index;
			w = Math.abs(MapPoints[i].position.x - MapPoints[i + 1].position.x) + index * 2;
			w += (MapPoints[i + 1].direction.y == 1 && i != 0 && MapPoints[i - 1].direction.y == 1) ? index * 2 : 0; //a minor fix
			h = index * 2;
			if(i != 0 && MapPoints[i - 1].direction.y == 1){
				x += h;
				w -= h * 2;
			}
			imgbrick = landBrick.create(0, Rectangle.create(x, y, w, h));
		}
		else {
			x = MapPoints[i].position.x - index;
			y = (MapPoints[i].direction.y == 1) ? MapPoints[i].position.y + index : MapPoints[i + 1].position.y - index;
			w = index * 2;
			h = Math.abs(MapPoints[i].position.y - MapPoints[i + 1].position.y) + index * 2;
			if(MapPoints[i].direction.y == 1){
				h -= w;
			}
			imgbrick = landBrick.create(1, Rectangle.create(x, y, w, h));
		}
		imgBricks.push(imgbrick);
	}
}

//some line and circle intersections!

	function isLineIntersecting(p1, p2, p3, p4){
		//line intersection

		var l1dx = (p2.x - p1.x),
			l1dy = (p2.y - p1.y),
			l2dx = (p4.x - p3.x),
			l2dy = (p4.y - p3.y);

		var denominator = l1dx * l2dy - l1dy * l2dx,
			numerator1 =  (p1.y - p3.y) * l2dx - (p1.x - p3.x) * l2dy;
			numerator2 =  (p1.y - p3.y) * l1dx - (p1.x - p3.x) * l1dy;

		//error.. (coincident lines)
		if(denominator == 0) return numerator1 == 0 && numerator2 == 0;

		var r = numerator1 / denominator,
			s = numerator2 / denominator;

		return (r >= 0 && r <= 1) && (s >= 0 && s <= 1); //its intersecting! :D
	}

	function LineCircleIntersection(circle, p1, p2){
		var dx, dy, A, B, C, det, t;
		dx = p2.x - p1.x;
		dy = p2.y - p1.y;

		A = dx * dx + dy * dy;
		B = 2 * (dx * (p1.x - circle.center.x) + dy * (p1.y - circle.center.y));
		C = (p1.x - circle.center.x) * (p1.x - circle.center.x) + (p1.y - circle.center.y) * (p1.y - circle.center.y) - circle.radius * circle.radius;

		delta = B * B - 4 * A * C;

		var a, b, k = 0;

		if((A <= 0.000001) || (det < 0)){
			//no real solution
			// console.log("zero solutions");
			// return [0, null, null];
		}
		else if(delta == 0){
			//one solution
			// console.log("one solutions");
			t = -B / (2 * A);
			var a = Vector.create(p1.x + t * dx, p1.y + t * dy);
			// return[1, a, null];
			k = 1;
		}
		else {
			//two solutions
			// console.log("two solutions");
			t = (-B + Math.sqrt(delta)) / (2 * A);
            var a = Vector.create(p1.x + t * dx, p1.y + t * dy);
            t = (-B - Math.sqrt(delta)) / (2 * A);
            var b = Vector.create(p1.x + t * dx, p1.y + t * dy);
            // return [2, a, b];
            k = 2;
		}
		//return [value1, value2];


		var rotation = (Math.PI / 2) + Math.atan2(p2.y - p1.y, p2.x - p1.x);
		var m = k;
		if(m >= 1){
			var a1 = Vector.create(a.x + Math.cos(rotation) * 20, a.y + Math.sin(rotation) * 20),
				b1 = Vector.create(a.x + Math.cos(rotation) * -20, a.y + Math.sin(rotation) * -20);
		}
		if(m == 2){
			var c1 = Vector.create(b.x + Math.cos(rotation) * 20, b.y + Math.sin(rotation) * 20),
				d1 = Vector.create(b.x + Math.cos(rotation) * -20, b.y + Math.sin(rotation) * -20);
		}

		k = 0;
		if(m >= 1 && isLineIntersecting(a1, b1, p1, p2)) {k++;}
		else {a = null;}
		if(m == 2 && isLineIntersecting(c1, d1, p1, p2)) {k++;}
		else {b = null;}
		

		return [k, a, b];
	}
