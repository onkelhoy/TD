var Vector = {
	x: 0,
	y: 0,
	create: function(x, y){
		var obj = Object.create(this);
		obj.x = x;
		obj.y = y;
		return obj;
	},
	createFrom: function(v2){//well.. i did not know that an obj a = obj b will share values (not a clone)
		var obj = Object.create(this);	//now i know haha... i thought the code was alive or something xP
		obj.x = v2.x;
		obj.y = v2.y;
		return obj;
	},
	addTo: function(v2){
		this.x += v2.x;
		this.y += v2.y;
	},
	Add: function(v2){
		var x = this.x + v2.x;
		var y = this.y + v2.y;
		return Vector.create(x, y);
	},
	subractFrom: function(v2){
		this.x -= v2.x;
		this.y -= v2.y;
	},
	multiply: function(val){
		this.x *= val;
		this.y *= val;
	},
	dictanceTo: function(v2){
		var dx = this.x - v2.x;
		var dy = this.y - v2.y;
		return Math.sqrt(dx * dx + dy * dy);
	},
	getAngle: function(){
		return Math.atan2(this.y, this.x);
	},
	getLenght: function(){
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
	setAngle: function(angle){
		var lenght = this.getLenght();
		this.x = Math.cos(angle) * lenght;
		this.y = Math.sin(angle) * lenght;
	},
	setLenght: function(lenght){
		var angle = this.getAngle();
		this.x = Math.cos(angle) * lenght;
		this.y = Math.sin(angle) * lenght;
	},
	subract: function(v2){
		return Vector.create(this.x - v2.x, this.y - v2.y);
	}
};

var Rectangle = {
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	create: function(x, y, w, h){
		var obj = Object.create(this);
		obj.x = x;
		obj.y = y;
		obj.w = w;
		obj.h = h;
		return obj;
	},
	createByImg: function(x, y, img){
		var obj = Object.create(this);
		obj.x = x;
		obj.y = y;
		obj.w = img.width;
		obj.h = img.height;
		return obj;
	},
	update: function(pos){
		this.x = pos.x;
		this.y = pos.y;
	},
	render: function(context){
		context.fillStyle = "rgb(153, 204, 254)";
		context.rect(this.x, this.y, this.w, this.h);
	},
	top: function(size){
		return Rectangle.create(this.x + size, this.y, this.w - size * 2, size);
	},
	bottom: function(size){
		return Rectangle.create(this.x + size, this.y + this.h - size, this.w - size * 2, size);
	},
	left: function(size){
		return Rectangle.create(this.x, this.y + size, size, this.h - size * 2);
	},
	right: function(size){
		return Rectangle.create(this.x + this.w - size, this.y + size, size, this.h - size * 2);
	},
	intersects: function(r2){
		return this.x >= r2.x && this.x <= r2.x + r2.w && this.y >= this.y && this.y <= r2.y + r2.h;
	}
};

var Circle = {
	center: null,
	radius: 0,
	create: function(c, r){
		var obj = Object.create(this);
		obj.center = c;
		obj.radius = r;
		return obj;
	},
	update: function(pos){
		this.center.x = pos.x + this.radius;
		this.center.y = pos.y + this.radius; //full effect only if its a quadrat!
												//this could be fixed width x_radius & y_radius.. but unnecessary
	},
	circleCollision: function(c2){
		return this.center.dictanceTo(c2.center) <= this.radius + c2.radius;
	},
	pointCollision: function(point){
		return this.center.dictanceTo(point) <= this.radius;
	},
	render: function(context){
		// context.fillStyle = "#70CFF4";
		context.beginPath();
		context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2, false);
		context.stroke();
		context.closePath();
	}
};

var Bullet = {
	position: null,
	velocity: null,
	damage: 0,
	create: function(pos, speed, direction, damage){
		var obj = Object.create(this);
		obj.position = pos;
		obj.damage = damage;
		obj.velocity = Vector.create(0, speed);
		obj.velocity.setAngle(direction);
		return obj;
	},
	update: function(){
		this.position.addTo(this.velocity);
	},
	render: function(context){
		context.beginPath();
		context.fillStyle = "#000";
		context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2, false);
		context.fill();
		context.closePath();
	}
};

var Turret = {
	position: null,
	angle: 0,
	circle: null, //this for click
	lookCircle: null, //this for actual game
	level: 0,
	name: "",
	shootDis: 0, //center
	mode: 0, //0-> first,   1-> middle,   2-> last	(shootAt)
	reloadTime: 0,
	bulletSpeed: 0,
	image: null,
	isClicked: false,
	isDraged: false,
	shoot: false,
	type: 0,
	damage: 0,
	fillcolor: "rgba(0, 0, 255, 0.2)",
	k: 0,

	create: function(position, radius, image, reloadTime, bulletSpeed, name, type, damage){
		var obj = Object.create(this);
		obj.image = image;
		obj.position = position;
		obj.reloadTime = reloadTime;
		obj.bulletSpeed = bulletSpeed;
		obj.name = name;
		obj.circle = Circle.create(position, image.width * 0.75);
		obj.lookCircle = Circle.create(obj.circle.center, radius);
		obj.type = type;
		obj.damage = damage;

		var v = Vector.create(0, obj.circle.radius + 8);
		obj.bulletPos = position + v.setAngle(0);//change to aim angle instead and use the shootdis.. 
		return obj;
	},
	update: function(Targets){

		//bulletpos
		var v = Vector.create(0, this.circle.radius + 8);
		this.bulletPos = this.position + v.setAngle(this.angle);

		var targets = [];
		for(var i = 0; i < Targets.length; i++){
			if(Targets[i].circle.circleCollision(this.lookCircle)){
				targets.push(Targets[i]); //enemie is in sight!
				//console.log("a target is in sight");
			}
		}

		if(targets.length > 0)
		{
			var index = 0;

			switch(this.mode){
				case 0:
					index = 0;
					break;
				case 1:
					index = Math.round(targets.length / 2);
					break;
				case 2:
					index = targets.length - 1;
					break;
			}
			try {//typepf velocity didnt work proparly.. wierd
				var p1 = Vector.createFrom(targets[index].velocity);
				p1.multiply(this.shootDis);
				var pos = Vector.createFrom(targets[index].circle.center); //this will be customizable
				pos.addTo(p1);
				this.angle = Math.atan2(this.circle.center.y - pos.y, this.circle.center.x - pos.x) + Math.PI / 2; //plus möjligtvis vinkel.... (beror på bilden)

				if(this.k >= this.reloadTime){ this.k = 0; this.shoot = true; } else{ this.k++; }
			}catch(e) { }
		}
	},
	drag: function(pos){
		this.position = Vector.create(pos.x - this.circle.radius, pos.y - this.circle.radius);
		this.circle.update(this.position);
	},
	render: function(context){
		context.save();
		context.translate(this.circle.center.x, this.circle.center.y);
		context.rotate(this.angle);
		if(this.isClicked){
			context.beginPath();
			context.fillStyle = this.fillcolor;
			context.arc(0, 0, this.lookCircle.radius, 0, Math.PI * 2, false);
			context.fill();
			context.closePath();
		}
		context.drawImage(this.image, - this.image.width / 2, - this.image.height / 2);
		context.restore();
	}

};


var MapPoint = {
	position: null,
	direction: null,

	create: function(position, direction){
		var obj = Object.create(this);
		obj.position = position;
		obj.direction = direction;

		return obj;
	},
	render: function(context){
		context.beginPath();
		context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
		context.stroke();
		context.closePath();
	}
}

var Enemy = {
	position: null,
	velocity: null,
	mapIndex: 0, //what point it will move towards
	health: 0,
	circle: null,
	image: null,
	MapPoints: [],
	speed: 0,
	hit: false,
	color: "",//temp
	radius: 0,//temp
	//mayby a angle..

	create: function(MapPoints, radius, health, speed){
		var obj = Object.create(this);
		obj.MapPoints = MapPoints.slice(0);//copy the array.. somehow it was the same array before
		obj.position = Vector.createFrom(obj.MapPoints[0].position);
		
		//obj.image = image;
		obj.color = "rgb("+Math.round(150+100*Math.random())+","+Math.round(150+100*Math.random())+","+Math.round(150+100*Math.random())+")";
		obj.radius = radius;
		obj.health = health;
		obj.speed = speed;
		var d = Vector.createFrom(obj.MapPoints[0].direction);
		d.multiply(speed);
		obj.velocity = Vector.create(d.x, d.y);
		obj.circle = Circle.create(Vector.create(obj.position.x - radius, obj.position.y - radius), radius);

		return obj;
	},
	update: function(){
		this.position.addTo(this.velocity);
		this.circle.update(Vector.create(this.position.x - this.circle.radius, this.position.y - this.circle.radius));
													//the next point!
		if(this.position.dictanceTo(this.MapPoints[this.mapIndex + 1].position) <= this.speed){
			if(this.mapIndex + 1 == this.MapPoints.length -1){
				console.log("a enemy made it to the tower!");
				this.hit = true; 
			}
			else {
				this.mapIndex++;
				this.position = Vector.createFrom(this.MapPoints[this.mapIndex].position);//set the pos
				var d = Vector.createFrom(MapPoints[this.mapIndex].direction);//and the direction
				d.multiply(this.speed);
				this.velocity = Vector.create(d.x, d.y);
			}
		}
	},
	render: function(context){
		//context.drawImage(this.image, this.position.x, this.position.y);
		context.beginPath();
		context.fillStyle = this.color;
		context.arc(this.circle.center.x, this.circle.center.y, this.radius, 0, Math.PI * 2);
		context.fill();
		context.closePath();
	}
};
